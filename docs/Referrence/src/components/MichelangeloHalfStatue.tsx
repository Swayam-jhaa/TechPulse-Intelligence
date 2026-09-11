import React, { useId } from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

interface MichelangeloHalfStatueProps {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  haloTilt: MotionValue<number>;
  audioPlaying: boolean;
  frequencyValue: number;
  waveSeed: number;
  onToggleAudio: () => void;
}

export const MichelangeloHalfStatue: React.FC<MichelangeloHalfStatueProps> = ({
  rotateX,
  rotateY,
  haloTilt,
  audioPlaying,
  frequencyValue,
  waveSeed,
  onToggleAudio
}) => {
  const uid = useId().replace(/:/g, '');

  return (
    <motion.div
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d'
      }}
      className="relative z-10 w-[310px] sm:w-[390px] md:w-[460px] lg:w-[500px] h-[520px] sm:h-[600px] md:h-[680px] flex items-center justify-center cursor-grab active:cursor-grabbing"
    >
      {/* Dynamic Sound Wave Aura when Audio is Active */}
      {audioPlaying && (
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
          <div className="w-[480px] h-[480px] rounded-full bg-white/20 blur-3xl animate-ping opacity-40 duration-1000" />
          <div className="w-[360px] h-[360px] rounded-full bg-white/30 blur-2xl animate-pulse opacity-60" />
        </div>
      )}

      {/* SVG Museum Half-Statue of Michelangelo's David */}
      <svg
        viewBox="0 0 540 740"
        className="w-full h-full drop-shadow-[0_25px_45px_rgba(0,0,0,0.45)] select-none"
        style={{ filter: 'contrast(1.1) brightness(1.02)' }}
      >
        <defs>
          {/* Alabaster Marble Gradient - Key Lighting from Top-Left */}
          <linearGradient id={`marbleLit-${uid}`} x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#EFECE6" />
            <stop offset="55%" stopColor="#C9C6BE" />
            <stop offset="80%" stopColor="#8A867E" />
            <stop offset="100%" stopColor="#32302C" />
          </linearGradient>

          {/* Deep Chiaroscuro Shadow Gradient for Right Contours */}
          <linearGradient id={`deepShadow-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E1D1B" stopOpacity="0.88" />
            <stop offset="50%" stopColor="#484540" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#DFDCD4" stopOpacity="0" />
          </linearGradient>

          {/* Hair Curls Volume Gradient */}
          <linearGradient id={`hairCurl-${uid}`} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FAF8F5" />
            <stop offset="35%" stopColor="#C2BFB6" />
            <stop offset="70%" stopColor="#6E6A62" />
            <stop offset="100%" stopColor="#22211F" />
          </linearGradient>

          {/* Pectoral Shading Gradient */}
          <radialGradient id={`pecHighlight-${uid}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#DDD9D0" />
            <stop offset="85%" stopColor="#9C988F" />
            <stop offset="100%" stopColor="#4A4742" />
          </radialGradient>

          {/* Stone Base Broken Fracture */}
          <linearGradient id={`fracturePedestal-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#262523" />
            <stop offset="40%" stopColor="#63605A" />
            <stop offset="85%" stopColor="#BCB8AF" />
            <stop offset="100%" stopColor="#F5F3ED" />
          </linearGradient>

          {/* Ethereal mist billow gradient at base */}
          <radialGradient id={`mistGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#CCCAC3" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#CCCAC3" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. TORSO & CHEST (HALF STATUE ANATOMY) */}
        <g id="david-torso">
          {/* Main Torso Block (Ribcage & Abdomen down to base) */}
          <path
            d="M 120 710 L 80 540 C 70 480, 85 410, 115 360 L 160 380 L 195 365 C 240 375, 290 380, 345 375 L 435 410 C 455 460, 460 540, 440 710 Z"
            fill={`url(#marbleLit-${uid})`}
            stroke="#1F1E1C"
            strokeWidth="2.5"
          />

          {/* Chiseled Fractured Base Pedestal (Rough stone break) */}
          <path
            d="M 115 710 L 170 680 L 220 720 L 290 690 L 350 730 L 410 695 L 445 710 L 430 735 L 340 738 L 260 740 L 180 738 L 120 730 Z"
            fill={`url(#fracturePedestal-${uid})`}
            stroke="#181716"
            strokeWidth="3"
          />

          {/* RIGHT PECTORAL MUSCLE (Viewer's Left) */}
          <path
            d="M 140 395 C 190 380, 240 385, 260 410 C 265 470, 245 525, 180 535 C 130 540, 110 490, 115 440 C 120 410, 130 400, 140 395 Z"
            fill={`url(#pecHighlight-${uid})`}
            stroke="#2C2A27"
            strokeWidth="2"
          />
          {/* Right Nipple Specular & Shadow */}
          <ellipse cx="178" cy="482" rx="6" ry="5" fill="#47443F" stroke="#252422" strokeWidth="1.5" />
          <circle cx="177" cy="481" r="2" fill="#8E8B83" />

          {/* LEFT PECTORAL MUSCLE (Viewer's Right, below raised arm) */}
          <path
            d="M 275 410 C 310 390, 360 405, 395 435 C 410 490, 390 545, 335 550 C 285 550, 265 490, 270 435 Z"
            fill={`url(#pecHighlight-${uid})`}
            stroke="#242321"
            strokeWidth="2"
          />
          {/* Left Nipple Specular & Shadow */}
          <ellipse cx="362" cy="495" rx="5.5" ry="5" fill="#3B3834" stroke="#1D1C1B" strokeWidth="1.5" />
          <circle cx="361" cy="494" r="2" fill="#78756E" />

          {/* Sternum / Interpectoral Groove & Center Line of Chest */}
          <path
            d="M 264 365 C 262 420, 264 470, 268 530 C 270 565, 265 620, 260 670"
            stroke="#1D1C1A"
            strokeWidth="3.5"
            fill="none"
            opacity="0.8"
          />

          {/* Clavicles (Collarbones) - Right & Left Wings */}
          <path
            d="M 125 385 C 165 375, 220 375, 255 380"
            stroke="#242321"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d="M 275 380 C 315 378, 365 388, 410 405"
            stroke="#1A1918"
            strokeWidth="4"
            fill="none"
          />
          {/* Suprasternal Notch (indentation at base of neck) */}
          <ellipse cx="265" cy="378" rx="8" ry="4" fill="#2E2C29" />

          {/* Ribcage / Serratus Chiaroscuro Striations */}
          <path d="M 125 560 C 150 585, 185 600, 215 605" stroke="#3D3B36" strokeWidth="2.5" fill="none" opacity="0.6" />
          <path d="M 135 605 C 160 625, 195 640, 225 642" stroke="#3D3B36" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M 390 575 C 365 600, 335 615, 305 620" stroke="#252422" strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M 380 620 C 355 640, 325 650, 300 655" stroke="#252422" strokeWidth="2.5" fill="none" opacity="0.6" />
        </g>

        {/* 2. THE ICONIC RAISED LEFT HAND & SLING (From User's Image) */}
        <g id="david-raised-hand-and-sling">
          {/* Leather Sling Strap looping over shoulder down to neck */}
          <path
            d="M 385 360 C 375 390, 365 420, 370 450 L 388 452 C 385 425, 395 395, 405 365 Z"
            fill="#383531"
            stroke="#181716"
            strokeWidth="2"
          />

          {/* Forearm / Wrist rising toward shoulder */}
          <path
            d="M 460 520 C 445 460, 420 420, 395 390 L 435 375 C 455 410, 475 465, 480 525 Z"
            fill={`url(#marbleLit-${uid})`}
            stroke="#21201E"
            strokeWidth="2"
          />

          {/* The Hand / Palm resting at clavicle */}
          <path
            d="M 365 380 C 360 410, 375 440, 415 440 C 435 435, 440 405, 430 380 Z"
            fill={`url(#marbleLit-${uid})`}
            stroke="#1A1918"
            strokeWidth="2"
          />

          {/* Curled Fingers holding the sling strap (Michelangelo David Hand) */}
          {/* Index Finger */}
          <path
            d="M 380 395 C 368 392, 355 405, 365 418 C 375 425, 392 422, 395 410 Z"
            fill={`url(#marbleLit-${uid})`}
            stroke="#1E1D1B"
            strokeWidth="2"
          />
          {/* Middle Finger */}
          <path
            d="M 390 405 C 380 405, 372 418, 380 430 C 390 436, 405 432, 410 420 Z"
            fill={`url(#marbleLit-${uid})`}
            stroke="#1E1D1B"
            strokeWidth="2"
          />
          {/* Ring Finger */}
          <path
            d="M 405 412 C 398 415, 392 428, 400 438 C 408 442, 422 438, 425 428 Z"
            fill={`url(#marbleLit-${uid})`}
            stroke="#1E1D1B"
            strokeWidth="2"
          />
          {/* Thumb hooking around the strap */}
          <path
            d="M 370 380 C 362 375, 355 385, 362 396 C 368 402, 378 400, 380 390 Z"
            fill={`url(#marbleLit-${uid})`}
            stroke="#1E1D1B"
            strokeWidth="2"
          />

          {/* Back of Hand Veins and Knuckle Highlights */}
          <path d="M 398 395 L 420 415" stroke="#F0EDE6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 382 385 L 402 405" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 412 388 C 420 398, 425 412, 424 425" stroke="#33312D" strokeWidth="2" fill="none" />
        </g>

        {/* 3. MUSCULAR CONTRA-POSTO NECK */}
        <g id="david-neck">
          {/* Main Neck Column */}
          <path
            d="M 215 380 C 210 320, 218 265, 235 235 C 275 240, 305 270, 320 365 C 290 375, 250 380, 215 380 Z"
            fill={`url(#marbleLit-${uid})`}
            stroke="#21201E"
            strokeWidth="2"
          />

          {/* Sternocleidomastoid Muscle (Tensed tendon from ear to sternal notch) */}
          <path
            d="M 230 365 C 248 310, 268 268, 275 238"
            stroke="#2E2C28"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M 235 365 C 252 312, 271 270, 278 240"
            stroke="#FAF7F2"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Adam's Apple & Larynx Shadow */}
          <path d="M 252 295 Q 262 305 255 315" stroke="#3D3B36" strokeWidth="3" fill="none" />

          {/* Jaw Shadow cast across right side of neck */}
          <path
            d="M 225 245 C 245 275, 300 270, 320 235"
            stroke="#171615"
            strokeWidth="4"
            fill="none"
          />
        </g>

        {/* 4. CLASSICAL MICHELANGELO HEAD & FACE (3/4 Turn looking right) */}
        <g id="david-head">
          {/* Head Base Form */}
          <path
            d="M 205 230 C 190 170, 205 110, 260 90 C 325 80, 375 115, 380 190 C 385 230, 365 260, 325 265 C 270 270, 225 255, 205 230 Z"
            fill={`url(#marbleLit-${uid})`}
            stroke="#181716"
            strokeWidth="2.5"
          />

          {/* Strong Chiseled Jawline & Chin */}
          <path
            d="M 230 220 C 250 260, 290 265, 320 238 C 335 220, 350 195, 355 170"
            stroke="#141312"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Chin Cleft & Highlight */}
          <ellipse cx="305" cy="245" rx="4" ry="2.5" fill="#2E2C29" />
          <ellipse cx="303" cy="242" rx="3" ry="1.5" fill="#FAF8F5" />

          {/* Sculpted Lips with Classical Cupid's Bow */}
          <path d="M 288 218 Q 302 222 316 215" stroke="#21201E" strokeWidth="3" fill="none" />
          <path d="M 292 222 Q 302 228 314 221" stroke="#1A1918" strokeWidth="2.5" fill="none" />
          {/* Lip shadow & philtrum */}
          <path d="M 300 205 L 302 215" stroke="#4A4742" strokeWidth="2" fill="none" />

          {/* Straight Classical Roman Nose Bridge */}
          <path
            d="M 296 145 L 302 195 L 316 195"
            stroke="#161514"
            strokeWidth="3"
            fill="none"
          />
          {/* Nose Highlight down the bridge */}
          <path d="M 294 148 L 300 190" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Furrowed Brow & Deep-Set Gaze (Looking right) */}
          <path d="M 275 145 C 290 138, 320 138, 335 148" stroke="#1C1B1A" strokeWidth="3" fill="none" />
          <path d="M 230 150 C 240 142, 260 142, 270 150" stroke="#1C1B1A" strokeWidth="2" fill="none" />

          {/* Eyes & Intense Eyelids */}
          {/* Right Eye (Viewer's Right) */}
          <path d="M 295 158 C 305 152, 320 154, 328 162" stroke="#1E1D1B" strokeWidth="2" fill="none" />
          <ellipse cx="312" cy="160" rx="3.5" ry="3" fill="#181716" />
          {/* Left Eye (Viewer's Left) */}
          <path d="M 245 160 C 255 155, 265 156, 272 163" stroke="#252422" strokeWidth="1.8" fill="none" />
          <ellipse cx="260" cy="161" rx="3" ry="2.5" fill="#252422" />

          {/* Cheekbone Specular Shimmer */}
          <path d="M 268 180 C 275 175, 285 178, 290 190" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.8" />
        </g>

        {/* 5. VOLUMINOUS MICHELANGELO CURLING HAIR LOCKS */}
        <g id="david-carved-hair" fill={`url(#hairCurl-${uid})`} stroke="#161514" strokeWidth="2">
          {/* Crown and Forehead Curls */}
          <circle cx="225" cy="110" r="23" />
          <circle cx="258" cy="92" r="25" />
          <circle cx="295" cy="85" r="27" />
          <circle cx="335" cy="94" r="26" />
          <circle cx="368" cy="115" r="23" />
          <circle cx="385" cy="145" r="21" />
          <circle cx="380" cy="180" r="19" />

          {/* Foreground Deep-Carved Spiral Rings */}
          <circle cx="198" cy="135" r="20" />
          <circle cx="192" cy="168" r="18" />
          <circle cx="202" cy="198" r="17" />
          <circle cx="235" cy="135" r="19" />
          <circle cx="272" cy="115" r="20" />
          <circle cx="315" cy="118" r="20" />
          <circle cx="355" cy="138" r="18" />

          {/* Deep Sculpted Spiral Grooves inside hair */}
          <path d="M 245 95 Q 260 110 250 122" fill="none" stroke="#121110" strokeWidth="2.5" />
          <path d="M 285 88 Q 300 105 290 120" fill="none" stroke="#121110" strokeWidth="2.5" />
          <path d="M 322 98 Q 338 115 328 130" fill="none" stroke="#121110" strokeWidth="2.5" />
          <path d="M 352 118 Q 368 135 358 150" fill="none" stroke="#121110" strokeWidth="2.5" />
          <path d="M 215 125 Q 228 140 220 152" fill="none" stroke="#121110" strokeWidth="2" />

          {/* Hair Highlights on Curls */}
          <path d="M 248 85 A 15 15 0 0 1 270 95" fill="none" stroke="#FAF8F5" strokeWidth="2.5" />
          <path d="M 285 78 A 18 18 0 0 1 310 88" fill="none" stroke="#FAF8F5" strokeWidth="3" />
          <path d="M 325 86 A 16 16 0 0 1 348 98" fill="none" stroke="#FAF8F5" strokeWidth="2.5" />
        </g>

        {/* 6. ETHEREAL MIST CLOUDS AT SCULPTED BASE */}
        <g id="cloud-pedestal-mist">
          <ellipse cx="220" cy="710" rx="160" ry="50" fill={`url(#mistGlow-${uid})`} />
          <ellipse cx="360" cy="700" rx="150" ry="45" fill={`url(#mistGlow-${uid})`} />
          <ellipse cx="150" cy="670" rx="100" ry="35" fill={`url(#mistGlow-${uid})`} />
          <ellipse cx="410" cy="650" rx="110" ry="38" fill={`url(#mistGlow-${uid})`} />
        </g>
      </svg>

      {/* 7. GLOWING FREQUENCY WAVEFORM HALO (Encircling Brow/Forehead in 3D) */}
      <motion.div
        style={{
          rotateX: haloTilt,
          rotateZ: -9,
          transformPerspective: 850
        }}
        onClick={onToggleAudio}
        title="Click to toggle frequency audio resonance"
        className="absolute top-[135px] sm:top-[165px] md:top-[190px] left-1/2 -translate-x-1/2 w-[320px] sm:w-[420px] md:w-[480px] pointer-events-auto cursor-pointer z-30 group"
      >
        <div className="relative py-1 flex items-center justify-center">
          {/* Intense Glow Layer */}
          <div className="absolute inset-0 bg-white/85 blur-lg rounded-full group-hover:bg-white transition-all" />
          <div className="absolute inset-0 bg-white/45 blur-2xl rounded-full" />

          {/* 54 Dynamic Oscillating Frequency Bars */}
          <div className="relative flex items-center justify-center gap-[2px] sm:gap-[3px] md:gap-[4px] px-4 py-2 bg-white/95 border border-white shadow-[0_0_30px_rgba(255,255,255,1)] rounded-full backdrop-blur-md">
            {Array.from({ length: 54 }).map((_, i) => {
              const distFromCenter = Math.abs(i - 27);
              const envelope = Math.max(3, 36 - distFromCenter * 1.2);
              const dynamicHarmonic = ((i * 13 + waveSeed * 6) % 17) - 8;
              const audioBoost = audioPlaying ? Math.sin((i + waveSeed) * 0.45) * 9 : 0;
              const barHeight = Math.max(4, Math.min(46, envelope + dynamicHarmonic + audioBoost));

              return (
                <div
                  key={i}
                  className={`w-[2.5px] sm:w-[3px] md:w-[3.5px] rounded-full transition-all duration-100 ${
                    audioPlaying ? 'bg-[#111113]' : 'bg-[#252426]'
                  }`}
                  style={{
                    height: `${barHeight}px`,
                    opacity: i > 4 && i < 49 ? 1 : 0.65
                  }}
                />
              );
            })}
          </div>

          {/* Interactive Floating Halo Label */}
          <div className="absolute -bottom-6 right-4 sm:right-8 bg-[#111113] text-[#F4F3EE] font-mono text-[9px] sm:text-[10px] px-2.5 py-0.5 uppercase tracking-widest shadow-md flex items-center gap-1.5 border border-white/20">
            <span className={`w-1.5 h-1.5 rounded-full ${audioPlaying ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'}`} />
            <span>FREQ {frequencyValue.toFixed(1)} MHZ</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
