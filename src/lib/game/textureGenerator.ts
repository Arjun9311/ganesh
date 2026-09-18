import * as THREE from 'three';

/**
 * High-performance procedural PBR Texture Generator
 * Creates realistic procedural textures using HTML5 2D Canvas in memory.
 * Completely eliminates network latency and missing assets while providing crisp,
 * realistic micro-detail, bump/roughness variations, and high visual fidelity.
 */

// Helper to create and configure a CanvasTexture
function createConfiguredTexture(canvas: HTMLCanvasElement, repeatX = 1, repeatY = 1): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * 1. Realistic Road / Pavement Texture with Stone Paver Blocks & Micro-Gravel
 */
export function createRoadTexture(baseColorHex = '#E5E7EB', isDark = false): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Fill base tone
  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 512, 512);

  // Interlocking stone paver grid
  const blockW = 64;
  const blockH = 32;
  for (let y = 0; y < 512; y += blockH) {
    const row = Math.floor(y / blockH);
    const offsetX = (row % 2 === 0) ? 0 : blockW / 2;
    for (let x = -blockW; x < 512 + blockW; x += blockW) {
      // Subtle stone color variations
      const toneVariation = (Math.sin(x * 12.3 + y * 45.7) * 0.5 + 0.5);
      const alpha = isDark ? 0.08 + toneVariation * 0.12 : 0.04 + toneVariation * 0.08;
      ctx.fillStyle = toneVariation > 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(x + offsetX + 1, y + 1, blockW - 2, blockH - 2);

      // Grout / seam lines
      ctx.strokeStyle = isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + offsetX + 0.5, y + 0.5, blockW - 1, blockH - 1);
    }
  }

  // Micro-gravel noise overlay for photorealistic roughness
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * (isDark ? 28 : 18);
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  return createConfiguredTexture(canvas, 1, 8);
}

/**
 * 2. Realistic Cedar & Teak Wood Grain Texture (for railway sleepers, wooden barricades)
 */
export function createWoodTexture(baseR = 133, baseG = 77, baseB = 14): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Fill base wood color
  ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
  ctx.fillRect(0, 0, 512, 256);

  // Draw natural grain lines
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 200; i++) {
    const y = Math.random() * 256;
    const darkness = Math.random() * 0.4 + 0.1;
    ctx.strokeStyle = Math.random() > 0.4 ? `rgba(0, 0, 0, ${darkness})` : `rgba(255, 230, 180, ${darkness * 0.5})`;
    ctx.beginPath();
    ctx.moveTo(0, y);

    let cy = y;
    for (let x = 0; x < 512; x += 30) {
      cy += (Math.random() - 0.5) * 3;
      ctx.lineTo(x, cy);
    }
    ctx.stroke();
  }

  // Add occasional wood knots
  for (let k = 0; k < 3; k++) {
    const kx = Math.random() * 400 + 50;
    const ky = Math.random() * 200 + 25;
    const grad = ctx.createRadialGradient(kx, ky, 2, kx, ky, 18);
    grad.addColorStop(0, 'rgba(40, 20, 5, 0.7)');
    grad.addColorStop(0.5, 'rgba(80, 45, 10, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(kx, ky, 22, 12, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();
  }

  return createConfiguredTexture(canvas, 1, 2);
}

/**
 * 3. Realistic Carved Sandstone & Polished Marble (for temple pillars, ghats, and arches)
 */
export function createSandstoneTexture(isWhiteMarble = false): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base stone tone (Warm sandstone vs Italian white marble)
  ctx.fillStyle = isWhiteMarble ? '#F8FAFC' : '#E8D5B5';
  ctx.fillRect(0, 0, 512, 512);

  // Natural mineral vein streaks
  ctx.lineWidth = 1.5;
  for (let v = 0; v < 14; v++) {
    const veinAlpha = isWhiteMarble ? (Math.random() * 0.15 + 0.05) : (Math.random() * 0.25 + 0.08);
    ctx.strokeStyle = isWhiteMarble ? `rgba(148, 163, 184, ${veinAlpha})` : `rgba(180, 130, 80, ${veinAlpha})`;
    ctx.beginPath();
    let sx = Math.random() * 512;
    let sy = 0;
    ctx.moveTo(sx, sy);

    while (sy < 512) {
      sx += (Math.random() - 0.48) * 28;
      sy += Math.random() * 35 + 15;
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  // Stone grain texture
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * (isWhiteMarble ? 10 : 20);
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.85));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.7));
  }
  ctx.putImageData(imgData, 0, 0);

  return createConfiguredTexture(canvas, 1, 2);
}

