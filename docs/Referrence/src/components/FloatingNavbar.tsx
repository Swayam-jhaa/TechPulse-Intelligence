import React from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldAlert, Sparkles, BookOpen, Volume2 } from 'lucide-react';
import { isAudioActive } from '../utils/audioSynth';

export type PageView = 'echoes' | 'radar' | 'mythos';

interface FloatingNavbarProps {
  currentPage: PageView;
  onSelectPage: (page: PageView) => void;
  defconLevel: number;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  currentPage,
  onSelectPage,
  defconLevel
}) => {
  const isSoundOn = isAudioActive();

  const pages: { id: PageView; label: string; tag: string }[] = [
    { id: 'echoes', label: 'ECHOES', tag: '01' },
    { id: 'radar', label: 'RADAR', tag: '02' },
    { id: 'mythos', label: 'MYTHOS', tag: '03' }
  ];

  return (
    <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 select-none">
      <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1A191C]/90 text-stone-200 border border-stone-600/30 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
        
        {/* Brand stamp */}
        <div className="hidden md:flex items-center gap-2 pl-2 pr-3 border-r border-stone-700/60 font-mono text-[11px] tracking-widest text-stone-400">
          <span className="font-bold text-white uppercase">ICARVS</span>
          <span className="text-[9px] px-1.5 py-0.2 bg-stone-800 rounded text-stone-300">
            DEFCON 0{defconLevel}
          </span>
        </div>

        {/* 3 Nav Page Links */}
        <div className="flex items-center gap-1">
          {pages.map((page) => {
            const isActive = currentPage === page.id;
            return (
              <button
                key={page.id}
                id={`nav-btn-${page.id}`}
                onClick={() => onSelectPage(page.id)}
                className={`relative px-3 sm:px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-colors duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#121113] font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {/* Active Sliding Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#ECEAE3] rounded-full shadow-sm"
                  />
                )}

                <span className="relative z-10 opacity-60 text-[10px]">{page.tag}</span>
                <span className="relative z-10">{page.label}</span>
              </button>
            );
          })}
        </div>

        {/* Audio state badge if sound is on */}
        {isSoundOn && (
          <div className="hidden sm:flex items-center gap-1.5 pr-2 pl-1 font-mono text-[10px] text-emerald-400">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>142.8M</span>
          </div>
        )}

      </div>
    </nav>
  );
};
