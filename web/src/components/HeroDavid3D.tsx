"use client";

import React, { useState, useEffect, useRef } from "react";
import { DailyReport } from "../types/intelligence";
import { getAudioFrequencyData } from "../utils/audioSynth";
import { Volume2, VolumeX } from "lucide-react";

interface HeroDavid3DProps {
  report: DailyReport;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const HeroDavid3D: React.FC<HeroDavid3DProps> = ({
  report,
  isAudioPlaying,
  onToggleAudio,
}) => {
  const [currentFreq] = useState(142.8);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [intensityBars, setIntensityBars] = useState<number[]>([3, 5, 2, 7, 4, 6, 8, 5]);

  // Dynamic HTML5 Canvas Waveform Animation across David's mouth
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      const audioData = isAudioPlaying ? getAudioFrequencyData() : null;

      // Update wave intensity mini-matrix periodically
      if (Math.random() < 0.15) {
        if (audioData && audioData.length > 0) {
          const sample = [
            Math.floor((audioData[4] / 255) * 8),
            Math.floor((audioData[10] / 255) * 8),
            Math.floor((audioData[18] / 255) * 8),
            Math.floor((audioData[28] / 255) * 8),
            Math.floor((audioData[38] / 255) * 8),
            Math.floor((audioData[50] / 255) * 8),
            Math.floor((audioData[64] / 255) * 8),
            Math.floor((audioData[80] / 255) * 8),
          ];
          setIntensityBars(sample.map((s) => Math.max(1, s)));
        } else {
          setIntensityBars((prev) =>
            prev.map((v) => Math.max(1, Math.min(8, v + Math.floor(Math.random() * 3) - 1)))
          );
        }
      }

      // 1. Central glowing laser filament beam
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      for (let x = 0; x < width; x += 3) {
        const normX = x / width;
        // Bell envelope so edges taper smoothly right past the lips
        const envelope = Math.pow(Math.sin(normX * Math.PI), 1.8);
        const wave = Math.sin(normX * 16 + phase * 3.2) * Math.cos(normX * 8 - phase * 1.6);
        const yOffset = wave * 4.5 * envelope;
        ctx.lineTo(x, centerY + yOffset);
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // 2. Secondary soft incandescent core bloom
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      for (let x = 0; x < width; x += 4) {
        const normX = x / width;
        const envelope = Math.pow(Math.sin(normX * Math.PI), 2.0);
        const wave = Math.sin(normX * 12 + phase * 2.6);
        const yOffset = wave * 2.8 * envelope;
        ctx.lineTo(x, centerY + yOffset);
      }
      ctx.strokeStyle = isAudioPlaying ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.65)";
      ctx.lineWidth = 4.5;
      ctx.stroke();

      // 3. Vertical frequency spikes radiating up & down from the beam
      const numBars = 44;
      const barWidth = width / numBars;

      for (let i = 0; i < numBars; i++) {
        const normI = i / numBars;
        // Symmetric tapering envelope
        const envelope = Math.pow(Math.sin(normI * Math.PI), 2.0);

        let amplitude = 0;
        if (audioData && audioData.length > 0) {
          // Live synth acoustic energy
          const energy = (audioData[0] + audioData[1] + audioData[2]) / (3 * 255);
          const binIndex = Math.min(8, Math.floor((i / numBars) * 8));
          const spectralBoost = (audioData[binIndex] || 0) / 255;

          const s1 = Math.sin(i * 0.4 + phase * 3.8);
          const s2 = Math.cos(i * 0.25 - phase * 2.6);
          const ripple = Math.sin(normI * 18 + phase * 4.5);
          const jitter = (Math.sin(i * 6 + phase * 6.5) + 1) * 0.5;

          const dynamicScale = 1.0 + energy * 2.0;
          amplitude =
            (Math.abs(s1 * 0.55 + s2 * 0.35 + ripple * 0.25) * (14 + jitter * 16) +
              spectralBoost * 18) *
            dynamicScale;
        } else {
          // Ambient idle breathing oscillation
          const s1 = Math.sin(i * 0.35 + phase * 2.4);
          const s2 = Math.cos(i * 0.2 - phase * 1.6);
          const jitter = (Math.sin(i * 5 + phase * 5.2) + 1) * 0.5;
          amplitude = Math.abs(s1 * 0.7 + s2 * 0.3) * (9 + jitter * 9);
        }

        const barHeight = Math.max(1.5, amplitude * envelope * 1.5);
        const xPos = i * barWidth;

        // Gradient from center line outwards
        const grad = ctx.createLinearGradient(
          xPos,
          centerY - barHeight,
          xPos,
          centerY + barHeight
        );

        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(0.3, "rgba(255, 255, 255, 0.85)");
        grad.addColorStop(0.5, "rgba(255, 255, 255, 1.0)");
        grad.addColorStop(0.7, "rgba(255, 255, 255, 0.85)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = grad;
        ctx.fillRect(
          xPos + 0.5,
          centerY - barHeight / 2,
          Math.max(1.5, barWidth - 1.0),
          barHeight
        );
      }

      phase += isAudioPlaying ? 0.055 : 0.032;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAudioPlaying, currentFreq]);

