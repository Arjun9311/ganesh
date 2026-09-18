import * as THREE from 'three';
import { ObstacleType, CollectibleType } from '@/types/game';
import {
  createRoadTexture,
  createWoodTexture,
  createSandstoneTexture,
  createTrainMetalTexture,
  createCorrugatedRoofTexture,
  createHazardStripeTexture,
  createSilkFabricTexture
} from './textureGenerator';

// High-fidelity procedural PBR materials
export const materials = {
  // Ganesha Character Materials
  ganeshaSkin: new THREE.MeshStandardMaterial({
    color: 0xF5CBA7,
    roughness: 0.42,
    metalness: 0.05
  }),
  dhotiSaffron: new THREE.MeshStandardMaterial({
    map: createSilkFabricTexture(),
    roughness: 0.55,
    metalness: 0.12
  }),
  goldCrown: new THREE.MeshStandardMaterial({
    color: 0xFFD700,
    metalness: 0.95,
    roughness: 0.15
  }),
  goldJewels: new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    metalness: 0.92,
    roughness: 0.18
  }),
  whiteTusk: new THREE.MeshStandardMaterial({
    color: 0xFFFFF5,
    roughness: 0.22,
    metalness: 0.04
  }),
  gemRuby: new THREE.MeshPhysicalMaterial({
    color: 0xDC2626,
    emissive: 0x7F1D1D,
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  }),
  gemEmerald: new THREE.MeshPhysicalMaterial({
    color: 0x059669,
    emissive: 0x064E3B,
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  }),
  eyesBlack: new THREE.MeshStandardMaterial({
    color: 0x0A0A0A,
    roughness: 0.1,
    metalness: 0.8
  }),
  eyesWhite: new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.2,
    metalness: 0.05
  }),
  tilakRed: new THREE.MeshStandardMaterial({
    color: 0xE11D48,
    roughness: 0.35,
    metalness: 0.1
  }),
  innerEarPink: new THREE.MeshStandardMaterial({
    color: 0xFCA5A5,
    roughness: 0.45,
    metalness: 0.05
  }),
  eyesIris: new THREE.MeshStandardMaterial({
    color: 0xB45309,
    roughness: 0.18,
    metalness: 0.25
  }),
  tilakYellow: new THREE.MeshStandardMaterial({
    color: 0xFBBF24,
    roughness: 0.35,
    metalness: 0.08
  }),
  scarfSilk: new THREE.MeshStandardMaterial({
    color: 0xBE185D,
    roughness: 0.42,
    metalness: 0.16
  }),
  prabhavaliHalo: new THREE.MeshStandardMaterial({
    color: 0xFFD700,
    emissive: 0xF59E0B,
    emissiveIntensity: 0.48,
    roughness: 0.18,
    metalness: 0.85,
    transparent: true,
    opacity: 0.92
  }),

  // Collectibles Materials
  modakSaffron: new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    roughness: 0.28,
    metalness: 0.08,
    emissive: 0xD97706,
    emissiveIntensity: 0.35
  }),
  modakGold: new THREE.MeshStandardMaterial({
    color: 0xFFD700,
    roughness: 0.12,
    metalness: 0.95,
    emissive: 0xF59E0B,
    emissiveIntensity: 0.55
  }),
  lotusPink: new THREE.MeshStandardMaterial({
    color: 0xFB7185,
    roughness: 0.35,
    metalness: 0.08,
    emissive: 0xF43F5E,
    emissiveIntensity: 0.2
  }),
  marigoldOrange: new THREE.MeshStandardMaterial({
    color: 0xF97316,
    roughness: 0.4,
    metalness: 0.05
  }),
  diyaClay: new THREE.MeshStandardMaterial({
    color: 0x9A3412,
    roughness: 0.75,
    metalness: 0.05
  }),
  diyaFlame: new THREE.MeshBasicMaterial({
    color: 0xFDE047
  }),

  // Obstacles & Construction Materials
  woodObstacle: new THREE.MeshStandardMaterial({
    map: createWoodTexture(180, 105, 30),
    roughness: 0.65,
    metalness: 0.06
  }),
  ironBracket: new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.35,
    metalness: 0.85
  }),
  stoneObstacle: new THREE.MeshStandardMaterial({
    map: createSandstoneTexture(false),
    roughness: 0.7,
    metalness: 0.05
  }),
  hazardStriped: new THREE.MeshStandardMaterial({
    map: createHazardStripeTexture(),
    roughness: 0.35,
    metalness: 0.1
  }),
  hazardDark: new THREE.MeshStandardMaterial({
    color: 0x0F172A,
    roughness: 0.4,
    metalness: 0.2
  }),
  slideArrow: new THREE.MeshStandardMaterial({
    color: 0xFEF08A,
    emissive: 0xEAB308,
    emissiveIntensity: 0.85,
    roughness: 0.2
  }),
  rampChevron: new THREE.MeshStandardMaterial({
    color: 0x4ADE80,
    emissive: 0x22C55E,
    emissiveIntensity: 0.8,
    roughness: 0.2
  }),

  // Train & Wagon Materials
  trainRed: new THREE.MeshStandardMaterial({
    map: createTrainMetalTexture('#B91C1C'),
    roughness: 0.32,
    metalness: 0.55
  }),
  trainGold: new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    metalness: 0.92,
    roughness: 0.16
  }),
  trainRoof: new THREE.MeshStandardMaterial({
    map: createCorrugatedRoofTexture(),
    roughness: 0.6,
    metalness: 0.55
  }),
  trainRoofTrim: new THREE.MeshStandardMaterial({
    color: 0xFACC15,
    emissive: 0xCA8A04,
    emissiveIntensity: 0.35,
    roughness: 0.2
  }),
  trainWindowLit: new THREE.MeshPhysicalMaterial({
    color: 0xFEF08A,
    emissive: 0xF59E0B,
    emissiveIntensity: 0.75,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85
  }),
  trainSteelWheel: new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.92,
    roughness: 0.25
  }),
  lanternLight: new THREE.MeshBasicMaterial({
    color: 0xFFFBEB
  }),

  // Power-up Materials
  powerCyan: new THREE.MeshStandardMaterial({
    color: 0x06B6D4,
    emissive: 0x0891B2,
    emissiveIntensity: 0.65,
    metalness: 0.7,
    roughness: 0.2
  }),
  powerPurple: new THREE.MeshStandardMaterial({
    color: 0xA855F7,
    emissive: 0x7E22CE,
    emissiveIntensity: 0.65,
    metalness: 0.7,
    roughness: 0.2
  }),
  jetpackFlame: new THREE.MeshBasicMaterial({
    color: 0xF97316
  }),
  divineAura: new THREE.MeshBasicMaterial({
    color: 0xFFD700,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide
  })
};

