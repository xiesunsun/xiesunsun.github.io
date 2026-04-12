# Agent-Friendly Blog Design

## Context

The blog is a Jekyll static site published at `https://blog.sunxie.me`.

The current site already has:

- Jekyll posts and archive pages
- `feed.xml` and `sitemap.xml` through existing plugins
- article pages rendered through a customized Minimal Mistakes post layout

The user wants to make the site more friendly to AI agents in two distinct ways:

1. Agents should be able to discover, understand, and cite the site's content more easily.
2. Agents should be able to submit article drafts to the blog owner using a very lightweight protocol.

The user explicitly prefers a modern "website with skills" shape over a purely SEO-oriented approach.

The chosen direction is to expose one public website skill that explains:

- how to discover the blog's content
- how to consume and cite the blog's content
- how to prepare and submit a blog post draft

The submission path is intentionally minimal:

- no API
- no MCP server in the first version
- no automatic publishing
- the agent sends a completed Markdown article draft by email

## Goals

- Expose the blog as an agent-readable site with a stable public entry point.
- Publish one website skill that acts as the operating manual for agents interacting with the site.
- Define a simple and explicit article submission contract for agent-generated drafts.
- Keep the implementation small and compatible with the current Jekyll site.

## Non-Goals

- Building a full agent platform.
- Supporting automated publishing from agent submissions.
- Adding a custom backend or database.
- Designing an MCP server in the first version.
- Forcing all existing or future human-written posts to follow the agent-submission taxonomy.

## Chosen Approach

Use a hybrid but minimal architecture:

- keep a content discovery layer for broad compatibility
- add one public website skill for modern agent ecosystems
- define email-based submission instructions inside that same skill

This approach is preferred because it serves both classes of agents:

- generic search and retrieval agents that will only read web content
- skill-aware agents that can recognize and load explicit capability descriptors

## Public Surface

The site will expose three public entry points.

### 1. Discovery Entry Point

Add `/llms.txt` as the first machine-readable overview of the site.

Its role is to tell an agent:

- what this site is
- what topics it focuses on
- which pages are the best starting points
- how to interpret archives, categories, and tags

This file is for initial orientation, not for the full operating contract.

### 2. Skill Discovery Entry Point

Add `/.well-known/skills/index.json`.

Its role is to advertise one website skill, `sunxie-blog`, so skill-aware agents can discover it directly from the domain.

The index should point to a public `SKILL.md` file.

### 3. Website Skill

Add a public skill document at `/skills/sunxie-blog/SKILL.md`.

This file is the core contract for agent interaction with the site.

It will contain three sections:

- `Discover`
- `Consume`
- `Submit`

## Skill Responsibilities

### Discover

The `Discover` section should instruct agents to:

- start with `/llms.txt`
- use the archive page for chronology
- use category and tag pages for navigation
- prefer canonical post URLs when referencing content

It should also describe the blog at a high level, for example:

- personal technical essays
- AI agents
- coding workflows
- context and harness engineering

### Consume

The `Consume` section should instruct agents to:

- cite the canonical article URL
- preserve article title, author, and publication date when possible
- summarize before quoting when the intent is uncertain
- avoid overstating the author's position
- use tags and article excerpts to understand scope

This section is not an API specification. It is a reading and citation protocol.

### Submit

The `Submit` section should define the article draft contract.

For the first version, agents must:

- produce one complete Markdown post
- include valid Jekyll front matter
- use exactly one allowed agent-submission category
- include `AI-GENERATE` in `tags`
- send the draft to `ssunxie@163.com`
- use the subject format `AGENT NAME + 文章 TITLE + 类别`

## Agent Submission Rules

These rules apply only to agent-submitted articles.

They do not apply to all human-written posts on the site.

### Allowed Categories

The `categories` field must contain exactly one of the following:

- `AI-Essays`
- `AI-Engineering`
- `AI-Research`
- `AI-Notes`
- `AI-Reviews`
- `AI-Dreaming`

### Required Tag

The `tags` list must include:

- `AI-GENERATE`

Additional tags are allowed and encouraged when they clarify the topic.

### Markdown Template

The skill should provide a concrete template similar to:

```yaml
---
title: "文章标题"
excerpt: "一句话摘要"
date: 2026-04-12 10:00:00 +0800
categories:
  - AI-Essays
tags:
  - AI-GENERATE
  - AI Agent
---
```

This should be followed by the full article body in Markdown.

### Email Delivery

The submission instructions should state:

- recipient: `ssunxie@163.com`
- subject: `AGENT NAME + 文章 TITLE + 类别`
- body: the full Markdown article, or the same article as an attachment if the client supports it

The first version does not require an automated acknowledgment or webhook.

## Site Content Expectations

To make the skill useful, the website itself should present cleaner machine-readable signals.

The implementation should therefore include:

- a stronger site overview in `llms.txt`
- stable references to archive, category, and tag pages
- explicit mention of key themes and representative posts
- lightweight article metadata improvements where needed

The goal is not to duplicate the skill everywhere, but to make the website coherent for both humans and agents.

## Information Architecture

The proposed file layout is:

- `/llms.txt`
- `/.well-known/skills/index.json`
- `/skills/sunxie-blog/SKILL.md`

If static-site routing constraints make the final public URLs slightly different, the rendered URLs must still match the paths above.

## Implementation Notes For Jekyll

The current repository structure suggests the simplest implementation path:

- add `llms.txt` at the project root so it is published directly
- add a `.well-known` directory with `skills/index.json`
- add a public `skills/sunxie-blog/SKILL.md`
- update the post layout or shared head include only where needed to strengthen metadata

No backend service is required.

No plugin changes are required for the first version unless Jekyll publishing behavior needs a small adjustment for these static files.

## Validation

The design is successful when:

- an agent can land on the site and find a clear machine-readable overview through `/llms.txt`
- a skill-aware agent can discover `sunxie-blog` from `/.well-known/skills/index.json`
- the skill clearly explains how to discover and consume site content
- the skill clearly defines how to prepare and email an article draft
- the submission rules unambiguously require one allowed `AI-*` category and the `AI-GENERATE` tag
- the implementation fits into the current Jekyll site without introducing a backend

## Risks And Tradeoffs

- Skill discovery is not yet as universal as standard web crawling, so `llms.txt` remains necessary.
- Email-based submission is simple but not self-validating, so malformed drafts are still possible.
- A single skill keeps the model simple now, but it may need to split later if the site gains interactive capabilities.

These tradeoffs are acceptable for the first version because the user explicitly prefers a lightweight and modern setup over a large workflow system.
