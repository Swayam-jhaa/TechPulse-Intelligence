"use client";

import React, { useState } from "react";
import { DailyReport, ArchiveIndexItem } from "../types/intelligence";
import { FloatingNavbar, PageView } from "../components/FloatingNavbar";
import { DispatchView } from "../components/DispatchView";
import { RadarView } from "../components/RadarView";
import { ChroniclesView } from "../components/ChroniclesView";
import { DetailModal, ModalPayload } from "../components/DetailModal";
import { toggleFrequencyAudio, isAudioActive } from "../utils/audioSynth";

// Import sample verified live reports & index
import initialReportRaw from "../../../data/2026/09/2026-09-04.json";
import archiveIndexRaw from "../../../data/archive_index.json";

const initialReport = initialReportRaw as unknown as DailyReport;
const archiveIndex = archiveIndexRaw as unknown as ArchiveIndexItem[];

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>("today");
  const [selectedDate, setSelectedDate] = useState<string>(initialReport.date || "2026-09-04");
  const [isAudioPlaying, setIsAudioPlaying] = useState(isAudioActive());
  const [modalPayload, setModalPayload] = useState<ModalPayload>(null);

  const handleToggleAudio = () => {
    const active = toggleFrequencyAudio();
    setIsAudioPlaying(active);
  };

  const handleSelectDate = async (date: string) => {
    setSelectedDate(date);
    // Switch to today's briefing view for the selected date
    setCurrentPage("today");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#111113] selection:text-stone-100 relative bg-[#ECEAE4]">
      
      {/* 1. Floating Capsule Navbar */}
      <FloatingNavbar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        threatLevel={initialReport.threat_level}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
      />

      {/* 2. Main Page Views */}
      <main className="flex-1">
        {currentPage === "today" && (
          <DispatchView
            report={initialReport}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
            onExplore={() => setCurrentPage("explore")}
          />
        )}

        {currentPage === "explore" && (
          <RadarView
            report={initialReport}
            onOpenModal={setModalPayload}
          />
        )}

        {currentPage === "archive" && (
          <ChroniclesView
            report={initialReport}
            archiveIndex={archiveIndex}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        )}
      </main>

      {/* 3. Detailed Information Modal */}
      <DetailModal
        payload={modalPayload}
        onClose={() => setModalPayload(null)}
      />

      {/* 4. Minimal Editorial Footer */}
      <footer className="border-t border-stone-400/60 py-8 px-4 sm:px-6 md:px-12 font-mono text-xs text-stone-700 bg-gradient-to-b from-[#D8D4CA] to-[#CEC9BE]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-serif font-bold tracking-wider uppercase bg-gradient-to-b from-stone-950 via-stone-800 to-stone-600 bg-clip-text text-transparent text-sm">
              TECHPULSE INTELLIGENCE
            </span>
            <span className="opacity-40">|</span>
            <span className="text-[11px] text-stone-600 tabular-nums">
              EDITION {initialReport.date} · STATUS: {initialReport.threat_level}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-stone-600">
            <span>CURATED WITH GOOGLE GEMINI</span>
            <span>•</span>
            <a
              href="/data/rss.xml"
              className="hover:text-stone-900 underline font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              RSS 2.0
            </a>
            <span>•</span>
            <a
              href="/data/feed.xml"
              className="hover:text-stone-900 underline font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              ATOM FEED
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
