#!/usr/bin/env node
/**
 * Script de seed : initialise l'admin, les locales, les permissions,
 * téléverse les images de démonstration et crée le contenu FR + AR
 * pour la landing page Topnet Box 5G.
 *
 * Usage :
 *   npm run seed
 *
 * Variables d'environnement (optionnelles) :
 *   STRAPI_URL            (défaut http://127.0.0.1:1337)
 *   SEED_ADMIN_EMAIL      (défaut admin@topnet.tn)
 *   SEED_ADMIN_PASSWORD   (défaut Topnet2026!)
 *   SEED_ADMIN_USERNAME   (défaut admin)
 */
const fs = require('fs');
const path = require('path');

const { createStrapi } = require('@strapi/strapi');

const EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@topnet.tn';
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Topnet2026!';
const FIRSTNAME = 'Topnet';
const LASTNAME = 'Admin';

const ASSETS_DIR = path.join(__dirname, 'assets');

const log = (...a) => console.log(...a);
const err = (...a) => console.error(...a);

async function ensureAdmin(app) {
  const userSvc = app.admin.services.user;
  if (await userSvc.exists({ email: EMAIL })) {
    log('👤 Compte administrateur déjà présent');
    return;
  }
  try {
    await userSvc.createFirstAdmin({
      email: EMAIL,
      password: PASSWORD,
      firstname: FIRSTNAME,
      lastname: LASTNAME,
    });
    log('👤 Compte administrateur créé');
  } catch (e) {
    log(`⚠️ Création admin ignorée (${e.message}) — créez-le via /admin`);
  }
}

async function ensureLocales(app) {
  const localesSvc = app.plugin('i18n').service('locales');
  const existing = (await localesSvc.find()).map((l) => l.code);
  for (const code of ['fr', 'ar']) {
    if (existing.includes(code)) continue;
    await localesSvc.create({ code, name: code === 'fr' ? 'Français (FR)' : 'العربية (AR)' });
    log(`✅ Locale ${code} créée`);
  }
  const all = await localesSvc.find();
  const fr = all.find((l) => l.code === 'fr');
  if (fr && !fr.isDefault) {
    try {
      await localesSvc.setDefaultLocale(fr);
      log('✅ Locale par défaut : fr');
    } catch (e) {
      /* non bloquant */
    }
  }
}

async function uploadAssets(app) {
  log('🖼️ Téléversement des images...');
  const uploadSvc = app.plugin('upload').services.upload;
  const existingFiles = await uploadSvc.findMany({ limit: 10000 });
  const refs = {};

  const names = fs.readdirSync(ASSETS_DIR).filter((f) => /\.(svg|png|jpg|jpeg|webp)$/i.test(f));
  for (const name of names) {
    const prev = (existingFiles || []).find((f) => f.name === name);
    if (prev) {
      refs[name] = prev;
      continue;
    }
    const filePath = path.join(ASSETS_DIR, name);
    const stat = fs.statSync(filePath);
    const mimetype = name.endsWith('.svg')
      ? 'image/svg+xml'
      : name.endsWith('.png')
        ? 'image/png'
        : name.endsWith('.webp')
          ? 'image/webp'
          : 'image/jpeg';
    const [uploaded] = await uploadSvc.upload({
      data: { fileInfo: { name } },
      files: [
        {
          originalFilename: name,
          size: stat.size,
          mimetype,
          filepath: filePath,
        },
      ],
    });
    if (!uploaded?.id) {
      err('upload échoué', name);
      continue;
    }
    refs[name] = uploaded;
    log(`  ✓ ${name}`);
  }
  log('✅ Images prêtes');
  return refs;
}

async function upsertDocument(app, uid, entries, { publish: shouldPublish } = {}) {
  const docs = app.documents(uid);
  const all = await docs.findMany();
  const [canonical, ...extras] = all;
  for (const extra of extras) {
    log(`  ✗ suppression document orphelin (${uid}) : ${extra.documentId}`);
    await docs.delete({ documentId: extra.documentId, locale: '*' });
  }
  let doc;
  let created = !canonical;
  for (const [locale, data] of entries) {
    if (canonical) {
      doc = await docs.update({ documentId: canonical.documentId, locale, data });
    } else {
      doc = await docs.create({ locale, data });
      canonical = { documentId: doc.documentId };
    }
    if (shouldPublish && doc?.documentId) {
      await docs.publish({ documentId: doc.documentId, locale });
    }
  }
  return { doc, created };
}

// ───────────────────────────────────────────────
// Contenu
// ───────────────────────────────────────────────

const buildRefs = (refs) => {
  const img = (name) => (refs[name] ? { id: refs[name].id } : null);
  return img;
};

