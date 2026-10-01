# ANON CAT — Private by instinct

A complete one-page character experience built with Next.js App Router, React, strict TypeScript, local fonts, and GSAP. “ANON CAT” is a replaceable working name. This independent project is inspired by Monero's privacy ethos; no token/network deployment, endorsement, social account, or purchase infrastructure is assumed.

## Run

Requires Node.js 20.9+ and npm.

```sh
npm ci
npm run dev       # http://127.0.0.1:3000
npm run lint
npm run typecheck
npm run build
npm run start     # production export: http://127.0.0.1:3001
npx playwright install chromium
npm run test:e2e
```

`npm run start` serves `out/` with the documented security headers, Brotli for text assets, and immutable caching for hashed Next.js assets. Build first. The production deliverable is a static export, so there is no database, runtime backend, secret, or generation API.

## Experience

1. A charcoal Blender-rendered hideout with a consistent orange cat in a fitted gray knitted disguise. `Go incognito` uses explicit guarded idle/hide/peek/return states.
2. A warm editorial fictional character file. Redaction changes only supplied character details and provides accessible “withheld” alternatives.
3. A short illustrated privacy sequence with restrained, sourced Monero copy and an ordinary link to its official website.
4. Three coherent square portraits with working local PNG downloads, plus a quiet cameo and return-to-top.

All content and controls are HTML. Animations are enabled throughout, with no motion switch or stored off preference. No autoplay audio, scroll hijacking, fake loader, wallet request, tracking, or runtime third-party font/media request.

The hero keeps its 600ms architectural arrival, automatic hide/peek/return, 180ms pointer response and fixed text/CTA. Manual hide/peek finishes in 720ms and return in 560ms. The original privacy cinema is restored on desktop: a large image stage beside the heading moves through Peek, Walking and Relaxed scenes with shutter wipes and chapter progress over 175vh of scrolling. Scroll progress responds immediately without scrub lag. Compact screens retain three stacked scenes with scroll-driven mask reveals. Portrait changes settle in 380ms. The sticky header keeps navigation available; animations remain enabled. `PrivacyStory.tsx` owns only the privacy stage and loads its ScrollTrigger code near that section; PageMotion and other components retain their own transforms.

Automatic character motion repeats with a 2.5-second rest, resumes after Come back, and replays on returning to the hero or browser tab. PNG poster recovery can animate. The motion switch and saved preference were removed at the user’s request; animation stays enabled after reload.

The visible hero uses a 120KB desktop WebP or 73KB mobile WebP. Hidden poses start loading only after the visible cat is decoded. Noncritical artwork uses native browser lazy loading with low request priority and real image sources, including without JavaScript. There is no custom noscript image branch. Section entrances wait for image decoding and replay on re-entry. Three local Latin font files cover the site. Full-resolution PNG masters remain available. Performance marks remain in the browser and are never transmitted.

## Change the project

- **Name, copy, navigation, socials, network details:** `src/config/site.ts`. Add real social URLs to `socials`; absent links are omitted. Keep financial/network values null until their relationship and destination are verified. No financial UI is rendered by the current application.
- **Metadata:** `src/app/layout.tsx`. The current private staging site uses `noindex`; change only when a public launch is intended.
- **Typography and layout:** `src/app/globals.css`; the local font packages are Barlow Condensed and DM Sans. Font packages include their OFL licenses in `node_modules/@fontsource/*`.
- **Timing:** `src/config/motion.ts`. Hero state logic is in `src/components/hero/HeroScene.tsx`; page motion is a separate component. Do not allow multiple systems to own the same transforms.
- **Artwork:** replace files under `public/assets/`, preserving alpha, dimensions, composition and file names or updating central asset paths. PNGs in `portraits/` are actual 1024×1024 downloads; WebP files are display previews. Source masters remain in `art-source/`.
- **Motion:** always enabled; no application preference is read from or written to browser storage.

## Editable artwork and Blender

`art-source/character-bible/` contains the locked front, turnaround, expressions/poses and design notes. `art-source/generation-notes/` records actual generation jobs, prompts, costs and output provenance. The rendered scene is `art-source/blender/anon-cat-hideout.blend`.

The hero pipeline is deliberately **layered 2.5D**, with true Blender architectural geometry and camera-facing character image planes. It is not a claimed fully modeled/rigged 3D cat. The gray material is a textile disguise, not gray fur. Its high-resolution raster knit remains stable during animation.

The live Blender MCP connector was inspected but could not reach Blender, including after a dedicated bridge launch. Local Blender 5.2.1 LTS rendered the architectural layers successfully and saved the editable file. No unrelated Blender work was cleared or overwritten. The local render is a documented fallback, not a claimed successful MCP call.

Re-export the architecture:

```sh
blender --background --factory-startup --python art-source/blender/build_scene.py
blender --background --python art-source/blender/render_file_plinth.py
blender --background --python art-source/blender/add_character_layers.py
```

Use the installed Blender executable's full path if it is not on PATH. The first script creates its own named scene. It produces 1400px RGBA desktop background/foreground and a separate mobile camera background. The second renders the file section's seat. The third opens this dedicated file, packs approved character image textures, and creates named idle/hiding/peeking/returning authoring actions. Adjust cameras/materials in the `.blend`; final browser motion lives in GSAP. `scripts/optimize-environments.mjs` exports WebP production layers after rendering.

## Verification and delivery

- `docs/reference-audit.md` and `reference-screenshots/`: actual point-in-time inspection of both equally valued reference URLs, preserving original URLs and noting the Claynosaurz redirect/media limitation.
- `docs/motion-spec.md`: rendering selection, state behavior, ownership, timings and limitations.
- `docs/privacy-implementation.md`: collection/storage/requests and hosting caveats.
- `docs/asset-manifest.json`: exact local asset sizes, dimensions and SHA-256 digests.
- `docs/test-results.md`, `docs/performance-results.json` and `docs/screenshots/`: actual production validation.

Helpers: `node scripts/measure.mjs`, `node scripts/asset-manifest.mjs`, and `node scripts/reference-audit.mjs`. The latter is a reproducible reference capture, not application code. Playwright tests use Chromium and all five requested viewport sizes. Performance measurements are emulated conditions, not claims about every visitor's network or physical device.

`node scripts/capture-motion.mjs` saves a silent recording of the actual production website to `../anon-cat-motion-preview.webm`, demonstrating automatic character motion, quick concealment/return, redaction, native scrolling and portrait selection.

## Deployment

`.openai/hosting.json` identifies the private Site and its `out/` static directory. Never create a second Site to update this project. Build the exact source state and follow the Sites source/version publishing workflow. An expected deployment URL is not proof of successful publication; use the actual successful deployment result recorded in delivery notes.

Static hosts should enforce `public/_headers` (copied to `out/_headers`). Verify the deployment provider's support. Application privacy does not hide a visitor's IP from their hosting/CDN provider.
