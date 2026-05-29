/* drumio — Lucide-style inline icons (24 grid, 2px stroke, round caps).
   Matches the repo's original lucide-react choice. */
function Icon({ name, size = 22, stroke = 2, fill = 'none', style = {} }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill,
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round',
    strokeLinejoin: 'round', style: { display: 'block', ...style },
  };
  switch (name) {
    case 'play':
      return <svg {...common} fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3" /></svg>;
    case 'stop':
      return <svg {...common} fill="currentColor" stroke="none"><rect x="5" y="5" width="14" height="14" rx="2.5" /></svg>;
    case 'volume':
      return <svg {...common}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></svg>;
    case 'mute':
      return <svg {...common}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" /><line x1="22" y1="9" x2="16" y2="15" /><line x1="16" y1="9" x2="22" y2="15" /></svg>;
    case 'replay':
      return <svg {...common}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>;
    case 'minus':
      return <svg {...common}><line x1="5" y1="12" x2="19" y2="12" /></svg>;
    case 'plus':
      return <svg {...common}><line x1="5" y1="12" x2="19" y2="12" /><line x1="12" y1="5" x2="12" y2="19" /></svg>;
    case 'metronome':
      return <svg {...common}><path d="M6 21h12" /><path d="M8 21 12 4l4 17" /><path d="m12 4 5 9" /><path d="M9.2 14h5.6" /></svg>;
    case 'keyboard':
      return <svg {...common}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></svg>;
    case 'sliders':
      return <svg {...common}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /><circle cx="9" cy="6" r="2.2" fill="var(--surface)" /><circle cx="15" cy="12" r="2.2" fill="var(--surface)" /><circle cx="8" cy="18" r="2.2" fill="var(--surface)" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="9" /></svg>;
  }
}
Object.assign(window, { Icon });
