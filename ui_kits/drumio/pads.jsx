/* drumio — drum model + pads + top-down kit stage */

// Rhythm patterns over an 8-step (eighth-note) 4/4 bar. Ported from the original trainer.
const PATTERNS = [
  { id: 'off',     label: 'Off',        short: '—',     steps: () => false },
  { id: 'q',       label: 'Quarters',   short: '1 2 3 4', steps: (s) => s % 2 === 0 },
  { id: '1-3',     label: 'Beats 1 & 3', short: '1 · 3', steps: (s) => s === 0 || s === 4 },
  { id: '2-4',     label: 'Beats 2 & 4', short: '2 · 4', steps: (s) => s === 2 || s === 6 },
  { id: '1',       label: 'Beat 1',     short: '1',     steps: (s) => s === 0 },
  { id: 'off-b',   label: 'Offbeats',   short: '& & &', steps: (s) => s % 2 === 1 },
  { id: '8ths',    label: 'Eighths',    short: '8ths',  steps: () => true },
];
const PATTERN_BY_ID = Object.fromEntries(PATTERNS.map((p) => [p.id, p]));
const shouldPlay = (pid, step) => (PATTERN_BY_ID[pid] || PATTERN_BY_ID.off).steps(step);

// kind: 'drum' (solid head) or 'cymbal' (ring). pos in % of stage. d = diameter scale.
const INSTRUMENTS = [
  { id: 'crash',    name: 'Crash',    abbr: 'CR', kind: 'cymbal', x: 24, y: 15, d: 116, key: 'Q' },
  { id: 'ride',     name: 'Ride',     abbr: 'RD', kind: 'cymbal', x: 76, y: 17, d: 124, key: 'E' },
  { id: 'hihat',    name: 'Hi-Hat',   abbr: 'HH', kind: 'cymbal', x: 13, y: 47, d: 98,  key: 'J' },
  { id: 'tom',      name: 'Tom',      abbr: 'T1', kind: 'drum',   x: 41, y: 32, d: 92,  key: 'H' },
  { id: 'floorTom', name: 'Floor',    abbr: 'FT', kind: 'drum',   x: 83, y: 53, d: 122, key: 'L' },
  { id: 'snare',    name: 'Snare',    abbr: 'SN', kind: 'drum',   x: 35, y: 60, d: 106, key: 'S' },
  { id: 'kick',     name: 'Kick',     abbr: 'KK', kind: 'drum',   x: 52, y: 82, d: 150, key: 'A' },
];

// Mini 8-step indicator shown on each pad
function StepDots({ pid, currentStep, playing }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 5 }}>
      {Array.from({ length: 8 }).map((_, s) => {
        const fires = shouldPlay(pid, s);
        const here = playing && currentStep === s;
        return (
          <span key={s} style={{
            width: 4, height: 4, borderRadius: '50%',
            background: fires ? (here ? 'var(--signal)' : 'var(--ink-200)') : 'var(--ink-600)',
            boxShadow: fires && here ? '0 0 6px rgba(252,252,253,0.9)' : 'none',
            transition: 'background 0.06s linear',
          }} />
        );
      })}
    </div>
  );
}

function DrumPad({ inst, pid, currentStep, playing, onHit, scale = 1 }) {
  const [flash, setFlash] = React.useState(false);
  const isCymbal = inst.kind === 'cymbal';
  const active = pid !== 'off';
  const hitNow = playing && shouldPlay(pid, currentStep);
  const size = inst.d * scale;

  React.useEffect(() => {
    if (hitNow) { setFlash(true); const t = setTimeout(() => setFlash(false), 110); return () => clearTimeout(t); }
  }, [currentStep, playing]);

  const manualHit = () => { onHit(inst.id); setFlash(true); setTimeout(() => setFlash(false), 110); };

  const ring = isCymbal
    ? `radial-gradient(circle at 50% 42%, var(--ink-700), var(--ink-850) 60%, var(--ink-900))`
    : `radial-gradient(circle at 50% 38%, var(--ink-750), var(--ink-850) 62%, var(--ink-1000))`;

  return (
    <button
      onClick={manualHit}
      aria-label={inst.name}
      style={{
        position: 'absolute', left: `${inst.x}%`, top: `${inst.y}%`,
        transform: `translate(-50%, -50%) scale(${flash ? 1.04 : 1})`,
        width: size, height: size, borderRadius: '50%', cursor: 'pointer', padding: 0,
        background: ring,
        border: isCymbal ? '1.5px solid var(--ink-500)' : '2px solid var(--ink-600)',
        boxShadow: flash
          ? `0 0 0 2px var(--signal), var(--glow-md), var(--shadow-2)`
          : (active
              ? `inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 1px rgba(255,255,255,0.10), var(--shadow-2)`
              : `var(--bevel), var(--shadow-1)`),
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 2, color: active ? 'var(--fg)' : 'var(--fg-2)',
        transition: 'transform 0.11s var(--ease-hit), box-shadow 0.11s var(--ease-hit)',
        zIndex: inst.id === 'kick' ? 5 : 2,
      }}
    >
      {/* concentric rings to read as a drumhead / cymbal */}
      <span style={{
        position: 'absolute', inset: isCymbal ? '14%' : '12%', borderRadius: '50%',
        border: `1px solid ${isCymbal ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}`,
        pointerEvents: 'none',
      }} />
      {isCymbal && <span style={{ position: 'absolute', inset: '30%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)', pointerEvents: 'none' }} />}
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-3)' }}>{inst.abbr}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.max(12, size * 0.13), letterSpacing: '-0.01em', lineHeight: 1 }}>{inst.name}</span>
      <StepDots pid={pid} currentStep={currentStep} playing={playing} />
    </button>
  );
}

function KitStage({ patterns, currentStep, playing, onHit }) {
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '16 / 11',
      borderRadius: 'var(--r-xl)',
      background: 'radial-gradient(ellipse 70% 55% at 50% 88%, rgba(255,255,255,0.045), transparent 70%), var(--ink-900)',
      border: '1px solid var(--border-soft)', boxShadow: 'var(--inset-well)', overflow: 'hidden',
    }}>
      {/* floor perspective grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 95%, #000, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 95%, #000, transparent 75%)',
      }} />
      {/* "your seat" marker at bottom */}
      <div style={{ position: 'absolute', left: '50%', bottom: 8, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.6 }}>
        <span className="ds-label" style={{ fontSize: 8.5, color: 'var(--fg-3)' }}>your seat</span>
      </div>
      {INSTRUMENTS.map((inst) => (
        <DrumPad key={inst.id} inst={inst} pid={patterns[inst.id]} currentStep={currentStep} playing={playing} onHit={onHit} />
      ))}
    </div>
  );
}

Object.assign(window, { PATTERNS, PATTERN_BY_ID, shouldPlay, INSTRUMENTS, DrumPad, KitStage, StepDots });
