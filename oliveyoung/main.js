(function () {
  'use strict';

  // 모바일 메뉴
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 현재 섹션 표시
  var links = Array.prototype.slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || !map[entry.target.id]) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        map[entry.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // 프로젝트 분류
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var projects = Array.prototype.slice.call(document.querySelectorAll('.proj[data-cat]'));
  var duo = document.querySelector('.duo');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.getAttribute('data-filter');
      tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === tab)); });
      projects.forEach(function (p) {
        p.hidden = !(key === 'all' || p.getAttribute('data-cat').split(' ').indexOf(key) !== -1);
      });
      if (duo) {
        var visible = duo.querySelectorAll('.proj:not([hidden])').length;
        duo.hidden = visible === 0;
        duo.style.gridTemplateColumns = visible === 1 ? '1fr' : '';
      }
    });
  });

  // 프로젝트 번호 링크로 이동할 때 분류 초기화
  document.querySelectorAll('.fit-refs a').forEach(function (a) {
    a.addEventListener('click', function () {
      var all = document.querySelector('.tab[data-filter="all"]');
      if (all && all.getAttribute('aria-pressed') !== 'true') all.click();
    });
  });

  // 이미지 크게 보기
  var dlg = document.getElementById('lb');
  var img = document.getElementById('lb-img');
  var cap = document.getElementById('lb-cap');
  var closeBtn = document.getElementById('lb-close');
  var last = null;
  document.querySelectorAll('.shot button[data-full]').forEach(function (b) {
    b.addEventListener('click', function () {
      var thumb = b.querySelector('img');
      var fc = b.parentElement.querySelector('figcaption');
      img.src = b.getAttribute('data-full');
      img.alt = thumb ? thumb.alt : '';
      cap.textContent = fc ? fc.textContent : '';
      last = b;
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else window.open(b.getAttribute('data-full'), '_blank', 'noopener');
    });
  });
  function close() { if (dlg.open) dlg.close(); }
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener('close', function () { if (last) last.focus(); });
  }

  // 이메일 복사
  var toast = document.getElementById('toast');
  function show(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { show('복사했습니다: ' + text); }, function () { show(text); });
      } else {
        show(text);
      }
    });
  });
})();
