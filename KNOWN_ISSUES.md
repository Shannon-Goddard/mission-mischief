# 📝 Mission Mischief Bug & Feature Log

## `https://missionmischief.online`

| Issue Description | Fixed | Not Fixed |
| :--- | :---: | :---: |
| On load text **"YOU FOUND THE EVIDENCE Welcome to Mission Mischief: The World's Most Sociopathic Scavenger Hunt"** is not centered. | [x] | [ ] |
| text **"By tapping the button above"** there is no button above. | [x] | [ ] |

***

## `https://missionmischief.online/funny-tos.html`

| Issue Description | Fixed | Not Fixed |
| :--- | :---: | :---: |
| Text **"🎭 MISSION 1: FAFO 🎭"** is on one line, but not centered. | [x] | [ ] |
| Text **"📋 Our Lawyer Made Us Do This 📋"** is on one line, but is going out of the right screen boundary. | [x] | [ ] |
| Mugshot text **"🚨🚨Booking Instructions"** is on one line. | [x] | [ ] |
| Mugshot **"share"** button needs to change to **"download"** and only download the mugshot image with the overlay, **excluding** hashtags. | [x] | [ ] |
| Mugshot downloaded image does not have black/white overlay. | [x] | [ ] |
| Mugshot **"Continue to Game"** button attempts an image download (works on PC, fails on mobile). The download feature should be removed and the button should be an **`href`** link to the next section. | [x] | [ ] |
| User input section: **Bounty Hunter** badge in the top right header. Would like to not give the user a chance to mess up and press it bypassing the needed input information. | [ ] | [x] |
| **"Welcome to Mission mischief"** box is too skinny; expand it to use more available horizontal space. This should also fix the sizing of the input boxes. | [x] | [ ] |
| Upload QR Code drag-and-drop is not working, and the screen moves when attempting to drag. | [x] | [ ] |

***

## `https://missionmischief.online/app.html`

| Issue Description | Fixed | Not Fixed |
| :--- | :---: | :---: |
| On load, the page scrolls down to the **"All Missions," "Available,"** and **"Complete"** buttons instead of loading at the very top. | [x] | [ ] |
| The content on the page is too large (regression from previous fix/change). Also, instead scrolling, the entire screen moves. Able to pinch to proper size. When going back from Game Rules the screen is perfect; at top and proper size. | [x] | [ ] |

***

## `https://missionmischief.online/how-to-play.html`

| Issue Description | Fixed | Not Fixed |
| :--- | :---: | :---: |
| **"Game rules back to dashboard"** button should be a **sticky element** (e.g., bottom right on scroll or in the header) similar to the QR help page. | [ ] | [x] |
| **Rethink Bounty Hunter Badge/Mayhem Icon:** The Bounty Hunter badge in the dashboard header was replaced by Mayhem. Revert the dashboard badge to **Bounty Hunter** (users need access) while maintaining the **Mayhem** icon on the input page (`/funny-tos.html`). | [x] | [ ] |

***

## `https://missionmischief.online/app.html`

| Issue Description | Fixed | Not Fixed |
| :--- | :---: | :---: |
|**Mission 4 "Choose your destiny"** needs a design/logic rethink: <br> - Implement different badges earned based on different buy-ins. <br>  | [x] | [ ] |
| **Mission 4 "Choose your destiny"** Ensure logic for users who choose to **"do nothing"** only unlocks one mission at a time. | [x] | [ ] |
| **Mission 4 "Choose your destiny"** Add a button for **"add overlays"**. | [ ] | [x] |
| **Clown selfie overlay** enhancements: <br> - Add the **Mayhem Clown PNG** to the bottom right. <br> - Implement logic for the user to be able to **drag the clown nose** onto the right spot or **remove the clown nose** entirely (undecided on final feature). | [ ] | [x] |
| **Bounty Hunter page** is displaying old data; the scrape process is not fetching the latest post. | [ ] | [x] |

***

## `GENERAL`

| Issue Description | Fixed | Not Fixed |
| :--- | :---: | :---: |
| **ALL Missions** should we change the "Add Overlays" button text to "Proof"? | [ ] | [ ] |
| **ALL PAGES** should we have on scroll event trigger a back to top button or have it in the header like https://missionmischief.online/buy-me-a-coffee-help.html has "<- Back to Dashboard" but as "^ Back to Top"? | [ ] | [ ] |
| ✅ **Checkout test-camera-capture.js and test-mugshot.css for possible solutions** - COMPLETED: Enhanced camera capture system integrated with proper mugshot overlay functionality. | [x] | [ ] |

***

## 🔧 TROUBLESHOOTING SOLUTIONS

### Hero Section Fixes (index.html)
| Problem | Solution | Code Pattern |
| :--- | :--- | :--- |
| **Text not centered on mobile** | Use asymmetric padding to compensate for Bootstrap container | `#hero { padding: top 60px bottom 0px; }` |
| **Feature cards not showing on mobile** | Add mobile-specific flexbox styling | `@media (max-width: 767px) { .feature-cards { display: flex; flex-direction: column; gap: 15px; } }` |
| **CTA button floating over next section** | Add bottom padding to hero section | `#hero { padding-bottom: 40px; }` |
| **Content hitting screen edges** | Add right padding at section level, not individual elements | `#hero { padding-right: 60px; }` |

### UX Enhancement Patterns
| Enhancement | Implementation | Code Pattern |
| :--- | :--- | :--- |
| **Visual hierarchy for key words** | Color accent on important spans | `.hero-text h1 span { color: #04aa6d; }` |
| **Attention-grabbing CTA buttons** | Subtle pulse animation | `@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(4, 170, 109, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(4, 170, 109, 0); } }` |
| **Mobile-optimized buttons** | Larger touch targets on mobile | `@media (max-width: 767px) { .get-started-btn, .cta-btn { padding: 18px 35px; font-size: 1.2rem; } }` |
| **Improved readability** | Increased line spacing on mobile | `@media (max-width: 767px) { .text-left p { line-height: 1.6; } }` |

### CSS Media Query Best Practices
- **Mobile-first approach**: Base styles for mobile, then `@media (min-width: 768px)` for larger screens
- **Missing mobile styles**: Always check if tablet/desktop overrides need mobile equivalents
- **Bootstrap conflicts**: Use section-level padding instead of individual element margins
- **Asymmetric padding**: Use different left/right padding to compensate for Bootstrap's built-in spacing

### Content Reference Fixes
| Problem | Solution | Example |
| :--- | :--- | :--- |
| **Incorrect button references** | Update text to match actual button placement | "By tapping the button above" → "By tapping the button below" |
| **Legal clarity improvements** | More honest, user-friendly language | "you agree that you have read" → "you will have the opportunity to read" |