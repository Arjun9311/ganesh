'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function DivineBackground() {
  const pathname = usePathname();

  // Hide on 3D canvas active game viewports to maintain maximum performance
  if (pathname === '/game' || pathname === '/temple-run' || pathname === '/hill-climb') {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      {/* 1. TOP-TO-BOTTOM CONTINUOUS AMBIENT LIGHT STREAM */}
      <div className="ambient-light-stream" />

      {/* 2. CASCADING ANIMATED GANESH IDOLS (UP-TO-DOWN ENTIRE PAGE) */}
      <div className="ganesh-cascade-container">
        {/* Stream 1: Left Gutter Idol (Primary) */}
        <div className="idol-cascade-item idol-col-left-1 idol-delay-0">
          <GaneshIdolSvg size={200} haloSpeed={36} />
        </div>
        {/* Stream 2: Left Gutter Idol (Staggered second wave) */}
        <div className="idol-cascade-item idol-col-left-2 idol-delay-12">
          <GaneshIdolSvg size={180} haloSpeed={42} reverse />
        </div>

        {/* Stream 3: Right Gutter Idol (Primary) */}
        <div className="idol-cascade-item idol-col-right-1 idol-delay-6">
          <GaneshIdolSvg size={210} haloSpeed={32} />
        </div>
        {/* Stream 4: Right Gutter Idol (Staggered second wave) */}
        <div className="idol-cascade-item idol-col-right-2 idol-delay-18">
          <GaneshIdolSvg size={180} haloSpeed={40} reverse />
        </div>

        {/* Stream 5: Mid-Left Subtle Background Idol */}
        <div className="idol-cascade-item idol-col-mid-left idol-delay-9">
          <GaneshIdolSvg size={160} haloSpeed={48} />
        </div>

        {/* Stream 6: Mid-Right Subtle Background Idol */}
        <div className="idol-cascade-item idol-col-mid-right idol-delay-15">
          <GaneshIdolSvg size={160} haloSpeed={44} reverse />
        </div>
      </div>

      {/* 3. FULL-PAGE TOP-TO-BOTTOM CASCADING FESTIVE PARTICLES */}
      <div className="festive-cascade-container">
        {/* Stream 1 - Left Diya & Modak */}
        <div className="cascade-item c-col-1 c-delay-0">
          <span className="ornament-glow">🪔</span>
        </div>
        <div className="cascade-item c-col-1 c-delay-9">
          <span className="ornament-glow">✨</span>
        </div>

        {/* Stream 2 - Mid-Left Lotus & Star */}
        <div className="cascade-item c-col-2 c-delay-3">
          <span className="ornament-glow">🌺</span>
        </div>
        <div className="cascade-item c-col-2 c-delay-12">
          <span className="ornament-glow">🍬</span>
        </div>

        {/* Stream 3 - Center Sparks & Sacred Bell */}
        <div className="cascade-item c-col-3 c-delay-6">
          <span className="ornament-glow">🔔</span>
        </div>
        <div className="cascade-item c-col-3 c-delay-15">
          <span className="ornament-glow">🪔</span>
        </div>

        {/* Stream 4 - Mid-Right Modaks & Lotus */}
        <div className="cascade-item c-col-4 c-delay-2">
          <span className="ornament-glow">🍬</span>
        </div>
        <div className="cascade-item c-col-4 c-delay-11">
          <span className="ornament-glow">🌺</span>
        </div>

        {/* Stream 5 - Right Diyas & Divine Sparkles */}
        <div className="cascade-item c-col-5 c-delay-7">
          <span className="ornament-glow">🪔</span>
        </div>
        <div className="cascade-item c-col-5 c-delay-14">
          <span className="ornament-glow">✨</span>
        </div>

        {/* Stream 6 - Far-Right Bell & Modak */}
        <div className="cascade-item c-col-6 c-delay-4">
          <span className="ornament-glow">🍬</span>
        </div>
        <div className="cascade-item c-col-6 c-delay-13">
          <span className="ornament-glow">🔔</span>
        </div>
      </div>

      {/* 4. BALANCED CONTRAST VIGNETTE OVERLAY */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(8, 11, 20, 0.25) 0%, rgba(8, 11, 20, 0.6) 65%, rgba(8, 11, 20, 0.85) 100%)'
      }} />

    </div>
  );
}

/**
 * Detailed Artistic Vector Lord Ganesha with:
 * - Mukut (Ornate Divine Crown)
 * - Kundal (Sacred Earrings)
 * - Tilak / Tripundra on forehead
 * - Modak in trunk
 * - Multi-ringed ornamental sun halo / mandala aura
 */
