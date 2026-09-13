/**
 * TAVRICON — Opening Brand Reveal Sequence & Cinematic Audio Sync
 * Synchronized with Web Audio API soundscape in sound.js
 */

document.addEventListener('DOMContentLoaded', () => {
  const revealOverlay = document.getElementById('brand-reveal');
  const skipBtn = document.getElementById('skip-reveal-btn');
  const brandName = document.getElementById('reveal-brand-name');

  if (!revealOverlay) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeTimers = [];

  const clearActiveTimers = () => {
    activeTimers.forEach(t => clearTimeout(t));
    activeTimers = [];
  };

  const dismissReveal = (speed = 650) => {
    clearActiveTimers();
    if (window.tavriconSound && window.tavriconSound.stopRevealSound) {
      window.tavriconSound.stopRevealSound();
    }
    revealOverlay.style.transition = `opacity ${speed}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    revealOverlay.classList.add('hide-reveal');
    document.body.style.overflow = '';
    sessionStorage.setItem('tavricon_revealed_session', 'true');
    setTimeout(() => {
      if (revealOverlay && revealOverlay.parentNode) {
        revealOverlay.style.display = 'none';
      }
    }, speed + 50);
  };

  const startRevealSequence = () => {
    clearActiveTimers();
    revealOverlay.style.display = 'flex';
    revealOverlay.classList.remove('hide-reveal');
    document.body.style.overflow = 'hidden';

    // Trigger fresh CSS animation on replay
    if (brandName) {
      brandName.style.animation = 'none';
      void brandName.offsetHeight;
      brandName.style.animation = '';
    }

    // Play synchronized cinematic opening soundscape & spoken company name
    if (window.tavriconSound) {
      window.tavriconSound.revealSynthPlayed = false;
      window.tavriconSound.ensureContextRunning();
      window.tavriconSound.playRevealSound();
    }

    // Auto-advance smoothly into the website after fast pronunciation finishes (1.95s)
    const endTimer = setTimeout(() => {
      dismissReveal(600);
    }, 1950);
    activeTimers.push(endTimer);
  };

  // Global replay function accessible anywhere on the site
  window.replayBrandReveal = () => {
    startRevealSequence();
  };

  // If user prefers reduced motion in OS settings, skip automatically
  if (prefersReducedMotion) {
    revealOverlay.style.display = 'none';
    document.body.style.overflow = '';
    return;
  }

  // Prevent background scroll while reveal runs
  document.body.style.overflow = 'hidden';

  // Click anywhere during reveal to ensure audio context is active and trigger sound
  revealOverlay.addEventListener('pointerdown', () => {
    if (window.tavriconSound) {
      window.tavriconSound.ensureContextRunning();
      window.tavriconSound.playRevealSound();
    }
  }, { passive: true });

  const soundHint = document.getElementById('reveal-sound-hint');
  if (soundHint) {
    soundHint.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.tavriconSound) {
        window.tavriconSound.ensureContextRunning();
        window.tavriconSound.playRevealSound();
      }
    });
  }

  // Allow clicking "Skip" button or pressing ESC
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissReveal(280);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !revealOverlay.classList.contains('hide-reveal')) {
      dismissReveal(280);
    }
  });

  // Automated cinematic sequence start
  startRevealSequence();
});
