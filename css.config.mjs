// ============================================================
// CSS MODE CONFIG
// Change this ONE setting to switch CSS strategy for the project
// ============================================================

export const CSS_MODE = 'single'; // 'single' | 'per-page' | 'per-component'

// ── MODE DESCRIPTIONS ────────────────────────────────────────
//
// 'single'        — One app.css for all pages
//                   Best for: small sites (under 10 pages),
//                   quick projects, when all pages share most components
//                   Backend: link one CSS file, done
//
// 'per-page'      — Separate CSS per page (index.css, about.css etc)
//                   Best for: large sites where pages use very different
//                   components, Lighthouse score matters
//                   Backend: each page template links its own CSS
//
// 'per-component' — Each component has its own CSS file
//                   Best for: multi-backend projects where editors
//                   move components between pages freely,
//                   headless CMS, Drupal/WordPress with flexible layouts
//                   Backend: include component CSS when rendering that component
//
// ── PER-COMPONENT SETTINGS ───────────────────────────────────
// Only used when CSS_MODE = 'per-component'
export const COMPONENTS = [
  'button',
  'card',
  'hero',
  'nav',
  'section',
  // Add new components here as you build them
];

// ── PER-PAGE SETTINGS ────────────────────────────────────────
// Only used when CSS_MODE = 'per-page'
// Maps page name → which components it needs
export const PAGES = {
  index: ['hero', 'card', 'section', 'button'],
  about: ['section'],
  // Add new pages here:
  // services: ['section', 'card'],
  // contact:  ['section'],
};
