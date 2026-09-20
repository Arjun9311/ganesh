'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Share2, Copy, Check, RotateCcw, Trophy, Sparkles, ArrowUpRight } from 'lucide-react';
import { getStoredProfile, getStoredGameSessions, getStoredPlayerStats } from '@/lib/storage';
import { GameSession, Profile, PlayerStats } from '@/types/database';
import GaneshaAvatar from '@/components/idol-shop/GaneshaAvatar';

export default function ResultsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastSession, setLastSession] = useState<GameSession | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setProfile(getStoredProfile());
    const sessions = getStoredGameSessions();
    if (sessions.length > 0) {
      setLastSession(sessions[0]);
    }
    setStats(getStoredPlayerStats());
  }, []);

  const score = lastSession?.score ?? 0;
  const vighnas = lastSession?.vighnas_destroyed ?? 0;
  const distance = lastSession?.distance ?? 0;
  const modaks = lastSession?.modaks_collected ?? 0;
  const combo = lastSession?.max_combo ?? 0;
  const username = profile?.username || 'Sidharth';
  const isPersonalBest = Boolean(lastSession && stats?.best_score && lastSession.score >= stats.best_score);

  const getRunAgainHref = () => {
    if (lastSession?.game_mode === 'temple_run') return '/temple-run';
    if (lastSession?.game_mode === 'hillclimb') return '/hill-climb';
    return '/game';
  };

  const shareText = `🐘 VIGHNAHARTA RUN — THE 108 VIGHNAS\n\nRunner: ${username}\nScore: ${score.toLocaleString()}\nVighnas Removed: ${vighnas} / 108\nDistance: ${(distance / 1000).toFixed(2)} KM\nBest Combo: x${combo}\n\nDon't avoid obstacles. Remove them! 🙏`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vighnaharta Run — My Score',
          text: shareText,
          url: window.location.origin
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div style={{
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(circle at 50% 30%, rgba(255, 184, 0, 0.12) 0%, rgba(8, 11, 20, 0.98) 75%)'
    }}>
      <div style={{
        maxWidth: 520,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24
      }}>
        {/* Shareable Card Canvas */}
        <div id="share-card" className="glass-card-gold" style={{
          width: '100%',
          padding: '36px 30px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          background: 'linear-gradient(135deg, rgba(20, 26, 46, 0.95) 0%, rgba(10, 14, 26, 0.98) 100%)',
          border: '2px solid var(--gold-primary)',
          boxShadow: '0 0 35px rgba(255, 184, 0, 0.3)'
        }}>
          <GaneshaAvatar avatarId={profile?.avatar} size={72} showBorder={true} />

          <div>
            <div style={{
              fontSize: '0.78rem',
              color: 'var(--gold-primary)',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              Vighnaharta Run • Score Certificate
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 4
            }}>
              {username}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              City: 📍 {profile?.city || 'Mumbai'}
            </div>
          </div>

          {/* Score Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.15) 0%, rgba(255, 103, 31, 0.2) 100%)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 24px',
            width: '100%'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Final Run Score
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.8rem',
              fontWeight: 900,
              color: 'var(--gold-light)',
              textShadow: '0 0 20px rgba(255, 184, 0, 0.6)'
            }}>
              {score.toLocaleString()}
            </div>
            {isPersonalBest ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.78rem',
                color: '#10B981',
                fontWeight: 700,
                marginTop: 4
              }}>
                <ArrowUpRight size={16} />
                <span>NEW PERSONAL BEST!</span>
              </div>
            ) : (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Personal Best: <strong style={{ color: 'var(--gold-primary)' }}>{(stats?.best_score ?? 0).toLocaleString()}</strong>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            width: '100%'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Vighnas Removed</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                {vighnas} / 108
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Distance Traveled</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                {(distance / 1000).toFixed(2)} KM
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Modaks Gathered</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--marigold)' }}>
                {modaks} 🍬
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Highest Combo</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--saffron)' }}>
                x{combo}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            fontStyle: 'italic',
            marginTop: 4
          }}>
            “Every obstacle can become a step forward.” 🙏
          </div>
        </div>

        {/* Sharing Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: '100%'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <button
              onClick={handleCopy}
              className="btn-primary"
              style={{ padding: '14px 18px', fontSize: '0.9rem' }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? 'COPIED TO CLIPBOARD!' : 'COPY SCORE'}</span>
            </button>

            <button
              onClick={handleShare}
              className="btn-secondary"
              style={{ padding: '14px 18px', fontSize: '0.9rem' }}
            >
              <Share2 size={18} />
              <span>SHARE RUN</span>
            </button>
          </div>

          <Link
            href={getRunAgainHref()}
            className="btn-secondary"
            style={{
              padding: '14px 20px',
              width: '100%',
              justifyContent: 'center',
              border: '1px solid var(--border-gold)'
            }}
          >
            <RotateCcw size={18} />
            <span>RUN AGAIN</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
