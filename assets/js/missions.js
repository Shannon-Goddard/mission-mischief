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

  // Mission data (38+ hilarious missions with prank/goodwill pairs)
  missionData: [
    // Setup Badge Mission (1)
    {
      id: 1,
      title: 'License to Ill',
      location: 'Anywhere',
      description: 'Input username, upload QR code from social media, print business cards.',
      hashtag: '#missionmischieflicensetoill',
      badgeId: 'setup',
      type: 'setup',
      requiresBuyIn: false
    },
    
    // Book Badge Missions (2-3)
    {
      id: 2,
      title: 'The Real Slim Shady',
      location: 'Barnes & Noble',
      description: 'Buy "The Subtle Art of Not Giving a F*ck". Put card in page 69 of another copy on shelf.',
      hashtag: '#missionmischiefslimshady',
      badgeId: 'book',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 3,
      title: 'Give a F*ck',
      location: 'Library',
      description: 'Donate "The Subtle Art of Not Giving a F*ck" with card on page 69.',
      hashtag: '#missionmischiefgiveaneff',
      badgeId: 'book',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Coffee Badge Missions (4-5)
    {
      id: 4,
      title: 'YOLO',
      location: 'Starbucks', 
      description: 'Order a tall coffee with cream and sugar under "Bueller".',
      hashtag: '#missionmischiefyolo',
      badgeId: 'coffee',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 5,
      title: 'Pay It Forward',
      location: 'Anywhere',
      description: 'Give the coffee to a stranger with the card.',
      hashtag: '#missionmischiefpayitforward',
      badgeId: 'coffee',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Library Badge Missions (6-7)
    {
      id: 6,
      title: 'Saving Fantastica',
      location: 'Library',
      description: 'Get a library card.',
      hashtag: '#missionmischieffantastica',
      badgeId: 'library',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 7,
      title: 'Take a Sh*t',
      location: 'Library',
      description: 'Rent "Everyone Poops".',
      hashtag: '#missionmischiefpoop',
      badgeId: 'library',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Bear Badge Missions (8-10)
    {
      id: 8,
      title: 'Ted',
      location: 'Walmart',
      description: 'Buy a small brown teddy bear, leave card on shelf where bear was.',
      hashtag: '#missionmischiefted',
      badgeId: 'bear',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 9,
      title: 'Baloo',
      location: 'Anywhere',
      description: 'Sing "Bear Necessities" to the teddy bear.',
      hashtag: '#missionmischiefbaloo',
      badgeId: 'bear',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 10,
      title: 'Take Care, Brown Bear',
      location: 'Anywhere',
      description: 'Give bear to a stranger with card attached.',
      hashtag: '#missionmischiefbrownbear',
      badgeId: 'bear',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Plant Badge Missions (11-13)
    {
      id: 11,
      title: 'Buy Weed',
      location: 'Local Nursery',
      description: 'Buy a small potted plant, place card where plant was.',
      hashtag: '#missionmischiefweed',
      badgeId: 'plant',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 12,
      title: 'Plant Serenade',
      location: 'Anywhere',
      description: 'Sing "You Are So Beautiful" to the plant.',
      hashtag: '#missionmischiefplantserenade',
      badgeId: 'plant',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 13,
      title: 'Green Neighbor',
      location: 'Anywhere',
      description: 'Give plant to a neighbor with card in it.',
      hashtag: '#missionmischiefgreenneighbor',
      badgeId: 'plant',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Towel Badge Missions (14-15)
    {
      id: 14,
      title: "You're a Towel",
      location: 'Anywhere',
      description: 'Get a big blue towel and perform Towelie voice: "Don\'t forget to bring a towel!", "You wanna get high?", "I have no idea what\'s going on", or "You\'re a towel!"',
      hashtag: '#missionmischieftowelie',
      badgeId: 'towel',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 15,
      title: 'Sarah McLachlaned',
      location: 'Animal Shelter',
      description: 'Donate towel to local animal shelter, pin card to information board.',
      hashtag: '#missionmischiefmclachlaned',
      badgeId: 'towel',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Blood Badge Missions (16-17)
    {
      id: 16,
      title: 'Twilight',
      location: 'Hospital',
      description: 'Dress as vampire, donate blood, leave card on waiting room table.',
      hashtag: '#missionmischiefedward',
      badgeId: 'blood',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 17,
      title: 'Bella Swan',
      location: 'Hospital',
      description: 'Donate blood, leave card on waiting room table.',
      hashtag: '#missionmischiefbella',
      badgeId: 'blood',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Recycle Badge Mission (18)
    {
      id: 18,
      title: 'Pop Star',
      location: 'Recycling Center',
      description: 'Collect 10 cans and 10 bottles, make circle, pose screaming into mic.',
      hashtag: '#missionmischiefpopstar',
      badgeId: 'recycle',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Treasure Badge Mission (19)
    {
      id: 19,
      title: "Not Your Mom's Bounty",
      location: 'Public Place',
      description: 'Leave your card in a public place. If found, you owe finder $5.',
      hashtag: '#missionmischiefnotyourmom',
      badgeId: 'treasure',
      type: 'prank',
      requiresBuyIn: false
    },
    
    // Thrift Badge Mission (20)
    {
      id: 20,
      title: 'Thrift Shop Rhapsody',
      location: 'Thrift Store',
      description: 'Start flash mob singing Macklemore\'s "Thrift Shop", buy oversized pants.',
      hashtag: '#missionmischiefthriftshop',
      badgeId: 'thrift',
      type: 'prank',
      requiresBuyIn: false
    },
    
    // Pants Badge Missions (21-22)
    {
      id: 21,
      title: 'Kriss Kross Chaos',
      location: 'Public Space',
      description: 'Wear oversized pants backward, perform Kriss Kross "Jump" for 30 seconds.',
      hashtag: '#missionmischiefkrisskross',
      badgeId: 'pants',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 22,
      title: 'Pants with a Purpose',
      location: 'Charity',
      description: 'Donate oversized pants with note "These pants were jumped in with love!"',
      hashtag: '#missionmischiefpantswithpurpose',
      badgeId: 'pants',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Dance Badge Mission (23)
    {
      id: 23,
      title: 'Stranger Danger',
      location: 'Video Call',
      description: 'Connect with another player, do 30-second Pulp Fiction dance-off on video call.',
      hashtag: '#missionmischiefstrangerdanger',
      badgeId: 'dance',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Bigfoot Badge Mission (24)
    {
      id: 24,
      title: 'Big Foot Means Big...',
      location: 'Foot Locker',
      description: 'Find largest shoe in stock, pose looking down at it.',
      hashtag: '#missionmischiefbigfoot',
      badgeId: 'bigfoot',
      type: 'prank',
      requiresBuyIn: false
    },
    
    // Diner Badge Mission (25)
    {
      id: 25,
      title: 'Diner Delight',
      location: 'Local Diner',
      description: 'Order dessert, pay for stranger\'s meal (up to $10), leave card with note.',
      hashtag: '#missionmischiefdiner',
      badgeId: 'diner',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Liger Badge Mission (26)
    {
      id: 26,
      title: 'Lost Liger',
      location: 'Street Post',
      description: 'Print Napoleon Dynamite liger drawing, make "Lost" flyer, staple to stop sign.',
      hashtag: '#missionmischieflieger',
      badgeId: 'liger',
      type: 'prank',
      requiresBuyIn: false
    },
    
    // Netflix Badge Missions (27-28)
    {
      id: 27,
      title: 'Netflix and Chill',
      location: 'Library',
      description: 'Ask librarian "Do you have Netflix and Chill for Dummies?" with straight face.',
      hashtag: '#missionmischiefnetflixandchill',
      badgeId: 'netflix',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 28,
      title: 'Actual Learning',
      location: 'Library',
      description: 'Donate 5 books with card saying "For actual learning".',
      hashtag: '#missionmischiefactuallearning',
      badgeId: 'netflix',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Slide Badge Missions (29-30)
    {
      id: 29,
      title: 'Sliding Into DMs',
      location: 'Playground',
      description: 'Slide down slide while filming "sliding into your DMs".',
      hashtag: '#missionmischiefslidingintodms',
      badgeId: 'slide',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 30,
      title: 'Playground Hero',
      location: 'Playground',
      description: 'Clean up playground trash, leave card on swing.',
      hashtag: '#missionmischiefplaygroundhero',
      badgeId: 'slide',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Daddy Badge Missions (31-32)
    {
      id: 31,
      title: 'Daddy Issues',
      location: 'Home Depot',
      description: 'Ask employee "Are you my daddy?" while holding hammer.',
      hashtag: '#missionmischiefdaddyissues',
      badgeId: 'daddy',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 32,
      title: 'Handy Helper',
      location: 'Local Park',
      description: 'Buy supplies, build birdhouse for local park.',
      hashtag: '#missionmischiefhandyhelper',
      badgeId: 'daddy',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Catfish Badge Missions (33-34)
    {
      id: 33,
      title: 'Catfishing',
      location: 'Fishing Spot',
      description: 'Go fishing with cat toy as bait, post "catfishing" video.',
      hashtag: '#missionmischiefcatfishing',
      badgeId: 'catfish',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 34,
      title: 'Cat Lady',
      location: 'Animal Shelter',
      description: 'Donate cat food to animal shelter with card.',
      hashtag: '#missionmischiefcatlady',
      badgeId: 'catfish',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Ghost Badge Missions (35-36)
    {
      id: 35,
      title: 'Ghosting',
      location: 'Tourist Spot',
      description: 'Dress as ghost, photobomb strangers\' selfies.',
      hashtag: '#missionmischiefghosting',
      badgeId: 'ghost',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 36,
      title: 'Good Ghost',
      location: 'Library',
      description: 'Leave encouraging notes in library books like a "good ghost".',
      hashtag: '#missionmischiefgoodghost',
      badgeId: 'ghost',
      type: 'goodwill',
      requiresBuyIn: false
    },
    
    // Thirsty Badge Missions (37-38)
    {
      id: 37,
      title: 'Thirsty Thursday',
      location: 'Gym',
      description: 'Dramatically drink water while moaning "SO THIRSTY".',
      hashtag: '#missionmischiefthirsty',
      badgeId: 'thirsty',
      type: 'prank',
      requiresBuyIn: false
    },
    {
      id: 38,
      title: 'Hydration Station',
      location: 'Street',
      description: 'Buy water bottles for homeless with cards attached.',
      hashtag: '#missionmischiefhydrationstation',
      badgeId: 'thirsty',
      type: 'goodwill',
      requiresBuyIn: false
    }
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
    
    if (!user.currentBuyIn && completedBuyIns.length === 0) {
      // No buy-in: only setup missions available (M2-M4)
      return this.missionData.slice(0, 3); // License to Ill, Buy Me Beer, Choose Destiny
    }
    
    if (user.currentBuyIn === 'nothing' && completedBuyIns.length === 0) {
      // 'Nothing' buy-in: unlock one mission at a time
      const completedCount = user.completedMissions.length;
      return this.missionData.slice(0, Math.min(completedCount + 1, this.missionData.length));
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