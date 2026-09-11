# Test Checklist & Verification Protocol: TechPulse Intelligence

Before any change or phase is marked as 'done', execute every command in this checklist and verify that actual output matches the expected output. No assumptions or unverified claims.

## 1. Environment & Dependencies Verification
- [ ] **Command**: `python --version`
  - **Expected Output**: `Python 3.11.x` or higher.
- [ ] **Command**: `node --version && npm --version`
  - **Expected Output**: Node v20+ / v22+ and npm 10+.
- [ ] **Command**: `python -c "import httpx, rich, pydantic, dotenv, google.genai; print('ALL PACKAGES OK')"`
  - **Expected Output**: `ALL PACKAGES OK`

---

## 2. Signal Collectors Verification
- [ ] **Command**: `python -m src.collectors.test_collectors`
  - **Expected Output**:
    - `[CVE Collector]: OK (X items retrieved)`
    - `[AI Collector]: OK (X papers, Y models retrieved)`
    - `[GitHub Collector]: OK (X trending repos retrieved)`
    - `[News Collector]: OK (X tech stories retrieved)`
    - Exits with returncode 0.

---

## 3. Analysis & Schema Verification
- [ ] **Command**: `python -c "from src.analyzer.models import DailyReport; print('Model import OK')"`
  - **Expected Output**: `Model import OK`
- [ ] **Command**: `python -m src.analyzer.test_analyzer`
  - **Expected Output**:
    - Validates synthesized output strictly against `DailyReport` Pydantic model.
    - No `ValidationError` raised.
    - Exits with returncode 0.

---

## 4. Pipeline & File Generation Verification
- [ ] **Command**: `python main.py run --dry-run`
  - **Expected Output**:
    - Rich progress spinner logs: Ingesting -> Analyzing -> Generating.
    - Previews formatted terminal summary table.
    - Generates `data/YYYY/MM/YYYY-MM-DD.json` and `reports/YYYY/MM/YYYY-MM-DD.md`.
    - `data/archive_index.json` contains the date entry.

---

## 5. Git & Streak Verification
- [ ] **Command**: `git status`
  - **Expected Output**: Clean working tree or correctly staged changes in `data/`, `reports/`, and `README.md`.
- [ ] **Command**: `git log -n 1 --pretty=format:"%h - %an: %s"`
  - **Expected Output**: Matches configured author `swayam jha` with conventional commit message.

---

## 6. Frontend Verification (Phase 3)
- [ ] **Command**: `cd web && npm run build`
  - **Expected Output**: Next.js production build succeeds with 0 TypeScript and lint errors.
- [ ] **Command**: `curl http://localhost:3000`
  - **Expected Output**: HTTP 200 OK with rendered threat level, CVE cards, and AI paper cards.
