import { CategoryId, ShopItem, GaneshaCustomization, ColorSwatch, SavedGaneshaDesign } from '@/types/idolShop';

export const CATEGORIES: { id: CategoryId; name: string; hindi: string; icon: string }[] = [
  { id: 'face', name: 'Face', hindi: 'मुख', icon: '🙂' },
  { id: 'eyes', name: 'Eyes', hindi: 'नेत्र', icon: '👁️' },
  { id: 'trunk', name: 'Trunk', hindi: 'सूंड', icon: '🐘' },
  { id: 'ears', name: 'Ears', hindi: 'कर्ण', icon: '👂' },
  { id: 'crown', name: 'Crown', hindi: 'मुकुट', icon: '👑' },
  { id: 'clothes', name: 'Clothes', hindi: 'वस्त्र', icon: '👘' },
  { id: 'jewellery', name: 'Jewellery', hindi: 'आभूषण', icon: '📿' },
  { id: 'tilak', name: 'Tilak', hindi: 'तिलक', icon: '🔱' },
  { id: 'flowers', name: 'Flowers', hindi: 'पुष्प', icon: '🌺' },
  { id: 'aura', name: 'Aura', hindi: 'प्रभामंडल', icon: '✨' },
  { id: 'mushika', name: 'Mushika', hindi: 'मूषक', icon: '🐭' },
  { id: 'colors', name: 'Colors', hindi: 'रंग', icon: '🎨' }
];

