/* drumio — app: scheduler + play view + intro gate */
const { useState, useEffect, useRef } = React;

const DEFAULT_PATTERNS = { crash: 'off', ride: 'off', hihat: '8ths', tom: 'off', floorTom: 'off', snare: '2-4', kick: '1-3' };

function PlayView({ onReplayIntro }) {
  const [bpm, setBpm] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [clickOn, setClickOn] = useState(true);
  const [patterns, setPatterns] = useState(DEFAULT_PATTERNS);
  const [currentStep, setCurrentStep] = useState(0);
  const [, setTick] = useState(false);
  const [activePreset, setActivePreset] = useState('rock');

  const playingRef = useRef(playing), bpmRef = useRef(bpm), patRef = useRef(patterns), clickRef = useRef(clickOn);
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { patRef.current = patterns; }, [patterns]);
  useEffect(() => { clickRef.current = clickOn; }, [clickOn]);

  // High-precision look-ahead scheduler (ported from the original trainer)
  useEffect(() => {
    let timerId = null, rafId = null;
    let nextNoteTime = 0, step = 0;
    const queue = [];
    const A = window.drumioAudio;

    const scheduleNote = (s, t) => {
      queue.push({ s, t });
      const p = patRef.current;
      if (shouldPlay(p.kick, s)) A.playKick(t);
      if (shouldPlay(p.floorTom, s)) A.playFloorTom(t);
      if (shouldPlay(p.snare, s)) A.playSnare(t);
      if (shouldPlay(p.hihat, s)) A.playHiHat(t);
      if (shouldPlay(p.tom, s)) A.playTom(t);
      if (shouldPlay(p.crash, s)) A.playCrash(t);
      if (shouldPlay(p.ride, s)) A.playRide(t);
      if (clickRef.current && s % 2 === 0) A.playClick(t, s === 0);
    };
    const advance = () => { const spb = 60 / bpmRef.current; nextNoteTime += spb / 2; step = (step + 1) % 8; };
    const loop = () => {
      const ctx = A.getContext(); if (!ctx) return;
      while (nextNoteTime < ctx.currentTime + 0.1) { scheduleNote(step, nextNoteTime); advance(); }
    };
    const visuals = () => {
      const ctx = A.getContext();
      if (ctx) { while (queue.length && queue[0].t <= ctx.currentTime) { setCurrentStep(queue[0].s); setTick((x) => !x); queue.shift(); } }
      if (playingRef.current) rafId = requestAnimationFrame(visuals);
    };
    if (playing) {
      A.resume(); const ctx = A.init();
      nextNoteTime = ctx.currentTime + 0.05; step = 0; queue.length = 0;
      timerId = setInterval(loop, 25); rafId = requestAnimationFrame(visuals);
    }
    return () => { if (timerId) clearInterval(timerId); if (rafId) cancelAnimationFrame(rafId); };
  }, [playing]);

  const togglePlay = () => { window.drumioAudio.init(); if (playing) { setPlaying(false); setCurrentStep(0); } else setPlaying(true); };
  const setPattern = (id, v) => { setPatterns((p) => ({ ...p, [id]: v })); setActivePreset(null); };
  const hit = (id) => window.drumioAudio.trigger(id);
  const pickPreset = (p) => { setPatterns(p.patterns); setActivePreset(p.id); };

  // keyboard hits
  useEffect(() => {
    const map = { KeyA: 'kick', Space: 'kick', KeyS: 'snare', KeyJ: 'hihat', KeyU: 'openhat', KeyH: 'tom', KeyL: 'floorTom', KeyQ: 'crash', KeyE: 'ride' };
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      const id = map[e.code]; if (!id) return; e.preventDefault(); hit(id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="drumio-play">
      <header className="drumio-topbar">
        <Lockup size={30} />
        <button className="drumio-ghost-btn" onClick={onReplayIntro}>
          <Icon name="replay" size={15} /> <span>Replay intro</span>
        </button>
      </header>

      <div className="drumio-stage-grid">
        {/* THE KIT — sitting at the throne */}
        <section className="drumio-panel drumio-kit-panel">
          <div className="drumio-panel-head">
            <span className="ds-label">The Kit</span>
            <KeyHint />
          </div>
          <KitStage patterns={patterns} currentStep={currentStep} playing={playing} onHit={hit} />
        </section>

        {/* CONTROL SURFACE */}
        <aside className="drumio-desk">
          <section className="drumio-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <PlayButton playing={playing} onClick={togglePlay} />
              <TempoControl bpm={bpm} setBpm={setBpm} />
              <ClickToggle on={clickOn} onToggle={() => setClickOn(!clickOn)} />
            </div>
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--hairline)' }}>
              <BeatCounter currentStep={currentStep} playing={playing} />
            </div>
          </section>

          <section className="drumio-panel">
            <div className="drumio-panel-head"><span className="ds-label">Grooves</span></div>
            <PresetChips active={activePreset} onPick={pickPreset} />
          </section>

          <section className="drumio-panel">
            <div className="drumio-panel-head">
              <span className="ds-label">Per-instrument speed</span>
              <Icon name="sliders" size={16} style={{ color: 'var(--fg-3)' }} />
            </div>
            <PatternRack patterns={patterns} setPattern={setPattern} />
          </section>
        </aside>
      </div>
    </div>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(() => sessionStorage.getItem('drumio-intro') !== 'seen');
  const enter = () => { sessionStorage.setItem('drumio-intro', 'seen'); setShowIntro(false); };
  return (
    <div className="drumio-root">
      {showIntro && <IntroSequence onDone={enter} />}
      <PlayView onReplayIntro={() => setShowIntro(true)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
