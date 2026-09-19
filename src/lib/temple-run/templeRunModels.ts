import * as THREE from 'three';
import { TempleWorldId, TempleObstacleType, TempleCollectibleType } from '@/types/templeRun';
import { TRACK_CONFIG } from './templeRunConfig';

// Reusable Shared Geometries & Materials for maximum performance (60 FPS)
const geoSphere12 = new THREE.SphereGeometry(1, 12, 12);
const geoBox1 = new THREE.BoxGeometry(1, 1, 1);
const geoCylinder12 = new THREE.CylinderGeometry(1, 1, 1, 12);
const geoTorus12 = new THREE.TorusGeometry(1, 0.2, 8, 16);

// Static reusable track & obstacle geometries (Zero per-segment allocation!)
const geoTorchFlame = new THREE.ConeGeometry(0.16, 0.44, 8);
const geoToranaPeak = new THREE.ConeGeometry(0.55, 0.75, 4);
const geoMiniBell = new THREE.ConeGeometry(0.14, 0.24, 8);
const geoCornerFlame = new THREE.ConeGeometry(0.24, 0.6, 8);
const geoHangingBell = new THREE.ConeGeometry(0.42, 0.65, 12);
const geoVighnaCore = new THREE.DodecahedronGeometry(0.7, 1);
const geoVighnaSpikes = new THREE.OctahedronGeometry(0.85, 0);
const geoVighnaBoss = new THREE.IcosahedronGeometry(1.6, 1);

// Icicle geometry (inverted cone pointing downward)
const geoIcicle = new THREE.ConeGeometry(0.09, 0.55, 6);
geoIcicle.rotateX(Math.PI);

function createArrowGeometry(direction: 'left' | 'right'): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  if (direction === 'left') {
    shape.moveTo(1.0, -0.5);
    shape.lineTo(0.1, -0.5);
    shape.lineTo(0.1, -1.0);
    shape.lineTo(-1.2, 0.0);
    shape.lineTo(0.1, 1.0);
    shape.lineTo(0.1, 0.5);
    shape.lineTo(1.0, 0.5);
    shape.closePath();
  } else {
    shape.moveTo(-1.0, -0.5);
    shape.lineTo(-0.1, -0.5);
    shape.lineTo(-0.1, -1.0);
    shape.lineTo(1.2, 0.0);
    shape.lineTo(-0.1, 1.0);
    shape.lineTo(-0.1, 0.5);
    shape.lineTo(-1.0, 0.5);
    shape.closePath();
  }
  return new THREE.ExtrudeGeometry(shape, { depth: 0.22, bevelEnabled: false });
}
const geoArrowLeft = createArrowGeometry('left');
const geoArrowRight = createArrowGeometry('right');

