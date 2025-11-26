// Game Logic Engine for Detective Game

import { HAND_CRAFTED_CASES, convertHandCraftedToGameFormat } from './handCraftedCases.js';


// Difficulty Configuration
export const DIFFICULTY_LEVELS = {
  EASY: {
    name: 'Easy',
    suspects: 5,
    evidence: 10,
    redHerrings: 1,
    freeHints: Infinity,
    contradictionsObvious: true,
    description: 'Perfect for beginners'
  },
  NORMAL: {
    name: 'Normal',
    suspects: 8,
    evidence: 15,
    redHerrings: 3,
    freeHints: 3,
    contradictionsObvious: false,
    description: 'Balanced challenge'
  },
  HARD: {
    name: 'Hard',
    suspects: 12,
    evidence: 20,
    redHerrings: 5,
    freeHints: 0,
    contradictionsObvious: false,
    description: 'For experienced detectives'
  },
  COLD_CASE: {
    name: 'Cold Case',
    suspects: 15,
    evidence: 25,
    redHerrings: 7,
    freeHints: 0,
    contradictionsObvious: false,
    description: 'Ultimate challenge - no time limits'
  }
};

// Expanded crime types with more variety (+180%)
const crimeTypes = [
  'Murder', 'Theft', 'Fraud', 'Kidnapping', 'Arson',
  'Blackmail', 'Embezzlement', 'Art Forgery', 'Corporate Espionage',
  'Identity Theft', 'Smuggling', 'Extortion', 'Sabotage', 'Conspiracy'
];

// Expanded locations with unique characteristics (+150%)
const locations = [
  'Mansion', 'Art Gallery', 'Office Building', 'Restaurant', 'Hotel',
  'Warehouse', 'City Park', 'Theater', 'Museum', 'Casino',
  'Yacht Club', 'University', 'Hospital', 'Country Club', 'Tech Startup',
  'Law Firm', 'Investment Bank', 'Auction House', 'Private Estate', 'Penthouse',
  'Vineyard', 'Research Lab', 'Concert Hall', 'Shopping Mall', 'Airport Lounge'
];

// Expanded personalities for more diverse suspects (+100%)
const personalities = [
  'Nervous', 'Calculating', 'Defensive', 'Charming', 'Evasive',
  'Aggressive', 'Cooperative', 'Suspicious', 'Calm', 'Arrogant',
  'Manipulative', 'Paranoid', 'Eccentric', 'Stoic', 'Volatile',
  'Methodical', 'Impulsive', 'Reserved', 'Flamboyant', 'Cunning'
];
// Expanded name pools for variety
const firstNames = [
  'Alexander', 'Benjamin', 'Charlotte', 'Daniel', 'Emma', 'Frank', 'Grace', 'Henry',
  'Isabella', 'James', 'Katherine', 'Marcus', 'Natalie', 'Oliver', 'Penelope', 'Quinn',
  'Rachel', 'Samuel', 'Theodore', 'Victoria', 'William', 'Xavier', 'Zachary', 'Amelia',
  'Brandon', 'Caroline', 'David', 'Eleanor', 'Frederick', 'Gabriella', 'Harrison', 'Iris',
  'Jonathan', 'Lillian', 'Matthew', 'Nora', 'Patrick', 'Rebecca', 'Sebastian', 'Tabitha',
  'Vincent', 'Wendy', 'Adrian', 'Beatrice', 'Christopher', 'Diane', 'Edward', 'Fiona',
  'Gregory', 'Helena', 'Isaac', 'Julia', 'Kenneth', 'Laura', 'Michael', 'Nicole',
  'Oscar', 'Priscilla', 'Raymond', 'Sophia', 'Thomas', 'Ursula', 'Vanessa', 'Walter',
  'Yvonne', 'Aaron', 'Bridget', 'Cameron', 'Delilah', 'Ethan', 'Felicity', 'George',
  'Hannah', 'Ivan', 'Jasmine', 'Kevin', 'Lydia', 'Nathan', 'Olivia', 'Peter', 'Rose',
  'Simon', 'Tessa', 'Ulysses', 'Violet', 'Wesley', 'Zara', 'Abigail', 'Blake', 'Chloe',
  'Dominic', 'Eliza', 'Felix', 'Gwendolyn', 'Hugo', 'Imogen', 'Jared', 'Keira', 'Lucas',
  'Meredith', 'Nicholas', 'Ophelia', 'Preston', 'Rosalind', 'Sterling', 'Thea', 'Vaughn'
];

const lastNames = [
  'Bennett', 'Fisher', 'Morgan', 'Richardson', 'Harrison', 'Mitchell', 'Thompson', 'Crawford',
  'Peterson', 'Walsh', 'Thornwell', 'Brooks', 'Anderson', 'Bailey', 'Carter', 'Davis',
  'Edwards', 'Foster', 'Graham', 'Hughes', 'Irving', 'Jenkins', 'Kennedy', 'Lawrence',
  'Morrison', 'Nelson', 'O\'Brien', 'Parker', 'Quinn', 'Reynolds', 'Stevens', 'Turner',
  'Underwood', 'Vincent', 'Wallace', 'Xavier', 'Young', 'Zhang', 'Abbott', 'Bishop',
  'Caldwell', 'Douglas', 'Elliott', 'Ferguson', 'Gilbert', 'Hawkins', 'Ingram', 'Jackson',
  'Klein', 'Lambert', 'Mason', 'Norton', 'Owens', 'Phillips', 'Ramsey', 'Sutton',
  'Taylor', 'Vaughn', 'Wilson', 'York', 'Armstrong', 'Bradford', 'Coleman', 'Dawson',
  'Evans', 'Fletcher', 'Grant', 'Hayes', 'Irwin', 'Jordan', 'Knight', 'Lewis',
  'Marshall', 'Newman', 'Oliver', 'Porter', 'Ross', 'Shaw', 'Tucker', 'Underhill',
  'Vernon', 'Warren', 'Yates', 'Zimmerman', 'Blake', 'Clarke', 'Doyle', 'Frost',
  'Gardner', 'Hunter', 'Jensen', 'King', 'Lloyd', 'Moore', 'Nash', 'Ortiz',
  'Palmer', 'Rhodes', 'Scott', 'Thomas', 'Vance', 'Webb', 'Xiong', 'Ziegler'
];

// Track recently used names to avoid repetition (stored globally)
let recentlyUsedNames = [];
const occupations = [
  // White Collar
  'Business Partner', 'Art Collector', 'Former Partner', 'Assistant',
  'Investor', 'Curator', 'Manager', 'Accountant', 'Consultant', 'Attorney',
  'Architect', 'Engineer', 'Real Estate Agent', 'Financial Advisor', 'Insurance Agent',

  // Blue Collar
  'Firefighter', 'Construction Worker', 'Truck Driver', 'Taxi Driver', 'Delivery Driver',
  'Mechanic', 'Electrician', 'Plumber', 'Factory Worker', 'Warehouse Worker',

  // Service Industry
  'Nurse', 'Teacher', 'Chef', 'Bartender', 'Waiter', 'Security Guard',
  'Hotel Manager', 'Janitor', 'Retail Manager', 'Pharmacist',

  // Creative/Media
  'Photographer', 'Journalist', 'Actor', 'Musician', 'Artist', 'Writer',

  // Medical/Legal/Academic
  'Doctor', 'Lawyer', 'Professor', 'Scientist', 'Therapist',

  // Other
  'Personal Trainer', 'Flight Attendant', 'Sales Representative', 'IT Specialist',
  'Social Worker', 'Veterinarian', 'Librarian', 'Event Planner'
];

// Expanded evidence types for more variety (+138%)
const evidenceTypes = [
  'Fingerprints', 'DNA Sample', 'Weapon', 'Blood Stains', 'Footprints',
  'Security Footage', 'Email Records', 'Financial Documents', 'Witness Testimony',
  'Phone Records', 'Threatening Letter', 'Receipts', 'Toxicology Report',
  'Fiber Analysis', 'Audio Recording', 'GPS Data', 'Digital Photo',
  'Handwriting Sample', 'Surveillance Report', 'Bank Statement', 'Text Messages',
  'Tire Tracks', 'Ballistics Report', 'Calendar Entry', 'Meeting Notes',
  'Purchase History', 'Travel Records', 'Social Media Posts', 'Voicemail',
  'Key Card Access', 'CCTV Timestamp', 'Deleted Files'
];

// Physical attributes for indirect evidence
const heightRanges = ['5\'2"-5\'5"', '5\'5"-5\'8"', '5\'8"-6\'0"', '6\'0"-6\'3"'];
const buildTypes = ['Slim build', 'Medium build', 'Athletic build', 'Heavy build'];
const hairColors = ['Black', 'Dark brown', 'Light brown', 'Blonde', 'Red', 'Gray'];
const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray'];
const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const voiceQualities = ['Deep and gravelly', 'High-pitched', 'Smooth and calm', 'Raspy', 'Soft-spoken', 'Booming'];
const areaCodes = ['617', '212', '310', '415', '312', '713', '404', '206', '305', '702'];
const shoeTypes = ['Dress shoes', 'Sneakers', 'Boots', 'Loafers'];

