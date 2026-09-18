'use client';

import React, { useEffect } from 'react';
import { RotateCcw, Wrench, ArrowLeft, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hillClimbAudio } from '@/lib/hill-climb/hillClimbAudio';

interface HillClimbGameOverProps {
  distance: number;
  coinsEarned: number;
  score: number;
  deathReason: string;
  isNewRecord: boolean;
  onRetry: () => void;
  onGarage: () => void;
  onBackToArcade: () => void;
}

export default function HillClimbGameOver({
  distance,
  coinsEarned,
  score,
  deathReason,
  isNewRecord,
  onRetry,
  onGarage,
  onBackToArcade
}: HillClimbGameOverProps) {
  useEffect(() => {
    if (isNewRecord) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FF671F', '#FFE57F', '#FFFFFF']
        });
      } catch {}
    }
  }, [isNewRecord]);

  const isOutOfFuel = deathReason === 'out_of_fuel';

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(8, 11, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: 20,
      animation: 'fadeIn 0.25s ease-out',
      userSelect: 'none'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #1A2238 0%, #0E1424 100%)',
        border: '2px solid rgba(255, 184, 0, 0.5)',
        borderRadius: 28,
        padding: '36px 44px',
        maxWidth: 520,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 184, 0, 0.25)',
        textAlign: 'center'
      }}>
        {/* Cause of Death Alert */}
        <div style={{
          background: isOutOfFuel ? 'rgba(234, 88, 12, 0.2)' : 'rgba(220, 38, 38, 0.2)',
          border: isOutOfFuel ? '1.5px solid #EA580C' : '1.5px solid #DC2626',
          borderRadius: 14,
          padding: '8px 20px',
          color: isOutOfFuel ? '#FDBA74' : '#FCA5A5',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 1,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          {isOutOfFuel ? '🪔 OUT OF AMRIT FUEL' : '💥 DRIVER DOWN (CHARIOT ROLLED OVER)'}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 32,
          fontWeight: 900,
          color: '#FFFFFF',
          marginBottom: 6,
          letterSpacing: 1.5
        }}>
          EXPEDITION HALTED
        </h2>
        <span style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24 }}>
          Lord Ganesha blessings remain eternal! Collect modaks & upgrade your chariot.
        </span>

        {/* New Record Banner */}
        {isNewRecord && (
          <div style={{
            background: 'linear-gradient(90deg, #FF671F, #FFB800, #FFE57F)',
            color: '#080B14',
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: 1.5,
            padding: '6px 20px',
            borderRadius: 9999,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 0 20px rgba(255, 184, 0, 0.7)'
          }}>
            <Trophy size={16} fill="#080B14" />
            NEW STAGE DISTANCE RECORD!
          </div>
        )}

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          width: '100%',
          marginBottom: 32
        }}>
          {/* Distance */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1 }}>DISTANCE</span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 26,
              fontWeight: 900,
              color: '#FFD700',
              marginTop: 4
            }}>
              {distance} <span style={{ fontSize: 13, color: '#FFE57F' }}>m</span>
            </span>
          </div>

          {/* Coins Earned */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1 }}>COINS EARNED</span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 26,
              fontWeight: 900,
              color: '#FFD700',
              marginTop: 4
            }}>
              +{coinsEarned}
            </span>
          </div>

          {/* Total Score */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1 }}>TOTAL SCORE</span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 26,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 4
            }}>
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%'
        }}>
          {/* Retry Button */}
          <button
            onClick={() => {
              hillClimbAudio.playClick();
              onRetry();
            }}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #FF671F 0%, #FFB800 100%)',
              color: '#080B14',
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 1.5,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 0 25px rgba(255, 184, 0, 0.6)',
              textTransform: 'uppercase'
            }}
          >
            <RotateCcw size={18} />
            <span>RETRY EXPEDITION</span>
          </button>

          {/* Garage / Upgrades Button */}
          <button
            onClick={() => {
              hillClimbAudio.playClick();
              onGarage();
            }}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(255, 184, 0, 0.4)',
              color: '#FFE57F',
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 1.2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'all 0.2s'
            }}
          >
            <Wrench size={18} />
            <span>GARAGE & UPGRADES</span>
          </button>

          {/* Back to Arcade Button */}
          <button
            onClick={() => {
              hillClimbAudio.playClick();
              onBackToArcade();
            }}
            style={{
              width: '100%',
              padding: '12px 24px',
              borderRadius: 16,
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'color 0.2s'
            }}
          >
            <ArrowLeft size={16} />
            <span>RETURN TO ARCADE HUB</span>
          </button>
        </div>
      </div>
    </div>
  );
}
