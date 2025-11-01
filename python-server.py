from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs
import datetime

class MissionMischiefHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # Handle scrape endpoint
        if parsed_path.path == '/scrape':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.end_headers()
            
            # Mock data matching Lambda response format
            mock_data = {
                "success": True,
                "data": {
                    "leaderboard": [
                        {"handle": "@testuser1", "points": 15, "city": "Austin", "state": "TX"},
                        {"handle": "@testuser2", "points": 8, "city": "Dallas", "state": "TX"},
                        {"handle": "@testuser3", "points": 3, "city": "Houston", "state": "TX"}
                    ],
                    "geography": {
                        "TX": {"Austin": 1, "Dallas": 1, "Houston": 1}
                    },
                    "missions": {
                        "1": {"instagram": 2, "facebook": 1, "x": 0},
                        "5": {"instagram": 1, "facebook": 0, "x": 1},
                        "7": {"instagram": 0, "facebook": 1, "x": 0}
                    },
                    "justice": [],
                    "lastUpdated": datetime.datetime.now().isoformat()
                },
                "timestamp": datetime.datetime.now().isoformat()
            }
            
            self.wfile.write(json.dumps(mock_data).encode())
            return
        
        # Handle CORS preflight
        if self.command == 'OPTIONS':
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.end_headers()
            return
        
        # Serve static files
        super().do_GET()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), MissionMischiefHandler)
    print("Python server running at http://localhost:8000")
    print("Scrape endpoint: http://localhost:8000/scrape")
    server.serve_forever()