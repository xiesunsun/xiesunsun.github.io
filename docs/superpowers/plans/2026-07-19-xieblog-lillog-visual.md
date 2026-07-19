# xie'blog Lil'Log-Aligned Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Jekyll blog to a Lil'Log / PaperMod-like grayscale system with system fonts, `xie'blog` branding, a single-line home welcome, and card-style post lists—without leaving Minimal Mistakes.

**Architecture:** Keep remote theme Minimal Mistakes. Replace the Morandi SCSS stack with Paper-style CSS custom properties and global overrides loaded after MM. Add a tiny home welcome include and dark-mode early script. Prefer CSS-first cards on existing `.archive__item` markup; only override includes if full-card link markup is required.

**Tech Stack:** Jekyll, Minimal Mistakes (remote), SCSS, vanilla JS

**Spec:** `docs/superpowers/specs/2026-07-19-xieblog-lillog-visual-design.md`

---

## File map

| Path | Action |
|------|--------|
| `_sass/_variables-paper.scss` | **Create** — CSS vars + SCSS bridges |
| `_sass/_fonts-paper.scss` | **Create** — system font stacks / mixins |
| `_sass/_paper-theme.scss` | **Create** — global element + chrome styles |
| `_sass/_variables-morandi.scss` | **Delete** after switch |
| `_sass/_fonts-morandi.scss` | **Delete** after switch |
| `_sass/_morandi-theme.scss` | **Delete** after switch |
| `assets/css/main.scss` | **Rewrite** imports + card/masthead/footer/about overrides |
| `_config.yml` | **Modify** — title/name → `xie'blog`, drop morandi flag |
| `index.html` | **Modify** — home welcome block |
| `_includes/home-welcome.html` | **Create** — single welcome line |
| `_includes/head.html` | **Modify** — dark-mode FOUC script |
| `_includes/footer.html` | **Modify** only if class hooks needed (copy stays) |
| `_includes/footer/custom.html` | **Modify** — theme toggle handler (or separate include) |
| `_includes/theme-toggle.html` | **Create** — moon/sun button markup injected via head/footer/custom |

---

### Task 1: Brand config → `xie'blog`

**Files:**
- Modify: `_config.yml`

- [ ] **Step 1: Update site identity**

Set:

```yaml
title: "xie'blog"
name: "xie'blog"
description: >-
  写字的人，在灯下。
```

Keep `author.name` as `sunxie` (person vs site). Remove or replace:

```yaml
custom_theme: morandi
```

with:

```yaml
custom_theme: paper
```

(or delete the key if unused by code).

- [ ] **Step 2: Commit**

```bash
git add _config.yml
git commit -m "chore: rebrand site title to xie'blog"
```

---

### Task 2: Paper design tokens + system fonts

**Files:**
- Create: `_sass/_variables-paper.scss`
- Create: `_sass/_fonts-paper.scss`

- [ ] **Step 1: Create `_sass/_fonts-paper.scss`**

```scss
// System stacks aligned with Lil'Log / PaperMod
$font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
  Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !default;

$font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
  "Liberation Mono", "Courier New", monospace !default;

$base-font-size: 16px !default;
$base-line-height: 1.6 !default;

$h1-size: 1.75rem !default;
$h2-size: 1.5rem !default;
$h3-size: 1.125rem !default;
$h4-size: 1rem !default;

@mixin font-sans {
  font-family: $font-family-sans;
}

@mixin font-mono {
  font-family: $font-family-mono;
}

@mixin font-smoothing {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 2: Create `_sass/_variables-paper.scss`**

```scss
// Paper / Lil'Log-aligned tokens
// Light defaults on :root; dark on body.dark (and media query fallback)

// SCSS bridges for places that still need Sass colors
$paper-theme: rgb(255, 255, 255) !default;
$paper-entry: rgb(255, 255, 255) !default;
$paper-primary: rgb(30, 30, 30) !default;
$paper-secondary: rgb(108, 108, 108) !default;
$paper-content: rgb(31, 31, 31) !default;
$paper-border: rgb(238, 238, 238) !default;
$paper-code-bg: rgb(245, 245, 245) !default;
$paper-tertiary: rgb(214, 214, 214) !default;
$paper-hljs-bg: rgb(28, 29, 33) !default;

// Layout
$paper-main-width: 720px !default;
$paper-nav-width: 1024px !default;
$paper-gap: 24px !default;
$paper-radius: 8px !default;
$paper-header-height: 60px !default;

