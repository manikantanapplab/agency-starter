# BS Package v14 — Complete Project Workflow Guide

For agency projects with 30+ pages, multiple developers.

---

## PART 1 — Sourcemaps

### What sourcemaps do

In DevTools, instead of seeing minified `app.css:1`, you see the exact original SCSS file and line number. Essential for multi-developer projects.

```
Without sourcemaps:           With sourcemaps:
app.css:1 → .hero { ... }    hero.scss:12 → .hero-title { ... }
```

### How sourcemaps work in this package

| Command | Sourcemaps | Use when |
|---------|-----------|----------|
| `npm run dev` | ✅ ON — full paths | Daily development |
| `npm run build` | ✅ ON — compressed | Handing to BE team for integration |
| `npm run build:prod` | ✅ ON — compressed | Pre-launch, Lighthouse testing |
| Add `--no-source-map` | ❌ OFF | Final client delivery only |

**In DevTools → Sources tab:**
Open any page → Sources → `localhost:3000` → find `.scss` files directly.
Click any CSS rule in Elements panel → source link jumps to the exact SCSS line.

### Enabling sourcemaps for production delivery

If the client explicitly does not want sourcemaps shipped (rare):

```bash
# One-off build without sourcemaps
node scaffold/build-sass.mjs --compressed --no-source-map
```

Or add to `package.json`:
```json
"build:nosourcemap": "node scaffold/build-sass.mjs --compressed --no-source-map"
```

---

## PART 2 — Starting a New Project (Step by Step)

### Step 1 — Copy the package

```bash
cp -r bs-v14-package my-client-project
cd my-client-project
npm install
```

Do **not** clone from git into a client folder — copy the package folder directly.

---

### Step 2 — Configure the project (5 minutes)

Open `project.config.mjs` — the only file you need to change:

```js
export const MODE     = 'single';  // most projects: start with single
export const CRITICAL = false;     // set true only before final delivery
```

**Which MODE to pick:**

| Project type | MODE |
|-------------|------|
| Landing page, brochure site | `single` |
| Marketing site, 10-30 pages | `single` |
| Large site, pages very different | `per-page` |
| Drupal / WordPress / Laravel / .NET | `per-component` |

Start with `single` — you can switch any time by changing one line and restarting.

---

### Step 3 — Brand tokens (10 minutes)

**Colors** — `src/sass/tokens/_colors.scss`:
```scss
:root {
  --color-primary:   oklch(60% 0.2 250);  // your brand blue
  --color-secondary: oklch(75% 0.18 85);  // your accent color
}
```

To convert a hex color to OKLCH: https://oklch.com
Paste your brand hex → copy the OKLCH values.

**Font** — `src/sass/tokens/_typography.scss`:
```scss
--font-primary: 'Your Font', system-ui, sans-serif;
```

Then update the Google Fonts URL in `src/layouts/_base.pug`:
```pug
link(rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Your+Font:wght@300;400;600;700&display=swap")
```

---

### Step 4 — Header and footer

**Header** — `src/layouts/_header.pug`:
- Replace logo `src` with client logo path
- Update nav links with real page names and URLs
- Remove/add dropdown items as needed

**Footer** — `src/layouts/_footer.pug`:
- Update company name, address, copyright year
- Update footer nav links

These two files are shared across every page — edit once, applies everywhere.

---

### Step 5 — Create all pages upfront

For a 30-page project, scaffold all pages on day one:

```bash
npm run page services
npm run page contact
npm run page about
npm run page team
npm run page careers
npm run page blog
npm run page blog-post
npm run page portfolio
npm run page portfolio-item
# ... all 30 pages
```

Each command creates:
- `src/pages/name.pug` — the page content file
- `src/sass/pages/name.scss` — per-page CSS (if using per-page mode)
- `src/sass/layers/_name.scss` — page-specific styles (auto-imported in single mode)

Now you have all page shells in place before any developer touches content.

---

### Step 6 — Create all components upfront

Identify reusable pieces from the design: hero, cards, testimonials, pricing tables, CTA sections, team grids, etc.

