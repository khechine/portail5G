const path = require('path');
const { createStrapi } = require('@strapi/strapi');
(async () => {
  const app = createStrapi({ appDir: path.join(process.cwd()) });
  try {
    await app.load();
    const uid = 'api::site-config.site-config';
    const docs = app.documents(uid);
    // tj84 = document servi publiquement en FR (cmp ids 109-113)
    // i0of = autre document FR (cmp ids 163-167)
    // On simule le save CMS: mettre à jour tj84 avec des navItems dont les ids viennent de l'AUTRE document
    const data = {
      siteName: 'TOPNET Box 5G',
      navItems: [
        { id: 163, __component: 'shared.link', label: 'Accueil', url: '#accueil' },
        { id: 110, __component: 'shared.link', label: 'À propos', url: '#apropos' },
      ],
    };
    await docs.update({ documentId: 'tj84qeyv9waju3xcf281g2vq', locale: 'fr', data });
    console.log('UPDATE OK (pas d\'erreur)');
  } catch (e) {
    console.log('== ERREUR REPRODUITE ==');
    console.log('message:', e.message);
    if (e.status) console.log('status:', e.status);
  } finally {
    await app.destroy();
  }
})();
