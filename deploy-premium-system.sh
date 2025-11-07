#!/bin/bash
# Mission Mischief Premium Scraper Deployment Script

set -e

echo "🎭 Mission Mischief Premium Scraper Deployment"
echo "=============================================="

# Configuration
STACK_NAME="mission-mischief-premium"
REGION="us-east-1"
LAMBDA_ZIP="premium-lambda.zip"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Get scraper API key
if [ -z "$SCRAPER_API_KEY" ]; then
    echo "🔑 Enter your premium scraper API key:"
    read -s SCRAPER_API_KEY
    if [ -z "$SCRAPER_API_KEY" ]; then
        echo "❌ API key is required"
        exit 1
    fi
fi

echo "📦 Preparing Lambda deployment package..."

# Create Lambda deployment package
rm -f $LAMBDA_ZIP
cp premium-lambda.py lambda_function.py
zip $LAMBDA_ZIP lambda_function.py

# Create requirements.txt for Lambda layers if needed
cat > requirements.txt << EOF
requests>=2.31.0
boto3>=1.34.0
botocore>=1.34.0
EOF

echo "🚀 Deploying CloudFormation stack..."

# Deploy the stack
aws cloudformation deploy \
    --template-file infrastructure.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides ScraperApiKey=$SCRAPER_API_KEY \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ CloudFormation stack deployed successfully"
else
    echo "❌ CloudFormation deployment failed"
    exit 1
fi

echo "📤 Updating Lambda function code..."

# Get Lambda function name from stack outputs
LAMBDA_FUNCTION=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`LambdaFunction`].OutputValue' \
    --output text)

# Update Lambda function code
aws lambda update-function-code \
    --function-name mission-mischief-premium-scraper \
    --zip-file fileb://$LAMBDA_ZIP \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Lambda function code updated successfully"
else
    echo "❌ Lambda function update failed"
    exit 1
fi

echo "📊 Getting deployment information..."

# Get stack outputs
OUTPUTS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs')

echo "🎯 Deployment Complete!"
echo "======================"
echo "Stack Name: $STACK_NAME"
echo "Region: $REGION"
echo ""
echo "📋 Resources Created:"
echo "- DynamoDB Table: mission-mischief-posts"
echo "- S3 Bucket: mission-mischief-raw-data-[account-id]"
echo "- Lambda Function: mission-mischief-premium-scraper"
echo "- EventBridge Rule: Daily at 3:00 AM PST"
echo "- CloudWatch Alarms: Verification rate & failure monitoring"
echo ""

# Extract API endpoint
API_ENDPOINT=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="ApiEndpoint") | .OutputValue')
if [ "$API_ENDPOINT" != "null" ]; then
    echo "🌐 API Endpoint: $API_ENDPOINT"
fi

echo ""
echo "🔍 Next Steps:"
echo "1. Test the system: aws lambda invoke --function-name mission-mischief-premium-scraper test-output.json"
echo "2. Check CloudWatch logs: aws logs describe-log-groups --log-group-name-prefix /aws/lambda/mission-mischief"
echo "3. Monitor metrics in CloudWatch console"
echo "4. Update your frontend to use the new API endpoint"
echo ""
echo "⏰ The system will automatically run daily at 3:00 AM PST"
echo "💰 Estimated monthly cost: ~$50-70 (depending on scraper usage)"

# Cleanup
rm -f lambda_function.py $LAMBDA_ZIP requirements.txt

echo "🎉 Mission Mischief Premium Scraper is ready!"