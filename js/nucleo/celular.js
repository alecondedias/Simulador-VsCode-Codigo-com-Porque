/* Celular de teste: Expo Go, app de exemplo do Expo e o app Lista de Tarefas.
   O que aparece aqui é calculado a partir do código SALVO: o celular obedece ao que foi escrito. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const E = SIM.estado;
  const LAYOUT = 'src/app/_layout.tsx';
  const INDEX = 'src/app/index.tsx';
  const HOME = 'src/screens/HomeScreen.tsx';
  const INPUT = 'src/components/TaskInput.tsx';
  const ESTILOS = 'src/styles/styles.ts';
  let ultimoErro = '';
  let cacheEstilos = { chave: '', valor: null };
  let timers = [];

  // ---------- estilos reais do styles.ts ----------
  // Lê o styles.ts sem usar eval: um leitor pequeno que entende só o que esse arquivo usa
  // (const com objetos, textos, números, referências como colors.primary e StyleSheet.create).
  function lerEstilosTS(codigo) {
    const toks = [];
    const n = codigo.length;
    let i = 0;
    while (i < n) {
      const c = codigo[i];
      if (/\s/.test(c)) { i++; continue; }
      if (c === '/' && codigo[i + 1] === '/') { while (i < n && codigo[i] !== '\n') i++; continue; }
      if (c === '/' && codigo[i + 1] === '*') { const f = codigo.indexOf('*/', i + 2); if (f < 0) throw new Error('comentário aberto'); i = f + 2; continue; }
      if (c === '"' || c === "'") {
        let j = i + 1;
        let txt = '';
        while (j < n && codigo[j] !== c) { if (codigo[j] === '\\') { txt += codigo[j + 1]; j += 2; } else { txt += codigo[j]; j++; } }
        if (j >= n) throw new Error('texto aberto');
        toks.push({ t: 'txt', v: txt });
        i = j + 1;
        continue;
      }
      const num = /^\d+(?:\.\d+)?/.exec(codigo.slice(i, i + 24));
      if (num) { toks.push({ t: 'num', v: Number(num[0]) }); i += num[0].length; continue; }
      const id = /^[A-Za-z_$][\w$]*/.exec(codigo.slice(i, i + 64));
      if (id) { toks.push({ t: 'id', v: id[0] }); i += id[0].length; continue; }
      if (codigo.startsWith('...', i)) { toks.push({ t: 'p', v: '...' }); i += 3; continue; }
      if ('{}()[]:,;.=-'.includes(c)) { toks.push({ t: 'p', v: c }); i++; continue; }
      throw new Error('caractere inesperado');
    }
    const amb = { StyleSheet: { absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 } } };
    let k = 0;
    const eh = (v) => !!toks[k] && toks[k].t !== 'txt' && toks[k].v === v;
    const pegar = (v) => { if (!eh(v)) throw new Error('esperava ' + v); k++; };
    function objeto() {
      pegar('{');
      const o = {};
      while (!eh('}')) {
        if (eh('...')) { k++; Object.assign(o, valor()); }
        else {
          const ch = toks[k++];
          if (!ch || ch.t === 'p') throw new Error('chave');
          pegar(':');
          o[ch.v] = valor();
        }
        if (eh(',')) k++; else break;
      }
      pegar('}');
      return o;
    }
    function valor() {
      const tk = toks[k];
      if (!tk) throw new Error('fim inesperado');
      if (tk.t === 'txt' || tk.t === 'num') { k++; return tk.v; }
      if (tk.t === 'p') {
        if (tk.v === '{') return objeto();
        if (tk.v === '-') { k++; const x = valor(); if (typeof x !== 'number') throw new Error('número'); return -x; }
        if (tk.v === '[') {
          k++;
          const lista = [];
          while (!eh(']')) { lista.push(valor()); if (eh(',')) k++; else break; }
          pegar(']');
          return lista;
        }
        throw new Error('valor inesperado');
      }
      k++;
      if (tk.v === 'true') return true;
      if (tk.v === 'false') return false;
      if (tk.v === 'null') return null;
      if (!(tk.v in amb)) throw new Error(tk.v + ' não existe');
      let atual = amb[tk.v];
      let nome = tk.v;
      while (eh('.')) {
        k++;
        const p = toks[k++];
        if (!p || p.t !== 'id') throw new Error('nome');
        nome += '.' + p.v;
        atual = atual == null ? undefined : atual[p.v];
      }
      if (eh('(')) {
        k++;
        const arg = valor();
        pegar(')');
        if (nome === 'StyleSheet.create') return arg;
        throw new Error('função desconhecida');
      }
      return atual;
    }
    while (k < toks.length) {
      if (eh(';')) { k++; continue; }
      if (eh('export')) k++;
      if (!(eh('const') || eh('let'))) throw new Error('comando inesperado');
      k++;
      const nome = toks[k++];
      if (!nome || nome.t !== 'id') throw new Error('nome');
      pegar('=');
      amb[nome.v] = valor();
    }
    return amb;
  }

  function avaliarEstilos(fonte, opcoes) {
    if (!E.existe(ESTILOS)) return null;
    let linhas;
    if (fonte === 'salvo') {
      const si = E.salvoInfo(ESTILOS);
      linhas = si.linhas().filter((l) => l.i !== si.parcial);
    } else {
      const S = SIM.S;
      linhas = E.visiveis(ESTILOS).filter((l) => !(S.digitando && S.digitando.path === ESTILOS && S.digitando.i === l.i));
    }
    let codigo = linhas.map((l) => l.t).join('\n');
    // No Laboratório de estilos, o celular desenha com os valores de teste (o código do aluno não muda).
    if (fonte === 'salvo' && !(opcoes && opcoes.semLab) && SIM.lab && SIM.lab.ativo()) codigo = SIM.lab.aplicar(codigo);
    if (codigo === cacheEstilos.chave) return cacheEstilos.valor;
    let valor = null;
    try {
      const amb = lerEstilosTS(codigo.replace(/^import[^\n]*$/gm, ''));
      valor = { colors: amb.colors || null, fontSize: amb.fontSize || null, spacing: amb.spacing || null, styles: amb.styles || null };
    } catch (e) { valor = null; }
    cacheEstilos = { chave: codigo, valor };
    return valor;
  }

  const px = (v) => (typeof v === 'number' ? v + 'px' : v);
  function css() {
    const o = Object.assign({}, ...Array.from(arguments).filter(Boolean));
    const out = [];
    if (o.borderWidth != null || o.borderBottomWidth != null) out.push('border-color:#000');
    Object.keys(o).forEach((k) => {
      const v = o[k];
      if (v == null || typeof v === 'object') return;
      switch (k) {
        case 'flex': out.push('flex:' + v + ' ' + (v > 0 ? 1 : 0) + ' 0%;min-height:0'); break;
        case 'paddingHorizontal': out.push('padding-left:' + px(v) + ';padding-right:' + px(v)); break;
        case 'paddingVertical': out.push('padding-top:' + px(v) + ';padding-bottom:' + px(v)); break;
        case 'marginHorizontal': out.push('margin-left:' + px(v) + ';margin-right:' + px(v)); break;
        case 'marginVertical': out.push('margin-top:' + px(v) + ';margin-bottom:' + px(v)); break;
        case 'borderWidth': out.push('border-width:' + px(v) + ';border-style:solid'); break;
        case 'borderBottomWidth': out.push('border-bottom-width:' + px(v) + ';border-bottom-style:solid'); break;
        default: out.push(k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()) + ':' + px(v));
      }
    });
    return out.join(';');
  }

  // ---------- erros (tela do LogBox) ----------
  function textoEntreTags(t) { const m = />([^<]*)</.exec(t || ''); return m ? m[1] : ''; }
  function atributo(t, nome) { const m = new RegExp(nome + '="([^"]*)"').exec(t || ''); return m ? m[1] : ''; }

  function verificarErros(cadeia) {
    const S = SIM.S;
    const C = S.cel;
    // código pela metade salvo
    for (const p of cadeia) {
      const si = E.salvoInfo(p);
      if (si.existe && si.parcial) {
        const lista = si.linhas();
        const ln = lista.findIndex((l) => l.i === si.parcial) + 1;
        return { tipo: 'Syntax Error', sintaxe: true, msg: p + ': Unexpected token (' + ln + ':' + ((si.texto(si.parcial) || '').length + 1) + ')', cod: (si.texto(si.parcial) || '').trim(), nota: 'Você salvou no meio de uma linha. Termine de digitar e salve de novo.' };
      }
    }
    // módulo que não existe
    const imps = [
      [INDEX, 1, HOME, '../screens/HomeScreen'],
      [HOME, 2, INPUT, '../components/TaskInput'],
      [HOME, 3, ESTILOS, '../styles/styles'],
      [INPUT, 3, ESTILOS, '../styles/styles'],
    ];
    for (const [de, linha, para, mod] of imps) {
      if (!cadeia.includes(de)) continue;
      const si = E.salvoInfo(de);
      if (si.versao !== 'final') continue;
      const t = si.texto(linha);
      if (t && E.lerImport(t) && !E.existe(para)) return { tipo: 'Build Error', msg: 'Unable to resolve module ' + mod + ' from ' + de + ': None of these files exist:\n  * ' + para.replace(/\.tsx?$/, '') + '(.native|.android.js|.js|.tsx|.ts)', cod: t, nota: 'O import aponta para um arquivo que ainda não existe no disco.' };
    }
    // nomes usados sem import (ReferenceError em tempo de execução)
    for (const p of cadeia) {
      if (!SIM.arquivos[p].final) continue;
      const si = E.salvoInfo(p);
      if (si.versao !== 'final') continue;
      const d = E.diagnosticos(p, 'salvo').find((x) => !E.TIPO_SO.has(x.nome));
      if (d) return { tipo: 'Render Error', msg: "Property '" + d.nome + "' doesn't exist", cod: (si.texto(d.i) || '').trim(), nota: 'O arquivo ' + u.nomeArquivo(p) + ' usa `' + d.nome + '` sem importar nem criar esse nome.' };
    }
    // componente importado que o outro arquivo não exporta
    const exportacoes = [
      [INDEX, 4, HOME, 5, 'Index'],
      [HOME, 10, INPUT, 5, 'HomeScreen'],
    ];
    for (const [de, linhaUso, para, linhaExport, dono] of exportacoes) {
      if (!cadeia.includes(de)) continue;
      const si = E.salvoInfo(de);
      if (si.versao !== 'final' || !si.has(linhaUso)) continue;
      const sp = E.salvoInfo(para);
      if (!sp.has(linhaExport) || C.experimento === 'import-sem-chaves') {
        return { tipo: 'Render Error', msg: 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it\'s defined in, or you might have mixed up default and named imports.\n\nCheck the render method of `' + dono + '`.', cod: (si.texto(linhaUso) || '').trim(), nota: '' };
      }
    }
    if (C.experimento === 'import-sem-chaves') return { tipo: 'Render Error', msg: 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it\'s defined in, or you might have mixed up default and named imports.\n\nCheck the render method of `Index`.', cod: 'import HomeScreen from "../screens/HomeScreen";', nota: '' };
    if (C.experimento === 'sem-import-stack') return { tipo: 'Render Error', msg: "Property 'Stack' doesn't exist", cod: '<Stack>', nota: '' };
    if (C.experimento === 'tasklist-sem-provider') return { tipo: 'Render Error', msg: 'Error: TaskList deve estar dentro de TaskProvider', cod: 'throw new Error("TaskList deve estar dentro de TaskProvider");', nota: '' };
    return null;
  }

  function telaErro(e) {
    const chave = e.tipo + e.msg;
    if (chave !== ultimoErro) { ultimoErro = chave; SIM.terminal.erro(e.msg.split('\n')[0]); }
    return '<div class="logbox' + (e.sintaxe ? ' sintaxe' : '') + '" data-alvo="m-tela">' +
      '<div class="logbox-topo"><span>Log 1 of 1</span><span>&#9664; &#9654;</span></div>' +
      '<div class="logbox-corpo"><div class="logbox-tipo">' + u.esc(e.tipo) + '</div><div class="logbox-msg">' + u.esc(e.msg) + '</div>' +
      (e.cod ? '<div class="logbox-sec">Source</div><div class="logbox-cod"><span class="marca">&gt;</span> ' + u.esc(e.cod) + '</div>' : '') +
      (e.nota ? '<div class="logbox-sec" style="color:#ffb38a">' + u.md(e.nota) + '</div>' : '') +
      '</div><div class="logbox-rodape"><span>Dismiss</span><span>Minimize</span></div></div>';
  }

  // ---------- desenhos ----------
  function barraStatus(cls) {
    return '<div class="cel-status ' + (cls || '') + '"><span>10:35</span><span class="icones">' + u.icone('i-sinal', '') + u.icone('i-wifi', '') + u.icone('i-bateria', '') + '</span></div>';
  }
  const logo = () => '<svg viewBox="0 0 24 24"><use href="#i-logo-app"/></svg>';

  function expoGo() {
    const C = SIM.S.cel;
    return barraStatus() + '<div class="cel-app"><div class="eg"><h1>Expo Go</h1>' +
      '<div class="eg-sec">Development servers</div><div class="eg-card">' +
      (C.metroLigado ? '<button type="button" class="eg-linha" data-cel="escanear"><span class="eg-servidor" style="padding:0"><i></i></span>lista-de-tarefas</button>' : '<div class="eg-vazio">Start a local development server with <b>npx expo start</b>, then scan the QR code.</div>') +
      '<button type="button" class="eg-linha" data-cel="escanear" data-alvo="escanear">' + u.icone('i-qr', '') + 'Scan QR code</button>' +
      '<div class="eg-linha" style="color:#687076">' + u.icone('i-link', '') + 'Enter URL manually</div></div>' +
      '<div class="eg-sec">Recently opened</div><div class="eg-card"><div class="eg-vazio">No projects yet</div></div></div></div><div class="cel-nav"><i></i></div>';
  }
  function camera() {
    const m = SIM.terminal.qr();
    let cel = '';
    for (let y = 2; y < 23; y++) for (let x = 2; x < 23; x++) cel += '<i class="' + (m[y][x] ? 'p' : '') + '"></i>';
    return barraStatus('escuro') + '<div class="cel-app"><div class="camera"><div class="mira"><div class="qr-mini">' + cel + '</div></div><div class="cam-txt">Lendo o QR code...</div></div></div><div class="cel-nav escuro"><i></i></div>';
  }
  function carregando() {
    return barraStatus() + '<div class="cel-app"><div class="carregando"><div class="icone-app">' + u.icone('i-logo-app', '') + '</div><div class="nome">lista-de-tarefas</div><div class="barra"><span>Bundling</span><div class="trilho"><div class="enche"></div></div></div></div></div><div class="cel-nav"><i></i></div>';
  }

  function iconeAnimado() {
    return '<div class="m-icone" data-alvo="m-icone"><div class="m-icone-brilho" data-alvo="m-icone-brilho"></div><div class="m-icone-fundo" data-alvo="m-icone-fundo"></div><div class="m-icone-logo" data-alvo="m-icone-logo">' + logo() + '</div></div>';
  }
  function homeModelo(web) {
    return '<div class="m-home">' +
      '<div class="m-hero">' + iconeAnimado() + '<div class="m-titulo" data-alvo="m-titulo">Welcome to&nbsp;Expo</div></div>' +
      '<div class="m-get-started" data-alvo="m-get-started">get started</div>' +
      '<div class="m-dicas" data-alvo="m-dicas">' +
      '<div class="m-dica" data-alvo="m-dica-1"><span class="m-dica-titulo" data-alvo="m-dica-titulo">Try editing</span><span class="m-dica-codigo" data-alvo="m-dica-codigo"><span class="cd">src/app/index.tsx</span></span></div>' +
      '<div class="m-dica" data-alvo="m-dica-2"><span class="m-dica-titulo" data-alvo="m-dica-titulo">Dev tools</span><span class="m-dica-codigo" data-alvo="m-dica-codigo">' + (web ? 'use browser devtools' : 'shake device or press <span class="cd">m</span> in terminal') + '</span></div>' +
      '<div class="m-dica" data-alvo="m-dica-3"><span class="m-dica-titulo" data-alvo="m-dica-titulo">Fresh start</span><span class="m-dica-codigo" data-alvo="m-dica-codigo"><span class="cd">npm run reset-project</span></span></div>' +
      '</div>' + (web ? seloWeb() : '') + '</div>';
  }
  function seloWeb() {
    return '<div class="w-selo" data-alvo="w-selo"><div class="w-versao" data-alvo="w-versao">v57.0.31</div><div class="w-selo-imagem" data-alvo="w-selo-imagem" title="Imagem assets/images/expo-badge.png">' + u.icone('i-imagem', '') + 'expo-badge.png</div></div>';
  }
  function exploreModelo(web) {
    return '<div class="m-explore"' + (web ? ' style="padding-top:40px"' : '') + '><div class="m-explore-topo"><div class="m-sub">Explore</div><div class="m-cinza">This starter app includes example<br>code to help you get started.</div><div class="m-link-btn">Expo documentation ' + u.icone('i-link', '') + '</div></div>' +
      '<div class="m-secoes">' + ['File-based routing', 'Android, iOS, and web support', 'Images', 'Light and dark mode components', 'Animations'].map((t) => '<div class="m-colapso"><i>&#8250;</i>' + t + '</div>').join('') + '</div>' + (web ? seloWeb() : '') + '</div>';
  }
  function appModelo() {
    const C = SIM.S.cel;
    const web = C.modo === 'web';
    const tela = C.aba === 'explore' ? exploreModelo(web) : homeModelo(web);
    const splash = !web && C.splash ? '<div class="m-splash" data-alvo="m-splash"><div class="m-icone-logo" style="animation:none">' + logo() + '</div></div>' : '';
    if (web) {
      return '<div class="cel-app web-modo"><div class="m-tela" data-alvo="m-tela">' +
        '<div class="w-barra" data-alvo="w-barra"><div class="w-barra-dentro"><span class="w-marca" data-alvo="w-marca">Expo Starter</span>' +
        '<button type="button" class="w-aba' + (C.aba !== 'explore' ? ' sel' : '') + '" data-cel="aba-home" data-alvo="w-aba-home">Home</button>' +
        '<button type="button" class="w-aba' + (C.aba === 'explore' ? ' sel' : '') + '" data-cel="aba-explore" data-alvo="w-aba-explore">Explore</button>' +
        '<span class="w-docs" data-alvo="w-docs">Docs ' + u.icone('i-link', '') + '</span></div></div>' + tela + '</div></div>';
    }
    return barraStatus() + '<div class="cel-app"><div class="m-tela" data-alvo="m-tela">' + tela +
      '<div class="m-abas" data-alvo="m-abas">' +
      '<button type="button" class="m-aba' + (C.aba !== 'explore' ? ' sel' : '') + '" data-cel="aba-home" data-alvo="m-aba-home"><span class="m-indicador" data-alvo="m-indicador">' + u.icone('i-casa', '') + '</span>Home</button>' +
      '<button type="button" class="m-aba' + (C.aba === 'explore' ? ' sel' : '') + '" data-cel="aba-explore" data-alvo="m-aba-explore"><span class="m-indicador">' + u.icone('i-bussola', '') + '</span>Explore</button>' +
      '</div>' + splash + '</div></div><div class="cel-nav"><i></i></div>';
  }

  // ---------- app Lista de Tarefas ----------
  function taskInput(st) {
    const S = SIM.S;
    const C = S.cel;
    const T = E.salvoInfo(INPUT);
    if (!T.existe || !T.has(5) || !T.has(22)) return '';
    const s = (st && st.styles) || {};
    const c = (st && st.colors) || {};
    const sp = (st && st.spacing) || {};
    const temView = T.has(23) && T.has(42);
    if (!temView) return '';
    let html = '<div class="rn-view" style="' + css({ backgroundColor: c.white }) + '">';
    const temSecao = T.has(24) && T.has(41);
    if (temSecao) html += '<div class="rn-view" style="' + css(s.section) + '">';
    if (T.has(25)) html += '<div class="rn-texto" style="' + css(s.sectionTitle) + '">' + u.esc(textoEntreTags(T.texto(25))) + '</div>';
    if (T.has(27) && T.has(33)) {
      const estilizado = T.has(28);
      const placeholder = T.has(29) ? atributo(T.texto(29), 'placeholder') : '';
      const corPh = T.has(30) ? c.lightText : '';
      const controlado = T.has(31);
      const travado = controlado && !T.has(32);
      const valor = controlado ? C.taskName : C.campo;
      html += '<div style="position:relative">' + (corPh ? '<style>#campo-rn::placeholder{color:' + corPh + '}</style>' : '') +
        '<input id="campo-rn" class="rn-campo" data-cel="campo" autocomplete="off" spellcheck="false" aria-label="Campo do app" placeholder="' + u.esc(placeholder) + '" value="' + u.esc(valor) + '" style="' + (estilizado ? css(s.input, { marginBottom: sp.md }) + ';border-bottom-color:' + ((s.input || {}).borderColor || '#000') : '') + '">' +
        (travado ? '<svg class="cadeado" aria-hidden="true"><use href="#i-cadeado"/></svg>' : '') + '</div>';
    }
    if (T.has(35) && T.has(38) && T.has(40)) {
      const est = T.has(36) ? css(s.button, s.buttonPrimary) : '';
      const txt = T.has(39) ? '<span class="rn-texto" style="' + css(s.buttonPrimaryText) + '">' + u.esc(textoEntreTags(T.texto(39))) + '</span>' : '';
      html += '<button type="button" class="rn-botao' + (C.pressionado ? ' pressionado' : '') + '" data-cel="botao" style="display:flex;flex-direction:column;' + est + '">' + txt + '</button>';
    }
    if (temSecao) html += '</div>';
    return html + '</div>';
  }

  function listaVazia(st) {
    const s = (st && st.styles) || {};
    const c = (st && st.colors) || {};
    const sp = (st && st.spacing) || {};
    return '<div class="rn-view" style="' + css({ flex: 1, backgroundColor: c.background }) + '"><div style="' + css({ paddingVertical: sp.md }) + '">' +
      '<div class="rn-view" style="' + css(s.emptyContainer) + '">' +
      '<div class="rn-texto" style="' + css(s.emptyText, { fontSize: 16 }) + '">&#128237;</div>' +
      '<div class="rn-texto" style="' + css(s.emptyText, { marginTop: sp.md }) + '">Nenhuma tarefa por aqui!</div>' +
      '<div class="rn-texto" style="' + css(s.emptyText, { marginTop: sp.sm, fontSize: 12 }) + '">Adicione uma nova tarefa acima</div>' +
      '</div></div></div>';
  }

  function homeScreen(st) {
    const C = SIM.S.cel;
    const H = E.salvoInfo(HOME);
    if (!H.existe || !H.has(5) || !H.has(6) || !H.has(7)) return '';
    const s = (st && st.styles) || {};
    const sp = (st && st.spacing) || {};
    let html = '<div class="rn-view" style="flex:1;min-height:0;' + css(s.safeArea) + '">';
    if (H.has(8) && H.has(21)) {
      html += '<div class="rn-view" style="' + css(s.container) + '">';
      if (H.has(10)) html += taskInput(st);
      if (H.has(13) && H.has(15)) html += '<div class="rn-view" style="' + css(s.filterContainer) + '">' + (H.has(14) ? '<div class="rn-texto" style="' + css(s.sectionTitle) + '">' + u.esc(textoEntreTags(H.texto(14))) + '</div>' : '') + '</div>';
      if (H.has(18) && H.has(20)) {
        if (C.experimento === 'tasklist-com-provider') html += listaVazia(st);
        else html += '<div class="rn-view" style="' + css({ flex: 1, padding: sp.lg }) + '">' + (H.has(19) ? '<div class="rn-texto" style="' + css(s.sectionTitle) + '">' + u.esc(textoEntreTags(H.texto(19))) + '</div>' : '') + '</div>';
      }
      html += '</div>';
    }
    return html + '</div>';
  }

  function conteudoIndex(st) {
    const I = E.salvoInfo(INDEX);
    const C = SIM.S.cel;
    if (I.versao === 'modelo') return { html: homeModelo(C.modo === 'web'), modelo: true };
    if (!I.has(3) || C.experimento === 'sem-default') return { unmatched: true };
    if (!I.has(4)) return { html: '' };
    return { html: homeScreen(st) };
  }

  function appNosso() {
    const S = SIM.S;
    const C = S.cel;
    const L = E.salvoInfo(LAYOUT);
    const cadeia = [LAYOUT, INDEX];
    const I = E.salvoInfo(INDEX);
    if (I.versao === 'final' && I.has(4)) cadeia.push(HOME);
    if (E.salvoInfo(HOME).has(10)) cadeia.push(INPUT);
    const erro = verificarErros(cadeia);
    const web = C.modo === 'web';
    if (!erro && cadeia.includes(HOME) && E.salvoInfo(HOME).has(7) && C.tela === 'app') SIM.terminal.aviso('safearea', "SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead. See https://github.com/AppAndFlow/react-native-safe-area-context");
    const alerta = C.alerta && !web ? '<div class="rn-alerta-fundo"><div class="rn-alerta" role="alertdialog"><h3>' + u.esc(C.alerta.titulo) + '</h3><p>' + u.esc(C.alerta.msg) + '</p><div class="acoes"><button type="button" data-cel="ok-alerta">OK</button></div></div></div>' : '';
    const envolver = (miolo) => (web ? '<div class="cel-app">' + miolo + '</div>' : barraStatus() + '<div class="cel-app">' + miolo + alerta + '</div><div class="cel-nav"><i></i></div>');
    if (erro) return envolver(telaErro(erro));
    ultimoErro = '';
    const st = avaliarEstilos('salvo');
    const temStack = L.has(3) && L.has(5) && L.has(7);
    const titulo = L.has(6) ? (/title:\s*"([^"]*)"/.exec(L.texto(6)) || [])[1] || 'index' : 'index';
    const idx = conteudoIndex(st);
    let corpo;
    if (idx.unmatched) corpo = '<div class="unmatched"><h2>Unmatched Route</h2><p>Page could not be found.</p><div class="url">exp://192.168.0.12:8081/--/</div><div class="links"><span>Go back</span><span>Sitemap</span></div></div>';
    else corpo = idx.modelo ? '<div class="m-tela" style="flex:1">' + idx.html + '</div>' : idx.html;
    const cab = temStack && !web ? '<div class="rn-cabecalho' + (C.cabMudou ? ' mudou' : '') + '" data-alvo="cabecalho">' + u.esc(titulo) + '</div>' : temStack && web ? '<div class="rn-cabecalho" data-alvo="cabecalho" style="height:56px;font-size:18px">' + u.esc(titulo) + '</div>' : '';
    C.cabMudou = false;
    return envolver(cab + '<div class="rn-corpo">' + corpo + '</div>');
  }

  function conteudo() {
    const C = SIM.S.cel;
    if (C.tela === 'expogo') return expoGo();
    if (C.tela === 'camera') return camera();
    if (C.tela === 'carregando') return carregando();
    const L = E.salvoInfo(LAYOUT);
    if (L.versao === 'modelo') {
      const erro = null;
      return erro ? telaErro(erro) : appModelo();
    }
    return appNosso();
  }

  // O Laboratório de estilos só faz sentido quando a nossa tela está no celular, desenhada com o styles.ts.
  function labDisponivel() {
    const S = SIM.S;
    if (!S || S.cel.tela !== 'app') return false;
    if (E.salvoInfo(LAYOUT).versao === 'modelo') return false;
    const I = E.salvoInfo(INDEX);
    if (!(I.versao === 'final' && I.has(4) && E.existe(HOME) && E.salvoInfo(HOME).has(8))) return false;
    if (S.cel.experimento) return false;
    const st = avaliarEstilos('salvo', { semLab: true });
    return !!(st && st.colors && st.fontSize && st.spacing && st.styles);
  }

  function ajustarEscala() {
    const tela = u.$('#cel-tela');
    const esc = u.$('#cel-escala');
    if (!tela || !esc) return;
    const k = tela.clientWidth / 360;
    esc.style.transform = 'scale(' + k + ')';
  }

  function render() {
    const S = SIM.S;
    if (!S) return;
    const C = S.cel;
    const cel = u.$('#celular');
    const web = C.modo === 'web' && C.tela === 'app';
    cel.classList.toggle('web', web);
    u.$('#url-navegador').textContent = 'localhost:8081' + (C.aba === 'explore' && E.salvoInfo(LAYOUT).versao === 'modelo' ? '/explore' : '');
    u.$('#cel-escala').innerHTML = conteudo();
    if (SIM.lab && SIM.lab.ativo() && !labDisponivel()) SIM.lab.fechar(true);
    const lab = SIM.lab && SIM.lab.ativo();
    const leg = u.$('#cel-legenda');
    leg.textContent = lab ? 'Laboratório aberto: o celular mostra valores de teste' : web ? 'Navegador (versão web, tecla w no terminal)' : C.tela === 'app' ? 'Celular com Expo Go (atualiza quando você salva)' : 'Celular com Expo Go';
    leg.classList.toggle('lab-ligado', !!lab);
    const ferr = u.$('#cel-ferramentas');
    ferr.innerHTML = C.tela === 'app'
      ? '<button type="button" class="botao pequeno" data-ferr="recarregar">' + u.icone('i-recomecar') + 'Recarregar</button>' +
        '<button type="button" class="botao pequeno" data-ferr="modo">' + u.icone(web ? 'i-sinal' : 'i-codigo') + (web ? 'Ver no celular' : 'Ver na web') + '</button>' +
        (labDisponivel() ? '<button type="button" class="botao pequeno' + (lab ? ' gelo' : '') + '" data-ferr="lab" aria-pressed="' + !!lab + '">' + u.icone('i-ajustes') + 'Laboratório</button>' : '')
      : '';
    ajustarEscala();
    const campo = u.$('#campo-rn');
    if (campo && C.focoCampo) { campo.focus(); const n = campo.value.length; campo.setSelectionRange(n, n); }
    SIM.lado && SIM.lado.renderRaioX();
    // O desenho novo troca os elementos do celular: o destaque do passo atual precisa ser refeito.
    if (SIM.fluxo && SIM.fluxo.atualizarDestaque) SIM.fluxo.atualizarDestaque();
  }

  function alerta(titulo, msg) {
    const C = SIM.S.cel;
    if (C.modo === 'web') return false;
    C.alerta = { titulo, msg };
    SIM.sons.tocar('alerta');
    return true;
  }

  function apertarBotao() {
    const C = SIM.S.cel;
    const T = E.salvoInfo(INPUT);
    C.pressionado = false;
    if (!T.has(37)) { SIM.fluxo.evento('cel', { acao: 'tocou-botao', resultado: 'nada' }); render(); return; }
    if (!(T.has(8) && T.has(20))) { SIM.fluxo.evento('cel', { acao: 'tocou-botao', resultado: 'nada' }); render(); return; }
    const temTrim = T.has(9) && C.experimento !== 'sem-trim';
    const nome = temTrim ? C.taskName.trim() : C.taskName;
    let resultado = 'nada';
    const web = C.modo === 'web';
    if (T.has(11) && T.has(12) && T.has(13) && T.has(14) && !nome) {
      resultado = web ? 'web-sem-alerta' : 'erro';
      alerta('Erro', 'Por favor, digite um nome para a tarefa');
    } else {
      if (T.has(18)) { resultado = web ? 'web-sem-alerta' : 'tarefa'; alerta('Tarefa digitada', nome); }
      if (T.has(19)) { C.taskName = ''; C.campo = ''; }
    }
    render();
    SIM.fluxo.evento('cel', { acao: 'tocou-botao', resultado, nome, limpou: T.has(19) && resultado !== 'erro' });
  }

  function iniciar() {
    const esc = u.$('#cel-escala');
    esc.addEventListener('click', (ev) => {
      const alvo = ev.target.closest('[data-cel]');
      if (!alvo) return;
      const S = SIM.S;
      const C = S.cel;
      const acao = alvo.dataset.cel;
      if (acao === 'escanear') {
        if (!C.metroLigado) { u.toast('Primeiro ligue o servidor com `npx expo start` no terminal.'); SIM.sons.tocar('erro'); return; }
        C.tela = 'camera';
        render();
        SIM.sons.tocar('clique');
        timers.push(setTimeout(() => { C.tela = 'carregando'; render(); }, 1100));
        timers.push(setTimeout(() => {
          C.tela = 'app';
          C.splash = true;
          SIM.terminal.empacotou(1205, 1834);
          render();
          timers.push(setTimeout(() => { C.splash = false; }, 900));
          SIM.fluxo.evento('cel', { acao: 'abriu-app' });
        }, 2500));
        SIM.fluxo.evento('cel', { acao: 'escanear' });
        return;
      }
      if (acao === 'aba-home' || acao === 'aba-explore') {
        C.aba = acao === 'aba-home' ? 'home' : 'explore';
        SIM.sons.tocar('clique');
        render();
        SIM.fluxo.evento('cel', { acao });
        return;
      }
      if (acao === 'botao') { C.pressionado = true; render(); setTimeout(apertarBotao, 120); return; }
      if (acao === 'ok-alerta') { C.alerta = null; render(); SIM.fluxo.evento('cel', { acao: 'ok-alerta' }); return; }
    });
    esc.addEventListener('input', (ev) => {
      if (ev.target.id !== 'campo-rn') return;
      const C = SIM.S.cel;
      const T = E.salvoInfo(INPUT);
      const v = ev.target.value;
      if (T.has(31) && !T.has(32)) {
        ev.target.value = C.taskName;
        u.tremer(ev.target);
        SIM.sons.tocar('erro');
        SIM.fluxo.evento('cel', { acao: 'digitou-travado' });
        return;
      }
      if (T.has(31)) C.taskName = v;
      C.campo = v;
      SIM.lado.renderRaioX();
      SIM.fluxo.evento('cel', { acao: 'digitou', valor: v });
    });
    esc.addEventListener('focusin', (ev) => { if (ev.target.id === 'campo-rn') SIM.S.cel.focoCampo = true; });
    esc.addEventListener('focusout', (ev) => { if (ev.target.id === 'campo-rn') SIM.S.cel.focoCampo = false; });
    u.$('#cel-ferramentas').addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-ferr]');
      if (!b) return;
      const C = SIM.S.cel;
      if (b.dataset.ferr === 'lab') { SIM.lab.alternar(); return; }
      if (b.dataset.ferr === 'recarregar') {
        C.splash = E.salvoInfo(LAYOUT).versao === 'modelo' && C.modo !== 'web';
        C.alerta = null;
        SIM.terminal.log('› Reloading apps', 'term-cinza');
        SIM.terminal.empacotou(1205, 412, C.modo === 'web');
        render();
        setTimeout(() => { C.splash = false; }, 900);
        SIM.fluxo.evento('cel', { acao: 'recarregou' });
      } else {
        C.modo = C.modo === 'web' ? 'android' : 'web';
        C.alerta = null;
        if (C.modo === 'web') SIM.terminal.log('› Opening http://localhost:8081 on Chrome', 'term-cinza');
        SIM.terminal.empacotou(1205, 1650, C.modo === 'web');
        render();
        SIM.fluxo.evento('cel', { acao: 'modo', modo: C.modo });
      }
    });
    window.addEventListener('resize', ajustarEscala);
    if (window.ResizeObserver) new ResizeObserver(ajustarEscala).observe(u.$('#cel-tela'));
  }

  SIM.celular = {
    render,
    iniciar,
    avaliarEstilos,
    labDisponivel,
    css,
    alerta,
    listaVazia,
    // Pisca um elemento do celular (usado pela leitura guiada).
    // explicito: o aluno clicou em "Mostrar no celular" (aí vale explicar quando não há o que mostrar).
    destacar(alvo, explicito) {
      if (!alvo || !SIM.S) return;
      const C = SIM.S.cel;
      if (C.tela !== 'app') return;
      const web = C.modo === 'web';
      const modelo = E.salvoInfo(LAYOUT).versao === 'modelo';
      // A abertura azul dura menos de um segundo: para mostrá-la, o app abre de novo.
      if (alvo === 'm-splash' && modelo) {
        if (web) { if (explicito) u.toast('A abertura azul só aparece no celular. No navegador, o app abre direto.'); return; }
        SIM.celular.recarregarApp();
        return;
      }
      let els = u.$$('[data-alvo~="' + alvo + '"]', u.$('#cel-escala'));
      // Elementos da tela Home: se o aluno estiver na aba Explore, volta para a Home.
      if (!els.length && modelo && C.aba === 'explore' && /^m-(icone|titulo|get-started|dica)/.test(alvo)) {
        C.aba = 'home';
        render();
        els = u.$$('[data-alvo~="' + alvo + '"]', u.$('#cel-escala'));
      }
      if (!els.length) {
        if (explicito) {
          if (/^w-/.test(alvo) && !web) u.toast('Este trecho só aparece na versão web. Clique em **Ver na web**, embaixo do celular.');
          else if (web) u.toast('Este trecho só aparece no celular. Clique em **Ver no celular**, embaixo da tela.');
          else u.toast('Este trecho não está visível na tela agora.');
        }
        return;
      }
      u.$$('.alvo-celular').forEach((e) => e.classList.remove('alvo-celular'));
      els.forEach((e) => { void e.offsetWidth; e.classList.add('alvo-celular'); });
    },
    recarregarApp() {
      const C = SIM.S.cel;
      C.splash = E.salvoInfo(LAYOUT).versao === 'modelo' && C.modo !== 'web';
      render();
      setTimeout(() => { C.splash = false; }, 900);
    },
    // Chamado depois de salvar: o Metro reempacota e o celular atualiza (Fast Refresh).
    aposSalvar(path) {
      const C = SIM.S.cel;
      if (!C.metroLigado) return;
      if (path === LAYOUT) C.cabMudou = true;
      if (C.tela === 'app') {
        SIM.terminal.empacotou(1, null, C.modo === 'web');
        render();
        const tela = u.$('#cel-tela');
        const f = document.createElement('div');
        f.className = 'cel-recarregar';
        tela.appendChild(f);
        setTimeout(() => f.remove(), 500);
      }
    },
    limparTimers() { timers.forEach(clearTimeout); timers = []; },
  };
})();
