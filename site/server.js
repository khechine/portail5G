'use strict';

const path = require('path');
const express = require('express');
const { getSiteConfig, getHomePage, mediaUrl, STRAPI_URL } = require('./lib/strapi');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const LOCALES = { fr: { dir: 'ltr', path: '/' }, ar: { dir: 'rtl', path: '/ar' } };

// Helpers exposés aux templates
const locals = (req, res, next) => {
  res.locals.mediaUrl = mediaUrl;
  res.locals.nl2br = (t) => String(t || '').replace(/\n/g, '<br>');
  res.locals.otherLocale = (locale) => (locale === 'fr' ? { code: 'ar', path: '/ar' } : { code: 'fr', path: '/' });
  res.locals.stars = (n) => {
    const v = Math.max(0, Math.min(5, Number(n) || 0));
    return { full: v, empty: 5 - v };
  };
  res.locals.esc = (t) =>
    String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  res.locals.cssval = (v, d) => String(v || d).replace(/[^#a-zA-Z0-9,\s-]/g, '');
  res.locals.fontname = (v, d) => String(v || d).replace(/[^a-zA-Z0-9\s-]/g, '');
  next();
};
app.use(locals);

async function loadPage(req, res, next) {
  const locale = req.locale;
  try {
    const config = await getSiteConfig(locale);
    const home = await getHomePage(locale);
    res.locals.config = config.data || {};
    res.locals.home = home.data || {};
    res.locals.locale = locale;
    res.locals.dir = req.dir;
    res.locals.sitePath = req.basePath;
    next();
  } catch (err) {
    console.error(`Erreur chargement contenu [${locale}] :`, err.message);
    res.status(503).send('Contenu indisponible. Vérifiez que Strapi est démarré et que le seed a été exécuté.');
  }
}

app.get('/ar', (req, res, next) => {
  req.locale = 'ar';
  req.dir = 'rtl';
  req.basePath = '/ar';
  next();
}, loadPage, (req, res) => {
  res.render('index', { title: (res.locals.home?.metaTitle || res.locals.config?.siteName) });
});

app.get('/fr', (req, res) => res.redirect(301, '/'));

app.get('/', (req, res, next) => {
  req.locale = 'fr';
  req.dir = 'ltr';
  req.basePath = '';
  next();
}, loadPage, (req, res) => {
  res.render('index', { title: res.locals.home?.metaTitle || res.locals.config?.siteName });
});

// Réception du formulaire de commande → Strapi (api::lead.lead.create)
app.post('/api/order', async (req, res) => {
  const b = req.body || {};
  const payload = {
    firstname: String(b.firstname || '').trim(),
    lastname: String(b.lastname || '').trim(),
    phone: String(b.phone || '').trim(),
    governorate: String(b.governorate || '').trim(),
    address: String(b.address || '').trim(),
    existingSubscriber: String(b.existingSubscriber || '').trim(),
    plan: String(b.plan || '').trim(),
    locale: b.locale === 'ar' ? 'ar' : 'fr',
  };
  if (!payload.firstname || !payload.phone || !payload.governorate || !payload.plan) {
    return res.status(400).json({ ok: false, error: 'required' });
  }
  try {
    const r = await fetch(`${STRAPI_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload }),
    });
    if (!r.ok) throw new Error(`Strapi ${r.status}`);
    return res.json({ ok: true });
  } catch (err) {
    console.error('lead create failed:', err.message);
    return res.status(502).json({ ok: false, error: 'strapi' });
  }
});

// Newsletter → même traitement que lead (type de demande)
app.post('/api/newsletter', async (req, res) => {
  const email = String((req.body || {}).email || '').trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'email' });
  }
  try {
    const r = await fetch(`${STRAPI_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { firstname: 'Newsletter', phone: '-', governorate: '-', plan: 'Newsletter', address: email, locale: (req.body.locale || 'fr') } }),
    });
    if (!r.ok) throw new Error(`Strapi ${r.status}`);
    return res.json({ ok: true });
  } catch (err) {
    console.error('newsletter failed:', err.message);
    return res.status(502).json({ ok: false, error: 'strapi' });
  }
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\n');
});

app.listen(PORT, () => {
  console.log(`Topnet Box 5G site démarré sur http://localhost:${PORT} (FR: / | AR: /ar)`);
});
