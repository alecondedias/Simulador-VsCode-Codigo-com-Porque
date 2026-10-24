/* Estado do simulador e modelo dos arquivos (linhas visíveis, salvamento, diagnósticos do TypeScript). */
(function () {
  const SIM = window.SIM;
  const u = SIM.u;
  const CHAVE_LOCAL = 'codigoComPorque.v2'; // v2: missões 1 e 5 mudaram de tamanho, então progressos da v1 não servem mais
  const TIPO_SO = new Set(['React', 'Task', 'TaskContextType', 'TaskProviderProps', 'TaskItemProps']);

  const cacheEspecs = {};
  const cacheDecl = {};

  const E = (SIM.estado = {
    TIPO_SO,

    criar(config) {
      SIM.S = {
        versao: 1,
        config: Object.assign({ dicas: 'limitado', dicasRestantes: 6, tutorial: true, fonte: 'normal', som: true }, config || {}),
        missao: 0,
        passo: 0,
        arquivos: {},
        pastas: [],
        expandidas: ['src'],
        selecionado: '',
        abas: [],
        abaAtiva: '',
        digitando: null,
        tabPendente: null,
        selecaoTotal: false,
        terminal: { linhas: [], rodando: false, digitando: null, avisos: [] },
        cel: { tela: 'expogo', modo: 'android', aba: 'home', campo: '', taskName: '', alerta: null, experimento: null, chave: 0, metroLigado: false },
        lidos: {},
        tutVistos: [],
        cartoes: [],
        respostas: {},
        ladoAba: 'celular',
        concluidas: [],
        lab: false,
      };
      return SIM.S;
    },

    lang(path) { return (SIM.arquivos[path] && SIM.arquivos[path].lang) || 'txt'; },
    ehModelo(path) { return !!(SIM.arquivos[path] && SIM.arquivos[path].modelo); },
    ehNovo(path) { return !!(SIM.arquivos[path] && !SIM.arquivos[path].modelo && SIM.arquivos[path].final); },

    arq(path) {
      const S = SIM.S;
      if (!S.arquivos[path]) {
        const def = SIM.arquivos[path];
        if (!def) return null;
        S.arquivos[path] = def.modelo
          ? { versao: 'modelo', intacto: true, existe: true, sujo: false, salvo: { versao: 'modelo', intacto: true } }
          : { versao: 'final', intacto: false, existe: false, sujo: false, slots: {}, salvo: null };
      }
      return S.arquivos[path];
    },

    finais(path, versao) {
      const def = SIM.arquivos[path];
      if (!def) return [];
      const v = versao || (E.arq(path) || {}).versao || (def.modelo ? 'modelo' : 'final');
      return def[v] || [];
    },

    existe(path) {
      if (path === 'node_modules' || path === 'package-lock.json') return true;
      if ((SIM.imagens || []).includes(path)) return true;
      const a = E.arq(path);
      return !!(a && a.existe);
    },

    // Linhas visíveis no editor: [{ i, t }] na ordem do arquivo final.
    visiveis(path) {
      const a = E.arq(path);
      if (!a) return [];
      const F = E.finais(path);
      if (a.intacto) return F.map((t, k) => ({ i: k + 1, t }));
      return Object.keys(a.slots).map(Number).sort((x, y) => x - y).map((i) => ({ i, t: a.slots[i] }));
    },
    tem(path, i) {
      const a = E.arq(path);
      if (!a) return false;
      if (a.intacto) return i >= 1 && i <= E.finais(path).length;
      return Object.prototype.hasOwnProperty.call(a.slots, i);
    },
    texto(path, i) {
      const a = E.arq(path);
      if (!a) return '';
      if (a.intacto) return E.finais(path)[i - 1];
      return a.slots[i];
    },

    materializar(path) {
      const a = E.arq(path);
      if (a.intacto) {
        a.slots = {};
        E.finais(path).forEach((t, k) => { a.slots[k + 1] = t; });
        a.intacto = false;
      }
      return a;
    },

    definir(path, i, texto) {
      const a = E.materializar(path);
      if (texto === null) delete a.slots[i];
      else a.slots[i] = texto;
      a.sujo = true;
      E.normalizarBrancos(path);
    },

    limpar(path) {
      const a = E.arq(path);
      a.versao = 'final';
      a.intacto = false;
      a.slots = {};
      a.sujo = true;
    },

    // Regra das linhas em branco: aparecem quando a linha de código logo acima já existe e há código visível abaixo.
    normalizarBrancos(path) {
      const a = E.arq(path);
      if (!a || a.intacto || a.versao !== 'final') return;
      const F = E.finais(path, 'final');
      const visivelNaoBranca = (i) => Object.prototype.hasOwnProperty.call(a.slots, i) && F[i - 1] !== '';
      let algumAbaixo = false;
      const abaixo = new Array(F.length + 2).fill(false);
      for (let i = F.length; i >= 1; i--) { abaixo[i] = algumAbaixo; if (visivelNaoBranca(i)) algumAbaixo = true; }
      for (let i = 1; i <= F.length; i++) {
        if (F[i - 1] !== '') continue;
        let k = i - 1;
        while (k >= 1 && F[k - 1] === '') k--;
        const mostrar = k >= 1 && visivelNaoBranca(k) && abaixo[i];
        if (mostrar) a.slots[i] = '';
        else delete a.slots[i];
      }
    },

    salvar(path) {
      const a = E.arq(path);
      if (!a) return;
      const S = SIM.S;
      const parcial = S.digitando && S.digitando.path === path ? S.digitando.i : 0;
      a.salvo = a.intacto
        ? { versao: a.versao, intacto: true }
        : { versao: a.versao, intacto: false, slots: Object.assign({}, a.slots), parcial };
      a.sujo = false;
      a.existe = true;
    },

    criarArquivo(path) {
      const a = E.arq(path);
      a.existe = true;
      a.versao = 'final';
      a.intacto = false;
      a.slots = a.slots || {};
      a.salvo = { versao: 'final', intacto: false, slots: {}, parcial: 0 };
      a.sujo = false;
      a.novo = true;
    },
    criarPasta(path) {
      if (!SIM.S.pastas.includes(path)) SIM.S.pastas.push(path);
    },

    // Informação do que está salvo no disco (é o que o celular enxerga).
    salvoInfo(path) {
      const a = E.arq(path);
      if (!a || !a.existe || !a.salvo) return { existe: false, versao: null, has: () => false, texto: () => undefined, linhas: () => [], vazio: true };
      const s = a.salvo;
      const F = E.finais(path, s.versao);
      const slots = s.intacto ? null : s.slots;
      const has = (i) => (s.intacto ? i >= 1 && i <= F.length : slots[i] === F[i - 1] && i !== s.parcial);
      const texto = (i) => (s.intacto ? F[i - 1] : slots[i]);
      const indices = () => (s.intacto ? F.map((_, k) => k + 1) : Object.keys(slots).map(Number).sort((x, y) => x - y));
      return {
        existe: true,
        versao: s.versao,
        intacto: !!s.intacto,
        parcial: s.parcial || 0,
        has,
        texto,
        indices,
        linhas: () => indices().map((i) => ({ i, t: texto(i) })),
        vazio: !s.intacto && indices().filter((i) => (slots[i] || '').trim()).length === 0,
      };
    },

    // Imports do arquivo final: [{ i, padrao, nomes, modulo }]
    especs(path) {
      if (cacheEspecs[path]) return cacheEspecs[path];
      const F = (SIM.arquivos[path] && SIM.arquivos[path].final) || [];
      const r = [];
      F.forEach((t, k) => {
        const p = E.lerImport(t);
        if (p) r.push(Object.assign({ i: k + 1 }, p));
      });
      return (cacheEspecs[path] = r);
    },
    lerImport(t) {
      const m = /^import\s+(?:([A-Za-z_$][\w$]*)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s*["']([^"']+)["'];?\s*$/.exec(t || '');
      if (!m) return null;
      return { padrao: m[1] || null, nomes: (m[2] || '').split(',').map((s) => s.trim()).filter(Boolean), modulo: m[3] };
    },
    montarImport(spec, nomes) {
      const padrao = spec.padrao && nomes.has(spec.padrao) ? spec.padrao : null;
      const nomeados = spec.nomes.filter((x) => nomes.has(x));
      if (!padrao && !nomeados.length) return null;
      let s = 'import ';
      if (padrao) s += padrao + (nomeados.length ? ', ' : ' ');
      if (nomeados.length) s += '{ ' + nomeados.join(', ') + ' } ';
      return s + 'from "' + spec.modulo + '";';
    },

    declaracoes(path) {
      if (cacheDecl[path]) return cacheDecl[path];
      const F = (SIM.arquivos[path] && SIM.arquivos[path].final) || [];
      const d = {};
      F.forEach((t, k) => {
        let m;
        if ((m = /^\s*(?:export\s+)?const\s+\[\s*([\w$]+)\s*,\s*([\w$]+)\s*\]/.exec(t))) { d[m[1]] = k + 1; d[m[2]] = k + 1; }
        else if ((m = /^\s*(?:export\s+)?const\s+\{\s*([\w$,\s]+)\}\s*=/.exec(t))) m[1].split(',').forEach((x) => { if (x.trim()) d[x.trim()] = k + 1; });
        else if ((m = /^\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*[:=]/.exec(t))) d[m[1]] = k + 1;
        else if ((m = /^\s*(?:export\s+)?(?:default\s+)?function\s+([\w$]+)/.exec(t))) d[m[1]] = k + 1;
        else if ((m = /^\s*(?:export\s+)?interface\s+([\w$]+)/.exec(t))) d[m[1]] = k + 1;
      });
      return (cacheDecl[path] = d);
    },

    // Diagnósticos (sublinhado vermelho). fonte: 'editor' (o que está na tela) ou 'salvo' (o que está no disco).
    diagnosticos(path, fonte) {
      const a = E.arq(path);
      if (!a || a.versao !== 'final' || !SIM.arquivos[path].final) return [];
      const S = SIM.S;
      let linhas;
      if (fonte === 'salvo') {
        const si = E.salvoInfo(path);
        if (!si.existe || si.versao !== 'final') return [];
        linhas = si.linhas().filter((l) => l.i !== si.parcial);
      } else {
        linhas = E.visiveis(path).filter((l) => !(S.digitando && S.digitando.path === path && S.digitando.i === l.i));
      }
      const especs = E.especs(path);
      const decl = E.declaracoes(path);
      const presentes = new Set(linhas.map((l) => l.i));
      const importados = new Set();
      especs.forEach((sp) => {
        const l = linhas.find((x) => x.i === sp.i);
        const p = l && E.lerImport(l.t);
        if (p) { if (p.padrao) importados.add(p.padrao); p.nomes.forEach((x) => importados.add(x)); }
      });
      const corpo = linhas.filter((l) => !especs.some((sp) => sp.i === l.i));
      if (!corpo.length) return [];
      const toks = SIM.sintaxe.tokenizar(corpo.map((l) => l.t).join('\n'), E.lang(path));
      const probs = [];
      toks.forEach((linhaToks, k) => {
        const li = corpo[k] && corpo[k].i;
        let col = 0;
        linhaToks.forEach((p) => {
          if (p.id && p.uso) {
            const sp = especs.find((s) => s.padrao === p.id || s.nomes.includes(p.id));
            if (sp && !importados.has(p.id)) {
              probs.push({
                tipo: 'import', nome: p.id, i: li, col, spec: sp,
                msg: p.id === 'React'
                  ? "'React' se refere a um global UMD, mas o arquivo atual é um módulo. Considere adicionar uma importação. ts(2686)"
                  : "Não é possível encontrar o nome '" + p.id + "'. ts(2304)",
              });
            } else if (!sp && decl[p.id] && decl[p.id] !== li && !presentes.has(decl[p.id])) {
              probs.push({ tipo: 'nome', nome: p.id, i: li, col, msg: "Não é possível encontrar o nome '" + p.id + "'. ts(2304)" });
            }
          }
          col += p.t.length;
        });
      });
      return probs;
    },

    // Nomes de import que o arquivo precisa agora (os usados no código + os que já estavam importados).
    nomesNecessarios(path, spec) {
      const nomes = new Set();
      const l = E.visiveis(path).find((x) => x.i === spec.i);
      const p = l && E.lerImport(l.t);
      if (p) { if (p.padrao) nomes.add(p.padrao); p.nomes.forEach((x) => nomes.add(x)); }
      E.diagnosticos(path, 'editor').forEach((d) => { if (d.tipo === 'import' && d.spec.i === spec.i) nomes.add(d.nome); });
      return nomes;
    },

    aplicarImports(path, apenasModulo) {
      const espec = E.especs(path);
      const diags = E.diagnosticos(path, 'editor').filter((d) => d.tipo === 'import' && (!apenasModulo || d.spec.modulo === apenasModulo));
      const tocados = new Set(diags.map((d) => d.spec.i));
      const mudou = [];
      espec.forEach((sp) => {
        if (!tocados.has(sp.i)) return;
        const txt = E.montarImport(sp, E.nomesNecessarios(path, sp));
        if (txt) { E.definir(path, sp.i, txt); mudou.push(sp.i); }
      });
      return mudou;
    },

    // Apaga um arquivo do projeto, ou uma pasta com tudo o que tem dentro. Devolve os arquivos apagados.
    excluir(path) {
      const S = SIM.S;
      const apagados = [];
      const apagarArq = (p) => {
        const a = E.arq(p);
        if (!a || !a.existe) return;
        a.existe = false;
        a.sujo = false;
        a.salvo = null;
        S.abas = S.abas.filter((x) => x !== p);
        if (S.abaAtiva === p) S.abaAtiva = S.abas[S.abas.length - 1] || '';
        apagados.push(p);
      };
      if (SIM.arquivos[path]) apagarArq(path);
      else {
        Object.keys(SIM.arquivos).filter((p) => p.startsWith(path + '/')).forEach(apagarArq);
        S.pastas = S.pastas.filter((p) => p !== path && !p.startsWith(path + '/'));
        S.expandidas = S.expandidas.filter((p) => p !== path && !p.startsWith(path + '/'));
      }
      if (S.selecionado === path || S.selecionado.startsWith(path + '/')) S.selecionado = '';
      return apagados;
    },

    // ---------- snapshots e persistência ----------
    snapshot() { return u.clonar(SIM.S); },
    restaurar(snap) { SIM.S = u.clonar(snap); },
    persistir() {
      const S = SIM.S;
      if (!S) return;
      u.guardar(CHAVE_LOCAL, S);
    },
    carregar() {
      const s = u.lerGuardado(CHAVE_LOCAL);
      return s && s.versao === 1 ? s : null;
    },
    esquecer() { u.apagarGuardado(CHAVE_LOCAL); },
  });
})();
