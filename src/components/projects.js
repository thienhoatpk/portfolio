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

    container.innerHTML = list.map(project => `
      <article class="spotlight-card project-card" data-project-id="${project.id}">
        <div class="project-card-header">
          <span class="project-category">${project.category}</span>
          ${project.featured ? '<span class="badge badge-cyan">Featured Architecture</span>' : ''}
        </div>

        <h3 class="project-title">${project.title}</h3>
        <p class="project-summary">${project.summary}</p>

        <!-- Technical Metrics Grid -->
        <div class="project-metrics-row">
          ${project.metrics.map(m => `
            <div class="pm-item">
              <span class="pm-val">${m.value}</span>
              <span class="pm-lbl">${m.label}</span>
            </div>
          `).join('')}
        </div>

        <!-- Tech Tags -->
        <div class="project-tags">
          ${project.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>

        <!-- Action Links -->
        <div class="project-card-footer">
          <button class="btn btn-primary btn-sm open-arch-btn" data-id="${project.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>System Architecture ↗</span>
          </button>
          
          <div class="project-links">
            ${project.githubUrl ? `
              <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="icon-link" aria-label="GitHub Repository for ${project.title}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>Code</span>
              </a>
            ` : ''}
            ${project.demoUrl ? `
              <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="icon-link" aria-label="Live Demo for ${project.title}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>Demo</span>
              </a>
            ` : ''}
          </div>
        </div>
      </article>
    `).join('');

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
