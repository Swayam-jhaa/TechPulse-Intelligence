import React, { useState } from 'react';
import { X, Terminal, Copy, Check, ExternalLink, ShieldAlert, Cpu } from 'lucide-react';
import { CveItem, AiBreakthrough, AestheticVariation } from '../types';

interface DetailModalProps {
  item: CveItem | AiBreakthrough | null;
  type: 'cve' | 'ai' | null;
  variation: AestheticVariation;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  type,
  variation,
  onClose
}) => {
  if (!item || !type) return null;

  const isTwilight = variation === 'icarus';
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCve = type === 'cve';
  const cve = isCve ? (item as CveItem) : null;
  const ai = !isCve ? (item as AiBreakthrough) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div
        className="relative w-full max-w-2xl rounded-lg border p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
        style={{
          backgroundColor: isTwilight ? '#1C0D06' : '#FAF8F5',
          borderColor: isTwilight ? 'rgba(245, 158, 11, 0.4)' : 'rgba(0, 0, 0, 0.2)',
          color: isTwilight ? '#FEF3C7' : '#1C1917'
        }}
      >
        {/* Close Button */}
        <button
          id="btn-close-detail-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full border border-stone-500/20 hover:bg-stone-500/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className="px-2 py-0.5 rounded font-bold uppercase"
              style={{
                backgroundColor: isCve ? '#DC2626' : '#F59E0B',
                color: '#FFF'
              }}
            >
              {isCve ? 'FORENSIC DOSSIER' : 'RESEARCH ABSTRACT'}
            </span>
            <span className="opacity-60">
              {isCve ? cve?.cveId : ai?.category.toUpperCase()}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            {isCve ? cve?.title : ai?.title}
          </h2>

          <p className="text-xs font-mono opacity-70">
            {isCve
              ? `Affected: ${cve?.vendor} (${cve?.product}) • Date: ${cve?.dateAdded}`
              : `Authors: ${ai?.authorsOrOrg}`}
          </p>
        </div>

        {/* CVE Specific breakdown */}
        {isCve && cve && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-center">
              <div className="p-2.5 rounded border border-stone-400/20 bg-stone-500/5">
                <span className="opacity-60 block text-[10px]">CVSS SCORE</span>
                <span className="text-base font-bold text-red-600">{cve.cvssScore}</span>
              </div>
              <div className="p-2.5 rounded border border-stone-400/20 bg-stone-500/5">
                <span className="opacity-60 block text-[10px]">SEVERITY</span>
                <span className="text-base font-bold">{cve.severity}</span>
              </div>
              <div className="p-2.5 rounded border border-stone-400/20 bg-stone-500/5">
                <span className="opacity-60 block text-[10px]">IN-THE-WILD</span>
                <span className="text-base font-bold text-amber-500">{cve.isCisaKev ? 'YES' : 'NO'}</span>
              </div>
              <div className="p-2.5 rounded border border-stone-400/20 bg-stone-500/5">
                <span className="opacity-60 block text-[10px]">ACTION DUE</span>
                <span className="text-base font-bold">{cve.cisaActionDue || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-mono uppercase font-bold tracking-wider opacity-75">
                Detailed Technical Summary:
              </h4>
              <p className="text-sm font-sans leading-relaxed opacity-90">
                {cve.description}
              </p>
            </div>

            {/* Remediation Block */}
            <div className="p-4 rounded border font-mono text-xs space-y-2 bg-stone-900 text-stone-100">
              <div className="flex items-center justify-between text-amber-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <Terminal className="w-4 h-4" />
                  PATCH / MITIGATION PROCEDURE
                </span>
                <button
                  onClick={() => handleCopy(cve.remediation)}
                  className="flex items-center gap-1 text-[11px] hover:text-amber-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-2 bg-black/40 rounded overflow-x-auto whitespace-pre-wrap text-stone-200">
                {cve.remediation}
              </pre>
            </div>
          </div>
        )}

        {/* AI Paper breakdown */}
        {!isCve && ai && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-mono uppercase font-bold tracking-wider opacity-75">
                Full Abstract:
              </h4>
              <p className="text-sm font-sans leading-relaxed opacity-95">
                {ai.abstract}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {ai.parameters && (
                <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-600/40 text-amber-700 font-bold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" />
                  {ai.parameters}
                </span>
              )}
              {ai.downloads && (
                <span className="px-2.5 py-1 rounded bg-stone-500/10 border border-stone-500/20">
                  Downloads: {ai.downloads}
                </span>
              )}
              {ai.license && (
                <span className="px-2.5 py-1 rounded bg-stone-500/10 border border-stone-500/20">
                  License: {ai.license}
                </span>
              )}
            </div>

            <div className="p-4 rounded border font-mono text-xs space-y-2 bg-stone-900 text-stone-100">
              <div className="flex items-center justify-between text-amber-400">
                <span>BIBTEX CITATION</span>
                <button
                  onClick={() => handleCopy(`@article{${ai.id}2026,\n  title={${ai.title}},\n  author={${ai.authorsOrOrg}},\n  year={2026}\n}`)}
                  className="flex items-center gap-1 text-[11px] hover:text-amber-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy BibTeX'}</span>
                </button>
              </div>
              <pre className="p-2 bg-black/40 rounded overflow-x-auto whitespace-pre-wrap text-stone-300">
{`@article{${ai.id}2026,
  title={${ai.title}},
  author={${ai.authorsOrOrg}},
  year={2026}
}`}
              </pre>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {ai.huggingfaceUrl && (
                <a
                  href={ai.huggingfaceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded bg-amber-500 text-stone-950 font-mono font-bold text-xs uppercase"
                >
                  <span>Open on Hugging Face</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {ai.arxivUrl && (
                <a
                  href={ai.arxivUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded border border-stone-400/30 font-mono text-xs uppercase hover:bg-stone-500/10"
                >
                  <span>Open arXiv Paper</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
