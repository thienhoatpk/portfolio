/**
 * Component 5 — Engineering Timeline
 * Streamlined, clean, and concise chronological timeline of professional experience.
 */

import { TIMELINE_MILESTONES } from '../data/portfolioData.js';

export function initTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  let activeType = 'All';

  function render() {
    const filtered = TIMELINE_MILESTONES.filter(m => 
      activeType === 'All' || m.type === activeType
    );

    container.innerHTML = `
      <div class="timeline-streamlined">
        ${filtered.map(milestone => {
          const isLive = milestone.status === 'LIVE' || milestone.id === 'm-current';
          const badgeClass = milestone.type === 'Work Experience' 
            ? 'badge-cyan' 
            : milestone.type === 'Education' 
              ? 'badge-amber' 
              : 'badge-purple';

          return `
            <div class="timeline-item ${isLive ? 'is-live' : ''}">
              <div class="timeline-dot ${isLive ? 'dot-live' : ''}"></div>
              <div class="timeline-card-simple">
                <div class="timeline-card-top">
                  <div class="timeline-meta">
                    <span class="timeline-period">${milestone.period}</span>
                    <span class="timeline-sep">•</span>
                    <span class="timeline-org">${milestone.organization}</span>
                  </div>
                  <span class="badge ${badgeClass}">${milestone.badge || milestone.type}</span>
                </div>

                <h3 class="timeline-title">${milestone.title}</h3>

                ${milestone.highlights && milestone.highlights.length > 0 ? `
                  <ul class="timeline-points">
                    ${milestone.highlights.slice(0, 2).map(h => `<li>${h}</li>`).join('')}
                  </ul>
                ` : `
                  <p class="timeline-text">${milestone.summary}</p>
                `}

                <div class="timeline-tags">
                  ${milestone.technologies.map(t => `<span class="project-tag">${t}</span>`).join('')}
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


