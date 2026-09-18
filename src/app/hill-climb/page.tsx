'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import HillClimbCanvas with SSR disabled
const HillClimbCanvas = dynamic(
  () => import('@/components/hill-climb/HillClimbCanvas'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#080B14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFD700',
        fontFamily: "'Cinzel', serif"
      }}>
        <div style={{
          fontSize: 48,
          marginBottom: 16,
          animation: 'pulse 1.2s infinite ease-in-out'
        }}>
          🏎️
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: 2 }}>
          PREPARING SACRED CHARIOTS...
        </h2>
        <span style={{ fontSize: 13, color: '#FF884D', marginTop: 8 }}>
          Ganesha Hill Climb Racing is initializing physics & mountains
        </span>
      </div>
    )
  }
);

export default function HillClimbPage() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <HillClimbCanvas />
    </main>
  );
}
