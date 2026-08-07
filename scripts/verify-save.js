const path = require('path');
const { createStrapi } = require('@strapi/strapi');
(async () => {
  const app = createStrapi({ appDir: path.join(process.cwd()) });
  try {
    await app.load();
    const docs = app.documents('api::site-config.site-config');
    for (const locale of ['fr', 'ar']) {
      // Charge comme le CMS (populate des composants répétables)
      const [loaded] = await docs.findMany({
        locale, status: 'draft',
        populate: { navItems: true, socials: true, footerColumns: { populate: ['links'] }, legalLinks: true },
      });
      // Cible du save = première ligne en base
      const row = await app.db.query('api::site-config.site-config').findOne({ select: ['documentId'] });
      const data = {
        siteName: loaded.siteName,
        navItems: (loaded.navItems || []).map((c) => ({ id: c.id, __component: c.__component, label: c.label, url: c.url })),
        socials: (loaded.socials || []).map((c) => ({ id: c.id, __component: c.__component, label: c.label, url: c.url })),
      };
      console.log(`[${locale}] éditeur=${loaded.documentId} cible=${row.documentId} navItems ids=${(loaded.navItems||[]).map(n=>n.id).join(',')}`);
      const saved = await docs.update({ documentId: row.documentId, locale, data });
      console.log(`  -> UPDATE OK, navItems après save: ${(saved.navItems||[]).map(n=>n.id).join(',')}`);
    }
  } catch (e) {
    console.log('== ERREUR ==', e.message);
    if (e.stack) console.log(e.stack.split('\n').slice(0,6).join('\n'));
    process.exitCode = 1;
  } finally {
    await app.destroy();
  }
})();
