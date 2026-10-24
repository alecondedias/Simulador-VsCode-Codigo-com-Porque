/* Cartões do porquê: explicação linha por linha, leitura guiada do modelo, experimentos "E se" e resumo de cada bloco. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const E = SIM.estado;
  const cacheFecha = {};

  function chave(path) { const a = E.arq(path); return (a ? a.versao : 'final') + ':' + path; }
  function dados(path) { return (SIM.explicacoes || {})[chave(path)] || null; }
  function unidades(path) { const d = dados(path); return (d && d.unidades) || []; }
  function unidadeDe(path, i) { return unidades(path).find((x) => i >= x.de && i <= x.ate) || null; }

  // Número que a linha tem agora na tela (as linhas aparecem aos poucos, então o número muda).
  function numeroExibido(path, i) {
    const lista = SIM.editor.listaExibicao(path);
    const k = lista.findIndex((l) => l.i === i);
    return k >= 0 ? k + 1 : i;
  }

  // Para cada linha de fechamento, descobre a linha que abriu o bloco.
  function mapaFechamentos(path) {
    const k = chave(path);
    if (cacheFecha[k]) return cacheFecha[k];
    const F = E.finais(path);
    const toks = SIM.sintaxe.tokenizar(F.join('\n'), E.lang(path));
    const pilhaB = [];
    const pilhaT = [];
    const mapa = {};
    toks.forEach((linha, li) => {
      linha.forEach((p, k2) => {
        if (/^t-b/.test(p.c)) {
          if ('([{'.includes(p.t)) pilhaB.push(li + 1);
          else { const ab = pilhaB.pop(); if (mapa[li + 1] == null && ab) mapa[li + 1] = ab; }
        } else if (p.c === 't-ang') {
          if (p.t === '<') pilhaT.push(li + 1);
          else if (p.t === '/>' || p.t === '</') { const ab = pilhaT.pop(); if (mapa[li + 1] == null && ab) mapa[li + 1] = ab; if (p.t === '</') pilhaT.pop(); }
        }
      });
    });
    return (cacheFecha[k] = mapa);
  }

  function explicarValor(v) {
    let m;
    const st = SIM.celular.avaliarEstilos('editor') || {};
    if ((m = /^colors\.(\w+)/.exec(v))) return 'Usa a cor `colors.' + m[1] + '` do design system' + (st.colors && st.colors[m[1]] ? ' (' + st.colors[m[1]] + ')' : '') + '. Se essa cor mudar no styles.ts, muda aqui também.';
    if ((m = /^spacing\.(\w+)/.exec(v))) return 'Usa o espaçamento `spacing.' + m[1] + '`' + (st.spacing && st.spacing[m[1]] != null ? ' (' + st.spacing[m[1]] + ' pontos)' : '') + ', um dos tamanhos padronizados do design system.';
    if ((m = /^fontSize\.(\w+)/.exec(v))) return 'Usa o tamanho de fonte `fontSize.' + m[1] + '`' + (st.fontSize && st.fontSize[m[1]] != null ? ' (' + st.fontSize[m[1]] + ')' : '') + ' do design system.';
    if ((m = /^Spacing\.(\w+)/.exec(v))) return 'Usa o espaçamento `Spacing.' + m[1] + '` do tema do modelo (src/constants/theme.ts).';
    if (/^-?\d+(\.\d+)?$/.test(v)) return 'O valor é ' + v + (/^(0|1)$/.test(v) ? '.' : ' (em pontos da tela, uma medida que se adapta ao tamanho do celular).');
    if ((m = /^["'](.*)["']$/.exec(v))) {
      const t = m[1];
      const VE = SIM.valoresEstilo || {};
      return VE[t] ? 'O valor `' + t + '` quer dizer: ' + VE[t] + '.' : 'O valor é `' + t + '`.';
    }
    return 'O valor é `' + v + '`.';
  }

  function regra(path, i) {
    const F = E.finais(path);
    const t = F[i - 1] || '';
    const tt = t.trim();
    if (!tt) return { o: 'Linha em branco.', p: 'Só separa partes do código para facilitar a leitura. O app ignora linhas em branco.' };
    if (/^(\/\/|\/\*|\*|\{\/\*)/.test(tt)) {
      const recado = tt.replace(/^\{?\/\*+|\*+\/\}?$|^\/\/|^\*/g, '').trim();
      return { o: 'Comentário: um recado para quem lê o código.', p: 'O computador ignora comentários.' + (recado ? ' Aqui o recado diz: "' + recado.replace(/\s+-\s+/g, ', ') + '".' : '') };
    }
    const fecha = mapaFechamentos(path);
    if (/^([)\]}]+[;,)]*|<\/[\w.]+>|\/>|\);|\)\s*:\s*\(|>)$/.test(tt) && fecha[i]) {
      return { o: 'Fecha o que foi aberto na linha ' + numeroExibido(path, fecha[i]) + '.', p: 'Todo bloco aberto com parêntese, colchete, chave ou tag precisa ser fechado. Sem esta linha o código fica incompleto e o app não roda.' };
    }
    let m;
    if ((m = /^(\w+):\s*"(#[0-9A-Fa-f]{3,8})",\s*\/\/\s*(.*)$/.exec(tt))) {
      return { o: 'Guarda a cor `' + m[1] + '` com o código `' + m[2] + '`.', p: 'O comentário diz para que ela serve: ' + m[3].replace(/\s+-\s+/g, ', ') + '. As telas usam o nome `colors.' + m[1] + '` em vez de repetir o código da cor.' };
    }
    if ((m = /^(\w+):\s*\{$/.exec(tt))) {
      return { o: 'Começa o estilo `' + m[1] + '`.', p: 'Tudo entre as chaves descreve a aparência desse estilo. Depois, um componente usa `styles.' + m[1] + '` para ficar com essa cara.' };
    }
    if ((m = /^(\w+):\s*(.+?),?$/.exec(tt))) {
      const prop = m[1];
      const valor = m[2].replace(/,$/, '');
      const P = SIM.estilosProps || {};
      if (P[prop]) return { o: '`' + prop + '`: ' + P[prop], p: explicarValor(valor) };
      if (/^\d+$/.test(valor)) return { o: 'Guarda o valor `' + prop + '` = ' + valor + '.', p: 'Fica com um nome fácil de lembrar para ser usado nas telas, sempre igual em todo o app.' };
    }
    if ((m = /^import\s+(.+)\s+from\s+["'](.+)["']/.exec(tt))) {
      return { o: 'Traz ' + m[1].replace(/[{}]/g, '').trim().replace(/\s+/g, ' ') + ' de `' + m[2] + '`.', p: 'Sem importar, este arquivo não saberia o que são esses nomes. O import é como pegar uma ferramenta emprestada de outra caixa.' };
    }
    return { o: 'Esta linha faz parte do trecho ao redor.', p: 'Clique nas linhas vizinhas para ver a explicação do trecho completo.' };
  }

  function explicacao(path, i) {
    const un = unidadeDe(path, i);
    if (un) return un;
    return regra(path, i);
  }

  function htmlEspiar(path, i, modo) {
    const S = SIM.S;
    const passo = SIM.fluxo.passoAtual();
    if (modo === 'ese' && passo && passo.t === 'ese') return htmlExperimento(passo);
    const un = unidadeDe(path, i);
    const ex = explicacao(path, i);
    const n = numeroExibido(path, un && modo === 'tour' ? un.de : i);
    const tour = modo === 'tour';
    let titulo;
    if (tour && un) {
      const ate = numeroExibido(path, un.ate);
      titulo = un.de === un.ate ? 'Linha ' + n : 'Linhas ' + n + ' a ' + ate;
    } else titulo = S.digitando && S.digitando.i === i && S.digitando.path === path ? 'Por que a linha ' + n + '?' : 'Linha ' + n;
    let rodape = '';
    if (tour) {
      const lista = unidades(path);
      const k = lista.indexOf(un);
      const lidos = (S.lidos[path] || []).length;
      rodape = '<div class="espiar-rodape">' +
        (k > 0 ? '<button type="button" class="botao pequeno" data-porque="anterior">' + u.icone('i-voltar') + 'Anterior</button>' : '') +
        (k < lista.length - 1 ? '<button type="button" class="botao gelo pequeno" data-porque="proximo" id="btn-proximo-trecho">Próximo trecho ' + u.icone('i-seta-dir') + '</button>' : '<span style="color:#9fd0ff;font-weight:600">' + u.icone('i-check') + ' Último trecho do arquivo</span>') +
        (un && un.alvo ? '<button type="button" class="botao pequeno" data-porque="mostrar">' + u.icone('i-olho') + 'Mostrar no celular</button>' : '') +
        '<span class="nota">Trecho ' + (k + 1) + ' de ' + lista.length + ' · lidos ' + lidos + '</span></div>';
    } else if (ex.ese && passo && passo.t === 'ese') {
      rodape = '';
    }
    return '<div class="espiar' + (tour ? ' tour' : '') + '" role="note">' +
      '<div class="espiar-cab">' + u.icone('i-lampada', '') + '<span class="titulo">' + u.esc(titulo) + '</span><button type="button" class="fechar" data-porque="fechar" aria-label="Fechar explicação">' + u.icone('i-x', '') + '</button></div>' +
      '<div class="espiar-corpo"><p><span class="rot">O que faz:</span>' + u.md(ex.o) + '</p><p><span class="rot">' + (tour ? 'Por que existe:' : 'Por que precisamos:') + '</span>' + u.md(ex.p) + '</p></div>' + rodape + '</div>';
  }

  function htmlExperimento(passo) {
    const S = SIM.S;
    const feito = S.cel.experimento === passo.id || (passo.id === 'web' && S.cel.modo === 'web');
    const n = numeroExibido(passo.a, passo.l);
    const txt = (feito ? passo.depois : passo.antes).replace(/\{n\}/g, n);
    return '<div class="espiar experimento" role="note">' +
      '<div class="espiar-cab">' + u.icone('i-frasco', '') + '<span class="titulo">' + u.esc(passo.titulo) + '</span></div>' +
      '<div class="espiar-corpo"><p>' + u.md(txt) + '</p></div>' +
      '<div class="espiar-rodape">' + (feito
        ? '<button type="button" class="botao primario pequeno" data-porque="ese-voltar" id="btn-ese-voltar">' + u.icone('i-voltar') + 'Voltar ao normal</button>'
        : '<button type="button" class="botao primario pequeno" data-porque="ese" id="btn-ese">' + u.icone('i-frasco') + 'Ver o que acontece</button>') +
      '<span class="nota">Experimento: o seu código não muda.</span></div></div>';
  }

  function marcarLido(path, un) {
    const S = SIM.S;
    const lista = unidades(path);
    const k = lista.indexOf(un);
    if (k < 0) return;
    S.lidos[path] = S.lidos[path] || [];
    if (!S.lidos[path].includes(k)) S.lidos[path].push(k);
    if (un.alvo) setTimeout(() => SIM.celular.destacar(un.alvo), 60);
    const passo = SIM.fluxo.passoAtual();
    if (passo && passo.t === 'ler' && passo.a === path && S.lidos[path].length >= lista.length) SIM.fluxo.evento('leitura-completa', { path });
  }

  function abrirUnidade(path, un) {
    const ui = SIM.editor.ui;
    ui.espiar = { path, i: un.de, modo: 'tour' };
    SIM.editor.renderConteudo();
    u.$('#editor').scrollLeft = 0;
    const el = u.$('#editor .espiar');
    if (el) u.mostrarDentro(el, u.$('#editor'));
    marcarLido(path, un);
    SIM.fluxo.atualizarDestaque();
  }

  function abrirLinha(path, i) {
    const ui = SIM.editor.ui;
    const a = E.arq(path);
    const un = unidadeDe(path, i);
    SIM.sons.tocar('clique');
    if (a.versao === 'modelo' && un) { abrirUnidade(path, un); return; }
    ui.espiar = { path, i, modo: 'linha' };
    SIM.editor.renderConteudo();
    u.$('#editor').scrollLeft = 0;
    SIM.fluxo.evento('explicacao-aberta', { path, i });
  }

  function acao(nome) {
    const S = SIM.S;
    const ui = SIM.editor.ui;
    const path = S.abaAtiva;
    if (nome === 'fechar') {
      ui.espiar = null;
      SIM.editor.renderConteudo();
      SIM.fluxo.atualizarDestaque();
      return;
    }
    if (nome === 'proximo' || nome === 'anterior') {
      const lista = unidades(path);
      const atual = unidadeDe(path, ui.espiar ? ui.espiar.i : 1);
      let k = lista.indexOf(atual) + (nome === 'proximo' ? 1 : -1);
      k = Math.max(0, Math.min(lista.length - 1, k));
      SIM.sons.tocar('clique');
      abrirUnidade(path, lista[k]);
      return;
    }
    if (nome === 'mostrar') {
      const un = unidadeDe(path, ui.espiar.i);
      if (un && un.alvo) SIM.celular.destacar(un.alvo, true);
      return;
    }
    if (nome === 'ese' || nome === 'ese-voltar') SIM.fluxo.evento(nome === 'ese' ? 'ese-ver' : 'ese-voltar', {});
  }

  function htmlResumo(r) {
    const funcs = (r.funcoes || []).map((f) => '<dt>' + u.esc(f.nome) + '</dt><dd>' + u.md(f.texto) + '</dd>').join('');
    return '<div class="rb-topo">' + u.icone('i-check') + (r.rotulo || 'Bloco pronto') + '</div>' +
      '<div class="rb-titulo">' + u.esc(r.titulo) + '</div>' +
      '<p class="rb-oque"><strong>' + (r.rotulo === 'Arquivo lido' ? 'O que este arquivo faz:' : 'O que este bloco faz:') + '</strong> ' + u.md(r.oque) + '</p>' +
      (funcs ? '<p class="rb-sub">Para que serve cada função e comando</p><dl>' + funcs + '</dl>' : '') +
      '<div class="rb-acoes"><span class="nota">' + u.md(r.nota || '') + '</span><button type="button" class="botao primario" data-resumo="ok" id="btn-entendi">' + u.icone('i-check') + (r.botao || 'Entendi, continuar') + '</button></div>';
  }

  SIM.porque = {
    unidades,
    unidadeDe,
    explicacao,
    htmlEspiar,
    htmlResumo,
    abrirLinha,
    abrirUnidade,
    acao,
    numeroExibido,
    dados,
    mostrarResumo(r, aoOk) {
      const ui = SIM.editor.ui;
      ui.resumo = Object.assign({}, r, { aoOk });
      if (r.linhas && r.path) ui.realceBloco = { path: r.path, de: r.linhas[0], ate: r.linhas[1] };
      SIM.sons.tocar('bloco');
      SIM.editor.render();
    },
  };
})();
