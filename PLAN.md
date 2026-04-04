# Plan: Address QA Findings — 2026-04-04
<!-- /autoplan restore point: /Users/byron/.gstack/projects/Larsbyron-china_ev/main-autoplan-restore-20260404-151937.md -->

## Context
QA run on 2026-04-03 against live site https://www.china-ev.de/ found 7 issues. Health score 68/100.
This plan addresses those findings.

## Status
- No code written yet
- /autoplan review in progress

## QA Findings Summary

| # | Severity | Issue | Fix Location |
|---|----------|-------|-------------|
| 1 | CRITICAL | SSL certificate mismatch (www vs non-www) | Strato hosting config |
| 2 | HIGH | Giscus comments not configured | config.toml |
| 3 | HIGH | URL mismatch (baseURL=china-ev.de, live=www.china-ev.de) | config.toml + redirect |
| 4 | HIGH | Content-brand mismatch (Western EV content, not Chinese EVs) | sources.json, fetch_translate.py |
| 5 | MEDIUM | Search not functional | Theme/assets |
| 6 | MEDIUM | Pagination missing "Previous" link | themes/china-ev-blog |
| 7 | LOW | Social links broken | themes/china-ev-blog |

## Scope

### P0 — Critical (must fix)
1. **Fix SSL certificate / URL redirect** — Decide www vs non-www canonical, configure Strato redirect/cert
2. **Fix baseURL in config.toml** — Match the canonical domain chosen above

