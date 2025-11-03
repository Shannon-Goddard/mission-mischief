@echo off
echo 🧪 Deploying simple test Lambda...
if exist lambda-test.zip del lambda-test.zip
powershell -Command "Compress-Archive -Path 'lambda-simple-test.js' -DestinationPath 'lambda-test.zip' -Force"
aws lambda update-function-code --function-name mission-mischief-scraper --zip-file fileb://lambda-test.zip --region us-east-1
echo ✅ Simple test deployed!