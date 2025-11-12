// Game Logic Engine for Detective Game

// RANK SYSTEM
export const RANKS = {
  ROOKIE: { name: 'Rookie Detective', minRep: 0, maxRep: 500, minDifficulty: 1, maxDifficulty: 2 },
  DETECTIVE: { name: 'Detective', minRep: 501, maxRep: 1500, minDifficulty: 1, maxDifficulty: 4 },
  SENIOR: { name: 'Senior Detective', minRep: 1501, maxRep: 3000, minDifficulty: 2, maxDifficulty: 6 },
  LEAD: { name: 'Lead Detective', minRep: 3001, maxRep: 5000, minDifficulty: 4, maxDifficulty: 8 },
  INSPECTOR: { name: 'Detective Inspector', minRep: 5001, maxRep: 8000, minDifficulty: 6, maxDifficulty: 9 },
  CHIEF: { name: 'Chief Detective', minRep: 8001, maxRep: Infinity, minDifficulty: 7, maxDifficulty: 10 }
};

// SPECIAL CASE TYPES
export const SPECIAL_CASE_TYPES = {
  COLD_CASE: { name: 'Cold Case', unlockRank: 'DETECTIVE', reputationMultiplier: 2 },
  TIME_SENSITIVE: { name: 'Time-Sensitive', unlockRank: 'SENIOR', reputationMultiplier: 3 },
  CONNECTED: { name: 'Connected Case', unlockRank: 'LEAD', reputationMultiplier: 2.5 },
  UNDERCOVER: { name: 'Undercover Operation', unlockRank: 'INSPECTOR', reputationMultiplier: 3.5 },
  IMPOSSIBLE: { name: 'Impossible Case', unlockRank: 'CHIEF', reputationMultiplier: 5 }
};

const crimeTypes = {
  1: ['Petty Theft', 'Vandalism', 'Simple Burglary'],
  2: ['Theft', 'Burglary'],
  3: ['Grand Theft', 'Assault', 'Blackmail'],
  4: ['Fraud', 'Assault'],
  5: ['Fraud', 'Kidnapping', 'Manslaughter'],
  6: ['Kidnapping', 'Arson'],
  7: ['Murder', 'Organized Crime', 'Corruption'],
  8: ['Murder', 'Organized Crime'],
  9: ['Serial Crime', 'Conspiracy', 'Cold Case'],
  10: ['High-Profile Murder', 'International Crime', 'Terrorism']
};

const locations = [
  'Mansion', 'Gallery', 'Office Building', 'Restaurant', 'Hotel',
  'Warehouse', 'Park', 'Theater', 'Museum', 'Casino'
];
const personalities = [
  'Nervous', 'Calculating', 'Defensive', 'Charming', 'Evasive',
  'Aggressive', 'Cooperative', 'Suspicious', 'Calm', 'Arrogant'
];
const names = [
  'Alexander Bennett', 'Charlotte Fisher', 'Daniel Morgan', 'Emma Richardson',
  'Frank Harrison', 'Grace Mitchell', 'Henry Thompson', 'Isabella Crawford',
  'James Peterson', 'Katherine Walsh', 'Marcus Thornwell', 'Natalie Brooks'
];
const occupations = [
  'Business Partner', 'Art Collector', 'Former Partner', 'Assistant',
  'Investor', 'Curator', 'Manager', 'Accountant', 'Consultant', 'Attorney'
];

const evidenceTypes = [
  'Fingerprints', 'DNA Sample', 'Weapon', 'Blood Stains', 'Footprints',
  'Security Footage', 'Email Records', 'Financial Documents', 'Witness Testimony',
  'Phone Records', 'Threatening Letter', 'Receipts', 'Toxicology Report'
];

// Get current rank based on reputation
export function getCurrentRank(reputation) {
  if (reputation <= 500) return RANKS.ROOKIE;
  if (reputation <= 1500) return RANKS.DETECTIVE;
  if (reputation <= 3000) return RANKS.SENIOR;
  if (reputation <= 5000) return RANKS.LEAD;
  if (reputation <= 8000) return RANKS.INSPECTOR;
  return RANKS.CHIEF;
}

