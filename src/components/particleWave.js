/**
 * Cosmic Glowing Particle Wave & Constellation Background
 * Recreates the 3D undulating neon particle wave and constellation grid
 * with cyan and purple/magenta luminescent nodes.
 */

export function initParticleWave() {
  const canvas = document.getElementById('bgParticleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let width = 0;
  let height = 0;
  let time = 0;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // Constellation nodes in corners
  const constellationNodes = [
    { xRatio: 0.72, yRatio: 0.12, vx: 0.1, vy: 0.05, color: '#00F0FF', links: [1, 2, 4] },
    { xRatio: 0.82, yRatio: 0.16, vx: -0.05, vy: 0.1, color: '#A855F7', links: [0, 2, 3] },
    { xRatio: 0.92, yRatio: 0.10, vx: 0.08, vy: -0.08, color: '#E879F9', links: [0, 1, 3] },
    { xRatio: 0.95, yRatio: 0.28, vx: -0.07, vy: 0.06, color: '#00F0FF', links: [1, 2, 4] },
    { xRatio: 0.85, yRatio: 0.32, vx: 0.06, vy: -0.05, color: '#A855F7', links: [0, 3] },
    // Lower left cluster
    { xRatio: 0.05, yRatio: 0.78, vx: 0.08, vy: -0.04, color: '#00F0FF', links: [6, 7] },
    { xRatio: 0.12, yRatio: 0.88, vx: -0.05, vy: 0.06, color: '#E879F9', links: [5, 7, 8] },
    { xRatio: 0.18, yRatio: 0.82, vx: 0.07, vy: 0.05, color: '#A855F7', links: [5, 6, 8] },
    { xRatio: 0.24, yRatio: 0.95, vx: -0.06, vy: -0.06, color: '#00F0FF', links: [6, 7] }
  ];

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw glowing ambient radial spots
    const g1 = ctx.createRadialGradient(width * 0.75, height * 0.2, 10, width * 0.75, height * 0.2, 500);
    g1.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
    g1.addColorStop(0.5, 'rgba(232, 121, 249, 0.05)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, width, height);

    const g2 = ctx.createRadialGradient(width * 0.1, height * 0.8, 10, width * 0.1, height * 0.8, 400);
    g2.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, width, height);

    time += 0.015;

    // 2. Draw 3D undulating particle wave ribbon
    const rows = 28;
    const cols = 55;
    const spacingX = width / cols;
    const centerY = height * 0.52;

    for (let r = 0; r < rows; r++) {
      const z = (r / rows) * 2 - 1; // -1 to 1
      const alphaBase = 0.18 + (1 - Math.abs(z)) * 0.5;

      for (let c = 0; c < cols; c++) {
        // Curve equation for swirling cyber wave
        const x = c * spacingX + Math.sin(time + r * 0.15) * 12;
        const wave = Math.sin(c * 0.18 + time * 0.8) * 45 + Math.cos(r * 0.25 + time) * 35;
        const y = centerY + (r - rows / 2) * 14 + wave + Math.sin(c * 0.08) * 60;

        // Color transition between magenta, purple and cyan
        const colorFactor = (Math.sin(c * 0.1 + r * 0.15 + time) + 1) / 2;
        const radius = 1.2 + (1 - Math.abs(z)) * 1.5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (colorFactor > 0.6) {
          ctx.fillStyle = `rgba(232, 121, 249, ${alphaBase * 0.75})`;
        } else if (colorFactor > 0.3) {
          ctx.fillStyle = `rgba(168, 85, 247, ${alphaBase * 0.65})`;
        } else {
          ctx.fillStyle = `rgba(0, 240, 255, ${alphaBase * 0.8})`;
        }
        ctx.fill();
      }
    }

    // 3. Draw constellation networks
    const coords = constellationNodes.map(node => ({
      x: node.xRatio * width + Math.sin(time + node.xRatio * 10) * 15,
      y: node.yRatio * height + Math.cos(time + node.yRatio * 10) * 15,
      color: node.color,
      links: node.links
    }));

    // Draw lines
    ctx.lineWidth = 1;
    coords.forEach((node, i) => {
      node.links.forEach(targetIdx => {
        if (targetIdx > i && coords[targetIdx]) {
          const target = coords[targetIdx];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
          ctx.stroke();
        }
      });
    });

    // Draw constellation nodes with glow rings
    coords.forEach(node => {
      // Glow ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232, 121, 249, 0.15)';
      ctx.fill();

      // Node core
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(draw);
    }
  }

  window.addEventListener('resize', () => {
    resize();
    if (prefersReducedMotion) draw();
  });

  resize();
  draw();
}
