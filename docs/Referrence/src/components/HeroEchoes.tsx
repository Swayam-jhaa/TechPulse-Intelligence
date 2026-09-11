import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Activity, Radio, ArrowUpRight, Crosshair, Barcode, Shield } from 'lucide-react';
import { DailyReport } from '../types';

interface HeroEchoesProps {
  report: DailyReport;
  heroMode: 'rotate' | 'open' | 'waveform';
  onExploreClick: () => void;
}

export const HeroEchoes: React.FC<HeroEchoesProps> = ({ report, heroMode, onExploreClick }) => {
  const { scrollY } = useScroll();
  const [waveSeed, setWaveSeed] = useState(0);

  // Dynamic waveform oscillation
  useEffect(() => {
    const timer = setInterval(() => {
      setWaveSeed((s) => (s + 1) % 100);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  const haloRotate = useTransform(scrollY, [0, 800], [0, 45]);
  const haloTilt = useTransform(scrollY, [0, 800], [12, -6]);
  const bustScale = useTransform(scrollY, [0, 400], [1, 0.94]);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 md:px-8 border-b border-stone-300 bg-[#ECEAE4] text-[#111113] select-none">
      
      {/* Editorial poster grid marks and crosshairs inspired by reference image 1 */}
      <div className="absolute top-6 left-6 text-stone-400 pointer-events-none hidden sm:block">
        <div className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase">
          <Crosshair className="w-3.5 h-3.5" />
          <span>RAVE CULTURE // CONNECTING MINDS</span>
        </div>
      </div>

      <div className="absolute top-6 right-6 text-stone-400 pointer-events-none hidden sm:block">
        <div className="font-mono text-[9px] tracking-widest uppercase text-right">
          OF THE FREQUENCY •••
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Editorial Subheader row */}
        <div className="flex flex-wrap items-center justify-between border-b border-stone-300 pb-3 mb-6 text-xs font-mono tracking-wider">
          <div className="flex items-center gap-4">
            <span className="font-bold tracking-widest uppercase text-stone-900">
              VOL.01
            </span>
            <span className="text-stone-400">|</span>
            <span className="text-stone-600">52.5200° N, 13.4050° E</span>
            <span className="text-stone-400 hidden md:inline">|</span>
            <span className="text-stone-600 hidden md:inline">DARK TECHNO • HYPNOTIC • RAW ENERGY</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="font-mono font-bold bg-stone-900 text-stone-100 px-2 py-0.5">
              LINE UP: MIND AGAINST • ØOSTIL • ANNA • RECONDITE
            </span>
          </div>
        </div>

        {/* Main Grid: Condensed Poster Title + Classical Statue with Waveform Halo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Bold Condensed Typography & Epigraphs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Monumental Condensed Headline: "ECHOES" */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase bg-stone-900 text-white px-2 py-0.5">
                  FREQUENCY DISPATCH
                </span>
                <span className="text-xs font-mono text-stone-500">24 / 05 / 26</span>
              </div>

              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-[#111113] leading-none uppercase">
                ECHØES
              </h1>
              
              <div className="flex items-center gap-2 pt-1 font-mono text-xs uppercase tracking-widest text-stone-600">
                <span>SOUND IS THE LANGUAGE OF THE SOUL.</span>
                <span className="w-12 h-[1px] bg-stone-900" />
              </div>
            </div>

            {/* Classical Cyber Threat Manifest */}
            <div className="border border-stone-400 bg-white/70 p-5 rounded-none space-y-3 shadow-sm backdrop-blur-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-xs font-mono">
                <span className="font-bold flex items-center gap-1.5 text-stone-900">
                  <Activity className="w-4 h-4 text-stone-900" />
                  RECONNAISSANCE TELEMETRY
                </span>
                <span className="text-stone-500">CYCLE 2026.09</span>
              </div>
              <p className="text-sm font-sans text-stone-800 leading-relaxed">
                {report.executiveOverview[0]}
              </p>
              <div className="flex items-center justify-between pt-1 text-xs font-mono text-stone-600">
                <span>DEFCON STATUS: {report.defconLevel}</span>
                <span>ACTIVE KEV: {report.activeExploitsCount}</span>
                <span>AI PAPERS: {report.modelReleasesCount}</span>
              </div>
            </div>

            {/* Poster Details: Barcode, Coordinates, Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                id="btn-inspect-echoes"
                onClick={onExploreClick}
                className="flex items-center gap-2 bg-[#111113] text-stone-100 hover:bg-stone-800 px-6 py-3 font-mono text-xs uppercase font-bold tracking-widest transition-all"
              >
                <span>Enter Threat Arena</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* Barcode graphic like bottom-right of reference image 1 */}
              <div className="flex items-center gap-2 font-mono text-[10px] text-stone-600">
                <div className="flex items-center gap-[2px] h-6">
                  {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 2, 4, 1, 3].map((w, i) => (
                    <div
                      key={i}
                      className="bg-stone-900 h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <div className="flex flex-col text-[8px] uppercase">
                  <span>TICKETS LIMITED</span>
                  <span>SEC-LOC #5200</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Classical Marble Bust with Glowing Waveform Halo */}
          <div className="lg:col-span-6 flex justify-center items-center relative py-4">
            
            <motion.div
              style={{ scale: bustScale }}
              className="relative w-72 h-80 sm:w-96 sm:h-[440px] flex items-center justify-center"
            >
              
              {/* Marble Bust Illustration in Monochrome Alabaster & Charcoal */}
              <div className="relative w-64 sm:w-80 h-full flex items-center justify-center">
                <svg viewBox="0 0 300 400" className="w-full h-full text-stone-800 drop-shadow-md">
                  <defs>
                    <linearGradient id="marbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="40%" stopColor="#E2E0D8" />
                      <stop offset="80%" stopColor="#C4C2B8" />
                      <stop offset="100%" stopColor="#8E8B82" />
                    </linearGradient>
                    <filter id="graniteNoise">
                      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0" />
                      <feComposite in2="SourceGraphic" in="gl" operator="in" />
                    </filter>
                  </defs>

                  {/* Classical Marble Pedestal / Shoulders */}
                  <path
                    d="M 60 360 C 80 320, 110 300, 150 295 C 190 300, 220 320, 240 360 L 250 395 L 50 395 Z"
                    fill="url(#marbleGradient)"
                    stroke="#2D2B28"
                    strokeWidth="1.5"
                  />

                  {/* Muscular neck & chin */}
                  <path
                    d="M 120 295 L 120 220 C 120 185, 140 175, 150 175 C 160 175, 180 185, 180 220 L 180 295 Z"
                    fill="url(#marbleGradient)"
                    stroke="#2D2B28"
                    strokeWidth="1"
                  />

                  {/* Sculpted Head (Turned slightly 3/4 upward like David in Image 1) */}
                  <path
                    d="M 105 180 C 95 130, 110 85, 150 80 C 195 75, 210 120, 205 175 C 200 205, 180 225, 150 225 C 120 225, 110 205, 105 180 Z"
                    fill="url(#marbleGradient)"
                    stroke="#1E1D1B"
                    strokeWidth="2"
                  />

                  {/* Renaisssance Carved Curls & Locks of Hair */}
                  <g fill="#A8A49A" stroke="#1E1D1B" strokeWidth="1.5">
                    <circle cx="120" cy="80" r="14" />
                    <circle cx="140" cy="72" r="16" />
                    <circle cx="165" cy="74" r="15" />
                    <circle cx="185" cy="85" r="14" />
                    <circle cx="198" cy="105" r="13" />
                    <circle cx="108" cy="100" r="12" />
                    <circle cx="112" cy="120" r="11" />
                    <circle cx="196" cy="125" r="12" />
                    <path d="M 130 90 Q 150 100 170 90" fill="none" stroke="#1E1D1B" strokeWidth="2" />
                  </g>

                  {/* Facial Features: Classical Straight Nose, Defined Jaw */}
                  <g stroke="#1E1D1B" strokeWidth="1.5" fill="none">
                    {/* Jawline contour */}
                    <path d="M 115 175 C 125 205, 140 215, 152 215 C 165 215, 185 200, 195 170" />
                    {/* Lips */}
                    <path d="M 142 195 Q 152 198 162 195" />
                    <path d="M 145 198 Q 152 201 159 198" />
                    {/* Nose Bridge */}
                    <path d="M 152 145 L 152 178 L 158 178" />
                  </g>

                  {/* Classical Inscription on stone chest */}
                  <text x="150" y="340" textAnchor="middle" fontSize="8" fontFamily="Cinzel, serif" fill="#111113" letterSpacing="3">
                    ECHØ • FREQ • 01
                  </text>
                </svg>

                {/* THE GLOWING FREQUENCY SOUNDWAVE HALO (Exactly like Reference Image 1) */}
                <motion.div
                  style={{
                    rotate: haloRotate,
                    rotateX: haloTilt
                  }}
                  className="absolute top-[135px] sm:top-[160px] left-1/2 -translate-x-1/2 w-[280px] sm:w-[340px] pointer-events-none z-30"
                >
                  {/* Glowing halo ring container */}
                  <div className="relative py-2 flex items-center justify-center">
                    
                    {/* Glowing outer backdrop bloom */}
                    <div className="absolute inset-0 bg-white/70 blur-md rounded-full" />

                    {/* Oscillating Soundwave Audio Bars */}
                    <div className="relative flex items-center justify-center gap-[2px] sm:gap-[3px] px-4 py-1.5 bg-white/90 border border-white shadow-[0_0_20px_rgba(255,255,255,0.9)] rounded-full backdrop-blur-sm">
                      {Array.from({ length: 42 }).map((_, i) => {
                        // Dynamic frequency bar calculation
                        const centerDist = Math.abs(i - 21);
                        const baseHeight = Math.max(4, 28 - centerDist * 1.1);
                        const dynamicJitter = ((i * 7 + waveSeed * 4) % 15) - 7;
                        const height = Math.max(3, baseHeight + dynamicJitter);
                        
                        return (
                          <div
                            key={i}
                            className="w-[3px] bg-stone-900 rounded-full transition-all duration-100"
                            style={{ height: `${height}px` }}
                          />
                        );
                      })}
                    </div>

                    {/* Orbiting Frequency Text Tag */}
                    <div className="absolute -bottom-5 right-2 bg-stone-900 text-white font-mono text-[9px] px-1.5 py-0.5 tracking-widest uppercase">
                      FREQUENCY 142.8 MHZ
                    </div>

                  </div>
                </motion.div>

                {/* Left Side Metadata Callout (Image 1 style) */}
                <div className="absolute top-20 -left-6 hidden sm:block font-mono text-[9px] text-stone-500 space-y-1">
                  <p className="font-bold text-stone-900">DATE</p>
                  <p className="text-xl font-bold text-stone-900 leading-none">24</p>
                  <p className="text-xl font-bold text-stone-900 leading-none">05</p>
                  <p className="text-xl font-bold text-stone-900 leading-none">26</p>
                </div>

                {/* Right Side Coordinate Stamp */}
                <div className="absolute bottom-16 -right-6 hidden sm:block font-mono text-[9px] text-stone-500 text-right space-y-1">
                  <p className="font-bold text-stone-900">STATION</p>
                  <p>BERLIN</p>
                  <p>52.5200° N</p>
                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};
