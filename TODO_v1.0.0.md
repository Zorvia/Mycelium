<!--
Project: Eclipse
Owned by :contentReference[oaicite:2]{index=2}
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
-->

# TODO - Eclipse v1.0.0 Completion Checklist

## 1. Local Verification (must pass)

- [ ] Install dependencies: `npm ci`
- [ ] Run header check: `npm run validate:headers`
- [ ] Run story schema check: `npm run validate:stories`
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm run test`
- [ ] Build production bundle: `npm run build`
- [ ] Start local server: `npm run start`
- [ ] Manual UI smoke test on `http://localhost:3000`

## 2. Reader UX QA

- [ ] Verify search and sort on homepage
- [ ] Verify each story route opens and renders content correctly
- [ ] Verify font size controls persist per device
- [ ] Verify line-length controls persist per device
- [ ] Verify dark/light mode toggle persists per device
- [ ] Verify reading progress updates while scrolling
- [ ] Verify reading position is restored for each story
- [ ] Verify swipe gestures (mobile) for previous/next story

## 3. Review API QA

- [ ] `GET /api/reviews?storyId=<id>&sort=newest` returns list + stats
- [ ] `GET /api/reviews?storyId=<id>&sort=highest` sorts by rating desc
- [ ] `POST /api/reviews` validates payload and creates review
- [ ] Verify flagged/spam-like reviews are not shown in visible list
- [ ] Verify rate-limit returns `429` when threshold exceeded
- [ ] Verify `DELETE /api/reviews/:id` requires valid `x-admin-token`

## 4. Upstash + Environment Setup

- [ ] Create Upstash Redis database
- [ ] Set Vercel env vars:
  - [ ] `UPSTASH_REDIS_REST_URL`
  - [ ] `UPSTASH_REDIS_REST_TOKEN`
  - [ ] `REVIEW_ADMIN_TOKEN`
  - [ ] `RATE_LIMIT_PER_MINUTE`
- [ ] Confirm fallback mode works locally without Upstash vars (`data/reviews.json`)

## 5. Vercel Deployment

- [ ] Import `https://github.com/Zorvia/Eclipse.git` into Vercel
- [ ] Confirm framework preset is Next.js
- [ ] Confirm deployment succeeds from `main`
- [ ] Smoke test live deployment routes and review API

## 6. Accessibility + Performance

- [ ] Run Lighthouse on homepage and one story page
- [ ] Ensure no critical accessibility issues remain
- [ ] Validate contrast and focus indicators
- [ ] Verify reduced-motion behavior
- [ ] Confirm cover assets load and cache correctly

## 7. Repository Standards

- [ ] Confirm canonical header is present in all source files
- [ ] Confirm `LICENSE.md` remains exact and unchanged
- [ ] Confirm `CHANGELOG.md` includes v1.0.0
- [ ] Confirm `RELEASE_NOTES_v1.0.0.md` matches release content

## 8. Release Completion

- [ ] Create GitHub Release from tag `v1.0.0`
- [ ] Attach release notes and verification summary
- [ ] Add screenshots (desktop + mobile)
- [ ] Link live Vercel URL in release description
