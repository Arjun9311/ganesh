'use client';

import React from 'react';
import Link from 'next/link';
import { Play, RotateCcw, Volume2, VolumeX, ArrowLeft, BookOpen } from 'lucide-react';

interface TempleRunPauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onTutorial: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function TempleRunPauseModal({
  onResume,
  onRestart,
  onTutorial,
  isMuted,
  onToggleMute
}: TempleRunPauseModalProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(8, 11, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 60,
      userSelect: 'none'
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: 'linear-gradient(180deg, rgba(30, 26, 62, 0.98) 0%, rgba(16, 18, 40, 0.98) 100%)',
        border: '2px solid rgba(255, 184, 0, 0.6)',
        borderRadius: 24,
        padding: '32px 28px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 184, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🕉️</div>
        
        <h2 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 26,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: 2,
          marginBottom: 6
        }}>
          JOURNEY PAUSED
        </h2>

        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24 }}>
          Lord Ganesha rests beneath the temple shade.
        </p>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onResume}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
              color: '#080B14',
              fontFamily: "'Cinzel', serif",
              fontSize: 16,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(255, 184, 0, 0.6)'
            }}
          >
            <Play size={18} fill="#080B14" />
            <span>RESUME JOURNEY</span>
          </button>

          <button
            onClick={onRestart}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 184, 0, 0.3)',
              color: '#FFE57F',
              fontSize: 14,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={16} />
            <span>RESTART RUN</span>
          </button>

          <button
            onClick={onToggleMute}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            {isMuted ? <VolumeX size={16} color="#E11D48" /> : <Volume2 size={16} color="#FFD700" />}
            <span>AUDIO: {isMuted ? 'MUTED' : 'ENABLED'}</span>
          </button>

          <button
            onClick={onTutorial}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <BookOpen size={16} />
            <span>CONTROLS TUTORIAL</span>
          </button>

          <Link
            href="/arcade"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 14,
              background: 'rgba(225, 29, 72, 0.15)',
              border: '1px solid rgba(225, 29, 72, 0.4)',
              color: '#FDA4AF',
              fontSize: 13,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4
            }}
          >
            <ArrowLeft size={16} />
            <span>EXIT TO ARCADE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