export const templeMaterials = {
  skin: new THREE.MeshStandardMaterial({ color: 0xF5CBA7, roughness: 0.45, metalness: 0.05 }),
  dhoti: new THREE.MeshStandardMaterial({ color: 0xFF671F, roughness: 0.55, metalness: 0.1 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.9, roughness: 0.18 }),
  jewelRuby: new THREE.MeshStandardMaterial({ color: 0xDC2626, emissive: 0x500000, roughness: 0.2 }),
  tusk: new THREE.MeshStandardMaterial({ color: 0xFFFFF0, roughness: 0.25 }),

  // Frozen Theme Architecture Materials
  snowCover: new THREE.MeshStandardMaterial({ color: 0xF0F9FF, roughness: 0.85, metalness: 0.05 }),
  frozenStone: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8 }),
  glacialIce: new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.88 }),
  iceTrim: new THREE.MeshStandardMaterial({ color: 0xBAE6FD, roughness: 0.25, metalness: 0.35 }),
  icicleMat: new THREE.MeshStandardMaterial({ color: 0xE0F2FE, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.9 }),
  sandstone: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8 }), // Default to frozen stone
  darkStone: new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.85 }),
  mossStone: new THREE.MeshStandardMaterial({ color: 0x164E63, roughness: 0.8 }), // Alpine frost slate
  divineGold: new THREE.MeshStandardMaterial({ color: 0xFDE047, emissive: 0x0284C7, emissiveIntensity: 0.35, roughness: 0.2 }),
  brass: new THREE.MeshStandardMaterial({ color: 0x38BDF8, metalness: 0.7, roughness: 0.25 }), // Glacial ice brass
  marigold: new THREE.MeshStandardMaterial({ color: 0x67E8F9, roughness: 0.5 }), // Frost flower
  lotusPink: new THREE.MeshStandardMaterial({ color: 0xA5F3FC, roughness: 0.3 }), // Ice lotus
  vighnaDark: new THREE.MeshStandardMaterial({ color: 0x082F49, emissive: 0x0284C7, emissiveIntensity: 0.5, roughness: 0.45 }), // Frost demon
  vighnaCore: new THREE.MeshStandardMaterial({ color: 0x38BDF8, emissive: 0x0EA5E9, emissiveIntensity: 0.9, roughness: 0.15 }), // Ice core
  crystalCyan: new THREE.MeshStandardMaterial({ color: 0x38BDF8, emissive: 0x0284C7, emissiveIntensity: 0.8, roughness: 0.1 }),
  glowArrow: new THREE.MeshBasicMaterial({ color: 0x38BDF8 }), // Glacial blue glow arrow
  auraGlow: new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.35, side: THREE.BackSide }),
  torchFlame: new THREE.MeshBasicMaterial({ color: 0x00F0FF }), // Mystical Cyan Spirit Flame!
  deepAbyssStone: new THREE.MeshStandardMaterial({ color: 0x060B14, roughness: 0.95 }),
  stoneCoping: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 })
};

/**
 * Creates the Stylized 3D Ganesha Character with articulated body, legs, ears, and trunk.
 */