// Override Minimal Mistakes color variables where possible
$background-color: $paper-theme !default;
$text-color: $paper-content !default;
$muted-text-color: $paper-secondary !default;
$border-color: $paper-border !default;
$primary-color: $paper-primary !default;
$link-color: $paper-primary !default;
$link-color-hover: $paper-primary !default;
$link-color-visited: $paper-secondary !default;
$code-background-color: $paper-code-bg !default;
```

Also emit CSS custom properties in this file or in `_paper-theme.scss`:

```scss
:root {
  --theme: #{"rgb(255, 255, 255)"};
  --entry: #{"rgb(255, 255, 255)"};
  --primary: #{"rgb(30, 30, 30)"};
  --secondary: #{"rgb(108, 108, 108)"};
  --content: #{"rgb(31, 31, 31)"};
  --border: #{"rgb(238, 238, 238)"};
  --code-bg: #{"rgb(245, 245, 245)"};
  --tertiary: #{"rgb(214, 214, 214)"};
  --hljs-bg: #{"rgb(28, 29, 33)"};
  --main-width: 720px;
  --nav-width: 1024px;
  --gap: 24px;
  --radius: 8px;
  --header-height: 60px;
}

body.dark {
  --theme: #{"rgb(29, 30, 32)"};
  --entry: #{"rgb(46, 46, 51)"};
  --primary: #{"rgb(218, 218, 219)"};
  --secondary: #{"rgb(155, 156, 157)"};
  --content: #{"rgb(196, 196, 197)"};
  --border: #{"rgb(51, 51, 51)"};
  --code-bg: #{"rgb(55, 56, 62)"};
  --tertiary: #{"rgb(65, 66, 68)"};
  --hljs-bg: #{"rgb(46, 46, 51)"};
}
```

- [ ] **Step 3: Commit**

```bash
git add _sass/_variables-paper.scss _sass/_fonts-paper.scss
git commit -m "feat: add paper design tokens and system fonts"
```

---

### Task 3: Paper theme layer + rewire `main.scss`

**Files:**
- Create: `_sass/_paper-theme.scss`
- Modify: `assets/css/main.scss`
- Delete (after imports switch): `_sass/_variables-morandi.scss`, `_sass/_fonts-morandi.scss`, `_sass/_morandi-theme.scss`

- [ ] **Step 1: Create `_sass/_paper-theme.scss`**

Must cover at minimum:

```scss
@import "variables-paper";
@import "fonts-paper";

html {
  font-size: $base-font-size;
}

body {
  @include font-sans;
  @include font-smoothing;
  background: var(--theme);
  color: var(--content);
  line-height: $base-line-height;
  font-weight: 400;
}

// Headings, p, a, code, pre, blockquote, table, hr
// Links: color var(--primary); box-shadow 0 1px currentColor on content links
// code: bg var(--code-bg); pre/highlight: bg var(--hljs-bg), light fg
```

Do **not** import Morandi files.

- [ ] **Step 2: Rewrite `assets/css/main.scss` imports**

Top of file:

```scss
---
---
@charset "utf-8";

@import "variables-paper";
@import "fonts-paper";

@import "minimal-mistakes/skins/{{ site.minimal_mistakes_skin | default: 'default' }}";
@import "minimal-mistakes";

@import "paper-theme";
```

Then replace all `$morandi-*` references in the rest of `main.scss` with `var(--…)` or `$paper-*`.

Key blocks to rewrite (existing sections in `main.scss`):

1. **`.page-wrapper`** — max-width `calc(var(--main-width) + var(--gap) * 2)` or keep outer full-width; constrain archive/content instead.
2. **`.masthead .site-title`** — remove cursive; `font-weight: 700; font-size: 1.5rem; color: var(--primary); text-transform: none` (or keep lowercase if preferred for `xie'blog`).
3. **`.page__footer`** — flat `var(--theme)` or subtle `var(--code-bg)`; no warm gradient; footer line uses system font, `color: var(--secondary)` or `var(--primary)`.
4. **`.archive__item`** — become cards (Task 4 can own full card CSS; here remove border-bottom list style if conflict).
5. **About page** — grayscale borders/text using tokens.
6. **Sidebar TOC** — neutral borders only.
7. **Mobile queries** — keep tap targets; restyle colors only.

- [ ] **Step 3: Delete Morandi files**

```bash
git rm _sass/_variables-morandi.scss _sass/_fonts-morandi.scss _sass/_morandi-theme.scss
```

- [ ] **Step 4: Build and fix SCSS errors**

```bash
bundle exec jekyll build
```

Expected: build succeeds; no undefined `$morandi-*` variable errors.

- [ ] **Step 5: Commit**

```bash
git add assets/css/main.scss _sass/_paper-theme.scss
git add -u _sass/
git commit -m "feat: replace Morandi skin with paper grayscale theme"
```

---

### Task 4: Card list styling

**Files:**
- Modify: `assets/css/main.scss` (or `_sass/_paper-theme.scss`)

- [ ] **Step 1: Style list canvas + cards**

