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
        alibi: 'Claims she was at home during the theft',
        isGuilty: true,
        suspicionLevel: 3
      },
      {
        name: 'Roberto Vasquez',
        age: 42,
        occupation: 'Security Chief',
        personality: 'Defensive',
        alibi: 'Says he was on patrol but saw nothing unusual',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Marcus Wells',
        age: 29,
        occupation: 'Art Appraiser',
        personality: 'Nervous',
        alibi: 'Was cataloging pieces in the storage room',
        isGuilty: false,
        suspicionLevel: 2
      }
    ],
    evidence: [
      {
        type: 'Security Footage',
        description: 'Shows Diana Chen entering at 10:30 PM using her access card',
        location: 'Security Office',
        critical: true
      },
      {
        type: 'Financial Records',
        description: 'Diana has significant gambling debts',
        location: 'Office',
        critical: true
      },
      {
        type: 'Access Logs',
        description: 'Only Diana and Roberto had keys to the alarm system',
        location: 'Security Office',
        critical: false
      },
      {
        type: 'Fingerprints',
        description: 'Diana\'s prints found on the alarm control panel',
        location: 'Crime Scene',
        critical: true
      },
      {
        type: 'Email Records',
        description: 'Diana contacted a black market art dealer last month',
        location: 'Office',
        critical: true
      }
    ],
    hints: [
      { level: 1, text: 'Check the security footage timestamps carefully' },
      { level: 2, text: 'The curator has access to everything, including the alarm system' },
      { level: 3, text: 'Someone needed money quickly to cover debts' }
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
        alibi: 'Was in the kitchen preparing all dishes',
        isGuilty: true,
        suspicionLevel: 3
      },
      {
        name: 'Sophie Laurent',
        age: 35,
        occupation: 'Restaurant Owner',
        personality: 'Defensive',
        alibi: 'Was greeting guests at the entrance',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'James Patterson',
        age: 41,
        occupation: 'Sous Chef',
        personality: 'Cooperative',
        alibi: 'Was preparing appetizers in the kitchen',
        isGuilty: false,
        suspicionLevel: 1
      }
    ],
    evidence: [
      {
        type: 'Autopsy Report',
        description: 'Shows anaphylactic shock from shellfish contamination',
        location: 'Crime Scene',
        critical: true
      },
      {
        type: 'Medical Records',
        description: 'Victim had documented severe shellfish allergy',
        location: 'Office',
        critical: true
      },
      {
        type: 'Kitchen Prep Notes',
        description: 'Chef Marcel personally prepared the victim\'s meal',
        location: 'Kitchen',
        critical: true
      },
      {
        type: 'Threatening Letter',
        description: 'Angry note from Marcel about the critic\'s negative reviews',
        location: 'Office',
        critical: true
      },
      {
        type: 'Witness Testimony',
        description: 'Waiter saw Marcel smiling when serving the fatal dish',
        location: 'Crime Scene',
        critical: false
      }
    ],
    hints: [
      { level: 1, text: 'The victim had a known allergy. Was it accidental?' },
      { level: 2, text: 'Check who prepared the victim\'s specific meal' },
      { level: 3, text: 'The chef had a grudge from years of bad reviews' }
    ]
  },
  {
    id: 'tech_fraud',
    title: 'Silicon Valley Sabotage',
    difficulty: 5,
    crimeType: 'Fraud',
    location: 'TechCorp HQ',
    narrative: {
      opening: 'Corporate espionage has cost the company millions. An insider is suspected.',
      twist: 'The CFO was embezzling and blamed it on competitors.',
      conclusion: 'A disgruntled CFO seeking revenge and profit.'
    },
    suspects: [
      {
        name: 'Jennifer Wu',
        age: 39,
        occupation: 'Chief Financial Officer',
        personality: 'Calculating',
        alibi: 'Claims she was in meetings during data transfers',
        isGuilty: true,
        suspicionLevel: 2
      },
      {
        name: 'David Park',
        age: 44,
        occupation: 'CTO',
        personality: 'Defensive',
        alibi: 'Was working from home on security patches',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Rachel Kim',
        age: 32,
        occupation: 'Senior Developer',
        personality: 'Nervous',
        alibi: 'Was coding in the open office area',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Thomas Anderson',
        age: 51,
        occupation: 'Former Employee',
        personality: 'Angry',
        alibi: 'Claims he was at a job interview',
        isGuilty: false,
        suspicionLevel: 5
      }
    ],
    evidence: [
      {
        type: 'Server Logs',
        description: 'Unauthorized access from Jennifer\'s credentials',
        location: 'IT Department',
        critical: true
      },
      {
        type: 'Financial Records',
        description: 'Unexplained transfers to offshore accounts',
        location: 'Office',
        critical: true
      },
      {
        type: 'Email Records',
        description: 'Jennifer communicated with competitor companies',
        location: 'IT Department',
        critical: true
      },
      {
        type: 'Security Badge Data',
        description: 'Jennifer accessed server room at 2 AM multiple times',
        location: 'Security Office',
        critical: true
      },
      {
        type: 'USB Drive',
        description: 'Found in Jennifer\'s desk with proprietary code',
        location: 'Office',
        critical: true
      },
      {
        type: 'Witness Testimony',
        description: 'IT staff saw Jennifer acting suspiciously near servers',
        location: 'IT Department',
        critical: false
      }
    ],
    hints: [
      { level: 1, text: 'Follow the money - who benefits financially?' },
      { level: 2, text: 'Check server access logs for unusual patterns' },
      { level: 3, text: 'The CFO has both access and financial motive' }
    ]
  },
  {
    id: 'digital_alibi',
    title: 'The Digital Alibi',
    difficulty: 3,
    crimeType: 'Theft',
    location: 'Downtown Office',
    narrative: {
      opening: 'A theft with a seemingly perfect digital alibi. The suspect was logged in remotely during the theft.',
      twist: 'The digital footprint was manufactured using automated scripts.',
      conclusion: 'The IT manager used their technical skills to fake their location.'
    },
    suspects: [
      {
        name: 'Alex Martinez',
        age: 31,
        occupation: 'IT Manager',
        personality: 'Charming',
        alibi: 'System shows he was working remotely from home',
        isGuilty: true,
        suspicionLevel: 1
      },
      {
        name: 'Sarah Connor',
        age: 28,
        occupation: 'Office Manager',
        personality: 'Cooperative',
        alibi: 'Was at the office but in a different floor',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Mike Chen',
        age: 45,
        occupation: 'Security Guard',
        personality: 'Defensive',
        alibi: 'Was making rounds in the building',
        isGuilty: false,
        suspicionLevel: 3
      }
    ],
    evidence: [
      {
        type: 'Login Records',
        description: 'Alex\'s account accessed from his home IP',
        location: 'IT Department',
        critical: false
      },
      {
        type: 'Security Footage',
        description: 'Shows Alex entering the building despite "remote" login',
        location: 'Security Office',
        critical: true
      },
      {
        type: 'Automated Scripts',
        description: 'Scripts found on Alex\'s computer simulating remote activity',
        location: 'IT Department',
        critical: true
      },
      {
        type: 'Building Access Logs',
        description: 'Alex\'s badge used to enter at time of theft',
        location: 'Security Office',
        critical: true
      },
      {
        type: 'Stolen Items',
        description: 'Company laptops found in Alex\'s car',
        location: 'Parking Lot',
        critical: true
      }
    ],
    hints: [
      { level: 1, text: 'Digital evidence can be manipulated by those with technical skills' },
      { level: 2, text: 'Cross-reference digital logs with physical security footage' },
      { level: 3, text: 'The IT manager would know how to fake a remote login' }
    ]
  },
  {
    id: 'locked_room',
    title: 'The Locked Room Mystery',
    difficulty: 4,
    crimeType: 'Murder',
    location: 'Manor House',
    narrative: {
      opening: 'A murder in a locked room - how was it done? The victim was found dead with the door locked from inside.',
      twist: 'The room has a hidden passage known only to the family.',
      conclusion: 'The victim\'s sibling used a secret passage to commit the crime.'
    },
    suspects: [
      {
        name: 'Victoria Blackwood',
        age: 42,
        occupation: 'Sister of Victim',
        personality: 'Calculating',
        alibi: 'Claims she was in the library reading',
        isGuilty: true,
        suspicionLevel: 3
      },
      {
        name: 'Harold Blackwood',
        age: 67,
        occupation: 'Butler',
        personality: 'Calm',
        alibi: 'Was serving tea in the dining room',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Elizabeth Sterling',
        age: 38,
        occupation: 'Family Lawyer',
        personality: 'Nervous',
        alibi: 'Was reviewing documents in the study',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Robert Blackwood',
        age: 45,
        occupation: 'Brother of Victim',
        personality: 'Cooperative',
        alibi: 'Was in the garden taking a walk',
        isGuilty: false,
        suspicionLevel: 3
      }
    ],
    evidence: [
      {
        type: 'Blueprints',
        description: 'Old manor plans showing a hidden passage from the library',
        location: 'Office',
        critical: true
      },
      {
        type: 'Dust Patterns',
        description: 'Fresh disturbance in the secret passage',
        location: 'Crime Scene',
        critical: true
      },
      {
        type: 'Fiber Evidence',
        description: 'Fabric matching Victoria\'s dress found in the passage',
        location: 'Crime Scene',
        critical: true
      },
      {
        type: 'Last Will',
        description: 'Victim was about to change will, cutting out Victoria',
        location: 'Office',
        critical: true
      },
      {
        type: 'Witness Testimony',
        description: 'Maid saw Victoria near the library at the time of death',
        location: 'Manor House',
        critical: false
      }
    ],
    hints: [
      { level: 1, text: 'How could someone enter a locked room? Look for alternative entrances' },
      { level: 2, text: 'Old manor houses often have secret passages' },
      { level: 3, text: 'The family member would know about hidden features of the house' }
    ]
  },
  {
    id: 'insurance_fraud',
    title: 'The Insurance Scam',
    difficulty: 2,
    crimeType: 'Fraud',
    location: 'Insurance Office',
    narrative: {
      opening: 'A suspicious insurance claim needs investigation. The claimant reported their jewelry stolen but evidence suggests otherwise.',
      twist: 'The jewelry was never stolen - it was sold months ago.',
      conclusion: 'The claimant staged the theft to collect insurance money.'
    },
    suspects: [
      {
        name: 'Patricia Mills',
        age: 52,
        occupation: 'Insurance Claimant',
        personality: 'Nervous',
        alibi: 'Claims she was shopping when the theft occurred',
        isGuilty: true,
        suspicionLevel: 3
      },
      {
        name: 'John Mills',
        age: 54,
        occupation: 'Husband',
        personality: 'Defensive',
        alibi: 'Says he was at work during the alleged theft',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Carlos Rodriguez',
        age: 28,
        occupation: 'Handyman',
        personality: 'Cooperative',
        alibi: 'Was working at a different house',
        isGuilty: false,
        suspicionLevel: 4
      }
    ],
    evidence: [
      {
        type: 'Pawn Shop Records',
        description: 'Patricia sold matching jewelry three months ago',
        location: 'Downtown',
        critical: true
      },
      {
        type: 'Security Footage',
        description: 'No break-in visible at claimed time',
        location: 'Crime Scene',
        critical: true
      },
      {
        type: 'Financial Records',
        description: 'Patricia has significant credit card debt',
        location: 'Insurance Office',
        critical: true
      },
      {
        type: 'Police Report',
        description: 'No signs of forced entry at the residence',
        location: 'Crime Scene',
        critical: false
      },
      {
        type: 'Witness Testimony',
        description: 'Neighbor never saw any suspicious activity',
        location: 'Crime Scene',
        critical: false
      }
    ],
    hints: [
      { level: 1, text: 'Check if the jewelry really existed at the time of the alleged theft' },
      { level: 2, text: 'Look for financial motives - who needs money?' },
      { level: 3, text: 'Pawn shops keep records of all transactions' }
    ]
  },
  {
    id: 'art_forgery',
    title: 'The Art Forger',
    difficulty: 3,
    crimeType: 'Fraud',
    location: 'Private Collection',
    narrative: {
      opening: 'Priceless artworks are being replaced with forgeries. Multiple collectors have been victimized.',
      twist: 'The art restorer was creating perfect copies during restoration.',
      conclusion: 'A skilled restorer used their access to swap originals with forgeries.'
    },
    suspects: [
      {
        name: 'Isabella Romano',
        age: 36,
        occupation: 'Art Restorer',
        personality: 'Charming',
        alibi: 'Says she only worked on cleaning the paintings',
        isGuilty: true,
        suspicionLevel: 2
      },
      {
        name: 'Gregory Walsh',
        age: 59,
        occupation: 'Gallery Owner',
        personality: 'Defensive',
        alibi: 'Claims he had no knowledge of the forgeries',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Nina Petrov',
        age: 41,
        occupation: 'Art Dealer',
        personality: 'Evasive',
        alibi: 'Was attending auctions during the time period',
        isGuilty: false,
        suspicionLevel: 4
      }
    ],
    evidence: [
      {
        type: 'Chemical Analysis',
        description: 'Forgeries use modern paint matching Isabella\'s workshop supplies',
        location: 'Lab',
        critical: true
      },
      {
        type: 'Workshop Materials',
        description: 'Canvas and paint matching the forgeries in Isabella\'s studio',
        location: 'Workshop',
        critical: true
      },
      {
        type: 'Financial Records',
        description: 'Large cash deposits to Isabella\'s account',
        location: 'Office',
        critical: true
      },
      {
        type: 'Restoration Logs',
        description: 'Isabella had access to all forged pieces',
        location: 'Gallery',
        critical: true
      },
      {
        type: 'Hidden Camera',
        description: 'Footage shows Isabella working late, making copies',
        location: 'Workshop',
        critical: true
      }
    ],
    hints: [
      { level: 1, text: 'Who had access to the original paintings for extended periods?' },
      { level: 2, text: 'A restorer would have the skills to create perfect forgeries' },
      { level: 3, text: 'Check for modern materials used in supposedly old paintings' }
    ]
  },
  {
    id: 'missing_heir',
    title: 'The Missing Heir',
    difficulty: 4,
    crimeType: 'Kidnapping',
    location: 'Estate',
    narrative: {
      opening: 'An heir has vanished before inheriting a fortune. Family members are worried... or are they?',
      twist: 'The cousin arranged the kidnapping to prevent the inheritance.',
      conclusion: 'Greed led a family member to kidnap their own relative.'
    },
    suspects: [
      {
        name: 'Frederick Ashworth',
        age: 38,
        occupation: 'Cousin',
        personality: 'Calculating',
        alibi: 'Claims he was at a business meeting',
        isGuilty: true,
        suspicionLevel: 3
      },
      {
        name: 'Margaret Ashworth',
        age: 45,
        occupation: 'Aunt',
        personality: 'Nervous',
        alibi: 'Says she was at home when heir disappeared',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Thomas Burke',
        age: 52,
        occupation: 'Estate Manager',
        personality: 'Cooperative',
        alibi: 'Was managing estate grounds',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Linda Watson',
        age: 33,
        occupation: 'Personal Assistant',
        personality: 'Defensive',
        alibi: 'Was running errands in town',
        isGuilty: false,
        suspicionLevel: 3
      }
    ],
    evidence: [
      {
        type: 'Phone Records',
        description: 'Frederick made calls to known criminals',
        location: 'Office',
        critical: true
      },
      {
        type: 'Financial Records',
        description: 'Frederick has massive gambling debts',
        location: 'Office',
        critical: true
      },
      {
        type: 'Ransom Note',
        description: 'Typewriter font matches Frederick\'s office typewriter',
        location: 'Crime Scene',
        critical: true
      },
      {
        type: 'Security Footage',
        description: 'Frederick\'s car near the kidnapping location',
        location: 'Security Office',
        critical: true
      },
      {
        type: 'Witness Testimony',
        description: 'Someone saw Frederick arguing with the heir days before',
        location: 'Estate',
        critical: false
      }
    ],
    hints: [
      { level: 1, text: 'Who benefits most if the heir doesn\'t inherit?' },
      { level: 2, text: 'Check financial situations of family members' },
      { level: 3, text: 'The cousin would be next in line for the inheritance' }
    ]
  },
  {
    id: 'stolen_manuscript',
    title: 'The Stolen Manuscript',
    difficulty: 1,
    crimeType: 'Theft',
    location: 'Library',
    narrative: {
      opening: 'A rare manuscript has been stolen from the university archives. Only staff had access to the secure section.',
      twist: 'The night janitor took it to sell to a collector.',
      conclusion: 'Simple greed motivated the theft by someone with access.'
    },
    suspects: [
      {
        name: 'Henry Foster',
        age: 61,
        occupation: 'Night Janitor',
        personality: 'Nervous',
        alibi: 'Says he was cleaning other floors',
        isGuilty: true,
        suspicionLevel: 3
      },
      {
        name: 'Dr. Susan Harper',
        age: 48,
        occupation: 'Head Librarian',
        personality: 'Defensive',
        alibi: 'Had left before the theft occurred',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'James Liu',
        age: 25,
        occupation: 'Graduate Student',
        personality: 'Cooperative',
        alibi: 'Was studying in a different section',
        isGuilty: false,
        suspicionLevel: 1
      }
    ],
    evidence: [
      {
        type: 'Security Footage',
        description: 'Shows Henry near the archives at time of theft',
        location: 'Security Office',
        critical: true
      },
      {
        type: 'Fingerprints',
        description: 'Henry\'s prints on the display case',
        location: 'Crime Scene',
        critical: true
      },
      {
        type: 'Email Records',
        description: 'Henry contacted a rare book dealer',
        location: 'IT Department',
        critical: true
      },
      {
        type: 'Access Logs',
        description: 'Henry used his master key to enter archives',
        location: 'Security Office',
        critical: false
      },
      {
        type: 'Financial Records',
        description: 'Henry recently deposited large cash amount',
        location: 'Office',
        critical: true
      }
    ],
    hints: [
      { level: 1, text: 'Who has access to all areas of the library at night?' },
      { level: 2, text: 'Check for unusual financial activity' },
      { level: 3, text: 'The janitor has keys to everywhere' }
    ]
  },
  {
    id: 'poisoned_pen',
    title: 'The Poisoned Pen',
    difficulty: 2,
    crimeType: 'Murder',
    location: 'Publishing House',
    narrative: {
      opening: 'A famous author has been poisoned at a book signing event. The poison was in their pen.',
      twist: 'A rival author, jealous of success, poisoned the pen.',
      conclusion: 'Professional jealousy led to a calculated murder.'
    },
    suspects: [
      {
        name: 'Samantha Reed',
        age: 43,
        occupation: 'Rival Author',
        personality: 'Arrogant',
        alibi: 'Claims she was in the bathroom when poison was applied',
        isGuilty: true,
        suspicionLevel: 4
      },
      {
        name: 'Peter Daniels',
        age: 55,
        occupation: 'Publisher',
        personality: 'Calm',
        alibi: 'Was setting up the signing table',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Rachel Moore',
        age: 29,
        occupation: 'Publishing Assistant',
        personality: 'Cooperative',
        alibi: 'Was coordinating with security',
        isGuilty: false,
        suspicionLevel: 1
      }
    ],
    evidence: [
      {
        type: 'Toxicology Report',
        description: 'Rare poison absorbed through skin contact',
        location: 'Lab',
        critical: true
      },
      {
        type: 'Security Footage',
        description: 'Samantha briefly alone with the victim\'s belongings',
        location: 'Security Office',
        critical: true
      },
      {
        type: 'Poison Source',
        description: 'Same poison found in Samantha\'s research materials',
        location: 'Office',
        critical: true
      },
      {
        type: 'Threatening Letters',
        description: 'Anonymous threats sent from Samantha\'s neighborhood',
        location: 'Crime Scene',
        critical: true
      },
      {
        type: 'Witness Testimony',
        description: 'Someone saw Samantha near victim\'s pen case',
        location: 'Publishing House',
        critical: false
      }
    ],
    hints: [
      { level: 1, text: 'Who had both access and motive?' },
      { level: 2, text: 'Professional rivalry can be a powerful motive' },
      { level: 3, text: 'Check who was researching that specific type of poison' }
    ]
  },
  {
    id: 'vanishing_act',
    title: 'The Vanishing Act',
    difficulty: 4,
    crimeType: 'Kidnapping',
    location: 'Theater',
    narrative: {
      opening: 'A magician disappeared during their final act, but this wasn\'t part of the show.',
      twist: 'The assistant wanted the magician\'s secrets and fame.',
      conclusion: 'The assistant trapped the magician in a hidden compartment.'
    },
    suspects: [
      {
        name: 'Victor Kane',
        age: 34,
        occupation: 'Magician\'s Assistant',
        personality: 'Charming',
        alibi: 'Was on stage helping with the trick',
        isGuilty: true,
        suspicionLevel: 2
      },
      {
        name: 'Marina Silva',
        age: 29,
        occupation: 'Stage Manager',
        personality: 'Nervous',
        alibi: 'Was managing lighting cues backstage',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Richard Stone',
        age: 51,
        occupation: 'Theater Owner',
        personality: 'Defensive',
        alibi: 'Was in his office during the performance',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Elena Frost',
        age: 38,
        occupation: 'Rival Magician',
        personality: 'Calculating',
        alibi: 'Was in the audience watching',
        isGuilty: false,
        suspicionLevel: 4
      }
    ],
    evidence: [
      {
        type: 'Stage Props',
        description: 'Secret compartment modified to lock from outside',
        location: 'Theater',
        critical: true
      },
      {
        type: 'Blueprints',
        description: 'Victor had detailed plans of all trick mechanisms',
        location: 'Backstage',
        critical: true
      },
      {
        type: 'Financial Records',
        description: 'Victor negotiating with rival theater for lead position',
        location: 'Office',
        critical: true
      },
      {
        type: 'Video Recording',
        description: 'Victor subtly changing the prop before the act',
        location: 'Security Office',
        critical: true
      },
      {
        type: 'Witness Testimony',
        description: 'Stagehand saw Victor tampering with equipment',
        location: 'Theater',
        critical: false
      }
    ],
    hints: [
      { level: 1, text: 'Who understood all the magician\'s tricks and secrets?' },
      { level: 2, text: 'Check for modifications to the stage equipment' },
      { level: 3, text: 'The assistant was in the perfect position to sabotage' }
    ]
  },
  {
    id: 'corporate_spy',
    title: 'The Corporate Spy',
    difficulty: 3,
    crimeType: 'Fraud',
    location: 'Corporate Office',
    narrative: {
      opening: 'Trade secrets are being leaked to competitors. Multiple projects have been compromised.',
      twist: 'The trusted executive assistant was selling secrets.',
      conclusion: 'Access and opportunity allowed the assistant to steal valuable data.'
    },
    suspects: [
      {
        name: 'Kelly Morrison',
        age: 31,
        occupation: 'Executive Assistant',
        personality: 'Evasive',
        alibi: 'Says she only handles scheduling',
        isGuilty: true,
        suspicionLevel: 3
      },
      {
        name: 'Brian Cooper',
        age: 46,
        occupation: 'IT Director',
        personality: 'Defensive',
        alibi: 'Was upgrading security systems',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Angela Torres',
        age: 38,
        occupation: 'Project Manager',
        personality: 'Cooperative',
        alibi: 'Was leading team meetings',
        isGuilty: false,
        suspicionLevel: 2
      }
    ],
    evidence: [
      {
        type: 'Document Access Logs',
        description: 'Kelly accessed confidential files outside work hours',
        location: 'IT Department',
        critical: true
      },
      {
        type: 'Bank Records',
        description: 'Large deposits to Kelly\'s account from shell companies',
        location: 'Office',
        critical: true
      },
      {
        type: 'USB Drive',
        description: 'Encrypted files found in Kelly\'s desk',
        location: 'Office',
        critical: true
      },
      {
        type: 'Email Records',
        description: 'Kelly contacted competitor employees',
        location: 'IT Department',
        critical: true
      },
      {
        type: 'Security Footage',
        description: 'Kelly photographing documents with personal phone',
        location: 'Security Office',
        critical: true
      }
    ],
    hints: [
      { level: 1, text: 'Who has access to confidential meetings and documents?' },
      { level: 2, text: 'Check for unexplained income in employee records' },
      { level: 3, text: 'Executive assistants see everything that crosses their boss\'s desk' }
    ]
  },
  {
    id: 'perfect_alibi',
    title: 'The Perfect Alibi',
    difficulty: 5,
    crimeType: 'Murder',
    location: 'Penthouse',
    narrative: {
      opening: 'A murder with an unbreakable alibi... or is it? The suspect was live on a video call.',
      twist: 'The video call was pre-recorded and played back.',
      conclusion: 'Technology was used to create a perfect digital alibi.'
    },
    suspects: [
      {
        name: 'Nathan Cross',
        age: 41,
        occupation: 'Tech Entrepreneur',
        personality: 'Arrogant',
        alibi: 'Was on a live video conference during the murder',
        isGuilty: true,
        suspicionLevel: 1
      },
      {
        name: 'Jessica Harper',
        age: 36,
        occupation: 'Business Partner',
        personality: 'Calculating',
        alibi: 'Was at the gym with timestamped check-in',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Derek Walsh',
        age: 44,
        occupation: 'Private Investigator',
        personality: 'Defensive',
        alibi: 'Was following another case across town',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Claire Bennett',
        age: 39,
        occupation: 'Financial Advisor',
        personality: 'Nervous',
        alibi: 'Was at a client dinner with witnesses',
        isGuilty: false,
        suspicionLevel: 2
      }
    ],
    evidence: [
      {
        type: 'Video Analysis',
        description: 'Conference video shows subtle looping patterns',
        location: 'Lab',
        critical: true
      },
      {
        type: 'Network Logs',
        description: 'Pre-recorded file streamed from Nathan\'s home server',
        location: 'IT Department',
        critical: true
      },
      {
        type: 'Traffic Camera',
        description: 'Nathan\'s car near crime scene during supposed video call',
        location: 'Security Office',
        critical: true
      },
      {
        type: 'Financial Records',
        description: 'Victim was about to expose Nathan\'s fraud',
        location: 'Office',
        critical: true
      },
      {
        type: 'Expert Testimony',
        description: 'Video specialist confirms the footage was pre-recorded',
        location: 'Lab',
        critical: true
      },
      {
        type: 'Phone Records',
        description: 'Nathan searched "how to fake video calls" days before',
        location: 'IT Department',
        critical: true
      }
    ],
    hints: [
      { level: 1, text: 'Digital evidence can be manufactured by tech experts' },
      { level: 2, text: 'Analyze the video conference footage for inconsistencies' },
      { level: 3, text: 'A tech entrepreneur would know how to fake a video alibi' }
    ]
  },
  {
    id: 'seven_suspects',
    title: 'Seven Suspects',
    difficulty: 4,
    crimeType: 'Murder',
    location: 'Country Club',
    narrative: {
      opening: 'Seven people had opportunity. All have motives. A wealthy club member was poisoned at an exclusive event.',
      twist: 'The club manager arranged it to prevent being fired.',
      conclusion: 'The manager used their access to poison the victim\'s drink.'
    },
    suspects: [
      {
        name: 'Marcus Sterling',
        age: 47,
        occupation: 'Club Manager',
        personality: 'Nervous',
        alibi: 'Was overseeing the event',
        isGuilty: true,
        suspicionLevel: 3
      },
      {
        name: 'Olivia Chambers',
        age: 52,
        occupation: 'Business Rival',
        personality: 'Aggressive',
        alibi: 'Was giving a speech when poison took effect',
        isGuilty: false,
        suspicionLevel: 5
      },
      {
        name: 'Jonathan Pierce',
        age: 39,
        occupation: 'Lawyer',
        personality: 'Calculating',
        alibi: 'Was networking with other guests',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Sophia Laurent',
        age: 34,
        occupation: 'Ex-Wife',
        personality: 'Evasive',
        alibi: 'Was at the bar area',
        isGuilty: false,
        suspicionLevel: 5
      },
      {
        name: 'William Drake',
        age: 61,
        occupation: 'Investment Partner',
        personality: 'Defensive',
        alibi: 'Was on a phone call outside',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Emma Richardson',
        age: 28,
        occupation: 'Personal Assistant',
        personality: 'Cooperative',
        alibi: 'Was arranging documents',
        isGuilty: false,
        suspicionLevel: 2
      },
      {
        name: 'Thomas Gray',
        age: 55,
        occupation: 'Club Member',
        personality: 'Calm',
        alibi: 'Was playing cards with others',
        isGuilty: false,
        suspicionLevel: 3
      }
    ],
    evidence: [
      {
        type: 'Termination Letter',
        description: 'Victim was planning to fire Marcus',
        location: 'Office',
        critical: true
      },
      {
        type: 'Poison Bottle',
        description: 'Found hidden in Marcus\'s office',
        location: 'Office',
        critical: true
      },
      {
        type: 'Security Footage',
        description: 'Marcus near the victim\'s drink moments before poisoning',
        location: 'Security Office',
        critical: true
      },
      {
        type: 'Witness Testimony',
        description: 'Waiter saw Marcus touching the victim\'s glass',
        location: 'Country Club',
        critical: true
      },
      {
        type: 'Fingerprints',
        description: 'Marcus\'s prints on the victim\'s champagne glass',
        location: 'Crime Scene',
        critical: true
      }
    ],
    hints: [
      { level: 1, text: 'Among seven suspects, who had the most immediate threat?' },
      { level: 2, text: 'Who had access to everyone\'s food and drinks?' },
      { level: 3, text: 'The club manager was about to lose their job' }
    ]
  },
  {
    id: 'impossible_murder',
    title: 'The Impossible Murder',
    difficulty: 5,
    crimeType: 'Murder',
    location: 'Isolated Cabin',
    narrative: {
      opening: 'A locked cabin, no way in or out, and a dead body. The snow shows no footprints except the victim\'s.',
      twist: 'The victim was poisoned before arriving, delayed-action poison.',
      conclusion: 'The poison was administered earlier by someone who never went to the cabin.'
    },
    suspects: [
      {
        name: 'Dr. Amanda Foster',
        age: 45,
        occupation: 'Physician',
        personality: 'Calculating',
        alibi: 'Was at the hospital when death occurred',
        isGuilty: true,
        suspicionLevel: 2
      },
      {
        name: 'Robert Hayes',
        age: 50,
        occupation: 'Business Partner',
        personality: 'Defensive',
        alibi: 'Was in the city, provable by security cameras',
        isGuilty: false,
        suspicionLevel: 4
      },
      {
        name: 'Linda Chen',
        age: 38,
        occupation: 'Pharmacist',
        personality: 'Nervous',
        alibi: 'Was working at the pharmacy',
        isGuilty: false,
        suspicionLevel: 3
      },
      {
        name: 'Michael Turner',
        age: 42,
        occupation: 'Lawyer',
        personality: 'Calm',
        alibi: 'Was in court during time of death',
        isGuilty: false,
        suspicionLevel: 3
      }
    ],
    evidence: [
      {
        type: 'Toxicology Report',
        description: 'Rare delayed-action poison in victim\'s system',
        location: 'Lab',
        critical: true
      },
      {
        type: 'Medical Records',
        description: 'Dr. Foster prescribed victim "vitamins" the day before',
        location: 'Hospital',
        critical: true
      },
      {
        type: 'Pharmacy Records',
        description: 'Dr. Foster ordered the specific poison compound',
        location: 'Pharmacy',
        critical: true
      },
      {
        type: 'Last Will',
        description: 'Victim was Dr. Foster\'s wealthy patient, changing will',
        location: 'Office',
        critical: true
      },
      {
        type: 'Financial Records',
        description: 'Dr. Foster has massive medical malpractice lawsuit debts',
        location: 'Office',
        critical: true
      },
      {
        type: 'Expert Testimony',
        description: 'Poison expert confirms 24-hour delayed action',
        location: 'Lab',
        critical: true
      }
    ],
    hints: [
      { level: 1, text: 'If no one could reach the cabin, when was the victim poisoned?' },
      { level: 2, text: 'Some poisons have delayed effects' },
      { level: 3, text: 'A physician would know about delayed-action poisons' }
    ]
  }
];

export default HAND_CRAFTED_CASES;
