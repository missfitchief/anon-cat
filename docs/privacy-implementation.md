# Privacy implementation

## Application
No analytics, ad pixels, session replay, fingerprinting, visitor IP lookup, remote fonts, social embeds, wallet connector, form, identity input, camera/microphone/location request, or runtime media generation. Hero and redaction interactions operate only in the browser. Fictional file fields are hardcoded character copy. Incognito hides the cat and does not change network privacy.

## Browser storage
No application preference or identifier is read from or written to browser storage. The former motion preference is ignored, including a saved off value. No unique identifier or interaction history is created. Three local Performance API marks record poster decode, control readiness and first character motion in browser memory for development inspection; they are not stored or transmitted.

## Requests
The production page automatically requests only same-origin HTML, JS, CSS, artwork, fonts, and favicon. The official Monero link is a normal external navigation initiated by the visitor. Unconfigured socials are omitted; configured socials become ordinary external links with `noopener noreferrer`. No generation services are contacted by visitors. Generation uploads were part of the user-authorized production workflow.

## Hosting
A hosting provider/CDN may process IP addresses and maintain request logs for delivery and security. A private Sites deployment may add provider-controlled access/sign-in behavior. Application network tests cover the local production export; they do not prove the hosting provider records nothing. No website claim says “your IP is hidden,” “no logs anywhere,” or “untraceable.”

## Headers
`public/_headers` provides static-host security headers. The local production server applies CSP, MIME-sniff prevention, a restrictive permissions policy, and referrer policy. The CSP permits same-origin resources and inline scripts/styles required by Next export and GSAP; it blocks runtime third-party connections. Static hosting must support `_headers`; verify provider enforcement before relying on it. HSTS applies on HTTPS hosting only.

## Integration configuration
Working title is replaceable. `assetIdentifier` contains the exact official CA supplied by the user: `H9pPKejchJ9LCWpb1P8p4BmrjzCFARUmA7XtJK4pVhCZ`. The header and footer copy it only after a visitor activates the control; clipboard contents are never read by the application. The full address is selectable in the footer. `network` and `purchaseUrl` remain null, and `socials` is empty pending actual links. No chain, token standard, ticker, purchase destination or Monero affiliation is inferred from the address. Monero prose is sourced in `reference-audit.md`.
