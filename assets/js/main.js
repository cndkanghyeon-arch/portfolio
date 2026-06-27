/* ============================================================
   NAVBAR
   ============================================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.stat-num[data-target]');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counters.forEach(animateCounter);
  }
}, { threshold: 0.4 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ============================================================
   FADE IN ON SCROLL
   ============================================================ */
const fadeEls = document.querySelectorAll(
  '.timeline-item, .comp-card, .project-block, .highlight-card, .award-item, .edu-card'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

fadeEls.forEach(el => fadeObserver.observe(el));

/* ============================================================
   RAINBOW FLASH ON CAREER SCROLL
   ============================================================ */
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const strongs = entry.target.querySelectorAll('.highlight-list strong');
      strongs.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('rainbow-flash');
          el.addEventListener('animationend', () => {
            el.classList.remove('rainbow-flash');
          }, { once: true });
        }, i * 150);
      });
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.timeline-item').forEach(item => {
  timelineObserver.observe(item);
});

/* ============================================================
   LIGHTBOX
   ============================================================ */
const overlay = document.createElement('div');
overlay.className = 'lightbox-overlay';
const lbImg = document.createElement('img');
overlay.appendChild(lbImg);
document.body.appendChild(overlay);

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    overlay.classList.add('active');
  });
});

overlay.addEventListener('click', () => overlay.classList.remove('active'));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') overlay.classList.remove('active');
});
