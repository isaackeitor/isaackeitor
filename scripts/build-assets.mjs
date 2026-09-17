#!/usr/bin/env node
// Generates the profile README artwork in light and dark variants.
// Edit the content below, then run: node scripts/build-assets.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');

// ─── Content ────────────────────────────────────────────────────────────────

const HERO = { name: 'Josué Morales.', role: 'Software Engineer.' };

const LINKS = [
  { id: 'portfolio', label: 'isaackeitor.com', primary: true },
  { id: 'linkedin', label: 'LinkedIn', primary: false },
];

const FOCUS = {
  title: 'Enfoque.',
  subtitle: 'Lo que construyo.',
  items: [
    {
      icon: 'layers', tint: 'blue', title: 'Full-stack',
      body: ['De la base de datos a la interfaz, con', '.NET, Node.js y React sobre TypeScript.'],
    },
    {
      icon: 'trend', tint: 'purple', title: 'Arquitectura escalable',
      body: ['Sistemas modulares y APIs diseñadas para', 'crecer sin perder mantenibilidad.'],
    },
    {
      icon: 'briefcase', tint: 'orange', title: 'Sistemas empresariales',
      body: ['Plataformas de gestión que ordenan', 'procesos y simplifican la operación.'],
    },
    {
      icon: 'bolt', tint: 'green', title: 'Alto rendimiento',
      body: ['Aplicaciones rápidas y confiables,', 'optimizadas en cada capa.'],
    },
  ],
};

const STACK = {
  title: 'Stack.',
  subtitle: 'Con qué lo construyo.',
  groups: [
    {
      label: 'Lenguajes',
      items: [
        ['C#', '#178600'], ['TypeScript', '#3178c6'], ['Python', '#3572a5'],
        ['Kotlin', '#a97bff'], ['Java', '#b07219'], ['C++', '#f34b7d'],
      ],
    },
    { label: 'Frameworks', items: [['.NET', '#512bd4'], ['React', '#61dafb'], ['Node.js', '#5fa04e']] },
    { label: 'Datos', items: [['SQL Server', '#cc2927'], ['PostgreSQL', '#336791']] },
  ],
};

// ─── Design tokens ──────────────────────────────────────────────────────────

const THEMES = {
  light: {
    primary: '#1d1d1f',
    secondary: '#6e6e73',
    surface: '#f5f5f7',
    surfaceStroke: 'none',
    chip: '#ffffff',
    chipStroke: 'rgba(0,0,0,0.08)',
    hairline: 'rgba(0,0,0,0.08)',
    accent: '#0071e3',
    tints: { blue: '#0071e3', purple: '#9b4dde', orange: '#e0620d', green: '#1f9d4c' },
  },
  dark: {
    primary: '#f5f5f7',
    secondary: '#a1a1a6',
    surface: 'rgba(255,255,255,0.045)',
    surfaceStroke: 'rgba(255,255,255,0.08)',
    chip: 'rgba(255,255,255,0.06)',
    chipStroke: 'rgba(255,255,255,0.07)',
    hairline: 'rgba(255,255,255,0.08)',
    accent: '#2997ff',
    tints: { blue: '#2997ff', purple: '#bf5af2', orange: '#ff9f0a', green: '#30d158' },
  },
};

const DISPLAY = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif`;
const TEXT = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif`;

const WIDTH = 840;

// SF-style line icons on a 24×24 grid.
const ICONS = {
  layers: '<path d="M12 3 21 7.5 12 12 3 7.5Z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7"/><path d="M3 12.5h18"/>',
  bolt: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

// Approximate advance widths (Helvetica metrics, per 1000 em) used to size chips.
const ADVANCE = {
  ' ': 278, '#': 556, '+': 584, '.': 278, '-': 333,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833,
  n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556, M: 833,
  N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
};

const measure = (str, size) =>
  [...str].reduce((w, ch) => w + (ADVANCE[ch] ?? 556), 0) / 1000 * size * 1.04;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const svg = ({ width, height, title, style, body }) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>
text { white-space: pre; }
${style.trim()}
</style>
${body.trim()}
</svg>
`;

// Two-tone section headline: bold statement followed by a quieter clause.
const headline = (t, title, subtitle, y) =>
  `<text x="0" y="${y}" class="headline"><tspan fill="${t.primary}">${esc(title)} </tspan><tspan fill="${t.secondary}">${esc(subtitle)}</tspan></text>`;

const headlineStyle = `.headline { font: 600 32px ${DISPLAY}; letter-spacing: -0.005em; }`;

// ─── Artwork ────────────────────────────────────────────────────────────────

function hero(t) {
  return svg({
    width: WIDTH,
    height: 168,
    title: `${HERO.name} ${HERO.role}`,
    style: `.display { font: 600 56px ${DISPLAY}; letter-spacing: -0.015em; }`,
    body: `
<text x="0" y="62" class="display" fill="${t.primary}">${esc(HERO.name)}</text>
<text x="0" y="130" class="display" fill="${t.secondary}">${esc(HERO.role)}</text>`,
  });
}

function button(t, link) {
  const height = 38;
  const size = 15;
  const padX = 18;
  const arrow = 9;
  const gap = 7;
  const textW = Math.ceil(measure(link.label, size));
  const width = padX + textW + gap + arrow + padX;
  const fg = link.primary ? '#ffffff' : t.accent;
  const shape = link.primary
    ? `<rect width="${width}" height="${height}" rx="${height / 2}" fill="#0071e3"/>`
    : `<rect x="0.75" y="0.75" width="${width - 1.5}" height="${height - 1.5}" rx="${(height - 1.5) / 2}" fill="none" stroke="${t.accent}" stroke-width="1.5"/>`;
  const ax = padX + textW + gap;
  const ay = (height - arrow) / 2;
  return svg({
    width,
    height,
    title: link.label,
    style: `.label { font: 500 ${size}px ${TEXT}; letter-spacing: -0.01em; }`,
    body: `
${shape}
<text x="${padX}" y="${height / 2 + 5.25}" class="label" fill="${fg}">${esc(link.label)}</text>
<path d="M${ax} ${ay + arrow}L${ax + arrow} ${ay}M${ax + 2.5} ${ay}H${ax + arrow}V${ay + arrow - 2.5}" fill="none" stroke="${fg}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  });
}

