'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, Sparkles, Snowflake, Flame, BarChart3, Palette } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  accentColor: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Arcade', href: '/arcade', icon: Sparkles, accentColor: '#FFB800' },
  { name: 'Temple', href: '/temple-run', icon: Snowflake, accentColor: '#38BDF8' },
  { name: 'Hill Climb', href: '/hill-climb', icon: Flame, accentColor: '#F43F5E' },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, accentColor: '#10B981' },
  { name: 'Idol Shop', href: '/idol-shop', icon: Palette, accentColor: '#C084FC' }
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide mobile bottom navigation during active gameplay to maximize screen space
  if (pathname === '/game' || pathname === '/temple-run' || pathname === '/hill-climb') {
    return null;
  }

  return (
    <div
      className="mobile-bottom-nav-container"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 45,
        pointerEvents: 'none'
      }}
    >
      <nav
        aria-label="Mobile Bottom Navigation"
        style={{
          maxWidth: 520,
          margin: '0 auto',
          background: 'linear-gradient(180deg, rgba(14, 19, 34, 0.94) 0%, rgba(8, 11, 20, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1.5px solid rgba(255, 184, 0, 0.35)',
          borderLeft: '1px solid rgba(255, 184, 0, 0.2)',
          borderRight: '1px solid rgba(255, 184, 0, 0.2)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.15)',
          padding: '6px 10px calc(6px + env(safe-area-inset-bottom, 8px))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          pointerEvents: 'auto',
          touchAction: 'manipulation'
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 10px',
                borderRadius: 14,
                position: 'relative',
                minWidth: 58,
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                background: isActive ? 'rgba(255, 184, 0, 0.12)' : 'transparent',
                color: isActive ? item.accentColor : '#94A3B8'
              }}
            >
              {/* Active Ambient Glow Pill */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    width: 18,
                    height: 3,
                    borderRadius: 2,
                    background: item.accentColor,
                    boxShadow: `0 0 10px ${item.accentColor}`
                  }}
                />
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isActive ? 'scale(1.12)' : 'scale(1)',
                  transition: 'transform 0.18s ease'
                }}
              >
                <Icon size={20} color={isActive ? item.accentColor : '#94A3B8'} />
              </div>

              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 800 : 600,
                  marginTop: 3,
                  letterSpacing: '0.4px',
                  lineHeight: 1.1
                }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Embedded Responsive Media Query to only show on mobile */}
      <style jsx>{`
        @media (min-width: 769px) {
          .mobile-bottom-nav-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
