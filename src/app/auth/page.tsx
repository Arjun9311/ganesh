'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { saveStoredProfile, getStoredProfile } from '@/lib/storage';
import { Sparkles, User, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          setSuccessMsg('Account created! Please check your email or proceed to Onboarding.');
          setTimeout(() => router.push('/onboarding'), 1200);
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          router.push('/dashboard');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Authentication failed.';
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    } else {
      // Demo Mode Auth: Save profile locally
      setTimeout(() => {
        const current = getStoredProfile();
        saveStoredProfile({
          ...current,
          username: email.split('@')[0] || 'Devotee Runner',
        });
        setLoading(false);
        router.push(isSignUp ? '/onboarding' : '/dashboard');
      }, 500);
    }
  };

  const handleGuestLogin = () => {
    const current = getStoredProfile();
    saveStoredProfile({
      ...current,
      username: 'Arjun Devotee',
      city: 'Mumbai'
    });
    router.push('/onboarding');
  };

  return (
    <div style={{
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(circle at 50% 30%, rgba(255, 103, 31, 0.12) 0%, rgba(8, 11, 20, 0.98) 75%)'
    }}>
      <div className="glass-card-gold" style={{
        maxWidth: 440,
        width: '100%',
        padding: '36px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20
      }}>
        <div style={{ fontSize: '2.8rem' }}>🐘</div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            fontWeight: 800,
            color: 'var(--gold-light)'
          }}>
            {isSignUp ? 'BEGIN THE DEVOTION' : 'WELCOME BACK, RUNNER'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {isSignUp
              ? 'Join the community of 108 Vighna conquerors.'
              : 'Sign in to access your stats and leaderboard rank.'}
          </p>
        </div>

        {/* Demo Mode Badge */}
        {!isSupabaseConfigured && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: 'rgba(255, 184, 0, 0.1)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            color: 'var(--gold-light)'
          }}>
            <ShieldCheck size={14} color="var(--gold-primary)" />
            <span>DEMO MODE ACTIVE • Instant Access Enabled</span>
          </div>
        )}

        {/* Auth Mode Toggle Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-sm)',
          padding: 4
        }}>
          <button
            onClick={() => { setIsSignUp(false); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '10px 0',
              borderRadius: 6,
              fontSize: '0.88rem',
              fontWeight: 700,
              color: !isSignUp ? '#080B14' : 'var(--text-muted)',
              background: !isSignUp ? 'var(--gold-primary)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            SIGN IN
          </button>
          <button
            onClick={() => { setIsSignUp(true); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '10px 0',
              borderRadius: 6,
              fontSize: '0.88rem',
              fontWeight: 700,
              color: isSignUp ? '#080B14' : 'var(--text-muted)',
              background: isSignUp ? 'var(--gold-primary)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Error / Success Messages */}
        {errorMsg && (
          <div style={{
            width: '100%',
            padding: '10px 14px',
            background: 'rgba(230, 57, 70, 0.15)',
            border: '1px solid var(--vermilion)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--vermilion)',
            fontSize: '0.82rem'
          }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            width: '100%',
            padding: '10px 14px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--emerald)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--emerald)',
            fontSize: '0.82rem'
          }}>
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-cream)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ganesha.devotee@example.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: 15 }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-cream)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: 15 }} />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-cream)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: 15 }} />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: 8, padding: '14px 20px' }}
          >
            <span>{loading ? 'PROCESSING...' : (isSignUp ? 'CONTINUE TO ONBOARDING' : 'SIGN IN')}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Guest / Demo Login Action */}
        <div style={{ width: '100%', textAlign: 'center', marginTop: 4 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 12 }}>
            OR TEST INSTANTLY WITHOUT AN ACCOUNT
          </div>

          <button
            onClick={handleGuestLogin}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px 20px' }}
          >
            <Sparkles size={16} />
            <span>PLAY AS GUEST DEVOTEE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
