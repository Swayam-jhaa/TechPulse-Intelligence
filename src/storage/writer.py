"""
Storage and Report Serialization Engine for TechPulse Intelligence.
Persists structured intelligence into dual data/report formats:
- data/YYYY/MM/YYYY-MM-DD.json (Web client consumption)
- reports/YYYY/MM/YYYY-MM-DD.md (GitHub repository viewer markdown)
- data/archive_index.json (Fast historical date index)
- Updates root README.md with latest intelligence snapshot
"""

import os
import json
import re
import datetime
import email.utils
from xml.sax.saxutils import escape
from pathlib import Path
from typing import Dict, Any, List

from src.config import BASE_DIR, DATA_DIR, REPORTS_DIR
from src.analyzer.models import DailyReport

INDEX_FILE = DATA_DIR / "archive_index.json"
README_FILE = BASE_DIR / "README.md"
RSS_FILE = DATA_DIR / "rss.xml"
FEED_FILE = DATA_DIR / "feed.xml"

THREAT_COLORS = {
    "CRITICAL": "crimson",
    "HIGH": "orange",
    "ELEVATED": "yellow",
    "GUARDED": "blue",
    "LOW": "brightgreen"
}

def _generate_markdown(report: DailyReport) -> str:
    """Generates a polished, high-visual-appeal Markdown intelligence briefing."""
    date_str = report.date
    threat_level = report.threat_level.upper()
    color = THREAT_COLORS.get(threat_level, "lightgrey")
    threat_badge = f"![Threat Level](https://img.shields.io/badge/THREAT%20LEVEL-{threat_level}-{color}?style=for-the-badge)"
    date_badge = f"![Date](https://img.shields.io/badge/DATE-{date_str}-0ea5e9?style=for-the-badge)"
    
    delta_badge = ""
    if report.yesterday_threat_level:
        y_level = report.yesterday_threat_level.upper()
        y_color = THREAT_COLORS.get(y_level, "grey")
        delta_badge = f" ![Yesterday](https://img.shields.io/badge/YESTERDAY-{y_level}-{y_color}?style=for-the-badge)"

    cve_badge = f"![CVEs](https://img.shields.io/badge/ACTIVE%20CVES-{len(report.cves)}-red?style=flat-square)"
    ai_badge = f"![AI Papers](https://img.shields.io/badge/AI%20MODELS-{len(report.ai_breakthroughs)}-purple?style=flat-square)"
    tools_badge = f"![Tools](https://img.shields.io/badge/TRENDING%20TOOLS-{len(report.trending_tools)}-blue?style=flat-square)"

    md = []
    md.append(f"# ⚡ Daily Intelligence Report: {date_str}")
    md.append("")
    md.append(f"{threat_badge} {date_badge}{delta_badge}")
    md.append("")
    md.append(f"{cve_badge} {ai_badge} {tools_badge}")
    md.append("")
    md.append("---")
    md.append("")

    # Executive Briefing
    md.append("## 📌 Executive Briefing")
    md.append("")
    md.append(report.executive_summary)
    md.append("")

    # Key Takeaways
    md.append("## 🎯 Key Takeaways")
    md.append("")
    for item in report.key_takeaways:
        md.append(f"- {item}")
    md.append("")

    # Cybersecurity & Threat Radar
    md.append("## 🛡️ Cybersecurity & Threat Radar (Active Exploits)")
    md.append("")
    if report.cves:
        md.append("| CVE ID | Vendor / Product | Vulnerability Title | Severity | EPSS Prob | Remediation | Advisory |")
        md.append("| :--- | :--- | :--- | :---: | :---: | :--- | :---: |")
        for c in report.cves:
            cve_link = f"[{c.id}]({c.source_url})"
            new_flag = "🔥 " if c.is_new_today else ""
            title = c.title.replace("|", "/")
            vendor_prod = f"{c.vendor} - {c.product}".replace("|", "/")
            remediation = c.remediation.replace("|", "/")
            if c.epss_score is not None:
                epss_str = f"`{c.epss_score*100:.1f}%`"
                if c.epss_percentile is not None:
                    epss_str += f" (top {100 - c.epss_percentile*100:.1f}%)"
            else:
                epss_str = "*N/A*"
            md.append(f"| **{new_flag}{cve_link}** | {vendor_prod} | {title} | `{c.severity}` | {epss_str} | {remediation} | [Advisory]({c.source_url}) |")
    else:
        md.append("> *No active zero-day or KEV catalog vulnerabilities detected for this cycle.*")
    md.append("")

    # AI Breakthroughs & Frontier
    md.append("## 🤖 AI Frontier: Breakthrough Research & Trending Models")
    md.append("")
    if report.ai_breakthroughs:
        papers = [p for p in report.ai_breakthroughs if p.category == "RESEARCH_PAPER"]
        models = [m for m in report.ai_breakthroughs if m.category != "RESEARCH_PAPER"]

        if papers:
            md.append("### 📄 Research Papers")
            for p in papers:
                new_flag = "🔥 " if p.is_new_today else ""
                md.append(f"- **{new_flag}[{p.title}]({p.url})** (`{p.upvotes_or_likes} upvotes`)")
                md.append(f"  - *Summary*: {p.summary}")
                md.append(f"  - *Impact*: {p.why_it_matters}")
            md.append("")

        if models:
            md.append("### 🚀 Trending Open-Weights & Architectures")
            md.append("| Model | Category / Task | Engagements | Significance | Link |")
            md.append("| :--- | :--- | :---: | :--- | :---: |")
            for m in models:
                new_flag = "🔥 " if m.is_new_today else ""
                name_link = f"[{m.title}]({m.url})"
                summary = m.summary.replace("|", "/")
                md.append(f"| **{new_flag}{name_link}** | `{m.category}` | `{m.upvotes_or_likes:,} likes` | {summary} | [Explore]({m.url}) |")
            md.append("")
    else:
        md.append("> *No breakthrough model releases or research papers cataloged for this cycle.*")
    md.append("")

    # Developer Arsenal
    md.append("## ⚡ Developer Arsenal: Rising Open-Source Tools")
    md.append("")
    if report.trending_tools:
        md.append("| Repository | Language | Stars | Primary Use Case | GitHub |")
        md.append("| :--- | :---: | :---: | :--- | :---: |")
        for t in report.trending_tools:
            new_flag = "🔥 " if t.is_new_today else ""
            repo_link = f"[{t.repo_name}]({t.url})"
            use_case = t.use_case.replace("|", "/")
            md.append(f"| **{new_flag}{repo_link}** | `{t.language}` | `★ {t.stars:,}` | {use_case} | [Inspect]({t.url}) |")
    else:
        md.append("> *No high-velocity emerging repositories detected.*")
    md.append("")

    # Industry Discussions & Hacker News
    md.append("## 🌐 Industry Pulse: Architectural Discussions & News")
    md.append("")
    if report.tech_news:
        for n in report.tech_news:
            new_flag = "🔥 " if n.is_new_today else ""
            md.append(f"- **{new_flag}[{n.headline}]({n.url})** (`{n.score} pts` - *{n.source}*)")
            md.append(f"  - *Analysis*: {n.analysis}")
    else:
        md.append("> *No top technology headlines captured for this cycle.*")
    md.append("")

    md.append("---")
    md.append("*Automated report synthesized by TechPulse Intelligence Engine using Gemini and deterministic telemetry verification.*")
    return "\n".join(md)