/**
 * Creates the realistic, captivating sculpted 3D Ganesha character
 * Designed with authentic Bal/Hero Ganesha divine anatomy:
 * - Natural cranial Kumbha lobes, almond amber eyes, and curved Vakratunda trunk holding Modak
 * - Ekadanta tradition (full right tusk, broken left tusk with golden cap)
 * - Multi-tiered Kiritamukuta crown with rubies and emeralds
 * - Radiant golden Prabhavali sunburst halo
 * - Flowing silk Uttariya scarf with dynamic wind tails
 * - Saffron brocade dhoti with gold Zari pleats (Patka) and royal Kamarbandh
 * - Four divine arms: Lotus, Ankusha, Modak bowl, and Abhaya Mudra blessing
 * - Compact, lane-proportional scale (~1.9m tall, 0.75m wide) ensuring wide-open view of tracks
 */
export function createGaneshaCharacter(): THREE.Group {
  const ganesha = new THREE.Group();

  // Root pivot group (used for running bob and sliding squash)
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'bodyGroup';
  ganesha.add(bodyGroup);

  // ---------------------------------------------------------
  // 1. Torso / Belly (Cute & Divine Lambodara Anatomy)
  // ---------------------------------------------------------
  const bellyGeo = new THREE.SphereGeometry(0.35, 24, 20);
  bellyGeo.scale(1.0, 1.08, 0.96);
  const belly = new THREE.Mesh(bellyGeo, materials.ganeshaSkin);
  belly.position.y = 0.72;
  belly.castShadow = true;
  belly.receiveShadow = true;
  bodyGroup.add(belly);

  // Dhoti wrap with rich silk brocade texture
  const dhotiGeo = new THREE.CylinderGeometry(0.36, 0.33, 0.42, 24);
  const dhoti = new THREE.Mesh(dhotiGeo, materials.dhotiSaffron);
  dhoti.position.y = 0.52;
  dhoti.castShadow = true;
  dhoti.receiveShadow = true;
  bodyGroup.add(dhoti);

  // Flowing pleated front fabric (Patka) cascading between legs
  const patkaGeo = new THREE.BoxGeometry(0.14, 0.38, 0.05);
  const patka = new THREE.Mesh(patkaGeo, materials.goldJewels);
  patka.position.set(0, 0.44, 0.33);
  patka.rotation.x = 0.12;
  patka.castShadow = true;
  bodyGroup.add(patka);

  // Golden waist belt (Kamarbandh)
  const beltGeo = new THREE.TorusGeometry(0.36, 0.032, 12, 28);
  beltGeo.rotateX(Math.PI / 2);
  const belt = new THREE.Mesh(beltGeo, materials.goldCrown);
  belt.position.y = 0.68;
  belt.castShadow = true;
  bodyGroup.add(belt);

  // Royal belt pendant with center ruby jewel
  const beltMedallion = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), materials.goldCrown);
  beltMedallion.rotation.x = Math.PI / 2;
  beltMedallion.position.set(0, 0.63, 0.37);
  const beltRuby = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), materials.gemRuby);
  beltRuby.position.set(0, 0.63, 0.39);
  bodyGroup.add(beltMedallion, beltRuby);

  // Sacred Yajnopavita (Janeu thread) running diagonally from left shoulder to right waist
  const janeuGeo = new THREE.TorusGeometry(0.38, 0.012, 8, 28);
  janeuGeo.rotateY(Math.PI / 4.2);
  janeuGeo.rotateZ(Math.PI / 3.2);
  const janeu = new THREE.Mesh(janeuGeo, materials.goldCrown);
  janeu.position.set(0.02, 0.75, 0.06);
  bodyGroup.add(janeu);

  // Royal Golden Haar (Necklace) draped over chest
  const necklaceGeo = new THREE.TorusGeometry(0.26, 0.024, 10, 24);
  necklaceGeo.rotateX(Math.PI / 2.3);
  const necklace = new THREE.Mesh(necklaceGeo, materials.goldCrown);
  necklace.position.set(0, 0.96, 0.20);
  necklace.castShadow = true;
  bodyGroup.add(necklace);

  // Center Ruby Locket
  const locket = new THREE.Mesh(new THREE.SphereGeometry(0.046, 12, 12), materials.gemRuby);
  locket.position.set(0, 0.86, 0.36);
  bodyGroup.add(locket);

  // ---------------------------------------------------------
  // 2. Elephant Head & Realistic Divine Facial Features
  // ---------------------------------------------------------
  const headGeo = new THREE.SphereGeometry(0.32, 24, 20);
  headGeo.scale(1.0, 1.04, 0.95);
  const head = new THREE.Mesh(headGeo, materials.ganeshaSkin);
  head.position.set(0, 1.18, 0.04);
  head.castShadow = true;
  head.receiveShadow = true;
  bodyGroup.add(head);

  // Frontal Cranial Lobes (Kumbha - authentic Vedic elephant head anatomy)
  [-0.10, 0.10].forEach(x => {
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), materials.ganeshaSkin);
    lobe.position.set(x, 1.34, 0.18);
    lobe.castShadow = true;
    bodyGroup.add(lobe);
  });

  // Sacred Tilak: Sandalwood yellow crescent + Vermilion center Trishul mark
  const tilakYel = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.012, 8, 16, Math.PI), materials.tilakYellow);
  tilakYel.rotation.z = Math.PI;
  tilakYel.position.set(0, 1.34, 0.33);
  const tilakRed = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.11, 0.015), materials.tilakRed);
  tilakRed.position.set(0, 1.32, 0.34);
  bodyGroup.add(tilakYel, tilakRed);

  // Expressive Loving Almond Eyes (with amber iris & catchlights)
  [-0.12, 0.12].forEach(x => {
    const eyeWhiteGeo = new THREE.SphereGeometry(0.046, 12, 10);
    eyeWhiteGeo.scale(1, 1.25, 0.45);
    const eyeWhite = new THREE.Mesh(eyeWhiteGeo, materials.eyesWhite);
    eyeWhite.position.set(x, 1.23, 0.31);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), materials.eyesIris);
    iris.position.set(x, 1.23, 0.33);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), materials.eyesBlack);
    pupil.position.set(x, 1.23, 0.342);

    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.007, 6, 6), materials.eyesWhite);
    glint.position.set(x + (x > 0 ? 0.008 : -0.008), 1.238, 0.35);

    bodyGroup.add(eyeWhite, iris, pupil, glint);
  });

  // Authentic Ivory Tusks (Ekadanta tradition)
  // Right tusk: full, tapering curved ivory tusk with golden band
  const rightTuskGeo = new THREE.ConeGeometry(0.028, 0.14, 12);
  rightTuskGeo.rotateX(-Math.PI / 2);
  const rightTusk = new THREE.Mesh(rightTuskGeo, materials.whiteTusk);
  rightTusk.position.set(-0.11, 1.05, 0.29);
  rightTusk.rotation.y = -0.18;
  rightTusk.castShadow = true;
  const tuskBand = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.008, 8, 14), materials.goldCrown);
  tuskBand.position.set(-0.11, 1.05, 0.32);
  bodyGroup.add(rightTusk, tuskBand);

  // Left tusk: broken tusk (Ekadanta) capped with sacred golden finial
  const brokenTusk = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.028, 0.05, 12), materials.whiteTusk);
  brokenTusk.rotation.x = Math.PI / 2.2;
  brokenTusk.position.set(0.11, 1.05, 0.28);
  brokenTusk.castShadow = true;
  const brokenTuskCap = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), materials.goldCrown);
  brokenTuskCap.position.set(0.11, 1.05, 0.31);
  bodyGroup.add(brokenTusk, brokenTuskCap);

  // Gracefully Curved Elephant Trunk (Vakratunda)
  const trunkGroup = new THREE.Group();
  trunkGroup.name = 'trunk';

  // Trunk Base (descending from between eyes)
  const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.22, 16), materials.ganeshaSkin);
  tBase.rotation.x = 0.38;
  tBase.position.set(0, 1.08, 0.26);
  tBase.castShadow = true;
  trunkGroup.add(tBase);

  // Trunk Mid (curving forward & left)
  const tMid = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.09, 0.22, 16), materials.ganeshaSkin);
  tMid.rotation.set(0.72, 0, -0.15);
  tMid.position.set(0.02, 0.93, 0.35);
  tMid.castShadow = true;
  trunkGroup.add(tMid);

  // Trunk Lower Curve (curling left & up)
  const tLow = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.068, 0.18, 16), materials.ganeshaSkin);
  tLow.rotation.set(1.1, 0, -0.35);
  tLow.position.set(0.05, 0.83, 0.38);
  tLow.castShadow = true;
  trunkGroup.add(tLow);

  // Trunk Tip (curled up to cradle sweet Modak)
  const tTip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 14), materials.ganeshaSkin);
  tTip.position.set(0.08, 0.86, 0.41);
  tTip.castShadow = true;
  trunkGroup.add(tTip);

  // Sacred Golden Modak in Trunk tip
  const trunkModak = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.095, 14), materials.modakSaffron);
  trunkModak.position.set(0.09, 0.92, 0.42);
  trunkModak.castShadow = true;
  trunkGroup.add(trunkModak);
  bodyGroup.add(trunkGroup);

  // Realistic Fan-shaped Elephant Ears (Supakarna with Rosy Inlay)
  const earGeo = new THREE.CylinderGeometry(0.24, 0.21, 0.03, 24);
  earGeo.rotateZ(Math.PI / 2);
  const innerEarGeo = new THREE.CylinderGeometry(0.18, 0.15, 0.035, 20);
  innerEarGeo.rotateZ(Math.PI / 2);

  const leftEar = new THREE.Mesh(earGeo, materials.ganeshaSkin);
  leftEar.name = 'leftEar';
  leftEar.position.set(-0.35, 1.20, 0);
  leftEar.rotation.y = 0.22;
  leftEar.castShadow = true;
  const leftInner = new THREE.Mesh(innerEarGeo, materials.innerEarPink);
  leftInner.position.set(0, 0.005, 0.005);
  leftEar.add(leftInner);
  bodyGroup.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, materials.ganeshaSkin);
  rightEar.name = 'rightEar';
  rightEar.position.set(0.35, 1.20, 0);
  rightEar.rotation.y = -0.22;
  rightEar.castShadow = true;
  const rightInner = new THREE.Mesh(innerEarGeo, materials.innerEarPink);
  rightInner.position.set(0, 0.005, 0.005);
  rightEar.add(rightInner);
  bodyGroup.add(rightEar);

  // Golden Kundala / Jhumka earrings hanging from earlobes
  [-0.41, 0.41].forEach(x => {
    const earringRing = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 16), materials.goldCrown);
    earringRing.position.set(x, 1.04, 0.02);
    const earringDrop = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), materials.gemRuby);
    earringDrop.position.set(x, 0.99, 0.02);
    bodyGroup.add(earringRing, earringDrop);
  });

  // ---------------------------------------------------------
  // 3. Royal Kiritamukuta (Golden Crown with Gemstones)
  // ---------------------------------------------------------
  const crownGroup = new THREE.Group();

  // Tier 1: Embossed base cylinder
  const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.31, 0.14, 24), materials.goldCrown);
  crownBase.position.set(0, 1.45, 0.04);
  crownBase.castShadow = true;
  crownGroup.add(crownBase);

  // Filigree gold rim
  const filigree = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.018, 8, 24), materials.goldJewels);
  filigree.rotateX(Math.PI / 2);
  filigree.position.set(0, 1.42, 0.04);
  crownGroup.add(filigree);

  // Tier 2: Mid stepped spire
  const crownMid = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.15, 20), materials.goldCrown);
  crownMid.position.set(0, 1.57, 0.04);
  crownMid.castShadow = true;
  crownGroup.add(crownMid);

  // Tier 3: Upper cone spire
  const crownTop = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.26, 20), materials.goldCrown);
  crownTop.position.set(0, 1.74, 0.04);
  crownTop.castShadow = true;
  crownGroup.add(crownTop);

  // Kalash Finial Tip
  const finialBall = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), materials.goldCrown);
  finialBall.position.set(0, 1.90, 0.04);
  const finialTip = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.06, 10), materials.goldCrown);
  finialTip.position.set(0, 1.94, 0.04);
  crownGroup.add(finialBall, finialTip);

  // Center Ruby on Crown
  const crownRuby = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 12), materials.gemRuby);
  crownRuby.position.set(0, 1.48, 0.30);
  crownGroup.add(crownRuby);

  // Flanking Emerald gems
  [-0.16, 0.16].forEach(x => {
    const emerald = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 10), materials.gemEmerald);
    emerald.position.set(x, 1.48, 0.26);
    crownGroup.add(emerald);
  });
  bodyGroup.add(crownGroup);

  // ---------------------------------------------------------
  // 4. Divine Prabhavali (Radiant Golden Halo)
  // ---------------------------------------------------------
  const prabhavaliGroup = new THREE.Group();
  prabhavaliGroup.name = 'prabhavali';
  prabhavaliGroup.position.set(0, 1.24, -0.12);

  // Golden halo ring
  const haloRing = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.022, 10, 32), materials.goldCrown);
  // Radiant glow circle
  const haloDisc = new THREE.Mesh(new THREE.CircleGeometry(0.36, 24), materials.prabhavaliHalo);
  prabhavaliGroup.add(haloRing, haloDisc);

  // 8 Sunbeam ray spikes radiating outward
  for (let i = 0; i < 8; i++) {
    const rayAngle = (i / 8) * Math.PI * 2;
    const ray = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.14, 8), materials.goldCrown);
    ray.position.set(Math.cos(rayAngle) * 0.44, Math.sin(rayAngle) * 0.44, 0);
    ray.rotation.z = rayAngle - Math.PI / 2;
    prabhavaliGroup.add(ray);
  }
  bodyGroup.add(prabhavaliGroup);

  // ---------------------------------------------------------
  // 5. Flowing Silk Uttariya (Scarf / Dupatta)
  // ---------------------------------------------------------
  const scarfDrape = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.032, 8, 20, Math.PI), materials.scarfSilk);
  scarfDrape.position.set(0, 0.94, -0.04);
  scarfDrape.rotation.x = Math.PI / 2.2;
  bodyGroup.add(scarfDrape);

  // Flowing trailing scarf tails (animated in running wind)
  const scarfLeftGeo = new THREE.BoxGeometry(0.07, 0.32, 0.018);
  const scarfLeft = new THREE.Mesh(scarfLeftGeo, materials.scarfSilk);
  scarfLeft.name = 'scarfLeft';
  scarfLeft.position.set(-0.27, 0.82, -0.14);
  scarfLeft.rotation.set(-0.35, 0.15, -0.2);
  scarfLeft.castShadow = true;
  bodyGroup.add(scarfLeft);

  const scarfRightGeo = new THREE.BoxGeometry(0.07, 0.32, 0.018);
  const scarfRight = new THREE.Mesh(scarfRightGeo, materials.scarfSilk);
  scarfRight.name = 'scarfRight';
  scarfRight.position.set(0.27, 0.82, -0.14);
  scarfRight.rotation.set(-0.35, -0.15, 0.2);
  scarfRight.castShadow = true;
  bodyGroup.add(scarfRight);

  // ---------------------------------------------------------
  // 6. Four Divine Arms (Chaturbhuja)
  // ---------------------------------------------------------
  // Upper-Left Arm: Holds blooming sacred pink Lotus (Padma)
  const upArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.068, 0.32, 12), materials.ganeshaSkin);
  upArmL.position.set(-0.32, 0.96, 0.05);
  upArmL.rotation.set(-0.5, 0, 0.6);
  upArmL.castShadow = true;
  const lotusStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8), materials.goldCrown);
  lotusStem.position.set(-0.42, 1.10, 0.12);
  const lotusFlower = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), materials.lotusPink);
  lotusFlower.scale.set(1.0, 1.3, 1.0);
  lotusFlower.position.set(-0.42, 1.20, 0.12);
  bodyGroup.add(upArmL, lotusStem, lotusFlower);

  // Upper-Right Arm: Holds golden Ankusha (elephant goad of wisdom)
  const upArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.068, 0.32, 12), materials.ganeshaSkin);
  upArmR.position.set(0.32, 0.96, 0.05);
  upArmR.rotation.set(-0.5, 0, -0.6);
  upArmR.castShadow = true;
  const ankushaShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8), materials.goldCrown);
  ankushaShaft.position.set(0.42, 1.10, 0.12);
  const ankushaHook = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.01, 8, 14, Math.PI * 1.2), materials.goldCrown);
  ankushaHook.position.set(0.42, 1.22, 0.12);
  ankushaHook.rotation.y = Math.PI / 2;
  bodyGroup.add(upArmR, ankushaShaft, ankushaHook);

  // Lower-Left Arm: Holds bowl of holy Modaks
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.068, 0.32, 12), materials.ganeshaSkin);
  leftArm.name = 'leftArm';
  leftArm.position.set(-0.35, 0.78, 0.14);
  leftArm.rotation.set(0.55, 0, 0.42);
  leftArm.castShadow = true;
  const modakBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.04, 0.05, 14), materials.goldCrown);
  modakBowl.position.set(-0.41, 0.88, 0.28);
  const bowlModak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.09, 12), materials.modakSaffron);
  bowlModak.position.set(-0.41, 0.94, 0.28);
  bodyGroup.add(leftArm, modakBowl, bowlModak);

  // Lower-Right Arm: Abhaya Mudra (blessing of fearlessness & protection)
  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.068, 0.32, 12), materials.ganeshaSkin);
  rightArm.name = 'rightArm';
  rightArm.position.set(0.35, 0.78, 0.14);
  rightArm.rotation.set(-0.35, 0, -0.38);
  rightArm.castShadow = true;
  const blessingPalm = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.09, 0.024), materials.ganeshaSkin);
  blessingPalm.position.set(0.42, 0.92, 0.24);
  blessingPalm.rotation.set(0.1, 0.2, 0);
  bodyGroup.add(rightArm, blessingPalm);

  // Golden Bajuband (Armlets with ruby centers) on all 4 arms
  [-0.32, 0.32].forEach(x => {
    const armlet = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.014, 8, 16), materials.goldCrown);
    armlet.position.set(x, 0.98, 0.06);
    const armletRuby = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), materials.gemRuby);
    armletRuby.position.set(x > 0 ? x + 0.065 : x - 0.065, 0.98, 0.06);
    bodyGroup.add(armlet, armletRuby);
  });

  // ---------------------------------------------------------
  // 7. Legs & Feet (Sculpted with Golden Anklets / Payal)
  // ---------------------------------------------------------
  const leftLeg = new THREE.Group();
  leftLeg.name = 'leftLeg';
  leftLeg.position.set(-0.17, 0.44, 0);
  const lThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.085, 0.32, 14), materials.dhotiSaffron);
  lThigh.position.y = -0.14;
  lThigh.castShadow = true;
  const lFoot = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.075, 0.18), materials.ganeshaSkin);
  lFoot.position.set(0, -0.32, 0.04);
  lFoot.castShadow = true;
  const lAnklet = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.012, 8, 14), materials.goldCrown);
  lAnklet.rotateX(Math.PI / 2);
  lAnklet.position.set(0, -0.28, 0.02);
  leftLeg.add(lThigh, lFoot, lAnklet);
  bodyGroup.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.name = 'rightLeg';
  rightLeg.position.set(0.17, 0.44, 0);
  const rThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.085, 0.32, 14), materials.dhotiSaffron);
  rThigh.position.y = -0.14;
  rThigh.castShadow = true;
  const rFoot = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.075, 0.18), materials.ganeshaSkin);
  rFoot.position.set(0, -0.32, 0.04);
  rFoot.castShadow = true;
  const rAnklet = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.012, 8, 14), materials.goldCrown);
  rAnklet.rotateX(Math.PI / 2);
  rAnklet.position.set(0, -0.28, 0.02);
  rightLeg.add(rThigh, rFoot, rAnklet);
  bodyGroup.add(rightLeg);

  // ---------------------------------------------------------
  // 8. Divine Aura Glow (Active during Divine Shield Mode)
  // ---------------------------------------------------------
  const auraGeo = new THREE.SphereGeometry(1.15, 20, 20);
  const auraMesh = new THREE.Mesh(auraGeo, materials.divineAura);
  auraMesh.name = 'divineAuraMesh';
  auraMesh.position.y = 0.95;
  auraMesh.visible = false;
  ganesha.add(auraMesh);

  return ganesha;
}

