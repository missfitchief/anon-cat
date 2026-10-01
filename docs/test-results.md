# Production verification — 2026-10-01

`npm run build`, `npm run lint`, and strict TypeScript validation passed. The cinematic upgrade's comprehensive Playwright Chromium run passed all 17 tests in 40.8 seconds. After correcting shutter transform offsets, the five dedicated motion tests passed again in 21.2 seconds, including an assertion that no shutter remains over the final scene.

Coverage: guarded hide/peek/return states and 15 rapid extra clicks; accessible fictional redaction; all three real 1024×1024 PNG downloads; reduced motion and switching motion off during transit; mobile navigation; one H1 and no horizontal overflow at 360×800, 390×844, 768×1024, 1440×900 and 1920×1080; normal animated state capture; keyboard skip/navigation; unconfigured financial controls; and PNG recovery when every WebP request is deliberately aborted, including before hydration.

The production request audit found zero automatic third-party requests, missing assets, browser console errors or hydration errors. Generation services and fonts do not require visitor-side external requests. npm audit reported zero known dependency vulnerabilities after the Sharp update.

New coverage: all three native-scroll privacy scenes and reverse scrolling; motion-off removes pin spacers and masks and survives reload; rapid portrait choices settle on the correct print/download; and full-motion 360px/390px layouts have no desktop pin or horizontal overflow. A bounded independent motion review checked transform ownership and cancellation; a competing decorative numeral transform was removed.

## Visual review

Desktop, mobile, peeking, three cinematic phases and portrait-stack screenshots are in `screenshots/`. Font readiness and explicit animation freezing make static captures reproducible. The live local browser and silent production browser recording exercise normal motion separately. The character's face, suit, paws, tail attachment, foreground occlusion and seated plinth were reviewed. The mobile composition uses its own camera and a stacked layout. Character travel uses approved pose changes; it is not a skeletal gait simulation. Fine ear/tail articulation and a separate blink are not implemented.

## Performance

Final production measurement, fresh Chromium contexts against the local static server:

| Condition | LCP | CLS |
| --- | ---: | ---: |
| 1440×900, localhost, unthrottled | 248 ms | 0.022404 |
| 390×844, 4× CPU slowdown, 150 ms network latency, 1.6 Mbps download | 1,564 ms | 0.030523 |

Both measured samples meet the brief's 2.5-second LCP and 0.1 CLS targets. These are single lab samples, not field percentiles or physical-device guarantees. Raw resources, timings and conditions are recorded in `performance-results.json`.

The hero WebP is 216,302 bytes. Matching transparent PNG fallbacks are intentionally larger. Desktop architecture background and foreground are approximately 30 KB and 11 KB. All 22 production artwork assets have dimensions, sizes and SHA-256 digests in `asset-manifest.json`.

## Production tooling limits

Higgsfield generated and exported the approved assets, using 22 of the user's approved 200 credits. The Blender MCP bridge was unreachable; local Blender 5.2.1 LTS successfully rendered the dedicated scene and saved packed editable character planes and named authoring actions. No unrelated Blender scene was altered. This delivery uses the brief's supported layered 2.5D alternative.

The animation upgrade reuses those assets and incurred no additional generation charges.

Public launch name, verified network relationship, social URLs and financial destinations remain unspecified in central configuration. The working name is ANON CAT. Hosting/CDN traffic and header enforcement are covered separately in `privacy-implementation.md`.
