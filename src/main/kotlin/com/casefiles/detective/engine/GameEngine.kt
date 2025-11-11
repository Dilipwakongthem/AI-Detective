package com.casefiles.detective.engine

import com.casefiles.detective.ai.DialogueEngine
import com.casefiles.detective.models.*
import com.casefiles.detective.ui.UITextManager

/**
 * Main game engine that coordinates all game systems
 */
class GameEngine(
    private val playerProfile: PlayerProfile
) {
    private val caseGenerator = CaseGenerator(playerProfile.settings.difficulty)
    private val dialogueEngine = DialogueEngine()
    private val accusationEvaluator = AccusationEvaluator()
    private val uiTextManager = UITextManager()

    var currentCase: Case? = null
        private set

    var caseArchive: MutableList<Case> = mutableListOf()
        private set

    /**
     * Start a new case
     */
    fun startNewCase(): Case {
        val caseNumber = playerProfile.casesAssigned + 1
        val case = caseGenerator.generateCase(caseNumber)
        currentCase = case
        return case
    }

    /**
     * Get case briefing text
     */
    fun getCaseBriefing(): String {
        return currentCase?.getBriefing() ?: "No active case"
    }

    /**
     * Visit a location and reveal evidence
     */
    fun visitLocation(locationId: String): LocationVisitResult {
        val case = currentCase ?: return LocationVisitResult.NoActiveCase

        val location = case.locations.find { it.id == locationId }
            ?: return LocationVisitResult.InvalidLocation

        location.isVisited = true

        // Get evidence at this location
        val evidence = case.evidence.filter { it.id in location.evidenceIds }

        return LocationVisitResult.Success(
            location = location,
            availableEvidence = evidence
        )
    }

    /**
     * Collect a piece of evidence
     */
    fun collectEvidence(evidenceId: String): EvidenceCollectionResult {
        val case = currentCase ?: return EvidenceCollectionResult.NoActiveCase

        val evidence = case.evidence.find { it.id == evidenceId }
            ?: return EvidenceCollectionResult.InvalidEvidence

        if (evidence.isCollected) {
            return EvidenceCollectionResult.AlreadyCollected
        }

        evidence.isCollected = true
        evidence.isExamined = true

        // Update location evidence count
        case.locations.forEach { location ->
            if (evidenceId in location.evidenceIds) {
                location.evidenceCollectedCount++
            }
        }

        return EvidenceCollectionResult.Success(evidence)
    }

    /**
     * Connect two pieces of evidence
     */
    fun connectEvidence(
        evidenceId1: String,
        evidenceId2: String,
        reasoning: String
    ): EvidenceConnectionResult {
        val case = currentCase ?: return EvidenceConnectionResult.NoActiveCase

        val ev1 = case.evidence.find { it.id == evidenceId1 }
            ?: return EvidenceConnectionResult.InvalidEvidence

        val ev2 = case.evidence.find { it.id == evidenceId2 }
            ?: return EvidenceConnectionResult.InvalidEvidence

        if (!ev1.isCollected || !ev2.isCollected) {
            return EvidenceConnectionResult.EvidenceNotCollected
        }

        val connection = EvidenceConnection(evidenceId1, evidenceId2, reasoning)

        ev1.connections.add(evidenceId2)
        ev2.connections.add(evidenceId1)

        return EvidenceConnectionResult.Success(connection)
    }

    /**
     * Start interrogation with a suspect
     */
    fun startInterrogation(suspectId: String): InterrogationStartResult {
        val case = currentCase ?: return InterrogationStartResult.NoActiveCase

        val suspect = case.suspects.find { it.id == suspectId }
            ?: return InterrogationStartResult.InvalidSuspect

        if (suspect.interrogationStatus == InterrogationStatus.NOT_QUESTIONED) {
            suspect.interrogationStatus = InterrogationStatus.INTERVIEWED
        }

        return InterrogationStartResult.Success(suspect)
    }

    /**
     * Ask a suspect a question
     */
    fun askQuestion(suspectId: String, question: String): QuestionResult {
        val case = currentCase ?: return QuestionResult.NoActiveCase

        val suspect = case.suspects.find { it.id == suspectId }
            ?: return QuestionResult.InvalidSuspect

        val response = dialogueEngine.generateResponse(suspect, question, case)

        // Update suspicion level
        if (response.suspicionChange > 0) {
            val newLevel = (suspect.suspicionLevel.stars + response.suspicionChange).coerceIn(1, 5)
            suspect.suspicionLevel = SuspicionLevel.entries.find { it.stars == newLevel }
                ?: suspect.suspicionLevel
        }

        // Update interrogation status
        if (suspect.contradictions.size >= 2) {
            suspect.interrogationStatus = InterrogationStatus.SUSPICIOUS
        }

        return QuestionResult.Success(response)
    }

    /**
     * Show evidence to a suspect
     */
    fun showEvidence(suspectId: String, evidenceId: String): EvidenceShowResult {
        val case = currentCase ?: return EvidenceShowResult.NoActiveCase

        val suspect = case.suspects.find { it.id == suspectId }
            ?: return EvidenceShowResult.InvalidSuspect

        val evidence = case.evidence.find { it.id == evidenceId }
            ?: return EvidenceShowResult.InvalidEvidence

        if (!evidence.isCollected) {
            return EvidenceShowResult.EvidenceNotCollected
        }

        val response = dialogueEngine.generateEvidenceResponse(suspect, evidence, case)

        // Update suspicion level
        val newLevel = (suspect.suspicionLevel.stars + response.suspicionChange).coerceIn(1, 5)
        suspect.suspicionLevel = SuspicionLevel.entries.find { it.stars == newLevel }
            ?: suspect.suspicionLevel

        return EvidenceShowResult.Success(response)
    }

    /**
     * Make an accusation
     */
    fun makeAccusation(accusation: Accusation): AccusationOutcome {
        val case = currentCase ?: return AccusationOutcome.NoActiveCase

        // Evaluate the accusation
        val result = accusationEvaluator.evaluateAccusation(accusation, case)

        // Update case
        case.playerAccusation = accusation
        case.rating = result.rating
        case.timeCompleted = System.currentTimeMillis()

        if (result.isCorrect) {
            // Correct accusation
            case.isSolved = true
            case.isActive = false

            // Update player profile
            playerProfile.recordCaseCompletion(result.rating, result.reputationChange)

            // Move to archive
            caseArchive.add(case)
            currentCase = null

            return AccusationOutcome.Correct(result)
        } else {
            // Wrong accusation - reputation loss but can continue
            playerProfile.addReputation(result.reputationChange) // Will be negative

            return AccusationOutcome.Incorrect(result)
        }
    }

    /**
     * Get a hint
     */
    fun requestHint(level: Int): HintResult {
        val case = currentCase ?: return HintResult.NoActiveCase

        val cost = when (level) {
            1 -> 0 // Subtle hints are free
            2 -> playerProfile.settings.difficulty.getHintCost() / 2
            else -> playerProfile.settings.difficulty.getHintCost()
        }

        if (level > 1 && playerProfile.reputation < cost && playerProfile.hintsAvailable == 0) {
            return HintResult.InsufficientReputation(cost)
        }

        // Deduct cost
        if (level > 1) {
            if (playerProfile.hintsAvailable > 0) {
                playerProfile.hintsAvailable--
            } else {
                playerProfile.addReputation(-cost)
            }
        }

        val hint = accusationEvaluator.generateHint(case, level)

        return HintResult.Success(hint, cost)
    }

    /**
     * Abandon current case
     */
    fun abandonCase(): Boolean {
        val case = currentCase ?: return false

        case.isActive = false
        case.isSolved = false

        playerProfile.recordCaseFailed()

        caseArchive.add(case)
        currentCase = null

        return true
    }

    /**
     * Get case progress information
     */
    fun getCaseProgress(): CaseProgress? {
        val case = currentCase ?: return null

        return CaseProgress(
            caseNumber = case.caseNumber,
            completionPercentage = case.getCompletionPercentage(),
            evidenceCollected = case.evidence.count { it.isCollected },
            totalEvidence = case.evidence.size,
            suspectsQuestioned = case.suspects.count { it.interrogationStatus != InterrogationStatus.NOT_QUESTIONED },
            totalSuspects = case.suspects.size,
            locationsVisited = case.locations.count { it.isVisited },
            totalLocations = case.locations.size,
            theoryStrength = case.getTheoryStrength()
        )
    }

    /**
     * Get all suspects with their current status
     */
    fun getAllSuspects(): List<Suspect> {
        return currentCase?.suspects ?: emptyList()
    }

    /**
     * Get all collected evidence
     */
    fun getCollectedEvidence(): List<Evidence> {
        return currentCase?.evidence?.filter { it.isCollected } ?: emptyList()
    }

    /**
     * Get all locations
     */
    fun getAllLocations(): List<Location> {
        return currentCase?.locations ?: emptyList()
    }

    /**
     * Claim daily bonus
     */
    fun claimDailyBonus(): DailyBonus? {
        val now = System.currentTimeMillis()
        val lastClaimed = playerProfile.dailyBonusClaimed

        // Check if 24 hours have passed
        val dayInMillis = 24 * 60 * 60 * 1000
        if (now - lastClaimed < dayInMillis) {
            return null // Already claimed today
        }

        val dayNumber = ((now - lastClaimed) / dayInMillis).toInt() + 1

        val bonus = DailyBonus(
            dayNumber = dayNumber,
            reputationPoints = 50 + (dayNumber * 10),
            freeHints = 3,
            specialCaseAvailable = dayNumber % 7 == 0 // Every 7 days
        )

        playerProfile.addReputation(bonus.reputationPoints)
        playerProfile.hintsAvailable += bonus.freeHints
        playerProfile.dailyBonusClaimed = now

        return bonus
    }

    /**
     * Get player statistics
     */
    fun getPlayerStats(): PlayerProfile {
        return playerProfile
    }
}

