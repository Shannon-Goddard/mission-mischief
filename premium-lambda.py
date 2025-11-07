#!/usr/bin/env python3
"""
Mission Mischief Premium Scraper Lambda
Single premium scraper + DynamoDB + bulletproof reliability
"""

import json
import boto3
import requests
import logging
import os
from datetime import datetime, timezone
from typing import Dict, List, Optional
from botocore.exceptions import ClientError
import hashlib
import re

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS clients
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')
cloudwatch = boto3.client('cloudwatch')
secrets_manager = boto3.client('secretsmanager')

# Configuration
TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'mission-mischief-posts')
S3_BUCKET = os.environ.get('S3_BUCKET', 'mission-mischief-raw-data')
SCRAPER_SECRET_NAME = os.environ.get('SCRAPER_SECRET', 'mission-mischief/bright-data-api-key')

class PremiumScraper:
    def __init__(self):
        self.api_key = self._get_scraper_api_key()
        self.endpoint = "https://api.brightdata.com/dca/trigger_immediate"
        
    def _get_scraper_api_key(self) -> str:
        """Get API key from Secrets Manager"""
        try:
            response = secrets_manager.get_secret_value(SecretId=SCRAPER_SECRET_NAME)
            return response['SecretString']
        except Exception as e:
            logger.error(f"Failed to get scraper API key: {e}")
            raise
    
    def scrape_all_platforms(self) -> Dict:
        """Scrape all three platforms for #missionmischief hashtag"""
        try:
            logger.info("Using mock data while debugging Bright Data API")
            
            # Mock response with real hashtag blockchain data
            mock_data = {
                "results": [
                    {
                        "platform": "instagram",
                        "posts": [
                            {
                                "id": "mock_post_1",
                                "text": "Just completed #missionmischief #missionmischiefcoffee #@testuser #missionmischiefpoints3 #missionmischiefcityaustin #missionmischiefstatetx #missionmischiefcountryus",
                                "user": {"username": "testuser"},
                                "created_at": "2025-11-06T23:50:00Z"
                            }
                        ]
                    },
                    {
                        "platform": "twitter", 
                        "posts": [
                            {
                                "id": "mock_post_2",
                                "text": "#missionmischief #realworldgame #missionmischiefbeer #@player2 #missionmischiefpoints5 #missionmischiefcityseattle #missionmischiefstatewa #missionmischiefcountryus",
                                "author": {"username": "player2"},
                                "created_at": "2025-11-06T23:45:00Z"
                            }
                        ]
                    }
                ]
            }
            
            logger.info(f"Mock scraper returned {len(mock_data.get('results', []))} platforms")
            return mock_data
            
        except Exception as e:
            logger.error(f"Mock scraper error: {e}")
            raise

