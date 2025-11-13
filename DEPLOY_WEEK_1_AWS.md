# 🚀 Deploy Week 1 to AWS

## Quick AWS Integration (2 minutes)

### 1. Update Admin Lambda
```bash
# Zip the updated admin lambda
zip admin-lambda.zip admin-lambda.py

# Deploy to AWS
aws lambda update-function-code \
    --function-name mission-mischief-admin \
    --zip-file fileb://admin-lambda.zip
```

### 2. Update API Gateway (if needed)
The admin endpoint already exists at:
`https://4q1ybupwm0.execute-api.us-east-1.amazonaws.com/prod/admin`

It now handles both:
- **GET** - Admin dashboard data
- **POST** - Direct mission submissions

### 3. Test Integration
```javascript
// Test direct submission sync
const testSubmission = {
    missionId: 5,
    points: 3,
    proofUrl: 'https://instagram.com/p/test',
    timestamp: new Date().toISOString(),
    user: '@testuser'
};

AWSSync.syncSubmission(testSubmission);
```

## What's Now Connected:

✅ **Frontend** - Instant localStorage feedback  
✅ **AWS Sync** - Submissions saved to DynamoDB  
✅ **Admin Dashboard** - Shows real submission data  
✅ **Cost Tracking** - No additional AWS costs  

## How It Works:

1. **Player submits mission** → Instant localStorage feedback
2. **Background sync** → Saves to DynamoDB (graceful failure)
3. **Admin dashboard** → Shows real submission data
4. **Bounty hunter** → Can access submission history

## Current AWS Resources Used:

- **DynamoDB**: `mission-mischief-posts` (existing table)
- **Lambda**: `mission-mischief-admin` (updated function)  
- **API Gateway**: `4q1ybupwm0` (existing endpoint)
- **Cost**: $0 additional (uses existing infrastructure)

## Testing Checklist:

- [ ] Submit a mission via app.html
- [ ] Check browser console for "✅ AWS sync successful"
- [ ] Verify submission appears in admin dashboard
- [ ] Confirm DynamoDB has new record

**Ready to test your AWS-connected direct submission system!** 🎮⚡