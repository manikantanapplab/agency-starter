# Agency Starter — Team Guide

Step-by-step guide for developers joining a project built on Agency Starter.

---

## 1. Getting Started

### Prerequisites

Make sure these are installed on your machine:

```bash
node --version    # v18+ required
npm --version     # v9+ required
git --version
```

Install global CLI tools if missing:

```bash
npm install -g pug-cli
npm install -g sass
```

### Clone the project

```bash
git clone https://github.com/YOUR_ORG/PROJECT_NAME.git
cd PROJECT_NAME
npm install
npm run dev
# → opens http://localhost:3000
```

> **Never clone `agency-starter` directly for a project.**
> Each project has its own repo cloned from the template.

---

## 2. Folder Structure — What You Need to Know

```
src/
  assets/images/    ← put images here
  components/       ← UI components (pug + scss)
  layouts/          ← _header.pug, _footer.pug (edit these)
  pages/            ← one .pug file per page
  sass/tokens/      ← colors, typography, spacing (edit for project)
  js/               ← Alpine.js components

dist/               ← compiled output — DO NOT edit manually
scaffold/           ← build scripts — DO NOT edit
```

**Simple rule:**
- Work only inside `src/`
- Never touch `dist/` — it's auto-generated
- Never edit `src/layouts/_base.pug` or `src/sass/app.scss` — auto-generated

---

## 3. Daily Workflow

### Starting work

```bash
git pull              # always pull latest before starting
npm run dev           # start dev server
```

### Creating a new component

```bash
npm run new component-name
```

This creates `src/components/component-name/` with:
- `_component-name.pug` — Pug mixin (template)
- `component-name.scss` — styles
- `component-name.preview.html` — browser preview

### Creating a new page

```bash
npm run page page-name
```

This creates:
- `src/pages/page-name.pug`
- `src/sass/pages/page-name.scss`

### Adding images

Drop image files into `src/assets/images/` — they auto-copy to `dist/assets/images/` while dev is running.

Reference in Pug:
```pug
img(src="assets/images/hero.jpg" alt="Hero image")
```

---

## 4. Writing Pug (HTML)

### Page template

Every page extends `_base.pug`:

```pug
extends ../layouts/_base.pug

block title
  | Page Title | Company Name

block content
  include ../components/hero/_hero.pug

  +hero({
    title: 'Page Heading',
    text:  'Description text here.'
  })
```

### Using a component

**Step 1** — include the mixin file at the top of `block content`:
```pug
block content
  include ../components/card/_card.pug
```

**Step 2** — call the mixin:
```pug
  +card({
    title: 'Card Title',
    text:  'Card description.',
    image: 'assets/images/card.jpg',
    link:  '/page'
  })
```

### Common Pug patterns

```pug
//- Text output
h1.hero-title= data.title

//- Dynamic class
section.hero(class=data.size || 'md')

//- Conditional
if data.image
  img(src=data.image alt=data.alt)

//- Loop
each item in items
  li= item.label

//- Variable
- var total = items.length
p Total: #{total} items

//- Bootstrap classes
.container
  .row
    .col-md-6
      p Column content
```

---

## 5. Writing SCSS

### File structure

Every component SCSS file must start with:

```scss
@use '../../sass/utilities/mixins' as *;

@layer components {
  .my-component {
    // styles here
  }
}
```

> `@use` loads the rem() function and fluid-steps() mixin.
> `@layer components` ensures your styles override Bootstrap without `!important`.

### Using design tokens

Always use tokens for colors, spacing, and typography:

```scss
.my-component {
  // ✅ use tokens
  color:       var(--color-text-primary);
  background:  var(--color-bg-subtle);
  border:      1px solid var(--color-border);
  font-size:   var(--text-lg);
  padding:     var(--space-6);

  // ✅ use rem() for custom values from Figma
  border-radius: rem(8);
  gap:           rem(12);
  width:         rem(240);
}
```

### Token reference

**Colors:**
```scss
var(--color-primary)          // brand color
var(--color-text-primary)     // main text
var(--color-text-secondary)   // muted text
var(--color-bg-body)          // page background
var(--color-bg-subtle)        // light background
var(--color-border)           // border lines
```

**Typography:**
```scss
var(--text-xs)       // 12px
var(--text-sm)       // 14px
var(--text-base)     // 16px
var(--text-lg)       // 18px
var(--text-xl)       // 20px
var(--text-2xl)      // 24px
var(--text-3xl)      // 30px
var(--text-4xl)      // 36px

var(--font-light)    // 300
var(--font-regular)  // 400
var(--font-semi)     // 600
var(--font-bold)     // 700
```

**Spacing:**
```scss
var(--space-4)    //  4px
var(--space-8)    //  8px
var(--space-16)   // 16px
var(--space-24)   // 24px
var(--space-32)   // 32px
var(--space-48)   // 48px
var(--space-64)   // 64px
var(--section-padding-y)  // fluid section spacing
```

### Utility classes (use directly in Pug)

```pug
//- Font sizes (number = px value)
h2.fs-24     //→ font-size: 24px
p.fs-14      //→ font-size: 14px

//- Gaps (number = px value)
.d-flex.g-16   //→ gap: 16px
.d-flex.g-8    //→ gap: 8px

//- Fixed square size
a.btn.size-48  //→ width: 48px; height: 48px

//- Bootstrap utilities still work
.mt-4 .mb-3 .py-5 .text-center .fw-bold
```

### rem() function

Converts px to rem — use for values from Figma that aren't in the token scale:

```scss
padding:       rem(20);         // 20px → 1.25rem
border-radius: rem(12);         // 12px → 0.75rem
width:         rem(320);        // 320px → 20rem
font-size:     rem(13);         // 13px → 0.8125rem
```

