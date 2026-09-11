from typing import List, Optional
from pydantic import BaseModel, Field

class CveItem(BaseModel):
    id: str = Field(description="CVE identifier, e.g. CVE-2026-1234")
    vendor: str = Field(description="Vendor or organization name")
    product: str = Field(description="Product name")
    title: str = Field(description="Concise vulnerability title")
    severity: str = Field(description="CRITICAL, HIGH, MEDIUM, or LOW")
    is_actively_exploited: bool = Field(default=True, description="Whether this is in CISA KEV or actively exploited in the wild")
    epss_score: Optional[float] = Field(default=None, description="FIRST.org Exploit Prediction Scoring System probability (0.0 to 1.0)")
    epss_percentile: Optional[float] = Field(default=None, description="FIRST.org EPSS percentile ranking relative to all CVEs")
    is_new_today: bool = Field(default=True, description="Whether this CVE first appeared in today's report vs yesterday")
    description: str = Field(description="Brief explanation of the vulnerability and attack vector")
    remediation: str = Field(description="Direct action required to mitigate or patch")
    source_url: str = Field(description="Link to official NVD/CISA/vendor advisory")

class AiBreakthrough(BaseModel):
    title: str = Field(description="Title of paper, model release, or AI innovation")
    category: str = Field(description="RESEARCH_PAPER, MODEL_RELEASE, or TOOL")
    summary: str = Field(description="Summary of what the model or paper achieves")
    why_it_matters: str = Field(description="The practical significance for engineers or the AI industry")
    upvotes_or_likes: int = Field(default=0, description="Community upvotes or likes")
    url: str = Field(description="Link to Hugging Face or paper")
    is_new_today: bool = Field(default=True, description="Whether this item is newly surfaced today")

class TrendingTool(BaseModel):
    repo_name: str = Field(description="Full repository name, e.g. owner/repo")
    language: str = Field(description="Primary programming language")
    stars: int = Field(description="Current star count")
    description: str = Field(description="Brief description of what the project does")
    use_case: str = Field(description="Primary developer use case and why it's gaining traction")
    url: str = Field(description="GitHub URL to the repository")
    is_new_today: bool = Field(default=True, description="Whether this repository is newly trending today")

class TechNewsItem(BaseModel):
    headline: str = Field(description="News headline or discussion title")
    source: str = Field(default="Hacker News", description="Origin of news, e.g. Hacker News, Blog, Press")
    analysis: str = Field(description="Concise analysis of industry impact")
    score: int = Field(default=0, description="Points or engagement score")
    url: str = Field(description="Link to source article or discussion")
    is_new_today: bool = Field(default=True, description="Whether this news item is newly reported today")

class DailyReport(BaseModel):
    date: str = Field(description="ISO date YYYY-MM-DD")
    threat_level: str = Field(description="Overall cyber threat climate: LOW, GUARDED, ELEVATED, HIGH, CRITICAL")
    yesterday_threat_level: Optional[str] = Field(default=None, description="Previous cycle threat level for day-over-day delta")
    executive_summary: str = Field(description="2-3 paragraph analytical briefing synthesizing today's key technical and security developments")
    key_takeaways: List[str] = Field(description="3 to 5 high-impact bullet points")
    cves: List[CveItem] = Field(default_factory=list, description="Key vulnerabilities of the day")
    ai_breakthroughs: List[AiBreakthrough] = Field(default_factory=list, description="Breakthrough AI papers and models")
    trending_tools: List[TrendingTool] = Field(default_factory=list, description="Fastest-growing developer tools")
    tech_news: List[TechNewsItem] = Field(default_factory=list, description="Top tech news and architectural shifts")


