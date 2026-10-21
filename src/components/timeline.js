/**
 * Component 5 — Engineering Timeline
 * Chronological timeline of verified professional experience, architectural milestones,
 * and academic foundations with category filtering.
 */

import { TIMELINE_MILESTONES } from '../data/portfolioData.js';

function getGlyphSvg(iconType) {
  switch (iconType) {
    case 'server':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`;
    case 'cpu':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`;
    case 'code':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
    case 'academic':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`;
    default:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
  }
}

export function initTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  let activeType = 'All';

  // Update filter buttons with count badges
  const filterCounts = {
    'All': TIMELINE_MILESTONES.length,
    'Work Experience': TIMELINE_MILESTONES.filter(m => m.type === 'Work Experience').length,
    'Significant Projects': TIMELINE_MILESTONES.filter(m => m.type === 'Significant Projects').length,
    'Education': TIMELINE_MILESTONES.filter(m => m.type === 'Education').length
  };

  document.querySelectorAll('.timeline-filter-btn').forEach(btn => {
    const type = btn.getAttribute('data-type');
    const baseText = type === 'All' ? 'All Milestones' : type;
    const count = filterCounts[type] || 0;
    btn.innerHTML = `${baseText} <span class="filter-count-badge">${count}</span>`;
  });

  function render() {
    const filtered = TIMELINE_MILESTONES.filter(m => 
      activeType === 'All' || m.type === activeType
    );

    container.innerHTML = `
      <div class="timeline-tree">
        <div class="timeline-circuit-spine">
          <div class="timeline-pulse-beam"></div>
        </div>
        ${filtered.map((milestone, idx) => {
          const isLive = milestone.status === 'LIVE' || milestone.id === 'm-current';
          const glyphSvg = getGlyphSvg(milestone.icon);
          const badgeClass = milestone.type === 'Work Experience' 
            ? 'badge-cyan' 
            : milestone.type === 'Education' 
              ? 'badge-amber' 
              : 'badge-purple';

          return `
            <div class="timeline-node ${isLive ? 'is-active-node' : ''}" data-type="${milestone.type}">
              <!-- Spine glyph with glowing node -->
              <div class="timeline-node-spine">
                <div class="timeline-node-glyph ${isLive ? 'glyph-live' : ''}" title="${milestone.badge || milestone.type}">
                  ${glyphSvg}
                  ${isLive ? '<span class="glyph-radar-ring"></span>' : ''}
                </div>
                <div class="timeline-node-connector">
                  <span class="connector-line"></span>
                  <span class="connector-dot"></span>
                </div>
              </div>

              <!-- Main HUD Milestone Card -->
              <div class="timeline-card-wrapper">
                <div class="spotlight-card timeline-card ${isLive ? 'timeline-card-live' : ''}">
                  <!-- Top Telemetry Bar -->
                  <div class="timeline-telemetry-bar">
                    <div class="timeline-telemetry-left">
                      <span class="timeline-node-code">${milestone.telemetry || `NODE // 0${idx + 1}`}</span>
                      <span class="timeline-period-pill">
                        <svg class="timeline-cal-icon" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M4.5 0a.5.5 0 0 1 .5.5V1h6V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                        </svg>
                        ${milestone.period}
                      </span>
                      ${isLive ? `
                        <span class="timeline-status-tag status-live">
                          <span class="pulse-dot"></span>ACTIVE PROTOCOL
                        </span>
                      ` : `
                        <span class="timeline-status-tag status-verified">
                          ${milestone.status || 'VERIFIED'}
                        </span>
                      `}
                    </div>
                    <div class="timeline-telemetry-right">
                      <span class="badge ${badgeClass}">
                        ${milestone.badge || milestone.type}
                      </span>
                    </div>
                  </div>

                  <!-- Role & Organization -->
                  <div class="timeline-role-section">
                    <h3 class="timeline-role">${milestone.title}</h3>
                    <div class="timeline-org-row">
                      <span class="timeline-org-text">
                        <svg class="timeline-org-icon" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v11A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-11zM2.5 2a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-11zm1.5-.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-3z"/>
                        </svg>
                        ${milestone.organization}
                      </span>
                    </div>
                  </div>

                  <!-- Summary narrative -->
                  <div class="timeline-summary-quote">
                    <p class="timeline-desc">${milestone.summary}</p>
                  </div>

                  <!-- Key Performance Telemetry (KPIs) -->
                  ${milestone.kpis && milestone.kpis.length > 0 ? `
                    <div class="timeline-kpi-grid">
                      ${milestone.kpis.map(kpi => `
                        <div class="timeline-kpi-card">
                          <div class="timeline-kpi-val">${kpi.val}</div>
                          <div class="timeline-kpi-label">${kpi.label}</div>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}

                  <!-- Key Highlights / Engineering Deliverables -->
                  ${milestone.highlights && milestone.highlights.length > 0 ? `
                    <div class="timeline-highlights-panel">
                      <div class="timeline-highlights-header">
                        <span class="highlights-title-tag">CORE DELIVERABLES &amp; IMPACT</span>
                      </div>
                      <ul class="timeline-highlights-list">
                        ${milestone.highlights.map(h => `
                          <li>
                            <span class="timeline-bullet-icon">
                              <svg viewBox="0 0 12 12" fill="none"><path d="M3 2L8 6L3 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </span>
                            <span class="timeline-bullet-text">${h}</span>
                          </li>
                        `).join('')}
                      </ul>
                    </div>
                  ` : ''}

                  <!-- Tech Stack Pills -->
                  <div class="timeline-tech-footer">
                    <span class="timeline-tech-label">CORE TOOLS:</span>
                    <div class="timeline-tech-pills">
                      ${milestone.technologies.map(t => `<span class="project-tag">${t}</span>`).join('')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Bind milestone filter pills
  document.querySelectorAll('.timeline-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeType = btn.getAttribute('data-type');
      document.querySelectorAll('.timeline-filter-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-type') === activeType);
      });
      render();
    });
  });

  render();
}

