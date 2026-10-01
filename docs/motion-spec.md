# Motion specification

## First screen

The hero keeps ordinary HTML text and controls stable. A CSS architectural arrival lasts 600ms and begins before React hydration; the foreground moves 65px on a separate layer over 550ms. Motion is enabled in the server-rendered document. No entrance mask, loader or control delay covers the page.

After the visible cat decodes, two low-priority pose requests are warmed. Once all three images are ready, the cat glances, crossfades to the approved upright stepping pose, moves right behind the actual Blender-rendered foreground slab, peeks around its edge, and returns. This short decorative performance lasts 1.7 seconds with a 2.5-second rest between repeats. Clicking immediately cancels it and starts the requested action. Feet-anchored breathing changes height by 1.2% over a 2.6-second half-cycle. Pointer tilt responds over 180ms and is limited to 4° horizontal, 2.5° vertical and 8px horizontal translation. Pointer values are neither saved nor transmitted.

The CTA and Monero caption use a flex column with a 22px gap (16px on mobile), without entrance or hover translation. On mobile the scene occupies its own grid row after the copy, replacing the old fixed top offset.

## Manual hero state machine

`idle → hiding → peeking → returning → idle`

A synchronous ref guards rapid clicks during manual transit, and the button is disabled only while that manual action runs. Hide consists of a 100ms glance, 80ms pose crossfade, 420ms travel and 180ms peek, using explicit overlapping positions; total 720ms. Return totals 560ms, including 480ms travel. Controls remain operable during the always-enabled experience.

The decorative performance and manual state are separate. A manual action cancels the decorative timeline, restores a known pose, and owns travel afterward. The cat remains peeking until Come back is selected; once that return finishes, automatic performance resumes after 200ms. Returning to the visible hero or foregrounding its browser tab restarts from a known standing pose. Successful PNG poster recovery remains eligible for automatic motion.

## Rest of the document

The original privacy cinema is restored on desktop at 1001px and above. Its 84svh stage pins at 6% of the viewport for 175vh of scroll travel, with direct progress and no scrub inertia. Peek transitions through three charcoal shutters into Walking on orange, then another wipe reveals Relaxed. The title enlarges as the scenes advance. The stage fits short desktop viewports. Compact screens use three stacked scenes with reversible scroll masks and image depth, without pinning.

ScrollTrigger is imported only within 800px of this section; its three images are then warmed to avoid empty masked scenes. Setup refreshes after font readiness. Late pin creation preserves the following viewport, and direct artwork hashes are realigned unless the visitor has started scrolling. MatchMedia removes pinning and desktop transforms on resize. Other sections keep brief repeatable entrances and native flow: the file rises 60px with a small rotation/disc expansion. The gallery and its downloads are removed. LeaveNoTrace owns the final hideout scene: a 1.6-second pose entrance lays a pawprint trail; pointer brushing or the keyboard/touch clear action dissolves prints in 260ms with small local fragments. Clearing the trail crossfades the cat into its seated pose, and Let him wander restores the entrance. Breathing and entry motion pause offscreen or when the tab is hidden. Touch uses native vertical scrolling. No visitor data, event telemetry or browser storage is added. Redaction finishes within 260ms. Ordinary image markup and a three-card fallback remain available without scripts.

## Ownership and loading

- CSS owns architectural arrival on `scene-camera`/foreground; these never share transforms with pointer or character motion.
- The hero GSAP context owns poses, glance, breathing, travel and the short scene action.
- Page GSAP owns pointer tilt on `scene-pointer` and repeatable below-fold reveals.
- PrivacyStory owns privacy frames, images, occluder, shutters, heading; PageMotion excludes those targets.
- Artwork GSAP owns print transforms inside its stage.

The high-priority poster is 120,226 bytes on desktop or 73,296 bytes on mobile. Hidden poses load after its decode. Below-fold artwork uses ordinary images with native lazy loading, low fetch priority and asynchronous decode; it works without hydration. No noscript image text or custom deferred-source visibility rule exists. Original transparent PNGs remain available for source and error recovery. Browser-only performance marks measure readiness; there is no reporting endpoint.

## Always-enabled motion, visibility and capture

The user requested removal of the motion switch and off mode. Animation is enabled in HTML and after hydration; obsolete saved off values are ignored. No motion preference is read or written. Ambient timelines pause offscreen and when the document is hidden. Contexts, listeners and observers clean up on unmount.

Tests wait for font/image readiness and emit `anon-cat:freeze` for reproducible animated-state captures. `scripts/capture-motion.mjs` records the actual production browser with no composited or invented frames.

## Artwork scope

The hero is layered 2.5D: Blender architectural geometry, matching background/foreground renders and approved transparent character images. The mobile scene has a separate Blender camera. There is no WebGL, runtime generation or video playback dependency. The knit cannot swim across geometry because it remains raster artwork. Pose animation does not claim a skeletal gait or fine ear/tail articulation. The unreachable Blender MCP bridge was replaced by documented local Blender 5.2.1 LTS CPU rendering; the editable `.blend` retains packed image planes and named authoring actions.
