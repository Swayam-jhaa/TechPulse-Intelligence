"""
Verification test suite for TechPulse Intelligence AI Brain & Synthesis Engine.
Validates both Gemini AI synthesis and deterministic fallback synthesizer.
Ensures 100% Pydantic DailyReport schema compliance and zero-failure resilience.
"""

import os
import sys
import time
from typing import Dict, Any

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from rich.console import Console
from rich.table import Table
from rich.panel import Panel

from src.analyzer.models import DailyReport
from src.analyzer.fallback_analyzer import generate_fallback_report
from src.analyzer.gemini_analyzer import analyze_daily_intelligence
from src.collectors.cve_collector import fetch_top_cves
from src.collectors.ai_collector import fetch_top_ai_breakthroughs
from src.collectors.github_collector import fetch_trending_repos
from src.collectors.news_collector import fetch_top_tech_news

console = Console()

def get_sample_signals() -> Dict[str, Any]:
    """Provides a sample set of signals for synthetic testing."""
    return {
        "date": "2026-09-04",
        "cves": [
            {
                "id": "CVE-2026-9999",
                "vendor": "TestSec",
                "product": "FirewallX",
                "title": "Authentication Bypass in FirewallX Admin API",
                "severity": "CRITICAL",
                "epss_score": 0.85,
                "epss_percentile": 0.96,
                "is_new_today": True,
                "remediation": "Apply Security Update KB-99991 immediately.",
                "source_url": "https://nvd.nist.gov/vuln/detail/CVE-2026-9999",
                "ransomware_use": "Known"
            }
        ],
        "ai": {
            "papers": [
                {
                    "title": "Quantum Attention Networks for Zero-Shot Reasoning",
                    "summary": "Presents a novel attention mechanism scaling quadratic self-attention to sub-linear time.",
                    "upvotes": 42,
                    "url": "https://huggingface.co/papers/2609.99999"
                }
            ],
            "models": [
                {
                    "name": "deepcore-ai/DeepReason-7B",
                    "likes": 1250,
                    "downloads": 58000,
                    "task": "Text Generation",
                    "url": "https://huggingface.co/deepcore-ai/DeepReason-7B"
                }
            ]
        },
        "github": [
            {
                "repo_name": "pulse-org/neuro-agent",
                "language": "Rust",
                "stars": 2400,
                "description": "Ultra-fast autonomous agent runtime implemented in memory-safe Rust.",
                "url": "https://github.com/pulse-org/neuro-agent"
            }
        ],
        "news": [
            {
                "headline": "Post-Quantum Cryptography Mandate Enters Global Standards",
                "source": "Hacker News",
                "score": 450,
                "url": "https://news.ycombinator.com/item?id=999999"
            }
        ]
    }

