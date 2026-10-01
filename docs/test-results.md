# Production verification — 2026-10-01

The static export after removing the motion switch passed `npm run build` (including strict TypeScript), lint, and all 30 Playwright Chromium checks.

The first-page recheck adds visible-pose assertions after manual return, scroll re-entry, and a delayed poster failure after hydration. It also verifies animation stays enabled without a switch, including with an obsolete saved off value or reduced-motion preference, survives reload, and emits no raw noscript image markup with JavaScript enabled. The previous autoplay cancellation and fallback failure are fixed; repeat rest is now 2.5 seconds.

The subsequent whole-page repair removes the noscript image branch and custom deferred-source visibility path entirely. Native image sources work without JavaScript. New movement tests verify file artwork waits for delayed image loads, replays on re-entry, all three privacy scenes translate and scale visibly, and camera tilt, CSS redaction and 3D portrait selection actually move after reload. `file-native-desktop.png` shows the clean seated-cat section.

Coverage includes automatic first-screen character performance and immediate interruption; sub-second manual hide/return; CTA/caption separation throughout entrance and hover at 360, 390, 768, 1440 and 1920px; mobile scene/copy separation; no horizontal overflow; native navigation without pinning; ignored legacy off settings and absence of the switch; 15 rapid hero clicks and 15 rapid portrait changes; accessible fictional redaction; all three actual 1024×1024 PNG downloads; keyboard skip/navigation; WebP failure recovery before and after hydration; poster-first request ordering; and ordinary artwork fallbacks with JavaScript disabled.

The production request audit found no automatic third-party requests, missing assets, browser console errors or hydration errors. Public financial destinations remain unconfigured. Browser performance marks are local and have no reporting endpoint. This pass incurred no new generation charges; total generation use remains 22 of the approved 200 credits.

## Visual review

Screenshots cover all five viewport sizes, including the new normal-flow mobile layout. Full-page captures scroll through deferred artwork and wait for actual image decoding. The normal-motion browser recording demonstrates the automatic hide/peek, manual return, pointer response, redaction, native scrolling and fast portrait choices. `hero-fast-desktop.png` shows stable CTA/caption spacing.

Independent inspection found no material loss in the compressed character's face openings, knit ribs, paws or attached tail. Fine textile grain is somewhat softer, and the existing pale edge fringe remains. The hero uses layered 2.5D pose animation, rather than a claimed skeletal gait. Full-resolution transparent PNGs and the packed Blender source remain available.

## Performance

The measurements below are from the preceding whole-page repair, before switch removal, using fresh browser contexts against the Brotli-enabled local production server. Its compression cache may already be warm; browser caches are fresh. The hosting provider has its own delivery behavior. These are lab samples, not field percentiles or guarantees for physical devices.

| Condition | LCP | CLS | Controls ready | Automatic character starts |
| --- | ---: | ---: | ---: | ---: |
| 1440×900, localhost, unthrottled | 148 ms | 0.022404 | 172 ms | 408 ms |
| 390×844, 4× CPU, 150ms latency, 1.6 Mbps download | 848 ms | 0.030525 | 2,638 ms | 3,777 ms |

Architectural CSS motion begins at 148ms and 845ms respectively. Manual action duration after input is 720ms for hide/peek and 560ms for return; portrait motion takes 380ms. First-screen text and controls do not translate. The old 175vh pinned story was removed.

Both LCP/CLS samples meet the original 2.5-second/0.1 targets. Controls and full character performance are reported separately because text LCP alone does not measure interaction readiness. Raw timings, local marks and transfer sizes are in `performance-results.json`. `performance-uncompressed.json` retains an earlier intermediate sample from the uncompressed preview and is not a measurement of the final source.

The desktop hero WebP is 120,226 bytes (44% smaller than its previous 216,302-byte version); mobile uses a 73,296-byte version. Hidden step/peek sprites total 135,766 bytes and begin after poster decode. Artwork below the fold loads according to native browser lazy-loading rules. Three local Latin font files replace five full-subset stylesheet imports. The preview compresses text assets with Brotli and caches hashed Next.js files immutably. All 23 local production artwork assets have dimensions, sizes and SHA-256 hashes in `asset-manifest.json`.

## Production provenance

Higgsfield generated the approved artwork during the original build. The unavailable Blender MCP bridge was replaced by local Blender 5.2.1 LTS CPU rendering, with dedicated geometry, packed character image planes and editable authoring actions. No unrelated Blender scene was altered. Hosting/CDN processing and header enforcement remain documented in `privacy-implementation.md`.
