# Mission Mischief - Project Summary

## Overview
Comprehensive real-world social scavenger hunt game with 50+ missions, badge system, and viral social media integration. Revolutionary hashtag blockchain system for verification and bounty hunting.

## Architecture
- **Type**: Single-page application with dynamic content loading
- **Storage**: Pure localStorage (no server/database needed)
- **Serving**: Requires HTTP server for CORS compliance (use `python -m http.server 8000`)

## Key Systems

### Mission System (COMPLETE)
- **50 missions total** (M1-M50 + BONUS) with complete proof requirements
- **Professional collapsible design** in mission-list.html with expandable details
- **Strategic card drop system** - contextual viral marketing built into each mission
- **Perfect mission logic** - setup missions skip drops, home missions no drops, public missions strategic drops
- **Badge pairing system** - prank/goodwill pairs unlock badge progression (silhouette → vibrant → gold)

### Hashtag Blockchain System (ENHANCED)
- **Location-specific hashtags** using cascading dropdowns for perfect accuracy
- **Global hashtag format**: #missionmischiefcountryusa #missionmischiefstatecalifornia #missionmischiefcityriverside
- **Automated share functionality** replacing manual hashtag copying
- **Bounty hunter scraping** enabled through standardized hashtag structure
- **"Other" options** for global inclusivity in location selection

### Badge & Overlay System
- 22 badges with 3 states: silhouette/vibrant/gold
- Responsive camera overlay with Mayhem mascot expressions
- Real-time overlay compositing in photos (requires HTTP serving)
- Smoldering effects for active mission badges

### Crown of Chaos System
- Secret level unlocked by completing all 3 buy-ins
- Mayhem mascot wears crown when achieved
- Gold prompting system for second buy-in completion

### Legal Framework
- FAFO (Mission 1): Binding legal agreement disguised as comedy
- Enhanced mugshot system with jailhouse background and live date/time
- Comprehensive Terms of Service system
- Device-only photo storage eliminates data liability

### Camera Integration
- Enhanced mugshot capture system with booking overlay and flash effects
- Mission camera modal with overlay compositing
- Upload system for photo/video processing with overlay preview
- Screen recording instructions for video with overlays

### QR Code System
- Drag-and-zoom positioning for business card QR codes
- Handles rectangular Instagram formats
- Maintains aspect ratio in print output

## File Structure

### Core JavaScript Files
- `assets/js/storage.js` - localStorage management, user data structure, mission completion tracking, FAFO completion status, buy-in tracking, mission points storage
- `assets/js/missions.js` - **ENHANCED** Complete 51-mission system with detailed proofs, card drops, mission progression locks, badge file path fixes
- `assets/js/camera.js` - Badge overlay system with dynamic Mayhem expressions, smoldering effects, buy-in badge management, responsive layout detection
- `assets/js/camera-capture.js` - Live camera feed, photo capture with booking overlay, device-only saving, mugshot preview with retake/continue options
- `assets/js/print.js` - Cross-platform card printing
- `assets/js/main.js` - Utilities, toast notifications
- `assets/js/social.js` - Social media integration

### HTML Pages
- `index.html` - **ENHANCED** Mobile-first landing page with integrated Mayhem mascot, responsive design, improved viewport handling
- `app.html` - **ENHANCED** Main game interface with cascading location dropdowns, mission points tracking system, setup mission locks, finale mission lock, enhanced statistics display
- `funny-tos.html` - **ENHANCED** FAFO Mission 1 with mobile-responsive mugshot camera interface, improved button flow (START CAMERA/TAKE MUGSHOT → RETAKE/SHARE/CONTINUE)
- `mobile-landing.html` - Mobile-optimized landing page with social media links and app store badges
- `mission-list.html` - **PRODUCTION-READY** complete mission reference with collapsible design, all 50 missions, perfect card drop system
- `how-to-play.html` - Comprehensive game guide
- `qr-help.html` - QR code extraction guide for all platforms
- Legal documents: `terms-of-service.html`, `privacy-policy.html`, `eula.html`, `liability-waiver.html` for Loyal9 LLC

### Assets
- `assets/images/mascot/` - 96px mascot images (mayhem-*.png, crown-of-chaos-*.png)
- `assets/images/badges/` - 128px badge images (3 states each: black/color/gold)
- `assets/images/qr-help/` - Platform-specific QR extraction guides
- `assets/images/social/` - App store badges, hero images
- `assets/css/` - Styling, overlay CSS, **ENHANCED** mugshot.css with mobile-responsive camera controls
- `assets/js/camera-capture.js` - **ENHANCED** Updated camera capture logic with proper button flow and mobile optimization

## Brand Identity
- **Primary Color**: #04aa6d (green)
- **Theme**: Dark with fluorescent badge colors
- **Mascot**: Mayhem with mohawk
- **Tone**: Comedy with legal binding
- **Age Rating**: 18+ (enforced in legal framework)

## Monetization Strategy
- $4.99 game cost
- $5 beer mission creates instant $0.01 profit
- Buy Me A Coffee integration for real money stakes
- $5 bounties for found cards/exposed cheaters

## Technical Approach
- Pure localStorage for data persistence
- Social media as "blockchain" for verification
- Epic hashtag system for viral mechanics
- Device-only photo storage for privacy compliance

