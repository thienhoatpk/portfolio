/**
 * Component 4 — Tech Stack Constellation
 * Interactive Canvas visualization with physics-lite orbital nodes,
 * connecting relationship filaments, category filters, interactive detail drawer,
 * and an accessible Grid View toggle.
 * 
 * Shows crisp SVG brand icons for each tech stack node on the Canvas,
 * in the sidebar detail drawer, and in the structured grid view.
 * Loaded directly from JSON configuration (/config/tech-stack.json).
 */

import { TECH_STACK_CONFIG, PROJECTS } from '../data/portfolioData.js';
import { getTechIconSvg, getTechIconCanvasImage, getTechMonogram } from '../data/techIcons.js';

export function initConstellation() {
  const canvas = document.getElementById('constellationCanvas');
  const detailPanel = document.getElementById('constellationDetail');
  const gridContainer = document.getElementById('constellationGridView');
  const toggleViewBtn = document.getElementById('toggleConstellationView');
  const canvasBox = document.querySelector('.constellation-canvas-box');
  const catButtonsContainer = document.querySelector('.constellation-cats');
  const titleEl = document.getElementById('constellationTitle');
  const subtitleEl = document.getElementById('constellationSubtitle');

  if (!canvas || !detailPanel) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let isCanvasActive = true;
  let isGridVisible = false;
  let hoveredNode = null;
  let activeCategory = 'All';

  function getActiveNodes(nodesList) {
    const list = (nodesList || []).filter(n => n.is_active !== 0 && n.is_active !== '0' && n.is_active !== false);
    const activeIds = new Set(list.map(n => n.id));
    return list.map(n => ({
      ...n,
      links: (n.links || []).filter(targetId => activeIds.has(targetId))
    }));
  }

  // 1. Start immediately with synchronous config so there's zero freeze/delay
  let config = TECH_STACK_CONFIG;
  let rawNodes = getActiveNodes(config.nodes);
  let categoryColors = config.categoryColors || {
    'Languages': '#00F0FF',
    'Backend Frameworks': '#A855F7',
    'Databases': '#EC4899',
    'Caching & Queues': '#10B981',
    'Infrastructure': '#F59E0B',
    'AI & Tools': '#38BDF8'
  };
  let selectedNode = rawNodes[0] || null;
  let nodes = [];

  function applyConfig(newConfig) {
    config = newConfig;
    rawNodes = getActiveNodes(config.nodes);
    categoryColors = config.categoryColors || categoryColors;

    if (titleEl && config.title) titleEl.textContent = config.title;
    if (subtitleEl && config.subtitle) subtitleEl.textContent = config.subtitle;

    const presentCats = new Set(rawNodes.map(n => n.category));
    const allConfigCats = config.categories || ['Languages', 'Backend Frameworks', 'Databases', 'Caching & Queues', 'Infrastructure', 'AI & Tools'];
    const categories = allConfigCats.filter(c => presentCats.has(c));

    if (catButtonsContainer) {
      catButtonsContainer.innerHTML = `
        <button class="filter-btn constellation-cat-btn active" data-cat="All">All Categories</button>
        ${categories.map(cat => `
          <button class="filter-btn constellation-cat-btn" data-cat="${cat}">${cat}</button>
        `).join('')}
      `;

      catButtonsContainer.querySelectorAll('.constellation-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.getAttribute('data-cat');
          catButtonsContainer.querySelectorAll('.constellation-cat-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-cat') === activeCategory);
          });
          if (isGridVisible) renderAccessibleGrid();
        });
      });
    }

    if ((!selectedNode || !rawNodes.some(n => n.id === selectedNode.id)) && rawNodes.length > 0) {
      selectedNode = rawNodes[0];
    }

    initPositions();
    renderSidebar();
    if (isGridVisible) renderAccessibleGrid();
  }

  function initPositions() {
    const width = canvas.clientWidth || 700;
    const height = canvas.clientHeight || 480;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = width / 2;
    const centerY = height / 2;
    const radiusStep = Math.min(width, height) * 0.38;

    const existingMap = new Map((nodes || []).map(n => [n.id, n]));

    nodes = rawNodes.map((n, i) => {
      const existing = existingMap.get(n.id);
      const angle = i * 2.39996; // Golden ratio spiral distribution
      const dist = 54 + Math.sqrt(i + 1) * (radiusStep / Math.sqrt(rawNodes.length || 1));
      const iconKey = n.icon || n.id;
      return {
        ...n,
        x: existing ? existing.x : (centerX + Math.cos(angle) * dist),
        y: existing ? existing.y : (centerY + Math.sin(angle) * dist),
        baseX: existing ? existing.baseX : (centerX + Math.cos(angle) * dist),
        baseY: existing ? existing.baseY : (centerY + Math.sin(angle) * dist),
        isDragged: false,
        baseDist: dist,
        baseAngle: angle,
        color: categoryColors[n.category] || '#00F0FF',
        monogram: getTechMonogram(iconKey),
        iconImg: getTechIconCanvasImage(iconKey)
      };
    });
  }

  function renderSidebar() {
    if (!selectedNode) return;
    const color = categoryColors[selectedNode.category] || 'var(--accent-cyan)';

    const relatedProjects = PROJECTS.filter(p => 
      p.tags.some(t => {
        const tLower = t.toLowerCase();
        const nameLower = selectedNode.name.toLowerCase();
        const idLower = selectedNode.id.toLowerCase();
        return tLower.includes(idLower) || nameLower.includes(tLower) || tLower.includes(nameLower.split(' ')[0]);
      })
    );

    detailPanel.style.setProperty('--node-color', color);
    detailPanel.classList.remove('anim-swap');
    void detailPanel.offsetWidth; // trigger reflow
    detailPanel.classList.add('anim-swap');

    detailPanel.innerHTML = `
      <div class="constellation-sidebar-header">
        <div class="constellation-sidebar-badge" style="border-color:${color}; box-shadow: 0 0 20px ${color}44;">
          ${getTechIconSvg(selectedNode.icon || selectedNode.id)}
        </div>
        <div class="constellation-header-text">
          <div class="node-meta-top">
            <span class="badge node-cat-badge" style="border-color:${color}; color:${color};">
              <span class="pulse-dot" style="background:${color}; box-shadow:0 0 8px ${color};"></span>
              ${selectedNode.category}
            </span>
            <span class="node-status-tag">ONLINE</span>
          </div>
          <h3 class="constellation-node-title">${selectedNode.name}</h3>
        </div>
      </div>

      <div class="arch-meta-list">
        <div class="arch-meta-block">
          <div class="arch-meta-header">
            <svg class="arch-meta-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span class="arch-meta-label">ARCHITECTURAL ROLE</span>
          </div>
          <div class="arch-role-box" style="border-left-color:${color};">
            <p class="arch-meta-val">${selectedNode.role}</p>
          </div>
        </div>

        <div class="arch-meta-block">
          <div class="arch-meta-header">
            <svg class="arch-meta-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span class="arch-meta-label">INTERCONNECTED TOPOLOGY</span>
            <span class="arch-meta-pill-tag">⇄ 2-WAY FLOW</span>
          </div>
          <div class="arch-tech-grid">
            ${(selectedNode.links || []).length > 0 ? (selectedNode.links || []).map(linkId => {
              const target = rawNodes.find(n => n.id === linkId);
              if (!target) return '';
              const targetColor = categoryColors[target.category] || '#00F0FF';
              return `
                <button type="button" class="tech-jump-card" data-jump="${target.id}" style="--target-color: ${targetColor};">
                  <div class="tech-jump-icon">
                    ${getTechIconSvg(target.icon || target.id)}
                  </div>
                  <div class="tech-jump-info">
                    <span class="tech-jump-name">${target.name}</span>
                    <span class="tech-jump-cat">${target.category}</span>
                  </div>
                  <span class="tech-jump-arrow">⇄</span>
                </button>
              `;
            }).join('') : `<div class="arch-empty-tip">Autonomous root component</div>`}
          </div>
        </div>

        <div class="arch-meta-block">
          <div class="arch-meta-header">
            <svg class="arch-meta-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span class="arch-meta-label">APPLIED IN PRODUCTION</span>
          </div>
          <div class="arch-projects-wrap">
            ${relatedProjects.length > 0 
              ? relatedProjects.map(p => `
                <a href="#projects" class="arch-project-chip">
                  <span class="chip-dot" style="background:${color};"></span>
                  <span class="chip-title">${p.title}</span>
                  <span class="chip-arrow">↗</span>
                </a>
              `).join('')
              : `<div class="arch-empty-tip">Core Infrastructure &amp; Foundation Services</div>`
            }
          </div>
        </div>
      </div>

      <div class="constellation-sidebar-footer">
        <span class="footer-hud-dot"></span>
        <span>Click any node to navigate • Drag to reposition</span>
      </div>
    `;

    detailPanel.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const jumpId = btn.getAttribute('data-jump');
        const next = rawNodes.find(n => n.id === jumpId);
        if (next) {
          selectedNode = next;
          renderSidebar();
        }
      });
    });
  }

  function renderAccessibleGrid() {
    if (!gridContainer) return;
    gridContainer.innerHTML = rawNodes
      .filter(n => activeCategory === 'All' || n.category === activeCategory)
      .map(n => {
        const color = categoryColors[n.category] || '#00F0FF';
        return `
          <div class="tech-grid-card" data-id="${n.id}" tabindex="0">
            <div class="tech-card-icon-header">
              <div class="tech-node-icon-box" style="border-color:${color};">
                ${getTechIconSvg(n.icon || n.id)}
              </div>
              <div>
                <span class="badge" style="border-color:${color}; color:${color}; font-size:0.6875rem;">${n.category}</span>
                <strong style="color:var(--text-primary); font-size:0.9375rem; display:block; margin-top:2px;">${n.name}</strong>
              </div>
            </div>
            <p style="color:var(--text-secondary); font-size:0.8125rem; line-height:1.5;">${n.role}</p>
            <div style="font-family:var(--font-mono); font-size:0.6875rem; color:var(--text-muted); margin-top:4px;">
              Links: ${(n.links || []).join(', ')}
            </div>
          </div>
        `;
      }).join('');

    gridContainer.querySelectorAll('.tech-grid-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const node = rawNodes.find(n => n.id === id);
        if (node) {
          selectedNode = node;
          renderSidebar();
        }
      });
    });
  }

  function draw() {
    if (!isCanvasActive || isGridVisible) {
      animationFrameId = requestAnimationFrame(draw);
      return;
    }

    // Always schedule next frame first so animation NEVER dies
    animationFrameId = requestAnimationFrame(draw);

    try {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const now = performance.now() * 0.001;

      // 1. Draw connecting relationship lines with gentle organic curves and bidirectional energy pulses
      const drawnLinks = new Set();
      nodes.forEach(source => {
        (source.links || []).forEach(targetId => {
          const target = nodes.find(n => n.id === targetId);
          if (!target) return;

          const linkKey = [source.id, target.id].sort().join('--');
          if (drawnLinks.has(linkKey)) return;
          drawnLinks.add(linkKey);

          const isHighlighted = (source.id === selectedNode?.id || target.id === selectedNode?.id || source.id === hoveredNode?.id || target.id === hoveredNode?.id);

          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.hypot(dx, dy) || 1;
          const curveAmp = Math.min(dist * 0.12, 22);
          const sign = (source.id < target.id) ? 1 : -1;
          const cx = (source.x + target.x) / 2 + (-dy / dist) * curveAmp * sign;
          const cy = (source.y + target.y) / 2 + (dx / dist) * curveAmp * sign;

          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.quadraticCurveTo(cx, cy, target.x, target.y);

          if (isHighlighted) {
            ctx.setLineDash([]);
            const grad = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
            grad.addColorStop(0, source.color || '#00F0FF');
            grad.addColorStop(1, target.color || '#E879F9');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Hiệu ứng 2 chiều: Bidirectional Glowing Energy Packets
            const speed = 0.65;
            // Packet 1: Forward (source -> target)
            const t1 = ((now * speed) + (source.baseDist || 0) * 0.02) % 1;
            const px1 = (1 - t1) * (1 - t1) * source.x + 2 * (1 - t1) * t1 * cx + t1 * t1 * target.x;
            const py1 = (1 - t1) * (1 - t1) * source.y + 2 * (1 - t1) * t1 * cy + t1 * t1 * target.y;

            ctx.beginPath();
            ctx.arc(px1, py1, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(px1, py1, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            // Packet 2: Reverse (target -> source, opposing direction)
            const t2 = (1 - ((now * speed + (source.baseDist || 0) * 0.02 + 0.5) % 1));
            const px2 = (1 - t2) * (1 - t2) * source.x + 2 * (1 - t2) * t2 * cx + t2 * t2 * target.x;
            const py2 = (1 - t2) * (1 - t2) * source.y + 2 * (1 - t2) * t2 * cy + t2 * t2 * target.y;

            ctx.beginPath();
            ctx.arc(px2, py2, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232, 121, 249, 0.4)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(px2, py2, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
          } else {
            ctx.setLineDash([3, 5]);
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.16)';
            ctx.lineWidth = 0.85;
            ctx.stroke();

            // Subtle ambient bidirectional flow
            const speed = 0.35;
            const tAmb1 = ((now * speed) + (source.baseDist || 0) * 0.02) % 1;
            const apx1 = (1 - tAmb1) * (1 - tAmb1) * source.x + 2 * (1 - tAmb1) * tAmb1 * cx + tAmb1 * tAmb1 * target.x;
            const apy1 = (1 - tAmb1) * (1 - tAmb1) * source.y + 2 * (1 - tAmb1) * tAmb1 * cy + tAmb1 * tAmb1 * target.y;

            ctx.beginPath();
            ctx.arc(apx1, apy1, 1.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
            ctx.fill();

            const tAmb2 = (1 - ((now * speed + (source.baseDist || 0) * 0.02 + 0.5) % 1));
            const apx2 = (1 - tAmb2) * (1 - tAmb2) * source.x + 2 * (1 - tAmb2) * tAmb2 * cx + tAmb2 * tAmb2 * target.x;
            const apy2 = (1 - tAmb2) * (1 - tAmb2) * source.y + 2 * (1 - tAmb2) * tAmb2 * cy + tAmb2 * tAmb2 * target.y;

            ctx.beginPath();
            ctx.arc(apx2, apy2, 1.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232, 121, 249, 0.3)';
            ctx.fill();
          }
        });
      });
      ctx.setLineDash([]); // Reset line dash for nodes

      // 2. Draw nodes with SVG icons and fallbacks
      nodes.forEach(node => {
        const isSelected = (node.id === selectedNode?.id);
        const isHovered = (node.id === hoveredNode?.id);
        const isFilteredOut = (activeCategory !== 'All' && node.category !== activeCategory);

        if (!prefersReducedMotion && !node.isDragged) {
          node.x += Math.sin(now + node.baseAngle) * 0.12;
          node.y += Math.cos(now + node.baseAngle) * 0.12;
        }

        // Slightly larger nodes ("các node to lên 1 xíu")
        const radius = isSelected ? 22 : (isHovered ? 19 : 16.5);
        const iconSize = isSelected ? 25 : (isHovered ? 22 : 18);
        const alpha = isFilteredOut ? 0.25 : 1.0;
        node.currentRadius = radius;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Outer glow
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(232, 121, 249, 0.25)' : 'rgba(0, 240, 255, 0.2)';
          ctx.fill();
        }

        // Circular badge background
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0B091D';
        ctx.fill();

        // Neon border - refined thin and sharp
        ctx.strokeStyle = isSelected ? '#E879F9' : (isHovered ? '#00F0FF' : (node.color || 'rgba(0, 240, 255, 0.6)'));
        ctx.lineWidth = isSelected ? 1.5 : (isHovered ? 1.2 : 0.85);
        ctx.stroke();

        // Draw SVG Brand Icon
        let iconDrawn = false;
        if (node.iconImg && node.iconImg.complete && node.iconImg.naturalWidth > 0) {
          try {
            ctx.drawImage(node.iconImg, node.x - iconSize / 2, node.y - iconSize / 2, iconSize, iconSize);
            iconDrawn = true;
          } catch (e) {
            iconDrawn = false;
          }
        }

        // Monogram fallback if image is still loading or decoding
        if (!iconDrawn) {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color;
          ctx.font = '700 11px "JetBrains Mono", monospace';
          ctx.fillText(node.monogram || '•', node.x, node.y);
        }

        // Text label below node
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = isSelected ? '#FFFFFF' : (isHovered ? '#00F0FF' : '#CBD5E1');
        ctx.font = isSelected ? '700 12px "JetBrains Mono", monospace' : '500 10.5px "JetBrains Mono", monospace';
        ctx.fillText(node.name, node.x, node.y + radius + 15);

        ctx.restore();
      });
    } catch (renderError) {
      console.error('Error rendering constellation frame:', renderError);
    }
  }

  // Drag and Drop & Pointer interactions
  let draggedNode = null;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function findNodeAt(x, y) {
    return nodes.find(n => {
      const hitDist = (n.currentRadius || 17) + 8;
      return Math.hypot(n.x - x, n.y - y) <= hitDist;
    }) || null;
  }

  function handlePointerDown(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const clicked = findNodeAt(x, y);
    if (clicked) {
      draggedNode = clicked;
      isDragging = false;
      dragStartX = clientX;
      dragStartY = clientY;
      dragOffsetX = clicked.x - x;
      dragOffsetY = clicked.y - y;
      clicked.isDragged = true;
      canvas.style.cursor = 'grabbing';
    }
  }

  function handlePointerMove(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (draggedNode) {
      const moveDist = Math.hypot(clientX - dragStartX, clientY - dragStartY);
      if (moveDist > 3) {
        isDragging = true;
      }
      if (isDragging) {
        const width = canvas.clientWidth || 700;
        const height = canvas.clientHeight || 480;
        const targetX = x + dragOffsetX;
        const targetY = y + dragOffsetY;
        draggedNode.x = Math.max(35, Math.min(width - 35, targetX));
        draggedNode.y = Math.max(35, Math.min(height - 35, targetY));
        draggedNode.baseX = draggedNode.x;
        draggedNode.baseY = draggedNode.y;
        canvas.style.cursor = 'grabbing';
        return;
      }
    }

    hoveredNode = findNodeAt(x, y);
    canvas.style.cursor = hoveredNode ? 'grab' : 'default';
  }

  function handlePointerUp() {
    if (draggedNode) {
      if (!isDragging) {
        selectedNode = draggedNode;
        renderSidebar();
      }
      draggedNode.isDragged = false;
      draggedNode = null;
      isDragging = false;
      canvas.style.cursor = hoveredNode ? 'grab' : 'default';
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    handlePointerDown(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    handlePointerMove(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    handlePointerUp();
  });

  canvas.addEventListener('mouseleave', () => {
    if (!draggedNode) {
      hoveredNode = null;
      canvas.style.cursor = 'default';
    }
  });

  // Touch support for mobile / touchpads
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      if (draggedNode) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (draggedNode && e.touches.length === 1) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    handlePointerUp();
  });

  // Toggle View button
  if (toggleViewBtn) {
    toggleViewBtn.onclick = () => {
      isGridVisible = !isGridVisible;
      if (isGridVisible) {
        toggleViewBtn.textContent = 'Orbital View';
        canvasBox.style.display = 'none';
        gridContainer.classList.add('active');
        renderAccessibleGrid();
      } else {
        toggleViewBtn.textContent = 'Structured Grid';
        canvasBox.style.display = 'block';
        gridContainer.classList.remove('active');
        initPositions();
      }
    };
  }

  // IntersectionObserver to pause rendering when off-screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isCanvasActive = entry.isIntersecting;
    });
  }, { threshold: 0.1 });

  observer.observe(canvas);

  window.addEventListener('resize', () => {
    if (!isGridVisible) {
      initPositions();
    }
  });

  // Initialize immediately
  applyConfig(TECH_STACK_CONFIG);
  draw();

  // Asynchronously check for dynamic JSON updates at runtime
  fetch('/config/tech-stack.json')
    .then(r => r.ok ? r.json() : null)
    .then(remoteConfig => {
      if (remoteConfig) {
        applyConfig(remoteConfig);
      }
    })
    .catch(err => {
      // Offline or local fallback is already running
    });
}