/**
 * Results for various game operations
 */
sealed class LocationVisitResult {
    data class Success(val location: Location, val availableEvidence: List<Evidence>) : LocationVisitResult()
    object NoActiveCase : LocationVisitResult()
    object InvalidLocation : LocationVisitResult()
}

sealed class EvidenceCollectionResult {
    data class Success(val evidence: Evidence) : EvidenceCollectionResult()
    object NoActiveCase : EvidenceCollectionResult()
    object InvalidEvidence : EvidenceCollectionResult()
    object AlreadyCollected : EvidenceCollectionResult()
}

sealed class EvidenceConnectionResult {
    data class Success(val connection: EvidenceConnection) : EvidenceConnectionResult()
    object NoActiveCase : EvidenceConnectionResult()
    object InvalidEvidence : EvidenceConnectionResult()
    object EvidenceNotCollected : EvidenceConnectionResult()
}

sealed class InterrogationStartResult {
    data class Success(val suspect: Suspect) : InterrogationStartResult()
    object NoActiveCase : InterrogationStartResult()
    object InvalidSuspect : InterrogationStartResult()
}

sealed class QuestionResult {
    data class Success(val response: DialogueResponse) : QuestionResult()
    object NoActiveCase : QuestionResult()
    object InvalidSuspect : QuestionResult()
}

