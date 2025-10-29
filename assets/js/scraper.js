// Mission Mischief Scraping System - Phase 4 Implementation
class MissionMischiefScraper {
  constructor() {
    this.apiEndpoints = {
      instagram: 'https://www.instagram.com/api/v1/tags/',
      tiktok: 'https://www.tiktok.com/api/challenge/detail/',
      facebook: 'https://graph.facebook.com/v18.0/',
      twitter: 'https://api.twitter.com/2/tweets/search/recent'
    };
    
    this.scrapeStatus = {
      active: false,
      lastUpdate: null,
      nextUpdate: null,
      errors: []
    };
    
    this.cache = {
      leaderboard: [],
      geography: {},
      missions: {},
      justice: [],
      lastCacheUpdate: null
    };
  }

  // Main scraping orchestrator
  async startScraping() {
    this.scrapeStatus.active = true;
    this.scrapeStatus.lastUpdate = new Date();
    this.scrapeStatus.nextUpdate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    
    try {
      await Promise.all([
        this.scrapeLeaderboardData(),
        this.scrapeGeographicData(),
        this.scrapeMissionActivity(),
        this.scrapeJusticeCases()
      ]);
      
      this.updateBountyHunterDisplay();
      this.scheduleNextScrape();
    } catch (error) {
      this.handleScrapeError(error);
    }
  }

  // Scrape leaderboard data from hashtag posts
  async scrapeLeaderboardData() {
    const players = new Map();
    
    // Scrape points hashtags: #missionmischiefpoints1, #missionmischiefpoints2, etc.
    for (let points = 1; points <= 50; points++) {
      const hashtag = `missionmischiefpoints${points}`;
      const posts = await this.scrapeHashtag(hashtag);
      
      posts.forEach(post => {
        const handle = this.extractUserHandle(post);
        const location = this.extractLocation(post);
        
        if (players.has(handle)) {
          players.get(handle).points += points;
        } else {
          players.set(handle, {
            handle,
            points,
            city: location.city,
            state: location.state,
            country: location.country,
            lastActivity: post.timestamp
          });
        }
      });
    }
    
    // Sort by points and take top players
    this.cache.leaderboard = Array.from(players.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, 100);
  }

  // Scrape geographic activity data
  async scrapeGeographicData() {
    const geography = {};
    
    // Scrape location hashtags: #missionmischiefcountryusa, #missionmischiefstatecalifornia, etc.
    const locationPosts = await this.scrapeHashtag('missionmischief');
    
    locationPosts.forEach(post => {
      const location = this.extractLocation(post);
      const handle = this.extractUserHandle(post);
      
      if (!geography[location.country]) {
        geography[location.country] = { count: 0, states: {} };
      }
      
      if (!geography[location.country].states[location.state]) {
        geography[location.country].states[location.state] = { count: 0, cities: {} };
      }
      
      if (!geography[location.country].states[location.state].cities[location.city]) {
        geography[location.country].states[location.state].cities[location.city] = { count: 0, users: [] };
      }
      
      const cityData = geography[location.country].states[location.state].cities[location.city];
      if (!cityData.users.includes(handle)) {
        cityData.users.push(handle);
        cityData.count++;
        geography[location.country].states[location.state].count++;
        geography[location.country].count++;
      }
    });
    
    this.cache.geography = geography;
  }

  // Scrape mission-specific activity
  async scrapeMissionActivity() {
    const missions = {};
    
    // Get all mission hashtags from missions.js
    const allMissions = window.Missions?.missionData || [];
    
    for (const mission of allMissions) {
      const hashtag = mission.hashtag.replace('#', '');
      missions[mission.id] = {
        instagram: 0,
        tiktok: 0,
        facebook: 0,
        x: 0
      };
      
      // Scrape each platform for this mission hashtag
      const platforms = ['instagram', 'tiktok', 'facebook', 'x'];
      for (const platform of platforms) {
        try {
          const posts = await this.scrapePlatform(platform, hashtag);
          missions[mission.id][platform] = posts.length;
        } catch (error) {
          console.warn(`Failed to scrape ${platform} for ${hashtag}:`, error);
        }
      }
    }
    
    this.cache.missions = missions;
  }

