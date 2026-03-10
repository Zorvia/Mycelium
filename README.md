<!--
Project: Eclipse
Owned by :contentReference[oaicite:2]{index=2}
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
-->

# Eclipse v1.0.0

Production-ready, reader-first short-story library with persistent server-backed reviews and Vercel deployment.

## Repository

- GitHub: `https://github.com/Zorvia/Eclipse.git`
- Release target: `v1.0.0`

## Technical Decisions

- TypeScript: enabled
- Reviews persistence provider: Upstash Redis (default), file fallback for local development
- Review auth model: anonymous reviews with moderation flagging and rate limiting
- Brand tokens: tasteful default neutral palette and open-source font stack
- Additional trademark names: none beyond ZPL v2.0 clauses

## Features

- App Router Next.js architecture for Vercel.
- Searchable and sortable story grid.
- Reader page with:
  - adjustable font size
  - line-length control
  - dark/light theme toggle
  - reading progress indicator
  - per-story saved reading position
  - swipe gestures (mobile) + keyboard navigation links
- Persistent reviews with:
  - `GET /api/reviews?storyId=...&sort=newest|highest`
  - `POST /api/reviews`
  - `DELETE /api/reviews/:id` (admin token required)
  - stats: average rating + count
  - basic anti-abuse: rate limiting and spam heuristics

## Headers And License

- Every source file must include the canonical header block.
- Verify with:

```bash
npm run validate:headers
```

- License is in `LICENSE.md` and must remain unchanged.

## Story Content Model

Stories are stored in `stories/*.md` with YAML frontmatter:

```yaml
---
id: "story-id"
title: "Story Title"
author: "Zorvia"
date: "2026-03-10"
cover: "assets/covers/story-cover.svg"
description: "Short summary"
tags: ["genre", "mood"]
---
```

## Local Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

See `.env.example`:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `REVIEW_ADMIN_TOKEN`
- `RATE_LIMIT_PER_MINUTE`

If Upstash variables are missing, the API uses `data/reviews.json` local fallback.

## CI And Verification

```bash
npm run validate:headers
npm run lint
npm run test
npm run build
```

GitHub Actions workflow: `.github/workflows/ci.yml`

## Vercel Deployment

1. Import `https://github.com/Zorvia/Eclipse.git` into Vercel.
2. Framework preset: Next.js.
3. Add environment variables from `.env.example`.
4. Deploy.

## Moderation Notes

- Flagged reviews are stored but hidden from normal listing.
- Admin deletion endpoint requires `x-admin-token` equal to `REVIEW_ADMIN_TOKEN`.

## Release Notes

- See `CHANGELOG.md` for v1.0.0 summary.
