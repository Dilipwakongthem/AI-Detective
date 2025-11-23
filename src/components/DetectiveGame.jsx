import React, { useState, useEffect } from 'react';
import { generateCase, interrogateSuspect, evaluateAccusation, DIFFICULTY_LEVELS } from '../gameLogic';
import './DetectiveGame.css';
import CaseLibraryScreen from './CaseLibraryScreen';
import CasePackStore from './CasePackStore';
import { initializeCaseLibrary, getDailyCase, isCaseUnlocked, markCaseCompleted } from '../utils/caseLibraryManager';
import { HAND_CRAFTED_CASES } from '../handCraftedCases';

const DetectiveGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, briefing, investigation, interrogation, accusation, result, profile
  const [currentCase, setCurrentCase] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [playerProfile, setPlayerProfile] = useState({
    rank: 'Detective',
    rankLevel: 1,
    reputation: 1500,
    casesSolved: 0,
    totalStars: 0,
    perfectCases: 0,
    wrongAccusations: 0,
    eliteRating: 0,
    currentStreak: 0,
    longestStreak: 0,
    legendaryCasesCompleted: 0,
    totalPlayTime: 0
  });
  const [gameLog, setGameLog] = useState([]);
  const [showEvidence, setShowEvidence] = useState(false);
  const [accusationResult, setAccusationResult] = useState(null);
  const [showRankUp, setShowRankUp] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [caseDetailsExpanded, setCaseDetailsExpanded] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [notification, setNotification] = useState(null);
  const [showCaseLibrary, setShowCaseLibrary] = useState(false);
  const [showCasePackStore, setShowCasePackStore] = useState(false);
  const [selectedCaseType, setSelectedCaseType] = useState(null); // 'procedural', 'hand-crafted', 'daily'

  // Contradiction system state
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [contradictionsFound, setContradictionsFound] = useState([]);
  const [showContradictionReveal, setShowContradictionReveal] = useState(false);
  const [currentContradiction, setCurrentContradiction] = useState(null);

  // Difficulty system state
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_LEVELS.NORMAL);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);

  // Initialize systems on mount
  useEffect(() => {
    initializeCaseLibrary();
  }, []);

  // Notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Case Library handlers
  const handleStartCaseFromLibrary = (caseData) => {
    setShowCaseLibrary(false);

    if (caseData.type === 'procedural') {
      // Start a procedural case (existing random generation)
      setSelectedCaseType('procedural');
      startNewCase(false);
    } else {
      // Start a hand-crafted case
      setSelectedCaseType('hand-crafted');
      const handCraftedCase = caseData.case || caseData;

      // Convert hand-crafted case to game format
      const gameCase = convertHandCraftedCaseToGameFormat(handCraftedCase);
      setCurrentCase(gameCase);
      setGameState('briefing');
      setHintsUsed(0);
      setHintLevel(0);
      scrollToTop();
    }
  };

  const convertHandCraftedCaseToGameFormat = (handCraftedCase) => {
    // Convert the hand-crafted case structure to match the game's expected format
    return {
      ...handCraftedCase,
      caseNumber: Date.now(), // Unique ID
      suspects: handCraftedCase.suspects.map(s => ({
        ...s,
        questioned: false,
        nervousness: 50,
        lastResponse: null,
        // Trust/Fear/Respect system
        trust: 0,      // -50 to +50
        fear: 0,       // 0 to 100
        respect: 0     // -25 to +25
      })),
      evidence: handCraftedCase.evidence.map(e => ({
        ...e,
        discovered: false,
        examined: false
      })),
      hints: handCraftedCase.hints || [],
      isHandCrafted: true,
      handCraftedId: handCraftedCase.id
    };
  };

  const handleCaseCompletion = (stars, wasCorrect) => {
    if (currentCase?.isHandCrafted && currentCase.handCraftedId) {
      // Track completion in case library
      const timeSpent = Math.floor(Math.random() * 1800) + 600; // 10-40 minutes (demo)
      markCaseCompleted(currentCase.handCraftedId, stars, timeSpent, wasCorrect);
    }
  };

  const handleOpenStore = (section = 'case_packs') => {
    setShowCaseLibrary(false);
    setShowCasePackStore(true);
  };

  const handlePurchaseComplete = (result) => {
    showNotification(`Successfully unlocked! ${result.premiumAccess ? 'Full library access granted!' : ''}`, 'success');
  };

  // Scroll utility functions
  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Calculate theory strength
  const calculateTheoryStrength = () => {
    if (!currentCase) return { label: 'Unknown', stars: 0, percentage: 0 };

    // Prevent division by zero for cases with empty arrays
    const evidenceScore = currentCase.evidence.length > 0
      ? (currentCase.evidence.filter(e => e.discovered).length / currentCase.evidence.length) * 40
      : 0;
    const interrogationScore = currentCase.suspects.length > 0
      ? (currentCase.suspects.filter(s => s.questioned).length / currentCase.suspects.length) * 30
      : 0;
    const connectionScore = 30; // Simplified for now

    const total = evidenceScore + interrogationScore + connectionScore;

    if (total < 30) return { label: 'Weak', stars: 1, percentage: total };
    if (total < 50) return { label: 'Developing', stars: 2, percentage: total };
    if (total < 70) return { label: 'Moderate', stars: 3, percentage: total };
    if (total < 90) return { label: 'Strong', stars: 4, percentage: total };
    return { label: 'Very Strong', stars: 5, percentage: total };
  };

  const getRankInfo = (rankLevel) => {
    const ranks = [
      { level: 1, name: 'Detective', minRep: 0, casesRequired: 0 },
      { level: 2, name: 'Senior Detective', minRep: 3000, casesRequired: 5 },
      { level: 3, name: 'Lead Investigator', minRep: 6000, casesRequired: 12 },
      { level: 4, name: 'Detective Inspector', minRep: 10000, casesRequired: 20 },
      { level: 5, name: 'Senior Inspector', minRep: 15000, casesRequired: 30 },
      { level: 6, name: 'Chief Detective', minRep: 25000, casesRequired: 50 }
    ];
    return ranks.find(r => r.level === rankLevel) || ranks[0];
  };

  const checkRankUp = (profile) => {
    if (profile.rankLevel >= 6) return null; // Max rank

    const nextRank = getRankInfo(profile.rankLevel + 1);
    if (profile.reputation >= nextRank.minRep && profile.casesSolved >= nextRank.casesRequired) {
      return nextRank;
    }
    return null;
  };

  const getCaseDifficulty = () => {
    // For Chief Detective (rank 6), always return elite difficulty (8-10)
    if (playerProfile.rankLevel >= 6) {
      return 8 + Math.floor(Math.random() * 3); // 8, 9, or 10
    }
    // For other ranks, scale difficulty based on rank
    return Math.min(playerProfile.rankLevel + Math.floor(Math.random() * 2), 10);
  };

  const getFreeHints = (difficulty) => {
    // Easier cases get more free hints
    if (difficulty <= 2) return 3;
    if (difficulty <= 4) return 2;
    if (difficulty <= 6) return 1;
    return 0; // Hard cases (7-10) get no free hints
  };

  const getHintCost = () => {
    // Cost increases with each hint used beyond free hints
    const freeHints = getFreeHints(currentCase?.difficulty || 1);
    if (hintsUsed < freeHints) return 0;
    return 100 * (hintsUsed - freeHints + 1); // 100, 200, 300, etc.
  };

  const generateHint = () => {
    if (!currentCase) return '';

    // Safely access guilty suspect - prevent array index out of bounds
    const guiltySuspect = currentCase.suspects && currentCase.suspects.length > 0 && currentCase.guiltyIndex !== undefined
      ? currentCase.suspects[currentCase.guiltyIndex]
      : null;
    const evidenceFound = currentCase.evidence.filter(e => e.discovered).length;
    const totalEvidence = currentCase.evidence.length;

    // Progressive hints based on hint level
    if (hintLevel === 0) {
      return `💡 Hint: Focus on collecting more evidence. You've found ${evidenceFound}/${totalEvidence} pieces. Critical evidence can reveal important connections.`;
    } else if (hintLevel === 1) {
      return `💡 Hint: Pay attention to suspects with high nervousness levels during interrogation. The guilty party often shows signs of stress.`;
    } else if (hintLevel === 2) {
      return `💡 Hint: Look for contradictions in alibis. The perpetrator is someone with opportunity and motive. Check who was present at the crime scene.`;
    } else if (hintLevel === 3 && guiltySuspect) {
      return `💡 Hint: The guilty party is ${guiltySuspect.age} years old and works as a ${guiltySuspect.occupation}. Look for evidence connecting them to the crime.`;
    } else if (guiltySuspect) {
      return `💡 Hint: All evidence points to ${guiltySuspect.name}. Review the clues carefully before making your accusation.`;
    } else {
      return `💡 Hint: Gather more evidence and interrogate the suspects to build your case.`;
    }
  };

  const requestHint = () => {
    const cost = getHintCost();

    if (cost > 0 && playerProfile.reputation < cost) {
      alert(`⚠️ Insufficient Reputation!\n\nYou need ${cost} reputation to purchase this hint.\nYour current reputation: ${playerProfile.reputation}`);
      return;
    }

    const freeHints = getFreeHints(currentCase?.difficulty || 1);
    const hint = generateHint();

    if (cost > 0) {
      if (window.confirm(`💡 Purchase Hint?\n\nCost: ${cost} Reputation\nCurrent Reputation: ${playerProfile.reputation}\n\nThis will reduce your star rating for this case.\n\nProceed?`)) {
        setPlayerProfile({
          ...playerProfile,
          reputation: playerProfile.reputation - cost
        });
        setHintsUsed(hintsUsed + 1);
        setHintLevel(hintLevel + 1);
        addLog(hint);
        alert(hint);
      }
    } else {
      setHintsUsed(hintsUsed + 1);
      setHintLevel(hintLevel + 1);
      addLog(hint);
      alert(`${hint}\n\n(Free hint ${hintsUsed + 1}/${freeHints})`);
    }
  };

  const startNewCase = (isLegendary = false) => {
    const newCase = generateCase(playerProfile.casesSolved + 1, selectedDifficulty, isLegendary);
    setCurrentCase(newCase);
    setGameState('briefing');
    setGameLog([]);
    setAccusationResult(null);
    setHintsUsed(0);
    setHintLevel(0);
    setShowDifficultySelector(false);
  };

  const startInvestigation = () => {
    setGameState('investigation');
    addLog('🔍 Investigation started. Explore the crime scene and gather evidence.');
  };

  const investigateLocation = async (locationName) => {
    setLoadingAction(locationName);

    // Simulate search delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const undiscoveredEvidence = currentCase.evidence.filter(e => !e.discovered);
    if (undiscoveredEvidence.length > 0) {
      const found = undiscoveredEvidence[Math.floor(Math.random() * undiscoveredEvidence.length)];
      found.discovered = true;
      setCurrentCase({ ...currentCase, cluesFound: currentCase.cluesFound + 1 });
      addLog(`🔍 Found evidence: ${found.type} - ${found.description}`);
      showNotification(`✅ Evidence discovered!`, 'success');
    } else {
      addLog('🔍 No new evidence found in this location.');
      showNotification(`⚠️ No new evidence found`, 'info');
    }

    setLoadingAction('');
    // Auto-scroll to investigation log
    setTimeout(() => scrollToElement('investigation-log'), 100);
  };

  const selectSuspect = (suspect) => {
    setSelectedSuspect(suspect);
    setGameState('interrogation');
    addLog(`👤 Now interrogating: ${suspect.name}`);
  };

  const askQuestion = () => {
    if (!selectedSuspect) return;

    const result = interrogateSuspect(selectedSuspect, currentCase);
    selectedSuspect.questioned = true;
    selectedSuspect.nervousness = result.nervousness;
    selectedSuspect.lastBodyLanguage = result.bodyLanguage; // Store for emotion display

    setCurrentCase({
      ...currentCase,
      interrogationCount: currentCase.interrogationCount + 1
    });

    addLog(`❓ You: "Can you explain your whereabouts?"`);
    addLog(`💬 ${selectedSuspect.name}: "${result.response}"`);
    addLog(`👁️ Body Language: ${result.bodyLanguage} | Nervousness: ${result.nervousness}%`);
  };

  // Contradiction System - Detect if evidence contradicts suspect's statement
  const detectContradiction = (evidence, suspect) => {
    const contradictions = [];

    // Timeline contradictions - check alibi vs evidence
    if (evidence.type === 'Security Footage' || evidence.type === 'Phone Records') {
      if (suspect.alibi.toLowerCase().includes('elsewhere') ||
          suspect.alibi.toLowerCase().includes('different room') ||
          suspect.alibi.toLowerCase().includes('outside')) {
        contradictions.push({
          type: 'temporal',
          title: 'Timeline Impossibility',
          description: `${evidence.description} contradicts ${suspect.name}'s claim of being elsewhere!`
        });
      }
    }

    // Physical contradictions - fingerprints, DNA
    if ((evidence.type === 'Fingerprints' || evidence.type === 'DNA Sample') &&
        evidence.description.toLowerCase().includes(suspect.name.toLowerCase())) {
      if (suspect.alibi.toLowerCase().includes('never') ||
          suspect.alibi.toLowerCase().includes('wasn\'t there')) {
        contradictions.push({
          type: 'physical',
          title: 'Physical Evidence Contradiction',
          description: `${suspect.name} claims they weren't there, but their ${evidence.type.toLowerCase()} were found at the scene!`
        });
      }
    }

    // Alibi contradictions - witness testimony vs suspect claims
    if (evidence.type === 'Witness Testimony' &&
        evidence.description.toLowerCase().includes(suspect.name.toLowerCase())) {
      contradictions.push({
        type: 'logical',
        title: 'Witness Statement Contradiction',
        description: `A witness contradicts ${suspect.name}'s version of events!`
      });
    }

    // Location contradictions
    if (evidence.location && suspect.alibi.toLowerCase().includes('different') &&
        !suspect.alibi.toLowerCase().includes(evidence.location.toLowerCase())) {
      contradictions.push({
        type: 'spatial',
        title: 'Location Inconsistency',
        description: `Evidence from ${evidence.location} contradicts ${suspect.name}'s stated location!`
      });
    }

    return contradictions;
  };

  // Present evidence to suspect
  const presentEvidence = (evidence) => {
    if (!selectedSuspect || !evidence) return;

    setShowEvidenceModal(false);

    const contradictions = detectContradiction(evidence, selectedSuspect);

    if (contradictions.length > 0) {
      // Found a contradiction!
      const contradiction = contradictions[0];
      setCurrentContradiction({
        evidence,
        suspect: selectedSuspect,
        ...contradiction
      });
      setShowContradictionReveal(true);

      // Increase nervousness significantly
      selectedSuspect.nervousness = Math.min(selectedSuspect.nervousness + 25, 100);

      // Track this contradiction
      setContradictionsFound([...contradictionsFound, contradiction]);

      // Add dramatic log entry
      addLog(`⚡ OBJECTION! You present "${evidence.description}"`);
      addLog(`🎯 CONTRADICTION FOUND: ${contradiction.title}`);
      addLog(`📢 ${contradiction.description}`);
      addLog(`😰 ${selectedSuspect.name} becomes visibly shaken! Nervousness: ${selectedSuspect.nervousness}%`);

      // Auto-close contradiction reveal after 4 seconds
      setTimeout(() => setShowContradictionReveal(false), 4000);
    } else {
      // No contradiction, normal evidence presentation
      addLog(`📄 You present "${evidence.description}" to ${selectedSuspect.name}.`);
      if (selectedSuspect.isGuilty) {
        addLog(`😟 ${selectedSuspect.name} looks uncomfortable but maintains their story.`);
        selectedSuspect.nervousness = Math.min(selectedSuspect.nervousness + 5, 100);
      } else {
        addLog(`🤔 ${selectedSuspect.name} examines the evidence and appears confused about its relevance.`);
      }
    }

    setCurrentCase({...currentCase});
  };

  const makeAccusation = (suspectId) => {
    const result = evaluateAccusation(suspectId, currentCase, hintsUsed);
    setAccusationResult(result);

    if (result.correct) {
      const newStreak = playerProfile.currentStreak + 1;
      const isPerfect = result.stars === 5;
      const elitePoints = calculateElitePoints(result, currentCase);

      const updatedProfile = {
        ...playerProfile,
        casesSolved: playerProfile.casesSolved + 1,
        reputation: playerProfile.reputation + result.reputation,
        totalStars: playerProfile.totalStars + result.stars,
        perfectCases: isPerfect ? playerProfile.perfectCases + 1 : playerProfile.perfectCases,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, playerProfile.longestStreak),
        eliteRating: Math.min(playerProfile.eliteRating + elitePoints, 10000),
        legendaryCasesCompleted: currentCase.isLegendary ? playerProfile.legendaryCasesCompleted + 1 : playerProfile.legendaryCasesCompleted
      };

      // Check for rank up
      const rankUp = checkRankUp(updatedProfile);
      if (rankUp) {
        updatedProfile.rankLevel = rankUp.level;
        updatedProfile.rank = rankUp.name;
        setShowRankUp(rankUp);
      }

      setPlayerProfile(updatedProfile);
    } else {
      // Wrong accusation
      setPlayerProfile({
        ...playerProfile,
        wrongAccusations: playerProfile.wrongAccusations + 1,
        currentStreak: 0,
        reputation: Math.max(0, playerProfile.reputation + result.reputation)
      });
    }

    setGameState('result');
    // Auto-scroll to top to show result
    setTimeout(() => scrollToTop(), 100);
  };

  const calculateElitePoints = (result, caseData) => {
    let points = 0;

    // Deduction Accuracy (max 100 pts per case)
    if (result.correct) points += 100;
    if (result.stars === 5) points += 50;

    // Evidence Analysis (max 40 pts) - prevent division by zero
    const evidenceRatio = caseData.evidence.length > 0
      ? caseData.evidence.filter(e => e.discovered).length / caseData.evidence.length
      : 0;
    points += Math.floor(evidenceRatio * 40);

    // Interrogation Skill (max 30 pts) - prevent division by zero
    const interrogationRatio = caseData.suspects.length > 0
      ? caseData.suspects.filter(s => s.questioned).length / caseData.suspects.length
      : 0;
    points += Math.floor(interrogationRatio * 30);

    // Speed bonus (max 30 pts) - assume average case takes 30 min
    // This is simulated since we don't track real time
    points += Math.floor(Math.random() * 30);

    // Legendary case multiplier
    if (caseData.isLegendary) {
      points *= 2;
    }

    return points;
  };

  const addLog = (message) => {
    setGameLog(prev => [...prev, { text: message, timestamp: new Date().toLocaleTimeString(), isNew: true }]);

    // Remove "isNew" flag after animation completes
    setTimeout(() => {
      setGameLog(prev => prev.map(entry => ({ ...entry, isNew: false })));
    }, 700);
  };

  const handleReturnToMenu = () => {
    if (gameState === 'investigation' || gameState === 'interrogation' || gameState === 'accusation') {
      // Show save & exit confirmation
      if (window.confirm(`⚠️ SAVE & EXIT?\n\nYou have an investigation in progress.\n\nCurrent Case: Case #${currentCase.caseNumber}\nProgress: Evidence ${currentCase.evidence.filter(e => e.discovered).length}/${currentCase.evidence.length}\nSuspects Interviewed: ${currentCase.suspects.filter(s => s.questioned).length}/${currentCase.suspects.length}\n\nYour progress will be lost.\n\nReturn to Main Menu?`)) {
        setGameState('menu');
        setCurrentCase(null);
        setSelectedSuspect(null);
        setGameLog([]);
      }
    } else {
      setGameState('menu');
    }
  };

  const renderMenu = () => {
    const currentRank = getRankInfo(playerProfile.rankLevel);
    const nextRank = playerProfile.rankLevel < 6 ? getRankInfo(playerProfile.rankLevel + 1) : null;
    const isChiefDetective = playerProfile.rankLevel >= 6;
    const legendaryChance = Math.random() < 0.1; // 10% chance

    return (
      <div className="menu-screen screen-enter">
        <div className="game-title">
          <h1>AI DETECTIVE</h1>
          <h2>CRIME SCENE</h2>
          <p className="tagline">Solve Crimes with AI-Powered Interrogation</p>
        </div>
        <div className="player-stats">
          <div className="stat">
            <span className="stat-label">Rank:</span>
            <span className="stat-value">{playerProfile.rank}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Reputation:</span>
            <span className="stat-value">{playerProfile.reputation}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Cases Solved:</span>
            <span className="stat-value">{playerProfile.casesSolved}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Perfect Cases:</span>
            <span className="stat-value">{playerProfile.perfectCases}</span>
          </div>
          {isChiefDetective && (
            <>
              <div className="stat">
                <span className="stat-label">Elite Rating:</span>
                <span className="stat-value">{playerProfile.eliteRating}/10,000</span>
              </div>
              <div className="stat">
                <span className="stat-label">Current Streak:</span>
                <span className="stat-value">{playerProfile.currentStreak} 🔥</span>
              </div>
            </>
          )}
        </div>

        {!isChiefDetective && nextRank && (
          <div className="rank-progress">
            <p><strong>Next Rank: {nextRank.name}</strong></p>
            <p>Progress: {playerProfile.casesSolved}/{nextRank.casesRequired} cases | {playerProfile.reputation}/{nextRank.minRep} reputation</p>
          </div>
        )}

        {isChiefDetective && (
          <div className="chief-badge">
            🏆 CHIEF DETECTIVE - ELITE CASE MODE 🏆
            <p style={{fontSize: '0.9em', marginTop: '5px'}}>Unlimited elite cases available</p>
          </div>
        )}

        <button className="menu-btn" onClick={() => setShowDifficultySelector(true)} data-tooltip="Start a random procedural case">
          🎲 QUICK PLAY
        </button>

        <button className="menu-btn menu-btn-featured" onClick={() => setShowCaseLibrary(true)} data-tooltip="Browse hand-crafted cases and your completed cases">
          📚 CASE LIBRARY
        </button>

        <button className="menu-btn-secondary" onClick={() => {
          const dailyCase = getDailyCase();
          if (dailyCase && dailyCase.case) {
            handleStartCaseFromLibrary(dailyCase);
          }
        }} data-tooltip="Play today's special case">
          📅 DAILY CASE
        </button>

        {isChiefDetective && legendaryChance && (
          <button className="legendary-btn" onClick={() => startNewCase(true)} data-tooltip="Take on an extremely difficult legendary case">
            🌟 LEGENDARY CASE AVAILABLE 🌟
          </button>
        )}

        <button className="menu-btn-secondary" onClick={() => setGameState('profile')} data-tooltip="View your detective statistics and progression">
          👤 DETECTIVE PROFILE
        </button>

        <button className="menu-btn-store" onClick={() => setShowCasePackStore(true)} data-tooltip="Purchase case packs and premium content">
          🛒 STORE
        </button>

        <div className="menu-info">
          <p>Your mission: Investigate crime scenes, interrogate suspects, and solve the case!</p>
        </div>
        <div className="version-info">
          Version 1.0 | © 2025
        </div>
      </div>
    );
  };

  const renderBriefing = () => (
    <div className="briefing-screen screen-enter">
      <button className="home-btn" onClick={handleReturnToMenu} data-tooltip="Return to Main Menu">
        🏠 HOME
      </button>
      <div className="case-header">
        <h2>🗂️ CASE #{currentCase.caseNumber}</h2>
        <div className="case-type">{currentCase.crimeType}</div>
      </div>
      <div className="briefing-content">
        <div className="briefing-section">
          <h3>📍 LOCATION</h3>
          <p>{currentCase.location}</p>
        </div>
        <div className="briefing-section">
          <h3>👤 VICTIM</h3>
          <p>{currentCase.victim.name} - {currentCase.victim.occupation}</p>
        </div>
        <div className="briefing-section">
          <h3>📋 SITUATION</h3>
          <p>A {currentCase.crimeType.toLowerCase()} has occurred at {currentCase.location}.
             {currentCase.suspects.length} suspects are being held for questioning.
             Your task is to identify the perpetrator.</p>
        </div>
        <div className="briefing-section">
          <h3>🎯 OBJECTIVE</h3>
          <p>Gather evidence, interrogate suspects, and make your accusation.</p>
        </div>
      </div>
      <button className="action-btn" onClick={startInvestigation}>
        BEGIN INVESTIGATION →
      </button>
    </div>
  );

  const renderInvestigation = () => {
    const freeHints = getFreeHints(currentCase?.difficulty || 1);
    const hintCost = getHintCost();
    const hintsRemaining = Math.max(0, freeHints - hintsUsed);
    const evidenceCollected = currentCase.evidence.filter(e => e.discovered).length;
    const totalEvidence = currentCase.evidence.length;
    const suspectsInterrogated = currentCase.suspects.filter(s => s.questioned).length;
    const totalSuspects = currentCase.suspects.length;
    const evidencePercentage = Math.round((evidenceCollected / totalEvidence) * 100);
    const interrogationPercentage = Math.round((suspectsInterrogated / totalSuspects) * 100);
    const theoryStrength = calculateTheoryStrength();

    return (
      <div className="investigation-screen screen-enter">
        <button className="home-btn" onClick={handleReturnToMenu} data-tooltip="Save & Return to Main Menu">
          🏠 HOME
        </button>
        <div className="investigation-header">
          <div className="header-content">
            <h2>🔍 INVESTIGATION - Case #{currentCase.caseNumber}</h2>
            <div className="case-progress">
              <span>Evidence: {evidenceCollected}/{totalEvidence}</span>
              <span>Interrogations: {currentCase.interrogationCount}</span>
            </div>
          </div>
        </div>

        <div className="case-details-section">
          <button
            className="case-details-toggle"
            onClick={() => setCaseDetailsExpanded(!caseDetailsExpanded)}
          >
            {caseDetailsExpanded ? '▼' : '▶'} Case Details
          </button>
          {caseDetailsExpanded && (
            <div className="case-details-content">
              <h3>Case #{currentCase.caseNumber}</h3>
              <p><strong>Crime Type:</strong> {currentCase.crimeType}</p>
              <p><strong>Location:</strong> {currentCase.location}</p>
              <p><strong>Victim:</strong> {currentCase.victim.name} - {currentCase.victim.occupation}</p>
              <p><strong>Situation:</strong> A {currentCase.crimeType.toLowerCase()} has occurred at {currentCase.location}. {currentCase.suspects.length} suspects are being held for questioning. Your task is to identify the perpetrator.</p>
              <p><strong>Objective:</strong> Gather evidence, interrogate suspects, and make your accusation.</p>
            </div>
          )}
        </div>

        <div className="progress-section">
          <h3>📊 INVESTIGATION PROGRESS</h3>

          <div className="progress-item">
            <div className="progress-label">
              <span>Evidence Collected</span>
              <span className="progress-value">{evidenceCollected}/{totalEvidence} ({evidencePercentage}%)</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${evidencePercentage}%` }}></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-label">
              <span>Suspects Interrogated</span>
              <span className="progress-value">{suspectsInterrogated}/{totalSuspects} ({interrogationPercentage}%)</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${interrogationPercentage}%` }}></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-label">
              <span>Theory Strength</span>
              <span className="progress-stars">{'⭐'.repeat(theoryStrength.stars)}{'⚪'.repeat(5 - theoryStrength.stars)}</span>
            </div>
            <div className="progress-bar theory-strength">
              <div className="progress-fill" style={{ width: `${theoryStrength.percentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="section-divider"></div>

      <div className="investigation-main">
        <div className="suspects-panel">
          <h3>👥 SUSPECTS</h3>
          <div className="suspects-list">
            {currentCase.suspects.map(suspect => (
              <div
                key={suspect.id}
                className={`suspect-card ${suspect.questioned ? 'interrogated' : ''}`}
                onClick={() => selectSuspect(suspect)}
                data-tooltip={suspect.questioned ? 'View interrogation summary' : 'Click to interrogate'}
              >
                <div className="suspect-name">{suspect.name}</div>
                <div className="suspect-details">
                  <div>{suspect.age} • {suspect.occupation}</div>
                  <div className="personality">Personality: {suspect.personality}</div>
                  <div className="suspicion">
                    Suspicion: {'⭐'.repeat(suspect.suspicionLevel)}{'⚪'.repeat(5 - suspect.suspicionLevel)}
                  </div>
                  {suspect.questioned && (
                    <div className="nervousness">Nervousness: {suspect.nervousness}%</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="actions-panel">
          <h3>🎬 ACTIONS</h3>
          <button
            className={`action-btn ${loadingAction === 'Crime Scene' ? 'loading' : ''}`}
            onClick={() => investigateLocation('Crime Scene')}
            disabled={loadingAction !== ''}
            data-tooltip="Search the crime scene for evidence"
          >
            {loadingAction === 'Crime Scene' ? '🔄 Searching Crime Scene...' : '🔍 Search Crime Scene'}
          </button>
          <button
            className={`action-btn ${loadingAction === 'Office' ? 'loading' : ''}`}
            onClick={() => investigateLocation('Office')}
            disabled={loadingAction !== ''}
            data-tooltip="Search the victim's office for clues"
          >
            {loadingAction === 'Office' ? '🔄 Searching Office...' : '🔍 Search Office'}
          </button>
          <button
            className={`action-btn ${loadingAction === 'Storage' ? 'loading' : ''}`}
            onClick={() => investigateLocation('Storage')}
            disabled={loadingAction !== ''}
            data-tooltip="Search the storage room for hidden evidence"
          >
            {loadingAction === 'Storage' ? '🔄 Searching Storage Room...' : '🔍 Search Storage Room'}
          </button>
          <button
            className="action-btn"
            onClick={() => {
              setShowEvidence(!showEvidence);
              if (!showEvidence) {
                setTimeout(() => scrollToElement('evidence-board'), 100);
              }
            }}
            data-tooltip="Review all collected evidence"
          >
            📋 {showEvidence ? 'Hide' : 'View'} Evidence Board
          </button>
          <button
            className="action-btn hint-btn-action"
            onClick={requestHint}
            data-tooltip={hintCost > 0 ? `Purchase hint for ${hintCost} reputation` : `Get help with investigation (${hintsRemaining} free remaining)`}
          >
            💡 Request Hint
            {hintCost > 0 && <span className="hint-cost"> ({hintCost})</span>}
            {hintsRemaining > 0 && <span className="hint-free"> (Free)</span>}
          </button>
          <button className="action-btn accusation-btn" onClick={() => setGameState('accusation')} data-tooltip="Accuse a suspect of the crime">
            ⚖️ MAKE ACCUSATION
          </button>
        </div>
      </div>

      {showEvidence && (
        <div id="evidence-board" className="evidence-board">
          <h3>📋 EVIDENCE BOARD</h3>
          <div className="evidence-list">
            {currentCase.evidence.filter(e => e.discovered).map(evidence => (
              <div key={evidence.id} className="evidence-item">
                <div className="evidence-type">{evidence.type}</div>
                <div className="evidence-desc">{evidence.description}</div>
                <div className="evidence-location">Found at: {evidence.location}</div>
                {evidence.critical && <span className="critical-badge">⚠️ CRITICAL</span>}
              </div>
            ))}
            {currentCase.evidence.filter(e => e.discovered).length === 0 && (
              <p className="no-evidence">No evidence collected yet. Start investigating!</p>
            )}
          </div>
        </div>
      )}

      <div id="investigation-log" className="game-log">
        <h3>📜 INVESTIGATION LOG</h3>
        <div className="log-entries">
          {gameLog.map((entry, i) => (
            <div key={i} className={`log-entry ${entry.isNew ? 'log-entry-new' : ''}`}>
              <span className="log-time">[{entry.timestamp}]</span>
              <span className="log-text">{entry.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  };

  const renderInterrogation = () => (
    <div className="interrogation-screen screen-enter">
      <div className="interrogation-header">
        <button className="home-btn" onClick={handleReturnToMenu} title="Save & Return to Main Menu">
          🏠 HOME
        </button>
        <h2>💬 INTERROGATION</h2>
        <button className="back-btn" onClick={() => setGameState('investigation')}>
          ← Back to Investigation
        </button>
      </div>

      {selectedSuspect && (
        <div className="interrogation-content">
          <div className="suspect-profile">
            <h3>{selectedSuspect.name}</h3>

            {/* Emotional State Indicator */}
            <div className="emotion-display">
              <div className="emotion-icon">
                {selectedSuspect.nervousness >= 80 ? '😰' :
                 selectedSuspect.nervousness >= 60 ? '😟' :
                 selectedSuspect.nervousness >= 40 ? '😐' :
                 selectedSuspect.nervousness >= 20 ? '🙂' : '😌'}
              </div>
              <div className="emotion-label">
                {selectedSuspect.nervousness >= 80 ? 'PANICKED' :
                 selectedSuspect.nervousness >= 60 ? 'NERVOUS' :
                 selectedSuspect.nervousness >= 40 ? 'CAUTIOUS' :
                 selectedSuspect.nervousness >= 20 ? 'CALM' : 'RELAXED'}
              </div>
            </div>

            {/* Body Language Display */}
            {selectedSuspect.lastBodyLanguage && (
              <div className="body-language-display">
                <span className="body-language-icon">👁️</span>
                <span className="body-language-text">{selectedSuspect.lastBodyLanguage}</span>
              </div>
            )}

            <div className="profile-details">
              <p><strong>Age:</strong> {selectedSuspect.age}</p>
              <p><strong>Occupation:</strong> {selectedSuspect.occupation}</p>
              <p><strong>Personality:</strong> {selectedSuspect.personality}</p>
              <p><strong>Alibi:</strong> {selectedSuspect.alibi}</p>
              <p><strong>Nervousness Level:</strong> {selectedSuspect.nervousness}%</p>
              <div className="nervousness-bar">
                <div
                  className={`nervousness-fill ${
                    selectedSuspect.nervousness >= 80 ? 'critical' :
                    selectedSuspect.nervousness >= 60 ? 'high' :
                    selectedSuspect.nervousness >= 40 ? 'medium' : 'low'
                  }`}
                  style={{ width: `${selectedSuspect.nervousness}%` }}
                />
              </div>

              {/* Trust/Fear/Respect Meters */}
              <div className="relationship-meters">
                <div className="meter-row">
                  <span className="meter-label">💚 Trust:</span>
                  <div className="meter-bar trust-meter">
                    <div
                      className="meter-fill trust-fill"
                      style={{
                        width: `${((selectedSuspect.trust + 50) / 100) * 100}%`,
                        marginLeft: selectedSuspect.trust < 0 ? `${((50 + selectedSuspect.trust) / 100) * 100}%` : '0'
                      }}
                    />
                    <div className="meter-center-mark" />
                  </div>
                  <span className="meter-value">{selectedSuspect.trust}</span>
                </div>

                <div className="meter-row">
                  <span className="meter-label">😨 Fear:</span>
                  <div className="meter-bar fear-meter">
                    <div
                      className="meter-fill fear-fill"
                      style={{ width: `${selectedSuspect.fear}%` }}
                    />
                  </div>
                  <span className="meter-value">{selectedSuspect.fear}</span>
                </div>

                <div className="meter-row">
                  <span className="meter-label">⭐ Respect:</span>
                  <div className="meter-bar respect-meter">
                    <div
                      className="meter-fill respect-fill"
                      style={{
                        width: `${((selectedSuspect.respect + 25) / 50) * 100}%`,
                        marginLeft: selectedSuspect.respect < 0 ? `${((25 + selectedSuspect.respect) / 50) * 100}%` : '0'
                      }}
                    />
                    <div className="meter-center-mark" />
                  </div>
                  <span className="meter-value">{selectedSuspect.respect}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="interrogation-actions">
            <button className="action-btn approach-empathy" onClick={() => {
              // Empathetic approach - builds trust, reduces fear
              selectedSuspect.trust = Math.min(selectedSuspect.trust + 10, 50);
              selectedSuspect.fear = Math.max(selectedSuspect.fear - 5, 0);
              selectedSuspect.respect = Math.min(selectedSuspect.respect + 3, 25);
              addLog(`💚 You show empathy towards ${selectedSuspect.name}.`);
              if (selectedSuspect.isGuilty) {
                addLog(`They seem to appreciate your kindness but remain guarded.`);
              } else {
                addLog(`They open up more, feeling understood.`);
              }
              setCurrentCase({...currentCase});
            }} data-tooltip="Build rapport through empathy (+Trust, -Fear, +Respect)">
              💚 Show Empathy
            </button>

            <button className="action-btn approach-aggressive" onClick={() => {
              // Aggressive approach - increases fear, reduces trust
              selectedSuspect.fear = Math.min(selectedSuspect.fear + 15, 100);
              selectedSuspect.trust = Math.max(selectedSuspect.trust - 10, -50);
              selectedSuspect.respect = Math.max(selectedSuspect.respect - 5, -25);
              if (selectedSuspect.isGuilty) {
                selectedSuspect.nervousness = Math.min(selectedSuspect.nervousness + 20, 100);
                addLog(`⚠️ You aggressively confront ${selectedSuspect.name}. They become visibly shaken!`);
              } else {
                addLog(`⚠️ You raise your voice at ${selectedSuspect.name}. They look offended but hold their ground.`);
              }
              setCurrentCase({...currentCase});
            }} data-tooltip="Intimidate the suspect (+Fear, -Trust, -Respect)">
              ⚠️ Intimidate
            </button>

            <button className="action-btn approach-logical" onClick={() => {
              // Logical approach - builds respect
              selectedSuspect.respect = Math.min(selectedSuspect.respect + 8, 25);
              selectedSuspect.trust = Math.min(selectedSuspect.trust + 5, 50);
              addLog(`🧠 You present a logical argument to ${selectedSuspect.name}.`);
              if (selectedSuspect.isGuilty) {
                selectedSuspect.nervousness = Math.min(selectedSuspect.nervousness + 10, 100);
                addLog(`They struggle to counter your reasoning.`);
              } else {
                addLog(`They nod in agreement with your deductive approach.`);
              }
              setCurrentCase({...currentCase});
            }} data-tooltip="Use logic and deduction (+Respect, +Trust)">
              🧠 Use Logic
            </button>

            <button
              className="action-btn approach-evidence"
              onClick={() => setShowEvidenceModal(true)}
              disabled={currentCase.evidence.filter(e => e.discovered).length === 0}
              data-tooltip={currentCase.evidence.filter(e => e.discovered).length === 0 ? "No evidence collected yet" : "Present evidence to find contradictions"}
            >
              📄 Present Evidence
            </button>
          </div>

          <div className="interrogation-log">
            {gameLog.slice(-6).map((entry, i) => (
              <div key={i} className="log-entry">
                <span className="log-text">{entry.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAccusation = () => (
    <div className="accusation-screen screen-enter">
      <button className="home-btn" onClick={handleReturnToMenu} data-tooltip="Save & Return to Main Menu">
        🏠 HOME
      </button>
      <div className="accusation-header">
        <h2>⚖️ MAKE YOUR ACCUSATION</h2>
        <p>Choose the suspect you believe is guilty:</p>
      </div>

      <div className="accusation-suspects">
        {currentCase.suspects.map(suspect => (
          <div key={suspect.id} className="accusation-card" onClick={() => makeAccusation(suspect.id)}>
            <h3>{suspect.name}</h3>
            <p>{suspect.occupation}</p>
            <div className="accusation-details">
              <div>Suspicion: {'⭐'.repeat(suspect.suspicionLevel)}</div>
              {suspect.questioned && <div>Nervousness: {suspect.nervousness}%</div>}
            </div>
            <button className="accuse-btn">ACCUSE</button>
          </div>
        ))}
      </div>

      <button className="back-btn" onClick={() => setGameState('investigation')}>
        ← Continue Investigation
      </button>
    </div>
  );

  const renderResult = () => (
    <div className="result-screen screen-enter">
      <div className={`result-header ${accusationResult.correct ? 'success' : 'failure'}`}>
        <h2>{accusationResult.message}</h2>
        {accusationResult.correct && (
          <div className="stars">
            {'⭐'.repeat(accusationResult.stars)}{'☆'.repeat(5 - accusationResult.stars)}
          </div>
        )}
        {currentCase.isLegendary && accusationResult.correct && (
          <div className="legendary-complete">
            🌟 LEGENDARY CASE COMPLETED! 🌟
          </div>
        )}
      </div>

      {showRankUp && (
        <div className="rank-up-notification">
          <h3>🎖️ PROMOTION! 🎖️</h3>
          <p>You've been promoted to <strong>{showRankUp.name}</strong>!</p>
          <p>Continue solving cases to reach even higher ranks.</p>
          {showRankUp.level === 6 && (
            <div className="chief-unlock">
              <p><strong>🏆 CHIEF DETECTIVE UNLOCKED 🏆</strong></p>
              <p>You now have access to unlimited Elite Cases and Legendary Cases!</p>
            </div>
          )}
        </div>
      )}

      <div className="result-content">
        <div className="result-section">
          <h3>📊 CASE SUMMARY</h3>
          <p><strong>Crime:</strong> {currentCase.crimeType}</p>
          {currentCase.difficulty && <p><strong>Difficulty:</strong> {'⭐'.repeat(Math.min(currentCase.difficulty, 10))}</p>}
          <p><strong>Location:</strong> {currentCase.location}</p>
          <p><strong>Evidence Collected:</strong> {currentCase.evidence.filter(e => e.discovered).length}/{currentCase.evidence.length}</p>
          <p><strong>Suspects Interrogated:</strong> {currentCase.suspects.filter(s => s.questioned).length}/{currentCase.suspects.length}</p>
        </div>

        <div className="result-section">
          <h3>💭 EVALUATION</h3>
          <p>{accusationResult.feedback}</p>
        </div>

        <div className="result-section">
          <h3>🏆 REWARDS</h3>
          <p><strong>Reputation Gained:</strong> {accusationResult.reputation > 0 ? '+' : ''}{accusationResult.reputation}</p>
          <p><strong>New Reputation:</strong> {playerProfile.reputation}</p>
          {accusationResult.correct && (
            <>
              <p><strong>Cases Solved:</strong> {playerProfile.casesSolved}</p>
              <p><strong>Current Streak:</strong> {playerProfile.currentStreak} 🔥</p>
              {playerProfile.rankLevel >= 6 && (
                <p><strong>Elite Points Earned:</strong> +{calculateElitePoints(accusationResult, currentCase)}</p>
              )}
            </>
          )}
        </div>

        <div className="result-section">
          <h3>🔍 THE TRUTH</h3>
          <p>The guilty party was: <strong>
            {currentCase.suspects && currentCase.suspects.length > 0 && currentCase.guiltyIndex !== undefined
              ? currentCase.suspects[currentCase.guiltyIndex].name
              : 'Unknown'}
          </strong></p>
          <p>Motive: Professional rivalry and financial gain</p>
        </div>
      </div>

      <div className="result-actions">
        <button className="action-btn" onClick={() => { setGameState('menu'); setShowRankUp(false); }}>
          🏠 Return to Menu
        </button>
        <button className="action-btn" onClick={() => { startNewCase(); setShowRankUp(false); }}>
          🎯 Next Case
        </button>
      </div>
    </div>
  );

  const renderProfile = () => {
    const currentRank = getRankInfo(playerProfile.rankLevel);
    const isChiefDetective = playerProfile.rankLevel >= 6;

    return (
      <div className="profile-screen screen-enter">
        <button className="home-btn" onClick={() => setGameState('menu')} title="Return to Main Menu">
          ← BACK
        </button>
        <div className="profile-header">
          <h2>👤 DETECTIVE PROFILE</h2>
          <div className="badge-display">
            <span className="rank-badge">{playerProfile.rank}</span>
            {isChiefDetective && <span className="chief-badge-icon">🏆</span>}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>📊 CAREER STATISTICS</h3>
            <div className="stat-grid">
              <div className="stat-item">
                <span className="stat-label">Total Cases Solved:</span>
                <span className="stat-value">{playerProfile.casesSolved}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Perfect Cases:</span>
                <span className="stat-value">{playerProfile.perfectCases} ⭐</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Success Rate:</span>
                <span className="stat-value">
                  {playerProfile.casesSolved > 0
                    ? Math.round((playerProfile.casesSolved / (playerProfile.casesSolved + playerProfile.wrongAccusations)) * 100)
                    : 100}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Reputation:</span>
                <span className="stat-value">{playerProfile.reputation}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Current Streak:</span>
                <span className="stat-value">{playerProfile.currentStreak} 🔥</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Longest Streak:</span>
                <span className="stat-value">{playerProfile.longestStreak} 🔥</span>
              </div>
            </div>
          </div>

          {isChiefDetective && (
            <div className="profile-section">
              <h3>⭐ ELITE PERFORMANCE</h3>
              <div className="elite-stats">
                <div className="elite-rating-bar">
                  <div className="elite-label">Elite Rating: {playerProfile.eliteRating}/10,000</div>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{width: `${(playerProfile.eliteRating / 10000) * 100}%`}}></div>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Legendary Cases Completed:</span>
                  <span className="stat-value">{playerProfile.legendaryCasesCompleted} 🌟</span>
                </div>
              </div>
            </div>
          )}

          <div className="profile-section">
            <h3>🎖️ RANK PROGRESSION</h3>
            <div className="rank-list">
              {[1, 2, 3, 4, 5, 6].map(level => {
                const rank = getRankInfo(level);
                const achieved = playerProfile.rankLevel >= level;
                return (
                  <div key={level} className={`rank-item ${achieved ? 'achieved' : 'locked'}`}>
                    <span className="rank-number">{level}</span>
                    <span className="rank-name">{rank.name}</span>
                    {achieved ? '✅' : '🔒'}
                  </div>
                );
              })}
            </div>
          </div>

          {!isChiefDetective && (
            <div className="profile-section next-rank-info">
              <h3>🎯 NEXT RANK REQUIREMENTS</h3>
              {(() => {
                const nextRank = getRankInfo(playerProfile.rankLevel + 1);
                return (
                  <div className="requirements">
                    <p><strong>{nextRank.name}</strong></p>
                    <div className="requirement-item">
                      <span>Cases Solved:</span>
                      <span>{playerProfile.casesSolved}/{nextRank.casesRequired}</span>
                    </div>
                    <div className="requirement-item">
                      <span>Reputation:</span>
                      <span>{playerProfile.reputation}/{nextRank.minRep}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="detective-game">
      {gameState === 'menu' && renderMenu()}
      {gameState === 'briefing' && renderBriefing()}
      {gameState === 'investigation' && renderInvestigation()}
      {gameState === 'interrogation' && renderInterrogation()}
      {gameState === 'accusation' && renderAccusation()}
      {gameState === 'result' && renderResult()}
      {gameState === 'profile' && renderProfile()}

      {/* Notification System */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Case Library Screen */}
      {showCaseLibrary && (
        <CaseLibraryScreen
          onStartCase={handleStartCaseFromLibrary}
          onClose={() => setShowCaseLibrary(false)}
          onOpenStore={handleOpenStore}
        />
      )}

      {/* Case Pack Store */}
      {showCasePackStore && (
        <CasePackStore
          onClose={() => setShowCasePackStore(false)}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}

      {/* Evidence Selection Modal */}
      {showEvidenceModal && currentCase && (
        <div className="modal-overlay" onClick={() => setShowEvidenceModal(false)}>
          <div className="modal-content evidence-selection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📄 SELECT EVIDENCE TO PRESENT</h2>
              <button className="modal-close" onClick={() => setShowEvidenceModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-subtitle">Choose which evidence to present to {selectedSuspect?.name}</p>
              <div className="evidence-selection-grid">
                {currentCase.evidence.filter(e => e.discovered).map(evidence => (
                  <div
                    key={evidence.id}
                    className="evidence-selection-card"
                    onClick={() => presentEvidence(evidence)}
                  >
                    <div className="evidence-type-badge">{evidence.type}</div>
                    <div className="evidence-description">{evidence.description}</div>
                    <div className="evidence-location-tag">📍 {evidence.location}</div>
                    {evidence.critical && <span className="critical-indicator">⚠️ CRITICAL</span>}
                  </div>
                ))}
              </div>
              {currentCase.evidence.filter(e => e.discovered).length === 0 && (
                <p className="no-evidence-message">No evidence collected yet. Investigate locations first!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contradiction Reveal Modal */}
      {showContradictionReveal && currentContradiction && (
        <div className="modal-overlay contradiction-overlay">
          <div className="contradiction-reveal screen-shake">
            <div className="objection-banner">
              <h1>⚡ OBJECTION! ⚡</h1>
            </div>
            <div className="contradiction-content">
              <h2 className="contradiction-type">{currentContradiction.type.toUpperCase()} CONTRADICTION</h2>
              <h3 className="contradiction-title">{currentContradiction.title}</h3>
              <div className="contradiction-details">
                <div className="evidence-presented">
                  <strong>Evidence:</strong> {currentContradiction.evidence.description}
                </div>
                <div className="contradiction-arrow">⬇️</div>
                <div className="contradiction-explanation">
                  {currentContradiction.description}
                </div>
              </div>
              <div className="suspect-reaction">
                <p>😰 {currentContradiction.suspect.name}'s nervousness increased to {currentContradiction.suspect.nervousness}%!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty Selector Modal */}
      {showDifficultySelector && (
        <div className="modal-overlay" onClick={() => setShowDifficultySelector(false)}>
          <div className="modal-content difficulty-selector-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎯 SELECT DIFFICULTY</h2>
              <button className="modal-close" onClick={() => setShowDifficultySelector(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="difficulty-grid">
                {Object.values(DIFFICULTY_LEVELS).map((diff) => (
                  <div
                    key={diff.name}
                    className={`difficulty-card ${selectedDifficulty === diff ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      startNewCase(false);
                    }}
                  >
                    <h3 className="difficulty-name">{diff.name}</h3>
                    <p className="difficulty-description">{diff.description}</p>
                    <div className="difficulty-stats">
                      <div className="stat-item">👥 {diff.suspects} Suspects</div>
                      <div className="stat-item">🔍 {diff.evidence} Evidence</div>
                      <div className="stat-item">❌ {diff.redHerrings} Red Herrings</div>
                      <div className="stat-item">
                        💡 {diff.freeHints === Infinity ? '∞' : diff.freeHints} Free Hints
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectiveGame;
