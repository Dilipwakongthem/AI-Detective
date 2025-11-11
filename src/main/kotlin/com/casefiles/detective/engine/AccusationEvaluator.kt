package com.casefiles.detective.engine

import com.casefiles.detective.models.*

/**
 * Evaluates player accusations and determines case outcome
 */
class AccusationEvaluator {

    /**
     * Evaluate a player's accusation
     */
    fun evaluateAccusation(accusation: Accusation, case: Case): AccusationResult {
        val isCorrectSuspect = accusation.accusedSuspectId == case.guiltyPartyId
        val isCorrectMotive = accusation.selectedMotive == case.actualMotive
        val hasCriticalEvidence = accusation.hasCriticalEvidence(case)
        val hasMinimumEvidence = accusation.hasMinimumEvidence()

        // Calculate rating (0-5 stars)
        val rating = calculateRating(
            isCorrectSuspect,
            isCorrectMotive,
            hasCriticalEvidence,
            hasMinimumEvidence,
            accusation,
            case
        )

        // Calculate reputation and experience rewards
        val (reputationChange, experienceGained) = calculateRewards(
            rating,
            case.difficulty,
            isCorrectSuspect
        )

        // Generate feedback
        val feedback = generateFeedback(
            accusation,
            case,
            isCorrectSuspect,
            isCorrectMotive,
            hasCriticalEvidence
        )

        // Determine what was missed
        val whatWasMissed = if (!isCorrectSuspect || rating < 5) {
            identifyMissedElements(accusation, case)
        } else {
            emptyList()
        }

        val guiltyParty = case.getGuiltyParty()

        return AccusationResult(
            isCorrect = isCorrectSuspect && isCorrectMotive,
            rating = rating,
            feedback = feedback,
            reputationChange = reputationChange,
            experienceGained = experienceGained,
            correctSuspect = guiltyParty.fullName,
            correctMotive = case.actualMotive,
            whatWasMissed = whatWasMissed
        )
    }

    /**
     * Calculate the star rating (0-5)
     */
    private fun calculateRating(
        correctSuspect: Boolean,
        correctMotive: Boolean,
        hasCriticalEvidence: Boolean,
        hasMinimumEvidence: Boolean,
        accusation: Accusation,
        case: Case
    ): Int {
        if (!correctSuspect) return 0 // Wrong suspect = 0 stars

        var stars = 1 // Base star for correct suspect

        // +1 star for correct motive
        if (correctMotive) stars++

        // +1 star for having critical evidence
        if (hasCriticalEvidence) stars++

        // +1 star for strong evidence collection
        val evidenceQuality = assessEvidenceQuality(accusation, case)
        if (evidenceQuality >= 0.7f) stars++

        // +1 star for thorough reasoning
        val reasoningQuality = assessReasoningQuality(accusation)
        if (reasoningQuality >= 0.7f) stars++

        return stars.coerceIn(0, 5)
    }

    /**
     * Assess the quality of evidence presented
     */
    private fun assessEvidenceQuality(accusation: Accusation, case: Case): Float {
        val totalRelevantEvidence = case.evidence.count {
            it.relatedSuspectIds.contains(case.guiltyPartyId)
        }

        if (totalRelevantEvidence == 0) return 1.0f

        val presentedRelevantEvidence = accusation.supportingEvidenceIds.count { evidenceId ->
            val evidence = case.evidence.find { it.id == evidenceId }
            evidence?.relatedSuspectIds?.contains(case.guiltyPartyId) == true
        }

        return presentedRelevantEvidence.toFloat() / totalRelevantEvidence
    }

    /**
     * Assess the quality of player's reasoning
     */
    private fun assessReasoningQuality(accusation: Accusation): Float {
        val reasoning = accusation.playerReasoning

        var score = 0f

        // Check length (should be substantial)
        if (reasoning.length >= 100) score += 0.2f
        if (reasoning.length >= 200) score += 0.1f

        // Check for key terms
        val keyTerms = listOf(
            "evidence", "alibi", "motive", "timeline", "witness",
            "contradiction", "fingerprint", "DNA", "because", "proves"
        )

        val termsUsed = keyTerms.count { reasoning.lowercase().contains(it) }
        score += (termsUsed.toFloat() / keyTerms.size) * 0.4f

        // Check for logical connectors
        val logicalTerms = listOf("therefore", "because", "since", "thus", "shows that", "indicates")
        if (logicalTerms.any { reasoning.lowercase().contains(it) }) {
            score += 0.3f
        }

        return score.coerceIn(0f, 1f)
    }

