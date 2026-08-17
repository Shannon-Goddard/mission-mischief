# Mission Mischief — Rebuild Plan
**Started:** 2025 | **Status:** In Progress  
**Goal:** PWA launch with Lemon Squeezy monetization, consolidated onboarding, cloud save, and SEO

---

## The Why

The original build was designed as a webview app. We're pivoting to a **Progressive Web App (PWA)** — same install experience on iOS and Android, no app store, no build pipeline, no fees. The existing infrastructure (GitHub Pages, AWS Lambda, DynamoDB) doesn't change at all. We're adding a monetization layer ($4.99 license key via Lemon Squeezy), consolidating a fragmented onboarding into one clean screen, splitting bloated files into maintainable modules, and adding SEO so people can actually find this thing.

---

## New Page Structure

### Before
```
index.html          → landing (no SEO, noindex set)
funny-tos.html      → FAFO + mugshot
app.html            → user setup form + dashboard + ALL game logic
bounty-hunter.html  → war board (heavy, standalone)
badge-overlay.html  → photo overlay tool
research-data.html  → research viewer
admin.html          → cost monitoring
```

### After
```
index.html              → rebuilt landing with SEO + "Get Mayhem's Key" CTA
funny-tos.html          → FAFO + mugshot (unchanged, just redirect target changes)
unlock.html             → NEW: key entry + name + location + QR code (all at once)
app.html                → dashboard only (setup logic removed)
bounty-hunter.html      → war board (minor cleanup)
badge-overlay.html      → unchanged
research-data.html      → unchanged
admin.html              → unchanged
sw.js                   → NEW: service worker for PWA
manifest.json           → NEW: PWA manifest
sitemap.xml             → NEW: SEO sitemap
robots.txt              → NEW: updated (remove noindex from public pages)
```

---

## Phase 1 — PWA Foundation
*Make it installable before anything else. Zero gameplay changes.*

- [ ] **Create `manifest.json`**
  - App name: "Mission Mischief"
  - Short name: "MissionMischief"  
  - Display: `standalone` (no browser chrome, feels native)
  - Background/theme color: `#000000`
  - Start URL: `/index.html`
  - Icons: use existing favicon + apple-touch-icon, add 192x192 and 512x512 versions
  - Orientation: `portrait`

- [ ] **Create `sw.js` (Service Worker)**
  - Cache shell: index, app, bounty-hunter, unlock, all CSS/JS assets
  - Strategy: Cache-first for assets, network-first for API calls
  - Offline fallback: show cached dashboard if AWS is unreachable
  - Background sync: queue mission submissions when offline, send when back online

- [ ] **Add PWA meta tags to all HTML files**
  - Link to manifest.json
  - Add `theme-color` meta
  - Verify `apple-mobile-web-app-capable` already present (it is in app.html and bounty-hunter.html, add to others)
  - Add "Add to Home Screen" prompt logic in main.js

- [ ] **Generate PWA icons**
  - Need: 192x192 and 512x512 PNG versions of the Mayhem mascot or logo
  - Existing: favicon.png and apple-touch-icon.png (check sizes, may need upscaling)

---

## Phase 2 — File Separation
*Split the bloated files before adding new features. Much easier to build unlock.html into clean code.*

### `app.html` — Remove and extract:

- [ ] **Extract `cheater.js`**
  - Pull the entire Cheater Redemption Zone logic out of app.html inline script
  - Functions: `loadCheaterMissions()`, `toggleCheaterMissions()`, `toggleMissionCheat()`, `processClownSelfie()`, `downloadClownSelfie()`, `shareClownSelfie()`, `uploadBeerProof()`, `downloadBeerProof()`, `shareBeerProof()`
  - Save to: `assets/js/cheater.js`

- [ ] **Extract `toast.js`**
  - Pull `showToast()` function — currently duplicated across app.html and bounty-hunter.html
  - Save to: `assets/js/toast.js`
  - Update all files to use the shared version

