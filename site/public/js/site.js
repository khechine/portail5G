(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- header scroll ---------- */
    var header = $('#header');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 10);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ---------- mobile menu ---------- */
    var burger = $('#burger');
    var nav = $('#nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        nav.classList.toggle('is-open');
      });
      $$('.header__link', nav).forEach(function (l) {
        l.addEventListener('click', function () { nav.classList.remove('is-open'); });
      });
    }

    /* ---------- hero slider ---------- */
    var hero = $('.hero');
    if (hero) {
      var hslides = $$('.hero__slide', hero);
      var hdots = $$('.hero__dot-btn', hero);
      var hIdx = 0;
      var go = function (i) {
        hIdx = (i + hslides.length) % hslides.length;
        hslides.forEach(function (s, k) {
          s.classList.toggle('is-active', k === hIdx);
          if (k !== hIdx) s.setAttribute('aria-hidden', 'true');
          else s.removeAttribute('aria-hidden');
        });
        hdots.forEach(function (d, k) { d.classList.toggle('is-active', k === hIdx); });
      };
      $$('.hero__nav--prev', hero).forEach(function (b) {
        b.addEventListener('click', function () { go(hIdx - 1); });
      });
      $$('.hero__nav--next', hero).forEach(function (b) {
        b.addEventListener('click', function () { go(hIdx + 1); });
      });
      hdots.forEach(function (d) {
        d.addEventListener('click', function () { go(Number(d.dataset.slide)); });
      });
      if (hslides.length > 1) {
        setInterval(function () { go(hIdx + 1); }, 6000);
      }
    }

    /* ---------- plans tabs ---------- */
    var tabs = $$('.tabs__btn');
    if (tabs.length) {
      tabs.forEach(function (t) {
        t.addEventListener('click', function () {
          tabs.forEach(function (x) { x.classList.remove('is-active'); });
          t.classList.add('is-active');
          $$('.plans__pane').forEach(function (p) {
            p.classList.toggle('is-active', p.dataset.pane === t.dataset.tab);
          });
        });
      });
    }

    /* ---------- testimonials slider ---------- */
    var slider = $('[data-slider]');
    if (slider) {
      var slides = $$('.tslider__slide', slider);
      var dots = $$('.tslider__dot', slider);
      var tIdx = 0;
      var goT = function (i) {
        tIdx = (i + slides.length) % slides.length;
        slides.forEach(function (s, k) { s.classList.toggle('is-active', k === tIdx); });
        dots.forEach(function (d, k) { d.classList.toggle('is-active', k === tIdx); });
      };
      var prev = $('.tslider__nav.is-prev', slider);
      var next = $('.tslider__nav.is-next', slider);
      if (prev) prev.addEventListener('click', function () { goT(tIdx - 1); });
      if (next) next.addEventListener('click', function () { goT(tIdx + 1); });
      dots.forEach(function (d) {
        d.addEventListener('click', function () { goT(Number(d.dataset.slide)); });
      });
    }

    /* ---------- faq accordion ---------- */
    $$('.faq__q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.parentElement;
        var open = item.classList.contains('is-open');
        $$('.faq__item').forEach(function (i) {
          i.classList.remove('is-open');
          var b = $('.faq__q', i);
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('is-open');
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });

    /* ---------- forms ---------- */
    function post(url, data) {
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); });
    }

    var orderForm = $('#order-form');
    if (orderForm) {
      var orderMsg = $('#order-msg');
      orderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = $('button[type="submit"]', orderForm);
        var data = {};
        $$('input,select', orderForm).forEach(function (el) {
          if (el.type === 'radio') {
            if (el.checked) data[el.name] = el.value;
          } else if (el.name) {
            data[el.name] = el.value;
          }
        });
        if (!data.firstname || !data.phone || !data.governorate || !data.plan) {
          orderMsg.textContent = orderMsg.dataset.required || 'Merci de remplir tous les champs obligatoires.';
          orderMsg.className = 'order__msg is-err';
          return;
        }
        if (btn) btn.disabled = true;
        post(window.SITE.orderEndpoint, data).then(function (r) {
          if (r.ok) {
            orderMsg.textContent = orderMsg.dataset.success || 'Demande envoyée ! Un conseiller vous contactera rapidement.';
            orderMsg.className = 'order__msg is-ok';
            orderForm.reset();
          } else {
            orderMsg.textContent = orderMsg.dataset.error || 'Une erreur est survenue, veuillez réessayer.';
            orderMsg.className = 'order__msg is-err';
          }
        }).catch(function () {
          orderMsg.textContent = orderMsg.dataset.error || 'Une erreur est survenue, veuillez réessayer.';
          orderMsg.className = 'order__msg is-err';
        }).finally(function () { if (btn) btn.disabled = false; });
      });
    }

    var nlForm = $('#newsletter-form');
    if (nlForm) {
      var nlMsg = $('#newsletter-msg');
      nlForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = $('input[name="email"]', nlForm).value.trim();
        var locale = $('input[name="locale"]', nlForm).value;
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          nlMsg.textContent = nlMsg.dataset.email || 'Veuillez saisir un email valide.';
          nlMsg.className = 'newsletter__msg is-err';
          return;
        }
        post(window.SITE.newsletterEndpoint, { email: email, locale: locale }).then(function (r) {
          if (r.ok) {
            nlMsg.textContent = nlMsg.dataset.success || 'Merci pour votre inscription !';
            nlMsg.className = 'newsletter__msg is-ok';
            nlForm.reset();
          } else {
            nlMsg.textContent = nlMsg.dataset.error || 'Une erreur est survenue, veuillez réessayer.';
            nlMsg.className = 'newsletter__msg is-err';
          }
        }).catch(function () {
          nlMsg.textContent = nlMsg.dataset.error || 'Une erreur est survenue, veuillez réessayer.';
          nlMsg.className = 'newsletter__msg is-err';
        });
      });
    }
  });
})();
