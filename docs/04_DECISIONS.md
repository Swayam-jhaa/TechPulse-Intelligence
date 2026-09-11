# Architectural Decision Records (ADR): TechPulse Intelligence

## ADR-001: Separation of Raw Ingestion, Gemini Analysis, and Storage
- **Date**: 2026-09-04
- **Model Context**: Gemini 3.8 Flash (High) / Antigravity
- **Status**: Accepted
- **Context**: The application needs to pull from disparate public APIs (CISA, Hugging Face, GitHub, Hacker News) and output both a web dashboard and daily GitHub streak reports.
- **Decision**: Strictly separate the system into 4 distinct lifecycle stages:
  1. Collectors (\src/collectors/\): Normalize raw API responses into typed dicts.
  2. Synthesizer (\src/analyzer/\): Performs LLM analysis using \google-genai\ with Pydantic schema validation.
  3. Storage (\data/\ & eports/\): Saves structured JSON and Markdown independently.
  4. Presentation: Web app reads JSON; Git engine pushes Markdown and data.
- **Tradeoffs & Rationale**: Prevents tight coupling. If an external API changes, only one collector file needs updating. If the frontend is swapped or redesigned, the pipeline remains untouched.

---

## ADR-002: Dual Output Format (JSON + Markdown) & Git-as-a-Database
- **Date**: 2026-09-04
- **Model Context**: Gemini 3.8 Flash (High) / Antigravity
- **Status**: Accepted
- **Context**: We need to support a rich, searchable web UI, maintain a daily GitHub streak, and keep infrastructure costs at zero.
- **Decision**: Every daily pipeline run outputs two files:
  - \data/YYYY/MM/YYYY-MM-DD.json\: Consumed by Next.js at build/request time.
  - eports/YYYY/MM/YYYY-MM-DD.md\: Readable directly on GitHub repository for streak attribution.
- **Tradeoffs & Rationale**: Eliminates the need to pay for, manage, or maintain an external PostgreSQL or cloud database. All historical data is 100% version-controlled, auditable, and backed up in Git.

---

## ADR-003: Deterministic Fallback Synthesis Engine
- **Date**: 2026-09-04
- **Model Context**: Gemini 3.8 Flash (High) / Antigravity
- **Status**: Accepted
- **Context**: The Gemini API could occasionally suffer temporary rate limits, network timeouts, or missing API keys in CI/CD.
- **Decision**: Implement \src/analyzer/fallback_analyzer.py\ which deterministically extracts threat indicators, summarizes titles, and generates a valid \DailyReport\ object even if Gemini is unreachable.
- **Tradeoffs & Rationale**: Zero-failure resilience. The daily streak and report generation will never fail or break the streak due to an upstream LLM API hiccup.

---

## ADR-004: Next.js App Router + Tailwind CSS for Web Dashboard
- **Date**: 2026-09-04
- **Model Context**: Gemini 3.8 Flash (High) / Antigravity
- **Status**: Accepted
- **Context**: The web application needs to display daily threat radars, CVE mitigation guides, AI paper deep-dives, and tool discovery with fast load times and clean cyber-aesthetic.
- **Decision**: Use Next.js 14/15 with App Router, Static Site Generation (SSG), Tailwind CSS, and Lucide Icons.
- **Tradeoffs & Rationale**: Next.js automatically pre-renders pages from the committed JSON files at build time, yielding instant load speeds (100 Lighthouse performance), zero server cost on Vercel/Cloudflare Pages, and superior SEO.

---

## ADR-005: Organic Streak Simulation with Random Jitter
- **Date**: 2026-09-04
- **Model Context**: Gemini 3.8 Flash (High) / Antigravity
- **Status**: Accepted
- **Context**: Commits scheduled at exact robotic intervals (e.g., exactly 00:00:00 UTC) look artificial on GitHub contribution graphs.
- **Decision**: Introduce randomized execution delay (jitter between 15 and 120 minutes) and randomized natural commit messages following conventional commit standards.
- **Tradeoffs & Rationale**: Gives the GitHub contribution graph an organic human cadence while remaining 100% automated in cloud execution.