// Question Categories System
const QUESTION_CATEGORIES = {
  ALIBI: {
    variations: [
      "Where were you at the time of the {crimeType}?",
      "Can you account for your whereabouts during the incident?",
      "Walk me through your movements that {timeOfDay}",
      "Who can verify your location when this happened?",
      "Your alibi seems incomplete. Care to elaborate?",
      "Several witnesses place you nearby. Explain."
    ],
    responseTypes: ['timeline', 'location', 'witnesses']
  },
  MOTIVE: {
    variations: [
      "What was your relationship with {victimName}?",
      "Did you have any disagreements with the victim recently?",
      "Financial records suggest tension. Care to explain?",
      "What did you stand to gain from this situation?",
      "You had opportunity, but did you have reason?",
      "Others mentioned conflicts between you two. True?"
    ],
    responseTypes: ['relationship', 'conflict', 'benefit']
  },
  OPPORTUNITY: {
    variations: [
      "How did you access the {location}?",
      "Who else was present when you arrived?",
      "Did you notice anything unusual at the scene?",
      "When was the last time you were at the {location}?",
      "Do you have a key or access code to this area?",
      "Security logs show your presence. Explain."
    ],
    responseTypes: ['access', 'presence', 'observation']
  },
  KNOWLEDGE: {
    variations: [
      "What do you know about the evidence we found?",
      "When did you learn about the {crimeType}?",
      "How well did you know {victimName}'s routine?",
      "Were you aware of {victimName}'s recent activities?",
      "Did you know about the specific details of the incident?",
      "Your knowledge of details is suspicious. Explain."
    ],
    responseTypes: ['awareness', 'details', 'timeline']
  },
  BEHAVIOR: {
    variations: [
      "You seem {emotionalState}. Why is that?",
      "Witnesses say you've been acting strangely lately. True?",
      "Your reaction to this news seems unusual. Comment?",
      "Why did you behave differently after the incident?",
      "Your body language suggests discomfort. Something to share?",
      "You're being evasive. What are you hiding?"
    ],
    responseTypes: ['emotional', 'defensive', 'behavioral']
  },
  EVIDENCE_CONFRONTATION: {
    variations: [
      "How do you explain this evidence we found?",
      "This evidence directly contradicts your statement. Explain.",
      "We found evidence connecting you to the scene. Your response?",
      "Forensics places you at the scene. Your response?",
      "This evidence tells a different story than you do.",
      "Care to revise your statement given this evidence?"
    ],
    responseTypes: ['denial', 'explanation', 'confession'],
    requiresEvidence: true
  }
};

