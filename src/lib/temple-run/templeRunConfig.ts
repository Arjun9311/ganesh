import { TempleWorldId, TempleWorldInfo, CardinalHeading } from '@/types/templeRun';
import * as THREE from 'three';

export const TRACK_CONFIG = {
  laneWidth: 1.8,
  lanesCount: 3,
  trackWidth: 6.6,
  segmentLength: 24.0,
  cornerTriggerDistance: 20.0, // Distance before corner center where turn prompt appears
  turnTolerance: 6.0,          // Distance around corner pivot where turn can execute immediately
  turnBufferDistance: 18.0,    // If player swipes/presses turn within this distance, queue it!
  maxActiveSegments: 16,       // Number of segments kept alive in the world
  segmentRecycleBehindDist: 35.0, // Distance behind player to recycle segment

  // Physics
  baseSpeed: 18.0,
  maxSpeed: 36.0,
  speedIncreaseRate: 0.10, // units/sec per 10 seconds of survival
  laneSwitchSpeed: 14.0,   // Interpolation speed across lanes
  jumpVelocity: 12.0,
  gravity: 28.0,
  slideDuration: 0.65,

  // Camera settings
  cameraHeight: 3.6,
  cameraDistance: 6.2,
  cameraLookAhead: 10.0,
  cameraFov: 62,
  cameraTurnSlerpSpeed: 6.5,
  cameraJumpFollowFactor: 0.35
};

export const CARDINAL_DIRECTIONS: Record<CardinalHeading, THREE.Vector3> = {
  north: new THREE.Vector3(0, 0, -1),
  east: new THREE.Vector3(1, 0, 0),
  south: new THREE.Vector3(0, 0, 1),
  west: new THREE.Vector3(-1, 0, 0)
};

export const CARDINAL_YAW: Record<CardinalHeading, number> = {
  north: 0,
  east: -Math.PI / 2,
  south: Math.PI,
  west: Math.PI / 2
};

export function getTurnedHeading(current: CardinalHeading, turn: 'left' | 'right'): CardinalHeading {
  const order: CardinalHeading[] = ['north', 'east', 'south', 'west'];
  const currentIndex = order.indexOf(current);
  if (turn === 'right') {
    return order[(currentIndex + 1) % 4];
  } else {
    return order[(currentIndex + 3) % 4];
  }
}

/**
 * Calculates the shortest angular difference between two angles in radians [-PI, +PI],
 * preventing camera from flipping 270 degrees in the wrong direction during turns.
 */
export function shortestAngleDiff(from: number, to: number): number {
  let diff = (to - from) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

export const TEMPLE_WORLDS: Record<TempleWorldId, TempleWorldInfo> = {
  temple_street: {
    id: 'temple_street',
    name: 'Frozen Temple',
    hindiName: 'हिम मंदिर मार्ग',
    description: 'Ancient snow-covered temple causeway with mystical cyan spirit torches, frosted stone balustrades, and grand torana archways.',
    vighnaThreshold: 0,
    skyColor: 0x071126, // Glacial arctic midnight sky
    fogColor: 0x0A1C38, // Icy cyan mountain fog
    fogNear: 45,
    fogFar: 165,
    groundColor: 0x1E293B, // Frozen dark slate stone
    accentColor: '#38BDF8', // Glacial ice cyan
    ambientLightColor: 0xBAE6FD,
    ambientLightIntensity: 0.92,
    dirLightColor: 0x7DD3FC,
    dirLightIntensity: 1.55
  },
  sacred_forest: {
    id: 'sacred_forest',
    name: 'Sacred Frost Grove',
    hindiName: 'हिम तपोवन',
    description: 'Snow-blanketed alpine mountain grove with frost-draped shrines, hanging icicles, and dancing aurora motes.',
    vighnaThreshold: 20,
    skyColor: 0x061824,
    fogColor: 0x072233,
    fogNear: 42,
    fogFar: 155,
    groundColor: 0x183038, // Frosted mossy basalt
    accentColor: '#2DD4BF',
    ambientLightColor: 0x99F6E4,
    ambientLightIntensity: 0.88,
    dirLightColor: 0x5EEAD4,
    dirLightIntensity: 1.4
  },
  temple_cave: {
    id: 'temple_cave',
    name: 'Glacial Ice Cavern',
    hindiName: 'हिमानी गुहा',
    description: 'Deep sapphire blue subterranean ice caverns illuminated by luminescent cyan and violet crystals.',
    vighnaThreshold: 40,
    skyColor: 0x050C1E,
    fogColor: 0x071530,
    fogNear: 38,
    fogFar: 145,
    groundColor: 0x111E38, // Deep blue cavern ice
    accentColor: '#60A5FA',
    ambientLightColor: 0x93C5FD,
    ambientLightIntensity: 0.8,
    dirLightColor: 0x3B82F6,
    dirLightIntensity: 1.35
  },
  festival_path: {
    id: 'festival_path',
    name: 'Blizzard Summit',
    hindiName: 'हिम झंझावात',
    description: 'High-altitude mountain pass buffeted by swirling arctic winds and icy storm beacon towers.',
    vighnaThreshold: 60,
    skyColor: 0x0A152E,
    fogColor: 0x0D2146,
    fogNear: 45,
    fogFar: 165,
    groundColor: 0x1E293B, // Wind-scoured granite
    accentColor: '#38BDF8',
    ambientLightColor: 0xCFFAFE,
    ambientLightIntensity: 0.95,
    dirLightColor: 0xE0F2FE,
    dirLightIntensity: 1.6
  },
  visarjan_path: {
    id: 'visarjan_path',
    name: 'Frozen Sacred Lake',
    hindiName: 'हिम तीर्थ',
    description: 'Glassy frozen glacial lakebed reflecting aurora borealis hues and crystal prayer lamps.',
    vighnaThreshold: 80,
    skyColor: 0x0D1B3A,
    fogColor: 0x09142A,
    fogNear: 45,
    fogFar: 165,
    groundColor: 0x172554, // Deep glassy lake ice
    accentColor: '#818CF8',
    ambientLightColor: 0xC7D2FE,
    ambientLightIntensity: 0.9,
    dirLightColor: 0xA5B4FC,
    dirLightIntensity: 1.45
  },
  divine_realm: {
    id: 'divine_realm',
    name: 'Mount Kailash',
    hindiName: 'दिव्य कैलास लोक',
    description: 'The celestial snow abode of Lord Ganesha: golden-tipped snow peaks, eternal ice mandalas, and radiant divine aurora.',
    vighnaThreshold: 100,
    skyColor: 0x0C1938,
    fogColor: 0x0E244A,
    fogNear: 50,
    fogFar: 180,
    groundColor: 0x253655, // Celestial frost gold marble
    accentColor: '#FDE047',
    ambientLightColor: 0xFEF08A,
    ambientLightIntensity: 1.15,
    dirLightColor: 0xFACC15,
    dirLightIntensity: 1.8
  }
};

export const SACRED_WORLDS_ORDER: TempleWorldId[] = [
  'temple_street',
  'sacred_forest',
  'temple_cave',
  'festival_path',
  'visarjan_path',
  'divine_realm'
];

export function getWorldForVighnas(vighnasDestroyed: number): TempleWorldId {
  if (vighnasDestroyed >= 100) return 'divine_realm';
  if (vighnasDestroyed >= 80) return 'visarjan_path';
  if (vighnasDestroyed >= 60) return 'festival_path';
  if (vighnasDestroyed >= 40) return 'temple_cave';
  if (vighnasDestroyed >= 20) return 'sacred_forest';
  return 'temple_street';
}
