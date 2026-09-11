import httpx
from typing import List, Dict, Any
from src.config import CISA_KEV_URL, DEFAULT_TIMEOUT, DEFAULT_USER_AGENT

EPSS_API_URL = "https://api.first.org/data/v1/epss"

def _fetch_epss_scores(cve_ids: List[str]) -> Dict[str, Dict[str, float]]:
    """
    Queries FIRST.org EPSS API in a single batch request to fetch
    empirical probability of wild exploitation in the next 30 days.
    """
    if not cve_ids:
        return {}
    
    valid_ids = [c for c in cve_ids if c.startswith("CVE-")]
    if not valid_ids:
        return {}

    url = f"{EPSS_API_URL}?cve={','.join(valid_ids)}"
    epss_map: Dict[str, Dict[str, float]] = {}
    try:
        with httpx.Client(timeout=5.0, follow_redirects=True) as client:
            resp = client.get(url)
            if resp.status_code == 200:
                data = resp.json().get("data", [])
                for item in data:
                    cve = item.get("cve")
                    if cve:
                        try:
                            score = float(item.get("epss", 0.0))
                            pct = float(item.get("percentile", 0.0))
                            epss_map[cve] = {"epss": score, "percentile": pct}
                        except (ValueError, TypeError):
                            continue
    except Exception as e:
        print(f"[!] Warning: EPSS scoring lookup failed ({e}). Proceeding without EPSS metrics.")

    return epss_map

def fetch_top_cves(limit: int = 5) -> List[Dict[str, Any]]:
    """
    Fetches the latest actively exploited vulnerabilities from CISA KEV
    and enriches them with FIRST.org EPSS exploit probability scores.
    """
    results = []
    headers = {"User-Agent": DEFAULT_USER_AGENT}
    try:
        with httpx.Client(timeout=DEFAULT_TIMEOUT, headers=headers, follow_redirects=True) as client:
            resp = client.get(CISA_KEV_URL)
            if resp.status_code == 200:
                data = resp.json()
                vulnerabilities = data.get("vulnerabilities", [])
                # Sort by dateAdded descending to prioritize recent exploits
                sorted_vulns = sorted(vulnerabilities, key=lambda x: x.get("dateAdded", ""), reverse=True)
                target_vulns = sorted_vulns[:limit]

                # Extract IDs for batch EPSS lookup
                cve_ids = [item.get("cveID", "") for item in target_vulns if item.get("cveID")]
                epss_scores = _fetch_epss_scores(cve_ids)

                for item in target_vulns:
                    cve_id = item.get("cveID", "Unknown")
                    vuln_name = item.get("vulnerabilityName", "")
                    description = item.get("shortDescription", "No description provided.")
                    required_action = item.get("requiredAction", "Apply vendor updates immediately.")
                    ref_url = item.get("notes") or f"https://nvd.nist.gov/vuln/detail/{cve_id}"

                    epss_data = epss_scores.get(cve_id, {})
                    epss_score = epss_data.get("epss")
                    epss_pct = epss_data.get("percentile")

                    results.append({
                        "id": cve_id,
                        "vendor": item.get("vendorProject", "Unknown"),
                        "product": item.get("product", "Unknown"),
                        "title": vuln_name or f"{cve_id} Vulnerability",
                        "name": vuln_name,
                        "severity": "HIGH",  # KEV items are actively exploited in the wild
                        "is_actively_exploited": True,
                        "epss_score": epss_score,
                        "epss_percentile": epss_pct,
                        "is_new_today": True,
                        "date_added": item.get("dateAdded", ""),
                        "description": description,
                        "summary": description,
                        "remediation": required_action,
                        "required_action": required_action,
                        "due_date": item.get("dueDate", ""),
                        "ransomware_use": item.get("knownRansomwareCampaignUse", "Unknown"),
                        "source_url": ref_url,
                        "reference": ref_url
                    })
            else:
                print(f"[!] CISA KEV returned HTTP status {resp.status_code}")
    except (httpx.TimeoutException, httpx.RequestError) as e:
        print(f"[!] Network error fetching CISA KEV: {e}")
    except Exception as e:
        print(f"[!] Unexpected error processing CVEs: {e}")
    
    return results

if __name__ == "__main__":
    vulns = fetch_top_cves(3)
    print(f"Retrieved {len(vulns)} CVEs with EPSS Scores:")
    for v in vulns:
        score_str = f"{v['epss_score']*100:.1f}%" if v.get('epss_score') is not None else "N/A"
        pct_str = f"{v['epss_percentile']*100:.1f}%" if v.get('epss_percentile') is not None else "N/A"
        print(f"[{v['id']}] {v['vendor']} {v['product']} | EPSS: {score_str} (Rank: {pct_str})")


