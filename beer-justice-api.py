import json
import boto3
from datetime import datetime, timedelta
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
trials_table = dynamodb.Table('mission-mischief-beer-trials')
debts_table = dynamodb.Table('mission-mischief-beer-debts')
honor_table = dynamodb.Table('mission-mischief-honor-scores')
posts_table = dynamodb.Table('mission-mischief-posts')

def lambda_handler(event, context):
    try:
        action = event['pathParameters']['action']
        
        if action == 'create-trial':
            return create_trial(json.loads(event['body']))
        elif action == 'cast-vote':
            return cast_vote(json.loads(event['body']))
        elif action == 'get-trials':
            return get_active_trials()
        elif action == 'get-honor':
            return get_honor_score(event['queryStringParameters']['user'])
        elif action == 'get-debts':
            return get_beer_debts(event['queryStringParameters']['user'])
        elif action == 'mark-paid':
            return mark_debt_paid(json.loads(event['body']))
        else:
            return error_response('Invalid action', 400)
            
    except Exception as e:
        return error_response(str(e), 500)

def create_trial(data):
    # Validate honor score requirement
    accuser_honor = get_user_honor(data['accuser'])
    if accuser_honor < 50:
        return error_response('Need 50+ Honor to start trials', 403)
    
    trial_id = f"trial_{int(datetime.now().timestamp())}"
    expires_at = datetime.now() + timedelta(hours=6)
    
    trial_data = {
        'trial_id': trial_id,
        'accuser': data['accuser'],
        'accused': data['accused'],
        'evidence_url': data['evidence_url'],
        'accusation': data.get('accusation', 'Cheating'),
        'created_at': datetime.now().isoformat(),
        'expires_at': expires_at.isoformat(),
        'status': 'active',
        'votes': {
            'guilty': 0,
            'innocent': 0
        },
        'voters': [],
        'ttl': int((expires_at + timedelta(days=7)).timestamp())
    }
    
    # Store trial
    trials_table.put_item(Item=trial_data)
    
    # Deduct 5 points from both parties
    deduct_points(data['accuser'], 5)
    deduct_points(data['accused'], 5)
    
    return success_response({
        'trial_id': trial_id,
        'message': 'Trial created successfully',
        'trial_data': trial_data
    })

def cast_vote(data):
    trial_id = data['trial_id']
    verdict = data['verdict']
    voter = data['voter']
    
    # Get trial
    response = trials_table.get_item(Key={'trial_id': trial_id})
    if 'Item' not in response:
        return error_response('Trial not found', 404)
    
    trial = response['Item']
    
    # Check if trial is still active
    if trial['status'] != 'active':
        return error_response('Trial is no longer active', 400)
    
    # Check if user already voted
    if voter in trial['voters']:
        return error_response('You have already voted', 400)
    
    # Check if trial expired
    if datetime.now() > datetime.fromisoformat(trial['expires_at']):
        return conclude_trial(trial_id)
    
    # Cast vote
    trial['votes'][verdict] += 1
    trial['voters'].append(voter)
    
    # Update trial
    trials_table.put_item(Item=trial)
    
    # Award participation point
    award_points(voter, 1)
    update_honor_score(voter, 1, 'trial_participation')
    
    # Check if we should conclude trial
    total_votes = trial['votes']['guilty'] + trial['votes']['innocent']
    if total_votes >= 5:
        return conclude_trial(trial_id)
    
    return success_response({
        'message': 'Vote cast successfully',
        'trial_data': trial,
        'trial_concluded': False
    })

def conclude_trial(trial_id):
    response = trials_table.get_item(Key={'trial_id': trial_id})
    trial = response['Item']
    
    # Determine verdict
    guilty_votes = trial['votes']['guilty']
    innocent_votes = trial['votes']['innocent']
    
    verdict = 'guilty' if guilty_votes > innocent_votes else 'innocent'
    
    # Update trial status
    trial['status'] = 'concluded'
    trial['final_verdict'] = verdict
    trial['concluded_at'] = datetime.now().isoformat()
    trials_table.put_item(Item=trial)
    
    # Resolve consequences
    if verdict == 'guilty':
        award_points(trial['accuser'], 7)
        update_honor_score(trial['accused'], -10, 'guilty_verdict')
        update_honor_score(trial['accuser'], 3, 'correct_accusation')
        
        create_beer_debt(
            debtor=trial['accused'],
            creditor=trial['accuser'],
            beers_owed=1,
            reason='guilty_verdict',
            trial_id=trial_id
        )
        
        verdict_message = f"{trial['accused']} found GUILTY! Owes {trial['accuser']} 1 beer 🍺"
        
    else:
        award_points(trial['accused'], 7)
        update_honor_score(trial['accuser'], -5, 'false_accusation')
        update_honor_score(trial['accused'], 2, 'vindicated')
        
        create_beer_debt(
            debtor=trial['accuser'],
            creditor=trial['accused'],
            beers_owed=3,
            reason='false_accusation',
            trial_id=trial_id
        )
        
        verdict_message = f"{trial['accused']} found INNOCENT! {trial['accuser']} owes 3 beers 🍺🍺🍺"
    
    return success_response({
        'trial_concluded': True,
        'verdict': verdict,
        'message': verdict_message,
        'trial_data': trial
    })

