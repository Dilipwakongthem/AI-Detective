# Game Design Document

## AI Detective Game - Difficulty and Progression Systems

---

## DIFFICULTY SCALING

### Overview

The AI Detective game features a progressive difficulty system that scales with player rank and experience. Cases become more complex, suspects more cunning, and evidence more subtle as players advance through the ranks.

### Base Difficulty Tiers

**Rookie Level**
- Simple cases with obvious clues
- 3 suspects maximum
- Clear contradictions in statements
- Straightforward evidence trails

**Detective Level**
- Moderate complexity
- 4-5 suspects with realistic motives
- Some misdirection and red herrings
- Requires logical deduction

**Master Sleuth Level**
- High complexity cases
- 5-6 suspects with interconnected relationships
- Multiple layers of deception
- Requires expert analysis and intuition

---

## RANK-BASED CASE PROGRESSION

### RANK STRUCTURE & CASE ACCESS

**Rank 1 - Rookie Detective (0-500 points)**
- Case Types: Petty theft, simple burglary, vandalism
- Suspects: 3 maximum
- Evidence Pieces: 6-8
- Clues: Very obvious contradictions
- Alibi Complexity: Simple, easy to verify/disprove
- Available Cases: Levels 1-2 difficulty only

**Rank 2 - Detective (501-1500 points)**
- Case Types: Grand theft, assault, blackmail
- Suspects: 3-4
- Evidence Pieces: 8-10
- Clues: Some misdirection
- Alibi Complexity: Moderate, requires cross-referencing
- Available Cases: Levels 1-4 difficulty

**Rank 3 - Senior Detective (1501-3000 points)**
- Case Types: Fraud, kidnapping, manslaughter
- Suspects: 4-5
- Evidence Pieces: 10-12
- Clues: Multiple red herrings
- Alibi Complexity: Complex, multiple witnesses needed
- Available Cases: Levels 2-6 difficulty

**Rank 4 - Lead Detective (3001-5000 points)**
- Case Types: Murder, organized crime, corruption
- Suspects: 4-6 with interconnected relationships
- Evidence Pieces: 12-15
- Clues: Subtle psychological tells
- Alibi Complexity: Coordinated alibis, conspiracies
- Available Cases: Levels 4-8 difficulty

**Rank 5 - Detective Inspector (5001-8000 points)**
- Case Types: Serial crimes, conspiracy, cold cases
- Suspects: 5-6 with complex motivations
- Evidence Pieces: 15-18
- Clues: Requires forensic expertise
- Alibi Complexity: Professional criminals, planned alibis
- Available Cases: Levels 6-9 difficulty

**Rank 6 - Chief Detective (8001+ points)**
- Case Types: High-profile murders, international crime, terrorism
- Suspects: 6+ with layered deceptions
- Evidence Pieces: 18-20+
- Clues: Minimal obvious tells
- Alibi Complexity: Master criminals, nearly perfect cover-ups
- Available Cases: Levels 7-10 difficulty (Master Sleuth tier)

---

## DIFFICULTY LEVEL MECHANICS

### Level 1-2 (Rookie Tier)
**Case Complexity:**
- Single motive, straightforward crime
- Guilty party makes obvious mistakes
- Physical evidence directly points to culprit
- Alibis have clear holes

**Example Case:**
"Store owner reports break-in. Three suspects with access to keys. One has muddy boots matching crime scene footprints and can't explain their whereabouts."

**Hints Available:** 5 free hints per case

---

### Level 3-4 (Detective Tier)
**Case Complexity:**
- Two possible suspects seem equally guilty
- Guilty party has semi-plausible alibi
- Some evidence is circumstantial
- Requires connecting 3-4 evidence pieces

**Example Case:**
"Business partner found dead. Two partners had financial disputes. One benefits from death, another has mysterious payment to victim. Must analyze financial records and timeline."

**Hints Available:** 3 free hints per case

---

### Level 5-6 (Senior Detective Tier)
**Case Complexity:**
- Multiple suspects with realistic motives
- Innocent suspects hiding unrelated secrets
- Guilty party's initial alibi seems solid
- Timeline analysis crucial
- Requires psychological profiling

