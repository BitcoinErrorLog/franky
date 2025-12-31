# PWA Checklist

This document outlines the requirements and validation steps for maintaining Pubky as a production-quality Progressive Web App.

## Lighthouse PWA Audit

Run Lighthouse audit in Chrome DevTools (or via CLI) to validate PWA requirements.

### Required Scores

| Category | Minimum Score |
|----------|---------------|
| Performance | 70+ |
| Accessibility | 90+ |
| Best Practices | 90+ |
| SEO | 90+ |
| PWA | All checks pass |

### PWA Audit Checklist

- [ ] **Installable**
  - [ ] Uses HTTPS
  - [ ] Registers a service worker
  - [ ] Has a web app manifest with required fields
  - [ ] Has icons in required sizes (192x192, 512x512)

- [ ] **PWA Optimized**
  - [ ] Redirects HTTP to HTTPS
  - [ ] Configured for a custom splash screen
  - [ ] Sets an address-bar theme color
  - [ ] Content is sized correctly for the viewport
  - [ ] Has a `<meta name="viewport">` tag with `width` or `initial-scale`
  - [ ] Contains some content when JavaScript is not available

## Web App Manifest Validation

Validate at: https://manifest-validator.appspot.com/

### Required Fields

```json
{
  "name": "Pubky App",
  "short_name": "Pubky",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    { "src": "...", "sizes": "192x192", "type": "image/png" },
    { "src": "...", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Icon Requirements

| Size | Purpose | Required |
|------|---------|----------|
| 48x48 | Android home screen | Optional |
| 72x72 | Android home screen | Optional |
| 96x96 | Android home screen | Optional |
| 128x128 | Chrome Web Store | Optional |
| 144x144 | Windows tiles | Optional |
| 152x152 | iOS home screen | Optional |
| 180x180 | iOS home screen | Optional |
| 192x192 | Android home screen | **Required** |
| 384x384 | Android splash | Optional |
| 512x512 | Android splash, maskable | **Required** |

## Service Worker Verification

### Check Registration

Open Chrome DevTools → Application → Service Workers

Verify:
- [ ] Service worker is registered
- [ ] Status shows "activated and running"
- [ ] Scope covers entire origin (`/`)

### Check Caching

Open Chrome DevTools → Application → Cache Storage

Verify:
- [ ] Precache entries exist
- [ ] Runtime cache entries exist (api-cache)

### Check Offline Functionality

1. Open Chrome DevTools → Network
2. Enable "Offline" mode
3. Navigate to various pages
4. Verify:
   - [ ] Home page loads from cache
   - [ ] Offline fallback page shows for uncached routes
   - [ ] Cached content is accessible

## Install Prompt Testing

### Desktop (Chrome)

1. Navigate to pubky.app
2. Look for install icon in address bar (⊕)
3. Click to install
4. Verify app opens in standalone window

### Android (Chrome)

1. Navigate to pubky.app
2. Wait for install banner or tap menu → "Add to Home screen"
3. Verify app icon appears on home screen
4. Open app, verify standalone mode (no browser UI)

### iOS (Safari)

1. Navigate to pubky.app
2. Tap Share → "Add to Home Screen"
3. Verify app icon appears on home screen
4. Open app, verify standalone mode

## TWA Verification

### Digital Asset Links

Verify at: https://developers.google.com/digital-asset-links/tools/generator

1. Enter website: `https://pubky.app`
2. Enter package name: `app.pubky.twa`
3. Click "Test statement"
4. Verify: ✓ Grant found

### Asset Links File

```bash
curl -I https://pubky.app/.well-known/assetlinks.json
```

Verify:
- [ ] Status: 200 OK
- [ ] Content-Type: application/json
- [ ] No redirects

### TWA Chrome DevTools

1. Install TWA on Android device
2. Enable USB debugging
3. Connect to Chrome DevTools: `chrome://inspect`
4. Verify:
   - [ ] No "Digital Asset Links verification failed" errors
   - [ ] Service worker is active
   - [ ] No console errors

## Performance Optimization

### Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s - 4s | > 4s |
| FID (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

### Bundle Size

Monitor bundle size to ensure fast initial load:

```bash
npm run build
# Check .next/static size
```

Target: < 500KB initial JS bundle

## Troubleshooting

### Service Worker Not Registering

1. Ensure HTTPS (or localhost for dev)
2. Check console for registration errors
3. Verify `sw.ts` compiles correctly
4. Check Serwist configuration in `next.config.ts`

### Install Prompt Not Appearing

1. Must be served over HTTPS
2. Must have valid manifest
3. Must register service worker
4. User must not have already installed
5. User must have engaged with page (scroll, click)

### Offline Mode Not Working

1. Check service worker scope
2. Verify precache manifest generated
3. Check network strategy in `sw.ts`
4. Verify fallback routes configured

## Related Documentation

- [TWA Setup Guide](../pubky-mobile/README.md) (in pubky-mobile repo)
- [Serwist Documentation](https://serwist.pages.dev/)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

