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

// Expanded crime types with more variety
const crimeTypes = [
  'Murder', 'Theft', 'Fraud', 'Kidnapping', 'Arson',
  'Blackmail', 'Embezzlement', 'Art Forgery', 'Corporate Espionage',
  'Identity Theft', 'Smuggling', 'Extortion', 'Sabotage', 'Conspiracy'
];

// Expanded locations with unique characteristics
const locations = [
  'Mansion', 'Art Gallery', 'Office Building', 'Restaurant', 'Hotel',
  'Warehouse', 'City Park', 'Theater', 'Museum', 'Casino',
  'Yacht Club', 'University', 'Hospital', 'Country Club', 'Tech Startup',
  'Law Firm', 'Investment Bank', 'Auction House', 'Private Estate', 'Penthouse',
  'Vineyard', 'Research Lab', 'Concert Hall', 'Shopping Mall', 'Airport Lounge'
];

// Expanded personalities for more diverse suspects
const personalities = [
  'Nervous', 'Calculating', 'Defensive', 'Charming', 'Evasive',
  'Aggressive', 'Cooperative', 'Suspicious', 'Calm', 'Arrogant',
  'Manipulative', 'Paranoid', 'Eccentric', 'Stoic', 'Volatile',
  'Methodical', 'Impulsive', 'Reserved', 'Flamboyant', 'Cunning'
];

// Significantly expanded name pool for more variety
const names = [
  'Alexander Bennett', 'Charlotte Fisher', 'Daniel Morgan', 'Emma Richardson',
  'Frank Harrison', 'Grace Mitchell', 'Henry Thompson', 'Isabella Crawford',
  'James Peterson', 'Katherine Walsh', 'Marcus Thornwell', 'Natalie Brooks',
  'Oliver Sterling', 'Sophia Blackwood', 'Lucas Kane', 'Amelia Cross',
  'Victor Hayes', 'Elena Rossi', 'Sebastian Drake', 'Maya Patel',
  'Theodore Winters', 'Olivia Sinclair', 'Ethan Frost', 'Clara Montague',
  'Julian Reed', 'Penelope Hart', 'Maxwell Stone', 'Vivian Lloyd',
  'Adrian Cole', 'Camilla Reeves', 'Nathaniel Fox', 'Delilah Grant',
  'Dominic Shaw', 'Scarlett Wolfe', 'Jasper Quinn', 'Genevieve Blair',
  'Tobias Hunt', 'Felicity Moore', 'Declan Pierce', 'Arabella Chase',
  'Griffin Montgomery', 'Seraphina Vale', 'Callum Wright', 'Evangeline North',
  'Magnus Ellis', 'Beatrice Howe', 'Tristan York', 'Cordelia Flynn'
];

// Expanded occupations with more diverse professions
const occupations = [
  'Business Partner', 'Art Collector', 'Former Partner', 'Assistant',
  'Investor', 'Curator', 'Manager', 'Accountant', 'Consultant', 'Attorney',
  'Tech Entrepreneur', 'Architect', 'Journalist', 'Surgeon', 'Philanthropist',
  'Interior Designer', 'Venture Capitalist', 'Fashion Designer', 'Chef',
  'Real Estate Developer', 'Playwright', 'Cryptocurrency Trader', 'Pilot',
  'Professor', 'Antique Dealer', 'Wine Merchant', 'Gallery Owner',
  'Music Producer', 'Software Engineer', 'Investment Banker', 'Private Detective',
  'Event Planner', 'Corporate Lawyer', 'Art Appraiser', 'Security Consultant'
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
    const yearsOld = config === DIFFICULTY_LEVELS.COLD_CASE ? Math.floor(Math.random() * 20) + 5 : 0; // 5-25 years old for cold cases
    const condition = config === DIFFICULTY_LEVELS.COLD_CASE
      ? ['Degraded', 'Faded', 'Partially Damaged', 'Weathered', 'Deteriorated'][Math.floor(Math.random() * 5)]
      : 'Good';

    return {
      id: i,
      type: evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)],
      description: generateEvidenceDescription(i, suspects[guiltyIndex], isRedHerring, yearsOld),
      location: i < 3 ? 'Crime Scene' : ['Office', 'Storage Room', 'Parking Lot', 'Nearby Street'][Math.floor(Math.random() * 4)],
      connectedTo: isRedHerring ? null : (i % 3 === 0 ? guiltyIndex : null),
      discovered: false,
      critical: !isRedHerring && (i < 3), // First 3 non-red-herrings are critical
      isRedHerring: isRedHerring,
      yearsOld: yearsOld,
      condition: condition
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

