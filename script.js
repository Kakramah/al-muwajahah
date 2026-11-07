/* ═══════════════════════════════════════════
   المواجهة – سلوك الصفحة
   ═══════════════════════════════════════════ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Navbar: transparent at the top, glass after scrolling ──
const navbar = document.getElementById('navbar');
const onNavScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onNavScroll, { passive: true });
onNavScroll();

// ── Scroll reveal (skipped entirely with reduced motion) ──
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealEls = document.querySelectorAll(
    '.article-text, .article-highlight, .info-card, .timeline-item, .chapter-img-container'
  );
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 70 * (entry.target.dataset.delay || 0));
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    el.dataset.delay = i % 3;
    revealObserver.observe(el);
  });
}

// ── Lightbox gallery: title and description, arrow keys (right = previous in Arabic) ──
const galleryImgs = Array.from(document.querySelectorAll('.chapter-img-container img'));
let lb = null;
let current = 0;

function buildLightbox() {
  lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.hidden = true;
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'معرض الصور');
  lb.innerHTML = `
    <button type="button" class="lb-close" aria-label="إغلاق">✕</button>
    <button type="button" class="lb-btn lb-prev" aria-label="الصورة السابقة">›</button>
    <img alt="" />
    <div class="lb-caption"><h3 class="lb-title"></h3><p class="lb-desc"></p></div>
    <button type="button" class="lb-btn lb-next" aria-label="الصورة التالية">‹</button>
  `;
  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  lb.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.body.appendChild(lb);
}

function show(i) {
  current = (i + galleryImgs.length) % galleryImgs.length;
  const src = galleryImgs[current];
  const img = lb.querySelector('img');
  img.src = src.currentSrc || src.src;
  img.alt = src.alt;
  lb.querySelector('.lb-title').textContent = src.dataset.title || '';
  lb.querySelector('.lb-desc').textContent = src.dataset.desc || '';
}

function openLightbox(i) {
  if (!lb) buildLightbox();
  show(i);
  lb.hidden = false;
  lb.querySelector('.lb-close').focus();
}

function closeLightbox() {
  if (!lb) return;
  lb.hidden = true;
  galleryImgs[current].focus({ preventScroll: true });
}

galleryImgs.forEach((img, i) => {
  img.tabIndex = 0;
  img.addEventListener('click', () => openLightbox(i));
  img.addEventListener('keydown', (e) => { if (e.key === 'Enter') openLightbox(i); });
});

document.addEventListener('keydown', (e) => {
  if (!lb || lb.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowRight') show(current - 1);
  else if (e.key === 'ArrowLeft') show(current + 1);
});

// ── In-page links: smooth unless reduced motion ──
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

// ── Hero parallax (off with reduced motion) ──
const heroImg = document.querySelector('.hero-img');
if (heroImg && !reduceMotion) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.15}px)`;
    }
  }, { passive: true });
}

// ── Share ──
const shareUrl = 'https://kakramah.github.io/al-muwajahah/';
const shareTitle = document.title;
const shareText = `${shareTitle}\n${shareUrl}`;
const enc = encodeURIComponent;
const done = document.getElementById('share-done');

document.getElementById('share-wa').href = `https://wa.me/?text=${enc(shareText)}`;
document.getElementById('share-tg').href = `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(shareTitle)}`;
document.getElementById('share-x').href = `https://x.com/intent/post?text=${enc(shareTitle)}&url=${enc(shareUrl)}`;
document.getElementById('share-fb').href = `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`;

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl);
    done.textContent = 'نُسخ الرابط.';
  } catch {
    done.textContent = `انسخ الرابط: ${shareUrl}`;
  }
}

document.getElementById('share-copy').addEventListener('click', copyLink);
const nativeBtn = document.getElementById('share-native');
if (navigator.share) {
  nativeBtn.addEventListener('click', () => {
    navigator.share({ title: shareTitle, text: shareTitle, url: shareUrl }).catch(() => {});
  });
} else {
  nativeBtn.hidden = true;
}
