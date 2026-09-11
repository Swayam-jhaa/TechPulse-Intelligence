"""
Historical Delta and Trend Tracking for TechPulse Intelligence.
Detects newly emerging vulnerabilities, tools, and research compared to yesterday's baseline.
"""

import json
from pathlib import Path
from typing import Dict, Any, Tuple, Optional, Set
from src.config import BASE_DIR, DATA_DIR

INDEX_FILE = DATA_DIR / "archive_index.json"

def get_previous_report_context(current_date: str) -> Dict[str, Any]:
    """
    Reads the most recent historical report prior to current_date from archive_index.json.
    Returns baseline identifiers and threat level for day-over-day delta comparisons.
    """
    context: Dict[str, Any] = {
        "previous_date": None,
        "previous_threat_level": None,
        "cve_ids": set(),
        "ai_titles": set(),
        "tool_repos": set(),
        "news_urls": set()
    }

    if not INDEX_FILE.exists():
        return context

    try:
        with open(INDEX_FILE, "r", encoding="utf-8") as f:
            index_entries = json.load(f)

        # Find the latest report prior to current_date
        prior_entry = None
        for entry in index_entries:
            if entry.get("date") != current_date:
                prior_entry = entry
                break

        if not prior_entry:
            return context

        context["previous_date"] = prior_entry.get("date")
        context["previous_threat_level"] = prior_entry.get("threat_level")

        # Load full previous report JSON to extract identifiers
        json_rel = prior_entry.get("json_path", "")
        if json_rel:
            full_path = BASE_DIR / json_rel
            if full_path.exists():
                with open(full_path, "r", encoding="utf-8") as f:
                    prev_data = json.load(f)

                context["cve_ids"] = {c.get("id") for c in prev_data.get("cves", []) if c.get("id")}
                context["ai_titles"] = {
                    (a.get("title") or a.get("name", "")).lower() 
                    for a in prev_data.get("ai_breakthroughs", [])
                }
                context["tool_repos"] = {
                    (t.get("repo_name") or t.get("name", "")).lower() 
                    for t in prev_data.get("trending_tools", [])
                }
                context["news_urls"] = {n.get("url") for n in prev_data.get("tech_news", []) if n.get("url")}

    except Exception as e:
        print(f"[!] Warning reading previous report context: {e}")

    return context

def apply_delta_to_signals(raw_signals: Dict[str, Any], current_date: str) -> Tuple[Dict[str, Any], Optional[str]]:
    """
    Annotates raw signals with `is_new_today` boolean based on previous cycle telemetry.
    Returns the annotated signals and the previous cycle's threat level.
    """
    context = get_previous_report_context(current_date)
    prev_threat = context.get("previous_threat_level")
    
    prev_cves: Set[str] = context.get("cve_ids", set())
    prev_ai: Set[str] = context.get("ai_titles", set())
    prev_tools: Set[str] = context.get("tool_repos", set())
    prev_news: Set[str] = context.get("news_urls", set())

    # Annotate CVEs
    for c in raw_signals.get("cves", []):
        cve_id = c.get("id", "")
        c["is_new_today"] = (cve_id not in prev_cves) if prev_cves else True

    # Annotate AI Papers & Models
    ai_dict = raw_signals.get("ai", {})
    for p in ai_dict.get("papers", []):
        title = (p.get("title") or "").lower()
        p["is_new_today"] = (title not in prev_ai) if prev_ai else True

    for m in ai_dict.get("models", []):
        name = (m.get("name") or m.get("title") or "").lower()
        m["is_new_today"] = (name not in prev_ai) if prev_ai else True

    # Annotate Tools
    for t in raw_signals.get("github", []):
        repo = (t.get("repo_name") or t.get("name") or "").lower()
        t["is_new_today"] = (repo not in prev_tools) if prev_tools else True

    # Annotate News
    for n in raw_signals.get("news", []):
        url = n.get("url", "")
        n["is_new_today"] = (url not in prev_news) if prev_news else True

    return raw_signals, prev_threat
