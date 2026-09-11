"""
Gemini Intelligence Synthesis Engine for TechPulse Intelligence.
Enriches raw multi-source telemetry into an executive daily briefing using Google Gemini.
Enforces strict Pydantic JSON schemas, rate-limiting backoffs, and multi-tier model fallbacks.
"""

import os
import json
import time
import datetime
from typing import Dict, Any, List

from google import genai
from google.genai import types

from src.config import GEMINI_API_KEY, GEMINI_MODEL
from src.analyzer.models import DailyReport
from src.analyzer.fallback_analyzer import generate_fallback_report
from src.analyzer.delta_tracker import apply_delta_to_signals

SECONDARY_FALLBACK_MODEL = "gemini-3.1-flash-lite"
MAX_RETRIES = 2
INITIAL_BACKOFF_SECONDS = 2.0

SYSTEM_INSTRUCTION = """You are the Principal Threat Intelligence and Technology Analyst for TechPulse Intelligence.
Your role is to synthesize raw telemetry across cybersecurity, artificial intelligence, open-source developer tooling, and tech news into an authoritative daily intelligence report.

CRITICAL DIRECTIVES:
1. Grounded Accuracy: Only analyze the provided signals. NEVER invent or hallucinate CVE numbers, fake patches, or nonexistent models.
2. Threat Rating & Day-Over-Day Shift: Assign an overall threat level: LOW, GUARDED, ELEVATED, HIGH, or CRITICAL based on the severity, active wild exploitation, and FIRST.org EPSS exploit probability scores. Compare against yesterday's threat level to identify rising or cooling threat climates.
3. EPSS Context: Explicitly evaluate quantitative exploit probability percentages (EPSS) for vulnerabilities.
4. Executive Briefing: Write a crisp, 3-paragraph executive overview:
   - Paragraph 1: Cybersecurity posture, day-over-day threat shifts, actively exploited vulnerabilities, and immediate remediation requirements.
   - Paragraph 2: AI research breakthroughs and open-weights advancements.
   - Paragraph 3: Developer tooling velocity and industry shifts.
5. Key Takeaways: Generate 3 to 5 concise, high-impact bullet points. Highlight newly emerged items (is_new_today).
6. Schema Conformance: Output MUST strictly comply with the DailyReport JSON schema.
"""

def _sanitize_signals(raw_signals: Dict[str, Any]) -> Dict[str, Any]:
    """Bounds text lengths in raw telemetry to stay well within TPM/token limits while preserving EPSS and delta flags."""
    cves: List[Dict[str, Any]] = []
    for c in raw_signals.get("cves", []):
        cves.append({
            "id": c.get("id"),
            "vendor": c.get("vendor"),
            "product": c.get("product"),
            "title": c.get("title", "")[:120],
            "severity": c.get("severity", "HIGH"),
            "epss_score": c.get("epss_score"),
            "epss_percentile": c.get("epss_percentile"),
            "is_new_today": c.get("is_new_today", True),
            "description": c.get("description", "")[:400],
            "remediation": c.get("remediation", "")[:300],
            "source_url": c.get("source_url")
        })

    ai = raw_signals.get("ai", {})
    papers: List[Dict[str, Any]] = []
    for p in ai.get("papers", []):
        papers.append({
            "title": p.get("title", "")[:150],
            "summary": p.get("summary", "")[:500],
            "upvotes_or_likes": p.get("upvotes_or_likes", 0),
            "is_new_today": p.get("is_new_today", True),
            "url": p.get("url")
        })

    models: List[Dict[str, Any]] = []
    for m in ai.get("models", []):
        models.append({
            "name": m.get("name", "")[:100],
            "task": m.get("task", "")[:60],
            "upvotes_or_likes": m.get("upvotes_or_likes", 0),
            "downloads": m.get("downloads", 0),
            "is_new_today": m.get("is_new_today", True),
            "url": m.get("url")
        })

    repos: List[Dict[str, Any]] = []
    for r in raw_signals.get("github", []):
        repos.append({
            "repo_name": r.get("repo_name", "")[:80],
            "language": r.get("language", "")[:30],
            "stars": r.get("stars", 0),
            "is_new_today": r.get("is_new_today", True),
            "description": r.get("description", "")[:300],
            "url": r.get("url")
        })

    news: List[Dict[str, Any]] = []
    for n in raw_signals.get("news", []):
        news.append({
            "headline": n.get("headline", "")[:150],
            "score": n.get("score", 0),
            "is_new_today": n.get("is_new_today", True),
            "url": n.get("url")
        })

    return {
        "cves": cves,
        "ai_breakthroughs": {"papers": papers, "models": models},
        "trending_tools": repos,
        "tech_news": news
    }

