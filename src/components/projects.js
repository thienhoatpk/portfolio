/**
 * Component 3 — Project Showcase & Case Studies
 * Cards with live filters, search, metrics overview, and an accessible
 * 9-section technical case study modal dialog.
 */

import { PROJECTS } from '../data/portfolioData.js';
import { openArchitectureDrawer } from './architecture.js';

export function initProjects() {
  const container = document.getElementById('projectsContainer');
  const modalBackdrop = document.getElementById('caseStudyModal');
  const modalTitle = document.getElementById('csModalTitle');
  const modalBody = document.getElementById('csModalBody');
  const modalCloseBtn = document.getElementById('csModalClose');

  if (!container) return;

  let activeCategory = 'All';
  let searchQuery = '';
  let lastActiveElement = null;

  function getFilteredProjects() {
    return PROJECTS.filter(p => {
      const matchCat = (activeCategory === 'All' || p.category === activeCategory);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
      return matchCat && matchSearch;
    });
  }

  function renderGrid() {
    const list = getFilteredProjects();

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; color: var(--text-muted); background: var(--bg-secondary); border: 1px dashed var(--border-default); border-radius: var(--radius-md);">
          <p style="font-family: var(--font-mono); font-size: 0.9375rem;">No engineering projects match the filter query: "${searchQuery}".</p>
          <button class="btn btn-secondary btn-sm" id="resetProjectsFilter" style="margin-top: 16px;">Reset Filter</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetProjectsFilter');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeCategory = 'All';
          searchQuery = '';
          const searchInput = document.getElementById('projectSearchInput');
          if (searchInput) searchInput.value = '';
          updateFilterButtons();
          renderGrid();
        });
      }
      return;
    }

    const PROJECT_THEMES = {
      'apexpulse-stream-engine': {
        color: '#00F0FF',
        tag: 'DISTRIBUTED INGESTION',
        iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
      },
      'cloud-rag-orchestrator': {
        color: '#E879F9',
        tag: 'HYBRID VECTOR RAG',
        iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E879F9" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>`
      },
      'distributed-cache-proxy': {
        color: '#F59E0B',
        tag: 'CONSISTENT HASHING',
        iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
      },
      'devops-telemetry-hub': {
        color: '#10B981',
        tag: 'LINUX EBPF DAEMON',
        iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
      }
    };

    container.innerHTML = list.map(project => {
      const theme = PROJECT_THEMES[project.id] || {
        color: '#00F0FF',
        tag: project.category.toUpperCase(),
        iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`
      };

      return `
        <article class="spotlight-card project-card" data-project-id="${project.id}" style="--proj-color: ${theme.color};">
          <div class="project-card-header">
            <div class="project-header-left">
              <div class="project-icon-box" style="border-color: ${theme.color}44; box-shadow: 0 0 14px ${theme.color}22;">
                ${theme.iconSvg}
              </div>
              <div class="project-title-group">
                <div class="project-tag-row">
                  <span class="project-category-badge" style="color: ${theme.color}; border-color: ${theme.color}44;">
                    ${theme.tag}
                  </span>
                  ${project.featured ? '<span class="project-featured-chip">Featured</span>' : ''}
                </div>
                <h3 class="project-title">${project.title}</h3>
              </div>
            </div>
            <span class="project-status-pulse" style="background: ${theme.color}; box-shadow: 0 0 8px ${theme.color};"></span>
          </div>

          <p class="project-summary">${project.summary}</p>

          <!-- Sleek Compact Telemetry Ribbon -->
          <div class="project-metrics-ribbon">
            ${project.metrics.map(m => `
              <div class="pm-metric-item">
                <span class="pm-metric-val" style="color: ${theme.color};">${m.value}</span>
                <span class="pm-metric-lbl">${m.label}</span>
              </div>
            `).join('')}
          </div>

          <!-- Tech Stack Chips -->
          <div class="project-tags">
            ${project.tags.slice(0, 5).map(t => `<span class="project-tag">${t}</span>`).join('')}
            ${project.tags.length > 5 ? `<span class="project-tag project-tag-more">+${project.tags.length - 5}</span>` : ''}
          </div>

          <!-- Card Action Footer -->
          <div class="project-card-footer">
            <div class="project-cta-badge">
              <span>System Architecture</span>
              <span class="cta-arrow">↗</span>
            </div>

            <div class="project-links">
              ${project.githubUrl ? `
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="icon-link" aria-label="GitHub Repository for ${project.title}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <span>Code</span>
                </a>
              ` : ''}
              ${project.demoUrl ? `
                <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="icon-link" aria-label="Live Demo for ${project.title}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  <span>Demo</span>
                </a>
              ` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Clicking anywhere on a project card opens the System Architecture sliding drawer
    container.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.icon-link') || e.target.closest('a')) return;
        const id = card.getAttribute('data-project-id');
        if (id) {
          openArchitectureDrawer(id);
        }
      });
    });

    // Also handle direct button clicks
    container.querySelectorAll('.open-arch-btn, .open-cs-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (id) {
          openArchitectureDrawer(id);
        }
      };
    });
  }

  function openCaseStudy(projectId, triggerBtn) {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project || !project.caseStudy) return;

    lastActiveElement = triggerBtn;
    const cs = project.caseStudy;

    modalTitle.textContent = project.title;

    modalBody.innerHTML = `
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
          ${cs.decisions.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>

      <div class="cs-section">
        <span class="cs-heading">06 // Challenges & Solutions</span>
        <ul class="cs-list">
          ${cs.challenges.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      <div class="cs-section">
        <span class="cs-heading">07 // Results & Operational Lessons</span>
        <p class="cs-text">${cs.results}</p>
      </div>

      <div class="cs-section">
        <span class="cs-heading">08 // Technology Stack</span>
        <div class="arch-tech-pills">
          ${cs.technologies.map(t => `<span class="badge badge-cyan">${t}</span>`).join('')}
        </div>
      </div>
    `;

    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessible keyboard navigation
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeCaseStudy() {
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
      lastActiveElement = null;
    }
  }

  // Bind close events
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCaseStudy);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeCaseStudy();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeCaseStudy();
    }
  });

  // Filter pills
  function updateFilterButtons() {
    document.querySelectorAll('.cat-pill').forEach(btn => {
      const cat = btn.getAttribute('data-cat');
      btn.classList.toggle('active', cat === activeCategory);
    });
  }

  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-cat');
      updateFilterButtons();
      renderGrid();
    });
  });

  // Search input
  const searchInput = document.getElementById('projectSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderGrid();
    });
  }

  renderGrid();
}