  return (
    <section
      className="relative w-full min-h-[76dvh] md:min-h-[82dvh] flex flex-col justify-between overflow-hidden select-none pt-14 sm:pt-16 pb-4"
      style={{
        // Architectural stone-grey with subtle, serene downward shade shift
        background: "linear-gradient(180deg, #ECEAE4 0%, #E9E7E0 50%, #E4E1D8 100%)",
      }}
    >
      {/* 0. Subtle tactile film grain & ambient lighting */}
      <div className="absolute inset-0 pointer-events-none bg-grain opacity-40 z-0" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(255,255,255,0.45) 0%, rgba(236,234,228,0.15) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* 1. Top Sub-Masthead: Editorial Site-Relevant Header */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.2em] text-stone-700 uppercase pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-stone-900 font-bold">⌖</span>
            <span className="font-bold uppercase tracking-[0.18em] bg-gradient-to-b from-stone-950 via-stone-800 to-stone-600 bg-clip-text text-transparent">
              TECHPULSE INTELLIGENCE
            </span>
            <span className="text-stone-400">//</span>
            <span className="text-stone-600 hidden sm:inline">AUTONOMOUS SIGNAL DISPATCH</span>
          </div>
          <div className="flex items-center gap-2.5 text-stone-600">
            <span className="italic font-serif text-[11px] sm:text-xs text-stone-700 normal-case font-normal hidden md:inline">
              &ldquo;The purpose of computing is insight, not numbers.&rdquo;
            </span>
            <span className="text-stone-400 hidden md:inline">•</span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-800">
              R. HAMMING
            </span>
          </div>
        </div>
        <div className="w-full border-b border-stone-300/80" />
      </div>

      {/* 2. Left Margin Precision Ruler Axis (01, 02, 03) */}
      <div
        aria-hidden="true"
        className="absolute left-4 sm:left-8 md:left-12 top-[22%] bottom-[20%] z-20 hidden sm:flex flex-col justify-between font-mono text-[9px] text-stone-400 pointer-events-none tabular-nums"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-600">03</span>
          <span className="w-2.5 h-px bg-stone-400/80" />
        </div>
        <div className="flex flex-col gap-2.5 pl-5 opacity-40">
          <span className="w-1.5 h-px bg-stone-500" />
          <span className="w-1.5 h-px bg-stone-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-600">02</span>
          <span className="w-2.5 h-px bg-stone-400/80" />
        </div>
        <div className="flex flex-col gap-2.5 pl-5 opacity-40">
          <span className="w-1.5 h-px bg-stone-500" />
          <span className="w-1.5 h-px bg-stone-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-600">01</span>
          <span className="w-2.5 h-px bg-stone-400/80" />
        </div>
      </div>

      {/* 3. Top-Left Reticle & Feed Tracker */}
      <div
        aria-hidden="true"
        className="absolute top-[22%] left-6 sm:left-16 md:left-24 lg:left-32 z-20 font-mono pointer-events-none hidden md:block"
      >
        <div className="relative text-[10px] tracking-widest text-stone-600 border-l border-t border-stone-400/70 pt-2 pl-2.5">
          <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-stone-800" />
          <div className="font-bold text-stone-800 text-[10px] leading-tight">SIGNAL_01</div>
          <div className="text-[8px] text-stone-500 tracking-wider">LIVE FEED</div>

          <div className="absolute top-2 -right-2.5 w-1.5 h-1.5 rounded-full bg-stone-800" />
          <svg className="absolute -right-16 top-2.5 w-14 h-10 overflow-visible">
            <line
              x1="0"
              y1="0"
              x2="38"
              y2="14"
              stroke="rgba(120, 113, 108, 0.45)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle cx="38" cy="14" r="1.5" fill="rgba(87, 83, 78, 0.8)" />
          </svg>
        </div>
      </div>

