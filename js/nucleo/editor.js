/* Editor no estilo VS Code: abas, linhas com realce, digitação guiada (texto fantasma), Tab, IntelliSense,
   sublinhado vermelho com Quick Fix, Ctrl+clique para ir à definição e cartões do porquê. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const E = SIM.estado;

  const ui = {
    espiar: null,        // { path, i, modo: 'linha'|'tour'|'ese' }
    resumo: null,        // { titulo, oque, funcoes, linhas:[de,ate], path, botao, nota, aoOk }
    realceDef: null,     // { path, de, ate }
    realceBloco: null,   // { path, de, ate }
    riscadas: null,      // { path, linhas:[...] }
    novas: [],           // linhas recém-inseridas (animação)
    errosSeguidos: 0,
    letraErrada: '',
    sug: null,           // { palavra, inicio, fim, itens, ativo }
    qf: null,            // { itens, x, y }
    hoverTimer: null,
  };
  let pool = null;

  const NOMES_LANG = { tsx: 'TypeScript JSX', ts: 'TypeScript', js: 'JavaScript', json: 'JSON', css: 'CSS', md: 'Markdown', txt: 'Texto sem formatação' };
  const COMPONENTES = {
    HomeScreen: 'src/screens/HomeScreen.tsx', TaskInput: 'src/components/TaskInput.tsx', TaskList: 'src/components/TaskList.tsx',
    TaskItem: 'src/components/TaskItem.tsx', TaskContext: 'src/context/TaskContext.tsx', TaskProvider: 'src/context/TaskContext.tsx',
  };

  function coluna() { return u.$('.vs-editor-col'); }
  function relativo(el) {
    const c = coluna().getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - c.left, y: r.top - c.top, b: r.bottom - c.top, w: r.width };
  }

  // ---------- abrir arquivo ----------
  function abrir(path, opts) {
    const S = SIM.S;
    if (!SIM.arquivos[path] || !E.existe(path)) return;
    E.arq(path);
    if (!S.abas.includes(path)) S.abas.push(path);
    S.abaAtiva = path;
    S.selecionado = path;
    SIM.explorador.expandirAte(path);
    fecharPopups();
    render();
    SIM.explorador.render();
    u.$('#editor').scrollTop = 0;
    if (!(opts && opts.silencioso)) SIM.fluxo.evento('arquivo-aberto', { path });
  }

  // ---------- montagem das linhas ----------
  function listaExibicao(path) {
    const S = SIM.S;
    const vis = E.visiveis(path).map((l) => ({ i: l.i, t: l.t }));
    const dig = S.digitando && S.digitando.path === path ? S.digitando : null;
    if (dig) {
      const it = vis.find((l) => l.i === dig.i);
      if (it) { it.t = dig.indent + dig.alvo; it.digitando = true; }
    }
    const tabP = S.tabPendente && S.tabPendente.path === path ? S.tabPendente : null;
    if (tabP) {
      const F = E.finais(path);
      tabP.ls.forEach((i, k) => { if (!vis.some((l) => l.i === i)) vis.push({ i, t: F[i - 1], fantasma: true, primeiro: k === 0 }); });
      vis.sort((a, b) => a.i - b.i);
    }
    return vis;
  }

  function chaveGlossario(p) {
    const G = SIM.glossario || {};
    if (p.membroDe && G[p.membroDe + '.' + p.id]) return p.membroDe + '.' + p.id;
    if (G[p.id]) return p.id;
    return '';
  }
  function chaveDefinicao(p) {
    if (p.membroDe && /^(styles|colors|spacing|fontSize)$/.test(p.membroDe)) return p.membroDe + '.' + p.id;
    if (COMPONENTES[p.id] && !p.membroDe) return 'comp:' + p.id;
    return '';
  }

  function spanToken(p, extraCls, extraAttr) {
    let attrs = '';
    if (p.id) {
      const g = chaveGlossario(p);
      if (g) attrs += ' data-g="' + u.esc(g) + '"';
      else if (SIM.estilosProps && SIM.estilosProps[p.id]) attrs += ' data-g="estilo:' + u.esc(p.id) + '"';
      const d = chaveDefinicao(p);
      if (d) attrs += ' data-def="' + u.esc(d) + '"';
    } else if (p.str) {
      const limpo = p.str.replace(/^['"`]|['"`]$/g, '');
      if (SIM.glossario && (SIM.glossario[p.str] || SIM.glossario[limpo]) && limpo === 'worklet') attrs += ' data-g="' + u.esc(SIM.glossario[p.str] ? p.str : limpo) + '"';
    }
    return '<span class="' + (p.c || '') + (extraCls ? ' ' + extraCls : '') + '"' + attrs + (extraAttr || '') + '>' + u.esc(p.t) + '</span>';
  }

  function htmlLinha(toks, diagsLinha, corte, ehDigitando) {
    let html = '';
    let col = 0;
    let cursorPosto = false;
    const cursor = () => {
      cursorPosto = true;
      return (ui.letraErrada ? '<span class="letra-errada">' + u.esc(ui.letraErrada) + '</span>' : '') + '<span class="cursor' + (ui.letraErrada ? ' erro' : '') + '" id="cursor"></span>';
    };
    toks.forEach((p) => {
      const ini = col;
      const fim = col + p.t.length;
      let extra = '';
      let attr = '';
      if (diagsLinha) {
        const d = diagsLinha.find((x) => x.col === ini && x.nome === p.t);
        if (d) { extra = 'sq'; attr = ' data-diag="' + u.esc(d.nome) + '"'; }
      }
      if (!ehDigitando || fim <= corte) html += spanToken(p, extra, attr);
      else if (ini >= corte) {
        if (!cursorPosto) html += cursor();
        html += '<span class="fantasma">' + u.esc(p.t) + '</span>';
      } else {
        const a = p.t.slice(0, corte - ini);
        const b = p.t.slice(corte - ini);
        html += spanToken(Object.assign({}, p, { t: a }), extra, attr) + cursor() + '<span class="fantasma">' + u.esc(b) + '</span>';
      }
      col = fim;
    });
    if (ehDigitando && !cursorPosto) html += cursor();
    return html;
  }

  function renderConteudo() {
    const S = SIM.S;
    const ed = u.$('#editor');
    const path = S.abaAtiva;
    if (!path) {
      ed.classList.add('vazio-total');
      ed.innerHTML = '<div class="editor-boas-vindas"><strong>Nenhum arquivo aberto</strong><span>Abra um arquivo no Explorador, à esquerda.</span></div>';
      return;
    }
    ed.classList.remove('vazio-total');
    const lista = listaExibicao(path);
    const lang = E.lang(path);
    const reais = lista.filter((l) => !l.fantasma);
    const toks = SIM.sintaxe.tokenizar(reais.map((l) => l.t).join('\n'), lang);
    const diags = E.diagnosticos(path, 'editor');
    const porLinha = {};
    diags.forEach((d) => { (porLinha[d.i] = porLinha[d.i] || []).push(d); });
    const dig = S.digitando && S.digitando.path === path ? S.digitando : null;
    const passo = SIM.fluxo.passoAtual();
    const leitura = passo && passo.t === 'ler' && passo.a === path;
    const unidades = SIM.porque.unidades(path);
    const lidos = new Set(S.lidos[path] || []);
    const uniAtiva = ui.espiar && ui.espiar.path === path && ui.espiar.modo === 'tour' ? SIM.porque.unidadeDe(path, ui.espiar.i) : null;
    const primeiraDiag = diags.length ? diags[0].i : 0;
    let k = 0;
    let num = 0;
    let html = '';
    lista.forEach((l) => {
      num++;
      const cls = ['ed-linha'];
      let cod;
      if (l.fantasma) {
        cod = '<span class="fantasma">' + u.esc(l.t) + '</span>' + (l.primeiro ? '<span class="selo-tab">Tab</span>' : '');
      } else {
        const tk = toks[k++] || [];
        const corte = l.digitando ? dig.indent.length + dig.pos : 0;
        cod = htmlLinha(tk, porLinha[l.i], corte, !!l.digitando);
        if (l.digitando) cls.push('atual');
      }
      if (uniAtiva && l.i >= uniAtiva.de && l.i <= uniAtiva.ate) cls.push('na-unidade');
      if (ui.realceBloco && ui.realceBloco.path === path && l.i >= ui.realceBloco.de && l.i <= ui.realceBloco.ate) cls.push('no-bloco');
      if (ui.realceDef && ui.realceDef.path === path && l.i >= ui.realceDef.de && l.i <= ui.realceDef.ate) cls.push('realce-definicao');
      if (ui.riscadas && ui.riscadas.path === path && ui.riscadas.linhas.includes(l.i)) cls.push('riscada');
      if (ui.novas.includes(l.i)) cls.push('nova');
      if (ui.espiar && ui.espiar.path === path && ui.espiar.modo === 'linha' && ui.espiar.i === l.i) cls.push('atual');
      let glifo = '';
      if (l.i === primeiraDiag && !l.fantasma) glifo = '<svg class="lampada" data-acao="qf" aria-label="Correção rápida"><use href="#i-lampada"/></svg>';
      else if (leitura) {
        const ui2 = unidades.findIndex((x) => x.de === l.i);
        if (ui2 >= 0) glifo = lidos.has(ui2) ? '<svg class="marca-lida"><use href="#i-check"/></svg>' : '<span class="marca-ler"></span>';
      }
      html += '<div class="' + cls.join(' ') + '" data-i="' + l.i + '"><span class="ed-num">' + num + '</span><span class="ed-glifo">' + glifo + '</span><span class="ed-cod">' + cod + '</span></div>';
      // cartão do porquê embaixo da linha certa
      if (ui.espiar && ui.espiar.path === path) {
        const alvoI = ui.espiar.modo === 'tour' && uniAtiva ? uniAtiva.ate : ui.espiar.i;
        if (alvoI === l.i) html += SIM.porque.htmlEspiar(path, ui.espiar.i, ui.espiar.modo);
      }
    });
    if (!lista.length) html = '<div class="ed-linha atual" data-i="0"><span class="ed-num">1</span><span class="ed-glifo"></span><span class="ed-cod">' + (S.selecaoTotal ? '' : '<span class="cursor"></span>') + '</span></div>';
    ed.innerHTML = html;
    ed.classList.toggle('selecao-total', !!S.selecaoTotal && S.abaAtiva === path);
    ui.novas = [];
    ui.letraErrada = '';
    // resumo do bloco por cima do editor
    let rb = u.$('#resumo-bloco');
    if (ui.resumo) {
      if (!rb) { rb = document.createElement('div'); rb.id = 'resumo-bloco'; rb.className = 'resumo-bloco'; coluna().appendChild(rb); }
      rb.innerHTML = SIM.porque.htmlResumo(ui.resumo);
    } else if (rb) rb.remove();
    posicionarSugestoes();
  }

  function renderAbas() {
    const S = SIM.S;
    u.$('#abas').innerHTML = S.abas.map((p) => {
      const a = E.arq(p);
      return '<button type="button" role="tab" class="aba' + (p === S.abaAtiva ? ' ativa' : '') + '" data-caminho="' + u.esc(p) + '" aria-selected="' + (p === S.abaAtiva) + '">' +
        '<span class="ico-arq ' + ({ tsx: 'ico-tsx', ts: 'ico-ts', json: 'ico-json', css: 'ico-css', md: 'ico-md', js: 'ico-js' }[E.lang(p)] || 'ico-md') + '">' + ({ tsx: 'TSX', ts: 'TS', json: '{ }', css: '#', md: 'M', js: 'JS' }[E.lang(p)] || 'TXT') + '</span>' +
        u.esc(u.nomeArquivo(p)) + (a && a.sujo ? '<span class="ponto" title="Não salvo"></span>' : '<span class="fechar"></span>') + '</button>';
    }).join('');
    const p = S.abaAtiva;
    u.$('#migalhas').innerHTML = p ? p.split('/').map((s) => u.esc(s)).join(u.icone('i-seta-dir', '')) : '';
    u.$('#nome-janela').textContent = (p ? u.nomeArquivo(p) + ' · ' : '') + 'lista-de-tarefas';
  }

  function renderStatus() {
    const S = SIM.S;
    const p = S.abaAtiva;
    let ln = 1, col = 1;
    if (p && S.digitando && S.digitando.path === p) {
      const lista = listaExibicao(p);
      ln = lista.findIndex((l) => l.i === S.digitando.i) + 1;
      col = S.digitando.indent.length + S.digitando.pos + 1;
    } else if (p && ui.espiar && ui.espiar.path === p) {
      ln = listaExibicao(p).findIndex((l) => l.i === ui.espiar.i) + 1;
    }
    const total = todosDiagnosticos().length;
    u.$('#status').innerHTML =
      '<span class="remoto">' + u.icone('i-codigo', '') + '</span>' +
      '<span>' + u.icone('i-ramo', '') + 'main</span>' +
      '<span class="erros' + (total ? ' tem' : '') + '">' + u.icone('i-erro', '') + total + ' ' + u.icone('i-aviso', '') + '0</span>' +
      '<span class="direita">' + (p ? '<span>Ln ' + ln + ', Col ' + col + '</span><span>Espaços: 2</span><span>UTF-8</span><span>CRLF</span><span>{ } ' + NOMES_LANG[E.lang(p)] + '</span>' : '') + '</span>';
  }

  function todosDiagnosticos() {
    const S = SIM.S;
    let r = [];
    Object.keys(S.arquivos).forEach((p) => {
      const a = S.arquivos[p];
      if (a.existe && a.versao === 'final' && SIM.arquivos[p] && SIM.arquivos[p].final) r = r.concat(E.diagnosticos(p, 'editor').map((d) => Object.assign({ path: p }, d)));
    });
    return r;
  }

  function renderProblemas() {
    const ds = todosDiagnosticos();
    const c = u.$('#cont-problemas');
    c.textContent = ds.length;
    c.classList.toggle('tem', ds.length > 0);
    u.$('#painel-problemas').innerHTML = ds.length
      ? ds.map((d) => {
        const lista = E.visiveis(d.path);
        const ln = lista.findIndex((l) => l.i === d.i) + 1;
        return '<div class="prob-item" data-caminho="' + u.esc(d.path) + '"><span class="x">' + u.icone('i-erro', 'icone') + '</span><span>' + u.esc(d.msg) + '</span><span class="onde">' + u.esc(u.nomeArquivo(d.path)) + ' [Ln ' + ln + ', Col ' + (d.col + 1) + ']</span></div>';
      }).join('')
      : '<div class="prob-vazio">Nenhum problema foi detectado no espaço de trabalho.</div>';
  }

  function render() {
    if (!SIM.S) return;
    renderAbas();
    renderConteudo();
    renderStatus();
    renderProblemas();
    SIM.fluxo && SIM.fluxo.atualizarDestaque && SIM.fluxo.atualizarDestaque();
  }

  // ---------- IntelliSense ----------
  function montarPool() {
    if (pool) return pool;
    const set = new Set(['View', 'Text', 'TextInput', 'TouchableOpacity', 'SafeAreaView', 'FlatList', 'ScrollView', 'Pressable', 'Image', 'StyleSheet', 'Alert', 'Platform', 'useState', 'useEffect', 'useContext', 'useCallback', 'useMemo', 'useRef', 'createContext', 'Stack', 'Tabs', 'Link', 'Slot', 'Redirect', 'useRouter']);
    Object.keys(SIM.arquivos).forEach((p) => {
      const def = SIM.arquivos[p];
      ['modelo', 'final'].forEach((v) => {
        if (!def[v] || !/^(tsx|ts|js)$/.test(def.lang)) return;
        SIM.sintaxe.tokenizar(def[v].join('\n'), def.lang).forEach((l) => l.forEach((t) => { if (t.id && t.id.length >= 3) set.add(t.id); }));
      });
    });
    return (pool = Array.from(set).sort((a, b) => a.localeCompare(b)));
  }
  function calcularSugestao() {
    const d = SIM.S.digitando;
    ui.sug = null;
    if (!d || d.pos >= d.alvo.length) return;
    const alvo = d.alvo;
    if (!u.ehIdent(alvo[d.pos])) return;
    let ini = d.pos;
    while (ini > 0 && u.ehIdent(alvo[ini - 1])) ini--;
    let fim = d.pos;
    while (fim < alvo.length && u.ehIdent(alvo[fim])) fim++;
    const palavra = alvo.slice(ini, fim);
    const digitado = alvo.slice(ini, d.pos);
    if (digitado.length < 2 || palavra.length < 4 || /^\d/.test(palavra)) return;
    if (d.limite && fim > d.limite) return;
    const antesPonto = ini > 0 && alvo[ini - 1] === '.';
    const tipo = alvo[fim] === '(' ? 'f' : /^[A-Z]/.test(palavra) ? 'c' : antesPonto ? 'p' : 'v';
    const outros = montarPool().filter((x) => x !== palavra && x.toLowerCase().startsWith(digitado.toLowerCase())).slice(0, 3);
    ui.sug = { palavra, ini, fim, digitado, itens: [palavra].concat(outros), tipo };
  }
  function posicionarSugestoes() {
    let box = u.$('#sugestoes');
    calcularSugestao();
    const cur = u.$('#cursor');
    if (!ui.sug || !cur) { if (box) box.remove(); return; }
    if (!box) { box = document.createElement('div'); box.id = 'sugestoes'; box.className = 'sugestoes'; box.setAttribute('role', 'listbox'); coluna().appendChild(box); }
    const rot = { f: ['f', 'função'], c: ['c', 'componente ou tipo'], p: ['p', 'propriedade'], v: ['v', 'variável'] };
    box.innerHTML = ui.sug.itens.map((x, k) => {
      const tipo = k === 0 ? ui.sug.tipo : /^[A-Z]/.test(x) ? 'c' : 'v';
      return '<div class="sug-item' + (k === 0 ? ' ativo' : '') + '" data-k="' + k + '" role="option"><span class="sug-tipo ' + rot[tipo][0] + '">' + rot[tipo][0].toUpperCase() + '</span><span><b>' + u.esc(x.slice(0, ui.sug.digitado.length)) + '</b>' + u.esc(x.slice(ui.sug.digitado.length)) + '</span>' + (k === 0 ? '<span class="sug-detalhe">' + rot[tipo][1] + '</span>' : '') + '</div>';
    }).join('') + '<div class="sug-rodape">Aperte <kbd>Tab</kbd> ou <kbd>Enter</kbd> para completar</div>';
    const r = relativo(cur);
    box.style.left = Math.max(8, r.x - ui.sug.digitado.length * 8) + 'px';
    box.style.top = r.b + 4 + 'px';
  }
  function aceitarSugestao() {
    const d = SIM.S.digitando;
    if (!ui.sug || !d) return false;
    d.pos = ui.sug.fim;
    ui.errosSeguidos = 0;
    SIM.sons.tocar('linha');
    if (d.pos >= (d.limite || d.alvo.length)) { finalizarLinha(); return true; }
    render();
    return true;
  }

  // ---------- digitação ----------
  function finalizarLinha() {
    const S = SIM.S;
    const d = S.digitando;
    if (!d) return;
    const F = E.finais(d.path);
    S.digitando = null;
    E.definir(d.path, d.i, F[d.i - 1]);
    ui.novas = [d.i];
    (d.fecha || []).forEach((j) => { E.definir(d.path, j, F[j - 1]); ui.novas.push(j); });
    ui.errosSeguidos = 0;
    removerDicaLetra();
    SIM.sons.tocar('linha');
    render();
    SIM.explorador.render();
    SIM.fluxo.evento('linha-completa', { path: d.path, i: d.i });
  }

  function mostrarDicaLetra() {
    const cur = u.$('#cursor');
    const d = SIM.S.digitando;
    if (!cur || !d) return;
    let c = d.alvo[d.pos];
    const nome = c === ' ' ? 'espaço' : c;
    let caixa = /[A-Za-zÀ-ú]/.test(c) ? (c === c.toUpperCase() ? ' (maiúscula)' : ' (minúscula)') : '';
    let b = u.$('#dica-letra');
    if (!b) { b = document.createElement('div'); b.id = 'dica-letra'; b.className = 'dica-letra'; coluna().appendChild(b); }
    b.innerHTML = 'Próximo caractere: <kbd>' + u.esc(nome) + '</kbd>' + caixa;
    const r = relativo(cur);
    b.style.left = Math.max(8, r.x - 20) + 'px';
    b.style.top = r.y - 30 + 'px';
  }
  function removerDicaLetra() { const b = u.$('#dica-letra'); if (b) b.remove(); }

  function digitarCaractere(ch) {
    const S = SIM.S;
    const d = S.digitando;
    if (!d) return;
    if (S.abaAtiva !== d.path) {
      u.toast('Volte para a aba **' + u.nomeArquivo(d.path) + '** para digitar.');
      SIM.sons.tocar('erro');
      return;
    }
    const esperado = d.alvo[d.pos];
    if (ch === esperado || (esperado === ' ' && ch === ' ')) {
      d.pos++;
      ui.errosSeguidos = 0;
      removerDicaLetra();
      SIM.sons.tocar('tecla');
      E.arq(d.path).slots[d.i] = d.indent + d.alvo.slice(0, d.pos);
      E.arq(d.path).sujo = true;
      if (d.pos >= (d.limite || d.alvo.length)) { finalizarLinha(); return; }
      renderConteudo();
      renderStatus();
      u.mostrarDentro(u.$('#cursor'), u.$('#editor'), 76);
    } else {
      ui.errosSeguidos++;
      ui.letraErrada = ch;
      SIM.sons.tocar('erro');
      renderConteudo();
      if (ui.errosSeguidos >= 3) mostrarDicaLetra();
    }
  }

  // ---------- Quick Fix ----------
  function abrirQuickFix(ancora) {
    const S = SIM.S;
    const path = S.abaAtiva;
    if (!path) return;
    const diags = E.diagnosticos(path, 'editor');
    if (!diags.length) { u.toast('Não há nada sublinhado em vermelho neste arquivo.'); return; }
    const imps = diags.filter((d) => d.tipo === 'import');
    const nomes = Array.from(new Set(imps.map((d) => d.nome)));
    const mods = Array.from(new Set(imps.map((d) => d.spec.modulo)));
    const itens = [];
    if (nomes.length > 1) itens.push({ acao: 'todas', txt: 'Adicionar todas as importações ausentes' });
    mods.forEach((m) => {
      const nn = imps.filter((d) => d.spec.modulo === m).map((d) => d.nome);
      itens.push({ acao: 'modulo', modulo: m, txt: 'Adicionar importação de "' + m + '"' + (mods.length > 1 || nomes.length > 1 ? ' (' + Array.from(new Set(nn)).join(', ') + ')' : '') });
    });
    diags.filter((d) => d.tipo === 'nome').forEach((d) => {
      if (!itens.some((x) => x.nome === d.nome)) itens.push({ acao: 'declarar', nome: d.nome, txt: 'Adicionar declaração de função ausente "' + d.nome + '"' });
    });
    itens.push({ acao: 'ignorar', txt: 'Ignorar este erro (@ts-ignore)' });
    itens.push({ acao: 'desligar', txt: 'Desabilitar a verificação deste arquivo (@ts-nocheck)' });
    const anc0 = ancora || u.$('#editor .lampada') || u.$('#editor .sq');
    if (anc0) {
      const edR = u.$('#editor').getBoundingClientRect();
      const aR = anc0.getBoundingClientRect();
      if (aR.top < edR.top || aR.bottom > edR.bottom) { ui.ignorarScroll = performance.now(); anc0.scrollIntoView({ block: 'center' }); }
    }
    ui.qf = { itens };
    let box = u.$('#menu-qf');
    if (!box) { box = document.createElement('div'); box.id = 'menu-qf'; box.className = 'menu-qf'; box.setAttribute('role', 'menu'); coluna().appendChild(box); }
    // A opção que resolve tudo de uma vez é a "certa" (pisca quando o passo pede a Correção rápida).
    const kCerto = itens.findIndex((it) => it.acao === 'todas') >= 0 ? itens.findIndex((it) => it.acao === 'todas') : itens.findIndex((it) => it.acao === 'modulo');
    box.innerHTML = '<div class="qf-titulo">Correção rápida</div>' + itens.map((it, k) => '<div class="qf-item" role="menuitem" data-k="' + k + '"' + (k === kCerto ? ' data-certo' : '') + '>' + u.icone('i-lampada', '') + u.esc(it.txt) + '</div>').join('');
    const anc = ancora || u.$('#editor .lampada') || u.$('#editor .sq');
    if (anc) {
      const r = relativo(anc);
      const alt = box.offsetHeight;
      const H = coluna().clientHeight;
      let topo = r.b + 4;
      if (topo + alt > H - 4) topo = Math.max(4, r.y - alt - 4);
      box.style.left = Math.max(8, Math.min(r.x, coluna().clientWidth - box.offsetWidth - 8)) + 'px';
      box.style.top = topo + 'px';
    } else { box.style.left = '60px'; box.style.top = '60px'; }
    SIM.sons.tocar('clique');
    SIM.fluxo.evento('qf-aberto', { path });
    // O holofote do tutorial passa da lâmpada para o menu, para as opções ficarem à vista.
    SIM.fluxo.atualizarDestaque();
  }
  function fecharMenuQF() {
    const m = u.$('#menu-qf');
    if (!m) return;
    m.remove();
    ui.qf = null;
    SIM.fluxo.atualizarDestaque();
  }
  function escolherQuickFix(k) {
    const it = ui.qf && ui.qf.itens[k];
    const path = SIM.S.abaAtiva;
    fecharPopups();
    if (!it) return;
    if (it.acao === 'ignorar' || it.acao === 'desligar') {
      SIM.fluxo.erroModal('Esconder o erro não resolve',
        (it.acao === 'ignorar' ? 'O `@ts-ignore` só esconde o aviso do editor.' : 'O `@ts-nocheck` desliga a verificação do arquivo inteiro.') +
        ' O app continuaria sem saber de onde vem esse nome e quebraria no celular com um erro na tela. A correção certa é importar o nome do lugar onde ele foi criado.');
      return;
    }
    if (it.acao === 'declarar') {
      SIM.fluxo.erroModal('Vamos escrever essa função nós mesmos',
        'Esse atalho criaria uma função vazia no fim do arquivo, sem nada dentro. Aqui a ideia é entender cada linha: siga o **Faça agora** para escrever a função `' + it.nome + '` no lugar certo.');
      return;
    }
    const mudou = E.aplicarImports(path, it.acao === 'modulo' ? it.modulo : null);
    ui.novas = mudou;
    SIM.sons.tocar('acerto');
    render();
    SIM.explorador.render();
    SIM.fluxo.evento('qf', { path, acao: it.acao, linhas: mudou });
  }

  // ---------- Ctrl+clique (ir para a definição) ----------
  function definicao(chave) {
    if (chave.startsWith('comp:')) {
      const nome = chave.slice(5);
      const path = COMPONENTES[nome];
      if (!path || !E.existe(path)) return null;
      const de = E.declaracoes(path)[nome] || 1;
      return { path, de, ate: de };
    }
    const [obj, prop] = chave.split('.');
    const path = 'src/styles/styles.ts';
    if (!E.existe(path)) return null;
    const F = E.finais(path, 'final');
    let ini = F.findIndex((t) => new RegExp('^export const ' + obj + '\\b').test(t));
    if (ini < 0) return null;
    for (let k = ini + 1; k < F.length; k++) {
      if (/^\S/.test(F[k])) break;
      if (new RegExp('^  ' + prop + ':').test(F[k])) {
        let ate = k;
        if (/\{\s*$/.test(F[k])) { while (ate < F.length && !/^  \},?\s*$/.test(F[ate])) ate++; }
        return { path, de: k + 1, ate: ate + 1 };
      }
    }
    return null;
  }
  function irParaDefinicao(chave) {
    const def = definicao(chave);
    if (!def) { u.toast('Esse item ainda não existe no projeto.'); return; }
    if (!E.tem(def.path, def.de)) { u.toast('Essa parte do arquivo ainda não foi escrita.'); return; }
    abrir(def.path, { silencioso: true });
    ui.realceDef = def;
    render();
    const linha = u.$('#editor .ed-linha[data-i="' + def.de + '"]');
    if (linha) linha.scrollIntoView({ block: 'center' });
    SIM.sons.tocar('clique');
    SIM.fluxo.evento('ctrlclique', { chave, path: def.path });
    setTimeout(() => { if (ui.realceDef === def) { ui.realceDef = null; renderConteudo(); } }, 6000);
  }

  // ---------- hover (cartão de conceito e erros) ----------
  function mostrarHover(alvo) {
    let box = u.$('#vs-hover');
    let html = '';
    if (alvo.dataset.diag) {
      const d = E.diagnosticos(SIM.S.abaAtiva, 'editor').find((x) => x.nome === alvo.dataset.diag);
      if (d) html = '<div class="h-erro">' + u.esc(d.msg) + '</div><span class="h-acao" data-acao="qf">Correção rápida (Ctrl+.)</span>';
    }
    if (!html && alvo.dataset.g) {
      const g = alvo.dataset.g;
      if (g.startsWith('estilo:')) {
        const p = g.slice(7);
        html = '<div class="h-titulo">' + u.esc(p) + '</div><div>' + u.md(SIM.estilosProps[p]) + '</div>';
      } else {
        const e = SIM.glossario[g];
        if (e) html = '<div class="h-titulo">' + u.esc(e.t || g) + '</div><div>' + u.md(e.d) + '</div>';
      }
      if (alvo.dataset.def) html += '<div style="margin-top:6px;color:#9a9a9a;font-size:0.9em">Segure <kbd>Ctrl</kbd> e clique para ver onde foi criado.</div>';
    }
    if (!html) return;
    if (!box) { box = document.createElement('div'); box.id = 'vs-hover'; box.className = 'vs-hover'; coluna().appendChild(box); box.addEventListener('mouseleave', esconderHover); box.addEventListener('click', (e) => { if (e.target.closest('[data-acao="qf"]')) { esconderHover(); abrirQuickFix(alvo); } }); }
    box.innerHTML = html;
    const r = relativo(alvo);
    box.style.left = Math.max(8, Math.min(r.x, coluna().clientWidth - 450)) + 'px';
    const acima = r.y > 160;
    box.style.top = (acima ? r.y - box.offsetHeight - 6 : r.b + 6) + 'px';
  }
  function esconderHover() { const b = u.$('#vs-hover'); if (b) b.remove(); }

  function fecharPopups() {
    esconderHover();
    fecharMenuQF();
  }

  // ---------- eventos do mouse ----------
  function clique(ev) {
    const S = SIM.S;
    if (ev.target.closest('[data-acao="qf"]')) { abrirQuickFix(ev.target.closest('[data-acao="qf"]')); return; }
    const btn = ev.target.closest('[data-porque]');
    if (btn) { SIM.porque.acao(btn.dataset.porque, btn); return; }
    if (ev.target.closest('.espiar')) return;
    const def = ev.target.closest('[data-def]');
    if (def && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); irParaDefinicao(def.dataset.def); return; }
    const linha = ev.target.closest('.ed-linha');
    if (!linha) return;
    const i = Number(linha.dataset.i);
    if (!i) return;
    if (S.digitando && S.digitando.path === S.abaAtiva && S.digitando.i === i) return;
    if (linha.querySelector('.fantasma') && !E.tem(S.abaAtiva, i)) return;
    SIM.porque.abrirLinha(S.abaAtiva, i);
  }

  SIM.editor = {
    ui,
    abrir,
    render,
    renderConteudo,
    finalizarLinha,
    aceitarSugestao,
    abrirQuickFix,
    escolherQuickFix,
    irParaDefinicao,
    fecharPopups,
    todosDiagnosticos,
    listaExibicao,
    removerDicaLetra,
    // Teclado do editor. Devolve true quando a tecla foi usada.
    teclar(ev) {
      const S = SIM.S;
      const ctrl = ev.ctrlKey || ev.metaKey;
      if (ui.qf) {
        if (ev.key === 'Escape') { fecharPopups(); return true; }
        if (ev.key === 'Enter') { escolherQuickFix(0); return true; }
      }
      if (ctrl && (ev.key === '.' || ev.code === 'Period')) { abrirQuickFix(); return true; }
      if (ctrl && ev.key === 'Enter' && S.digitando) { S.digitando.pos = S.digitando.limite || S.digitando.alvo.length; finalizarLinha(); return true; }
      if (ctrl && (ev.key === 'a' || ev.key === 'A')) {
        if (S.abaAtiva) { S.selecaoTotal = true; renderConteudo(); SIM.fluxo.evento('selecionou-tudo', { path: S.abaAtiva }); }
        return true;
      }
      if ((ev.key === 'Delete' || ev.key === 'Backspace') && S.selecaoTotal) {
        const passo = SIM.fluxo.passoAtual();
        S.selecaoTotal = false;
        if (passo && passo.t === 'limpar' && passo.a === S.abaAtiva) {
          E.limpar(S.abaAtiva);
          SIM.sons.tocar('tab');
          render();
          SIM.explorador.render();
          SIM.fluxo.evento('limpou', { path: S.abaAtiva });
        } else {
          u.toast('Neste momento não precisamos apagar este arquivo. Siga o **Faça agora**.');
          renderConteudo();
        }
        return true;
      }
      if (ev.key === 'Escape') {
        if (ui.espiar && ui.espiar.modo === 'linha') { ui.espiar = null; renderConteudo(); return true; }
        if (S.selecaoTotal) { S.selecaoTotal = false; renderConteudo(); return true; }
        removerDicaLetra();
        return true;
      }
      if (S.digitando) {
        if ((ev.key === 'Tab' || ev.key === 'Enter') && ui.sug) { aceitarSugestao(); return true; }
        if (ev.key === 'Tab') { u.toast('Nesta linha você digita. O **Tab** completa uma sugestão quando ela aparece, ou escreve as linhas cinza com o selo Tab.'); return true; }
        if (ev.key === 'Enter' || ev.key === 'Backspace') return true;
        if (ev.key.length === 1 && !ctrl && !ev.altKey) { if (S.selecaoTotal) { S.selecaoTotal = false; } digitarCaractere(ev.key); return true; }
        return false;
      }
      if (S.tabPendente && ev.key === 'Tab') {
        if (S.abaAtiva !== S.tabPendente.path) { u.toast('Volte para a aba **' + u.nomeArquivo(S.tabPendente.path) + '**.'); return true; }
        SIM.fluxo.evento('tab', { path: S.tabPendente.path });
        return true;
      }
      if (ev.key === 'Tab') return true;
      return false;
    },
    iniciar() {
      const ed = u.$('#editor');
      ed.addEventListener('click', clique);
      coluna().addEventListener('click', (ev) => {
        const item = ev.target.closest('.qf-item');
        if (item) { escolherQuickFix(Number(item.dataset.k)); return; }
        const sug = ev.target.closest('.sug-item');
        if (sug) {
          if (Number(sug.dataset.k) === 0) aceitarSugestao();
          else { SIM.sons.tocar('erro'); u.toast('Essa sugestão não é a do texto cinza. Escolha a primeira da lista.'); }
          return;
        }
        const rb = ev.target.closest('[data-resumo]');
        if (rb && ui.resumo) { const cb = ui.resumo.aoOk; ui.resumo = null; ui.realceBloco = null; render(); if (cb) cb(); }
        if (!ev.target.closest('.menu-qf') && !ev.target.closest('[data-acao="qf"]')) fecharMenuQF();
      });
      ed.addEventListener('mouseover', (ev) => {
        const alvo = ev.target.closest('[data-g],[data-diag]');
        clearTimeout(ui.hoverTimer);
        if (alvo) ui.hoverTimer = setTimeout(() => mostrarHover(alvo), 350);
      });
      ed.addEventListener('mouseout', (ev) => {
        clearTimeout(ui.hoverTimer);
        const para = ev.relatedTarget;
        if (para && para.closest && para.closest('#vs-hover')) return;
        setTimeout(() => { const b = u.$('#vs-hover'); if (b && !b.matches(':hover')) b.remove(); }, 250);
      });
      ed.addEventListener('scroll', () => {
        esconderHover();
        if (!(ui.ignorarScroll && performance.now() - ui.ignorarScroll < 400)) fecharMenuQF();
        posicionarSugestoes();
      });
      document.addEventListener('keydown', (e) => { if (e.key === 'Control' || e.key === 'Meta') ed.classList.add('ctrl-ativo'); });
      document.addEventListener('keyup', (e) => { if (e.key === 'Control' || e.key === 'Meta') ed.classList.remove('ctrl-ativo'); });
      window.addEventListener('blur', () => ed.classList.remove('ctrl-ativo'));
      u.$('#abas').addEventListener('click', (ev) => {
        const b = ev.target.closest('.aba');
        if (b) { SIM.sons.tocar('clique'); abrir(b.dataset.caminho); }
      });
      u.$('#painel-problemas').addEventListener('click', (ev) => {
        const it = ev.target.closest('.prob-item');
        if (it) abrir(it.dataset.caminho);
      });
    },
  };
})();
