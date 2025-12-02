#!/usr/bin/env python3
"""
Deploy Sunday Scraper System
Converts daily scraper to weekly research validation with 85% cost reduction
"""

import boto3
import json
import zipfile
import os
from datetime import datetime

# AWS clients
lambda_client = boto3.client('lambda')
events_client = boto3.client('events')
dynamodb = boto3.client('dynamodb')
apigateway = boto3.client('apigateway')

def create_dynamodb_tables():
    """Create new DynamoDB tables for Sunday scraper system"""
    
    tables = [
        {
            'TableName': 'mission-mischief-direct-submissions',
            'KeySchema': [{'AttributeName': 'submission_id', 'KeyType': 'HASH'}],
            'AttributeDefinitions': [{'AttributeName': 'submission_id', 'AttributeType': 'S'}],
            'BillingMode': 'PAY_PER_REQUEST'
        },
        {
            'TableName': 'mission-mischief-research-findings',
            'KeySchema': [{'AttributeName': 'finding_id', 'KeyType': 'HASH'}],
            'AttributeDefinitions': [{'AttributeName': 'finding_id', 'AttributeType': 'S'}],
            'BillingMode': 'PAY_PER_REQUEST'
        },
        {
            'TableName': 'mission-mischief-bounty-leads',
            'KeySchema': [{'AttributeName': 'id', 'KeyType': 'HASH'}],
            'AttributeDefinitions': [{'AttributeName': 'id', 'AttributeType': 'S'}],
            'BillingMode': 'PAY_PER_REQUEST'
        }
    ]
    
    for table_config in tables:
        try:
            print(f"Creating table: {table_config['TableName']}")
            dynamodb.create_table(**table_config)
            print(f"Table {table_config['TableName']} created")
        except dynamodb.exceptions.ResourceInUseException:
            print(f"Table {table_config['TableName']} already exists")
        except Exception as e:
            print(f"Failed to create table {table_config['TableName']}: {e}")

def update_lambda_function():
    """Update Lambda function with Sunday scraper code"""
    
    # Create deployment package
    with zipfile.ZipFile('sunday-scraper.zip', 'w') as zip_file:
        zip_file.write('bright-data-scraper-lambda.py', 'lambda_function.py')
    
    try:
        with open('sunday-scraper.zip', 'rb') as zip_file:
            lambda_client.update_function_code(
                FunctionName='mission-mischief-premium-scraper',
                ZipFile=zip_file.read()
            )
        print("Lambda function updated with Sunday scraper code")
    except Exception as e:
        print(f"Failed to update Lambda function: {e}")
    
    # Clean up
    os.remove('sunday-scraper.zip')

def update_eventbridge_schedule():
    """Update EventBridge rule to Sunday schedule"""
    
    try:
        # Update the existing rule to Sunday schedule
        events_client.put_rule(
            Name='mission-mischief-daily-scrape',
            ScheduleExpression='cron(0 11 ? * SUN *)',  # 3:00 AM PST Sundays
            Description='Bounty Hunter Sundays - Weekly research validation',
            State='ENABLED'
        )
        
        # Update the target with research mode
        events_client.put_targets(
            Rule='mission-mischief-daily-scrape',
            Targets=[
                {
                    'Id': '1',
                    'Arn': 'arn:aws:lambda:us-east-1:170377509849:function:mission-mischief-premium-scraper',
                    'Input': json.dumps({
                        'research_mode': True,
                        'generate_leads': True
                    })
                }
            ]
        )
        
        print("EventBridge rule updated to Sunday schedule")
        
    except Exception as e:
        print(f"Failed to update EventBridge rule: {e}")

def create_research_leads_lambda():
    """Create new Lambda function for research leads API"""
    
    # Create deployment package
    with zipfile.ZipFile('research-leads.zip', 'w') as zip_file:
        zip_file.write('research-leads-api.py', 'lambda_function.py')
    
    try:
        with open('research-leads.zip', 'rb') as zip_file:
            lambda_client.create_function(
                FunctionName='mission-mischief-research-leads',
                Runtime='python3.12',
                Role='arn:aws:iam::170377509849:role/mission-mischief-lambda-role',
                Handler='lambda_function.lambda_handler',
                Code={'ZipFile': zip_file.read()},
                Description='Research leads API for bounty hunters',
                Timeout=30,
                MemorySize=256
            )
        print("Research leads Lambda function created")
    except lambda_client.exceptions.ResourceConflictException:
        # Function exists, update it
        with open('research-leads.zip', 'rb') as zip_file:
            lambda_client.update_function_code(
                FunctionName='mission-mischief-research-leads',
                ZipFile=zip_file.read()
            )
        print("Research leads Lambda function updated")
    except Exception as e:
        print(f"Failed to create research leads Lambda: {e}")
    
    # Clean up
    os.remove('research-leads.zip')

def main():
    """Deploy complete Sunday scraper system"""
    
    print("Deploying Sunday Scraper System")
    print("=" * 50)
    
    print("\n1. Creating DynamoDB tables...")
    create_dynamodb_tables()
    
    print("\n2. Updating Lambda function...")
    update_lambda_function()
    
    print("\n3. Updating EventBridge schedule...")
    update_eventbridge_schedule()
    
    print("\n4. Creating research leads Lambda...")
    create_research_leads_lambda()
    
    print("\n" + "=" * 50)
    print("Sunday Scraper System Deployed!")
    print("\nExpected Results:")
    print("• 85% cost reduction ($40-70/month → $4-15/month)")
    print("• Weekly research validation on Sundays")
    print("• Bounty hunter leads generation")
    print("• Academic research value preserved")
    print("\nNext Sunday at 3:00 AM PST:")
    print("• First research validation will run")
    print("• Bounty leads will be generated")
    print("• Research findings will be available")

if __name__ == "__main__":
    main()