// Personality-based response templates
const RESPONSE_TEMPLATES = {
  guilty: {
    ALIBI: {
      Nervous: [
        "I-I was... {pauseAction}... I think I was at {vagueLocation}...",
        "My memory is fuzzy about that time... {nervousGesture}",
        "Why does it matter where I was? {avoidGaze}"
      ],
      Calculating: [
        "I was exactly where I said. Check the records.",
        "My alibi is documented. {controlledTone}",
        "Let me think... yes, I was at the office working late."
      ],
      Defensive: [
        "I already told you where I was! {aggressivePosture}",
        "Stop interrogating me like I'm guilty! {raisedVoice}",
        "This is harassment! I was at home!"
      ],
      Charming: [
        "Oh detective, surely you don't suspect me? I was with friends.",
        "I've been nothing but cooperative. I was at dinner.",
        "{smile} My whereabouts are easily verified."
      ],
      Evasive: [
        "I'd rather not say where I was... it's personal.",
        "Does it really matter? I wasn't involved.",
        "I was... around. Here and there."
      ],
      Aggressive: [
        "That's none of your business! I don't have to tell you!",
        "Why should I answer that? You got a warrant?",
        "I was wherever I damn well pleased!"
      ],
      Cooperative: [
        "I... I want to help, but I'm not sure I remember clearly...",
        "I think I was home, but I could be mistaken...",
        "Let me try to recall... {struggles}"
      ],
      Suspicious: [
        "Why are you asking me that? Who told you to ask me?",
        "I don't trust this line of questioning...",
        "Are you recording this? Where I was is complicated..."
      ],
      Calm: [
        "I was at home. Alone, unfortunately.",
        "I don't have an alibi for that time, no.",
        "I was reading. No witnesses, I'm afraid."
      ],
      Arrogant: [
        "Do you know who I am? I don't answer to you.",
        "My time is valuable. I was working, obviously.",
        "I don't need to justify my whereabouts to anyone."
      ]
    },
    MOTIVE: {
      Nervous: [
        "{victimName} and I... we had our differences... {sweating}",
        "I never said we were close... {fidgeting}",
        "Look, I didn't want this to happen! {emotional}"
      ],
      Calculating: [
        "Our relationship was purely professional.",
        "I had no reason to harm {victimName}.",
        "Whatever you're implying is baseless."
      ],
      Defensive: [
        "Everyone had problems with {victimName}! Why single me out?",
        "So we argued! That doesn't make me a criminal!",
        "You're trying to frame me!"
      ],
      Charming: [
        "{victimName} and I were on excellent terms, actually.",
        "I had nothing to gain from this tragedy.",
        "We had minor disagreements, like any colleagues."
      ],
      Evasive: [
        "Our relationship is... complicated.",
        "I'd rather not discuss our personal matters.",
        "That's between me and {victimName}."
      ],
      Aggressive: [
        "Yeah, we had problems! So what?",
        "{victimName} was difficult to work with!",
        "I'm not going to pretend I liked them!"
      ],
      Cooperative: [
        "I... I'll admit we had tensions, but I never...",
        "Yes, we disagreed, but that doesn't mean...",
        "Please believe me, I had no reason for violence..."
      ],
      Suspicious: [
        "Why are you asking about my relationship specifically?",
        "Who's been talking about me and {victimName}?",
        "This feels like a setup..."
      ],
      Calm: [
        "We had professional differences. Nothing more.",
        "I neither liked nor disliked {victimName}.",
        "Our relationship was cordial but distant."
      ],
      Arrogant: [
        "{victimName} was beneath my concern.",
        "I don't waste energy on petty conflicts.",
        "Whatever issues existed were insignificant to me."
      ]
    },
    OPPORTUNITY: {
      Nervous: [
        "I... I have a key, but I rarely use it... {anxious}",
        "I might have been there... I don't remember clearly...",
        "Lots of people have access! {defensive}"
      ],
      Calculating: [
        "Yes, I have access. So do many others.",
        "My access is documented and authorized.",
        "I was granted entry legitimately."
      ],
      Defensive: [
        "Having access doesn't make me guilty!",
        "Half the building has those credentials!",
        "You're grasping at straws!"
      ],
      Charming: [
        "I have clearance, of course. Part of my role.",
        "Access was never restricted to me, detective.",
        "I've been trusted with access for years."
      ],
      Evasive: [
        "I may have had access... it's complicated.",
        "That's not really relevant, is it?",
        "I'd prefer not to discuss security details."
      ],
      Aggressive: [
        "So what if I had access? Prove something!",
        "You got nothing but circumstantial nonsense!",
        "Access means nothing!"
      ],
      Cooperative: [
        "Yes, I have access. I should have mentioned that...",
        "I didn't think my access was relevant... {worried}",
        "I'm sorry, I should have been more forthcoming..."
      ],
      Suspicious: [
        "Who told you I have access?",
        "Are you monitoring everyone's movements?",
        "This seems like entrapment..."
      ],
      Calm: [
        "I have legitimate access credentials.",
        "My presence there would not be unusual.",
        "Access is not indicative of guilt."
      ],
      Arrogant: [
        "Of course I have access. I'm authorized.",
        "My credentials are top-level.",
        "I don't need to explain my access to you."
      ]
    },
    KNOWLEDGE: {
      Nervous: [
        "I... I might have heard something... {stammering}",
        "How would I know that? {panicking}",
        "I don't know anything! {too emphatic}"
      ],
      Calculating: [
        "I know only what's been publicly discussed.",
        "My knowledge comes from official channels.",
        "I'm aware of the basic facts, nothing more."
      ],
      Defensive: [
        "Stop trying to trap me!",
        "I don't know anything! Leave me alone!",
        "You're twisting everything I say!"
      ],
      Charming: [
        "I only know what everyone knows, detective.",
        "Surely such details have been widely discussed?",
        "I'm as much in the dark as anyone."
      ],
      Evasive: [
        "I might know something... I'd have to think about it.",
        "That's hard to say...",
        "I'm not sure what you're getting at..."
      ],
      Aggressive: [
        "How should I know that?!",
        "You tell me! You're the detective!",
        "I don't know and I don't care!"
      ],
      Cooperative: [
        "I... I may have overheard something... {hesitant}",
        "I didn't think it was important at the time...",
        "Should I have known that? {confused}"
      ],
      Suspicious: [
        "Why would I know that particular detail?",
        "That's oddly specific... what are you implying?",
        "Someone's feeding you false information about me."
      ],
      Calm: [
        "I have no special knowledge of the incident.",
        "My awareness is limited to public information.",
        "I know nothing beyond what's been shared."
      ],
      Arrogant: [
        "I don't concern myself with such details.",
        "That information is irrelevant to me.",
        "I have better things to occupy my mind."
      ]
    },
    BEHAVIOR: {
      Nervous: [
        "I'm just naturally anxious! {sweating}",
        "Wouldn't anyone be nervous in this situation? {fidgeting}",
        "I... I can't help how I react... {trembling}"
      ],
      Calculating: [
        "I'm simply being cautious with my words.",
        "My demeanor is measured and appropriate.",
        "I don't appreciate your psychoanalysis."
      ],
      Defensive: [
        "My behavior is perfectly normal!",
        "Stop analyzing me! This is ridiculous!",
        "You're seeing things that aren't there!"
      ],
      Charming: [
        "Forgive me if I seem off, this is quite stressful.",
        "I'm simply trying to be helpful, detective.",
        "Any unusual behavior is shock, nothing more."
      ],
      Evasive: [
        "I don't know what you're talking about...",
        "People handle stress differently...",
        "My behavior is my own business."
      ],
      Aggressive: [
        "What about my behavior?! I'm fine!",
        "Stop playing mind games with me!",
        "You're trying to intimidate me!"
      ],
      Cooperative: [
        "I know I seem nervous... I'm sorry... {apologetic}",
        "I'm trying to stay calm, but this is overwhelming...",
        "You're right, I'm not handling this well..."
      ],
      Suspicious: [
        "Why are you watching me so closely?",
        "My behavior is normal given the circumstances...",
        "Who else have you been asking about me?"
      ],
      Calm: [
        "I'm behaving rationally given the situation.",
        "My composure is not evidence of guilt.",
        "I see no reason to become emotional."
      ],
      Arrogant: [
        "I don't answer to your judgment of my behavior.",
        "How I conduct myself is none of your concern.",
        "I'm perfectly composed, thank you."
      ]
    },
    EVIDENCE_CONFRONTATION: {
      Nervous: [
        "That... that's not mine! I swear! {panic}",
        "I don't know how that got there! {trembling}",
        "You have to believe me! {desperate}"
      ],
      Calculating: [
        "That evidence could have been planted.",
        "I need to consult with my attorney.",
        "Correlation doesn't imply causation."
      ],
      Defensive: [
        "That's fake! You planted that!",
        "I want a lawyer NOW!",
        "This is a setup!"
      ],
      Charming: [
        "There must be some mistake, detective...",
        "I'm sure there's a reasonable explanation...",
        "That evidence is clearly erroneous."
      ],
      Evasive: [
        "I... I don't want to talk about that...",
        "I need time to think about this...",
        "Can we discuss something else?"
      ],
      Aggressive: [
        "You got nothing! That proves nothing!",
        "I'm not saying another word!",
        "This interrogation is over!"
      ],
      Cooperative: [
        "I... okay... I need to tell you the truth... {breaking}",
        "That evidence... I can explain... {defeated}",
        "Maybe I should just... {resigned}"
      ],
      Suspicious: [
        "Where did you really get that evidence?",
        "Who's framing me?",
        "This is too convenient..."
      ],
      Calm: [
        "That evidence doesn't prove what you think it does.",
        "I have a logical explanation for that.",
        "Consider alternative interpretations."
      ],
      Arrogant: [
        "That evidence is circumstantial at best.",
        "You'll need more than that.",
        "I've seen better cases fall apart."
      ]
    }
  },
  innocent: {
    ALIBI: {
      Nervous: [
        "I was at {truthfulLocation}, I swear! {anxious}",
        "Please believe me, I have nothing to hide... {pleading}",
        "My {witnessType} can confirm where I was! {desperate}"
      ],
      Calculating: [
        "I was at {location} from {time1} to {time2}.",
        "Check with {witness}, they'll verify my whereabouts.",
        "Here's exactly what I was doing: {clearTimeline}"
      ],
      Defensive: [
        "I told you already - I was at {location}!",
        "Why don't you believe me?!",
        "Check the facts instead of harassing me!"
      ],
      Charming: [
        "I was at {location}, detective. Happy to provide details.",
        "I have several witnesses who can confirm my alibi.",
        "{smile} I'm completely transparent about my whereabouts."
      ],
      Evasive: [
        "I was... not anywhere near there...",
        "Does it really matter where exactly I was?",
        "I was just... out and about..."
      ],
      Aggressive: [
        "I was at {location}! Now stop asking!",
        "How many times do I have to tell you?!",
        "Check it yourself if you don't believe me!"
      ],
      Cooperative: [
        "Of course! I was at {location}. I can provide {details}.",
        "Let me help you understand my timeline clearly.",
        "I have {evidence} that proves where I was."
      ],
      Suspicious: [
        "Why are you so focused on me?",
        "I was at {location}, but I don't like how you're questioning me...",
        "Are you investigating everyone this intensely?"
      ],
      Calm: [
        "I was at {location} the entire time.",
        "{witness} can verify my alibi.",
        "My whereabouts are easily confirmed."
      ],
      Arrogant: [
        "I was at {location}. Satisfied?",
        "Check my schedule - it's all documented.",
        "I don't have time for this. My alibi is solid."
      ]
    },
    MOTIVE: {
      Nervous: [
        "I had no reason to hurt {victimName}! None! {emphatic}",
        "We got along fine! I swear! {anxious}",
        "Why would I do this? {confused and scared}"
      ],
      Calculating: [
        "My relationship with {victimName} was professional and cordial.",
        "I had no motive whatsoever.",
        "Logically, this crime benefits me in no way."
      ],
      Defensive: [
        "I had no problems with {victimName}!",
        "Stop trying to invent a motive!",
        "We were fine! Check with anyone!"
      ],
      Charming: [
        "{victimName} and I were on excellent terms.",
        "I respected {victimName} greatly.",
        "There was no conflict between us at all."
      ],
      Evasive: [
        "We had a normal working relationship...",
        "Like anyone, sometimes we disagreed...",
        "Nothing worth mentioning..."
      ],
      Aggressive: [
        "I had no reason! Get that through your head!",
        "We were FINE!",
        "Stop making up nonsense!"
      ],
      Cooperative: [
        "{victimName} and I had a good relationship.",
        "I can show you emails proving we got along well.",
        "Everyone knows we worked together harmoniously."
      ],
      Suspicious: [
        "Who told you I had problems with {victimName}?",
        "Someone's lying to you about me...",
        "We got along fine, despite what you've heard..."
      ],
      Calm: [
        "I had no motive for this crime.",
        "My relationship with {victimName} was neutral to positive.",
        "Check the facts - there was no conflict."
      ],
      Arrogant: [
        "I had no interest in {victimName} one way or another.",
        "This is beneath me.",
        "I don't engage in petty conflicts."
      ]
    },
    OPPORTUNITY: {
      Nervous: [
        "I don't have access! I couldn't have... {anxious}",
        "I was never there! You have to believe me! {pleading}",
        "Check the records! I wasn't even near! {desperate}"
      ],
      Calculating: [
        "I lack the necessary credentials for that area.",
        "Security logs will confirm I wasn't there.",
        "I had no means to access that location."
      ],
      Defensive: [
        "I don't have access! Check the system!",
        "You're wasting time on me!",
        "I couldn't have been there even if I wanted to!"
      ],
      Charming: [
        "I'm afraid I don't have access to that area, detective.",
        "I've never been granted those credentials.",
        "The access logs will exonerate me."
      ],
      Evasive: [
        "I... I don't usually go there...",
        "That area is off-limits to me...",
        "I wouldn't know how to get in..."
      ],
      Aggressive: [
        "I don't have access! Period!",
        "Check your damn records!",
        "Stop assuming I could just waltz in there!"
      ],
      Cooperative: [
        "I don't have access credentials for that area.",
        "I can show you my access level if that helps.",
        "Security can confirm my limitations."
      ],
      Suspicious: [
        "Why would you think I have access?",
        "Who suggested I could get in there?",
        "Someone's misleading you..."
      ],
      Calm: [
        "I don't have access to that location.",
        "The security system will verify this.",
        "My credentials don't permit entry there."
      ],
      Arrogant: [
        "That area is beneath my clearance level.",
        "I have no reason to access such spaces.",
        "Check the records if you must."
      ]
    },
    KNOWLEDGE: {
      Nervous: [
        "I don't know anything! I swear! {panic}",
        "How would I know that?! {confused}",
        "I only know what everyone else knows! {anxious}"
      ],
      Calculating: [
        "My knowledge is limited to publicly available information.",
        "I know only what's been officially communicated.",
        "I have no special insight into this matter."
      ],
      Defensive: [
        "I don't know anything!",
        "Stop trying to make me seem suspicious!",
        "Everyone knows what I know!"
      ],
      Charming: [
        "I'm as much in the dark as anyone, detective.",
        "I wish I knew more to help your investigation.",
        "My knowledge is unfortunately limited."
      ],
      Evasive: [
        "I don't really pay attention to details...",
        "Maybe someone mentioned it...",
        "I might have heard something..."
      ],
      Aggressive: [
        "I don't know! How many times?!",
        "Why would I know that?!",
        "Ask someone else!"
      ],
      Cooperative: [
        "I only know what {victimName} told me.",
        "I heard about it after the fact, like everyone.",
        "I'm happy to share what little I do know."
      ],
      Suspicious: [
        "Why do you expect me to know that?",
        "That's oddly specific...",
        "Someone's pointing fingers at me..."
      ],
      Calm: [
        "I have no knowledge of those details.",
        "My awareness is limited.",
        "I know nothing beyond common knowledge."
      ],
      Arrogant: [
        "I don't concern myself with such minutiae.",
        "That's not my area of interest.",
        "I have no reason to know that."
      ]
    },
    BEHAVIOR: {
      Nervous: [
        "I'm scared! Wouldn't you be? {trembling}",
        "I'm always anxious around police! {fidgeting}",
        "This whole situation terrifies me! {sweating}"
      ],
      Calculating: [
        "I'm being cautious because false accusations occur.",
        "My behavior is rational given the circumstances.",
        "I'm simply being careful with my words."
      ],
      Defensive: [
        "Being nervous doesn't make me guilty!",
        "Anyone would be on edge!",
        "Stop psychoanalyzing me!"
      ],
      Charming: [
        "I'm doing my best to stay composed, detective.",
        "This is stressful for everyone involved.",
        "Forgive any nervousness - it's a difficult situation."
      ],
      Evasive: [
        "I just... I don't like these situations...",
        "Can we move on?",
        "I'm just trying to get through this..."
      ],
      Aggressive: [
        "So what if I'm nervous?!",
        "You'd be nervous too!",
        "My behavior is my business!"
      ],
      Cooperative: [
        "I apologize if I seem anxious. I want to help.",
        "I'm nervous because I'm innocent and scared.",
        "I know I'm not handling this well, but I'm trying."
      ],
      Suspicious: [
        "You're making me nervous with all these questions...",
        "Anyone would act this way under interrogation...",
        "Why are you focusing so much on my behavior?"
      ],
      Calm: [
        "I'm composed because I have nothing to hide.",
        "My behavior reflects my innocence.",
        "I see no reason for anxiety - I'm innocent."
      ],
      Arrogant: [
        "I'm perfectly composed.",
        "My behavior is appropriate.",
        "I don't justify my demeanor to anyone."
      ]
    },
    EVIDENCE_CONFRONTATION: {
      Nervous: [
        "That's impossible! I was never there! {panic}",
        "There must be a mistake! {desperate}",
        "Test it again! It's wrong! {pleading}"
      ],
      Calculating: [
        "That evidence must be contaminated or misidentified.",
        "I'd like to review the chain of custody.",
        "There are alternative explanations for that evidence."
      ],
      Defensive: [
        "That's impossible!",
        "Your lab made a mistake!",
        "I want that tested independently!"
      ],
      Charming: [
        "Detective, surely there's been an error...",
        "I can explain how that evidence is misleading...",
        "That doesn't connect to me as you think it does."
      ],
      Evasive: [
        "I... I don't understand how that's possible...",
        "There must be some explanation...",
        "Can we discuss this later?"
      ],
      Aggressive: [
        "That's false! Your evidence is garbage!",
        "I'm getting a lawyer!",
        "This is a frame-up!"
      ],
      Cooperative: [
        "I don't understand that evidence, but I'm innocent.",
        "Let me help you understand why that's misleading.",
        "I can explain how that evidence is incorrect."
      ],
      Suspicious: [
        "Where did that evidence really come from?",
        "Someone planted that...",
        "This is too convenient to be real..."
      ],
      Calm: [
        "That evidence is either false or misinterpreted.",
        "I have a logical explanation for that.",
        "Examine the evidence more carefully."
      ],
      Arrogant: [
        "That evidence is clearly flawed.",
        "Your forensics team is incompetent.",
        "I'll have my experts review that."
      ]
    }
  }
};

