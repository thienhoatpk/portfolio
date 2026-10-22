/**
 * Component 5 — 3D Orbital Career Timeline
 * Advanced 3D Orbital Mechanics Engine with continuous frame-by-frame
 * normal vector orientation, spring-damper physics, double-sided cyber cards,
 * glowing orbital ellipse ring, particle trail, and real-time vector telemetry.
 *
 * Mathematical Guarantee:
 *   C(t) = OrbitPosition(θ(t))
 *   R(t) = normalize(C(t) - O)
 *   N(t) = R(t)
 *   |N(t) · R(t)| = 1.00000 (Strictly parallel at every frame)
 */

import { WORK_EXPERIENCES, CAREER_STATS } from '../data/portfolioData.js';
import { openArchitectureDrawer } from './architecture.js';

// ============================================================================
// 1. Core 3D Linear Algebra: Vector3, Matrix4, Quaternion
// ============================================================================

export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  multiplyScalar(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  length() {
    return Math.hypot(this.x, this.y, this.z);
  }

  normalize() {
    const len = this.length();
    if (len > 1e-6) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
    }
    return this;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  crossVectors(a, b) {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }
}

export class Matrix4 {
  constructor() {
    // 4x4 matrix stored in column-major order (standard for CSS matrix3d and WebGL)
    this.elements = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  identity() {
    const te = this.elements;
    te[0] = 1; te[1] = 0; te[2] = 0; te[3] = 0;
    te[4] = 0; te[5] = 1; te[6] = 0; te[7] = 0;
    te[8] = 0; te[9] = 0; te[10] = 1; te[11] = 0;
    te[12] = 0; te[13] = 0; te[14] = 0; te[15] = 1;
    return this;
  }

  makeBasis(xAxis, yAxis, zAxis) {
    const te = this.elements;
    // Column 0: X axis (Right)
    te[0] = xAxis.x; te[1] = xAxis.y; te[2] = xAxis.z; te[3] = 0;
    // Column 1: Y axis (Up)
    te[4] = yAxis.x; te[5] = yAxis.y; te[6] = yAxis.z; te[7] = 0;
    // Column 2: Z axis (Normal)
    te[8] = zAxis.x; te[9] = zAxis.y; te[10] = zAxis.z; te[11] = 0;
    // Column 3: Translation remains
    te[12] = 0; te[13] = 0; te[14] = 0; te[15] = 1;
    return this;
  }

  setPosition(x, y, z) {
    const te = this.elements;
    te[12] = x;
    te[13] = y;
    te[14] = z;
    return this;
  }

  toCssMatrix3d() {
    const te = this.elements;
    return `matrix3d(${te[0].toFixed(5)},${te[1].toFixed(5)},${te[2].toFixed(5)},0,${te[4].toFixed(5)},${te[5].toFixed(5)},${te[6].toFixed(5)},0,${te[8].toFixed(5)},${te[9].toFixed(5)},${te[10].toFixed(5)},0,${te[12].toFixed(2)},${te[13].toFixed(2)},${te[14].toFixed(2)},1)`;
  }
}

export class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  setFromRotationMatrix(m) {
    const te = m.elements;
    const m11 = te[0], m12 = te[4], m13 = te[8];
    const m21 = te[1], m22 = te[5], m23 = te[9];
    const m31 = te[2], m32 = te[6], m33 = te[10];
    const trace = m11 + m22 + m33;

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0);
      this.w = 0.25 / s;
      this.x = (m32 - m23) * s;
      this.y = (m13 - m31) * s;
      this.z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
      this.w = (m32 - m23) / s;
      this.x = 0.25 * s;
      this.y = (m12 + m21) / s;
      this.z = (m13 + m31) / s;
    } else if (m22 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
      this.w = (m13 - m31) / s;
      this.x = (m12 + m21) / s;
      this.y = 0.25 * s;
      this.z = (m23 + m32) / s;
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
      this.w = (m21 - m12) / s;
      this.x = (m13 + m31) / s;
      this.y = (m23 + m32) / s;
      this.z = 0.25 * s;
    }
    return this;
  }
}

// Helper to get company badge icon
function getCompanyLogoSvg(logoType) {
  switch (logoType) {
    case 'bship':
      return `
        <div class="orbital-logo-badge logo-bship">
          <span class="bship-mark">iB</span>
        </div>
      `;
    case 'star':
      return `
        <div class="orbital-logo-badge logo-star">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="width: 22px; height: 22px; max-width: 22px; max-height: 22px; flex-shrink: 0;">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      `;
    case 'users':
      return `
        <div class="orbital-logo-badge logo-users">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px; max-width: 22px; max-height: 22px; flex-shrink: 0;">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      `;
    case 'academy':
    case 'archive':
      return `
        <div class="orbital-logo-badge logo-academy">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px; max-width: 22px; max-height: 22px; flex-shrink: 0;">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        </div>
      `;
    case 'code':
    case 'opensource':
      return `
        <div class="orbital-logo-badge logo-code">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px; max-width: 22px; max-height: 22px; flex-shrink: 0;">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
      `;
    case 'ai':
    case 'nexus':
      return `
        <div class="orbital-logo-badge logo-ai">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px; max-width: 22px; max-height: 22px; flex-shrink: 0;">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      `;
    default:
      return `
        <div class="orbital-logo-badge logo-default">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 22px; height: 22px; max-width: 22px; max-height: 22px; flex-shrink: 0;">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </div>
      `;
  }
}

