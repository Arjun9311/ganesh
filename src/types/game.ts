export type LaneIndex = -1 | 0 | 1; // -1: Left, 0: Center, 1: Right

export type WorldTheme = 
  | 'festival_street'   // Vighnas 1-20
  | 'temple_street'     // Vighnas 21-40
  | 'monsoon_festival'  // Vighnas 41-60
  | 'visarjan_path'     // Vighnas 61-80
  | 'chaos_festival'    // Vighnas 81-100
  | 'final_challenge'   // Vighnas 101-107
  | 'divine_realm';     // Vighna 108 & Victory

export type ObstacleType = 
  | 'hurdle_low'        // Subway Surfers low hurdle (requires jump)
  | 'barrier_high'      // Subway Surfers high barrier (requires slide)
  | 'rath_wagon'        // Subway Surfers train / chariot wagon (blocks lane, run on roof)
  | 'rath_ramp'         // Ramp incline to run up onto wagon roof
  | 'moving_cart'       // Festival cart moving towards player
  | 'wooden_barrier'    // Classic hurdle
  | 'stone_block'       // Heavy obstacle
  | 'festival_cart'     // Moving across lanes
  | 'dark_crow'         // Flying obstacle (jump or dodge)
  | 'storm_cloud'       // Dark energy hazard
  | 'final_vighna';     // Boss entity at 108

export type CollectibleType = 
  | 'modak'             // +100 Coins
  | 'golden_modak'      // +500, activates Divine Mode
  | 'lotus'             // +150, adds combo energy
  | 'flower_garland'    // +200, score multiplier boost
  | 'diya'              // Shield against 1 collision
  | 'mushika_powerup'   // Speed boost companion
  | 'jetpack'           // Garuda Jetpack flight
  | 'super_sneakers'    // Spring shoes for 2x high jump
  | 'hoverboard'        // Sacred Mushika hoverboard with crash protection
  | 'multiplier_2x';    // 2X Score Multiplier

export type PlayerActionState = 
  | 'RUN'
  | 'LANE_LEFT'
  | 'LANE_RIGHT'
  | 'JUMP'
  | 'SLIDE'
  | 'DESTROY'
  | 'HIT'
  | 'DIVINE_MODE'
  | 'JETPACK'
  | 'HOVERBOARD'
  | 'VICTORY'
  | 'DEFEAT';

export interface PowerUpState {
  isDivineMode: boolean;
  divineModeTimer: number;       // In seconds remaining
  isMushikaBoost: boolean;
  mushikaTimer: number;
  hasShield: boolean;
  hasMagnet: boolean;
  magnetTimer: number;
  hasHammer: boolean;
  hammerTimer: number;
  // Subway Surfers Signature Power-ups
  hasHoverboard: boolean;
  hoverboardTimer: number;
  isJetpackFlying: boolean;
  jetpackTimer: number;
  hasSuperJump: boolean;
  superJumpTimer: number;
  has2XMultiplier: boolean;
  multiplierTimer: number;
}

export interface GameStats {
  score: number;
  distance: number;              // In meters
  vighnasDestroyed: number;      // 0 to 108
  modaksCollected: number;
  currentCombo: number;
  maxCombo: number;
  lives: number;                 // 1 to 3
  currentWorld: WorldTheme;
  gameTime: number;              // In seconds
  isGameOver: boolean;
  isVictory: boolean;
  isPaused: boolean;
  currentLane: LaneIndex;
  // Subway Surfers High Score & Lifecycle
  highScore: number;
  hasUsedSaveMe: boolean;
  hoverboardsCount: number;
  multiplier: number;
  isOnRooftop?: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  lifetime: number;
}

export interface WeatherCondition {
  city: string;
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Storm' | 'Sunset';
  code: number;
  isFallback: boolean;
}