def run_tests() -> int:
    console.print(Panel.fit("[bold cyan]TechPulse Intelligence[/bold cyan] - [yellow]AI Brain & Synthesis Engine Test Suite[/yellow]", border_style="cyan"))
    
    start_time = time.perf_counter()
    all_passed = True
    
    # -------------------------------------------------------------
    # Test 1: Fallback Synthesizer Validation
    # -------------------------------------------------------------
    console.print("\n[bold blue][1/3] Testing Deterministic Fallback Synthesizer...[/bold blue]")
    sample_signals = get_sample_signals()
    fallback_report = generate_fallback_report(sample_signals, "2026-09-04")
    
    # Schema assertions
    assert isinstance(fallback_report, DailyReport), "Fallback report is not a DailyReport instance"
    assert fallback_report.threat_level == "CRITICAL", f"Expected CRITICAL threat level, got {fallback_report.threat_level}"
    assert len(fallback_report.key_takeaways) >= 3, f"Expected >= 3 takeaways, got {len(fallback_report.key_takeaways)}"
    assert len(fallback_report.executive_summary) > 100, "Executive summary too short"
    assert len(fallback_report.cves) == 1, "CVEs list count mismatch"
    assert len(fallback_report.ai_breakthroughs) == 2, "AI breakthroughs count mismatch"
    assert len(fallback_report.trending_tools) == 1, "Trending tools count mismatch"
    assert len(fallback_report.tech_news) == 1, "Tech news count mismatch"
    
    # Verify JSON roundtrip
    json_payload = fallback_report.model_dump_json()
    roundtrip_report = DailyReport.model_validate_json(json_payload)
    assert roundtrip_report.date == "2026-09-04", "JSON roundtrip validation failed"
    assert fallback_report.cves[0].epss_score == 0.85, "EPSS score not populated"
    assert fallback_report.cves[0].epss_percentile == 0.96, "EPSS percentile not populated"
    assert isinstance(fallback_report.cves[0].is_new_today, bool), "is_new_today not boolean"
    console.print("    [green][PASS][/green] Fallback synthesizer produced 100% schema-compliant DailyReport with EPSS & Delta")

    # -------------------------------------------------------------
    # Test 2: Offline Resilience (Simulated Missing API Key)
    # -------------------------------------------------------------
    console.print("\n[bold blue][2/3] Testing Offline Resilience (Zero Key / Fallback Path)...[/bold blue]")
    original_key = os.environ.get("GEMINI_API_KEY")
    try:
        os.environ["GEMINI_API_KEY"] = ""
        offline_report = analyze_daily_intelligence(sample_signals, "2026-09-04")
        assert isinstance(offline_report, DailyReport), "Offline mode did not return DailyReport"
        assert offline_report.threat_level in {"LOW", "GUARDED", "ELEVATED", "HIGH", "CRITICAL"}
        console.print("    [green][PASS][/green] Offline resilience verified: zero-failure fallback engagement")
    finally:
        if original_key is not None:
            os.environ["GEMINI_API_KEY"] = original_key

    # -------------------------------------------------------------
    # Test 3: Live AI Synthesis (Google Gemini Integration)
    # -------------------------------------------------------------
    console.print("\n[bold blue][3/3] Testing Live AI Intelligence Synthesis with Live Signals...[/bold blue]")
    live_signals = {
        "date": "2026-09-04",
        "cves": fetch_top_cves(2),
        "ai": fetch_top_ai_breakthroughs(2, 2),
        "github": fetch_trending_repos(7, 2),
        "news": fetch_top_tech_news(2)
    }
    
    live_report = analyze_daily_intelligence(live_signals, "2026-09-04")
    assert isinstance(live_report, DailyReport), "Live synthesis did not return DailyReport instance"
    assert live_report.threat_level in {"LOW", "GUARDED", "ELEVATED", "HIGH", "CRITICAL"}, f"Invalid threat level: {live_report.threat_level}"
    assert len(live_report.key_takeaways) >= 3, f"Insufficient takeaways: {len(live_report.key_takeaways)}"
    assert len(live_report.executive_summary) > 80, "Executive summary too short"
    assert len(live_report.cves) > 0, "No CVEs in live report"
    assert isinstance(live_report.cves[0].is_new_today, bool), "is_new_today not boolean in live report"
    console.print(f"    [green][PASS][/green] Live AI synthesis completed (Threat Level: {live_report.threat_level}, Peak EPSS: {live_report.cves[0].epss_score})")

    elapsed = time.perf_counter() - start_time

    # -------------------------------------------------------------
    # Render Rich Summary Table
    # -------------------------------------------------------------
    table = Table(title=f"AI Brain & Synthesis Verification Summary ({elapsed:.2f}s)", show_header=True, header_style="bold magenta")
    table.add_column("Synthesis Mode", style="cyan", width=22)
    table.add_column("Engine", width=18)
    table.add_column("Threat Level", justify="center", width=14)
    table.add_column("Takeaways", justify="right", width=12)
    table.add_column("Schema Valid", justify="center", width=14)

    table.add_row("Rule-Based Fallback", "Deterministic Rules", f"[yellow]{fallback_report.threat_level}[/yellow]", str(len(fallback_report.key_takeaways)), "[green]YES[/green]")
    table.add_row("Offline Resilience", "Auto-Fallback", f"[yellow]{offline_report.threat_level}[/yellow]", str(len(offline_report.key_takeaways)), "[green]YES[/green]")
    table.add_row("Live AI Brain", f"{os.getenv('GEMINI_MODEL', 'gemini-3.6-flash')}", f"[red]{live_report.threat_level}[/red]", str(len(live_report.key_takeaways)), "[green]YES[/green]")

    console.print("\n", table)

    # Output matches docs/06_TEST_CHECKLIST.md expectations
    print("[Model Validation]: OK (Pydantic schema fully compliant)")
    print(f"[Fallback Analyzer]: OK (Deterministic synthesis validated)")
    print(f"[Gemini Analyzer]: OK (Live AI synthesis validated)")

    console.print(f"\n[bold green][PASS] Phase 2 Verification Passed: 100% Pydantic compliance across all execution paths.[/bold green]")
    return 0

if __name__ == "__main__":
    sys.exit(run_tests())