function GaneshIdolSvg({
  size = 400,
  haloSpeed = 50,
  reverse = false
}: {
  size?: number;
  haloSpeed?: number;
  reverse?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="divineGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE57F" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#FFB800" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FF671F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Glow Center */}
      <circle cx="100" cy="95" r="70" fill="url(#divineGlowGrad)" />

      {/* 1. ROTATING SACRED SUN MANDALA HALO (AURA) */}
      <g className={reverse ? 'halo-spin-reverse' : 'halo-spin'}>
        {/* Outer Aureole with 16 Divine Sun Rays */}
        <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <circle cx="100" cy="100" r="68" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />

        {/* Sacred Ray Beams */}
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, i) => (
          <line
            key={i}
            x1="100"
            y1="16"
            x2="100"
            y2="25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            transform={`rotate(${angle} 100 100)`}
            opacity="0.75"
          />
        ))}

        {/* Halo Lotus Petal Arc Ring */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <circle
            key={`dot-${i}`}
            cx="100"
            cy="29"
            r="2"
            fill="currentColor"
            transform={`rotate(${angle} 100 100)`}
            opacity="0.8"
          />
        ))}
      </g>

      {/* 2. GANESHA ORNAMENTS: MUKUT (CROWN) */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Mukut Spire & Arch */}
        <path d="M100 24 L100 34" strokeWidth="2.5" />
        <circle cx="100" cy="22" r="2.5" fill="currentColor" />
        {/* Crown Tier 1 */}
        <path d="M88 48 Q100 32 112 48 Z" fill="rgba(255, 184, 0, 0.15)" strokeWidth="1.8" />
        {/* Crown Tier 2 - Lotus Crown */}
        <path d="M82 58 Q100 44 118 58 L114 48 L86 48 Z" fill="rgba(255, 184, 0, 0.2)" strokeWidth="1.8" />
        {/* Crown Jewel Center */}
        <circle cx="100" cy="50" r="2.5" fill="#FFD700" />
      </g>

      {/* 3. SACRED TILAK / TRIPUNDRA & TRISHUL ON FOREHEAD */}
      <g stroke="currentColor" strokeLinecap="round">
        {/* Horizontal Tripundra lines */}
        <path d="M93 64 Q100 66 107 64" strokeWidth="1.5" />
        <path d="M94 67 Q100 69 106 67" strokeWidth="1.5" />
        {/* Red Vermilion / Gold Urdhva Pundra Tilak */}
        <path d="M100 60 L100 71" stroke="#FF671F" strokeWidth="2.5" />
        <circle cx="100" cy="72" r="1.5" fill="#FF671F" />
      </g>

      {/* 4. GANESH SILHOUETTE & EARS WITH KUNDAL ORNAMENTS */}
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {/* Left Large Ear */}
        <path d="M84 62 C68 56 56 68 58 84 C60 98 74 104 86 100" />
        {/* Left Ear Kundal (Sacred Earring) */}
        <circle cx="63" cy="94" r="3.5" strokeWidth="1.5" fill="rgba(255, 184, 0, 0.3)" />

        {/* Right Large Ear */}
        <path d="M116 62 C132 56 144 68 142 84 C140 98 126 104 114 100" />
        {/* Right Ear Kundal */}
        <circle cx="137" cy="94" r="3.5" strokeWidth="1.5" fill="rgba(255, 184, 0, 0.3)" />

        {/* Gentle Eyes */}
        <path d="M88 77 Q92 74 95 78" strokeWidth="2" fill="none" />
        <path d="M112 77 Q108 74 105 78" strokeWidth="2" fill="none" />

        {/* Broken Left Tusk (Ekadanta) & Right Full Tusk */}
        <path d="M89 94 L85 99" strokeWidth="3" />
        <path d="M111 94 L116 103" strokeWidth="2" />

        {/* Curled Trunk (Vakratunda) */}
        <path
          d="M100 78 C100 92 97 106 94 116 C90 128 92 136 102 136 C112 136 116 128 116 122 C116 116 110 114 106 118"
          strokeWidth="3.2"
        />

        {/* SACRED MODAK ON TRUNK TIP */}
        <g transform="translate(106, 114)">
          <path
            d="M0 4 Q3 -2 6 4 Q3 7 0 4 Z"
            fill="#FFD700"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </g>
      </g>

      {/* 5. FLORAL GARLAND (MALA) AROUND SHOULDERS */}
      <g stroke="currentColor" strokeWidth="1.5" opacity="0.75">
        <path d="M78 112 Q100 130 122 112" strokeDasharray="3 4" strokeWidth="2.5" />
        <circle cx="86" cy="118" r="2.5" fill="currentColor" />
        <circle cx="100" cy="123" r="3" fill="#FFB800" />
        <circle cx="114" cy="118" r="2.5" fill="currentColor" />
      </g>

      {/* 6. LOTUS PEDESTAL / BASE (PADMASANA) */}
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="rgba(255, 184, 0, 0.08)">
        <path d="M70 148 Q100 138 130 148 C122 158 78 158 70 148 Z" />
        <path d="M82 148 Q100 156 118 148" />
        {/* Lotus Petals at base */}
        <path d="M100 148 Q94 162 100 166 Q106 162 100 148" fill="rgba(255, 103, 31, 0.2)" />
        <path d="M84 148 Q78 160 86 163 Q94 158 88 148" />
        <path d="M116 148 Q122 160 114 163 Q106 158 112 148" />
      </g>
    </svg>
  );
}
