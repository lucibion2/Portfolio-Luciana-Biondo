/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO LUCIANA BIONDO — FUNCIONES Y ANIMACIONES
   En general no hace falta tocar este archivo.
   Lo único editable está marcado con ✏️
   ═══════════════════════════════════════════════════════════════ */

/* ✏️ PALABRAS que rotan en la portada ("Soy ...") */
const PALABRAS = [
  'editora de video',
  'filmmaker',
  'creadora de contenido',
  'comunicadora',
  'redactora SEO'
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ───────── 1. Intro 3·2·1 (una vez por visita) ───────── */
(function intro() {
  const leader = $('#leader');
  const num = $('#leaderNum');
  let seen = false;
  try { seen = sessionStorage.getItem('lb-intro') === '1'; } catch (e) {}

  const finish = () => {
    leader.classList.add('is-done');
    document.body.classList.add('is-ready');
    try { sessionStorage.setItem('lb-intro', '1'); } catch (e) {}
  };

  if (seen || reduceMotion) { finish(); return; }

  let n = 3;
  const tick = setInterval(() => {
    n--;
    if (n > 0) num.textContent = n;
    else { clearInterval(tick); finish(); }
  }, 450);
})();


/* ───────── 2. Código de tiempo del visor (24 cuadros por segundo) ───────── */
(function timecode() {
  const el = $('#heroTC');
  const start = performance.now();
  const pad = (v) => String(v).padStart(2, '0');
  const loop = (now) => {
    const t = (now - start) / 1000;
    const f = Math.floor((t % 1) * 24);
    const s = Math.floor(t) % 60;
    const m = Math.floor(t / 60) % 60;
    const h = Math.floor(t / 3600);
    el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();


/* ───────── 3. Palabras que se escriben y borran ───────── */
(function rotator() {
  const el = $('#rotator');
  if (!el || reduceMotion) return;
  let i = 0, char = PALABRAS[0].length, deleting = true;
  const step = () => {
    const word = PALABRAS[i];
    if (deleting) {
      char--;
      if (char === 0) { deleting = false; i = (i + 1) % PALABRAS.length; }
    } else {
      char++;
      if (char === PALABRAS[i].length) { deleting = true; el.textContent = PALABRAS[i]; return setTimeout(step, 2200); }
    }
    el.textContent = PALABRAS[i].slice(0, char) || ' ';
    setTimeout(step, deleting ? 45 : 85);
  };
  setTimeout(step, 3000);
})();


/* ───────── 4. Menú: fondo al bajar, menú celular, sección activa ───────── */
(function nav() {
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const links = $('#navLinks');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  $$('a', links).forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  const sections = $$('section[id]');
  const navAnchors = $$('a[href^="#"]', links);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navAnchors.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ───────── 5. Barra de progreso superior ───────── */
(function progress() {
  const fill = $('#progressFill');
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    fill.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();


/* ───────── 6. Aparición de elementos al hacer scroll ───────── */
(function reveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));
})();


/* ───────── 7. Contadores de números ───────── */
(function counters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const prefix = el.dataset.prefix || '';
      const dur = 1400;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => io.observe(el));
})();


/* ───────── 8. Ondas de audio (decorativas) ───────── */
function buildWave(container, bars, seed) {
  let html = '';
  for (let i = 0; i < bars; i++) {
    const v = Math.abs(Math.sin(i * 0.55 + seed) * Math.cos(i * 0.21 + seed * 2));
    const h = 18 + v * 82;
    html += `<i style="--h:${h.toFixed(0)}%;--d:${(-i * 0.07).toFixed(2)}s"></i>`;
  }
  container.innerHTML = html;
}
(function waves() {
  const mini = $('#miniWave');
  if (mini) buildWave(mini, 70, 1.3);

  $$('.clip--audio').forEach((clip, idx) => {
    const label = clip.textContent;
    clip.innerHTML = `<span>${label}</span><span class="wave"></span>`;
    buildWave($('.wave', clip), 140, 2.1 + idx);
  });
})();


/* ───────── 9. Efecto 3D y brillo en tarjetas de servicios ───────── */
(function tilt() {
  if (matchMedia('(hover: none)').matches || reduceMotion) return;
  $$('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();


/* ───────── 10. Cursor personalizado ───────── */
(function cursor() {
  const c = $('#cursor');
  if (matchMedia('(hover: none), (pointer: coarse)').matches) return;
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
  const loop = () => {
    cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
    c.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener('mouseover', e => {
    const card = e.target.closest('.video-card:not(.is-missing)');
    const link = e.target.closest('a, button, input, textarea, select, .clip');
    c.classList.toggle('is-play', !!card);
    c.classList.toggle('is-link', !card && !!link);
  });
})();


/* ───────── 11. Videos: filtros, vista previa y ventana ───────── */
(function videos() {
  const tabs = $$('.tab');
  const indicator = $('#tabsIndicator');
  const cards = $$('.video-card');
  const projects = $$('.project');

  // Mueve la "pastilla" celeste detrás del botón activo
  const moveIndicator = () => {
    const active = $('.tab.is-active');
    if (!active) return;
    indicator.style.width = active.offsetWidth + 'px';
    indicator.style.height = active.offsetHeight + 'px';
    indicator.style.top = active.offsetTop + 'px';
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
  };

  const filter = (cat) => {
    let i = 0;
    cards.forEach(card => {
      const show = cat === 'todos' || card.dataset.cat === cat;
      card.classList.toggle('is-hidden', !show);
      card.classList.remove('is-entering');
      if (show) {
        void card.offsetWidth; // reinicia la animación
        card.style.setProperty('--i', i++);
        card.classList.add('is-entering');
      } else {
        $('video', card).pause();
      }
    });
    projects.forEach(p => p.classList.toggle('is-active', p.dataset.project === cat));
  };

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.toggle('is-active', t === tab));
    moveIndicator();
    filter(tab.dataset.filter);
  }));
  window.addEventListener('resize', moveIndicator);
  document.fonts && document.fonts.ready.then(moveIndicator);
  moveIndicator();
  filter($('.tab.is-active').dataset.filter);

  // Detecta videos que faltan y muestra la duración
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  cards.forEach(card => {
    const video = $('video', card);
    const markMissing = () => card.classList.add('is-missing');
    video.addEventListener('error', markMissing);
    if (video.error || video.networkState === 3) markMissing();
    const onMeta = () => {
      card.classList.remove('is-missing');
      if (isFinite(video.duration)) $('.video-card__dur', card).textContent = fmt(video.duration);
    };
    video.addEventListener('loadedmetadata', onMeta);
    if (video.readyState >= 1) onMeta();

    // Vista previa al pasar el mouse (solo computadora)
    card.addEventListener('mouseenter', () => {
      if (card.classList.contains('is-missing') || matchMedia('(hover: none)').matches) return;
      video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => video.pause());

    card.addEventListener('click', () => {
      if (card.classList.contains('is-missing')) return;
      video.pause();
      openLightbox(video.getAttribute('src').split('#')[0], $('h4', card).textContent);
    });
  });

  // Ventana grande con sonido
  const lb = $('#lightbox');
  const lbVideo = $('#lightboxVideo');
  const lbCaption = $('#lightboxCaption');
  function openLightbox(src, title) {
    lbVideo.src = src;
    lbCaption.textContent = title;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbVideo.play().catch(() => {});
  }
  function closeLightbox() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbVideo.pause();
    lbVideo.removeAttribute('src');
    lbVideo.load();
  }
  $('#lightboxClose').addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox(); });
})();


/* ───────── 12. Línea de tiempo de experiencia (cabezal que sigue el scroll) ───────── */
(function careerTimeline() {
  const nle = $('#nle');
  const body = $('#nleBody');
  const tc = $('#nleTC');
  const clips = $$('.clip', nle);
  const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const HOY = 91.7; // octubre 2026 en la escala 0–100

  // Los clips "crecen" cuando aparece la línea de tiempo
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { nle.classList.add('is-in'); obs.disconnect(); } });
  }, { threshold: 0.3 }).observe(nle);

  const update = () => {
    const r = nle.getBoundingClientRect();
    // 0 cuando la línea de tiempo entra por abajo, 1 cuando llega arriba
    const raw = (innerHeight - r.top) / (innerHeight * 0.75 + r.height * 0.4);
    const p = Math.max(0, Math.min(raw, 1)) * (HOY / 100);
    body.style.setProperty('--p', p.toFixed(4));

    const months = Math.min(Math.floor(p * 36), 35);
    tc.textContent = `${MESES[months % 12]} ${2024 + Math.floor(months / 12)}`;

    // En celular la línea de tiempo es más ancha que la pantalla:
    // la desplazamos sola para que el cabezal quede siempre a la vista
    const sc = body.parentElement;
    if (sc.scrollWidth > sc.clientWidth) {
      const laneW = body.offsetWidth - 90;
      sc.scrollLeft = 72 + laneW * p - sc.clientWidth * 0.6;
    }

    const pos = p * 100;
    clips.forEach(c => {
      const s = parseFloat(getComputedStyle(c).getPropertyValue('--start'));
      const en = parseFloat(getComputedStyle(c).getPropertyValue('--end'));
      c.classList.toggle('is-active', pos >= s && pos <= en);
    });
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  // Tocar un clip lleva a su tarjeta
  clips.forEach(clip => clip.addEventListener('click', () => {
    const target = document.getElementById(clip.dataset.target);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.remove('is-flash');
    void target.offsetWidth;
    target.classList.add('is-flash');
    setTimeout(() => target.classList.remove('is-flash'), 1800);
  }));
})();


