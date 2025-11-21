// Game Logic Engine for Detective Game

const crimeTypes = ['Murder', 'Theft', 'Fraud', 'Kidnapping', 'Arson'];
const locations = [
  'Mansion', 'Gallery', 'Office Building', 'Restaurant', 'Hotel',
  'Warehouse', 'Park', 'Theater', 'Museum', 'Casino'
];
const personalities = [
  'Nervous', 'Calculating', 'Defensive', 'Charming', 'Evasive',
  'Aggressive', 'Cooperative', 'Suspicious', 'Calm', 'Arrogant'
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
  'Business Partner', 'Art Collector', 'Former Partner', 'Assistant',
  'Investor', 'Curator', 'Manager', 'Accountant', 'Consultant', 'Attorney'
];

const evidenceTypes = [
  'Fingerprints', 'DNA Sample', 'Weapon', 'Blood Stains', 'Footprints',
  'Security Footage', 'Email Records', 'Financial Documents', 'Witness Testimony',
  'Phone Records', 'Threatening Letter', 'Receipts', 'Toxicology Report'
];

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

// Helper: Calculate nervousness based on personality and other factors
function calculateNervousness(personality, isGuilty, isRedHerring, difficulty) {
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

  return Math.max(10, Math.min(100, baseNervousness));
}

