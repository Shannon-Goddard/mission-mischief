@echo off
echo 🐍 Mission Mischief Python Scraper Setup
echo.

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo ✅ Setup complete!
echo.
echo To start the scraper server:
echo   python server.py
echo.
echo The server will run at: http://localhost:5000
echo Scrape endpoint: http://localhost:5000/scrape
echo.
pause