# Mission Mischief — Full Restructure Plan
> Written by Amazon Q. Reference this doc when chat compacts so we don't lose context.

---

## Why We're Doing This

`app.html` is doing too much — it holds the dashboard, all 51 mission cards, the cheater redemption zone, beer justice, camera logic, clown selfie processing, and ~600 lines of inline JS. On iPhone 16 Pro it was rendering a blank screen because one null reference crashed the whole init chain silently.

The goals of this restructure:
1. **Split `app.html` into 3 focused pages** — dashboard, missions, jail
2. **Consolidate CSS** — eliminate repeated inline styles across every page
3. **Create a shared `base.css`** that every page loads for common layout/header/footer
4. **Create `sticky.css`** for all fixed/sticky UI elements (back buttons, nav, toasts)
5. **Organize pages into folders** with their own scoped JS
6. **Keep `assets/` at root** as the single shared resource directory

---

## Current State (What Exists Now)

### Pages
```
/index.html                          ← landing page (stays at root, untouched)
/unlock.html                         ← key entry + profile setup
/404.html                            ← error page
/jointhechaos.html                   ← marketing page
/core-game-files/
    app.html                         ← THE PROBLEM: does everything
    funny-tos.html                   ← FAFO / mugshot / mission 1
    bounty-hunter.html               ← bounty hunter tracker
    badge-overlay.html               ← photo overlay system
    admin.html                       ← cost monitoring
    research-data.html               ← research viewer
    help/
        qr-help.html
        how-to-play.html
        buy-me-a-coffee-help.html
    legal/
        terms-of-service.html
        privacy-policy.html
        eula.html
        liability-waiver.html
```

### CSS (current — `assets/css/`)
```
main.css        ← base layout, header, footer, hero, utilities, form controls
components.css  ← mission cards, badges, stats, buy-in cards, share modal
hero-styles.css ← landing page hero overrides, CTA buttons, feature cards, animations
overlay.css     ← badge overlay system, camera controls
mugshot.css     ← mugshot camera overlay (funny-tos.html only)
```

### JS (current — `assets/js/`)
```
storage.js              ← localStorage + cloud save (SHARED — load everywhere)
missions.js             ← mission data + getAvailableMissions() (SHARED)
toast.js                ← showToast() (SHARED)
main.js                 ← scroll/header behavior (SHARED)
direct-submission.js    ← instant submit system (missions page)
beer-justice.js         ← trial creation/voting (jail page)
beer-justice-aws-sync.js← AWS trial sync (jail page)
aws-submission-sync.js  ← submission sync to AWS (missions page)
camera.js               ← badge overlay camera (badge-overlay page)
camera-capture.js       ← mugshot camera (funny-tos page)
cheater.js              ← cheater redemption logic (jail page)
social.js               ← hashtag generation (missions page)
print.js                ← card printing (missions page)
upload.js               ← file upload handling (missions page)
premium-api-client.js   ← license key API client (unlock page)
usa-states-cities.json  ← location data (unlock page)
```

---

## Target Structure (After Restructure)

