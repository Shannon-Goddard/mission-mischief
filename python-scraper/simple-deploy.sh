#!/bin/bash
# Simple Mission Mischief Deployment - Just ECR + Basic ECS

set -e

AWS_REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_NAME="mission-mischief-scraper"

echo "🚀 Simple deployment starting..."

# Create ECR repository
aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $AWS_REGION 2>/dev/null || \
aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION

# Login and push image (already built)
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest

echo "✅ Image pushed to ECR!"
echo "🌐 ECR URI: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest"
echo ""
echo "🔧 Next: Deploy manually via AWS Console ECS"
echo "📋 Use this image URI in your ECS task definition"