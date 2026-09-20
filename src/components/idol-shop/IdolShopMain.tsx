'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  RotateCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Trash2,
  Check,
  Lock,
  Heart,
  Play,
  Flame,
  ArrowLeft,
  Volume2,
  VolumeX,
  Palette,
  Eye,
  Sliders,
  Award,
  Crown,
  Share2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

import {
  CategoryId,
  ShopItem,
  GaneshaCustomization,
  SavedGaneshaDesign
} from '@/types/idolShop';
import {
  CATEGORIES,
  SHOP_ITEMS,
  SKIN_COLORS,
  CLOTHES_COLORS,
  DECORATION_COLORS,
  DEFAULT_GANESHA_CONFIG,
  PRESET_DESIGNS
} from '@/lib/idolShopData';
import {
  getStoredPlayerStats,
  getSavedGaneshaDesigns,
  saveGaneshaDesign,
  deleteGaneshaDesign,
  setActiveGaneshaAvatar,
  getActiveGaneshaAvatar
} from '@/lib/storage';
import { audioEngine } from '@/lib/audioEngine';
import GaneshaIdolRenderer from './GaneshaIdolRenderer';
import GaneshaAvatar from './GaneshaAvatar';

export default function IdolShopMain() {
  const router = useRouter();

  // Customization state
  const [config, setConfig] = useState<GaneshaCustomization>(DEFAULT_GANESHA_CONFIG);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('face');
  const [rotation, setRotation] = useState<number>(0);
  const [tilt, setTilt] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1.0);

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  // Vighnas & unlock progression
  const [playerVighnas, setPlayerVighnas] = useState<number>(0);
  const [unlockAllDevoteeMode, setUnlockAllDevoteeMode] = useState<boolean>(false);

  // Saved designs collection
  const [savedDesigns, setSavedDesigns] = useState<SavedGaneshaDesign[]>([]);
  const [activeAvatarId, setActiveAvatarId] = useState<string>('');
  const [isCollectionOpen, setIsCollectionOpen] = useState<boolean>(false);

  // Presentation / Completion view
  const [showReadyModal, setShowReadyModal] = useState<boolean>(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interactive 3D Drag Rotation
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartX = useRef<number>(0);
  const dragStartRot = useRef<number>(0);

  // Save Modal state
  const [isNamingModalOpen, setIsNamingModalOpen] = useState<boolean>(false);
  const [idolNameInput, setIdolNameInput] = useState<string>('My Divine Ganesha');

  // Load initial data
  useEffect(() => {
    setIsMuted(audioEngine.getMuted());
    const stats = getStoredPlayerStats();
    setPlayerVighnas(stats.total_vighnas ?? 0);

    const designs = getSavedGaneshaDesigns();
    setSavedDesigns(designs);

    const currentAvatar = getActiveGaneshaAvatar();
    if (currentAvatar) {
      setActiveAvatarId(currentAvatar.id);
    }
  }, []);

  const handleToggleMute = () => {
    const next = audioEngine.toggleMute();
    setIsMuted(next);
  };

  // Check how many categories are customized/touched
  const customizedCount = useMemo(() => {
    let count = 0;
    const defaultVals = DEFAULT_GANESHA_CONFIG;
    if (config.face) count++;
    if (config.eyes) count++;
    if (config.trunk) count++;
    if (config.ears) count++;
    if (config.crown) count++;
    if (config.clothes) count++;
    if (config.jewellery) count++;
    if (config.tilak) count++;
    if (config.flowers) count++;
    if (config.aura) count++;
    if (config.mushika) count++;
    if (config.skinColor && config.clothesColor) count++;
    return count;
  }, [config]);

  // Items for the selected category
  const currentCategoryItems = useMemo(() => {
    return SHOP_ITEMS.filter(item => item.categoryId === activeCategory);
  }, [activeCategory]);

  // Handle Item Selection
  const handleSelectItem = (item: ShopItem) => {
    const isLocked = !unlockAllDevoteeMode && playerVighnas < item.vighnasRequired;
    if (isLocked) {
      audioEngine.playShopItemLocked();
      setErrorMessage(`Unlock this item by destroying ${item.vighnasRequired} Vighnas in the runner!`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const isRare = item.rarity === 'Epic' || item.rarity === 'Divine';
    audioEngine.playShopItemSelect(isRare);

    setConfig(prev => ({
      ...prev,
      [item.categoryId]: item.id
    }));
  };

  // Surprise Me - Generate harmonious combination
  const handleSurpriseMe = () => {
    audioEngine.playSurpriseMe();

    // Pick random items per category
    const getRandomItem = (cat: CategoryId) => {
      const items = SHOP_ITEMS.filter(it => it.categoryId === cat);
      const available = unlockAllDevoteeMode ? items : items.filter(it => it.vighnasRequired <= playerVighnas);
      const pool = available.length > 0 ? available : items;
      return pool[Math.floor(Math.random() * pool.length)].id;
    };

    const randomSkin = SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)].hex;
    const randomClothes = CLOTHES_COLORS[Math.floor(Math.random() * CLOTHES_COLORS.length)].hex;
    const randomDeco = DECORATION_COLORS[Math.floor(Math.random() * DECORATION_COLORS.length)].hex;

    const newConfig: GaneshaCustomization = {
      face: getRandomItem('face'),
      eyes: getRandomItem('eyes'),
      trunk: getRandomItem('trunk'),
      ears: getRandomItem('ears'),
      crown: getRandomItem('crown'),
      clothes: getRandomItem('clothes'),
      jewellery: getRandomItem('jewellery'),
      tilak: getRandomItem('tilak'),
      flowers: getRandomItem('flowers'),
      aura: getRandomItem('aura'),
      mushika: getRandomItem('mushika'),
      skinColor: randomSkin,
      clothesColor: randomClothes,
      decorationColor: randomDeco
    };

    setConfig(newConfig);

    // Particle fanfare
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF671F', '#FFE57F', '#FFFFFF']
    });
  };

  // Reset to starter design
  const handleReset = () => {
    audioEngine.playShopItemSelect();
    setConfig(DEFAULT_GANESHA_CONFIG);
    setRotation(0);
    setTilt(0);
    setZoom(1.0);
  };

  // Open Save Ganesha prompt
  const handleOpenSavePrompt = () => {
    setIdolNameInput(`Shree Ganesha #${Math.floor(Math.random() * 900 + 100)}`);
    setIsNamingModalOpen(true);
  };

  // Save Ganesha Design
  const handleSaveDesign = () => {
    try {
      const newDesign: SavedGaneshaDesign = {
        id: `idol_${Date.now()}`,
        name: idolNameInput.trim() || 'My Sacred Ganesha',
        createdAt: new Date().toISOString(),
        config: { ...config }
      };

      saveGaneshaDesign(newDesign);
      const updated = getSavedGaneshaDesigns();
      setSavedDesigns(updated);
      setIsNamingModalOpen(false);

      audioEngine.playShopComplete();
      setSaveSuccessToast(`Saved "${newDesign.name}" to My Ganesha Collection!`);
      setTimeout(() => setSaveSuccessToast(null), 3500);

      // Trigger Confetti
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FF671F', '#E11D48', '#FFE57F']
      });
    } catch {
      setErrorMessage("We couldn't save your Ganesh. Please try again.");
      setTimeout(() => setErrorMessage(null), 3500);
    }
  };

  // Set selected design as player avatar
  const handleSetAvatar = (designId: string) => {
    setActiveGaneshaAvatar(designId);
    setActiveAvatarId(designId);
    audioEngine.playShopItemUnlock();

    setSaveSuccessToast('Ganesha set as your player avatar across the entire game!');
    setTimeout(() => setSaveSuccessToast(null), 3500);
  };

  // Delete saved design
  const handleDeleteDesign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteGaneshaDesign(id);
    const updated = getSavedGaneshaDesigns();
    setSavedDesigns(updated);
    if (activeAvatarId === id && updated.length > 0) {
      setActiveAvatarId(updated[0].id);
    }
  };

  // Load saved design into workshop
  const handleLoadDesign = (saved: SavedGaneshaDesign) => {
    setConfig(saved.config);
    setIsCollectionOpen(false);
    audioEngine.playShopItemSelect();
  };

  // Ready / Complete presentation trigger
  const handleOpenReadyModal = () => {
    audioEngine.playShopComplete();
    setShowReadyModal(true);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FF671F', '#FFFFFF', '#F59E0B']
    });
  };

  // Pointer drag to rotate idol
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRot.current = rotation;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    const newRot = Math.max(-45, Math.min(45, dragStartRot.current + deltaX * 0.4));
    setRotation(newRot);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 15%, #181534 0%, #0B0E1A 60%, #05070D 100%)',
        color: '#FFF7ED',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: 'linear-gradient(135deg, rgba(20, 26, 46, 0.98) 0%, rgba(10, 14, 26, 0.98) 100%)',
            border: '2px solid var(--gold-divine, #FFD700)',
            boxShadow: '0 0 30px rgba(255, 184, 0, 0.5)',
            color: '#FFE57F',
            padding: '12px 24px',
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 700,
            fontSize: 14,
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <Sparkles size={18} color="#FFD700" />
          <span>{saveSuccessToast}</span>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: 'rgba(220, 38, 38, 0.95)',
            color: '#FFF',
            padding: '12px 24px',
            borderRadius: 9999,
            boxShadow: '0 0 25px rgba(220, 38, 38, 0.6)',
            fontSize: 14,
            fontWeight: 700
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header
        style={{
          padding: '14px 24px',
          borderBottom: '1px solid rgba(255, 184, 0, 0.2)',
          background: 'rgba(8, 11, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link
            href="/arcade"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#CBD5E1',
              fontSize: 13,
              fontWeight: 700
            }}
          >
            <ArrowLeft size={16} />
            <span>ARCADE</span>
          </Link>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>🐘</span>
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #FFF7ED 0%, #FFD700 50%, #FF671F 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: 1.2
                }}
              >
                GANESH IDOL SHOP
              </h1>
            </div>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>
              Create your own beautiful Ganesh idol.
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Vighna Status Badge */}
          <div
            title="Vighnas destroyed in runner - unlocks rare artisan items"
            style={{
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(255, 103, 31, 0.15)',
              border: '1px solid rgba(255, 103, 31, 0.4)',
              color: '#FF884D',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Award size={14} color="#FF884D" />
            <span>{playerVighnas} / 108 VIGHNAS</span>
          </div>

          {/* Devotee Blessing Unlock Toggle (Testing/Demo convenience) */}
          <button
            onClick={() => setUnlockAllDevoteeMode(!unlockAllDevoteeMode)}
            title="Toggle Devotee Blessing Mode (preview all locked items)"
            style={{
              padding: '6px 12px',
              borderRadius: 9999,
              background: unlockAllDevoteeMode ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${unlockAllDevoteeMode ? '#22C55E' : 'rgba(255, 255, 255, 0.1)'}`,
              color: unlockAllDevoteeMode ? '#4ADE80' : '#94A3B8',
              fontSize: 11,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Crown size={13} />
            <span>{unlockAllDevoteeMode ? 'BLESSING ACTIVE (ALL UNLOCKED)' : 'PROGRESSION MODE'}</span>
          </button>

          {/* My Designs Button */}
          <button
            onClick={() => setIsCollectionOpen(true)}
            style={{
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(255, 184, 0, 0.15)',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              color: '#FFD700',
              fontSize: 13,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Heart size={14} fill="#FFD700" />
            <span>MY GANESHA ({savedDesigns.length})</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            style={{
              padding: 8,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFE57F'
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(360px, 1.35fr)',
          maxWidth: 1440,
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(16px, 2.5vw, 28px)',
          gap: 'clamp(16px, 3vw, 36px)',
          alignItems: 'start'
        }}
        className="idol-shop-container"
      >
        {/* ==========================================================
            LEFT SIDE: LARGE GANESHA PREVIEW STAGE
           ========================================================== */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            position: 'sticky',
            top: 86
          }}
          className="idol-preview-section"
        >
          {/* Main Display Card */}
          <div
            className="glass-card-gold"
            style={{
              borderRadius: 28,
              padding: '24px 16px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(26, 32, 54, 0.9) 0%, rgba(12, 16, 32, 0.95) 100%)',
              border: '2px solid rgba(255, 184, 0, 0.4)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.7), 0 0 35px rgba(255, 184, 0, 0.15)',
              minHeight: 460,
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Top Badge: Sanskrit Blessing */}
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 18,
                fontSize: 12,
                fontWeight: 800,
                color: '#FFE57F',
                letterSpacing: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>ॐ गं गणपतये नमः</span>
            </div>

            {/* Quick 3D Drag Hint */}
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 18,
                fontSize: 11,
                color: '#94A3B8',
                background: 'rgba(0,0,0,0.4)',
                padding: '3px 10px',
                borderRadius: 9999,
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              Drag to Rotate 3D
            </div>

            {/* SVG Ganesha Idol Renderer */}
            <div style={{ width: '100%', maxWidth: 420, height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GaneshaIdolRenderer
                config={config}
                rotation={rotation}
                tilt={tilt}
                zoom={zoom}
                showPlatform={true}
                interactive={isDragging}
                animateIdle={!isDragging}
              />
            </div>

            {/* Interactive Rotate & Zoom Control Toolbar */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px 4px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                gap: 12,
                flexWrap: 'wrap'
              }}
            >
              {/* Rotate Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 150 }}>
                <RotateCw size={14} color="#FFD700" />
                <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>ROTATE</span>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={rotation}
                  onChange={e => setRotation(Number(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: '#FFB800',
                    cursor: 'pointer',
                    height: 4
                  }}
                />
                <span style={{ fontSize: 11, color: '#FFE57F', width: 26, textAlign: 'right' }}>
                  {rotation}°
                </span>
              </div>

              {/* Zoom Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginRight: 2 }}>ZOOM</span>
                <button
                  onClick={() => setZoom(prev => Math.max(0.75, Number((prev - 0.1).toFixed(2))))}
                  title="Zoom Out"
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFF'
                  }}
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={() => setZoom(1.0)}
                  title="Reset Zoom"
                  style={{
                    padding: '4px 8px',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFE57F',
                    fontSize: 11,
                    fontWeight: 700
                  }}
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  onClick={() => setZoom(prev => Math.min(1.35, Number((prev + 0.1).toFixed(2))))}
                  title="Zoom In"
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFF'
                  }}
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Button Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 10,
              width: '100%'
            }}
          >
            {/* SURPRISE ME */}
            <button
              onClick={handleSurpriseMe}
              style={{
                padding: '12px 16px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.25) 0%, rgba(255, 103, 31, 0.35) 100%)',
                border: '1.5px solid #FFD700',
                color: '#FFE57F',
                fontWeight: 900,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(255, 184, 0, 0.2)'
              }}
            >
              <Sparkles size={16} color="#FFD700" />
              <span>✨ SURPRISE ME</span>
            </button>

            {/* RESET DESIGN */}
            <button
              onClick={handleReset}
              style={{
                padding: '12px 16px',
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#94A3B8',
                fontWeight: 800,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <RotateCcw size={15} />
              <span>RESET DESIGN</span>
            </button>

            {/* PRESENTATION / READY */}
            <button
              onClick={handleOpenReadyModal}
              style={{
                padding: '12px 16px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, #FF671F 0%, #FFB800 100%)',
                color: '#080B14',
                fontWeight: 900,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 20px rgba(255, 184, 0, 0.4)'
              }}
            >
              <Eye size={16} fill="#080B14" />
              <span>VIEW READY IDOL</span>
            </button>
          </div>
        </section>

        {/* ==========================================================
            RIGHT SIDE: CUSTOMIZATION / ARTISAN SHOP PANEL
           ========================================================== */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}
          className="idol-shop-panel"
        >
          {/* Panel Header & Progress Indicator */}
          <div
            className="glass-card-gold"
            style={{
              padding: '20px 24px',
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#FF884D', letterSpacing: 1.5 }}>
                  दिव्य शिल्पकला संकुल
                </span>
                <h2
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 'clamp(20px, 3.5vw, 26px)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.2
                  }}
                >
                  GANESH ARTISAN SHOP
                </h2>
              </div>

              <button
                onClick={handleOpenSavePrompt}
                style={{
                  padding: '10px 20px',
                  borderRadius: 9999,
                  background: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
                  color: '#080B14',
                  fontWeight: 900,
                  fontSize: 13,
                  letterSpacing: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 0 20px rgba(255, 184, 0, 0.4)'
                }}
              >
                <Save size={16} fill="#080B14" />
                <span>SAVE GANESHA</span>
              </button>
            </div>

            {/* Progress Indicator: YOUR GANESHA 8 / 12 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: '#FFE57F' }}>
                  YOUR GANESHA DESIGN PROGRESS
                </span>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#FFD700' }}>
                  {customizedCount} / 12 PARTS
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 10,
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  padding: 2,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                <div
                  style={{
                    width: `${(customizedCount / 12) * 100}%`,
                    height: '100%',
                    borderRadius: 9999,
                    background: 'linear-gradient(90deg, #FF671F, #FFB800, #FFE57F)',
                    transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 0 10px rgba(255, 184, 0, 0.8)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* HORIZONTAL CATEGORY MENU */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 6,
              scrollbarWidth: 'none'
            }}
          >
            {CATEGORIES.map(cat => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    audioEngine.playShopItemSelect();
                    setActiveCategory(cat.id);
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 16,
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(255, 184, 0, 0.25) 0%, rgba(255, 103, 31, 0.35) 100%)'
                      : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1.5px solid var(--gold-divine, #FFD700)' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#FFE57F' : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: isSelected ? 800 : 600,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 16px rgba(255, 184, 0, 0.25)' : 'none'
                  }}
                >
                  <span style={{ fontSize: 16 }}>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* ==========================================================
              CATEGORY CONTENT: COLORS OR ITEMS GRID
             ========================================================== */}
          {activeCategory === 'colors' ? (
            /* COLOR CUSTOMIZATION PANEL */
            <div
              className="glass-card-gold"
              style={{
                padding: '24px',
                borderRadius: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 24
              }}
            >
              {/* IDOL / SKIN COLOR */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Palette size={16} color="#FFD700" />
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFF' }}>
                    Idol Material & Skin Color
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {SKIN_COLORS.map(c => {
                    const isPicked = config.skinColor === c.hex;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          audioEngine.playShopItemSelect();
                          setConfig(p => ({ ...p, skinColor: c.hex }));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 14,
                          background: isPicked ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: isPicked ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: c.hex,
                            border: '1.5px solid #FFF',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ textAlign: 'left', fontSize: 12 }}>
                          <div style={{ fontWeight: 700, color: isPicked ? '#FFE57F' : '#E2E8F0' }}>{c.name}</div>
                          <div style={{ fontSize: 10, color: '#94A3B8' }}>{c.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CLOTHES / DHOTI COLOR */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Palette size={16} color="#FF671F" />
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFF' }}>
                    Clothes & Dhoti Silk Color
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {CLOTHES_COLORS.map(c => {
                    const isPicked = config.clothesColor === c.hex;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          audioEngine.playShopItemSelect();
                          setConfig(p => ({ ...p, clothesColor: c.hex }));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 14,
                          background: isPicked ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: isPicked ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: c.hex,
                            border: '1.5px solid #FFF',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ textAlign: 'left', fontSize: 12 }}>
                          <div style={{ fontWeight: 700, color: isPicked ? '#FFE57F' : '#E2E8F0' }}>{c.name}</div>
                          <div style={{ fontSize: 10, color: '#94A3B8' }}>{c.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DECORATION / JEWELLERY COLOR */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Palette size={16} color="#FFE57F" />
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFF' }}>
                    Decoration & Metalwork
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {DECORATION_COLORS.map(c => {
                    const isPicked = config.decorationColor === c.hex;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          audioEngine.playShopItemSelect();
                          setConfig(p => ({ ...p, decorationColor: c.hex }));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 14,
                          background: isPicked ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: isPicked ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: c.hex,
                            border: '1.5px solid #FFF',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ textAlign: 'left', fontSize: 12 }}>
                          <div style={{ fontWeight: 700, color: isPicked ? '#FFE57F' : '#E2E8F0' }}>{c.name}</div>
                          <div style={{ fontSize: 10, color: '#94A3B8' }}>{c.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ITEM CARDS GRID */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))',
                gap: 14
              }}
            >
              {currentCategoryItems.map(item => {
                const isSelected = config[activeCategory as keyof GaneshaCustomization] === item.id;
                const isLocked = !unlockAllDevoteeMode && playerVighnas < item.vighnasRequired;

                // Rarity styling
                const rarityBadgeColor =
                  item.rarity === 'Divine' ? '#38BDF8' :
                  item.rarity === 'Epic' ? '#A855F7' :
                  item.rarity === 'Rare' ? '#EAB308' : '#94A3B8';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(255, 184, 0, 0.22) 0%, rgba(255, 103, 31, 0.28) 100%)'
                        : (isLocked ? 'rgba(15, 20, 32, 0.6)' : 'linear-gradient(180deg, rgba(22, 30, 52, 0.75) 0%, rgba(14, 18, 34, 0.85) 100%)'),
                      border: isSelected
                        ? '2px solid #FFD700'
                        : (isLocked ? '1px dashed rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 184, 0, 0.2)'),
                      borderRadius: 20,
                      padding: '16px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: isSelected ? 'scale(1.02)' : 'none',
                      boxShadow: isSelected
                        ? '0 0 25px rgba(255, 184, 0, 0.4), inset 0 0 15px rgba(255, 184, 0, 0.15)'
                        : '0 4px 14px rgba(0, 0, 0, 0.4)',
                      opacity: isLocked ? 0.72 : 1
                    }}
                  >
                    {/* Rarity & Unlock status badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: 1,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: `${rarityBadgeColor}20`,
                          color: rarityBadgeColor,
                          border: `1px solid ${rarityBadgeColor}50`
                        }}
                      >
                        ✦ {item.rarity.toUpperCase()}
                      </span>

                      {isLocked ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F87171', fontSize: 11, fontWeight: 800 }}>
                          <Lock size={12} />
                        </div>
                      ) : isSelected ? (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: '#FFD700',
                            color: '#080B14',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 10px #FFD700'
                          }}
                        >
                          <Check size={12} strokeWidth={3.5} />
                        </div>
                      ) : null}
                    </div>

                    {/* Item Icon */}
                    <div
                      style={{
                        fontSize: 34,
                        marginBottom: 10,
                        filter: isSelected ? 'drop-shadow(0 0 12px rgba(255, 184, 0, 0.8))' : 'none',
                        transition: 'transform 0.2s',
                        transform: isSelected ? 'scale(1.12)' : 'none'
                      }}
                    >
                      {item.icon}
                    </div>

                    {/* Item Name */}
                    <div style={{ fontWeight: 800, fontSize: 14, color: isSelected ? '#FFE57F' : '#FFFFFF', lineHeight: 1.2, marginBottom: 2 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#FF884D', fontWeight: 600, marginBottom: 8 }}>
                      {item.hindiName}
                    </div>

                    {/* Description or Unlock Requirement */}
                    {isLocked ? (
                      <div
                        style={{
                          marginTop: 'auto',
                          fontSize: 11,
                          color: '#F87171',
                          fontWeight: 800,
                          padding: '6px 8px',
                          borderRadius: 8,
                          background: 'rgba(239, 68, 68, 0.15)',
                          width: '100%'
                        }}
                      >
                        UNLOCK AT {item.vighnasRequired} VIGHNAS
                      </div>
                    ) : (
                      <div
                        style={{
                          marginTop: 'auto',
                          width: '100%',
                          padding: '6px',
                          borderRadius: 10,
                          background: isSelected ? 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)' : 'rgba(255, 255, 255, 0.05)',
                          color: isSelected ? '#080B14' : '#94A3B8',
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: 1
                        }}
                      >
                        {isSelected ? 'EQUIPPED' : 'SELECT'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ==========================================================
          MODAL 1: GANESHA READY COMPLETION PRESENTATION
         ========================================================== */}
      {showReadyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            background: 'rgba(4, 7, 15, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            className="glass-card-gold"
            style={{
              maxWidth: 580,
              width: '100%',
              borderRadius: 32,
              padding: '36px 28px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              border: '2px solid #FFD700',
              boxShadow: '0 0 60px rgba(255, 184, 0, 0.45)',
              position: 'relative',
              animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <button
              onClick={() => setShowReadyModal(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                padding: 6,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#CBD5E1'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ fontSize: 13, fontWeight: 900, color: '#FFD700', letterSpacing: 2 }}>
              ✦ SACRED IDOL CREATION COMPLETE ✦
            </div>

            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(26px, 5vw, 36px)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FF671F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1
              }}
            >
              ✨ GANESHA READY ✨
            </h2>

            {/* Showcase Stage */}
            <div
              style={{
                width: '100%',
                maxWidth: 360,
                height: 360,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GaneshaIdolRenderer
                config={config}
                rotation={0}
                tilt={0}
                zoom={1.1}
                showPlatform={true}
                animateIdle={true}
              />
            </div>

            {/* Completion Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                width: '100%',
                marginTop: 6
              }}
            >
              <button
                onClick={() => {
                  setShowReadyModal(false);
                  handleOpenSavePrompt();
                }}
                className="btn-primary"
                style={{ width: '100%', fontSize: 14, padding: '14px 20px' }}
              >
                <Save size={18} />
                <span>SAVE GANESHA</span>
              </button>

              <button
                onClick={() => {
                  handleSurpriseMe();
                }}
                className="btn-secondary"
                style={{ width: '100%', fontSize: 14, padding: '14px 20px' }}
              >
                <Sparkles size={18} />
                <span>RANDOMIZE</span>
              </button>

              <button
                onClick={() => setShowReadyModal(false)}
                className="btn-secondary"
                style={{ width: '100%', fontSize: 14, padding: '14px 20px' }}
              >
                <Sliders size={18} />
                <span>EDIT AGAIN</span>
              </button>

              <Link
                href="/game"
                className="btn-primary"
                style={{
                  width: '100%',
                  fontSize: 14,
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, #FF671F 0%, #E11D48 100%)',
                  color: '#FFF'
                }}
              >
                <Play size={18} fill="#FFF" />
                <span>PLAY GAME</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL 2: NAME & SAVE GANESHA
         ========================================================== */}
      {isNamingModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 95,
            background: 'rgba(5, 7, 15, 0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            className="glass-card-gold"
            style={{
              maxWidth: 440,
              width: '100%',
              borderRadius: 24,
              padding: '28px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 18
            }}
          >
            <div style={{ fontSize: 36 }}>🕉️</div>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 900, color: '#FFF' }}>
              NAME YOUR GANESHA
            </h3>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              Give your handcrafted divine idol a memorable name to save it to your personal gallery.
            </p>

            <input
              type="text"
              value={idolNameInput}
              onChange={e => setIdolNameInput(e.target.value)}
              placeholder="e.g. Lalbaugcha Raja 2026"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 14,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 184, 0, 0.4)',
                color: '#FFE57F',
                fontSize: 15,
                fontWeight: 700,
                outline: 'none',
                textAlign: 'center'
              }}
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveDesign();
                }
              }}
            />

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button
                onClick={() => setIsNamingModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 14,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#94A3B8',
                  fontWeight: 700
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveDesign}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
                  color: '#080B14',
                  fontWeight: 900
                }}
              >
                SAVE DESIGN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL 3: MY GANESHA DESIGNS COLLECTION GALLERY
         ========================================================== */}
      {isCollectionOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            background: 'rgba(5, 7, 15, 0.9)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            className="glass-card-gold"
            style={{
              maxWidth: 780,
              width: '100%',
              maxHeight: '88vh',
              borderRadius: 28,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#FF884D', letterSpacing: 1.5 }}>
                  मेरी गणेश कृतियाँ
                </span>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 900, color: '#FFF' }}>
                  MY GANESHA DESIGNS
                </h2>
              </div>
              <button
                onClick={() => setIsCollectionOpen(false)}
                style={{
                  padding: 8,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFF'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Collection Grid */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16,
                paddingRight: 4
              }}
            >
              {savedDesigns.map(design => {
                const isCurrentAvatar = activeAvatarId === design.id;
                return (
                  <div
                    key={design.id}
                    style={{
                      background: isCurrentAvatar
                        ? 'linear-gradient(180deg, rgba(255, 184, 0, 0.18) 0%, rgba(26, 34, 58, 0.9) 100%)'
                        : 'rgba(20, 26, 46, 0.85)',
                      border: isCurrentAvatar ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 20,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: isCurrentAvatar ? '0 0 20px rgba(255, 184, 0, 0.3)' : 'none'
                    }}
                  >
                    {isCurrentAvatar && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          background: '#FFD700',
                          color: '#080B14',
                          fontSize: 10,
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: 6,
                          letterSpacing: 1
                        }}
                      >
                        CURRENT AVATAR
                      </div>
                    )}

                    {/* Miniature Avatar Preview */}
                    <div style={{ width: 120, height: 130, marginBottom: 10 }}>
                      <GaneshaIdolRenderer
                        config={design.config}
                        size="100%"
                        showPlatform={false}
                        animateIdle={false}
                      />
                    </div>

                    <div style={{ fontWeight: 800, fontSize: 15, color: '#FFF', textAlign: 'center', marginBottom: 2 }}>
                      {design.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12 }}>
                      {new Date(design.createdAt).toLocaleDateString()}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', marginTop: 'auto' }}>
                      <button
                        onClick={() => handleSetAvatar(design.id)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 10,
                          background: isCurrentAvatar ? 'rgba(255, 184, 0, 0.2)' : 'linear-gradient(135deg, #FFB800 0%, #FF671F 100%)',
                          color: isCurrentAvatar ? '#FFE57F' : '#080B14',
                          fontWeight: 900,
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}
                      >
                        <Crown size={13} />
                        <span>{isCurrentAvatar ? 'ACTIVE AVATAR' : 'USE AS MY GANESHA'}</span>
                      </button>

                      <div style={{ display: 'flex', gap: 6, width: '100%' }}>
                        <button
                          onClick={() => handleLoadDesign(design)}
                          style={{
                            flex: 1,
                            padding: '6px',
                            borderRadius: 8,
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: '#CBD5E1',
                            fontSize: 12,
                            fontWeight: 700
                          }}
                        >
                          EDIT
                        </button>
                        <button
                          onClick={e => handleDeleteDesign(design.id, e)}
                          title="Delete Design"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#F87171'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
