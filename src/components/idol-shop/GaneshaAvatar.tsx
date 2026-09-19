'use client';

import React, { useEffect, useState } from 'react';
import { GaneshaCustomization } from '@/types/idolShop';
import { getActiveGaneshaAvatar, getSavedGaneshaDesigns } from '@/lib/storage';
import GaneshaIdolRenderer from './GaneshaIdolRenderer';
import { DEFAULT_GANESHA_CONFIG } from '@/lib/idolShopData';

interface GaneshaAvatarProps {
  avatarId?: string; // 'custom_...' or 'golden' | 'divine' | 'lotus' | 'saffron'
  config?: GaneshaCustomization;
  size?: number; // width & height in px
  showBorder?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function GaneshaAvatar({
  avatarId,
  config,
  size = 48,
  showBorder = true,
  className = '',
  style = {}
}: GaneshaAvatarProps) {
  const [customConfig, setCustomConfig] = useState<GaneshaCustomization | null>(config || null);

  useEffect(() => {
    if (config) {
      setCustomConfig(config);
      return;
    }

    if (avatarId && avatarId.startsWith('custom_')) {
      const designId = avatarId.replace('custom_', '');
      const designs = getSavedGaneshaDesigns();
      const found = designs.find(d => d.id === designId);
      if (found) {
        setCustomConfig(found.config);
        return;
      }
    }

    if (avatarId === 'custom') {
      const active = getActiveGaneshaAvatar();
      if (active) {
        setCustomConfig(active.config);
        return;
      }
    }

    if (!avatarId) {
      const active = getActiveGaneshaAvatar();
      if (active) {
        setCustomConfig(active.config);
        return;
      }
    }

    // Standard emoji avatar (saffron, golden, divine, lotus)
    setCustomConfig(null);
  }, [avatarId, config]);

  const isCustom = Boolean((!avatarId || avatarId.startsWith('custom') || config) && customConfig);

  // Fallback to legacy emojis
  const legacyEmoji = avatarId === 'golden' ? '👑' :
                      avatarId === 'divine' ? '✨' :
                      avatarId === 'lotus' ? '🪷' :
                      avatarId === 'saffron' ? '🪔' : '🐘';

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(26, 34, 56, 0.95) 0%, rgba(10, 14, 26, 0.95) 100%)',
        border: showBorder ? '2px solid var(--gold-divine, #FFD700)' : 'none',
        boxShadow: showBorder ? '0 0 16px rgba(255, 184, 0, 0.35)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        ...style
      }}
    >
      {isCustom && (customConfig || DEFAULT_GANESHA_CONFIG) ? (
        <div style={{ width: '130%', height: '130%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6%' }}>
          <GaneshaIdolRenderer
            config={customConfig || DEFAULT_GANESHA_CONFIG}
            size="100%"
            showPlatform={false}
            animateIdle={false}
            rotation={0}
            tilt={0}
            zoom={1.05}
          />
        </div>
      ) : (
        <span style={{ fontSize: size * 0.52 }}>
          {legacyEmoji}
        </span>
      )}
    </div>
  );
}
