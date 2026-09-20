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
  Activity,
  Award,
  ArrowRight,
  Shield,
  Compass,
  CheckCircle2,
  ChevronRight,
  Palette,
  Snowflake,
  Heart,
  RefreshCw,
  Layers,
  Filter
} from 'lucide-react';
import {
  getStoredPlayerStats,
  getStoredGameSessions,
  getStoredProfile,
  getStoredHillClimbData,
  getStoredTempleRunStats,
  getActiveGaneshaAvatar,
  getSavedGaneshaDesigns,
  setActiveGaneshaAvatar,
  TempleRunStats
} from '@/lib/storage';
import { PlayerStats, GameSession, Profile } from '@/types/database';
import { HillClimbSaveData, VehicleId, StageId } from '@/types/hillClimb';
import { SavedGaneshaDesign } from '@/types/idolShop';
import { VEHICLE_CONFIGS, STAGE_CONFIGS } from '@/lib/hill-climb/hillClimbEngine';
import GaneshaAvatar from '@/components/idol-shop/GaneshaAvatar';
import GaneshaIdolRenderer from '@/components/idol-shop/GaneshaIdolRenderer';
import { DEFAULT_GANESHA_CONFIG } from '@/lib/idolShopData';

type DashboardTab = 'overview' | 'temple_run' | 'runner' | 'hillclimb' | 'idol_shop' | 'history';

const VEHICLE_KEYS: VehicleId[] = ['mushika_rath', 'airavata_rover', 'kailash_quad', 'garuda_turbo'];
const STAGE_KEYS: StageId[] = ['kailash_foothills', 'western_ghats', 'varanasi_dunes', 'svarga_heights'];

