/**
 * Mission Mischief - Camera & Badge Overlay System
 */

const Camera = {
  // Current active mission for smoldering effect
  activeMissionId: null,
  
  // Initialize camera overlay
  initOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'badgeOverlay';
    overlay.className = 'badge-overlay';
    overlay.innerHTML = this.generateOverlayHTML();
    document.body.appendChild(overlay);
    
    this.updateBadgeStates();
    this.setupResponsiveLayout();
  },

  // Generate badge overlay HTML
  generateOverlayHTML() {
    const user = Storage.getUser();
    const badgeStates = Missions.getAllBadgeStates(user);
    const buyInState = Missions.getBuyInBadgeState(user);
    
    let html = `
      <!-- Buy-in Badge Area -->
      <div class="buyin-badge-area">
        ${this.generateBuyInBadgeHTML(buyInState, user)}
      </div>
      
      <!-- Mascot Area -->
      <div class="mascot-area">
        ${this.generateMascotHTML(user)}
      </div>
      
      <!-- Main Badge Grid -->
      <div class="badge-grid">
    `;
    
    Object.entries(Missions.badges).forEach(([badgeId, badge]) => {
      const state = badgeStates[badgeId];
      const isActive = this.isActiveMissionBadge(badgeId);
      
      html += `
        <div class="badge-item ${state.state} ${isActive ? 'smoldering' : ''}" data-badge="${badgeId}">
          <img src="${state.icon}" alt="${badge.name}" />
          <div class="badge-smoke"></div>
          <div class="badge-glow"></div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  },

  // Generate buy-in badge HTML
  generateBuyInBadgeHTML(buyInState, user) {
    if (!buyInState) return '';
    
    if (buyInState === 'crown-of-chaos') {
      return `
        <div class="buyin-badge crown-of-chaos">
          <img src="assets/images/mascot/c-o-c.png" alt="Crown of Chaos" />
          <div class="crown-glow"></div>
        </div>
      `;
    }
    
    if (buyInState === 'gold-prompt') {
      const remainingBuyIn = this.getRemainingBuyIn(user);
      return `
        <div class="buyin-badge gold-prompt">
          <img src="assets/images/badges/${Missions.buyIns[remainingBuyIn].badge}" alt="${remainingBuyIn}" />
          <div class="gold-glow"></div>
        </div>
      `;
    }
    
    // Regular buy-in badge
    const buyIn = Missions.buyIns[buyInState];
    if (buyIn && buyIn.badge) {
      return `
        <div class="buyin-badge">
          <img src="assets/images/badges/${buyIn.badge}" alt="${buyIn.title}" />
        </div>
      `;
    }
    
    return '';
  },

  // Get remaining buy-in for gold prompt
  getRemainingBuyIn(user) {
    const completedBuyIns = user.completedBuyIns || [];
    const currentBuyIn = user.currentBuyIn;
    
    // Find the buy-in that's not completed and not current
    const allBuyIns = ['recycling', 'cleanup', 'referral'];
    return allBuyIns.find(buyIn => 
      !completedBuyIns.includes(buyIn) && buyIn !== currentBuyIn
    );
  },

  // Check if badge belongs to active mission
  isActiveMissionBadge(badgeId) {
    if (!this.activeMissionId) return false;
    const mission = Missions.getMission(this.activeMissionId);
    return mission && mission.badgeId === badgeId;
  },

  // Update badge states in overlay
  updateBadgeStates() {
    const user = Storage.getUser();
    const badgeStates = Missions.getAllBadgeStates(user);
    
    Object.entries(badgeStates).forEach(([badgeId, state]) => {
      const badgeElement = document.querySelector(`[data-badge="${badgeId}"]`);
      if (badgeElement) {
        badgeElement.className = `badge-item ${state}`;
        if (this.isActiveMissionBadge(badgeId)) {
          badgeElement.classList.add('smoldering');
        }
      }
    });
  },

  // Setup responsive layout detection
  setupResponsiveLayout() {
    const updateLayout = () => {
      const overlay = document.getElementById('badgeOverlay');
      if (overlay) {
        const isLandscape = window.innerWidth > window.innerHeight;
        overlay.classList.toggle('landscape', isLandscape);
        overlay.classList.toggle('portrait', !isLandscape);
      }
    };
    
    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', updateLayout);
    updateLayout(); // Initial call
  },

  // Start smoldering effect for active mission
  startSmoldering(missionId) {
    this.activeMissionId = missionId;
    const mission = Missions.getMission(missionId);
    
    if (mission && mission.badgeId) {
      const badgeElement = document.querySelector(`[data-badge="${mission.badgeId}"]`);
      if (badgeElement) {
        badgeElement.classList.add('smoldering');
        
        // Trigger animation restart
        const smoke = badgeElement.querySelector('.badge-smoke');
        const glow = badgeElement.querySelector('.badge-glow');
        
        if (smoke) {
          smoke.style.animation = 'none';
          smoke.offsetHeight; // Trigger reflow
          smoke.style.animation = 'smoke 3s ease-out infinite';
        }
        
        if (glow) {
          glow.style.animation = 'none';
          glow.offsetHeight; // Trigger reflow
          glow.style.animation = 'glow 2s ease-in-out infinite alternate';
        }
      }
    }
  },

  // Stop smoldering effect
  stopSmoldering() {
    if (this.activeMissionId) {
      const mission = Missions.getMission(this.activeMissionId);
      
      if (mission && mission.badgeId) {
        const badgeElement = document.querySelector(`[data-badge="${mission.badgeId}"]`);
        if (badgeElement) {
          badgeElement.classList.remove('smoldering');
        }
      }
      
      this.activeMissionId = null;
    }
  },

  // Show/hide overlay
  toggleOverlay(show = true) {
    const overlay = document.getElementById('badgeOverlay');
    if (overlay) {
      overlay.style.display = show ? 'block' : 'none';
    }
  },

  // Camera capture handlers
  onCameraStart(missionId) {
    this.startSmoldering(missionId);
    this.toggleOverlay(true);
  },

  onCameraStop() {
    this.stopSmoldering();
    this.toggleOverlay(false);
  },

  // Update overlay when mission completed
  onMissionComplete(missionId) {
    this.updateBadgeStates();
    
    // Show completion effect
    const mission = Missions.getMission(missionId);
    if (mission && mission.badgeId) {
      const badgeElement = document.querySelector(`[data-badge="${mission.badgeId}"]`);
      if (badgeElement) {
        badgeElement.classList.add('completion-flash');
        setTimeout(() => {
          badgeElement.classList.remove('completion-flash');
        }, 1000);
      }
    }
  },

  // Generate mascot HTML with dynamic expressions
  generateMascotHTML(user) {
    const expression = this.getMascotExpression(user);
    const hasCrown = Missions.hasCrownOfChaos(user);
    const imagePath = Missions.getMascotImagePath(expression, hasCrown);
    
    return `
      <div class="mascot">
        <img src="${imagePath}" alt="Mayhem ${expression}" />
      </div>
    `;
  },

  // Get mascot expression based on context
  getMascotExpression(user) {
    const hasCrown = Missions.hasCrownOfChaos(user);
    const prefix = hasCrown ? 'mayhem-crown-' : 'mayhem-';
    
    // Mission-specific expressions
    if (this.activeMissionId) {
      const mission = Missions.getMission(this.activeMissionId);
      if (mission) {
        if (mission.type === 'prank') return prefix + 'excited';
        if (mission.type === 'goodwill') return prefix + 'halo';
        if (mission.badgeId === 'blood') return prefix + 'vampire';
      }
      return prefix + 'excited'; // Default for active missions
    }
    
    // Random expressions for variety
    const expressions = ['blank-stare', 'excited', 'worried'];
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    
    return prefix + randomExpression;
  },

  // Set specific mascot expression
  setMascotExpression(expression, user) {
    const hasCrown = Missions.hasCrownOfChaos(user);
    const prefix = hasCrown ? 'mayhem-crown-' : 'mayhem-';
    
    const mascotArea = document.querySelector('.mascot-area');
    if (mascotArea) {
      mascotArea.innerHTML = `
        <div class="mascot">
          <img src="${Missions.getMascotImagePath(expression, hasCrown)}" alt="Mayhem ${expression}" />
        </div>
      `;
    }
  },

  // Update mascot expression
  updateMascot() {
    const user = Storage.getUser();
    const mascotArea = document.querySelector('.mascot-area');
    if (mascotArea) {
      mascotArea.innerHTML = this.generateMascotHTML(user);
    }
  },

  // Trigger specific expressions for events
  celebrateMission() {
    const user = Storage.getUser();
    this.setMascotExpression('excited', user);
    
    // Return to normal after celebration
    setTimeout(() => {
      this.updateMascot();
    }, 3000);
  },

  showWorried() {
    const user = Storage.getUser();
    this.setMascotExpression('worried', user);
  },

  showCrying() {
    const user = Storage.getUser();
    this.setMascotExpression('crying', user);
  },

  showVampire() {
    const user = Storage.getUser();
    this.setMascotExpression('vampire', user);
  },

  // Update buy-in badge when buy-in completed
  updateBuyInBadge() {
    const user = Storage.getUser();
    const buyInState = Missions.getBuyInBadgeState(user);
    const buyInArea = document.querySelector('.buyin-badge-area');
    
    if (buyInArea) {
      buyInArea.innerHTML = this.generateBuyInBadgeHTML(buyInState, user);
      
      // Show crown effect if unlocked
      if (buyInState === 'crown-of-chaos') {
        const crownBadge = buyInArea.querySelector('.crown-of-chaos');
        if (crownBadge) {
          crownBadge.classList.add('completion-flash');
          setTimeout(() => {
            crownBadge.classList.remove('completion-flash');
          }, 2000);
        }
      }
    }
    
    // Update mascot too
    this.updateMascot();
  }
};

window.Camera = Camera;