# Agency Starter — v14

**Bootstrap 5 · Pug · SCSS · Alpine.js · Swiper 12 · Vite 6**

A production-ready frontend starter kit for agency projects. One config file controls CSS delivery mode, auto-detection handles page/component wiring, and a full scaffold CLI means no boilerplate to write by hand.

---

## Stack

| Tool | Version | Role |
|------|---------|------|
| Bootstrap | 5.3 | Grid, utilities, UI framework |
| Pug | Latest | HTML templating with mixins |
| SCSS | Latest | Styles — layers + design tokens |
| Alpine.js | 3.14 | Lightweight JS interactivity |
| Swiper | 12 | Touch carousels and sliders |
| Vite | 6 | Dev server + HMR |
| PostCSS | 8 | Autoprefixer + PurgeCSS + cssnano |

---

## Quick Start

```bash
# Start from the template
npx degit manikantanapplab/agency-starter my-project
cd my-project
npm install
npm run dev
# → http://localhost:3000
```

**The only file you configure per project:** `project.config.mjs`

```js
export const MODE     = 'per-page';  // CSS delivery mode (see below)
export const CRITICAL = false;       // true before final delivery
```

---

## All Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server + watch Pug, SCSS, JS, assets |
| `npm run build` | Compile all — sourcemaps ON |
| `npm run build:prod` | Full build + PurgeCSS + Critical CSS |
| `npm run build:be` | Pug + SCSS + JS only (skip PostCSS) |
| `npm run build:sass:dev` | SCSS compile without watch |
| `npm run new <name>` | Scaffold new component |
| `npm run page <name>` | Scaffold new page |
| `npm run copy:js` | Copy `src/js/` → `dist/assets/js/` |
| `npm run copy:assets` | Copy `src/assets/` → `dist/assets/` |
| `npm run format` | Prettier — all .scss, .js, .pug |
| `npm run showcase` | Build full component showcase HTML |

---

## CSS Modes

Change `MODE` in `project.config.mjs` and restart `npm run dev`.

| Mode | Best for | Output |
|------|----------|--------|
| `single` | Landing pages, small/medium sites | One `app.css` for all pages |
| `per-page` | Large sites, pages differ significantly | `pages/name.css` per page |
| `per-component` | Drupal / WP / Laravel / .NET | `base.css` + one CSS per component |

### per-component — Auto-Detection

`build-pug.mjs` deep-scans each page and all included component files, then writes `<link>` tags automatically. No manual CSS linking needed.

```
include ../components/hero/_hero.pug   → hero.css auto-linked
+card(data)                            → card.css auto-linked
.btn.btn-outline-gray-1                → button.css auto-linked
```

---

## Project Structure

```
project.config.mjs            ← YOUR CONTROL PANEL (only file to touch per project)
vite.config.js                ← Dev server config (port 3000)
postcss.config.js             ← Autoprefixer + PurgeCSS + cssnano (auto-runs in prod)
critical.mjs                  ← Critical CSS extractor config

src/
  assets/
    images/                   ← Put images here — auto-copied to dist/
    fonts/                    ← Local font files

  components/name/
    _name.pug                 ← Pug mixin (component template)
    name.scss                 ← Component styles
    name.preview.html         ← Standalone browser preview
    name.utilities.generated.scss  ← Auto-generated (do not edit)

  layouts/
    _base.pug                 ← AUTO-GENERATED — never edit directly
    _header.pug               ← EDIT: logo, nav links, fonts
    _footer.pug               ← EDIT: copyright, links

  pages/
    index.pug                 ← Home page
    about.pug                 ← About page (created via npm run page)

  sass/
    base/
      _layers.scss            ← @layer order (reset, base, bootstrap, components, utilities)
      _bootstrap.scss         ← Bootstrap wrapped in @layer
      _reset.scss             ← CSS reset
      _base.scss              ← Global base styles
      base-only.scss          ← Entry point for per-component mode

    tokens/
      _colors.scss            ← EDIT: brand colors, dark mode overrides
      _typography.scss        ← EDIT: font families, fluid type scale
      _spacing.scss           ← Spacing scale

    pages/
      _shared.scss            ← Shared styles for per-page mode
      index.scss              ← Page-specific styles
      about.scss

    utilities/
      _mixins.scss            ← fluid-steps(), rem(), size() helpers
      _functions.scss         ← g-* gap, fs-* font-size utility loops

    app.scss                  ← AUTO-GENERATED — never edit

  js/
    components.js             ← Alpine.js component registrations
    swiper-init.js            ← Swiper auto-initializer

scaffold/                     ← Build automation — do not edit
  build-pug.mjs
  build-sass.mjs
  build-showcase.mjs
  new-component.mjs
  new-page.mjs
  postcss-build.mjs
  run-critical.mjs
  watch-assets.mjs
  watch-js.mjs

dist/                         ← Compiled output — hand to BE team
```

