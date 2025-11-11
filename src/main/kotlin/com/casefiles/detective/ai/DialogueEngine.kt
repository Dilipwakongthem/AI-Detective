package com.casefiles.detective.ai

import com.casefiles.detective.models.*
import kotlin.random.Random

/**
 * AI engine for generating suspect dialogue responses
 * Simulates realistic suspect behavior during interrogation
 */
class DialogueEngine {

    private val random = Random.Default

    /**
     * Generate a response to a player's question
     */
    fun generateResponse(
        suspect: Suspect,
        question: String,
        case: Case
    ): DialogueResponse {
        // Analyze question type
        val questionType = analyzeQuestion(question)

        // Generate appropriate response based on guilt and personality
        val response = when (questionType) {
            QuestionType.ALIBI -> respondToAlibiQuestion(suspect, question)
            QuestionType.RELATIONSHIP -> respondToRelationshipQuestion(suspect, case.victim)
            QuestionType.MOTIVE -> respondToMotiveQuestion(suspect)
            QuestionType.TIMELINE -> respondToTimelineQuestion(suspect)
            QuestionType.GENERAL -> respondToGeneralQuestion(suspect, question)
            QuestionType.ACCUSATORY -> respondToAccusation(suspect)
            QuestionType.IRRELEVANT -> respondToIrrelevantQuestion(suspect)
        }

        // Determine truthfulness
        val isTruthful = determineTruthfulness(suspect, questionType)

        // Get emotional state and body language
        val emotionalState = suspect.getCurrentEmotionalState()
        val bodyLanguage = generateBodyLanguage(suspect, emotionalState, questionType)

        // Check if response creates a contradiction
        val createsContradiction = !isTruthful && suspect.questionsAsked.size >= 2 && random.nextBoolean()

        // Calculate suspicion change
        val suspicionChange = calculateSuspicionChange(suspect, questionType, isTruthful)

        // Determine if any information is revealed
        val revealsInfo = if (!suspect.isGuilty && random.nextInt(100) < 30) {
            suspect.secretInformation
        } else null

        // Update suspect's question history
        suspect.questionsAsked.add(question)

        if (createsContradiction && suspect.isGuilty) {
            suspect.contradictions.add("Contradicted previous statement about $questionType")
        }

        return DialogueResponse(
            suspectId = suspect.id,
            questionAsked = question,
            response = response,
            emotionalState = emotionalState,
            bodyLanguage = bodyLanguage,
            isTruthful = isTruthful,
            revealsInformation = revealsInfo,
            createsContradiction = createsContradiction,
            suspicionChange = suspicionChange
        )
    }

    /**
     * Generate response when showing evidence to suspect
     */
    fun generateEvidenceResponse(
        suspect: Suspect,
        evidence: Evidence,
        case: Case
    ): DialogueResponse {
        suspect.evidenceShown.add(evidence.id)

        val response: String
        val isTruthful: Boolean
        val emotionalState: EmotionalState

        if (suspect.isGuilty && evidence.id in suspect.relatedEvidenceIds && evidence.isIncriminating) {
            // Guilty party confronted with damning evidence
            val stressLevel = suspect.getStressLevel()

            when {
                stressLevel > 80 -> {
                    // High stress - might confess or break down
                    response = generateConfessionResponse(suspect, evidence)
                    isTruthful = true
                    emotionalState = EmotionalState.RESIGNED
                    suspect.hasConfessed = true
                }
                stressLevel > 60 -> {
                    // Moderate stress - defensive
                    response = generateDefensiveResponse(suspect, evidence)
                    isTruthful = false
                    emotionalState = EmotionalState.PANICKED
                }
                else -> {
                    // Low stress - attempting to explain away
                    response = generateRationalizationResponse(suspect, evidence)
                    isTruthful = false
                    emotionalState = EmotionalState.DEFENSIVE
                }
            }
        } else if (!suspect.isGuilty && evidence.id in suspect.relatedEvidenceIds) {
            // Innocent suspect can explain the evidence
            response = generateInnocentExplanation(suspect, evidence)
            isTruthful = true
            emotionalState = if (suspect.suspicionLevel.stars >= 4) EmotionalState.ANGRY else EmotionalState.CALM
        } else {
            // Evidence doesn't relate to this suspect
            response = generateIrrelevantEvidenceResponse(suspect)
            isTruthful = true
            emotionalState = EmotionalState.CALM
        }

        val bodyLanguage = generateBodyLanguage(suspect, emotionalState, QuestionType.ACCUSATORY)

        return DialogueResponse(
            suspectId = suspect.id,
            questionAsked = "Shown: ${evidence.name}",
            response = response,
            emotionalState = emotionalState,
            bodyLanguage = bodyLanguage,
            isTruthful = isTruthful,
            suspicionChange = if (!isTruthful) 2 else -1
        )
    }

