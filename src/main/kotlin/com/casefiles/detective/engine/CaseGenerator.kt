package com.casefiles.detective.engine

import com.casefiles.detective.models.*
import kotlin.random.Random

/**
 * Generates procedural crime cases with unique characteristics
 */
class CaseGenerator(private val difficulty: Difficulty = Difficulty.DETECTIVE) {

    private val random = Random.Default

    /**
     * Generate a complete case
     */
    fun generateCase(caseNumber: Int): Case {
        val crimeType = CrimeType.entries.random(random)
        val locationType = LocationType.entries.random(random)
        val motive = Motive.entries.random(random)

        // Generate victim
        val victim = generateVictim(crimeType)

        // Generate suspects
        val suspectCount = when (difficulty) {
            Difficulty.ROOKIE -> 3
            Difficulty.DETECTIVE -> random.nextInt(4, 6)
            Difficulty.MASTER_SLEUTH -> random.nextInt(5, 7)
        }

        val suspects = generateSuspects(suspectCount, victim, motive)
        val guiltyParty = suspects.random(random)
        guiltyParty.isGuilty
        guiltyParty.motive

        // Generate locations
        val locations = generateLocations(locationType, suspects)

        // Generate evidence
        val evidenceCount = difficulty.getMinEvidence() + random.nextInt(0, 4)
        val evidence = generateEvidence(evidenceCount, crimeType, suspects, guiltyParty, locations)

        // Generate crime narrative
        val (title, description, howCommitted, coverUp) = generateCrimeNarrative(
            crimeType, victim, guiltyParty, motive, locationType
        )

        // Determine critical evidence
        val criticalEvidence = evidence
            .filter { it.relatedSuspectIds.contains(guiltyParty.id) && it.isIncriminating }
            .map { it.id }
            .take(3)

        return Case(
            id = generateId(),
            caseNumber = caseNumber,
            title = title,
            priority = CasePriority.entries.random(random),
            crimeType = crimeType,
            victim = victim,
            crimeTimestamp = generateTimestamp(),
            suspects = suspects,
            evidence = evidence,
            locations = locations,
            difficulty = difficulty,
            guiltyPartyId = guiltyParty.id,
            actualMotive = motive,
            crimeDescription = description,
            howCrimeWasCommitted = howCommitted,
            coverUpAttempt = coverUp,
            criticalEvidence = criticalEvidence
        )
    }

    /**
     * Generate a victim
     */
    private fun generateVictim(crimeType: CrimeType): Victim {
        val victimNames = listOf(
            "Marcus Thornwell", "Victoria Sterling", "James Blackwood", "Elena Rodriguez",
            "Robert Chen", "Sarah Montgomery", "David Patterson", "Amanda Foster",
            "Michael Crawford", "Jennifer Hayes", "Thomas Winters", "Catherine Blake"
        )

        val occupations = listOf(
            "Art Dealer", "CEO", "Professor", "Lawyer", "Surgeon", "Architect",
            "Investment Banker", "Restaurant Owner", "Gallery Curator", "Tech Entrepreneur"
        )

        val name = victimNames.random(random)
        val occupation = occupations.random(random)
        val age = random.nextInt(30, 65)

        val background = when (crimeType) {
            CrimeType.MURDER -> "A well-known $occupation with many connections in high society."
            CrimeType.THEFT -> "A successful $occupation known for their valuable collection."
            CrimeType.FRAUD -> "A prominent $occupation with access to significant financial resources."
            CrimeType.KIDNAPPING -> "A wealthy $occupation whose family has considerable assets."
            CrimeType.ARSON -> "A controversial $occupation involved in several business disputes."
        }

        return Victim(
            name = name,
            age = age,
            occupation = occupation,
            background = background
        )
    }

