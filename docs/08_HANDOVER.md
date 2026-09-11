# Project Handover & Living Context: TechPulse Intelligence

## 1. Project Status Summary
- **Current Status**: Phase 1, 2, 3 + Top 3 Intelligence Enhancements (EPSS Exploit Scoring, Yesterday Delta Tracking, RSS 2.0 Syndication Feed) Complete & Verified.
- **Next Phase to Execute**: Phase 4 (Modern Web Dashboard in `web/`).
- **Model Context**: Gemini 3.8 Flash (High) / Antigravity

---

## 2. Where Things Stand Right Now

### What is Done:
- [x] Complete AI Collaboration Field Guide documentation system codified in `docs/` (`00_BUILD_PLAN.md` through `08_HANDOVER.md`).
- [x] Python dependencies verified (`httpx`, `rich`, `pydantic`, `python-dotenv`, `google-genai`).
- [x] **Phase 1: Signal Collection Engine fully built and verified**:
  - `src/collectors/cve_collector.py`: Live ingestion from CISA KEV catalog with timeout and error handling.
  - `src/collectors/ai_collector.py`: Ingestion from Hugging Face Daily Papers and Trending Models.
  - `src/collectors/github_collector.py`: High-velocity repo discovery with token detection and rate-limit guardrails.
  - `src/collectors/news_collector.py`: Hacker News API with concurrent thread-pool ingestion for sub-second responses.
  - `src/collectors/test_collectors.py`: Multi-collector validation test suite with Windows console UTF-8 compatibility (2.14s runtime).
- [x] **Phase 2: AI Brain & Intelligence Synthesis Engine fully built and verified**:
  - `src/analyzer/models.py`: Full Pydantic v2 schemas (`DailyReport`, `CveItem`, `AiBreakthrough`, `TrendingTool`, `TechNewsItem`).
  - `src/analyzer/fallback_analyzer.py`: Deterministic offline synthesizer with dynamic threat level assessment (`LOW` to `CRITICAL`), 3-paragraph executive briefing, and 3–5 key takeaways.
  - `src/analyzer/gemini_analyzer.py`: Live Google Gemini SDK (`gemini-3.6-flash`) integration with `response_schema=DailyReport`, backoff retries, multi-model fallback, and rate-limiting safeguards.
  - `src/analyzer/test_analyzer.py`: Automated verification suite validating fallback, offline resilience, and live Gemini AI synthesis.
- [x] **Phase 3: Storage, Serialization & GitHub Streak Engine fully built and verified**:
  - `src/storage/writer.py`: Dual-writer serializing `data/YYYY/MM/YYYY-MM-DD.json`, `reports/YYYY/MM/YYYY-MM-DD.md`, updating `data/archive_index.json`, and updating root `README.md` latest intelligence section.
  - `src/git_manager/streak_engine.py`: Randomized jitter delay simulation, rotating conventional commit messages, and non-destructive git commit/push under configured user identity.
  - `main.py`: Unified Rich interactive terminal CLI with `run`, `preview`, `test`, `streak` subcommands.
  - `.github/workflows/daily-intel.yml`: Serverless daily GitHub Actions cron workflow with random delay jitter.
- [x] **Top 3 Intelligence Engine Enhancements (Pre-Phase 4)**:
  1. **FIRST.org EPSS Exploit Probability Scoring**:
     - `src/collectors/cve_collector.py`: Integrated batch querying against `https://api.first.org/data/v1/epss?cve=...` to attach probability scores (e.g., `11.8%`) and percentile rankings.
     - `src/analyzer/models.py`: Added `epss_score` and `epss_percentile` to `CveItem`.
     - `src/storage/writer.py`: Added dedicated `EPSS Prob` column in Markdown reports and `top_epss` index in `data/archive_index.json`.
  2. **Historical Delta & "What's New Today" Detection**:
     - `src/analyzer/delta_tracker.py`: Reads prior reports from `data/archive_index.json`, compares telemetry, annotates items with `is_new_today: bool`, and tracks day-over-day threat shifts (`yesterday_threat_level`).
     - `src/analyzer/gemini_analyzer.py` & `src/analyzer/fallback_analyzer.py`: Contextualizes day-over-day changes in the executive overview.
     - `src/storage/writer.py`: Renders `🔥 ` badges and yesterday's threat level badge in Markdown.
  3. **Standard RSS 2.0 / Atom Syndication Feed**:
     - `src/storage/writer.py`: Generates standards-compliant XML feeds (`data/rss.xml` and `data/feed.xml`) on every cycle with RFC-822 timestamps, categories, and CDATA summaries.
