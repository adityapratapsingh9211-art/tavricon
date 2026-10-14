/**
 * TAVRICON Compact Landing Page Controller (landing.js)
 * Clean, Fast-Track Lead Processing & WhatsApp Direct Link
 */

document.addEventListener('DOMContentLoaded', () => {
  const auditForm = document.getElementById('landing-audit-form');
  const auditSuccessBox = document.getElementById('audit-success-box');
  const auditWaFasttrack = document.getElementById('audit-wa-fasttrack');

  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('audit-name')?.value.trim() || 'Visitor';
      const phone = document.getElementById('audit-phone')?.value.trim() || 'N/A';
      const brand = document.getElementById('audit-brand')?.value.trim() || 'Not specified';
      const budgetSelect = document.getElementById('audit-budget');
      const budget = budgetSelect?.options[budgetSelect.selectedIndex]?.text || 'Not specified';

      // Build instant WhatsApp message to founder Aditya Singh
      const msgText = `Hello Aditya! I am requesting a Free Ad Account Growth Audit on TAVRICON.\n\n👤 Name: ${name}\n📱 WhatsApp: ${phone}\n🌐 Brand/URL: ${brand}\n💰 Monthly Spend: ${budget}`;
      const waUrl = `https://wa.me/919799111507?text=${encodeURIComponent(msgText)}`;

      if (auditWaFasttrack) {
        auditWaFasttrack.href = waUrl;
      }

      // Hide form & show quick confirmation box
      auditForm.style.display = 'none';
      if (auditSuccessBox) {
        auditSuccessBox.style.display = 'block';
      }

      // Automatically launch WhatsApp for instant VIP service
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1200);
    });
  }
});
