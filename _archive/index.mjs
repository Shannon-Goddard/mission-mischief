import { SSM } from '@aws-sdk/client-ssm';
import https from 'https';

const ssm = new SSM();

// Get parameter from Parameter Store
async function getParameter(name) {
  const params = {
    Name: name,
    WithDecryption: true
  };
  const result = await ssm.getParameter(params);
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
        // Extract user handle from hashtags first, then fallback to API data
        const postText = (post.message || post.text || '').toLowerCase();
        let handle = 'unknown';
        
        // Look for structured username hashtag #missionmischiefuser[username]
        const userMatch = postText.match(/#missionmischiefuser([a-z]+)/);
        if (userMatch) {
          handle = userMatch[1];
        } else {
          // Fallback: Look for standalone username hashtags like #casper, #annie
          const usernameMatch = postText.match(/#([a-z]+)(?!missionmischief)/);
          if (usernameMatch && !usernameMatch[1].startsWith('missionmischief')) {
            handle = usernameMatch[1];
          } else {
            // Final fallback to API username data
            handle = post.from?.username || post.username || 'unknown';
            if (handle === 'unknown' && post.author_id) {
              handle = `User_${post.author_id.slice(-8)}`;
            }
          }
        }
        const engagement = post.likes?.summary?.total_count || post.public_metrics?.like_count || 0;
        
        // Add to leaderboard
        const existingPlayer = leaderboard.find(p => p.handle === `@${handle}`);
        if (existingPlayer) {
          existingPlayer.points += engagement;
        } else {
          leaderboard.push({
            handle: `@${handle}`,
            points: engagement,
            city: 'Unknown',
            state: 'Unknown'
          });
        }
        
        // Track mission activity - look for any mission mischief hashtag
        if (postText.includes('#missionmischief')) {
          // Default to mission 1 if no specific mission found
          let missionId = 1;
          
          // Try to identify specific mission from hashtags
          if (postText.includes('#iwillnotsuemissionmischief')) missionId = 1;
          else if (postText.includes('#missionmischiefslimshady')) missionId = 5;
          else if (postText.includes('#missionmischiefcoffee')) missionId = 7;
          else if (postText.includes('#missionmischiefrecycling')) missionId = 21;
          else if (postText.includes('#missionmischiefbeer')) missionId = 3;
          else if (postText.includes('#missionmischiefclown')) missionId = 999; // Cheater redemption
          else if (postText.includes('#missionmischiefpaidbail')) missionId = 999; // Cheater redemption
          
          // Extract points from hashtag if present
          const pointsMatch = postText.match(/#missionmischiefpoints(\d+)/);
          const points = pointsMatch ? parseInt(pointsMatch[1]) : 1;
          
          if (!missions[missionId]) {
            missions[missionId] = { instagram: 0, facebook: 0, x: 0 };
          }
          missions[missionId][platformName] = (missions[missionId][platformName] || 0) + 1;
          
          // Extract location from hashtags
          const cityMatch = postText.match(/#missionmischiefcity([a-z]+)/);
          const stateMatch = postText.match(/#missionmischiefstate([a-z]+)/);
          
          if (cityMatch && stateMatch) {
            const city = cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1);
            const state = stateMatch[1].toUpperCase();
            
            if (!geography[state]) geography[state] = {};
            geography[state][city] = (geography[state][city] || 0) + 1;
            
            // Update user location
            if (existingPlayer) {
              existingPlayer.city = city;
              existingPlayer.state = state;
              existingPlayer.points += points;
            } else {
              leaderboard.push({
                handle: `@${handle}`,
                points: points,
                city: city,
                state: state
              });
            }
          } else {
            // Add points to user without location
            if (existingPlayer) {
              existingPlayer.points += points;
            }
          }
        }
      });
    }
  });

  // Sort leaderboard by points
  leaderboard.sort((a, b) => b.points - a.points);

  return {
    leaderboard: leaderboard.slice(0, 50),
    geography,
    missions,
    justice,
    lastUpdated: new Date().toISOString()
  };
}

export const handler = async (event) => {
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
    console.log('Lambda function started');
    
    // Mission Mischief hashtags to monitor (from HASHTAG_LIST.txt)
    const hashtags = [
      // Core hashtags
      'missionmischief',
      'realworldgame',
      'iwillnotsuemissionmischief',
      
      // Mission-specific hashtags
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
      'missionmischiefzoo',
      'missionmischiefconcert',
      'missionmischiefwedding',
      'missionmischiefgraduation',
      'missionmischiefbirthday',
      'missionmischiefholiday',
      'missionmischiefwork',
      'missionmischiefschool',
      'missionmischiefchurch',
      'missionmischiefairport',
      'missionmischiefhotel',
      'missionmischiefuber',
      'missionmischiefpublic',
      'missionmischieflaundry',
      'missionmischiefbarber',
      'missionmischiefnail',
      'missionmischiefvet',
      'missionmischiefpharmacy',
      'missionmischiefdentist',
      'missionmischiefdoctor',
      'missionmischiefpost',
      'missionmischiefcourt',
      'missionmischiefdmv',
      'missionmischiefpolice',
      'missionmischieffire',
      'missionmischiefhospital',
      'missionmischiefnursing',
      'missionmischiefffuneral',
      'missionmischiefcemetery',
      'missionmischiefprison',
      'missionmischiefrehab',
      'missionmischieffinale',
      'missionmischiefbonus',
      
      // Justice system hashtags
      'missionmischiefevidenceyourmessage',
      'missionmischiefevidencestagedphotowithwrongbook',
      
      // Cheater redemption hashtags
      'missionmischiefclown',
      'missionmischiefpaidbail',
      
      // Special event hashtags
      'missionmischiefhalloween',
      'missionmischiefchristmas',
      'missionmischiefnewyear',
      'missionmischiefvalentines',
      'missionmischief4thofjuly',
      
      // Bonus hashtags
      'missionmischiefviral',
      'missionmischieflegendary',
      'missionmischiefepic',
      'missionmischiefinsane',
      'missionmischiefcrazy'
    ];

    // Scrape all platforms for main hashtag
    const mainHashtag = 'missionmischief';
    console.log('Scraping hashtag:', mainHashtag);
    
    const [facebookData, instagramData, twitterData] = await Promise.all([
      scrapeFacebook(mainHashtag),
      scrapeInstagram(mainHashtag),
      scrapeTwitter(mainHashtag)
    ]);
    
    console.log('Facebook data:', JSON.stringify(facebookData, null, 2));
    console.log('Instagram data:', JSON.stringify(instagramData, null, 2));
    console.log('Twitter data:', JSON.stringify(twitterData, null, 2));

    // Process and return data
    const processedData = processData(facebookData, instagramData, twitterData, hashtags);
    console.log('Processed data:', JSON.stringify(processedData, null, 2));
    
    // If no data found, return mock data for testing
    if (processedData.leaderboard.length === 0) {
      console.log('No real data found, returning mock data');
      processedData.leaderboard = [
        { handle: '@casper', points: 3, city: 'Los Angeles', state: 'CA' }
      ];
      processedData.missions = { '5': { instagram: 1, facebook: 1, x: 1 } };
      processedData.geography = { 'CA': { 'Los Angeles': 1 } };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: processedData,
        timestamp: new Date().toISOString()
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
        timestamp: new Date().toISOString()
      })
    };
  }
};