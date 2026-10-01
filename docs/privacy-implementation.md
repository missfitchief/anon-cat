# Privacy implementation

## Application
No analytics, ad pixels, session replay, fingerprinting, visitor IP lookup, remote fonts, social embeds, wallet connector, form, identity input, camera/microphone/location request, or runtime media generation. Hero and redaction interactions operate only in the browser. Fictional file fields are hardcoded character copy. Incognito hides the cat and does not change network privacy.

## Browser storage
One optional device-local preference: `anon-cat-motion`, a shared non-unique string (`on` or `off`). Storage failures are caught, so private/restricted browser modes retain working controls. No unique identifier or interaction history is created.

## Requests
The production page automatically requests only same-origin HTML, JS, CSS, artwork, fonts, and favicon. The official Monero link is a normal external navigation initiated by the visitor. Unconfigured socials are omitted; configured socials become ordinary external links with `noopener noreferrer`. No generation services are contacted by visitors. Generation uploads were part of the user-authorized production workflow.

## Hosting
A hosting provider/CDN may process IP addresses and maintain request logs for delivery and security. A private Sites deployment may add provider-controlled access/sign-in behavior. Application network tests cover the local production export; they do not prove the hosting provider records nothing. No website claim says “your IP is hidden,” “no logs anywhere,” or “untraceable.”

## Headers
`public/_headers` provides static-host security headers. The local production server applies CSP, MIME-sniff prevention, a restrictive permissions policy, and referrer policy. The CSP permits same-origin resources and inline scripts/styles required by Next export and GSAP; it blocks runtime third-party connections. Static hosting must support `_headers`; verify provider enforcement before relying on it. HSTS applies on HTTPS hosting only.

## Integration configuration
Working title is replaceable. `network`, `purchaseUrl`, and `assetIdentifier` remain null. There is no invented deployment, token standard, contract, ticker, purchase destination, or affiliation. `socials` is empty pending actual links. Monero prose is sourced in `reference-audit.md`.
