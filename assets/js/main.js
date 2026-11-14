(function () {
  var masthead = document.querySelector('.masthead');
  function onScroll() { masthead.classList.toggle('is-scrolled', window.scrollY > 4); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('site-nav');
  function closeNav() {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  var followWrap = document.querySelector('.author__urls-wrapper');
  var followBtn = followWrap ? followWrap.querySelector('button') : null;
  function closeFollow() {
    if (!followWrap) return;
    followWrap.classList.remove('is-open');
    followBtn.setAttribute('aria-expanded', 'false');
  }
  if (followBtn) {
    followBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = followWrap.classList.toggle('is-open');
      followBtn.setAttribute('aria-expanded', String(open));
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.greedy-nav')) closeNav();
    if (!e.target.closest('.author__urls-wrapper')) closeFollow();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeNav(); closeFollow(); }
  });

  var pubButtons = Array.prototype.slice.call(document.querySelectorAll('.pub-button'));
  var pubViews = Array.prototype.slice.call(document.querySelectorAll('.publication-view'));
  pubButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pubButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      pubViews.forEach(function (v) { v.hidden = v.id !== btn.dataset.view; });
    });
  });

  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var spyMap = {};
  spyLinks.forEach(function (a) {
    var sec = document.getElementById(a.getAttribute('href').slice(1));
    if (sec) spyMap[sec.id] = a;
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.remove('is-active'); });
        var link = spyMap[en.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(spyMap).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }
})();