# Andy Arditi's Personal Website

> Simple, elegant academic personal website built with Jekyll.

## Contents

- [Andy Arditi's Personal Website](#andy-arditis-personal-website)
  - [Contents](#contents)
  - [Quick Start](#quick-start)
  - [Project Structure](#project-structure)
  - [Making Changes](#making-changes)
    - [Adding New Content](#adding-new-content)
    - [Content File Structure](#content-file-structure)
  - [Customization](#customization)
    - [Theme \& Typography](#theme--typography)
    - [Site Configuration](#site-configuration)
  - [Deployment](#deployment)

## Quick Start

```bash
# Clone repository
git clone https://github.com/andyrdt/andyrdt.github.io.git
cd andyrdt.github.io

# Install dependencies
bundle install

# Start local server (live preview)
bundle exec jekyll serve
```

Your site will be available at: http://localhost:4000

## Project Structure

This Jekyll site has a clean, minimalist structure:

```
andyrdt.github.io/
├── _config.yml       # Site configuration
├── assets/           # CSS, JavaScript, images
├── _includes/        # Reusable page components
├── _layouts/         # Page templates
├── _posts/           # Blog posts (YYYY-MM-DD-title.markdown)
├── _notes/           # Academic notes
├── _pages/           # Site pages
└── index.markdown    # Homepage
```

## Making Changes

### Adding New Content

- **Blog Post**: Add a file to `_posts/` named `YYYY-MM-DD-title.markdown`
- **Note**: Add a file to `_notes/` or a subject subdirectory
- **Page**: Add a file to `_pages/` with proper front matter

### Content File Structure

Every content file needs YAML front matter at the top:

```yaml
---
layout: post          # or: page, note, etc.
title: "Your Title"   # Title of the content
date: 2023-03-14      # Publication date (for posts)
---

Your content in Markdown here...
```

## Customization

### Theme & Typography

The site uses EB Garamond as its base font. Typography settings are in `assets/main.scss`:

```scss
// Key variables you might want to change
$base-font-family: 'EB Garamond', serif;
$base-font-size: 19px;
$base-line-height: 1.5;
$brand-color: #6d88a5;      // Primary color
```

### Site Configuration

Edit `_config.yml` to change:
- Site title and description
- Social media links
- Navigation menu items
- Collection settings

## Deployment

The site automatically deploys to GitHub Pages when you push changes to the main branch.

To manually build the site:

```bash
bundle exec jekyll build
```

This generates the static site in the `_site/` directory. 