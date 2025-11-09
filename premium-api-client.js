/**
 * Mission Mischief Premium API Client
 * Clean integration with bulletproof premium scraper system
 */

class PremiumApiClient {
    constructor() {
        this.primaryEndpoint = 'https://scraper.missionmischief.online/scrape';
        this.fallbackEndpoint = 'https://56uo9dqgte.execute-api.us-east-1.amazonaws.com/prod/scrape';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async getData() {
        const cacheKey = 'premium-data';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log('📦 Using cached premium data');
            return cached.data;
        }

        // Try primary endpoint first
        try {
            console.log('🚀 Fetching fresh data from premium API...');
            const result = await this.fetchFromEndpoint(this.primaryEndpoint);
            
            if (result.success && result.data) {
                this.cache.set(cacheKey, {
                    data: result.data,
                    timestamp: Date.now()
                });
                console.log('✅ Premium data loaded successfully');
                return result.data;
            } else {
                throw new Error(result.error || 'No data received');
            }
            
        } catch (error) {
            console.error('❌ Primary endpoint failed:', error);
            
            // Try direct API Gateway endpoint
            if (this.fallbackEndpoint) {
                console.log('🔄 Custom domain failed, trying direct API Gateway...');
                try {
                    console.log('🔄 Trying fallback endpoint...');
                    const result = await this.fetchFromEndpoint(this.fallbackEndpoint);
                    
                    if (result.success && result.data) {
                        this.cache.set(cacheKey, {
                            data: result.data,
                            timestamp: Date.now()
                        });
                        console.log('✅ Fallback endpoint successful');
                        return result.data;
                    }
                } catch (fallbackError) {
                    console.error('❌ Fallback endpoint also failed:', fallbackError);
                }
            }
            
            // Return fallback data structure
            return this.getFallbackData();
        }
    }

    async fetchFromEndpoint(endpoint) {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`API responded with ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    async testScraper() {
        try {
            console.log('🧪 Testing premium scraper...');
            const result = await this.fetchFromEndpoint(this.primaryEndpoint);
            console.log('🔬 Test result:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Test failed:', error);
            return { success: false, error: error.message };
        }
    }

    setFallbackEndpoint(endpoint) {
        this.fallbackEndpoint = endpoint;
        console.log('🔧 Fallback endpoint set:', endpoint);
    }

    getFallbackData() {
        console.log('🔄 Using fallback data structure');
        return {
            leaderboard: [],
            geography: {},
            missions: {},
            justice: [],
            lastUpdated: new Date().toISOString(),
            source: 'fallback',
            stats: {
                posts_processed: 0,
                posts_verified: 0,
                verification_rate: 0
            }
        };
    }

    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }
}

// Global instance
const premiumApi = new PremiumApiClient();

// Auto-integration with existing UI
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎭 Premium API Client loaded');
    
    // Replace old scraper calls if they exist
    if (window.updateLeaderboard) {
        const originalUpdate = window.updateLeaderboard;
        window.updateLeaderboard = async function() {
            try {
                const data = await premiumApi.getData();
                if (data.leaderboard && data.leaderboard.length > 0) {
                    // Use premium data
                    displayLeaderboard(data.leaderboard);
                    updateGeography(data.geography);
                    updateMissions(data.missions);
                } else {
                    // Fallback to original method
                    originalUpdate();
                }
            } catch (error) {
                console.error('Premium update failed, using fallback:', error);
                originalUpdate();
            }
        };
    }
});