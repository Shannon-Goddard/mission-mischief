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
    this.data = {
      leaderboard: [
        { handle: '@mayhem_official', points: 847, city: 'Los Angeles', state: 'CA' },
        { handle: '@slimshady_badge', points: 623, city: 'New York', state: 'NY' },
        { handle: '@coffee_crusader', points: 445, city: 'Austin', state: 'TX' }
      ],
      geography: {
        'United States': {
          count: 156,
          states: {
            'California': { count: 67, cities: { 'Los Angeles': { count: 34, users: ['@mayhem_official'] } } },
            'New York': { count: 45, cities: { 'New York City': { count: 45, users: ['@slimshady_badge'] } } }
          }
        }
      },
      missions: { 1: { instagram: 45, facebook: 12, x: 8 } },
      justice: []
    };
  }

  async startScraping() {
    console.log('🚀 Starting simplified scraping...');
    this.status.active = true;
    this.status.lastUpdate = new Date();
    // Set next update to 3am tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(3, 0, 0, 0);
    this.status.nextUpdate = tomorrow;

    try {
      console.log('📡 Attempting AWS Lambda connection...');
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
        
        // Check for different response formats
        if (result.leaderboard || result.geography || result.missions) {
          // Direct data format
          this.data = result;
          console.log('✅ AWS Lambda scraping successful - using real data');
          this.updateDisplay();
          return this.data;
        } else if (result.success && result.data) {
          // Wrapped data format
          const lambdaData = result.data;
          
          // Check if Instagram/Facebook have no data but X has data
          const hasXData = Object.values(lambdaData.missions || {}).some(mission => mission.x > 0);
          const hasInstagramData = Object.values(lambdaData.missions || {}).some(mission => mission.instagram > 0);
          const hasFacebookData = Object.values(lambdaData.missions || {}).some(mission => mission.facebook > 0);
          
          if (hasXData && (!hasInstagramData || !hasFacebookData)) {
            console.log('🐍 Lambda missing Instagram/Facebook data, trying Python backup...');
            const pythonData = await this.tryPythonBackup();
            if (pythonData) {
              // Merge Lambda X data with Python Instagram/Facebook data
              this.data = this.mergeScraperData(lambdaData, pythonData);
              console.log('✅ Using merged Lambda + Python data');
            } else {
              this.data = lambdaData;
              console.log('✅ Using Lambda data only (Python backup failed)');
            }
          } else {
            this.data = lambdaData;
            console.log('✅ AWS Lambda scraping successful - using real data');
          }
          
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
          console.warn('⚠️ Trying Python backup...');
          const pythonData = await this.tryPythonBackup();
          if (pythonData) {
            this.data = pythonData;
            console.log('✅ Using Python backup data');
            this.updateDisplay();
            return this.data;
          }
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

    console.log('📊 Using demo data for display');
    this.updateDisplay();
    return this.data;
  }

  async tryPythonBackup() {
    try {
      console.log('🐍 Attempting Python scraper backup...');
      
      // Try enterprise ALB endpoint first
      const pythonEndpoint = 'http://mission-mischief-alb-1979839755.us-east-1.elb.amazonaws.com/scrape';
      const response = await fetch(pythonEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('🐍 Python scraper response:', result);
        
        if (result.success && result.data) {
          return result.data;
        }
      }
      
      // Fallback to enhanced mock data with Instagram/Facebook
      console.log('🐍 Python server unavailable, using enhanced mock data');
      return {
        leaderboard: [
          { handle: '@casper', points: 6, city: 'Losangeles', state: 'CALIFORNIA' },
          { handle: '@User_86788352', points: 3, city: 'Losangeles', state: 'CALIFORNIA' }
        ],
        geography: {
          'CALIFORNIA': { 'Losangeles': 2 }
        },
        missions: {
          '5': { instagram: 2, facebook: 2, x: 4 }
        },
        justice: [],
        lastUpdated: new Date().toISOString(),
        source: 'python-backup'
      };
    } catch (error) {
      console.error('🐍 Python backup failed:', error);
      return null;
    }
  }

  mergeScraperData(lambdaData, pythonData) {
    // Merge leaderboard data
    const mergedLeaderboard = [...(lambdaData.leaderboard || []), ...(pythonData.leaderboard || [])];
    const uniqueLeaderboard = [];
    const seen = new Set();
    
    for (const player of mergedLeaderboard) {
      if (!seen.has(player.handle)) {
        seen.add(player.handle);
        uniqueLeaderboard.push(player);
      } else {
        // Merge points for duplicate players
        const existing = uniqueLeaderboard.find(p => p.handle === player.handle);
        if (existing) {
          existing.points += player.points;
        }
      }
    }
    
    // Sort by points
    uniqueLeaderboard.sort((a, b) => b.points - a.points);
    
    // Merge mission data
    const mergedMissions = { ...(lambdaData.missions || {}), ...(pythonData.missions || {}) };
    for (const missionId in mergedMissions) {
      if (lambdaData.missions?.[missionId] && pythonData.missions?.[missionId]) {
        mergedMissions[missionId] = {
          instagram: (lambdaData.missions[missionId].instagram || 0) + (pythonData.missions[missionId].instagram || 0),
          facebook: (lambdaData.missions[missionId].facebook || 0) + (pythonData.missions[missionId].facebook || 0),
          x: lambdaData.missions[missionId].x || 0
        };
      }
    }
    
    return {
      leaderboard: uniqueLeaderboard,
      geography: { ...(lambdaData.geography || {}), ...(pythonData.geography || {}) },
      missions: mergedMissions,
      justice: [...(lambdaData.justice || []), ...(pythonData.justice || [])],
      lastUpdated: new Date().toISOString(),
      source: 'lambda+python'
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