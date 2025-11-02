#!/bin/bash
echo "🎯 BULLETPROOF HASHTAG BLOCKCHAIN - Phase 1 Deployment"
echo "====================================================="

echo "📦 Creating deployment package..."
rm -f lambda-deployment.zip
zip lambda-deployment.zip lambda-optimized.js

echo "🚀 Deploying to AWS Lambda..."
aws lambda update-function-code \
    --function-name mission-mischief-scraper \
    --zip-file fileb://lambda-deployment.zip \
    --region us-east-1

if [ $? -eq 0 ]; then
    echo "✅ Lambda function updated successfully!"
    echo "🧪 Testing endpoint..."
    curl -X GET "https://imddm6sh0i.execute-api.us-east-1.amazonaws.com/prod/scrape"
else
    echo "❌ Deployment failed. Check AWS credentials and function name."
fi

echo ""
echo "📋 Next steps:"
echo "1. Test the endpoint in test-bulletproof-phase1.html"
echo "2. Verify all test posts are captured"
echo "3. Check leaderboard accuracy"