```
mission-mischief/
│
├── assets/                          ← SHARED across all pages (root level, stays)
│   ├── css/
│   │   ├── base.css                 ← NEW: reset, body, header, footer, safe-area, container
│   │   ├── components.css           ← KEEP: mission cards, badges, stats (already clean)
│   │   ├── sticky.css               ← NEW: back buttons, bottom nav, toasts, back-to-top
│   │   ├── hero-styles.css          ← KEEP: landing page only (index.html)
│   │   ├── overlay.css              ← KEEP: badge overlay (badge-overlay.html only)
│   │   └── mugshot.css              ← KEEP: mugshot camera (funny-tos only)
│   │   [DELETE] main.css            ← contents split into base.css + hero-styles.css
│   ├── js/                          ← SHARED JS (no changes to filenames)
│   └── images/                      ← SHARED images (no changes)
│
├── pages/
│   ├── dashboard/
│   │   ├── index.html               ← stats, honor score, profile, quick nav
│   │   └── dashboard.js             ← loadUserInfo, loadUserStats, loadBadges
│   │
│   ├── missions/
│   │   ├── index.html               ← mission list, accordions, submit buttons
│   │   └── missions-page.js         ← createMissionCard, filters, submit, hashtags
│   │
│   └── jail/
│       ├── index.html               ← cheater redemption + beer justice trials
│       └── jail.js                  ← cheater logic, clown selfie, beer proof, trials
│
├── core-game-files/                 ← KEEP existing structure, just clean up app.html
│   ├── app.html                     ← REPLACED: now just redirects to pages/dashboard/
│   ├── funny-tos.html               ← minor cleanup (sticky back button)
│   ├── bounty-hunter.html           ← minor cleanup (sticky back button)
│   ├── badge-overlay.html           ← no changes needed
│   ├── admin.html                   ← no changes needed
│   ├── research-data.html           ← no changes needed
│   ├── help/                        ← sticky back button fix only
│   └── legal/                       ← no changes needed
│
├── index.html                       ← UNTOUCHED (landing page)
├── unlock.html                      ← minor cleanup (sticky back button)
└── manifest.json, sw.js, etc.       ← UNTOUCHED
```

---

## CSS Consolidation Plan

### What Gets Created: `base.css`
Pulled from `main.css` — the parts every page needs:

```
- html, body reset (overflow-x, box-sizing)
- body font, color, margin, padding
- .customBody (black background, safe-area padding)
- #header (fixed-top, z-index, background, logo styles)
- #footer (background, padding, color)
- .fixed-top utility
- .container (max-width, padding, box-sizing)
- .row, .col-* grid utilities
- .d-flex, .align-items-center, .justify-content-* utilities
- .text-center, .mb-3, .mb-4, .mt-4, .w-100 utilities
- .form-control, .form-label styles
- @font-face font-display: swap declarations
- scrollbar hide (::-webkit-scrollbar)
- a, a:hover base link styles
- h1-h6 font-family
```

### What Gets Created: `sticky.css`
New file — pulled from inline styles scattered across every page:

```css
/* Sticky back button — top left, used on all inner pages */
.sticky-back {
  position: fixed;
  top: calc(70px + env(safe-area-inset-top));
  left: 15px;
  z-index: 998;
  background: #04aa6d;
  color: #000;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  text-decoration: none;
  display: inline-block;
}

/* Bottom nav bar — between dashboard / missions / jail */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.95);
  border-top: 1px solid #04aa6d;
  display: flex;
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);
}
.bottom-nav a {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  color: #666;
  font-size: 11px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.bottom-nav a.active { color: #04aa6d; }
.bottom-nav a span { font-size: 20px; }

/* Back to top */
.back-to-top {
  position: fixed;
  right: 15px;
  bottom: 60px; /* above bottom nav */
  z-index: 996;
  background: #04aa6d;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: none;
  align-items: center;
  justify-content: center;
}

/* Toast notifications */
.toast-container {
  position: fixed;
  top: calc(70px + env(safe-area-inset-top));
  right: 15px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 280px;
}
```

### What Stays in `main.css` (trimmed to landing only)
After extracting base styles to `base.css`:
```
- #hero section styles
- .get-started-btn
- .cta section styles
- #preloader
- .section-title, .section-bg
```

### What Stays Unchanged
```
components.css  ← already clean, no duplication
hero-styles.css ← landing page only, keep as-is
overlay.css     ← badge-overlay.html only, keep as-is
mugshot.css     ← funny-tos.html only, keep as-is
```

---

## Page Split: `app.html` → 3 Pages

### `pages/dashboard/index.html`
**Loads:** `base.css`, `components.css`, `sticky.css`
**Loads:** `storage.js`, `toast.js`, `main.js`, `dashboard.js`

**Contains:**
- Header (same as now)
- User stats grid (Completed / Submitted / Badges / Honor / Points)
- Badges earned display
- Quick action buttons → links to missions page and bounty hunter
- Bottom nav (Dashboard active)
- No mission cards, no cheater section

**`dashboard.js` contains:**
- `loadUserInfo()`
- `loadUserStats()`
- `loadBadges()`
- Auth check (redirect to unlock if no key, redirect to funny-tos if no FAFO)