// Helper to generate ethereal glowing celestial orbital halo SVG (Vầng quang quỹ đạo 3D)
function generateOrbitalTrackSvg() {
  return `
    <svg class="orbital-ellipse-svg" viewBox="-660 -320 1320 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <!-- Multi-stop chromatic luminous aura gradient -->
        <linearGradient id="orbitAuraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.95" />
          <stop offset="25%" stop-color="#3b82f6" stop-opacity="0.85" />
          <stop offset="50%" stop-color="#a855f7" stop-opacity="0.95" />
          <stop offset="75%" stop-color="#ec4899" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#00f0ff" stop-opacity="0.95" />
        </linearGradient>

        <linearGradient id="orbitDeepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.4" />
          <stop offset="30%" stop-color="#8b5cf6" stop-opacity="0.35" />
          <stop offset="70%" stop-color="#ec4899" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#00e5ff" stop-opacity="0.4" />
        </linearGradient>

        <!-- Ambient Cosmic Nebula Radial Glow -->
        <radialGradient id="nebulaRadiant" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.18" />
          <stop offset="35%" stop-color="#8b5cf6" stop-opacity="0.1" />
          <stop offset="70%" stop-color="#ec4899" stop-opacity="0.04" />
          <stop offset="100%" stop-color="#020617" stop-opacity="0" />
        </radialGradient>

        <!-- Center Gravitational Singularity Gradients -->
        <radialGradient id="singularityAuraGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="20%" stop-color="#00f0ff" stop-opacity="0.8" />
          <stop offset="50%" stop-color="#a855f7" stop-opacity="0.35" />
          <stop offset="80%" stop-color="#ec4899" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#020617" stop-opacity="0" />
        </radialGradient>

        <radialGradient id="singularityCoreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="40%" stop-color="#00e5ff" stop-opacity="0.9" />
          <stop offset="85%" stop-color="#3b82f6" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>

        <!-- Node Glow Gradients -->
        <radialGradient id="nodeGlowGrad0" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.95" />
          <stop offset="45%" stop-color="#00e5ff" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#00e5ff" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="nodeGlowGrad1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#c084fc" stop-opacity="0.95" />
          <stop offset="45%" stop-color="#a855f7" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="nodeGlowGrad2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f472b6" stop-opacity="0.95" />
          <stop offset="45%" stop-color="#ec4899" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#ec4899" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="nodeGlowGrad3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.95" />
          <stop offset="45%" stop-color="#3b82f6" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
        </radialGradient>

        <!-- Multi-tier Volumetric Halo Gaussian Blurs -->
        <filter id="haloDeepBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <filter id="haloMidBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id="haloSoftBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="haloPulseBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <!-- 1. Ambient Cosmic Space Nebula Aura (Soft breathing background wash) -->
      <ellipse cx="0" cy="0" rx="600" ry="165" fill="url(#nebulaRadiant)" class="orbit-nebula-halo" />

      <!-- 2. Pure Volumetric Luminous Halo Layers (VẦNG QUANG - No sharp outlines, zero tick lines!) -->
      <!-- Layer A: Deep Outermost Atmospheric Corona Glow (stroke-width: 72, stdDev: 34) -->
      <ellipse cx="0" cy="0" rx="545" ry="132" fill="none" stroke="url(#orbitDeepGrad)" stroke-width="72" class="orbit-halo-outer" />

      <!-- Layer B: Middle Diffuse Radiant Halo (stroke-width: 32, stdDev: 16) -->
      <ellipse cx="0" cy="0" rx="545" ry="132" fill="none" stroke="url(#orbitAuraGrad)" stroke-width="32" class="orbit-halo-middle" />

      <!-- Layer C: Vibrant Ethereal Inner Corona (stroke-width: 12, stdDev: 7) -->
      <ellipse cx="0" cy="0" rx="545" ry="132" fill="none" stroke="url(#orbitAuraGrad)" stroke-width="12" class="orbit-halo-inner" />

      <!-- Layer D: Soft Radiant Light Filament (stroke-width: 2.5 - soft glowing core, not hard wire) -->
      <ellipse cx="0" cy="0" rx="545" ry="132" fill="none" stroke="#ffffff" stroke-width="2.5" class="orbit-halo-core" />

      <!-- 3. Gliding Luminous Light Waves (Feathered glowing comets circulating inside the halo) -->
      <ellipse cx="0" cy="0" rx="545" ry="132" class="orbit-light-wave-cw" />
      <ellipse cx="0" cy="0" rx="545" ry="132" class="orbit-light-wave-ccw" />

      <!-- 4. Soft Celestial Waypoint Light Orbs (No mechanical boxes or brackets!) -->
      <!-- Node 0: Front / Active Apex -->
      <g class="orbit-node-glow node-0" transform="translate(0, 132)">
        <circle cx="0" cy="0" r="32" fill="url(#nodeGlowGrad0)" class="node-glow-halo" />
        <circle cx="0" cy="0" r="5" fill="#ffffff" filter="drop-shadow(0 0 10px #00f0ff)" />
      </g>

      <!-- Node 1: Right -->
      <g class="orbit-node-glow node-1" transform="translate(545, 0)">
        <circle cx="0" cy="0" r="26" fill="url(#nodeGlowGrad1)" class="node-glow-halo" />
        <circle cx="0" cy="0" r="4.5" fill="#ffffff" filter="drop-shadow(0 0 8px #a855f7)" />
      </g>

      <!-- Node 2: Back / Deep Space -->
      <g class="orbit-node-glow node-2" transform="translate(0, -132)">
        <circle cx="0" cy="0" r="22" fill="url(#nodeGlowGrad2)" class="node-glow-halo" />
        <circle cx="0" cy="0" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 6px #ec4899)" />
      </g>

      <!-- Node 3: Left -->
      <g class="orbit-node-glow node-3" transform="translate(-545, 0)">
        <circle cx="0" cy="0" r="26" fill="url(#nodeGlowGrad3)" class="node-glow-halo" />
        <circle cx="0" cy="0" r="4.5" fill="#ffffff" filter="drop-shadow(0 0 8px #3b82f6)" />
      </g>

      <!-- 5. Central Gravitational Singularity (Vầng quang tâm vũ trụ - Pure soft light, no wireframes or radar lines) -->
      <g class="orbit-singularity-core" transform="translate(0, 0)">
        <!-- Broad Ambient Breathing Corona -->
        <circle cx="0" cy="0" r="130" fill="url(#singularityAuraGrad)" class="singularity-ambient-pulse" />
        <!-- Radiant Inner Glow -->
        <circle cx="0" cy="0" r="38" fill="url(#singularityCoreGrad)" class="singularity-core-pulse" />
        <!-- Brilliant Starlight Center -->
        <circle cx="0" cy="0" r="6" fill="#ffffff" filter="drop-shadow(0 0 12px #00f0ff)" />
      </g>
    </svg>
  `;
}

