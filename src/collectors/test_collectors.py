"""
Comprehensive test runner for TechPulse Intelligence collectors.
Validates live ingestion, timeouts, data structures, and speed.
"""

import sys
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any, List

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

from src.collectors.cve_collector import fetch_top_cves
from src.collectors.ai_collector import fetch_top_ai_breakthroughs
from src.collectors.github_collector import fetch_trending_repos
from src.collectors.news_collector import fetch_top_tech_news

console = Console()

def validate_cves(items: List[Dict[str, Any]]) -> bool:
    """Validates structure and required fields of CVE records, including FIRST.org EPSS scores."""
    if not isinstance(items, list) or len(items) == 0:
        return False
    required_keys = {"id", "vendor", "product", "title", "severity", "source_url", "epss_score", "epss_percentile", "is_new_today"}
    return all(required_keys.issubset(c.keys()) for c in items)

def validate_ai(data: Dict[str, Any]) -> bool:
    """Validates structure of AI research papers and trending models."""
    if not isinstance(data, dict):
        return False
    papers = data.get("papers", [])
    models = data.get("models", [])
    if not isinstance(papers, list) or not isinstance(models, list):
        return False
    if len(papers) == 0 or len(models) == 0:
        return False
    paper_keys = {"title", "url", "summary", "upvotes_or_likes"}
    model_keys = {"name", "url", "upvotes_or_likes"}
    papers_valid = all(paper_keys.issubset(p.keys()) for p in papers)
    models_valid = all(model_keys.issubset(m.keys()) for m in models)
    return papers_valid and models_valid

def validate_github(items: List[Dict[str, Any]]) -> bool:
    """Validates structure of trending GitHub repositories."""
    if not isinstance(items, list) or len(items) == 0:
        return False
    required_keys = {"repo_name", "stars", "url", "language"}
    return all(required_keys.issubset(r.keys()) for r in items)

def validate_news(items: List[Dict[str, Any]]) -> bool:
    """Validates structure of Hacker News stories."""
    if not isinstance(items, list) or len(items) == 0:
        return False
    required_keys = {"headline", "url", "score"}
    return all(required_keys.issubset(n.keys()) for n in items)

def run_tests() -> int:
    console.print(Panel.fit("[bold cyan]TechPulse Intelligence[/bold cyan] - [yellow]Signal Collector Test Suite[/yellow]", border_style="cyan"))
    
    start_time = time.perf_counter()
    results: Dict[str, Any] = {}
    
    # Run all 4 collectors concurrently to maximize throughput and minimize latency
    with ThreadPoolExecutor(max_workers=4) as executor:
        cve_future = executor.submit(fetch_top_cves, 5)
        ai_future = executor.submit(fetch_top_ai_breakthroughs, 4, 4)
        gh_future = executor.submit(fetch_trending_repos, 7, 5)
        news_future = executor.submit(fetch_top_tech_news, 5)
        
        results["cve"] = cve_future.result()
        results["ai"] = ai_future.result()
        results["gh"] = gh_future.result()
        results["news"] = news_future.result()

    elapsed = time.perf_counter() - start_time
    
    # Validate each collector
    cve_valid = validate_cves(results["cve"])
    ai_valid = validate_ai(results["ai"])
    gh_valid = validate_github(results["gh"])
    news_valid = validate_news(results["news"])
    
    # Output matches exact format in docs/06_TEST_CHECKLIST.md
    cve_status = "OK" if cve_valid else "FAILED"
    ai_status = "OK" if ai_valid else "FAILED"
    gh_status = "OK" if gh_valid else "FAILED"
    news_status = "OK" if news_valid else "FAILED"
    
    num_cves = len(results["cve"])
    num_papers = len(results["ai"].get("papers", []))
    num_models = len(results["ai"].get("models", []))
    num_repos = len(results["gh"])
    num_news = len(results["news"])
    
    print(f"[CVE Collector]: {cve_status} ({num_cves} items retrieved)")
    print(f"[AI Collector]: {ai_status} ({num_papers} papers, {num_models} models retrieved)")
    print(f"[GitHub Collector]: {gh_status} ({num_repos} trending repos retrieved)")
    print(f"[News Collector]: {news_status} ({num_news} tech stories retrieved)")
    
    # Render detailed verification summary table using ASCII-safe status indicators
    table = Table(title=f"Signal Ingestion Summary (Total Duration: {elapsed:.2f}s)", show_header=True, header_style="bold magenta")
    table.add_column("Collector", style="cyan", width=18)
    table.add_column("Status", width=10)
    table.add_column("Count", justify="right", width=12)
    table.add_column("Schema Valid", justify="center", width=14)
    table.add_column("Top Sample", style="dim", width=40)
    
    if num_cves > 0:
        c0 = results['cve'][0]
        epss_val = f"{c0['epss_score']*100:.1f}%" if c0.get('epss_score') is not None else "N/A"
        sample_cve = f"{c0['id']}: {c0['vendor']} (EPSS: {epss_val})"
    else:
        sample_cve = "N/A"
    sample_ai = f"{results['ai']['papers'][0]['title'][:35]}..." if num_papers > 0 else "N/A"
    sample_gh = f"{results['gh'][0]['repo_name']} ({results['gh'][0]['stars']} stars)" if num_repos > 0 else "N/A"
    sample_news = f"{results['news'][0]['headline'][:35]}..." if num_news > 0 else "N/A"
    
    table.add_row("CVE (CISA KEV)", f"[green]{cve_status}[/green]" if cve_valid else f"[red]{cve_status}[/red]", str(num_cves), "YES" if cve_valid else "NO", sample_cve)
    table.add_row("AI (Hugging Face)", f"[green]{ai_status}[/green]" if ai_valid else f"[red]{ai_status}[/red]", f"{num_papers}p / {num_models}m", "YES" if ai_valid else "NO", sample_ai)
    table.add_row("GitHub Trending", f"[green]{gh_status}[/green]" if gh_valid else f"[red]{gh_status}[/red]", str(num_repos), "YES" if gh_valid else "NO", sample_gh)
    table.add_row("Hacker News", f"[green]{news_status}[/green]" if news_valid else f"[red]{news_status}[/red]", str(num_news), "YES" if news_valid else "NO", sample_news)
    
    console.print(table)
    
    # Check criteria of done: under 10 seconds & all valid
    all_passed = cve_valid and ai_valid and gh_valid and news_valid
    if elapsed > 10.0:
        console.print(f"[bold red][!] Warning: Execution time ({elapsed:.2f}s) exceeded 10.0s threshold.[/bold red]")
        all_passed = False
        
    if all_passed:
        console.print(f"[bold green][PASS] Phase 1 Verification Passed: All 4 collectors healthy and completed in {elapsed:.2f}s (< 10s criteria).[/bold green]")
        return 0
    else:
        console.print("[bold red][FAIL] Phase 1 Verification Failed: One or more collectors did not satisfy validation criteria.[/bold red]")
        return 1

if __name__ == "__main__":
    sys.exit(run_tests())
