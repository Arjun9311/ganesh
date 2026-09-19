'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Disc,
  Fuel,
  Lock,
  Play,
  ArrowLeft,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import {
  VehicleId,
  StageId,
  HillClimbSaveData,
  VehicleUpgrades
} from '@/types/hillClimb';
import { VEHICLE_CONFIGS, STAGE_CONFIGS } from '@/lib/hill-climb/hillClimbEngine';
import { hillClimbAudio } from '@/lib/hill-climb/hillClimbAudio';

interface HillClimbGarageProps {
  saveData: HillClimbSaveData;
  onUpdateSave: (updater: (prev: HillClimbSaveData) => HillClimbSaveData) => void;
  onStartRace: (vehicleId: VehicleId, stageId: StageId) => void;
  onBackToArcade: () => void;
}

const VEHICLE_KEYS: VehicleId[] = ['mushika_rath', 'airavata_rover', 'kailash_quad', 'garuda_turbo'];
const STAGE_KEYS: StageId[] = ['kailash_foothills', 'western_ghats', 'varanasi_dunes', 'svarga_heights'];
interface VehicleSpecProfile {
  speed: number;
  climb: number;
  stability: number;
  stunts: number;
  tagline: string;
}

const VEHICLE_SPECS: Record<VehicleId, VehicleSpecProfile> = {
  mushika_rath: {
    speed: 70,
    climb: 75,
    stability: 80,
    stunts: 78,
    tagline: 'Agile & Balanced Divine Classic'
  },
  airavata_rover: {
    speed: 78,
    climb: 98,
    stability: 96,
    stunts: 60,
    tagline: 'Heavy 4x4 Boulder Crusher & High Torque'
  },
  kailash_quad: {
    speed: 86,
    climb: 82,
    stability: 72,
    stunts: 99,
    tagline: 'Ultra-Light Stunt Acrobat & Snow Flips'
  },
  garuda_turbo: {
    speed: 99,
    climb: 90,
    stability: 84,
    stunts: 92,
    tagline: 'Sacred Amrit Rocket Thrusters & Air Glide'
  }
};