def _update_archive_index(report: DailyReport, json_rel_path: str, md_rel_path: str) -> None:
    """Maintains a sorted index of all available reports in data/archive_index.json."""
    entries: List[Dict[str, Any]] = []
    if INDEX_FILE.exists():
        try:
            with open(INDEX_FILE, "r", encoding="utf-8") as f:
                entries = json.load(f)
        except Exception:
            entries = []

    # Remove existing entry for the same date if present
    entries = [e for e in entries if e.get("date") != report.date]

    # Calculate highest EPSS exploit probability for the day
    top_epss = None
    if report.cves:
        scores = [c.epss_score for c in report.cves if c.epss_score is not None]
        if scores:
            top_epss = round(max(scores), 4)

    # Add new entry
    new_entry = {
        "date": report.date,
        "threat_level": report.threat_level,
        "yesterday_threat_level": report.yesterday_threat_level,
        "top_epss": top_epss,
        "summary": report.executive_summary[:200] + "...",
        "cves_count": len(report.cves),
        "ai_count": len(report.ai_breakthroughs),
        "tools_count": len(report.trending_tools),
        "news_count": len(report.tech_news),
        "json_path": json_rel_path.replace("\\", "/"),
        "md_path": md_rel_path.replace("\\", "/")
    }
    entries.append(new_entry)

    # Sort descending by date
    entries.sort(key=lambda x: x.get("date", ""), reverse=True)

    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2)