// Personality-based nervousness factors (baseline nervousness by personality)
const personalityNervousness = {
  'Nervous': { base: 60, range: 20 },        // 60-80: naturally anxious
  'Calculating': { base: 25, range: 15 },    // 25-40: stays calm
  'Defensive': { base: 55, range: 20 },      // 55-75: easily defensive
  'Charming': { base: 20, range: 15 },       // 20-35: confident
  'Evasive': { base: 50, range: 20 },        // 50-70: hiding something
  'Aggressive': { base: 45, range: 20 },     // 45-65: confrontational
  'Cooperative': { base: 30, range: 15 },    // 30-45: calm helper
  'Suspicious': { base: 65, range: 15 },     // 65-80: paranoid
  'Calm': { base: 20, range: 15 },           // 20-35: composed
  'Arrogant': { base: 15, range: 15 }        // 15-30: overconfident
};

// Helper: Generate unique name avoiding recent repetition
function generateUniqueName() {
  const maxAttempts = 50;
  let attempts = 0;
  let name;

  do {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    name = `${firstName} ${lastName}`;
    attempts++;
  } while (recentlyUsedNames.includes(name) && attempts < maxAttempts);

  // Track recently used names (keep last 50)
  recentlyUsedNames.push(name);
  if (recentlyUsedNames.length > 50) {
    recentlyUsedNames.shift();
  }

  return name;
}

