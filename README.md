<!--
Project: Eclipse
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
-->

# Eclipse v1.0.0

Production-ready, reader-first short-story library with persistent server-backed reviews and Vercel deployment. **All credits to the Zorvia Community.**

## Repository

- GitHub: `https://github.com/Zorvia/Eclipse.git`
- Release target: `v1.0.0`

## Quick Start

```bash
git clone https://github.com/Zorvia/Eclipse.git
cd Eclipse
npm ci
npm run dev
```

Open `http://localhost:3000`. The homepage loads a searchable grid of stories. Click any cover to open the reader. Reviews are stored locally in `data/reviews.json` when Upstash is not configured.

## Technical Decisions

- TypeScript: enabled across frontend, API, and scripts.
- Reviews persistence provider: Upstash Redis (production), file fallback (local development).
- Review auth model: anonymous reviews with server-side moderation flagging and rate limiting.
- Styling: handcrafted CSS variables for typographic rhythm and accessible theming.
- Brand tokens: tasteful default neutral palette and open-source font stack (Inter, Source Serif 4).
- Additional trademark names: none beyond ZPL v2.0 clauses.

## Features

- App Router Next.js architecture for Vercel.
- Searchable and sortable story grid with cover art.
- Reader page with:
  - adjustable font size (A−/A+)
  - line-length control (Narrow/Wide)
  - dark/light theme toggle with persistence
  - reading progress indicator
  - per-story saved reading position (per device)
  - swipe gestures (mobile) and keyboard navigation links
- Persistent reviews with:
  - `GET /api/reviews?storyId=...&sort=newest|highest` — returns reviews + stats
  - `POST /api/reviews` — creates review (rate-limited)
  - `DELETE /api/reviews/:id` — admin deletion (token required)
  - average rating and count aggregation
  - spam heuristics and content sanitization
- Accessibility: focus management, ARIA roles, keyboard navigation, `prefers-reduced-motion` support, high-contrast light/dark themes.

## Content Authoring Guide

Add a new story by creating a Markdown file in `stories/`:

```yaml
---
id: "my-story"
title: "My Story Title"
author: "Zorvia"
date: "2026-03-10"
cover: "assets/covers/my-story.svg"
description: "A brief synopsis of the story."
tags: ["genre", "mood"]
---

Your story content in Markdown format. Use headings, paragraphs,
blockquotes, and emphasis as needed. The reader renders HTML from
this Markdown automatically.
```

1. Place the `.md` file in `stories/`.
2. Place the cover image (SVG recommended, 300×400) in `assets/covers/` **and** `public/assets/covers/`.
3. Add the canonical header comment at the top of both files (see Headers section).
4. Run `npm run validate:stories` to check frontmatter.

## Review Moderation

- **Anonymous posting** is allowed. Reviewers may optionally provide a name.
- Reviews are checked for spam keywords; suspicious reviews are **flagged** and hidden from public listing.
- Rate limiting is enforced per IP (configurable via `RATE_LIMIT_PER_MINUTE`, default: 6).
- **Admin deletion**: send a `DELETE` request to `/api/reviews/:id` with the `x-admin-token` header set to the value of `REVIEW_ADMIN_TOKEN`.

```bash
# Example: delete a review
curl -X DELETE https://your-domain.vercel.app/api/reviews/REVIEW_ID \
  -H "x-admin-token: YOUR_ADMIN_TOKEN"
```

## Headers and License

Every source file must begin with the canonical header:

```
Project: Eclipse
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
```

Use language-appropriate comment syntax (e.g., `/* */` for TS/CSS, `<!-- -->` for HTML/MD, `#` for YAML). Verify with:

```bash
npm run validate:headers
```

The license is in `LICENSE.md` (ZPL v2.0) and must remain unchanged. The ASCII Zorvia logo must be preserved verbatim.

## Environment Variables

See `.env.example`:

| Variable | Purpose | Required |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint | Production |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis auth token | Production |
| `REVIEW_ADMIN_TOKEN` | Secret for admin review deletion | Recommended |
| `RATE_LIMIT_PER_MINUTE` | Max review POSTs per IP per minute | Optional (default: 6) |

If Upstash variables are missing, the API falls back to `data/reviews.json`.

## Vercel Deployment

1. Import `https://github.com/Zorvia/Eclipse.git` into Vercel.
2. Framework preset: **Next.js**.
3. Add environment variables from `.env.example` in the Vercel dashboard.
4. Deploy. The site is served automatically on each push to `main`.

Do **not** commit secrets or API keys to the repository.

## CI and Verification

```bash
npm run validate:headers   # Header compliance
npm run lint               # ESLint
npm run test               # Vitest unit tests
npm run build              # Next.js production build
```

GitHub Actions workflow: `.github/workflows/ci.yml` runs all checks on push to `main` and on PRs.

## License

Licensed under **ZPL v2.0** (Zorvia Public License). See [LICENSE.md](LICENSE.md) for the full text.

All credits to the **Zorvia Community**.
