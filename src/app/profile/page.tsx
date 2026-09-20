'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, MapPin, Trophy, Sparkles, Award, Edit3, Check, X, Shield, Play, Palette, RotateCcw } from 'lucide-react';
import { getStoredProfile, saveStoredProfile, getStoredPlayerStats, getSavedGaneshaDesigns, getActiveGaneshaAvatar } from '@/lib/storage';
import { getAchievementsList, AchievementDef } from '@/lib/achievements';
import { Profile, PlayerStats } from '@/types/database';
import { FESTIVAL_CITIES } from '@/lib/weather';
import GaneshaAvatar from '@/components/idol-shop/GaneshaAvatar';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [achievements, setAchievements] = useState<AchievementDef[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editCity, setEditCity] = useState('Mumbai');
  const [editAvatar, setEditAvatar] = useState('saffron');

  const loadData = () => {
    const current = getStoredProfile();
    setProfile(current);
    setEditUsername(current.username || 'Sidharth');
    setEditCity(current.city || 'Hyderabad');
    setEditAvatar(current.avatar || 'saffron');

    setStats(getStoredPlayerStats());
    setAchievements(getAchievementsList());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('vighnaharta_profile_updated', loadData);
    return () => window.removeEventListener('vighnaharta_profile_updated', loadData);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const updated: Profile = {
      ...profile,
      username: editUsername.trim() || 'Arjun Devotee',
      city: editCity,
      avatar: editAvatar,
      updated_at: new Date().toISOString()
    };
    saveStoredProfile(updated);
    setProfile(updated);
    setIsEditing(false);
  };

  const vighnaProgress = Math.min(stats?.total_vighnas ?? 0, 108);
  const progressPercent = Math.round((vighnaProgress / 108) * 100);

  return (
    <div style={{
      maxWidth: 1000,
      margin: '0 auto',
      padding: '40px 24px 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }}>
      {/* Profile Card Header */}
      <div className="glass-card-gold" style={{ padding: '32px 28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Avatar Badge with Custom Ganesha Support */}
            <GaneshaAvatar
              avatarId={profile?.avatar}
              size={84}
              showBorder={true}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#FFFFFF'
                }}>
                  {profile?.username || 'Arjun Devotee'}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  title="Edit Profile"
                  style={{
                    padding: '6px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Edit3 size={15} />
                </button>

                <Link
                  href="/idol-shop"
                  title="Customize Idol in Artisan Shop"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.2) 0%, rgba(255, 103, 31, 0.25) 100%)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--gold-light)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  <Palette size={14} color="#FFD700" />
                  <span>IDOL SHOP</span>
                </Link>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginTop: 6,
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}>
                <span>📍 {profile?.city || 'Mumbai'}</span>
                <span>•</span>
                <span>Devotee Member</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => window.dispatchEvent(new Event('vighnaharta_open_onboarding'))}
              className="btn-secondary"
              style={{
                padding: '12px 20px',
                fontSize: '0.85rem',
                gap: 8,
                borderRadius: 'var(--radius-full)'
              }}
              title="Reset game progression to 0 and re-enter runner details"
            >
              <RotateCcw size={16} />
              <span>RESET PROGRESSION</span>
            </button>

            <Link href="/game" className="btn-primary" style={{ padding: '12px 28px' }}>
              <Play size={18} fill="#080B14" />
              <span>PLAY RUN</span>
            </Link>
          </div>
        </div>

        {/* 108 Vighnas Progression Banner */}
        <div style={{
          marginTop: 28,
          padding: '20px 24px',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 184, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-light)' }}>
              108 VIGHNAS PROGRESSION
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF' }}>
              {vighnaProgress} / 108 ({progressPercent}%)
            </span>
          </div>

          <div style={{
            width: '100%',
            height: 12,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 6,
            overflow: 'hidden',
            border: '1px solid rgba(255, 184, 0, 0.3)'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #FF671F 0%, #FFB800 50%, #FFE57F 100%)',
              boxShadow: '0 0 12px rgba(255, 184, 0, 0.8)',
              transition: 'width 0.5s ease'
            }} />
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 8 }}>
            Current Realm: <strong>Festival Street & Temple Gateways</strong> • Conquer 108 to unlock the Final Blessing!
          </div>
        </div>
      </div>

      {/* Aggregate Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16
      }}>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BEST SCORE</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--gold-light)', marginTop: 4 }}>
            {(stats?.best_score || 12450).toLocaleString()}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>VIGHNAS DESTROYED</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--gold-primary)', marginTop: 4 }}>
            {stats?.total_vighnas ?? 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TOTAL DISTANCE</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', marginTop: 4 }}>
            {(((stats?.total_distance || 6800)) / 1000).toFixed(2)} KM
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>GAMES RUN</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--saffron)', marginTop: 4 }}>
            {stats?.games_played || 3}
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS GRID */}
      <div>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'var(--text-white)'
          }}>
            DIVINE ACHIEVEMENTS
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Blessings earned on your festival journey.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16
        }}>
          {achievements.map((ach) => {
            return (
              <div
                key={ach.key}
                className={ach.isUnlocked ? 'glass-card-gold' : 'glass-panel'}
                style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  opacity: ach.isUnlocked ? 1 : 0.6,
                  border: ach.isUnlocked ? '1.5px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: ach.isUnlocked ? '0 0 20px rgba(255, 184, 0, 0.2)' : 'none'
                }}
              >
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 'var(--radius-sm)',
                  background: ach.isUnlocked ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {ach.isUnlocked ? '✨' : '🔒'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: ach.isUnlocked ? 'var(--gold-light)' : 'var(--text-muted)'
                  }}>
                    {ach.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                    {ach.description}
                  </div>
                  {ach.isUnlocked && (
                    <div style={{
                      fontSize: '0.68rem',
                      color: 'var(--gold-primary)',
                      fontWeight: 700,
                      marginTop: 6
                    }}>
                      ✓ UNLOCKED
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(8, 11, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          padding: 20
        }}>
          <div className="glass-card-gold" style={{
            maxWidth: 460,
            width: '100%',
            padding: '30px 26px',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                color: 'var(--text-muted)'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              EDIT DEVOTEE PROFILE
            </h3>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-cream)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Runner Alias
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-cream)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Festival City
                </label>
                <select
                  value={editCity}
                  onChange={e => setEditCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#12182B',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--gold-light)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  {Object.keys(FESTIVAL_CITIES).map(c => (
                    <option key={c} value={c}>📍 {c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-cream)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Avatar Style
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {[
                    { id: 'custom', icon: '🐘' },
                    { id: 'saffron', icon: '🪔' },
                    { id: 'golden', icon: '👑' },
                    { id: 'divine', icon: '✨' },
                    { id: 'lotus', icon: '🪷' },
                  ].map(av => (
                    <div
                      key={av.id}
                      onClick={() => setEditAvatar(av.id)}
                      style={{
                        padding: '10px 6px',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        background: (editAvatar === av.id || (av.id === 'custom' && editAvatar.startsWith('custom'))) ? 'rgba(255, 184, 0, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: (editAvatar === av.id || (av.id === 'custom' && editAvatar.startsWith('custom'))) ? '1.5px solid var(--gold-divine)' : '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      {av.icon}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 10, padding: '12px' }}>
                <Check size={18} />
                <span>SAVE CHANGES</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