export function createTempleGanesha(skinColorHex?: string, clothesColorHex?: string): {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftEar: THREE.Mesh;
  rightEar: THREE.Mesh;
  trunk: THREE.Group;
  aura: THREE.Mesh;
} {
  const root = new THREE.Group();
  root.name = 'temple_ganesha';

  const ganeshaSkinMat = skinColorHex
    ? new THREE.MeshStandardMaterial({ color: new THREE.Color(skinColorHex), roughness: 0.45 })
    : templeMaterials.skin;

  const ganeshaDhotiMat = clothesColorHex
    ? new THREE.MeshStandardMaterial({ color: new THREE.Color(clothesColorHex), roughness: 0.55 })
    : templeMaterials.dhoti;

  const bodyGroup = new THREE.Group();
  bodyGroup.rotation.y = Math.PI;
  root.add(bodyGroup);

  // 1. Belly / Torso
  const belly = new THREE.Mesh(geoSphere12, ganeshaSkinMat);
  belly.scale.set(0.42, 0.46, 0.40);
  belly.position.y = 0.85;
  belly.castShadow = true;
  bodyGroup.add(belly);

  // Dhoti wrap
  const dhoti = new THREE.Mesh(geoCylinder12, ganeshaDhotiMat);
  dhoti.scale.set(0.44, 0.42, 0.44);
  dhoti.position.y = 0.62;
  dhoti.castShadow = true;
  bodyGroup.add(dhoti);

  // Kamarbandh (Golden Belt)
  const belt = new THREE.Mesh(geoTorus12, templeMaterials.gold);
  belt.scale.set(0.43, 0.43, 0.15);
  belt.rotation.x = Math.PI / 2;
  belt.position.y = 0.78;
  bodyGroup.add(belt);

  // Belt Ruby
  const ruby = new THREE.Mesh(geoSphere12, templeMaterials.jewelRuby);
  ruby.scale.set(0.06, 0.06, 0.06);
  ruby.position.set(0, 0.76, 0.45);
  bodyGroup.add(ruby);

  // 2. Head & Elephant Features
  const head = new THREE.Mesh(geoSphere12, ganeshaSkinMat);
  head.scale.set(0.36, 0.38, 0.35);
  head.position.set(0, 1.34, 0.08);
  head.castShadow = true;
  bodyGroup.add(head);

  // Sacred Tilak
  const tilak = new THREE.Mesh(geoBox1, templeMaterials.jewelRuby);
  tilak.scale.set(0.06, 0.14, 0.02);
  tilak.position.set(0, 1.44, 0.42);
  bodyGroup.add(tilak);

  // Crown (Mukut)
  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 1.62, 0.06);

  const crownBase = new THREE.Mesh(geoCylinder12, templeMaterials.gold);
  crownBase.scale.set(0.26, 0.18, 0.26);
  crownGroup.add(crownBase);

  const crownSpire = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.42, 12), templeMaterials.gold);
  crownSpire.position.y = 0.28;
  crownGroup.add(crownSpire);

  const crownJewel = new THREE.Mesh(geoSphere12, templeMaterials.jewelRuby);
  crownJewel.scale.set(0.07, 0.07, 0.07);
  crownJewel.position.set(0, 0.20, 0.22);
  crownGroup.add(crownJewel);

  bodyGroup.add(crownGroup);

  // Animated Large Ears (Supakarna)
  const earGeo = new THREE.BoxGeometry(0.32, 0.40, 0.05);
  const leftEar = new THREE.Mesh(earGeo, ganeshaSkinMat);
  leftEar.position.set(-0.38, 1.38, 0.04);
  leftEar.rotation.y = 0.25;
  bodyGroup.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, ganeshaSkinMat);
  rightEar.position.set(0.38, 1.38, 0.04);
  rightEar.rotation.y = -0.25;
  bodyGroup.add(rightEar);

  // Elephant Trunk (Curved & Animated)
  const trunk = new THREE.Group();
  trunk.position.set(0, 1.25, 0.38);

  const trunkPart1 = new THREE.Mesh(geoCylinder12, ganeshaSkinMat);
  trunkPart1.scale.set(0.12, 0.28, 0.12);
  trunkPart1.rotation.x = 0.35;
  trunk.add(trunkPart1);

  const trunkPart2 = new THREE.Mesh(geoCylinder12, ganeshaSkinMat);
  trunkPart2.scale.set(0.09, 0.24, 0.09);
  trunkPart2.position.set(0.08, -0.24, 0.08);
  trunkPart2.rotation.z = -0.6;
  trunk.add(trunkPart2);

  // Modak in Trunk Tip!
  const trunkModak = new THREE.Mesh(geoSphere12, templeMaterials.gold);
  trunkModak.scale.set(0.07, 0.09, 0.07);
  trunkModak.position.set(0.18, -0.22, 0.12);
  trunk.add(trunkModak);

  bodyGroup.add(trunk);

  // Tusks (Danta: Complete right, broken left)
  const rightTusk = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 8), templeMaterials.tusk);
  rightTusk.position.set(0.12, 1.18, 0.36);
  rightTusk.rotation.x = 1.2;
  rightTusk.rotation.z = -0.2;
  bodyGroup.add(rightTusk);

  const leftBrokenTusk = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.08, 8), templeMaterials.tusk);
  leftBrokenTusk.position.set(-0.12, 1.18, 0.34);
  leftBrokenTusk.rotation.x = 1.2;
  leftBrokenTusk.rotation.z = 0.2;
  bodyGroup.add(leftBrokenTusk);

  // 3. Legs for running animation
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.18, 0.44, 0);
  const leftFoot = new THREE.Mesh(geoCylinder12, ganeshaSkinMat);
  leftFoot.scale.set(0.12, 0.38, 0.14);
  leftFoot.position.y = -0.19;
  leftLeg.add(leftFoot);
  bodyGroup.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.18, 0.44, 0);
  const rightFoot = new THREE.Mesh(geoCylinder12, ganeshaSkinMat);
  rightFoot.scale.set(0.12, 0.38, 0.14);
  rightFoot.position.y = -0.19;
  rightLeg.add(rightFoot);
  bodyGroup.add(rightLeg);

  // 4. Golden Divine Aura (Spherical outer glow)
  const aura = new THREE.Mesh(geoSphere12, templeMaterials.auraGlow);
  aura.scale.set(1.4, 1.8, 1.4);
  aura.position.y = 1.0;
  aura.visible = false; // Toggled during Divine Mode
  root.add(aura);

  return { root, bodyGroup, leftLeg, rightLeg, leftEar, rightEar, trunk, aura };
}

/**
 * Creates Mushika the Divine Mouse companion who runs alongside Ganesha
 */