  // Scrape justice cases (cheater reports)
  async scrapeJusticeCases() {
    const cases = [];
    
    // Scrape evidence hashtags: #missionmischiefevidenceyourmessage
    const evidencePosts = await this.scrapeHashtag('missionmischiefevidenceyourmessage');
    
    evidencePosts.forEach((post, index) => {
      const accused = this.extractAccused(post);
      const accuser = this.extractUserHandle(post);
      const mission = this.extractMissionFromEvidence(post);
      
      cases.push({
        id: index + 1,
        accused,
        accuser,
        mission,
        date: post.timestamp,
        evidenceHashtag: post.hashtags.find(h => h.includes('evidence')),
        requirements: [
          { hashtag: '#missionmischiefclown', completed: this.checkRedemptionStatus(accused, 'clown') },
          { hashtag: '#missionmischiefpaidbail', completed: this.checkRedemptionStatus(accused, 'paidbail') }
        ]
      });
    });
    
    this.cache.justice = cases;
  }

  // Generic hashtag scraper (platform-agnostic)
  async scrapeHashtag(hashtag) {
    const allPosts = [];
    
    try {
      // Instagram scraping
      const instagramPosts = await this.scrapePlatform('instagram', hashtag);
      allPosts.push(...instagramPosts);
      
      // TikTok scraping
      const tiktokPosts = await this.scrapePlatform('tiktok', hashtag);
      allPosts.push(...tiktokPosts);
      
      // Facebook scraping
      const facebookPosts = await this.scrapePlatform('facebook', hashtag);
      allPosts.push(...facebookPosts);
      
      // X (Twitter) scraping
      const xPosts = await this.scrapePlatform('x', hashtag);
      allPosts.push(...xPosts);
      
    } catch (error) {
      console.error(`Error scraping hashtag ${hashtag}:`, error);
    }
    
    return allPosts;
  }

  // Platform-specific scraping
  async scrapePlatform(platform, hashtag) {
    const posts = [];
    
    try {
      switch (platform) {
        case 'instagram':
          return await this.scrapeInstagram(hashtag);
        case 'tiktok':
          return await this.scrapeTikTok(hashtag);
        case 'facebook':
          return await this.scrapeFacebook(hashtag);
        case 'x':
          return await this.scrapeX(hashtag);
        default:
          throw new Error(`Unknown platform: ${platform}`);
      }
    } catch (error) {
      console.error(`Error scraping ${platform} for ${hashtag}:`, error);
      return [];
    }
  }

