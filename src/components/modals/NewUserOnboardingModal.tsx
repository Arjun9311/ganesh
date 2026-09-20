'use client';

import React, { useState, useEffect } from 'react';
import { getStoredProfile, saveStoredProfile, resetPlayerProgression, isOnboarded, setOnboarded } from '@/lib/storage';
import { FESTIVAL_CITIES } from '@/lib/weather';
import { Sparkles, Play, Shield } from 'lucide-react';

const AVATAR_OPTIONS = [
  { id: 'custom', icon: '🐘', label: 'Airavata Elephant' },
  { id: 'saffron', icon: '🪔', label: 'Saffron Diya' },
  { id: 'golden', icon: '👑', label: 'Mukut Crown' },
  { id: 'divine', icon: '✨', label: 'Celestial Star' },
  { id: 'lotus', icon: '🪷', label: 'Sacred Lotus' }
];

export default function NewUserOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [runnerAlias, setRunnerAlias] = useState('');
  const [festivalCity, setFestivalCity] = useState('Hyderabad');
  const [selectedAvatar, setSelectedAvatar] = useState('saffron');

  useEffect(() => {
    // Check if device is already onboarded
    const onboarded = isOnboarded();
    if (!onboarded) {
      const profile = getStoredProfile();
      setRunnerAlias(profile.username && profile.username !== 'Arjun Devotee' ? profile.username : 'Sidharth');
      setFestivalCity(profile.city || 'Hyderabad');
      setSelectedAvatar(profile.avatar || 'saffron');
      // Show modal for new device
      setIsOpen(true);
    }

    // Listen for manual re-open events from Profile page
    const handleReopen = () => {
      const profile = getStoredProfile();
      setRunnerAlias(profile.username || 'Sidharth');
      setFestivalCity(profile.city || 'Hyderabad');
      setSelectedAvatar(profile.avatar || 'saffron');
      setIsOpen(true);
    };

    window.addEventListener('vighnaharta_open_onboarding', handleReopen);
    return () => window.removeEventListener('vighnaharta_open_onboarding', handleReopen);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAlias = runnerAlias.trim() || 'Sidharth';

    // 1. Update stored profile with user's selected details
    const current = getStoredProfile();
    saveStoredProfile({
      ...current,
      id: current.id || 'devotee_' + Date.now(),
      username: finalAlias,
      city: festivalCity,
      avatar: selectedAvatar,
      created_at: current.created_at || new Date().toISOString()
    });

    // 2. Reset game progression to 0 for fresh new journey
    resetPlayerProgression();

    // 3. Mark user device as onboarded
    setOnboarded(true);

    // 4. Close modal
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(4, 7, 15, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        className="glass-card-gold"
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'linear-gradient(180deg, rgba(18, 24, 43, 0.98) 0%, rgba(10, 14, 26, 0.99) 100%)',
          border: '1.5px solid rgba(255, 184, 0, 0.45)',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 184, 0, 0.25)',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}
      >
        {/* Header with Divine Blessing icon */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2.4rem',
            filter: 'drop-shadow(0 0 16px rgba(255, 184, 0, 0.6))',
            marginBottom: 6
          }}>
            🐘
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '1px',
            background: 'linear-gradient(135deg, #FFE57F 0%, #FFB800 50%, #FF671F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            DEVOTEE INITIATION
          </h2>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginTop: 4,
            lineHeight: 1.4
          }}>
            Enter your details to begin your journey. Starting progression will be set to 0.
          </p>
        </div>

        {/* Form Fields matching the user interface */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Field 1: Runner Alias */}
          <div>
            <label style={{
              fontSize: '0.84rem',
              color: '#FFFFFF',
              fontWeight: 800,
              display: 'block',
              marginBottom: 8,
              letterSpacing: '0.5px'
            }}>
              Runner Alias
            </label>
            <input
              type="text"
              required
              value={runnerAlias}
              onChange={e => setRunnerAlias(e.target.value)}
              placeholder="e.g. Sidharth"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1.5px solid rgba(255, 255, 255, 0.14)',
                borderRadius: 12,
                color: '#FFFFFF',
                fontSize: '0.96rem',
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#FFB800';
                e.target.style.boxShadow = '0 0 15px rgba(255, 184, 0, 0.25)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Field 2: Festival City */}
          <div>
            <label style={{
              fontSize: '0.84rem',
              color: '#FFFFFF',
              fontWeight: 800,
              display: 'block',
              marginBottom: 8,
              letterSpacing: '0.5px'
            }}>
              Festival City
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={festivalCity}
                onChange={e => setFestivalCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(18, 24, 43, 0.95)',
                  border: '1.5px solid rgba(255, 184, 0, 0.35)',
                  borderRadius: 12,
                  color: '#FFE57F',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  boxSizing: 'border-box'
                }}
              >
                {Object.keys(FESTIVAL_CITIES).map(city => (
                  <option key={city} value={city} style={{ background: '#0F1526', color: '#FFE57F' }}>
                    📍 {city}
                  </option>
                ))}
              </select>
              <span style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#FFB800',
                fontSize: '0.8rem'
              }}>
                ▼
              </span>
            </div>
          </div>

          {/* Field 3: Avatar Style */}
          <div>
            <label style={{
              fontSize: '0.84rem',
              color: '#FFFFFF',
              fontWeight: 800,
              display: 'block',
              marginBottom: 8,
              letterSpacing: '0.5px'
            }}>
              Avatar Style
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 8
            }}>
              {AVATAR_OPTIONS.map(av => {
                const isSelected = selectedAvatar === av.id || (av.id === 'custom' && selectedAvatar.startsWith('custom'));
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    title={av.label}
                    style={{
                      padding: '12px 4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.65rem',
                      borderRadius: 12,
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(255, 184, 0, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '2px solid #FFB800' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? '0 0 16px rgba(255, 184, 0, 0.4)' : 'none',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    {av.icon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{
              marginTop: 8,
              width: '100%',
              padding: '14px 20px',
              fontSize: '0.98rem',
              fontWeight: 800,
              letterSpacing: '1px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
              color: '#080B14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 25px rgba(255, 103, 31, 0.5)'
            }}
          >
            <Play size={18} fill="#080B14" />
            <span>START EXPEDITION</span>
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6
        }}>
          <Sparkles size={12} color="#FFB800" />
          <span>Progression initialized: High score, modaks & distance reset to 0</span>
        </div>
      </div>
    </div>
  );
}