- [x] Ran verification protocol from `docs/06_TEST_CHECKLIST.md`:
  - `python -m src.collectors.test_collectors` -> 100% Passed (2.14s)
  - `python -m src.analyzer.test_analyzer` -> 100% Passed (55s)
  - `python main.py run --dry-run` -> 100% Passed, generated web JSON, Markdown report, archive index, and RSS/Atom feeds.

### What is In Progress / Up Next (Phase 4 Execution):
- [x] Scaffold `web/` using Next.js 15 App Router, TypeScript, and Tailwind CSS.
- [x] Integrate 3D-pop Michelangelo David bust with multi-tiered physical drop shadows and mouse spring perspective tilt.
- [x] Build active animated mouth synthwave canvas visualizer connected to real-time Web Audio API frequency synthesis.
- [x] Pivot architecture to "Tech News First" with authentic computing epigraphs, purging all placeholder rave/party text.
- [x] Implement UI Views:
  - `01 DISPATCH` (`<DispatchView />`): HeroDavid3D, executive briefing, top tech news cards, daily metric ribbon.
  - `02 RADAR` (`<RadarView />`): Search/filter command bar, AI research papers, trending open-source tools, CVE vulnerability cards with FIRST.org EPSS exploit meters.
  - `03 CHRONICLES` (`<ChroniclesView />`): Date archive picker (`data/archive_index.json`), day-over-day threat shifts, RSS 2.0 / Atom feed syndicate links, and GitHub streak engine provenance.
  - `<DetailModal />`: Forensic deep inspection drawer.
  - `<FloatingNavbar />`: Minimal dark capsule header with threat badge, view switcher, and frequency audio toggle.
- [x] Connect web client to `data/archive_index.json`, `data/rss.xml`, `data/feed.xml`, and `data/2026/09/2026-09-04.json`.
- [x] Run verification protocol from `docs/06_TEST_CHECKLIST.md` Section 6 (`npm run build` compiled 100% cleanly in 48s, HTTP 200 OK verified).

### What is Broken:
- None. All pipelines, collectors, AI brain, delta tracking, EPSS enrichment, RSS feeds, streak engine, and Next.js 15 web dashboard are 100% operational.

### What to Avoid:
- Avoid committing `.env` or exposing API keys.
- Avoid breaking data contract schemas between `data/*.json` and the frontend models.

---

## 3. Session Handoff Note (5-Line Ritual)
1. **What we did**: Built and verified Phase 4 (Modern Web Dashboard) in `web/` using Next.js 15, Tailwind CSS, Motion, and Web Audio API; created 3D-pop David bust with real-time mouth synthwave canvas; refactored content to Tech News First; verified via production build and HTTP 200 test.
2. **Where we are**: Complete system (Phases 1 through 4 + EPSS + Delta Tracking + RSS Feeds) is 100% built, verified, and operational.
3. **What is next**: Optional CI/CD or Vercel deployment of `web/`, or ongoing daily automated cron runs.
4. **What to watch out for**: Preserve static data asset paths in `web/public/data/` on new daily runs.
5. **How to pick up**: Run `cd web && npm run dev` to launch the local web server, or `python main.py run` to generate fresh daily intelligence.



