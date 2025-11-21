// Hand-Crafted Detective Cases with Rich Narratives
// These cases provide unique, memorable experiences with plot twists and character depth

export const HAND_CRAFTED_CASES = [
  {
    id: 'gallery_heist',
    title: 'The Midnight Gallery Heist',
    difficulty: 3,
    crimeType: 'Theft',
    priority: 'HIGH',
    location: 'Artisan Gallery',
    narrative: {
      opening: `The prestigious Artisan Gallery has been robbed. A priceless 18th-century painting, "The Merchant's Daughter," vanished overnight despite state-of-the-art security. The alarm never triggered. This was an inside job.`,
      twist: 'The painting was never stolen - it was a forgery all along. The real thief stole the original months ago and replaced it with a fake. The "heist" was staged to cover up the earlier theft.',
      conclusion: `The gallery curator discovered the forgery and staged the heist to avoid revealing their failure to authenticate the painting. The real thief had been selling pieces on the black market for months.`
    },
    victim: {
      name: 'Marcus Whitmore',
      age: 58,
      occupation: 'Gallery Owner',
      background: 'Inherited the gallery from his father. Desperate financial situation due to gambling debts.',
      personality: 'Charming but desperate'
    },
    suspects: [
      {
        name: 'Diana Chen',
        age: 34,
        occupation: 'Gallery Curator',
        personality: 'Calculating',
        motive: 'Career Protection',
        alibi: 'Claims she was at a wine tasting event until 11 PM',
        isGuilty: true,
        backstory: 'Authenticated the painting 6 months ago without proper verification. Discovered it was a forgery last week.',
        secret: 'Has a side business dealing in art authentication fraud',
        attributes: {
          physical: { height: '5\'5"-5\'8"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'A+', handedness: 'Right', shoeSize: 8, hasGlasses: true },
          behavioral: { phoneArea: '617', voiceQuality: 'Smooth and calm', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'Roberto Vasquez',
        age: 42,
        occupation: 'Security Chief',
        personality: 'Defensive',
        motive: 'False Lead',
        alibi: 'Was monitoring security feeds from home',
        isGuilty: false,
        backstory: 'Ex-military, takes his job very seriously. Feels responsible for the security breach.',
        secret: 'Was asleep on duty three hours before the alleged theft',
        attributes: {
          physical: { height: '6\'0"-6\'3"', build: 'Athletic build', hairColor: 'Dark brown', eyeColor: 'Brown', bloodType: 'O+', handedness: 'Right', shoeSize: 11, hasGlasses: false },
          behavioral: { phoneArea: '212', voiceQuality: 'Deep and gravelly', shoeType: 'Boots', smokingHabit: false }
        }
      },
      {
        name: 'Evelyn Harper',
        age: 29,
        occupation: 'Art Conservator',
        personality: 'Nervous',
        motive: 'False Lead',
        alibi: 'Says she was working late in the conservation lab',
        isGuilty: false,
        backstory: 'Brilliant but anxious. Recently promoted. Discovered anomalies in the painting but didn\'t report them.',
        secret: 'Has severe social anxiety and was hiding in the lab avoiding a gallery event',
        attributes: {
          physical: { height: '5\'2"-5\'5"', build: 'Slim build', hairColor: 'Blonde', eyeColor: 'Blue', bloodType: 'B+', handedness: 'Left', shoeSize: 7, hasGlasses: true },
          behavioral: { phoneArea: '415', voiceQuality: 'Soft-spoken', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'James Blackwood',
        age: 51,
        occupation: 'Private Art Dealer',
        personality: 'Arrogant',
        motive: 'Red Herring',
        alibi: 'Claims he was in New York at an auction',
        isGuilty: false,
        backstory: 'Has a reputation for acquiring art through questionable means. Visited the gallery the day before.',
        secret: 'Was actually meeting with a different stolen art buyer that night',
        attributes: {
          physical: { height: '5\'8"-6\'0"', build: 'Medium build', hairColor: 'Gray', eyeColor: 'Green', bloodType: 'AB-', handedness: 'Right', shoeSize: 10, hasGlasses: false },
          behavioral: { phoneArea: '310', voiceQuality: 'Booming', shoeType: 'Loafers', smokingHabit: true }
        }
      }
    ],
    evidence: [
      {
        type: 'Security Footage',
        description: 'Shows Diana Chen entering the gallery at 10:30 PM, contradicting her alibi. She\'s carrying a large portfolio case.',
        location: 'Security Office',
        critical: true,
        connectedSuspect: 'Diana Chen'
      },
      {
        type: 'Email Records',
        description: 'Encrypted emails between Diana Chen and an anonymous buyer discussing "merchandise delivery" and "authentication concerns".',
        location: 'Diana\'s Computer',
        critical: true,
        connectedSuspect: 'Diana Chen'
      },
      {
        type: 'Fingerprints',
        description: 'Right-handed fingerprints found on the painting frame and inside the security panel. Matches someone with slim build who wears glasses.',
        location: 'Crime Scene',
        critical: false,
        connectedSuspect: 'Diana Chen'
      },
      {
        type: 'Witness Testimony',
        description: 'Wine tasting event staff confirms Diana Chen left early, around 9:45 PM, not 11 PM as she claimed.',
        location: 'Event Venue',
        critical: true,
        connectedSuspect: 'Diana Chen'
      },
      {
        type: 'Financial Documents',
        description: 'Large cash deposits into Diana Chen\'s account over the past 6 months totaling $240,000.',
        location: 'Financial Records',
        critical: true,
        connectedSuspect: 'Diana Chen'
      },
      {
        type: 'Phone Records',
        description: 'Multiple calls from 617 area code to international numbers in countries known for black market art trade.',
        location: 'Phone Company',
        critical: false,
        connectedSuspect: 'Diana Chen'
      },
      {
        type: 'Threatening Letter',
        description: 'Anonymous note to gallery owner about "authentication failures" - handwriting matches Diana\'s signature.',
        location: 'Owner\'s Office',
        critical: false,
        connectedSuspect: 'Diana Chen'
      },
      {
        type: 'Receipts',
        description: 'Roberto Vasquez purchased sleeping pills three days before the theft. Receipt timestamped 2:35 PM.',
        location: 'Pharmacy',
        critical: false,
        connectedSuspect: 'Roberto Vasquez'
      },
      {
        type: 'Witness Testimony',
        description: 'Evelyn Harper was seen in the conservation lab at 10 PM by cleaning staff, supporting her alibi.',
        location: 'Gallery',
        critical: false,
        connectedSuspect: 'Evelyn Harper'
      },
      {
        type: 'DNA Sample',
        description: 'A+ blood type hair found near the frame. Black hair with glasses residue nearby.',
        location: 'Crime Scene',
        critical: false,
        connectedSuspect: 'Diana Chen'
      }
    ],
    hints: {
      subtle: 'Focus on alibis that can be verified. Who was where they said they were?',
      moderate: 'The security footage timeline doesn\'t match someone\'s story. Check departure times.',
      major: 'Diana Chen left the wine tasting early and was seen entering the gallery at 10:30 PM. Her financial records show suspicious deposits.'
    }
  },

  {
    id: 'restaurant_murder',
    title: 'Death at Le Bernardin',
    difficulty: 5,
    crimeType: 'Murder',
    priority: 'URGENT',
    location: 'Le Bernardin Restaurant',
    narrative: {
      opening: `Celebrity chef Thomas Beaumont collapsed during dinner service at his flagship restaurant. Initial reports suggested a heart attack, but the autopsy revealed poison. Someone wanted him dead, and they struck during the busiest night of the year.`,
      twist: 'The poison was administered through a specific dish that only the victim ordered - a dish not on the menu. The killer had inside knowledge of his food allergies and used them as a weapon.',
      conclusion: `The sous chef, passed over for head chef position twice, used their knowledge of Beaumont's severe shellfish allergy to create a deadly dish. They hid shellfish extract in a "special preparation" that Beaumont requested.`
    },
    victim: {
      name: 'Thomas Beaumont',
      age: 47,
      occupation: 'Celebrity Chef',
      background: 'Michelin 3-star chef. Known for perfectionism and harsh criticism. Was planning to sell the restaurant.',
      personality: 'Arrogant and demanding'
    },
    suspects: [
      {
        name: 'Marie Dubois',
        age: 38,
        occupation: 'Sous Chef',
        personality: 'Calm',
        motive: 'Revenge',
        alibi: 'Claims she was in the kitchen preparing desserts all evening',
        isGuilty: true,
        backstory: 'Passed over for head chef twice despite being more qualified. Beaumont publicly humiliated her on a cooking show.',
        secret: 'Knew about Beaumont\'s deadly shellfish allergy and had been planning revenge for months',
        attributes: {
          physical: { height: '5\'5"-5\'8"', build: 'Medium build', hairColor: 'Light brown', eyeColor: 'Hazel', bloodType: 'O-', handedness: 'Right', shoeSize: 8, hasGlasses: false },
          behavioral: { phoneArea: '212', voiceQuality: 'Smooth and calm', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'Antonio Garcia',
        age: 44,
        occupation: 'Restaurant Manager',
        personality: 'Charming',
        motive: 'Financial Gain',
        alibi: 'Says he was greeting guests in the dining room',
        isGuilty: false,
        backstory: 'Has been embezzling from the restaurant for years. Worried Beaumont was getting suspicious.',
        secret: 'Stole $150,000 but had nothing to do with the murder',
        attributes: {
          physical: { height: '5\'8"-6\'0"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'A+', handedness: 'Right', shoeSize: 10, hasGlasses: false },
          behavioral: { phoneArea: '415', voiceQuality: 'Smooth and calm', shoeType: 'Loafers', smokingHabit: false }
        }
      },
      {
        name: 'Rachel Sterling',
        age: 31,
        occupation: 'Food Critic',
        personality: 'Aggressive',
        motive: 'Professional Conflict',
        alibi: 'Dining at the restaurant, many witnesses',
        isGuilty: false,
        backstory: 'Gave the restaurant a scathing review last month. Beaumont threatened to sue her for defamation.',
        secret: 'Was planning to publish an exposé about Beaumont\'s abusive behavior toward staff',
        attributes: {
          physical: { height: '5\'2"-5\'5"', build: 'Slim build', hairColor: 'Red', eyeColor: 'Green', bloodType: 'B+', handedness: 'Left', shoeSize: 7, hasGlasses: true },
          behavioral: { phoneArea: '617', voiceQuality: 'High-pitched', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'David Beaumont',
        age: 25,
        occupation: 'Sommelier',
        personality: 'Evasive',
        motive: 'Inheritance',
        alibi: 'Working in the wine cellar during dinner service',
        isGuilty: false,
        backstory: 'The victim\'s estranged son. Cut off from the family fortune. Stood to inherit millions.',
        secret: 'Was in massive debt and being threatened by loan sharks',
        attributes: {
          physical: { height: '6\'0"-6\'3"', build: 'Athletic build', hairColor: 'Blonde', eyeColor: 'Blue', bloodType: 'O+', handedness: 'Right', shoeSize: 11, hasGlasses: false },
          behavioral: { phoneArea: '310', voiceQuality: 'Deep and gravelly', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Isabelle Laurent',
        age: 29,
        occupation: 'Pastry Chef',
        personality: 'Nervous',
        motive: 'False Lead',
        alibi: 'In the pastry kitchen, witnessed by multiple staff',
        isGuilty: false,
        backstory: 'Beaumont\'s ex-girlfriend. Their breakup was messy and public. Recently started dating Marie Dubois.',
        secret: 'Knew about Marie\'s plan but didn\'t report it out of love',
        attributes: {
          physical: { height: '5\'5"-5\'8"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'AB+', handedness: 'Right', shoeSize: 8, hasGlasses: false },
          behavioral: { phoneArea: '212', voiceQuality: 'Soft-spoken', shoeType: 'Sneakers', smokingHabit: false }
        }
      }
    ],
    evidence: [
      {
        type: 'Toxicology Report',
        description: 'Victim died from anaphylactic shock due to shellfish protein. Traces of concentrated shellfish extract found in stomach.',
        location: 'Medical Examiner',
        critical: true,
        connectedSuspect: 'Marie Dubois'
      },
      {
        type: 'Email Records',
        description: 'Email from Marie Dubois to a supplier ordering "experimental shellfish extract" for "menu testing" two weeks ago.',
        location: 'Supplier Records',
        critical: true,
        connectedSuspect: 'Marie Dubois'
      },
      {
        type: 'Witness Testimony',
        description: 'Kitchen staff confirms Marie personally prepared Beaumont\'s special order dish and insisted on delivering it herself.',
        location: 'Kitchen',
        critical: true,
        connectedSuspect: 'Marie Dubois'
      },
      {
        type: 'Security Footage',
        description: 'Shows Marie Dubois adding something to a dish from a small vial she kept in her pocket.',
        location: 'Kitchen Camera',
        critical: true,
        connectedSuspect: 'Marie Dubois'
      },
      {
        type: 'Phone Records',
        description: 'Marie made multiple searches on her phone about "untraceable shellfish poison" and "allergy-induced death" in the past month.',
        location: 'Phone Analysis',
        critical: true,
        connectedSuspect: 'Marie Dubois'
      },
      {
        type: 'Fingerprints',
        description: 'Right-handed fingerprints on the vial found in kitchen trash. Matches medium build individual with hazel eyes.',
        location: 'Kitchen',
        critical: false,
        connectedSuspect: 'Marie Dubois'
      },
      {
        type: 'Witness Testimony',
        description: 'Isabelle Laurent seemed distressed all evening and was seen crying in the bathroom before the incident.',
        location: 'Restaurant',
        critical: false,
        connectedSuspect: 'Isabelle Laurent'
      },
      {
        type: 'Financial Documents',
        description: 'Antonio Garcia has been embezzling funds, but financial activity shows no connection to the murder.',
        location: 'Accounting Office',
        critical: false,
        connectedSuspect: 'Antonio Garcia'
      },
      {
        type: 'Threatening Letter',
        description: 'Rachel Sterling\'s draft article exposing Beaumont\'s toxic workplace behavior found on her laptop.',
        location: 'Rachel\'s Belongings',
        critical: false,
        connectedSuspect: 'Rachel Sterling'
      },
      {
        type: 'DNA Sample',
        description: 'O- blood type hair found near the prep station where the fatal dish was prepared. Light brown hair.',
        location: 'Kitchen',
        critical: false,
        connectedSuspect: 'Marie Dubois'
      },
      {
        type: 'Financial Documents',
        description: 'David Beaumont owes $300,000 to various creditors and loan sharks. Stood to inherit $5 million.',
        location: 'Bank Records',
        critical: false,
        connectedSuspect: 'David Beaumont'
      }
    ],
    hints: {
      subtle: 'The victim had a severe food allergy. Who in the kitchen would know about it and have access to allergens?',
      moderate: 'Security footage shows someone tampering with a dish. Check who prepared the victim\'s final meal.',
      major: 'Marie Dubois ordered shellfish extract weeks ago and was seen adding something to Beaumont\'s special dish. Her phone searches about untraceable poison are damning.'
    }
  },

  {
    id: 'tech_fraud',
    title: 'The Silicon Valley Sabotage',
    difficulty: 6,
    crimeType: 'Fraud',
    priority: 'HIGH',
    location: 'TechNova Headquarters',
    narrative: {
      opening: `TechNova's revolutionary AI chip design was leaked to a Chinese competitor three days before the patent filing. The leak cost the company $2 billion in market value and ended their competitive advantage. This wasn't a hack - it was an inside job by someone with the highest security clearance.`,
      twist: 'The leak wasn\'t about money or ideology - it was revenge. The CFO discovered the CEO was having an affair with their spouse and destroyed the company out of spite, framing the Lead Engineer to cover their tracks.',
      conclusion: `The CFO used their access to frame the Lead Engineer while selling the designs themselves. They planted evidence on the engineer\'s computer and orchestrated elaborate false trails to hide their involvement.`
    },
    victim: {
      name: 'Jennifer Park',
      age: 39,
      occupation: 'CEO of TechNova',
      background: 'Stanford dropout turned tech billionaire. Drove the company through aggressive expansion. Recent affair became public scandal.',
      personality: 'Driven and ruthless'
    },
    suspects: [
      {
        name: 'Michael Chen',
        age: 41,
        occupation: 'Chief Financial Officer',
        personality: 'Calculating',
        motive: 'Revenge',
        alibi: 'Claims he was at a board meeting during the data transfer',
        isGuilty: true,
        backstory: 'Discovered CEO was having an affair with his wife. Decided to destroy the company as revenge while making millions from the sale.',
        secret: 'Has been planning this for 3 months, creating elaborate false trails pointing to the Lead Engineer',
        attributes: {
          physical: { height: '5\'8"-6\'0"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'A-', handedness: 'Right', shoeSize: 10, hasGlasses: true },
          behavioral: { phoneArea: '415', voiceQuality: 'Smooth and calm', shoeType: 'Loafers', smokingHabit: false }
        }
      },
      {
        name: 'Dr. Sarah Mitchell',
        age: 35,
        occupation: 'Lead AI Engineer',
        personality: 'Nervous',
        motive: 'False Lead - Framed',
        alibi: 'Was working late in the lab, badge logs confirm presence',
        isGuilty: false,
        backstory: 'Brilliant engineer who designed the core technology. Being framed by the real culprit through planted evidence.',
        secret: 'Has mounting student loan debt and was approached by competitors, but refused all offers',
        attributes: {
          physical: { height: '5\'5"-5\'8"', build: 'Slim build', hairColor: 'Light brown', eyeColor: 'Blue', bloodType: 'O+', handedness: 'Left', shoeSize: 8, hasGlasses: true },
          behavioral: { phoneArea: '650', voiceQuality: 'Soft-spoken', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Robert Nakamura',
        age: 52,
        occupation: 'Head of Security',
        personality: 'Defensive',
        motive: 'Cover-up Incompetence',
        alibi: 'Monitoring security systems from control room',
        isGuilty: false,
        backstory: 'Former FBI cybersecurity expert. The breach happened on his watch, making him look incompetent.',
        secret: 'Disabled some security protocols to allow a friend to enter the building, unknowingly creating the vulnerability',
        attributes: {
          physical: { height: '5\'8"-6\'0"', build: 'Athletic build', hairColor: 'Gray', eyeColor: 'Brown', bloodType: 'B+', handedness: 'Right', shoeSize: 11, hasGlasses: false },
          behavioral: { phoneArea: '408', voiceQuality: 'Deep and gravelly', shoeType: 'Boots', smokingHabit: false }
        }
      },
      {
        name: 'Elena Rodriguez',
        age: 28,
        occupation: 'Junior Developer',
        personality: 'Evasive',
        motive: 'Ideological - False Lead',
        alibi: 'Left work at 5 PM, security footage confirms',
        isGuilty: false,
        backstory: 'Open source advocate who believes AI technology should be free. Vocal about company\'s patent strategy.',
        secret: 'Was planning to quit and start a competing open-source project',
        attributes: {
          physical: { height: '5\'2"-5\'5"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'O-', handedness: 'Right', shoeSize: 7, hasGlasses: false },
          behavioral: { phoneArea: '510', voiceQuality: 'High-pitched', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'David Walsh',
        age: 48,
        occupation: 'Venture Capitalist / Board Member',
        personality: 'Arrogant',
        motive: 'Financial Gain',
        alibi: 'Was in New York for investor meetings',
        isGuilty: false,
        backstory: 'Major investor who would lose millions from the leak. Has connections to the competing Chinese firm.',
        secret: 'Was shorting TechNova stock based on inside information, but not involved in the leak',
        attributes: {
          physical: { height: '6\'0"-6\'3"', build: 'Heavy build', hairColor: 'Blonde', eyeColor: 'Blue', bloodType: 'AB+', handedness: 'Right', shoeSize: 12, hasGlasses: false },
          behavioral: { phoneArea: '212', voiceQuality: 'Booming', shoeType: 'Dress shoes', smokingHabit: true }
        }
      },
      {
        name: 'Lisa Tanaka',
        age: 33,
        occupation: 'Marketing Director',
        personality: 'Charming',
        motive: 'False Lead',
        alibi: 'Working late preparing investor presentation',
        isGuilty: false,
        backstory: 'Michael Chen\'s wife. Having an affair with the CEO. Unaware of her husband\'s revenge plot.',
        secret: 'The affair with Jennifer Park that triggered everything',
        attributes: {
          physical: { height: '5\'5"-5\'8"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'A+', handedness: 'Right', shoeSize: 8, hasGlasses: false },
          behavioral: { phoneArea: '650', voiceQuality: 'Smooth and calm', shoeType: 'Dress shoes', smokingHabit: false }
        }
      }
    ],
    evidence: [
      {
        type: 'Digital Forensics',
        description: 'Data transfer originated from CFO\'s computer terminal at 11:47 PM, using admin privileges to mask the IP address.',
        location: 'IT Forensics Lab',
        critical: true,
        connectedSuspect: 'Michael Chen'
      },
      {
        type: 'Email Records',
        description: 'Encrypted emails from Michael Chen to foreign broker discussing "merchandise" and "payment terms" for "sensitive materials".',
        location: 'Email Server',
        critical: true,
        connectedSuspect: 'Michael Chen'
      },
      {
        type: 'Financial Documents',
        description: '$1.5 million transferred to offshore account in Chen\'s name through layered shell companies.',
        location: 'Bank Records',
        critical: true,
        connectedSuspect: 'Michael Chen'
      },
      {
        type: 'Security Footage',
        description: 'Shows Michael Chen entering the secure lab at 11:30 PM, despite claiming he left at 9 PM after the board meeting.',
        location: 'Security System',
        critical: true,
        connectedSuspect: 'Michael Chen'
      },
      {
        type: 'Phone Records',
        description: 'Michael Chen made multiple calls to Chinese phone numbers in the days leading up to the leak. Used burner phone.',
        location: 'NSA Intercepts',
        critical: true,
        connectedSuspect: 'Michael Chen'
      },
      {
        type: 'Witness Testimony',
        description: 'Janitor saw Michael Chen carrying a USB drive late at night, which contradicts company policy.',
        location: 'Janitorial Staff',
        critical: false,
        connectedSuspect: 'Michael Chen'
      },
      {
        type: 'Digital Forensics',
        description: 'Planted evidence on Sarah Mitchell\'s laptop, but forensic analysis shows files were added remotely by admin user.',
        location: 'Mitchell\'s Computer',
        critical: false,
        connectedSuspect: 'Sarah Mitchell'
      },
      {
        type: 'Email Records',
        description: 'Sarah Mitchell received recruitment emails from competitors, but never responded to any of them.',
        location: 'Email Server',
        critical: false,
        connectedSuspect: 'Sarah Mitchell'
      },
      {
        type: 'Security Footage',
        description: 'Robert Nakamura disabled cameras in one hallway the night of the leak, but claims it was routine maintenance.',
        location: 'Security System',
        critical: false,
        connectedSuspect: 'Robert Nakamura'
      },
      {
        type: 'Social Media',
        description: 'Elena Rodriguez posted about "liberating tech from corporate greed" days before the leak.',
        location: 'Online Posts',
        critical: false,
        connectedSuspect: 'Elena Rodriguez'
      },
      {
        type: 'Financial Documents',
        description: 'David Walsh shorted TechNova stock days before the announcement, making $4 million on insider trading.',
        location: 'Trading Records',
        critical: false,
        connectedSuspect: 'David Walsh'
      },
      {
        type: 'Phone Records',
        description: 'Lisa Tanaka\'s phone shows frequent calls to Jennifer Park at late hours, indicating the affair.',
        location: 'Phone Records',
        critical: false,
        connectedSuspect: 'Lisa Tanaka'
      },
      {
        type: 'Fingerprints',
        description: 'Right-handed fingerprints on the secure terminal during time of transfer. Individual wears glasses, slim build.',
        location: 'Secure Lab',
        critical: false,
        connectedSuspect: 'Michael Chen'
      }
    ],
    hints: {
      subtle: 'The leak required admin privileges. Who has both motive and technical access to cover their tracks?',
      moderate: 'Check alibis against security badge logs. Someone\'s story doesn\'t match the security footage timestamps.',
      major: 'Michael Chen was in the secure lab at 11:47 PM despite claiming he left hours earlier. Financial records show $1.5M in offshore accounts, and encrypted emails discuss "merchandise sales".'
    }
  }
];

// Function to get a hand-crafted case by ID
export function getHandCraftedCase(caseId) {
  return HAND_CRAFTED_CASES.find(c => c.id === caseId);
}

// Function to get random hand-crafted case
export function getRandomHandCraftedCase() {
  return HAND_CRAFTED_CASES[Math.floor(Math.random() * HAND_CRAFTED_CASES.length)];
}

// Function to convert hand-crafted case to game format
export function convertHandCraftedToGameFormat(handCraftedCase, caseNumber) {
  // Find guilty suspect
  const guiltyIndex = handCraftedCase.suspects.findIndex(s => s.isGuilty);

  // Convert suspects to game format
  const suspects = handCraftedCase.suspects.map((suspect, index) => ({
    id: index,
    name: suspect.name,
    age: suspect.age,
    occupation: suspect.occupation,
    personality: suspect.personality,
    alibi: suspect.alibi,
    isGuilty: suspect.isGuilty,
    suspicionLevel: suspect.isGuilty ? 3 : Math.floor(Math.random() * 3) + 1,
    nervousness: suspect.isGuilty ? 60 : 40,
    questioned: false,
    interrogationHistory: [],
    attributes: suspect.attributes,
    backstory: suspect.backstory,
    secret: suspect.secret,
    motive: suspect.motive
  }));

  // Convert evidence to game format
  const evidence = handCraftedCase.evidence.map((e, index) => {
    // Find suspect by name
    const connectedSuspectName = e.connectedSuspect;
    const connectedIndex = handCraftedCase.suspects.findIndex(s => s.name === connectedSuspectName);

    return {
      id: index,
      type: e.type,
      description: e.description,
      location: e.location,
      connectedTo: connectedIndex !== -1 ? connectedIndex : null,
      discovered: false,
      critical: e.critical
    };
  });

  return {
    caseNumber,
    difficulty: handCraftedCase.difficulty,
    isLegendary: false,
    isHandCrafted: true,
    handCraftedId: handCraftedCase.id,
    title: handCraftedCase.title,
    crimeType: handCraftedCase.crimeType,
    location: handCraftedCase.location,
    narrative: handCraftedCase.narrative,
    victim: handCraftedCase.victim,
    suspects,
    evidence,
    guiltyIndex,
    startTime: new Date().toLocaleString(),
    cluesFound: 0,
    interrogationCount: 0,
    hints: handCraftedCase.hints
  };
}
