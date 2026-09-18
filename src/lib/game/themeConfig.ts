import { WorldTheme } from '@/types/game';

export interface WorldThemeConfig {
  id: WorldTheme;
  name: string;
  hindiName: string;
  icon: string;
  tagline: string;
  skyColor: number;
  fogColor: number;
  fogDensity: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  dirColor: number;
  dirIntensity: number;
  roadColor: number;
  roadRoughness: number;
  roadMetalness: number;
  curbColor: number;
  toranColor: number;
  pillarColor: number;
  diyaColor: number;
  petalColors: number[];
  distanceThreshold: number; // meters
}

export const WORLD_THEMES: Record<WorldTheme, WorldThemeConfig> = {
  festival_street: {
    id: 'festival_street',
    name: 'Festival Street',
    hindiName: 'उत्सव पथ • Sunny Festival Avenue',
    icon: '☀️',
    tagline: 'Bright sunlit boulevard with golden lanterns, clear rails & marigold garlands',
    skyColor: 0x60A5FA, // Bright Subway Surfers azure sky
    fogColor: 0xBAE6FD, // Light daylight haze
    fogDensity: 0.006,  // Low fog density so obstacles 60m+ ahead are crystal clear
    hemiSky: 0xFFFFFF,
    hemiGround: 0xE2E8F0,
    hemiIntensity: 1.5,
    dirColor: 0xFFFDF0,
    dirIntensity: 1.7,
    roadColor: 0xE5E7EB, // Light stone/concrete subway track path
    roadRoughness: 0.45,
    roadMetalness: 0.05,
    curbColor: 0xF59E0B, // Amber gold safety borders
    toranColor: 0xDC2626, // Vivid festive scarlet
    pillarColor: 0xCBD5E1, // Clean light marble pillars
    diyaColor: 0xF59E0B,
    petalColors: [0xF59E0B, 0xEF4444, 0xFBBF24],
    distanceThreshold: 0
  },
  temple_street: {
    id: 'temple_street',
    name: 'Temple Corridor',
    hindiName: 'देवालय पथ • Golden Morning Ghat',
    icon: '🛕',
    tagline: 'Warm morning sun illuminating carved sandstone corridors & sacred flags',
    skyColor: 0x7DD3FC,
    fogColor: 0xFDE68A,
    fogDensity: 0.006,
    hemiSky: 0xFFFFFF,
    hemiGround: 0xFDE68A,
    hemiIntensity: 1.4,
    dirColor: 0xFBBF24,
    dirIntensity: 1.6,
    roadColor: 0xF5E8D3, // Warm sandstone road
    roadRoughness: 0.6,
    roadMetalness: 0.05,
    curbColor: 0xD97706,
    toranColor: 0xB91C1C,
    pillarColor: 0xE2E8F0,
    diyaColor: 0xF59E0B,
    petalColors: [0xF59E0B, 0xDC2626, 0xFBBF24],
    distanceThreshold: 250
  },
  monsoon_festival: {
    id: 'monsoon_festival',
    name: 'Monsoon Rain',
    hindiName: 'मेघदूत वर्षा • Fresh Rain Avenue',
    icon: '🌦️',
    tagline: 'Bright overcast daytime with glistening clean pavement & refreshing breeze',
    skyColor: 0x93C5FD,
    fogColor: 0xC7D2FE,
    fogDensity: 0.007,
    hemiSky: 0xF8FAFC,
    hemiGround: 0xCBD5E1,
    hemiIntensity: 1.4,
    dirColor: 0x38BDF8,
    dirIntensity: 1.5,
    roadColor: 0x94A3B8, // Clean slate road with reflective sheen
    roadRoughness: 0.1,
    roadMetalness: 0.35,
    curbColor: 0x0284C7,
    toranColor: 0x2563EB,
    pillarColor: 0xE2E8F0,
    diyaColor: 0x38BDF8,
    petalColors: [0x38BDF8, 0x60A5FA, 0x93C5FD],
    distanceThreshold: 500
  },
  visarjan_path: {
    id: 'visarjan_path',
    name: 'Visarjan Shore',
    hindiName: 'विसर्जन तट • Golden Sunset Beach',
    icon: '🌅',
    tagline: 'Vibrant golden hour sunset over coastal avenues with flying lotus petals',
    skyColor: 0xFDBA74,
    fogColor: 0xFED7AA,
    fogDensity: 0.006,
    hemiSky: 0xFFFBEB,
    hemiGround: 0xFDBA74,
    hemiIntensity: 1.4,
    dirColor: 0xF97316,
    dirIntensity: 1.7,
    roadColor: 0xFEF3C7, // Warm sandy golden pavement
    roadRoughness: 0.4,
    roadMetalness: 0.1,
    curbColor: 0xEA580C,
    toranColor: 0xE11D48,
    pillarColor: 0xFDE68A,
    diyaColor: 0xF97316,
    petalColors: [0xFF69B4, 0xFB7185, 0xF43F5E],
    distanceThreshold: 750
  },
  chaos_festival: {
    id: 'chaos_festival',
    name: 'Carnival Boulevard',
    hindiName: 'धमाल उत्सव • Festive Carnival',
    icon: '🎪',
    tagline: 'Bright festival carnival with colorful banners, streamers & confetti',
    skyColor: 0xA5F3FC,
    fogColor: 0xE0F2FE,
    fogDensity: 0.006,
    hemiSky: 0xFFFFFF,
    hemiGround: 0xF5D0FE,
    hemiIntensity: 1.4,
    dirColor: 0xEC4899,
    dirIntensity: 1.6,
    roadColor: 0xF1F5F9, // Clean festival concourse
    roadRoughness: 0.4,
    roadMetalness: 0.15,
    curbColor: 0xC084FC,
    toranColor: 0xA855F7,
    pillarColor: 0xE2E8F0,
    diyaColor: 0xEC4899,
    petalColors: [0xEC4899, 0xA855F7, 0x38BDF8, 0xFBBF24],
    distanceThreshold: 1000
  },
  final_challenge: {
    id: 'final_challenge',
    name: 'Kailash Sanctum',
    hindiName: 'कैलाश शिखर • Alpine Mountain Sun',
    icon: '🏔️',
    tagline: 'Pristine snow-capped mountain heights under crisp crystal daylight',
    skyColor: 0x7DD3FC,
    fogColor: 0xE0F2FE,
    fogDensity: 0.005,
    hemiSky: 0xFFFFFF,
    hemiGround: 0xBAE6FD,
    hemiIntensity: 1.5,
    dirColor: 0xE0F2FE,
    dirIntensity: 1.8,
    roadColor: 0xF8FAFC, // Marble snowy road
    roadRoughness: 0.15,
    roadMetalness: 0.3,
    curbColor: 0x38BDF8,
    toranColor: 0x0284C7,
    pillarColor: 0xE2E8F0,
    diyaColor: 0x38BDF8,
    petalColors: [0xBAE6FD, 0x38BDF8, 0xFFFFFF],
    distanceThreshold: 1250
  },
  divine_realm: {
    id: 'divine_realm',
    name: 'Svarga Divine Realm',
    hindiName: 'स्वर्ग लोक • Heavenly Golden Path',
    icon: '✨',
    tagline: 'Radiant celestial paradise of solid gold tracks & sunlit lotuses',
    skyColor: 0xFEF08A,
    fogColor: 0xFEF9C3,
    fogDensity: 0.005,
    hemiSky: 0xFFFFFF,
    hemiGround: 0xFEF08A,
    hemiIntensity: 1.7,
    dirColor: 0xFACC15,
    dirIntensity: 2.0,
    roadColor: 0xFDE047, // Bright gleaming gold track
    roadRoughness: 0.1,
    roadMetalness: 0.75,
    curbColor: 0xFFFFFF,
    toranColor: 0xF59E0B,
    pillarColor: 0xFFFBEB,
    diyaColor: 0xFBBF24,
    petalColors: [0xFBBF24, 0xFFE57F, 0xFF69B4, 0xFFFFFF],
    distanceThreshold: 1500
  }
};

export const THEME_ORDER: WorldTheme[] = [
  'festival_street',
  'temple_street',
  'monsoon_festival',
  'visarjan_path',
  'chaos_festival',
  'final_challenge',
  'divine_realm'
];
