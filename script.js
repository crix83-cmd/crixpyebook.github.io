/* ============================================
   CRIXPY EBOOK STORE — script.js
   ============================================ */

/* ── Navbar scroll behaviour ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });
}

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
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
const revealEls = document.querySelectorAll('.step-card, .feature-card, .book-card, .faq-card');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0) + (i * 80);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach((el, i) => {
    el.dataset.delay = i * 60;
    observer.observe(el);
  });
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
// Close popup when clicking overlay backdrop
document.querySelectorAll('.popup-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup(overlay.id);
  });
});
// Close popup on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.popup-overlay.active').forEach(el => closePopup(el.id));
  }
});

/* ── Toast notification ── */
function showToast(msg, duration = 3500) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;
  if (toastMsg) toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Input validation helper ── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^[0-9+\s\-]{7,15}$/.test(phone);
}
function markError(inputId) {
  const el = document.getElementById(inputId);
  if (el) {
    el.classList.add('error');
    el.addEventListener('input', () => el.classList.remove('error'), { once: true });
  }
}

/* ── ORDER FORM ── */
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('fullName')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();
    const whatsapp = document.getElementById('whatsapp')?.value.trim();
    const book    = document.getElementById('bookName')?.value.trim();
    const author  = document.getElementById('bookAuthor')?.value.trim();
    const notes   = document.getElementById('notes')?.value.trim();

    // Validation
    let valid = true;
    if (!name)          { markError('fullName');   valid = false; }
    if (!email || !validateEmail(email)) { markError('email'); valid = false; }
    if (!whatsapp)      { markError('whatsapp');   valid = false; }
    if (!book)          { markError('bookName');   valid = false; }
    if (!author)        { markError('bookAuthor'); valid = false; }

    if (!valid) {
      showToast('Please fill in all required fields correctly.');
      return;
    }

    // Build WhatsApp message
    const message = encodeURIComponent(
      `*📚 New Ebook Order — Crixpy Ebook Store*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📱 *WhatsApp:* ${whatsapp}\n` +
      `📖 *Book:* ${book}\n` +
      `✍️ *Author:* ${author}\n` +
      (notes ? `📝 *Notes:* ${notes}\n` : '') +
      `\n_Please send a preview of the book to my WhatsApp for confirmation before payment. Thank you!_`
    );

    const waNumber = '233593625059';
    const waUrl = `https://wa.me/${waNumber}?text=${message}`;

    window.open(waUrl, '_blank');
    showPopup('orderPopup');
    orderForm.reset();
  });
}

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('cName')?.value.trim();
    const email   = document.getElementById('cEmail')?.value.trim();
    const message = document.getElementById('cMessage')?.value.trim();

    let valid = true;
    if (!name)                         { markError('cName');    valid = false; }
    if (!email || !validateEmail(email)) { markError('cEmail'); valid = false; }
    if (!message)                      { markError('cMessage'); valid = false; }

    if (!valid) {
      showToast('Please fill in all required fields.');
      return;
    }

    const waMsg = encodeURIComponent(
      `*📬 Contact Message — Crixpy Ebook Store*\n\n` +
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

/* ── Keep navbar scrolled on inner pages ── */
(function () {
  const path = window.location.pathname.split('/').pop();
  if (path && path !== 'index.html' && path !== '') {
    if (navbar) navbar.classList.add('scrolled');
  }
})();

/* ── Book card subtle hover sound (visual only — no audio dep) ── */
// Adds a micro-animation to book cards on the homepage
document.querySelectorAll('.book-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transition = 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)';
  });
  card.addEventListener('mouseleave', function () {
    this.style.transition = 'all 0.22s cubic-bezier(0.4,0,0.2,1)';
  });
});
