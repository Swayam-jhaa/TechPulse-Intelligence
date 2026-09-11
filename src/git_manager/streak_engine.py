"""
Automated GitHub Streak Engine for TechPulse Intelligence.
Manages organic execution jitter, conventional commit authoring, and non-destructive pushes.
Adheres strictly to docs/02_CONSTRAINTS.md (no force-pushes, author identity enforcement).
"""

import os
import random
import subprocess
import time
from typing import Dict, Any, List

from src.config import (
    BASE_DIR,
    GIT_USER_NAME,
    GIT_USER_EMAIL,
    MIN_JITTER_MINUTES,
    MAX_JITTER_MINUTES
)

COMMIT_TEMPLATES: List[str] = [
    "feat(pulse): {date} daily cyber & AI intelligence report",
    "feat(intel): {date} security advisories & emerging tech trends",
    "feat(radar): {date} threat rating and developer intelligence snapshot",
    "feat(pulse): {date} multi-feed telemetry & model breakthroughs",
    "feat(digest): {date} daily threat matrix and open-source pulse",
    "feat(data): {date} ingest CISA KEV advisories and EPSS scores",
    "docs(briefing): {date} executive situation report and directives",
    "feat(syndication): {date} update RSS feeds and archive catalog"
]

def calculate_jitter(min_minutes: int = MIN_JITTER_MINUTES, max_minutes: int = MAX_JITTER_MINUTES) -> int:
    """Calculates a randomized delay in seconds within configured jitter boundaries."""
    min_sec = max(0, min_minutes * 60)
    max_sec = max(min_sec, max_minutes * 60)
    return random.randint(min_sec, max_sec)

def apply_jitter_delay(min_minutes: int = MIN_JITTER_MINUTES, max_minutes: int = MAX_JITTER_MINUTES) -> int:
    """Blocks execution for a random jitter duration to simulate human developer cadence."""
    delay_seconds = calculate_jitter(min_minutes, max_minutes)
    delay_minutes = delay_seconds / 60.0
    print(f"[WAIT] Jitter delay engaged: sleeping {delay_minutes:.1f} minutes ({delay_seconds}s)...")
    time.sleep(delay_seconds)

    return delay_seconds

def get_commit_message(date_str: str, prefix: str = "") -> str:
    """Selects a pseudo-random conventional commit message for the report date."""
    if prefix:
        return f"{prefix} · {date_str}"
    template = random.choice(COMMIT_TEMPLATES)
    return template.format(date=date_str)

def _run_git(args: List[str]) -> subprocess.CompletedProcess:
    """Executes a git command in the project root directory."""
    return subprocess.run(
        ["git"] + args,
        cwd=str(BASE_DIR),
        capture_output=True,
        text=True,
        check=False
    )

def configure_git_identity() -> None:
    """Ensures git author matches configured identity."""
    _run_git(["config", "user.name", GIT_USER_NAME])
    _run_git(["config", "user.email", GIT_USER_EMAIL])

