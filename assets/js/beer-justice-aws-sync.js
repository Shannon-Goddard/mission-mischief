// Beer Justice AWS Sync - Global multiplayer trials
console.log('🍺 Loading BeerJusticeAWS script...');

const BeerJusticeAWS = {
    apiBase: 'https://ws2qwehovl.execute-api.us-east-1.amazonaws.com/prod',
    
    async getActiveTrials() {
        try {
            const response = await fetch(`${this.apiBase}/get-trials`);
            const result = await response.json();
            return result.trials || [];
        } catch (error) {
            console.error('AWS trials fetch failed:', error);
            return [];
        }
    },
    
    async createTrial(trialData) {
        try {
            const response = await fetch(`${this.apiBase}/create-trial`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trialData)
            });
            return await response.json();
        } catch (error) {
            console.error('AWS trial creation failed:', error);
            throw error;
        }
    },
    
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
            return await response.json();
        } catch (error) {
            console.error('AWS vote casting failed:', error);
            throw error;
        }
    },
    
    async getHonorScore(userHandle) {
        try {
            const response = await fetch(`${this.apiBase}/get-honor?user=${userHandle}`);
            const result = await response.json();
            return result.honor_score || 100;
        } catch (error) {
            console.error('AWS honor fetch failed:', error);
            return 100;
        }
    }
};

window.BeerJusticeAWS = BeerJusticeAWS;
console.log('✅ BeerJusticeAWS initialized successfully');
console.log('📡 API Base:', BeerJusticeAWS.apiBase);