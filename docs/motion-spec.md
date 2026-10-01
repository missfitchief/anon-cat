# Motion specification

## Rendering decision
The hero proof selected layered 2.5D. Blender renders charcoal architecture into matching RGBA background/foreground layers; a consistent high-resolution transparent character is composited between them. No WebGL, video playback, alpha-video dependency, or runtime generation service is needed. The mobile scene uses a separate Blender camera. The actual website composition is the authoritative final layout.

## Ownership
- HTML/CSS: layout, responsive art frame, physical rendered foreground layer.
- GSAP hero context: character travel, restrained glance, stance/step crossfade, peek visibility, breathing.
- Separate GSAP ScrollTrigger context: slight section heading translation. Content is never initially hidden.
- CSS: redaction bars and control hover feedback only.

## Hero state machine
`idle → hiding → peeking → returning → idle`

`hiding` and `returning` disable the scene button. A synchronous ref guards against rapid clicks before React renders. No click queue is retained. Timeline completion changes state. Turning motion off during transit settles into the intended final state and restores operability.

Idle uses a 3.5-second sine breathing half-cycle, only 0.6% vertical expansion anchored to the feet. Hide begins with a small sideways gesture, crossfades to the approved upright stepping shot, travels behind the rendered foreground slab, and pauses before revealing the peeking shot. The primary front's tail is on the trailing side, so its orange tip is concealed after its body. Return reverses the concealment and restores the standing pose. No upright/quadruped morph occurs. This is pose-based animation, not a claimed skeletal walking simulation.

Starting timing values live in `src/config/motion.ts`: hide 1.3s, peek 0.45s, return 1.1s, section shifts 0.6s. Button feedback uses 180ms. There is no pointer telemetry or autoplay audio.

## Reduced motion and visibility
OS reduced-motion starts the page quietly. A visible motion control saves only `anon-cat-motion` (`on`/`off`) locally. Reduced-motion hide/return is a direct state change; every outcome is announced by the status text. Decorative breathing pauses offscreen and while the document is hidden. Both GSAP contexts, listeners, and observers clean up on unmount. Native scrolling is retained.

For deterministic captures, tests set reduced motion, wait for fonts, and emit `anon-cat:freeze` when inspecting an animated state. The listener explicitly pauses the hero tween/timeline. No mixer exists in this pipeline.

## Scope and limitations
The approved textile is raster artwork: it cannot swim across geometry. The character source remains editable as image planes and source PNGs rather than a claimed fully modeled cat. The live Blender MCP bridge could not be reached; local Blender 5.2.1 LTS CPU rendering produced the scene. Blender camera/source actions are editable and packed; browser GSAP is the final motion implementation. Fine ear/tail articulation requires a further layer breakdown or skeletal production pass.