    /**
     * Generate suspects
     */
    private fun generateSuspects(count: Int, victim: Victim, primaryMotive: Motive): List<Suspect> {
        val firstNames = listOf(
            "Alexander", "Benjamin", "Charlotte", "Daniel", "Emily", "Frank",
            "Grace", "Henry", "Isabella", "Jacob", "Katherine", "Lucas",
            "Margaret", "Nathan", "Olivia", "Patrick", "Rachel", "Samuel"
        )

        val lastNames = listOf(
            "Anderson", "Bennett", "Carter", "Davis", "Edwards", "Fisher",
            "Graham", "Harrison", "Jenkins", "King", "Lawrence", "Morgan",
            "Nelson", "Parker", "Quinn", "Reynolds", "Sullivan", "Turner"
        )

        val occupations = listOf(
            "Business Partner", "Personal Assistant", "Accountant", "Lawyer",
            "Family Member", "Competitor", "Employee", "Investor", "Colleague",
            "Former Partner", "Neighbor", "Associate"
        )

        val relationships = listOf(
            "Business partner for 5 years", "Ex-spouse", "Childhood friend",
            "Recent acquaintance", "Long-time rival", "Trusted confidant",
            "Distant relative", "Former employee", "Current employee",
            "Professional competitor", "Romantic interest"
        )

        return (0 until count).map { index ->
            val firstName = firstNames.random(random)
            val lastName = lastNames.random(random)
            val age = random.nextInt(25, 60)
            val occupation = occupations.random(random)
            val personality = PersonalityTrait.entries.random(random)
            val relationship = relationships.random(random)

            // Generate alibi
            val alibi = generateAlibi(index == 0) // First suspect will be guilty

            // Generate secrets
            val secrets = listOf(
                "Has significant debt that nobody knows about",
                "Was having an affair",
                "Has a criminal record from years ago",
                "Was being blackmailed",
                "Stole money from the company",
                "Lied about their credentials",
                "Has a hidden addiction",
                "Was planning to leave town"
            )

            Suspect(
                id = generateId(),
                fullName = "$firstName $lastName",
                age = age,
                occupation = occupation,
                personality = personality,
                relationshipToVictim = relationship,
                alibi = alibi,
                secretInformation = secrets.random(random),
                motive = if (index == 0) primaryMotive else Motive.entries.randomOrNull(random),
                isGuilty = index == 0, // First suspect is guilty
                behavioralQuirks = generateQuirks(personality),
                relatedEvidenceIds = mutableListOf() // Will be populated when evidence is generated
            )
        }.shuffled(random) // Shuffle so guilty party isn't always first
    }

    /**
     * Generate behavioral quirks based on personality
     */
    private fun generateQuirks(personality: PersonalityTrait): List<String> {
        val quirkMap = mapOf(
            PersonalityTrait.NERVOUS to listOf("taps fingers", "avoids eye contact", "speaks quickly"),
            PersonalityTrait.CONFIDENT to listOf("maintains eye contact", "sits relaxed", "speaks clearly"),
            PersonalityTrait.ARROGANT to listOf("interrupts frequently", "checks watch", "sighs often"),
            PersonalityTrait.DEFENSIVE to listOf("crosses arms", "leans back", "responds sharply"),
            PersonalityTrait.COOPERATIVE to listOf("nods frequently", "leans forward", "asks questions"),
            PersonalityTrait.AGGRESSIVE to listOf("raises voice", "points fingers", "invades space"),
            PersonalityTrait.SHY to listOf("speaks softly", "fidgets", "looks down"),
            PersonalityTrait.CALCULATING to listOf("pauses before answering", "steeples fingers", "watches carefully"),
            PersonalityTrait.EMOTIONAL to listOf("voice wavers", "tears up", "wrings hands"),
            PersonalityTrait.STOIC to listOf("expressionless", "monotone voice", "still posture")
        )

        return quirkMap[personality] ?: listOf("exhibits typical behavior")
    }

    /**
     * Generate an alibi
     */
    private fun generateAlibi(isGuilty: Boolean): Alibi {
        val locations = listOf(
            "home", "the office", "a restaurant downtown", "the gym",
            "a friend's house", "the library", "a coffee shop", "the park"
        )

        val witnesses = listOf(
            listOf("My spouse", "my neighbor"),
            listOf("My colleague", "the receptionist"),
            listOf("The waiter", "my dining companion"),
            listOf("Several other gym members"),
            listOf("My friend Sarah"),
            emptyList(),
            listOf("The barista"),
            listOf("Other joggers")
        )

        val location = locations.random(random)
        val witness = witnesses.random(random)

        val hasHoles = isGuilty && random.nextBoolean()
        val canBeVerified = !isGuilty || random.nextBoolean()

        return Alibi(
            location = location,
            timeRange = "between 9:00 PM and 11:00 PM",
            description = "I was at $location during the time in question.",
            witnesses = witness,
            canBeVerified = canBeVerified,
            hasHoles = hasHoles
        )
    }

