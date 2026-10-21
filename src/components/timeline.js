/**
 * Component 5 — Work Experience & Career Timeline
 * Pixel-perfect recreation of the Cyber HUD Work Experience journey,
 * with dynamic detail preview and career stats matching user design.
 */

import { WORK_EXPERIENCES, CAREER_STATS } from '../data/portfolioData.js';
import { openArchitectureDrawer } from './architecture.js';

// Helper to get company logo/badge icon
function getCompanyLogoSvg(logoType) {
  switch (logoType) {
    case 'bship':
      return `
        <div class="company-logo-badge logo-bship">
          <span class="bship-mark">iB</span>
        </div>
      `;
    case 'star':
      return `
        <div class="company-logo-badge logo-star">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      `;
    case 'users':
      return `
        <div class="company-logo-badge logo-users">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      `;
    case 'archive':
      return `
        <div class="company-logo-badge logo-archive">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
        </div>
      `;
    default:
      return `
        <div class="company-logo-badge logo-default">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </div>
      `;
  }
}

// Helper to get mini tech stack icons
function getTechChipSvg(tech) {
  const t = tech.toLowerCase();
  if (t === 'go') {
    return `<span class="tech-icon-circle go-icon">GO</span>`;
  } else if (t === 'gin') {
    return `<span class="tech-icon-circle gin-icon">🍸</span>`;
  } else if (t === 'gorm') {
    return `<span class="tech-icon-circle gorm-icon">GORM</span>`;
  } else if (t === 'mysql') {
    return `<span class="tech-icon-circle mysql-icon">🐬</span>`;
  } else if (t === 'redis') {
    return `<span class="tech-icon-circle redis-icon">🔺</span>`;
  } else if (t === 'docker') {
    return `<span class="tech-icon-circle docker-icon">🐳</span>`;
  } else if (t === 'k8s' || t === 'kubernetes') {
    return `<span class="tech-icon-circle k8s-icon">☸️</span>`;
  } else if (t === 'aws') {
    return `<span class="tech-icon-circle aws-icon">☁️</span>`;
  } else if (t === 'laravel') {
    return `<span class="tech-icon-circle laravel-icon">⚡</span>`;
  } else if (t === 'php') {
    return `<span class="tech-icon-circle php-icon">PHP</span>`;
  } else if (t === 'react') {
    return `<span class="tech-icon-circle react-icon">⚛️</span>`;
  } else if (t === 'next.js') {
    return `<span class="tech-icon-circle next-icon">N</span>`;
  } else if (t === 'node.js') {
    return `<span class="tech-icon-circle node-icon">⬢</span>`;
  } else if (t === 'postgresql') {
    return `<span class="tech-icon-circle pg-icon">🐘</span>`;
  } else if (t === 'git') {
    return `<span class="tech-icon-circle git-icon">🌿</span>`;
  }
  return `<span class="tech-icon-circle default-icon">⚡</span>`;
}

