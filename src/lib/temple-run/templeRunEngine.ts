import * as THREE from 'three';
import {
  CardinalHeading,
  LaneIndex,
  TempleWorldId,
  TempleGameStats,
  TemplePowerUpState,
  TurnPrompt,
  FloatingText,
  TempleObstacleType,
  TempleCollectibleType
} from '@/types/templeRun';
import {
  TRACK_CONFIG,
  CARDINAL_DIRECTIONS,
  CARDINAL_YAW,
  TEMPLE_WORLDS,
  getWorldForVighnas,
  shortestAngleDiff
} from './templeRunConfig';
import {
  createTempleGanesha,
  createTempleMushika
} from './templeRunModels';
import { TempleTrackManager } from './templeTrackManager';
import { audioEngine } from '../audioEngine';
import { getActiveGaneshaAvatar } from '../storage';

export interface TempleRunCallbacks {
  onStatsUpdate?: (stats: TempleGameStats, powerups: TemplePowerUpState, turnPrompt: TurnPrompt) => void;
  onFloatingText?: (text: FloatingText) => void;
  onRevivePrompt?: (stats: TempleGameStats, resolve: (revive: boolean) => void) => void;
  onGameOver?: (stats: TempleGameStats) => void;
  onVictory?: (stats: TempleGameStats) => void;
  onWorldChange?: (worldId: TempleWorldId) => void;
}

