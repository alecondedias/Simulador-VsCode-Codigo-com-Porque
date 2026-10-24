/* Painel da direita: abas Celular, Catálogo de estilos (styles.ts ao vivo), Bancada (componentes) e Raio-X da memória. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const E = SIM.estado;
  const ESTILOS = 'src/styles/styles.ts';
  let estilosAntes = new Set();

  function mostrarAba(qual) {
    const S = SIM.S;
    S.ladoAba = qual;
    ['celular', 'catalogo', 'bancada'].forEach((q) => {
      u.$('#aba-' + q).setAttribute('aria-selected', q === qual);
    });
    u.$('#celular-wrap').hidden = qual !== 'celular';
    u.$('#catalogo').hidden = qual !== 'catalogo';
    u.$('#bancada').hidden = qual !== 'bancada';
    if (qual === 'catalogo') renderCatalogo();
    if (qual === 'bancada') renderBancada();
    if (qual === 'celular') { SIM.celular.render(); ajustarTamanho(); }
  }

  function abasVisiveis(cat, banc) {
    u.$('#aba-catalogo').hidden = !cat;
    u.$('#aba-bancada').hidden = !banc;
    // Com uma aba só (Celular), a barra de abas não serve para nada: some e o celular ganha espaço.
    u.$('.lado-abas').hidden = !cat && !banc;
    const S = SIM.S;
    if (S && ((S.ladoAba === 'catalogo' && !cat) || (S.ladoAba === 'bancada' && !banc))) mostrarAba('celular');
    ajustarTamanho();
  }

  // O celular encolhe ou cresce para caber inteiro na coluna, junto com o Raio-X, a legenda e os botões.
  const LARGURA_MIN = 236;
  const LARGURA_MAX = 318;
  function ajustarTamanho() {
    const lado = u.$('#lado');
    const wrap = u.$('#celular-wrap');
    const cel = u.$('#celular');
    if (!lado || !wrap || !cel || wrap.hidden) return;
    if (window.matchMedia('(max-width: 1100px)').matches) { cel.style.width = ''; return; }
    const gLado = parseFloat(getComputedStyle(lado).rowGap) || 0;
    const gWrap = parseFloat(getComputedStyle(wrap).rowGap) || 0;
    let livre = lado.clientHeight;
    const abas = u.$('.lado-abas');
    if (abas && !abas.hidden) livre -= abas.offsetHeight + gLado;
    const rx = u.$('#raio-x');
    if (rx && !rx.hidden) livre -= rx.offsetHeight + gWrap;
    livre -= u.$('#cel-legenda').offsetHeight + gWrap;
    livre -= Math.max(u.$('#cel-ferramentas').offsetHeight, 30) + gWrap;
    // Altura do aparelho = (largura - 18) x 780 / 360 + 22 (moldura).
    const largura = Math.floor((livre - 22) * 360 / 780 + 18);
    cel.style.width = 'min(100%, ' + Math.max(LARGURA_MIN, Math.min(LARGURA_MAX, largura)) + 'px)';
  }

  // ---------- Catálogo ----------
  function comentarios() {
    const r = {};
    E.visiveis(ESTILOS).forEach((l) => {
      const m = /^\s{2}(\w+):\s*"([^"]+)",\s*\/\/\s*(.*)$/.exec(l.t);
      if (m) r[m[1]] = m[3].replace(/\s+-\s+/g, ', ');
    });
    return r;
  }
  function previa(nome, s, st) {
    const css = SIM.celular.css;
    const S = st.styles || {};
    const base = 'font-size:14px;color:#000;';
    switch (nome) {
      case 'container': case 'safeArea': return '<div style="width:100%;height:56px;' + css(s) + ';border:1px dashed #b5b5bd"></div>';
      case 'section': return '<div style="width:100%;' + css(s) + '"><div style="' + base + css(S.sectionTitle) + '">Seção</div></div>';
      case 'sectionTitle': case 'text': case 'textMuted': return '<div style="' + base + css(s) + '">' + (nome === 'textMuted' ? 'Texto secundário' : nome === 'text' ? 'Texto geral' : 'Título de seção') + '</div>';
      case 'button': case 'buttonPrimary': case 'buttonPrimaryText':
        return '<div style="display:flex;flex-direction:column;width:100%;' + css(S.button, nome !== 'button' ? S.buttonPrimary : null) + '"><span style="' + base + css(nome === 'button' ? null : S.buttonPrimaryText) + '">Botão</span></div>';
      case 'buttonSecondary': case 'buttonSecondaryText':
        return '<div style="display:flex;flex-direction:column;width:100%;' + css(S.button, S.buttonSecondary) + '"><span style="' + base + css(S.buttonSecondaryText) + '">Botão secundário</span></div>';
      case 'buttonSmall': case 'buttonSmallText':
        return '<div style="display:flex;flex-direction:column;' + css(S.button, S.buttonPrimary, S.buttonSmall) + '"><span style="' + base + css(S.buttonPrimaryText, S.buttonSmallText) + '">Pequeno</span></div>';
      case 'input': return '<div style="width:100%;' + css(s) + ';color:#999">Campo de texto</div>';
      case 'card': return '<div style="width:100%;' + css(s) + '"><span style="' + base + css(S.text) + '">Cartão</span></div>';
      case 'emptyContainer': case 'emptyText': return '<div style="display:flex;flex-direction:column;' + css(S.emptyContainer) + '"><span style="' + base + css(S.emptyText) + '">Lista vazia</span></div>';
      case 'row': return '<div style="display:flex;width:100%;' + css(s) + '"><span style="' + base + '">A</span><span style="' + base + '">B</span></div>';
      case 'icon': return '<div style="' + base + css(s) + '">&#9733;</div>';
      case 'checkbox': case 'checkboxUnchecked': case 'checkboxChecked':
        return '<div style="display:flex;gap:10px"><div style="display:flex;' + css(S.checkbox, S.checkboxUnchecked) + '"></div>' + (S.checkboxChecked ? '<div style="display:flex;' + css(S.checkbox, S.checkboxChecked) + '"></div>' : '') + '</div>';
      case 'modalOverlay': case 'modalContent': case 'modalTitle':
        return '<div style="display:flex;width:100%;height:84px;' + css(S.modalOverlay) + '"><div style="' + css(S.modalContent) + ';padding:8px"><div style="' + base + css(S.modalTitle) + ';margin-bottom:0;font-size:12px">Título</div></div></div>';
      case 'filterContainer': case 'filterButton': case 'filterButtonActive': case 'filterButtonText': case 'filterButtonTextActive':
        return '<div style="display:flex;width:100%;' + css(S.filterContainer) + ';padding:6px"><span style="' + css(S.filterButton, S.filterButtonActive) + '"><span style="' + base + css(S.filterButtonText, S.filterButtonTextActive) + ';font-size:11px">Ativo</span></span><span style="' + css(S.filterButton) + '"><span style="' + base + css(S.filterButtonText) + ';font-size:11px">Filtro</span></span></div>';
      default: return '<div style="' + base + css(s) + '">' + u.esc(nome) + '</div>';
    }
  }
  function renderCatalogo() {
    const box = u.$('#catalogo');
    if (!box || box.hidden) return;
    const st = SIM.celular.avaliarEstilos('editor');
    if (!E.existe(ESTILOS) || !st || (!st.colors && !st.fontSize && !st.spacing && !st.styles)) {
      box.innerHTML = '<div class="cat-vazio">O catálogo se monta sozinho enquanto você escreve o <code class="texto-codigo">styles.ts</code>. Cada cor vira uma amostra, cada espaçamento vira uma régua e cada estilo vira uma prévia.</div>';
      return;
    }
    let html = '';
    if (st.colors) {
      const com = comentarios();
      html += '<div class="cat-sec"><h4>Cores <small>colors</small></h4><div class="cat-cores">' + Object.keys(st.colors).map((k) =>
        '<div class="cat-cor"><div class="amostra" style="background:' + u.esc(st.colors[k]) + '"></div><div class="info"><b>' + u.esc(k) + '</b><span>' + u.esc(st.colors[k]) + '</span>' + (com[k] ? '<em>' + u.esc(com[k]) + '</em>' : '') + '</div></div>').join('') + '</div></div>';
    }
    if (st.fontSize) {
      html += '<div class="cat-sec"><h4>Tamanhos de fonte <small>fontSize</small></h4><div class="cat-fontes">' + Object.keys(st.fontSize).map((k) =>
        '<div class="cat-fonte"><code>' + u.esc(k) + ' ' + st.fontSize[k] + '</code><span style="font-size:' + st.fontSize[k] + 'px">Nova Tarefa</span></div>').join('') + '</div></div>';
    }
    if (st.spacing) {
      html += '<div class="cat-sec"><h4>Espaçamentos <small>spacing</small></h4><div class="cat-espacos">' + Object.keys(st.spacing).map((k) =>
        '<div class="cat-espaco"><span>' + u.esc(k) + ' ' + st.spacing[k] + '</span><i style="width:' + st.spacing[k] * 5 + 'px"></i></div>').join('') + '</div></div>';
    }
    if (st.styles && Object.keys(st.styles).length) {
      const agora = new Set(Object.keys(st.styles));
      html += '<div class="cat-sec"><h4>Estilos prontos <small>styles</small></h4><div class="cat-estilos">' + Object.keys(st.styles).map((k) =>
        '<div class="cat-estilo' + (!estilosAntes.has(k) ? ' novo' : '') + '"><div class="palco">' + previa(k, st.styles[k], st) + '</div><div class="nome">styles.' + u.esc(k) + '</div></div>').join('') + '</div></div>';
      estilosAntes = agora;
    }
    box.innerHTML = html;
  }

  // ---------- Bancada (missão 6) ----------
  function renderBancada() {
    const box = u.$('#bancada');
    if (!box || box.hidden) return;
    const p = SIM.S.abaAtiva;
    const tem = (path, ...ls) => ls.every((i) => E.tem(path, i) && E.texto(path, i) === E.finais(path)[i - 1]);
    let html = '';
    if (p === 'src/context/TaskContext.tsx') {
      const A = p;
      const campos = [4, 5, 6, 7, 8].filter((i) => tem(A, i)).map((i) => E.finais(A)[i - 1].trim().replace(/;$/, '').split(':'));
      html += '<div class="banc-titulo">A caixa compartilhada</div><div class="caixa-contexto">';
      html += '<div class="rotulo">TaskContext.tsx</div>';
      if (tem(A, 3)) html += '<div class="item"><code>interface Task</code>: o molde de uma tarefa<div class="molde" style="margin-top:6px">' + campos.map((c) => '<span>' + u.esc(c[0]) + '</span><span>' + u.esc((c[1] || '').trim()) + '</span>').join('') + '</div></div>';
      if (tem(A, 11)) html += '<div class="item"><code>TaskContextType</code>: o que a caixa entrega' + (tem(A, 12) ? '<br>tasks: lista de tarefas' : '') + (tem(A, 13) ? '<br>addTask: função para adicionar' : '') + '</div>';
      if (tem(A, 16)) html += '<div class="item"><code>TaskContext</code>: a caixa existe, mas começa com <code>undefined</code> até um Provider encher</div>';
      if (tem(A, 24)) html += '<div class="item"><code>TaskProvider</code>: o dono da memória' + (tem(A, 25) ? '. Guarda <code>tasks = []</code>' : '') + (tem(A, 27) ? ' e sabe adicionar com <code>addTask</code>' : '') + (tem(A, 40) ? '. Entrega tudo pelo <code>value</code> para quem estiver dentro dele.' : '') + '</div>';
      if (!tem(A, 3)) html += '<div class="banc-nota">As partes do contexto aparecem aqui conforme você escreve.</div>';
      html += '</div>';
    } else if (p === 'src/components/TaskItem.tsx') {
      const A = p;
      const st = SIM.celular.avaliarEstilos('editor') || {};
      const s = st.styles || {};
      const sp = st.spacing || {};
      const css = SIM.celular.css;
      let card = '';
      if (tem(A, 10, 11, 12)) {
        const dentro = (tem(A, 13) ? '<div style="display:flex;' + css(s.row) + '">' + (tem(A, 14) ? '<div style="display:flex;' + css(s.checkbox, s.checkboxUnchecked) + '"></div>' : '') + (tem(A, 15) ? '<div style="flex:1">' + (tem(A, 16) ? '<span style="font-size:14px;' + css(s.text) + '">Exemplo de tarefa</span>' : '') + '</div>' : '') + '</div>' : '');
        card = '<div style="' + css(s.card, { marginHorizontal: sp.md }) + '">' + dentro + '</div>';
      }
      html += '<div class="banc-titulo">Bancada: um TaskItem sozinho</div><div class="banc-palco">' + (card || '<div class="banc-nota" style="padding:0 12px;color:#666">O cartão aparece aqui quando o return do componente estiver escrito.</div>') + '</div>' +
        '<div class="banc-nota">A bancada mostra o componente fora do app, com uma tarefa de exemplo, para você ver o desenho do cartão enquanto escreve.</div>';
    } else if (p === 'src/components/TaskList.tsx') {
      const A = p;
      const st = SIM.celular.avaliarEstilos('editor');
      html += '<div class="banc-titulo">Bancada: a lista vazia</div><div class="banc-palco" style="padding:0">' + (tem(A, 16, 17, 25, 26) ? SIM.celular.listaVazia(st) : '<div class="banc-nota" style="padding:12px;color:#666">A mensagem de lista vazia aparece aqui quando a função renderEmptyList estiver escrita.</div>') + '</div>' +
        '<div class="banc-nota">Na bancada a lista está dentro de um TaskProvider de teste. No app de verdade, quem coloca o Provider é o _layout.tsx.</div>';
    } else {
      html = '<div class="banc-nota">Abra o TaskContext.tsx, o TaskItem.tsx ou o TaskList.tsx para ver a bancada.</div>';
    }
    box.innerHTML = html;
  }

  // ---------- Raio-X ----------
  function renderRaioX() {
    const S = SIM.S;
    const box = u.$('#raio-x');
    if (!box || !S) return;
    const C = S.cel;
    const itens = [];
    let nota = '';
    const L = E.salvoInfo('src/app/_layout.tsx');
    // O Raio-X só aparece quando o nosso app tem um componente com memória (estado) na tela.
    if (C.tela === 'app' && L.versao !== 'modelo') {
      const H = E.salvoInfo('src/screens/HomeScreen.tsx');
      const T = E.salvoInfo('src/components/TaskInput.tsx');
      const I = E.salvoInfo('src/app/index.tsx');
      const mostraInput = I.versao === 'final' && I.has(4) && H.has(10) && T.existe && T.has(5);
      if (mostraInput) {
        if (T.has(6)) {
          itens.push({ dono: 'TaskInput', nome: 'taskName', valor: JSON.stringify(C.taskName) });
          if (T.has(31) && !T.has(32)) nota = 'O campo está preso ao valor de taskName (value), mas falta o onChangeText para mudar essa memória. Por isso nada que você digita entra.';
          else if (T.has(31) && T.has(32)) nota = 'Cada letra digitada chama setTaskName, e a memória taskName muda junto. É um campo controlado.';
          else nota = 'A memória taskName existe, mas o campo ainda não está ligado a ela: o texto digitado fica só dentro do campo.';
        } else {
          itens.push({ dono: 'TaskInput', nome: '(nenhuma memória)', valor: '' });
          nota = 'O TaskInput ainda não tem useState. O que você digitar fica só dentro do campo, e o componente não guarda nada.';
        }
      }
      if (C.experimento === 'tasklist-com-provider') itens.push({ dono: 'TaskProvider (experimento)', nome: 'tasks', valor: '[]' });
    }
    const estavaOculto = box.hidden;
    box.hidden = !itens.length;
    if (itens.length) {
      box.innerHTML = '<div class="rx-topo">' + u.icone('i-raio', '') + 'Raio-X da memória</div>' +
        '<div class="rx-lista">' + itens.map((it) => {
          const chave = it.dono + '.' + it.nome;
          const mudou = valoresAntes.has(chave) && valoresAntes.get(chave) !== it.valor;
          valoresAntes.set(chave, it.valor);
          return '<div class="rx-item">' + (it.dono ? '<span class="dono">' + u.esc(it.dono) + '</span>' : '') + '<b>' + u.esc(it.nome) + '</b><span class="valor' + (mudou ? ' mudou' : '') + '">' + u.esc(it.valor) + '</span></div>';
        }).join('') + '</div>' +
        (nota ? '<div class="rx-nota">' + u.esc(nota) + '</div>' : '');
    }
    if (estavaOculto !== box.hidden) ajustarTamanho();
  }
  const valoresAntes = new Map();

  SIM.lado = {
    mostrarAba,
    abasVisiveis,
    renderCatalogo,
    renderBancada,
    renderRaioX,
    atualizar() {
      const S = SIM.S;
      if (S.ladoAba === 'catalogo') renderCatalogo();
      if (S.ladoAba === 'bancada') renderBancada();
      renderRaioX();
    },
    ajustarTamanho,
    iniciar() {
      ['celular', 'catalogo', 'bancada'].forEach((q) => u.$('#aba-' + q).addEventListener('click', () => { SIM.sons.tocar('clique'); mostrarAba(q); }));
      window.addEventListener('resize', ajustarTamanho);
      if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => ajustarTamanho());
        ro.observe(u.$('#lado'));
        ro.observe(u.$('#raio-x'));
        ro.observe(u.$('#cel-ferramentas'));
      }
    },
  };
})();