// Helper: Generate suspect attributes for indirect evidence
function generateSuspectAttributes(suspect, difficulty) {
  const heightIndex = Math.floor(Math.random() * heightRanges.length);
  const shoeSize = 7 + heightIndex * 1.5 + Math.floor(Math.random() * 3);

  return {
    physical: {
      height: heightRanges[heightIndex],
      build: buildTypes[Math.floor(Math.random() * buildTypes.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
      handedness: Math.random() > 0.9 ? 'Left' : 'Right',
      shoeSize: Math.floor(shoeSize),
      hasLimp: Math.random() < 0.15,
      hasGlasses: Math.random() < 0.4,
      distinctiveMark: Math.random() < 0.3 ? ['scar on hand', 'tattoo on wrist', 'burn mark', 'distinctive ring'][Math.floor(Math.random() * 4)] : null
    },
    behavioral: {
      phoneArea: areaCodes[Math.floor(Math.random() * areaCodes.length)],
      voiceQuality: voiceQualities[Math.floor(Math.random() * voiceQualities.length)],
      smokingHabit: Math.random() < 0.2,
      drivesExpensiveCar: suspect.occupation === 'Business Partner' || suspect.occupation === 'Investor',
      shoeType: shoeTypes[Math.floor(Math.random() * shoeTypes.length)]
    }
  };
}

// Helper: Generate situational nervousness reasons for innocent suspects
function generateSituationalReasons(suspect, difficulty) {
  const reasons = [];
  const possibleReasons = [
    {
      key: 'Has Criminal Record',
      condition: () => Math.random() < 0.2,
      nervousness: 20,
      reveal: "I've had trouble with police before... this makes me anxious.",
      canReveal: true
    },
    {
      key: 'Financial Troubles',
      condition: () => Math.random() < 0.25,
      nervousness: 15,
      reveal: "I'm in serious debt... I'm scared of any attention.",
      canReveal: true
    },
    {
      key: 'Hiding Different Secret',
      condition: () => Math.random() < 0.3,
      nervousness: 20,
      reveal: "I'm hiding something... but not related to THIS.",
      canReveal: true
    },
    {
      key: 'Protecting Someone',
      condition: () => Math.random() < 0.15,
      nervousness: 15,
      reveal: "I'm covering for someone I care about.",
      canReveal: false
    },
    {
      key: 'Witness to Other Crime',
      condition: () => Math.random() < 0.18,
      nervousness: 18,
      reveal: "I saw something illegal that night... unrelated to this.",
      canReveal: true
    },
    {
      key: 'Fear of Retaliation',
      condition: () => Math.random() < 0.12,
      nervousness: 22,
      reveal: "Someone warned me not to talk to police.",
      canReveal: false
    },
    {
      key: 'Social Anxiety',
      condition: () => Math.random() < 0.2,
      nervousness: 15,
      reveal: "I have severe anxiety around authority figures.",
      canReveal: true
    },
    {
      key: 'Immigration Concerns',
      condition: () => Math.random() < 0.1,
      nervousness: 25,
      reveal: "I'm afraid of being deported if I get involved.",
      canReveal: false
    }
  ];

  // Difficulty affects how many innocent suspects have situational nervousness
  const maxReasons = difficulty <= 3 ? 1 : difficulty <= 6 ? 1 : 2;
  const numReasons = Math.random() < (0.3 + difficulty * 0.05) ? Math.min(Math.floor(Math.random() * maxReasons) + 1, 2) : 0;

  for (let i = 0; i < numReasons; i++) {
    const availableReasons = possibleReasons.filter(r =>
      !reasons.find(existing => existing.key === r.key) && r.condition()
    );

    if (availableReasons.length > 0) {
      const chosen = availableReasons[Math.floor(Math.random() * availableReasons.length)];
      reasons.push(chosen);
    }
  }

  return reasons;
}

// Helper: Calculate initial nervousness based on personality and other factors
function calculateNervousness(personality, isGuilty, isRedHerring, difficulty, situationalReasons = []) {
  const personalityData = personalityNervousness[personality];
  let baseNervousness = personalityData.base + Math.floor(Math.random() * personalityData.range);

  if (isGuilty) {
    // Guilty suspects: Add guilt-based nervousness, but it's moderated by personality
    // Higher difficulty = better at hiding guilt
    const guiltFactor = Math.max(10, 30 - (difficulty * 2));
    baseNervousness = Math.min(100, baseNervousness + guiltFactor);

    // Some personalities (Calculating, Calm, Arrogant) hide guilt better
    if (['Calculating', 'Calm', 'Arrogant'].includes(personality)) {
      baseNervousness = Math.max(20, baseNervousness - 15);
    }
  } else if (isRedHerring) {
    // Red herrings: Innocent but very nervous (usually Nervous, Defensive, Suspicious personalities)
    baseNervousness = Math.min(100, baseNervousness + 15);
  }

  // Add situational nervousness for innocent suspects
  if (!isGuilty && situationalReasons.length > 0) {
    const situationalBonus = situationalReasons.reduce((sum, r) => sum + r.nervousness, 0);
    baseNervousness = Math.min(100, baseNervousness + situationalBonus * 0.5); // Apply 50% of situational nervousness
  }

  return Math.max(10, Math.min(100, baseNervousness));
}

// Helper: Calculate dynamic nervousness during interrogation
function calculateDynamicNervousness(suspect, context) {
  const personalityData = personalityNervousness[suspect.personality] || { base: 40, range: 20 }; // Default fallback
  let nervousness = 0;

  // 1. Base personality (30%)
  const baseNerv = personalityData.base + Math.floor(Math.random() * personalityData.range);
  nervousness += baseNerv * 0.30;

  // 2. Situational factors (25%)
  if (suspect.situationalReasons && suspect.situationalReasons.length > 0) {
    const situationalBonus = suspect.situationalReasons.reduce((sum, r) => sum + r.nervousness, 0);
    nervousness += situationalBonus * 0.25;
  }

  // 3. Interrogation pressure (20%)
  const pressureBonus = Math.min(context.interrogationCount * 3 + context.evidencePresented * 5, 30);
  nervousness += pressureBonus * 0.20;

  // 4. Question type (15%)
  const questionModifiers = {
    'EVIDENCE_CONFRONTATION': 15,
    'BEHAVIOR': 12,
    'MOTIVE': 10,
    'ALIBI': 8,
    'OPPORTUNITY': 7,
    'KNOWLEDGE': 5
  };
  const questionBonus = questionModifiers[context.questionCategory] || 0;
  nervousness += questionBonus * 0.15;

  // 5. Guilt (10% - reduced weight)
  if (suspect.isGuilty) {
    const guiltFactor = Math.max(10, 25 - (context.difficulty * 2));
    nervousness += guiltFactor * 0.10;
  }

  return Math.min(100, Math.max(10, Math.floor(nervousness)));
}

// Helper: Select question for interrogation
function selectQuestion(suspect, caseData, previousQuestions = []) {
  const availableCategories = ['ALIBI', 'MOTIVE', 'OPPORTUNITY'];

  // Unlock more categories as investigation progresses
  if (caseData.interrogationCount > 1) {
    availableCategories.push('KNOWLEDGE', 'BEHAVIOR');
  }

  // Evidence confrontation only if relevant evidence found
  const relevantEvidence = caseData.evidence.filter(
    e => e.discovered && e.connectedTo === suspect.id
  );
  if (relevantEvidence.length > 0) {
    availableCategories.push('EVIDENCE_CONFRONTATION');
  }

  // Avoid repeating recent categories
  const recentCategories = previousQuestions.slice(-2).map(q => q.category);
  const freshCategories = availableCategories.filter(
    cat => !recentCategories.includes(cat)
  );

  const category = freshCategories.length > 0
    ? freshCategories[Math.floor(Math.random() * freshCategories.length)]
    : availableCategories[Math.floor(Math.random() * availableCategories.length)];

  return constructQuestion(category, suspect, caseData);
}

// Helper: Construct question with context
function constructQuestion(category, suspect, caseData) {
  const template = QUESTION_CATEGORIES[category];
  const variation = template.variations[Math.floor(Math.random() * template.variations.length)];

  // Get time of day
  const times = ['evening', 'morning', 'afternoon', 'night'];
  const timeOfDay = times[Math.floor(Math.random() * times.length)];

  // Get emotional state based on nervousness
  const getEmotionalState = (nervousness) => {
    if (nervousness > 70) return 'very nervous';
    if (nervousness > 50) return 'anxious';
    if (nervousness > 30) return 'tense';
    return 'calm';
  };

  // Context-aware replacements
  const question = variation
    .replace('{crimeType}', caseData.crimeType.toLowerCase().replace('⭐ legendary: ', ''))
    .replace('{victimName}', caseData.victim.name)
    .replace('{location}', caseData.location)
    .replace('{emotionalState}', getEmotionalState(suspect.nervousness))
    .replace('{timeOfDay}', timeOfDay);

  const responseType = template.responseTypes[Math.floor(Math.random() * template.responseTypes.length)];

  return {
    category,
    text: question,
    responseType
  };
}

// Helper: Generate response based on personality and guilt
function generateResponse(suspect, question, caseData) {
  const guiltStatus = suspect.isGuilty ? 'guilty' : 'innocent';
  const templates = RESPONSE_TEMPLATES[guiltStatus][question.category];

  if (!templates || !templates[suspect.personality]) {
    // Fallback to generic response
    return suspect.isGuilty
      ? "I... I don't know what to say..."
      : "I've told you everything I know.";
  }

  const personalityResponses = templates[suspect.personality];
  let response = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];

  // Replace placeholders
  response = response
    .replace(/{victimName}/g, caseData.victim.name)
    .replace(/{location}/g, caseData.location)
    .replace(/{truthfulLocation}/g, ['home', 'the office', 'a restaurant', 'the gym'][Math.floor(Math.random() * 4)])
    .replace(/{vagueLocation}/g, ['somewhere', 'around', 'nearby'][Math.floor(Math.random() * 3)])
    .replace(/{witnessType}/g, ['neighbor', 'colleague', 'friend', 'family member'][Math.floor(Math.random() * 4)])
    .replace(/{time1}/g, ['6:00 PM', '7:30 PM', '8:00 PM'][Math.floor(Math.random() * 3)])
    .replace(/{time2}/g, ['9:00 PM', '10:00 PM', '11:00 PM'][Math.floor(Math.random() * 3)])
    .replace(/{witness}/g, [caseData.suspects[Math.floor(Math.random() * caseData.suspects.length)].name.split(' ')[0]][0])
    .replace(/{clearTimeline}/g, 'I was working late, left around 9 PM, then went home')
    .replace(/{details}/g, 'receipts and timestamps')
    .replace(/{evidence}/g, 'my calendar and phone logs')
    .replace(/{pauseAction}/g, '*long pause*')
    .replace(/{nervousGesture}/g, '*fidgets with hands*')
    .replace(/{avoidGaze}/g, '*looks away*')
    .replace(/{controlledTone}/g, '*speaking calmly*')
    .replace(/{aggressivePosture}/g, '*leans forward aggressively*')
    .replace(/{raisedVoice}/g, '*voice rising*')
    .replace(/{smile}/g, '*slight smile*')
    .replace(/{sweating}/g, '*wiping sweat*')
    .replace(/{fidgeting}/g, '*nervous fidgeting*')
    .replace(/{emotional}/g, '*voice breaking*')
    .replace(/{anxious}/g, '*very anxious*')
    .replace(/{pleading}/g, '*pleading tone*')
    .replace(/{desperate}/g, '*desperately*')
    .replace(/{trembling}/g, '*hands trembling*')
    .replace(/{emphatic}/g, '*emphatically*')
    .replace(/{confused and scared}/g, '*confused and frightened*')
    .replace(/{panic}/g, '*panicking*')
    .replace(/{breaking}/g, '*voice breaking*')
    .replace(/{defeated}/g, '*sounding defeated*')
    .replace(/{resigned}/g, '*resigned sigh*')
    .replace(/{apologetic}/g, '*apologetically*')
    .replace(/{worried}/g, '*looking worried*')
    .replace(/{hesitant}/g, '*hesitating*')
    .replace(/{confused}/g, '*confused*')
    .replace(/{struggles}/g, '*struggling to remember*')
    .replace(/{stammering}/g, '*stammering*')
    .replace(/{panicking}/g, '*starting to panic*')
    .replace(/{too emphatic}/g, '*too emphatically*');

  return response;
}

// Track which hand-crafted cases have been used to avoid immediate repetition
let usedHandCraftedCases = [];

export function generateCase(caseNumber, difficulty = 1, isLegendary = false) {
  // Decide whether to use a hand-crafted case
  // Cases 1-2: Always procedural (tutorial phase)
  // Cases 3-9: 30% chance of hand-crafted
  // Cases 10+: 40% chance of hand-crafted
  const shouldUseHandCrafted =
    caseNumber >= 3 &&
    HAND_CRAFTED_CASES.length > 0 &&
    Math.random() < (caseNumber >= 10 ? 0.4 : 0.3);

  if (shouldUseHandCrafted) {
    // Filter hand-crafted cases by difficulty range (±1 difficulty)
    const suitableCases = HAND_CRAFTED_CASES.filter(hc =>
      Math.abs(hc.difficulty - difficulty) <= 1
    );

    if (suitableCases.length > 0) {
      // Prefer cases not recently used
      let availableCases = suitableCases.filter(hc => !usedHandCraftedCases.includes(hc.id));

      // If all have been used recently, reset the tracking
      if (availableCases.length === 0) {
        usedHandCraftedCases = [];
        availableCases = suitableCases;
      }

      // Select a random suitable case
      const selectedCase = availableCases[Math.floor(Math.random() * availableCases.length)];

      // Mark as used
      usedHandCraftedCases.push(selectedCase.id);
      if (usedHandCraftedCases.length > 5) {
        usedHandCraftedCases.shift(); // Keep only last 5
      }

      // Convert to game format and return
      return convertHandCraftedToGameFormat(selectedCase, caseNumber, isLegendary);
    }
  }

  // Fallback to procedural generation
  const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];

  // Scale complexity based on difficulty (1-10)
  const minSuspects = Math.min(3 + Math.floor(difficulty / 3), 8);
  const maxSuspects = Math.min(minSuspects + 2, 10);
  const numSuspects = minSuspects + Math.floor(Math.random() * (maxSuspects - minSuspects + 1));

  const guiltyIndex = Math.floor(Math.random() * numSuspects);

  // Red herring system: 40% chance to add a highly suspicious innocent suspect
  const hasRedHerring = Math.random() < 0.4;
  let redHerringIndex = -1;

  if (hasRedHerring && numSuspects > 2) {
    // Pick a random innocent suspect to be the red herring
    do {
      redHerringIndex = Math.floor(Math.random() * numSuspects);
    } while (redHerringIndex === guiltyIndex);
  }

  // Higher difficulty = harder to identify guilty party
  const baseSuspicion = Math.max(1, 5 - Math.floor(difficulty / 2));
  const suspects = Array.from({ length: numSuspects }, (_, i) => {
    const isGuilty = i === guiltyIndex;
    const isRedHerring = i === redHerringIndex;
    const personality = personalities[Math.floor(Math.random() * personalities.length)];

    // Force red herrings to have suspicious personalities
    const finalPersonality = isRedHerring
      ? ['Nervous', 'Defensive', 'Evasive', 'Suspicious'][Math.floor(Math.random() * 4)]
      : personality;

    const occupation = occupations[Math.floor(Math.random() * occupations.length)];

    // Create base suspect object first
    const baseSuspect = {
      id: i,
      name: generateUniqueName(),
      age: 25 + Math.floor(Math.random() * 40),
      occupation,
      personality: finalPersonality,
      alibi: generateAlibi(location),
      isGuilty,
      isRedHerring,
      suspicionLevel: isGuilty ? baseSuspicion :
                      isRedHerring ? Math.max(baseSuspicion - 1, 2) :
                      Math.floor(Math.random() * baseSuspicion) + 1,
      questioned: false,
      interrogationHistory: []
    };

    // Generate attributes for indirect evidence
    baseSuspect.attributes = generateSuspectAttributes(baseSuspect, difficulty);

    // Generate situational nervousness reasons for innocent suspects
    baseSuspect.situationalReasons = !isGuilty ? generateSituationalReasons(baseSuspect, difficulty) : [];
    baseSuspect.secretRevealed = false;

    // Calculate initial nervousness
    baseSuspect.nervousness = calculateNervousness(
      finalPersonality,
      isGuilty,
      isRedHerring,
      difficulty,
      baseSuspect.situationalReasons
    );

    return baseSuspect;
  });

  // More evidence at higher difficulty
  const numEvidence = 8 + Math.floor(difficulty * 1.5) + Math.floor(Math.random() * 5);
  const numGuiltyEvidence = Math.max(3, Math.floor(numEvidence * 0.4)); // 40% points to guilty
  const numRedHerringEvidence = hasRedHerring ? Math.min(2, Math.floor(numEvidence * 0.2)) : 0; // 20% to red herring

  const evidence = Array.from({ length: numEvidence }, (_, i) => {
    let connectedTo = null;

    // Distribute evidence strategically
    if (i < numGuiltyEvidence) {
      connectedTo = guiltyIndex; // Strong evidence points to guilty party
    } else if (hasRedHerring && i >= numGuiltyEvidence && i < numGuiltyEvidence + numRedHerringEvidence) {
      connectedTo = redHerringIndex; // Red herring evidence (circumstantial, misleading)
    }

    const targetSuspect = connectedTo !== null ? suspects[connectedTo] : suspects[guiltyIndex];
    const evidenceType = evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)];

    return {
      id: i,
      type: evidenceType,
      description: generateEvidenceDescription(
        evidenceType,
        targetSuspect,
        suspects,
        difficulty,
        connectedTo === redHerringIndex
      ),
      location: i < 3 ? 'Crime Scene' : ['Office', 'Storage Room', 'Parking Lot', 'Nearby Street'][Math.floor(Math.random() * 4)],
      connectedTo,
      discovered: false,
      critical: connectedTo === guiltyIndex && i < Math.max(2, Math.floor(difficulty / 3))
    };
  });

  // Generate victim information
  const victimName = generateUniqueName();
  const victimOccupation = occupations[Math.floor(Math.random() * occupations.length)];

  // Generate title and narrative for procedural cases
  const title = `The ${location} ${crimeType}`;
  const narrative = {
    opening: `A ${crimeType.toLowerCase()} has been reported at the ${location}. ${victimName}, a local ${victimOccupation.toLowerCase()}, is the victim. You've been assigned to investigate this case. Gather evidence, interrogate ${numSuspects} suspects, and identify the perpetrator.`
  };

  return {
    caseNumber,
    difficulty,
    isLegendary,
    title,
    narrative,
    crimeType: isLegendary ? `⭐ LEGENDARY: ${crimeType}` : crimeType,
    location,
    victim: {
      name: victimName,
      occupation: victimOccupation
    },
    suspects,
    evidence,
    guiltyIndex,
    hasRedHerring,
    redHerringIndex,
    startTime: new Date().toLocaleString(),
    cluesFound: 0,
    interrogationCount: 0,
    // Evidence triangulation tracking
    evidenceCategories: {
      physical: 0,      // Fingerprints, DNA, weapon, footprints
      digital: 0,       // Phone records, emails, security footage
      testimony: 0,     // Witness statements, interrogation
      financial: 0,     // Financial records, receipts
      forensic: 0       // Blood stains, toxicology
    }
  };
}

