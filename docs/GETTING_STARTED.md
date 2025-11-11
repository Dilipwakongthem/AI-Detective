# Getting Started Guide

## Quick Start for Developers

This guide will help you integrate the Case Files: AI Detective game engine into your application.

---

## Table of Contents

1. [Installation](#installation)
2. [Basic Setup](#basic-setup)
3. [Your First Case](#your-first-case)
4. [Interrogation System](#interrogation-system)
5. [Evidence Collection](#evidence-collection)
6. [Making Accusations](#making-accusations)
7. [Android Integration](#android-integration)
8. [Customization](#customization)

---

## Installation

### Gradle (Kotlin JVM)

Add to your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.20")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
}
```

### Direct Integration

Copy the following packages to your project:
```
com/casefiles/detective/
├── models/
├── engine/
├── ai/
└── ui/
```

---

## Basic Setup

### 1. Create a Player Profile

```kotlin
import com.casefiles.detective.models.*

val playerProfile = PlayerProfile(
    badgeNumber = "DT-${Random().nextInt(10000, 99999)}",
    playerName = "Detective Smith",
    reputation = 0,
    rank = DetectiveRank.CADET
)

// Unlock starting tool
playerProfile.unlockedTools.add(DetectiveTool.BASIC_INVESTIGATION_KIT)
```

### 2. Initialize the Game Engine

```kotlin
import com.casefiles.detective.engine.GameEngine

val gameEngine = GameEngine(playerProfile)
```

### 3. Start a New Case

```kotlin
val case = gameEngine.startNewCase()

// Display case briefing
println(case.getBriefing())

// Output:
// ═══════════════════════════════════
// 「 NEW CASE ASSIGNED 」
// Case #1
// Priority: High
// ...
```

---

## Your First Case

### Complete Minimal Example

```kotlin
import com.casefiles.detective.engine.*
import com.casefiles.detective.models.*

fun main() {
    // Setup
    val profile = PlayerProfile(
        badgeNumber = "DT-12345",
        playerName = "Detective"
    )
    profile.unlockedTools.add(DetectiveTool.BASIC_INVESTIGATION_KIT)

    val engine = GameEngine(profile)

    // Start case
    val case = engine.startNewCase()
    println("New case: ${case.title}")
    println("Crime: ${case.crimeType}")
    println("Suspects: ${case.suspects.size}")

    // Visit first location
    val location = case.locations.first()
    when (val result = engine.visitLocation(location.id)) {
        is LocationVisitResult.Success -> {
            println("\nVisiting: ${result.location.name}")
            println("Evidence found: ${result.availableEvidence.size}")

            // Collect first evidence
            result.availableEvidence.firstOrNull()?.let { evidence ->
                engine.collectEvidence(evidence.id)
                println("Collected: ${evidence.name}")
            }
        }
        else -> println("Cannot visit location")
    }

    // Question first suspect
    val suspect = case.suspects.first()
    engine.startInterrogation(suspect.id)

    when (val result = engine.askQuestion(suspect.id, "Where were you at the time of the crime?")) {
        is QuestionResult.Success -> {
            println("\nAsked: ${result.response.questionAsked}")
            println("${suspect.fullName}: \"${result.response.response}\"")
            println("[${result.response.bodyLanguage}]")
        }
        else -> println("Cannot ask question")
    }

    // Check progress
    val progress = engine.getCaseProgress()
    println("\nCase Progress: ${progress?.completionPercentage}%")
}
```

---

## Interrogation System

### Basic Questioning

```kotlin
// Start interrogation
engine.startInterrogation(suspectId)

// Ask a question
val questions = listOf(
    "Where were you at 10:47 PM?",
    "What was your relationship with the victim?",
    "Can anyone verify your alibi?",
    "Why should I believe you?"
)

questions.forEach { question ->
    when (val result = engine.askQuestion(suspectId, question)) {
        is QuestionResult.Success -> {
            val response = result.response

            println("Q: $question")
            println("A: ${response.response}")
            println("Body Language: ${response.bodyLanguage}")
            println("Truthful: ${response.isTruthful}")

            if (response.createsContradiction) {
                println("⚠️ CONTRADICTION!")
            }
        }
        else -> println("Error asking question")
    }
}
```

### Showing Evidence

```kotlin
// Collect evidence first
engine.collectEvidence(evidenceId)

// Show it to suspect
when (val result = engine.showEvidence(suspectId, evidenceId)) {
    is EvidenceShowResult.Success -> {
        val response = result.response

        println("You show: ${evidence.name}")
        println("Response: ${response.response}")

        if (suspect.hasConfessed) {
            println("🚨 SUSPECT CONFESSED!")
        }
    }
    is EvidenceShowResult.EvidenceNotCollected ->
        println("You haven't collected that evidence yet")
    else ->
        println("Cannot show evidence")
}
```

### Tracking Suspect Behavior

```kotlin
// Check suspect's state
println("Stress Level: ${suspect.getStressLevel()}%")
println("Suspicion: ${suspect.suspicionLevel.toStarString()}")
println("Emotional State: ${suspect.getCurrentEmotionalState()}")

// Review interrogation history
println("Questions Asked: ${suspect.questionsAsked.size}")
println("Evidence Shown: ${suspect.evidenceShown.size}")
println("Contradictions: ${suspect.contradictions.size}")
```

---

## Evidence Collection

### Investigating Locations

```kotlin
// Get all locations
val locations = engine.getAllLocations()

// Visit each location
locations.forEach { location ->
    when (val result = engine.visitLocation(location.id)) {
        is LocationVisitResult.Success -> {
            println("\n${result.location.name}")
            println(result.location.description)

            // Collect all evidence
            result.availableEvidence.forEach { evidence ->
                when (engine.collectEvidence(evidence.id)) {
                    is EvidenceCollectionResult.Success ->
                        println("✓ Collected: ${evidence.name}")
                    is EvidenceCollectionResult.AlreadyCollected ->
                        println("Already have: ${evidence.name}")
                    else ->
                        println("Cannot collect")
                }
            }
        }
        else -> println("Cannot visit location")
    }
}
```

### Examining Evidence

```kotlin
val evidence = engine.getCollectedEvidence()

evidence.forEach { ev ->
    println("\n${ev.name}")
    println(ev.getDetailedDescription())
    println("Category: ${ev.category}")
    println("Found at: ${ev.locationFound}")

    if (ev.isIncriminating) {
        println("⚠️ This is incriminating evidence!")
    }
}
```

### Connecting Evidence

```kotlin
// Connect two pieces of evidence
val ev1 = evidence[0]
val ev2 = evidence[1]

val reasoning = "Both pieces place the suspect at the crime scene"

when (val result = engine.connectEvidence(ev1.id, ev2.id, reasoning)) {
    is EvidenceConnectionResult.Success -> {
        println("✓ Connected: ${ev1.name} ↔ ${ev2.name}")
        println("Reasoning: ${result.connection.connectionReasoning}")
    }
    else -> println("Cannot connect evidence")
}
```

---

## Making Accusations

### Preparing the Accusation

```kotlin
// Review all suspects
val suspects = engine.getAllSuspects()
suspects.forEach { suspect ->
    println("${suspect.fullName}")
    println("  Suspicion: ${suspect.suspicionLevel.toStarString()}")
    println("  Questioned: ${suspect.questionsAsked.size} times")
    println("  Contradictions: ${suspect.contradictions.size}")
}

// Check theory strength
val progress = engine.getCaseProgress()
println("\nTheory Strength: ${progress?.theoryStrength}")
```

### Making the Accusation

```kotlin
// Build accusation
val accusation = Accusation(
    accusedSuspectId = selectedSuspect.id,
    selectedMotive = Motive.FINANCIAL_GAIN,
    supportingEvidenceIds = listOf(
        evidence[0].id,
        evidence[2].id,
        evidence[5].id
    ),
    playerReasoning = """
        The suspect had both motive and opportunity. Financial records show
        they were in debt. Their alibi is contradicted by witness testimony.
        Fingerprints place them at the crime scene during the critical window.
    """.trimIndent()
)

// Submit accusation
when (val outcome = engine.makeAccusation(accusation)) {
    is AccusationOutcome.Correct -> {
        val result = outcome.result
        println("🎯 CASE SOLVED!")
        println("Rating: ${result.getRatingStars()}")
        println("Reputation: +${result.reputationChange}")
        println("Experience: +${result.experienceGained}")
        println("\nFeedback:")
        println(result.feedback)
    }

    is AccusationOutcome.Incorrect -> {
        val result = outcome.result
        println("❌ ACCUSATION REJECTED")
        println("Reputation: ${result.reputationChange}")
        println("\nFeedback:")
        println(result.feedback)
        println("\nWhat you missed:")
        result.whatWasMissed.forEach { println("• $it") }

        // Continue investigating
        println("\nYou can continue investigating...")
    }

    else -> println("Error making accusation")
}
```

---

## Android Integration

### ViewModel Setup

```kotlin
// In your ViewModel
class GameViewModel : ViewModel() {
    private val playerProfile = PlayerProfile(
        badgeNumber = "DT-${Random.nextInt(10000, 99999)}",
        playerName = "Detective"
    ).apply {
        unlockedTools.add(DetectiveTool.BASIC_INVESTIGATION_KIT)
    }

    val gameEngine = GameEngine(playerProfile)

    // LiveData for UI observation
    private val _currentCase = MutableLiveData<Case?>()
    val currentCase: LiveData<Case?> = _currentCase

    private val _suspects = MutableLiveData<List<Suspect>>()
    val suspects: LiveData<List<Suspect>> = _suspects

    fun startNewCase() {
        val case = gameEngine.startNewCase()
        _currentCase.value = case
        _suspects.value = case.suspects
    }

    fun askQuestion(suspectId: String, question: String) {
        when (val result = gameEngine.askQuestion(suspectId, question)) {
            is QuestionResult.Success -> {
                // Update UI with response
                _dialogueResponse.value = result.response
                // Refresh suspect list
                _suspects.value = gameEngine.getAllSuspects()
            }
            else -> _error.value = "Cannot ask question"
        }
    }
}
```

### Activity/Fragment Usage

```kotlin
class InvestigationActivity : AppCompatActivity() {
    private val viewModel: GameViewModel by viewModels()
    private lateinit var binding: ActivityInvestigationBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityInvestigationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Observe current case
        viewModel.currentCase.observe(this) { case ->
            case?.let { displayCase(it) }
        }

        // Start new case button
        binding.startCaseButton.setOnClickListener {
            viewModel.startNewCase()
        }
    }

    private fun displayCase(case: Case) {
        binding.caseTitle.text = case.title
        binding.caseDescription.text = case.crimeDescription
        binding.suspectCount.text = "${case.suspects.size} Suspects"
        binding.evidenceCount.text = "${case.evidence.size} Evidence Items"
    }
}
```

### Interrogation Fragment

```kotlin
class InterrogationFragment : Fragment() {
    private val viewModel: GameViewModel by activityViewModels()

    private fun setupQuestionInput() {
        binding.askButton.setOnClickListener {
            val question = binding.questionInput.text.toString()
            val suspectId = arguments?.getString("suspect_id") ?: return@setOnClickListener

            viewModel.askQuestion(suspectId, question)
        }

        // Observe dialogue response
        viewModel.dialogueResponse.observe(viewLifecycleOwner) { response ->
            displayDialogue(response)
        }
    }

    private fun displayDialogue(response: DialogueResponse) {
        binding.suspectResponse.text = response.response
        binding.bodyLanguage.text = "[${response.bodyLanguage}]"

        if (response.createsContradiction) {
            binding.contradictionWarning.visibility = View.VISIBLE
        }
    }
}
```

---

## Customization

### Custom Difficulty Settings

```kotlin
// Create custom difficulty
val customDifficulty = Difficulty.DETECTIVE

// Create game with custom settings
val settings = GameSettings(
    difficulty = customDifficulty,
    textSpeed = 1.5f,
    enableNotifications = true
)

playerProfile.settings = settings
val engine = GameEngine(playerProfile)
```

### Custom Case Generator

```kotlin
class CustomCaseGenerator(difficulty: Difficulty) : CaseGenerator(difficulty) {

    // Override to add custom crimes
    override fun generateVictim(crimeType: CrimeType): Victim {
        // Your custom logic
        return super.generateVictim(crimeType)
    }

    // Add custom evidence types
    override fun generateEvidence(...): List<Evidence> {
        // Your custom evidence generation
        return super.generateEvidence(...)
    }
}

// Use custom generator
val customEngine = GameEngine(playerProfile).apply {
    // Replace generator via reflection or composition
}
```

### Custom UI Themes

```kotlin
// Extend UITextManager for custom formatting
class ThemedUITextManager : UITextManager() {

    override fun getMainMenuText(profile: PlayerProfile): String {
        return buildString {
            appendLine("╔═══════════════════════════════════╗")
            appendLine("║   🔍 CASE FILES: AI DETECTIVE 🔍 ║")
            appendLine("╠═══════════════════════════════════╣")
            // Custom styling
            appendLine("║ Your Rank: ${profile.rank.getDisplayName()}")
            // ...
        }
    }
}

val customUI = ThemedUITextManager()
```

---

## Common Patterns

### Save/Load Game State

```kotlin
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString

// Save
fun saveGame(engine: GameEngine, file: File) {
    val state = GameSaveState(
        playerProfile = engine.getPlayerStats(),
        currentCase = engine.currentCase,
        caseArchive = engine.caseArchive
    )

    val json = Json.encodeToString(state)
    file.writeText(json)
}

// Load
fun loadGame(file: File): GameEngine {
    val json = file.readText()
    val state = Json.decodeFromString<GameSaveState>(json)

    return GameEngine(state.playerProfile).apply {
        currentCase = state.currentCase
        caseArchive = state.caseArchive.toMutableList()
    }
}
```

### Progress Tracking

```kotlin
fun displayProgress(engine: GameEngine) {
    val progress = engine.getCaseProgress() ?: return

    println("""
        Case Progress: ${progress.completionPercentage}%

        Investigation:
        • Evidence: ${progress.evidenceCollected}/${progress.totalEvidence}
        • Suspects: ${progress.suspectsQuestioned}/${progress.totalSuspects}
        • Locations: ${progress.locationsVisited}/${progress.totalLocations}

        Theory Strength: ${progress.theoryStrength}
    """.trimIndent())
}
```

### Hint System

```kotlin
fun getHelpIfNeeded(engine: GameEngine) {
    val progress = engine.getCaseProgress() ?: return

    if (progress.completionPercentage < 30) {
        // Offer subtle hint
        when (val result = engine.requestHint(1)) {
            is HintResult.Success -> println("Hint: ${result.hint}")
            else -> {}
        }
    } else if (progress.completionPercentage < 50) {
        // Offer moderate hint
        println("Would you like a hint? (Cost: 25 reputation)")
    }
}
```

---

## Testing

### Unit Test Example

```kotlin
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class GameEngineTest {

    @Test
    fun testCaseGeneration() {
        val profile = PlayerProfile(badgeNumber = "TEST-001")
        val engine = GameEngine(profile)

        val case = engine.startNewCase()

        assertEquals(1, case.caseNumber)
        assertTrue(case.suspects.isNotEmpty())
        assertTrue(case.evidence.isNotEmpty())
        assertEquals(1, case.suspects.count { it.isGuilty })
    }

    @Test
    fun testInterrogation() {
        val engine = GameEngine(PlayerProfile(badgeNumber = "TEST-002"))
        val case = engine.startNewCase()
        val suspect = case.suspects.first()

        engine.startInterrogation(suspect.id)
        val result = engine.askQuestion(suspect.id, "Where were you?")

        assertTrue(result is QuestionResult.Success)
    }
}
```

---

## Troubleshooting

### Common Issues

**Q: Case generation is slow**
```kotlin
// Generate cases on background thread
lifecycleScope.launch(Dispatchers.Default) {
    val case = engine.startNewCase()
    withContext(Dispatchers.Main) {
        updateUI(case)
    }
}
```

**Q: Memory usage is high**
```kotlin
// Archive old cases and clear
if (engine.caseArchive.size > 50) {
    engine.caseArchive.removeFirst()
}
```

**Q: Suspects always confess immediately**
```kotlin
// Check difficulty - lower difficulty = easier confessions
playerProfile.settings.difficulty = Difficulty.MASTER_SLEUTH
```

---

## Next Steps

- Read the full [API Documentation](API.md)
- Check out the [README](../README.md) for architecture details
- Explore the console demo in `GameLauncher.kt`
- Build your Android UI on top of the game engine

---

**Happy Detecting! 🕵️**
