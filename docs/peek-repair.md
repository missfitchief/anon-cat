# Hiding-pose repair — 2026-10-01

The original peek bitmap ends horizontally through the torso. Its original face and all source images remain unchanged. HeroScene now composes the existing close-up with a masked body layer from the approved full-body hero artwork. A small alpha blend joins the layers; the lower mask puts the feet behind the foreground slab. Both layers share the same peek animation wrapper, so manual and automatic motion remain synchronized.

The anchor reproduces the original contain fit using both width and height limits. Mobile uses the same responsive hero image already loaded for the standing pose. The repair adds no media files or image bytes and preserves PNG fallback.

An imagegen extension was initially attempted but had not returned an output during implementation. It is not used in this delivery. No further generation job was launched. The implemented repair uses existing artwork and browser composition.

Final production captures are in docs/screenshots/peek-repaired-*.png. Ten existing browser checks passed; the final lower-mask refinement was subsequently build-checked and visually reviewed on mobile, tablet, ordinary desktop and short/wide desktops. The local production-browser recording was refreshed.
