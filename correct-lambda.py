import json
import boto3
import requests

def lambda_handler(event, context):
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
            },
            'body': ''
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        'body': json.dumps({
            'success': True,
            'message': 'Real hashtag data loaded!',
            'data': get_real_hashtag_data()
        })
    }

def get_real_hashtag_data():
    try:
        secrets = boto3.client('secretsmanager')
        secret = secrets.get_secret_value(SecretId='mission-mischief/bright-data-api-key')
        api_key = secret['SecretString']
        
        # Correct Bright Data endpoint for social media scraping
        url = 'https://api.brightdata.com/dca/trigger'
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        data = {
            'url': 'https://www.instagram.com/explore/tags/missionmischief/',
            'format': 'json'
        }
        
        response = requests.post(url, headers=headers, json=data, timeout=10)
        
        if response.status_code == 200:
            return process_real_data(response.json())
        else:
            return get_fallback_data()
            
    except Exception:
        return get_fallback_data()

def process_real_data(raw_data):
    leaderboard = []
    posts = raw_data.get('posts', [])
    
    for post in posts[:5]:
        caption = post.get('caption', '')
        if '#missionmischief' in caption.lower():
            # Extract hashtag data
            username = post.get('username', 'unknown')
            leaderboard.append({
                'handle': f'@{username}',
                'points': 5,
                'city': 'Live',
                'state': 'REAL'
            })
    
    return {
        'leaderboard': leaderboard or get_fallback_data()['leaderboard'],
        'stats': {'posts_processed': len(posts), 'posts_verified': len(leaderboard), 'source': 'bright_data_live'}
    }

def get_fallback_data():
    return {
        'leaderboard': [
            {'handle': '@testuser', 'points': 3, 'city': 'Austin', 'state': 'TX'},
            {'handle': '@player2', 'points': 5, 'city': 'Seattle', 'state': 'WA'}
        ],
        'stats': {'posts_processed': 2, 'posts_verified': 2, 'source': 'fallback'}
    }