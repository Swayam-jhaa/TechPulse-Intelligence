export type AestheticVariation = 'echoes' | 'solar' | 'icarus';

export type ThreatLevel = 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface CveItem {
  id: string;
  cveId: string;
  title: string;
  vendor: string;
  product: string;
  cvssScore: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isCisaKev: boolean;
  exploitationStatus: 'Active In-The-Wild' | 'Weaponized POC' | 'Proof of Concept' | 'Theoretical';
  description: string;
  remediation: string;
  cisaActionDue?: string;
  dateAdded: string;
}

export interface AiBreakthrough {
  id: string;
  title: string;
  category: 'research' | 'model' | 'agent' | 'architecture';
  authorsOrOrg: string;
  abstract: string;
  arxivUrl?: string;
  huggingfaceUrl?: string;
  upvotes: number;
  downloads?: string;
  parameters?: string;
  license?: string;
  tags: string[];
}

export interface TrendingTool {
  id: string;
  repoName: string;
  owner: string;
  description: string;
  language: string;
  starsTotal: number;
  starsToday: number;
  forks: number;
  primaryUseCase: string;
  topics: string[];
  url: string;
}

export interface TechNewsItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  points: number;
  commentsCount: number;
  author: string;
  sentiment: 'critical' | 'architectural' | 'breakthrough' | 'neutral';
  summary: string;
  category: string;
}

export interface DailyReport {
  date: string;
  generatedAt: string;
  threatLevel: ThreatLevel;
  defconLevel: number; // 1 to 5
  activeExploitsCount: number;
  modelReleasesCount: number;
  reposTrendingCount: number;
  executiveOverview: string[];
  keyTakeaways: string[];
  developerImpact: string;
  cves: CveItem[];
  aiBreakthroughs: AiBreakthrough[];
  trendingTools: TrendingTool[];
  newsItems: TechNewsItem[];
}
