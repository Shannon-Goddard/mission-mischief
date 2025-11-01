@echo off
echo Starting Python server for Mission Mischief testing...
echo Server will run at http://localhost:8000
echo Scrape endpoint: http://localhost:8000/scrape
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
python python-server.py
pause