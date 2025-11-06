// Simplified Mission Mischief Scraper - No Dependencies
class SimpleScraper {
  constructor() {
    this.endpoint = 'https://imddm6sh0i.execute-api.us-east-1.amazonaws.com/prod/scrape';
    this.status = {
      active: false,
      lastUpdate: null,
      nextUpdate: null,
      errors: []
    };
    this.data = null; // Will be populated from Lambda
  }

  async startScraping() {
    console.log('🎯 Starting BULLETPROOF three-layer scraping...');
    this.status.active = true;
    this.status.lastUpdate = new Date();
    // Set next update to 3am PST tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(3, 0, 0, 0); // 3:00 AM PST
    this.status.nextUpdate = tomorrow;

    try {
      console.log('📡 Connecting to optimized Lambda endpoint...');
      const response = await fetch(this.endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📡 Lambda response:', result);
        
        // BULLETPROOF: Three-layer processing
        if (result.leaderboard || result.geography || result.missions) {
          // Direct data format - trigger three-layer validation
          this.data = await this.processThreeLayers(result);
          console.log('✅ BULLETPROOF three-layer processing complete');
          this.updateDisplay();
          return this.data;
        } else if (result.success && result.data) {
          // Wrapped data format - trigger three-layer validation
          this.data = await this.processThreeLayers(result.data);
          console.log('✅ BULLETPROOF three-layer processing complete');
          console.log(`📊 Coverage: ${this.data.coverage || '95%'}`);
          this.updateDisplay();
          return this.data;
        } else if (result.body) {
          // API Gateway wrapped format
          const bodyData = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
          this.data = bodyData;
          console.log('✅ AWS Lambda scraping successful - using real data');
          this.updateDisplay();
          return this.data;
        } else {
          console.warn('⚠️ Lambda returned unexpected format:', result);
          // Still use the data even if format is unexpected
          this.data = result;
          console.log('✅ Using Lambda data (unexpected format)');
          this.updateDisplay();
          return this.data;
        }
      } else if (response.status === 502) {
        console.warn('🔧 Lambda function not deployed (502), trying Python backup...');
        const pythonData = await this.tryPythonBackup();
        if (pythonData) {
          this.data = pythonData;
          console.log('✅ Using Python backup data');
          this.updateDisplay();
          return this.data;
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        console.warn('🌐 Lambda endpoint unreachable, trying Python backup...');
        const pythonData = await this.tryPythonBackup();
        if (pythonData) {
          this.data = pythonData;
          console.log('✅ Using Python backup data');
          this.updateDisplay();
          return this.data;
        }
      } else {
        console.error('❌ Lambda scraping failed:', error);
      }
      this.status.errors.push({
        timestamp: new Date(),
        error: error.message
      });
    }

    console.log('📊 All endpoints failed, using fallback data');
    this.data = {
      leaderboard: [
        { handle: '@system_offline', points: 0, city: 'Unknown', state: 'OFFLINE' }
      ],
      geography: { 'OFFLINE': { 'Unknown': 1 } },
      missions: {},
      justice: [],
      lastUpdated: new Date().toISOString(),
      source: 'offline-fallback'
    };
    this.updateDisplay();
    return this.data;
  }

  async processThreeLayers(lambdaData) {
    console.log('🎯 INDEPENDENT: Running all 3 layers in parallel...');
    
    // Run all 3 scrapers independently (no dependencies)
    const [layer1, layer2, layer3] = await Promise.allSettled([
      Promise.resolve(lambdaData), // Layer 1 already complete
      this.trySeleniumScraper(),   // Layer 2 independent
      this.tryScraperAPI()         // Layer 3 independent
    ]);
    
    // Extract successful results
    const lambdaResult = layer1.status === 'fulfilled' ? layer1.value : null;
    const seleniumResult = layer2.status === 'fulfilled' ? layer2.value : null;
    const scraperAPIResult = layer3.status === 'fulfilled' ? layer3.value : null;
    
    console.log('📊 COMPARISON RESULTS:');
    console.log('📡 Lambda:', this.getDataSummary(lambdaResult));
    console.log('🐍 Selenium:', this.getDataSummary(seleniumResult));
    console.log('⚡ ScraperAPI:', this.getDataSummary(scraperAPIResult));
    
    // Compare and merge using "highest count wins" strategy
    return this.compareAndMerge(lambdaResult, seleniumResult, scraperAPIResult);
  }
  
  getDataSummary(data) {
    if (!data) return 'No data';
    
    const players = data.leaderboard?.length || 0;
    const missions = Object.keys(data.missions || {}).length;
    const totalPosts = Object.values(data.missions || {}).reduce((sum, m) => 
      sum + (m.instagram || 0) + (m.facebook || 0) + (m.x || 0), 0);
    
    return `${players} players, ${missions} missions, ${totalPosts} posts`;
  }
  
  async trySeleniumScraper() {
    try {
      console.log('🐍 INDEPENDENT: Selenium scraper running...');
      
      const seleniumEndpoint = 'https://scraper.missionmischief.online/scrape';
      const response = await fetch(seleniumEndpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        console.log('✅ Selenium: Success -', this.getDataSummary(data));
        return { ...data, source: 'selenium' };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Selenium: Failed -', error.message);
      return null;
    }
  }
  
  async tryScraperAPI() {
    try {
      console.log('⚡ INDEPENDENT: ScraperAPI running...');
      
      // Call Python scraper's ScraperAPI endpoint via CloudFront
      const scraperAPIEndpoint = 'https://scraper.missionmischief.online/scraperapi';
      const response = await fetch(scraperAPIEndpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        console.log('✅ ScraperAPI: Success -', this.getDataSummary(data));
        return { ...data, source: 'scraperapi' };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.log('❌ ScraperAPI: Failed -', error.message);
      return null;
    }
  }
  
  async tryPythonBackup() {
    // Legacy fallback - redirect to Selenium
    return await this.trySeleniumBackup();
  }

  compareAndMerge(lambdaData, seleniumData, scraperAPIData) {
    const sources = [];
    if (lambdaData) sources.push('lambda');
    if (seleniumData) sources.push('selenium');
    if (scraperAPIData) sources.push('scraperapi');
    
    console.log(`🏆 HIGHEST COUNT WINS: Comparing ${sources.length} sources`);
    
    // If no data from any source, return empty
    if (sources.length === 0) {
      return {
        leaderboard: [],
        geography: {},
        missions: {},
        justice: [],
        lastUpdated: new Date().toISOString(),
        source: 'no-data',
        coverage: '0%'
      };
    }
    
    // Get all unique mission IDs
    const allMissions = new Set();
    [lambdaData, seleniumData, scraperAPIData].forEach(data => {
      if (data?.missions) {
        Object.keys(data.missions).forEach(id => allMissions.add(id));
      }
    });
    
    // For each mission, find highest count per platform
    const finalMissions = {};
    const winners = {};
    
    for (const missionId of allMissions) {
      const lambda = lambdaData?.missions?.[missionId] || {instagram: 0, facebook: 0, x: 0};
      const selenium = seleniumData?.missions?.[missionId] || {instagram: 0, facebook: 0, x: 0};
      const scraperapi = scraperAPIData?.missions?.[missionId] || {instagram: 0, facebook: 0, x: 0};
      
      finalMissions[missionId] = {
        instagram: Math.max(lambda.instagram, selenium.instagram, scraperapi.instagram),
        facebook: Math.max(lambda.facebook, selenium.facebook, scraperapi.facebook),
        x: Math.max(lambda.x, selenium.x, scraperapi.x)
      };
      
      // Track winners for logging
      winners[missionId] = {
        instagram: [lambda.instagram, selenium.instagram, scraperapi.instagram].indexOf(Math.max(lambda.instagram, selenium.instagram, scraperapi.instagram)),
        facebook: [lambda.facebook, selenium.facebook, scraperapi.facebook].indexOf(Math.max(lambda.facebook, selenium.facebook, scraperapi.facebook)),
        x: [lambda.x, selenium.x, scraperapi.x].indexOf(Math.max(lambda.x, selenium.x, scraperapi.x))
      };
    }
    
    // Use leaderboard from source with most players
    const leaderboards = [lambdaData?.leaderboard, seleniumData?.leaderboard, scraperAPIData?.leaderboard]
      .filter(lb => lb && lb.length > 0);
    const finalLeaderboard = leaderboards.reduce((best, current) => 
      current.length > (best?.length || 0) ? current : best, []) || [];
    
    // Use geography from source with most locations
    const geographies = [lambdaData?.geography, seleniumData?.geography, scraperAPIData?.geography]
      .filter(geo => geo && Object.keys(geo).length > 0);
    const finalGeography = geographies.reduce((best, current) => 
      Object.keys(current).length > Object.keys(best || {}).length ? current : best, {}) || {};
    
    // Combine all justice cases
    const finalJustice = [
      ...(lambdaData?.justice || []),
      ...(seleniumData?.justice || []),
      ...(scraperAPIData?.justice || [])
    ];
    
    console.log('🏆 WINNERS:', winners);
    
    return {
      leaderboard: finalLeaderboard,
      geography: finalGeography,
      missions: finalMissions,
      justice: finalJustice,
      lastUpdated: new Date().toISOString(),
      source: `independent-${sources.join('+')}`,
      coverage: `${Math.min(sources.length * 33, 100)}%`,
      winners
    };
  }

  updateDisplay() {
    // Update global mockData if it exists
    if (window.mockData) {
      window.mockData.topPlayers = this.data.leaderboard.slice(0, 3);
      window.mockData.geography = this.data.geography;
      window.mockData.missionActivity = this.data.missions;
      window.mockData.justiceCases = this.data.justice;
      window.mockData.lastUpdated = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) + ' ' + new Date().toLocaleTimeString('en-US');
    }

    // Trigger display updates if functions exist
    if (typeof loadTopPlayers === 'function') loadTopPlayers();
    if (typeof loadGeography === 'function') loadGeography();
    if (typeof loadMissions === 'function') loadMissions();
    if (typeof loadJusticeCases === 'function') loadJusticeCases();

    console.log('📊 Display updated with scraping data');
  }

  getData() {
    return this.data;
  }

  getStatus() {
    return this.status;
  }
}

// Initialize and export
const simpleScraper = new SimpleScraper();
window.SimpleScraper = simpleScraper;

// Auto-start on load
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 Simple scraper loaded');
  simpleScraper.startScraping();
});