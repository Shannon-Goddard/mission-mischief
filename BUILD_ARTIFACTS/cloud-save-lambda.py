#!/usr/bin/env python3
"""
Mission Mischief - Cloud Save Lambda
Cross-device game state sync keyed by license key
Routes: POST /save, GET /load
"""

import json
import boto3
import logging
from datetime import datetime, timezone
from decimal import Decimal

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')

CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
}

def key_exists(license_key):
    """Verify license key is registered before allowing save/load"""
    try:
        table = dynamodb.Table('mission-mischief-users')
        response = table.get_item(Key={'license_key': license_key})
        item = response.get('Item')
        return item is not None and item.get('status') == 'active'
    except Exception as e:
        logger.error(f"Key check failed: {e}")
        return False

def sanitize_for_dynamo(obj):
    """
    Recursively convert floats to Decimal for DynamoDB.
    DynamoDB doesn't accept Python float type.
    """
    if isinstance(obj, float):
        return Decimal(str(obj))
    if isinstance(obj, dict):
        return {k: sanitize_for_dynamo(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [sanitize_for_dynamo(i) for i in obj]
    return obj

def restore_from_dynamo(obj):
    """Convert Decimal back to float/int for JSON serialization"""
    if isinstance(obj, Decimal):
        return int(obj) if obj == int(obj) else float(obj)
    if isinstance(obj, dict):
        return {k: restore_from_dynamo(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [restore_from_dynamo(i) for i in obj]
    return obj

def handle_save(body):
    """POST /save — save full user state to DynamoDB"""
    license_key = body.get('key', '').strip()
    user_data = body.get('data', {})

    if not license_key:
        return response_body(400, {'success': False, 'error': 'License key required'})

    if not key_exists(license_key):
        return response_body(403, {'success': False, 'error': 'Invalid or unregistered key'})

    if not user_data:
        return response_body(400, {'success': False, 'error': 'No data provided'})

    try:
        table = dynamodb.Table('mission-mischief-saves')

        # Strip the QR code image data before saving to DynamoDB
        # It's large (base64 image) and doesn't need to be in the cloud
        # Players re-upload QR on new devices
        save_data = {k: v for k, v in user_data.items() if k != 'qrCodeData'}

        table.put_item(Item={
            'license_key': license_key,
            'user_data': sanitize_for_dynamo(save_data),
            'saved_at': datetime.now(timezone.utc).isoformat(),
            'version': int(datetime.now().timestamp())
        })

        logger.info(f"Cloud save successful for key: {license_key[:8]}...")
        return response_body(200, {'success': True})

    except Exception as e:
        logger.error(f"Cloud save failed: {e}")
        return response_body(500, {'success': False, 'error': 'Save failed'})

def handle_load(query_params):
    """GET /load?key=ABC-123 — load user state from DynamoDB"""
    license_key = (query_params or {}).get('key', '').strip()

    if not license_key:
        return response_body(400, {'success': False, 'error': 'License key required'})

    if not key_exists(license_key):
        return response_body(403, {'success': False, 'error': 'Invalid or unregistered key'})

    try:
        table = dynamodb.Table('mission-mischief-saves')
        response = table.get_item(Key={'license_key': license_key})
        item = response.get('Item')

        if not item:
            return response_body(200, {'success': True, 'user': None})

        user_data = restore_from_dynamo(item.get('user_data', {}))

        logger.info(f"Cloud load successful for key: {license_key[:8]}...")
        return response_body(200, {
            'success': True,
            'user': user_data,
            'saved_at': item.get('saved_at')
        })

    except Exception as e:
        logger.error(f"Cloud load failed: {e}")
        return response_body(500, {'success': False, 'error': 'Load failed'})

def response_body(status_code, body_dict):
    return {
        'statusCode': status_code,
        'headers': CORS_HEADERS,
        'body': json.dumps(body_dict)
    }

def lambda_handler(event, context):
    # CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return response_body(200, {})

    path = event.get('path', '')
    method = event.get('httpMethod', 'GET')

    try:
        if path.endswith('/save') and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            return handle_save(body)

        if path.endswith('/load') and method == 'GET':
            params = event.get('queryStringParameters')
            return handle_load(params)

        return response_body(404, {'error': 'Not found'})

    except Exception as e:
        logger.error(f"Lambda handler failed: {e}")
        return response_body(500, {'error': str(e)})
