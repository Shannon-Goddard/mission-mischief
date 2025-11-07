/**
 * Mission Mischief Premium API Client
 * Replaces the complex three-layer scraper system
 */

class PremiumApiClient {
    constructor() {
        // Production endpoint
        this.apiEndpoint = 'https://scraper.missionmischief.online/scrape';
        this.lambdaEndpoint = null; // Using custom domain only
        
        this.cache = {
            data: null,
            timestamp: null,
            ttl: 5 * 60 * 1000 // 5 minutes cache
        };
    }

    /**
     * Get latest Mission Mischief data
     * @param {boolean} forceRefresh - Skip cache and fetch fresh data
     * @returns {Promise<Object>} Processed game data
     */
    async getData(forceRefresh = false) {
        console.log('🎯 Premium API: Fetching Mission Mischief data...');

        // Check cache first
        if (!forceRefresh && this.isCacheValid()) {
            console.log('📋 Using cached data');
            return this.cache.data;
        }

        try {
            // Try API Gateway endpoint first
            let data = await this.fetchFromEndpoint(this.apiEndpoint);
            
            if (!data) {
                // Fallback to direct Lambda if API Gateway fails
                console.log('🔄 API Gateway failed, trying direct Lambda...');
                data = await this.fetchFromEndpoint(this.lambdaEndpoint);
            }

            if (data && data.success) {
                // Cache successful response
                this.cache.data = data.data;
                this.cache.timestamp = Date.now();
                
                console.log('✅ Premium API: Data fetched successfully');
                console.log(`📊 Stats: ${data.data.stats?.posts_verified || 0} verified posts, ${data.data.leaderboard?.length || 0} players`);
                
                return data.data;
            } else {
                throw new Error('Invalid response from premium API');
            }

        } catch (error) {
            console.error('❌ Premium API: Failed to fetch data:', error);
            
            // Return cached data if available, even if stale
            if (this.cache.data) {
                console.log('📋 Using stale cached data due to API failure');
                return this.cache.data;
            }
            
            // Return empty data structure as fallback
            return this.getEmptyDataStructure();
        }
    }

    /**
     * Fetch data from a specific endpoint
     * @param {string} endpoint - API endpoint URL
     * @returns {Promise<Object|null>} Response data or null if failed
     */
    async fetchFromEndpoint(endpoint) {
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.warn(`Endpoint ${endpoint} failed:`, error.message);
            return null;
        }
    }

    /**
     * Check if cached data is still valid
     * @returns {boolean} True if cache is valid
     */
    isCacheValid() {
        return this.cache.data && 
               this.cache.timestamp && 
               (Date.now() - this.cache.timestamp) < this.cache.ttl;
    }

    /**
     * Get empty data structure for fallback
     * @returns {Object} Empty Mission Mischief data structure
     */
    getEmptyDataStructure() {
        return {
            leaderboard: [],
            geography: {},
            missions: {},
            justice: [],
            lastUpdated: new Date().toISOString(),
            source: 'fallback-empty',
            stats: {
                posts_processed: 0,
                posts_verified: 0,
                verification_rate: 0
            }
        };
    }

    /**
     * Get system status and health metrics
     * @returns {Promise<Object>} System status information
     */
    async getSystemStatus() {
        try {
            const data = await this.getData();
            const lastUpdate = new Date(data.lastUpdated);
            const hoursAgo = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);

            return {
                status: hoursAgo < 25 ? 'healthy' : 'stale', // Data should be < 25 hours old
                lastUpdate: data.lastUpdated,
                hoursAgo: Math.round(hoursAgo * 10) / 10,
                stats: data.stats,
                source: data.source,
                nextUpdate: this.getNextUpdateTime()
            };

        } catch (error) {
            return {
                status: 'error',
                error: error.message,
                lastUpdate: null,
                hoursAgo: null,
                stats: null
            };
        }
    }

    /**
     * Calculate next scheduled update time (3:00 AM PST)
     * @returns {string} Next update time in ISO format
     */
    getNextUpdateTime() {
        const now = new Date();
        const pstOffset = -8; // PST is UTC-8
        
        // Convert to PST
        const pstNow = new Date(now.getTime() + (pstOffset * 60 * 60 * 1000));
        
        // Set to 3:00 AM PST
        const nextUpdate = new Date(pstNow);
        nextUpdate.setHours(3, 0, 0, 0);
        
        // If it's already past 3 AM today, set for tomorrow
        if (pstNow.getHours() >= 3) {
            nextUpdate.setDate(nextUpdate.getDate() + 1);
        }
        
        // Convert back to local time
        return new Date(nextUpdate.getTime() - (pstOffset * 60 * 60 * 1000)).toISOString();
    }

    /**
     * Test the scraper endpoint directly
     * @returns {Promise<Object>} Test result
     */
    async testScraper() {
        console.log('🧪 Testing premium scraper...');
        
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            console.log('🔬 Test result:', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Test failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Clear cache and force fresh data on next request
     */
    clearCache() {
        this.cache.data = null;
        this.cache.timestamp = null;
        console.log('🗑️ Premium API: Cache cleared');
    }

    /**
     * Update API endpoints after deployment
     * @param {string} apiGatewayUrl - API Gateway endpoint
     * @param {string} lambdaUrl - Direct Lambda URL (optional)
     */
    updateEndpoints(apiGatewayUrl, lambdaUrl = null) {
        this.apiEndpoint = apiGatewayUrl;
        if (lambdaUrl) {
            this.lambdaEndpoint = lambdaUrl;
        }
        this.clearCache(); // Clear cache when endpoints change
        console.log('🔄 Premium API: Endpoints updated');
    }
}

// Global instance
const premiumApi = new PremiumApiClient();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumApiClient;
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Premium API Client initialized');
    
    // Update global mockData with real data
    premiumApi.getData().then(data => {
        if (window.mockData && data) {
            window.mockData.topPlayers = data.leaderboard?.slice(0, 3) || [];
            window.mockData.geography = data.geography || {};
            window.mockData.missionActivity = data.missions || {};
            window.mockData.justiceCases = data.justice || [];
            window.mockData.lastUpdated = new Date(data.lastUpdated).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }) + ' ' + new Date(data.lastUpdated).toLocaleTimeString('en-US');
            
            console.log('📊 Global mockData updated with premium API data');
            
            // Trigger UI updates if functions exist
            if (typeof loadTopPlayers === 'function') loadTopPlayers();
            if (typeof loadGeography === 'function') loadGeography();
            if (typeof loadMissions === 'function') loadMissions();
            if (typeof loadJusticeCases === 'function') loadJusticeCases();
        }
    }).catch(error => {
        console.warn('⚠️ Failed to load initial data:', error);
    });
});