/**
 * 4. Realistic Train Metal Panels with Rivets and Corrugation (for rath wagons)
 */
export function createTrainMetalTexture(baseHex = '#DC2626'): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base metallic paint
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal sheet metal panels
  const panelHeight = 64;
  for (let y = 0; y < 512; y += panelHeight) {
    // Upper specular bevel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.fillRect(0, y, 512, 3);
    // Lower shadow seam
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, y + panelHeight - 3, 512, 3);

    // Industrial rivets along the panel seams
    for (let x = 16; x < 512; x += 32) {
      // Rivet shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(x + 1, y + 10, 3, 0, Math.PI * 2);
      ctx.fill();

      // Rivet metal head
      ctx.fillStyle = 'rgba(255, 220, 150, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y + 9, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Brushed steel micro-streaks
  for (let i = 0; i < 400; i++) {
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(Math.random() * 400, y, Math.random() * 120 + 40, 1);
  }

  return createConfiguredTexture(canvas, 1, 1);
}

/**
 * 5. Corrugated Metal Roof Texture (for train walkway)
 */
export function createCorrugatedRoofTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, 256, 256);

  // Corrugation ridges
  const ridgeWidth = 16;
  for (let x = 0; x < 256; x += ridgeWidth) {
    const grad = ctx.createLinearGradient(x, 0, x + ridgeWidth, 0);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, ridgeWidth, 256);
  }

  // Grip diamond plate pattern
  for (let y = 8; y < 256; y += 16) {
    for (let x = 8; x < 256; x += 16) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(x - 2, y, 4, 1.5);
      ctx.fillRect(x, y - 2, 1.5, 4);
    }
  }

  return createConfiguredTexture(canvas, 2, 8);
}

/**
 * 6. High-Visibility Hazard Warning Stripes Texture (for hurdles and barricades)
 */
export function createHazardStripeTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Vibrant yellow background
  ctx.fillStyle = '#EAB308';
  ctx.fillRect(0, 0, 256, 64);

  // 45-degree diagonal midnight stripes
  ctx.fillStyle = '#0F172A';
  const stripeWidth = 32;
  for (let x = -64; x < 320; x += stripeWidth * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripeWidth, 0);
    ctx.lineTo(x + stripeWidth + 64, 64);
    ctx.lineTo(x + 64, 64);
    ctx.closePath();
    ctx.fill();
  }

  // Weathered edge grime
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, 256, 3);
  ctx.fillRect(0, 61, 256, 3);

  return createConfiguredTexture(canvas, 4, 1);
}

/**
 * 7. Fine Silk Brocade Fabric Texture (for Ganesha's saffron dhoti)
 */
export function createSilkFabricTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Rich festive saffron
  ctx.fillStyle = '#EA580C';
  ctx.fillRect(0, 0, 256, 256);

  // Silk weave criss-cross
  for (let y = 0; y < 256; y += 4) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(0, y, 256, 1);
  }
  for (let x = 0; x < 256; x += 4) {
    ctx.fillStyle = 'rgba(255, 200, 50, 0.12)';
    ctx.fillRect(x, 0, 1, 256);
  }

  // Golden zari floral motif in fabric
  for (let y = 16; y < 256; y += 32) {
    for (let x = 16; x < 256; x += 32) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 235, 100, 0.5)';
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return createConfiguredTexture(canvas, 3, 3);
}

/**
 * 8. Tree Bark Texture (for roadside banyans/neem trees)
 */
export function createTreeBarkTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#4A3525';
  ctx.fillRect(0, 0, 256, 256);

  // Vertical furrowed ridges
  for (let x = 0; x < 256; x += 8) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(20, 10, 5, 0.5)' : 'rgba(120, 90, 60, 0.3)';
    ctx.fillRect(x, 0, Math.random() * 4 + 2, 256);
  }

  return createConfiguredTexture(canvas, 1, 3);
}

/**
 * 9. Organic Foliage Texture (for tree crowns)
 */
export function createFoliageTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#15803D';
  ctx.fillRect(0, 0, 256, 256);

  // Leaf dabs
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const isLight = Math.random() > 0.5;
    ctx.fillStyle = isLight ? 'rgba(74, 222, 128, 0.4)' : 'rgba(20, 83, 45, 0.5)';
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 3, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  return createConfiguredTexture(canvas, 2, 2);
}
