/**
 * TAVRICON Direct-Response Landing Page Controller (landing.js)
 * High-Converting Interactions, ROI Simulator, FAQ, and Fast-Track Lead Processing
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth Scrolling for Anchor Links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerHeight = document.querySelector('.landing-header')?.offsetHeight || 70;
          const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 2. Interactive ROI / ROAS Growth Simulator
  const spendSlider = document.getElementById('landing-spend-slider');
  const spendValDisplay = document.getElementById('landing-spend-val');
  const stdRevDisplay = document.getElementById('calc-std-rev');
  const tavRevDisplay = document.getElementById('calc-tav-rev');
  const liftValDisplay = document.getElementById('calc-lift-val');
  const lockInBtn = document.getElementById('calc-lock-in-btn');

  function formatINR(num) {
    if (num >= 10000000) {
      return '₹' + (num / 10000000).toFixed(2) + ' Cr';
    } else if (num >= 100000) {
      return '₹' + (num / 100000).toFixed(1) + ' Lakh';
    } else {
      return '₹' + num.toLocaleString('en-IN');
    }
  }

  function updateROASCalculator() {
    if (!spendSlider) return;
    const spend = parseInt(spendSlider.value, 10);
    if (spendValDisplay) spendValDisplay.textContent = formatINR(spend);

    const stdROAS = 1.8;
    const tavROAS = 4.8;

    const stdRev = Math.round(spend * stdROAS);
    const tavRev = Math.round(spend * tavROAS);
    const lift = tavRev - stdRev;

    if (stdRevDisplay) stdRevDisplay.textContent = formatINR(stdRev);
    if (tavRevDisplay) tavRevDisplay.textContent = formatINR(tavRev);
    if (liftValDisplay) liftValDisplay.textContent = '+' + formatINR(lift) + '/mo';
  }

  if (spendSlider) {
    spendSlider.addEventListener('input', updateROASCalculator);
    updateROASCalculator();
  }

  if (lockInBtn) {
    lockInBtn.addEventListener('click', () => {
      const spend = parseInt(spendSlider?.value || 250000, 10);
      const budgetSelect = document.getElementById('audit-budget');
      if (budgetSelect) {
        if (spend < 100000) {
          budgetSelect.value = 'under-1L';
        } else if (spend <= 500000) {
          budgetSelect.value = '1L-5L';
        } else if (spend <= 1500000) {
          budgetSelect.value = '5L-15L';
        } else {
          budgetSelect.value = '15L-plus';
        }
      }
      const formEl = document.getElementById('audit-form-anchor');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // 3. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 4. Audit Lead Form Submission & WhatsApp Fast-Track
  const auditForm = document.getElementById('landing-audit-form');
  const auditSuccessBox = document.getElementById('audit-success-box');
  const auditWaFasttrack = document.getElementById('audit-wa-fasttrack');

  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('audit-name');
      const phoneInput = document.getElementById('audit-phone');
      const emailInput = document.getElementById('audit-email');
      const brandInput = document.getElementById('audit-brand');
      const budgetSelect = document.getElementById('audit-budget');
      const goalSelect = document.getElementById('audit-goal');

      const name = nameInput?.value.trim() || 'Valued Growth Partner';
      const phone = phoneInput?.value.trim() || 'N/A';
      const email = emailInput?.value.trim() || 'N/A';
      const brand = brandInput?.value.trim() || 'Not specified';
      const budget = budgetSelect?.options[budgetSelect.selectedIndex]?.text || 'Not specified';
      const goal = goalSelect?.options[goalSelect.selectedIndex]?.text || 'Scale Ad Accounts';

      // Pre-fill instant WhatsApp VIP Link to Founder Aditya Singh
      const msgText = `Hello Aditya! I just requested a Free Growth Audit on TAVRICON.\n\n👤 Name: ${name}\n📱 WhatsApp: ${phone}\n✉️ Email: ${email}\n🌐 Brand/URL: ${brand}\n💰 Monthly Spend: ${budget}\n🎯 Primary Goal: ${goal}`;
      const encodedMsg = encodeURIComponent(msgText);
      const waUrl = `https://wa.me/919799111507?text=${encodedMsg}`;

      if (auditWaFasttrack) {
        auditWaFasttrack.href = waUrl;
      }

      // Hide form & show success box
      auditForm.style.display = 'none';
      if (auditSuccessBox) {
        auditSuccessBox.style.display = 'block';
        auditSuccessBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Auto-open WhatsApp after 2 seconds for ultra-high conversion
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1500);
    });
  }
});
