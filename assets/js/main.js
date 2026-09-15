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
  // 12. WELCOME POPUP MODAL (Triggers 5s after opening, Optional)
  // --------------------------------------------------------------------------
  const initWelcomeModal = () => {
    try {
      sessionStorage.removeItem('tavricon_welcome_shown');
      localStorage.removeItem('tavricon_welcome_shown');
    } catch (e) {}

    let welcomeOverlay = document.getElementById('welcome-modal-overlay');

    // If modal container is not in static HTML, dynamically construct it so it triggers on any page
    if (!welcomeOverlay) {
      welcomeOverlay = document.createElement('div');
      welcomeOverlay.id = 'welcome-modal-overlay';
      welcomeOverlay.className = 'modal-overlay';
      welcomeOverlay.setAttribute('role', 'dialog');
      welcomeOverlay.setAttribute('aria-modal', 'true');
      welcomeOverlay.setAttribute('aria-labelledby', 'welcome-modal-heading');
      welcomeOverlay.style.cssText = 'display:none; z-index:999999;';
      welcomeOverlay.innerHTML = `
        <div class="modal-container welcome-modal-container card-beam" id="welcome-modal-card">
          <button id="welcome-modal-close" class="modal-close-btn" aria-label="Close welcome form" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div id="welcome-form-wrapper">
            <div class="welcome-modal-header">
              <span class="badge badge-cyan" style="gap:6px;">
                <span class="live-dot" style="background:#00F2FE;"></span>
                Welcome to TAVRICON
              </span>
              <h3 class="welcome-modal-title" id="welcome-modal-heading">Let's Personalize Your Growth Path</h3>
              <p class="welcome-modal-subtitle">
                Introduce yourself to receive custom growth perspectives, or feel free to skip and explore the intelligence suite.
              </p>
            </div>
            <form id="welcome-lead-form" novalidate>
              <div class="form-group" style="margin-bottom:12px;">
                <label for="welcome-name" class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
                  <span>Name</span>
                  <span style="font-size:0.75rem; color:var(--text-faint); font-weight:normal;">(Optional)</span>
                </label>
                <div class="welcome-input-wrap">
                  <span class="welcome-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input type="text" id="welcome-name" class="form-input" placeholder="Your Name (e.g. Aditya / Sarah)" autocomplete="name">
                </div>
              </div>
              <div class="form-group" style="margin-bottom:12px;">
                <label for="welcome-phone" class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
                  <span>Phone / WhatsApp Number</span>
                  <span style="font-size:0.75rem; color:var(--text-faint); font-weight:normal;">(Optional)</span>
                </label>
                <div class="welcome-input-wrap">
                  <span class="welcome-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <input type="tel" id="welcome-phone" class="form-input" placeholder="+91 / WhatsApp Number" autocomplete="tel">
                </div>
              </div>
              <div class="form-group" style="margin-bottom:12px;">
                <label for="welcome-email" class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
                  <span>Gmail / Email</span>
                  <span style="font-size:0.75rem; color:var(--text-faint); font-weight:normal;">(Optional)</span>
                </label>
                <div class="welcome-input-wrap">
                  <span class="welcome-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  <input type="email" id="welcome-email" class="form-input" placeholder="yourname@gmail.com" autocomplete="email">
                </div>
              </div>
              <div class="form-group" style="margin-bottom:18px;">
                <label for="welcome-work" class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
                  <span>Work / Business / Brand</span>
                  <span style="font-size:0.75rem; color:var(--text-faint); font-weight:normal;">(Optional)</span>
                </label>
                <div class="welcome-input-wrap">
                  <span class="welcome-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  </span>
                  <input type="text" id="welcome-work" class="form-input" placeholder="e.g. E-Commerce, Local Business, Agency" autocomplete="organization">
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:10px;">
                <button type="submit" id="welcome-submit-btn" class="btn btn-primary" style="width:100%;">
                  Continue to TAVRICON &rarr;
                </button>
                <button type="button" id="welcome-skip-btn" class="btn btn-ghost" style="width:100%; font-size:0.85rem; color:var(--text-muted); padding:8px;">
                  Skip for now &amp; explore website &rarr;
                </button>
              </div>
            </form>
          </div>
          <div id="welcome-success-state" style="display:none; text-align:center; padding:12px 4px;">
            <div style="width:52px; height:52px; border-radius:50%; background:var(--aurora-gradient); color:#FFFFFF; display:flex; align-items:center; justify-content:center; margin-inline:auto; margin-bottom:14px; box-shadow:0 0 30px rgba(0,242,254,0.45);">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style="color:#FFFFFF; font-size:1.3rem; margin-bottom:8px;" id="welcome-success-title">Welcome to TAVRICON!</h3>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6; margin-bottom:18px;" id="welcome-success-desc">
              Thank you for connecting with us. Enjoy discovering our high-performance marketing engines.
            </p>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <a id="welcome-wa-fasttrack" href="https://wa.me/919799111507" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="display:none; width:100%;">
                Fast-Track on WhatsApp &rarr;
              </a>
              <button type="button" id="welcome-continue-btn" class="btn btn-secondary btn-sm" style="width:100%;">
                Explore Website Now
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(welcomeOverlay);
    }

    const welcomeCloseBtn = welcomeOverlay.querySelector('#welcome-modal-close');
    const welcomeSkipBtn = welcomeOverlay.querySelector('#welcome-skip-btn');
    const welcomeForm = welcomeOverlay.querySelector('#welcome-lead-form');
    const welcomeFormWrapper = welcomeOverlay.querySelector('#welcome-form-wrapper');
    const welcomeSuccessState = welcomeOverlay.querySelector('#welcome-success-state');
    const welcomeSuccessTitle = welcomeOverlay.querySelector('#welcome-success-title');
    const welcomeSuccessDesc = welcomeOverlay.querySelector('#welcome-success-desc');
    const welcomeWaFasttrack = welcomeOverlay.querySelector('#welcome-wa-fasttrack');
    const welcomeContinueBtn = welcomeOverlay.querySelector('#welcome-continue-btn');

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
    };

    // Expose functions globally for testability & external hooks
    window.openWelcomePopup = openWelcomeModal;
    window.closeWelcomePopup = closeWelcomeModal;

    // Trigger reliably after 5.0 seconds (user requested 5-10 sec window)
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
