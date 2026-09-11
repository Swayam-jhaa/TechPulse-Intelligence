"use client";

import React, { useState, useMemo } from "react";
import { DailyReport } from "../types/intelligence";
import { Search, ArrowUpRight, X, Sparkles, Code2, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { ModalPayload } from "./DetailModal";
import { formatDateFriendly } from "../lib/utils";

interface RadarViewProps {
  report: DailyReport;
  onOpenModal: (payload: ModalPayload) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({ report, onOpenModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "ai" | "tools" | "cve">("all");

  const friendlyDate = formatDateFriendly(report.date);

  const filteredCves = useMemo(() => {
    if (activeFilter !== "all" && activeFilter !== "cve") return [];
    return report.cves.filter(
      (c) =>
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [report.cves, searchQuery, activeFilter]);

  const filteredAi = useMemo(() => {
    if (activeFilter !== "all" && activeFilter !== "ai") return [];
    return report.ai_breakthroughs.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.why_it_matters.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [report.ai_breakthroughs, searchQuery, activeFilter]);

  const filteredTools = useMemo(() => {
    if (activeFilter !== "all" && activeFilter !== "tools") return [];
    return report.trending_tools.filter(
      (t) =>
        t.repo_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.language.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [report.trending_tools, searchQuery, activeFilter]);

  const totalResults = filteredAi.length + filteredTools.length + filteredCves.length;

  const filterTabs = [
    { id: "all", label: "All Items", count: report.ai_breakthroughs.length + report.trending_tools.length + report.cves.length },
    { id: "ai", label: "AI Research", count: report.ai_breakthroughs.length },
    { id: "tools", label: "Developer Tools", count: report.trending_tools.length },
    { id: "cve", label: "Security Alerts", count: report.cves.length },
  ] as const;

  return (
    <div className="pt-24 pb-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
      
      {/* Editorial Header */}
      <div className="border-b border-stone-300 pb-6 space-y-2">
        <div className="font-mono text-xs uppercase tracking-widest text-[#57534E] tabular-nums">
          EXPLORE & DISCOVER · {friendlyDate.toUpperCase()}
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-stone-900 tracking-tight">
          Frontier AI, Open Source & Security
        </h1>
        <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed max-w-prose">
          A comprehensive daily catalog of breakthrough research papers, trending open-source tools, and critical security advisories.
        </p>
      </div>

      {/* Clean Minimal Search & Filter Bar with Shadcn/Uiverse styling */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-stone-300 pb-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <input
            type="text"
            aria-label="Search intelligence by keyword, title, tool, or CVE"
            placeholder="Search papers, open source tools, or security advisories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-stone-100/80 rounded-xl font-sans text-sm text-stone-900 placeholder:text-stone-400 border border-stone-300 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Animated Segmented Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 border border-stone-300/80 rounded-xl overflow-x-auto">
          {filterTabs.map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`relative px-3 py-1.5 rounded-lg font-sans text-xs font-medium transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
                  active ? "text-stone-900 font-bold" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-lg bg-white shadow-xs"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full tabular-nums ${active ? "bg-stone-900 text-stone-100" : "bg-stone-300/80 text-stone-700"}`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* SECTION 1: AI RESEARCH & PAPERS */}
      {filteredAi.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-stone-300 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-stone-700" aria-hidden="true" />
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
                AI Research & Open Weights
              </h2>
            </div>
            <span className="font-mono text-xs text-[#57534E] tabular-nums">
              {filteredAi.length} PAPERS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAi.map((ai, idx) => (
              <article
                key={idx}
                tabIndex={0}
                role="button"
                onClick={() => onOpenModal({ type: "ai", item: ai })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenModal({ type: "ai", item: ai });
                  }
                }}
                className="p-5 rounded-xl border border-stone-300/80 bg-white/70 hover:bg-white space-y-3 cursor-pointer group card-hover-glow transition-all duration-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-[#57534E] tabular-nums">
                  <span className="font-bold text-stone-800 bg-stone-200/70 px-2 py-0.5 rounded text-[10px] uppercase">
                    {ai.category}
                  </span>
                  <span className="font-semibold text-stone-700">▲ {ai.upvotes_or_likes.toLocaleString()} Community Upvotes</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900 group-hover:text-stone-700 leading-snug flex items-start justify-between gap-2">
                  <span>{ai.title}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1" aria-hidden="true" />
                </h3>

                <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed max-w-prose">
                  {ai.summary}
                </p>

                <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-3 text-xs text-stone-800">
                  <strong className="font-mono text-[10px] uppercase text-amber-900 block mb-0.5 font-bold">
                    KEY TAKEAWAY & IMPACT:
                  </strong>
                  <span className="italic">{ai.why_it_matters}</span>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>Click card to inspect full research details</span>
                  <span className="font-semibold text-stone-800 group-hover:underline">View Summary →</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: DEVELOPER TOOLS */}
      {filteredTools.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-baseline justify-between border-b border-stone-300 pb-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-stone-700" aria-hidden="true" />
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
                Trending Developer Tools & Libraries
              </h2>
            </div>
            <span className="font-mono text-xs text-[#57534E] tabular-nums">
              {filteredTools.length} REPOSITORIES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTools.map((tool, idx) => (
              <article
                key={idx}
                tabIndex={0}
                role="button"
                onClick={() => onOpenModal({ type: "tool", item: tool })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenModal({ type: "tool", item: tool });
                  }
                }}
                className="p-5 rounded-xl border border-stone-300/80 bg-white/70 hover:bg-white space-y-3 cursor-pointer group card-hover-glow transition-all duration-200 shadow-xs flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between font-mono text-[11px] text-[#57534E] tabular-nums">
                    <span className="font-bold text-stone-800 bg-stone-200/70 px-2 py-0.5 rounded text-[10px] uppercase">
                      {tool.language || "SOFTWARE"}
                    </span>
                    <span className="font-bold text-stone-900">★ {tool.stars.toLocaleString()}</span>
                  </div>

                  <h3 className="font-mono text-base font-bold text-stone-900 group-hover:text-stone-700 leading-snug flex items-start justify-between gap-2">
                    <span>{tool.repo_name}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-0.5" aria-hidden="true" />
                  </h3>

                  <p className="font-sans text-xs text-stone-700 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="bg-stone-100/90 rounded-lg p-2.5 text-xs text-stone-700 font-sans">
                    <span className="font-mono text-[10px] uppercase font-bold text-stone-600 block mb-0.5">
                      BEST USED FOR:
                    </span>
                    {tool.use_case}
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-1">
                    <span>Open Source</span>
                    <span className="font-semibold text-stone-800 group-hover:underline">Repository Details →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: SECURITY ADVISORIES */}
      {filteredCves.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-baseline justify-between border-b border-stone-300 pb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-stone-700" aria-hidden="true" />
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
                  Security Advisories & Vulnerabilities
                </h2>
                <p className="text-stone-500 text-xs mt-0.5 font-sans">
                  Enriched with FIRST.org EPSS exploit probability forecasting.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-[#57534E] tabular-nums">
              {filteredCves.length} ADVISORIES
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredCves.map((cve, idx) => {
              const epssPercent = cve.epss_score !== null && cve.epss_score !== undefined
                ? (cve.epss_score * 100).toFixed(1)
                : null;
              
              const isHighExploit = cve.epss_score && cve.epss_score >= 0.5;
              const isModerateExploit = cve.epss_score && cve.epss_score >= 0.1 && cve.epss_score < 0.5;

              return (
                <article
                  key={idx}
                  tabIndex={0}
                  role="button"
                  onClick={() => onOpenModal({ type: "cve", item: cve })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenModal({ type: "cve", item: cve });
                    }
                  }}
                  className="p-5 rounded-xl border border-stone-300/80 bg-white/70 hover:bg-white space-y-3 cursor-pointer group card-hover-glow transition-all duration-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs tabular-nums">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 bg-stone-200/80 px-2 py-0.5 rounded text-[11px]">
                        {cve.id}
                      </span>
                      <span className="text-stone-600 text-[11px] font-sans">
                        {cve.vendor} / {cve.product}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {epssPercent && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                            isHighExploit
                              ? "bg-red-100/90 text-red-900 border-red-300"
                              : isModerateExploit
                              ? "bg-amber-100/90 text-amber-900 border-amber-300"
                              : "bg-stone-200/70 text-stone-800 border-stone-300"
                          }`}
                        >
                          Exploit Risk: {epssPercent}% {isHighExploit ? "· High" : isModerateExploit ? "· Moderate" : "· Low"}
                        </span>
                      )}
                      <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px] uppercase">
                        {cve.severity}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 group-hover:text-stone-700 leading-snug flex items-start justify-between gap-2">
                    <span>{cve.title}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-0.5" aria-hidden="true" />
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed line-clamp-2 max-w-prose">
                    {cve.description}
                  </p>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>Affected: {cve.vendor} {cve.product}</span>
                    <span className="font-semibold text-stone-800 group-hover:underline">Remediation Guide →</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty State */}
      {totalResults === 0 && (
        <div className="text-center py-16 border border-stone-300/80 bg-white/40 rounded-2xl space-y-3">
          <p className="font-serif text-xl text-stone-800">No items found matching &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
            className="font-mono text-xs text-stone-900 underline underline-offset-4 hover:text-stone-600 uppercase font-semibold"
          >
            Clear search filter
          </button>
        </div>
      )}

    </div>
  );
};