Target MM home/posts markup: `.layout--home`, `.layout--posts`, `.archive`, `.entries-list`, `.archive__item`.

Suggested CSS:

```scss
body.layout--home,
body.layout--posts,
body.layout--categories,
body.layout--tags {
  background: var(--code-bg);
}

.archive {
  max-width: calc(var(--main-width) + var(--gap) * 2);
  margin-inline: auto;
  padding: var(--gap);
}

// Hide or restyle default "最近文章" subtitle if desired
.archive__subtitle {
  color: var(--secondary);
  font-size: 0.875rem;
  font-weight: 500;
  border: 0;
}

.entries-list .archive__item,
.list__item {
  position: relative;
  margin-bottom: var(--gap);
  padding: var(--gap);
  background: var(--entry);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  border-bottom: 1px solid var(--border); // override old hairline-only look
  transition: transform 0.1s ease;

  &:last-child {
    border-bottom: 1px solid var(--border);
  }

  &:active {
    transform: scale(0.96);
  }
}

.archive__item-title {
  font-size: 1.5rem;
  line-height: 1.3;
  margin: 0;

  a {
    color: var(--primary);
    text-decoration: none;
    box-shadow: none;

    &:hover {
      color: var(--primary);
      text-decoration: underline;
    }
  }
}

.archive__item-excerpt {
  margin: 0.5rem 0 0;
  color: var(--secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.page__meta {
  color: var(--secondary);
  font-size: 0.8125rem;
}
```

- [ ] **Step 2: Optional full-card click target**

If title-only links feel weak, add:

```scss
.archive__item .u-url::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
}
```

Ensure meta links (if any) use `position: relative; z-index: 2`.

- [ ] **Step 3: Visual check**

Serve and open `/` and `/posts/`. Cards should match Lil'Log rhythm (white card on gray list bg).

- [ ] **Step 4: Commit**

```bash
git add assets/css/main.scss _sass/_paper-theme.scss
git commit -m "feat: card-style post lists on home and archives"
```

---

### Task 5: Home welcome — main line only

**Files:**
- Create: `_includes/home-welcome.html`
- Modify: `index.html`

- [ ] **Step 1: Create `_includes/home-welcome.html`**

```html
<section class="home-welcome" aria-label="欢迎">
  <h1 class="home-welcome__title">写字的人，在灯下。</h1>
</section>
```

- [ ] **Step 2: Update `index.html`**

```yaml
---
layout: home
author_profile: false
---

{% include home-welcome.html %}
```

Note: MM `home` layout usually renders page content above the post list. Confirm in local serve that the welcome appears **above** the archive list. If MM ignores content, override `_layouts/home.html` from the theme gem into `_layouts/home.html` with a minimal copy that includes welcome + `paginator` / entries loop—only if needed.

- [ ] **Step 3: Style welcome**

```scss
.home-welcome {
  max-width: calc(var(--main-width) + var(--gap) * 2);
  margin: calc(var(--gap) * 1.5) auto var(--gap);
  padding: 0 var(--gap);
  text-align: center;
}

.home-welcome__title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--primary);
  letter-spacing: 0.02em;
}

// Prefer hiding redundant page title if MM emits empty/duplicate h1
.layout--home .page__title:empty {
  display: none;
}
```

- [ ] **Step 4: Hide or soften「最近文章」if it fights the lit home**

Either leave as small muted label or:

```scss
.layout--home .archive__subtitle {
  display: none;
}
```

Prefer **hide on home only** for maximum simplicity.

- [ ] **Step 5: Commit**

```bash
git add _includes/home-welcome.html index.html assets/css/main.scss
git commit -m "feat: add single-line home welcome"
```

---

### Task 6: Dark mode toggle + FOUC prevention

**Files:**
- Modify: `_includes/head.html`
- Create: `_includes/theme-toggle.html`
- Modify: theme masthead injection path — use `_includes/footer/custom.html` **or** override head/masthead via MM `after` hooks if present

MM often allows `after_masthead` / custom includes. Practical approach:

1. Early script in `_includes/head.html` (this repo already overrides head).
2. Toggle button appended via JS in `footer/custom.html` next to site title, or static include if masthead is overridden.

- [ ] **Step 1: Early theme script in `_includes/head.html`**

Insert **before** stylesheet (or immediately after `<meta charset>` block script section):

```html
<script>
  (function () {
    try {
      var pref = localStorage.getItem("pref-theme");
      var dark =
        pref === "dark" ||
        (pref !== "light" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      if (dark) document.documentElement.classList.add("dark");
    } catch (e) {}
  })();
</script>
```

And ensure CSS uses `html.dark` **or** mirror class onto `body` on DOM ready. Prefer **one root**: either `html.dark` with tokens on `html.dark`, or apply to both:

