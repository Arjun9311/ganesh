import {
  VehicleId,
  StageId,
  VehicleStats,
  VehicleUpgrades,
  StageStats,
  HillClimbPhysicsState,
  StuntNotification,
  CollectibleItem
} from '@/types/hillClimb';
import { hillClimbAudio } from './hillClimbAudio';

export const VEHICLE_CONFIGS: Record<VehicleId, VehicleStats> = {
  mushika_rath: {
    id: 'mushika_rath',
    name: 'Mushika Chariot',
    hindiName: 'मूषक रथ',
    subtitle: 'Classic Divine Chariot',
    icon: '🏎️',
    description: 'Nimble and agile festival rath with brass spokes and balanced suspension. Perfect for learning steep ghat climbs.',
    basePrice: 0,
    unlocked: true,
    mass: 850,
    enginePower: 1150,
    suspensionStiffness: 42,
    suspensionDamping: 6.5,
    tireFriction: 1.15,
    fuelCapacity: 50,
    chassisWidth: 105,
    chassisHeight: 48,
    wheelRadius: 20,
    wheelBase: 76,
    color: '#EAB308',
    accentColor: '#FF671F'
  },
  airavata_rover: {
    id: 'airavata_rover',
    name: 'Airavata 4x4 Rover',
    hindiName: 'ऐरावत रोवर',
    subtitle: 'Heavy All-Terrain Monster',
    icon: '🚙',
    description: 'Heavy 4x4 mountain conqueror with massive tires and colossal low-end torque. Crushes boulders with ease.',
    basePrice: 0,
    unlocked: true,
    mass: 1400,
    enginePower: 1750,
    suspensionStiffness: 58,
    suspensionDamping: 8.5,
    tireFriction: 1.45,
    fuelCapacity: 65,
    chassisWidth: 125,
    chassisHeight: 60,
    wheelRadius: 26,
    wheelBase: 90,
    color: '#38BDF8',
    accentColor: '#0284C7'
  },
  kailash_quad: {
    id: 'kailash_quad',
    name: 'Kailash Snow Quad',
    hindiName: 'कैलाश क्वाड',
    subtitle: 'High-Altitude Stunt Bike',
    icon: '🏍️',
    description: 'Ultra-lightweight high-revving quad bike with studded snow tires. Incredible mid-air stunt rotation and flip speed.',
    basePrice: 0,
    unlocked: true,
    mass: 650,
    enginePower: 1450,
    suspensionStiffness: 48,
    suspensionDamping: 5.5,
    tireFriction: 1.25,
    fuelCapacity: 45,
    chassisWidth: 85,
    chassisHeight: 44,
    wheelRadius: 18,
    wheelBase: 65,
    color: '#A855F7',
    accentColor: '#F43F5E'
  },
  garuda_turbo: {
    id: 'garuda_turbo',
    name: 'Garuda Turbo Chariot',
    hindiName: 'गरुड़ टर्बो',
    subtitle: 'Rocket-Powered Super Chariot',
    icon: '🚀',
    description: 'Aerodynamic winged racer equipped with sacred amrit rocket thrusters. Blistering top speed and effortless air gliding.',
    basePrice: 0,
    unlocked: true,
    mass: 750,
    enginePower: 2200,
    suspensionStiffness: 52,
    suspensionDamping: 7.0,
    tireFriction: 1.35,
    fuelCapacity: 55,
    chassisWidth: 110,
    chassisHeight: 46,
    wheelRadius: 21,
    wheelBase: 80,
    color: '#EF4444',
    accentColor: '#FFD700'
  }
};

