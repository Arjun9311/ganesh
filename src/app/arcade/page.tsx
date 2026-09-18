'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Sparkles, Trophy, Zap, Shield, Compass, Flame, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function ArcadePage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 10%, #1A1838 0%, #0B0F1C 60%, #05070D 100%)',
      color: '#FFF7ED',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />

      <main style={{
        maxWidth: 1280,
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(24px, 4vw, 40px) clamp(14px, 3vw, 24px) 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header Hero */}
        <div style={{ textAlign: 'center', marginBottom: 36, maxWidth: 780 }}>
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
            fontSize: 'clamp(26px, 5.5vw, 44px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFD700 50%, #FF884D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 1.5,
            marginBottom: 14,
            lineHeight: 1.2
          }}>
            SACRED EXPEDITIONS OF GANESHA
          </h1>

          <p style={{
            fontSize: 'clamp(13px, 2.5vw, 16px)',
            color: '#94A3B8',
            lineHeight: 1.6
          }}>
            Experience multiple unique gameplay experiences honoring Lord Ganesha. Race across perilous mountain peaks or sprint through sacred temple streets with high-end visuals and authentic physics.
          </p>
        </div>

        {/* 2 Featured Games Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 'clamp(20px, 3vw, 32px)',
          width: '100%',
          maxWidth: 1100
        }}>
          {/* GAME 1: GANESHA HILL CLIMB RACING */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(26, 34, 56, 0.95) 0%, rgba(14, 20, 36, 0.95) 100%)',
            border: '2px solid rgba(255, 184, 0, 0.5)',
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 184, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.25s, box-shadow 0.25s',
            position: 'relative'
          }}>
            {/* New Flag */}
            <div style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'linear-gradient(90deg, #FF671F, #E11D48)',
              color: '#FFF',
              fontSize: 11,
              fontWeight: 900,
              padding: '4px 12px',
              borderRadius: 8,
              letterSpacing: 1.2,
              zIndex: 10,
              boxShadow: '0 0 16px rgba(225, 29, 72, 0.6)'
            }}>
              NEW GAME!
            </div>

            {/* Visual Banner */}
            <div style={{
              height: 200,
              background: 'linear-gradient(135deg, #1E1B4B 0%, #0369A1 50%, #15803D 100%)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Sun & Mountain silhouettes */}
              <div style={{
                position: 'absolute',
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #FDE047 0%, #EA580C 100%)',
                top: 20,
                right: 50,
                boxShadow: '0 0 35px #FDE047'
              }} />

              {/* Chariot Icon Showcase */}
              <div style={{
                fontSize: 64,
                zIndex: 2,
                transform: 'rotate(-8deg) scale(1.1)',
                filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.7))'
              }}>
                🏎️💨
              </div>

              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 20,
                background: 'rgba(8, 11, 20, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: 12,
                fontWeight: 800,
                color: '#FFE57F'
              }}>
                PHYSICS 2D HILL CLIMB RACER
              </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#FF884D' }}>हिल क्लाइम्ब रेसिंग</span>
              </div>
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 24,
                fontWeight: 900,
                color: '#FFFFFF',
                marginBottom: 10
              }}>
                GANESHA HILL CLIMB RACING
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>
                Drive sacred divine chariots across hazardous peaks! Manage Amrit fuel, perform mid-air backflips, balance suspension, and upgrade engine power in the workshop.
              </p>

              {/* Feature Highlights */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 10,
                marginBottom: 24
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 12px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#CBD5E1'
                }}>
                  <Zap size={15} color="#FFD700" />
                  <span>4 Upgradable Vehicles</span>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 12px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#CBD5E1'
                }}>
                  <Compass size={15} color="#38BDF8" />
                  <span>4 Sacred Mountains</span>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 12px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#CBD5E1'
                }}>
                  <Shield size={15} color="#22C55E" />
                  <span>Spring-Damper Physics</span>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 12px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#CBD5E1'
                }}>
                  <Flame size={15} color="#FF671F" />
                  <span>Flips & Stunt Rewards</span>
                </div>
              </div>

              {/* Play Button */}
              <Link
                href="/hill-climb"
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #FF671F 0%, #FFB800 100%)',
                  color: '#080B14',
                  fontWeight: 900,
                  fontSize: 16,
                  letterSpacing: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  textDecoration: 'none',
                  boxShadow: '0 0 25px rgba(255, 184, 0, 0.6)',
                  textTransform: 'uppercase'
                }}
              >
                <Play size={18} fill="#080B14" />
                <span>PLAY HILL CLIMB RACING</span>
              </Link>
            </div>
          </div>

          {/* GAME 2: VIGHNAHARTA 3D RUNNER */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(26, 34, 56, 0.95) 0%, rgba(14, 20, 36, 0.95) 100%)',
            border: '2px solid rgba(255, 184, 0, 0.3)',
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.25s, box-shadow 0.25s',
            position: 'relative'
          }}>
            {/* Visual Banner */}
            <div style={{
              height: 200,
              background: 'linear-gradient(135deg, #451A03 0%, #78350F 50%, #B45309 100%)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Diya Glow */}
              <div style={{
                position: 'absolute',
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
                boxShadow: '0 0 50px rgba(255, 184, 0, 0.6)'
              }} />

              {/* Runner Icon Showcase */}
              <div style={{
                fontSize: 64,
                zIndex: 2,
                transform: 'scale(1.1)',
                filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.7))'
              }}>
                🏃‍♂️🪔
              </div>

              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 20,
                background: 'rgba(8, 11, 20, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: 12,
                fontWeight: 800,
                color: '#FFE57F'
              }}>
                3D SUBWAY SURFERS STYLE RUNNER
              </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#FF884D' }}>विघ्नहर्ता 3D धावक</span>
              </div>
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 24,
                fontWeight: 900,
                color: '#FFFFFF',
                marginBottom: 10
              }}>
                VIGHNAHARTA 3D ENDLESS RUNNER
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>
                Dash through 3 lanes of divine temple avenues, dodge obstacles, smash 108 Vighnas, harvest golden modaks, activate Trishul Blasts, and ride the Mushika Hoverboard.
              </p>

              {/* Feature Highlights */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 10,
                marginBottom: 24
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 12px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#CBD5E1'
                }}>
                  <Compass size={15} color="#38BDF8" />
                  <span>4 Photorealistic Worlds</span>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 12px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#CBD5E1'
                }}>
                  <Zap size={15} color="#FFD700" />
                  <span>Trishul & Divine Shield</span>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 12px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#CBD5E1'
                }}>
                  <Shield size={15} color="#22C55E" />
                  <span>Distraction-Free HUD</span>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 12px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#CBD5E1'
                }}>
                  <Trophy size={15} color="#FF884D" />
                  <span>108 Vighnas Counter</span>
                </div>
              </div>

              {/* Play Button */}
              <Link
                href="/game"
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
                  color: '#080B14',
                  fontWeight: 900,
                  fontSize: 16,
                  letterSpacing: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  textDecoration: 'none',
                  boxShadow: '0 0 25px rgba(255, 184, 0, 0.4)',
                  textTransform: 'uppercase'
                }}
              >
                <Play size={18} fill="#080B14" />
                <span>PLAY 3D RUNNER</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
