import React, { useState } from 'react';
import { Feather, Sun, AlertTriangle, Compass, Volume2, VolumeX, Radio, Sparkles, Barcode } from 'lucide-react';
import { toggleFrequencyAudio, isAudioActive, updateFrequency } from '../utils/audioSynth';

export const MythosView: React.FC = () => {
  const [audioPlaying, setAudioPlaying] = useState(isAudioActive());
  const [activeFrequency, setActiveFrequency] = useState(142.8);

  const handleToggle = (freq: number) => {
    setActiveFrequency(freq);
    if (audioPlaying && freq === activeFrequency) {
      // Toggle off
      toggleFrequencyAudio();
      setAudioPlaying(false);
    } else if (audioPlaying) {
      // Modulate frequency in real time
      updateFrequency(freq);
    } else {
      // Turn on at this frequency
      const active = toggleFrequencyAudio(freq);
      setAudioPlaying(active);
    }
  };

  const frequencies = [
    { hz: 71.4, name: 'SUB HARMONIC // DEEP DRIFT', desc: 'Resonance of early mainframe architectures and low-level kernel interrupts.' },
    { hz: 142.8, name: 'THE GOLDEN RATIO // SOLAR APEX', desc: 'The baseline frequency of the Icarus halo—resonant, hypnotic, raw energy.' },
    { hz: 285.6, name: 'ECHØ HARMONIC // HIGH CARRIER', desc: 'Over-the-horizon transmission monitoring edge vulnerabilities and model weights.' }
  ];

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-12 select-none"
      style={{
        // Intensity increase across the page: starts in stone grey and transitions toward deep graphite
        background: 'linear-gradient(145deg, #CCCAC3 0%, #B4B1A7 35%, #8A877F 70%, #29282C 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Editorial Header */}
        <div className="border-b border-[#252422]/25 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-[#161517]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#3F3D38] mb-1">
              <span>SECTION 03 // ALLEGORICAL ATLAS</span>
              <span>•</span>
              <span>PHILOSOPHY OF FLIGHT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#111113] uppercase">
              THE ICARUS MYTHOS
            </h2>
          </div>

          <div className="font-mono text-xs text-[#333] text-right">
            <span className="block font-bold">CREED:</span>
            <span className="italic">“Sound is the language of the soul.”</span>
          </div>
        </div>

        {/* The Classical Epigraph */}
        <div className="bg-white/80 border border-[#252422]/20 p-6 md:p-8 rounded-none shadow-sm backdrop-blur-xs space-y-3 text-[#1C1B19]">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-stone-600 block">
            OVID // METAMORPHOSES, BOOK VIII
          </span>
          <blockquote className="text-xl sm:text-2xl font-serif italic text-stone-900 leading-snug">
            “Fly between the two: neither so low that the spray dampens your feathers, nor so high that the sun melts their binding wax.”
          </blockquote>
          <p className="text-xs sm:text-sm font-sans text-stone-700 leading-relaxed pt-2">
            In classical antiquity, Daedalus fashioned wings of feathers and bees’ wax for his son Icarus to escape the labyrinth of Crete. In our technological epoch, engineers assemble runtime compilers and continuous-reasoning models to transcend infrastructural gravity. Yet when systems ascend too close to the architectural limits without rigorous memory barriers, the wax melts in the crucible of in-the-wild zero-days.
          </p>
        </div>

        {/* The 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-white/80 border border-[#252422]/25 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#111113] text-white flex items-center justify-center font-bold">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#111113] tracking-wide">
              I. THE WINGS
            </h3>
            <span className="text-[10px] font-mono tracking-wider uppercase text-stone-600 block font-bold">
              OPEN-SOURCE ARSENAL
            </span>
            <p className="text-xs font-sans text-stone-700 leading-relaxed">
              The daring compilers, kernel runtimes, and distributed frameworks assembled by developers across the globe to break free from closed platform monopolies.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white/80 border border-[#252422]/25 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#111113] text-white flex items-center justify-center font-bold">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#111113] tracking-wide">
              II. THE SUN
            </h3>
            <span className="text-[10px] font-mono tracking-wider uppercase text-stone-600 block font-bold">
              FRONTIER AI REASONING
            </span>
            <p className="text-xs font-sans text-stone-700 leading-relaxed">
              The radiant brilliance of test-time reasoning and continuous-diffusion architectures—captivating, dazzling, and demanding unprecedented high-density compute.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white/80 border border-[#252422]/25 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-none bg-red-800 text-white flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-red-950 tracking-wide">
              III. THE MELTED WAX
            </h3>
            <span className="text-[10px] font-mono tracking-wider uppercase text-red-700 block font-bold">
              CISA KEV ZERO-DAYS
            </span>
            <p className="text-xs font-sans text-stone-700 leading-relaxed">
              The catastrophic failure of edge appliances and memory safety when distributed systems fly past defensive boundary limits without formal verification.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white/80 border border-[#252422]/25 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#111113] text-white flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#111113] tracking-wide">
              IV. THE ECHOES
            </h3>
            <span className="text-[10px] font-mono tracking-wider uppercase text-stone-600 block font-bold">
              ACOUSTIC TELEMETRY &amp; MEMORY
            </span>
            <p className="text-xs font-sans text-stone-700 leading-relaxed">
              The enduring postmortems, immutable forensic archives, and vibrational radio frequencies recorded into collective memory for posterity.
            </p>
          </div>

        </div>

        {/* Acoustic Frequency Synthesizer & Spectrum Dispatch */}
        <div className="bg-[#18181A] text-[#F4F3EE] p-6 sm:p-8 border border-stone-600/30 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-700 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-stone-400 uppercase">
                ACOUSTIC CHAMBER // 142.8 MHZ
              </span>
              <h3 className="text-2xl font-display font-bold tracking-tight text-white uppercase">
                THE FREQUENCY SPECTRUM
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-stone-400">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>BERLIN TRANSMISSION TOWER</span>
            </div>
          </div>

          {/* 3 Frequency Selection Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {frequencies.map((f) => {
              const isSelected = activeFrequency === f.hz && audioPlaying;
              return (
                <div
                  key={f.hz}
                  className={`p-4 border transition-all ${
                    isSelected
                      ? 'bg-stone-800/80 border-white/60'
                      : 'bg-black/30 border-stone-800 hover:border-stone-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-emerald-400">{f.hz} MHZ</span>
                    <button
                      onClick={() => handleToggle(f.hz)}
                      className="text-[11px] uppercase font-bold text-stone-300 hover:text-white flex items-center gap-1"
                    >
                      {isSelected ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span>Mute</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5 opacity-50" />
                          <span>Engage</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="font-mono text-sm font-bold text-white pt-2">
                    {f.name}
                  </h4>
                  <p className="text-xs font-sans text-stone-400 pt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Barcode & Station Footer */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-stone-800 text-xs font-mono text-stone-400">
            <span>COORDINATES: 52.5200° N, 13.4050° E</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase">ARCHIVE VOL.01</span>
              <div className="flex items-center gap-[2px] h-5">
                {[2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3].map((w, i) => (
                  <div key={i} className="bg-stone-400 h-full" style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
