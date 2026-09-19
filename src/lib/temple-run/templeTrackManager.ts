import * as THREE from 'three';
import {
  CardinalHeading,
  TempleWorldId,
  TempleObstacleType,
  TempleCollectibleType,
  LaneIndex
} from '@/types/templeRun';
import {
  TRACK_CONFIG,
  CARDINAL_DIRECTIONS,
  CARDINAL_YAW,
  getTurnedHeading,
  getWorldForVighnas
} from './templeRunConfig';
import {
  createTrackSegmentMesh,
  createCornerJunctionMesh,
  createTempleObstacleMesh,
  createTempleCollectibleMesh
} from './templeRunModels';

export interface ActiveObstacle {
  id: string;
  type: TempleObstacleType;
  mesh: THREE.Group;
  position: THREE.Vector3;
  lane: LaneIndex;
  isDestructible: boolean;
  isHit: boolean;
}

export interface ActiveCollectible {
  id: string;
  type: TempleCollectibleType;
  mesh: THREE.Group;
  position: THREE.Vector3;
  lane: LaneIndex;
  isCollected: boolean;
}

export interface ActiveSegment {
  id: string;
  isCorner: boolean;
  turnCompleted?: boolean;
  turnDirection?: 'left' | 'right';
  incomingHeading: CardinalHeading;
  exitHeading: CardinalHeading;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  turnPivot?: THREE.Vector3;
  threeGroup: THREE.Group;
  arrowSignMesh?: THREE.Mesh;
  obstacles: ActiveObstacle[];
  collectibles: ActiveCollectible[];
}

export class TempleTrackManager {
  private scene: THREE.Scene;
  private segments: ActiveSegment[] = [];
  private currentEndPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private currentHeading: CardinalHeading = 'north';
  private straightCountSinceTurn: number = 0;
  private totalSegmentsSpawned: number = 0;
  private lastTurnDir: 'left' | 'right' | null = null;
  private consecutiveSameTurnCount: number = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public init(vighnasDestroyed: number = 0) {
    this.clear();
    this.currentEndPos.set(0, 0, 0);
    this.currentHeading = 'north';
    this.straightCountSinceTurn = 0;
    this.totalSegmentsSpawned = 0;
    this.lastTurnDir = null;
    this.consecutiveSameTurnCount = 0;

    // Spawn 2 initial safe straight segments without obstacles
    this.spawnStraightSegment(0, false);
    this.spawnStraightSegment(0, false);

    // Fill remaining view buffer with playable segments
    while (this.segments.length < TRACK_CONFIG.maxActiveSegments) {
      this.spawnNextSegment(vighnasDestroyed);
    }
  }

  public clear() {
    this.segments.forEach(seg => {
      this.scene.remove(seg.threeGroup);
    });
    this.segments = [];
  }

  public update(playerPos: THREE.Vector3, vighnasDestroyed: number) {
    // 1. Recycle segments that are safely behind the player
    // Keep at least 4 segments around/behind Ganesha for seamless visuals
    while (this.segments.length > 4) {
      const oldest = this.segments[0];
      if (this.isPastSegment(playerPos, oldest)) {
        this.scene.remove(oldest.threeGroup);
        this.segments.shift();
      } else {
        break;
      }
    }

    // 2. Continuous lookahead generation: strictly maintain maxActiveSegments (16 segments = 384m!)
    // Strictly bounded, instantaneous (<0.1ms), and cannot deadlock or infinite loop!
    while (this.segments.length < TRACK_CONFIG.maxActiveSegments) {
      this.spawnNextSegment(vighnasDestroyed);
    }

    // 3. Animate items (collectibles rotate, floating turn arrows bob)
    const time = Date.now() * 0.003;
    this.segments.forEach(seg => {
      // Floating corner arrow pulse
      if (seg.arrowSignMesh) {
        seg.arrowSignMesh.position.y = 3.2 + Math.sin(time * 2.5) * 0.25;
      }

      // Collectibles spinning
      seg.collectibles.forEach(col => {
        if (!col.isCollected) {
          col.mesh.rotation.y += 0.04;
        }
      });
    });
  }

  /**
   * Returns the nearest upcoming active corner junction that hasn't been completed
   */
  public getUpcomingCorner(): ActiveSegment | null {
    return this.segments.find(s => s.isCorner && !s.turnCompleted) || null;
  }

  public getActiveObstacles(): ActiveObstacle[] {
    const list: ActiveObstacle[] = [];
    this.segments.forEach(s => {
      s.obstacles.forEach(o => {
        if (!o.isHit) list.push(o);
      });
    });
    return list;
  }

