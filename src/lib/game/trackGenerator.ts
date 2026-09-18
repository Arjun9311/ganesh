import * as THREE from 'three';
import { WorldTheme, ObstacleType, CollectibleType } from '@/types/game';
import { createObstacleMesh, createCollectibleMesh } from './models';
import { WORLD_THEMES } from './themeConfig';
import {
  createRoadTexture,
  createWoodTexture,
  createSandstoneTexture,
  createTreeBarkTexture,
  createFoliageTexture
} from './textureGenerator';

export const LANE_WIDTH = 2.4;
export const LANE_POSITIONS = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, Center, Right
export const CHUNK_LENGTH = 36;
export const ACTIVE_CHUNKS_COUNT = 6;

export interface TrackObstacle {
  id: string;
  type: ObstacleType;
  lane: number;
  mesh: THREE.Group;
  position: THREE.Vector3;
  boundingBox: THREE.Box3;
  destroyed: boolean;
  requiresJump?: boolean;
  requiresSlide?: boolean;
  isRamp?: boolean;
  rampLength?: number;
  roofHeight?: number;
  isRooftopWagon?: boolean;
  wagonLength?: number;
  isMoving?: boolean;
  moveSpeed?: number;
}

export interface TrackCollectible {
  id: string;
  type: CollectibleType;
  lane: number;
  mesh: THREE.Group;
  position: THREE.Vector3;
  collected: boolean;
}

export interface TrackChunk {
  group: THREE.Group;
  startZ: number;
  endZ: number;
  obstacles: TrackObstacle[];
  collectibles: TrackCollectible[];
  world: WorldTheme;
}

export class TrackManager {
  private scene: THREE.Scene;
  private chunks: TrackChunk[] = [];
  private nextChunkZ: number = 0;
  private chunkIndex: number = 0;
  private currentWorld: WorldTheme = 'festival_street';
  private manualWorld: WorldTheme | null = null;

  // Realistic PBR Materials for Tracks, Road, and Scenery
  private roadMaterials: Record<WorldTheme, THREE.Material> = {
    festival_street: new THREE.MeshStandardMaterial({
      map: createRoadTexture('#E5E7EB', false),
      roughness: 0.42,
      metalness: 0.05
    }),
    temple_street: new THREE.MeshStandardMaterial({
      map: createRoadTexture('#F5E8D3', false),
      roughness: 0.48,
      metalness: 0.05
    }),
    monsoon_festival: new THREE.MeshStandardMaterial({
      map: createRoadTexture('#94A3B8', true),
      roughness: 0.15,
      metalness: 0.35
    }),
    visarjan_path: new THREE.MeshStandardMaterial({
      map: createRoadTexture('#FEF3C7', false),
      roughness: 0.45,
      metalness: 0.06
    }),
    chaos_festival: new THREE.MeshStandardMaterial({
      map: createRoadTexture('#F1F5F9', false),
      roughness: 0.38,
      metalness: 0.1
    }),
    final_challenge: new THREE.MeshStandardMaterial({
      map: createRoadTexture('#F8FAFC', false),
      roughness: 0.18,
      metalness: 0.25
    }),
    divine_realm: new THREE.MeshStandardMaterial({
      map: createRoadTexture('#FDE047', false),
      roughness: 0.12,
      metalness: 0.75
    })
  };

