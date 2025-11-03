@echo off
echo 🎯 Deploying working BULLETPROOF Lambda...
if exist lambda-working.zip del lambda-working.zip
powershell -Command "Compress-Archive -Path 'lambda-working.js' -DestinationPath 'lambda-working.zip' -Force"
aws lambda update-function-code --function-name mission-mischief-scraper --zip-file fileb://lambda-working.zip --region us-east-1
echo ✅ Working BULLETPROOF Lambda deployed!