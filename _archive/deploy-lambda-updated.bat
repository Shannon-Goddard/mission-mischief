@echo off
echo ========================================
echo Mission Mischief Lambda Deployment
echo ========================================
echo.
echo This will deploy the updated Lambda function with:
echo - Complete hashtag list from HASHTAG_LIST.txt
echo - Improved data processing
echo - Better mission tracking
echo.
pause

echo.
echo Step 1: Zipping Lambda function...
if exist lambda-deployment.zip del lambda-deployment.zip
powershell -command "Compress-Archive -Path 'index.js','package.json' -DestinationPath 'lambda-deployment.zip' -Force"

if not exist lambda-deployment.zip (
    echo ERROR: Failed to create deployment zip
    pause
    exit /b 1
)

echo ✅ Deployment package created: lambda-deployment.zip

echo.
echo Step 2: Deploying to AWS Lambda...
echo Function: mission-mischief-scraper
echo Region: us-east-1

aws lambda update-function-code ^
    --function-name mission-mischief-scraper ^
    --zip-file fileb://lambda-deployment.zip ^
    --region us-east-1

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Deployment failed!
    echo.
    echo Possible issues:
    echo - AWS CLI not configured
    echo - Function name doesn't exist
    echo - Insufficient permissions
    echo.
    echo Try running: aws configure
    pause
    exit /b 1
)

echo.
echo ✅ Lambda function deployed successfully!

echo.
echo Step 3: Testing the updated function...
echo Endpoint: https://imddm6sh0i.execute-api.us-east-1.amazonaws.com/prod/scrape

curl -X GET "https://imddm6sh0i.execute-api.us-east-1.amazonaws.com/prod/scrape" -H "Accept: application/json"

echo.
echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo The Lambda function now searches for:
echo - All 60+ hashtags from HASHTAG_LIST.txt
echo - Main hashtag: #missionmischief
echo - Points tracking: #missionmischiefpoints[number]
echo - Location tracking: country/state/city hashtags
echo - Justice system: evidence and redemption hashtags
echo.
echo Test your posts with #missionmischief hashtag
echo Check results at: test-lambda.html
echo.
pause