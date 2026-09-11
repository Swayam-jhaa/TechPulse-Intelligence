import React from 'react';
import { Sparkles, Cpu, ThumbsUp, Download, BookOpen, ExternalLink, Tag } from 'lucide-react';
import { AiBreakthrough, AestheticVariation } from '../types';

interface AiBreakthroughSectionProps {
  items: AiBreakthrough[];
  variation: AestheticVariation;
  onOpenDetail: (item: AiBreakthrough) => void;
}

export const AiBreakthroughSection: React.FC<AiBreakthroughSectionProps> = ({
  items,
  variation,
  onOpenDetail
}) => {
  const isTwilight = variation === 'icarus';

  return (
    <section id="ai-section" className="py-12 px-4 sm:px-6 md:px-8 border-b transition-colors duration-500"
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
              <span>FRONTIER INTELLIGENCE</span>
              <span>•</span>
              <span>THE SOLAR HEIGHTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold tracking-tight"
              style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}
            >
              AI PAPERS &amp; WEIGHTS FRONTIER
            </h2>
          </div>

          <div className="text-xs font-mono text-stone-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>DAILY SYNTHESIS • HUGGING FACE &amp; ARXIV</span>
          </div>
        </div>

        {/* AI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded p-6 flex flex-col justify-between transition-all hover:translate-y-[-2px] shadow-sm"
              style={{
                backgroundColor: isTwilight ? 'rgba(26, 12, 5, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: isTwilight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.12)'
              }}
            >
              <div className="space-y-3">
                {/* Category & Metrics */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded uppercase font-bold tracking-wider"
                    style={{
                      backgroundColor: isTwilight ? '#78350F' : '#FEF3C7',
                      color: isTwilight ? '#FDE68A' : '#92400E',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    {item.category}
                  </span>

                  <div className="flex items-center gap-3 opacity-80">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                      {item.upvotes}
                    </span>
                    {item.downloads && (
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-stone-500" />
                        {item.downloads}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-serif font-bold tracking-tight leading-snug"
                  style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}
                >
                  {item.title}
                </h3>

                {/* Authors */}
                <p className="text-xs font-mono opacity-70">
                  By {item.authorsOrOrg}
                </p>

                {/* Abstract */}
                <p className="text-sm font-sans leading-relaxed opacity-90 line-clamp-3"
                  style={{ color: isTwilight ? '#E2E8F0' : '#334155' }}
                >
                  {item.abstract}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded border opacity-80"
                      style={{
                        borderColor: isTwilight ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                        backgroundColor: isTwilight ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Specs & Links */}
              <div className="pt-5 mt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
                style={{
                  borderColor: isTwilight ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 0, 0, 0.08)'
                }}
              >
                <div className="flex items-center gap-2 text-stone-500">
                  {item.parameters && (
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-amber-600" />
                      {item.parameters}
                    </span>
                  )}
                  {item.license && (
                    <span>• {item.license}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-open-detail-ai-${item.id}`}
                    onClick={() => onOpenDetail(item)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded border hover:opacity-80 transition-opacity"
                    style={{
                      borderColor: isTwilight ? '#F59E0B' : '#1C1917',
                      color: isTwilight ? '#FDE68A' : '#1C1917'
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Abstract</span>
                  </button>
                  {item.huggingfaceUrl && (
                    <a
                      href={item.huggingfaceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-colors"
                    >
                      <span>Weights</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