sealed class EvidenceShowResult {
    data class Success(val response: DialogueResponse) : EvidenceShowResult()
    object NoActiveCase : EvidenceShowResult()
    object InvalidSuspect : EvidenceShowResult()
    object InvalidEvidence : EvidenceShowResult()
    object EvidenceNotCollected : EvidenceShowResult()
}

sealed class AccusationOutcome {
    data class Correct(val result: AccusationResult) : AccusationOutcome()
    data class Incorrect(val result: AccusationResult) : AccusationOutcome()
    object NoActiveCase : AccusationOutcome()
}

sealed class HintResult {
    data class Success(val hint: String, val cost: Int) : HintResult()
    data class InsufficientReputation(val required: Int) : HintResult()
    object NoActiveCase : HintResult()
}

/**
 * Case progress information
 */
data class CaseProgress(
    val caseNumber: Int,
    val completionPercentage: Int,
    val evidenceCollected: Int,
    val totalEvidence: Int,
    val suspectsQuestioned: Int,
    val totalSuspects: Int,
    val locationsVisited: Int,
    val totalLocations: Int,
    val theoryStrength: String
) {
    fun getProgressText(): String {
        return buildString {
            appendLine("Case #$caseNumber Progress: $completionPercentage%")
            appendLine()
            appendLine("Evidence: $evidenceCollected/$totalEvidence collected")
            appendLine("Suspects: $suspectsQuestioned/$totalSuspects questioned")
            appendLine("Locations: $locationsVisited/$totalLocations visited")
            appendLine()
            appendLine("Theory Strength: $theoryStrength")
        }
    }
}
