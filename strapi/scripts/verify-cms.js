const path = require('path');
const { createStrapi } = require('@strapi/strapi');
const dump = (d) => d.map(e => `[${e.locale}] id=${e.id} pub=${!!e.publishedAt} ${e.siteName || e.metaTitle}`).join('\n  ');
(async () => {
  const app = createStrapi({ appDir: path.join(process.cwd()) });
  await app.load();
  for (const uid of ['api::site-config.site-config', 'api::home-page.home-page']) {
    const docs = app.documents(uid);
    const pub = await docs.findMany({ locale: '*', status: 'published', populate: { navItems: true } });
    console.log(`\n== ${uid} — versions publiées:`);
    console.log('  ' + dump(pub));
    // Simule un save CMS: on charge le doc avec ses ids, puis on re-save SANS toucher aux composants
    const pop = uid.includes('site-config') ? { navItems: true } : {};
    for (const locale of ['fr', 'ar']) {
      const [doc] = await docs.findMany({ locale, status: 'draft', populate: pop });
      const data = JSON.parse(JSON.stringify(doc));
      delete data.id; delete data.documentId; delete data.publishedAt; delete data.createdAt; delete data.updatedAt; delete data.locale; delete data.publishedAt;
      const res = await docs.update({ documentId: doc.documentId, locale, data });
      console.log(`  update ${locale} → OK id=${res.id} doc=${res.documentId}`);
    }
    console.log('  ' + dump(await docs.findMany({ locale: '*', status: 'draft', populate: { navItems: true } })));
  }
  await app.destroy();
})();
