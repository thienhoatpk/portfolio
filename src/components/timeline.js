/**
 * Component 5 — Work Experience & Career Timeline
 * Horizontal Cyber HUD layout matching the user's reference design:
 * - Top header with title & rich stats HUD box (Tổng thời gian kinh nghiệm)
 * - Left vertical tab indicator (Timeline, Overview, Skills, Achievements)
 * - 4 horizontal cards side-by-side with beveled cyber accents, thumbnails & tech stack pills
 * - Bottom horizontal circuit timeline spine with glowing milestone nodes and connector stalks
 * - Interactive: click card/node to select, click "Xem chi tiết →" to open System Architecture Drawer
 */

import { WORK_EXPERIENCES, CAREER_STATS } from '../data/portfolioData.js';
import { openArchitectureDrawer } from './architecture.js';

// Helper to get company logo/badge icon
function getCompanyLogoSvg(logoType) {
  switch (logoType) {
    case 'bship':
      return `
        <div class="horiz-logo-badge logo-bship">
          <span class="bship-mark">iB</span>
        </div>
      `;
    case 'star':
      return `
        <div class="horiz-logo-badge logo-star">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      `;
    case 'users':
      return `
        <div class="horiz-logo-badge logo-users">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        <div class="horiz-logo-badge logo-academy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        </div>
      `;
    default:
      return `
        <div class="horiz-logo-badge logo-default">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </div>
      `;
  }
}