**Two files that are auto-generated on every `npm run dev` — never edit:**
- `src/layouts/_base.pug`
- `src/sass/app.scss`

---

## Design Tokens

All tokens live in `src/sass/tokens/`. Change once — updates everywhere.

### Colors (`_colors.scss`)

```scss
:root {
  --color-primary:        #2563EB;   // ← brand color
  --color-primary-dark:   #1D4ED8;
  --color-secondary:      #F59E0B;
  --color-secondary-dark: #D97706;

  --color-white: #FFFFFF;
  --color-black: #0A0A0A;

  // Semantic
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-error:   #DC2626;
  --color-info:    #0284C7;

  // Gray scale
  --color-gray-100: #F5F5F5;
  --color-gray-200: #EBEBEB;
  --color-gray-300: #EDEDED;
  --color-gray-400: #C4C4C4;
  --color-gray-500: #9E9E9E;
  --color-gray-600: #757575;
  --color-gray-700: #616161;
  --color-gray-800: #424242;
  --color-gray-900: #212121;

  // Semantic references (use these in components)
  --color-text-primary:   var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-bg-body:        var(--color-white);
  --color-bg-subtle:      var(--color-gray-100);
  --color-bg-muted:       var(--color-gray-200);
  --color-border:         var(--color-gray-300);
  --color-border-soft:    #EDEDED80; // 50% opacity
}
```

Dark mode — tokens auto-switch when `data-theme="dark"` is on `<html>`:

```scss
[data-theme="dark"] {
  --color-bg-body:        #212121;
  --color-text-primary:   #F5F5F5;
  --color-text-secondary: #9E9E9E;
  --color-border:         #424242;
  // ... rest auto-overrides
}
```

### Typography (`_typography.scss`)

Fluid type scale — sizes scale smoothly between 320px and 1920px viewports:

```scss
--text-xs:   clamp(0.75rem, ...);    // 12px static
--text-sm:   clamp(0.875rem, ...);   // 14px static
--text-base: clamp(1rem, ...);       // 16px static
--text-md:   clamp(1rem, ..., 1.125rem);   // 16px → 18px
--text-lg:   clamp(1.125rem, ..., 1.25rem); // 18px → 20px
--text-xl:   clamp(1.25rem, ..., 1.5rem);   // 20px → 24px
--text-2xl:  clamp(1.5rem, ..., 2rem);      // 24px → 32px
--text-3xl:  clamp(1.75rem, ..., 2.5rem);   // 28px → 40px
--text-4xl:  clamp(2rem, ..., 3.5rem);      // 32px → 56px
--text-5xl:  clamp(2.5rem, ..., 5rem);      // 40px → 80px
```

Font weights: `--font-light` (300) · `--font-regular` (400) · `--font-medium` (500) · `--font-semi` (600) · `--font-bold` (700)

### Spacing (`_spacing.scss`)

```scss
--space-4:   0.25rem;  //  4px
--space-8:   0.5rem;   //  8px
--space-16:  1rem;     // 16px
--space-24:  1.5rem;   // 24px
--space-32:  2rem;     // 32px
--space-48:  3rem;     // 48px
--space-64:  4rem;     // 64px
--section-padding-y: clamp(2rem, 5vw, 5rem);  // fluid section spacing
```

---

## SCSS Utilities

### `rem()` — px to rem

```scss
@use '../../sass/utilities/mixins' as *;

padding:       rem(24);   // → 1.5rem
font-size:     rem(14);   // → 0.875rem
border-radius: rem(8);    // → 0.5rem
```

### `fluid-steps()` — fluid scaling

```scss
// Font size scales from 32px (mobile) to 72px (desktop)
@include fluid-steps(font-size, (32px, 72px));

// Padding changes at 3 breakpoints
@include fluid-steps(padding-block, (24px, 48px, 80px));
```

### Dynamic utility classes (use in Pug)

Generated from `_functions.scss` — use directly in Pug templates:

```pug
//- Font sizes: fs-[px] for fixed, fs-[min]f[max] for fluid
h2.fs-32          // font-size: 2rem
p.fs-14           // font-size: 0.875rem
h1.fs-18f24f30    // fluid: 18px → 24px → 30px

//- Gaps: g-[px]
.d-flex.g-16      // gap: 1rem
.d-flex.g-24      // gap: 1.5rem

//- Fixed square size
a.btn.size-48     // width: 3rem; height: 3rem

//- Margin/padding: [prefix]-[breakpoint?]-[px]
.mb-16            // margin-bottom: 1rem
.pt-md-24         // padding-top: 1.5rem (from md breakpoint)
.mx-32            // margin-inline: 2rem
```