export const SHOP_ITEMS: ShopItem[] = [
  // --- FACE ---
  {
    id: 'face_bal',
    categoryId: 'face',
    name: 'Bal Ganesha',
    hindiName: 'बाल गणेश',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '👶',
    description: 'Sweet, youthful countenance radiating innocence and joyous divine warmth.'
  },
  {
    id: 'face_gentle',
    categoryId: 'face',
    name: 'Divine Gentle',
    hindiName: 'सौम्य दिव्य',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🕊️',
    description: 'Classic serene expression with gentle curves and calm blessings.'
  },
  {
    id: 'face_raja',
    categoryId: 'face',
    name: 'Majestic Raja',
    hindiName: 'राजाधिराज',
    rarity: 'Rare',
    vighnasRequired: 20,
    icon: '🦁',
    description: 'Regal sovereign features commanding reverence across the festival darbar.'
  },
  {
    id: 'face_lalbaug',
    categoryId: 'face',
    name: 'Radiant Lalbaugcha',
    hindiName: 'लालबाग स्वरूप',
    rarity: 'Epic',
    vighnasRequired: 50,
    icon: '🌟',
    description: 'Celebrated artisan craft known across millions of festival devotees.'
  },
  {
    id: 'face_yogic',
    categoryId: 'face',
    name: 'Meditative Yogic',
    hindiName: 'योग ध्यान',
    rarity: 'Divine',
    vighnasRequired: 80,
    icon: '🧘',
    description: 'Deep transcendental state of eternal bliss and profound spiritual peace.'
  },

  // --- EYES ---
  {
    id: 'eyes_lotus',
    categoryId: 'eyes',
    name: 'Lotus Eyes',
    hindiName: 'कमलनयन',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🪷',
    description: 'Gracefully contoured lotus-petal eyes that bestow auspicious favor.'
  },
  {
    id: 'eyes_compassionate',
    categoryId: 'eyes',
    name: 'Compassionate',
    hindiName: 'कृपालु दृष्टि',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '💖',
    description: 'Soft loving gaze embracing every devotee with protective motherly grace.'
  },
  {
    id: 'eyes_smiling',
    categoryId: 'eyes',
    name: 'Smiling Divine',
    hindiName: 'मृदु मुस्कान',
    rarity: 'Rare',
    vighnasRequired: 15,
    icon: '😊',
    description: 'Playful twinkling eyes brimming with celestial delight and sweet humor.'
  },
  {
    id: 'eyes_meditative',
    categoryId: 'eyes',
    name: 'Meditative Closed',
    hindiName: 'ध्यानस्थ',
    rarity: 'Rare',
    vighnasRequired: 30,
    icon: '😌',
    description: 'Half-closed inward gaze immersed in primordial Om vibrations.'
  },
  {
    id: 'eyes_royal',
    categoryId: 'eyes',
    name: 'Royal Almond',
    hindiName: 'राजसी नयन',
    rarity: 'Epic',
    vighnasRequired: 50,
    icon: '👁️',
    description: 'Sharp almond eyes with kohl rimming and regal focus.'
  },
  {
    id: 'eyes_star',
    categoryId: 'eyes',
    name: 'Bright Star Eyes',
    hindiName: 'नक्षत्र प्रभा',
    rarity: 'Divine',
    vighnasRequired: 75,
    icon: '✨',
    description: 'Twinkling celestial pupils glowing with primordial golden starlight.'
  },

  // --- TRUNK ---
  {
    id: 'trunk_idampuri',
    categoryId: 'trunk',
    name: 'Idampuri (Left-Curved)',
    hindiName: 'इडंपुरी सूंड',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '↩️',
    description: 'Most popular auspicious trunk turning gently to the left towards the modak bowl.'
  },
  {
    id: 'trunk_valampuri',
    categoryId: 'trunk',
    name: 'Valampuri (Right-Curved)',
    hindiName: 'वालंपुरी सूंड',
    rarity: 'Rare',
    vighnasRequired: 25,
    icon: '↪️',
    description: 'Rare Dakshinabhimukhi trunk turning rightward, representing powerful solar energy.'
  },
  {
    id: 'trunk_modak',
    categoryId: 'trunk',
    name: 'Modak-Holding',
    hindiName: 'मोदक प्रिय',
    rarity: 'Rare',
    vighnasRequired: 25,
    icon: '🍬',
    description: 'Playfully grasping a freshly prepared sweet golden modak at the trunk tip.'
  },
  {
    id: 'trunk_bell',
    categoryId: 'trunk',
    name: 'Sacred Bell',
    hindiName: 'घंटिका सूंड',
    rarity: 'Epic',
    vighnasRequired: 60,
    icon: '🔔',
    description: 'Finished with a miniature golden temple bell that chimes during rituals.'
  },
  {
    id: 'trunk_jeweled',
    categoryId: 'trunk',
    name: 'Jeweled Lotus Tip',
    hindiName: 'रत्न कमल सूंड',
    rarity: 'Divine',
    vighnasRequired: 90,
    icon: '🌸',
    description: 'Holding a radiant pink lotus bud encrusted in diamonds and fine gold leaf.'
  },

  // --- EARS ---
  {
    id: 'ears_traditional',
    categoryId: 'ears',
    name: 'Traditional Fan',
    hindiName: 'सूप कर्ण',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🪭',
    description: 'Auspicious winnowing fan-shaped ears that separate truth from illusion.'
  },
  {
    id: 'ears_filigree',
    categoryId: 'ears',
    name: 'Royal Filigree',
    hindiName: 'स्वर्ण जाली कर्ण',
    rarity: 'Rare',
    vighnasRequired: 20,
    icon: '👑',
    description: 'Intricate golden jaali patterns tracing the outer edge of both ears.'
  },
  {
    id: 'ears_lotus',
    categoryId: 'ears',
    name: 'Lotus Trim',
    hindiName: 'कमल पंखुड़ी कर्ण',
    rarity: 'Rare',
    vighnasRequired: 35,
    icon: '🪷',
    description: 'Soft lotus petal silhouettes outlining the gentle curve of the ears.'
  },
  {
    id: 'ears_graceful',
    categoryId: 'ears',
    name: 'Minimalist Graceful',
    hindiName: 'सरल कर्ण',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🍃',
    description: 'Sleek, fluid artisan outline with modern temple elegance.'
  },
  {
    id: 'ears_kundan',
    categoryId: 'ears',
    name: 'Kundan Jeweled',
    hindiName: 'कुंदन सज्जित कर्ण',
    rarity: 'Divine',
    vighnasRequired: 80,
    icon: '💎',
    description: 'Glistening rubies, emeralds, and uncut Kundan gems along the temple lobes.'
  },

  // --- CROWN ---
  {
    id: 'crown_traditional',
    categoryId: 'crown',
    name: 'Traditional Crown',
    hindiName: 'पारंपरिक मुकुट',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '👑',
    description: 'Tiered golden kalash finial honoring timeless temple sculpture aesthetics.'
  },
  {
    id: 'crown_gold',
    categoryId: 'crown',
    name: 'Golden Crown',
    hindiName: 'स्वर्ण मुकुट',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🪙',
    description: 'Carved 24k gold crown with sunburst motifs and sparkling borders.'
  },
  {
    id: 'crown_festival',
    categoryId: 'crown',
    name: 'Festival Crown',
    hindiName: 'उत्सव मुकुट',
    rarity: 'Rare',
    vighnasRequired: 10,
    icon: '🎉',
    description: 'Adorned with festival ribbons, peacock feathers, and colorful gems.'
  },
  {
    id: 'crown_royal',
    categoryId: 'crown',
    name: 'Royal Crown',
    hindiName: 'शाही मुकुट',
    rarity: 'Rare',
    vighnasRequired: 40,
    icon: '🤴',
    description: 'Imperial darbar crown featuring crimson velvets and towering crests.'
  },
  {
    id: 'crown_lotus',
    categoryId: 'crown',
    name: 'Lotus Crown',
    hindiName: 'कमल मुकुट',
    rarity: 'Epic',
    vighnasRequired: 65,
    icon: '🪷',
    description: 'Sculpted blooming thousand-petaled Sahasrara lotus seat at the crown summit.'
  },
  {
    id: 'crown_divine',
    categoryId: 'crown',
    name: 'Divine Crown',
    hindiName: 'दिव्य मुकुट',
    rarity: 'Divine',
    vighnasRequired: 90,
    icon: '🔱',
    description: 'Radiant celestial crest blazing with divine solar flames.'
  },
  {
    id: 'crown_vighnaharta',
    categoryId: 'crown',
    name: 'Vighnaharta Crown',
    hindiName: 'विघ्नहर्ता महामुकुट',
    rarity: 'Divine',
    vighnasRequired: 108,
    icon: '🏆',
    description: 'Ultimate supreme mukut bestowed upon conquering all 108 life obstacles.'
  },

  // --- CLOTHES ---
  {
    id: 'clothes_traditional',
    categoryId: 'clothes',
    name: 'Traditional Dhoti',
    hindiName: 'पारंपरिक धोती',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🥻',
    description: 'Graceful pleated silk pitambar wrap with gold zari border.'
  },
  {
    id: 'clothes_festival',
    categoryId: 'clothes',
    name: 'Festival Attire',
    hindiName: 'उत्सव परिधान',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🏮',
    description: 'Rich festive silk with auspicious swastika and kalash motifs.'
  },
  {
    id: 'clothes_orange',
    categoryId: 'clothes',
    name: 'Saffron Devotion',
    hindiName: 'भगवा वस्त्र',
    rarity: 'Rare',
    vighnasRequired: 20,
    icon: '🔥',
    description: 'Deep saffron dhoti and angavastram worn during sacred Havana yajnas.'
  },
  {
    id: 'clothes_golden',
    categoryId: 'clothes',
    name: 'Golden Brocade',
    hindiName: 'जरी वस्त्र',
    rarity: 'Rare',
    vighnasRequired: 35,
    icon: '✨',
    description: 'Pure metallic gold woven yarn catching every ray of temple aarti lamps.'
  },
  {
    id: 'clothes_royal',
    categoryId: 'clothes',
    name: 'Royal Silk Robe',
    hindiName: 'राजसी वस्त्र',
    rarity: 'Epic',
    vighnasRequired: 75,
    icon: '👑',
    description: 'Emperor robes embroidered with peacock feathers and pearls.'
  },
  {
    id: 'clothes_divine',
    categoryId: 'clothes',
    name: 'Divine Celestial',
    hindiName: 'दिव्य परिधान',
    rarity: 'Divine',
    vighnasRequired: 95,
    icon: '🌌',
    description: 'Ethereal floating silk spun from celestial clouds of Svarga.'
  },

  // --- JEWELLERY ---
  {
    id: 'jewellery_necklace',
    categoryId: 'jewellery',
    name: 'Gold Necklace',
    hindiName: 'स्वर्ण कंठहार',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '📿',
    description: 'Elegant golden pendant sitting gracefully on the chest.'
  },
  {
    id: 'jewellery_gold_chains',
    categoryId: 'jewellery',
    name: 'Layered Gold Chains',
    hindiName: 'पंचलड़ी हार',
    rarity: 'Rare',
    vighnasRequired: 25,
    icon: '⛓️',
    description: 'Triple cascade of heavy gold chains with miniature bells.'
  },
  {
    id: 'jewellery_floral',
    categoryId: 'jewellery',
    name: 'Floral Haar',
    hindiName: 'पुष्प कंठहार',
    rarity: 'Rare',
    vighnasRequired: 30,
    icon: '💐',
    description: 'Intertwined aromatic Mogra, Tulsi, and red rose buds.'
  },
  {
    id: 'jewellery_royal',
    categoryId: 'jewellery',
    name: 'Royal Navratna',
    hindiName: 'नवरत्न आभूषण',
    rarity: 'Epic',
    vighnasRequired: 60,
    icon: '💎',
    description: 'Nine celestial cosmic gemstones channeling planetary blessings.'
  },
  {
    id: 'jewellery_divine',
    categoryId: 'jewellery',
    name: 'Divine Jewellery',
    hindiName: 'दिव्य मणिमाला',
    rarity: 'Divine',
    vighnasRequired: 90,
    icon: '🔮',
    description: 'Chintamani gem necklace glowing with perpetual spiritual light.'
  },

  // --- TILAK ---
  {
    id: 'tilak_trishul',
    categoryId: 'tilak',
    name: 'Sacred Trishul',
    hindiName: 'त्रिशूल तिलक',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🔱',
    description: 'Auspicious trident tilak with golden vermilion marking Shiva-Shakti lineage.'
  },
  {
    id: 'tilak_chandan',
    categoryId: 'tilak',
    name: 'Sandalwood Crescent',
    hindiName: 'चंदन अर्धचंद्र',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🌙',
    description: 'Cool Malayagiri sandalwood paste shaped like an auspicious waxing moon.'
  },
  {
    id: 'tilak_urdhva',
    categoryId: 'tilak',
    name: 'Urdhva Pundra',
    hindiName: 'ऊर्ध्व पुण्ड्र',
    rarity: 'Rare',
    vighnasRequired: 15,
    icon: '🏛️',
    description: 'Sacred vertical white and saffron lines pointing toward transcendence.'
  },
  {
    id: 'tilak_surya',
    categoryId: 'tilak',
    name: 'Surya Bindi',
    hindiName: 'सूर्य बिंदी',
    rarity: 'Rare',
    vighnasRequired: 30,
    icon: '☀️',
    description: 'Circular solar kumkum mark radiating life and prosperity.'
  },
  {
    id: 'tilak_gold',
    categoryId: 'tilak',
    name: 'Royal Gold Tilak',
    hindiName: 'स्वर्ण भाल तिलक',
    rarity: 'Divine',
    vighnasRequired: 70,
    icon: '👑',
    description: 'Pure melted 24k gold tilak applied with royal mantras.'
  },

  // --- FLOWERS ---
  {
    id: 'flowers_marigold',
    categoryId: 'flowers',
    name: 'Marigold Garland',
    hindiName: 'गेंदा माला',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🌼',
    description: 'Bright saffron-orange marigold flowers celebrating festival joy.'
  },
  {
    id: 'flowers_rose',
    categoryId: 'flowers',
    name: 'Rose Garland',
    hindiName: 'गुलाब माला',
    rarity: 'Rare',
    vighnasRequired: 10,
    icon: '🌹',
    description: 'Fragrant velvety red roses hand-woven with silver zari thread.'
  },
  {
    id: 'flowers_lotus',
    categoryId: 'flowers',
    name: 'Sacred Lotus',
    hindiName: 'नीलकमल माला',
    rarity: 'Rare',
    vighnasRequired: 30,
    icon: '🪷',
    description: 'Fresh divine pink lotuses plucked from sacred temple ponds.'
  },
  {
    id: 'flowers_mixed',
    categoryId: 'flowers',
    name: 'Mixed Festival',
    hindiName: 'पंचपुष्प माला',
    rarity: 'Epic',
    vighnasRequired: 55,
    icon: '💐',
    description: 'Harmonious blend of marigold, hibiscus, jasmine, and lotus.'
  },
  {
    id: 'flowers_garland',
    categoryId: 'flowers',
    name: 'Grand Temple Garland',
    hindiName: 'महा पुष्पमाला',
    rarity: 'Divine',
    vighnasRequired: 85,
    icon: '🌺',
    description: 'Massive temple-grade double garland draping gracefully over both shoulders.'
  },

  // --- AURA ---
  {
    id: 'aura_none',
    categoryId: 'aura',
    name: 'None',
    hindiName: 'सरल',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '⚪',
    description: 'Clean focus on the idol with subtle soft shadows.'
  },
  {
    id: 'aura_gold',
    categoryId: 'aura',
    name: 'Golden Glow',
    hindiName: 'स्वर्ण आभामंडल',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🟡',
    description: 'Warm, comforting golden luminescence radiating outward.'
  },
  {
    id: 'aura_orange',
    categoryId: 'aura',
    name: 'Saffron Sun',
    hindiName: 'भगवा प्रभा',
    rarity: 'Rare',
    vighnasRequired: 20,
    icon: '🟠',
    description: 'Fiery auspicious dawn glow celebrating morning prarthana.'
  },
  {
    id: 'aura_divine',
    categoryId: 'aura',
    name: 'Divine Radiance',
    hindiName: 'दिव्य तेज',
    rarity: 'Rare',
    vighnasRequired: 50,
    icon: '🌟',
    description: 'Spoked sunburst rays piercing through clouds of frankincense.'
  },
  {
    id: 'aura_spark',
    categoryId: 'aura',
    name: 'Cosmic Sparks',
    hindiName: 'नक्षत्र फुहार',
    rarity: 'Epic',
    vighnasRequired: 70,
    icon: '✨',
    description: 'Shimmering floating divine embers and golden stardust particles.'
  },
  {
    id: 'aura_mandala',
    categoryId: 'aura',
    name: 'Sacred Mandala',
    hindiName: 'श्री यंत्र प्रभा',
    rarity: 'Divine',
    vighnasRequired: 100,
    icon: '☸️',
    description: 'Rotating sacred geometric mandala projecting celestial harmony.'
  },

  // --- MUSHIKA ---
  {
    id: 'mushika_none',
    categoryId: 'mushika',
    name: 'None',
    hindiName: 'कोई नहीं',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🚫',
    description: 'Focus solely on Lord Ganesha idol.'
  },
  {
    id: 'mushika_golden',
    categoryId: 'mushika',
    name: 'Golden Mushika',
    hindiName: 'स्वर्ण मूषक',
    rarity: 'Common',
    vighnasRequired: 0,
    icon: '🐭',
    description: 'Faithful divine companion crafted in polished golden bronze.'
  },
  {
    id: 'mushika_modak',
    categoryId: 'mushika',
    name: 'Modak Mushika',
    hindiName: 'मोदक मूषक',
    rarity: 'Rare',
    vighnasRequired: 25,
    icon: '🍬',
    description: 'Cute little mouse holding a giant modak with both paws.'
  },
  {
    id: 'mushika_devoted',
    categoryId: 'mushika',
    name: 'Devoted Mushika',
    hindiName: 'भक्त मूषक',
    rarity: 'Epic',
    vighnasRequired: 60,
    icon: '🙏',
    description: 'Folded paws in deep devotion looking up at Lord Ganesha.'
  },
  {
    id: 'mushika_royal',
    categoryId: 'mushika',
    name: 'Royal Charioteer',
    hindiName: 'शाही मूषक',
    rarity: 'Divine',
    vighnasRequired: 75,
    icon: '🏎️',
    description: 'Adorned in royal saddle and tiny pearl crown ready for procession.'
  }
];