export function initTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  let activeExpId = WORK_EXPERIENCES[0]?.id || 1;
  let activeTab = 'timeline';

  function render() {
    container.innerHTML = `
      <div class="horiz-experience-wrapper">
        <!-- Top Section Header -->
        <div class="horiz-timeline-header">
          <div class="horiz-header-left">
            <div class="horiz-journey-tag">
              <span class="tag-pipe">|</span> MY JOURNEY <span class="tag-pipe">|</span>
            </div>
            <h2 class="horiz-main-title">
              Work <span class="gradient-text-purple">Experience</span>
            </h2>
            <p class="horiz-main-subtitle">
              Hành trình phát triển không chỉ là những công việc,<br class="hide-mobile" />
              mà là những bài học, công nghệ và con người đã giúp tôi trưởng thành.
            </p>
          </div>

          <!-- Top-Right Stats HUD Box -->
          <div class="horiz-header-stats-hud">
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
                  <span class="hud-metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  </span>
                  <span class="hud-metric-label">Công ty đã làm</span>
                  <span class="hud-metric-val">3+</span>
                </div>
                <div class="hud-metric-row">
                  <span class="hud-metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  </span>
                  <span class="hud-metric-label">Dự án tham gia</span>
                  <span class="hud-metric-val">10+</span>
                </div>
                <div class="hud-metric-row">
                  <span class="hud-metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  </span>
                  <span class="hud-metric-label">Công nghệ sử dụng</span>
                  <span class="hud-metric-val">15+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Body: Left Vertical Nav + Horizontal Cards Stage -->
        <div class="horiz-timeline-layout">
          <!-- Left Vertical Indicator -->
          <aside class="horiz-side-nav" aria-label="Timeline navigation tabs">
            <button class="side-nav-item ${activeTab === 'timeline' ? 'active' : ''}" data-tab="timeline">
              <span class="side-nav-dot"></span>
              <span class="side-nav-text">Timeline</span>
            </button>
            <button class="side-nav-item ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
              <span class="side-nav-dot"></span>
              <span class="side-nav-text">Overview</span>
            </button>
            <button class="side-nav-item ${activeTab === 'skills' ? 'active' : ''}" data-tab="skills">
              <span class="side-nav-dot"></span>
              <span class="side-nav-text">Skills</span>
            </button>
            <button class="side-nav-item ${activeTab === 'achievements' ? 'active' : ''}" data-tab="achievements">
              <span class="side-nav-dot"></span>
              <span class="side-nav-text">Achievements</span>
            </button>
          </aside>

          <!-- Right/Center Horizontal Cards & Spine Area -->
          <div class="horiz-timeline-main-stage">
            <!-- 4 Horizontal Cards Row -->
            <div class="horiz-cards-row">
              ${WORK_EXPERIENCES.map((exp) => {
                const isActive = Number(exp.id) === Number(activeExpId);
                const accentColor = exp.color || '#00e5ff';

                return `
                  <div class="horiz-card ${isActive ? 'active-card' : ''}" data-id="${exp.id}" style="--card-accent: ${accentColor};">
                    <div class="horiz-card-inner">
                      <!-- Card Header Row -->
                      <div class="horiz-card-header">
                        ${getCompanyLogoSvg(exp.logoType)}
                        <div class="horiz-card-titles">
                          <h3 class="horiz-company-name">${exp.company}</h3>
                          <div class="horiz-role-name">${exp.role}</div>
                          <div class="horiz-period-meta">
                            <svg class="horiz-loc-icon" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8 0a5 5 0 0 0-5 5c0 3.86 5 11 5 11s5-7.14 5-11a5 5 0 0 0-5-5zm0 7.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                            </svg>
                            <span>${exp.dateStart} - ${exp.dateEnd}</span>
                          </div>
                        </div>
                        ${exp.isCurrent ? '<span class="horiz-current-badge">Hiện tại</span>' : ''}
                      </div>

                      <!-- Thumbnail Image -->
                      <div class="horiz-thumb-box">
                        <img src="${exp.thumbnail}" alt="${exp.company}" class="horiz-thumb-img" loading="lazy" />
                      </div>

                      <!-- Description -->
                      <p class="horiz-desc-text">${exp.description}</p>

                      <!-- Tech Stack Pills -->
                      <div class="horiz-tech-pill-grid">
                        ${exp.technologies.map(t => {
                          const name = typeof t === 'object' && t !== null ? t.name : t;
                          return `<span class="horiz-tech-pill">${name}</span>`;
                        }).join('')}
                      </div>

                      <!-- Action Button -->
                      <div class="horiz-card-footer">
                        <button class="horiz-view-detail-btn" data-id="${exp.id}" data-project="${exp.projectId || 'p1'}">
                          Xem chi tiết <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Bottom Horizontal Timeline Spine -->
            <div class="horiz-spine-container">
              <div class="horiz-spine-track">
                <div class="horiz-spine-line"></div>
                ${WORK_EXPERIENCES.map((exp) => {
                  const isActive = Number(exp.id) === Number(activeExpId);
                  const accentColor = exp.color || '#00e5ff';

                  return `
                    <div class="spine-milestone-item ${isActive ? 'is-active-milestone' : ''}" data-id="${exp.id}" style="--milestone-color: ${accentColor};">
                      <div class="spine-vertical-stalk"></div>
                      <div class="spine-node-point">
                        <div class="spine-node-halo"></div>
                        <div class="spine-node-dot"></div>
                      </div>
                      <div class="spine-node-labels">
                        <span class="spine-label-date">${exp.dateStart} - ${exp.dateEnd}</span>
                        <span class="spine-label-company">
                          ${exp.company}
                          ${exp.isCurrent ? '<span class="spine-current-chip">CURRENT</span>' : ''}
                        </span>
                      </div>
                    </div>
                  `;
                }).join('')}
                <div class="spine-future-arrow" title="Next horizon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event Listeners: Select card on click
    container.querySelectorAll('.horiz-card, .spine-milestone-item').forEach(el => {
      el.addEventListener('click', (e) => {
        // If user clicked the "Xem chi tiết" button, let the detail button listener handle it
        if (e.target.closest('.horiz-view-detail-btn')) return;

        const id = el.getAttribute('data-id');
        if (id && Number(id) !== Number(activeExpId)) {
          activeExpId = Number(id);
          render();
        }
      });
    });

    // Event Listeners: "Xem chi tiết →" button opens Architecture Drawer
    container.querySelectorAll('.horiz-view-detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projId = btn.getAttribute('data-project') || 'p1';
        openArchitectureDrawer(projId);
      });
    });

    // Event Listeners: Left nav tabs
    container.querySelectorAll('.side-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        if (tab && tab !== activeTab) {
          activeTab = tab;
          render();
        }
      });
    });
  }

  render();
}