---

### `pages/missions/index.html`
**Loads:** `base.css`, `components.css`, `sticky.css`
**Loads:** `storage.js`, `missions.js`, `toast.js`, `direct-submission.js`, `aws-submission-sync.js`, `social.js`, `camera.js`, `print.js`, `upload.js`, `missions-page.js`

**Contains:**
- Header
- Instant missions info banner
- Filter buttons (All / Available / Completed)
- Mission cards with accordions
- Submit buttons per mission
- Bottom nav (Missions active)
- No stats, no cheater section

**`missions-page.js` contains:**
- `loadMissions(filter)`
- `createMissionCard(mission, user)`
- `toggleMissionDetails(missionId)`
- `setupFilters()`
- `startMissionCapture(missionId)`
- `generateMissionHashtags(mission, user)`
- `getPointsOptions(mission)`
- `updateMissionPoints(missionId)`
- `selectBuyIn(buyInId)` (Mission 4)
- `printCard()`
- Auth check on load

---

### `pages/jail/index.html`
**Loads:** `base.css`, `components.css`, `sticky.css`
**Loads:** `storage.js`, `missions.js`, `toast.js`, `beer-justice.js`, `beer-justice-aws-sync.js`, `cheater.js`, `jail.js`

**Contains:**
- Header
- Cheater Redemption Zone (Steps 1-4)
- Beer Justice active trials list
- Bottom nav (Jail active)
- No mission cards, no stats

**`jail.js` contains:**
- `loadCheaterMissions()`
- `toggleMissionCheat(missionId)`
- `processClownSelfie()`
- `downloadClownSelfie()`
- `shareClownSelfie()`
- `uploadBeerProof()`
- `downloadBeerProof()`
- `shareBeerProof()`
- Auth check on load

---

## Bottom Nav (Shared via `sticky.css`)

All three game pages get this nav at the bottom:

```
[ 📊 Dashboard ] [ 🎯 Missions ] [ 🤡 Jail ] [ 🕵️ Bounty ]
```

Links:
- Dashboard → `/pages/dashboard/`
- Missions → `/pages/missions/`
- Jail → `/pages/jail/`
- Bounty → `/core-game-files/bounty-hunter.html`

Active state set by each page via `class="active"` on its own link.

---

## Sticky Back Button (All Inner Pages)

Every page that isn't `index.html` or a main game page gets:

```html
<a href="javascript:history.back()" class="sticky-back">← Back</a>
```

Pages that need this:
- `core-game-files/help/qr-help.html` ← currently broken, links hardcoded to unlock.html
- `core-game-files/help/how-to-play.html`
- `core-game-files/help/buy-me-a-coffee-help.html`
- `core-game-files/funny-tos.html` ← "Back to game" button
- `core-game-files/legal/*.html`
- `unlock.html`

---

## `app.html` After Restructure

`core-game-files/app.html` becomes a redirect shim so existing bookmarks/links don't break:

```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=../pages/dashboard/">
  <script>window.location.replace('../pages/dashboard/');</script>
</head>
<body></body>
</html>
```

---

## CSS Load Per Page (After Restructure)

| Page | CSS Files Loaded |
|------|-----------------|
| `index.html` (landing) | `base.css`, `main.css`, `hero-styles.css` |
| `unlock.html` | `base.css`, `components.css`, `sticky.css` |
| `funny-tos.html` | `base.css`, `sticky.css`, `mugshot.css` |
| `pages/dashboard/` | `base.css`, `components.css`, `sticky.css` |
| `pages/missions/` | `base.css`, `components.css`, `sticky.css` |
| `pages/jail/` | `base.css`, `components.css`, `sticky.css` |
| `bounty-hunter.html` | `base.css`, `components.css`, `sticky.css` |
| `badge-overlay.html` | `base.css`, `overlay.css` |
| `help/*.html` | `base.css`, `sticky.css` |
| `legal/*.html` | `base.css`, `sticky.css` |