const siteConfigFR = (img) => ({
  siteName: 'TOPNET Box 5G',
  logo: img('topnet.png'),
  favicon: img('favicon.svg'),
  primaryColor: '#FFA502',
  primaryDark: '#e08e00',
  phone: '71 001 298',
  email: 'contact@topnet.tn',
  address: 'Boulevard de la Terre, Centre Urbain Nord, Tunis',
  topbarLeft: 'Service client 7j/7 — 71 001 298',
  navItems: [
    { label: 'Accueil', url: '#accueil' },
    { label: 'À propos', url: '#apropos' },
    { label: 'Offres', url: '#offres' },
    { label: 'FAQ', url: '#faq' },
    { label: 'Contact', url: '#commander' },
  ],
  ctaLabel: 'Commandez',
  ctaUrl: '#commander',
  langLabel: 'العربية',
  footerAbout:
    "Leader des fournisseurs d'accès Internet en Tunisie depuis 2001. Plus de 200 000 abonnés, 12 agences nationales.",
  socials: [
    { label: 'facebook', url: 'https://www.facebook.com/topnet' },
    { label: 'twitter', url: 'https://x.com/topnet' },
    { label: 'instagram', url: 'https://www.instagram.com/topnet' },
    { label: 'youtube', url: 'https://www.youtube.com/@topnet' },
  ],
  footerColumns: [
    {
      title: 'Offres',
      links: [
        { label: 'Box 5G', url: '#offres' },
        { label: 'ADSL Résidentiel', url: '#' },
        { label: 'Smart Fibre', url: '#' },
        { label: 'Topnet Mobile', url: '#' },
        { label: 'Entreprises', url: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: "Centre d'aide", url: '#' },
        { label: "Vérifier l'éligibilité", url: '#' },
        { label: 'Espace client', url: '#' },
        { label: 'Trouver une agence', url: '#' },
        { label: '71 001 298', url: 'tel:71001298' },
      ],
    },
    {
      title: 'Topnet',
      links: [
        { label: 'À propos', url: '#' },
        { label: 'Actualités', url: '#' },
        { label: 'Recrutement', url: '#' },
        { label: 'Partenaires', url: '#' },
        { label: 'Mentions légales', url: '#' },
      ],
    },
  ],
  copyright: '© 2026 Topnet S.A. — Tous droits réservés.',
  legalLinks: [
    { label: 'Confidentialité', url: '#' },
    { label: 'CGU', url: '#' },
    { label: 'Cookies', url: '#' },
  ],
});

const siteConfigAR = (img) => ({
  siteName: 'توبنيت بوكس 5G',
  logo: img('topnet.png'),
  favicon: img('favicon.svg'),
  primaryColor: '#FFA502',
  primaryDark: '#e08e00',
  phone: '71 001 298',
  email: 'contact@topnet.tn',
  address: 'شارع الأرض، المركز الحضري الشمالي، تونس',
  topbarLeft: 'خدمة العملاء 7/7 — 71 001 298',
  navItems: [
    { label: 'الرئيسية', url: '#accueil' },
    { label: 'من نحن', url: '#apropos' },
    { label: 'العروض', url: '#offres' },
    { label: 'الأسئلة الشائعة', url: '#faq' },
    { label: 'اتصل بنا', url: '#commander' },
  ],
  ctaLabel: 'اطلب الآن',
  ctaUrl: '#commander',
  langLabel: 'Français',
  footerAbout:
    'الرائدة في خدمات الإنترنت في تونس منذ 2001. أكثر من 200,000 مشترك و12 وكالة في كامل أنحاء البلاد.',
  socials: [
    { label: 'facebook', url: 'https://www.facebook.com/topnet' },
    { label: 'twitter', url: 'https://x.com/topnet' },
    { label: 'instagram', url: 'https://www.instagram.com/topnet' },
    { label: 'youtube', url: 'https://www.youtube.com/@topnet' },
  ],
  footerColumns: [
    {
      title: 'العروض',
      links: [
        { label: 'بوكس 5G', url: '#offres' },
        { label: 'أدسل المنزلي', url: '#' },
        { label: 'سمارت فايبر', url: '#' },
        { label: 'توبنيت موبايل', url: '#' },
        { label: 'الشركات', url: '#' },
      ],
    },
    {
      title: 'الدعم',
      links: [
        { label: 'مركز المساعدة', url: '#' },
        { label: 'تحقق من التغطية', url: '#' },
        { label: 'فضاء العميل', url: '#' },
        { label: 'ابحث عن وكالة', url: '#' },
        { label: '71 001 298', url: 'tel:71001298' },
      ],
    },
    {
      title: 'توبنيت',
      links: [
        { label: 'من نحن', url: '#' },
        { label: 'الأخبار', url: '#' },
        { label: 'التوظيف', url: '#' },
        { label: 'الشركاء', url: '#' },
        { label: 'البنود القانونية', url: '#' },
      ],
    },
  ],
  copyright: '© 2026 توبنيت S.A. — جميع الحقوق محفوظة.',
  legalLinks: [
    { label: 'الخصوصية', url: '#' },
    { label: 'الشروط العامة', url: '#' },
    { label: 'ملفات الارتباط', url: '#' },
  ],
});

const GOVERNORATES_FR = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte', 'Béja',
  'Jendouba', 'Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan',
  'Kasserine', 'Sidi Bouzid', 'Gabès', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili',
];

const GOVERNORATES_AR = [
  'تونس', 'أريانة', 'بن عروس', 'منوبة', 'نابل', 'زغوان', 'بنزرت', 'باجة',
  'جندوبة', 'الكاف', 'سليانة', 'سوسة', 'المنستير', 'المهدية', 'صفاقس', 'القيروان',
  'القصرين', 'سيدي بوزيد', 'قابس', 'مدنين', 'تطاوين', 'قفصة', 'توزر', 'قبلي',
];

const planCard = (speed, unit, price, title, badge, recommended, perks, image, period = '/ mois · 24 mois') => ({
  speed,
  speedUnit: unit,
  speedLabel: 'Débit descendant',
  title,
  price,
  currency: 'DT',
  period,
  badge,
  recommended,
  image,
  features: perks.map((text) => ({ text })),
  buttonLabel: 'Commander',
  buttonUrl: '#commander',
});