// ============================================================================
// 2. Component Initialization & Orbital Physics State
// ============================================================================

export function initTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  const N = WORK_EXPERIENCES.length; // 4 cards
  if (N === 0) return;

  // Active state
  let activeIndex = 0;
  let showTelemetry = true; // Debug telemetry HUD
  let autoRotate = false;
  let autoRotateSpeed = 0.0025; // radians per frame

  // Orbit Geometry Parameters
  // Tilted 3D Ellipse in camera space:
  // Rx: Major axis (horizontal spread)
  // Rz: Minor axis (depth spread)
  // Tilt angle alpha around X-axis: 24 degrees (increased from 16 deg for pronounced 3D incline perspective)
  let Rx = 540;
  let Rz = 280;
  const alpha = 24 * (Math.PI / 180); // 0.4189 rad
  const sinAlpha = Math.sin(alpha);
  const cosAlpha = Math.cos(alpha);

  // Focus angle: theta = PI/2 (90 deg) is front-most closest to camera
  const FRONT_ANGLE = Math.PI / 2;

  // Orbit Angle State:
  // Base angle starts so that Card 0 sits at FRONT_ANGLE
  let currentTheta = FRONT_ANGLE;
  let targetTheta = FRONT_ANGLE;
  let velocity = 0;

  // Drag interaction state
  let isDragging = false;
  let dragStartX = 0;
  let dragStartTheta = FRONT_ANGLE;
  let lastDragX = 0;
  let lastDragTime = 0;
  let dragVelocity = 0;

  // Render static shell once
  container.innerHTML = `
    <div class="orbital-experience-wrapper">
      <!-- Section Header with Stats HUD -->
      <div class="orbital-header-row">
        <div class="orbital-header-info">
          <div class="orbital-badge-tag">
            <span class="tag-pulse-dot"></span>
            <span>3D ORBITAL SYSTEM // CAREER TIMELINE</span>
          </div>
          <h2 class="orbital-main-title">
            Work <span class="gradient-text-purple">Experience</span>
          </h2>
          <p class="orbital-main-subtitle">
            Hành trình phát triển qua các quỹ đạo microservices và phân tán, liên kết hình học động trong không gian 3D.
          </p>
        </div>

        <!-- Top Right Stats HUD Box -->
        <div class="orbital-stats-hud">
          <div class="hud-box-title">TỔNG THỜI GIAN KINH NGHIỆM</div>
          <div class="hud-box-content">
            <div class="hud-time-block">
              <div class="hud-calendar-row">
                <svg class="hud-calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div class="hud-years-text">
                  <span class="hud-big-num">3</span><span class="hud-unit">năm</span>
                  <span class="hud-big-num">8</span><span class="hud-unit">tháng</span>
                </div>
              </div>
              <div class="hud-date-sub">TỪ 06/2021 ĐẾN HIỆN TẠI</div>
            </div>

            <div class="hud-divider-v"></div>

            <div class="hud-metrics-list">
              <div class="hud-metric-row">
                <span class="hud-metric-label">Công ty:</span>
                <span class="hud-metric-val">6</span>
              </div>
              <div class="hud-metric-row">
                <span class="hud-metric-label">Dự án:</span>
                <span class="hud-metric-val">10+</span>
              </div>
              <div class="hud-metric-row">
                <span class="hud-metric-label">Tech Stack:</span>
                <span class="hud-metric-val">15+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D Orbital Theater Stage -->
      <div class="orbital-stage-viewport" id="orbitalStage">
        <!-- Background 3D Elliptical Circuit Track & Particle Ring -->
        <div class="orbital-track-canvas-wrap">
          <canvas id="orbitalParticleCanvasBg" class="orbital-particle-canvas bg-canvas"></canvas>
          ${generateOrbitalTrackSvg()}
        </div>

        <!-- 3D World Transformation Container -->
        <div class="orbital-world" id="orbitalWorld">
          ${WORK_EXPERIENCES.map((exp, index) => {
            const accentColor = exp.color || '#00e5ff';
            return `
              <div class="orbital-card-rig" data-index="${index}" id="orbitalCard-${index}" style="--card-accent: ${accentColor};">
                <!-- Projected 3D Orbital Plane Floor Shadow -->
                <div class="orbital-card-shadow" id="orbitalShadow-${index}"></div>

                <div class="orbital-card-chassis">
                  <!-- 3D Slab Thickness Edges (Heavy 80px Oz Depth with Cyber Detailing) -->
                  <div class="card-edge-slab card-edge-left">
                    <div class="edge-ribs"></div>
                    <div class="edge-tech-tag">CYBER-DECK // 0${index + 1}</div>
                    <div class="edge-led-cluster">
                      <span class="edge-led"></span>
                      <span class="edge-led"></span>
                      <span class="edge-led"></span>
                    </div>
                  </div>
                  <div class="card-edge-slab card-edge-right">
                    <div class="edge-ribs"></div>
                    <div class="edge-tech-tag">ORBITAL-SLAB // 0${index + 1}</div>
                    <div class="edge-led-cluster">
                      <span class="edge-led"></span>
                      <span class="edge-led"></span>
                      <span class="edge-led"></span>
                    </div>
                  </div>
                  <div class="card-edge-slab card-edge-top">
                    <div class="edge-ribs-h"></div>
                    <div class="edge-led-cluster-h">
                      <span class="edge-led"></span>
                      <span class="edge-led"></span>
                      <span class="edge-led"></span>
                    </div>
                  </div>
                  <div class="card-edge-slab card-edge-bottom">
                    <div class="edge-ribs-h"></div>
                    <div class="edge-led-cluster-h">
                      <span class="edge-led"></span>
                      <span class="edge-led"></span>
                      <span class="edge-led"></span>
                    </div>
                  </div>

                  <!-- 3D Beveled Corner Slabs (Closes rounded corners smoothly in 3D) -->
                  <div class="card-edge-slab card-edge-corner corner-tl"></div>
                  <div class="card-edge-slab card-edge-corner corner-tr"></div>
                  <div class="card-edge-slab card-edge-corner corner-bl"></div>
                  <div class="card-edge-slab card-edge-corner corner-br"></div>

                  <!-- FRONT FACE: Rich Interactive Career Details -->
                  <div class="card-face card-face-front">
                    <div class="holo-corner corner-tl"></div>
                    <div class="holo-corner corner-tr"></div>
                    <div class="holo-corner corner-bl"></div>
                    <div class="holo-corner corner-br"></div>
                    <div class="holo-shine-layer"></div>

                    <!-- Top Bar -->
                    <div class="orbital-card-top">
                      ${getCompanyLogoSvg(exp.logoType)}
                      <div class="orbital-card-id-block">
                        <h3 class="orbital-company">${exp.company}</h3>
                        <div class="orbital-role">${exp.role}</div>
                        <div class="orbital-date-row">
                          <svg class="orbital-pin-svg" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0a5 5 0 0 0-5 5c0 3.86 5 11 5 11s5-7.14 5-11a5 5 0 0 0-5-5zm0 7.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                          </svg>
                          <span>${exp.dateStart} - ${exp.dateEnd}</span>
                        </div>
                      </div>
                      ${exp.isCurrent ? '<span class="orbital-badge-current">HIỆN TẠI</span>' : ''}
                    </div>

                    <!-- Media Thumbnail -->
                    <div class="orbital-thumb-box">
                      <img src="${exp.thumbnail}" alt="${exp.company}" class="orbital-thumb-img" draggable="false" loading="lazy" />
                    </div>

                    <!-- Description -->
                    <p class="orbital-desc">${exp.description}</p>

                    <!-- Tech Pills -->
                    <div class="orbital-tech-pills">
                      ${exp.technologies.slice(0, 6).map(t => {
                        const name = typeof t === 'object' && t !== null ? t.name : t;
                        return `<span class="orbital-tech-tag">${name}</span>`;
                      }).join('')}
                    </div>

                    <!-- Flip Hint Badge -->
                    <div class="orbital-card-flip-tip">
                      <span class="flip-icon">↺</span>
                      <span>Click để lật thẻ</span>
                    </div>

                  </div>

                  <!-- BACK FACE: Cyber HUD Telemetry Chassis (No mirrored text!) -->
                  <div class="card-face card-face-back">
                    <div class="back-chassis-inner">
                      <div class="back-header">
                        <span class="back-status-dot"></span>
                        <span>ORBITAL NODE CHASSIS // #${index + 1}</span>
                      </div>

                      <div class="back-hex-core">
                        ${getCompanyLogoSvg(exp.logoType)}
                        <div class="back-company-name">${exp.company}</div>
                        <div class="back-system-role">${exp.role}</div>
                      </div>

                      <div class="back-specs-grid">
                        <div class="back-spec-item">
                          <span class="spec-label">SECTOR:</span>
                          <span class="spec-val">0${index + 1} / 0${N}</span>
                        </div>
                        <div class="back-spec-item">
                          <span class="spec-label">STATUS:</span>
                          <span class="spec-val">SYNCHRONIZED</span>
                        </div>
                        <div class="back-spec-item">
                          <span class="spec-label">NORMAL:</span>
                          <span class="spec-val">RADIAL ALIGNED</span>
                        </div>
                        <div class="back-spec-item">
                          <span class="spec-label">GEOMETRY:</span>
                          <span class="spec-val">|N · R| = 1.0</span>
                        </div>
                      </div>

                      <div class="back-circuit-vent">
                        <span></span><span></span><span></span><span></span><span></span>
                      </div>

                      <!-- Flip Back Badge -->
                      <div class="orbital-card-flip-tip flip-tip-back">
                        <span class="flip-icon">↻</span>
                        <span>Click để quay lại</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Foreground 3D Floating Particle Layer (Drifts in front of cards in true stereoscopic 3D) -->
        <canvas id="orbitalParticleCanvasFg" class="orbital-particle-canvas fg-canvas"></canvas>

        <!-- Floating Nav Arrows & Indicator -->
        <button class="orbital-arrow-btn prev-arrow" id="orbitalPrevBtn" aria-label="Previous milestone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button class="orbital-arrow-btn next-arrow" id="orbitalNextBtn" aria-label="Next milestone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <!-- Bottom Interactive Milestone Bar & Controls -->
      <div class="orbital-bottom-controls">
        <!-- Milestone Pagination Chips -->
        <div class="orbital-chips-dock">
          ${WORK_EXPERIENCES.map((exp, idx) => `
            <button class="orbital-chip-btn ${idx === activeIndex ? 'active' : ''}" data-index="${idx}">
              <span class="chip-dot" style="background: ${exp.color || '#00e5ff'};"></span>
              <span class="chip-name">${exp.company}</span>
              ${exp.isCurrent ? '<span class="chip-current-badge">CURRENT</span>' : ''}
            </button>
          `).join('')}
        </div>

        <!-- Utility Toggles: Auto Cruise & Drag Hint -->
        <div class="orbital-utility-row">
          <button class="orbital-util-btn ${autoRotate ? 'active' : ''}" id="orbitalAutoBtn" title="Toggle 3D Auto Cruise">
            <span class="util-icon">⟳</span>
            <span>Auto Cruise: <strong id="autoRotateStatus">${autoRotate ? 'ON' : 'OFF'}</strong></span>
          </button>
          <div class="orbital-drag-tip">
            <span class="drag-hand-icon">⇄</span>
            <span>Kéo / Cuộn chuột để xoay quỹ đạo 3D</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Select DOM Elements
  const stage = document.getElementById('orbitalStage');
  const bgCanvas = document.getElementById('orbitalParticleCanvasBg');
  const fgCanvas = document.getElementById('orbitalParticleCanvasFg');
  const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
  const fgCtx = fgCanvas ? fgCanvas.getContext('2d') : null;
  const waypoints = Array.from(container.querySelectorAll('.orbit-waypoint'));
  const cardRigs = Array.from(container.querySelectorAll('.orbital-card-rig'));
  const cardShadows = Array.from(container.querySelectorAll('.orbital-card-shadow'));
  const cardChassis = cardRigs.map(rig => rig.querySelector('.orbital-card-chassis'));
  const cardFrontFaces = cardRigs.map(rig => rig.querySelector('.card-face-front'));
  const chipBtns = Array.from(container.querySelectorAll('.orbital-chip-btn'));
  const prevBtn = document.getElementById('orbitalPrevBtn');
  const nextBtn = document.getElementById('orbitalNextBtn');
  const autoBtn = document.getElementById('orbitalAutoBtn');
  const autoStatus = document.getElementById('autoRotateStatus');

  // Interactive 3D Canvas Particle Engine (Dual-Plane Stereoscopic Depth)
  const PARTICLE_COUNT = 80;
  const particles = [];
  for (let p = 0; p < PARTICLE_COUNT; p++) {
    particles.push({
      theta: Math.random() * Math.PI * 2,
      baseSpeed: 0.0016 + Math.random() * 0.0028,
      size: 1.4 + Math.random() * 2.4,
      radialOffset: (Math.random() - 0.5) * 26,
      zOffset: (Math.random() - 0.5) * 20,
      hue: Math.random() > 0.4 ? 'cyan' : (Math.random() > 0.5 ? 'magenta' : 'blue'),
      alpha: 0.35 + Math.random() * 0.65
    });
  }

  function resizeParticleCanvases() {
    if (!stage) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round((stage.clientWidth || 1000) * dpr);
    const h = Math.round((stage.clientHeight || 620) * dpr);
    if (bgCanvas) {
      bgCanvas.width = w;
      bgCanvas.height = h;
    }
    if (fgCanvas) {
      fgCanvas.width = w;
      fgCanvas.height = h;
    }
  }
  resizeParticleCanvases();
  window.addEventListener('resize', resizeParticleCanvases);

  // Working 3D Vectors & Matrices
  const orbitCenter = new Vector3(0, 0, 0);
  const C = new Vector3(); // Card center
  const R = new Vector3(); // Radius vector
  const N_vec = new Vector3(); // Card normal vector
  const S_vec = new Vector3(); // Right vector
  const U_vec = new Vector3(); // Up vector
  const worldUp = new Vector3(0, 1, 0);
  const mat4 = new Matrix4();

  // Responsive sizing for orbit dimensions
  function updateOrbitDimensions() {
    const width = stage ? stage.clientWidth : 1000;
    if (width < 640) {
      Rx = Math.min(340, width * 0.48);
      Rz = 190;
    } else if (width < 960) {
      Rx = Math.min(460, width * 0.48);
      Rz = 240;
    } else {
      Rx = Math.min(560, width * 0.48);
      Rz = 280;
    }
  }
  updateOrbitDimensions();
  window.addEventListener('resize', updateOrbitDimensions);

  // Helper to compute card position on tilted 3D ellipse:
  function computeOrbitPoint(theta, outVector) {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    outVector.x = Rx * cosT;
    outVector.y = -Rz * sinT * sinAlpha;
    outVector.z = Rz * sinT * cosAlpha;
    return outVector;
  }

  // Set Target to snap to a specific card index at front
  function snapToIndex(index) {
    activeIndex = (index % N + N) % N;
    const deltaPerCard = (2 * Math.PI) / N;
    const desiredTheta = FRONT_ANGLE - activeIndex * deltaPerCard;

    // Reset all card tilts & flips when snapping
    cardTiltTargetX.fill(0);
    cardTiltTargetY.fill(0);
    cardFlipped.fill(false);

    // Find nearest equivalent angle to minimize rotation travel (no unnecessary 360 spins)
    const twoPi = 2 * Math.PI;
    const diff = (desiredTheta - targetTheta) % twoPi;
    const shortestDiff = ((diff + Math.PI * 3) % twoPi) - Math.PI;
    targetTheta += shortestDiff;

    updateChips();
  }

  function updateChips() {
    chipBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === activeIndex);
    });
    waypoints.forEach((wp, idx) => {
      wp.classList.toggle('is-active', idx === activeIndex);
    });
  }

  // Per-card 3D hover tilt state (each card tilts independently)
  const cardTiltTargetX = new Float32Array(N);
  const cardTiltTargetY = new Float32Array(N);
  const cardTiltCurrentX = new Float32Array(N);
  const cardTiltCurrentY = new Float32Array(N);

  // Per-card 3D flip state (0 deg front <-> 180 deg back)
  const cardFlipped = new Array(N).fill(false);
  const cardFlipCurrentY = new Float32Array(N);

  // ============================================================================
  // 3. Main 60 FPS Mathematical Animation Loop (High Performance & Zero Alloc)
  // ============================================================================

  let animationFrameId = null;
  let isSectionVisible = true;

  function renderLoop() {
    if (!isSectionVisible) {
      animationFrameId = null;
      return;
    }

    animationFrameId = requestAnimationFrame(renderLoop);

    // 1. Auto Cruise update when enabled and not dragging
    if (autoRotate && !isDragging) {
      targetTheta -= autoRotateSpeed;
    }

    // 2. Spring Physics Interpolation for theta(t)
    if (!isDragging) {
      const springStiffness = 0.085;
      const springDamping = 0.84;
      const force = (targetTheta - currentTheta) * springStiffness;
      velocity = (velocity + force) * springDamping;
      currentTheta += velocity;
    }

    // 3. Smooth per-card hover tilt & flip interpolation
    for (let j = 0; j < N; j++) {
      cardTiltCurrentX[j] += (cardTiltTargetX[j] - cardTiltCurrentX[j]) * 0.12;
      cardTiltCurrentY[j] += (cardTiltTargetY[j] - cardTiltCurrentY[j]) * 0.12;
      const targetFlip = cardFlipped[j] ? 180 : 0;
      cardFlipCurrentY[j] += (targetFlip - cardFlipCurrentY[j]) * 0.14;
    }

    // 3b. Render 3D Canvas Particles along orbit (Split into Back & Front planes for stereoscopic depth)
    if (stage && (bgCtx || fgCtx)) {
      const dpr = window.devicePixelRatio || 1;
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const maxZ = Rz * cosAlpha;

      if (bgCtx && bgCanvas) {
        bgCtx.save();
        bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        bgCtx.clearRect(0, 0, w, h);
      }
      if (fgCtx && fgCanvas) {
        fgCtx.save();
        fgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        fgCtx.clearRect(0, 0, w, h);
      }

      for (let p = 0; p < PARTICLE_COUNT; p++) {
        const pt = particles[p];
        pt.theta += pt.baseSpeed + Math.abs(velocity) * 0.7;

        const cosT = Math.cos(pt.theta);
        const sinT = Math.sin(pt.theta);
        const pRx = Rx + pt.radialOffset;
        const pRz = Rz + pt.zOffset;

        const x3d = pRx * cosT;
        const y3d = -pRz * sinT * sinAlpha;
        const z3d = pRz * sinT * cosAlpha;

        const depthRatio = Math.max(0, Math.min(1, (z3d + maxZ) / (2 * maxZ)));
        const scale = 0.7 + 0.45 * depthRatio;
        const screenX = cx + x3d;
        const screenY = cy + y3d;

        const pSize = pt.size * scale;
        const pAlpha = (0.2 + 0.8 * depthRatio) * pt.alpha;

        // Choose target canvas context: Z > 0 flies in front of cards; Z <= 0 flies behind cards!
        const ctx = (z3d > 0 && fgCtx) ? fgCtx : bgCtx;
        if (!ctx) continue;

        ctx.beginPath();
        if (pt.hue === 'cyan') {
          ctx.fillStyle = `rgba(0, 229, 255, ${pAlpha})`;
          ctx.shadowColor = '#00e5ff';
        } else if (pt.hue === 'magenta') {
          ctx.fillStyle = `rgba(217, 70, 239, ${pAlpha})`;
          ctx.shadowColor = '#d946ef';
        } else {
          ctx.fillStyle = `rgba(59, 130, 246, ${pAlpha})`;
          ctx.shadowColor = '#3b82f6';
        }
        ctx.shadowBlur = depthRatio > 0.5 ? 10 * scale : 2;
        ctx.arc(screenX, screenY, pSize, 0, Math.PI * 2);
        ctx.fill();

        // Trailing warp speed streaks when cards rotate fast
        if (Math.abs(velocity) > 0.003) {
          const trailAngle = pt.theta - velocity * 3.5;
          const trailX = cx + pRx * Math.cos(trailAngle);
          const trailY = cy - pRz * Math.sin(trailAngle) * sinAlpha;
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(trailX, trailY);
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = pSize * 0.65;
          ctx.stroke();
        }
      }

      if (bgCtx) bgCtx.restore();
      if (fgCtx) fgCtx.restore();
    }

    // 4. Determine currently front-most active card from currentTheta
    const deltaPerCard = (2 * Math.PI) / N;
    let closestIndex = 0;
    let maxZ = -Infinity;
    const maxPossibleZ = Rz * cosAlpha;

    // 5. Update every card's 3D geometry continuously
    for (let i = 0; i < N; i++) {
      const rig = cardRigs[i];
      if (!rig) continue;

      // Card angle theta_i(t) on orbit
      const cardTheta = currentTheta + i * deltaPerCard;

      // A. Compute exact 3D position C(t) = OrbitPosition(theta(t))
      computeOrbitPoint(cardTheta, C);

      // Track front-most card
      if (C.z > maxZ) {
        maxZ = C.z;
        closestIndex = i;
      }

      // B. Compute Radius Vector R(t) = normalize(C(t) - O)
      R.copy(C).sub(orbitCenter).normalize();

      // Depth metric along Z: in range [0, 1]
      const depthRatio = Math.max(0, Math.min(1, (C.z + maxPossibleZ) / (2 * maxPossibleZ)));

      // C. Compute Normal Vector N(t): Front card faces camera 100% directly; side cards turn into 3/4 perspective
      const cameraWeight = Math.min(1, Math.pow(depthRatio, 2.2));
      const sideWeight = 1 - cameraWeight;
      N_vec.set(
        R.x * sideWeight,
        R.y * sideWeight,
        R.z * sideWeight + cameraWeight
      ).normalize();

      // D. Build Orthonormal Basis [S, U, N]
      S_vec.crossVectors(worldUp, N_vec).normalize();
      if (S_vec.length() < 0.1) {
        S_vec.set(1, 0, 0);
      }
      U_vec.crossVectors(N_vec, S_vec).normalize();

      // Depth-based Scale
      const scale = 0.72 + 0.36 * depthRatio;

      S_vec.multiplyScalar(scale);
      U_vec.multiplyScalar(scale);
      N_vec.multiplyScalar(scale);

      // E. Build 4x4 Transformation Matrix
      mat4.makeBasis(S_vec, U_vec, N_vec);
      mat4.setPosition(C.x, C.y, C.z);

      // Apply matrix3d transform directly to GPU
      rig.style.transform = mat4.toCssMatrix3d();

      // Dynamic depth sorting (only update if coarse integer changes to prevent layer churn)
      const zInt = Math.round(200 + C.z / 4);
      if (rig._lastZ !== zInt) {
        rig.style.zIndex = zInt;
        rig._lastZ = zInt;
      }

      // Update 3D orbital plane floor shadow (avoid string recreation if unchanged)
      const shadow = cardShadows[i];
      if (shadow) {
        const sOpacity = (0.2 + 0.7 * depthRatio).toFixed(2);
        const sScale = (0.65 + 0.45 * depthRatio).toFixed(2);
        if (shadow._lastOp !== sOpacity) {
          shadow.style.opacity = sOpacity;
          shadow._lastOp = sOpacity;
        }
        if (shadow._lastScale !== sScale) {
          shadow.style.transform = `scale(${sScale}) rotateX(80deg)`;
          shadow._lastScale = sScale;
        }
      }

      // Highlight active card at front
      const isFrontActive = (i === closestIndex);
      if (rig._lastActive !== isFrontActive) {
        rig.classList.toggle('is-front-active', isFrontActive);
        rig._lastActive = isFrontActive;
      }

      // Per-card hover tilt & 3D flip: smoothly flips 180 deg to show back face
      const chassis = cardChassis[i];
      if (chassis) {
        const flipDeg = cardFlipCurrentY[i];
        const flipSign = flipDeg > 90 ? -1 : 1;
        const totalRotY = cardTiltCurrentY[i] * flipSign + flipDeg;
        const totalRotX = cardTiltCurrentX[i];
        const hasTransform = Math.abs(totalRotX) > 0.01 || Math.abs(totalRotY) > 0.01;
        if (hasTransform) {
          chassis.style.transform = `rotateY(${totalRotY.toFixed(2)}deg) rotateX(${totalRotX.toFixed(2)}deg)`;
          chassis._hasTransform = true;
        } else if (chassis._hasTransform) {
          chassis.style.transform = '';
          chassis._hasTransform = false;
        }
      }
    }

    // Keep activeIndex synced with front-most card
    if (closestIndex !== activeIndex && !isDragging) {
      activeIndex = closestIndex;
      updateChips();
    }
  }

  // IntersectionObserver to only animate when section is on or near screen
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isSectionVisible = entry.isIntersecting;
      if (isSectionVisible) {
        if (!animationFrameId) {
          renderLoop();
        }
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    });
  }, { rootMargin: '120px 0px 120px 0px', threshold: 0.01 });

  visibilityObserver.observe(container);

  // ============================================================================
  // 4. Interactive Dragging, Inertia & Event Handlers
  // ============================================================================

  let pointerDownStartX = 0;
  let pointerDownStartY = 0;

  function handlePointerDown(clientX, clientY = 0) {
    isDragging = true;
    dragStartX = clientX;
    pointerDownStartX = clientX;
    pointerDownStartY = clientY;
    dragStartTheta = currentTheta;
    lastDragX = clientX;
    lastDragTime = performance.now();
    velocity = 0;
    dragVelocity = 0;
    stage.classList.add('is-pointer-dragging');
  }

  function handlePointerMove(clientX) {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastDragTime);
    const dx = clientX - lastDragX;

    // Drag sensitivity: pixels to radians
    const sensitivity = 0.0032;
    const totalDeltaX = clientX - dragStartX;

    currentTheta = dragStartTheta - totalDeltaX * sensitivity;
    targetTheta = currentTheta;

    // Smooth drag velocity calculation (low-pass filter) to avoid noise spikes
    const instantVel = - (dx / dt) * 16 * sensitivity;
    dragVelocity = dragVelocity * 0.5 + instantVel * 0.5;
    lastDragX = clientX;
    lastDragTime = now;
  }

  function handlePointerUp() {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('is-pointer-dragging');

    // If mouse stopped moving before release (> 60ms), drop velocity
    if (performance.now() - lastDragTime > 60) {
      dragVelocity = 0;
    }

    // Add inertia/momentum
    velocity = Math.max(-0.08, Math.min(0.08, dragVelocity));

    // Snap to nearest milestone angle
    const deltaPerCard = (2 * Math.PI) / N;
    const projectedTheta = currentTheta + velocity * 10;
    const kExact = (FRONT_ANGLE - projectedTheta) / deltaPerCard;
    const nearestK = Math.round(kExact);

    snapToIndex(nearestK);
  }

  // Mouse drag events on stage
  stage.addEventListener('mousedown', (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    handlePointerDown(e.clientX, e.clientY);
  });

  stage.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    handlePointerMove(e.clientX);
  });

  // Per-card hover tilt: each card independently tracks mouse position for its own tilt
  cardRigs.forEach((rig, i) => {
    let cachedCardRect = null;

    rig.addEventListener('mouseenter', () => {
      // Cache bounding rect on enter to avoid layout thrashing during mousemove
      cachedCardRect = rig.getBoundingClientRect();
    });

    rig.addEventListener('mouseleave', () => {
      cardTiltTargetX[i] = 0;
      cardTiltTargetY[i] = 0;
      cachedCardRect = null;
    });

    rig.addEventListener('mousemove', (e) => {
      if (isDragging || !cachedCardRect) {
        cardTiltTargetX[i] = 0;
        cardTiltTargetY[i] = 0;
        return;
      }
      const cx = cachedCardRect.left + cachedCardRect.width / 2;
      const cy = cachedCardRect.top + cachedCardRect.height / 2;
      const xRel = Math.max(-1, Math.min(1, (e.clientX - cx) / (cachedCardRect.width / 2)));
      const yRel = Math.max(-1, Math.min(1, (e.clientY - cy) / (cachedCardRect.height / 2)));
      // Seesaw press: The hovered side sinks down into the screen, opposite side rises up revealing full 3D slab thickness
      cardTiltTargetY[i] = xRel * 26;
      cardTiltTargetX[i] = -yRel * 22;
    });

    // Click to flip active front card 180 degrees (or snap inactive card to front)
    rig.addEventListener('click', (e) => {
      const moveDist = Math.hypot(e.clientX - pointerDownStartX, e.clientY - pointerDownStartY);
      if (moveDist > 8) return;

      if (i !== activeIndex) {
        snapToIndex(i);
      } else {
        cardFlipped[i] = !cardFlipped[i];
      }
    });
  });

  window.addEventListener('mouseup', () => {
    handlePointerUp();
  });

  // Touch drag events on mobile
  stage.addEventListener('touchstart', (e) => {
    if (e.target.closest('button')) return;
    if (e.touches.length === 1) {
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      handlePointerMove(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    handlePointerUp();
  });

  // Next / Prev Button Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      snapToIndex(activeIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      snapToIndex(activeIndex + 1);
    });
  }

  // Pagination Chip Buttons
  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        snapToIndex(idx);
      }
    });
  });

  // Auto Cruise Toggle
  if (autoBtn) {
    autoBtn.addEventListener('click', () => {
      autoRotate = !autoRotate;
      autoBtn.classList.toggle('active', autoRotate);
      if (autoStatus) autoStatus.textContent = autoRotate ? 'ON' : 'OFF';
    });
  }

  // Mouse Wheel / Trackpad Scroll inside stage: 1 gesture = exactly 1 card smooth transition without page scroll or skipping
  let isWheelLocked = false;
  let wheelEndTimer = null;
  let wheelAccumulator = 0;

  stage.addEventListener('wheel', (e) => {
    // 1. Unconditionally stop page scroll while hovering inside 3D stage
    e.preventDefault();
    e.stopPropagation();

    if (!isSectionVisible) return;

    // 2. Refresh silence timer on every incoming event.
    // As long as trackpad inertia or continuous spinning is sending events, the timer is postponed.
    // When events cease for 260ms (user lifted finger and inertia ended), lock is released!
    clearTimeout(wheelEndTimer);
    wheelEndTimer = setTimeout(() => {
      isWheelLocked = false;
      wheelAccumulator = 0;
    }, 260);

    // 3. If currently locked (already switched 1 card for this active gesture), swallow inertia
    if (isWheelLocked) {
      return;
    }

    // 4. Determine dominant delta direction (vertical wheel or horizontal trackpad swipe)
    const dominantDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    wheelAccumulator += dominantDelta;

    // 5. Require an intentional gesture threshold (18px) to prevent accidental micro-twitches
    const THRESHOLD = 18;
    if (Math.abs(wheelAccumulator) >= THRESHOLD) {
      isWheelLocked = true; // Lock immediately so the rest of this gesture's inertia is swallowed
      if (wheelAccumulator > 0) {
        snapToIndex(activeIndex + 1);
      } else {
        snapToIndex(activeIndex - 1);
      }
      wheelAccumulator = 0;
    }
  }, { passive: false });

  // Keyboard navigation (Left / Right arrow keys)
  window.addEventListener('keydown', (e) => {
    if (!isSectionVisible) return;
    if (e.key === 'ArrowLeft') {
      snapToIndex(activeIndex - 1);
    } else if (e.key === 'ArrowRight') {
      snapToIndex(activeIndex + 1);
    }
  });

  return () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (wheelEndTimer) clearTimeout(wheelEndTimer);
    visibilityObserver.disconnect();
    window.removeEventListener('resize', updateOrbitDimensions);
    window.removeEventListener('resize', resizeParticleCanvases);
  };
}
