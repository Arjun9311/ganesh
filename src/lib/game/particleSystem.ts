import * as THREE from 'three';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

export class ParticlePool {
  private particles: Particle[] = [];
  private group: THREE.Group;

  constructor(scene: THREE.Scene, maxCount: number = 200) {
    this.group = new THREE.Group();
    scene.add(this.group);

    const geo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const goldMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });

    for (let i = 0; i < maxCount; i++) {
      const mesh = new THREE.Mesh(geo, goldMat);
      mesh.visible = false;
      this.group.add(mesh);

      this.particles.push({
        mesh,
        velocity: new THREE.Vector3(),
        rotSpeed: new THREE.Vector3(),
        life: 0,
        maxLife: 1.0,
        active: false
      });
    }
  }

  /**
   * Spawns an explosion of golden sparks and fragments when a Vighna is smashed
   */
  public spawnDestructionBurst(position: THREE.Vector3, count: number = 25) {
    let spawned = 0;
    for (const p of this.particles) {
      if (!p.active) {
        p.active = true;
        p.mesh.visible = true;
        p.mesh.position.copy(position);
        p.mesh.position.y += 0.6; // center of impact

        // Explosive outward velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 6;
        p.velocity.set(
          Math.cos(angle) * speed,
          2 + Math.random() * 5,
          Math.sin(angle) * speed - 2
        );

        p.rotSpeed.set(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        );

        p.life = 0;
        p.maxLife = 0.6 + Math.random() * 0.4;

        spawned++;
        if (spawned >= count) break;
      }
    }
  }

  /**
   * Spawns radiant sparkle particles when collecting a Modak
   */
  public spawnModakSparkle(position: THREE.Vector3, isGolden: boolean = false) {
    const count = isGolden ? 20 : 8;
    let spawned = 0;
    for (const p of this.particles) {
      if (!p.active) {
        p.active = true;
        p.mesh.visible = true;
        p.mesh.position.copy(position);
        p.velocity.set(
          (Math.random() - 0.5) * 3,
          2 + Math.random() * 3,
          (Math.random() - 0.5) * 3
        );
        p.rotSpeed.set(Math.random() * 5, Math.random() * 5, 0);
        p.life = 0;
        p.maxLife = isGolden ? 0.8 : 0.4;
        spawned++;
        if (spawned >= count) break;
      }
    }
  }

  public update(dt: number) {
    const gravity = -18;
    for (const p of this.particles) {
      if (p.active) {
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
          p.mesh.visible = false;
          continue;
        }

        p.velocity.y += gravity * dt;
        p.mesh.position.x += p.velocity.x * dt;
        p.mesh.position.y += p.velocity.y * dt;
        p.mesh.position.z += p.velocity.z * dt;

        p.mesh.rotation.x += p.rotSpeed.x * dt;
        p.mesh.rotation.y += p.rotSpeed.y * dt;

        // Shrink towards end of life
        const scale = 1.0 - (p.life / p.maxLife);
        p.mesh.scale.set(scale, scale, scale);
      }
    }
  }

  public cleanup() {
    this.group.clear();
  }
}

/**
 * Ambient floating festival petals (Marigold / Rose) drifting through the air
 */
export class AmbientPetalSystem {
  private group: THREE.Group;
  private count: number;
  private petals: { mesh: THREE.Mesh; seed: number; baseY: number }[] = [];

  constructor(scene: THREE.Scene, count: number = 60) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.count = count;

    const geo = new THREE.PlaneGeometry(0.2, 0.2);
    const orangeMat = new THREE.MeshBasicMaterial({ color: 0xFFA500, side: THREE.DoubleSide });
    const pinkMat = new THREE.MeshBasicMaterial({ color: 0xFF69B4, side: THREE.DoubleSide });

    for (let i = 0; i < this.count; i++) {
      const mat = i % 2 === 0 ? orangeMat : pinkMat;
      const mesh = new THREE.Mesh(geo, mat);
      const baseY = 1 + Math.random() * 4;

      mesh.position.set(
        (Math.random() - 0.5) * 16,
        baseY,
        -Math.random() * 80
      );

      this.group.add(mesh);
      this.petals.push({ mesh, seed: Math.random() * 10, baseY });
    }
  }

  public update(playerZ: number, dt: number) {
    for (const p of this.petals) {
      // Swirl slightly
      p.mesh.rotation.x += 1.5 * dt;
      p.mesh.rotation.y += 2.0 * dt;
      p.mesh.position.x += Math.sin(p.seed + Date.now() * 0.002) * 0.01;
      p.mesh.position.y = p.baseY + Math.sin(p.seed * 2 + Date.now() * 0.003) * 0.3;

      // Recycle petals ahead of the player
      if (p.mesh.position.z > playerZ + 5) {
        p.mesh.position.z = playerZ - 70 - Math.random() * 20;
        p.mesh.position.x = (Math.random() - 0.5) * 16;
      }
    }
  }

  public setTheme(colors: number[]) {
    if (!colors || colors.length === 0) return;
    this.petals.forEach((p, idx) => {
      const col = colors[idx % colors.length];
      (p.mesh.material as THREE.MeshBasicMaterial).color.setHex(col);
    });
  }

  public cleanup() {
    this.group.clear();
  }
}
