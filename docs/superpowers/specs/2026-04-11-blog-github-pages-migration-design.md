# Blog GitHub Pages Migration Design

## Context

The current repository at `/Users/ssunxie/code/my-blog` is a Jekyll blog based on the Minimal Mistakes theme. It was previously intended for deployment to a self-managed server behind Cloudflare using the custom domain `blog.sunxie.me`.

The desired destination is GitHub Pages using the existing repository `https://github.com/xiesunsun/xiesunsun.github.io`, with the blog published only at `https://blog.sunxie.me`.

Additional observed context:

- The local repository's current `origin` still points to the upstream Minimal Mistakes starter repository, not the user's repository.
- The existing `xiesunsun.github.io` repository is not empty; it currently contains an Astro site deployed via GitHub Pages workflow.
- GitHub Pages for `xiesunsun.github.io` is currently configured with the custom domain `sunxie.me`, which does not match the intended final blog domain.
- DNS for `blog.sunxie.me` currently resolves to the previous Ubuntu/Nginx server rather than GitHub Pages.

## Goals

- Replace the existing contents of `xiesunsun/xiesunsun.github.io` with this Jekyll blog.
- Publish the blog from GitHub Pages at `https://blog.sunxie.me`.
- Remove the blog's dependency on the old server-based deployment path.
- Keep migration scope narrow: deployment correctness first, customization later.

## Non-Goals

- Redesigning the site's visual appearance.
- Rewriting content structure or post organization.
- Reconfiguring the root domain `sunxie.me` beyond removing the incorrect Pages binding from this blog deployment.

## Decision Summary

### Repository strategy

Use `xiesunsun/xiesunsun.github.io` as the canonical repository for the blog and directly replace its existing Astro site contents. Before replacement, preserve the previous contents in a backup branch so rollback remains possible.

This approach is preferred because:

- The repository already exists and is public.
- The user explicitly approved direct replacement.
- Using the user-site repository keeps GitHub Pages hosting conventional and easy to maintain.

### Build and deployment strategy

Deploy the Jekyll site using GitHub Actions rather than relying on GitHub Pages' built-in Jekyll builder.

This is preferred because:

- The current site uses plugins and configuration that are more predictable when built in Actions.
- Actions-based Pages deployment gives explicit control over Ruby, Bundler, build commands, and artifact output.
- The same repository can keep source files at the root without committing generated output.

### Custom domain strategy

Bind GitHub Pages only to `blog.sunxie.me`.

This is preferred because:

- It matches the intended final public blog URL.
- It isolates the blog from any separate future use of the apex domain `sunxie.me`.
- A subdomain is the simplest and most reliable DNS setup for GitHub Pages.

## Target State

After migration:

- `https://github.com/xiesunsun/xiesunsun.github.io` contains the Jekyll blog source from this repository.
- GitHub Pages deploys from a GitHub Actions workflow in that repository.
- The repository contains a `CNAME` file with `blog.sunxie.me`.
- `_config.yml` keeps `url: "https://blog.sunxie.me"` and `baseurl: ""`.
- Cloudflare DNS points `blog.sunxie.me` to `xiesunsun.github.io` via CNAME.
- `https://blog.sunxie.me` serves the GitHub Pages site over HTTPS.

## Implementation Design

### Local repository changes

The migration implementation should make the minimum necessary source changes:

- Update repository remote configuration to target `xiesunsun/xiesunsun.github.io`.
- Add a GitHub Pages Actions workflow that installs Ruby dependencies, builds the Jekyll site, and deploys the generated `_site` artifact.
- Add a root-level `CNAME` file containing `blog.sunxie.me`.
- Keep `_config.yml` aligned with the final public URL.
- Update deployment documentation so the repository reflects GitHub Pages as the new deployment target.
- Retain the old `deploy.sh` only if it is clearly marked obsolete; otherwise remove it to avoid ambiguity.

### Remote repository changes

Before replacing the contents of `xiesunsun/xiesunsun.github.io`:

- Create a backup branch from the current remote `main`, such as `backup/astro-before-jekyll-migration`.
- Replace the working tree contents with this Jekyll repository state.
- Push the migration to `main`.

### GitHub Pages changes

In the repository settings or through the GitHub API:

- Keep Pages publishing type as GitHub Actions.
- Change the configured custom domain from `sunxie.me` to `blog.sunxie.me`.
- Ensure Pages HTTPS remains enforced once certificate issuance completes.

### Cloudflare DNS changes

After the GitHub Pages custom domain is updated:

- Change `blog.sunxie.me` from the old server IP to a CNAME pointing at `xiesunsun.github.io`.
- Prefer `DNS only` during the initial cutover.
- Do not leave the old server IP attached to `blog.sunxie.me`, or users will continue reaching the old deployment.

## Cutover Sequence

Use this order to minimize risk:

1. Confirm the repository builds successfully locally.
2. Prepare and commit migration changes.
3. Back up the current remote `main` branch.
4. Push the Jekyll site into `xiesunsun.github.io`.
5. Update GitHub Pages custom domain to `blog.sunxie.me`.
6. Wait for GitHub Pages to recognize the domain and begin certificate provisioning.
7. Update Cloudflare DNS for `blog.sunxie.me` to CNAME `xiesunsun.github.io`.
8. Verify HTTPS access, content correctness, and asset loading on `https://blog.sunxie.me`.
9. Decommission the old server-based blog deployment once the new site is confirmed stable.

## Validation

The migration is successful when all of the following are true:

- Local `bundle exec jekyll build` succeeds.
- GitHub Actions successfully builds and deploys the site.
- GitHub Pages reports `blog.sunxie.me` as the active custom domain.
- `https://blog.sunxie.me` responds with the GitHub Pages-hosted blog, not the old Nginx server.
- Core pages load successfully, including home, about, archives, and a sample post.

## Rollback

If the migration fails before DNS cutover:

- Leave Cloudflare DNS unchanged.
- Fix the repository or workflow and retry without public impact.

If the migration fails after DNS cutover:

- Repoint `blog.sunxie.me` temporarily back to the previous server IP.
- Restore the old site from the preserved backup branch if the repository state must be reverted.

## Risks

- The repository currently has local uncommitted changes; migration work must avoid overwriting unrelated user edits.
- GitHub Pages certificate issuance may take time after changing the custom domain.
- If Cloudflare keeps `blog.sunxie.me` pointed at the old server during cutover, validation results will be misleading.
- The incorrect current Pages binding to `sunxie.me` must be removed to avoid domain ownership confusion.
