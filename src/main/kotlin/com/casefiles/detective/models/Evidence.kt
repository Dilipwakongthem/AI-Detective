package com.casefiles.detective.models

import kotlinx.serialization.Serializable

/**
 * Represents a piece of evidence in the investigation
 */
@Serializable
data class Evidence(
    val id: String,
    val name: String,
    val category: EvidenceCategory,
    val locationFound: String,
    val description: String,
    val relatedSuspectIds: List<String> = emptyList(),
    val timelineSignificance: String? = null,
    val isIncriminating: Boolean = false,
    val connections: MutableList<String> = mutableListOf(), // IDs of connected evidence
    var isCollected: Boolean = false,
    var isExamined: Boolean = false
) {
    fun getDetailedDescription(): String {
        return buildString {
            appendLine("EVIDENCE DETAILS")
            appendLine()
            appendLine("Item: $name")
            appendLine("Location Found: $locationFound")
            appendLine("Category: $category")
            appendLine()
            appendLine("Description:")
            appendLine(description)

            if (timelineSignificance != null) {
                appendLine()
                appendLine("Timeline Significance:")
                appendLine(timelineSignificance)
            }

            if (relatedSuspectIds.isNotEmpty()) {
                appendLine()
                appendLine("Possible Connections:")
                appendLine("• This evidence may relate to one or more suspects")
                if (isIncriminating) {
                    appendLine("• This appears to be significant to the case")
                }
            }
        }
    }

    fun canConnectTo(other: Evidence): Boolean {
        return relatedSuspectIds.any { it in other.relatedSuspectIds } ||
               locationFound == other.locationFound ||
               category == other.category
    }

    override fun toString(): String = "🔍 $name"
}

/**
 * Represents a connection between two pieces of evidence
 */
@Serializable
data class EvidenceConnection(
    val evidenceId1: String,
    val evidenceId2: String,
    val connectionReasoning: String,
    val timestamp: Long = System.currentTimeMillis()
) {
    override fun toString(): String = "🔗 Connection: $connectionReasoning"
}

/**
 * Physical evidence types
 */
object PhysicalEvidenceTypes {
    const val FINGERPRINTS = "Fingerprints"
    const val DNA = "DNA Sample"
    const val WEAPON = "Weapon"
    const val CLOTHING_FIBERS = "Clothing Fibers"
    const val FOOTPRINTS = "Footprints"
    const val BLOOD_SPATTER = "Blood Spatter"
    const val HAIR_SAMPLE = "Hair Sample"
    const val TOOL_MARKS = "Tool Marks"
}

/**
 * Documentary evidence types
 */
object DocumentaryEvidenceTypes {
    const val EMAIL = "Email"
    const val TEXT_MESSAGE = "Text Message"
    const val RECEIPT = "Receipt"
    const val CONTRACT = "Contract"
    const val LETTER = "Letter"
    const val FINANCIAL_RECORD = "Financial Record"
    const val PHONE_RECORD = "Phone Record"
    const val SURVEILLANCE_FOOTAGE = "Surveillance Footage"
}
