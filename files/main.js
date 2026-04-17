document.addEventListener('DOMContentLoaded', () => {

  /* ===== 1. Dark Mode ===== */
  const toggle = document.querySelector('.theme-toggle');
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ===== 2. Scroll Reveal (逐层渐入) ===== */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => obs.observe(el));
  }

  /* ===== 3. Header Shadow ===== */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ===== 4. Mobile Nav ===== */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  /* ===== 5. Category Filter ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.post-card[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.classList.remove('visible');
          requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
        }
      });
    });
  });

  /* ===== 6. Active Nav ===== */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('/').pop() === page) link.classList.add('active');
  });

  /* ===== 7. Syntax Highlighting ===== */
  document.querySelectorAll('pre code').forEach(block => {
    let h = block.innerHTML;
    const kws = ['public','private','protected','static','void','class','string','int','bool',
      'new','return','if','else','try','catch','var','const','let','function','this','true',
      'false','null','using','namespace','partial','override','async','await','for','foreach',
      'while','in','SELECT','FROM','WHERE','CREATE','INDEX','ON','INSERT','UPDATE','DELETE',
      'AND','OR','NOT','ORDER','BY','GROUP','EXPLAIN'];
    kws.forEach(k => { h = h.replace(new RegExp('\\b('+k+')\\b','g'), '<span class="token-keyword">$1</span>'); });
    h = h.replace(/(".*?")/g, '<span class="token-string">$1</span>');
    h = h.replace(/(\/\/.*?)(\n|$)/g, '<span class="token-comment">$1</span>$2');
    h = h.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');
    block.innerHTML = h;
  });

});
