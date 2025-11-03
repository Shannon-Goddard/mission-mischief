@echo off
echo 🎯 Deploying index.js BULLETPROOF Lambda...
if exist lambda-index.zip del lambda-index.zip
powershell -Command "Compress-Archive -Path 'index.js' -DestinationPath 'lambda-index.zip' -Force"
aws lambda update-function-code --function-name mission-mischief-scraper --zip-file fileb://lambda-index.zip --region us-east-1
echo ✅ index.js BULLETPROOF Lambda deployed!