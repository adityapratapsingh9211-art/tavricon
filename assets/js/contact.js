/**
 * TAVRICON — Contact Page Lead Generation & QR Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('#tavricon-lead-form');
  const formSuccessMsg = document.querySelector('#form-success-message');

  // 1. Interactive Form Validation & Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Required fields
      const nameInput = contactForm.querySelector('#contact-name');
      const emailInput = contactForm.querySelector('#contact-email');
      const phoneInput = contactForm.querySelector('#contact-phone');
      const messageInput = contactForm.querySelector('#contact-message');

      const validateField = (input, condition, errorMsgId) => {
        const errorEl = contactForm.querySelector(`#${errorMsgId}`);
        if (!condition) {
          input?.classList.add('error');
          if (errorEl) {
            errorEl.classList.add('visible');
          }
          isValid = false;
        } else {
          input?.classList.remove('error');
          if (errorEl) {
            errorEl.classList.remove('visible');
          }
        }
      };

      // Name check
      validateField(nameInput, nameInput && nameInput.value.trim().length >= 2, 'err-name');

      // Email check (basic email regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateField(emailInput, emailInput && emailRegex.test(emailInput.value.trim()), 'err-email');

      // Phone check
      validateField(phoneInput, phoneInput && phoneInput.value.trim().length >= 7, 'err-phone');

      if (!isValid) {
        // Focus first error element
        const firstError = contactForm.querySelector('.form-input.error, .form-textarea.error');
        if (firstError) firstError.focus();
        return;
      }

      // Collect form values
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        company: contactForm.querySelector('#contact-company')?.value.trim() || 'N/A',
        website: contactForm.querySelector('#contact-website')?.value.trim() || 'N/A',
        budget: contactForm.querySelector('input[name="budget"]:checked')?.value || 'Not specified',
        message: messageInput?.value.trim() || 'General inquiry'
      };

      // Display friendly success state
      contactForm.style.display = 'none';
      if (formSuccessMsg) {
        formSuccessMsg.style.display = 'block';
        formSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Update WhatsApp button in confirmation with pre-filled message
        const waBtn = formSuccessMsg.querySelector('#confirm-whatsapp-btn');
        if (waBtn) {
          const encoded = encodeURIComponent(`Hi Aditya, I just submitted an inquiry on the TAVRICON website.\n\nName: ${formData.name}\nCompany: ${formData.company}\nBudget: ${formData.budget}\nGoals: ${formData.message}`);
          waBtn.href = `https://wa.me/919799111507?text=${encoded}`;
        }
      }
    });

    // Remove error class on user input
    contactForm.querySelectorAll('.form-input, .form-textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const err = field.parentElement?.querySelector('.form-error-msg');
        if (err) err.classList.remove('visible');
      });
    });
  }

  // 2. Social Media QR Code Modal Viewers
  const instaTrigger = document.querySelector('#trigger-insta-qr');
  const snapTrigger = document.querySelector('#trigger-snap-qr');
  const qrModal = document.querySelector('#qr-modal-overlay');
  const qrModalImage = document.querySelector('#qr-modal-img');
  const qrModalTitle = document.querySelector('#qr-modal-title');
  const qrModalHandle = document.querySelector('#qr-modal-handle');
  const qrModalClose = document.querySelector('#qr-modal-close');

  const openQR = (type) => {
    if (!qrModal) return;
    if (type === 'insta') {
      if (qrModalImage) qrModalImage.src = 'assets/images/contact/insta-qr.jpeg';
      if (qrModalTitle) qrModalTitle.textContent = 'Connect on Instagram';
      if (qrModalHandle) {
        qrModalHandle.textContent = '@ap_singhcharan';
        qrModalHandle.href = 'https://instagram.com/ap_singhcharan';
      }
    } else if (type === 'snap') {
      if (qrModalImage) qrModalImage.src = 'assets/images/contact/snap-qr.jpeg';
      if (qrModalTitle) qrModalTitle.textContent = 'Connect on Snapchat';
      if (qrModalHandle) {
        qrModalHandle.textContent = 'adityaprata4718';
        qrModalHandle.href = '#';
      }
    }
    qrModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeQR = () => {
    if (!qrModal) return;
    qrModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (instaTrigger) instaTrigger.addEventListener('click', () => openQR('insta'));
  if (snapTrigger) snapTrigger.addEventListener('click', () => openQR('snap'));
  if (qrModalClose) qrModalClose.addEventListener('click', closeQR);
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQR();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal && qrModal.classList.contains('active')) {
      closeQR();
    }
  });
});
