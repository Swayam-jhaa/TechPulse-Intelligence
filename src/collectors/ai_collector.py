import httpx
from typing import List, Dict, Any
from src.config import HF_DAILY_PAPERS_URL, HF_TRENDING_MODELS_URL, DEFAULT_TIMEOUT, DEFAULT_USER_AGENT

def fetch_top_ai_breakthroughs(papers_limit: int = 4, models_limit: int = 4) -> Dict[str, Any]:
    """
    Fetches breakthrough research papers and trending AI models from Hugging Face.
    Provides structured payloads ready for synthesis and presentation.
    """
    papers = []
    models = []
    headers = {"User-Agent": DEFAULT_USER_AGENT}

    try:
        with httpx.Client(timeout=DEFAULT_TIMEOUT, headers=headers, follow_redirects=True) as client:
            # 1. Fetch Daily Papers
            try:
                resp = client.get(HF_DAILY_PAPERS_URL)
                if resp.status_code == 200:
                    raw_papers = resp.json()
                    for p in raw_papers[:papers_limit]:
                        paper_data = p.get("paper", {}) if "paper" in p else p
                        title = paper_data.get("title", "Untitled Paper")
                        summary = paper_data.get("summary", "No summary available.").replace("\n", " ").strip()
                        upvotes = paper_data.get("upvotes", 0)
                        paper_id = paper_data.get("id", "")
                        paper_url = f"https://huggingface.co/papers/{paper_id}" if paper_id else "https://huggingface.co/papers"
                        authors = [a.get("name", "") for a in paper_data.get("authors", [])][:3]

                        papers.append({
                            "title": title,
                            "category": "RESEARCH_PAPER",
                            "summary": summary,
                            "why_it_matters": f"Top community-ranked research paper ({upvotes} upvotes) discussing: {title}",
                            "upvotes": upvotes,
                            "upvotes_or_likes": upvotes,
                            "published_at": paper_data.get("publishedAt", ""),
                            "url": paper_url,
                            "authors": authors
                        })
                else:
                    print(f"[!] HF daily papers returned HTTP status {resp.status_code}")
            except Exception as e:
                print(f"[!] Error fetching AI papers: {e}")

            # 2. Fetch Trending Models
            try:
                resp = client.get(HF_TRENDING_MODELS_URL)
                if resp.status_code == 200:
                    raw_models = resp.json()
                    for m in raw_models[:models_limit]:
                        model_id = m.get("id", "Unknown")
                        likes = m.get("likes", 0)
                        downloads = m.get("downloads", 0)
                        task = m.get("pipeline_tag", "General AI") or "General AI"
                        model_url = f"https://huggingface.co/{model_id}"

                        models.append({
                            "name": model_id,
                            "title": model_id,
                            "category": "MODEL_RELEASE",
                            "summary": f"Trending open-weights model specialized in {task}.",
                            "why_it_matters": f"High engagement open model with {likes:,} likes and {downloads:,} downloads.",
                            "likes": likes,
                            "downloads": downloads,
                            "upvotes_or_likes": likes,
                            "task": task,
                            "url": model_url
                        })
                else:
                    print(f"[!] HF trending models returned HTTP status {resp.status_code}")
            except Exception as e:
                print(f"[!] Error fetching trending models: {e}")

    except Exception as e:
        print(f"[!] Unexpected error in AI breakthroughs client: {e}")

    return {
        "papers": papers,
        "models": models
    }

if __name__ == "__main__":
    data = fetch_top_ai_breakthroughs(2, 2)
    print(f"Retrieved {len(data['papers'])} Papers and {len(data['models'])} Models:")
    for p in data["papers"]:
        print(f" - [Paper] {p['title']} ({p['upvotes']} upvotes)")
    for m in data["models"]:
        print(f" - [Model] {m['name']} ({m['likes']} likes)")

