#!/usr/bin/env node
/**
 * Génère des images SVG de démonstration dans scripts/assets/.
 * L'équipe métier les remplacera par les vraies images via l'admin Strapi.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'assets');
fs.mkdirSync(OUT, { recursive: true });

const RED = '#e2418c';
const RED_DARK = '#e08e00';
const NAVY = '#251444';
const ORANGE = '#f47920';
const CREAM = '#F7F5F1';

const write = (name, svg) => {
  fs.writeFileSync(path.join(OUT, name), svg);
  console.log('ok', name);
};

// ─── logo.svg ───
write(
  'logo.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="52" viewBox="0 0 220 52">
  <rect x="2" y="2" width="44" height="44" rx="12" fill="${RED}"/>
  <text x="24" y="35" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">5G</text>
  <text x="60" y="34" font-family="Arial, sans-serif" font-size="26" font-weight="800" fill="${NAVY}" letter-spacing="1">TOPNET</text>
</svg>`
);

// ─── favicon.svg ───
write(
  'favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect x="2" y="2" width="60" height="60" rx="16" fill="${RED}"/>
  <text x="32" y="43" font-family="Arial, sans-serif" font-size="26" font-weight="800" fill="#fff" text-anchor="middle">5G</text>
</svg>`
);

// ─── box-5g.svg : box router stylisée ───
write(
  'box-5g.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="320" viewBox="0 0 420 320">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${RED}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${RED}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a2b6b"/>
      <stop offset="100%" stop-color="${NAVY}"/>
    </linearGradient>
    <linearGradient id="ledge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3f2f74"/>
      <stop offset="100%" stop-color="#1d0f38"/>
    </linearGradient>
  </defs>
  <ellipse cx="210" cy="285" rx="150" ry="18" fill="url(#glow)"/>
  <!-- antennes -->
  <line x1="150" y1="150" x2="140" y2="70" stroke="#5a4b8f" stroke-width="7" stroke-linecap="round"/>
  <line x1="270" y1="150" x2="280" y2="70" stroke="#5a4b8f" stroke-width="7" stroke-linecap="round"/>
  <circle cx="140" cy="66" r="9" fill="${RED}"/>
  <circle cx="280" cy="66" r="9" fill="${RED}"/>
  <!-- corps -->
  <rect x="95" y="140" width="230" height="66" rx="16" fill="url(#body)"/>
  <rect x="95" y="196" width="230" height="66" rx="16" fill="url(#ledge)"/>
  <text x="210" y="186" font-family="Arial, sans-serif" font-size="34" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="2">5G</text>
  <text x="210" y="238" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#9fb0e0" text-anchor="middle" letter-spacing="4">TOPNET</text>
  <rect x="110" y="252" width="200" height="5" rx="2.5" fill="${RED}"/>
  <!-- wifi -->
  <path d="M150 132a88 30 0 0 120 0" stroke="${ORANGE}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M168 122a54 20 0 0 0 84 0" stroke="#ffd479" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="210" cy="112" r="6" fill="#fff"/>
</svg>`
);

// ─── about.svg ───
write(
  'about.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="520" viewBox="0 0 640 520">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2b1f63"/>
      <stop offset="100%" stop-color="${NAVY}"/>
    </linearGradient>
    <radialGradient id="gl" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${RED}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${RED}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="640" height="520" rx="26" fill="url(#bg)"/>
  <circle cx="480" cy="300" r="230" fill="url(#gl)"/>
  <circle cx="120" cy="120" r="8" fill="${RED}"/>
  <circle cx="300" cy="80" r="5" fill="#ffd479"/>
  <circle cx="540" cy="120" r="6" fill="#9fb0e0"/>
  <circle cx="80" cy="400" r="6" fill="#ffd479"/>
  <!-- wifi -->
  <path d="M160 240a120 40 0 0 0 240 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.9"/>
  <path d="M185 222a80 28 0 0 0 190 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>
  <path d="M212 205a44 16 0 0 0 96 0" stroke="${ORANGE}" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- box -->
  <line x1="470" y1="330" x2="460" y2="250" stroke="#5a4b8f" stroke-width="8" stroke-linecap="round"/>
  <line x1="570" y1="330" x2="580" y2="250" stroke="#5a4b8f" stroke-width="8" stroke-linecap="round"/>
  <circle cx="460" cy="244" r="10" fill="${RED}"/>
  <circle cx="580" cy="244" r="10" fill="${RED}"/>
  <rect x="420" y="320" width="200" height="74" rx="18" fill="#fff"/>
  <rect x="420" y="386" width="200" height="70" rx="18" fill="#e9e2f2"/>
  <text x="520" y="372" font-family="Arial, sans-serif" font-size="38" font-weight="900" fill="${NAVY}" text-anchor="middle" letter-spacing="2">5G</text>
  <text x="520" y="430" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#6b5b99" text-anchor="middle" letter-spacing="4">TOPNET</text>
  <!-- device icons -->
  <g fill="#fff" opacity="0.92">
    <rect x="80" y="380" width="46" height="76" rx="8"/>
    <rect x="86" y="390" width="34" height="52" rx="4" fill="#2b1f63"/>
    <rect x="470" y="430" width="90" height="14" rx="7" fill="#ffd479" opacity="0.9"/>
  </g>
</svg>`
);

// ─── plan-x.svg (petites visuels des offres) ───
const plan = (name, speed, colorA, colorB) =>
  write(
    name,
    `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="300" viewBox="0 0 460 300">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colorA}"/>
      <stop offset="100%" stop-color="${colorB}"/>
    </linearGradient>
    <radialGradient id="gl" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="460" height="300" rx="22" fill="url(#bg)"/>
  <circle cx="380" cy="60" r="120" fill="url(#gl)"/>
  <circle cx="70" cy="250" r="90" fill="url(#gl)"/>
  <path d="M150 150a70 24 0 0 0 140 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.85"/>
  <path d="M173 136a36 13 0 0 0 94 0" stroke="#ffd479" stroke-width="6" fill="none" stroke-linecap="round"/>
  <line x1="230" y1="200" x2="230" y2="150" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.9"/>
  <circle cx="230" cy="145" r="10" fill="${RED}"/>
  <circle cx="230" cy="200" r="34" fill="#fff"/>
  <text x="230" y="208" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="${NAVY}" text-anchor="middle">${speed}</text>
  <text x="230" y="252" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle" letter-spacing="3" opacity="0.9">TOPNET 5G BOX</text>
</svg>`
  );
plan('plan-1.svg', '30M', '#3a2b6b', '#251444');
plan('plan-2.svg', '50M', '#e2418c', '#d17a00');
plan('plan-3.svg', '100M', '#1f4d7a', '#12304d');

// ─── cta-bg.svg ───
write(
  'cta-bg.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="420" viewBox="0 0 1600 420">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2b1f63"/>
      <stop offset="55%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="#1a0f38"/>
    </linearGradient>
    <radialGradient id="gl" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${RED}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${RED}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="420" fill="url(#bg)"/>
  <circle cx="1300" cy="60" r="300" fill="url(#gl)"/>
  <circle cx="200" cy="400" r="260" fill="url(#gl)"/>
  <path d="M0 350 L300 180 L520 330 L760 120 L1020 300 L1260 160 L1600 280 L1600 420 L0 420 Z" fill="#ffffff" opacity="0.04"/>
  <path d="M0 390 L340 240 L640 380 L960 210 L1300 360 L1600 260" stroke="#ffffff" stroke-width="2" stroke-dasharray="10 12" fill="none" opacity="0.12"/>
</svg>`
);

// ─── avatars ───
const avatar = (name, initials, a, b) =>
  write(
    name,
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="80" fill="url(#bg)"/>
  <circle cx="80" cy="58" r="28" fill="#fff" opacity="0.9"/>
  <path d="M28 150c8-42 28-62 52-62s44 20 52 62" fill="#fff" opacity="0.9"/>
  <text x="80" y="82" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="${NAVY}" text-anchor="middle">${initials}</text>
</svg>`
  );
avatar('avatar-1.svg', 'SA', '#e2418c', '#d17a00');
avatar('avatar-2.svg', 'MB', '#f47920', '#c0561c');
avatar('avatar-3.svg', 'LT', '#1f4d7a', '#12304d');

// ─── news ───
const news = (name, label, a, b) =>
  write(
    name,
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="20" fill="url(#bg)"/>
  <circle cx="120" cy="340" r="150" fill="#fff" opacity="0.08"/>
  <circle cx="520" cy="60" r="110" fill="#fff" opacity="0.08"/>
  <path d="M230 250a110 36 0 0 0 140 0" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M262 228a62 21 0 0 0 76 0" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>
  <circle cx="300" cy="210" r="13" fill="#fff"/>
  <text x="300" y="330" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#fff" text-anchor="middle" letter-spacing="6">${label}</text>
</svg>`
  );
news('news-1.svg', '5G NEWS', '#3a2b6b', '#251444');
news('news-2.svg', 'AWARD 2026', '#e2418c', '#d17a00');
news('news-3.svg', 'LAUNCH OFFER', '#1f4d7a', '#12304d');

console.log('Assets générés dans', OUT);
