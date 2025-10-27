// Data Processing System for Mission Mischief Scraping
class DataProcessor {
  constructor() {
    this.processedData = {
      leaderboard: [],
      geography: {},
      missions: {},
      justice: [],
      statistics: {
        totalPlayers: 0,
        totalPosts: 0,
        totalPoints: 0,
        activeCases: 0
      }
    };
  }

  // Process raw scraped data into structured format
  processScrapedData(rawData) {
    console.log('Processing scraped data...');
    
    // Process leaderboard data
    this.processLeaderboard(rawData.posts || []);
    
    // Process geographic data
    this.processGeography(rawData.posts || []);
    
    // Process mission activity
    this.processMissionActivity(rawData.posts || []);
    
    // Process justice cases
    this.processJusticeCases(rawData.posts || []);
    
    // Calculate statistics
    this.calculateStatistics();
    
    return this.processedData;
  }

  // Process leaderboard from points hashtags
  processLeaderboard(posts) {
    const playerMap = new Map();
    
    posts.forEach(post => {
      const pointsHashtag = post.hashtags.find(tag => tag.includes('missionmischiefpoints'));
      if (!pointsHashtag) return;
      
      const points = parseInt(pointsHashtag.replace('missionmischiefpoints', '')) || 0;
      const handle = post.user;
      const location = this.extractLocationFromPost(post);
      
      if (playerMap.has(handle)) {
        const player = playerMap.get(handle);
        player.points += points;
        player.postCount++;
        player.lastActivity = new Date(Math.max(new Date(player.lastActivity), new Date(post.timestamp)));
      } else {
        playerMap.set(handle, {
          handle,
          points,
          postCount: 1,
          city: location.city,
          state: location.state,
          country: location.country,
          lastActivity: post.timestamp,
          platforms: [post.platform]
        });
      }
    });
    
    // Sort by points and format for display
    this.processedData.leaderboard = Array.from(playerMap.values())
      .sort((a, b) => b.points - a.points)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
        displayLocation: `${player.city}, ${player.state}`
      }));
  }

  // Process geographic distribution
  processGeography(posts) {
    const geography = {};
    
    posts.forEach(post => {
      const location = this.extractLocationFromPost(post);
      const handle = post.user;
      
      // Initialize country
      if (!geography[location.country]) {
        geography[location.country] = {
          count: 0,
          uniqueUsers: new Set(),
          states: {}
        };
      }
      
      // Initialize state
      if (!geography[location.country].states[location.state]) {
        geography[location.country].states[location.state] = {
          count: 0,
          uniqueUsers: new Set(),
          cities: {}
        };
      }
      
      // Initialize city
      if (!geography[location.country].states[location.state].cities[location.city]) {
        geography[location.country].states[location.state].cities[location.city] = {
          count: 0,
          uniqueUsers: new Set(),
          users: []
        };
      }
      
      // Add user to all levels
      const cityData = geography[location.country].states[location.state].cities[location.city];
      const stateData = geography[location.country].states[location.state];
      const countryData = geography[location.country];
      
      if (!cityData.uniqueUsers.has(handle)) {
        cityData.uniqueUsers.add(handle);
        cityData.users.push(handle);
        cityData.count++;
        
        stateData.uniqueUsers.add(handle);
        stateData.count++;
        
        countryData.uniqueUsers.add(handle);
        countryData.count++;
      }
    });
    
    // Convert Sets to arrays for JSON serialization
    this.processedData.geography = this.cleanGeographyData(geography);
  }

  // Process mission-specific activity
  processMissionActivity(posts) {
    const missions = {};
    const allMissions = window.Missions?.missionData || [];
    
    // Initialize all missions
    allMissions.forEach(mission => {
      missions[mission.id] = {
        instagram: 0,
        tiktok: 0,
        facebook: 0,
        x: 0,
        total: 0,
        uniqueUsers: new Set(),
        recentPosts: []
      };
    });
    
    // Process posts
    posts.forEach(post => {
      const missionHashtag = this.findMissionHashtag(post.hashtags);
      if (!missionHashtag) return;
      
      const mission = this.findMissionByHashtag(missionHashtag, allMissions);
      if (!mission) return;
      
      const missionData = missions[mission.id];
      missionData[post.platform]++;
      missionData.total++;
      missionData.uniqueUsers.add(post.user);
      
      // Keep recent posts for display
      missionData.recentPosts.push({
        user: post.user,
        platform: post.platform,
        timestamp: post.timestamp,
        content: post.content.substring(0, 100)
      });
      
      // Keep only 5 most recent posts
      if (missionData.recentPosts.length > 5) {
        missionData.recentPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        missionData.recentPosts = missionData.recentPosts.slice(0, 5);
      }
    });
    
    // Clean up data for serialization
    Object.keys(missions).forEach(missionId => {
      missions[missionId].uniqueUserCount = missions[missionId].uniqueUsers.size;
      delete missions[missionId].uniqueUsers;
    });
    
    this.processedData.missions = missions;
  }

  // Process justice cases from evidence hashtags
  processJusticeCases(posts) {
    const cases = [];
    
    const evidencePosts = posts.filter(post => 
      post.hashtags.some(tag => tag.includes('missionmischiefevidenceyourmessage'))
    );
    
    evidencePosts.forEach((post, index) => {
      const accused = this.extractAccusedFromPost(post);
      const mission = this.extractMissionFromPost(post);
      
      cases.push({
        id: index + 1,
        accused,
        accuser: post.user,
        mission,
        date: post.timestamp,
        platform: post.platform,
        evidenceHashtag: post.hashtags.find(tag => tag.includes('evidence')),
        evidenceContent: post.content.substring(0, 200),
        requirements: [
          { 
            hashtag: '#missionmischiefclown', 
            completed: this.checkRedemptionStatus(accused, 'clown', posts),
            description: 'Post with clown overlay admitting guilt'
          },
          { 
            hashtag: '#missionmischiefpaidbail', 
            completed: this.checkRedemptionStatus(accused, 'paidbail', posts),
            description: 'Pay $5 beer mission as penalty'
          }
        ],
        status: this.calculateCaseStatus(accused, posts)
      });
    });
    
    this.processedData.justice = cases;
  }

  // Calculate overall statistics
  calculateStatistics() {
    const stats = this.processedData.statistics;
    
    stats.totalPlayers = this.processedData.leaderboard.length;
    stats.totalPoints = this.processedData.leaderboard.reduce((sum, player) => sum + player.points, 0);
    stats.activeCases = this.processedData.justice.filter(case => case.status === 'pending').length;
    
    // Calculate total posts from mission activity
    stats.totalPosts = Object.values(this.processedData.missions)
      .reduce((sum, mission) => sum + mission.total, 0);
  }

  // Helper methods
  extractLocationFromPost(post) {
    const hashtags = post.hashtags || [];
    const location = { country: 'Unknown', state: 'Unknown', city: 'Unknown' };
    
    hashtags.forEach(tag => {
      if (tag.includes('missionmischiefcountry')) {
        location.country = this.formatLocationName(tag.replace('missionmischiefcountry', ''));
      }
      if (tag.includes('missionmischiefstate')) {
        location.state = this.formatLocationName(tag.replace('missionmischiefstate', ''));
      }
      if (tag.includes('missionmischiefcity')) {
        location.city = this.formatLocationName(tag.replace('missionmischiefcity', ''));
      }
    });
    
    return location;
  }

  formatLocationName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  findMissionHashtag(hashtags) {
    return hashtags.find(tag => 
      tag.startsWith('missionmischief') && 
      !tag.includes('evidence') && 
      !tag.includes('country') && 
      !tag.includes('state') && 
      !tag.includes('city') &&
      !tag.includes('points') &&
      !tag.includes('clown') &&
      !tag.includes('paidbail') &&
      tag !== 'missionmischief'
    );
  }

  findMissionByHashtag(hashtag, missions) {
    return missions.find(mission => 
      mission.hashtag.toLowerCase().replace('#', '') === hashtag.toLowerCase()
    );
  }

  extractAccusedFromPost(post) {
    const content = post.content || '';
    const userMentions = content.match(/@(\w+)/g);
    
    // Return the first mentioned user that's not the poster
    if (userMentions) {
      const accused = userMentions.find(mention => mention !== post.user);
      return accused || userMentions[0];
    }
    
    return '@unknown';
  }

  extractMissionFromPost(post) {
    const missionHashtag = this.findMissionHashtag(post.hashtags);
    if (!missionHashtag) return 'Unknown Mission';
    
    const allMissions = window.Missions?.missionData || [];
    const mission = this.findMissionByHashtag(missionHashtag, allMissions);
    
    return mission ? mission.title : 'Unknown Mission';
  }

  checkRedemptionStatus(accused, requirement, posts) {
    return posts.some(post => 
      post.user === accused && 
      post.hashtags.some(tag => tag.includes(`missionmischief${requirement}`))
    );
  }

  calculateCaseStatus(accused, posts) {
    const hasClown = this.checkRedemptionStatus(accused, 'clown', posts);
    const hasPaidBail = this.checkRedemptionStatus(accused, 'paidbail', posts);
    
    if (hasClown && hasPaidBail) return 'resolved';
    if (hasClown || hasPaidBail) return 'partial';
    return 'pending';
  }

  cleanGeographyData(geography) {
    const cleaned = {};
    
    Object.keys(geography).forEach(country => {
      cleaned[country] = {
        count: geography[country].count,
        states: {}
      };
      
      Object.keys(geography[country].states).forEach(state => {
        cleaned[country].states[state] = {
          count: geography[country].states[state].count,
          cities: {}
        };
        
        Object.keys(geography[country].states[state].cities).forEach(city => {
          const cityData = geography[country].states[state].cities[city];
          cleaned[country].states[state].cities[city] = {
            count: cityData.count,
            users: cityData.users.slice(0, 10) // Limit to 10 users for display
          };
        });
      });
    });
    
    return cleaned;
  }

  // Update bounty hunter display with processed data
  updateBountyHunterDisplay() {
    // Update global mockData object that the bounty hunter uses
    if (window.mockData) {
      window.mockData.topPlayers = this.processedData.leaderboard.slice(0, 3);
      window.mockData.geography = this.processedData.geography;
      window.mockData.missionActivity = this.processedData.missions;
      window.mockData.justiceCases = this.processedData.justice;
      
      // Update last updated timestamp
      window.mockData.lastUpdated = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) + ' ' + new Date().toLocaleTimeString('en-US');
    }
    
    // Trigger display updates
    if (typeof loadTopPlayers === 'function') loadTopPlayers();
    if (typeof loadGeography === 'function') loadGeography();
    if (typeof loadMissions === 'function') loadMissions();
    if (typeof loadJusticeCases === 'function') loadJusticeCases();
    
    console.log('Bounty hunter display updated with real data');
  }

  // Get processed data for external use
  getData() {
    return this.processedData;
  }

  // Get statistics summary
  getStatistics() {
    return this.processedData.statistics;
  }
}

// Export singleton instance
window.DataProcessor = new DataProcessor();