### P1 — High
3. **Configure Giscus comments** — Visit giscus.app, get repo params, fill config.toml
4. **Fix content supply — Replace broken Chinese feeds with CnEVPost** — Chinese RSS feeds (Sina, pcauto, 163) are blocked/broken outside China (SSL failures, timeouts). Replace with CnEVPost (https://cnevpost.com/feed/) — an English-language site about Chinese EVs with 50 entries covering BYD, NIO, XPeng, Li Auto, Xiaomi SU7, etc.
5. **Fix URL redirect** — Ensure one version redirects to the other properly

### P2 — Medium
6. **Add search** — Integrate Pagefind or Fuse.js for static search
7. **Fix pagination** — Add "← Previous" link in Hugo templates

### P3 — Low
8. **Fix social links** — Fill in actual Twitter/YouTube links in theme footer

---

<!-- AUTONOMOUS DECISION LOG -->
## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|-----------|-----------|----------|----------|

---

## CEO REVIEW (Phase 1)

### System Audit

**Recent commits:**
- `12ee0da` fix(ci): remove || operators from run blocks causing YAML parse error
- `b8246eb` feat: implement reliability sprint (dedup, draft mode, weekly Top 5, runlog)
- `b70947c` fix(ci): opt into Node.js 24 to avoid Sept 2026 deprecation

**No stashed work.** No open PRs.

### Content Supply Audit (2026-04-04)

**sources.json configuration:**
- 3 Chinese RSS sources: Sina Auto, 太平洋汽车 (pcauto), 网易汽车 (163)
- Max 5 articles per source = 15 potential articles per pipeline run
- Target language: Deutsch
- Filter: max article age 72 hours, exclude "used car", "accident", "二手车"

**Actual posts on disk:**
- 9 posts total
- 8 posts from Western sources: TechCrunch (3), The Verge (2), Ars Technica (2), Wired (1)
- 1 welcome post
- **Zero posts from Chinese sources**
- **Zero mentions of Chinese EV brands** (BYD, NIO, XPeng, Li Auto, Xiaomi Auto, 比亚迪, 蔚来, 小鹏)
- processed_articles.json: only 5 entries (all "rebuild" source)

**Interpretation:**
The deployed site (www.china-ev.de, QA tested 2026-04-03) was publishing Western EV content despite sources.json listing only Chinese sources. This means EITHER:
1. Chinese RSS feeds are broken/empty and pipeline fell back to Western sources
2. sources.json was recently updated to remove Western sources (post-QA)

The current sources.json lists Chinese sources only — but no Chinese content is in the repository. This suggests the Chinese feeds aren't producing usable content.

**Competitive landscape:** Web search unavailable (API error). Manual competitive scan recommended as next step.

### 0A. Premise Challenge

**Is this the right problem to solve?**

The QA report identified 7 issues. The P0 items (SSL/URL) are blocking — they affect every visitor and cause browser security warnings.

**BUT: Audit reveals the content supply is broken.**
- sources.json lists 3 Chinese RSS feeds (max 15 articles per run)
- 0 Chinese EV articles in the repository
- 8 of 9 posts are from Western sources (TechCrunch, The Verge, Ars Technica, Wired)
- 0 mentions of Chinese EV brands anywhere

The Chinese RSS feeds are either broken or producing no usable content. The "content-brand mismatch" (ISSUE-004) is even worse than the QA report described — the entire content supply chain for Chinese EVs appears broken.

**What would happen if we did nothing?**
- SSL cert errors continue to deter visitors and hurt SEO
- Brand trust erodes as readers realize the content doesn't match the brand
- Giscus stays empty, losing reader engagement
- Search stays broken, limiting archive discoverability
- The Chinese content supply remains broken and the site keeps publishing Western EV content

**Mode Selection: SELECTIVE EXPANSION**
- Baseline: fix the 7 QA issues PLUS diagnose why Chinese feeds aren't producing content
- Cherry-pick expansions: surface opportunities to improve

### 0B. Existing Code Leverage

| Sub-problem | Existing code | Reuse? |
|-------------|--------------|--------|
| URL redirect | None (Strato hosting) | N/A — server config |
| baseURL fix | config.toml | YES — trivial edit |
| Giscus config | config.toml (empty params) | YES — fill in existing |
| Content filter | fetch_translate.py (RSS filtering) | YES — enhance existing |
| Search | None (broken) | Pagefind is layer-1 approach |
| Pagination | themes/china-ev-blog | YES — template edit |
| Social links | themes/china-ev-blog | YES — template edit |

### 0C. Dream State Mapping

```
CURRENT STATE                           THIS PLAN                    12-MONTH IDEAL
─────────────────────────────────────── ─────────────────────────── ─────────────────────
Broken SSL deterring visitors     ---> Fix canonical domain      ---> Automated daily
Chinese feeds broken (0 content)  ---> Diagnose + fix feeds      ---> translation pipeline
Western content mislabeled as      ---> Align content to brand    ---> builds a loyal
"China EV News"                   --->                           ---> German-speaking
Giscus empty                       ---> Configure comments        ---> readership for
Search broken                      ---> Add Pagefind             ---> Chinese EV industry
Pagination no previous             ---> Fix template             ---> audience trust
Social links #placeholder          ---> Fill real links
```

### 0C-bis. Implementation Alternatives

**APPROACH A: Minimal fix (fix P0 only)**
  Summary: Fix SSL/URL and baseURL only
  Effort: S
  Risk: Low
  Pros: Unblocks visitors immediately
  Cons: Leaves 5 issues unaddressed
  Reuses: config.toml only

**APPROACH B: Full QA fix (all 7 issues)**
  Summary: Address every issue the QA report identified
  Effort: M
  Risk: Low
  Pros: Complete, no remaining known issues
  Cons: Content-brand fix requires ongoing tuning
  Reuses: All existing code

**RECOMMENDATION:** Choose APPROACH B because the effort to fix all 7 is low (mostly config and template edits), and leaving issues unaddressed compounds trust erosion.

### 0D. Mode-Specific Analysis (SELECTIVE EXPANSION)

**Hold scope baseline:** Fix all 7 QA issues.

**Expansion scan:**
1. **10x check:** Instead of just fixing search, could we add an RSS feed for external subscribers? Could we auto-post to Twitter/X when new articles publish?
2. **Delight opportunities:**
   - Add "reading time" estimate to articles
   - Add "share to Twitter/X" button
   - Add a "related articles" section
   - Add language switcher (German/English)
   - Add weekly email digest signup
3. **Platform potential:** Content pipeline already works — could it be repurposed for other verticals?

**Cherry-pick ceremony (deferred to gate)**

### 0E. Temporal Interrogation

```
HOUR 1: SSL/URL fix — decide canonical domain, edit config.toml, test locally
HOUR 2: Giscus config — visit giscus.app, get params, edit config.toml
HOUR 3: Content filter — update sources.json, enhance fetch_translate.py filtering
HOUR 4: Search — integrate Pagefind into Hugo build
HOUR 5: Pagination + social links — edit Hugo templates
HOUR 6+: Test all changes, commit, push
```

### 0F. Mode Selection

**SELECTIVE EXPANSION** — baseline is fix all 7, but surface expansion opportunities.

---

## NOT in scope
- Building a native mobile app
- Adding a commenting system other than Giscus
- Full redesign of the site
- Multi-language CMS
- User accounts / authentication
- Newsletter (deferred until content supply is validated)

## What already exists
- Hugo static site with custom theme in `themes/china-ev-blog/`
- `fetch_translate.py` pipeline with RSS filtering
- `config.toml` with empty Giscus params
- Pagination templates (just missing "previous" link)
- 3 Chinese RSS source configs (Sina, pcauto, 163) — BROKEN (SSL failures, timeouts)
- NEW SOURCE FOUND: CnEVPost (https://cnevpost.com/feed/) — English-language Chinese EV news, 50 entries, accessible

## Dream state delta
This plan fixes the 7 known QA issues AND replaces the broken Chinese RSS supply with CnEVPost.
CnEVPost is actually BETTER than Chinese RSS feeds:
- Already in English (no translation needed, or minimal)
- High-quality, focused content on Chinese EVs
- Reliable RSS access
- Covers BYD, NIO, XPeng, Li Auto, Xiaomi SU7, etc.

The 12-month ideal is an authoritative German-language source for Chinese EV news,
with active reader engagement via comments and broad reach via search/social.

---

## ENG REVIEW (Phase 3)

### Affected Files

- `config.toml` — baseURL, Giscus params
- `themes/china-ev-blog/layouts/` — pagination, social links
- `sources.json` — RSS source priorities
- `fetch_translate.py` — content filtering logic

### No new architecture
This is a config/template fix plan, not a new feature. No new components or services.

### Test Review

**NEW UX FLOWS:**
- None (configuration changes only)

**NEW DATA FLOWS:**
- None (static site generation unchanged)

**NEW CODEPATHS:**
- sources.json filtering enhancement in fetch_translate.py
- Pagefind integration in Hugo build

**EXISTING FLOWS TO VERIFY:**
- Hugo build still works after template changes
- Giscus loads correctly with new config
- Pagefind index builds correctly

---

## DX REVIEW (Phase 3.5 — SKIPPED)

No developer-facing scope. This is a configuration and template fix plan.
The "developers" here are the blog maintainers running fetch_translate.py.

---

## DESIGN REVIEW (Phase 2 — SKIPPED)

No UI scope detected. All changes are:
- Configuration (config.toml)
- Server-side redirects (Strato)
- Template corrections (pagination, social links)
- Content filtering (sources.json, Python code)

No new screens, no visual changes, no user-facing interaction flows.

---

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale |
|---|-------|----------|-----------|-----------|----------|
| 1 | CEO | Mode = SELECTIVE EXPANSION | Taste | P1 (completeness) | Fix all 7 QA issues as baseline, surface expansions |
| 2 | CEO | Approach = Full QA fix (Approach B) | Mechanical | P3 (pragmatic) | Low effort, high value, leaves no known issues |
| 3 | CEO | Design scope = NONE | Mechanical | P1 (completeness) | No UI screens, templates, or interactions changed |
| 4 | CEO | DX scope = NONE | Mechanical | P1 (completeness) | No new developer-facing features, APIs, or CLIs |
| 5 | CEO | Audit Chinese feeds first | USER_CHOICE | User confirmed | Ran diagnostic before QA fixes |
| 6 | CEO | Root cause: Chinese feeds blocked | Mechanical | P1 | SSL failures + timeouts confirmed |
| 7 | CEO | CnEVPost as primary source | Mechanical | P1 | 50 entries, BYD/NIO/XPeng covered, accessible |
| 8 | CEO | Expand: Add reading time estimate | Taste | P1 | Delight opportunity, ~15 min with CC+gstack |
| 9 | CEO | Expand: Add share buttons | Taste | P1 | Delight opportunity, ~15 min with CC+gstack |

---

## Completion Summary

| Review | Status | Notes |
|--------|--------|-------|
| CEO Review | COMPLETE | Root cause found (blocked feeds) + solution (CnEVPost) |
| CEO Voices | Claude subagent only | 7 issues found (2 CRITICAL), Codex unavailable |
| Design Review | SKIPPED | No UI scope |
| Eng Review | COMPLETE | Config/template fixes, no new architecture |
| Eng Voices | SKIPPED | No outside voices configured |
| DX Review | SKIPPED | No developer-facing scope |

---

## /autoplan Review Complete (Final)

### Plan Summary
Fix all 7 QA issues on china-ev.de AND replace the broken Chinese RSS supply with **CnEVPost** (https://cnevpost.com/feed/) — an English-language site about Chinese EVs with 50 entries per feed, covering BYD, NIO, XPeng, Li Auto, Xiaomi SU7, etc.

### Decisions Made: 5 total (3 auto-decided, 2 taste choices at gate)

### User Challenges: None

### Root Cause Found and Solved

**Problem:** Chinese RSS feeds are inaccessible from outside China:
- Sina Auto: SSL certificate verify failed
- 太平洋汽车: SSL certificate verify failed
- 网易汽车: Connection timeout

**Solution Found:** CnEVPost (https://cnevpost.com/feed/)
- English-language Chinese EV news, 50 entries per feed
- Fully accessible, no SSL/timeout issues
- Covers exactly the right brands: BYD (3 mentions), NIO (8), XPeng (2), Li Auto (1), Xiaomi (2), Onvo (3) in recent 30 entries
- **Better than Chinese RSS:** Already in English, no translation API needed, reliable supply

### Updated P1 Item #4

**"Fix content supply"** — Replace broken Chinese feeds (Sina, pcauto, 163) with CnEVPost as primary source in sources.json. The pipeline already supports English content — just change the source URL.

### Your Choices

**Choice 1: Reading time estimate** — SKIP (nice-to-have, ~15 min)
**Choice 2: Twitter/X share buttons** — ADD (~15 min, drives traffic)

### Auto-Decided: 3 decisions
- Mode = SELECTIVE EXPANSION
- Approach = Full QA fix + CnEVPost as primary source
- Design scope = NONE
- DX scope = NONE

### Review Scores
- CEO: Root cause found + solution identified (CnEVPost)
- CEO Voices: Claude subagent only (Codex unavailable)
- Eng: Config/template fixes, no new architecture risks
- Design: SKIPPED, no UI scope
- DX: SKIPPED, no developer-facing scope

---

## Ready to Implement

The plan:
1. **P0-Critical**: Fix SSL/URL (decide www vs non-www, fix baseURL in config.toml)
2. **P1-High**: Configure Giscus comments; Replace broken Chinese feeds with CnEVPost; Fix URL redirect
3. **P2-Medium**: Add Pagefind search; Fix pagination (add "Previous" link)
4. **P3-Low**: Fix social links

Optional enhancements (your call): reading time estimate, Twitter/X share buttons

**Say "go" and I'll start implementing.**