// Calculate case difficulty based on player stats
export function calculateCaseDifficulty(playerStats) {
  const rank = getCurrentRank(playerStats.reputation);
  const { minDifficulty, maxDifficulty } = rank;

  // Calculate success rate
  const successRate = playerStats.casesSolved / Math.max(playerStats.casesAttempted || 1, 1);

  let difficulty;
  if (successRate >= 0.8) {
    // High success rate - assign harder cases
    difficulty = Math.floor(minDifficulty + (maxDifficulty - minDifficulty) * 0.7);
  } else if (successRate >= 0.5) {
    // Moderate success rate - assign middle range
    difficulty = Math.floor((minDifficulty + maxDifficulty) / 2);
  } else {
    // Low success rate - assign easier cases
    difficulty = Math.floor(minDifficulty + (maxDifficulty - minDifficulty) * 0.3);
  }

  // Streak bonus
  if (playerStats.currentStreak >= 5) {
    difficulty = Math.min(difficulty + 1, maxDifficulty);
  } else if (playerStats.currentStreak >= 3) {
    difficulty = Math.min(difficulty + 0.5, maxDifficulty);
  }

  return Math.max(minDifficulty, Math.min(Math.round(difficulty), maxDifficulty));
}

export function generateCase(caseNumber, difficulty = 1, specialType = null) {
  // Select crime type based on difficulty
  const crimeTypesList = crimeTypes[difficulty] || crimeTypes[1];
  const crimeType = crimeTypesList[Math.floor(Math.random() * crimeTypesList.length)];

  const location = locations[Math.floor(Math.random() * locations.length)];

  // Number of suspects based on difficulty
  let numSuspects;
  if (difficulty <= 2) numSuspects = 3;
  else if (difficulty <= 4) numSuspects = 3 + Math.floor(Math.random() * 2); // 3-4
  else if (difficulty <= 6) numSuspects = 4 + Math.floor(Math.random() * 2); // 4-5
  else if (difficulty <= 8) numSuspects = 4 + Math.floor(Math.random() * 3); // 4-6
  else numSuspects = 5 + Math.floor(Math.random() * 2); // 5-6

  // Evidence count based on difficulty
  const baseEvidence = 6 + (difficulty - 1) * 1.5;
  const evidenceCount = Math.floor(baseEvidence + Math.random() * 3);

  const shuffledNames = [...names].sort(() => Math.random() - 0.5);
  const guiltyIndex = Math.floor(Math.random() * numSuspects);

  // Guilty suspect nervousness decreases with difficulty (better at hiding)
  const guiltyNervousness = Math.max(40, 90 - difficulty * 5);

  const suspects = Array.from({ length: numSuspects }, (_, i) => ({
    id: i,
    name: shuffledNames[i],
    age: 25 + Math.floor(Math.random() * 40),
    occupation: occupations[Math.floor(Math.random() * occupations.length)],
    personality: personalities[Math.floor(Math.random() * personalities.length)],
    alibi: generateAlibi(location, difficulty),
    isGuilty: i === guiltyIndex,
    suspicionLevel: i === guiltyIndex
      ? Math.max(1, 4 - Math.floor(difficulty / 3)) // Harder to identify in difficult cases
      : Math.floor(Math.random() * 3) + 1,
    nervousness: i === guiltyIndex ? guiltyNervousness : Math.floor(Math.random() * 40) + 10,
    questioned: false
  }));

  const evidence = Array.from({ length: evidenceCount }, (_, i) => ({
    id: i,
    type: evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)],
    description: generateEvidenceDescription(i, suspects[guiltyIndex], difficulty),
    location: i < 3 ? 'Crime Scene' : ['Office', 'Storage Room', 'Parking Lot', 'Nearby Street'][Math.floor(Math.random() * 4)],
    connectedTo: i % 3 === 0 ? guiltyIndex : null,
    discovered: false,
    critical: i < Math.max(2, Math.floor(evidenceCount * 0.2))
  }));

  // Available hints based on difficulty
  const hintsAvailable = Math.max(0, 6 - Math.ceil(difficulty / 2));

  return {
    caseNumber,
    difficulty,
    crimeType,
    location,
    specialType,
    victim: {
      name: names[Math.floor(Math.random() * names.length)],
      occupation: occupations[Math.floor(Math.random() * occupations.length)]
    },
    suspects,
    evidence,
    guiltyIndex,
    startTime: new Date().toLocaleString(),
    cluesFound: 0,
    interrogationCount: 0,
    hintsAvailable,
    hintsUsed: 0
  };
}

function generateAlibi(location, difficulty) {
  const simpleAlibis = [
    `Claims to have been in the ${location} office at the time`,
    `Says they were outside making phone calls`,
    `States they arrived late and found the victim`
  ];

  const complexAlibis = [
    `Claims they were with another person who can verify their whereabouts`,
    `Says they left early before the incident and has receipt to prove it`,
    `States they were in a different room entirely with multiple witnesses`,
    `Claims they were on a phone call that was logged at that exact time`,
    `Says they have security footage showing them elsewhere`
  ];

  const alibis = difficulty <= 3 ? simpleAlibis : [...simpleAlibis, ...complexAlibis];
  return alibis[Math.floor(Math.random() * alibis.length)];
}

