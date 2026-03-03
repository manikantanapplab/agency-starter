# BS Package v14

**Bootstrap 5 · Pug · SCSS · Alpine.js · Vite 6**

Agency-scale frontend build system. Auto-detection, 3 CSS modes, sourcemaps, PurgeCSS, Critical CSS — one config file controls everything.

---

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

**Only file you configure:** `project.config.mjs`

---

## Project Config

```js
export const MODE     = 'single';  // 'single' | 'per-page' | 'per-component'
export const CRITICAL = false;     // true = inline above-fold CSS (set before delivery)
```

That's it. Pages, components, CSS targets — all auto-detected.

---

## CSS Modes

| MODE | Best for | Output |
|------|----------|--------|
| `single` | Landing pages, small–medium sites | One `app.css` for all pages |
| `per-page` | Large sites, pages very different | `pages/name.css` per page |
| `per-component` | Drupal / WP / Laravel / .NET | `base.css` + one CSS per component |

**Switch mode:** change `MODE` → restart `npm run dev`. Everything updates.

### per-page — what to add per page

```scss
// src/sass/pages/about.scss
@use 'shared';
@use '../../components/section/section';
@use '../../components/testimonial/testimonial';
```

### per-component — auto-detection

`build-pug.mjs` scans each page for component usage and writes `<link>` tags automatically:

```pug
include ../components/hero/_hero.pug   → hero.css
+hero(data)                            → hero.css
section.section                        → section.css
```

---

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server + watch pug + watch sass |
| `npm run build` | Compile everything, sourcemaps ON |
| `npm run build:prod` | Full build + PurgeCSS + critical CSS |
| `npm run build:be` | Pug + sass + JS only (no postcss) |
| `npm run build:sass:dev` | Compile sass without compression |
| `npm run new <name>` | Scaffold new component |
| `npm run page <name>` | Scaffold new page |
| `npm run format` | Prettier all source files |
| `npm run showcase` | Build component showcase |

### build:prod pipeline

```
1. Pug      → HTML  (CSS blocks auto-written per mode)
2. SCSS     → CSS   (all targets, compressed, sourcemaps ON)
3. JS copy  → dist/assets/js
4. PurgeCSS → removes unused classes (280kb → ~15kb)
5. Critical → inlines above-fold CSS (if CRITICAL=true)
```

---

## Sourcemaps

Sourcemaps let DevTools show the exact `.scss` file and line — not compiled `app.css`.

| Command | Sourcemaps |
|---------|-----------|
| `npm run dev` | ON |
| `npm run build` | ON |
| `npm run build:prod` | ON |
| Final delivery (no maps) | `node scaffold/build-sass.mjs --compressed --no-source-map` |

---

## CSS Layer Architecture

```scss
@layer reset, base, bootstrap, components, utilities;
//                   ↑           ↑
//              Bootstrap    your CSS — always wins
```

Higher layers always win regardless of selector specificity. Your `.hero-title` in `@layer components` beats Bootstrap's `h2` in `@layer bootstrap` — no `!important` needed.

Bootstrap is wrapped using `meta.load-css()` (not `@use`) because `@use` cannot go inside `@layer`:

```scss
// src/sass/base/_bootstrap.scss
@use "sass:meta";
@layer bootstrap {
  @include meta.load-css('../../../node_modules/bootstrap/scss/bootstrap');
}
```

**Rule: every component SCSS must be wrapped in `@layer components {}`.**

---

## Design Tokens

All tokens in `src/sass/tokens/`. Change once — everything updates.

### Colors (OKLCH)

```scss
// _colors.scss — edit per project
:root {
  --color-primary:        oklch(60% 0.2 250);  // hue 250 = blue
  --color-primary-light:  oklch(75% 0.18 250);
  --color-primary-dark:   oklch(40% 0.22 250);
  --color-secondary:      oklch(75% 0.18 85);  // hue 85 = amber

  // Semantic — use these in components, never raw colors
  --color-text-primary:   var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-bg-body:        var(--color-white);
  --color-bg-subtle:      var(--color-gray-100);
  --color-border:         var(--color-gray-300);
}

[data-theme="dark"] {
  --color-bg-body:        oklch(13% 0 0);
  --color-text-primary:   oklch(95% 0 0);
  --color-border:         oklch(28% 0 0);
}
```

Convert hex → OKLCH: https://oklch.com

**OKLCH format:** `oklch(Lightness% Chroma Hue)`
- Lightness: 0% = black, 100% = white
- Chroma: 0 = grey, 0.37 = max saturated
- Hue: 0–360 (0 = red, 145 = green, 250 = blue)

### Typography

