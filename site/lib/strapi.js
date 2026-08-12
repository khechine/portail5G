'use strict';

const STRAPI_URL = (process.env.DJANGO_URL || process.env.STRAPI_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const STRAPI_PUBLIC_URL = (process.env.STRAPI_PUBLIC_URL !== undefined ? process.env.STRAPI_PUBLIC_URL : STRAPI_URL).replace(/\/$/, '');
const CACHE_TTL = Number(process.env.CACHE_TTL_MS || 60000);

const cache = new Map();

function cacheKey(locale, type) {
  return `${type}:${locale}`;
}

async function cached(locale, type, fetcher) {
  const key = cacheKey(locale, type);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return hit.value;
  }
  const value = await fetcher();
  cache.set(key, { ts: Date.now(), value });
  return value;
}

function qs(params) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) {
      v.forEach((item, i) => usp.append(`${k}[${i}]`, item));
    } else if (v !== undefined && v !== null && v !== '') {
      usp.append(k, v);
    }
  }
  return usp.toString();
}

async function getApi(path, params) {
  const url = `${STRAPI_URL}${path}?${qs(params)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`Strapi ${res.status} sur ${url}`);
  }
  return res.json();
}

// Chemins de population explicites (Strapi v5 : pas de populate=deep)
const SITE_CONFIG_POPULATE = [
  'logo',
  'favicon',
  'navItems',
  'footerColumns',
  'footerColumns.links',
  'socials',
  'legalLinks',
];

const HOME_PAGE_POPULATE = [
  'hero',
  'hero.slides',
  'hero.slides.image',
  'trust',
  'trust.items',
  'about',
  'about.image',
  'about.features',
  'services',
  'services.items',
  'services.items.features',
  'plans',
  'plans.groups',
  'plans.groups.cards',
  'plans.groups.cards.image',
  'plans.groups.cards.features',
  'specs',
  'specs.image',
  'specs.rows',
  'steps',
  'steps.steps',
  'faq',
  'faq.items',
  'testimonials',
  'testimonials.items',
  'testimonials.items.avatar',
  'news',
  'news.items',
  'news.items.image',
  'cta',
  'cta.background',
  'order',
  'order.governorates',
  'newsletter',
];

function mediaUrl(media) {
  if (!media) return '';
  const url = typeof media === 'string' ? media : media.url;
  if (!url) return '';
  if (url.startswith && (url.startsWith('http://') || url.startsWith('https://'))) return url;
  if (url.startsWith && url.startsWith('http')) return url;
  return `${STRAPI_PUBLIC_URL}${url}`;
}

async function getSiteConfig(locale) {
  return cached(locale, 'site-config', () =>
    getApi('/api/site-config/', {
      locale,
      populate: SITE_CONFIG_POPULATE,
    })
  );
}

async function getHomePage(locale) {
  return cached(locale, 'home-page', () =>
    getApi('/api/home-page/', {
      locale,
      status: 'published',
      populate: HOME_PAGE_POPULATE,
    })
  );
}

module.exports = { getSiteConfig, getHomePage, mediaUrl, STRAPI_URL, STRAPI_PUBLIC_URL };
