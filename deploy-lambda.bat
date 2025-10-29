@echo off
echo 🚀 Deploying Mission Mischief Lambda Function...

cd lambda
echo 📦 Installing dependencies...
npm install

echo 🗜️ Creating deployment package...
powershell Compress-Archive -Path *.js,package.json,node_modules -DestinationPath ../lambda-deployment.zip -Force

cd ..
echo ☁️ Deploying to AWS Lambda...
aws lambda create-function ^
  --function-name mission-mischief-scraper ^
  --runtime nodejs18.x ^
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role ^
  --handler index.handler ^
  --zip-file fileb://lambda-deployment.zip ^
  --timeout 30 ^
  --memory-size 256

echo 🌐 Creating API Gateway...
aws apigateway create-rest-api --name mission-mischief-api

echo ✅ Deployment complete!
pause