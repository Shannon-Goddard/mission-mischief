# ⚡ BULLETPROOF Phase 2: ScraperAPI Integration

## 🚀 **Real Data Scraping Setup**

### **Step 1: Get ScraperAPI Key**
1. Go to: https://www.scraperapi.com/
2. Sign up for free account (1000 requests/month free)
3. Get your API key from dashboard

### **Step 2: Update Scraper Configuration**
Edit `python-scraper/scraper.py`:
```python
# Replace this line:
self.scraper_api_key = 'YOUR_SCRAPERAPI_KEY'

# With your actual key:
self.scraper_api_key = 'your_actual_api_key_here'
```

### **Step 3: Test Real Scraping**
```bash
cd python-scraper
python scraper.py
```

**Expected output:**
```
⚡ BULLETPROOF ScraperAPI scraper starting (Phase 2)...
⚡ ScraperAPI: Scraping Instagram #missionmischief
✅ ScraperAPI: Found X Instagram posts for #missionmischief
⚡ ScraperAPI: Scraping Facebook #missionmischief
✅ ScraperAPI: Found X Facebook posts for #missionmischief
```

## 🎯 **Alternative: ZenRows**
If ScraperAPI doesn't work:
1. Go to: https://www.zenrows.com/
2. Get free API key
3. Update scraper to use ZenRows endpoint

## 💰 **Cost Estimate**
- **ScraperAPI Free**: 1000 requests/month
- **Our Usage**: ~18 requests per scrape (6 hashtags × 3 platforms)
- **Monthly Scrapes**: ~55 full scrapes on free tier
- **Paid Plan**: $29/month for 100K requests

## 🔧 **Fallback System**
1. **ScraperAPI** (primary - real data)
2. **Selenium** (fallback - direct scraping)  
3. **Mock Data** (final fallback - development)

**This gives us REAL hashtag blockchain data!** 🚀⛓️✨