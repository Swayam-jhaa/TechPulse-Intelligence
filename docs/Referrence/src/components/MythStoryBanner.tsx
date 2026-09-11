import React from 'react';
import { Feather, Sun, AlertTriangle, Compass } from 'lucide-react';
import { AestheticVariation } from '../types';

interface MythStoryBannerProps {
  variation: AestheticVariation;
}

export const MythStoryBanner: React.FC<MythStoryBannerProps> = ({ variation }) => {
  const isTwilight = variation === 'icarus';

  return (
    <section className="py-12 px-4 sm:px-6 md:px-8 border-b transition-colors duration-500"
      style={{
        borderColor: isTwilight ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        backgroundColor: isTwilight ? 'rgba(20, 9, 4, 0.6)' : 'rgba(245, 240, 230, 0.5)'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Story Intro Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-amber-700"
            style={{ color: isTwilight ? '#FBBF24' : '#B45309' }}
          >
            THE ALLEGORICAL ATLAS
          </span>
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold tracking-tight"
            style={{ color: isTwilight ? '#FEF3C7' : '#1C1917' }}
          >
            THE MYTH OF ICARUS IN MODERN COMPUTING
          </h2>
          <p className="text-sm font-serif italic text-stone-600 max-w-xl mx-auto"
            style={{ color: isTwilight ? '#E2E8F0' : '#57534E' }}
          >
            “Neither fly too low lest the sea dampen your feathers, nor too high lest the sun melt your wax.”
          </p>
        </div>

        {/* 4 Pillars of the Allegory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="p-5 rounded border space-y-2 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: isTwilight ? 'rgba(30, 14, 7, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: isTwilight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-500/20 text-amber-600">
              <Feather className="w-4 h-4" />
            </div>
            <h3 className="font-cinzel text-base font-bold tracking-wide"
              style={{ color: isTwilight ? '#FDE68A' : '#1C1917' }}
            >
              I. THE WINGS
            </h3>
            <span className="text-[10px] font-mono tracking-wider uppercase block text-amber-700 font-semibold"
              style={{ color: isTwilight ? '#FBBF24' : '#B45309' }}
            >
              OPEN-SOURCE ARSENAL
            </span>
            <p className="text-xs font-sans leading-relaxed"
              style={{ color: isTwilight ? '#CBD5E1' : '#475569' }}
            >
              The audaciously crafted tooling, compilers, and kernel frameworks assembled by developers to escape infrastructural gravity.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded border space-y-2 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: isTwilight ? 'rgba(30, 14, 7, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: isTwilight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-500/20 text-amber-600">
              <Sun className="w-4 h-4" />
            </div>
            <h3 className="font-cinzel text-base font-bold tracking-wide"
              style={{ color: isTwilight ? '#FDE68A' : '#1C1917' }}
            >
              II. THE SUN
            </h3>
            <span className="text-[10px] font-mono tracking-wider uppercase block text-amber-700 font-semibold"
              style={{ color: isTwilight ? '#FBBF24' : '#B45309' }}
            >
              FRONTIER AI REASONING
            </span>
            <p className="text-xs font-sans leading-relaxed"
              style={{ color: isTwilight ? '#CBD5E1' : '#475569' }}
            >
              The radiant brilliance of continuous-diffusion and test-time reasoning models—illuminating, dazzling, and demanding unprecedented compute.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded border space-y-2 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: isTwilight ? 'rgba(30, 14, 7, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: isTwilight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/20 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-cinzel text-base font-bold tracking-wide"
              style={{ color: isTwilight ? '#FDE68A' : '#1C1917' }}
            >
              III. THE MELTED WAX
            </h3>
            <span className="text-[10px] font-mono tracking-wider uppercase block text-red-600 font-semibold"
              style={{ color: isTwilight ? '#F87171' : '#DC2626' }}
            >
              ZERO-DAYS &amp; KEV EXPLOITS
            </span>
            <p className="text-xs font-sans leading-relaxed"
              style={{ color: isTwilight ? '#CBD5E1' : '#475569' }}
            >
              The structural failure of edge appliances and memory safety when systems fly unchecked past defensive boundary limits.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded border space-y-2 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: isTwilight ? 'rgba(30, 14, 7, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: isTwilight ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-500/20 text-amber-600">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-cinzel text-base font-bold tracking-wide"
              style={{ color: isTwilight ? '#FDE68A' : '#1C1917' }}
            >
              IV. THE ECHOES
            </h3>
            <span className="text-[10px] font-mono tracking-wider uppercase block text-amber-700 font-semibold"
              style={{ color: isTwilight ? '#FBBF24' : '#B45309' }}
            >
              POSTMORTEMS &amp; MEMORY
            </span>
            <p className="text-xs font-sans leading-relaxed"
              style={{ color: isTwilight ? '#CBD5E1' : '#475569' }}
            >
              The enduring telemetry, acoustic frequencies, and retrospective chronicles recorded into immutable archives for future generations.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