export function initTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  let activeExpId = WORK_EXPERIENCES[0]?.id || 'exp-bship';

  function render() {
    const activeExp = WORK_EXPERIENCES.find(e => e.id === activeExpId) || WORK_EXPERIENCES[0];

    container.innerHTML = `
      <!-- Experience Section Header -->
      <div class="career-experience-header">
        <div class="career-header-info">
          <span class="career-section-tag">CAREER TIMELINE</span>
          <h2 class="career-main-title">
            My Work <span class="gradient-text-purple">Experience</span>
          </h2>
          <p class="career-main-subtitle">
            Từ những dòng code đầu tiên đến những hệ thống phức tạp, đây là hành trình không ngừng học hỏi và phát triển.
          </p>
        </div>

        <div class="career-header-gauge">
          <div class="gauge-ring-box">
            <svg class="gauge-svg-circle" viewBox="0 0 100 100">
              <circle class="gauge-circle-bg" cx="50" cy="50" r="42" />
              <circle class="gauge-circle-progress" cx="50" cy="50" r="42" />
            </svg>
            <div class="gauge-content">
              <span class="gauge-value">${CAREER_STATS.years}</span>
              <span class="gauge-label">Years</span>
              <span class="gauge-sublabel">Experience</span>
            </div>
          </div>
          <div class="gauge-phrase-box">
            <span class="phrase-line phrase-coding">Still coding...</span>
            <span class="phrase-line phrase-growing">Still growing...</span>
          </div>
        </div>
      </div>

      <!-- 2-Column Experience Layout -->
      <div class="career-layout-grid">
        <!-- Left Column: Timeline List -->
        <div class="career-timeline-col">
          <div class="career-timeline-track">
            ${WORK_EXPERIENCES.map((exp) => {
              const isActive = exp.id === activeExpId;
              const nodeColor = exp.color || '#00e5ff';

              return `
                <div class="career-timeline-item ${isActive ? 'is-active-item' : ''}" data-id="${exp.id}">
                  <!-- Left Date Column -->
                  <div class="career-date-col">
                    <div class="date-range">
                      <span class="date-start">${exp.dateStart}</span>
                      <span class="date-end">${exp.dateEnd}</span>
                    </div>
                    ${exp.isCurrent ? '<span class="status-badge-current">CURRENT</span>' : ''}
                  </div>

                  <!-- Timeline Node Dot -->
                  <div class="career-node-marker" style="--node-accent: ${nodeColor}">
                    <span class="node-inner-dot"></span>
                  </div>

                  <!-- Timeline Card -->
                  <div class="career-card ${isActive ? 'active-glow' : ''}">
                    <div class="career-card-body">
                      <div class="career-card-main">
                        <div class="career-card-top-row">
                          ${getCompanyLogoSvg(exp.logoType)}
                          <div class="career-title-group">
                            <h3 class="company-name">${exp.company}</h3>
                            <div class="role-name">${exp.role}</div>
                            <div class="location-text">
                              <svg class="loc-pin-icon" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0a5 5 0 0 0-5 5c0 3.86 5 11 5 11s5-7.14 5-11a5 5 0 0 0-5-5zm0 7.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                              </svg>
                              ${exp.location}
                            </div>
                          </div>
                        </div>

                        <p class="company-desc">${exp.description}</p>

                        <div class="company-tech-pills">
                          ${exp.technologies.map(t => `<span class="company-tech-tag">${t}</span>`).join('')}
                        </div>
                      </div>

                      <div class="career-card-thumb-wrap">
                        <img src="${exp.thumbnail}" alt="${exp.company}" class="career-card-thumb" loading="lazy" />
                        <button class="career-view-link" data-id="${exp.id}">
                          View details <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right Column: Detail Panel + Career Stats -->
        <div class="career-sidebar-col">
          <!-- Active Role Detail Card -->
          <div class="career-detail-panel spotlight-card">
            <div class="detail-header-row">
              <div class="detail-company-identity">
                ${getCompanyLogoSvg(activeExp.logoType)}
                <div>
                  <h3 class="detail-company-title">${activeExp.company}</h3>
                  <div class="detail-role-subtitle">${activeExp.role}</div>
                </div>
              </div>
              ${activeExp.isCurrent ? '<span class="status-badge-current">CURRENT</span>' : ''}
            </div>

            <div class="detail-period-row">
              <svg class="clock-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm.5 4.5v3.25l2.25 1.35-.75 1.25L7 8.5V4.5z"/>
              </svg>
              <span>${activeExp.period}</span>
            </div>

            <div class="detail-media-wrap">
              <img src="${activeExp.thumbnail}" alt="${activeExp.company} Overview" class="detail-featured-img" />
              <div class="video-play-overlay">
                <div class="play-btn-circle">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>

            <p class="detail-overview-text">
              ${activeExp.detailOverview}
            </p>

            <div class="detail-section-block">
              <h4 class="detail-section-title">Key Achievements</h4>
              <ul class="detail-achievements-list">
                ${activeExp.achievements.map(ach => `
                  <li>
                    <span class="check-icon-svg">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 8 6.5 11.5 13 4.5"></polyline>
                      </svg>
                    </span>
                    <span>${ach}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="detail-section-block">
              <h4 class="detail-section-title">Tech Stack</h4>
              <div class="detail-tech-grid">
                ${activeExp.technologies.map(tech => `
                  <div class="detail-tech-badge">
                    ${getTechChipSvg(tech)}
                    <span class="tech-badge-name">${tech}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <button class="detail-action-btn" id="viewProjectDrawerBtn" data-project="${activeExp.projectId || 'p1'}">
              View project details <span>→</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind event listeners for card selection
    container.querySelectorAll('.career-timeline-item, .career-view-link').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = el.getAttribute('data-id');
        if (id && id !== activeExpId) {
          activeExpId = id;
          render();
        }
      });
    });

    // Bind button to open system architecture drawer
    const drawerBtn = document.getElementById('viewProjectDrawerBtn');
    if (drawerBtn) {
      drawerBtn.addEventListener('click', () => {
        const projId = drawerBtn.getAttribute('data-project') || 'p1';
        openArchitectureDrawer(projId);
      });
    }
  }

  render();
}