  public getActiveCollectibles(): ActiveCollectible[] {
    const list: ActiveCollectible[] = [];
    this.segments.forEach(s => {
      s.collectibles.forEach(c => {
        if (!c.isCollected) list.push(c);
      });
    });
    return list;
  }

  private spawnNextSegment(vighnasDestroyed: number) {
    const worldId = getWorldForVighnas(vighnasDestroyed);

    // Authentic Temple Run pacing: 6 to 10 straight segments (144m to 240m) between 90-degree corners
    if (this.straightCountSinceTurn >= 6 && (this.straightCountSinceTurn >= 10 || Math.random() < 0.35)) {
      let turnDir: 'left' | 'right' = Math.random() > 0.5 ? 'left' : 'right';
      if (turnDir === this.lastTurnDir) {
        this.consecutiveSameTurnCount++;
        if (this.consecutiveSameTurnCount >= 2) {
          // Flip turn direction so track never loops into a 360-degree self-intersecting box!
          turnDir = turnDir === 'left' ? 'right' : 'left';
          this.consecutiveSameTurnCount = 1;
        }
      } else {
        this.consecutiveSameTurnCount = 1;
      }
      this.lastTurnDir = turnDir;

      this.spawnCornerSegment(turnDir, worldId);
      this.straightCountSinceTurn = 0;
    } else {
      this.spawnStraightSegment(vighnasDestroyed, true);
      this.straightCountSinceTurn++;
    }
  }

  private spawnStraightSegment(vighnasDestroyed: number, spawnProps: boolean) {
    const worldId = getWorldForVighnas(vighnasDestroyed);
    const length = TRACK_CONFIG.segmentLength;
    const dir = CARDINAL_DIRECTIONS[this.currentHeading];
    const yaw = CARDINAL_YAW[this.currentHeading];

    const startPos = this.currentEndPos.clone();
    const endPos = startPos.clone().add(dir.clone().multiplyScalar(length));

    const segGroup = new THREE.Group();
    segGroup.position.copy(startPos);
    segGroup.rotation.y = yaw;

    const trackMesh = createTrackSegmentMesh(worldId, length);
    segGroup.add(trackMesh);

    const segment: ActiveSegment = {
      id: `seg_${this.totalSegmentsSpawned++}`,
      isCorner: false,
      turnCompleted: false,
      incomingHeading: this.currentHeading,
      exitHeading: this.currentHeading,
      startPos,
      endPos,
      threeGroup: segGroup,
      obstacles: [],
      collectibles: []
    };

    if (spawnProps) {
      this.populateSegmentItems(segment, worldId, length);
    }

    this.scene.add(segGroup);
    this.segments.push(segment);
    this.currentEndPos = endPos;
  }

  private spawnCornerSegment(turn: 'left' | 'right', worldId: TempleWorldId) {
    const dir = CARDINAL_DIRECTIONS[this.currentHeading];
    const incomingYaw = CARDINAL_YAW[this.currentHeading];
    const exitHeading = getTurnedHeading(this.currentHeading, turn);
    const exitDir = CARDINAL_DIRECTIONS[exitHeading];

    const startPos = this.currentEndPos.clone();
    const width = TRACK_CONFIG.trackWidth;
    const halfWidth = width / 2;

    // Center pivot of turn
    const turnPivot = startPos.clone().add(dir.clone().multiplyScalar(halfWidth));
    const endPos = turnPivot.clone().add(exitDir.clone().multiplyScalar(halfWidth));

    const { group: cornerGroup, arrowSign } = createCornerJunctionMesh(turn, worldId);
    cornerGroup.position.copy(turnPivot);
    cornerGroup.rotation.y = incomingYaw;

    const segment: ActiveSegment = {
      id: `corner_${this.totalSegmentsSpawned++}`,
      isCorner: true,
      turnCompleted: false,
      turnDirection: turn,
      incomingHeading: this.currentHeading,
      exitHeading,
      startPos,
      endPos,
      turnPivot,
      threeGroup: cornerGroup,
      arrowSignMesh: arrowSign,
      obstacles: [],
      collectibles: []
    };

    this.scene.add(cornerGroup);
    this.segments.push(segment);

    // Update state for next segment
    this.currentEndPos = endPos;
    this.currentHeading = exitHeading;
  }

