"use client";

import React from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";

export type PageView = "today" | "explore" | "archive";

interface FloatingNavbarProps {
  currentPage: PageView;
  onSelectPage: (page: PageView) => void;
  threatLevel?: string;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  currentPage,
  onSelectPage,
  isAudioPlaying,
  onToggleAudio,
}) => {
  const navItems: { id: PageView; label: string; shortLabel: string }[] = [
    { id: "today", label: "Today's Briefing", shortLabel: "Today" },
    { id: "explore", label: "Explore & Tools", shortLabel: "Explore" },
    { id: "archive", label: "Past Editions", shortLabel: "Archive" },
  ];

  return (
    <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none select-none">
      <div
        role="navigation"
        aria-label="Main Navigation"
        className="pointer-events-auto flex items-center gap-2 sm:gap-4 bg-[#141316]/95 text-stone-300 border border-white/10 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-md"
      >
        {/* Brand with top-to-bottom subtle shade gradient */}
        <div className="flex items-center pl-1 pr-2 sm:pr-3 border-r border-stone-800/80 shrink-0">
          <span className="font-serif font-bold tracking-[0.2em] text-xs sm:text-sm uppercase bg-gradient-to-b from-stone-100 via-stone-200 to-stone-400 bg-clip-text text-transparent">
            TECHPULSE
          </span>
        </div>

        {/* Center Page Selector */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                aria-current={active ? "page" : undefined}
                className={`relative px-3 sm:px-4 py-1.5 rounded-full font-sans text-xs tracking-wide transition-all uppercase font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 active:scale-[0.97] active:-translate-y-[0.5px] ${
                  active ? "text-stone-900 font-bold" : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-full bg-stone-100 shadow-sm border border-stone-200/80"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 hidden sm:inline">{item.label}</span>
                <span className="relative z-10 sm:hidden">{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Minimal Synth Audio Toggle */}
        <div className="pl-1 sm:pl-2 border-l border-stone-800/80">
          <button
            onClick={onToggleAudio}
            aria-label={isAudioPlaying ? "Mute ambient synth" : "Play ambient synth"}
            className={`p-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 active:scale-[0.94] ${
              isAudioPlaying
                ? "text-stone-100 hover:text-white"
                : "text-stone-500 hover:text-stone-300"
            }`}
            title={isAudioPlaying ? "Mute 142.8 MHz Synth" : "Play 142.8 MHz Synth"}
          >
            {isAudioPlaying ? (
              <Volume2 className="w-3.5 h-3.5 animate-pulse" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