    /**
     * Analyze the type of question being asked
     */
    private fun analyzeQuestion(question: String): QuestionType {
        val lowerQuestion = question.lowercase()

        return when {
            lowerQuestion.contains("where were you") ||
            lowerQuestion.contains("alibi") ||
            lowerQuestion.contains("where you at") -> QuestionType.ALIBI

            lowerQuestion.contains("relationship") ||
            lowerQuestion.contains("know the victim") ||
            lowerQuestion.contains("victim") -> QuestionType.RELATIONSHIP

            lowerQuestion.contains("why") ||
            lowerQuestion.contains("motive") ||
            lowerQuestion.contains("reason") -> QuestionType.MOTIVE

            lowerQuestion.contains("when") ||
            lowerQuestion.contains("time") ||
            lowerQuestion.contains("timeline") -> QuestionType.TIMELINE

            lowerQuestion.contains("did you") ||
            lowerQuestion.contains("you killed") ||
            lowerQuestion.contains("you're lying") -> QuestionType.ACCUSATORY

            lowerQuestion.length < 10 -> QuestionType.IRRELEVANT

            else -> QuestionType.GENERAL
        }
    }

    private fun respondToAlibiQuestion(suspect: Suspect, question: String): String {
        if (suspect.isGuilty) {
            return when (suspect.personality) {
                PersonalityTrait.NERVOUS ->
                    "I... I was ${suspect.alibi.getFullDescription()} I swear that's the truth!"

                PersonalityTrait.CONFIDENT ->
                    suspect.alibi.getFullDescription() + " You can verify it yourself."

                PersonalityTrait.CALCULATING ->
                    "Let me be precise. ${suspect.alibi.getFullDescription()} Every detail can be checked."

                else -> suspect.alibi.getFullDescription()
            }
        } else {
            return suspect.alibi.getFullDescription() + " I have nothing to hide, Detective."
        }
    }

    private fun respondToRelationshipQuestion(suspect: Suspect, victim: Victim): String {
        val relationship = suspect.relationshipToVictim

        return if (suspect.isGuilty) {
            when (suspect.personality) {
                PersonalityTrait.DEFENSIVE ->
                    "We were ${relationship.lowercase()}. Not that it's any of your business."

                PersonalityTrait.ARROGANT ->
                    "${victim.name} and I were ${relationship.lowercase()}. I don't see how that's relevant."

                PersonalityTrait.EMOTIONAL ->
                    "We were ${relationship.lowercase()}... I can't believe this happened."

                else ->
                    "I knew ${victim.name} - we were ${relationship.lowercase()}."
            }
        } else {
            "I knew ${victim.name} quite well. We were ${relationship.lowercase()}. " +
            "This whole situation is terrible."
        }
    }

    private fun respondToMotiveQuestion(suspect: Suspect): String {
        if (suspect.isGuilty) {
            return when (suspect.personality) {
                PersonalityTrait.AGGRESSIVE ->
                    "Why? WHY? I didn't do anything, so there's no 'why' to answer!"

                PersonalityTrait.NERVOUS ->
                    "I don't... I mean, why would I have a reason? I didn't do anything!"

                PersonalityTrait.CALCULATING ->
                    "Detective, you're looking for motive where there is none. I had no reason to harm anyone."

                else ->
                    "I have no idea what you're implying. I had no reason to do this."
            }
        } else {
            "I can't imagine who would want to do this, Detective. " +
            if (random.nextBoolean()) "Though I did notice ${suspect.secretInformation.lowercase()}..." else ""
        }
    }

    private fun respondToTimelineQuestion(suspect: Suspect): String {
        val timeDetails = suspect.alibi.timeRange

        return if (suspect.isGuilty && suspect.alibi.hasHoles) {
            // Guilty suspect's timeline might have gaps
            "During $timeDetails, I was... well, mostly at ${suspect.alibi.location}. " +
            "I might have stepped out briefly, but nothing significant."
        } else {
            "During $timeDetails, I was at ${suspect.alibi.location}. " +
            "I can account for my time precisely."
        }
    }

    private fun respondToGeneralQuestion(suspect: Suspect, question: String): String {
        return when (suspect.personality) {
            PersonalityTrait.COOPERATIVE ->
                "That's a good question. Let me think... I want to help however I can."

            PersonalityTrait.DEFENSIVE ->
                "I'm not sure what you're getting at with that question."

            PersonalityTrait.SHY ->
                "Um... I'm not really sure how to answer that..."

            else ->
                "I'll answer that as best I can, Detective."
        }
    }

