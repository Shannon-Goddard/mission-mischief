const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const https = require('https');

const ssm = new SSMClient({ region: 'us-east-1' });

// Get parameter from Parameter Store
async function getParameter(name) {
  const command = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const result = await ssm.send(command);
  return result.Parameter.Value;
}

// Make HTTPS request
function makeRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: 'Invalid JSON response' });
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => reject(new Error('Request timeout')));
  });
}

// Extract geographic data from post text
function extractGeography(postText) {
  const text = postText.toLowerCase();
  
  // Extract city from hashtag
  const cityMatch = text.match(/#missionmischiefcity([a-z]+)/);
  const city = cityMatch ? cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1) : 'Unknown';
  
  // Extract state from hashtag
  const stateMatch = text.match(/#missionmischiefstate([a-z]+)/);
  const state = stateMatch ? stateMatch[1].toUpperCase() : 'Unknown';
  
  // Extract country from hashtag (optional)
  const countryMatch = text.match(/#missionmischiefcountry([a-z]+)/);
  const country = countryMatch ? countryMatch[1].toUpperCase() : 'US';
  
  return { city, state, country };
}

// Scrape Facebook hashtags
async function scrapeFacebook(hashtag) {
  try {
    const accessToken = await getParameter('/mission-mischief/facebook/access-token');
    const url = `https://graph.facebook.com/v18.0/search?q=%23${hashtag}&type=post&access_token=${accessToken}&limit=50`;
    return await makeRequest(url);
  } catch (error) {
    console.error('Facebook scraping error:', error);
    return { data: [] };
  }
}

// Scrape Instagram hashtags
async function scrapeInstagram(hashtag) {
  try {
    const accessToken = await getParameter('/mission-mischief/instagram/access-token');
    const url = `https://graph.instagram.com/v18.0/ig_hashtag_search?q=${hashtag}&access_token=${accessToken}`;
    return await makeRequest(url);
  } catch (error) {
    console.error('Instagram scraping error:', error);
    return { data: [] };
  }
}

// Scrape X (Twitter) hashtags
async function scrapeTwitter(hashtag) {
  try {
    const bearerToken = await getParameter('/mission-mischief/twitter/bearer-token');
    const url = `https://api.twitter.com/2/tweets/search/recent?query=%23${hashtag}&max_results=50&tweet.fields=author_id,created_at,public_metrics,geo`;
    const headers = { 'Authorization': `Bearer ${bearerToken}` };
    return await makeRequest(url, headers);
  } catch (error) {
    console.error('Twitter scraping error:', error);
    return { data: [] };
  }
}

// Process scraped data into Mission Mischief format
function processData(facebookData, instagramData, twitterData, hashtags) {
  const leaderboard = [];
  const geography = {};
  const missions = {};
  const justice = [];

  // Process each platform's data
  [facebookData, instagramData, twitterData].forEach((platformData, index) => {
    const platformName = ['facebook', 'instagram', 'x'][index];
    
    if (platformData.data) {
      platformData.data.forEach(post => {
        const postText = (post.message || post.text || '').toLowerCase();
        
        // Skip if not Mission Mischief related
        if (!postText.includes('#missionmischief')) return;
        
        // Extract user handle and engagement
        const handle = post.from?.username || post.author_id || 'unknown';
        const engagement = post.likes?.summary?.total_count || post.public_metrics?.like_count || 0;
        
        // Extract geographic data from hashtags
        const { city, state, country } = extractGeography(postText);
        
        // Extract points from hashtag if present
        const pointsMatch = postText.match(/#missionmischiefpoints(\d+)/);
        const points = pointsMatch ? parseInt(pointsMatch[1]) : (engagement > 0 ? engagement : 3);
        
        // Add to leaderboard
        const existingPlayer = leaderboard.find(p => p.handle === `@${handle}`);
        if (existingPlayer) {
          existingPlayer.points += points;
          // Update location if more specific
          if (city !== 'Unknown') existingPlayer.city = city;
          if (state !== 'Unknown') existingPlayer.state = state;
        } else {
          leaderboard.push({
            handle: `@${handle}`,
            points: points,
            city: city,
            state: state
          });
        }
        
        // Update geography tracking with country support
        if (country !== 'US' || (state !== 'Unknown' && city !== 'Unknown')) {
          if (!geography[country]) {
            geography[country] = {};
          }
          if (country !== 'US') {
            // International: Country -> City
            geography[country][city] = (geography[country][city] || 0) + 1;
          } else {
            // US: Country -> State -> City
            if (!geography[country][state]) {
              geography[country][state] = {};
            }
            geography[country][state][city] = (geography[country][state][city] || 0) + 1;
          }
        }
        
        // Track mission activity
        let missionId = 1; // Default mission
        
        // Try to identify specific mission from hashtags
        if (postText.includes('#iwillnotsuemissionmischief')) missionId = 1;
        else if (postText.includes('#missionmischiefslimshady')) missionId = 5;
        else if (postText.includes('#missionmischiefcoffee')) missionId = 7;
        else if (postText.includes('#missionmischiefrecycling')) missionId = 21;
        else if (postText.includes('#missionmischiefbeer')) missionId = 3;
        else if (postText.includes('#missionmischiefgas')) missionId = 6;
        else if (postText.includes('#missionmischiefgrocery')) missionId = 8;
        else if (postText.includes('#missionmischieffast')) missionId = 9;
        else if (postText.includes('#missionmischiefretail')) missionId = 10;
        else if (postText.includes('#missionmischiefbank')) missionId = 11;
        else if (postText.includes('#missionmischiefpark')) missionId = 12;
        else if (postText.includes('#missionmischiefgym')) missionId = 13;
        else if (postText.includes('#missionmischiefrestaurant')) missionId = 14;
        else if (postText.includes('#missionmischiefmovie')) missionId = 15;
        else if (postText.includes('#missionmischiefmall')) missionId = 16;
        else if (postText.includes('#missionmischiefbeach')) missionId = 17;
        else if (postText.includes('#missionmischiefhike')) missionId = 18;
        else if (postText.includes('#missionmischiefmuseum')) missionId = 19;
        else if (postText.includes('#missionmischiefzoo')) missionId = 20;
        else if (postText.includes('#missionmischiefclown')) missionId = 999; // Cheater redemption
        else if (postText.includes('#missionmischiefpaidbail')) missionId = 999; // Cheater redemption
        
        if (!missions[missionId]) {
          missions[missionId] = { instagram: 0, facebook: 0, x: 0 };
        }
        missions[missionId][platformName] = (missions[missionId][platformName] || 0) + 1;
      });
    }
  });

  // Sort leaderboard by points
  leaderboard.sort((a, b) => b.points - a.points);

  // Parse justice cases from scraped data
  const justiceCases = parseJusticeCases([facebookData, instagramData, twitterData]);

  return {
    leaderboard: leaderboard.slice(0, 50),
    geography,
    missions,
    justice: justiceCases,
    lastUpdated: new Date().toISOString()
  };
}

// Parse justice cases from social media data
function parseJusticeCases(platformData) {
  const cases = [];
  
  platformData.forEach(data => {
    if (data.data) {
      data.data.forEach((post, index) => {
        const postText = (post.message || post.text || '').toLowerCase();
        
        // Look for evidence posts
        const evidenceMatch = postText.match(/#missionmischiefevidenc([^\s]+)/);
        const accusedMatch = postText.match(/#missionmischiefaccused@([^\s]+)/);
        const missionMatch = postText.match(/#missionmischief([a-z]+)(?!evidence|accused|country|state|city|points|user)/);
        
        if (evidenceMatch && accusedMatch) {
          const caseId = `${Date.now()}-${index}`;
          const accused = `@${accusedMatch[1]}`;
          const mission = missionMatch ? missionMatch[1] : 'unknown';
          const evidenceTag = `#missionmischiefevidenc${evidenceMatch[1]}`;
          const author = post.from?.username || post.author_id || 'unknown';
          
          cases.push({
            id: caseId,
            mission: `Mission: ${mission}`,
            accused: accused,
            accuser: `@${author}`,
            evidenceHashtag: evidenceTag,
            date: new Date(post.created_time || post.created_at || Date.now()).toLocaleDateString(),
            requirements: [
              { hashtag: '#missionmischiefclown', completed: false },
              { hashtag: '#missionmischiefpaidbail', completed: false }
            ],
            status: 'pending'
          });
        }
      });
    }
  });
  
  return cases;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Credentials': 'false',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Mission Mischief hashtags to monitor
    const hashtags = [
      'missionmischief',
      'realworldgame',
      'iwillnotsuemissionmischief',
      'missionmischiefslimshady',
      'missionmischiefcoffee', 
      'missionmischiefrecycling',
      'missionmischiefqr',
      'missionmischiefbeer',
      'missionmischiefgas',
      'missionmischiefgrocery',
      'missionmischieffast',
      'missionmischiefretail',
      'missionmischiefbank',
      'missionmischiefpark',
      'missionmischiefgym',
      'missionmischiefrestaurant',
      'missionmischiefmovie',
      'missionmischiefmall',
      'missionmischiefbeach',
      'missionmischiefhike',
      'missionmischiefmuseum',
      'missionmischiefzoo'
    ];

    // Scrape all platforms for the main hashtag
    console.log('Starting Mission Mischief scraping...');
    const [facebookData, instagramData, twitterData] = await Promise.all([
      scrapeFacebook('missionmischief'),
      scrapeInstagram('missionmischief'),
      scrapeTwitter('missionmischief')
    ]);

    // Process and format the data
    const processedData = processData(facebookData, instagramData, twitterData, hashtags);
    
    // Calculate coverage statistics
    const totalPosts = Object.values(processedData.missions).reduce((sum, mission) => 
      sum + mission.instagram + mission.facebook + mission.x, 0);
    
    const coverage = {
      totalPosts,
      hashtags: hashtags.length,
      platforms: 3,
      geography: Object.keys(processedData.geography).length
    };

    console.log(`Scraping complete: ${totalPosts} posts, ${processedData.leaderboard.length} players, ${coverage.geography} locations`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: processedData,
        timestamp: new Date().toISOString(),
        source: 'real-data-env-vars',
        coverage
      })
    };

  } catch (error) {
    console.error('Lambda error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        source: 'lambda-error'
      })
    };
  }
};