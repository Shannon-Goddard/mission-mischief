# Files Not Connected to index.html

The following files exist in the project but are not connected to or referenced by index.html and its dependency chain:

## HTML Files
- `admin-panel.html` - Administrative interface (standalone)
- `how-to-play.html` - Game instructions page (standalone)
- `jointhechaos.html` - Social media landing page (standalone)
- `mission-list.html` - Mission listing page (standalone)
- `qr-help.html` - QR code help page (standalone)
- `test-lambda.html` - Lambda testing page (standalone)

## JavaScript Files
- `assets/js/api-config.js` - API configuration (unused)
- `assets/js/data-processor.js` - Data processing utilities (unused)
- `assets/js/scraper.js` - Full scraper (replaced by scraper-simple.js)

## Configuration & Deployment Files
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `CNAME` - GitHub Pages domain configuration
- `create-iam-role.json` - AWS IAM role configuration
- `deploy-lambda.bat` - Lambda deployment script
- `serverless.yml` - Serverless framework configuration
- `setup-aws.bat` - AWS setup script
- `test-endpoint.js` - Endpoint testing script

## Lambda Function Files
- `lambda/index.js` - AWS Lambda function code
- `lambda/package.json` - Lambda dependencies

## Documentation Files
- `HASHTAG_LIST.txt` - List of hashtags
- `PROJECT_SUMMARY.md` - Project documentation
- `README.md` - Project readme
- `SCRAPING_SETUP.md` - Scraping setup instructions
- `TODO.md` - Todo list
- `TROUBLESHOOTING.md` - Troubleshooting guide

## Other Files
- `favicon.ico` - Favicon file (duplicate of assets/images/ui/favicon.png)

## Summary
Total files in project: ~100+ files
Files connected to index.html: ~80+ files (including all assets)
Files NOT connected to index.html: ~20 files

The unconnected files are primarily:
1. Standalone pages for specific purposes
2. Development/deployment configuration files
3. Documentation files
4. Backend/Lambda function files
5. Alternative implementations (like scraper.js vs scraper-simple.js)