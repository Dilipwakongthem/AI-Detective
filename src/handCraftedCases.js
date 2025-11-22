// Hand-Crafted Detective Cases
// These cases provide unique, hand-crafted detective stories with plot twists

export const HAND_CRAFTED_CASES = [
  {
    id: 'gallery_heist',
    title: 'The Midnight Gallery Heist',
    difficulty: 3,
    crimeType: 'Theft',
    location: 'Artisan Gallery',
    narrative: {
      opening: 'A priceless painting has vanished from the Artisan Gallery overnight. The alarm never triggered. This was an inside job.',
      twist: 'The painting was actually a forgery. The real theft happened months ago.',
      conclusion: 'The curator staged the heist to cover up the earlier forgery swap.'
    },
    suspects: [
      {
        name: 'Diana Chen',
        age: 34,
        occupation: 'Gallery Curator',
        personality: 'Calculating',
        isGuilty: true
      },
      {
        name: 'Roberto Vasquez',
        age: 42,
        occupation: 'Security Chief',
        personality: 'Defensive',
        isGuilty: false
      }
    ],
    evidence: [
      {
        type: 'Security Footage',
        description: 'Shows Diana Chen entering at 10:30 PM',
        location: 'Security Office',
        critical: true
      }
    ],
    hints: [
      { level: 1, text: 'Check the security footage timestamps' },
      { level: 2, text: 'The curator has access to everything' },
      { level: 3, text: 'Someone needed to hide a forgery' }
    ]
  },
  {
    id: 'restaurant_murder',
    title: 'Death at Le Bernardin',
    difficulty: 4,
    crimeType: 'Murder',
    location: 'Le Bernardin Restaurant',
    narrative: {
      opening: 'A wealthy restaurant critic died at an exclusive dining event. Poison is suspected.',
      twist: 'The victim had severe food allergies that were exploited.',
      conclusion: 'The head chef deliberately served allergens after years of harsh reviews.'
    },
    suspects: [
      {
        name: 'Marcel Dubois',
        age: 48,
        occupation: 'Head Chef',
        personality: 'Arrogant',
        isGuilty: true
      }
    ],
    evidence: [
      {
        type: 'Autopsy Report',
        description: 'Shows anaphylactic shock from shellfish',
        critical: true
      }
    ],
    hints: []
  },
  {
    id: 'tech_fraud',
    title: 'Silicon Valley Sabotage',
    difficulty: 5,
    crimeType: 'Fraud',
    location: 'TechCorp HQ',
    narrative: {
      opening: 'Corporate espionage has cost the company millions. An insider is suspected.',
      conclusion: 'A disgruntled former employee seeking revenge.'
    },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'digital_alibi',
    title: 'The Digital Alibi',
    difficulty: 3,
    crimeType: 'Theft',
    location: 'Downtown Office',
    narrative: { opening: 'A theft with a seemingly perfect digital alibi.' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'locked_room',
    title: 'The Locked Room Mystery',
    difficulty: 4,
    crimeType: 'Murder',
    location: 'Manor House',
    narrative: { opening: 'A murder in a locked room - how was it done?' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'insurance_fraud',
    title: 'The Insurance Scam',
    difficulty: 2,
    crimeType: 'Fraud',
    location: 'Insurance Office',
    narrative: { opening: 'A suspicious insurance claim needs investigation.' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'art_forgery',
    title: 'The Art Forger',
    difficulty: 3,
    crimeType: 'Fraud',
    location: 'Private Collection',
    narrative: { opening: 'Priceless artworks are being replaced with forg eries.' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'missing_heir',
    title: 'The Missing Heir',
    difficulty: 4,
    crimeType: 'Kidnapping',
    location: 'Estate',
    narrative: { opening: 'An heir has vanished before inheriting a fortune.' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'stolen_manuscript',
    title: 'The Stolen Manuscript',
    difficulty: 1,
    crimeType: 'Theft',
    location: 'Library',
    narrative: { opening: 'A rare manuscript has been stolen from the archives.' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'poisoned_pen',
    title: 'The Poisoned Pen',
    difficulty: 2,
    crimeType: 'Murder',
    location: 'Publishing House',
    narrative: { opening: 'A famous author has been poisoned.' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'vanishing_act',
    title: 'The Vanishing Act',
    difficulty: 4,
    crimeType: 'Kidnapping',
    location: 'Theater',
    narrative: { opening: 'A magician disappeared during their final act.' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'corporate_spy',
    title: 'The Corporate Spy',
    difficulty: 3,
    crimeType: 'Fraud',
    location: 'Corporate Office',
    narrative: { opening: 'Trade secrets are being leaked to competitors.' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'perfect_alibi',
    title: 'The Perfect Alibi',
    difficulty: 5,
    crimeType: 'Murder',
    location: 'Penthouse',
    narrative: { opening: 'A murder with an unbreakable alibi... or is it?' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'seven_suspects',
    title: 'Seven Suspects',
    difficulty: 4,
    crimeType: 'Murder',
    location: 'Country Club',
    narrative: { opening: 'Seven people had opportunity. All have motives.' },
    suspects: [],
    evidence: [],
    hints: []
  },
  {
    id: 'impossible_murder',
    title: 'The Impossible Murder',
    difficulty: 5,
    crimeType: 'Murder',
    location: 'Isolated Cabin',
    narrative: { opening: 'A locked cabin, no way in or out, and a dead body.' },
    suspects: [],
    evidence: [],
    hints: []
  }
];

export default HAND_CRAFTED_CASES;
