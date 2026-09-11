import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Volume2, VolumeX, Radio, Globe, Crosshair, Sparkles, ArrowDown, Activity, Zap, Sliders, Shield, ArrowUpRight } from 'lucide-react';
import { toggleFrequencyAudio, isAudioActive, updateFrequency } from '../utils/audioSynth';
import { DailyReport } from '../types';
import { MichelangeloHalfStatue } from './MichelangeloHalfStatue';

interface IcarusBustHeroProps {
  report: DailyReport;
  onExploreRadar: () => void;
  onOpenMythos: () => void;
}

export const IcarusBustHero: React.FC<IcarusBustHeroProps> = ({
  report,
  onExploreRadar,
  onOpenMythos
}) => {
  const [audioPlaying, setAudioPlaying] = useState(isAudioActive());
  const [frequencyValue, setFrequencyValue] = useState(142.8);
  const [waveSeed, setWaveSeed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse interactive 3D parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(smoothMouseX, [-350, 350], [-10, 10]);
  const rotateX = useTransform(smoothMouseY, [-350, 350], [8, -8]);
  const haloTilt = useTransform(smoothMouseY, [-350, 350], [18, -4]);

  // Dynamic audio oscillation
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveSeed((prev) => (prev + 1) % 100);
    }, 85);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleAudioToggle = () => {
    const active = toggleFrequencyAudio(frequencyValue);
    setAudioPlaying(active);
  };

  const handleFrequencyChange = (val: number) => {
    setFrequencyValue(val);
    updateFrequency(val);
  };

  const presets = [
    { hz: 71.4, name: 'SUB-DRIFT' },
    { hz: 142.8, name: 'SOLAR APEX' },
    { hz: 214.2, name: 'HARMONIC' }
  ];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[94vh] w-full flex flex-col justify-between overflow-hidden pt-20 pb-8 px-4 sm:px-6 md:px-12 select-none"
      style={{
        // Architectural stone-grey with progressive intensity transition
        background: 'linear-gradient(135deg, #D6D4CD 0%, #CCC8BE 35%, #B5B2A8 70%, #8C897F 100%)'
      }}
    >
      {/* Light ray beam piercing from top-left (Directional museum gallery spotlight) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35 mix-blend-overlay"
        style={{
          background: 'radial-gradient(ellipse 75% 55% at 22% 0%, rgba(255,255,255,0.95) 0%, transparent 70%)'
        }}
      />

      {/* Subtle tactile poster grain overlay */}
      <div className="absolute inset-0 pointer-events-none bg-grain opacity-50" />

      {/* Crosshairs & Editorial Header Marks */}
      <div className="relative z-20 max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono tracking-widest text-[#242322] border-b border-[#242322]/20 pb-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-[#1A1A1C]" />
          <span className="font-bold uppercase tracking-[0.25em] text-[11px]">
            RAVE CULTURE // CONNECTING MINDS
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[10px] uppercase tracking-[0.3em]">
          <span>INTEL DEFCON 0{report.defconLevel}</span>
          <span>•</span>
          <span>OF THE FREQUENCY •••</span>
        </div>
      </div>

      {/* Giant Monolithic Poster Backdrop Typography: "ECHØES" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0">
        <h1
          className="text-[19vw] sm:text-[20vw] lg:text-[21vw] font-display font-black leading-none tracking-tighter text-[#1C1C1E]/80 select-none"
          style={{
            textShadow: '0 2px 25px rgba(0,0,0,0.08)',
            letterSpacing: '-0.06em'
          }}
        >
          ECHØES
        </h1>
      </div>

      {/* CENTER VIEWPORT: THE HALF-STATUE AND THE INTEGRATED AUDIO RESONANCE DOCK */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-2 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* LEFT DOCK: SITUATION BRIEFING CAPSULE */}
        <div className="hidden lg:flex flex-col w-72 space-y-4 text-xs font-mono text-[#242322]">
          <div className="bg-white/80 border border-[#222]/20 p-4 shadow-sm backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between border-b border-stone-300 pb-1.5">
              <span className="font-bold flex items-center gap-1.5 text-[#111]">
                <Shield className="w-3.5 h-3.5 text-red-700" />
                STATUS TELEMETRY
              </span>
              <span className="bg-red-700 text-white px-1.5 py-0.2 text-[10px] font-bold">
                DEFCON 0{report.defconLevel}
              </span>
            </div>

            <p className="text-[11px] font-sans text-stone-700 leading-relaxed">
              {report.activeExploitsCount} CISA KEV zero-day exploits active in production runtimes. Memory barriers breached under high solar frequency.
            </p>

            <div className="pt-1 flex items-center justify-between text-[10px]">
              <span className="text-stone-500">AI PAPERS: {report.modelReleasesCount}</span>
              <button
                onClick={onExploreRadar}
                className="text-stone-900 font-bold hover:underline flex items-center gap-1"
              >
                <span>Examine</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-black/80 text-white p-3.5 border border-black space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 block font-mono">
              THE ICARUS PARADOX
            </span>
            <p className="text-[11px] font-serif italic text-stone-200 leading-snug">
              “When systems fly too close to algorithmic suns, defensive wax melts first.”
            </p>
          </div>
        </div>

        {/* CENTER: THE CLASSICAL HALF STATUE WITH GLOWING HALO */}
        <div className="relative flex items-center justify-center">
          <MichelangeloHalfStatue
            rotateX={rotateX}
            rotateY={rotateY}
            haloTilt={haloTilt}
            audioPlaying={audioPlaying}
            frequencyValue={frequencyValue}
            waveSeed={waveSeed}
            onToggleAudio={handleAudioToggle}
          />
        </div>

        {/* RIGHT DOCK: THE ACOUSTIC RESONANCE SUITE (Directly beside the statue's raised hand) */}
        <div className="w-full sm:w-80 lg:w-76 flex flex-col space-y-3.5 font-mono text-xs text-[#222120]">
          
          {/* Main Audio Control Card */}
          <div className="bg-white/90 border border-[#222120]/25 p-4 sm:p-5 shadow-lg backdrop-blur-md space-y-4">
            
            {/* Header with Live Waveform Graphic */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${audioPlaying ? 'text-emerald-600 animate-pulse' : 'text-stone-500'}`} />
                <div>
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#111] block leading-none">
                    ACOUSTIC DOCK
                  </span>
                  <span className="text-[9px] text-stone-500">
                    {audioPlaying ? 'RESONATING LIVE' : 'SYNTHESIS STANDBY'}
                  </span>
                </div>
              </div>

              {/* Live Oscillo mini bars */}
              <div className="flex items-end gap-[2px] h-5">
                {[12, 18, 8, 22, 14, 20, 10, 16].map((h, i) => (
                  <div
                    key={i}
                    className={`w-[2.5px] rounded-xs transition-all duration-100 ${
                      audioPlaying ? 'bg-emerald-600' : 'bg-stone-400'
                    }`}
                    style={{
                      height: audioPlaying
                        ? `${Math.max(4, (h + (waveSeed * 3) % 15))}px`
                        : `${h / 2}px`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Prominent Audio Toggle Button */}
            <button
              id="btn-engage-statue-drone"
              onClick={handleAudioToggle}
              className={`w-full py-3 px-4 rounded-none font-mono text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-md ${
                audioPlaying
                  ? 'bg-[#111113] text-white border border-[#111113] ring-2 ring-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-[#161518] text-[#FAF8F5] hover:bg-stone-900 border border-black'
              }`}
            >
              {audioPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>DISENGAGE FREQUENCY</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-stone-400" />
                  <span>ENGAGE FREQUENCY DRONE</span>
                </>
              )}
            </button>

            {/* Interactive Live Tuner Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-600 uppercase font-bold flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-[#111]" />
                  TUNER
                </span>
                <span className="bg-[#111113] text-white px-2 py-0.5 font-bold tracking-widest text-[10px]">
                  {frequencyValue.toFixed(1)} MHZ
                </span>
              </div>

              <input
                type="range"
                min="70"
                max="280"
                step="0.5"
                value={frequencyValue}
                onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
                className="w-full accent-[#111113] cursor-pointer"
              />

              <div className="flex justify-between text-[9px] text-stone-500">
                <span>70.0 MHz</span>
                <span className="text-stone-800 font-bold">142.8 Apex</span>
                <span>280.0 MHz</span>
              </div>
            </div>

            {/* Harmonic Frequency Quick-Select Presets */}
            <div className="space-y-1 pt-1">
              <span className="text-[9px] uppercase tracking-wider text-stone-500 block">
                HARMONIC PRESETS
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                {presets.map((p) => {
                  const isCurrent = Math.abs(frequencyValue - p.hz) < 1;
                  return (
                    <button
                      key={p.hz}
                      onClick={() => handleFrequencyChange(p.hz)}
                      className={`py-1 px-1 text-center font-bold border transition-all ${
                        isCurrent
                          ? 'bg-[#111113] text-white border-[#111113]'
                          : 'bg-stone-100 hover:bg-white text-stone-800 border-stone-300'
                      }`}
                    >
                      <div>{p.hz}M</div>
                      <div className="text-[8px] opacity-70 tracking-tighter">{p.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Shortcuts directly below audio dock */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
              <button
                onClick={onExploreRadar}
                className="text-stone-900 font-bold hover:underline flex items-center gap-1"
              >
                <span>Threat Radar</span>
                <ArrowDown className="w-3 h-3" />
              </button>
              <span className="text-stone-400">|</span>
              <button
                onClick={onOpenMythos}
                className="text-stone-700 hover:text-stone-950 hover:underline"
              >
                The Mythos
              </button>
            </div>

          </div>

          {/* Mini Sound Credo Tag */}
          <div className="hidden sm:block text-center text-[10px] text-stone-600 font-serif italic">
            “Sound is the language of the soul.”
          </div>

        </div>

      </div>

      {/* POSTER SURROUNDING METADATA (Swiss/Brutalist Technical Grid) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-4 border-t border-[#242322]/20 font-mono text-xs text-[#242322]">
        
        {/* Left Column: Philosophical Credo & Music Lineup */}
        <div className="md:col-span-5 space-y-2.5">
          <div className="space-y-1">
            <p className="font-bold tracking-widest text-[#111113] text-sm uppercase">
              SOUND IS THE LANGUAGE OF THE SOUL.
            </p>
            <div className="w-16 h-[2px] bg-[#111113]" />
          </div>

          <p className="text-[11px] leading-relaxed text-[#3A3835] max-w-md">
            DARK TECHNO • HYPNOTIC • RAW ENERGY • NO LIMITS // DISPATCH 2026.09. ACTIVE DEFCON 0{report.defconLevel} TELEMETRY ACROSS CISA KEV &amp; FRONTIER AI REASONING.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-[10px]">
            <span className="bg-[#111113] text-white px-1.5 py-0.5 font-bold uppercase">
              LINE UP
            </span>
            <span className="font-semibold text-[#1C1C1E]">
              MIND AGAINST • ØOSTIL • ANNA • RECONDITE
            </span>
          </div>

          {/* Grayscale Calibration Strip from poster */}
          <div className="flex items-center gap-1 pt-0.5">
            {['#000', '#222', '#444', '#666', '#888', '#AAA', '#CCC', '#FFF'].map((c, i) => (
              <div key={i} className="w-3.5 h-2.5 border border-stone-600/40" style={{ backgroundColor: c }} />
            ))}
            <span className="text-[9px] opacity-60 ml-1">CALIB.01 // SYSTEM STABLE</span>
          </div>
        </div>

        {/* Center-Right Column: Location Coordinates, Vol/Date & Barcode */}
        <div className="md:col-span-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#111113] block">BERLIN // SECRET LOCATION</span>
            <span className="text-[10px] text-[#4A4742] block">52.5200° N, 13.4050° E • TRANSMISSION TOWER</span>
            <span className="text-[10px] text-[#555] block">CARRIER: 142.8 MHZ • SOLAR CYCLE 25</span>
          </div>

          <div className="flex flex-col items-start sm:items-end space-y-1.5 text-left sm:text-right">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-xs text-[#555]">VOL.</span>
              <span className="text-2xl font-bold text-[#111113] leading-none">01</span>
              <span className="text-xs text-[#555] ml-2">DATE</span>
              <span className="text-xl font-bold text-[#111113] leading-none">24 • 05 • 26</span>
            </div>

            {/* Barcode Graphic from reference image */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex flex-col text-[8px] uppercase tracking-tighter text-[#444]">
                <span>TICKETS LIMITED</span>
                <span>ICARUS // REC</span>
              </div>

              <div className="flex items-center gap-[1.5px] h-7 bg-white/50 p-1 border border-[#222]/20">
                {[3, 1, 2, 4, 1, 3, 2, 5, 1, 2, 4, 2, 1, 3, 2, 4, 1, 2].map((w, i) => (
                  <div
                    key={i}
                    className="bg-[#111113] h-full"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