def _generate_rss_feed(max_items: int = 20) -> Dict[str, str]:
    """
    Generates standard RSS 2.0 and Atom syndication feeds from the historical archive index.
    Produces data/rss.xml and data/feed.xml for feed readers and external integrations.
    """
    entries: List[Dict[str, Any]] = []
    if INDEX_FILE.exists():
        try:
            with open(INDEX_FILE, "r", encoding="utf-8") as f:
                entries = json.load(f)
        except Exception as e:
            print(f"[!] Warning reading archive index for RSS: {e}")

    now_rfc = email.utils.format_datetime(datetime.datetime.now(datetime.timezone.utc))
    repo_url = "https://github.com/swayam-jha/TechPulse-Intelligence"
    raw_rss_url = "https://raw.githubusercontent.com/swayam-jha/TechPulse-Intelligence/main/data/rss.xml"

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        '  <channel>',
        '    <title>TechPulse Intelligence - Daily Intelligence Briefing</title>',
        f'    <link>{repo_url}</link>',
        '    <description>Automated daily cybersecurity telemetry, FIRST.org EPSS exploit scoring, AI breakthroughs, and trending developer tooling.</description>',
        '    <language>en-us</language>',
        f'    <lastBuildDate>{now_rfc}</lastBuildDate>',
        f'    <atom:link href="{raw_rss_url}" rel="self" type="application/rss+xml" />',
    ]

    for entry in entries[:max_items]:
        d_str = entry.get("date", "")
        threat = entry.get("threat_level", "UNKNOWN")
        summary = entry.get("summary", "")
        md_rel = entry.get("md_path", "")
        cve_count = entry.get("cves_count", 0)
        ai_count = entry.get("ai_count", 0)
        tools_count = entry.get("tools_count", 0)
        top_epss = entry.get("top_epss")

        try:
            dt = datetime.datetime.strptime(d_str, "%Y-%m-%d").replace(
                hour=6, minute=0, second=0, tzinfo=datetime.timezone.utc
            )
            item_pub_date = email.utils.format_datetime(dt)
        except Exception:
            item_pub_date = now_rfc

        item_title = f"TechPulse Daily Briefing - {d_str} [Threat: {threat}]"
        item_link = f"{repo_url}/blob/main/{md_rel}" if md_rel else repo_url
        guid = f"techpulse-briefing-{d_str}"

        epss_note = f" | Peak EPSS: {top_epss*100:.1f}%" if top_epss is not None else ""
        desc_html = (
            f"<p><strong>Threat Posture:</strong> {threat}{epss_note}</p>"
            f"<p><strong>Telemetry:</strong> {cve_count} Active CVEs | {ai_count} AI Innovations | {tools_count} Trending Tools</p>"
            f"<p>{escape(summary)}</p>"
            f'<p><a href="{item_link}">Read Full Intelligence Briefing on GitHub</a></p>'
        )

        xml_lines.extend([
            '    <item>',
            f'      <title>{escape(item_title)}</title>',
            f'      <link>{escape(item_link)}</link>',
            f'      <guid isPermaLink="false">{guid}</guid>',
            f'      <pubDate>{item_pub_date}</pubDate>',
            f'      <description><![CDATA[{desc_html}]]></description>',
            '      <category>Cybersecurity</category>',
            '      <category>Artificial Intelligence</category>',
            '      <category>Developer Tools</category>',
            '    </item>'
        ])

    xml_lines.extend([
        '  </channel>',
        '</rss>'
    ])

    rss_content = "\n".join(xml_lines)

    # Write both rss.xml and feed.xml
    with open(RSS_FILE, "w", encoding="utf-8") as f:
        f.write(rss_content)

    with open(FEED_FILE, "w", encoding="utf-8") as f:
        f.write(rss_content)

    return {
        "rss_path": str(RSS_FILE),
        "feed_path": str(FEED_FILE),
        "rss_rel": str(RSS_FILE.relative_to(BASE_DIR)),
        "feed_rel": str(FEED_FILE.relative_to(BASE_DIR))
    }

