/**
 * Mission Mischief - Direct Submission System
 * Week 1: Instant mission completion with optional URL protection
 */

const DirectSubmission = {
  
  // Submit mission with instant feedback
  submitMission(missionId, points = 0, proofUrl = null) {
    try {
      const user = Storage.submitMission(missionId, points, proofUrl);
      
      // Show instant feedback
      this.showSubmissionSuccess(missionId, points);
      
      // Update UI immediately
      this.updateMissionCard(missionId, 'submitted');
      this.updateUserStats();
      
      // Award badge if applicable
      const mission = Missions.getMission(missionId);
      if (mission.badgeId) {
        this.awardBadge(mission.badgeId);
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Submission failed:', error);
      this.showSubmissionError(missionId, error.message);
      return { success: false, error: error.message };
    }
  },
  
  // Show submission form for mission
  showSubmissionForm(missionId) {
    const mission = Missions.getMission(missionId);
    if (!mission) return;
    
    const modal = document.createElement('div');
    modal.id = 'submissionModal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;
    
    modal.innerHTML = `
      <div style="background: #222; border-radius: 8px; padding: 20px; width: 100%; max-width: 500px; color: #fff;">
        <h3 style="color: #04aa6d; margin-bottom: 15px;">Submit Mission ${mission.id}</h3>
        <p style="margin-bottom: 20px;">${mission.title}</p>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #04aa6d; margin-bottom: 5px; font-weight: bold;">Points Earned:</label>
          <select id="submissionPoints" style="width: 100%; padding: 8px; background: #333; color: #fff; border: 1px solid #04aa6d; border-radius: 4px;">
            ${this.getPointsOptions(mission)}
          </select>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; color: #04aa6d; margin-bottom: 5px; font-weight: bold;">
            Social Media Post URL (Required):
          </label>
          <input type="url" id="submissionUrl" placeholder="https://instagram.com/p/..." required
                 style="width: 100%; padding: 8px; background: #333; color: #fff; border: 1px solid #04aa6d; border-radius: 4px; box-sizing: border-box;">
          <small style="color: #999; font-size: 12px; margin-top: 5px; display: block;">
            Paste the URL of your social media post with overlays and hashtags (mandatory for community validation)
          </small>
        </div>
        
        <div style="display: flex; gap: 10px;">
          <button onclick="DirectSubmission.processSubmission(${missionId})" 
                  style="flex: 1; background: #04aa6d; color: #000; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            ⚡ SUBMIT MISSION
          </button>
          <button onclick="DirectSubmission.closeSubmissionForm()" 
                  style="background: #666; color: #fff; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer;">
            Cancel
          </button>
        </div>
        
        <div style="margin-top: 15px; padding: 10px; background: rgba(4, 170, 109, 0.1); border-radius: 4px; font-size: 13px;">
          <strong>🚀 Direct Submission:</strong> Post your overlaid photo/video with hashtags to social media first, then paste the URL here for instant points!
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  },
  
  // Process the submission
  processSubmission(missionId) {
    const pointsSelect = document.getElementById('submissionPoints');
    const urlInput = document.getElementById('submissionUrl');
    
    const points = parseInt(pointsSelect.value) || 0;
    const proofUrl = urlInput.value.trim();
    
    // Validate URL is provided and valid
    if (!proofUrl) {
      this.showToast('Social media post URL is required', 'error');
      return;
    }
    
    if (!this.isValidUrl(proofUrl)) {
      this.showToast('Please enter a valid social media URL', 'error');
      return;
    }
    
    // Submit mission with required URL
    const result = this.submitMission(missionId, points, proofUrl);
    
    if (result.success) {
      this.closeSubmissionForm();
      
      // Reload missions to show updated state
      if (window.loadMissions) {
        window.loadMissions();
      }
    }
  },
  
  // Close submission form
  closeSubmissionForm() {
    const modal = document.getElementById('submissionModal');
    if (modal) {
      modal.remove();
    }
  },
  
  // Generate points options for mission
  getPointsOptions(mission) {
    const points = mission.points;
    let options = '<option value="0">0 (no points)</option>';
    
    if (typeof points === 'number') {
      options += `<option value="${points}" selected>${points}</option>`;
    } else if (typeof points === 'string') {
      if (points.includes('-')) {
        const [min, max] = points.split('-').map(p => parseInt(p.trim()));
        for (let i = min; i <= max; i++) {
          options += `<option value="${i}" ${i === min ? 'selected' : ''}>${i}</option>`;
        }
      } else if (points === '?') {
        for (let i = 1; i <= 50; i++) {
          options += `<option value="${i}" ${i === 1 ? 'selected' : ''}>${i}</option>`;
        }
      }
    }
    
    return options;
  },
  
  // Validate URL
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },
  
  // Show submission success
  showSubmissionSuccess(missionId, points) {
    const message = points > 0 
      ? `Mission ${missionId} submitted! +${points} points 🎉`
      : `Mission ${missionId} submitted! 🎉`;
    this.showToast(message, 'success');
  },
  
  // Show submission error
  showSubmissionError(missionId, error) {
    this.showToast(`Submission failed: ${error}`, 'error');
  },
  
  // Update mission card UI
  updateMissionCard(missionId, status) {
    const card = document.querySelector(`[data-mission-id="${missionId}"]`);
    if (card) {
      card.classList.add('submitted');
      
      // Update status indicator
      const statusElement = card.querySelector('.mission-status');
      if (statusElement) {
        statusElement.textContent = 'submitted';
        statusElement.className = 'mission-status submitted';
      }
    }
  },
  
  // Update user stats display
  updateUserStats() {
    if (window.loadUserStats) {
      window.loadUserStats();
    }
  },
  
  // Award badge
  awardBadge(badgeId) {
    Storage.addBadge(badgeId);
    this.showToast(`Badge earned: ${badgeId}! 🏆`, 'success');
  },
  
  // Show toast notification
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#04aa6d' : type === 'error' ? '#ff6b6b' : '#333'};
      color: ${type === 'success' ? '#000' : '#fff'};
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 10000;
      font-size: 14px;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 4000);
  },
  
  // Get submission history for user
  getSubmissionHistory() {
    const user = Storage.getUser();
    return user.submissions || {};
  },
  
  // Show submission history
  showSubmissionHistory() {
    const history = this.getSubmissionHistory();
    const entries = Object.entries(history);
    
    if (entries.length === 0) {
      this.showToast('No submissions yet', 'info');
      return;
    }
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 2000;
      padding: 20px;
      overflow-y: auto;
    `;
    
    modal.innerHTML = `
      <div style="background: #222; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; color: #fff;">
        <h3 style="color: #04aa6d; margin-bottom: 20px;">Submission History</h3>
        
        ${entries.map(([missionId, submission]) => {
          const mission = Missions.getMission(parseInt(missionId));
          const date = new Date(submission.timestamp).toLocaleDateString();
          const time = new Date(submission.timestamp).toLocaleTimeString();
          
          return `
            <div style="background: #333; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 8px;">
                <strong style="color: #04aa6d;">Mission ${missionId}: ${mission?.title || 'Unknown'}</strong>
                <span style="color: #999; font-size: 12px;">${date} ${time}</span>
              </div>
              <div style="font-size: 14px; margin-bottom: 5px;">
                Points: <strong>${submission.points}</strong>
              </div>
              ${submission.proofUrl ? `
                <div style="font-size: 12px; color: #999;">
                  Proof: <a href="${submission.proofUrl}" target="_blank" style="color: #04aa6d;">${submission.proofUrl}</a>
                </div>
              ` : '<div style="font-size: 12px; color: #666;">No proof URL provided</div>'}
            </div>
          `;
        }).join('')}
        
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: #04aa6d; color: #000; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-top: 15px;">
          Close
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
};

// Make available globally
window.DirectSubmission = DirectSubmission;