const homePageFR = (img) => ({
  metaTitle: 'TOPNET Box 5G — Internet ultra-rapide sans fil',
  metaDescription:
    "Commandez la Box 5G TOPNET : installation en 1 minute, Wi-Fi 6, débits jusqu'à 100 Mbps. Réseau hybride 5G + 4G. Livraison partout en Tunisie.",
  hero: {
    enabled: true,
    slides: [
      {
        image: img('hero-1.jpg'),
        badge: 'Nouveau — Disponible maintenant',
        title: 'BOX 5G TOPNET\nPlug. Play.',
        titleHighlight: 'Profitez.',
        text: "La TOPNET Box 5G : aucun technicien, aucun câble. Branchez, connectez-vous et profitez d'un débit ultrarapide jusqu'à 100 Mbps — dès la première minute.",
        btnPrimaryLabel: 'Commandez maintenant',
        btnPrimaryUrl: '#commander',
        btnSecondaryLabel: 'Voir les tarifs',
        btnSecondaryUrl: '#offres',
      },
      {
        image: img('hero-2.jpg'),
        badge: 'Réseau hybride 5G + 4G',
        title: 'Une connexion\nsans limite',
        titleHighlight: 'Partout en Tunisie.',
        text: 'La couverture 5G et le basculement automatique vers la 4G garantissent une connexion stable, même loin de la fibre.',
        btnPrimaryLabel: 'Découvrir les offres',
        btnPrimaryUrl: '#offres',
        btnSecondaryLabel: 'Assistance',
        btnSecondaryUrl: '#faq',
      },
      {
        image: img('hero-3.jpg'),
        badge: 'Wi-Fi 6 bi-bande',
        title: 'Jusqu’à 1.2 Gbps\nen Wi-Fi 6',
        titleHighlight: 'Rapide & fluide.',
        text: 'La Box D-Link DWR-2000M offre un Wi-Fi 6 bi-bande pour streamer, jouer et télétravailler en toute fluidité.',
        btnPrimaryLabel: 'Commandez maintenant',
        btnPrimaryUrl: '#commander',
        btnSecondaryLabel: 'Fiche technique',
        btnSecondaryUrl: '#specs',
      },
    ],
  },
  trust: {
    enabled: true,
    items: [
      { value: '5G + 4G', label: 'Réseau hybride' },
      { value: 'Wi-Fi 6', label: 'Bi-bande' },
      { value: '1 min', label: 'Installation' },
      { value: 'Box offerte', label: "Durée d'abonnement" },
      { value: '24/7', label: 'Support client' },
    ],
  },
  about: {
    enabled: true,
    tagline: 'À propos de la Box 5G',
    title: 'Internet ultra-rapide',
    titleHighlight: 'sans fibre, sans technicien.',
    text: 'La TOPNET Box 5G transforme le réseau mobile en internet domestique. Branchez la micro-SIM, connectez vos appareils en Wi-Fi 6 et profitez d’un débit descendant jusqu’à 100 Mbps, avec basculement automatique 4G/5G.',
    image: img('about.jpg'),
    features: [
      { text: 'Super-fast dongle 5G' },
      { text: 'Wi-Fi 6 haute vitesse' },
      { text: 'SIM prépayée incluse' },
      { text: 'Mises à jour 5G incluses' },
    ],
    buttonLabel: 'Plus sur la Box',
    buttonUrl: '#specs',
  },
  services: {
    enabled: true,
    tagline: 'Nos offres',
    title: 'Une Box pour tous',
    titleHighlight: 'vos usages',
    subtitle: 'Famille, télétravail, gaming ou streaming : trouvez la Box 5G adaptée.',
    items: [
      {
        icon: '📶',
        title: 'Internet résidentiel',
        description: "Le remplaçant idéal de l'ADSL pour toute la famille.",
        features: [
          { text: 'Usage quotidien' },
          { text: 'EasyMesh inclus' },
          { text: 'Box offerte' },
        ],
      },
      {
        icon: '💼',
        title: 'Télétravail & Gaming',
        description: 'Connexion stable pour la visioconférence, le cloud et le jeu en ligne.',
        features: [
          { text: '4K & streaming' },
          { text: 'Latence réduite' },
          { text: 'Wi-Fi 6' },
        ],
      },
      {
        icon: '🛰️',
        title: 'Couverture étendue',
        description: '5G en zone couverte, basculement automatique en 4G partout ailleurs.',
        features: [
          { text: 'Réseau hybride' },
          { text: 'Débit jusqu’à 100 Mbps' },
          { text: 'Mobilité' },
        ],
      },
    ],
  },
  plans: {
    enabled: true,
    tagline: 'Nos tarifs',
    title: 'Choisissez votre',
    titleHighlight: 'offre 5G',
    subtitle: 'Box offerte, installation gratuite et engagement de 24 mois.',
    groups: [
      {
        name: '30M',
        cards: [
          planCard('30', 'M', '55.9', 'Usage quotidien', '', false, [
            'Wi-Fi 6 bi-bande',
            'Box D-Link offerte',
            'Usage quotidien',
          ], img('plan-1.jpg')),
          planCard('30', 'M', '65.9', 'Famille connectée', '⭐ Populaire', true, [
            'Wi-Fi 6 bi-bande',
            'EasyMesh inclus',
            'Support prioritaire',
          ], img('plan-1.jpg'), '/ mois · 12 mois'),
          planCard('30', 'M', '75.9', 'Sans engagement', '', false, [
            'Wi-Fi 6 bi-bande',
            'Box offerte',
            'Résiliable à tout moment',
          ], img('plan-1.jpg'), '/ mois · Sans engagement'),
        ],
      },
      {
        name: '50M',
        cards: [
          planCard('50', 'M', '69.9', 'Famille connectée', '⭐ Recommandé', true, [
            'Wi-Fi 6 bi-bande',
            'EasyMesh inclus',
            'Famille connectée',
          ], img('plan-2.jpg')),
          planCard('50', 'M', '79.9', 'Télétravail', '', false, [
            'Wi-Fi 6 bi-bande',
            'EasyMesh inclus',
            'Support prioritaire',
          ], img('plan-2.jpg'), '/ mois · 12 mois'),
          planCard('50', 'M', '89.9', 'Sans engagement', '', false, [
            'Wi-Fi 6 bi-bande',
            'Box offerte',
            'Résiliable à tout moment',
          ], img('plan-2.jpg'), '/ mois · Sans engagement'),
        ],
      },
      {
        name: '100M',
        cards: [
          planCard('100', 'M', '110.9', 'Power User', '', false, [
            'Wi-Fi 6 bi-bande',
            '4K, gaming & télétravail',
            'EasyMesh inclus',
          ], img('plan-3.jpg')),
          planCard('100', 'M', '120.9', 'Ultra', '⭐ Premium', true, [
            'Wi-Fi 6 bi-bande',
            'Débit maximum',
            'Support VIP',
          ], img('plan-3.jpg'), '/ mois · 12 mois'),
          planCard('100', 'M', '135.9', 'Sans engagement', '', false, [
            'Wi-Fi 6 bi-bande',
            '4K, gaming & télétravail',
            'Résiliable à tout moment',
          ], img('plan-3.jpg'), '/ mois · Sans engagement'),
        ],
      },
    ],
    note: 'Offres valables dans la limite des stocks et de la couverture. Frais de mise en service offerts.',
  },
  specs: {
    enabled: true,
    tagline: 'Fiche technique',
    title: 'D-Link',
    titleHighlight: 'DWR-2000M',
    image: img('box-5g.jpg'),
    rows: [
      { label: 'Réseau', value: '5G / 4G / LTE', highlight: true },
      { label: 'Standard Wi-Fi', value: 'Wi-Fi 6 (802.11ax)', highlight: false },
      { label: 'Débit 5 GHz', value: 'Jusqu’à 1.2 Gbps', highlight: true },
      { label: 'Débit 2.4 GHz', value: '574 Mbps', highlight: false },
      { label: 'Utilisateurs simultanés', value: '512 (MU-MIMO)', highlight: false },
      { label: 'Ports', value: '1× LAN + 1× WAN/LAN Gigabit', highlight: false },
      { label: 'Sécurité', value: 'WPA3, 128 bits', highlight: false },
      { label: 'RAM', value: '1 Go', highlight: false },
      { label: 'Protocole mesh', value: 'EasyMesh', highlight: false },
      { label: 'IPv6', value: 'Supporté', highlight: false },
    ],
  },
  steps: {
    enabled: true,
    tagline: 'Mise en marche',
    title: 'Connecté en',
    titleHighlight: '3 étapes',
    steps: [
      {
        title: 'Insérez la micro-SIM',
        description: 'Placez la carte SIM fournie dans le logement dédié au dos de la Box.',
      },
      {
        title: "Branchez l'alimentation",
        description: "Reliez l'adaptateur à une prise murale. Initialisation en ~45 secondes.",
      },
      {
        title: 'Connectez-vous au Wi-Fi',
        description: "SSID et mot de passe sur l'étiquette sous la Box. C'est tout.",
      },
    ],
    helpTitle: "Besoin d'aide ?",
    helpText: 'Appelez le 71 001 298 — disponible 7j/7, ou visitez l’Espace Topnet le plus proche.',
  },
  faq: {
    enabled: true,
    tagline: 'FAQ',
    title: 'Questions',
    titleHighlight: 'fréquentes',
    items: [
      {
        question: 'La Box 5G nécessite-t-elle une ligne ADSL ?',
        answer:
          'Non. La Box 5G fonctionne uniquement via le réseau mobile (5G/4G). Il suffit d’insérer la carte SIM fournie et de la brancher.',
      },
      {
        question: 'Que faire si la 5G n’est pas disponible chez moi ?',
        answer:
          'La Box bascule automatiquement sur le réseau 4G/LTE. Vous restez connecté, avec des débits pouvant atteindre 100 Mbps.',
      },
      {
        question: 'Combien d’appareils puis-je connecter ?',
        answer:
          'Jusqu’à 512 appareils simultanés grâce au Wi-Fi 6 et au MU-MIMO. Idéal pour une maison très connectée.',
      },
      {
        question: 'La Box est-elle offerte ?',
        answer:
          'Oui, la Box D-Link DWR-2000M est offerte pour toute souscription avec engagement de 24 mois.',
      },
      {
        question: 'Comment suivre ma consommation ?',
        answer:
          'Via votre Espace client Topnet et l’application mobile, où vous pouvez consulter votre débit et votre data en temps réel.',
      },
      {
        question: 'Puis-je annuler mon abonnement ?',
        answer:
          'Oui, selon la formule choisie. Les offres sans engagement peuvent être résiliées à tout moment sans frais.',
      },
    ],
  },
  testimonials: {
    enabled: true,
    tagline: 'Avis clients',
    title: 'Ce que disent',
    titleHighlight: 'nos clients',
    items: [
      {
        quote:
          'Installé en 5 minutes chez moi à Sousse. Le Wi-Fi 6 couvre toute la maison, même le jardin.',
        author: 'Sami A.',
        role: 'Abonné Box 5G 50M',
        avatar: img('avatar-1.jpg'),
        rating: 5,
      },
      {
        quote:
          "Fini l'ADSL coupé les jours de pluie. Streaming 4K sans aucune coupure depuis trois mois.",
        author: 'Mehdi B.',
        role: 'Abonné Box 5G 100M',
        avatar: img('avatar-2.jpg'),
        rating: 5,
      },
      {
        quote:
          "J'ai remplacé ma fibre en arrivant à Tunis. Installation simple et support très réactif.",
        author: 'Lamia T.',
        role: 'Abonnée Box 5G 30M',
        avatar: img('avatar-3.jpg'),
        rating: 4,
      },
    ],
  },
  news: {
    enabled: true,
    tagline: 'Actualités',
    title: 'Nos dernières',
    titleHighlight: 'nouvelles',
    items: [
      {
        image: img('news-1.jpg'),
        title: 'Topnet étend son réseau 5G à 8 nouveaux gouvernorats',
        excerpt:
          "La couverture 5G continue de s'étendre à travers le pays. Vérifiez l'éligibilité dans votre zone.",
        date: '12 Jan 2026',
        link: '#',
      },
      {
        image: img('news-2.jpg'),
        title: 'La Box 5G TOPNET primée meilleur équipement fixe sans fil 2026',
        excerpt:
          "Récompensée pour son autonomie, sa rapidité d'installation et son Wi-Fi 6.",
        date: '28 Fév 2026',
        link: '#',
      },
      {
        image: img('news-3.jpg'),
        title: 'Offre de lancement : la Box offerte avec engagement 24 mois',
        excerpt:
          'Profitez d’une offre spéciale pendant la période de lancement. Conditions en agence.',
        date: '15 Mar 2026',
        link: '#',
      },
    ],
  },
  cta: {
    enabled: true,
    title: 'Prêt à passer à la 5G ?',
    subtitle: 'Commandez en ligne dès maintenant ou rendez-vous dans votre Espace Topnet.',
    background: img('cta-bg.jpg'),
    btnLabel: 'Commandez maintenant',
    btnUrl: '#commander',
    btnSecondaryLabel: '71 001 298',
    btnSecondaryUrl: 'tel:71001298',
  },
  order: {
    enabled: true,
    tagline: 'Commandez en ligne',
    title: 'Recevez votre',
    titleHighlight: 'Box 5G chez vous',
    subtitle: 'Remplissez le formulaire, un conseiller Topnet vous contacte sous 24h.',
    labelFirstname: 'Prénom *',
    placeholderFirstname: 'Ex : Mohamed',
    labelLastname: 'Nom *',
    placeholderLastname: 'Ex : Ben Ali',
    labelPhone: 'Numéro de téléphone *',
    placeholderPhone: 'Ex : 55 123 456',
    labelGovernorate: 'Gouvernorat *',
    placeholderGovernorate: 'Sélectionnez',
    labelAddress: 'Adresse complète *',
    placeholderAddress: 'Rue, immeuble, ville…',
    labelExisting: 'Êtes-vous déjà abonné Topnet ? *',
    optionYes: 'Oui, je suis abonné',
    optionNo: 'Non, je suis nouveau',
    labelPlan: 'Choisissez votre offre *',
    submitLabel: 'Commander',
    disclaimer:
      "Vos données sont confidentielles et utilisées uniquement dans le cadre de votre demande d'abonnement.",
    msgRequired: 'Merci de remplir tous les champs obligatoires.',
    msgSuccess: 'Demande envoyée ! Un conseiller Topnet vous contactera sous 24h.',
    msgError: 'Une erreur est survenue, veuillez réessayer.',
    governorates: GOVERNORATES_FR.map((text) => ({ text })),
  },
  newsletter: {
    enabled: true,
    tagline: 'Newsletter',
    title: 'Restez',
    titleHighlight: 'informé',
    subtitle: "Recevez les dernières offres et l'actualité 5G de Topnet.",
    placeholder: 'Votre adresse email',
    buttonLabel: "S'abonner",
    msgEmail: 'Veuillez saisir un email valide.',
    msgSuccess: 'Merci pour votre inscription !',
    msgError: 'Une erreur est survenue, veuillez réessayer.',
  },
});

