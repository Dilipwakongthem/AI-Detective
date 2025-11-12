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

export function generateCase(caseNumber, difficulty = 1, isLegendary = false) {
  const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];

  // Scale complexity based on difficulty (1-10)
  const minSuspects = Math.min(3 + Math.floor(difficulty / 3), 8);
  const maxSuspects = Math.min(minSuspects + 2, 10);
  const numSuspects = minSuspects + Math.floor(Math.random() * (maxSuspects - minSuspects + 1));

  const shuffledNames = [...names].sort(() => Math.random() - 0.5);
  const guiltyIndex = Math.floor(Math.random() * numSuspects);

  // Higher difficulty = harder to identify guilty party
  const baseSuspicion = Math.max(1, 5 - Math.floor(difficulty / 2));
  const suspects = Array.from({ length: numSuspects }, (_, i) => ({
    id: i,
    name: shuffledNames[i % shuffledNames.length] + (i >= shuffledNames.length ? ` ${String.fromCharCode(65 + Math.floor(i / shuffledNames.length))}` : ''),
    age: 25 + Math.floor(Math.random() * 40),
    occupation: occupations[Math.floor(Math.random() * occupations.length)],
    personality: personalities[Math.floor(Math.random() * personalities.length)],
    alibi: generateAlibi(location, difficulty),
    isGuilty: i === guiltyIndex,
    suspicionLevel: i === guiltyIndex ? baseSuspicion : Math.floor(Math.random() * baseSuspicion) + 1,
    nervousness: i === guiltyIndex ?
      (70 - difficulty * 3) : // Guilty party calmer at higher difficulties
      Math.floor(Math.random() * 40) + 10,
    questioned: false
  }));

  // More evidence at higher difficulty
  const numEvidence = 8 + Math.floor(difficulty * 1.5) + Math.floor(Math.random() * 5);
  const evidence = Array.from({ length: numEvidence }, (_, i) => ({
    id: i,
    type: evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)],
    description: generateEvidenceDescription(i, suspects[guiltyIndex], difficulty),
    location: i < 3 ? 'Crime Scene' : ['Office', 'Storage Room', 'Parking Lot', 'Nearby Street'][Math.floor(Math.random() * 4)],
    connectedTo: i % 3 === 0 ? guiltyIndex : null,
    discovered: false,
    critical: i < Math.max(2, Math.floor(difficulty / 3))
  }));

  // Available hints based on difficulty
  const hintsAvailable = Math.max(0, 6 - Math.ceil(difficulty / 2));

  return {
    caseNumber,
    difficulty,
    isLegendary,
    crimeType: isLegendary ? `⭐ LEGENDARY: ${crimeType}` : crimeType,
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

export function evaluateAccusation(accusedId, caseData, hintsUsed = 0) {
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
    if (criticalEvidence === 2) stars++;

    // Reduce stars for using hints (max reduction of 2 stars)
    const hintPenalty = Math.min(Math.floor(hintsUsed / 2), 2);
    stars = Math.max(1, stars - hintPenalty);
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
      `You successfully identified the perpetrator using ${evidenceFound} pieces of evidence.${hintsUsed > 0 ? ` (${hintsUsed} hint${hintsUsed > 1 ? 's' : ''} used)` : ''}` :
      `You missed key evidence. ${guiltyName} had the motive and opportunity.`,
    reputation: correct ? stars * 200 : 50
  };
  return messages[rank.name] || '"Keep up the good work, Detective."';
}
