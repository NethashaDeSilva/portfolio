/* ══════════════════════════════════════════════
   NETHASHA DE SILVA — PORTFOLIO  |  script.js  v5
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. DARK / LIGHT MODE TOGGLE */
  const modeBtn  = document.getElementById('modeBtn');
  const modeIcon = document.getElementById('modeIcon');
  const body     = document.body;

  if (localStorage.getItem('nds-dark') === '1') {
    body.setAttribute('data-dark', '');
    if (modeIcon) modeIcon.textContent = '☀️';
  }
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      const isDark = body.hasAttribute('data-dark');
      if (isDark) {
        body.removeAttribute('data-dark');
        if (modeIcon) modeIcon.textContent = '🌙';
        localStorage.setItem('nds-dark', '0');
      } else {
        body.setAttribute('data-dark', '');
        if (modeIcon) modeIcon.textContent = '☀️';
        localStorage.setItem('nds-dark', '1');
      }
    });
  }

  /* 2. NAVBAR SCROLL + ACTIVE LINK */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-a');
  const sections = document.querySelectorAll('section[id], div[id]');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 130) current = sec.id; });
    navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
  }, { passive: true });

  /* 3. MOBILE HAMBURGER */
  const burger   = document.getElementById('burger');
  const navPanel = document.getElementById('navLinks');
  if (burger && navPanel) {
    burger.addEventListener('click', () => {
      const open = navPanel.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navPanel.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navPanel.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* 4. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = (navbar ? navbar.offsetHeight : 70) + 10;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* 5. SCROLL REVEAL */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObs.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* 6. STAGGERED CHILD ENTRANCE */
  const staggerMap = [
    { wrap: '.services-grid',   child: '.svc-card'      },
    { wrap: '.testi-grid',      child: '.testi-card'    },
    { wrap: '.contact-details', child: '.contact-item'  },
    { wrap: '.about-stats',     child: '.stat'          },
    { wrap: '.certs-grid',      child: '.cert-card'     },
    { wrap: '.cert-tab-list',   child: '.cert-tab-card' },
    { wrap: '.about-info-grid', child: '.info-pill'     },
  ];
  staggerMap.forEach(({ wrap, child }) => {
    document.querySelectorAll(wrap).forEach(container => {
      const kids = container.querySelectorAll(child);
      kids.forEach(k => { k.style.opacity = '0'; k.style.transform = 'translateY(18px)'; k.style.transition = 'opacity .5s ease, transform .5s ease'; });
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            kids.forEach((k, i) => { setTimeout(() => { k.style.opacity = '1'; k.style.transform = 'none'; }, i * 85); });
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.06 });
      obs.observe(container);
    });
  });

  /* 7. SKILL BAR ANIMATION */
  function animateBars(group) {
    group.querySelectorAll('.sb-fill').forEach(bar => { setTimeout(() => { bar.style.width = (bar.dataset.w || 0) + '%'; }, 120); });
  }
  const openGroup = document.querySelector('.skill-group.open');
  if (openGroup) {
    const bObs = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { animateBars(openGroup); bObs.disconnect(); } }, { threshold: 0.3 });
    bObs.observe(openGroup);
  }

  /* 8. SKILL ACCORDION */
  window.toggleSkill = function(hd) {
    const group  = hd.closest('.skill-group');
    const isOpen = group.classList.contains('open');
    document.querySelectorAll('.skill-group').forEach(g => {
      g.classList.remove('open');
      const gb = g.querySelector('.skill-group-body'), chev = g.querySelector('.sg-chevron');
      if (gb) gb.style.display = 'none';
      if (chev) chev.textContent = '▼';
      g.querySelectorAll('.sb-fill').forEach(b => { b.style.width = '0'; });
    });
    if (!isOpen) {
      group.classList.add('open');
      const gb = group.querySelector('.skill-group-body'), chev = group.querySelector('.sg-chevron');
      if (gb) gb.style.display = 'block';
      if (chev) chev.textContent = '▲';
      setTimeout(() => animateBars(group), 60);
    }
  };

  /* 9. QUALIFICATION TABS */
  window.switchQTab = function(panelId, btn) {
    document.querySelectorAll('.qual-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.qtab').forEach(b => b.classList.remove('active'));
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
    btn.classList.add('active');
  };

  /* 10. COUNT-UP ANIMATION */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = parseInt(el.dataset.to, 10);
      if (isNaN(target)) return;
      let curr = 0;
      const step = Math.ceil(target / 30);
      const ticker = setInterval(() => { curr = Math.min(curr + step, target); el.textContent = curr; if (curr >= target) clearInterval(ticker); }, 45);
      countObs.unobserve(el);
    });
  }, { threshold: 0.7 });
  document.querySelectorAll('.count').forEach(el => countObs.observe(el));

  /* 11. HERO TYPING — 3 roles only */
  const typingEl = document.getElementById('typingRole');
  if (typingEl) {
    const roles = ['UI/UX Designer', 'Frontend Developer', 'UX Engineer'];
    let ri = 0, ci = 0, deleting = false;
    const typeLoop = () => {
      const str = roles[ri];
      if (!deleting) {
        typingEl.textContent = str.slice(0, ci + 1); ci++;
        if (ci === str.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
        setTimeout(typeLoop, 85);
      } else {
        typingEl.textContent = str.slice(0, ci - 1); ci--;
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
        setTimeout(typeLoop, 45);
      }
    };
    setTimeout(typeLoop, 1000);
  }

  /* 12. PARALLAX BLOBS */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const b1 = document.querySelector('.b1'), b2 = document.querySelector('.b2');
    if (b1) b1.style.transform = `translateY(${y * 0.08}px)`;
    if (b2) b2.style.transform = `translateY(${-y * 0.05}px)`;
  }, { passive: true });

  /* ──────────────────────────────────────────
     13. PORTFOLIO SLIDER
     ─ Prev/Next buttons scroll one card at a time
     ─ Dot indicators generated from card count
     ─ Touch/swipe supported
     ─ Arrow keys work when slider is focused
  ────────────────────────────────────────── */
  const track    = document.getElementById('sliderTrack');
  const prevBtn  = document.getElementById('sliderPrev');
  const nextBtn  = document.getElementById('sliderNext');
  const dotsWrap = document.getElementById('sliderDots');

  if (track) {
    const cards = Array.from(track.querySelectorAll('.slide-card'));
    const gap   = 22; // matches CSS gap

    // Build dot buttons
    if (dotsWrap && cards.length) {
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Project ${i + 1}`);
        dot.addEventListener('click', () => {
          track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
        });
        dotsWrap.appendChild(dot);
      });
    }

    // Update dots on scroll
    function updateDots() {
      if (!dotsWrap) return;
      const dots  = dotsWrap.querySelectorAll('.slider-dot');
      const scrollX = track.scrollLeft;
      let closest = 0, minD = Infinity;
      cards.forEach((card, i) => {
        const d = Math.abs(card.offsetLeft - track.offsetLeft - scrollX);
        if (d < minD) { minD = d; closest = i; }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === closest));
    }
    track.addEventListener('scroll', updateDots, { passive: true });

    // Scroll by one card
    function cardWidth() { return (cards[0]?.offsetWidth || 300) + gap; }
    if (prevBtn) prevBtn.addEventListener('click', () => { track.scrollBy({ left: -cardWidth(), behavior: 'smooth' }); });
    if (nextBtn) nextBtn.addEventListener('click', () => { track.scrollBy({ left:  cardWidth(), behavior: 'smooth' }); });

    // Touch swipe
    let touchX = 0;
    track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) track.scrollBy({ left: diff > 0 ? cardWidth() : -cardWidth(), behavior: 'smooth' });
    }, { passive: true });

    // Keyboard arrow keys when section is visible
    document.addEventListener('keydown', e => {
      const section = document.getElementById('portfolio');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowRight') track.scrollBy({ left:  cardWidth(), behavior: 'smooth' });
        if (e.key === 'ArrowLeft')  track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
      }
    });
  }

  /* 14. SERVICE CARD CURSOR GLOW */
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.background = `radial-gradient(circle at ${e.clientX-r.left}px ${e.clientY-r.top}px, rgba(108,71,255,.07), var(--surface) 60%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });

  /* 15. CONTACT FORM — apostrophe fixed with backtick */
  window.sendMsg = function(e) {
  e.preventDefault();

  const name = document.getElementById('cName').value;
  const email = document.getElementById('cEmail').value;
  const message = document.getElementById('cMsg').value;

  emailjs.init("vdp4OrKnVgtZ7Hybj");

  emailjs.send("service_1klqta9", "template_abtufjj", {
    from_name: name,
    from_email: email,
    message: message
  }).then(() => {
    alert("✅ Message sent successfully!");
  }, (error) => {
    alert("❌ Failed to send message");
    console.log(error);
  });
};

});