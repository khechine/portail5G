const path = require('path');
const { createStrapi } = require('@strapi/strapi');
(async () => {
  const app = createStrapi({ appDir: path.join(process.cwd()) });
  try {
    await app.load();
    const uid = 'api::site-config.site-config';
    const docs = app.documents(uid);
    const AR = { siteName: 'توبنيت بوكس 5G', navItems: [
      { label: 'الرئيسية', url: '#accueil' }, { label: 'من نحن', url: '#apropos' },
    ]};
    // Simule exactement le findOne de l'update AR
    const entry = await app.db.query(uid).findOne({ where: { locale: 'ar', documentId: 'tj84qeyv9waju3xcf281g2vq' } });
    console.log('findOne locale=ar -> entity id:', entry && entry.id, 'locale:', entry && entry.locale);
    const before = await app.db.query(uid).findMany({ where: { documentId: 'tj84qeyv9waju3xcf281g2vq' }, select: ['id', 'locale'] });
    console.log('entrées du document avant update:', JSON.stringify(before));
    const doc = await docs.update({ documentId: 'tj84qeyv9waju3xcf281g2vq', locale: 'ar', data: AR });
    console.log('update ar terminé, retour locale:', doc.locale);
    const after = await app.db.query(uid).findMany({ where: { documentId: 'tj84qeyv9waju3xcf281g2vq' }, select: ['id', 'locale'] });
    console.log('entrées du document après update:', JSON.stringify(after));
  } catch (e) {
    console.log('ERREUR:', e.message);
  } finally {
    await app.destroy();
  }
})();
