'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Trophy,
  Flame,
  Zap,
  Play,
  Sparkles,
  MapPin,
  Users,
  Activity,
  Award,
  ArrowRight,
  Shield,
  Compass,
  CheckCircle2,
  Disc,
  Fuel,
  ChevronRight
} from 'lucide-react';
import {
  getStoredPlayerStats,
  getStoredGameSessions,
  getStoredProfile,
  getStoredHillClimbData
} from '@/lib/storage';
import { PlayerStats, GameSession, Profile } from '@/types/database';
import { HillClimbSaveData, VehicleId, StageId } from '@/types/hillClimb';
import { VEHICLE_CONFIGS, STAGE_CONFIGS } from '@/lib/hill-climb/hillClimbEngine';

type DashboardTab = 'overview' | 'runner' | 'hillclimb' | 'history';

const VEHICLE_KEYS: VehicleId[] = ['mushika_rath', 'airavata_rover', 'kailash_quad', 'garuda_turbo'];
const STAGE_KEYS: StageId[] = ['kailash_foothills', 'western_ghats', 'varanasi_dunes', 'svarga_heights'];

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [hillClimbData, setHillClimbData] = useState<HillClimbSaveData | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setProfile(getStoredProfile());
    setStats(getStoredPlayerStats());
    setSessions(getStoredGameSessions());
    setHillClimbData(getStoredHillClimbData());
  }, []);

  // Format chart data for 3D Runner runs
  const chartData = (sessions && sessions.length > 0 ? [...sessions].reverse() : [
    { score: 3200, vighnas_destroyed: 18, modaks_collected: 28, distance: 1200, max_combo: 3 },
    { score: 6500, vighnas_destroyed: 35, modaks_collected: 54, distance: 2400, max_combo: 5 },
    { score: 12450, vighnas_destroyed: 74, modaks_collected: 103, distance: 3800, max_combo: 8 },
  ]).map((sess, idx) => ({
    run: `Run ${idx + 1}`,
    score: sess.score,
    vighnas: sess.vighnas_destroyed,
    modaks: sess.modaks_collected,
    distanceKm: parseFloat((sess.distance / 1000).toFixed(2)),
    combo: sess.max_combo
  }));

  // Best distance across all Hill Climb stages
  const bestHillClimbDistance = hillClimbData
    ? Math.max(...Object.values(hillClimbData.stages).map(s => s.bestDistance || 0))
    : 1056;

  // Total Modak coins (3D runner modaks + Hill Climb coins)
  const totalModakWealth = (stats?.total_modaks || 103) + (hillClimbData?.coins || 5000);

  return (
    <div style={{
      maxWidth: 1280,
      margin: '0 auto',
      padding: 'clamp(20px, 3.5vw, 32px) clamp(12px, 3vw, 24px) 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }}>
      {/* 1. TOP HEADER & PROFILE COMMAND BAR */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(18, 24, 43, 0.95) 0%, rgba(11, 15, 28, 0.98) 100%)',
        border: '1.5px solid rgba(255, 184, 0, 0.35)',
        borderRadius: 24,
        padding: 'clamp(18px, 3vw, 28px) clamp(16px, 3vw, 32px)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20
      }}>
        {/* Left: User Identity & Titles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Avatar Icon */}
          <div style={{
            width: 68,
            height: 68,
            borderRadius: 20,
            background: 'radial-gradient(circle at 35% 35%, #FFF7ED 0%, #FFB800 50%, #B45309 100%)',
            border: '2.5px solid #FFD700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            boxShadow: '0 0 24px rgba(255, 184, 0, 0.45)',
            position: 'relative',
            flexShrink: 0
          }}>
            🕉️
            <div style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid #080B14',
              boxShadow: '0 0 8px #10B981'
            }} />
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.78rem',
              color: '#FFB800',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}>
              <Sparkles size={14} />
              <span>DEVOTEE COMMAND CENTER • दिव्य नियंत्रण कक्ष</span>
            </div>

            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '2.2rem',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '1px',
              margin: '2px 0 6px'
            }}>
              {profile?.username || 'Arjun Devotee'}
            </h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: '0.85rem',
              color: '#94A3B8',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFE57F' }}>
                <MapPin size={14} color="#FF671F" />
                {profile?.city || 'Mumbai'}
              </span>
              <span>•</span>
              <span style={{ color: '#4ADE80', fontWeight: 700 }}>
                Level: Vighnaharta Champion
              </span>
              <span>•</span>
              <span style={{ color: '#38BDF8' }}>
                {stats?.games_played || 3} Expeditions Completed
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Launch Button Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link
            href="/game"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #FF671F, #FFB800)',
              color: '#080B14',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 1,
              boxShadow: '0 0 20px rgba(255, 184, 0, 0.4)',
              transition: 'all 0.2s',
              textTransform: 'uppercase'
            }}
          >
            <Play size={16} fill="#080B14" />
            <span>PLAY 3D RUNNER</span>
          </Link>

          <Link
            href="/hill-climb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #E11D48, #F59E0B)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 1,
              boxShadow: '0 0 20px rgba(225, 29, 72, 0.4)',
              transition: 'all 0.2s',
              textTransform: 'uppercase'
            }}
          >
            <span>🚀</span>
            <span>HILL CLIMB</span>
          </Link>

          <Link
            href="/arcade"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFE57F',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 1,
              transition: 'all 0.2s',
              textTransform: 'uppercase'
            }}
          >
            <Compass size={16} />
            <span>ARCADE HUB</span>
          </Link>
        </div>
      </div>

      {/* 2. TOP 6 PRIMARY KPI METRICS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
        gap: 'clamp(10px, 2vw, 16px)'
      }}>
        {/* KPI 1: Total Modak Wealth */}
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          border: '1px solid rgba(255, 184, 0, 0.3)',
          borderRadius: 18,
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              MODAK WEALTH
            </span>
            <span style={{ fontSize: 18 }}>🪙</span>
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.9rem',
            fontWeight: 900,
            color: '#FFD700',
            marginTop: 6
          }}>
            {totalModakWealth.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ADE80', marginTop: 4 }}>
            🍬 {stats?.total_modaks || 103} + 🪙 {hillClimbData?.coins || 5000}
          </div>
        </div>

        {/* KPI 2: 3D Runner All-Time Best */}
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 18,
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              3D RUNNER BEST
            </span>
            <Trophy size={18} color="#10B981" />
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.9rem',
            fontWeight: 900,
            color: '#10B981',
            marginTop: 6
          }}>
            {(stats?.best_score || 12450).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#FFE57F', marginTop: 4 }}>
            🏆 Rank: Top 5 Devotee
          </div>
        </div>

        {/* KPI 3: Hill Climb Record */}
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 18,
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              MOUNTAIN RECORD
            </span>
            <span style={{ fontSize: 18 }}>🏔️</span>
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.9rem',
            fontWeight: 900,
            color: '#38BDF8',
            marginTop: 6
          }}>
            {bestHillClimbDistance.toLocaleString()} m
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 4 }}>
            Kailash Alpine Foothills
          </div>
        </div>

        {/* KPI 4: Total Distance */}
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 18,
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              TOTAL DISTANCE
            </span>
            <Activity size={18} color="#FFB800" />
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.9rem',
            fontWeight: 900,
            color: '#FFFFFF',
            marginTop: 6
          }}>
            {(((stats?.total_distance || 6800)) / 1000).toFixed(2)} KM
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 4 }}>
            Across all sacred streets
          </div>
        </div>

        {/* KPI 5: Vighnas Removed */}
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          border: '1px solid rgba(255, 103, 31, 0.3)',
          borderRadius: 18,
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              VIGHNAS REMOVED
            </span>
            <span style={{ fontSize: 18 }}>💥</span>
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.9rem',
            fontWeight: 900,
            color: '#FF671F',
            marginTop: 6
          }}>
            {stats?.total_vighnas || 74}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#FFD700', marginTop: 4 }}>
            Sacred Goal: {stats?.total_vighnas || 74} / 108
          </div>
        </div>

        {/* KPI 6: Fleet Status */}
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: 18,
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              CHARIOTS FLEET
            </span>
            <span style={{ fontSize: 18 }}>🏎️</span>
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.9rem',
            fontWeight: 900,
            color: '#C084FC',
            marginTop: 6
          }}>
            4 / 4
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4ADE80', marginTop: 4 }}>
            ✓ 100% Unlocked & Ready
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE SECTION TABS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: 14,
        overflowX: 'auto'
      }}>
        {([
          { id: 'overview', label: '🌟 ALL EXPEDITIONS', desc: 'Unified Overview' },
          { id: 'runner', label: '🏃 3D ENDLESS RUNNER', desc: 'Score & Vighnas' },
          { id: 'hillclimb', label: '🏎️ HILL CLIMB RACING', desc: 'Garage & Stages' },
          { id: 'history', label: '📜 RUN HISTORY & LOGS', desc: 'Session Logs' }
        ] as const).map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                background: isActive
                  ? 'linear-gradient(135deg, #FF671F, #FFB800)'
                  : 'rgba(18, 24, 43, 0.7)',
                color: isActive ? '#080B14' : '#FFE57F',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: 1,
                border: isActive ? 'none' : '1px solid rgba(255, 184, 0, 0.2)',
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 20px rgba(255, 184, 0, 0.45)' : 'none',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Quick Play Game Cards (Two Columns) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 20
          }}>
            {/* 3D Runner Card */}
            <div style={{
              background: 'radial-gradient(ellipse at 80% 20%, rgba(255, 103, 31, 0.15) 0%, rgba(18, 24, 43, 0.9) 70%)',
              border: '1.5px solid rgba(255, 103, 31, 0.35)',
              borderRadius: 22,
              padding: 24,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    color: '#FF671F',
                    background: 'rgba(255, 103, 31, 0.15)',
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(255, 103, 31, 0.3)'
                  }}>
                    SUBWAY SURFERS 3D RUNNER
                  </span>
                  <span style={{ fontSize: 24 }}>🏃</span>
                </div>

                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 6 }}>
                  Vighnaharta 3D Runner
                </h3>
                <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, marginBottom: 18 }}>
                  Don&apos;t just avoid obstacles — smash them with divine Gada strikes! Dash through festival streets, surf train rooftops, and collect modaks.
                </p>

                {/* Mini Stats Bar */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: 12,
                  borderRadius: 14,
                  marginBottom: 20
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>HIGH SCORE</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#FFD700' }}>{(stats?.best_score || 12450).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>MAX COMBO</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#FF671F' }}>x{stats?.best_combo || 8}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>RUNS</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#38BDF8' }}>{stats?.games_played || 3}</div>
                  </div>
                </div>
              </div>

              <Link
                href="/game"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #FF671F, #FFB800)',
                  color: '#080B14',
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  textTransform: 'uppercase'
                }}
              >
                <Play size={16} fill="#080B14" />
                <span>LAUNCH 3D RUNNER</span>
              </Link>
            </div>

            {/* Hill Climb Racing Card */}
            <div style={{
              background: 'radial-gradient(ellipse at 80% 20%, rgba(225, 29, 72, 0.15) 0%, rgba(18, 24, 43, 0.9) 70%)',
              border: '1.5px solid rgba(225, 29, 72, 0.35)',
              borderRadius: 22,
              padding: 24,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    color: '#F43F5E',
                    background: 'rgba(244, 63, 94, 0.15)',
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(244, 63, 94, 0.3)'
                  }}>
                    PHYSICS MOUNTAIN RACER
                  </span>
                  <span style={{ fontSize: 24 }}>🏎️</span>
                </div>

                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 6 }}>
                  Ganesha Hill Climb Racing
                </h3>
                <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, marginBottom: 18 }}>
                  Conquer Mount Kailash, Western Ghats, Varanasi Dunes, and Svarga! Upgrade engines, suspensions, tires, and amrit tanks with modak coins.
                </p>

                {/* Mini Stats Bar */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: 12,
                  borderRadius: 14,
                  marginBottom: 20
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>BEST CLIMB</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#38BDF8' }}>{bestHillClimbDistance} m</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>CHARIOTS</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#4ADE80' }}>4 / 4 Ready</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>STAGES</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#C084FC' }}>4 / 4 Open</div>
                  </div>
                </div>
              </div>

              <Link
                href="/hill-climb"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #E11D48, #F59E0B)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  textTransform: 'uppercase'
                }}
              >
                <span>🚀</span>
                <span>ENTER WORKSHOP & CLIMB</span>
              </Link>
            </div>
          </div>

          {/* Combined Chart & Fleet Preview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 24
          }}>
            {/* Score Progression Area Chart */}
            <div style={{
              background: 'rgba(18, 24, 43, 0.85)',
              border: '1px solid rgba(255, 184, 0, 0.25)',
              borderRadius: 22,
              padding: 24,
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 800, color: '#FFD700' }}>
                    Score & Distance Trajectory
                  </h3>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>Progress across recent runs</span>
                </div>
                <Trophy size={18} color="#FFB800" />
              </div>

              <div style={{ width: '100%', height: 240 }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="scoreGradOverview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFB800" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#FF671F" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="run" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip
                        contentStyle={{ background: '#0E1626', border: '1px solid #FFB800', borderRadius: 8 }}
                        itemStyle={{ color: '#FFE57F' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#FFB800" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradOverview)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chariots Fleet Quick Snapshot */}
            <div style={{
              background: 'rgba(18, 24, 43, 0.85)',
              border: '1px solid rgba(255, 184, 0, 0.25)',
              borderRadius: 22,
              padding: 24,
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 800, color: '#FFD700' }}>
                      Divine Chariots Fleet
                    </h3>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>4 / 4 Chariots Unlocked & Upgradable</span>
                  </div>
                  <Link href="/hill-climb" style={{ fontSize: 12, color: '#FF884D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>UPGRADES</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {VEHICLE_KEYS.map(vId => {
                    const conf = VEHICLE_CONFIGS[vId];
                    const vSave = hillClimbData?.vehicles[vId] || { upgrades: { engine: 1, suspension: 1, tires: 1, fuelTank: 1 } };
                    const totalLvl = vSave.upgrades.engine + vSave.upgrades.suspension + vSave.upgrades.tires + vSave.upgrades.fuelTank;

                    return (
                      <div
                        key={vId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(11, 15, 28, 0.7)',
                          borderRadius: 12,
                          padding: '10px 14px',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 22 }}>{conf.icon}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF' }}>{conf.name}</div>
                            <div style={{ fontSize: 10, color: '#94A3B8' }}>{conf.hindiName} • {conf.subtitle}</div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: '#4ADE80',
                            background: 'rgba(34, 197, 94, 0.15)',
                            padding: '3px 8px',
                            borderRadius: 6,
                            display: 'inline-block'
                          }}>
                            LVL {totalLvl} / 40
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: 3D RUNNER DEEP DIVE */}
      {activeTab === 'runner' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Runner Specific KPI Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16
          }}>
            <div style={{ background: 'rgba(18, 24, 43, 0.85)', borderRadius: 16, padding: 18, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>PERSONAL BEST SCORE</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 900, color: '#FFD700', marginTop: 4 }}>
                {(stats?.best_score || 12450).toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(18, 24, 43, 0.85)', borderRadius: 16, padding: 18, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>MAX COMBO STREAK</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 900, color: '#FF671F', marginTop: 4 }}>
                x{stats?.best_combo || 8} Hits
              </div>
            </div>
            <div style={{ background: 'rgba(18, 24, 43, 0.85)', borderRadius: 16, padding: 18, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>TOTAL VIGHNAS DESTROYED</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 900, color: '#4ADE80', marginTop: 4 }}>
                {stats?.total_vighnas || 74}
              </div>
            </div>
            <div style={{ background: 'rgba(18, 24, 43, 0.85)', borderRadius: 16, padding: 18, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>SWEET MODAKS GATHERED</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 900, color: '#FFA500', marginTop: 4 }}>
                {stats?.total_modaks || 103} 🍬
              </div>
            </div>
          </div>

          {/* 3 Detailed Charts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: 20
          }}>
            {/* Chart 1: Score Progression */}
            <div style={{
              background: 'rgba(18, 24, 43, 0.85)',
              borderRadius: 20,
              padding: 22,
              border: '1px solid rgba(255, 184, 0, 0.25)'
            }}>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: '#FFD700', marginBottom: 14 }}>
                Score Growth per Run
              </h4>
              <div style={{ width: '100%', height: 230 }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="run" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip contentStyle={{ background: '#0E1626', border: '1px solid #FFB800', borderRadius: 8 }} />
                      <Area type="monotone" dataKey="score" stroke="#FFB800" strokeWidth={2.5} fill="#FFB800" fillOpacity={0.25} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 2: Vighnas Removed */}
            <div style={{
              background: 'rgba(18, 24, 43, 0.85)',
              borderRadius: 20,
              padding: 22,
              border: '1px solid rgba(255, 103, 31, 0.25)'
            }}>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: '#FF884D', marginBottom: 14 }}>
                Vighnas Removed (Obstacle Clears)
              </h4>
              <div style={{ width: '100%', height: 230 }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="run" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip contentStyle={{ background: '#0E1626', border: '1px solid #FF671F', borderRadius: 8 }} />
                      <Bar dataKey="vighnas" fill="#FF671F" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 3: Distance Traveled */}
            <div style={{
              background: 'rgba(18, 24, 43, 0.85)',
              borderRadius: 20,
              padding: 22,
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: '#38BDF8', marginBottom: 14 }}>
                Distance Traveled (KM)
              </h4>
              <div style={{ width: '100%', height: 230 }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="run" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip contentStyle={{ background: '#0E1626', border: '1px solid #38BDF8', borderRadius: 8 }} />
                      <Line type="monotone" dataKey="distanceKm" stroke="#38BDF8" strokeWidth={3} dot={{ fill: '#38BDF8', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: HILL CLIMB RACING DEEP DIVE */}
      {activeTab === 'hillclimb' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header Summary Bar */}
          <div style={{
            background: 'rgba(18, 24, 43, 0.85)',
            borderRadius: 20,
            padding: 20,
            border: '1.5px solid rgba(255, 184, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 32 }}>🪙</span>
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>WORKSHOP MODAK COINS</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 900, color: '#FFD700' }}>
                  {(hillClimbData?.coins || 5000).toLocaleString()} Coins Available
                </div>
              </div>
            </div>

            <Link
              href="/hill-climb"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #FF671F, #FFB800)',
                color: '#080B14',
                fontWeight: 800,
                fontSize: 13
              }}
            >
              <span>UPGRADE IN GARAGE</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* 4 Chariots Grid */}
          <div>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#FFFFFF', marginBottom: 14 }}>
              CHOSEN CHARIOT FLEET (4 / 4 UNLOCKED)
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16
            }}>
              {VEHICLE_KEYS.map(vId => {
                const conf = VEHICLE_CONFIGS[vId];
                const vSave = hillClimbData?.vehicles[vId] || { upgrades: { engine: 1, suspension: 1, tires: 1, fuelTank: 1 } };
                const up = vSave.upgrades;

                return (
                  <div
                    key={vId}
                    style={{
                      background: 'rgba(18, 24, 43, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 18,
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{conf.icon}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>{conf.name}</div>
                          <div style={{ fontSize: 11, color: '#FFD700' }}>{conf.hindiName}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: '#4ADE80', fontWeight: 800, background: 'rgba(34, 197, 94, 0.15)', padding: '2px 8px', borderRadius: 6 }}>
                        READY
                      </span>
                    </div>

                    <p style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.4 }}>
                      {conf.description}
                    </p>

                    {/* Upgrades Matrix */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 8,
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: 10,
                      borderRadius: 10,
                      fontSize: 11
                    }}>
                      <div>⚡ Engine: <strong style={{ color: '#FF671F' }}>Lvl {up.engine}/10</strong></div>
                      <div>🛡️ Susp: <strong style={{ color: '#38BDF8' }}>Lvl {up.suspension}/10</strong></div>
                      <div>💿 Tires: <strong style={{ color: '#4ADE80' }}>Lvl {up.tires}/10</strong></div>
                      <div>⛽ Fuel: <strong style={{ color: '#FACC15' }}>Lvl {up.fuelTank}/10</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4 Mountain Expedition Stages */}
          <div>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#FFFFFF', marginBottom: 14 }}>
              EXPEDITION MOUNTAIN RECORDS
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16
            }}>
              {STAGE_KEYS.map(sId => {
                const conf = STAGE_CONFIGS[sId];
                const sSave = hillClimbData?.stages[sId] || { bestDistance: 0 };

                return (
                  <div
                    key={sId}
                    style={{
                      background: 'rgba(18, 24, 43, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 18,
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 24 }}>{conf.icon}</span>
                        <span style={{ fontSize: 11, color: '#FFE57F', fontWeight: 700 }}>
                          Gravity: {conf.gravity} m/s²
                        </span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>{conf.name}</div>
                      <div style={{ fontSize: 11, color: '#FF884D' }}>{conf.hindiName}</div>
                      <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 6, lineHeight: 1.4 }}>
                        {conf.description}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <span style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Trophy size={12} color="#FFD700" />
                        RECORD
                      </span>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 900, color: '#FFD700' }}>
                        {sSave.bestDistance || 0} m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: RUN HISTORY & LOGS */}
      {activeTab === 'history' && (
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          borderRadius: 20,
          padding: 24,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.5)'
        }}>
          <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#FFD700', marginBottom: 16 }}>
            Recent Expeditions & Run History
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid rgba(255, 255, 255, 0.12)', color: '#94A3B8' }}>
                  <th style={{ padding: '12px 14px' }}>RUN #</th>
                  <th style={{ padding: '12px 14px' }}>GAME MODE</th>
                  <th style={{ padding: '12px 14px' }}>SCORE</th>
                  <th style={{ padding: '12px 14px' }}>DISTANCE</th>
                  <th style={{ padding: '12px 14px' }}>MODAKS</th>
                  <th style={{ padding: '12px 14px' }}>VIGHNAS / STUNTS</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {(sessions && sessions.length > 0 ? sessions : [
                  { id: '1', score: 12450, distance: 3800, modaks_collected: 103, vighnas_destroyed: 74, max_combo: 8 },
                  { id: '2', score: 6500, distance: 2400, modaks_collected: 54, vighnas_destroyed: 35, max_combo: 5 },
                  { id: '3', score: 3200, distance: 1200, modaks_collected: 28, vighnas_destroyed: 18, max_combo: 3 },
                ]).map((s, idx) => (
                  <tr
                    key={s.id || idx}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '14px', fontWeight: 800, color: '#FFE57F' }}>
                      #{sessions.length - idx}
                    </td>
                    <td style={{ padding: '14px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>🏃</span>
                      <span>3D Runner</span>
                    </td>
                    <td style={{ padding: '14px', fontWeight: 800, color: '#FFD700' }}>
                      {s.score.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px', color: '#38BDF8' }}>
                      {((s.distance || 0) / 1000).toFixed(2)} KM
                    </td>
                    <td style={{ padding: '14px', color: '#FFA500' }}>
                      {s.modaks_collected} 🍬
                    </td>
                    <td style={{ padding: '14px', color: '#FF671F' }}>
                      {s.vighnas_destroyed} Vighnas (x{s.max_combo || 1})
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        fontSize: 11,
                        color: '#4ADE80',
                        background: 'rgba(34, 197, 94, 0.15)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontWeight: 700
                      }}>
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. FESTIVAL PULSE REALTIME TELEMETRY BAR */}
      <div style={{
        background: 'rgba(18, 24, 43, 0.85)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 20,
        padding: '20px 24px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 10px #10B981',
              display: 'inline-block'
            }} />
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 800, color: '#4ADE80' }}>
              GLOBAL FESTIVAL PULSE
            </h3>
          </div>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>
            Realtime Community Telemetry
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>PLAYERS ONLINE</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>17 Live Devotees</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>ACTIVE EXPEDITIONS</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFB800' }}>42 Worldwide Runs</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>VIGHNAS SMASHED TODAY</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FF671F' }}>1,480 💥</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>MODAKS HARVESTED TODAY</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFA500' }}>8,920 🍬</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>TOP PILGRIMAGE CITY</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>📍 Mumbai</div>
          </div>
        </div>
      </div>
    </div>
  );
}