def create_beer_debt(debtor, creditor, beers_owed, reason, trial_id):
    debt_id = f"debt_{int(datetime.now().timestamp())}"
    due_date = datetime.now() + timedelta(days=7)
    
    debt_data = {
        'debt_id': debt_id,
        'debtor': debtor,
        'creditor': creditor,
        'beers_owed': beers_owed,
        'amount_usd': beers_owed * 5,
        'reason': reason,
        'trial_id': trial_id,
        'created_date': datetime.now().isoformat(),
        'due_date': due_date.isoformat(),
        'status': 'pending',
        'payment_proof': None
    }
    
    debts_table.put_item(Item=debt_data)
    return debt_data

def get_active_trials():
    response = trials_table.scan(
        FilterExpression='#status = :status',
        ExpressionAttributeNames={'#status': 'status'},
        ExpressionAttributeValues={':status': 'active'}
    )
    
    trials = response.get('Items', [])
    
    # Check for expired trials
    current_time = datetime.now()
    for trial in trials:
        if current_time > datetime.fromisoformat(trial['expires_at']):
            conclude_trial(trial['trial_id'])
    
    return success_response({'trials': trials})

def get_honor_score(user_handle):
    honor_score = get_user_honor(user_handle)
    return success_response({'honor_score': honor_score})

def get_beer_debts(user_handle):
    # Get debts where user is debtor
    debtor_response = debts_table.scan(
        FilterExpression='debtor = :user',
        ExpressionAttributeValues={':user': user_handle}
    )
    
    # Get debts where user is creditor
    creditor_response = debts_table.scan(
        FilterExpression='creditor = :user',
        ExpressionAttributeValues={':user': user_handle}
    )
    
    return success_response({
        'debts': {
            'debtor': debtor_response.get('Items', []),
            'creditor': creditor_response.get('Items', [])
        }
    })

def mark_debt_paid(data):
    debt_id = data['debt_id']
    
    # Update debt status
    debts_table.update_item(
        Key={'debt_id': debt_id},
        UpdateExpression='SET #status = :status, paid_date = :paid_date',
        ExpressionAttributeNames={'#status': 'status'},
        ExpressionAttributeValues={
            ':status': 'paid',
            ':paid_date': datetime.now().isoformat()
        }
    )
    
    return success_response({'message': 'Debt marked as paid'})

def get_user_honor(user_handle):
    try:
        response = honor_table.get_item(Key={'user_handle': user_handle})
        if 'Item' in response:
            return int(response['Item']['honor_score'])
        else:
            # Initialize new user with 100 honor
            honor_table.put_item(Item={
                'user_handle': user_handle,
                'honor_score': 100,
                'last_updated': datetime.now().isoformat()
            })
            return 100
    except:
        return 100

def update_honor_score(user_handle, change, reason):
    current_honor = get_user_honor(user_handle)
    new_honor = max(0, current_honor + change)
    
    honor_table.put_item(Item={
        'user_handle': user_handle,
        'honor_score': new_honor,
        'last_updated': datetime.now().isoformat(),
        'last_change': change,
        'last_reason': reason
    })
    
    return new_honor

def award_points(user_handle, points):
    # Award points via existing posts table structure
    post_id = f"points_{user_handle}_{int(datetime.now().timestamp())}"
    
    posts_table.put_item(Item={
        'post_id': post_id,
        'user_handle': user_handle,
        'points_earned': points,
        'mission_id': 'system_award',
        'timestamp': datetime.now().isoformat(),
        'source': 'beer_justice',
        'ttl': int((datetime.now() + timedelta(days=90)).timestamp())
    })

def deduct_points(user_handle, points):
    # Deduct points (negative award)
    award_points(user_handle, -points)

def success_response(data):
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        'body': json.dumps(data, default=str)
    }

def error_response(message, status_code):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        'body': json.dumps({'error': message})
    }