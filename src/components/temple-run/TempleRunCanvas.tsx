'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TempleRunEngine } from '@/lib/temple-run/templeRunEngine';
import {
  TempleGameStats,
  TemplePowerUpState,
  TurnPrompt,
  FloatingText
} from '@/types/templeRun';
import { audioEngine } from '@/lib/audioEngine';
import { recordTempleRunSession, getStoredProfile } from '@/lib/storage';
import TempleRunHUD from './TempleRunHUD';
import TempleRunStartModal from './TempleRunStartModal';
import TempleRunPauseModal from './TempleRunPauseModal';
import TempleRunReviveModal from './TempleRunReviveModal';
import TempleRunGameOverModal from './TempleRunGameOverModal';
import TempleRunTutorialModal from './TempleRunTutorialModal';

export default function TempleRunCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<TempleRunEngine | null>(null);

  // Game UI State
  const [gameState, setGameState] = useState<'START' | 'RUNNING' | 'PAUSED' | 'REVIVE' | 'GAME_OVER'>('START');
  const [isMuted, setIsMuted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Revive Callback holder
  const reviveResolverRef = useRef<((revive: boolean) => void) | null>(null);

  // Live Stats & Powerups
  const [stats, setStats] = useState<TempleGameStats>({
    score: 0,
    distance: 0,
    vighnasDestroyed: 0,
    modaksCollected: 0,
    coinsCollected: 0,
    currentCombo: 1,
    maxCombo: 1,
    lives: 3,
    currentWorld: 'temple_street',
    gameTime: 0,
    isGameOver: false,
    isVictory: false,
    isPaused: false,
    currentLane: 0,
    highScore: 0,
    hasUsedRevive: false
  });

  const [powerups, setPowerups] = useState<TemplePowerUpState>({
    isDivineMode: false,
    divineModeTimer: 0,
    isMushikaRush: false,
    mushikaRushTimer: 0,
    hasMagnet: false,
    magnetTimer: 0,
    hasShield: false,
    hasHammer: false,
    hammerTimer: 0,
    hasGarlandBoost: false,
    garlandBoostTimer: 0
  });

  const [turnPrompt, setTurnPrompt] = useState<TurnPrompt>({
    active: false,
    direction: 'left',
    distanceToTurn: 999,
    canTurnNow: false
  });

  // Swipe gesture detection
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setIsMuted(audioEngine.getMuted());
    if (!containerRef.current) return;

    // Initialize Temple Run 3D Engine
    const engine = new TempleRunEngine(containerRef.current, {
      onStatsUpdate: (newStats, newPowerups, newTurnPrompt) => {
        setStats(newStats);
        setPowerups(newPowerups);
        setTurnPrompt(newTurnPrompt);
      },
      onFloatingText: (text) => {
        setFloatingTexts(prev => [...prev.slice(-4), text]);
        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.id !== text.id));
        }, 1500);
      },
      onRevivePrompt: (currentStats, resolve) => {
        reviveResolverRef.current = resolve;
        setGameState('REVIVE');
      },
      onGameOver: (finalStats) => {
        setGameState('GAME_OVER');
        saveRunData(finalStats, false);
      },
      onVictory: (finalStats) => {
        setGameState('GAME_OVER');
        saveRunData(finalStats, true);
      }
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const saveRunData = async (finalStats: TempleGameStats, completed: boolean) => {
    try {
      const profile = getStoredProfile();
      await recordTempleRunSession({
        user_id: profile.id,
        score: finalStats.score,
        distance: finalStats.distance,
        duration: Math.round(finalStats.gameTime),
        vighnas_destroyed: finalStats.vighnasDestroyed,
        modaks_collected: finalStats.modaksCollected,
        powerups_collected: Math.floor(finalStats.modaksCollected / 10),
        max_combo: finalStats.maxCombo,
        weather: 'Frozen Shadows',
        environment: 'Frozen Temple Path',
        completed
      });
    } catch {}
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'RUNNING') {
        if (e.code === 'Escape' && gameState === 'PAUSED') {
          handleResume();
        }
        return;
      }

      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          e.preventDefault();
          engineRef.current?.moveLeft();
          break;
        case 'KeyD':
        case 'ArrowRight':
          e.preventDefault();
          engineRef.current?.moveRight();
          break;
        case 'KeyW':
        case 'ArrowUp':
        case 'Space':
          e.preventDefault();
          engineRef.current?.jump();
          break;
        case 'KeyS':
        case 'ArrowDown':
          e.preventDefault();
          engineRef.current?.slide();
          break;
        case 'KeyE':
          e.preventDefault();
          engineRef.current?.activatePowerUp();
          break;
        case 'Escape':
          e.preventDefault();
          handlePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch Swipe Gesture Listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== 'RUNNING') return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (gameState !== 'RUNNING' || !touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Minimum swipe threshold
    if (Math.max(absDx, absDy) > 25) {
      if (absDx > absDy) {
        // Horizontal swipe (Lane switch or 90° Turn)
        if (dx > 0) {
          engineRef.current?.moveRight();
        } else {
          engineRef.current?.moveLeft();
        }
      } else {
        // Vertical swipe (Jump or Slide)
        if (dy < 0) {
          engineRef.current?.jump();
        } else {
          engineRef.current?.slide();
        }
      }
    }
    touchStartRef.current = null;
  };

  // Actions
  const handleStart = useCallback(() => {
    audioEngine.playClick();
    setGameState('RUNNING');
    engineRef.current?.start();
  }, []);

  const handlePause = useCallback(() => {
    audioEngine.playClick();
    setGameState('PAUSED');
    engineRef.current?.pause();
  }, []);

  const handleResume = useCallback(() => {
    audioEngine.playClick();
    setGameState('RUNNING');
    engineRef.current?.resume();
  }, []);

  const handleRestart = useCallback(() => {
    audioEngine.playClick();
    setGameState('RUNNING');
    engineRef.current?.restart();
  }, []);

  const handleToggleMute = useCallback(() => {
    const next = audioEngine.toggleMute();
    setIsMuted(next);
  }, []);

  const handleReviveConfirm = useCallback(() => {
    if (reviveResolverRef.current) {
      reviveResolverRef.current(true);
      reviveResolverRef.current = null;
    }
    setGameState('RUNNING');
  }, []);

  const handleReviveDecline = useCallback(() => {
    if (reviveResolverRef.current) {
      reviveResolverRef.current(false);
      reviveResolverRef.current = null;
    }
    setGameState('GAME_OVER');
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#080B14',
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0
        }}
      />

      {/* In-Game HUD */}
      {gameState === 'RUNNING' && (
        <TempleRunHUD
          stats={stats}
          powerups={powerups}
          turnPrompt={turnPrompt}
          onPause={handlePause}
          onLeft={() => engineRef.current?.moveLeft()}
          onRight={() => engineRef.current?.moveRight()}
          onJump={() => engineRef.current?.jump()}
          onSlide={() => engineRef.current?.slide()}
          onPowerUp={() => engineRef.current?.activatePowerUp()}
        />
      )}

      {/* Floating Text Notifications */}
      {floatingTexts.map(t => (
        <div
          key={t.id}
          style={{
            position: 'absolute',
            left: t.x,
            top: t.y,
            transform: `translate(-50%, -50%) scale(${t.scale})`,
            color: t.color,
            fontFamily: "'Cinzel', serif",
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: 2,
            textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 4px 10px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
            zIndex: 40,
            animation: 'floatUpFade 1.4s ease-out forwards'
          }}
        >
          {t.text}
        </div>
      ))}

      {/* Start Modal */}
      {gameState === 'START' && (
        <TempleRunStartModal
          onStart={handleStart}
          onTutorial={() => setShowTutorial(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Pause Modal */}
      {gameState === 'PAUSED' && (
        <TempleRunPauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onTutorial={() => setShowTutorial(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Revive Modal */}
      {gameState === 'REVIVE' && (
        <TempleRunReviveModal
          onRevive={handleReviveConfirm}
          onDecline={handleReviveDecline}
        />
      )}

      {/* Game Over / 108 Vighnas Victory Modal */}
      {gameState === 'GAME_OVER' && (
        <TempleRunGameOverModal
          stats={stats}
          onRestart={handleRestart}
        />
      )}

      {/* How to Play Tutorial Overlay */}
      {showTutorial && (
        <TempleRunTutorialModal
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
