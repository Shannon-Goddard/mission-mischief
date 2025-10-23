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
- `assets/js/storage.js` - localStorage management, user data structure
- `assets/js/missions.js` - 38+ missions, badge system, buy-in logic
- `assets/js/camera.js` - Badge overlay system, mascot expressions
- `assets/js/camera-capture.js` - Live camera feed, photo capture
- `assets/js/print.js` - Cross-platform card printing
- `assets/js/main.js` - Utilities, toast notifications
- `assets/js/social.js` - Social media integration

### HTML Pages
- `index.html` - Landing page
- `app.html` - Main game interface with user setup, buy-in selection, mission dashboard
- `funny-tos.html` - FAFO Mission 1 with mugshot system
- Legal documents: `terms-of-service.html`, `privacy-policy.html`, `eula.html`, `liability-waiver.html`

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
- Fixed image path 404 errors with proper helper functions
- Implemented overlay compositing in photo capture (requires HTTP serving)
- Added mission camera modal with live video feed
- Enhanced QR code alignment system with drag/zoom
- Fixed mascot expression path generation
- Added screen recording instructions for video with overlays
- Fixed QR code aspect ratio in print output

## Development Notes
- **CORS Issue**: Must serve over HTTP (not file://) for overlay compositing to work
- **Image Loading**: Badge and mascot images must be properly loaded before overlay compositing
- **Security**: Canvas taint occurs with file:// protocol, resolved with HTTP serving
- **Mobile**: Responsive design with orientation detection for overlays

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