function generateEvidenceDescription(index, guiltySuspect, isRedHerring = false, yearsOld = 0) {
  const agePrefix = yearsOld > 0 ? `[${yearsOld} years old] ` : '';

  if (isRedHerring) {
    // Expanded red herrings - more misleading evidence variety
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
      `Inconclusive forensic analysis`,
      `Anonymous tip that led nowhere`,
      `Suspicious vehicle seen blocks away`,
      `Circumstantial connection to similar case`,
      `Partial alibi with missing hours`,
      `Deleted email later recovered as spam`,
      `Hair sample from unknown third party`,
      `Tool marks that don't match suspect's equipment`,
      `Background check reveals minor past offense`,
      `Unusual purchase made weeks before incident`,
      `Overheard conversation taken out of context`
    ];
    return agePrefix + redHerringDescriptions[index % redHerringDescriptions.length];
  }

  // Expanded real evidence with more variety
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
    `Forensic analysis implicates ${guiltySuspect.name}`,
    `Digital trail traces back to ${guiltySuspect.name}'s devices`,
    `Surveillance shows ${guiltySuspect.name} purchasing suspicious items`,
    `Bank transfer from ${guiltySuspect.name} to unknown account`,
    `Fiber evidence matches ${guiltySuspect.name}'s clothing`,
    `Voice analysis confirms ${guiltySuspect.name} made threatening call`,
    `GPS data places ${guiltySuspect.name} at scene during crime`,
    `Search history on ${guiltySuspect.name}'s computer is incriminating`,
    `Handwriting expert confirms ${guiltySuspect.name} wrote note`,
    `Chemical residue found on ${guiltySuspect.name}'s belongings`,
    `Metadata from photo implicates ${guiltySuspect.name}`
  ];
  return agePrefix + descriptions[index % descriptions.length];
}

