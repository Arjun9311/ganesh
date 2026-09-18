'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, RotateCcw, Volume2, VolumeX, Home, Palette } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';
import { WorldTheme } from '@/types/game';
import { WORLD_THEMES, THEME_ORDER } from '@/lib/game/themeConfig';

interface GamePauseProps {
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
  currentWorld?: WorldTheme;
  onSelectTheme?: (theme: WorldTheme) => void;
}

export default function GamePause({
  onResume,
  onRestart,
  onExit,
  currentWorld = 'festival_street',
  onSelectTheme
}: GamePauseProps) {
  const [isMuted, setIsMuted] = useState(audioEngine.getMuted());
  const [graphics, setGraphics] = useState<'LOW' | 'MED' | 'HIGH'>('HIGH');

  const handleToggleMute = () => {
    const next = audioEngine.toggleMute();
    setIsMuted(next);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(8, 11, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 40
    }}>
      <div className="glass-card-gold" style={{
        maxWidth: 440,
        width: '92%',
        padding: '30px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        <div style={{ fontSize: '2.2rem' }}>🐘</div>

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'var(--gold-light)',
          letterSpacing: '2px',
          marginTop: -6
        }}>
          PAUSED
        </h2>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: '100%'
        }}>
          <button
            onClick={onResume}
            className="btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            <Play size={18} />
            <span>RESUME RUN</span>
          </button>

          <button
            onClick={onRestart}
            className="btn-secondary"
            style={{ width: '100%', padding: '10px' }}
          >
            <RotateCcw size={18} />
            <span>RESTART</span>
          </button>

          {/* Sound & Graphics Setting Toggles */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            width: '100%'
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-cream)' }}>Sound</span>
            <button
              onClick={handleToggleMute}
              style={{
                color: isMuted ? 'var(--vermilion)' : 'var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{isMuted ? 'MUTED' : 'ACTIVE'}</span>
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            width: '100%'
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-cream)' }}>Graphics</span>
            <div style={{ display: 'flex', gap: 5 }}>
              {(['LOW', 'MED', 'HIGH'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setGraphics(mode)}
                  style={{
                    padding: '3px 7px',
                    borderRadius: 4,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: graphics === mode ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.1)',
                    color: graphics === mode ? '#080B14' : 'var(--text-muted)'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* World Theme Picker in Pause Menu */}
          {onSelectTheme && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 184, 0, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              textAlign: 'left'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--gold-primary)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: 8
              }}>
                <Palette size={14} />
                <span>Select Sacred World</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 6,
                maxHeight: 140,
                overflowY: 'auto'
              }}>
                {THEME_ORDER.map(themeKey => {
                  const cfg = WORLD_THEMES[themeKey];
                  const isCurrent = currentWorld === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => onSelectTheme(themeKey)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 8px',
                        borderRadius: 6,
                        background: isCurrent ? 'rgba(255, 184, 0, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: isCurrent ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.06)',
                        color: isCurrent ? 'var(--gold-light)' : 'var(--text-muted)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{cfg.icon}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cfg.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={onExit}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: 'var(--text-dim)',
              fontSize: '0.82rem',
              marginTop: 4,
              cursor: 'pointer'
            }}
          >
            <Home size={15} />
            <span>Exit to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