function generateAlibi(location) {
  // Expanded alibis for more variety (+317%)
  const alibis = [
    `Claims to have been in the ${location} office at the time`,
    `Says they were outside making phone calls`,
    `States they arrived late and found the victim`,
    `Claims they were with another person`,
    `Says they left early before the incident`,
    `States they were in a different room entirely`,
    `Claims to have been getting refreshments`,
    `Says they were in the restroom`,
    `States they stepped out for fresh air`,
    `Claims they were on an important call in their car`,
    `Says they were checking their vehicle in the parking lot`,
    `States they were speaking with staff members`,
    `Claims to have been reviewing documents alone`,
    `Says they were waiting for someone who never showed`,
    `States they were taking a walk to clear their head`,
    `Claims they were having a private conversation`,
    `Says they were searching for their lost item`,
    `States they arrived just moments before the discovery`,
    `Claims they were photographing the ${location}`,
    `Says they were handling a personal emergency outside`,
    `States they were meeting with security about an issue`,
    `Claims they never left the main area`,
    `Says they were in deep conversation and lost track of time`,
    `States they were monitoring the event from a distance`,
    `Claims they were networking with other guests`
  ];
  return alibis[Math.floor(Math.random() * alibis.length)];
}

function generateEvidenceDescription(evidenceType, targetSuspect, allSuspects, difficulty, isRedHerringEvidence = false) {
  if (!targetSuspect.attributes) {
    return 'Evidence found at the scene'; // Fallback
  }

  const attr = targetSuspect.attributes;
  const specificity = difficulty <= 3 ? 0.7 : difficulty <= 6 ? 0.5 : 0.3;
  const isSpecific = Math.random() < specificity;

  // Count how many suspects share each attribute
  const countMatches = (attribute, value) => {
    return allSuspects.filter(s => s.attributes && s.attributes[attribute] === value).length;
  };

  if (isRedHerringEvidence) {
    // Circumstantial/vague evidence for red herrings
    const vagueDescriptions = [
      `Witness reports seeing someone matching general description near the scene`,
      `Financial stress indicators found in records (common among several suspects)`,
      `Unverified reports of presence in the area around the time of incident`,
      `Phone activity detected in general vicinity during relevant timeframe`,
      `Behavioral changes noted by associates in recent weeks`,
      `Access logs show possible entry but timestamp is unclear`,
      `Second-hand testimony suggests involvement but lacks specifics`,
      `Circumstantial connections to victim's recent activities`
    ];
    return vagueDescriptions[Math.floor(Math.random() * vagueDescriptions.length)];
  }

  // Generate indirect evidence based on type
  switch (evidenceType) {
    case 'Fingerprints':
      if (isSpecific) {
        const handMatch = countMatches('handedness', attr.physical.handedness);
        return handMatch <= 2
          ? `Partial fingerprints showing ${attr.physical.handedness.toLowerCase()}-handed loop pattern${attr.physical.distinctiveMark ? ' with visible scar tissue on index finger' : ''}`
          : `Smudged fingerprints found - partial ridge pattern visible but not fully identifiable`;
      }
      return `Fingerprints detected on surface - analysis shows ${attr.physical.handedness.toLowerCase()}-handed individual`;

    case 'DNA Sample':
      if (isSpecific) {
        const bloodMatch = countMatches('bloodType', attr.physical.bloodType);
        return bloodMatch === 1
          ? `DNA reveals blood type ${attr.physical.bloodType} - extremely rare (present in ~${bloodMatch === 1 ? '1-2' : '3-4'}% of population)`
          : `DNA indicates ${attr.physical.hairColor.toLowerCase()} hair and ${attr.physical.eyeColor.toLowerCase()} eyes`;
      }
      return `Biological material recovered - genetic markers suggest ${attr.physical.hairColor.toLowerCase()}-haired individual`;

    case 'Footprints':
      if (isSpecific) {
        const shoeMatch = countMatches('shoeSize', attr.physical.shoeSize);
        return `${attr.behavioral.shoeType} imprint, size ${attr.physical.shoeSize}${attr.physical.hasLimp ? ' with distinctive dragging pattern indicating limp' : ''} (suggests ${attr.physical.height} individual)`;
      }
      return `Shoe impression found - consistent with ${attr.physical.height} person wearing ${attr.behavioral.shoeType.toLowerCase()}`;

    case 'Security Footage':
      const features = [];
      if (attr.physical.hasGlasses) features.push('wearing glasses');
      if (attr.physical.hasLimp) features.push('walking with noticeable limp');
      if (attr.physical.build) features.push(`${attr.physical.build.toLowerCase()}`);

      if (isSpecific) {
        return `Grainy footage shows ${attr.physical.height} individual${features.length > 0 ? ', ' + features.join(', ') : ''} entering at 8:47 PM`;
      }
      return `Video surveillance captured person of ${attr.physical.build.toLowerCase()} approaching scene`;

    case 'Witness Testimony':
      if (isSpecific) {
        return `Witness describes ${attr.physical.height}, ${attr.physical.build.toLowerCase()}, heard ${attr.behavioral.voiceQuality.toLowerCase()} voice${attr.physical.hasGlasses ? ', wearing glasses' : ''}`;
      }
      return `Eyewitness reports seeing ${attr.physical.build.toLowerCase()} individual with ${attr.behavioral.voiceQuality.toLowerCase()} voice`;

    case 'Phone Records':
      if (isSpecific) {
        return `Multiple calls from ${attr.behavioral.phoneArea} area code to victim in days before incident - 17 calls total, increasing in frequency`;
      }
      return `Phone records show calls from ${attr.behavioral.phoneArea} area code region`;

    case 'Email Records':
      return isSpecific
        ? `Recovered email draft contains threatening language - sender used device with specific typing patterns suggesting ${attr.physical.handedness.toLowerCase()}-handed typist`
        : `Email correspondence shows escalating tension - metadata suggests sender in local area`;

    case 'Financial Documents':
      return isSpecific
        ? `Financial trail shows large cash withdrawal by individual with ${attr.behavioral.drivesExpensiveCar ? 'high-value' : 'moderate'} assets two days before incident`
        : `Money transfer records indicate suspicious transaction patterns`;

    case 'Blood Stains':
      if (isSpecific) {
        const bloodMatch = countMatches('bloodType', attr.physical.bloodType);
        return bloodMatch <= 2
          ? `Blood spatter analysis reveals ${attr.physical.bloodType} type - rare blood type (${bloodMatch} ${bloodMatch === 1 ? 'person' : 'people'} in current suspect pool)`
          : `Blood drops suggest struggle, blood type ${attr.physical.bloodType} found`;
      }
      return `Blood evidence collected - type ${attr.physical.bloodType} identified`;

    case 'Weapon':
      return isSpecific
        ? `Weapon shows ${attr.physical.handedness.toLowerCase()}-handed grip marks and fingerprint fragments consistent with ${attr.physical.height} individual`
        : `Weapon recovered with partial forensic markers`;

    case 'Threatening Letter':
      return isSpecific
        ? `Handwritten note analysis shows ${attr.physical.handedness.toLowerCase()}-handed writer with distinctive ${attr.physical.handedness === 'Left' ? 'hook' : 'slant'} style`
        : `Threatening message found - handwriting analysis in progress`;

    case 'Receipts':
      return isSpecific
        ? `Purchase receipt from nearby store timestamped 8:35 PM - security image shows ${attr.physical.height}, ${attr.physical.build.toLowerCase()} buyer`
        : `Receipt found near scene with partial identification markers`;

    case 'Toxicology Report':
      return isSpecific
        ? `Substance traces match rare compound - only accessible to individuals in specific professions or with specialized access`
        : `Chemical analysis reveals unusual substance present at scene`;

    case 'Fiber Analysis':
      return isSpecific
        ? `Fabric fibers found matching ${attr.behavioral.drivesExpensiveCar ? 'luxury vehicle interior' : 'common clothing material'} - consistent with ${attr.physical.hairColor.toLowerCase()}-haired person due to secondary transfer`
        : `Textile fibers recovered from scene - analysis in progress`;

    case 'Audio Recording':
      return isSpecific
        ? `Voice recording captures ${attr.behavioral.voiceQuality.toLowerCase()} voice discussing incident details - stress analysis suggests deception`
        : `Audio evidence obtained - voice analysis pending`;

    case 'GPS Data':
      return isSpecific
        ? `GPS coordinates place ${attr.behavioral.drivesExpensiveCar ? 'vehicle' : 'mobile device'} at scene between 8:30-9:15 PM - matches timeframe of incident`
        : `Location data recovered showing presence near crime scene`;

    case 'Digital Photo':
      return isSpecific
        ? `Photo metadata shows ${attr.physical.height}, ${attr.physical.build.toLowerCase()} individual${attr.physical.hasGlasses ? ' wearing glasses' : ''} at location shortly before incident`
        : `Digital image evidence collected with timestamp data`;

    case 'Handwriting Sample':
      return isSpecific
        ? `Handwriting analysis confirms ${attr.physical.handedness.toLowerCase()}-handed writer with distinctive pressure patterns matching threatened documents`
        : `Handwritten note found - graphology analysis underway`;

    case 'Surveillance Report':
      return isSpecific
        ? `Private investigator report documents ${attr.physical.height} individual with ${attr.physical.build.toLowerCase()}, ${attr.behavioral.voiceQuality.toLowerCase()} voice conducting suspicious activities`
        : `Surveillance documentation shows suspicious behavior patterns`;

    case 'Bank Statement':
      return isSpecific
        ? `Banking records reveal ${attr.behavioral.drivesExpensiveCar ? 'large' : 'moderate'} financial transactions to suspicious accounts - pattern suggests motive`
        : `Financial institution records show unusual account activity`;

    case 'Text Messages':
      return isSpecific
        ? `Text exchange from ${attr.behavioral.phoneArea} area code contains incriminating details only perpetrator would know - sent ${attr.physical.handedness === 'Left' ? 'with left thumb typing pattern' : 'with right-hand dominance'}`
        : `SMS records recovered showing relevant communications`;

    case 'Tire Tracks':
      return isSpecific
        ? `Vehicle tire impressions match ${attr.behavioral.drivesExpensiveCar ? 'premium brand tires from luxury vehicle' : 'standard commercial tire pattern'} - tread wear suggests frequent use`
        : `Tire marks found at scene - vehicle identification in progress`;

    case 'Ballistics Report':
      return isSpecific
        ? `Bullet trajectory analysis indicates ${attr.physical.height} shooter with ${attr.physical.handedness.toLowerCase()}-handed firing stance - gunpowder residue pattern consistent`
        : `Ballistic evidence analyzed - weapon type identified`;

    case 'Calendar Entry':
      return isSpecific
        ? `Digital calendar shows meeting scheduled at crime scene location - entry created by ${attr.behavioral.phoneArea} area device, notes suggest premeditation`
        : `Schedule records indicate planned presence at relevant time`;

    case 'Meeting Notes':
      return isSpecific
        ? `Handwritten notes in ${attr.physical.handedness.toLowerCase()}-handed script reference victim by name - tone escalates to threatening language in final entries`
        : `Written documentation of interactions discovered`;

    case 'Purchase History':
      return isSpecific
        ? `Credit card records show purchase of items related to crime - buyer description matches ${attr.physical.height}, ${attr.physical.build.toLowerCase()} individual on security camera`
        : `Transaction records reveal potentially relevant purchases`;

    case 'Travel Records':
      return isSpecific
        ? `Flight/transit logs confirm presence in city during incident window - ${attr.behavioral.drivesExpensiveCar ? 'first-class' : 'economy'} booking under matching name`
        : `Transportation records document movements during relevant period`;

    case 'Social Media Posts':
      return isSpecific
        ? `Online posts from ${attr.behavioral.phoneArea} area contain veiled threats toward victim - posting pattern matches ${attr.physical.handedness === 'Left' ? 'left-handed mobile user' : 'right-handed typing'}`
        : `Digital footprint shows relevant online activity`;

    case 'Voicemail':
      return isSpecific
        ? `Recorded message features ${attr.behavioral.voiceQuality.toLowerCase()} voice making threatening statements - background noise suggests ${attr.behavioral.drivesExpensiveCar ? 'luxury car interior' : 'standard vehicle'}`
        : `Voice message evidence recovered from victim's phone`;

    case 'Key Card Access':
      return isSpecific
        ? `Security badge logs show entry at 8:42 PM by ${attr.physical.height} individual - surveillance confirms ${attr.physical.build.toLowerCase()}${attr.physical.hasGlasses ? ', wearing glasses' : ''}`
        : `Electronic access records indicate unauthorized entry`;

    case 'CCTV Timestamp':
      return isSpecific
        ? `Video timestamp shows ${attr.physical.height}, ${attr.physical.build.toLowerCase()} person${attr.physical.hasLimp ? ' with distinctive limp' : ''} entering restricted area at critical moment`
        : `Security camera logs reveal suspicious timing patterns`;

    case 'Deleted Files':
      return isSpecific
        ? `Recovered digital files show ${attr.physical.handedness.toLowerCase()}-handed typing patterns in incriminating documents - deletion timestamp matches incident aftermath`
        : `Data recovery reveals intentionally erased information`;

    default:
      return `Evidence collected - analysis shows connection to ${attr.physical.height} individual`;
  }
}