function DashboardSkeleton() {
  return (
    <div style={{
      maxWidth: 1320,
      margin: '0 auto',
      padding: 'clamp(20px, 3.5vw, 32px) clamp(12px, 3vw, 24px) 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }}>
      {/* Top command bar skeleton */}
      <div className="skeleton-shimmer" style={{
        height: 120,
        borderRadius: 24,
        border: '1.5px solid rgba(255, 184, 0, 0.2)'
      }} />

      {/* 6 KPI cards skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
        gap: 14
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-shimmer" style={{
            height: 110,
            borderRadius: 18,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }} />
        ))}
      </div>

      {/* Tabs skeleton */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-shimmer" style={{
            width: 130,
            height: 42,
            borderRadius: 12,
            flexShrink: 0,
            border: '1px solid rgba(255, 184, 0, 0.15)'
          }} />
        ))}
      </div>

      {/* 4 Cards skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: 20
      }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton-shimmer" style={{
            height: 260,
            borderRadius: 22,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }} />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [templeStats, setTempleStats] = useState<TempleRunStats | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [hillClimbData, setHillClimbData] = useState<HillClimbSaveData | null>(null);
  const [activeAvatar, setActiveAvatar] = useState<SavedGaneshaDesign | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<SavedGaneshaDesign[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'temple_run' | 'runner' | 'hillclimb'>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setProfile(getStoredProfile());
    setStats(getStoredPlayerStats());
    setTempleStats(getStoredTempleRunStats());
    setSessions(getStoredGameSessions());
    setHillClimbData(getStoredHillClimbData());
    setActiveAvatar(getActiveGaneshaAvatar());
    setSavedDesigns(getSavedGaneshaDesigns());
  }, []);

  if (!isMounted) {
    return <DashboardSkeleton />;
  }

  // Format chart data for 3D Runner and Temple runs
  const chartData = (sessions && sessions.length > 0 ? [...sessions].reverse() : [
    { score: 3200, vighnas_destroyed: 18, modaks_collected: 28, distance: 1200, max_combo: 3 },
    { score: 6500, vighnas_destroyed: 35, modaks_collected: 54, distance: 2400, max_combo: 5 },
    { score: 12450, vighnas_destroyed: 74, modaks_collected: 103, distance: 3800, max_combo: 8 },
    { score: 16800, vighnas_destroyed: 86, modaks_collected: 142, distance: 4250, max_combo: 9 }
  ]).map((sess, idx) => ({
    run: `Run ${idx + 1}`,
    score: sess.score || 0,
    vighnas: sess.vighnas_destroyed || 0,
    modaks: sess.modaks_collected || 0,
    distanceKm: parseFloat(((sess.distance || 0) / 1000).toFixed(2)),
    combo: sess.max_combo || 1
  }));

  // Best distance across all Hill Climb stages (safe from empty arrays / undefined)
  const stagesList = hillClimbData?.stages ? Object.values(hillClimbData.stages) : [];
  const bestHillClimbDistance = stagesList.length > 0
    ? Math.max(0, ...stagesList.map(s => s?.bestDistance || 0))
    : 1056;

  // Unified Modak Wealth across all 4 games
  const totalModakWealth = (stats?.total_modaks || 103) + (templeStats?.total_modaks || 142) + (hillClimbData?.coins || 5000);

  // Total Vighnas cleared across runners
  const totalVighnasSmashed = (stats?.total_vighnas || 74) + (templeStats?.total_vighnas || 86);

  // Filtered sessions for history tab
  const displaySessions = (sessions && sessions.length > 0 ? sessions : [
    {
      id: 'sess-tr-1',
      user_id: 'guest',
      game_mode: 'temple_run',
      score: 16800,
      distance: 4250,
      duration: 165,
      vighnas_destroyed: 86,
      modaks_collected: 142,
      powerups_collected: 8,
      max_combo: 9,
      weather: 'Frozen Shadows',
      environment: 'Frozen Temple Path',
      completed: false,
      created_at: '2026-09-19T14:30:00.000Z'
    },
    {
      id: 'sess-run-1',
      user_id: 'guest',
      game_mode: 'runner',
      score: 12450,
      distance: 3800,
      duration: 145,
      vighnas_destroyed: 74,
      modaks_collected: 103,
      powerups_collected: 5,
      max_combo: 8,
      weather: 'Sunny',
      environment: 'Festival Street',
      completed: false,
      created_at: '2026-09-19T13:15:00.000Z'
    },
    {
      id: 'sess-hc-1',
      user_id: 'guest',
      game_mode: 'hillclimb',
      score: 8200,
      distance: 1450,
      duration: 120,
      vighnas_destroyed: 24,
      modaks_collected: 65,
      powerups_collected: 3,
      max_combo: 4,
      weather: 'Alpine Snow',
      environment: 'Kailash Foothills',
      completed: false,
      created_at: '2026-09-19T11:00:00.000Z'
    },
    {
      id: 'sess-run-2',
      user_id: 'guest',
      game_mode: 'runner',
      score: 6000,
      distance: 3000,
      duration: 110,
      vighnas_destroyed: 35,
      modaks_collected: 54,
      powerups_collected: 2,
      max_combo: 5,
      weather: 'Sunset',
      environment: 'Temple Street',
      completed: false,
      created_at: '2026-09-19T09:30:00.000Z'
    }
  ]).filter(s => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'temple_run') {
      return s.game_mode === 'temple_run' || s.weather?.toLowerCase().includes('frozen') || s.environment?.toLowerCase().includes('temple run');
    }
    if (historyFilter === 'hillclimb') {
      return s.game_mode === 'hillclimb' || s.environment?.toLowerCase().includes('foothills') || s.environment?.toLowerCase().includes('ghats') || s.environment?.toLowerCase().includes('dunes') || s.environment?.toLowerCase().includes('svarga');
    }
    if (historyFilter === 'runner') {
      return s.game_mode === 'runner' || (!s.game_mode && !s.weather?.toLowerCase().includes('frozen'));
    }
    return true;
  });

  const getGameLabel = (s: GameSession) => {
    if (s.game_mode === 'temple_run' || s.weather?.toLowerCase().includes('frozen') || s.environment?.toLowerCase().includes('temple run')) {
      return { icon: '❄️', name: 'Temple Run', sub: 'Frozen Shadows', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' };
    }
    if (s.game_mode === 'hillclimb' || s.environment?.toLowerCase().includes('foothills') || s.environment?.toLowerCase().includes('ghats') || s.environment?.toLowerCase().includes('dunes') || s.environment?.toLowerCase().includes('svarga')) {
      return { icon: '🏎️', name: 'Hill Climb', sub: s.environment || 'Kailash', color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.15)' };
    }
    return { icon: '🏃', name: '3D Runner', sub: s.environment || 'Festival Street', color: '#FFB800', bg: 'rgba(255, 184, 0, 0.15)' };
  };

  return (
    <div style={{
      maxWidth: 1320,
      margin: '0 auto',
      padding: 'clamp(20px, 3.5vw, 32px) clamp(12px, 3vw, 24px) 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }}>
      {/* 1. TOP COMMAND BAR & PROFILE IDENTIFICATION */}
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
        {/* Left: Player Identity & Sanctum Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <GaneshaAvatar avatarId={profile?.avatar} size={72} showBorder={true} />
            <div style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#10B981',
              border: '2.5px solid #080B14',
              boxShadow: '0 0 10px #10B981'
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
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
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
              gap: 12,
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
                {activeAvatar?.name ? `Deity: ${activeAvatar.name}` : 'Rank: Vighnaharta Champion'}
              </span>
              <span>•</span>
              <span style={{ color: '#38BDF8' }}>
                {sessions.length || 4} Total Expeditions Logged
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Launch Button Group FOR ALL 4 GAMES */}
        <div className="command-bar-actions" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Game 1: Temple Run */}
          <Link
            href="/temple-run"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 18px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #0284C7, #06B6D4)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: 0.8,
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
              transition: 'all 0.2s',
              textTransform: 'uppercase'
            }}
          >
            <Snowflake size={15} />
            <span>TEMPLE RUN</span>
          </Link>

          {/* Game 2: 3D Runner */}
          <Link
            href="/game"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 18px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #FF671F, #FFB800)',
              color: '#080B14',
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: 0.8,
              boxShadow: '0 0 20px rgba(255, 184, 0, 0.4)',
              transition: 'all 0.2s',
              textTransform: 'uppercase'
            }}
          >
            <Play size={15} fill="#080B14" />
            <span>3D RUNNER</span>
          </Link>

          {/* Game 3: Hill Climb */}
          <Link
            href="/hill-climb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 18px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #E11D48, #F59E0B)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: 0.8,
              boxShadow: '0 0 20px rgba(225, 29, 72, 0.4)',
              transition: 'all 0.2s',
              textTransform: 'uppercase'
            }}
          >
            <span>🏎️</span>
            <span>HILL CLIMB</span>
          </Link>

          {/* Game 4: Idol Shop */}
          <Link
            href="/idol-shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 18px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: 0.8,
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
              transition: 'all 0.2s',
              textTransform: 'uppercase'
            }}
          >
            <Palette size={15} />
            <span>IDOL SHOP</span>
          </Link>

          {/* Arcade Hub */}
          <Link
            href="/arcade"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 16px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFE57F',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 0.8,
              transition: 'all 0.2s',
              textTransform: 'uppercase'
            }}
          >
            <Compass size={15} />
            <span>ARCADE</span>
          </Link>
        </div>
      </div>

      {/* 2. PRIMARY 6 UNIFIED KPI CARDS (COVERING ALL 4 GAMES) */}
      <div className="kpi-cards-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
        gap: 'clamp(10px, 2vw, 16px)'
      }}>
        {/* KPI 1: Modak Wealth */}
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
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#FFD700',
            marginTop: 6
          }}>
            {totalModakWealth.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#4ADE80', marginTop: 4 }}>
            🍬 {stats?.total_modaks || 103} + ❄️ {templeStats?.total_modaks || 142} + 🪙 {hillClimbData?.coins || 5000}
          </div>
        </div>

        {/* KPI 2: Temple Run Record */}
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: 18,
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              TEMPLE RUN RECORD
            </span>
            <Snowflake size={18} color="#38BDF8" />
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#38BDF8',
            marginTop: 6
          }}>
            {(templeStats?.best_score || 16800).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#FFE57F', marginTop: 4 }}>
            ❄️ {((templeStats?.best_distance || 4250) / 1000).toFixed(2)} KM in Frozen Shadows
          </div>
        </div>

        {/* KPI 3: 3D Runner Record */}
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
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#10B981',
            marginTop: 6
          }}>
            {(stats?.best_score ?? 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#FFB800', marginTop: 4 }}>
            💥 x{stats?.best_combo ?? 0} Combo Streak
          </div>
        </div>

        {/* KPI 4: Mountain Record */}
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
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
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#F43F5E',
            marginTop: 6
          }}>
            {bestHillClimbDistance.toLocaleString()} m
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 4 }}>
            Mount Kailash & 4 Peaks
          </div>
        </div>

        {/* KPI 5: Total Vighnas Cleared */}
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          border: '1px solid rgba(255, 103, 31, 0.3)',
          borderRadius: 18,
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              VIGHNAS DESTROYED
            </span>
            <span style={{ fontSize: 18 }}>💥</span>
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#FF671F',
            marginTop: 6
          }}>
            {totalVighnasSmashed}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#FFD700', marginTop: 4 }}>
            Sacred Target: {totalVighnasSmashed} / 108
          </div>
        </div>

        {/* KPI 6: Handcrafted Idols */}
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: 18,
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              SANCTUM IDOLS
            </span>
            <Palette size={18} color="#C084FC" />
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#C084FC',
            marginTop: 6
          }}>
            {savedDesigns.length || 3} Deities
          </div>
          <div style={{ fontSize: '0.72rem', color: '#4ADE80', marginTop: 4 }}>
            ✓ Active: {activeAvatar?.name || 'Golden Peetham'}
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE SECTION TABS (6 TABS FOR ALL 4 GAMES) */}
      <div className="no-scrollbar" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: 14,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x mandatory'
      }}>
        {([
          { id: 'overview', label: '🌟 ALL EXPEDITIONS', desc: 'Unified Overview' },
          { id: 'temple_run', label: '❄️ TEMPLE RUN', desc: 'Frozen Shadows' },
          { id: 'runner', label: '🏃 3D RUNNER', desc: 'Festival Streets' },
          { id: 'hillclimb', label: '🏎️ HILL CLIMB', desc: 'Garage & Stages' },
          { id: 'idol_shop', label: '🎨 IDOL SHOP', desc: 'Custom Sanctum' },
          { id: 'history', label: '📜 RUN HISTORY', desc: 'Session Logs' }
        ] as const).map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="touch-scale"
              style={{
                flexShrink: 0,
                scrollSnapAlign: 'start',
                padding: '10px 18px',
                borderRadius: 12,
                background: isActive
                  ? 'linear-gradient(135deg, #FF671F, #FFB800)'
                  : 'rgba(18, 24, 43, 0.7)',
                color: isActive ? '#080B14' : '#FFE57F',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: 0.8,
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

      {/* 4. TAB CONTENT: OVERVIEW (ALL 4 GAMES SHOWCASE CARDS) */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* 4 Game Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 20
          }}>
            {/* Card 1: Vighnaharta Temple Run */}
            <div style={{
              background: 'radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.15) 0%, rgba(18, 24, 43, 0.95) 70%)',
              border: '1.5px solid rgba(6, 182, 212, 0.4)',
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
                    color: '#38BDF8',
                    background: 'rgba(56, 189, 248, 0.15)',
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}>
                    ❄️ TEMPLE RUN 2 - FROZEN
                  </span>
                  <span style={{ fontSize: 24 }}>🏛️</span>
                </div>

                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 6 }}>
                  Vighnaharta Temple Run
                </h3>
                <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, marginBottom: 18 }}>
                  Endless 3D running through glacial mountain temple corridors with 90° corner turns, icicle caverns, snow hurdles, and frost demons.
                </p>

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
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#38BDF8' }}>{(templeStats?.best_score || 16800).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>DISTANCE</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#FFE57F' }}>{((templeStats?.best_distance || 4250) / 1000).toFixed(2)} KM</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>VIGHNAS</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#4ADE80' }}>{templeStats?.total_vighnas || 86}</div>
                  </div>
                </div>
              </div>

              <Link
                href="/temple-run"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0284C7, #06B6D4)',
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
                <Snowflake size={16} />
                <span>PLAY TEMPLE RUN</span>
              </Link>
            </div>

            {/* Card 2: 3D Endless Runner */}
            <div style={{
              background: 'radial-gradient(ellipse at 80% 20%, rgba(255, 103, 31, 0.15) 0%, rgba(18, 24, 43, 0.95) 70%)',
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
                    SUBWAY SURFERS STYLE
                  </span>
                  <span style={{ fontSize: 24 }}>🏃</span>
                </div>

                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 6 }}>
                  Vighnaharta 3D Runner
                </h3>
                <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, marginBottom: 18 }}>
                  Dash across 3 festival street lanes, smash obstacles with divine Gada strikes, ride the Mushika Hoverboard, and collect sweet modaks.
                </p>

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
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#FFD700' }}>{(stats?.best_score ?? 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>MAX COMBO</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#FF671F' }}>x{stats?.best_combo ?? 0}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>RUNS</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#38BDF8' }}>{stats?.games_played ?? 0}</div>
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
                <span>PLAY 3D RUNNER</span>
              </Link>
            </div>

            {/* Card 3: Hill Climb Racing */}
            <div style={{
              background: 'radial-gradient(ellipse at 80% 20%, rgba(225, 29, 72, 0.15) 0%, rgba(18, 24, 43, 0.95) 70%)',
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

                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 6 }}>
                  Ganesha Hill Climb Racing
                </h3>
                <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, marginBottom: 18 }}>
                  Drive divine chariots across Kailash, Western Ghats, Varanasi & Svarga! Upgrade engines, suspensions, tires, and amrit fuel tanks.
                </p>

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
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#38BDF8' }}>{bestHillClimbDistance} m</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>CHARIOTS</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#4ADE80' }}>4 / 4 Open</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>STAGES</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#C084FC' }}>4 / 4 Open</div>
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
                <span>ENTER HILL CLIMB</span>
              </Link>
            </div>

            {/* Card 4: Ganesh Idol Shop */}
            <div style={{
              background: 'radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.15) 0%, rgba(18, 24, 43, 0.95) 70%)',
              border: '1.5px solid rgba(168, 85, 247, 0.35)',
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
                    color: '#C084FC',
                    background: 'rgba(168, 85, 247, 0.15)',
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(168, 85, 247, 0.3)'
                  }}>
                    ARTISAN & CUSTOMIZER
                  </span>
                  <span style={{ fontSize: 24 }}>🎨</span>
                </div>

                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginBottom: 6 }}>
                  Ganesh Idol Shop & Studio
                </h3>
                <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, marginBottom: 18 }}>
                  Handcraft custom Lord Ganesha deities with 12 sacred parts: crowns, pitambar silks, trishul weapons, lotus auras, and set as active avatar.
                </p>

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
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>DESIGNS</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#C084FC' }}>{savedDesigns.length || 3} Saved</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>PARTS</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#FFD700' }}>12 Types</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>AVATAR</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#4ADE80' }}>Synced</div>
                  </div>
                </div>
              </div>

              <Link
                href="/idol-shop"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
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
                <Palette size={16} />
                <span>ENTER IDOL SHOP</span>
              </Link>
            </div>
          </div>

          {/* Combined Trajectory & Fleet Snapshot */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
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
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>Progression across recent multi-game runs</span>
                </div>
                <Trophy size={18} color="#FFB800" />
              </div>

              <div style={{ width: '100%', height: 230, minHeight: 230, minWidth: 0, position: 'relative' }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height={230}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreGradOverview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFB800" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#FF671F" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="run" stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
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

      {/* 5. TAB CONTENT: TEMPLE RUN DEEP DIVE */}
      {activeTab === 'temple_run' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Temple Run Highlights Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(7, 17, 38, 0.95) 0%, rgba(12, 25, 56, 0.95) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 20,
            padding: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 54,
                height: 54,
                borderRadius: 16,
                background: 'rgba(6, 182, 212, 0.2)',
                border: '1px solid #38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28
              }}>
                ❄️
              </div>
              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 900, color: '#38BDF8' }}>
                  Vighnaharta Temple Run: Frozen Shadows
                </h3>
                <p style={{ fontSize: 12, color: '#BAE6FD', marginTop: 2 }}>
                  Glacial Torana Archways • Cyan Spirit Braziers • 90° Turning • 108 Vighnas
                </p>
              </div>
            </div>

            <Link
              href="/temple-run"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #0284C7, #06B6D4)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: 1,
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)',
                textTransform: 'uppercase'
              }}
            >
              <Snowflake size={16} />
              <span>PLAY TEMPLE RUN NOW</span>
            </Link>
          </div>

          {/* Temple Run 4 KPIs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16
          }}>
            <div style={{ background: 'rgba(18, 24, 43, 0.85)', borderRadius: 16, padding: 18, border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>FROZEN HIGH SCORE</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 900, color: '#38BDF8', marginTop: 4 }}>
                {(templeStats?.best_score || 16800).toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(18, 24, 43, 0.85)', borderRadius: 16, padding: 18, border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>LONGEST TEMPLE RUN</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 900, color: '#FFE57F', marginTop: 4 }}>
                {((templeStats?.best_distance || 4250) / 1000).toFixed(2)} KM
              </div>
            </div>
            <div style={{ background: 'rgba(18, 24, 43, 0.85)', borderRadius: 16, padding: 18, border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>FROST VIGHNAS CLEARED</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 900, color: '#4ADE80', marginTop: 4 }}>
                {templeStats?.total_vighnas || 86} Obstacles
              </div>
            </div>
            <div style={{ background: 'rgba(18, 24, 43, 0.85)', borderRadius: 16, padding: 18, border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>MAX TURN COMBO</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 900, color: '#F43F5E', marginTop: 4 }}>
                x{templeStats?.best_combo || 9} Hits
              </div>
            </div>
          </div>

          {/* 4 Sacred Worlds Progression */}
          <div>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#FFFFFF', marginBottom: 14 }}>
              SACRED TEMPLE WORLDS
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 16
            }}>
              {[
                { name: 'Frozen Shadows', icon: '❄️', desc: 'Glacial pillars, ice floor dividers, snowfall & frost demons', status: 'ACTIVE THEME', color: '#38BDF8' },
                { name: 'Temple Street', icon: '🏛️', desc: 'Ancient carved stone toranas, hanging bells & braziers', status: 'UNLOCKED', color: '#FFD700' },
                { name: 'Sacred Banyan', icon: '🌳', desc: 'Mighty hanging roots, mystical twilight canopy & fireflies', status: 'UNLOCKED', color: '#4ADE80' },
                { name: 'Crystal Caves', icon: '💎', desc: 'Underground luminous amrit crystals & celestial echoes', status: 'UNLOCKED', color: '#C084FC' }
              ].map(w => (
                <div
                  key={w.name}
                  style={{
                    background: 'rgba(18, 24, 43, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 18,
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 10
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 28 }}>{w.icon}</span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: w.color,
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '3px 8px',
                      borderRadius: 6
                    }}>
                      {w.status}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>{w.name}</div>
                    <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, lineHeight: 1.4 }}>{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: 3D RUNNER DEEP DIVE */}
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
                {(stats?.best_score ?? 0).toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(18, 24, 43, 0.85)', borderRadius: 16, padding: 18, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>MAX COMBO STREAK</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 900, color: '#FF671F', marginTop: 4 }}>
                x{stats?.best_combo ?? 0} Hits
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
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
              <div style={{ width: '100%', height: 230, minHeight: 230, minWidth: 0, position: 'relative' }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height={230}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="run" stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
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
                Vighnas Smashed (Obstacle Clears)
              </h4>
              <div style={{ width: '100%', height: 230, minHeight: 230, minWidth: 0, position: 'relative' }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="run" stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
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
              <div style={{ width: '100%', height: 230, minHeight: 230, minWidth: 0, position: 'relative' }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height={230}>
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="run" stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
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

      {/* 7. TAB CONTENT: HILL CLIMB RACING DEEP DIVE */}
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

      {/* 8. TAB CONTENT: GANESH IDOL SHOP & SANCTUM */}
      {activeTab === 'idol_shop' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Active Deity Showcase Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(35, 20, 60, 0.95) 0%, rgba(18, 14, 36, 0.95) 100%)',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            borderRadius: 24,
            padding: '24px 28px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              {/* Deity Preview */}
              <div style={{
                width: 140,
                height: 140,
                borderRadius: 24,
                background: 'rgba(0, 0, 0, 0.4)',
                border: '2px solid #FFD700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
              }}>
                <GaneshaIdolRenderer
                  config={activeAvatar?.config || DEFAULT_GANESHA_CONFIG}
                  size="100%"
                  showPlatform={true}
                  animateIdle={true}
                  rotation={0}
                  tilt={0}
                  zoom={0.9}
                />
              </div>

              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  color: '#FFD700',
                  fontSize: 11,
                  fontWeight: 800,
                  marginBottom: 6
                }}>
                  <Sparkles size={12} />
                  <span>ACTIVE SACRED AVATAR • सक्रिय देवता</span>
                </div>

                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 900, color: '#FFFFFF', margin: '2px 0 6px' }}>
                  {activeAvatar?.name || 'Vighnaharta Suvarna Ganesha'}
                </h3>

                <p style={{ fontSize: 13, color: '#CBD5E1', maxWidth: 500, lineHeight: 1.5 }}>
                  Royal handcrafted sacred idol with divine crown, pitambar silks, and trishul blessing weapon.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, fontSize: 12, color: '#4ADE80', fontWeight: 700 }}>
                  <span>✓ Synced across Temple Run, 3D Runner & Leaderboards</span>
                </div>
              </div>
            </div>

            <Link
              href="/idol-shop"
              style={{
                padding: '14px 26px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #FFD700 0%, #FF671F 100%)',
                color: '#080B14',
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: 1,
                boxShadow: '0 0 25px rgba(255, 184, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                textTransform: 'uppercase'
              }}
            >
              <Palette size={18} fill="#080B14" />
              <span>CUSTOMIZE IN IDOL SHOP</span>
            </Link>
          </div>

          {/* Sanctum Designs Collection */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#FFFFFF' }}>
                YOUR SANCTUM CREATIONS ({savedDesigns.length || 3} IDOLS)
              </h4>
              <Link href="/idol-shop" style={{ fontSize: 12, color: '#FFE57F', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>+ CREATE NEW IDOL</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16
            }}>
              {savedDesigns.map(design => {
                const isSelected = activeAvatar?.id === design.id;

                return (
                  <div
                    key={design.id}
                    style={{
                      background: 'rgba(18, 24, 43, 0.85)',
                      border: isSelected ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 18,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 12,
                      boxShadow: isSelected ? '0 0 20px rgba(255, 215, 0, 0.3)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 70,
                        height: 70,
                        borderRadius: 14,
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isSelected ? (
                          <GaneshaIdolRenderer
                            config={design.config}
                            size="100%"
                            showPlatform={false}
                            animateIdle={false}
                            rotation={0}
                            tilt={0}
                            zoom={1.1}
                          />
                        ) : (
                          <GaneshaAvatar avatarId={design.id} size={56} showBorder={false} />
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>{design.name}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{design.config.crown.replace('_', ' ')}</div>
                        <div style={{ fontSize: 10, color: '#FFE57F', marginTop: 4 }}>
                          {new Date(design.createdAt || '2026-09-19').toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveGaneshaAvatar(design.id);
                        setActiveAvatar(design);
                        setProfile(getStoredProfile());
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: 10,
                        background: isSelected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        border: isSelected ? '1px solid #22C55E' : '1px solid rgba(255, 255, 255, 0.15)',
                        color: isSelected ? '#4ADE80' : '#FFFFFF',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isSelected ? '✓ ACTIVE AVATAR' : 'SET AS ACTIVE'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 9. TAB CONTENT: RUN HISTORY & MULTI-GAME LOGS */}
      {activeTab === 'history' && (
        <div style={{
          background: 'rgba(18, 24, 43, 0.85)',
          borderRadius: 20,
          padding: 24,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Header & Filter Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            marginBottom: 20
          }}>
            <div>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#FFD700' }}>
                Recent Expeditions & Run History
              </h4>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>
                Chronological mission logs across all 4 sacred games
              </span>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Filter size={12} /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Modes' },
                { id: 'temple_run', label: '❄️ Temple Run' },
                { id: 'runner', label: '🏃 3D Runner' },
                { id: 'hillclimb', label: '🏎️ Hill Climb' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setHistoryFilter(f.id as any)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: historyFilter === f.id ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: historyFilter === f.id ? '1px solid #FFB800' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: historyFilter === f.id ? '#FFD700' : '#94A3B8',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table View (Hidden on mobile < 680px) */}
          <div className="desktop-history-table" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid rgba(255, 255, 255, 0.12)', color: '#94A3B8' }}>
                  <th style={{ padding: '12px 14px' }}>RUN #</th>
                  <th style={{ padding: '12px 14px' }}>GAME EXPEDITION</th>
                  <th style={{ padding: '12px 14px' }}>SCORE</th>
                  <th style={{ padding: '12px 14px' }}>DISTANCE</th>
                  <th style={{ padding: '12px 14px' }}>MODAKS</th>
                  <th style={{ padding: '12px 14px' }}>VIGHNAS / STUNTS</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {displaySessions.map((s, idx) => {
                  const game = getGameLabel(s);
                  const runNumber = displaySessions.length - idx;

                  return (
                    <tr
                      key={s.id || idx}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '14px', fontWeight: 800, color: '#FFE57F' }}>
                        #{runNumber}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{game.icon}</span>
                          <div>
                            <div style={{
                              fontWeight: 800,
                              color: game.color,
                              fontSize: 13
                            }}>
                              {game.name}
                            </div>
                            <div style={{ fontSize: 10, color: '#94A3B8' }}>
                              {game.sub}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px', fontWeight: 800, color: '#FFD700' }}>
                        {(s.score || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px', color: '#38BDF8' }}>
                        {((s.distance || 0) / 1000).toFixed(2)} KM
                      </td>
                      <td style={{ padding: '14px', color: '#FFA500' }}>
                        {s.modaks_collected || 0} 🍬
                      </td>
                      <td style={{ padding: '14px', color: '#FF671F' }}>
                        {s.vighnas_destroyed || 0} Vighnas (x{s.max_combo || 1})
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
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View (Visible on mobile < 680px) */}
          <div className="mobile-history-cards" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
            {displaySessions.map((s, idx) => {
              const game = getGameLabel(s);
              const runNumber = displaySessions.length - idx;

              return (
                <div
                  key={s.id || idx}
                  style={{
                    background: 'rgba(11, 15, 28, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 14,
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{game.icon}</span>
                      <div>
                        <div style={{ fontWeight: 800, color: game.color, fontSize: 13 }}>{game.name}</div>
                        <div style={{ fontSize: 10, color: '#94A3B8' }}>{game.sub}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#FFE57F' }}>#{runNumber}</span>
                      <span style={{
                        fontSize: 10,
                        color: '#4ADE80',
                        background: 'rgba(34, 197, 94, 0.15)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontWeight: 700
                      }}>
                        Completed
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 6,
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '8px 6px',
                    borderRadius: 10,
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: 9, color: '#94A3B8' }}>SCORE</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#FFD700' }}>{(s.score || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: '#94A3B8' }}>DISTANCE</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#38BDF8' }}>{((s.distance || 0) / 1000).toFixed(1)}k</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: '#94A3B8' }}>MODAKS</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#FFA500' }}>{s.modaks_collected || 0} 🍬</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: '#94A3B8' }}>VIGHNAS</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#FF671F' }}>{s.vighnas_destroyed || 0}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 10. FESTIVAL PULSE REALTIME TELEMETRY BAR */}
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
            Realtime Community Telemetry Across 4 Games
          </span>
        </div>

        <div className="pulse-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>PLAYERS ONLINE</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>24 Live Devotees</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>ACTIVE EXPEDITIONS</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFB800' }}>56 Worldwide Runs</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>VIGHNAS SMASHED TODAY</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FF671F' }}>1,840 💥</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>MODAKS HARVESTED TODAY</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFA500' }}>11,420 🍬</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>TOP SACRED REALM</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#38BDF8' }}>❄️ Frozen Shadows</div>
          </div>
        </div>
      </div>

      {/* Embedded Responsive Media Queries for Mobile Screens */}
      <style jsx>{`
        @media (max-width: 680px) {
          .command-bar-actions {
            width: 100% !important;
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .command-bar-actions a {
            padding: 9px 12px !important;
            font-size: 11px !important;
            justify-content: center !important;
          }
          .command-bar-actions a:last-child {
            grid-column: span 2 !important;
          }
          .kpi-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .kpi-cards-grid > div {
            padding: 12px 14px !important;
            border-radius: 14px !important;
          }
          .desktop-history-table {
            display: none !important;
          }
          .mobile-history-cards {
            display: flex !important;
          }
          .pulse-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (min-width: 681px) {
          .desktop-history-table {
            display: block !important;
          }
          .mobile-history-cards {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
