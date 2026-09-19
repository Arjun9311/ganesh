'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Trophy, ArrowLeft, Sparkles, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TempleGameStats } from '@/types/templeRun';
import { TEMPLE_WORLDS } from '@/lib/temple-run/templeRunConfig';

interface TempleRunGameOverModalProps {
  stats: TempleGameStats;
  onRestart: () => void;
}

export default function TempleRunGameOverModal({
  stats,
  onRestart
}: TempleRunGameOverModalProps) {
  const isVictory = stats.isVictory || stats.vighnasDestroyed >= 108;
  const worldInfo = TEMPLE_WORLDS[stats.currentWorld];

  useEffect(() => {
    if (isVictory) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF671F', '#FFB800', '#FFFFFF', '#06B6D4']
      });
    }
  }, [isVictory]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse at 50% 30%, rgba(26, 24, 56, 0.94) 0%, rgba(8, 11, 20, 0.98) 100%)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 80,
      userSelect: 'none'
    }}>
      <div style={{
        maxWidth: 500,
        width: '100%',
        background: 'linear-gradient(180deg, rgba(30, 26, 62, 0.98) 0%, rgba(16, 18, 40, 0.98) 100%)',
        border: isVictory ? '2.5px solid #FFD700' : '2px solid rgba(255, 184, 0, 0.5)',
        borderRadius: 28,
        padding: 'clamp(24px, 5vw, 36px)',
        boxShadow: isVictory
          ? '0 0 60px rgba(255, 215, 0, 0.6), 0 25px 70px rgba(0, 0, 0, 0.9)'
          : '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 184, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Top Celebration Icon */}
        <div style={{
          fontSize: 54,
          marginBottom: 10,
          filter: isVictory ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' : 'none'
        }}>
          {isVictory ? '👑🕉️✨' : '🐘🚩'}
        </div>

        {/* Title Header */}
        <h2 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(24px, 5vw, 32px)',
          fontWeight: 900,
          background: isVictory
            ? 'linear-gradient(135deg, #FFF7ED 0%, #FFD700 50%, #FF884D 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #FFE57F 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.15,
          marginBottom: 6
        }}>
          {isVictory ? '108 VIGHNAS CLEARED!' : 'JOURNEY COMPLETE'}
        </h2>

        <p style={{
          fontSize: 13,
          color: isVictory ? '#FFE57F' : '#94A3B8',
          marginBottom: 20
        }}>
          {isVictory
            ? 'Lord Ganesha has conquered every obstacle in the sacred realm!'
            : `Completed sacred pilgrimage up to ${worldInfo.name}.`}
        </p>

        {/* Score & Vighnas Highlight Box */}
        <div style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 184, 0, 0.35)',
          borderRadius: 20,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 800 }}>FINAL SCORE</div>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: 900,
              color: '#FFD700'
            }}>
              {stats.score.toLocaleString()}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 800 }}>VIGHNAS REMOVED</div>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: 900,
              color: '#FF671F'
            }}>
              {stats.vighnasDestroyed} / 108
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 800 }}>DISTANCE</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF' }}>
              {(stats.distance / 1000).toFixed(2)} KM
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 800 }}>BEST COMBO</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#FDA4AF' }}>
              x{stats.maxCombo}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 800 }}>MODAKS COLLECTED</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#FFE57F' }}>
              {stats.modaksCollected}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 800 }}>WORLD REACHED</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: worldInfo.accentColor }}>
              {worldInfo.name}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onRestart}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
              color: '#080B14',
              fontFamily: "'Cinzel', serif",
              fontSize: 17,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(255, 184, 0, 0.7)'
            }}
          >
            <RotateCcw size={18} />
            <span>RUN SACRED PATH AGAIN</span>
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              href="/leaderboard"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 14,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 184, 0, 0.3)',
                color: '#FFE57F',
                fontSize: 13,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Trophy size={16} />
              <span>LEADERBOARD</span>
            </Link>

            <Link
              href="/arcade"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 14,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 184, 0, 0.3)',
                color: '#FFE57F',
                fontSize: 13,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <ArrowLeft size={16} />
              <span>ARCADE HUB</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
