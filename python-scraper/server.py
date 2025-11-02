#!/usr/bin/env python3
"""
Mission Mischief Python Scraper Server
Run with: python server.py
Access at: http://localhost:5000/scrape
"""

from flask import Flask, jsonify
from flask_cors import CORS
from scraper import MissionMischiefScraper
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

scraper = MissionMischiefScraper()

@app.route('/scrape', methods=['GET'])
def scrape_endpoint():
    """Main scraping endpoint that matches Lambda format"""
    try:
        result = scraper.scrape_all()
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': scraper.datetime.now().isoformat()
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'mission-mischief-python-scraper',
        'timestamp': scraper.datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🐍 Mission Mischief Python Scraper Server")
    print("🌐 Starting server at http://localhost:5000")
    print("📡 Scrape endpoint: http://localhost:5000/scrape")
    print("❤️  Health check: http://localhost:5000/health")
    app.run(debug=True, host='0.0.0.0', port=5000)