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
    "feat(digest): {date} daily threat matrix and open-source pulse"
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

def get_commit_message(date_str: str) -> str:
    """Selects a pseudo-random conventional commit message for the report date."""
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
    Safely stages data/, reports/, and README.md, creates an atomic conventional commit,
    and optionally fast-forwards to remote origin.
    """
    result = {
        "status": "pending",
        "date": date_str,
        "committed": False,
        "pushed": False,
        "commit_message": "",
        "error": None
    }

    if dry_run:
        print("[i] Dry-run mode: skipping git add, commit, and push.")
        result["status"] = "dry_run_success"
        result["commit_message"] = f"(Dry-Run) {get_commit_message(date_str)}"
        return result

    # 1. Enforce configured author identity
    configure_git_identity()

    # 2. Stage data, reports, mirrored web data, and updated README
    add_res = _run_git(["add", "data/", "reports/", "web/public/data/", "README.md"])
    if add_res.returncode != 0:
        err = f"Failed to stage changes: {add_res.stderr}"
        print(f"[!] {err}")
        result["status"] = "error"
        result["error"] = err
        return result

    # 3. Check if there are changes to commit
    status_res = _run_git(["diff", "--cached", "--name-only"])
    staged_files = status_res.stdout.strip().splitlines() if status_res.stdout else []
    if not staged_files:
        print("[i] No new changes staged in data/, reports/, or README.md. Working tree clean.")
        result["status"] = "no_changes"
        return result

    # 4. Create conventional commit
    commit_msg = get_commit_message(date_str)
    commit_res = _run_git(["commit", "-m", commit_msg])
    if commit_res.returncode != 0:
        err = f"Git commit failed: {commit_res.stderr}"
        print(f"[!] {err}")
        result["status"] = "error"
        result["error"] = err
        return result

    result["committed"] = True
    result["commit_message"] = commit_msg
    print(f"[+] Git commit created: '{commit_msg}'")

    # 5. Push if auto_push is requested
    if auto_push:
        print("[+] Pushing commit to remote origin...")
        # Get current branch
        branch_res = _run_git(["rev-parse", "--abbrev-ref", "HEAD"])
        current_branch = branch_res.stdout.strip() if branch_res.returncode == 0 else "main"

        push_res = _run_git(["push", "origin", current_branch])
        if push_res.returncode == 0:
            result["pushed"] = True
            print(f"[OK] Successfully pushed to origin/{current_branch}")
        else:
            print(f"[!] Git push failed (may need remote credentials or origin configured): {push_res.stderr.strip()}")
            result["error"] = push_res.stderr.strip()

    result["status"] = "success"
    return result