def execute_streak_commit(date_str: str, auto_push: bool = False, dry_run: bool = False) -> Dict[str, Any]:
    """
    Organic Human Commit Engine:
    Randomizes commit count (1, 2, or 3 commits) to vary contribution graph intensity
    (light green vs moderate green), avoiding artificial uniform commit patterns.
    """
    result = {
        "status": "pending",
        "date": date_str,
        "committed": False,
        "commit_count": 0,
        "pushed": False,
        "commit_messages": [],
        "error": None
    }

    # Optional Sunday/Saturday rest day variance (5% chance on weekends)
    import datetime
    allow_rest_days = os.getenv("ALLOW_REST_DAYS", "false").lower() == "true"
    is_weekend = datetime.datetime.now(datetime.timezone.utc).weekday() >= 5
    if allow_rest_days and is_weekend and random.random() < 0.15:
        print(f"[i] Organic rest day selected for {date_str}. Skipping streak commit to simulate human break.")
        result["status"] = "rest_day_skipped"
        return result

    if dry_run:
        print("[i] Dry-run mode: skipping git add, commit, and push.")
        result["status"] = "dry_run_success"
        result["commit_messages"] = [f"(Dry-Run) {get_commit_message(date_str)}"]
        return result

    # 1. Enforce configured author identity
    configure_git_identity()

    # 2. Determine organic commit profile:
    # 65% chance: 1 commit (light green intensity)
    # 25% chance: 2 split commits (moderate green intensity)
    # 10% chance: 3 atomic commits (active developer intensity)
    roll = random.random()
    commit_messages = []

    if roll < 0.65:
        # Profile A: Single consolidated commit (Light Green)
        _run_git(["add", "data/", "reports/", "web/public/data/", "README.md"])
        diff_res = _run_git(["diff", "--cached", "--name-only"])
        if diff_res.stdout.strip():
            msg = get_commit_message(date_str)
            commit_res = _run_git(["commit", "-m", msg])
            if commit_res.returncode == 0:
                commit_messages.append(msg)
                print(f"[+] [Profile: Light (1 commit)] Created: '{msg}'")
    elif roll < 0.90:
        # Profile B: Dual split commit (Moderate Green)
        # Commit 1: Raw data ingestion
        _run_git(["add", "data/", "web/public/data/"])
        diff_1 = _run_git(["diff", "--cached", "--name-only"])
        if diff_1.stdout.strip():
            msg1 = f"feat(telemetry): {date_str} ingest CISA KEV and EPSS intelligence"
            _run_git(["commit", "-m", msg1])
            commit_messages.append(msg1)
            time.sleep(random.randint(1, 3))

        # Commit 2: Markdown report & index
        _run_git(["add", "reports/", "README.md"])
        diff_2 = _run_git(["diff", "--cached", "--name-only"])
        if diff_2.stdout.strip():
            msg2 = f"docs(digest): {date_str} executive briefing and catalog syndication"
            _run_git(["commit", "-m", msg2])
            commit_messages.append(msg2)
        print(f"[+] [Profile: Dual (2 commits)] Created {len(commit_messages)} commits")
    else:
        # Profile C: Triple atomic commit (Active Developer)
        # Commit 1: Data
        _run_git(["add", "data/"])
        if _run_git(["diff", "--cached", "--name-only"]).stdout.strip():
            msg1 = f"feat(data): {date_str} multi-feed telemetry snapshot"
            _run_git(["commit", "-m", msg1])
            commit_messages.append(msg1)
            time.sleep(random.randint(1, 3))

        # Commit 2: Web public assets
        _run_git(["add", "web/public/data/"])
        if _run_git(["diff", "--cached", "--name-only"]).stdout.strip():
            msg2 = f"feat(web): sync public intelligence assets for {date_str}"
            _run_git(["commit", "-m", msg2])
            commit_messages.append(msg2)
            time.sleep(random.randint(1, 3))

        # Commit 3: Markdown report & README
        _run_git(["add", "reports/", "README.md"])
        if _run_git(["diff", "--cached", "--name-only"]).stdout.strip():
            msg3 = f"docs(pulse): {date_str} daily situation report"
            _run_git(["commit", "-m", msg3])
            commit_messages.append(msg3)
        print(f"[+] [Profile: Deep (3 commits)] Created {len(commit_messages)} commits")

    # If any untracked leftovers exist, stage and commit them cleanly
    remaining_diff = _run_git(["status", "--porcelain"])
    if remaining_diff.stdout.strip() and not commit_messages:
        _run_git(["add", "data/", "reports/", "web/public/data/", "README.md"])
        if _run_git(["diff", "--cached", "--name-only"]).stdout.strip():
            fallback_msg = get_commit_message(date_str)
            _run_git(["commit", "-m", fallback_msg])
            commit_messages.append(fallback_msg)

    if not commit_messages:
        print("[i] No new changes to commit. Working tree clean.")
        result["status"] = "no_changes"
        return result

    result["committed"] = True
    result["commit_count"] = len(commit_messages)
    result["commit_messages"] = commit_messages

    # 3. Push if auto_push is requested
    if auto_push:
        print("[+] Pushing commits to remote origin...")
        branch_res = _run_git(["rev-parse", "--abbrev-ref", "HEAD"])
        current_branch = branch_res.stdout.strip() if branch_res.returncode == 0 else "main"

        push_res = _run_git(["push", "origin", current_branch])
        if push_res.returncode == 0:
            result["pushed"] = True
            print(f"[OK] Successfully pushed {len(commit_messages)} commits to origin/{current_branch}")
        else:
            print(f"[!] Git push failed: {push_res.stderr.strip()}")
            result["error"] = push_res.stderr.strip()

    result["status"] = "success"
    return result