/**
 * Creates Mushika the companion
 */
export function createMushika(): THREE.Group {
  const mushika = new THREE.Group();

  const bodyGeo = new THREE.SphereGeometry(0.18, 14, 14);
  bodyGeo.scale(1, 0.8, 1.4);
  const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.5 }));
  body.position.y = 0.15;
  body.castShadow = true;
  mushika.add(body);

  const headGeo = new THREE.ConeGeometry(0.10, 0.22, 12);
  headGeo.rotateX(Math.PI / 2);
  const head = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.5 }));
  head.position.set(0, 0.15, 0.24);
  mushika.add(head);

  [-0.08, 0.08].forEach(x => {
    const earGeo = new THREE.CircleGeometry(0.07, 12);
    const ear = new THREE.Mesh(earGeo, new THREE.MeshStandardMaterial({ color: 0xFCA5A5, roughness: 0.4 }));
    ear.position.set(x, 0.28, 0.14);
    ear.rotation.y = x > 0 ? -0.2 : 0.2;
    mushika.add(ear);
  });

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.018, 8, 16), materials.goldCrown);
  collar.position.set(0, 0.17, 0.14);
  collar.rotation.x = Math.PI / 2;
  mushika.add(collar);

  // Tiny golden bell on collar
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), materials.goldJewels);
  bell.position.set(0, 0.14, 0.24);
  mushika.add(bell);

  // Tail
  const tailGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.24, 8);
  tailGeo.rotateX(Math.PI / 3);
  const tail = new THREE.Mesh(tailGeo, new THREE.MeshStandardMaterial({ color: 0x64748B }));
  tail.position.set(0, 0.18, -0.22);
  mushika.add(tail);

  return mushika;
}