  private curbMaterials: Record<WorldTheme, THREE.Material> = {
    festival_street: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(false), roughness: 0.5, metalness: 0.05 }),
    temple_street: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(false), roughness: 0.55, metalness: 0.05 }),
    monsoon_festival: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(true), roughness: 0.25, metalness: 0.2 }),
    visarjan_path: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(false), roughness: 0.5, metalness: 0.05 }),
    chaos_festival: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(false), roughness: 0.45, metalness: 0.08 }),
    final_challenge: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(true), roughness: 0.2, metalness: 0.15 }),
    divine_realm: new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1, metalness: 0.8 })
  };

  private pillarMaterials: Record<WorldTheme, THREE.Material> = {
    festival_street: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(false), roughness: 0.5, metalness: 0.05 }),
    temple_street: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(false), roughness: 0.55, metalness: 0.05 }),
    monsoon_festival: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(true), roughness: 0.3, metalness: 0.1 }),
    visarjan_path: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(false), roughness: 0.5, metalness: 0.05 }),
    chaos_festival: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(false), roughness: 0.45, metalness: 0.05 }),
    final_challenge: new THREE.MeshStandardMaterial({ map: createSandstoneTexture(true), roughness: 0.2, metalness: 0.1 }),
    divine_realm: new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.15, metalness: 0.9 })
  };

  private toranMaterials: Record<WorldTheme, THREE.Material> = {
    festival_street: new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.45 }),
    temple_street: new THREE.MeshStandardMaterial({ color: 0xB91C1C, roughness: 0.45 }),
    monsoon_festival: new THREE.MeshStandardMaterial({ color: 0x2563EB, roughness: 0.45 }),
    visarjan_path: new THREE.MeshStandardMaterial({ color: 0xE11D48, roughness: 0.45 }),
    chaos_festival: new THREE.MeshStandardMaterial({ color: 0xA855F7, roughness: 0.45 }),
    final_challenge: new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.45 }),
    divine_realm: new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.3 })
  };

  // High-Sheen Gleaming Steel Rails
  private steelRailMaterial = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0,
    metalness: 0.96,
    roughness: 0.16
  });

  // Wood Grain Railroad Sleepers
  private sleeperMaterial = new THREE.MeshStandardMaterial({
    map: createWoodTexture(125, 75, 20),
    roughness: 0.72,
    metalness: 0.05
  });

  // Forged Iron Rail Tie Plates
  private tiePlateMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.88,
    roughness: 0.32
  });

  // Sidewalk & Scenery Materials
  private sidewalkMaterial = new THREE.MeshStandardMaterial({
    map: createRoadTexture('#CBD5E1', false),
    roughness: 0.55,
    metalness: 0.05
  });

  private treeBarkMaterial = new THREE.MeshStandardMaterial({
    map: createTreeBarkTexture(),
    roughness: 0.8,
    metalness: 0.05
  });

  private foliageMaterial = new THREE.MeshStandardMaterial({
    map: createFoliageTexture(),
    roughness: 0.58,
    metalness: 0.04
  });

  private buildingMaterial = new THREE.MeshStandardMaterial({
    map: createSandstoneTexture(false),
    roughness: 0.65,
    metalness: 0.05
  });

  private windowLitMaterial = new THREE.MeshStandardMaterial({
    color: 0xFEF08A,
    emissive: 0xF59E0B,
    emissiveIntensity: 0.85,
    roughness: 0.15
  });

  private lampPostMaterial = new THREE.MeshStandardMaterial({
    color: 0xD97706,
    metalness: 0.92,
    roughness: 0.2
  });

  private lampGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFBEB
  });

  private laneDividerMaterial = new THREE.MeshBasicMaterial({
    color: 0xF59E0B
  });

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.reset();
  }

  public reset() {
    for (const chunk of this.chunks) {
      this.scene.remove(chunk.group);
    }
    this.chunks = [];
    this.nextChunkZ = 10;
    this.chunkIndex = 0;
    this.currentWorld = 'festival_street';
    this.manualWorld = null;

    for (let i = 0; i < ACTIVE_CHUNKS_COUNT; i++) {
      this.spawnChunk(i === 0);
    }
  }

  public applyThemeToActiveChunks(theme: WorldTheme) {
    this.currentWorld = theme;
    for (const chunk of this.chunks) {
      chunk.world = theme;
      chunk.group.traverse(child => {
        if (child instanceof THREE.Mesh) {
          if (child.name === 'roadMesh') child.material = this.roadMaterials[theme];
          else if (child.name === 'curbMesh') child.material = this.curbMaterials[theme];
          else if (child.name === 'toranMesh') child.material = this.toranMaterials[theme];
          else if (child.name === 'pillarMesh') child.material = this.pillarMaterials[theme];
        }
      });
    }
  }

  public setWorld(world: WorldTheme) {
    this.manualWorld = world;
    this.applyThemeToActiveChunks(world);
  }

  public update(playerZ: number, distance: number, currentVighnas: number): { removedObstacles: TrackObstacle[]; newWorld?: WorldTheme } {
    let targetWorld: WorldTheme = this.currentWorld;

    if (this.manualWorld) {
      targetWorld = this.manualWorld;
    } else {
      if (currentVighnas >= 108 || distance >= 1500) targetWorld = 'divine_realm';
      else if (currentVighnas >= 90 || distance >= 1250) targetWorld = 'final_challenge';
      else if (currentVighnas >= 75 || distance >= 1000) targetWorld = 'chaos_festival';
      else if (currentVighnas >= 55 || distance >= 750) targetWorld = 'visarjan_path';
      else if (currentVighnas >= 35 || distance >= 500) targetWorld = 'monsoon_festival';
      else if (currentVighnas >= 15 || distance >= 250) targetWorld = 'temple_street';
      else targetWorld = 'festival_street';
    }

    let changedWorld: WorldTheme | undefined = undefined;
    if (targetWorld !== this.currentWorld) {
      this.applyThemeToActiveChunks(targetWorld);
      changedWorld = targetWorld;
    }

    // Check if furthest chunk is passed by player and recycle
    if (this.chunks.length > 0 && playerZ < this.chunks[0].endZ - 10) {
      const oldChunk = this.chunks.shift()!;
      this.scene.remove(oldChunk.group);
      this.spawnChunk(false, currentVighnas);
    }

    return { removedObstacles: [], newWorld: changedWorld };
  }

  private spawnChunk(isStartingChunk: boolean = false, currentVighnas: number = 0) {
    const chunkGroup = new THREE.Group();
    const startZ = this.nextChunkZ;
    const endZ = startZ - CHUNK_LENGTH;
    this.nextChunkZ = endZ;

    const obstacles: TrackObstacle[] = [];
    const collectibles: TrackCollectible[] = [];

    // 1. Road Mesh (3 Railway Lanes)
    const roadWidth = LANE_WIDTH * 3.4;
    const roadGeo = new THREE.PlaneGeometry(roadWidth, CHUNK_LENGTH);
    roadGeo.rotateX(-Math.PI / 2);

    const roadMesh = new THREE.Mesh(roadGeo, this.roadMaterials[this.currentWorld]);
    roadMesh.name = 'roadMesh';
    roadMesh.position.set(0, 0, (startZ + endZ) / 2);
    roadMesh.receiveShadow = true;
    chunkGroup.add(roadMesh);

    // 2. Flanking Stone Sidewalks (Left and Right)
    const sidewalkWidth = 4.0;
    [-roadWidth / 2 - sidewalkWidth / 2, roadWidth / 2 + sidewalkWidth / 2].forEach(sx => {
      const swGeo = new THREE.PlaneGeometry(sidewalkWidth, CHUNK_LENGTH);
      swGeo.rotateX(-Math.PI / 2);
      const sidewalk = new THREE.Mesh(swGeo, this.sidewalkMaterial);
      sidewalk.position.set(sx, 0.08, (startZ + endZ) / 2);
      sidewalk.receiveShadow = true;
      chunkGroup.add(sidewalk);
    });

    // 3. Railway Tracks & Sleepers with Iron Tie Plates
    const laneCenters = [-LANE_WIDTH, 0, LANE_WIDTH];
    const railGauge = 0.9;
    const railGeo = new THREE.BoxGeometry(0.06, 0.06, CHUNK_LENGTH);

    // Wooden sleepers along the chunk with iron tie plates
    const sleeperGeo = new THREE.BoxGeometry(1.24, 0.04, 0.24);
    const tiePlateGeo = new THREE.BoxGeometry(0.14, 0.045, 0.18);
    const numSleepers = Math.floor(CHUNK_LENGTH / 1.8);

    for (let s = 0; s < numSleepers; s++) {
      const sz = startZ - s * 1.8 - 0.9;
      laneCenters.forEach(lx => {
        const sleeper = new THREE.Mesh(sleeperGeo, this.sleeperMaterial);
        sleeper.position.set(lx, 0.02, sz);
        sleeper.receiveShadow = true;
        sleeper.castShadow = true;
        chunkGroup.add(sleeper);

        // Iron tie plates clamping the rails to the sleeper
        [-railGauge / 2, railGauge / 2].forEach(rx => {
          const plate = new THREE.Mesh(tiePlateGeo, this.tiePlateMaterial);
          plate.position.set(lx + rx, 0.025, sz);
          chunkGroup.add(plate);
        });
      });
    }

    // Steel gleaming rails for each lane
    laneCenters.forEach(lx => {
      const railL = new THREE.Mesh(railGeo, this.steelRailMaterial);
      railL.position.set(lx - railGauge / 2, 0.05, (startZ + endZ) / 2);
      railL.castShadow = true;
      railL.receiveShadow = true;

      const railR = new THREE.Mesh(railGeo, this.steelRailMaterial);
      railR.position.set(lx + railGauge / 2, 0.05, (startZ + endZ) / 2);
      railR.castShadow = true;
      railR.receiveShadow = true;

      chunkGroup.add(railL, railR);
    });

    // Decorative Raised Curbs with Sandstone Texture
    [-roadWidth / 2, roadWidth / 2].forEach(x => {
      const curbGeo = new THREE.BoxGeometry(0.3, 0.28, CHUNK_LENGTH);
      const curb = new THREE.Mesh(curbGeo, this.curbMaterials[this.currentWorld]);
      curb.name = 'curbMesh';
      curb.position.set(x, 0.14, (startZ + endZ) / 2);
      curb.castShadow = true;
      curb.receiveShadow = true;
      chunkGroup.add(curb);
    });

    // 4. Rich Roadside Environment Architecture & Scenery
    // A) Flanking Temple / Haveli Architectural Facades
    const buildingPositions = [
      { x: -roadWidth / 2 - 3.8, z: startZ - 10, h: 9.0, w: 3.5, d: 14.0 },
      { x: roadWidth / 2 + 3.8, z: startZ - 26, h: 10.5, w: 3.5, d: 14.0 }
    ];

    buildingPositions.forEach(b => {
      const bldgGroup = new THREE.Group();
      // Main sandstone facade
      const facade = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), this.buildingMaterial);
      facade.position.set(b.x, b.h / 2, b.z);
      facade.castShadow = true;
      facade.receiveShadow = true;
      bldgGroup.add(facade);

      // Chhatri / Shikhara domed rooftop pavilion
      const roofGeo = new THREE.ConeGeometry(1.6, 2.4, 8);
      const roofMesh = new THREE.Mesh(roofGeo, this.buildingMaterial);
      roofMesh.position.set(b.x, b.h + 1.2, b.z);
      roofMesh.castShadow = true;
      bldgGroup.add(roofMesh);

      // Warm glowing arched windows
      const winGeo = new THREE.BoxGeometry(0.1, 1.2, 0.9);
      for (let floor = 1; floor <= 2; floor++) {
        for (let col = -1; col <= 1; col++) {
          const win = new THREE.Mesh(winGeo, this.windowLitMaterial);
          const wx = b.x > 0 ? b.x - b.w / 2 - 0.05 : b.x + b.w / 2 + 0.05;
          win.position.set(wx, floor * 3.2, b.z + col * 3.5);
          bldgGroup.add(win);
        }
      }
      chunkGroup.add(bldgGroup);
    });

    // B) Realistic Roadside Banyan / Neem Trees with Foliage Canopies
    const treePositions = [
      { x: roadWidth / 2 + 2.5, z: startZ - 8 },
      { x: -roadWidth / 2 - 2.5, z: startZ - 26 }
    ];

    treePositions.forEach(tp => {
      const treeGroup = new THREE.Group();
      // Textured organic trunk
      const trunkGeo = new THREE.CylinderGeometry(0.3, 0.45, 4.5, 12);
      const trunk = new THREE.Mesh(trunkGeo, this.treeBarkMaterial);
      trunk.position.set(tp.x, 2.25, tp.z);
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);

      // Layered organic foliage canopy
      const canopy1 = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 10), this.foliageMaterial);
      canopy1.position.set(tp.x, 4.8, tp.z);
      canopy1.castShadow = true;

      const canopy2 = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 10), this.foliageMaterial);
      canopy2.position.set(tp.x + 0.5, 5.4, tp.z - 0.4);
      canopy2.castShadow = true;

      treeGroup.add(canopy1, canopy2);
      chunkGroup.add(treeGroup);
    });

    // C) Ornamental Brass Streetlamps with Glowing Glass Lanterns
    const lampPositions = [
      { x: -roadWidth / 2 - 0.35, z: startZ - 18 },
      { x: roadWidth / 2 + 0.35, z: startZ - 18 }
    ];

    lampPositions.forEach(lp => {
      const postGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.6, 12);
      const post = new THREE.Mesh(postGeo, this.lampPostMaterial);
      post.position.set(lp.x, 1.8, lp.z);
      post.castShadow = true;

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.5), this.lampPostMaterial);
      arm.position.set(lp.x, 3.5, lp.z + (lp.x > 0 ? -0.25 : 0.25));

      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.32, 8), this.lampPostMaterial);
      lantern.position.set(lp.x, 3.3, lp.z);

      const glass = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), this.lampGlowMaterial);
      glass.position.set(lp.x, 3.3, lp.z);

      chunkGroup.add(post, arm, lantern, glass);
    });

    // D) Suspended Toran Archway (Archway across the street)
    const archZ = startZ - 18;
    [-roadWidth / 2 - 0.4, roadWidth / 2 + 0.4].forEach(x => {
      const pillarGeo = new THREE.CylinderGeometry(0.25, 0.35, 4.4, 14);
      const pillar = new THREE.Mesh(pillarGeo, this.pillarMaterials[this.currentWorld]);
      pillar.name = 'pillarMesh';
      pillar.position.set(x, 2.2, archZ);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      chunkGroup.add(pillar);
    });

    const bannerGeo = new THREE.BoxGeometry(roadWidth + 0.8, 0.5, 0.1);
    const banner = new THREE.Mesh(bannerGeo, this.toranMaterials[this.currentWorld]);
    banner.name = 'toranMesh';
    banner.position.set(0, 4.2, archZ);
    banner.castShadow = true;
    chunkGroup.add(banner);

    // 5. Spawning Authentic Obstacles & Collectibles
    if (!isStartingChunk) {
      if (currentVighnas >= 107 && !this.chunks.some(c => c.obstacles.some(o => o.type === 'final_vighna'))) {
        const bossZ = startZ - 20;
        const bossMesh = createObstacleMesh('final_vighna');
        bossMesh.position.set(0, 0, bossZ);
        chunkGroup.add(bossMesh);

        obstacles.push({
          id: `boss-108`,
          type: 'final_vighna',
          lane: 0,
          mesh: bossMesh,
          position: new THREE.Vector3(0, 0, bossZ),
          boundingBox: new THREE.Box3().setFromObject(bossMesh),
          destroyed: false
        });
      } else {
        const patternIndex = Math.floor(Math.random() * 7);
        const z1 = startZ - 10;
        const z2 = startZ - 24;

        if (patternIndex === 0) {
          this.addObstacle(chunkGroup, obstacles, 'hurdle_low', 0, z1, { requiresJump: true });
          this.addCoinArc(chunkGroup, collectibles, 0, z1);
          this.addCollectibleTrail(chunkGroup, collectibles, 'modak', -1, z1, 3);
          this.addObstacle(chunkGroup, obstacles, 'hurdle_low', 1, z2, { requiresJump: true });
        } else if (patternIndex === 1) {
          this.addObstacle(chunkGroup, obstacles, 'barrier_high', 0, z1, { requiresSlide: true });
          this.addSingleCollectible(chunkGroup, collectibles, 'modak', 0, z1 + 2, 0.4);
          this.addSingleCollectible(chunkGroup, collectibles, 'modak', 0, z1, 0.4);
          this.addSingleCollectible(chunkGroup, collectibles, 'modak', 0, z1 - 2, 0.4);
          this.addObstacle(chunkGroup, obstacles, 'hurdle_low', -1, z1, { requiresJump: true });
          const power = this.getRandomPowerUp();
          this.addSingleCollectible(chunkGroup, collectibles, power, 1, z1, 1.2);
        } else if (patternIndex === 2) {
          const rampLane = (Math.random() < 0.5 ? 0 : -1);
          const rampZ = z1;
          const wagonZ = rampZ - 6.0;

          this.addObstacle(chunkGroup, obstacles, 'rath_ramp', rampLane, rampZ, {
            isRamp: true,
            rampLength: 4.8,
            roofHeight: 2.2
          });

          this.addObstacle(chunkGroup, obstacles, 'rath_wagon', rampLane, wagonZ, {
            isRooftopWagon: true,
            wagonLength: 7.0,
            roofHeight: 2.2
          });

          this.addSingleCollectible(chunkGroup, collectibles, 'modak', rampLane, rampZ + 1.5, 0.8);
          this.addSingleCollectible(chunkGroup, collectibles, 'modak', rampLane, rampZ, 1.6);
          this.addSingleCollectible(chunkGroup, collectibles, 'modak', rampLane, wagonZ + 2.0, 2.7);
          this.addSingleCollectible(chunkGroup, collectibles, 'modak', rampLane, wagonZ, 2.7);
          this.addSingleCollectible(chunkGroup, collectibles, 'modak', rampLane, wagonZ - 2.0, 2.7);

          const roofPower = this.getRandomPowerUp();
          this.addSingleCollectible(chunkGroup, collectibles, roofPower, rampLane, wagonZ - 1.0, 3.0);

          const otherLane = rampLane === 0 ? 1 : 0;
          this.addObstacle(chunkGroup, obstacles, 'rath_wagon', otherLane, z1 - 4, {
            isRooftopWagon: true,
            wagonLength: 7.0,
            roofHeight: 2.2
          });
        } else if (patternIndex === 3) {
          const moveLane = (Math.floor(Math.random() * 3) - 1);
          this.addObstacle(chunkGroup, obstacles, 'moving_cart', moveLane, z1, {
            isMoving: true,
            moveSpeed: 7.0
          });

          [-1, 0, 1].forEach(l => {
            if (l !== moveLane) {
              if (Math.random() < 0.5) {
                this.addObstacle(chunkGroup, obstacles, 'hurdle_low', l, z2, { requiresJump: true });
              } else {
                this.addCollectibleTrail(chunkGroup, collectibles, 'modak', l, z1, 3);
              }
            }
          });
        } else if (patternIndex === 4) {
          this.addObstacle(chunkGroup, obstacles, 'hurdle_low', -1, z1, { requiresJump: true });
          this.addObstacle(chunkGroup, obstacles, 'barrier_high', 0, z1, { requiresSlide: true });
          this.addCollectibleTrail(chunkGroup, collectibles, 'modak', 1, z1, 4);
          this.addObstacle(chunkGroup, obstacles, 'hurdle_low', 1, z2, { requiresJump: true });
        } else if (patternIndex === 5) {
          const openLane = (Math.floor(Math.random() * 3) - 1);
          [-1, 0, 1].forEach(l => {
            if (l !== openLane) {
              this.addObstacle(chunkGroup, obstacles, 'rath_wagon', l, z1 - 3, {
                isRooftopWagon: true,
                wagonLength: 7.0,
                roofHeight: 2.2
              });
            } else {
              this.addCollectibleTrail(chunkGroup, collectibles, 'modak', l, z1, 4);
              this.addSingleCollectible(chunkGroup, collectibles, this.getRandomPowerUp(), l, z2, 1.2);
            }
          });
        } else {
          this.addObstacle(chunkGroup, obstacles, 'barrier_high', -1, z1, { requiresSlide: true });
          this.addObstacle(chunkGroup, obstacles, 'hurdle_low', 0, z1, { requiresJump: true });
          this.addObstacle(chunkGroup, obstacles, 'barrier_high', 1, z1, { requiresSlide: true });

          this.addCoinArc(chunkGroup, collectibles, 0, z1);
          this.addCollectibleTrail(chunkGroup, collectibles, 'lotus', -1, z2, 2);
          this.addCollectibleTrail(chunkGroup, collectibles, 'lotus', 1, z2, 2);
        }

        // Sky Modak Pathway for Garuda Jetpack Mode (y = 8.0m)
        [-1, 0, 1].forEach(skyLane => {
          this.addSingleCollectible(chunkGroup, collectibles, 'modak', skyLane, z1 + 4, 8.0);
          this.addSingleCollectible(chunkGroup, collectibles, 'modak', skyLane, z1 - 6, 8.0);
        });
      }
    }

    this.scene.add(chunkGroup);
    this.chunks.push({
      group: chunkGroup,
      startZ,
      endZ,
      obstacles,
      collectibles,
      world: this.currentWorld
    });

    this.chunkIndex++;
  }

  private getRandomPowerUp(): CollectibleType {
    const roll = Math.random();
    if (roll < 0.25) return 'hoverboard';
    if (roll < 0.45) return 'jetpack';
    if (roll < 0.65) return 'super_sneakers';
    if (roll < 0.85) return 'multiplier_2x';
    return 'golden_modak';
  }

  private addCoinArc(group: THREE.Group, list: TrackCollectible[], lane: number, zCenter: number) {
    const points = [
      { z: zCenter + 3.0, y: 0.8 },
      { z: zCenter + 1.5, y: 1.8 },
      { z: zCenter,       y: 2.4 },
      { z: zCenter - 1.5, y: 1.8 },
      { z: zCenter - 3.0, y: 0.8 }
    ];
    points.forEach(pt => {
      this.addSingleCollectible(group, list, 'modak', lane, pt.z, pt.y);
    });
  }

  private addObstacle(
    group: THREE.Group,
    list: TrackObstacle[],
    type: ObstacleType,
    lane: number,
    z: number,
    options: Partial<TrackObstacle> = {}
  ) {
    const mesh = createObstacleMesh(type);
    const x = LANE_POSITIONS[lane + 1];
    mesh.position.set(x, 0, z);
    group.add(mesh);

    list.push({
      id: `obs-${this.chunkIndex}-${list.length}`,
      type,
      lane,
      mesh,
      position: new THREE.Vector3(x, 0, z),
      boundingBox: new THREE.Box3().setFromObject(mesh),
      destroyed: false,
      requiresJump: options.requiresJump ?? false,
      requiresSlide: options.requiresSlide ?? false,
      isRamp: options.isRamp ?? false,
      rampLength: options.rampLength ?? 4.8,
      roofHeight: options.roofHeight ?? 2.2,
      isRooftopWagon: options.isRooftopWagon ?? false,
      wagonLength: options.wagonLength ?? 7.0,
      isMoving: options.isMoving ?? false,
      moveSpeed: options.moveSpeed ?? 0
    });
  }

  private addSingleCollectible(group: THREE.Group, list: TrackCollectible[], type: CollectibleType, lane: number, z: number, y: number = 0.8) {
    const mesh = createCollectibleMesh(type);
    const x = LANE_POSITIONS[lane + 1];
    mesh.position.set(x, y, z);
    group.add(mesh);

    list.push({
      id: `col-${this.chunkIndex}-${list.length}`,
      type,
      lane,
      mesh,
      position: new THREE.Vector3(x, y, z),
      collected: false
    });
  }

  private addCollectibleTrail(group: THREE.Group, list: TrackCollectible[], type: CollectibleType, lane: number, startZ: number, count: number) {
    for (let i = 0; i < count; i++) {
      this.addSingleCollectible(group, list, type, lane, startZ - i * 2.8, 0.8);
    }
  }

  public getActiveObstacles(): TrackObstacle[] {
    const all: TrackObstacle[] = [];
    for (const chunk of this.chunks) {
      for (const obs of chunk.obstacles) {
        if (!obs.destroyed) all.push(obs);
      }
    }
    return all;
  }

  public getActiveCollectibles(): TrackCollectible[] {
    const all: TrackCollectible[] = [];
    for (const chunk of this.chunks) {
      for (const col of chunk.collectibles) {
        if (!col.collected) all.push(col);
      }
    }
    return all;
  }
}
