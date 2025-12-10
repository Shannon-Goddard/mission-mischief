import json
import boto3
from decimal import Decimal
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
posts_table = dynamodb.Table('mission-mischief-posts')

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    try:
        # Scan all posts from DynamoDB
        response = posts_table.scan()
        items = response.get('Items', [])
        
        # Handle pagination if needed
        while 'LastEvaluatedKey' in response:
            response = posts_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response.get('Items', []))
        
        # Format data for frontend
        research_data = []
        for item in items:
            research_data.append({
                'timestamp': item.get('timestamp', ''),
                'user': item.get('user_handle', 'Unknown'),
                'mission_id': item.get('mission_id', 0),
                'platform': item.get('platform', 'unknown'),
                'points': item.get('points', 0),
                'city': item.get('city', 'Unknown'),
                'state': item.get('state', 'Unknown'),
                'country': item.get('country', 'Unknown'),
                'post_url': item.get('post_url', '#')
            })
        
        # Sort by timestamp descending
        research_data.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({
                'success': True,
                'data': research_data,
                'count': len(research_data)
            }, default=decimal_default)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': 'Failed to load research data'
            })
        }
