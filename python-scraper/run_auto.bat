@echo off
echo 🤖 Starting Mission Mischief AUTO-SCRAPER Server...
echo.
echo 🕒 Scheduled: Daily updates at 3:30 AM (30 min after Lambda)
echo 🔄 Logic: Lambda first → If Instagram/Facebook = 0 → Run Selenium → Merge
echo 🌐 Server: http://localhost:5000
echo 📡 Endpoint: http://localhost:5000/scrape  
echo 📊 Status: http://localhost:5000/status
echo.
echo Press Ctrl+C to stop the server
echo.
python auto_server.py