```bash
npm run new hero
npm run new card
npm run new testimonial
npm run new pricing
npm run new cta
npm run new team-grid
npm run new faq
npm run new stats
npm run new gallery
```

Each creates a complete folder with Pug mixin + SCSS + preview.

---

### Step 7 — Start dev

```bash
npm run dev
```

Terminal shows:
```
✅ _base.pug → single mode
✅ app.scss — 9 components, 12 page layers
🗺  Sourcemaps: ON (dev mode)
[vite] Local: http://localhost:3000
```

Now open `http://localhost:3000` and build.

---

## PART 3 — Multi-Developer Workflow

### Git setup

```bash
git init
git add .
git commit -m "initial: bs-v14 package setup"
```

**`.gitignore`** — make sure this is in it:
```
node_modules/
dist/
dist-build/
.DS_Store
```

Do **not** commit `dist/` — it's compiled output. Each developer compiles locally.

---

### Developer A starts a component, Developer B picks it up

**Dev A — creates the component:**
```bash
npm run new pricing-table
# builds out src/components/pricing-table/_pricing-table.pug
# builds out src/components/pricing-table/pricing-table.scss
git add src/components/pricing-table/
git commit -m "feat: pricing-table component scaffold"
git push
```

**Dev B — picks up and uses it:**
```bash
git pull
npm run dev  # auto-detects new component, imports it
# adds +pricingTable() to whatever page they're working on
```

No config files to update. No merge conflicts on `app.scss` — it's auto-generated.

---

### Page ownership (30+ pages)

Assign pages clearly to avoid conflicts:

```
Dev A → index, about, team, contact
Dev B → services/*, pricing, faq
Dev C → blog/*, portfolio/*
```

Since every page is its own `.pug` file and its own `.scss` file, two developers never edit the same file for different pages.

---

### Shared styles — where to put them

| What | Where | Who edits |
|------|-------|-----------|
| Brand colors | `src/sass/tokens/_colors.scss` | Lead dev only |
| Typography scale | `src/sass/tokens/_typography.scss` | Lead dev only |
| Spacing scale | `src/sass/tokens/_spacing.scss` | Lead dev only |
| Header / footer | `src/layouts/_header.pug` | Lead dev only |
| Shared component | `src/components/name/` | Component owner |
| Page-specific | `src/sass/layers/_pagename.scss` | Page owner |
| Page content | `src/pages/pagename.pug` | Page owner |

**Rule:** Tokens and layouts = lead dev only. Everyone else works in their own component or page files.

---

### Avoiding merge conflicts

The only auto-generated files are:
- `src/layouts/_base.pug` — regenerated on every `npm run dev`
- `src/sass/app.scss` — regenerated on every `npm run dev`

**Never manually edit these two files.** They're overwritten every time — conflicts here don't matter because they'll be regenerated.

For everything else, the file-per-component / file-per-page structure means conflicts are rare. Two developers almost never need to edit the same file.

---

## PART 4 — Recommended Additional Tools

These are worth adding to your workflow and package:

### 1. Stylelint — SCSS linting

Catches SCSS errors before they compile. Enforces consistent code style across developers.

```bash
npm install --save-dev stylelint stylelint-config-standard-scss
```

`.stylelintrc.json`:
```json
{
  "extends": "stylelint-config-standard-scss",
  "rules": {
    "scss/at-rule-no-unknown": true,
    "color-no-invalid-hex": true,
    "no-duplicate-selectors": true
  }
}
```

Add to `package.json`:
```json
"lint:css": "stylelint \"src/**/*.scss\"",
"lint:css:fix": "stylelint \"src/**/*.scss\" --fix"
```

---

### 2. Pug linting — `pug-lint`

Catches Pug indentation and syntax errors before compilation.

```bash
npm install --save-dev pug-lint
```

`.pug-lintrc`:
```json
{
  "disallowMultipleLineBreaks": true,
  "disallowSpacesInsideAttributeBrackets": true,
  "validateIndentation": 2
}
```

Add to `package.json`:
```json
"lint:pug": "pug-lint src/**/*.pug"
```

---

### 3. Prettier — unified formatting

Already in the package (`npm run format`). Make sure all developers run it before committing.

Add a `.prettierrc`:
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

