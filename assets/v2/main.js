(function () {
  'use strict';

  // 모바일 메뉴
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 현재 섹션 표시
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if ('IntersectionObserver' in window && navAnchors.length) {
    var byId = {};
    navAnchors.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var a = byId[entry.target.id];
        if (!a) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(function (x) { x.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // 프로젝트 분류 필터
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var projects = Array.prototype.slice.call(document.querySelectorAll('.project[data-cat]'));
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      projects.forEach(function (p) {
        var cats = p.getAttribute('data-cat').split(' ');
        p.hidden = !(key === 'all' || cats.indexOf(key) !== -1);
      });
    });
  });

  // 이미지 확대
  var dialog = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbClose = document.getElementById('lb-close');
  var lastTrigger = null;
  document.querySelectorAll('.shot button[data-full]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      var cap = btn.parentElement.querySelector('figcaption');
      lbImg.src = btn.getAttribute('data-full');
      lbImg.alt = img ? img.alt : '';
      lbCap.textContent = cap ? cap.textContent : '';
      lastTrigger = btn;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        window.open(btn.getAttribute('data-full'), '_blank', 'noopener');
      }
    });
  });
  function closeLightbox() { if (dialog.open) dialog.close(); }
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (dialog) {
    dialog.addEventListener('click', function (e) { if (e.target === dialog) closeLightbox(); });
    dialog.addEventListener('close', function () { if (lastTrigger) lastTrigger.focus(); });
  }

  // 복사
  var toast = document.getElementById('toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { showToast('복사했습니다: ' + text); }, function () { showToast(text); });
      } else {
        showToast(text);
      }
    });
  });
})();