```scss
// px ÷ 16 = rem  |  mobile(320px) → desktop(1920px)
--text-xs:   clamp(0.75rem, 0.690rem + 0.003vw, 0.75rem);  // 12px → 12px
--text-sm:   clamp(0.875rem,0.785rem + 0.005vw, 0.875rem); // 14px → 14px
--text-base: clamp(0.875rem,0.850rem + 0.008vw, 1rem);     // 14px → 16px
--text-lg:   clamp(1.125rem,1.100rem + 0.008vw, 1.25rem);  // 18px → 20px
--text-xl:   clamp(1.25rem, 1.200rem + 0.016vw, 1.5rem);   // 20px → 24px
--text-2xl:  clamp(1.5rem,  1.400rem + 0.031vw, 2rem);     // 24px → 32px
--text-3xl:  clamp(1.75rem, 1.600rem + 0.047vw, 2.5rem);   // 28px → 40px
--text-4xl:  clamp(2rem,    1.700rem + 0.094vw, 3.5rem);   // 32px → 56px
--text-5xl:  clamp(2.5rem,  2.000rem + 0.156vw, 5rem);     // 40px → 80px

--leading-tight:  1.2;  // headings
--leading-normal: 1.6;  // body
--font-light: 300;  --font-regular: 400;
--font-semi:  600;  --font-bold:    700;
```

Change font: update `--font-primary` in `_typography.scss` + Google Fonts URL in `_header.pug` (build regenerates `_base.pug`).

### Spacing

```scss
--space-1: 0.25rem;  // 4px      --space-8:  2rem;   // 32px
--space-2: 0.5rem;   // 8px      --space-10: 2.5rem; // 40px
--space-3: 0.75rem;  // 12px     --space-12: 3rem;   // 48px
--space-4: 1rem;     // 16px     --space-16: 4rem;   // 64px
--space-5: 1.25rem;  // 20px     --space-20: 5rem;   // 80px
--space-6: 1.5rem;   // 24px     --space-24: 6rem;   // 96px

--section-padding-y: clamp(2rem, 5vw, 5rem);  // fluid section spacing
--inner-width: 1484px;
```

---

## SCSS Mixins

All in `src/sass/utilities/_mixins.scss`. Add `@use '../../sass/utilities/mixins' as *;` at top of file to use.

### fluid-steps() — fluid scaling in px

For padding, gaps, custom font sizes not in the token scale.

```scss
// 2 values — simple fluid
@include fluid-steps(padding-block, (48px, 96px));

// 3 values — slope changes at midpoint
@include fluid-steps(font-size, (32px, 48px, 72px));

// 4 values — 3 slope changes
@include fluid-steps(padding, (16px, 24px, 40px, 56px));

// Multiple props at once
@include fluid-steps((font-size, line-height), (32px, 52px));

// Custom breakpoints
@include fluid-steps(font-size, (32px, 72px), (375px, 1440px));

// Viewport-relative widths
@include fluid-steps(width, (20vw, 50vw, 100vw));
```

❌ Never pass `var(--token)` to `fluid-steps` — it needs real px values to calculate at compile time.

### rem() — px to rem

```scss
font-size: rem(28);          // → 1.75rem
padding: rem(12) rem(24);    // → 0.75rem 1.5rem
```

### fluid-px() — fluid with px values inline

```scss
font-size: fluid-px(28, 48);                 // fluid 28px → 48px
font-size: fluid-px(28, 48, 375px, 1440px);  // custom breakpoints
```

### When to use what

| Situation | Use |
|-----------|-----|
| Standard text size | `font-size: var(--text-3xl)` |
| Standard spacing | `padding: var(--space-8)` |
| Custom fluid font size | `@include fluid-steps(font-size, (40px, 72px))` |
| Section/card padding | `@include fluid-steps(padding-block, (32px, 80px))` |
| Specific px from Figma | `font-size: rem(13)` |

### Other mixins

```scss
@include flex-center          // display:flex; align+justify: center
@include flex-between         // display:flex; align:center; justify:space-between
@include img-cover            // width/height 100%; object-fit:cover
@include truncate(1)          // single-line ellipsis
@include truncate(3)          // -webkit-line-clamp: 3
@include visually-hidden      // screen-reader only
@include hover-anim(300ms)    // transition: all 300ms ease
@include size(40px)           // width + height: 40px
@include padding-inline(16px) // RTL-aware padding
```

---

## Components

### Create

```bash
npm run new hero
npm run new pricing-table
```

Creates `src/components/name/` with `_name.pug`, `name.scss`, `name.preview.html`.

### Pug mixin pattern

