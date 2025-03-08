# Codebase Overview

This document provides a quick overview of how this Jekyll website works. You should be able to understand the entire codebase in 5-10 minutes by reading this guide.

## Table of Contents

1. [Site Architecture](#site-architecture)
2. [Key Files](#key-files)
3. [Content Management](#content-management)
4. [Styling System](#styling-system)
5. [JavaScript Functionality](#javascript-functionality)
6. [Workflow Guide](#workflow-guide)

## Site Architecture

This site is built with [Jekyll](https://jekyllrb.com/), a static site generator that transforms plain text into static websites. The key principles are:

- **Content as Markdown**: All content is written in Markdown files
- **Front Matter**: YAML metadata at the top of content files controls layout and metadata
- **Layouts**: HTML templates in `_layouts/` define how pages are structured
- **Includes**: Reusable HTML components in `_includes/` (header, footer, etc.)
- **Collections**: Content is organized into collections (`_posts`, `_notes`, etc.)

## Key Files

The most important files in this codebase are:

- `_config.yml` - Main configuration file for the entire site
- `assets/main.scss` - Main stylesheet that controls site appearance
- `_layouts/default.html` - Base layout template used by all pages
- `_includes/head.html` - Contains metadata, CSS and JS imports
- `_includes/header.html` - Site navigation
- `_includes/footer.html` - Site footer
- `index.markdown` - The homepage

## Content Management

Content is organized into collections, defined in `_config.yml`:

- `_posts/` - Blog posts (named `YYYY-MM-DD-title.markdown`)
- `_notes/` - Academic notes (organized by topic in subdirectories)
- `_pages/` - Static pages like "About" 
- `_papers/` - Academic papers

Each content file must have front matter (YAML between `---` lines) at the top:

```yaml
---
layout: post
title: "Example Post"
date: 2023-01-01
---
```

## Styling System

The styling system uses Sass (SCSS) and is organized as follows:

- `assets/main.scss` - Primary stylesheet that imports other styles
- `_sass/minima.scss` - Variables and utility mixins 
- `_sass/minima/` - Component stylesheets

Key style components:

1. **Typography**: Uses EB Garamond as the primary font
2. **Academic components**: Special styling for theorems, proofs, etc.
3. **Layout components**: Responsive grid and containers
4. **Interactive elements**: Collapsible sections, quote cards, etc.

To modify styles, edit `assets/main.scss` or the files it imports.

## JavaScript Functionality

The site uses minimal JavaScript for enhanced functionality:

- `assets/js/footnotes.js` - Creates tooltip-style popups for footnotes
- `assets/js/toc.js` - Highlights the current section in the table of contents

Both are simple, standalone modules that don't rely on any frameworks.

## Workflow Guide

### Making Common Changes

1. **Add a new blog post**:
   - Create file in `_posts/` named `YYYY-MM-DD-title.markdown`
   - Add front matter with layout, title, date
   - Write content in Markdown

2. **Update site information**:
   - Edit `_config.yml` to change site title, description, etc.
   
3. **Modify the visual design**:
   - Edit variables in `_sass/minima.scss` for global changes
   - Edit specific styles in `assets/main.scss`

4. **Add a new page**:
   - Create file in `_pages/` with front matter
   - Add to navigation by editing `nav_items` in `_config.yml`

### Development Workflow

1. Clone the repository
2. Run `bundle install` to install dependencies
3. Run `bundle exec jekyll serve` for live preview
4. Make changes and test locally
5. Commit and push to GitHub to deploy (uses GitHub Pages)

For more detailed information, see the [Jekyll documentation](https://jekyllrb.com/docs/). 