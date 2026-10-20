/**
 * Spotlight Cursor and Neon Effects
 * Subtle, restrained lighting following the pointer.
 * Throttled with requestAnimationFrame and disabled on non-pointer / touch devices.
 */

export function initSpotlight() {
  // Check if device supports fine hover pointer and user prefers motion
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!canHover || prefersReducedMotion) {
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let isTicking = false;

  const cards = document.querySelectorAll('.spotlight-card');

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isTicking) {
      window.requestAnimationFrame(() => {
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          // Only calculate if visible in viewport
          if (
            rect.bottom >= 0 &&
            rect.top <= window.innerHeight &&
            rect.right >= 0 &&
            rect.left <= window.innerWidth
          ) {
            const x = mouseX - rect.left;
            const y = mouseY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
          }
        });
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });
}
