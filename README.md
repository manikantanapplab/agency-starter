# Agency Starter

**Bootstrap 5 · Pug · SCSS · Alpine.js · Swiper · Vite**

A production-ready frontend starter kit for agency projects. Auto-detection, 3 CSS modes, design tokens, fluid typography, Alpine.js components — one config file controls everything.

---

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Bootstrap | 5.3 | UI framework, grid, utilities |
| Pug | Latest | HTML templating with mixins |
| SCSS | Latest | Styles with layers + tokens |
| Alpine.js | 3.14 | Lightweight JS interactivity |
| Swiper | 11 | Touch carousels and sliders |
| Vite | 6 | Dev server + HMR |

---

## Quick Start

```bash
# Clone or use template
npx degit manikantanapplab/agency-starter my-project
cd my-project
npm install
npm run dev
# → http://localhost:3000
```

**Only file you configure per project:** `project.config.mjs`

```js
export const MODE     = 'per-component'; // CSS delivery mode
export const CRITICAL = false;           // true before final delivery
```

---

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server + watch Pug, SCSS, JS, assets |
| `npm run build` | Compile all — sourcemaps ON |
| `npm run build:prod` | Full build + PurgeCSS + Critical CSS |
| `npm run build:be` | Pug + SCSS + JS only (no postcss) |
| `npm run new <name>` | Scaffold new component |
| `npm run page <name>` | Scaffold new page |
| `npm run copy:assets` | Copy `src/assets/` → `dist/assets/` |
| `npm run format` | Prettier all source files |
| `npm run showcase` | Build component showcase |

---

## CSS Modes

Change `MODE` in `project.config.mjs` → restart `npm run dev`.

| Mode | Best for | Output |
|------|----------|--------|
| `single` | Landing pages, small sites | One `app.css` for all pages |
| `per-page` | Large sites, pages differ a lot | `pages/name.css` per page |
| `per-component` | Drupal / WP / Laravel / .NET | `base.css` + one CSS per component |

### per-component — auto-detection

`build-pug.mjs` deep-scans each page + all included component files and writes `<link>` tags automatically:

```
include ../components/hero/_hero.pug   → hero.css auto-linked
+card(data)                            → card.css auto-linked
.btn.btn-outline-gray-1                → button.css auto-linked
```

No manual CSS linking needed — runs on every `npm run dev` or `npm run build`.

---

## Project Structure

```
project.config.mjs          ← YOUR CONTROL PANEL

src/
  assets/
    images/                 ← put images here — auto-copied to dist/
    fonts/

  components/name/
    _name.pug               ← Pug mixin
    name.scss               ← component styles
    name.preview.html       ← standalone preview

  layouts/
    _base.pug               ← AUTO-GENERATED — never edit directly
    _header.pug             ← EDIT: logo, nav links
    _footer.pug             ← EDIT: copyright, links
    header.scss

  pages/
    index.pug
    about.pug               ← npm run page creates these

  sass/
    base/
      _layers.scss          ← @layer order (reset, base, bootstrap, components, utilities)
      _bootstrap.scss       ← Bootstrap wrapped in @layer
      _reset.scss
      _base.scss
      base-only.scss        ← per-component mode entry

    tokens/
      _colors.scss          ← EDIT: brand colors (hex)
      _typography.scss      ← EDIT: font family, fluid type scale
      _spacing.scss         ← spacing scale

    pages/
      _shared.scss          ← per-page mode base
      about.scss

    utilities/
      _mixins.scss          ← fluid-steps, rem(), size(), flex helpers
      _functions.scss       ← g-* gap, fs-* font-size utility loops

    app.scss                ← AUTO-GENERATED — never edit

  js/
    components.js           ← Alpine.js registrations
    swiper-init.js          ← Swiper auto-initializer

scaffold/                   ← build automation — do not edit
dist/                       ← compiled output → hand to BE team
```

---

## Design Tokens

All in `src/sass/tokens/`. Change once — updates everywhere.

