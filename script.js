/* ============================================
   CRIXPY EBOOK STORE — Main JavaScript
   ============================================ */

/* ── Navbar scroll behaviour ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ── Active nav link ── */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Scroll-reveal (Intersection Observer) ── */
const revealEls = document.querySelectorAll('.step-card, .feature-card');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
}

/* ── Popup helpers ── */
function showPopup(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closePopup(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}
// Close popup when clicking overlay
document.querySelectorAll('.popup-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup(overlay.id);
  });
});

/* ── ORDER FORM ── */
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  // File upload label update
  const fileInput = document.getElementById('paymentScreenshot');
  const fileLabel = document.getElementById('fileLabel');
  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        fileLabel.textContent = `✅ ${file.name}`;
      } else {
        fileLabel.textContent = 'Click to upload payment screenshot (optional)';
      }
    });
  }

  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name      = document.getElementById('fullName').value.trim();
    const email     = document.getElementById('email').value.trim();
    const whatsapp  = document.getElementById('whatsapp').value.trim();
    const book      = document.getElementById('bookName').value.trim();
    const author    = document.getElementById('bookAuthor').value.trim();
    const amount    = document.getElementById('amount').value.trim();
    const txnId     = document.getElementById('transactionId').value.trim();

    // Basic validation
    if (!name || !email || !whatsapp || !book || !amount || !txnId) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Build WhatsApp message
    const message = encodeURIComponent(
      `*📚 New Ebook Order — Crixpy Ebook Store*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📱 *WhatsApp:* ${whatsapp}\n` +
      `📖 *Book:* ${book}\n` +
      `✍️ *Author:* ${author || 'Not specified'}\n` +
      `💰 *Amount Paid:* GHS ${amount}\n` +
      `🔖 *Transaction ID:* ${txnId}\n\n` +
      `_Please send the ebook to the email above after confirming payment. Thank you!_`
    );

    const waNumber = '233593625059'; // 0593625059 → international
    const waUrl = `https://wa.me/${waNumber}?text=${message}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // Show success popup
    showPopup('orderPopup');

    // Reset form
    orderForm.reset();
    if (fileLabel) fileLabel.textContent = 'Click to upload payment screenshot (optional)';
  });
}

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('cName').value.trim();
    const email   = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Send via WhatsApp
    const waMsg = encodeURIComponent(
      `*📬 Contact Form — Crixpy Ebook Store*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `💬 *Message:* ${message}`
    );
    const waNumber = '233593625059';
    window.open(`https://wa.me/${waNumber}?text=${waMsg}`, '_blank');

    showPopup('contactPopup');
    contactForm.reset();
  });
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Navbar always scrolled on inner pages ── */
(function () {
  const path = window.location.pathname.split('/').pop();
  if (path && path !== 'index.html' && path !== '') {
    if (navbar) navbar.classList.add('scrolled');
  }
})();
