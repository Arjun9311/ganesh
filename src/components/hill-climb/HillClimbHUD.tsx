'use client';

import React from 'react';
import { Pause, Volume2, VolumeX, Sparkles, Fuel, Zap, RotateCcw } from 'lucide-react';
import { HillClimbPhysicsState, StuntNotification } from '@/types/hillClimb';

interface HillClimbHUDProps {
  state: HillClimbPhysicsState;
  coinsRun: number;
  stageName: string;
  bestDistance: number;
  isMuted: boolean;
  activeStunt: StuntNotification | null;
  onPause: () => void;
  onToggleMute: () => void;
  onGasStart: () => void;
  onGasEnd: () => void;
  onBrakeStart: () => void;
  onBrakeEnd: () => void;
  isGasActive: boolean;
  isBrakeActive: boolean;
}

export default function HillClimbHUD({
  state,
  coinsRun,
  stageName,
  bestDistance,
  isMuted,
  activeStunt,
  onPause,
  onToggleMute,
  onGasStart,
  onGasEnd,
  onBrakeStart,
  onBrakeEnd,
  isGasActive,
  isBrakeActive
}: HillClimbHUDProps) {
  const fuelPercent = Math.max(0, Math.min(100, Math.round(state.fuel)));
  const isLowFuel = fuelPercent < 25;
  const isCriticalFuel = fuelPercent < 12;
  const speed = Math.max(0, Math.round(state.speedKmH));
  const rpmRatio = Math.max(0, Math.min(1, state.rpm));
  const distance = Math.max(0, Math.round(state.distance));

  // Tachometer needle angle: -120deg (idle) to +120deg (redline)
  const rpmAngle = -120 + rpmRatio * 240;
  // Speedometer needle angle: -120deg (0) to +120deg (100km/h)
  const speedAngle = -120 + Math.min(1, speed / 90) * 240;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px 24px',
      zIndex: 20,
      userSelect: 'none'
    }}>
      {/* 1. TOP STATUS BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16
      }}>
        {/* Left: Distance & High Score */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          <div style={{
            background: 'rgba(11, 15, 28, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 184, 0, 0.4)',
            borderRadius: 14,
            padding: '8px 16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'baseline',
            gap: 8
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#94A3B8' }}>DISTANCE</span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 26,
              fontWeight: 900,
              color: '#FFD700',
              textShadow: '0 0 12px rgba(255, 215, 0, 0.5)'
            }}>
              {distance} <span style={{ fontSize: 14, color: '#FFE57F' }}>m</span>
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            paddingLeft: 4,
            fontSize: 11,
            fontWeight: 600,
            color: '#CBD5E1'
          }}>
            <span style={{ color: '#FF884D' }}>BEST:</span>
            <span>{Math.max(bestDistance, distance)} m</span>
            {distance > bestDistance && bestDistance > 0 && (
              <span style={{
                background: 'linear-gradient(90deg, #FF671F, #E11D48)',
                color: '#FFF',
                fontSize: 9,
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: 4,
                textTransform: 'uppercase',
                animation: 'pulse 1s infinite'
              }}>
                RECORD!
              </span>
            )}
          </div>
        </div>

        {/* Center: AMRIT FUEL GAUGE */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          minWidth: 220,
          maxWidth: 320,
          flex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0 4px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: isLowFuel ? '#EF4444' : '#FFE57F'
            }}>
              <Fuel size={14} color={isLowFuel ? '#EF4444' : '#FFD700'} />
              AMRIT NECTAR
            </span>
            <span style={{
              color: isLowFuel ? '#EF4444' : '#FFFFFF',
              fontWeight: 800
            }}>
              {fuelPercent}%
            </span>
          </div>

          {/* Bar Container */}
          <div style={{
            width: '100%',
            height: 14,
            background: 'rgba(8, 11, 20, 0.9)',
            borderRadius: 8,
            border: isLowFuel ? '1.5px solid #EF4444' : '1.5px solid rgba(255, 184, 0, 0.4)',
            overflow: 'hidden',
            padding: 2,
            boxShadow: isLowFuel ? '0 0 16px rgba(239, 68, 68, 0.7)' : '0 4px 12px rgba(0,0,0,0.6)',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}>
            <div style={{
              width: `${fuelPercent}%`,
              height: '100%',
              borderRadius: 6,
              background: isCriticalFuel
                ? 'linear-gradient(90deg, #DC2626, #EF4444)'
                : isLowFuel
                ? 'linear-gradient(90deg, #EA580C, #F97316)'
                : 'linear-gradient(90deg, #FF671F, #FFB800, #FFE57F)',
              boxShadow: isLowFuel
                ? '0 0 12px #EF4444'
                : '0 0 10px rgba(255, 184, 0, 0.8)',
              transition: 'width 0.15s ease'
            }} />
          </div>

          {/* Low Amrit Warning Badge */}
          {isLowFuel && (
            <div style={{
              background: isCriticalFuel ? 'rgba(220, 38, 38, 0.9)' : 'rgba(234, 88, 12, 0.9)',
              color: '#FFF',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.2,
              padding: '2px 10px',
              borderRadius: 6,
              marginTop: 2,
              boxShadow: '0 0 14px rgba(239, 68, 68, 0.8)'
            }}>
              ⚠️ LOW AMRIT FUEL!
            </div>
          )}
        </div>

        {/* Right: Coins, Modaks, Pause & Mute */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          {/* Coins Earned */}
          <div style={{
            background: 'rgba(11, 15, 28, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 184, 0, 0.4)',
            borderRadius: 14,
            padding: '8px 16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #FFF7ED 0%, #FFD700 50%, #B45309 100%)',
              border: '1.5px solid #FFD700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 900,
              color: '#78350F',
              boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)'
            }}>
              🪙
            </div>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 22,
              fontWeight: 900,
              color: '#FFD700',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.4)'
            }}>
              +{coinsRun}
            </span>
          </div>

          {/* Controls: Audio & Pause */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            pointerEvents: 'auto'
          }}>
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(18, 24, 43, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: isMuted ? '#94A3B8' : '#FFD700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button
              onClick={onPause}
              title="Pause Game [Esc / P]"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(18, 24, 43, 0.85)',
                border: '1px solid rgba(255, 184, 0, 0.4)',
                color: '#FFD700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
              }}
            >
              <Pause size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CENTER STUNT BANNER */}
      {activeStunt && (
        <div style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 103, 31, 0.95), rgba(225, 29, 72, 0.95))',
            padding: '10px 24px',
            borderRadius: 16,
            border: '2px solid #FFD700',
            boxShadow: '0 0 30px rgba(255, 184, 0, 0.7), 0 8px 24px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <Sparkles size={20} color="#FFD700" />
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 22,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: 1.5,
              textShadow: '0 2px 4px rgba(0,0,0,0.6)'
            }}>
              {activeStunt.text}
            </span>
            <span style={{
              background: '#FFD700',
              color: '#78350F',
              fontSize: 15,
              fontWeight: 900,
              padding: '2px 8px',
              borderRadius: 8
            }}>
              +{activeStunt.bonus}
            </span>
          </div>
        </div>
      )}

      {/* 3. BOTTOM COCKPIT & PEDALS */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: 'clamp(4px, 1.5vh, 12px)',
        position: 'relative',
        touchAction: 'none'
      }}>
        {/* LEFT PEDAL: BRAKE / TILT BACK */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          pointerEvents: 'auto',
          touchAction: 'none'
        }}>
          <button
            onPointerDown={(e) => { e.preventDefault(); onBrakeStart(); }}
            onPointerUp={(e) => { e.preventDefault(); onBrakeEnd(); }}
            onPointerCancel={onBrakeEnd}
            onPointerLeave={onBrakeEnd}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              width: 'clamp(72px, 18vw, 110px)',
              height: 'clamp(72px, 18vw, 110px)',
              borderRadius: 'clamp(18px, 4vw, 26px)',
              background: isBrakeActive
                ? 'radial-gradient(circle at 50% 30%, #EF4444 0%, #991B1B 70%, #450A0A 100%)'
                : 'radial-gradient(circle at 50% 30%, #334155 0%, #1E293B 70%, #0F172A 100%)',
              border: isBrakeActive ? '3px solid #F87171' : '3px solid rgba(239, 68, 68, 0.6)',
              boxShadow: isBrakeActive
                ? '0 0 28px rgba(239, 68, 68, 0.8), inset 0 4px 10px rgba(0,0,0,0.7)'
                : '0 8px 24px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1)',
              transform: isBrakeActive ? 'scale(0.93) translateY(3px)' : 'scale(1)',
              transition: 'all 0.08s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            aria-label="Brake and Tilt Back"
          >
            <RotateCcw size={26} color={isBrakeActive ? '#FFFFFF' : '#EF4444'} />
            <span style={{
              fontSize: 'clamp(12px, 2.5vw, 15px)',
              fontWeight: 900,
              letterSpacing: 1.2,
              marginTop: 2,
              color: isBrakeActive ? '#FFF' : '#FCA5A5'
            }}>
              BRAKE
            </span>
            <span style={{
              fontSize: 8,
              fontWeight: 700,
              color: '#94A3B8',
              letterSpacing: 0.5
            }}>
              [A] / [←]
            </span>
          </button>
          <span style={{ fontSize: 'clamp(8px, 1.8vw, 10px)', fontWeight: 700, color: '#94A3B8' }}>TILT BACK</span>
        </div>

        {/* CENTER DASHBOARD: DIALS (Hidden/Adapted on small mobile screens) */}
        <div className="cockpit-center-dials" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(10px, 2vw, 20px)',
          background: 'rgba(11, 15, 28, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(255, 184, 0, 0.35)',
          borderRadius: 22,
          padding: '8px clamp(12px, 2vw, 22px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)'
        }}>
          {/* SPEED GAUGE */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 'clamp(50px, 10vw, 70px)'
          }}>
            <div style={{
              width: 'clamp(42px, 8vw, 54px)',
              height: 'clamp(42px, 8vw, 54px)',
              borderRadius: '50%',
              background: '#0B0F1C',
              border: '2px solid rgba(255, 184, 0, 0.4)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
            }}>
              {/* Dial Needle */}
              <div style={{
                position: 'absolute',
                width: 2,
                height: 18,
                background: '#FF671F',
                borderRadius: 2,
                top: 6,
                transformOrigin: '50% 18px',
                transform: `rotate(${speedAngle}deg)`,
                transition: 'transform 0.1s ease-out',
                boxShadow: '0 0 6px #FF671F'
              }} />
              <div style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#FFD700',
                zIndex: 2
              }} />
            </div>
            <span style={{
              fontSize: 'clamp(13px, 2.5vw, 16px)',
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 2
            }}>
              {speed}
            </span>
            <span style={{ fontSize: 8, fontWeight: 700, color: '#94A3B8' }}>KM/H</span>
          </div>

          <div style={{ width: 1, height: 38, background: 'rgba(255,255,255,0.1)' }} />

          {/* RPM GAUGE */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 'clamp(50px, 10vw, 70px)'
          }}>
            <div style={{
              width: 'clamp(42px, 8vw, 54px)',
              height: 'clamp(42px, 8vw, 54px)',
              borderRadius: '50%',
              background: '#0B0F1C',
              border: '2px solid rgba(255, 184, 0, 0.4)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
            }}>
              {/* Dial Needle */}
              <div style={{
                position: 'absolute',
                width: 2,
                height: 18,
                background: rpmRatio > 0.85 ? '#EF4444' : '#FFD700',
                borderRadius: 2,
                top: 6,
                transformOrigin: '50% 18px',
                transform: `rotate(${rpmAngle}deg)`,
                transition: 'transform 0.08s ease-out',
                boxShadow: rpmRatio > 0.85 ? '0 0 8px #EF4444' : '0 0 6px #FFD700'
              }} />
              <div style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#FFD700',
                zIndex: 2
              }} />
            </div>
            <span style={{
              fontSize: 'clamp(13px, 2.5vw, 16px)',
              fontWeight: 900,
              color: rpmRatio > 0.85 ? '#EF4444' : '#FFD700',
              marginTop: 2
            }}>
              {Math.round(rpmRatio * 9)}K
            </span>
            <span style={{ fontSize: 8, fontWeight: 700, color: '#94A3B8' }}>RPM</span>
          </div>
        </div>

        {/* RIGHT PEDAL: GAS / ACCEL / TILT FWD */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          pointerEvents: 'auto',
          touchAction: 'none'
        }}>
          <button
            onPointerDown={(e) => { e.preventDefault(); onGasStart(); }}
            onPointerUp={(e) => { e.preventDefault(); onGasEnd(); }}
            onPointerCancel={onGasEnd}
            onPointerLeave={onGasEnd}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              width: 'clamp(72px, 18vw, 110px)',
              height: 'clamp(72px, 18vw, 110px)',
              borderRadius: 'clamp(18px, 4vw, 26px)',
              background: isGasActive
                ? 'radial-gradient(circle at 50% 30%, #22C55E 0%, #15803D 70%, #14532D 100%)'
                : 'radial-gradient(circle at 50% 30%, #334155 0%, #1E293B 70%, #0F172A 100%)',
              border: isGasActive ? '3px solid #4ADE80' : '3px solid rgba(34, 197, 94, 0.6)',
              boxShadow: isGasActive
                ? '0 0 28px rgba(34, 197, 94, 0.8), inset 0 4px 10px rgba(0,0,0,0.7)'
                : '0 8px 24px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1)',
              transform: isGasActive ? 'scale(0.93) translateY(3px)' : 'scale(1)',
              transition: 'all 0.08s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            aria-label="Gas and Tilt Forward"
          >
            <Zap size={26} color={isGasActive ? '#FFFFFF' : '#22C55E'} />
            <span style={{
              fontSize: 'clamp(12px, 2.5vw, 15px)',
              fontWeight: 900,
              letterSpacing: 1.2,
              marginTop: 2,
              color: isGasActive ? '#FFF' : '#86EFAC'
            }}>
              GAS
            </span>
            <span style={{
              fontSize: 8,
              fontWeight: 700,
              color: '#94A3B8',
              letterSpacing: 0.5
            }}>
              [D] / [→]
            </span>
          </button>
          <span style={{ fontSize: 'clamp(8px, 1.8vw, 10px)', fontWeight: 700, color: '#94A3B8' }}>TILT FWD</span>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 580px) {
          .cockpit-center-dials {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
