'use client';

import dynamic from 'next/dynamic';

// Dynamically import GameCanvas with SSR disabled because Three.js relies on window and WebGL
const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-midnight)',
      color: 'var(--gold-light)'
    }}>
      <div style={{ fontSize: '4rem', animation: 'floatSlow 2s ease-in-out infinite' }}>🐘</div>
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.8rem',
        fontWeight: 800,
        letterSpacing: '2px',
        marginTop: 16
      }}>
        PREPARING THE JOURNEY
      </h2>
      <div style={{
        width: 240,
        height: 6,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 14
      }}>
        <div style={{
          width: '80%',
          height: '100%',
          background: 'linear-gradient(90deg, #FF671F, #FFB800)',
          borderRadius: 3
        }} />
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 10 }}>
        Loading Indian Festival World & 108 Vighnas...
      </p>
    </div>
  )
});

export default function GamePage() {
  return <GameCanvas />;
}
