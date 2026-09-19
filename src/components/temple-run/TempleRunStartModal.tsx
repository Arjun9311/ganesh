'use client';

import React from 'react';
import Link from 'next/link';
import { Play, BookOpen, Trophy, Volume2, VolumeX, ArrowLeft, Sparkles, Compass } from 'lucide-react';
import GaneshaAvatar from '@/components/idol-shop/GaneshaAvatar';
import { getActiveGaneshaAvatar } from '@/lib/storage';

interface TempleRunStartModalProps {
  onStart: () => void;
  onTutorial: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function TempleRunStartModal({
  onStart,
  onTutorial,
  isMuted,
  onToggleMute
}: TempleRunStartModalProps) {
  const activeAvatar = getActiveGaneshaAvatar();

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse at 50% 30%, rgba(26, 24, 56, 0.92) 0%, rgba(8, 11, 20, 0.97) 100%)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 50,
      userSelect: 'none'
    }}>
      <div style={{
        maxWidth: 520,
        width: '100%',
        background: 'linear-gradient(180deg, rgba(30, 26, 62, 0.95) 0%, rgba(16, 18, 40, 0.98) 100%)',
        border: '2px solid #FFD700',
        borderRadius: 28,
        padding: 'clamp(24px, 5vw, 40px)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(255, 184, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Top Back & Mute Bar */}
        <div style={{
          position: 'absolute',
          top: 18,
          left: 18,
          right: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link
            href="/arcade"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#94A3B8',
              fontSize: 12,
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.06)'
            }}
          >
            <ArrowLeft size={14} />
            <span>ARCADE</span>
          </Link>

          <button
            onClick={onToggleMute}
            style={{
              padding: 8,
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.06)',
              color: isMuted ? '#E11D48' : '#FFD700',
              cursor: 'pointer'
            }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* Hero Ganesha Avatar & Sparkles */}
        <div style={{ marginTop: 24, marginBottom: 16, position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: -14,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
            animation: 'pulseSlow 3s infinite'
          }} />
          <GaneshaAvatar size={88} avatarId={activeAvatar?.id} />
        </div>

        {/* Title & Tagline */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 14px',
          borderRadius: 999,
          background: 'rgba(255, 184, 0, 0.15)',
          border: '1px solid rgba(255, 215, 0, 0.4)',
          color: '#FFD700',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 1.2,
          marginBottom: 10
        }}>
          <Sparkles size={13} />
          <span>ORIGINAL 3D SACRED RUNNER</span>
        </div>

        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(24px, 5.5vw, 36px)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FF671F 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.15,
          marginBottom: 10
        }}>
          VIGHNAHARTA TEMPLE RUN
        </h1>

        <p style={{
          fontSize: 'clamp(13px, 2.5vw, 15px)',
          color: '#FFE57F',
          fontWeight: 600,
          marginBottom: 20,
          letterSpacing: 0.5
        }}>
          &ldquo;RUN THROUGH THE SACRED PATH. REMOVE EVERY VIGHNA.&rdquo;
        </p>

        {/* Key Features Pill Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 28
        }}>
          <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}>
            ⚡ 90° Turning Corners
          </span>
          <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}>
            🕉️ 108 Vighnas
          </span>
          <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}>
            🏛️ 6 Sacred Worlds
          </span>
          <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#94A3B8' }}>
            🐀 Mushika Companion
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={onStart}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
              color: '#080B14',
              fontFamily: "'Cinzel', serif",
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              boxShadow: '0 0 30px rgba(255, 184, 0, 0.7), 0 10px 25px rgba(0, 0, 0, 0.5)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Play size={22} fill="#080B14" />
            <span>START RUN</span>
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onTutorial}
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
                gap: 6,
                cursor: 'pointer'
              }}
            >
              <BookOpen size={16} />
              <span>HOW TO PLAY</span>
            </button>

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
          </div>
        </div>
      </div>
    </div>
  );
}
