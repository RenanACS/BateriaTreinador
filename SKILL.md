---
name: drumio-design
description: Use this skill to generate well-branded interfaces and assets for drumio, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

drumio is a black-and-white **drum simulator / practice tool** with a "studio hardware" aesthetic — near-black panels, machined grays, white as the one active "signal," Archivo + Space Mono type, line icons, and no color or emoji. The defining surface is a top-down drum kit seen from the player's seat, with a master tempo/speed control and per-instrument rhythm patterns.

Key files:
- `colors_and_type.css` — all design tokens (grayscale ramp, semantic roles, type, spacing, radii, elevation, glow, motion). Import or copy this first.
- `assets/logo-mark.svg` — the drumhead logomark.
- `ui_kits/drumio/` — a working, sound-enabled recreation. Reuse its JSX components (brand, transport, pads, controls, intro) and `audio.js` synth.
- `preview/` — specimen cards illustrating every token and component.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Hold the line on the brand: **monochrome only**, lowercase "drumio," uppercase mono labels, no hues, no emoji, white used sparingly as the hit/active signal, percussive ~110ms motion.