export const STAGE_CONFIGS: Record<StageId, StageStats> = {
  kailash_foothills: {
    id: 'kailash_foothills',
    name: 'Kailash Foothills',
    hindiName: 'कैलाश घाटी',
    icon: '🏔️',
    description: 'Gentle rolling alpine slopes, crisp snow meadows, and picturesque mountain ridges. Great for cruising.',
    gravity: 9.8,
    hillScale: 65,
    steepness: 0.0035,
    roughness: 1.0,
    surfaceColor: '#22C55E',
    crustColor: '#854D0E',
    bedrockColor: '#1E293B',
    skyTopColor: '#0284C7',
    skyBottomColor: '#BAE6FD',
    sunColor: '#FDE047',
    unlockPrice: 0,
    unlocked: true,
    bestDistance: 0,
    highScore: 0
  },
  western_ghats: {
    id: 'western_ghats',
    name: 'Western Ghats Monsoon',
    hindiName: 'सह्याद्रि वर्षा',
    icon: '🌧️',
    description: 'Lush tropical rain-slicked inclines, muddy climbs, and deep misty valleys with slick traction.',
    gravity: 10.2,
    hillScale: 85,
    steepness: 0.0042,
    roughness: 1.25,
    surfaceColor: '#15803D',
    crustColor: '#78350F',
    bedrockColor: '#0F172A',
    skyTopColor: '#475569',
    skyBottomColor: '#94A3B8',
    sunColor: '#FBBF24',
    unlockPrice: 0,
    unlocked: true,
    bestDistance: 0,
    highScore: 0
  },
  varanasi_dunes: {
    id: 'varanasi_dunes',
    name: 'Varanasi Ghats & Dunes',
    hindiName: 'काशी तट',
    icon: '🛕',
    description: 'Golden sandy riverbank dunes, ancient stone ghat steps, and steep temple bridge crossings.',
    gravity: 9.5,
    hillScale: 95,
    steepness: 0.0048,
    roughness: 1.1,
    surfaceColor: '#F59E0B',
    crustColor: '#D97706',
    bedrockColor: '#451A03',
    skyTopColor: '#C2410C',
    skyBottomColor: '#FED7AA',
    sunColor: '#EA580C',
    unlockPrice: 0,
    unlocked: true,
    bestDistance: 0,
    highScore: 0
  },
  svarga_heights: {
    id: 'svarga_heights',
    name: 'Svarga Cosmic Realm',
    hindiName: 'स्वर्ग लोक',
    icon: '✨',
    description: 'Low-gravity divine sky kingdom with golden clouds, massive floating ramps, and celestial jumps.',
    gravity: 6.8,
    hillScale: 120,
    steepness: 0.0055,
    roughness: 0.9,
    surfaceColor: '#FACC15',
    crustColor: '#CA8A04',
    bedrockColor: '#312E81',
    skyTopColor: '#4C1D95',
    skyBottomColor: '#C084FC',
    sunColor: '#FFFFFF',
    unlockPrice: 0,
    unlocked: true,
    bestDistance: 0,
    highScore: 0
  }
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export class HillClimbEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animId: number | null = null;
  private lastTime: number = 0;

  public vehicle: VehicleStats;
  public upgrades: VehicleUpgrades;
  public stage: StageStats;
  public state: HillClimbPhysicsState;

  // Controls input state
  public isGasPressed: boolean = false;
  public isBrakePressed: boolean = false;

  // Collectibles along track
  private collectibles: CollectibleItem[] = [];
  private generatedDistance: number = 0;

  // Particles
  private particles: Particle[] = [];

  // Notifications
  public stuntNotifications: StuntNotification[] = [];

  // Callback hooks for React UI
  private onStatsUpdate: (state: HillClimbPhysicsState) => void;
  private onGameOver: (finalScore: number, distance: number, coins: number, deathReason: string) => void;
  private onCoinCollected: (coins: number) => void;
  private onStunt: (stunt: StuntNotification) => void;

  public totalCoinsRun: number = 0;
  public runTime: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    vehicleId: VehicleId,
    upgrades: VehicleUpgrades,
    stageId: StageId,
    callbacks: {
      onStatsUpdate: (state: HillClimbPhysicsState) => void;
      onGameOver: (finalScore: number, distance: number, coins: number, deathReason: string) => void;
      onCoinCollected: (coins: number) => void;
      onStunt: (stunt: StuntNotification) => void;
    }
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.vehicle = { ...VEHICLE_CONFIGS[vehicleId] };
    this.upgrades = { ...upgrades };
    this.stage = { ...STAGE_CONFIGS[stageId] };
    this.onStatsUpdate = callbacks.onStatsUpdate;
    this.onGameOver = callbacks.onGameOver;
    this.onCoinCollected = callbacks.onCoinCollected;
    this.onStunt = callbacks.onStunt;

    const startX = 60;
    const groundY = this.getTerrainHeight(startX);
    const wheelR = this.vehicle.wheelRadius;
    const startY = groundY - wheelR - 20;

    this.runTime = 0;
    this.state = {
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      angle: 0,
      angularVelocity: 0,
      rearWheelY: groundY - wheelR,
      frontWheelY: groundY - wheelR,
      rearSuspensionDist: 20,
      frontSuspensionDist: 20,
      rearWheelAngle: 0,
      frontWheelAngle: 0,
      rearWheelSpeed: 0,
      frontWheelSpeed: 0,
      rearGrounded: true,
      frontGrounded: true,
      isAirborne: false,
      airTime: 0,
      totalRotation: 0,
      currentFlips: 0,
      fuel: 100,
      distance: 0,
      speedKmH: 0,
      rpm: 0.15,
      isCrashed: false,
      isOutOfFuel: false,
      deathReason: null
    };

    this.generateCollectiblesUpTo(1500);
    hillClimbAudio.startEngineSound();
  }

  /**
   * Continuous multi-harmonic procedural hill terrain math
   */
  public getTerrainHeight(x: number): number {
    if (x < 100) {
      // Gentle flat starting paddock
      return 360;
    }

    const { hillScale, steepness, roughness } = this.stage;
    const baseSlope = (x - 100) * steepness * 2.5;

    // Harmonic wave superposition
    const h1 = Math.sin(x * 0.0038) * hillScale * 1.1;
    const h2 = Math.sin(x * 0.0092 + 1.2) * (hillScale * 0.55);
    const h3 = Math.sin(x * 0.024 + 2.7) * (hillScale * 0.25 * roughness);
    const h4 = Math.sin(x * 0.065 + 4.1) * (hillScale * 0.1 * roughness);

    // Occasional dramatic hill crests / ghat steps every ~450m
    const specialHills = Math.sin(x * 0.0014) * (hillScale * 0.85);

    return 360 + h1 + h2 + h3 + h4 + specialHills + Math.sin(baseSlope * 0.05) * 20;
  }

  /**
   * Exact analytical terrain slope derivative dy/dx
   */
  public getTerrainSlope(x: number): number {
    const delta = 1.0;
    const y1 = this.getTerrainHeight(x - delta);
    const y2 = this.getTerrainHeight(x + delta);
    return (y2 - y1) / (delta * 2);
  }

  private generateCollectiblesUpTo(targetX: number) {
    while (this.generatedDistance < targetX) {
      this.generatedDistance += 40 + Math.random() * 45;
      const x = this.generatedDistance;
      const groundY = this.getTerrainHeight(x);

      // 1 in 8 chance for Amrit Fuel canister
      if (Math.random() < 0.12 && x > 250) {
        this.collectibles.push({
          id: `fuel-${x}`,
          x,
          y: groundY - 28,
          type: 'amrit_fuel',
          value: 100,
          collected: false
        });
      } else if (Math.random() < 0.22) {
        // Super Modak (+100)
        this.collectibles.push({
          id: `super-${x}`,
          x,
          y: groundY - 32,
          type: 'super_modak',
          value: 100,
          collected: false
        });
      } else {
        // Row of 3 to 5 coins
        const count = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const cx = x + i * 18;
          const cy = this.getTerrainHeight(cx) - 26;
          this.collectibles.push({
            id: `coin-${cx}`,
            x: cx,
            y: cy,
            type: 'coin',
            value: 25,
            collected: false
          });
        }
      }
    }
  }

  public start() {
    this.lastTime = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.05); // cap frame delta
      this.lastTime = now;
      this.update(dt);
      this.render();
      if (!this.state.isCrashed && !this.state.isOutOfFuel) {
        this.animId = requestAnimationFrame(loop);
      } else {
        // Stop engine sound upon death
        hillClimbAudio.stopEngineSound();
        const finalScore = Math.floor(this.state.distance * 10) + this.totalCoinsRun * 5;
        this.onGameOver(finalScore, Math.floor(this.state.distance), this.totalCoinsRun, this.state.deathReason || 'crashed');
      }
    };
    this.animId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    hillClimbAudio.stopEngineSound();
  }

  /**
   * Main Physics Simulation Step
   */
  public update(dt: number) {
    if (this.state.isCrashed || this.state.isOutOfFuel) return;

    const {
      mass,
      enginePower,
      suspensionStiffness,
      suspensionDamping,
      tireFriction,
      wheelBase,
      wheelRadius,
      fuelCapacity
    } = this.vehicle;

    // Upgrades Multipliers
    const engineMult = 1.0 + (this.upgrades.engine - 1) * 0.18;
    const suspMult = 1.0 + (this.upgrades.suspension - 1) * 0.15;
    const tiresMult = 1.0 + (this.upgrades.tires - 1) * 0.16;
    const fuelMult = 1.0 + (this.upgrades.fuelTank - 1) * 0.22;

    const gravity = this.stage.gravity * 34; // Scaled for 2D pixel space

    this.runTime += dt;

    // 1. Gravity applied to chassis
    this.state.vy += gravity * dt;

    // 2. Air drag and angular damping
    this.state.vx *= (1 - 0.005 * dt * 60);
    this.state.angularVelocity *= (1 - 0.035 * dt * 60);

    // Calculate Wheel World Positions
    const cosA = Math.cos(this.state.angle);
    const sinA = Math.sin(this.state.angle);
    const halfBase = wheelBase / 2;
    const suspH = 20;

    // Rear and Front Wheel Hub coordinates (local: dx = ±halfBase, dy = +suspH)
    const rearHubX = this.state.x - halfBase * cosA - suspH * sinA;
    const rearHubY = this.state.y - halfBase * sinA + suspH * cosA;

    const frontHubX = this.state.x + halfBase * cosA - suspH * sinA;
    const frontHubY = this.state.y + halfBase * sinA + suspH * cosA;

    // Ground check for each wheel
    const groundRearY = this.getTerrainHeight(rearHubX);
    const groundFrontY = this.getTerrainHeight(frontHubX);

    const rearBottomY = rearHubY + wheelRadius;
    const frontBottomY = frontHubY + wheelRadius;

    const rearPenetration = rearBottomY - groundRearY;
    const frontPenetration = frontBottomY - groundFrontY;

    this.state.rearGrounded = rearPenetration > 0;
    this.state.frontGrounded = frontPenetration > 0;

    const anyGrounded = this.state.rearGrounded || this.state.frontGrounded;

    // 3. Position correction to guarantee chassis never falls below terrain
    const maxPen = Math.max(rearPenetration, frontPenetration);
    if (maxPen > 0) {
      this.state.y -= maxPen * 0.85;
      if (this.state.vy > 0) {
        this.state.vy = Math.min(0, this.state.vy * 0.05);
      }
    }

    // Suspension terrain alignment torque with proper 360-degree angle difference wrapping
    if (this.state.rearGrounded && this.state.frontGrounded) {
      const terrainSlopeAngle = Math.atan2(groundFrontY - groundRearY, frontHubX - rearHubX);
      let angleDiff = terrainSlopeAngle - (this.state.angle % (Math.PI * 2));
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.state.angularVelocity += (angleDiff * 6.0 * suspMult - this.state.angularVelocity * 4.0) * dt;
    }

    // Drive traction along the terrain slope
    if (this.state.rearGrounded) {
      const slope = this.getTerrainSlope(rearHubX);
      const hyp = Math.hypot(1, slope);
      const tangX = 1 / hyp;
      const tangY = slope / hyp;

      if (this.isGasPressed) {
        const driveForce = enginePower * engineMult * tireFriction * tiresMult;
        this.state.vx += tangX * driveForce * dt * 0.45;
        this.state.vy += tangY * driveForce * dt * 0.45;

        if (Math.random() < 0.4) {
          this.emitWheelSmoke(rearHubX, groundRearY, -this.state.vx * 0.4, -15);
        }
      } else if (this.isBrakePressed) {
        this.state.vx *= (1 - 0.12 * dt * 60);
        this.state.vy *= (1 - 0.08 * dt * 60);
        // Reverse if nearly stopped
        if (this.state.vx < 15) {
          this.state.vx -= tangX * 360 * dt;
          this.state.vy -= tangY * 360 * dt;
        }
        hillClimbAudio.playTireSkid();
      } else {
        // Natural rolling resistance
        this.state.vx *= (1 - 0.018 * dt * 60);
      }
    } else if (this.state.frontGrounded) {
      // Front wheel assist / braking
      const slope = this.getTerrainSlope(frontHubX);
      const hyp = Math.hypot(1, slope);
      const tangX = 1 / hyp;
      const tangY = slope / hyp;

      if (this.isGasPressed) {
        const driveForce = enginePower * engineMult * tireFriction * tiresMult * 0.4;
        this.state.vx += tangX * driveForce * dt * 0.3;
        this.state.vy += tangY * driveForce * dt * 0.3;
      }
      if (this.isBrakePressed) {
        this.state.vx *= (1 - 0.1 * dt * 60);
        hillClimbAudio.playTireSkid();
      }
    }

    // 4. Responsive Player Rotational Control (Air Tilts & Wheelies)
    // Gas = Tilt nose UP / counter-clockwise (wheelies & backflips)
    // Brake = Tilt nose DOWN / clockwise (frontflips & hill stabilizing)
    if (this.isGasPressed) {
      const tiltRate = !anyGrounded ? 11.5 : 3.6;
      this.state.angularVelocity -= tiltRate * dt;
    }
    if (this.isBrakePressed) {
      const tiltRate = !anyGrounded ? 11.5 : 4.0;
      this.state.angularVelocity += tiltRate * dt;
    }

    // Clamp maximum angular velocity for snappy, controllable rotation
    this.state.angularVelocity = Math.max(-8.5, Math.min(8.5, this.state.angularVelocity));

    // Stunts tracking
    if (!anyGrounded) {
      this.state.isAirborne = true;
      this.state.airTime += dt;

      // Air stunt rotation accumulator
      this.state.totalRotation += this.state.angularVelocity * dt;
      const fullRotations = Math.floor(Math.abs(this.state.totalRotation) / (Math.PI * 2));
      if (fullRotations > this.state.currentFlips) {
        this.state.currentFlips = fullRotations;
        const isBack = this.state.angularVelocity < 0;
        const stuntName = isBack ? 'BACK FLIP! +1,000' : 'FRONT FLIP! +1,000';
        this.addStuntNotification(stuntName, 1000);
        this.totalCoinsRun += 1000;
        this.onCoinCollected(this.totalCoinsRun);
        hillClimbAudio.playStuntFanfare();
      }
    } else {
      // Landed from air
      if (this.state.isAirborne && this.state.airTime > 1.2) {
        const bonus = Math.floor(this.state.airTime * 200);
        this.addStuntNotification(`AIR TIME ${this.state.airTime.toFixed(1)}s! +${bonus}`, bonus);
        this.totalCoinsRun += bonus;
        this.onCoinCollected(this.totalCoinsRun);
      }
      this.state.isAirborne = false;
      this.state.airTime = 0;
      this.state.totalRotation = 0;
      this.state.currentFlips = 0;
    }

    // 5. Update chassis state
    this.state.angle += this.state.angularVelocity * dt;
    this.state.x += this.state.vx * dt;
    this.state.y += this.state.vy * dt;

    // Wheel spin visual rotation (physically proportional to speed and radius)
    const spinDelta = (this.state.vx * dt) / Math.max(16, wheelRadius);
    this.state.rearWheelAngle += spinDelta;
    this.state.frontWheelAngle += spinDelta;

    // Track distance
    this.state.distance = Math.max(0, (this.state.x - 60) * 0.1);

    // Speed in km/h
    this.state.speedKmH = Math.abs(Math.round(this.state.vx * 0.36));

    // Dynamic Engine RPM calculation
    const throttleFactor = this.isGasPressed ? 0.75 : 0.05;
    const speedFactor = Math.min(Math.abs(this.state.vx) / 300, 1.0) * 0.45;
    const targetRPM = Math.min(0.15 + throttleFactor + speedFactor, 1.0);
    this.state.rpm += (targetRPM - this.state.rpm) * (dt * 8);

    // Update dynamic audio revving
    hillClimbAudio.updateEngineRPM(this.state.rpm, this.isGasPressed);

    // Emit exhaust particles from rear pipe
    if (this.isGasPressed || Math.random() < 0.25) {
      const exX = this.state.x - halfBase * cosA + suspH * sinA;
      const exY = this.state.y - halfBase * sinA - suspH * cosA;
      this.emitExhaustSmoke(exX, exY);
    }

    // 6. Fuel / Amrit Consumption System
    const drainRate = (100 / (fuelCapacity * fuelMult)) * (this.isGasPressed ? 1.4 : 0.6);
    this.state.fuel = Math.max(0, this.state.fuel - drainRate * dt);

    if (this.state.fuel <= 20 && this.state.fuel > 0) {
      if (Math.floor(this.state.fuel * 2) % 2 === 0) {
        hillClimbAudio.playLowFuelWarning();
      }
    }

    if (this.state.fuel <= 0) {
      this.state.vx *= (1 - 0.05 * dt * 60);
      if (Math.abs(this.state.vx) < 5) {
        this.state.isOutOfFuel = true;
        this.state.deathReason = 'out_of_fuel';
      }
    }

    // 7. Driver Head Safety Collision Detection (Ganesha Crown Rollover Check)
    // Driver head position in world coordinates (local: dx = 2, dy = -38)
    const headX = this.state.x + 2 * cosA + 38 * sinA;
    const headY = this.state.y + 2 * sinA - 38 * cosA;
    const groundHeadY = this.getTerrainHeight(headX);

    // A rollover crash only triggers if:
    // 1) Initial grace period of 1.2s has passed (car has settled safely onto start paddock)
    // 2) Vehicle is severely inverted/flipped: cos(angle) < 0.25 (tilted > 75 degrees)
    // 3) Driver crown actually touches/penetrates the ground: headY >= groundHeadY - 2
    const isRolledOver = Math.cos(this.state.angle) < 0.25;
    if (this.runTime > 1.2 && isRolledOver && headY >= groundHeadY - 2) {
      this.state.isCrashed = true;
      this.state.deathReason = 'driver_down';
      hillClimbAudio.playCrashSound();
      this.emitSparkBurst(headX, headY);
    }

    // 8. Collectibles Collision
    this.checkCollectibleCollisions();

    // 9. Procedural endless terrain generation
    if (this.state.x + 1000 > this.generatedDistance) {
      this.generateCollectiblesUpTo(this.state.x + 1500);
    }

    // 10. Update Particles & Notifications
    this.updateParticles(dt);
    this.updateNotifications(dt);

    // Emit stats to React HUD
    this.onStatsUpdate({ ...this.state });
  }

  private checkCollectibleCollisions() {
    const carX = this.state.x;
    const carY = this.state.y;
    const collectRadius = 45;

    for (const item of this.collectibles) {
      if (item.collected) continue;
      const dx = carX - item.x;
      const dy = carY - item.y;
      const dist = Math.hypot(dx, dy);

      if (dist < collectRadius) {
        item.collected = true;
        if (item.type === 'amrit_fuel') {
          this.state.fuel = 100;
          this.addStuntNotification('AMRIT FUEL 100%!', 50);
          hillClimbAudio.playFuelRefill();
        } else {
          const isSuper = item.type === 'super_modak';
          this.totalCoinsRun += item.value;
          this.onCoinCollected(this.totalCoinsRun);
          hillClimbAudio.playCoinCollect(isSuper);
        }
        this.emitSparkBurst(item.x, item.y, item.type === 'amrit_fuel' ? '#22C55E' : '#FBBF24');
      }
    }
  }

  private addStuntNotification(text: string, bonus: number) {
    const item: StuntNotification = {
      id: Math.random().toString(36).substring(2, 7),
      text,
      bonus,
      time: 1.8
    };
    this.stuntNotifications.push(item);
    this.onStunt(item);
  }

  private updateNotifications(dt: number) {
    for (let i = this.stuntNotifications.length - 1; i >= 0; i--) {
      this.stuntNotifications[i].time -= dt;
      if (this.stuntNotifications[i].time <= 0) {
        this.stuntNotifications.splice(i, 1);
      }
    }
  }

  private emitExhaustSmoke(x: number, y: number) {
    this.particles.push({
      x,
      y,
      vx: -Math.cos(this.state.angle) * 20 + (Math.random() - 0.5) * 8,
      vy: -Math.sin(this.state.angle) * 10 - Math.random() * 12,
      life: 0.6,
      maxLife: 0.6,
      size: 4 + Math.random() * 5,
      color: 'rgba(200, 210, 220, 0.45)'
    });
  }

  private emitWheelSmoke(x: number, y: number, vx: number, vy: number) {
    this.particles.push({
      x,
      y,
      vx,
      vy,
      life: 0.5,
      maxLife: 0.5,
      size: 3 + Math.random() * 4,
      color: this.stage.surfaceColor
    });
  }

  private emitSparkBurst(x: number, y: number, color = '#FFD700') {
    for (let i = 0; i < 14; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 20 + Math.random() * 60;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0.5,
        maxLife: 0.5,
        size: 2.5 + Math.random() * 3,
        color
      });
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.size += dt * 4;
    }
  }

  /**
   * High-Fidelity Canvas Rendering Pipeline
   */
  public render() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    // Adaptive camera follow offset based on viewport orientation (portrait vs landscape)
    const isPortrait = height > width;
    const camX = this.state.x - width * (isPortrait ? 0.22 : 0.32);
    const camY = this.state.y - height * (isPortrait ? 0.62 : 0.58);

    ctx.save();

    // 1. Realistic Multi-Layer Parallax Background
    this.renderParallaxBackground(ctx, camX, width, height);

    // 2. Camera Transform
    ctx.translate(-camX, -camY);

    // 3. Render Terrain Ground
    this.renderTerrain(ctx, camX, width, height);

    // 4. Render Collectibles (Modaks, Amrit Fuel Canisters)
    this.renderCollectibles(ctx, camX, width);

    // 5. Render Particles (Smoke, Dirt, Sparks)
    this.renderParticles(ctx);

    // 6. Render Vehicle & Ganesha Driver
    this.renderVehicleAndDriver(ctx);

    ctx.restore();
  }

  private renderParallaxBackground(ctx: CanvasRenderingContext2D, camX: number, width: number, height: number) {
    const { skyTopColor, skyBottomColor, sunColor } = this.stage;
    const stageId = this.stage.id;

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, skyTopColor);
    skyGrad.addColorStop(1, skyBottomColor);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Celestial Orb / Sun / Moon
    ctx.save();
    if (stageId === 'svarga_heights') {
      // Cosmic Radiant Portal / Divine Star
      const portalGrad = ctx.createRadialGradient(width * 0.7, 80, 5, width * 0.7, 80, 140);
      portalGrad.addColorStop(0, '#FFFFFF');
      portalGrad.addColorStop(0.25, '#F472B6');
      portalGrad.addColorStop(0.6, '#7C3AED');
      portalGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = portalGrad;
      ctx.beginPath();
      ctx.arc(width * 0.7, 80, 140, 0, Math.PI * 2);
      ctx.fill();

      // Cosmic Twinkling Stars
      ctx.fillStyle = '#FFFFFF';
      for (let s = 0; s < 30; s++) {
        const sx = ((s * 137 + camX * 0.02) % width + width) % width;
        const sy = (s * 93) % (height * 0.55);
        ctx.fillRect(sx, sy, s % 3 === 0 ? 3 : 1.8, s % 3 === 0 ? 3 : 1.8);
      }
    } else {
      const sunGrad = ctx.createRadialGradient(width * 0.75, 90, 10, width * 0.75, 90, 120);
      sunGrad.addColorStop(0, sunColor);
      sunGrad.addColorStop(0.3, 'rgba(255, 230, 150, 0.4)');
      sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(width * 0.75, 90, 120, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Layer 1: Far Distance Horizons (0.04x parallax)
    ctx.save();
    if (stageId === 'svarga_heights') {
      // Floating Cosmic Temple Islands
      ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
      for (let i = 0; i < 4; i++) {
        const ix = ((i * 350 + camX * 0.04) % (width + 300)) - 100;
        const iy = height * 0.35 + (i % 2) * 50;
        ctx.beginPath();
        ctx.ellipse(ix, iy, 75, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tiny floating shikhara spire
        ctx.fillRect(ix - 4, iy - 26, 8, 26);
      }
    } else if (stageId === 'varanasi_dunes') {
      // Distant River Ghat Temples & Minarets on Horizon
      ctx.fillStyle = 'rgba(124, 45, 18, 0.35)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let px = 0; px <= width; px += 35) {
        const worldX = px + camX * 0.05;
        const shikhara = Math.sin(worldX * 0.01) > 0.7 ? 35 : 0;
        const bankY = height * 0.55 - Math.sin(worldX * 0.003) * 40 - shikhara;
        ctx.lineTo(px, bankY);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    } else {
      // Snowy Mount Kailash Peaks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let px = 0; px <= width; px += 40) {
        const worldX = px + camX * 0.05;
        const peakY = height * 0.45 - Math.sin(worldX * 0.002) * 85 - Math.sin(worldX * 0.005) * 35;
        ctx.lineTo(px, peakY);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 4. Layer 2: Mid-range Ridges (0.16x parallax)
    ctx.save();
    ctx.fillStyle = stageId === 'western_ghats'
      ? 'rgba(6, 78, 59, 0.45)'
      : stageId === 'varanasi_dunes'
      ? 'rgba(180, 83, 9, 0.35)'
      : stageId === 'svarga_heights'
      ? 'rgba(76, 29, 149, 0.35)'
      : 'rgba(30, 41, 59, 0.35)';

    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let px = 0; px <= width; px += 30) {
      const worldX = px + camX * 0.16;
      const ridgeY = height * 0.65 - Math.sin(worldX * 0.004) * 60 - Math.sin(worldX * 0.009) * 25;
      ctx.lineTo(px, ridgeY);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Monsoon Rain Streaks on Western Ghats
    if (stageId === 'western_ghats') {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.22)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      const rainOffset = (camX * 0.4 + performance.now() * 0.4) % 100;
      for (let rx = -50; rx < width + 50; rx += 38) {
        const startRy = (rx * 17 + rainOffset) % height;
        ctx.moveTo(rx, startRy);
        ctx.lineTo(rx - 14, startRy + 32);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderTerrain(ctx: CanvasRenderingContext2D, camX: number, width: number, height: number) {
    const startX = Math.floor(camX - 50);
    const endX = Math.ceil(camX + width + 50);
    const step = 8; // smooth 8px sampling

    ctx.save();

    // Build the closed terrain polygon
    ctx.beginPath();
    ctx.moveTo(startX, this.getTerrainHeight(startX));

    for (let x = startX; x <= endX; x += step) {
      ctx.lineTo(x, this.getTerrainHeight(x));
    }

    const deepY = this.state.y + height + 600;
    ctx.lineTo(endX, deepY);
    ctx.lineTo(startX, deepY);
    ctx.closePath();

    // Subsurface geological strata gradient
    const terrainGrad = ctx.createLinearGradient(0, this.state.y - 100, 0, deepY);
    terrainGrad.addColorStop(0, this.stage.crustColor);
    terrainGrad.addColorStop(0.3, this.stage.bedrockColor);
    terrainGrad.addColorStop(1, '#05070D');

    ctx.fillStyle = terrainGrad;
    ctx.fill();

    // Render detailed surface top crust (Grass/Snow/Stone lip)
    ctx.beginPath();
    ctx.moveTo(startX, this.getTerrainHeight(startX));
    for (let x = startX; x <= endX; x += step) {
      ctx.lineTo(x, this.getTerrainHeight(x));
    }
    ctx.strokeStyle = this.stage.surfaceColor;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Upper highlight lip
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Milestones along track (every 100 meters)
    for (let m = 100; m <= Math.ceil(this.state.distance + 200); m += 100) {
      const mx = 60 + m * 10;
      if (mx >= startX && mx <= endX) {
        const my = this.getTerrainHeight(mx);
        // Milestone post
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(mx - 3, my - 34, 6, 34);
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(mx - 14, my - 44, 28, 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${m}m`, mx, my - 33);
      }
    }

    ctx.restore();
  }

  private renderCollectibles(ctx: CanvasRenderingContext2D, camX: number, width: number) {
    const startX = camX - 40;
    const endX = camX + width + 40;

    for (const item of this.collectibles) {
      if (item.collected || item.x < startX || item.x > endX) continue;

      ctx.save();
      ctx.translate(item.x, item.y);

      if (item.type === 'amrit_fuel') {
        // Glowing Green Amrit Fuel Canister
        ctx.fillStyle = '#22C55E';
        ctx.fillRect(-10, -14, 20, 26);
        ctx.fillStyle = '#15803D';
        ctx.fillRect(-6, -18, 12, 5);
        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡', 0, 4);

        // Pulsing glow aura
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-12, -16, 24, 30);
      } else {
        // Sacred Gold Modak Dumpling
        const isSuper = item.type === 'super_modak';
        const r = isSuper ? 13 : 9;

        // Golden halo
        const haloGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, r * 2);
        haloGrad.addColorStop(0, isSuper ? 'rgba(255, 215, 0, 0.7)' : 'rgba(255, 184, 0, 0.5)');
        haloGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
        ctx.fill();

        // Modak dumpling body
        ctx.fillStyle = isSuper ? '#FFD700' : '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.3);
        ctx.quadraticCurveTo(r * 1.2, r * 0.4, 0, r * 1.0);
        ctx.quadraticCurveTo(-r * 1.2, r * 0.4, 0, -r * 1.3);
        ctx.fill();

        // Dumpling flute lines
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.2);
        ctx.lineTo(0, r * 0.8);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Renders the Divine Vehicle with dynamic suspension and Ganesha Driver
   */
  private renderVehicleAndDriver(ctx: CanvasRenderingContext2D) {
    const {
      chassisWidth,
      chassisHeight,
      wheelBase,
      wheelRadius,
      color,
      accentColor
    } = this.vehicle;

    const cosA = Math.cos(this.state.angle);
    const sinA = Math.sin(this.state.angle);
    const halfBase = wheelBase / 2;
    const suspH = 20;

    ctx.save();
    // 1. Transform entire vehicle context to world position and rotation
    ctx.translate(this.state.x, this.state.y);
    ctx.rotate(this.state.angle);

    // 2. Suspension Struts connecting Chassis to Wheels
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-halfBase, 6);
    ctx.lineTo(-halfBase, suspH);
    ctx.moveTo(halfBase, 6);
    ctx.lineTo(halfBase, suspH);
    ctx.stroke();

    // Suspension Springs (Coil lines)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-halfBase, 6);
    ctx.lineTo(-halfBase, suspH);
    ctx.moveTo(halfBase, 6);
    ctx.lineTo(halfBase, suspH);
    ctx.stroke();

    // 3. Render Wheels (at local hubs: -halfBase and +halfBase)
    this.renderWheel(ctx, -halfBase, suspH, wheelRadius, this.state.rearWheelAngle);
    this.renderWheel(ctx, halfBase, suspH, wheelRadius, this.state.frontWheelAngle);

    // 4. Vehicle-Specific Custom Chariot Body & Equipment
    if (this.vehicle.id === 'garuda_turbo') {
      // GARUDA TURBO ROCKET SPEEDER
      // Sleek crimson aerodynamic fuselage with gold wings
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.moveTo(chassisWidth / 2 + 18, 4); // sharp aerodynamic eagle nose
      ctx.lineTo(chassisWidth / 2 - 8, -chassisHeight / 2);
      ctx.lineTo(-chassisWidth / 2, -chassisHeight / 2 + 4);
      ctx.lineTo(-chassisWidth / 2 - 14, 10);
      ctx.lineTo(chassisWidth / 2 - 8, 14);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Swept-back Wings
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(-15, -4);
      ctx.lineTo(-38, -26);
      ctx.lineTo(-12, -26);
      ctx.lineTo(10, -4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rocket Thruster Cone at Rear
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(-chassisWidth / 2, -2);
      ctx.lineTo(-chassisWidth / 2 - 18, -8);
      ctx.lineTo(-chassisWidth / 2 - 18, 14);
      ctx.lineTo(-chassisWidth / 2, 8);
      ctx.closePath();
      ctx.fill();

      // Rocket Plasma Flame when Gas is pressed
      if (this.isGasPressed) {
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.moveTo(-chassisWidth / 2 - 18, -4);
        ctx.lineTo(-chassisWidth / 2 - 40 - Math.random() * 16, 3);
        ctx.lineTo(-chassisWidth / 2 - 18, 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(-chassisWidth / 2 - 18, -1);
        ctx.lineTo(-chassisWidth / 2 - 26, 3);
        ctx.lineTo(-chassisWidth / 2 - 18, 7);
        ctx.closePath();
        ctx.fill();
      }

    } else if (this.vehicle.id === 'airavata_rover') {
      // AIRAVATA 4x4 HEAVY OFF-ROAD MONSTER
      // Rugged Cyan / Ocean Blue chassis
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.roundRect(-chassisWidth / 2, -chassisHeight / 2, chassisWidth, chassisHeight, [16, 16, 6, 6]);
      ctx.fill();
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Steel Roll Cage Tubes
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-chassisWidth / 2 + 10, -chassisHeight / 2);
      ctx.lineTo(-chassisWidth / 2 + 18, -chassisHeight / 2 - 18);
      ctx.lineTo(chassisWidth / 2 - 18, -chassisHeight / 2 - 18);
      ctx.lineTo(chassisWidth / 2 - 10, -chassisHeight / 2);
      ctx.stroke();

      // Golden Treasure / Modak Trunks on Roof Rack
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(-14, -chassisHeight / 2 - 28, 28, 10);
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2;
      ctx.strokeRect(-14, -chassisHeight / 2 - 28, 28, 10);

      // Heavy Front Steel Bullbar & Headlights
      ctx.fillStyle = '#334155';
      ctx.fillRect(chassisWidth / 2 - 4, -4, 12, 16);
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(chassisWidth / 2 + 6, -2, 5, 0, Math.PI * 2);
      ctx.arc(chassisWidth / 2 + 6, 8, 5, 0, Math.PI * 2);
      ctx.fill();

      // Twin Vertical Exhaust Stacks
      ctx.fillStyle = '#475569';
      ctx.fillRect(-chassisWidth / 2 + 6, -chassisHeight / 2 - 14, 6, 14);

    } else if (this.vehicle.id === 'kailash_quad') {
      // KAILASH SNOW QUAD STUNT BIKE
      // Exposed tubular sport frame in vivid Purple & Hot Pink
      ctx.fillStyle = '#9333EA';
      ctx.beginPath();
      ctx.roundRect(-chassisWidth / 2 + 6, -chassisHeight / 2 + 8, chassisWidth - 12, chassisHeight - 12, [10, 16, 4, 4]);
      ctx.fill();
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Motocross Handlebars
      ctx.strokeStyle = '#F8FAFC';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(12, -chassisHeight / 2 + 8);
      ctx.lineTo(20, -chassisHeight / 2 - 12);
      ctx.lineTo(14, -chassisHeight / 2 - 15);
      ctx.stroke();

      // High Intensity LED Headlamp
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(chassisWidth / 2 - 2, 2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Rear Stunt Grab Bar
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-chassisWidth / 2 + 6, -4);
      ctx.lineTo(-chassisWidth / 2 - 10, -14);
      ctx.lineTo(-chassisWidth / 2 - 6, -18);
      ctx.stroke();

    } else {
      // MUSHIKA CHARIOT (CLASSIC DIVINE FESTIVAL RATH)
      ctx.fillStyle = '#EAB308';
      ctx.beginPath();
      ctx.roundRect(-chassisWidth / 2, -chassisHeight / 2, chassisWidth, chassisHeight, [12, 18, 6, 6]);
      ctx.fill();
      ctx.strokeStyle = '#FF671F';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(-chassisWidth / 2 + 3, -chassisHeight / 2 + 3, chassisWidth - 6, chassisHeight - 6);

      // Lotus Emblem
      ctx.fillStyle = '#B45309';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🕉️', 0, 4);

      // Rear Exhaust Pipe
      ctx.fillStyle = '#334155';
      ctx.fillRect(-chassisWidth / 2 - 8, 4, 10, 8);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-chassisWidth / 2 - 10, 3, 3, 10);
    }

    // 5. Divine Driver: Lord Ganesha Sitting in Chariot
    this.renderGaneshaDriver(ctx);

    ctx.restore();
  }

  private renderWheel(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, angle: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const vehId = this.vehicle.id;

    if (vehId === 'airavata_rover') {
      // Monster Truck Off-Road Lug Tires
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Deep knobby mud lugs
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Rugged Silver Rim
      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // 6 Heavy-duty Lug Bolts
      ctx.fillStyle = '#E2E8F0';
      for (let b = 0; b < 6; b++) {
        const ba = (b / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(ba) * radius * 0.45, Math.sin(ba) * radius * 0.45, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Center Hub
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

    } else if (vehId === 'kailash_quad') {
      // Studded Snow Tires with Purple Alloy Star Rim
      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Steel Grip Studs
      ctx.fillStyle = '#F8FAFC';
      for (let s = 0; s < 8; s++) {
        const sa = (s / 8) * Math.PI * 2;
        ctx.fillRect(Math.cos(sa) * radius * 0.85 - 1.5, Math.sin(sa) * radius * 0.85 - 1.5, 3, 3);
      }

      // 5-Star Purple Alloy Center
      ctx.fillStyle = '#C084FC';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#7E22CE';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

    } else if (vehId === 'garuda_turbo') {
      // Gold Turbine Alloy Racing Wheels
      ctx.fillStyle = '#09090B';
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Red Racing Lip
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Gold Turbine Vane Spokes
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.68, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2.5;
      for (let s = 0; s < 8; s++) {
        const sa = (s / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(sa + 0.2) * radius * 0.68, Math.sin(sa + 0.2) * radius * 0.68);
        ctx.stroke();
      }

      // Ruby Center Cap
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Classic Brass Spoked Chariot Wheels
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2.5;
      for (let s = 0; s < 6; s++) {
        const spokeAngle = (s / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(spokeAngle) * radius * 0.65, Math.sin(spokeAngle) * radius * 0.65);
        ctx.stroke();
      }

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private renderGaneshaDriver(ctx: CanvasRenderingContext2D) {
    // Driver Ganesha positioned on top of the chassis seat
    const driverX = 5;
    const driverY = -this.vehicle.chassisHeight / 2 - 14;

    ctx.save();
    ctx.translate(driverX, driverY);

    // 1. Saffron Silk Dhoti & Torso
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.roundRect(-16, 2, 32, 22, [6, 6, 2, 2]);
    ctx.fill();

    // 2. Ganesha Elephant Head (Skin Tone)
    ctx.fillStyle = '#F5CBA7';
    ctx.beginPath();
    ctx.arc(0, -10, 16, 0, Math.PI * 2);
    ctx.fill();

    // 3. Curved Elephant Trunk
    ctx.strokeStyle = '#F5CBA7';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(6, -6);
    ctx.quadraticCurveTo(18, -4, 16, 4);
    ctx.quadraticCurveTo(14, 10, 18, 12);
    ctx.stroke();

    // Tiny Modak at tip of trunk
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(19, 12, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Large Elephant Ears
    ctx.fillStyle = '#F5CBA7';
    ctx.beginPath();
    ctx.ellipse(-14, -12, 10, 6, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(14, -12, 10, 6, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Ear Jhumka gold rings
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(-16, -6, 2.5, 0, Math.PI * 2);
    ctx.arc(16, -6, 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // 5. White Ivory Tusk with Gold Cap
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(4, -4);
    ctx.lineTo(10, -2);
    ctx.lineTo(4, 0);
    ctx.closePath();
    ctx.fill();

    // 6. Sacred Tilak & Trishul Mark on Forehead
    ctx.fillStyle = '#E11D48';
    ctx.fillRect(-1.5, -18, 3, 7);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-3, -15, 6, 2);

    // 7. Golden Mukut (Ornate Crown)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(-12, -22);
    ctx.lineTo(12, -22);
    ctx.lineTo(8, -34);
    ctx.lineTo(0, -40); // Spire peak
    ctx.lineTo(-8, -34);
    ctx.closePath();
    ctx.fill();

    // Crown Ruby Gem
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(0, -28, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 8. Arms holding steering reins
    ctx.strokeStyle = '#F5CBA7';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-6, 8);
    ctx.lineTo(16, 12);
    ctx.stroke();

    // Golden Armlet
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(4, 8, 4, 4);

    ctx.restore();
  }
}
