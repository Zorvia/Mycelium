<!--
Project: Eclipse
Owned by :contentReference[oaicite:2]{index=2}
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
-->

# Contributing

## Required Source Header

Every source file must start with this exact canonical header (language-appropriate comment syntax):

```text
Project: Eclipse
Owned by :contentReference[oaicite:2]{index=2}
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
```

Rules:
- Keep wording exact.
- Keep header at top of file.
- Keep header length at 10 lines or fewer.

## PR Checklist

- [ ] `npm run validate:headers` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] No secrets or credentials committed.
- [ ] Changes preserve Zorvia Community attribution and ZPL v2.0 obligations.

