/* Tutorial com holofote: escurece a tela e deixa aceso só o lugar da próxima ação. O aluno faz a ação sozinho. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  let alvo = null;
  let laco = null;

  function posicionar() {
    if (!alvo || !document.body.contains(alvo)) { esconder(); return; }
    const r = alvo.getBoundingClientRect();
    const furo = u.$('#holofote .furo');
    const pad = 6;
    furo.style.left = r.left - pad + 'px';
    furo.style.top = r.top - pad + 'px';
    furo.style.width = r.width + pad * 2 + 'px';
    furo.style.height = r.height + pad * 2 + 'px';
    const b = u.$('#bolha-tutorial');
    const bw = b.offsetWidth;
    const bh = b.offsetHeight;
    let x, y;
    if (r.right + 18 + bw < innerWidth) { x = r.right + 18; y = r.top; }
    else if (r.left - 18 - bw > 0) { x = r.left - 18 - bw; y = r.top; }
    else if (r.bottom + 14 + bh < innerHeight) { x = r.left; y = r.bottom + 14; }
    else { x = r.left; y = r.top - bh - 14; }
    b.style.left = Math.max(10, Math.min(x, innerWidth - bw - 10)) + 'px';
    b.style.top = Math.max(10, Math.min(y, innerHeight - bh - 10)) + 'px';
    laco = requestAnimationFrame(posicionar);
  }

  function esconder() {
    cancelAnimationFrame(laco);
    alvo = null;
    u.$('#holofote').hidden = true;
    u.$('#bolha-tutorial').hidden = true;
  }

  SIM.tutorial = {
    mostrar(el, titulo, texto) {
      if (!el) { esconder(); return; }
      if (alvo === el && !u.$('#holofote').hidden) return;
      cancelAnimationFrame(laco);
      alvo = el;
      const b = u.$('#bolha-tutorial');
      b.innerHTML = '<div class="bolha-titulo">' + u.esc(titulo || 'Tutorial') + '</div><p>' + u.md(texto) + '</p>' +
        '<div class="bolha-rodape"><span>Faça a ação no lugar aceso.</span><button type="button" class="botao discreto pequeno" id="btn-pular-tutorial">Pular tutorial</button></div>';
      b.hidden = false;
      u.$('#holofote').hidden = false;
      u.$('#btn-pular-tutorial').addEventListener('click', () => {
        SIM.S.config.tutorial = false;
        esconder();
        u.toast('Tutorial desligado. O **Faça agora** continua mostrando cada passo.');
      });
      posicionar();
    },
    esconder,
    ativo: () => !!alvo,
  };
})();
