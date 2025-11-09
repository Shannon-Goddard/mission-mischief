# Mission Mischief - Game Mechanics Brain

## 🎮 Core Game Understanding

### What Mission Mischief Actually Is
- **Real-world scavenger hunt** using social media as verification
- Players complete physical missions and post proof with structured hashtags
- **Hashtag blockchain**: Social posts become the verification system
- **Community-driven**: Other players can verify/dispute through bounty hunting

### Why Users Upload Images/Videos
- **Proof of Mission Completion**: Visual evidence they actually did the mission
- **Social Verification**: Posts go to Instagram/Facebook/X for community validation
- **Point Earning**: Hashtags contain point values that get scraped and tracked
- **Leaderboard Competition**: Geographic clustering and ranking system
- **Badge Achievement**: Visual progress tracking through earned badges

### The Upload → Overlay → Share Flow
1. **Complete Mission**: Player does real-world activity (coffee shop prank, community service, etc.)
2. **Capture Evidence**: Take photo/video of the completed mission
3. **Add Overlays**: Mission Mischief branding + badges + mascot for authenticity
4. **Generate Hashtags**: Structured tags with mission, user, points, location data
5. **Share to Social**: Post to Instagram/Facebook/X with all required hashtags
6. **Automated Scraping**: Daily 3AM Lambda scrapes posts for leaderboard updates

### User Psychology & Motivations
- **Achievement Display**: Overlays show off earned badges and progress
- **Brand Recognition**: Mission Mischief branding creates community identity  
- **Anti-Fraud**: Overlays make posts harder to fake/steal
- **Social Proof**: Visual elements encourage others to join the game
- **Mobile-First**: 99% mobile users need quick, easy upload process

### Critical Success Factors
- **Speed**: Upload → overlay → share must be under 30 seconds
- **Context-Aware**: Different overlays for different mission types (prank vs goodwill)
- **Progress Display**: Show user's actual earned badges (not fake ones)
- **Authenticity**: Clear Mission Mischief branding prevents cheating
- **Mobile UX**: Touch-optimized for iPhone/Android camera roll workflow
- **Smart Defaults**: Auto-suggest overlays based on current mission

## 🎮 Mission Types & Overlay Requirements

### Mission Categories
1. **Setup Missions (1-4)**: FAFO, License to Ill, Buy Me A Beer, Choose Your Destiny
2. **Prank Missions**: Bookstore antics, coffee shop pranks, library shenanigans
3. **Goodwill Missions**: Donations, helping strangers, community service
4. **Special Missions**: Bounty hunting, dance-offs, card retrieval

### Badge System (26 badges total)
- **Locked**: Black silhouette (mission not started)
- **Silhouette**: Black badge (prank completed only)
- **Vibrant**: Color badge (goodwill completed only) 
- **Gold**: Gold badge (both prank + goodwill completed)

### Overlay Elements Needed
1. **Mission Mischief Branding**: Always visible for authenticity
2. **Earned Badges**: Show user's actual progress (up to 5 visible)
3. **Mayhem Mascot**: Different expressions based on user state
4. **Buy-in Badge**: Current path (Green Warrior, Oscar, Bye Bye Bye)
5. **Special Status**: Cheater clown, Bounty Hunter, Crown of Chaos

## 🎯 UX Design Insights

### Why Users Need Quick Upload
- **Real-time missions**: Many happen in public spaces (coffee shops, libraries, stores)
- **Social proof**: Need to post while still at location for authenticity
- **Mobile workflow**: Camera → Upload → Overlay → Share in under 30 seconds
- **Anti-cheat**: Overlays prove they're actually playing Mission Mischief

### Overlay Strategy by Mission Type
- **Prank missions**: Minimal overlays (don't distract from the prank)
- **Goodwill missions**: Full badge display (show off achievements)
- **Setup missions**: Branding focus (introduce new players to the game)
- **Special missions**: Dynamic overlays (bounty hunter badge, crown effects)

### Mobile-First Requirements
- **One-tap upload**: Direct from camera roll
- **Smart defaults**: Auto-select appropriate overlays for mission type
- **Preview system**: See overlays before processing
- **Quick share**: Copy hashtags + download with overlays in one flow

## 🧠 Optimal User Flow
1. **Mission Context**: User knows which mission they're completing
2. **Smart Overlays**: System suggests appropriate badges/mascot for that mission
3. **Quick Preview**: User can see overlay placement before processing
4. **One-Click Process**: Add overlays + copy hashtags + prepare for sharing
5. **Direct Share**: Download or share directly to social media

## 🎨 Design Principles
- **Authenticity over aesthetics**: Overlays prove legitimacy
- **Progress celebration**: Show off earned badges prominently
- **Community identity**: Mission Mischief branding creates belonging
- **Mobile optimization**: Touch-friendly, fast, intuitive

## 🔧 Current Implementation Status

### Button Functions (Fixed)
- **📋 Copy Hashtags**: Just copies mission hashtags to clipboard for posting
- **🎭 Add Overlays**: Redirects to badge-overlay.html for photo/video upload with badge overlays

### Badge Overlay System Features
- **Real User Data**: Uses Storage.getUser() and Missions.getAllBadgeStates(user)
- **25 Badge Positions**: Arranged to show all earned badges without overlap
- **Badge States**: Black (prank only), Color (goodwill only), Gold (both completed)
- **Fixed Elements**: Mayhem mascot (bottom-right), Bounty Hunter badge (bottom-left)
- **Mobile Responsive**: 40px badges → 30px on mobile, 80px → 55px Mayhem
- **Canvas Rendering**: Bakes overlays into final image for download
- **Mission Context**: Shows mission title and hashtags when coming from app.html

### User Flow
1. Complete real-world mission
2. Click "🎭 Add Overlays" → badge-overlay.html
3. Upload photo/video from camera roll
4. See earned badges + Mayhem + branding overlaid
5. Toggle badges if needed, download final image
6. Click "📋 Copy Hashtags" → get hashtags for posting
7. Post to social media with overlaid proof + hashtags

### Technical Details
- **Safe Zones**: 15-20px margins from edges for platform cropping
- **Platform Support**: Instagram (1:1, 4:5, 9:16), Facebook (16:9, 1:1), X (16:9)
- **File Support**: All image formats, video preview (screen recording for overlays)
- **Performance**: Instant preview, maintains original resolution
- **Integration**: Session storage passes mission data between pages

## 📱 Ready for iPhone 16 Pro Testing!

### Test Checklist
- [ ] Upload photo from camera roll
- [ ] Verify earned badges display correctly (not locked badges)
- [ ] Check Mayhem mascot positioning
- [ ] Test badge toggle functionality
- [ ] Download final image with overlays
- [ ] Copy hashtags functionality
- [ ] Mobile responsiveness and touch targets
- [ ] Canvas rendering quality

**Current Status**: Production-ready badge overlay system with real user data integration 🎭📱