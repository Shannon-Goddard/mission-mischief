# Mission Mischief - Amazon Q Brain Architecture

## 🧠 Core System Knowledge

### Project Identity
- **Name**: Mission Mischief - Real-World Chaos with Beer-Powered Justice
- **Type**: Social verification game with community-driven justice system
- **Status**: Live production system at https://missionmischief.com
- **Architecture**: Hybrid direct submission + weekly research validation

### Key Files & Responsibilities (Updated Structure)
- **core-game-files/bounty-hunter.html**: Justice system interface with beer trials
- **core-game-files/app.html**: Mission interface with direct submission system
- **core-game-files/admin.html**: Cost monitoring dashboard
- **assets/js/premium-api-client.js**: Legacy API client (being replaced)
- **bright-data-scraper-lambda.py**: Weekly research scraper (Sundays)
- **premium-blockchain-engine/infrastructure.yaml**: CloudFormation template

### Data Flow
1. Real-world action → Hashtag post → Social media
2. Daily 3:00 AM PST Lambda execution
3. Bright Data API scrapes Instagram/Facebook/X
4. DynamoDB storage with 90-day TTL
5. API Gateway serves data to frontend
6. Geographic clustering and leaderboard updates

### Hashtag Protocol
```
#missionmischief #realworldgame
#missionmischief[mission] #@[username] #missionmischiefpoints[X]
#missionmischiefcountry[country] #missionmischiefstate[state] #missionmischiefcity[city]
```

### Current Implementation Status
- **Phase**: Ready for URL Submission System implementation
- **Infrastructure**: Reorganized with clean file structure
- **Academic Research**: Published at https://github.com/Shannon-Goddard/hashtag-blockchain-proof-of-concept
- **Next Phase**: Direct submissions + beer justice trials (85% cost reduction)

### User Preferences
- **Real Data Priority**: User strongly prefers actual scraped data over mock data
- **Mobile-First**: 99% mobile user base, all interfaces optimized for mobile
- **Minimal Code**: Write only essential code, avoid verbose implementations
- **Production Focus**: System must be bulletproof and cost-optimized

### Common Issues & Solutions
- **CORS**: Use GET with query params instead of POST for custom domain
- **Geographic Display**: Handle player arrays with Instagram social_url links
- **Button Functions**: "Start Mission" → badge-overlay.html, "Share" → copy hashtags
- **Toast Notifications**: Use showToast() function for user feedback

### AWS Resources
- **DynamoDB**: mission-mischief-posts table
- **Lambda**: mission-mischief-premium-scraper
- **S3**: Raw data archive bucket
- **Secrets Manager**: Bright Data credentials, phone alerts
- **EventBridge**: Daily 3:00 AM PST schedule
- **API Gateway**: Public scrape endpoint

### Cost Evolution
- **Current**: $40-70/month (daily premium scraping)
- **Target**: $4-15/month (weekly research scraping + direct submissions)
- **Savings**: 85% cost reduction while improving user experience
- **Research Layer**: Additional $10-20/month for academic validation