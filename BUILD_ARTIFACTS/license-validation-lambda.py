#!/usr/bin/env python3
"""
Mission Mischief - License Key Validation Lambda
Validates Lemon Squeezy license keys and handles webhook events
Routes: POST /validate-key, POST /webhook
"""

import json
import boto3
import logging
import hmac
import hashlib
import requests
from datetime import datetime, timezone
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

secrets_manager = boto3.client('secretsmanager')
dynamodb = boto3.resource('dynamodb')

CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
}

def get_ls_credentials():
    """Get Lemon Squeezy credentials from Secrets Manager"""
    try:
        response = secrets_manager.get_secret_value(
            SecretId='mission-mischief/lemon-squeezy'
        )
        return json.loads(response['SecretString'])
    except Exception as e:
        logger.error(f"Failed to get LS credentials: {e}")
        return None

def validate_ls_key(license_key, instance_name):
    """
    Validate license key against Lemon Squeezy API
    Returns: { valid: bool, activation_id: str, error: str }
    """
    creds = get_ls_credentials()
    if not creds:
        return {'valid': False, 'error': 'Configuration error'}

    try:
        response = requests.post(
            'https://api.lemonsqueezy.com/v1/licenses/validate',
            headers={
                'Authorization': f"Bearer {creds['api_key']}",
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            json={
                'license_key': license_key,
                'instance_name': instance_name or 'unknown'
            },
            timeout=10
        )

        data = response.json()
        logger.info(f"LS validate response status: {response.status_code}")

        if response.status_code == 200 and data.get('valid'):
            return {
                'valid': True,
                'activation_id': data.get('instance', {}).get('id'),
                'license_id': data.get('license_key', {}).get('id'),
                'activations_limit': data.get('license_key', {}).get('activation_limit'),
                'activations_count': data.get('license_key', {}).get('activation_usage')
            }
        else:
            error = data.get('error', 'Invalid license key')
            return {'valid': False, 'error': error}

    except requests.Timeout:
        return {'valid': False, 'error': 'Validation service timeout'}
    except Exception as e:
        logger.error(f"LS API call failed: {e}")
        return {'valid': False, 'error': 'Validation service unavailable'}

def get_user_by_key(license_key):
    """Check if a license key already has a registered user in DynamoDB"""
    try:
        table = dynamodb.Table('mission-mischief-users')
        response = table.get_item(Key={'license_key': license_key})
        return response.get('Item')
    except Exception as e:
        logger.error(f"DynamoDB get_user_by_key failed: {e}")
        return None

def store_validated_key(license_key, username, activation_id):
    """Store validated key registration in DynamoDB"""
    try:
        table = dynamodb.Table('mission-mischief-users')
        table.put_item(Item={
            'license_key': license_key,
            'username': username or '',
            'activation_id': activation_id or '',
            'validated_at': datetime.now(timezone.utc).isoformat(),
            'status': 'active'
        })
        logger.info(f"Key stored for user: {username}")
        return True
    except Exception as e:
        logger.error(f"Failed to store key: {e}")
        return False

def verify_webhook_signature(payload_body, signature_header, signing_secret):
    """Verify Lemon Squeezy webhook signature"""
    if not signature_header:
        return False
    expected = hmac.new(
        signing_secret.encode('utf-8'),
        payload_body.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature_header)

def handle_webhook(event):
    """Handle Lemon Squeezy webhook events"""
    creds = get_ls_credentials()
    if not creds:
        return response_body(500, {'error': 'Configuration error'})

    body = event.get('body', '')
    signature = event.get('headers', {}).get('X-Signature', '')

    if not verify_webhook_signature(body, signature, creds['signing_secret']):
        logger.warning("Invalid webhook signature")
        return response_body(401, {'error': 'Invalid signature'})

    try:
        payload = json.loads(body)
        event_name = payload.get('meta', {}).get('event_name', '')
        logger.info(f"Webhook event: {event_name}")

        if event_name in ('order_created', 'license_key_created'):
            data = payload.get('data', {})
            attributes = data.get('attributes', {})
            license_key = attributes.get('key', '')

            if license_key:
                # Pre-register the key so validation is instant
                store_validated_key(license_key, '', '')
                logger.info(f"Pre-registered key from webhook: {license_key[:8]}...")

        return response_body(200, {'received': True})

    except Exception as e:
        logger.error(f"Webhook processing failed: {e}")
        return response_body(500, {'error': str(e)})

def handle_validate_key(body):
    """Handle POST /validate-key"""
    license_key = body.get('license_key', '').strip()
    username = body.get('username', '').strip()

    if not license_key:
        return response_body(400, {'valid': False, 'error': 'License key required'})

    # Check if key already registered in our DB
    existing_user = get_user_by_key(license_key)

    if existing_user:
        logger.info(f"Key found in DB for: {existing_user.get('username', 'unknown')}")
        return response_body(200, {
            'valid': True,
            'existing_user': existing_user if existing_user.get('username') else None,
            'source': 'database'
        })

    # Not in DB — validate against Lemon Squeezy
    result = validate_ls_key(license_key, username)

    if result['valid']:
        # Store in DB for future fast lookups
        store_validated_key(
            license_key,
            username,
            result.get('activation_id', '')
        )
        return response_body(200, {
            'valid': True,
            'existing_user': None,
            'source': 'lemon_squeezy'
        })
    else:
        return response_body(200, {
            'valid': False,
            'error': result.get('error', 'Invalid key')
        })

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
        # Webhook endpoint
        if path.endswith('/webhook') and method == 'POST':
            return handle_webhook(event)

        # Key validation endpoint
        if path.endswith('/validate-key') and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            return handle_validate_key(body)

        return response_body(404, {'error': 'Not found'})

    except Exception as e:
        logger.error(f"Lambda handler failed: {e}")
        return response_body(500, {'error': str(e)})
