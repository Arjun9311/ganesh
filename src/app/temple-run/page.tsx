'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const TempleRunCanvas = dynamic(
  () => import('@/components/temple-run/TempleRunCanvas'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080B14',
        color: '#FFD700',
        fontFamily: "'Cinzel', serif"
      }}>
        <div style={{
          fontSize: 64,
          filter: 'drop-shadow(0 0 24px rgba(255, 184, 0, 0.7))',
          animation: 'floatSlow 2s ease-in-out infinite'
        }}>
          🐘
        </div>

        <h2 style={{
          fontSize: 'clamp(20px, 4vw, 28px)',
          fontWeight: 900,
          letterSpacing: 2,
          marginTop: 18,
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFD700 50%, #FF884D 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          PREPARING YOUR JOURNEY
        </h2>

        {/* Loading Bar */}
        <div style={{
          width: 240,
          height: 6,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          overflow: 'hidden',
          marginTop: 16
        }}>
          <div style={{
            width: '85%',
            height: '100%',
            background: 'linear-gradient(90deg, #FF671F, #FFB800, #FFD700)',
            borderRadius: 4
          }} />
        </div>

        <p style={{
          fontSize: 13,
          color: '#94A3B8',
          fontFamily: "'Outfit', sans-serif",
          marginTop: 12,
          letterSpacing: 0.5
        }}>
          Entering Sacred Temple Path &amp; The 108 Vighnas...
        </p>
      </div>
    )
  }
);

export default function TempleRunPage() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <TempleRunCanvas />
    </main>
  );
}
