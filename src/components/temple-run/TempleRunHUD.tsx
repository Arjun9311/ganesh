'use client';

import React from 'react';
import {
  Heart,
  Pause,
  Sparkles,
  Zap,
  Shield,
  Magnet,
  Flame,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  TempleGameStats,
  TemplePowerUpState,
  TurnPrompt
} from '@/types/templeRun';
import { TEMPLE_WORLDS } from '@/lib/temple-run/templeRunConfig';

interface TempleRunHUDProps {
  stats: TempleGameStats;
  powerups: TemplePowerUpState;
  turnPrompt: TurnPrompt;
  onPause: () => void;
  onLeft: () => void;
  onRight: () => void;
  onJump: () => void;
  onSlide: () => void;
  onPowerUp: () => void;
}

export default function TempleRunHUD({
  stats,
  powerups,
  turnPrompt,
  onPause,
  onLeft,
  onRight,
  onJump,
  onSlide,
  onPowerUp
}: TempleRunHUDProps) {
  const currentWorldInfo = TEMPLE_WORLDS[stats.currentWorld];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'clamp(12px, 2.5vw, 24px)',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    }}>
      {/* -------------------------------------------------------------
          TOP BAR: Score, Vighna 108 Progress, Health & Pause (Glacial Frost Glass)
          ------------------------------------------------------------- */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12
      }}>
        {/* Left: Score & Distance */}
        <div style={{
          background: 'rgba(7, 17, 38, 0.86)',
          backdropFilter: 'blur(14px)',
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: 16,
          padding: '8px 16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(56, 189, 248, 0.15)'
        }}>
          <div style={{ fontSize: 11, color: '#7DD3FC', fontWeight: 800, letterSpacing: 1.2 }}>
            SCORE
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: 900,
            color: '#F0F9FF',
            textShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
            lineHeight: 1.1
          }}>
            {stats.score.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 11, color: '#38BDF8', fontWeight: 700 }}>
              {(stats.distance / 1000).toFixed(2)} KM
            </span>
            {stats.currentCombo > 1 && (
              <span style={{
                fontSize: 10,
                color: '#BAE6FD',
                fontWeight: 900,
                background: 'rgba(14, 165, 233, 0.3)',
                border: '1px solid rgba(56, 189, 248, 0.6)',
                padding: '1px 6px',
                borderRadius: 6
              }}>
                x{stats.currentCombo}
              </span>
            )}
          </div>
        </div>

        {/* Center: 108 Vighnas Progress Tracker */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(7, 17, 38, 0.88)',
          backdropFilter: 'blur(14px)',
          border: '1.5px solid rgba(56, 189, 248, 0.55)',
          borderRadius: 18,
          padding: '8px 18px',
          maxWidth: 320,
          width: '100%',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 4
          }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#7DD3FC', letterSpacing: 1.2 }}>
              ❄️ 108 VIGHNAS
            </span>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#F0F9FF' }}>
              {stats.vighnasDestroyed} / 108
            </span>
          </div>

          {/* Progress Bar (Glacial Ice Gradient) */}
          <div style={{
            width: '100%',
            height: 7,
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (stats.vighnasDestroyed / 108) * 100)}%`,
              background: 'linear-gradient(90deg, #0284C7, #38BDF8, #7DD3FC)',
              borderRadius: 999,
              transition: 'width 0.3s ease-out',
              boxShadow: '0 0 8px rgba(56, 189, 248, 0.8)'
            }} />
          </div>

          <div style={{
            fontSize: 10,
            fontWeight: 800,
            color: currentWorldInfo.accentColor,
            marginTop: 4,
            letterSpacing: 0.8,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span>{currentWorldInfo.name.toUpperCase()} • {currentWorldInfo.hindiName}</span>
            {powerups.isDivineMode && (
              <span style={{ color: '#FDE047', fontWeight: 900 }}>
                • ✨ DIVINE ({Math.ceil(powerups.divineModeTimer)}s)
              </span>
            )}
          </div>
        </div>

        {/* Right: Health Hearts & Pause Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(7, 17, 38, 0.86)',
            backdropFilter: 'blur(14px)',
            border: '1.5px solid rgba(225, 29, 72, 0.45)',
            borderRadius: 16,
            padding: '10px 14px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
          }}>
            {[1, 2, 3].map(heartIdx => (
              <Heart
                key={heartIdx}
                size={18}
                fill={heartIdx <= stats.lives ? '#E11D48' : 'none'}
                color={heartIdx <= stats.lives ? '#E11D48' : 'rgba(255, 255, 255, 0.3)'}
                style={{
                  filter: heartIdx <= stats.lives ? 'drop-shadow(0 0 6px rgba(225, 29, 72, 0.8))' : 'none'
                }}
              />
            ))}
          </div>

          <button
            onClick={onPause}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(7, 17, 38, 0.88)',
              backdropFilter: 'blur(14px)',
              border: '1.5px solid rgba(56, 189, 248, 0.45)',
              color: '#7DD3FC',
              width: 44,
              height: 44,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)'
            }}
            title="Pause (Esc)"
            aria-label="Pause Game"
          >
            <Pause size={20} />
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          BOTTOM CONTROLS (Glacial Frost tactile touch buttons)
          ------------------------------------------------------------- */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        width: '100%'
      }}>
        {/* Horizontal Movement Buttons (Left / Right) - Left Corner */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onPointerDown={e => { e.stopPropagation(); e.preventDefault(); onLeft(); }}
            onTouchStart={e => { e.stopPropagation(); }}
            style={{
              pointerEvents: 'auto',
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'rgba(7, 17, 38, 0.8)',
              border: '1.5px solid rgba(56, 189, 248, 0.65)',
              color: '#7DD3FC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.6), 0 0 12px rgba(56, 189, 248, 0.2)',
              transition: 'transform 0.1s ease, background 0.1s ease',
              backdropFilter: 'blur(8px)'
            }}
            aria-label="Move / Turn Left"
          >
            <ArrowLeft size={24} />
          </button>

          <button
            onPointerDown={e => { e.stopPropagation(); e.preventDefault(); onRight(); }}
            onTouchStart={e => { e.stopPropagation(); }}
            style={{
              pointerEvents: 'auto',
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'rgba(7, 17, 38, 0.8)',
              border: '1.5px solid rgba(56, 189, 248, 0.65)',
              color: '#7DD3FC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.6), 0 0 12px rgba(56, 189, 248, 0.2)',
              transition: 'transform 0.1s ease, background 0.1s ease',
              backdropFilter: 'blur(8px)'
            }}
            aria-label="Move / Turn Right"
          >
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Action Controls - Right Corner (Divine Power + Slide + Jump) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8
        }}>
          {/* Quick Divine Power Button */}
          <button
            onPointerDown={e => { e.stopPropagation(); e.preventDefault(); onPowerUp(); }}
            onTouchStart={e => { e.stopPropagation(); }}
            style={{
              pointerEvents: 'auto',
              padding: '6px 12px',
              borderRadius: 12,
              background: stats.modaksCollected >= 10
                ? 'linear-gradient(135deg, #0284C7, #38BDF8)'
                : 'rgba(7, 17, 38, 0.72)',
              border: stats.modaksCollected >= 10
                ? '1.5px solid #7DD3FC'
                : '1px solid rgba(56, 189, 248, 0.25)',
              color: stats.modaksCollected >= 10 ? '#FFFFFF' : '#94A3B8',
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: 0.8,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              touchAction: 'none',
              cursor: 'pointer',
              boxShadow: stats.modaksCollected >= 10 ? '0 0 16px rgba(56, 189, 248, 0.6)' : 'none',
              transition: 'transform 0.1s ease',
              backdropFilter: 'blur(8px)'
            }}
            aria-label="Divine Mode"
          >
            <Sparkles size={13} />
            <span>DIVINE {stats.modaksCollected}/10</span>
          </button>

          {/* Jump & Slide Controls */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onPointerDown={e => { e.stopPropagation(); e.preventDefault(); onSlide(); }}
              onTouchStart={e => { e.stopPropagation(); }}
              style={{
                pointerEvents: 'auto',
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1.5px solid rgba(56, 189, 248, 0.65)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.6), 0 0 12px rgba(56, 189, 248, 0.2)',
                transition: 'transform 0.1s ease, background 0.1s ease',
                backdropFilter: 'blur(8px)'
              }}
              aria-label="Slide Down"
            >
              <ArrowDown size={24} />
            </button>

            <button
              onPointerDown={e => { e.stopPropagation(); e.preventDefault(); onJump(); }}
              onTouchStart={e => { e.stopPropagation(); }}
              style={{
                pointerEvents: 'auto',
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284C7, #38BDF8)',
                border: '1.5px solid #BAE6FD',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(56, 189, 248, 0.5)',
                transition: 'transform 0.1s ease',
                backdropFilter: 'blur(8px)'
              }}
              aria-label="Jump Up"
            >
              <ArrowUp size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
