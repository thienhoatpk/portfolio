/**
 * Component 5 — Engineering Timeline
 * Chronological timeline of verified professional experience, architectural milestones,
 * and academic foundations with category filtering.
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
      <div class="timeline-tree">
        ${filtered.map(milestone => `
          <div class="timeline-node">
            <div class="timeline-marker"></div>
            <div class="spotlight-card timeline-card">
              <div class="timeline-card-header">
                <div>
                  <span class="timeline-period">${milestone.period}</span>
                  <h3 class="timeline-role">${milestone.title}</h3>
                  <div class="timeline-org">${milestone.organization}</div>
                </div>
                <span class="badge ${milestone.type === 'Work Experience' ? 'badge-cyan' : 'badge-purple'}">
                  ${milestone.badge || milestone.type}
                </span>
              </div>

              <p class="timeline-desc">${milestone.summary}</p>

              ${milestone.highlights && milestone.highlights.length > 0 ? `
                <ul class="timeline-highlights">
                  ${milestone.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
              ` : ''}

              <div class="arch-tech-pills">
                ${milestone.technologies.map(t => `<span class="project-tag">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
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
