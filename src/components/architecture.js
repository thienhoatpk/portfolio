/**
 * Component 2 — System Architecture Visualizer
 * Interactive SVG diagram with connected nodes, pulsing data flow lines,
 * category filters, interactive detail drawer, and accessible text view.
 */

import { ARCHITECTURE_SYSTEMS } from '../data/portfolioData.js';

export function initArchitectureVisualizer() {
  const container = document.getElementById('archVisualizer');
  if (!container) return;

  const system = ARCHITECTURE_SYSTEMS[0];
  let selectedNodeId = 'api-gateway';
  let activeFilter = 'All';
  let isFlowActive = true;
  let isAccessibleView = false;

  const nodeCoordinates = {
    'client-edge': { x: 70, y: 190 },
    'api-gateway': { x: 230, y: 190 },
    'cache-redis': { x: 230, y: 350 },
    'buffer-service': { x: 390, y: 190 },
    'kafka-cluster': { x: 550, y: 190 },
    'consumer-worker': { x: 710, y: 110 },
    'stream-analytics': { x: 710, y: 280 },
    'db-timescale': { x: 880, y: 110 },
    'alert-hub': { x: 880, y: 280 }
  };

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

  function render() {
    container.innerHTML = `
      <div class="arch-controls">
        <div class="arch-subsystem-filters">
          <button class="filter-btn ${activeFilter === 'All' ? 'active' : ''}" data-filter="All">All Subsystems</button>
          ${system.subsystems.map(sub => `
            <button class="filter-btn ${activeFilter === sub ? 'active' : ''}" data-filter="${sub}">${sub}</button>
          `).join('')}
        </div>
        <div class="arch-actions">
          <button class="btn btn-secondary btn-sm" id="toggleFlowBtn">
            <span class="status-indicator" style="background:${isFlowActive ? '#10B981' : '#64748B'}; width:6px; height:6px; border-radius:50%; display:inline-block;"></span>
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

    bindEvents();
  }

  function renderSvgDiagram() {
    // Generate edges
    let edgesSvg = '';
    system.nodes.forEach(sourceNode => {
      const sourceCoord = nodeCoordinates[sourceNode.id];
      if (!sourceCoord) return;

      sourceNode.connections.forEach(targetId => {
        const targetCoord = nodeCoordinates[targetId];
        if (!targetCoord) return;

        const isHighlighted = (sourceNode.id === selectedNodeId || targetId === selectedNodeId);
        const flowClass = isFlowActive 
          ? (isHighlighted ? 'arch-flow-edge active-flow' : 'arch-flow-edge') 
          : 'arch-flow-edge';

        const strokeColor = isHighlighted ? 'var(--accent-cyan)' : 'var(--border-default)';

        // Curved orthogonal or bezier connector
        const midX = (sourceCoord.x + targetCoord.x) / 2;
        const d = `M ${sourceCoord.x + 60} ${sourceCoord.y + 25} C ${midX} ${sourceCoord.y + 25}, ${midX} ${targetCoord.y + 25}, ${targetCoord.x - 10} ${targetCoord.y + 25}`;

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
      const coord = nodeCoordinates[node.id];
      if (!coord) return;

      const isSelected = (node.id === selectedNodeId);
      const isConnected = system.nodes.some(n => 
        (n.id === selectedNodeId && n.connections.includes(node.id)) ||
        (node.id === selectedNodeId && node.connections.includes(n.id))
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
            ${escapeXml(node.protocol || node.category)}
          </text>
        </g>
      `;
    });

    return `
      <svg class="arch-grid-canvas" viewBox="0 0 1020 440" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="var(--accent-cyan)" opacity="0.8"/>
          </marker>
        </defs>

        <!-- Subtle Canvas Grid -->
        <g opacity="0.15">
          <line x1="0" y1="100" x2="1020" y2="100" stroke="#263249" stroke-dasharray="4 4"/>
          <line x1="0" y1="200" x2="1020" y2="200" stroke="#263249" stroke-dasharray="4 4"/>
          <line x1="0" y1="300" x2="1020" y2="300" stroke="#263249" stroke-dasharray="4 4"/>
        </g>

        <!-- Edges -->
        <g id="edgesGroup">${edgesSvg}</g>

        <!-- Nodes -->
        <g id="nodesGroup">${nodesSvg}</g>
      </svg>
    `;
  }

  function renderAccessibleTable() {
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
                <td style="padding:10px 8px; font-family:var(--font-mono); font-size:0.75rem;">${n.connections.length ? n.connections.join(', ') : 'Terminal Sink'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderSidebar() {
    const node = system.nodes.find(n => n.id === selectedNodeId) || system.nodes[1];
    const categoryColor = nodeColors[node.category] || 'var(--accent-cyan)';

    return `
      <div class="arch-detail-header">
        <span class="badge" style="border-color:${categoryColor}; color:${categoryColor};">
          ${node.category}
        </span>
        <h3 class="arch-node-title">${node.label}</h3>
        <p style="color:var(--text-muted); font-size:0.8125rem; font-family:var(--font-mono); margin-top:2px;">
          Status: <span style="color:#10B981;">● ${node.status}</span> // Protocol: ${node.protocol}
        </p>
      </div>

      <div class="arch-meta-list">
        <div class="arch-meta-row">
          <span class="arch-meta-label">Responsibilities & Behavior</span>
          <p class="arch-meta-val">${node.description}</p>
        </div>

        <div class="arch-meta-row">
          <span class="arch-meta-label">Technical Specification</span>
          <p class="arch-meta-val" style="font-size:0.8125rem; line-height:1.5;">${node.details}</p>
        </div>

        <div class="arch-meta-row">
          <span class="arch-meta-label">Underlying Technologies</span>
          <div class="arch-tech-pills">
            ${node.tech.map(t => `<span class="badge badge-cyan">${t}</span>`).join('')}
          </div>
        </div>

        <div class="arch-meta-row">
          <span class="arch-meta-label">Downstream Connections</span>
          <div class="arch-tech-pills">
            ${node.connections.length > 0 
              ? node.connections.map(c => `<span class="badge badge-purple">→ ${c}</span>`).join('')
              : '<span style="color:var(--text-muted); font-size:0.8125rem;">None (Terminal Sink)</span>'
            }
          </div>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    // Node selection in SVG
    container.querySelectorAll('.arch-node-group').forEach(group => {
      group.addEventListener('click', () => {
        selectedNodeId = group.getAttribute('data-node-id');
        render();
      });
      group.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectedNodeId = group.getAttribute('data-node-id');
          render();
        }
      });
    });

    // Subsystem filter buttons
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-filter');
        // highlight first node in category if applicable
        render();
      });
    });

    // Toggle flow animation
    const flowBtn = container.querySelector('#toggleFlowBtn');
    if (flowBtn) {
      flowBtn.addEventListener('click', () => {
        isFlowActive = !isFlowActive;
        render();
      });
    }

    // Toggle accessible view
    const accBtn = container.querySelector('#toggleAccessibleBtn');
    if (accBtn) {
      accBtn.addEventListener('click', () => {
        isAccessibleView = !isAccessibleView;
        render();
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

  render();
}

function truncateText(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '…';
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
