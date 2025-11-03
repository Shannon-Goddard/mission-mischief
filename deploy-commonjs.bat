@echo off
echo 🎯 Deploying CommonJS BULLETPROOF Lambda...
if exist lambda-commonjs.zip del lambda-commonjs.zip
powershell -Command "Compress-Archive -Path 'lambda-commonjs.js' -DestinationPath 'lambda-commonjs.zip' -Force"
aws lambda update-function-code --function-name mission-mischief-scraper --zip-file fileb://lambda-commonjs.zip --region us-east-1
echo ✅ CommonJS BULLETPROOF Lambda deployed!