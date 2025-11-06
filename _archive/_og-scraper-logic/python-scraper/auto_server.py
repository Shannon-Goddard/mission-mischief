#!/usr/bin/env python3
"""
Mission Mischief Auto-Scraper Server
Checks Lambda results and runs Selenium backup when needed
"""

import requests
import json
import time
from datetime import datetime
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from simple_scraper import SimpleScraper
import threading
import schedule

app = Flask(__name__)
CORS(app)

class AutoScraperManager:
    def __init__(self):
        self.lambda_endpoint = 'https://imddm6sh0i.execute-api.us-east-1.amazonaws.com/prod/scrape'
        self.simple_scraper = SimpleScraper()
        self.cached_data = None
        self.last_update = None
        
    def check_lambda_data(self):
        """Check if Lambda has Instagram/Facebook data"""
        try:
            response = requests.get(self.lambda_endpoint, timeout=10)
            if response.ok:
                data = response.json()
                if data.get('success') and data.get('data'):
                    missions = data['data'].get('missions', {})
                    
                    # Check if any mission has Instagram/Facebook data
                    has_instagram = any(mission.get('instagram', 0) > 0 for mission in missions.values())
                    has_facebook = any(mission.get('facebook', 0) > 0 for mission in missions.values())
                    has_x = any(mission.get('x', 0) > 0 for mission in missions.values())
                    
                    return {
                        'lambda_data': data['data'],
                        'has_instagram': has_instagram,
                        'has_facebook': has_facebook,
                        'has_x': has_x,
                        'needs_backup': has_x and (not has_instagram or not has_facebook)
                    }
        except Exception as e:
            print(f"Lambda check failed: {e}")
            
        return {'needs_backup': True, 'lambda_data': None}
    
    def merge_data(self, lambda_data, selenium_data):
        """Merge Lambda and Selenium data"""
        if not lambda_data or not selenium_data:
            return lambda_data or selenium_data
            
        # Merge leaderboards
        merged_leaderboard = list(lambda_data.get('leaderboard', []))
        for selenium_player in selenium_data.get('leaderboard', []):
            existing = next((p for p in merged_leaderboard if p['handle'] == selenium_player['handle']), None)
            if existing:
                existing['points'] += selenium_player['points']
            else:
                merged_leaderboard.append(selenium_player)
        
        # Sort by points
        merged_leaderboard.sort(key=lambda x: x['points'], reverse=True)
        
        # Merge missions
        merged_missions = dict(lambda_data.get('missions', {}))
        for mission_id, selenium_mission in selenium_data.get('missions', {}).items():
            if mission_id in merged_missions:
                merged_missions[mission_id]['instagram'] += selenium_mission.get('instagram', 0)
                merged_missions[mission_id]['facebook'] += selenium_mission.get('facebook', 0)
            else:
                merged_missions[mission_id] = selenium_mission
        
        # Merge geography
        merged_geography = dict(lambda_data.get('geography', {}))
        for state, cities in selenium_data.get('geography', {}).items():
            if state in merged_geography:
                for city, count in cities.items():
                    merged_geography[state][city] = merged_geography[state].get(city, 0) + count
            else:
                merged_geography[state] = cities
        
        return {
            'leaderboard': merged_leaderboard,
            'geography': merged_geography,
            'missions': merged_missions,
            'justice': lambda_data.get('justice', []) + selenium_data.get('justice', []),
            'lastUpdated': datetime.now().isoformat(),
            'source': 'lambda+selenium'
        }
    
    def update_data(self):
        """Main update function - checks Lambda and runs Selenium if needed"""
        print("🔄 Checking Lambda data...")
        lambda_check = self.check_lambda_data()
        
        if lambda_check.get('needs_backup'):
            # Use simple scraper (run all 3, highest wins)
            print("🎯 Running SIMPLE scraper (all 3, highest wins)...")
            self.cached_data = self.simple_scraper.scrape_all()
            print("✅ SIMPLE scraping complete")
        else:
            self.cached_data = lambda_check.get('lambda_data')
            print("✅ Lambda has complete data")
        
        self.last_update = datetime.now()
        return self.cached_data

# Global manager instance
manager = AutoScraperManager()

@app.route('/scrape', methods=['GET'])
def scrape_endpoint():
    """Layer 2 scraping endpoint - triggered by Lambda"""
    try:
        print("🐍 Layer 2 activated by Lambda - running Selenium backup...")
        data = manager.update_data()
        return jsonify({
            'success': True,
            'data': data,
            'source': 'bulletproof-selenium-layer2',
            'coverage': '25% additional',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'source': 'selenium-error',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/health', methods=['GET'])
def health_endpoint():
    """Health check endpoint for ALB"""
    return jsonify({
        'status': 'healthy',
        'service': 'mission-mischief-python-scraper',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/scraperapi', methods=['GET', 'OPTIONS'])
def scraperapi_endpoint():
    """Layer 3: ScraperAPI-only scraping endpoint"""
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        return response
    
    try:
        print("⚡ Layer 3 activated: ScraperAPI independent scraping...")
        
        # Use AWS Parameter Store ScraperAPI scraper
        from aws_parameter_scraper import AWSScraperAPIScraper
        scraper = AWSScraperAPIScraper()
        
        # Scrape all platforms with ScraperAPI
        result = scraper.scrape_all_platforms()
        
        if result:
            print(f"✅ ScraperAPI found {len(result.get('leaderboard', []))} players")
            response = jsonify({
                'success': True,
                'data': result,
                'source': 'scraperapi-independent',
                'coverage': '33% ScraperAPI layer',
                'timestamp': datetime.now().isoformat()
            })
        else:
            response = jsonify({
                'success': True,
                'data': {
                    'leaderboard': [],
                    'geography': {},
                    'missions': {},
                    'justice': [],
                    'lastUpdated': datetime.now().isoformat()
                },
                'source': 'scraperapi-empty',
                'timestamp': datetime.now().isoformat()
            })
        
        # Add CORS headers
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
            
    except Exception as e:
        print(f"❌ ScraperAPI layer failed: {e}")
        response = jsonify({
            'success': False,
            'error': str(e),
            'source': 'scraperapi-error',
            'timestamp': datetime.now().isoformat()
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@app.route('/status', methods=['GET'])
def status_endpoint():
    """Status endpoint"""
    return jsonify({
        'status': 'running',
        'last_update': manager.last_update.isoformat() if manager.last_update else None,
        'has_cached_data': manager.cached_data is not None,
        'service': 'auto-scraper'
    })

def schedule_auto_updates():
    """Standby mode - triggered by Lambda, not scheduled"""
    # No automatic scheduling - Lambda triggers us when needed
    print("🤖 Standby mode: Waiting for Lambda trigger...")
    
    while True:
        time.sleep(300)  # Check every 5 minutes for health

if __name__ == '__main__':
    # Start scheduler in background thread
    scheduler_thread = threading.Thread(target=schedule_auto_updates, daemon=True)
    scheduler_thread.start()
    
    print("🤖 Mission Mischief Auto-Scraper Server")
    print("🕒 Triggered by Lambda at 3:00 AM PST (Layer 2 backup)")
    print("🌐 Server: http://mission-mischief-alb-1979839755.us-east-1.elb.amazonaws.com")
    print("📡 Endpoint: /scrape (triggered by Lambda when needed)")
    print("📊 Status: /status")
    
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)