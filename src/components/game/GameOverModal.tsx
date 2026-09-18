'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Trophy, BarChart2, Share2, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameStats } from '@/types/game';

interface GameOverModalProps {
  stats: GameStats;
  isVictory: boolean;
  onRunAgain: () => void;
}

export default function GameOverModal({
  stats,
  isVictory,
  onRunAgain
}: GameOverModalProps) {
  const isNewRecord = stats.score >= stats.highScore && stats.score > 0;

  useEffect(() => {
    if (isVictory || isNewRecord) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF671F', '#FFA500', '#FF6B8B', '#FFFFFF']
      });
    }
  }, [isVictory, isNewRecord]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(8, 11, 20, 0.88)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 40,
      padding: 20
    }}>
      <div className="glass-card-gold" style={{
        maxWidth: 480,
        width: '100%',
        padding: '36px 28px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        animation: 'floatSlow 6s ease-in-out infinite'
      }}>
        {/* Emblem */}
        <div style={{
          fontSize: '3.2rem',
          filter: (isVictory || isNewRecord) ? 'drop-shadow(0 0 25px #FFD700)' : 'none'
        }}>
          {isVictory ? '👑' : (isNewRecord ? '🏆' : '🙏')}
        </div>

        {/* Title */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            fontWeight: 800,
            letterSpacing: '1px',
            color: isVictory ? 'var(--gold-divine)' : (isNewRecord ? 'var(--gold-light)' : 'var(--text-cream)')
          }}>
            {isVictory ? 'VIGHNAHARTA COMPLETE' : (isNewRecord ? 'NEW HIGH SCORE!' : 'YOUR JOURNEY PAUSES HERE')}
          </h2>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginTop: 4,
            fontStyle: 'italic'
          }}>
            {isVictory
              ? '“Every obstacle can become a step forward.”'
              : (isNewRecord ? 'Incredible run! You set a brand new personal best.' : 'Every run brings Lord Ganesha closer to the 108 Vighnas.')}
          </p>
        </div>

        {/* Highlight Score Pill */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.15) 0%, rgba(255, 103, 31, 0.2) 100%)',
          border: isNewRecord ? '2px solid var(--gold-divine)' : '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 24px',
          width: '100%',
          boxShadow: isNewRecord ? '0 0 25px rgba(255, 184, 0, 0.4)' : 'none'
        }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {isNewRecord ? '🌟 NEW PERSONAL BEST 🌟' : 'Final Score'}
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.4rem',
            fontWeight: 900,
            color: 'var(--gold-light)',
            textShadow: '0 0 16px rgba(255, 184, 0, 0.5)'
          }}>
            {stats.score.toLocaleString()}
          </div>
          {!isNewRecord && stats.highScore > 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
              Personal Best: <strong style={{ color: 'var(--gold-primary)' }}>{stats.highScore.toLocaleString()}</strong>
            </div>
          )}
        </div>

        {/* Performance Breakdown Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          width: '100%'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Vighnas Removed</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
              {stats.vighnasDestroyed} / 108
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Distance</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
              {(stats.distance / 1000).toFixed(2)} KM
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Modaks Collected</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--marigold)' }}>
              {stats.modaksCollected} 🍬
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Best Combo</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--saffron)' }}>
              x{stats.maxCombo}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: '100%',
          marginTop: 6
        }}>
          <button
            onClick={onRunAgain}
            className="btn-primary"
            style={{ width: '100%', padding: '14px 20px' }}
          >
            <RotateCcw size={18} />
            <span>RUN AGAIN</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <Link
              href="/results"
              className="btn-secondary"
              style={{ padding: '10px 14px', fontSize: '0.85rem' }}
            >
              <Share2 size={16} />
              <span>SHARE CARD</span>
            </Link>

            <Link
              href="/leaderboard"
              className="btn-secondary"
              style={{ padding: '10px 14px', fontSize: '0.85rem' }}
            >
              <Trophy size={16} />
              <span>LEADERBOARD</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
