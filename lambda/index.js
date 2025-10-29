const AWS = require('aws-sdk');
const https = require('https');

const ssm = new AWS.SSM();

// Get parameter from Parameter Store
async function getParameter(name) {
  const params = {
    Name: name,
    WithDecryption: true
  };
  const result = await ssm.getParameter(params).promise();
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
        // Extract user handle and engagement
        const handle = post.from?.username || post.author_id || 'unknown';
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
        
        // Track mission activity
        hashtags.forEach((hashtag, missionId) => {
          if (post.message?.includes(`#${hashtag}`) || post.text?.includes(`#${hashtag}`)) {
            if (!missions[missionId + 1]) missions[missionId + 1] = {};
            missions[missionId + 1][platformName] = (missions[missionId + 1][platformName] || 0) + 1;
          }
        });
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
      'missionmischiefclown',
      'missionmischiefpaidbaler',
      'missionmischiefevidencestagedphotowithwrongbook'
    ];

    // Scrape all platforms
    const [facebookData, instagramData, twitterData] = await Promise.all([
      scrapeFacebook(hashtags[0]),
      scrapeInstagram(hashtags[0]),
      scrapeTwitter(hashtags[0])
    ]);

    // Process and return data
    const processedData = processData(facebookData, instagramData, twitterData, hashtags);

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