- [ ] **Extract `upload.js`**
  - Pull the mission upload modal logic: `showMissionCamera()`, `handleFileUpload()`, `processUpload()`, `processImage()`, `processVideo()`, `addOverlaysToCanvas()`, `downloadResult()`, `shareProcessed()`
  - Save to: `assets/js/upload.js`

- [ ] **Remove user setup section from `app.html`**
  - The entire `#userSetup` section and its form logic moves to `unlock.html`
  - `app.html` now assumes the user is already set up — if no key/user found, redirect to `unlock.html`
  - Remove: location loading, QR positioning, `showUserSetup()`, `loadStates()`, `loadCities()`, `filterCities()`, all toggle functions for country/state/city other fields

- [ ] **Update `app.html` init logic**
  - Old check: `if (!Storage.isFAFOCompleted()) → funny-tos.html`
  - New check: `if (!Storage.isUnlocked()) → unlock.html`
  - `isUnlocked()` = has valid license key stored in localStorage

- [ ] **Add script tags to `app.html`**
  - Add: `cheater.js`, `toast.js`, `upload.js`

### `storage.js` — Add new fields:

- [ ] **Add license key fields to `defaultUser`**
  ```javascript
  licenseKey: null,        // Lemon Squeezy license key
  keyValidated: false,     // Validated against LS API at least once
  keyValidatedDate: null,  // When it was last validated
  cloudSaveEnabled: false, // Whether AWS cloud save is active
  ```

- [ ] **Add `isUnlocked()` method**
  - Returns `true` if `user.licenseKey` exists and `user.keyValidated === true`

- [ ] **Add `saveKey(key, userData)` method**
  - Stores key, sets `keyValidated: true`, saves all user data at once
  - Triggers AWS cloud save sync

- [ ] **Add `syncToCloud()` method**
  - Pushes full user object to AWS DynamoDB keyed by license key
  - Called on: unlock, mission completion, badge earn, honor change

- [ ] **Add `loadFromCloud(key)` method**
  - Pulls user data from AWS by license key
  - Called on: first unlock on a new device
  - Merges with localStorage (cloud wins on conflicts)

---

## Phase 3 — Lemon Squeezy Integration
*The monetization layer. $4.99 per key, one-time purchase.*

### Lemon Squeezy Setup (manual steps, not code):
- [ ] Create Loyal9 LLC store on Lemon Squeezy
- [ ] Create product: "Mission Mischief — Mayhem's Key" at $4.99
- [ ] Enable license key generation for the product
- [ ] Set confirmation/redirect URL to: `https://missionmischief.online/unlock.html?key={license_key}`
  - Lemon Squeezy supports `{license_key}` as a dynamic parameter in redirect URLs
- [x] **Update Lemon Squeezy webhook URL** to `https://4q1ybupwm0.execute-api.us-east-1.amazonaws.com/prod/webhook`
- [ ] Customize receipt email:
  > *"Mayhem says thanks for the beer 🍺*  
  > *Your key: {license_key}*  
  > *Keep this email — Mayhem will definitely lose his copy.*  
  > *If you switch devices, go to missionmischief.online and enter your key to restore your progress."*
- [ ] Note the Store ID and Product ID for the validation API call

### AWS Lambda — Key Validation:
- [ ] **Create `license-validation-lambda.py`**
  - Endpoint: `POST /validate-key`
  - Calls Lemon Squeezy License API: `POST https://api.lemonsqueezy.com/v1/licenses/validate`
  - Request body: `{ "license_key": "ABC-123-XYZ", "instance_name": "username" }`
  - Returns: `{ valid: true/false, error: null }`
  - Stores validated key + username in DynamoDB `mission-mischief-users` table
  - Why Lambda and not client-side: keeps Lemon Squeezy API key secret, prevents key spoofing

- [ ] **Add `/validate-key` route to existing API Gateway**
  - Same API: `https://4q1ybupwm0.execute-api.us-east-1.amazonaws.com/prod/`
  - Add CORS headers

