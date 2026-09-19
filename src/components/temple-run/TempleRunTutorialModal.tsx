'use client';

import React from 'react';
import { X, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sparkles, Check } from 'lucide-react';

interface TempleRunTutorialModalProps {
  onClose: () => void;
}

export default function TempleRunTutorialModal({ onClose }: TempleRunTutorialModalProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(8, 11, 20, 0.94)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      zIndex: 90,
      userSelect: 'none'
    }}>
      <div style={{
        maxWidth: 560,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'linear-gradient(180deg, rgba(30, 26, 62, 0.98) 0%, rgba(16, 18, 40, 0.98) 100%)',
        border: '2px solid #FFD700',
        borderRadius: 28,
        padding: 'clamp(20px, 4vw, 32px)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 184, 0, 0.3)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 184, 0, 0.3)',
            borderRadius: 12,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFE57F',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 36 }}>📜</div>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 24,
            fontWeight: 900,
            color: '#FFFFFF',
            marginTop: 4
          }}>
            HOW TO PLAY & CONTROLS
          </h2>
          <p style={{ fontSize: 13, color: '#FFB800', marginTop: 4 }}>
            Master the sacred temple path & reach 108 Vighnas
          </p>
        </div>

        {/* Tutorial Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 1. Corner Turns (Signature mechanic) */}
          <div style={{
            padding: 14,
            borderRadius: 16,
            background: 'rgba(255, 184, 0, 0.12)',
            border: '1.5px solid #FFD700',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14
          }}>
            <div style={{ fontSize: 32 }}>🔄</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#FFE57F' }}>
                90° CORNER TURNS (Crucial!)
              </div>
              <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.5, marginTop: 2 }}>
                When approaching a 90° corner, look for the floating golden arrow. Press <strong>A / D</strong> (or <strong>Swipe Left/Right</strong>) within the turn zone to pivot Ganesha onto the new path!
              </p>
            </div>
          </div>

          {/* 2. Lane Navigation */}
          <div style={{
            padding: 14,
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14
          }}>
            <div style={{ fontSize: 32 }}>↔️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>
                3-LANE MOVEMENT
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5, marginTop: 2 }}>
                Use <strong>A / D</strong>, <strong>Left/Right Arrows</strong>, or <strong>Swipe Left/Right</strong> to switch lanes and dodge stone pillars.
              </p>
            </div>
          </div>

          {/* 3. Jump & Slide */}
          <div style={{
            padding: 14,
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14
          }}>
            <div style={{ fontSize: 32 }}>⬆️⬇️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>
                JUMP & SLIDE
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5, marginTop: 2 }}>
                <strong>W / Space / Swipe Up</strong> to leap over barriers and water gaps. <strong>S / Swipe Down</strong> to slide under sacred temple bells.
              </p>
            </div>
          </div>

          {/* 4. Destructible Vighnas */}
          <div style={{
            padding: 14,
            borderRadius: 16,
            background: 'rgba(255, 103, 31, 0.12)',
            border: '1.5px solid rgba(255, 103, 31, 0.4)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14
          }}>
            <div style={{ fontSize: 32 }}>💥</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#FF884D' }}>
                SMASH VIGHNAS (0 TO 108)
              </div>
              <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.5, marginTop: 2 }}>
                Smash dark crystalline Vighnas! In Divine Mode or with Vighna Hammer, you obliterate them into golden fireworks to earn <strong>+100 VIGHNA REMOVED</strong>. Reach 108 to complete the journey!
              </p>
            </div>
          </div>

          {/* 5. Golden Modak & Divine Mode */}
          <div style={{
            padding: 14,
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14
          }}>
            <div style={{ fontSize: 32 }}>✨</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>
                GOLDEN MODAK & DIVINE MODE
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5, marginTop: 2 }}>
                Collect Golden Modaks to activate 10 seconds of Divine Mode: golden invulnerability, 2X score multiplier, and auto-destroying all Vighnas!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
            color: '#080B14',
            fontFamily: "'Cinzel', serif",
            fontSize: 16,
            fontWeight: 900,
            cursor: 'pointer',
            marginTop: 20
          }}
        >
          I UNDERSTAND — LET&apos;S RUN!
        </button>
      </div>
    </div>
  );
}