export function interrogateSuspect(suspect, caseData, questionCategory = null) {
  // Initialize interrogation history if not exists
  if (!suspect.interrogationHistory) {
    suspect.interrogationHistory = [];
  }

  // Select question
  const question = questionCategory
    ? constructQuestion(questionCategory, suspect, caseData)
    : selectQuestion(suspect, caseData, suspect.interrogationHistory);

  // Generate response
  const response = generateResponse(suspect, question, caseData);

  // Calculate dynamic nervousness
  const evidencePresented = caseData.evidence.filter(e => e.discovered && e.connectedTo === suspect.id).length;
  const newNervousness = calculateDynamicNervousness(suspect, {
    interrogationCount: caseData.interrogationCount || 0,
    evidencePresented,
    questionCategory: question.category,
    difficulty: caseData.difficulty
  });

  // Update suspect nervousness (with tendency for guilty to increase over time)
  if (suspect.isGuilty) {
    suspect.nervousness = Math.min(suspect.nervousness + 10, 100);
  } else {
    // Innocent suspects: fluctuate based on question type
    const delta = Math.floor(Math.random() * 6) - 2; // -2 to +4
    suspect.nervousness = Math.max(10, Math.min(100, suspect.nervousness + delta));
  }

  // Body language based on guilt and personality
  const getBodyLanguage = () => {
    if (suspect.isGuilty) {
      const guiltyLanguage = [
        'Avoiding eye contact',
        'Fidgeting with hands',
        'Sweating visibly',
        'Defensive posture',
        'Voice wavering',
        'Looking at exits',
        'Crossing arms tightly',
        'Rapid blinking'
      ];
      return guiltyLanguage[Math.floor(Math.random() * guiltyLanguage.length)];
    } else if (suspect.situationalReasons && suspect.situationalReasons.length > 0) {
      const situationalLanguage = [
        'Nervous but maintaining eye contact',
        'Fidgeting but answering directly',
        'Anxious demeanor but consistent story',
        'Sweating due to stress, not guilt',
        'Tense posture but cooperative tone',
        'Nervous energy but clear responses'
      ];
      return situationalLanguage[Math.floor(Math.random() * situationalLanguage.length)];
    } else {
      const innocentLanguage = [
        'Calm demeanor',
        'Open posture',
        'Steady eye contact',
        'Relaxed but attentive',
        'Confident tone',
        'Cooperative gestures'
      ];
      return innocentLanguage[Math.floor(Math.random() * innocentLanguage.length)];
    }
  };

  // Record this interrogation
  suspect.interrogationHistory.push({
    question: question.text,
    category: question.category,
    nervousness: newNervousness
  });

  return {
    question: question.text,
    response,
    nervousness: newNervousness,
    bodyLanguage: getBodyLanguage(),
    questionCategory: question.category,
    nervousnessChange: newNervousness - (suspect.interrogationHistory.length > 1 ? suspect.interrogationHistory[suspect.interrogationHistory.length - 2].nervousness : suspect.nervousness)
  };
}

