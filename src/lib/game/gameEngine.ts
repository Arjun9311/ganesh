import * as THREE from 'three';
import { LaneIndex, GameStats, PowerUpState, FloatingText, WorldTheme } from '@/types/game';
import { 
  createGaneshaCharacter, 
  createMushika, 
  createHoverboardAttachment, 
  createJetpackAttachment, 
  createSuperSneakersAttachment 
} from './models';
import { TrackManager, LANE_POSITIONS, LANE_WIDTH, TrackObstacle, TrackCollectible } from './trackGenerator';
import { ParticlePool, AmbientPetalSystem } from './particleSystem';
import { audioEngine } from '../audioEngine';
import { unlockAchievement } from '../achievements';
import { WORLD_THEMES } from './themeConfig';

export type GameEventCallback = {
  onStatsUpdate?: (stats: GameStats, powerups: PowerUpState) => void;
  onFloatingText?: (text: FloatingText) => void;
  onGameOver?: (stats: GameStats) => void;
  onVictory?: (stats: GameStats) => void;
  onWorldChange?: (world: WorldTheme) => void;
  onSaveMePrompt?: (stats: GameStats, continueCallback: (revive: boolean) => void) => void;
};

export class GameEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private trackManager: TrackManager;
  private particlePool: ParticlePool;
  private petalSystem: AmbientPetalSystem;

  // Ganesha & Mushika 3D objects
  private ganesha: THREE.Group;
  private mushika: THREE.Group;
  private auraMesh: THREE.Mesh | null = null;
  private bodyGroup: THREE.Group | null = null;
  private leftLeg: THREE.Group | null = null;
  private rightLeg: THREE.Group | null = null;
  private leftEar: THREE.Mesh | null = null;
  private rightEar: THREE.Mesh | null = null;

  // Subway Surfers Attachments on Ganesha
  private hoverboardMesh: THREE.Group;
  private jetpackMesh: THREE.Group;
  private sneakersMesh: THREE.Group;

  // Lighting
  private dirLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;

  // Player physics state
  private targetLane: LaneIndex = 0;
  private currentLaneX: number = 0;
  private posY: number = 0;
  private velY: number = 0;
  private currentGroundY: number = 0;
  private isGrounded: boolean = true;
  private isSliding: boolean = false;
  private slideTimer: number = 0;
  private runAnimTime: number = 0;
  private invulnerableTimer: number = 0;

  // Camera Shake & FX
  private cameraShake: number = 0;
  private targetCameraFov: number = 60;

  // Game Loop & Stats
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private lastTime: number = 0;
  private animFrameId: number | null = null;

  private stats: GameStats = {
    score: 0,
    distance: 0,
    vighnasDestroyed: 0,
    modaksCollected: 0,
    currentCombo: 1,
    maxCombo: 1,
    lives: 3,
    currentWorld: 'festival_street',
    gameTime: 0,
    isGameOver: false,
    isVictory: false,
    isPaused: false,
    currentLane: 0,
    highScore: 0,
    hasUsedSaveMe: false,
    hoverboardsCount: 3,
    multiplier: 1,
    isOnRooftop: false
  };

  private powerups: PowerUpState = {
    isDivineMode: false,
    divineModeTimer: 0,
    isMushikaBoost: false,
    mushikaTimer: 0,
    hasShield: false,
    hasMagnet: false,
    magnetTimer: 0,
    hasHammer: false,
    hammerTimer: 0,
    hasHoverboard: false,
    hoverboardTimer: 0,
    isJetpackFlying: false,
    jetpackTimer: 0,
    hasSuperJump: false,
    superJumpTimer: 0,
    has2XMultiplier: false,
    multiplierTimer: 0
  };

  private consecutiveActions: number = 0;
  private floatingOffsetIndex: number = 0;
  private baseSpeed: number = 19; // Snappy Subway Surfers running speed
  private callbacks: GameEventCallback;

  constructor(container: HTMLElement, callbacks: GameEventCallback = {}) {
    this.container = container;
    this.callbacks = callbacks;

    // Load High Score from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vighnaharta_high_score');
      if (stored) this.stats.highScore = parseInt(stored, 10) || 0;
    }

    // 1. Three.js Scene, Camera, Renderer (Realistic Daylight PBR with ACES Filmic Tone Mapping)
    const initTheme = WORLD_THEMES.festival_street;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(initTheme.skyColor);
    this.scene.fog = new THREE.FogExp2(initTheme.fogColor, initTheme.fogDensity);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    this.camera.position.set(0, 3.4, 5.8);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // 2. Realistic Lights (Warm Directional Sun with Tuned Soft Shadows & Sky Hemisphere Light)
    this.hemiLight = new THREE.HemisphereLight(initTheme.hemiSky, initTheme.hemiGround, initTheme.hemiIntensity * 1.1);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(initTheme.dirColor, initTheme.dirIntensity * 1.3);
    this.dirLight.position.set(14, 28, 14);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 90;
    this.dirLight.shadow.camera.left = -16;
    this.dirLight.shadow.camera.right = 16;
    this.dirLight.shadow.camera.top = 25;
    this.dirLight.shadow.camera.bottom = -25;
    this.dirLight.shadow.bias = -0.0003;
    this.dirLight.shadow.normalBias = 0.02;
    this.scene.add(this.dirLight);
    this.scene.add(this.dirLight.target);

    // 3. Track Manager & Particle Systems
    this.trackManager = new TrackManager(this.scene);
    this.particlePool = new ParticlePool(this.scene, 180);
    this.petalSystem = new AmbientPetalSystem(this.scene, 50);

    // 4. Characters & Subway Surfers Attachments
    this.ganesha = createGaneshaCharacter();
    this.scene.add(this.ganesha);

    // Attach powerup models to Ganesha
    this.hoverboardMesh = createHoverboardAttachment();
    this.hoverboardMesh.visible = false;
    this.ganesha.add(this.hoverboardMesh);

    this.jetpackMesh = createJetpackAttachment();
    this.jetpackMesh.visible = false;
    this.ganesha.add(this.jetpackMesh);

    this.sneakersMesh = createSuperSneakersAttachment();
    this.sneakersMesh.visible = false;
    this.ganesha.add(this.sneakersMesh);

    // Cache internal animation limbs
    this.bodyGroup = this.ganesha.getObjectByName('bodyGroup') as THREE.Group;
    this.leftLeg = this.ganesha.getObjectByName('leftLeg') as THREE.Group;
    this.rightLeg = this.ganesha.getObjectByName('rightLeg') as THREE.Group;
    this.leftEar = this.ganesha.getObjectByName('leftEar') as THREE.Mesh;
    this.rightEar = this.ganesha.getObjectByName('rightEar') as THREE.Mesh;
    this.auraMesh = this.ganesha.getObjectByName('divineAuraMesh') as THREE.Mesh;

    this.mushika = createMushika();
    this.mushika.visible = false;
    this.scene.add(this.mushika);

    // Resize & Orientation listeners
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('orientationchange', this.onWindowResize);

    // Initial render
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize = () => {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public start() {
    this.resetState();
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
    audioEngine.startFestivalRhythm();
  }

  public pause() {
    this.isPaused = true;
    this.stats.isPaused = true;
    audioEngine.stopFestivalRhythm();
    this.emitStats();
  }

  public resume() {
    if (!this.isRunning) return;
    this.isPaused = false;
    this.stats.isPaused = false;
    this.lastTime = performance.now();
    audioEngine.startFestivalRhythm();
    this.emitStats();
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    audioEngine.stopFestivalRhythm();
  }

  public resetState() {
    this.targetLane = 0;
    this.currentLaneX = 0;
    this.posY = 0;
    this.velY = 0;
    this.currentGroundY = 0;
    this.isGrounded = true;
    this.isSliding = false;
    this.slideTimer = 0;
    this.runAnimTime = 0;
    this.invulnerableTimer = 0;
    this.consecutiveActions = 0;

    const currentBest = this.stats.highScore;
    this.stats = {
      score: 0,
      distance: 0,
      vighnasDestroyed: 0,
      modaksCollected: 0,
      currentCombo: 1,
      maxCombo: 1,
      lives: 3,
      currentWorld: 'festival_street',
      gameTime: 0,
      isGameOver: false,
      isVictory: false,
      isPaused: false,
      currentLane: 0,
      highScore: currentBest,
      hasUsedSaveMe: false,
      hoverboardsCount: Math.max(this.stats.hoverboardsCount, 3),
      multiplier: 1,
      isOnRooftop: false
    };

    this.powerups = {
      isDivineMode: false,
      divineModeTimer: 0,
      isMushikaBoost: false,
      mushikaTimer: 0,
      hasShield: false,
      hasMagnet: false,
      magnetTimer: 0,
      hasHammer: false,
      hammerTimer: 0,
      hasHoverboard: false,
      hoverboardTimer: 0,
      isJetpackFlying: false,
      jetpackTimer: 0,
      hasSuperJump: false,
      superJumpTimer: 0,
      has2XMultiplier: false,
      multiplierTimer: 0
    };

    this.ganesha.position.set(0, 0, 0);
    this.ganesha.rotation.set(0, 0, 0);
    if (this.bodyGroup) this.bodyGroup.scale.set(1, 1, 1);
    if (this.auraMesh) this.auraMesh.visible = false;
    if (this.hoverboardMesh) this.hoverboardMesh.visible = false;
    if (this.jetpackMesh) this.jetpackMesh.visible = false;
    if (this.sneakersMesh) this.sneakersMesh.visible = false;
    this.mushika.visible = false;

    this.trackManager.reset();
  }

  // --- Player Input Handlers ---
  public moveLeft() {
    if (this.isPaused || !this.isRunning || this.stats.isGameOver) return;
    if (this.targetLane > -1) {
      this.targetLane = (this.targetLane - 1) as LaneIndex;
      this.stats.currentLane = this.targetLane;
      audioEngine.playLaneSwitch();
    }
  }

  public moveRight() {
    if (this.isPaused || !this.isRunning || this.stats.isGameOver) return;
    if (this.targetLane < 1) {
      this.targetLane = (this.targetLane + 1) as LaneIndex;
      this.stats.currentLane = this.targetLane;
      audioEngine.playLaneSwitch();
    }
  }

  public jump() {
    if (this.isPaused || !this.isRunning || this.stats.isGameOver) return;
    // Can jump from ground or cancel out of an active slide
    if (this.isGrounded || this.isSliding) {
      this.isGrounded = false;
      this.isSliding = false;
      this.slideTimer = 0;
      if (this.bodyGroup) this.bodyGroup.scale.set(1, 1, 1);

      if (this.powerups.hasSuperJump) {
        this.velY = 17.5; // Super Bouncy Shoes jump!
        audioEngine.playSuperJump();
      } else {
        this.velY = 12.0; // Responsive Subway Surfers standard jump
        audioEngine.playJump();
      }
    }
  }

  public slide() {
    if (this.isPaused || !this.isRunning || this.stats.isGameOver) return;
    if (!this.isGrounded) {
      // Subway Surfers mid-air fast fall dive down!
      this.velY = -24.0;
      this.isSliding = true;
      this.slideTimer = 0.7;
      audioEngine.playSlide();
    } else if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = 0.7; // 0.7s slide duration
      audioEngine.playSlide();
    }
  }

  public deployHoverboard() {
    if (this.isPaused || !this.isRunning || this.stats.isGameOver) return;
    if (this.powerups.hasHoverboard) return;

    if (this.stats.hoverboardsCount <= 0) {
      this.emitFloatingText('NO HOVERBOARDS LEFT!', '#FF4500');
      return;
    }

    this.stats.hoverboardsCount--;
    this.powerups.hasHoverboard = true;
    this.powerups.hoverboardTimer = 25.0; // 25s duration
    if (this.hoverboardMesh) this.hoverboardMesh.visible = true;
    audioEngine.playHoverboardDeploy();
    this.emitFloatingText('🛹 MUSHIKA HOVERBOARD!', '#00F0FF');
    this.emitStats();
  }

  public revivePlayer() {
    this.stats.lives = 1;
    this.stats.hasUsedSaveMe = true;
    this.stats.isGameOver = false;
    this.isRunning = true;
    this.isPaused = false;
    this.invulnerableTimer = 3.0; // 3 seconds invincible shield after revive
    if (this.bodyGroup) this.bodyGroup.scale.set(1, 1, 1);

    audioEngine.playSaveMeRevive();
    audioEngine.startFestivalRhythm();
    this.emitFloatingText('✨ REVIVED! RUN!', '#FFD700');
    this.emitStats();

    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  // --- Main Game Loop (60 FPS) ---
  private loop = (time: number) => {
    if (!this.isRunning) return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    if (!this.isPaused && !this.stats.isGameOver && !this.stats.isVictory) {
      this.update(dt);
    }

    this.render();
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.stats.gameTime += dt;

    // 1. Calculate running speed (increases with distance & powerups)
    let currentSpeed = this.baseSpeed + Math.min(this.stats.distance * 0.006, 12);
    if (this.powerups.isMushikaBoost) currentSpeed *= 1.45;
    if (this.powerups.isDivineMode) currentSpeed *= 1.3;
    if (this.powerups.isJetpackFlying) currentSpeed *= 1.35;

    // Move Ganesha forward along -Z axis
    const forwardDelta = currentSpeed * dt;
    this.ganesha.position.z -= forwardDelta;
    this.stats.distance = Math.floor(Math.abs(this.ganesha.position.z));

    const scoreMultiplier = (this.powerups.has2XMultiplier ? 2 : 1) * this.stats.currentCombo;
    this.stats.multiplier = scoreMultiplier;
    this.stats.score += Math.floor(forwardDelta * 1.5 * scoreMultiplier);

    // Update real-time High Score
    if (this.stats.score > this.stats.highScore) {
      this.stats.highScore = this.stats.score;
      if (typeof window !== 'undefined') {
        localStorage.setItem('vighnaharta_high_score', String(this.stats.highScore));
      }
    }

    // 2. Snappy 3-lane switching interpolation (cubic lerp)
    const targetX = LANE_POSITIONS[this.targetLane + 1];
    const laneSpeed = 18.0;
    this.currentLaneX += (targetX - this.currentLaneX) * Math.min(dt * laneSpeed, 1.0);
    this.ganesha.position.x = this.currentLaneX;

    // Banking & tilt when switching lanes
    const laneDiff = targetX - this.currentLaneX;
    this.ganesha.rotation.z = -laneDiff * 0.18;
    this.ganesha.rotation.y = laneDiff * 0.22;

    // 3. Update Moving Carts
    const activeObstacles = this.trackManager.getActiveObstacles();
    for (const obs of activeObstacles) {
      if (obs.isMoving && !obs.destroyed) {
        obs.position.z += (obs.moveSpeed || 7.0) * dt;
        obs.mesh.position.z = obs.position.z;
      }
    }

    // 4. Subway Surfers Rooftop & Ramp Detection
    let targetGround = 0;
    let onRooftop = false;
    for (const obs of activeObstacles) {
      if (obs.destroyed) continue;
      const laneX = LANE_POSITIONS[obs.lane + 1];
      if (Math.abs(this.currentLaneX - laneX) < 1.15) {
        if (obs.isRamp) {
          const halfLen = (obs.rampLength || 4.8) / 2;
          const startZ = obs.position.z + halfLen;
          const endZ = obs.position.z - halfLen;
          if (this.ganesha.position.z <= startZ && this.ganesha.position.z >= endZ) {
            const progress = (startZ - this.ganesha.position.z) / (obs.rampLength || 4.8);
            const rampY = Math.max(0, Math.min(progress * (obs.roofHeight || 2.2), obs.roofHeight || 2.2));
            if (rampY > targetGround) {
              targetGround = rampY;
              onRooftop = true;
            }
          }
        } else if (obs.isRooftopWagon) {
          const halfLen = (obs.wagonLength || 7.0) / 2;
          const startZ = obs.position.z + halfLen;
          const endZ = obs.position.z - halfLen;
          if (this.ganesha.position.z <= startZ && this.ganesha.position.z >= endZ) {
            // If player is at rooftop height (or close), they run on top of the train!
            if (this.posY >= (obs.roofHeight || 2.2) - 0.5) {
              targetGround = obs.roofHeight || 2.2;
              onRooftop = true;
            }
          }
        }
      }
    }
    this.currentGroundY = targetGround;
    this.stats.isOnRooftop = onRooftop;

    // 5. Jump Physics, Jetpack Flight & Slide Timer
    if (this.powerups.isJetpackFlying) {
      // Rocket up to y = 8.0 smoothly
      this.posY += (8.0 - this.posY) * Math.min(dt * 5.0, 1.0);
      this.velY = 0;
      this.isGrounded = false;
    } else {
      // Subway Surfers Gravity towards currentGroundY
      if (!this.isGrounded || this.posY > this.currentGroundY) {
        this.velY -= 28.0 * dt;
        this.posY += this.velY * dt;
        if (this.posY <= this.currentGroundY) {
          this.posY = this.currentGroundY;
          this.velY = 0;
          this.isGrounded = true;
        }
      } else if (this.posY < this.currentGroundY) {
        // Riding up an incline ramp
        this.posY = this.currentGroundY;
        this.velY = 0;
        this.isGrounded = true;
      }
    }
    this.ganesha.position.y = this.posY;

    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
        if (this.bodyGroup) this.bodyGroup.scale.set(1, 1, 1);
      } else {
        // Squish body low while sliding
        if (this.bodyGroup) this.bodyGroup.scale.set(1.2, 0.45, 1.3);
      }
    } else {
      if (this.bodyGroup) this.bodyGroup.scale.set(1, 1, 1);
    }

    // 6. Character Running Animation & Lifelike Wind Flutter
    this.runAnimTime += dt * currentSpeed * 0.8;
    if (this.leftLeg && this.rightLeg && this.isGrounded && !this.isSliding && !this.powerups.hasHoverboard) {
      this.leftLeg.rotation.x = Math.sin(this.runAnimTime) * 0.65;
      this.rightLeg.rotation.x = -Math.sin(this.runAnimTime) * 0.65;

      // Natural running torso bob synced with footfalls
      if (this.bodyGroup) {
        this.bodyGroup.position.y = Math.abs(Math.sin(this.runAnimTime)) * 0.04;
      }

      // Realistic gentle ear flutter in wind
      if (this.leftEar && this.rightEar) {
        this.leftEar.rotation.z = Math.sin(this.runAnimTime * 0.6) * 0.08;
        this.rightEar.rotation.z = -Math.sin(this.runAnimTime * 0.6) * 0.08;
      }

      // Dynamic silk scarf fluttering in headwind
      const scarfL = this.ganesha.getObjectByName('scarfLeft') as THREE.Mesh;
      const scarfR = this.ganesha.getObjectByName('scarfRight') as THREE.Mesh;
      if (scarfL && scarfR) {
        scarfL.rotation.x = -0.35 + Math.sin(this.runAnimTime * 1.6) * 0.15;
        scarfR.rotation.x = -0.35 + Math.cos(this.runAnimTime * 1.6) * 0.15;
      }
    } else if (this.powerups.hasHoverboard) {
      // Hoverboard stance (surfing pose)
      if (this.leftLeg && this.rightLeg) {
        this.leftLeg.rotation.x = 0.2;
        this.rightLeg.rotation.x = -0.2;
      }
      if (this.bodyGroup) this.bodyGroup.position.y = 0;
      this.ganesha.rotation.y = laneDiff * 0.2 + 0.15;
    } else {
      if (this.bodyGroup && !this.isSliding) this.bodyGroup.position.y = 0;
    }

    // 7. Update Mushika Companion
    if (this.powerups.isMushikaBoost) {
      this.mushika.visible = true;
      this.mushika.position.set(this.currentLaneX + 1.2, this.posY, this.ganesha.position.z - 0.4);
      this.mushika.rotation.y = Math.PI;
    } else {
      this.mushika.visible = false;
    }

    // 8. Update Timers & Attachment Mesh Visibilities
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
      this.ganesha.visible = Math.floor(Date.now() / 80) % 2 === 0;
    } else {
      this.ganesha.visible = true;
    }

    // Hoverboard
    if (this.powerups.hasHoverboard) {
      this.powerups.hoverboardTimer -= dt;
      this.hoverboardMesh.visible = true;
      if (this.powerups.hoverboardTimer <= 0) {
        this.powerups.hasHoverboard = false;
        this.hoverboardMesh.visible = false;
        this.emitFloatingText('Hoverboard Expired', '#94A3B8');
      }
    } else {
      this.hoverboardMesh.visible = false;
    }

    // Jetpack
    if (this.powerups.isJetpackFlying) {
      this.powerups.jetpackTimer -= dt;
      this.jetpackMesh.visible = true;
      if (this.powerups.jetpackTimer <= 0) {
        this.powerups.isJetpackFlying = false;
        this.jetpackMesh.visible = false;
        this.emitFloatingText('Landing safely...', '#F59E0B');
      }
    } else {
      this.jetpackMesh.visible = false;
    }

    // Super Jump Sneakers
    if (this.powerups.hasSuperJump) {
      this.powerups.superJumpTimer -= dt;
      this.sneakersMesh.visible = true;
      if (this.powerups.superJumpTimer <= 0) {
        this.powerups.hasSuperJump = false;
        this.sneakersMesh.visible = false;
      }
    } else {
      this.sneakersMesh.visible = false;
    }

    // 2X Multiplier
    if (this.powerups.has2XMultiplier) {
      this.powerups.multiplierTimer -= dt;
      if (this.powerups.multiplierTimer <= 0) {
        this.powerups.has2XMultiplier = false;
      }
    }

    // Divine Mode
    if (this.powerups.isDivineMode) {
      this.powerups.divineModeTimer -= dt;
      if (this.auraMesh) {
        this.auraMesh.visible = true;
        this.auraMesh.rotation.y += 2.0 * dt;
      }
      if (this.powerups.divineModeTimer <= 0) {
        this.powerups.isDivineMode = false;
        if (this.auraMesh) this.auraMesh.visible = false;
      }
    }

    if (this.powerups.isMushikaBoost) {
      this.powerups.mushikaTimer -= dt;
      if (this.powerups.mushikaTimer <= 0) {
        this.powerups.isMushikaBoost = false;
      }
    }

    if (this.powerups.hasMagnet) {
      this.powerups.magnetTimer -= dt;
      if (this.powerups.magnetTimer <= 0) {
        this.powerups.hasMagnet = false;
      }
    }

    // 9. Track & Environment Updates
    const trackUpdate = this.trackManager.update(
      this.ganesha.position.z,
      this.stats.distance,
      this.stats.vighnasDestroyed
    );
    if (trackUpdate.newWorld) {
      this.stats.currentWorld = trackUpdate.newWorld;
      this.updateWorldAtmosphere(trackUpdate.newWorld);
      if (this.callbacks.onWorldChange) {
        this.callbacks.onWorldChange(trackUpdate.newWorld);
      }
      this.emitStats();
    }

    // 10. Collision Detection
    this.checkCollectibleCollisions();
    this.checkObstacleCollisions();

    // 11. Particles
    this.particlePool.update(dt);
    this.petalSystem.update(this.ganesha.position.z, dt);

    // 12. Realistic Directional Sun Shadow Tracking
    this.dirLight.position.x = this.ganesha.position.x + 14;
    this.dirLight.position.z = this.ganesha.position.z + 14;
    this.dirLight.target.position.set(this.ganesha.position.x, 0, this.ganesha.position.z - 4);
    this.dirLight.target.updateMatrixWorld();

    // 13. Cinematic Camera Follow & Camera Shake
    if (this.cameraShake > 0) {
      this.cameraShake -= dt * 4;
      if (this.cameraShake < 0) this.cameraShake = 0;
    }
    const shakeOffsetX = (Math.random() - 0.5) * this.cameraShake * 0.4;
    const shakeOffsetY = (Math.random() - 0.5) * this.cameraShake * 0.4;

    const targetCamX = this.ganesha.position.x * 0.35 + shakeOffsetX;
    const targetCamY = this.powerups.isJetpackFlying
      ? this.ganesha.position.y * 0.3 + 4.8 + shakeOffsetY
      : this.ganesha.position.y * 0.35 + 2.7 + shakeOffsetY;
    const targetCamZ = this.powerups.isJetpackFlying
      ? this.ganesha.position.z + 7.0
      : this.ganesha.position.z + 5.0;

    this.camera.position.x += (targetCamX - this.camera.position.x) * (dt * 12);
    this.camera.position.y += (targetCamY - this.camera.position.y) * (dt * 12);
    this.camera.position.z = targetCamZ;
    this.camera.lookAt(
      this.ganesha.position.x * 0.15,
      this.ganesha.position.y + 0.95,
      this.ganesha.position.z - 11.0
    );

    // Emit periodic stats to React UI
    this.emitStats();
  }

  private checkCollectibleCollisions() {
    const collectibles = this.trackManager.getActiveCollectibles();
    const playerPos = this.ganesha.position;
    const isMagnetActive = this.powerups.hasMagnet || this.powerups.isDivineMode || this.powerups.isJetpackFlying;

    for (const col of collectibles) {
      const dist = playerPos.distanceTo(col.mesh.position);
      // Subway Surfers Magnet sweeps all coins across all lanes!
      if (isMagnetActive && dist < 12.0) {
        col.mesh.position.lerp(playerPos, 0.2);
      }

      // Collect radius
      if (dist < 1.7) {
        col.collected = true;
        col.mesh.visible = false;

        this.incrementCombo();
        this.particlePool.spawnModakSparkle(col.mesh.position, col.type === 'golden_modak');

        const scoreMultiplier = (this.powerups.has2XMultiplier ? 2 : 1) * this.stats.currentCombo;

        if (col.type === 'modak') {
          const modakScore = 100 * scoreMultiplier;
          this.stats.score += modakScore;
          this.stats.modaksCollected += 1;
          audioEngine.playModakCollect(false);
          this.emitFloatingText(`+${modakScore}`, '#FFB800');

          if (this.stats.modaksCollected >= 50) {
            unlockAchievement('MODAK_MASTER');
          }
        } else if (col.type === 'golden_modak') {
          this.stats.score += 500 * scoreMultiplier;
          this.stats.modaksCollected += 1;
          this.powerups.isDivineMode = true;
          this.powerups.divineModeTimer = 10.0;
          this.cameraShake = 0.5;
          audioEngine.playModakCollect(true);
          audioEngine.playDivineMode();
          this.emitFloatingText('✨ DIVINE MODE ✨', '#FFD700');
          unlockAchievement('GOLDEN_BLESSING');
        } else if (col.type === 'jetpack') {
          this.powerups.isJetpackFlying = true;
          this.powerups.jetpackTimer = 8.0; // 8s flight
          this.jetpackMesh.visible = true;
          audioEngine.playJetpackFlight();
          this.emitFloatingText('🚀 GARUDA JETPACK!', '#F59E0B');
        } else if (col.type === 'super_sneakers') {
          this.powerups.hasSuperJump = true;
          this.powerups.superJumpTimer = 12.0; // 12s high bounce
          this.sneakersMesh.visible = true;
          audioEngine.playSuperJump();
          this.emitFloatingText('👟 SUPER SNEAKERS!', '#06B6D4');
        } else if (col.type === 'hoverboard') {
          this.stats.hoverboardsCount++;
          this.deployHoverboard();
        } else if (col.type === 'multiplier_2x') {
          this.powerups.has2XMultiplier = true;
          this.powerups.multiplierTimer = 15.0;
          this.emitFloatingText('⚡ 2X MULTIPLIER!', '#A855F7');
        } else if (col.type === 'mushika_powerup') {
          this.powerups.isMushikaBoost = true;
          this.powerups.mushikaTimer = 7.0;
          audioEngine.playMushikaBoost();
          this.emitFloatingText('⚡ MUSHIKA BOOST! ⚡', '#38BDF8');
          unlockAchievement('MUSHIKA_MASTER');
        } else if (col.type === 'diya') {
          this.powerups.hasShield = true;
          this.emitFloatingText('🛡️ GANESHA SHIELD!', '#FFA500');
        } else if (col.type === 'lotus') {
          const lotusScore = 150 * scoreMultiplier;
          this.stats.score += lotusScore;
          audioEngine.playModakCollect(false);
          this.emitFloatingText(`+${lotusScore} LOTUS`, '#FF6B8B');
        }
      }
    }
  }

  private checkObstacleCollisions() {
    // If flying with Jetpack, Ganesha is high in the sky above all ground obstacles!
    if (this.powerups.isJetpackFlying) return;

    const obstacles = this.trackManager.getActiveObstacles();
    const playerPos = this.ganesha.position;

    for (const obs of obstacles) {
      if (obs.destroyed) continue;

      // Incline ramps are never an obstacle: players run up them smoothly!
      if (obs.isRamp) continue;

      const dz = Math.abs(playerPos.z - obs.position.z);
      const dx = Math.abs(playerPos.x - obs.position.x);

      // 1. Train / Rath Wagon (Solid block, roof height = 2.2m)
      if (obs.isRooftopWagon) {
        const wagonHalfLen = (obs.wagonLength || 7.0) / 2;
        if (playerPos.z <= obs.position.z + wagonHalfLen && playerPos.z >= obs.position.z - wagonHalfLen && dx < 0.82) {
          // If player is on the roof: completely safe!
          if (this.posY >= (obs.roofHeight || 2.2) - 0.25) {
            continue;
          }
          // Divine mode smashes wagon!
          if (this.powerups.isDivineMode) {
            this.destroyVighna(obs, true);
          } else if (this.invulnerableTimer <= 0) {
            this.handleObstacleCollision(obs);
          }
        }
        continue;
      }

      // 2. Low Hurdle (Height: 0.85m - Requires Jump!)
      if (obs.type === 'hurdle_low' || (obs.requiresJump && obs.type !== 'dark_crow')) {
        if (dz < 1.05 && dx < 0.76) {
          if (this.powerups.isDivineMode) {
            this.destroyVighna(obs, true);
          } else if (this.posY >= 0.72) {
            // Successfully jumped over hurdle!
            this.destroyVighna(obs, false);
          } else if (this.invulnerableTimer <= 0) {
            // Did not jump - crashed into hurdle!
            this.handleObstacleCollision(obs);
          }
        }
        continue;
      }

      // 3. High Barrier / Toran (Requires Slide!)
      if (obs.type === 'barrier_high' || obs.requiresSlide) {
        if (dz < 1.05 && dx < 0.76) {
          if (this.powerups.isDivineMode) {
            this.destroyVighna(obs, true);
          } else if (this.isSliding && this.posY <= 0.55) {
            // Successfully slid under high barrier!
            this.destroyVighna(obs, false);
          } else if (this.invulnerableTimer <= 0) {
            // Hit head on barrier!
            this.handleObstacleCollision(obs);
          }
        }
        continue;
      }

      // 4. Moving Cart or other obstacles
      if (dz < 1.15 && dx < 0.80) {
        if (this.powerups.isDivineMode) {
          this.destroyVighna(obs, true);
        } else if (this.invulnerableTimer <= 0) {
          this.handleObstacleCollision(obs);
        }
      }
    }
  }

  private handleObstacleCollision(obs: TrackObstacle) {
    // SUBWAY SURFERS SIGNATURE: Hoverboard absorbs fatal hit!
    if (this.powerups.hasHoverboard) {
      this.powerups.hasHoverboard = false;
      this.powerups.hoverboardTimer = 0;
      this.hoverboardMesh.visible = false;
      this.cameraShake = 0.8;
      audioEngine.playHoverboardCrash();
      this.particlePool.spawnDestructionBurst(obs.position, 40);
      this.emitFloatingText('🛹 HOVERBOARD SAVED YOU!', '#00F0FF');
      this.invulnerableTimer = 2.5; // 2.5s golden recovery
      return;
    }

    if (this.powerups.hasShield) {
      this.powerups.hasShield = false;
      this.cameraShake = 0.4;
      audioEngine.playHit();
      this.emitFloatingText('🛡️ SHIELD BROKEN!', '#FFA500');
      this.invulnerableTimer = 1.6;
      return;
    }

    // Direct damage / life loss
    this.handlePlayerDamage();
  }

  private destroyVighna(obs: TrackObstacle, isDivineSmash: boolean = false) {
    if (obs.destroyed) return;
    obs.destroyed = true;
    obs.mesh.visible = false;

    this.stats.vighnasDestroyed += 1;
    const basePts = obs.type === 'final_vighna' ? 5000 : (obs.type === 'rath_wagon' ? 300 : 150);
    const scoreMultiplier = (this.powerups.has2XMultiplier ? 2 : 1) * this.stats.currentCombo;
    const scoreEarned = basePts * scoreMultiplier;
    this.stats.score += scoreEarned;

    this.cameraShake = isDivineSmash ? 0.8 : 0.45;
    audioEngine.playVighnaDestroy();
    this.particlePool.spawnDestructionBurst(obs.position, isDivineSmash ? 40 : 25);
    this.incrementCombo();

    this.emitFloatingText(
      obs.type === 'final_vighna' ? '✨ FINAL VIGHNA REMOVED! +5000' : `+${scoreEarned} CLEARED!`,
      '#FFE57F'
    );

    if (this.stats.vighnasDestroyed === 1) {
      unlockAchievement('FIRST_VIGHNA');
    }

    if (this.stats.vighnasDestroyed >= 108 || obs.type === 'final_vighna') {
      this.triggerVictory();
    }
  }

  private handlePlayerDamage() {
    this.stats.lives -= 1;
    this.consecutiveActions = 0;
    this.stats.currentCombo = 1;
    this.cameraShake = 0.7;
    audioEngine.playHit();
    this.invulnerableTimer = 1.6;

    if (this.stats.lives <= 0) {
      // SUBWAY SURFERS: Check if Save Me Revive can be offered!
      if (!this.stats.hasUsedSaveMe && this.callbacks.onSaveMePrompt) {
        this.pause();
        this.callbacks.onSaveMePrompt(this.stats, (revive) => {
          if (revive) {
            // Player paid modaks or chose free revive
            this.stats.modaksCollected = Math.max(0, this.stats.modaksCollected - 10);
            this.revivePlayer();
          } else {
            this.triggerGameOver();
          }
        });
      } else {
        this.triggerGameOver();
      }
    }
  }

  private incrementCombo() {
    this.consecutiveActions++;
    let combo = 1;
    if (this.consecutiveActions >= 25) combo = 8;
    else if (this.consecutiveActions >= 15) combo = 5;
    else if (this.consecutiveActions >= 10) combo = 4;
    else if (this.consecutiveActions >= 6) combo = 3;
    else if (this.consecutiveActions >= 3) combo = 2;

    if (combo > this.stats.currentCombo) {
      this.stats.currentCombo = combo;
      this.stats.maxCombo = Math.max(this.stats.maxCombo, combo);
      audioEngine.playComboUp(combo);
      this.emitFloatingText(`COMBO x${combo}!`, '#FF671F');

      if (combo >= 10) {
        unlockAchievement('COMBO_KING');
      }
    }
  }

  private triggerGameOver() {
    this.stats.isGameOver = true;
    this.stop();
    if (this.callbacks.onGameOver) {
      this.callbacks.onGameOver(this.stats);
    }
  }

  private triggerVictory() {
    this.stats.isVictory = true;
    this.stop();
    unlockAchievement('108_COMPLETE');
    unlockAchievement('VIGHNAHARTA');
    if (this.callbacks.onVictory) {
      this.callbacks.onVictory(this.stats);
    }
  }

  private updateWorldAtmosphere(world: WorldTheme) {
    const config = WORLD_THEMES[world];
    if (!config) return;

    this.scene.background = new THREE.Color(config.skyColor);
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.setHex(config.fogColor);
      this.scene.fog.density = config.fogDensity;
    } else {
      this.scene.fog = new THREE.FogExp2(config.fogColor, config.fogDensity);
    }

    this.hemiLight.color.setHex(config.hemiSky);
    this.hemiLight.groundColor.setHex(config.hemiGround);
    this.hemiLight.intensity = config.hemiIntensity;

    this.dirLight.color.setHex(config.dirColor);
    this.dirLight.intensity = config.dirIntensity;

    this.petalSystem.setTheme(config.petalColors);
    this.trackManager.applyThemeToActiveChunks(world);
    audioEngine.playWorldTransition();

    this.emitFloatingText(`${config.icon} ${config.name.toUpperCase()}!`, '#FFE57F');

    if (world === 'monsoon_festival') {
      unlockAchievement('STORM_BREAKER');
    } else if (world === 'divine_realm') {
      unlockAchievement('108_COMPLETE');
    }
  }

  public setTheme(world: WorldTheme) {
    this.stats.currentWorld = world;
    this.trackManager.setWorld(world);
    this.updateWorldAtmosphere(world);
    if (this.callbacks.onWorldChange) {
      this.callbacks.onWorldChange(world);
    }
    this.emitStats();
  }

  private emitStats() {
    if (this.callbacks.onStatsUpdate) {
      this.callbacks.onStatsUpdate({ ...this.stats }, { ...this.powerups });
    }
  }

  private emitFloatingText(text: string, color: string) {
    if (this.callbacks.onFloatingText) {
      this.floatingOffsetIndex = (this.floatingOffsetIndex + 1) % 4;
      const offsetY = this.floatingOffsetIndex * 6;
      const offsetX = ((this.floatingOffsetIndex % 2 === 0) ? -1 : 1) * (this.floatingOffsetIndex * 2.5);
      this.callbacks.onFloatingText({
        id: Math.random().toString(36).substring(2, 8),
        text,
        x: 50 + offsetX,
        y: 42 - offsetY,
        color,
        lifetime: 1.1
      });
    }
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    this.stop();
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('orientationchange', this.onWindowResize);
    this.particlePool.cleanup();
    this.petalSystem.cleanup();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
