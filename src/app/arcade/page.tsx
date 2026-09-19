'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  Sparkles,
  Trophy,
  Zap,
  Shield,
  Compass,
  Flame,
  ArrowRight,
  Palette,
  Heart,
  Snowflake,
  Filter,
  BarChart3
} from 'lucide-react';

type GameCategory = 'all' | 'runners' | 'racing' | 'artisan';

interface ArcadeGame {
  id: string;
  category: 'runners' | 'racing' | 'artisan';
  title: string;
  hindiTitle: string;
  tagline: string;
  genre: string;
  difficulty: string;
  controls: string;
  description: string;
  href: string;
  dashboardTab: string;
  bannerGradient: string;
  cardBorder: string;
  badgeBg: string;
  badgeColor: string;
  badgeText: string;
  icons: string;
  features: { icon: any; text: string; color: string }[];
  ctaText: string;
  ctaGradient: string;
  shadowColor: string;
}

const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: 'temple-run',
    category: 'runners',
    title: 'Vighnaharta Temple Run',
    hindiTitle: 'विघ्नहर्ता मंदिर यात्रा • फ्रोजन शैडोज़',
    tagline: '“RUN THROUGH THE SACRED PATH. REMOVE EVERY VIGHNA.”',
    genre: '3D ENDLESS RUNNER • 90° CORNER TURNS',
    difficulty: '⭐⭐⭐ Reflex & Turning',
    controls: 'A/D or ◄/► to Turn • ▲ Jump • ▼ Slide',
    description: 'Sprint through glacial temple corridors, ancient torana arches, and icicle caverns. Master sharp 90-degree corner turns with glowing arrows, leap over snow hurdles, slide beneath brass bells, smash destructible frost monoliths, and journey through 108 Vighnas!',
    href: '/temple-run',
    dashboardTab: '/dashboard',
    bannerGradient: 'linear-gradient(135deg, #071126 0%, #0369A1 50%, #0284C7 100%)',
    cardBorder: '2px solid #38BDF8',
    badgeBg: 'linear-gradient(90deg, #0284C7, #06B6D4)',
    badgeColor: '#FFFFFF',
    badgeText: '❄️ TEMPLE RUN 2 - FROZEN',
    icons: '❄️🏛️⚡',
    features: [
      { icon: Zap, text: '90° Sharp Corner Turns', color: '#38BDF8' },
      { icon: Snowflake, text: 'Glacial Snow & Icicles', color: '#BAE6FD' },
      { icon: Flame, text: '108 Vighnas Destroy System', color: '#FF884D' },
      { icon: Sparkles, text: 'Mushika Pet Companion', color: '#FFD700' }
    ],
    ctaText: 'PLAY TEMPLE RUN: FROZEN',
    ctaGradient: 'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)',
    shadowColor: 'rgba(6, 182, 212, 0.45)'
  },
  {
    id: 'runner-3d',
    category: 'runners',
    title: 'Vighnaharta 3D Runner',
    hindiTitle: 'विघ्नहर्ता 3D धावक • उत्सव पथ',
    tagline: '“SMASH THE VIGHNAS. HARVEST THE SACRED MODAKS.”',
    genre: '3D 3-LANE RUNNER • SUBWAY SURFERS STYLE',
    difficulty: '⭐⭐ Fast-Paced Action',
    controls: 'A/D or ◄/► Switch Lanes • Space: Gada Smash • S: Slide',
    description: 'Don\'t just dodge obstacles — smash them to pieces with divine Gada strikes! Dash through lively Indian festival streets, surf train rooftops with the Mushika Hoverboard, collect sweet modaks, and activate Trishul Blasts.',
    href: '/game',
    dashboardTab: '/dashboard',
    bannerGradient: 'linear-gradient(135deg, #451A03 0%, #78350F 50%, #B45309 100%)',
    cardBorder: '2px solid rgba(255, 184, 0, 0.5)',
    badgeBg: 'linear-gradient(90deg, #FF671F, #FFB800)',
    badgeColor: '#080B14',
    badgeText: '🏃 3D FESTIVAL RUNNER',
    icons: '🏃‍♂️🪔⚡',
    features: [
      { icon: Compass, text: '4 Vibrant Festival Worlds', color: '#38BDF8' },
      { icon: Zap, text: 'Trishul Blast & Divine Shield', color: '#FFD700' },
      { icon: Flame, text: 'Gada Strike Destructibles', color: '#FF671F' },
      { icon: Trophy, text: 'Combos & Multipliers', color: '#4ADE80' }
    ],
    ctaText: 'PLAY 3D FESTIVAL RUNNER',
    ctaGradient: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
    shadowColor: 'rgba(255, 184, 0, 0.45)'
  },
  {
    id: 'hill-climb',
    category: 'racing',
    title: 'Ganesha Hill Climb Racing',
    hindiTitle: 'गणेश हिल क्लाइम्ब • चार दिव्य रथ',
    tagline: '“CONQUER MOUNT KAILASH WITH DIVINE CHARIOT PHYSICS.”',
    genre: '2D PHYSICS MOUNTAIN DRIVING • UPGRADES',
    difficulty: '⭐⭐ Balance & Throttle Control',
    controls: 'D or ► Gas • A or ◄ Brake • Space: Divine Boost',
    description: 'Pilot 4 upgradable sacred chariots across hazardous mountain peaks! Balance spring-damper suspensions, manage Amrit fuel economy, perform mid-air backflips for coin bonuses, and tune engines, tires, and tanks in the divine workshop.',
    href: '/hill-climb',
    dashboardTab: '/dashboard',
    bannerGradient: 'linear-gradient(135deg, #1E1B4B 0%, #0369A1 50%, #15803D 100%)',
    cardBorder: '2px solid rgba(244, 63, 94, 0.5)',
    badgeBg: 'linear-gradient(90deg, #E11D48, #F59E0B)',
    badgeColor: '#FFFFFF',
    badgeText: '🏎️ PHYSICS RACER',
    icons: '🏎️🏔️💨',
    features: [
      { icon: Zap, text: '4 Upgradable Divine Chariots', color: '#FFD700' },
      { icon: Compass, text: '4 Sacred Mountain Stages', color: '#38BDF8' },
      { icon: Shield, text: 'Spring-Damper Physics', color: '#4ADE80' },
      { icon: Flame, text: 'Flips & Stunt Rewards', color: '#F43F5E' }
    ],
    ctaText: 'PLAY HILL CLIMB RACING',
    ctaGradient: 'linear-gradient(135deg, #E11D48 0%, #F59E0B 100%)',
    shadowColor: 'rgba(225, 29, 72, 0.45)'
  },
  {
    id: 'idol-shop',
    category: 'artisan',
    title: 'Ganesh Idol Shop & Studio',
    hindiTitle: 'गणेश मूर्ति शिल्पकला • पवित्र गर्भगृह',
    tagline: '“HANDCRAFT YOUR SACRED DEITY AND EMBARK ON EXPEDITIONS.”',
    genre: '3D ARTISAN STUDIO • AVATAR CUSTOMIZER',
    difficulty: '⭐ Creative & Relaxing',
    controls: 'Mouse / Touch: Rotate 3D Stage • Select Parts',
    description: 'Design and customize Lord Ganesha idols using traditional Indian temple arts! Select face expressions, lotus eyes, trunks, ratna mukuts, pitambar silks, marigold malas, cosmic auras, and set your unique creation as your global player avatar.',
    href: '/idol-shop',
    dashboardTab: '/dashboard',
    bannerGradient: 'linear-gradient(135deg, #2A1747 0%, #4A1D6D 50%, #C2410C 100%)',
    cardBorder: '2px solid rgba(168, 85, 247, 0.5)',
    badgeBg: 'linear-gradient(90deg, #7C3AED, #EC4899)',
    badgeColor: '#FFFFFF',
    badgeText: '🎨 ARTISAN STUDIO',
    icons: '🐘🎨✨',
    features: [
      { icon: Palette, text: '12 Customization Categories', color: '#FFD700' },
      { icon: Sparkles, text: '3D Rotate & Stage Lighting', color: '#38BDF8' },
      { icon: Heart, text: 'Sync as Active Player Avatar', color: '#EC4899' },
      { icon: Trophy, text: '108 Vighnas Unlock Tier', color: '#4ADE80' }
    ],
    ctaText: 'ENTER GANESH IDOL SHOP',
    ctaGradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
    shadowColor: 'rgba(124, 58, 237, 0.45)'
  }
];

