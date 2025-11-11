package com.casefiles.detective.models

import kotlinx.serialization.Serializable

/**
 * Represents a suspect in the investigation
 */
@Serializable
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
    val behavioralQuirks: List<String>,
    val relatedEvidenceIds: List<String>,
    var interrogationStatus: InterrogationStatus = InterrogationStatus.NOT_QUESTIONED,
    var suspicionLevel: SuspicionLevel = SuspicionLevel.MEDIUM,
    var questionsAsked: MutableList<String> = mutableListOf(),
    var evidenceShown: MutableList<String> = mutableListOf(),
    var hasConfessed: Boolean = false,
    var revealedSecrets: MutableList<String> = mutableListOf(),
    var contradictions: MutableList<String> = mutableListOf()
) {
    /**
     * Get the suspect's appearance and demeanor description
     */
    fun getAppearanceDescription(): String {
        val ageDesc = when {
            age < 25 -> "young"
            age < 40 -> "middle-aged"
            age < 60 -> "mature"
            else -> "elderly"
        }

        val demeanorDesc = personality.getDialogueTone()

        return buildString {
            append("$fullName enters the interrogation room. ")
            append("The $ageDesc $occupation $demeanorDesc. ")

            if (isGuilty) {
                when (personality) {
                    PersonalityTrait.NERVOUS -> append("They seem unusually anxious.")
                    PersonalityTrait.CONFIDENT -> append("They're working hard to appear calm.")
                    PersonalityTrait.ARROGANT -> append("They seem irritated by the inconvenience.")
                    PersonalityTrait.DEFENSIVE -> append("Their body language is closed off and guarded.")
                    else -> append("Something feels off about their demeanor.")
                }
            } else {
                when (personality) {
                    PersonalityTrait.COOPERATIVE -> append("They seem genuinely willing to help.")
                    PersonalityTrait.NERVOUS -> append("They appear worried about the situation.")
                    PersonalityTrait.SHY -> append("They seem uncomfortable with the attention.")
                    else -> append("They appear to be taking this seriously.")
                }
            }
        }
    }

    /**
     * Get opening statement from suspect
     */
    fun getOpeningStatement(): String {
        return when {
            isGuilty && personality == PersonalityTrait.ARROGANT ->
                "I don't appreciate being dragged in here. I have important matters to attend to."

            isGuilty && personality == PersonalityTrait.NERVOUS ->
                "I... I don't know what you think I did, but I'm happy to answer your questions."

            !isGuilty && personality == PersonalityTrait.COOPERATIVE ->
                "This is terrible what happened. I'll tell you everything I know to help catch whoever did this."

            !isGuilty && personality == PersonalityTrait.DEFENSIVE ->
                "I hope this won't take long. I already told your colleagues everything I know."

            isGuilty && personality == PersonalityTrait.CALCULATING ->
                "Detective. I understand you have questions. I'm prepared to answer them."

            else ->
                "I'm ready to answer your questions, Detective."
        }
    }

    /**
     * Get the suspect's emotional state based on current situation
     */
    fun getCurrentEmotionalState(): EmotionalState {
        return when {
            hasConfessed -> EmotionalState.RESIGNED
            contradictions.size >= 3 && isGuilty -> EmotionalState.PANICKED
            evidenceShown.size >= 3 && isGuilty -> EmotionalState.DEFENSIVE
            !isGuilty && suspicionLevel.stars >= 4 -> EmotionalState.ANGRY
            questionsAsked.size >= 5 && isGuilty -> EmotionalState.NERVOUS
            else -> when (personality) {
                PersonalityTrait.NERVOUS -> EmotionalState.NERVOUS
                PersonalityTrait.CONFIDENT -> EmotionalState.CALM
                PersonalityTrait.EMOTIONAL -> EmotionalState.SAD
                PersonalityTrait.AGGRESSIVE -> EmotionalState.ANGRY
                else -> EmotionalState.CALM
            }
        }
    }

    /**
     * Get stress level (0-100) based on interrogation pressure
     */
    fun getStressLevel(): Int {
        if (!isGuilty) return 20 + (suspicionLevel.stars * 10)

        var stress = 40
        stress += questionsAsked.size * 5
        stress += evidenceShown.size * 15
        stress += contradictions.size * 20
        return stress.coerceIn(0, 100)
    }

    override fun toString(): String = "$fullName - $age - $occupation"

    fun getStatusString(): String = "Status: $interrogationStatus | Suspicion: ${suspicionLevel.toStarString()}"
}

/**
 * Represents a suspect's alibi
 */
@Serializable
data class Alibi(
    val location: String,
    val timeRange: String,
    val description: String,
    val witnesses: List<String> = emptyList(),
    val canBeVerified: Boolean,
    val hasHoles: Boolean = false,
    val contradictoryEvidence: List<String> = emptyList()
) {
    fun getFullDescription(): String {
        return buildString {
            append("I was at $location during $timeRange. ")
            append(description)

            if (witnesses.isNotEmpty()) {
                append(" ${witnesses.joinToString(" and ")} can vouch for me.")
            }
        }
    }

    fun isConsistentWithEvidence(evidenceIds: List<String>): Boolean {
        return contradictoryEvidence.none { it in evidenceIds }
    }
}

/**
 * Dialogue response from a suspect
 */
@Serializable
data class DialogueResponse(
    val suspectId: String,
    val questionAsked: String,
    val response: String,
    val emotionalState: EmotionalState,
    val bodyLanguage: String,
    val isTruthful: Boolean,
    val revealsInformation: String? = null,
    val createsContradiction: Boolean = false,
    val suspicionChange: Int = 0 // -2 to +2
) {
    fun getFormattedResponse(suspectName: String): String {
        return buildString {
            appendLine("$suspectName: \"$response\"")
            appendLine()
            appendLine("[$bodyLanguage]")

            if (suspicionChange > 0) {
                appendLine()
                appendLine("⚠️ They seem evasive (+${suspicionChange} suspicion)")
            } else if (suspicionChange < 0) {
                appendLine()
                appendLine("✓ Their answer seems genuine")
            }
        }
    }
}
