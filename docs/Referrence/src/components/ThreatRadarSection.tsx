import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { DailyReport, AestheticVariation } from '../types';

interface ThreatRadarSectionProps {
  report: DailyReport;
  variation: AestheticVariation;
  onSelectCve: (cveId: string) => void;
}

export const ThreatRadarSection: React.FC<ThreatRadarSectionProps> = ({
  report,
  variation,
  onSelectCve
}) => {
  const isTwilight = variation === 'icarus';
  const isSolar = variation === 'solar';

  return (
    <section id="threat-radar-section" className="py-12 px-4 sm:px-6 md:px-8 border-b transition-colors duration-500"
      style={{
        borderColor: isTwilight ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-4"
          style={{
            borderColor: isTwilight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.15)'
          }}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase mb-1"
              style={{ color: isTwilight ? '#FBBF24' : '#B45309' }}
            >
              <span>DISPATCH CHRONICLE</span>
              <span>•</span>
              <span>DEFCON PROTOCOL 0{report.defconLevel}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold tracking-tight"
              style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}
            >
              THREAT RADAR &amp; EXECUTIVE BRIEFING
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider rounded border"
              style={{
                backgroundColor: report.threatLevel === 'CRITICAL' || report.threatLevel === 'HIGH'
                  ? 'rgba(239, 68, 68, 0.2)'
                  : isTwilight
                  ? 'rgba(245, 158, 11, 0.2)'
                  : 'rgba(234, 179, 8, 0.25)',
                borderColor: report.threatLevel === 'CRITICAL' || report.threatLevel === 'HIGH'
                  ? '#EF4444'
                  : isTwilight
                  ? '#F59E0B'
                  : '#D97706',
                color: report.threatLevel === 'CRITICAL' || report.threatLevel === 'HIGH'
                  ? '#F87171'
                  : isTwilight
                  ? '#FDE68A'
                  : '#92400E'
              }}
            >
              STATUS: {report.threatLevel}
            </span>
          </div>
        </div>

        {/* 3 Executive Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: The 3 Overview Paragraphs */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-cinzel text-sm uppercase tracking-widest font-semibold flex items-center gap-2"
              style={{ color: isTwilight ? '#FDE68A' : '#78350F' }}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              SITUATION REPORT // 24-HOUR TRAJECTORY
            </h3>

            <div className="space-y-4 font-serif text-base sm:text-lg leading-relaxed"
              style={{ color: isTwilight ? '#E2E8F0' : '#292524' }}
            >
              {report.executiveOverview.map((para, idx) => (
                <p key={idx} className="first-letter:text-3xl first-letter:font-cinzel first-letter:font-bold first-letter:mr-1 first-letter:float-left">
                  {para}
                </p>
              ))}
            </div>

            {/* Developer Impact Callout Box */}
            <div className="p-4 rounded border mt-6"
              style={{
                backgroundColor: isTwilight ? 'rgba(38, 19, 10, 0.7)' : 'rgba(245, 238, 226, 0.7)',
                borderColor: isTwilight ? 'rgba(245, 158, 11, 0.3)' : 'rgba(217, 119, 6, 0.3)'
              }}
            >
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider block mb-1"
                style={{ color: isTwilight ? '#FBBF24' : '#B45309' }}
              >
                TACTICAL DEVELOPER &amp; SRE IMPACT
              </span>
              <p className="text-sm font-sans" style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}>
                {report.developerImpact}
              </p>
            </div>
          </div>

          {/* Right Column: Key Takeaways Cards */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-cinzel text-sm uppercase tracking-widest font-semibold flex items-center gap-2"
              style={{ color: isTwilight ? '#FDE68A' : '#78350F' }}
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              PRIORITY INTELLIGENCE DIRECTIVES
            </h3>

            <div className="space-y-3">
              {report.keyTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded border transition-all hover:scale-[1.01]"
                  style={{
                    backgroundColor: isTwilight ? 'rgba(30, 14, 7, 0.6)' : 'rgba(255, 255, 255, 0.85)',
                    borderColor: isTwilight ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded mt-0.5"
                      style={{
                        backgroundColor: isTwilight ? '#D97706' : '#F59E0B',
                        color: isTwilight ? '#FEF3C7' : '#1C1917'
                      }}
                    >
                      0{idx + 1}
                    </span>
                    <p className="text-sm font-sans leading-snug"
                      style={{ color: isTwilight ? '#F1F5F9' : '#1C1917' }}
                    >
                      {takeaway}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Link to CVEs */}
            <div className="pt-2">
              <button
                id="btn-jump-to-cves"
                onClick={() => onSelectCve('cve-1')}
                className="w-full flex items-center justify-between p-3 rounded font-mono text-xs uppercase font-bold tracking-wider transition-all border"
                style={{
                  backgroundColor: isTwilight ? '#F59E0B' : '#1C1917',
                  color: isTwilight ? '#1C0D06' : '#FEF3C7',
                  borderColor: isTwilight ? '#FBBF24' : '#1C1917'
                }}
              >
                <span>Inspect Active In-The-Wild Exploits (KEV)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
