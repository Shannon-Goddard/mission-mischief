# Deploy Mission Mischief Premium Lambda
Write-Host "Deploying Mission Mischief Premium Lambda..." -ForegroundColor Green

# Copy premium-lambda.py to lambda_function.py for AWS
Copy-Item "premium-lambda.py" "lambda_function.py"

# Create deployment package
Compress-Archive -Path "lambda_function.py" -DestinationPath "lambda-deployment.zip" -Force

# Wait for stack to complete
Write-Host "Waiting for CloudFormation stack to complete..." -ForegroundColor Yellow
aws cloudformation wait stack-create-complete --stack-name mission-mischief-premium

# Update Lambda function code
Write-Host "Updating Lambda function code..." -ForegroundColor Blue
aws lambda update-function-code --function-name mission-mischief-premium-scraper --zip-file fileb://lambda-deployment.zip

# Clean up
Remove-Item "lambda_function.py"
Remove-Item "lambda-deployment.zip"

Write-Host "Deployment complete! Your hashtag blockchain is now bulletproof!" -ForegroundColor Green