/**
 * Creates Collectible mesh (Modak, Golden Modak, Lotus, etc.)
 */
export function createCollectibleMesh(type: CollectibleType): THREE.Group {
  const group = new THREE.Group();

  if (type === 'modak' || type === 'golden_modak') {
    const isGold = type === 'golden_modak';
    const mat = isGold ? materials.modakGold : materials.modakSaffron;
    const scale = isGold ? 1.3 : 1.0;

    // Conical pleated dumpling top
    const coneGeo = new THREE.ConeGeometry(0.28 * scale, 0.45 * scale, 18);
    const cone = new THREE.Mesh(coneGeo, mat);
    cone.position.y = 0.25 * scale;
    cone.castShadow = true;
    group.add(cone);

    // Rounded dumpling base
    const baseGeo = new THREE.SphereGeometry(0.28 * scale, 18, 14);
    baseGeo.scale(1, 0.55, 1);
    const base = new THREE.Mesh(baseGeo, mat);
    base.position.y = 0.1 * scale;
    base.castShadow = true;
    group.add(base);

    // Radiating halo ring
    const ringGeo = new THREE.RingGeometry(0.35 * scale, 0.42 * scale, 24);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isGold ? 0xFFE57F : 0xFFA500,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.name = 'haloRing';
    ring.position.y = 0.25 * scale;
    group.add(ring);
  } else if (type === 'lotus') {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const petalGeo = new THREE.SphereGeometry(0.18, 10, 10);
      petalGeo.scale(0.5, 0.2, 1.2);
      const petal = new THREE.Mesh(petalGeo, materials.lotusPink);
      petal.position.set(Math.cos(angle) * 0.16, 0.1, Math.sin(angle) * 0.16);
      petal.rotation.y = -angle;
      petal.rotation.x = 0.3;
      petal.castShadow = true;
      group.add(petal);
    }
    const centerGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.12, 14);
    const center = new THREE.Mesh(centerGeo, materials.goldCrown);
    center.position.y = 0.12;
    group.add(center);
  } else if (type === 'diya') {
    const bowlGeo = new THREE.CylinderGeometry(0.3, 0.15, 0.15, 16);
    const bowl = new THREE.Mesh(bowlGeo, materials.diyaClay);
    bowl.position.y = 0.1;
    bowl.castShadow = true;
    group.add(bowl);

    const flameGeo = new THREE.ConeGeometry(0.09, 0.24, 10);
    const flame = new THREE.Mesh(flameGeo, materials.diyaFlame);
    flame.position.set(0, 0.28, 0);
    group.add(flame);
  } else if (type === 'mushika_powerup') {
    const iconGroup = createMushika();
    iconGroup.scale.set(1.4, 1.4, 1.4);
    group.add(iconGroup);
  } else if (type === 'jetpack') {
    const jetGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.55, 14);
    const tankL = new THREE.Mesh(jetGeo, materials.goldCrown);
    tankL.position.set(-0.2, 0.3, 0);
    const tankR = new THREE.Mesh(jetGeo, materials.goldCrown);
    tankR.position.set(0.2, 0.3, 0);

    const flameCone = new THREE.ConeGeometry(0.08, 0.22, 10);
    flameCone.rotateX(Math.PI);
    const flameL = new THREE.Mesh(flameCone, materials.jetpackFlame);
    flameL.position.set(-0.2, 0.05, 0);
    const flameR = new THREE.Mesh(flameCone, materials.jetpackFlame);
    flameR.position.set(0.2, 0.05, 0);

    const wingGeo = new THREE.BoxGeometry(0.35, 0.08, 0.04);
    const wingL = new THREE.Mesh(wingGeo, materials.trainGold);
    wingL.position.set(-0.35, 0.38, 0);
    wingL.rotation.z = 0.3;
    const wingR = new THREE.Mesh(wingGeo, materials.trainGold);
    wingR.position.set(0.35, 0.38, 0);
    wingR.rotation.z = -0.3;

    group.add(tankL, tankR, flameL, flameR, wingL, wingR);
  } else if (type === 'super_sneakers') {
    const shoeBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.5), materials.trainGold);
    shoeBase.position.y = 0.35;
    const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.25, 12), materials.powerCyan);
    spring.position.y = 0.18;
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.02), materials.whiteTusk);
    wingL.position.set(-0.2, 0.4, 0);
    wingL.rotation.z = 0.4;
    group.add(shoeBase, spring, wingL);
  } else if (type === 'hoverboard') {
    const boardGeo = new THREE.BoxGeometry(0.55, 0.08, 1.2);
    const board = new THREE.Mesh(boardGeo, materials.trainGold);
    board.position.y = 0.25;
    const glow = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, 1.1), materials.powerCyan);
    glow.position.y = 0.2;
    group.add(board, glow);
  } else if (type === 'multiplier_2x') {
    const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.3), materials.powerPurple);
    diamond.position.y = 0.35;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.03, 8, 20), materials.goldCrown);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.35;
    group.add(diamond, ring);
  } else {
    const torusGeo = new THREE.TorusGeometry(0.3, 0.08, 10, 20);
    const torus = new THREE.Mesh(torusGeo, materials.marigoldOrange);
    torus.position.y = 0.25;
    group.add(torus);
  }

  return group;
}

