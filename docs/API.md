# API Documentation

## Game Engine API Reference

---

## Table of Contents

1. [GameEngine](#gameengine)
2. [CaseGenerator](#casegenerator)
3. [DialogueEngine](#dialogueengine)
4. [AccusationEvaluator](#accusationevaluator)
5. [UITextManager](#uitextmanager)
6. [Data Models](#data-models)
7. [Result Types](#result-types)

---

## GameEngine

The main coordinator for all game systems.

### Constructor

```kotlin
GameEngine(playerProfile: PlayerProfile)
```

### Core Methods

#### startNewCase()
```kotlin
fun startNewCase(): Case
```
Generates and starts a new procedural case.

**Returns**: Complete `Case` object with all suspects, evidence, and locations

**Example**:
```kotlin
val engine = GameEngine(playerProfile)
val case = engine.startNewCase()
println(case.getBriefing())
```

---

#### visitLocation(locationId: String)
```kotlin
fun visitLocation(locationId: String): LocationVisitResult
```
Visit a location to investigate and reveal evidence.

**Parameters**:
- `locationId`: Unique identifier of the location

**Returns**: `LocationVisitResult` (sealed class)
- `Success(location, availableEvidence)` - Location visited successfully
- `NoActiveCase` - No case is currently active
- `InvalidLocation` - Location ID doesn't exist

**Example**:
```kotlin
when (val result = engine.visitLocation(locationId)) {
    is LocationVisitResult.Success -> {
        println(result.location.getInvestigationText())
        result.availableEvidence.forEach { println(it.name) }
    }
    is LocationVisitResult.NoActiveCase -> println("No active case")
    is LocationVisitResult.InvalidLocation -> println("Invalid location")
}
```

---

#### collectEvidence(evidenceId: String)
```kotlin
fun collectEvidence(evidenceId: String): EvidenceCollectionResult
```
Collect a piece of evidence.

**Parameters**:
- `evidenceId`: Unique identifier of the evidence

**Returns**: `EvidenceCollectionResult` (sealed class)
- `Success(evidence)` - Evidence collected
- `AlreadyCollected` - Evidence was already collected
- `InvalidEvidence` - Evidence ID doesn't exist
- `NoActiveCase` - No case is active

**Example**:
```kotlin
when (val result = engine.collectEvidence(evidenceId)) {
    is EvidenceCollectionResult.Success -> {
        val evidence = result.evidence
        println("Collected: ${evidence.name}")
        println(evidence.getDetailedDescription())
    }
    is EvidenceCollectionResult.AlreadyCollected ->
        println("Already collected")
    else -> println("Cannot collect evidence")
}
```

---

#### askQuestion(suspectId: String, question: String)
```kotlin
fun askQuestion(suspectId: String, question: String): QuestionResult
```
Ask a suspect a custom question.

**Parameters**:
- `suspectId`: Unique identifier of the suspect
- `question`: The question to ask (free-form text)

**Returns**: `QuestionResult` (sealed class)
- `Success(response)` - Question answered with `DialogueResponse`
- `NoActiveCase` - No case is active
- `InvalidSuspect` - Suspect ID doesn't exist

**Example**:
```kotlin
val question = "Where were you at the time of the crime?"
when (val result = engine.askQuestion(suspectId, question)) {
    is QuestionResult.Success -> {
        val response = result.response
        println("${suspectName}: \"${response.response}\"")
        println("[${response.bodyLanguage}]")

        if (response.createsContradiction) {
            println("⚠️ CONTRADICTION DETECTED!")
        }
    }
    else -> println("Cannot ask question")
}
```

---

#### showEvidence(suspectId: String, evidenceId: String)
```kotlin
fun showEvidence(suspectId: String, evidenceId: String): EvidenceShowResult
```
Present evidence to a suspect during interrogation.

**Parameters**:
- `suspectId`: Unique identifier of the suspect
- `evidenceId`: Unique identifier of the evidence to show

**Returns**: `EvidenceShowResult` (sealed class)

**Example**:
```kotlin
when (val result = engine.showEvidence(suspectId, evidenceId)) {
    is EvidenceShowResult.Success -> {
        val response = result.response
        println("You show them: ${evidence.name}")
        println("${suspectName}: \"${response.response}\"")

        if (suspect.hasConfessed) {
            println("🚨 CONFESSION OBTAINED!")
        }
    }
    is EvidenceShowResult.EvidenceNotCollected ->
        println("You haven't collected that evidence yet")
    else -> println("Cannot show evidence")
}
```

---

#### makeAccusation(accusation: Accusation)
```kotlin
fun makeAccusation(accusation: Accusation): AccusationOutcome
```
Make a formal accusation to solve the case.

**Parameters**:
- `accusation`: Complete accusation with suspect, motive, evidence, and reasoning

**Returns**: `AccusationOutcome` (sealed class)
- `Correct(result)` - Accusation was correct
- `Incorrect(result)` - Accusation was wrong
- `NoActiveCase` - No case is active

**Example**:
```kotlin
val accusation = Accusation(
    accusedSuspectId = suspect.id,
    selectedMotive = Motive.REVENGE,
    supportingEvidenceIds = listOf(ev1.id, ev2.id, ev3.id),
    playerReasoning = "The suspect had means, motive, and opportunity..."
)

when (val outcome = engine.makeAccusation(accusation)) {
    is AccusationOutcome.Correct -> {
        val result = outcome.result
        println("🎯 CASE SOLVED!")
        println("Rating: ${result.getRatingStars()}")
        println("+${result.reputationChange} reputation")
    }
    is AccusationOutcome.Incorrect -> {
        val result = outcome.result
        println("❌ ACCUSATION REJECTED")
        println(result.feedback)
        // Can continue investigating
    }
    else -> println("Error")
}
```

---

#### getCaseProgress()
```kotlin
fun getCaseProgress(): CaseProgress?
```
Get current case progress statistics.

**Returns**: `CaseProgress` object or null if no active case

**Example**:
```kotlin
val progress = engine.getCaseProgress()
if (progress != null) {
    println("Completion: ${progress.completionPercentage}%")
    println("Evidence: ${progress.evidenceCollected}/${progress.totalEvidence}")
    println("Theory Strength: ${progress.theoryStrength}")
}
```

---

#### requestHint(level: Int)
```kotlin
fun requestHint(level: Int): HintResult
```
Request a hint from the system.

**Parameters**:
- `level`: Hint level (1=subtle/free, 2=moderate/half cost, 3=major/full cost)

**Returns**: `HintResult` (sealed class)
- `Success(hint, cost)` - Hint provided
- `InsufficientReputation(required)` - Not enough reputation points
- `NoActiveCase` - No case is active

**Example**:
```kotlin
when (val result = engine.requestHint(level = 2)) {
    is HintResult.Success -> {
        println("Hint (cost: ${result.cost} reputation):")
        println(result.hint)
    }
    is HintResult.InsufficientReputation ->
        println("Need ${result.required} reputation points")
    else -> println("No hints available")
}
```

---

## CaseGenerator

Generates procedural crime cases.

### Constructor

```kotlin
CaseGenerator(difficulty: Difficulty = Difficulty.DETECTIVE)
```

### Methods

#### generateCase(caseNumber: Int)
```kotlin
fun generateCase(caseNumber: Int): Case
```

Generates a complete, self-consistent case with:
- Crime type, victim, and narrative
- 3-6 suspects (based on difficulty)
- 8-12 pieces of evidence
- 3-5 investigable locations
- One guilty party with motive

**Example**:
```kotlin
val generator = CaseGenerator(Difficulty.MASTER_SLEUTH)
val case = generator.generateCase(caseNumber = 42)

println("Crime: ${case.crimeType}")
println("Suspects: ${case.suspects.size}")
println("Evidence: ${case.evidence.size}")
println("Guilty: ${case.getGuiltyParty().fullName}")
```

---

## DialogueEngine

AI system for generating suspect dialogue.

### Methods

#### generateResponse(suspect: Suspect, question: String, case: Case)
```kotlin
fun generateResponse(
    suspect: Suspect,
    question: String,
    case: Case
): DialogueResponse
```

Generates contextual responses based on:
- Suspect personality and guilt
- Question type (alibi, motive, timeline, etc.)
- Interrogation history
- Stress level

**Response Analysis**:
- Classifies question type automatically
- Determines truthfulness
- Generates appropriate body language
- Tracks contradictions
- Updates suspicion level

**Example**:
```kotlin
val engine = DialogueEngine()
val response = engine.generateResponse(suspect, "Where were you?", case)

println("Response: ${response.response}")
println("Truthful: ${response.isTruthful}")
println("Body Language: ${response.bodyLanguage}")
println("Emotional State: ${response.emotionalState}")
```

---

#### generateEvidenceResponse(suspect: Suspect, evidence: Evidence, case: Case)
```kotlin
fun generateEvidenceResponse(
    suspect: Suspect,
    evidence: Evidence,
    case: Case
): DialogueResponse
```

Generates response when evidence is shown to suspect:
- Guilty suspects may confess under pressure
- Innocent suspects explain the evidence
- Irrelevant evidence is dismissed

**Example**:
```kotlin
val response = engine.generateEvidenceResponse(suspect, evidence, case)

if (suspect.hasConfessed) {
    println("🚨 CONFESSION!")
} else if (!response.isTruthful) {
    println("⚠️ They're lying about this evidence")
}
```

---

## AccusationEvaluator

Evaluates player accusations and determines outcomes.

### Methods

#### evaluateAccusation(accusation: Accusation, case: Case)
```kotlin
fun evaluateAccusation(
    accusation: Accusation,
    case: Case
): AccusationResult
```

Evaluates based on:
1. Correct suspect identification
2. Correct motive identification
3. Quality of evidence presented
4. Inclusion of critical evidence
5. Reasoning quality

**Rating System**:
- ⭐⭐⭐⭐⭐ (5 stars): Perfect deduction
- ⭐⭐⭐⭐⚪ (4 stars): Strong case, minor gaps
- ⭐⭐⭐⚪⚪ (3 stars): Correct but weak evidence
- ⭐⭐⚪⚪⚪ (2 stars): Right suspect, wrong motive
- ⭐⚪⚪⚪⚪ (1 star): Correct suspect, poor reasoning
- ⚪⚪⚪⚪⚪ (0 stars): Wrong suspect

**Example**:
```kotlin
val evaluator = AccusationEvaluator()
val result = evaluator.evaluateAccusation(accusation, case)

println("Correct: ${result.isCorrect}")
println("Rating: ${result.rating}/5 stars")
println("Reputation Change: ${result.reputationChange}")
println("Feedback: ${result.feedback}")
```

---

#### generateHint(case: Case, hintLevel: Int)
```kotlin
fun generateHint(case: Case, hintLevel: Int): String
```

Generates hints of varying specificity:
- Level 1 (Subtle): General directions
- Level 2 (Moderate): Point toward specific areas
- Level 3 (Major): Reveal critical information

---

## UITextManager

Manages all game text and formatting.

### Methods

All methods return formatted strings ready for display:

```kotlin
fun getMainMenuText(profile: PlayerProfile): String
fun getCaseBriefingText(case: Case): String
fun getLocationSelectionText(locations: List<Location>, progress: String): String
fun getSuspectListText(suspects: List<Suspect>): String
fun getInterrogationStartText(suspect: Suspect): String
fun formatDialogueResponse(suspect: Suspect, response: DialogueResponse): String
fun getEvidenceBoardText(evidence: List<Evidence>, connections: List<EvidenceConnection>): String
fun getCorrectAccusationText(result: AccusationResult, case: Case): String
fun getTutorialText(step: Int): String
// ... and many more
```

**Example**:
```kotlin
val ui = UITextManager()
val menuText = ui.getMainMenuText(playerProfile)
println(menuText) // Fully formatted main menu
```

---

## Data Models

### Case

```kotlin
data class Case(
    val id: String,
    val caseNumber: Int,
    val title: String,
    val priority: CasePriority,
    val crimeType: CrimeType,
    val victim: Victim,
    val suspects: List<Suspect>,
    val evidence: List<Evidence>,
    val locations: List<Location>,
    val guiltyPartyId: String,
    val actualMotive: Motive,
    // ... more fields
)
```

**Key Methods**:
- `getBriefing()`: Get case briefing text
- `getGuiltyParty()`: Get the guilty suspect
- `getCompletionPercentage()`: Calculate progress
- `getSolutionSummary()`: Get full solution explanation

---

### Suspect

```kotlin
data class Suspect(
    val id: String,
    val fullName: String,
    val age: Int,
    val occupation: String,
    val personality: PersonalityTrait,
    val relationshipToVictim: String,
    val alibi: Alibi,
    val secretInformation: String,
    val motive: Motive?,
    val isGuilty: Boolean,
    // ... more fields
)
```

**Key Methods**:
- `getAppearanceDescription()`: Physical and demeanor description
- `getOpeningStatement()`: Initial interrogation statement
- `getCurrentEmotionalState()`: Dynamic emotional state
- `getStressLevel()`: Stress level (0-100)

---

### Evidence

```kotlin
data class Evidence(
    val id: String,
    val name: String,
    val category: EvidenceCategory,
    val locationFound: String,
    val description: String,
    val relatedSuspectIds: List<String>,
    val isIncriminating: Boolean,
    // ... more fields
)
```

**Key Methods**:
- `getDetailedDescription()`: Full formatted description
- `canConnectTo(other: Evidence)`: Check if connection is valid

---

### PlayerProfile

```kotlin
data class PlayerProfile(
    val badgeNumber: String,
    var playerName: String,
    var reputation: Int,
    var rank: DetectiveRank,
    var casesAssigned: Int,
    var casesSolved: Int,
    var perfectSolves: Int,
    var unlockedAchievements: MutableList<Achievement>,
    var settings: GameSettings,
    // ... more fields
)
```

**Key Methods**:
- `getSuccessRate()`: Calculate success percentage
- `addReputation(points)`: Add/remove reputation, returns true if rank changed
- `getProgressToNextRank()`: Percentage to next rank
- `recordCaseCompletion(rating, reputation)`: Record solved case
- `unlockAchievement(type, description)`: Unlock achievement

---

## Result Types

### Sealed Class Hierarchies

All game operations return type-safe results:

```kotlin
sealed class LocationVisitResult {
    data class Success(val location: Location, val availableEvidence: List<Evidence>)
    object NoActiveCase
    object InvalidLocation
}

sealed class QuestionResult {
    data class Success(val response: DialogueResponse)
    object NoActiveCase
    object InvalidSuspect
}

sealed class AccusationOutcome {
    data class Correct(val result: AccusationResult)
    data class Incorrect(val result: AccusationResult)
    object NoActiveCase
}

// ... and more
```

**Usage Pattern**:
```kotlin
when (val result = engine.someOperation()) {
    is ResultType.Success -> handleSuccess(result.data)
    is ResultType.Error -> handleError()
    else -> handleOtherCases()
}
```

---

## Enumerations

### CrimeType
```kotlin
enum class CrimeType {
    THEFT, MURDER, FRAUD, KIDNAPPING, ARSON
}
```

### PersonalityTrait
```kotlin
enum class PersonalityTrait {
    NERVOUS, CONFIDENT, ARROGANT, COOPERATIVE,
    DEFENSIVE, AGGRESSIVE, SHY, CALCULATING,
    EMOTIONAL, STOIC
}
```

### Difficulty
```kotlin
enum class Difficulty {
    ROOKIE,          // 3 suspects, easier cases
    DETECTIVE,       // 4-5 suspects, balanced
    MASTER_SLEUTH    // 5-6 suspects, complex cases
}
```

### DetectiveRank
```kotlin
enum class DetectiveRank(val requiredReputation: Int) {
    CADET(0),
    ROOKIE(500),
    DETECTIVE(1500),
    SENIOR_DETECTIVE(3000),
    LIEUTENANT(5000),
    CAPTAIN(8000),
    COMMANDER(12000),
    CHIEF(20000)
}
```

---

## Error Handling

The API uses sealed classes instead of exceptions for predictable error handling:

```kotlin
// ❌ Don't do this
try {
    val result = engine.askQuestion(suspectId, question)
} catch (e: Exception) {
    // Won't catch errors
}

// ✅ Do this
when (val result = engine.askQuestion(suspectId, question)) {
    is QuestionResult.Success -> // Handle success
    is QuestionResult.NoActiveCase -> // Handle no case
    is QuestionResult.InvalidSuspect -> // Handle invalid suspect
}
```

---

## Thread Safety

⚠️ **Important**: The game engine is **not thread-safe** by default.

For multi-threaded access:
```kotlin
class ThreadSafeGameEngine(profile: PlayerProfile) : GameEngine(profile) {
    private val mutex = Mutex()

    override suspend fun askQuestion(suspectId: String, question: String) = mutex.withLock {
        super.askQuestion(suspectId, question)
    }
}
```

---

## Best Practices

### 1. Always Check Result Types
```kotlin
when (val result = engine.visitLocation(id)) {
    is LocationVisitResult.Success -> {
        // Always handle success
    }
    else -> {
        // Always handle failure cases
    }
}
```

### 2. Save Game State Regularly
```kotlin
// After important events
val state = GameState(
    currentCase = engine.currentCase,
    playerProfile = engine.getPlayerStats(),
    caseArchive = engine.caseArchive
)
saveToFile(state)
```

### 3. Use UI Text Manager
```kotlin
// Don't hardcode UI text
❌ println("Case solved!")

// Use UITextManager
✅ println(uiManager.getCorrectAccusationText(result, case))
```

### 4. Validate User Input
```kotlin
// Before making accusation
if (selectedEvidence.size < 3) {
    showError("Select at least 3 pieces of evidence")
    return
}

if (reasoning.length < 100) {
    showError("Provide more detailed reasoning")
    return
}
```

---

## Performance Considerations

### Case Generation
- Case generation takes ~10-50ms on modern hardware
- Cache generated cases if needed
- Consider generating in background thread for Android

### Dialogue Generation
- Response generation is near-instantaneous (<1ms)
- No caching needed
- Safe to call on UI thread

### Evaluation
- Accusation evaluation takes ~5-20ms
- Can be done on UI thread
- Consider showing loading indicator for better UX

---

## Examples

See the `GameLauncher.kt` file for a complete working example of all API usage.

---

**For more help, see the main [README.md](../README.md)**