export function generateCase(caseNumber, difficulty = 1, isLegendary = false) {
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

    return {
      id: i,
      name: generateUniqueName(),
      age: 25 + Math.floor(Math.random() * 40),
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      personality: finalPersonality,
      alibi: generateAlibi(location),
      isGuilty,
      isRedHerring,
      suspicionLevel: isGuilty ? baseSuspicion :
                      isRedHerring ? Math.max(baseSuspicion - 1, 2) :
                      Math.floor(Math.random() * baseSuspicion) + 1,
      nervousness: calculateNervousness(finalPersonality, isGuilty, isRedHerring, difficulty),
      questioned: false
    };
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

    return {
      id: i,
      type: evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)],
      description: generateEvidenceDescription(i, targetSuspect, connectedTo === redHerringIndex),
      location: i < 3 ? 'Crime Scene' : ['Office', 'Storage Room', 'Parking Lot', 'Nearby Street'][Math.floor(Math.random() * 4)],
      connectedTo,
      discovered: false,
      critical: connectedTo === guiltyIndex && i < Math.max(2, Math.floor(difficulty / 3))
    };
  });

  return {
    caseNumber,
    difficulty,
    isLegendary,
    crimeType: isLegendary ? `⭐ LEGENDARY: ${crimeType}` : crimeType,
    location,
    victim: {
      name: generateUniqueName(),
      occupation: occupations[Math.floor(Math.random() * occupations.length)]
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
  const alibis = [
    `Claims to have been in the ${location} office at the time`,
    `Says they were outside making phone calls`,
    `States they arrived late and found the victim`,
    `Claims they were with another person`,
    `Says they left early before the incident`,
    `States they were in a different room entirely`
  ];
  return alibis[Math.floor(Math.random() * alibis.length)];
}

function generateEvidenceDescription(index, targetSuspect, isRedHerringEvidence = false) {
  if (isRedHerringEvidence) {
    // Circumstantial evidence for red herrings (sounds suspicious but not definitive)
    const redHerringDescriptions = [
      `${targetSuspect.name} was seen near the location around the time`,
      `${targetSuspect.name} had access to the area but alibi is unverified`,
      `Financial records show ${targetSuspect.name} had financial stress`,
      `${targetSuspect.name} was overheard arguing with victim weeks ago`,
      `Security footage shows ${targetSuspect.name} in the building that day`,
      `${targetSuspect.name}'s phone pinged near the location`,
      `Coworkers mention ${targetSuspect.name} seemed agitated recently`,
      `${targetSuspect.name} has inconsistencies in their timeline`
    ];
    return redHerringDescriptions[index % redHerringDescriptions.length];
  }

  // Strong evidence descriptions (more definitive)
  const strongDescriptions = [
    `Fingerprints on weapon match ${targetSuspect.name} exactly`,
    `DNA evidence definitively links ${targetSuspect.name} to the scene`,
    `Security footage clearly shows ${targetSuspect.name} at critical moment`,
    `Phone records prove ${targetSuspect.name} made threatening calls`,
    `Financial documents reveal ${targetSuspect.name} had strong monetary motive`,
    `Blood spatter pattern places ${targetSuspect.name} at the scene`,
    `Threatening letter written in ${targetSuspect.name}'s handwriting`,
    `Multiple witnesses identify ${targetSuspect.name} conclusively`,
    `Digital forensics trace activity directly to ${targetSuspect.name}`,
    `Toxicology report matches substance found in ${targetSuspect.name}'s possession`
  ];
  return strongDescriptions[index % strongDescriptions.length];
}

export function interrogateSuspect(suspect, caseData) {
  const responses = suspect.isGuilty ? [
    `I... I was just doing what I had to do. ${suspect.name} looks away nervously.`,
    `Why are you asking me this? I already told you! ${suspect.name} becomes defensive.`,
    `Look, I don't know anything about this. ${suspect.name} crosses arms.`,
    `You have no proof! ${suspect.name} voice raises.`,
    `I wasn't even there... well, not at that exact time. ${suspect.name} hesitates.`
  ] : [
    `I've told you everything I know. ${suspect.name} maintains eye contact.`,
    `I have nothing to hide, detective. ${suspect.name} speaks calmly.`,
    `I was nowhere near when it happened. ${suspect.name} provides details.`,
    `Check my alibi, it's solid. ${suspect.name} seems confident.`,
    `I want to help catch whoever did this. ${suspect.name} appears cooperative.`
  ];

  const response = responses[Math.floor(Math.random() * responses.length)];
  const nervousness = suspect.isGuilty ?
    Math.min(suspect.nervousness + 10, 100) :
    suspect.nervousness;

  return {
    response,
    nervousness,
    bodyLanguage: suspect.isGuilty ?
      ['Avoiding eye contact', 'Fidgeting', 'Sweating', 'Defensive posture'][Math.floor(Math.random() * 4)] :
      ['Calm', 'Open posture', 'Steady gaze', 'Relaxed'][Math.floor(Math.random() * 4)]
  };
}

// Helper: Check if player has sufficient evidence for accusation
export function checkEvidenceStrength(suspectId, caseData) {
  const evidenceAgainstSuspect = caseData.evidence.filter(
    e => e.discovered && e.connectedTo === suspectId
  ).length;

  const totalEvidence = caseData.evidence.filter(e => e.discovered).length;
  const suspect = caseData.suspects[suspectId];

  // Determine evidence strength
  let strength = 'none';
  let warning = '';

  if (evidenceAgainstSuspect === 0) {
    strength = 'none';
    warning = `⚠️ You have NO evidence connecting ${suspect.name} to the crime. Accusation would be purely based on suspicion.`;
  } else if (evidenceAgainstSuspect === 1) {
    strength = 'weak';
    warning = `⚠️ You only have 1 piece of evidence against ${suspect.name}. Consider gathering more evidence for a stronger case.`;
  } else if (evidenceAgainstSuspect === 2) {
    strength = 'moderate';
    warning = `You have 2 pieces of evidence against ${suspect.name}. This may be sufficient, but more evidence would strengthen your case.`;
  } else {
    strength = 'strong';
    warning = `✓ You have ${evidenceAgainstSuspect} pieces of evidence against ${suspect.name}. Strong case!`;
  }

  return {
    strength,
    evidenceCount: evidenceAgainstSuspect,
    totalEvidence,
    warning,
    shouldWarn: evidenceAgainstSuspect < 2
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