Add a pre-commit hook so it runs automatically:
```bash
npm install --save-dev husky lint-staged
npx husky init
```

`.husky/pre-commit`:
```bash
npx lint-staged
```

`package.json`:
```json
"lint-staged": {
  "src/**/*.scss": ["stylelint --fix", "prettier --write"],
  "src/**/*.pug":  ["prettier --write"],
  "src/**/*.js":   ["prettier --write"]
}
```

Now formatting is enforced automatically on every commit.

---

### 4. `npm-check-updates` — keep dependencies fresh

```bash
npm install --save-dev npm-check-updates
```

Add to `package.json`:
```json
"deps:check": "ncu",
"deps:update": "ncu -u && npm install"
```

Run `npm run deps:check` at the start of every project to check for outdated packages.

---

### 5. Image optimization — `sharp` CLI

For projects with lots of images. Converts to WebP, resizes, compresses.

```bash
npm install --save-dev sharp-cli
```

Add to `package.json`:
```json
"images": "sharp --input 'src/assets/images/**/*.{jpg,png}' --output dist/assets/images/ --webp"
```

---

### 6. SVG sprite — `svg-sprite`

For icon systems. Combines all SVGs into a single sprite.

```bash
npm install --save-dev svg-sprite
```

Add to `package.json`:
```json
"icons": "svg-sprite --symbol --symbol-dest dist/assets/ --symbol-sprite icons.svg 'src/assets/icons/**/*.svg'"
```

Use in Pug:
```pug
svg
  use(href="assets/icons.svg#icon-name")
```

---

### 7. Accessibility testing — `axe-cli`

Run after build to catch accessibility issues before the BE team gets the files.

```bash
npm install --save-dev @axe-core/cli
```

Add to `package.json`:
```json
"a11y": "axe http://localhost:3000 http://localhost:3000/about.html --exit"
```

Run `npm run a11y` while dev server is running.

---

### 8. HTML validation — `html-validate`

Validates the compiled HTML against W3C rules.

```bash
npm install --save-dev html-validate
```

Add to `package.json`:
```json
"validate": "html-validate dist/*.html"
```

---

## PART 5 — Build & Delivery Workflow

### Daily development
```bash
npm run dev           # starts everything, sourcemaps ON
```

### Handing files to BE team (mid-project)
```bash
npm run build         # compiles everything, sourcemaps ON
# hand dist/ folder to BE team
```

They get sourcemaps so they can debug CSS issues themselves.

### Final delivery (before launch)
```bash
npm run build:prod    # PurgeCSS + critical CSS + sourcemaps ON
# OR for no sourcemaps:
npm run build:pug && node scaffold/build-sass.mjs --compressed --no-source-map && npm run copy:js
node scaffold/postcss-build.mjs && node scaffold/run-critical.mjs
```

### Quality checks before delivery
```bash
npm run lint:css      # check SCSS
npm run validate      # check HTML
npm run a11y          # check accessibility (dev server must be running)
npm run format        # format all source files
npm run build:prod    # final build
```

---

## PART 6 — Quick Reference Card

### Daily commands
```bash
npm run dev                  # start working
npm run new <name>           # new component
npm run page <name>          # new page
npm run format               # format code
```

### Build commands
```bash
npm run build                # compile (with sourcemaps)
npm run build:prod           # full optimized build
```

### Sourcemap commands
```bash
# Dev — always ON (automatic)
npm run dev

# Build — ON by default
npm run build

# Build — OFF (client delivery)
node scaffold/build-sass.mjs --compressed --no-source-map
```

### Mode switching
```
1. Edit project.config.mjs → change MODE
2. npm run dev
Done — all pages and CSS links update automatically
```

### New project setup order
```
1. cp -r bs-v14-package client-name && cd client-name
2. npm install
3. Edit project.config.mjs  (MODE + CRITICAL)
4. Edit tokens/_colors.scss  (brand colors)
5. Edit tokens/_typography.scss  (font)
6. Edit _header.pug + _footer.pug
7. npm run page <name>  × all pages
8. npm run new <name>   × all components
9. npm run dev
10. npm run build:prod  (before BE handoff)
```
