package com.casefiles.detective.models

/**
 * All enum types used throughout the game
 */

enum class CrimeType {
    THEFT,
    MURDER,
    FRAUD,
    KIDNAPPING,
    ARSON;

    override fun toString(): String = name.lowercase().replaceFirstChar { it.uppercase() }
}

enum class LocationType {
    OFFICE,
    MANSION,
    PARK,
    RESTAURANT,
    WAREHOUSE,
    GALLERY,
    APARTMENT,
    HOTEL,
    LABORATORY,
    THEATER;

    override fun toString(): String = name.lowercase().replaceFirstChar { it.uppercase() }
}

enum class Motive {
    REVENGE,
    FINANCIAL_GAIN,
    JEALOUSY,
    BLACKMAIL,
    ACCIDENT_COVER_UP,
    SELF_DEFENSE,
    PROTECTION,
    OBSESSION;

    override fun toString(): String = name.split('_')
        .joinToString(" ") { it.lowercase().replaceFirstChar { c -> c.uppercase() } }
}

enum class EvidenceCategory {
    PHYSICAL,
    DOCUMENTARY,
    TESTIMONIAL,
    FORENSIC,
    DIGITAL;

    override fun toString(): String = name.lowercase().replaceFirstChar { it.uppercase() }
}

enum class PersonalityTrait {
    NERVOUS,
    CONFIDENT,
    ARROGANT,
    COOPERATIVE,
    DEFENSIVE,
    AGGRESSIVE,
    SHY,
    CALCULATING,
    EMOTIONAL,
    STOIC;

    fun getDialogueTone(): String = when (this) {
        NERVOUS -> "fidgets and speaks hesitantly"
        CONFIDENT -> "maintains eye contact and speaks clearly"
        ARROGANT -> "speaks dismissively and condescendingly"
        COOPERATIVE -> "eager to help and provide information"
        DEFENSIVE -> "crosses arms and speaks curtly"
        AGGRESSIVE -> "raises voice and makes threatening gestures"
        SHY -> "avoids eye contact and speaks quietly"
        CALCULATING -> "pauses before answering, choosing words carefully"
        EMOTIONAL -> "tears up and voice trembles"
        STOIC -> "shows no emotion, answers matter-of-factly"
    }
}

enum class SuspicionLevel(val stars: Int) {
    VERY_LOW(1),
    LOW(2),
    MEDIUM(3),
    HIGH(4),
    VERY_HIGH(5);

    fun toStarString(): String = "⭐".repeat(stars) + "⚪".repeat(5 - stars)
}

enum class InterrogationStatus {
    NOT_QUESTIONED,
    INTERVIEWED,
    SUSPICIOUS,
    CLEARED;

    override fun toString(): String = name.split('_')
        .joinToString(" ") { it.lowercase().replaceFirstChar { c -> c.uppercase() } }
}

enum class Difficulty {
    ROOKIE,
    DETECTIVE,
    MASTER_SLEUTH;

    fun getMaxSuspects(): Int = when (this) {
        ROOKIE -> 3
        DETECTIVE -> 5
        MASTER_SLEUTH -> 6
    }

    fun getMinEvidence(): Int = when (this) {
        ROOKIE -> 8
        DETECTIVE -> 10
        MASTER_SLEUTH -> 12
    }

    fun getHintCost(): Int = when (this) {
        ROOKIE -> 25
        DETECTIVE -> 50
        MASTER_SLEUTH -> 100
    }

    override fun toString(): String = when (this) {
        ROOKIE -> "Rookie"
        DETECTIVE -> "Detective"
        MASTER_SLEUTH -> "Master Sleuth"
    }
}

enum class CasePriority {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL;

    override fun toString(): String = name.lowercase().replaceFirstChar { it.uppercase() }
}

enum class DetectiveRank(val requiredReputation: Int) {
    CADET(0),
    ROOKIE(500),
    DETECTIVE(1500),
    SENIOR_DETECTIVE(3000),
    LIEUTENANT(5000),
    CAPTAIN(8000),
    COMMANDER(12000),
    CHIEF(20000);

    fun getDisplayName(): String = name.split('_')
        .joinToString(" ") { it.lowercase().replaceFirstChar { c -> c.uppercase() } }

    companion object {
        fun fromReputation(reputation: Int): DetectiveRank {
            return entries.lastOrNull { reputation >= it.requiredReputation } ?: CADET
        }
    }
}

enum class AchievementType {
    FIRST_CASE_SOLVED,
    PERFECT_DETECTIVE,
    SPEED_SOLVER,
    MASTER_INTERROGATOR,
    EVIDENCE_EXPERT,
    CASE_STREAK,
    REPUTATION_MILESTONE,
    PROMOTION_EARNED;

    fun getDisplayName(): String = name.split('_')
        .joinToString(" ") { it.lowercase().replaceFirstChar { c -> c.uppercase() } }
}

enum class EmotionalState {
    CALM,
    NERVOUS,
    ANGRY,
    SAD,
    DEFENSIVE,
    RELIEVED,
    PANICKED,
    RESIGNED;

    fun getBehaviorDescription(): String = when (this) {
        CALM -> "composed and relaxed"
        NERVOUS -> "fidgeting and avoiding eye contact"
        ANGRY -> "clenched fists, raised voice"
        SAD -> "tears welling up, voice breaking"
        DEFENSIVE -> "crossed arms, tense posture"
        RELIEVED -> "visible relaxation, sighs"
        PANICKED -> "rapid breathing, wide eyes"
        RESIGNED -> "slumped shoulders, defeated tone"
    }
}