  // Instagram scraping implementation
  async scrapeInstagram(hashtag) {
    // Note: Instagram requires authentication and has rate limits
    // This is a simplified implementation - production would need proper API keys
    try {
      const response = await fetch(`${this.apiEndpoints.instagram}${hashtag}/`, {
        headers: {
          'User-Agent': 'MissionMischief/1.0',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`Instagram API error: ${response.status}`);
      
      const data = await response.json();
      return this.parseInstagramPosts(data);
    } catch (error) {
      console.warn('Instagram scraping failed, using fallback method');
      return this.fallbackScrape('instagram', hashtag);
    }
  }

  // TikTok scraping implementation
  async scrapeTikTok(hashtag) {
    try {
      const response = await fetch(`${this.apiEndpoints.tiktok}?challengeName=${hashtag}`, {
        headers: {
          'User-Agent': 'MissionMischief/1.0',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`TikTok API error: ${response.status}`);
      
      const data = await response.json();
      return this.parseTikTokPosts(data);
    } catch (error) {
      console.warn('TikTok scraping failed, using fallback method');
      return this.fallbackScrape('tiktok', hashtag);
    }
  }

  // Facebook scraping implementation
  async scrapeFacebook(hashtag) {
    try {
      const response = await fetch(`${this.apiEndpoints.facebook}search?q=%23${hashtag}&type=post`, {
        headers: {
          'Authorization': 'Bearer YOUR_FACEBOOK_ACCESS_TOKEN',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`Facebook API error: ${response.status}`);
      
      const data = await response.json();
      return this.parseFacebookPosts(data);
    } catch (error) {
      console.warn('Facebook scraping failed, using fallback method');
      return this.fallbackScrape('facebook', hashtag);
    }
  }

  // X (Twitter) scraping implementation
  async scrapeX(hashtag) {
    try {
      const response = await fetch(`${this.apiEndpoints.twitter}?query=%23${hashtag}`, {
        headers: {
          'Authorization': 'Bearer YOUR_TWITTER_BEARER_TOKEN',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`X API error: ${response.status}`);
      
      const data = await response.json();
      return this.parseXPosts(data);
    } catch (error) {
      console.warn('X scraping failed, using fallback method');
      return this.fallbackScrape('x', hashtag);
    }
  }

  // Fallback scraping for when APIs fail
  fallbackScrape(platform, hashtag) {
    // Return mock data for development/testing
    return [
      {
        id: `${platform}_${hashtag}_${Date.now()}`,
        platform,
        hashtag,
        user: '@test_user',
        content: `Test post with #${hashtag}`,
        timestamp: new Date().toISOString(),
        hashtags: [`#${hashtag}`, '#missionmischief'],
        location: { country: 'USA', state: 'California', city: 'Los Angeles' }
      }
    ];
  }

  // Extract user handle from post
  extractUserHandle(post) {
    return post.user || '@unknown';
  }

  // Extract location from hashtags
  extractLocation(post) {
    const hashtags = post.hashtags || [];
    const location = { country: 'Unknown', state: 'Unknown', city: 'Unknown' };
    
    hashtags.forEach(tag => {
      if (tag.includes('missionmischiefcountry')) {
        location.country = tag.replace('missionmischiefcountry', '').toUpperCase();
      }
      if (tag.includes('missionmischiefstate')) {
        location.state = tag.replace('missionmischiefstate', '');
      }
      if (tag.includes('missionmischiefcity')) {
        location.city = tag.replace('missionmischiefcity', '');
      }
    });
    
    return location;
  }

  // Extract accused user from evidence post
  extractAccused(post) {
    const content = post.content || '';
    const match = content.match(/@(\w+)/);
    return match ? `@${match[1]}` : '@unknown';
  }

  // Extract mission from evidence post
  extractMissionFromEvidence(post) {
    const hashtags = post.hashtags || [];
    const missionHashtag = hashtags.find(tag => 
      tag.startsWith('missionmischief') && 
      !tag.includes('evidence') && 
      !tag.includes('country') && 
      !tag.includes('state') && 
      !tag.includes('city') &&
      !tag.includes('points')
    );
    
    return missionHashtag ? missionHashtag.replace('missionmischief', '') : 'Unknown';
  }

  // Check redemption status for accused users
  async checkRedemptionStatus(accused, requirement) {
    const redemptionPosts = await this.scrapeHashtag(`missionmischief${requirement}`);
    return redemptionPosts.some(post => post.user === accused);
  }

  // Update bounty hunter display with real data
  updateBountyHunterDisplay() {
    // Process data first
    if (window.DataProcessor) {
      const processedData = {
        leaderboard: this.cache.leaderboard,
        geography: this.cache.geography,
        missions: this.cache.missions,
        justice: this.cache.justice
      };
      
      window.DataProcessor.processedData = processedData;
      
      // Trigger bounty hunter update if callback exists
      if (this.onDataUpdate) {
        this.onDataUpdate(processedData);
      }
    }
    
    // Update legacy displays
    if (window.mockData) {
      window.mockData.topPlayers = this.cache.leaderboard.slice(0, 3);
      window.mockData.geography = this.cache.geography;
      window.mockData.missionActivity = this.cache.missions;
      window.mockData.justiceCases = this.cache.justice;
    }
    
    // Update status display
    this.updateScrapeStatusDisplay();
  }

  // Update scrape status display
  updateScrapeStatusDisplay() {
    const statusElement = document.getElementById('scrapeStatus');
    const nextUpdateElement = document.getElementById('nextUpdate');
    
    if (statusElement) {
      statusElement.textContent = this.scrapeStatus.active ? 'Active' : 'Inactive';
      statusElement.className = `scrape-status ${this.scrapeStatus.active ? 'active' : 'inactive'}`;
    }
    
    if (nextUpdateElement) {
      const timeUntilNext = this.scrapeStatus.nextUpdate - new Date();
      const hours = Math.floor(timeUntilNext / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilNext % (1000 * 60 * 60)) / (1000 * 60));
      nextUpdateElement.textContent = `${hours} hours ${minutes} minutes`;
    }
  }

  // Schedule next scrape
  scheduleNextScrape() {
    const nextScrapeTime = 2 * 60 * 60 * 1000; // 2 hours
    setTimeout(() => {
      this.startScraping();
    }, nextScrapeTime);
  }

  // Handle scraping errors
  handleScrapeError(error) {
    console.error('Scraping error:', error);
    this.scrapeStatus.errors.push({
      timestamp: new Date(),
      error: error.message
    });
    
    // Keep only last 10 errors
    if (this.scrapeStatus.errors.length > 10) {
      this.scrapeStatus.errors = this.scrapeStatus.errors.slice(-10);
    }
  }

  // Parse platform-specific post data
  parseInstagramPosts(data) {
    // Instagram-specific parsing logic
    return (data.data || []).map(post => ({
      id: post.id,
      platform: 'instagram',
      user: `@${post.user.username}`,
      content: post.caption?.text || '',
      timestamp: post.taken_at,
      hashtags: this.extractHashtags(post.caption?.text || ''),
      location: this.parseLocation(post.location)
    }));
  }

  parseTikTokPosts(data) {
    // TikTok-specific parsing logic
    return (data.itemList || []).map(post => ({
      id: post.id,
      platform: 'tiktok',
      user: `@${post.author.uniqueId}`,
      content: post.desc || '',
      timestamp: post.createTime,
      hashtags: this.extractHashtags(post.desc || ''),
      location: this.parseLocation(post.locationCreated)
    }));
  }

  parseFacebookPosts(data) {
    // Facebook-specific parsing logic
    return (data.data || []).map(post => ({
      id: post.id,
      platform: 'facebook',
      user: `@${post.from.name}`,
      content: post.message || '',
      timestamp: post.created_time,
      hashtags: this.extractHashtags(post.message || ''),
      location: this.parseLocation(post.place)
    }));
  }

  parseXPosts(data) {
    // X (Twitter)-specific parsing logic
    return (data.data || []).map(post => ({
      id: post.id,
      platform: 'x',
      user: `@${post.author_id}`,
      content: post.text || '',
      timestamp: post.created_at,
      hashtags: this.extractHashtags(post.text || ''),
      location: this.parseLocation(post.geo)
    }));
  }

  // Extract hashtags from text
  extractHashtags(text) {
    const hashtagRegex = /#\w+/g;
    return (text.match(hashtagRegex) || []).map(tag => tag.toLowerCase());
  }

  // Parse location data
  parseLocation(locationData) {
    if (!locationData) {
      return { country: 'Unknown', state: 'Unknown', city: 'Unknown' };
    }
    
    return {
      country: locationData.country || 'Unknown',
      state: locationData.state || locationData.region || 'Unknown',
      city: locationData.city || locationData.name || 'Unknown'
    };
  }
}

// Initialize scraper with AWS Lambda endpoint
const scraper = new MissionMischiefScraper();
scraper.lambdaEndpoint = 'https://imddm6sh0i.execute-api.us-east-1.amazonaws.com/prod/scrape';

// Production mode - use AWS Lambda for scraping
document.addEventListener('DOMContentLoaded', function() {
  console.log('Mission Mischief Scraper loaded with AWS Lambda backend');
  console.log('Using endpoint:', scraper.lambdaEndpoint);
  
  // Initialize with demo data instead
  if (window.DataProcessor) {
    const demoData = {
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
    
    scraper.cache = demoData;
    scraper.scrapeStatus.active = true;
    scraper.scrapeStatus.lastUpdate = new Date();
    scraper.scrapeStatus.nextUpdate = new Date(Date.now() + 2 * 60 * 60 * 1000);
  }
});

// Export for use in other files
window.MissionMischiefScraper = scraper;

// Override startScraping to use AWS Lambda
scraper.startScraping = async function() {
  console.log('Starting AWS Lambda scraping...');
  
  try {
    const response = await fetch(this.lambdaEndpoint);
    const result = await response.json();
    
    if (result.success) {
      // Update cache with real data
      this.cache = result.data;
      this.scrapeStatus.active = true;
      this.scrapeStatus.lastUpdate = new Date();
      this.scrapeStatus.nextUpdate = new Date(Date.now() + 2 * 60 * 60 * 1000);
      
      this.updateBountyHunterDisplay();
      console.log('AWS Lambda scraping completed successfully');
    } else {
      throw new Error(result.error || 'Lambda function failed');
    }
  } catch (error) {
    console.error('AWS Lambda scraping failed:', error);
    // Fall back to demo data
    this.handleScrapeError(error);
    this.updateBountyHunterDisplay();
  }
};

// Auto-start scraping
scraper.startScraping();