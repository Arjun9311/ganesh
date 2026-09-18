'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '@/lib/game/gameEngine';
import { GameStats, PowerUpState, FloatingText, WorldTheme } from '@/types/game';
import { audioEngine } from '@/lib/audioEngine';
import { recordGameSession, getStoredProfile } from '@/lib/storage';
import GameHUD from './GameHUD';
import TouchControls from './TouchControls';
import GamePause from './GamePause';
import GameOverModal from './GameOverModal';
import TutorialOverlay from './TutorialOverlay';

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<'READY' | 'RUNNING' | 'PAUSED' | 'GAME_OVER' | 'VICTORY'>('READY');
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    distance: 0,
    vighnasDestroyed: 0,
    modaksCollected: 0,
    currentCombo: 1,
    maxCombo: 1,
    lives: 3,
    currentWorld: 'festival_street',
    gameTime: 0,
    isGameOver: false,
    isVictory: false,
    isPaused: false,
    currentLane: 0,
    highScore: 0,
    hasUsedSaveMe: false,
    hoverboardsCount: 3,
    multiplier: 1,
    isOnRooftop: false
  });

  const [powerups, setPowerups] = useState<PowerUpState>({
    isDivineMode: false,
    divineModeTimer: 0,
    isMushikaBoost: false,
    mushikaTimer: 0,
    hasShield: false,
    hasMagnet: false,
    magnetTimer: 0,
    hasHammer: false,
    hammerTimer: 0,
    hasHoverboard: false,
    hoverboardTimer: 0,
    isJetpackFlying: false,
    jetpackTimer: 0,
    hasSuperJump: false,
    superJumpTimer: 0,
    has2XMultiplier: false,
    multiplierTimer: 0
  });

  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Subway Surfers Save Me state
  const [saveMeState, setSaveMeState] = useState<{
    isOpen: boolean;
    countdown: number;
    resolver: (revive: boolean) => void;
  } | null>(null);

  // Double tap & swipe detection
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const lastSpaceRef = useRef<number>(0);

  useEffect(() => {
    setIsMuted(audioEngine.getMuted());
    if (!containerRef.current) return;

    // Initialize Game Engine
    const engine = new GameEngine(containerRef.current, {
      onStatsUpdate: (newStats, newPowerups) => {
        setStats(newStats);
        setPowerups(newPowerups);
      },
      onFloatingText: () => {
        // Kept clean & silent during gameplay to prevent screen obstruction and re-render overhead
      },
      onSaveMePrompt: (currentStats, continueCallback) => {
        setSaveMeState({
          isOpen: true,
          countdown: 3,
          resolver: continueCallback
        });
      },
      onGameOver: (finalStats) => {
        setGameState('GAME_OVER');
        saveRun(finalStats, false);
      },
      onVictory: (finalStats) => {
        setGameState('VICTORY');
        saveRun(finalStats, true);
      }
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Save Me Countdown timer effect
  useEffect(() => {
    if (!saveMeState?.isOpen) return;

    const timer = setInterval(() => {
      setSaveMeState(prev => {
        if (!prev) return null;
        if (prev.countdown <= 1) {
          clearInterval(timer);
          prev.resolver(false); // decline revive
          return null;
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [saveMeState?.isOpen]);

  const handleSaveMeAccept = () => {
    if (saveMeState) {
      saveMeState.resolver(true);
      setSaveMeState(null);
    }
  };

  const handleSaveMeDecline = () => {
    if (saveMeState) {
      saveMeState.resolver(false);
      setSaveMeState(null);
    }
  };

  const saveRun = async (finalStats: GameStats, completed: boolean) => {
    try {
      const profile = getStoredProfile();
      await recordGameSession({
        user_id: profile.id,
        score: finalStats.score,
        distance: finalStats.distance,
        duration: Math.round(finalStats.gameTime),
        vighnas_destroyed: finalStats.vighnasDestroyed,
        modaks_collected: finalStats.modaksCollected,
        powerups_collected: Math.floor(finalStats.modaksCollected / 10),
        max_combo: finalStats.maxCombo,
        weather: 'Festival Warm',
        environment: finalStats.currentWorld,
        completed
      });
    } catch (err) {
      console.warn('Could not save session:', err);
    }
  };

  // --- Keyboard Control Handler ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      if (e.key === 'Escape') {
        if (gameState === 'RUNNING') {
          engineRef.current.pause();
          setGameState('PAUSED');
        } else if (gameState === 'PAUSED') {
          engineRef.current.resume();
          setGameState('RUNNING');
        }
        return;
      }

      if (gameState !== 'RUNNING') return;

      // Subway Surfers: Double space or Shift or 'b' deploys Hoverboard!
      if (e.key === 'Shift' || e.key === 'b' || e.key === 'B') {
        engineRef.current.deployHoverboard();
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        const now = Date.now();
        if (now - lastSpaceRef.current < 350) {
          // Double tap spacebar: deploy hoverboard!
          engineRef.current.deployHoverboard();
        } else {
          engineRef.current.jump();
        }
        lastSpaceRef.current = now;
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        engineRef.current.moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        engineRef.current.moveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        engineRef.current.jump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        engineRef.current.slide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // --- Mobile Swipe & Double-Tap Handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();

    // Check double tap for Hoverboard
    if (now - lastTapRef.current < 300) {
      engineRef.current?.deployHoverboard();
    }
    lastTapRef.current = now;

    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: now };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !engineRef.current || gameState !== 'RUNNING') return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    const minSwipeDist = 25;
    if (Math.max(absDx, absDy) > minSwipeDist) {
      if (absDx > absDy) {
        // Horizontal Swipe (Lane Change)
        if (dx < 0) engineRef.current.moveLeft();
        else engineRef.current.moveRight();
      } else {
        // Vertical Swipe (Jump or Slide / Dive-down)
        if (dy < 0) engineRef.current.jump();
        else engineRef.current.slide();
      }
    }
    touchStartRef.current = null;
  };

  const handleStartGame = () => {
    setGameState('RUNNING');
    engineRef.current?.start();
  };

  const handlePause = () => {
    engineRef.current?.pause();
    setGameState('PAUSED');
  };

  const handleResume = () => {
    engineRef.current?.resume();
    setGameState('RUNNING');
  };

  const handleRestart = () => {
    setSaveMeState(null);
    setGameState('RUNNING');
    engineRef.current?.start();
  };

  const handleToggleMute = () => {
    const next = audioEngine.toggleMute();
    setIsMuted(next);
  };

  const handleSelectTheme = (theme: WorldTheme) => {
    engineRef.current?.setTheme(theme);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent mobile Safari/Chrome from triggering scroll or swipe navigation
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #60A5FA 0%, #BAE6FD 100%)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => { touchStartRef.current = null; }}
    >
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          touchAction: 'none'
        }}
      />

      {/* In-game HUD */}
      {gameState === 'RUNNING' && (
        <>
          <GameHUD
            stats={stats}
            powerups={powerups}
            floatingTexts={floatingTexts}
            isMuted={isMuted}
            onPause={handlePause}
            onToggleMute={handleToggleMute}
            onSelectTheme={handleSelectTheme}
            onDeployHoverboard={() => engineRef.current?.deployHoverboard()}
          />

          <TouchControls
            onLeft={() => engineRef.current?.moveLeft()}
            onRight={() => engineRef.current?.moveRight()}
            onJump={() => engineRef.current?.jump()}
            onSlide={() => engineRef.current?.slide()}
            onHoverboard={() => engineRef.current?.deployHoverboard()}
          />
        </>
      )}

      {/* SUBWAY SURFERS "SAVE ME" REVIVE MODAL */}
      {saveMeState?.isOpen && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(8, 11, 20, 0.9)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: 24
        }}>
          <div className="glass-card-gold" style={{
            maxWidth: 420,
            width: '100%',
            padding: '32px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            animation: 'pulseGlow 1s infinite'
          }}>
            {/* Animated countdown circle */}
            <div style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              border: '4px solid var(--gold-primary)',
              boxShadow: '0 0 30px rgba(255, 184, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-serif)',
              fontSize: '3rem',
              fontWeight: 900,
              color: 'var(--gold-light)'
            }}>
              {saveMeState.countdown}
            </div>

            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#FFFFFF'
              }}>
                SAVE ME?
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Continue your journey with a 3-second invulnerability shield!
              </p>
            </div>

            {/* Revive buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
              <button
                onClick={handleSaveMeAccept}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  fontSize: '1rem',
                  fontWeight: 800
                }}
              >
                <span>REVIVE (10 🍬 MODAKS)</span>
              </button>

              <button
                onClick={handleSaveMeDecline}
                className="btn-secondary"
                style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
              >
                <span>NO THANKS / END RUN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial / Ready Overlay */}
      {gameState === 'READY' && (
        <TutorialOverlay onStartGame={handleStartGame} />
      )}

      {/* Pause Menu */}
      {gameState === 'PAUSED' && (
        <GamePause
          onResume={handleResume}
          onRestart={handleRestart}
          onExit={() => { window.location.href = '/'; }}
          currentWorld={stats.currentWorld}
          onSelectTheme={handleSelectTheme}
        />
      )}

      {/* Game Over / Victory Modal */}
      {(gameState === 'GAME_OVER' || gameState === 'VICTORY') && (
        <GameOverModal
          stats={stats}
          isVictory={gameState === 'VICTORY'}
          onRunAgain={handleRestart}
        />
      )}
    </div>
  );
}
