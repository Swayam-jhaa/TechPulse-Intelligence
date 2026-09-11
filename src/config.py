from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
REPORTS_DIR = BASE_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

# GitHub Profile configuration
GIT_USER_NAME = os.getenv("GIT_USER_NAME", "swayam jha")
GIT_USER_EMAIL = os.getenv("GIT_USER_EMAIL", "swayamjhaoffical@gmail.com")
GITHUB_REPO = os.getenv("GITHUB_REPO", "Swayam-jhaa/daily-tech-pulse")

# API & Feed endpoints
CISA_KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
OSV_API_URL = "https://api.osv.dev/v1/query"
HF_DAILY_PAPERS_URL = "https://huggingface.co/api/daily_papers"
HF_TRENDING_MODELS_URL = "https://huggingface.co/api/models?sort=likes7d&direction=-1&limit=6"
HN_TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json"
HN_ITEM_URL = "https://hacker-news.firebaseio.com/v0/item/{}.json"

# AI Enhancer
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

# Streak & Randomness bounds (in minutes)
MIN_JITTER_MINUTES = int(os.getenv("MIN_JITTER_MINUTES", "15"))
MAX_JITTER_MINUTES = int(os.getenv("MAX_JITTER_MINUTES", "120"))

# Request settings
DEFAULT_TIMEOUT = float(os.getenv("DEFAULT_TIMEOUT", "10.0"))
DEFAULT_USER_AGENT = os.getenv("DEFAULT_USER_AGENT", "TechPulseIntelligence/1.0")
