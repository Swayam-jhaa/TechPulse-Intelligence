"use client";

import React from "react";
import { DailyReport } from "../types/intelligence";
import { HeroDavid3D } from "./HeroDavid3D";
import {
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  Layers,
  Activity,
  Radio,
  Terminal,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatDateFriendly } from "../lib/utils";

interface DispatchViewProps {
  report: DailyReport;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onExplore: () => void;
}

export const DispatchView: React.FC<DispatchViewProps> = ({
  report,
  isAudioPlaying,
  onToggleAudio,
  onExplore,
}) => {
  const leadStory = report.tech_news[0];
  const secondaryStories = report.tech_news.slice(1);
  const friendlyDate = formatDateFriendly(report.date);

  const takeawayIcons = [ShieldCheck, Cpu, Sparkles, Layers, Activity, Radio];

  return (
    <div
      className="space-y-0 pb-24 select-none"
      style={{
        background: "linear-gradient(180deg, #E4E1D8 0%, #DFDCD2 50%, #D8D4CA 100%)",
      }}
    >
      {/* 1. Serene Classical Hero (Shaded Top) */}
      <HeroDavid3D
        report={report}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={onToggleAudio}
      />

      {/* 2. Editorial Broadsheet: Today's Briefing */}
      <article className="max-w-5xl mx-auto px-4 sm:px-8 pt-12 pb-14 space-y-10">
        
        {/* Newspaper Masthead Line */}
        <div className="border-t-2 border-b border-stone-900 py-2.5 flex items-center justify-between text-xs font-mono tracking-widest text-stone-700 uppercase tabular-nums">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-stone-900" />
            <span className="font-bold text-stone-900">DAILY EDITION · {friendlyDate.toUpperCase()}</span>
          </div>
          <span className="font-semibold text-stone-800 hidden sm:inline">AUTONOMOUS TECH & CYBER INTELLIGENCE</span>
          <span>STATUS: <strong className="text-stone-900">{report.threat_level}</strong></span>
        </div>

        {/* Lead Headline & Curated Intelligence Proposal */}
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-400/60 pb-5">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-stone-600 font-bold mb-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-900" />
                <span>EXECUTIVE SITUATION REPORT</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl text-stone-950 font-semibold tracking-tight leading-tight">
                Today&apos;s Briefing
              </h1>
            </div>

            {/* Signal Telemetry Pills */}
            <div className="flex items-center gap-2.5 font-mono text-[10px] text-stone-700">
              <span className="flex items-center gap-1.5 bg-stone-100/90 px-3 py-1.5 rounded-full border border-stone-300 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-700" strokeWidth={2} />
                <span className="font-semibold">15 SOURCES VERIFIED</span>
              </span>
              <span className="flex items-center gap-1.5 bg-stone-100/90 px-3 py-1.5 rounded-full border border-stone-300 shadow-xs hidden sm:flex">
                <Clock className="w-3.5 h-3.5 text-stone-600" />
                <span>~3 MIN READ</span>
              </span>
            </div>
          </div>

          {/* High-Impact Executive Verdict Lead Banner */}
          <div className="border-l-4 border-stone-900 bg-white/80 p-6 sm:p-7 rounded-r-2xl shadow-sm border-t border-r border-b border-stone-300/80">
            <div className="flex items-center justify-between gap-4 mb-2 font-mono text-[10px] tracking-widest text-stone-600 uppercase font-bold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-900" />
                <span>PRIMARY VERDICT // ESCALATION TO HIGH</span>
              </span>
              <span className="hidden sm:inline text-stone-500">
                CYCLE 2026.09
              </span>
            </div>
            <p className="font-serif italic text-lg sm:text-2xl text-stone-950 leading-relaxed font-medium">
              &ldquo;The overall threat posture escalates to <span className="text-stone-950 font-bold not-italic underline decoration-stone-400 underline-offset-4">HIGH</span> today due to critical zero-day vulnerabilities in API frameworks and telephony appliances, alongside historic wafer-scale breakthroughs in open-weight foundation models.&rdquo;
            </p>
          </div>

          {/* 3 Thematic Dispatch Pillars (Structured Breakdown so readers actually care) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Pillar 1: Infrastructure & Vulnerabilities */}
            <div className="flex flex-col justify-between p-5 rounded-xl border border-stone-300/80 bg-white/70 backdrop-blur-xs shadow-[0_10px_25px_-5px_rgba(40,30,20,0.05),inset_0_1px_0_0_rgba(255,255,255,0.7)] space-y-4 hover:-translate-y-[1px] transition-all duration-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-stone-900 bg-stone-200/80 px-2 py-0.5 rounded border border-stone-300">
                    EXPLOIT CLIMATE
                  </span>
                  <span className="font-mono text-[10px] text-stone-500">01</span>
                </div>
                <h2 className="font-serif text-lg font-semibold text-stone-900 leading-snug">
                  Supply-Chain & API Zero-Days
                </h2>
                <p className="font-sans text-xs text-stone-700 leading-relaxed">
                  Critical exposure identified in Sangoma Switchvox (CVE-2026-9586, EPSS 11.85%) and Kludex Starlette (CVE-2026-48710, EPSS 11.04%). Default JFrog Artifactory instances permit unauthenticated network takeovers via CVE-2026-82329.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-200 font-mono text-[10px] text-stone-800 bg-stone-100/90 p-2 rounded border border-stone-200">
                <strong>DIRECTIVE:</strong> Patch build engines and review Starlette host header proxy reconstruction.
              </div>
            </div>

            {/* Pillar 2: Foundation Models & Compute */}
            <div className="flex flex-col justify-between p-5 rounded-xl border border-stone-300/80 bg-white/70 backdrop-blur-xs shadow-[0_10px_25px_-5px_rgba(40,30,20,0.05),inset_0_1px_0_0_rgba(255,255,255,0.7)] space-y-4 hover:-translate-y-[1px] transition-all duration-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-stone-900 bg-stone-200/80 px-2 py-0.5 rounded border border-stone-300">
                    COMPUTE & WEIGHTS
                  </span>
                  <span className="font-mono text-[10px] text-stone-500">02</span>
                </div>
                <h2 className="font-serif text-lg font-semibold text-stone-900 leading-snug">
                  Wafer-Scale Inference & Local Adapters
                </h2>
                <p className="font-sans text-xs text-stone-700 leading-relaxed">
                  Zhipu AI and Qwen shipped GLM-5.3 and Qwen3.8-27B. Meanwhile, Cerebras achieved a landmark 1,500 tokens/second wafer-scale inference rate, and &apos;Compile by Training&apos; demonstrated compiling natural language directly into neural adapters.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-200 font-mono text-[10px] text-stone-800 bg-stone-100/90 p-2 rounded border border-stone-200">
                <strong>BENCHMARK:</strong> 1,500 tok/sec throughput on wafer engines dramatically lowers agent latency.
              </div>
            </div>

            {/* Pillar 3: Developer Ecosystem & Tooling */}
            <div className="flex flex-col justify-between p-5 rounded-xl border border-stone-300/80 bg-white/70 backdrop-blur-xs shadow-[0_10px_25px_-5px_rgba(40,30,20,0.05),inset_0_1px_0_0_rgba(255,255,255,0.7)] space-y-4 hover:-translate-y-[1px] transition-all duration-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-stone-800 bg-stone-200/80 px-2 py-0.5 rounded border border-stone-300/80">
                    ECOSYSTEM VELOCITY
                  </span>
                  <span className="font-mono text-[10px] text-stone-500">03</span>
                </div>
                <h2 className="font-serif text-lg font-semibold text-stone-900 leading-snug">
                  Deterministic Verification & Class Merging
                </h2>
                <p className="font-sans text-xs text-stone-700 leading-relaxed">
                  Shadcn-ui published &apos;cn&apos;, delivering a 30x faster drop-in replacement engine for Tailwind CSS merging. OpenAI officially confirmed GPT-6 Astra, while Reverify introduced deterministic byte verification for binary security analysis.
                </p>
              </div>
              <div className="pt-2 border-t border-stone-200 font-mono text-[10px] text-stone-800 bg-stone-100/80 p-2 rounded border border-stone-200">
                <strong>UPGRADE:</strong> Evaluate shadcn-ui/cn for front-end bundle rendering speedups.
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Signals: Curated Intelligence */}
        <div className="border-t border-stone-400/60 pt-8 space-y-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-mono text-[11px] tracking-widest uppercase text-stone-900 font-bold flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-stone-900" strokeWidth={1.5} />
                <span>STRATEGIC SIGNALS FOR TODAY</span>
              </div>
              <p className="text-stone-700 text-xs mt-1 max-w-[65ch]">
                Distilled intelligence from today&apos;s vulnerability disclosures, architecture dispatches, and compute benchmarks.
              </p>
            </div>
            <span className="font-mono text-[10px] text-stone-600 uppercase tracking-wider">
              4 CORE SIGNALS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.key_takeaways.map((takeaway, idx) => {
              const IconComponent = takeawayIcons[idx % takeawayIcons.length];
              const categories = [
                { cat: "CRITICAL VULNERABILITY", pill: "HIGH SEVERITY" },
                { cat: "AI HARDWARE & INFERENCE", pill: "1,500 TOK/S" },
                { cat: "FRONT-END TOOLING", pill: "30x SPEEDUP" },
                { cat: "FRONTIER ARCHITECTURE", pill: "ANNOUNCED" },
              ][idx % 4];

              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-5 rounded-xl border border-stone-300/80 bg-white/75 hover:bg-white shadow-[0_8px_20px_-6px_rgba(40,30,20,0.04),inset_0_1px_0_0_rgba(255,255,255,0.85)] hover:shadow-[0_12px_28px_-6px_rgba(40,30,20,0.08),inset_0_1px_0_0_rgba(255,255,255,0.95)] hover:-translate-y-[1px] active:scale-[0.99] active:translate-y-0 transition-all duration-200 group"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg border border-stone-300/80 bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-stone-100 transition-colors">
                          <IconComponent className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                        </div>
                        <div>
                          <div className="font-mono text-[9px] tracking-wider uppercase text-stone-500 font-semibold">
                            {categories.cat}
                          </div>
                          <span className="font-mono text-xs font-bold text-stone-900 tracking-wider">
                            SIGNAL 0{idx + 1}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded bg-stone-100/90 text-stone-800 font-semibold border border-stone-300">
                        {categories.pill}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-stone-800 leading-relaxed pt-3">
                      {takeaway.replace(/Security posture elevates to HIGH/i, "Threat posture shifts to HIGH")}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-stone-200/70 flex items-center justify-between font-mono text-[9px] text-stone-500 uppercase">
                    <span>STATUS: VERIFIED</span>
                    <span className="text-stone-700 font-semibold">ACTIONABLE SIGNAL</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </article>

      {/* 3. Tech News Section: Polished Interactive Editorial Cards */}
      <section className="border-t border-stone-400/60 bg-gradient-to-b from-black/[0.03] to-black/[0.10] py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="flex items-baseline justify-between border-b border-stone-400/60 pb-3">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-semibold">
                Top Tech Stories & Industry Shifts
              </h2>
              <p className="font-sans text-xs text-stone-600 mt-1">
                Highest-ranked community discussions and critical technology breakthroughs.
              </p>
            </div>

            <button
              onClick={onExplore}
              className="font-mono text-xs text-stone-700 hover:text-stone-950 uppercase tracking-wider font-semibold flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 bg-white/80 hover:bg-white transition-all shadow-xs active:scale-[0.97] active:-translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
            >
              <span>Explore All Stories & Tools</span>
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          {/* Lead Story Feature Card */}
          {leadStory && (
            <div className="rounded-2xl border border-stone-300/80 bg-white/75 backdrop-blur-xs p-6 sm:p-8 shadow-[0_12px_32px_-8px_rgba(40,30,20,0.06),inset_0_1px_0_0_rgba(255,255,255,0.85)] grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2.5 font-mono text-[11px] text-[#57534E] tabular-nums">
                  <span className="font-bold text-stone-900 bg-stone-200/80 px-2 py-0.5 rounded text-[10px] uppercase">
                    {leadStory.source}
                  </span>
                  <span>·</span>
                  <span className="font-medium text-stone-700">+{leadStory.score} COMMUNITY POINTS</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 leading-snug">
                  <a
                    href={leadStory.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-start gap-2 hover:text-stone-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                  >
                    <span>{leadStory.headline}</span>
                    <ArrowUpRight className="w-5 h-5 shrink-0 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1" strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </h3>

                <p className="font-sans text-sm sm:text-base text-stone-700 leading-relaxed max-w-prose">
                  {leadStory.analysis}
                </p>
              </div>

              <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-stone-300/80 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between text-xs font-mono text-[#57534E] space-y-4">
                <div className="bg-stone-100/80 p-4 rounded-xl border border-stone-200">
                  <div className="font-bold text-stone-900 uppercase text-[10px] mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                    WHY THIS MATTERS
                  </div>
                  <p className="font-sans text-xs text-stone-700 leading-relaxed">
                    Primary architectural shift analyzed from community discussion and model releases.
                  </p>
                </div>
                <div className="text-[10px] text-[#57534E] uppercase tabular-nums">
                  VERIFIED REPORT · {friendlyDate}
                </div>
              </div>
            </div>
          )}

          {/* Secondary Stories: 2-Column Responsive Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryStories.map((news, idx) => (
              <article
                key={idx}
                className="rounded-xl border border-stone-300/80 bg-white/65 hover:bg-white/95 p-5 space-y-3 shadow-[0_8px_20px_-6px_rgba(40,30,20,0.04),inset_0_1px_0_0_rgba(255,255,255,0.8)] hover:shadow-[0_12px_28px_-6px_rgba(40,30,20,0.07),inset_0_1px_0_0_rgba(255,255,255,0.95)] hover:-translate-y-[1px] active:scale-[0.99] transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#57534E] uppercase tabular-nums">
                    <span className="font-semibold text-stone-800 bg-stone-200/60 px-1.5 py-0.5 rounded">
                      {news.source}
                    </span>
                    <span>·</span>
                    <span>+{news.score} PTS</span>
                  </div>

                  <h4 className="font-serif text-xl font-semibold text-stone-900 leading-snug">
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-2 hover:text-stone-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                    >
                      <span>{news.headline}</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1" strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </h4>

                  <p className="font-sans text-xs text-stone-700 leading-relaxed">
                    {news.analysis}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>Community Story</span>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-stone-800 hover:text-stone-950 underline flex items-center gap-0.5"
                  >
                    <span>Read Source</span>
                    <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

