import React, { useState } from 'react';
import { Shield, AlertOctagon, Terminal, Copy, Check, Sparkles, Cpu, ExternalLink, ArrowUpRight, Github, Star } from 'lucide-react';
import { DailyReport, CveItem, AiBreakthrough, TrendingTool } from '../types';

interface RadarViewProps {
  report: DailyReport;
  onOpenCve: (cve: CveItem) => void;
  onOpenAi: (ai: AiBreakthrough) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({
  report,
  onOpenCve,
  onOpenAi
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cves' | 'ai' | 'tools'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-12 select-none"
      style={{
        // Intensity increase across the page: starts in stone grey and transitions toward deep slate
        background: 'linear-gradient(145deg, #CCCAC3 0%, #B8B5AC 40%, #8E8B83 75%, #302F33 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Editorial Header */}
        <div className="border-b border-[#252422]/25 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-[#161517]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#3F3D38] mb-1">
              <span>SECTION 02 // INTELLIGENCE RADAR</span>
              <span>•</span>
              <span>DEFCON PROTOCOL 0{report.defconLevel}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#111113] uppercase">
              THREAT RADAR &amp; FRONTIER
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {[
              { id: 'all', label: 'COMPLETE DOSSIER' },
              { id: 'cves', label: `KEV EXPLOITS (${report.cves.length})` },
              { id: 'ai', label: `AI PAPERS (${report.aiBreakthroughs.length})` },
              { id: 'tools', label: `TOOLS (${report.trendingTools.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`px-3 py-1.5 rounded-none font-bold uppercase transition-all ${
                  activeFilter === tab.id
                    ? 'bg-[#111113] text-[#F4F3EE] shadow-sm'
                    : 'bg-white/60 text-[#2C2A28] hover:bg-white border border-[#2C2A28]/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Executive Situation Bar */}
        <div className="bg-white/80 border border-[#252422]/20 p-5 rounded-none shadow-sm backdrop-blur-xs space-y-3 text-[#1C1B19]">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs border-b border-stone-300 pb-2">
            <span className="font-bold flex items-center gap-1.5 text-[#111113]">
              <Shield className="w-4 h-4 text-red-700" />
              SITUATION REPORT // CYCLE {report.date}
            </span>
            <span className="text-[11px] text-stone-600">
              STATUS: <strong className="text-red-700 font-bold">{report.threatLevel}</strong> • {report.activeExploitsCount} EXPLOITED ZERO-DAYS
            </span>
          </div>

          <p className="text-sm font-sans leading-relaxed text-[#2A2825]">
            {report.executiveOverview[0]}
          </p>

          <div className="pt-1 text-xs font-mono text-[#4A4742] flex flex-wrap items-center justify-between gap-2">
            <span>IMPACT: {report.developerImpact}</span>
          </div>
        </div>

        {/* CVE Section */}
        {(activeFilter === 'all' || activeFilter === 'cves') && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#252422] border-b border-[#252422]/20 pb-2">
              <span className="font-bold tracking-wider uppercase">
                KNOWN EXPLOITED VULNERABILITIES (KEV) // THE MELTED WAX
              </span>
              <span className="text-[11px] opacity-70">MANDATORY CISA DIRECTIVES</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {report.cves.map((cve) => {
                const isCritical = cve.severity === 'CRITICAL';
                return (
                  <div
                    key={cve.id}
                    className="border bg-white/85 border-[#222120]/25 p-5 shadow-xs transition-all hover:bg-white space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="bg-[#111113] text-white px-2 py-0.5 font-bold tracking-wider">
                          {cve.cveId}
                        </span>
                        {cve.isCisaKev && (
                          <span className="bg-red-700 text-white px-2 py-0.5 font-bold flex items-center gap-1 text-[10px]">
                            <AlertOctagon className="w-3 h-3" />
                            CISA KEV ACTIVE
                          </span>
                        )}
                        <span className={`px-2 py-0.5 font-bold text-[11px] ${
                          isCritical ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          CVSS {cve.cvssScore} • {cve.severity}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-[#555]">
                        Vendor: <strong className="text-[#111]">{cve.vendor}</strong> ({cve.product})
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#111113] leading-snug">
                        {cve.title}
                      </h3>
                      <p className="text-sm font-sans text-[#333] leading-relaxed pt-1">
                        {cve.description}
                      </p>
                    </div>

                    {/* Remediation Code */}
                    <div className="bg-[#19191B] text-[#F3F2EE] p-3 font-mono text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[#E0DDD5] text-[11px]">
                        <span className="flex items-center gap-1 font-bold">
                          <Terminal className="w-3.5 h-3.5 text-amber-400" />
                          PATCH INSTRUCTION
                        </span>
                        <button
                          onClick={() => handleCopy(cve.remediation, cve.id)}
                          className="flex items-center gap-1 hover:text-white cursor-pointer"
                        >
                          {copiedId === cve.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy CLI</span>
                            </>
                          )}
                        </button>
                      </div>
                      <code className="block text-stone-300 text-xs overflow-x-auto whitespace-pre-wrap">
                        {cve.remediation}
                      </code>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs font-mono text-stone-600">
                      <span>Status: <strong className="text-stone-900">{cve.exploitationStatus}</strong></span>
                      <button
                        onClick={() => onOpenCve(cve)}
                        className="flex items-center gap-1 text-stone-900 font-bold hover:underline"
                      >
                        <span>Examine Full Dossier</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Section */}
        {(activeFilter === 'all' || activeFilter === 'ai') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#252422] border-b border-[#252422]/20 pb-2">
              <span className="font-bold tracking-wider uppercase">
                FRONTIER AI PAPERS &amp; WEIGHTS // THE RADIANT SUN
              </span>
              <span className="text-[11px] opacity-70">HUGGING FACE &amp; ARXIV</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.aiBreakthroughs.map((ai) => (
                <div
                  key={ai.id}
                  className="border bg-white/85 border-[#222120]/25 p-5 shadow-xs transition-all hover:bg-white flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="bg-[#111113] text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {ai.category}
                      </span>
                      {ai.parameters && (
                        <span className="flex items-center gap-1 font-bold text-stone-700">
                          <Cpu className="w-3 h-3 text-stone-900" />
                          {ai.parameters}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-serif font-bold text-[#111113] leading-snug">
                      {ai.title}
                    </h3>

                    <p className="text-xs font-mono text-stone-600">
                      By {ai.authorsOrOrg}
                    </p>

                    <p className="text-xs sm:text-sm font-sans text-stone-800 leading-relaxed line-clamp-3">
                      {ai.abstract}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={() => onOpenAi(ai)}
                      className="font-bold text-stone-900 hover:underline flex items-center gap-1"
                    >
                      <span>Read Abstract</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {ai.huggingfaceUrl && (
                      <a
                        href={ai.huggingfaceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#111113] text-white px-2.5 py-1 font-bold uppercase text-[10px] flex items-center gap-1 hover:bg-stone-800"
                      >
                        <span>Weights</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools Section */}
        {(activeFilter === 'all' || activeFilter === 'tools') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#252422] border-b border-[#252422]/20 pb-2">
              <span className="font-bold tracking-wider uppercase">
                OPEN-SOURCE ARSENAL // THE DAEDALIAN WORKSHOP
              </span>
              <span className="text-[11px] opacity-70">GITHUB VELOCITY</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.trendingTools.map((tool) => (
                <div
                  key={tool.id}
                  className="border bg-white/85 border-[#222120]/25 p-5 shadow-xs transition-all hover:bg-white flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#111113]">
                        <Github className="w-3.5 h-3.5" />
                        <span>{tool.owner}/{tool.repoName}</span>
                      </div>
                      <span className="flex items-center gap-1 text-amber-700 font-bold">
                        <Star className="w-3 h-3 fill-amber-600 text-amber-600" />
                        +{tool.starsToday}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-stone-600">
                      Use Case: <strong className="text-stone-900">{tool.primaryUseCase}</strong>
                    </p>

                    <p className="text-xs sm:text-sm font-sans text-stone-800 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-600">{tool.language} • {tool.starsTotal.toLocaleString()} stars</span>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-stone-900 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
