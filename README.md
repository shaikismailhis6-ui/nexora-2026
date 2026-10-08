# NEXORA 2K26 — Freshers Party Digital Invitation

Student flow: open site → enter roll number → validated against the official CSE + IT lists → personalised invitation (name + roll number) → share / save.

## Run
```
npm install
npm run dev        # development
npm run build      # type-check + production build (dist/)
npm run preview    # serve the production build
```

## Structure
- `public/invitation.jpg` – supplied invitation artwork (unmodified, source of truth)
- `public/audio/nexora-reveal.mp3` – audio track from supplied `motion.mp4`; plays only after the REVEAL button press
- `public/video/` – compressed cinematic background (from `motion.mp4`) + poster
- `data-source/roster.csv` – official roll → name data parsed from CSE.pdf / IT.pdf (379 students)
- `scripts/build-roster.mjs` – `npm run build:roster` regenerates `src/data/roster.generated.ts` (obfuscated, not plain text)
- `src/lib/layout.ts` – placement/fit of name + roll number inside the artwork panel (shared by screen and PNG export)

## Notes
- Roll numbers are matched exactly after trimming/removing spaces and upper-casing. O/0 and I/1 are NOT treated as equal (e.g. 26A81A05O0 vs 26A81A0500 are different).
- The app is fully client-side, so the roster can't be truly secret; it is only stored obfuscated and is never listed or searchable in the UI.
- To remove `data-source/roster.csv` from the repo you may delete it after generation; the app only needs `src/data/roster.generated.ts`.