```pug
//- src/components/hero/_hero.pug
mixin hero(data)
  section.hero(
    class=data.centered ? 'hero-centered' : ''
    style=data.bg ? `background-image:url(${data.bg})` : ''
  )
    .container
      .hero-content
        if data.tag
          span.hero-tag= data.tag
        h1.hero-title= data.title
        if data.text
          p.hero-text= data.text
        if data.primaryBtn
          a.btn.btn-primary.btn-lg(href=data.primaryBtn.link)= data.primaryBtn.label
```

### SCSS pattern

```scss
// src/components/hero/hero.scss
// ALWAYS wrap in @layer components
@layer components {
  .hero {
    padding-block: var(--section-padding-y);

    &-title {
      font-size: var(--text-5xl);
      font-weight: var(--font-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-6);
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
    tag: 'Welcome',
    title: 'Frontend Built Right',
    text: 'Fast, modern, maintainable.',
    primaryBtn: { label: 'Get Started', link: '#' }
  })
```

### Built-in components

| Component | Mixin | Key props |
|-----------|-------|-----------|
| `hero` | `+hero(data)` | `title`, `text`, `tag`, `bg`, `centered`, `primaryBtn`, `secondaryBtn` |
| `card` | `+card(data)` | `title`, `text`, `tag`, `image`, `link`, `featured`, `horizontal` |
| `cardGrid` | `+cardGrid(cards, cols)` | array of cards, column count (2/3/4) |
| `section` | `.section` class | `.section-muted`, `.section-dark` variants |
| `testimonial` | `+testimonial(data)` | `title`, `text` |

---

## Pages

### Create

```bash
npm run page services
npm run page blog-post
```

Creates `src/pages/name.pug`, `src/sass/pages/name.scss`, `src/sass/layers/_name.scss`.

### Page structure

```pug
extends ../layouts/_base.pug

//- ↓ auto-managed by build-pug.mjs — do not edit
block pagecss
block componentcss
  link(rel="stylesheet" href="assets/css/components/hero.css")
//- ↑ auto-managed

block title
  | Services | Company Name

block content
  include ../components/hero/_hero.pug
  include ../components/section/_section.pug

  +hero({ title: 'Our Services', text: 'What we do.' })

  section.section
    .container
      .section-header
        span.section-tag What we offer
        h2.section-title Our Capabilities
        p.section-text Description here.
```

### Available blocks

| Block | Purpose |
|-------|---------|
| `block title` | Page `<title>` content |
| `block head` | Extra `<head>` content |
| `block pagecss` | Auto-managed — do not edit |
| `block componentcss` | Auto-managed — do not edit |
| `block content` | Page body |
| `block scripts` | Extra scripts before `</body>` |

---

## Alpine.js

All components registered in `src/js/components.js`. Available on every page.

### Built-in components

| `x-data=""` | What it does |
|------------|-------------|
| `navbar` | Scroll detection → `.is-scrolled` class on header |
| `themeToggle` | Dark/light toggle, persists to localStorage |
| `modal` | Show/hide with body scroll lock |
| `tabs(0)` | Active tab state, `setTab(index)`, `isActive(index)` |
| `accordion` | Toggle open/close, `toggle(index)`, `isOpen(index)` |
| `counter(500, 2000)` | Animates number 0→500 on scroll into view |
| `form` | Fetch submit with `loading`, `success`, `error` states |

### Usage examples

```pug
//- Navbar scroll state
nav.navbar.site-header(x-data="navbar" :class="{ 'is-scrolled': scrolled }")

//- Dark mode toggle
button(x-data="themeToggle" @click="toggle")
  i.bi(x-show="!dark" class="bi-moon-fill")
  i.bi(x-show="dark" class="bi-sun-fill")

//- Counter
div(x-data="counter(500, 2000)")
  span.stat-number(x-text="value")

//- Tabs
div(x-data="tabs(0)")
  button(@click="setTab(0)" :class="{ active: isActive(0) }") Tab 1
  button(@click="setTab(1)" :class="{ active: isActive(1) }") Tab 2
  div(x-show="isActive(0)") Content 1
  div(x-show="isActive(1)") Content 2

//- Toggle show/hide (inline, no registration needed)
div(x-data="{ open: false }")
  button(@click="open = !open") Toggle
  div(x-show="open") Hidden content
```

---

## Dark Mode & RTL

Dark mode: add `data-theme="dark"` to `<html>`. All `var(--color-*)` tokens switch automatically.

RTL: change `dir="ltr"` to `dir="rtl"` on `<html>`. Bootstrap handles all layout flipping.

```pug
//- _base.pug (auto-generated — change in build-pug.mjs if needed)
html(lang="en" dir="ltr" data-theme="light")

//- Arabic RTL
html(lang="ar" dir="rtl" data-theme="light")
```

