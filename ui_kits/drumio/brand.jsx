/* drumio — brand atoms: LogoMark, Wordmark, Lockup, Led */

function LogoMark({ size = 40, stroke = 3.5 }) {
  const lugs = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    lugs.push(
      <circle key={i} cx={60 + Math.cos(a) * 53.5} cy={60 + Math.sin(a) * 53.5} r="3.4" fill="currentColor" />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ display: 'block', color: 'currentColor' }} aria-label="drumio">
      <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth={stroke} fill="none" />
      <circle cx="60" cy="60" r="38" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="60" cy="60" r="5.5" fill="currentColor" />
      {lugs}
    </svg>
  );
}

/* The wordmark: "drumi" + the final "o" as a drumhead ring */
function Wordmark({ size = 34, color = 'var(--fg)' }) {
  const ring = size * 0.78;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.06, color }}>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size,
        letterSpacing: '-0.05em', lineHeight: 1, color: 'inherit',
      }}>drumi</span>
      <svg width={ring} height={ring} viewBox="0 0 40 40" fill="none" style={{ marginLeft: -size * 0.02, marginBottom: -size * 0.02 }}>
        <circle cx="20" cy="20" r="16.5" stroke={color} strokeWidth={size * 0.115} fill="none" />
        <circle cx="20" cy="20" r="3" fill={color} />
      </svg>
    </div>
  );
}

function Lockup({ size = 40 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.34, color: 'var(--fg)' }}>
      <LogoMark size={size} />
      <Wordmark size={size * 0.82} />
    </div>
  );
}

/* Pulse LED used in the transport beat counter */
function Led({ on = false, accent = false, size = 11 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: on ? 'var(--signal)' : 'var(--ink-700)',
      boxShadow: on ? (accent ? '0 0 16px rgba(252,252,253,0.8)' : '0 0 10px rgba(252,252,253,0.5)') : 'var(--inset-well)',
      border: on ? 'none' : '1px solid var(--ink-600)',
      transition: 'background 0.08s linear, box-shadow 0.08s linear',
      display: 'inline-block',
    }} />
  );
}

Object.assign(window, { LogoMark, Wordmark, Lockup, Led });
