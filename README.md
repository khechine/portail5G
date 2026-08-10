# Portail 5G TOPNET

Site marketing SSR bilingue FR/AR pour la TOPNET Box 5G, piloté par Strapi v5.

## Structure

- `strapi/` — CMS headless (Strapi v5, API REST)
- `site/` — Site Express + EJS (SSR, bilingue FR/AR)

## Démarrage

```bash
# Strapi
cd strapi && npm install && npx strapi develop

# Site (dans un autre terminal)
cd site && npm install && node server.js
```

- Admin CMS : http://localhost:1337/admin
- Site FR : http://localhost:3000
- Site AR : http://localhost:3000/ar

## Seed

```bash
cd strapi && node scripts/seed.js
```
