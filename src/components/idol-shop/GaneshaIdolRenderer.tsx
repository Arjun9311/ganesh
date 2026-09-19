'use client';

import React, { useMemo } from 'react';
import { GaneshaCustomization } from '@/types/idolShop';

interface GaneshaIdolRendererProps {
  config: GaneshaCustomization;
  rotation?: number; // Y-axis rotation in degrees (-45 to 45)
  tilt?: number; // X-axis tilt in degrees (-15 to 15)
  zoom?: number; // Scale factor (0.7 to 1.5)
  showPlatform?: boolean;
  interactive?: boolean;
  size?: number | string;
  animateIdle?: boolean;
}

export default function GaneshaIdolRenderer({
  config,
  rotation = 0,
  tilt = 0,
  zoom = 1,
  showPlatform = true,
  interactive = false,
  size = '100%',
  animateIdle = true
}: GaneshaIdolRendererProps) {
  const {
    face = 'face_bal',
    eyes = 'eyes_lotus',
    trunk = 'trunk_idampuri',
    ears = 'ears_traditional',
    crown = 'crown_gold',
    clothes = 'clothes_traditional',
    jewellery = 'jewellery_necklace',
    tilak = 'tilak_trishul',
    flowers = 'flowers_marigold',
    aura = 'aura_gold',
    mushika = 'mushika_golden',
    skinColor = '#D97757',
    clothesColor = '#FF671F',
    decorationColor = '#FFD700'
  } = config;

  // Derive shading / gradient colors
  const skinShadow = useMemo(() => {
    // Darker tone of skin
    return skinColor === '#D97757' ? '#A64B2A' :
           skinColor === '#FF671F' ? '#C2410C' :
           skinColor === '#E6C291' ? '#B88648' :
           skinColor === '#F8F9FA' ? '#CBD5E1' :
           skinColor === '#FFD700' ? '#D97706' :
           skinColor === '#38BDF8' ? '#0284C7' : '#8C3B1B';
  }, [skinColor]);

  const clothesShadow = useMemo(() => {
    return clothesColor === '#FF671F' ? '#9A3412' :
           clothesColor === '#DC2626' ? '#7F1D1D' :
           clothesColor === '#F59E0B' ? '#B45309' :
           clothesColor === '#FEF3C7' ? '#D4B982' :
           clothesColor === '#059669' ? '#064E3B' :
           clothesColor === '#2563EB' ? '#1E3A8A' : '#7C2D12';
  }, [clothesColor]);

  return (
    <div
      style={{
        width: size,
        height: typeof size === 'number' ? size : '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1200,
        overflow: 'visible'
      }}
    >
      {/* 3D Transform Wrapper with idle sway */}
      <div
        className={animateIdle ? 'animate-float' : ''}
        style={{
          width: '100%',
          maxWidth: 480,
          aspectRatio: '1 / 1.15',
          transform: `rotateX(${tilt}deg) rotateY(${rotation}deg) scale(${zoom})`,
          transition: interactive ? 'transform 0.08s ease-out' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformStyle: 'preserve-3d',
          position: 'relative',
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.65))'
        }}
      >
        <svg
          viewBox="0 0 500 580"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible'
          }}
        >
          <defs>
            {/* Skin Gradients */}
            <radialGradient id="skinGrad" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor={skinColor} stopOpacity="1" />
              <stop offset="70%" stopColor={skinColor} stopOpacity="1" />
              <stop offset="100%" stopColor={skinShadow} stopOpacity="1" />
            </radialGradient>

            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={skinColor} />
              <stop offset="100%" stopColor={skinShadow} />
            </linearGradient>

            {/* Clothes Gradients */}
            <linearGradient id="clothesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={clothesColor} />
              <stop offset="50%" stopColor={clothesColor} />
              <stop offset="100%" stopColor={clothesShadow} />
            </linearGradient>

            {/* Gold / Metal Gradients */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="40%" stopColor={decorationColor} />
              <stop offset="85%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            {/* Aura Glows */}
            <radialGradient id="goldAuraGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#FFB800" stopOpacity="0.45" />
              <stop offset="80%" stopColor="#FF671F" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FF671F" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="orangeAuraGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF884D" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#FF5722" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="divineAuraGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#FDE047" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0" />
            </radialGradient>

            {/* Platform Wood / Marble Gradient */}
            <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="30%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#291205" />
            </linearGradient>

            <linearGradient id="pedestalLotusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>

            {/* Subtle Filters */}
            <filter id="divineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* ========================================================
              LAYER 1: AURA BACKDROP
             ======================================================== */}
          {aura === 'aura_gold' && (
            <g className="animate-pulse">
              <circle cx="250" cy="240" r="190" fill="url(#goldAuraGrad)" />
              {/* Sunburst Rays */}
              {Array.from({ length: 16 }).map((_, i) => (
                <line
                  key={i}
                  x1="250"
                  y1="240"
                  x2={250 + Math.cos((i * Math.PI) / 8) * 220}
                  y2={240 + Math.sin((i * Math.PI) / 8) * 220}
                  stroke={decorationColor}
                  strokeWidth="2.5"
                  strokeOpacity="0.4"
                  strokeDasharray="6 4"
                />
              ))}
            </g>
          )}

          {aura === 'aura_orange' && (
            <g className="animate-pulse">
              <circle cx="250" cy="240" r="200" fill="url(#orangeAuraGrad)" />
              {Array.from({ length: 12 }).map((_, i) => (
                <path
                  key={i}
                  d={`M 250 240 Q ${250 + Math.cos((i * Math.PI) / 6) * 160} ${240 + Math.sin((i * Math.PI) / 6) * 160} ${250 + Math.cos(((i + 0.3) * Math.PI) / 6) * 210} ${240 + Math.sin(((i + 0.3) * Math.PI) / 6) * 210}`}
                  stroke="#FF671F"
                  strokeWidth="4"
                  fill="none"
                  strokeOpacity="0.5"
                />
              ))}
            </g>
          )}

          {aura === 'aura_divine' && (
            <g>
              <circle cx="250" cy="240" r="215" fill="url(#divineAuraGrad)" />
              {/* Geometric celestial rings */}
              <circle cx="250" cy="240" r="185" fill="none" stroke="#FFE57F" strokeWidth="2" strokeDasharray="8 6" opacity="0.8" />
              <circle cx="250" cy="240" r="205" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1={250 + Math.cos((i * Math.PI) / 12) * 185}
                  y1={240 + Math.sin((i * Math.PI) / 12) * 185}
                  x2={250 + Math.cos((i * Math.PI) / 12) * 220}
                  y2={240 + Math.sin((i * Math.PI) / 12) * 220}
                  stroke="#FFD700"
                  strokeWidth="2.5"
                  opacity="0.8"
                />
              ))}
            </g>
          )}

          {aura === 'aura_spark' && (
            <g>
              <circle cx="250" cy="240" r="180" fill="url(#goldAuraGrad)" opacity="0.6" />
              {/* Floating starlight sparks */}
              {[
                { x: 130, y: 140, s: 1.2 },
                { x: 370, y: 150, s: 1.4 },
                { x: 90, y: 250, s: 1.0 },
                { x: 410, y: 260, s: 1.1 },
                { x: 140, y: 350, s: 0.9 },
                { x: 360, y: 340, s: 1.3 },
                { x: 250, y: 80, s: 1.5 }
              ].map((sp, idx) => (
                <g key={idx} transform={`translate(${sp.x}, ${sp.y}) scale(${sp.s})`}>
                  <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#FFE57F" filter="url(#divineGlow)" />
                  <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
                </g>
              ))}
            </g>
          )}

          {aura === 'aura_mandala' && (
            <g style={{ transformOrigin: '250px 240px' }}>
              <circle cx="250" cy="240" r="210" fill="url(#goldAuraGrad)" opacity="0.75" />
              <circle cx="250" cy="240" r="195" fill="none" stroke={decorationColor} strokeWidth="3" opacity="0.9" />
              <circle cx="250" cy="240" r="165" fill="none" stroke="#FF884D" strokeWidth="2" strokeDasharray="10 5" />
              {/* 16 Sacred Lotus Petals */}
              {Array.from({ length: 16 }).map((_, i) => {
                const ang = (i * 360) / 16;
                return (
                  <path
                    key={i}
                    d="M 250 45 Q 235 75 250 100 Q 265 75 250 45"
                    fill={i % 2 === 0 ? decorationColor : '#FF671F'}
                    opacity="0.7"
                    transform={`rotate(${ang} 250 240)`}
                  />
                );
              })}
            </g>
          )}

          {/* ========================================================
              LAYER 2: PEDESTAL / ASANA BASE
             ======================================================== */}
          {showPlatform && (
            <g id="pedestal" transform="translate(0, 430)">
              {/* Bottom tier base */}
              <ellipse cx="250" cy="85" rx="190" ry="24" fill="rgba(0,0,0,0.5)" filter="url(#divineGlow)" />
              <path d="M 60 75 Q 250 105 440 75 L 430 105 Q 250 135 70 105 Z" fill="url(#pedestalGrad)" />
              
              {/* Golden trim */}
              <path d="M 60 75 Q 250 105 440 75" stroke={decorationColor} strokeWidth="5" fill="none" />
              <path d="M 70 105 Q 250 135 430 105" stroke={decorationColor} strokeWidth="3" fill="none" />

              {/* Lotus petals throne */}
              {Array.from({ length: 13 }).map((_, i) => {
                const px = 100 + i * 25;
                const py = 55 + Math.sin((i / 12) * Math.PI) * 15;
                return (
                  <path
                    key={i}
                    d={`M ${px - 14} ${py + 10} Q ${px} ${py - 18} ${px + 14} ${py + 10} Z`}
                    fill="url(#pedestalLotusGrad)"
                    stroke={decorationColor}
                    strokeWidth="1.2"
                  />
                );
              })}
              <ellipse cx="250" cy="55" rx="160" ry="20" fill="url(#pedestalGrad)" stroke={decorationColor} strokeWidth="2.5" />

              {/* Small temple diya lamps at sides */}
              <g transform="translate(75, 45)">
                <ellipse cx="0" cy="6" rx="12" ry="5" fill="#D97706" />
                <path d="M -12 6 Q 0 16 12 6 Q 6 -2 -12 6" fill="url(#goldGrad)" />
                {/* Flame */}
                <path d="M 0 -2 Q -4 -10 0 -18 Q 4 -10 0 -2" fill="#FDE047" filter="url(#divineGlow)" />
                <circle cx="0" cy="-7" r="2.5" fill="#EF4444" />
              </g>
              <g transform="translate(425, 45)">
                <ellipse cx="0" cy="6" rx="12" ry="5" fill="#D97706" />
                <path d="M -12 6 Q 0 16 12 6 Q 6 -2 -12 6" fill="url(#goldGrad)" />
                {/* Flame */}
                <path d="M 0 -2 Q -4 -10 0 -18 Q 4 -10 0 -2" fill="#FDE047" filter="url(#divineGlow)" />
                <circle cx="0" cy="-7" r="2.5" fill="#EF4444" />
              </g>
            </g>
          )}

          {/* ========================================================
              LAYER 3: MUSHIKA COMPANION (Side Placement)
             ======================================================== */}
          {mushika !== 'mushika_none' && (
            <g id="mushika" transform="translate(350, 410)">
              {/* Shadow */}
              <ellipse cx="25" cy="50" rx="30" ry="9" fill="rgba(0,0,0,0.55)" />

              {/* Mushika Body */}
              <ellipse cx="25" cy="35" rx="22" ry="16" fill={mushika === 'mushika_royal' ? 'url(#goldGrad)' : (mushika === 'mushika_golden' ? '#D97706' : '#78716C')} stroke={decorationColor} strokeWidth="1" />
              
              {/* Mushika Head */}
              <path d="M 12 32 Q 0 25 2 18 Q 15 15 22 28 Z" fill={mushika === 'mushika_golden' ? '#F59E0B' : '#A8A29E'} />
              {/* Ears */}
              <ellipse cx="8" cy="15" rx="7" ry="9" fill="#FDA4AF" stroke="#D97706" strokeWidth="1" />
              <ellipse cx="16" cy="18" rx="6" ry="8" fill="#F43F5E" />
              
              {/* Eye & Snout */}
              <circle cx="6" cy="22" r="2" fill="#000000" />
              <circle cx="0" cy="25" r="2" fill="#DC2626" />

              {/* Mushika Paws / Modak Feature */}
              {mushika === 'mushika_modak' && (
                <g transform="translate(-8, 20)">
                  {/* Golden Modak */}
                  <path d="M 0 10 Q -8 10 -6 0 Q 0 -10 0 -14 Q 0 -10 6 0 Q 8 10 0 10 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
                  <circle cx="0" cy="-14" r="1.5" fill="#EF4444" />
                </g>
              )}

              {mushika === 'mushika_devoted' && (
                <g transform="translate(-2, 22)">
                  {/* Folded paws */}
                  <ellipse cx="0" cy="0" rx="4" ry="6" fill="#FDA4AF" stroke="#D97706" strokeWidth="1" />
                </g>
              )}

              {mushika === 'mushika_royal' && (
                <g>
                  {/* Royal Crown on mouse */}
                  <polygon points="4,10 9,14 14,10 12,18 6,18" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="0.8" />
                  {/* Ornate Saddle */}
                  <rect x="20" y="24" width="14" height="12" rx="3" fill="#DC2626" stroke={decorationColor} strokeWidth="1" />
                </g>
              )}

              {/* Mushika Long Tail */}
              <path d="M 44 38 Q 65 30 60 15 Q 55 5 48 10" fill="none" stroke={mushika === 'mushika_golden' ? '#D97706' : '#78716C'} strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* ========================================================
              LAYER 4: GANESHA LOWER BODY & DHOTI
             ======================================================== */}
          <g id="body-lower">
            {/* Cross-legged Asana Silhouette */}
            <path
              d="M 120 440 C 100 420, 100 370, 160 360 C 210 350, 290 350, 340 360 C 400 370, 400 420, 380 440 C 350 465, 150 465, 120 440 Z"
              fill="url(#clothesGrad)"
              stroke={clothesShadow}
              strokeWidth="2"
              filter="url(#softShadow)"
            />

            {/* Dhoti Gold Border & Pleats */}
            <path d="M 160 365 Q 250 395 340 365" stroke={decorationColor} strokeWidth="4" fill="none" />
            <path d="M 140 400 Q 250 435 360 400" stroke={decorationColor} strokeWidth="3" strokeDasharray="6 3" fill="none" />
            <path d="M 235 365 L 230 455" stroke={decorationColor} strokeWidth="3" />
            <path d="M 250 365 L 250 460" stroke={decorationColor} strokeWidth="4" />
            <path d="M 265 365 L 270 455" stroke={decorationColor} strokeWidth="3" />

            {/* Feet with Anklets */}
            <ellipse cx="140" cy="435" rx="20" ry="12" fill="url(#skinGrad)" stroke={skinShadow} strokeWidth="1.5" />
            <ellipse cx="360" cy="435" rx="20" ry="12" fill="url(#skinGrad)" stroke={skinShadow} strokeWidth="1.5" />
            {/* Golden Payal / Anklets */}
            <ellipse cx="140" cy="430" rx="16" ry="6" fill="none" stroke={decorationColor} strokeWidth="3" />
            <ellipse cx="360" cy="430" rx="16" ry="6" fill="none" stroke={decorationColor} strokeWidth="3" />
            {/* Red Alata / Mahavar on feet */}
            <circle cx="140" cy="436" r="6" fill="#EF4444" opacity="0.6" />
            <circle cx="360" cy="436" r="6" fill="#EF4444" opacity="0.6" />
          </g>

          {/* ========================================================
              LAYER 5: GANESHA TORSO & ARMS
             ======================================================== */}
          <g id="body-torso">
            {/* Divine Pot-belly (Lambodara) */}
            <ellipse
              cx="250"
              cy="340"
              rx="88"
              ry="75"
              fill="url(#skinGrad)"
              stroke={skinShadow}
              strokeWidth="2.5"
              filter="url(#softShadow)"
            />

            {/* Sacred Navel with small spiral */}
            <circle cx="250" cy="360" r="5" fill={skinShadow} />
            <circle cx="250" cy="360" r="2.5" fill="#EF4444" />

            {/* Sacred Thread (Yajnopavita / Nagabandha) across torso */}
            <path
              d="M 195 270 Q 220 330 280 395"
              stroke={decorationColor}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 193 273 Q 218 333 278 398"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 2"
            />

            {/* Upper Chest */}
            <ellipse cx="250" cy="275" rx="72" ry="48" fill="url(#skinGrad)" stroke={skinShadow} strokeWidth="2" />

            {/* LEFT LOWER HAND (Holding Modak Bowl / Prasad) */}
            <g id="left-lower-hand">
              <path d="M 180 300 Q 150 330 160 370 Q 185 380 205 350" fill="url(#skinGrad)" stroke={skinShadow} strokeWidth="2" />
              {/* Gold Baju-bandh armlet */}
              <path d="M 160 310 Q 175 320 185 315" stroke={decorationColor} strokeWidth="4" fill="none" />
              {/* Prasad Bowl filled with Modaks */}
              <ellipse cx="195" cy="355" rx="24" ry="12" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
              <path d="M 175 355 Q 195 380 215 355 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
              {/* Mini Modaks inside bowl */}
              <circle cx="188" cy="350" r="6" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
              <circle cx="202" cy="350" r="6" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
              <circle cx="195" cy="344" r="7" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
            </g>

            {/* RIGHT LOWER HAND (Abhaya Mudra / Blessing of Fearlessness) */}
            <g id="right-lower-hand">
              <path d="M 320 300 Q 350 330 340 365 Q 315 375 295 350" fill="url(#skinGrad)" stroke={skinShadow} strokeWidth="2" />
              <path d="M 325 315 Q 335 320 350 310" stroke={decorationColor} strokeWidth="4" fill="none" />
              {/* Upraised Blessing Palm */}
              <ellipse cx="330" cy="345" rx="14" ry="18" fill="url(#skinGrad)" stroke={skinShadow} strokeWidth="1.5" />
              {/* Sacred Golden Om or Swastika on palm */}
              <circle cx="330" cy="345" r="7" fill="#EF4444" opacity="0.3" />
              <text x="330" y="349" textAnchor="middle" fontSize="10" fontWeight="900" fill={decorationColor}>ॐ</text>
            </g>

            {/* UPPER ARMS (Holding Ankusha & Pasha) */}
            {/* Upper Right Arm (Parashu / Axe or Lotus) */}
            <path d="M 315 260 Q 365 240 375 285" fill="none" stroke="url(#skinGrad)" strokeWidth="22" strokeLinecap="round" />
            {/* Axe / Trishul */}
            <line x1="375" y1="230" x2="375" y2="300" stroke={decorationColor} strokeWidth="3" />
            <path d="M 375 235 Q 395 245 375 260 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />

            {/* Upper Left Arm (Pasha / Sacred Noose or Modak) */}
            <path d="M 185 260 Q 135 240 125 285" fill="none" stroke="url(#skinGrad)" strokeWidth="22" strokeLinecap="round" />
            {/* Golden Noose / Lotus */}
            <ellipse cx="125" cy="255" rx="9" ry="14" fill="none" stroke={decorationColor} strokeWidth="3" />
          </g>

          {/* ========================================================
              LAYER 6: EARS
             ======================================================== */}
          <g id="ears">
            {/* LEFT EAR */}
            <g id="left-ear">
              {ears === 'ears_traditional' && (
                <path
                  d="M 190 190 C 130 160, 90 200, 95 255 C 100 300, 140 320, 185 270 Z"
                  fill="url(#skinGrad)"
                  stroke={skinShadow}
                  strokeWidth="3"
                />
              )}
              {ears === 'ears_filigree' && (
                <g>
                  <path
                    d="M 190 190 C 120 150, 80 200, 90 265 C 100 310, 145 325, 185 270 Z"
                    fill="url(#skinGrad)"
                    stroke={decorationColor}
                    strokeWidth="3.5"
                  />
                  {/* Filigree Pattern */}
                  <path d="M 120 200 Q 100 240 125 280" stroke={decorationColor} strokeWidth="2" fill="none" strokeDasharray="4 3" />
                  <circle cx="105" cy="235" r="4" fill="url(#goldGrad)" />
                  <circle cx="115" cy="265" r="4" fill="url(#goldGrad)" />
                </g>
              )}
              {ears === 'ears_lotus' && (
                <g>
                  <path
                    d="M 190 190 C 125 155, 85 200, 95 255 C 100 305, 140 320, 185 270 Z"
                    fill="url(#skinGrad)"
                    stroke={skinShadow}
                    strokeWidth="2.5"
                  />
                  {/* Scalloped Lotus Petals */}
                  <path d="M 95 210 Q 80 225 95 240 Q 80 255 100 270" fill="none" stroke="#FDA4AF" strokeWidth="4" />
                </g>
              )}
              {ears === 'ears_graceful' && (
                <path
                  d="M 190 195 C 140 170, 110 210, 115 250 C 120 285, 150 295, 185 265 Z"
                  fill="url(#skinGrad)"
                  stroke={skinShadow}
                  strokeWidth="2"
                />
              )}
              {ears === 'ears_kundan' && (
                <g>
                  <path
                    d="M 190 190 C 120 150, 80 200, 90 265 C 100 310, 145 325, 185 270 Z"
                    fill="url(#skinGrad)"
                    stroke={skinShadow}
                    strokeWidth="3"
                  />
                  {/* Embedded Kundan Gems */}
                  <circle cx="95" cy="205" r="5" fill="#EF4444" stroke={decorationColor} strokeWidth="1.5" />
                  <circle cx="85" cy="230" r="6" fill="#10B981" stroke={decorationColor} strokeWidth="1.5" />
                  <circle cx="95" cy="255" r="5" fill="#EF4444" stroke={decorationColor} strokeWidth="1.5" />
                  <circle cx="115" cy="280" r="5" fill="#3B82F6" stroke={decorationColor} strokeWidth="1.5" />
                </g>
              )}
              {/* Inner ear lines */}
              <path d="M 160 215 Q 130 240 155 265" stroke={skinShadow} strokeWidth="2.5" fill="none" opacity="0.6" />
              <path d="M 170 230 Q 145 250 165 260" stroke={skinShadow} strokeWidth="2" fill="none" opacity="0.4" />
              {/* Earring / Kundala */}
              <circle cx="180" cy="280" r="8" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
              <circle cx="180" cy="280" r="3" fill="#EF4444" />
            </g>

            {/* RIGHT EAR */}
            <g id="right-ear">
              {ears === 'ears_traditional' && (
                <path
                  d="M 310 190 C 370 160, 410 200, 405 255 C 400 300, 360 320, 315 270 Z"
                  fill="url(#skinGrad)"
                  stroke={skinShadow}
                  strokeWidth="3"
                />
              )}
              {ears === 'ears_filigree' && (
                <g>
                  <path
                    d="M 310 190 C 380 150, 420 200, 410 265 C 400 310, 355 325, 315 270 Z"
                    fill="url(#skinGrad)"
                    stroke={decorationColor}
                    strokeWidth="3.5"
                  />
                  <path d="M 380 200 Q 400 240 375 280" stroke={decorationColor} strokeWidth="2" fill="none" strokeDasharray="4 3" />
                  <circle cx="395" cy="235" r="4" fill="url(#goldGrad)" />
                  <circle cx="385" cy="265" r="4" fill="url(#goldGrad)" />
                </g>
              )}
              {ears === 'ears_lotus' && (
                <g>
                  <path
                    d="M 310 190 C 375 155, 415 200, 405 255 C 400 305, 360 320, 315 270 Z"
                    fill="url(#skinGrad)"
                    stroke={skinShadow}
                    strokeWidth="2.5"
                  />
                  <path d="M 405 210 Q 420 225 405 240 Q 420 255 400 270" fill="none" stroke="#FDA4AF" strokeWidth="4" />
                </g>
              )}
              {ears === 'ears_graceful' && (
                <path
                  d="M 310 195 C 360 170, 390 210, 385 250 C 380 285, 350 295, 315 265 Z"
                  fill="url(#skinGrad)"
                  stroke={skinShadow}
                  strokeWidth="2"
                />
              )}
              {ears === 'ears_kundan' && (
                <g>
                  <path
                    d="M 310 190 C 380 150, 420 200, 410 265 C 400 310, 355 325, 315 270 Z"
                    fill="url(#skinGrad)"
                    stroke={skinShadow}
                    strokeWidth="3"
                  />
                  <circle cx="405" cy="205" r="5" fill="#EF4444" stroke={decorationColor} strokeWidth="1.5" />
                  <circle cx="415" cy="230" r="6" fill="#10B981" stroke={decorationColor} strokeWidth="1.5" />
                  <circle cx="405" cy="255" r="5" fill="#EF4444" stroke={decorationColor} strokeWidth="1.5" />
                  <circle cx="385" cy="280" r="5" fill="#3B82F6" stroke={decorationColor} strokeWidth="1.5" />
                </g>
              )}
              <path d="M 340 215 Q 370 240 345 265" stroke={skinShadow} strokeWidth="2.5" fill="none" opacity="0.6" />
              <path d="M 330 230 Q 355 250 335 260" stroke={skinShadow} strokeWidth="2" fill="none" opacity="0.4" />
              {/* Earring / Kundala */}
              <circle cx="320" cy="280" r="8" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
              <circle cx="320" cy="280" r="3" fill="#EF4444" />
            </g>
          </g>

          {/* ========================================================
              LAYER 7: FACE & HEAD BASE
             ======================================================== */}
          <g id="head">
            {/* Face Shape based on style */}
            {face === 'face_bal' && (
              // Round, youthful chubby cheeks
              <path
                d="M 180 200 C 180 140, 320 140, 320 200 C 335 245, 315 285, 250 295 C 185 285, 165 245, 180 200 Z"
                fill="url(#skinGrad)"
                stroke={skinShadow}
                strokeWidth="2.5"
              />
            )}
            {face === 'face_gentle' && (
              // Classic serene oval
              <path
                d="M 185 195 C 185 135, 315 135, 315 195 C 325 245, 310 290, 250 295 C 190 290, 175 245, 185 195 Z"
                fill="url(#skinGrad)"
                stroke={skinShadow}
                strokeWidth="2.5"
              />
            )}
            {face === 'face_raja' && (
              // Strong majestic broad forehead and regal temples
              <path
                d="M 175 185 C 175 130, 325 130, 325 185 C 335 235, 320 295, 250 300 C 180 295, 165 235, 175 185 Z"
                fill="url(#skinGrad)"
                stroke={skinShadow}
                strokeWidth="3"
              />
            )}
            {face === 'face_lalbaug' && (
              // Iconic dramatic Mumbai festival curves
              <path
                d="M 180 190 C 180 135, 320 135, 320 190 C 340 235, 325 295, 250 300 C 175 295, 160 235, 180 190 Z"
                fill="url(#skinGrad)"
                stroke={skinShadow}
                strokeWidth="3"
              />
            )}
            {face === 'face_yogic' && (
              // Contemplative streamlined ascetic geometry
              <path
                d="M 190 195 C 190 140, 310 140, 310 195 C 320 240, 305 285, 250 290 C 195 285, 180 240, 190 195 Z"
                fill="url(#skinGrad)"
                stroke={skinShadow}
                strokeWidth="2.5"
              />
            )}

            {/* Sacred Elephant Forehead Mastaka / Kumbha bumps */}
            <circle cx="220" cy="180" r="16" fill="url(#skinGrad)" opacity="0.4" />
            <circle cx="280" cy="180" r="16" fill="url(#skinGrad)" opacity="0.4" />

            {/* Sacred Tusks */}
            {/* Right Complete Tusk */}
            <path d="M 290 260 Q 330 265 325 285 Q 305 280 285 275 Z" fill="#FFFDF0" stroke="#CBD5E1" strokeWidth="1" />
            {/* Left Broken Tusk (Ekadanta - sacrificed to scribe the Mahabharata) */}
            <path d="M 210 260 Q 185 265 190 273 L 215 275 Z" fill="#FFFDF0" stroke="#CBD5E1" strokeWidth="1" />
          </g>

          {/* ========================================================
              LAYER 8: EYES
             ======================================================== */}
          <g id="eyes">
            {/* LEFT EYE */}
            <g id="left-eye" transform="translate(205, 215)">
              {eyes === 'eyes_lotus' && (
                <g>
                  {/* Elongated lotus shape */}
                  <path d="M -18 0 Q 0 -9 18 0 Q 0 9 -18 0 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />
                  <circle cx="0" cy="0" r="6" fill="#451A03" />
                  <circle cx="0" cy="0" r="3" fill="#000000" />
                  <circle cx="-2" cy="-2" r="2" fill="#FFFFFF" />
                  {/* Lotus flick line */}
                  <path d="M 18 0 Q 24 -3 28 -1" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                </g>
              )}
              {eyes === 'eyes_compassionate' && (
                <g>
                  <path d="M -16 2 Q 0 -8 16 2 Q 0 10 -16 2 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
                  <circle cx="0" cy="1" r="6.5" fill="#78350F" />
                  <circle cx="0" cy="1" r="3.5" fill="#000000" />
                  <circle cx="-2" cy="-1" r="2" fill="#FFFFFF" />
                </g>
              )}
              {eyes === 'eyes_smiling' && (
                <g>
                  {/* Crescent happy eyes */}
                  <path d="M -16 4 Q 0 -6 16 4" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="0" cy="6" r="3.5" fill="#000000" />
                  <circle cx="-1" cy="5" r="1.2" fill="#FFFFFF" />
                </g>
              )}
              {eyes === 'eyes_meditative' && (
                <g>
                  {/* Closed peaceful lid */}
                  <path d="M -18 0 Q 0 10 18 0" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                  {/* Delicate lashes */}
                  <line x1="-8" y1="5" x2="-10" y2="9" stroke="#0F172A" strokeWidth="1.2" />
                  <line x1="0" y1="7" x2="0" y2="12" stroke="#0F172A" strokeWidth="1.2" />
                  <line x1="8" y1="5" x2="10" y2="9" stroke="#0F172A" strokeWidth="1.2" />
                </g>
              )}
              {eyes === 'eyes_royal' && (
                <g>
                  {/* Bold sharp kohl rimmed */}
                  <path d="M -20 0 Q 0 -11 20 0 Q 0 11 -20 0 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                  <circle cx="0" cy="0" r="7" fill="#1E293B" />
                  <circle cx="0" cy="0" r="3.5" fill="#000000" />
                  <circle cx="-2" cy="-2" r="2" fill="#FFFFFF" />
                  <path d="M 20 0 L 30 -3" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}
              {eyes === 'eyes_star' && (
                <g>
                  <path d="M -18 0 Q 0 -9 18 0 Q 0 9 -18 0 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="6" fill="#1E1B4B" />
                  {/* Star pupil */}
                  <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1" fill="#FFD700" filter="url(#divineGlow)" />
                </g>
              )}
            </g>

            {/* RIGHT EYE */}
            <g id="right-eye" transform="translate(295, 215)">
              {eyes === 'eyes_lotus' && (
                <g>
                  <path d="M -18 0 Q 0 -9 18 0 Q 0 9 -18 0 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />
                  <circle cx="0" cy="0" r="6" fill="#451A03" />
                  <circle cx="0" cy="0" r="3" fill="#000000" />
                  <circle cx="2" cy="-2" r="2" fill="#FFFFFF" />
                  <path d="M -18 0 Q -24 -3 -28 -1" stroke="#0F172A" strokeWidth="1.5" fill="none" />
                </g>
              )}
              {eyes === 'eyes_compassionate' && (
                <g>
                  <path d="M -16 2 Q 0 -8 16 2 Q 0 10 -16 2 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
                  <circle cx="0" cy="1" r="6.5" fill="#78350F" />
                  <circle cx="0" cy="1" r="3.5" fill="#000000" />
                  <circle cx="2" cy="-1" r="2" fill="#FFFFFF" />
                </g>
              )}
              {eyes === 'eyes_smiling' && (
                <g>
                  <path d="M -16 4 Q 0 -6 16 4" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="0" cy="6" r="3.5" fill="#000000" />
                  <circle cx="1" cy="5" r="1.2" fill="#FFFFFF" />
                </g>
              )}
              {eyes === 'eyes_meditative' && (
                <g>
                  <path d="M -18 0 Q 0 10 18 0" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                  <line x1="-8" y1="5" x2="-10" y2="9" stroke="#0F172A" strokeWidth="1.2" />
                  <line x1="0" y1="7" x2="0" y2="12" stroke="#0F172A" strokeWidth="1.2" />
                  <line x1="8" y1="5" x2="10" y2="9" stroke="#0F172A" strokeWidth="1.2" />
                </g>
              )}
              {eyes === 'eyes_royal' && (
                <g>
                  <path d="M -20 0 Q 0 -11 20 0 Q 0 11 -20 0 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                  <circle cx="0" cy="0" r="7" fill="#1E293B" />
                  <circle cx="0" cy="0" r="3.5" fill="#000000" />
                  <circle cx="2" cy="-2" r="2" fill="#FFFFFF" />
                  <path d="M -20 0 L -30 -3" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}
              {eyes === 'eyes_star' && (
                <g>
                  <path d="M -18 0 Q 0 -9 18 0 Q 0 9 -18 0 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="6" fill="#1E1B4B" />
                  <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1" fill="#FFD700" filter="url(#divineGlow)" />
                </g>
              )}
            </g>
          </g>

          {/* ========================================================
              LAYER 9: TILAK (Forehead Auspicious Mark)
             ======================================================== */}
          <g id="tilak" transform="translate(250, 180)">
            {tilak === 'tilak_trishul' && (
              <g>
                {/* Trident base in yellow chandan, vermilion center */}
                <path d="M -16 -18 Q 0 -8 16 -18 L 12 -4 Q 0 4 -12 -4 Z" fill="#FEF08A" stroke="#EAB308" strokeWidth="1" />
                {/* Red Trishul center spear */}
                <line x1="0" y1="-25" x2="0" y2="10" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
                {/* Left & Right prongs */}
                <path d="M -12 -18 Q -6 -2 -2 6" stroke="#DC2626" strokeWidth="2.5" fill="none" />
                <path d="M 12 -18 Q 6 -2 2 6" stroke="#DC2626" strokeWidth="2.5" fill="none" />
                <circle cx="0" cy="14" r="3" fill="#DC2626" />
              </g>
            )}

            {tilak === 'tilak_chandan' && (
              <g>
                {/* Sandalwood Crescent */}
                <path d="M -18 -8 Q 0 10 18 -8 Q 0 2 -18 -8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
                {/* Crimson Kumkum Bindi in center */}
                <circle cx="0" cy="-6" r="4.5" fill="#EF4444" />
                <circle cx="0" cy="-6" r="1.5" fill="#FDE047" />
              </g>
            )}

            {tilak === 'tilak_urdhva' && (
              <g>
                {/* Vaishnava White Urdhva Lines */}
                <path d="M -10 -22 L -8 8 L -4 14 L 0 8 L 4 14 L 8 8 L 10 -22" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                {/* Central Red Kumkum Saffron Line */}
                <line x1="0" y1="-20" x2="0" y2="12" stroke="#EA580C" strokeWidth="2.8" strokeLinecap="round" />
              </g>
            )}

            {tilak === 'tilak_surya' && (
              <g>
                {/* Solar Ray Bindi */}
                <circle cx="0" cy="-6" r="10" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
                <circle cx="0" cy="-6" r="6" fill="#DC2626" />
                <circle cx="0" cy="-6" r="2.5" fill="#FFD700" />
              </g>
            )}

            {tilak === 'tilak_gold' && (
              <g>
                <polygon points="0,-24 8,-12 4,8 0,14 -4,8 -8,-12" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" filter="url(#divineGlow)" />
                <circle cx="0" cy="-6" r="3" fill="#EF4444" />
              </g>
            )}
          </g>

          {/* ========================================================
              LAYER 10: TRUNK (Vakratunda)
             ======================================================== */}
          <g id="trunk">
            {trunk === 'trunk_idampuri' && (
              // Left-curved auspicious trunk
              <g>
                <path
                  d="M 235 240 C 235 270, 220 310, 200 330 C 180 350, 160 345, 165 325 C 170 305, 205 310, 215 285 C 225 260, 265 240, 265 240 Z"
                  fill="url(#skinGrad)"
                  stroke={skinShadow}
                  strokeWidth="2.8"
                />
                {/* Transverse trunk crease lines */}
                <path d="M 232 260 Q 248 265 258 258" stroke={skinShadow} strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M 222 280 Q 238 285 248 278" stroke={skinShadow} strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M 205 305 Q 220 310 228 300" stroke={skinShadow} strokeWidth="2" fill="none" opacity="0.6" />
                {/* Gold ring on trunk */}
                <ellipse cx="185" cy="325" rx="8" ry="14" fill="none" stroke={decorationColor} strokeWidth="3" transform="rotate(-30 185 325)" />
              </g>
            )}

            {trunk === 'trunk_valampuri' && (
              // Right-curved Dakshinabhimukhi trunk
              <g>
                <path
                  d="M 265 240 C 265 270, 280 310, 300 330 C 320 350, 340 345, 335 325 C 330 305, 295 310, 285 285 C 275 260, 235 240, 235 240 Z"
                  fill="url(#skinGrad)"
                  stroke={skinShadow}
                  strokeWidth="2.8"
                />
                <path d="M 268 260 Q 252 265 242 258" stroke={skinShadow} strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M 278 280 Q 262 285 252 278" stroke={skinShadow} strokeWidth="2" fill="none" opacity="0.6" />
                <ellipse cx="315" cy="325" rx="8" ry="14" fill="none" stroke={decorationColor} strokeWidth="3" transform="rotate(30 315 325)" />
              </g>
            )}

            {trunk === 'trunk_modak' && (
              // Left-curved holding a glowing golden modak!
              <g>
                <path
                  d="M 235 240 C 235 270, 215 305, 195 325 C 175 345, 150 340, 155 315 C 160 295, 195 300, 210 280 C 225 260, 265 240, 265 240 Z"
                  fill="url(#skinGrad)"
                  stroke={skinShadow}
                  strokeWidth="2.8"
                />
                <path d="M 230 265 Q 248 270 258 260" stroke={skinShadow} strokeWidth="2" fill="none" opacity="0.6" />
                {/* Modak held at trunk tip */}
                <g transform="translate(150, 310)">
                  <path d="M 0 12 Q -10 12 -8 0 Q 0 -14 0 -18 Q 0 -14 8 0 Q 10 12 0 12 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" filter="url(#divineGlow)" />
                  <circle cx="0" cy="-18" r="2" fill="#EF4444" />
                </g>
              </g>
            )}

            {trunk === 'trunk_bell' && (
              // Trunk with temple bell at tip
              <g>
                <path
                  d="M 235 240 C 235 270, 220 310, 200 330 C 180 350, 160 345, 165 325 C 170 305, 205 310, 215 285 C 225 260, 265 240, 265 240 Z"
                  fill="url(#skinGrad)"
                  stroke={skinShadow}
                  strokeWidth="2.8"
                />
                {/* Temple Bell */}
                <g transform="translate(162, 335)">
                  <path d="M -8 10 Q -6 0 0 -5 Q 6 0 8 10 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
                  <circle cx="0" cy="12" r="3" fill="#F59E0B" />
                </g>
              </g>
            )}

            {trunk === 'trunk_jeweled' && (
              // Trunk with blooming jeweled lotus at tip
              <g>
                <path
                  d="M 235 240 C 235 270, 220 310, 200 330 C 180 350, 160 345, 165 325 C 170 305, 205 310, 215 285 C 225 260, 265 240, 265 240 Z"
                  fill="url(#skinGrad)"
                  stroke={decorationColor}
                  strokeWidth="3"
                />
                {/* Golden trunk spine inlay */}
                <path d="M 248 245 Q 225 290 190 325" stroke={decorationColor} strokeWidth="3" fill="none" strokeDasharray="4 2" />
                {/* Pink Lotus Blossom */}
                <g transform="translate(160, 325)">
                  <path d="M 0 0 Q -10 -15 0 -22 Q 10 -15 0 0" fill="#FDA4AF" stroke="#F43F5E" strokeWidth="1.2" />
                  <path d="M -6 -4 Q -16 -12 -8 -20 Q 0 -12 -6 -4" fill="#FB7185" stroke="#E11D48" strokeWidth="1" />
                  <path d="M 6 -4 Q 16 -12 8 -20 Q 0 -12 6 -4" fill="#FB7185" stroke="#E11D48" strokeWidth="1" />
                  <circle cx="0" cy="-10" r="2.5" fill="#FFD700" />
                </g>
              </g>
            )}
          </g>

          {/* ========================================================
              LAYER 11: JEWELLERY
             ======================================================== */}
          <g id="jewellery">
            {jewellery === 'jewellery_necklace' && (
              <g>
                <path d="M 195 270 Q 250 310 305 270" stroke={decorationColor} strokeWidth="5" fill="none" strokeLinecap="round" />
                <circle cx="250" cy="296" r="9" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
                <circle cx="250" cy="296" r="4" fill="#EF4444" />
              </g>
            )}

            {jewellery === 'jewellery_gold_chains' && (
              <g>
                <path d="M 195 265 Q 250 295 305 265" stroke={decorationColor} strokeWidth="3.5" fill="none" />
                <path d="M 190 275 Q 250 315 310 275" stroke={decorationColor} strokeWidth="4" fill="none" />
                <path d="M 185 288 Q 250 338 315 288" stroke={decorationColor} strokeWidth="4.5" fill="none" />
                <circle cx="250" cy="324" r="10" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
                <circle cx="250" cy="324" r="5" fill="#10B981" />
              </g>
            )}

            {jewellery === 'jewellery_floral' && (
              <g>
                <path d="M 195 265 Q 250 305 305 265" stroke="#FFFFFF" strokeWidth="8" fill="none" strokeDasharray="8 4" opacity="0.9" />
                <path d="M 195 272 Q 250 318 305 272" stroke="#FF671F" strokeWidth="6" fill="none" strokeDasharray="6 3" />
                <circle cx="250" cy="305" r="8" fill="#EF4444" />
              </g>
            )}

            {jewellery === 'jewellery_royal' && (
              <g>
                <path d="M 190 265 Q 250 310 310 265" stroke={decorationColor} strokeWidth="6" fill="none" />
                {/* 9 Navratna Gems */}
                {[-36, -27, -18, -9, 0, 9, 18, 27, 36].map((offset, i) => {
                  const colors = ['#EF4444', '#FFFFFF', '#3B82F6', '#10B981', '#FFD700', '#6366F1', '#D97706', '#8B5CF6', '#EC4899'];
                  const cx = 250 + offset * 1.3;
                  const cy = 295 - Math.cos((offset / 45) * Math.PI) * 14 + (offset === 0 ? 12 : 0);
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={offset === 0 ? 6 : 4}
                      fill={colors[i]}
                      stroke={decorationColor}
                      strokeWidth="1"
                    />
                  );
                })}
              </g>
            )}

            {jewellery === 'jewellery_divine' && (
              <g>
                <path d="M 190 265 Q 250 320 310 265" stroke="url(#goldGrad)" strokeWidth="6" fill="none" filter="url(#divineGlow)" />
                {/* Cosmic Talisman */}
                <polygon points="250,305 258,318 250,332 242,318" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" filter="url(#divineGlow)" />
                <circle cx="250" cy="318" r="3" fill="#FFFFFF" />
              </g>
            )}
          </g>

          {/* ========================================================
              LAYER 12: FLOWERS & GARLANDS
             ======================================================== */}
          <g id="flowers">
            {flowers === 'flowers_marigold' && (
              <g>
                {/* Draping Marigold Mala */}
                <path d="M 175 230 C 150 280, 160 380, 250 405 C 340 380, 350 280, 325 230" stroke="#FF884D" strokeWidth="14" fill="none" strokeDasharray="12 4" strokeLinecap="round" />
                <path d="M 175 230 C 150 280, 160 380, 250 405 C 340 380, 350 280, 325 230" stroke="#FBBF24" strokeWidth="8" fill="none" strokeDasharray="8 6" strokeLinecap="round" />
              </g>
            )}

            {flowers === 'flowers_rose' && (
              <g>
                <path d="M 175 230 C 150 280, 160 380, 250 405 C 340 380, 350 280, 325 230" stroke="#DC2626" strokeWidth="12" fill="none" strokeDasharray="10 4" strokeLinecap="round" />
                <path d="M 175 230 C 150 280, 160 380, 250 405 C 340 380, 350 280, 325 230" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeDasharray="4 8" strokeLinecap="round" />
              </g>
            )}

            {flowers === 'flowers_lotus' && (
              <g>
                <path d="M 175 230 C 150 280, 160 380, 250 405 C 340 380, 350 280, 325 230" stroke="#FDA4AF" strokeWidth="12" fill="none" strokeDasharray="12 6" strokeLinecap="round" />
                {/* 5 Lotus blossoms on garland */}
                {[-60, -30, 0, 30, 60].map((deg, idx) => {
                  const rad = (deg * Math.PI) / 180;
                  const lx = 250 + Math.sin(rad) * 90;
                  const ly = 320 + Math.cos(rad) * 75;
                  return (
                    <circle key={idx} cx={lx} cy={ly} r="7" fill="#F43F5E" stroke="#FFE57F" strokeWidth="1.5" />
                  );
                })}
              </g>
            )}

            {flowers === 'flowers_mixed' && (
              <g>
                <path d="M 175 230 C 150 280, 160 380, 250 405 C 340 380, 350 280, 325 230" stroke="#F59E0B" strokeWidth="14" fill="none" strokeDasharray="8 8" strokeLinecap="round" />
                <path d="M 175 230 C 150 280, 160 380, 250 405 C 340 380, 350 280, 325 230" stroke="#EF4444" strokeWidth="10" fill="none" strokeDasharray="8 16" strokeLinecap="round" />
              </g>
            )}

            {flowers === 'flowers_garland' && (
              <g>
                {/* Grand Temple Double Mala */}
                <path d="M 165 210 C 130 270, 140 390, 250 425 C 360 390, 370 270, 335 210" stroke="#FF671F" strokeWidth="16" fill="none" strokeDasharray="12 6" strokeLinecap="round" />
                <path d="M 175 225 C 145 280, 155 375, 250 400 C 345 375, 355 280, 325 225" stroke="#FDE047" strokeWidth="10" fill="none" strokeDasharray="8 4" strokeLinecap="round" />
                {/* Red rose medallion hanging at garland center */}
                <circle cx="250" cy="425" r="14" fill="#DC2626" stroke={decorationColor} strokeWidth="2" />
                <circle cx="250" cy="425" r="6" fill="#FFD700" />
              </g>
            )}
          </g>

          {/* ========================================================
              LAYER 13: CROWN (Mukut)
             ======================================================== */}
          <g id="crown" transform="translate(250, 155)">
            {crown === 'crown_traditional' && (
              <g>
                {/* Base band */}
                <path d="M -65 0 Q 0 -12 65 0 L 55 18 Q 0 8 -55 18 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
                {/* Tiered Mukut Body */}
                <path d="M -55 0 L -40 -50 L -25 -75 L 0 -100 L 25 -75 L 40 -50 L 55 0 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
                {/* Kalash Top */}
                <circle cx="0" cy="-106" r="8" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
                <polygon points="0,-122 -4,-112 4,-112" fill="#FFD700" />
                {/* Central Ruby & Gems */}
                <circle cx="0" cy="-45" r="9" fill="#EF4444" stroke="#B45309" strokeWidth="1.5" />
                <circle cx="-25" cy="-25" r="5" fill="#10B981" />
                <circle cx="25" cy="-25" r="5" fill="#10B981" />
              </g>
            )}

            {crown === 'crown_gold' && (
              <g>
                <path d="M -60 0 Q 0 -10 60 0 L 50 18 Q 0 8 -50 18 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
                {/* Multi-point radiant golden peaks */}
                <polygon points="0,-95 18,-60 40,-75 35,-30 55,-10 -55,-10 -35,-30 -40,-75 -18,-60" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
                {/* Carved sun medallion */}
                <circle cx="0" cy="-40" r="14" fill="#FDE047" stroke="#D97706" strokeWidth="2" filter="url(#divineGlow)" />
                <circle cx="0" cy="-40" r="6" fill="#EF4444" />
              </g>
            )}

            {crown === 'crown_festival' && (
              <g>
                {/* Ornate crown with peacock plume */}
                <path d="M -65 0 Q 0 -12 65 0 L 55 20 Q 0 8 -55 20 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
                <path d="M -50 0 L -30 -60 L 0 -85 L 30 -60 L 50 0 Z" fill="#DC2626" stroke={decorationColor} strokeWidth="2" />
                {/* Peacock Feathers on top */}
                <g transform="translate(0, -95)">
                  <path d="M 0 10 Q -25 -25 0 -45 Q 25 -25 0 10" fill="#047857" stroke="#10B981" strokeWidth="1.5" />
                  <ellipse cx="0" cy="-25" rx="10" ry="14" fill="#1D4ED8" />
                  <circle cx="0" cy="-25" r="6" fill="#FDE047" />
                  <circle cx="0" cy="-25" r="3" fill="#0F172A" />
                </g>
                <circle cx="0" cy="-35" r="10" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
              </g>
            )}

            {crown === 'crown_royal' && (
              <g>
                <path d="M -70 0 Q 0 -15 70 0 L 60 22 Q 0 8 -60 22 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2.5" />
                {/* Royal Imperial Velvet Cap */}
                <path d="M -55 0 C -55 -70, 55 -70, 55 0 Z" fill="#7F1D1D" stroke={decorationColor} strokeWidth="2" />
                {/* Golden Arches */}
                <path d="M -55 0 Q 0 -90 55 0" stroke={decorationColor} strokeWidth="6" fill="none" />
                <path d="M 0 0 L 0 -85" stroke={decorationColor} strokeWidth="6" />
                {/* Imperial Cross / Kalash */}
                <circle cx="0" cy="-92" r="10" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
                <polygon points="0,-115 -6,-98 6,-98" fill="#FFD700" />
                {/* Emerald Teardrops */}
                <circle cx="-35" cy="-30" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="35" cy="-30" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="0" cy="-45" r="9" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
              </g>
            )}

            {crown === 'crown_lotus' && (
              <g>
                <path d="M -60 0 Q 0 -12 60 0 L 50 18 Q 0 8 -50 18 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
                {/* Blooming Thousand-Petaled Lotus Crest */}
                <path d="M 0 0 Q -20 -40 0 -80 Q 20 -40 0 0" fill="#FDA4AF" stroke="#F43F5E" strokeWidth="2" />
                <path d="M -15 0 Q -45 -35 -20 -70 Q 0 -40 -15 0" fill="#FB7185" stroke="#E11D48" strokeWidth="1.5" />
                <path d="M 15 0 Q 45 -35 20 -70 Q 0 -40 15 0" fill="#FB7185" stroke="#E11D48" strokeWidth="1.5" />
                <path d="M -30 0 Q -60 -25 -40 -50 Q -15 -25 -30 0" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.2" />
                <path d="M 30 0 Q 60 -25 40 -50 Q 15 -25 30 0" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.2" />
                {/* Golden Stamen in center */}
                <circle cx="0" cy="-40" r="10" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" filter="url(#divineGlow)" />
                <circle cx="0" cy="-84" r="5" fill="#FFE57F" />
              </g>
            )}

            {crown === 'crown_divine' && (
              <g>
                <path d="M -65 0 Q 0 -15 65 0 L 55 20 Q 0 8 -55 20 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2.5" />
                {/* Celestial Spire */}
                <polygon points="0,-125 12,-70 45,-85 30,-30 55,-5 -55,-5 -30,-30 -45,-85 -12,-70" fill="url(#goldGrad)" stroke="#FFFFFF" strokeWidth="2" filter="url(#divineGlow)" />
                <polygon points="0,-140 -8,-120 8,-120" fill="#FFE57F" filter="url(#divineGlow)" />
                {/* Blazing Center Stone */}
                <circle cx="0" cy="-45" r="12" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#divineGlow)" />
              </g>
            )}

            {crown === 'crown_vighnaharta' && (
              <g>
                {/* The 108 Vighnas Supreme Mukut */}
                <path d="M -75 0 Q 0 -18 75 0 L 65 24 Q 0 8 -65 24 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="3" />
                {/* Dual Halo Spire */}
                <circle cx="0" cy="-70" r="45" fill="none" stroke={decorationColor} strokeWidth="3" strokeDasharray="6 3" filter="url(#divineGlow)" />
                <polygon points="0,-130 18,-75 55,-90 35,-35 65,-5 -65,-5 -35,-35 -55,-90 -18,-75" fill="url(#goldGrad)" stroke="#FFFFFF" strokeWidth="2" filter="url(#divineGlow)" />
                {/* Trident Spire */}
                <path d="M 0 -130 L 0 -155" stroke="#FFFFFF" strokeWidth="3" />
                <path d="M -10 -148 Q 0 -140 0 -132" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
                <path d="M 10 -148 Q 0 -140 0 -132" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
                {/* Legendary Chintamani Jewel */}
                <polygon points="0,-65 14,-50 0,-35 -14,-50" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" filter="url(#divineGlow)" />
                <circle cx="0" cy="-50" r="4" fill="#FFFFFF" />
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}
