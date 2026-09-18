'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredProfile, saveStoredProfile } from '@/lib/storage';
import { fetchCityWeather, FESTIVAL_CITIES } from '@/lib/weather';
import { WeatherCondition } from '@/types/game';
import { Play, Sparkles, MapPin, Check, CloudSun } from 'lucide-react';

const AVATARS = [
  { id: 'saffron', name: 'Saffron Seeker', icon: '🪔', desc: 'Devotee wrapped in sacred saffron' },
  { id: 'golden', name: 'Golden Crown', icon: '👑', desc: 'Blessed with Mukut brilliance' },
  { id: 'divine', name: 'Divine Light', icon: '✨', desc: 'Radiating celestial aura' },
  { id: 'lotus', name: 'Lotus Devotee', icon: '🪷', desc: 'Offering fragrant lotus blooms' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [selectedAvatar, setSelectedAvatar] = useState('saffron');
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    const profile = getStoredProfile();
    if (profile.username) setUsername(profile.username);
    if (profile.city) setCity(profile.city);
    if (profile.avatar) setSelectedAvatar(profile.avatar);
    loadWeather(profile.city || 'Mumbai');
  }, []);

  const loadWeather = async (cityName: string) => {
    setLoadingWeather(true);
    const data = await fetchCityWeather(cityName);
    setWeather(data);
    setLoadingWeather(false);
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    loadWeather(newCity);
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const current = getStoredProfile();
    saveStoredProfile({
      ...current,
      username: username.trim() || 'Arjun Devotee',
      city,
      avatar: selectedAvatar,
      updated_at: new Date().toISOString()
    });

    router.push('/game');
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
      <div className="glass-card-gold" style={{
        maxWidth: 580,
        width: '100%',
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 22
      }}>
        <div style={{ fontSize: '3.2rem', filter: 'drop-shadow(0 0 20px #FFB800)' }}>
          🙏
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--gold-light)'
          }}>
            WELCOME TO THE JOURNEY
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Personalize your runner identity and festival atmosphere.
          </p>
        </div>

        <form onSubmit={handleComplete} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Runner Name */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-cream)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Runner Name / Alias
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. Arjun Devotee"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Festival City & Live Weather */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-cream)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Festival City (Powers In-Game Live Atmosphere)
            </label>
            <select
              value={city}
              onChange={e => handleCityChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#12182B',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--gold-light)',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {Object.keys(FESTIVAL_CITIES).map(cityName => (
                <option key={cityName} value={cityName}>
                  📍 {cityName} ({FESTIVAL_CITIES[cityName].state})
                </option>
              ))}
            </select>

            {/* Live Weather Preview Pill */}
            {weather && (
              <div style={{
                marginTop: 10,
                padding: '10px 14px',
                background: 'rgba(255, 184, 0, 0.1)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CloudSun size={18} color="var(--gold-primary)" />
                  <span style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>
                    {city}: <strong>{weather.temp}°C</strong> ({weather.condition})
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-light)' }}>
                  In-game lighting synced
                </span>
              </div>
            )}
          </div>

          {/* Avatar Selection */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-cream)', fontWeight: 700, display: 'block', marginBottom: 8 }}>
              Choose Sacred Devotee Avatar
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10
            }}>
              {AVATARS.map(avatar => {
                const isSelected = selectedAvatar === avatar.id;
                return (
                  <div
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      background: isSelected ? 'rgba(255, 184, 0, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1.5px solid ${isSelected ? 'var(--gold-divine)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '1.8rem' }}>{avatar.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? 'var(--gold-light)' : '#FFFFFF' }}>
                        {avatar.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        {avatar.desc}
                      </div>
                    </div>
                    {isSelected && <Check size={16} color="var(--gold-divine)" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '16px 24px',
              fontSize: '1.1rem',
              marginTop: 10
            }}
          >
            <Play size={20} fill="#080B14" />
            <span>START PLAYING</span>
          </button>
        </form>
      </div>
    </div>
  );
}