// Helper: Calculate evidence matching for a suspect
export function calculateEvidenceMatch(evidence, suspect) {
  // Comprehensive safety checks
  if (!evidence || !suspect) {
    return { percentage: 0, matchingTraits: [], confidence: 'NONE', traitCount: 0 };
  }

  if (!suspect.attributes || !suspect.attributes.physical || !suspect.attributes.behavioral) {
    return { percentage: 0, matchingTraits: [], confidence: 'NONE', traitCount: 0 };
  }

  if (!evidence.description || typeof evidence.description !== 'string') {
    return { percentage: 0, matchingTraits: [], confidence: 'NONE', traitCount: 0 };
  }

  const matchingTraits = [];
  const attr = suspect.attributes;
  const desc = evidence.description.toLowerCase();

  // Check physical attributes with null safety
  if (attr.physical.height && desc.includes(attr.physical.height.toLowerCase())) matchingTraits.push('height');
  if (attr.physical.build && desc.includes(attr.physical.build.toLowerCase())) matchingTraits.push('build');
  if (attr.physical.hairColor && desc.includes(attr.physical.hairColor.toLowerCase())) matchingTraits.push('hair color');
  if (attr.physical.eyeColor && desc.includes(attr.physical.eyeColor.toLowerCase())) matchingTraits.push('eye color');
  if (attr.physical.bloodType && desc.includes(attr.physical.bloodType)) matchingTraits.push('blood type');
  if (attr.physical.handedness && desc.includes(attr.physical.handedness.toLowerCase())) matchingTraits.push('handedness');
  if (attr.physical.shoeSize && desc.includes(`size ${attr.physical.shoeSize}`)) matchingTraits.push('shoe size');
  if (attr.physical.hasLimp && desc.includes('limp')) matchingTraits.push('limp');
  if (attr.physical.hasGlasses && desc.includes('glasses')) matchingTraits.push('glasses');
  if (attr.physical.distinctiveMark && desc.includes(attr.physical.distinctiveMark)) matchingTraits.push('distinctive mark');

  // Check behavioral attributes with null safety
  if (attr.behavioral.phoneArea && desc.includes(attr.behavioral.phoneArea)) matchingTraits.push('phone area code');
  if (attr.behavioral.voiceQuality && desc.includes(attr.behavioral.voiceQuality.toLowerCase())) matchingTraits.push('voice');
  if (attr.behavioral.shoeType && desc.includes(attr.behavioral.shoeType.toLowerCase())) matchingTraits.push('shoe type');

  // Calculate match percentage (more traits = higher match)
  const totalPossibleTraits = 13; // Total number of traits we check
  const matchPercentage = Math.floor((matchingTraits.length / totalPossibleTraits) * 100);

  let confidence = 'NONE';
  if (matchPercentage >= 40) confidence = 'HIGH';
  else if (matchPercentage >= 20) confidence = 'MEDIUM';
  else if (matchPercentage >= 10) confidence = 'LOW';

  return {
    percentage: matchPercentage,
    matchingTraits,
    confidence,
    traitCount: matchingTraits.length
  };
}

// Helper: Get evidence matching summary for all suspects
export function getEvidenceMatchingSummary(caseData) {
  // Safety checks
  if (!caseData || !caseData.suspects || !caseData.evidence) {
    console.error('Invalid caseData in getEvidenceMatchingSummary');
    return [];
  }

  const summary = caseData.suspects.map(suspect => {
    if (!suspect) {
      console.error('Invalid suspect in getEvidenceMatchingSummary');
      return null;
    }

    const discoveredEvidence = caseData.evidence.filter(e => e && e.discovered);
    const matches = discoveredEvidence.map(evidence => calculateEvidenceMatch(evidence, suspect));

    const totalMatches = matches.reduce((sum, m) => sum + (m.traitCount || 0), 0);
    const avgPercentage = matches.length > 0
      ? Math.floor(matches.reduce((sum, m) => sum + (m.percentage || 0), 0) / matches.length)
      : 0;

    const directlyConnected = discoveredEvidence.filter(e => e.connectedTo === suspect.id).length;

    return {
      suspectId: suspect.id,
      suspectName: suspect.name || 'Unknown',
      totalMatchingTraits: totalMatches,
      averageMatchPercentage: avgPercentage,
      directlyConnectedEvidence: directlyConnected,
      highConfidenceMatches: matches.filter(m => m.confidence === 'HIGH').length,
      mediumConfidenceMatches: matches.filter(m => m.confidence === 'MEDIUM').length
    };
  }).filter(s => s !== null); // Remove null entries

  return summary.sort((a, b) => b.totalMatchingTraits - a.totalMatchingTraits);
}

// Helper: Check if player has sufficient evidence for accusation
export function checkEvidenceStrength(suspectId, caseData) {
  // Safety checks
  if (!caseData || !caseData.evidence || !caseData.suspects) {
    console.error('Invalid caseData in checkEvidenceStrength:', caseData);
    return {
      strength: 'unknown',
      evidenceCount: 0,
      totalEvidence: 0,
      matchingTraits: 0,
      warning: 'Unable to evaluate evidence',
      shouldWarn: false
    };
  }

  const suspect = caseData.suspects[suspectId];
  if (!suspect) {
    console.error('Suspect not found:', suspectId);
    return {
      strength: 'unknown',
      evidenceCount: 0,
      totalEvidence: 0,
      matchingTraits: 0,
      warning: 'Suspect not found',
      shouldWarn: false
    };
  }

  const evidenceAgainstSuspect = caseData.evidence.filter(
    e => e.discovered && e.connectedTo === suspectId
  ).length;

  const totalEvidence = caseData.evidence.filter(e => e.discovered).length;

  // Also check matching traits
  let matchingSummary = [];
  let suspectMatch = null;
  try {
    matchingSummary = getEvidenceMatchingSummary(caseData);
    suspectMatch = matchingSummary.find(s => s.suspectId === suspectId);
  } catch (error) {
    console.error('Error in getEvidenceMatchingSummary:', error);
    // Continue without matching summary
  }

  // Determine evidence strength
  let strength = 'none';
  let warning = '';

  if (evidenceAgainstSuspect === 0 && (!suspectMatch || suspectMatch.totalMatchingTraits < 3)) {
    strength = 'none';
    warning = `⚠️ You have very little evidence connecting ${suspect.name} to the crime. Accusation would be highly speculative.`;
  } else if (evidenceAgainstSuspect === 1 || (suspectMatch && suspectMatch.totalMatchingTraits < 5)) {
    strength = 'weak';
    warning = `⚠️ You have limited evidence against ${suspect.name}. Consider gathering more evidence for a stronger case.`;
  } else if (evidenceAgainstSuspect === 2 || (suspectMatch && suspectMatch.totalMatchingTraits < 8)) {
    strength = 'moderate';
    warning = `You have moderate evidence against ${suspect.name}. This may be sufficient, but more evidence would strengthen your case.`;
  } else {
    strength = 'strong';
    warning = `✓ You have strong evidence against ${suspect.name}. ${suspectMatch ? `${suspectMatch.totalMatchingTraits} matching traits found.` : ''}`;
  }

  return {
    strength,
    evidenceCount: evidenceAgainstSuspect,
    totalEvidence,
    matchingTraits: suspectMatch ? suspectMatch.totalMatchingTraits : 0,
    warning,
    shouldWarn: evidenceAgainstSuspect < 2 && (!suspectMatch || suspectMatch.totalMatchingTraits < 5)
  };
}

export function evaluateAccusation(accusedId, caseData, hintsUsed = 0) {
  const correct = accusedId === caseData.guiltyIndex;
  const guiltyName = caseData.suspects[caseData.guiltyIndex].name;
  const accusedName = caseData.suspects[accusedId].name;
  const accusedSuspect = caseData.suspects[accusedId];

  const evidenceFound = caseData.evidence.filter(e => e.discovered).length;
  const criticalEvidence = caseData.evidence.filter(e => e.critical && e.discovered).length;

  // Evidence triangulation: Check how much evidence points to the accused
  const evidenceAgainstAccused = caseData.evidence.filter(
    e => e.discovered && e.connectedTo === accusedId
  ).length;

  const evidenceAgainstGuilty = caseData.evidence.filter(
    e => e.discovered && e.connectedTo === caseData.guiltyIndex
  ).length;

  // Check if player accused the red herring
  const isRedHerringAccused = caseData.hasRedHerring && accusedId === caseData.redHerringIndex;

  let stars = 0;
  let feedback = '';

  if (correct) {
    stars = 1;
    if (criticalEvidence >= 1) stars++;
    if (evidenceFound >= caseData.evidence.length * 0.6) stars++;
    if (caseData.interrogationCount >= caseData.suspects.length) stars++;
    if (criticalEvidence === 2) stars++;
    if (evidenceAgainstGuilty >= 3) stars++; // Bonus for strong evidence collection

    // Reduce stars for using hints (max reduction of 2 stars)
    const hintPenalty = Math.min(Math.floor(hintsUsed / 2), 2);
    stars = Math.max(1, stars - hintPenalty);

    feedback = `You successfully identified the perpetrator using ${evidenceFound} pieces of evidence (${evidenceAgainstGuilty} directly linked).${hintsUsed > 0 ? ` (${hintsUsed} hint${hintsUsed > 1 ? 's' : ''} used)` : ''}`;
  } else {
    // Wrong accusation
    if (isRedHerringAccused) {
      feedback = `You fell for the red herring! ${accusedName} appeared suspicious (${accusedSuspect.personality}, ${accusedSuspect.nervousness}% nervous) but was innocent. ${guiltyName} was the real culprit with ${evidenceAgainstGuilty} pieces of evidence.`;
    } else if (evidenceAgainstAccused > 0) {
      feedback = `Despite ${evidenceAgainstAccused} piece(s) of circumstantial evidence, ${accusedName} was innocent. You needed stronger evidence against ${guiltyName}.`;
    } else {
      feedback = `You had no evidence connecting ${accusedName} to the crime. ${guiltyName} had ${evidenceAgainstGuilty} pieces of evidence and was the real culprit.`;
    }
  }

  return {
    correct,
    stars,
    message: correct ?
      `🎯 CORRECT! ${guiltyName} was indeed the culprit. Excellent work, Detective!` :
      `❌ WRONG! ${accusedName} was innocent. The real culprit was ${guiltyName}.`,
    feedback,
    reputation: correct ? stars * 200 : 50,
    evidenceStrength: {
      againstAccused: evidenceAgainstAccused,
      againstGuilty: evidenceAgainstGuilty,
      totalFound: evidenceFound,
      isRedHerring: isRedHerringAccused
    }
  };
}
