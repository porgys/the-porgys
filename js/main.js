/* ============================================================
   THE PORGYS — MAIN JS
   GSAP + ScrollTrigger · Lenis Smooth Scroll · Premium Animations
============================================================ */

/* ── REGISTER GSAP PLUGINS ─────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── LENIS SMOOTH SCROLL ────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
  smoothTouch: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    gsap.set(follower, { x: followerX, y: followerY });
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverEls = document.querySelectorAll('a, button, .service-card, .phone-card, .stat-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { width: 16, height: 16, duration: 0.25 });
      gsap.to(follower, { width: 60, height: 60, opacity: 0.6, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { width: 8, height: 8, duration: 0.25 });
      gsap.to(follower, { width: 36, height: 36, opacity: 1, duration: 0.3 });
    });
  });
})();

/* ── PAGE ENTRANCE ANIMATION ────────────────────────────────── */
(function pageEntrance() {
  const overlay = document.getElementById('page-transition');
  gsap.to(overlay, {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 1.2,
    ease: 'expo.inOut',
    delay: 0.1,
    onComplete: () => { overlay.style.display = 'none'; }
  });
})();

/* ── SPLIT TEXT UTILITY ─────────────────────────────────────── */
function splitTextToChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  [...text].forEach(char => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    el.appendChild(span);
  });
  return el.querySelectorAll('.char');
}

/* ── HERO ANIMATIONS ────────────────────────────────────────── */
(function initHero() {
  // Split headline lines
  const headlineLines = document.querySelectorAll('.hero__headline .headline-line');
  const allChars = [];

  headlineLines.forEach(line => {
    const chars = splitTextToChars(line);
    allChars.push(...chars);
  });

  const tl = gsap.timeline({ delay: 0.9 });

  // Logo entrance
  tl.from('#hero-logo', {
    scale: 0.6,
    opacity: 0,
    duration: 1.0,
    ease: 'back.out(1.5)',
  });

  // Eyebrow
  tl.to('#hero-eyebrow', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.4');

  // Headline chars stagger
  tl.from(allChars, {
    y: '110%',
    opacity: 0,
    duration: 0.8,
    ease: 'power4.out',
    stagger: 0.018,
  }, '-=0.3');

  // Sub + CTA
  tl.to(['#hero-sub', '#hero-cta'], {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.15,
  }, '-=0.3');

  // Scroll indicator
  tl.to('#hero-scroll', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.2');

  // Hero video parallax on scroll
  gsap.to('.hero__video', {
    scale: 1.15,
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // Hero content fades out on scroll
  gsap.to('.hero__content', {
    yPercent: -20,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'center top',
      end: 'bottom top',
      scrub: 1,
    }
  });
})();

/* ── NAV SCROLL BEHAVIOR ────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      if (self.progress > 0) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -80, duration: 1.6 });
      }
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
      }
    });
  });

  // Hamburger
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
})();

/* ── ABOUT SECTION ──────────────────────────────────────────── */
(function initAbout() {
  // Split headline chars
  document.querySelectorAll('.about__headline .split-line').forEach(line => {
    splitTextToChars(line);
  });

  // Left column reveal
  gsap.to('.about__left', {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about__container',
      start: 'top 75%',
    }
  });

  // Headline chars
  gsap.from('.about__headline .char', {
    y: '110%',
    opacity: 0,
    duration: 0.7,
    ease: 'power4.out',
    stagger: 0.02,
    scrollTrigger: {
      trigger: '.about__headline',
      start: 'top 80%',
    }
  });

  // Stat cards stagger
  gsap.to('.stat-card', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: '.about__right',
      start: 'top 75%',
    }
  });

  // Right column right-side reveal
  gsap.from('.about__accent-card', {
    x: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about__right',
      start: 'top 70%',
    }
  });

  // Animated counters
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseInt(counter.dataset.target);
    let startVal = { val: 0 };

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 80%',
      onEnter: () => {
        // Add bar animation class
        counter.closest('.stat-card').classList.add('animated');

        gsap.to(startVal, {
          val: target,
          duration: 2.0,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = Math.round(startVal.val);
          }
        });
      },
      once: true
    });
  });

  // Capability badge cards (About section) — bar reveal on scroll
  document.querySelectorAll('.stat-card__badge-title').forEach(badge => {
    ScrollTrigger.create({
      trigger: badge,
      start: 'top 80%',
      onEnter: () => badge.closest('.stat-card').classList.add('animated'),
      once: true
    });
  });

  // Background text parallax
  gsap.to('.about__bg-text', {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    }
  });
})();

