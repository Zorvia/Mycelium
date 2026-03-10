<!--
Project: Eclipse
Owned by :contentReference[oaicite:2]{index=2}
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
-->

# Eclipse v1.0.0 Release Notes

## Highlights

- Reader-first Next.js experience with searchable story library.
- Production review API with persistence abstraction and Upstash Redis adapter.
- Anonymous review workflow with anti-abuse controls and moderation status.
- Accessibility-first interaction design and reduced-motion support.
- Header-validation script + CI checks for repository standards.

## Verification Checklist

- [ ] `npm run validate:headers`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] Vercel preview deployment loads homepage and story pages
- [ ] Reviews can be posted and fetched
- [ ] Rate limit path returns `429` when exceeded
- [ ] LICENSE text unchanged
