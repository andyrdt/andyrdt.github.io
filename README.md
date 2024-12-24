# andyrdt.github.io

Built using [Jekyll](https://jekyllrb.com/).

## Local development

```bash
bundle install
bundle exec jekyll serve
```

## Font Settings

To modify the site's typography, edit these variables in `_sass/minima.scss`:

```scss
// Typography
$base-font-family    # The main font for your site (default: 'Crimson Text', serif)
$base-font-size      # Base font size (default: 18px)
$base-font-weight    # Default font weight (default: 400)
$base-line-height    # Line height for text (default: 1.5)
$base-letter-spacing # Letter spacing (default: -0.01rem)
$small-font-size     # Size for smaller text (default: 87.5% of base)
```

## Changing Fonts

1. To change the site's font:
   - Update `$base-font-family` in `_sass/minima.scss`
   - Ensure the font is either:
     - Web-safe
     - Added to `_includes/head.html` via Google Fonts or similar
     - Included in the project's assets

2. To adjust spacing and sizing:
   - Modify the respective variables in `_sass/minima.scss`
   - Changes will apply site-wide automatically

