# Mission Mischief - Direct Submission System Redesign

## 🎯 Overview
Transition from expensive social media scraping to direct URL submissions with community validation. Users submit proof URLs directly, community polices with $5 beer penalties for fakers.

## 💰 Cost Impact
- **Current:** $40-70/month (daily scraping)
- **Target:** $4-15/month (direct submissions)
- **Savings:** 85% cost reduction

## 🔄 New User Flow
1. **Do mission** (real world action)
2. **🎭 Add Overlays** → Upload pic/vid → Get overlaid version with earned badges
3. **📋 Copy Hashtags** → Get required hashtags for posting
4. **Post to social** → User posts overlaid content with hashtags
5. **⚡ Submit Mission** → Just URL + points (auto-fill name/location from profile)

## 📝 Data Structure Changes

### User Profile (Signup Form)
**Keep:**
```javascript
{
  userId: "hash-of-name-location", // Generated from name+location
  userName: "Shannon Goddard",
  country: "US",
  state: "California", 
  city: "Riverside",
  qrCodeData: "data:image/png;base64...",
  // ... existing mission completion data
}
```

**Remove:**
- `userHandle` (no longer needed without scraping)

### Mission Submission Object
**New structure:**
```javascript
{
  submissionId: "uuid",
  missionId: 5,
  userId: "hash-of-name-location",
  proofUrl: "https://instagram.com/p/xyz123/", // MANDATORY
  pointsClaimed: 3,
  timestamp: "2025-11-14T...",
  userName: "Shannon Goddard", // Auto-filled from profile
  country: "US", // Auto-filled from profile
  state: "California", // Auto-filled from profile
  city: "Riverside", // Auto-filled from profile
  status: "submitted" // Phase 1: simple status only
}
```

## 🎮 Mission Interface Changes

### Standardized Buttons (Every Mission)
```html
<!-- Every mission gets exactly these 3 buttons -->
<button onclick="addOverlays(missionId)">🎭 Add Overlays</button>
<button onclick="copyHashtags(missionId)">📋 Copy Hashtags</button>
<button onclick="submitMission(missionId)">⚡ Submit Mission</button>
```

**Remove:**
- "Mark Complete" button (redundant with submission)
- Inconsistent button variations

### Submission Form (Simplified)
```html
<!-- Only these fields needed -->
<input type="url" placeholder="Social media post URL" required>
<select name="points"><!-- Mission-specific points --></select>
<button type="submit">Submit Mission</button>
```

## 🏗️ AWS Infrastructure Changes

### New DynamoDB Table: `mission-mischief-submissions`
```json
{
  "TableName": "mission-mischief-submissions",
  "KeySchema": [
    { "AttributeName": "submission_id", "KeyType": "HASH" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "submission_id", "AttributeType": "S" }
  ]
}
```

### Lambda Functions Update
1. **Submission Handler** - Store submissions in DynamoDB
2. **Bounty Hunter API** - Serve submissions for bounty-hunter.html
3. **Admin Lambda** - Keep existing cost monitoring

### API Endpoints
- `POST /submit` - Store new submission
- `GET /submissions` - Get submissions for bounty hunter display
- `GET /admin` - Keep existing admin dashboard

## 🎯 Bounty Hunter Display Changes

### Data Source Change
**Current:** Scraped social media posts
**New:** Direct submissions from DynamoDB

### Display Format
```javascript
// Geographic grouping (reuse existing dropdown logic)
{
  "US": {
    "California": {
      "Riverside": [
        {
          name: "Shannon Goddard",
          mission: "Mission 5: The Real Slim Shady",
          points: 3,
          proofUrl: "https://instagram.com/p/xyz123/",
          timestamp: "2025-11-14T..."
        }
      ]
    }
  }
}
```

## 🛡️ Community Validation System

### How It Works
1. **User submits** with URL + claims overlays/hashtags used
2. **Bounty hunters verify** by checking social media post
3. **Missing overlays/hashtags** = easy $5 bounty catch
4. **Economic enforcement** keeps submissions honest

### Phase 1: Simple Validation
- Users submit with `status: "submitted"`
- Community manually checks posts
- $5 beer penalty threat (honor system initially)

### Phase 2: Dispute System (Future)
- Add "dispute" button for bounty hunters
- Status tracking: `submitted → disputed → verified/penalized`
- Beer debt tracking system
- Community voting on disputes

## 📋 Implementation Checklist

### Frontend Changes
- [ ] Remove `userHandle` from signup form in app.html
- [ ] Standardize mission buttons (3 buttons per mission)
- [ ] Update direct-submission.js for mandatory URL
- [ ] Modify bounty-hunter.html to display submissions
- [ ] Update storage.js for new user/submission structure

### Backend Changes
- [ ] Create `mission-mischief-submissions` DynamoDB table
- [ ] Update admin-lambda.py to handle submissions
- [ ] Create bounty hunter API endpoint
- [ ] Update AWS permissions for new table

### Testing
- [ ] Test submission flow end-to-end
- [ ] Verify bounty hunter display works
- [ ] Confirm cost reduction achieved
- [ ] Test geographic grouping worldwide

## 🎯 Success Metrics
- **Cost:** Monthly AWS bill under $15
- **User Experience:** 3-button consistency across all missions
- **Data Quality:** Community validation catches 95%+ of fake submissions
- **Engagement:** Users prefer direct submission over waiting for scraping

## 🔮 Future Enhancements (Phase 2)
- Bounty hunter dispute system with voting
- Beer debt marketplace
- AI-assisted validation
- Real-time submission notifications
- Mobile app with camera integration

---

**Next Steps:** Start with frontend user form updates, then mission button standardization, then AWS backend changes.