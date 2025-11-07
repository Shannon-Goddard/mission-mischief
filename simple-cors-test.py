import json

def lambda_handler(event, context):
    # Handle CORS preflight
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
    
    # Handle actual request
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
            'message': 'CORS test successful!',
            'data': {
                'leaderboard': [
                    {'handle': '@testuser', 'points': 3, 'city': 'Austin', 'state': 'TX'},
                    {'handle': '@player2', 'points': 5, 'city': 'Seattle', 'state': 'WA'}
                ],
                'stats': {'posts_processed': 2, 'posts_verified': 2}
            }
        })
    }