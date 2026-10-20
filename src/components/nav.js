/**
 * Navigation & Core Interaction Handlers
 * Header scrollspy, mobile navigation drawer, and contact actions.
 */

import { CONFIG } from '../data/portfolioData.js';

export function initNav() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link, .capsule-link');
  const toggleBtn = document.getElementById('navToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const sections = document.querySelectorAll('section[id]');

  // Scrollspy
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header border glow on scroll
    if (scrollY > 50) {
      header.style.borderColor = 'rgba(232, 121, 249, 0.35)';
      header.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(168, 85, 247, 0.2)';
    } else {
      header.style.borderColor = 'rgba(168, 85, 247, 0.15)';
      header.style.boxShadow = 'none';
    }

    // Determine active section
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }, { passive: true });

  // Click on capsule links
  document.querySelectorAll('.capsule-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (toggleBtn && mobileDrawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '☰';
      });
    });
  }

  // Copy email button in contact section
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(CONFIG.email);
      showToast(`Copied ${CONFIG.email} to clipboard!`);
    });
  }

  // Contact form submission simulator
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Transmission received! Thank you for reaching out.');
      contactForm.reset();
    });
  }
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
  }, 3000);
}
