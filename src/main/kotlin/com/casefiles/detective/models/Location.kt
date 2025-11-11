package com.casefiles.detective.models

import kotlinx.serialization.Serializable

/**
 * Represents an investigable location in the case
 */
@Serializable
data class Location(
    val id: String,
    val name: String,
    val type: LocationType,
    val description: String,
    val atmosphere: String,
    val evidenceIds: List<String>,
    val isPrimaryCrimeScene: Boolean = false,
    var isVisited: Boolean = false,
    var evidenceCollectedCount: Int = 0
) {
    fun getInvestigationText(): String {
        return buildString {
            appendLine("「 $name 」")
            appendLine()
            appendLine(description)
            appendLine()
            appendLine(atmosphere)

            if (isPrimaryCrimeScene) {
                appendLine()
                appendLine("⚠️ This is the primary crime scene.")
            }

            val remainingEvidence = evidenceIds.size - evidenceCollectedCount
            appendLine()
            appendLine("Evidence Available: $remainingEvidence piece(s)")
        }
    }

    fun getStatusText(): String {
        return if (isVisited) {
            "($evidenceCollectedCount/${evidenceIds.size} evidence collected)"
        } else {
            "(Not yet investigated)"
        }
    }

    override fun toString(): String = "📍 $name ${getStatusText()}"
}

/**
 * Location descriptions generator
 */
object LocationDescriptions {
    fun getOfficeDescription(variant: Int = 0): Pair<String, String> {
        val descriptions = listOf(
            "A modern corporate office with glass walls and sleek furniture. Papers are scattered across the desk, and a laptop sits open." to
                    "The fluorescent lights hum overhead. The air smells faintly of coffee and printer ink.",

            "A cramped office space filled with filing cabinets and stacks of documents. A single window overlooks the street." to
                    "Dust particles float in the afternoon sunlight. The room feels stuffy and claustrophobic."
        )
        return descriptions[variant % descriptions.size]
    }

    fun getMansionDescription(variant: Int = 0): Pair<String, String> {
        val descriptions = listOf(
            "An opulent study with mahogany bookshelves, a marble fireplace, and antique furniture. Oil paintings adorn the walls." to
                    "The smell of leather and old books permeates the air. Shadows dance in the candlelight.",

            "A lavish dining room with a long table set for twelve. Crystal chandeliers hang from the ceiling, and velvet curtains frame tall windows." to
                    "The polished silverware gleams. An eerie silence fills the grand space."
        )
        return descriptions[variant % descriptions.size]
    }

    fun getParkDescription(variant: Int = 0): Pair<String, String> {
        val descriptions = listOf(
            "A secluded area of the park near a bench and fountain. Trees provide cover from the main pathways." to
                    "Birds chirp in the distance. The sound of running water from the fountain creates a peaceful atmosphere.",

            "A jogging trail that winds through dense foliage. The path is muddy from recent rain." to
                    "The smell of wet earth and pine fills the air. Few people come this way."
        )
        return descriptions[variant % descriptions.size]
    }

    fun getRestaurantDescription(variant: Int = 0): Pair<String, String> {
        val descriptions = listOf(
            "The restaurant's private dining room, elegantly decorated with white tablecloths and soft lighting." to
                    "The lingering scent of expensive cuisine hangs in the air. Wine glasses sit on the table, some still containing liquid.",

            "The kitchen area, stainless steel surfaces gleaming under bright lights. Pots and pans hang from racks." to
                    "The smell of various spices mingles with cleaning products. The walk-in freezer door stands slightly ajar."
        )
        return descriptions[variant % descriptions.size]
    }

    fun getWarehouseDescription(variant: Int = 0): Pair<String, String> {
        val descriptions = listOf(
            "A vast storage space filled with wooden crates and metal shelving units. Forklifts sit idle near the loading dock." to
                    "The cavernous space echoes with every sound. Dust motes drift through shafts of light from high windows.",

            "The warehouse office, a small enclosed space with a desk and security monitors showing various camera angles." to
                    "Papers are pinned to a corkboard. A coffee mug sits on the desk, the liquid inside cold."
        )
        return descriptions[variant % descriptions.size]
    }

    fun getGalleryDescription(variant: Int = 0): Pair<String, String> {
        val descriptions = listOf(
            "An upscale art gallery with white walls and spotlit paintings. Modern sculptures are positioned throughout the space." to
                    "The polished concrete floors reflect the track lighting. The space feels cold and minimal.",

            "The gallery's back office, cluttered with invoices, catalogs, and authentication documents." to
                    "Half-unpacked artwork leans against the walls. A safe sits in the corner, its door ajar."
        )
        return descriptions[variant % descriptions.size]
    }
}