    /**
     * Generate locations for investigation
     */
    private fun generateLocations(primaryType: LocationType, suspects: List<Suspect>): List<Location> {
        val locations = mutableListOf<Location>()

        // Primary crime scene
        val (desc, atmo) = when (primaryType) {
            LocationType.OFFICE -> LocationDescriptions.getOfficeDescription(0)
            LocationType.MANSION -> LocationDescriptions.getMansionDescription(0)
            LocationType.PARK -> LocationDescriptions.getParkDescription(0)
            LocationType.RESTAURANT -> LocationDescriptions.getRestaurantDescription(0)
            LocationType.WAREHOUSE -> LocationDescriptions.getWarehouseDescription(0)
            LocationType.GALLERY -> LocationDescriptions.getGalleryDescription(0)
            else -> "A location relevant to the investigation." to "The area shows signs of recent activity."
        }

        locations.add(
            Location(
                id = generateId(),
                name = "Primary Crime Scene",
                type = primaryType,
                description = desc,
                atmosphere = atmo,
                evidenceIds = mutableListOf(), // Will be populated
                isPrimaryCrimeScene = true
            )
        )

        // Secondary locations
        val secondaryCount = random.nextInt(2, 4)
        repeat(secondaryCount) {
            val type = LocationType.entries.filter { it != primaryType }.random(random)
            val (secDesc, secAtmo) = when (type) {
                LocationType.OFFICE -> LocationDescriptions.getOfficeDescription(1)
                LocationType.MANSION -> LocationDescriptions.getMansionDescription(1)
                LocationType.PARK -> LocationDescriptions.getParkDescription(1)
                LocationType.RESTAURANT -> LocationDescriptions.getRestaurantDescription(1)
                LocationType.WAREHOUSE -> LocationDescriptions.getWarehouseDescription(1)
                else -> "A secondary location." to "This place may contain additional clues."
            }

            locations.add(
                Location(
                    id = generateId(),
                    name = "${type} - Secondary Location",
                    type = type,
                    description = secDesc,
                    atmosphere = secAtmo,
                    evidenceIds = mutableListOf(),
                    isPrimaryCrimeScene = false
                )
            )
        }

        return locations
    }

    /**
     * Generate evidence items
     */
    private fun generateEvidence(
        count: Int,
        crimeType: CrimeType,
        suspects: List<Suspect>,
        guilty: Suspect,
        locations: List<Location>
    ): List<Evidence> {
        val evidence = mutableListOf<Evidence>()
        val guiltyEvidence = count / 2 // Half the evidence points to guilty party

        // Generate incriminating evidence for guilty party
        repeat(guiltyEvidence) {
            val ev = generateEvidenceItem(crimeType, guilty, locations, isIncriminating = true)
            evidence.add(ev)
        }

        // Generate evidence for other suspects (red herrings and context)
        val innocent = suspects.filter { !it.isGuilty }
        repeat(count - guiltyEvidence) {
            val suspect = innocent.random(random)
            val ev = generateEvidenceItem(crimeType, suspect, locations, isIncriminating = false)
            evidence.add(ev)
        }

        // Update suspects with related evidence IDs
        evidence.forEach { ev ->
            ev.relatedSuspectIds.forEach { suspectId ->
                suspects.find { it.id == suspectId }?.relatedEvidenceIds?.plus(ev.id)
            }
        }

        // Update locations with evidence IDs
        evidence.forEach { ev ->
            val location = locations.find { it.name == ev.locationFound }
            (location?.evidenceIds as? MutableList)?.add(ev.id)
        }

        return evidence.shuffled(random)
    }

    /**
     * Generate a single evidence item
     */
    private fun generateEvidenceItem(
        crimeType: CrimeType,
        relatedSuspect: Suspect,
        locations: List<Location>,
        isIncriminating: Boolean
    ): Evidence {
        val category = EvidenceCategory.entries.random(random)
        val location = locations.random(random).name

        val (name, description) = when (category) {
            EvidenceCategory.PHYSICAL -> generatePhysicalEvidence(relatedSuspect, isIncriminating)
            EvidenceCategory.DOCUMENTARY -> generateDocumentaryEvidence(relatedSuspect, isIncriminating)
            EvidenceCategory.TESTIMONIAL -> generateTestimonialEvidence(relatedSuspect)
            EvidenceCategory.FORENSIC -> generateForensicEvidence(crimeType, relatedSuspect, isIncriminating)
            EvidenceCategory.DIGITAL -> generateDigitalEvidence(relatedSuspect, isIncriminating)
        }

        return Evidence(
            id = generateId(),
            name = name,
            category = category,
            locationFound = location,
            description = description,
            relatedSuspectIds = listOf(relatedSuspect.id),
            timelineSignificance = if (isIncriminating) "Places suspect at the scene during the crime" else null,
            isIncriminating = isIncriminating
        )
    }

    private fun generatePhysicalEvidence(suspect: Suspect, isIncriminating: Boolean): Pair<String, String> {
        return if (isIncriminating) {
            "Fingerprints" to "A set of fingerprints found on a critical surface match ${suspect.fullName}'s prints in the database."
        } else {
            "Clothing Fiber" to "A fiber found at the scene is consistent with common materials and doesn't provide conclusive evidence."
        }
    }