export function createTempleMushika(): THREE.Group {
  const mushika = new THREE.Group();
  mushika.name = 'mushika_companion';

  const inner = new THREE.Group();
  inner.rotation.y = Math.PI;
  mushika.add(inner);

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.6, roughness: 0.3 });

  // Body
  const body = new THREE.Mesh(geoSphere12, bodyMat);
  body.scale.set(0.18, 0.15, 0.28);
  body.position.y = 0.16;
  body.castShadow = true;
  inner.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 10), bodyMat);
  head.position.set(0, 0.20, 0.22);
  head.rotation.x = Math.PI / 2;
  inner.add(head);

  // Ears
  [-0.08, 0.08].forEach(x => {
    const ear = new THREE.Mesh(geoSphere12, templeMaterials.gold);
    ear.scale.set(0.06, 0.08, 0.02);
    ear.position.set(x, 0.28, 0.16);
    inner.add(ear);
  });

  // Long tail
  const tail = new THREE.Mesh(geoCylinder12, templeMaterials.gold);
  tail.scale.set(0.02, 0.28, 0.02);
  tail.position.set(0, 0.18, -0.22);
  tail.rotation.x = -0.8;
  inner.add(tail);

  // Mini Modak carried proudly
  const tinyModak = new THREE.Mesh(geoSphere12, templeMaterials.gold);
  tinyModak.scale.set(0.05, 0.07, 0.05);
  tinyModak.position.set(0, 0.18, 0.34);
  inner.add(tinyModak);

  return mushika;
}

/**
 * Creates straight or modular track segment
 */
/**
 * Creates authentic Temple Run straight or modular track segment with deep stone foundation,
 * continuous carved balustrades, flaming fire braziers, 3 clean running lanes, and grand torana arches.
 */