    /**
     * Calculate reputation and experience rewards
     */
    private fun calculateRewards(
        rating: Int,
        difficulty: Difficulty,
        isCorrectSuspect: Boolean
    ): Pair<Int, Int> {
        if (!isCorrectSuspect) {
            // Wrong accusation = lose reputation
            return Pair(-100, 0)
        }

        // Base rewards by rating
        val baseReputation = when (rating) {
            5 -> 500
            4 -> 350
            3 -> 200
            2 -> 100
            1 -> 50
            else -> 0
        }

        val baseExperience = when (rating) {
            5 -> 1000
            4 -> 700
            3 -> 450
            2 -> 250
            1 -> 100
            else -> 0
        }

        // Difficulty multiplier
        val multiplier = when (difficulty) {
            Difficulty.ROOKIE -> 1.0f
            Difficulty.DETECTIVE -> 1.5f
            Difficulty.MASTER_SLEUTH -> 2.0f
        }

        val reputation = (baseReputation * multiplier).toInt()
        val experience = (baseExperience * multiplier).toInt()

        return Pair(reputation, experience)
    }

    /**
     * Generate detailed feedback
     */
    private fun generateFeedback(
        accusation: Accusation,
        case: Case,
        correctSuspect: Boolean,
        correctMotive: Boolean,
        hasCriticalEvidence: Boolean
    ): String {
        if (!correctSuspect) {
            return generateWrongSuspectFeedback(accusation, case)
        }

        return generateCorrectSuspectFeedback(
            accusation,
            case,
            correctMotive,
            hasCriticalEvidence
        )
    }

    /**
     * Generate feedback for wrong suspect accusation
     */
    private fun generateWrongSuspectFeedback(accusation: Accusation, case: Case): String {
        val accused = case.suspects.find { it.id == accusation.accusedSuspectId }
            ?: return "Invalid accusation."

        val actual = case.getGuiltyParty()

        return buildString {
            appendLine("「 ACCUSATION REJECTED 」")
            appendLine()
            appendLine("Your accusation of ${accused.fullName} has been reviewed by the District Attorney.")
            appendLine()
            appendLine("VERDICT: Insufficient Evidence")
            appendLine()
            appendLine("The suspect has been released due to:")
            appendLine()

            // Explain why accusation failed
            if (!accused.isGuilty) {
                appendLine("• Their alibi was verified by witnesses")
                if (accused.alibi.witnesses.isNotEmpty()) {
                    appendLine("  ${accused.alibi.witnesses.joinToString(", ")} confirmed their whereabouts")
                }
                appendLine()
                appendLine("• Evidence contradicts your theory")
                val evidenceAgainst = case.evidence.filter {
                    it.id in accusation.supportingEvidenceIds &&
                    !it.relatedSuspectIds.contains(accused.id)
                }
                if (evidenceAgainst.isNotEmpty()) {
                    appendLine("  The evidence you presented doesn't actually implicate ${accused.fullName}")
                }
                appendLine()
                appendLine("• The actual perpetrator is still at large")
                appendLine("  Key evidence points to ${actual.fullName}, not ${accused.fullName}")
            }

            appendLine()
            appendLine("WHAT YOU MISSED:")
            val criticalEvidence = case.evidence.filter { it.id in case.criticalEvidence }
            criticalEvidence.forEach {
                if (it.id !in accusation.supportingEvidenceIds) {
                    appendLine("• ${it.name} - This critically important evidence was overlooked")
                }
            }
        }
    }

