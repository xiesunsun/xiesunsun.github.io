# About Page Design

## Context

The site currently has an `/about/` page at `/Users/ssunxie/code/my-blog/_pages/about.md`, but it still contains placeholder text. The rest of the site already uses a custom warm Morandi-inspired theme layered on top of Minimal Mistakes.

The user wants the About page to become a finished personal introduction page rather than a generic blog post. The page should feel like a personal card with a little warmth, not a resume and not a long autobiography.

## Goals

- Replace placeholder content on `/about/` with a complete personal About page.
- Present the user primarily as a concise personal card.
- Keep the page visually aligned with the site's Morandi theme while making it more distinct than a normal article page.
- Use the specific user-provided facts and wording direction.

## Non-Goals

- Redesigning the entire site.
- Adding article recommendations or reading guides, since there are no published posts yet.
- Turning the About page into a resume, CV, or project portfolio.

## User-Provided Content

- Display name: `sunxie`
- Identity line: `码农研究生`
- Location: `朝阳 北京`
- Current focus:
  - 投递实习
  - 看《学会提问》
  - 准备毕业
  - 研究 Harness engineering
- Self-description:
  - 网上冲浪爱好者
  - 期待早睡的夜猫子
  - AGI降临派
- Public link:
  - GitHub: `https://github.com/xiesunsun/`
- Favorite short line:
  - `code is cheap,show me your talk`

The user also wants the display name to use a more decorative, calligraphic or script-like visual treatment.

## Decision Summary

Use a `名片 + 近况` About page.

This is preferred because:

- The user explicitly chose a personal-card direction over story-heavy or project-heavy variants.
- The supplied content is short and strong enough for a concise structured page.
- The page can feel personal without needing fabricated biography details.

## Page Structure

The About page should have four sections.

### 1. Hero

The top section introduces the user at a glance:

- decorative display of `sunxie`
- subtitle `码农研究生`
- location `朝阳 · 北京`
- the short line `code is cheap,show me your talk`

The display name should stand out with a more expressive type treatment, but the rest of the page should remain highly readable.

### 2. Short Introduction

This section should read like a natural self-introduction, not like bullet points copied from metadata.

Target content:

- 网上冲浪爱好者，期待早睡的夜猫子，AGI 降临派。
- A second sentence that grounds the current phase of life: internship applications, graduation preparation, reading, and exploring `Harness engineering`.

The tone should be calm, specific, and lightly personal.

### 3. Current Focus

This section should show the four current activities as small cards or tiles rather than plain list bullets:

- 投递实习
- 看《学会提问》
- 准备毕业
- 研究 Harness engineering

The purpose is to make the page feel current and lived-in.

### 4. Link Section

This section should include a single strong GitHub entry point rather than a crowded social grid.

The label should be simple and explicit, such as `GitHub`.

## Visual Direction

The page should not look like a default Markdown article.

### Layout

- Use a custom page wrapper for `/about/`.
- Keep the composition simple and restrained.
- Prefer clear section spacing, soft card surfaces, and moderate width.

### Color and Material

- Continue the site's warm Morandi palette.
- Make the About page slightly softer and more paper-like than the article layout.
- Use subtle borders, low-contrast surfaces, and careful hierarchy rather than heavy shadows.

### Typography

- Use a script or calligraphic look only for the `sunxie` hero wordmark.
- Keep all other content in legible body fonts already used by the site.
- Avoid decorative typography anywhere else.

## Content Style

The About page copy should feel:

- direct
- calm
- slightly playful
- not corporate
- not sentimental

Avoid inflated self-branding and resume-like phrasing.

## Implementation Strategy

Implement the About page as a custom page template driven from front matter rather than trying to coerce the default article layout.

The recommended approach:

- keep `/Users/ssunxie/code/my-blog/_pages/about.md` as the page entry
- move its body content to structured HTML or Markdown sections with stable wrapper classes
- add focused About page styles in the site's custom stylesheet
- scope those styles carefully so they affect only `/about/`

## Validation

The implementation is successful when:

- `/about/` no longer shows placeholder lorem ipsum
- the hero area clearly presents `sunxie`, `码农研究生`, `朝阳 · 北京`, and the short quote
- the four current-focus items render as a deliberate visual section
- the GitHub link is prominent and functional
- the page feels distinct from a normal post while still matching the rest of the site
