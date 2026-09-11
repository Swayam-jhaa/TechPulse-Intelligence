# Rollback & Recovery Plan: TechPulse Intelligence

## 1. Safety Checkpoints & Reversion Strategy

If an edit, dependency upgrade, or pipeline run introduces unexpected breakage or corrupted data, follow this strict rollback runbook.

### Scenario A: Uncommitted Broken Code
To immediately discard uncommitted changes in your workspace:
```bash
# Discard all unstaged changes
git restore .

# Remove newly created untracked scratch files
git clean -fd
```

### Scenario B: Corrupted Daily Report or Malformed JSON
If a scheduled run committed corrupted JSON in `data/` or broken Markdown in `reports/`:
```bash
# 1. Identify the bad commit
git log -n 5 --oneline

# 2. Revert the specific commit without rewriting history
git revert HEAD --no-edit

# 3. Re-verify the data directory
python -c "import json, glob; [json.load(open(f)) for f in glob.glob('data/**/*.json', recursive=True)]; print('All JSON valid')"

# 4. Push the clean revert commit
git push origin main
```

### Scenario C: Collector API Breakage / Schema Mismatch
If an external API (e.g. CISA, Hugging Face, or Hacker News) changes its payload structure:
```bash
# 1. Activate fallback mode in .env or config.py:
# Set FORCE_FALLBACK_ANALYZER=true

# 2. Run the unit test to isolate which collector failed:
python -m src.collectors.test_collectors

# 3. Restore the last known good collector state:
git checkout HEAD~1 -- src/collectors/
```

### Scenario D: Broken Frontend Build (Phase 3)
If a Next.js package or component breaks production deployment:
```bash
# 1. Clean the build cache
cd web && rm -rf .next node_modules package-lock.json

# 2. Reinstall known locked dependencies
npm install

# 3. If still broken, restore web directory from previous commit
cd ..
git checkout HEAD~1 -- web/
```

## 2. Recovery Verification
After executing any rollback:
1. Run `python -m src.collectors.test_collectors`
2. Run `git status` to ensure a clean tree.
3. Check `HANDOVER.md` and log the incident and mitigation.
