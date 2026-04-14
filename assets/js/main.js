/*
  Emberton Estate Shared UI Script
  --------------------------------
  Responsibilities:
  1) Inject reusable navbar/footer blocks into every page.
  2) Apply navbar scroll behaviour:
     - Homepage: transparent at top, solid on scroll.
     - Inner pages: always solid.
  3) Ensure smooth scroll for on-page anchor links.
  4) Close mobile menu when a nav link is selected.
*/

(function () {
  'use strict';

  const NAV_LINKS = [
    { label: 'Home', href: 'index.html', page: 'home' },
    { label: 'Facilities', href: 'facilities.html', page: 'facilities' },
    { label: 'Purchase', href: 'purchase.html', page: 'purchase' },
    { label: 'Downloads', href: 'downloads.html', page: 'downloads' }
  ];

  function buildNavbar(activePage) {
    const links = NAV_LINKS.map(
      (link) =>
        `<li class="nav-item"><a class="nav-link ${activePage === link.page ? 'active' : ''}" href="${link.href}">${link.label}</a></li>`
    ).join('');

    return `
      <header class="site-navbar fixed-top" id="siteNavbar">
        <nav class="navbar navbar-expand-lg" aria-label="Primary">
          <div class="container">
            <a class="brand-logo d-inline-flex align-items-center gap-2" href="index.html" aria-label="Emberton Estate home">
              <img src="assets/images/shared/logo.png" alt="Emberton Estate logo" width="36" height="36">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNavbar">
              <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                ${links}
                <li class="nav-item ms-lg-2">
                  <a class="site-visit-btn" href="#" aria-label="Book a site visit">Book a Site Visit</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    `;
  }

  function buildFooter() {
    return `
      <footer class="site-footer" aria-label="Site footer">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-4">
              <div class="d-flex align-items-center gap-2 mb-2">
                <img src="assets/images/shared/logo.png" alt="Emberton Estate logo" width="32" height="32">
                <h5 class="mb-0">Emberton Estate</h5>
              </div>
              <p class="mb-0">Established, lived-in, community-first estate living in Hillcrest.</p>
            </div>
            <div class="col-sm-6 col-lg-2">
              <h6 class="mb-2">Quick Links</h6>
              <nav class="footer-links" aria-label="Footer navigation">
                <a href="index.html">Home</a><br>
                <a href="facilities.html">Facilities</a><br>
                <a href="purchase.html">Purchase</a><br>
                <a href="downloads.html">Downloads</a>
              </nav>
            </div>
            <div class="col-sm-6 col-lg-3">
              <h6 class="mb-2">Contact</h6>
              <p class="mb-1"><a href="tel:+27833427702">083 342 7702</a></p>
              <p class="mb-1"><a href="mailto:info@emberton.co.za">info@emberton.co.za</a></p>
              <p class="mb-0">90 Ashley Drive, Hillcrest</p>
            </div>
            <div class="col-lg-3">
              <h6 class="mb-2">Follow</h6>
              <div class="footer-social" aria-label="Social links">
                <a href="https://www.facebook.com/embertonestate" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>
                <a href="https://www.instagram.com/embertonestate" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
              </div>
            </div>
          </div>
          <div class="footer-disclaimer">
            <p class="mb-1">While every effort will be made to ensure accuracy, all information is subject to change without notice.</p>
            <p class="mb-0">&copy; 2025 Emberton Estate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }

  function setNavbarBehavior() {
    const navbar = document.getElementById('siteNavbar');
    if (!navbar) return;

    const isHomePage = document.body.dataset.page === 'home';

    function applyState() {
      if (isHomePage && window.scrollY < 20) {
        navbar.classList.add('navbar-home-top');
        navbar.classList.remove('navbar-solid');
      } else {
        navbar.classList.remove('navbar-home-top');
        navbar.classList.add('navbar-solid');
      }
    }

    applyState();
    window.addEventListener('scroll', applyState, { passive: true });
  }

  function enableSmoothAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function setupMobileMenuClose() {
    const collapseEl = document.getElementById('mainNavbar');
    if (!collapseEl || !window.bootstrap) return;

    const bsCollapse = new window.bootstrap.Collapse(collapseEl, { toggle: false });
    const menuLinks = collapseEl.querySelectorAll('.nav-link, .site-visit-btn');

    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992 && collapseEl.classList.contains('show')) {
          bsCollapse.hide();
        }
      });
    });
  }

  function initSharedLayout() {
    const navMount = document.getElementById('site-navbar-mount');
    const footerMount = document.getElementById('site-footer-mount');
    const activePage = document.body.dataset.page || '';

    if (navMount) navMount.innerHTML = buildNavbar(activePage);
    if (footerMount) footerMount.innerHTML = buildFooter();
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-animate], .image-reveal, .feature-row');
    if (!revealElements.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealElements.forEach((el, idx) => {
      if (el.classList.contains('feature-row')) {
        el.style.transitionDelay = `${Math.min(idx * 60, 420)}ms`;
      }
      observer.observe(el);
    });
  }

  function initHeroParallax() {
    const heroImage = document.querySelector('.hero-bg-image');
    if (!heroImage) return;

    window.addEventListener(
      'scroll',
      () => {
        const offset = window.scrollY * 0.18;
        heroImage.style.transform = `translateY(${offset}px) scale(1.04)`;
      },
      { passive: true }
    );
  }

  function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSharedLayout();
    setNavbarBehavior();
    enableSmoothAnchorScroll();
    setupMobileMenuClose();
    initScrollReveal();
    initHeroParallax();
    initScrollProgress();
  });
})();
