'use client';

import React from 'react';
import { Heart, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { GameStats, PowerUpState, FloatingText, WorldTheme } from '@/types/game';

interface GameHUDProps {
  stats: GameStats;
  powerups: PowerUpState;
  floatingTexts?: FloatingText[];
  isMuted: boolean;
  onPause: () => void;
  onToggleMute: () => void;
  onSelectTheme?: (theme: WorldTheme) => void;
  onDeployHoverboard?: () => void;
}

export default function GameHUD({
  stats,
  powerups,
  isMuted,
  onPause,
  onToggleMute,
}: GameHUDProps) {
  const vighnaPercentage = Math.min(Math.round((stats.vighnasDestroyed / 108) * 100), 100);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px 20px',
      zIndex: 20
    }}>
      {/* 1. Ultra-thin 108 Vighnas progress line at the very top edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'rgba(255, 255, 255, 0.08)',
        zIndex: 30
      }}>
        <div style={{
          width: `${vighnaPercentage}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #FF671F, #FFB800, #FFE57F)',
          boxShadow: '0 0 8px rgba(255, 184, 0, 0.7)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Top Header Row: Left (Modaks & Distance) | Right (Score, Multiplier, Lives & Controls) */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        {/* Top-Left: Modaks Collected & Distance in a clean, compact capsule */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(8, 11, 20, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 184, 0, 0.3)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 14px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.35)'
        }}>
          {/* Modak counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: 'var(--font-serif)',
            fontSize: '1rem',
            fontWeight: 800,
            color: 'var(--gold-primary)'
          }}>
            <span style={{ fontSize: '1.1rem' }}>🍬</span>
            <span>{stats.modaksCollected}</span>
          </div>

          <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '0.8rem' }}>|</span>

          {/* Distance */}
          <div style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--text-cream)',
            letterSpacing: '0.5px'
          }}>
            {stats.distance}m
          </div>
        </div>

        {/* Top-Right: Score, Combo, Hearts, Mute, Pause */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            {/* Score & Combo Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(8, 11, 20, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 184, 0, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.35)'
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--gold-light)',
                letterSpacing: '1px'
              }}>
                {stats.score.toLocaleString()}
              </span>

              {/* Combo Multiplier badge if > 1 */}
              {stats.currentCombo > 1 && (
                <span style={{
                  background: 'linear-gradient(135deg, #FF671F, #FFB800)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 0 8px rgba(255, 103, 31, 0.6)'
                }}>
                  x{stats.currentCombo}
                </span>
              )}

              {/* 2X Multiplier powerup badge */}
              {powerups.has2XMultiplier && (
                <span style={{
                  background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  2X
                </span>
              )}
            </div>

            {/* Lives Hearts */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              background: 'rgba(8, 11, 20, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 184, 0, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 10px'
            }}>
              {[1, 2, 3].map(heartIdx => (
                <Heart
                  key={heartIdx}
                  size={16}
                  fill={heartIdx <= stats.lives ? '#E63946' : 'none'}
                  color={heartIdx <= stats.lives ? '#E63946' : '#475569'}
                  style={{
                    filter: heartIdx <= stats.lives ? 'drop-shadow(0 0 4px rgba(230, 57, 70, 0.6))' : 'none'
                  }}
                />
              ))}
            </div>

            {/* Audio toggle button */}
            <button
              onClick={onToggleMute}
              style={{
                pointerEvents: 'auto',
                width: 34,
                height: 34,
                background: 'rgba(8, 11, 20, 0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 184, 0, 0.25)',
                borderRadius: '50%',
                color: isMuted ? 'var(--vermilion)' : 'var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Pause button */}
            <button
              onClick={onPause}
              style={{
                pointerEvents: 'auto',
                width: 34,
                height: 34,
                background: 'rgba(8, 11, 20, 0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 184, 0, 0.25)',
                borderRadius: '50%',
                color: 'var(--gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Pause Game (Esc)"
            >
              <Pause size={15} />
            </button>
          </div>

          {/* Active Power-up Status Indicators - Sleek, compact mini-pills under top-right */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 4
          }}>
            {/* Divine Mode */}
            {powerups.isDivineMode && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(255, 184, 0, 0.25)',
                border: '1px solid var(--gold-divine)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                color: 'var(--gold-divine)',
                fontSize: '0.72rem',
                fontWeight: 800,
                boxShadow: '0 0 10px rgba(255, 184, 0, 0.4)'
              }}>
                <Sparkles size={13} color="var(--gold-divine)" />
                <span>DIVINE {Math.ceil(powerups.divineModeTimer)}s</span>
              </div>
            )}

            {/* Hoverboard */}
            {powerups.hasHoverboard && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(6, 182, 212, 0.25)',
                border: '1px solid #06B6D4',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                color: '#67E8F9',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                <span>🛹</span>
                <span>BOARD {Math.ceil(powerups.hoverboardTimer)}s</span>
              </div>
            )}

            {/* Garuda Jetpack */}
            {powerups.isJetpackFlying && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(245, 158, 11, 0.25)',
                border: '1px solid #F59E0B',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                color: '#FDE68A',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                <span>🚀</span>
                <span>FLIGHT {Math.ceil(powerups.jetpackTimer)}s</span>
              </div>
            )}

            {/* Super Jump */}
            {powerups.hasSuperJump && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(56, 189, 248, 0.25)',
                border: '1px solid var(--sky-monsoon)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                color: 'var(--sky-monsoon)',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                <span>👟</span>
                <span>BOUNCE {Math.ceil(powerups.superJumpTimer)}s</span>
              </div>
            )}

            {/* Modak Magnet */}
            {powerups.hasMagnet && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(255, 184, 0, 0.2)',
                border: '1px solid var(--gold-primary)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                color: 'var(--gold-light)',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                <span>🧲</span>
                <span>MAGNET {Math.ceil(powerups.magnetTimer)}s</span>
              </div>
            )}

            {/* Ganesha Shield */}
            {powerups.hasShield && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(255, 165, 0, 0.2)',
                border: '1px solid var(--marigold)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                color: 'var(--gold-light)',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                <span>🛡️</span>
                <span>SHIELD ACTIVE</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NOTE: Center of the screen is kept 100% EMPTY so the player has crystal-clear line of sight */}
      <div style={{ flex: 1 }} />
    </div>
  );
}