// Color Swatches
export const SKIN_COLORS: ColorSwatch[] = [
  { id: 'terracotta', name: 'Terracotta Clay', hex: '#D97757', label: 'मिट्टी' },
  { id: 'orange', name: 'Festival Saffron', hex: '#FF671F', label: 'सिंदूरी' },
  { id: 'sandalwood', name: 'Sandalwood', hex: '#E6C291', label: 'चंदन' },
  { id: 'white', name: 'Makrana Marble', hex: '#F8F9FA', label: 'श्वेत संगमरमर' },
  { id: 'golden', name: 'Pure Gold', hex: '#FFD700', label: 'स्वर्ण' },
  { id: 'sky', name: 'Sky Neel', hex: '#38BDF8', label: 'नीलकंठ' }
];

export const CLOTHES_COLORS: ColorSwatch[] = [
  { id: 'orange', name: 'Saffron Silk', hex: '#FF671F', label: 'केसरिया' },
  { id: 'red', name: 'Temple Red', hex: '#DC2626', label: 'लाल' },
  { id: 'gold', name: 'Zari Gold', hex: '#F59E0B', label: 'जरी स्वर्ण' },
  { id: 'cream', name: 'Sacred Cream', hex: '#FEF3C7', label: 'चंदन श्वेत' },
  { id: 'green', name: 'Emerald Green', hex: '#059669', label: 'हरा' },
  { id: 'blue', name: 'Peacock Blue', hex: '#2563EB', label: 'मयूर नीला' }
];

