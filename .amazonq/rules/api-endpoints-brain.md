# Mission Mischief - API Endpoints Brain

## 🌐 Production API Endpoints

### Primary Game Data Endpoints

#### **Premium Scraper API**
- **Primary**: `https://scraper.missionmischief.online/scrape`
- **Fallback**: `https://56uo9dqgte.execute-api.us-east-1.amazonaws.com/prod/scrape`
- **Method**: GET
- **Purpose**: Real-time hashtag blockchain data
- **Response**: Leaderboard, geography, missions, justice cases
- **Caching**: 5-minute client cache + S3 static files

#### **S3 Static Data Cache**
- **Endpoint**: `https://mission-mischief-raw-data-170377509849.s3.amazonaws.com/bounty-data.json`
- **Method**: GET
- **Purpose**: Instant loading cached data (updated daily 3:00 AM PST)
- **Performance**: Fastest option, pennies cost vs Lambda dollars
- **Fallback**: API Gateway if S3 fails

### Admin Dashboard Endpoints

#### **Admin API Gateway**
- **Endpoint**: `https://4q1ybupwm0.execute-api.us-east-1.amazonaws.com/prod/admin`
- **Method**: GET
- **Purpose**: Real-time cost monitoring, system health, alerts
- **Lambda**: mission-mischief-admin
- **Data Sources**: Cost Explorer, CloudWatch, DynamoDB, Bright Data API

#### **Bright Data Usage API**
- **Endpoint**: `https://brightdata.com/api/usage`
- **Method**: GET
- **Authentication**: Basic auth with stored credentials
- **Purpose**: Real usage metrics (requests, data consumed, quotas)
- **Integration**: Called from admin Lambda function

## 🏗️ AWS Infrastructure Endpoints

### Lambda Functions

#### **Premium Scraper Lambda**
- **Function Name**: `mission-mischief-premium-scraper`
- **Runtime**: Python 3.12
- **Schedule**: Daily 3:00 AM PST via EventBridge
- **Purpose**: Scrape Instagram/Facebook/X, update DynamoDB, generate S3 cache
- **Timeout**: 15 minutes
- **Memory**: 1024MB

#### **Admin Lambda**
- **Function Name**: `mission-mischief-admin`
- **Runtime**: Python 3.12
- **Trigger**: API Gateway requests
- **Purpose**: Cost monitoring, system health, Bright Data usage, alerts
- **Timeout**: 30 seconds
- **Memory**: 512MB

### DynamoDB Tables

#### **Posts Table**
- **Table Name**: `mission-mischief-posts`
- **Primary Key**: `post_id` (String)
- **TTL**: 90 days
- **Purpose**: Persistent storage for all scraped social media posts
- **GSI**: None currently configured

### S3 Buckets

#### **Raw Data Archive**
- **Bucket**: `mission-mischief-raw-data-170377509849`
- **Purpose**: Static cache files + raw data archive
- **Key Files**:
  - `bounty-data.json` (public cache)
  - `raw-data/YYYY/MM/DD/` (daily archives)
- **Lifecycle**: 90-day retention policy

## 🔐 Security & Authentication

### AWS Secrets Manager

#### **Admin Credentials**
- **Secret Name**: `mission-mischief/admin-phone`
- **Content**: Phone number for SMS alerts
- **Usage**: Admin Lambda for cost threshold alerts

#### **Bright Data Credentials**
- **Secret Name**: `mission-mischief/bright-data-credentials`
- **Content**: Username, password, customer ID
- **Usage**: Both scraper and admin Lambdas

#### **Alert Configuration**
- **Secret Name**: `mission-mischief/alert-config`
- **Content**: Cost threshold, email backup, phone number
- **Usage**: Admin Lambda for alert management

### CORS Configuration
- **Admin API**: `Access-Control-Allow-Origin: *`
- **Scraper API**: CORS enabled for cross-origin requests
- **S3 Static Files**: Public read access, no CORS needed

## 📊 Data Flow Architecture

### Bounty Hunter Data Flow
```
User Request → Premium API Client → S3 Cache (instant) → API Gateway (fallback) → Empty Structure (final fallback)
```

### Admin Dashboard Data Flow
```
Admin Request → Admin API → Cost Explorer + CloudWatch + DynamoDB + Bright Data API → Cached Response
```

### Daily Update Flow
```
EventBridge (3:00 AM PST) → Premium Scraper Lambda → Instagram/Facebook/X APIs → DynamoDB → S3 Static Cache
```

## 🧪 Testing & Debug Endpoints

### Manual Testing
- **Lambda Invoke**: Direct function invocation via AWS CLI
- **API Gateway Test**: Built-in test console
- **S3 Direct Access**: Browser-accessible JSON files

### Debug Functions
```javascript
// Frontend testing functions
window.testApiEndpoint = async function() {
    const result = await premiumApi.testScraper();
    console.log('🔬 Test result:', result);
};

window.manualRefresh = async function() {
    premiumApi.clearCache();
    await loadBountyHunterData();
};
```

## 🚨 Monitoring & Alerting

### CloudWatch Metrics
- **Namespace**: `MissionMischief`
- **Custom Metrics**: PostsProcessed, VerificationRate, ActivePlayers
- **Lambda Metrics**: Invocations, Errors, Duration
- **API Gateway Metrics**: Request count, latency, errors

### SNS Topics
- **Topic Name**: `mission-mischief-alerts`
- **Subscribers**: SMS (admin phone) + Email (backup)
- **Triggers**: Cost threshold exceeded, system failures

## 🔄 Caching Strategy

### Client-Side Caching
- **Premium API Client**: 5-minute cache with timestamp validation
- **Admin Dashboard**: 5-minute cache with manual clear option
- **Cache Keys**: Based on endpoint and request parameters

### Server-Side Caching
- **S3 Static Files**: Daily updates, instant global access
- **Lambda Response Caching**: Not implemented (stateless functions)
- **DynamoDB**: No caching layer (direct queries)

## 🎯 Performance Optimization

### Response Time Targets
- **S3 Static Data**: < 500ms (global CDN)
- **API Gateway**: < 5 seconds (real-time processing)
- **Admin Dashboard**: < 3 seconds (cached data preferred)

### Cost Optimization
- **S3 First**: Pennies per request vs Lambda dollars
- **Smart Caching**: Reduce API calls with intelligent cache management
- **Efficient Queries**: Optimized DynamoDB access patterns

## 🔮 Future Endpoint Evolution

### Trinity Protocol Endpoints
- **AI Thought Stream**: `https://mayhem-thoughts.s3.amazonaws.com/public-feed.json`
- **Multi-AI Collaboration**: WebSocket endpoints for real-time AI communication
- **Economic API**: Buy Me a Coffee integration endpoints

### Enhanced Features
- **Real-time Updates**: WebSocket connections for live data
- **Geographic API**: Enhanced location services
- **Analytics Endpoints**: Advanced metrics and reporting

This API endpoints brain provides complete knowledge of all Mission Mischief infrastructure endpoints, their purposes, authentication, and integration patterns for seamless development and troubleshooting.