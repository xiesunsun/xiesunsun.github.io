# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder About page with a custom personal-card page that reflects the user's current identity, tone, and Morandi visual style.

**Architecture:** Keep `/about/` as a Jekyll page, but render it with custom structured content and page-scoped classes instead of relying on a default article-like body. Extend the existing custom stylesheet with focused About page sections so the new design stays isolated from the rest of the site.

**Tech Stack:** Jekyll, Minimal Mistakes, SCSS, Markdown/HTML

---

## File Map

- Modify: `/Users/ssunxie/code/my-blog/_pages/about.md`
- Modify: `/Users/ssunxie/code/my-blog/assets/css/main.scss`
- Test: `/Users/ssunxie/code/my-blog/_site/about/index.html`

### Task 1: Replace placeholder About page content

**Files:**
- Modify: `/Users/ssunxie/code/my-blog/_pages/about.md`

- [ ] **Step 1: Inspect the current About page**

Run: `sed -n '1,220p' /Users/ssunxie/code/my-blog/_pages/about.md`
Expected: Confirm the page still contains placeholder text.

- [ ] **Step 2: Replace the body with structured About page markup**

Write page content that includes:

- hero section with `sunxie`
- subtitle `码农研究生`
- location `朝阳 · 北京`
- quote `code is cheap,show me your talk`
- short introduction
- four current-focus items
- GitHub link button

Expected: The page body has stable wrapper classes that can be targeted cleanly in SCSS.

- [ ] **Step 3: Keep front matter simple and explicit**

Ensure front matter keeps:

```yaml
permalink: /about/
title: "关于"
```

Expected: Route and page title stay stable.

### Task 2: Add page-scoped About page styling

**Files:**
- Modify: `/Users/ssunxie/code/my-blog/assets/css/main.scss`

- [ ] **Step 1: Add an About page style section**

Create a scoped style block targeting the About page content wrappers only.

Expected: Styles do not leak into posts or archive pages.

- [ ] **Step 2: Style the hero area**

Add styles for:

- decorative wordmark for `sunxie`
- subtitle
- location line
- quote line

Expected: The wordmark feels special, while supporting text remains readable.

- [ ] **Step 3: Style the introduction and current-focus sections**

Add styles for:

- intro panel
- section headings
- four focus cards in a responsive grid

Expected: The page feels like a designed card layout rather than plain body text.

- [ ] **Step 4: Style the GitHub link area**

Add a clear button-like treatment for the GitHub link.

Expected: It stands out without overwhelming the page.

### Task 3: Verify the page locally

**Files:**
- Test: `/Users/ssunxie/code/my-blog/_site/about/index.html`

- [ ] **Step 1: Build the site**

Run:

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle exec jekyll build
```

Expected: Build succeeds.

- [ ] **Step 2: Confirm the About page output**

Run:

```bash
sed -n '1,260p' /Users/ssunxie/code/my-blog/_site/about/index.html
```

Expected: Output includes the new About page text and structure.

- [ ] **Step 3: Confirm CSS output includes About page selectors**

Run:

```bash
rg -n "about-card|about-hero|about-focus|about-links" /Users/ssunxie/code/my-blog/_site/assets/css/main.css
```

Expected: The generated stylesheet includes the new About page rules.
