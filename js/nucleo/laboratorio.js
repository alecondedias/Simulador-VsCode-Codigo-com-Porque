/* Laboratório de estilos: troca cores, tamanhos de letra e espaços do styles.ts só no celular,
   para o aluno ver o design system em ação. O código do aluno nunca muda; fechar desfaz tudo. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const E = SIM.estado;
  const ESTILOS = 'src/styles/styles.ts';
  const GRUPOS = [
    { id: 'colors', titulo: 'Cores', tipo: 'cor' },
    { id: 'fontSize', titulo: 'Tamanhos de letra', tipo: 'numero', min: 8, max: 40, unidade: '' },
    { id: 'spacing', titulo: 'Espaços', tipo: 'numero', min: 0, max: 48, unidade: '' },
  ];
  let aberto = false;
  let valores = {};
  let focoChave = null;

  // ---------- leitura do styles.ts salvo ----------
  function linhasSalvas() {
    if (!E.existe(ESTILOS)) return [];
    const si = E.salvoInfo(ESTILOS);
    return si.linhas().filter((l) => l.i !== si.parcial).map((l) => l.t);
  }
  // Comentário de cada cor (ex.: "Azul - ação primária" vira "Azul, ação primária").
  function comentarios() {
    const r = {};
    linhasSalvas().forEach((t) => {
      const m = /^\s{2}(\w+):\s*"[^"]*",\s*\/\/\s*(.*)$/.exec(t);
      if (m) r[m[1]] = m[2].replace(/\s+-\s+/g, ', ');
    });
    return r;
  }
  // Onde cada valor aparece: 'colors.primary' -> ['buttonPrimary', 'checkboxChecked', ...]
  function usos() {
    const r = {};
    let estilo = null;
    let dentro = false;
    linhasSalvas().forEach((t) => {
      if (/StyleSheet\.create\(\{/.test(t)) { dentro = true; return; }
      if (!dentro) return;
      const m = /^\s{2}(\w+):\s*\{/.exec(t);
      if (m) estilo = m[1];
      const re = /\b(colors|fontSize|spacing)\.(\w+)/g;
      let x;
      while ((x = re.exec(t))) {
        const k = x[1] + '.' + x[2];
        r[k] = r[k] || [];
        if (estilo && !r[k].includes(estilo)) r[k].push(estilo);
      }
    });
    return r;
  }
  // Usos diretos nos componentes (ex.: `padding: spacing.lg` no HomeScreen.tsx).
  const COMPONENTES = ['src/app/index.tsx', 'src/screens/HomeScreen.tsx', 'src/components/TaskInput.tsx', 'src/components/TaskItem.tsx', 'src/components/TaskList.tsx'];
  function usosDiretos() {
    const r = {};
    COMPONENTES.forEach((p) => {
      if (!E.existe(p)) return;
      const si = E.salvoInfo(p);
      if (!si.existe) return;
      si.linhas().forEach((l) => {
        if (/^\s*import\b/.test(l.t)) return;
        const re = /\b(colors|fontSize|spacing)\.(\w+)/g;
        let x;
        while ((x = re.exec(l.t))) {
          const k = x[1] + '.' + x[2];
          const n = u.nomeArquivo(p);
          r[k] = r[k] || [];
          if (!r[k].includes(n)) r[k].push(n);
        }
      });
    });
    return r;
  }
  // Valores originais, lidos do código salvo (sem o laboratório).
  function originais() {
    return SIM.celular.avaliarEstilos('salvo', { semLab: true }) || {};
  }

  // Reescreve o texto do styles.ts trocando só os valores testados. Usado pelo celular.
  function aplicar(codigo) {
    if (!aberto || !Object.keys(valores).length) return codigo;
    let grupo = null;
    return codigo.split('\n').map((l) => {
      const g = /^(?:export\s+)?const\s+(colors|fontSize|spacing)\s*=\s*\{/.exec(l);
      if (g) { grupo = g[1]; return l; }
      if (!grupo) return l;
      if (/^\s*\};?\s*$/.test(l)) { grupo = null; return l; }
      const m = /^(\s*)(\w+)(\s*:\s*)("[^"]*"|-?\d+(?:\.\d+)?)(.*)$/.exec(l);
      if (!m) return l;
      const k = grupo + '.' + m[2];
      if (!(k in valores)) return l;
      const v = valores[k];
      return m[1] + m[2] + m[3] + (typeof v === 'number' ? String(v) : JSON.stringify(v)) + m[5];
    }).join('\n');
  }

  // ---------- painel ----------
  function hex6(c) {
    const s = String(c || '').trim();
    if (/^#[0-9a-f]{6}$/i.test(s)) return s.toLowerCase();
    if (/^#[0-9a-f]{3}$/i.test(s)) return ('#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]).toLowerCase();
    return '#000000';
  }
  function textoUso(est, arq) {
    const e = (est || []).length;
    const a = (arq || []).length;
    const te = e === 1 ? '1 estilo' : e + ' estilos';
    const ta = a === 1 ? '1 arquivo' : a + ' arquivos';
    if (e && a) return te + ' e ' + ta;
    if (e) return te;
    if (a) return ta;
    return 'ainda sem uso';
  }
  function linhaHtml(g, nome, orig, com, uso, diretos) {
    const k = g.id + '.' + nome;
    const atual = k in valores ? valores[k] : orig;
    const mudou = k in valores && valores[k] !== orig;
    const id = 'lab-' + g.id + '-' + nome;
    const campo = g.tipo === 'cor'
      ? '<input type="color" id="' + id + '" value="' + hex6(atual) + '">'
      : '<input type="range" id="' + id + '" min="' + g.min + '" max="' + g.max + '" step="1" value="' + Number(atual) + '">';
    const valorTxt = g.tipo === 'cor' ? String(atual).toUpperCase() : String(atual);
    return '<div class="lab-linha' + (mudou ? ' mudou' : '') + '" data-chave="' + k + '">' +
      '<label for="' + id + '"><b>' + u.esc(nome) + '</b><small>' + (com ? u.esc(com) + ' · ' : '') + textoUso(uso[k], diretos[k]) + '</small></label>' +
      campo +
      '<code class="lab-valor">' + u.esc(valorTxt) + '</code>' +
      '<button type="button" class="lab-desfazer" data-desfazer="' + k + '" title="Voltar ao valor do código"' + (mudou ? '' : ' hidden') + '>' + u.icone('i-recomecar', '') + '<span class="sr">Voltar ao valor do código</span></button>' +
      '</div>';
  }
  function juntar(itens) {
    return itens.length > 1 ? itens.slice(0, -1).join(', ') + ' e ' + itens[itens.length - 1] : itens.join('');
  }
  function htmlUso(k) {
    if (!k) return 'Passe o mouse num valor para ver onde ele é usado.';
    const est = (usos()[k] || []).map((s) => '<code>styles.' + u.esc(s) + '</code>');
    const arq = (usosDiretos()[k] || []).map((n) => '<code>' + u.esc(n) + '</code>');
    const nome = '<code>' + u.esc(k) + '</code>';
    if (!est.length && !arq.length) return nome + ' ainda não é usado em nenhum lugar, então mudar o valor não muda nada na tela.';
    const onde = est.length && arq.length ? est.join(', ') + ' e também direto no ' + juntar(arq)
      : est.length ? juntar(est) : 'direto no ' + juntar(arq);
    return nome + ' aparece em ' + onde + '. Mudar o valor muda ' + (est.length + arq.length > 1 ? 'todos esses lugares de uma vez.' : 'esse lugar.');
  }
  function render() {
    const box = u.$('#laboratorio');
    if (!box) return;
    box.hidden = !aberto;
    if (!aberto) { box.innerHTML = ''; return; }
    const o = originais();
    const com = comentarios();
    const uso = usos();
    const diretos = usosDiretos();
    const qtd = Object.keys(valores).filter((k) => {
      const [g, n] = k.split('.');
      return o[g] && valores[k] !== o[g][n];
    }).length;
    box.innerHTML =
      '<div class="lab-cab">' + u.icone('i-ajustes', '') + '<strong>Laboratório de estilos</strong>' +
      '<button type="button" class="lab-x" id="lab-x" title="Fechar o laboratório">' + u.icone('i-x', '') + '<span class="sr">Fechar o laboratório</span></button></div>' +
      '<p class="lab-intro">Mude um valor do <code>styles.ts</code> e veja o app inteiro mudar junto. O seu código não muda: fechar o laboratório desfaz os testes.</p>' +
      '<div class="lab-corpo">' + GRUPOS.map((g) => {
        const obj = o[g.id];
        if (!obj) return '';
        return '<section class="lab-grupo"><h4>' + g.titulo + ' <code>' + g.id + '</code></h4>' +
          Object.keys(obj).map((n) => linhaHtml(g, n, obj[n], g.id === 'colors' ? com[n] : '', uso, diretos)).join('') + '</section>';
      }).join('') + '</div>' +
      '<div class="lab-uso" id="lab-uso">' + htmlUso(focoChave) + '</div>' +
      '<div class="lab-acoes"><span class="lab-conta">' + (qtd ? qtd + (qtd === 1 ? ' valor de teste' : ' valores de teste') : 'Nenhum valor mudado') + '</span>' +
      '<button type="button" class="botao pequeno" id="lab-desfazer-tudo"' + (qtd ? '' : ' disabled') + '>' + u.icone('i-recomecar') + 'Desfazer tudo</button>' +
      '<button type="button" class="botao primario pequeno" id="lab-fechar">Fechar</button></div>';
  }
  function atualizarLinha(k) {
    const o = originais();
    const [g, n] = k.split('.');
    const orig = o[g] ? o[g][n] : undefined;
    const el = u.$('#laboratorio [data-chave="' + k + '"]');
    if (!el) return;
    const mudou = k in valores && valores[k] !== orig;
    el.classList.toggle('mudou', mudou);
    const v = k in valores ? valores[k] : orig;
    el.querySelector('.lab-valor').textContent = g === 'colors' ? String(v).toUpperCase() : String(v);
    el.querySelector('.lab-desfazer').hidden = !mudou;
    const qtd = Object.keys(valores).filter((c) => { const [a, b] = c.split('.'); return o[a] && valores[c] !== o[a][b]; }).length;
    const conta = u.$('#laboratorio .lab-conta');
    if (conta) conta.textContent = qtd ? qtd + (qtd === 1 ? ' valor de teste' : ' valores de teste') : 'Nenhum valor mudado';
    const bt = u.$('#lab-desfazer-tudo');
    if (bt) bt.disabled = !qtd;
  }
  function mostrarUso(k) {
    if (k === focoChave) return;
    focoChave = k;
    const el = u.$('#lab-uso');
    if (el) el.innerHTML = htmlUso(k);
  }

  // ---------- ações ----------
  function abrir() {
    if (aberto || !disponivel()) return;
    aberto = true;
    valores = {};
    focoChave = null;
    SIM.lado.mostrarAba('celular');
    render();
    SIM.celular.render();
    SIM.sons.tocar('clique');
    SIM.fluxo.evento('cel', { acao: 'lab-abriu' });
    SIM.fluxo.atualizarDestaque();
    const primeiro = u.$('#laboratorio input');
    if (primeiro) primeiro.focus({ preventScroll: true });
  }
  function fechar(silencioso) {
    if (!aberto) return;
    aberto = false;
    valores = {};
    focoChave = null;
    render();
    SIM.celular.render();
    if (!silencioso) {
      SIM.sons.tocar('clique');
      SIM.fluxo.evento('cel', { acao: 'lab-fechou' });
    }
    SIM.fluxo.atualizarDestaque();
  }
  function mudar(k, v) {
    valores[k] = v;
    atualizarLinha(k);
    mostrarUso(k);
    SIM.celular.render();
    SIM.fluxo.evento('cel', { acao: 'lab-mudou', chave: k });
  }
  function disponivel() {
    return SIM.celular.labDisponivel();
  }

  function iniciar() {
    const box = u.$('#laboratorio');
    box.addEventListener('input', (ev) => {
      const linha = ev.target.closest('.lab-linha');
      if (!linha) return;
      const k = linha.dataset.chave;
      const v = ev.target.type === 'color' ? ev.target.value.toUpperCase() : Number(ev.target.value);
      mudar(k, v);
    });
    box.addEventListener('click', (ev) => {
      if (ev.target.closest('#lab-x') || ev.target.closest('#lab-fechar')) { fechar(); return; }
      if (ev.target.closest('#lab-desfazer-tudo')) {
        valores = {};
        render();
        SIM.celular.render();
        SIM.sons.tocar('clique');
        return;
      }
      const d = ev.target.closest('[data-desfazer]');
      if (d) {
        const k = d.dataset.desfazer;
        delete valores[k];
        const [g, n] = k.split('.');
        const o = originais();
        const inp = u.$('#laboratorio [data-chave="' + k + '"] input');
        if (inp && o[g]) inp.value = g === 'colors' ? hex6(o[g][n]) : Number(o[g][n]);
        atualizarLinha(k);
        SIM.celular.render();
        SIM.sons.tocar('clique');
      }
    });
    box.addEventListener('mouseover', (ev) => {
      const linha = ev.target.closest('.lab-linha');
      if (linha) mostrarUso(linha.dataset.chave);
    });
    box.addEventListener('focusin', (ev) => {
      const linha = ev.target.closest('.lab-linha');
      if (linha) mostrarUso(linha.dataset.chave);
    });
    box.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); fechar(); } });
  }

  SIM.lab = {
    iniciar,
    abrir,
    fechar,
    alternar() { if (aberto) fechar(); else abrir(); },
    ativo: () => aberto,
    disponivel,
    aplicar,
  };
})();
