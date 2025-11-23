// Hand-Crafted Cold Case Scenarios
// These are complex, aged cases with 15 suspects and extensive evidence

export const COLD_CASE_SCENARIOS = [
  // COLD CASE 1: The Vanished Heiress (15 years old)
  {
    id: 'cold_case_vanished_heiress',
    title: 'The Vanished Heiress',
    difficulty: 10,
    isColdCase: true,
    yearsOld: 15,
    crimeType: 'Murder',
    location: 'Thornwood Manor',
    narrative: {
      opening: 'Fifteen years ago, heiress Victoria Thornwood disappeared on the night before her wedding. Her body was found in the garden six months later. The case went cold. New DNA technology has reopened the investigation.',
      twist: 'The wedding planner was actually Victoria\'s half-sister, seeking revenge for being written out of the will.',
      conclusion: 'Financial records from offshore accounts finally exposed the conspiracy between the wedding planner and the estate lawyer.'
    },
    suspects: [
      {
        name: 'Marcus Thornwood',
        age: 58,
        occupation: 'Victim\'s Father',
        personality: 'Calculating',
        alibi: 'Claims he was in his study reviewing business documents',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Diana Ashford',
        age: 41,
        occupation: 'Wedding Planner',
        personality: 'Charming',
        alibi: 'Says she was coordinating with caterers all evening',
        isGuilty: true,
        suspicionLevel: 5
      },
      {
        name: 'Robert Chambers',
        age: 55,
        occupation: 'Estate Lawyer',
        personality: 'Evasive',
        alibi: 'Claims to have left the manor at 8 PM',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Eleanor Price',
        age: 62,
        occupation: 'Family Housekeeper',
        personality: 'Cooperative',
        alibi: 'Was preparing rooms for wedding guests',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'James Blackwell',
        age: 43,
        occupation: 'Fiancé',
        personality: 'Defensive',
        alibi: 'Says he was with groomsmen at a bachelor party',
        isGuilty: false,
        suspicionLevel: 5
      },
      {
        name: 'Sarah Montenegro',
        age: 38,
        occupation: 'Victoria\'s Best Friend',
        personality: 'Nervous',
        alibi: 'Claims she went home early with a headache',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Dr. Henry Walsh',
        age: 67,
        occupation: 'Family Physician',
        personality: 'Calm',
        alibi: 'States he was at a medical conference',
        isGuilty: false,
        suspicionLevel: 1
      },
      {
        name: 'Catherine Reed',
        age: 45,
        occupation: 'Garden Caretaker',
        personality: 'Suspicious',
        alibi: 'Was tending to garden arrangements',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Vincent Moretti',
        age: 51,
        occupation: 'Head of Security',
        personality: 'Aggressive',
        alibi: 'Claims he was monitoring security cameras',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Alexandra Chen',
        age: 40,
        occupation: 'Victoria\'s Business Partner',
        personality: 'Calculating',
        alibi: 'Says she was reviewing merger documents',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Thomas Whitmore',
        age: 59,
        occupation: 'Estate Manager',
        personality: 'Cooperative',
        alibi: 'Was coordinating with event staff',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Isabella Santos',
        age: 36,
        occupation: 'Caterer',
        personality: 'Calm',
        alibi: 'Working in the kitchen all evening',
        isGuilty: false,
        suspicionLevel: 1
      },
      {
        name: 'Richard Foster',
        age: 48,
        occupation: 'Private Investigator',
        personality: 'Evasive',
        alibi: 'Claims to have been hired to investigate James',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Margaret Thornwood',
        age: 56,
        occupation: 'Victim\'s Aunt',
        personality: 'Charming',
        alibi: 'Says she was resting in her guest room',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Daniel Cross',
        age: 42,
        occupation: 'Photography',
        personality: 'Nervous',
        alibi: 'Was setting up photography equipment',
        isGuilty: false,
        suspicionLevel: 2
      }
    ],
    evidence: [
      {
        type: 'DNA Sample',
        description: '[15 years old] DNA under victim\'s fingernails matches Diana Ashford',
        location: 'Crime Scene',
        critical: true,
        yearsOld: 15,
        condition: 'Degraded'
      },
      {
        type: 'Financial Documents',
        description: '[15 years old] Offshore account transfers to Diana Ashford after Victoria\'s death',
        location: 'Office',
        critical: true,
        yearsOld: 15,
        condition: 'Faded'
      },
      {
        type: 'Security Footage',
        description: '[15 years old] Footage shows Diana near the garden at 11:45 PM',
        location: 'Security Office',
        critical: true,
        yearsOld: 15,
        condition: 'Deteriorated'
      },
      {
        type: 'Blood Stains',
        description: '[15 years old] Blood on Diana\'s scarf found in storage',
        location: 'Storage Room',
        critical: true,
        yearsOld: 15,
        condition: 'Degraded'
      },
      {
        type: 'Witness Testimony',
        description: '[15 years old] Caterer saw Diana arguing with Victoria at 10 PM',
        location: 'Office',
        critical: false,
        yearsOld: 15,
        condition: 'Good'
      },
      {
        type: 'Phone Records',
        description: '[15 years old] Multiple calls between Diana and unknown number',
        location: 'Office',
        critical: false,
        yearsOld: 15,
        condition: 'Faded'
      },
      {
        type: 'Threatening Letter',
        description: '[15 years old] Anonymous letter to Victoria about "family secrets"',
        location: 'Crime Scene',
        critical: false,
        yearsOld: 15,
        condition: 'Weathered'
      },
      {
        type: 'Fingerprints',
        description: '[15 years old] Diana\'s fingerprints on garden gate',
        location: 'Crime Scene',
        critical: false,
        yearsOld: 15,
        condition: 'Partially Damaged'
      }
    ],
    hints: [
      'Focus on the financial documents showing money transfers after the death.',
      'DNA evidence under the fingernails suggests a struggle.',
      'Compare alibis with security footage timestamps.',
      'The wedding planner had both motive and opportunity.'
    ]
  },

  // COLD CASE 2: The Museum Heist (12 years old)
  {
    id: 'cold_case_museum_heist',
    title: 'The Museum Heist',
    difficulty: 10,
    isColdCase: true,
    yearsOld: 12,
    crimeType: 'Theft',
    location: 'Metropolitan Art Museum',
    narrative: {
      opening: 'Twelve years ago, five priceless artifacts vanished from the Metropolitan Museum. The security system was professionally disabled. The case remained unsolved until one artifact resurfaced at an auction.',
      twist: 'The night security supervisor orchestrated the heist with help from a corrupt insurance adjuster.',
      conclusion: 'Email records revealed the planning communication, and the insurance payout was the real target.'
    },
    suspects: [
      {
        name: 'Victor Harlow',
        age: 54,
        occupation: 'Night Security Supervisor',
        personality: 'Defensive',
        alibi: 'Claims he was doing rounds during the theft',
        isGuilty: true,
        suspicionLevel: 5
      },
      {
        name: 'Dr. Evelyn Hart',
        age: 61,
        occupation: 'Museum Curator',
        personality: 'Cooperative',
        alibi: 'Was attending a gala across town',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Nathan Pierce',
        age: 47,
        occupation: 'Insurance Adjuster',
        personality: 'Calculating',
        alibi: 'Says he was home with family',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Miranda Cole',
        age: 42,
        occupation: 'Assistant Curator',
        personality: 'Nervous',
        alibi: 'Claims she left museum at 6 PM',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Frank Castellano',
        age: 58,
        occupation: 'Art Dealer',
        personality: 'Charming',
        alibi: 'States he was out of country',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Linda Zhao',
        age: 39,
        occupation: 'Restoration Expert',
        personality: 'Calm',
        alibi: 'Working late in restoration lab',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Carlos Martinez',
        age: 45,
        occupation: 'Security Guard',
        personality: 'Cooperative',
        alibi: 'Was on patrol on different floor',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Rebecca Stone',
        age: 51,
        occupation: 'Museum Director',
        personality: 'Aggressive',
        alibi: 'At home with verifiable phone calls',
        isGuilty: false,
        suspicionLevel: 1
      },
      {
        name: 'Timothy Brooks',
        age: 43,
        occupation: 'IT Security Specialist',
        personality: 'Evasive',
        alibi: 'Claims system was already compromised',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Angela Frost',
        age: 48,
        occupation: 'Private Collector',
        personality: 'Charming',
        alibi: 'Was at opera with documented tickets',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Michael Durant',
        age: 55,
        occupation: 'Antique Appraiser',
        personality: 'Calculating',
        alibi: 'Says he was appraising items elsewhere',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Sophie Laurent',
        age: 37,
        occupation: 'Museum Docent',
        personality: 'Cooperative',
        alibi: 'Had left hours before the theft',
        isGuilty: false,
        suspicionLevel: 1
      },
      {
        name: 'Gregory Walsh',
        age: 60,
        occupation: 'Board Member',
        personality: 'Arrogant',
        alibi: 'At charity dinner with witnesses',
        isGuilty: false,
        suspicionLevel: 1
      },
      {
        name: 'Olivia Chen',
        age: 41,
        occupation: 'Art Historian',
        personality: 'Calm',
        alibi: 'Working on research at university',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'David Romano',
        age: 49,
        occupation: 'Building Maintenance',
        personality: 'Nervous',
        alibi: 'Claims he was off duty that night',
        isGuilty: false,
        suspicionLevel: 2
      }
    ],
    evidence: [
      {
        type: 'Security Footage',
        description: '[12 years old] Victor Harlow disabled camera system at 2:17 AM',
        location: 'Security Office',
        critical: true,
        yearsOld: 12,
        condition: 'Degraded'
      },
      {
        type: 'Email Records',
        description: '[12 years old] Coded emails between Victor and Nathan about "special delivery"',
        location: 'Office',
        critical: true,
        yearsOld: 12,
        condition: 'Good'
      },
      {
        type: 'Financial Documents',
        description: '[12 years old] Large deposit in Victor\'s account after insurance payout',
        location: 'Storage Room',
        critical: true,
        yearsOld: 12,
        condition: 'Faded'
      },
      {
        type: 'Fingerprints',
        description: '[12 years old] Victor\'s prints on alarm panel in restricted area',
        location: 'Crime Scene',
        critical: true,
        yearsOld: 12,
        condition: 'Partially Damaged'
      }
    ],
    hints: [
      'Check who had the technical knowledge to disable the security system.',
      'Follow the money trail from the insurance payout.',
      'Security footage shows the supervisor in areas he shouldn\'t be.',
      'Email records contain suspicious coded language.'
    ]
  },

  // COLD CASE 3: The Poisoned CEO (20 years old)
  {
    id: 'cold_case_poisoned_ceo',
    title: 'The Poisoned CEO',
    difficulty: 10,
    isColdCase: true,
    yearsOld: 20,
    crimeType: 'Murder',
    location: 'TechVision Corporate HQ',
    narrative: {
      opening: 'Twenty years ago, tech CEO Jonathan Sterling died of apparent heart failure at age 42. Recent toxicology advances revealed he was poisoned with a rare compound. The case has been reopened.',
      twist: 'His personal assistant was actually working for a rival company, paid to eliminate Sterling before a major merger.',
      conclusion: 'Phone records and financial transfers finally exposed the corporate espionage network.'
    },
    suspects: [
      {
        name: 'Patricia Morrison',
        age: 58,
        occupation: 'Personal Assistant',
        personality: 'Evasive',
        alibi: 'Claims she was scheduling meetings that day',
        isGuilty: true,
        suspicionLevel: 5
      },
      {
        name: 'Andrew Sterling',
        age: 51,
        occupation: 'Victim\'s Brother',
        personality: 'Aggressive',
        alibi: 'Says he was at company retreat',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Rachel Kim',
        age: 55,
        occupation: 'CFO',
        personality: 'Calculating',
        alibi: 'Claims she was in board meeting',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Marcus Webb',
        age: 62,
        occupation: 'Rival CEO',
        personality: 'Charming',
        alibi: 'States he was at conference',
        isGuilty: false,
        suspicionLevel: 5
      },
      {
        name: 'Dr. Lisa Chang',
        age: 57,
        occupation: 'Company Physician',
        personality: 'Cooperative',
        alibi: 'Working in medical office',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Thomas Drake',
        age: 60,
        occupation: 'Head of R&D',
        personality: 'Nervous',
        alibi: 'Claims he was in lab',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Jennifer Hayes',
        age: 53,
        occupation: 'VP of Operations',
        personality: 'Calm',
        alibi: 'Was reviewing quarterly reports',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Robert Chen',
        age: 59,
        occupation: 'Legal Counsel',
        personality: 'Defensive',
        alibi: 'Says he was in deposition',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Sandra Mitchell',
        age: 56,
        occupation: 'HR Director',
        personality: 'Cooperative',
        alibi: 'Conducting employee interviews',
        isGuilty: false,
        suspicionLevel: 1
      },
      {
        name: 'Kevin Park',
        age: 54,
        occupation: 'Head of Security',
        personality: 'Suspicious',
        alibi: 'Monitoring security systems',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Diana Foster',
        age: 52,
        occupation: 'Marketing Director',
        personality: 'Charming',
        alibi: 'At client presentation',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'William Cross',
        age: 65,
        occupation: 'Board Chairman',
        personality: 'Arrogant',
        alibi: 'At golf club with witnesses',
        isGuilty: false,
        suspicionLevel: 1
      },
      {
        name: 'Emily Watson',
        age: 50,
        occupation: 'Executive Chef',
        personality: 'Nervous',
        alibi: 'Preparing lunch in kitchen',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'James Rodriguez',
        age: 58,
        occupation: 'IT Director',
        personality: 'Calm',
        alibi: 'Working on server maintenance',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Catherine Lee',
        age: 55,
        occupation: 'Investor Relations',
        personality: 'Cooperative',
        alibi: 'On conference call with investors',
        isGuilty: false,
        suspicionLevel: 1
      }
    ],
    evidence: [
      {
        type: 'Toxicology Report',
        description: '[20 years old] Rare poison compound found in tissue samples',
        location: 'Office',
        critical: true,
        yearsOld: 20,
        condition: 'Good'
      },
      {
        type: 'Phone Records',
        description: '[20 years old] Suspicious calls between Patricia and unknown number',
        location: 'Storage Room',
        critical: true,
        yearsOld: 20,
        condition: 'Faded'
      },
      {
        type: 'Financial Documents',
        description: '[20 years old] Large offshore payment to Patricia Morrison',
        location: 'Office',
        critical: true,
        yearsOld: 20,
        condition: 'Weathered'
      },
      {
        type: 'Security Footage',
        description: '[20 years old] Patricia accessing Sterling\'s private office alone',
        location: 'Security Office',
        critical: true,
        yearsOld: 20,
        condition: 'Deteriorated'
      }
    ],
    hints: [
      'Toxicology shows a rare compound not easily accessible.',
      'Financial records show suspicious offshore payments.',
      'Who had access to Sterling\'s private space?',
      'Phone records link to rival company executives.'
    ]
  }
];

// Export helper functions
export function getColdCaseCases() {
  return COLD_CASE_SCENARIOS.map((caseData, index) => ({
    ...caseData,
    index,
    category: 'cold_case',
    isPremium: false,
    isUnlocked: true
  }));
}

export function isColdCaseScenario(caseId) {
  return COLD_CASE_SCENARIOS.some(c => c.id === caseId);
}
