/**
 * Mission Mischief Premium API Client
 * Clean integration with bulletproof premium scraper system
 */

class PremiumApiClient {
    constructor() {
        this.apiEndpoint = 'https://scraper.missionmischief.online/scrape';
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

        try {
            console.log('🚀 Fetching fresh data from premium API...');
            const response = await fetch(this.apiEndpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API responded with ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                // Cache the successful result
                this.cache.set(cacheKey, {
                    data: result.data,
                    timestamp: Date.now()
                });
                
                console.log('✅ Premium data loaded successfully');
                return result.data;
            } else {
                throw new Error(result.error || 'Unknown API error');
            }
            
        } catch (error) {
            console.error('❌ Premium API error:', error);
            
            // Return fallback data structure
            return this.getFallbackData();
        }
    }

    async testScraper() {
        try {
            console.log('🧪 Testing premium scraper...');
            const response = await fetch(this.apiEndpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();
            console.log('🔬 Test result:', result);
            return result;
            
        } catch (error) {
            console.error('❌ Test failed:', error);
            return { success: false, error: error.message };
        }
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