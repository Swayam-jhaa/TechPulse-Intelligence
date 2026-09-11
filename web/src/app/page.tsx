"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DailyReport, ArchiveIndexItem } from "../types/intelligence";
import { FloatingNavbar, PageView } from "../components/FloatingNavbar";
import { DispatchView } from "../components/DispatchView";
import { RadarView } from "../components/RadarView";
import { ChroniclesView } from "../components/ChroniclesView";
import { DetailModal, ModalPayload } from "../components/DetailModal";
import { toggleFrequencyAudio, isAudioActive } from "../utils/audioSynth";

// Default bundled intelligence report and archive index
import latestReportRaw from "../../public/data/latest.json";
import archiveIndexRaw from "../../public/data/archive_index.json";

const defaultReport = latestReportRaw as unknown as DailyReport;
const defaultIndex = archiveIndexRaw as unknown as ArchiveIndexItem[];

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/Swayam-jhaa/techpulse-intelligence/main/data";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>("today");
  const [currentReport, setCurrentReport] = useState<DailyReport>(defaultReport);
  const [archiveIndex, setArchiveIndex] = useState<ArchiveIndexItem[]>(defaultIndex);
  const [selectedDate, setSelectedDate] = useState<string>(defaultReport.date || "2026-09-11");
  const [isAudioPlaying, setIsAudioPlaying] = useState(isAudioActive());
  const [modalPayload, setModalPayload] = useState<ModalPayload>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>("");

  const handleToggleAudio = () => {
    const active = toggleFrequencyAudio();
    setIsAudioPlaying(active);
  };

  // Dynamically sync the latest intelligence from GitHub raw API or local endpoints
  const syncLatestIntelligence = useCallback(async () => {
    setIsSyncing(true);
    setSyncStatus("Syncing...");
    try {
      // 1. Fetch latest archive index
      const indexRes = await fetch(`${GITHUB_RAW_BASE}/archive_index.json?t=${Date.now()}`, {
        cache: "no-store"
      }).catch(() => fetch(`/data/archive_index.json?t=${Date.now()}`));

      if (indexRes && indexRes.ok) {
        const freshIndex: ArchiveIndexItem[] = await indexRes.json();
        if (Array.isArray(freshIndex) && freshIndex.length > 0) {
          setArchiveIndex(freshIndex);

          // 2. Fetch the most recent report from index
          const newest = freshIndex[0];
          const year = newest.date.slice(0, 4);
          const month = newest.date.slice(5, 7);

          const reportRes = await fetch(`${GITHUB_RAW_BASE}/${year}/${month}/${newest.date}.json?t=${Date.now()}`, {
            cache: "no-store"
          }).catch(() => fetch(`/data/${year}/${month}/${newest.date}.json`));

          if (reportRes && reportRes.ok) {
            const freshReport: DailyReport = await reportRes.json();
            setCurrentReport(freshReport);
            setSelectedDate(freshReport.date);
            setSyncStatus(`Synced: ${freshReport.date}`);
          }
        }
      }
    } catch (e) {
      console.warn("Using local cache, could not reach remote feed:", e);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(""), 3000);
    }
  }, []);

  // Sync on initial load
  useEffect(() => {
    syncLatestIntelligence();
  }, [syncLatestIntelligence]);

  // Handle switching to a past edition from the archive view
  const handleSelectDate = async (date: string) => {
    setSelectedDate(date);
    const parts = date.split("-");
    if (parts.length === 3) {
      const [year, month] = parts;
      try {
        const res = await fetch(`/data/${year}/${month}/${date}.json`).catch(() =>
          fetch(`${GITHUB_RAW_BASE}/${year}/${month}/${date}.json`)
        );
        if (res && res.ok) {
          const reportData = await res.json();
          setCurrentReport(reportData);
        }
      } catch (e) {
        console.warn("Could not load report for date:", date, e);
      }
    }
    setCurrentPage("today");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#111113] selection:text-stone-100 relative bg-[#ECEAE4]">
      
      {/* 1. Floating Capsule Navbar */}
      <FloatingNavbar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        threatLevel={currentReport.threat_level}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        isSyncing={isSyncing}
        onSync={syncLatestIntelligence}
      />

      {/* Sync Notification Banner (quiet & minimalist) */}
      {syncStatus && (
        <aside
          aria-live="polite"
          className="fixed top-16 sm:top-18 left-1/2 -translate-x-1/2 z-40 bg-stone-900/90 text-stone-200 border border-stone-700 px-3 py-1 rounded-full font-mono text-[10px] tracking-wider uppercase backdrop-blur-xs shadow-md animate-fade-in"
        >
          {syncStatus}
        </aside>
      )}

      {/* 2. Main Page Views */}
      <main className="flex-1">
        {currentPage === "today" && (
          <DispatchView
            report={currentReport}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
            onExplore={() => setCurrentPage("explore")}
          />
        )}

        {currentPage === "explore" && (
          <RadarView
            report={currentReport}
            onOpenModal={setModalPayload}
          />
        )}

        {currentPage === "archive" && (
          <ChroniclesView
            report={currentReport}
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
              EDITION {currentReport.date} · STATUS: {currentReport.threat_level}
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
