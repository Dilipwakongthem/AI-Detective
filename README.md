# Case Files: AI Detective

**A Complete AI-Powered Text-Based Mystery Detective Game Engine**

---

## 🎯 Overview

**Case Files: AI Detective** is a sophisticated, procedurally-generated mystery detective game designed for Android mobile platforms. The game features an AI-powered engine that generates unique crime cases, manages intelligent suspect characters, evaluates player deductions, and provides all game text content dynamically.

### Key Features

- ✨ **Procedural Case Generation** - Every case is unique with randomized crimes, suspects, evidence, and narratives
- 🤖 **AI Suspect Personalities** - Intelligent NPCs with distinct personalities, behaviors, and dialogue patterns
- 🔍 **Dynamic Investigation** - Explore crime scenes, collect evidence, and build theories
- 💬 **Natural Language Interrogation** - Ask suspects anything and receive contextually appropriate responses
- ⚖️ **Smart Accusation Evaluation** - AI evaluates your deductions based on evidence quality and reasoning
- 📊 **Progression System** - Ranks, achievements, reputation, and unlockable detective tools
- 🎲 **Difficulty Scaling** - Three difficulty levels from Rookie to Master Sleuth
- 💾 **Complete Game State Management** - Save/load system with case archives

---

## 🏗️ Architecture

### Project Structure

```
Crime-Scene/
├── src/main/kotlin/com/casefiles/detective/
│   ├── models/           # Data models
│   │   ├── Enums.kt      # Game enumerations
│   │   ├── Case.kt       # Case and victim models
│   │   ├── Suspect.kt    # Suspect and alibi models
│   │   ├── Evidence.kt   # Evidence models
│   │   ├── Location.kt   # Location models
│   │   └── Player.kt     # Player profile and progression
│   ├── engine/           # Core game logic
│   │   ├── CaseGenerator.kt        # Procedural case generation
│   │   ├── AccusationEvaluator.kt  # Accusation scoring
│   │   └── GameEngine.kt           # Main game coordinator
│   ├── ai/               # AI systems
│   │   └── DialogueEngine.kt       # Suspect dialogue AI
│   ├── ui/               # User interface
│   │   └── UITextManager.kt        # All game text
│   └── GameLauncher.kt   # Console demo launcher
├── docs/                 # Documentation
├── assets/              # Game assets
└── build.gradle.kts     # Build configuration
```

---

## 🎮 Core Game Systems

### 1. Case Generation System

The `CaseGenerator` creates unique procedural cases with:

- **Crime Types**: Murder, Theft, Fraud, Kidnapping, Arson
- **Dynamic Suspects**: 3-6 suspects with unique personalities, alibis, and motives
- **Evidence Network**: 8-12 interconnected pieces of evidence
- **Multiple Locations**: Crime scenes and secondary investigation sites
- **Crime Narrative**: Auto-generated backstory, motive, and cover-up attempt

```kotlin
val generator = CaseGenerator(Difficulty.DETECTIVE)
val case = generator.generateCase(caseNumber = 1)
```

### 2. AI Dialogue Engine

The `DialogueEngine` powers realistic suspect interactions:

- **Personality-Based Responses**: Each suspect responds according to their traits
- **Truthfulness System**: Guilty suspects lie more about certain topics
- **Emotional States**: Dynamic emotional responses based on interrogation pressure
- **Contradiction Detection**: Tracks inconsistencies in suspect statements
- **Stress Levels**: Suspects may crack under pressure or confess

```kotlin
val dialogueEngine = DialogueEngine()
val response = dialogueEngine.generateResponse(suspect, question, case)
// Returns: DialogueResponse with text, emotional state, body language, truthfulness
```

### 3. Evidence Collection System

Players investigate locations and collect evidence:

- **Physical Evidence**: Fingerprints, DNA, weapons, fibers
- **Documentary Evidence**: Emails, receipts, contracts, records
- **Testimonial Evidence**: Witness statements
- **Forensic Evidence**: Specialized crime scene analysis
- **Digital Evidence**: Phone records, location data

Evidence can be connected to build theories and strengthen accusations.

### 4. Interrogation System

Dynamic questioning with multiple approaches:

- **Custom Questions**: Type any question, AI generates contextual response
- **Evidence Presentation**: Confront suspects with collected evidence
- **Quick Questions**: Pre-built question templates
- **Behavior Analysis**: Watch for nervous tells, contradictions, and evasiveness

### 5. Accusation Evaluation

The `AccusationEvaluator` judges player deductions:

**Rating Criteria (0-5 stars):**
- ⭐ Correct suspect identified
- ⭐ Correct motive identified
- ⭐ Critical evidence included
- ⭐ High-quality evidence collection (70%+ relevant evidence)
- ⭐ Strong logical reasoning