const planCardAR = (speed, unit, price, title, badge, recommended, perks, image, period = '/ شهرياً · 24 شهراً') => ({
  speed,
  speedUnit: unit,
  speedLabel: 'سرعة التحميل',
  title,
  price,
  currency: 'د.ت',
  period,
  badge,
  recommended,
  image,
  features: perks.map((text) => ({ text })),
  buttonLabel: 'اطلب',
  buttonUrl: '#commander',
});

const homePageAR = (img) => ({
  metaTitle: 'توبنيت بوكس 5G — إنترنت فائق السرعة بدون أسلاك',
  metaDescription:
    'اطلب بوكس 5G من توبنيت : تركيب في دقيقة واحدة، Wi-Fi 6، سرعات تصل إلى 100 ميجابت/ثانية. شبكة هجينة 5G + 4G. توصيل في كامل تونس.',
  hero: {
    enabled: true,
    slides: [
      {
        image: img('hero-1.jpg'),
        badge: 'جديد — متوفر الآن',
        title: 'بوكس 5G توبنيت\nأوصله. شغّله.',
        titleHighlight: 'استمتع.',
        text: 'بوكس 5G من توبنيت : بدون فنّي، بدون كابل. أوصله واتصل واستمتع بسرعة فائقة تصل إلى 100 ميجابت/ثانية منذ الدقيقة الأولى.',
        btnPrimaryLabel: 'اطلب الآن',
        btnPrimaryUrl: '#commander',
        btnSecondaryLabel: 'شاهد الأسعار',
        btnSecondaryUrl: '#offres',
      },
      {
        image: img('hero-2.jpg'),
        badge: 'شبكة هجينة 5G + 4G',
        title: 'اتصال\nبلا حدود',
        titleHighlight: 'في كل تونس.',
        text: 'تغطية 5G مع تحويل تلقائي إلى 4G تضمن اتصالاً مستقراً حتى بعيداً عن الألياف.',
        btnPrimaryLabel: 'اكتشف العروض',
        btnPrimaryUrl: '#offres',
        btnSecondaryLabel: 'المساعدة',
        btnSecondaryUrl: '#faq',
      },
      {
        image: img('hero-3.jpg'),
        badge: 'Wi-Fi 6 ثنائي النطاق',
        title: 'حتى 1.2 جيجابت/ثانية\nمع Wi-Fi 6',
        titleHighlight: 'سريع وسلس.',
        text: 'بوكس D-Link DWR-2000M توفر Wi-Fi 6 ثنائي النطاق للبث والألعاب والعمل عن بُعد بسلاسة تامة.',
        btnPrimaryLabel: 'اطلب الآن',
        btnPrimaryUrl: '#commander',
        btnSecondaryLabel: 'المواصفات التقنية',
        btnSecondaryUrl: '#specs',
      },
    ],
  },
  trust: {
    enabled: true,
    items: [
      { value: '5G + 4G', label: 'شبكة هجينة' },
      { value: 'Wi-Fi 6', label: 'ثنائي النطاق' },
      { value: '1 دقيقة', label: 'التركيب' },
      { value: 'البوكس مجاني', label: 'مدة الاشتراك' },
      { value: '24/7', label: 'دعم العملاء' },
    ],
  },
  about: {
    enabled: true,
    tagline: 'عن بوكس 5G',
    title: 'إنترنت فائق السرعة',
    titleHighlight: 'بدون ألياف وبدون فنّي.',
    text: 'بوكس 5G من توبنيت يحوّل الشبكة المتنقلة إلى إنترنت منزلي. أدخل شريحة SIM، اربط أجهزتك عبر Wi-Fi 6 واستمتع بسرعة تحميل تصل إلى 100 ميجابت/ثانية مع تحويل تلقائي بين 4G و5G.',
    image: img('about.jpg'),
    features: [
      { text: 'مودم 5G فائق السرعة' },
      { text: 'Wi-Fi 6 عالي السرعة' },
      { text: 'شريحة مسبقة الدفع' },
      { text: 'تحديثات 5G مشمولة' },
    ],
    buttonLabel: 'المزيد عن البوكس',
    buttonUrl: '#specs',
  },
  services: {
    enabled: true,
    tagline: 'عروضنا',
    title: 'بوكس واحدة',
    titleHighlight: 'لكل استخداماتك',
    subtitle: 'عائلة، عمل عن بُعد، ألعاب أو بث : اختر بوكس 5G المناسب لك.',
    items: [
      {
        icon: '📶',
        title: 'إنترنت المنزل',
        description: 'البديل المثالي لخطوط ADSL لكل العائلة.',
        features: [
          { text: 'استخدام يومي' },
          { text: 'EasyMesh مشمول' },
          { text: 'البوكس مجاني' },
        ],
      },
      {
        icon: '💼',
        title: 'العمل والألعاب',
        description: 'اتصال مستقر للمكالمات المرئية والسحابة والألعاب عبر الإنترنت.',
        features: [
          { text: 'بث 4K' },
          { text: 'زمن استجابة منخفض' },
          { text: 'Wi-Fi 6' },
        ],
      },
      {
        icon: '🛰️',
        title: 'تغطية واسعة',
        description: '5G في المناطق المغطاة مع تحويل تلقائي إلى 4G في كل مكان.',
        features: [
          { text: 'شبكة هجينة' },
          { text: 'سرعة تصل إلى 100 ميجابت/ثانية' },
          { text: 'تنقل' },
        ],
      },
    ],
  },
  plans: {
    enabled: true,
    tagline: 'أسعارنا',
    title: 'اختر',
    titleHighlight: 'عرض 5G الخاص بك',
    subtitle: 'البوكس مجاني، التركيب مجاني والتزام 24 شهراً.',
    groups: [
      {
        name: '30M',
        cards: [
          planCardAR('30', 'M', '55.9', 'الاستخدام اليومي', '', false, [
            'Wi-Fi 6 ثنائي النطاق',
            'بوكس D-Link مجانية',
            'استخدام يومي',
          ], img('plan-1.jpg')),
          planCardAR('30', 'M', '65.9', 'العائلة المتصلة', '⭐ شائع', true, [
            'Wi-Fi 6 ثنائي النطاق',
            'EasyMesh مشمول',
            'دعم ذو أولوية',
          ], img('plan-1.jpg'), '/ شهرياً · 12 شهراً'),
          planCardAR('30', 'M', '75.9', 'بدون التزام', '', false, [
            'Wi-Fi 6 ثنائي النطاق',
            'البوكس مجاني',
            'إلغاء في أي وقت',
          ], img('plan-1.jpg'), '/ شهرياً · بدون التزام'),
        ],
      },
      {
        name: '50M',
        cards: [
          planCardAR('50', 'M', '69.9', 'العائلة المتصلة', '⭐ موصى به', true, [
            'Wi-Fi 6 ثنائي النطاق',
            'EasyMesh مشمول',
            'العائلة المتصلة',
          ], img('plan-2.jpg')),
          planCardAR('50', 'M', '79.9', 'العمل عن بُعد', '', false, [
            'Wi-Fi 6 ثنائي النطاق',
            'EasyMesh مشمول',
            'دعم ذو أولوية',
          ], img('plan-2.jpg'), '/ شهرياً · 12 شهراً'),
          planCardAR('50', 'M', '89.9', 'بدون التزام', '', false, [
            'Wi-Fi 6 ثنائي النطاق',
            'البوكس مجاني',
            'إلغاء في أي وقت',
          ], img('plan-2.jpg'), '/ شهرياً · بدون التزام'),
        ],
      },
      {
        name: '100M',
        cards: [
          planCardAR('100', 'M', '110.9', 'المستخدم القوي', '', false, [
            'Wi-Fi 6 ثنائي النطاق',
            'بث 4K وألعاب وعمل',
            'EasyMesh مشمول',
          ], img('plan-3.jpg')),
          planCardAR('100', 'M', '120.9', 'ألترا', '⭐ بريميوم', true, [
            'Wi-Fi 6 ثنائي النطاق',
            'السرعة القصوى',
            'دعم VIP',
          ], img('plan-3.jpg'), '/ شهرياً · 12 شهراً'),
          planCardAR('100', 'M', '135.9', 'بدون التزام', '', false, [
            'Wi-Fi 6 ثنائي النطاق',
            'بث 4K وألعاب وعمل',
            'إلغاء في أي وقت',
          ], img('plan-3.jpg'), '/ شهرياً · بدون التزام'),
        ],
      },
    ],
    note: 'العروض صالحة حسب المخزون والتغطية. رسوم التركيب مجانية.',
  },
  specs: {
    enabled: true,
    tagline: 'المواصفات التقنية',
    title: 'D-Link',
    titleHighlight: 'DWR-2000M',
    image: img('box-5g.jpg'),
    rows: [
      { label: 'الشبكة', value: '5G / 4G / LTE', highlight: true },
      { label: 'معيار Wi-Fi', value: 'Wi-Fi 6 (802.11ax)', highlight: false },
      { label: 'سرعة 5 جيجاهرتز', value: 'حتى 1.2 جيجابت/ثانية', highlight: true },
      { label: 'سرعة 2.4 جيجاهرتز', value: '574 ميجابت/ثانية', highlight: false },
      { label: 'مستخدمون متزامنون', value: '512 (MU-MIMO)', highlight: false },
      { label: 'المنافذ', value: '1× LAN + 1× WAN/LAN Gigabit', highlight: false },
      { label: 'الأمان', value: 'WPA3، 128 بت', highlight: false },
      { label: 'الذاكرة', value: '1 جيجابايت', highlight: false },
      { label: 'بروتوكول الشبكة', value: 'EasyMesh', highlight: false },
      { label: 'IPv6', value: 'مدعوم', highlight: false },
    ],
  },
  steps: {
    enabled: true,
    tagline: 'التشغيل',
    title: 'متصل عبر',
    titleHighlight: '3 خطوات',
    steps: [
      {
        title: 'أدخل بطاقة micro-SIM',
        description: 'ضع بطاقة SIM المرفقة في المكان المخصص في الجزء الخلفي من البوكس.',
      },
      {
        title: 'أوصله بالكهرباء',
        description: 'اربط المحول بمقبس الحائط. التشغيل يستغرق حوالي 45 ثانية.',
      },
      {
        title: 'اتصل بشبكة Wi-Fi',
        description: 'اسم الشبكة وكلمة المرور موجودان على الملصق أسفل البوكس. هذا كل شيء.',
      },
    ],
    helpTitle: 'تحتاج مساعدة؟',
    helpText: 'اتصل على 71 001 298 — متاح 7/7، أو زر أقرب مركز توبنيت.',
  },
  faq: {
    enabled: true,
    tagline: 'الأسئلة الشائعة',
    title: 'أسئلة',
    titleHighlight: 'متكررة',
    items: [
      {
        question: 'هل تحتاج بوكس 5G إلى خط هاتف أو ألياف؟',
        answer:
          'لا. تعمل بوكس 5G حصرياً عبر الشبكة المتنقلة (5G/4G). يكفي إدخال بطاقة SIM المرفقة وتشغيلها.',
      },
      {
        question: 'ماذا أفعل إذا لم تتوفر 5G في منطقتي؟',
        answer:
          'تتحول البوكس تلقائياً إلى شبكة 4G/LTE. تبقى متصلاً بسرعات قد تصل إلى 100 ميجابت/ثانية.',
      },
      {
        question: 'كم عدد الأجهزة التي يمكن ربطها؟',
        answer:
          'حتى 512 جهازاً متزامناً بفضل Wi-Fi 6 وتقنية MU-MIMO. مثالي للمنازل شديدة الاتصال.',
      },
      {
        question: 'هل البوكس مجاني؟',
        answer:
          'نعم، بوكس D-Link DWR-2000M مجانية مع أي اشتراك بالتزام 24 شهراً.',
      },
      {
        question: 'كيف أتابع استهلاكي؟',
        answer:
          'عبر فضاء العميل وتطبيق الهاتف حيث يمكنك الاطلاع على سرعتك وبياناتك لحظياً.',
      },
      {
        question: 'هل يمكنني إلغاء اشتراكي؟',
        answer:
          'نعم، حسب الصيغة المختارة. عروض بدون التزام قابلة للإلغاء في أي وقت دون رسوم.',
      },
    ],
  },
  testimonials: {
    enabled: true,
    tagline: 'آراء العملاء',
    title: 'ماذا يقول',
    titleHighlight: 'عملاؤنا',
    items: [
      {
        quote: 'ركّبته في 5 دقائق في منزلي بسوسة. Wi-Fi 6 يغطي المنزل كله حتى الحديقة.',
        author: 'سامي ع.',
        role: 'مشترك بوكس 5G 50M',
        avatar: img('avatar-1.jpg'),
        rating: 5,
      },
      {
        quote: 'وداعاً للأدسل الذي ينقطع أيام المطر. بث 4K دون أي انقطاع منذ ثلاثة أشهر.',
        author: 'مهدي ب.',
        role: 'مشترك بوكس 5G 100M',
        avatar: img('avatar-2.jpg'),
        rating: 5,
      },
      {
        quote: 'استبدلت الألياف عند وصولي إلى تونس. تركيب بسيط ودعم سريع جداً.',
        author: 'لمياء ت.',
        role: 'مشتركة بوكس 5G 30M',
        avatar: img('avatar-3.jpg'),
        rating: 4,
      },
    ],
  },
  news: {
    enabled: true,
    tagline: 'الأخبار',
    title: 'آخر',
    titleHighlight: 'المستجدات',
    items: [
      {
        image: img('news-1.jpg'),
        title: 'توبنيت توسّع شبكة 5G إلى 8 ولايات جديدة',
        excerpt: 'تواصل تغطية 5G توسعها عبر البلاد. تحقق من التغطية في منطقتك.',
        date: '12 جانفي 2026',
        link: '#',
      },
      {
        image: img('news-2.jpg'),
        title: 'بوكس 5G توبنيت يفوز بجائزة أفضل جهاز ثابت لاسلكي 2026',
        excerpt: 'تقديراً لاستقلاليته وسرعة تركيبه وتقنية Wi-Fi 6.',
        date: '28 فيفري 2026',
        link: '#',
      },
      {
        image: img('news-3.jpg'),
        title: 'عرض الإطلاق : البوكس مجانية مع التزام 24 شهراً',
        excerpt: 'استفد من عرض خاص خلال فترة الإطلاق. الشروط لدى الوكالات.',
        date: '15 مارس 2026',
        link: '#',
      },
    ],
  },
  cta: {
    enabled: true,
    title: 'مستعد للانتقال إلى 5G؟',
    subtitle: 'اطلب عبر الإنترنت الآن أو توجه إلى أقرب مركز توبنيت.',
    background: img('cta-bg.jpg'),
    btnLabel: 'اطلب الآن',
    btnUrl: '#commander',
    btnSecondaryLabel: '71 001 298',
    btnSecondaryUrl: 'tel:71001298',
  },
  order: {
    enabled: true,
    tagline: 'اطلب عبر الإنترنت',
    title: 'استلم',
    titleHighlight: 'بوكس 5G في منزلك',
    subtitle: 'املأ الاستمارة وسيتصل بك مستشار توبنيت خلال 24 ساعة.',
    labelFirstname: 'الاسم *',
    placeholderFirstname: 'مثال : محمد',
    labelLastname: 'اللقب *',
    placeholderLastname: 'مثال : بن علي',
    labelPhone: 'رقم الهاتف *',
    placeholderPhone: 'مثال : 55 123 456',
    labelGovernorate: 'الولاية *',
    placeholderGovernorate: 'اختر',
    labelAddress: 'العنوان الكامل *',
    placeholderAddress: 'الشارع، البناية، المدينة…',
    labelExisting: 'هل أنت مشترك توبنيت بالفعل؟ *',
    optionYes: 'نعم، أنا مشترك',
    optionNo: 'لا، أنا جديد',
    labelPlan: 'اختر عرضك *',
    submitLabel: 'اطلب',
    disclaimer: 'بياناتك سرية وتُستخدم فقط في إطار طلب اشتراكك.',
    msgRequired: 'يرجى ملء جميع الحقول الإلزامية.',
    msgSuccess: 'تم إرسال طلبك! سيتصل بك مستشار توبنيت خلال 24 ساعة.',
    msgError: 'حدث خطأ، يرجى إعادة المحاولة.',
    governorates: GOVERNORATES_AR.map((text) => ({ text })),
  },
  newsletter: {
    enabled: true,
    tagline: 'النشرة البريدية',
    title: 'ابقَ',
    titleHighlight: 'متابعاً',
    subtitle: 'استلم آخر العروض وأخبار 5G من توبنيت.',
    placeholder: 'بريدك الإلكتروني',
    buttonLabel: 'اشترك',
    msgEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
    msgSuccess: 'شكراً لاشتراكك!',
    msgError: 'حدث خطأ، يرجى إعادة المحاولة.',
  },
});

