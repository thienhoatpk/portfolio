/**
 * Component 2 — System Architecture Visualizer (Sliding Drawer Edition)
 * Interactive SVG diagram with connected nodes, pulsing data flow lines,
 * category filters, interactive detail drawer, and accessible text view.
 * 
 * Slides in from the right edge when any project card is clicked.
 */

import { ARCHITECTURE_SYSTEMS, PROJECTS } from '../data/portfolioData.js';

let currentSystem = ARCHITECTURE_SYSTEMS[0];
let currentProject = PROJECTS[0];
let selectedNodeId = 'api-gateway';
let activeFilter = 'All';
let isFlowActive = true;
let isAccessibleView = false;
let activeTab = 'topology'; // 'topology' | 'casestudy'
let isInitialized = false;

const nodeColors = {
  'Client / Frontend': '#38BDF8',
  'API Gateway': '#00E5FF',
  'Backend Service': '#8B5CF6',
  'Cache': '#F59E0B',
  'Message Queue': '#10B981',
  'Database': '#EC4899',
  'AI Service': '#A78BFA',
  'External Integration': '#F97316'
};

export function openArchitectureDrawer(projectId) {
  // Find project
  const project = PROJECTS.find(p => p.id === projectId) || PROJECTS[0];
  currentProject = project;

  // Find system matching project
  const system = ARCHITECTURE_SYSTEMS.find(s => s.projectId === projectId || s.id === projectId) || ARCHITECTURE_SYSTEMS[0];
  currentSystem = system;

  // Select initial node
  selectedNodeId = (system.nodes[1] && system.nodes[1].id) || system.nodes[0]?.id || '';
  activeFilter = 'All';
  activeTab = 'topology';

  // Update header text in sliding drawer
  const titleEl = document.getElementById('archDrawerTitle');
  const subtitleEl = document.getElementById('archDrawerSubtitle');
  const catEl = document.getElementById('archDrawerProjectCategory');

  if (titleEl) titleEl.textContent = `${project.title} — System Topology`;
  if (subtitleEl) subtitleEl.textContent = project.summary || system.description;
  if (catEl) catEl.textContent = project.category || 'System Architecture';

  // Render content
  renderVisualizer();
  renderCaseStudyTab();
  updateTabUI();

  // Show sliding drawer
  const backdrop = document.getElementById('archDrawerBackdrop');
  if (backdrop) {
    backdrop.classList.add('active');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    const closeBtn = document.getElementById('archDrawerClose');
    if (closeBtn) closeBtn.focus();
  }
}