/**
 * Creates Realistic 3D Obstacles (Hurdles, Barriers, Festival Rath Trains)
 */
export function createObstacleMesh(type: ObstacleType): THREE.Group {
  const group = new THREE.Group();

  if (type === 'hurdle_low' || type === 'wooden_barrier') {
    // 1. Realistic Low Hurdle (Height: 0.85m - JUMP OVER)
    const postGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.85, 14);
    const leftPost = new THREE.Mesh(postGeo, materials.woodObstacle);
    leftPost.position.set(-0.85, 0.425, 0);
    leftPost.castShadow = true;
    leftPost.receiveShadow = true;

    const rightPost = new THREE.Mesh(postGeo, materials.woodObstacle);
    rightPost.position.set(0.85, 0.425, 0);
    rightPost.castShadow = true;
    rightPost.receiveShadow = true;

    // Iron base mounting plates on track
    [-0.85, 0.85].forEach(x => {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.28), materials.ironBracket);
      plate.position.set(x, 0.02, 0);
      group.add(plate);
    });

    // High-visibility hazard striped main crossbar
    const barGeo = new THREE.BoxGeometry(1.85, 0.24, 0.14);
    const bar = new THREE.Mesh(barGeo, materials.hazardStriped);
    bar.position.set(0, 0.72, 0);
    bar.castShadow = true;
    bar.receiveShadow = true;

    // Forged iron corner brackets
    [-0.85, 0.85].forEach(x => {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.16), materials.ironBracket);
      bracket.position.set(x, 0.72, 0);
      group.add(bracket);
    });

    // Golden brass finials on top of posts
    const finialGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const leftFinial = new THREE.Mesh(finialGeo, materials.trainGold);
    leftFinial.position.set(-0.85, 0.9, 0);
    const rightFinial = new THREE.Mesh(finialGeo, materials.trainGold);
    rightFinial.position.set(0.85, 0.9, 0);

    // Glowing JUMP indicator chevron in center
    const jumpArrow = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 4), materials.slideArrow);
    jumpArrow.position.set(0, 0.98, 0.08);

    group.add(leftPost, rightPost, bar, leftFinial, rightFinial, jumpArrow);
  } else if (type === 'barrier_high') {
    // 2. Realistic Overhead Barrier / Toran (Clearance under: 0.95m - SLIDE UNDER)
    const pillarGeo = new THREE.CylinderGeometry(0.12, 0.16, 2.8, 16);
    const leftPillar = new THREE.Mesh(pillarGeo, materials.woodObstacle);
    leftPillar.position.set(-0.95, 1.4, 0);
    leftPillar.castShadow = true;

    const rightPillar = new THREE.Mesh(pillarGeo, materials.woodObstacle);
    rightPillar.position.set(0.95, 1.4, 0);
    rightPillar.castShadow = true;

    // High overhead barricade plate
    const plateGeo = new THREE.BoxGeometry(2.0, 1.6, 0.14);
    const plate = new THREE.Mesh(plateGeo, materials.trainRed);
    plate.position.set(0, 1.9, 0);
    plate.castShadow = true;
    plate.receiveShadow = true;

    // Gold trim around plate
    const trimTop = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 0.18), materials.trainGold);
    trimTop.position.set(0, 2.7, 0);
    const trimBottom = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 0.18), materials.trainGold);
    trimBottom.position.set(0, 1.1, 0);

    // Hanging Toran garlands along the bottom slide clearance line
    for (let g = -3; g <= 3; g++) {
      const drop = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 8), materials.marigoldOrange);
      drop.rotation.x = Math.PI;
      drop.position.set(g * 0.28, 0.98, 0);
      group.add(drop);
    }

    // Glowing downward arrows indicating SLIDE UNDER
    [-0.45, 0.45].forEach(x => {
      const downArrow = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.32, 4), materials.slideArrow);
      downArrow.rotation.x = Math.PI;
      downArrow.position.set(x, 1.7, 0.08);
      group.add(downArrow);
    });

    group.add(leftPillar, rightPillar, plate, trimTop, trimBottom);
  } else if (type === 'rath_wagon') {
    // 3. Realistic Festival Train / Rath Wagon (Length: 7.0m, Width: 2.0m, Height: 2.2m)
    // Run on TOP of this wagon!
    const wagonBodyGeo = new THREE.BoxGeometry(2.0, 2.0, 7.0);
    const wagonBody = new THREE.Mesh(wagonBodyGeo, materials.trainRed);
    wagonBody.position.set(0, 1.1, 0);
    wagonBody.castShadow = true;
    wagonBody.receiveShadow = true;

    // Corrugated anti-slip metal roof walkway (at y = 2.16m)
    const roofGeo = new THREE.BoxGeometry(2.08, 0.12, 7.08);
    const roof = new THREE.Mesh(roofGeo, materials.trainRoof);
    roof.position.set(0, 2.16, 0);
    roof.name = 'roofWalkway';
    roof.castShadow = true;
    roof.receiveShadow = true;

    // Yellow safety perimeter warning borders
    const roofBorderL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 7.08), materials.trainRoofTrim);
    roofBorderL.position.set(-1.02, 2.17, 0);
    const roofBorderR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 7.08), materials.trainRoofTrim);
    roofBorderR.position.set(1.02, 2.17, 0);

    // Warm glowing passenger windows along both sides of wagon
    const windowGeo = new THREE.BoxGeometry(0.04, 0.6, 1.1);
    for (let w = -2; w <= 2; w++) {
      const wz = w * 1.35;
      const winL = new THREE.Mesh(windowGeo, materials.trainWindowLit);
      winL.position.set(-1.01, 1.35, wz);
      const winR = new THREE.Mesh(windowGeo, materials.trainWindowLit);
      winR.position.set(1.01, 1.35, wz);
      group.add(winL, winR);
    }

    // Heavy industrial steel locomotive wheels resting on rails
    const wheelGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.16, 20);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelPositions = [
      [-0.92, 0.44, -2.2],
      [-0.92, 0.44, 2.2],
      [0.92, 0.44, -2.2],
      [0.92, 0.44, 2.2]
    ];
    wheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeo, materials.trainSteelWheel);
      wheel.position.set(x, y, z);
      wheel.castShadow = true;
      const hub = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), materials.trainGold);
      hub.position.set(x > 0 ? x + 0.06 : x - 0.06, y, z);
      group.add(wheel, hub);
    });

    // Steel wheel connecting axle bar
    [-2.2, 2.2].forEach(z => {
      const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.9, 10), materials.trainSteelWheel);
      axle.rotateZ(Math.PI / 2);
      axle.position.set(0, 0.44, z);
      group.add(axle);
    });

    // Dual high-beam locomotive headlights
    [-0.65, 0.65].forEach(x => {
      const lanternHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.18, 12), materials.trainGold);
      lanternHousing.rotation.x = Math.PI / 2;
      lanternHousing.position.set(x, 1.6, 3.52);
      const lanternLens = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), materials.lanternLight);
      lanternLens.position.set(x, 1.6, 3.6);
      group.add(lanternHousing, lanternLens);
    });

    group.add(wagonBody, roof, roofBorderL, roofBorderR);
  } else if (type === 'rath_ramp') {
    // 4. Incline Ramp leading onto a Rath Wagon (Length: 4.8m, Rise from 0 to 2.2m)
    const rampLength = 4.8;
    const rampHeight = 2.2;
    const rampWidth = 2.0;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, rampHeight);
    shape.lineTo(rampLength, 0);
    shape.closePath();

    const rampGeo = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: rampWidth,
      bevelEnabled: false
    });
    rampGeo.center();

    const rampMesh = new THREE.Mesh(rampGeo, materials.woodObstacle);
    rampMesh.rotation.y = Math.PI / 2;
    rampMesh.position.set(0, rampHeight / 2, 0);
    rampMesh.castShadow = true;
    rampMesh.receiveShadow = true;

    // Glowing green/yellow directional chevrons on ramp face
    const arrowGeo = new THREE.BoxGeometry(1.4, 0.06, 0.24);
    for (let a = -1; a <= 1; a++) {
      const arrow = new THREE.Mesh(arrowGeo, materials.rampChevron);
      arrow.position.set(0, (a + 1.2) * 0.65, a * 1.1);
      arrow.rotation.x = Math.atan2(rampHeight, rampLength);
      group.add(arrow);
    }

    group.add(rampMesh);
  } else if (type === 'moving_cart') {
    const cartBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 2.4), materials.trainRed);
    cartBase.position.y = 0.9;
    cartBase.castShadow = true;
    cartBase.receiveShadow = true;

    const awning = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.8, 4), materials.dhotiSaffron);
    awning.position.y = 1.9;
    awning.rotation.y = Math.PI / 4;
    awning.castShadow = true;

    [-0.6, 0.6].forEach(x => {
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), materials.lanternLight);
      lamp.position.set(x, 0.9, 1.25);
      group.add(lamp);
    });

    group.add(cartBase, awning);
  } else if (type === 'stone_block') {
    const stoneGeo = new THREE.BoxGeometry(1.6, 1.6, 0.9);
    const stone = new THREE.Mesh(stoneGeo, materials.stoneObstacle);
    stone.position.y = 0.8;
    stone.castShadow = true;
    stone.receiveShadow = true;
    group.add(stone);

    const reliefGeo = new THREE.BoxGeometry(0.9, 0.8, 0.95);
    const relief = new THREE.Mesh(reliefGeo, materials.goldJewels);
    relief.position.y = 0.8;
    group.add(relief);
  } else {
    // Default obstacle
    const defaultGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const defaultMesh = new THREE.Mesh(defaultGeo, materials.woodObstacle);
    defaultMesh.position.y = 0.6;
    defaultMesh.castShadow = true;
    group.add(defaultMesh);
  }

  return group;
}