### Colors

```scss
// _colors.scss
:root {
  --color-primary:        #2563EB;   // ← change to brand color
  --color-secondary:      #F59E0B;

  --color-gray-100: #F5F5F5;
  --color-gray-300: #EDEDED;         // default border color
  --color-gray-900: #212121;         // default text color

  // Semantic — use these in components
  --color-text-primary:   var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-bg-body:        var(--color-white);
  --color-border:         var(--color-gray-300);
  --color-border-soft:    #EDEDED80; // 50% opacity
}
```

Dark mode tokens auto-switch when `data-theme="dark"` is on `<html>`.

### Typography

Fluid type scale — sizes scale smoothly between mobile and desktop:

```scss
--text-xs:   0.75rem;   // 12px
--text-sm:   0.875rem;  // 14px
--text-base: 1rem;      // 16px
--text-lg:   1.125rem;  // 18px
--text-xl:   1.25rem;   // 20px
--text-2xl:  1.5rem;    // 24px
--text-3xl:  1.875rem;  // 30px
--text-4xl:  2.25rem;   // 36px
```

### Spacing

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

### rem() — px to rem

```scss
@use '../../sass/utilities/mixins' as *;

padding: rem(24);         // 24px → 1.5rem
font-size: rem(14);       // 14px → 0.875rem
border-radius: rem(8);    // 8px  → 0.5rem
```

### fluid-steps() — fluid scaling

```scss
// Font size scales from 32px (mobile) to 72px (desktop)
@include fluid-steps(font-size, (32px, 72px));

// Padding changes at 3 breakpoints
@include fluid-steps(padding-block, (24px, 48px, 80px));
```

### Dynamic utilities

Generated in `_functions.scss` — use directly in Pug:

```pug
//- Font sizes: fs-10 to fs-100 (px value = class number)
h2.fs-32        //→ font-size: 2rem
p.fs-14         //→ font-size: 0.875rem

//- Gaps: g-1 to g-50 (px value = class number)
.d-flex.g-16    //→ gap: 1rem
.d-flex.g-24    //→ gap: 1.5rem

//- Fixed sizes: size-48 = width + height 48px
a.btn.size-48   //→ width: 3rem; height: 3rem
```

### @layer components

Every component SCSS must be wrapped — this ensures your styles always override Bootstrap:

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

### Create a new component

```bash
npm run new card-grid
npm run new pricing-table
npm run new testimonial-slider
```

Creates `src/components/name/` with:
- `_name.pug` — Pug mixin
- `name.scss` — styles with `@use` and `@layer components`
- `name.preview.html` — standalone preview

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
      if data.btn
        a.btn.btn-primary(href=data.btn.link)= data.btn.label
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
    tag:   'Welcome',
    title: 'Agency Starter',
    text:  'Fast, modern, maintainable.',
    btn:   { label: 'Get Started', link: '#' }
  })
```

### Built-in components

| Component | Key props |
|-----------|-----------|
| `hero` | `title`, `text`, `tag`, `bg`, `btn` |
| `card` | `title`, `text`, `image`, `link` |
| `section` | `.section`, `.section-muted`, `.section-dark` |
| `carousel` | Alpine — `slides`, `autoplay`, `loop`, `arrows`, `dots` |
| `swiper` | `slides`, `effect`, `perView`, `perViewMd`, `perViewLg`, `gap`, `loop`, `autoplay` |
| `testimonial` | `title`, `text` |
| `page-aside` | `title`, `text` |
| `app-head` | `title`, `text`, `icon`, `titleClass`, `textClass` |
| `breadcrumb` | `items` array: `{ label, link }` |
| `nav` | `navLinks`, `navDropdown` mixins |

---

## Alpine.js Components

All registered in `src/js/components.js` — available on every page.

| `x-data=""` | What it does |
|------------|-------------|
| `navbar` | Scroll detection → `.is-scrolled` on header |
| `themeToggle` | Dark/light toggle, persists in localStorage |
| `modal` | Show/hide with body scroll lock |
| `tabs(0)` | Active tab state |
| `accordion` | Toggle open/close |
| `counter(500, 2000)` | Animates 0→500 on scroll into view |
| `carousel({...})` | Lightweight slider, no dependencies |
| `form` | Fetch submit with loading/success/error states |

### Usage

```pug
//- Navbar scroll state
nav.site-header(x-data="navbar" :class="{ 'is-scrolled': scrolled }")

