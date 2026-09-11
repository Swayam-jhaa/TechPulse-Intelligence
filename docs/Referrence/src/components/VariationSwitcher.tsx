import React from 'react';
import { AestheticVariation } from '../types';
import { Sun, Sunset, Sparkles, SlidersHorizontal } from 'lucide-react';

interface VariationSwitcherProps {
  currentVariation: AestheticVariation;
  onSelectVariation: (variation: AestheticVariation) => void;
  heroMode: 'rotate' | 'open' | 'waveform';
  onChangeHeroMode: (mode: 'rotate' | 'open' | 'waveform') => void;
}

export const VariationSwitcher: React.FC<VariationSwitcherProps> = ({
  currentVariation,
  onSelectVariation,
  heroMode,
  onChangeHeroMode
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-500 bg-opacity-95"
      style={{
        backgroundColor:
          currentVariation === 'solar'
            ? 'rgba(247, 244, 238, 0.92)'
            : currentVariation === 'icarus'
            ? 'rgba(24, 11, 5, 0.94)'
            : 'rgba(244, 243, 238, 0.94)',
        borderColor:
          currentVariation === 'solar'
            ? 'rgba(217, 119, 6, 0.25)'
            : currentVariation === 'icarus'
            ? 'rgba(245, 158, 11, 0.2)'
            : 'rgba(24, 24, 27, 0.15)',
        color:
          currentVariation === 'icarus' ? '#FEF3C7' : '#1C1917'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand / Myth Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-widest uppercase font-cinzel">
              {currentVariation === 'echoes' ? 'ECHØES' : 'ICARVS'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium tracking-wider border"
              style={{
                borderColor: currentVariation === 'icarus' ? '#F59E0B' : '#D97706',
                color: currentVariation === 'icarus' ? '#FBBF24' : '#B45309',
                backgroundColor: currentVariation === 'icarus' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.15)'
              }}
            >
              {currentVariation === 'solar' ? 'THE ASCENT' : currentVariation === 'icarus' ? 'THE FALL' : 'THE FREQUENCY'}
            </span>
          </div>
          <span className="hidden md:inline-block text-xs opacity-60 font-serif italic">
            {currentVariation === 'solar' && '“You are the sun • You heal • You burn”'}
            {currentVariation === 'icarus' && '“So close....yet so far...”'}
            {currentVariation === 'echoes' && '“Sound is the language of the soul”'}
          </span>
        </div>

        {/* 3 Variations Selector based directly on reference images */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border text-xs font-mono"
          style={{
            borderColor: currentVariation === 'icarus' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.12)',
            backgroundColor: currentVariation === 'icarus' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.04)'
          }}
        >
          <span className="hidden sm:inline-block px-2 text-[10px] tracking-wider uppercase opacity-60">
            Aesthetic:
          </span>

          {/* Variation 1: Solar (download.png) */}
          <button
            id="btn-variation-solar"
            onClick={() => onSelectVariation('solar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-medium ${
              currentVariation === 'solar'
                ? 'bg-amber-400 text-stone-900 shadow-sm font-semibold'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-800" />
            <span>I. Solar Gold</span>
            <span className="w-2 h-2 rounded-full bg-[#EAB308] border border-amber-900/20" />
          </button>

          {/* Variation 2: Icarus Falling (73079c1edb8e5666fe2f33593db764c4.jpg) */}
          <button
            id="btn-variation-icarus"
            onClick={() => onSelectVariation('icarus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-medium ${
              currentVariation === 'icarus'
                ? 'bg-amber-600 text-amber-50 shadow-sm font-semibold'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Sunset className="w-3.5 h-3.5 text-amber-200" />
            <span>II. Twilight Fall</span>
            <span className="w-2 h-2 rounded-full bg-[#78350F] border border-amber-400/40" />
          </button>

          {/* Variation 3: Echoes (c195a35f96088f9edde5a6bcea43725e.jpg) */}
          <button
            id="btn-variation-echoes"
            onClick={() => onSelectVariation('echoes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-medium ${
              currentVariation === 'echoes'
                ? 'bg-stone-900 text-stone-100 shadow-sm font-semibold'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>III. Echoes Marble</span>
            <span className="w-2 h-2 rounded-full bg-stone-100 border border-stone-800" />
          </button>
        </div>

        {/* Hero Animation Mode Toggle */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <SlidersHorizontal className="w-3.5 h-3.5 opacity-60" />
          <span className="hidden lg:inline text-[11px] opacity-60">Hero:</span>
          <select
            id="select-hero-animation-mode"
            value={heroMode}
            onChange={(e) => onChangeHeroMode(e.target.value as 'rotate' | 'open' | 'waveform')}
            className="bg-transparent border rounded px-2 py-1 text-xs outline-none cursor-pointer"
            style={{
              borderColor: currentVariation === 'icarus' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(0, 0, 0, 0.15)',
              color: currentVariation === 'icarus' ? '#FDE68A' : '#1C1917',
              backgroundColor: currentVariation === 'icarus' ? '#261208' : '#F7F4EE'
            }}
          >
            <option value="rotate">Rotating Sunburst / Halo</option>
            <option value="open">Opening Wings & Shutter</option>
            <option value="waveform">Oscillating Frequency Orbit</option>
          </select>
        </div>

      </div>
    </header>
  );
};
