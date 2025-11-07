# Create deployment package with dependencies
mkdir lambda-package -Force
cd lambda-package

# Install dependencies
pip install -r ..\requirements.txt -t .

# Copy Lambda function
copy ..\premium-lambda.py lambda_function.py

# Create ZIP
Compress-Archive -Path * -DestinationPath ..\lambda-deployment.zip -Force

cd ..
Remove-Item lambda-package -Recurse -Force

# Update Lambda
aws lambda update-function-code --function-name mission-mischief-premium-scraper --zip-file fileb://lambda-deployment.zip

Write-Host "Lambda updated with dependencies!"