//- Dark mode toggle
button(x-data="themeToggle" @click="toggle")
  | Toggle Theme

//- Tabs
div(x-data="tabs(0)")
  button(@click="setTab(0)" :class="{ active: isActive(0) }") Tab 1
  button(@click="setTab(1)" :class="{ active: isActive(1) }") Tab 2
  div(x-show="isActive(0)") Content 1
  div(x-show="isActive(1)") Content 2
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

## Images

Put images in `src/assets/images/` — they auto-copy to `dist/assets/images/` on save during dev.

```pug
img(src="assets/images/hero.jpg" alt="Hero")
img(src="assets/images/logo.svg" alt="Logo")
```

---

## Pages

### Create

```bash
npm run page services
npm run page blog-post
```

### Page structure

```pug
extends ../layouts/_base.pug

//- ↓ auto-managed by build-pug.mjs
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

### Blocks

| Block | Purpose |
|-------|---------|
| `block title` | Page `<title>` |
| `block head` | Extra `<head>` content |
| `block pagecss` | Auto-managed |
| `block componentcss` | Auto-managed |
| `block content` | Page body |
| `block scripts` | Extra scripts before `</body>` |

---

## Dark Mode & RTL

```pug
//- Dark mode — add data-theme to html
html(lang="en" dir="ltr" data-theme="dark")

//- RTL — change dir attribute
html(lang="ar" dir="rtl" data-theme="light")
```

All color tokens and Bootstrap layout flip automatically.

---

## Production Build

```bash
npm run build:prod
```

Pipeline:
1. Pug → HTML (CSS blocks auto-written per mode)
2. SCSS → CSS (compressed, sourcemaps ON)
3. JS + assets copied to `dist/`
4. PurgeCSS removes unused classes
5. Critical CSS inlined (if `CRITICAL = true`)

Hand `dist/` to BE team.

**Before final delivery:**
```js
// project.config.mjs
export const CRITICAL = true;
```

**If PurgeCSS removes a class you need:**
```js
// postcss.config.js
safelist: ['show', 'active', 'my-dynamic-class', /^swiper-/]
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Undefined mixin` | Add `@use '../../sass/utilities/mixins' as *;` at top of file |
| Component CSS not loading | Restart `npm run dev` — detection runs on startup |
| Bootstrap overrides styles | Wrap component in `@layer components {}` |
| `var(--token)` not working | Check semicolons in `_spacing.scss` / `_colors.scss` |
| JS changes not updating | `npm run copy:js` or restart dev |
| Images not showing | `npm run copy:assets` or restart dev |
| PurgeCSS removed a class | Add to `safelist` in `postcss.config.js` |
| `pug: command not found` | `npm install -g pug-cli` |
| `sass: command not found` | `npm install -g sass` |
| Mode switch not working | `Ctrl+C` → `npm run dev` — restart after config change |

---

## New Project Checklist

```
□ npx degit manikantanapplab/agency-starter my-project
□ cd my-project && npm install
□ project.config.mjs   → set MODE
□ tokens/_colors.scss  → brand colors
□ tokens/_typography.scss → font family + Google Fonts URL in _header.pug
□ _header.pug          → logo, nav links
□ _footer.pug          → company name, links
□ npm run page <n>     × create all pages
□ npm run new <n>      × create all components
□ npm run dev          → start building
□ npm run build:prod   → before BE handoff
□ CRITICAL = true      → before final delivery
```
