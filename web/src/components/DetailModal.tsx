"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight, ShieldCheck, Sparkles, Code2, AlertTriangle } from "lucide-react";
import { CveItem, AiBreakthrough, TrendingTool } from "../types/intelligence";

export type ModalPayload =
  | { type: "cve"; item: CveItem }
  | { type: "ai"; item: AiBreakthrough }
  | { type: "tool"; item: TrendingTool }
  | null;

interface DetailModalProps {
  payload: ModalPayload;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ payload, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (payload) {
      window.addEventListener("keydown", handleKeyDown);
      // Auto focus close button on open for accessibility
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [payload, onClose]);

  if (!payload) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Intelligence Detail Dialog"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window with Shadcn styling */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          className="relative z-10 w-full max-w-2xl bg-[#ECEAE4] border border-stone-400 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-stone-900"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-stone-300 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#57534E]">
              {payload.type === "cve" && (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <span>SECURITY ADVISORY · {payload.item.id}</span>
                </>
              )}
              {payload.type === "ai" && (
                <>
                  <Sparkles className="w-4 h-4 text-stone-700" aria-hidden="true" />
                  <span>AI RESEARCH · {payload.item.category}</span>
                </>
              )}
              {payload.type === "tool" && (
                <>
                  <Code2 className="w-4 h-4 text-stone-700" aria-hidden="true" />
                  <span>OPEN SOURCE REPOSITORY</span>
                </>
              )}
            </div>

            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg hover:bg-stone-300/70 transition-colors text-stone-600 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body: Security Advisory */}
          {payload.type === "cve" && (
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
                  <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px] uppercase">
                    Severity: {payload.item.severity}
                  </span>
                  <span>·</span>
                  <span className="text-stone-700 font-sans">
                    {payload.item.vendor} {payload.item.product}
                  </span>
                  {payload.item.epss_score !== null && payload.item.epss_score !== undefined && (
                    <>
                      <span>·</span>
                      <span className="font-semibold text-stone-900 bg-stone-200/80 px-2 py-0.5 rounded text-[11px] tabular-nums">
                        Exploit Probability: {(payload.item.epss_score * 100).toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
                <h3 className="font-serif text-2xl font-semibold text-stone-900 leading-snug">
                  {payload.item.title}
                </h3>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-[#57534E] block font-bold">
                  DETAILED VULNERABILITY OVERVIEW:
                </span>
                <p className="font-sans text-sm text-stone-800 leading-relaxed bg-white/70 p-4 rounded-xl border border-stone-300/80">
                  {payload.item.description}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-stone-900 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>RECOMMENDED ACTION & REMEDIATION:</span>
                </div>
                <div className="bg-stone-900 text-stone-100 p-4 rounded-xl font-mono text-xs leading-relaxed shadow-xs">
                  {payload.item.remediation}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={payload.item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-stone-900 text-stone-100 hover:bg-stone-800 px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                >
                  <span>Official Advisory</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          )}

          {/* Content Body: AI Research */}
          {payload.type === "ai" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#57534E] tabular-nums">
                  <span className="font-bold text-stone-800 bg-stone-200/80 px-2 py-0.5 rounded text-[10px] uppercase">
                    {payload.item.category}
                  </span>
                  <span>·</span>
                  <span className="font-medium text-stone-700">▲ {payload.item.upvotes_or_likes.toLocaleString()} Community Upvotes</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-stone-900 leading-snug">
                  {payload.item.title}
                </h3>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-[#57534E] block font-bold">
                  RESEARCH SUMMARY:
                </span>
                <p className="font-sans text-sm text-stone-800 leading-relaxed bg-white/70 p-4 rounded-xl border border-stone-300/80">
                  {payload.item.summary}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-amber-900 block font-bold">
                  WHY THIS MATTERS FOR DEVELOPERS:
                </span>
                <p className="font-sans text-sm text-stone-900 bg-amber-50/90 p-4 rounded-xl border border-amber-200 leading-relaxed italic">
                  {payload.item.why_it_matters}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={payload.item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-stone-900 text-stone-100 hover:bg-stone-800 px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                >
                  <span>Read Source Paper</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          )}

          {/* Content Body: Trending Tool */}
          {payload.type === "tool" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#57534E] tabular-nums">
                  <span className="font-bold text-stone-800 bg-stone-200/80 px-2 py-0.5 rounded text-[10px] uppercase">
                    {payload.item.language || "CODE"}
                  </span>
                  <span>·</span>
                  <span className="font-bold text-stone-900">★ {payload.item.stars.toLocaleString()} GitHub Stars</span>
                </div>
                <h3 className="font-mono text-2xl font-bold text-stone-900 leading-snug">
                  {payload.item.repo_name}
                </h3>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-[#57534E] block font-bold">
                  TOOL OVERVIEW:
                </span>
                <p className="font-sans text-sm text-stone-800 leading-relaxed bg-white/70 p-4 rounded-xl border border-stone-300/80">
                  {payload.item.description}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-stone-700 block font-bold">
                  PRIMARY USE CASE:
                </span>
                <p className="font-sans text-xs text-stone-900 bg-stone-100/90 p-4 rounded-xl border border-stone-300 leading-relaxed">
                  {payload.item.use_case}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={payload.item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-stone-900 text-stone-100 hover:bg-stone-800 px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                >
                  <span>Open GitHub Repository</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

