# Sun Xie Blog

This repository contains the Jekyll source for the blog published at [blog.sunxie.me](https://blog.sunxie.me).

## Local development

Install dependencies:

```bash
bundle install
```

Start a local server:

```bash
bundle exec jekyll serve
```

Build the static site:

```bash
bundle exec jekyll build
```

The generated site is written to `_site/`.

## Deployment

Deployment is handled by GitHub Pages through the workflow in `.github/workflows/deploy.yml`.

The repository is expected to be hosted at:

- Repository: `https://github.com/xiesunsun/xiesunsun.github.io`
- Production URL: `https://blog.sunxie.me`

For GitHub Pages custom domain setup:

- Set the custom domain in the repository Pages settings to `blog.sunxie.me`
- Point the Cloudflare DNS record `blog.sunxie.me` to `xiesunsun.github.io`
- Prefer a `CNAME` record with `DNS only` during the initial cutover

## Notes

- `sunxie.me` is intentionally not used as the blog's production URL in this repository.
- The old server-based deployment path has been retired in favor of GitHub Pages.
