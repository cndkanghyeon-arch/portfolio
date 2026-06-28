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
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    hamburger?.setAttribute('aria-label', '메뉴 열기');
  });
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

function openLightbox(img) {
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  overlay.classList.add('active');
}

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.tabIndex = 0;
  img.setAttribute('role', 'button');
  img.setAttribute('aria-label', (img.alt || '이미지') + ' 확대 보기');
  img.addEventListener('click', () => openLightbox(img));
  img.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(img);
    }
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

  const $ = key => dash.querySelector('[data-k="' + key + '"]');

  /* ---------- 통합 데이터 ---------- */
  const KPIS = [
    ['매출', '247,542,155원', '#3b82f6', ['전월대비 ▲2%', 'up'], ['전년동월대비 ▼3%', 'down']],
    ['방문자수(GA)', '69,932명', '#8b5cf6', ['MAU 기준', 'flat'], ['전월대비 ▲5%', 'up']],
    ['회원가입', '3,748명', '#10b981', ['전월대비 ▲8%', 'up'], ['전년동월대비 ▲12%', 'up']],
    ['광클럽가입', '258명', '#f97316', ['전월대비 ▲14%', 'up'], ['전년동월대비 ▲21%', 'up']],
    ['객단가', '19,872원', '#ec4899', ['전월대비 ▼1%', 'down'], ['전년동월대비 ▲4%', 'up']]
  ];

  const PATTERN = [
    ['총 주문건수', '12,457건'], ['신규 구매', '4,182건'], ['재구매', '8,275건'],
    ['재구매 비율', '66.4%'], ['평균 구매주기', '23일'], ['회원 구매비중', '81%']
  ];

  const GENDER = [['여성', 58, '#ec4899'], ['남성', 42, '#3b82f6']];

  const AGE_DIST = [
    ['20대', 12, '#3b82f6'], ['30대', 27, '#3b82f6'], ['40대', 31, '#3b82f6'],
    ['50대', 21, '#3b82f6'], ['60대+', 9, '#3b82f6']
  ];

  // 31일 일매출 (백만원 단위 상대값)
  const DAILY = [62,55,48,70,82,91,76,58,52,64,73,88,95,80,61,57,66,79,90,99,84,63,59,71,86,93,100,82,68,74,89];

  const YEAR_TREND = {
    months: ['1','2','3','4','5','6','7','8','9','10','11','12'],
    series: [
      ['2024', '#cbd5e1', [180,165,190,205,210,225,240,235,220,230,245,260]],
      ['2025', '#93c5fd', [210,195,220,235,255,248,270,265,250,262,278,295]],
      ['2026', '#3b82f6', [232,218,240,243,247,null,null,null,null,null,null,null]]
    ]
  };

  const KEYWORDS = [
    ['제주삼다수', 4821], ['비타500', 4203], ['옥수수수염차', 2914], ['헛개차', 2188],
    ['홍삼', 1976], ['썬키스트', 1742], ['광동쌍화탕', 1530], ['우엉차', 1284],
    ['꼬소꼬미', 1097], ['팁코주스', 942]
  ];

  const CRM = [
    ['발송 건수', '184,200건'], ['오픈율', '21.4%'],
    ['클릭률', '4.8%'], ['ROAS', '612%']
  ];
  const CRM_BARS = [
    ['이메일', 72, '#3b82f6'], ['알림톡', 88, '#10b981'], ['SMS', 54, '#f97316'], ['앱푸시', 63, '#8b5cf6']
  ];

  const BRAND_SALES = [
    ['비타500', 58372978, '#3b82f6'], ['제주삼다수', 50019709, '#10b981'],
    ['광동생활건강', 44062402, '#8b5cf6'], ['옥수수수염차', 19425716, '#f97316'],
    ['헛개차', 11429011, '#ec4899'], ['썬키스트', 11076618, '#0ea5e9'],
    ['꼬소꼬미', 8214300, '#f59e0b'], ['팁코', 6531900, '#94a3b8']
  ];

  // 코호트: [가입월, 초기인원, [M0..]]  (재구매율 %)
  const COHORT = [
    ['2025-12', '1,204', [100,42,31,24,19,15]],
    ['2026-01', '1,118', [100,45,33,26,20]],
    ['2026-02', '982', [100,48,35,27]],
    ['2026-03', '1,047', [100,46,34]],
    ['2026-04', '1,165', [100,49]],
    ['2026-05', '1,231', [100]]
  ];

  const COUPON = [
    ['발급 수', '48,920장'], ['사용 수', '21,433장'],
    ['사용률', '43.8%'], ['할인 총액', '38,210,000원']
  ];
  const COUPON_BARS = [
    ['신규가입 쿠폰', 81, '#10b981'], ['생일 쿠폰', 67, '#ec4899'],
    ['장바구니 쿠폰', 52, '#3b82f6'], ['광클럽 전용', 74, '#f97316']
  ];

  const EVENTS = [
    ['5월 가정의 달 기획전', '진행중', 'live'],
    ['삼다수 정기배송 런칭', '진행중', 'live'],
    ['비타500 1+1 타임딜', '예정', 'soon'],
    ['헛개차 여름맞이 프로모션', '예정', 'soon'],
    ['광클럽 신규가입 더블적립', '종료', 'done'],
    ['어린이날 사은품 증정', '종료', 'done']
  ];

  const DAYS = ['월','화','수','목','금','토','일'];
  const HOURS = ['0','3','6','9','12','15','18','21'];
  // 7행(요일) x 8열(시간대) 0~100
  const VISIT_HEAT = [
    [8,5,6,22,48,55,62,40],[7,5,6,24,50,57,60,42],[9,6,7,26,52,58,63,44],
    [8,5,7,25,51,56,61,43],[10,7,8,30,58,64,70,55],[15,9,12,40,66,78,85,72],[14,10,11,38,60,70,80,68]
  ];
  const BUY_HEAT = [
    [3,2,2,12,30,38,55,48],[3,2,2,13,32,40,56,50],[4,2,3,14,33,41,58,52],
    [3,2,3,13,31,39,57,51],[5,3,4,18,40,50,68,62],[8,4,6,24,48,60,82,75],[7,5,5,22,44,55,76,70]
  ];

  const INSIGHTS = [
    '5월 매출은 전월 대비 2% 상승했으나 객단가는 1% 하락 — 신규 가입자 유입(▲8%)이 저단가 첫 구매로 이어진 것이 원인입니다. 광클럽 전용 번들 노출 강화로 신규 객단가 개선을 권장합니다.',
    '재구매율이 66.4%로 높고 코호트상 M1 재구매가 42~49%로 안정적입니다. 가입 후 23일 평균 구매주기에 맞춰 D+20 알림톡 리마인드를 보내면 M1 코호트 5~8%p 추가 전환이 기대됩니다.',
    '토·일 18~21시 방문/구매 집중도가 가장 높습니다. 주말 저녁 한정 타임딜(비타500 1+1)을 해당 슬롯에 배치하면 피크 트래픽을 매출로 전환할 수 있습니다.'
  ];

  /* ---------- 브랜드별 데이터 ---------- */
  const BRANDS = {
    samdasoo: {
      name: '제주삼다수', sales: '50,019,709원',
      kpis: [['매출','50,019,709원','#3b82f6'],['결제건수','3,182건','#10b981'],['재구매율','71.2%','#f97316'],['객단가','15,720원','#ec4899']],
      pattern: [['신규 구매','842건'],['재구매','2,340건'],['재구매 비율','73.5%'],['정기배송','1,108건'],['평균 구매주기','18일'],['리뷰 수','621건']],
      gender: [['여성',54,'#ec4899'],['남성',46,'#3b82f6']],
      grade: [['VIP',38,'#8b5cf6'],['골드',27,'#f59e0b'],['실버',21,'#94a3b8'],['일반',14,'#cbd5e1']],
      age: [['20대',10,'#3b82f6'],['30대',29,'#3b82f6'],['40대',34,'#3b82f6'],['50대',19,'#3b82f6'],['60대+',8,'#3b82f6']],
      daily: [70,62,55,80,88,95,82,64,58,72,80,90,98,85,66,60,73,82,92,100,88,68,63,76,90,96,99,86,72,78,93],
      trend: [['2025','#93c5fd',[38,35,40,43,46,44,48,47,45,46,49,52]],['2026','#3b82f6',[46,43,48,49,50,null,null,null,null,null,null,null]]],
      products: [['삼다수 2L x12','22,140,000','44%'],['삼다수 500ml x20','15,210,000','30%'],['삼다수 정기배송팩','8,420,000','17%'],['삼다수 330ml x40','4,249,709','9%']],
      cohort: [['2026-01','620',[100,52,38,29,22]],['2026-02','548',[100,55,40,30]],['2026-03','602',[100,53,37]],['2026-04','671',[100,56]],['2026-05','712',[100]]],
      review: [['배송 빠름',182],['깨끗한 물맛',164],['정기배송 편함',141],['가성비',118],['묶음포장 굿',97],['용량 만족',83],['재구매 의사',76],['뚜껑 견고',52]]
    },
    vita500: {
      name: '비타500', sales: '58,372,978원',
      kpis: [['매출','58,372,978원','#3b82f6'],['결제건수','3,940건','#10b981'],['재구매율','64.8%','#f97316'],['객단가','14,810원','#ec4899']],
      pattern: [['신규 구매','1,386건'],['재구매','2,554건'],['재구매 비율','64.8%'],['선물 구매','712건'],['평균 구매주기','27일'],['리뷰 수','548건']],
      gender: [['여성',61,'#ec4899'],['남성',39,'#3b82f6']],
      grade: [['VIP',31,'#8b5cf6'],['골드',29,'#f59e0b'],['실버',24,'#94a3b8'],['일반',16,'#cbd5e1']],
      age: [['20대',16,'#3b82f6'],['30대',31,'#3b82f6'],['40대',28,'#3b82f6'],['50대',17,'#3b82f6'],['60대+',8,'#3b82f6']],
      daily: [60,54,50,68,80,90,78,56,52,63,72,86,94,79,60,56,65,77,89,98,83,62,58,70,85,92,100,81,67,73,88],
      trend: [['2025','#93c5fd',[44,41,47,50,53,51,56,55,52,54,58,61]],['2026','#3b82f6',[53,49,55,57,58,null,null,null,null,null,null,null]]],
      products: [['비타500 100ml x100','26,420,000','45%'],['비타500 제로 x60','17,510,000','30%'],['비타500 골드 x30','9,180,000','16%'],['비타500 선물세트','5,262,978','9%']],
      cohort: [['2026-01','710',[100,44,32,25,19]],['2026-02','662',[100,47,34,26]],['2026-03','705',[100,45,33]],['2026-04','738',[100,48]],['2026-05','796',[100]]],
      review: [['새콤달콤',171],['피로회복',158],['가성비 최고',136],['선물용 인기',112],['아이도 잘먹음',94],['배송 만족',81],['제로 만족',69],['재구매',58]]
    },
    okjasu: {
      name: '옥수수수염차', sales: '19,425,716원',
      kpis: [['매출','19,425,716원','#3b82f6'],['결제건수','1,512건','#10b981'],['재구매율','58.3%','#f97316'],['객단가','12,840원','#ec4899']],
      pattern: [['신규 구매','631건'],['재구매','881건'],['재구매 비율','58.3%'],['정기배송','402건'],['평균 구매주기','31일'],['리뷰 수','274건']],
      gender: [['여성',67,'#ec4899'],['남성',33,'#3b82f6']],
      grade: [['VIP',26,'#8b5cf6'],['골드',28,'#f59e0b'],['실버',27,'#94a3b8'],['일반',19,'#cbd5e1']],
      age: [['20대',14,'#3b82f6'],['30대',33,'#3b82f6'],['40대',30,'#3b82f6'],['50대',16,'#3b82f6'],['60대+',7,'#3b82f6']],
      daily: [55,50,46,62,74,84,72,52,48,58,68,80,88,73,56,52,60,72,83,92,78,57,54,66,80,87,95,76,63,69,84],
      trend: [['2025','#93c5fd',[14,12,15,17,18,20,23,24,21,18,16,15]],['2026','#3b82f6',[16,14,17,19,19,null,null,null,null,null,null,null]]],
      products: [['옥수수수염차 1.5L x12','9,210,000','47%'],['옥수수수염차 340ml x20','5,820,000','30%'],['옥수수수염차 티백','2,940,000','15%'],['혼합 곡물차팩','1,455,716','8%']],
      cohort: [['2026-01','280',[100,40,29,22,17]],['2026-02','262',[100,42,30,23]],['2026-03','274',[100,41,28]],['2026-04','291',[100,43]],['2026-05','305',[100]]],
      review: [['깔끔한 맛',144],['붓기 빠짐',128],['카페인 없음',109],['여름 필수',92],['아이 음용',74],['가성비',61],['묶음 좋음',49],['재구매',38]]
    }
  };

  /* ---------- 렌더러 ---------- */
  const fmtWon = n => n.toLocaleString('ko-KR') + '원';

  function renderKpis(c, items) {
    c.innerHTML = items.map(([label, val, accent, d1, d2]) => {
      let badges = '';
      if (d1) badges += '<span class="dash-kpi-delta dash-kpi-delta--' + d1[1] + '">' + d1[0] + '</span>';
      if (d2) badges += '<span class="dash-kpi-delta dash-kpi-delta--' + d2[1] + '">' + d2[0] + '</span>';
      return '<div class="dash-kpi" style="--kpi-accent:' + accent + '">' +
        '<div class="dash-kpi-label">' + label + '</div>' +
        '<div class="dash-kpi-value">' + val + '</div>' +
        '<div class="dash-kpi-deltas">' + badges + '</div></div>';
    }).join('');
  }

  function renderStatGrid(c, items) {
    c.innerHTML = items.map(([l, v]) =>
      '<div class="dash-stat"><span class="dash-stat-label">' + l + '</span><span class="dash-stat-val">' + v + '</span></div>'
    ).join('');
  }

  function renderHBars(c, rows, fmt) {
    const max = Math.max.apply(null, rows.map(r => r[1]));
    c.innerHTML = rows.map(([label, val, color]) => {
      const pct = Math.round(val / max * 100);
      const shown = fmt ? fmt(val) : val + '%';
      return '<div class="dash-hbar-row">' +
        '<span class="dash-hbar-label">' + label + '</span>' +
        '<div class="dash-hbar-track"><div class="dash-hbar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
        '<span class="dash-hbar-val">' + shown + '</span></div>';
    }).join('');
  }

  function renderDonut(c, rows) {
    const R = 52, CIRC = 2 * Math.PI * R;
    let offset = 0;
    const segs = rows.map(([, pct, color]) => {
      const len = CIRC * pct / 100;
      const s = '<circle r="' + R + '" cx="70" cy="70" fill="none" stroke="' + color +
        '" stroke-width="20" stroke-dasharray="' + len + ' ' + (CIRC - len) +
        '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 70 70)"></circle>';
      offset += len;
      return s;
    }).join('');
    const legend = rows.map(([label, pct, color]) =>
      '<div class="dash-legend-row"><span class="dash-legend-dot" style="background:' + color + '"></span>' +
      '<span class="dash-legend-label">' + label + '</span><span class="dash-legend-val">' + pct + '%</span></div>'
    ).join('');
    c.innerHTML = '<svg class="dash-donut" viewBox="0 0 140 140" width="140" height="140" aria-hidden="true">' +
      '<circle r="' + R + '" cx="70" cy="70" fill="none" stroke="#f1f5f9" stroke-width="20"></circle>' +
      segs + '</svg><div class="dash-legend">' + legend + '</div>';
  }

  function renderBars(c, vals, labelEvery, labelFn) {
    const max = Math.max.apply(null, vals);
    c.innerHTML = vals.map((v, i) => {
      const h = Math.round(v / max * 100);
      const lbl = (i % labelEvery === 0) ? '<span class="dash-bar-x">' + labelFn(i) + '</span>' : '<span class="dash-bar-x">&nbsp;</span>';
      return '<div class="dash-bar-col"><div class="dash-bar-pair"><div class="dash-bar" style="height:' + h + '%"></div></div>' + lbl + '</div>';
    }).join('');
  }

  function renderLine(c, cfg) {
    const W = 320, H = 150, PADL = 8, PADR = 8, PADT = 12, PADB = 24;
    const all = [];
    cfg.series.forEach(s => s[2].forEach(v => { if (v != null) all.push(v); }));
    const max = Math.max.apply(null, all), min = Math.min.apply(null, all);
    const n = cfg.months.length;
    const x = i => PADL + (W - PADL - PADR) * i / (n - 1);
    const y = v => PADT + (H - PADT - PADB) * (1 - (v - min) / (max - min || 1));
    const lines = cfg.series.map(([, color, data]) => {
      const pts = data.map((v, i) => v == null ? null : x(i) + ',' + y(v)).filter(Boolean).join(' ');
      return '<polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></polyline>';
    }).join('');
    const xlabels = cfg.months.map((m, i) =>
      (i % 2 === 0) ? '<text x="' + x(i) + '" y="' + (H - 6) + '" class="dash-line-x">' + m + '</text>' : ''
    ).join('');
    const legend = cfg.series.map(([name, color]) =>
      '<span class="dash-legend-inline"><span class="dash-legend-dot" style="background:' + color + '"></span>' + name + '</span>'
    ).join('');
    c.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      lines + xlabels + '</svg><div class="dash-legend-inline-wrap">' + legend + '</div>';
  }

  function renderRank(c, rows) {
    c.innerHTML = rows.map(([kw, cnt], i) =>
      '<li class="dash-rank-row"><span class="dash-rank-no">' + (i + 1) + '</span>' +
      '<span class="dash-rank-kw">' + kw + '</span>' +
      '<span class="dash-rank-cnt">' + cnt.toLocaleString('ko-KR') + '건</span></li>'
    ).join('');
  }

  function renderCohort(c, rows) {
    const maxM = Math.max.apply(null, rows.map(r => r[2].length));
    let head = '<div class="dash-cohort-row dash-cohort-head"><span class="dash-cohort-month">가입월</span><span class="dash-cohort-base">인원</span>';
    for (let m = 0; m < maxM; m++) head += '<span class="dash-cohort-cell">M' + m + '</span>';
    head += '</div>';
    const body = rows.map(([month, base, cells]) => {
      let r = '<div class="dash-cohort-row"><span class="dash-cohort-month">' + month + '</span><span class="dash-cohort-base">' + base + '</span>';
      for (let m = 0; m < maxM; m++) {
        if (cells[m] == null) { r += '<span class="dash-cohort-cell dash-cohort-cell--empty"></span>'; continue; }
        const v = cells[m];
        const alpha = (0.12 + v / 100 * 0.78).toFixed(2);
        const tc = v > 55 ? '#fff' : '#1e3a8a';
        r += '<span class="dash-cohort-cell" style="background:rgba(59,130,246,' + alpha + ');color:' + tc + '">' + v + '%</span>';
      }
      return r + '</div>';
    }).join('');
    c.innerHTML = head + body;
  }

  function renderEvents(c, rows) {
    const map = { live: '진행중', soon: '예정', done: '종료' };
    c.innerHTML = rows.map(([name, , st]) =>
      '<li class="dash-event"><span class="dash-event-name">' + name + '</span>' +
      '<span class="dash-event-status dash-event-status--' + st + '">' + map[st] + '</span></li>'
    ).join('');
  }

  function renderHeat(c, grid) {
    let html = '<div class="dash-heat-grid">';
    html += '<span class="dash-heat-corner"></span>';
    HOURS.forEach(h => { html += '<span class="dash-heat-htop">' + h + '</span>'; });
    grid.forEach((row, i) => {
      html += '<span class="dash-heat-day">' + DAYS[i] + '</span>';
      row.forEach(v => {
        const alpha = (0.08 + v / 100 * 0.82).toFixed(2);
        html += '<span class="dash-heat-cell" style="background:rgba(59,130,246,' + alpha + ')" title="' + v + '"></span>';
      });
    });
    html += '</div>';
    c.innerHTML = html;
  }

  function renderInsights(c, items) {
    c.innerHTML = items.map(t =>
      '<div class="dash-insight"><div class="dash-insight-icon">C</div><div>' +
      '<p class="dash-insight-head">Claude AI 인사이트</p>' +
      '<p class="dash-insight-body">' + t + '</p></div></div>'
    ).join('');
  }

  function renderProducts(tbody, rows) {
    tbody.innerHTML = rows.map(([p, sales, share]) =>
      '<tr><td>' + p + '</td><td>' + sales + '원</td><td><span class="dash-pill dash-pill--g">' + share + '</span></td></tr>'
    ).join('');
  }

  function renderTags(c, rows) {
    const max = Math.max.apply(null, rows.map(r => r[1]));
    c.innerHTML = rows.map(([kw, cnt]) => {
      const scale = (0.85 + cnt / max * 0.5).toFixed(2);
      return '<span class="dash-tag" style="font-size:calc(11px * ' + scale + ')">' + kw + ' <b>' + cnt + '</b></span>';
    }).join('');
  }

  /* ---------- 통합 뷰 렌더 ---------- */
  function renderAll() {
    renderKpis($('kpis'), KPIS);
    renderStatGrid($('pattern'), PATTERN);
    renderDonut($('gender'), GENDER);
    renderHBars($('ageDist'), AGE_DIST);
    renderBars($('daily'), DAILY, 4, i => (i + 1) + '일');
    renderLine($('yearTrend'), YEAR_TREND);
    renderRank($('keywords'), KEYWORDS);
    renderStatGrid($('crm'), CRM);
    renderHBars($('crmBars'), CRM_BARS);
    renderHBars($('brandSales'), BRAND_SALES, fmtWon);
    renderCohort($('cohort'), COHORT);
    renderStatGrid($('coupon'), COUPON);
    renderHBars($('couponBars'), COUPON_BARS);
    renderEvents($('events'), EVENTS);
    renderHeat($('visitHeat'), VISIT_HEAT);
    renderHeat($('buyHeat'), BUY_HEAT);
    renderInsights($('insights'), INSIGHTS);
  }

  /* ---------- 브랜드별 뷰 렌더 ---------- */
  function renderBrand(key) {
    const b = BRANDS[key];
    renderKpis($('bKpis'), b.kpis);
    renderStatGrid($('bPattern'), b.pattern);
    renderDonut($('bGender'), b.gender);
    renderHBars($('bGrade'), b.grade);
    renderHBars($('bAge'), b.age);
    renderBars($('bDaily'), b.daily, 4, i => (i + 1) + '일');
    renderLine($('bTrend'), { months: YEAR_TREND.months, series: b.trend });
    renderProducts($('bProducts'), b.products);
    renderCohort($('bCohort'), b.cohort);
    renderTags($('bReview'), b.review);
    dash.querySelectorAll('[data-brand]').forEach(ch => {
      const on = ch.dataset.brand === key;
      ch.classList.toggle('active', on);
      ch.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function buildChips() {
    const c = $('brandChips');
    c.innerHTML = Object.keys(BRANDS).map((k, i) =>
      '<button type="button" role="tab" class="dash-chip' + (i === 0 ? ' active' : '') +
      '" data-brand="' + k + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '">' + BRANDS[k].name + '</button>'
    ).join('');
    c.querySelectorAll('[data-brand]').forEach(ch => {
      ch.addEventListener('click', () => renderBrand(ch.dataset.brand));
    });
  }

  /* ---------- 탭/뷰 전환 ---------- */
  function showView(view) {
    dash.querySelectorAll('.dash-view').forEach(v => { v.hidden = v.dataset.view !== view; });
  }

  let brandBuilt = false;
  dash.querySelectorAll('.dash-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      dash.querySelectorAll('.dash-tab').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const view = btn.dataset.dashTab;
      if (view === 'brand' && !brandBuilt) {
        buildChips();
        renderBrand(Object.keys(BRANDS)[0]);
        brandBuilt = true;
      }
      showView(view);
    });
  });

  renderAll();
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
