/* Mapa do projeto, gaveta de cartões de conceito e o resultado final com o código completo. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const E = SIM.estado;

  const NOS = [
    { p: 'src/app/_layout.tsx', x: 14, y: 14, papel: 'Navegação em pilha (Stack)' },
    { p: 'src/app/index.tsx', x: 14, y: 50, papel: 'Rota inicial: a ponte' },
    { p: 'src/screens/HomeScreen.tsx', x: 14, y: 86, papel: 'A tela principal' },
    { p: 'src/components/TaskInput.tsx', x: 50, y: 86, papel: 'Campo de nova tarefa' },
    { p: 'src/styles/styles.ts', x: 86, y: 86, papel: 'Design system' },
    { p: 'src/components/TaskList.tsx', x: 50, y: 50, papel: 'A lista de tarefas' },
    { p: 'src/components/TaskItem.tsx', x: 50, y: 14, papel: 'Uma tarefa' },
    { p: 'src/context/TaskContext.tsx', x: 86, y: 32, papel: 'Memória compartilhada' },
  ];
  const ARESTAS = [
    ['src/app/_layout.tsx', 'src/app/index.tsx', true],
    ['src/app/index.tsx', 'src/screens/HomeScreen.tsx'],
    ['src/screens/HomeScreen.tsx', 'src/components/TaskInput.tsx'],
    ['src/components/TaskInput.tsx', 'src/styles/styles.ts'],
    ['src/components/TaskList.tsx', 'src/components/TaskItem.tsx'],
    ['src/components/TaskList.tsx', 'src/context/TaskContext.tsx'],
    ['src/components/TaskItem.tsx', 'src/context/TaskContext.tsx'],
    ['src/components/TaskList.tsx', 'src/styles/styles.ts'],
    ['src/components/TaskItem.tsx', 'src/styles/styles.ts'],
  ];

  function aceso(p) {
    if (!E.existe(p)) return false;
    const a = E.arq(p);
    return a.versao === 'final' && E.visiveis(p).some((l) => l.t.trim());
  }

  function htmlMapa() {
    const pos = {};
    NOS.forEach((n) => { pos[n.p] = n; });
    const linhas = ARESTAS.map(([a, b, tracejada]) => {
      const A = pos[a], B = pos[b];
      const on = aceso(a) && aceso(b);
      return '<line x1="' + A.x * 7.6 + '" y1="' + A.y * 4.3 + '" x2="' + B.x * 7.6 + '" y2="' + B.y * 4.3 + '" stroke="' + (on ? '#9ad1ff' : '#3a3f49') + '" stroke-width="' + (on ? 2.5 : 1.5) + '"' + (tracejada ? ' stroke-dasharray="6 5"' : '') + '/>';
    }).join('');
    return '<div class="mapa-grade"><svg viewBox="0 0 760 430" aria-hidden="true">' + linhas + '</svg>' +
      NOS.map((n) => '<button type="button" class="mapa-no' + (aceso(n.p) ? ' aceso' : '') + '" data-abrir="' + n.p + '" style="left:' + n.x + '%;top:' + n.y + '%"><strong>' + u.esc(u.nomeArquivo(n.p)) + '</strong>' + u.esc(n.papel) + '</button>').join('') +
      '</div><p class="mapa-legenda">Cada linha liga dois arquivos em que um importa o outro. A linha tracejada mostra que o _layout.tsx abre a rota do index.tsx. Os arquivos acendem quando você escreve o código deles.</p>';
  }

  function mapa() {
    const caixa = SIM.fluxo.modal('<h2>' + u.icone('i-mapa') + 'Mapa do projeto</h2>' + htmlMapa() + '<div class="modal-acoes"><button type="button" class="botao primario" data-ok data-foco>Fechar</button></div>', { cls: 'larga' });
    caixa.querySelector('[data-ok]').addEventListener('click', SIM.fluxo.fecharModal);
    caixa.querySelectorAll('[data-abrir]').forEach((b) => b.addEventListener('click', () => {
      const p = b.dataset.abrir;
      if (!E.existe(p)) { u.toast('Esse arquivo ainda não foi criado.'); return; }
      SIM.fluxo.fecharModal();
      SIM.editor.abrir(p);
    }));
  }

  function cartoes() {
    const S = SIM.S;
    const qs = SIM.perguntas || [];
    const caixa = SIM.fluxo.modal('<h2>' + u.icone('i-cartoes') + 'Cartões de conceito (' + S.cartoes.length + ' de ' + qs.length + ')</h2>' +
      '<p style="color:var(--texto-2)">Você ganha um cartão a cada Pausa do porquê respondida.</p><div class="cartoes-grade">' +
      qs.map((q) => S.cartoes.includes(q.id)
        ? '<div class="cartao-mini"><strong>' + u.esc(q.cartao.titulo) + '</strong><p>' + u.md(q.cartao.texto) + '</p></div>'
        : '<div class="cartao-mini bloqueado"><strong>Missão ' + q.missao + '</strong><p>Responda a Pausa do porquê desta missão para liberar.</p></div>').join('') +
      '</div><div class="modal-acoes"><button type="button" class="botao primario" data-ok data-foco>Fechar</button></div>', { cls: 'larga' });
    caixa.querySelector('[data-ok]').addEventListener('click', SIM.fluxo.fecharModal);
  }

  function codigoHtml(path) {
    const F = E.finais(path, 'final');
    const toks = SIM.sintaxe.tokenizar(F.join('\n'), E.lang(path));
    return '<div class="rel-codigo">' + toks.map((l, k) => '<div class="rl"><span class="ln">' + (k + 1) + '</span>' + l.map((p) => '<span class="' + (p.c || '') + '">' + u.esc(p.t) + '</span>').join('') + '</div>').join('') + '</div>';
  }

  const ORDEM = ['src/app/_layout.tsx', 'src/app/index.tsx', 'src/screens/HomeScreen.tsx', 'src/components/TaskInput.tsx', 'src/styles/styles.ts', 'src/context/TaskContext.tsx', 'src/components/TaskItem.tsx', 'src/components/TaskList.tsx'];

  function mostrar() {
    const S = SIM.S;
    const qs = SIM.perguntas || [];
    const tela = u.$('#tela-relatorio');
    u.$('#tela-sim').hidden = true;
    tela.hidden = false;
    const digitadas = SIM.missoes.reduce((n, m) => n + m.passos.filter((p) => p.t === 'digitar').length, 0);
    const blocos = SIM.missoes.reduce((n, m) => n + m.passos.filter((p) => p.t === 'bloco' || p.t === 'ler').length, 0);
    tela.innerHTML = '<div class="relatorio">' +
      '<div class="marca-linha"><span class="marca-selo">{?}</span><span class="marca-nome">Código com Porquê</span></div>' +
      '<h1>Você construiu a tela principal do app Lista de Tarefas.</h1>' +
      '<p class="rel-lead">Foram ' + S.concluidas.length + ' missões, ' + digitadas + ' linhas-chave digitadas por você, ' + blocos + ' blocos e arquivos explicados e ' + S.cartoes.length + ' de ' + qs.length + ' cartões de conceito. Abaixo está o mapa do projeto e o código completo de cada arquivo, com o papel de cada um.</p>' +
      '<div class="rel-acoes"><button type="button" class="botao primario" id="rel-voltar">' + u.icone('i-voltar') + 'Voltar ao simulador</button><button type="button" class="botao" id="rel-copiar">' + u.icone('i-cartoes') + 'Copiar todo o código</button><button type="button" class="botao discreto" id="rel-zerar">' + u.icone('i-recomecar') + 'Recomeçar do zero</button>' + (location.protocol === 'file:' ? '<span class="rel-dica">Para guardar em PDF, aperte Ctrl+P.</span>' : '') + '</div>' +
      '<section class="rel-bloco"><h2>Mapa do projeto</h2>' + htmlMapa() + '</section>' +
      '<section class="rel-bloco"><h2>Cartões de conceito</h2><div class="cartoes-grade">' + qs.filter((q) => S.cartoes.includes(q.id)).map((q) => '<div class="cartao-mini"><strong>' + u.esc(q.cartao.titulo) + '</strong><p>' + u.md(q.cartao.texto) + '</p></div>').join('') + '</div></section>' +
      '<section class="rel-bloco"><h2>O código final, arquivo por arquivo</h2>' + ORDEM.map((p) => {
        const d = (SIM.explicacoes || {})['final:' + p] || {};
        return '<div class="rel-arquivo"><h3>' + u.esc(p) + '</h3>' + (d.papel ? '<p class="rel-papel">' + u.md(d.papel) + '</p>' : '') + codigoHtml(p) + '</div>';
      }).join('') + '</section></div>';
    tela.scrollTop = 0;
    u.$('#rel-voltar').addEventListener('click', () => { tela.hidden = true; u.$('#tela-sim').hidden = false; SIM.fluxo.renderTudo(); });
    u.$('#rel-copiar').addEventListener('click', () => {
      const txt = ORDEM.map((p) => '// ' + p + '\n' + E.finais(p, 'final').join('\n')).join('\n\n');
      const fim = () => u.toast('Código copiado.', 'ok');
      try { navigator.clipboard.writeText(txt).then(fim, () => u.toast('Não foi possível copiar automaticamente. Selecione o código na página e copie.')); }
      catch (e) { u.toast('Não foi possível copiar automaticamente. Selecione o código na página e copie.'); }
    });
    u.$('#rel-zerar').addEventListener('click', () => { E.esquecer(); location.reload(); });
    tela.querySelectorAll('[data-abrir]').forEach((b) => b.addEventListener('click', () => { tela.hidden = true; u.$('#tela-sim').hidden = false; SIM.fluxo.renderTudo(); SIM.editor.abrir(b.dataset.abrir); }));
  }

  SIM.relatorio = { mostrar, mapa, cartoes, htmlMapa };
})();
