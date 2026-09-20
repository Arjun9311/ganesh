'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, Sparkles, Trophy, BarChart3, User, Play, Flame, Menu, X, Palette, Snowflake } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide full navbar inside active game to maximize immersion
  if (pathname === '/game' || pathname === '/hill-climb' || pathname === '/idol-shop' || pathname === '/temple-run') {
    return null;
  }

  interface NavLinkItem {
    name: string;
    href: string;
    icon: LucideIcon;
    isAction?: boolean;
  }

  const middleNavLinks: NavLinkItem[] = [
    { name: 'ARCADE', href: '/arcade', icon: Sparkles, isAction: true },
    { name: 'TEMPLE RUN', href: '/temple-run', icon: Snowflake },
    { name: 'IDOL SHOP', href: '/idol-shop', icon: Palette },
    { name: 'HILL CLIMB', href: '/hill-climb', icon: Flame },
    { name: '3D RUNNER', href: '/game', icon: Play },
    { name: 'DASHBOARD', href: '/dashboard', icon: BarChart3 },
    { name: 'LEADERBOARD', href: '/leaderboard', icon: Trophy }
  ];

  const profileLink: NavLinkItem = { name: 'PROFILE', href: '/profile', icon: User };
  const allMobileNavLinks: NavLinkItem[] = [...middleNavLinks, profileLink];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(8, 11, 20, 0.94)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 184, 0, 0.2)',
      padding: '10px clamp(12px, 1.6vw, 28px)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(8px, 1.2vw, 24px)'
      }}>
        {/* 1. STARTING NAVBAR: Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{
            fontSize: '1.65rem',
            filter: 'drop-shadow(0 0 10px rgba(255, 184, 0, 0.5))'
          }}>
            🐘
          </span>
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 800,
              fontSize: '1.12rem',
              letterSpacing: '1.4px',
              background: 'linear-gradient(135deg, #FFE57F 0%, #FFB800 50%, #FF671F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1
            }}>
              VIGHNAHARTA
            </div>
            <div style={{
              fontSize: '0.62rem',
              letterSpacing: '1.6px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase'
            }}>
              The 108 Vighnas
            </div>
          </div>
        </Link>

        {/* 2. MIDDLE NAVBAR: End-to-End Expanded Nav Links */}
        <div className="hidden-mobile desktop-nav-center" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flex: 1,
          gap: 'clamp(4px, 0.8vw, 16px)',
          margin: '0 clamp(6px, 1vw, 18px)'
        }}>
          {middleNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            if (link.isAction) {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="btn-primary"
                  style={{
                    padding: '7px clamp(12px, 1vw, 16px)',
                    fontSize: 'clamp(0.76rem, 0.8vw, 0.84rem)',
                    letterSpacing: '0.8px',
                    gap: 6,
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <Icon size={14} />
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
                  padding: '7px clamp(6px, 0.75vw, 12px)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'clamp(0.76rem, 0.8vw, 0.84rem)',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(255, 184, 0, 0.12)' : 'transparent',
                  border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <Icon size={14} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* 3. END OF NAVBAR: PROFILE Button & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* PROFILE placed at the very end of the desktop navbar */}
          <Link
            href="/profile"
            className="hidden-mobile profile-desktop-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '7px clamp(12px, 1vw, 18px)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'clamp(0.76rem, 0.8vw, 0.84rem)',
              fontWeight: 700,
              letterSpacing: '0.8px',
              color: pathname === '/profile' ? '#080B14' : 'var(--text-cream)',
              background: pathname === '/profile'
                ? 'linear-gradient(135deg, #FFE57F, #FFB800)'
                : 'rgba(255, 255, 255, 0.06)',
              border: pathname === '/profile'
                ? '1px solid var(--gold-divine)'
                : '1px solid rgba(255, 184, 0, 0.35)',
              boxShadow: pathname === '/profile' ? '0 0 15px rgba(255, 184, 0, 0.4)' : 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <User size={15} color={pathname === '/profile' ? '#080B14' : 'var(--gold-primary)'} />
            <span>PROFILE</span>
          </Link>

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
              letterSpacing: '0.8px',
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
          {allMobileNavLinks.map((link) => {
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
                  letterSpacing: '0.8px',
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

    </nav>
  );
}
