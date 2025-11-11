package com.casefiles.detective.models

import kotlinx.serialization.Serializable

/**
 * Represents the player's profile and progression
 */
@Serializable
data class PlayerProfile(
    val badgeNumber: String,
    var playerName: String = "Detective",
    var reputation: Int = 0,
    var rank: DetectiveRank = DetectiveRank.CADET,
    var casesAssigned: Int = 0,
    var casesSolved: Int = 0,
    var perfectSolves: Int = 0,
    var totalPlayTimeMinutes: Long = 0,
    var currentStreak: Int = 0,
    var longestStreak: Int = 0,
    var unlockedAchievements: MutableList<Achievement> = mutableListOf(),
    var unlockedTools: MutableList<DetectiveTool> = mutableListOf(),
    var settings: GameSettings = GameSettings(),
    var dailyBonusClaimed: Long = 0,
    var hintsAvailable: Int = 3
) {
    /**
     * Calculate success rate percentage
     */
    fun getSuccessRate(): Int {
        return if (casesAssigned == 0) 0
        else ((casesSolved.toFloat() / casesAssigned) * 100).toInt()
    }

    /**
     * Add reputation points and check for rank up
     */
    fun addReputation(points: Int): Boolean {
        reputation += points
        val newRank = DetectiveRank.fromReputation(reputation)
        val rankChanged = newRank != rank

        if (rankChanged) {
            rank = newRank
            // Unlock tools based on rank
            when (rank) {
                DetectiveRank.ROOKIE -> unlockTool(DetectiveTool.FORENSICS_ACCESS)
                DetectiveRank.DETECTIVE -> unlockTool(DetectiveTool.BACKGROUND_CHECK)
                DetectiveRank.SENIOR_DETECTIVE -> unlockTool(DetectiveTool.PSYCHOLOGICAL_PROFILING)
                DetectiveRank.LIEUTENANT -> unlockTool(DetectiveTool.ADVANCED_DNA_ANALYSIS)
                DetectiveRank.CAPTAIN -> unlockTool(DetectiveTool.PHONE_RECORDS_ACCESS)
                DetectiveRank.COMMANDER -> unlockTool(DetectiveTool.FINANCIAL_FORENSICS)
                DetectiveRank.CHIEF -> unlockTool(DetectiveTool.COMPLETE_ACCESS)
                else -> {}
            }
        }

        return rankChanged
    }

    /**
     * Progress to next rank percentage
     */
    fun getProgressToNextRank(): Int {
        val currentRankIndex = DetectiveRank.entries.indexOf(rank)
        if (currentRankIndex >= DetectiveRank.entries.size - 1) return 100

        val nextRank = DetectiveRank.entries[currentRankIndex + 1]
        val currentRankPoints = rank.requiredReputation
        val nextRankPoints = nextRank.requiredReputation
        val range = nextRankPoints - currentRankPoints
        val progress = reputation - currentRankPoints

        return ((progress.toFloat() / range) * 100).toInt().coerceIn(0, 100)
    }

    /**
     * Get points needed for next rank
     */
    fun getPointsToNextRank(): Int {
        val currentRankIndex = DetectiveRank.entries.indexOf(rank)
        if (currentRankIndex >= DetectiveRank.entries.size - 1) return 0

        val nextRank = DetectiveRank.entries[currentRankIndex + 1]
        return (nextRank.requiredReputation - reputation).coerceAtLeast(0)
    }

    /**
     * Unlock an achievement
     */
    fun unlockAchievement(type: AchievementType, description: String): Boolean {
        if (unlockedAchievements.any { it.type == type }) return false

        val achievement = Achievement(
            type = type,
            name = type.getDisplayName(),
            description = description,
            unlockedAt = System.currentTimeMillis()
        )
        unlockedAchievements.add(achievement)
        return true
    }

    /**
     * Unlock a detective tool
     */
    private fun unlockTool(tool: DetectiveTool) {
        if (!unlockedTools.contains(tool)) {
            unlockedTools.add(tool)
        }
    }

    /**
     * Check if player has a specific tool
     */
    fun hasTool(tool: DetectiveTool): Boolean = unlockedTools.contains(tool)

    /**
     * Record a case completion
     */
    fun recordCaseCompletion(rating: Int, reputationGained: Int) {
        casesAssigned++
        casesSolved++
        if (rating == 5) perfectSolves++

        currentStreak++
        if (currentStreak > longestStreak) {
            longestStreak = currentStreak
        }

        addReputation(reputationGained)

        // Check for achievements
        checkAchievements()
    }

    /**
     * Record a failed case
     */
    fun recordCaseFailed() {
        casesAssigned++
        currentStreak = 0
    }

    /**
     * Check and unlock achievements based on stats
     */
    private fun checkAchievements() {
        if (casesSolved == 1) {
            unlockAchievement(AchievementType.FIRST_CASE_SOLVED, "Solved your first case")
        }

        if (perfectSolves >= 5) {
            unlockAchievement(AchievementType.PERFECT_DETECTIVE, "Achieved 5 five-star ratings")
        }

        if (currentStreak >= 5) {
            unlockAchievement(AchievementType.CASE_STREAK, "Solved 5 cases in a row")
        }

        if (reputation >= 1000) {
            unlockAchievement(AchievementType.REPUTATION_MILESTONE, "Reached 1000 reputation")
        }
    }

    /**
     * Get profile summary
     */
    fun getProfileSummary(): String {
        return buildString {
            appendLine("「 DETECTIVE PROFILE 」")
            appendLine()
            appendLine("Name: $playerName")
            appendLine("Badge Number: $badgeNumber")
            appendLine("Rank: ${rank.getDisplayName()}")
            appendLine()
            appendLine("━━━━━ STATISTICS ━━━━━")
            appendLine()
            appendLine("Career Stats:")
            appendLine("• Cases Assigned: $casesAssigned")
            appendLine("• Cases Solved: $casesSolved")
            appendLine("• Success Rate: ${getSuccessRate()}%")
            appendLine("• Perfect Solves: $perfectSolves")
            appendLine("• Current Streak: $currentStreak")
            appendLine()
            appendLine("Current Reputation: $reputation ⭐")
            appendLine("Rank Progress: ${getProgressToNextRank()}%")
            val pointsNeeded = getPointsToNextRank()
            if (pointsNeeded > 0) {
                val nextRankIndex = DetectiveRank.entries.indexOf(rank) + 1
                val nextRankName = DetectiveRank.entries[nextRankIndex].getDisplayName()
                appendLine("Next Rank: $nextRankName ($pointsNeeded points needed)")
            } else {
                appendLine("Rank: Maximum (Chief Detective)")
            }
            appendLine()
            appendLine("━━━━━ ACHIEVEMENTS ━━━━━")
            appendLine()
            if (unlockedAchievements.isEmpty()) {
                appendLine("No achievements unlocked yet")
            } else {
                unlockedAchievements.forEach {
                    appendLine("🏆 ${it.name}")
                }
            }
            appendLine()
            appendLine("${unlockedAchievements.size} of ${AchievementType.entries.size} Achievements Unlocked")
        }
    }
}

