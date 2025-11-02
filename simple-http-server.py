#!/usr/bin/env python3
"""
Simple HTTP server for Mission Mischief testing
"""

import http.server
import socketserver
import os

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == "__main__":
    PORT = 8000
    
    # Change to the directory containing your files
    os.chdir(r'c:\Users\uthin\OneDrive\Desktop\mission-mischief')
    
    with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
        print(f"🚀 Mission Mischief server running at:")
        print(f"   http://localhost:{PORT}")
        print(f"   http://localhost:{PORT}/test-lambda.html")
        print(f"   http://localhost:{PORT}/app.html")
        print()
        print("🌐 HTTP server with CORS headers")
        print("📱 Perfect for local testing!")
        print()
        print("Press Ctrl+C to stop")
        
        httpd.serve_forever()