**Before:** Every game page loaded `main.css` + `components.css` + had 100-200 lines of duplicate inline `<style>` blocks.
**After:** Every game page loads `base.css` + `components.css` + `sticky.css`. No inline style duplication.

---

## JS Load Per Page (After Restructure)

| Page | JS Files Loaded |
|------|----------------|
| `index.html` | none (static landing) |
| `unlock.html` | `storage.js`, `toast.js`, `premium-api-client.js` |
| `funny-tos.html` | `storage.js`, `camera-capture.js` |
| `pages/dashboard/` | `storage.js`, `toast.js`, `main.js`, `dashboard.js` |
| `pages/missions/` | `storage.js`, `missions.js`, `toast.js`, `direct-submission.js`, `aws-submission-sync.js`, `social.js`, `camera.js`, `print.js`, `upload.js`, `missions-page.js` |
| `pages/jail/` | `storage.js`, `missions.js`, `toast.js`, `beer-justice.js`, `beer-justice-aws-sync.js`, `cheater.js`, `jail.js` |
| `bounty-hunter.html` | `storage.js`, `toast.js`, `beer-justice.js`, `beer-justice-aws-sync.js` |
| `badge-overlay.html` | `storage.js`, `missions.js`, `camera.js` |

**Before:** `app.html` loaded 11 JS files for everything even if user never touched cheater section.
**After:** Each page loads only what it needs.

---

## Auth Check Pattern (Same on All Game Pages)

Every game page (`dashboard`, `missions`, `jail`) runs this on load:

```javascript
function checkAuth() {
  if (!Storage.isUnlocked()) {
    window.location.replace('/unlock.html');
    return false;
  }
  if (!Storage.isFAFOCompleted()) {
    window.location.replace('/core-game-files/funny-tos.html');
    return false;
  }
  return true;
}
```

---

## Onboarding Flow (Unchanged)

```
index.html
  → Lemon Squeezy checkout
    → unlock.html?key=KEY
      → funny-tos.html (FAFO / mugshot)
        → pages/dashboard/ (new home base)
```

`Storage.isUnlocked()` checks `licenseKey && keyValidated` in localStorage.
`Storage.isFAFOCompleted()` checks `fafoCompleted === true`.
Both set during onboarding, persist in localStorage.

---

## Known Bugs to Fix During Restructure

1. **Blank dashboard** — `app.html` still showing blank on some devices. Moving to `pages/dashboard/` with clean init fixes this by removing all the dead code around it.

2. **QR help back button** — `qr-help.html` has hardcoded `href="../../unlock.html"`. Replace with `sticky-back` class using `history.back()`.

3. **TOS back button** — `funny-tos.html` has no persistent back button. Add `sticky-back` pointing to `history.back()`.

4. **iOS scroll lock** — `touchmove` passive listener issue. Already fixed in `unlock.html`, verify it's not re-introduced in new pages.

5. **Console.log spam** — `app.html` has ~15 debug `console.log` calls. Strip all of them from new page JS files.

---

## Implementation Order

Do these in sequence — each step is independently testable before moving to the next.

### Step 1 — CSS Foundation
- [ ] Create `assets/css/base.css` (extract from `main.css`)
- [ ] Create `assets/css/sticky.css` (new — back buttons, bottom nav, toast container)
- [ ] Trim `main.css` to landing-page-only styles
- [ ] Test: `index.html` still looks correct

### Step 2 — Dashboard Page
- [ ] Create `pages/dashboard/` directory
- [ ] Create `pages/dashboard/index.html`
- [ ] Create `pages/dashboard/dashboard.js`
- [ ] Test: navigate to `/pages/dashboard/` — stats load, auth redirects work

### Step 3 — Missions Page
- [ ] Create `pages/missions/` directory
- [ ] Create `pages/missions/index.html`
- [ ] Create `pages/missions/missions-page.js`
- [ ] Test: all 51 missions render, submit works, filters work

### Step 4 — Jail Page
- [ ] Create `pages/jail/` directory
- [ ] Create `pages/jail/index.html`
- [ ] Create `pages/jail/jail.js`
- [ ] Test: cheater section loads, beer justice loads

