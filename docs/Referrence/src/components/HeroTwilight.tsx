import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Flame, ShieldAlert, Sparkles, Feather } from 'lucide-react';
import { DailyReport } from '../types';

interface HeroTwilightProps {
  report: DailyReport;
  heroMode: 'rotate' | 'open' | 'waveform';
  onExploreClick: () => void;
}

export const HeroTwilight: React.FC<HeroTwilightProps> = ({ report, heroMode, onExploreClick }) => {
  const { scrollY } = useScroll();
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);

  // Scroll animations
  const fallY = useTransform(scrollY, [0, 800], [0, 180]);
  const featherDrift = useTransform(scrollY, [0, 800], [0, 240]);
  const sunRotate = useTransform(scrollY, [0, 1000], [0, 180]);
  const beamOpacity = useTransform(scrollY, [0, 400], [0.85, 0.4]);

  // Curtain parting
  const leftCloudPart = useTransform(scrollY, [0, 300], [0, -100]);
  const rightCloudPart = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <section className="relative overflow-hidden pt-10 pb-20 px-4 sm:px-6 md:px-8 border-b border-amber-500/20 bg-gradient-to-b from-[#180B05] via-[#2B1208] to-[#120603] text-[#FEF3C7] select-none">
      
      {/* Volumetric golden divine sunbeam descending from heaven */}
      <motion.div
        style={{ opacity: beamOpacity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-72 sm:w-96 md:w-[600px] h-[550px] pointer-events-none z-0 bg-gradient-to-b from-amber-400/25 via-amber-600/10 to-transparent blur-2xl"
      />

      {/* Atmospheric terracotta storm clouds in background (SVG layers) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <svg viewBox="0 0 1440 600" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="cloudGlow" cx="50%" cy="20%" r="50%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#78350F" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1E0A04" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M0,450 C320,380 420,520 720,440 C1020,360 1150,480 1440,410 L1440,600 L0,600 Z" fill="#381507" />
          <path d="M0,490 C280,440 500,560 820,490 C1120,420 1280,540 1440,480 L1440,600 L0,600 Z" fill="#240D04" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top telemetry bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-amber-600/20 pb-4 mb-8 text-xs font-mono tracking-wider">
          <div className="flex items-center gap-3">
            <span className="bg-amber-600 text-stone-950 px-2 py-0.5 font-bold uppercase tracking-widest text-[10px]">
              ACTVS II • THE FALL
            </span>
            <span className="text-amber-300/80">{report.date}</span>
            <span className="hidden sm:inline text-amber-500/40">•</span>
            <span className="text-amber-400">DEFCON {report.defconLevel}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-amber-200">
              <Flame className="w-3 h-3 text-red-500" />
              EXPLOITS IN-WILD: <strong className="text-amber-400 ml-1">{report.activeExploitsCount}</strong>
            </span>
            <span className="hidden md:inline text-amber-300/60 font-mono">
              ALTITUDE LOSS: -4,800M/S
            </span>
          </div>
        </div>

        {/* Hero Stage: Centered Golden Sun + Descending Icarus */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-10">
          
          {/* Poetic Inscription from reference image 3 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <p className="font-serif italic text-2xl sm:text-3xl text-amber-300/90 tracking-[0.2em] uppercase font-light">
              So close....yet so far...
            </p>
            <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-2" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-cinzel font-black tracking-tight text-amber-100 leading-[1.08]">
            THE DESCENT OF HUBRIS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 font-serif font-normal italic">
              MELTED WAX &amp; ZERO-DAYS
            </span>
          </h1>

          <p className="text-base sm:text-lg font-serif text-amber-200/80 max-w-2xl mx-auto leading-relaxed italic">
            “He flapped his bare arms, but lacking wings, they found no purchase in the air.” — An intelligence briefing on systemic overreach, edge vulnerabilities, and defensive containment.
          </p>

        </div>

        {/* The Visual Masterpiece Container (Sun + Falling Figure) */}
        <div className="relative w-full max-w-2xl mx-auto h-[340px] sm:h-[400px] flex items-center justify-center">
          
          {/* The Radiant Celestial Sun at top (Image 3 exact aesthetic) */}
          <motion.div
            style={{ rotate: heroMode === 'rotate' ? sunRotate : 0 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-60 sm:h-60 pointer-events-none"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full text-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]">
              {/* Dense spiky needle sunburst rays */}
              {Array.from({ length: 48 }).map((_, i) => {
                const angle = (i * 360) / 48;
                const len = i % 3 === 0 ? 32 : i % 2 === 0 ? 22 : 14;
                return (
                  <line
                    key={i}
                    x1="100"
                    y1={100 - 55}
                    x2="100"
                    y2={100 - 55 - len}
                    stroke="#FDE047"
                    strokeWidth={i % 3 === 0 ? "1.5" : "0.75"}
                    transform={`rotate(${angle} 100 100)`}
                  />
                );
              })}
              {/* Outer halo ring */}
              <circle cx="100" cy="100" r="54" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 3" />
              {/* Inner glowing golden disk */}
              <circle cx="100" cy="100" r="48" fill="url(#sunGoldGradient)" stroke="#FEF08A" strokeWidth="2" />
              <defs>
                <radialGradient id="sunGoldGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Falling Winged Icarus Silhouette (Animated drift + scroll-linked descent) */}
          <motion.div
            style={{ y: fallY }}
            animate={{
              rotate: [-4, 4, -4],
              x: [-10, 10, -10]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-28 sm:top-32 left-1/2 -translate-x-1/2 w-44 sm:w-56 h-48 sm:h-56 z-20"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full text-amber-100 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              {/* Intricately detailed woodcut engraving silhouette of falling winged angel / Icarus */}
              <g fill="#FEF3C7" stroke="#78350F" strokeWidth="0.75">
                {/* Outstretched feathered wing - sinister */}
                <path d="M 95 90 C 80 70, 50 50, 25 55 C 20 70, 30 100, 55 120 C 70 125, 85 110, 95 90 Z" opacity="0.95" />
                {/* Wing feather detailing */}
                <line x1="28" y1="60" x2="65" y2="95" stroke="#78350F" strokeWidth="1" />
                <line x1="38" y1="75" x2="72" y2="105" stroke="#78350F" strokeWidth="1" />
                <line x1="48" y1="95" x2="80" y2="115" stroke="#78350F" strokeWidth="1" />

                {/* Second wing tilted downward */}
                <path d="M 125 90 C 145 75, 175 80, 185 105 C 175 120, 150 140, 130 135 C 120 125, 120 105, 125 90 Z" opacity="0.9" />
                <line x1="175" y1="95" x2="140" y2="115" stroke="#78350F" strokeWidth="1" />
                <line x1="165" y1="115" x2="135" y2="128" stroke="#78350F" strokeWidth="1" />

                {/* Body tumbling downward, head back, reach out arm */}
                {/* Head */}
                <circle cx="105" cy="72" r="10" />
                {/* Torso */}
                <path d="M 100 80 C 110 82, 115 100, 110 115 C 105 125, 95 125, 95 110 Z" />
                {/* Legs kicking up */}
                <path d="M 108 115 L 125 140 L 132 135" stroke="#78350F" strokeWidth="3" fill="none" />
                <path d="M 98 120 L 102 150 L 110 152" stroke="#78350F" strokeWidth="2.5" fill="none" />
                {/* Outstretched hand reaching back to the sun */}
                <path d="M 102 78 L 88 62 L 80 58" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>

              {/* Melting droplets / wax fragments */}
              <circle cx="92" cy="75" r="2" fill="#FBBF24" />
              <circle cx="85" cy="85" r="1.5" fill="#F59E0B" />
              <circle cx="115" cy="130" r="2.5" fill="#D97706" />
              <circle cx="130" cy="145" r="1.8" fill="#FBBF24" />
            </svg>
          </motion.div>

          {/* Drifting Feathers across the sky */}
          <motion.div
            style={{ y: featherDrift }}
            animate={{ x: [-20, 20, -20], rotate: [-15, 15, -15] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-12 sm:left-24 text-amber-400/70"
          >
            <Feather className="w-6 h-6" />
          </motion.div>
          <motion.div
            style={{ y: featherDrift }}
            animate={{ x: [15, -15, 15], rotate: [20, -20, 20] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-36 right-16 sm:right-32 text-amber-500/60"
          >
            <Feather className="w-5 h-5" />
          </motion.div>

          {/* Parting Terracotta Clouds if heroMode === 'open' or on scroll */}
          {(heroMode === 'open' || isCurtainOpen) && (
            <>
              <motion.div
                style={{ x: leftCloudPart }}
                className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#240D04] to-transparent z-30 pointer-events-none"
              />
              <motion.div
                style={{ x: rightCloudPart }}
                className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#240D04] to-transparent z-30 pointer-events-none"
              />
            </>
          )}

        </div>

        {/* Bottom Poetic Status Strip */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-[#240E06]/80 border border-amber-500/20 p-4 rounded-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 block mb-1">
              THE WAX (EDGE EXPLOITS)
            </span>
            <p className="text-xs text-amber-100/90 font-sans leading-relaxed">
              2 pre-auth RCEs added to KEV catalog. Network boundary edge firewalls actively weaponized.
            </p>
          </div>

          <div className="bg-[#240E06]/80 border border-amber-500/20 p-4 rounded-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 block mb-1">
              THE SUN (AI FRONTIER)
            </span>
            <p className="text-xs text-amber-100/90 font-sans leading-relaxed">
              Continuous diffusion trajectory reasoning models bypass the token length barrier.
            </p>
          </div>

          <div className="bg-[#240E06]/80 border border-amber-500/20 p-4 rounded-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 block mb-1">
                SYSTEM REMEDIATION
              </span>
              <p className="text-xs text-amber-100/90 font-sans leading-relaxed">
                Execute emergency lockdown on management webhooks within 48h.
              </p>
            </div>
            <button
              id="btn-inspect-twilight-telemetry"
              onClick={onExploreClick}
              className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-mono font-bold text-xs uppercase py-2 px-3 rounded-sm hover:from-amber-500 hover:to-amber-400 transition-all shadow-md"
            >
              <span>Examine Vulnerabilities</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
