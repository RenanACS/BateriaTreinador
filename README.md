# drumio — Design System

**drumio** is a browser-based **drum simulator & practice tool**. You take a seat at a top-down drum kit, set a tempo, choose how each piece of the kit plays, and drill grooves and coordination against a rock-solid metronome. Hit pads with the mouse or keyboard, or let drumio play a pattern for you so you can practice along.

This design system defines a single, deliberate aesthetic — **monochrome "studio hardware."** Black and white only. The interface should feel like a premium piece of drum gear: machined-metal grays, near-black panels, recessed wells, and **white as the one true "signal" color** — it's the light that fires when a drum is hit, the metronome pulse, the active control.

---

## Sources

This system was built from one input repository, which provided the **functional model** of the product (instruments, rhythm patterns, metronome scheduler) — but **not** its visual direction. The original repo is a neon cyan/pink/purple glassmorphic prototype; drumio replaces that look entirely with the black-and-white hardware aesthetic documented here.

- **GitHub:** https://github.com/RenanACS/BateriaTreinador
  A React + TypeScript + Vite drum trainer ("DrumFlow" / "BateriaTreinador", UI in Portuguese). Worth exploring for the Web Audio synthesis engine and the rhythm-pattern logic — both were ported (and translated to English) into this system's UI kit.

If you have access to the repo, read `src/utils/webAudioEngine.ts` (drum synthesis) and `src/App.tsx` (the look-ahead scheduler) to build more faithful, sound-accurate prototypes.

---

## Content Fundamentals

**Voice — confident, lowercase, technical-but-warm.** drumio talks like a piece of well-made gear that respects the player. Short, direct, never chatty.

- **Casing:** The brand is always lowercase: **drumio** (never "Drumio" or "DRUMIO"). Control labels are **UPPERCASE, mono, letter-spaced** (`TEMPO · SPEED`, `THE KIT`, `GROOVES`). Headings are sentence case. Body is sentence case.
- **Person:** Address the player as **you** ("take your seat", "tap pads or use keys"). drumio refers to itself in the third person sparingly, or not at all.
- **Tone:** Instructional and encouraging without being cute. Imperatives are good: "set a tempo," "pick a groove," "drill it slow." Avoid exclamation marks and hype.
- **Numbers & units:** Always mono, tabular, with the unit as a small uppercase label — `100 BPM`, `8THS`, `1 · 3`. Tempo is the hero number.
- **No emoji.** The original prototype used 🥁💿 emoji on its pads; drumio explicitly removes them. Iconography is line-based (see Iconography). Unicode is used only for tiny functional glyphs (the `▾` dropdown caret, `·` separators).
- **Vocabulary:** Real drummer language — kick, snare, hi-hat, tom, floor tom, crash, ride, groove, offbeats, eighths, count-in, throne/seat. Keep it authentic to drummers.

**Example copy:**
> *take your seat* — (intro tagline)
> *Tap pads or use keys — A kick · S snare · J hat · H tom · L floor · Q crash · E ride*
> *Per-instrument speed*
> *Set the tempo, pick a groove, drill it slow.*

---

## Visual Foundations

**Overall vibe:** A dark control room. Immersive near-black canvas with a single warm-neutral light source falling from top-center. The player is "sitting at the kit," so the main surface is a **top-down stage** with the seat at the bottom edge.

