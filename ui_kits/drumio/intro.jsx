/* drumio — intro sequence: wordmark strikes in on a 4-count, then enters the kit */
function IntroSequence({ onDone }) {
  const [beat, setBeat] = React.useState(-1);   // -1 none, 0..3 count-in
  const [leaving, setLeaving] = React.useState(false);
  const [ripple, setRipple] = React.useState(0);

  const finish = React.useRef(false);
  const end = () => { if (finish.current) return; finish.current = true; setLeaving(true); setTimeout(onDone, 600); };

  React.useEffect(() => {
    const timers = [];
    // strike ripple right away
    timers.push(setTimeout(() => setRipple((r) => r + 1), 250));
    // four-count, each ~360ms
    [0, 1, 2, 3].forEach((b, i) => {
      timers.push(setTimeout(() => { setBeat(b); setRipple((r) => r + 1); }, 700 + i * 380));
    });
    // enter the kit
    timers.push(setTimeout(end, 700 + 4 * 380 + 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`drumio-intro ${leaving ? 'leaving' : ''}`} onClick={end} style={{
      position: 'absolute', inset: 0, zIndex: 100, background: 'var(--ink-1000)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 38,
      cursor: 'pointer',
    }}>
      {/* ripple rings emitting from the mark */}
      <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)', width: 0, height: 0 }}>
        {Array.from({ length: ripple }).map((_, i) => (
          <span key={i} className="drumio-ripple" />
        ))}
      </div>

      <div className="drumio-intro-lockup" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, position: 'relative' }}>
        <div style={{ color: 'var(--signal)' }}><LogoMark size={92} stroke={3.5} /></div>
        <Wordmark size={64} color="var(--signal)" />
      </div>

      {/* count-in LEDs */}
      <div style={{ display: 'flex', gap: 18 }}>
        {[0, 1, 2, 3].map((b) => (
          <Led key={b} on={beat >= b} accent={b === 0} size={13} />
        ))}
      </div>

      <span className="ds-label drumio-intro-tag" style={{ color: 'var(--fg-3)', letterSpacing: '0.4em', marginTop: 4 }}>
        take your seat
      </span>

      <span className="ds-small drumio-intro-skip" style={{ position: 'absolute', bottom: 28, right: 30, color: 'var(--fg-3)' }}>
        click to skip →
      </span>
    </div>
  );
}
Object.assign(window, { IntroSequence });