function generateEvidenceDescription(index, guiltySuspect, difficulty) {
  const obviousClues = [
    `Fingerprints found on key object - matches ${guiltySuspect.name}`,
    `Witness saw someone matching ${guiltySuspect.name}'s description`,
    `${guiltySuspect.name}'s personal item found at the scene`
  ];

  const subtleClues = [
    `Security footage shows suspicious activity around the time of the incident`,
    `Phone records indicate calls made around the time of incident`,
    `Financial records show potential motive`,
    `DNA evidence found at the scene (requires analysis)`,
    `Threatening message discovered (author unclear)`,
    `Timeline shows inconsistencies in statements`,
    `Physical evidence with partial identification`,
    `Forensic analysis reveals subtle detail`
  ];

  if (difficulty <= 3) {
    // Easier cases - more obvious clues
    return index < obviousClues.length
      ? obviousClues[index]
      : subtleClues[index % subtleClues.length];
  } else {
    // Harder cases - more subtle clues
    return index < 2 && Math.random() > 0.5
      ? obviousClues[index % obviousClues.length]
      : subtleClues[index % subtleClues.length];
  }
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

export function evaluateAccusation(accusedId, caseData) {
  const correct = accusedId === caseData.guiltyIndex;
  const guiltyName = caseData.suspects[caseData.guiltyIndex].name;
  const accusedName = caseData.suspects[accusedId].name;

  const evidenceFound = caseData.evidence.filter(e => e.discovered).length;
  const criticalEvidence = caseData.evidence.filter(e => e.critical && e.discovered).length;
  const difficulty = caseData.difficulty || 1;
  const hintsUsed = caseData.hintsUsed || 0;

  let stars = 0;
  if (correct) {
    stars = 1;
    if (criticalEvidence >= 1) stars++;
    if (evidenceFound >= caseData.evidence.length * 0.6) stars++;
    if (caseData.interrogationCount >= caseData.suspects.length) stars++;
    if (criticalEvidence >= Math.floor(caseData.evidence.length * 0.2)) stars++;
  }

  // Apply hint penalty to star rating
  let maxStars = 5;
  if (hintsUsed >= 3) {
    maxStars = 3;
  } else if (hintsUsed >= 1) {
    maxStars = 4;
  }
  stars = Math.min(stars, maxStars);

  // Base reputation adjusted by difficulty (hints don't reduce reputation)
  const baseReputation = 100 + (difficulty * 50);
  const reputationMultiplier = caseData.specialType
    ? SPECIAL_CASE_TYPES[caseData.specialType]?.reputationMultiplier || 1
    : 1;

  const reputation = correct
    ? Math.floor(stars * baseReputation * reputationMultiplier)
    : Math.floor(baseReputation * 0.2); // Small consolation for attempting

  let hintFeedback = '';
  if (hintsUsed > 0) {
    hintFeedback = `\nHints Used: ${hintsUsed} (Max rating: ${maxStars} stars)`;
  }

  return {
    correct,
    stars,
    maxStars,
    difficulty,
    hintsUsed,
    message: correct ?
      `🎯 CORRECT! ${guiltyName} was indeed the culprit. Excellent detective work!` :
      `❌ WRONG! ${accusedName} was innocent. The real culprit was ${guiltyName}.`,
    feedback: correct ?
      `You successfully identified the perpetrator using ${evidenceFound} pieces of evidence. Difficulty: Level ${difficulty}${hintFeedback}` :
      `You missed key evidence. ${guiltyName} had the motive and opportunity. Study the case to improve.${hintFeedback}`,
    reputation
  };
}

// Calculate hint cost based on how many paid hints already used
export function calculateHintCost(paidHintsUsed) {
  const costs = [25, 50, 100, 200];
  return paidHintsUsed < costs.length ? costs[paidHintsUsed] : 200;
}

// Generate contextual hint based on case progress
export function generateHint(caseData, hintNumber) {
  const guiltyIndex = caseData.guiltyIndex;
  const guiltySuspect = caseData.suspects[guiltyIndex];
  const discoveredEvidence = caseData.evidence.filter(e => e.discovered);
  const questionedSuspects = caseData.suspects.filter(s => s.questioned);
  const totalLocations = 3; // Crime Scene, Office, Storage

  // Hint level 1: General direction
  if (hintNumber === 1) {
    if (discoveredEvidence.length < caseData.evidence.length * 0.5) {
      return {
        title: "INVESTIGATIVE GUIDANCE - HINT 1",
        content: `💡 Consider the following:\n\nYou have ${discoveredEvidence.length} of ${caseData.evidence.length} pieces of evidence collected.\n\nGENERAL DIRECTION:\n• Have you thoroughly examined all locations?\n• Some evidence may be hidden in different areas\n• More evidence will help you build a stronger case`
      };
    } else if (questionedSuspects.length < caseData.suspects.length) {
      return {
        title: "INVESTIGATIVE GUIDANCE - HINT 1",
        content: `💡 Consider the following:\n\nYou haven't interrogated all suspects yet.\n\nGENERAL DIRECTION:\n• Each suspect may provide crucial information\n• Pay attention to inconsistencies in their stories\n• Body language can reveal deception, but isn't always reliable`
      };
    } else {
      return {
        title: "INVESTIGATIVE GUIDANCE - HINT 1",
        content: `💡 Consider the following:\n\nGENERAL DIRECTION:\n• Some suspects' alibis may conflict with the timeline\n• Physical evidence may contradict verbal statements\n• Review the evidence board for connections`
      };
    }
  }

  // Hint level 2: More specific
  if (hintNumber === 2) {
    const connectedEvidence = caseData.evidence.filter(e => e.connectedTo === guiltyIndex && e.discovered);
    if (connectedEvidence.length > 0) {
      return {
        title: "INVESTIGATIVE GUIDANCE - HINT 2",
        content: `💡 Focusing your investigation:\n\nEVIDENCE CONNECTION SUGGESTION:\n• Examine the evidence related to ${guiltySuspect.name} more carefully\n• Some evidence items seem to point in a specific direction\n• Cross-reference suspect statements with physical evidence`
      };
    } else {
      return {
        title: "INVESTIGATIVE GUIDANCE - HINT 2",
        content: `💡 Focusing your investigation:\n\nBEHAVIORAL OBSERVATION:\n• One suspect showed unusual reactions during questioning\n• Consider who had both motive and opportunity\n• The guilty party's alibi may have inconsistencies`
      };
    }
  }

  // Hint level 3: Very specific
  if (hintNumber === 3) {
    return {
      title: "INVESTIGATIVE GUIDANCE - HINT 3",
      content: `💡 Critical Lead:\n\nSTRONG EVIDENCE PATTERN:\n• ${guiltySuspect.name} has several concerning factors\n• Their alibi: "${guiltySuspect.alibi}"\n• Their behavior during questioning was notable\n• Review evidence items that might contradict their claims\n\nRECOMMENDED ACTION:\n• Re-examine evidence connected to this suspect\n• Consider their motive and opportunity`
    };
  }

  // Hint level 4+: Near-solution
  return {
    title: "INVESTIGATIVE GUIDANCE - HINT 4",
    content: `💡 Case Solution Direction:\n\nPRIMARY SUSPECT: ${guiltySuspect.name}\n\nKEY FACTORS:\n• Suspicion level indicates involvement\n• Multiple evidence pieces point in this direction\n• Behavioral indicators suggest deception\n\nYou have enough evidence to make an accusation.\n\nNote: At this difficulty level (${caseData.difficulty}), trust the evidence over behavioral cues alone.`
  };
}

// Get difficulty stars for display
export function getDifficultyStars(difficulty) {
  const filled = Math.min(difficulty, 10);
  const empty = Math.max(0, 10 - filled);
  return '⭐'.repeat(filled) + '⚪'.repeat(empty);
}

// Check if player should get promotion notification
export function checkPromotion(oldReputation, newReputation) {
  const oldRank = getCurrentRank(oldReputation);
  const newRank = getCurrentRank(newReputation);

  if (oldRank.name !== newRank.name) {
    return {
      promoted: true,
      oldRank: oldRank.name,
      newRank: newRank.name,
      newMinDifficulty: newRank.minDifficulty,
      newMaxDifficulty: newRank.maxDifficulty,
      message: getPromotionMessage(newRank)
    };
  }

  return { promoted: false };
}

function getPromotionMessage(rank) {
  const messages = {
    'Rookie Detective': '"Welcome to the force, Detective. Start with the basics."',
    'Detective': '"Good work so far. Now the real cases begin."',
    'Senior Detective': '"Your skills are impressive. We need you on complex cases."',
    'Lead Detective': '"You\'re one of our best. Time to tackle serious crimes."',
    'Detective Inspector': '"Outstanding work. You\'re handling our most difficult cases now."',
    'Chief Detective': '"You\'ve reached the top. Only the impossible cases for you now."'
  };
  return messages[rank.name] || '"Keep up the good work, Detective."';
}
