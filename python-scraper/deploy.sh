#!/bin/bash
# Mission Mischief AWS Deployment Script

set -e

# Configuration
AWS_REGION="us-east-1"
STACK_NAME="mission-mischief-scraper"
ECR_REPO_NAME="mission-mischief-scraper"

echo "🚀 Mission Mischief AWS Deployment Starting..."

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "📋 AWS Account ID: $AWS_ACCOUNT_ID"

# Create ECR repository if it doesn't exist
echo "📦 Setting up ECR repository..."
aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $AWS_REGION 2>/dev/null || \
aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION

# Get ECR login token
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build Docker image
echo "🏗️ Building Docker image..."
docker build -t $ECR_REPO_NAME .

# Tag image for ECR
echo "🏷️ Tagging image..."
docker tag $ECR_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest

# Push image to ECR
echo "⬆️ Pushing image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest

# Deploy CloudFormation stack
echo "☁️ Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file cloudformation-template.yml \
  --stack-name $STACK_NAME \
  --capabilities CAPABILITY_IAM \
  --region $AWS_REGION \
  --parameter-overrides \
    VpcId=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query "Vpcs[0].VpcId" --output text --region $AWS_REGION) \
    SubnetIds=$(aws ec2 describe-subnets --filters "Name=default-for-az,Values=true" --query "Subnets[*].SubnetId" --output text --region $AWS_REGION | tr '\t' ',')

# Get outputs
echo "📊 Getting deployment outputs..."
ALB_DNS=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION --query "Stacks[0].Outputs[?OutputKey=='LoadBalancerDNS'].OutputValue" --output text)

echo ""
echo "✅ Deployment Complete!"
echo "🌐 Your scraper is available at: http://$ALB_DNS"
echo "📡 Scrape endpoint: http://$ALB_DNS/scrape"
echo "❤️ Health check: http://$ALB_DNS/health"
echo ""
echo "🔧 Next steps:"
echo "1. Set up SSL certificate for https://scraper.missionmischief.online"
echo "2. Update DNS to point to: $ALB_DNS"
echo "3. Update frontend to use: https://scraper.missionmischief.online/scrape"
echo ""
echo "🎭 Your hashtag blockchain is now enterprise-grade! ⛓️"