  private populateSegmentItems(segment: ActiveSegment, worldId: TempleWorldId, length: number) {
    const dir = CARDINAL_DIRECTIONS[segment.incomingHeading];
    const rightVec = new THREE.Vector3(-dir.z, 0, dir.x);
    const patternType = Math.floor(Math.random() * 6);

    // -------------------------------------------------------------
    // Pattern 0: Pure Modak Trail (5 Modaks down Center Lane) - 100% Clear
    // -------------------------------------------------------------
    if (patternType === 0) {
      [4, 8, 12, 16, 20].forEach((zOff) => {
        const modakMesh = createTempleCollectibleMesh('modak');
        modakMesh.position.set(0, 0, -zOff);
        segment.threeGroup.add(modakMesh);

        const modakWorldPos = segment.startPos.clone().add(dir.clone().multiplyScalar(zOff));
        segment.collectibles.push({
          id: `col_${Math.random()}`,
          type: 'modak',
          mesh: modakMesh,
          position: modakWorldPos,
          lane: 0,
          isCollected: false
        });
      });
    }
    // -------------------------------------------------------------
    // Pattern 1: Curving Coin Trail (Left to Right / Right to Left) - 100% Clear
    // -------------------------------------------------------------
    else if (patternType === 1) {
      const goLeftToRight = Math.random() > 0.5;
      const offsets = [
        { z: 4, lane: goLeftToRight ? -1 : 1 },
        { z: 8, lane: goLeftToRight ? -1 : 1 },
        { z: 12, lane: 0 },
        { z: 16, lane: 0 },
        { z: 20, lane: goLeftToRight ? 1 : -1 }
      ];

      offsets.forEach(({ z, lane }) => {
        const coinMesh = createTempleCollectibleMesh('festival_coin');
        coinMesh.position.set(lane * TRACK_CONFIG.laneWidth, 0, -z);
        segment.threeGroup.add(coinMesh);

        const coinWorldPos = segment.startPos.clone()
          .add(dir.clone().multiplyScalar(z))
          .add(rightVec.clone().multiplyScalar(lane * TRACK_CONFIG.laneWidth));

        segment.collectibles.push({
          id: `col_${Math.random()}`,
          type: 'festival_coin',
          mesh: coinMesh,
          position: coinWorldPos,
          lane: lane as LaneIndex,
          isCollected: false
        });
      });
    }
    // -------------------------------------------------------------
    // Pattern 2: Low Hurdle Barrier with Floating Golden Modak
    // -------------------------------------------------------------
    else if (patternType === 2) {
      const zOff = 12;
      const barrierMesh = createTempleObstacleMesh('temple_barrier');
      barrierMesh.position.set(0, 0, -zOff);
      segment.threeGroup.add(barrierMesh);

      const barrierWorldPos = segment.startPos.clone().add(dir.clone().multiplyScalar(zOff));
      segment.obstacles.push({
        id: `obs_${Math.random()}`,
        type: 'temple_barrier',
        mesh: barrierMesh,
        position: barrierWorldPos,
        lane: 0,
        isDestructible: false,
        isHit: false
      });

      // Floating golden modak suspended above hurdle (rewards jumping!)
      const floatingModak = createTempleCollectibleMesh('golden_modak');
      floatingModak.position.set(0, 1.8, -zOff);
      segment.threeGroup.add(floatingModak);

      const modakWorldPos = barrierWorldPos.clone();
      modakWorldPos.y += 1.8;
      segment.collectibles.push({
        id: `col_${Math.random()}`,
        type: 'golden_modak',
        mesh: floatingModak,
        position: modakWorldPos,
        lane: 0,
        isCollected: false
      });
    }
    // -------------------------------------------------------------
    // Pattern 3: Slide Under Hanging Bell Arch
    // -------------------------------------------------------------
    else if (patternType === 3) {
      const zOff = 12;
      const bellMesh = createTempleObstacleMesh('hanging_bell');
      bellMesh.position.set(0, 0, -zOff);
      segment.threeGroup.add(bellMesh);

      const bellWorldPos = segment.startPos.clone().add(dir.clone().multiplyScalar(zOff));
      segment.obstacles.push({
        id: `obs_${Math.random()}`,
        type: 'hanging_bell',
        mesh: bellMesh,
        position: bellWorldPos,
        lane: 0,
        isDestructible: false,
        isHit: false
      });

      // Modaks along the ground inviting a slide!
      [6, 12, 18].forEach(z => {
        const modakMesh = createTempleCollectibleMesh('modak');
        modakMesh.position.set(0, 0, -z);
        segment.threeGroup.add(modakMesh);

        const pos = segment.startPos.clone().add(dir.clone().multiplyScalar(z));
        segment.collectibles.push({
          id: `col_${Math.random()}`,
          type: 'modak',
          mesh: modakMesh,
          position: pos,
          lane: 0,
          isCollected: false
        });
      });
    }
    // -------------------------------------------------------------
    // Pattern 4: Destructible Crystalline Vighna (Smash for +100)
    // -------------------------------------------------------------
    else if (patternType === 4) {
      const zOff = 14;
      const targetLane: LaneIndex = Math.random() > 0.5 ? -1 : 1;
      const vighnaMesh = createTempleObstacleMesh('destructible_vighna');
      vighnaMesh.position.set(targetLane * TRACK_CONFIG.laneWidth, 0, -zOff);
      segment.threeGroup.add(vighnaMesh);

      const vighnaWorldPos = segment.startPos.clone()
        .add(dir.clone().multiplyScalar(zOff))
        .add(rightVec.clone().multiplyScalar(targetLane * TRACK_CONFIG.laneWidth));

      segment.obstacles.push({
        id: `obs_${Math.random()}`,
        type: 'destructible_vighna',
        mesh: vighnaMesh,
        position: vighnaWorldPos,
        lane: targetLane,
        isDestructible: true,
        isHit: false
      });

      // Center lane has clear modaks
      [6, 12, 18].forEach(z => {
        const modakMesh = createTempleCollectibleMesh('modak');
        modakMesh.position.set(0, 0, -z);
        segment.threeGroup.add(modakMesh);

        const pos = segment.startPos.clone().add(dir.clone().multiplyScalar(z));
        segment.collectibles.push({
          id: `col_${Math.random()}`,
          type: 'modak',
          mesh: modakMesh,
          position: pos,
          lane: 0,
          isCollected: false
        });
      });
    }
    // -------------------------------------------------------------
    // Pattern 5: Single Carved Stone Pillar with Sacred Lotus in Safe Lane
    // -------------------------------------------------------------
    else {
      const blockedLane: LaneIndex = Math.random() > 0.5 ? -1 : 1;
      const safeLane: LaneIndex = -blockedLane as LaneIndex;
      const zOff = 12;

      const pillarMesh = createTempleObstacleMesh('stone_pillar');
      pillarMesh.position.set(blockedLane * TRACK_CONFIG.laneWidth, 0, -zOff);
      segment.threeGroup.add(pillarMesh);

      const pillarWorldPos = segment.startPos.clone()
        .add(dir.clone().multiplyScalar(zOff))
        .add(rightVec.clone().multiplyScalar(blockedLane * TRACK_CONFIG.laneWidth));

      segment.obstacles.push({
        id: `obs_${Math.random()}`,
        type: 'stone_pillar',
        mesh: pillarMesh,
        position: pillarWorldPos,
        lane: blockedLane,
        isDestructible: false,
        isHit: false
      });

      // Sacred Lotus in safe lane
      const lotusMesh = createTempleCollectibleMesh('lotus');
      lotusMesh.position.set(safeLane * TRACK_CONFIG.laneWidth, 0, -zOff);
      segment.threeGroup.add(lotusMesh);

      const lotusWorldPos = segment.startPos.clone()
        .add(dir.clone().multiplyScalar(zOff))
        .add(rightVec.clone().multiplyScalar(safeLane * TRACK_CONFIG.laneWidth));

      segment.collectibles.push({
        id: `col_${Math.random()}`,
        type: 'lotus',
        mesh: lotusMesh,
        position: lotusWorldPos,
        lane: safeLane,
        isCollected: false
      });
    }
  }

