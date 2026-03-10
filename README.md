<!--
Project: Eclipse
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0
See LICENSE.md for details
-->

# Eclipse

Eclipse is a static digital library web app owned by Zorvia. It presents a grid of book covers and opens stories in an accessible reader overlay.

All credits for this repository and project go to the Zorvia Community.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Markdown story sources converted to static HTML fragments

## Repository Layout

```text
eclipse/
|- index.html
|- README.md
|- LICENSE.md
|- package.json
|- styles/
|  |- main.css
|- scripts/
|  |- app.js
|  |- reader.js
|  |- build.js
|  |- validate-stories.js
|- stories/
|  |- *.md
|  |- *.html (generated)
|  |- manifest.json (generated)
|- assets/
|  |- covers/
|     |- *.svg
|- .github/
|  |- PULL_REQUEST_TEMPLATE.md
```

## Ownership And Attribution

- Owned by: Zorvia
- Credits: Zorvia Community
- License: ZPL v2.0 (see `LICENSE.md`)

## Local Development

1. Install Node.js 18+.
2. Install dependencies:

```bash
npm install
```

3. Validate story metadata:

```bash
npm run validate
```

4. Build stories and manifest:

```bash
npm run build
```

5. Preview locally:

```bash
npm run preview
```

Then open `http://localhost:8000`.

## Story Authoring

Add a markdown file in `stories/` with frontmatter:

```markdown
<!-- standard project header comment required -->
---
title: "Story Title"
author: "Zorvia"
date: "2026-03-10"
cover: "assets/covers/story-title.svg"
tags: ["tag-1", "tag-2"]
id: "story-title"
---

Story body in Markdown.
```

Run:

```bash
npm run validate
npm run build
```

This generates `stories/<slug>.html` and updates `stories/manifest.json`.

## Accessibility

- Keyboard support for cover cards (Tab, Enter, Space)
- Accessible modal reader (`role="dialog"`, `aria-modal="true"`)
- Focus moves into reader and returns to trigger on close
- Escape closes reader
- Mobile-friendly tap targets

## GitHub Pages Deployment

1. Push repository to GitHub.
2. Open repository **Settings** > **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`.
5. Save. GitHub Pages will publish the site.
6. Visit: `https://<username>.github.io/<repository>/`

If you use a custom domain, add a `CNAME` file at the repository root.

## Verification Checklist

1. `LICENSE.md` exists at repository root.
2. Every source file begins with the standard project header comment.
3. `npm run validate` exits with code 0.
4. `npm run build` generates `.html` story files and `stories/manifest.json`.
5. Home grid renders covers and titles.
6. Click/tap on a cover opens readable story overlay.
7. Keyboard navigation works (Tab, Enter/Space, Escape, Arrow keys).
8. GitHub Pages serves the site after push.

## License

This repository is licensed under ZPL v2.0. The full and authoritative license text must remain unchanged in `LICENSE.md`.