// ───────────────────────────────────────────────
// Main
// ───────────────────────────────────────────────

async function main() {
  const app = createStrapi({ appDir: path.join(__dirname, '..') });
  try {
    await app.load();

    await ensureAdmin(app);
    await ensureLocales(app);

    const refs = await uploadAssets(app);
    const img = buildRefs(refs);

    const siteConfigDocs = await upsertDocument(
      app,
      'api::site-config.site-config',
      [
        ['fr', siteConfigFR(img)],
        ['ar', siteConfigAR(img)],
      ]
    );
    log(`✅ site-config FR+AR${siteConfigDocs.created ? ' (créé)' : ' (mis à jour)'} — un seul document (${siteConfigDocs.doc.documentId})`);

    const homePageDocs = await upsertDocument(
      app,
      'api::home-page.home-page',
      [
        ['fr', homePageFR(img)],
        ['ar', homePageAR(img)],
      ],
      { publish: true }
    );
    log(`✅ home-page FR+AR${homePageDocs.created ? ' (créé)' : ' (mis à jour)'} + publié — un seul document (${homePageDocs.doc.documentId})`);

    log('\n🎉 Seed terminé.');
    log(`   Admin CMS : http://localhost:1337/admin (${EMAIL} / ${PASSWORD})`);
    log('   Puis lancez le site : cd site && npm start');
  } catch (e) {
    err('❌ Seed échoué :', e.stack || e.message);
    process.exitCode = 1;
  } finally {
    try {
      await app.destroy();
    } catch (e) {
      /* ignore */
    }
  }
}

main();
