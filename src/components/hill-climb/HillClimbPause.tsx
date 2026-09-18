'use client';

import React from 'react';
import { Play, RotateCcw, Wrench, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { hillClimbAudio } from '@/lib/hill-climb/hillClimbAudio';

interface HillClimbPauseProps {
  onResume: () => void;
  onRestart: () => void;
  onGarage: () => void;
  onBackToArcade: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function HillClimbPause({
  onResume,
  onRestart,
  onGarage,
  onBackToArcade,
  isMuted,
  onToggleMute
}: HillClimbPauseProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(8, 11, 20, 0.85)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: 20,
      animation: 'fadeIn 0.2s ease-out',
      userSelect: 'none'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #1A2238 0%, #0E1424 100%)',
        border: '2px solid rgba(255, 184, 0, 0.45)',
        borderRadius: 28,
        padding: '36px 40px',
        maxWidth: 440,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 184, 0, 0.2)',
        textAlign: 'center'
      }}>
        {/* Om / Icon Badge */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #FFD700 0%, #FF671F 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          marginBottom: 16,
          boxShadow: '0 0 20px rgba(255, 184, 0, 0.5)'
        }}>
          🕉️
        </div>

        <h2 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 30,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: 2,
          marginBottom: 6
        }}>
          GAME PAUSED
        </h2>
        <span style={{ fontSize: 13, color: '#94A3B8', marginBottom: 28 }}>
          Take a breath of divine calm before conquering the hills
        </span>

        {/* Buttons List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%'
        }}>
          {/* Resume */}
          <button
            onClick={() => {
              hillClimbAudio.playClick();
              onResume();
            }}
            style={{
              width: '100%',
              padding: '15px 24px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #FF671F 0%, #FFB800 100%)',
              color: '#080B14',
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 1.5,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 0 24px rgba(255, 184, 0, 0.5)',
              textTransform: 'uppercase'
            }}
          >
            <Play size={18} fill="#080B14" />
            <span>RESUME EXPEDITION</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            style={{
              width: '100%',
              padding: '13px 24px',
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFE57F',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{isMuted ? 'UNMUTE AUDIO' : 'MUTE AUDIO'}</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              hillClimbAudio.playClick();
              onRestart();
            }}
            style={{
              width: '100%',
              padding: '13px 24px',
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFE57F',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
            <RotateCcw size={18} />
            <span>RESTART LEVEL</span>
          </button>

          {/* Garage */}
          <button
            onClick={() => {
              hillClimbAudio.playClick();
              onGarage();
            }}
            style={{
              width: '100%',
              padding: '13px 24px',
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFE57F',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
            <Wrench size={18} />
            <span>GARAGE & UPGRADES</span>
          </button>

          {/* Return to Arcade */}
          <button
            onClick={() => {
              hillClimbAudio.playClick();
              onBackToArcade();
            }}
            style={{
              width: '100%',
              padding: '11px 24px',
              borderRadius: 16,
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <ArrowLeft size={16} />
            <span>ARCADE HUB</span>
          </button>
        </div>
      </div>
    </div>
  );
}
