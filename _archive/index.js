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
        
        // Track mission activity - look for any mission mischief hashtag
        const postText = (post.message || post.text || '').toLowerCase();
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
          
          // Add points to user
          if (existingPlayer) {
            existingPlayer.points += points;
          }
        }
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
    const [facebookData, instagramData, twitterData] = await Promise.all([
      scrapeFacebook(mainHashtag),
      scrapeInstagram(mainHashtag),
      scrapeTwitter(mainHashtag)
    ]);

    // Process and return data
    const processedData = processData(facebookData, instagramData, twitterData, hashtags);
    
    console.log(`🕵️ Justice cases found: ${processedData.justice.length}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: processedData,
        timestamp: new Date().toISOString(),
        source: 'bulletproof-lambda',
        coverage: {
          totalPosts: processedData.totalPosts || 0,
          hashtags: hashtags.length,
          platforms: 3
        }
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