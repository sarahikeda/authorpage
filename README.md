# authorpage

Static HTML/CSS prototype of author and narrator profile pages for Libro.fm
stakeholder review. See [DESIGN.md](DESIGN.md) for the full design doc
(problem, IA, page-by-page breakdown, trust model, rollout).

## Pages

- [index.html](index.html) — author profile (Eleanor Ashworth)
- [narrator.html](narrator.html) — narrator profile (Cassandra Lin)
- [claim.html](claim.html) — claim flow, step 2 (review profile + tag opt-in)
- [admin.html](admin.html) — admin profiles dashboard
- [styles.css](styles.css) — shared design tokens and components

## Run it

Open `index.html` in a browser. No build step, no dependencies — everything
is static HTML, CSS, and a small amount of vanilla JS in `js/`.

From the navigation:

- Author ↔ narrator pages cross-link via the credits section.
- "Claim this profile" on either profile jumps to the claim flow.
- The admin dashboard is reachable directly at `admin.html`.

## Design system

Matches the live Libro.fm visual system: white background, Larsseit/Inter
sans, teal `#5cc0bf` primary, purple `#7c5fe0` secondary, fully pill-shaped
buttons, low-radius cards with 1px borders. Tokens live at the top of
[styles.css](styles.css).

## Status

Prototype only — frontend mockup for stakeholder review. Backend wiring
(claim tokens, profile persistence, admin actions) is scaffolded separately
and not yet documented here.