---

## 6. Alpine.js (Interactivity)

Pre-built components available on every page — no imports needed:

```pug
//- Show/hide toggle (inline — no registration)
div(x-data="{ open: false }")
  button(@click="open = !open") Toggle
  div(x-show="open") Hidden content

//- Tabs
div(x-data="tabs(0)")
  button(@click="setTab(0)" :class="{ active: isActive(0) }") Tab 1
  button(@click="setTab(1)" :class="{ active: isActive(1) }") Tab 2
  div(x-show="isActive(0)") Content 1
  div(x-show="isActive(1)") Content 2

//- Accordion
div(x-data="accordion")
  button(@click="toggle(0)") Item 1
  div(x-show="isOpen(0)") Content 1
  button(@click="toggle(1)") Item 2
  div(x-show="isOpen(1)") Content 2

//- Dark mode toggle
button(x-data="themeToggle" @click="toggle")
  | Toggle Theme

//- Animated counter (triggers on scroll into view)
div(x-data="counter(500, 2000)")
  span(x-text="value")
```

---

## 7. Swiper Carousel

```pug
include ../components/swiper/_swiper.pug

- var slides = [
    { image: 'assets/images/s1.jpg', alt: 'Slide 1', title: 'Title', text: 'Text' },
    { image: 'assets/images/s2.jpg', alt: 'Slide 2', title: 'Title', text: 'Text' }
  ]

//- Basic
+swiper({ slides: slides })

//- Multi-slide responsive
+swiper({ slides: slides, perView: 1, perViewMd: 2, perViewLg: 3, gap: 24 })

//- Autoplay
+swiper({ slides: slides, autoplay: true, interval: 5000 })

//- Fade effect
+swiper({ slides: slides, effect: 'fade' })
```

---

## 8. Git Workflow

### Branch naming

```bash
git checkout -b feature/hero-component
git checkout -b fix/nav-mobile
git checkout -b page/about
```

### Commit messages

```bash
git commit -m "feat: add hero component"
git commit -m "fix: mobile nav overflow"
git commit -m "style: update card spacing tokens"
git commit -m "page: build about page"
```

### File ownership — avoid merge conflicts

| Files | Owner |
|-------|-------|
| `src/sass/tokens/` | Lead dev only |
| `src/layouts/_header.pug`, `_footer.pug` | Lead dev only |
| `src/layouts/_base.pug` | Nobody — auto-generated |
| `src/sass/app.scss` | Nobody — auto-generated |
| `src/components/name/` | One dev per component |
| `src/pages/name.pug` | One dev per page |

### What to commit

```
✅ src/
✅ scaffold/
✅ package.json
✅ project.config.mjs
✅ vite.config.js
✅ postcss.config.js
✅ README.md

❌ dist/          ← in .gitignore
❌ node_modules/  ← in .gitignore
❌ .DS_Store      ← in .gitignore
```

---

## 9. Build & Handoff

### Development build

```bash
npm run build
```

### Production build (before BE handoff)

```bash
# 1. Set CRITICAL = true in project.config.mjs
# 2. Run production build
npm run build:prod
# 3. Hand dist/ folder to BE team
```

Production build pipeline:
1. Pug → HTML
2. SCSS → compressed CSS
3. JS + assets copied to `dist/`
4. PurgeCSS removes all unused CSS classes
5. Critical CSS inlined in `<head>` (if `CRITICAL = true`)

### What to hand to BE team

The entire `dist/` folder:

```
dist/
  index.html
  about.html
  assets/
    css/
      base.css
      components/
      pages/
    js/
      components.js
    images/
```

---

## 10. Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| Styles not updating | Save the SCSS file — watch auto-recompiles |
| New component CSS not loading | Restart `npm run dev` — detection runs on startup |
| `rem() not found` | Add `@use '../../sass/utilities/mixins' as *;` at top |
| Bootstrap overrides my styles | Wrap styles in `@layer components {}` |
| Image not showing in browser | Run `npm run copy:assets` or restart dev |
| JS changes not reflecting | Run `npm run copy:js` or restart dev |
| Class removed in prod build | Add to `safelist` in `postcss.config.js` |
| `pug: command not found` | `npm install -g pug-cli` |
| `sass: command not found` | `npm install -g sass` |
| Port 3000 already in use | Change port in `vite.config.js` |

---

## 11. Quick Reference

### Start new component from scratch

```bash
# 1. Scaffold
npm run new my-component

# 2. Edit src/components/my-component/_my-component.pug
mixin my-component(data)
  section.my-component(class=data.class || '')
    .container
      if data.title
        h2.my-component-title= data.title
      block

# 3. Edit src/components/my-component/my-component.scss
@use '../../sass/utilities/mixins' as *;

@layer components {
  .my-component {
    padding-block: var(--section-padding-y);
    &-title { font-size: var(--text-3xl); }
  }
}

# 4. Use in page
include ../components/my-component/_my-component.pug
+my-component({ title: 'Hello' })
```

### Start new page from scratch

```bash
# 1. Scaffold
npm run page my-page

# 2. Edit src/pages/my-page.pug
extends ../layouts/_base.pug

block title
  | My Page | Company

block content
  include ../components/hero/_hero.pug
  +hero({ title: 'My Page' })

# 3. CSS auto-detected and linked on next dev restart
```

---

## 12. Resources

- Bootstrap docs: https://getbootstrap.com/docs/5.3
- Alpine.js docs: https://alpinejs.dev
- Swiper docs: https://swiperjs.com/swiper-api
- Pug docs: https://pugjs.org
- SCSS docs: https://sass-lang.com/documentation