```scss
html.dark,
html.dark body,
body.dark {
  /* if tokens only on body.dark, copy selector to html.dark */
}
```

Simplest: put variables on `:root` and `html.dark` (not only `body.dark`).

- [ ] **Step 2: Toggle control**

In `footer/custom.html`, add:

```js
function initThemeToggle() {
  var btn = document.getElementById("theme-toggle");
  if (!btn) {
    var logo = document.querySelector(".greedy-nav .site-title") ||
               document.querySelector(".masthead .site-title");
    if (!logo || !logo.parentElement) return;
    btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.title = "切换浅色/深色";
    btn.setAttribute("aria-label", "切换浅色/深色");
    btn.innerHTML = "◐"; // replace with inline SVG moon/sun if desired
    logo.parentElement.insertBefore(btn, logo.nextSibling);
  }
  function isDark() {
    return document.documentElement.classList.contains("dark");
  }
  function apply(dark) {
    document.documentElement.classList.toggle("dark", dark);
    document.body.classList.toggle("dark", dark);
    try {
      localStorage.setItem("pref-theme", dark ? "dark" : "light");
    } catch (e) {}
  }
  btn.addEventListener("click", function () {
    apply(!isDark());
  });
  // sync body class after load
  apply(isDark());
}
```

Call with existing DOM ready pattern in the same file.

- [ ] **Step 3: Style toggle**

```scss
#theme-toggle {
  background: transparent;
  border: 0;
  color: var(--primary);
  cursor: pointer;
  margin-inline-start: 0.5rem;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0.25rem;
}
```

- [ ] **Step 4: Verify**

- System dark → first paint dark  
- Toggle → persists after reload  
- No unreadable contrast on cards/footer  

- [ ] **Step 5: Commit**

```bash
git add _includes/head.html _includes/footer/custom.html assets/css/main.scss _sass/_variables-paper.scss _sass/_paper-theme.scss
git commit -m "feat: add light/dark theme preference"
```

---

### Task 7: Post page + about follow-through

**Files:**
- Modify: `assets/css/main.scss` and/or `_sass/_paper-theme.scss`
- Modify: `_layouts/single.html` only if structural width hooks needed

- [ ] **Step 1: Constrain article column**

```scss
.layout--single #main,
.page__content {
  max-width: var(--main-width);
}

.page__content {
  color: var(--content);
  font-size: 1rem;
  line-height: 1.6;

  a {
    color: var(--primary);
    text-decoration: none;
    box-shadow: 0 1px 0 var(--primary);

    &:hover {
      box-shadow: 0 2px 0 var(--primary);
    }
  }
}
```

- [ ] **Step 2: Neutralize remaining warm about styles**

Replace every `$morandi-*` / warm hex in `.about-*` rules with paper tokens.

- [ ] **Step 3: Code blocks**

Ensure rouge/highlight uses `var(--hljs-bg)` and readable token colors (light text on dark panel). Remove warm `body.code-theme-*` blocks if still present.

- [ ] **Step 4: Commit**

```bash
git add assets/css/main.scss _sass/_paper-theme.scss _layouts/single.html
git commit -m "feat: align post and about pages with paper theme"
```

---

### Task 8: Verification & cleanup

**Files:**
- None required (docs optional)

- [ ] **Step 1: Full build**

```bash
bundle exec jekyll build
```

Expected: exit 0.

- [ ] **Step 2: Grep for Morandi leftovers**

```bash
rg -n "morandi|#f6efe7|#9f7a5a|#a55331|#b25f3f|#fdfaf6|Snell Roundhand|STKaiti|Kaiti" \
  _sass assets _includes _layouts _config.yml || true
```

Expected: no hits in active theme paths (docs/specs may still mention Morandi historically).

- [ ] **Step 3: Manual checklist**

| Check | Pass? |
|-------|-------|
| Home welcome only one line | |
| Cards on `/` and `/posts/` | |
| Title `xie'blog` system bold | |
| Footer same line, system font | |
| Dark toggle works | |
| About not warm-toned | |
| Mobile nav still usable | |

- [ ] **Step 4: Final commit if fixes**

```bash
git add -A
git commit -m "fix: polish paper theme after visual QA"
```

---

## Execution notes

- Serve command (adjust PATH if needed):

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle exec jekyll serve --livereload
```

- Do not push to `origin` unless the user asks.
- Prefer small commits per task as listed.
- If `index.html` content does not appear above posts, pull home layout from the theme:

```bash
bundle show minimal-mistakes-jekyll
# or inspect github-pages gem theme path, copy home.html into _layouts/home.html
```

---

## Done when

All Phase 1 acceptance criteria in the spec are met, Morandi SCSS is gone, and local home/post/about look like a grayscale Lil'Log-inspired note site branded **xie'blog**.
