# xie'blog Lil'Log-Aligned Visual Redesign

## Context

The blog is a Jekyll site at `https://blog.sunxie.me`, using remote theme **Minimal Mistakes** with a custom **Morandi** (warm beige/caramel) skin layered on top via:

- `_sass/_variables-morandi.scss`
- `_sass/_fonts-morandi.scss`
- `_sass/_morandi-theme.scss`
- overrides in `assets/css/main.scss`

Reference site: [Lil'Log](https://lilianweng.github.io) (Hugo + PaperMod-style theme). The user wants the **visual hierarchy, card list, system fonts, and grayscale palette** of Lil'Log, while keeping this site's identity and stack.

Footer already has the line the user wants as the sole home welcome:

> 写字的人，在灯下。

## Goals

- Replace Morandi warm palette with a **PaperMod-like grayscale** token system (light + dark).
- Use **system UI fonts** only (no cursive site title, no Kaiti/decorative Chinese fonts).
- Brand the site as **`xie'blog`** (person name `sunxie` may remain on About).
- Home page: **welcome = only** `写字的人，在灯下。` (no subtitle), then a **card** post list.
- Card style on **home + `/posts/`**; prefer same cards on category/tag archives when low-cost.
- Reading column ~**720px**; list page soft gray canvas with white cards.
- Keep Jekyll + Minimal Mistakes remote theme; achieve look via **local SCSS + small layout/include overrides**.

## Non-Goals

- Migrating to Hugo or PaperMod.
- Forking Minimal Mistakes wholesale.
- Rewriting post content or adding academic Citation blocks (future).
- Full dependency purge (jQuery / Font Awesome) in Phase 1.
- Changing agent-facing surfaces (`llms.txt`, skills) except if titles/branding strings need consistency.

## Chosen Approach

**Approach A (selected): lightweight theme override on MM**

1. Introduce a new token file (e.g. `_sass/_variables-paper.scss`) with Lil'Log-aligned CSS variables.
2. Rewrite theme application SCSS (replace morandi theme) to consume those tokens.
3. Override home intro + archive list presentation with cards.
4. Set `title` / site-title to `xie'blog`; keep footer copy.

Rejected:

- **B-only full custom home layout** as the only path — optional include under A is enough.
- **C full re-skin of every MM component** — out of scope for Phase 1; follow tokens on post page without restructuring single layout.

## Design Details

### Branding

| Surface | Value |
|---------|--------|
| Site title / masthead | `xie'blog` |
| `_config.yml` `title` / `name` | `xie'blog` |
| Browser title | `xie'blog` (+ page title where applicable) |
| Description | Keep or lightly shorten; not shown as home subtitle |
| About page display name | May remain `sunxie` (person ≠ site) |
| Footer line | `写字的人，在灯下。` |
| Footer copyright | `© {year}` |

### Home welcome

```
写字的人，在灯下。
```

- Single line only.
- No secondary tagline.
- Typography: same system stack as body; larger size (~1.75–2rem) and comfortable tracking; **not** calligraphic fonts.
- Placement: above the post list, generous vertical margin; center or left-align consistent with main column.

### Color tokens (light)

Aligned with Lil'Log / PaperMod:

| Token | Approx. value | Role |
|-------|---------------|------|
| `--theme` | `rgb(255, 255, 255)` | Page background (post pages) |
| `--entry` | `rgb(255, 255, 255)` | Card background |
| `--primary` | `rgb(30, 30, 30)` | Strong text, logo, headings |
| `--secondary` | `rgb(108, 108, 108)` | Meta, excerpts, muted UI |
| `--content` | `rgb(31, 31, 31)` | Body copy |
| `--border` | `rgb(238, 238, 238)` | Card border, hairlines |
| `--code-bg` | `rgb(245, 245, 245)` | List canvas, inline code wash |
| `--tertiary` | `rgb(214, 214, 214)` | Weak controls |
| `--hljs-bg` | `rgb(28, 29, 33)` | Fenced code block background |

### Color tokens (dark)

| Token | Approx. value |
|-------|---------------|
| `--theme` | `rgb(29, 30, 32)` |
| `--entry` | `rgb(46, 46, 51)` |
| `--primary` | `rgb(218, 218, 219)` |
| `--secondary` | `rgb(155, 156, 157)` |
| `--content` | `rgb(196, 196, 197)` |
| `--border` | `rgb(51, 51, 51)` |
| `--code-bg` | `rgb(55, 56, 62)` |
| `--tertiary` | `rgb(65, 66, 68)` |

**Dark mode behavior (Phase 1 included):**

- Respect `prefers-color-scheme`.
- Optional toggle in header storing `pref-theme` in `localStorage` (`light` | `dark`), matching Lil'Log pattern.
- Apply via `body.dark` or `html` class; ensure flash-of-wrong-theme is minimized with early inline script in head override if practical.

### Typography

Global stack (Lil'Log-aligned):

```text
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif
```

Code stack:

```text
ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
"Courier New", monospace
```

Rules:

- Remove site-title cursive (`Snell Roundhand`, etc.).
- Remove footer Kaiti / STKaiti decorative fonts.
- Logo: ~24px, `font-weight: 700`, color `var(--primary)`.
- Body: 16px, line-height 1.6.
- Card title: ~24px, weight 600–700.
- Excerpt: 14px, `var(--secondary)`, max 2 lines with `-webkit-line-clamp: 2`.
- Meta: 13px, `var(--secondary)`.

Chinese rendering uses the system default (PingFang / Noto / Microsoft YaHei as provided by OS) via the system stack — no custom webfont requirement for Phase 1.

### Layout metrics

| Metric | Value |
|--------|--------|
| Main content width | ~720px |
| Nav max width | ~1024px |
| Gap | ~24px |
| Card radius | 8px |
| Card padding | ~var(--gap) / 1–1.5rem |
| Header height target | ~60px |

List pages (home, posts index): background `var(--code-bg)`; cards `var(--entry)` with `1px solid var(--border)`.

Post pages: background `var(--theme)`; content max-width ~720px; links use subtle underline (`box-shadow: 0 1px` or `text-decoration`) rather than warm accent color.

### Card component

Each list item:

1. Full-card hit target (absolute stretched link or wrapping anchor) preferred for UX parity with PaperMod.
2. Title (h2).
3. Excerpt (2 lines).
4. Footer meta: date · read time · optional tags.

Hover: slight border darken or transform; optional `:active { transform: scale(0.96) }` as in PaperMod — keep subtle.

Remove archive item bottom-border-only list styling for surfaces that use cards.

### Navigation

Keep:

- 文章 → `/posts/`
- 分类 → `/categories/`
- 标签 → `/tags/`
- 关于 → `/about/`

Visual: light masthead, hairline border, active item optional 2px bottom border on `primary`. No warm gradient footer chrome.

### About page

Retheme existing about card/preface styles to grayscale tokens so the page does not remain Morandi while the rest of the site is Paper-like. Content copy can stay.

### Code highlighting

Replace Morandi warm highlight palette with neutral tokens:

- Inline code: `var(--code-bg)` background.
- Blocks: `var(--hljs-bg)` with light syntax colors suitable for dark code panels (existing rouge classes restyled).

Drop three-tier `code-theme-soft|balanced|strong` warm schemes unless trivial to map; one readable default is enough.

## File / Module Plan

| File | Responsibility |
|------|----------------|
| `_config.yml` | `title`/`name` → `xie'blog`; theme flag rename away from `morandi` |
| `_sass/_variables-paper.scss` (new) | Color + type tokens; may supersede morandi variables |
| `_sass/_fonts-paper.scss` (new) or slim fonts file | System font mixins only |
| `_sass/_paper-theme.scss` (new) | Global element styles using tokens |
| Delete or stop importing | `_variables-morandi.scss`, `_fonts-morandi.scss`, `_morandi-theme.scss` after migration |
| `assets/css/main.scss` | Import paper stack; rewrite masthead, footer, archive cards, about overrides |
| `index.html` and/or `_includes/home-welcome.html` | Welcome line only |
| Layout/include overrides | Home list markup if MM default cannot card-wrap cleanly |
| `_includes/footer.html` | Keep line; ensure font inherits system stack |
| `_includes/head.html` or custom head | Dark-mode early script + theme toggle assets if needed |
| `_data/navigation.yml` | Unchanged URLs unless labels need tweak |

Minimal Mistakes archive list markup is typically `.archive__item` inside `.entries-list`. Prefer **CSS-first cards** on existing structure; only add includes if full-card link or meta row needs HTML change.

## Phasing

### Phase 1 (this spec)

1. Tokens + global fonts; remove Morandi.
2. Brand `xie'blog`.
3. Home welcome (main line only) + card list.
4. `/posts/` cards.
5. Footer + masthead restyle.
6. Post page color/type/width follow-through.
7. About page token follow-through.
8. Dark mode (system + toggle).

### Phase 2 (optional, out of scope unless pulled in)

- Category/tag archive cards (if not done in Phase 1).
- Reduce Font Awesome / jQuery weight.
- Archive timeline page.
- Post-level citation block.

**Phase 1 preference:** also apply cards to category/tag list items if the same `.archive__item` selector covers them with no extra HTML — do it when free.

## Acceptance Criteria

- [ ] No residual Morandi primary/bg/link hex families as dominant theme colors in compiled CSS for main chrome.
- [ ] Site title displays `xie'blog` in system sans, weight bold, no cursive.
- [ ] Home shows exactly one welcome sentence: `写字的人，在灯下。` and no subtitle paragraph under it.
- [ ] Home and posts index use bordered rounded cards with title / clamped excerpt / muted meta.
- [ ] Content column ~720px on article pages; list cards live in a ~720px centered column.
- [ ] Body/logo/welcome/footer use system font stack; no Kaiti on footer line.
- [ ] Light and dark themes both readable; toggle persists preference when implemented.
- [ ] About page matches grayscale system.
- [ ] Mobile: cards stack cleanly; welcome line does not overflow awkwardly; existing narrow nav behavior still works.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| MM default CSS fights overrides | Load paper theme **after** MM imports; increase selector specificity only where needed |
| Remote theme updates break overrides | Keep overrides in local `assets/css/main.scss` and `_includes` only |
| Dark mode FOUC | Small blocking/early script before paint, same pattern as Lil'Log |
| Chinese line-height with system fonts | Spot-check home, post, about on macOS Safari/Chrome |
| Losing brand warmth | Accept by design; lit comes from copy + whitespace |

## Testing Plan

1. Local `bundle exec jekyll serve` (or project’s usual serve path).
2. Visual check: home, one post, `/posts/`, `/about/`, `/categories/` or `/tags/`.
3. Toggle dark/light; reload to verify persistence.
4. Resize to ~360px and ~768px widths.
5. Grep built CSS / source for old Morandi hex values (`#f6efe7`, `#9f7a5a`, `#a55331`, etc.) and clear intentional leftovers.

## Open Decisions (resolved)

| Decision | Resolution |
|----------|------------|
| Subtitle on home | **None** — main line only |
| Palette | **Lil'Log grayscale**, not Morandi |
| Fonts | **System stack**, no decorative fonts |
| Brand | **`xie'blog`** |
| Implementation path | **Override MM (Approach A)** |
| Dark mode in Phase 1 | **Yes** |

## References

- Lil'Log: https://lilianweng.github.io
- PaperMod-like CSS variables observed on Lil'Log stylesheet (`--main-width: 720px`, system font stack, card `.post-entry`)
- Current footer: `_includes/footer.html`
- Current theme entry: `assets/css/main.scss`
