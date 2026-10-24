/* Utilidades gerais usadas por todos os módulos. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const u = (SIM.u = {});

  u.$ = (s, r) => (r || document).querySelector(s);
  u.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  u.esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Texto simples com `código` e **negrito**.
  u.md = (s) =>
    u.esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  u.icone = (id, cls) => '<svg class="' + (cls || 'icone') + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
  u.clonar = (o) => JSON.parse(JSON.stringify(o));
  u.nomeArquivo = (p) => p.split('/').pop();
  u.pastaDe = (p) => (p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '');
  u.ehIdent = (c) => /[A-Za-z0-9_$]/.test(c || '');

  u.guardar = (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ }
  };
  u.lerGuardado = (k) => {
    try { const t = localStorage.getItem(k); return t ? JSON.parse(t) : null; } catch (e) { return null; }
  };
  u.apagarGuardado = (k) => {
    try { localStorage.removeItem(k); } catch (e) { /* ignora */ }
  };

  let toastTimer = null;
  u.toast = (msg, tipo, ms) => {
    const t = u.$('#toast');
    if (!t) return;
    t.innerHTML = u.md(msg);
    t.className = tipo || '';
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, ms || 3600);
  };

  u.tremer = (el) => {
    if (!el) return;
    el.classList.remove('tremor');
    void el.offsetWidth;
    el.classList.add('tremor');
  };

  // Confete simples em canvas (comemoração de missão).
  u.confete = () => {
    const cv = u.$('#confete');
    if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cv.hidden = false;
    cv.width = innerWidth;
    cv.height = innerHeight;
    const ctx = cv.getContext('2d');
    const cores = ['#ffb38a', '#9ad1ff', '#73c991', '#e5c07b', '#ffffff'];
    const ps = Array.from({ length: 160 }, () => ({
      x: Math.random() * cv.width,
      y: -20 - Math.random() * cv.height * 0.4,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3.5,
      r: 3 + Math.random() * 4,
      a: Math.random() * Math.PI,
      va: (Math.random() - 0.5) * 0.25,
      c: cores[(Math.random() * cores.length) | 0],
    }));
    let quadros = 0;
    (function passo() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      });
      if (++quadros < 200) requestAnimationFrame(passo);
      else { ctx.clearRect(0, 0, cv.width, cv.height); cv.hidden = true; }
    })();
  };

  // Rolagem suave para manter um elemento visível dentro de um contêiner.
  // Rola o contêiner até o elemento aparecer. Para elementos estreitos (como o cursor),
  // também rola na horizontal, como o VS Code faz em linhas compridas.
  u.mostrarDentro = (el, cont, margemEsq) => {
    if (!el || !cont) return;
    const r = el.getBoundingClientRect();
    const c = cont.getBoundingClientRect();
    if (r.top < c.top + 30 || r.bottom > c.bottom - 30) {
      cont.scrollTop += r.top - c.top - c.height * 0.35;
    }
    if (r.width < c.width / 3) {
      const esq = c.left + (margemEsq || 0) + 12;
      if (r.right > c.right - 30) cont.scrollLeft += r.right - c.right + c.width * 0.25;
      else if (r.left < esq && cont.scrollLeft > 0) cont.scrollLeft = Math.max(0, cont.scrollLeft - (esq - r.left) - c.width * 0.25);
    }
  };
})();
