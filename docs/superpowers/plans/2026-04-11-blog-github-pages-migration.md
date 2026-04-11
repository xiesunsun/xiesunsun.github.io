# Blog GitHub Pages Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the existing Jekyll blog into `xiesunsun/xiesunsun.github.io`, publish it through GitHub Pages at `blog.sunxie.me`, and retire the old server-based blog deployment path.

**Architecture:** Keep the blog source in the repository root, build it with Ruby/Bundler in GitHub Actions, and deploy the generated `_site` directory to GitHub Pages. Configure Pages and Cloudflare so only `blog.sunxie.me` points at the new deployment.

**Tech Stack:** Jekyll, Minimal Mistakes, Ruby, Bundler, GitHub Actions, GitHub Pages, Cloudflare DNS

---

## File Map

- Modify: `/Users/ssunxie/code/my-blog/_config.yml`
- Modify: `/Users/ssunxie/code/my-blog/README.md`
- Modify or delete: `/Users/ssunxie/code/my-blog/deploy.sh`
- Create: `/Users/ssunxie/code/my-blog/.github/workflows/deploy.yml`
- Create: `/Users/ssunxie/code/my-blog/CNAME`
- Create: `/Users/ssunxie/code/my-blog/docs/superpowers/specs/2026-04-11-blog-github-pages-migration-design.md`
- Create: `/Users/ssunxie/code/my-blog/docs/superpowers/plans/2026-04-11-blog-github-pages-migration.md`

### Task 1: Normalize repository deployment metadata

**Files:**
- Modify: `/Users/ssunxie/code/my-blog/_config.yml`
- Create: `/Users/ssunxie/code/my-blog/CNAME`

- [ ] **Step 1: Inspect current site URL settings**

Run: `sed -n '1,120p' /Users/ssunxie/code/my-blog/_config.yml`
Expected: Confirm `url` is `https://blog.sunxie.me` and `baseurl` is empty.

- [ ] **Step 2: Adjust Jekyll config if needed**

Update `_config.yml` so:

```yaml
baseurl: ""
url: "https://blog.sunxie.me"
timezone: "Asia/Shanghai"
```

Expected: Public URL matches the final blog domain and timezone matches the user's locale.

- [ ] **Step 3: Add the Pages custom domain file**

Create `/Users/ssunxie/code/my-blog/CNAME` with:

```text
blog.sunxie.me
```

- [ ] **Step 4: Verify file contents**

Run: `sed -n '1,20p' /Users/ssunxie/code/my-blog/CNAME`
Expected: Output is exactly `blog.sunxie.me`.

### Task 2: Replace server deployment with GitHub Pages deployment

**Files:**
- Create: `/Users/ssunxie/code/my-blog/.github/workflows/deploy.yml`
- Modify: `/Users/ssunxie/code/my-blog/README.md`
- Modify or delete: `/Users/ssunxie/code/my-blog/deploy.sh`

- [ ] **Step 1: Write the GitHub Pages workflow**

Create `.github/workflows/deploy.yml` that:

- checks out the repository
- sets up Ruby
- installs Bundler dependencies
- runs `bundle exec jekyll build`
- uploads `_site`
- deploys with `actions/deploy-pages`

- [ ] **Step 2: Remove or mark obsolete the old server deploy script**

Either delete `deploy.sh` or replace its body with a short message indicating GitHub Pages is now the supported deployment path.

Expected: There is only one clearly supported deployment mechanism in the repository.

- [ ] **Step 3: Update deployment documentation**

Rewrite `README.md` so it explains:

- local development commands
- GitHub Pages deployment via Actions
- custom domain expectation of `blog.sunxie.me`
- that Cloudflare DNS should point `blog.sunxie.me` to `xiesunsun.github.io`

- [ ] **Step 4: Inspect the final workflow and docs**

Run:

```bash
sed -n '1,220p' /Users/ssunxie/code/my-blog/.github/workflows/deploy.yml
sed -n '1,220p' /Users/ssunxie/code/my-blog/README.md
```

Expected: Workflow is valid and docs match the new deployment model.

### Task 3: Validate local build before push

**Files:**
- Test: `/Users/ssunxie/code/my-blog/_site`

- [ ] **Step 1: Install dependencies if required**

Run: `bundle install`
Expected: Gems install successfully or Bundler reports everything is already satisfied.

- [ ] **Step 2: Build the site locally**

