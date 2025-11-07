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
            'message': 'Real hashtag blockchain data!',
            'data': get_real_hashtag_data()
        })
    }

def get_real_hashtag_data():
    try:
        # Exact format from Bright Data curl example
        url = 'https://api.brightdata.com/datasets/v3/scrape'
        headers = {
            'Authorization': 'Bearer 221583dff7ce123da7295b0e5bda7f15efcebdf14beb6b518ccafec3b6f08d6a',
            'Content-Type': 'application/json'
        }
        
        params = {
            'dataset_id': 'gd_lk5ns7kz21pck8jpis',
            'custom_output_fields': 'error,error_code,timestamp,images,location,photos,hashtags',
            'notify': 'false',
            'include_errors': 'true'
        }
        
        # Use hashtag URL instead of specific posts
        data = {
            'input': [{'url': 'https://www.instagram.com/explore/tags/missionmischief/'}]
        }
        
        response = requests.post(url, headers=headers, params=params, json=data, timeout=25)
        
        if response.status_code == 200:
            return process_real_data(response.json())
        else:
            return {'error': f'API failed: {response.status_code}', 'response': response.text[:200]}
            
    except Exception as e:
        return {'error': f'Exception: {str(e)}'}

def process_real_data(raw_data):
    leaderboard = []
    
    for item in raw_data.get('data', []):
        hashtags = item.get('hashtags', [])
        if hashtags and any('#missionmischief' in str(tag).lower() for tag in hashtags):
            leaderboard.append({
                'handle': f"@live_player_{len(leaderboard)+1}",
                'points': 10,
                'city': item.get('location', {}).get('city', 'Unknown') if item.get('location') else 'Live',
                'state': item.get('location', {}).get('state', 'REAL') if item.get('location') else 'REAL',
                'mugshot': item.get('images', [{}])[0].get('url', '') if item.get('images') else ''
            })
    
    return {
        'leaderboard': leaderboard[:10],
        'stats': {
            'posts_processed': len(raw_data.get('data', [])),
            'posts_verified': len(leaderboard),
            'source': 'bright_data_live'
        }
    }