function focus(t) {
  const top = 104;
  const gap = 12;
  const tileW = (WIDTH - gap) / 2;
  const tileH = 184;
  const tiles = FOCUS.items.map((item, i) => {
    const x = (i % 2) * (tileW + gap);
    const y = top + Math.floor(i / 2) * (tileH + gap);
    const tint = t.tints[item.tint];
    return `
<g transform="translate(${x} ${y})">
  <rect x="0.5" y="0.5" width="${tileW - 1}" height="${tileH - 1}" rx="22" fill="${t.surface}" stroke="${t.surfaceStroke}"/>
  <g transform="translate(26 26) scale(${30 / 24})" fill="none" stroke="${tint}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICONS[item.icon]}</g>
  <text x="28" y="104" class="tile-title" fill="${t.primary}">${esc(item.title)}</text>
  ${item.body.map((line, j) => `<text x="28" y="${134 + j * 23}" class="tile-body" fill="${t.secondary}">${esc(line)}</text>`).join('\n  ')}
</g>`;
  });
  const height = top + 2 * tileH + gap + 4;
  return svg({
    width: WIDTH,
    height,
    title: `${FOCUS.title} ${FOCUS.subtitle} ${FOCUS.items.map((i) => i.title).join(', ')}.`,
    style: `
${headlineStyle}
.tile-title { font: 600 19px ${TEXT}; letter-spacing: -0.01em; }
.tile-body { font: 400 15px ${TEXT}; letter-spacing: -0.005em; }`,
    body: `${headline(t, FOCUS.title, FOCUS.subtitle, 72)}${tiles.join('')}`,
  });
}

function stack(t) {
  const top = 104;
  const rowH = 72;
  const cardH = STACK.groups.length * rowH;
  const chipH = 34;
  const chipGap = 8;
  const labelW = 176;
  const size = 14;

  const rows = STACK.groups.map((group, r) => {
    const cy = top + r * rowH + rowH / 2;
    let x = labelW;
    const chips = group.items.map(([name, color]) => {
      const textW = measure(name, size);
      const w = Math.ceil(30 + textW + 16);
      const chip = `
  <g transform="translate(${x} ${cy - chipH / 2})">
    <rect x="0.5" y="0.5" width="${w - 1}" height="${chipH - 1}" rx="${(chipH - 1) / 2}" fill="${t.chip}" stroke="${t.chipStroke}"/>
    <circle cx="17" cy="${chipH / 2}" r="4.5" fill="${color}"/>
    <text x="${30 + textW / 2}" y="${chipH / 2 + 5}" text-anchor="middle" class="chip" fill="${t.primary}">${esc(name)}</text>
  </g>`;
      x += w + chipGap;
      return chip;
    });
    const divider = r > 0
      ? `\n  <line x1="28" x2="${WIDTH - 28}" y1="${top + r * rowH}" y2="${top + r * rowH}" stroke="${t.hairline}"/>`
      : '';
    return `${divider}
  <text x="28" y="${cy + 5}" class="row-label" fill="${t.secondary}">${esc(group.label)}</text>${chips.join('')}`;
  });

  return svg({
    width: WIDTH,
    height: top + cardH + 4,
    title: `${STACK.title} ${STACK.groups.map((g) => `${g.label}: ${g.items.map(([n]) => n).join(', ')}`).join('. ')}.`,
    style: `
${headlineStyle}
.row-label { font: 500 15px ${TEXT}; letter-spacing: -0.005em; }
.chip { font: 500 ${size}px ${TEXT}; letter-spacing: -0.005em; }`,
    body: `${headline(t, STACK.title, STACK.subtitle, 72)}
<rect x="0.5" y="${top + 0.5}" width="${WIDTH - 1}" height="${cardH - 1}" rx="22" fill="${t.surface}" stroke="${t.surfaceStroke}"/>${rows.join('')}`,
  });
}

// ─── Build ──────────────────────────────────────────────────────────────────

mkdirSync(OUT, { recursive: true });

for (const [mode, t] of Object.entries(THEMES)) {
  const files = {
    [`hero-${mode}.svg`]: hero(t),
    [`focus-${mode}.svg`]: focus(t),
    [`stack-${mode}.svg`]: stack(t),
    ...Object.fromEntries(LINKS.map((l) => [`button-${l.id}-${mode}.svg`, button(t, l)])),
  };
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(OUT, name), content);
    console.log(`assets/${name}`);
  }
}
