# Constraints & Off-Limits Boundaries: TechPulse Intelligence

## 1. Absolute Off-Limits (Never Do)
- **NO Hardcoded Secrets**: Never commit, echo, or log API keys, tokens, or private credentials (GEMINI_API_KEY, GitHub PAT, SSH keys). All secrets must reside exclusively in .env or GitHub Secrets.
- **NO Blind Git Force-Pushes**: Never run git push --force or overwrite existing historical branches. All automated streak commits must be non-destructive fast-forwards.
- **NO Untyped Payloads**: Never bypass Pydantic validation when writing to data/. If data doesn't conform to DailyReport, the pipeline must fail to fallback, never write corrupted JSON.
- **NO Unvetted Dependencies**: Do not install heavy or obscure third-party packages without explicit rationale logged in DECISIONS.md. Keep dependencies lean and secure.
- **NO Hallucinated CVEs or Papers**: The analyzer must only analyze signals provided by the collectors. It must NEVER invent CVE identifiers, fake patch versions, or fake repository URLs.

## 2. Architectural Boundaries
- **Single-Responsibility Collectors**: Collectors may ONLY fetch and normalize external HTTP responses. They must NOT perform LLM synthesis, format Markdown, or interact with Git.
- **Offline Resilience**: The pipeline must NEVER crash if the Gemini API is down, rate-limited, or unavailable. It must seamlessly fall back to allback_analyzer.py and log the fallback.
- **Strict Data Segregation**:
  - data/ contains purely structured JSON.
  - eports/ contains purely human-readable Markdown.
  - src/ contains Python application logic.
  - web/ contains the frontend web application.

## 3. Scope & Modification Rules
- **One Logical Change per Request**: Never combine collector refactoring with frontend changes in a single task.
- **Atomic Commits**: Keep Git commit messages clear, scoped, and following conventional commit style (eat:, ix:, docs:, chore:).
- **Inline Intent**: Code must feature explicit inline comments explaining the *why* and assumptions of non-obvious logic, not restating the syntax.
