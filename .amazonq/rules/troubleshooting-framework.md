# Mission Mischief - Amazon Q Troubleshooting Framework

## 🛠️ Structured Troubleshooting Protocol

### File Organization Standard
For any troubleshooting session, create this structure:
```
troubleshooting/
├── [YYYYMMDD]_[issue_name]/
│   ├── 01_initial_state/
│   ├── 02_changes_made/
│   │   └── changes_log.md
│   └── 03_final_state/
```

### Changes Log Template
```markdown
# 🛠️ [Issue Name] - Troubleshooting Session
**Date:** [YYYY-MM-DD]
**Files Affected:** [List primary files]
**Problem:** [One-line problem statement]

## Attempts Log

### Attempt 1
**Time:** [HH:MM]
**Files:** [file.ext (lines X-Y)]
**Change:** [What was modified]
**Reason:** [Why this change was made]
**Result:** [FAIL/PARTIAL/SUCCESS + description]
**Q Input:** [Question asked to Amazon Q]

### Final Solution
**Time:** [HH:MM]
**Files:** [Final working files]
**Solution:** [What actually fixed it]
**Key Learning:** [Important insight for future]
```

### Page-Specific Troubleshooting Rules

#### bounty-hunter.html
- **Data Source**: premium-api-client.js only
- **Geographic Display**: Handle player arrays with Instagram links
- **API Endpoint**: scraper.missionmischief.online/scrape
- **Common Issues**: CORS, data structure changes, caching

#### admin.html
- **Security**: Requires authentication check
- **Monitoring**: Real-time AWS costs and metrics
- **Alerts**: SMS/email via admin-lambda.py
- **Common Issues**: API permissions, cost calculation, alert thresholds

#### app.html
- **Button Functions**: Start Mission → badge-overlay.html, Share → copy hashtags
- **Toast System**: showToast() for user feedback
- **Mobile Focus**: Touch-optimized interface
- **Common Issues**: Button behavior, hashtag generation, mobile compatibility

### Debugging Checklist

#### Frontend Issues
1. Check browser console for errors
2. Verify API endpoint connectivity
3. Test with mobile viewport
4. Validate data structure matches expected format
5. Check localStorage for cached data conflicts

#### Backend Issues
1. Check CloudWatch logs for Lambda errors
2. Verify DynamoDB table access and data
3. Test Bright Data API connectivity
4. Check EventBridge schedule execution
5. Validate Secrets Manager credential access

#### Integration Issues
1. Verify CORS headers in API responses
2. Check API Gateway endpoint configuration
3. Test manual Lambda invocation
4. Validate data transformation between backend/frontend
5. Check custom domain routing (scraper.missionmischief.online)

### Emergency Procedures

#### System Down
1. Check admin.html dashboard for system status
2. Manually invoke Lambda via AWS Console
3. Verify Bright Data API status independently
4. Check DynamoDB table for recent data
5. Fallback to cached data if available

#### High Costs Alert
1. Check admin.html cost monitoring
2. Review Bright Data usage in dashboard
3. Verify Lambda execution frequency
4. Check for runaway processes or loops
5. Implement temporary rate limiting if needed

### Success Criteria Validation
- **Technical**: Daily scraping runs, >95% verification rate, <5s API response
- **User Experience**: Real data displays, geographic activity works, mobile-optimized
- **Business**: <$75/month costs, reliable operation, data quality maintained