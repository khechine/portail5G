const path = require('path');
const { createStrapi } = require('@strapi/strapi');
(async () => {
  const app = createStrapi({ appDir: path.join(process.cwd()) });
  await app.load();
  const uid = 'api::home-page.home-page';
  const docs = app.documents(uid);
  const pop = ['hero','hero.slides','hero.slides.image','trust','trust.items','about','about.image','about.features','services','services.items','services.items.features','plans','plans.groups','plans.groups.cards','plans.groups.cards.image','plans.groups.cards.features','specs','specs.image','specs.rows','steps','steps.steps','faq','faq.items','testimonials','testimonials.items','testimonials.items.avatar','news','news.items','news.items.image','cta','cta.background','order','order.governorates','newsletter'];
  for (const locale of ['fr', 'ar']) {
    const [doc] = await docs.findMany({ locale, status: 'draft', populate: pop });
    const data = JSON.parse(JSON.stringify(doc));
    delete data.id; delete data.documentId; delete data.publishedAt; delete data.createdAt; delete data.updatedAt; delete data.locale;
    const res = await docs.update({ documentId: doc.documentId, locale, data });
    console.log(`update ${locale} → OK id=${res.id}`);
  }
  for (const locale of ['fr', 'ar']) {
    const [d] = await docs.findMany({ locale, status: 'draft', populate: ['hero','hero.slides','plans','plans.groups','plans.groups.cards'] });
    console.log(`  [${locale}] hero=${JSON.stringify((d.hero?.slides||[]).map(s=>s.title))}`);
    console.log(`          plans=${JSON.stringify((d.plans?.groups||[]).map(g=>g.cards?.map(c=>c.name)))}`);
  }
  await app.destroy();
})();
