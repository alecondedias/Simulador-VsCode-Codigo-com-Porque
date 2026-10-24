/* Explorador de arquivos: árvore do projeto, pastas, criação de pastas e arquivos, seleção de vários itens e exclusão. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const E = SIM.estado;
  let entrada = null; // { tipo: 'pasta'|'arquivo', pai }
  let marcados = new Set(); // itens selecionados (Ctrl+clique e Shift+clique selecionam vários)
  let ancora = null; // ponto de partida do Shift+clique
  let foco = false; // o último clique foi no Explorador?

  const ICONES = { tsx: ['TSX', 'ico-tsx'], ts: ['TS', 'ico-ts'], js: ['JS', 'ico-js'], json: ['{ }', 'ico-json'], css: ['#', 'ico-css'], md: ['M', 'ico-md'] };
  function iconeArquivo(nome) {
    if (/\.png$/.test(nome)) return '<span class="ico-arq ico-img">' + u.icone('i-imagem', 'icone') + '</span>';
    if (nome === '.gitignore') return '<span class="ico-arq ico-git">GIT</span>';
    if (nome === 'package-lock.json') return '<span class="ico-arq ico-json">{ }</span>';
    const ext = (nome.match(/\.(\w+)$/) || [])[1];
    const ic = ICONES[ext] || ['TXT', 'ico-md'];
    return '<span class="ico-arq ' + ic[1] + '">' + ic[0] + '</span>';
  }
  const ordenar = (a, b) => {
    const pa = /^[._]/.test(a) ? 0 : 1;
    const pb = /^[._]/.test(b) ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b, 'en', { sensitivity: 'base', numeric: true });
  };

  function estrutura() {
    const arquivos = Object.keys(SIM.arquivos).filter((p) => E.existe(p));
    const todos = arquivos.concat(['package-lock.json'], SIM.imagens || []);
    const pastas = new Set(['node_modules']);
    todos.forEach((p) => { let d = u.pastaDe(p); while (d) { pastas.add(d); d = u.pastaDe(d); } });
    SIM.S.pastas.forEach((p) => { let d = p; while (d) { pastas.add(d); d = u.pastaDe(d); } });
    return { arquivos: todos, pastas: Array.from(pastas) };
  }

  function filhos(pai, est) {
    const sub = est.pastas.filter((p) => u.pastaDe(p) === pai).sort((a, b) => ordenar(u.nomeArquivo(a), u.nomeArquivo(b)));
    const arqs = est.arquivos.filter((p) => u.pastaDe(p) === pai).sort((a, b) => ordenar(u.nomeArquivo(a), u.nomeArquivo(b)));
    return { sub, arqs };
  }

  function linhaEntrada(prof) {
    const passo = SIM.fluxo.passoAtual();
    const esperado = passo && (passo.t === 'pasta' || passo.t === 'arquivo') ? passo.nome : '';
    return '<div class="exp-item" style="padding-left:' + (8 + prof * 12) + 'px">' +
      (entrada.tipo === 'pasta' ? '<span class="seta">' + u.icone('i-seta-dir') + '</span>' : '<span class="seta"></span>' + iconeArquivo(esperado || 'a.txt')) +
      '<input class="exp-entrada" id="exp-entrada" autocomplete="off" spellcheck="false" placeholder="' + u.esc(esperado) + '" aria-label="Nome do novo ' + (entrada.tipo === 'pasta' ? 'pasta' : 'arquivo') + '"></div>';
  }

  function render() {
    const S = SIM.S;
    const arv = u.$('#arvore');
    if (!arv || !S) return;
    const est = estrutura();
    let html = '';
    const desenhar = (pai, prof) => {
      const f = filhos(pai, est);
      if (entrada && entrada.pai === pai) html += linhaEntrada(prof);
      f.sub.forEach((p) => {
        const aberta = S.expandidas.includes(p) && p !== 'node_modules';
        const cls = ['exp-item'];
        if (S.selecionado === p) cls.push('selecionado');
        if (marcados.size > 1 && marcados.has(p)) cls.push('marcado');
        if (p === 'node_modules') cls.push('esmaecido');
        html += '<div class="' + cls.join(' ') + '" role="treeitem" aria-expanded="' + aberta + '" data-caminho="' + u.esc(p) + '" data-tipo="pasta" style="padding-left:' + (8 + prof * 12) + 'px">' +
          '<span class="seta">' + u.icone(aberta ? 'i-seta-baixo' : 'i-seta-dir') + '</span><span class="nome">' + u.esc(u.nomeArquivo(p)) + '</span></div>';
        if (aberta) desenhar(p, prof + 1);
      });
      f.arqs.forEach((p) => {
        const a = SIM.arquivos[p] ? E.arq(p) : null;
        const cls = ['exp-item'];
        if (S.abaAtiva === p) cls.push('selecionado');
        if (S.selecionado === p) cls.push('focado');
        if (marcados.size > 1 && marcados.has(p)) cls.push('marcado');
        if (a && a.novo) cls.push('novo');
        if (p === 'package-lock.json' || /\.png$/.test(p)) cls.push('esmaecido');
        html += '<div class="' + cls.join(' ') + '" role="treeitem" data-caminho="' + u.esc(p) + '" data-tipo="' + (SIM.arquivos[p] ? 'arquivo' : 'especial') + '" style="padding-left:' + (8 + prof * 12) + 'px">' +
          '<span class="seta"></span>' + iconeArquivo(u.nomeArquivo(p)) + '<span class="nome">' + u.esc(u.nomeArquivo(p)) + '</span>' + (a && a.sujo ? '<span class="sujo" title="Não salvo"></span>' : '') + '</div>';
      });
    };
    desenhar('', 0);
    arv.innerHTML = html;
    const inp = u.$('#exp-entrada');
    if (inp) {
      inp.focus();
      inp.addEventListener('keydown', teclaEntrada);
      inp.addEventListener('blur', () => setTimeout(() => { if (entrada && document.activeElement !== inp) { entrada = null; render(); } }, 150));
    }
    SIM.fluxo && SIM.fluxo.atualizarDestaque && SIM.fluxo.atualizarDestaque();
  }

  // Ordem em que os itens aparecem na árvore (para o Shift+clique).
  function ordemVisivel() { return u.$$('#arvore .exp-item[data-caminho]').map((e) => e.dataset.caminho); }

  function clicar(ev) {
    const it = ev.target.closest('.exp-item[data-caminho]');
    if (!it) return;
    const S = SIM.S;
    const p = it.dataset.caminho;
    const tipo = it.dataset.tipo;
    fecharMenu();
    SIM.sons.tocar('clique');
    // Ctrl+clique põe ou tira um item da seleção; Shift+clique seleciona do último clique até aqui.
    if ((ev.ctrlKey || ev.metaKey || ev.shiftKey) && p !== 'node_modules') {
      if (ev.shiftKey && ancora) {
        const ordem = ordemVisivel();
        const a = ordem.indexOf(ancora);
        const b = ordem.indexOf(p);
        if (a >= 0 && b >= 0) marcados = new Set(ordem.slice(Math.min(a, b), Math.max(a, b) + 1).filter((x) => x !== 'node_modules'));
        else marcados = new Set([p]);
      } else {
        if (!marcados.size && S.selecionado) marcados.add(S.selecionado);
        if (marcados.has(p)) marcados.delete(p); else marcados.add(p);
        ancora = p;
      }
      S.selecionado = p;
      render();
      return;
    }
    marcados = new Set([p]);
    ancora = p;
    if (tipo === 'pasta') {
      if (p === 'node_modules') {
        S.selecionado = p;
        u.toast('`node_modules` guarda todas as bibliotecas que o `npm install` baixou. É enorme e ninguém edita à mão.');
        render();
        return;
      }
      S.selecionado = p;
      const k = S.expandidas.indexOf(p);
      if (k >= 0) S.expandidas.splice(k, 1); else S.expandidas.push(p);
      render();
      SIM.fluxo.evento('pasta-clicada', { path: p });
      return;
    }
    if (tipo === 'especial') {
      S.selecionado = p;
      render();
      if (p === 'package-lock.json') u.toast('`package-lock.json` anota a versão exata de cada biblioteca instalada. É gerado sozinho pelo npm.');
      else u.toast('Imagem PNG usada pelo app de exemplo (ícones, logo, selo). Não é código.');
      return;
    }
    S.selecionado = p;
    SIM.editor.abrir(p);
  }

  function novo(tipo) {
    const S = SIM.S;
    const passo = SIM.fluxo.passoAtual();
    if (!passo || passo.t !== tipo) {
      u.toast('Neste simulador você cria ' + (tipo === 'pasta' ? 'pastas' : 'arquivos') + ' quando a missão pede. Siga o **Faça agora**.');
      SIM.sons.tocar('erro');
      return;
    }
    let pai = '';
    if (S.selecionado) pai = SIM.arquivos[S.selecionado] || /\.\w+$/.test(S.selecionado) ? u.pastaDe(S.selecionado) : S.selecionado;
    if (pai !== passo.pai) {
      const nomePai = passo.pai || 'a raiz do projeto';
      SIM.fluxo.erroModal(
        'Escolha a pasta certa primeiro',
        (pai ? 'Você está dentro de `' + pai + '`. ' : 'Nenhuma pasta está selecionada. ') +
          'A ' + (tipo === 'pasta' ? 'pasta' : 'arquivo') + ' `' + passo.nome + '` precisa ficar dentro de `' + nomePai + '`. ' +
          (passo.porqueLocal || 'Clique nessa pasta no Explorador e depois no botão de novo item.')
      );
      return;
    }
    if (pai && !S.expandidas.includes(pai)) S.expandidas.push(pai);
    entrada = { tipo, pai };
    render();
  }

  function teclaEntrada(ev) {
    if (ev.key === 'Escape') { entrada = null; render(); return; }
    if (ev.key !== 'Enter') return;
    ev.preventDefault();
    const passo = SIM.fluxo.passoAtual();
    const valor = ev.target.value.trim();
    if (!passo || !entrada) return;
    const esperado = passo.nome;
    if (valor !== esperado) {
      let msg;
      if (!valor) msg = 'O nome ficou vazio. Digite `' + esperado + '`, igual ao texto cinza.';
      else if (valor.toLowerCase() === esperado.toLowerCase()) msg = 'Quase! Repare nas maiúsculas e minúsculas: o nome é `' + esperado + '`. ' + (passo.porqueNome || 'O import vai procurar exatamente esse nome, e no celular maiúsculas e minúsculas fazem diferença.');
      else if (/\./.test(esperado) && valor === esperado.replace(/\.\w+$/, '')) msg = 'Faltou a extensão. ' + (passo.porqueExt || 'Ela diz que tipo de arquivo é este.') + ' O nome completo é `' + esperado + '`.';
      else if (/\.tsx$/.test(esperado) && valor === esperado.replace(/x$/, '')) msg = 'Use `.tsx`, com x no final: este arquivo vai ter JSX (as tags da tela, como `<View>`). O nome é `' + esperado + '`.';
      else if (/\.ts$/.test(esperado) && valor === esperado + 'x') msg = 'Aqui é só `.ts`, sem o x: este arquivo não tem nenhuma tag de tela, só valores e estilos. O nome é `' + esperado + '`.';
      else msg = 'O nome esperado é `' + esperado + '`. Digite exatamente como no texto cinza.';
      SIM.fluxo.erroModal('Nome diferente do esperado', msg, () => { const i = u.$('#exp-entrada'); if (i) { i.focus(); i.select(); } });
      return;
    }
    const caminho = (entrada.pai ? entrada.pai + '/' : '') + valor;
    const tipo = entrada.tipo;
    entrada = null;
    if (tipo === 'pasta') {
      E.criarPasta(caminho);
      if (!SIM.S.expandidas.includes(caminho)) SIM.S.expandidas.push(caminho);
      SIM.S.selecionado = caminho;
      render();
      SIM.sons.tocar('acerto');
      SIM.fluxo.evento('criou-pasta', { path: caminho });
    } else {
      E.criarArquivo(caminho);
      SIM.S.selecionado = caminho;
      SIM.sons.tocar('acerto');
      SIM.editor.abrir(caminho, { silencioso: true });
      render();
      SIM.fluxo.evento('criou-arquivo', { path: caminho });
    }
  }

  // ---------- menu do botão direito ----------
  function fecharMenu() { const m = u.$('#menu-exp'); if (m) m.remove(); }
  function menuContexto(ev) {
    const it = ev.target.closest('.exp-item[data-caminho]');
    if (!it) return;
    ev.preventDefault();
    const S = SIM.S;
    const p = it.dataset.caminho;
    if (p === 'node_modules' || it.dataset.tipo === 'especial') return;
    foco = true;
    if (!marcados.has(p)) { marcados = new Set([p]); ancora = p; S.selecionado = p; render(); }
    fecharMenu();
    const m = document.createElement('div');
    m.id = 'menu-exp';
    m.className = 'menu-exp';
    m.setAttribute('role', 'menu');
    m.innerHTML = '<div class="menu-exp-item" role="menuitem" data-acao="excluir"><span>Excluir</span><kbd>Delete</kbd></div>';
    document.body.appendChild(m);
    m.style.left = Math.min(ev.clientX, innerWidth - m.offsetWidth - 8) + 'px';
    m.style.top = Math.min(ev.clientY, innerHeight - m.offsetHeight - 8) + 'px';
    m.addEventListener('click', (e) => { if (e.target.closest('[data-acao="excluir"]')) { fecharMenu(); excluirSelecao(); } });
    SIM.sons.tocar('clique');
  }

  // ---------- excluir ----------
  // Raízes da seleção: se uma pasta e um arquivo dela estão marcados, basta a pasta.
  function raizesSelecao() {
    const lista = Array.from(marcados).filter((p) => p !== 'node_modules' && (SIM.arquivos[p] ? E.existe(p) : true));
    return lista.filter((p) => !lista.some((q) => q !== p && p.startsWith(q + '/')));
  }
  // Arquivos de verdade dentro de um item (o próprio arquivo, ou tudo o que existe dentro da pasta).
  function arquivosDe(p) {
    if (SIM.arquivos[p]) return E.existe(p) ? [p] : [];
    return Object.keys(SIM.arquivos).filter((x) => x.startsWith(p + '/') && E.existe(x));
  }
  function excluirSelecao() {
    const S = SIM.S;
    const passo = SIM.fluxo.passoAtual();
    const raizes = raizesSelecao();
    if (!raizes.length) { u.toast('Primeiro selecione no Explorador o que você quer apagar.'); return; }
    if (!passo || passo.t !== 'excluir') {
      SIM.sons.tocar('erro');
      u.toast('Neste simulador você apaga arquivos quando a missão pede. Siga o **Faça agora**.');
      return;
    }
    const alvos = new Set(passo.alvos);
    const manter = passo.manter || [];
    const protegido = manter.find((m) => raizes.some((r) => m === r || m.startsWith(r + '/')));
    if (protegido) {
      SIM.fluxo.erroModal('Esse arquivo fica no projeto', passo.porqueManter || ('O `' + u.nomeArquivo(protegido) + '` faz parte do nosso app e não pode ser apagado. Tire ele da seleção: segure **Ctrl** e clique nele.'));
      return;
    }
    const fora = raizes.filter((r) => !alvos.has(r) && !(arquivosDe(r).length && arquivosDe(r).every((x) => alvos.has(x))));
    if (fora.length) {
      SIM.fluxo.erroModal('Esse arquivo não sai agora', 'Nem tudo o que você selecionou pode ser apagado: `' + u.nomeArquivo(fora[0]) + '` continua no projeto. Apague só o que o **Faça agora** pede.');
      return;
    }
    const pasta = (r) => !SIM.arquivos[r];
    const titulo = raizes.length === 1
      ? 'Tem certeza de que deseja excluir \'' + u.nomeArquivo(raizes[0]) + '\'' + (pasta(raizes[0]) ? ' e todo o seu conteúdo?' : '?')
      : 'Tem certeza de que deseja excluir os ' + raizes.length + ' itens a seguir?';
    const lista = raizes.length > 1 ? '<ul class="lista-excluir">' + raizes.map((r) => '<li>' + u.icone(pasta(r) ? 'i-seta-dir' : 'i-arquivos', '') + u.esc(u.nomeArquivo(r)) + (pasta(r) ? '/' : '') + '</li>').join('') + '</ul>' : '';
    const caixa = SIM.fluxo.modal(
      '<h2>' + u.icone('i-aviso') + u.esc(titulo) + '</h2>' + lista +
      '<p>' + (raizes.length > 1 || pasta(raizes[0]) ? 'Você pode restaurar esses arquivos da Lixeira.' : 'Você pode restaurar este arquivo da Lixeira.') + '</p>' +
      '<div class="modal-acoes"><button type="button" class="botao discreto" data-ok>Cancelar</button><button type="button" class="botao primario" data-foco id="btn-excluir-ok">' + u.icone('i-check') + 'Mover para a Lixeira</button></div>',
      { cls: 'confirmar' }
    );
    caixa.querySelector('[data-ok]').addEventListener('click', SIM.fluxo.fecharModal);
    caixa.querySelector('#btn-excluir-ok').addEventListener('click', () => {
      SIM.fluxo.fecharModal();
      const apagados = [];
      raizes.forEach((r) => apagados.push(...E.excluir(r)));
      marcados = new Set();
      ancora = null;
      S.selecionado = '';
      SIM.sons.tocar('acerto');
      SIM.editor.render();
      render();
      // O Metro percebe que arquivos sumiram e monta o app de novo.
      if (S.cel.metroLigado && S.cel.tela === 'app') { SIM.terminal.empacotou(1, null, S.cel.modo === 'web'); SIM.celular.render(); }
      SIM.fluxo.evento('excluiu', { paths: apagados });
    });
  }

  // Próximo clique para o passo de excluir (o destaque pulsa nele).
  function proximoExclusao(passo) {
    const S = SIM.S;
    const raizesAlvo = passo.alvos.filter((a) => !passo.alvos.some((b) => b !== a && a.startsWith(b + '/')));
    const pendentes = raizesAlvo.filter((a) => arquivosDe(a).length);
    if (!pendentes.length) return null;
    // Algum item ainda está escondido numa pasta fechada? Primeiro abre a pasta.
    for (const a of pendentes) {
      const prox = SIM.explorador.proximoClique(a);
      if (prox !== a) return SIM.explorador.elemento(prox);
    }
    const ordem = ordemVisivel().filter((x) => pendentes.includes(x));
    const primeiro = ordem[0];
    const ultimo = ordem[ordem.length - 1];
    // Um arquivo que fica entrou na faixa selecionada: é hora do Ctrl+clique nele.
    const manter = marcados.size > 1 ? (passo.manter || []).find((m) => marcados.has(m)) : null;
    if (manter) return SIM.explorador.elemento(manter);
    if (!primeiro) return null;
    if (!marcados.has(primeiro)) return SIM.explorador.elemento(primeiro);
    if (ordem.length > 1 && !marcados.has(ultimo)) return SIM.explorador.elemento(ultimo);
    // Tudo certo na seleção: com um arquivo só, o destaque continua nele (falta o Excluir).
    return ordem.length === 1 ? SIM.explorador.elemento(primeiro) : null;
  }

  SIM.explorador = {
    render,
    novo,
    excluirSelecao,
    proximoExclusao,
    temFoco: () => foco,
    limparSelecao() { marcados = new Set(); ancora = null; },
    // Delete apaga o que está selecionado no Explorador, mas só nos passos que pedem para apagar.
    teclar(ev) {
      const passo = SIM.fluxo.passoAtual();
      if (!passo || passo.t !== 'excluir') return false;
      if (ev.key === 'Delete' || ((ev.metaKey || ev.ctrlKey) && ev.key === 'Backspace')) { excluirSelecao(); return true; }
      return false;
    },
    expandirAte(path) {
      const S = SIM.S;
      let d = u.pastaDe(path);
      while (d) { if (!S.expandidas.includes(d)) S.expandidas.push(d); d = u.pastaDe(d); }
    },
    // Próximo item a clicar para chegar até um arquivo (para o destaque do "Faça agora").
    proximoClique(path) {
      const S = SIM.S;
      const partes = path.split('/');
      let acum = '';
      for (let k = 0; k < partes.length - 1; k++) {
        acum = acum ? acum + '/' + partes[k] : partes[k];
        if (!S.expandidas.includes(acum)) return acum;
      }
      return path;
    },
    elemento(path) { return u.$('.exp-item[data-caminho="' + CSS.escape(path) + '"]'); },
    iniciar() {
      u.$('#arvore').addEventListener('click', clicar);
      u.$('#arvore').addEventListener('contextmenu', menuContexto);
      // Shift+clique não deve selecionar o texto da árvore.
      u.$('#arvore').addEventListener('mousedown', (ev) => { if (ev.shiftKey) ev.preventDefault(); });
      document.addEventListener('mousedown', (ev) => {
        foco = !!(ev.target.closest && (ev.target.closest('#arvore') || ev.target.closest('#menu-exp')));
        if (!(ev.target.closest && ev.target.closest('#menu-exp'))) fecharMenu();
      });
      window.addEventListener('blur', fecharMenu);
      document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') fecharMenu(); });
      window.addEventListener('resize', fecharMenu);
      u.$('#btn-nova-pasta').addEventListener('click', () => novo('pasta'));
      u.$('#btn-novo-arquivo').addEventListener('click', () => novo('arquivo'));
      u.$('#btn-recolher').addEventListener('click', () => { SIM.S.expandidas = []; render(); });
    },
    cancelarEntrada() { entrada = null; },
  };
})();