/**
 * Represents an unlocked achievement
 */
@Serializable
data class Achievement(
    val type: AchievementType,
    val name: String,
    val description: String,
    val unlockedAt: Long
)

/**
 * Detective tools that unlock with rank progression
 */
enum class DetectiveTool(val displayName: String, val description: String) {
    BASIC_INVESTIGATION_KIT("Basic Investigation Kit", "Standard tools for crime scene investigation"),
    FORENSICS_ACCESS("Forensics Access", "Access to forensic analysis reports"),
    BACKGROUND_CHECK("Background Check Database", "Search suspect backgrounds and criminal records"),
    PSYCHOLOGICAL_PROFILING("Psychological Profiling", "Analyze suspect behavior patterns"),
    ADVANCED_DNA_ANALYSIS("Advanced DNA Analysis", "Detailed genetic evidence analysis"),
    PHONE_RECORDS_ACCESS("Phone Records Access", "Review suspect call and message logs"),
    FINANCIAL_FORENSICS("Financial Forensics", "Track money trails and transactions"),
    COMPLETE_ACCESS("Complete Access", "Full access to all investigative resources");

    override fun toString(): String = displayName
}

/**
 * Game settings
 */
@Serializable
data class GameSettings(
    var difficulty: Difficulty = Difficulty.DETECTIVE,
    var textSpeed: Float = 1.0f, // 0.5 to 2.0
    var textSize: Float = 1.0f, // 0.8 to 1.5
    var enableNotifications: Boolean = true,
    var enableDailyCaseAlert: Boolean = true,
    var enableBackgroundAmbience: Boolean = true,
    var enableSoundEffects: Boolean = true,
    var audioVolume: Float = 0.7f // 0.0 to 1.0
) {
    fun getSettingsText(): String {
        return buildString {
            appendLine("「 SETTINGS 」")
            appendLine()
            appendLine("Difficulty: $difficulty")
            appendLine("Text Speed: ${String.format("%.1f", textSpeed)}x")
            appendLine("Text Size: ${String.format("%.1f", textSize)}x")
            appendLine()
            appendLine("Notifications:")
            appendLine("${if (enableNotifications) "☑" else "☐"} Daily new case alert")
            appendLine("${if (enableDailyCaseAlert) "☑" else "☐"} Investigation reminders")
            appendLine()
            appendLine("Audio:")
            appendLine("${if (enableBackgroundAmbience) "☑" else "☐"} Background ambience")
            appendLine("${if (enableSoundEffects) "☑" else "☐"} UI sound effects")
            appendLine("Volume: ${(audioVolume * 100).toInt()}%")
        }
    }
}

/**
 * Daily bonus rewards
 */
data class DailyBonus(
    val dayNumber: Int,
    val reputationPoints: Int,
    val freeHints: Int,
    val specialCaseAvailable: Boolean
) {
    fun getBonusText(): String {
        return buildString {
            appendLine("「 WELCOME BACK, DETECTIVE! 」")
            appendLine()
            appendLine("Day $dayNumber Streak 🔥")
            appendLine()
            appendLine("Daily Bonus:")
            appendLine("+ $reputationPoints Reputation Points")
            appendLine("+ $freeHints Free Hints")
            if (specialCaseAvailable) {
                appendLine()
                appendLine("🌟 Special Case Available!")
                appendLine("Bonus Rewards: 2x Reputation")
            }
        }
    }
}
