/* Terminal integrado (PowerShell) com o Metro do Expo e o painel de Problemas. */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const PROMPT = 'PS C:\\Users\\aluno\\lista-de-tarefas> ';
  let foco = false;

  // QR code de mentira (só o desenho), sempre igual.
  let qrCache = null;
  function qr() {
    if (qrCache) return qrCache;
    const N = 25;
    const m = [];
    let s = 20261023;
    const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
    for (let y = 0; y < N; y++) { m.push([]); for (let x = 0; x < N; x++) m[y].push(rnd() > 0.52 ? 1 : 0); }
    const finder = (ox, oy) => {
      for (let y = -1; y < 8; y++) for (let x = -1; x < 8; x++) {
        const X = ox + x, Y = oy + y;
        if (X < 0 || Y < 0 || X >= N || Y >= N) continue;
        const borda = x === 0 || y === 0 || x === 6 || y === 6;
        const miolo = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        m[Y][X] = x < 0 || y < 0 || x > 6 || y > 6 ? 0 : borda || miolo ? 1 : 0;
      }
    };
    finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
    return (qrCache = m);
  }
  function qrTexto() {
    const m = qr();
    const N = m.length;
    const linhas = [];
    const cel = (y, x) => (y >= 0 && y < N && x >= 0 && x < N ? m[y][x] : 0);
    for (let y = -1; y < N + 1; y += 2) {
      let s = '';
      for (let x = -1; x < N + 1; x++) {
        const a = cel(y, x), b = cel(y + 1, x);
        s += a && b ? ' ' : a ? '\u2584' : b ? '\u2580' : '\u2588';
      }
      linhas.push(s);
    }
    return linhas;
  }

  function add(t, c) { SIM.S.terminal.linhas.push({ t, c: c || '' }); if (SIM.S.terminal.linhas.length > 400) SIM.S.terminal.linhas.splice(0, 100); }

  function render() {
    const S = SIM.S;
    const box = u.$('#painel-terminal');
    if (!box || !S) return;
    const T = S.terminal;
    let html = T.linhas.map((l) => '<div class="term-linha ' + l.c + '">' + u.esc(l.t) + '</div>').join('');
    if (!T.rodando) {
      const d = T.digitando;
      let entrada = '';
      if (d) entrada = '<span class="term-cmd">' + u.esc(d.alvo.slice(0, d.pos)) + '</span><span class="cursor"></span><span class="fantasma">' + u.esc(d.alvo.slice(d.pos)) + '</span>';
      else if (foco) entrada = '<span class="cursor"></span>';
      html += '<div class="term-linha term-entrada' + (foco ? ' foco' : '') + '" id="term-entrada"><span class="term-prompt">' + u.esc(PROMPT) + '</span>' + entrada + '</div>';
    }
    box.innerHTML = html;
    box.scrollTop = box.scrollHeight;
  }

  function mostrarAba(qual) {
    const term = qual === 'terminal';
    u.$('#aba-terminal').setAttribute('aria-selected', term);
    u.$('#aba-problemas').setAttribute('aria-selected', !term);
    u.$('#painel-terminal').hidden = !term;
    u.$('#painel-problemas').hidden = term;
  }

  const SAIDAS = {
    'expo-start': () => {
      add('Starting project at C:\\Users\\aluno\\lista-de-tarefas', 'term-cinza');
      add('Starting Metro Bundler', 'term-cinza');
      qrTexto().forEach((l) => add(l, 'term-qr'));
      add('');
      add('\u203a Metro waiting on exp://192.168.0.12:8081', 'term-branco');
      add('\u203a Scan the QR code above with Expo Go (Android) or the Camera app (iOS)');
      add('');
      add('\u203a Using Expo Go');
      add('\u203a Press s \u2502 switch to development build', 'term-cinza');
      add('');
      add('\u203a Press a \u2502 open Android');
      add('\u203a Press w \u2502 open web');
      add('');
      add('\u203a Press j \u2502 open debugger', 'term-cinza');
      add('\u203a Press r \u2502 reload app', 'term-cinza');
      add('\u203a Press m \u2502 toggle menu', 'term-cinza');
      add('\u203a Press o \u2502 open project code in your editor', 'term-cinza');
      add('');
      add('Logs for your project will appear below. Press Ctrl+C to exit.', 'term-cinza');
    },
  };

  SIM.terminal = {
    qr,
    render,
    mostrarAba,
    prepararComando(alvo) {
      SIM.S.terminal.digitando = { alvo, pos: 0 };
      mostrarAba('terminal');
      render();
    },
    rodar(nome) {
      const T = SIM.S.terminal;
      T.digitando = null;
      if (SAIDAS[nome]) SAIDAS[nome]();
      T.rodando = true;
      render();
    },
    log(t, c) { add(t, c); mostrarAba('terminal'); render(); },
    empacotou(modulos, ms, web) {
      add((web ? 'Web' : 'Android') + ' Bundled ' + (ms || 30 + Math.round(Math.random() * 30)) + 'ms node_modules/expo-router/entry.js (' + (modulos || 1) + (modulos > 1 ? ' modules)' : ' module)'), 'term-verde');
      render();
    },
    aviso(chave, t) {
      const T = SIM.S.terminal;
      if (T.avisos.includes(chave)) return;
      T.avisos.push(chave);
      add(' WARN  ' + t, 'term-amarelo');
      render();
    },
    erro(t) { add(' ERROR  ' + t, 'term-vermelho'); render(); },
    teclar(ev) {
      const T = SIM.S.terminal;
      const d = T.digitando;
      if (!d) return false;
      if (ev.key === 'Enter') {
        if (d.pos >= d.alvo.length) { SIM.sons.tocar('linha'); SIM.fluxo.evento('comando', { cmd: d.alvo }); }
        else { SIM.sons.tocar('erro'); u.toast('Termine de digitar o comando antes de apertar Enter.'); }
        return true;
      }
      if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { d.pos = d.alvo.length; render(); return true; }
      if (ev.key.length !== 1 || ev.ctrlKey || ev.metaKey || ev.altKey) return ev.key === 'Tab' || ev.key === 'Backspace';
      if (d.pos >= d.alvo.length) return true;
      if (ev.key === d.alvo[d.pos]) { d.pos++; SIM.sons.tocar('tecla'); }
      else { SIM.sons.tocar('erro'); u.tremer(u.$('#term-entrada')); }
      render();
      return true;
    },
    iniciar() {
      u.$('#aba-terminal').addEventListener('click', () => mostrarAba('terminal'));
      u.$('#aba-problemas').addEventListener('click', () => mostrarAba('problemas'));
      u.$('#painel-terminal').addEventListener('click', () => {
        foco = true;
        render();
        SIM.fluxo.evento('terminal-foco', {});
      });
      document.addEventListener('click', (e) => { if (foco && !e.target.closest('#painel-terminal')) { foco = false; render(); } });
    },
    focado: () => foco,
  };
})();