### AWS Lambda — Cloud Save:
- [ ] **Create `cloud-save-lambda.py`**
  - `POST /save` — saves full user JSON to DynamoDB keyed by license key
  - `GET /load?key=ABC-123-XYZ` — returns user JSON for that key
  - Validates key exists before allowing save/load
  - DynamoDB table: `mission-mischief-users` (new table)

---

## Phase 4 — `unlock.html` (New File)
*The consolidated onboarding screen. Replaces app.html user setup entirely.*

### How it works:
1. User arrives from Lemon Squeezy redirect: `unlock.html?key=ABC-123-XYZ`
   - Key field auto-populated from URL parameter
2. User arrives manually (lost key, new device): `unlock.html`
   - Key field empty, they type it in
   - On valid key entry for existing account → load from cloud → skip to dashboard
3. User fills out the form and hits "UNLOCK THE CHAOS"
4. Lambda validates key against Lemon Squeezy
5. On success: save to localStorage + sync to AWS → redirect to `funny-tos.html`
   - Wait — FAFO hasn't been done yet on first run
   - On return visits (key already validated): skip straight to `app.html`

### The screen:
```
🍺 MAYHEM'S KEYS

[Mayhem drunk mascot image]

"I may have traded them for a beer. Worth it."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

License Key:     [ABC-123-XYZ        ] ← auto-filled from URL or typed
Your Name:       [                   ]
Country:         [▼ Select           ]
State/Province:  [▼ Select           ]
City:            [                   ] ← filter-as-you-type

Upload QR Code:  [Choose File        ] ← with existing drag/zoom UI

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        [🍺 UNLOCK THE CHAOS]

Already have an account on another device?
Enter your key above to restore your progress.

Don't have a key? → [Get Mayhem's Key - $4.99]
```

### Logic flow:
- [ ] On page load: check URL for `?key=` param, auto-fill if present
- [ ] On key entry (blur/paste): hit `/validate-key` silently, show ✅ or ❌
- [ ] If key is valid AND user already exists in cloud: show "Welcome back! Restore your progress?" button → load from cloud → `app.html`
- [ ] If key is valid AND new user: show full form (name, location, QR)
- [ ] On submit: validate all fields → call `/validate-key` → save localStorage → sync to AWS → redirect
- [ ] If FAFO not completed: redirect to `funny-tos.html`
- [ ] If FAFO completed: redirect to `app.html`
- [ ] QR code drag/zoom UI: copy exactly from current `app.html` setup section

### `funny-tos.html` change:
- [ ] Change redirect target from `app.html` → `app.html` (no change needed — FAFO already redirects to app.html, and app.html now checks for key instead of FAFO)
- Actually: `completeFAFOAndContinue()` currently goes to `app.html` — this stays the same ✅

---

## Phase 5 — `index.html` Rebuild
*The public face. Currently has `noindex` set — nobody can find this game.*

### SEO fixes:
- [ ] **Remove `noindex`** — the landing page MUST be indexable
  - `app.html`, `bounty-hunter.html`, `funny-tos.html`, `unlock.html` keep noindex (game internals)
  - `index.html` and legal pages become public

- [ ] **Add proper meta tags**
  ```html
  <title>Mission Mischief — Real-World Chaos Game | $4.99</title>
  <meta name="description" content="The world's first social verification game. Complete 51 real-world missions, earn badges, and settle disputes with beer. Get Mayhem's key for $4.99.">
  <meta name="keywords" content="real world game, scavenger hunt app, social game, outdoor game, mission game, prank game, community game">
  
  <!-- Open Graph (Facebook, Discord previews) -->
  <meta property="og:title" content="Mission Mischief — Real-World Chaos Game">
  <meta property="og:description" content="51 real-world missions. Beer Justice trials. Community chaos. Get Mayhem's key for $4.99.">
  <meta property="og:image" content="https://missionmischief.online/assets/images/mascot/mayhem-excited.png">
  <meta property="og:url" content="https://missionmischief.online">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Mission Mischief — Real-World Chaos Game">
  <meta name="twitter:description" content="51 real-world missions. Beer Justice trials. Get Mayhem's key for $4.99.">
  <meta name="twitter:image" content="https://missionmischief.online/assets/images/mascot/mayhem-excited.png">
  
  <!-- Canonical -->
  <link rel="canonical" href="https://missionmischief.online">
  ```

