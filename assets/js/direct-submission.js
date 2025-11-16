/**
 * Mission Mischief - Direct Submission System
 * Instant mission completion with optional URL protection
 */

const DirectSubmission = {
  
  // Show submission form modal
  showSubmissionForm(missionId) {
    const mission = Missions.getMission(missionId);
    const user = Storage.getUser();
    
    if (!Storage.canStartTrial()) {
      showToast('Need 50+ Honor to submit missions. Build reputation first!', 'warning');
      return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'submissionModal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.95); z-index: 2000;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; overflow-y: auto;
    `;
    
    modal.innerHTML = `
      <div style="background: #222; border-radius: 8px; padding: 20px; width: 100%; max-width: 500px; border: 2px solid #04aa6d;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #04aa6d; margin: 0 0 10px 0;">⚡ Submit Mission ${mission.id}</h2>
          <h3 style="color: #fff; margin: 0 0 10px 0; font-size: 16px;">${mission.title}</h3>
          <p style="color: #ccc; margin: 0; font-size: 14px;">${mission.description}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #04aa6d; margin-bottom: 8px; font-weight: bold;">Points Earned:</label>
          <select id="submissionPoints" style="width: 100%; padding: 8px; background: #333; color: #fff; border: 1px solid #04aa6d; border-radius: 4px;">
            ${this.getPointsOptions(mission)}
          </select>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #04aa6d; margin-bottom: 8px; font-weight: bold;">Post URL (Optional):</label>
          <input type="url" id="submissionURL" placeholder="https://instagram.com/p/..." 
                 style="width: 100%; padding: 8px; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px;">
          <small style="color: #999; font-size: 12px; display: block; margin-top: 5px;">
            🛡️ For dispute protection only - not required for submission
          </small>
        </div>
        
        <div style="background: rgba(4, 170, 109, 0.1); padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <h4 style="color: #04aa6d; margin: 0 0 10px 0; font-size: 14px;">⚡ INSTANT SUBMISSION</h4>
          <ul style="color: #ccc; font-size: 13px; margin: 0; padding-left: 20px;">
            <li>Get points immediately - no waiting!</li>
            <li>Optional URL protects against disputes</li>
            <li>Community can challenge suspicious submissions</li>
            <li>False accusations cost 3 beers ($15)</li>
          </ul>
        </div>
        
        <div style="display: flex; gap: 10px;">
          <button onclick="DirectSubmission.submitMission(${mission.id})" 
                  style="flex: 1; background: #04aa6d; color: #000; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            ⚡ SUBMIT NOW
          </button>
          <button onclick="DirectSubmission.closeModal()" 
                  style="background: #666; color: #fff; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer;">
            Cancel
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  },
  
  // Submit mission directly
  submitMission(missionId) {
    const points = parseInt(document.getElementById('submissionPoints').value) || 0;
    const proofUrl = document.getElementById('submissionURL').value.trim() || null;
    
    if (points === 0) {
      showToast('Please select points earned for this mission', 'warning');
      return;
    }
    
    // Submit via storage system
    const user = Storage.submitMission(missionId, points, proofUrl);
    
    // Close modal
    this.closeModal();
    
    // Update displays
    if (window.loadUserStats) window.loadUserStats();
    if (window.loadMissions) window.loadMissions();
    
    showToast(`Mission ${missionId} submitted! +${points} points 🎉`, 'success');
    
    // Award honor for legitimate submission
    Storage.updateHonorScore(1, 'mission_submission');
  },
  
  // Close submission modal
  closeModal() {
    const modal = document.getElementById('submissionModal');
    if (modal) modal.remove();
  },
  
  // Generate points options for mission
  getPointsOptions(mission) {
    const points = mission.points;
    let options = '<option value="0">Select points earned...</option>';
    
    if (typeof points === 'number') {
      options += `<option value="${points}">${points}</option>`;
    } else if (typeof points === 'string') {
      if (points.includes('-')) {
        const [min, max] = points.split('-').map(p => parseInt(p.trim()));
        for (let i = min; i <= max; i++) {
          options += `<option value="${i}">${i}</option>`;
        }
      } else if (points === '?') {
        for (let i = 1; i <= 50; i++) {
          options += `<option value="${i}">${i}</option>`;
        }
      } else if (points.includes('/')) {
        const pointValues = points.split('/').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
        pointValues.forEach(p => {
          options += `<option value="${p}">${p}</option>`;
        });
      } else {
        const matches = points.match(/\d+/g);
        if (matches) {
          matches.forEach(p => {
            options += `<option value="${p}">${p}</option>`;
          });
        }
      }
    }
    
    return options;
  },
  
  // Show submission history
  showSubmissionHistory() {
    const user = Storage.getUser();
    const submissions = user.submissions || {};
    
    if (Object.keys(submissions).length === 0) {
      showToast('No submissions yet. Complete some missions!', 'info');
      return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'historyModal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.95); z-index: 2000;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; overflow-y: auto;
    `;
    
    const submissionList = Object.entries(submissions)
      .sort(([,a], [,b]) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(([missionId, submission]) => {
        const mission = Missions.getMission(parseInt(missionId));
        return `
          <div style="background: #333; padding: 15px; border-radius: 4px; margin-bottom: 10px; border-left: 4px solid #04aa6d;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="color: #04aa6d;">Mission ${missionId}: ${mission?.title || 'Unknown'}</strong>
              <span style="color: #04aa6d; font-weight: bold;">+${submission.points}pts</span>
            </div>
            <div style="color: #ccc; font-size: 12px; margin-bottom: 5px;">
              ${new Date(submission.timestamp).toLocaleString()}
            </div>
            ${submission.proofUrl ? `
              <div style="font-size: 11px;">
                <a href="${submission.proofUrl}" target="_blank" style="color: #04aa6d;">View Proof</a>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    
    modal.innerHTML = `
      <div style="background: #222; border-radius: 8px; padding: 20px; width: 100%; max-width: 600px; max-height: 80vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="color: #04aa6d; margin: 0;">📋 Submission History</h2>
          <button onclick="DirectSubmission.closeHistoryModal()" 
                  style="background: #666; color: #fff; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer;">
            ✕
          </button>
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background: rgba(4, 170, 109, 0.1); border-radius: 4px;">
          <div style="color: #04aa6d; font-weight: bold; margin-bottom: 5px;">Total Stats:</div>
          <div style="color: #ccc; font-size: 14px;">
            ${Object.keys(submissions).length} submissions • 
            ${Object.values(submissions).reduce((sum, s) => sum + s.points, 0)} total points
          </div>
        </div>
        
        <div style="max-height: 400px; overflow-y: auto;">
          ${submissionList}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  },
  
  // Close history modal
  closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    if (modal) modal.remove();
  }
};

// Make available globally
window.DirectSubmission = DirectSubmission;