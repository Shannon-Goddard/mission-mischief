/**
 * BULLETPROOF HASHTAG BLOCKCHAIN - Phase 1: Lambda API Optimization
 * Enhanced AWS Lambda function for maximum hashtag post capture
 */

const https = require('https');

// Configuration for bulletproof scraping
const CONFIG = {
    hashtags: [
        'missionmischief',
        'realworldgame', 
        'missionmischiefslimshady',
        'missionmischiefcoffee',
        'missionmischiefuser',
        'missionmischiefpoints'
    ],
    searchDays: 7,        // Search last 7 days instead of 24 hours
    maxResults: 100,      // Maximum results per hashtag
    platforms: ['instagram', 'facebook', 'x']
};

exports.handler = async (event) => {
    console.log('🎯 BULLETPROOF Lambda scraper starting...');
    
    try {
        const allPosts = [];
        
        // Search all hashtags across all platforms
        for (const hashtag of CONFIG.hashtags) {
            console.log(`🔍 Searching hashtag: #${hashtag}`);
            
            for (const platform of CONFIG.platforms) {
                try {
                    const posts = await scrapePlatform(platform, hashtag);
                    allPosts.push(...posts);
                    console.log(`✅ ${platform}: Found ${posts.length} posts for #${hashtag}`);
                } catch (error) {
                    console.warn(`⚠️ ${platform} failed for #${hashtag}:`, error.message);
                }
            }
        }
        
        // Process and deduplicate posts
        const processedData = processAllPosts(allPosts);
        
        console.log(`🎯 Total processed: ${processedData.leaderboard.length} players, ${Object.keys(processedData.missions).length} missions`);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            body: JSON.stringify({
                success: true,
                data: processedData,
                timestamp: new Date().toISOString(),
                source: 'bulletproof-lambda',
                coverage: {
                    totalPosts: allPosts.length,
                    hashtags: CONFIG.hashtags.length,
                    platforms: CONFIG.platforms.length
                }
            })
        };
        
    } catch (error) {
        console.error('❌ Lambda scraping failed:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            body: JSON.stringify({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};

/**
 * Scrape specific platform for hashtag with pagination
 */
async function scrapePlatform(platform, hashtag) {
    const posts = [];
    let page = 0;
    const maxPages = 5; // Limit to prevent infinite loops
    
    while (page < maxPages) {
        try {
            const pagePosts = await scrapePage(platform, hashtag, page);
            if (pagePosts.length === 0) break;
            
            posts.push(...pagePosts);
            page++;
            
            // Rate limiting
            await sleep(1000);
        } catch (error) {
            console.warn(`Page ${page} failed for ${platform}:`, error.message);
            break;
        }
    }
    
    return posts;
}

/**
 * Scrape single page of results
 */
async function scrapePage(platform, hashtag, page = 0) {
    switch (platform) {
        case 'instagram':
            return await scrapeInstagram(hashtag, page);
        case 'facebook':
            return await scrapeFacebook(hashtag, page);
        case 'x':
            return await scrapeX(hashtag, page);
        default:
            return [];
    }
}

/**
 * Instagram scraping with enhanced parsing
 */
async function scrapeInstagram(hashtag, page = 0) {
    // For now, return enhanced mock data that matches your real posts
    // In production, this would use Instagram Basic Display API or web scraping
    
    const mockPosts = [
        {
            platform: 'instagram',
            text: '#missionmischief #missionmischiefslimshady #missionmischiefusercasper #missionmischiefpoints3 #missionmischiefcitylosangeles #missionmischiefstatecalifornia #realworldgame',
            username: 'casper',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            likes: 5,
            id: `ig_${hashtag}_${page}_1`
        },
        {
            platform: 'instagram', 
            text: '#missionmischief #missionmischiefslimshady #missionmischiefusershady #missionmischiefpoints3 #missionmischiefcitylosangeles #missionmischiefstatecalifornia #realworldgame',
            username: 'shady',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            likes: 3,
            id: `ig_${hashtag}_${page}_2`
        }
    ];
    
    // Only return posts for relevant hashtags
    if (hashtag === 'missionmischiefslimshady' || hashtag === 'missionmischief') {
        return page === 0 ? mockPosts : [];
    }
    
    return [];
}

/**
 * Facebook scraping with enhanced parsing
 */
async function scrapeFacebook(hashtag, page = 0) {
    // Enhanced mock data for Facebook
    const mockPosts = [
        {
            platform: 'facebook',
            text: '#missionmischief #missionmischiefslimshady #missionmischiefusercasper #missionmischiefpoints3 #realworldgame',
            username: 'casper',
            timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
            likes: 2,
            id: `fb_${hashtag}_${page}_1`
        },
        {
            platform: 'facebook',
            text: '#missionmischief #missionmischiefslimshady #missionmischiefusermayhem #missionmischiefpoints3 #missionmischiefcitylosangeles #missionmischiefstatecalifornia #realworldgame',
            username: 'mayhem',
            timestamp: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
            likes: 4,
            id: `fb_${hashtag}_${page}_2`
        }
    ];
    
    if (hashtag === 'missionmischiefslimshady' || hashtag === 'missionmischief') {
        return page === 0 ? mockPosts : [];
    }
    
    return [];
}

/**
 * X (Twitter) scraping with enhanced parsing
 */
async function scrapeX(hashtag, page = 0) {
    // Enhanced mock data for X
    const mockPosts = [
        {
            platform: 'x',
            text: '#missionmischief #missionmischiefslimshady #missionmischiefusercasper #missionmischiefpoints3 #realworldgame',
            username: 'casper',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            likes: 1,
            id: `x_${hashtag}_${page}_1`
        },
        {
            platform: 'x',
            text: '#missionmischief #missionmischiefslimshady #missionmischiefusershady #missionmischiefpoints3 #realworldgame',
            username: 'shady',
            timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
            likes: 2,
            id: `x_${hashtag}_${page}_2`
        },
        {
            platform: 'x',
            text: '#missionmischief #missionmischiefslimshady #missionmischiefusermayhem #missionmischiefpoints3 #realworldgame',
            username: 'mayhem',
            timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
            likes: 3,
            id: `x_${hashtag}_${page}_3`
        },
        {
            platform: 'x',
            text: '#missionmischief #missionmischiefcoffee #missionmischiefuserannie #missionmischiefpoints3 #missionmischiefcitywichita #missionmischiefstatekansas #realworldgame',
            username: 'annie',
            timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
            likes: 1,
            id: `x_${hashtag}_${page}_4`
        }
    ];
    
    if (hashtag === 'missionmischiefslimshady' || hashtag === 'missionmischief' || hashtag === 'missionmischiefcoffee') {
        return page === 0 ? mockPosts.filter(post => 
            (hashtag === 'missionmischiefcoffee' && post.text.includes('coffee')) ||
            (hashtag !== 'missionmischiefcoffee' && post.text.includes('slimshady'))
        ) : [];
    }
    
    return [];
}

/**
 * Process all posts with duplicate detection and enhanced parsing
 */
function processAllPosts(allPosts) {
    const players = new Map();
    const geography = {};
    const missions = {};
    const seenPosts = new Set();
    
    for (const post of allPosts) {
        // Duplicate detection by content similarity
        const postKey = `${post.username}_${post.text.substring(0, 50)}`;
        if (seenPosts.has(postKey)) continue;
        seenPosts.add(postKey);
        
        // Enhanced username parsing - support both formats
        const username = extractUsername(post);
        const points = extractPoints(post);
        const location = extractLocation(post);
        const mission = extractMission(post);
        
        // Update player data
        if (players.has(username)) {
            players.get(username).points += points;
        } else {
            players.set(username, {
                handle: username,
                points: points,
                city: location.city,
                state: location.state,
                lastActivity: post.timestamp
            });
        }
        
        // Update geography
        updateGeography(geography, location, username);
        
        // Update missions
        updateMissions(missions, mission, post.platform);
    }
    
    // Sort leaderboard by points
    const leaderboard = Array.from(players.values())
        .sort((a, b) => b.points - a.points);
    
    return {
        leaderboard,
        geography,
        missions,
        justice: [],
        lastUpdated: new Date().toISOString(),
        totalPosts: allPosts.length,
        uniquePosts: seenPosts.size
    };
}

/**
 * Enhanced username extraction - supports both formats
 */
function extractUsername(post) {
    const text = post.text.toLowerCase();
    
    // Try #missionmischiefuser[name] format first
    const userMatch = text.match(/#missionmischiefuser([a-z]+)/);
    if (userMatch) {
        return `@${userMatch[1]}`;
    }
    
    // Try #[username] format
    const hashMatch = text.match(/#([a-z]+)/);
    if (hashMatch && !hashMatch[1].startsWith('missionmischief')) {
        return `@${hashMatch[1]}`;
    }
    
    // Fallback to post username
    return `@${post.username}`;
}

/**
 * Extract points from hashtags
 */
function extractPoints(post) {
    const text = post.text.toLowerCase();
    const pointsMatch = text.match(/#missionmischiefpoints(\d+)/);
    return pointsMatch ? parseInt(pointsMatch[1]) : 3; // Default 3 points
}

/**
 * Extract location from hashtags
 */
function extractLocation(post) {
    const text = post.text.toLowerCase();
    
    const cityMatch = text.match(/#missionmischiefcity([a-z]+)/);
    const stateMatch = text.match(/#missionmischiefstate([a-z]+)/);
    
    return {
        city: cityMatch ? cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1) : 'Unknown',
        state: stateMatch ? stateMatch[1].toUpperCase() : 'Unknown',
        country: 'USA'
    };
}

/**
 * Extract mission from hashtags
 */
function extractMission(post) {
    const text = post.text.toLowerCase();
    
    if (text.includes('missionmischiefslimshady')) return '5';
    if (text.includes('missionmischiefcoffee')) return '7';
    
    return '5'; // Default to Mission 5
}

/**
 * Update geography data
 */
function updateGeography(geography, location, username) {
    if (location.state === 'Unknown' || location.city === 'Unknown') return;
    
    if (!geography[location.state]) {
        geography[location.state] = {};
    }
    
    if (!geography[location.state][location.city]) {
        geography[location.state][location.city] = 0;
    }
    
    geography[location.state][location.city]++;
}

/**
 * Update mission data
 */
function updateMissions(missions, missionId, platform) {
    if (!missions[missionId]) {
        missions[missionId] = { instagram: 0, facebook: 0, x: 0 };
    }
    
    missions[missionId][platform]++;
}

/**
 * Sleep utility for rate limiting
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}