Payson Airport Campus — required image assets
=============================================
Place these four files in this folder (exact names). The page references them
directly; until they exist the layout still holds (dark framed panels), it just
shows the alt text.

REQUIRED (WebP):
  payson-aerospace-hero.webp   Cinematic golden-hour aerial rendering  (full-screen hero + "concept" side of the compare slider). Recommend ~2400x1350.
  payson-campus-plan.webp      Annotated dark aerial campus plan        (campus-concept section, with hotspots). Recommend ~2400x1350.
  payson-parcel-map.webp       Real parcel boundary aerial              (the "site" section). Recommend ~1600x1200.
  payson-street-view.webp      Current street-level condition           ("today" side of the compare slider). Recommend ~2400x1350.

OPTIONAL (AVIF, for best Lighthouse/perf — same base names):
  payson-aerospace-hero.avif, payson-campus-plan.avif,
  payson-parcel-map.avif, payson-street-view.avif
  If absent, browsers automatically fall back to the .webp versions.

Notes:
- Hero is eager-loaded with fetchpriority=high; all others lazy-load.
- The hotspot marker positions in the campus-concept section are illustrative
  (left/top percentages in index.html) — nudge them to match your plan image.
