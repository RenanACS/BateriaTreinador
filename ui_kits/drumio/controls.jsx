/* drumio — control surface: DSelect, PatternRack, Presets, KeyHint */

function DSelect({ value, options, onChange, width = 150 }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const current = options.find((o) => o.id === value) || options[0];
  return (
    <div ref={ref} style={{ position: 'relative', width }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', height: 38, padding: '0 12px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        background: value === 'off' ? 'var(--ink-850)' : 'var(--ink-700)',
        color: value === 'off' ? 'var(--fg-3)' : 'var(--fg)',
        border: '1px solid var(--border-soft)', borderRadius: 'var(--r-md)',
        boxShadow: 'var(--bevel)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
        letterSpacing: '0.04em',
      }}>
        <span>{current.label}</span>
        <span style={{ opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur)' }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40,
          background: 'var(--ink-800)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
          boxShadow: 'var(--shadow-3)', overflow: 'hidden', padding: 4,
        }}>
          {options.map((o) => (
            <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }} style={{
              width: '100%', textAlign: 'left', padding: '9px 10px', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              background: o.id === value ? 'var(--signal)' : 'transparent',
              color: o.id === value ? 'var(--fg-invert)' : 'var(--fg)',
              border: 'none', borderRadius: 'var(--r-sm)',
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            }}
              onMouseEnter={(e) => { if (o.id !== value) e.currentTarget.style.background = 'var(--ink-700)'; }}
              onMouseLeave={(e) => { if (o.id !== value) e.currentTarget.style.background = 'transparent'; }}>
              <span>{o.label}</span>
              <span style={{ opacity: 0.55, fontSize: 10 }}>{o.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PatternRack({ patterns, setPattern }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {INSTRUMENTS.map((inst) => {
        const active = patterns[inst.id] !== 'off';
        return (
          <div key={inst.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            padding: '8px 10px 8px 12px', borderRadius: 'var(--r-md)',
            background: 'var(--ink-850)', border: '1px solid var(--hairline)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: active ? 'var(--signal)' : 'var(--ink-600)',
                boxShadow: active ? 'var(--glow-sm)' : 'none',
              }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: active ? 'var(--fg)' : 'var(--fg-2)' }}>{inst.name}</span>
              <span className="ds-label" style={{ fontSize: 9, color: 'var(--fg-3)' }}>{inst.key}</span>
            </div>
            <DSelect value={patterns[inst.id]} options={PATTERNS} onChange={(v) => setPattern(inst.id, v)} width={138} />
          </div>
        );
      })}
    </div>
  );
}

const PRESETS = [
  { id: 'rock', name: 'Rock', patterns: { crash: 'off', ride: 'off', hihat: '8ths', tom: 'off', floorTom: 'off', snare: '2-4', kick: '1-3' } },
  { id: 'kickfloor', name: 'Kick & Floor', patterns: { crash: 'off', ride: 'off', hihat: 'off', tom: 'off', floorTom: 'off-b', snare: 'off', kick: 'q' } },
  { id: 'linear', name: 'Linear', patterns: { crash: 'off', ride: 'off', hihat: 'off-b', tom: 'off', floorTom: 'off', snare: '2-4', kick: '1-3' } },
  { id: 'paradiddle', name: 'Paradiddle', patterns: { crash: 'off', ride: 'off', hihat: 'off', tom: 'off', floorTom: 'q', snare: 'off-b', kick: '1-3' } },
  { id: 'ride', name: 'Ride Groove', patterns: { crash: 'off', ride: '8ths', hihat: 'off', tom: 'off', floorTom: 'off', snare: '2-4', kick: '1-3' } },
  { id: 'metronome', name: 'Metronome', patterns: { crash: 'off', ride: 'off', hihat: 'off', tom: 'off', floorTom: 'off', snare: 'off', kick: 'off' } },
];

function PresetChips({ active, onPick }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {PRESETS.map((p) => (
        <button key={p.id} onClick={() => onPick(p)} style={{
          padding: '7px 14px', cursor: 'pointer', borderRadius: 'var(--r-pill)',
          background: active === p.id ? 'var(--signal)' : 'var(--ink-750)',
          color: active === p.id ? 'var(--fg-invert)' : 'var(--fg-2)',
          border: active === p.id ? 'none' : '1px solid var(--border-soft)',
          boxShadow: active === p.id ? 'var(--glow-sm)' : 'var(--bevel)',
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.02em',
          transition: 'all var(--dur)',
        }}>{p.name}</button>
      ))}
    </div>
  );
}

function KeyHint() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-3)' }}>
      <Icon name="keyboard" size={16} />
      <span className="ds-small" style={{ color: 'var(--fg-3)' }}>Tap pads or use keys — A kick · S snare · J hat · H tom · L floor · Q crash · E ride</span>
    </div>
  );
}

Object.assign(window, { DSelect, PatternRack, PRESETS, PresetChips, KeyHint });
