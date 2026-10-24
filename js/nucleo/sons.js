/* Sons gerados pelo próprio navegador (Web Audio), sem arquivos de áudio. */
(function () {
  const SIM = window.SIM;
  let ctx = null;
  function audio() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function nota(freq, ini, dur, tipo, vol) {
    const a = audio();
    if (!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = tipo || 'sine';
    o.frequency.value = freq;
    const t = a.currentTime + (ini || 0);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function ruido(dur, vol) {
    const a = audio();
    if (!a) return;
    const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = a.createBufferSource();
    const f = a.createBiquadFilter();
    const g = a.createGain();
    f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 0.8;
    g.gain.value = vol || 0.08;
    s.buffer = buf; s.connect(f); f.connect(g); g.connect(a.destination);
    s.start();
  }
  const sons = {
    tecla: () => nota(1800 + Math.random() * 300, 0, 0.03, 'square', 0.012),
    erro: () => { nota(196, 0, 0.18, 'sawtooth', 0.06); nota(147, 0.08, 0.22, 'sawtooth', 0.05); },
    acerto: () => { nota(660, 0, 0.12, 'triangle', 0.11); nota(990, 0.09, 0.2, 'triangle', 0.11); },
    linha: () => nota(1320, 0, 0.07, 'sine', 0.05),
    tab: () => { ruido(0.14, 0.06); nota(880, 0.02, 0.09, 'sine', 0.05); },
    salvar: () => { nota(523, 0, 0.1, 'sine', 0.08); nota(784, 0.07, 0.16, 'sine', 0.08); },
    bloco: () => { [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.07, 0.18, 'triangle', 0.08)); },
    missao: () => { [392, 523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.09, 0.28, 'triangle', 0.1)); },
    clique: () => nota(1000, 0, 0.04, 'sine', 0.04),
    alerta: () => nota(740, 0, 0.12, 'sine', 0.06),
  };
  SIM.sons = {
    tocar(nome) {
      if (!SIM.S || !SIM.S.config || !SIM.S.config.som) return;
      try { (sons[nome] || sons.clique)(); } catch (e) { /* sem áudio */ }
    },
    destravar() { audio(); },
  };
})();
