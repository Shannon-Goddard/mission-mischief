# Mission Mischief - Deployment Brain

## 🚀 AWS Infrastructure Overview

### Current Deployment Status
- **Environment**: Production
- **Region**: us-east-1 (N. Virginia)
- **Account ID**: 170377509849
- **Deployment Method**: Manual AWS CLI + CloudFormation templates

## 🏗️ Core Infrastructure Components

### Lambda Functions

#### **mission-mischief-premium-scraper**
- **Runtime**: Python 3.12
- **Memory**: 1024MB
- **Timeout**: 15 minutes (900 seconds)
- **Role**: mission-mischief-lambda-role
- **Trigger**: EventBridge rule (daily 3:00 AM PST)
- **Environment Variables**: None (uses Secrets Manager)
- **Layers**: None (requests library included in deployment package)

#### **mission-mischief-admin**
- **Runtime**: Python 3.12
- **Memory**: 512MB
- **Timeout**: 30 seconds
- **Role**: mission-mischief-lambda-role (shared)
- **Trigger**: API Gateway requests
- **Dependencies**: boto3, requests (for Bright Data API)

### API Gateway

#### **mission-mischief-admin-api**
- **API ID**: 4q1ybupwm0
- **Type**: REST API
- **Stage**: prod
- **Endpoint**: https://4q1ybupwm0.execute-api.us-east-1.amazonaws.com/prod/admin
- **Method**: GET /admin
- **Integration**: AWS_PROXY with mission-mischief-admin Lambda
- **CORS**: Enabled for cross-origin requests

#### **Premium Scraper API** (Legacy)
- **API ID**: 56uo9dqgte
- **Endpoint**: https://56uo9dqgte.execute-api.us-east-1.amazonaws.com/prod/scrape
- **Status**: Fallback endpoint for premium-api-client.js

### DynamoDB Tables

#### **mission-mischief-posts**
- **Primary Key**: post_id (String)
- **Billing Mode**: On-demand
- **TTL**: Enabled (90 days)
- **TTL Attribute**: ttl
- **Point-in-time Recovery**: Disabled (cost optimization)
- **Encryption**: AWS managed keys

### S3 Buckets

#### **mission-mischief-raw-data-170377509849**
- **Purpose**: Static cache files + raw data archive
- **Public Access**: Enabled for bounty-data.json
- **Versioning**: Disabled
- **Lifecycle Policy**: 90-day retention for raw data
- **Key Structure**:
  - `bounty-data.json` (public cache)
  - `raw-data/YYYY/MM/DD/scrape-results.json`

### EventBridge Rules

#### **mission-mischief-daily-scrape**
- **Schedule**: cron(0 11 * * ? *) = 3:00 AM PST
- **Target**: mission-mischief-premium-scraper Lambda
- **Status**: Enabled
- **Description**: Daily automated hashtag blockchain collection

### IAM Roles & Policies

#### **mission-mischief-lambda-role**
- **Trusted Entity**: lambda.amazonaws.com
- **Attached Policies**:
  - AWSLambdaBasicExecutionRole (AWS managed)
  - Custom policy for DynamoDB, S3, Secrets Manager, SNS, Cost Explorer, CloudWatch

