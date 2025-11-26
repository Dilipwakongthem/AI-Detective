// Tutorial Cases - Learning Cases for New Players
// Progressive difficulty: 1-minute, 2-minute, 3-minute cases

export const TUTORIAL_CASES = [
  // TUTORIAL 1: 1-Minute Case - Basic Mechanics
  {
    id: 'tutorial_coffee_theft',
    title: 'Tutorial: The Missing Coffee Mug',
    difficulty: 1,
    isTutorial: true,
    estimatedTime: '1 min',
    crimeType: 'Theft',
    location: 'Office Break Room',
    backgroundImage: '/src/Assets/Background/CrimeScene.png',
    narrative: {
      opening: 'Welcome, Detective! Let\'s start with something simple. Someone stole the boss\'s favorite coffee mug. Your job is to find evidence and identify the culprit.',
      tutorial: 'TUTORIAL: Click on locations to search for evidence. Question suspects to learn more about them. When you\'re ready, make your accusation!',
      conclusion: 'Great work! You\'ve solved your first case. Real cases will be more complex, but you\'ve got the basics down.'
    },
    suspects: [
      {
        name: 'Sarah Johnson',
        age: 28,
        occupation: 'Marketing Associate',
        personality: 'Nervous',
        alibi: 'Claims she was in a meeting all morning',
        isGuilty: true,
        suspicionLevel: 3,
        tutorialHint: 'Notice her nervous behavior when questioned.'
      },
      {
        name: 'Tom Richardson',
        age: 35,
        occupation: 'IT Technician',
        personality: 'Calm',
        alibi: 'Says he was fixing computers on the 3rd floor',
        isGuilty: false,
        suspicionLevel: 1,
        tutorialHint: 'His alibi seems solid.'
      }
    ],
    evidence: [
      {
        type: 'Fingerprints',
        description: 'Fresh fingerprints on the coffee machine - matches Sarah Johnson',
        location: 'Crime Scene',
        critical: true,
        tutorialNote: 'This is CRITICAL evidence! It directly links to the guilty party.'
      },
      {
        type: 'Witness Testimony',
        description: 'Janitor saw Sarah Johnson near the break room at 8:45 AM',
        location: 'Office',
        critical: true,
        tutorialNote: 'Witness testimony can provide timeline information.'
      },
      {
        type: 'Security Footage',
        description: 'Footage shows Sarah Johnson entering break room alone',
        location: 'Security Office',
        critical: false,
        tutorialNote: 'Security footage helps establish who was at the scene.'
      }
    ],
    hints: [
      'Look for evidence that directly connects to a suspect.',
      'Sarah Johnson\'s fingerprints were found at the scene.',
      'The witness testimony contradicts Sarah\'s alibi about being in a meeting.'
    ],
    tutorialSteps: [
      'Search locations to find evidence',
      'Question both suspects',
      'Review the evidence board',
      'Make your accusation when ready'
    ]
  },

  // TUTORIAL 2: 2-Minute Case - Introducing Contradictions
  {
    id: 'tutorial_office_sabotage',
    title: 'Tutorial: The Office Sabotage',
    difficulty: 2,
    isTutorial: true,
    estimatedTime: '2 min',
    crimeType: 'Sabotage',
    location: 'Tech Startup Office',
    narrative: {
      opening: 'Someone deleted critical files from the company server. The damage could cost thousands. Three employees had access to the system last night.',
      tutorial: 'NEW MECHANIC: During interrogation, you can now PRESENT EVIDENCE to find contradictions in suspect statements. Look for inconsistencies!',
      conclusion: 'Excellent! You used evidence to expose a contradiction. This is a key detective skill!'
    },
    suspects: [
      {
        name: 'Alex Morgan',
        age: 31,
        occupation: 'Lead Developer',
        personality: 'Defensive',
        alibi: 'Claims he left the office at 6 PM and went straight home',
        isGuilty: false,
        suspicionLevel: 2,
        tutorialHint: 'His alibi checks out with security logs.'
      },
      {
        name: 'Jessica Park',
        age: 27,
        occupation: 'System Administrator',
        personality: 'Evasive',
        alibi: 'Says she was working remotely from home all evening',
        isGuilty: true,
        suspicionLevel: 4,
        tutorialHint: 'Her remote login doesn\'t match her story.'
      },
      {
        name: 'David Chen',
        age: 42,
        occupation: 'Project Manager',
        personality: 'Cooperative',
        alibi: 'Was at a client dinner with witnesses',
        isGuilty: false,
        suspicionLevel: 1,
        tutorialHint: 'Multiple witnesses confirm his alibi.'
      }
    ],
    evidence: [
      {
        type: 'Phone Records',
        description: 'Jessica Park\'s phone was at the office location at 9 PM',
        location: 'Office',
        critical: true,
        tutorialNote: 'CONTRADICTION! This contradicts her claim of working from home.'
      },
      {
        type: 'Security Footage',
        description: 'Footage shows Jessica Park entering the building at 8:45 PM',
        location: 'Security Office',
        critical: true,
        tutorialNote: 'Direct evidence placing her at the scene.'
      },
      {
        type: 'Email Records',
        description: 'Deleted files were accessed using Jessica Park\'s credentials',
        location: 'Storage Room',
        critical: true,
        tutorialNote: 'Her system credentials were used for the deletion.'
      },
      {
        type: 'Witness Testimony',
        description: 'David Chen confirmed being at dinner 8 PM - 11 PM',
        location: 'Office',
        critical: false,
        tutorialNote: 'This clears David Chen as a suspect.'
      }
    ],
    hints: [
      'Compare Jessica\'s alibi with the phone records.',
      'Present the phone records during interrogation to expose the contradiction.',
      'Security footage confirms she was physically at the office.'
    ],
    tutorialSteps: [
      'Gather all available evidence first',
      'Question each suspect about their alibis',
      'Look for contradictions between evidence and statements',
      'Present contradicting evidence during interrogation',
      'Make your accusation with solid proof'
    ]
  },

  // TUTORIAL 3: 3-Minute Case - Full Mechanics
  {
    id: 'tutorial_warehouse_mystery',
    title: 'Tutorial: The Warehouse Mystery',
    difficulty: 3,
    isTutorial: true,
    estimatedTime: '3 min',
    crimeType: 'Theft',
    location: 'Industrial Warehouse',
    narrative: {
      opening: 'Valuable shipment worth $50,000 vanished from a secured warehouse. Four employees had access. This is your final training case - use all your detective skills!',
      tutorial: 'ADVANCED: Use different interrogation approaches (Empathy, Logic, Intimidation) to get better responses. Build trust or apply pressure. Watch for red herrings!',
      conclusion: 'Outstanding work, Detective! You\'ve mastered the fundamentals. You\'re ready for real cases!'
    },
    suspects: [
      {
        name: 'Marcus Bennett',
        age: 38,
        occupation: 'Warehouse Manager',
        personality: 'Calculating',
        alibi: 'Claims he was doing inventory in Section B',
        isGuilty: false,
        suspicionLevel: 3,
        tutorialHint: 'High suspicion but actually innocent. Don\'t jump to conclusions!'
      },
      {
        name: 'Linda Foster',
        age: 45,
        occupation: 'Security Supervisor',
        personality: 'Aggressive',
        alibi: 'Says she was monitoring cameras all shift',
        isGuilty: true,
        suspicionLevel: 4,
        tutorialHint: 'She had access to disable security systems.'
      },
      {
        name: 'Kevin Wu',
        age: 29,
        occupation: 'Forklift Operator',
        personality: 'Nervous',
        alibi: 'Claims he was on break during the theft window',
        isGuilty: false,
        suspicionLevel: 2,
        tutorialHint: 'Nervous personality doesn\'t mean guilty!'
      },
      {
        name: 'Rachel Adams',
        age: 33,
        occupation: 'Logistics Coordinator',
        personality: 'Charming',
        alibi: 'States she was updating shipping manifests in the office',
        isGuilty: false,
        suspicionLevel: 1,
        tutorialHint: 'Her records show consistent office activity.'
      }
    ],
    evidence: [
      {
        type: 'Security Footage',
        description: 'Camera system was disabled for 47 minutes during theft window',
        location: 'Security Office',
        critical: true,
        tutorialNote: 'Only someone with security access could disable this.'
      },
      {
        type: 'Fingerprints',
        description: 'Linda Foster\'s fingerprints on the loading dock lock',
        location: 'Crime Scene',
        critical: true,
        tutorialNote: 'Direct physical evidence linking Linda to the scene.'
      },
      {
        type: 'Email Records',
        description: 'Linda Foster sent emails to unknown buyer about "special delivery"',
        location: 'Office',
        critical: true,
        tutorialNote: 'Motive established - she was planning to sell the goods.'
      },
      {
        type: 'Financial Documents',
        description: 'Large cash deposit in Linda Foster\'s account next day',
        location: 'Storage Room',
        critical: true,
        tutorialNote: 'Financial evidence showing she profited from the theft.'
      },
      {
        type: 'Witness Testimony',
        description: 'Marcus Bennett saw Linda near loading dock at 11 PM',
        location: 'Office',
        critical: false,
        tutorialNote: 'Corroborates other evidence placing Linda at the scene.'
      },
      {
        type: 'Phone Records',
        description: 'Unidentified calls between Marcus and unknown number',
        location: 'Storage Room',
        critical: false,
        isRedHerring: true,
        tutorialNote: 'RED HERRING! This is misleading evidence. Marcus is innocent.'
      },
      {
        type: 'Receipts',
        description: 'Kevin Wu purchased expensive gaming console recently',
        location: 'Parking Lot',
        critical: false,
        isRedHerring: true,
        tutorialNote: 'RED HERRING! Just because someone spent money doesn\'t make them guilty.'
      }
    ],
    hints: [
      'Not all evidence is useful - watch for red herrings!',
      'Who had the ability to disable the security cameras?',
      'Follow the money - check the financial documents.',
      'Multiple pieces of evidence should point to the same person.'
    ],
    tutorialSteps: [
      'Search all locations thoroughly',
      'Question all four suspects',
      'Identify which evidence is critical vs misleading',
      'Use different interrogation approaches to build rapport',
      'Present evidence to expose contradictions',
      'Piece together motive, means, and opportunity',
      'Make a well-justified accusation'
    ]
  }
];

// Export tutorial case IDs for easy access
export const TUTORIAL_CASE_IDS = TUTORIAL_CASES.map(c => c.id);

// Helper function to get tutorial cases in order
export function getTutorialCases() {
  return TUTORIAL_CASES;
}

// Helper function to check if a case is a tutorial
export function isTutorialCase(caseId) {
  return TUTORIAL_CASE_IDS.includes(caseId);
}
