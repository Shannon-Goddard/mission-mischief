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