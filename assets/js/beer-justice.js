/**
 * Mission Mischief - Beer Justice System
 * Community-driven trials with real beer consequences
 */

const BeerJustice = {
  
  // Show report cheater form
  showReportForm() {
    const user = Storage.getUser();
    
    if (!Storage.canStartTrial()) {
      showToast('Need 50+ Honor to start trials. Build reputation first!', 'warning');
      return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'reportModal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.95); z-index: 2000;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; overflow-y: auto;
    `;
    
    modal.innerHTML = `
      <div style="background: #222; border-radius: 8px; padding: 20px; width: 100%; max-width: 500px; border: 2px solid #ff4444;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #ff4444; margin: 0 0 10px 0;">⚖️ TRIAL BY BEER WARNING</h2>
          <p style="color: #ccc; margin: 0; font-size: 14px;">Think someone's cheating? Put your beer money where your mouth is!</p>
        </div>
        
        <div style="background: rgba(255, 68, 68, 0.1); padding: 15px; border-radius: 4px; margin-bottom: 20px; border: 1px solid #ff4444;">
          <h4 style="color: #ff4444; margin: 0 0 10px 0; font-size: 14px;">📊 STAKES:</h4>
          <ul style="color: #ccc; font-size: 13px; margin: 0; padding-left: 20px;">
            <li>Both parties lose 5 points immediately</li>
            <li>Winner gets 7 points back (5 + 2 bonus)</li>
            <li>🍺 If you're WRONG: Must buy accused 3 beers ($15)</li>
            <li>🍺 If accused is GUILTY: Accused owes you 1 beer ($5)</li>
            <li>⏰ Trial duration: 6 hours</li>
            <li>🗳️ Community votes to decide</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #ff4444; margin-bottom: 8px; font-weight: bold;">Accused Player:</label>
          <input type="text" id="accusedPlayer" placeholder="@username" 
                 style="width: 100%; padding: 8px; background: #333; color: #fff; border: 1px solid #ff4444; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #ff4444; margin-bottom: 8px; font-weight: bold;">Evidence URL:</label>
          <input type="url" id="evidenceURL" placeholder="https://instagram.com/p/..." 
                 style="width: 100%; padding: 8px; background: #333; color: #fff; border: 1px solid #ff4444; border-radius: 4px;">
          <small style="color: #999; font-size: 12px; display: block; margin-top: 5px;">
            Link to the suspicious post or evidence
          </small>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; color: #ff4444; margin-bottom: 8px; font-weight: bold;">Accusation Details:</label>
          <textarea id="accusationDetails" placeholder="Describe why you think they're cheating..." 
                    style="width: 100%; height: 80px; padding: 8px; background: #333; color: #fff; border: 1px solid #ff4444; border-radius: 4px; resize: vertical;"></textarea>
        </div>
        
        <div style="background: rgba(255, 107, 107, 0.1); padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <p style="color: #ff6b6b; font-weight: bold; margin: 0 0 10px 0; text-align: center;">
            ⚠️ FALSE ACCUSATIONS ARE EXPENSIVE! ⚠️
          </p>
          <p style="color: #ccc; margin: 0; font-size: 13px; text-align: center;">
            Are you absolutely sure they're cheating? This will cost you 3 beers ($15) if you're wrong.
          </p>
        </div>
        
        <div style="display: flex; gap: 10px;">
          <button onclick="BeerJustice.startTrial()" 
                  style="flex: 1; background: #ff4444; color: #fff; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            🍺 YES - START TRIAL (I'M SURE)
          </button>
          <button onclick="BeerJustice.closeModal()" 
                  style="background: #666; color: #fff; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer;">
            ❌ NEVERMIND
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  },
  
  // Start a beer trial (AWS + local)
  async startTrial() {
    const accused = document.getElementById('accusedPlayer').value.trim();
    const evidenceURL = document.getElementById('evidenceURL').value.trim();
    const details = document.getElementById('accusationDetails').value.trim();
    
    if (!accused || !evidenceURL || !details) {
      showToast('Please fill all fields before starting trial', 'warning');
      return;
    }
    
    const user = Storage.getUser();
    
    // Check honor score via AWS
    const honorScore = await BeerJusticeAWS.getHonorScore(user.userName);
    if (honorScore < 50) {
      showToast('Need 50+ Honor to start trials. Build reputation first!', 'warning');
      return;
    }
    
    const trialData = {
      accuser: user.userName,
      accused: accused,
      evidence_url: evidenceURL,
      accusation: details
    };
    
    try {
      // Create trial via AWS (with local fallback)
      const result = await BeerJusticeAWS.createTrial(trialData);
      
      if (result.trial_id) {
        showToast(`Trial started! Community has 6 hours to vote. You've been charged 5 points.`, 'success');
        this.closeModal();
        
        // Update displays
        if (window.loadUserStats) window.loadUserStats();
        loadBeerTrials();
      }
    } catch (error) {
      showToast(`Failed to start trial: ${error.message}`, 'error');
    }
  },
  
  // Cast vote in trial (AWS + local)
  async castVote(trialId, verdict) {
    const user = Storage.getUser();
    
    try {
      // Cast vote via AWS (with local fallback)
      const result = await BeerJusticeAWS.castVote(trialId, verdict, user.userName);
      
      if (result.message) {
        showToast(`Vote cast: ${verdict.toUpperCase()}! 🗳️`, 'success');
        
        if (result.trial_concluded) {
          showToast(`⚖️ VERDICT: ${result.verdict.toUpperCase()}! ${result.message}`, 'info');
        }
        
        // Update displays
        if (window.loadUserStats) window.loadUserStats();
        loadBeerTrials();
      }
    } catch (error) {
      showToast(`Failed to cast vote: ${error.message}`, 'error');
    }
  },
  
  // Conclude trial with results
  concludeTrial(trial) {
    const guiltyVotes = trial.votes.guilty;
    const innocentVotes = trial.votes.innocent;
    const verdict = guiltyVotes > innocentVotes ? 'guilty' : 'innocent';
    
    // Update trial status
    trial.status = 'concluded';
    trial.verdict = verdict;
    trial.concluded_at = new Date().toISOString();
    
    // Update honor scores and beer debts
    if (verdict === 'guilty') {
      // Accused was guilty
      Storage.updateHonorScore(-10, 'guilty_verdict'); // Accused loses honor
      Storage.addBeerDebt(trial.accuser, 1, 'guilty_verdict'); // Accused owes 1 beer
      
      showToast(`${trial.accused} found GUILTY! Owes ${trial.accuser} 1 beer 🍺`, 'success');
    } else {
      // Accused was innocent - false accusation
      Storage.updateHonorScore(-5, 'false_accusation'); // Accuser loses honor
      Storage.addBeerDebt(trial.accused, 3, 'false_accusation'); // Accuser owes 3 beers
      
      showToast(`${trial.accuser} made FALSE ACCUSATION! Owes ${trial.accused} 3 beers 🍺`, 'warning');
    }
    
    // Award honor for community participation
    trial.voters.forEach(voter => {
      // This would need to update other users' honor scores
      // For now, just log it
      console.log(`${voter} earned +1 Honor for trial participation`);
    });
    
    // Save updated trial
    let trials = JSON.parse(localStorage.getItem('missionMischiefTrials') || '[]');
    const trialIndex = trials.findIndex(t => t.trial_id === trial.trial_id);
    if (trialIndex !== -1) {
      trials[trialIndex] = trial;
      localStorage.setItem('missionMischiefTrials', JSON.stringify(trials));
    }
  },
  
  // Close modal
  closeModal() {
    const modal = document.getElementById('reportModal');
    if (modal) modal.remove();
  },
  
  // Get honor color for display
  getHonorColor(score) {
    return Storage.getHonorColor(score);
  },
  
  // Display honor badge
  displayHonorBadge(userHandle) {
    const user = Storage.getUser();
    if (user.userName === userHandle) {
      return `<span class="honor-badge" style="color: ${this.getHonorColor(user.honorScore)}">
        ⭐ ${user.honorScore} Honor
      </span>`;
    }
    return `<span class="honor-badge" style="color: #666">⭐ ?? Honor</span>`;
  },
  
  // Calculate time remaining for trial
  calculateTimeRemaining(expiresAt) {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) {
      return { display: 'Expired', urgent: true };
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    const urgent = diff < (1000 * 60 * 60); // Less than 1 hour
    
    return {
      display: `${hours}h ${minutes}m`,
      urgent: urgent
    };
  }
};

// Load beer trials function for bounty-hunter.html (AWS + local)
async function loadBeerTrials() {
  let activeTrials, completedTrials;
  
  try {
    // Load trials from AWS (with local fallback)
    activeTrials = await BeerJusticeAWS.getActiveTrials();
    const allTrials = JSON.parse(localStorage.getItem('missionMischiefTrials') || '[]');
    completedTrials = allTrials.filter(t => t.status === 'concluded');
  } catch (error) {
    console.error('Failed to load trials from AWS:', error);
    // Fallback to local storage
    activeTrials = Storage.getActiveTrials();
    const allTrials = JSON.parse(localStorage.getItem('missionMischiefTrials') || '[]');
    completedTrials = allTrials.filter(t => t.status === 'concluded');
  }
  
  // Update count
  document.getElementById('trialsCount').textContent = activeTrials.length;
  
  // Load active trials
  const activeContainer = document.getElementById('activeTrials');
  if (activeTrials.length === 0) {
    activeContainer.innerHTML = `
      <div style="text-align: center; color: #04aa6d; padding: 20px;">
        <strong>✅ No active trials!</strong><br>
        <span style="color: #666;">Community is behaving well</span>
      </div>
    `;
  } else {
    activeContainer.innerHTML = `
      <h3 style="color: #ff4444; margin-bottom: 15px;">🏛️ Active Trials</h3>
      ${activeTrials.map(trial => {
        const timeRemaining = BeerJustice.calculateTimeRemaining(trial.expires_at);
        const user = Storage.getUser();
        const hasVoted = trial.voters.includes(user.userName);
        
        return `
          <div style="background: #111; border: 2px solid #ff4444; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h4 style="color: #ff4444; margin: 0;">⚖️ TRIAL IN SESSION</h4>
              <div style="color: ${timeRemaining.urgent ? '#ff4444' : '#04aa6d'}; font-weight: bold;">
                ⏰ ${timeRemaining.display} remaining
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
              <div>
                <strong style="color: #04aa6d;">Accuser:</strong> ${trial.accuser}<br>
                ${BeerJustice.displayHonorBadge(trial.accuser)}<br>
                <span style="color: #999; font-size: 12px;">Risks: 3 beers if wrong</span>
              </div>
              <div>
                <strong style="color: #ff4444;">Accused:</strong> ${trial.accused}<br>
                ${BeerJustice.displayHonorBadge(trial.accused)}<br>
                <span style="color: #999; font-size: 12px;">Risks: 1 beer if guilty</span>
              </div>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #04aa6d;">Evidence:</strong> 
              <a href="${trial.evidence_url}" target="_blank" style="color: #04aa6d;">📱 View Post</a><br>
              <div style="color: #ccc; font-size: 13px; margin-top: 5px;">${trial.accusation_details}</div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; gap: 15px;">
                <span style="color: #ff4444;">😈 Guilty: ${trial.votes.guilty}</span>
                <span style="color: #04aa6d;">😇 Innocent: ${trial.votes.innocent}</span>
              </div>
              
              ${!hasVoted ? `
                <div style="display: flex; gap: 8px;">
                  <button onclick="BeerJustice.castVote('${trial.trial_id}', 'guilty')" 
                          style="background: #ff4444; color: #fff; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    😈 GUILTY
                  </button>
                  <button onclick="BeerJustice.castVote('${trial.trial_id}', 'innocent')" 
                          style="background: #04aa6d; color: #000; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    😇 INNOCENT
                  </button>
                </div>
              ` : `
                <div style="color: #04aa6d; font-size: 12px;">✅ You have voted</div>
              `}
            </div>
          </div>
        `;
      }).join('')}
    `;
  }
  
  // Load completed trials
  const completedContainer = document.getElementById('completedTrials');
  if (completedTrials.length > 0) {
    completedContainer.innerHTML = `
      <h3 style="color: #666; margin-bottom: 15px;">📜 Recent Verdicts</h3>
      ${completedTrials.slice(-5).reverse().map(trial => `
        <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="color: ${trial.verdict === 'guilty' ? '#ff4444' : '#04aa6d'};">
              ${trial.verdict === 'guilty' ? '😈 GUILTY' : '😇 INNOCENT'}
            </strong>
            <span style="color: #666; font-size: 12px;">
              ${new Date(trial.concluded_at).toLocaleDateString()}
            </span>
          </div>
          <div style="color: #ccc; font-size: 13px;">
            <strong>${trial.accuser}</strong> vs <strong>${trial.accused}</strong><br>
            Votes: ${trial.votes.guilty} guilty, ${trial.votes.innocent} innocent
          </div>
        </div>
      `).join('')}
    `;
  }
}

// Make available globally
window.BeerJustice = BeerJustice;
window.loadBeerTrials = loadBeerTrials;