export function createTrackSegmentMesh(worldId: TempleWorldId, length: number): THREE.Group {
  const group = new THREE.Group();
  const width = TRACK_CONFIG.trackWidth;

  // Ground Pavement Materials (Frozen Arctic Stone & Glacial Ice)
  let groundMat = templeMaterials.frozenStone;
  if (worldId === 'temple_cave') groundMat = templeMaterials.darkStone;
  else if (worldId === 'sacred_forest') groundMat = templeMaterials.mossStone;
  else if (worldId === 'divine_realm') groundMat = templeMaterials.divineGold;
  else if (worldId === 'visarjan_path') groundMat = templeMaterials.glacialIce;

  // 1. Massive Ancient Causeway Foundation (Deep stone viaduct in frozen abyss)
  const foundation = new THREE.Mesh(geoBox1, templeMaterials.deepAbyssStone);
  foundation.scale.set(width * 0.95, 22.0, length);
  foundation.position.set(0, -11.2, -length / 2);
  group.add(foundation);

  // 2. Weathered Frozen Stone Causeway Roadbed
  const road = new THREE.Mesh(geoBox1, groundMat);
  road.scale.set(width, 0.45, length);
  road.position.set(0, -0.22, -length / 2);
  road.receiveShadow = true;
  group.add(road);

  // 3. Three Clean Running Lanes with Crystalline Ice Inlay Dividers
  [-TRACK_CONFIG.laneWidth / 2, TRACK_CONFIG.laneWidth / 2].forEach(x => {
    // Glowing Glacial Ice Divider
    const divider = new THREE.Mesh(geoBox1, templeMaterials.iceTrim);
    divider.scale.set(0.12, 0.04, length);
    divider.position.set(x, 0.02, -length / 2);
    group.add(divider);

    const groove = new THREE.Mesh(geoBox1, templeMaterials.darkStone);
    groove.scale.set(0.04, 0.06, length);
    groove.position.set(x, 0.025, -length / 2);
    group.add(groove);
  });

  // 4. Ancient Stone Balustrades with Pure Snowdrifts along left and right edges
  [-width / 2, width / 2].forEach(x => {
    // Lower frozen stone wall
    const parapet = new THREE.Mesh(geoBox1, templeMaterials.frozenStone);
    parapet.scale.set(0.42, 0.65, length);
    parapet.position.set(x, 0.20, -length / 2);
    group.add(parapet);

    // Stone coping cap
    const coping = new THREE.Mesh(geoBox1, templeMaterials.stoneCoping);
    coping.scale.set(0.52, 0.12, length);
    coping.position.set(x, 0.56, -length / 2);
    group.add(coping);

    // Pure White Snow Cap running along the entire balustrade!
    const snowCap = new THREE.Mesh(geoBox1, templeMaterials.snowCover);
    snowCap.scale.set(0.46, 0.09, length);
    snowCap.position.set(x, 0.65, -length / 2);
    group.add(snowCap);
  });

  // 5. Mystical Cyan Spirit Torch Pillars along the Balustrades (every 8 meters)
  const stepCount = Math.floor(length / 8);
  for (let i = 0; i < stepCount; i++) {
    const zOffset = -(i * 8 + 4);

    [-width / 2, width / 2].forEach(x => {
      // Carved frozen stone pillar post
      const post = new THREE.Mesh(geoBox1, templeMaterials.frozenStone);
      post.scale.set(0.55, 1.2, 0.55);
      post.position.set(x, 0.8, zOffset);
      group.add(post);

      // Snow mound on post base
      const postSnow = new THREE.Mesh(geoBox1, templeMaterials.snowCover);
      postSnow.scale.set(0.58, 0.08, 0.58);
      postSnow.position.set(x, 1.44, zOffset);
      group.add(postSnow);

      // Frost brass brazier bowl
      const brazier = new THREE.Mesh(geoCylinder12, templeMaterials.brass);
      brazier.scale.set(0.26, 0.22, 0.26);
      brazier.position.set(x, 1.52, zOffset);
      group.add(brazier);

      // Flickering Mystical Cyan Spirit Flame (Temple Run 2: Frozen Shadows!)
      const flame = new THREE.Mesh(geoTorchFlame, templeMaterials.torchFlame);
      flame.position.set(x, 1.80, zOffset);
      group.add(flame);
    });
  }

  // 6. Grand Ancient Himalayan Torana Gateway Arch (spans overhead in middle of segment)
  const archZ = -length * 0.5;
  const leftCol = new THREE.Mesh(geoBox1, templeMaterials.frozenStone);
  leftCol.scale.set(0.7, 4.8, 0.7);
  leftCol.position.set(-width / 2 - 0.2, 2.3, archZ);
  group.add(leftCol);

  const rightCol = new THREE.Mesh(geoBox1, templeMaterials.frozenStone);
  rightCol.scale.set(0.7, 4.8, 0.7);
  rightCol.position.set(width / 2 + 0.2, 2.3, archZ);
  group.add(rightCol);

  // Crossbeam arch overhead
  const toranaBeam = new THREE.Mesh(geoBox1, templeMaterials.frozenStone);
  toranaBeam.scale.set(width + 1.2, 0.65, 0.85);
  toranaBeam.position.set(0, 4.8, archZ);
  group.add(toranaBeam);

  // Thick blanket of white mountain snow atop the torana beam!
  const toranaSnow = new THREE.Mesh(geoBox1, templeMaterials.snowCover);
  toranaSnow.scale.set(width + 1.4, 0.26, 0.95);
  toranaSnow.position.set(0, 5.22, archZ);
  group.add(toranaSnow);

  // Ornate Vedic roof peak in ice trim
  const toranaPeak = new THREE.Mesh(geoToranaPeak, templeMaterials.iceTrim);
  toranaPeak.rotation.y = Math.PI / 4;
  toranaPeak.position.set(0, 5.5, archZ);
  group.add(toranaPeak);

  // Hanging Crystalline Icicles underneath the torana beam!
  [-2.2, -1.5, -0.8, 0, 0.8, 1.5, 2.2].forEach(ix => {
    const icicle = new THREE.Mesh(geoIcicle, templeMaterials.icicleMat);
    icicle.position.set(ix, 4.25, archZ);
    group.add(icicle);
  });

  // Hanging sacred bells under the beam
  [-1.4, 1.4].forEach(bx => {
    const miniBell = new THREE.Mesh(geoMiniBell, templeMaterials.brass);
    miniBell.position.set(bx, 4.35, archZ);
    group.add(miniBell);
  });

  return group;
}

