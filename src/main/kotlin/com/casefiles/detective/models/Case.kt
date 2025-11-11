package com.casefiles.detective.models

import kotlinx.serialization.Serializable

/**
 * Represents a complete criminal case
 */
@Serializable
data class Case(
    val id: String,
    val caseNumber: Int,
    val title: String,
    val priority: CasePriority,
    val crimeType: CrimeType,
    val victim: Victim,
    val crimeTimestamp: String,
    val suspects: List<Suspect>,
    val evidence: List<Evidence>,
    val locations: List<Location>,
    val difficulty: Difficulty,
    val guiltyPartyId: String,
    val actualMotive: Motive,
    val crimeDescription: String,
    val howCrimeWasCommitted: String,
    val coverUpAttempt: String,
    val criticalEvidence: List<String>, // IDs of evidence that definitively prove guilt
    var isActive: Boolean = true,
    var isSolved: Boolean = false,
    var playerAccusation: Accusation? = null,
    var rating: Int = 0, // 0-5 stars
    var timeStarted: Long = System.currentTimeMillis(),
    var timeCompleted: Long? = null
) {
    /**
     * Get case briefing text
     */
    fun getBriefing(): String {
        return buildString {
            appendLine("「 NEW CASE ASSIGNED 」")
            appendLine()
            appendLine("Case #$caseNumber")
            appendLine("Priority: $priority")
            appendLine()
            appendLine(crimeDescription)
            appendLine()
            appendLine("Victim: ${victim.name}")
            appendLine("Location: ${locations.first { it.isPrimaryCrimeScene }.name}")
            appendLine("Time: $crimeTimestamp")
            appendLine()
            appendLine("Lead Detective: You")
        }
    }

    /**
     * Get the guilty suspect
     */
    fun getGuiltyParty(): Suspect {
        return suspects.first { it.id == guiltyPartyId }
    }

    /**
     * Check if all critical evidence has been found
     */
    fun hasCriticalEvidence(): Boolean {
        val collectedEvidenceIds = evidence.filter { it.isCollected }.map { it.id }
        return criticalEvidence.any { it in collectedEvidenceIds }
    }

    /**
     * Get case completion percentage
     */
    fun getCompletionPercentage(): Int {
        val evidenceCollected = evidence.count { it.isCollected }
        val suspectsQuestioned = suspects.count { it.interrogationStatus != InterrogationStatus.NOT_QUESTIONED }
        val locationsVisited = locations.count { it.isVisited }

        val evidencePercent = (evidenceCollected.toFloat() / evidence.size) * 40
        val suspectPercent = (suspectsQuestioned.toFloat() / suspects.size) * 40
        val locationPercent = (locationsVisited.toFloat() / locations.size) * 20

        return (evidencePercent + suspectPercent + locationPercent).toInt()
    }

    /**
     * Get theory strength based on collected evidence and questioning
     */
    fun getTheoryStrength(): String {
        val completion = getCompletionPercentage()
        return when {
            completion < 30 -> "Weak"
            completion < 50 -> "Moderate"
            completion < 75 -> "Strong"
            else -> "Very Strong"
        }
    }

    /**
     * Get case summary after solving
     */
    fun getSolutionSummary(): String {
        val guilty = getGuiltyParty()
        return buildString {
            appendLine("「 CASE SUMMARY 」")
            appendLine()
            appendLine("THE CRIME:")
            appendLine(howCrimeWasCommitted)
            appendLine()
            appendLine("THE MOTIVE:")
            appendLine("${guilty.fullName} committed this $crimeType motivated by $actualMotive.")
            if (guilty.motive != null) {
                appendLine(guilty.secretInformation)
            }
            appendLine()
            appendLine("THE COVER-UP:")
            appendLine(coverUpAttempt)
            appendLine()
            appendLine("KEY EVIDENCE:")
            val keyEv = evidence.filter { it.id in criticalEvidence }
            keyEv.forEach {
                appendLine("• ${it.name}: ${it.description.take(100)}...")
            }
            appendLine()
            appendLine("CRITICAL MISTAKES:")
            val mistakes = guilty.contradictions.ifEmpty {
                listOf("The suspect left behind incriminating evidence at the scene.")
            }
            mistakes.forEach {
                appendLine("• $it")
            }
        }
    }

    override fun toString(): String = "Case #$caseNumber - \"$title\""
}

/**
 * Represents the victim of the crime
 */
@Serializable
data class Victim(
    val name: String,
    val age: Int,
    val occupation: String,
    val background: String,
    val relationships: Map<String, String> = emptyMap() // suspectId to relationship description
) {
    override fun toString(): String = "$name, $age, $occupation"
}

/**
 * Player's accusation
 */
@Serializable
data class Accusation(
    val accusedSuspectId: String,
    val selectedMotive: Motive,
    val supportingEvidenceIds: List<String>,
    val playerReasoning: String,
    val timestamp: Long = System.currentTimeMillis()
) {
    fun isCorrect(case: Case): Boolean {
        return accusedSuspectId == case.guiltyPartyId && selectedMotive == case.actualMotive
    }

    fun hasMinimumEvidence(): Boolean = supportingEvidenceIds.size >= 3

    fun hasCriticalEvidence(case: Case): Boolean {
        return case.criticalEvidence.any { it in supportingEvidenceIds }
    }
}

/**
 * Result of evaluating an accusation
 */
data class AccusationResult(
    val isCorrect: Boolean,
    val rating: Int, // 0-5 stars
    val feedback: String,
    val reputationChange: Int,
    val experienceGained: Int,
    val correctSuspect: String,
    val correctMotive: Motive,
    val whatWasMissed: List<String> = emptyList()
) {
    fun getVerdictText(): String {
        return if (isCorrect) {
            "VERDICT: Guilty as Charged"
        } else {
            "VERDICT: Insufficient Evidence"
        }
    }

    fun getRatingStars(): String = "⭐".repeat(rating) + "⚪".repeat(5 - rating)
}
