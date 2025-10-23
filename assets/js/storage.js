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
    joinDate: null
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

  // Update honor score
  updateHonorScore(change) {
    const user = this.getUser();
    user.honorScore = Math.max(0, user.honorScore + change);
    this.saveUser(user);
    return user;
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
  }
};

window.Storage = Storage;