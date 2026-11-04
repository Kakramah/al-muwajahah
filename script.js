/* ═══════════════════════════════════════════
   KHALDOUN & ANTIGRAVITY – TEMPLATE JS
   ═══════════════════════════════════════════ */

// ── Navbar scroll effect ─────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Scroll reveal for sections and cards ──
const revealEls = document.querySelectorAll(
  '.article-text, .article-highlight, .info-card, .timeline-item, .chapter-img-container'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 70 * (entry.target.dataset.delay || 0));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(25px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  el.dataset.delay = i % 3;
  revealObserver.observe(el);
});

// ── Simple Lightbox for Images ───────────
document.querySelectorAll('.chapter-img-container img').forEach(img => {
  img.addEventListener('click', () => {
    const src = img.src;
    if (!src) return;

    const lb = document.createElement('div');
    lb.style.cssText = `
      position:fixed;inset:0;z-index:9999;background:rgba(10,17,40,0.95);
      display:flex;align-items:center;justify-content:center;cursor:zoom-out;
      animation:fadeIn 0.25s ease;
    `;
    const fullImg = document.createElement('img');
    fullImg.src = src;
    fullImg.style.cssText = `
      max-width:90vw;max-height:90vh;border-radius:12px;
      box-shadow:0 20px 80px rgba(0,0,0,0.9);object-fit:contain;
    `;
    lb.appendChild(fullImg);
    lb.addEventListener('click', () => document.body.removeChild(lb));
    document.body.appendChild(lb);
  });
});

// Fade in animation style injection
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(style);

// ── Smooth scroll for links ──────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Parallax effect on hero background ────
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroImg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.15}px)`;
  }
}, { passive: true });
