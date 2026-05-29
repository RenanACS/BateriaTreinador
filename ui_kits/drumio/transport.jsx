/* drumio — transport: PlayButton, TempoControl, ClickToggle, BeatCounter */
const { useRef: _useRef } = React;

function PlayButton({ playing, onClick, size = 64 }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      aria-label={playing ? 'Stop' : 'Play'}
      style={{
        width: size, height: size, borderRadius: '50%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', flexShrink: 0,
        color: playing ? 'var(--fg)' : 'var(--fg-invert)',
        background: playing ? 'var(--ink-750)' : 'var(--signal)',
        boxShadow: playing
          ? 'var(--bevel), var(--shadow-1)'
          : (hover ? 'var(--glow-md), var(--shadow-2)' : 'var(--glow-sm), var(--shadow-2)'),
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform var(--dur) var(--ease-snap), box-shadow var(--dur), background var(--dur)',
        marginLeft: playing ? 0 : 0,
      }}
    >
      <span style={{ marginLeft: playing ? 0 : 3 }}>
        <Icon name={playing ? 'stop' : 'play'} size={size * 0.42} />
      </span>
    </button>
  );
}

function Stepper({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      width: 34, height: 34, borderRadius: 'var(--r-md)', cursor: 'pointer',
      background: 'var(--ink-750)', color: 'var(--fg)',
      border: '1px solid var(--border-soft)', boxShadow: 'var(--bevel)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  );
}

function TempoControl({ bpm, setBpm, min = 40, max = 240 }) {
  const pct = ((bpm - min) / (max - min)) * 100;
  const clamp = (v) => Math.max(min, Math.min(max, v));
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span className="ds-label">Tempo · Speed</span>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="ds-readout" style={{ fontSize: 30 }}>{bpm}</span>
          <span className="ds-label" style={{ color: 'var(--fg-3)' }}>BPM</span>
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Stepper onClick={() => setBpm(clamp(bpm - 1))}><Icon name="minus" size={16} /></Stepper>
        <div style={{ position: 'relative', flex: 1, height: 34, display: 'flex', alignItems: 'center' }}>
          {/* recessed track */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 8, borderRadius: 'var(--r-pill)',
            background: 'var(--ink-1000)', boxShadow: 'var(--inset-well)',
          }} />
          {/* filled portion */}
          <div style={{
            position: 'absolute', left: 0, width: `calc(${pct}% )`, height: 8,
            borderRadius: 'var(--r-pill)', background: 'linear-gradient(90deg, var(--ink-400), var(--signal))',
          }} />
          {/* tick marks */}
          {[0, 25, 50, 75, 100].map((t) => (
            <div key={t} style={{ position: 'absolute', left: `${t}%`, top: -7, width: 1, height: 4, background: 'var(--ink-500)' }} />
          ))}
          <input type="range" min={min} max={max} value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            style={{ position: 'absolute', left: 0, right: 0, width: '100%', margin: 0, zIndex: 2 }}
            className="drumio-range" aria-label="tempo" />
        </div>
        <Stepper onClick={() => setBpm(clamp(bpm + 1))}><Icon name="plus" size={16} /></Stepper>
      </div>
    </div>
  );
}

function ClickToggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Metronome click" title="Metronome click" style={{
      width: 48, height: 48, borderRadius: 'var(--r-md)', cursor: 'pointer', flexShrink: 0,
      background: on ? 'var(--signal)' : 'var(--ink-750)',
      color: on ? 'var(--fg-invert)' : 'var(--fg-2)',
      border: on ? 'none' : '1px solid var(--border-soft)',
      boxShadow: on ? 'var(--glow-sm)' : 'var(--bevel)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all var(--dur)',
    }}>
      <Icon name={on ? 'volume' : 'mute'} size={20} />
    </button>
  );
}

function BeatCounter({ currentStep, playing, beats = 4 }) {
  const activeBeat = playing ? Math.floor(currentStep / 2) : -1;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      {Array.from({ length: beats }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
          <Led on={activeBeat === i} accent={i === 0} size={12} />
          <span className="ds-label" style={{ fontSize: 9, color: activeBeat === i ? 'var(--fg)' : 'var(--fg-3)' }}>{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { PlayButton, TempoControl, ClickToggle, BeatCounter, Stepper });