/**
 * Creates authentic 90-Degree Temple Run Corner Junction with deep foundation,
 * fortress boundary pavilion, flaming beacon towers, and glowing 3D arrow signpost.
 */
export function createCornerJunctionMesh(turn: 'left' | 'right', worldId: TempleWorldId): {
  group: THREE.Group;
  arrowSign: THREE.Mesh;
} {
  const group = new THREE.Group();
  const width = TRACK_CONFIG.trackWidth;
  const halfWidth = width / 2;

  let groundMat = templeMaterials.frozenStone;
  if (worldId === 'temple_cave') groundMat = templeMaterials.darkStone;
  else if (worldId === 'sacred_forest') groundMat = templeMaterials.mossStone;
  else if (worldId === 'divine_realm') groundMat = templeMaterials.divineGold;
  else if (worldId === 'visarjan_path') groundMat = templeMaterials.glacialIce;

  // 1. Deep Stone Foundation underneath corner
  const foundation = new THREE.Mesh(geoBox1, templeMaterials.deepAbyssStone);
  foundation.scale.set(width * 1.2, 22.0, width * 1.2);
  foundation.position.set(0, -11.2, 0);
  group.add(foundation);

  // 2. Central Turn Square Platform
  const centerPlat = new THREE.Mesh(geoBox1, groundMat);
  centerPlat.scale.set(width, 0.45, width);
  centerPlat.position.set(0, -0.22, 0);
  centerPlat.receiveShadow = true;
  group.add(centerPlat);

  // 3. Entry Apron (+Z side) connecting seamlessly to incoming segment
  const entryApron = new THREE.Mesh(geoBox1, groundMat);
  entryApron.scale.set(width, 0.45, halfWidth);
  entryApron.position.set(0, -0.22, halfWidth / 2);
  group.add(entryApron);

  // 4. Exit Branch connecting to outgoing segment
  const exitBranch = new THREE.Mesh(geoBox1, groundMat);
  if (turn === 'left') {
    exitBranch.scale.set(halfWidth, 0.45, width);
    exitBranch.position.set(-halfWidth / 2 - halfWidth / 2, -0.22, 0);
  } else {
    exitBranch.scale.set(halfWidth, 0.45, width);
    exitBranch.position.set(halfWidth / 2 + halfWidth / 2, -0.22, 0);
  }
  group.add(exitBranch);

  // 5. Outer Fortress Boundary Wall (Frozen temple mountain wall stopping forward run)
  const backWall = new THREE.Mesh(geoBox1, templeMaterials.frozenStone);
  backWall.scale.set(width + 1.2, 4.2, 1.2);
  backWall.position.set(0, 1.9, -halfWidth - 0.6);
  group.add(backWall);

  // Decorative snow-covered coping on back wall
  const wallCoping = new THREE.Mesh(geoBox1, templeMaterials.stoneCoping);
  wallCoping.scale.set(width + 1.5, 0.35, 1.4);
  wallCoping.position.set(0, 4.1, -halfWidth - 0.6);
  group.add(wallCoping);

  // Heavy snow blanket atop the fortress wall!
  const wallSnow = new THREE.Mesh(geoBox1, templeMaterials.snowCover);
  wallSnow.scale.set(width + 1.6, 0.28, 1.5);
  wallSnow.position.set(0, 4.38, -halfWidth - 0.6);
  group.add(wallSnow);

  // Hanging Icicles along fortress wall
  [-2.2, -1.1, 0, 1.1, 2.2].forEach(ix => {
    const icicle = new THREE.Mesh(geoIcicle, templeMaterials.icicleMat);
    icicle.position.set(ix, 3.8, -halfWidth + 0.1);
    group.add(icicle);
  });

  // 6. Flaming Beacon Towers at Corner Flanks with Cyan Spirit Flames
  [-halfWidth - 0.2, halfWidth + 0.2].forEach(bx => {
    const tower = new THREE.Mesh(geoBox1, templeMaterials.frozenStone);
    tower.scale.set(0.8, 5.0, 0.8);
    tower.position.set(bx, 2.3, -halfWidth - 0.4);
    group.add(tower);

    const towerSnow = new THREE.Mesh(geoBox1, templeMaterials.snowCover);
    towerSnow.scale.set(0.88, 0.12, 0.88);
    towerSnow.position.set(bx, 4.86, -halfWidth - 0.4);
    group.add(towerSnow);

    const flame = new THREE.Mesh(geoCornerFlame, templeMaterials.torchFlame);
    flame.position.set(bx, 5.15, -halfWidth - 0.4);
    group.add(flame);
  });

  // 7. 3D Glowing Directional Arrow Signpost (using pre-allocated shared geometry)
  const arrowGeo = turn === 'left' ? geoArrowLeft : geoArrowRight;
  const arrowSign = new THREE.Mesh(arrowGeo, templeMaterials.glowArrow);
  arrowSign.scale.set(1.5, 1.5, 1.5);
  arrowSign.position.set(0, 3.4, -halfWidth + 0.1);
  group.add(arrowSign);

  return { group, arrowSign };
}