    /**
     * Generate feedback for correct suspect accusation
     */
    private fun generateCorrectSuspectFeedback(
        accusation: Accusation,
        case: Case,
        correctMotive: Boolean,
        hasCriticalEvidence: Boolean
    ): String {
        val guilty = case.getGuiltyParty()

        return buildString {
            appendLine("「 CASE SOLVED! 」")
            appendLine()
            appendLine("Congratulations, Detective!")
            appendLine()
            appendLine("${guilty.fullName} has been arrested and charged with ${case.crimeType}.")
            appendLine()

            if (guilty.hasConfessed) {
                appendLine("During final interrogation, ${guilty.fullName} confessed to the crime.")
                appendLine()
            }

            appendLine("CASE SUMMARY:")
            appendLine()
            appendLine(case.getSolutionSummary())
            appendLine()

            if (!correctMotive) {
                appendLine("NOTE: While you identified the correct perpetrator, the actual motive was ${case.actualMotive}, not ${accusation.selectedMotive}.")
                appendLine()
            }

            if (!hasCriticalEvidence) {
                appendLine("NOTE: Your case would have been stronger with the following critical evidence:")
                val missed = case.criticalEvidence.filter { it !in accusation.supportingEvidenceIds }
                case.evidence.filter { it.id in missed }.forEach {
                    appendLine("• ${it.name}")
                }
                appendLine()
            }

            appendLine("Your deductive reasoning and attention to detail brought justice to this case.")
        }
    }

    /**
     * Identify what the player missed
     */
    private fun identifyMissedElements(accusation: Accusation, case: Case): List<String> {
        val missed = mutableListOf<String>()

        // Check for missed critical evidence
        val missedCriticalEvidence = case.criticalEvidence.filter {
            it !in accusation.supportingEvidenceIds
        }

        if (missedCriticalEvidence.isNotEmpty()) {
            case.evidence.filter { it.id in missedCriticalEvidence }.forEach {
                missed.add("Critical evidence: ${it.name}")
            }
        }

        // Check if they didn't question the guilty party thoroughly
        val guiltyParty = case.getGuiltyParty()
        if (guiltyParty.questionsAsked.size < 5) {
            missed.add("${guiltyParty.fullName} wasn't questioned thoroughly enough")
        }

        // Check for missed contradictions
        if (guiltyParty.contradictions.isNotEmpty() && accusation.playerReasoning.lowercase().let {
            !it.contains("contradiction") && !it.contains("inconsistent")
        }) {
            missed.add("Failed to identify contradictions in ${guiltyParty.fullName}'s statements")
        }

        // Check if motive was wrong
        if (accusation.selectedMotive != case.actualMotive) {
            missed.add("Incorrect motive identified")
        }

        return missed
    }

    /**
     * Generate a hint for the player
     */
    fun generateHint(case: Case, hintLevel: Int): String {
        return when (hintLevel) {
            1 -> generateSubtleHint(case)
            2 -> generateModerateHint(case)
            else -> generateMajorHint(case)
        }
    }

    private fun generateSubtleHint(case: Case): String {
        val hints = listOf(
            "Have you thoroughly questioned everyone about their whereabouts?",
            "Some evidence items might contradict certain alibis...",
            "Pay close attention to the timeline of events.",
            "Look for inconsistencies in suspect statements.",
            "Not all evidence is equally important - focus on what directly connects to the crime."
        )
        return hints.random()
    }

    private fun generateModerateHint(case: Case): String {
        val guiltyParty = case.getGuiltyParty()
        val hints = listOf(
            "Someone's alibi doesn't quite add up when you check it against the evidence.",
            "One suspect has been more defensive than the others - why might that be?",
            "The timeline is key - can everyone account for their time during the critical window?",
            "Look carefully at who had both means and opportunity."
        )
        return hints.random()
    }

    private fun generateMajorHint(case: Case): String {
        val guiltyParty = case.getGuiltyParty()
        val criticalEv = case.evidence.find { it.id in case.criticalEvidence }

        return buildString {
            appendLine("FORENSICS REPORT")
            appendLine()
            appendLine("Detailed analysis reveals:")
            appendLine()

            if (criticalEv != null && criticalEv.isCollected) {
                appendLine("• ${criticalEv.name} is more significant than it initially appeared")
                appendLine("  This evidence directly contradicts ${guiltyParty.fullName}'s stated alibi")
            } else if (criticalEv != null) {
                appendLine("• There's crucial evidence you haven't collected yet in ${case.locations.find { criticalEv.id in it.evidenceIds }?.name}")
            } else {
                appendLine("• ${guiltyParty.fullName}'s story has holes when examined closely")
                appendLine("• Their relationship with the victim provides strong motive")
            }
        }
    }
}
