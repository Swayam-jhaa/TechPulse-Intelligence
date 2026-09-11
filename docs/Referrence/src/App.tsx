import React, { useState } from 'react';
import { intelligenceReports } from './data/mockData';
import { CveItem, AiBreakthrough } from './types';
import { FloatingNavbar, PageView } from './components/FloatingNavbar';
import { IcarusBustHero } from './components/IcarusBustHero';
import { RadarView } from './components/RadarView';
import { MythosView } from './components/MythosView';
import { DetailModal } from './components/DetailModal';
import { ArrowUp, RefreshCw, Radio, Shield, Terminal } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('echoes');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-04');
  
  // Inspection modal state
  const [modalItem, setModalItem] = useState<CveItem | AiBreakthrough | null>(null);
  const [modalType, setModalType] = useState<'cve' | 'ai' | null>(null);

  const report = intelligenceReports[selectedDate] || intelligenceReports['2026-09-04'];

  const handleOpenCveDetail = (cve: CveItem) => {
    setModalItem(cve);
    setModalType('cve');
  };

  const handleOpenAiDetail = (ai: AiBreakthrough) => {
    setModalItem(ai);
    setModalType('ai');
  };

  const closeModal = () => {
    setModalItem(null);
    setModalType(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-[#111113] selection:text-white"
      style={{
        // Architectural stone-grey palette with progressive intensity gradient
        backgroundColor: '#CCCAC3',
        color: '#161518'
      }}
    >
      {/* 3-Page Minimal Floating Navbar */}
      <FloatingNavbar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        defconLevel={report.defconLevel}
      />

      {/* Main Pages Switcher */}
      <main className="flex-1">
        {/* PAGE 1: ECHOES // The Monumental Icarus Marble Bust & Frequency */}
        {currentPage === 'echoes' && (
          <div className="space-y-0">
            <IcarusBustHero
              report={report}
              onExploreRadar={() => setCurrentPage('radar')}
              onOpenMythos={() => setCurrentPage('mythos')}
            />

            {/* Quick Minimal Telegraph Below Hero on Scroll */}
            <section
              className="py-12 px-4 sm:px-6 md:px-12 border-t border-[#242322]/20"
              style={{
                background: 'linear-gradient(135deg, #B5B2A8 0%, #8E8B81 50%, #2A292D 100%)',
                color: '#F4F3EE'
              }}
            >
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold uppercase tracking-widest text-white">
                      DAILY DISPATCH // {report.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-stone-300">
                    <span>ACTIVE KEV: <strong className="text-white">{report.activeExploitsCount}</strong></span>
                    <span>•</span>
                    <span>AI PAPERS: <strong className="text-white">{report.modelReleasesCount}</strong></span>
                    <span>•</span>
                    <span>DEFCON 0{report.defconLevel}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {report.executiveOverview.map((para, i) => (
                    <div key={i} className="bg-black/30 border border-white/15 p-5 backdrop-blur-xs space-y-2">
                      <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest block">
                        TELEMETRY 0{i + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-sans leading-relaxed text-stone-200">
                        {para}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => setCurrentPage('radar')}
                    className="bg-white text-[#111113] hover:bg-stone-200 px-6 py-2.5 font-mono text-xs uppercase font-bold tracking-widest transition-colors shadow-lg"
                  >
                    Open Intelligence Radar →
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PAGE 2: RADAR // Vulnerability & AI Frontier Intelligence */}
        {currentPage === 'radar' && (
          <RadarView
            report={report}
            onOpenCve={handleOpenCveDetail}
            onOpenAi={handleOpenAiDetail}
          />
        )}

        {/* PAGE 3: MYTHOS // The Allegory & Audio Frequency Spectrum */}
        {currentPage === 'mythos' && (
          <MythosView />
        )}
      </main>

      {/* Forensic Inspection Modal */}
      <DetailModal
        item={modalItem}
        type={modalType}
        variation="echoes"
        onClose={closeModal}
      />

      {/* Minimal Brutalist Footer */}
      <footer
        className="py-8 px-4 sm:px-6 md:px-12 border-t border-black/20 font-mono text-xs text-[#2A2928]"
        style={{
          backgroundColor: '#B5B2A9'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-widest uppercase text-[#111113]">ICARVS // ECHØES</span>
            <span className="opacity-40">|</span>
            <span className="italic text-[11px] opacity-80">“Sound is the language of the soul.”</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>COORDINATES 52.5200° N, 13.4050° E</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 font-bold text-[#111113] hover:underline"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
