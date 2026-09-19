'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  VehicleId,
  StageId,
  HillClimbSaveData,
  HillClimbPhysicsState,
  StuntNotification
} from '@/types/hillClimb';
import { HillClimbEngine, VEHICLE_CONFIGS, STAGE_CONFIGS } from '@/lib/hill-climb/hillClimbEngine';
import { hillClimbAudio } from '@/lib/hill-climb/hillClimbAudio';
import { getStoredHillClimbData, saveStoredHillClimbData, recordGameSession, getStoredProfile } from '@/lib/storage';
import HillClimbHUD from './HillClimbHUD';
import HillClimbGarage from './HillClimbGarage';
import HillClimbGameOver from './HillClimbGameOver';
import HillClimbPause from './HillClimbPause';

type GameView = 'garage' | 'playing' | 'paused' | 'gameover';

export default function HillClimbCanvas() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<HillClimbEngine | null>(null);

  const [view, setView] = useState<GameView>('garage');
  const [saveData, setSaveData] = useState<HillClimbSaveData>(getStoredHillClimbData());
  const [coinsRun, setCoinsRun] = useState<number>(0);
  const [activeStunt, setActiveStunt] = useState<StuntNotification | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isGasActive, setIsGasActive] = useState<boolean>(false);
  const [isBrakeActive, setIsBrakeActive] = useState<boolean>(false);

  // Default initial physics state for HUD before engine starts
  const [physicsState, setPhysicsState] = useState<HillClimbPhysicsState>({
    x: 60,
    y: 300,
    vx: 0,
    vy: 0,
    angle: 0,
    angularVelocity: 0,
    rearWheelY: 300,
    frontWheelY: 300,
    rearSuspensionDist: 15,
    frontSuspensionDist: 15,
    rearWheelAngle: 0,
    frontWheelAngle: 0,
    rearWheelSpeed: 0,
    frontWheelSpeed: 0,
    rearGrounded: true,
    frontGrounded: true,
    isAirborne: false,
    airTime: 0,
    totalRotation: 0,
    currentFlips: 0,
    fuel: 100,
    distance: 0,
    speedKmH: 0,
    rpm: 0.15,
    isCrashed: false,
    isOutOfFuel: false,
    deathReason: null
  });

  const [gameOverData, setGameOverData] = useState<{
    distance: number;
    coinsEarned: number;
    score: number;
    deathReason: string;
    isNewRecord: boolean;
  } | null>(null);

  // Refresh and guarantee all vehicles and stages unlocked on mount
  useEffect(() => {
    setSaveData(getStoredHillClimbData());
  }, []);

  // Sync state changes to storage
  const handleUpdateSave = useCallback((updater: (prev: HillClimbSaveData) => HillClimbSaveData) => {
    setSaveData(prev => {
      const next = updater(prev);
      saveStoredHillClimbData(next);
      return next;
    });
  }, []);

  // Audio mute toggle
  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    hillClimbAudio.setMuted(nextMuted);
  }, [isMuted]);

  // Start or restart a race run
  const startRace = useCallback((vehicleId: VehicleId, stageId: StageId) => {
    if (!canvasRef.current) return;

    // Destroy existing engine if any
    if (engineRef.current) {
      engineRef.current.stop();
      engineRef.current = null;
    }

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    setCoinsRun(0);
    setActiveStunt(null);
    setIsGasActive(false);
    setIsBrakeActive(false);
    setGameOverData(null);
    setView('playing');

    const vehicleSave = saveData.vehicles[vehicleId] || {
      unlocked: true,
      upgrades: { engine: 1, suspension: 1, tires: 1, fuelTank: 1 }
    };

    const currentStageSave = saveData.stages[stageId] || {
      unlocked: true,
      bestDistance: 0,
      highScore: 0
    };

    const engine = new HillClimbEngine(
      canvas,
      vehicleId,
      vehicleSave.upgrades,
      stageId,
      {
        onStatsUpdate: (state) => {
          setPhysicsState({ ...state });
        },
        onCoinCollected: (coins) => {
          setCoinsRun(coins);
        },
        onStunt: (stunt) => {
          setActiveStunt(stunt);
          setTimeout(() => {
            setActiveStunt(prev => (prev?.id === stunt.id ? null : prev));
          }, 2200);
        },
        onGameOver: (finalScore, distance, coins, deathReason) => {
          const isNewRecord = distance > currentStageSave.bestDistance;

          // Update save data with coins and high score
          handleUpdateSave(prev => {
            const stg = prev.stages[stageId] || { unlocked: true, bestDistance: 0, highScore: 0 };
            return {
              ...prev,
              coins: prev.coins + coins,
              stages: {
                ...prev.stages,
                [stageId]: {
                  ...stg,
                  bestDistance: Math.max(stg.bestDistance, distance),
                  highScore: Math.max(stg.highScore, finalScore)
                }
              }
            };
          });

          // Record game session for dashboard run history and telemetry
          try {
            const profile = getStoredProfile();
            const stageConf = STAGE_CONFIGS[stageId];
            recordGameSession({
              user_id: profile.id,
              game_mode: 'hillclimb',
              score: finalScore,
              distance,
              duration: Math.max(15, Math.round(distance / 12)),
              vighnas_destroyed: Math.floor(distance / 80),
              modaks_collected: coins,
              powerups_collected: 0,
              max_combo: 1,
              weather: stageConf?.name || 'Kailash Foothills',
              environment: stageConf?.hindiName || 'कैलाश',
              completed: false
            });
          } catch {}

          setGameOverData({
            distance,
            coinsEarned: coins,
            score: finalScore,
            deathReason,
            isNewRecord
          });
          setView('gameover');
        }
      }
    );

    engineRef.current = engine;
    engine.start();
  }, [saveData, handleUpdateSave]);

  // Handle Pause and Resume
  const handlePause = useCallback(() => {
    if (view === 'playing' && engineRef.current) {
      engineRef.current.stop();
      setView('paused');
    }
  }, [view]);

  const handleResume = useCallback(() => {
    if (view === 'paused' && engineRef.current) {
      setView('playing');
      engineRef.current.start();
    }
  }, [view]);

  // Handle Restart
  const handleRestart = useCallback(() => {
    startRace(saveData.selectedVehicle, saveData.selectedStage);
  }, [saveData.selectedVehicle, saveData.selectedStage, startRace]);

  // Handle Controls: Gas and Brake
  const handleGasStart = useCallback(() => {
    setIsGasActive(true);
    if (engineRef.current) engineRef.current.isGasPressed = true;
  }, []);

  const handleGasEnd = useCallback(() => {
    setIsGasActive(false);
    if (engineRef.current) engineRef.current.isGasPressed = false;
  }, []);

  const handleBrakeStart = useCallback(() => {
    setIsBrakeActive(true);
    if (engineRef.current) engineRef.current.isBrakePressed = true;
  }, []);

  const handleBrakeEnd = useCallback(() => {
    setIsBrakeActive(false);
    if (engineRef.current) engineRef.current.isBrakePressed = false;
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        handleGasStart();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        handleBrakeStart();
      } else if (e.code === 'Escape' || e.code === 'KeyP') {
        if (view === 'playing') {
          handlePause();
        } else if (view === 'paused') {
          handleResume();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        handleGasEnd();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        handleBrakeEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [view, handleGasStart, handleGasEnd, handleBrakeStart, handleBrakeEnd, handlePause, handleResume]);

  // Window Resize & Orientation Listener
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, []);

  const activeStageConfig = STAGE_CONFIGS[saveData.selectedStage] || STAGE_CONFIGS.kailash_foothills;
  const stageStats = saveData.stages[saveData.selectedStage] || { unlocked: true, bestDistance: 0, highScore: 0 };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#080B14',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      touchAction: 'none'
    }}>
      {/* 1. Underlying 2D Game Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          touchAction: 'none'
        }}
      />

      {/* 2. HUD Overlay when Playing */}
      {view === 'playing' && (
        <HillClimbHUD
          state={physicsState}
          coinsRun={coinsRun}
          stageName={activeStageConfig.name}
          bestDistance={stageStats.bestDistance}
          isMuted={isMuted}
          activeStunt={activeStunt}
          onPause={handlePause}
          onToggleMute={handleToggleMute}
          onGasStart={handleGasStart}
          onGasEnd={handleGasEnd}
          onBrakeStart={handleBrakeStart}
          onBrakeEnd={handleBrakeEnd}
          isGasActive={isGasActive}
          isBrakeActive={isBrakeActive}
        />
      )}

      {/* 3. Garage & Workshop Modal / View */}
      {view === 'garage' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 40
        }}>
          <HillClimbGarage
            saveData={saveData}
            onUpdateSave={handleUpdateSave}
            onStartRace={(vId, sId) => startRace(vId, sId)}
            onBackToArcade={() => router.push('/arcade')}
          />
        </div>
      )}

      {/* 4. Paused Modal */}
      {view === 'paused' && (
        <HillClimbPause
          onResume={handleResume}
          onRestart={handleRestart}
          onGarage={() => {
            if (engineRef.current) engineRef.current.stop();
            setView('garage');
          }}
          onBackToArcade={() => {
            if (engineRef.current) engineRef.current.stop();
            router.push('/arcade');
          }}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 5. Game Over Modal */}
      {view === 'gameover' && gameOverData && (
        <HillClimbGameOver
          distance={gameOverData.distance}
          coinsEarned={gameOverData.coinsEarned}
          score={gameOverData.score}
          deathReason={gameOverData.deathReason}
          isNewRecord={gameOverData.isNewRecord}
          onRetry={handleRestart}
          onGarage={() => setView('garage')}
          onBackToArcade={() => router.push('/arcade')}
        />
      )}
    </div>
  );
}