### `@layer components` — required for all component SCSS

Every component must wrap styles in `@layer components` to override Bootstrap without `!important`:

```scss
@use '../../sass/utilities/mixins' as *;

@layer components {
  .my-component {
    padding: rem(24);
    color: var(--color-text-primary);
  }
}
```

---

## Components

### Built-in components

| Component | Key props |
|-----------|-----------|
| `hero` | `title`, `text`, `tag`, `bg`, `primaryBtn`, `secondaryBtn`, `centered` |
| `card` | `title`, `text`, `image`, `link`, `tag` |
| `section` | `.section`, `.section-muted`, `.section-dark` utility classes |
| `carousel` | Alpine — `slides`, `autoplay`, `loop`, `arrows`, `dots` |
| `swiper` | `slides`, `effect`, `perView`, `perViewMd`, `perViewLg`, `gap`, `loop`, `autoplay` |
| `testimonial` | `title`, `text` |
| `page-aside` | `title`, `text` |
| `app-head` | `title`, `text`, `icon`, `titleClass`, `textClass` |
| `breadcrumb` | `items` array: `{ label, link }` |
| `apicard` | API feature card display |
| `nav` | `navLinks`, `navDropdown` mixins |

### Create a new component

```bash
npm run new card-grid
npm run new pricing-table
npm run new testimonial-slider
```

Creates `src/components/name/` with:
- `_name.pug` — mixin template
- `name.scss` — styles with `@use` and `@layer components`
- `name.preview.html` — standalone browser preview

### Pug mixin pattern

```pug
//- src/components/hero/_hero.pug
mixin hero(data)
  - const size = data.size || 'md'
  section.hero(class=`hero-${size} ${data.class || ''}`)
    .container
      if data.tag
        span.hero-tag= data.tag
      if data.title
        h1.hero-title= data.title
      if data.text
        p.hero-text= data.text
      if data.primaryBtn
        a.btn.btn-primary(href=data.primaryBtn.link)= data.primaryBtn.label
      block
```

### SCSS pattern

```scss
// src/components/hero/hero.scss
@use '../../sass/utilities/mixins' as *;

@layer components {
  .hero {
    padding-block: var(--section-padding-y);

    &-title {
      font-size: var(--text-4xl);
      font-weight: var(--font-bold);
      color: var(--color-text-primary);
    }

    &-text {
      font-size: var(--text-lg);
      color: var(--color-text-secondary);
      max-width: 55ch;
    }
  }
}
```

### Use in a page

```pug
extends ../layouts/_base.pug

block content
  include ../components/hero/_hero.pug

  +hero({
    tag:         'Welcome',
    title:       'Agency Starter',
    text:        'Fast, modern, maintainable.',
    primaryBtn:  { label: 'Get Started', link: '#' }
  })
```

---

## Pages

### Create a new page

```bash
npm run page services
npm run page blog-post
```

Creates:
- `src/pages/name.pug`
- `src/sass/pages/name.scss`

### Page template structure

```pug
extends ../layouts/_base.pug

//- ↓ auto-managed by build-pug.mjs — do not manually edit these blocks
block pagecss
block componentcss
  link(rel="stylesheet" href="assets/css/components/hero.css")
//- ↑ auto-managed

block title
  | Services | Company Name

block content
  include ../components/hero/_hero.pug
  +hero({ title: 'Our Services' })
```

### Available blocks

| Block | Purpose |
|-------|---------|
| `block title` | Page `<title>` tag |
| `block head` | Extra `<head>` content (meta, custom fonts) |
| `block pagecss` | Auto-managed per-page CSS |
| `block componentcss` | Auto-managed component CSS |
| `block content` | Page body content |
| `block scripts` | Extra scripts before `</body>` |

---

## Alpine.js Components

All registered in `src/js/components.js` — available on every page, no imports needed.

| `x-data=""` | What it does |
|------------|-------------|
| `navbar` | Scroll detection → adds `.is-scrolled` class on header |
| `themeToggle` | Dark/light theme toggle, persists in localStorage |
| `modal` | Show/hide with body scroll lock |
| `tabs(0)` | Active tab state management |
| `accordion` | Toggle open/close state |
| `counter(500, 2000)` | Animates 0→N over Nms on scroll into view |
| `carousel({...})` | Lightweight slider, no Swiper dependency |
| `form` | Fetch submit with loading/success/error states |

### Usage examples

