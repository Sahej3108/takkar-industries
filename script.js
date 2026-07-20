document.addEventListener('DOMContentLoaded', function () {

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- sticky header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var applyScrollState = function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 6px 20px rgba(13,32,56,0.10)' : 'none';
    };
    applyScrollState();
    window.addEventListener('scroll', applyScrollState, { passive: true });
  }

  /* ============================================================
     HERO SLIDER
     ============================================================ */
  (function heroSlider() {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dot');
    if (!slides.length) return;

    var current = 0;
    var timer;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current] && dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current] && dots[current].classList.add('is-active');
    }

    function next() { goTo(current + 1); }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.dataset.goto, 10));
        startAuto();
      });
    });

    startAuto();
  })();

  /* ============================================================
     ANIMATED STAT COUNTERS
     ============================================================ */
  (function counters() {
    var statEls = document.querySelectorAll('.stat[data-count]');
    if (!statEls.length || !('IntersectionObserver' in window)) return;

    function animate(el) {
      var target = parseInt(el.dataset.count, 10);
      var suffix = el.dataset.suffix || '';
      var numEl = el.querySelector('.stat-num');
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        numEl.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statEls.forEach(function (el) { observer.observe(el); });
  })();

  /* ============================================================
     PRODUCT TABS
     ============================================================ */
  (function tabs() {
    var buttons = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.tab-panel');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
        panels.forEach(function (p) { p.classList.remove('is-active'); });

        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        var target = document.getElementById('tab-' + btn.dataset.tab);
        if (target) target.classList.add('is-active');
      });
    });
  })();

  /* ============================================================
     LIGHTBOX GALLERY
     ============================================================ */
  (function lightbox() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.lightbox-item'));
    var modal = document.getElementById('lightboxModal');
    var stage = document.getElementById('lightboxStage');
    var caption = document.getElementById('lightboxCaption');
    var closeBtn = document.getElementById('lightboxClose');
    var prevBtn = document.getElementById('lightboxPrev');
    var nextBtn = document.getElementById('lightboxNext');
    if (!items.length || !modal) return;

    var index = 0;

    function open(i) {
      index = i;
      var el = items[index];
      var bg = el.style.backgroundImage;
      stage.style.backgroundImage = bg;
      caption.textContent = el.dataset.caption || '';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function step(dir) {
      open((index + dir + items.length) % items.length);
    }

    items.forEach(function (el, i) {
      el.addEventListener('click', function () { open(i); });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  })();

  /* ============================================================
     REVEAL ON SCROLL
     ============================================================ */
  (function reveal() {
    var targets = document.querySelectorAll('.range-card, .industry-card, .capability-card, .contact-card');
    if (!targets.length || !('IntersectionObserver' in window)) return;

    targets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .55s ease, transform .55s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) { observer.observe(el); });
  })();

  /* ============================================================
     BACK TO TOP VISIBILITY
     ============================================================ */
  (function backToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    var toggle = function () {
      btn.style.opacity = window.scrollY > 500 ? '1' : '.5';
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  })();

  /* ============================================================
     CONTACT FORM (front-end only demo submit)
     ============================================================ */
  (function contactForm() {
    var form = document.getElementById('contactForm');
    var note = document.getElementById('formNote');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.textContent = 'Thank you. Your enquiry has been noted, our team will get back to you shortly.';
      form.reset();
    });
  })();

});