- [ ] **Add JSON-LD structured data**
  ```json
  {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "Mission Mischief",
    "description": "Real-world social verification game with 51 missions",
    "url": "https://missionmischief.online",
    "applicationCategory": "Game",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "4.99",
      "priceCurrency": "USD"
    }
  }
  ```

### Landing page content rebuild:
- [ ] **Hero section** — "Mayhem Lost His Keys Again 🍺"
  - Mayhem drunk mascot image (need drunk variant or use existing excited)
  - Tagline: *"He may have traded them for a beer. Worth it."*
  - Primary CTA: `[Get Mayhem's Key — $4.99]` → Lemon Squeezy product URL
  - Secondary CTA: `[Already have a key? Enter here]` → `unlock.html`

- [ ] **What is this game** section
  - 51 real-world missions
  - Beer Justice trials
  - Community leaderboards
  - Badge system

- [ ] **How it works** section (3 steps)
  1. Get Mayhem's key ($4.99)
  2. Complete the FAFO agreement + mugshot
  3. Do ridiculous things in public for points

- [ ] **Social proof / screenshots** section
  - Badge grid preview
  - Sample missions
  - Beer Justice explanation

- [ ] **Footer** — add sitemap link, keep existing legal links

---

## Phase 6 — SEO Supporting Files

