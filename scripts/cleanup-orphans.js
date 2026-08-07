const path = require('path');
const { createStrapi } = require('@strapi/strapi');
(async () => {
  const app = createStrapi({ appDir: path.join(process.cwd()) });
  try {
    await app.load();
    const targets = [
      ['api::site-config.site-config', 'i0ofexawqh25i1meq0p0q2m1'],
      ['api::home-page.home-page', 'k1pfqal4l8nljm68vcie0647'],
    ];
    for (const [uid, documentId] of targets) {
      const res = await app.documents(uid).delete({ documentId, locale: '*' });
      console.log(`supprimé ${uid} ${documentId}:`, res.entries.length, 'entrées');
    }
  } catch (e) {
    console.error('Erreur:', e.message);
    process.exitCode = 1;
  } finally {
    await app.destroy();
  }
})();