class HashtagParser:
    """Parse Mission Mischief hashtags from social media posts"""
    
    @staticmethod
    def extract_geography(text: str) -> Dict[str, str]:
        """Extract geographic data from hashtags"""
        text_lower = text.lower()
        
        # Extract city, state, country
        city_match = re.search(r'#missionmischiefcity([a-z]+)', text_lower)
        state_match = re.search(r'#missionmischiefstate([a-z]+)', text_lower)
        country_match = re.search(r'#missionmischiefcountry([a-z]+)', text_lower)
        
        return {
            'city': city_match.group(1).title() if city_match else 'Unknown',
            'state': state_match.group(1).upper() if state_match else 'Unknown',
            'country': country_match.group(1).upper() if country_match else 'US'
        }
    
    @staticmethod
    def extract_mission_id(text: str) -> int:
        """Identify mission from hashtags"""
        text_lower = text.lower()
        
        # Mission-specific hashtags
        if '#iwillnotsuemissionmischief' in text_lower: return 1
        elif '#missionmischiefslimshady' in text_lower: return 5
        elif '#missionmischiefcoffee' in text_lower: return 7
        elif '#missionmischiefrecycling' in text_lower: return 21
        elif '#missionmischiefbeer' in text_lower: return 3
        elif '#missionmischiefgas' in text_lower: return 6
        elif '#missionmischiefgrocery' in text_lower: return 8
        elif '#missionmischieffast' in text_lower: return 9
        elif '#missionmischiefretail' in text_lower: return 10
        elif '#missionmischiefbank' in text_lower: return 11
        elif '#missionmischiefpark' in text_lower: return 12
        elif '#missionmischiefgym' in text_lower: return 13
        elif '#missionmischiefrestaurant' in text_lower: return 14
        elif '#missionmischiefmovie' in text_lower: return 15
        elif '#missionmischiefmall' in text_lower: return 16
        elif '#missionmischiefbeach' in text_lower: return 17
        elif '#missionmischiefhike' in text_lower: return 18
        elif '#missionmischiefmuseum' in text_lower: return 19
        elif '#missionmischiefzoo' in text_lower: return 20
        elif '#missionmischiefclown' in text_lower: return 999  # Cheater redemption
        elif '#missionmischiefpaidbail' in text_lower: return 999
        else: return 1  # Default mission
    
    @staticmethod
    def extract_points(text: str) -> int:
        """Extract points from hashtag"""
        points_match = re.search(r'#missionmischiefpoints(\d+)', text.lower())
        return int(points_match.group(1)) if points_match else 3
    
    @staticmethod
    def extract_handle(post: Dict, platform: str) -> str:
        """Extract user handle from post data"""
        if platform == 'twitter':
            return f"@{post.get('author', {}).get('username', 'unknown')}"
        elif platform == 'instagram':
            return f"@{post.get('user', {}).get('username', 'unknown')}"
        elif platform == 'facebook':
            return f"@{post.get('from', {}).get('name', 'unknown')}"
        else:
            return '@unknown'

class DataProcessor:
    """Process and store scraped data"""
    
    def __init__(self):
        self.table = dynamodb.Table(TABLE_NAME)
        self.processed_posts = set()
        
    def generate_post_id(self, post: Dict, platform: str) -> str:
        """Generate unique post ID"""
        # Use platform's native ID + platform name
        native_id = post.get('id', post.get('post_id', ''))
        if not native_id:
            # Fallback: hash of content + timestamp
            content = post.get('text', post.get('caption', ''))
            timestamp = post.get('created_at', datetime.now().isoformat())
            native_id = hashlib.md5(f"{content}{timestamp}".encode()).hexdigest()[:12]
        
        return f"{platform}#{native_id}"
    
    def process_posts(self, raw_data: Dict) -> Dict:
        """Process raw scraper data into Mission Mischief format"""
        leaderboard = {}
        geography = {}
        missions = {}
        justice_cases = []
        
        posts_processed = 0
        posts_verified = 0
        
        for result in raw_data.get('results', []):
            platform = result.get('platform', 'unknown')
            posts = result.get('posts', [])
            
            for post in posts:
                posts_processed += 1
                
                # Generate unique post ID
                post_id = self.generate_post_id(post, platform)
                
                # Skip duplicates
                if post_id in self.processed_posts:
                    continue
                self.processed_posts.add(post_id)
                
                # Extract post text
                text = post.get('text', post.get('caption', post.get('message', '')))
                
                # Verify Mission Mischief content
                if not text or '#missionmischief' not in text.lower():
                    continue
                
                posts_verified += 1
                
                # Parse hashtag data
                geography_data = HashtagParser.extract_geography(text)
                mission_id = HashtagParser.extract_mission_id(text)
                points = HashtagParser.extract_points(text)
                handle = HashtagParser.extract_handle(post, platform)
                
                # Update leaderboard
                if handle not in leaderboard:
                    leaderboard[handle] = {
                        'handle': handle,
                        'points': 0,
                        'city': geography_data['city'],
                        'state': geography_data['state'],
                        'country': geography_data['country']
                    }
                
                leaderboard[handle]['points'] += points
                
                # Update geography
                country = geography_data['country']
                state = geography_data['state']
                city = geography_data['city']
                
                if country not in geography:
                    geography[country] = {}
                if state not in geography[country]:
                    geography[country][state] = {}
                if city not in geography[country][state]:
                    geography[country][state][city] = 0
                geography[country][state][city] += 1
                
                # Update missions
                if mission_id not in missions:
                    missions[mission_id] = {'instagram': 0, 'facebook': 0, 'x': 0}
                
                platform_key = 'x' if platform == 'twitter' else platform
                missions[mission_id][platform_key] += 1
                
                # Store individual post in DynamoDB
                self._store_post(post_id, {
                    'post_id': post_id,
                    'platform': platform,
                    'handle': handle,
                    'text': text,
                    'points': points,
                    'mission_id': mission_id,
                    'city': city,
                    'state': state,
                    'country': country,
                    'timestamp': datetime.now(timezone.utc).isoformat(),
                    'ttl': int((datetime.now(timezone.utc).timestamp() + (90 * 24 * 60 * 60)))  # 90 days TTL
                })
        
        # Convert leaderboard to sorted list
        leaderboard_list = sorted(leaderboard.values(), key=lambda x: x['points'], reverse=True)
        
        # Emit metrics
        self._emit_metrics(posts_processed, posts_verified, len(leaderboard_list))
        
        return {
            'leaderboard': leaderboard_list[:50],  # Top 50
            'geography': geography,
            'missions': missions,
            'justice': justice_cases,
            'lastUpdated': datetime.now(timezone.utc).isoformat(),
            'source': 'premium-scraper',
            'stats': {
                'posts_processed': posts_processed,
                'posts_verified': posts_verified,
                'verification_rate': posts_verified / posts_processed if posts_processed > 0 else 0
            }
        }
    
    def _store_post(self, post_id: str, item: Dict):
        """Store individual post in DynamoDB with conditional write"""
        try:
            self.table.put_item(
                Item=item,
                ConditionExpression='attribute_not_exists(post_id)'
            )
        except ClientError as e:
            if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
                logger.info(f"Post {post_id} already exists, skipping")
            else:
                logger.error(f"Failed to store post {post_id}: {e}")
                raise
    
    def _emit_metrics(self, processed: int, verified: int, players: int):
        """Emit CloudWatch metrics"""
        try:
            cloudwatch.put_metric_data(
                Namespace='MissionMischief',
                MetricData=[
                    {
                        'MetricName': 'PostsProcessed',
                        'Value': processed,
                        'Unit': 'Count'
                    },
                    {
                        'MetricName': 'PostsVerified',
                        'Value': verified,
                        'Unit': 'Count'
                    },
                    {
                        'MetricName': 'ActivePlayers',
                        'Value': players,
                        'Unit': 'Count'
                    },
                    {
                        'MetricName': 'VerificationRate',
                        'Value': verified / processed if processed > 0 else 0,
                        'Unit': 'Percent'
                    }
                ]
            )
        except Exception as e:
            logger.error(f"Failed to emit metrics: {e}")

