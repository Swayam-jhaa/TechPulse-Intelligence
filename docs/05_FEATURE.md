# Feature Trace: FEAT-001 (Core Intelligence Pipeline & Ingestion Engine)

## 1. Scope & Objective
- **Goal**: Build an autonomous multi-source intelligence collector and synthesis engine that produces daily structured JSON and Markdown intelligence briefs.
- **Components**:
  - Ingestion: CISA KEV (CVEs), Hugging Face (Papers & Models), GitHub (Trending), Hacker News (Industry News).
  - Processing: Gemini 2.5 Flash analyzer with strict Pydantic schema validation + Fallback engine.
  - Storage: Datewise JSON writer (\data/YYYY/MM/YYYY-MM-DD.json\) and Markdown writer (eports/YYYY/MM/YYYY-MM-DD.md\).

## 2. Technical Requirements
- Output must strictly conform to \src.analyzer.models.DailyReport\.
- Network calls must be bounded by a 15-second timeout and handle status codes defensively.
- Rate-limits or missing Gemini API keys must gracefully trigger the fallback generator without raising unhandled exceptions.

## 3. What Was Scoped & Tried
- [x] Initial research on public feeds:
  - CISA KEV verified: provides 1,690+ actively exploited CVEs in real-time JSON format.
  - Hugging Face Daily Papers verified: returns 50 daily papers with upvote counts and summaries.
  - Hugging Face Trending Models verified: returns top models sorted by 7-day likes.
  - Hacker News API verified: returns top story IDs and detailed metadata.
  - GitHub Search API verified: retrieves repos created in the last 7 days sorted by stars.
- [ ] Pipeline orchestration in \src/storage/writer.py\ and \main.py\.
- [ ] Gemini client integration with structured schema output in \src/analyzer/gemini_analyzer.py\.
- [ ] Fallback synthesizer in \src/analyzer/fallback_analyzer.py\.

## 4. Verification & Criteria of Done
1. \python -m src.collectors.test_collectors\ runs all 4 collectors and returns non-empty structured data.
2. \python main.py --dry-run\ generates a valid \DailyReport\ object without errors.
3. Written JSON file in \data/\ passes JSON schema validation.
4. Generated Markdown file in eports/\ renders valid headings, badges, and hyperlinks.
