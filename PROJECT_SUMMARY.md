# Mission Mischief - Project Summary

## Overview
Comprehensive real-world social scavenger hunt game with 50+ missions, badge system, and viral social media integration.

## Architecture
- **Type**: Single-page application with dynamic content loading
- **Storage**: Pure localStorage (no server/database needed)
- **Serving**: Requires HTTP server for CORS compliance (use `python -m http.server 8000`)

## Key Systems

### Badge & Overlay System
- 22 badges with 3 states: silhouette/vibrant/gold
- Responsive camera overlay with Mayhem mascot expressions
- Real-time overlay compositing in photos (requires HTTP serving)

### Crown of Chaos System
- Secret level unlocked by completing all 3 buy-ins
- Mayhem mascot wears crown when achieved

### Legal Framework
- FAFO (Mission 1): Binding legal agreement disguised as comedy
- Comprehensive Terms of Service system
- Device-only photo storage eliminates data liability

### Camera Integration
- Mugshot capture system with live feed and flash effects
- Mission camera modal with overlay compositing
- Screen recording instructions for video with overlays

### QR Code System
- Drag-and-zoom positioning for business card QR codes
- Handles rectangular Instagram formats
- Maintains aspect ratio in print output

## File Structure

### Core JavaScript Files
- `assets/js/storage.js` - localStorage management, user data structure, mission completion tracking, FAFO completion status, added missing badges array
- `assets/js/missions.js` - Complete mission system with 51 missions (M1-M51), variable point systems, badge mapping, buy-in logic, Crown of Chaos mechanics, helper functions for image paths
- `assets/js/camera.js` - Badge overlay system with dynamic Mayhem expressions, smoldering effects, buy-in badge management, fixed image path references
- `assets/js/camera-capture.js` - Live camera feed, photo capture with booking overlay, device-only saving, mugshot preview with retake/continue options
- `assets/js/print.js` - Cross-platform card printing
- `assets/js/main.js` - Utilities, toast notifications
- `assets/js/social.js` - Social media integration

### HTML Pages
- `index.html` - Landing page
- `app.html` - Main game interface with user setup, buy-in selection, mission dashboard, QR code alignment system with zoom/drag functionality, mission camera modal with overlay compositing
- `funny-tos.html` - FAFO Mission 1 with hilarious legal agreement and mugshot system
- `mobile-landing.html` - Mobile-optimized landing page with social media links and app store badges
- `how-to-play.html` - Comprehensive game guide with quick start, mission types, badge system, and rules
- `qr-help.html` - Step-by-step QR code extraction guide for Instagram, TikTok, Facebook, and X
- Legal documents: `terms-of-service.html`, `privacy-policy.html`, `eula.html`, `liability-waiver.html` for Loyal9 LLC with copyright notices

### Assets
- `assets/images/mascot/` - 96px mascot images (mayhem-*.png, crown-of-chaos-*.png)
- `assets/images/badges/` - 128px badge images (3 states each: black/color/gold)
- `assets/css/` - Styling and overlay CSS

## Brand Identity
- **Primary Color**: #04aa6d (green)
- **Theme**: Dark with fluorescent badge colors
- **Mascot**: Mayhem with mohawk
- **Tone**: Comedy with legal binding

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
1. **FAFO** - Complete legal agreement with mugshot
2. **Setup** - Enter details, upload/position QR code
3. **Buy-in Selection** - Choose path (recycling/cleanup/referral/nothing)
4. **Mission Unlocking** - Complete prank/goodwill pairs
5. **Crown of Chaos** - Ultimate achievement for completing all buy-ins

## Recent Fixes & Improvements
- **Mission System Implementation**: Successfully implemented complete 51-mission system from final-mission-reference.html into missions.js, resolved syntax errors caused by duplicate mission entries
- **Image Path Resolution**: Fixed 404 errors for badge and mascot images by correcting file paths and implementing proper helper functions
- **Social Media Setup**: Created accounts on Instagram, TikTok, Facebook, and X with consistent branding
- **QR Code Alignment System**: Added drag-and-zoom positioning for business card QR codes to handle rectangular Instagram formats
- **Camera Integration**: Built mugshot capture system with live camera feed, flash effects, and device-only photo saving
- **Badge & Overlay System**: Implemented 22 badges with 3 states (silhouette/vibrant/gold) and responsive camera overlay with Mayhem mascot expressions
- **Crown of Chaos System**: Designed secret level unlocked by completing all 3 buy-ins, with Mayhem wearing crown
- **Legal Framework**: Created comprehensive Terms of Service and FAFO (Mission 1) system with binding legal agreement disguised as comedy

## Development Notes
- **CORS Issue**: Must serve over HTTP (not file://) for overlay compositing to work
- **Image Loading**: Badge and mascot images must be properly loaded before overlay compositing
- **Security**: Canvas taint occurs with file:// protocol, resolved with HTTP serving
- **Mobile**: Responsive design with orientation detection for overlays

## Social Media Accounts
- **Instagram**: @missionmischief_official
- **TikTok**: @missionmischief_official
- **Facebook**: Mission Mischief page
- **X**: @Missio_Mischief

## Key Insights
- **INCLUSIVE DESIGN**: Variable point system (1pt basic, 3pts full effort) allows participation regardless of budget while rewarding creativity
- **VIRAL MECHANICS**: Epic hashtag system, social media proof requirements, $5 bounties for found cards/exposed cheaters
- **LEGAL STRATEGY**: Device-only photo storage eliminates data liability, FAFO mission creates binding legal agreement through comedy
- **IMAGE ORGANIZATION**: 96px mascot images in assets/images/mascot/, 128px badges in assets/images/badges/, proper path helper functions implemented

## Next Steps / Known Issues
- Overlay positioning and sizing needs refinement
- Video overlay compositing still requires screen recording approach
- Badge state transitions could use animation improvements
- Mission completion flow could be streamlined

## For New Conversations
When starting a new conversation about this project:

1. **Context**: This is a social scavenger hunt game with legal comedy framework
2. **Architecture**: Single-page app using localStorage, requires HTTP serving
3. **Current Status**: Core functionality complete, overlay system working, needs UI polish
4. **Key Files**: Focus on the 7 main JS files and 3 HTML pages listed above
5. **Brand**: #04aa6d green, dark theme, Mayhem mascot, comedy + legal binding
6. **Technical**: Pure frontend, social media verification, device-only storage