# Full Body Forge PWA

A mobile-first, offline-capable workout planner and tracker.

## Included
- A/B/C full-body rotation for 5 or 6 training days
- Exercise switching by movement pattern and available equipment
- Set, rep, load and reps-in-reserve logging
- Double-progression recommendations based on previous performance
- Body-weight and workout history stored on-device
- Installable PWA manifest and offline service worker

## Publish
This must be served over HTTPS for full PWA installation and offline behaviour. Upload the folder to a static host such as GitHub Pages, Cloudflare Pages, Netlify or Vercel. No build command is required.

## iPhone installation
Open the published HTTPS address in Safari, tap Share, then Add to Home Screen.

## Data
All data is stored in the browser's localStorage on that device. Clearing website data removes it.