**Example Case:**
"Victim poisoned at dinner party. All five guests had past conflicts. One guest is hiding an affair, another has gambling debts. Guilty party staged evidence to frame someone else."

**Hints Available:** 2 free hints per case

---

### Level 7-8 (Lead Detective Tier)
**Case Complexity:**
- Conspiracy involving multiple people
- Guilty party has accomplice providing false testimony
- Physical evidence was cleaned or staged
- Requires proving premeditation
- Deep interrogation needed to find contradictions

**Example Case:**
"CEO murdered in locked office. Six suspects include family and business rivals. Crime scene was altered. Two suspects are coordinating their stories. Must find digital evidence of planning."

**Hints Available:** 1 free hint per case

---

### Level 9-10 (Inspector/Chief Tier)
**Case Complexity:**
- Nearly perfect crime with professional execution
- Multiple layers of misdirection
- Guilty party is intelligent and prepared
- Alibis verified by seemingly credible sources
- Requires finding single overlooked detail
- Cold cases with missing evidence

**Example Case:**
"Renowned detective found dead in apparent suicide. Seven suspects all have verified alibis. Evidence suggests suicide but small inconsistencies hint at murder. Killer anticipated every line of investigation. Must find the one mistake they couldn't prevent."

**Hints Available:** 0 free hints (must purchase with reputation)

---

## CASE ASSIGNMENT SYSTEM

### Automatic Difficulty Scaling
When player starts new case, AI selects difficulty based on:

```
"CASE ASSIGNMENT ALGORITHM"

Available Difficulty Range = [Rank Minimum] to [Rank Maximum]

Selection Factors:
1. Player's current rank (determines range)
2. Recent success rate:
   - 80%+ success = Assign toward upper range
   - 50-79% success = Assign middle range
   - Below 50% = Assign lower range

3. Streak bonuses:
   - 3+ perfect cases in row = Unlock bonus "Master Case" (+1 difficulty)
   - 5+ solved streak = Slight difficulty increase

4. Time since last case:
   - Returning after 24+ hours = Offer "warm-up" case (lower difficulty)
   - Playing consecutively = Gradual difficulty increase
```

### Special Case Types (Unlocked by Rank)

**Rank 2 Unlock - "Cold Cases"**
```
"COLD CASE FILE OPENED"

This unsolved case from [X] years ago has been reopened.

⚠️ Warning:
- Some evidence may be missing
- Witnesses' memories are unreliable
- Suspects may have died or disappeared

Increased difficulty but double reputation reward.

[ACCEPT CASE]
[DECLINE]
```

**Rank 3 Unlock - "Time-Sensitive Cases"**
```
"URGENT: ACTIVE CRIME IN PROGRESS"

A crime is unfolding right now. You have limited time to:
- Locate a kidnapping victim
- Stop an ongoing heist
- Prevent a planned murder

⏱️ Real-time pressure: Certain questions only available for limited time
⭐ Triple reputation for successful resolution

[ACCEPT CASE]
[DECLINE]
```

**Rank 4 Unlock - "Connected Cases"**
```
"CASE SERIES DETECTED"

This crime appears linked to [X] previous cases.

Access previous case files to find patterns.
Serial criminal with evolving methods.

Must solve to unlock next case in series.

[BEGIN INVESTIGATION]
```

**Rank 5 Unlock - "Undercover Operations"**
```
"DEEP COVER ASSIGNMENT"

You must pose as someone else to infiltrate criminal organization.

- Limited evidence access initially
- Must gain suspects' trust through dialogue
- Wrong questions blow your cover = case failure

High risk, high reward.

[ACCEPT MISSION]
[DECLINE]
```

**Rank 6 Unlock - "Impossible Cases"**
```
"LEGENDARY CASE FILE"

The department's most baffling unsolved mystery.

⭐ Previous detectives all failed
⭐ Extremely complex with 10+ suspects
⭐ Multiple crime scenes
⭐ Requires perfect deduction

Success grants legendary status and exclusive badge.

[ACCEPT CHALLENGE]
[NOT YET]
```

---

## PROMOTION NOTIFICATION (REVISED)

When player ranks up:

```
"🎖️ PROMOTION! 🎖️"

Congratulations!

You've been promoted to:
[NEW RANK NAME]

INCREASED CASE DIFFICULTY:
Your expertise is needed on more complex investigations.

You now have access to:
• Level [X-Y] difficulty cases
• [New case types unlocked]
• [New investigation tools]

UPDATED CASE POOL:
• Harder crimes requiring advanced deduction
• More suspects with complex relationships
• Subtle evidence requiring expert analysis
• Professional criminals who cover their tracks

Your previous rank cases are still available for practice.

"[Police Chief Quote acknowledging your skill level]"

Reputation Bonus: +[Number] points
Daily Case Limit: [Increased Number]

[VIEW NEW CASES]
[CONTINUE]
```

---

## CASE SELECTION SCREEN (REVISED)

```
"AVAILABLE CASES"

Your Rank: [Rank Name]
Daily Cases Remaining: [X]/[Y]

━━━━━━━━━━━━━━━━

📁 RECOMMENDED CASE (Your Level)
"[Case Title]"
Difficulty: ⭐⭐⭐⭐⚪ (Level 7)
Crime: [Type]
Reputation Reward: [Points]
[START CASE]

━━━━━━━━━━━━━━━━

📂 AVAILABLE CASES

"[Case Title 1]"
Difficulty: ⭐⭐⭐⭐⭐ (Level 8) 🔥 CHALLENGING
Crime: Murder | Suspects: 6
Reward: [High Points]
[START]

"[Case Title 2]"
Difficulty: ⭐⭐⭐⚪⚪ (Level 5)
Crime: Fraud | Suspects: 4
Reward: [Medium Points]
[START]

"[Case Title 3]" 🆕 NEW CASE TYPE
Difficulty: ⭐⭐⭐⭐⚪ (Level 7) ⏱️ TIME-SENSITIVE
Crime: Kidnapping | Suspects: 5
Reward: [Triple Points]
[START]

━━━━━━━━━━━━━━━━

📋 PRACTICE CASES (Lower Difficulty)
[View easier cases from previous ranks]

━━━━━━━━━━━━━━━━

[BACK TO MAIN MENU]
```

---

## ADAPTIVE DIFFICULTY SYSTEM

If player is struggling (3+ failed cases in row):

```
"PERFORMANCE REVIEW"

Detective, we've noticed you're having difficulty with recent cases.

Options:
1️⃣ Continue at current difficulty
   (Prove yourself with harder cases)

2️⃣ Request temporary reassignment
   (Receive easier cases for next 3 investigations)
   Note: Slower reputation gain

3️⃣ Access Training Cases
   (Tutorial cases with guided solutions)
   Note: No reputation earned

Your reputation won't be affected by this choice.

[SELECT OPTION]
```

If player is excelling (5+ perfect cases in row):

```
"EXCEPTIONAL PERFORMANCE NOTED"

Chief's Message:
"Outstanding work, Detective. Your solve rate is exceptional."

SPECIAL OPPORTUNITY:
🌟 "THE DIRECTOR'S CHALLENGE" 🌟

One-time master case designed by the Police Director.
• Maximum difficulty (Level 10+)
• 8 suspects, 20+ evidence pieces
• Unique reward: Exclusive "Elite Detective" badge
• Bonus: +500 reputation points

This case won't count against daily limit.

[ACCEPT CHALLENGE]
[MAYBE LATER]
```

---

## IMPLEMENTATION NOTES

### Key Features

1. ✅ **Progressive difficulty** - Cases get harder as you rank up
2. ✅ **Rank-gated content** - Higher ranks unlock new case types
3. ✅ **Flexible challenge** - Players can still practice easier cases
4. ✅ **Adaptive scaling** - System adjusts to player performance
5. ✅ **Motivation** - Special cases and rewards for skilled players
6. ✅ **Clear expectations** - Players know what difficulty to expect

### Benefits

- **Engagement**: Players are constantly challenged at appropriate levels
- **Fairness**: No frustration from impossible cases or boredom from easy ones
- **Progression**: Clear sense of advancement and achievement
- **Replayability**: Multiple case types and difficulty options
- **Accessibility**: Practice mode available for struggling players
- **Skill Development**: Gradual learning curve with increasing complexity

---

**This system maintains player engagement by constantly challenging them at appropriate levels while preventing frustration through adaptive difficulty and practice options!**