```pug
//- Navbar scroll state
nav.site-header(x-data="navbar" :class="{ 'is-scrolled': scrolled }")

//- Dark mode toggle button
button(x-data="themeToggle" @click="toggle") Toggle Theme

//- Tabs
div(x-data="tabs(0)")
  button(@click="setTab(0)" :class="{ active: isActive(0) }") Tab 1
  button(@click="setTab(1)" :class="{ active: isActive(1) }") Tab 2
  div(x-show="isActive(0)") Content 1
  div(x-show="isActive(1)") Content 2

//- Accordion
div(x-data="accordion")
  button(@click="toggle(0)") Question 1
  div(x-show="isOpen(0)") Answer 1

//- Animated counter
div(x-data="counter(500, 2000)")
  span(x-text="value")
```

---

## Swiper Component

```pug
include ../components/swiper/_swiper.pug

//- Basic
+swiper({ slides: slides })

//- Multi-slide responsive
+swiper({ slides: slides, perView: 1, perViewMd: 2, perViewLg: 3, gap: 24 })

//- Fade effect
+swiper({ slides: slides, effect: 'fade' })

//- Autoplay
+swiper({ slides: slides, autoplay: true, interval: 5000 })

//- With thumbnails
+swiper({ slides: slides, id: 'main', thumbs: true, thumbsId: 'thumbs' })
+swiperThumbs({ slides: slides, id: 'thumbs' })
```

Slide object shape:
```js
{
  image: 'assets/images/slide.jpg',
  alt:   'Description',
  tag:   'Label',
  title: 'Slide Title',
  text:  'Description text',
  btn:   { label: 'CTA', link: '#' }
}
```

---

## Dark Mode & RTL

```pug
//- Dark mode
html(lang="en" dir="ltr" data-theme="dark")

//- RTL (Arabic, etc.)
html(lang="ar" dir="rtl" data-theme="light")
```

All color tokens and Bootstrap layout flip automatically. No extra CSS needed.

---

## Production Build

```bash
npm run build:prod
```

Pipeline:
1. `build-pug.mjs` → Pug → HTML (CSS blocks auto-written per mode)
2. `build-sass.mjs --compressed` → SCSS → CSS (compressed, sourcemaps ON)
3. `copy:js` + `copy:assets` → JS and images to `dist/`
4. `postcss-build.mjs` → PurgeCSS removes unused classes, cssnano minifies
5. `run-critical.mjs` → Critical CSS inlined in `<head>` (only if `CRITICAL = true`)

Hand the `dist/` folder to the BE team.

### Before final delivery

```js
// project.config.mjs
export const CRITICAL = true;
```

### If PurgeCSS removes a class you need

```js
// postcss.config.js
safelist: {
  standard: ['show', 'active', 'my-dynamic-class', /^swiper-/]
}
```

### Sourcemaps

| Command | Sourcemaps |
|---------|-----------|
| `npm run dev` | ON (full paths, dev mode) |
| `npm run build` | ON (compressed) |
| `npm run build:prod` | ON (compressed) |
| Manual: `node scaffold/build-sass.mjs --compressed --no-source-map` | OFF (final client delivery only) |

---

## New Project Checklist

```
□ npx degit manikantanapplab/agency-starter my-project
□ cd my-project && npm install
□ project.config.mjs         → set MODE (start with 'single' if unsure)
□ tokens/_colors.scss         → brand colors
□ tokens/_typography.scss     → font family
□ _header.pug                 → logo, nav links, Google Fonts URL
□ _footer.pug                 → company name, links
□ npm run page <n>            × create all pages
□ npm run new <n>             × create all components
□ npm run dev                 → start building
□ CRITICAL = true             → before final delivery
□ npm run build:prod          → before BE handoff
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Styles not updating | Save the SCSS file — watch auto-recompiles |
| New component CSS not loading | Restart `npm run dev` — detection runs on startup |
| `rem() not found` | Add `@use '../../sass/utilities/mixins' as *;` at top of SCSS |
| Bootstrap overrides component styles | Wrap styles in `@layer components {}` |
| `var(--token)` not working | Check for missing semicolons in token files |
| Image not showing | `npm run copy:assets` or restart dev |
| JS changes not reflecting | `npm run copy:js` or restart dev |
| Class removed in prod build | Add to `safelist` in `postcss.config.js` |
| `pug: command not found` | `npm install -g pug-cli` |
| `sass: command not found` | `npm install -g sass` |
| Port 3000 already in use | Change `port` in `vite.config.js` |
| Mode switch not working | `Ctrl+C` → change `MODE` → `npm run dev` |
| `_base.pug` changes lost | It's auto-generated — edit `_header.pug` / `_footer.pug` instead |

---

## Resources

- Bootstrap 5 docs: https://getbootstrap.com/docs/5.3
- Alpine.js docs: https://alpinejs.dev
- Swiper docs: https://swiperjs.com/swiper-api
- Pug docs: https://pugjs.org
- SCSS docs: https://sass-lang.com/documentation
- OKLCH color converter: https://oklch.com