export default function HillClimbGarage({
  saveData,
  onUpdateSave,
  onStartRace,
  onBackToArcade
}: HillClimbGarageProps) {
  const [activeTab, setActiveTab] = useState<'vehicle' | 'stage'>('vehicle');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleId>(saveData.selectedVehicle || 'mushika_rath');
  const [selectedStage, setSelectedStage] = useState<StageId>(saveData.selectedStage || 'kailash_foothills');

  const currentVehicleConfig = VEHICLE_CONFIGS[selectedVehicle];
  const vehicleData = saveData.vehicles[selectedVehicle] || {
    unlocked: true,
    upgrades: { engine: 1, suspension: 1, tires: 1, fuelTank: 1 }
  };

  const currentStageConfig = STAGE_CONFIGS[selectedStage];
  const stageData = saveData.stages[selectedStage] || {
    unlocked: true,
    bestDistance: 0,
    highScore: 0
  };

  // Upgrade cost calculation formula
  const getUpgradeCost = (currentLevel: number): number => {
    if (currentLevel >= 10) return 0;
    return Math.floor(180 * Math.pow(1.42, currentLevel - 1));
  };

  const handleUpgrade = (part: keyof VehicleUpgrades) => {
    const currentLevel = vehicleData.upgrades?.[part] || 1;
    if (currentLevel >= 10) return;
    const cost = getUpgradeCost(currentLevel);

    if (saveData.coins < cost) {
      hillClimbAudio.playCrash(); // low reject buzz
      return;
    }

    hillClimbAudio.playStunt(); // reward chime
    onUpdateSave(prev => {
      const currentVeh = prev.vehicles?.[selectedVehicle] || {
        unlocked: true,
        upgrades: { engine: 1, suspension: 1, tires: 1, fuelTank: 1 }
      };
      const currentUpgrades = currentVeh.upgrades || { engine: 1, suspension: 1, tires: 1, fuelTank: 1 };
      return {
        ...prev,
        coins: Math.max(0, prev.coins - cost),
        vehicles: {
          ...prev.vehicles,
          [selectedVehicle]: {
            ...currentVeh,
            upgrades: {
              ...currentUpgrades,
              [part]: (currentUpgrades[part] || 1) + 1
            }
          }
        }
      };
    });
  };

  const handleUnlockVehicle = (vehId: VehicleId) => {
    const veh = VEHICLE_CONFIGS[vehId];
    if (saveData.coins < veh.basePrice) {
      hillClimbAudio.playCrash();
      return;
    }

    hillClimbAudio.playStunt();
    onUpdateSave(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins - veh.basePrice),
      selectedVehicle: vehId,
      vehicles: {
        ...prev.vehicles,
        [vehId]: {
          ...(prev.vehicles?.[vehId] || { upgrades: { engine: 1, suspension: 1, tires: 1, fuelTank: 1 } }),
          unlocked: true
        }
      }
    }));
  };

  const handleUnlockStage = (stgId: StageId) => {
    const stg = STAGE_CONFIGS[stgId];
    if (saveData.coins < stg.unlockPrice) {
      hillClimbAudio.playCrash();
      return;
    }

    hillClimbAudio.playStunt();
    onUpdateSave(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins - stg.unlockPrice),
      selectedStage: stgId,
      stages: {
        ...prev.stages,
        [stgId]: {
          ...(prev.stages?.[stgId] || { bestDistance: 0, highScore: 0 }),
          unlocked: true
        }
      }
    }));
  };

  const handleStartGame = () => {
    // Save active selections
    onUpdateSave(prev => ({
      ...prev,
      selectedVehicle,
      selectedStage
    }));

    hillClimbAudio.playClick();
    onStartRace(selectedVehicle, selectedStage);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '100dvh',
      background: 'radial-gradient(ellipse at 50% 15%, #1E1B4B 0%, #0B0F1C 60%, #05070D 100%)',
      color: '#FFF7ED',
      display: 'flex',
      flexDirection: 'column',
      padding: 'clamp(14px, 3vw, 28px)',
      overflowY: 'auto',
      boxSizing: 'border-box',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    }}>
      {/* 1. TOP HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Back to Arcade Button */}
        <button
          onClick={() => {
            hillClimbAudio.playClick();
            onBackToArcade();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 14,
            background: 'rgba(18, 24, 43, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#FFE57F',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <ArrowLeft size={18} />
          <span>ARCADE HUB</span>
        </button>

        {/* Title Center */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 26,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFD700 50%, #FF884D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 2
          }}>
            GANESHA HILL CLIMB RACING
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#FF884D', letterSpacing: 2, textTransform: 'uppercase' }}>
            दिव्य वाहन शाला • GARAGE & WORKSHOP
          </div>
        </div>

        {/* Coins Total */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(11, 15, 28, 0.9)',
          border: '1.5px solid rgba(255, 215, 0, 0.5)',
          borderRadius: 16,
          padding: '8px 20px',
          boxShadow: '0 0 20px rgba(255, 184, 0, 0.25)'
        }}>
          <div style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #FFF7ED 0%, #FFD700 50%, #B45309 100%)',
            border: '1.5px solid #FFD700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14
          }}>
            🪙
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1 }}>MODAK COINS</div>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 22,
              fontWeight: 900,
              color: '#FFD700'
            }}>
              {saveData.coins.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB SWITCHER: VEHICLES VS STAGES */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
        flexWrap: 'wrap',
        width: '100%'
      }}>
        <button
          onClick={() => {
            hillClimbAudio.playClick();
            setActiveTab('vehicle');
          }}
          style={{
            flex: '1 1 200px',
            maxWidth: 320,
            padding: '12px clamp(14px, 3vw, 28px)',
            borderRadius: 14,
            background: activeTab === 'vehicle'
              ? 'linear-gradient(135deg, #FF671F, #FFB800)'
              : 'rgba(18, 24, 43, 0.7)',
            color: activeTab === 'vehicle' ? '#080B14' : '#FFE57F',
            fontWeight: 800,
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            letterSpacing: 1,
            border: activeTab === 'vehicle' ? 'none' : '1px solid rgba(255, 184, 0, 0.3)',
            boxShadow: activeTab === 'vehicle' ? '0 0 24px rgba(255, 184, 0, 0.5)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center'
          }}
        >
          1. CHOOSE & UPGRADE VEHICLE
        </button>

        <button
          onClick={() => {
            hillClimbAudio.playClick();
            setActiveTab('stage');
          }}
          style={{
            flex: '1 1 200px',
            maxWidth: 320,
            padding: '12px clamp(14px, 3vw, 28px)',
            borderRadius: 14,
            background: activeTab === 'stage'
              ? 'linear-gradient(135deg, #FF671F, #FFB800)'
              : 'rgba(18, 24, 43, 0.7)',
            color: activeTab === 'stage' ? '#080B14' : '#FFE57F',
            fontWeight: 800,
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            letterSpacing: 1,
            border: activeTab === 'stage' ? 'none' : '1px solid rgba(255, 184, 0, 0.3)',
            boxShadow: activeTab === 'stage' ? '0 0 24px rgba(255, 184, 0, 0.5)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center'
          }}
        >
          2. SELECT STAGE & MOUNTAIN
        </button>
      </div>

      {/* 3. TAB 1: VEHICLE SHOWCASE & WORKSHOP */}
      {activeTab === 'vehicle' && (
        <div className="garage-vehicle-columns">
          {/* LEFT: VEHICLE CAROUSEL / SELECTOR */}
          <div style={{
            background: 'rgba(18, 24, 43, 0.85)',
            border: '1px solid rgba(255, 184, 0, 0.3)',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#FF884D', letterSpacing: 1 }}>SELECT CHARIOT</span>
                <h3 style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#FFFFFF'
                }}>
                  {currentVehicleConfig.name}
                </h3>
                <span style={{ fontSize: 13, color: '#FFD700', fontWeight: 600 }}>{currentVehicleConfig.hindiName}</span>
              </div>

              <div style={{
                fontSize: 36,
                background: 'rgba(255, 255, 255, 0.05)',
                width: 60,
                height: 60,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${currentVehicleConfig.color}`
              }}>
                {currentVehicleConfig.icon}
              </div>
            </div>

            {/* Vehicle Selector Thumbnails */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10
            }}>
              {VEHICLE_KEYS.map(id => {
                const conf = VEHICLE_CONFIGS[id];
                const isCurrent = id === selectedVehicle;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      hillClimbAudio.playClick();
                      setSelectedVehicle(id);
                    }}
                    style={{
                      background: isCurrent
                        ? 'linear-gradient(180deg, rgba(255, 184, 0, 0.28) 0%, rgba(18, 24, 43, 0.95) 100%)'
                        : 'rgba(11, 15, 28, 0.7)',
                      border: isCurrent
                        ? '2px solid #FFD700'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 14,
                      padding: '12px 6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: isCurrent ? '0 0 18px rgba(255, 215, 0, 0.45)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: 26 }}>{conf.icon}</span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: isCurrent ? '#FFD700' : '#CBD5E1',
                      textAlign: 'center',
                      lineHeight: 1.1
                    }}>
                      {conf.name.split(' ')[0]}
                    </span>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: isCurrent ? '#4ADE80' : '#94A3B8',
                      letterSpacing: 0.5
                    }}>
                      {isCurrent ? 'SELECTED' : 'UNLOCKED'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Description & Tagline */}
            <div>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#F59E0B',
                marginBottom: 6,
                letterSpacing: 0.5
              }}>
                ✦ {VEHICLE_SPECS[selectedVehicle]?.tagline || 'Divine Himalayan Chariot'}
              </div>
              <p style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: '#CBD5E1',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: 12,
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {currentVehicleConfig.description}
              </p>
            </div>

            {/* Vehicle Performance Profile Specs */}
            <div style={{
              background: 'rgba(11, 15, 28, 0.7)',
              borderRadius: 14,
              padding: 14,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#FF884D', letterSpacing: 1 }}>
                CHARIOT PERFORMANCE PROFILE
              </div>
              {([
                { label: 'TOP SPEED & POWER', val: VEHICLE_SPECS[selectedVehicle]?.speed || 70, color: '#EF4444' },
                { label: 'HILL CLIMB TORQUE', val: VEHICLE_SPECS[selectedVehicle]?.climb || 75, color: '#FF884D' },
                { label: 'SUSPENSION STABILITY', val: VEHICLE_SPECS[selectedVehicle]?.stability || 80, color: '#38BDF8' },
                { label: 'AERIAL STUNT CONTROL', val: VEHICLE_SPECS[selectedVehicle]?.stunts || 75, color: '#A855F7' }
              ] as const).map(spec => (
                <div key={spec.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', width: 140, flexShrink: 0 }}>
                    {spec.label}
                  </span>
                  <div style={{ flex: 1, height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${spec.val}%`,
                      height: '100%',
                      background: spec.color,
                      borderRadius: 3,
                      boxShadow: `0 0 8px ${spec.color}`
                    }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#FFFFFF', width: 32, textAlign: 'right' }}>
                    {spec.val}%
                  </span>
                </div>
              ))}
            </div>

            {/* Unlocked Status Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1.5px solid rgba(34, 197, 94, 0.4)',
              borderRadius: 14,
              padding: '12px 16px',
              color: '#4ADE80',
              fontWeight: 800,
              fontSize: 13,
              boxShadow: '0 0 16px rgba(34, 197, 94, 0.2)'
            }}>
              <CheckCircle2 size={18} />
              <span>CHARIOT UNLOCKED & READY FOR EXPEDITION</span>
            </div>
          </div>

          {/* RIGHT: WORKSHOP UPGRADE STATION */}
          <div style={{
            background: 'rgba(18, 24, 43, 0.85)',
            border: '1px solid rgba(255, 184, 0, 0.3)',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: 12
            }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#FF884D', letterSpacing: 1 }}>DIVINE WORKSHOP</span>
                <h3 style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#FFD700'
                }}>
                  PERFORMANCE UPGRADES
                </h3>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>
                Levels: 1 → 10
              </span>
            </div>

            {/* 4 Upgradable Parts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* 1. ENGINE */}
              {renderUpgradeRow({
                title: 'DIVINE ENGINE',
                hindi: 'इंजन शक्ति',
                desc: 'Boosts low-end torque, hill climbing power & top speed',
                icon: <Zap size={20} color="#FF671F" />,
                level: vehicleData.upgrades.engine,
                cost: getUpgradeCost(vehicleData.upgrades.engine),
                canAfford: saveData.coins >= getUpgradeCost(vehicleData.upgrades.engine),
                isUnlocked: vehicleData.unlocked,
                onUpgrade: () => handleUpgrade('engine')
              })}

              {/* 2. SUSPENSION */}
              {renderUpgradeRow({
                title: 'MYSTIC SUSPENSION',
                hindi: 'कमानी व संतुलन',
                desc: 'Absorbs hard boulder impacts & stabilizes landings',
                icon: <Shield size={20} color="#38BDF8" />,
                level: vehicleData.upgrades.suspension,
                cost: getUpgradeCost(vehicleData.upgrades.suspension),
                canAfford: saveData.coins >= getUpgradeCost(vehicleData.upgrades.suspension),
                isUnlocked: vehicleData.unlocked,
                onUpgrade: () => handleUpgrade('suspension')
              })}

              {/* 3. TIRES */}
              {renderUpgradeRow({
                title: 'SACRED TREAD TIRES',
                hindi: 'चक्र व पकड़',
                desc: 'Extreme grip on slippery ghats, steep rock & ice slopes',
                icon: <Disc size={20} color="#22C55E" />,
                level: vehicleData.upgrades.tires,
                cost: getUpgradeCost(vehicleData.upgrades.tires),
                canAfford: saveData.coins >= getUpgradeCost(vehicleData.upgrades.tires),
                isUnlocked: vehicleData.unlocked,
                onUpgrade: () => handleUpgrade('tires')
              })}

              {/* 4. AMRIT FUEL TANK */}
              {renderUpgradeRow({
                title: 'AMRIT NECTAR TANK',
                hindi: 'अमृत पात्र',
                desc: 'Expands fuel storage capacity for long distance journeys',
                icon: <Fuel size={20} color="#EAB308" />,
                level: vehicleData.upgrades.fuelTank,
                cost: getUpgradeCost(vehicleData.upgrades.fuelTank),
                canAfford: saveData.coins >= getUpgradeCost(vehicleData.upgrades.fuelTank),
                isUnlocked: vehicleData.unlocked,
                onUpgrade: () => handleUpgrade('fuelTank')
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: STAGE SELECTOR */}
      {activeTab === 'stage' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          flex: 1,
          alignItems: 'stretch'
        }}>
          {STAGE_KEYS.map(stgId => {
            const conf = STAGE_CONFIGS[stgId];
            const stgSave = saveData.stages[stgId] || { unlocked: true, bestDistance: 0, highScore: 0 };
            const isSelected = stgId === selectedStage;

            const stageFeatures: Record<StageId, { gravityTag: string; physicsNote: string }> = {
              kailash_foothills: { gravityTag: 'Gravity: 9.8 m/s²', physicsNote: 'Crisp snow meadows & rolling hills' },
              western_ghats: { gravityTag: 'Gravity: 10.2 m/s²', physicsNote: 'Monsoon rain & slick muddy climbs' },
              varanasi_dunes: { gravityTag: 'Gravity: 9.5 m/s²', physicsNote: 'Riverbank dunes & ancient stone steps' },
              svarga_heights: { gravityTag: 'Gravity: 6.8 m/s² (Low)', physicsNote: 'Cosmic sky kingdom & massive ramps' }
            };

            const feat = stageFeatures[stgId];

            return (
              <div
                key={stgId}
                onClick={() => {
                  hillClimbAudio.playClick();
                  setSelectedStage(stgId);
                }}
                style={{
                  background: isSelected
                    ? 'linear-gradient(180deg, rgba(255, 184, 0, 0.22) 0%, rgba(18, 24, 43, 0.98) 100%)'
                    : 'rgba(18, 24, 43, 0.85)',
                  border: isSelected
                    ? '2.5px solid #FFD700'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 22,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isSelected ? '0 0 30px rgba(255, 215, 0, 0.45)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {/* Stage Landscape Header */}
                <div>
                  <div style={{
                    height: 105,
                    borderRadius: 14,
                    background: `linear-gradient(180deg, ${conf.skyTopColor} 0%, ${conf.skyBottomColor} 70%, ${conf.surfaceColor} 100%)`,
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 44,
                    marginBottom: 14,
                    boxShadow: 'inset 0 0 24px rgba(0,0,0,0.5)',
                    position: 'relative'
                  }}>
                    <span>{conf.icon}</span>
                    <div style={{
                      position: 'absolute',
                      bottom: 6,
                      right: 8,
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(4px)',
                      padding: '2px 8px',
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#FFE57F'
                    }}>
                      {feat.gravityTag}
                    </div>
                  </div>

                  <span style={{ fontSize: 11, fontWeight: 700, color: '#FF884D' }}>{conf.hindiName}</span>
                  <h4 style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 18,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    marginBottom: 6
                  }}>
                    {conf.name}
                  </h4>
                  <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.5, marginBottom: 8 }}>
                    {conf.description}
                  </p>
                  <div style={{
                    fontSize: 11,
                    color: '#94A3B8',
                    fontStyle: 'italic',
                    marginBottom: 12
                  }}>
                    ✦ {feat.physicsNote}
                  </div>
                </div>

                {/* Bottom Stats & Selection Action */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    borderRadius: 12,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Trophy size={13} color="#FFD700" />
                      RECORD
                    </span>
                    <span style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 15,
                      fontWeight: 900,
                      color: '#FFD700'
                    }}>
                      {stgSave.bestDistance || 0} m
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      hillClimbAudio.playClick();
                      setSelectedStage(stgId);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: isSelected
                        ? 'linear-gradient(135deg, #FF671F, #FFB800)'
                        : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#080B14' : '#FFE57F',
                      fontWeight: 800,
                      fontSize: 12,
                      letterSpacing: 1,
                      border: isSelected ? 'none' : '1px solid rgba(255, 184, 0, 0.3)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      boxShadow: isSelected ? '0 0 16px rgba(255, 184, 0, 0.4)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>ACTIVE STAGE</span>
                      </>
                    ) : (
                      <span>SELECT STAGE</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. BOTTOM START RACE BAR */}
      <div className="start-race-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            fontSize: 28,
            background: 'rgba(255, 184, 0, 0.15)',
            width: 50,
            height: 50,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid #FFD700',
            flexShrink: 0
          }}>
            {currentVehicleConfig.icon}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 1 }}>ACTIVE EXPEDITION</div>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(15px, 2.5vw, 18px)',
              fontWeight: 900,
              color: '#FFFFFF'
            }}>
              {currentVehicleConfig.name} <span style={{ color: '#FF884D' }}>•</span> {currentStageConfig.name}
            </div>
          </div>
        </div>

        {/* Big Start Race Button */}
        <button
          onClick={handleStartGame}
          className="start-race-btn"
          style={{
            padding: '14px clamp(24px, 4vw, 42px)',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #FF671F 0%, #FFB800 60%, #FFE57F 100%)',
            color: '#080B14',
            fontWeight: 900,
            fontSize: 'clamp(15px, 2.5vw, 18px)',
            letterSpacing: 1.5,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 0 30px rgba(255, 184, 0, 0.6), 0 8px 24px rgba(0,0,0,0.5)',
            transition: 'all 0.2s',
            textTransform: 'uppercase'
          }}
        >
          <Play size={20} fill="#080B14" />
          <span>START CLIMB RACE</span>
        </button>
      </div>

      <style jsx>{`
        .garage-vehicle-columns {
          display: grid;
          grid-template-columns: 1.15fr 1.85fr;
          gap: 24px;
          align-items: start;
          width: 100%;
        }
        .start-race-bar {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(11, 15, 28, 0.96);
          border: 2px solid rgba(255, 184, 0, 0.45);
          border-radius: 22px;
          padding: 16px 24px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7);
          flex-wrap: wrap;
          gap: 14px;
        }
        @media (max-width: 860px) {
          .garage-vehicle-columns {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
        }
        @media (max-width: 640px) {
          .start-race-bar {
            flex-direction: column;
            align-items: stretch !important;
          }
          :global(.start-race-btn) {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

interface UpgradeRowProps {
  title: string;
  hindi: string;
  desc: string;
  icon: React.ReactNode;
  level: number;
  cost: number;
  canAfford: boolean;
  isUnlocked: boolean;
  onUpgrade: () => void;
}

function renderUpgradeRow({
  title,
  hindi,
  desc,
  icon,
  level,
  cost,
  canAfford,
  isUnlocked,
  onUpgrade
}: UpgradeRowProps) {
  const isMax = level >= 10;

  return (
    <div style={{
      background: 'rgba(11, 15, 28, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 16,
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }}>
      {/* Icon & Details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 200, flex: 1 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF' }}>{title}</span>
            <span style={{ fontSize: 11, color: '#FF884D', fontWeight: 600 }}>{hindi}</span>
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{desc}</div>
        </div>
      </div>

      {/* 10 Level Pips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const active = i < level;
          return (
            <div
              key={i}
              style={{
                width: 7,
                height: 20,
                borderRadius: 3,
                background: active
                  ? 'linear-gradient(180deg, #FFD700 0%, #EA580C 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                boxShadow: active ? '0 0 6px rgba(255, 184, 0, 0.5)' : 'none'
              }}
            />
          );
        })}
      </div>

      {/* Upgrade Button */}
      <div style={{ minWidth: 130, textAlign: 'right' }}>
        {isMax ? (
          <span style={{
            fontSize: 12,
            fontWeight: 800,
            color: '#22C55E',
            letterSpacing: 1.2
          }}>
            ★ MAX LEVEL
          </span>
        ) : (
          <button
            onClick={onUpgrade}
            disabled={!isUnlocked || !canAfford}
            style={{
              padding: '8px 14px',
              borderRadius: 12,
              background: !isUnlocked || !canAfford
                ? 'rgba(51, 65, 85, 0.7)'
                : 'linear-gradient(135deg, #FF671F, #FFB800)',
              color: !isUnlocked || !canAfford ? '#94A3B8' : '#080B14',
              fontWeight: 800,
              fontSize: 12,
              border: 'none',
              cursor: !isUnlocked || !canAfford ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: isUnlocked && canAfford ? '0 0 14px rgba(255, 184, 0, 0.4)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            <span>LVL {level + 1}</span>
            <span>(🪙 {cost})</span>
          </button>
        )}
      </div>
    </div>
  );
}
