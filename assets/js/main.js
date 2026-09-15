/**
 * TAVRICON — Royal Cobalt & Neon Cyan Global Interactions
 * Header, Mobile Navigation, Cursor Glow, Accordions, Dynamic Stat Counters,
 * 3D Card Tilt, and Interactive Growth & ROAS Simulator Engine
 */

const initApp = () => {
  // --------------------------------------------------------------------------
  // 1. DYNAMIC CURSOR AMBIENT LIGHT ORB
  // --------------------------------------------------------------------------
  const cursorGlow = document.createElement('div');
  cursorGlow.id = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  const renderCursor = () => {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // --------------------------------------------------------------------------
  // 2. DYNAMIC STICKY HEADER
  // --------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');

  const openDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // --------------------------------------------------------------------------
  // 4. HIGHLIGHT CURRENT ACTIVE NAV LINK
  // --------------------------------------------------------------------------
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .drawer-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --------------------------------------------------------------------------
  // 5. ACCESSIBLE FAQ ACCORDIONS
  // --------------------------------------------------------------------------
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      const parentGroup = item.closest('.accordion-group');
      if (parentGroup) {
        parentGroup.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherHeader = otherItem.querySelector('.accordion-header');
            const otherContent = otherItem.querySelector('.accordion-content');
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });
      }

      if (isExpanded) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. SCROLL STAGGER & INTERSECTION OBSERVER
  // --------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('in-view'));
  }

  // --------------------------------------------------------------------------
  // 7. SUBTLE 3D TILT ON ROYAL GLASS CARDS
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.glass-card, .work-card, .simulator-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // --------------------------------------------------------------------------
  // 8. INTERACTIVE GROWTH & ROAS SIMULATOR ENGINE (HOOKABLE WIDGET)
  // --------------------------------------------------------------------------
  const simSpendSlider = document.getElementById('sim-spend-slider');
  const simSpendDisplay = document.getElementById('sim-spend-display');
  const simRevenueDisplay = document.getElementById('sim-revenue-display');
  const simRoasDisplay = document.getElementById('sim-roas-display');
  const simPipelineDisplay = document.getElementById('sim-pipeline-display');
  const simVelocityDisplay = document.getElementById('sim-velocity-display');
  const modeScaleBtn = document.getElementById('mode-scale');
  const modeMarginBtn = document.getElementById('mode-margin');
  const simLockBtn = document.getElementById('sim-lock-strategy-btn');

  if (simSpendSlider && simSpendDisplay) {
    let currentMode = 'scale'; // 'scale' or 'margin'

    const formatINR = (val) => {
      if (val >= 10000000) {
        return `₹${(val / 10000000).toFixed(2)} Cr`;
      } else if (val >= 100000) {
        return `₹${(val / 100000).toFixed(2)} Lakh`;
      } else {
        return `₹${val.toLocaleString('en-IN')}`;
      }
    };

    const updateSimulator = () => {
      const spend = parseInt(simSpendSlider.value, 10);
      simSpendDisplay.textContent = formatINR(spend) + ' / mo';

      let roasMultiplier;
      let costPerAcquisition;
      let velocityScore;

      if (currentMode === 'scale') {
        // High Volume Scale mode
        if (spend < 100000) roasMultiplier = 4.2;
        else if (spend < 300000) roasMultiplier = 4.6;
        else if (spend < 1000000) roasMultiplier = 4.9;
        else roasMultiplier = 5.2;

        costPerAcquisition = 280;
        velocityScore = '94/100 High Velocity';
      } else {
        // High Margin Precision mode
        if (spend < 100000) roasMultiplier = 5.4;
        else if (spend < 300000) roasMultiplier = 6.0;
        else if (spend < 1000000) roasMultiplier = 6.5;
        else roasMultiplier = 7.1;

        costPerAcquisition = 360;
        velocityScore = '99/100 Maximum Margin';
      }

      const projectedRevenue = Math.round(spend * roasMultiplier);
      const projectedPipeline = Math.round(spend / costPerAcquisition);

      if (simRevenueDisplay) simRevenueDisplay.textContent = formatINR(projectedRevenue);
      if (simRoasDisplay) simRoasDisplay.textContent = `${roasMultiplier.toFixed(1)}x`;
      if (simPipelineDisplay) simPipelineDisplay.textContent = `${projectedPipeline.toLocaleString('en-IN')}+`;
      if (simVelocityDisplay) simVelocityDisplay.textContent = velocityScore;
    };

    simSpendSlider.addEventListener('input', updateSimulator);

    if (modeScaleBtn && modeMarginBtn) {
      modeScaleBtn.addEventListener('click', () => {
        currentMode = 'scale';
        modeScaleBtn.classList.add('active');
        modeMarginBtn.classList.remove('active');
        updateSimulator();
      });

      modeMarginBtn.addEventListener('click', () => {
        currentMode = 'margin';
        modeMarginBtn.classList.add('active');
        modeScaleBtn.classList.remove('active');
        updateSimulator();
      });
    }

    if (simLockBtn) {
      simLockBtn.addEventListener('click', () => {
        const spend = simSpendSlider.value;
        window.location.href = `contact.html?budget=${spend}&mode=${currentMode}`;
      });
    }

    // Initial calculation
    updateSimulator();
  }

  // --------------------------------------------------------------------------
  // 9. BACK TO TOP ACTION
  // --------------------------------------------------------------------------
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 10. FOOTER NEWSLETTER MOCK SUBMIT
  // --------------------------------------------------------------------------
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const btn = newsletterForm.querySelector('button');
      if (input && input.value) {
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Subscribed!';
        btn.style.background = 'var(--aurora-gradient)';
        btn.style.color = '#FFFFFF';
        input.value = '';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 3000);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. REPLAY BRAND REVEAL INTRO
  // --------------------------------------------------------------------------
  const replayBtn = document.querySelector('.replay-reveal-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      if (typeof window.replayBrandReveal === 'function') {
        window.replayBrandReveal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 12. WELCOME POPUP MODAL (Triggers ONLY ONCE on home page opening)
  // --------------------------------------------------------------------------
  const initWelcomeModal = () => {
    // 1. Strict Page Gate: NEVER run on subpages (About, Founder, Services, Work, Blog, Contact, etc.)
    const currentPath = window.location.pathname.toLowerCase();
    const isSubpage = currentPath.includes('about') ||
                      currentPath.includes('founder') ||
                      currentPath.includes('service') ||
                      currentPath.includes('work') ||
                      currentPath.includes('blog') ||
                      currentPath.includes('contact') ||
                      currentPath.includes('privacy') ||
                      currentPath.includes('terms');

    if (isSubpage) {
      return; // Absolutely zero popup execution on subpages
    }

    // 2. Only run if static #welcome-modal-overlay exists in HTML
    const welcomeOverlay = document.getElementById('welcome-modal-overlay');
    if (!welcomeOverlay) {
      return;
    }

    // 3. Show ONLY ONCE: Check if already shown or dismissed
    try {
      if (localStorage.getItem('tavricon_welcome_dismissed') === 'true' || 
          sessionStorage.getItem('tavricon_welcome_dismissed') === 'true' ||
          sessionStorage.getItem('tavricon_welcome_shown_session') === 'true') {
        return;
      }
    } catch (e) {}

    const welcomeCloseBtn = welcomeOverlay.querySelector('#welcome-modal-close');
    const welcomeSkipBtn = welcomeOverlay.querySelector('#welcome-skip-btn');
    const welcomeForm = welcomeOverlay.querySelector('#welcome-lead-form');
    const welcomeFormWrapper = welcomeOverlay.querySelector('#welcome-form-wrapper');
    const welcomeSuccessState = welcomeOverlay.querySelector('#welcome-success-state');
    const welcomeSuccessTitle = welcomeOverlay.querySelector('#welcome-success-title');
    const welcomeSuccessDesc = welcomeOverlay.querySelector('#welcome-success-desc');
    const welcomeWaFasttrack = welcomeOverlay.querySelector('#welcome-wa-fasttrack');
    const welcomeContinueBtn = welcomeOverlay.querySelector('#welcome-continue-btn');

    const markDismissed = () => {
      try {
        localStorage.setItem('tavricon_welcome_dismissed', 'true');
        sessionStorage.setItem('tavricon_welcome_dismissed', 'true');
        sessionStorage.setItem('tavricon_welcome_shown_session', 'true');
      } catch (e) {}
    };

    const openWelcomeModal = () => {
      // Ensure brand reveal is dismissed so it never blocks the modal
      const brandReveal = document.getElementById('brand-reveal');
      if (brandReveal) {
        brandReveal.classList.add('hide-reveal');
        brandReveal.style.display = 'none';
      }

      welcomeOverlay.style.display = 'flex';
      welcomeOverlay.style.opacity = '1';
      welcomeOverlay.style.visibility = 'visible';
      welcomeOverlay.style.pointerEvents = 'auto';
      welcomeOverlay.style.zIndex = '999999';
      welcomeOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      markDismissed();

      if (window.tavriconSound) {
        window.tavriconSound.playClick(0.9);
      }
    };

    const closeWelcomeModal = () => {
      welcomeOverlay.classList.remove('active');
      welcomeOverlay.style.opacity = '0';
      welcomeOverlay.style.pointerEvents = 'none';
      setTimeout(() => {
        if (!welcomeOverlay.classList.contains('active')) {
          welcomeOverlay.style.display = 'none';
          welcomeOverlay.style.visibility = 'hidden';
        }
      }, 300);
      document.body.style.overflow = '';
      markDismissed();
    };

    // Expose functions globally for testability & external hooks
    window.openWelcomePopup = openWelcomeModal;
    window.closeWelcomePopup = closeWelcomeModal;

    // Trigger reliably after 5.0 seconds once when opening the site
    setTimeout(openWelcomeModal, 5000);

    if (welcomeCloseBtn) {
      welcomeCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWelcomeModal();
      });
    }

    if (welcomeSkipBtn) {
      welcomeSkipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWelcomeModal();
      });
    }

    if (welcomeContinueBtn) {
      welcomeContinueBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWelcomeModal();
      });
    }

    welcomeOverlay.addEventListener('click', (e) => {
      if (e.target === welcomeOverlay) {
        closeWelcomeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && welcomeOverlay.classList.contains('active')) {
        closeWelcomeModal();
      }
    });

    if (welcomeForm) {
      welcomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        markDismissed();
        const nameVal = (welcomeOverlay.querySelector('#welcome-name')?.value || '').trim();
        const phoneVal = (welcomeOverlay.querySelector('#welcome-phone')?.value || '').trim();
        const emailVal = (welcomeOverlay.querySelector('#welcome-email')?.value || '').trim();
        const workVal = (welcomeOverlay.querySelector('#welcome-work')?.value || '').trim();

        const hasData = nameVal || phoneVal || emailVal || workVal;

        if (welcomeFormWrapper && welcomeSuccessState) {
          welcomeFormWrapper.style.display = 'none';
          welcomeSuccessState.style.display = 'block';

          if (nameVal) {
            if (welcomeSuccessTitle) welcomeSuccessTitle.textContent = `Welcome, ${nameVal}!`;
            if (welcomeSuccessDesc) welcomeSuccessDesc.textContent = `Thank you for connecting with TAVRICON. We're excited to learn more about your ${workVal || 'business'} goals.`;
          } else {
            if (welcomeSuccessTitle) welcomeSuccessTitle.textContent = 'Welcome to TAVRICON!';
            if (welcomeSuccessDesc) welcomeSuccessDesc.textContent = `Thank you for connecting with us. Enjoy discovering our high-performance marketing engines.`;
          }

          if (hasData && welcomeWaFasttrack) {
            const encoded = encodeURIComponent(`Hi Aditya, I just visited TAVRICON.\nName: ${nameVal || 'Visitor'}\nPhone: ${phoneVal || 'N/A'}\nGmail: ${emailVal || 'N/A'}\nWork: ${workVal || 'N/A'}`);
            welcomeWaFasttrack.href = `https://wa.me/919799111507?text=${encoded}`;
            welcomeWaFasttrack.style.display = 'inline-flex';
          }

          setTimeout(() => {
            if (welcomeOverlay.classList.contains('active')) {
              closeWelcomeModal();
            }
          }, 3500);
        } else {
          closeWelcomeModal();
        }
      });
    }
  };

  initWelcomeModal();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
