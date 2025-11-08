# andyrdt.github.io

Personal academic website built with Jekyll 4.4.1.

## Quick Start

```bash
# Install dependencies
bundle install

# Start local server
bundle exec jekyll serve
```

Site available at http://localhost:4000

## Adding Content

- **Blog Post**: `_posts/YYYY-MM-DD-title.markdown`
- **Note**: `_notes/category/title.markdown`
- **Page**: `_pages/title.markdown`

All files need YAML front matter:
```yaml
---
layout: post
title: "Your Title"
date: 2023-03-14
---
```

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `main` branch automatically deploy.

To build locally:
```bash
bundle exec jekyll build
```

