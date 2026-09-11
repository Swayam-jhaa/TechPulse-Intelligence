import httpx
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any, Optional
from src.config import HN_TOP_STORIES_URL, HN_ITEM_URL, DEFAULT_TIMEOUT, DEFAULT_USER_AGENT

def _fetch_single_hn_item(client: httpx.Client, item_id: int) -> Optional[Dict[str, Any]]:
    """Fetches a single Hacker News item by ID and extracts story metadata."""
    try:
        resp = client.get(HN_ITEM_URL.format(item_id))
        if resp.status_code == 200:
            item = resp.json()
            if item and item.get("type") == "story" and not item.get("deleted") and not item.get("dead"):
                item_id_val = item.get("id", item_id)
                title = item.get("title", "")
                url = item.get("url") or f"https://news.ycombinator.com/item?id={item_id_val}"
                score = item.get("score", 0)
                by = item.get("by", "anonymous")

                return {
                    "headline": title,
                    "source": "Hacker News",
                    "analysis": f"High-engagement tech story ({score} points) submitted by {by}.",
                    "score": score,
                    "author": by,
                    "url": url,
                    "hn_url": f"https://news.ycombinator.com/item?id={item_id_val}"
                }
    except Exception:
        pass
    return None

def fetch_top_tech_news(limit: int = 5) -> List[Dict[str, Any]]:
    """
    Fetches top tech stories and major developments from Hacker News concurrently.
    Normalizes fields for downstream AI analysis and storage.
    """
    results = []
    headers = {"User-Agent": DEFAULT_USER_AGENT}

    try:
        with httpx.Client(timeout=DEFAULT_TIMEOUT, headers=headers, follow_redirects=True) as client:
            resp = client.get(HN_TOP_STORIES_URL)
            if resp.status_code == 200:
                top_ids = resp.json()[:limit * 3]  # Grab extra candidates to filter out non-stories
                
                # Fetch story details concurrently using ThreadPoolExecutor for speed
                with ThreadPoolExecutor(max_workers=min(len(top_ids), 8)) as executor:
                    future_to_id = {
                        executor.submit(_fetch_single_hn_item, client, item_id): item_id 
                        for item_id in top_ids
                    }
                    
                    for future in as_completed(future_to_id):
                        item_data = future.result()
                        if item_data:
                            results.append(item_data)
                
                # Sort by score descending and take the requested limit
                results.sort(key=lambda x: x.get("score", 0), reverse=True)
                results = results[:limit]
            else:
                print(f"[!] Hacker News API returned HTTP status {resp.status_code}")
    except (httpx.TimeoutException, httpx.RequestError) as e:
        print(f"[!] Network error fetching Hacker News: {e}")
    except Exception as e:
        print(f"[!] Unexpected error processing Hacker News: {e}")

    return results

if __name__ == "__main__":
    stories = fetch_top_tech_news(3)
    print(f"Retrieved {len(stories)} Stories:")
    for s in stories:
        print(f"[{s['score']} pts] {s['headline']} -> {s['url']}")

