/**
 * Mission Mischief - localStorage Management
 */

const Storage = {
  // Default user data structure
  defaultUser: {
    userName: '',
    userHandle: '',
    qrCodeData: '', // Their existing social media QR code data
    completedMissions: [],
    badges: [], // User's earned badges
    badgeStates: {}, // Track badge completion states
    completedBuyIns: [], // Track completed buy-ins for crown of chaos
    fafoCompleted: false, // Mission 1: FAFO completion status
    fafoCompletedDate: null, // When they agreed to ToS
    honorScore: 100,
    exposedBy: [],
    currentBuyIn: null,
    joinDate: null,
    // Direct submission system
    submissions: {}, // Track all mission submissions with timestamps
    totalPoints: 0, // Real-time point tracking
    missionPoints: {} // Points earned per mission
  },

  // Get user data
  getUser() {
    const userData = localStorage.getItem('missionMischiefUser');
    return userData ? JSON.parse(userData) : { ...this.defaultUser };
  },

  // Save user data
  saveUser(userData) {
    localStorage.setItem('missionMischiefUser', JSON.stringify(userData));
  },

  // Initialize new user
  initUser(userName, userHandle) {
    const userData = {
      ...this.defaultUser,
      userName,
      userHandle,
      joinDate: new Date().toISOString()
    };
    this.saveUser(userData);
    return userData;
  },

  // Complete a mission
  completeMission(missionId) {
    const user = this.getUser();
    if (!user.completedMissions.includes(missionId)) {
      user.completedMissions.push(missionId);
      this.saveUser(user);
    }
    return user;
  },

  // Submit mission directly (instant system)
  submitMission(missionId, points = 0, proofUrl = null) {
    const user = this.getUser();
    const timestamp = new Date().toISOString();
    
    // Initialize submission tracking
    if (!user.submissions) user.submissions = {};
    if (!user.missionPoints) user.missionPoints = {};
    
    // Record submission
    user.submissions[missionId] = {
      timestamp,
      points,
      proofUrl,
      status: 'submitted',
      source: 'direct'
    };
    
    // Update points
    user.missionPoints[missionId] = points;
    user.totalPoints = Object.values(user.missionPoints).reduce((sum, p) => sum + p, 0);
    
    // Mark as completed
    if (!user.completedMissions.includes(missionId)) {
      user.completedMissions.push(missionId);
    }
    
    this.saveUser(user);
    return user;
  },

  // Get submission for mission
  getSubmission(missionId) {
    const user = this.getUser();
    return user.submissions?.[missionId] || null;
  },

  // Check if mission is submitted
  isMissionSubmitted(missionId) {
    const submission = this.getSubmission(missionId);
    return submission && submission.status === 'submitted';
  },

  // Complete FAFO (Mission 1) - unlocks all other missions
  completeFAFO() {
    const user = this.getUser();
    user.fafoCompleted = true;
    user.fafoCompletedDate = new Date().toISOString();
    this.saveUser(user);
    return user;
  },

  // Check if FAFO is completed
  isFAFOCompleted() {
    const user = this.getUser();
    return user.fafoCompleted === true;
  },

  // Add badge
  addBadge(badgeId) {
    const user = this.getUser();
    if (!user.badges) user.badges = [];
    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
      this.saveUser(user);
    }
    return user;
  },

  // Update honor score with reason
  updateHonorScore(change, reason = '') {
    const user = this.getUser();
    user.honorScore = Math.max(0, user.honorScore + change);
    this.saveUser(user);
    
    // Show toast notification
    if (window.showToast) {
      window.showToast(`Honor ${change > 0 ? '+' : ''}${change}: ${reason}`, 
                      change > 0 ? 'success' : 'warning');
    }
    return user;
  },

  // Beer Justice System Functions
  
  // Get honor color for display
  getHonorColor(score) {
    if (score >= 90) return '#04aa6d'; // Green - Trusted
    if (score >= 70) return '#ffd700'; // Gold - Good
    if (score >= 50) return '#ff8c00'; // Orange - Caution
    return '#ff4444'; // Red - Untrustworthy
  },

  // Check if user can start trials
  canStartTrial() {
    const user = this.getUser();
    return user.honorScore >= 50;
  },

  // Beer debt management
  addBeerDebt(creditor, amount, reason) {
    const user = this.getUser();
    if (!user.beerDebts) user.beerDebts = [];
    
    user.beerDebts.push({
      creditor,
      amount,
      reason,
      created: new Date().toISOString(),
      status: 'pending'
    });
    
    this.saveUser(user);
    return user;
  },

  // Get total beer debts owed
  getTotalBeerDebts() {
    const user = this.getUser();
    if (!user.beerDebts) return 0;
    return user.beerDebts
      .filter(debt => debt.status === 'pending')
      .reduce((total, debt) => total + debt.amount, 0);
  },

  // Trial management
  createTrial(trialData) {
    let trials = JSON.parse(localStorage.getItem('missionMischiefTrials') || '[]');
    trials.push(trialData);
    localStorage.setItem('missionMischiefTrials', JSON.stringify(trials));
    return trialData;
  },

  // Get active trials
  getActiveTrials() {
    const trials = JSON.parse(localStorage.getItem('missionMischiefTrials') || '[]');
    const now = new Date();
    return trials.filter(trial => 
      trial.status === 'active' && new Date(trial.expires_at) > now
    );
  },

  // Cast vote in trial
  castVote(trialId, verdict, voter) {
    let trials = JSON.parse(localStorage.getItem('missionMischiefTrials') || '[]');
    const trialIndex = trials.findIndex(t => t.trial_id === trialId);
    
    if (trialIndex === -1) return null;
    
    const trial = trials[trialIndex];
    if (trial.voters.includes(voter)) return null; // Already voted
    
    trial.votes[verdict]++;
    trial.voters.push(voter);
    
    localStorage.setItem('missionMischiefTrials', JSON.stringify(trials));
    return trial;
  },

  // Complete a buy-in
  completeBuyIn(buyInId) {
    const user = this.getUser();
    if (!user.completedBuyIns) user.completedBuyIns = [];
    
    if (!user.completedBuyIns.includes(buyInId)) {
      user.completedBuyIns.push(buyInId);
      this.saveUser(user);
    }
    return user;
  },

  // Check if user exists
  userExists() {
    return localStorage.getItem('missionMischiefUser') !== null;
  },

  // Clear all data
  clearData() {
    localStorage.removeItem('missionMischiefUser');
  },

  // Get user stats for dashboard
  getUserStats() {
    const user = this.getUser();
    const totalSubmissions = Object.keys(user.submissions || {}).length;
    const totalPoints = user.totalPoints || 0;
    const completedMissions = user.completedMissions.length;
    const beerDebts = this.getTotalBeerDebts();
    
    return {
      totalSubmissions,
      totalPoints,
      completedMissions,
      honorScore: user.honorScore,
      beerDebts,
      honorColor: this.getHonorColor(user.honorScore)
    };
  }
};

window.Storage = Storage;