**Feedback System:**
- Detailed explanation of why accusation succeeded/failed
- Points out missed evidence and contradictions
- Suggests what was overlooked

### 6. Progression System

**Detective Ranks:**
- Cadet (0 reputation)
- Rookie (500)
- Detective (1,500)
- Senior Detective (3,000)
- Lieutenant (5,000)
- Captain (8,000)
- Commander (12,000)
- Chief Detective (20,000)

**Unlockable Tools:**
- Basic Investigation Kit
- Forensics Access
- Background Check Database
- Psychological Profiling
- Advanced DNA Analysis
- Phone Records Access
- Financial Forensics

**Achievements:**
- First Case Solved
- Perfect Detective (5 five-star ratings)
- Speed Solver
- Master Interrogator
- Evidence Expert
- Case Streak
- Reputation Milestones

---

## 🚀 Quick Start

### Prerequisites

- **Kotlin JVM** 1.9.20 or higher
- **JDK** 17 or higher
- **Gradle** 8.0+

### Build and Run

```bash
# Clone the repository
git clone https://github.com/yourusername/Crime-Scene.git
cd Crime-Scene

# Build the project
./gradlew build

# Run the console demo
./gradlew run
```

### Console Demo Controls

The console launcher demonstrates all game features:

```
Main Menu:
[1] Start New Case
[2] Continue Investigation
[3] Case Archive
[4] Detective Profile
[5] Settings
[6] Exit

Investigation:
[1-5] Visit Location
[S] View Suspects
[E] Evidence Board
[A] Make Accusation
[H] Request Hint
[X] Abandon Case

Interrogation:
[Q] Ask Question
[E] Show Evidence
[B] End Interrogation
```

---

## 📱 Android Integration

While this is a Kotlin JVM console demo, the core game engine is designed for Android integration:

### Integration Steps

1. **Copy Core Modules**: Import `models`, `engine`, `ai` packages into your Android project

2. **Create UI Activities**:
```kotlin
class CaseInvestigationActivity : AppCompatActivity() {
    private val gameEngine by lazy { GameEngine(playerProfile) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val case = gameEngine.startNewCase()
        displayCaseBriefing(case)
    }
}
```

3. **Handle User Input**:
```kotlin
// In your interrogation UI
askQuestionButton.setOnClickListener {
    val question = questionInput.text.toString()
    when (val result = gameEngine.askQuestion(suspectId, question)) {
        is QuestionResult.Success -> displayResponse(result.response)
    }
}
```

4. **Manage Game State**: Use the `GameEngine` as your ViewModel/Repository layer

---

## 🎨 UI Text System

All game text is managed by `UITextManager` for easy localization and styling:

```kotlin
val uiManager = UITextManager()

// Get formatted text for any screen
val mainMenu = uiManager.getMainMenuText(playerProfile)
val briefing = uiManager.getCaseBriefingText(case)
val interrogation = uiManager.getInterrogationStartText(suspect)
val result = uiManager.getCorrectAccusationText(result, case)
```

All text can be easily:
- Localized to different languages
- Styled with custom formatting
- Adapted for different UI frameworks (Android, Web, Desktop)

---

## 🎯 Game Design Philosophy

### Procedural Generation Principles

1. **Consistency**: Each generated case is internally consistent with alibis, evidence, and timelines
2. **Fairness**: All cases are solvable with the evidence provided
3. **Variety**: Personality types, crime types, and evidence patterns create unique experiences
4. **Challenge**: Difficulty scales with player rank and settings

### AI Behavior Design

1. **Personality-Driven**: Suspects behave according to established traits
2. **Context-Aware**: Responses adapt based on questioning history and evidence shown
3. **Progressive Revelation**: Guilty suspects gradually reveal information under pressure
4. **Red Herrings**: Innocent suspects may hide unrelated secrets

### Evaluation Fairness

1. **Multiple Valid Approaches**: Players can solve cases through different evidence combinations
2. **Partial Credit**: Correct suspect with wrong motive still earns stars
3. **Learning Feedback**: Detailed explanations help players improve
4. **No Punishment for Exploration**: Evidence collection and questioning don't penalize players

---

## 🔧 Customization

### Difficulty Settings

```kotlin
val settings = GameSettings(
    difficulty = Difficulty.MASTER_SLEUTH,
    textSpeed = 1.5f,
    textSize = 1.2f,
    enableNotifications = true
)
```

### Custom Case Generation

Extend `CaseGenerator` for custom case types:

```kotlin
class CustomCaseGenerator : CaseGenerator() {
    override fun generateVictim(crimeType: CrimeType): Victim {
        // Your custom victim generation logic
    }
}
```

### Custom Dialogue Patterns

Extend `DialogueEngine` for specialized suspect behaviors:

```kotlin
class ExtendedDialogueEngine : DialogueEngine() {
    override fun generateResponse(suspect: Suspect, question: String, case: Case): DialogueResponse {
        // Your custom dialogue logic
    }
}
```

---

## 📊 Example Case Output

```
═══════════════════════════════════
「 NEW CASE ASSIGNED 」

Case #73
Priority: High

A prominent art dealer has been found dead in their gallery
after a private viewing. Three guests were present when the
death occurred. Evidence suggests foul play.

Victim: Marcus Thornwell
Location: Thornwell Gallery, Downtown
Time: 10:47 PM, Last Night

Lead Detective: You
═══════════════════════════════════

SUSPECTS:
[1] Alexander Bennett - 45 - Business Partner
    Alibi: Claims he was in the gallery office making calls
    Personality: Calculating and methodical
    Suspicion: ⭐⭐⭐⚪⚪

[2] Charlotte Fisher - 38 - Art Collector
    Alibi: Says she was examining paintings in the main hall
    Personality: Nervous and evasive
    Suspicion: ⭐⭐⚪⚪⚪

[3] Daniel Morgan - 52 - Former Partner
    Alibi: States he arrived late and found the victim
    Personality: Defensive and angry
    Suspicion: ⭐⭐⭐⭐⚪

EVIDENCE COLLECTED:
🔍 Fingerprints on wine glass - Matches suspect #1
🔍 Threatening email sent 2 days ago - From suspect #3
🔍 Security footage - Shows suspect #2 leaving 10 minutes before estimated time of death
🔍 Financial records - Victim was planning to cut ties with suspect #1
🔍 Witness testimony - Gallery assistant saw argument between victim and suspect #3

INTERROGATION TRANSCRIPT:
You: "Where were you at 10:47 PM?"
Daniel Morgan: "I told you already! I was stuck in traffic. By the time I got there, Marcus was already... gone."
[clenched fists, raised voice, becomes visibly tense]
⚠️ They seem evasive (+2 suspicion)

🎯 ACCUSATION READY
Theory Strength: Strong
Ready to accuse?
```

---

## 🧪 Testing

Run unit tests:

```bash
./gradlew test
```

Test case generation:

```kotlin
@Test
fun testCaseGeneration() {
    val generator = CaseGenerator(Difficulty.DETECTIVE)
    val case = generator.generateCase(1)

    assertEquals(1, case.suspects.count { it.isGuilty })
    assertTrue(case.evidence.size >= 10)
    assertTrue(case.criticalEvidence.isNotEmpty())
}
```

---

## 📝 Complete Feature List

### ✅ Implemented Features

- [x] Procedural case generation with 5 crime types
- [x] AI suspect personalities (10 personality traits)
- [x] Dynamic dialogue system with context awareness
- [x] Evidence collection and examination
- [x] Location investigation system
- [x] Interrogation mechanics with stress tracking
- [x] Evidence connection and theory building
- [x] Accusation evaluation with 5-star rating
- [x] Player progression (ranks, achievements, reputation)
- [x] Difficulty scaling (3 levels)
- [x] Hint system (3 levels)
- [x] Tutorial system
- [x] Case archive
- [x] Settings management
- [x] Daily bonus system
- [x] Complete UI text management
- [x] Save/load game state (serializable models)

### 🔮 Future Enhancements

- [ ] Persistent save/load to file
- [ ] More crime types (espionage, cybercrime)
- [ ] Multi-case story arcs
- [ ] Procedural victim backgrounds
- [ ] Weather and time-based evidence
- [ ] Forensics mini-games
- [ ] Suspect relationship networks
- [ ] Media/public opinion system
- [ ] Partner detective AI
- [ ] Multiplayer competitive mode

---

## 📖 API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

1. **More Evidence Types**: Add new forensic evidence categories
2. **Dialogue Depth**: Expand AI response patterns
3. **Localization**: Translate UI text to other languages
4. **Mobile UI**: Create Android UI components
5. **Test Coverage**: Increase unit test coverage

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎮 Credits

**Game Design & Implementation**: AI Detective Team

**Inspired by**: Classic detective games, procedural generation, and AI-driven narratives

---

## 📞 Support

For questions, issues, or feature requests:
- **GitHub Issues**: https://github.com/yourusername/Crime-Scene/issues
- **Documentation**: See `/docs` folder
- **Wiki**: https://github.com/yourusername/Crime-Scene/wiki

---

## 🌟 Acknowledgments

Built with:
- **Kotlin** - Modern, expressive programming language
- **Kotlinx Serialization** - For data persistence
- **Kotlinx Coroutines** - For async operations

Special thanks to the mystery/detective game genre for inspiration!

---

**Happy Detecting! 🕵️‍♂️**
