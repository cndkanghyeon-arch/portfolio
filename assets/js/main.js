/* ============================================================
   NAVBAR
   ============================================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');

const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  if (scrollProgress) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
}, { passive: true });

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

/* ============================================================
   MARKETING DASHBOARD TABS (Project 03)
   ============================================================ */
(function () {
  const dash = document.getElementById('mktDash');
  if (!dash) return;

  const DATA = {
    bhc: {
      k1l: '월 총 주문', k1v: '48,291건', k1d: '▲ 9.3% vs 4월',
      k2v: '11.4%', k2d: '▲ 32.7%',
      k3v: '3,847건', k3d: '▲ 15.2% vs 4월',
      k4v: '87.3%', k4d: '▲ 22.1%p',
      k5l: '재구매율', k5v: '34.2%', k5d: '▲ 4.1%p',
      k6v: '₩23,400', k6d: '▲ 6.2%',
      weeks: [[45,34],[63,54],[77,70],[86,72],[100,88]],
      hours: [28,62,40,55,90,100],
      channels: [
        ['앱', 38, '#3b82f6'], ['배민', 29, '#f97316'], ['요기요', 18, '#10b981'],
        ['쿠팡이츠', 11, '#8b5cf6'], ['기타', 4, '#d1d5db']
      ],
      age: [
        ['20대 남', 16, '#3b82f6'], ['20대 여', 21, '#ec4899'], ['30대 남', 18, '#3b82f6'],
        ['30대 여', 23, '#ec4899'], ['40대+', 22, '#94a3b8']
      ],
      tableTitle: '지역별 성과',
      regions: [
        ['강남', '9,284', '14.2%', 'g', '▲11.3%', 'up'],
        ['홍대', '8,751', '13.8%', 'g', '▲8.9%', 'up'],
        ['신촌', '7,403', '12.1%', 'g', '▲6.4%', 'up'],
        ['강동', '6,982', '9.7%', 'y', '▲3.1%', 'up'],
        ['수원', '8,124', '7.3%', 'r', '▲0.8%', 'flat'],
        ['부산', '7,747', '6.8%', 'r', '▼1.2%', 'down']
      ],
      insight: '강남·홍대 지점의 주말 저녁 20-22시 주문이 평일 대비 44% 높습니다. 해당 시간대 푸시 알림 이벤트 실행 시 전환율 12~18%p 추가 개선 예상.'
    },
    outback: {
      k1l: '월 총 예약', k1v: '12,840건', k1d: '▲ 7.1% vs 4월',
      k2v: '9.8%', k2d: '▲ 18.4%',
      k3v: '2,103건', k3d: '▲ 11.7% vs 4월',
      k4v: '79.5%', k4d: '▲ 14.3%p',
      k5l: '재방문율', k5v: '41.8%', k5d: '▲ 5.6%p',
      k6v: '₩58,900', k6d: '▲ 3.4%',
      weeks: [[38,30],[55,48],[70,62],[78,66],[92,80]],
      hours: [22,48,30,60,88,100],
      channels: [
        ['앱', 44, '#3b82f6'], ['네이버예약', 31, '#10b981'], ['캐치테이블', 15, '#f97316'],
        ['워크인', 8, '#8b5cf6'], ['기타', 2, '#d1d5db']
      ],
      age: [
        ['20대', 14, '#3b82f6'], ['30대', 24, '#ec4899'], ['40대', 28, '#3b82f6'],
        ['50대', 19, '#ec4899'], ['가족', 15, '#94a3b8']
      ],
      tableTitle: '지역별 성과',
      regions: [
        ['코엑스', '2,418', '12.4%', 'g', '▲9.7%', 'up'],
        ['판교', '2,107', '11.6%', 'g', '▲8.1%', 'up'],
        ['잠실', '1,984', '10.3%', 'g', '▲5.8%', 'up'],
        ['해운대', '1,742', '8.9%', 'y', '▲2.6%', 'up'],
        ['대구', '1,531', '7.1%', 'r', '▲0.4%', 'flat'],
        ['광주', '1,358', '6.4%', 'r', '▼1.5%', 'down']
      ],
      insight: '디너 타임 예약 노쇼율이 주중 8.2%로 높습니다. 예약 전날 리마인드 알림 + 보증금 정책 도입 시 노쇼 40% 감소 예상. 가족 단위 주말 런치 수요가 전월 대비 22% 증가.'
    }
  };

  const $ = sel => dash.querySelector(sel);
  const setText = (key, val) => { const el = dash.querySelector('[data-k="' + key + '"]'); if (el) el.textContent = val; };

  function renderHBars(container, rows) {
    container.innerHTML = rows.map(([label, pct, color]) =>
      '<div class="dash-hbar-row">' +
        '<span class="dash-hbar-label">' + label + '</span>' +
        '<div class="dash-hbar-track"><div class="dash-hbar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
        '<span class="dash-hbar-val">' + pct + '%</span>' +
      '</div>'
    ).join('');
  }

  function renderWeeks(container, weeks) {
    const labels = ['1주','2주','3주','4주','5주'];
    container.innerHTML = weeks.map((pair, i) =>
      '<div class="dash-bar-col"><div class="dash-bar-pair">' +
        '<div class="dash-bar" style="height:' + pair[0] + '%"></div>' +
        '<div class="dash-bar dash-bar--b" style="height:' + pair[1] + '%"></div>' +
      '</div><span class="dash-bar-x">' + labels[i] + '</span></div>'
    ).join('');
  }

  function renderHours(container, hours) {
    const labels = ['11시','13시','15시','18시','20시','21시'];
    container.innerHTML = hours.map((h, i) =>
      '<div class="dash-bar-col"><div class="dash-bar-pair">' +
        '<div class="dash-bar" style="height:' + h + '%"></div>' +
      '</div><span class="dash-bar-x">' + labels[i] + '</span></div>'
    ).join('');
  }

  function renderRegions(tbody, regions) {
    tbody.innerHTML = regions.map(([name, orders, rate, tone, delta, dir]) =>
      '<tr><td>' + name + '</td><td>' + orders + '</td>' +
      '<td><span class="dash-pill dash-pill--' + tone + '">' + rate + '</span></td>' +
      '<td class="dash-' + dir + '">' + delta + '</td></tr>'
    ).join('');
  }

  function apply(tab) {
    const d = DATA[tab];
    ['k1l','k1v','k1d','k2v','k2d','k3v','k3d','k4v','k4d','k5l','k5v','k5d','k6v','k6d','tableTitle','insight']
      .forEach(k => setText(k, d[k]));
    renderHBars($('[data-k="channels"]'), d.channels);
    renderHBars($('[data-k="age"]'), d.age);
    renderWeeks($('[data-k="weeks"]'), d.weeks);
    renderHours($('[data-k="hours"]'), d.hours);
    renderRegions($('[data-k="regions"]'), d.regions);
  }

  dash.querySelectorAll('.dash-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      dash.querySelectorAll('.dash-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      apply(btn.dataset.dashTab);
    });
  });

  apply('bhc');
})();

/* ============================================================
   PRINT / PDF — reveal all content before printing
   ============================================================ */
function preparePrint() {
  // Reveal scroll-animated elements
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  // Set counters to their final value
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    el.textContent = el.dataset.target;
  });
  // Force lazy images to load
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.loading = 'eager';
    if (img.dataset.src) img.src = img.dataset.src;
  });
}
window.addEventListener('beforeprint', preparePrint);
