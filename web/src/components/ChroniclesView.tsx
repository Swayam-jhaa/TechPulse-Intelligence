"use client";

import React, { useState } from "react";
import { DailyReport, ArchiveIndexItem } from "../types/intelligence";
import { ArrowUpRight, Rss, Calendar, Check, Copy } from "lucide-react";
import { formatDateFriendly } from "../lib/utils";

interface ChroniclesViewProps {
  report: DailyReport;
  archiveIndex: ArchiveIndexItem[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const ChroniclesView: React.FC<ChroniclesViewProps> = ({
  report,
  archiveIndex,
  selectedDate,
  onSelectDate,
}) => {
  const [copiedFeed, setCopiedFeed] = useState<string | null>(null);

  const handleCopy = (url: string, feedName: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedFeed(feedName);
    setTimeout(() => setCopiedFeed(null), 2500);
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
      
      {/* Editorial Header */}
      <div className="border-b border-stone-300 pb-6 space-y-2">
        <div className="font-mono text-xs uppercase tracking-widest text-[#57534E]">
          PAST EDITIONS · ARCHIVE & SYNDICATION
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-stone-900 tracking-tight">
          Past Daily Intelligence Briefings
        </h1>
        <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed max-w-prose">
          Access previous daily editions, subscribe to automated RSS and Atom feeds, or inspect how our daily intelligence pipeline operates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Historical Index (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-300 pb-2 font-mono text-xs uppercase tracking-wider text-[#57534E] font-bold tabular-nums">
            <span>PREVIOUS EDITIONS</span>
            <span>{archiveIndex.length} RECORDED</span>
          </div>

          <div className="space-y-4">
            {archiveIndex.map((entry) => {
              const isSelected = entry.date === selectedDate;
              const friendlyEntryDate = formatDateFriendly(entry.date);

              return (
                <div
                  key={entry.date}
                  tabIndex={0}
                  role="button"
                  onClick={() => onSelectDate(entry.date)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectDate(entry.date);
                    }
                  }}
                  className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer space-y-3 card-hover-glow shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
                    isSelected
                      ? "bg-white border-stone-900 shadow-md ring-1 ring-stone-900"
                      : "bg-white/60 hover:bg-white border-stone-300/80"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs tabular-nums">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-600" aria-hidden="true" />
                      <span className="font-bold text-stone-900 font-sans text-sm">{friendlyEntryDate}</span>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                        entry.threat_level === "CRITICAL"
                          ? "bg-red-50 text-red-800 border-red-200"
                          : "bg-stone-200/70 text-stone-700 border-stone-300"
                      }`}
                    >
                      Security: {entry.threat_level}
                    </span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed line-clamp-2 max-w-prose">
                    {entry.summary}
                  </p>

                  <div className="flex items-center justify-between font-mono text-[11px] text-[#57534E] pt-1 tabular-nums border-t border-stone-200/60">
                    <span className="text-[10px]">
                      {entry.cves_count} ADVISORIES · {entry.ai_count} PAPERS · {entry.tools_count} TOOLS
                    </span>
                    <span className={`font-bold uppercase text-[10px] ${isSelected ? "text-stone-900 underline" : "text-stone-600 group-hover:text-stone-900"}`}>
                      {isSelected ? "CURRENTLY VIEWING" : "READ BRIEFING →"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Syndication & Pipeline Details (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Syndication Feeds Card */}
          <div className="p-6 rounded-2xl border border-stone-300/90 bg-white/70 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Rss className="w-4 h-4 text-stone-900" aria-hidden="true" />
              <div className="font-mono text-xs uppercase tracking-wider text-stone-900 font-bold">
                SUBSCRIBE VIA RSS OR ATOM
              </div>
            </div>

            <p className="font-sans text-xs text-stone-700 leading-relaxed">
              Add TechPulse to your favorite feed reader (Feedly, Inoreader, Apple News, Slack, or webhook automation).
            </p>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-stone-100/70">
                <div>
                  <div className="font-bold text-stone-900">RSS 2.0 Feed</div>
                  <div className="text-[10px] text-stone-500">/data/rss.xml</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy("/data/rss.xml", "RSS")}
                    className="p-1.5 rounded hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
                    title="Copy URL"
                  >
                    {copiedFeed === "RSS" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href="/data/rss.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
                    title="Open RSS feed"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-stone-200 bg-stone-100/70">
                <div>
                  <div className="font-bold text-stone-900">Atom Feed</div>
                  <div className="text-[10px] text-stone-500">/data/feed.xml</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy("/data/feed.xml", "Atom")}
                    className="p-1.5 rounded hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
                    title="Copy URL"
                  >
                    {copiedFeed === "Atom" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href="/data/feed.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
                    title="Open Atom feed"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Autonomous Pipeline Details Card */}
          <div className="p-6 rounded-2xl border border-stone-300/90 bg-white/70 shadow-xs space-y-4 font-mono text-xs">
            <div className="font-bold text-stone-900 uppercase tracking-wide">
              HOW TECHPULSE WORKS
            </div>

            <p className="font-sans text-xs text-stone-600 leading-relaxed font-normal">
              An autonomous intelligence engine that aggregates, enriches, and synthesizes global tech signals every single morning.
            </p>

            <div className="space-y-2 text-[11px] leading-relaxed tabular-nums">
              <div className="flex justify-between border-b border-stone-200 py-1.5">
                <span className="text-[#57534E]">RUN SCHEDULE:</span>
                <span className="font-semibold text-stone-900">04:15 UTC Daily</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 py-1.5">
                <span className="text-[#57534E]">ORGANIC JITTER:</span>
                <span className="font-semibold text-stone-900">15m – 120m Random Window</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 py-1.5">
                <span className="text-[#57534E]">SYNTHESIS ENGINE:</span>
                <span className="font-semibold text-stone-900">Google Gemini 2.5 Pro</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 py-1.5">
                <span className="text-[#57534E]">EXPLOIT FORECAST:</span>
                <span className="font-semibold text-stone-900">FIRST.org EPSS API</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 py-1.5">
                <span className="text-[#57534E]">MAINTAINER:</span>
                <span className="font-semibold text-stone-900">Swayam Jha</span>
              </div>
            </div>
          </div>

          {/* Turing Quotation */}
          <div className="p-6 rounded-2xl border border-stone-300/80 bg-stone-100/60 space-y-2">
            <p className="font-serif italic text-sm text-stone-800 leading-relaxed">
              &ldquo;We can only see a short distance ahead, but we can see plenty there that needs to be done.&rdquo;
            </p>
            <div className="font-mono text-[10px] uppercase text-[#57534E] font-semibold">
              — Alan Turing (1950)
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

