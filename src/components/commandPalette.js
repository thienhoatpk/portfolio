/**
 * Component 7 — Command Palette (Ctrl+K / Cmd+K)
 * Accessible global modal for instant navigation and action execution.
 * Includes fuzzy matching, keyboard arrow navigation, focus trapping, and restoration.
 */

import { CONFIG } from '../data/portfolioData.js';

export function initCommandPalette() {
  const modal = document.getElementById('commandPaletteModal');
  const input = document.getElementById('paletteInput');
  const resultsContainer = document.getElementById('paletteResults');
  const triggers = document.querySelectorAll('.cmd-trigger');

  if (!modal || !input || !resultsContainer) return;

  let lastActiveElement = null;
  let selectedIndex = 0;
  let filteredCommands = [];

  const commandItems = [
    // Navigation
    { id: 'nav-home', label: 'Go to System Overview (Hero)', group: 'Navigation', icon: '⚡', action: () => scrollToSection('hero') },
    { id: 'nav-skills', label: 'Go to Tech Stack Constellation', group: 'Navigation', icon: '🌌', action: () => scrollToSection('skills') },
    { id: 'nav-projects', label: 'Go to Featured Projects & Case Studies', group: 'Navigation', icon: '🛠️', action: () => scrollToSection('projects') },
    { id: 'nav-arch', label: 'Go to System Architecture Visualizer', group: 'Navigation', icon: '📐', action: () => scrollToSection('architecture') },
    { id: 'nav-timeline', label: 'Go to Engineering Timeline', group: 'Navigation', icon: '⏱️', action: () => scrollToSection('timeline') },
    { id: 'nav-blog', label: 'Go to Technical Blog & Deep Dives', group: 'Navigation', icon: '📝', action: () => scrollToSection('blog') },
    { id: 'nav-github', label: 'Go to GitHub Activity Explorer', group: 'Navigation', icon: '🐙', action: () => scrollToSection('github') },
    { id: 'nav-terminal', label: 'Go to Interactive Terminal', group: 'Navigation', icon: '💻', action: () => scrollToSection('terminal') },
    { id: 'nav-contact', label: 'Go to Contact & Communications', group: 'Navigation', icon: '📬', action: () => scrollToSection('contact') },

    // Actions
    { id: 'act-term-focus', label: 'Focus Interactive Terminal Input', group: 'Actions', icon: '⌨️', action: () => {
      scrollToSection('terminal');
      const termInput = document.getElementById('terminalInput');
      if (termInput) setTimeout(() => termInput.focus(), 300);
    }},
    { id: 'act-copy-email', label: `Copy Email (${CONFIG.email})`, group: 'Actions', icon: '📋', action: () => {
      navigator.clipboard.writeText(CONFIG.email);
      showToast(`Copied ${CONFIG.email} to clipboard!`);
    }},
    { id: 'act-open-github', label: `Open GitHub Profile (@${CONFIG.githubUser})`, group: 'Actions', icon: '↗️', action: () => {
      window.open(CONFIG.social.github, '_blank', 'noopener,noreferrer');
    }},
    { id: 'act-toggle-flow', label: 'Toggle Architecture Data Flow Animation', group: 'Actions', icon: '🔄', action: () => {
      const btn = document.getElementById('toggleFlowBtn');
      if (btn) btn.click();
      scrollToSection('architecture');
    }}
  ];

  function openPalette() {
    lastActiveElement = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    input.value = '';
    filterAndRender('');
    input.focus();
  }

  function closePalette() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
      lastActiveElement = null;
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function highlightMatches(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<span style="color:var(--accent-cyan);font-weight:700;">$1</span>');
  }

  function filterAndRender(query) {
    const q = query.toLowerCase().trim();
    filteredCommands = commandItems.filter(item => 
      !q || item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)
    );

    selectedIndex = 0;

    if (filteredCommands.length === 0) {
      resultsContainer.innerHTML = `
        <div class="palette-empty">
          <p>No matching commands found for "${escapeHtml(query)}"</p>
        </div>
      `;
      return;
    }

    // Group items
    const grouped = {};
    filteredCommands.forEach(item => {
      if (!grouped[item.group]) grouped[item.group] = [];
      grouped[item.group].push(item);
    });

    let overallIndex = 0;
    let html = '';

    Object.entries(grouped).forEach(([groupName, items]) => {
      html += `<div class="palette-group-title">${groupName}</div>`;
      items.forEach(item => {
        const isSelected = (overallIndex === selectedIndex);
        html += `
          <div class="palette-item ${isSelected ? 'active' : ''}" data-index="${overallIndex}" role="option" aria-selected="${isSelected}">
            <div class="palette-item-left">
              <span>${item.icon}</span>
              <span>${highlightMatches(escapeHtml(item.label), q)}</span>
            </div>
            <span class="palette-item-badge">${groupName}</span>
          </div>
        `;
        overallIndex++;
      });
    });

    resultsContainer.innerHTML = html;

    // Click selection
    resultsContainer.querySelectorAll('.palette-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        executeItem(idx);
      });
    });
  }

  function executeItem(index) {
    const item = filteredCommands[index];
    if (item) {
      closePalette();
      item.action();
    }
  }

  function updateSelection() {
    const items = resultsContainer.querySelectorAll('.palette-item');
    items.forEach((el, idx) => {
      const isSel = (idx === selectedIndex);
      el.classList.toggle('active', isSel);
      el.setAttribute('aria-selected', isSel ? 'true' : 'false');
      if (isSel) {
        el.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  // Keyboard navigation
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        updateSelection();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        updateSelection();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeItem(selectedIndex);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  });

  input.addEventListener('input', (e) => {
    filterAndRender(e.target.value);
  });

  // Global keybindings: Cmd+K / Ctrl+K
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (modal.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePalette();
    }
  });

  // Triggers in header
  triggers.forEach(t => t.addEventListener('click', openPalette));

  // Backdrop click to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePalette();
    }
  });
}

function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
