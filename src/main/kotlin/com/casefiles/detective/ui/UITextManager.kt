package com.casefiles.detective.ui

import com.casefiles.detective.models.*

/**
 * Manages all UI text and formatting for the game
 */
class UITextManager {

    /**
     * Main menu screen
     */
    fun getMainMenuText(profile: PlayerProfile): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("    CASE FILES: AI DETECTIVE")
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("[1] START NEW CASE")
            appendLine("[2] CONTINUE INVESTIGATION")
            appendLine("[3] CASE ARCHIVE")
            appendLine("[4] DETECTIVE PROFILE")
            appendLine("[5] SETTINGS")
            appendLine("[6] EXIT")
            appendLine()
            appendLine("Your Rank: ${profile.rank.getDisplayName()}")
            appendLine("Cases Solved: ${profile.casesSolved}")
            appendLine("Success Rate: ${profile.getSuccessRate()}%")
            appendLine()
            appendLine("═══════════════════════════════════")
        }
    }

    /**
     * Case briefing screen
     */
    fun getCaseBriefingText(case: Case): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine(case.getBriefing())
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("[Press ENTER to begin investigation]")
        }
    }

    /**
     * Location selection screen
     */
    fun getLocationSelectionText(locations: List<Location>, caseProgress: String): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("    INVESTIGATION LOCATIONS")
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("Available Areas:")
            appendLine()

            locations.forEachIndexed { index, location ->
                val status = if (location.isVisited) {
                    if (location.evidenceCollectedCount == location.evidenceIds.size) "✓ Fully searched"
                    else "${location.evidenceCollectedCount}/${location.evidenceIds.size} evidence collected"
                } else {
                    "Not yet investigated"
                }

                appendLine("[${index + 1}] ${location.name}")
                appendLine("    $status")
                appendLine()
            }

            appendLine("═══════════════════════════════════")
            appendLine(caseProgress)
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("[S] View Suspects")
            appendLine("[E] Evidence Board")
            appendLine("[A] Make Accusation")
            appendLine("[H] Request Hint")
            appendLine("[X] Abandon Case")
        }
    }

    /**
     * Crime scene investigation screen
     */
    fun getLocationInvestigationText(location: Location, evidence: List<Evidence>): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine(location.getInvestigationText())
            appendLine("═══════════════════════════════════")
            appendLine()

            if (evidence.isNotEmpty()) {
                appendLine("EVIDENCE FOUND:")
                appendLine()
                evidence.forEachIndexed { index, ev ->
                    val status = if (ev.isCollected) "[COLLECTED]" else "[NEW]"
                    appendLine("[${index + 1}] ${ev.name} $status")
                }
                appendLine()
                appendLine("Select evidence number to examine, or [B] to go back")
            } else {
                appendLine("No evidence found at this location.")
                appendLine()
                appendLine("[B] Return to locations")
            }
        }
    }

    /**
     * Evidence examination screen
     */
    fun getEvidenceExaminationText(evidence: Evidence): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine(evidence.getDetailedDescription())
            appendLine("═══════════════════════════════════")
            appendLine()
            if (!evidence.isCollected) {
                appendLine("[C] Collect Evidence")
            }
            appendLine("[B] Back")
        }
    }

    /**
     * Suspect list screen
     */
    fun getSuspectListText(suspects: List<Suspect>): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("    PERSONS OF INTEREST")
            appendLine("═══════════════════════════════════")
            appendLine()

            suspects.forEachIndexed { index, suspect ->
                appendLine("[${index + 1}] ${suspect.fullName}")
                appendLine("    ${suspect.age} years old - ${suspect.occupation}")
                appendLine("    Status: ${suspect.interrogationStatus}")
                appendLine("    Suspicion: ${suspect.suspicionLevel.toStarString()}")
                appendLine()
            }

            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("Select suspect number to interrogate, or [B] to go back")
        }
    }

    /**
     * Interrogation room screen
     */
    fun getInterrogationStartText(suspect: Suspect): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("    INTERROGATION ROOM")
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("Now Questioning: ${suspect.fullName}")
            appendLine()
            appendLine(suspect.getAppearanceDescription())
            appendLine()
            appendLine("${suspect.fullName}: \"${suspect.getOpeningStatement()}\"")
            appendLine()
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("Stress Level: ${suspect.getStressLevel()}%")
            appendLine("Suspicion: ${suspect.suspicionLevel.toStarString()}")
            appendLine()
            appendLine("[Q] Ask Question")
            appendLine("[E] Show Evidence")
            appendLine("[B] End Interrogation")
        }
    }

    /**
     * Format dialogue response
     */
    fun formatDialogueResponse(suspect: Suspect, response: DialogueResponse): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("You: \"${response.questionAsked}\"")
            appendLine()
            appendLine(response.getFormattedResponse(suspect.fullName))
            appendLine("═══════════════════════════════════")

            if (response.createsContradiction) {
                appendLine()
                appendLine("⚠️ CONTRADICTION DETECTED!")
                appendLine("This statement contradicts something they said earlier.")
            }

            if (response.revealsInformation != null) {
                appendLine()
                appendLine("ℹ️ NEW INFORMATION:")
                appendLine(response.revealsInformation)
            }

            if (suspect.hasConfessed) {
                appendLine()
                appendLine("🚨 CONFESSION OBTAINED! 🚨")
                appendLine("The suspect has admitted to the crime!")
            }

            appendLine()
            appendLine("[Press ENTER to continue]")
        }
    }

    /**
     * Evidence board screen
     */
    fun getEvidenceBoardText(evidence: List<Evidence>, connections: List<EvidenceConnection>): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("    EVIDENCE BOARD")
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("Collected Evidence: ${evidence.size}")
            appendLine("Connections Made: ${connections.size}")
            appendLine()

            if (evidence.isNotEmpty()) {
                appendLine("EVIDENCE:")
                evidence.forEachIndexed { index, ev ->
                    appendLine("[${index + 1}] ${ev.name} (${ev.category})")
                }
                appendLine()
            }

            if (connections.isNotEmpty()) {
                appendLine("CONNECTIONS:")
                connections.forEach { conn ->
                    appendLine("🔗 ${conn.connectionReasoning}")
                }
                appendLine()
            }

            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("[C] Connect Evidence")
            appendLine("[B] Back")
        }
    }

    /**
     * Accusation screen
     */
    fun getAccusationScreenText(
        suspects: List<Suspect>,
        evidence: List<Evidence>,
        theoryStrength: String
    ): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("    MAKE YOUR ACCUSATION")
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("⚠️  WARNING")
            appendLine("Incorrect accusations will damage your reputation")
            appendLine("and may close the case incorrectly.")
            appendLine()
            appendLine("Current Theory Strength: $theoryStrength")
            appendLine()
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("WHO COMMITTED THE CRIME?")
            suspects.forEachIndexed { index, suspect ->
                appendLine("[${index + 1}] ${suspect.fullName}")
            }
            appendLine()
            appendLine("[B] Back to Investigation")
        }
    }

    /**
     * Correct accusation result
     */
    fun getCorrectAccusationText(result: AccusationResult, case: Case): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("    🎯 CASE SOLVED! 🎯")
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("Congratulations, Detective!")
            appendLine()
            appendLine(result.feedback)
            appendLine()
            appendLine("═══════════════════════════════════")
            appendLine("    PERFORMANCE RATING")
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("Rating: ${result.getRatingStars()}")
            appendLine()
            appendLine("REWARDS:")
            appendLine("+ ${result.reputationChange} Reputation Points")
            appendLine("+ ${result.experienceGained} Experience Points")
            appendLine()
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("[Press ENTER to continue]")
        }
    }

    /**
     * Incorrect accusation result
     */
    fun getIncorrectAccusationText(result: AccusationResult): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("    ❌ ACCUSATION REJECTED ❌")
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine(result.feedback)
            appendLine()
            appendLine("CONSEQUENCES:")
            appendLine("- ${-result.reputationChange} Reputation Points Lost")
            appendLine("- Case remains open")
            appendLine()
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("OPTIONS:")
            appendLine("[1] Continue Investigation")
            appendLine("[2] Abandon Case")
        }
    }

    /**
     * Hint display
     */
    fun getHintText(hint: String, cost: Int, level: Int): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            when (level) {
                1 -> appendLine("    DETECTIVE'S INTUITION")
                2 -> appendLine("    CASE ANALYSIS")
                else -> appendLine("    FORENSICS REPORT")
            }
            appendLine("═══════════════════════════════════")
            appendLine()

            if (cost > 0) {
                appendLine("Cost: $cost Reputation Points")
                appendLine()
            }

            appendLine(hint)
            appendLine()
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("[Press ENTER to continue]")
        }
    }

    /**
     * Settings screen
     */
    fun getSettingsText(settings: GameSettings): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine(settings.getSettingsText())
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("[1] Change Difficulty")
            appendLine("[2] Adjust Text Speed")
            appendLine("[3] Toggle Notifications")
            appendLine("[B] Back to Main Menu")
        }
    }

    /**
     * Tutorial screens
     */
    fun getTutorialText(step: Int): String {
        return when (step) {
            1 -> buildString {
                appendLine("═══════════════════════════════════")
                appendLine("    WELCOME TO CASE FILES")
                appendLine("═══════════════════════════════════")
                appendLine()
                appendLine("You're a detective investigating crimes by")
                appendLine("gathering evidence and interrogating suspects.")
                appendLine()
                appendLine("Your goal: Identify the culprit and their motive.")
                appendLine()
                appendLine("[Press ENTER to continue]")
            }

            2 -> buildString {
                appendLine("═══════════════════════════════════")
                appendLine("    INVESTIGATING CRIME SCENES")
                appendLine("═══════════════════════════════════")
                appendLine()
                appendLine("Visit locations to search for evidence.")
                appendLine()
                appendLine("Each piece of evidence can be examined in detail.")
                appendLine()
                appendLine("Important clues will help you connect suspects")
                appendLine("to the crime.")
                appendLine()
                appendLine("[Press ENTER to continue]")
            }

            3 -> buildString {
                appendLine("═══════════════════════════════════")
                appendLine("    INTERROGATING SUSPECTS")
                appendLine("═══════════════════════════════════")
                appendLine()
                appendLine("Ask suspects questions to uncover the truth.")
                appendLine()
                appendLine("Watch for suspicious behavior:")
                appendLine("  [nervous] = They're hiding something")
                appendLine("  [confident] = They believe their story")
                appendLine("  [angry] = You hit a nerve")
                appendLine()
                appendLine("Present evidence to challenge their alibis.")
                appendLine()
                appendLine("[Press ENTER to continue]")
            }

            4 -> buildString {
                appendLine("═══════════════════════════════════")
                appendLine("    THE EVIDENCE BOARD")
                appendLine("═══════════════════════════════════")
                appendLine()
                appendLine("Connect related evidence to build your theory.")
                appendLine()
                appendLine("The stronger your connections, the more")
                appendLine("confident your accusation will be.")
                appendLine()
                appendLine("[Press ENTER to continue]")
            }

            else -> buildString {
                appendLine("═══════════════════════════════════")
                appendLine("    MAKING YOUR ACCUSATION")
                appendLine("═══════════════════════════════════")
                appendLine()
                appendLine("When ready, accuse the suspect you believe")
                appendLine("is guilty.")
                appendLine()
                appendLine("Provide evidence and explain your reasoning.")
                appendLine()
                appendLine("⚠️  Wrong accusations hurt your reputation!")
                appendLine()
                appendLine("Good luck, Detective! 🕵️")
                appendLine()
                appendLine("[Press ENTER to start your first case]")
            }
        }
    }

    /**
     * Daily bonus screen
     */
    fun getDailyBonusText(bonus: DailyBonus): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine(bonus.getBonusText())
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("[Press ENTER to continue]")
        }
    }

    /**
     * Rank up notification
     */
    fun getRankUpText(newRank: DetectiveRank, profile: PlayerProfile): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("    🎖️  PROMOTION! 🎖️")
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("Congratulations!")
            appendLine()
            appendLine("You've been promoted to:")
            appendLine("    ${newRank.getDisplayName()}")
            appendLine()
            appendLine("Your exceptional detective work has earned you:")
            appendLine()
            appendLine("NEW ABILITIES:")

            // List newly unlocked tools
            val newTools = profile.unlockedTools.takeLast(1)
            newTools.forEach {
                appendLine("• ${it.displayName}")
            }

            appendLine()
            appendLine("═══════════════════════════════════")
            appendLine()
            appendLine("[Press ENTER to continue]")
        }
    }

    /**
     * Case archive screen
     */
    fun getCaseArchiveText(cases: List<Case>): String {
        return buildString {
            appendLine("═══════════════════════════════════")
            appendLine("    CASE ARCHIVE")
            appendLine("═══════════════════════════════════")
            appendLine()

            if (cases.isEmpty()) {
                appendLine("No cases in archive yet.")
                appendLine()
                appendLine("[B] Back to Main Menu")
            } else {
                cases.takeLast(10).reversed().forEachIndexed { index, case ->
                    val status = if (case.isSolved) "✓ SOLVED" else "✗ UNSOLVED"
                    val stars = "⭐".repeat(case.rating) + "⚪".repeat(5 - case.rating)

                    appendLine("[$index] Case #${case.caseNumber} - $status")
                    appendLine("    \"${case.title}\"")
                    appendLine("    Rating: $stars")
                    appendLine()
                }

                appendLine("═══════════════════════════════════")
                appendLine()
                appendLine("Select case number to review, or [B] to go back")
            }
        }
    }

    /**
     * Format box drawing for better UI
     */
    fun boxify(text: String, title: String? = null): String {
        return buildString {
            appendLine("╔═══════════════════════════════════╗")
            if (title != null) {
                appendLine("║  $title")
                appendLine("╠═══════════════════════════════════╣")
            }
            text.lines().forEach { line ->
                appendLine("║ $line")
            }
            appendLine("╚═══════════════════════════════════╝")
        }
    }
}
