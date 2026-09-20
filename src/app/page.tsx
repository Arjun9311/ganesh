'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Trophy, Sparkles, Zap, Shield, ChevronRight, Flame, Palette } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 20px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 30%, rgba(255, 103, 31, 0.18) 0%, rgba(8, 11, 20, 0.95) 75%)'
      }}>
        {/* Floating background festival ambient effects & animatics */}
        <div style={{
          position: 'absolute',
          top: '12%',
          left: '8%',
          fontSize: '2.2rem',
          opacity: 0.3,
          pointerEvents: 'none',
          animation: 'floatSlow 4.5s ease-in-out infinite'
        }}>
          🪔
        </div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          fontSize: '2.5rem',
          opacity: 0.3,
          pointerEvents: 'none',
          animation: 'floatSlow 5.5s ease-in-out infinite',
          animationDelay: '-2s'
        }}>
          🍬
        </div>
        <div style={{
          position: 'absolute',
          bottom: '18%',
          left: '12%',
          fontSize: '2.2rem',
          opacity: 0.25,
          pointerEvents: 'none',
          animation: 'floatSlow 6s ease-in-out infinite',
          animationDelay: '-3.5s'
        }}>
          🌺
        </div>
        <div style={{
          position: 'absolute',
          bottom: '22%',
          right: '14%',
          fontSize: '2rem',
          opacity: 0.28,
          pointerEvents: 'none',
          animation: 'floatSlow 5s ease-in-out infinite',
          animationDelay: '-1.5s'
        }}>
          🔔
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '4%',
          fontSize: '1.6rem',
          opacity: 0.35,
          pointerEvents: 'none',
          animation: 'floatSlow 4s ease-in-out infinite',
          animationDelay: '-1s'
        }}>
          ✨
        </div>
        <div style={{
          position: 'absolute',
          top: '45%',
          right: '5%',
          fontSize: '1.8rem',
          opacity: 0.35,
          pointerEvents: 'none',
          animation: 'floatSlow 4.8s ease-in-out infinite',
          animationDelay: '-2.5s'
        }}>
          🪔
        </div>

        {/* Majestic Rotating Sacred Mandala / Sun Halo Background Animatic */}
        <div style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(340px, 50vw, 680px)',
          height: 'clamp(340px, 50vw, 680px)',
          pointerEvents: 'none',
          opacity: 0.14,
          zIndex: 1
        }}>
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: '100%',
              height: '100%',
              animation: 'spinAura 60s linear infinite',
              transformOrigin: 'center'
            }}
          >
            <circle cx="100" cy="100" r="90" stroke="#FFD700" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="80" stroke="#FFB800" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="68" stroke="#FF671F" strokeWidth="1" strokeDasharray="6 3" />
            <circle cx="100" cy="100" r="50" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 100 100)`}>
                <line x1="100" y1="12" x2="100" y2="28" stroke="#FFB800" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="100" cy="34" r="2.5" fill="#FFD700" />
              </g>
            ))}
          </svg>
        </div>

        <div style={{
          maxWidth: 860,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 184, 0, 0.12)',
            border: '1px solid var(--border-gold)',
            color: 'var(--gold-light)',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '1px'
          }}>
            <Sparkles size={16} color="var(--gold-primary)" />
            <span>THE 108 VIGHNAS FESTIVAL RUNNER</span>
          </div>

          {/* Main Hero Heading with Balanced Font Size */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.85rem, 3.6vw, 3.1rem)',
            fontWeight: 900,
            lineHeight: 1.22,
            letterSpacing: '1.2px'
          }}>
            <span className="text-divine-gradient">DON&apos;T AVOID THE OBSTACLES.</span>
            <br />
            <span className="text-gold-gradient">REMOVE THEM.</span>
          </h1>

          {/* Tagline */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-cream)',
            maxWidth: 620,
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            Play as <strong>Lord Ganesha</strong> in a modern 3D Indian festival runner.
            Switch lanes, smash through 108 Vighnas, activate Divine Mode, and conquer the live leaderboard.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
            marginTop: 12
          }}>
            <Link
              href="/temple-run"
              className="btn-primary"
              style={{
                fontSize: '1.15rem',
                padding: '16px 36px',
                gap: 12,
                background: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
                boxShadow: '0 0 35px rgba(255, 184, 0, 0.7)'
              }}
            >
              <Play size={22} color="#080B14" fill="#080B14" />
              <span>TEMPLE RUN (NEW)</span>
            </Link>

            <Link
              href="/idol-shop"
              className="btn-secondary"
              style={{
                fontSize: '1.15rem',
                padding: '16px 36px',
                gap: 12,
                border: '1.5px solid rgba(255, 184, 0, 0.5)'
              }}
            >
              <Palette size={22} color="#FFD700" />
              <span>GANESH IDOL SHOP</span>
            </Link>

            <Link
              href="/hill-climb"
              className="btn-secondary"
              style={{
                fontSize: '1.15rem',
                padding: '16px 36px',
                gap: 12,
                border: '1.5px solid rgba(255, 184, 0, 0.5)'
              }}
            >
              <Flame size={22} color="#FF884D" />
              <span>HILL CLIMB</span>
            </Link>

            <Link
              href="/game"
              className="btn-secondary"
              style={{
                fontSize: '1.15rem',
                padding: '16px 32px',
                gap: 12
              }}
            >
              <Play size={22} fill="currentColor" />
              <span>3D RUNNER</span>
            </Link>

            <Link
              href="/arcade"
              className="btn-secondary"
              style={{
                fontSize: '1.05rem',
                padding: '15px 28px',
                gap: 10,
                border: '1.5px solid var(--border-gold)'
              }}
            >
              <Sparkles size={20} color="#FFD700" />
              <span>ARCADE HUB</span>
            </Link>
          </div>

          {/* Ganesha running visual preview card */}
          <div className="glass-card-gold" style={{
            marginTop: 30,
            padding: '24px 32px',
            maxWidth: 720,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: 20,
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: '2.5rem' }}>🐘</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, color: 'var(--gold-light)' }}>Lord Ganesha</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>The Remover of Obstacles</div>
              </div>
            </div>

            <div style={{ height: 40, width: 1, background: 'rgba(255, 255, 255, 0.1)' }} />

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Signature Mechanic</div>
              <div style={{ fontWeight: 800, color: 'var(--saffron)' }}>Vighna Destruction (+100)</div>
            </div>

            <div style={{ height: 40, width: 1, background: 'rgba(255, 255, 255, 0.1)' }} />

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Power-up</div>
              <div style={{ fontWeight: 800, color: 'var(--gold-divine)' }}>Divine Mode 10s</div>
            </div>
          </div>
        </div>
      </section>

      {/* MULTI-GAME ARCADE SHOWCASE */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 24px 20px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 9999,
            background: 'rgba(255, 184, 0, 0.12)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            color: '#FFD700',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 12
          }}>
            <Sparkles size={14} />
            GANESHA MULTI-GAME ARCADE
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#FFFFFF'
          }}>
            CHOOSE YOUR SACRED EXPEDITION
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '1rem' }}>
            Four distinct Ganesha gameplay experiences in one unified app.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 28
        }}>
          {/* Card 0: Vighnaharta Temple Run */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(35, 20, 50, 0.95) 0%, rgba(16, 12, 32, 0.98) 100%)',
            border: '2.5px solid #FFD700',
            borderRadius: 24,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(255, 215, 0, 0.35)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'linear-gradient(90deg, #FF671F, #FFB800, #FFD700)',
              color: '#080B14',
              fontSize: 10,
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: 6,
              letterSpacing: 1
            }}>
              NEW 3D GAME
            </div>

            <div>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🐘🏛️⚡</div>
              <div style={{ fontSize: '0.8rem', color: '#FFD700', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                SACRED RUNNER &amp; 90° CORNER TURNS
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', marginTop: 4, marginBottom: 12 }}>
                Vighnaharta Temple Run
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
                Sprint through procedural temple corridors, sacred banyan forests, and glowing crystal caves. Master sharp 90-degree corner turns, leap over barriers, slide beneath brass bells, smash destructible Vighnas, and clear all 108 Vighnas alongside Mushika!
              </p>
            </div>

            <Link
              href="/temple-run"
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: '0.95rem',
                gap: 8,
                background: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
                boxShadow: '0 0 25px rgba(255, 184, 0, 0.6)'
              }}
            >
              <Play size={18} fill="currentColor" />
              <span>PLAY TEMPLE RUN</span>
            </Link>
          </div>

          {/* Card 1: Ganesh Idol Shop */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(30, 26, 62, 0.95) 0%, rgba(16, 18, 40, 0.95) 100%)',
            border: '2px solid #FFD700',
            borderRadius: 24,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5), 0 0 25px rgba(255, 184, 0, 0.2)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'linear-gradient(90deg, #FFB800, #FF671F)',
              color: '#080B14',
              fontSize: 10,
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: 6,
              letterSpacing: 1
            }}>
              NEW MINI-GAME
            </div>

            <div>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🐘🎨✨</div>
              <div style={{ fontSize: '0.8rem', color: '#FF884D', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                CUSTOMIZATION & ARTISAN SHOP
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', marginTop: 4, marginBottom: 12 }}>
                Ganesh Idol Shop
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
                Handcraft your personalized Lord Ganesha idol with 12 authentic visual categories. Unlock rare festival crowns, jewels, and divine auras as you remove Vighnas!
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {['12 Parts', '3D Rotate & Zoom', 'Surprise Me', 'Use as Avatar'].map(f => (
                  <span key={f} style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: 'rgba(255, 184, 0, 0.1)',
                    border: '1px solid rgba(255, 184, 0, 0.25)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#FFE57F'
                  }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/idol-shop"
              className="btn-primary"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #FFD700 0%, #FF671F 100%)',
                color: '#080B14',
                fontWeight: 900
              }}
            >
              <Palette size={18} />
              <span>CUSTOMIZE GANESHA</span>
            </Link>
          </div>

          {/* Card 2: Hill Climb Racing */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(26, 34, 56, 0.9) 0%, rgba(14, 20, 36, 0.9) 100%)',
            border: '2px solid rgba(255, 184, 0, 0.45)',
            borderRadius: 24,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'linear-gradient(90deg, #FF671F, #E11D48)',
              color: '#FFF',
              fontSize: 10,
              fontWeight: 900,
              padding: '4px 10px',
              borderRadius: 6,
              letterSpacing: 1
            }}>
              NEW!
            </div>

            <div>
              <div style={{ fontSize: 44, marginBottom: 14 }}>🏎️⛰️</div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#FF884D', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                PHYSICS 2D STUNT RACER
              </span>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#FFFFFF',
                marginTop: 4,
                marginBottom: 10
              }}>
                Ganesha Hill Climb Racing
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>
                Conquer steep Himalayan peaks and Western Ghats! Balance rigid-body suspension, execute aerial backflips, harvest Amrit fuel, and upgrade your chariot in the divine workshop.
              </p>
            </div>

            <Link
              href="/hill-climb"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '1rem',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FF671F 0%, #FFB800 100%)'
              }}
            >
              <Flame size={18} fill="#080B14" />
              <span>PLAY HILL CLIMB RACING</span>
            </Link>
          </div>

          {/* Card 2: 3D Endless Runner */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(26, 34, 56, 0.9) 0%, rgba(14, 20, 36, 0.9) 100%)',
            border: '2px solid rgba(255, 184, 0, 0.3)',
            borderRadius: 24,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
          }}>
            <div>
              <div style={{ fontSize: 44, marginBottom: 14 }}>🏃‍♂️🪔</div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#FFB800', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                3D HIGH-SPEED RUNNER
              </span>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#FFFFFF',
                marginTop: 4,
                marginBottom: 10
              }}>
                Vighnaharta 3D Runner
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>
                Sprint across photorealistic temple streets, smash through 108 Vighnas with sacred shockwaves, ride the Mushika Hoverboard, and climb the live global leaderboard.
              </p>
            </div>

            <Link
              href="/game"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '1rem',
                justifyContent: 'center'
              }}
            >
              <Play size={18} fill="#080B14" />
              <span>PLAY 3D RUNNER</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid ("THE JOURNEY") */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '80px 24px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.4rem',
            fontWeight: 800,
            color: 'var(--text-white)'
          }}>
            THE SACRED FEATURES
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            Built with pure WebGL Three.js, responsive physics, and live realtime sync.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24
        }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '32px 26px' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 184, 0, 0.15)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20
            }}>
              <Sparkles size={26} color="var(--gold-primary)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              108 Vighnas Progression
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 10 }}>
              Journey from Festival Street to Temple Street, Monsoon rains, and face the colossus Final Vighna at milestone 108.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '32px 26px' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 103, 31, 0.15)',
              border: '1px solid rgba(255, 103, 31, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20
            }}>
              <Flame size={26} color="var(--saffron)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--saffron-light)' }}>
              Smash & Destroy Mechanics
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 10 }}>
              Rather than just dodging, Lord Ganesha strikes down hurdles with explosive golden bursts, camera shake, and combo multipliers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '32px 26px' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20
            }}>
              <Zap size={26} color="var(--sky-monsoon)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--sky-monsoon)' }}>
              Mushika & Divine Mode
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 10 }}>
              Collect Golden Modaks for 10 seconds of invincibility, or call upon Mushika for high-speed festive trails.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel" style={{ padding: '32px 26px' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 215, 0, 0.15)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20
            }}>
              <Trophy size={26} color="var(--gold-divine)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              Live Realtime Leaderboard
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 10 }}>
              Synced with Supabase and active player sessions across cities with live ranking animations and performance charts.
            </p>
          </div>
        </div>
      </section>

      {/* 30-Second Hackathon Demo Walkthrough */}
      <section style={{
        background: 'rgba(18, 24, 43, 0.5)',
        borderTop: '1px solid rgba(255, 184, 0, 0.15)',
        borderBottom: '1px solid rgba(255, 184, 0, 0.15)',
        padding: '60px 24px'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
            The 30-Second Hackathon Experience
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 800, marginTop: 6 }}>
            Designed for Instant Wow Factor
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginTop: 40
          }}>
            {[
              { sec: '0s', label: 'Start Run', desc: 'Ganesha sprints forward' },
              { sec: '6s', label: 'Collect Modak', desc: 'Chime & sparkle' },
              { sec: '10s', label: 'Smash Vighna', desc: 'Golden explosion & shake' },
              { sec: '20s', label: 'Mushika Boost', desc: 'High speed trail' },
              { sec: '25s', label: 'Divine Mode', desc: 'Golden aura transformation' },
            ].map((step, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '20px 14px' }}>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: 'var(--gold-light)'
                }}>
                  {step.sec}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 4, color: '#FFFFFF' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <Link href="/game" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
              <Play size={20} fill="#080B14" />
              <span>START YOUR JOURNEY</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '30px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        color: 'var(--text-dim)',
        fontSize: '0.85rem'
      }}>
        <p>VIGHNAHARTA RUN — The 108 Vighnas • Dedicated with reverence to Lord Ganesha 🙏</p>
        <p style={{ marginTop: 6, fontSize: '0.75rem' }}>Original 3D Artwork, Procedural Web Audio Engine & Realtime Leaderboards</p>
      </footer>
    </div>
  );
}
