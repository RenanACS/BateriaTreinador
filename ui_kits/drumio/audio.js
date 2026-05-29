/* ============================================================
   drumio — lightweight Web Audio drum synth
   Synthesized kit + metronome click. No samples needed.
   Exposes window.drumioAudio with init/resume/getContext + per-piece triggers.
   ============================================================ */
(function () {
  let ctx = null;
  let master = null;

  function init() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    return ctx;
  }
  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }
  function getContext() { return ctx; }

  function noiseBuffer(dur) {
    const len = Math.floor((ctx.sampleRate) * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }
  function env(node, t, peak, dur, release) {
    node.gain.setValueAtTime(0.0001, t);
    node.gain.exponentialRampToValueAtTime(peak, t + 0.002);
    node.gain.exponentialRampToValueAtTime(0.0001, t + dur + release);
  }

  function playKick(t) {
    t = t || ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    env(g, t, 1.0, 0.12, 0.18);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.45);
  }
  function playSnare(t) {
    t = t || ctx.currentTime;
    const n = ctx.createBufferSource(); n.buffer = noiseBuffer(0.3);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1500;
    const ng = ctx.createGain(); env(ng, t, 0.7, 0.06, 0.12);
    n.connect(hp); hp.connect(ng); ng.connect(master);
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = 190;
    const og = ctx.createGain(); env(og, t, 0.4, 0.05, 0.08);
    o.connect(og); og.connect(master);
    n.start(t); n.stop(t + 0.3); o.start(t); o.stop(t + 0.2);
  }
  function hat(t, dur, peak) {
    const n = ctx.createBufferSource(); n.buffer = noiseBuffer(dur + 0.05);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000;
    const g = ctx.createGain(); env(g, t, peak, dur, 0.02);
    n.connect(hp); hp.connect(g); g.connect(master);
    n.start(t); n.stop(t + dur + 0.1);
  }
  function playHiHat(t) { hat(t || ctx.currentTime, 0.05, 0.4); }
  function playOpenHat(t) { hat(t || ctx.currentTime, 0.3, 0.4); }
  function tomTone(t, freq) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.18);
    env(g, t, 0.85, 0.16, 0.2);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.5);
  }
  function playTom(t) { tomTone(t || ctx.currentTime, 240); }
  function playFloorTom(t) { tomTone(t || ctx.currentTime, 130); }
  function cymbal(t, dur, peak, hpFreq) {
    const n = ctx.createBufferSource(); n.buffer = noiseBuffer(dur + 0.1);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = hpFreq;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 9000; bp.Q.value = 0.6;
    const g = ctx.createGain(); env(g, t, peak, dur, 0.3);
    n.connect(hp); hp.connect(bp); bp.connect(g); g.connect(master);
    n.start(t); n.stop(t + dur + 0.4);
  }
  function playCrash(t) { cymbal(t || ctx.currentTime, 0.7, 0.35, 5000); }
  function playRide(t) { cymbal(t || ctx.currentTime, 0.35, 0.22, 7000); }
  function playClick(t, accent) {
    t = t || ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'square';
    o.frequency.value = accent ? 2000 : 1200;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(accent ? 0.3 : 0.18, t + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.06);
  }

  const map = {
    kick: playKick, snare: playSnare, hihat: playHiHat, openhat: playOpenHat,
    tom: playTom, floorTom: playFloorTom, crash: playCrash, ride: playRide,
  };
  function trigger(id, t) { init(); resume(); (map[id] || (() => {}))(t); }

  window.drumioAudio = {
    init, resume, getContext,
    playKick, playSnare, playHiHat, playOpenHat, playTom, playFloorTom,
    playCrash, playRide, playClick, trigger,
  };
})();
