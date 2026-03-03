# BE Team Integration Guide

---

## What you receive

The `dist/` folder. Everything compiled and ready.

```
dist/
  index.html
  about.html
  assets/
    css/
      app.css                    ← single mode
      pages/index.css            ← per-page mode
      pages/about.css
      base.css                   ← per-component mode
      components/hero.css
      components/card.css
      components/section.css
      components/button.css
    js/
      components.js
```

---

## Always load on every page (all modes)

```html
<!-- In <head> -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<!-- Before </body> -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="/assets/js/components.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>
```

---

## SINGLE mode

Add one CSS link to your global layout:

```html
<link rel="stylesheet" href="/assets/css/app.css">
```

**Drupal** — `[theme].libraries.yml`:
```yaml
global:
  css:
    theme:
      dist/assets/css/app.css: {}
```

**WordPress** — `functions.php`:
```php
wp_enqueue_style('theme', get_template_directory_uri() . '/dist/assets/css/app.css');
```

**Laravel** — `layouts/app.blade.php`:
```blade
<link rel="stylesheet" href="{{ asset('dist/assets/css/app.css') }}">
```

**.NET Razor** — `_Layout.cshtml`:
```cshtml
<link rel="stylesheet" href="~/dist/assets/css/app.css">
```

---

## PER-PAGE mode

Each page template links its own CSS.

**Drupal** — `page--front.html.twig`:
```twig
<link rel="stylesheet" href="/themes/custom/theme/dist/assets/css/pages/index.css">
```

**WordPress** — `functions.php`:
```php
function enqueue_page_styles() {
  $page = is_front_page() ? 'index' : get_post_field('post_name');
  $file = get_template_directory_uri() . '/dist/assets/css/pages/' . $page . '.css';
  if (file_exists(get_template_directory() . '/dist/assets/css/pages/' . $page . '.css')) {
    wp_enqueue_style('page-css', $file);
  }
}
add_action('wp_enqueue_scripts', 'enqueue_page_styles');
```

**Laravel** — each page view:
```blade
@push('styles')
  <link rel="stylesheet" href="{{ asset('dist/assets/css/pages/about.css') }}">
@endpush
```

**.NET Razor** — each page:
```cshtml
@section Styles {
  <link rel="stylesheet" href="~/dist/assets/css/pages/about.css">
}
```

---

## PER-COMPONENT mode

Load `base.css` on every page, then load component CSS only when that component is rendered.

**Every page:**
```html
<link rel="stylesheet" href="/assets/css/base.css">
```

**When rendering a component, also load its CSS:**

**Drupal** — `[theme].libraries.yml`:
```yaml
base:
  css:
    theme:
      dist/assets/css/base.css: {}

hero:
  css:
    component:
      dist/assets/css/components/hero.css: {}

card:
  css:
    component:
      dist/assets/css/components/card.css: {}
```
In template: `{{ attach_library('theme/hero') }}`

**WordPress**:
```php
function enqueue_component_style($component) {
  wp_enqueue_style(
    'component-' . $component,
    get_template_directory_uri() . '/dist/assets/css/components/' . $component . '.css'
  );
}
// Call when rendering a component:
enqueue_component_style('hero');
enqueue_component_style('card');
```

**Laravel** — Blade component:
```blade
{{-- resources/views/components/ds-hero.blade.php --}}
@once
  @push('styles')
    <link rel="stylesheet" href="{{ asset('dist/assets/css/components/hero.css') }}">
  @endpush
@endonce
```

**.NET Razor** — partial view:
```cshtml
@* _Hero.cshtml *@
@section Styles {
  <link rel="stylesheet" href="~/dist/assets/css/components/hero.css">
}
```

---

## RTL

Add `dir="rtl"` to `<html>`. All CSS flips automatically.

## Dark Mode

Add `data-theme="dark"` to `<html>`. All colors switch automatically.

## HTML from FE team

Open `dist/showcase.html` in a browser to see all components with copy-able HTML.
