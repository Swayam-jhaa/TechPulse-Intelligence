export interface CveItem {
  id: string;
  vendor: string;
  product: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  is_actively_exploited: boolean;
  epss_score?: number | null;
  epss_percentile?: number | null;
  is_new_today: boolean;
  description: string;
  remediation: string;
  source_url: string;
}

export interface AiBreakthrough {
  title: string;
  category: 'RESEARCH_PAPER' | 'MODEL_RELEASE' | 'TOOL';
  summary: string;
  why_it_matters: string;
  upvotes_or_likes: number;
  url: string;
  is_new_today: boolean;
}

export interface TrendingTool {
  repo_name: string;
  language: string;
  stars: number;
  description: string;
  use_case: string;
  url: string;
  is_new_today: boolean;
}

export interface TechNewsItem {
  headline: string;
  source: string;
  analysis: string;
  score: number;
  url: string;
  is_new_today: boolean;
}

export interface DailyReport {
  date: string;
  threat_level: 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  yesterday_threat_level?: 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | null;
  executive_summary: string;
  key_takeaways: string[];
  cves: CveItem[];
  ai_breakthroughs: AiBreakthrough[];
  trending_tools: TrendingTool[];
  tech_news: TechNewsItem[];
}

export interface ArchiveIndexItem {
  date: string;
  threat_level: string;
  yesterday_threat_level?: string | null;
  top_epss?: number | null;
  summary: string;
  cves_count: number;
  ai_count: number;
  tools_count: number;
  news_count: number;
  json_path: string;
  md_path: string;
}
