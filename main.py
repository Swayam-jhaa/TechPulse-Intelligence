"""
TechPulse Intelligence - Autonomous Daily Tech & Cybersecurity Intelligence Platform.
Main CLI Entrypoint: Orchestrates Ingestion -> Synthesis -> Persistence -> Streak Automation.
"""

import sys
import os
import argparse
import datetime
from typing import Dict, Any

# Ensure UTF-8 console output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.status import Status

from src.collectors.cve_collector import fetch_top_cves
from src.collectors.ai_collector import fetch_top_ai_breakthroughs
from src.collectors.github_collector import fetch_trending_repos
from src.collectors.news_collector import fetch_top_tech_news
from src.analyzer.gemini_analyzer import analyze_daily_intelligence
from src.analyzer.models import DailyReport
from src.storage.writer import save_report
from src.git_manager.streak_engine import (
    execute_streak_commit,
    apply_jitter_delay,
    get_commit_message
)

console = Console()

def run_pipeline(
    target_date: str = "",
    dry_run: bool = False,
    auto_commit: bool = False,
    auto_push: bool = False,
    with_jitter: bool = False
) -> DailyReport:
    """Executes the complete 4-stage TechPulse Intelligence pipeline."""
    if not target_date:
        target_date = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")

    console.print(Panel.fit(
        f"[bold cyan]TechPulse Intelligence[/bold cyan] | [yellow]Date: {target_date}[/yellow] | [dim]Mode: {'DRY RUN' if dry_run else 'LIVE'}[/dim]",
        border_style="cyan"
    ))

    # Stage 0: Optional Jitter Delay (for automated cron schedules)
    if with_jitter:
        apply_jitter_delay()

    # Stage 1: Ingestion
    with console.status("[bold blue][1/4] Ingesting multi-feed telemetry...[/bold blue]", spinner="dots"):
        cves = fetch_top_cves(limit=5)
        ai_data = fetch_top_ai_breakthroughs(papers_limit=4, models_limit=4)
        repos = fetch_trending_repos(days_back=7, limit=5)
        news = fetch_top_tech_news(limit=5)

        raw_signals = {
            "date": target_date,
            "cves": cves,
            "ai": ai_data,
            "github": repos,
            "news": news
        }

    console.print(f"    [green][OK][/green] Ingestion complete: {len(cves)} CVEs, {len(ai_data.get('papers', []))} papers, {len(ai_data.get('models', []))} models, {len(repos)} repos, {len(news)} stories.")

    # Stage 2: AI Brain Synthesis
    with console.status("[bold blue][2/4] Synthesizing intelligence briefing with AI Brain...[/bold blue]", spinner="dots"):
        daily_report = analyze_daily_intelligence(raw_signals, date_str=target_date)

    console.print(f"    [green][OK][/green] Synthesis complete: Threat Level [bold red]{daily_report.threat_level}[/bold red] ({len(daily_report.key_takeaways)} takeaways).")

    # Stage 3: Storage & Serialization
    with console.status("[bold blue][3/4] Serializing JSON & Markdown reports...[/bold blue]", spinner="dots"):
        paths = save_report(daily_report)

    console.print(f"    [green][OK][/green] Reports saved: {paths['json_rel']} & {paths['md_rel']}")

    # Stage 4: Git Streak Distribution
    if auto_commit or not dry_run:
        with console.status("[bold blue][4/4] Evaluating GitHub streak distribution...[/bold blue]", spinner="dots"):
            streak_res = execute_streak_commit(
                date_str=target_date,
                auto_push=auto_push,
                dry_run=dry_run
            )
        console.print(f"    [green][OK][/green] Git Manager: {streak_res.get('status')} - '{streak_res.get('commit_message')}'")
    else:
        console.print("    [dim][i] Dry-run: skipped git commit and push.[/dim]")

    # Render Summary Table
    table = Table(title=f"TechPulse Daily Report Summary ({target_date})", show_header=True, header_style="bold magenta")
    table.add_column("Category", style="cyan", width=22)
    table.add_column("Metric / Status", width=20)
    table.add_column("Top Highlight", style="dim", width=42)

    top_cve = daily_report.cves[0].id if daily_report.cves else "None"
    top_paper = daily_report.ai_breakthroughs[0].title[:38] + "..." if daily_report.ai_breakthroughs else "None"
    top_repo = daily_report.trending_tools[0].repo_name if daily_report.trending_tools else "None"

    table.add_row("Cyber Threat Radar", f"[bold]{daily_report.threat_level}[/bold]", f"Active CVE: {top_cve}")
    table.add_row("AI Frontier", f"{len(daily_report.ai_breakthroughs)} items", f"Lead: {top_paper}")
    table.add_row("Developer Arsenal", f"{len(daily_report.trending_tools)} repos", f"Rising: {top_repo}")
    table.add_row("Industry Pulse", f"{len(daily_report.tech_news)} stories", f"{len(daily_report.key_takeaways)} key takeaways synthesized")
    table.add_row("Web Data Asset", "Serialized", paths["json_rel"])
    table.add_row("Markdown Report", "Serialized", paths["md_rel"])

    console.print("\n", table)
    return daily_report

