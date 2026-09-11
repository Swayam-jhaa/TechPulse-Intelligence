# Master Phased Build Plan: TechPulse Intelligence

## Overview
This build plan defines the sequential, decoupled phases to build the **TechPulse Intelligence** platform. Per the *AI Collaboration Field Guide*, each phase has strict definitions of done, verifiable test commands, and isolated scope. No phase begins until the prior phase passes its verification criteria.

---

## Phase Roadmap

```
  ┌─────────────────────────────────────────────────────────────┐
  │ Phase 1: Signal Collection Engine                           │
  │ - CISA KEV, Hugging Face, GitHub Trending, Hacker News      │
  │ - Zero LLM dependency, 100% pure typed data extraction      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Phase 2: AI Brain & Intelligence Synthesis Engine           │
  │ - Google Gemini 2.5 Flash SDK integration                   │
  │ - Strict Pydantic JSON Schema enforcement + Fallback engine │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Phase 3: Storage, Serialization & GitHub Streak Engine      │
  │ - data/*.json & reports/*.md dual-writers + archive index   │
  │ - Randomized execution jitter & commit authoring            │
  │ - GitHub Actions cron runner (.github/workflows/daily.yml)  │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Phase 4: Modern Web Dashboard                               │
  │ - Next.js 15 App Router + Tailwind CSS cyber-terminal UI    │
  │ - Interactive Threat Radar, AI Tracker & Historical Archive │
  │ - Production Vercel / Cloudflare Pages deployment           │
  └─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Signal Collection Engine (First Priority)
**Goal**: Build a resilient, rate-limit friendly data collection engine that extracts and normalizes the top daily security advisories, AI papers/models, open-source repositories, and tech discussions into structured Python dictionaries.

### Key Deliverables:
1. `src/config.py`: Centralized configuration for feed URLs, request headers, timeouts, and limits.
2. `src/collectors/cve_collector.py`:
   - Ingests active exploits from CISA Known Exploited Vulnerabilities (KEV) catalog.
   - Extracts CVE ID, vendor, product, vulnerability title, description, and remediation actions.
3. `src/collectors/ai_collector.py`:
   - Ingests Hugging Face Daily Papers (top upvoted daily research with abstracts and URLs).
   - Ingests Hugging Face Trending Models (top trending open-weights with download stats).
4. `src/collectors/github_collector.py`:
   - Ingests fastest-growing repositories created within the last 7–14 days using GitHub Search API.
   - Leverages authenticated GitHub CLI token (`gh auth token`) to ensure a 5,000 req/hr rate limit.
5. `src/collectors/news_collector.py`:
   - Ingests high-scoring technology headlines, architectural discussions, and outages from Hacker News Firebase API.
6. `src/collectors/test_collectors.py`:
   - Comprehensive test runner validating that all 4 collectors fetch valid, non-empty, typed records.

### Criteria of Done:
- Running `python -m src.collectors.test_collectors` executes all 4 collectors in under 10 seconds.
- Every collector handles HTTP timeouts and connection errors gracefully without crashing.
- Exits with returncode 0 and prints a formatted status summary.

---

## Phase 2: AI Brain & Intelligence Synthesis Engine
**Goal**: Connect the raw signals from Phase 1 to Google Gemini (`gemini-2.5-flash`), enriching them into an executive briefing with threat level assessments, key takeaways, and deep-dive technical insights.

### Key Deliverables:
1. `src/analyzer/models.py`:
   - Strict Pydantic models: `DailyReport`, `CveItem`, `AiBreakthrough`, `TrendingTool`, `TechNewsItem`.
2. `src/analyzer/gemini_analyzer.py`:
   - Uses `google-genai` SDK with `response_schema=DailyReport` for guaranteed structured JSON.
   - Prompt engineering: Assigns threat levels (`LOW` to `CRITICAL`), writes 3-paragraph executive overview, generates 3–5 bullet key takeaways, and summarizes practical developer impact.
3. `src/analyzer/fallback_analyzer.py`:
   - Deterministic offline rule-based synthesizer that formats raw signals into a valid `DailyReport` if `GEMINI_API_KEY` is missing or API quota is exceeded.
4. `src/analyzer/test_analyzer.py`:
   - Verifies that both Gemini synthesis and fallback synthesis generate valid `DailyReport` objects that satisfy all schema constraints.

### Criteria of Done:
- Successfully generates a complete `DailyReport` instance using live collector data.
- 100% Pydantic schema validation compliance.
- Fallback path tested and verified by running with `GEMINI_API_KEY=""`.

---

## Phase 3: Storage, Serialization & GitHub Streak Engine
**Goal**: Persist the synthesized intelligence into dual data/report formats and automate daily GitHub streak commits with randomized human-like jitter.

### Key Deliverables:
1. `src/storage/writer.py`:
   - Writes `data/YYYY/MM/YYYY-MM-DD.json` for frontend consumption.
   - Writes `reports/YYYY/MM/YYYY-MM-DD.md` with sleek badges, headers, and tables for GitHub repository viewers.
   - Updates `data/archive_index.json` (chronological list of all available report dates).
   - Automatically updates repository `README.md` with an active recent intelligence table.
2. `src/git_manager/streak_engine.py`:
   - Organic streak simulation: Generates random delay jitter (15 min – 2 hours).
   - Rotates humanized conventional commit messages (`feat(pulse): 2026-09-04 daily cyber & AI intelligence report`).
   - Executes non-destructive `git add`, `git commit`, and `git push`.
3. `.github/workflows/daily-intel.yml`:
   - GitHub Actions workflow scheduled on daily cron (e.g. `15 4 * * *` UTC).
   - Shell jitter step: `delay=$((RANDOM % 7200)); sleep $delay`.
   - Runs `python main.py --auto-commit` completely free in the cloud without requiring local PC to stay on.
4. `main.py` CLI:
   - Rich terminal interface with `run`, `preview`, `test`, `streak` commands.

### Criteria of Done:
- `python main.py run --dry-run` successfully creates `data/` and `reports/` files for today.
- Local `git log` reflects author `swayam jha <swayamjhaoffical@gmail.com>`.
- Workflow file syntax validated against GitHub Actions schema.

---

## Phase 4: Modern Web Dashboard
**Goal**: Build and deploy a public, responsive cyber-terminal web application displaying live and historical daily intelligence reports.

### Key Deliverables:
1. `web/` scaffold (Next.js 15 App Router, TypeScript, Tailwind CSS, Lucide Icons).
2. UI Components:
   - `<ThreatRadar />`: Dynamic glowing badge reflecting daily threat status (`LOW` to `CRITICAL`), executive briefing, and key takeaways.
   - `<CyberSecuritySection />`: Interactive CVE vulnerability cards with severity chips, affected products, and one-click remediation instructions.
   - `<AiFrontierSection />`: Paper cards with ArXiv links and trending open-weights with download metrics.
   - `<DeveloperArsenalSection />`: Trending GitHub repositories with language tags, star count, and primary use cases.
   - `<DateArchiveDrawer />`: Calendar navigation to view historical reports by date.
   - `<SearchFilterBar />`: Instant client-side search across CVEs, tools, and headlines.
3. Automated deployment setup:
   - Vercel or Cloudflare Pages integration with automatic redeployment when new JSON data is pushed to `main`.

### Criteria of Done:
- Next.js builds with 0 TypeScript/ESLint warnings (`npm run build`).
- Dashboard successfully reads from `data/` JSON assets.
- Responsive across mobile, tablet, and widescreen displays with dark terminal styling.