    private fun generateDocumentaryEvidence(suspect: Suspect, isIncriminating: Boolean): Pair<String, String> {
        return if (isIncriminating) {
            "Incriminating Email" to "An email from ${suspect.fullName} suggests knowledge of information they claimed not to have."
        } else {
            "Receipt" to "A receipt showing ${suspect.fullName} made a purchase on the day of the crime, but timing is unclear."
        }
    }

    private fun generateTestimonialEvidence(suspect: Suspect): Pair<String, String> {
        return "Witness Statement" to "A witness places ${suspect.fullName} in the general area, but the timing is imprecise."
    }

    private fun generateForensicEvidence(crimeType: CrimeType, suspect: Suspect, isIncriminating: Boolean): Pair<String, String> {
        return if (crimeType == CrimeType.MURDER && isIncriminating) {
            "DNA Evidence" to "DNA evidence conclusively places ${suspect.fullName} at the crime scene during the relevant timeframe."
        } else {
            "Trace Evidence" to "Trace evidence found at the scene is common and doesn't point to a specific individual."
        }
    }

    private fun generateDigitalEvidence(suspect: Suspect, isIncriminating: Boolean): Pair<String, String> {
        return if (isIncriminating) {
            "Phone Location Data" to "Cell tower data places ${suspect.fullName}'s phone at the crime scene, contradicting their stated alibi."
        } else {
            "Text Message" to "A text message from ${suspect.fullName} shows they had contact with the victim, but content is innocuous."
        }
    }

    /**
     * Generate crime narrative
     */
    private fun generateCrimeNarrative(
        crimeType: CrimeType,
        victim: Victim,
        guilty: Suspect,
        motive: Motive,
        location: LocationType
    ): CrimeNarrative {
        val title = generateCaseTitle(crimeType, location)

        val description = when (crimeType) {
            CrimeType.MURDER ->
                "${victim.name}, a respected ${victim.occupation}, has been found dead at ${location.toString().lowercase()}. " +
                        "Evidence suggests foul play. Multiple individuals had access to the location."

            CrimeType.THEFT ->
                "A valuable item has been stolen from ${victim.name}'s ${location.toString().lowercase()}. " +
                        "The theft occurred during a narrow time window when several people were present."

            CrimeType.FRAUD ->
                "${victim.name} has been defrauded of a significant sum. " +
                        "The investigation points to someone with inside knowledge of their financial affairs."

            CrimeType.KIDNAPPING ->
                "${victim.name} was abducted from ${location.toString().lowercase()}. " +
                        "Whoever took them knew their schedule and movements."

            CrimeType.ARSON ->
                "A suspicious fire at ${victim.name}'s ${location.toString().lowercase()} has been ruled arson. " +
                        "The perpetrator had specific knowledge of the building's layout."
        }

        val howCommitted = "After careful planning, ${guilty.fullName} used their position as ${guilty.occupation} " +
                "to gain access to ${victim.name}. Their ${motive.toString().lowercase()} drove them to commit this crime. " +
                "They exploited the victim's trust and the circumstances to carry out their plan."

        val coverUp = "${guilty.fullName} attempted to establish an alibi by ${guilty.alibi.description.lowercase()} " +
                "However, they made critical errors that left behind evidence linking them to the crime scene."

        return CrimeNarrative(title, description, howCommitted, coverUp)
    }

    private fun generateCaseTitle(crimeType: CrimeType, location: LocationType): String {
        val adjectives = listOf("Midnight", "Silent", "Deadly", "Dark", "Fatal", "Hidden", "Secret")
        val adj = adjectives.random(random)

        return when (crimeType) {
            CrimeType.MURDER -> "The $adj ${location} Murder"
            CrimeType.THEFT -> "The $adj Heist"
            CrimeType.FRAUD -> "The $adj Deception"
            CrimeType.KIDNAPPING -> "The $adj Disappearance"
            CrimeType.ARSON -> "The $adj Flames"
        }
    }

    private fun generateTimestamp(): String {
        val hours = random.nextInt(0, 24)
        val minutes = random.nextInt(0, 60)
        val amPm = if (hours < 12) "AM" else "PM"
        val displayHour = if (hours == 0) 12 else if (hours > 12) hours - 12 else hours

        return String.format("%d:%02d %s, Last Night", displayHour, minutes, amPm)
    }

    private fun generateId(): String {
        return "id_${System.currentTimeMillis()}_${random.nextInt(1000, 9999)}"
    }

    private data class CrimeNarrative(
        val title: String,
        val description: String,
        val howCommitted: String,
        val coverUp: String
    )
}