      {/* 4. Top-Right Wave Intensity Meter */}
      <div
        aria-hidden="true"
        className="absolute top-[22%] right-6 sm:right-14 md:right-20 lg:right-28 z-20 hidden md:flex flex-col items-end pointer-events-none font-mono"
      >
        <span className="text-[8px] tracking-widest text-stone-500 uppercase font-semibold mb-1.5">
          WAVE INTENSITY
        </span>
        <div className="flex items-end gap-1 h-5 px-1">
          {intensityBars.map((height, idx) => (
            <div key={idx} className="flex flex-col gap-0.5 justify-end h-full">
              {[8, 7, 6, 5, 4, 3, 2, 1].map((lvl) => (
                <span
                  key={lvl}
                  className={`w-1 h-0.5 rounded-xs transition-colors duration-150 ${
                    lvl <= height
                      ? isAudioPlaying
                        ? "bg-stone-900"
                        : "bg-stone-700"
                      : "bg-stone-300/60"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Central Stage: Michelangelo's David Statue + Compact Lip Waveform */}
      <div className="relative flex-1 flex items-end justify-center w-full min-h-[420px] sm:min-h-[500px] md:min-h-[580px]">
        {/* Grounded Classical Sculpture Artwork (Starts earlier, tighter vertically) */}
        <div className="relative z-10 flex items-end justify-center w-full max-w-3xl h-[56vh] sm:h-[64vh] md:h-[70vh] max-h-[720px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/david-bust.png"
            alt="Michelangelo's classical David bust with dynamic audio synthesizer visualizer across his lips"
            className="h-full w-auto max-w-full object-contain object-bottom filter contrast-[1.03] brightness-[1.01]"
          />

          {/* Compact Synthwave Waveform Canvas: Slightly longer than Michelangelo's lips */}
          <div
            aria-hidden="true"
            className="absolute top-[44.8%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-[170px] sm:w-[210px] md:w-[250px] h-14 sm:h-18 flex items-center justify-center"
            style={{
              filter:
                "drop-shadow(0 0 5px rgba(255,255,255,0.95)) drop-shadow(0 0 12px rgba(255,255,255,0.8)) drop-shadow(0 0 24px rgba(210,235,255,0.45))",
            }}
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={100}
              className="w-full h-full"
            />
          </div>

          {/* Minimalist 142.8 MHz Synth Tag (No clunky audio on/off button) */}
          <div
            className="absolute top-[40%] right-[6%] sm:right-[12%] md:right-[18%] lg:right-[22%] z-30 pointer-events-auto"
          >
            {/* Fine angled connector line leading to the waveform */}
            <svg
              className="absolute -left-10 sm:-left-12 top-3 w-10 sm:w-12 h-6 overflow-visible pointer-events-none hidden sm:block"
              aria-hidden="true"
            >
              <line
                x1="0"
                y1="12"
                x2="24"
                y2="0"
                stroke="rgba(87, 83, 78, 0.65)"
                strokeWidth="1.2"
              />
              <line
                x1="24"
                y1="0"
                x2="48"
                y2="0"
                stroke="rgba(87, 83, 78, 0.65)"
                strokeWidth="1.2"
              />
              <circle cx="0" cy="12" r="1.5" fill="#161518" />
            </svg>

            {/* Sleek Minimal Synth Marker */}
            <button
              onClick={onToggleAudio}
              aria-label="Toggle 142.8 MHz ambient synth drone"
              title="142.8 MHz Ambient Drone"
              className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 rounded-full transition-all active:scale-[0.96] active:translate-y-[0.5px] flex items-center gap-2 px-3 py-1 bg-[#141316]/95 hover:bg-black text-stone-200 border border-white/15 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.2)]"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isAudioPlaying
                    ? "bg-stone-100 animate-ping"
                    : "bg-stone-400"
                }`}
              />
              <span className="font-mono text-[10px] tracking-wider font-semibold tabular-nums">
                {currentFreq.toFixed(1)} MHZ SYNTH
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Bottom-Left Transmission Data Readout */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-6 sm:left-12 md:left-16 z-20 font-mono text-[9px] sm:text-[10px] text-stone-600 leading-tight pointer-events-none tabular-nums hidden sm:block"
      >
        <div className="font-bold text-stone-800 tracking-wider text-[10px] mb-1 uppercase">
          TRANSMISSION DATA
        </div>
        <div className="space-y-0.5 text-stone-600">
          <div className="flex justify-between gap-6">
            <span>PING</span>
            <span className="font-medium text-stone-800">12ms</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>JITTER</span>
            <span className="font-medium text-stone-800">0.8ms</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>PACKETS</span>
            <span className="font-medium text-stone-800">96%</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>SIGNAL</span>
            <span className="font-medium text-stone-900 font-bold">STRONG</span>
          </div>
        </div>
      </div>

      {/* 7. Bottom-Right Acoustic Telemetry Readout */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 right-6 sm:right-12 md:right-16 z-20 font-mono text-[9px] sm:text-[10px] text-stone-600 leading-tight text-right pointer-events-none tabular-nums hidden sm:block"
      >
        <div className="font-bold text-stone-800 tracking-wider text-[10px] mb-1 uppercase">
          TELEMETRY // 01
        </div>
        <div className="space-y-0.5 text-stone-600">
          <div className="flex justify-between gap-6">
            <span>FREQUENCY</span>
            <span className="font-medium text-stone-800">142.8 MHZ</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>AMPLITUDE</span>
            <span className="font-medium text-stone-800">{isAudioPlaying ? "82%" : "24%"}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>MODE</span>
            <span className="font-medium text-stone-800">MONO</span>
          </div>
        </div>
      </div>

      {/* 8. Bottom Carousel Navigation Dots */}
      <div
        aria-hidden="true"
        className="relative z-20 flex items-center justify-center gap-2 pt-1"
      >
        <span className="w-2 h-2 rounded-full bg-stone-900 shadow-xs" />
        <span className="w-1.5 h-1.5 rounded-full bg-stone-500/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-stone-500/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-stone-500/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-stone-500/70" />
      </div>
    </section>
  );
};
