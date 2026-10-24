/* Progresso: o simulador salva sozinho no navegador a cada passo. Além disso, gera um código curto
   (ex.: K7M2-9QXA) que o aluno anota para continuar em outro computador ou em outro navegador. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const E = SIM.estado;
  // Base 32 sem I, L, O e U, para ninguém confundir letra com número na hora de digitar.
  const ALFABETO = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const VERSAO = 1;

  function crc8(bytes) {
    let c = 0;
    bytes.forEach((b) => {
      c ^= b;
      for (let i = 0; i < 8; i++) c = c & 0x80 ? ((c << 1) ^ 0x07) & 0xff : (c << 1) & 0xff;
    });
    return c;
  }

  // 32 bits de dados: versão (3), missão (3), passo (7), cartões (12), modo das dicas (1),
  // dicas restantes (3), tutorial (1), texto maior (1), som (1). Mais 8 bits de conferência.
  function codificar(dados) {
    const qs = SIM.perguntas || [];
    let cart = 0;
    qs.forEach((q, k) => { if (dados.cartoes.includes(q.id)) cart |= 1 << k; });
    const c = dados.config;
    const restantes = c.dicas === 'ilimitado' ? 7 : Math.max(0, Math.min(6, c.dicasRestantes | 0));
    const campos = [
      [VERSAO, 3], [dados.missao, 3], [dados.passo, 7], [cart, 12],
      [c.dicas === 'ilimitado' ? 1 : 0, 1], [restantes, 3], [c.tutorial ? 1 : 0, 1], [c.fonte === 'projetor' ? 1 : 0, 1], [c.som ? 1 : 0, 1],
    ];
    let v = 0;
    campos.forEach(([x, n]) => { v = v * 2 ** n + (x & (2 ** n - 1)); });
    const bytes = [Math.floor(v / 2 ** 24) & 0xff, Math.floor(v / 2 ** 16) & 0xff, Math.floor(v / 2 ** 8) & 0xff, v & 0xff];
    let total = v * 256 + crc8(bytes);
    let txt = '';
    for (let i = 0; i < 8; i++) { txt = ALFABETO[total % 32] + txt; total = Math.floor(total / 32); }
    return txt.slice(0, 4) + '-' + txt.slice(4);
  }

  function decodificar(entrada) {
    const limpo = String(entrada || '').toUpperCase().replace(/[\s\-_.]/g, '').replace(/[IL]/g, '1').replace(/O/g, '0');
    if (limpo.length !== 8) return null;
    let total = 0;
    for (const ch of limpo) {
      const k = ALFABETO.indexOf(ch);
      if (k < 0) return null;
      total = total * 32 + k;
    }
    const check = total % 256;
    let v = Math.floor(total / 256);
    const bytes = [Math.floor(v / 2 ** 24) & 0xff, Math.floor(v / 2 ** 16) & 0xff, Math.floor(v / 2 ** 8) & 0xff, v & 0xff];
    if (crc8(bytes) !== check) return null;
    const tam = [3, 3, 7, 12, 1, 3, 1, 1, 1];
    const val = [];
    for (let i = tam.length - 1; i >= 0; i--) { val[i] = v % 2 ** tam[i]; v = Math.floor(v / 2 ** tam[i]); }
    const [versao, missao, passo, cart, ilimitado, restantes, tutorial, projetor, som] = val;
    if (versao !== VERSAO || missao >= SIM.missoes.length || passo >= SIM.missoes[missao].passos.length) return null;
    const qs = SIM.perguntas || [];
    return {
      missao,
      passo,
      cartoes: qs.filter((q, k) => cart & (1 << k)).map((q) => q.id),
      config: { dicas: ilimitado ? 'ilimitado' : 'limitado', dicasRestantes: ilimitado ? 6 : Math.min(6, restantes), tutorial: !!tutorial, fonte: projetor ? 'projetor' : 'normal', som: !!som },
    };
  }

  function codigoAtual(alvo) {
    const S = SIM.S;
    return codificar({ missao: alvo ? alvo.missao : S.missao, passo: alvo ? alvo.passo : S.passo, cartoes: S.cartoes, config: S.config });
  }

  // Monta o projeto exatamente como ele estaria no começo daquele passo.
  function restaurar(d) {
    SIM.celular.limparTimers();
    E.criar(d.config);
    const S = SIM.S;
    for (let mi = 0; mi <= d.missao; mi++) {
      SIM.missoes[mi].passos.forEach((p, pi) => {
        if (p.tut && (mi < d.missao || pi < d.passo)) { const k = p.tutChave || p.t; if (!S.tutVistos.includes(k)) S.tutVistos.push(k); }
      });
    }
    if (d.missao > 0) SIM.fluxo.adiantarAte(d.missao);
    S.missao = d.missao;
    const passos = SIM.missoes[d.missao].passos;
    for (let pi = 0; pi < d.passo; pi++) { S.passo = pi; SIM.fluxo.aplicarInstantaneo(passos[pi]); }
    S.passo = d.passo;
    S.cartoes = Array.from(new Set(d.cartoes.concat(S.cartoes)));
    S.digitando = null;
    S.tabPendente = null;
    S.selecaoTotal = false;
    S.cel.experimento = null;
    S.cel.alerta = null;
    S.cel.modo = 'android';
    SIM.editor.ui.espiar = null;
    SIM.editor.ui.resumo = null;
    E.persistir();
  }

  function caixaCodigo(codigo) {
    return '<div class="codigo-progresso"><span class="codigo-txt" id="codigo-txt">' + u.esc(codigo) + '</span>' +
      '<button type="button" class="botao pequeno" id="btn-copiar-codigo">' + u.icone('i-cartoes') + 'Copiar</button></div>';
  }
  function ligarCopiar(caixa, codigo) {
    const b = caixa.querySelector('#btn-copiar-codigo');
    if (!b) return;
    b.addEventListener('click', () => {
      const falhou = () => {
        const t = caixa.querySelector('#codigo-txt');
        const r = document.createRange();
        r.selectNodeContents(t);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        u.toast('Não deu para copiar sozinho: o código ficou selecionado. Aperte **Ctrl+C**.');
      };
      try { navigator.clipboard.writeText(codigo).then(() => u.toast('Código copiado.', 'ok'), falhou); } catch (e) { falhou(); }
    });
  }

  // Botão "Salvar" do topo.
  function salvar() {
    const S = SIM.S;
    E.persistir();
    SIM.sons.tocar('acerto');
    const codigo = codigoAtual();
    const m = SIM.missoes[S.missao];
    const caixa = SIM.fluxo.modal(
      '<h2>' + u.icone('i-salvar') + 'Progresso salvo</h2>' +
      '<p>O simulador também salva sozinho a cada passo, neste navegador: é só abrir de novo e clicar em <strong>Continuar de onde parei</strong>. Para continuar em outro computador, anote este código:</p>' +
      caixaCodigo(codigo) +
      '<p class="nota-codigo">Missão ' + (S.missao + 1) + ', passo ' + (S.passo + 1) + ' de ' + m.passos.length + '. Na tela inicial, clique em <strong>Tenho um código</strong> e digite o código.</p>' +
      '<div class="modal-acoes"><button type="button" class="botao primario" data-ok data-foco>OK</button></div>',
      { cls: 'progresso-modal' }
    );
    caixa.querySelector('[data-ok]').addEventListener('click', SIM.fluxo.fecharModal);
    ligarCopiar(caixa, codigo);
  }

  // Tela inicial: "Tenho um código".
  function pedirCodigo(aoRestaurar) {
    const caixa = SIM.fluxo.modal(
      '<h2>' + u.icone('i-chave') + 'Continuar com um código</h2>' +
      '<p>Digite o código de progresso que o simulador mostrou quando você salvou ou terminou uma missão.</p>' +
      '<input type="text" class="campo-codigo" id="campo-codigo" maxlength="12" placeholder="XXXX-XXXX" autocomplete="off" spellcheck="false" aria-label="Código de progresso">' +
      '<p class="erro-codigo" id="erro-codigo" hidden></p>' +
      '<div class="modal-acoes"><button type="button" class="botao discreto" data-ok>Cancelar</button><button type="button" class="botao primario" id="btn-usar-codigo">' + u.icone('i-play') + 'Continuar</button></div>',
      { cls: 'progresso-modal' }
    );
    const campo = caixa.querySelector('#campo-codigo');
    const erro = caixa.querySelector('#erro-codigo');
    setTimeout(() => campo.focus(), 40);
    caixa.querySelector('[data-ok]').addEventListener('click', SIM.fluxo.fecharModal);
    const usar = () => {
      const d = decodificar(campo.value);
      if (!d) {
        erro.hidden = false;
        erro.textContent = 'Esse código não confere. Confira as letras e os números e tente de novo.';
        SIM.sons.tocar('erro');
        u.tremer(campo);
        return;
      }
      SIM.fluxo.fecharModal();
      restaurar(d);
      aoRestaurar(d);
    };
    caixa.querySelector('#btn-usar-codigo').addEventListener('click', usar);
    campo.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); usar(); } });
    campo.addEventListener('input', () => { erro.hidden = true; });
  }

  SIM.progresso = { codificar, decodificar, codigoAtual, restaurar, salvar, pedirCodigo, caixaCodigo, ligarCopiar };
})();