/**
 * Creates 3D Obstacle meshes
 */
export function createTempleObstacleMesh(type: TempleObstacleType): THREE.Group {
  const obstacle = new THREE.Group();
  obstacle.name = `obstacle_${type}`;

  switch (type) {
    case 'temple_barrier': {
      // Low hurdle (Jump over) - Frosted mountain timber hurdle with snow blanket
      const wood = new THREE.Mesh(geoBox1, templeMaterials.frozenStone);
      wood.scale.set(1.6, 0.55, 0.3);
      wood.position.y = 0.28;
      obstacle.add(wood);

      // Snow blanket on hurdle top
      const snow = new THREE.Mesh(geoBox1, templeMaterials.snowCover);
      snow.scale.set(1.68, 0.14, 0.38);
      snow.position.y = 0.58;
      obstacle.add(snow);

      // Frost garland
      const garland = new THREE.Mesh(geoTorus12, templeMaterials.iceTrim);
      garland.scale.set(0.65, 0.25, 0.1);
      garland.position.set(0, 0.35, 0.16);
      obstacle.add(garland);
      break;
    }

    case 'hanging_bell': {
      // High arch with low-hanging frosted bell & icicles (Slide under)
      const arch = new THREE.Mesh(geoTorus12, templeMaterials.frozenStone);
      arch.scale.set(1.0, 1.4, 0.2);
      arch.position.y = 1.6;
      obstacle.add(arch);

      // Hanging icicles from arch
      [-0.45, 0.45].forEach(x => {
        const icicle = new THREE.Mesh(geoIcicle, templeMaterials.icicleMat);
        icicle.position.set(x, 1.7, 0);
        obstacle.add(icicle);
      });

      const bell = new THREE.Mesh(geoHangingBell, templeMaterials.iceTrim);
      bell.position.y = 1.35;
      obstacle.add(bell);
      break;
    }

    case 'falling_rock':
    case 'stone_pillar': {
      // Glacial Ice Monolith Column (Change lane)
      const pillar = new THREE.Mesh(geoCylinder12, templeMaterials.glacialIce);
      pillar.scale.set(0.52, 2.8, 0.52);
      pillar.position.y = 1.4;
      obstacle.add(pillar);

      // Snow cap atop the ice monolith
      const cap = new THREE.Mesh(geoBox1, templeMaterials.snowCover);
      cap.scale.set(1.1, 0.32, 1.1);
      cap.position.y = 2.85;
      obstacle.add(cap);
      break;
    }

    case 'moving_cart': {
      // Snowbound sledge / supply sled
      const cartBody = new THREE.Mesh(geoBox1, templeMaterials.frozenStone);
      cartBody.scale.set(1.4, 0.8, 1.2);
      cartBody.position.y = 0.65;
      obstacle.add(cartBody);

      const cartSnow = new THREE.Mesh(geoBox1, templeMaterials.snowCover);
      cartSnow.scale.set(1.45, 0.15, 1.25);
      cartSnow.position.y = 1.1;
      obstacle.add(cartSnow);
      break;
    }

    case 'tree_root': {
      // Raised frozen glacial root / ice ridge (Jump over)
      const rootMesh = new THREE.Mesh(geoCylinder12, templeMaterials.glacialIce);
      rootMesh.scale.set(0.3, 1.6, 0.3);
      rootMesh.rotation.z = Math.PI / 2;
      rootMesh.position.y = 0.35;
      obstacle.add(rootMesh);
      break;
    }

    case 'crow': {
      // Arctic white snowy owl / storm raven (Slide under or lane change)
      const bird = new THREE.Mesh(geoSphere12, templeMaterials.snowCover);
      bird.scale.set(0.3, 0.2, 0.4);
      bird.position.y = 1.5;
      obstacle.add(bird);

      [-0.4, 0.4].forEach(x => {
        const wing = new THREE.Mesh(geoBox1, templeMaterials.iceTrim);
        wing.scale.set(0.5, 0.04, 0.25);
        wing.position.set(x, 1.55, 0);
        obstacle.add(wing);
      });
      break;
    }

    case 'destructible_vighna': {
      // Signature Destructible Frost Vighna (SMASHABLE ICE GOLEM!)
      const core = new THREE.Mesh(geoVighnaCore, templeMaterials.vighnaDark);
      core.position.y = 0.8;
      obstacle.add(core);

      const spikes = new THREE.Mesh(geoVighnaSpikes, templeMaterials.vighnaCore);
      spikes.position.y = 0.8;
      obstacle.add(spikes);
      break;
    }

    case 'final_vighna': {
      // 108th Final Boss Titan Frost Vighna!
      const boss = new THREE.Mesh(geoVighnaBoss, templeMaterials.vighnaDark);
      boss.position.y = 2.0;
      obstacle.add(boss);

      const ring = new THREE.Mesh(geoTorus12, templeMaterials.vighnaCore);
      ring.scale.set(2.4, 2.4, 0.2);
      ring.position.y = 2.0;
      obstacle.add(ring);
      break;
    }

    default:
      break;
  }

  return obstacle;
}

