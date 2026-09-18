export type VehicleId = 'mushika_rath' | 'airavata_rover' | 'kailash_quad' | 'garuda_turbo';

export type StageId = 'kailash_foothills' | 'western_ghats' | 'varanasi_dunes' | 'svarga_heights';

export interface VehicleStats {
  id: VehicleId;
  name: string;
  hindiName: string;
  subtitle: string;
  icon: string;
  description: string;
  basePrice: number;
  unlocked: boolean;
  mass: number;
  enginePower: number; // base torque
  suspensionStiffness: number;
  suspensionDamping: number;
  tireFriction: number;
  fuelCapacity: number; // seconds of fuel
  chassisWidth: number;
  chassisHeight: number;
  wheelRadius: number;
  wheelBase: number;
  color: string;
  accentColor: string;
}

export interface VehicleUpgrades {
  engine: number;     // Level 1-10
  suspension: number; // Level 1-10
  tires: number;      // Level 1-10
  fuelTank: number;   // Level 1-10
}

export interface StageStats {
  id: StageId;
  name: string;
  hindiName: string;
  icon: string;
  description: string;
  gravity: number;
  hillScale: number;
  steepness: number;
  roughness: number;
  surfaceColor: string;
  crustColor: string;
  bedrockColor: string;
  skyTopColor: string;
  skyBottomColor: string;
  sunColor: string;
  unlockPrice: number;
  unlocked: boolean;
  bestDistance: number;
  highScore: number;
}

export interface HillClimbSaveData {
  coins: number;
  selectedVehicle: VehicleId;
  selectedStage: StageId;
  vehicles: Record<VehicleId, {
    unlocked: boolean;
    upgrades: VehicleUpgrades;
  }>;
  stages: Record<StageId, {
    unlocked: boolean;
    bestDistance: number;
    highScore: number;
  }>;
}

export interface HillClimbPhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  rearWheelY: number;
  frontWheelY: number;
  rearSuspensionDist: number;
  frontSuspensionDist: number;
  rearWheelAngle: number;
  frontWheelAngle: number;
  rearWheelSpeed: number;
  frontWheelSpeed: number;
  rearGrounded: boolean;
  frontGrounded: boolean;
  isAirborne: boolean;
  airTime: number;
  totalRotation: number;
  currentFlips: number;
  fuel: number; // 0 to 100
  distance: number;
  speedKmH: number;
  rpm: number;
  isCrashed: boolean;
  isOutOfFuel: boolean;
  deathReason: 'driver_down' | 'out_of_fuel' | null;
}

export interface StuntNotification {
  id: string;
  text: string;
  bonus: number;
  time: number;
}

export interface CollectibleItem {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'super_modak' | 'amrit_fuel';
  value: number;
  collected: boolean;
}
