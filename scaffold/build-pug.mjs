#!/usr/bin/env node
import { execSync, spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { MODE } from '../project.config.mjs';

// ── Step 1: Write _base.pug ───────────────────────────────────
const cssBlock =
  MODE === 'single'
    ? `    link(rel="stylesheet" href="assets/css/app.css")\n    block pagecss\n    block componentcss`
  : MODE === 'per-page'
    ? `    block pagecss\n      link(rel="stylesheet" href="assets/css/pages/index.css")\n    block componentcss`
  : /* per-component */
    `    block pagecss\n    link(rel="stylesheet" href="assets/css/base.css")\n    block componentcss`;

const basePug = `doctype html
html(lang="en" dir="ltr" data-theme="light")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    meta(name="description" content=description || 'BS Package v14')
    link(rel="preconnect" href="https://fonts.googleapis.com")
    link(rel="preconnect" href="https://fonts.gstatic.com" crossorigin)
    link(rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap")
    link(rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css")
    link(rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css")
    //- CSS MODE: ${MODE} (change in project.config.mjs → restart dev)
${cssBlock}
    title
      block title
        | BS Package v14
    block head
  body
    // include _header.pug
    main(id="main-content")
      block content
    // include _footer.pug
    script(src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js")
    script(src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js")
    script(src="assets/js/swiper-init.js")
    script(src="assets/js/components.js")
    script(defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js")
    block scripts
`;

await fs.writeFile('src/layouts/_base.pug', basePug);
console.log(`✅ _base.pug → ${MODE} mode`);

// ── Step 2: Get available components ─────────────────────────
async function getAvailableComponents() {
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

// ── Step 3: Deep scan — page + all included component files ──
async function deepScanContent(pageContent, availableComponents) {
  // Find all included pug files from the page
  const includeRegex = /include\s+([^\n]+\.pug)/g;
  let match;
  let allContent = pageContent;

  while ((match = includeRegex.exec(pageContent)) !== null) {
    const includePath = match[1].trim();
    // Resolve relative to src/pages/
    const resolved = path.resolve('src/pages', includePath);
    try {
      const includeContent = await fs.readFile(resolved, 'utf8');
      allContent += '\n' + includeContent;

      // Also scan components included by the component
      const subIncludes = includeContent.match(/include\s+([^\n]+\.pug)/g) || [];
      for (const sub of subIncludes) {
        const subPath = sub.replace('include', '').trim();
        const subResolved = path.resolve(path.dirname(resolved), subPath);
        try {
          allContent += '\n' + await fs.readFile(subResolved, 'utf8');
        } catch {}
      }
    } catch {}
  }

  return allContent;
}

function detectComponents(content, availableComponents) {
  const used = new Set();
  for (const comp of availableComponents) {
    // include ../components/hero/_hero.pug
    if (content.includes(`/components/${comp}/`)) { used.add(comp); continue; }
    // +hero( or +hero — mixin calls
    if (new RegExp(`\\+${comp}[\\s\\(]`, 'i').test(content)) { used.add(comp); continue; }
    // .btn-* class usage — detect button
    if (comp === 'button' && /\.btn[-\w]|class=["'][^"']*btn/.test(content)) { used.add(comp); continue; }
    // .section, .card etc — class usage
    if (new RegExp(`\\.${comp}[\\s\\n{(]`).test(content)) { used.add(comp); continue; }
  }
  return [...used];
}

// ── Step 4: Rewrite css blocks in every page file ─────────────
const availableComponents = await getAvailableComponents();
const pageFiles = (await fs.readdir('src/pages').catch(() => []))
  .filter(f => f.endsWith('.pug'));

for (const file of pageFiles) {
  const pageName = path.basename(file, '.pug');
  const filePath = `src/pages/${file}`;
  let content = await fs.readFile(filePath, 'utf8');

  // Strip existing css blocks
  content = content
    .replace(/\nblock pagecss\n(?:[ \t]+[^\n]*\n)*/g, '\n')
    .replace(/\nblock componentcss\n(?:[ \t]+[^\n]*\n)*/g, '\n')
    .replace(/\n{3,}/g, '\n\n');

  let pageBlock = '';
  let compBlock = '';

  if (MODE === 'single') {
    pageBlock = `\nblock pagecss\n`;
    compBlock = `\nblock componentcss\n`;

  } else if (MODE === 'per-page') {
    pageBlock = `\nblock pagecss\n  link(rel="stylesheet" href="assets/css/pages/${pageName}.css")\n`;
    compBlock = `\nblock componentcss\n`;

  } else if (MODE === 'per-component') {
    // Deep scan — page + all included component files
    const fullContent = await deepScanContent(content, availableComponents);
    const usedComps = detectComponents(fullContent, availableComponents);
    const links = usedComps
      .map(c => `  link(rel="stylesheet" href="assets/css/components/${c}.css")`)
      .join('\n');
    pageBlock = `\nblock pagecss\n  link(rel="stylesheet" href="assets/css/pages/${pageName}.css")\n`;
    compBlock = usedComps.length
      ? `\nblock componentcss\n${links}\n`
      : `\nblock componentcss\n`;

    console.log(`   ${file}: detected [${usedComps.join(', ') || 'none'}]`);
  }

  content = content.replace(/(extends [^\n]+\n)/, `$1${pageBlock}${compBlock}`);
  await fs.writeFile(filePath, content);
}

console.log(`✅ CSS blocks updated → ${pageFiles.length} pages`);

// ── Step 5: Compile Pug ───────────────────────────────────────
const isWatch = process.argv.includes('--watch');
if (isWatch) {
  const child = spawn('pug', ['-w', '-P', './src/pages', '-o', './dist'], {
    stdio: 'inherit', shell: true
  });
  child.on('error', err => { console.error(err.message); process.exit(1); });
} else {
  execSync('pug -P ./src/pages -o ./dist', { stdio: 'inherit' });
}
