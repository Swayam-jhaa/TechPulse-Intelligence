import httpx
import shutil
import subprocess
import os
import datetime
from typing import List, Dict, Any
from src.config import DEFAULT_TIMEOUT, DEFAULT_USER_AGENT

def _get_github_token() -> str:
    """Attempts to discover a GitHub token via environment or local gh CLI."""
    token = os.getenv("GITHUB_TOKEN") or os.getenv("GH_TOKEN")
    if token:
        return token
    # Try finding gh cli
    gh_cmd = shutil.which("gh")
    if not gh_cmd and os.path.exists(r"C:\Program Files\GitHub CLI\gh.exe"):
        gh_cmd = r"C:\Program Files\GitHub CLI\gh.exe"
    
    if gh_cmd and os.path.exists(gh_cmd):
        try:
            res = subprocess.run([gh_cmd, "auth", "token"], capture_output=True, text=True, check=True)
            return res.stdout.strip()
        except Exception:
            pass
    return ""

def fetch_trending_repos(days_back: int = 7, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Fetches newly created repositories that are rapidly accumulating stars.
    Normalizes fields for downstream AI analysis and storage.
    """
    results = []
    token = _get_github_token()
    headers = {
        "User-Agent": DEFAULT_USER_AGENT,
        "Accept": "application/vnd.github.v3+json"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    since_date = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=days_back)).strftime("%Y-%m-%d")
    # Query: created in last N days, sorted by stars descending
    url = f"https://api.github.com/search/repositories?q=created:>{since_date}&sort=stars&order=desc&per_page={limit}"

    try:
        with httpx.Client(timeout=DEFAULT_TIMEOUT, headers=headers, follow_redirects=True) as client:
            resp = client.get(url)
            if resp.status_code == 200:
                items = resp.json().get("items", [])
                for item in items:
                    repo_name = item.get("full_name", "")
                    description = item.get("description") or "No description provided."
                    language = item.get("language") or "Multi/Other"
                    stars = item.get("stargazers_count", 0)
                    url_str = item.get("html_url", "")

                    results.append({
                        "repo_name": repo_name,
                        "name": repo_name,
                        "stars": stars,
                        "forks": item.get("forks_count", 0),
                        "description": description,
                        "language": language,
                        "use_case": f"Rapidly emerging open source project in {language} with {stars:,} stars.",
                        "topics": item.get("topics", [])[:4],
                        "url": url_str,
                        "owner": item.get("owner", {}).get("login", "")
                    })
            elif resp.status_code in (403, 429):
                print(f"[!] GitHub API rate limit reached (HTTP {resp.status_code}). Provide GITHUB_TOKEN in .env for 5,000 req/hr.")
            else:
                print(f"[!] GitHub search returned HTTP {resp.status_code}: {resp.text[:100]}")
    except (httpx.TimeoutException, httpx.RequestError) as e:
        print(f"[!] Network error querying GitHub trending repos: {e}")
    except Exception as e:
        print(f"[!] Unexpected error processing GitHub repos: {e}")

    return results

if __name__ == "__main__":
    repos = fetch_trending_repos(7, 3)
    print(f"Retrieved {len(repos)} Repositories:")
    for r in repos:
        print(f"[{r['stars']} stars] {r['repo_name']} ({r['language']}): {r['description'][:70]}...")