- **Color:** Strictly grayscale. A cool-neutral ramp from `#060607` (void) to `#FCFCFD` (signal white). There are **no hues** — depth and state are communicated entirely through value, bevels, and the white glow. A light "paper" surface set (`#F4F3F1`) exists for documents/slides on white. See `colors_and_type.css`.
- **Type:** Two families only. **Archivo** (geometric grotesk) for the wordmark, headings, and pad names — heavy weights, tight tracking. **Space Mono** for every readout, label, and counter — this is what makes it feel like instrumentation. Display weights run 700–900; labels are 11px uppercase tracked `0.22em`.
- **Spacing:** 4 → 96px scale (4/8/12/16/24/32/48/64/96). Panels use 18–20px internal padding; the layout is a two-column "kit + control desk" grid that stacks under 940px.
- **Backgrounds:** No images, no photos, no gradients-as-decoration. The canvas is a near-black radial (light from top). The kit stage adds a faint **perspective floor grid** masked to fade toward the back, and a soft pool of light at the player's seat. A subtle **film grain** overlay (4% opacity SVG noise) sits over everything for a physical, matte feel.
- **Elevation:** Depth = a dark drop shadow + a 1px **top bevel highlight** (`inset 0 1px 0 rgba(255,255,255,.07)`). Inputs and tracks are **recessed wells** (inner shadow). Cards/panels are raised faces. No colored shadows.
- **The "signal":** White is reserved for energy. A hit, the active beat LED, the playing step, the selected control — all glow white (`box-shadow: 0 0 22px rgba(252,252,253,.45)`). Use it sparingly; if everything glows, nothing reads.
- **Pads:** Perfect circles. **Drums** are solid radial-shaded heads with a 2px rim and concentric inner ring; **cymbals** are lighter, thinner rings with two concentric circles. Each pad carries a 2-letter mono abbreviation, its name in Archivo, and a **mini 8-step dot indicator** showing its pattern at a glance.
- **Corners:** Machined, not pillowy. Radii: 4/6/10/14/20px and full pills for chips/LEDs. Pads and the logo are circles.
- **Borders:** Hairlines are `rgba(255,255,255,.06)`; structural borders use the gray ramp (`--ink-500/600`). Borders do real work here since there's no color to separate regions.
- **Motion:** Tight and percussive. Hits flash in **~110ms** (`cubic-bezier(.1,.7,.2,1)`) — quick attack, quick release, like a struck drum. The intro **strikes** in (scale + de-blur, 0.6s) on a four-count with expanding **ripple rings**. Transport/hover transitions are 0.22s ease-snap. No bounces, no float loops, no easing that feels soft.
- **Hover / press:** Hover lifts value (lighter surface) and, on the primary play button, intensifies the white glow + scales to 1.05. Press/active scales **down** slightly and brightens. Selected segmented/chip controls invert to a **white fill with dark text**.
- **Transparency & blur:** Used rarely. No glassmorphism (a deliberate departure from the source prototype). The only translucency is in hairlines, glow, and the grain overlay.

---

## Iconography

drumio uses **line icons in the Lucide style** — 24px grid, **2px stroke, round caps and joins**, `currentColor`. This matches the source repo, which used `lucide-react` (Play, Square, Volume2, VolumeX). Because the system must stay self-contained and offline-safe, the icons are authored as small inline-SVG React components (`ui_kits/drumio/icons.jsx`) in that exact visual style rather than pulled from a CDN — swap in real Lucide if you prefer; the stroke metrics match.

- **Transport/control glyphs:** `play` (filled triangle), `stop` (rounded square), `volume` / `mute`, `replay` (rotate-ccw), `plus` / `minus` (steppers), `metronome`, `keyboard`, `sliders`.
- **Brand logomark:** A **top-down drumhead** — an outer hoop, an inner head ring, a center beater dot, and **8 tension lugs** evenly around the rim. Monochrome, `currentColor`. Files: `assets/logo-mark.svg`; React versions `LogoMark` / `Wordmark` / `Lockup` in `ui_kits/drumio/brand.jsx`.
- **Wordmark:** "drumi" set in Archivo 800, with the final **"o" rendered as a drumhead ring** (a circle with a center dot) — tying the logotype to the logomark.
- **No emoji, no multicolor icons, no filled icon sets.** Fills are reserved for `play`/`stop` and tiny indicators.

---

## Font note

The brand fonts **Archivo** and **Space Mono** are loaded from **Google Fonts** (`@import` in `colors_and_type.css`). These were chosen to establish the new monochrome-hardware direction and replace the source prototype's Inter + Outfit. If you have licensed/self-hosted versions, drop the `.woff2` files in a `fonts/` folder and swap the `@import` for `@font-face`. **Flag:** these are Google-hosted substitutions, not original brand files — confirm they're acceptable or provide preferred faces.

---

## Index — what's in this system

| File / folder | What it is |
|---|---|
| `README.md` | This file — product context, content, visual foundations, iconography, manifest. |
| `colors_and_type.css` | All design tokens: grayscale ramp, semantic color roles, type families & scale, spacing, radii, elevation, glow, motion. Importable. |
| `SKILL.md` | Agent Skill manifest — how to use this system to design drumio assets. |
| `assets/logo-mark.svg` | The drumhead logomark (monochrome, `currentColor`). |
| `preview/` | Small HTML specimen cards that populate the Design System tab (color, type, components, brand). |
| `ui_kits/drumio/` | The product UI kit — a working, sound-enabled recreation of the drumio play experience (intro → kit → control desk). See its own `README.md`. |

### UI kits
- **`ui_kits/drumio/`** — the drum simulator. Intro animation, top-down kit stage, transport (play + tempo/speed + metronome), groove presets, and per-instrument pattern/speed selectors. Real Web Audio synthesis. Built from modular JSX components you can reuse.
