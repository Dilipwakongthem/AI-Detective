package com.casefiles.detective

import com.casefiles.detective.engine.*
import com.casefiles.detective.models.*
import com.casefiles.detective.ui.UITextManager
import java.util.*

/**
 * Console-based game launcher for demonstration
 * In a real Android app, this would be replaced with proper UI Activities/Fragments
 */
fun main() {
    val scanner = Scanner(System.`in`)
    val uiManager = UITextManager()

    // Create player profile
    val profile = PlayerProfile(
        badgeNumber = "DT-${Random().nextInt(10000, 99999)}",
        playerName = "Detective"
    )

    // Initialize basic tool
    profile.unlockedTools.add(DetectiveTool.BASIC_INVESTIGATION_KIT)

    // Create game engine
    val gameEngine = GameEngine(profile)

    var running = true
    var showTutorial = true

    println("\n" + "═".repeat(40))
    println("  CASE FILES: AI DETECTIVE")
    println("  Text-Based Mystery Game Engine")
    println("═".repeat(40))

    // Tutorial
    if (showTutorial) {
        for (step in 1..5) {
            println(uiManager.getTutorialText(step))
            scanner.nextLine()
        }
    }

    while (running) {
        println(uiManager.getMainMenuText(profile))
        print("Select option: ")

        when (scanner.nextLine().trim()) {
            "1" -> {
                // Start new case
                val case = gameEngine.startNewCase()
                println(uiManager.getCaseBriefingText(case))
                scanner.nextLine()
                runInvestigation(gameEngine, scanner, uiManager)
            }

            "2" -> {
                // Continue investigation
                if (gameEngine.currentCase != null) {
                    runInvestigation(gameEngine, scanner, uiManager)
                } else {
                    println("No active case. Start a new one!")
                    scanner.nextLine()
                }
            }

            "3" -> {
                // Case archive
                println(uiManager.getCaseArchiveText(gameEngine.caseArchive))
                scanner.nextLine()
            }

            "4" -> {
                // Profile
                println(profile.getProfileSummary())
                scanner.nextLine()
            }

            "5" -> {
                // Settings
                println(uiManager.getSettingsText(profile.settings))
                scanner.nextLine()
            }

            "6" -> {
                println("\nThanks for playing, Detective!")
                running = false
            }

            else -> println("Invalid option")
        }
    }
}

/**
 * Main investigation loop
 */
fun runInvestigation(engine: GameEngine, scanner: Scanner, ui: UITextManager) {
    var investigating = true

    while (investigating) {
        val progress = engine.getCaseProgress() ?: run {
            println("No active case!")
            return
        }

        val locations = engine.getAllLocations()
        println(ui.getLocationSelectionText(locations, progress.getProgressText()))
        print("Select action: ")

        when (val input = scanner.nextLine().trim().uppercase()) {
            "S" -> showSuspects(engine, scanner, ui)
            "E" -> showEvidenceBoard(engine, scanner, ui)
            "A" -> {
                if (makeAccusation(engine, scanner, ui)) {
                    investigating = false
                }
            }
            "H" -> requestHint(engine, scanner, ui)
            "X" -> {
                if (engine.abandonCase()) {
                    println("Case abandoned.")
                    investigating = false
                }
            }
            else -> {
                // Try to visit location
                val locationNum = input.toIntOrNull()
                if (locationNum != null && locationNum in 1..locations.size) {
                    visitLocation(engine, locations[locationNum - 1], scanner, ui)
                }
            }
        }
    }
}

/**
 * Visit and investigate a location
 */
