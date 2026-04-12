# Agent-Friendly Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a minimal agent-friendly layer for the Jekyll blog with `llms.txt`, website skill discovery, a public `SKILL.md`, and lightweight article metadata improvements.

**Architecture:** Add three static public entry points at the site root and `.well-known`, then strengthen post metadata so the published content is easier for agents to identify and cite. Keep the first version static-only and route article submission through a documented email workflow.

**Tech Stack:** Jekyll, Minimal Mistakes, Liquid templates, static Markdown/JSON/TXT assets

---

### Task 1: Publish static agent entry points

**Files:**
- Create: `llms.txt`
- Create: `.well-known/skills/index.json`
- Create: `skills/sunxie-blog/SKILL.md`
- Modify: `_config.yml`

- [ ] **Step 1: Add `llms.txt`**

Write a concise machine-readable overview of the site, key pages, topics, and citation guidance.

- [ ] **Step 2: Add skill discovery JSON**

Create `/.well-known/skills/index.json` that advertises the single `sunxie-blog` skill and points to the public `SKILL.md`.

- [ ] **Step 3: Add the public website skill**

Write `skills/sunxie-blog/SKILL.md` with `Discover`, `Consume`, and `Submit` sections plus the email submission contract.

- [ ] **Step 4: Ensure Jekyll publishes `.well-known`**

Update `_config.yml` so `.well-known` is included in the generated site.

### Task 2: Strengthen article metadata

**Files:**
- Modify: `_includes/head.html`
- Modify: `_layouts/single.html`

- [ ] **Step 1: Add agent-oriented head links**

Expose discoverable links such as `llms.txt` and the skill index from the shared head include.

- [ ] **Step 2: Add explicit post JSON-LD**

Emit a compact `BlogPosting` JSON-LD block for posts so machines can identify canonical URL, author, dates, excerpt, tags, and language more reliably.

### Task 3: Verify publication behavior

**Files:**
- Test via local build output in `_site/`

- [ ] **Step 1: Build the site**

Run: `bundle exec jekyll build`

- [ ] **Step 2: Verify generated assets**

Confirm the build outputs:
- `_site/llms.txt`
- `_site/.well-known/skills/index.json`
- `_site/skills/sunxie-blog/SKILL.md`

- [ ] **Step 3: Inspect generated post HTML**

Check that a built article page contains the new JSON-LD and discovery links.