Run: `bundle exec jekyll build`
Expected: Build succeeds and refreshes `/Users/ssunxie/code/my-blog/_site`.

- [ ] **Step 3: Smoke-check key output pages**

Run:

```bash
test -f /Users/ssunxie/code/my-blog/_site/index.html
test -f /Users/ssunxie/code/my-blog/_site/about/index.html
test -f /Users/ssunxie/code/my-blog/_site/tags/index.html
test -f /Users/ssunxie/code/my-blog/_site/categories/index.html
```

Expected: All checks exit successfully.

### Task 4: Retarget the repository remote and preserve the old site

**Files:**
- Remote only: `https://github.com/xiesunsun/xiesunsun.github.io`

- [ ] **Step 1: Verify current remotes**

Run: `git -C /Users/ssunxie/code/my-blog remote -v`
Expected: Confirm local `origin` still points to the template repository before changing it.

- [ ] **Step 2: Point `origin` to the user repository**

Run:

```bash
git -C /Users/ssunxie/code/my-blog remote set-url origin https://github.com/xiesunsun/xiesunsun.github.io.git
git -C /Users/ssunxie/code/my-blog remote -v
```

Expected: Fetch and push URLs both point to `xiesunsun/xiesunsun.github.io`.

- [ ] **Step 3: Create a backup branch from the current remote main**

Run:

```bash
git clone --depth 1 https://github.com/xiesunsun/xiesunsun.github.io.git /tmp/xiesunsun-ghpages-backup
git -C /tmp/xiesunsun-ghpages-backup checkout -b backup/astro-before-jekyll-migration
git -C /tmp/xiesunsun-ghpages-backup push origin backup/astro-before-jekyll-migration
```

Expected: The old Astro site is preserved on a dedicated backup branch.

### Task 5: Push the migration and switch Pages to the blog domain

**Files:**
- Remote only: `https://github.com/xiesunsun/xiesunsun.github.io`

- [ ] **Step 1: Commit the migration changes**

Run:

```bash
git -C /Users/ssunxie/code/my-blog add CNAME .github/workflows/deploy.yml README.md _config.yml docs/superpowers/specs/2026-04-11-blog-github-pages-migration-design.md docs/superpowers/plans/2026-04-11-blog-github-pages-migration.md
git -C /Users/ssunxie/code/my-blog commit -m "feat: migrate blog deployment to GitHub Pages"
```

Expected: A commit is created without staging unrelated user changes.

- [ ] **Step 2: Push to the Pages repository**

Run: `git -C /Users/ssunxie/code/my-blog push origin HEAD:main`
Expected: The repository main branch is updated with the Jekyll blog.

- [ ] **Step 3: Set the GitHub Pages custom domain**

Run:

```bash
gh api -X PUT repos/xiesunsun/xiesunsun.github.io/pages \
  -f cname=blog.sunxie.me
```

Expected: Pages now reports `blog.sunxie.me` as the configured custom domain.

- [ ] **Step 4: Confirm workflow and Pages status**

Run:

```bash
gh run list --repo xiesunsun/xiesunsun.github.io --limit 5
gh api repos/xiesunsun/xiesunsun.github.io/pages
```

Expected: A new deployment run appears and Pages reports the updated domain.

### Task 6: Cut Cloudflare DNS and verify public traffic

**Files:**
- DNS only: Cloudflare zone for `sunxie.me`

- [ ] **Step 1: Update Cloudflare DNS**

Change `blog.sunxie.me` from the old server IP to:

```text
Type: CNAME
Name: blog
Target: xiesunsun.github.io
Proxy status: DNS only
```

Expected: DNS stops resolving to the old server and begins resolving to GitHub Pages.

- [ ] **Step 2: Verify DNS resolution**

Run:

```bash
dig +short blog.sunxie.me
dig +short CNAME blog.sunxie.me
```

Expected: Resolution reflects GitHub Pages instead of the previous Ubuntu server IP.

- [ ] **Step 3: Verify HTTPS site behavior**

Run:

```bash
curl -I https://blog.sunxie.me
curl -I https://blog.sunxie.me/about/
```

Expected: Successful HTTP responses from GitHub Pages, not `nginx/1.18.0 (Ubuntu)`.

- [ ] **Step 4: Decommission the old server deployment path**

Only after successful verification, remove or stop the old blog-serving Nginx configuration on the previous server.

Expected: The server is no longer needed for blog traffic.
