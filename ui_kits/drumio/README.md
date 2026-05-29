# drumio — UI Kit

A working, sound-enabled recreation of the **drumio** play experience: an intro animation that resolves into a top-down drum kit you sit behind, a transport with a master **tempo/speed** control, groove presets, and **per-instrument pattern/speed** selectors.

Open `index.html`. The first load plays the intro (click to skip); after that, "Replay intro" re-runs it.

## What it demonstrates
- **Intro sequence** — the wordmark strikes in on a four-count with ripple rings, then enters the kit.
- **The Kit (throne view)** — 7 pads (`crash, ride, hi-hat, tom, floor, snare, kick`) laid out top-down as seen from the seat. Drums are solid heads, cymbals are rings. Each pad flashes white when it fires and carries a mini 8-step indicator. Hit pads with the mouse or keys (A/S/J/H/L/Q/E).
- **Transport** — primary play/stop, the master **TEMPO · SPEED** control (40–240 BPM with steppers + recessed fader), metronome click toggle, and a four-LED count display.
- **Grooves** — one-tap presets (Rock, Kick & Floor, Linear, Paradiddle, Ride Groove, Metronome).
- **Per-instrument speed** — a control rack where each piece gets its own rhythm pattern (Off / Quarters / Beats 1&3 / Beats 2&4 / Beat 1 / Offbeats / Eighths).
- **Real sound** — a compact Web Audio synth (`audio.js`) generates every drum and the metronome click; a high-precision look-ahead scheduler keeps timing tight (ported from the source repo).

## Files
| File | Role |
|---|---|
| `index.html` | Entry point + global layout/animation CSS. Loads React, Babel, and the modules below. |
| `audio.js` | Web Audio drum synthesis + metronome (`window.drumioAudio`). Plain JS. |
| `icons.jsx` | Lucide-style inline icon set (`Icon`). |
| `brand.jsx` | `LogoMark`, `Wordmark`, `Lockup`, `Led`. |
| `transport.jsx` | `PlayButton`, `TempoControl`, `ClickToggle`, `BeatCounter`, `Stepper`. |
| `pads.jsx` | Drum model (`PATTERNS`, `shouldPlay`, `INSTRUMENTS`), `DrumPad`, `KitStage`, `StepDots`. |
| `controls.jsx` | `DSelect`, `PatternRack`, `PRESETS`, `PresetChips`, `KeyHint`. |
| `app.jsx` | State, look-ahead scheduler, keyboard handling, `PlayView`, intro gate. |

## Reuse notes
- Components share scope via `window` (each `text/babel` block transpiles separately). Load order in `index.html` matters: audio → icons → brand → transport → pads → controls → intro → app.
- Tokens come from the root `colors_and_type.css` (linked as `../../colors_and_type.css`). Copy it alongside if you relocate the kit.
- This is a high-fidelity **cosmetic** recreation: timing/synthesis are real, but it isn't production-hardened (no persistence, no mobile keyboard, single 8-step bar).