/* ── SHOWCASE SECTION ───────────────────────────────────────── */
(function initShowcase() {
  // Split showcase headline
  document.querySelectorAll('.showcase__headline .split-line').forEach(line => {
    splitTextToChars(line);
  });

  // Header reveal
  gsap.to('.showcase__header', {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.showcase',
      start: 'top 70%',
    }
  });

  gsap.from('.showcase__headline .char', {
    y: '110%',
    opacity: 0,
    duration: 0.7,
    ease: 'power4.out',
    stagger: 0.02,
    scrollTrigger: {
      trigger: '.showcase__headline',
      start: 'top 80%',
    }
  });

  // Phone cards stagger entrance
  const cards = document.querySelectorAll('.phone-card');
  const cardOffsets = [40, 0, 40]; // left floats up from lower, center from position, right from lower

  cards.forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: cardOffsets[i] > 0 ? 0 : 0,
      translateY: 0,
      duration: 1.1,
      ease: 'power4.out',
      delay: i * 0.12,
      scrollTrigger: {
        trigger: '.showcase__cards',
        start: 'top 75%',
      }
    });
  });

  // Parallax: cards move opposite to background on scroll
  gsap.to('.showcase__bg-layer', {
    backgroundPositionX: '+=200px',
    ease: 'none',
    scrollTrigger: {
      trigger: '.showcase',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    }
  });

  // Cards counter-move
  gsap.to('.showcase__cards', {
    y: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.showcase',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // Ken Burns animations start staggered
  document.querySelectorAll('.media-kenburns').forEach((el, i) => {
    el.style.animationDelay = `${i * 1.5}s`;
    el.style.animationDuration = `${10 + i * 2}s`;
  });
})();

/* ── SERVICES SECTION ───────────────────────────────────────── */
(function initServices() {
  // Split services headline
  document.querySelectorAll('.services__headline .split-line').forEach(line => {
    splitTextToChars(line);
  });

  gsap.to('.services__header', {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.services',
      start: 'top 70%',
    }
  });

  gsap.from('.services__headline .char', {
    y: '110%',
    opacity: 0,
    duration: 0.7,
    ease: 'power4.out',
    stagger: 0.018,
    scrollTrigger: {
      trigger: '.services__headline',
      start: 'top 80%',
    }
  });

  // Service cards clip-path reveal
  gsap.to('.service-card', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.services__grid',
      start: 'top 75%',
    }
  });
})();

/* ── CONTACT SECTION ────────────────────────────────────────── */
(function initContact() {
  // Split contact headline
  document.querySelectorAll('.contact__headline .split-line').forEach(line => {
    splitTextToChars(line);
  });

  gsap.to('.contact__left', {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact__container',
      start: 'top 70%',
    }
  });

  gsap.from('.contact__headline .char', {
    y: '110%',
    opacity: 0,
    duration: 0.7,
    ease: 'power4.out',
    stagger: 0.02,
    scrollTrigger: {
      trigger: '.contact__headline',
      start: 'top 80%',
    }
  });

  gsap.to('.contact__right', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    delay: 0.2,
    scrollTrigger: {
      trigger: '.contact__container',
      start: 'top 70%',
    }
  });

  // Form submission
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<span>Message Sent ✓</span>';
      btn.style.background = '#00D4FF';
      btn.style.color = '#080808';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.pointerEvents = '';
        form.reset();
      }, 3500);
    });
  }
})();

/* ── PARALLAX BG ORB ────────────────────────────────────────── */
(function initParallaxOrbs() {
  gsap.to('.services__bg-orb', {
    yPercent: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.services',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    }
  });

  gsap.to('.contact__orb', {
    yPercent: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.contact',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    }
  });
})();

/* ── PERFORMANCE: PAUSE VIDEO WHEN OFF SCREEN ───────────────── */
(function initVideoObserver() {
  const videos = document.querySelectorAll('#hero-video, .case-card__video');
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.1 });

  videos.forEach(v => observer.observe(v));
})();

/* ── SECTION LABEL REVEAL ───────────────────────────────────── */
gsap.from('.section-label', {
  opacity: 0,
  x: -20,
  duration: 0.8,
  ease: 'power3.out',
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.section-label',
    start: 'top 85%',
    toggleActions: 'play none none none',
  }
});

/* ── MOBILE MENU ANIMATION ──────────────────────────────────── */
(function initMobileMenuAnimation() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const links = mobileMenu.querySelectorAll('.mobile-menu__link');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      gsap.to(links, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
      });
    } else {
      gsap.fromTo(links,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
      );
    }
  });
})();

/* ── SMOOTH REFRESH ──────────────────────────────────────────── */
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});