def preview_pipeline(target_date: str = "") -> None:
    """Previsualizes today's intelligence synthesis in the terminal without persisting to disk."""
    if not target_date:
        target_date = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")

    console.print(Panel.fit(f"[bold cyan]Previewing TechPulse Intelligence[/bold cyan] - {target_date}", border_style="yellow"))
    
    with console.status("Gathering live signals and analyzing...", spinner="dots"):
        cves = fetch_top_cves(3)
        ai_data = fetch_top_ai_breakthroughs(2, 2)
        repos = fetch_trending_repos(7, 3)
        news = fetch_top_tech_news(3)
        raw_signals = {"date": target_date, "cves": cves, "ai": ai_data, "github": repos, "news": news}
        report = analyze_daily_intelligence(raw_signals, date_str=target_date)

    console.print(f"\n[bold yellow]Threat Level:[/bold yellow] {report.threat_level}")
    console.print(f"\n[bold cyan]Executive Summary:[/bold cyan]\n{report.executive_summary}\n")
    console.print("[bold green]Key Takeaways:[/bold green]")
    for t in report.key_takeaways:
        console.print(f"  • {t}")

def main() -> None:
    parser = argparse.ArgumentParser(description="TechPulse Intelligence CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: run
    run_parser = subparsers.add_parser("run", help="Run full pipeline: Ingest -> Analyze -> Store -> Streak")
    run_parser.add_argument("--dry-run", action="store_true", help="Generate files and reports without creating git commits")
    run_parser.add_argument("--auto-commit", action="store_true", help="Automatically create git commit for generated reports")
    run_parser.add_argument("--auto-push", action="store_true", help="Automatically push git commit to remote origin")
    run_parser.add_argument("--with-jitter", action="store_true", help="Engage randomized delay jitter before execution")
    run_parser.add_argument("--date", type=str, default="", help="Override target date (YYYY-MM-DD)")

    # Command: preview
    preview_parser = subparsers.add_parser("preview", help="Preview intelligence briefing in terminal without disk changes")
    preview_parser.add_argument("--date", type=str, default="", help="Override target date (YYYY-MM-DD)")

    # Command: streak
    streak_parser = subparsers.add_parser("streak", help="Test or execute git streak commit")
    streak_parser.add_argument("--push", action="store_true", help="Push commit to remote")
    streak_parser.add_argument("--dry-run", action="store_true", help="Simulate streak commit without modifying git history")
    streak_parser.add_argument("--date", type=str, default="", help="Target date for commit message")

    # Command: test
    test_parser = subparsers.add_parser("test", help="Run collector and analyzer test suites")

    args = parser.parse_args()

    # Default to 'run --dry-run' if no subcommand provided
    if not args.command:
        run_pipeline(dry_run=True)
        return

    if args.command == "run":
        run_pipeline(
            target_date=args.date,
            dry_run=args.dry_run,
            auto_commit=args.auto_commit,
            auto_push=args.auto_push,
            with_jitter=args.with_jitter
        )
    elif args.command == "preview":
        preview_pipeline(target_date=args.date)
    elif args.command == "streak":
        d = args.date or datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        execute_streak_commit(date_str=d, auto_push=args.push, dry_run=args.dry_run)
    elif args.command == "test":
        console.print("[bold cyan]Running Verification Test Checklist...[/bold cyan]\n")
        import subprocess
        subprocess.run([sys.executable, "-m", "src.collectors.test_collectors"], check=True)
        subprocess.run([sys.executable, "-m", "src.analyzer.test_analyzer"], check=True)

if __name__ == "__main__":
    main()
