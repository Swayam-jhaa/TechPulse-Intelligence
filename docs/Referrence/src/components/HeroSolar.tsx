import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Flame, Compass, ArrowUpRight, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { DailyReport } from '../types';

interface HeroSolarProps {
  report: DailyReport;
  heroMode: 'rotate' | 'open' | 'waveform';
  onExploreClick: () => void;
}

export const HeroSolar: React.FC<HeroSolarProps> = ({ report, heroMode, onExploreClick }) => {
  const { scrollY } = useScroll();
  const [isOpen, setIsOpen] = useState(false);

  // Scroll transforms for rotation and opening
  const rotateAngle = useTransform(scrollY, [0, 1000], [0, 360]);
  const counterRotate = useTransform(scrollY, [0, 1000], [0, -180]);
  const scaleEffect = useTransform(scrollY, [0, 400], [1, 0.92]);
  const opacityFade = useTransform(scrollY, [0, 600], [1, 0.6]);

  // Gate opening transform
  const leftWingOffset = useTransform(scrollY, [0, 350], [0, -140]);
  const rightWingOffset = useTransform(scrollY, [0, 350], [0, 140]);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 md:px-8 border-b border-amber-900/10 bg-[#F6F2E9] text-[#1C1917] select-none">
      
      {/* Newspaper texture collage simulation */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Floating antique typographic fragments from newsprint background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.18] font-serif text-[11px] leading-tight select-none flex justify-between">
        <div className="w-48 pl-6 pt-12 space-y-2 hidden xl:block">
          <p className="font-bold tracking-widest text-[9px] uppercase border-b border-amber-900/30 pb-1">GAZETTE • ARCHIVE 1928</p>
          <p>“...and the wax melted softly beneath the untamed brilliance of the noon day sun...”</p>
          <p>“Flight parameters sustained until elevation threshold theta surpassed 40,000 feet.”</p>
          <p className="font-mono text-[8px]">0x7FFE • TELEMETRY BUFFER FLUSHED</p>
        </div>
        <div className="w-56 pr-6 pt-24 text-right space-y-2 hidden xl:block">
          <p className="font-bold tracking-widest text-[9px] uppercase border-b border-amber-900/30 pb-1 text-right">CYBERNETIC CHRONICLES</p>
          <p>“Between the wings of wax and the heart of copper, lies the frontier of automated thought.”</p>
          <p className="font-mono text-[8px]">SYSTEM INTEGRITY: 98.4% // KEV-2026</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Header metadata strip */}
        <div className="flex flex-wrap items-center justify-between border-b border-amber-900/20 pb-4 mb-8 text-xs font-mono tracking-wider">
          <div className="flex items-center gap-3">
            <span className="bg-stone-900 text-amber-100 px-2 py-0.5 font-bold uppercase tracking-widest text-[10px]">
              DAILY INTEL
            </span>
            <span className="text-amber-900/70 font-semibold">{report.date}</span>
            <span className="hidden sm:inline text-amber-900/40">•</span>
            <span className="hidden sm:inline text-amber-900/70">DEFCON {report.defconLevel}</span>
          </div>
          <div className="flex items-center gap-4 text-amber-900/80">
            <span>KEV EXPLOITS: <strong className="text-red-700">{report.activeExploitsCount}</strong></span>
            <span>MODELS: <strong className="text-amber-700">{report.modelReleasesCount}</strong></span>
            <span>TRENDING: <strong className="text-stone-900">{report.reposTrendingCount}</strong></span>
          </div>
        </div>

        {/* Main Grid: Visual Art Center + Story Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Typography & Mythos */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* The Yellow Paper Tape Strips (directly inspired by reference image 2) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.div
                whileHover={{ rotate: -1, scale: 1.05 }}
                className="bg-[#FACC15] text-[#1C1917] px-3 py-1 font-mono text-xs uppercase font-bold tracking-widest shadow-sm rotate-[-2deg] border border-amber-500/40"
              >
                you are the sun
              </motion.div>
              <motion.div
                whileHover={{ rotate: 1, scale: 1.05 }}
                className="bg-[#FACC15] text-[#1C1917] px-3 py-1 font-mono text-xs uppercase font-bold tracking-widest shadow-sm rotate-[1.5deg] border border-amber-500/40"
              >
                you heal
              </motion.div>
              <motion.div
                whileHover={{ rotate: -2, scale: 1.05 }}
                className="bg-[#EAB308] text-[#1C1917] px-3 py-1 font-mono text-xs uppercase font-bold tracking-widest shadow-sm rotate-[-3deg] border border-amber-600/40 flex items-center gap-1"
              >
                <Flame className="w-3 h-3 text-red-700" />
                you burn
              </motion.div>
            </div>

            {/* Giant Display Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-cinzel font-bold text-stone-900 tracking-tight leading-[1.08]">
                THE SOLAR <br />
                <span className="italic font-serif font-normal text-amber-700">ASCENT</span> & ZERO-DAY
              </h1>
              <p className="text-lg md:text-xl font-serif text-stone-700 max-w-xl leading-relaxed italic">
                “Audax Icarus alas ceratas admovit” — Tracking the searing frontier of synthetic reasoning, alongside the melting wax of edge infrastructure.
              </p>
            </div>

            {/* Executive Summary bullet extract */}
            <div className="bg-[#EFEAE0] border border-amber-800/20 p-4 rounded-sm space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-amber-900 uppercase font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
                  THREAT LEVEL: {report.threatLevel}
                </span>
                <span>CISA KEV 2026.09</span>
              </div>
              <p className="text-sm font-sans text-stone-800 leading-normal">
                {report.executiveOverview[0]}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="btn-explore-solar-intel"
                onClick={onExploreClick}
                className="group flex items-center gap-2 bg-[#1C1917] text-amber-100 hover:bg-amber-900 px-6 py-3 font-mono text-xs uppercase font-bold tracking-widest rounded-sm transition-all shadow-md hover:shadow-lg"
              >
                <span>Examine Daily Radar</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                id="btn-trigger-open-curtain"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 border border-amber-900/30 hover:border-amber-900/70 bg-amber-100/60 px-4 py-3 font-mono text-xs uppercase font-semibold tracking-wider text-amber-950 rounded-sm transition-colors"
              >
                <Layers className="w-4 h-4 text-amber-800" />
                <span>{isOpen ? 'Close Solar Gate' : 'Open Solar Gate'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: The Kinetic Solar Halo & Icarus Etching */}
          <div className="lg:col-span-6 flex justify-center items-center relative py-6">
            
            <motion.div
              style={{ scale: scaleEffect, opacity: opacityFade }}
              className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] flex items-center justify-center"
            >
              {/* Outer Rotating Solar Ray Starburst (Scroll & Continuous Animation) */}
              <motion.div
                style={{ rotate: heroMode === 'rotate' ? rotateAngle : 0 }}
                animate={heroMode === 'rotate' ? { rotate: [0, 360] } : undefined}
                transition={heroMode === 'rotate' ? { duration: 60, repeat: Infinity, ease: 'linear' } : undefined}
                className="absolute inset-0 pointer-events-none"
              >
                <svg viewBox="0 0 400 400" className="w-full h-full text-amber-500/40">
                  {/* Concentric compass rings */}
                  <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
                  <circle cx="200" cy="200" r="170" fill="none" stroke="#D97706" strokeWidth="0.75" />
                  <circle cx="200" cy="200" r="140" fill="none" stroke="#B45309" strokeWidth="1" strokeDasharray="1 3" />
                  
                  {/* 32 Cadmium Solar Rays radiating outward like the user's reference image */}
                  {Array.from({ length: 32 }).map((_, i) => {
                    const angle = (i * 360) / 32;
                    const isMajor = i % 4 === 0;
                    const isMedium = i % 2 === 0;
                    const length = isMajor ? 65 : isMedium ? 45 : 30;
                    return (
                      <g key={i} transform={`rotate(${angle} 200 200)`}>
                        <polygon
                          points={`196,${200 - 130} 204,${200 - 130} 200,${200 - 130 - length}`}
                          fill={isMajor ? '#F59E0B' : '#FACC15'}
                          opacity={isMajor ? 0.9 : 0.6}
                        />
                        {isMajor && (
                          <line
                            x1="200"
                            y1={200 - 130 - length}
                            x2="200"
                            y2="10"
                            stroke="#D97706"
                            strokeWidth="1"
                            opacity="0.4"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </motion.div>

              {/* Counter-rotating degree ring */}
              <motion.div
                style={{ rotate: counterRotate }}
                className="absolute inset-6 pointer-events-none"
              >
                <svg viewBox="0 0 350 350" className="w-full h-full text-amber-800/30">
                  <circle cx="175" cy="175" r="120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 8" />
                  {/* Cardinal Ticks */}
                  <text x="175" y="45" textAnchor="middle" fill="#78350F" fontSize="9" fontFamily="monospace">N 000°</text>
                  <text x="310" y="179" textAnchor="middle" fill="#78350F" fontSize="9" fontFamily="monospace">E 090°</text>
                  <text x="175" y="315" textAnchor="middle" fill="#78350F" fontSize="9" fontFamily="monospace">S 180°</text>
                  <text x="40" y="179" textAnchor="middle" fill="#78350F" fontSize="9" fontFamily="monospace">W 270°</text>
                </svg>
              </motion.div>

              {/* Central Core: The Radiant Sun & Etching Plate */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 border-4 border-stone-900 shadow-xl flex items-center justify-center overflow-hidden">
                
                {/* Newsprint clipping overlay */}
                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,#1c1917_0px,#1c1917_1px,transparent_1px,transparent_4px)]" />

                {/* Left & Right Opening Wing Gate if mode is 'open' or user toggles */}
                {(heroMode === 'open' || isOpen) && (
                  <>
                    <motion.div
                      style={{ x: leftWingOffset }}
                      animate={isOpen ? { x: -90 } : undefined}
                      className="absolute inset-y-0 left-0 w-1/2 bg-[#E6DEC8] border-r border-amber-900/40 z-20 flex items-center justify-end pr-2 transition-transform duration-700"
                    >
                      <div className="text-[9px] font-mono text-amber-900 rotate-[-90deg] whitespace-nowrap opacity-60">
                        WING // DEXTER
                      </div>
                    </motion.div>
                    <motion.div
                      style={{ x: rightWingOffset }}
                      animate={isOpen ? { x: 90 } : undefined}
                      className="absolute inset-y-0 right-0 w-1/2 bg-[#E6DEC8] border-l border-amber-900/40 z-20 flex items-center justify-start pl-2 transition-transform duration-700"
                    >
                      <div className="text-[9px] font-mono text-amber-900 rotate-[90deg] whitespace-nowrap opacity-60">
                        WING // SINISTER
                      </div>
                    </motion.div>
                  </>
                )}

                {/* Classical Etching of Icarus Gazing Upward toward the sun */}
                <svg viewBox="0 0 200 200" className="w-40 h-40 text-stone-900 relative z-10">
                  {/* Detailed crosshatched portrait silhouette inspired by image 2 */}
                  <g fill="currentColor" stroke="#1C1917" strokeWidth="0.5">
                    {/* Head tilted upward */}
                    <path d="M 90 140 C 85 125, 80 110, 85 95 C 90 80, 100 70, 115 65 C 130 60, 145 68, 150 82 C 155 95, 150 115, 140 128 C 130 140, 115 145, 90 140 Z" opacity="0.85" />
                    {/* Curly classical hair / crown */}
                    <path d="M 115 62 C 110 50, 125 45, 135 52 C 145 45, 158 55, 155 68 C 162 68, 166 78, 160 86 C 155 92, 145 90, 145 80" fill="none" stroke="#1C1917" strokeWidth="2.5" />
                    <path d="M 100 68 C 92 60, 105 52, 112 58" fill="none" stroke="#1C1917" strokeWidth="2" />
                    {/* Upward gaze profile lines */}
                    <path d="M 138 80 L 148 82 L 140 88 L 144 94 L 136 96 L 132 106 L 118 112" fill="none" stroke="#1C1917" strokeWidth="1.5" />
                    {/* Sun rays reflecting off the face */}
                    <line x1="120" y1="40" x2="135" y2="60" stroke="#FBBF24" strokeWidth="2" />
                    <line x1="140" y1="35" x2="145" y2="55" stroke="#FBBF24" strokeWidth="2" />
                    <line x1="160" y1="45" x2="155" y2="65" stroke="#FBBF24" strokeWidth="2" />
                  </g>
                  {/* Subtle Latin inscription in the core */}
                  <text x="100" y="180" textAnchor="middle" fontSize="7" fontFamily="Cinzel, serif" fill="#1C1917" letterSpacing="2">
                    LIBER PRIMVS • SOL
                  </text>
                </svg>

                {/* Monogram stamp bottom-left like "MM" in reference image 2 */}
                <div className="absolute bottom-2 left-3 font-serif font-bold text-xs tracking-tighter opacity-80 text-stone-900 border border-stone-900 px-1 py-0.5">
                  MM
                </div>

                {/* Live Defcon Ring Indicator */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-stone-900 text-amber-300 text-[9px] font-mono px-1.5 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>D-3</span>
                </div>

              </div>

              {/* Orbiting Satellite Data Pill */}
              <motion.div
                animate={{
                  x: [0, 8, -8, 0],
                  y: [0, -6, 6, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 sm:bottom-0 sm:left-0 bg-white border border-stone-900 shadow-lg px-3 py-1.5 rounded-sm font-mono text-[11px] flex items-center gap-2 z-30"
              >
                <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin" style={{ animationDuration: '16s' }} />
                <span>FLIGHT ALTITUDE: 14,200m</span>
              </motion.div>

              {/* Rotating Audio/Frequency Pill on right */}
              <div className="absolute -top-2 -right-4 sm:top-2 sm:right-0 bg-stone-900 text-amber-100 px-3 py-1.5 rounded-sm font-mono text-[10px] tracking-wider uppercase border border-amber-500/40 z-30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>SOLAR INTEL FEED</span>
              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};
