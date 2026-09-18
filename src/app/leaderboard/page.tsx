'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Flame, Play, Sparkles, MapPin, Search } from 'lucide-react';
import { getLiveLeaderboard } from '@/lib/storage';
import { LeaderboardEntry } from '@/types/database';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<'ALL_TIME' | 'TODAY'>('ALL_TIME');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getLiveLeaderboard().then(setLeaderboard);

    // Dynamic leaderboard live pulse simulation
    const interval = setInterval(() => {
      setLeaderboard(prev => {
        if (prev.length < 2) return prev;
        // Minor dynamic score bump to simulate active runs
        const randomIdx = Math.floor(Math.random() * (prev.length - 1)) + 1;
        const updated = [...prev];
        if (!updated[randomIdx].isCurrentUser) {
          updated[randomIdx] = {
            ...updated[randomIdx],
            score: updated[randomIdx].score + Math.floor(Math.random() * 50) + 10
          };
          updated.sort((a, b) => b.score - a.score);
          return updated.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const filteredBoard = leaderboard.filter(entry =>
    entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = leaderboard.slice(0, 3);

  return (
    <div style={{
      maxWidth: 1100,
      margin: '0 auto',
      padding: '40px 24px 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 6
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10B981',
              color: '#10B981',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              LIVE
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              17 PLAYERS ONLINE
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.4rem',
            fontWeight: 900,
            color: 'var(--text-white)'
          }}>
            VIGHNAHARTA LEADERBOARD
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            Compete with devotees across Indian festival cities for the highest blessings.
          </p>
        </div>

        <Link href="/game" className="btn-primary" style={{ padding: '12px 28px' }}>
          <Play size={18} fill="#080B14" />
          <span>JOIN THE RUN</span>
        </Link>
      </div>

      {/* TOP 3 PODIUM CARDS */}
      {top3.length >= 3 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20
        }}>
          {/* 2nd Place */}
          <div className="glass-panel" style={{
            padding: '24px 20px',
            textAlign: 'center',
            border: '1.5px solid #C0C0C0',
            order: 2
          }}>
            <div style={{ fontSize: '2.2rem' }}>🥈</div>
            <div style={{ fontSize: '0.75rem', color: '#C0C0C0', fontWeight: 800, marginTop: 4 }}>2ND PLACE</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
              {top3[1].username}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>📍 {top3[1].city}</div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              fontWeight: 900,
              color: 'var(--gold-light)',
              marginTop: 10
            }}>
              {top3[1].score.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--saffron)' }}>
              {top3[1].vighnas_destroyed} Vighnas Removed
            </div>
          </div>

          {/* 1st Place (Champion) */}
          <div className="glass-card-gold" style={{
            padding: '30px 20px',
            textAlign: 'center',
            border: '2px solid var(--gold-divine)',
            boxShadow: 'var(--shadow-divine)',
            transform: 'scale(1.04)',
            order: 1
          }}>
            <div style={{ fontSize: '2.8rem', animation: 'floatSlow 3s infinite' }}>👑</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gold-divine)', fontWeight: 900, letterSpacing: '1px', marginTop: 4 }}>
              CHAMPION • 1ST PLACE
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', marginTop: 4 }}>
              {top3[0].username}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)' }}>📍 {top3[0].city}</div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.2rem',
              fontWeight: 900,
              color: 'var(--gold-divine)',
              marginTop: 10,
              textShadow: '0 0 15px rgba(255, 215, 0, 0.6)'
            }}>
              {top3[0].score.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700 }}>
              {top3[0].vighnas_destroyed} / 108 Vighnas Destroyed
            </div>
          </div>

          {/* 3rd Place */}
          <div className="glass-panel" style={{
            padding: '24px 20px',
            textAlign: 'center',
            border: '1.5px solid #CD7F32',
            order: 3
          }}>
            <div style={{ fontSize: '2.2rem' }}>🥉</div>
            <div style={{ fontSize: '0.75rem', color: '#CD7F32', fontWeight: 800, marginTop: 4 }}>3RD PLACE</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
              {top3[2].username}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>📍 {top3[2].city}</div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              fontWeight: 900,
              color: 'var(--gold-light)',
              marginTop: 10
            }}>
              {top3[2].score.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--saffron)' }}>
              {top3[2].vighnas_destroyed} Vighnas Removed
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setFilter('ALL_TIME')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: filter === 'ALL_TIME' ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: filter === 'ALL_TIME' ? '#080B14' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            All-Time Legends
          </button>
          <button
            onClick={() => setFilter('TODAY')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: filter === 'TODAY' ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: filter === 'TODAY' ? '#080B14' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Today&apos;s Festival Runs
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: 280 }}>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search devotee or city..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-full)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: 12 }} />
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              <th style={{ padding: '16px 20px', width: 70 }}>Rank</th>
              <th style={{ padding: '16px 20px' }}>Devotee</th>
              <th style={{ padding: '16px 20px' }}>City</th>
              <th style={{ padding: '16px 20px' }}>Vighnas</th>
              <th style={{ padding: '16px 20px' }}>Max Combo</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredBoard.map((entry) => {
              const isTop3 = entry.rank <= 3;
              const isYou = entry.isCurrentUser;

              return (
                <tr
                  key={entry.user_id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    background: isYou ? 'rgba(255, 184, 0, 0.1)' : (isTop3 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'),
                    borderLeft: isYou ? '3px solid var(--gold-primary)' : 'none',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <td style={{ padding: '16px 20px', fontWeight: 800, fontSize: '1rem' }}>
                    {entry.rank === 1 ? '🥇' : (entry.rank === 2 ? '🥈' : (entry.rank === 3 ? '🥉' : `#${entry.rank}`))}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.4rem' }}>
                        {entry.avatar === 'golden' ? '👑' : (entry.avatar === 'divine' ? '✨' : (entry.avatar === 'lotus' ? '🪷' : '🪔'))}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, color: isYou ? 'var(--gold-light)' : '#FFFFFF' }}>
                          {entry.username} {isYou && <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', background: 'rgba(255, 184, 0, 0.2)', padding: '2px 6px', borderRadius: 4, marginLeft: 6 }}>YOU</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    📍 {entry.city}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--saffron)', fontWeight: 700 }}>
                    {entry.vighnas_destroyed} / 108
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                    x{entry.max_combo}
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    textAlign: 'right',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: 'var(--gold-light)'
                  }}>
                    {entry.score.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