export function closeArchitectureDrawer() {
  const backdrop = document.getElementById('archDrawerBackdrop');
  if (backdrop) {
    backdrop.classList.remove('active');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function updateTabUI() {
  document.querySelectorAll('.arch-drawer-tab').forEach(tab => {
    const t = tab.getAttribute('data-tab');
    tab.classList.toggle('active', t === activeTab);
  });

  const visualizerContainer = document.getElementById('archVisualizer');
  const csContainer = document.getElementById('archDrawerCaseStudy');

  if (visualizerContainer && csContainer) {
    if (activeTab === 'topology') {
      visualizerContainer.style.display = 'flex';
      csContainer.style.display = 'none';
    } else {
      visualizerContainer.style.display = 'none';
      csContainer.style.display = 'flex';
    }
  }
}

function renderVisualizer() {
  const container = document.getElementById('archVisualizer');
  if (!container) return;

  const system = currentSystem;

  container.innerHTML = `
    <div class="arch-controls">
      <div class="arch-subsystem-filters">
        <button class="filter-btn ${activeFilter === 'All' ? 'active' : ''}" data-filter="All">All Subsystems</button>
        ${(system.subsystems || []).map(sub => `
          <button class="filter-btn ${activeFilter === sub ? 'active' : ''}" data-filter="${sub}">${sub}</button>
        `).join('')}
      </div>
      <div class="arch-actions">
        <button class="btn btn-secondary btn-sm" id="toggleFlowBtn">
          <span class="status-indicator" style="background:${isFlowActive ? '#10B981' : '#64748B'}; width:6px; height:6px; border-radius:50%; display:inline-block; box-shadow:${isFlowActive ? '0 0 6px #10B981' : 'none'};"></span>
          Data Flow: ${isFlowActive ? 'Active' : 'Paused'}
        </button>
        <button class="btn btn-secondary btn-sm" id="toggleAccessibleBtn">
          ${isAccessibleView ? 'Diagram View' : 'Accessible Table'}
        </button>
      </div>
    </div>

    <div class="arch-layout">
      <div class="arch-canvas-wrap" id="canvasWrap">
        ${isAccessibleView ? renderAccessibleTable() : renderSvgDiagram()}
      </div>

      <div class="arch-sidebar" id="archSidebar">
        ${renderSidebar()}
      </div>
    </div>
  `;

  bindVisualizerEvents();
}

function renderSvgDiagram() {
  const system = currentSystem;

  // Generate edges
  let edgesSvg = '';
  system.nodes.forEach(sourceNode => {
    const sourceCoord = { x: sourceNode.x, y: sourceNode.y };

    (sourceNode.connections || []).forEach(targetId => {
      const targetNode = system.nodes.find(n => n.id === targetId);
      if (!targetNode) return;
      const targetCoord = { x: targetNode.x, y: targetNode.y };

      const isHighlighted = (sourceNode.id === selectedNodeId || targetId === selectedNodeId);
      const flowClass = isFlowActive 
        ? (isHighlighted ? 'arch-flow-edge active-flow' : 'arch-flow-edge') 
        : 'arch-flow-edge';

      const strokeColor = isHighlighted ? 'var(--accent-cyan)' : 'rgba(75, 85, 99, 0.45)';

      const startX = sourceCoord.x + 120;
      const startY = sourceCoord.y + 26;
      const endX = targetCoord.x - 2;
      const endY = targetCoord.y + 26;

      let d = '';
      if (endX > startX) {
        const midX = (startX + endX) / 2;
        d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
      } else {
        const loopOffset = 40;
        d = `M ${startX} ${startY} C ${startX + loopOffset} ${startY}, ${endX - loopOffset} ${endY}, ${endX} ${endY}`;
      }

      edgesSvg += `
        <path d="${d}" 
              class="${flowClass}" 
              stroke="${strokeColor}" 
              fill="none" 
              marker-end="url(#arrowhead)"/>
      `;
    });
  });

  // Generate node elements
  let nodesSvg = '';
  system.nodes.forEach(node => {
    const coord = { x: node.x, y: node.y };

    const isSelected = (node.id === selectedNodeId);
    const isConnected = system.nodes.some(n => 
      (n.id === selectedNodeId && (n.connections || []).includes(node.id)) ||
      (node.id === selectedNodeId && (node.connections || []).includes(n.id))
    );

    const color = nodeColors[node.category] || '#00E5FF';
    const groupClass = `arch-node-group ${isSelected ? 'selected' : ''} ${isConnected ? 'connected' : ''}`;

    nodesSvg += `
      <g class="${groupClass}" data-node-id="${node.id}" transform="translate(${coord.x}, ${coord.y})" tabindex="0" role="button" aria-label="${node.label}">
        <!-- Background Box -->
        <rect class="arch-node-box" 
              x="0" y="0" 
              width="120" height="52" 
              rx="8" 
              fill="#0D1220" 
              stroke="${isSelected ? 'var(--accent-cyan)' : (isConnected ? 'var(--accent-purple)' : '#263249')}" 
              stroke-width="${isSelected ? '2.5' : '1.5'}" />

        <!-- Category indicator stripe -->
        <rect x="0" y="0" width="4" height="52" rx="2" fill="${color}" />

        <!-- Node Label -->
        <text x="12" y="22" fill="#F1F5F9" font-size="11" font-weight="600" font-family="'JetBrains Mono', monospace">
          ${escapeXml(truncateText(node.label, 15))}
        </text>

        <!-- Node Category / Protocol -->
        <text x="12" y="38" fill="${color}" font-size="9" font-family="'JetBrains Mono', monospace">
          ${escapeXml(truncateText(node.protocol || node.category, 16))}
        </text>
      </g>
    `;
  });

  return `
    <svg class="arch-grid-canvas" viewBox="0 0 1020 440" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 7 3, 0 6" fill="var(--accent-cyan)" opacity="0.85"/>
        </marker>
      </defs>

      <!-- Subtle Canvas Grid Lines -->
      <g opacity="0.12">
        <line x1="0" y1="90" x2="1020" y2="90" stroke="#263249" stroke-dasharray="4 4"/>
        <line x1="0" y1="190" x2="1020" y2="190" stroke="#263249" stroke-dasharray="4 4"/>
        <line x1="0" y1="290" x2="1020" y2="290" stroke="#263249" stroke-dasharray="4 4"/>
        <line x1="0" y1="390" x2="1020" y2="390" stroke="#263249" stroke-dasharray="4 4"/>
      </g>

      <!-- Edges -->
      <g id="edgesGroup">${edgesSvg}</g>

      <!-- Nodes -->
      <g id="nodesGroup">${nodesSvg}</g>
    </svg>
  `;
}

function renderAccessibleTable() {
  const system = currentSystem;

  return `
    <div style="padding: 24px; overflow-x: auto; color: var(--text-secondary); font-size: 0.875rem;">
      <h4 style="color:var(--accent-cyan); margin-bottom:12px; font-family:var(--font-mono);">Textual Architecture Topology</h4>
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="border-bottom:1px solid var(--border-default); color:var(--text-primary); font-family:var(--font-mono); font-size:0.75rem;">
            <th style="padding:8px;">SERVICE</th>
            <th style="padding:8px;">CATEGORY</th>
            <th style="padding:8px;">PROTOCOL</th>
            <th style="padding:8px;">TARGET CONNECTIONS</th>
          </tr>
        </thead>
        <tbody>
          ${system.nodes.map(n => `
            <tr style="border-bottom:1px solid rgba(38,50,73,0.4); cursor:pointer;" data-node-id="${n.id}" class="${n.id === selectedNodeId ? 'selected-row' : ''}">
              <td style="padding:10px 8px; color:var(--text-primary); font-weight:600;">${n.label}</td>
              <td style="padding:10px 8px; color:${nodeColors[n.category] || 'var(--text-secondary)'}; font-family:var(--font-mono); font-size:0.8125rem;">${n.category}</td>
              <td style="padding:10px 8px; font-family:var(--font-mono); font-size:0.75rem;">${n.protocol}</td>
              <td style="padding:10px 8px; font-family:var(--font-mono); font-size:0.75rem;">${(n.connections || []).length ? n.connections.join(', ') : 'Terminal Sink'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderSidebar() {
  const system = currentSystem;
  const node = system.nodes.find(n => n.id === selectedNodeId) || system.nodes[0];
  if (!node) return '<div class="arch-detail-header"><p>Select a node to inspect telemetry.</p></div>';

  const categoryColor = nodeColors[node.category] || 'var(--accent-cyan)';

  return `
    <div class="arch-detail-header">
      <span class="badge" style="border-color:${categoryColor}; color:${categoryColor};">
        ${node.category}
      </span>
      <h3 class="arch-node-title">${node.label}</h3>
      <p style="color:var(--text-muted); font-size:0.8125rem; font-family:var(--font-mono); margin-top:2px;">
        Status: <span style="color:#10B981;">● ${node.status || 'Active'}</span> // Protocol: ${node.protocol || 'TCP'}
      </p>
    </div>

    <div class="arch-meta-list">
      <div class="arch-meta-row">
        <span class="arch-meta-label">Responsibilities & Behavior</span>
        <p class="arch-meta-val">${node.description || 'Core distributed service node.'}</p>
      </div>

      <div class="arch-meta-row">
        <span class="arch-meta-label">Technical Specification</span>
        <p class="arch-meta-val" style="font-size:0.8125rem; line-height:1.5;">${node.details || 'Zero-overhead internal telemetry routing.'}</p>
      </div>

      <div class="arch-meta-row">
        <span class="arch-meta-label">Underlying Technologies</span>
        <div class="arch-tech-pills">
          ${(node.tech || []).map(t => `<span class="badge badge-cyan">${t}</span>`).join('')}
        </div>
      </div>

      <div class="arch-meta-row">
        <span class="arch-meta-label">Downstream Connections</span>
        <div class="arch-tech-pills">
          ${(node.connections || []).length > 0 
            ? node.connections.map(c => `<span class="badge badge-purple">→ ${c}</span>`).join('')
            : '<span style="color:var(--text-muted); font-size:0.8125rem;">None (Terminal Sink)</span>'
          }
        </div>
      </div>
    </div>
  `;
}

function renderCaseStudyTab() {
  const csContainer = document.getElementById('archDrawerCaseStudy');
  if (!csContainer) return;

  const project = currentProject;
  const cs = project.caseStudy;

  if (!cs) {
    csContainer.innerHTML = `
      <div style="padding: 32px; color: var(--text-muted); text-align: center;">
        <p>No technical case study writeup available for this system.</p>
      </div>
    `;
    return;
  }

  csContainer.innerHTML = `
    <div class="cs-section">
      <span class="cs-heading">01 // Architectural Overview</span>
      <p class="cs-text">${cs.overview}</p>
    </div>

    <div class="cs-section">
      <span class="cs-heading">02 // The Engineering Problem</span>
      <p class="cs-text">${cs.problem}</p>
    </div>

    <div class="cs-section">
      <span class="cs-heading">03 // Role & Architectural Responsibilities</span>
      <p class="cs-text">${cs.role}</p>
    </div>

    <div class="cs-section">
      <span class="cs-heading">04 // System Topology & Flow</span>
      <p class="cs-text" style="font-family: var(--font-mono); background: #070B13; padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-default);">${cs.architecture}</p>
    </div>

    <div class="cs-section">
      <span class="cs-heading">05 // Key Technical Decisions</span>
      <ul class="cs-list">
        ${(cs.decisions || []).map(d => `<li>${d}</li>`).join('')}
      </ul>
    </div>

    <div class="cs-section">
      <span class="cs-heading">06 // Challenges & Solutions</span>
      <ul class="cs-list">
        ${(cs.challenges || []).map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>

    <div class="cs-section">
      <span class="cs-heading">07 // Results & Operational Lessons</span>
      <p class="cs-text">${cs.results}</p>
    </div>

    <div class="cs-section">
      <span class="cs-heading">08 // Technology Stack</span>
      <div class="arch-tech-pills">
        ${(cs.technologies || []).map(t => `<span class="badge badge-cyan">${t}</span>`).join('')}
      </div>
    </div>
  `;
}

function bindVisualizerEvents() {
  const container = document.getElementById('archVisualizer');
  if (!container) return;

  // Node selection in SVG
  container.querySelectorAll('.arch-node-group').forEach(group => {
    group.addEventListener('click', () => {
      selectedNodeId = group.getAttribute('data-node-id');
      renderVisualizer();
    });
    group.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectedNodeId = group.getAttribute('data-node-id');
        renderVisualizer();
      }
    });
  });

  // Subsystem filter buttons
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.getAttribute('data-filter');
      renderVisualizer();
    });
  });

  // Toggle flow animation
  const flowBtn = container.querySelector('#toggleFlowBtn');
  if (flowBtn) {
    flowBtn.addEventListener('click', () => {
      isFlowActive = !isFlowActive;
      renderVisualizer();
    });
  }

  // Toggle accessible view
  const accBtn = container.querySelector('#toggleAccessibleBtn');
  if (accBtn) {
    accBtn.addEventListener('click', () => {
      isAccessibleView = !isAccessibleView;
      renderVisualizer();
    });
  }

  // Accessible table row clicks
  container.querySelectorAll('tr[data-node-id]').forEach(row => {
    row.addEventListener('click', () => {
      selectedNodeId = row.getAttribute('data-node-id');
      const sidebar = container.querySelector('#archSidebar');
      if (sidebar) sidebar.innerHTML = renderSidebar();
    });
  });
}

export function initArchitectureVisualizer() {
  if (isInitialized) return;
  isInitialized = true;

  // Bind sliding drawer close button
  const closeBtn = document.getElementById('archDrawerClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeArchitectureDrawer);
  }

  // Bind backdrop click to close
  const backdrop = document.getElementById('archDrawerBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeArchitectureDrawer();
      }
    });
  }

  // ESC key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const b = document.getElementById('archDrawerBackdrop');
      if (b && b.classList.contains('active')) {
        closeArchitectureDrawer();
      }
    }
  });

  // Tabs switching
  document.querySelectorAll('.arch-drawer-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.getAttribute('data-tab');
      updateTabUI();
    });
  });
}

function truncateText(str, max) {
  if (!str) return '';
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '…';
}

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
