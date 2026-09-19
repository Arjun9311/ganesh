/**
 * Types for 🐘 VIGHNAHARTA TEMPLE RUN
 * Sacred 3D Endless Runner with 90° Turning, 6 Sacred Worlds, and 108 Vighnas
 */

export type LaneIndex = -1 | 0 | 1;

export type TurnDirection = 'left' | 'right' | 'none';

/**
 * Grid-aligned Cardinal Headings:
 * - North: -Z (0, 0, -1)
 * - East:  +X (1, 0, 0)
 * - South: +Z (0, 0, 1)
 * - West:  -X (-1, 0, 0)
 */
export type CardinalHeading = 'north' | 'east' | 'south' | 'west';

export type TempleWorldId =
  | 'temple_street'
  | 'sacred_forest'
  | 'temple_cave'
  | 'festival_path'
  | 'visarjan_path'
  | 'divine_realm';

export interface TempleWorldInfo {
  id: TempleWorldId;
  name: string;
  hindiName: string;
  description: string;
  vighnaThreshold: number; // Milestone at which this world unlocks
  skyColor: number;
  fogColor: number;
  fogNear: number;
  fogFar: number;
  groundColor: number;
  accentColor: string;
  ambientLightColor: number;
  ambientLightIntensity: number;
  dirLightColor: number;
  dirLightIntensity: number;
}

export type TrackSegmentType =
  | 'straight'
  | 'corner_left'
  | 'corner_right'
  | 'bridge'
  | 'corridor'
  | 'cave'
  | 'forest'
  | 'festival'
  | 'divine';

export type TempleObstacleType =
  | 'temple_barrier'       // Jump over
  | 'hanging_bell'         // Slide under
  | 'falling_rock'         // Change lane
  | 'stone_pillar'         // Change lane
  | 'moving_cart'          // Jump or change lane
  | 'tree_root'            // Jump over
  | 'crow'                 // Slide or change lane
  | 'water_gap'            // Jump across gap
  | 'destructible_vighna'  // Destructible obstacle! Smash to remove
  | 'final_vighna';        // The 108th Final Vighna challenge

export type TempleCollectibleType =
  | 'modak'           // +100 score
  | 'golden_modak'    // +500 score + activates Divine Mode
  | 'festival_coin'   // +50 score + currency
  | 'lotus'           // +150 score + increases combo
  | 'flower_garland'; // +200 score + temporary 2X score multiplier

export type TemplePowerUpType =
  | 'divine_mode'    // 10s: 2X score, auto-destroy Vighnas, golden aura
  | 'mushika_rush'   // 6s: super speed boost with companion
  | 'modak_magnet'   // 10s: pull collectibles from all lanes
  | 'divine_shield'  // Protects from 1 collision
  | 'vighna_hammer'; // Smashes large obstacles

export interface TemplePowerUpState {
  isDivineMode: boolean;
  divineModeTimer: number;
  isMushikaRush: boolean;
  mushikaRushTimer: number;
  hasMagnet: boolean;
  magnetTimer: number;
  hasShield: boolean;
  hasHammer: boolean;
  hammerTimer: number;
  hasGarlandBoost: boolean;
  garlandBoostTimer: number;
}

export interface TempleGameStats {
  score: number;
  distance: number;
  vighnasDestroyed: number;
  modaksCollected: number;
  coinsCollected: number;
  currentCombo: number;
  maxCombo: number;
  lives: number;              // 3 Hearts (❤️❤️❤️)
  currentWorld: TempleWorldId;
  gameTime: number;
  isGameOver: boolean;
  isVictory: boolean;         // Reached 108 Vighnas!
  isPaused: boolean;
  currentLane: LaneIndex;
  highScore: number;
  hasUsedRevive: boolean;
}

export interface TurnPrompt {
  active: boolean;
  direction: 'left' | 'right';
  distanceToTurn: number;
  canTurnNow: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  scale: number;
  opacity: number;
}