export default function ArcadePage() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');

  const filteredGames = ARCADE_GAMES.filter(g => {
    if (selectedCategory === 'all') return true;
    return g.category === selectedCategory;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 10%, #1A1838 0%, #0B0F1C 60%, #05070D 100%)',
      color: '#FFF7ED',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <main style={{
        maxWidth: 1320,
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(24px, 4vw, 40px) clamp(14px, 3vw, 24px) 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32, maxWidth: 840 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            borderRadius: 9999,
            background: 'rgba(255, 184, 0, 0.12)',
            border: '1px solid rgba(255, 215, 0, 0.35)',
            color: '#FFD700',
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            fontWeight: 800,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 14
          }}>
            <Sparkles size={14} />
            DIVINE MULTI-GAME ARCADE • दिव्य क्रीड़ा संकुल
          </div>

          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(26px, 5.5vw, 46px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFD700 50%, #FF884D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 1.5,
            marginBottom: 14,
            lineHeight: 1.2
          }}>
            THE 4 SACRED EXPEDITIONS OF GANESHA
          </h1>

          <p style={{
            fontSize: 'clamp(13px, 2.5vw, 16px)',
            color: '#94A3B8',
            lineHeight: 1.6,
            maxWidth: 720,
            margin: '0 auto'
          }}>
            Explore 4 distinct, fully-featured games honoring Lord Ganesha. Sprint through frozen temple ruins, dash across festive avenues, climb hazardous peaks, or sculpt your own customized deity.
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 36,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { id: 'all', label: '🌟 ALL EXPEDITIONS (4)' },
            { id: 'runners', label: '🏃 3D ENDLESS RUNNERS (2)' },
            { id: 'racing', label: '🏎️ PHYSICS RACING (1)' },
            { id: 'artisan', label: '🎨 ARTISAN STUDIO (1)' }
          ].map(cat => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as GameCategory)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 14,
                  background: isSelected
                    ? 'linear-gradient(135deg, #FF671F, #FFB800)'
                    : 'rgba(18, 24, 43, 0.7)',
                  color: isSelected ? '#080B14' : '#FFE57F',
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: 0.8,
                  border: isSelected ? 'none' : '1px solid rgba(255, 184, 0, 0.2)',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 20px rgba(255, 184, 0, 0.45)' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4 Games Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))',
          gap: 28,
          width: '100%'
        }}>
          {filteredGames.map((game, idx) => (
            <div
              key={game.id}
              style={{
                background: 'linear-gradient(180deg, rgba(20, 26, 46, 0.95) 0%, rgba(12, 16, 30, 0.98) 100%)',
                border: game.cardBorder,
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px ${game.shadowColor}`,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {/* Badge Tag */}
              <div style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: game.badgeBg,
                color: game.badgeColor,
                fontSize: 11,
                fontWeight: 900,
                padding: '5px 14px',
                borderRadius: 8,
                letterSpacing: 1,
                zIndex: 10,
                boxShadow: `0 0 16px ${game.shadowColor}`
              }}>
                {game.badgeText}
              </div>

              {/* Visual Banner Header */}
              <div style={{
                height: 190,
                background: game.bannerGradient,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  width: 170,
                  height: 170,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 215, 0, 0.45) 0%, transparent 70%)',
                  boxShadow: `0 0 50px ${game.shadowColor}`
                }} />

                <div style={{
                  fontSize: 64,
                  zIndex: 2,
                  filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.7))',
                  animation: 'floatSlow 3s ease-in-out infinite'
                }}>
                  {game.icons}
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 18,
                  background: 'rgba(8, 11, 20, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#FFE57F'
                }}>
                  {game.genre}
                </div>
              </div>

              {/* Content Body */}
              <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#FF884D' }}>{game.hindiTitle}</span>
                  <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>{game.difficulty}</span>
                </div>

                <h3 style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 24,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  marginBottom: 6
                }}>
                  {game.title}
                </h3>

                <p style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#FFD700',
                  letterSpacing: 0.8,
                  marginBottom: 10
                }}>
                  {game.tagline}
                </p>

                <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, marginBottom: 18 }}>
                  {game.description}
                </p>

                {/* Controls Snippet */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  marginBottom: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  color: '#CBD5E1'
                }}>
                  <span style={{ color: '#FFB800', fontWeight: 800 }}>🕹️ CONTROLS:</span>
                  <span>{game.controls}</span>
                </div>

                {/* Features Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 10,
                  marginBottom: 24
                }}>
                  {game.features.map((f, fIdx) => {
                    const IconComponent = f.icon;
                    return (
                      <div
                        key={fIdx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '8px 12px',
                          borderRadius: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#FFE57F'
                        }}
                      >
                        <IconComponent size={14} color={f.color} />
                        <span>{f.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Button Action Group */}
                <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                  <Link
                    href={game.href}
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      borderRadius: 14,
                      background: game.ctaGradient,
                      color: game.id === 'runner-3d' || game.id === 'temple-run' ? (game.id === 'runner-3d' ? '#080B14' : '#FFFFFF') : '#FFFFFF',
                      fontWeight: 900,
                      fontSize: 14,
                      letterSpacing: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      textDecoration: 'none',
                      boxShadow: `0 0 25px ${game.shadowColor}`,
                      textTransform: 'uppercase'
                    }}
                  >
                    <Play size={16} fill="currentColor" />
                    <span>{game.ctaText}</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    title="View telemetry & stats in Devotee Dashboard"
                    style={{
                      padding: '14px 16px',
                      borderRadius: 14,
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFD700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <BarChart3 size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
