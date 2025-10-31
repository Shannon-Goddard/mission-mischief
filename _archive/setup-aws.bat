@echo off
echo 🔧 Setting up AWS resources for Mission Mischief...

echo 1️⃣ Creating IAM role...
aws iam create-role ^
  --role-name lambda-execution-role ^
  --assume-role-policy-document file://create-iam-role.json

echo 2️⃣ Attaching basic execution policy...
aws iam attach-role-policy ^
  --role-name lambda-execution-role ^
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

echo 3️⃣ Attaching SSM parameter access...
aws iam attach-role-policy ^
  --role-name lambda-execution-role ^
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess

echo 4️⃣ Getting account ID...
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i
echo Your AWS Account ID: %ACCOUNT_ID%

echo 5️⃣ Creating API keys in Parameter Store...
echo Enter your Facebook access token:
set /p FB_TOKEN=
aws ssm put-parameter --name "/mission-mischief/facebook/access-token" --value "%FB_TOKEN%" --type "SecureString"

echo Enter your Instagram access token:
set /p IG_TOKEN=
aws ssm put-parameter --name "/mission-mischief/instagram/access-token" --value "%IG_TOKEN%" --type "SecureString"

echo Enter your Twitter bearer token:
set /p TW_TOKEN=
aws ssm put-parameter --name "/mission-mischief/twitter/bearer-token" --value "%TW_TOKEN%" --type "SecureString"

echo ✅ AWS setup complete!
echo Next: Run deploy-lambda.bat with your account ID: %ACCOUNT_ID%
pause