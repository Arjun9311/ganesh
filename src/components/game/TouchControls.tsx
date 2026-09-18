'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface TouchControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onJump: () => void;
  onSlide: () => void;
  onHoverboard?: () => void;
}

export default function TouchControls({
  onLeft,
  onRight,
  onJump,
  onSlide,
  onHoverboard
}: TouchControlsProps) {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch {}
    }
  };

  const handleAction = (callback: () => void) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic();
    callback();
  };

  const buttonStyle: React.CSSProperties = {
    width: 'clamp(48px, 13vw, 62px)',
    height: 'clamp(48px, 13vw, 62px)',
    borderRadius: '50%',
    background: 'rgba(18, 24, 43, 0.75)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1.5px solid rgba(255, 184, 0, 0.45)',
    color: 'var(--gold-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',
    pointerEvents: 'auto',
    cursor: 'pointer',
    transition: 'transform 0.08s ease, background 0.08s ease'
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 'clamp(14px, 3.5vh, 28px)',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 clamp(10px, 3vw, 24px)',
      pointerEvents: 'none',
      zIndex: 25,
      touchAction: 'none'
    }}>
      {/* Left/Right Horizontal Lane Controls */}
      <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 14px)' }}>
        <button
          style={buttonStyle}
          onPointerDown={handleAction(onLeft)}
          onTouchStart={handleAction(onLeft)}
          aria-label="Move Left"
          title="Move Left (A / ←)"
        >
          <ArrowLeft size={26} />
        </button>

        <button
          style={buttonStyle}
          onPointerDown={handleAction(onRight)}
          onTouchStart={handleAction(onRight)}
          aria-label="Move Right"
          title="Move Right (D / →)"
        >
          <ArrowRight size={26} />
        </button>
      </div>

      {/* Center: Quick Deploy Hoverboard Button */}
      {onHoverboard && (
        <button
          style={{
            ...buttonStyle,
            width: 'clamp(44px, 12vw, 54px)',
            height: 'clamp(44px, 12vw, 54px)',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.5) 0%, rgba(168, 85, 247, 0.5) 100%)',
            border: '2px solid var(--sky-monsoon)',
            fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)'
          }}
          onPointerDown={handleAction(onHoverboard)}
          onTouchStart={handleAction(onHoverboard)}
          title="Deploy Mushika Hoverboard (Double Tap Space / Shift)"
          aria-label="Deploy Hoverboard"
        >
          🛹
        </button>
      )}

      {/* Jump/Slide Vertical Action Controls */}
      <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 14px)' }}>
        <button
          style={{
            ...buttonStyle,
            background: 'rgba(30, 41, 59, 0.85)',
            border: '1.5px solid rgba(56, 189, 248, 0.45)',
            color: '#38BDF8'
          }}
          onPointerDown={handleAction(onSlide)}
          onTouchStart={handleAction(onSlide)}
          aria-label="Slide Down"
          title="Slide / Dive Down (S / ↓)"
        >
          <ArrowDown size={26} />
        </button>

        <button
          style={{
            ...buttonStyle,
            background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.6) 0%, rgba(255, 103, 31, 0.75) 100%)',
            border: '2px solid #FFD700',
            color: '#FFFFFF',
            boxShadow: '0 0 16px rgba(255, 184, 0, 0.5)'
          }}
          onPointerDown={handleAction(onJump)}
          onTouchStart={handleAction(onJump)}
          aria-label="Jump Up"
          title="Jump Up (W / ↑ / Space)"
        >
          <ArrowUp size={26} />
        </button>
      </div>
    </div>
  );
}
