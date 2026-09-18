'use client';

import React, { useState } from 'react';
import { Play, ArrowLeftRight, ArrowUp, ArrowDown, Sparkles, ShieldAlert, Award } from 'lucide-react';

interface TutorialOverlayProps {
  onStartGame: () => void;
}

export default function TutorialOverlay({ onStartGame }: TutorialOverlayProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleStart = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            onStartGame();
          }, 300);
          return 0;
        }
        return prev - 1;
      });
    }, 600);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(8, 11, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 35,
      padding: 20
    }}>
      {countdown !== null ? (
        // Animated Countdown (3... 2... 1... RUN!)
        <div style={{
          textAlign: 'center',
          animation: 'pulseGlow 0.6s infinite'
        }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '6rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #FFE57F 0%, #FFB800 50%, #FF671F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(255, 184, 0, 0.6)'
          }}>
            {countdown === 0 ? 'RUN!' : countdown}
          </div>
          <div style={{
            fontSize: '1.2rem',
            color: 'var(--gold-light)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginTop: 8
          }}>
            Remove the 108 Vighnas
          </div>
        </div>
      ) : (
        // Ready Screen & Tutorial Cards
        <div className="glass-card-gold" style={{
          maxWidth: 560,
          width: '100%',
          padding: '36px 28px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20
        }}>
          <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 15px #FFB800)' }}>
            🐘
          </div>

          <div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              fontWeight: 900,
              letterSpacing: '1px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE57F 50%, #FFB800 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              READY, VIGHNAHARTA?
            </h2>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              marginTop: 4
            }}>
              Most runners avoid obstacles. <strong style={{ color: 'var(--gold-primary)' }}>Lord Ganesha removes them.</strong>
            </p>
          </div>

          {/* Tutorial steps grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            width: '100%'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 6px'
            }}>
              <ArrowLeftRight size={20} color="var(--gold-primary)" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#FFFFFF' }}>LANE SHIFT</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: 2 }}>A / D / Swipe</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 6px'
            }}>
              <ArrowUp size={20} color="var(--gold-light)" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#FFFFFF' }}>JUMP / DIVE</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: 2 }}>W / S / Up / Down</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 6px'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 2 }}>🛹</div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--sky-monsoon)' }}>HOVERBOARD</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: 2 }}>Double Tap / Space</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 184, 0, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 6px'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 2 }}>🚀</div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--gold-light)' }}>JETPACK & RAMPS</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: 2 }}>Run on roofs!</div>
            </div>
          </div>

          {/* Pro-tip banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.12) 0%, rgba(255, 103, 31, 0.15) 100%)',
            border: '1px dashed var(--border-gold)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 16px',
            fontSize: '0.8rem',
            color: 'var(--text-cream)',
            width: '100%'
          }}>
            🛹 <strong>Subway Surfers Tip:</strong> Double-tap screen or press <strong>Shift / Space</strong> to ride the Hoverboard with crash protection! Run up <strong>Ramps</strong> to sprint across train wagon roofs!
          </div>

          <button
            onClick={handleStart}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '16px 24px',
              fontSize: '1.1rem',
              letterSpacing: '1px'
            }}
          >
            <Play size={20} fill="#080B14" />
            <span>START RUN</span>
          </button>
        </div>
      )}
    </div>
  );
}
