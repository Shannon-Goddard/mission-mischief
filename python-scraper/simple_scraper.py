#!/usr/bin/env python3
"""
SIMPLE: Run all 3 scrapers, highest count wins
"""

import requests
import json
from datetime import datetime
from aws_parameter_scraper import AWSScraperAPIScraper
from login_scraper import LoginScraper

class SimpleScraper:
    def __init__(self):
        self.lambda_endpoint = 'https://imddm6sh0i.execute-api.us-east-1.amazonaws.com/prod/scrape'
        self.scraperapi_scraper = AWSScraperAPIScraper()
        self.login_scraper = LoginScraper()
        
    def scrape_lambda(self):
        """Scrape Lambda APIs"""
        try:
            print("📡 Lambda scraping...")
            response = requests.get(self.lambda_endpoint, timeout=30)
            if response.ok:
                data = response.json()
                if data.get('success') and data.get('data'):
                    print("✅ Lambda complete")
                    return data['data']
        except Exception as e:
            print(f"❌ Lambda failed: {e}")
        return {'leaderboard': [], 'geography': {}, 'missions': {}, 'justice': []}
    
    def scrape_scraperapi(self):
        """Scrape ScraperAPI"""
        try:
            print("⚡ ScraperAPI scraping...")
            result = self.scraperapi_scraper.scrape_all_platforms()
            if result:
                print("✅ ScraperAPI complete")
                return result
        except Exception as e:
            print(f"❌ ScraperAPI failed: {e}")
        return {'leaderboard': [], 'geography': {}, 'missions': {}, 'justice': []}
    
    def scrape_login(self):
        """Scrape with login"""
        try:
            print("🔑 Login scraping...")
            result = self.login_scraper.scrape_all_platforms()
            if result:
                print("✅ Login complete")
                return result
        except Exception as e:
            print(f"❌ Login failed: {e}")
        return {'leaderboard': [], 'geography': {}, 'missions': {}, 'justice': []}
    
    def highest_count_wins(self, lambda_data, scraperapi_data, login_data):
        """Simple: whoever finds the most posts per platform wins"""
        print("🏆 Determining winners by highest count...")
        
        result = {
            'leaderboard': [],
            'geography': {},
            'missions': {},
            'justice': [],
            'lastUpdated': datetime.now().isoformat(),
            'winners': {}
        }
        
        # Get all mission IDs
        all_missions = set()
        for data in [lambda_data, scraperapi_data, login_data]:
            all_missions.update(data.get('missions', {}).keys())
        
        # For each mission, find highest count per platform
        for mission_id in all_missions:
            lambda_mission = lambda_data.get('missions', {}).get(mission_id, {'instagram': 0, 'facebook': 0, 'x': 0})
            scraperapi_mission = scraperapi_data.get('missions', {}).get(mission_id, {'instagram': 0, 'facebook': 0, 'x': 0})
            login_mission = login_data.get('missions', {}).get(mission_id, {'instagram': 0, 'facebook': 0, 'x': 0})
            
            result['missions'][mission_id] = {
                'instagram': max(lambda_mission['instagram'], scraperapi_mission['instagram'], login_mission['instagram']),
                'facebook': max(lambda_mission['facebook'], scraperapi_mission['facebook'], login_mission['facebook']),
                'x': max(lambda_mission['x'], scraperapi_mission['x'], login_mission['x'])
            }
            
            # Track winners
            if mission_id not in result['winners']:
                result['winners'][mission_id] = {}
            
            # Instagram winner
            instagram_counts = [lambda_mission['instagram'], scraperapi_mission['instagram'], login_mission['instagram']]
            instagram_winner = ['lambda', 'scraperapi', 'login'][instagram_counts.index(max(instagram_counts))]
            result['winners'][mission_id]['instagram'] = instagram_winner
            
            # Facebook winner
            facebook_counts = [lambda_mission['facebook'], scraperapi_mission['facebook'], login_mission['facebook']]
            facebook_winner = ['lambda', 'scraperapi', 'login'][facebook_counts.index(max(facebook_counts))]
            result['winners'][mission_id]['facebook'] = facebook_winner
            
            # X winner
            x_counts = [lambda_mission['x'], scraperapi_mission['x'], login_mission['x']]
            x_winner = ['lambda', 'scraperapi', 'login'][x_counts.index(max(x_counts))]
            result['winners'][mission_id]['x'] = x_winner
        
        # Use leaderboard from whoever has the most players
        leaderboard_counts = [
            len(lambda_data.get('leaderboard', [])),
            len(scraperapi_data.get('leaderboard', [])),
            len(login_data.get('leaderboard', []))
        ]
        leaderboard_winner = [lambda_data, scraperapi_data, login_data][leaderboard_counts.index(max(leaderboard_counts))]
        result['leaderboard'] = leaderboard_winner.get('leaderboard', [])
        
        # Use geography from whoever has the most locations
        geo_counts = [
            len(lambda_data.get('geography', {})),
            len(scraperapi_data.get('geography', {})),
            len(login_data.get('geography', {}))
        ]
        geo_winner = [lambda_data, scraperapi_data, login_data][geo_counts.index(max(geo_counts))]
        result['geography'] = geo_winner.get('geography', {})
        
        # Combine all justice cases
        result['justice'] = (lambda_data.get('justice', []) + 
                           scraperapi_data.get('justice', []) + 
                           login_data.get('justice', []))
        
        print("🏆 Winners determined by highest count")
        return result
    
    def scrape_all(self):
        """Run all 3 scrapers, highest count wins"""
        print("🎯 SIMPLE: Running all 3 scrapers...")
        
        # Run all 3 in parallel (or sequence)
        lambda_data = self.scrape_lambda()
        scraperapi_data = self.scrape_scraperapi()
        login_data = self.scrape_login()
        
        # Highest count wins
        result = self.highest_count_wins(lambda_data, scraperapi_data, login_data)
        
        print(f"🎯 SIMPLE complete: {len(result['leaderboard'])} players, {len(result['missions'])} missions")
        return result

if __name__ == '__main__':
    scraper = SimpleScraper()
    result = scraper.scrape_all()
    print(json.dumps(result, indent=2))