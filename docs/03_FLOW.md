# Execution Flow: TechPulse Intelligence

## 1. Daily Intelligence Pipeline Flow

\[Trigger: CLI or Actions] 
          │
          ▼
     main.py (run_pipeline)
          │
          ├──> 1. Ingestion Phase
          │      ├──> src.collectors.cve_collector.fetch_top_cves()
          │      │       └── [HTTP GET] CISA KEV JSON -> parsed CveItem dicts
          │      ├──> src.collectors.ai_collector.fetch_top_ai_breakthroughs()
          │      │       ├── [HTTP GET] HF Daily Papers -> parsed paper dicts
          │      │       └── [HTTP GET] HF Trending Models -> parsed model dicts
          │      ├──> src.collectors.github_collector.fetch_trending_repos()
          │      │       └── [HTTP GET] GitHub Search API -> parsed repo dicts
          │      └──> src.collectors.news_collector.fetch_top_tech_news()
          │              └── [HTTP GET] Hacker News API -> parsed story dicts
          │
          ├──> 2. Analysis & Synthesis Phase
          │      ├──> src.analyzer.gemini_analyzer.analyze_daily_intelligence(raw_signals)
          │      │       ├── Formats structured prompt with raw signals
          │      │       ├── Calls Google GenAI SDK (gemini-2.5-flash) with DailyReport schema
          │      │       └── Validates response against Pydantic DailyReport model
          │      └──> [If Gemini Error / No Key]
          │              └── src.analyzer.fallback_analyzer.generate_fallback_report(raw_signals)
          │
          ├──> 3. Storage & Serialization Phase
          │      ├──> src.storage.writer.save_report(daily_report)
          │      │       ├── Serializes to data/YYYY/MM/YYYY-MM-DD.json
          │      │       ├── Generates and writes reports/YYYY/MM/YYYY-MM-DD.md
          │      │       └── Updates data/archive_index.json
          │
          └──> 4. Git & Streak Distribution Phase
                 ├──> src.git_manager.streak_engine.execute_streak_commit(date)
                 │       ├── Calculates randomized jitter delay (if in cloud/daemon mode)
                 │       ├── Stages data/, reports/, and README.md
                 │       ├── Creates conventional Git commit under user identity
                 │       └── Pushes to remote origin (main branch)
                 └──> Web Deployment Trigger (Vercel / Pages webhook or Git push hook)
\
## 2. Web Application Render Flow

\[User visits / or /archive/[date]]
          │
          ▼
     Next.js App Router (web/src/app/page.tsx or [date]/page.tsx)
          │
          ├──> 1. Reads data/archive_index.json (get list of available dates)
          ├──> 2. Reads data/YYYY/MM/YYYY-MM-DD.json for target date
          │
          ├──> 3. Component Hierarchy Render:
          │      ├── <Header /> (Title, Date Selector, Live GitHub Status)
          │      ├── <ThreatRadar /> (Threat level badge, Key Takeaways, Executive Briefing)
          │      ├── <CyberSecuritySection /> (CVE cards with severity chips & remediations)
          │      ├── <AiFrontierSection /> (Breakthrough papers & trending open-weights)
          │      ├── <DeveloperArsenalSection /> (Rising GitHub repos with star badges)
          │      ├── <IndustryPulseSection /> (Hacker news top tech stories)
          │      └── <ArchiveDrawer /> (Historical date navigation)
          │
          └──> Returns statically generated, cached HTML (SSG/ISR)
\
## 3. Active Path Under Modification
- **Current Active Step**: Scaffolding baseline documentation and testing collector contracts.
- **Upstream callers**: \main.py- **Downstream consumers**: \src/storage/writer.py\, \src/analyzer/gemini_analyzer.py