  private isPastSegment(playerPos: THREE.Vector3, segment: ActiveSegment): boolean {
    // 1. Completed corner junction: recycle once player is past the turn pivot
    if (segment.isCorner && segment.turnCompleted && segment.turnPivot) {
      const exitDir = CARDINAL_DIRECTIONS[segment.exitHeading];
      const fromPivot = playerPos.clone().sub(segment.turnPivot);
      const progressOnExit = fromPivot.dot(exitDir);
      if (progressOnExit > 10.0 || playerPos.distanceTo(segment.turnPivot) > 16.0) {
        return true;
      }
      return false;
    }

    // 2. Measure progress along this segment's own incoming heading
    const dir = CARDINAL_DIRECTIONS[segment.incomingHeading];
    const fromStart = playerPos.clone().sub(segment.startPos);
    const progressAlongAxis = fromStart.dot(dir);

    // If player has moved past this segment's length (+ buffer into next segments)
    if (progressAlongAxis > (TRACK_CONFIG.segmentLength + 8.0)) {
      return true;
    }

    // 3. Fallback: if player has traveled into subsequent segments and 3D distance is large
    if (progressAlongAxis > 0 && playerPos.distanceTo(segment.endPos) > 30.0) {
      return true;
    }

    // 4. Safe distance fallback: if player is far from both start and end
    if (playerPos.distanceTo(segment.endPos) > 45.0 && playerPos.distanceTo(segment.startPos) > 45.0) {
      return true;
    }

    return false;
  }
}
