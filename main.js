/* ============================================
   PRAJWAL KEDARI PORTFOLIO — MAIN JS
   ============================================ */

/* ---- CUSTOM CURSOR ---- */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = -100, my = -100, rx = -100, ry = -100;

if (dot && ring) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseenter', () => { document.body.classList.add('has-custom-cursor'); });

  const lerp = (a, b, t) => a + (b - a) * t;
  let rAF;
  function animateCursor() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    rAF = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('active'); ring.classList.add('active'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('active'); ring.classList.remove('active'); });
  });
}

/* ---- NAV SCROLL ---- */
const navHeader = document.getElementById('nav-header');
if (navHeader) {
  const onScroll = () => navHeader.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---- MOBILE NAV ---- */
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav    = document.getElementById('mobile-nav');
if (hamburgerBtn && mobileNav) {
  hamburgerBtn.addEventListener('click', () => mobileNav.classList.toggle('open'));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
}

/* ---- SCROLL REVEAL ---- */
const revealEls = document.querySelectorAll('.reveal:not(.in-view)');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
revealEls.forEach(el => io.observe(el));

/* ---- TYPING ROLES ---- */
const roles = [
  "ML Engineer & Researcher",
  "Backend Developer",
  "Automation Builder",
  "Open Source Contributor",
  "PyPI Package Author",
];
let roleIdx = 0, charIdx = 0, deleting = false, delay = 120;
const typingEl = document.getElementById('typing-text');

function typeStep() {
  if (!typingEl) return;
  const current = roles[roleIdx];
  if (!deleting) {
    typingEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) { deleting = true; delay = 1800; }
    else { delay = 80; }
  } else {
    typingEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    } else { delay = 45; }
  }
  setTimeout(typeStep, delay);
}
setTimeout(typeStep, 600);

/* ---- COUNTER ANIMATION ---- */
function startCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix;
  const dur = 1800;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(eased * target);
    el.innerHTML = val + `<span class="teal-text">${suffix}</span>`;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-target]');
if (counterEls.length) {
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        startCounter(e.target);
        counterIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  counterEls.forEach(el => counterIO.observe(el));
}

/* ---- PROJECT MODAL ---- */
const modalOverlay = document.getElementById('modal-overlay');
const modalBox     = document.getElementById('modal-box');
const modalContent = document.getElementById('modal-content');
const modalClose   = document.getElementById('modal-close');

function toneClass(tone) {
  const map = { gold: 'badge-gold', teal: 'badge-teal', purple: 'badge-purple', green: 'badge-green', orange: 'badge-orange', coral: 'badge-coral' };
  return map[tone] || 'badge-purple';
}

function openModal(slug) {
  const p = getProject(slug);
  if (!p || !modalOverlay) return;
  modalContent.innerHTML = `
    <div class="modal-header">
      <div class="modal-badges">
        <span class="project-badge ${toneClass(p.badge.tone)}">${p.badge.label}</span>
        <span class="modal-metric">${p.metric}</span>
      </div>
      <div class="modal-title">${p.title}</div>
      <div class="modal-liner">${p.oneLiner}</div>
    </div>
    <div class="modal-body">
      <div>
        <div class="modal-section-label">Overview</div>
        <p class="modal-section-text">${p.overview}</p>
      </div>
      <div>
        <div class="modal-section-label">Problem</div>
        <p class="modal-section-text">${p.problem}</p>
      </div>
      <div>
        <div class="modal-section-label">Solution</div>
        <p class="modal-section-text">${p.solution}</p>
      </div>
      <div>
        <div class="modal-section-label">Architecture</div>
        <ul class="modal-list">
          ${p.architecture.map(a => `<li><span class="modal-arrow">→</span><span>${a}</span></li>`).join('')}
        </ul>
      </div>
      <div>
        <div class="modal-section-label">Key Features</div>
        <ul class="modal-list modal-grid-2">
          ${p.features.map(f => `<li><span class="modal-arrow">→</span><span>${f}</span></li>`).join('')}
        </ul>
      </div>
      <div>
        <div class="modal-section-label">Results / Impact</div>
        <ul class="modal-list">
          ${p.results.map(r => `<li><span class="modal-check">✓</span><span>${r}</span></li>`).join('')}
        </ul>
      </div>
      <div>
        <div class="modal-section-label">Tech Stack</div>
        <div class="modal-tags">
          ${p.tech.map(t => `<span class="modal-tag">${t}</span>`).join('')}
        </div>
      </div>
      ${p.links && p.links.length ? `
      <div class="modal-links">
        ${p.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" class="modal-ext-link">↗ ${l.label}</a>`).join('')}
      </div>` : ''}
      <div class="modal-footer">
        <a href="projects/index.html" class="modal-casestudy">Open Full Case Study ↗</a>
      </div>
    </div>`;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalClose)   modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---- RENDER FEATURED PROJECTS ---- */
function renderProjectCard(p, compact = false) {
  const isFlagship = p.slug === 'smartshield-ai';
  const badgeLabel = isFlagship ? 'FLAGSHIP · PUBLISHED · IJCRT' : p.badge.label;
  const badgeTone  = isFlagship ? 'gold' : p.badge.tone;
  const maxTech    = isFlagship ? 8 : compact ? 3 : 5;

  return `
  <div class="project-card ${isFlagship ? 'flagship' : ''} ${p.wide && !compact ? 'wide-card' : ''}" data-slug="${p.slug}">
    ${isFlagship ? '<span class="featured-badge">✦ Featured</span>' : ''}
    <div class="project-header">
      <span class="project-badge ${toneClass(badgeTone)}">${badgeLabel}</span>
      ${!isFlagship ? '<span class="project-arrow-btn">↗</span>' : ''}
    </div>
    <h3 class="project-title ${isFlagship ? 'flagship-title' : ''}">${p.title}</h3>
    <p class="project-liner ${isFlagship ? 'flagship-liner' : ''}">${p.oneLiner}</p>
    <p class="project-metric">${p.metric}</p>
    <div class="project-techs">
      ${p.tech.slice(0, maxTech).map(t => `<span class="project-tech">${t}</span>`).join('')}
    </div>
    <div class="project-view-hint">View Details ↗</div>
  </div>`;
}

const featuredGrid = document.getElementById('featured-projects-grid');
if (featuredGrid) {
  featuredGrid.innerHTML = featuredProjects.map(p => renderProjectCard(p)).join('');
  featuredGrid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.slug));
  });
}

/* ---- QR CODE (simple canvas-based) ---- */
// Lightweight QR using a fallback image approach via a free QR API
const qrCanvas = document.getElementById('qr-canvas');
if (qrCanvas) {
  const url = encodeURIComponent(window.location.origin || 'https://prajwalkedari.dev');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const ctx = qrCanvas.getContext('2d');
    ctx.fillStyle = '#f0f0ff';
    ctx.fillRect(0, 0, 120, 120);
    ctx.drawImage(img, 0, 0, 120, 120);
  };
  img.onerror = () => {
    // Fallback: draw a placeholder
    const ctx = qrCanvas.getContext('2d');
    ctx.fillStyle = '#f0f0ff';
    ctx.fillRect(0, 0, 120, 120);
    ctx.fillStyle = '#07080f';
    ctx.font = '10px DM Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', 60, 55);
    ctx.fillText('Portfolio', 60, 70);
  };
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${url}&color=07080f&bgcolor=f0f0ff`;
}
