# Production verification — 2026-10-01

The subsequent brand update replaces the generic SVG cat with the exact supplied cat illustration in the header, footer and favicon. The original image is preserved unchanged; resized PNGs total 25,430 bytes. Logo display sizes are 52px on desktop and 44px on mobile, without changing header height. Production build, strict TypeScript, lint and three existing checks passed: desktop/mobile layout and the normal-production asset/request audit.

The artwork download gallery is replaced by **Leave no trace**. A cat enters an orange pool of light; visitors brush away its pawprints, clear the trail with a keyboard-accessible button, and replay the entrance. The cat settles into the seated pose after clearing. Navigation now reads The hideout; the existing #artwork anchor remains compatible. No decorative numbers, gallery choices or download links appear in the website.

The final production build passed, including strict TypeScript, and lint passed without warnings. The comprehensive Chromium run passed 36 of 37 checks. Its sole failure sampled the breathing transform before the offscreen IntersectionObserver callback had paused it. Verification now waits for the actual playback state before measuring a stationary transform. All six focused scene checks then passed against the final build, including that corrected offscreen assertion and two new resilience checks. No broader site behavior was changed after the comprehensive run.

Focused checks verify partial pointer brushing, keyboard clearing, pose changes, rapid clear/restart input, offscreen pausing, frozen capture behavior, preservation of the visible cat when the seated image fails, mobile touch interaction and native scrolling, no horizontal overflow, and a readable scene with native images without JavaScript. The scene was independently reviewed for cleanup, touch scrolling, input races and failed-image behavior.

The comprehensive pass covered existing hero automatic/manual motion and loading recovery, reload and re-entry, camera movement, redaction, forward/reverse privacy-story transitions and shutters, resize cleanup, short desktop heights, direct navigation, keyboard controls, five layout widths, native image loading, ignored old motion-off preferences, and a request audit. No automatic third-party requests, missing normal-production assets, browser page errors or hydration errors were found. Asset failures in resilience checks are deliberately simulated.

The earlier rendering repair, restored privacy cinema, removal of the motion switch, and decorative-number removal remain in current source. Earlier gallery/download checks describe superseded behavior and are retained only in the delivery history.

## Visual review

`trace-room-desktop.png`, `trace-room-cleared.png` and `trace-room-mobile.png` show the replacement. Five full-page screenshots cover 360, 390, 768, 1440 and 1920px widths. The actual production-browser recording includes hero motion, redaction, the restored privacy cinema and pawprint brushing. It contains no invented or composited website frames.

The mobile light pool starts below the headline so the orange words remain legible. Native vertical scrolling is preserved; the scene does not capture pointer input or prevent default touch behavior. Its long-lived entrance/breathing animations pause offscreen and when the tab is hidden. Capture freezing pauses all scene tweens; later actions settle immediately.

The character uses existing compressed cutouts. The entrance and pose change are layered 2.5D raster animation, not a claimed skeletal walk or fully rigged 3D cat. No additional generation charges were incurred; original use remains 22 of the approved 200 credits.

## Performance

Fresh Chromium contexts measured the Leave no trace export before the subsequent logo-only update, through the Brotli-enabled local production server. Its compression cache may already be warm; browser caches are fresh. These are single local lab samples, not field percentiles or guarantees for physical devices or the hosting provider.

| Condition | LCP | CLS | Controls ready | Automatic character starts |
| --- | ---: | ---: | ---: | ---: |
| 1440×900, localhost, unthrottled | 148 ms | 0 | 138 ms | 382 ms |
| 390×844, 4× CPU, 150ms latency, 1.6 Mbps download | 1,008 ms | 0.000009 | 2,496 ms | 3,599 ms |

Manual hero hide/peek takes 720ms and return takes 560ms after input. The replacement scene has a 1.6-second entrance, 260ms footprint dissolves and a 450ms seated-pose fade. The 175vh desktop privacy story remains confined to its own section. Raw timings, marks and resource transfer sizes are in `performance-results.json`; controls and character motion are reported separately because text LCP does not measure readiness of the full interaction.

The hero uses a 120,226-byte desktop WebP or 73,296-byte mobile poster. Hidden step/peek assets start after poster decode. The new scene reuses existing step/seated images and local GSAP, with no new animation library, video, generated artwork or remote request. Below-fold images use native lazy loading. Three local Latin font files replace larger full-subset imports. The server compresses text assets with Brotli and caches hashed Next.js assets immutably. Asset dimensions, sizes and SHA-256 hashes are in `asset-manifest.json`.

## Production provenance

Higgsfield generated the approved artwork during the original build. The unavailable Blender MCP bridge was replaced by local Blender 5.2.1 LTS CPU rendering, with dedicated geometry, packed image planes and editable authoring actions. No unrelated Blender scene was altered. Hosting/CDN processing and header enforcement are documented in `privacy-implementation.md`.