/* ───────── 13. Botón "Copiar" del email ───────── */
$$('.copy-btn').forEach(btn => btn.addEventListener('click', async () => {
  const original = btn.textContent;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    btn.textContent = '¡Copiado!';
  } catch (e) {
    btn.textContent = 'Copialo a mano';
  }
  setTimeout(() => (btn.textContent = original), 1800);
}));


/* ───────── 14. Formulario de contacto (Formspree) ───────── */
(function contactForm() {
  const form = $('#contactForm');
  const status = $('#formStatus');
  const btn = $('#formBtn');

  const say = (msg, type) => { status.textContent = msg; status.className = 'form__status is-' + type; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (form.action.includes('TU_ID_DE_FORMSPREE')) {
      say('Falta configurar Formspree: reemplazá TU_ID_DE_FORMSPREE en index.html.', 'warn');
      return;
    }

    btn.disabled = true;
    const label = btn.innerHTML;
    btn.textContent = 'Enviando...';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.reset();
        say('¡Mensaje enviado! Te respondo a la brevedad.', 'ok');
      } else {
        say('No se pudo enviar. Probá de nuevo o escribime por WhatsApp.', 'error');
      }
    } catch (err) {
      say('Sin conexión. Probá de nuevo o escribime por WhatsApp.', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = label;
    }
  });
})();


/* ───────── 15. Año actual en el pie de página ───────── */
$('#year').textContent = new Date().getFullYear();
