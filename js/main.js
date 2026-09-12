/* ============================================
   Verhuisbedrijf Op Maat - Main JS
   Lightweight | No dependencies
   ============================================ */

(function() {
  'use strict';

  // --- Mobile Menu ---
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  // Move nav outside header on mobile so it escapes the backdrop-filter stacking context
  var navParent = nav ? nav.parentNode : null;
  var navNextSibling = nav ? nav.nextElementSibling : null;
  function handleNavPlacement() {
    if (!nav) return;
    if (window.innerWidth < 992) {
      if (nav.parentNode !== document.body) {
        document.body.appendChild(nav);
      }
    } else {
      if (nav.parentNode === document.body && navParent) {
        navParent.insertBefore(nav, navNextSibling);
      }
    }
  }
  handleNavPlacement();
  window.addEventListener('resize', handleNavPlacement);

  if (hamburger && nav) {
    function toggleMenu() {
      var isOpen = !nav.classList.contains('active');
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Menu openen');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Close on any nav link click (including dropdown menu items)
    nav.querySelectorAll('.nav__link:not(.nav__dropdown-toggle), .nav__dropdown-menu a').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // --- Dropdown Toggle (Mobile) ---
  var allDropdowns = document.querySelectorAll('.nav__dropdown');

  document.querySelectorAll('.nav__dropdown-toggle').forEach(function(toggle) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');

    toggle.addEventListener('click', function(e) {
      if (window.innerWidth < 992) {
        e.preventDefault();
        var dropdown = this.closest('.nav__dropdown');
        var wasOpen = dropdown.classList.contains('open');

        // Close all other dropdowns first
        allDropdowns.forEach(function(dd) {
          dd.classList.remove('open');
          var t = dd.querySelector('.nav__dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });

        // Toggle this one
        if (!wasOpen) {
          dropdown.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
        }
      }
    });
  });


  // --- Header scroll state ---
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }, { passive: true });
  }

  // --- Form handling ---
  document.querySelectorAll('.quote-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Verzenden...';
      btn.disabled = true;

      // Collect form data
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function(value, key) {
        data[key] = value;
      });

      data['access_key'] = 'e1f203b5-5f89-47e5-9ab8-4241594af17d';
      data['subject'] = 'Nieuwe offerteaanvraag via verhuisbedrijfopmaat.nl';
      data['from_name'] = 'Verhuisbedrijf Op Maat';
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(response) {
        return response.json().then(function(json) {
          if (response.ok && json.success) {
            form.style.display = 'none';
            var success = form.nextElementSibling;
            if (success && success.classList.contains('form-success')) {
              success.classList.add('show');
            }
          } else {
            btn.textContent = originalText;
            btn.disabled = false;
            alert('Fout: ' + (json.message || 'Onbekende fout'));
          }
        });
      })
      .catch(function(err) {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Verbindingsfout: ' + err.message);
      });
    });
  });

  // --- Contact form handling ---
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Verzenden...';
      btn.disabled = true;

      // Collect form data
      var formData = new FormData(contactForm);
      var data = {};
      formData.forEach(function(value, key) {
        data[key] = value;
      });

      data['access_key'] = 'e1f203b5-5f89-47e5-9ab8-4241594af17d';
      data['subject'] = 'Nieuwe offerteaanvraag via verhuisbedrijfopmaat.nl';
      data['from_name'] = 'Verhuisbedrijf Op Maat';
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(response) {
        return response.json().then(function(json) {
          if (response.ok && json.success) {
            contactForm.style.display = 'none';
            var success = contactForm.nextElementSibling;
            if (success && success.classList.contains('form-success')) {
              success.classList.add('show');
            }
          } else {
            btn.textContent = originalText;
            btn.disabled = false;
            alert('Fout: ' + (json.message || 'Onbekende fout'));
          }
        });
      })
      .catch(function(err) {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Verbindingsfout: ' + err.message);
      });
    });
  }

  // --- M3 Calculator ---
  var calcItems = document.querySelectorAll('.calc-item input[type="number"]');
  var calcTotal = document.querySelector('.calc-total__value');

  if (calcItems.length && calcTotal) {
    function updateTotal() {
      var total = 0;
      calcItems.forEach(function(input) {
        var m3 = parseFloat(input.dataset.m3) || 0;
        var qty = parseInt(input.value) || 0;
        total += m3 * qty;
      });
      calcTotal.textContent = total.toFixed(1) + ' m\u00B3';
    }

    calcItems.forEach(function(input) {
      input.addEventListener('input', updateTotal);
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      var target;
      try { target = document.querySelector(href); } catch(err) { return; }
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 70;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset - 10;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- Lazy load images ---
  if ('IntersectionObserver' in window) {
    var imgObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imgObserver.observe(img);
    });
  }

  // --- Animate on scroll ---
  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(function(el) {
      fadeObserver.observe(el);
    });
  }

  // --- Cookie Consent ---
  var cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner) {
    var consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setTimeout(function() {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    var acceptBtn = cookieBanner.querySelector('.cookie-btn--accept');
    var necessaryBtn = cookieBanner.querySelector('.cookie-btn--necessary');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookie_consent', 'all');
        cookieBanner.classList.remove('show');
        // Load Google Analytics after consent
        loadAnalytics();
      });
    }

    if (necessaryBtn) {
      necessaryBtn.addEventListener('click', function() {
        localStorage.setItem('cookie_consent', 'necessary');
        cookieBanner.classList.remove('show');
      });
    }
  }

  function loadAnalytics() {
    var script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-76W73EDN9T';
    script.async = true;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-76W73EDN9T', { anonymize_ip: true });
  }

  // Auto-load analytics if previously consented
  if (localStorage.getItem('cookie_consent') === 'all') {
    loadAnalytics();
  }
})();

/* --- Fade-in animation styles moved to css/style.css for CLS prevention --- */

/* --- Service Worker Registration --- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js');
  });
}