    private fun respondToAccusation(suspect: Suspect): String {
        if (suspect.isGuilty) {
            return when (suspect.personality) {
                PersonalityTrait.AGGRESSIVE ->
                    "How DARE you accuse me! I want a lawyer NOW!"

                PersonalityTrait.NERVOUS ->
                    "No! No, I didn't! You have to believe me!"

                PersonalityTrait.CALCULATING ->
                    "That's a serious accusation, Detective. I hope you have evidence to support it."

                else ->
                    "You're wrong. I didn't do this."
            }
        } else {
            return "I understand you're under pressure, but accusing innocent people won't solve this case. " +
                   "I'm telling you the truth."
        }
    }

    private fun respondToIrrelevantQuestion(suspect: Suspect): String {
        return when (suspect.personality) {
            PersonalityTrait.ARROGANT ->
                "I don't see how that's relevant to the investigation, Detective."

            PersonalityTrait.COOPERATIVE ->
                "I'm not sure that's related to what happened, but I'll answer if you think it helps."

            else ->
                "Could you clarify what you're asking?"
        }
    }

    private fun generateConfessionResponse(suspect: Suspect, evidence: Evidence): String {
        return "I... I can't keep lying anymore. ${evidence.name}... you have me. " +
               "I did it. I never meant for things to go this far, but... yes, I'm responsible."
    }

    private fun generateDefensiveResponse(suspect: Suspect, evidence: Evidence): String {
        return "That doesn't prove anything! There could be dozens of explanations for ${evidence.name}! " +
               "You're grasping at straws, Detective!"
    }

    private fun generateRationalizationResponse(suspect: Suspect, evidence: Evidence): String {
        return "I can explain ${evidence.name}. It's not what you think. " +
               "There's a perfectly reasonable explanation that has nothing to do with the crime."
    }

    private fun generateInnocentExplanation(suspect: Suspect, evidence: Evidence): String {
        return "Oh, ${evidence.name}? Yes, I can explain that. " +
               when (evidence.category) {
                   EvidenceCategory.PHYSICAL -> "I was there earlier in the day, that's probably when I left that behind."
                   EvidenceCategory.DOCUMENTARY -> "Yes, I sent that, but if you read it carefully, you'll see it's innocuous."
                   EvidenceCategory.DIGITAL -> "My phone was there, but that aligns with what I told you about my movements."
                   else -> "That actually supports what I've been telling you all along."
               }
    }

    private fun generateIrrelevantEvidenceResponse(suspect: Suspect): String {
        return "I don't see how that relates to me at all. I've never seen that before."
    }

    private fun determineTruthfulness(suspect: Suspect, questionType: QuestionType): Boolean {
        if (!suspect.isGuilty) return true // Innocent suspects tell the truth

        // Guilty suspects lie more about certain topics
        val lieChance = when (questionType) {
            QuestionType.ALIBI -> 80
            QuestionType.MOTIVE -> 90
            QuestionType.ACCUSATORY -> 95
            QuestionType.TIMELINE -> 70
            QuestionType.RELATIONSHIP -> 40
            QuestionType.GENERAL -> 30
            QuestionType.IRRELEVANT -> 10
        }

        return random.nextInt(100) >= lieChance
    }

    private fun generateBodyLanguage(
        suspect: Suspect,
        emotionalState: EmotionalState,
        questionType: QuestionType
    ): String {
        val baseQuirk = suspect.behavioralQuirks.random(random)
        val stateDescription = emotionalState.getBehaviorDescription()

        val additional = if (suspect.isGuilty && questionType == QuestionType.ACCUSATORY) {
            ", becomes visibly tense"
        } else ""

        return "$baseQuirk, $stateDescription$additional"
    }

    private fun calculateSuspicionChange(
        suspect: Suspect,
        questionType: QuestionType,
        isTruthful: Boolean
    ): Int {
        if (!suspect.isGuilty) return 0

        return when {
            !isTruthful && questionType == QuestionType.ALIBI -> 2
            !isTruthful && questionType == QuestionType.MOTIVE -> 2
            !isTruthful -> 1
            else -> 0
        }
    }

    /**
     * Question classification
     */
    private enum class QuestionType {
        ALIBI,
        RELATIONSHIP,
        MOTIVE,
        TIMELINE,
        GENERAL,
        ACCUSATORY,
        IRRELEVANT
    }
}
