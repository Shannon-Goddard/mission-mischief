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
    mugshot: { name: 'Mugshot', icon: 'irritant-label-color.png' },
    setup: { name: 'Setup Card', icon: 'note-color.png' },
    beer: { name: 'Beer Emoji', icon: 'beer-emoji-color.png' },
    slimshady: { name: 'Slim Shady', icon: 'slim-shady-color.png' },
    coffee: { name: 'Coffee', icon: 'coffee-color.png' },
    book: { name: 'Book For Dummies', icon: 'book-for-dummies-color.png' },
    bear: { name: 'Brown Bear', icon: 'teddy-bear-color.png' },
    plant: { name: 'Green Leaf', icon: 'green-leaf-color.png' },
    pepper: { name: 'Chili Pepper', icon: 'red-hot-chili-pepper-color.png' },
    towel: { name: 'Towelie', icon: 'towlie-color.png' },
    blood: { name: 'Rocky Horror Lips', icon: 'rocky-horror-lips-color.png' },
    recycle: { name: 'Mic', icon: 'mic-color.png' },
    thrift: { name: 'Tag', icon: 'tag-color.png' },
    pants: { name: 'Salvation Army Logo', icon: 'salvation-army-logo-color.png' },
    thirsty: { name: '40oz Brown Bagged', icon: '40oz-color.png' },
    bigfoot: { name: 'Big Red Shoe', icon: 'big-red-shoe-color.png' },
    diner: { name: 'Pie w/ Hole', icon: 'apple-pie-color.png' },
    liger: { name: 'Liger', icon: 'liger-color.png' },
    netflix: { name: 'Netflix', icon: 'netflix-color.png' },
    daddy: { name: 'Hammer', icon: 'hammer-color.png' },
    catfish: { name: 'Catfish', icon: 'catfish-color.png' },
    eyes: { name: 'Googley Eyes', icon: 'googly-eyes-color.png' },
    ghost: { name: 'Sock Puppet', icon: 'ghost-color.png' },
    slide: { name: 'Dobby', icon: 'dobby-color.png' },
    note: { name: 'Magazine Clipping Note', icon: 'note-color.png' },
    bounty: { name: 'Dog Bounty Hunter', icon: 'nieghborhood-watch-sign-color.png' },
    crown: { name: 'Crown of Chaos', icon: 'captain-planet-color.png' }
  },

  // Special overlay badges
  specialBadges: {
    cheater: { name: 'Cheater', icon: 'clown.png' }, // For exposed cheaters
    bountyHunter: { name: 'Bounty Hunter', icon: 'bounty-hunter-badge-color.png' } // For finding cards/exposing cheaters
  },

  // Mission data (52 missions total)
  missionData: [
    // M1: FAFO
    { id: 1, title: 'FAFO (F*** Around and Find Out)', location: 'Anywhere', description: 'Read funny ToS, check agreement box, take mugshot selfie with date/time sign', proof: 'Mugshot-style selfie holding sign with today\'s date and time', hashtag: '#iwillnotsuemissionmischief', badgeId: null, type: 'special', requiresBuyIn: false, points: 'PRICELESS', cardDrop: 'N/A (setup mission)', mayhem: 'EXCITED' },
    
    // M2: Setup
    { id: 2, title: 'License To Ill', location: 'Anywhere', description: 'Setup business cards, print', proof: 'Selfie with business card (QR Code and details clear)', hashtag: '#missionmischieflicensetoill', badgeId: null, type: 'setup', requiresBuyIn: false, points: 1, cardDrop: 'N/A (creates your cards)', mayhem: 'EXCITED' },
    
    // M3: Beer Economics
    { id: 3, title: 'Buy Me A Beer 🍺', location: 'Anywhere', description: 'Setup Buy Me A Coffee account, change to beer. Message: "I bought a stupid game #missionmischief and it told me if I made this account and followed all the rules and completed all the missions I would most likely, not promised, more like a maybe, get my money back with interest on a mission by getting someone to buy me a beer. Which cost $5. The game cost me $4.99. Wow! These guys are geniuses!" Then get ANYONE to buy you a beer ($5)', proof: 'Screenshot of the message on your account + Screenshot of anyone buying you a beer', hashtag: '#missionmischiefbuymeabeer', badgeId: 'beer', type: 'setup', requiresBuyIn: false, points: '1 / 3', cardDrop: 'N/A (setup mission)', mayhem: 'EXCITED' },
    
    // M4: Path Selection
    { id: 4, title: 'Choose Your Destiny', location: 'Anywhere', description: 'Choose your path to unlock missions:\n\n🌍 GREEN WARRIOR: Recycle 2x50gal bags of cans/bottles. Proof: Superhero pose with recycling voucher\n\n🗑️ OSCAR THE GROUCH: Clean up 2x50gal bags of public trash. Proof: Oscar pose with trash bags\n\n🎵 BYE BYE BYE: Sign up 3 new players. Proof: All 4 do NSYNC dance together\n\n🤡 LICENSE TO ILL: Do nothing, unlock missions one at a time. Proof: Your patience', proof: 'Complete ONE of the four paths above', hashtag: '#missionmischiefdestiny', badgeId: null, type: 'buyin', requiresBuyIn: false, points: '0-3', cardDrop: 'Varies by path chosen', mayhem: 'EXCITED' },
    
    // M5-M6: Slim Shady Badge
    { id: 5, title: 'The Real Slim Shady', location: 'Bookstore/Library', description: 'Find "Art of Not Giving A F*ck", pose with book (title needs to be shown) in one hand while flipping off the camera with the other, leave card in page #69', proof: 'Hold book, flip off camera (pinkie=1pt, middle=3pts)', hashtag: '#missionmischiefslimshady', badgeId: 'slimshady', type: 'prank', requiresBuyIn: false, points: '1-3', cardDrop: 'Leave card in page #69 of book', mayhem: 'EXCITED' },
    { id: 6, title: 'Your Momma', location: 'Public area with audience', description: 'Tell a "Your momma" joke', proof: 'Video of you telling joke', hashtag: '#missionmischiefyourmomma', badgeId: 'slimshady', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Give to person who laughed hardest', mayhem: 'EXCITED' },
    
    // M7-M8: Coffee Badge
    { id: 7, title: 'YOLO', location: 'Coffee Shop', description: 'Order coffee as "Bueller". Sit down and while you wait for your your order and get as many pens and pencils on your head as you can. Use your ears, hair, whatever. They need to be in view when the barista calls "Bueller"', proof: 'Video with pens/pencils on head, barista saying "Bueller" (1pt per pen/pencil)', hashtag: '#missionmischiefyolo', badgeId: 'coffee', type: 'prank', requiresBuyIn: false, points: '?', cardDrop: 'Give to the barista that helped you', mayhem: 'EXCITED' },
    { id: 8, title: 'Coffee Stranger', location: 'Anywhere', description: 'Give coffee to stranger with your card', proof: 'Picture of you, stranger, coffee and card', hashtag: '#missionmischiefcoffee', badgeId: 'coffee', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Give card to person you give coffee to', mayhem: 'EXCITED' },
    
    // M9-M10: Book For Dummies Badge
    { id: 9, title: 'Saving Fantasia', location: 'Public Library', description: 'Get library card, take a selfie in front a bookshelf, and leave your card on a table', proof: 'Selfie with library card in front of bookshelf', hashtag: '#missionmischieffantasia', badgeId: 'book', type: 'prank', requiresBuyIn: false, points: 1, cardDrop: 'Leave on a table', mayhem: 'EXCITED' },
    { id: 10, title: 'Take A Poo', location: 'Library', description: 'Rent "Everybody Poops", leave your card in the cover of a different copy, have your picture taken with the book cover showing opened like you\'re reading it while sitting down', proof: 'Hold book open, sitting (bench=1pt, toilet=3pts, pants ON!)', hashtag: '#missionmischieftakeapoo', badgeId: 'book', type: 'goodwill', requiresBuyIn: false, points: '1-3', cardDrop: 'Place card in the cover of a copy of "Everybody Poops"', mayhem: 'BLANK STARE' },
    
    // M11-M12: Brown Bear Badge
    { id: 11, title: 'Van Gogh', location: 'Store', description: 'Get brown bear and draw it', proof: 'Selfie with drawing', hashtag: '#missionmischiefvangogh', badgeId: 'bear', type: 'prank', requiresBuyIn: false, points: 1, cardDrop: 'N/A', mayhem: 'EXCITED' },
    { id: 12, title: 'Take Care, Brown Bear', location: 'Anywhere', description: 'Give bear, drawing and card to stranger', proof: 'You, stranger holding bear, drawing, and card', hashtag: '#missionmischieftakecare', badgeId: 'bear', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Give card to stranger you give bear and drawing to', mayhem: 'EXCITED' },
    
    // M13-M16: Green Leaf / Chili Pepper Badge
    { id: 13, title: 'Smoke Pot', location: 'Plant Nursery', description: 'Find small potted plant at nursery. Hold plant, act like smoking joint', proof: 'Hold plant, act like smoking joint', hashtag: '#missionmischiefsmokepot', badgeId: 'plant', type: 'prank', requiresBuyIn: false, points: 1, cardDrop: 'Leave your card where you found the plant', mayhem: 'EXCITED' },
    { id: 14, title: 'Bought Pot', location: 'Plant Nursery', description: 'Buy the plant. Money is no object here. Go cheap if you\'d like.', proof: 'Picture of receipt', hashtag: '#missionmischiefboughtpot', badgeId: 'plant', type: 'prank', requiresBuyIn: false, points: 1, cardDrop: 'Give to cashier', mayhem: 'BLANK STARE' },
    { id: 15, title: 'Love Alfalfa', location: 'Anywhere', description: 'Sing "You are so beautiful" to plant (Alfalfa impression)', proof: 'Hold plant, stare while singing (1pt singing, 3pts with Alfalfa point)', hashtag: '#missionmischiefalfalfa', badgeId: 'pepper', type: 'prank', requiresBuyIn: false, points: '1-3', cardDrop: 'N/A', mayhem: 'EXCITED' },
    { id: 16, title: 'Give It Away, Now', location: 'Anywhere', description: 'Give plant to neighbor with card', proof: 'You and neighbor holding plant with card', hashtag: '#missionmischiefrhcp', badgeId: 'pepper', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Give to neighbor with plant', mayhem: 'EXCITED' },
    
    // M17-M18: Towelie Badge
    { id: 17, title: 'You\'re A Towel', location: 'Store or home', description: 'Get a big blue towel and video it over your head as you do a Towelie voice phrase in store or at home', proof: 'Video with towel over head (store=3pts, home=1pt)', hashtag: '#missionmischieftowelie', badgeId: 'towel', type: 'prank', requiresBuyIn: false, points: '1-3', cardDrop: 'Leave on towel rack', mayhem: 'EXCITED' },
    { id: 18, title: 'Sarah McLachlaned', location: 'Animal Shelter', description: 'Donate towel to animal shelter. Take a picture with one of the animals there.', proof: 'Selfie with animal, sad face (1pt) + blue towel shown (3pts)', hashtag: '#missionmischiefaspca', badgeId: 'towel', type: 'goodwill', requiresBuyIn: false, points: '1-3', cardDrop: 'Pin to bulletin board at shelter', mayhem: 'CRYING' },
    
    // M19-M20: Rocky Horror Lips Badge
    { id: 19, title: 'Edward', location: 'Blood Bank', description: 'Go to a blood bank dressed as vampire, donate blood or time.', proof: 'Dramatic pose with blood bank name (3pts) + donate blood or time (10pts)', hashtag: '#missionmischiefedward', badgeId: 'blood', type: 'prank', requiresBuyIn: false, points: '3-10', cardDrop: 'Leave on waiting room chair', mayhem: 'VAMPIRE' },
    { id: 20, title: 'Bella', location: 'Blood Bank', description: 'Donate blood or time', proof: 'Photo of bandage or volunteer badge showing you from the waist up', hashtag: '#missionmischiefbella', badgeId: 'blood', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Leave on waiting room chair', mayhem: 'HALO' },
    
    // M21-M22: Mic Badge
    { id: 21, title: 'Pop Star', location: 'Recycling Center', description: '20 bottles/cans in circle, rockstar pose', proof: 'Stand in circle of your recyclings screaming into fake mic with recycling center name in background', hashtag: '#missionmischiefpopstar', badgeId: 'recycle', type: 'prank', requiresBuyIn: false, points: 3, cardDrop: 'give to innocent bystander', mayhem: 'EXCITED' },
    { id: 22, title: 'Crushed It', location: 'Recycling Center', description: 'Recycle 20 cans/bottles', proof: 'Picture of voucher', hashtag: '#missionmischiefcrushedit', badgeId: 'recycle', type: 'goodwill', requiresBuyIn: false, points: 1, cardDrop: 'Give to person working the center', mayhem: 'EXCITED' },
    
    // M23-M24: Tag Badge
    { id: 23, title: 'Popping Tags', location: 'Thrift Shop', description: '10 sec Macklemore rap with thrift items as props. Get 1 point for every thrift store item you have on during video', proof: 'Video rapping (1pt per item worn)', hashtag: '#missionmischiefpoppingtags', badgeId: 'thrift', type: 'prank', requiresBuyIn: false, points: '?', cardDrop: 'Leave on shop counter', mayhem: 'BLANK STARE' },
    { id: 24, title: 'Pocket Pull', location: 'Thrift Shop', description: 'Place card in 5 different pant pockets', proof: 'Picture holding pulled out pant pocket', hashtag: '#missionmischiefpocketpull', badgeId: 'thrift', type: 'goodwill', requiresBuyIn: false, points: 1, cardDrop: '5 cards into 5 different pant pockets', mayhem: 'BLANK STARE' },
    
    // M25-M26: Salvation Army Logo Badge
    { id: 25, title: 'Jump', location: 'Anywhere', description: 'Find oversized pants', proof: 'Oversized pants on backwards, arms crossed gangster pose', hashtag: '#missionmischiefjump', badgeId: 'pants', type: 'prank', requiresBuyIn: false, points: 3, cardDrop: 'N/A', mayhem: 'EXCITED' },
    { id: 26, title: 'Pants Down', location: 'Salvation Army', description: 'Donate pants with card in pocket to Salvation Army', proof: 'Photo of receipt', hashtag: '#missionmischiefpantsdown', badgeId: 'pants', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'In pants pocket', mayhem: 'EXCITED' },
    
    // M27-M28: 40oz Brown Bagged Badge
    { id: 27, title: 'Stranger Danger', location: 'Video Call', description: 'Video dance off with another player. Find another Mission Mischief player online and challenge them to a dance off via Zoom, Video chat, however you can get them on a screen and show both you and them having a dance off to "You Never Can Tell" by Chuck Berry, Pulp Fiction style.', proof: '30 sec Pulp Fiction inspired dance (5 sec turns each)', hashtag: '#missionmischiefstrangerdanger', badgeId: 'thirsty', type: 'special', requiresBuyIn: false, points: 10, cardDrop: 'N/A', mayhem: 'EXCITED' },
    { id: 28, title: '40oz To Freedom', location: 'Anywhere', description: 'Buy another player a beer (via Buy Me A Coffee). Mayhem loves free drinks js', proof: 'Screenshot your purchased message, "Give this to Mayhem."', hashtag: '#missionmischiefcheers', badgeId: 'thirsty', type: 'special', requiresBuyIn: false, points: 10, cardDrop: '40oz Brown Bagged', mayhem: 'EXCITED' },
    
    // M29-M30: Big Red Shoe Badge
    { id: 29, title: 'Bigfoot', location: 'Shoe Store', description: 'Find largest shoe on display at shoe store. Take a picture holding it and looking down.', proof: 'Picture waist high holding shoe, looking down', hashtag: '#missionmischiefbigfoot', badgeId: 'bigfoot', type: 'prank', requiresBuyIn: false, points: 1, cardDrop: 'Leave in shoe box when trying on shoe', mayhem: 'EXCITED' },
    { id: 30, title: 'Sobriety Test', location: 'Shoe Store', description: 'Try on biggest shoes, walk while touching nose', proof: '10 sec video walking in shoes, touching nose with each hand', hashtag: '#missionmischiefsobrietytest', badgeId: 'bigfoot', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Leave card on counter on way out', mayhem: 'EXCITED' },
    
    // M31-M32: Pie w/ Hole Badge
    { id: 31, title: 'American Pie', location: 'Diner', description: 'Order a piece of apple pie at local diner', proof: 'Picture of pie with you pointing at it with two fingers', hashtag: '#missionmischiefamericanpie', badgeId: 'diner', type: 'prank', requiresBuyIn: false, points: 3, cardDrop: 'Leave card at table', mayhem: 'EXCITED' },
    { id: 32, title: 'Give A Piece', location: 'Diner', description: 'Buy pie for stranger at diner. Either you or the server take the piece with the card to stranger', proof: 'Picture with stranger, pie, and your card underneath', hashtag: '#missionmischiefgiveapiece', badgeId: 'diner', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Give with piece of pie', mayhem: 'EXCITED' },
    
    // M33-M34: Liger Badge
    { id: 33, title: 'Dynamite', location: 'Anywhere', description: 'Draw Napoleon Dynamite\'s favorite animal, the Liger', proof: 'You holding up your Liger drawing like a proud 1st grader', hashtag: '#missionmischiefdynamite', badgeId: 'liger', type: 'prank', requiresBuyIn: false, points: 1, cardDrop: 'N/A', mayhem: 'EXCITED' },
    { id: 34, title: 'Lost Liger', location: 'Street', description: 'Make "Lost" flyer with liger drawing, tape to stop sign', proof: 'Picture of drawing taped to stop sign', hashtag: '#missionmischieflostliger', badgeId: 'liger', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Tape card to liger drawing', mayhem: 'EXCITED' },
    
    // M35-M36: Netflix "N" Badge
    { id: 35, title: 'Netflix and Chill', location: 'Library', description: 'Ask librarian where to find book on "how to Netflix and chill"', proof: 'Video of you asking and them responding', hashtag: '#missionmischiefnetflixandchill', badgeId: 'netflix', type: 'prank', requiresBuyIn: false, points: 3, cardDrop: 'Give card to librarian', mayhem: 'EXCITED' },
    { id: 36, title: 'Give a Poo', location: 'Library', description: 'Return "Everyone Poops" with card in back', proof: 'Photo of you dropping book in or at book drop off', hashtag: '#missionmischiefgiveapoo', badgeId: 'netflix', type: 'goodwill', requiresBuyIn: false, points: 1, cardDrop: 'In back cover of book', mayhem: 'EXCITED' },
    
    // M37-M38: Hammer Badge
    { id: 37, title: 'Daddy Issues', location: 'Hardware Store', description: 'Ask male employee at hardware store "Are you my daddy?"', proof: 'Video of you asking and them responding', hashtag: '#missionmischiefdaddyissues', badgeId: 'daddy', type: 'prank', requiresBuyIn: false, points: 3, cardDrop: 'Give employee card', mayhem: 'EXCITED' },
    { id: 38, title: 'Bird Cage', location: 'Anywhere', description: 'Build birdhouse kit, paint each side different Beetlejuice colors', proof: 'Photo of your completed birdhouse', hashtag: '#missionmischiefbirdcage', badgeId: 'daddy', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'N/A', mayhem: 'EXCITED' },
    
    // M39-M40: Catfish Badge
    { id: 39, title: 'Cat Fishing', location: 'Somewhere with water', description: 'Fish with cat toy as bait, say "here kitty kitty". Yes, you can tie a string to a stick, then the cat toy to the string.', proof: 'Video of you fishing with cat toy (toy doesn\'t need to go in water)', hashtag: '#missionmischiefcatfishing', badgeId: 'catfish', type: 'prank', requiresBuyIn: false, points: 3, cardDrop: 'N/A', mayhem: 'BLANK STARE' },
    { id: 40, title: 'Cat Shelter', location: 'Animal Shelter', description: 'Take cat toy to animal shelter', proof: 'Photo holding toy outside shelter with shelter name visible', hashtag: '#missionmischiefcatshelter', badgeId: 'catfish', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Leave on chair or table in waiting room', mayhem: 'EXCITED' },
    
    // M41-M42: Googley Eyes Badge
    { id: 41, title: 'Googley Eyes Buy', location: 'Store', description: 'Buy googley eyes', proof: 'Photo with googley eyes', hashtag: '#missionmischiefgoogley', badgeId: 'eyes', type: 'prank', requiresBuyIn: false, points: 3, cardDrop: 'Leave card where you got the eyes', mayhem: 'EXCITED' },
    { id: 42, title: 'Fridge Eyes', location: 'Home', description: 'Put googley eyes on 5 refrigerator items', proof: 'Photo of 5 items in refrigerator together with googley eyes', hashtag: '#missionmischieffridgeeyes', badgeId: 'eyes', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'N/A', mayhem: 'EXCITED' },
    
    // M43-M44: Sock Puppet Badge
    { id: 43, title: 'Suspect', location: 'Store', description: 'Buy only tube socks and lotion', proof: 'Photo holding lotion and socks with big smile, store name on building behind you', hashtag: '#missionmischiefsuspect', badgeId: 'ghost', type: 'prank', requiresBuyIn: false, points: 3, cardDrop: 'Give card to cashier', mayhem: 'BLANK STARE' },
    { id: 44, title: 'Sock Puppet Show', location: 'Anywhere', description: 'Make sock puppet, perform 10 second skit (need inspiration, watch lambchop)', proof: 'Video of puppet skit', hashtag: '#missionmischiefsockpuppet', badgeId: 'ghost', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'N/A', mayhem: 'EXCITED' },
    
    // M45-M46: Dobby Badge
    { id: 45, title: 'Dobby', location: 'Public', description: 'Put card in a sock, hand to a stranger and walk away', proof: 'Video of handing sock, walking away, stranger\'s response', hashtag: '#missionmischiefdobby', badgeId: 'slide', type: 'prank', requiresBuyIn: false, points: 3, cardDrop: 'Card in sock', mayhem: 'BLANK STARE' },
    { id: 46, title: 'Dobby Donation', location: 'Salvation Army', description: 'Donate socks and lotion to Salvation Army with card in sock', proof: 'Photo of receipt', hashtag: '#missionmischiefdobbydonation', badgeId: 'slide', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Card in sock', mayhem: 'EXCITED' },
    
    // M47-M48: Magazine Clipping Note Badge
    { id: 47, title: 'Mission Haiku', location: 'Anywhere', description: 'Make up haiku about a mission you did, read dramatically', proof: 'Video of you reading haiku dramatically', hashtag: '#missionmischiefhaiku', badgeId: 'note', type: 'prank', requiresBuyIn: false, points: 3, cardDrop: 'N/A', mayhem: 'EXCITED' },
    { id: 48, title: 'Ransom Note Haiku', location: 'Gym', description: 'Cut out magazine letters for haiku, glue to paper, post at gym', proof: 'Photo of clipped haiku posted at gym with your card attached', hashtag: '#missionmischiefrandsomnote', badgeId: 'note', type: 'goodwill', requiresBuyIn: false, points: 3, cardDrop: 'Pin with Haiku on gym bulletin board', mayhem: 'EXCITED' },
    
    // M49: Dog Bounty Hunter
    { id: 49, title: 'Dog Bounty Hunter', location: 'Anywhere', description: 'Find another player\'s card in the wild', proof: 'Photo of card with QR and player info visible', hashtag: '#missionmischiefdog', badgeId: 'bounty', type: 'special', requiresBuyIn: false, points: 10, cardDrop: 'N/A (found card mission)', mayhem: 'EXCITED' },
    
    // M50: Finish Line
    { id: 50, title: 'Finish Line - Card Retrieval', location: 'Multiple previous mission locations', description: '(Requires all missions completed) Return to all locations where you dropped cards and try to retrieve them. Document your journey and stories of who found them.', proof: 'Video showing each location revisited and cards found', hashtag: '#missionmischieffinishline', badgeId: 'crown', type: 'special', requiresBuyIn: false, points: '1pt per card', cardDrop: 'N/A (retrieval mission)', mayhem: 'EXCITED' },
    
    // BONUS: Bounty Hunter Rewards
    { id: 51, title: 'Bounty Hunter Rewards', location: 'Anywhere', description: 'Find cards or expose cheaters', proof: 'Photo of found card with QR visible OR Screenshot of cheater\'s post with unearned badge', hashtag: '#missionmischiefdog / #missionmischiefexposed', badgeId: 'bounty', type: 'special', requiresBuyIn: false, points: 'Var + $5', cardDrop: 'N/A (bonus missions)', mayhem: 'EXCITED' }


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
    const setupMissions = [1, 2, 3, 4]; // First 4 missions are setup
    const setupCompleted = setupMissions.every(id => user.completedMissions.includes(id));
    
    // If setup missions not completed, only show setup missions
    if (!setupCompleted) {
      return this.missionData.slice(0, 4);
    }
    
    // After setup is complete, check buy-in status
    // If Mission 4 (Choose Your Destiny) is completed, unlock missions based on buy-in
    if (user.completedMissions.includes(4)) {
      // Check if user chose "do nothing" - unlock one mission at a time
      if (user.currentBuyIn === 'nothing') {
        const completedCount = user.completedMissions.length;
        const nextMissionId = completedCount + 1;
        
        // Return missions up to the next available one (excluding mission 50 until all others done)
        if (nextMissionId <= 49) {
          return this.missionData.filter(m => m.id <= nextMissionId && m.id !== 50);
        } else {
          // All missions 1-49 completed, now show mission 50
          return this.missionData;
        }
      } else {
        // Other buy-ins unlock all missions at once (except 50 until all done)
        const missions1to49 = Array.from({length: 49}, (_, i) => i + 1);
        const allPreviousCompleted = missions1to49.every(id => user.completedMissions.includes(id));
        
        if (!allPreviousCompleted) {
          return this.missionData.filter(m => m.id !== 50);
        }
        
        return this.missionData;
      }
    }
    
    // Setup complete but Mission 4 not done yet, show setup missions only
    return this.missionData.slice(0, 4);
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
    
    // Special case for bounty badge (only has color version)
    if (badgeId === 'bounty') {
      return `assets/images/badges/${badge.icon}`;
    }
    
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