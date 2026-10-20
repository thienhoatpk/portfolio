/**
 * Component 4 — Tech Stack Constellation
 * Interactive Canvas visualization with physics-lite orbital nodes,
 * connecting relationship filaments, category filters, interactive detail drawer,
 * and an accessible Grid View toggle.
 * 
 * Loaded directly from JSON configuration (/config/tech-stack.json).
 */

import { TECH_STACK_CONFIG, PROJECTS } from '../data/portfolioData.js';

export async function initConstellation() {
  const canvas = document.getElementById('constellationCanvas');
  const detailPanel = document.getElementById('constellationDetail');
  const gridContainer = document.getElementById('constellationGridView');
  const toggleViewBtn = document.getElementById('toggleConstellationView');
  const canvasBox = document.querySelector('.constellation-canvas-box');
  const catButtonsContainer = document.querySelector('.constellation-cats');
  const titleEl = document.getElementById('constellationTitle');
  const subtitleEl = document.getElementById('constellationSubtitle');

  if (!canvas || !detailPanel) return;

  // 1. Load config dynamically from JSON file (/config/tech-stack.json)
  let config = TECH_STACK_CONFIG;
  try {
    const res = await fetch('/config/tech-stack.json');
    if (res.ok) {
      config = await res.json();
    }
  } catch (err) {
    console.warn('Could not fetch /config/tech-stack.json, using bundled config', err);
  }

  // Update title & subtitle if provided in JSON
  if (titleEl && config.title) titleEl.textContent = config.title;
  if (subtitleEl && config.subtitle) subtitleEl.textContent = config.subtitle;

  const rawNodes = config.nodes || [];
  const categoryColors = config.categoryColors || {
    'Languages': '#00F0FF',
    'Backend Frameworks': '#A855F7',
    'Databases': '#EC4899',
    'Caching & Queues': '#10B981',
    'Infrastructure': '#F59E0B',
    'AI & Tools': '#38BDF8'
  };

  const categories = config.categories || ['Languages', 'Backend Frameworks', 'Databases', 'Caching & Queues', 'Infrastructure', 'AI & Tools'];

  // Dynamically render category filter buttons from JSON
  if (catButtonsContainer) {
    catButtonsContainer.innerHTML = `
      <button class="filter-btn constellation-cat-btn active" data-cat="All">All Categories</button>
      ${categories.map(cat => `
        <button class="filter-btn constellation-cat-btn" data-cat="${cat}">${cat}</button>
      `).join('')}
    `;
  }

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let isCanvasActive = true;
  let isGridVisible = false;
  let selectedNode = rawNodes[0] || null;
  let hoveredNode = null;
  let activeCategory = 'All';

  // Node simulation coordinates
  let nodes = [];

  function initPositions() {
    const width = canvas.clientWidth || 700;
    const height = canvas.clientHeight || 480;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = width / 2;
    const centerY = height / 2;
    const radiusStep = Math.min(width, height) * 0.38;

    nodes = rawNodes.map((n, i) => {
      // Golden ratio spiral distribution for elegant cosmic layout
      const angle = i * 2.39996; // ~137.5 degrees
      const dist = 40 + Math.sqrt(i + 1) * (radiusStep / Math.sqrt(rawNodes.length || 1));
      return {
        ...n,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        baseDist: dist,
        baseAngle: angle,
        color: categoryColors[n.category] || '#00F0FF'
      };
    });
  }

  function renderSidebar() {
    if (!selectedNode) return;
    const color = categoryColors[selectedNode.category] || 'var(--accent-cyan)';

    // Find related projects using this tech
    const relatedProjects = PROJECTS.filter(p => 
      p.tags.some(t => t.toLowerCase().includes(selectedNode.name.toLowerCase().split(' ')[0]))
    );

    detailPanel.innerHTML = `
      <div>
        <span class="badge" style="border-color:${color}; color:${color};">
          ${selectedNode.category}
        </span>
        <h3 class="constellation-node-title">${selectedNode.name}</h3>
      </div>

      <div class="arch-meta-list">
        <div class="arch-meta-row">
          <span class="arch-meta-label">Architectural Role</span>
          <p class="arch-meta-val">${selectedNode.role}</p>
        </div>

        <div class="arch-meta-row">
          <span class="arch-meta-label">Connected Technologies</span>
          <div class="arch-tech-pills">
            ${(selectedNode.links || []).map(linkId => {
              const target = rawNodes.find(n => n.id === linkId);
              return target ? `<span class="badge badge-purple" style="cursor:pointer;" data-jump="${target.id}">⇄ ${target.name}</span>` : '';
            }).join('')}
          </div>
        </div>

        <div class="arch-meta-row">
          <span class="arch-meta-label">Applied in Projects</span>
          <div class="arch-tech-pills">
            ${relatedProjects.length > 0 
              ? relatedProjects.map(p => `<span class="badge badge-cyan">${p.title}</span>`).join('')
              : '<span style="color:var(--text-muted); font-size:0.8125rem;">Core Systems & Internal Tooling</span>'
            }
          </div>
        </div>
      </div>
    `;

    // Allow jumping to connected node
    detailPanel.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', () => {
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
            <span class="badge" style="border-color:${color}; color:${color}; width:fit-content;">${n.category}</span>
            <strong style="color:var(--text-primary); font-size:1rem;">${n.name}</strong>
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
    if (!isCanvasActive || isGridVisible) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Draw connecting edges first
    ctx.lineWidth = 1;
    nodes.forEach(source => {
      (source.links || []).forEach(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (!target) return;

        const isHighlighted = (source.id === selectedNode?.id || target.id === selectedNode?.id);

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isHighlighted) {
          ctx.strokeStyle = 'rgba(232, 121, 249, 0.7)';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });
    });

    // Draw nodes
    const now = performance.now() * 0.001;
    nodes.forEach(node => {
      const isSelected = (node.id === selectedNode?.id);
      const isHovered = (node.id === hoveredNode?.id);
      const isFilteredOut = (activeCategory !== 'All' && node.category !== activeCategory);

      // Subtle float animation if motion permitted
      if (!prefersReducedMotion) {
        node.x += Math.sin(now + node.baseAngle) * 0.15;
        node.y += Math.cos(now + node.baseAngle) * 0.15;
      }

      const radius = isSelected ? 8 : (isHovered ? 7 : 5);
      const alpha = isFilteredOut ? 0.2 : 1.0;

      // Outer glow for selected
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(232, 121, 249, 0.25)' : 'rgba(0, 240, 255, 0.25)';
        ctx.fill();
      }

      // Main node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.globalAlpha = alpha;
      ctx.fill();

      // Border
      ctx.strokeStyle = isSelected ? '#FFFFFF' : '#080B12';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text label
      ctx.fillStyle = isSelected ? '#E879F9' : (isHovered ? '#FFFFFF' : '#A5B4FC');
      ctx.font = isSelected ? '700 11px "JetBrains Mono", monospace' : '500 10px "JetBrains Mono", monospace';
      ctx.fillText(node.name, node.x + radius + 6, node.y + 4);
      ctx.globalAlpha = 1.0;
    });

    animationFrameId = requestAnimationFrame(draw);
  }

  // Pointer interactions on canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    hoveredNode = nodes.find(n => {
      const dist = Math.hypot(n.x - x, n.y - y);
      return dist <= 20;
    }) || null;

    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = nodes.find(n => {
      const dist = Math.hypot(n.x - x, n.y - y);
      return dist <= 22;
    });

    if (clicked) {
      selectedNode = clicked;
      renderSidebar();
    }
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
        draw();
      }
    };
  }

  // Category filter chips
  if (catButtonsContainer) {
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

  // IntersectionObserver to pause rendering when off-screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isCanvasActive = entry.isIntersecting;
      if (isCanvasActive && !isGridVisible) {
        cancelAnimationFrame(animationFrameId);
        draw();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(canvas);

  window.addEventListener('resize', () => {
    if (!isGridVisible) {
      initPositions();
    }
  });

  initPositions();
  renderSidebar();
  draw();
}
