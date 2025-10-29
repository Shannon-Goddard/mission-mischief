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
      missions: { 1: { instagram: 45, tiktok: 23, facebook: 12, x: 8 } },
      justice: []
    };
  }

  async startScraping() {
    console.log('🚀 Starting simplified scraping...');
    this.status.active = true;
    this.status.lastUpdate = new Date();
    this.status.nextUpdate = new Date(Date.now() + 2 * 60 * 60 * 1000);

    try {
      const response = await fetch(this.endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          this.data = result.data;
          console.log('✅ AWS Lambda scraping successful');
        } else {
          console.warn('⚠️ Lambda returned no data, using demo data');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Lambda scraping failed:', error);
      this.status.errors.push({
        timestamp: new Date(),
        error: error.message
      });
      // Continue with demo data
    }

    this.updateDisplay();
    return this.data;
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