---

## Production Build & Delivery

```bash
npm run build:prod
```

Hands the `dist/` folder to BE team:

```
dist/
  index.html            ← ready-to-integrate
  about.html
  assets/
    css/
      app.css + .map    ← sourcemaps included
      base.css + .map
      components/
      pages/
    js/
      components.js
```

**PurgeCSS safelist** — if dynamic classes disappear, add to `postcss.config.js`:

```js
safelist: ['my-class', /^dynamic-prefix-/]
```

---

## Critical CSS

Set `CRITICAL = true` before final delivery.

Inlines above-fold CSS in `<head>` — browser paints immediately, no render-blocking CSS.

What gets inlined: CSS custom properties, dark mode tokens, navbar, hero, base typography.

```html
<!-- inlined -->
<style data-critical>:root { ... } .navbar { ... } .hero { ... }</style>

<!-- full CSS loads async, non-blocking -->
<link rel="stylesheet" href="assets/css/app.css"
      media="print"
      onload="this.onload=null;this.removeAttribute('media')">
```

Disable for intranets, admin tools, pages behind login.

---

## Project Structure

```
project.config.mjs          ← YOUR CONTROL PANEL (only file you configure)

src/
  components/name/
    _name.pug               ← mixin
    name.scss               ← styles (auto-imported)
    name.preview.html

  layouts/
    _base.pug               ← AUTO-GENERATED — never edit
    _header.pug             ← EDIT: logo, nav links
    _footer.pug             ← EDIT: copyright, links
    header.scss

  pages/
    index.pug               ← page content
    name.pug                ← npm run page creates these

  sass/
    app.scss                ← AUTO-GENERATED — never edit
    base/
      _layers.scss          ← @layer order
      _bootstrap.scss       ← Bootstrap in @layer (meta.load-css)
      _reset.scss
      _base.scss
      base-only.scss        ← per-component mode entry
    tokens/
      _colors.scss          ← EDIT: brand colors
      _typography.scss      ← EDIT: fonts
      _spacing.scss
    layers/                 ← page styles (single mode, auto-scanned)
      _about.scss
    pages/                  ← per-page mode entry points
      _shared.scss
      about.scss
    utilities/
      _mixins.scss          ← fluid-steps, rem, flex-center, etc.
      _functions.scss       ← utility classes

  js/
    components.js           ← Alpine.js registrations

dist/                       ← compiled output → hand to BE team
scaffold/                   ← build automation — do not edit
```

---

## Multi-Developer Workflow

**Day 1 (lead dev):**

```bash
cp -r bs-v14-package client-name && cd client-name
npm install
# Edit project.config.mjs, tokens/, _header.pug, _footer.pug
npm run page <name>   # × all pages upfront
npm run new <name>    # × all components upfront
git init && git add . && git commit -m "initial: v14 setup"
```

**.gitignore:**

```
node_modules/
dist/
dist-build/
.DS_Store
```

**File ownership:**

| File | Rule |
|------|------|
| `tokens/` | Lead dev only |
| `_header.pug`, `_footer.pug` | Lead dev only |
| `_base.pug`, `app.scss` | Nobody — AUTO-GENERATED |
| `components/name/` | One dev per component |
| `pages/name.pug` | One dev per page |

Components auto-detected — no merge conflicts on `app.scss`.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Undefined mixin fluid-steps` | Add `@use '../../sass/utilities/mixins' as *;` at top of file |
| `var(--text-*) is not a number` | Pass px values to `fluid-steps`, not CSS variables |
| `@use must be before any other rules` | `@layer` declaration must live in `_layers.scss`, not inline |
| Bootstrap overrides component CSS | Wrap component SCSS in `@layer components { }` |
| Component CSS not loading (per-component) | Restart dev — detection runs at startup, not on save |
| `pug: command not found` | `npm install -g pug-cli` |
| `sass: command not found` | `npm install -g sass` |
| PurgeCSS removed a class | Add to `safelist` in `postcss.config.js` |
| Mode switch not working | `Ctrl+C` → `npm run dev` — must restart after config change |

---

## New Project Checklist

```
□ cp -r bs-v14-package client-name && cd client-name
□ npm install
□ project.config.mjs   → set MODE
□ tokens/_colors.scss  → brand colors (OKLCH)
□ tokens/_typography.scss → font family
□ _header.pug          → logo src, nav links, Google Fonts URL
□ _footer.pug          → company name, copyright year
□ npm run page <n>     × all pages
□ npm run new <n>      × all components
□ npm run dev          → start building
□ npm run build:prod   → before BE handoff
□ Set CRITICAL=true    → before final delivery
```
