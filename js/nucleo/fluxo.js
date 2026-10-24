/* Fluxo das missões: cada passo diz o que fazer ("Faça agora"), espera a ação do aluno e avança.
   Também guarda o histórico para "Voltar uma etapa", as Pausas do porquê e os modais. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const E = SIM.estado;
  let pilha = [];
  let travado = false; // evita concluir o mesmo passo duas vezes

  const F = (SIM.fluxo = {});
  F.passoAtual = () => {
    const S = SIM.S;
    if (!S) return null;
    const m = SIM.missoes[S.missao];
    return m ? m.passos[S.passo] || null : null;
  };
  F.missaoAtual = () => SIM.missoes[SIM.S.missao];

  // ---------- modais ----------
  let aoFecharModal = null;
  F.modal = (html, opts) => {
    const m = u.$('#modal');
    // Com um modal na frente, o holofote do tutorial sai de cena (volta quando o modal fecha).
    if (SIM.tutorial) SIM.tutorial.esconder();
    m.innerHTML = '<div class="modal-caixa ' + ((opts && opts.cls) || '') + '" role="dialog" aria-modal="true">' + html + '</div>';
    m.hidden = false;
    aoFecharModal = (opts && opts.aoFechar) || null;
    const foco = m.querySelector('[data-foco]') || m.querySelector('button');
    if (foco) setTimeout(() => foco.focus(), 30);
    return m.firstChild;
  };
  F.fecharModal = () => {
    const m = u.$('#modal');
    m.hidden = true;
    m.innerHTML = '';
    const cb = aoFecharModal;
    aoFecharModal = null;
    if (cb) cb();
    setTimeout(() => { if (!F.modalAberto()) F.atualizarDestaque(); }, 0);
  };
  F.modalAberto = () => !u.$('#modal').hidden;
  F.erroModal = (titulo, msg, aoOk) => {
    SIM.sons.tocar('erro');
    const caixa = F.modal('<h2>' + u.icone('i-aviso') + u.esc(titulo) + '</h2><p>' + u.md(msg) + '</p><div class="modal-acoes"><button type="button" class="botao primario" data-ok data-foco>OK</button></div>', { cls: 'erro', aoFechar: aoOk });
    u.tremer(caixa);
    caixa.querySelector('[data-ok]').addEventListener('click', F.fecharModal);
  };

  // ---------- textos do "Faça agora" ----------
  function nomeArq(p) { return '`' + u.nomeArquivo(p) + '`'; }
  function textoFaca(p) {
    const S = SIM.S;
    let t = p.faca;
    if (!t) {
      switch (p.t) {
        case 'digitar': t = 'Digite a linha {n} por cima do texto cinza. O cartão logo abaixo explica por que ela existe.'; break;
        case 'tab': t = 'Leia o cartão e aperte **Tab** para escrever ' + (p.d || 'as linhas cinza') + '.'; break;
        case 'salvar': t = 'Salve o ' + nomeArq(p.a) + ' com **Ctrl+S** e olhe o celular.'; break;
        case 'bloco': t = 'Leia o resumo do bloco e clique em **Entendi, continuar**.'; break;
        case 'quickfix': t = 'O VS Code sublinhou nomes em vermelho porque eles ainda não foram importados. Clique na lâmpada amarela (ou aperte **Ctrl+.**) e escolha a correção.'; break;
        case 'abrir': t = 'No Explorador, abra as pastas até chegar em ' + nomeArq(p.a) + ' e clique nele.'; break;
        case 'aba': t = 'Clique na aba ' + nomeArq(p.a) + ', em cima do editor.'; break;
        case 'pasta': t = 'No Explorador, clique na pasta `' + (p.pai || 'lista-de-tarefas') + '` e depois no botão **Nova pasta**. Digite `' + p.nome + '` e aperte Enter.'; break;
        case 'arquivo': t = 'Clique na pasta `' + p.pai + '` e depois no botão **Novo arquivo**. Digite `' + p.nome + '` e aperte Enter.'; break;
        case 'ler': t = 'Leia os trechos de ' + nomeArq(p.a) + ': use **Próximo trecho** no cartão azul (ou clique nas linhas). Os trechos com bolinha ainda não foram lidos.'; break;
        case 'limpar': t = 'Selecione todo o código de ' + nomeArq(p.a) + ' com **Ctrl+A** e apague com **Delete**.'; break;
        case 'ctrlclique': t = 'Segure **Ctrl** e clique na palavra destacada para ver onde esse estilo foi criado.'; break;
        case 'ese': t = 'Clique em **Ver o que acontece** no cartão vermelho e olhe o celular. Depois clique em **Voltar ao normal**.'; break;
        case 'comando': t = 'Clique no terminal, digite `' + p.cmd + '` por cima do texto cinza e aperte **Enter**.'; break;
        case 'terminal-foco': t = 'Clique dentro do terminal, embaixo do editor.'; break;
        case 'pergunta': t = 'Responda a **Pausa do porquê**.'; break;
        default: t = '';
      }
    }
    const n = p.l && p.a ? SIM.porque.numeroExibido(p.a, p.l) : '';
    return t.replace('{n}', n).replace('{arquivo}', p.a ? u.nomeArquivo(p.a) : '');
  }

  function renderFaca() {
    const p = F.passoAtual();
    const box = u.$('#faca-texto');
    const acoes = u.$('#faca-acoes');
    if (!p) { box.innerHTML = ''; acoes.innerHTML = ''; return; }
    box.innerHTML = u.md(textoFaca(p));
    acoes.innerHTML = p.t === 'observar' ? '<button type="button" class="botao primario" id="btn-continuar-passo">' + u.esc(p.botao || 'Continuar') + u.icone('i-seta-dir') + '</button>' : '';
    const fa = u.$('#faca-agora');
    fa.classList.remove('pulso'); void fa.offsetWidth; fa.classList.add('pulso');
  }

  function renderProgresso() {
    const S = SIM.S;
    const m = F.missaoAtual();
    if (!m) return;
    u.$('#pilula-missao').textContent = 'Missão ' + (S.missao + 1) + ' de ' + SIM.missoes.length;
    u.$('#titulo-missao').textContent = m.titulo;
    const total = m.passos.length;
    u.$('#barra-progresso').style.width = Math.round((S.passo / Math.max(1, total - 1)) * 100) + '%';
    u.$('#texto-progresso').textContent = 'passo ' + (S.passo + 1) + ' de ' + total;
    u.$('#cont-cartoes').textContent = S.cartoes.length;
  }

  // ---------- destaque do lugar da ação ----------
  function elementoAlvo(p) {
    const S = SIM.S;
    switch (p.t) {
      case 'comando': return u.$('#term-entrada');
      case 'terminal-foco': return u.$('#painel-terminal');
      case 'celular':
        if (p.acao === 'lab-mudou') return SIM.lab.ativo() ? u.$('#laboratorio [data-chave="' + p.chave + '"] input') : u.$('#cel-ferramentas [data-ferr="lab"]');
        if (p.acao === 'lab-fechou') return u.$('#lab-fechar');
        return p.alvoCel ? u.$(p.alvoCel) : u.$('#celular');
      case 'abrir': return SIM.explorador.elemento(SIM.explorador.proximoClique(p.a));
      case 'aba': return u.$('.aba[data-caminho="' + CSS.escape(p.a) + '"]');
      case 'ler': return u.$('#btn-proximo-trecho') || u.$('#editor .espiar');
      case 'limpar': return u.$('#editor');
      case 'pasta': case 'arquivo': {
        const sel = S.selecionado;
        const pai = sel && !SIM.arquivos[sel] && !/\.png$/.test(sel) && sel !== 'package-lock.json' ? sel : u.pastaDe(sel || '');
        if (u.$('#exp-entrada')) return u.$('#exp-entrada');
        if (pai !== p.pai) return p.pai ? SIM.explorador.elemento(SIM.explorador.proximoClique(p.pai + '/x')) : u.$('.exp-projeto');
        return u.$(p.t === 'pasta' ? '#btn-nova-pasta' : '#btn-novo-arquivo');
      }
      case 'digitar': return S.abaAtiva === p.a ? u.$('#editor .ed-linha.atual') : u.$('.aba[data-caminho="' + CSS.escape(p.a) + '"]');
      case 'tab': return S.abaAtiva === p.a ? (u.$('#editor .selo-tab') || {}).parentElement || null : u.$('.aba[data-caminho="' + CSS.escape(p.a) + '"]');
      case 'bloco': return u.$('#btn-entendi');
      case 'salvar': return u.$('.aba[data-caminho="' + CSS.escape(p.a) + '"]');
      case 'observar': return u.$('#btn-continuar-passo');
      case 'quickfix': return u.$('#menu-qf') || u.$('#editor .lampada');
      case 'ctrlclique': return S.abaAtiva === p.a ? u.$('#editor [data-def="' + p.chave + '"]') : u.$('.aba[data-caminho="' + CSS.escape(p.a) + '"]');
      case 'ese': return u.$('#btn-ese') || u.$('#btn-ese-voltar');
      // Um arquivo só: o holofote vai nele. Vários: o holofote mostra a árvore inteira e o próximo clique pisca.
      case 'excluir': return p.alvos.length > 1 ? u.$('#arvore') : SIM.explorador.proximoExclusao(p) || u.$('#arvore');
      default: return null;
    }
  }
  F.atualizarDestaque = () => {
    const S = SIM.S;
    if (!S) return;
    u.$$('.alvo-pulso').forEach((e) => e.classList.remove('alvo-pulso'));
    const p = F.passoAtual();
    if (!p || F.modalAberto()) { SIM.tutorial.esconder(); return; }
    const el = elementoAlvo(p);
    // Com o menu da Correção rápida aberto, o holofote mostra o menu inteiro e só a opção certa pisca.
    let pulso = el && el.id === 'menu-qf' ? (el.querySelector('[data-certo]') || el) : el;
    if (p.t === 'excluir' && el && el.id === 'arvore') pulso = SIM.explorador.proximoExclusao(p) || el;
    if (pulso) pulso.classList.add('alvo-pulso');
    // Em telas baixas a coluna do celular pode rolar: garante que o alvo apareça
    // (depois que o celular termina de se ajustar ao espaço).
    if (el && el.closest('#lado')) {
      setTimeout(() => {
        const p2 = F.passoAtual();
        const e2 = p2 && elementoAlvo(p2);
        if (e2 && e2.closest('#lado')) u.mostrarDentro(e2, u.$('#lado'));
      }, 320);
    }
    const chaveTut = p.tutChave || p.t;
    if (p.tut && S.config.tutorial && !S.tutVistos.includes(chaveTut) && el) SIM.tutorial.mostrar(el, p.tutTitulo || 'Primeira vez', p.tut);
    else SIM.tutorial.esconder();
  };

  // ---------- preparar um passo ----------
  function garantirAberto(path) {
    const S = SIM.S;
    if (S.abaAtiva !== path) SIM.editor.abrir(path, { silencioso: true });
  }
  function rolarParaLinha(i) {
    setTimeout(() => {
      const el = u.$('#editor .ed-linha[data-i="' + i + '"]');
      if (el) u.mostrarDentro(el, u.$('#editor'));
    }, 20);
  }

  F.iniciarPasso = () => {
    const S = SIM.S;
    const p = F.passoAtual();
    travado = false;
    const ui = SIM.editor.ui;
    if (!p) return;
    if (p.lado) SIM.lado.mostrarAba(p.lado);
    if (ui.espiar && ui.espiar.modo !== 'tour') ui.espiar = null;
    switch (p.t) {
      case 'intro': mostrarIntro(p); break;
      case 'comando': SIM.terminal.prepararComando(p.cmd); break;
      case 'digitar': {
        garantirAberto(p.a);
        const alvoTxt = E.finais(p.a)[p.l - 1];
        const indent = /^\s*/.exec(alvoTxt)[0];
        const alvo = alvoTxt.slice(indent.length);
        E.definir(p.a, p.l, indent);
        S.digitando = { path: p.a, i: p.l, indent, alvo, pos: 0, fecha: p.fecha || [], limite: p.ate || 0 };
        ui.espiar = { path: p.a, i: p.l, modo: 'linha' };
        SIM.editor.render();
        u.$('#editor').scrollLeft = 0;
        rolarParaLinha(p.l);
        break;
      }
      case 'tab': {
        garantirAberto(p.a);
        S.tabPendente = { path: p.a, ls: p.ls.slice() };
        ui.espiar = { path: p.a, i: p.ls[0], modo: 'linha' };
        SIM.editor.render();
        rolarParaLinha(p.ls[0]);
        break;
      }
      case 'bloco': {
        const d = SIM.porque.dados(p.a) || {};
        const b = (d.blocos || {})[p.b];
        if (!b) { console.warn('Bloco não encontrado', p.a, p.b); setTimeout(() => F.evento('entendi', {}), 10); break; }
        garantirAberto(p.a);
        ui.espiar = null;
        SIM.porque.mostrarResumo(Object.assign({ path: p.a }, b), () => F.evento('entendi', {}));
        break;
      }
      case 'ler': {
        garantirAberto(p.a);
        const un = SIM.porque.unidades(p.a);
        if (un.length) SIM.porque.abrirUnidade(p.a, un[0]);
        else setTimeout(() => F.evento('leitura-completa', { path: p.a }), 50);
        break;
      }
      case 'limpar': garantirAberto(p.a); S.selecaoTotal = false; ui.espiar = null; SIM.editor.render(); break;
      case 'ese': {
        garantirAberto(p.a);
        ui.espiar = { path: p.a, i: p.l, modo: 'ese' };
        SIM.editor.render();
        rolarParaLinha(p.l);
        break;
      }
      case 'ctrlclique': garantirAberto(p.a); SIM.editor.render(); rolarParaLinha(p.l); break;
      case 'quickfix': garantirAberto(p.a); SIM.editor.render(); break;
      case 'pergunta': mostrarPergunta(p.id); break;
      case 'fim': mostrarFim(p); break;
      case 'excluir': SIM.explorador.limparSelecao(); SIM.explorador.render(); break;
      case 'celular':
        // Se o aluno já fechou o laboratório antes da hora, este passo já está feito.
        if (p.acao === 'lab-fechou' && !SIM.lab.ativo()) setTimeout(() => { if (F.passoAtual() === p) concluir(); }, 300);
        break;
      default: break;
    }
    renderFaca();
    renderProgresso();
    setTimeout(F.atualizarDestaque, 30);
  };

  // ---------- eventos e conclusão ----------
  F.evento = (tipo, d) => {
    const S = SIM.S;
    const p = F.passoAtual();
    if (!p || travado) return;
    d = d || {};
    let ok = false;
    switch (p.t) {
      case 'terminal-foco': ok = tipo === 'terminal-foco'; break;
      case 'comando':
        if (tipo === 'comando') {
          SIM.terminal.rodar(p.saida || 'expo-start');
          S.cel.metroLigado = true;
          SIM.celular.render();
          ok = true;
        }
        break;
      case 'celular': ok = tipo === 'cel' && d.acao === p.acao && (!p.resultado || d.resultado === p.resultado) && (!p.minimo || (d.valor || '').length >= p.minimo) && (!p.nomeVazio || !(d.nome || '').trim()) && (!p.chave || d.chave === p.chave); break;
      case 'abrir': case 'aba': ok = tipo === 'arquivo-aberto' && d.path === p.a; break;
      case 'ler':
        if (tipo === 'leitura-completa' && d.path === p.a) {
          travado = true;
          const dados = SIM.porque.dados(p.a);
          setTimeout(() => {
            SIM.editor.ui.espiar = null;
            if (dados && dados.resumo) SIM.porque.mostrarResumo(Object.assign({ rotulo: 'Arquivo lido' }, dados.resumo), () => concluir());
            else concluir();
          }, 500);
          return;
        }
        break;
      case 'limpar': ok = tipo === 'limpou' && d.path === p.a; break;
      case 'pasta': ok = tipo === 'criou-pasta' && d.path === (p.pai ? p.pai + '/' : '') + p.nome; break;
      case 'arquivo': ok = tipo === 'criou-arquivo' && d.path === (p.pai ? p.pai + '/' : '') + p.nome; break;
      case 'digitar': ok = tipo === 'linha-completa' && d.path === p.a && d.i === p.l; break;
      case 'tab':
        if (tipo === 'tab' && d.path === p.a) {
          const F2 = E.finais(p.a);
          p.ls.forEach((i) => E.definir(p.a, i, F2[i - 1]));
          SIM.editor.ui.novas = p.ls.slice();
          S.tabPendente = null;
          SIM.sons.tocar('tab');
          SIM.editor.render();
          SIM.explorador.render();
          SIM.lado.atualizar();
          ok = true;
        }
        break;
      case 'bloco': ok = tipo === 'entendi'; break;
      case 'salvar': ok = tipo === 'salvou' && d.path === p.a && !(S.digitando && S.digitando.path === p.a); break;
      case 'observar': ok = tipo === 'continuar'; break;
      case 'quickfix': ok = tipo === 'qf' && d.path === p.a && !E.diagnosticos(p.a, 'editor').some((x) => x.tipo === 'import'); break;
      case 'ctrlclique': ok = tipo === 'ctrlclique' && d.chave === p.chave; break;
      case 'ese':
        if (tipo === 'ese-ver') {
          aplicarExperimento(p, true);
          return;
        }
        if (tipo === 'ese-voltar') { aplicarExperimento(p, false); ok = true; }
        break;
      case 'excluir':
        if (tipo === 'excluiu') {
          const faltam = p.alvos.filter((x) => SIM.arquivos[x] && E.existe(x));
          ok = !faltam.length;
          if (!ok) u.toast(faltam.length === 1 ? 'Falta apagar 1 arquivo de exemplo.' : 'Faltam ' + faltam.length + ' arquivos de exemplo para apagar.');
        }
        break;
      case 'pergunta': ok = tipo === 'resposta-certa'; break;
      case 'intro': ok = tipo === 'intro-ok'; break;
      case 'fim': ok = tipo === 'proxima-missao'; break;
      default: break;
    }
    if (tipo === 'linha-completa' || tipo === 'qf' || tipo === 'tab') SIM.lado.atualizar();
    if (ok) concluir();
  };

  function aplicarExperimento(p, ligar) {
    const S = SIM.S;
    const ui = SIM.editor.ui;
    if (p.id === 'web') { S.cel.modo = ligar ? 'web' : 'android'; S.cel.alerta = null; }
    else S.cel.experimento = ligar ? p.id : null;
    ui.riscadas = ligar && p.riscar ? { path: p.a, linhas: p.riscar } : null;
    if (ligar && p.preparar) {
      if (p.preparar.taskName != null) { S.cel.taskName = p.preparar.taskName; S.cel.campo = p.preparar.taskName; }
    }
    if (!ligar) { S.cel.alerta = null; if (p.preparar) { S.cel.taskName = ''; S.cel.campo = ''; } }
    SIM.sons.tocar(ligar ? 'erro' : 'clique');
    SIM.lado.mostrarAba('celular');
    SIM.celular.render();
    SIM.editor.renderConteudo();
    F.atualizarDestaque();
    if (ligar && p.tocarBotao) setTimeout(() => { const b = u.$('#cel-escala [data-cel="botao"]'); if (b) b.click(); }, 450);
  }

  function concluir() {
    const S = SIM.S;
    const p = F.passoAtual();
    if (travado && p.t !== 'ler') return;
    travado = true;
    const chaveTut = p.tutChave || p.t;
    if (p.tut && !S.tutVistos.includes(chaveTut)) S.tutVistos.push(chaveTut);
    SIM.tutorial.esconder();
    if (p.t !== 'digitar' && p.t !== 'tab' && p.t !== 'bloco' && p.t !== 'intro' && p.t !== 'fim' && p.t !== 'pergunta') SIM.sons.tocar('acerto');
    setTimeout(() => avancar(), p.t === 'digitar' || p.t === 'tab' ? 120 : 260);
  }

  function avancar() {
    const S = SIM.S;
    const m = F.missaoAtual();
    if (S.passo < m.passos.length - 1) {
      S.passo++;
      pilha.push(E.snapshot());
      E.persistir();
      F.iniciarPasso();
    }
  }

  F.voltarEtapa = () => {
    if (pilha.length < 2) { u.toast('Você já está no primeiro passo desta sessão.'); return; }
    pilha.pop();
    const snap = pilha[pilha.length - 1];
    E.restaurar(snap);
    SIM.editor.ui.espiar = null;
    SIM.editor.ui.resumo = null;
    SIM.editor.ui.realceBloco = null;
    SIM.editor.ui.riscadas = null;
    SIM.editor.fecharPopups();
    SIM.editor.removerDicaLetra();
    if (F.modalAberto()) { u.$('#modal').hidden = true; u.$('#modal').innerHTML = ''; }
    F.renderTudo();
    E.persistir();
    F.iniciarPasso();
    SIM.sons.tocar('clique');
    u.toast('Voltamos uma etapa.');
  };

  F.renderTudo = () => {
    const S = SIM.S;
    const m = F.missaoAtual();
    SIM.lado.abasVisiveis(S.missao >= 2, S.missao >= 5);
    SIM.explorador.render();
    SIM.editor.render();
    SIM.terminal.render();
    SIM.lado.mostrarAba(S.ladoAba || 'celular');
    SIM.celular.render();
    renderProgresso();
    renderFaca();
    u.$('#btn-som').setAttribute('aria-pressed', S.config.som);
    u.$('#btn-som use').setAttribute('href', S.config.som ? '#i-som' : '#i-mudo');
    document.documentElement.style.setProperty('--escala', S.config.fonte === 'projetor' ? '1.2' : '1');
    if (m) document.title = 'Código com Porquê';
  };

  // ---------- missões ----------
  F.iniciarMissao = (k) => {
    const S = SIM.S;
    S.missao = k;
    S.passo = 0;
    pilha = [E.snapshot()];
    F.renderTudo();
    E.persistir();
    F.iniciarPasso();
  };
  F.continuar = () => {
    pilha = [E.snapshot()];
    F.renderTudo();
    F.iniciarPasso();
  };

  // Aplica um passo sem interação (para começar em uma missão adiantada e para testes).
  F.aplicarInstantaneo = (p) => {
    const S = SIM.S;
    const F2 = p.a ? E.finais(p.a, 'final') : [];
    switch (p.t) {
      case 'comando': SIM.terminal.rodar(p.saida || 'expo-start'); S.cel.metroLigado = true; break;
      case 'celular':
        if (p.acao === 'escanear' || p.acao === 'abriu-app') { S.cel.tela = 'app'; S.cel.splash = false; }
        if (p.acao === 'aba-explore') S.cel.aba = 'explore';
        if (p.acao === 'aba-home') S.cel.aba = 'home';
        if (p.acao === 'modo') S.cel.modo = S.cel.modo === 'web' ? 'android' : 'web';
        if (p.acao === 'ok-alerta') S.cel.alerta = null;
        break;
      case 'abrir': case 'aba': case 'ler': case 'ese': case 'ctrlclique': case 'quickfix-abrir':
        if (p.a && E.existe(p.a)) { if (!S.abas.includes(p.a)) S.abas.push(p.a); S.abaAtiva = p.a; SIM.explorador.expandirAte(p.a); }
        if (p.t === 'ler') S.lidos[p.a] = SIM.porque.unidades(p.a).map((_, k) => k);
        break;
      case 'limpar': E.limpar(p.a); break;
      case 'pasta': E.criarPasta((p.pai ? p.pai + '/' : '') + p.nome); break;
      case 'arquivo': {
        const c = (p.pai ? p.pai + '/' : '') + p.nome;
        E.criarArquivo(c);
        if (!S.abas.includes(c)) S.abas.push(c);
        S.abaAtiva = c;
        SIM.explorador.expandirAte(c);
        break;
      }
      case 'digitar': E.definir(p.a, p.l, F2[p.l - 1]); (p.fecha || []).forEach((j) => E.definir(p.a, j, F2[j - 1])); break;
      case 'tab': p.ls.forEach((i) => E.definir(p.a, i, F2[i - 1])); break;
      case 'salvar': E.salvar(p.a); break;
      case 'quickfix': E.aplicarImports(p.a); break;
      case 'pergunta': if (!S.cartoes.includes(p.id)) S.cartoes.push(p.id); break;
      case 'excluir': p.alvos.forEach((x) => E.excluir(x)); break;
      case 'fim': if (!S.concluidas.includes(S.missao)) S.concluidas.push(S.missao); break;
      default: break;
    }
    if (p.lado) S.ladoAba = p.lado;
  };
  F.adiantarAte = (k) => {
    const S = SIM.S;
    for (let mi = 0; mi < k; mi++) {
      S.missao = mi;
      SIM.missoes[mi].passos.forEach((p, pi) => { S.passo = pi; F.aplicarInstantaneo(p); });
    }
    S.digitando = null;
    S.tabPendente = null;
    S.cel.experimento = null;
    S.cel.alerta = null;
    S.cel.modo = 'android';
  };

  // ---------- telas especiais: intro, pergunta e fim ----------
  function mostrarIntro(p) {
    const S = SIM.S;
    const m = F.missaoAtual();
    const caixa = F.modal(
      '<div class="pergunta-topo">' + u.icone('i-mapa') + 'Missão ' + (S.missao + 1) + ' de ' + SIM.missoes.length + '</div>' +
      '<h2 style="font-size:1.6em">' + u.esc(m.titulo) + '</h2>' +
      '<p>' + u.md(p.texto) + '</p>' +
      (p.arquivos ? '<p style="color:var(--texto-2)"><strong>Arquivos desta missão:</strong> ' + p.arquivos.map((a) => '<code class="texto-codigo">' + u.esc(a) + '</code>').join(' ') + '</p>' : '') +
      '<div class="modal-acoes"><button type="button" class="botao primario" data-foco id="btn-intro-ok">' + u.icone('i-play') + 'Começar a missão</button></div>',
      { cls: 'larga' }
    );
    caixa.querySelector('#btn-intro-ok').addEventListener('click', () => { F.fecharModal(); F.evento('intro-ok', {}); });
  }

  function mostrarPergunta(id) {
    const S = SIM.S;
    const q = (SIM.perguntas || []).find((x) => x.id === id);
    if (!q) { console.warn('Pergunta não encontrada', id); setTimeout(() => F.evento('resposta-certa', {}), 10); return; }
    const reg = (S.respostas[id] = S.respostas[id] || { erradas: [], dicaUsada: false });
    const limitado = S.config.dicas === 'limitado';
    const podeDica = !reg.dicaUsada && (!limitado || S.config.dicasRestantes > 0);
    const letras = ['A', 'B', 'C', 'D'];
    const caixa = F.modal(
      '<div class="pergunta-topo">' + u.icone('i-lampada') + 'Pausa do porquê</div>' +
      '<p class="pergunta-texto">' + u.md(q.pergunta) + '</p>' +
      '<div class="dica-linha"><button type="button" class="botao gelo pequeno" id="btn-dica"' + (podeDica ? '' : ' aria-disabled="true"') + '>' + u.icone('i-lampada') + (reg.dicaUsada ? 'Dica aberta' : 'Ver dica') + '</button>' +
      '<span class="dicas-restantes">' + (limitado ? 'Dicas restantes: ' + S.config.dicasRestantes + ' de 6' : 'Dicas ilimitadas') + '</span></div>' +
      (reg.dicaUsada ? '<div class="dica-texto">' + u.md(q.dica) + '</div>' : '<div class="dica-texto" id="dica-texto" hidden></div>') +
      '<div class="alternativas">' + q.alternativas.map((a, k) => '<button type="button" class="alternativa" data-k="' + k + '"' + (reg.erradas.includes(k) ? ' disabled' : '') + '><span class="letra">' + letras[k] + '</span><span>' + u.md(a) + '</span></button>').join('') + '</div>',
      { cls: 'larga' }
    );
    caixa.querySelector('#btn-dica').addEventListener('click', () => {
      if (reg.dicaUsada) return;
      if (limitado && S.config.dicasRestantes <= 0) { u.toast('As 6 dicas já foram usadas. Leia de novo as alternativas com calma.'); return; }
      reg.dicaUsada = true;
      if (limitado) S.config.dicasRestantes--;
      const dt = caixa.querySelector('#dica-texto');
      dt.innerHTML = u.md(q.dica);
      dt.hidden = false;
      caixa.querySelector('#btn-dica').innerHTML = u.icone('i-lampada') + 'Dica aberta';
      caixa.querySelector('.dicas-restantes').textContent = limitado ? 'Dicas restantes: ' + S.config.dicasRestantes + ' de 6' : 'Dicas ilimitadas';
      SIM.sons.tocar('clique');
    });
    caixa.querySelectorAll('.alternativa').forEach((b) => b.addEventListener('click', () => {
      const k = Number(b.dataset.k);
      if (k === q.correta) {
        SIM.sons.tocar('acerto');
        if (!S.cartoes.includes(id)) S.cartoes.push(id);
        u.$('#cont-cartoes').textContent = S.cartoes.length;
        mostrarCartao(q);
      } else {
        if (!reg.erradas.includes(k)) reg.erradas.push(k);
        F.erroModal('Ainda não é essa', q.feedback[k] || 'Releia a pergunta e tente outra alternativa.', () => mostrarPergunta(id));
      }
    }));
  }

  function htmlCartao(c, rotulo) {
    return '<div class="flashcard"><div class="fc-rotulo">' + (rotulo || 'Cartão de conceito') + '</div><div class="fc-titulo">' + u.esc(c.titulo) + '</div><p class="fc-texto">' + u.md(c.texto) + '</p>' +
      (c.trecho ? '<pre>' + u.esc(c.trecho) + '</pre>' + (c.arquivo ? '<div class="fc-arquivo">' + u.esc(c.arquivo) + '</div>' : '') : '') + '</div>';
  }
  F.htmlCartao = htmlCartao;

  function mostrarCartao(q) {
    const caixa = F.modal(
      '<h2>' + u.icone('i-check') + 'Isso mesmo!</h2><p>' + u.md(q.explicacao) + '</p>' + htmlCartao(q.cartao, 'Novo cartão de conceito') +
      '<div class="modal-acoes"><button type="button" class="botao primario" data-foco id="btn-cartao-ok">Guardar cartão e continuar</button></div>',
      { cls: 'acerto larga' }
    );
    caixa.querySelector('#btn-cartao-ok').addEventListener('click', () => { F.fecharModal(); F.evento('resposta-certa', {}); });
  }

  function mostrarFim(p) {
    const S = SIM.S;
    if (!S.concluidas.includes(S.missao)) S.concluidas.push(S.missao);
    E.persistir();
    SIM.sons.tocar('missao');
    u.confete();
    const ultima = S.missao >= SIM.missoes.length - 1;
    const codigoProxima = ultima ? '' : SIM.progresso.codigoAtual({ missao: S.missao + 1, passo: 0 });
    const caixa = F.modal(
      '<div class="missao-fim-caixa"><div class="selo-grande">{ ' + (S.missao + 1) + ' }</div><h2 style="justify-content:center">Missão concluída!</h2>' +
      '<p>' + u.md(p.texto || '') + '</p></div>' +
      '<p style="font-weight:600;margin-bottom:6px">O que você entendeu nesta missão:</p><ul class="lista-aprendida">' + (p.aprendeu || []).map((x) => '<li>' + u.md(x) + '</li>').join('') + '</ul>' +
      (ultima ? '' : '<div class="fim-codigo"><span>Para continuar depois, em qualquer computador, anote o código da próxima missão:</span>' + SIM.progresso.caixaCodigo(codigoProxima) + '</div>') +
      '<div class="modal-acoes">' + (ultima
        ? '<button type="button" class="botao primario" data-foco id="btn-fim">' + u.icone('i-chave') + 'Ver o resultado final</button>'
        : '<button type="button" class="botao primario" data-foco id="btn-fim">Próxima missão' + u.icone('i-seta-dir') + '</button>') + '</div>',
      { cls: 'acerto larga' }
    );
    if (!ultima) SIM.progresso.ligarCopiar(caixa, codigoProxima);
    caixa.querySelector('#btn-fim').addEventListener('click', () => {
      F.fecharModal();
      if (ultima) { SIM.relatorio.mostrar(); return; }
      F.iniciarMissao(S.missao + 1);
    });
  }

  // ---------- salvar e teclado ----------
  F.salvarAtivo = () => {
    const S = SIM.S;
    const p = S.abaAtiva;
    if (!p) return;
    const a = E.arq(p);
    E.salvar(p);
    SIM.sons.tocar('salvar');
    SIM.editor.render();
    SIM.explorador.render();
    if (a && a.versao === 'final' || p === 'src/app/_layout.tsx' || p === 'src/app/index.tsx') SIM.celular.aposSalvar(p);
    SIM.lado.atualizar();
    F.evento('salvou', { path: p });
  };

  F.teclado = (ev) => {
    const S = SIM.S;
    if (!S || u.$('#tela-sim').hidden) return;
    if (F.modalAberto()) {
      if (ev.key === 'Escape') { const ok = u.$('#modal [data-ok]'); if (ok) ok.click(); }
      return;
    }
    const alvo = ev.target;
    if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.tagName === 'SELECT')) return;
    const ctrl = ev.ctrlKey || ev.metaKey;
    if (ctrl && (ev.key === 's' || ev.key === 'S')) { ev.preventDefault(); F.salvarAtivo(); return; }
    const p = F.passoAtual();
    if (p && p.t === 'comando') { if (SIM.terminal.teclar(ev)) ev.preventDefault(); return; }
    if (ev.key === 'Tab' && !S.digitando && !S.tabPendente) return;
    if (alvo && alvo.tagName === 'BUTTON' && (ev.key === 'Enter' || ev.key === ' ') && !S.digitando) return;
    if (SIM.explorador.teclar(ev)) { ev.preventDefault(); return; }
    if (SIM.editor.teclar(ev)) ev.preventDefault();
  };

  F.iniciar = () => {
    document.addEventListener('keydown', F.teclado);
    u.$('#faca-acoes').addEventListener('click', (e) => { if (e.target.closest('#btn-continuar-passo')) { SIM.sons.tocar('clique'); F.evento('continuar', {}); } });
    u.$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal' && u.$('#modal [data-ok]')) u.$('#modal [data-ok]').click(); });
  };
})();