def archive_raw_data(raw_data: Dict):
    """Archive raw scraper response to S3"""
    try:
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        key = f"raw/{timestamp}.json"
        
        s3.put_object(
            Bucket=S3_BUCKET,
            Key=key,
            Body=json.dumps(raw_data, indent=2),
            ServerSideEncryption='AES256'
        )
        
        logger.info(f"Raw data archived to s3://{S3_BUCKET}/{key}")
        
    except Exception as e:
        logger.error(f"Failed to archive raw data: {e}")

def lambda_handler(event, context):
    """Main Lambda handler"""
    try:
        logger.info("Starting Mission Mischief premium scraper")
        
        # Initialize components
        scraper = PremiumScraper()
        processor = DataProcessor()
        
        # Scrape data
        raw_data = scraper.scrape_all_platforms()
        
        # Archive raw data
        archive_raw_data(raw_data)
        
        # Process and store data
        processed_data = processor.process_posts(raw_data)
        
        logger.info(f"Processing complete: {processed_data['stats']}")
        
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
                'data': processed_data,
                'timestamp': datetime.now(timezone.utc).isoformat()
            })
        }
        
    except Exception as e:
        logger.error(f"Lambda execution failed: {e}")
        
        # Emit failure metric
        try:
            cloudwatch.put_metric_data(
                Namespace='MissionMischief',
                MetricData=[{
                    'MetricName': 'ScrapingFailures',
                    'Value': 1,
                    'Unit': 'Count'
                }]
            )
        except:
            pass
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'timestamp': datetime.now(timezone.utc).isoformat()
            })
        }