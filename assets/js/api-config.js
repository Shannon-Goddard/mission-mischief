// API Configuration for Mission Mischief Scraping
class APIConfig {
  constructor() {
    this.config = {
      // Instagram Basic Display API
      instagram: {
        clientId: process.env.INSTAGRAM_CLIENT_ID || 'YOUR_INSTAGRAM_CLIENT_ID',
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || 'YOUR_INSTAGRAM_CLIENT_SECRET',
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || 'YOUR_INSTAGRAM_ACCESS_TOKEN',
        baseUrl: 'https://graph.instagram.com/v18.0',
        rateLimit: 200, // requests per hour
        endpoints: {
          hashtag: '/ig_hashtag_search',
          media: '/hashtag/{hashtag-id}/recent_media'
        }
      },
      
      // TikTok Research API
      tiktok: {
        clientKey: process.env.TIKTOK_CLIENT_KEY || 'YOUR_TIKTOK_CLIENT_KEY',
        clientSecret: process.env.TIKTOK_CLIENT_SECRET || 'YOUR_TIKTOK_CLIENT_SECRET',
        accessToken: process.env.TIKTOK_ACCESS_TOKEN || 'YOUR_TIKTOK_ACCESS_TOKEN',
        baseUrl: 'https://open.tiktokapis.com/v2',
        rateLimit: 1000, // requests per day
        endpoints: {
          hashtag: '/research/video/query/',
          user: '/research/user/info/'
        }
      },
      
      // Facebook Graph API
      facebook: {
        appId: process.env.FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID',
        appSecret: process.env.FACEBOOK_APP_SECRET || 'YOUR_FACEBOOK_APP_SECRET',
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN || 'YOUR_FACEBOOK_ACCESS_TOKEN',
        baseUrl: 'https://graph.facebook.com/v18.0',
        rateLimit: 600, // requests per hour
        endpoints: {
          search: '/search',
          posts: '/posts'
        }
      },
      
      // X (Twitter) API v2
      twitter: {
        bearerToken: process.env.TWITTER_BEARER_TOKEN || 'YOUR_TWITTER_BEARER_TOKEN',
        apiKey: process.env.TWITTER_API_KEY || 'YOUR_TWITTER_API_KEY',
        apiSecret: process.env.TWITTER_API_SECRET || 'YOUR_TWITTER_API_SECRET',
        baseUrl: 'https://api.twitter.com/2',
        rateLimit: 300, // requests per 15 minutes
        endpoints: {
          search: '/tweets/search/recent',
          users: '/users/by/username'
        }
      }
    };
    
    this.rateLimiters = new Map();
    this.initializeRateLimiters();
  }
  
  initializeRateLimiters() {
    Object.keys(this.config).forEach(platform => {
      this.rateLimiters.set(platform, {
        requests: 0,
        resetTime: Date.now() + (60 * 60 * 1000) // 1 hour from now
      });
    });
  }
  
  getConfig(platform) {
    return this.config[platform];
  }
  
  async checkRateLimit(platform) {
    const limiter = this.rateLimiters.get(platform);
    const config = this.config[platform];
    
    if (!limiter || !config) return false;
    
    // Reset counter if time window has passed
    if (Date.now() > limiter.resetTime) {
      limiter.requests = 0;
      limiter.resetTime = Date.now() + (60 * 60 * 1000);
    }
    
    // Check if we're under the rate limit
    if (limiter.requests >= config.rateLimit) {
      const waitTime = limiter.resetTime - Date.now();
      throw new Error(`Rate limit exceeded for ${platform}. Wait ${Math.ceil(waitTime / 1000 / 60)} minutes.`);
    }
    
    limiter.requests++;
    return true;
  }
  
  buildUrl(platform, endpoint, params = {}) {
    const config = this.getConfig(platform);
    if (!config) throw new Error(`Unknown platform: ${platform}`);
    
    let url = config.baseUrl + config.endpoints[endpoint];
    
    // Replace path parameters
    Object.keys(params).forEach(key => {
      url = url.replace(`{${key}}`, params[key]);
    });
    
    return url;
  }
  
  getHeaders(platform) {
    const config = this.getConfig(platform);
    if (!config) return {};
    
    switch (platform) {
      case 'instagram':
        return {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        };
        
      case 'tiktok':
        return {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        };
        
      case 'facebook':
        return {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        };
        
      case 'twitter':
        return {
          'Authorization': `Bearer ${config.bearerToken}`,
          'Content-Type': 'application/json'
        };
        
      default:
        return {};
    }
  }
}

// Export singleton instance
window.APIConfig = new APIConfig();