/**
 * Creates 3D Collectible meshes
 */
export function createTempleCollectibleMesh(type: TempleCollectibleType): THREE.Group {
  const item = new THREE.Group();
  item.name = `collectible_${type}`;

  switch (type) {
    case 'modak': {
      // Frost Modak (+100) - Golden sweet with crystalline frost sugar dusting
      const modak = new THREE.Mesh(geoSphere12, templeMaterials.gold);
      modak.scale.set(0.24, 0.32, 0.24);
      modak.position.y = 0.7;
      item.add(modak);

      const frostCap = new THREE.Mesh(geoSphere12, templeMaterials.iceTrim);
      frostCap.scale.set(0.18, 0.12, 0.18);
      frostCap.position.set(0, 0.82, 0);
      item.add(frostCap);
      break;
    }

    case 'golden_modak': {
      // Radiant Glacial Divine Modak (+500, Divine Mode!)
      const modak = new THREE.Mesh(geoSphere12, templeMaterials.divineGold);
      modak.scale.set(0.32, 0.42, 0.32);
      modak.position.y = 0.75;
      item.add(modak);

      const aura = new THREE.Mesh(geoSphere12, templeMaterials.auraGlow);
      aura.scale.set(0.48, 0.58, 0.48);
      aura.position.y = 0.75;
      item.add(aura);
      break;
    }

    case 'festival_coin': {
      // Golden Coin (+50)
      const coin = new THREE.Mesh(geoCylinder12, templeMaterials.gold);
      coin.scale.set(0.28, 0.06, 0.28);
      coin.rotation.x = Math.PI / 2;
      coin.position.y = 0.7;
      item.add(coin);
      break;
    }

    case 'lotus': {
      // Sacred Lotus (+150, combo boost)
      const lotus = new THREE.Mesh(geoSphere12, templeMaterials.lotusPink);
      lotus.scale.set(0.32, 0.22, 0.32);
      lotus.position.y = 0.65;
      item.add(lotus);
      break;
    }

    case 'flower_garland': {
      // Flower Garland (+200, 2X multiplier)
      const garland = new THREE.Mesh(geoTorus12, templeMaterials.marigold);
      garland.scale.set(0.35, 0.35, 0.08);
      garland.rotation.x = Math.PI / 3;
      garland.position.y = 0.75;
      item.add(garland);
      break;
    }
  }

  return item;
}