def _build_prompt(raw_signals: Dict[str, Any], date_str: str, prev_threat: str = None) -> str:
    """Formats sanitized multi-source signals into a compact structured LLM prompt."""
    sanitized = _sanitize_signals(raw_signals)
    sanitized["date"] = date_str
    if prev_threat:
        sanitized["yesterday_threat_level"] = prev_threat
    
    prompt = f"""Synthesize today's Daily Intelligence Report for {date_str} from the following raw collected signals:

```json
{json.dumps(sanitized, indent=2)}
```

Analyze these signals thoroughly. Evaluate threat levels (factoring in yesterday's baseline posture if provided), evaluate FIRST.org EPSS exploit probability scores, provide developer-focused remediation advice, explain why breakthrough AI models and tools matter, and highlight significant architectural discussions.
"""
    return prompt

def _attempt_synthesis(client: genai.Client, model: str, prompt: str) -> DailyReport:
    """Calls Gemini with bounded output tokens and response_schema enforcement."""
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=DailyReport,
            temperature=0.2,
            max_output_tokens=8192  # Full output window to guarantee complete JSON schema closure
        )
    )

    if not response.text:
        raise ValueError("Empty response received from Gemini API.")

    return DailyReport.model_validate_json(response.text)

def analyze_daily_intelligence(raw_signals: Dict[str, Any], date_str: str = "", api_key: str = None) -> DailyReport:
    """
    Synthesizes raw telemetry into a structured DailyReport using Google Gemini.
    Features:
    - Historical delta tracking and day-over-day threat comparison.
    - FIRST.org EPSS exploit probability score integration.
    - Token-bounded prompt formatting.
    - Automatic exponential backoff retries for transient 429/503 rate limits.
    - Secondary model fallback (gemini-3.1-flash-lite) if primary experiences demand spikes.
    - Full deterministic offline rule-based fallback if all cloud attempts degrade.
    """
    if not date_str:
        date_str = raw_signals.get("date") or datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")

    # Apply historical delta tracking against previous cycle
    raw_signals, prev_threat = apply_delta_to_signals(raw_signals, date_str)

    if api_key is None:
        api_key = os.getenv("GEMINI_API_KEY") if "GEMINI_API_KEY" in os.environ else GEMINI_API_KEY
    model_name = os.getenv("GEMINI_MODEL") or GEMINI_MODEL

    # If no API key configured or empty, engage deterministic fallback immediately
    if not api_key:
        print("[i] GEMINI_API_KEY is not configured. Engaging deterministic fallback analyzer.")
        return generate_fallback_report(raw_signals, date_str=date_str)

    prompt = _build_prompt(raw_signals, date_str, prev_threat)
    client = genai.Client(api_key=api_key)

    # Multi-model execution ladder: primary model -> secondary lightweight fallback
    models_to_try = [model_name]
    if SECONDARY_FALLBACK_MODEL not in models_to_try:
        models_to_try.append(SECONDARY_FALLBACK_MODEL)

    for current_model in models_to_try:
        backoff = INITIAL_BACKOFF_SECONDS
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                report = _attempt_synthesis(client, current_model, prompt)
                
                # Reconcile collector ground truth (EPSS scores, delta flags, baseline threat)
                if not report.yesterday_threat_level and prev_threat:
                    report.yesterday_threat_level = prev_threat

                cve_map = {c.get("id"): c for c in raw_signals.get("cves", []) if c.get("id")}
                for c in report.cves:
                    if c.id in cve_map:
                        raw_c = cve_map[c.id]
                        if c.epss_score is None:
                            c.epss_score = raw_c.get("epss_score")
                        if c.epss_percentile is None:
                            c.epss_percentile = raw_c.get("epss_percentile")
                        c.is_new_today = raw_c.get("is_new_today", True)

                print(f"[+] Gemini synthesis successful ({current_model}) - Threat Level: {report.threat_level}")
                return report

            except Exception as e:
                err_str = str(e)
                is_rate_limit_or_transient = any(code in err_str for code in ("429", "503", "RESOURCE_EXHAUSTED", "UNAVAILABLE"))
                
                if is_rate_limit_or_transient and attempt < MAX_RETRIES:
                    print(f"[!] Transient Gemini error ({type(e).__name__}) on {current_model}. Backing off for {backoff:.1f}s (attempt {attempt}/{MAX_RETRIES})...")
                    time.sleep(backoff)
                    backoff *= 2.0
                else:
                    print(f"[!] Gemini synthesis failed on {current_model} ({type(e).__name__}: {err_str[:120]}).")
                    break  # Move to next model in the ladder

    # If all models in the cloud ladder fail, smoothly engage deterministic local fallback
    print("[!] All cloud LLM models degraded or rate-limited. Engaging deterministic fallback synthesizer.")
    return generate_fallback_report(raw_signals, date_str=date_str)
