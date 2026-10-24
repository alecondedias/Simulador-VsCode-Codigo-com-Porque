/* Início do simulador: tela de preparo, botões do topo e ligação entre os módulos. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const E = SIM.estado;
  const F = SIM.fluxo;

  const escolhas = { dicas: 'limitado', tutorial: 'sim', fonte: 'normal', som: 'sim' };

  function montarPreparo() {
    const salvo = E.carregar();
    u.$('#lista-missoes').innerHTML = SIM.missoes.map((m, k) =>
      '<li class="missao-item' + (salvo && salvo.concluidas && salvo.concluidas.includes(k) ? ' feita' : '') + '"><span class="missao-num">' + (k + 1) + '</span><span class="missao-txt"><strong>' + u.esc(m.titulo) + '</strong><span>' + u.esc(m.resumo) + '</span></span><span></span></li>').join('');
    u.$('#op-missao').innerHTML = SIM.missoes.map((m, k) => '<option value="' + k + '">Missão ' + (k + 1) + ': ' + u.esc(m.titulo) + '</option>').join('');
    ['dicas', 'tutorial', 'fonte', 'som'].forEach((nome) => {
      const grupo = u.$('#op-' + nome);
      grupo.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-valor]');
        if (!b) return;
        escolhas[nome] = b.dataset.valor;
        grupo.querySelectorAll('button').forEach((x) => x.setAttribute('aria-checked', x === b));
      });
    });
    if (salvo) {
      const btn = u.$('#btn-continuar');
      btn.hidden = false;
      const m = SIM.missoes[salvo.missao];
      btn.querySelector('span').textContent = 'Continuar: Missão ' + (salvo.missao + 1) + (m ? ', passo ' + (salvo.passo + 1) : '');
      btn.addEventListener('click', () => {
        SIM.sons.destravar();
        SIM.S = salvo;
        abrirSimulador();
        F.continuar();
      });
    }
    u.$('#btn-comecar').addEventListener('click', comecar);
    u.$('#btn-codigo').addEventListener('click', () => {
      SIM.sons.destravar();
      SIM.progresso.pedirCodigo(() => { abrirSimulador(); F.continuar(); u.toast('Progresso recuperado. Siga o **Faça agora**.', 'ok'); });
    });
  }

  function comecar() {
    SIM.sons.destravar();
    const k = Number(u.$('#op-missao').value) || 0;
    E.criar({
      dicas: escolhas.dicas,
      dicasRestantes: 6,
      tutorial: escolhas.tutorial === 'sim',
      fonte: escolhas.fonte,
      som: escolhas.som === 'sim',
    });
    if (k > 0) F.adiantarAte(k);
    abrirSimulador();
    F.iniciarMissao(k);
  }

  function abrirSimulador() {
    u.$('#tela-preparo').hidden = true;
    u.$('#tela-relatorio').hidden = true;
    u.$('#tela-sim').hidden = false;
  }

  function menuMissoes() {
    const S = SIM.S;
    const caixa = F.modal('<h2>' + u.icone('i-lista') + 'Missões</h2>' +
      '<ol class="missoes-lista">' + SIM.missoes.map((m, k) =>
        '<li class="missao-item' + (S.concluidas.includes(k) ? ' feita' : '') + '"><span class="missao-num">' + (k + 1) + '</span><span class="missao-txt"><strong>' + u.esc(m.titulo) + '</strong><span>' + (k === S.missao ? 'Você está aqui' : S.concluidas.includes(k) ? 'Concluída' : 'Ainda não feita') + '</span></span>' +
        '<button type="button" class="botao pequeno" data-ir="' + k + '">' + (k === S.missao ? 'Recomeçar' : 'Ir') + '</button></li>').join('') + '</ol>' +
      '<p style="color:var(--texto-3);font-size:0.9em;margin-top:12px">Ir para uma missão recomeça o projeto e conclui automaticamente as missões anteriores.</p>' +
      '<div class="modal-acoes"><button type="button" class="botao discreto" id="btn-tela-inicial">Voltar à tela inicial</button><button type="button" class="botao primario" data-ok data-foco>Fechar</button></div>', { cls: 'larga' });
    caixa.querySelector('[data-ok]').addEventListener('click', F.fecharModal);
    caixa.querySelector('#btn-tela-inicial').addEventListener('click', () => { E.persistir(); location.reload(); });
    caixa.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => {
      const k = Number(b.dataset.ir);
      const cfg = Object.assign({}, S.config);
      const cartoes = S.cartoes.slice();
      F.fecharModal();
      SIM.celular.limparTimers();
      E.criar(cfg);
      SIM.S.cartoes = cartoes;
      SIM.S.tutVistos = ['digitar', 'tab', 'salvar', 'bloco', 'quickfix', 'abrir', 'pasta', 'arquivo', 'ler', 'limpar', 'ctrlclique', 'ese', 'comando', 'terminal-foco', 'celular'];
      if (k > 0) F.adiantarAte(k);
      SIM.editor.ui.espiar = null;
      SIM.editor.ui.resumo = null;
      F.iniciarMissao(k);
    }));
  }

  function iniciar() {
    SIM.explorador.iniciar();
    SIM.editor.iniciar();
    SIM.terminal.iniciar();
    SIM.celular.iniciar();
    SIM.lado.iniciar();
    SIM.lab.iniciar();
    F.iniciar();
    u.$('#btn-voltar').addEventListener('click', () => F.voltarEtapa());
    u.$('#btn-mapa').addEventListener('click', () => SIM.relatorio.mapa());
    u.$('#btn-cartoes').addEventListener('click', () => SIM.relatorio.cartoes());
    u.$('#btn-menu').addEventListener('click', menuMissoes);
    u.$('#btn-salvar').addEventListener('click', () => SIM.progresso.salvar());
    u.$('#btn-som').addEventListener('click', () => {
      const S = SIM.S;
      S.config.som = !S.config.som;
      u.$('#btn-som').setAttribute('aria-pressed', S.config.som);
      u.$('#btn-som use').setAttribute('href', S.config.som ? '#i-som' : '#i-mudo');
      if (S.config.som) SIM.sons.tocar('clique');
    });
    // Avisos que só fazem sentido quando o simulador foi aberto como arquivo, sem internet.
    if (location.protocol !== 'file:') u.$$('.so-offline').forEach((e) => { e.hidden = true; });
    montarPreparo();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