export class TempleRunEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private trackManager: TempleTrackManager;
  private callbacks: TempleRunCallbacks;

  // 3D Objects
  private ganeshaGroup: THREE.Group;
  private bodyGroup: THREE.Group;
  private leftLeg: THREE.Group;
  private rightLeg: THREE.Group;
  private leftEar: THREE.Mesh;
  private rightEar: THREE.Mesh;
  private trunkGroup: THREE.Group;
  private auraMesh: THREE.Mesh;
  private mushikaGroup: THREE.Group;

  // Ambient Snowfall Particle System (Temple Run 2: Frozen Shadows)
  private snowParticles: THREE.Points;
  private snowGeometry: THREE.BufferGeometry;
  private snowPositions: Float32Array;
  private readonly SNOW_COUNT: number = 200;

  // Lighting & Environment
  private dirLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;

  // Player Physics & Position
  private position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private currentHeading: CardinalHeading = 'north';
  private targetLane: LaneIndex = 0;
  private currentLaneOffset: number = 0;
  private posY: number = 0;
  private velY: number = 0;
  private isGrounded: boolean = true;
  private isSliding: boolean = false;
  private slideTimer: number = 0;
  private invulnerableTimer: number = 0;
  private runAnimTime: number = 0;
  private speed: number = TRACK_CONFIG.baseSpeed;

  // Camera state
  private cameraYaw: number = 0;
  private targetCameraYaw: number = 0;
  private cameraShake: number = 0;

  // Game Loop
  private isRunning: boolean = false;
  private isIdlePreview: boolean = true;
  private isPaused: boolean = false;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private lastStatsUpdateTime: number = 0;

  // Turn prompt & queued turn buffer
  private queuedTurn: 'left' | 'right' | null = null;
  private turnPrompt: TurnPrompt = {
    active: false,
    direction: 'left',
    distanceToTurn: 999,
    canTurnNow: false
  };

  // Stats & Powerups
  private stats: TempleGameStats = {
    score: 0,
    distance: 0,
    vighnasDestroyed: 0,
    modaksCollected: 0,
    coinsCollected: 0,
    currentCombo: 1,
    maxCombo: 1,
    lives: 3,
    currentWorld: 'temple_street',
    gameTime: 0,
    isGameOver: false,
    isVictory: false,
    isPaused: false,
    currentLane: 0,
    highScore: 0,
    hasUsedRevive: false
  };

  private powerups: TemplePowerUpState = {
    isDivineMode: false,
    divineModeTimer: 0,
    isMushikaRush: false,
    mushikaRushTimer: 0,
    hasMagnet: false,
    magnetTimer: 0,
    hasShield: false,
    hasHammer: false,
    hammerTimer: 0,
    hasGarlandBoost: false,
    garlandBoostTimer: 0
  };

  constructor(container: HTMLElement, callbacks: TempleRunCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Three.js Scene & Camera
    this.scene = new THREE.Scene();
    const initialWorld = TEMPLE_WORLDS['temple_street'];
    this.scene.background = new THREE.Color(initialWorld.skyColor);
    this.scene.fog = new THREE.Fog(initialWorld.fogColor, initialWorld.fogNear, initialWorld.fogFar);

    const width = container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 800);
    const height = container.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 600);
    this.camera = new THREE.PerspectiveCamera(TRACK_CONFIG.cameraFov, width / height, 0.1, 240);
    this.camera.position.set(0, TRACK_CONFIG.cameraHeight, TRACK_CONFIG.cameraDistance);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 3. Lighting
    this.ambientLight = new THREE.AmbientLight(initialWorld.ambientLightColor, initialWorld.ambientLightIntensity);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(initialWorld.dirLightColor, initialWorld.dirLightIntensity);
    this.dirLight.position.set(15, 30, 20);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.scene.add(this.dirLight);

    // 4. Character & Mushika (check for saved custom avatar colors)
    let skinHex: string | undefined;
    let clothesHex: string | undefined;
    const activeAvatar = getActiveGaneshaAvatar();
    if (activeAvatar?.config) {
      skinHex = activeAvatar.config.skinColor;
      clothesHex = activeAvatar.config.clothesColor;
    }

    const ganeshaComponents = createTempleGanesha(skinHex, clothesHex);
    this.ganeshaGroup = ganeshaComponents.root;
    this.bodyGroup = ganeshaComponents.bodyGroup;
    this.leftLeg = ganeshaComponents.leftLeg;
    this.rightLeg = ganeshaComponents.rightLeg;
    this.leftEar = ganeshaComponents.leftEar;
    this.rightEar = ganeshaComponents.rightEar;
    this.trunkGroup = ganeshaComponents.trunk;
    this.auraMesh = ganeshaComponents.aura;
    this.scene.add(this.ganeshaGroup);

    this.mushikaGroup = createTempleMushika();
    this.scene.add(this.mushikaGroup);

    // 4b. Ambient Snowfall Particle System (Temple Run 2: Frozen Shadows)
    this.snowGeometry = new THREE.BufferGeometry();
    this.snowPositions = new Float32Array(this.SNOW_COUNT * 3);
    for (let i = 0; i < this.SNOW_COUNT; i++) {
      this.snowPositions[i * 3] = (Math.random() - 0.5) * 36;
      this.snowPositions[i * 3 + 1] = Math.random() * 14;
      this.snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 36;
    }
    this.snowGeometry.setAttribute('position', new THREE.BufferAttribute(this.snowPositions, 3));
    const snowMaterial = new THREE.PointsMaterial({
      color: 0xF0F9FF,
      size: 0.22,
      transparent: true,
      opacity: 0.8
    });
    this.snowParticles = new THREE.Points(this.snowGeometry, snowMaterial);
    this.scene.add(this.snowParticles);

    // 5. Track Manager
    this.trackManager = new TempleTrackManager(this.scene);
    this.trackManager.init(0);

    // Handle Window Resizing
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
    }

    // Start idle/preview render loop immediately so background is live behind start modal!
    this.lastTime = performance.now();
    this.idleLoop(this.lastTime);
  }

  /**
   * Idle loop running while on Start screen: animates gentle idle breathing and renders scene
   */
  private idleLoop = (now: number) => {
    if (!this.isIdlePreview) return;
    this.animFrameId = requestAnimationFrame(this.idleLoop);

    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // Gentle breathing & ear sway
    const time = now * 0.002;
    this.bodyGroup.position.y = Math.sin(time) * 0.04;
    this.leftEar.rotation.y = 0.25 + Math.sin(time * 1.5) * 0.06;
    this.rightEar.rotation.y = -0.25 - Math.sin(time * 1.5) * 0.06;

    // Ambient snowfall in preview
    this.updateSnowParticles(delta, this.position, CARDINAL_DIRECTIONS[this.currentHeading]);

    this.updateCamera(delta, this.position, CARDINAL_DIRECTIONS[this.currentHeading]);
    this.render();
  };

  public start() {
    this.isIdlePreview = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public pause() {
    this.isPaused = true;
    this.stats.isPaused = true;
    this.callbacks.onStatsUpdate?.(this.stats, this.powerups, this.turnPrompt);
  }

  public resume() {
    this.isPaused = false;
    this.stats.isPaused = false;
    this.lastTime = performance.now();
    this.callbacks.onStatsUpdate?.(this.stats, this.powerups, this.turnPrompt);
  }

  public restart() {
    this.isRunning = false;
    this.isIdlePreview = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

    this.clear();
    this.position.set(0, 0, 0);
    this.currentHeading = 'north';
    this.cameraYaw = 0;
    this.targetCameraYaw = 0;
    this.targetLane = 0;
    this.currentLaneOffset = 0;
    this.posY = 0;
    this.velY = 0;
    this.speed = TRACK_CONFIG.baseSpeed;
    this.invulnerableTimer = 0;
    this.queuedTurn = null;

    this.stats = {
      score: 0,
      distance: 0,
      vighnasDestroyed: 0,
      modaksCollected: 0,
      coinsCollected: 0,
      currentCombo: 1,
      maxCombo: 1,
      lives: 3,
      currentWorld: 'temple_street',
      gameTime: 0,
      isGameOver: false,
      isVictory: false,
      isPaused: false,
      currentLane: 0,
      highScore: this.stats.highScore,
      hasUsedRevive: false
    };

    this.powerups = {
      isDivineMode: false,
      divineModeTimer: 0,
      isMushikaRush: false,
      mushikaRushTimer: 0,
      hasMagnet: false,
      magnetTimer: 0,
      hasShield: false,
      hasHammer: false,
      hammerTimer: 0,
      hasGarlandBoost: false,
      garlandBoostTimer: 0
    };

    this.applyWorldTheme('temple_street');
    this.trackManager.init(0);
    this.start();
  }

  public destroy() {
    this.isRunning = false;
    this.isIdlePreview = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
    }
    this.trackManager.clear();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.snowGeometry.dispose();
    (this.snowParticles.material as THREE.Material).dispose();
    this.renderer.dispose();
  }

  // -------------------------------------------------------------
  // CONTROLS API
  // -------------------------------------------------------------
  public moveLeft() {
    if (!this.isRunning || this.isPaused || this.stats.isGameOver) return;
    
    // Check if we are approaching a left corner turn junction!
    if (this.turnPrompt.active && this.turnPrompt.direction === 'left') {
      if (this.turnPrompt.canTurnNow) {
        this.executeCornerTurn('left');
      } else {
        // Queue turn so it executes automatically as Ganesha reaches the corner!
        this.queuedTurn = 'left';
      }
      return;
    }

    if (this.targetLane > -1) {
      this.targetLane = (this.targetLane - 1) as LaneIndex;
      this.stats.currentLane = this.targetLane;
      audioEngine.playLaneSwitch();
    }
  }

  public moveRight() {
    if (!this.isRunning || this.isPaused || this.stats.isGameOver) return;

    // Check if we are approaching a right corner turn junction!
    if (this.turnPrompt.active && this.turnPrompt.direction === 'right') {
      if (this.turnPrompt.canTurnNow) {
        this.executeCornerTurn('right');
      } else {
        // Queue turn so it executes automatically as Ganesha reaches the corner!
        this.queuedTurn = 'right';
      }
      return;
    }

    if (this.targetLane < 1) {
      this.targetLane = (this.targetLane + 1) as LaneIndex;
      this.stats.currentLane = this.targetLane;
      audioEngine.playLaneSwitch();
    }
  }

  public jump() {
    if (!this.isRunning || this.isPaused || this.stats.isGameOver) return;
    if (this.isGrounded) {
      this.velY = TRACK_CONFIG.jumpVelocity;
      this.isGrounded = false;
      audioEngine.playJump();
    }
  }

  public slide() {
    if (!this.isRunning || this.isPaused || this.stats.isGameOver) return;
    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = TRACK_CONFIG.slideDuration;
      // Fast drop if jumping
      if (!this.isGrounded) {
        this.velY = -14.0;
      }
      audioEngine.playSlide();
    }
  }

  public activatePowerUp() {
    if (!this.powerups.isDivineMode && this.stats.modaksCollected >= 10) {
      this.triggerDivineMode();
    }
  }

  // -------------------------------------------------------------
  // 90-DEGREE CORNER TURN SYSTEM
  // -------------------------------------------------------------
  private executeCornerTurn(direction: 'left' | 'right') {
    const upcomingCorner = this.trackManager.getUpcomingCorner();
    if (!upcomingCorner || !upcomingCorner.turnPivot) return;

    // Success! Snap player onto turn pivot and update heading
    this.position.copy(upcomingCorner.turnPivot);
    this.currentHeading = upcomingCorner.exitHeading;
    this.targetCameraYaw = CARDINAL_YAW[this.currentHeading];

    // Mark this corner as completed so it is never checked again!
    upcomingCorner.turnCompleted = true;

    // Reset lane to center on turn exit
    this.targetLane = 0;
    this.currentLaneOffset = 0;
    this.queuedTurn = null;

    // Trigger audio & turning whoosh chime
    audioEngine.playCornerTurn();
    this.cameraShake = 0.15;

    // Reset prompt
    this.turnPrompt.active = false;
    this.turnPrompt.canTurnNow = false;
  }

  // -------------------------------------------------------------
  // GAME LOOP
  // -------------------------------------------------------------
  private loop = (now: number) => {
    if (!this.isRunning) return;
    this.animFrameId = requestAnimationFrame(this.loop);

    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    try {
      if (!this.isPaused && !this.stats.isGameOver) {
        this.update(delta);
      }
      this.render();
    } catch (err) {
      console.error('TempleRun animation error caught:', err);
    }
  };

  private update(delta: number) {
    // 1. Increase speed gradually
    this.speed = Math.min(
      TRACK_CONFIG.maxSpeed,
      TRACK_CONFIG.baseSpeed + this.stats.gameTime * TRACK_CONFIG.speedIncreaseRate
    );
    this.stats.gameTime += delta;
    this.stats.distance += Math.round(this.speed * delta * 2.5);

    // 2. Forward Movement along current heading
    const forwardDir = CARDINAL_DIRECTIONS[this.currentHeading];
    const moveDist = this.speed * delta;
    this.position.add(forwardDir.clone().multiplyScalar(moveDist));

    // 3. Horizontal Lane Interpolation
    const targetOffset = this.targetLane * TRACK_CONFIG.laneWidth;
    this.currentLaneOffset = THREE.MathUtils.lerp(
      this.currentLaneOffset,
      targetOffset,
      TRACK_CONFIG.laneSwitchSpeed * delta
    );

    // Calculate Right Perpendicular Vector
    const rightVec = new THREE.Vector3(-forwardDir.z, 0, forwardDir.x);
    const charPos = this.position.clone().add(rightVec.clone().multiplyScalar(this.currentLaneOffset));

    // 4. Vertical Jump & Gravity
    if (!this.isGrounded) {
      this.posY += this.velY * delta;
      this.velY -= TRACK_CONFIG.gravity * delta;
      if (this.posY <= 0) {
        this.posY = 0;
        this.velY = 0;
        this.isGrounded = true;
      }
    }
    charPos.y = this.posY;

    // 5. Slide timer
    if (this.isSliding) {
      this.slideTimer -= delta;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // 6. Invulnerability timer
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= delta;
      this.ganeshaGroup.visible = Math.floor(Date.now() / 80) % 2 === 0;
    } else {
      this.ganeshaGroup.visible = true;
    }

    // 7. Update Character Transform & Animations
    this.ganeshaGroup.position.copy(charPos);
    this.ganeshaGroup.rotation.y = CARDINAL_YAW[this.currentHeading];

    // Running limb cycles
    this.runAnimTime += delta * this.speed * 0.9;
    if (this.isGrounded && !this.isSliding) {
      this.leftLeg.rotation.x = Math.sin(this.runAnimTime) * 0.75;
      this.rightLeg.rotation.x = -Math.sin(this.runAnimTime) * 0.75;
      this.bodyGroup.position.y = Math.abs(Math.sin(this.runAnimTime * 2)) * 0.08;
      this.bodyGroup.scale.set(1.0, 1.0, 1.0);
    } else if (this.isSliding) {
      // Crouch / squash body
      this.bodyGroup.position.y = -0.3;
      this.bodyGroup.scale.set(1.2, 0.45, 1.3);
    } else {
      // Airborne Jump
      this.leftLeg.rotation.x = -0.4;
      this.rightLeg.rotation.x = -0.4;
      this.bodyGroup.scale.set(0.95, 1.1, 0.95);
    }

    // Ears flapping gently
    this.leftEar.rotation.y = 0.25 + Math.sin(this.runAnimTime * 1.5) * 0.12;
    this.rightEar.rotation.y = -0.25 - Math.sin(this.runAnimTime * 1.5) * 0.12;

    // 8. Mushika companion running alongside
    const mushikaOffset = rightVec.clone().multiplyScalar((this.targetLane > 0 ? -1 : 1) * 1.1);
    this.mushikaGroup.position.copy(charPos).add(mushikaOffset);
    this.mushikaGroup.position.y = 0;
    this.mushikaGroup.rotation.y = CARDINAL_YAW[this.currentHeading];

    // 9. Check Corner Junction Proximity & Queued Turn Execution
    this.updateCornerCheck();

    // 10. Update Track Segments
    this.trackManager.update(this.position, this.stats.vighnasDestroyed);

    // 11. Collisions & Collectibles
    this.checkCollisions();

    // 12. Power-up Timers
    this.updatePowerups(delta);

    // 13. Ambient Snowfall Drift (Temple Run 2: Frozen Shadows)
    this.updateSnowParticles(delta, charPos, forwardDir);

    // 14. Camera Follow & Slerp
    this.updateCamera(delta, charPos, forwardDir);

    // 15. World Theme Transitions
    const expectedWorld = getWorldForVighnas(this.stats.vighnasDestroyed);
    if (expectedWorld !== this.stats.currentWorld) {
      this.applyWorldTheme(expectedWorld);
    }

    // 16. Check 108 Vighnas Victory
    if (this.stats.vighnasDestroyed >= 108 && !this.stats.isVictory) {
      this.triggerVictory();
    }

    // Notify HUD (Throttled to ~15 Hz or on important gameplay events to eliminate React state flood)
    const nowMs = performance.now();
    if (
      nowMs - this.lastStatsUpdateTime > 65 ||
      this.stats.isGameOver ||
      this.stats.isVictory ||
      this.turnPrompt.canTurnNow
    ) {
      this.lastStatsUpdateTime = nowMs;
      this.callbacks.onStatsUpdate?.(this.stats, this.powerups, this.turnPrompt);
    }
  }

  private updateSnowParticles(delta: number, centerPos: THREE.Vector3, forwardDir: THREE.Vector3) {
    const time = performance.now() * 0.0015;
    for (let i = 0; i < this.SNOW_COUNT; i++) {
      const idx = i * 3;
      // Drift downward
      this.snowPositions[idx + 1] -= delta * 3.6;
      // Gentle wind swirl
      this.snowPositions[idx] += Math.sin(time + i * 0.4) * delta * 1.1;
      this.snowPositions[idx + 2] += Math.cos(time + i * 0.4) * delta * 1.1;

      // Wrap particles around player's position
      const dx = this.snowPositions[idx] - centerPos.x;
      const dz = this.snowPositions[idx + 2] - centerPos.z;
      if (this.snowPositions[idx + 1] <= 0 || (dx * dx + dz * dz) > 800) {
        this.snowPositions[idx] = centerPos.x + (Math.random() - 0.5) * 32 + forwardDir.x * 10;
        this.snowPositions[idx + 1] = 9 + Math.random() * 7;
        this.snowPositions[idx + 2] = centerPos.z + (Math.random() - 0.5) * 32 + forwardDir.z * 10;
      }
    }
    this.snowGeometry.attributes.position.needsUpdate = true;
  }

  private updateCornerCheck() {
    const corner = this.trackManager.getUpcomingCorner();
    if (!corner || !corner.turnPivot || !corner.turnDirection || corner.turnCompleted) {
      this.turnPrompt.active = false;
      this.turnPrompt.canTurnNow = false;
      return;
    }

    const dist = this.position.distanceTo(corner.turnPivot);
    this.turnPrompt.direction = corner.turnDirection;
    this.turnPrompt.distanceToTurn = Math.round(dist);

    // Turn prompt appears early (within 20 meters)
    if (dist <= TRACK_CONFIG.cornerTriggerDistance) {
      this.turnPrompt.active = true;
      this.turnPrompt.canTurnNow = dist <= TRACK_CONFIG.turnTolerance;

      // Auto-execute if player had queued the turn!
      if (this.queuedTurn === corner.turnDirection && dist <= TRACK_CONFIG.turnTolerance) {
        this.executeCornerTurn(corner.turnDirection);
        return;
      }
    } else {
      this.turnPrompt.active = false;
      this.turnPrompt.canTurnNow = false;
    }

    // If player ran past the corner pivot without turning -> Fall / Stumble!
    const forwardDir = CARDINAL_DIRECTIONS[corner.incomingHeading];
    const toPlayer = this.position.clone().sub(corner.turnPivot);
    if (toPlayer.dot(forwardDir) > 2.5) {
      // Mark completed immediately so it only fires once!
      corner.turnCompleted = true;
      this.turnPrompt.active = false;
      this.queuedTurn = null;

      this.handleDamage('Fell off the temple path corner!');
      this.position.copy(corner.turnPivot);
      this.currentHeading = corner.exitHeading;
      this.targetCameraYaw = CARDINAL_YAW[this.currentHeading];
      this.targetLane = 0;
      this.currentLaneOffset = 0;
    }
  }

  private checkCollisions() {
    const charPos = this.ganeshaGroup.position;
    const isSliding = this.isSliding;
    const isJumping = this.posY > 0.55;

    // Collectibles Check
    const collectibles = this.trackManager.getActiveCollectibles();
    collectibles.forEach(col => {
      const dist = charPos.distanceTo(col.position);
      // Magnet attraction
      if (this.powerups.hasMagnet && dist < 6.5 && !col.isCollected) {
        col.position.lerp(charPos, 0.22);
        if (col.mesh.parent) {
          col.mesh.position.copy(col.mesh.parent.worldToLocal(col.position.clone()));
        }
      }

      if (dist < 1.4) {
        col.isCollected = true;
        col.mesh.visible = false;
        this.collectItem(col.type);
      }
    });

    // Obstacles Check
    if (this.invulnerableTimer > 0) return;

    const obstacles = this.trackManager.getActiveObstacles();
    obstacles.forEach(obs => {
      const dist = charPos.distanceTo(obs.position);
      if (dist < 1.3) {
        if (obs.type === 'temple_barrier' && isJumping) {
          // Cleared barrier cleanly by jumping!
          return;
        }
        if (obs.type === 'hanging_bell' && (isSliding || this.posY < 0.8)) {
          // Cleared bell cleanly by sliding!
          return;
        }

        // Destructible Vighna! Smashed by Lord Ganesha!
        if (obs.isDestructible) {
          obs.isHit = true;
          obs.mesh.visible = false;
          this.destroyVighna();
          return;
        }

        // Solid obstacle collision
        obs.isHit = true;
        this.handleDamage(`Collided with ${obs.type.replace('_', ' ')}`);
      }
    });
  }

  private collectItem(type: TempleCollectibleType) {
    switch (type) {
      case 'modak':
        this.stats.score += 100 * this.stats.currentCombo;
        this.stats.modaksCollected++;
        audioEngine.playModakCollect(false);
        break;
      case 'golden_modak':
        this.stats.score += 500 * this.stats.currentCombo;
        this.stats.modaksCollected++;
        audioEngine.playModakCollect(true);
        this.triggerDivineMode();
        break;
      case 'festival_coin':
        this.stats.score += 50 * this.stats.currentCombo;
        this.stats.coinsCollected++;
        audioEngine.playCoinCollect();
        break;
      case 'lotus':
        this.stats.score += 150 * this.stats.currentCombo;
        this.stats.currentCombo = Math.min(10, this.stats.currentCombo + 1);
        this.stats.maxCombo = Math.max(this.stats.maxCombo, this.stats.currentCombo);
        audioEngine.playLotusCollect();
        break;
      case 'flower_garland':
        this.stats.score += 200 * this.stats.currentCombo;
        this.powerups.hasGarlandBoost = true;
        this.powerups.garlandBoostTimer = 8.0;
        audioEngine.playSfx(659.25, 'triangle', 0.2);
        break;
    }
  }

  private destroyVighna() {
    this.stats.vighnasDestroyed++;
    const bonus = 100 * this.stats.currentCombo;
    this.stats.score += bonus;
    audioEngine.playVighnaDestroy();
    this.cameraShake = 0.35;
  }

  private handleDamage(reason: string) {
    if (this.powerups.hasShield) {
      this.powerups.hasShield = false;
      this.invulnerableTimer = 1.0;
      audioEngine.playHoverboardCrash();
      return;
    }

    this.stats.lives--;
    audioEngine.playHit();
    this.cameraShake = 0.45;
    this.invulnerableTimer = 1.5;

    if (this.stats.lives <= 0) {
      if (!this.stats.hasUsedRevive) {
        this.promptRevive();
      } else {
        this.gameOver();
      }
    }
  }

  private promptRevive() {
    this.pause();
    this.callbacks.onRevivePrompt?.(this.stats, (revive: boolean) => {
      if (revive) {
        this.stats.hasUsedRevive = true;
        this.stats.lives = 2; // Restored to 2 hearts by Mushika
        this.invulnerableTimer = 2.5;
        this.resume();
        audioEngine.playSaveMeRevive();
      } else {
        this.gameOver();
      }
    });
  }

  private gameOver() {
    this.isRunning = false;
    this.stats.isGameOver = true;
    this.stats.highScore = Math.max(this.stats.highScore, this.stats.score);
    this.callbacks.onGameOver?.(this.stats);
  }

  private triggerVictory() {
    this.isRunning = false;
    this.stats.isVictory = true;
    this.stats.isGameOver = true;
    audioEngine.playVictoryFanfare();
    this.callbacks.onVictory?.(this.stats);
  }

  private triggerDivineMode() {
    this.powerups.isDivineMode = true;
    this.powerups.divineModeTimer = 10.0;
    this.auraMesh.visible = true;
    audioEngine.playDivineMode();
  }

  private updatePowerups(delta: number) {
    if (this.powerups.isDivineMode) {
      this.powerups.divineModeTimer -= delta;
      if (this.powerups.divineModeTimer <= 0) {
        this.powerups.isDivineMode = false;
        this.auraMesh.visible = false;
      }
    }

    if (this.powerups.isMushikaRush) {
      this.powerups.mushikaRushTimer -= delta;
      if (this.powerups.mushikaRushTimer <= 0) {
        this.powerups.isMushikaRush = false;
      }
    }

    if (this.powerups.hasMagnet) {
      this.powerups.magnetTimer -= delta;
      if (this.powerups.magnetTimer <= 0) {
        this.powerups.hasMagnet = false;
      }
    }

    if (this.powerups.hasGarlandBoost) {
      this.powerups.garlandBoostTimer -= delta;
      if (this.powerups.garlandBoostTimer <= 0) {
        this.powerups.hasGarlandBoost = false;
      }
    }
  }

  private updateCamera(delta: number, charPos: THREE.Vector3, forwardDir: THREE.Vector3) {
    // Slerp camera yaw towards target heading using shortest angle difference
    const angleDiff = shortestAngleDiff(this.cameraYaw, this.targetCameraYaw);
    this.cameraYaw += angleDiff * Math.min(1.0, TRACK_CONFIG.cameraTurnSlerpSpeed * delta);

    // Calculate camera distance & height
    const camDist = TRACK_CONFIG.cameraDistance * (this.powerups.isDivineMode ? 1.25 : 1.0);
    const camHeight = TRACK_CONFIG.cameraHeight + (this.posY * TRACK_CONFIG.cameraJumpFollowFactor);

    // Camera position rotated by cameraYaw
    const camX = charPos.x + Math.sin(this.cameraYaw) * camDist;
    const camZ = charPos.z + Math.cos(this.cameraYaw) * camDist;
    const camY = charPos.y + camHeight;

    // Camera shake
    let shakeX = 0;
    let shakeY = 0;
    let shakeZ = 0;
    if (this.cameraShake > 0) {
      shakeX = (Math.random() - 0.5) * this.cameraShake;
      shakeY = (Math.random() - 0.5) * this.cameraShake;
      shakeZ = (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake = Math.max(0, this.cameraShake - delta * 2.5);
    }

    this.camera.position.set(camX + shakeX, camY + shakeY, camZ + shakeZ);

    // Look ahead of Ganesha along camera direction
    const lookAheadX = charPos.x - Math.sin(this.cameraYaw) * TRACK_CONFIG.cameraLookAhead;
    const lookAheadZ = charPos.z - Math.cos(this.cameraYaw) * TRACK_CONFIG.cameraLookAhead;
    this.camera.lookAt(lookAheadX, charPos.y + 1.3, lookAheadZ);
  }

  private applyWorldTheme(worldId: TempleWorldId) {
    this.stats.currentWorld = worldId;
    const info = TEMPLE_WORLDS[worldId];
    this.scene.background = new THREE.Color(info.skyColor);
    if (this.scene.fog instanceof THREE.Fog) {
      this.scene.fog.color.setHex(info.fogColor);
      this.scene.fog.near = info.fogNear;
      this.scene.fog.far = info.fogFar;
    }
    this.ambientLight.color.setHex(info.ambientLightColor);
    this.ambientLight.intensity = info.ambientLightIntensity;
    this.dirLight.color.setHex(info.dirLightColor);
    this.dirLight.intensity = info.dirLightIntensity;

    audioEngine.playWorldTransition();
    this.callbacks.onWorldChange?.(worldId);
  }

  private clear() {
    this.trackManager.clear();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private handleResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 800);
    const height = this.container.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 600);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
}
