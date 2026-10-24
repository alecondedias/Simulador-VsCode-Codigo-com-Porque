/* Realce de sintaxe no estilo do VS Code (TS, TSX, JS, CSS, JSON, Markdown).
   Devolve uma lista de linhas; cada linha é uma lista de pedaços { t: texto, c: classe, id, ... }. */
(function () {
  const SIM = window.SIM;
  const CTL = new Set(['import', 'export', 'from', 'default', 'return', 'if', 'else', 'throw', 'for', 'while', 'switch', 'case', 'break', 'continue', 'await', 'as', 'try', 'catch']);
  const KW = new Set(['const', 'let', 'var', 'function', 'interface', 'type', 'new', 'typeof', 'class', 'extends', 'async', 'in', 'of', 'keyof', 'void', 'true', 'false', 'null', 'undefined', 'this', 'implements', 'enum', 'declare']);
  const PRIM = new Set(['string', 'number', 'boolean', 'any', 'unknown', 'never']);
  const GENERICOS = new Set(['useState', 'createContext', 'useRef', 'useMemo', 'Array']);

  function fimString(txt, i, q) {
    let j = i + 1;
    while (j < txt.length) {
      if (txt[j] === '\\') { j += 2; continue; }
      if (txt[j] === q) return j + 1;
      if (txt[j] === '\n' && q !== '`') return j;
      j++;
    }
    return j;
  }

  function ts(texto, jsx) {
    const L = [[]];
    const n = texto.length;
    const modos = [{ m: 'js' }];
    let i = 0, prof = 0, ult = '', ultIdent = '', antesPonto = '';
    const add = (t, c, x) => {
      const partes = t.split('\n');
      for (let k = 0; k < partes.length; k++) {
        if (k > 0) L.push([]);
        if (partes[k]) L[L.length - 1].push(x ? Object.assign({ t: partes[k], c }, x) : { t: partes[k], c });
      }
    };
    const topo = () => modos[modos.length - 1];
    const abre = (ch) => { const c = 't-b' + ((prof % 3) + 1); prof++; add(ch, c); ult = ch; };
    const fecha = (ch) => { prof = Math.max(0, prof - 1); add(ch, 't-b' + ((prof % 3) + 1)); ult = ch; };
    const podeJSX = () => jsx && /^(|\(|,|=|:|\?|\{|\[|return|=>|&&|\|\||!)$/.test(ult);

    while (i < n) {
      const f = topo();
      const ch = texto[i];

      if (f.m === 'filhos') {
        if (ch === '<') {
          if (texto[i + 1] === '/') { add('</', 't-ang'); i += 2; modos.push({ m: 'tag', fecha: true, nome: false }); ult = '</'; continue; }
          add('<', 't-ang'); i++; modos.push({ m: 'tag', fecha: false, nome: false }); ult = '<'; continue;
        }
        if (ch === '{') { abre('{'); i++; modos.push({ m: 'chave', prof: 0 }); continue; }
        let j = i;
        while (j < n && texto[j] !== '<' && texto[j] !== '{') j++;
        texto.slice(i, j).split(/(&[a-zA-Z]+;|&#\d+;)/).forEach((p) => { if (p) add(p, /^&/.test(p) ? 't-ent' : 't-txt'); });
        i = j;
        continue;
      }

      if (f.m === 'tag') {
        if (/\s/.test(ch)) { let j = i; while (j < n && /\s/.test(texto[j])) j++; add(texto.slice(i, j), ''); i = j; continue; }
        if (!f.nome) {
          f.nome = true;
          const m = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*/.exec(texto.slice(i, i + 80));
          if (m) {
            const partes = m[0].split('.');
            partes.forEach((p, k) => {
              if (k > 0) add('.', 't-pon');
              add(p, /^[A-Z]/.test(m[0]) ? 't-tag' : 't-tag-html', { id: p, jsxTag: true, membroDe: k > 0 ? partes.slice(0, k).join('.') : '' , uso: k === 0 });
            });
            i += m[0].length;
            ult = m[0];
            continue;
          }
        }
        if (ch === '/' && texto[i + 1] === '>') { add('/>', 't-ang'); i += 2; modos.pop(); ult = '/>'; continue; }
        if (ch === '>') {
          add('>', 't-ang'); i++; modos.pop();
          if (f.fecha) { if (topo().m === 'filhos') modos.pop(); } else modos.push({ m: 'filhos' });
          ult = '>';
          continue;
        }
        if (ch === '{') { abre('{'); i++; modos.push({ m: 'chave', prof: 0 }); continue; }
        if (ch === '"' || ch === "'") { const j = fimString(texto, i, ch); add(texto.slice(i, j), 't-str'); i = j; continue; }
        const m = /^[A-Za-z_$][\w$-]*/.exec(texto.slice(i, i + 60));
        if (m) { add(m[0], 't-attr', { id: m[0], attr: true }); i += m[0].length; ult = m[0]; continue; }
        add(ch, 't-pon'); i++; continue;
      }

      if (f.m === 'chave') {
        if (ch === '{') { f.prof++; abre('{'); i++; continue; }
        if (ch === '}') {
          if (f.prof === 0) { fecha('}'); i++; modos.pop(); continue; }
          f.prof--; fecha('}'); i++; continue;
        }
      }

      if (/\s/.test(ch)) { let j = i; while (j < n && /\s/.test(texto[j])) j++; add(texto.slice(i, j), ''); i = j; continue; }
      if (ch === '/' && texto[i + 1] === '/') { let j = texto.indexOf('\n', i); if (j < 0) j = n; add(texto.slice(i, j), 't-com'); i = j; continue; }
      if (ch === '/' && texto[i + 1] === '*') { let j = texto.indexOf('*/', i + 2); j = j < 0 ? n : j + 2; add(texto.slice(i, j), 't-com'); i = j; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { const j = fimString(texto, i, ch); add(texto.slice(i, j), 't-str', { str: texto.slice(i, j) }); i = j; ult = 'str'; continue; }
      if (/[0-9]/.test(ch)) { const m = /^\d+(\.\d+)?/.exec(texto.slice(i, i + 30)); add(m[0], 't-num'); i += m[0].length; ult = 'num'; continue; }
      if (/[A-Za-z_$]/.test(ch)) {
        const w = /^[A-Za-z_$][\w$]*/.exec(texto.slice(i, i + 80))[0];
        let k = i + w.length;
        while (k < n && texto[k] === ' ') k++;
        const prox = texto[k];
        const depoisPonto = ult === '.';
        let c;
        if (!depoisPonto && CTL.has(w)) c = 't-ctl';
        else if (!depoisPonto && PRIM.has(w)) c = 't-tipo';
        else if (!depoisPonto && KW.has(w)) c = 't-kw';
        else if (prox === '(' || (prox === '<' && GENERICOS.has(w))) c = 't-fn';
        else if (/^[A-Z][A-Z0-9_]+$/.test(w)) c = 't-const';
        else if (/^[A-Z]/.test(w)) c = 't-tipo';
        else c = 't-var';
        const ehChave = prox === ':' || (prox === '?' && texto[k + 1] === ':');
        add(w, c, { id: w, membroDe: depoisPonto ? antesPonto : '', uso: !depoisPonto && !ehChave && !CTL.has(w) && !KW.has(w) });
        ultIdent = depoisPonto ? antesPonto + '.' + w : w;
        i += w.length;
        ult = CTL.has(w) || KW.has(w) ? w : 'id';
        continue;
      }
      if (ch === '<' && podeJSX() && /[A-Za-z>]/.test(texto[i + 1] || '')) { add('<', 't-ang'); i++; modos.push({ m: 'tag', fecha: false, nome: false }); ult = '<'; continue; }
      if ('([{'.includes(ch)) { abre(ch); i++; continue; }
      if (')]}'.includes(ch)) { fecha(ch); i++; continue; }
      if (ch === '=' && texto[i + 1] === '>') { add('=>', 't-kw'); i += 2; ult = '=>'; continue; }
      const op = /^(===|!==|\.\.\.|==|!=|&&|\|\||\?\?|[-+*/%=<>!?:;,.&|^~@#])/.exec(texto.slice(i, i + 3));
      const t = op ? op[0] : ch;
      if (t === '.') antesPonto = ultIdent;
      add(t, 't-pon'); i += t.length; ult = t;
    }
    return L;
  }

  function css(texto) {
    return texto.split('\n').map((linha) => {
      const out = [];
      const re = /(\s+)|(\/\*.*?\*\/)|([.#][\w-]+(?=[^:;]*\{|\s*$))|([\w-]+)(?=\s*:)|(#[0-9a-fA-F]{3,8})|(-?\d+(?:\.\d+)?(?:px|deg|%|em|rem)?)|([\w-]+)(?=\()|([\w-]+)|(.)/g;
      let m;
      while ((m = re.exec(linha))) {
        if (m[1]) out.push({ t: m[1], c: '' });
        else if (m[2]) out.push({ t: m[2], c: 't-com' });
        else if (m[3]) out.push({ t: m[3], c: 't-sel' });
        else if (m[4]) out.push({ t: m[4], c: 't-prop', id: m[4], estilo: true });
        else if (m[5]) out.push({ t: m[5], c: 't-str' });
        else if (m[6]) out.push({ t: m[6], c: 't-num' });
        else if (m[7]) out.push({ t: m[7], c: 't-fn', id: m[7] });
        else if (m[8]) out.push({ t: m[8], c: 't-str' });
        else out.push({ t: m[9], c: 't-pon' });
      }
      return out;
    });
  }

  function json(texto) {
    return texto.split('\n').map((linha) => {
      const out = [];
      const re = /(\s+)|("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|(true|false|null)|(.)/g;
      let m;
      while ((m = re.exec(linha))) {
        if (m[1]) out.push({ t: m[1], c: '' });
        else if (m[2]) { out.push({ t: m[2], c: m[3] ? 't-var' : 't-str' }); if (m[3]) out.push({ t: m[3], c: 't-pon' }); }
        else if (m[4]) out.push({ t: m[4], c: 't-num' });
        else if (m[5]) out.push({ t: m[5], c: 't-kw' });
        else out.push({ t: m[6], c: /[[\]{}]/.test(m[6]) ? 't-b1' : 't-pon' });
      }
      return out;
    });
  }

  function md(texto) {
    return texto.split('\n').map((linha) => {
      if (/^#/.test(linha)) return [{ t: linha, c: 't-md-h' }];
      const out = [];
      linha.split(/(`[^`]*`)/).forEach((p) => { if (p) out.push({ t: p, c: p[0] === '`' ? 't-str' : 't-txt' }); });
      return out;
    });
  }

  function simples(texto) {
    return texto.split('\n').map((linha) => (linha ? [{ t: linha, c: /^\s*#/.test(linha) ? 't-com' : 't-txt' }] : []));
  }

  SIM.sintaxe = {
    tokenizar(texto, lang) {
      if (lang === 'css') return css(texto);
      if (lang === 'json') return json(texto);
      if (lang === 'md') return md(texto);
      if (lang === 'txt') return simples(texto);
      return ts(texto, lang === 'tsx');
    },
    // Lista de identificadores "em uso" numa linha (para os sublinhados vermelhos).
    usos(tokens) {
      return (tokens || []).filter((p) => p.id && p.uso);
    },
  };
})();
