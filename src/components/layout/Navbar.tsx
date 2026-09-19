'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Trophy, BarChart3, User, Volume2, VolumeX, CloudSun, Play, Flame, Menu, X, Palette, Snowflake } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';
import { fetchCityWeather } from '@/lib/weather';
import { getStoredProfile } from '@/lib/storage';
import { WeatherCondition } from '@/types/game';

export default function Navbar() {
  const pathname = usePathname();
  const [isMuted, setIsMuted] = useState(false);
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMuted(audioEngine.getMuted());
    const profile = getStoredProfile();
    fetchCityWeather(profile.city || 'Mumbai').then(setWeather);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleToggleMute = () => {
    const nextMuted = audioEngine.toggleMute();
    setIsMuted(nextMuted);
  };

  // Hide full navbar inside active game to maximize immersion
  if (pathname === '/game' || pathname === '/hill-climb' || pathname === '/idol-shop' || pathname === '/temple-run') {
    return null;
  }

  const navLinks = [
    { name: 'ARCADE', href: '/arcade', icon: Sparkles, isAction: true },
    { name: 'TEMPLE RUN', href: '/temple-run', icon: Snowflake },
    { name: 'IDOL SHOP', href: '/idol-shop', icon: Palette },
    { name: 'HILL CLIMB', href: '/hill-climb', icon: Flame },
    { name: '3D RUNNER', href: '/game', icon: Play },
    { name: 'DASHBOARD', href: '/dashboard', icon: BarChart3 },
    { name: 'LEADERBOARD', href: '/leaderboard', icon: Trophy },
    { name: 'PROFILE', href: '/profile', icon: User }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(8, 11, 20, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 184, 0, 0.2)',
      padding: '10px 16px'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{
            fontSize: '1.6rem',
            filter: 'drop-shadow(0 0 10px rgba(255, 184, 0, 0.5))'
          }}>
            🐘
          </span>
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 800,
              fontSize: '1.1rem',
              letterSpacing: '1.2px',
              background: 'linear-gradient(135deg, #FFE57F 0%, #FFB800 50%, #FF671F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1
            }}>
              VIGHNAHARTA
            </div>
            <div style={{
              fontSize: '0.62rem',
              letterSpacing: '1.5px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase'
            }}>
              The 108 Vighnas
            </div>
          </div>
        </Link>

        {/* Desktop Navigation items (visible on wider screens) */}
        <div className="hidden-mobile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            if (link.isAction) {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="btn-primary"
                  style={{
                    padding: '7px 16px',
                    fontSize: '0.85rem',
                    marginRight: 6
                  }}
                >
                  <Icon size={15} />
                  <span>{link.name}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(255, 184, 0, 0.12)' : 'transparent',
                  border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Controls: Weather + Mute + Mobile Menu Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {weather && (
            <div className="hidden-mobile" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              color: 'var(--text-cream)',
              whiteSpace: 'nowrap'
            }}>
              <CloudSun size={14} color="var(--gold-primary)" />
              <span>{weather.city}: {weather.temp}°C</span>
            </div>
          )}

          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            style={{
              padding: 7,
              borderRadius: 'var(--radius-full)',
              background: isMuted ? 'rgba(230, 57, 70, 0.15)' : 'rgba(255, 184, 0, 0.15)',
              border: `1px solid ${isMuted ? 'var(--vermilion)' : 'var(--border-gold)'}`,
              color: isMuted ? 'var(--vermilion)' : 'var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Quick Play button on mobile header */}
          <Link
            href="/arcade"
            className="mobile-only-btn"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #FFB800, #FF671F)',
              color: '#080B14',
              fontWeight: 800,
              fontSize: '0.75rem',
              textTransform: 'uppercase'
            }}
          >
            <Sparkles size={13} />
            <span>PLAY</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              padding: 7,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 184, 0, 0.3)',
              color: '#FFD700',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      {mobileMenuOpen && (
        <div style={{
          marginTop: 12,
          padding: '16px 12px',
          background: 'linear-gradient(180deg, rgba(18, 24, 43, 0.98) 0%, rgba(11, 15, 28, 0.98) 100%)',
          border: '1.5px solid rgba(255, 184, 0, 0.35)',
          borderRadius: 16,
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {weather && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.04)',
              fontSize: '0.8rem',
              color: '#FFE57F',
              marginBottom: 4
            }}>
              <CloudSun size={15} color="#FFB800" />
              <span>{weather.city}: {weather.temp}°C ({weather.condition})</span>
            </div>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  color: isActive ? '#080B14' : (link.isAction ? '#FFD700' : '#FFFFFF'),
                  background: isActive
                    ? 'linear-gradient(135deg, #FFB800, #FF671F)'
                    : (link.isAction ? 'rgba(255, 184, 0, 0.12)' : 'rgba(255, 255, 255, 0.04)'),
                  border: isActive
                    ? 'none'
                    : (link.isAction ? '1px solid rgba(255, 184, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)'),
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Embedded CSS for clean Mobile Breakpoints */}
      <style jsx>{`
        @media (max-width: 860px) {
          .hidden-mobile {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .mobile-only-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
