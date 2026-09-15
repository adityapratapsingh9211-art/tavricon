/**
 * TAVRICON — Interactive Filters, Estimator & Modal Readers
 * Services, Work/Case Studies, and Blog
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. GENERIC TAB / PILL FILTERING (Services, Work, Blog)
  // --------------------------------------------------------------------------
  const setupPillFilter = (filterContainerSelector, itemSelector) => {
    const filterContainer = document.querySelector(filterContainerSelector);
    if (!filterContainer) return;

    const filterBtns = filterContainer.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll(itemSelector);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        items.forEach(item => {
          const category = item.getAttribute('data-category') || '';
          const categories = category.split(' ');

          if (filterValue === 'all' || categories.includes(filterValue)) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  };

  setupPillFilter('.services-filter-bar', '.service-item-card');
  setupPillFilter('.work-filter-bar', '.work-card');
  setupPillFilter('.blog-filter-bar', '.blog-card, .featured-article-card');

  // --------------------------------------------------------------------------
  // 2. BLOG LIVE SEARCH
  // --------------------------------------------------------------------------
  const blogSearchInput = document.querySelector('.blog-search-input');
  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const articles = document.querySelectorAll('.blog-card');

      articles.forEach(article => {
        const title = (article.querySelector('.blog-card-title')?.textContent || '').toLowerCase();
        const snippet = (article.querySelector('.blog-card-desc')?.textContent || '').toLowerCase();
        const tag = (article.querySelector('.badge')?.textContent || '').toLowerCase();

        if (title.includes(query) || snippet.includes(query) || tag.includes(query)) {
          article.style.display = '';
        } else {
          article.style.display = 'none';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. INTERACTIVE GROWTH STRATEGY ESTIMATOR (services.html)
  // --------------------------------------------------------------------------
  const estimatorForm = document.querySelector('#strategy-estimator-form');
  if (estimatorForm) {
    const budgetSelect = estimatorForm.querySelector('#estimator-budget');
    const stageSelect = estimatorForm.querySelector('#estimator-stage');
    const recTierName = document.querySelector('#estimator-plan-name');
    const recTierDesc = document.querySelector('#estimator-plan-desc');
    const recChannels = document.querySelector('#estimator-plan-channels');
    const recTimeline = document.querySelector('#estimator-plan-timeline');

    const updatePlan = () => {
      const budget = budgetSelect?.value || 'starter';
      const stage = stageSelect?.value || 'growth';

      const plans = {
        starter: {
          name: 'Foundation & Rapid Testing Engine',
          desc: 'Precision PPC + Meta conversion setup designed to validate unit economics and secure high-intent customer inquiries.',
          channels: ['Meta Ads (IG/FB)', 'Google Search Ads', 'High-Converting Landing Pages', 'Basic Analytics'],
          timeline: '30-45 Days Initial Cycle'
        },
        growth: {
          name: 'Full-Funnel Scaling Engine',
          desc: 'Multi-channel acquisition combining Google Search + Shopping, Meta Ads, Technical SEO, and Email Automation flows.',
          channels: ['Meta Conversion Scaling', 'Google Ads & PMax', 'Authority SEO', 'Email Automation', 'CRO Audits'],
          timeline: '60-90 Days Acceleration'
        },
        enterprise: {
          name: 'Omnichannel Dominance & Global Scale',
          desc: 'High-velocity bespoke architecture with custom AI marketing workflows, high-budget performance media, and international targeting.',
          channels: ['Global Performance PPC', 'Semantic Authority SEO', 'AI Automations', 'VIP Retention Flows', 'Dedicated Strategy Director'],
          timeline: 'Continuous Quarterly Sprints'
        }
      };

      const selected = plans[budget] || plans.growth;
      if (recTierName) recTierName.textContent = selected.name;
      if (recTierDesc) recTierDesc.textContent = selected.desc;
      if (recTimeline) recTimeline.textContent = selected.timeline;
      if (recChannels) {
        recChannels.innerHTML = selected.channels
          .map(ch => `<span class="badge badge-cyan">${ch}</span>`)
          .join('');
      }
    };

    budgetSelect?.addEventListener('change', updatePlan);
    stageSelect?.addEventListener('change', updatePlan);
    updatePlan();
  }

  // --------------------------------------------------------------------------
  // 4. MODAL DRAWER / READER (Blog Articles & Case Studies)
  // --------------------------------------------------------------------------
  const modalOverlay = document.querySelector('#global-modal-overlay');
  const modalContainer = document.querySelector('#global-modal-container');
  const modalTitle = document.querySelector('#modal-title');
  const modalBody = document.querySelector('#modal-body');
  const modalCloseBtn = document.querySelector('#modal-close-btn');

  const openGlobalModal = (title, contentHtml) => {
    if (!modalOverlay) return;
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = contentHtml;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeGlobalModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeGlobalModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeGlobalModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeGlobalModal();
    }
  });

  // Attach modal trigger to Work "Deep Dive" buttons
  const workTriggers = document.querySelectorAll('.work-deep-dive-btn');
  workTriggers.forEach(btn => {
    const handleTrigger = (e) => {
      e.preventDefault();
      const card = btn.closest('.work-card');
      const title = card?.querySelector('.work-title')?.textContent || 'Case Study Deep Dive';
      const challenge = card?.getAttribute('data-challenge') || 'Expanding market reach with disciplined acquisition costs.';
      const strategy = card?.getAttribute('data-strategy') || 'Full-funnel segmentation with intent-focused creative variations.';
      const execution = card?.getAttribute('data-execution') || 'Deployed conversion-focused landing architecture with real-time bidding algorithms.';
      const results = card?.getAttribute('data-results') || '318% ROAS increase and 42% decrease in Cost Per Acquisition.';

      const content = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--cyan-primary); font-size:0.875rem; text-transform:uppercase; margin-bottom:6px; letter-spacing:0.06em;">01. The Challenge</h4>
            <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6;">${challenge}</p>
          </div>
          <div>
            <h4 style="color:var(--cyan-primary); font-size:0.875rem; text-transform:uppercase; margin-bottom:6px; letter-spacing:0.06em;">02. Strategic Hypothesis</h4>
            <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6;">${strategy}</p>
          </div>
          <div>
            <h4 style="color:var(--cyan-light); font-size:0.875rem; text-transform:uppercase; margin-bottom:6px; letter-spacing:0.06em;">03. Execution & Optimization</h4>
            <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6;">${execution}</p>
          </div>
          <div style="background:rgba(0, 242, 254, 0.08); border:1px solid rgba(0, 242, 254, 0.35); padding:16px; border-radius:12px; box-shadow:0 0 20px rgba(0,242,254,0.1);">
            <h4 style="color:#FFFFFF; font-size:0.85rem; text-transform:uppercase; margin-bottom:4px; letter-spacing:0.08em;">Verified Outcome</h4>
            <p style="font-size:1.15rem; font-weight:800; color:var(--cyan-primary); margin:0;">${results}</p>
          </div>
          <div style="margin-top:10px; text-align:center;">
            <a href="contact.html" class="btn btn-primary btn-sm" style="width:100%;">Discuss Similar Strategy for Your Brand</a>
          </div>
        </div>
      `;

      openGlobalModal(title, content);
    };

    btn.addEventListener('click', handleTrigger);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleTrigger(e);
    });
  });

  // Attach modal trigger to Blog "Read Article" cards
  const blogTriggers = document.querySelectorAll('.blog-read-trigger');
  blogTriggers.forEach(btn => {
    const handleTrigger = (e) => {
      e.preventDefault();
      const card = btn.closest('.blog-card') || btn.closest('.featured-article-card');
      const title = card?.querySelector('.blog-card-title, .featured-title')?.textContent || 'Article Insight';
      const category = card?.querySelector('.badge')?.textContent || 'Strategic Insight';
      const fullText = card?.getAttribute('data-fulltext') || 'In-depth digital marketing perspective from TAVRICON strategists.';

      const content = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-cyan">${category}</span>
            <span style="font-size:0.75rem; color:var(--text-faint); font-family:var(--font-mono);">By Aditya Singh • Founder, TAVRICON</span>
          </div>
          <div style="font-size:0.95rem; color:var(--text-secondary); line-height:1.75;">
            ${fullText}
          </div>
          <div style="margin-top:14px; padding-top:14px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <span style="font-size:0.85rem; color:var(--text-muted);">Want this strategy executed for your company?</span>
            <a href="contact.html" class="btn btn-primary btn-sm">Book Strategy Call</a>
          </div>
        </div>
      `;

      openGlobalModal(title, content);
    };

    btn.addEventListener('click', handleTrigger);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleTrigger(e);
    });
  });
});