def _update_readme(report: DailyReport, md_rel_path: str) -> None:
    """Updates the Latest Intelligence section in root README.md."""
    if not README_FILE.exists():
        return

    try:
        with open(README_FILE, "r", encoding="utf-8") as f:
            content = f.read()

        threat_level = report.threat_level.upper()
        color = THREAT_COLORS.get(threat_level, "lightgrey")
        threat_badge = f"![Threat](https://img.shields.io/badge/THREAT-{threat_level}-{color}?style=flat-square)"
        rss_badge = "[![RSS Feed](https://img.shields.io/badge/RSS-Feed-orange?style=flat-square&logo=rss)](data/rss.xml)"
        
        takeaways_bullets = "\n".join([f"- {t}" for t in report.key_takeaways[:3]])
        md_link = md_rel_path.replace("\\", "/")

        section = f"""<!-- LATEST_INTEL_START -->
## 🚨 Latest Intelligence: {report.date} {threat_badge} {rss_badge}

> **Threat Assessment**: {report.threat_level} | **Active CVEs**: {len(report.cves)} | **AI Breakthroughs**: {len(report.ai_breakthroughs)}

### Highlights
{takeaways_bullets}

👉 **[Read Full Daily Intelligence Report ({report.date})]({md_link})** | 📡 **[Subscribe to RSS Feed](data/rss.xml)**
<!-- LATEST_INTEL_END -->"""

        if "<!-- LATEST_INTEL_START -->" in content:
            new_content = re.sub(
                r"<!-- LATEST_INTEL_START -->.*?<!-- LATEST_INTEL_END -->",
                section,
                content,
                flags=re.DOTALL
            )
        else:
            # Insert after the first header block
            target_anchor = "---"
            if target_anchor in content:
                parts = content.split(target_anchor, 1)
                new_content = f"{parts[0]}---\n\n{section}\n\n---{parts[1]}"
            else:
                new_content = f"{content}\n\n{section}"

        with open(README_FILE, "w", encoding="utf-8") as f:
            f.write(new_content)

    except Exception as e:
        print(f"[!] Warning updating README.md: {e}")

def save_report(report: DailyReport) -> Dict[str, str]:
    """
    Serializes a DailyReport to JSON, Markdown, updates archive index, generates RSS feeds, and syncs README.
    Returns relative and absolute paths of all generated assets.
    """
    date_parts = report.date.split("-")
    if len(date_parts) == 3:
        year, month, _ = date_parts
    else:
        year, month = "2026", "09"

    # 1. Output directories
    json_dir = DATA_DIR / year / month
    md_dir = REPORTS_DIR / year / month
    json_dir.mkdir(parents=True, exist_ok=True)
    md_dir.mkdir(parents=True, exist_ok=True)

    json_file = json_dir / f"{report.date}.json"
    md_file = md_dir / f"{report.date}.md"

    # 2. Save JSON
    with open(json_file, "w", encoding="utf-8") as f:
        f.write(report.model_dump_json(indent=2))

    # 3. Save Markdown
    markdown_content = _generate_markdown(report)
    with open(md_file, "w", encoding="utf-8") as f:
        f.write(markdown_content)

    # 4. Relative paths for index & README
    json_rel = str(json_file.relative_to(BASE_DIR))
    md_rel = str(md_file.relative_to(BASE_DIR))

    # 5. Update archive index & RSS feeds
    _update_archive_index(report, json_rel, md_rel)
    feed_paths = _generate_rss_feed()

    # 6. Save latest.json and mirror into web/public/data
    latest_file = DATA_DIR / "latest.json"
    report_json_str = report.model_dump_json(indent=2)
    with open(latest_file, "w", encoding="utf-8") as f:
        f.write(report_json_str)

    web_data_dir = BASE_DIR / "web" / "public" / "data"
    try:
        web_json_dir = web_data_dir / year / month
        web_json_dir.mkdir(parents=True, exist_ok=True)
        web_json_file = web_json_dir / f"{report.date}.json"
        web_latest_file = web_data_dir / "latest.json"

        with open(web_json_file, "w", encoding="utf-8") as f:
            f.write(report_json_str)
        with open(web_latest_file, "w", encoding="utf-8") as f:
            f.write(report_json_str)

        import shutil
        if INDEX_FILE.exists():
            shutil.copy2(INDEX_FILE, web_data_dir / "archive_index.json")
        if RSS_FILE.exists():
            shutil.copy2(RSS_FILE, web_data_dir / "rss.xml")
        if FEED_FILE.exists():
            shutil.copy2(FEED_FILE, web_data_dir / "feed.xml")
    except Exception as e:
        print(f"[!] Warning mirroring data to web/public/data: {e}")

    # 7. Update README
    _update_readme(report, md_rel)

    print(f"[+] Serialized Web JSON: {json_rel}")
    print(f"[+] Serialized Report Markdown: {md_rel}")
    print(f"[+] Serialized latest.json & mirrored to web/public/data")
    print(f"[+] Updated archive index: data/archive_index.json")
    print(f"[+] Syndication feeds generated: {feed_paths['rss_rel']} & {feed_paths['feed_rel']}")

    return {
        "json_path": str(json_file),
        "md_path": str(md_file),
        "json_rel": json_rel,
        "md_rel": md_rel,
        "rss_path": feed_paths["rss_path"],
        "feed_path": feed_paths["feed_path"],
        "rss_rel": feed_paths["rss_rel"],
        "feed_rel": feed_paths["feed_rel"]
    }
