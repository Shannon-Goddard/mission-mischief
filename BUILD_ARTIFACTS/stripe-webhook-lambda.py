#!/usr/bin/env python3
"""
Mission Mischief - Stripe Webhook + Key Validation Lambda
Routes: POST /webhook, POST /validate-key
"""

import json
import boto3
import logging
import hmac
import hashlib
import uuid
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

def get_stripe_credentials():
    try:
        response = secrets_manager.get_secret_value(SecretId='mission-mischief/stripe')
        return json.loads(response['SecretString'])
    except Exception as e:
        logger.error(f"Failed to get Stripe credentials: {e}")
        return None

def generate_key():
    """Generate a unique MAYHEM-XXXX-XXXX-XXXX style key"""
    parts = [uuid.uuid4().hex[:4].upper() for _ in range(3)]
    return f"MAYHEM-{'-'.join(parts)}"

def store_key(license_key, stripe_session_id, customer_email):
    try:
        table = dynamodb.Table('mission-mischief-users')
        table.put_item(Item={
            'license_key': license_key,
            'stripe_session_id': stripe_session_id,
            'customer_email': customer_email or '',
            'username': '',
            'created_at': datetime.now(timezone.utc).isoformat(),
            'status': 'active'
        })
        logger.info(f"Key stored: {license_key}")
        return True
    except Exception as e:
        logger.error(f"Failed to store key: {e}")
        return False

def get_user_by_key(license_key):
    try:
        table = dynamodb.Table('mission-mischief-users')
        response = table.get_item(Key={'license_key': license_key})
        return response.get('Item')
    except Exception as e:
        logger.error(f"DynamoDB lookup failed: {e}")
        return None

def verify_stripe_signature(payload_body, sig_header, webhook_secret):
    """Verify Stripe webhook signature (stripe-signature header)"""
    try:
        # Stripe signature format: t=timestamp,v1=signature
        parts = dict(item.split('=', 1) for item in sig_header.split(','))
        timestamp = parts.get('t', '')
        signature = parts.get('v1', '')
        signed_payload = f"{timestamp}.{payload_body}"
        expected = hmac.new(
            webhook_secret.encode('utf-8'),
            signed_payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
    except Exception as e:
        logger.error(f"Signature verification failed: {e}")
        return False

def handle_webhook(event):
    creds = get_stripe_credentials()
    if not creds:
        return response_body(500, {'error': 'Configuration error'})

    body = event.get('body', '')
    sig_header = (event.get('headers') or {}).get('stripe-signature', '')

    webhook_secret = creds.get('webhook_secret', '')
    if webhook_secret and webhook_secret != 'whsec_REPLACE_AFTER_DEPLOY':
        if not verify_stripe_signature(body, sig_header, webhook_secret):
            logger.warning("Invalid Stripe webhook signature")
            return response_body(401, {'error': 'Invalid signature'})

    try:
        payload = json.loads(body)
        event_type = payload.get('type', '')
        logger.info(f"Stripe event: {event_type}")

        if event_type == 'checkout.session.completed':
            session = payload.get('data', {}).get('object', {})
            session_id = session.get('id', '')
            customer_email = session.get('customer_details', {}).get('email', '')
            payment_status = session.get('payment_status', '')

            if payment_status == 'paid':
                license_key = generate_key()
                store_key(license_key, session_id, customer_email)
                logger.info(f"Key generated for session {session_id}: {license_key}")

        return response_body(200, {'received': True})

    except Exception as e:
        logger.error(f"Webhook processing failed: {e}")
        return response_body(500, {'error': str(e)})

def handle_key_by_session(query_params):
    """GET /key-by-session?session_id=cs_... — look up key generated for a Stripe session"""
    session_id = (query_params or {}).get('session_id', '').strip()

    if not session_id:
        return response_body(400, {'found': False, 'error': 'session_id required'})

    try:
        table = dynamodb.Table('mission-mischief-users')
        result = table.scan(
            FilterExpression='stripe_session_id = :sid',
            ExpressionAttributeValues={':sid': session_id}
        )
        items = result.get('Items', [])
        if items:
            return response_body(200, {'found': True, 'license_key': items[0]['license_key']})
        return response_body(200, {'found': False})
    except Exception as e:
        logger.error(f"key-by-session lookup failed: {e}")
        return response_body(500, {'found': False, 'error': str(e)})

def handle_validate_key(body):
    license_key = body.get('license_key', '').strip().upper()

    if not license_key:
        return response_body(400, {'valid': False, 'error': 'License key required'})

    existing = get_user_by_key(license_key)

    if existing and existing.get('status') == 'active':
        return response_body(200, {
            'valid': True,
            'existing_user': existing if existing.get('username') else None,
            'source': 'database'
        })

    return response_body(200, {'valid': False, 'error': 'Invalid or unrecognized key'})

def response_body(status_code, body_dict):
    return {
        'statusCode': status_code,
        'headers': CORS_HEADERS,
        'body': json.dumps(body_dict)
    }

def lambda_handler(event, context):
    if event.get('httpMethod') == 'OPTIONS':
        return response_body(200, {})

    path = event.get('path', '')
    method = event.get('httpMethod', 'GET')

    try:
        if path.endswith('/webhook') and method == 'POST':
            return handle_webhook(event)

        if path.endswith('/key-by-session') and method == 'GET':
            params = event.get('queryStringParameters')
            return handle_key_by_session(params)

        if path.endswith('/validate-key') and method == 'POST':
            body = json.loads(event.get('body', '{}'))
            return handle_validate_key(body)

        return response_body(404, {'error': 'Not found'})

    except Exception as e:
        logger.error(f"Lambda handler failed: {e}")
        return response_body(500, {'error': str(e)})