## User Progression Flow
1. **FAFO** - Complete legal agreement with enhanced mugshot system
2. **Setup** - Enter details, upload/position QR code with drag-zoom
3. **Buy-in Selection** - Choose path (recycling/cleanup/referral/nothing)
4. **Mission Unlocking** - Complete prank/goodwill pairs using mission-list.html
5. **Crown of Chaos** - Ultimate achievement for completing all buy-ins

## Current Status - PHASE 2 COMPLETE, STARTING PHASE 3

### PHASE 1 COMPLETED ✅ (Foundation & Marketing)
- **Mission List Reference**: Complete 50-mission system documented in mission-list.html
- **Legal Framework**: Enhanced FAFO with mobile-responsive jailhouse mugshot system
- **Basic Architecture**: Core files and structure established
- **Social Media Accounts**: Created with consistent branding
- **File Organization**: Clean project structure with all necessary assets
- **Mobile Optimization**: Enhanced index.html with mobile-first responsive design
- **Location System**: Cascading dropdowns with "Other" options for global hashtag accuracy
- **Share Integration**: Automatic share functionality with all required hashtags
- **Interface Comparison**: app.html identified as primary interface, mission-list.html as reference documentation

### PHASE 2 COMPLETED ✅ (Core Game Mechanics)
- **Complete Mission Integration**: All 51 missions from mission-list.html integrated into missions.js
- **Points Tracking System**: Mission-specific points dropdowns with smart options (1-3, ?, 1-50)
- **Mission Progression Logic**: Setup missions (1-4) must be completed before unlocking others
- **Finale Mission Lock**: Mission 50 locked until missions 1-49 completed
- **Badge System Fixed**: All badge file paths corrected, proper state progression
- **Enhanced Hashtag System**: `#missionmischiefpoints[number]` for individual mission scoring
- **Statistics Enhancement**: Available missions count excludes completed setup missions
- **Data Persistence**: Mission points stored per mission, total points calculated and displayed

### PHASE 2 COMPLETED ✅ (Core Game Mechanics)
- **Mission System Integration**: Complete 51-mission system with detailed proofs and card drops
- **Points Tracking System**: Mission-specific points dropdowns with hashtag integration
- **Mission Logic**: Setup missions (1-4) lock system, Mission 50 finale lock
- **Badge System**: Fixed all badge file paths, proper state progression
- **Hashtag Blockchain**: Location + points + user hashtags for bounty hunter scraping

### PHASE 3 IN PROGRESS 🚧 (Overlay & Leaderboard)
- **Camera Overlay Review**: Badge placement, sizing, mobile optimization needed
- **Bounty Hunter Page**: Leaderboard system using points hashtag scraping
- **User Experience**: Overlay positioning and visual polish
- **Automated Justice System**: Fraud detection and escalation protocols

## Development Notes
- **CORS Issue**: Must serve over HTTP (not file://) for overlay compositing to work
- **Image Loading**: Badge and mascot images must be properly loaded before overlay compositing
- **Security**: Canvas taint occurs with file:// protocol, resolved with HTTP serving
- **Mobile**: Responsive design with orientation detection for overlays
- **18+ Content**: Some missions contain adult humor appropriate for target demographic

## Social Media Accounts
- **Instagram**: @missionmischief_official
- **TikTok**: @missionmischief_official
- **Facebook**: Mission Mischief page
- **X**: @Missio_Mischief

## Key Insights
- **HASHTAG BLOCKCHAIN REVOLUTION**: Hashtags create distributed ledger system for automated justice and verification
- **POINTS TRACKING BREAKTHROUGH**: Mission-specific points enable individual scoring and leaderboard scraping
- **MISSION PROGRESSION LOGIC**: Setup missions force completion, finale mission requires full game completion
- **CARD DROP VIRAL SYSTEM**: Strategic card placement creates organic scavenger hunt ecosystem
- **18+ COMEDY FRAMEWORK**: Adult humor with legal binding creates unique market position
- **SCALABILITY BREAKTHROUGH**: Zero server costs, infinite participants, self-enforcing rules
- **INCLUSIVE DESIGN**: Variable point system allows participation regardless of budget
- **LEGAL STRATEGY**: Device-only photo storage eliminates data liability
- **MOBILE-FIRST APPROACH**: Game designed primarily for mobile devices with responsive design
- **WEBVIEW COMPATIBILITY**: Code optimized for Android Studio and Xcode WebView implementations
- **LEADERBOARD READY**: Points hashtag system enables automated scoring and ranking

## Next Steps - PHASE 3 PRIORITIES
- **CAMERA OVERLAY REVIEW**: Badge placement, sizing, mobile optimization
- **BOUNTY HUNTER PAGE**: Leaderboard system scraping `#missionmischiefpoints[number]` hashtags
- **OVERLAY POLISH**: Visual positioning and mobile responsiveness
- **LEADERBOARD FEATURES**: Top 3 scores calculation and display
- **USER EXPERIENCE**: Final overlay positioning and visual polish
- **AUTOMATED JUSTICE**: Public shaming board, escalating bounty system ($5/day)

## For New Conversations
When starting a new conversation about this project:

1. **Context**: 18+ social scavenger hunt game with legal comedy framework
2. **Architecture**: Single-page app using localStorage, requires HTTP serving
3. **Current Status**: PHASE 1 complete, beginning PHASE 2 core game mechanics
4. **Key Achievement**: mission-list.html contains complete 50-mission reference
5. **Brand**: #04aa6d green, dark theme, Mayhem mascot, comedy + legal binding
6. **Technical**: Pure frontend, social media verification, device-only storage