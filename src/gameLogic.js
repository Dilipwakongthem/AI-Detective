// Game Logic Engine for Detective Game

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

const crimeTypes = ['Murder', 'Theft', 'Fraud', 'Kidnapping', 'Arson'];
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

export function generateCase(caseNumber, difficultyConfig = null, isLegendary = false) {
  // If no difficulty config provided, use NORMAL as default
  const config = difficultyConfig || DIFFICULTY_LEVELS.NORMAL;

  const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];

  // Use configured difficulty parameters
  const numSuspects = config.suspects;
  const numEvidence = config.evidence;
  const numRedHerrings = config.redHerrings;

  const shuffledNames = [...names].sort(() => Math.random() - 0.5);
  const guiltyIndex = Math.floor(Math.random() * numSuspects);

  // Base suspicion level (harder difficulties = less obvious)
  const baseSuspicion = config === DIFFICULTY_LEVELS.EASY ? 5 :
                        config === DIFFICULTY_LEVELS.NORMAL ? 4 :
                        config === DIFFICULTY_LEVELS.HARD ? 3 : 2;
  const suspects = Array.from({ length: numSuspects }, (_, i) => ({
    id: i,
    name: shuffledNames[i % shuffledNames.length] + (i >= shuffledNames.length ? ` ${String.fromCharCode(65 + Math.floor(i / shuffledNames.length))}` : ''),
    age: 25 + Math.floor(Math.random() * 40),
    occupation: occupations[Math.floor(Math.random() * occupations.length)],
    personality: personalities[Math.floor(Math.random() * personalities.length)],
    alibi: generateAlibi(location),
    isGuilty: i === guiltyIndex,
    suspicionLevel: i === guiltyIndex ? baseSuspicion : Math.floor(Math.random() * baseSuspicion) + 1,
    nervousness: i === guiltyIndex ? 60 : Math.floor(Math.random() * 40) + 10,
    questioned: false,
    // Trust/Fear/Respect system
    trust: 0,      // -50 to +50
    fear: 0,       // 0 to 100
    respect: 0     // -25 to +25
  }));

  // Generate evidence based on configured amount
  const evidence = Array.from({ length: numEvidence }, (_, i) => {
    const isRedHerring = i >= (numEvidence - numRedHerrings);
    return {
      id: i,
      type: evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)],
      description: generateEvidenceDescription(i, suspects[guiltyIndex], isRedHerring),
      location: i < 3 ? 'Crime Scene' : ['Office', 'Storage Room', 'Parking Lot', 'Nearby Street'][Math.floor(Math.random() * 4)],
      connectedTo: isRedHerring ? null : (i % 3 === 0 ? guiltyIndex : null),
      discovered: false,
      critical: !isRedHerring && (i < 3), // First 3 non-red-herrings are critical
      isRedHerring: isRedHerring
    };
  });

  return {
    caseNumber,
    difficulty: config,
    difficultyName: config.name,
    isColdCase: config === DIFFICULTY_LEVELS.COLD_CASE,
    isLegendary,
    crimeType: isLegendary ? `⭐ LEGENDARY: ${crimeType}` : crimeType,
    location,
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
    freeHintsRemaining: config.freeHints === Infinity ? Infinity : config.freeHints
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

function generateEvidenceDescription(index, guiltySuspect, isRedHerring = false) {
  if (isRedHerring) {
    // Red herrings - misleading evidence
    const redHerringDescriptions = [
      `Unidentified fingerprints on unrelated object`,
      `Witness statement later proven unreliable`,
      `Security camera malfunction during key timeframe`,
      `Phone records from wrong date`,
      `Financial transaction unrelated to crime`,
      `DNA sample from contaminated scene`,
      `Old threatening message from years ago`,
      `Timeline discrepancy due to clock error`,
      `Physical evidence from previous incident`,
      `Inconclusive forensic analysis`
    ];
    return redHerringDescriptions[index % redHerringDescriptions.length];
  }

  // Real evidence
  const descriptions = [
    `Fingerprints found on key object - matches ${guiltySuspect.name}`,
    `Witness saw someone matching ${guiltySuspect.name}'s description`,
    `Security footage shows ${guiltySuspect.name} at the scene`,
    `Phone records place ${guiltySuspect.name} nearby during incident`,
    `Financial records show ${guiltySuspect.name} had clear motive`,
    `DNA evidence links ${guiltySuspect.name} to crime scene`,
    `Threatening message written by ${guiltySuspect.name} discovered`,
    `Timeline contradicts ${guiltySuspect.name}'s alibi`,
    `Physical evidence directly links to ${guiltySuspect.name}`,
    `Forensic analysis implicates ${guiltySuspect.name}`
  ];
  return descriptions[index % descriptions.length];
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
    message: correct ?
      `🎯 CORRECT! ${guiltyName} was indeed the culprit. Excellent work, Detective!` :
      `❌ WRONG! ${accusedName} was innocent. The real culprit was ${guiltyName}.`,
    feedback: correct ?
      `You successfully identified the perpetrator using ${evidenceFound} pieces of evidence.${hintsUsed > 0 ? ` (${hintsUsed} hint${hintsUsed > 1 ? 's' : ''} used)` : ''}` :
      `You missed key evidence. ${guiltyName} had the motive and opportunity.`,
    reputation: correct ? stars * 200 : 50
  };
}
