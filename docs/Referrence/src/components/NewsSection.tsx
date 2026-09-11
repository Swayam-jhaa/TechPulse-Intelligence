import React from 'react';
import { Newspaper, MessageSquare, ExternalLink, ArrowUp } from 'lucide-react';
import { TechNewsItem, AestheticVariation } from '../types';

interface NewsSectionProps {
  items: TechNewsItem[];
  variation: AestheticVariation;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ items, variation }) => {
  const isTwilight = variation === 'icarus';

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'critical':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.4)' };
      case 'architectural':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.4)' };
      case 'breakthrough':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.4)' };
      default:
        return { bg: 'rgba(100, 116, 139, 0.15)', text: '#64748B', border: 'rgba(100, 116, 139, 0.4)' };
    }
  };

  return (
    <section id="news-section" className="py-12 px-4 sm:px-6 md:px-8 border-b transition-colors duration-500"
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
              <span>ARCHITECTURAL DISCOURSE</span>
              <span>•</span>
              <span>THE ECHOES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold tracking-tight"
              style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}
            >
              DISCUSSIONS, POSTMORTEMS &amp; ESSAYS
            </h2>
          </div>

          <div className="text-xs font-mono text-stone-500 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-stone-700" />
            <span>COMMUNITY SIGNAL • PEER-REVIEWED</span>
          </div>
        </div>

        {/* News Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((news) => {
            const badge = getSentimentBadge(news.sentiment);
            return (
              <div
                key={news.id}
                className="border rounded p-5 flex flex-col justify-between transition-all hover:translate-y-[-1px] shadow-sm"
                style={{
                  backgroundColor: isTwilight ? 'rgba(28, 13, 6, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: isTwilight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.12)'
                }}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span
                      className="px-2 py-0.5 rounded uppercase font-bold text-[10px] tracking-wider border"
                      style={{
                        backgroundColor: badge.bg,
                        color: badge.text,
                        borderColor: badge.border
                      }}
                    >
                      {news.category}
                    </span>

                    <span className="opacity-60">{news.domain}</span>
                  </div>

                  <a
                    href={news.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block group"
                  >
                    <h3 className="text-base sm:text-lg font-serif font-bold tracking-tight group-hover:underline leading-snug"
                      style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}
                    >
                      {news.title}
                    </h3>
                  </a>

                  <p className="text-xs sm:text-sm font-sans leading-relaxed opacity-85"
                    style={{ color: isTwilight ? '#CBD5E1' : '#334155' }}
                  >
                    {news.summary}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t flex items-center justify-between text-xs font-mono opacity-75"
                  style={{
                    borderColor: isTwilight ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-amber-600">
                      <ArrowUp className="w-3.5 h-3.5" />
                      {news.points}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {news.commentsCount}
                    </span>
                    <span className="hidden sm:inline">by @{news.author}</span>
                  </div>

                  <a
                    href={news.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline"
                    style={{ color: isTwilight ? '#FBBF24' : '#1C1917' }}
                  >
                    <span>Read Discussion</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