/**
 * Powerup attachments scaled proportionally to Ganesha
 */
export function createHoverboardAttachment(): THREE.Group {
  const group = new THREE.Group();
  const boardGeo = new THREE.BoxGeometry(0.50, 0.06, 1.10);
  const board = new THREE.Mesh(boardGeo, materials.trainGold);
  board.castShadow = true;
  const neonGlow = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 1.0), materials.powerCyan);
  neonGlow.position.y = -0.03;
  group.add(board, neonGlow);
  group.position.set(0, 0.08, 0);
  return group;
}

export function createJetpackAttachment(): THREE.Group {
  const group = new THREE.Group();
  const tankGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.45, 12);
  const tankL = new THREE.Mesh(tankGeo, materials.goldCrown);
  tankL.position.set(-0.17, 0.80, -0.22);
  tankL.castShadow = true;
  const tankR = new THREE.Mesh(tankGeo, materials.goldCrown);
  tankR.position.set(0.17, 0.80, -0.22);
  tankR.castShadow = true;

  const flameGeo = new THREE.ConeGeometry(0.065, 0.26, 10);
  flameGeo.rotateX(Math.PI);
  const flameL = new THREE.Mesh(flameGeo, materials.jetpackFlame);
  flameL.position.set(-0.17, 0.50, -0.22);
  const flameR = new THREE.Mesh(flameGeo, materials.jetpackFlame);
  flameR.position.set(0.17, 0.50, -0.22);

  group.add(tankL, tankR, flameL, flameR);
  return group;
}

export function createSuperSneakersAttachment(): THREE.Group {
  const group = new THREE.Group();
  [-0.17, 0.17].forEach(x => {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.09, 0.22), materials.trainGold);
    shoe.position.set(x, 0.06, 0.03);
    shoe.castShadow = true;
    const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 10), materials.powerCyan);
    spring.position.set(x, 0.01, 0.03);
    group.add(shoe, spring);
  });
  return group;
}
