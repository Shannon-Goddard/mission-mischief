# Mission Mischief - Amazon Q Brain Architecture

## 🧠 Core System Knowledge

### Project Identity
- **Name**: Mission Mischief - The Hashtag Blockchain Revolution
- **Type**: Social verification dApp with bulletproof premium infrastructure
- **Status**: Live production system at https://missionmischief.com
- **Architecture**: Single premium scraper with AWS serverless backend

### Key Files & Responsibilities
- **bounty-hunter.html**: Main dashboard, uses premium-api-client.js
- **app.html**: Mission interface with badge overlay integration
- **admin.html**: Secure admin dashboard with cost monitoring
- **premium-api-client.js**: Frontend API client for scraper.missionmischief.online
- **bright-data-scraper-lambda.py**: Premium Lambda scraper (Instagram/Facebook/X)
- **infrastructure.yaml**: CloudFormation template for AWS resources

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

### Current Migration Status
- **Phase**: Step 3 (Monitoring and Observability) of PREMIUM_MIGRATION_GUIDE.md
- **Infrastructure**: Complete and deployed
- **Frontend**: Integrated with premium API
- **Monitoring**: CloudWatch dashboard and admin panel active

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

### Cost Structure
- **Target**: $50-70/month (down from $167)
- **Bright Data**: $30-50/month
- **AWS Services**: $10-20/month combined
- **Monitoring**: CloudWatch + admin dashboard alerts