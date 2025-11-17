// Beer Justice AWS Sync - Global multiplayer trials
class BeerJusticeAWS {
    constructor() {
        this.apiBase = 'https://ws2qwehovl.execute-api.us-east-1.amazonaws.com/prod';
    }
    
    async createTrial(trialData) {
        try {
            const response = await fetch(`${this.apiBase}/create-trial`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trialData)
            });
            
            const result = await response.json();
            
            if (result.trial_id) {
                // Also store locally for offline access
                if (typeof Storage !== 'undefined') {
                    Storage.createTrial(result.trial_data);
                }
                return result;
            } else {
                throw new Error(result.error || 'Failed to create trial');
            }
        } catch (error) {
            console.error('AWS trial creation failed:', error);
            // Fallback to local storage
            if (typeof Storage !== 'undefined') {
                return Storage.createTrial(trialData);
            }
            throw error;
        }
    }
    
    async castVote(trialId, verdict, voter) {
        try {
            const response = await fetch(`${this.apiBase}/cast-vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trial_id: trialId,
                    verdict: verdict,
                    voter: voter
                })
            });
            
            const result = await response.json();
            
            if (result.message) {
                // Update local storage with AWS data
                if (typeof Storage !== 'undefined') {
                    Storage.updateTrial(trialId, result.trial_data);
                }
                return result;
            } else {
                throw new Error(result.error || 'Failed to cast vote');
            }
        } catch (error) {
            console.error('AWS vote casting failed:', error);
            // Fallback to local storage
            if (typeof Storage !== 'undefined') {
                return Storage.castVote(trialId, verdict, voter);
            }
            throw error;
        }
    }
    
    async getActiveTrials() {
        try {
            const response = await fetch(`${this.apiBase}/get-trials`);
            const result = await response.json();
            
            if (result.trials) {
                // Sync with local storage
                if (typeof Storage !== 'undefined') {
                    result.trials.forEach(trial => {
                        Storage.updateTrial(trial.trial_id, trial);
                    });
                }
                return result.trials;
            }
        } catch (error) {
            console.error('AWS trials fetch failed:', error);
        }
        
        // Fallback to local storage
        if (typeof Storage !== 'undefined') {
            return Storage.getActiveTrials();
        }
        return [];
    }
    
    async getHonorScore(userHandle) {
        try {
            const response = await fetch(`${this.apiBase}/get-honor?user=${userHandle}`);
            const result = await response.json();
            
            if (result.honor_score !== undefined) {
                // Update local storage
                if (typeof Storage !== 'undefined') {
                    const user = Storage.getUser(userHandle);
                    user.honorScore = result.honor_score;
                    Storage.saveUser(user);
                }
                return result.honor_score;
            }
        } catch (error) {
            console.error('AWS honor fetch failed:', error);
        }
        
        // Fallback to local storage
        if (typeof Storage !== 'undefined') {
            const user = Storage.getUser(userHandle);
            return user.honorScore || 100;
        }
        return 100;
    }
    
    async getBeerDebts(userHandle) {
        try {
            const response = await fetch(`${this.apiBase}/get-debts?user=${userHandle}`);
            const result = await response.json();
            
            if (result.debts) {
                // Update local storage
                if (typeof Storage !== 'undefined') {
                    Storage.saveBeerDebts(userHandle, result.debts);
                }
                return result.debts;
            }
        } catch (error) {
            console.error('AWS debts fetch failed:', error);
        }
        
        // Fallback to local storage
        if (typeof Storage !== 'undefined') {
            return Storage.getBeerDebts(userHandle);
        }
        return [];
    }
    
    async markDebtPaid(debtId) {
        try {
            const response = await fetch(`${this.apiBase}/mark-paid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ debt_id: debtId })
            });
            
            const result = await response.json();
            
            if (result.message) {
                return result;
            } else {
                throw new Error(result.error || 'Failed to mark debt paid');
            }
        } catch (error) {
            console.error('AWS debt marking failed:', error);
            throw error;
        }
    }
}

// Global instance - wait for Storage to be available
if (typeof Storage !== 'undefined') {
    window.BeerJusticeAWS = new BeerJusticeAWS();
} else {
    // Wait for Storage to load
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof Storage !== 'undefined') {
            window.BeerJusticeAWS = new BeerJusticeAWS();
        } else {
            console.error('Storage not available - BeerJusticeAWS fallback mode');
            // Create minimal fallback
            window.BeerJusticeAWS = {
                apiBase: 'https://ws2qwehovl.execute-api.us-east-1.amazonaws.com/prod',
                async getHonorScore() { return 100; },
                async createTrial() { throw new Error('Storage not available'); },
                async getActiveTrials() { return []; },
                async castVote() { throw new Error('Storage not available'); }
            };
        }
    });
}

// Debug function
window.testAWSConnection = async function() {
    console.log('🧪 Testing AWS connection...');
    try {
        const response = await fetch('https://ws2qwehovl.execute-api.us-east-1.amazonaws.com/prod/get-honor?user=testuser');
        const data = await response.json();
        console.log('✅ Direct API test:', data);
        return data;
    } catch (error) {
        console.error('❌ Direct API test failed:', error);
        throw error;
    }
};