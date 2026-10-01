# Motion specification

## Rendering decision
The hero proof selected layered 2.5D. Blender renders charcoal architecture into matching RGBA background/foreground layers; a consistent high-resolution transparent character is composited between them. No WebGL, video playback, alpha-video dependency, or runtime generation service is needed. The mobile scene uses a separate Blender camera. The actual website composition is the authoritative final layout.

## Ownership
- HTML/CSS: layout, responsive art frame, physical rendered foreground layer.
- GSAP hero context: character travel, restrained glance, stance/step crossfade, peek visibility, breathing.
- Separate page GSAP context: architectural arrival, responsive scroll camera, privacy shutters, file/artwork/footer staging and document progress. Transform wrappers separate arrival, scrolling, pointer tilt and character actions.
- Dedicated artwork context: layered print throws; changing selection reverts earlier tweens before starting the latest choice.
- CSS: redaction bars and control hover feedback only.

## Hero state machine
`idle → hiding → peeking → returning → idle`

`hiding` and `returning` disable the scene button. A synchronous ref guards against rapid clicks before React renders. No click queue is retained. Timeline completion changes state. Turning motion off during transit settles into the intended final state and restores operability.

Idle uses a 3.5-second sine breathing half-cycle, only 0.6% vertical expansion anchored to the feet. Hide begins with a small sideways gesture, crossfades to the approved upright stepping shot, travels behind the rendered foreground slab, and pauses before revealing the peeking shot. The primary front's tail is on the trailing side, so its orange tip is concealed after its body. Return reverses the concealment and restores the standing pose. No upright/quadruped morph occurs. This is pose-based animation, not a claimed skeletal walking simulation.

Starting timing values live in `src/config/motion.ts`: hide 1.3s, peek 0.45s, return 1.1s. The interaction now adds a 6% whole-stage camera push, settling as the peek or standing pose appears. Button feedback uses 180ms. There is no pointer telemetry or autoplay audio.

## Cinematic page choreography

The 2026-10-01 animation upgrade adds a roughly 1.8-second architectural arrival: three horizontal shutters move away, background geometry rises 100px, the foreground travels 170px, and the scene pulls back from 1.18× scale. Headline lines arrive with a 120ms stagger. Text and controls remain ordinary HTML; there is no loading gate. Narrow screens use a smaller 45px camera rise, 1.12× scale and 28px headline movement to preserve spacing.

Native scroll shifts the whole hero camera by up to 105px and scales it to 1.13× on desktop. Fine-pointer devices add a damped tilt of at most 4.5° horizontally and 3° vertically on a separate wrapper. Pointer positions are neither saved nor sent anywhere. Below the hero, the file artwork/seat arrives as a complete object, its orange disc expands, and fictional rows cascade into place.

Above 1000px, the ethos section becomes a pinned three-scene sequence spanning 175vh of native scroll. Three narrow charcoal shutters pass through the frames while peek, concealed step, and relaxed portraits replace one another. Slow image moves, an expanding YOURS label and a local progress indicator connect the scenes. Scrolling backward reverses the sequence. The shutters finish fully outside the image. On phones and tablets the three scenes remain stacked, with directional mask reveals and image movement; there is no desktop pin.

The artwork is a three-print stack. Selection throws the next print from a 45% horizontal offset and −28° depth rotation, settling over 850ms; the previous print moves behind it. Only the selected portrait is exposed to assistive technology, and its download updates immediately to the corresponding local PNG. Rapid selections cancel earlier contexts. The footer type and cameo arrive separately.

## Reduced motion and visibility
OS reduced-motion starts the page quietly. A visible motion control saves only `anon-cat-motion` (`on`/`off`) locally. Reduced-motion hide/return is a direct state change; every outcome is announced by the status text. Decorative breathing pauses offscreen and while the document is hidden. Both GSAP contexts, listeners, and observers clean up on unmount. Native scrolling is retained.

The motion control remains visible in a sticky header. Switching motion off reverts all pin spacers, masks, camera transforms and decorative staging, restoring the full static document. Reload respects the stored setting. Resize uses GSAP matchMedia to replace the desktop sequence with the mobile composition and clean up the former pin.

For deterministic captures, tests set reduced motion, wait for fonts, and emit `anon-cat:freeze` when inspecting an animated state. Listeners explicitly pause hero, page and portrait tweens/timelines. No mixer exists in this pipeline. `scripts/capture-motion.mjs` records the actual production browser without inventing or compositing frames.

## Scope and limitations
The approved textile is raster artwork: it cannot swim across geometry. The character source remains editable as image planes and source PNGs rather than a claimed fully modeled cat. The live Blender MCP bridge could not be reached; local Blender 5.2.1 LTS CPU rendering produced the scene. Blender camera/source actions are editable and packed; browser GSAP is the final motion implementation. Fine ear/tail articulation requires a further layer breakdown or skeletal production pass.
