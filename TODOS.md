# TODO: Address QA Findings — 2026-04-26

Updated after Phase 1.5 implementation (2026-04-26).

## Phase 1.5 — Critical Fixes (Week 1)

### P0 — Critical
1. **Switch Vercel from Hugo to Next.js** — Remove Hugo build, ensure Vercel serves Next.js static export ✅
2. **Fix SSL certificate / URL redirect** — Decide www vs non-www canonical, configure redirect ✅
3. **Fix baseURL** — Match canonical domain in Next.js metadata ✅

### P1 — High
4. **Configure Giscus comments** — Visit giscus.app, get real repo params, replace placeholders in GiscusComments.tsx ✅
5. **Fix social links in footer** — Replace placeholder `https://github.com` with actual links ✅
6. **Switch to next/font** — Replace Google Fonts `<link>` in layout.tsx with self-hosted Inter via next/font ✅
7. **Delete sources.json** — Dead config file that lists sources the scraper never used ✅
8. **Add Zod validation to parseMarkdownFile** — Catch malformed frontmatter before rendering ✅
9. **Replace formatContent() with remark/rehype** — Regex-based HTML conversion is unsafe and incomplete ✅
10. **Rename article.ts:formatDate to toISODateString** — Prevents import confusion ✅
11. **Add width/height to article images** — Fix CLS (layout shift) ✅
12. **Add critical path unit tests** — article.ts utilities, remark rendering, translator edge cases ✅ (100 tests passing)
13. **Define EV specs JSON schema** — Data contract needed before Phase 3 (Recharts) and Phase 4 (comparison tool) ✅

### P2 — Medium (from prior QA, deferred)
14. **Add search** — Pagefind integration for full-text search (Phase 5)
15. **Fix pagination** — Add "Previous" link in Next.js templates (Phase 2)

## Phase 3+ Deferred

### P2.5 — Design (from /plan-design-review 2026-04-26)
19. **Fix design doc contradictions** — `byron-main-design-2026-04-26.md` says "Tailwind CSS" (codebase uses CSS Modules), "dark mode optional" (already dark-first), lists `app/api/webhook/route.ts` (incompatible with static export). Fix all three. ✅
20. **Run /design-consultation** — Create a proper DESIGN.md documenting the full token system, component patterns, and conventions from `global.css`. Prevents token drift in future features. Depends on: Phase 1.5 shipping first. (Phase 3)

### Future — Content & Features
16. **Newsletter form backend** — NewsletterForm renders but submissions go nowhere. Need email service (ConvertKit, Mailchimp) or remove the form. Depends on choosing a provider. (Phase 6)
17. **Image optimization strategy** — `unoptimized: true` in next.config.ts means no Next.js image optimization. External article images load at full size. Options: image CDN (Cloudinary, imgix) or build-time sharp processing. Blocked by static export constraint.
18. **Content index for getAllArticles()** — Synchronous filesystem reads don't scale past ~500 articles. Build-time JSON manifest would help. Not urgent at current scale.

## Completed
- ~~Fix content-brand mismatch~~ — sources.json is dead code (deleted), scraper only uses Chinese sources
- ~~Phase 1.5 all 13 tasks~~ — Build passes, 100 tests passing
- ~~Design doc contradictions~~ — Tailwind → CSS Modules, dark mode → dark-first, API route removed
