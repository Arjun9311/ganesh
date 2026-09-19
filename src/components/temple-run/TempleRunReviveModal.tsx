'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';

interface TempleRunReviveModalProps {
  onRevive: () => void;
  onDecline: () => void;
}

export default function TempleRunReviveModal({
  onRevive,
  onDecline
}: TempleRunReviveModalProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDecline]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(8, 11, 20, 0.92)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 70,
      userSelect: 'none'
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: 'linear-gradient(180deg, rgba(30, 26, 62, 0.98) 0%, rgba(16, 18, 40, 0.98) 100%)',
        border: '2px solid #FFD700',
        borderRadius: 24,
        padding: '32px 24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 45px rgba(255, 184, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 52, animation: 'floatSlow 2s ease-in-out infinite' }}>
          🐀✨
        </div>

        <h2 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 24,
          fontWeight: 900,
          color: '#FFFFFF',
          marginTop: 10,
          marginBottom: 6
        }}>
          ONE MORE RUN?
        </h2>

        <p style={{ fontSize: 13, color: '#FFE57F', lineHeight: 1.5, marginBottom: 20 }}>
          Loyal Mushika is offering to restore 2 hearts so Ganesha can continue the 108 Vighnas journey!
        </p>

        {/* Countdown Circular Badge */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '3px solid #FFD700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 900,
          color: '#FFD700',
          marginBottom: 20,
          boxShadow: '0 0 20px rgba(255, 184, 0, 0.6)'
        }}>
          {countdown}
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onRevive}
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
              boxShadow: '0 0 25px rgba(255, 184, 0, 0.7)'
            }}
          >
            <Sparkles size={18} />
            <span>CONTINUE RUN (+2 ❤️)</span>
          </button>

          <button
            onClick={onDecline}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            END RUN & VIEW SCORE
          </button>
        </div>
      </div>
    </div>
  );
}
