import React, { useState } from 'react';
import { Shield, AlertOctagon, Terminal, ExternalLink, Calendar, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { CveItem, AestheticVariation } from '../types';

interface CveSectionProps {
  cves: CveItem[];
  variation: AestheticVariation;
  onOpenDetail: (cve: CveItem) => void;
}

export const CveSection: React.FC<CveSectionProps> = ({ cves, variation, onOpenDetail }) => {
  const isTwilight = variation === 'icarus';
  const [expandedId, setExpandedId] = useState<string | null>(cves[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="cve-section" className="py-12 px-4 sm:px-6 md:px-8 border-b transition-colors duration-500"
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
              <span>VULNERABILITY TELEMETRY</span>
              <span>•</span>
              <span>THE MELTED WAX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold tracking-tight"
              style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}
            >
              KNOWN EXPLOITED VULNERABILITIES (KEV)
            </h2>
          </div>

          <div className="text-xs font-mono text-stone-500 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-600" />
            <span>CISA MANDATE • IMMEDIATE REMEDIATION</span>
          </div>
        </div>

        {/* CVE Cards List */}
        <div className="space-y-4">
          {cves.map((cve) => {
            const isExpanded = expandedId === cve.id;
            const isCritical = cve.severity === 'CRITICAL';

            return (
              <div
                key={cve.id}
                className="border rounded transition-all overflow-hidden"
                style={{
                  backgroundColor: isTwilight ? 'rgba(28, 13, 6, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: isCritical
                    ? isTwilight ? '#EA580C' : '#DC2626'
                    : isTwilight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.12)',
                  boxShadow: isCritical ? '0 0 15px rgba(220, 38, 38, 0.08)' : 'none'
                }}
              >
                {/* Clickable Header Row */}
                <div
                  onClick={() => toggleExpand(cve.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none hover:bg-stone-500/5 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold tracking-wider px-2 py-0.5 rounded bg-stone-900 text-stone-100">
                        {cve.cveId}
                      </span>
                      {cve.isCisaKev && (
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/90 text-white flex items-center gap-1">
                          <AlertOctagon className="w-3 h-3" />
                          CISA KEV ACTIVE
                        </span>
                      )}
                      <span
                        className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded border"
                        style={{
                          borderColor: isCritical ? '#EF4444' : '#F59E0B',
                          color: isCritical ? (isTwilight ? '#F87171' : '#B91C1C') : (isTwilight ? '#FBBF24' : '#B45309'),
                          backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'
                        }}
                      >
                        CVSS {cve.cvssScore} • {cve.severity}
                      </span>
                      <span className="text-xs font-mono opacity-60">
                        Status: <strong className="opacity-90">{cve.exploitationStatus}</strong>
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-serif font-bold tracking-tight"
                      style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}
                    >
                      {cve.title}
                    </h3>

                    <div className="text-xs font-mono opacity-75">
                      Target: <span className="font-semibold">{cve.vendor}</span> / <span>{cve.product}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {cve.cisaActionDue && (
                      <span className="text-xs font-mono px-2 py-1 rounded bg-amber-500/15 border border-amber-600/30 text-amber-900 flex items-center gap-1"
                        style={{ color: isTwilight ? '#FDE68A' : '#78350F' }}
                      >
                        <Calendar className="w-3 h-3" />
                        Due: {cve.cisaActionDue}
                      </span>
                    )}

                    <button
                      id={`btn-cve-expand-${cve.id}`}
                      className="p-1 rounded border border-stone-300/40 hover:bg-stone-500/10"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t space-y-4"
                    style={{
                      borderColor: isTwilight ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <p className="text-sm font-sans leading-relaxed"
                      style={{ color: isTwilight ? '#CBD5E1' : '#334155' }}
                    >
                      {cve.description}
                    </p>

                    {/* Remediation Box */}
                    <div className="p-3.5 rounded border font-mono text-xs space-y-1.5"
                      style={{
                        backgroundColor: isTwilight ? '#170A04' : '#F1EFE9',
                        borderColor: isTwilight ? 'rgba(245, 158, 11, 0.3)' : 'rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-800"
                        style={{ color: isTwilight ? '#FBBF24' : '#92400E' }}
                      >
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          REMEDIATION DIRECTIVE
                        </span>
                        <button
                          id={`btn-copy-remediation-${cve.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(cve.remediation, cve.id);
                          }}
                          className="flex items-center gap-1 text-[10px] hover:underline cursor-pointer"
                        >
                          {copiedId === cve.id ? (
                            <>
                              <Check className="w-3 h-3 text-green-500" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Directive</span>
                            </>
                          )}
                        </button>
                      </div>
                      <code className="block font-mono text-xs whitespace-pre-wrap"
                        style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}
                      >
                        {cve.remediation}
                      </code>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        id={`btn-view-deep-cve-${cve.id}`}
                        onClick={() => onOpenDetail(cve)}
                        className="px-3 py-1.5 rounded font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all border"
                        style={{
                          backgroundColor: isTwilight ? '#D97706' : '#1C1917',
                          color: isTwilight ? '#1C0D06' : '#FEF3C7',
                          borderColor: isTwilight ? '#F59E0B' : '#1C1917'
                        }}
                      >
                        <span>Examine Full Forensics</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
