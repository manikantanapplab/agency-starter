#!/usr/bin/env node
// ============================================================
// BUILD SASS — auto-generates app.scss then compiles everything
// Scans src/components/ and src/sass/layers/ automatically
// No manual lists needed — just add files and restart
// ============================================================

import { promises as fs } from 'fs';
import { execSync, spawn } from 'child_process';
import path from 'path';

// ── Auto-scan components ─────────────────────────────────────
async function getValidComponents() {
  const comps = [];
  try {
    const entries = await fs.readdir('src/components', { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      try {
        await fs.access(`src/components/${e.name}/${e.name}.scss`);
        comps.push(e.name);
      } catch {}
    }
  } catch {}
  return comps;
}

async function getLayerFiles() {
  const layers = [];
  try {
    const entries = await fs.readdir('src/sass/layers', { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && e.name.startsWith('_') && e.name.endsWith('.scss')) {
        layers.push(path.basename(e.name, '.scss').replace(/^_/, ''));
      }
    }
  } catch {}
  return layers;
}

async function getPages() {
  const pages = [];
  try {
    const entries = await fs.readdir('src/pages', { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && e.name.endsWith('.pug')) {
        pages.push(path.basename(e.name, '.pug'));
      }
    }
  } catch {}
  return pages;
}

const components = await getValidComponents();
const layers     = await getLayerFiles();
const pages      = await getPages();

// ── Generate app.scss ────────────────────────────────────────
const app = `// AUTO-GENERATED — do not edit manually
// Edit files in src/components/, src/sass/layers/
// Regenerated every time you run dev or build

@use 'base/layers';
@use 'base/bootstrap';
@use 'tokens/colors';
@use 'tokens/spacing';
@use 'tokens/typography';
@use 'base/reset';
@use 'base/base';
@use '../layouts/header';

// Components (${components.length} found)
${components.map(c => `@use '../components/${c}/${c}';`).join('\n')}

// Page styles (${layers.length} found)
${layers.length ? layers.map(l => `@use 'layers/${l}';`).join('\n') : '// none yet — run: npm run page <name>'}

@use 'utilities/functions';
@use 'utilities/mixins';
`;

await fs.writeFile('src/sass/app.scss', app);
console.log(`✅ app.scss — ${components.length} components, ${layers.length} page layers`);

// ── Sass flags ────────────────────────────────────────────────
const DEPRECATION_FLAGS = '--silence-deprecation=import,global-builtin,color-functions,if-function';

const isWatch      = process.argv.includes('--watch');
const isCompressed = process.argv.includes('--compressed');
const noSourceMap  = process.argv.includes('--no-source-map');

// ── Build targets ─────────────────────────────────────────────
const targets = [
  'src/sass/app.scss:dist/assets/css/app.css',
  'src/sass/base/base-only.scss:dist/assets/css/base.css',
];

const pageScssEntries = await fs.readdir('src/sass/pages').catch(() => []);
for (const f of pageScssEntries) {
  if (f.startsWith('_') || !f.endsWith('.scss')) continue;
  const page = path.basename(f, '.scss');
  targets.push(`src/sass/pages/${page}.scss:dist/assets/css/pages/${page}.css`);
}

for (const c of components) {
  targets.push(`src/components/${c}/${c}.scss:dist/assets/css/components/${c}.css`);
}

await fs.mkdir('dist/assets/css/pages',      { recursive: true });
await fs.mkdir('dist/assets/css/components', { recursive: true });

// ── Sourcemap logic ───────────────────────────────────────────
// Dev  (--watch):      sourcemaps ON  by default, full source paths
// Build (--compressed): sourcemaps ON  by default (aids BE debugging)
// Prod  (--no-source-map): sourcemaps OFF (use for final client delivery)
const sourceMapFlag = noSourceMap ? '--no-source-map' : '--source-map';

const sassArgs = [
  isWatch      ? '--watch'            : '',
  isCompressed ? '--style=compressed' : '',
  sourceMapFlag,
  DEPRECATION_FLAGS,
  ...targets,
].filter(Boolean);

if (isWatch) {
  console.log(`🗺  Sourcemaps: ON  (dev mode)`);
  const child = spawn('sass', sassArgs, { stdio: 'inherit', shell: true });
  child.on('error', err => { console.error(err.message); process.exit(1); });
} else {
  console.log(`🗺  Sourcemaps: ${noSourceMap ? 'OFF' : 'ON'}`);
  execSync(`sass ${sassArgs.join(' ')}`, { stdio: 'inherit' });
  console.log(`✅ CSS compiled (${targets.length} targets)`);
}
