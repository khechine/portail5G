const path = require('path');
const { createStrapi } = require('@strapi/strapi');
(async () => {
  const app = createStrapi({ appDir: path.join(process.cwd()) });
  try {
    await app.load();
    const uid = 'api::site-config.site-config';
    const docs = app.documents(uid);
    const FR = { siteName: 'FR-site', navItems: [
      { label: 'Accueil', url: '#accueil' }, { label: 'À propos', url: '#apropos' }, { label: 'Offres', url: '#offres' },
    ]};
    const AR = { siteName: 'AR-site', navItems: [
      { label: 'الرئيسية', url: '#accueil' }, { label: 'من نحن', url: '#apropos' },
    ]};
    // 1. supprime tout
    const all = await docs.findMany();
    for (const d of all) await docs.delete({ documentId: d.documentId, locale: '*' });
    // 2. crée fr
    const frDoc = await docs.create({ locale: 'fr', data: FR });
    console.log('créé fr documentId:', frDoc.documentId, 'entity id:', frDoc.id);
    // 3. ajoute ar
    const arDoc = await docs.update({ documentId: frDoc.documentId, locale: 'ar', data: AR });
    console.log('créé ar documentId:', arDoc.documentId, 'entity id:', arDoc.id);
    // 4. dump
    const dump = async (locale) => {
      const [d] = await docs.findMany({ locale, status: 'draft', populate: { navItems: true } });
      console.log(`  [${locale}] id=${d.id} siteName=${d.siteName} navItems=${JSON.stringify((d.navItems||[]).map(n=>n.label))}`);
    };
    await dump('fr');
    await dump('ar');
  } catch (e) {
    console.log('ERREUR:', e.message);
    if (e.stack) console.log(e.stack.split('\n').slice(0,6).join('\n'));
  } finally {
    await app.destroy();
  }
})();
