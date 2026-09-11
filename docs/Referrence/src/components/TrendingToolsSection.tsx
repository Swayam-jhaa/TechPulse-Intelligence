import React from 'react';
import { Github, Star, GitFork, Code2, ExternalLink, Wrench } from 'lucide-react';
import { TrendingTool, AestheticVariation } from '../types';

interface TrendingToolsSectionProps {
  tools: TrendingTool[];
  variation: AestheticVariation;
  onOpenDetail: (tool: TrendingTool) => void;
}

export const TrendingToolsSection: React.FC<TrendingToolsSectionProps> = ({
  tools,
  variation,
  onOpenDetail
}) => {
  const isTwilight = variation === 'icarus';

  const getLangColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'rust':
        return '#DEA584';
      case 'typescript':
        return '#3178C6';
      case 'go':
        return '#00ADD8';
      case 'c++':
        return '#F34B7D';
      default:
        return '#EAB308';
    }
  };

  return (
    <section id="tools-section" className="py-12 px-4 sm:px-6 md:px-8 border-b transition-colors duration-500"
      style={{
        borderColor: isTwilight ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-4"
          style={{
            borderColor: isTwilight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.15)'
          }}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase mb-1"
              style={{ color: isTwilight ? '#FBBF24' : '#B45309' }}
            >
              <span>OPEN-SOURCE ARSENAL</span>
              <span>•</span>
              <span>THE DAEDALIAN WORKSHOP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold tracking-tight"
              style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}
            >
              TRENDING REPOSITORIES &amp; DEV TOOLS
            </h2>
          </div>

          <div className="text-xs font-mono text-stone-500 flex items-center gap-2">
            <Github className="w-4 h-4 text-stone-900" />
            <span>DAILY VELOCITY FILTER • TOP GROWTH</span>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="border rounded p-6 flex flex-col justify-between transition-all hover:translate-y-[-2px] shadow-sm"
              style={{
                backgroundColor: isTwilight ? 'rgba(28, 13, 6, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: isTwilight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.12)'
              }}
            >
              <div className="space-y-3">
                {/* Repo Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-sm font-bold truncate">
                    <span className="opacity-60">{tool.owner}/</span>
                    <span style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}>{tool.repoName}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      +{tool.starsToday}
                    </span>
                    <span className="flex items-center gap-1 opacity-60">
                      <GitFork className="w-3.5 h-3.5" />
                      {tool.forks}
                    </span>
                  </div>
                </div>

                {/* Primary Use Case Chip */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-medium border"
                  style={{
                    backgroundColor: isTwilight ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.15)',
                    borderColor: isTwilight ? 'rgba(245, 158, 11, 0.3)' : 'rgba(217, 119, 6, 0.25)',
                    color: isTwilight ? '#FDE68A' : '#92400E'
                  }}
                >
                  <Wrench className="w-3 h-3 text-amber-600" />
                  <span>Use Case: {tool.primaryUseCase}</span>
                </div>

                {/* Description */}
                <p className="text-sm font-sans leading-relaxed"
                  style={{ color: isTwilight ? '#CBD5E1' : '#334155' }}
                >
                  {tool.description}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tool.topics.map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded border opacity-70"
                      style={{
                        borderColor: isTwilight ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-4 mt-4 border-t flex items-center justify-between gap-3 text-xs font-mono"
                style={{
                  borderColor: isTwilight ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 0, 0, 0.08)'
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getLangColor(tool.language) }}
                  />
                  <span>{tool.language}</span>
                  <span className="opacity-40">•</span>
                  <span className="opacity-70">{tool.starsTotal.toLocaleString()} total</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded font-mono text-xs font-semibold uppercase tracking-wider transition-all border"
                    style={{
                      backgroundColor: isTwilight ? '#D97706' : '#1C1917',
                      color: isTwilight ? '#1C0D06' : '#FEF3C7',
                      borderColor: isTwilight ? '#F59E0B' : '#1C1917'
                    }}
                  >
                    <span>Inspect Code</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
