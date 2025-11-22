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
  },

  {
    id: 'digital_alibi',
    title: 'The Digital Alibi',
    difficulty: 7,
    crimeType: 'Murder',
    priority: 'URGENT',
    location: 'ByteStream Technologies Office',
    narrative: {
      opening: `Alex Rivera, a 32-year-old senior software engineer at ByteStream Technologies, was found dead in their apartment at 2:47 AM on Saturday morning. The cause of death: a lethal dose of prescription sleeping medication mixed with alcohol. What initially appeared to be suicide quickly unraveled when detectives discovered something impossible - Alex had been actively posting on social media, responding to messages, and even checking into locations hours after the medical examiner determined time of death to be between 11 PM and midnight on Friday.

The digital footprint was extensive: Instagram stories posted at 1:15 AM showing Alex at a downtown nightclub, Twitter replies at 12:30 AM engaging in a heated debate about code optimization, and a Slack message to a coworker at 1:45 AM discussing Monday's sprint planning. Friends reported receiving enthusiastic DMs about weekend plans as late as 2:00 AM. The apartment building's keycard system showed Alex's card being used to enter the building at 11:47 PM - matching the estimated time of death.

But the autopsy was clear: Alex Rivera died between 11:00 PM and 11:30 PM on Friday night, making every digital interaction afterward physically impossible. Someone had orchestrated an elaborate digital deception, using scheduled posts, automated messages, and stolen credentials to create the perfect alibi - not for themselves, but to muddy the timeline and create reasonable doubt.

ByteStream Technologies was a pressure cooker of ambition and rivalry. The company was weeks away from a $500 million acquisition, and Alex held crucial knowledge about a security vulnerability in their flagship product - information that could tank the deal if revealed. In the days before death, Alex had sent cryptic messages to colleagues hinting at "exposing the truth" and "doing the right thing, no matter the cost."

The investigation revealed a tangled web of relationships: a secret workplace romance turned sour, a partnership agreement that would make someone millions if Alex was out of the picture, mounting pressure to ship a product Alex believed was fundamentally flawed, and a discovery that someone had been embezzling funds - with Alex's digital forensics skills making them the only person capable of uncovering the trail.`,

      twist: `The killer used their expertise as a social media automation specialist to schedule all of Alex's post-mortem digital activity in advance, creating a false timeline. But the real revelation is darker: Alex discovered the embezzlement scheme and confronted the CFO, who panicked and committed murder. However, the CTO - Alex's ex-partner and rival - discovered what happened and helped cover it up in exchange for a larger share of the acquisition payout, making this a conspiracy between two suspects who barely tolerated each other.

The automated posts weren't just for alibis - they were designed to frame the Head of Security, who had publicly argued with Alex about the security vulnerability. The conspiracy almost worked perfectly, except for one detail: Alex's smartwatch, which stopped recording heartbeat data at 11:14 PM, contradicting the carefully constructed digital timeline.`,

      conclusion: `CFO Marcus Zhang killed Alex in a moment of panic when confronted about embezzling $2.3 million from company funds. CTO Rachel Kim discovered the murder when she arrived at Alex's apartment an hour later for a planned confrontation of her own about Alex threatening to expose the product vulnerability. Instead of reporting the crime, Rachel - desperate to secure her $15 million acquisition bonus - used her social media automation expertise to execute Alex's pre-scheduled posts and create additional ones, extending the digital alibi to cast suspicion on multiple people.

The case is solved through careful analysis of posting patterns (Rachel's distinctive use of automation tools), financial records (Marcus's hidden offshore accounts), and biometric data (the smartwatch evidence that couldn't be faked). The multiple solution element emerges from whether Rachel's actions constitute conspiracy to murder or accessory after the fact, and whether Alex's death could be argued as involuntary manslaughter rather than premeditated murder - questions that affect both suspects' legal outcomes.`
    },
    victim: {
      name: 'Alex Rivera',
      age: 32,
      occupation: 'Senior Software Engineer',
      background: 'Brilliant security researcher who discovered both a product vulnerability and an embezzlement scheme. Was planning to blow the whistle before the acquisition. Known for strong ethical principles and refusal to compromise on security issues.',
      personality: 'Principled idealist with tendency toward confrontation'
    },
    suspects: [
      {
        name: 'Marcus Zhang',
        age: 44,
        occupation: 'Chief Financial Officer',
        personality: 'Smooth-talking',
        motive: 'Financial Crime Cover-up',
        alibi: 'Claims he was at an investor dinner until 1 AM, multiple witnesses',
        isGuilty: true,
        backstory: 'Stanford MBA who joined ByteStream three years ago. Developed a gambling addiction after his divorce, leading to embezzlement. Alex discovered irregularities in expense reports and was piecing together the full scheme. Marcus panicked when confronted Friday evening.',
        secret: 'Embezzled $2.3 million over 18 months through fake vendor payments and expense fraud. Has massive debts to underground gambling operations.',
        attributes: {
          physical: { height: '5\'10"-6\'0"', build: 'Medium build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'B+', handedness: 'Right', shoeSize: 10, hasGlasses: true },
          behavioral: { phoneArea: '650', voiceQuality: 'Smooth and calm', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'Rachel Kim',
        age: 35,
        occupation: 'Chief Technology Officer',
        personality: 'Cold',
        motive: 'Acquisition Bonus Protection',
        alibi: 'Working late at office, badge logs show presence until midnight',
        isGuilty: true,
        backstory: 'Former MIT researcher and Alex\'s ex-girlfriend from grad school. Their relationship ended badly when Rachel chose career over ethics. Stood to make $15 million from acquisition, but Alex threatened to expose critical security vulnerability in flagship product. Became accessory to murder by helping Marcus cover up the crime.',
        secret: 'Arrived at Alex\'s apartment at 12:15 AM to threaten them into silence, found them dead, and helped Marcus cover it up. Created the elaborate social media automation scheme.',
        attributes: {
          physical: { height: '5\'6"-5\'9"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Dark brown', bloodType: 'A+', handedness: 'Right', shoeSize: 8, hasGlasses: false },
          behavioral: { phoneArea: '415', voiceQuality: 'Crisp and precise', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Devon Taylor',
        age: 29,
        occupation: 'Head of Security',
        personality: 'Aggressive',
        motive: 'Professional Conflict',
        alibi: 'At home streaming on Twitch, viewers confirm presence',
        isGuilty: false,
        backstory: 'Self-taught hacker turned security chief. Had explosive arguments with Alex about the security vulnerability - Devon wanted to ship anyway, Alex refused. Made public threats in Slack channels about "dealing with obstacles." Being framed by the real killers.',
        secret: 'Was planning to resign and report the vulnerability to the SEC, but feared being seen as a whistleblower would ruin career.',
        attributes: {
          physical: { height: '6\'1"-6\'4"', build: 'Athletic build', hairColor: 'Red', eyeColor: 'Green', bloodType: 'O-', handedness: 'Left', shoeSize: 12, hasGlasses: false },
          behavioral: { phoneArea: '510', voiceQuality: 'Loud and aggressive', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Jasmine Patel',
        age: 27,
        occupation: 'Social Media Manager',
        personality: 'Bubbly',
        motive: 'Romantic Jealousy',
        alibi: 'At downtown nightclub The Vertex, posted Instagram stories',
        isGuilty: false,
        backstory: 'Marketing specialist who was secretly dating Alex for three months. Alex ended the relationship on Thursday, saying they needed to "focus on doing the right thing." Jasmine felt betrayed and posted bitter subtweets. Her social media expertise makes her an obvious suspect.',
        secret: 'Was pregnant with Alex\'s child and hadn\'t told them yet. Devastated by the breakup and subsequent death.',
        attributes: {
          physical: { height: '5\'4"-5\'7"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'AB+', handedness: 'Right', shoeSize: 7, hasGlasses: false },
          behavioral: { phoneArea: '408', voiceQuality: 'High-pitched', shoeType: 'Heels', smokingHabit: false }
        }
      },
      {
        name: 'Tyler Chen',
        age: 30,
        occupation: 'Product Manager',
        personality: 'Nervous',
        motive: 'Career Pressure',
        alibi: 'Working late preparing acquisition presentation, office cameras confirm',
        isGuilty: false,
        backstory: 'Rising star whose entire career depends on acquisition success. Alex\'s threat to reveal the vulnerability would destroy everything Tyler built. Had heated exchange with Alex on Friday morning about "loyalty to the team."',
        secret: 'Knew about the vulnerability for weeks but buried the reports. Could face criminal liability for knowingly shipping compromised software.',
        attributes: {
          physical: { height: '5\'8"-5\'11"', build: 'Slim build', hairColor: 'Dark brown', eyeColor: 'Brown', bloodType: 'O+', handedness: 'Right', shoeSize: 9, hasGlasses: true },
          behavioral: { phoneArea: '650', voiceQuality: 'Soft-spoken', shoeType: 'Loafers', smokingHabit: false }
        }
      },
      {
        name: 'Samantha Brooks',
        age: 38,
        occupation: 'VP of Engineering',
        personality: 'Authoritative',
        motive: 'Acquisition Protection',
        alibi: 'Video call with acquisition team until 11:30 PM, call logs verify',
        isGuilty: false,
        backstory: 'Veteran engineer who would become CTO of merged company post-acquisition. Pressured Alex to stay quiet about vulnerability, offering promotion and raise. When Alex refused, sent threatening email about "career suicide."',
        secret: 'Has been having affair with the acquiring company\'s CEO, giving her inside information about the deal.',
        attributes: {
          physical: { height: '5\'9"-6\'0"', build: 'Athletic build', hairColor: 'Blonde', eyeColor: 'Blue', bloodType: 'A-', handedness: 'Right', shoeSize: 9, hasGlasses: false },
          behavioral: { phoneArea: '415', voiceQuality: 'Deep and authoritative', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'Kevin Zhao',
        age: 26,
        occupation: 'Junior Developer',
        personality: 'Eager',
        motive: 'Partnership Greed',
        alibi: 'At karaoke bar with friends, social media posts confirm location',
        isGuilty: false,
        backstory: 'Alex\'s junior partner in a side consulting business. They had agreement: if one partner left or died, the other inherited full ownership. Business was being courted by major client worth $3 million annually.',
        secret: 'Forged Alex\'s signature on revised partnership agreement three weeks ago, increasing his share. Would inherit everything with Alex\'s death.',
        attributes: {
          physical: { height: '5\'6"-5\'9"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Dark brown', bloodType: 'B-', handedness: 'Right', shoeSize: 8, hasGlasses: true },
          behavioral: { phoneArea: '408', voiceQuality: 'Eager and fast-paced', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Dr. Alicia Freeman',
        age: 41,
        occupation: 'Chief Medical Officer (Employee Wellness)',
        personality: 'Caring',
        motive: 'False Lead',
        alibi: 'Home with spouse, spouse confirms',
        isGuilty: false,
        backstory: 'Licensed psychiatrist who managed employee mental health program. Had been treating Alex for anxiety and depression, prescribed the sleeping medication found in victim\'s system. Worried about malpractice liability.',
        secret: 'Alex confided about discovering embezzlement and vulnerability during therapy session. Doctor-patient privilege prevents her from reporting it, creating ethical nightmare.',
        attributes: {
          physical: { height: '5\'7"-5\'10"', build: 'Medium build', hairColor: 'Light brown', eyeColor: 'Hazel', bloodType: 'O+', handedness: 'Right', shoeSize: 8, hasGlasses: true },
          behavioral: { phoneArea: '650', voiceQuality: 'Calm and soothing', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'Nathan Pierce',
        age: 33,
        occupation: 'DevOps Engineer',
        personality: 'Paranoid',
        motive: 'System Access',
        alibi: 'On-call for production issues, handled server alert at 11:45 PM from home',
        isGuilty: false,
        backstory: 'Infrastructure specialist with root access to all systems. Alex accused him of sloppy security practices that enabled the vulnerability. Nathan felt scapegoated and sent angry messages about "people who don\'t understand real engineering."',
        secret: 'Accidentally created the security vulnerability through misconfigured deployment script. Has been desperately trying to fix it without anyone noticing.',
        attributes: {
          physical: { height: '5\'9"-6\'1"', build: 'Heavy build', hairColor: 'Brown', eyeColor: 'Blue', bloodType: 'A+', handedness: 'Left', shoeSize: 10, hasGlasses: true },
          behavioral: { phoneArea: '510', voiceQuality: 'Monotone', shoeType: 'Boots', smokingHabit: true }
        }
      },
      {
        name: 'Maya Hernandez',
        age: 28,
        occupation: 'Data Scientist',
        personality: 'Analytical',
        motive: 'Workplace Romance',
        alibi: 'Working late on ML model training, server logs confirm activity',
        isGuilty: false,
        backstory: 'Brilliant analyst who was close friends with Alex. Secretly in love with them, devastated when Alex started dating Jasmine. Wrote emotional late-night emails to Alex that could be misinterpreted as threatening.',
        secret: 'Created fake dating profile posing as potential romantic interest to get information about Alex\'s relationship with Jasmine. Digital stalking that looks suspicious.',
        attributes: {
          physical: { height: '5\'5"-5\'8"', build: 'Athletic build', hairColor: 'Dark brown', eyeColor: 'Brown', bloodType: 'O-', handedness: 'Right', shoeSize: 7, hasGlasses: false },
          behavioral: { phoneArea: '415', voiceQuality: 'Soft-spoken', shoeType: 'Sneakers', smokingHabit: false }
        }
      }
    ],
    evidence: [
      {
        type: 'Biometric Data',
        description: 'Alex\'s Apple Watch stopped recording heartbeat at 11:14 PM on Friday. Last recorded activity: elevated heart rate consistent with confrontation or stress.',
        location: 'Victim\'s Apartment',
        critical: true,
        connectedSuspect: 'Marcus Zhang'
      },
      {
        type: 'Social Media Activity',
        description: 'Instagram stories posted at 1:15 AM showing nightclub scene. Metadata analysis reveals posts were scheduled using Buffer automation tool at 8:47 PM Friday - before death.',
        location: 'Digital Forensics Lab',
        critical: true,
        connectedSuspect: 'Rachel Kim'
      },
      {
        type: 'Financial Documents',
        description: 'Marcus Zhang embezzled $2.3 million through 47 fake vendor invoices. Alex\'s personal notes show detailed analysis of the scheme dated Thursday.',
        location: 'Company Server',
        critical: true,
        connectedSuspect: 'Marcus Zhang'
      },
      {
        type: 'Security Footage',
        description: 'Building camera shows Marcus entering at 10:52 PM using emergency stairwell (no keycard required). He exits at 11:38 PM, visibly distressed.',
        location: 'Building Security',
        critical: true,
        connectedSuspect: 'Marcus Zhang'
      },
      {
        type: 'Digital Forensics',
        description: 'Rachel Kim\'s laptop contains IFTTT and Zapier automation scripts scheduling social media posts for Alex\'s accounts. Created at 12:23 AM Saturday.',
        location: 'Rachel\'s Devices',
        critical: true,
        connectedSuspect: 'Rachel Kim'
      },
      {
        type: 'Phone Records',
        description: 'Rachel called Marcus 7 times between 12:15 AM and 12:45 AM Saturday. Call duration suggests extensive conversation and planning.',
        location: 'Cell Tower Data',
        critical: true,
        connectedSuspect: 'Rachel Kim'
      },
      {
        type: 'Text Messages',
        description: 'Alex sent message to Marcus at 10:35 PM: "I have all the evidence. We need to talk NOW. Come to my apartment." Marcus replied: "On my way."',
        location: 'Victim\'s Phone',
        critical: true,
        connectedSuspect: 'Marcus Zhang'
      },
      {
        type: 'Toxicology Report',
        description: 'Lethal combination of Zolpidem (sleeping pills) and alcohol. Concentration suggests pills were crushed and mixed into drink between 10:45-11:15 PM.',
        location: 'Medical Examiner',
        critical: true,
        connectedSuspect: 'Marcus Zhang'
      },
      {
        type: 'Fingerprints',
        description: 'Marcus\'s fingerprints found on victim\'s whiskey bottle and glass. Smudged prints suggest wiping attempt that missed the neck of the bottle.',
        location: 'Victim\'s Apartment',
        critical: true,
        connectedSuspect: 'Marcus Zhang'
      },
      {
        type: 'Email Records',
        description: 'Rachel sent email to acquisition team at 2:47 AM assuring them "the security concerns have been resolved and won\'t be an issue." Timestamp 3 hours after discovering body.',
        location: 'Email Server',
        critical: true,
        connectedSuspect: 'Rachel Kim'
      },
      {
        type: 'Witness Testimony',
        description: 'Neighbor heard loud argument at 11:05 PM. Male voice saying "You\'re ruining everything!" and sounds of struggle.',
        location: 'Building Interviews',
        critical: false,
        connectedSuspect: 'Marcus Zhang'
      },
      {
        type: 'Keycard Logs',
        description: 'Rachel Kim\'s keycard accessed Alex\'s building at 12:11 AM Saturday - hour after estimated death. She has emergency access as CTO.',
        location: 'Building Security',
        critical: false,
        connectedSuspect: 'Rachel Kim'
      },
      {
        type: 'Slack Messages',
        description: 'Devon Taylor posted in public channel at 4:32 PM Friday: "If Alex tanks this deal, they\'ll regret it. Some people need to learn when to shut up." Looks threatening but is red herring.',
        location: 'Company Slack',
        critical: false,
        connectedSuspect: 'Devon Taylor'
      },
      {
        type: 'Social Media Activity',
        description: 'Jasmine Patel posted cryptic Instagram story at 9:18 PM Friday: "Some people deserve what\'s coming to them 💔🔪" Posted from The Vertex nightclub.',
        location: 'Instagram',
        critical: false,
        connectedSuspect: 'Jasmine Patel'
      },
      {
        type: 'Financial Documents',
        description: 'Kevin Zhao forged partnership agreement revision. Handwriting analysis confirms forgery. If discovered, provides strong motive but he has solid alibi.',
        location: 'Partnership Files',
        critical: false,
        connectedSuspect: 'Kevin Zhao'
      },
      {
        type: 'Email Records',
        description: 'Tyler Chen sent email to Rachel at 3:17 PM Friday: "We need to handle the Alex situation before it destroys everything we\'ve built."',
        location: 'Email Server',
        critical: false,
        connectedSuspect: 'Tyler Chen'
      },
      {
        type: 'Prescription Records',
        description: 'Dr. Freeman prescribed Zolpidem to Alex three weeks ago. Pharmacy records show Alex filled prescription but bottle found in apartment was nearly full.',
        location: 'Medical Records',
        critical: false,
        connectedSuspect: 'Dr. Alicia Freeman'
      },
      {
        type: 'Server Logs',
        description: 'Nathan Pierce\'s admin account accessed production database at 11:47 PM to resolve server alert. Legitimate work activity provides partial alibi.',
        location: 'IT Infrastructure',
        critical: false,
        connectedSuspect: 'Nathan Pierce'
      },
      {
        type: 'Dating App Data',
        description: 'Fake profile created by Maya Hernandez messaged Alex 43 times. Digital forensics trace profile back to Maya\'s IP address.',
        location: 'Digital Forensics',
        critical: false,
        connectedSuspect: 'Maya Hernandez'
      },
      {
        type: 'DNA Sample',
        description: 'Rachel Kim\'s DNA (A+ blood type, black hair) found in Alex\'s apartment on coffee mug. She claims she visited earlier in week for work discussion.',
        location: 'Victim\'s Apartment',
        critical: false,
        connectedSuspect: 'Rachel Kim'
      }
    ],
    hints: {
      subtle: 'The digital activity after death seems too perfect. Look for patterns in social media automation and check the victim\'s biometric data for the real time of death.',
      moderate: 'The smartwatch stopped at 11:14 PM, but posts continued until 2 AM. Someone with social media automation expertise created scheduled posts. Also check who had motive to be at the apartment late Friday night.',
      major: 'Marcus Zhang embezzled millions and was confronted by Alex at 10:35 PM. Security footage shows him entering at 10:52 PM and leaving distressed at 11:38 PM. Rachel Kim arrived at 12:11 AM and used automation tools to create false digital timeline. Check their phone records for conspiracy evidence.'
    }
  },

  {
    id: 'locked_room',
    title: 'The Locked Room',
    difficulty: 8,
    crimeType: 'Murder',
    priority: 'URGENT',
    location: 'The Grandview Hotel - Room 1408',
    narrative: {
      opening: `The Grandview Hotel's fourteenth floor became a crime scene on a stormy November evening when renowned mystery novelist Victor Ashford was discovered dead in Room 1408. The circumstances were impossible - a classic locked room mystery that would have been worthy of one of his own novels.

Victor Ashford, 61, was found at 9:47 PM by hotel security after guests in adjacent rooms reported hearing a gunshot at approximately 9:15 PM. When security arrived, they found Room 1408 locked from the inside with both the deadbolt and chain engaged. The balcony door was also locked from within, fourteen stories above the ground with no fire escape or ledge access. The windows were sealed shut, typical of modern high-rise hotels.

Breaking down the door revealed a scene of calculated murder: Victor sat slumped in the desk chair, a single gunshot wound to his chest. The gun - a .38 revolver registered to the victim - lay on the floor three feet from his right hand. Time of death was estimated at 9:13-9:17 PM based on witness testimony of the gunshot and body temperature. The room was in pristine condition with no signs of struggle.

Here's where physics defies logic: The door was locked from inside with a chain lock that requires manual engagement from within the room. The balcony was locked with a sliding bolt mechanism, also interior-only. No secret passages existed in the walls (hotel blueprints confirmed and thermal imaging verified). The ventilation ducts were far too small for human passage. The ceiling was solid concrete with no access panels. Room service had delivered dinner at 8:45 PM, and the server confirmed Victor was alive, alone, and locked the door behind them.

Eight people had motive, means, and were present in the hotel that evening. The victim's laptop revealed he was writing a tell-all memoir that would expose dark secrets about several people in his life. Draft chapters found on his computer painted damning portraits: a former business partner he'd swindled, an ex-wife who'd been abused, a literary rival he'd plagiarized from, a former assistant he'd sexually harassed, and family members he planned to disinherit.

The investigation uncovered bitter feuds and recent confrontations. Victor had been threatened multiple times in the weeks before his death. He'd checked into the Grandview under a pseudonym, suggesting he feared for his safety. Yet somehow, someone managed to shoot him in a room locked from the inside and vanish like a ghost.

The physical evidence raised more questions than answers: gunshot residue on the victim's right hand (suggesting he fired the weapon), but the trajectory of the bullet suggested the shooter stood at the doorway, not at point-blank range. A half-empty glass of whiskey on the desk tested positive for sedatives, but not enough to render someone unconscious. The room key card records showed only Victor's entry at 6:32 PM and the security override at 9:47 PM - no one else entered.`,

      twist: `The murder happened elsewhere - specifically in Room 1410, directly next door. The killer shot Victor in their own room, then used a connecting door between the suites (a feature in this vintage hotel that had been plastered over but not properly sealed) to drag the body into Room 1408. They staged the scene to look like suicide-turned-murder, then exited through their own room.

The brilliant deception: The killer knew the hotel's layout from blueprints stolen from the planning department. They booked Room 1410 specifically for the connecting door. They plastered over their side of the door after the murder and before police searched their room. The "locked from inside" impossibility was theater - Victor was already dead before being placed in 1408.

The gunshot residue on Victor's hand came from forcing him to hold the gun moments before death (he was sedated but conscious). The time discrepancy works because witnesses heard the shot at 9:15 PM, but Victor was actually killed at 8:52 PM in Room 1410 - the 9:15 PM "shot" was the killer firing a blank through a pillow in 1408 to establish the timeline while Victor's body was already positioned.`,

      conclusion: `Literary agent Caroline Frost in Room 1410 killed Victor Ashford. She had discovered that Victor's memoir revealed how she'd been embezzling from him for eight years - $1.4 million total. Exposure would mean prison and the destruction of her career representing some of the biggest names in publishing.

Caroline checked into Room 1410 two days earlier under a false name, researched the hotel's old connecting doors through historical records, and planned meticulously. She invited Victor to her room at 8:45 PM under the pretense of discussing the memoir. She'd drugged his whiskey with sedatives from her prescription anxiety medication. When he was groggy, she forced the gun into his hand, fired a shot into a pillow (creating the residue), then shot him in the chest.

She dragged his body through the old connecting door into Room 1408, staged the suicide scene, locked his room from inside using the chain and bolt, then returned through the connecting passage. She immediately plastered over the door on her side with materials she'd prepared in advance. At 9:15 PM, she fired a blank cartridge through a pillow in her room to establish the "time of death" while Victor had been dead for 23 minutes.

The case is solved through discovering: (1) Fresh plaster on the wall of Room 1410 matching the paint in 1408, (2) Carpet fibers from 1410 found under Victor's shoes, (3) Timeline analysis showing room service delivered to 1408 but Victor's stomach contents included food only available from 1410's room service order, (4) Financial forensics revealing Caroline's embezzlement scheme, and (5) The blank cartridge found in 1410's trash.`
    },
    victim: {
      name: 'Victor Ashford',
      age: 61,
      occupation: 'Mystery Novelist',
      background: 'Award-winning author of 23 detective novels. Wealthy but morally bankrupt - history of betraying friends, family, and colleagues. Was writing explosive memoir that would ruin multiple lives. Checked into hotel under pseudonym "Robert Crane."',
      personality: 'Manipulative narcissist with cruel streak'
    },
    suspects: [
      {
        name: 'Caroline Frost',
        age: 43,
        occupation: 'Literary Agent',
        personality: 'Composed',
        motive: 'Embezzlement Cover-up',
        alibi: 'Claims she was in her room (1410) on a business call during the shooting',
        isGuilty: true,
        backstory: 'Victor\'s agent for 15 years. Embezzled $1.4 million by inflating expenses and skimming royalties. Victor discovered the scheme and documented it in his memoir. She would face prison and career destruction.',
        secret: 'Meticulously planned the murder using knowledge of hotel\'s historical architecture. Booked Room 1410 specifically for the concealed connecting door.',
        attributes: {
          physical: { height: '5\'7"-5\'10"', build: 'Slim build', hairColor: 'Auburn', eyeColor: 'Green', bloodType: 'A-', handedness: 'Right', shoeSize: 9, hasGlasses: false },
          behavioral: { phoneArea: '212', voiceQuality: 'Smooth and professional', shoeType: 'Heels', smokingHabit: false }
        }
      },
      {
        name: 'Richard Ashford',
        age: 35,
        occupation: 'Investment Banker',
        personality: 'Bitter',
        motive: 'Inheritance',
        alibi: 'In hotel bar from 8:30 PM to 10:00 PM, bartender confirms',
        isGuilty: false,
        backstory: 'Victor\'s estranged son. Victor was planning to disinherit him in favor of a literary foundation. They had explosive argument in lobby at 7:15 PM where Richard threatened "you\'ll regret this."',
        secret: 'Massive gambling debts totaling $800,000. Desperate for inheritance money to pay off loan sharks.',
        attributes: {
          physical: { height: '6\'0"-6\'3"', build: 'Athletic build', hairColor: 'Dark brown', eyeColor: 'Blue', bloodType: 'O+', handedness: 'Right', shoeSize: 11, hasGlasses: false },
          behavioral: { phoneArea: '917', voiceQuality: 'Sharp and clipped', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'Miranda Chen',
        age: 39,
        occupation: 'Novelist',
        personality: 'Anxious',
        motive: 'Plagiarism Exposure',
        alibi: 'Writing in hotel lobby café, security footage confirms presence',
        isGuilty: false,
        backstory: 'Award-winning mystery author and Victor\'s rival. Victor\'s memoir would reveal that his breakthrough novel "The Crimson Thread" was plagiarized from her unpublished manuscript he\'d read as a contest judge.',
        secret: 'Contemplated murder seriously, wrote detailed notes on how to do it (found in her room), but didn\'t go through with it.',
        attributes: {
          physical: { height: '5\'4"-5\'7"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Dark brown', bloodType: 'B+', handedness: 'Right', shoeSize: 7, hasGlasses: true },
          behavioral: { phoneArea: '415', voiceQuality: 'Soft and hesitant', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Diane Ashford-Martinez',
        age: 58,
        occupation: 'Real Estate Developer',
        personality: 'Cold',
        motive: 'Abuse Exposure',
        alibi: 'Business dinner with clients at hotel restaurant until 9:45 PM',
        isGuilty: false,
        backstory: 'Victor\'s ex-wife from a 12-year marriage. The memoir detailed years of emotional and physical abuse she\'d kept hidden to protect her reputation and children. Public revelation would destroy her carefully constructed image.',
        secret: 'Hired a private investigator to follow Victor and gather blackmail material, but investigator reported back the same evening Victor died.',
        attributes: {
          physical: { height: '5\'8"-5\'11"', build: 'Medium build', hairColor: 'Blonde (dyed)', eyeColor: 'Blue', bloodType: 'A+', handedness: 'Right', shoeSize: 9, hasGlasses: false },
          behavioral: { phoneArea: '310', voiceQuality: 'Crisp and commanding', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'James Porter',
        age: 67,
        occupation: 'Retired Business Partner',
        personality: 'Aggressive',
        motive: 'Business Betrayal',
        alibi: 'In his room (1422) watching pay-per-view, transaction records confirm',
        isGuilty: false,
        backstory: 'Co-founded publishing company with Victor 30 years ago. Victor forced him out through legal manipulation, stealing his 50% stake. The memoir would detail the fraud, but James has bigger secret - he\'s been planning to sue anyway.',
        secret: 'Confronted Victor in hallway at 8:20 PM. Argument became physical with shoving. Feared being accused of murder when Victor died shortly after.',
        attributes: {
          physical: { height: '5\'10"-6\'1"', build: 'Heavy build', hairColor: 'Gray', eyeColor: 'Brown', bloodType: 'AB+', handedness: 'Right', shoeSize: 11, hasGlasses: true },
          behavioral: { phoneArea: '617', voiceQuality: 'Loud and gruff', shoeType: 'Loafers', smokingHabit: true }
        }
      },
      {
        name: 'Sophia Reeves',
        age: 28,
        occupation: 'Aspiring Writer / Former Assistant',
        personality: 'Nervous',
        motive: 'Sexual Harassment',
        alibi: 'At movie theater three blocks away, ticket stub and phone GPS confirm',
        isGuilty: false,
        backstory: 'Victor\'s assistant for two years until she quit six months ago. The memoir portrayed their relationship as consensual affair - the truth was systematic sexual harassment and coercion. She feared the lies would destroy her credibility in the #MeToo era.',
        secret: 'Sent anonymous threatening emails to Victor from library computers warning him not to publish the memoir.',
        attributes: {
          physical: { height: '5\'5"-5\'8"', build: 'Slim build', hairColor: 'Light brown', eyeColor: 'Hazel', bloodType: 'O-', handedness: 'Left', shoeSize: 8, hasGlasses: false },
          behavioral: { phoneArea: '646', voiceQuality: 'Quiet and shaky', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Thomas Blackwell',
        age: 52,
        occupation: 'Hotel Security Chief',
        personality: 'Professional',
        motive: 'False Lead',
        alibi: 'On duty in security office, multiple witnesses',
        isGuilty: false,
        backstory: 'Former police detective who maintains hotel security. Discovered the body and managed the crime scene. His professional competence makes him seem suspicious to some, but he\'s trying to solve the case.',
        secret: 'Recognized Victor despite the pseudonym and informed Caroline Frost the famous author was staying in the hotel - inadvertently enabling her murder plan.',
        attributes: {
          physical: { height: '6\'1"-6\'4"', build: 'Athletic build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'B-', handedness: 'Right', shoeSize: 12, hasGlasses: false },
          behavioral: { phoneArea: '202', voiceQuality: 'Deep and authoritative', shoeType: 'Boots', smokingHabit: false }
        }
      },
      {
        name: 'Elena Volkov',
        age: 45,
        occupation: 'Documentary Filmmaker',
        personality: 'Intense',
        motive: 'Story Rights',
        alibi: 'Filming B-roll in hotel lobby and common areas, footage timestamps confirm',
        isGuilty: false,
        backstory: 'Making documentary about mystery writers. Was negotiating with Victor for exclusive rights to adapt his memoir. Argument that afternoon when Victor demanded $2 million - more than her entire budget.',
        secret: 'Had hidden camera in hotel hallway to capture candid footage of Victor. Camera recorded part of the evening but mysteriously stopped working at 9:10 PM.',
        attributes: {
          physical: { height: '5\'9"-6\'0"', build: 'Medium build', hairColor: 'Blonde', eyeColor: 'Blue', bloodType: 'A+', handedness: 'Right', shoeSize: 9, hasGlasses: true },
          behavioral: { phoneArea: '323', voiceQuality: 'Accented (Russian)', shoeType: 'Boots', smokingHabit: true }
        }
      }
    ],
    evidence: [
      {
        type: 'Building Blueprints',
        description: 'Historical hotel plans from 1924 show connecting doors between rooms 1408 and 1410. Modern blueprints show them "sealed," but construction records are incomplete.',
        location: 'City Planning Department',
        critical: true,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Wall Analysis',
        description: 'Fresh plaster found on east wall of Room 1410. Chemical composition matches paint used in Room 1408. Applied within last 24 hours.',
        location: 'Room 1410',
        critical: true,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Fiber Analysis',
        description: 'Carpet fibers from Room 1410 found on victim\'s shoes. Victim never checked into or had legitimate reason to be in that room.',
        location: 'Forensics Lab',
        critical: true,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Financial Documents',
        description: 'Caroline Frost embezzled $1.4 million over 8 years through false expense reports and royalty skimming. Victim\'s memoir draft exposed the complete scheme with bank records.',
        location: 'Victim\'s Laptop',
        critical: true,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Room Service Records',
        description: 'Room 1408 ordered chicken dinner at 8:30 PM. Room 1410 ordered steak dinner at 8:25 PM. Victim\'s stomach contents show steak, not chicken.',
        location: 'Hotel Records / Autopsy',
        critical: true,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Ballistics',
        description: 'Blank cartridge casing found in Room 1410 trash. Same caliber as murder weapon. Fired recently based on powder residue.',
        location: 'Room 1410',
        critical: true,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Phone Records',
        description: 'Caroline Frost called building supply store at 2:47 PM asking about quick-dry plaster. Purchase confirmed on her credit card at 3:15 PM.',
        location: 'Phone Company / Credit Card',
        critical: true,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Hotel Key Card Logs',
        description: 'Room 1410 accessed by guest "Sarah Williams" (fake name) at 8:42 PM and not again until 10:23 PM. Caroline checked in under this alias.',
        location: 'Hotel Security System',
        critical: true,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Gunshot Residue',
        description: 'Residue on victim\'s right hand but distribution pattern suggests hand was wrapped around gun by external force, not natural grip.',
        location: 'Forensics Lab',
        critical: true,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Toxicology Report',
        description: 'Sedatives (Lorazepam) in victim\'s blood. Same medication prescribed to Caroline Frost for anxiety. Concentration suggests dose given 30-45 minutes before death.',
        location: 'Medical Examiner',
        critical: true,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Witness Testimony',
        description: 'Guest in Room 1412 heard muffled argument from 1410 at approximately 8:50 PM, then a "pop" sound. Dismissed it as TV.',
        location: 'Guest Interviews',
        critical: false,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Security Footage',
        description: 'Richard Ashford had heated argument with victim in lobby at 7:15 PM. Shouted "You\'ll regret cutting me out!" Makes him obvious suspect.',
        location: 'Hotel Cameras',
        critical: false,
        connectedSuspect: 'Richard Ashford'
      },
      {
        type: 'Financial Documents',
        description: 'Richard owes $800,000 to multiple creditors and offshore gambling sites. Stood to inherit $4.2 million.',
        location: 'Bank Records',
        critical: false,
        connectedSuspect: 'Richard Ashford'
      },
      {
        type: 'Notebook',
        description: 'Miranda Chen\'s journal contains detailed notes on "how to commit the perfect locked room murder" with specific references to the Grandview Hotel layout.',
        location: 'Miranda\'s Room',
        critical: false,
        connectedSuspect: 'Miranda Chen'
      },
      {
        type: 'Email Records',
        description: 'Threatening anonymous emails sent to Victor from public library computers. IP trace leads to library where Sophia Reeves was recorded on security cameras.',
        location: 'Email Server / Library',
        critical: false,
        connectedSuspect: 'Sophia Reeves'
      },
      {
        type: 'Witness Testimony',
        description: 'Hotel staff saw James Porter and Victor in physical altercation in hallway at 8:20 PM. Porter grabbed Victor by collar.',
        location: 'Staff Interviews',
        critical: false,
        connectedSuspect: 'James Porter'
      },
      {
        type: 'Video Footage',
        description: 'Elena Volkov\'s hidden hallway camera stopped recording at 9:10 PM. She claims battery died, but forensics show device was manually disabled.',
        location: 'Elena\'s Equipment',
        critical: false,
        connectedSuspect: 'Elena Volkov'
      },
      {
        type: 'Phone Records',
        description: 'Thomas Blackwell called Caroline Frost at 6:52 PM to inform her Victor Ashford was staying in the hotel. Call lasted 3 minutes.',
        location: 'Phone Company',
        critical: false,
        connectedSuspect: 'Caroline Frost'
      },
      {
        type: 'Blood Type',
        description: 'Small blood smear on connecting door frame in Room 1410 (hidden under fresh plaster). Type A-, matching victim.',
        location: 'Room 1410',
        critical: false,
        connectedSuspect: 'Caroline Frost'
      }
    ],
    hints: {
      subtle: 'The locked room is impossible only if the murder happened inside Room 1408. Consider the hotel\'s architecture and history. What if the body was moved from elsewhere?',
      moderate: 'Check stomach contents against room service records - why would the victim eat food not delivered to their room? Also examine the walls between rooms for evidence of recent construction work.',
      major: 'Fresh plaster in Room 1410 conceals old connecting door. Victim\'s stomach had steak from 1410\'s room service, not chicken from 1408. Caroline Frost bought quick-dry plaster hours before murder and has $1.4M embezzlement motive. Blank cartridge in her room fired at 9:15 PM to fake timeline.'
    }
  },

  {
    id: 'insurance_fraud',
    title: 'The Insurance Fraud',
    difficulty: 6,
    crimeType: 'Fraud',
    priority: 'HIGH',
    location: 'Pacific Coast Highway & Blackstone Industries',
    narrative: {
      opening: `The charred remains of a luxury vehicle were discovered at the bottom of Devil's Curve on Pacific Coast Highway at 3:42 AM on a foggy Tuesday morning. Inside the wreckage, burned beyond recognition, was a body that dental records would later identify as Jonathan Blackstone, 52-year-old CEO of Blackstone Industries - a manufacturing empire worth $340 million.

The initial investigation suggested a tragic accident: Jonathan had been driving home from a late business dinner when he apparently lost control on the notoriously dangerous curve, crashed through the guardrail, and plummeted 200 feet down the cliff face. The vehicle exploded on impact. The scene was consistent with countless accidents that had occurred at that location over the years.

But insurance investigator Sarah Chen wasn't convinced. Jonathan had taken out a massive life insurance policy just six months earlier - $25 million, with double indemnity for accidental death, bringing the payout to $50 million. The beneficiaries were his wife Katherine, his business partner Marcus Wei, and a trust fund for his daughter Emily. The timing was suspicious.

As Chen dug deeper, the carefully constructed accident began to unravel. The financial picture of Jonathan Blackstone revealed a man drowning in debt despite his apparent wealth. Blackstone Industries was hemorrhaging money - $18 million in losses over the past two years, hidden through creative accounting. Jonathan personally owed $6.3 million to various creditors, including $2 million to some very dangerous people with connections to organized crime.

But here's where it gets complicated: Jonathan wasn't just in financial trouble. He was also being investigated by the SEC for securities fraud, facing a lawsuit from his former CFO for wrongful termination and defamation, and his company was about to be exposed for environmental violations that would cost $40 million in fines. His marriage was collapsing - Katherine had hired a divorce attorney and was planning to file for an ironclad prenup that would give her 60% of marital assets.

The autopsy revealed irregularities that raised more red flags. The body's height was within range but at the lower end for Jonathan's recorded height. The dental records matched, but Jonathan's dentist had mysteriously closed his practice and left the country two weeks after the accident. The body showed no carbon monoxide in the blood - meaning the victim was likely dead before the fire started. Tissue samples suggested the body had been frozen and thawed, with cell degradation consistent with at least two weeks of freezing.

Then came the bombshell: Three weeks after the "accident," a bank teller in the Cayman Islands reported a man matching Jonathan Blackstone's description attempting to access an offshore account using credentials only Jonathan would know. The attempt failed due to additional security measures, but it raised an impossible question - was Jonathan Blackstone actually dead, or did he fake his own death and frame someone else for murder?

The investigation revealed multiple suspects with motive to kill Jonathan - and potential accomplices if this was indeed an elaborate fraud scheme. The question became: Is this a murder disguised as an accident, an insurance fraud conspiracy, or both?`,

      twist: `Jonathan Blackstone orchestrated his own disappearance, but the plan went catastrophically wrong in a way he never anticipated. He did fake his death, using a homeless man's body obtained through his accomplice - the corrupt dentist who altered dental records before fleeing the country. Jonathan planned to collect the insurance money through intermediaries and start a new life in the Cayman Islands.

However, what Jonathan didn't know was that his business partner Marcus Wei discovered the fraud plan and decided to turn it deadly. Marcus was also in financial ruin and saw an opportunity: let Jonathan "die," then actually kill Jonathan while he's in hiding and keep all the insurance money. Marcus tracked Jonathan to his safe house in Mexico and murdered him two weeks after the staged accident.

The brilliant irony: The body in the car was a homeless victim (planted by Jonathan). Jonathan is now actually dead (killed by Marcus after faking death). Marcus is collecting insurance money while everyone thinks Jonathan might be alive. The case becomes a puzzle where both fraud and murder occurred, but in reverse order of what investigators assumed.`,

      conclusion: `The investigation reveals a double crime: Jonathan Blackstone committed insurance fraud by staging his death with a homeless victim's body (obtained through his corrupt dentist and medical examiner accomplice Dr. Helena Price, who also helped with the frozen body). But Marcus Wei, Jonathan's business partner, discovered the plan and saw an opportunity.

Marcus murdered the real Jonathan Blackstone in a safe house in Puerto Vallarta, Mexico on April 18th - two weeks after the staged car accident. DNA evidence from the safe house, financial transfers to offshore accounts, and testimony from Marcus's hired assassin (who cut a deal with prosecutors) confirmed Marcus killed Jonathan to claim the full insurance payout and business ownership.

The case is solved through: (1) Forensic evidence showing the car crash body was frozen pre-mortem, (2) Mexican police finding Jonathan's actual body in Puerto Vallarta with ballistic evidence linking to Marcus's registered firearm, (3) Financial forensics tracking money from Marcus to the assassin, (4) Dr. Helena Price's testimony after being granted immunity, revealing the original fraud conspiracy, and (5) The corrupt dentist's cooperation after extradition.

The twist creates multiple solutions: Jonathan is guilty of fraud but is also a murder victim. Marcus is guilty of murder but also helped expose the fraud. Katherine is innocent but benefits from both crimes. The insurance company must pay despite the fraud because a legitimate death occurred.`
    },
    victim: {
      name: 'Jonathan Blackstone',
      age: 52,
      occupation: 'CEO of Blackstone Industries',
      background: 'Inherited manufacturing company from father but ran it into ground through bad decisions. Drowning in $6.3M personal debt plus $18M company losses. Facing SEC investigation, lawsuit, and environmental fines. Desperate man who made increasingly poor choices.',
      personality: 'Charming sociopath willing to do anything to maintain lifestyle'
    },
    suspects: [
      {
        name: 'Marcus Wei',
        age: 48,
        occupation: 'COO & Business Partner',
        personality: 'Calculating',
        motive: 'Financial Gain & Business Control',
        alibi: 'Claims he was at home asleep during the car crash, wife confirms',
        isGuilty: true,
        backstory: 'Jonathan\'s business partner for 15 years. Also in financial trouble due to company losses. Discovered Jonathan\'s fraud plan through hacked emails and saw opportunity to actually kill Jonathan while he was "dead" and claim insurance payout plus full business ownership.',
        secret: 'Murdered the real Jonathan Blackstone in Puerto Vallarta on April 18th using hired assassin Roberto Salazar. Has been collecting insurance money while maintaining the fiction that Jonathan might be alive.',
        attributes: {
          physical: { height: '5\'9"-6\'0"', build: 'Medium build', hairColor: 'Black', eyeColor: 'Dark brown', bloodType: 'A+', handedness: 'Right', shoeSize: 10, hasGlasses: true },
          behavioral: { phoneArea: '310', voiceQuality: 'Smooth and measured', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'Katherine Blackstone',
        age: 45,
        occupation: 'Socialite / Former Model',
        personality: 'Cold',
        motive: 'Divorce Settlement & Insurance Money',
        alibi: 'At charity gala until midnight, 200 witnesses',
        isGuilty: false,
        backstory: 'Trophy wife who discovered Jonathan\'s affairs and financial incompetence. Was planning divorce that would give her 60% of assets. Now stands to inherit everything including $50M insurance payout. Appears to benefit most from his death.',
        secret: 'Knew about Jonathan\'s financial crimes and was planning to turn him in to SEC after securing divorce settlement. Has copies of all incriminating documents.',
        attributes: {
          physical: { height: '5\'8"-5\'11"', build: 'Slim build', hairColor: 'Platinum blonde', eyeColor: 'Blue', bloodType: 'O-', handedness: 'Right', shoeSize: 9, hasGlasses: false },
          behavioral: { phoneArea: '310', voiceQuality: 'High-pitched and breathy', shoeType: 'Heels', smokingHabit: false }
        }
      },
      {
        name: 'Dr. Helena Price',
        age: 41,
        occupation: 'Medical Examiner',
        personality: 'Nervous',
        motive: 'Bribery & Debt',
        alibi: 'On call at county morgue, sign-in logs confirm',
        isGuilty: true,
        backstory: 'Corrupt medical examiner drowning in student loan debt ($320K). Jonathan bribed her with $150K to falsify the autopsy report and help obtain a frozen homeless body for the fraud. She authenticated the dental records from the corrupt dentist.',
        secret: 'Helped Jonathan stage his death but had no knowledge of Marcus\'s plan to actually murder him. Testified against Marcus after being granted immunity.',
        attributes: {
          physical: { height: '5\'6"-5\'9"', build: 'Slim build', hairColor: 'Dark brown', eyeColor: 'Brown', bloodType: 'B+', handedness: 'Right', shoeSize: 8, hasGlasses: true },
          behavioral: { phoneArea: '213', voiceQuality: 'Soft and uncertain', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Emily Blackstone',
        age: 24,
        occupation: 'Graduate Student',
        personality: 'Bitter',
        motive: 'Inheritance & Resentment',
        alibi: 'Studying at university library until 2 AM, security footage confirms',
        isGuilty: false,
        backstory: 'Jonathan\'s daughter from first marriage. He paid minimal attention to her while lavishing money on his lifestyle. She resented him but also needed his money for her expensive medical school tuition. Trust fund beneficiary.',
        secret: 'Wrote a detailed journal about fantasies of her father dying, which makes her look guilty. Also has massive gambling debts her father refused to help with.',
        attributes: {
          physical: { height: '5\'5"-5\'8"', build: 'Athletic build', hairColor: 'Dark brown', eyeColor: 'Green', bloodType: 'O+', handedness: 'Left', shoeSize: 8, hasGlasses: false },
          behavioral: { phoneArea: '626', voiceQuality: 'Sharp and cutting', shoeType: 'Sneakers', smokingHabit: true }
        }
      },
      {
        name: 'Victor Kozlov',
        age: 56,
        occupation: 'Loan Shark / Organized Crime',
        personality: 'Menacing',
        motive: 'Debt Collection',
        alibi: 'At private poker game with alibi witnesses (of questionable credibility)',
        isGuilty: false,
        backstory: 'Jonathan owed him $2 million from gambling debts. Known for violent collection methods. Was pressuring Jonathan with escalating threats. Seems like obvious suspect but actually had no involvement.',
        secret: 'Was planning to kidnap Katherine Blackstone for ransom to force Jonathan to pay, but Jonathan "died" before he could execute plan.',
        attributes: {
          physical: { height: '6\'2"-6\'5"', build: 'Heavy build', hairColor: 'Gray', eyeColor: 'Blue', bloodType: 'AB-', handedness: 'Right', shoeSize: 12, hasGlasses: false },
          behavioral: { phoneArea: '213', voiceQuality: 'Deep and gravelly', shoeType: 'Boots', smokingHabit: true }
        }
      },
      {
        name: 'Linda Harper',
        age: 38,
        occupation: 'Former CFO of Blackstone Industries',
        personality: 'Vindictive',
        motive: 'Revenge & Lawsuit',
        alibi: 'At her attorney\'s office until 10 PM, then home (husband confirms)',
        isGuilty: false,
        backstory: 'Jonathan fired her when she discovered the accounting fraud and threatened to expose it. He then defamed her to prevent her from getting new employment. She was suing him for $5 million and planned to testify to SEC.',
        secret: 'Hired private investigator who discovered evidence of Jonathan\'s fraud plan days before the "accident." Has documentation that could expose the conspiracy.',
        attributes: {
          physical: { height: '5\'7"-5\'10"', build: 'Medium build', hairColor: 'Red', eyeColor: 'Hazel', bloodType: 'A-', handedness: 'Right', shoeSize: 9, hasGlasses: true },
          behavioral: { phoneArea: '562', voiceQuality: 'Crisp and professional', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'David Chen',
        age: 44,
        occupation: 'Environmental Lawyer',
        personality: 'Aggressive',
        motive: 'Professional Victory',
        alibi: 'Working late at law office, building security logs confirm',
        isGuilty: false,
        backstory: 'Lead attorney in environmental lawsuit against Blackstone Industries. The case would cost the company $40M in fines and could lead to criminal charges against Jonathan. Jonathan\'s death complicated the litigation.',
        secret: 'Discovered Jonathan was planning to flee the country to avoid the lawsuit. Has evidence of offshore accounts and fake passports.',
        attributes: {
          physical: { height: '5\'10"-6\'1"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'O+', handedness: 'Right', shoeSize: 10, hasGlasses: false },
          behavioral: { phoneArea: '213', voiceQuality: 'Loud and forceful', shoeType: 'Loafers', smokingHabit: false }
        }
      },
      {
        name: 'Alicia Martinez',
        age: 33,
        occupation: 'Jonathan\'s Mistress / Junior Executive',
        personality: 'Manipulative',
        motive: 'Promised Money & Position',
        alibi: 'Claims she was at a hotel alone, no corroboration',
        isGuilty: false,
        backstory: 'Jonathan\'s mistress who he promised to marry after divorcing Katherine. He also promised her CFO position and $3 million. She was pressuring him to leave his wife. Devastated to learn of his death and that she gets nothing.',
        secret: 'Was pregnant with Jonathan\'s child but had abortion two weeks before his death. Jonathan had promised to support her but then cut contact.',
        attributes: {
          physical: { height: '5\'6"-5\'9"', build: 'Athletic build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'B-', handedness: 'Right', shoeSize: 8, hasGlasses: false },
          behavioral: { phoneArea: '310', voiceQuality: 'Seductive', shoeType: 'Heels', smokingHabit: false }
        }
      },
      {
        name: 'Robert Garrison',
        age: 61,
        occupation: 'Insurance Investigator',
        personality: 'Suspicious',
        motive: 'False Lead - Doing His Job',
        alibi: 'N/A - Investigator, not suspect initially',
        isGuilty: false,
        backstory: 'Veteran insurance fraud investigator who immediately suspected the claim. His thorough investigation uncovered the fraud and eventually the murder. His persistence makes some think he\'s involved.',
        secret: 'Was being pressured by insurance company executives to close the case and pay out quickly. Refused and continued investigating despite threats to his job.',
        attributes: {
          physical: { height: '5\'8"-5\'11"', build: 'Heavy build', hairColor: 'Gray', eyeColor: 'Blue', bloodType: 'A+', handedness: 'Right', shoeSize: 10, hasGlasses: true },
          behavioral: { phoneArea: '949', voiceQuality: 'Gruff and skeptical', shoeType: 'Loafers', smokingHabit: true }
        }
      }
    ],
    evidence: [
      {
        type: 'Forensic Analysis',
        description: 'Body from car crash shows freeze-thaw tissue degradation consistent with 2-3 weeks of freezing prior to the fire. No carbon monoxide in blood - victim dead before fire.',
        location: 'Medical Examiner',
        critical: true,
        connectedSuspect: 'Dr. Helena Price'
      },
      {
        type: 'Financial Documents',
        description: 'Wire transfer of $150,000 from Jonathan to Dr. Helena Price two weeks before the accident. Memo: "Consulting fees."',
        location: 'Bank Records',
        critical: true,
        connectedSuspect: 'Dr. Helena Price'
      },
      {
        type: 'DNA Evidence',
        description: 'Blood and tissue found at safe house in Puerto Vallarta, Mexico matches Jonathan Blackstone\'s DNA. Time of death: April 18, two weeks after car crash.',
        location: 'Mexican Crime Scene',
        critical: true,
        connectedSuspect: 'Marcus Wei'
      },
      {
        type: 'Ballistics',
        description: 'Bullet recovered from Jonathan\'s actual body in Mexico matches Marcus Wei\'s registered .45 caliber handgun. Gun found in Marcus\'s office safe.',
        location: 'Firearms Analysis',
        critical: true,
        connectedSuspect: 'Marcus Wei'
      },
      {
        type: 'Financial Documents',
        description: 'Marcus Wei transferred $500,000 to offshore account belonging to Roberto Salazar (known assassin) on April 17, day before Jonathan\'s real murder.',
        location: 'International Banking',
        critical: true,
        connectedSuspect: 'Marcus Wei'
      },
      {
        type: 'Witness Testimony',
        description: 'Roberto Salazar (hired assassin) testified against Marcus after plea deal. Describes being hired to kill Jonathan in Mexico safe house.',
        location: 'Court Records',
        critical: true,
        connectedSuspect: 'Marcus Wei'
      },
      {
        type: 'Email Records',
        description: 'Hacked emails show Jonathan discussing fraud plan with Dr. Price and corrupt dentist. Marcus Wei\'s IP address accessed these emails from Jonathan\'s server.',
        location: 'Digital Forensics',
        critical: true,
        connectedSuspect: 'Marcus Wei'
      },
      {
        type: 'Dental Records',
        description: 'Dentist Dr. Alan Foster who "confirmed" the body\'s identity fled to Philippines two weeks after accident. Interpol investigation reveals he was bribed $200K.',
        location: 'Interpol / Banking',
        critical: true,
        connectedSuspect: 'Dr. Helena Price'
      },
      {
        type: 'Security Footage',
        description: 'Cayman Islands bank camera shows man resembling Jonathan attempting account access on April 12. But DNA from Mexico proves Jonathan died April 18 - this was an impostor planted by Marcus.',
        location: 'Bank Security',
        critical: true,
        connectedSuspect: 'Marcus Wei'
      },
      {
        type: 'Phone Records',
        description: 'Burner phone registered to Marcus Wei made 14 calls to Roberto Salazar between April 10-17. GPS data shows phone traveled to Puerto Vallarta.',
        location: 'Cell Tower Analysis',
        critical: true,
        connectedSuspect: 'Marcus Wei'
      },
      {
        type: 'Financial Documents',
        description: 'Katherine Blackstone hired divorce attorney on February 3rd. Prenup would give her 60% of assets. Jonathan stood to lose $120M+ in divorce.',
        location: 'Attorney Records',
        critical: false,
        connectedSuspect: 'Katherine Blackstone'
      },
      {
        type: 'Personal Documents',
        description: 'Emily Blackstone\'s journal contains detailed entries about wishing her father would die and describing insurance payout fantasies.',
        location: 'Emily\'s Apartment',
        critical: false,
        connectedSuspect: 'Emily Blackstone'
      },
      {
        type: 'Witness Testimony',
        description: 'Multiple witnesses describe Victor Kozlov\'s escalating threats to Jonathan about the $2M gambling debt. One witness heard "pay up or you\'re dead."',
        location: 'Witness Interviews',
        critical: false,
        connectedSuspect: 'Victor Kozlov'
      },
      {
        type: 'Private Investigation Report',
        description: 'Linda Harper\'s private investigator documented Jonathan\'s meetings with Dr. Price and unusual offshore account activity days before the "accident."',
        location: 'PI Files',
        critical: false,
        connectedSuspect: 'Linda Harper'
      },
      {
        type: 'Financial Documents',
        description: 'David Chen\'s legal discovery found evidence of fake passports and offshore accounts in Jonathan\'s name, suggesting plan to flee prosecution.',
        location: 'Court Discovery',
        critical: false,
        connectedSuspect: 'David Chen'
      },
      {
        type: 'Medical Records',
        description: 'Alicia Martinez had abortion on March 15. Clinic records show father listed as "J.B." Medical bills paid in cash.',
        location: 'Medical Records',
        critical: false,
        connectedSuspect: 'Alicia Martinez'
      },
      {
        type: 'Text Messages',
        description: 'Messages between Jonathan and Alicia show him promising "$3M and CFO position" then cutting contact two weeks before accident.',
        location: 'Phone Forensics',
        critical: false,
        connectedSuspect: 'Alicia Martinez'
      },
      {
        type: 'Homeless Shelter Records',
        description: 'Homeless man named "John Doe #47" went missing from shelter on March 20. Body measurements match crash victim. Dr. Price had access to shelter through charity work.',
        location: 'Social Services',
        critical: false,
        connectedSuspect: 'Dr. Helena Price'
      },
      {
        type: 'Insurance Documents',
        description: '$25M life insurance policy taken out 6 months before death with double indemnity clause. Premium payments show Jonathan was financially desperate but still paying.',
        location: 'Insurance Company',
        critical: false,
        connectedSuspect: 'Katherine Blackstone'
      }
    ],
    hints: {
      subtle: 'Follow the money trail carefully. Multiple financial transactions tell a story of desperation and planning. Also note the timeline - some evidence suggests the victim might have been alive after the car crash.',
      moderate: 'The body in the car shows signs of being frozen before the fire, and dental records came from a dentist who fled the country. But DNA from a Mexico safe house suggests Jonathan survived the crash and died later. Who had access to both locations?',
      major: 'Jonathan faked his death with Dr. Price\'s help using a homeless victim\'s body. Marcus Wei discovered the plan and murdered the real Jonathan in Mexico on April 18. Evidence: frozen body in crash, DNA at Mexico safe house, Marcus\'s $500K payment to assassin Roberto Salazar, ballistics matching Marcus\'s gun, and Salazar\'s testimony.'
    }
  },

  {
    id: 'art_forgery',
    title: 'The Art Forgery',
    difficulty: 7,
    crimeType: 'Fraud',
    priority: 'HIGH',
    location: 'Metropolitan Museum of Contemporary Art',
    narrative: {
      opening: `The art world was shaken when Dr. Patricia Vandermeer, renowned art authenticator and director of the Metropolitan Museum of Contemporary Art, announced at a packed press conference that the museum's prized centerpiece - "Autumn Reverie" by modernist master Claude Beaumont, valued at $47 million - was an elaborate forgery. The painting had been in the museum's collection for eight years, authenticated by three independent experts, and had been the subject of countless scholarly papers and exhibitions.

The revelation came after a routine conservation cleaning when museum technician Sarah Chen noticed microscopic inconsistencies in the paint layering. Chemical analysis revealed the presence of Phthalo Blue, a pigment that wasn't commercially available until 1935 - twenty-three years after Claude Beaumont's death in 1912. The painting was supposed to have been completed in 1909.

But this wasn't just about one fake painting. As investigators dug deeper, they uncovered a systematic fraud spanning multiple institutions. Seven other major works attributed to Beaumont had been sold through prestigious galleries over the past decade, all accompanied by impeccable provenance documentation, all now suspect. The total value: over $200 million. Someone had been orchestrating the most sophisticated art forgery operation in modern history.

The investigation revealed layers of deception that went far beyond simple paint-on-canvas fraud. The forger or forgers had mastered not just Beaumont's distinctive technique - his unusual palette knife strokes, his subtle use of underpainting, his signature color harmonies - but had also fabricated an entire ecosystem of false authentication. Fake letters of provenance from deceased gallery owners. Forged catalogue entries in obscure European publications. Even manipulated X-ray analyses and infrared spectroscopy reports that fooled the most advanced scientific testing.

Seven suspects emerged, each with the means, motive, and specialized knowledge to pull off different aspects of the fraud:

Dr. Patricia Vandermeer herself, whose career was built on authenticating Beaumont's work and who had personally verified three of the forgeries. Was she the whistleblower or the criminal trying to cover her tracks?

Adrian Leclair, a brilliant but struggling artist who studied Beaumont's techniques obsessively and had the skill to recreate the master's work. His fingerprints were found on stretcher bars of multiple suspect paintings.

Isabella Romano, an art dealer whose gallery had sold four of the eight suspect paintings. She profited enormously and had connections to document forgers in Eastern Europe.

Professor Marcus Webb, an art historian who wrote the definitive catalogue raisonné of Beaumont's work and whose authentication was crucial to the sales. He's been bankrupted by gambling debts.

Chen Wei, the museum technician who "discovered" the forgery. Perhaps too convenient? She has a chemistry background that would allow her to create convincing fake aging.

Dmitri Volkov, a Russian oligarch collector who owned three of the fake Beaumonts and stood to lose $90 million. He has connections to organized crime and a history of insurance fraud.

And Sophie Beaumont-Archer, the artist's great-granddaughter, who controlled the estate and signed off on all authentications. She received commissions on every sale.`,

      twist: `The brilliant deception involves not one forger but a conspiracy of three working together, each contributing their specialized expertise: Adrian Leclair created the physical paintings using historically accurate materials (with intentional microscopic errors as "signatures"), Professor Marcus Webb fabricated the academic provenance and authentication papers, and Isabella Romano managed the sales network and bribed the testing laboratories to produce false spectroscopy reports.

But here's the deeper twist: They didn't intend to defraud anyone. They started by "discovering" legitimate lost Beaumont works in private collections - real paintings that had been misattributed to other artists. They would re-authenticate these genuine works and profit legitimately. However, the demand became so intense and the money so good that they crossed the line into actual forgery, telling themselves they were "completing" Beaumont's unfinished works or creating pieces "in the spirit of" the master.

The operation unraveled not because of detective work but because Adrian Leclair developed terminal cancer and, facing death, deliberately introduced the anachronistic Phthalo Blue into "Autumn Reverie" as a way to confess without directly implicating his partners. He wanted the truth known but didn't want to die as a criminal informant.`,

      conclusion: `The investigation reveals a three-person conspiracy: Adrian Leclair (painter), Professor Marcus Webb (authenticator), and Isabella Romano (dealer) worked together for six years to create and sell eight forged Beaumont paintings worth $200 million.

Evidence that solves the case:
1. Chemical analysis showing Phthalo Blue pigment (Adrian's deliberate confession)
2. Matching microscopic tool marks on stretcher bars across multiple paintings (Adrian's signature technique)
3. Paper analysis of provenance documents showing same watermark from Eastern European forger (Isabella's contact)
4. Financial records showing payments from Isabella to Professor Webb disguised as "research grants"
5. Adrian's deathbed confession explaining the intentional Phthalo Blue inclusion
6. Database showing same spectroscopy lab tested all eight paintings (lab tech bribed by Isabella)
7. Pattern analysis revealing subtle consistent deviations from Beaumont's technique visible only under UV light (Adrian couldn't perfectly replicate the master)

The complex twist: Two paintings in the set are actually genuine Beaumonts that the trio correctly re-attributed, meaning some of their work was legitimate scholarship. Dr. Vandermeer was innocent but professional reputation destroyed. Dmitri Volkov owned two fakes and one genuine painting. Sophie Beaumont-Archer was negligent but not criminal. Chen Wei's "discovery" was legitimate technical work.

The case becomes a meditation on authenticity, artistic truth, and where the line falls between homage and fraud.`
    },
    victim: {
      name: 'The Art Market (Multiple Victims)',
      age: 'N/A',
      occupation: 'Museums & Collectors',
      background: 'Eight major institutions and private collectors defrauded of $200 million through sale of forged Claude Beaumont paintings. Each trusted authentication systems that were systematically corrupted.',
      personality: 'N/A - Multiple institutional and private victims'
    },
    suspects: [
      {
        name: 'Adrian Leclair',
        age: 41,
        occupation: 'Artist & Conservator',
        personality: 'Brooding',
        motive: 'Financial Desperation & Artistic Pride',
        alibi: 'Claims he only did conservation work on the paintings',
        isGuilty: true,
        backstory: 'Brilliant artist who studied Beaumont\'s techniques for his doctoral thesis but failed as an original artist. Drowning in debt from art school loans ($180K). Has the technical skill to replicate Beaumont\'s unique palette knife technique and color mixing. Diagnosed with stage 4 pancreatic cancer, six months to live.',
        secret: 'Created all eight forgeries with historically accurate materials. Deliberately introduced Phthalo Blue into "Autumn Reverie" as a confession before dying. Leaves microscopic tool marks as unconscious signature.',
        attributes: {
          physical: { height: '5\'10"-6\'1"', build: 'Slim build', hairColor: 'Light brown', eyeColor: 'Gray', bloodType: 'A-', handedness: 'Right', shoeSize: 10, hasGlasses: true },
          behavioral: { phoneArea: '212', voiceQuality: 'Soft-spoken and hesitant', shoeType: 'Paint-stained sneakers', smokingHabit: true }
        }
      },
      {
        name: 'Professor Marcus Webb',
        age: 58,
        occupation: 'Art Historian',
        personality: 'Charming',
        motive: 'Gambling Debts',
        alibi: 'Was lecturing at university during key sales',
        isGuilty: true,
        backstory: 'World\'s leading Beaumont scholar who wrote definitive catalogue raisonné. His authentication is gold standard in art world. Secretly bankrupted by gambling addiction ($2.4M in debts). Receives "research grants" from Isabella that are actually payments for false authentications.',
        secret: 'Fabricated academic provenance for all eight forgeries using access to university archives and relationships with European institutions. Created fake catalogue entries in obscure publications.',
        attributes: {
          physical: { height: '5\'8"-5\'11"', build: 'Heavy build', hairColor: 'Gray', eyeColor: 'Blue', bloodType: 'O+', handedness: 'Right', shoeSize: 10, hasGlasses: true },
          behavioral: { phoneArea: '617', voiceQuality: 'Booming and professorial', shoeType: 'Tweed with leather patches', smokingHabit: false }
        }
      },
      {
        name: 'Isabella Romano',
        age: 52,
        occupation: 'Art Dealer',
        personality: 'Sophisticated',
        motive: 'Profit',
        alibi: 'Has documentation for all legitimate business transactions',
        isGuilty: true,
        backstory: 'Owner of prestigious Romano Gallery in Manhattan. Sold four of the eight suspect paintings, earning $18 million in commissions. Has connections to document forgers in Prague and spectroscopy labs in Switzerland. Cultivates image of old-money respectability but is actually from working-class background and desperate to maintain lifestyle.',
        secret: 'Orchestrated the sales network and bribed Zürich lab to produce false spectroscopy reports. Laundered payments to Adrian and Marcus through "research grants" and "conservation fees." Has blackmail leverage over lab technician.',
        attributes: {
          physical: { height: '5\'7"-5\'10"', build: 'Slim build', hairColor: 'Black (dyed)', eyeColor: 'Dark brown', bloodType: 'B+', handedness: 'Right', shoeSize: 9, hasGlasses: false },
          behavioral: { phoneArea: '212', voiceQuality: 'Smooth and cultured', shoeType: 'Designer heels', smokingHabit: false }
        }
      },
      {
        name: 'Dr. Patricia Vandermeer',
        age: 49,
        occupation: 'Museum Director & Authenticator',
        personality: 'Meticulous',
        motive: 'False Lead - Career Built on Beaumonts',
        alibi: 'Public figure with documented schedule',
        isGuilty: false,
        backstory: 'Renowned authenticator who personally verified three of the forgeries, destroying her credibility. Her career and reputation were built on Beaumont expertise. "Discovering" the fraud may seem self-destructive unless she\'s trying to control the narrative and frame others.',
        secret: 'Was having affair with Professor Webb 15 years ago. Some suspect she\'s involved, but she genuinely was fooled by the sophisticated forgeries and is now trying to salvage her reputation.',
        attributes: {
          physical: { height: '5\'6"-5\'9"', build: 'Medium build', hairColor: 'Auburn', eyeColor: 'Green', bloodType: 'A+', handedness: 'Right', shoeSize: 8, hasGlasses: true },
          behavioral: { phoneArea: '202', voiceQuality: 'Crisp and authoritative', shoeType: 'Sensible flats', smokingHabit: false }
        }
      },
      {
        name: 'Chen Wei',
        age: 31,
        occupation: 'Museum Conservator',
        personality: 'Analytical',
        motive: 'Suspiciously Perfect Discovery',
        alibi: 'Was at work during "discovery" - but that\'s the problem',
        isGuilty: false,
        backstory: 'Chemistry PhD who works in museum conservation lab. She "discovered" the forgery by noticing Phthalo Blue during routine cleaning. Her chemistry background means she could have created fake aging effects. Some investigators suspect she planted the evidence or was in on the scheme all along.',
        secret: 'Discovered the forgery legitimately but held the information for two weeks while deciding whether to report it, fearing career impact. This delay looks suspicious.',
        attributes: {
          physical: { height: '5\'4"-5\'7"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Dark brown', bloodType: 'O-', handedness: 'Left', shoeSize: 7, hasGlasses: false },
          behavioral: { phoneArea: '310', voiceQuality: 'Soft and precise', shoeType: 'Lab sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Dmitri Volkov',
        age: 62,
        occupation: 'Oligarch / Collector',
        personality: 'Menacing',
        motive: 'Insurance Fraud',
        alibi: 'Lives in Moscow, limited US presence',
        isGuilty: false,
        backstory: 'Russian billionaire who owns three of the suspect Beaumonts, worth $90 million. History of insurance fraud in Russia. Stands to lose fortune if paintings declared fake - unless he knew they were fake and planned to claim insurance. His organized crime connections make him dangerous.',
        secret: 'Actually owns one genuine Beaumont and two fakes, but doesn\'t know which is which. Planning to sue for fraud but also file insurance claims, attempting to profit both ways.',
        attributes: {
          physical: { height: '6\'0"-6\'3"', build: 'Heavy build', hairColor: 'Gray', eyeColor: 'Blue', bloodType: 'AB+', handedness: 'Right', shoeSize: 12, hasGlasses: false },
          behavioral: { phoneArea: '+7 495', voiceQuality: 'Deep with Russian accent', shoeType: 'Expensive Italian shoes', smokingHabit: true }
        }
      },
      {
        name: 'Sophie Beaumont-Archer',
        age: 67,
        occupation: 'Estate Manager',
        personality: 'Aristocratic',
        motive: 'Commission on Every Sale',
        alibi: 'Signed authentication documents but claims ignorance',
        isGuilty: false,
        backstory: 'Claude Beaumont\'s great-granddaughter who controls the estate and receives 5% commission on all authenticated Beaumont sales. Earned $10 million from the eight suspect paintings. Her signature on authentication documents makes her legally complicit, but did she knowingly commit fraud?',
        secret: 'Was grossly negligent in estate management, signing off on authentications without proper review because she needed the money. Aristocratic lifestyle but dwindling family fortune. Not criminal but enabler.',
        attributes: {
          physical: { height: '5\'8"-5\'11"', build: 'Slim build', hairColor: 'White (formerly blonde)', eyeColor: 'Blue', bloodType: 'O-', handedness: 'Right', shoeSize: 9, hasGlasses: true },
          behavioral: { phoneArea: '011 44', voiceQuality: 'Posh British accent', shoeType: 'Classic pumps', smokingHabit: false }
        }
      }
    ],
    evidence: [
      {
        type: 'Chemical Analysis',
        description: 'Phthalo Blue pigment found in "Autumn Reverie." This synthetic pigment wasn\'t available until 1935, but Beaumont died in 1912. Definitive proof of forgery and Adrian\'s deliberate confession.',
        location: 'Conservation Lab',
        critical: true,
        connectedSuspect: 'Adrian Leclair'
      },
      {
        type: 'Tool Mark Analysis',
        description: 'Microscopic marks on stretcher bars of six paintings match unique tool pattern. Forensic analysis traces to specific stretcher pliers owned by Adrian Leclair.',
        location: 'Forensics Lab',
        critical: true,
        connectedSuspect: 'Adrian Leclair'
      },
      {
        type: 'UV Fluorescence',
        description: 'Under UV light, all eight paintings show identical subtle deviations from Beaumont\'s known technique in shadow rendering - unconscious signature of the forger.',
        location: 'Museum Lab',
        critical: true,
        connectedSuspect: 'Adrian Leclair'
      },
      {
        type: 'Financial Documents',
        description: 'Isabella Romano transferred $780,000 to Adrian Leclair disguised as "conservation fees" over six years. Amount far exceeds typical conservation costs.',
        location: 'Bank Records',
        critical: true,
        connectedSuspect: 'Isabella Romano'
      },
      {
        type: 'Financial Documents',
        description: 'Isabella paid Professor Webb $450,000 in "research grants" through shell corporation. Webb\'s university confirms no such research was conducted.',
        location: 'Financial Forensics',
        critical: true,
        connectedSuspect: 'Isabella Romano'
      },
      {
        type: 'Document Analysis',
        description: 'Provenance papers for six paintings show same watermark from Czech paper mill. Same mill supplied known document forger Pavel Novak (Isabella\'s contact).',
        location: 'Paper Forensics',
        critical: true,
        connectedSuspect: 'Professor Marcus Webb'
      },
      {
        type: 'Database Analysis',
        description: 'All eight suspect paintings were tested at same Zürich spectroscopy lab. Lab technician Klaus Meyer received $120,000 from Isabella for false reports.',
        location: 'Swiss Banking',
        critical: true,
        connectedSuspect: 'Isabella Romano'
      },
      {
        type: 'Witness Testimony',
        description: 'Adrian Leclair\'s deathbed confession (recorded by hospice nurse) admits creating forgeries and deliberately adding Phthalo Blue as confession. Names Marcus and Isabella.',
        location: 'Hospital Records',
        critical: true,
        connectedSuspect: 'Adrian Leclair'
      },
      {
        type: 'Email Records',
        description: 'Encrypted emails between Adrian, Marcus, and Isabella discussing "the Beaumont project" and "managing authenticity concerns." Digital forensics decrypted full conspiracy.',
        location: 'Email Server',
        critical: true,
        connectedSuspect: 'Isabella Romano'
      },
      {
        type: 'Paint Analysis',
        description: 'While pigments are period-appropriate (except Phthalo Blue), binding medium shows synthetic polymer markers from modern products. Adrian used contemporary materials aged artificially.',
        location: 'Chemistry Lab',
        critical: true,
        connectedSuspect: 'Adrian Leclair'
      },
      {
        type: 'Witness Testimony',
        description: 'Czech document forger Pavel Novak (arrested on unrelated charges) testified he created provenance papers for Isabella Romano in exchange for €50,000.',
        location: 'Interpol',
        critical: false,
        connectedSuspect: 'Professor Marcus Webb'
      },
      {
        type: 'Personal Documents',
        description: 'Dr. Vandermeer\'s personal emails show she delayed reporting some authentication concerns due to professional pressure and relationship with Webb.',
        location: 'Email Server',
        critical: false,
        connectedSuspect: 'Dr. Patricia Vandermeer'
      },
      {
        type: 'Financial Documents',
        description: 'Chen Wei has $320K in student loan debt and lives modestly. No suspicious income or offshore accounts. Financial profile inconsistent with conspiracy involvement.',
        location: 'Bank Records',
        critical: false,
        connectedSuspect: 'Chen Wei'
      },
      {
        type: 'Expert Analysis',
        description: 'Two of the eight paintings show characteristics genuinely consistent with Beaumont - Adrian and Marcus may have started with legitimate re-attributions before creating outright fakes.',
        location: 'Art Historians',
        critical: false,
        connectedSuspect: 'Professor Marcus Webb'
      },
      {
        type: 'Insurance Documents',
        description: 'Dmitri Volkov filed insurance claims on all three paintings worth $90M. Investigation reveals one painting is actually genuine, making partial claim legitimate.',
        location: 'Insurance Company',
        critical: false,
        connectedSuspect: 'Dmitri Volkov'
      },
      {
        type: 'Legal Documents',
        description: 'Sophie Beaumont-Archer signed authentication documents but estate records show she never examined paintings personally, relying entirely on expert opinions.',
        location: 'Estate Archives',
        critical: false,
        connectedSuspect: 'Sophie Beaumont-Archer'
      },
      {
        type: 'Gambling Records',
        description: 'Professor Webb owes $2.4M to Atlantic City casinos and illegal bookmakers. Debt timeline matches first suspicious Beaumont sale.',
        location: 'Casino Records / Police',
        critical: false,
        connectedSuspect: 'Professor Marcus Webb'
      },
      {
        type: 'Medical Records',
        description: 'Adrian Leclair diagnosed with stage 4 pancreatic cancer six months before "Autumn Reverie" discovery. Terminal prognosis explains confession motive.',
        location: 'Hospital',
        critical: false,
        connectedSuspect: 'Adrian Leclair'
      },
      {
        type: 'Phone Records',
        description: 'Chen Wei called museum director immediately after discovering Phthalo Blue anomaly. No calls to Adrian, Marcus, or Isabella. Behavior consistent with innocent technician.',
        location: 'Phone Company',
        critical: false,
        connectedSuspect: 'Chen Wei'
      }
    ],
    hints: {
      subtle: 'Look for patterns across multiple paintings - technique similarities, documentation sources, financial connections. One forger can\'t manage all aspects of authentication fraud alone.',
      moderate: 'The Phthalo Blue was deliberately included as a confession. Check tool marks on stretcher bars, provenance document sources, and financial payments between suspects. Who has artistic skill, academic credentials, and sales network?',
      major: 'Three-person conspiracy: Adrian Leclair painted all forgeries (tool marks, UV analysis, deathbed confession), Professor Marcus Webb created false academic provenance (document watermarks, gambling motive), Isabella Romano managed sales and bribed labs (financial transfers to both men and Swiss lab tech Klaus Meyer).'
    }
  },

  {
    id: 'missing_heir',
    title: 'The Missing Heir',
    difficulty: 8,
    crimeType: 'Fraud',
    priority: 'URGENT',
    location: 'Ashworth Manor & Estate',
    narrative: {
      opening: `The Ashworth family gathered at the ancestral estate on a cold October morning for the reading of patriarch Harrison Ashworth's will. The 89-year-old shipping magnate had died three weeks earlier, leaving behind a fortune estimated at $420 million, five children from three marriages, and a legacy of family dysfunction that would make a Greek tragedy look wholesome.

The family attorney, Bernard Whitmore, had requested everyone's attendance for what he cryptically described as "extraordinary circumstances requiring immediate clarification." As the extended Ashworth clan assembled in the oak-paneled library - siblings who hadn't spoken in years forced into the same room - Whitmore dropped a bombshell that would shatter the family's carefully maintained facade.

According to Harrison's final will, executed just six months before his death, the bulk of his estate - $280 million in liquid assets plus controlling interest in Ashworth Shipping International - would go to his "rightful first-born son, James Harrison Ashworth II," the product of a secret marriage in 1961. The will provided specific details: James was born in Geneva, Switzerland on March 15, 1962, given up for adoption immediately after birth when Harrison was only 22 and not yet wealthy. The will claimed Harrison had spent the last decade searching for his long-lost son and had finally made contact in 2018.

The document included what appeared to be irrefutable proof: DNA test results showing a 99.97% probability of paternity, adoption records from a Swiss orphanage, letters from Harrison expressing regret and joy at being reunited, and photographs of an older man who bore a striking resemblance to young Harrison. James Harrison Ashworth II was set to inherit the lion's share of the estate, with the five known children splitting the remaining $140 million and various properties.

But here's the problem: Multiple family members had never heard of James II until this moment. Harrison's medical records from the past two years showed advancing Alzheimer's disease with documented periods of severe confusion and suggestibility. The DNA test was conducted at a private laboratory in the Cayman Islands rather than through established forensic facilities. The Swiss adoption records came from an orphanage that burned down in 1987, with most records destroyed. And James Harrison Ashworth II himself was conveniently "traveling in remote Southeast Asia" and could not be reached for the will reading, represented instead by a lawyer named Richard Chen.

As investigators dig into the case, the picture grows murkier. Harrison's finances show several large transfers in the final year of his life - $3.2 million to various accounts, some connected to James II, others to mysterious offshore entities. Harrison's former nurse reports that he was frequently visited by a man matching James II's description, always when other family members weren't present. But was this long-lost son, or an impostor preying on an elderly man with dementia?

The investigation reveals that each of Harrison's five known children had motive, means, and opportunity to commit fraud - either by creating a fake heir to later expose (delegitimizing the will and forcing a default to state laws favoring them), or by colluding with the supposed James II to defraud their siblings. Secrets tumble out: hidden marriages, illegitimate children, forged documents, blackmail, and decades-old betrayals.

As detectives trace through family trees, DNA databases, Swiss adoption records, and financial transactions, they begin to suspect something unprecedented: What if James Harrison Ashworth II never existed at all? What if someone fabricated an entire person - complete with birth records, adoption papers, DNA results, and personal history - to commit the perfect inheritance fraud?`,

      twist: `James Harrison Ashworth II is entirely fictional - a ghost created by a conspiracy between Harrison's second wife Victoria Ashworth and the family attorney Bernard Whitmore. Victoria and Bernard had been having an affair for 15 years and saw an opportunity when Harrison's Alzheimer's progressed.

They created "James II" using DNA from Harrison's actual first child - his daughter Margaret Ashworth from his first marriage (the real firstborn). They obtained Margaret's DNA without her knowledge during a family dinner, mixed it with fake  paternity markers, and bribed the Cayman Islands lab technician to produce fraudulent results. The Swiss adoption records were forged using historical templates from the burned orphanage.

The "photos" of James II were actually digitally aged composites using Harrison's own youthful photos and AI face-swap technology. The letters were forgeries created using samples of Harrison's handwriting from old documents. Bernard drafted the will during one of Harrison's lucid periods but changed key details afterward, knowing Harrison wouldn't remember specifics.

The brilliant part: They planned for James II to never actually appear. He would "die" in a tragic accident in Cambodia before claiming the inheritance, and the estate would then pass to Victoria as Harrison's surviving spouse under the revised will's contingency clause - cutting out all five children almost entirely. The children would spend years fighting the will in probate, by which time Victoria would have moved assets offshore.

The unraveling comes from an unexpected source: Margaret Ashworth's daughter did a recreational DNA test through a genealogy website, which flagged an impossibly close match to "James Harrison Ashworth II" in the court-submitted DNA database. Forensic genealogists realized the DNA submitted for James II was actually Margaret's, proving the entire person was fabricated.`,

      conclusion: `The investigation reveals a conspiracy between Victoria Ashworth (Harrison's second wife) and Bernard Whitmore (family attorney and Victoria's secret lover) to defraud the estate through a completely fabricated heir.

Evidence solving the case:
1. DNA database match revealing "James II's" DNA is actually Margaret's (collected covertly from her wine glass at family dinner)
2. Digital forensics showing photos of "James II" are AI-generated using Harrison's youth photos
3. Handwriting analysis proving will amendments made after Harrison's signature using traced forgery technique
4. Cayman Islands lab technician testimony (granted immunity) admitting to $150K bribe from Bernard
5. Swiss document examiner proving adoption papers forged using templates purchased from dark web historical document seller
6. Financial forensics tracing the $3.2M transfers to shell companies owned by Victoria and Bernard
7. Harrison's medical records showing he was heavily sedated during key "meetings" with James II
8. Email correspondence between Victoria and Bernard discussing the "James project" and planned Cambodia accident

Secondary revelations create complex family dynamics:
- Margaret is actually Harrison's firstborn, making the inheritance "morally" hers even though James II doesn't exist
- Harrison's third child, Thomas, knew about the fraud and was blackmailing Victoria for a cut
- Harrison's eldest daughter Diane hired a private investigator who uncovered partial truth but she used it for blackmail rather than exposing it
- Attorney Bernard also represented two of the children, creating massive conflicts of interest
- Harrison's first wife Eleanor suspected the fraud but couldn't prove it before dying of cancer

The case becomes a study in family dysfunction where nearly everyone committed some form of fraud, but Victoria and Bernard committed the most audacious: inventing a person who never existed.`
    },
    victim: {
      name: 'Harrison Ashworth',
      age: 89,
      occupation: 'Shipping Magnate (deceased)',
      background: 'Built $420M fortune through Ashworth Shipping International. Three marriages, five acknowledged children, countless affairs. Developed Alzheimer\'s in final years, making him vulnerable to manipulation. Died believing he\'d found his long-lost first son.',
      personality: 'Was domineering patriarch who pitted children against each other; became confused and vulnerable in final years'
    },
    suspects: [
      {
        name: 'Victoria Ashworth',
        age: 54,
        occupation: 'Harrison\'s Second Wife',
        personality: 'Calculating',
        motive: 'Inherit Entire Estate',
        alibi: 'Was caring for Harrison during alleged meetings with James II',
        isGuilty: true,
        backstory: 'Former nurse who married Harrison 20 years ago. No biological children with Harrison but raised his youngest, Sophie. Has been having affair with Bernard Whitmore for 15 years. Saw opportunity when Harrison\'s Alzheimer\'s progressed and orchestrated entire James II fraud to inherit everything.',
        secret: 'Created fictional James II using stolen DNA from Margaret, forged documents, and bribed lab technicians. Planned for "James II" to die before claiming inheritance, triggering contingency clause naming her sole heir.',
        attributes: {
          physical: { height: '5\'7"-5\'10"', build: 'Athletic build', hairColor: 'Blonde', eyeColor: 'Blue', bloodType: 'A-', handedness: 'Right', shoeSize: 9, hasGlasses: false },
          behavioral: { phoneArea: '203', voiceQuality: 'Smooth and caring', shoeType: 'Designer heels', smokingHabit: false }
        }
      },
      {
        name: 'Bernard Whitmore',
        age: 61,
        occupation: 'Family Attorney',
        personality: 'Professional',
        motive: 'Love & Money',
        alibi: 'Claims he was executing Harrison\'s legitimate wishes',
        isGuilty: true,
        backstory: 'Ashworth family attorney for 25 years. Secret affair with Victoria started when helping her with estate planning. Drafted the fraudulent will using Harrison\'s real signature but changing details afterward. Stands to gain $50M from Victoria when fraud succeeds.',
        secret: 'Co-conspirator who created legal framework for fraud. Forged Swiss adoption records using dark web historical documents. Plans to flee to Portugal with Victoria once estate settled.',
        attributes: {
          physical: { height: '5\'10"-6\'1"', build: 'Medium build', hairColor: 'Gray', eyeColor: 'Brown', bloodType: 'B+', handedness: 'Right', shoeSize: 11, hasGlasses: true },
          behavioral: { phoneArea: '212', voiceQuality: 'Authoritative', shoeType: 'Expensive loafers', smokingHabit: false }
        }
      },
      {
        name: 'Margaret Ashworth-Devine',
        age: 63,
        occupation: 'Real Estate Developer',
        personality: 'Bitter',
        motive: 'Actually the Firstborn',
        alibi: 'Has documentation of being first child born 1961',
        isGuilty: false,
        backstory: 'Harrison\'s actual firstborn from first marriage to Eleanor Ashworth. Resented being cut out despite being oldest. Her DNA was stolen without knowledge to create fake James II results. Ironically, the fraud was "about" her even though she wasn\'t involved.',
        secret: 'Discovered she was adopted herself through 23andMe test two years ago - Harrison wasn\'t her biological father. This truth would invalidate her inheritance claim, so she\'s hidden it.',
        attributes: {
          physical: { height: '5\'6"-5\'9"', build: 'Medium build', hairColor: 'Gray (formerly dark brown)', eyeColor: 'Hazel', bloodType: 'O+', handedness: 'Right', shoeSize: 8, hasGlasses: true },
          behavioral: { phoneArea: '617', voiceQuality: 'Sharp and clipped', shoeType: 'Sensible flats', smokingHabit: false }
        }
      },
      {
        name: 'Thomas Ashworth',
        age: 58,
        occupation: 'Investment Banker',
        personality: 'Greedy',
        motive: 'Blackmail',
        alibi: 'Was in London during will drafting',
        isGuilty: true,
        backstory: 'Harrison\'s second child from first marriage. Brilliant financier with questionable ethics. Discovered Victoria and Bernard\'s fraud through suspicious financial transfers and has been blackmailing them for $5M to stay silent. Not part of original conspiracy but became accomplice.',
        secret: 'Blackmailing Victoria and Bernard for $5M. Also embezzling from his own investment firm ($12M), hoping to use inheritance to cover tracks before audit.',
        attributes: {
          physical: { height: '6\'0"-6\'3"', build: 'Slim build', hairColor: 'Dark brown', eyeColor: 'Blue', bloodType: 'A+', handedness: 'Right', shoeSize: 11, hasGlasses: false },
          behavioral: { phoneArea: '212', voiceQuality: 'Smooth and confident', shoeType: 'Handmade Italian shoes', smokingHabit: false }
        }
      },
      {
        name: 'Diane Ashworth-Morrison',
        age: 55,
        occupation: 'Museum Director',
        personality: 'Suspicious',
        motive: 'Exposing Fraud (for profit)',
        alibi: 'Hired private investigator to investigate James II',
        isGuilty: false,
        backstory: 'Harrison\'s third child and most estranged. Immediately suspicious of James II claim and hired private investigator who uncovered some evidence of fraud. Instead of exposing it publicly, tried to use information to blackmail Victoria for larger share of estate.',
        secret: 'Has evidence proving fraud but using it for blackmail rather than justice. Also secretly Harrison\'s illegitimate child from affair - raised by first wife Eleanor as her own.',
        attributes: {
          physical: { height: '5\'8"-5\'11"', build: 'Slim build', hairColor: 'Auburn', eyeColor: 'Green', bloodType: 'AB-', handedness: 'Left', shoeSize: 9, hasGlasses: true },
          behavioral: { phoneArea: '202', voiceQuality: 'Cultured', shoeType: 'Designer flats', smokingHabit: false }
        }
      },
      {
        name: 'Christopher Ashworth',
        age: 47,
        occupation: 'Venture Capitalist',
        personality: 'Arrogant',
        motive: 'Maintain Trust Fund',
        alibi: 'In Silicon Valley during relevant period',
        isGuilty: false,
        backstory: 'Harrison\'s fourth child from second marriage to Victoria\'s predecessor. Trust fund baby who\'s terrible at business despite prestigious title. Desperately needs inheritance to cover $8M in failed investments. Would benefit if James II claim was illegitimate.',
        secret: 'In massive debt from failed startup investments. Also being investigated by SEC for insider trading. Inheritance is only hope to avoid prison.',
        attributes: {
          physical: { height: '5\'11"-6\'2"', build: 'Athletic build', hairColor: 'Blonde', eyeColor: 'Blue', bloodType: 'O-', handedness: 'Right', shoeSize: 12, hasGlasses: false },
          behavioral: { phoneArea: '650', voiceQuality: 'Loud and brash', shoeType: 'Expensive sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Sophie Ashworth',
        age: 24,
        occupation: 'Graduate Student',
        personality: 'Naive',
        motive: 'Protecting Mother Victoria',
        alibi: 'At university during most events',
        isGuilty: false,
        backstory: 'Harrison\'s youngest child from previous marriage, raised by Victoria. Genuinely loved Harrison and is devastated by his death. Completely unaware of Victoria and Bernard\'s fraud. Would be shocked to learn the truth about her mother.',
        secret: 'Not involved in fraud but unknowingly helped by providing information about Harrison\'s routines and vulnerabilities to Victoria. Feels guilty about this.',
        attributes: {
          physical: { height: '5\'6"-5\'9"', build: 'Slim build', hairColor: 'Light brown', eyeColor: 'Hazel', bloodType: 'B-', handedness: 'Right', shoeSize: 8, hasGlasses: false },
          behavioral: { phoneArea: '617', voiceQuality: 'Soft and uncertain', shoeType: 'Student sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Eleanor Ashworth',
        age: 87,
        occupation: 'Harrison\'s First Wife',
        personality: 'Dignified',
        motive: 'Protecting Her Children',
        alibi: 'In hospice care with late-stage cancer',
        isGuilty: false,
        backstory: 'Harrison\'s first wife and mother of Margaret, Thomas, and adoptive mother of Diane. Dying of cancer but mentally sharp. Suspected James II fraud but lacked proof before her death. Left detailed notes about suspicions with her attorney.',
        secret: 'Discovered Victoria and Bernard\'s affair years ago. Tried to warn Harrison but he didn\'t believe her. Her deathbed testimony (recorded) becomes key evidence.',
        attributes: {
          physical: { height: '5\'5"-5\'8"', build: 'Frail build', hairColor: 'White', eyeColor: 'Blue', bloodType: 'A+', handedness: 'Right', shoeSize: 7, hasGlasses: true },
          behavioral: { phoneArea: '203', voiceQuality: 'Weak but clear', shoeType: 'Slippers', smokingHabit: false }
        }
      },
      {
        name: 'Dr. Alan Foster',
        age: 72,
        occupation: 'Harrison\'s Personal Physician',
        personality: 'Ethical',
        motive: 'Medical Malpractice Cover-up',
        alibi: 'Treating other patients',
        isGuilty: false,
        backstory: 'Harrison\'s doctor for 30 years. Documented Harrison\'s Alzheimer\'s progression meticulously. Victoria pressured him to minimize Harrison\'s cognitive decline in medical reports. Didn\'t participate in fraud but feels guilty for not protecting Harrison better.',
        secret: 'Knew Harrison was being manipulated but didn\'t report it due to doctor-patient confidentiality concerns and pressure from Victoria. Fears malpractice suit.',
        attributes: {
          physical: { height: '5\'9"-6\'0"', build: 'Heavy build', hairColor: 'White', eyeColor: 'Brown', bloodType: 'O+', handedness: 'Right', shoeSize: 10, hasGlasses: true },
          behavioral: { phoneArea: '203', voiceQuality: 'Calm and professional', shoeType: 'Comfortable loafers', smokingHabit: false }
        }
      },
      {
        name: 'Maria Santos',
        age: 51,
        occupation: 'Harrison\'s Former Nurse',
        personality: 'Observant',
        motive: 'Whistleblower',
        alibi: 'Witnessed suspicious meetings',
        isGuilty: false,
        backstory: 'Cared for Harrison during final two years until Victoria abruptly fired her six months before his death. Maria witnessed meetings between Harrison and man she was told was "James II" but noticed Harrison was always heavily sedated during these visits. Her testimony is crucial.',
        secret: 'Recorded several conversations on her phone without permission (technically illegal) showing Harrison\'s confusion about James II. This evidence is problematic but revealing.',
        attributes: {
          physical: { height: '5\'4"-5\'7"', build: 'Medium build', hairColor: 'Black', eyeColor: 'Dark brown', bloodType: 'O-', handedness: 'Right', shoeSize: 7, hasGlasses: false },
          behavioral: { phoneArea: '203', voiceQuality: 'Accented English', shoeType: 'Nursing shoes', smokingHabit: false }
        }
      },
      {
        name: 'Richard Chen',
        age: 44,
        occupation: 'Attorney for "James II"',
        personality: 'Evasive',
        motive: 'Large Legal Fees',
        alibi: 'Claims attorney-client privilege',
        isGuilty: true,
        backstory: 'Attorney hired to represent the non-existent James Harrison Ashworth II. Paid $500K by Bernard Whitmore to play the role of James II\'s counsel without ever meeting an actual client. Should have known it was fraud but willfully ignored red flags for money.',
        secret: 'Never actually met James II in person - all communications were via "encrypted emails" from Bernard. Knows or suspects fraud but committed to maintaining the charade for payment.',
        attributes: {
          physical: { height: '5\'8"-5\'11"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Dark brown', bloodType: 'A-', handedness: 'Right', shoeSize: 10, hasGlasses: true },
          behavioral: { phoneArea: '415', voiceQuality: 'Careful and measured', shoeType: 'Expensive dress shoes', smokingHabit: false }
        }
      }
    ],
    evidence: [
      {
        type: 'DNA Database Match',
        description: 'Genealogy website flags exact DNA match between "James Harrison Ashworth II" and Margaret Ashworth-Devine\'s daughter. Forensic analysis proves submitted DNA is Margaret\'s, not an unknown son\'s.',
        location: 'Genetic Genealogy Lab',
        critical: true,
        connectedSuspect: 'Victoria Ashworth'
      },
      {
        type: 'Digital Forensics',
        description: 'Photos of "James II" are AI-generated deepfakes using Harrison\'s youthful photos. Metadata shows files created on Bernard Whitmore\'s computer using commercial face-swap software.',
        location: 'FBI Cyber Forensics',
        critical: true,
        connectedSuspect: 'Bernard Whitmore'
      },
      {
        type: 'Handwriting Analysis',
        description: 'Will amendments made after Harrison\'s genuine signature using traced forgery technique. Pen pressure analysis and ink chronology prove tampering.',
        location: 'Document Examiner',
        critical: true,
        connectedSuspect: 'Bernard Whitmore'
      },
      {
        type: 'Witness Testimony',
        description: 'Cayman Islands lab technician Dr. Marcus Lee (granted immunity) admits Bernard Whitmore paid him $150K to fabricate DNA paternity results using false samples.',
        location: 'Federal Prosecutor',
        critical: true,
        connectedSuspect: 'Bernard Whitmore'
      },
      {
        type: 'Document Analysis',
        description: 'Swiss adoption records forged using historical templates purchased from dark web seller "HistoryForger47." Bitcoin transaction traced to Bernard\'s wallet.',
        location: 'Interpol Document Fraud Unit',
        critical: true,
        connectedSuspect: 'Bernard Whitmore'
      },
      {
        type: 'Financial Documents',
        description: '$3.2M transferred from Harrison\'s accounts to shell companies owned by Victoria and Bernard in British Virgin Islands. Pattern matches fraud conspiracy.',
        location: 'IRS Forensic Accounting',
        critical: true,
        connectedSuspect: 'Victoria Ashworth'
      },
      {
        type: 'Medical Records',
        description: 'Harrison\'s medication logs show he was given high doses of sedatives before each alleged meeting with "James II." Victoria controlled medication administration.',
        location: 'Medical Records',
        critical: true,
        connectedSuspect: 'Victoria Ashworth'
      },
      {
        type: 'Email Records',
        description: 'Encrypted emails between Victoria and Bernard discussing "the James project," planned Cambodia accident, and asset transfer strategy. Encryption broken by FBI.',
        location: 'Email Server Forensics',
        critical: true,
        connectedSuspect: 'Victoria Ashworth'
      },
      {
        type: 'Security Footage',
        description: 'Estate security cameras show Victoria collecting Margaret\'s wine glass at family dinner and carefully preserving it in plastic bag (DNA collection for fraud).',
        location: 'Estate Security System',
        critical: true,
        connectedSuspect: 'Victoria Ashworth'
      },
      {
        type: 'Financial Documents',
        description: 'Richard Chen received $500K payment from Bernard Whitmore for representing "James II" despite never meeting client in person. Payment structure suspicious.',
        location: 'Attorney Trust Account',
        critical: true,
        connectedSuspect: 'Richard Chen'
      },
      {
        type: 'Witness Testimony',
        description: 'Eleanor Ashworth\'s deathbed testimony (video recorded) describes suspecting fraud, witnessing Victoria and Bernard\'s affair, and Harrison\'s manipulation.',
        location: 'Attorney Video Records',
        critical: false,
        connectedSuspect: 'Victoria Ashworth'
      },
      {
        type: 'Phone Recordings',
        description: 'Maria Santos (fired nurse) illegally recorded conversations showing Harrison confused about "James II," asking "who is that man?" after alleged visits.',
        location: 'Private Device',
        critical: false,
        connectedSuspect: 'Victoria Ashworth'
      },
      {
        type: 'Financial Documents',
        description: 'Thomas Ashworth received $5M payment from Victoria\'s offshore account marked "consulting fees." Actually blackmail payment for his silence about discovered fraud.',
        location: 'Banking Records',
        critical: false,
        connectedSuspect: 'Thomas Ashworth'
      },
      {
        type: 'Private Investigation Report',
        description: 'Diane Ashworth-Morrison\'s hired PI uncovered Victoria-Bernard affair, suspicious Swiss records, and inconsistent James II timeline. She used info for blackmail, not justice.',
        location: 'PI Files',
        critical: false,
        connectedSuspect: 'Diane Ashworth-Morrison'
      },
      {
        type: 'Travel Records',
        description: 'No passport, visa, or travel records exist for "James Harrison Ashworth II" in any database worldwide. Person has no digital footprint before 2018.',
        location: 'State Department',
        critical: false,
        connectedSuspect: 'Bernard Whitmore'
      },
      {
        type: 'Swiss Archive Records',
        description: 'Orphanage that supposedly housed baby James II did burn in 1987, but archived records show no adoption matching the described dates or names.',
        location: 'Swiss National Archives',
        critical: false,
        connectedSuspect: 'Bernard Whitmore'
      },
      {
        type: 'DNA Test',
        description: 'Margaret Ashworth-Devine\'s own recreational DNA test reveals Harrison wasn\'t her biological father - she was adopted. Invalidates her firstborn claim.',
        location: '23andMe Database',
        critical: false,
        connectedSuspect: 'Margaret Ashworth-Devine'
      },
      {
        type: 'Email Records',
        description: 'Richard Chen\'s emails to "James II" all bounce back or go to encrypted relay controlled by Bernard Whitmore. No actual person on receiving end.',
        location: 'Email Server Analysis',
        critical: false,
        connectedSuspect: 'Richard Chen'
      },
      {
        type: 'Medical Expert Testimony',
        description: 'Dr. Foster\'s detailed medical notes document Harrison\'s Alzheimer\'s progression showing he was incapable of complex decision-making when will was amended.',
        location: 'Medical Records',
        critical: false,
        connectedSuspect: 'Victoria Ashworth'
      },
      {
        type: 'Financial Documents',
        description: 'Christopher Ashworth under SEC investigation for $8M insider trading scheme. Desperate need for inheritance to avoid prison.',
        location: 'SEC Files',
        critical: false,
        connectedSuspect: 'Christopher Ashworth'
      }
    ],
    hints: {
      subtle: 'Consider the possibility that James Harrison Ashworth II might not exist at all. Check for independent verification of his identity outside the provided documents. Who benefits most if he\'s real versus if he\'s fake?',
      moderate: 'The DNA match to a known family member is suspicious. Why would the mysterious heir share DNA patterns with Margaret? Also examine the source of authentication documents - Swiss orphanage records from a burned building, Cayman Islands DNA lab, AI-generated photos.',
      major: 'Victoria Ashworth and Bernard Whitmore fabricated James II entirely using stolen DNA from Margaret, forged documents, bribed lab technicians, and AI-generated photos. Evidence: DNA database match to Margaret\'s daughter, digital forensics showing deepfake photos created on Bernard\'s computer, lab technician testimony about $150K bribe, encrypted emails planning fraud, and complete absence of James II in any international database.'
    }
  },

  {
    id: 'stolen_manuscript',
    title: 'The Stolen Manuscript',
    difficulty: 1,
    crimeType: 'Theft',
    priority: 'MEDIUM',
    location: 'Riverside University Library - Rare Books Section',
    narrative: {
      opening: `The Riverside University Library discovered a theft early Monday morning when head librarian Dorothy Chen opened the rare books vault for the day's cataloging work. The vault's prized possession - a first edition of Mary Shelley's "Frankenstein" from 1818, valued at $180,000 - was missing from its display case.

The library's security system showed no signs of forced entry. The vault had been locked at 6 PM Friday evening by Dorothy herself, and the alarm was set properly. When she returned Monday at 8 AM, the vault appeared undisturbed except for the empty display case. The manuscript was simply gone.

Here's what investigators know: Only four people have both the vault access code and keys - Dorothy Chen (head librarian), Professor William Burke (literature department chair who uses the vault for research), James Martinez (library security chief), and Sarah Lin (rare books conservator). The security logs show the vault was accessed once over the weekend - at 2:17 AM on Sunday morning using a valid access code.

The building's exterior security cameras captured all four individuals entering the library at various times over the weekend, but the interior vault camera had mysteriously malfunctioned starting Saturday afternoon. Each person had their own reasons for being in the library during off-hours, and each had opportunity to take the manuscript.

The investigation is straightforward but requires careful attention to detail. Whoever stole the manuscript left traces - a distinctive shoe print near the display case, fingerprints on the case's glass, and most tellingly, the access log that recorded exactly when the vault was entered. The thief also had to know how to disable the vault camera without triggering alerts, suggesting insider knowledge.`,

      twist: `The theft was simpler than it appeared. James Martinez, the security chief, stole the manuscript to pay off gambling debts. He had the perfect position to disable the camera system without raising suspicion, and his security credentials gave him legitimate access to the vault. He planned to sell the manuscript to a private collector he'd met through his gambling contacts.

The twist: James didn't realize that his distinctive work boots (steel-toed security boots required by his job) left a unique tread pattern that matched prints found at the scene. He also forgot that the display case required two-handed opening, meaning he had to set down his coffee cup to open it - leaving his fingerprints despite wearing gloves for the actual theft.`,

      conclusion: `James Martinez stole the manuscript at 2:17 AM Sunday morning. Evidence proves his guilt conclusively:

1. Access log shows vault entry at 2:17 AM with James's access code
2. Boot print matches James's required steel-toed security boots (size 11, distinctive "SecureStep Pro" tread pattern)
3. Fingerprints on coffee cup left at scene match James's prints
4. Security camera was disabled using administrator access (only James and IT have this)
5. Text messages between James and known fence discussing "rare book sale"
6. James's financial records show $47,000 in gambling debts
7. Manuscript found in James's home safe during search warrant execution

The case serves as a tutorial for basic detective work: following access logs, matching physical evidence, and connecting financial motive to opportunity.`
    },
    victim: {
      name: 'Riverside University',
      age: 'N/A',
      occupation: 'Educational Institution',
      background: 'Prestigious private university with rare books collection valued at $2.4 million. The stolen Frankenstein manuscript was the crown jewel, acquired in 1952.',
      personality: 'N/A - Institutional victim'
    },
    suspects: [
      {
        name: 'James Martinez',
        age: 35,
        occupation: 'Library Security Chief',
        personality: 'Friendly',
        motive: 'Gambling Debts',
        alibi: 'Claims he was home asleep Sunday morning',
        isGuilty: true,
        backstory: 'Worked library security for 8 years. Well-liked and trusted. Developed gambling problem over past year, now $47K in debt to bookies. Desperate for money and saw opportunity to steal manuscript for quick cash.',
        secret: 'Has been meeting with fence to arrange sale of rare items. The Frankenstein manuscript was meant to clear his debts.',
        attributes: {
          physical: { height: '6\'0"-6\'3"', build: 'Athletic build', hairColor: 'Black', eyeColor: 'Brown', bloodType: 'O+', handedness: 'Right', shoeSize: 11, hasGlasses: false },
          behavioral: { phoneArea: '555', voiceQuality: 'Deep and friendly', shoeType: 'Steel-toed security boots', smokingHabit: false }
        }
      },
      {
        name: 'Dorothy Chen',
        age: 58,
        occupation: 'Head Librarian',
        personality: 'Meticulous',
        motive: 'False Lead',
        alibi: 'Was at home with spouse all weekend',
        isGuilty: false,
        backstory: 'Head librarian for 15 years. Dedicated to preserving rare books. Takes security very seriously. Last person to lock vault Friday evening. Devastated by the theft.',
        secret: 'Made a cataloging error last month that she covered up, but it\'s unrelated to the theft. Worried investigators will discover it.',
        attributes: {
          physical: { height: '5\'4"-5\'7"', build: 'Slim build', hairColor: 'Gray', eyeColor: 'Dark brown', bloodType: 'A+', handedness: 'Right', shoeSize: 7, hasGlasses: true },
          behavioral: { phoneArea: '555', voiceQuality: 'Soft and precise', shoeType: 'Comfortable flats', smokingHabit: false }
        }
      },
      {
        name: 'Professor William Burke',
        age: 52,
        occupation: 'Literature Department Chair',
        personality: 'Arrogant',
        motive: 'Academic Rivalry',
        alibi: 'Was in library Saturday researching for upcoming book',
        isGuilty: false,
        backstory: 'Renowned Shelley scholar writing definitive biography. Frequently uses rare books vault for research. Was in library Saturday afternoon but left before vault camera was disabled.',
        secret: 'Plagiarized portions of a colleague\'s work in his upcoming book. Worried about being discovered, but didn\'t steal manuscript.',
        attributes: {
          physical: { height: '5\'10"-6\'1"', build: 'Medium build', hairColor: 'Gray', eyeColor: 'Blue', bloodType: 'B+', handedness: 'Right', shoeSize: 10, hasGlasses: true },
          behavioral: { phoneArea: '555', voiceQuality: 'Pompous', shoeType: 'Leather loafers', smokingHabit: false }
        }
      },
      {
        name: 'Sarah Lin',
        age: 29,
        occupation: 'Rare Books Conservator',
        personality: 'Nervous',
        motive: 'Financial Stress',
        alibi: 'Working late Friday on conservation project',
        isGuilty: false,
        backstory: 'Recent hire with student loan debt ($120K). Passionate about book conservation. Was working late Friday but left at 8 PM, before the theft window. Access logs confirm.',
        secret: 'Has been selling personal belongings to pay student loans, making her seem financially desperate, but she would never steal from the library.',
        attributes: {
          physical: { height: '5\'5"-5\'8"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Dark brown', bloodType: 'O-', handedness: 'Left', shoeSize: 7, hasGlasses: false },
          behavioral: { phoneArea: '555', voiceQuality: 'Quiet and hesitant', shoeType: 'Sneakers', smokingHabit: false }
        }
      }
    ],
    evidence: [
      {
        type: 'Access Logs',
        description: 'Digital vault access log shows entry at 2:17 AM Sunday using James Martinez\'s access code. No other access recorded between Friday 6 PM lock-up and Monday 8 AM discovery.',
        location: 'Security System',
        critical: true,
        connectedSuspect: 'James Martinez'
      },
      {
        type: 'Fingerprints',
        description: 'Coffee cup found near display case has James Martinez\'s fingerprints. Cup is from vending machine on security office floor.',
        location: 'Crime Scene',
        critical: true,
        connectedSuspect: 'James Martinez'
      },
      {
        type: 'Shoe Print',
        description: 'Boot print near display case matches SecureStep Pro steel-toed security boots, size 11. James Martinez wears this exact model for work.',
        location: 'Crime Scene',
        critical: true,
        connectedSuspect: 'James Martinez'
      },
      {
        type: 'Security Footage',
        description: 'Camera system disabled Saturday 3:47 PM using administrator credentials. Only James and IT department have this access. IT was off-campus all weekend.',
        location: 'Security System',
        critical: true,
        connectedSuspect: 'James Martinez'
      },
      {
        type: 'Text Messages',
        description: 'Messages between James and contact "Vinny" discussing "rare book opportunity" and "180K item" sent Saturday night.',
        location: 'James\'s Phone',
        critical: true,
        connectedSuspect: 'James Martinez'
      },
      {
        type: 'Financial Documents',
        description: 'James owes $47,000 to three different bookies. Recent text messages show escalating threats.',
        location: 'Financial Records',
        critical: true,
        connectedSuspect: 'James Martinez'
      },
      {
        type: 'Search Warrant Evidence',
        description: 'Frankenstein manuscript found in safe at James\'s apartment. Still in library protective case.',
        location: 'James\'s Apartment',
        critical: true,
        connectedSuspect: 'James Martinez'
      },
      {
        type: 'Witness Testimony',
        description: 'Dorothy Chen\'s spouse confirms she was home all weekend. They watched movies together Sunday morning.',
        location: 'Witness Interview',
        critical: false,
        connectedSuspect: 'Dorothy Chen'
      },
      {
        type: 'Security Footage',
        description: 'Professor Burke entered library Saturday at 1:15 PM and left at 5:30 PM. Hours before theft occurred.',
        location: 'Building Security',
        critical: false,
        connectedSuspect: 'Professor William Burke'
      },
      {
        type: 'Access Logs',
        description: 'Sarah Lin accessed vault Friday at 4:30 PM for conservation work. Left building at 8:05 PM per building security log.',
        location: 'Security System',
        critical: false,
        connectedSuspect: 'Sarah Lin'
      },
      {
        type: 'Financial Documents',
        description: 'Sarah Lin has $120K student loan debt but makes regular payments. No unusual financial activity.',
        location: 'Bank Records',
        critical: false,
        connectedSuspect: 'Sarah Lin'
      }
    ],
    hints: {
      subtle: 'Check the access logs carefully - they show exactly when the vault was entered. Also look at who had the ability to disable security cameras.',
      moderate: 'The boot print and coffee cup are key physical evidence. Who wears steel-toed boots as part of their job? And check the fingerprints on that coffee cup.',
      major: 'James Martinez used his access code at 2:17 AM Sunday. His steel-toed security boots left prints at the scene. His fingerprints are on the coffee cup. Camera disabled with admin access only he had. Text messages discuss selling the manuscript. He has $47K gambling debts.'
    }
  },

  {
    id: 'poisoned_pen',
    title: 'The Poisoned Pen',
    difficulty: 2,
    crimeType: 'Blackmail',
    priority: 'MEDIUM',
    location: 'Millbrook Herald Newspaper Office',
    narrative: {
      opening: `The quiet town of Millbrook was shaken when three prominent citizens received anonymous blackmail letters within a week, each threatening to expose embarrassing secrets unless payment was made. The letters, typed on vintage typewriter, were unsigned but carried specific details only an insider could know. When the third victim, Mayor Patricia Lawson, refused to pay and instead went to the police, the situation escalated - someone broke into her home office and assaulted her assistant who was working late.

The investigation centers on five suspects, all connected to the Millbrook Herald newspaper office where an old typewriter matching the letters was found in the storage room. Each suspect had access to the office, motive to blackmail the victims, and secrets of their own to protect.`,

      twist: `The blackmailer is Linda Morrison, the newspaper's investigative journalist who discovered the secrets while researching articles. She used the information to blackmail victims to fund her daughter's experimental cancer treatment ($180K). When Mayor Lawson refused to pay and threatened to expose the blackmail scheme, Linda panicked and confronted her, leading to the assault.`,

      conclusion: `Linda Morrison committed blackmail and assault. Evidence: typewriter ribbon analysis matches letters, her fingerprints on storage room typewriter, medical bills showing desperate financial need, and security footage showing her at mayor's home during assault. Her daughter's cancer diagnosis provides tragic motive but doesn't excuse her crimes.`
    },
    victim: {
      name: 'Multiple Victims (Blackmail)',
      age: 'Various',
      occupation: 'Prominent Citizens',
      background: 'Three victims: business owner (affair), councilman (embezzlement), mayor (family scandal). Each received letters demanding $50K payment.',
      personality: 'N/A - Multiple victims'
    },
    suspects: [
      {
        name: 'Linda Morrison',
        age: 42,
        occupation: 'Investigative Journalist',
        personality: 'Desperate',
        motive: 'Medical Bills',
        alibi: 'Claims she was working late at newspaper office',
        isGuilty: true,
        backstory: 'Award-winning journalist who discovered secrets while researching corruption story. Daughter diagnosed with rare cancer requires $180K experimental treatment not covered by insurance. Desperate circumstances led to blackmail.',
        secret: 'Typed blackmail letters using newspaper storage typewriter. When Mayor refused payment and threatened exposure, Linda assaulted her assistant in panic.',
        attributes: {
          physical: { height: '5\'6"-5\'9"', build: 'Medium build', hairColor: 'Dark brown', eyeColor: 'Hazel', bloodType: 'A+', handedness: 'Right', shoeSize: 8, hasGlasses: true },
          behavioral: { phoneArea: '555', voiceQuality: 'Professional', shoeType: 'Flats', smokingHabit: false }
        }
      },
      {
        name: 'Robert Chen',
        age: 55,
        occupation: 'Newspaper Editor',
        personality: 'Gruff',
        motive: 'False Lead',
        alibi: 'Home with family during incidents',
        isGuilty: false,
        backstory: 'Long-time editor who knows all town secrets from years of journalism. Seems obvious suspect but is actually innocent. Has grudge against mayor over censorship dispute.',
        secret: 'Knows about victims\' secrets from past stories but never acted on information. His conflict with mayor is red herring.',
        attributes: {
          physical: { height: '5\'10"-6\'1"', build: 'Heavy build', hairColor: 'Gray', eyeColor: 'Brown', bloodType: 'O+', handedness: 'Right', shoeSize: 11, hasGlasses: true },
          behavioral: { phoneArea: '555', voiceQuality: 'Gruff', shoeType: 'Loafers', smokingHabit: true }
        }
      },
      {
        name: 'Councilman David Torres',
        age: 48,
        occupation: 'City Councilman',
        personality: 'Nervous',
        motive: 'One of the Victims',
        alibi: 'At city council meeting during assault',
        isGuilty: false,
        backstory: 'One of three blackmail victims. Letter threatened to expose his embezzlement of campaign funds ($35K). Paid the blackmail out of fear.',
        secret: 'Embezzled campaign funds and paid blackmail to keep secret. Victim, not perpetrator.',
        attributes: {
          physical: { height: '5\'8"-5\'11"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Dark brown', bloodType: 'B+', handedness: 'Right', shoeSize: 10, hasGlasses: false },
          behavioral: { phoneArea: '555', voiceQuality: 'Nervous', shoeType: 'Dress shoes', smokingHabit: false }
        }
      },
      {
        name: 'Margaret Sullivan',
        age: 38,
        occupation: 'Business Owner',
        personality: 'Defensive',
        motive: 'Victim with Secret',
        alibi: 'Working at business during assault',
        isGuilty: false,
        backstory: 'Owner of local hardware store. First blackmail victim - letter threatened to expose affair with employee. Paid $50K to keep marriage intact.',
        secret: 'Having affair with 24-year-old employee. Victim who paid blackmail demand.',
        attributes: {
          physical: { height: '5\'7"-5\'10"', build: 'Athletic build', hairColor: 'Blonde', eyeColor: 'Blue', bloodType: 'O-', handedness: 'Right', shoeSize: 9, hasGlasses: false },
          behavioral: { phoneArea: '555', voiceQuality: 'Firm', shoeType: 'Sneakers', smokingHabit: false }
        }
      },
      {
        name: 'Sarah Kim',
        age: 26,
        occupation: 'Copy Editor',
        personality: 'Anxious',
        motive: 'Financial Stress',
        alibi: 'At home streaming video games (Twitch channel confirms)',
        isGuilty: false,
        backstory: 'Junior employee with student loan debt. Has access to newspaper office but lacks motive. Her financial stress makes her seem suspicious.',
        secret: 'Struggling with debt but would never commit blackmail. Red herring suspect.',
        attributes: {
          physical: { height: '5\'4"-5\'7"', build: 'Slim build', hairColor: 'Black', eyeColor: 'Dark brown', bloodType: 'A-', handedness: 'Left', shoeSize: 7, hasGlasses: true },
          behavioral: { phoneArea: '555', voiceQuality: 'Quiet', shoeType: 'Sneakers', smokingHabit: false }
        }
      }
    ],
    evidence: [
      {
        type: 'Typewriter Analysis',
        description: 'Blackmail letters typed on vintage Underwood typewriter. Same typewriter found in newspaper storage room. Ribbon analysis matches letter content.',
        location: 'Forensics Lab',
        critical: true,
        connectedSuspect: 'Linda Morrison'
      },
      {
        type: 'Fingerprints',
        description: 'Linda Morrison\'s fingerprints found on storage room typewriter and on envelope of second blackmail letter.',
        location: 'Crime Lab',
        critical: true,
        connectedSuspect: 'Linda Morrison'
      },
      {
        type: 'Security Footage',
        description: 'Video shows Linda Morrison at Mayor Lawson\'s home office area 15 minutes before assault. She appears agitated.',
        location: 'Building Security',
        critical: true,
        connectedSuspect: 'Linda Morrison'
      },
      {
        type: 'Medical Records',
        description: 'Linda\'s daughter diagnosed with rare cancer. Treatment requires $180K not covered by insurance. Bills dated two weeks before first blackmail letter.',
        location: 'Hospital',
        critical: true,
        connectedSuspect: 'Linda Morrison'
      },
      {
        type: 'Financial Documents',
        description: 'Linda made deposits totaling $100K (two victims paid). Deposit dates match days after blackmail letters were delivered.',
        location: 'Bank Records',
        critical: true,
        connectedSuspect: 'Linda Morrison'
      },
      {
        type: 'Witness Testimony',
        description: 'Mayor\'s assistant describes assailant as female, medium build, wearing glasses. Matches Linda Morrison.',
        location: 'Hospital Interview',
        critical: true,
        connectedSuspect: 'Linda Morrison'
      },
      {
        type: 'Access Logs',
        description: 'Newspaper office keycard logs show Linda accessed storage room (where typewriter kept) late at night three times matching dates before each letter was sent.',
        location: 'Building Security',
        critical: true,
        connectedSuspect: 'Linda Morrison'
      },
      {
        type: 'Financial Documents',
        description: 'Councilman Torres embezzled $35K from campaign funds. Blackmail letter details match financial forensics.',
        location: 'Campaign Finance Records',
        critical: false,
        connectedSuspect: 'Councilman David Torres'
      },
      {
        type: 'Private Investigation Report',
        description: 'Report confirming Margaret Sullivan\'s affair with employee. Same details mentioned in blackmail letter.',
        location: 'Private Detective Files',
        critical: false,
        connectedSuspect: 'Margaret Sullivan'
      },
      {
        type: 'Witness Testimony',
        description: 'Robert Chen was home with family during all key events. Wife and children confirm alibi.',
        location: 'Witness Interviews',
        critical: false,
        connectedSuspect: 'Robert Chen'
      },
      {
        type: 'Streaming Records',
        description: 'Sarah Kim was live streaming on Twitch during assault. Video timestamp confirms alibi.',
        location: 'Digital Records',
        critical: false,
        connectedSuspect: 'Sarah Kim'
      }
    ],
    hints: {
      subtle: 'Look for someone with both access to information and desperate financial need. The typewriter in newspaper storage is key.',
      moderate: 'Check who accessed the storage room and had medical emergencies requiring large sums. The timing of deposits matches letter deliveries.',
      major: 'Linda Morrison typed letters on storage typewriter (fingerprints, ribbon analysis), accessed storage room at key times, has daughter with $180K medical bills, deposited blackmail payments, and was seen at mayor\'s office during assault.'
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
