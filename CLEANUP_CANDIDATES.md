# 🗑️ Mission Mischief - Cleanup Candidates

## Files That Can Be Removed

### 🔧 Development/Testing Files
- `deploy-bulletproof-lambda.bat` - Deployment script (keep .sh version)
- `lambda-deployment.zip` - Generated deployment package
- `simple-server.py` - Local testing server
- `simple-http-server.py` - Duplicate server
- `python-server.py` - Another duplicate server
- `run-python-server.bat` - Server runner
- `run-server.bat` - Another server runner
- `test-lambda.html` - Old Lambda test (replaced by bulletproof version)

### 📚 Documentation Duplicates
- `PHASE1_DEPLOYMENT_GUIDE.md` - Phase-specific guide (merge into main docs)

### 🐍 Python Scraper (If Not Using)
**Entire `python-scraper/` folder can be removed if using Lambda only:**
- `python-scraper/auto_server.py`
- `python-scraper/cloudformation-template.yml`
- `python-scraper/deploy.sh`
- `python-scraper/DEPLOYMENT_GUIDE.md`
- `python-scraper/docker-compose.yml`
- `python-scraper/Dockerfile`
- `python-scraper/Procfile`
- `python-scraper/README.md`
- `python-scraper/requirements.txt`
- `python-scraper/run_auto.bat`
- `python-scraper/run.bat`
- `python-scraper/scraper.py`
- `python-scraper/selenium_scraper.py`
- `python-scraper/server.py`
- `python-scraper/setup.bat`
- `python-scraper/simple-deploy.sh`
- `python-scraper/task-definition.json`

### 🎯 Lambda Development Files
- `lambda-optimized.js` - Source code (keep for reference, but not needed for production)
- `deploy-bulletproof-lambda.sh` - Deployment script (after deployment complete)

## Files to Keep (Essential)

### 🌐 Core Web Files
- `index.html` - Landing page
- `app.html` - Main dashboard
- `bounty-hunter.html` - Real-time tracking
- `how-to-play.html` - Instructions
- `funny-tos.html` - Terms of service
- All other `.html` files (legal pages, help pages)

### 🎨 Assets (All Essential)
- `assets/css/` - All stylesheets
- `assets/js/` - All JavaScript files
- `assets/images/` - All images, badges, mascots

### 📋 Documentation (Keep)
- `README.md` - Main project documentation
- `PROJECT_SUMMARY.md` - Technical overview
- `BULLETPROOF_HASHTAG_BLOCKCHAIN.md` - Implementation roadmap
- `CNAME` - Domain configuration

### 🧪 Testing (Keep for Now)
- `test-bulletproof-phase1.html` - Phase 1 validation
- `admin-panel.html` - Admin interface

## Recommended Cleanup Actions

1. **Remove development servers** (keep one if needed for local testing)
2. **Remove duplicate deployment scripts** (keep .sh version)
3. **Remove generated files** (lambda-deployment.zip)
4. **Consider removing python-scraper/** if using Lambda only
5. **Keep test files** until all phases complete

## Total Cleanup Potential
- **~15-20 files** can be safely removed
- **~50MB** space savings (mostly from python-scraper folder)
- **Cleaner repository** for production deployment

**Note:** Don't remove anything until Phase 1 testing is complete and successful!