export function interrogateSuspect(suspect, caseData) {
  const guiltyResponses = [
    `I... I was just doing what I had to do. ${suspect.name} looks away nervously.`,
    `Why are you asking me this? I already told you! ${suspect.name} becomes defensive.`,
    `Look, I don't know anything about this. ${suspect.name} crosses arms.`,
    `You have no proof! ${suspect.name} voice raises.`,
    `I wasn't even there... well, not at that exact time. ${suspect.name} hesitates.`,
    `This is ridiculous. I refuse to answer any more questions. ${suspect.name} stands abruptly.`,
    `You're wasting your time with me, detective. ${suspect.name} avoids eye contact.`,
    `I need to speak with my lawyer before saying anything else. ${suspect.name} taps fingers nervously.`,
    `Why would I do something like that? It doesn't make sense. ${suspect.name} voice cracks slightly.`,
    `There are things you don't understand about the situation... ${suspect.name} trails off.`,
    `Fine, yes I was there, but I didn't do anything wrong! ${suspect.name} admits reluctantly.`,
    `Everyone makes mistakes, detective. ${suspect.name} looks regretful.`
  ];

  const innocentResponses = [
    `I've told you everything I know. ${suspect.name} maintains eye contact.`,
    `I have nothing to hide, detective. ${suspect.name} speaks calmly.`,
    `I was nowhere near when it happened. ${suspect.name} provides details.`,
    `Check my alibi, it's solid. ${suspect.name} seems confident.`,
    `I want to help catch whoever did this. ${suspect.name} appears cooperative.`,
    `Ask anyone who was there, they'll confirm what I'm saying. ${suspect.name} gestures openly.`,
    `I can provide phone records, credit card receipts, anything you need. ${suspect.name} volunteers information.`,
    `This is absurd. I had no reason to do this. ${suspect.name} seems genuinely offended.`,
    `I barely knew the victim. Why would I be involved? ${suspect.name} asks reasonably.`,
    `I've been completely transparent with you from the start. ${suspect.name} remains composed.`,
    `Check the security footage. You'll see I'm telling the truth. ${suspect.name} suggests confidently.`,
    `I understand you have to ask these questions, detective. ${suspect.name} shows patience.`
  ];

  const responses = suspect.isGuilty ? guiltyResponses : innocentResponses;
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

export function evaluateAccusation(accusedId, caseData, hintsUsed = 0, contradictionsFound = 0) {
  const correct = accusedId === caseData.guiltyIndex;
  const guiltyName = caseData.suspects[caseData.guiltyIndex].name;
  const accusedName = caseData.suspects[accusedId].name;

  const evidenceFound = caseData.evidence.filter(e => e.discovered).length;
  const criticalEvidence = caseData.evidence.filter(e => e.critical && e.discovered).length;
  const isColdCase = caseData.isColdCase;

  let stars = 0;
  let methodologyScore = 0; // For cold cases

  if (correct) {
    if (isColdCase) {
      // Cold Case Methodology Scoring - Focus on thoroughness, not speed
      stars = 1; // Base star

      // Evidence completeness (up to 2 stars)
      const evidenceRatio = evidenceFound / caseData.evidence.length;
      if (evidenceRatio >= 0.9) {
        stars += 2;
        methodologyScore += 40;
      } else if (evidenceRatio >= 0.7) {
        stars += 1;
        methodologyScore += 25;
      } else if (evidenceRatio >= 0.5) {
        methodologyScore += 15;
      }

      // Critical evidence (up to 1 star)
      if (criticalEvidence >= 2) {
        stars += 1;
        methodologyScore += 20;
      } else if (criticalEvidence >= 1) {
        methodologyScore += 10;
      }

      // Interrogation thoroughness (up to 1 star)
      const interrogationRatio = caseData.interrogationCount / caseData.suspects.length;
      if (interrogationRatio >= 1.5) { // Multiple rounds of questioning
        stars += 1;
        methodologyScore += 30;
      } else if (interrogationRatio >= 1.0) {
        methodologyScore += 15;
      }

      // Contradictions found (bonus - can exceed 5 stars for methodology display)
      if (contradictionsFound >= 3) {
        methodologyScore += 20;
      } else if (contradictionsFound >= 1) {
        methodologyScore += 10;
      }

      // Hints penalty is minimal for cold cases (methodology focus)
      const hintPenalty = Math.min(Math.floor(hintsUsed / 4), 1);
      stars = Math.max(1, Math.min(5, stars - hintPenalty));
      methodologyScore = Math.max(0, Math.min(100, methodologyScore - (hintsUsed * 5)));
    } else {
      // Standard scoring for non-cold cases
      stars = 1;
      if (criticalEvidence >= 1) stars++;
      if (evidenceFound >= caseData.evidence.length * 0.6) stars++;
      if (caseData.interrogationCount >= caseData.suspects.length) stars++;
      if (criticalEvidence === 2) stars++;

      // Reduce stars for using hints (max reduction of 2 stars)
      const hintPenalty = Math.min(Math.floor(hintsUsed / 2), 2);
      stars = Math.max(1, stars - hintPenalty);
    }
  }

  return {
    correct,
    stars,
    methodologyScore: isColdCase ? methodologyScore : null,
    message: correct ?
      (isColdCase ? `🎯 COLD CASE SOLVED! ${guiltyName} was indeed the culprit. Outstanding detective work!` :
       `🎯 CORRECT! ${guiltyName} was indeed the culprit. Excellent work, Detective!`) :
      `❌ WRONG! ${accusedName} was innocent. The real culprit was ${guiltyName}.`,
    feedback: correct ?
      (isColdCase ?
        `You solved this cold case using ${evidenceFound}/${caseData.evidence.length} pieces of evidence, ${contradictionsFound} contradictions found. Methodology Score: ${methodologyScore}/100${hintsUsed > 0 ? ` (${hintsUsed} hint${hintsUsed > 1 ? 's' : ''} used)` : ''}` :
        `You successfully identified the perpetrator using ${evidenceFound} pieces of evidence.${hintsUsed > 0 ? ` (${hintsUsed} hint${hintsUsed > 1 ? 's' : ''} used)` : ''}`) :
      `You missed key evidence. ${guiltyName} had the motive and opportunity.`,
    reputation: correct ? (isColdCase ? stars * 300 : stars * 200) : 50
  };
}
