#!/usr/bin/env python3
"""
ScraperAPI with AWS Parameter Store
"""

import boto3
import requests
import json
from datetime import datetime

class AWSScraperAPIScraper:
    def __init__(self):
        self.ssm = boto3.client('ssm', region_name='us-east-1')
        
    def get_parameter(self, name):
        """Get parameter from AWS Parameter Store"""
        try:
            response = self.ssm.get_parameter(Name=name, WithDecryption=True)
            return response['Parameter']['Value']
        except Exception as e:
            print(f"❌ Failed to get parameter {name}: {e}")
            return None
    
    def scrape_with_scraperapi(self, platform, hashtag):
        """Scrape using ScraperAPI"""
        try:
            api_key = self.get_parameter('/mission-mischief/scraperapi/api-key')
            if not api_key:
                return []
                
            url = f'https://www.{platform}.com/explore/tags/{hashtag}/' if platform == 'instagram' else f'https://www.{platform}.com/hashtag/{hashtag}'
            
            response = requests.get('http://api.scraperapi.com', params={
                'api_key': api_key,
                'url': url,
                'render': 'true'
            }, timeout=60)
            
            if response.status_code == 200 and 'missionmischief' in response.text.lower():
                print(f"✅ ScraperAPI: Found {platform} data")
                return self.parse_html(response.text, platform)
            
        except Exception as e:
            print(f"❌ ScraperAPI {platform} error: {e}")
        
        return []
    
    def parse_html(self, html, platform):
        """Parse hashtag data from HTML"""
        import re
        posts = []
        
        # Extract hashtag patterns
        patterns = {
            'user': r'#missionmischiefuser([a-z0-9]+)',
            'points': r'#missionmischiefpoints(\d+)',
            'city': r'#missionmischiefcity([a-z]+)',
            'state': r'#missionmischiefstate([a-z]+)'
        }
        
        for pattern_type, pattern in patterns.items():
            matches = re.findall(pattern, html.lower())
            for match in matches:
                posts.append({
                    'type': pattern_type,
                    'value': match,
                    'platform': platform
                })
        
        return posts
    
    def scrape_all_platforms(self):
        """Scrape all platforms using ScraperAPI"""
        print("⚡ ScraperAPI: Starting all-platform scrape...")
        
        all_posts = []
        platforms = ['instagram', 'facebook']
        
        for platform in platforms:
            try:
                posts = self.scrape_with_scraperapi(platform, 'missionmischief')
                all_posts.extend(posts)
                print(f"⚡ ScraperAPI {platform}: {len(posts)} posts")
            except Exception as e:
                print(f"❌ ScraperAPI {platform} failed: {e}")
        
        if not all_posts:
            print("❌ ScraperAPI: No posts found")
            return None
        
        # Parse posts into standard format
        result = self.parse_scraperapi_posts(all_posts)
        print(f"✅ ScraperAPI complete: {len(result['leaderboard'])} players")
        return result
    
    def parse_scraperapi_posts(self, posts):
        """Parse ScraperAPI posts into standard format"""
        leaderboard = []
        geography = {}
        missions = {}
        
        for post in posts:
            if post['type'] == 'user':
                handle = f"@{post['value']}"
                # Add to leaderboard if not exists
                if not any(p['handle'] == handle for p in leaderboard):
                    leaderboard.append({
                        'handle': handle,
                        'points': 3,  # Default points
                        'city': 'Unknown',
                        'state': 'Unknown'
                    })
            
            elif post['type'] == 'points':
                # Update points for last user
                if leaderboard:
                    leaderboard[-1]['points'] = int(post['value'])
            
            elif post['type'] == 'city' and leaderboard:
                leaderboard[-1]['city'] = post['value'].title()
            
            elif post['type'] == 'state' and leaderboard:
                state = post['value'].upper()
                leaderboard[-1]['state'] = state
                
                # Update geography
                city = leaderboard[-1]['city']
                if state not in geography:
                    geography[state] = {}
                geography[state][city] = geography[state].get(city, 0) + 1
        
        # Determine mission from posts
        mission_id = '5'  # Default to Slim Shady
        if mission_id not in missions:
            missions[mission_id] = {'instagram': 0, 'facebook': 0, 'x': 0}
        
        # Count posts per platform
        for post in posts:
            missions[mission_id][post['platform']] += 1
        
        return {
            'leaderboard': sorted(leaderboard, key=lambda x: x['points'], reverse=True),
            'geography': geography,
            'missions': missions,
            'justice': [],
            'lastUpdated': datetime.now().isoformat(),
            'source': 'scraperapi'
        }