#### **Custom Policy Permissions**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:170377509849:table/mission-mischief-posts"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::mission-mischief-raw-data-170377509849/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:170377509849:secret:mission-mischief/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "cloudwatch:GetMetricStatistics",
        "sns:CreateTopic",
        "sns:Subscribe",
        "sns:Publish"
      ],
      "Resource": "*"
    }
  ]
}
```

## 🔐 Secrets Management

### AWS Secrets Manager Secrets

#### **mission-mischief/admin-phone**
- **ARN**: arn:aws:secretsmanager:us-east-1:170377509849:secret:mission-mischief/admin-phone-4trb6U
- **Content**: Phone number for SMS alerts
- **Rotation**: Manual

#### **mission-mischief/bright-data-credentials**
- **ARN**: arn:aws:secretsmanager:us-east-1:170377509849:secret:mission-mischief/bright-data-credentials-ma7xmW
- **Content**: JSON with username, password, customer_id
- **Rotation**: Manual

#### **mission-mischief/alert-config**
- **ARN**: arn:aws:secretsmanager:us-east-1:170377509849:secret:mission-mischief/alert-config-VbRqUO
- **Content**: JSON with cost_threshold, email, phone
- **Rotation**: Manual

## 📊 Monitoring & Alerting

### CloudWatch Log Groups
- **/aws/lambda/mission-mischief-premium-scraper**
- **/aws/lambda/mission-mischief-admin**
- **Retention**: 14 days (cost optimization)

### SNS Topics
- **mission-mischief-alerts**: Created dynamically by admin Lambda
- **Subscriptions**: SMS + Email (managed by Lambda)

### Custom Metrics
- **Namespace**: MissionMischief
- **Metrics**: PostsProcessed, VerificationRate, ActivePlayers
- **Dimensions**: Date, Source, Region

## 🔄 Deployment Procedures

### Lambda Function Updates
```bash
# Create deployment package
zip -r function.zip lambda_function.py

# Update function code
aws lambda update-function-code \
    --function-name mission-mischief-premium-scraper \
    --zip-file fileb://function.zip

# Update configuration if needed
aws lambda update-function-configuration \
    --function-name mission-mischief-premium-scraper \
    --timeout 900 \
    --memory-size 1024
```

### Infrastructure as Code
```yaml
# infrastructure.yaml (CloudFormation template)
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Mission Mischief Premium Infrastructure'

Parameters:
  AccountId:
    Type: String
    Default: '170377509849'
    
Resources:
  # DynamoDB Table
  PostsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: mission-mischief-posts
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: post_id
          AttributeType: S
      KeySchema:
        - AttributeName: post_id
          KeyType: HASH
      TimeToLiveSpecification:
        AttributeName: ttl
        Enabled: true
```

### Environment Configuration
- **Development**: Local testing with mock data
- **Staging**: Not currently implemented
- **Production**: Live AWS infrastructure

## 💰 Cost Management

### Current Monthly Costs (Target: $50-70)
- **Bright Data API**: $30-50 (70% of budget)
- **AWS Lambda**: $2-5
- **DynamoDB**: $5-10
- **S3 Storage**: $1-2
- **API Gateway**: $1-2
- **CloudWatch**: $2-3
- **Secrets Manager**: $1-2

### Cost Optimization Strategies
- **S3 First**: Static files cost pennies vs Lambda dollars
- **On-demand DynamoDB**: Pay only for actual usage
- **Short log retention**: 14 days vs default 30 days
- **Efficient Lambda sizing**: Right-sized memory allocation

## 🧪 Testing & Validation

### Manual Testing Commands
```bash
# Test Lambda function
aws lambda invoke \
    --function-name mission-mischief-premium-scraper \
    --payload '{}' \
    test-output.json

# Check DynamoDB data
aws dynamodb scan \
    --table-name mission-mischief-posts \
    --limit 5

# Test API Gateway endpoint
curl -X GET "https://4q1ybupwm0.execute-api.us-east-1.amazonaws.com/prod/admin"
```

### Health Checks
- **Lambda Execution**: CloudWatch metrics for invocations/errors
- **API Gateway**: Response time and error rate monitoring
- **DynamoDB**: Read/write capacity and throttling metrics
- **S3**: Request metrics and error rates

## 🔮 Future Infrastructure Plans

### Trinity Protocol Requirements
- **WebSocket API**: Real-time AI thought streaming
- **Additional S3 Buckets**: AI thought logs and collaboration data
- **Enhanced Monitoring**: Multi-AI system health tracking
- **Economic Integration**: Buy Me a Coffee API endpoints

### Scalability Considerations
- **DynamoDB Auto Scaling**: If usage grows significantly
- **Lambda Concurrency**: Reserved capacity for peak loads
- **CloudFront CDN**: Global distribution for S3 static files
- **Multi-region**: Disaster recovery and global performance

This deployment brain provides complete infrastructure knowledge for maintaining, updating, and scaling the Mission Mischief AWS architecture.