export const DECORATION_COLORS: ColorSwatch[] = [
  { id: 'gold', name: 'Divine Gold', hex: '#FFD700', label: 'स्वर्ण' },
  { id: 'silver', name: 'Sacred Silver', hex: '#E2E8F0', label: 'रजत' },
  { id: 'red', name: 'Kumkum Red', hex: '#EF4444', label: 'कुमकुम' },
  { id: 'white', name: 'Pearl White', hex: '#FFFFFF', label: 'मोती' }
];

// Default Initial Customization
export const DEFAULT_GANESHA_CONFIG: GaneshaCustomization = {
  face: 'face_bal',
  eyes: 'eyes_lotus',
  trunk: 'trunk_idampuri',
  ears: 'ears_traditional',
  crown: 'crown_gold',
  clothes: 'clothes_traditional',
  jewellery: 'jewellery_necklace',
  tilak: 'tilak_trishul',
  flowers: 'flowers_marigold',
  aura: 'aura_gold',
  mushika: 'mushika_golden',
  skinColor: '#D97757',
  clothesColor: '#FF671F',
  decorationColor: '#FFD700'
};

// Curated aesthetic presets for "Surprise Me" or gallery starters
export const PRESET_DESIGNS: SavedGaneshaDesign[] = [
  {
    id: 'preset_lalbaug',
    name: 'Lalbaug Raja Splendor',
    createdAt: '2026-09-18T10:00:00Z',
    config: {
      face: 'face_lalbaug',
      eyes: 'eyes_royal',
      trunk: 'trunk_modak',
      ears: 'ears_filigree',
      crown: 'crown_royal',
      clothes: 'clothes_royal',
      jewellery: 'jewellery_royal',
      tilak: 'tilak_trishul',
      flowers: 'flowers_garland',
      aura: 'aura_divine',
      mushika: 'mushika_royal',
      skinColor: '#FF671F',
      clothesColor: '#DC2626',
      decorationColor: '#FFD700'
    }
  },
  {
    id: 'preset_bal',
    name: 'Bal Ganesha Delight',
    createdAt: '2026-09-18T11:00:00Z',
    config: {
      face: 'face_bal',
      eyes: 'eyes_smiling',
      trunk: 'trunk_modak',
      ears: 'ears_traditional',
      crown: 'crown_festival',
      clothes: 'clothes_festival',
      jewellery: 'jewellery_floral',
      tilak: 'tilak_chandan',
      flowers: 'flowers_marigold',
      aura: 'aura_spark',
      mushika: 'mushika_modak',
      skinColor: '#E6C291',
      clothesColor: '#F59E0B',
      decorationColor: '#FFD700'
    }
  },
  {
    id: 'preset_siddhi',
    name: 'Siddhi Vinayak Serenity',
    createdAt: '2026-09-18T12:00:00Z',
    config: {
      face: 'face_gentle',
      eyes: 'eyes_meditative',
      trunk: 'trunk_valampuri',
      ears: 'ears_lotus',
      crown: 'crown_lotus',
      clothes: 'clothes_traditional',
      jewellery: 'jewellery_gold_chains',
      tilak: 'tilak_urdhva',
      flowers: 'flowers_lotus',
      aura: 'aura_gold',
      mushika: 'mushika_devoted',
      skinColor: '#F8F9FA',
      clothesColor: '#FF671F',
      decorationColor: '#FFD700'
    }
  },
  {
    id: 'preset_vighnaharta',
    name: 'Supreme Vighnaharta',
    createdAt: '2026-09-18T14:00:00Z',
    config: {
      face: 'face_yogic',
      eyes: 'eyes_star',
      trunk: 'trunk_jeweled',
      ears: 'ears_kundan',
      crown: 'crown_vighnaharta',
      clothes: 'clothes_divine',
      jewellery: 'jewellery_divine',
      tilak: 'tilak_gold',
      flowers: 'flowers_mixed',
      aura: 'aura_mandala',
      mushika: 'mushika_royal',
      skinColor: '#FFD700',
      clothesColor: '#2563EB',
      decorationColor: '#FFFFFF'
    }
  }
];
