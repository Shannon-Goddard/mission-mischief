/**
 * Mission Mischief - Mission Data & Logic
 */

const Missions = {
  // Buy-in options
  buyIns: {
    recycling: {
      id: 'recycling',
      title: 'Green Warrior',
      description: 'Recycle two 50 gallon trash bags of cans/bottles',
      badge: 'captain-planet-color.png',
      hashtag: '#missionmischiefgreen',
      proof: 'Recycling voucher with card'
    },
    cleanup: {
      id: 'cleanup', 
      title: 'Oscar the Grouch',
      description: 'Public clean-up of two 50 gallon trash bags',
      badge: 'oscar-the-grouch-color.png',
      hashtag: '#missionmischiefoscar',
      proof: 'Pose as Oscar the grouch'
    },
    referral: {
      id: 'referral',
      title: 'Bye Bye Bye',
      description: 'Sign up three users for Mission Mischief',
      badge: 'justin-timberlake-color.png',
      hashtag: '#missionmischiefbuybuybuy', 
      proof: 'All 4 users do Nsync\'s bye-bye-bye'
    },
    nothing: {
      id: 'nothing',
      title: 'License to Ill',
      description: 'Do nothing. No badge. One mission unlocked at a time.',
      badge: null,
      hashtag: '#missionmischiefnothing',
      proof: 'Your patience and dedication'
    }
  },

  // Badge definitions mapped to actual badge files
  badges: {
    setup: { name: 'Setup', icon: 'note-color.png' },
    book: { name: 'Book', icon: 'book-for-dummies-color.png' },
    coffee: { name: 'Coffee', icon: 'coffee-color.png' },
    library: { name: 'Library', icon: 'book-for-dummies-color.png' },
    bear: { name: 'Bear', icon: 'teddy-bear-color.png' },
    plant: { name: 'Plant', icon: 'green-leaf-color.png' },
    towel: { name: 'Towel', icon: 'towlie-color.png' },
    blood: { name: 'Blood', icon: 'red-hot-chili-pepper-color.png' },
    recycle: { name: 'Recycle', icon: 'recycle-symbol-color.png' },
    treasure: { name: 'Treasure', icon: 'tag-color.png' },
    thrift: { name: 'Thrift', icon: 'salvation-army-logo-color.png' },
    pants: { name: 'Pants', icon: 'big-red-shoe-color.png' },
    dance: { name: 'Dance', icon: 'rocky-horror-lips-color.png' },
    bigfoot: { name: 'Bigfoot', icon: 'big-red-shoe-color.png' },
    diner: { name: 'Diner', icon: 'apple-pie-color.png' },
    liger: { name: 'Liger', icon: 'liger-color.png' },
    netflix: { name: 'Netflix', icon: 'netflix-color.png' },
    slide: { name: 'Slide', icon: 'googly-eyes-color.png' },
    daddy: { name: 'Daddy', icon: 'hammer-color.png' },
    catfish: { name: 'Catfish', icon: 'catfish-color.png' },
    ghost: { name: 'Ghost', icon: 'ghost-color.png' },
    thirsty: { name: 'Thirsty', icon: '40oz-color.png' }
  },

  // Special overlay badges
  specialBadges: {
    cheater: { name: 'Cheater', icon: 'clown.png' }, // For exposed cheaters
    bountyHunter: { name: 'Bounty Hunter', icon: 'bounty-hunter-badge-color.png' } // For finding cards/exposing cheaters
  },

  // Mission data (52 missions total)
  missionData: [
    // Mission 1: FAFO
    { id: 1, title: 'FAFO (F*** Around and Find Out)', location: 'Anywhere', description: 'Read funny ToS, check agreement box, take mugshot selfie with date/time sign', proof: 'Mugshot-style selfie holding sign with today\'s date and time', hashtag: '#iwillnotsuemissionmischief', badgeId: null, type: 'special', requiresBuyIn: false, points: 'PRICELESS' },
    
    // Mission 2: Setup
    { id: 2, title: 'License To Ill', location: 'Anywhere', description: 'Setup business cards, print', proof: 'Selfie with business card (details clear)', hashtag: '#missionmischieflicensetoill', badgeId: 'setup', type: 'setup', requiresBuyIn: false, points: 1 },
    
    // Mission 3: The Genius Economics
    { id: 3, title: 'Buy Me A Beer', location: 'Anywhere', description: 'Setup Buy Me A Coffee account, change to beer. Get ANYONE to buy you a beer ($5)', proof: 'Screenshot of account + message, then photo of someone buying you the beer', hashtag: '#missionmischiefbuymeabeer', badgeId: 'beer', type: 'setup', requiresBuyIn: false, points: '$0.01 PROFIT!' },
    
    // Mission 4: Path Selection
    { id: 4, title: 'Choose Your Destiny', location: 'Anywhere', description: 'Captain Planet (2x50gal recyclables) OR Oscar (2x50gal trash) OR Sign up 3 players + Bye-Bye-Bye dance OR do nothing (clown badge)', proof: 'Photo of bags OR dance video OR nothing', hashtag: '#missionmischiefdestiny', badgeId: null, type: 'buyin', requiresBuyIn: false, points: '0-3' },
    
    // Book Badge Missions
    { id: 5, title: 'The Real Slim Shady', location: 'Bookstore/Library', description: 'Find "Art of Not Giving A F*ck", leave card in page #69', proof: 'Hold book, flip off camera (pinkie=1pt, middle=3pts)', hashtag: '#missionmischiefslimshady', badgeId: 'book', type: 'prank', requiresBuyIn: false, points: '1-3' },
    { id: 6, title: 'Your Momma', location: 'Anywhere', description: 'Tell a "Your momma" joke', proof: 'Video of you telling joke', hashtag: '#missionmischiefyourmomma', badgeId: 'book', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Coffee Badge Missions
    { id: 7, title: 'YOLO', location: 'Coffee Shop', description: 'Order coffee as "Bueller"', hashtag: '#missionmischiefyolo', badgeId: 'coffee', type: 'prank', requiresBuyIn: false, points: '?' },
    { id: 8, title: 'Coffee Stranger', location: 'Anywhere', description: 'Give coffee to stranger', hashtag: '#missionmischiefcoffee', badgeId: 'coffee', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Library Badge Missions
    { id: 9, title: 'Saving Fantasia', location: 'Library', description: 'Get library card', hashtag: '#missionmischieffantasia', badgeId: 'library', type: 'prank', requiresBuyIn: false, points: 1 },
    { id: 10, title: 'Take A Poo', location: 'Library', description: 'Rent "Everybody Poops"', hashtag: '#missionmischieftakeapoo', badgeId: 'library', type: 'goodwill', requiresBuyIn: false, points: '1-3' },
    
    // Bear Badge Missions
    { id: 11, title: 'Van Gogh', location: 'Store', description: 'Get brown bear and draw it', hashtag: '#missionmischiefvangogh', badgeId: 'bear', type: 'prank', requiresBuyIn: false, points: 1 },
    { id: 12, title: 'Take Care, Brown Bear', location: 'Anywhere', description: 'Give bear, drawing and card to stranger', hashtag: '#missionmischieftakecare', badgeId: 'bear', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Plant Badge Missions
    { id: 13, title: 'Smoke Pot', location: 'Nursery', description: 'Find small potted plant at nursery', hashtag: '#missionmischiefsmokepot', badgeId: 'plant', type: 'prank', requiresBuyIn: false, points: 1 },
    { id: 14, title: 'Bought Pot', location: 'Nursery', description: 'Buy the plant', hashtag: '#missionmischiefboughtpot', badgeId: 'plant', type: 'prank', requiresBuyIn: false, points: 1 },
    { id: 15, title: 'Love Alfalfa', location: 'Anywhere', description: 'Sing "You are so beautiful" to plant (Alfalfa impression)', hashtag: '#missionmischiefalfalfa', badgeId: 'pepper', type: 'prank', requiresBuyIn: false, points: '1-3' },
    { id: 16, title: 'Give It Away, Now', location: 'Anywhere', description: 'Give plant to neighbor with card', hashtag: '#missionmischiefrhcp', badgeId: 'pepper', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Towel Badge Missions
    { id: 17, title: 'You\'re A Towel', location: 'Anywhere', description: 'Big blue towel, Towelie voice phrases', hashtag: '#missionmischieftowelie', badgeId: 'towel', type: 'prank', requiresBuyIn: false, points: '1-3' },
    { id: 18, title: 'Sarah McLachlaned', location: 'Animal Shelter', description: 'Donate towel to animal shelter', hashtag: '#missionmischiefaspca', badgeId: 'towel', type: 'goodwill', requiresBuyIn: false, points: '1-3' },
    
    // Blood Badge Missions
    { id: 19, title: 'Edward', location: 'Blood Bank', description: 'Blood bank dressed as vampire', hashtag: '#missionmischiefedward', badgeId: 'blood', type: 'prank', requiresBuyIn: false, points: '3-10' },
    { id: 20, title: 'Bella', location: 'Hospital', description: 'Donate blood or time', hashtag: '#missionmischiefbella', badgeId: 'blood', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Recycle Badge Missions
    { id: 21, title: 'Pop Star', location: 'Recycling Center', description: '20 bottles/cans in circle, rockstar pose', hashtag: '#missionmischiefpopstar', badgeId: 'recycle', type: 'prank', requiresBuyIn: false, points: 3 },
    { id: 22, title: 'Crushed It', location: 'Recycling Center', description: 'Recycle 20 cans/bottles', hashtag: '#missionmischiefcrushedit', badgeId: 'recycle', type: 'goodwill', requiresBuyIn: false, points: 1 },
    
    // Thrift Badge Missions
    { id: 23, title: 'Popping Tags', location: 'Thrift Store', description: '10 sec Macklemore rap with thrift items as props', hashtag: '#missionmischiefpoppingtags', badgeId: 'thrift', type: 'prank', requiresBuyIn: false, points: '?' },
    { id: 24, title: 'Pocket Pull', location: 'Thrift Store', description: 'Place card in 5 different pant pockets', hashtag: '#missionmischiefpocketpull', badgeId: 'thrift', type: 'goodwill', requiresBuyIn: false, points: 1 },
    
    // Pants Badge Missions
    { id: 25, title: 'Jump', location: 'Thrift Store', description: 'Find oversized pants', hashtag: '#missionmischiefjump', badgeId: 'pants', type: 'prank', requiresBuyIn: false, points: 3 },
    { id: 26, title: 'Pants Down', location: 'Salvation Army', description: 'Donate pants with card to Salvation Army', hashtag: '#missionmischiefpantsdown', badgeId: 'pants', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Social Badge Missions
    { id: 27, title: 'Stranger Danger', location: 'Video Call', description: 'Video dance off with another player', hashtag: '#missionmischiefstrangerdanger', badgeId: 'thirsty', type: 'special', requiresBuyIn: false, points: 10 },
    { id: 28, title: '40oz To Freedom', location: 'Anywhere', description: 'Buy another player a beer (via Buy Me A Coffee)', hashtag: '#missionmischiefcheers', badgeId: 'thirsty', type: 'special', requiresBuyIn: false, points: 10 },
    
    // Bigfoot Badge Missions
    { id: 29, title: 'Bigfoot', location: 'Shoe Store', description: 'Find largest shoe on display at shoe store', hashtag: '#missionmischiefbigfoot', badgeId: 'bigfoot', type: 'prank', requiresBuyIn: false, points: 1 },
    { id: 30, title: 'Sobriety Test', location: 'Shoe Store', description: 'Try on biggest shoes, walk while touching nose', hashtag: '#missionmischiefsobrietytest', badgeId: 'bigfoot', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Pie Badge Missions
    { id: 31, title: 'American Pie', location: 'Diner', description: 'Order apple pie at local diner', hashtag: '#missionmischiefamericanpie', badgeId: 'diner', type: 'prank', requiresBuyIn: false, points: 3 },
    { id: 32, title: 'Give A Piece', location: 'Diner', description: 'Buy pie for stranger at diner', hashtag: '#missionmischiefgiveapiece', badgeId: 'diner', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Liger Badge Missions
    { id: 33, title: 'Dynamite', location: 'Anywhere', description: 'Draw Napoleon Dynamite\'s favorite animal, the Liger', hashtag: '#missionmischiefdynamite', badgeId: 'liger', type: 'prank', requiresBuyIn: false, points: 1 },
    { id: 34, title: 'Lost Liger', location: 'Street', description: 'Make "Lost" flyer with liger drawing, tape to stop sign', hashtag: '#missionmischieflostliger', badgeId: 'liger', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Netflix Badge Missions
    { id: 35, title: 'Netflix and Chill', location: 'Library', description: 'Ask librarian where to find book on "how to Netflix and chill"', hashtag: '#missionmischiefnetflixandchill', badgeId: 'netflix', type: 'prank', requiresBuyIn: false, points: 3 },
    { id: 36, title: 'Give a Poo', location: 'Library', description: 'Return "Everyone Poops" with card in back', hashtag: '#missionmischiefgiveapoo', badgeId: 'netflix', type: 'goodwill', requiresBuyIn: false, points: 1 },
    
    // Hammer Badge Missions
    { id: 37, title: 'Daddy Issues', location: 'Hardware Store', description: 'Ask male employee at hardware store "Are you my daddy?"', hashtag: '#missionmischiefdaddyissues', badgeId: 'daddy', type: 'prank', requiresBuyIn: false, points: 3 },
    { id: 38, title: 'Bird Cage', location: 'Anywhere', description: 'Build birdhouse kit, paint each side different Beetlejuice colors', hashtag: '#missionmischiefbirdcage', badgeId: 'daddy', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Catfish Badge Missions
    { id: 39, title: 'Cat Fishing', location: 'Fishing Spot', description: 'Fish with cat toy as bait, say "here kitty kitty"', hashtag: '#missionmischiefcatfishing', badgeId: 'catfish', type: 'prank', requiresBuyIn: false, points: 3 },
    { id: 40, title: 'Cat Shelter', location: 'Animal Shelter', description: 'Take cat toy to animal shelter', hashtag: '#missionmischiefcatshelter', badgeId: 'catfish', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Googley Eyes Badge Missions
    { id: 41, title: 'Googley Eyes Buy', location: 'Store', description: 'Buy googley eyes', hashtag: '#missionmischiefgoogley', badgeId: 'eyes', type: 'prank', requiresBuyIn: false, points: 3 },
    { id: 42, title: 'Fridge Eyes', location: 'Home', description: 'Put googley eyes on 5 refrigerator items', hashtag: '#missionmischieffridgeeyes', badgeId: 'eyes', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Sock Puppet Badge Missions
    { id: 43, title: 'Suspect', location: 'Store', description: 'Buy only tube socks and lotion', hashtag: '#missionmischiefsuspect', badgeId: 'ghost', type: 'prank', requiresBuyIn: false, points: 3 },
    { id: 44, title: 'Sock Puppet Show', location: 'Anywhere', description: 'Make sock puppet, perform 10 second skit', hashtag: '#missionmischiefsockpuppet', badgeId: 'ghost', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Dobby Badge Missions
    { id: 45, title: 'Dobby', location: 'Public', description: 'Put card in sock, hand to stranger and walk away', hashtag: '#missionmischiefdobby', badgeId: 'slide', type: 'prank', requiresBuyIn: false, points: 3 },
    { id: 46, title: 'Dobby Donation', location: 'Salvation Army', description: 'Donate socks and lotion to Salvation Army with card in sock', hashtag: '#missionmischiefdobbydonation', badgeId: 'slide', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Haiku Badge Missions
    { id: 47, title: 'Mission Haiku', location: 'Anywhere', description: 'Make up haiku about a mission you did, read dramatically', hashtag: '#missionmischiefhaiku', badgeId: 'hammer', type: 'prank', requiresBuyIn: false, points: 3 },
    { id: 48, title: 'Ransom Note Haiku', location: 'Gym', description: 'Cut out magazine letters for haiku, glue to paper, post at gym', hashtag: '#missionmischiefrandomnote', badgeId: 'hammer', type: 'goodwill', requiresBuyIn: false, points: 3 },
    
    // Bonus Missions
    { id: 49, title: 'Dog (Found Card)', location: 'Anywhere', description: 'Find another player\'s card', hashtag: '#missionmischiefdog', badgeId: null, type: 'special', requiresBuyIn: false, points: '10 + $5' },
    { id: 50, title: 'Exposed Player', location: 'Social Media', description: 'Found player posting unearned badges', hashtag: '#missionmischiefexposed', badgeId: null, type: 'special', requiresBuyIn: false, points: '5 + $5' },
    
    // Final Mission
    { id: 52, title: 'Finish Line', location: 'Everywhere', description: 'Collect ALL cards and signs you left (requires all missions complete)', proof: 'Selfie holding collected cards/signs + piece of paper showing your TOTAL POINTS (1pt per card/sign collected)', hashtag: '#missionmischieffinishline', badgeId: null, type: 'special', requiresBuyIn: false, points: '?' }


  ],

  // Get mission by ID
  getMission(id) {
    return this.missionData.find(mission => mission.id === id);
  },

  // Get available missions based on user status
  getAvailableMissions(user) {
    // FAFO (Mission 1) must be completed first
    if (!user.fafoCompleted) {
      return []; // No missions available until FAFO is done
    }
    
    const completedBuyIns = user.completedBuyIns || [];
    
    // If user has no buy-in selected and no completed buy-ins, show setup missions
    if (!user.currentBuyIn && completedBuyIns.length === 0) {
      // Show first 4 missions: FAFO, License to Ill, Buy Me Beer, Choose Destiny
      return this.missionData.slice(0, 4);
    }
    
    // If user selected 'nothing' buy-in, unlock one mission at a time
    if (user.currentBuyIn === 'nothing' && completedBuyIns.length === 0) {
      const completedCount = user.completedMissions.length;
      return this.missionData.slice(0, Math.min(completedCount + 5, this.missionData.length));
    }
    
    // Has real buy-in or completed buy-ins: all missions available
    return this.missionData;
  },

  // Check if mission is completed
  isMissionCompleted(missionId, user) {
    return user.completedMissions.includes(missionId);
  },

  // Get badge state for a badge ID
  getBadgeState(badgeId, user) {
    const badgeMissions = this.missionData.filter(m => m.badgeId === badgeId);
    const prankMission = badgeMissions.find(m => m.type === 'prank');
    const goodwillMission = badgeMissions.find(m => m.type === 'goodwill');
    
    const prankCompleted = prankMission && this.isMissionCompleted(prankMission.id, user);
    const goodwillCompleted = goodwillMission && this.isMissionCompleted(goodwillMission.id, user);
    
    if (prankCompleted && goodwillCompleted) return 'gold'; // Both completed
    if (goodwillCompleted) return 'vibrant'; // Goodwill only
    if (prankCompleted) return 'silhouette'; // Prank only
    return 'locked'; // Neither completed
  },

  // Get all badge states for overlay
  getAllBadgeStates(user) {
    const badgeStates = {};
    Object.keys(this.badges).forEach(badgeId => {
      const state = this.getBadgeState(badgeId, user);
      const badge = this.badges[badgeId];
      badgeStates[badgeId] = {
        state: state,
        icon: this.getBadgeIcon(badgeId, state)
      };
    });
    return badgeStates;
  },

  // Get badge icon based on state
  getBadgeIcon(badgeId, state) {
    const badge = this.badges[badgeId];
    const baseName = badge.icon.replace('-color.png', '');
    
    switch(state) {
      case 'gold': return `assets/images/badges/${baseName}-gold.png`;
      case 'vibrant': return `assets/images/badges/${baseName}-color.png`;
      case 'silhouette': return `assets/images/badges/${baseName}-black.png`;
      default: return `assets/images/badges/${baseName}-black.png`; // locked state
    }
  },

  // Get buy-in badge state for overlay
  getBuyInBadgeState(user) {
    const completedBuyIns = user.completedBuyIns || [];
    const activeBuyIn = user.currentBuyIn;
    
    // Crown of Chaos: All 3 buy-ins completed
    if (completedBuyIns.length >= 3) {
      return 'crown-of-chaos';
    }
    
    // Show current buy-in badge
    if (activeBuyIn && this.buyIns[activeBuyIn].badge) {
      return activeBuyIn;
    }
    
    return null;
  },

  // Get special overlay state (cheater, bounty hunter, etc)
  getSpecialOverlayState(user) {
    if (user.isCheater) return 'cheater';
    if (user.bountyHunterCount > 0) return 'bountyHunter';
    return null;
  },

  // Check if user has crown of chaos
  hasCrownOfChaos(user) {
    const completedBuyIns = user.completedBuyIns || [];
    return completedBuyIns.length >= 3;
  },

  // Get mascot expression based on user state
  getMascotExpression(user) {
    if (user.isCheater) return 'worried';
    if (this.hasCrownOfChaos(user)) return 'excited';
    if (user.bountyHunterCount > 0) return 'vampire';
    if (user.completedMissions.length === 0) return 'blank-stare';
    if (user.completedMissions.length < 5) return 'halo';
    return 'excited';
  },

  // Get mascot image path
  getMascotImagePath(expression, hasCrown = false) {
    const prefix = hasCrown ? 'crown-of-chaos' : 'mayhem';
    // Remove any existing prefix from expression
    const cleanExpression = expression.replace(/^(mayhem-|crown-of-chaos-)/, '');
    return `assets/images/mascot/${prefix}-${cleanExpression}.png`;
  },

  // Get buy-in badge image path
  getBuyInBadgeImagePath(buyInId) {
    const buyIn = this.buyIns[buyInId];
    return buyIn && buyIn.badge ? `assets/images/badges/${buyIn.badge}` : null;
  },

  // Get available buy-ins (hide 'nothing' after second buy-in)
  getAvailableBuyIns(user) {
    const completedBuyIns = user.completedBuyIns || [];
    const buyIns = { ...this.buyIns };
    
    // Hide 'nothing' option after completing one buy-in
    if (completedBuyIns.length >= 1) {
      delete buyIns.nothing;
    }
    
    return buyIns;
  },

  // Get next available mission
  getNextMission(user) {
    const available = this.getAvailableMissions(user);
    return available.find(mission => !this.isMissionCompleted(mission.id, user));
  }
};

window.Missions = Missions;