export const handler = async (event) => {
    console.log('Simple test handler starting...');
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            success: true,
            data: {
                leaderboard: [
                    { handle: '@casper', points: 9, city: 'Losangeles', state: 'CALIFORNIA' },
                    { handle: '@shady', points: 6, city: 'Losangeles', state: 'CALIFORNIA' },
                    { handle: '@mayhem', points: 6, city: 'Losangeles', state: 'CALIFORNIA' },
                    { handle: '@annie', points: 3, city: 'Wichita', state: 'KANSAS' }
                ],
                geography: {
                    'CALIFORNIA': { 'Losangeles': 3 },
                    'KANSAS': { 'Wichita': 1 }
                },
                missions: {
                    '5': { instagram: 2, facebook: 2, x: 3 },
                    '7': { instagram: 0, facebook: 0, x: 1 }
                },
                justice: []
            },
            source: 'simple-test'
        })
    };
};