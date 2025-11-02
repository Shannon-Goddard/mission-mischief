@echo off
echo 🎯 BULLETPROOF HASHTAG BLOCKCHAIN - Phase 1 Deployment
echo =====================================================

echo 📦 Creating deployment package...
if exist lambda-deployment.zip del lambda-deployment.zip
powershell -Command "Compress-Archive -Path 'lambda-optimized.js' -DestinationPath 'lambda-deployment.zip' -Force"

echo 🚀 Deploying to AWS Lambda...
aws lambda update-function-code ^
    --function-name mission-mischief-scraper ^
    --zip-file fileb://lambda-deployment.zip ^
    --region us-east-1

if %ERRORLEVEL% EQU 0 (
    echo ✅ Lambda function updated successfully!
    echo 🧪 Testing endpoint...
    curl -X GET "https://imddm6sh0i.execute-api.us-east-1.amazonaws.com/prod/scrape"
) else (
    echo ❌ Deployment failed. Check AWS credentials and function name.
)

echo.
echo 📋 Next steps:
echo 1. Test the endpoint in test-lambda.html
echo 2. Verify all test posts are captured
echo 3. Check leaderboard accuracy
echo.
pause