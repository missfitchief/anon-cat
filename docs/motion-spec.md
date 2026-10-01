# Motion specification

## First screen

The hero keeps ordinary HTML text and controls stable. A CSS architectural arrival lasts 600ms and begins before React hydration; the foreground moves 65px on a separate layer over 550ms. The saved motion preference and OS reduced-motion setting are read before paint. No entrance mask, loader or control delay covers the page.

After the visible cat decodes, two low-priority pose requests are warmed. Once all three images are ready, the cat glances, crossfades to the approved upright stepping pose, moves right behind the actual Blender-rendered foreground slab, peeks around its edge, and returns. This short decorative performance lasts 1.7 seconds with a 2.5-second rest between repeats. Clicking immediately cancels it and starts the requested action. Feet-anchored breathing changes height by 1.2% over a 2.6-second half-cycle. Pointer tilt responds over 180ms and is limited to 4° horizontal, 2.5° vertical and 8px horizontal translation. Pointer values are neither saved nor transmitted.

The CTA and Monero caption use a flex column with a 22px gap (16px on mobile), without entrance or hover translation. On mobile the scene occupies its own grid row after the copy, replacing the old fixed top offset.

## Manual hero state machine

`idle → hiding → peeking → returning → idle`

A synchronous ref guards rapid clicks during manual transit, and the button is disabled only while that manual action runs. Hide consists of a 100ms glance, 80ms pose crossfade, 420ms travel and 180ms peek, using explicit overlapping positions; total 720ms. Return totals 560ms, including 480ms travel. Turning motion off during transit settles at the requested destination and restores operability. With reduced motion, outcomes change immediately.

The decorative performance and manual state are separate. A manual action cancels the decorative timeline, restores a known pose, and owns travel afterward. The cat remains peeking until Come back is selected; once that return finishes, automatic performance resumes after 200ms. Returning to the visible hero or foregrounding its browser tab restarts from a known standing pose. Successful PNG poster recovery remains eligible for automatic motion.

## Rest of the document

Native scrolling has no pin spacers, scrub inertia or extra story scroll distance. IntersectionObserver starts brief 400–550ms reveals as artwork/headings enter the viewport. Content remains visible if scripts fail. A passive, frame-coalesced scroll listener updates the header's document progress line. Portrait selection updates its accessible label and real local PNG download immediately; a 380ms print throw follows, cancelling earlier contexts on rapid choices. Redaction bars finish in at most 260ms, including stagger.

## Ownership and loading

- CSS owns architectural arrival on `scene-camera`/foreground; these never share transforms with pointer or character motion.
- The hero GSAP context owns poses, glance, breathing, travel and the short scene action.
- Page GSAP owns pointer tilt on `scene-pointer` and one-shot below-fold reveals.
- Artwork GSAP owns print transforms inside its stage.

The high-priority poster is 120,226 bytes on desktop or 73,296 bytes on mobile. Hidden poses load after its decode, and below-fold images start within 350px of the viewport. Ordinary `noscript` images preserve artwork without JavaScript. Original transparent PNGs remain available for source and error recovery. Browser-only performance marks measure readiness; there is no reporting endpoint.

## Reduced motion, visibility and capture

OS reduced-motion defaults decorative movement off. An explicit Motion on choice overrides that default, including CSS and page interactions; Motion off disables it. Only `anon-cat-motion` (`on`/`off`) is stored locally. Ambient timelines pause offscreen and when the document is hidden. Contexts, listeners and observers clean up on unmount. Disabling motion reverts transforms and cancels automatic character performance; reload respects the saved preference.

Tests wait for font/image readiness and emit `anon-cat:freeze` for reproducible animated-state captures. `scripts/capture-motion.mjs` records the actual production browser with no composited or invented frames.

## Artwork scope

The hero is layered 2.5D: Blender architectural geometry, matching background/foreground renders and approved transparent character images. The mobile scene has a separate Blender camera. There is no WebGL, runtime generation or video playback dependency. The knit cannot swim across geometry because it remains raster artwork. Pose animation does not claim a skeletal gait or fine ear/tail articulation. The unreachable Blender MCP bridge was replaced by documented local Blender 5.2.1 LTS CPU rendering; the editable `.blend` retains packed image planes and named authoring actions.
