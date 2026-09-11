"""
Deterministic Offline Fallback Synthesizer for TechPulse Intelligence.
Generates fully validated DailyReport models without requiring external LLM APIs.
Guarantees zero pipeline failure if internet degrades or Gemini quota is exhausted.
"""

import datetime
from typing import Dict, Any, List
from src.analyzer.models import (
    DailyReport,
    CveItem,
    AiBreakthrough,
    TrendingTool,
    TechNewsItem
)
from src.analyzer.delta_tracker import apply_delta_to_signals

def _assess_threat_level(cves: List[Dict[str, Any]]) -> str:
    """Calculates overall threat climate based on actively exploited CVE telemetry."""
    if not cves:
        return "LOW"
    
    # Check for active ransomware campaigns in CISA KEV
    has_ransomware = any(
        c.get("ransomware_use", "").lower() not in ("unknown", "none", "", "no")
        for c in cves
    )
    if has_ransomware:
        return "CRITICAL"
    
    count = len(cves)
    if count >= 5:
        return "HIGH"
    elif count >= 3:
        return "ELEVATED"
    elif count >= 1:
        return "GUARDED"
    return "LOW"

def generate_fallback_report(raw_signals: Dict[str, Any], date_str: str = "") -> DailyReport:
    """
    Transforms raw collector signals into a validated DailyReport using deterministic heuristics.
    Strictly conforms to Pydantic schemas and ADR-002 resilience requirements.
    """
    if not date_str:
        date_str = raw_signals.get("date") or datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    
    # Apply historical delta tracking against previous cycle
    raw_signals, prev_threat = apply_delta_to_signals(raw_signals, date_str)

    raw_cves = raw_signals.get("cves", [])
    raw_ai = raw_signals.get("ai", {})
    raw_papers = raw_ai.get("papers", [])
    raw_models = raw_ai.get("models", [])
    raw_github = raw_signals.get("github", [])
    raw_news = raw_signals.get("news", [])

    threat_level = _assess_threat_level(raw_cves)

    # 1. Transform CVEs to CveItem
    cve_items: List[CveItem] = []
    for c in raw_cves:
        cve_id = c.get("id") or c.get("cve_id", "CVE-UNKNOWN")
        vendor = c.get("vendor", "Unknown Vendor")
        product = c.get("product", "Unknown Product")
        title = c.get("title") or c.get("name") or f"{cve_id} Security Advisory"
        severity = c.get("severity", "HIGH")
        desc = c.get("description") or c.get("summary", "No description provided.")
        remediation = c.get("remediation") or c.get("required_action", "Apply vendor security patches.")
        url = c.get("source_url") or c.get("reference") or f"https://nvd.nist.gov/vuln/detail/{cve_id}"

        cve_items.append(CveItem(
            id=cve_id,
            vendor=vendor,
            product=product,
            title=title,
            severity=severity,
            is_actively_exploited=True,
            epss_score=c.get("epss_score"),
            epss_percentile=c.get("epss_percentile"),
            is_new_today=c.get("is_new_today", True),
            description=desc,
            remediation=remediation,
            source_url=url
        ))

    # 2. Transform AI Signals to AiBreakthrough
    ai_items: List[AiBreakthrough] = []
    for p in raw_papers:
        title = p.get("title", "Untitled Research Paper")
        summary = p.get("summary", "No summary available.")
        upvotes = p.get("upvotes_or_likes") or p.get("upvotes", 0)
        url = p.get("url", "https://huggingface.co/papers")
        why = p.get("why_it_matters") or f"Key community paper with {upvotes} upvotes presenting novel research."

        ai_items.append(AiBreakthrough(
            title=title,
            category="RESEARCH_PAPER",
            summary=summary,
            why_it_matters=why,
            upvotes_or_likes=int(upvotes),
            url=url,
            is_new_today=p.get("is_new_today", True)
        ))

    for m in raw_models:
        name = m.get("name") or m.get("title", "Unknown Model")
        likes = m.get("upvotes_or_likes") or m.get("likes", 0)
        downloads = m.get("downloads", 0)
        task = m.get("task", "General AI")
        url = m.get("url", f"https://huggingface.co/{name}")
        summary = m.get("summary") or f"Trending open-weights model specialized in {task}."
        why = m.get("why_it_matters") or f"Strong community interest with {likes:,} likes and {downloads:,} downloads."

        ai_items.append(AiBreakthrough(
            title=name,
            category="MODEL_RELEASE",
            summary=summary,
            why_it_matters=why,
            upvotes_or_likes=int(likes),
            url=url,
            is_new_today=m.get("is_new_today", True)
        ))

    # 3. Transform GitHub Repos to TrendingTool
    tool_items: List[TrendingTool] = []
    for g in raw_github:
        repo_name = g.get("repo_name") or g.get("name", "Unknown/Repo")
        language = g.get("language", "Multi/Other")
        stars = g.get("stars", 0)
        desc = g.get("description", "No description provided.")
        url = g.get("url", f"https://github.com/{repo_name}")
        use_case = g.get("use_case") or f"Rapidly growing {language} tool with {stars:,} stars."

        tool_items.append(TrendingTool(
            repo_name=repo_name,
            language=language,
            stars=int(stars),
            description=desc,
            use_case=use_case,
            url=url,
            is_new_today=g.get("is_new_today", True)
        ))

    # 4. Transform Hacker News stories to TechNewsItem
    news_items: List[TechNewsItem] = []
    for n in raw_news:
        headline = n.get("headline", "Tech Development")
        source = n.get("source", "Hacker News")
        score = n.get("score", 0)
        url = n.get("url", "https://news.ycombinator.com")
        analysis = n.get("analysis") or f"Major discussion topic with {score} points on Hacker News."

        news_items.append(TechNewsItem(
            headline=headline,
            source=source,
            analysis=analysis,
            score=int(score),
            url=url,
            is_new_today=n.get("is_new_today", True)
        ))

    # 5. Synthesize Analytical 3-Paragraph Executive Overview
    cve_summary_text = (
        f"The cybersecurity landscape for {date_str} is evaluated at threat level {threat_level}. "
        f"Security authorities recorded {len(cve_items)} actively exploited vulnerabilities cataloged in CISA KEV. "
    )
    if prev_threat:
        if prev_threat != threat_level:
            cve_summary_text += f"This represents a shift from yesterday's baseline posture of {prev_threat}. "
        else:
            cve_summary_text += f"Threat conditions hold steady at {threat_level} day-over-day. "

    if cve_items:
        affected_vendors = list(dict.fromkeys([c.vendor for c in cve_items[:3]]))
        cve_summary_text += f"Primary exposure impacts infrastructure from {', '.join(affected_vendors)}. Immediate patching is advised."
    else:
        cve_summary_text += "No critical zero-day exploit disclosures were reported in the current telemetry window."

    ai_summary_text = (
        f"In artificial intelligence, researchers and engineers cataloged {len(raw_papers)} breakthrough research papers "
        f"and {len(raw_models)} trending open-weights models. Innovation centers on post-hoc calibration, specification-driven training, "
        "and specialized open inference weights demonstrating rapid optimization across autonomous workflows."
    )

    dev_summary_text = (
        f"Across the open-source engineering ecosystem, {len(tool_items)} high-velocity developer tools gained significant star traction, "
        f"while top architectural discussions on Hacker News highlighted infrastructure evolutions and ecosystem shifts. "
        "Engineering teams are prioritizing high-throughput inference runtimes, agentic developer tooling, and resilient operational pipelines."
    )

    executive_summary = f"{cve_summary_text}\n\n{ai_summary_text}\n\n{dev_summary_text}"

    # 6. Generate 3 to 5 Key Takeaways
    key_takeaways: List[str] = []
    if cve_items:
        top_cve = cve_items[0]
        epss_str = f" [EPSS Exploit Prob: {top_cve.epss_score*100:.1f}%]" if top_cve.epss_score is not None else ""
        new_tag = "🔥 NEW: " if top_cve.is_new_today else ""
        key_takeaways.append(f"Security Alert: {new_tag}{top_cve.id} ({top_cve.vendor} {top_cve.product}) is under active wild exploitation{epss_str}—remediation required.")
    else:
        key_takeaways.append("Security Alert: Zero-day threat posture remains guarded with no immediate emergency advisories.")

    if ai_items:
        top_ai = ai_items[0]
        new_tag = "🔥 " if top_ai.is_new_today else ""
        key_takeaways.append(f"AI Breakthrough: {new_tag}'{top_ai.title}' highlights today's community interest with {top_ai.upvotes_or_likes} engagements.")

    if tool_items:
        top_tool = tool_items[0]
        new_tag = "🔥 " if top_tool.is_new_today else ""
        key_takeaways.append(f"Developer Arsenal: {new_tag}Repository {top_tool.repo_name} surged to {top_tool.stars:,} stars in the {top_tool.language} ecosystem.")

    if news_items:
        top_news = news_items[0]
        key_takeaways.append(f"Industry Discussion: '{top_news.headline}' sparked major developer dialogue with {top_news.score} engagement points.")

    # Guarantee between 3 and 5 takeaways
    while len(key_takeaways) < 3:
        key_takeaways.append("Operational Posture: Verify automated CI/CD dependency trees and maintain active monitoring of upstream registries.")
    key_takeaways = key_takeaways[:5]

    return DailyReport(
        date=date_str,
        threat_level=threat_level,
        yesterday_threat_level=prev_threat,
        executive_summary=executive_summary,
        key_takeaways=key_takeaways,
        cves=cve_items,
        ai_breakthroughs=ai_items,
        trending_tools=tool_items,
        tech_news=news_items
    )