### Step 5 — Bottom Nav
- [ ] Add bottom nav HTML to dashboard, missions, jail pages
- [ ] Verify active state on each page
- [ ] Verify safe-area padding on iPhone (nav doesn't overlap home indicator)

### Step 6 — Sticky Back Buttons
- [ ] Add `sticky-back` to `qr-help.html`, `how-to-play.html`, `buy-me-a-coffee-help.html`
- [ ] Add `sticky-back` to `funny-tos.html`
- [ ] Add `sticky-back` to all `legal/*.html` pages
- [ ] Test: back button visible while scrolling on iPhone

### Step 7 — Redirect Shim
- [ ] Replace `core-game-files/app.html` with redirect to `pages/dashboard/`
- [ ] Test: old bookmark to `app.html` redirects correctly

### Step 8 — Cleanup
- [ ] Remove duplicate inline `<style>` blocks from all pages (now covered by base.css)
- [ ] Strip all debug `console.log` calls from new JS files
- [ ] Verify manifest.json paths still resolve
- [ ] Verify sw.js cache list includes new page paths

---

## File Path Reference (Relative from each new page)

From `pages/dashboard/index.html` or `pages/missions/index.html` or `pages/jail/index.html`:
```
../../assets/css/base.css
../../assets/css/components.css
../../assets/css/sticky.css
../../assets/js/storage.js
../../assets/js/missions.js
../../assets/images/badges/...
../../core-game-files/funny-tos.html
../../unlock.html
../../index.html
```

From `core-game-files/app.html` (redirect shim):
```
../pages/dashboard/
```

---

## What We Are NOT Changing

- `index.html` — landing page, untouched
- `unlock.html` — onboarding, only adding sticky-back
- `assets/js/storage.js` — shared, no changes
- `assets/js/missions.js` — shared, no changes
- `assets/images/` — all image paths stay the same
- `manifest.json` — will need sw.js cache update only
- AWS Lambda functions — not touched
- DynamoDB — not touched
- API Gateway — not touched
- Lemon Squeezy integration — not touched
- `BUILD_ARTIFACTS/` — not touched
- `premium-blockchain-engine/` — not touched

---

## Quick Reference: Key Files

| What | Where |
|------|-------|
| License key validation | `BUILD_ARTIFACTS/license-validation-lambda.py` |
| Cloud save | `BUILD_ARTIFACTS/cloud-save-lambda.py` |
| API Gateway ID | `4q1ybupwm0` (us-east-1) |
| DynamoDB users table | `mission-mischief-users` |
| DynamoDB saves table | `mission-mischief-saves` |
| Test license key | `TEST-KEY-1234` |
| Test URL | `https://missionmischief.online/unlock.html?key=TEST-KEY-1234` |
| Live site | `https://missionmischief.online` |
| GitHub Pages | DNS via Squarespace → GitHub Pages |
| IAM Role | `mission-mischief-lambda-role` |
| Lemon Squeezy | Store under review — cannot generate keys yet |

---

*Last updated: Implementation complete — all 8 steps done.*

**Steps completed:**
- [x] Step 1: `base.css` created, `sticky.css` created, `main.css` trimmed to landing-only
- [x] Step 2: `pages/dashboard/index.html` + `dashboard.js` created
- [x] Step 3: `pages/missions/index.html` + `missions-page.js` created
- [x] Step 4: `pages/jail/index.html` + `jail.js` created
- [x] Step 5: Bottom nav in all 3 game pages with active states
- [x] Step 6: `sticky-back` on `qr-help.html`, `funny-tos.html` (legal pages still need it)
- [x] Step 7: `core-game-files/app.html` replaced with redirect shim to `pages/dashboard/`
- [x] Step 8: `sw.js` bumped to v2, new page paths added to cache

**Still needs testing on device:**
- Push to GitHub, test `missionmischief.online/pages/dashboard/` on iPhone
- Verify bottom nav safe-area on iPhone 16 Pro (home indicator)
- Verify sticky back button visible while scrolling on help/legal pages
- Legal pages (`legal/*.html`) still need `sticky-back` added