- [ ] **Create `sitemap.xml`**
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>https://missionmischief.online/</loc><priority>1.0</priority></url>
    <url><loc>https://missionmischief.online/core-game-files/legal/terms-of-service.html</loc></url>
    <url><loc>https://missionmischief.online/core-game-files/legal/privacy-policy.html</loc></url>
    <url><loc>https://missionmischief.online/core-game-files/legal/eula.html</loc></url>
  </urlset>
  ```

- [ ] **Update `robots.txt`**
  ```
  User-agent: *
  Allow: /
  Disallow: /core-game-files/app.html
  Disallow: /core-game-files/bounty-hunter.html
  Disallow: /core-game-files/admin.html
  Disallow: /core-game-files/funny-tos.html
  Disallow: /unlock.html
  Sitemap: https://missionmischief.online/sitemap.xml
  ```

- [ ] **Create `robots.txt`** (doesn't currently exist)

- [ ] **Submit to Google Search Console**
  - Add property for missionmischief.online
  - Submit sitemap.xml
  - Request indexing for index.html

- [ ] **Submit to Bing Webmaster Tools**

---

## Phase 7 — Additional Website Features
*Things a real website needs that we're missing.*

- [ ] **`404.html`** — custom not found page
  - Mayhem looking confused
  - "Mayhem lost this page too. Probably traded it for a beer."
  - Link back to index.html
  - GitHub Pages supports custom 404 automatically

- [ ] **`jointhechaos.html`** — review existing file, update with new key CTA
  - Currently exists but may have outdated content

- [ ] **Open Graph image** — `og-image.png` (1200x630px)
  - Used when links are shared on social media / Discord / iMessage
  - Should show Mayhem + game title + "Real-World Chaos Game"
  - Save to: `assets/images/ui/og-image.png`

- [ ] **Google Analytics or Plausible**
  - Need to know if anyone is actually landing on the page
  - Plausible is privacy-friendly, $9/month, no cookie banner needed
  - Google Analytics is free but requires cookie consent banner (GDPR)
  - Recommendation: Plausible — fits the vibe, no legal headache

- [ ] **Cookie consent banner** (if using Google Analytics)
  - Required for EU visitors
  - Skip this if using Plausible

- [ ] **Performance audit**
  - Google Fonts are loaded on every page — consider self-hosting or using `font-display: swap`
  - AOS animation library only used on index.html — remove from other pages
  - Bootstrap Icons CDN — already using, fine

---

## Phase 8 — Testing Checklist
*Before calling it done.*

### PWA
- [ ] Lighthouse PWA audit score 90+
- [ ] "Add to Home Screen" prompt appears on Android Chrome
- [ ] "Add to Home Screen" works on iOS Safari
- [ ] App launches in standalone mode (no browser chrome)
- [ ] Offline: cached pages load without internet
- [ ] Offline: mission submission queues and sends when back online

### Lemon Squeezy Flow
- [ ] Purchase completes → redirect to `unlock.html?key=ABC-123`
- [ ] Key auto-populates in field
- [ ] Key validates successfully against Lambda
- [ ] Receipt email arrives with key and restore instructions
- [ ] Invalid key shows error message
- [ ] Already-used key on new device → loads cloud save

### Onboarding Flow
- [ ] `index.html` → Lemon Squeezy → `unlock.html?key=` → form → `funny-tos.html` → mugshot → `app.html`
- [ ] Returning player with key: `unlock.html` → key entry → cloud load → `app.html`
- [ ] All form fields validate correctly
- [ ] QR code drag/zoom works on mobile
- [ ] Location dropdowns populate correctly

### Cloud Save
- [ ] Complete mission on device A → shows on device B after key entry
- [ ] Honor score syncs across devices
- [ ] Badges sync across devices
- [ ] Submissions sync across devices

### SEO
- [ ] `index.html` returns 200, is indexable
- [ ] Meta tags render correctly (check with Facebook Debugger, Twitter Card Validator)
- [ ] Structured data validates (Google Rich Results Test)
- [ ] Sitemap submitted and accepted in Search Console
- [ ] Page speed score 80+ on mobile (Google PageSpeed Insights)

### Mobile (iPhone 16 Pro)
- [ ] Landing page renders correctly
- [ ] Unlock page form usable with one thumb
- [ ] QR upload and positioning works
- [ ] Dashboard centering correct
- [ ] Bounty hunter Crown of Chaos not clipped
- [ ] All buttons correct colors

---

## File Change Summary

| File | Action | Why |
|------|--------|-----|
| `index.html` | Rebuild | SEO, new CTA, Mayhem key narrative |
| `unlock.html` | Create new | Consolidated onboarding |
| `funny-tos.html` | No change | Already works, redirect stays same |
| `app.html` | Remove setup section | Moved to unlock.html |
| `bounty-hunter.html` | Minor cleanup | Remove debug console.logs |
| `assets/js/storage.js` | Add key/cloud methods | License key + cloud save support |
| `assets/js/cheater.js` | Extract from app.html | Separation of concerns |
| `assets/js/toast.js` | Extract from app.html | Shared utility |
| `assets/js/upload.js` | Extract from app.html | Separation of concerns |
| `manifest.json` | Create new | PWA requirement |
| `sw.js` | Create new | PWA offline + background sync |
| `sitemap.xml` | Create new | SEO |
| `robots.txt` | Create new | SEO |
| `404.html` | Create new | Website completeness |
| `BUILD_ARTIFACTS/license-validation-lambda.py` | Create new | Key validation |
| `BUILD_ARTIFACTS/cloud-save-lambda.py` | Create new | Cross-device save |

---

## Build Order

Do these in order. Each phase depends on the previous.

```
1. PWA Foundation (manifest + sw.js)        ← no dependencies
2. File Separation (extract JS files)        ← before touching app.html
3. storage.js updates                        ← before unlock.html
4. Lemon Squeezy account setup              ← manual, do in parallel
5. Lambda functions (validate + cloud save) ← needs LS account for API key
6. unlock.html                              ← needs storage.js + Lambda
7. app.html cleanup                         ← needs unlock.html done first
8. index.html rebuild                       ← needs LS product URL
9. SEO files (sitemap, robots, 404)         ← needs index.html done
10. Testing                                 ← everything done
```

---

*Last updated: Session 2025*  
*Co-authored: Shannon Goddard & Amazon Q*