fun visitLocation(
    engine: GameEngine,
    location: Location,
    scanner: Scanner,
    ui: UITextManager
) {
    val result = engine.visitLocation(location.id)

    if (result is LocationVisitResult.Success) {
        println(ui.getLocationInvestigationText(result.location, result.availableEvidence))

        while (true) {
            print("Action: ")
            when (val input = scanner.nextLine().trim().uppercase()) {
                "B" -> return
                else -> {
                    val evidenceNum = input.toIntOrNull()
                    if (evidenceNum != null && evidenceNum in 1..result.availableEvidence.size) {
                        val evidence = result.availableEvidence[evidenceNum - 1]
                        println(ui.getEvidenceExaminationText(evidence))

                        if (!evidence.isCollected) {
                            print("Collect evidence? (Y/N): ")
                            if (scanner.nextLine().trim().uppercase() == "Y") {
                                engine.collectEvidence(evidence.id)
                                println("Evidence collected!")
                                scanner.nextLine()
                                return
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Show and interrogate suspects
 */
fun showSuspects(engine: GameEngine, scanner: Scanner, ui: UITextManager) {
    val suspects = engine.getAllSuspects()
    println(ui.getSuspectListText(suspects))
    print("Action: ")

    when (val input = scanner.nextLine().trim().uppercase()) {
        "B" -> return
        else -> {
            val suspectNum = input.toIntOrNull()
            if (suspectNum != null && suspectNum in 1..suspects.size) {
                interrogateSuspect(engine, suspects[suspectNum - 1], scanner, ui)
            }
        }
    }
}

/**
 * Interrogate a suspect
 */
fun interrogateSuspect(
    engine: GameEngine,
    suspect: Suspect,
    scanner: Scanner,
    ui: UITextManager
) {
    val result = engine.startInterrogation(suspect.id)

    if (result is InterrogationStartResult.Success) {
        var interrogating = true

        while (interrogating) {
            println(ui.getInterrogationStartText(result.suspect))
            print("Action: ")

            when (scanner.nextLine().trim().uppercase()) {
                "Q" -> {
                    print("Ask question: ")
                    val question = scanner.nextLine()
                    val response = engine.askQuestion(suspect.id, question)

                    if (response is QuestionResult.Success) {
                        println(ui.formatDialogueResponse(suspect, response.response))
                        scanner.nextLine()
                    }
                }

                "E" -> {
                    val evidence = engine.getCollectedEvidence()
                    if (evidence.isEmpty()) {
                        println("No evidence collected yet!")
                        scanner.nextLine()
                    } else {
                        println("Select evidence to show:")
                        evidence.forEachIndexed { index, ev ->
                            println("[${index + 1}] ${ev.name}")
                        }
                        print("Evidence #: ")
                        val evNum = scanner.nextLine().toIntOrNull()
                        if (evNum != null && evNum in 1..evidence.size) {
                            val showResult = engine.showEvidence(suspect.id, evidence[evNum - 1].id)
                            if (showResult is EvidenceShowResult.Success) {
                                println(ui.formatDialogueResponse(suspect, showResult.response))
                                scanner.nextLine()
                            }
                        }
                    }
                }

                "B" -> interrogating = false
            }
        }
    }
}

/**
 * Show evidence board
 */
fun showEvidenceBoard(engine: GameEngine, scanner: Scanner, ui: UITextManager) {
    val evidence = engine.getCollectedEvidence()
    println(ui.getEvidenceBoardText(evidence, emptyList()))
    scanner.nextLine()
}

/**
 * Make an accusation
 */
fun makeAccusation(engine: GameEngine, scanner: Scanner, ui: UITextManager): Boolean {
    val suspects = engine.getAllSuspects()
    val evidence = engine.getCollectedEvidence()
    val progress = engine.getCaseProgress() ?: return false

    println(ui.getAccusationScreenText(suspects, evidence, progress.theoryStrength))
    print("Accuse suspect #: ")

    val suspectNum = scanner.nextLine().trim().toIntOrNull()
    if (suspectNum == null || suspectNum !in 1..suspects.size) {
        println("Invalid selection")
        return false
    }

    val accused = suspects[suspectNum - 1]

    println("\nWhat was their motive?")
    Motive.entries.forEachIndexed { index, motive ->
        println("[${index + 1}] $motive")
    }
    print("Motive #: ")

    val motiveNum = scanner.nextLine().trim().toIntOrNull()
    if (motiveNum == null || motiveNum !in 1..Motive.entries.size) {
        println("Invalid selection")
        return false
    }

    val motive = Motive.entries[motiveNum - 1]

    println("\nSelect supporting evidence (comma-separated numbers):")
    evidence.forEachIndexed { index, ev ->
        println("[${index + 1}] ${ev.name}")
    }
    print("Evidence: ")

    val evidenceNums = scanner.nextLine().split(",").mapNotNull { it.trim().toIntOrNull() }
    val selectedEvidence = evidenceNums.mapNotNull { num ->
        if (num in 1..evidence.size) evidence[num - 1].id else null
    }

    if (selectedEvidence.size < 3) {
        println("You must select at least 3 pieces of evidence!")
        scanner.nextLine()
        return false
    }

    print("\nExplain your reasoning (min 100 characters): ")
    val reasoning = scanner.nextLine()

    if (reasoning.length < 100) {
        println("Please provide more detailed reasoning!")
        scanner.nextLine()
        return false
    }

    val accusation = Accusation(
        accusedSuspectId = accused.id,
        selectedMotive = motive,
        supportingEvidenceIds = selectedEvidence,
        playerReasoning = reasoning
    )

    val outcome = engine.makeAccusation(accusation)

    when (outcome) {
        is AccusationOutcome.Correct -> {
            println(ui.getCorrectAccusationText(outcome.result, engine.caseArchive.last()))
            scanner.nextLine()
            return true
        }

        is AccusationOutcome.Incorrect -> {
            println(ui.getIncorrectAccusationText(outcome.result))
            print("Continue (1) or Abandon (2)? ")
            return scanner.nextLine().trim() == "2"
        }

        else -> {
            println("Error making accusation")
            return false
        }
    }
}

/**
 * Request a hint
 */
fun requestHint(engine: GameEngine, scanner: Scanner, ui: UITextManager) {
    println("\nHint Level:")
    println("[1] Subtle (Free)")
    println("[2] Moderate (Cost: ${engine.getPlayerStats().settings.difficulty.getHintCost() / 2})")
    println("[3] Major (Cost: ${engine.getPlayerStats().settings.difficulty.getHintCost()})")
    print("Level: ")

    val level = scanner.nextLine().trim().toIntOrNull() ?: 1
    val result = engine.requestHint(level)

    when (result) {
        is HintResult.Success -> {
            println(ui.getHintText(result.hint, result.cost, level))
            scanner.nextLine()
        }

        is HintResult.InsufficientReputation -> {
            println("Insufficient reputation! Need ${result.required} points.")
            scanner.nextLine()
        }

        else -> {
            println("Cannot get hint right now.")
            scanner.nextLine()
        }
    }
}
