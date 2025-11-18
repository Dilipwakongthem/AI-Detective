import React, { useState, useEffect } from 'react';
import { generateCase, interrogateSuspect, evaluateAccusation } from '../gameLogic';
import StoreScreen from './StoreScreen';
import NotebookModal from './NotebookModal';
import ThemeSelectorModal from './ThemeSelectorModal';
import './DetectiveGame.css';

// Import monetization utilities
import {
  initializeStorage,
  checkAndResetDailyCases,
  formatTimeUntilReset,
  canStartCase,
  useDailyCase,
  useBonusCase,
  useCaseFile,
  getCaseFiles,
  getHintTokens,
  useHintToken,
  getAdCounter,
  canWatchAd,
  hasAdRemoval,
  hasNotebook,
  savePlayerProfile,
  loadPlayerProfile
} from '../utils/storageManager';

import { initializeNotebook } from '../utils/notebookManager';
import { initializeTheme } from '../utils/themeManager';

import {
  initializeAds,
  requestHintWithAd,
  requestBonusCaseWithAd,
  offerReputationDoubler,
  getRemainingAdWatches
} from '../utils/adManager';

import { initializeIAP } from '../utils/iapManager';

const DetectiveGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, briefing, investigation, interrogation, accusation, result, profile, store
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

  // Monetization state
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [showCaseLimitModal, setShowCaseLimitModal] = useState(false);
  const [showReputationDoublerModal, setShowReputationDoublerModal] = useState(false);
  const [baseReputationEarned, setBaseReputationEarned] = useState(0);

  // Premium features state
  const [showNotebook, setShowNotebook] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Initialize monetization systems on mount
  useEffect(() => {
    // Initialize storage
    initializeStorage();

    // Load saved player profile
    const savedProfile = loadPlayerProfile();
    if (savedProfile) {
      setPlayerProfile(savedProfile);
    }

    // Initialize ads and IAP
    initializeAds();
    initializeIAP();

    // Initialize premium features
    initializeNotebook();
    initializeTheme();

    // Check and reset daily cases
    const resetResult = checkAndResetDailyCases();
    if (resetResult.reset && resetResult.message) {
      showNotification(resetResult.message, 'success');
    }

    // Update time until reset every minute
    const timer = setInterval(() => {
      setTimeUntilReset(formatTimeUntilReset());

      // Check for daily reset
      const result = checkAndResetDailyCases();
      if (result.reset && result.message) {
        showNotification(result.message, 'success');
      }
    }, 60000); // Every minute

    // Initial time update
    setTimeUntilReset(formatTimeUntilReset());

    return () => clearInterval(timer);
  }, []);

  // Save player profile whenever it changes
  useEffect(() => {
    savePlayerProfile(playerProfile);
  }, [playerProfile]);

  // Notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
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

    const evidenceScore = (currentCase.evidence.filter(e => e.discovered).length / currentCase.evidence.length) * 40;
    const interrogationScore = (currentCase.suspects.filter(s => s.questioned).length / currentCase.suspects.length) * 30;
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

    // Check if player has hint tokens
    const hintTokens = getHintTokens();
    if (hintTokens > 0) {
      return 0; // Free if they have tokens
    }

    return 100 * (hintsUsed - freeHints + 1); // 100, 200, 300, etc.
  };

  const generateHint = () => {
    if (!currentCase) return '';

    const guiltySuspect = currentCase.suspects[currentCase.guiltyIndex];
    const evidenceFound = currentCase.evidence.filter(e => e.discovered).length;
    const totalEvidence = currentCase.evidence.length;

    // Progressive hints based on hint level
    if (hintLevel === 0) {
      return `💡 Hint: Focus on collecting more evidence. You've found ${evidenceFound}/${totalEvidence} pieces. Critical evidence can reveal important connections.`;
    } else if (hintLevel === 1) {
      return `💡 Hint: Pay attention to suspects with high nervousness levels during interrogation. The guilty party often shows signs of stress.`;
    } else if (hintLevel === 2) {
      return `💡 Hint: Look for contradictions in alibis. The perpetrator is someone with opportunity and motive. Check who was present at the crime scene.`;
    } else if (hintLevel === 3) {
      return `💡 Hint: The guilty party is ${guiltySuspect.age} years old and works as a ${guiltySuspect.occupation}. Look for evidence connecting them to the crime.`;
    } else {
      return `💡 Hint: All evidence points to ${guiltySuspect.name}. Review the clues carefully before making your accusation.`;
    }
  };

  const requestHint = () => {
    const freeHints = getFreeHints(currentCase?.difficulty || 1);
    const hintTokens = getHintTokens();
    const cost = getHintCost();

    // Check if free hints are available
    if (hintsUsed < freeHints) {
      // Grant free hint
      const hint = generateHint();
      setHintsUsed(hintsUsed + 1);
      setHintLevel(hintLevel + 1);
      addLog(hint);
      showNotification(`${hint}\n\n(Free hint ${hintsUsed + 1}/${freeHints})`, 'info');
      return;
    }

    // Check if player has hint tokens
    if (hintTokens > 0) {
      if (window.confirm(`💡 Use Hint Token?\n\nYou have ${hintTokens} hint tokens.\n\nUse 1 token to get a hint?\n\nThis will reduce your star rating for this case.`)) {
        const result = useHintToken();
        if (result.success) {
          const hint = generateHint();
          setHintsUsed(hintsUsed + 1);
          setHintLevel(hintLevel + 1);
          addLog(hint);
          showNotification(`${hint}\n\nHint tokens remaining: ${result.remaining}`, 'info');
        }
      }
      return;
    }

    // Check if can watch ad for hint
    if (canWatchAd('hints')) {
      const watchAd = window.confirm(`💡 No Free Hints Remaining\n\nYou've used all free hints for this case.\n\nOptions:\n1. Watch a 30-second ad to get 1 free hint\n2. Buy hint tokens in the store\n3. Pay ${cost} reputation\n\nWatch ad for free hint?`);

      if (watchAd) {
        // Request hint with ad
        requestHintWithAd(
          (result) => {
            // Ad watched successfully, grant hint
            const hint = generateHint();
            setHintsUsed(hintsUsed + 1);
            setHintLevel(hintLevel + 1);
            addLog(hint);
            showNotification(`✅ ${hint}\n\nHint earned via ad!`, 'success');
          },
          (error) => {
            showNotification(`Ad failed: ${error.message}`, 'error');
          }
        );
      }
      return;
    }

    // No free hints, no tokens, no ads left - must pay reputation
    if (cost > 0 && playerProfile.reputation < cost) {
      showNotification(`⚠️ Insufficient Reputation!\n\nYou need ${cost} reputation to purchase this hint.\nYour current reputation: ${playerProfile.reputation}\n\nBuy hint tokens in the store!`, 'error');
      return;
    }

    if (cost > 0) {
      if (window.confirm(`💡 Purchase Hint?\n\nCost: ${cost} Reputation\nCurrent Reputation: ${playerProfile.reputation}\n\nThis will reduce your star rating for this case.\n\nProceed?`)) {
        setPlayerProfile({
          ...playerProfile,
          reputation: playerProfile.reputation - cost
        });
        const hint = generateHint();
        setHintsUsed(hintsUsed + 1);
        setHintLevel(hintLevel + 1);
        addLog(hint);
        showNotification(hint, 'info');
      }
    }
  };

  const startNewCase = (isLegendary = false) => {
    // Check if player can start a case
    const caseAvailability = canStartCase();

    if (!caseAvailability.canStart) {
      // No cases available - show modal
      setShowCaseLimitModal(true);
      return;
    }

    // Determine which case source to use and deduct
    let caseSource = 'daily';

    if (caseAvailability.dailyRemaining > 0) {
      const result = useDailyCase();
      caseSource = 'daily';
      showNotification(`Daily case used. ${result.remaining} free cases remaining today.`, 'info');
    } else if (caseAvailability.bonusRemaining > 0) {
      const result = useBonusCase();
      caseSource = 'bonus';
      showNotification(`Bonus case used. ${result.remaining} bonus cases remaining today.`, 'info');
    } else if (caseAvailability.caseFilesRemaining > 0) {
      const result = useCaseFile();
      caseSource = 'purchased';
      showNotification(`Case file used. ${result.remaining} case files remaining.`, 'success');
    }

    // Generate and start the case
    const difficulty = isLegendary ? 10 : getCaseDifficulty();
    const newCase = generateCase(playerProfile.casesSolved + 1, difficulty, isLegendary);
    setCurrentCase(newCase);
    setGameState('briefing');
    setGameLog([]);
    setAccusationResult(null);
    setHintsUsed(0);
    setHintLevel(0);
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

    setCurrentCase({
      ...currentCase,
      interrogationCount: currentCase.interrogationCount + 1
    });

    addLog(`❓ You: "Can you explain your whereabouts?"`);
    addLog(`💬 ${selectedSuspect.name}: "${result.response}"`);
    addLog(`👁️ Body Language: ${result.bodyLanguage} | Nervousness: ${result.nervousness}%`);
  };

  const makeAccusation = (suspectId) => {
    const result = evaluateAccusation(suspectId, currentCase, hintsUsed);
    setAccusationResult(result);

    if (result.correct) {
      const newStreak = playerProfile.currentStreak + 1;
      const isPerfect = result.stars === 5;
      const elitePoints = calculateElitePoints(result, currentCase);

      // Store base reputation for doubler offer
      setBaseReputationEarned(result.reputation);

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

      // Offer reputation doubler (after a short delay)
      setTimeout(() => {
        setShowReputationDoublerModal(true);
      }, 2000);

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

    // Evidence Analysis (max 40 pts)
    const evidenceRatio = caseData.evidence.filter(e => e.discovered).length / caseData.evidence.length;
    points += Math.floor(evidenceRatio * 40);

    // Interrogation Skill (max 30 pts)
    const interrogationRatio = caseData.suspects.filter(s => s.questioned).length / caseData.suspects.length;
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

  const renderCaseLimitModal = () => {
    const caseAvailability = canStartCase();
    const adWatches = getRemainingAdWatches();
    const caseFiles = getCaseFiles();

    return (
      <div className="modal-overlay" onClick={() => setShowCaseLimitModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>⏰ DAILY CASE LIMIT REACHED</h2>
          <p>You've completed your 5 free cases today!</p>
          <p>Great detective work! 🎯</p>

          <div className="modal-section">
            <h3>PLAY MORE CASES TODAY:</h3>

            {/* Bonus cases via ads */}
            {adWatches.cases > 0 && (
              <div className="modal-option featured">
                <h4>📺 WATCH AD FOR BONUS CASE</h4>
                <p>• Watch 30-second video</p>
                <p>• Play 1 more case (FREE)</p>
                <p>• {adWatches.cases} bonus cases available today</p>
                <p className="bonus-indicator">Bonus used: {adWatches.casesUsed}/3</p>
                <button
                  className="modal-btn primary"
                  onClick={() => {
                    setShowCaseLimitModal(false);
                    requestBonusCaseWithAd(
                      (result) => {
                        showNotification('✅ Bonus case unlocked! Starting case...', 'success');
                        startNewCase(false);
                      },
                      (error) => {
                        showNotification(`Ad failed: ${error.message}`, 'error');
                      }
                    );
                  }}
                >
                  WATCH AD - GET BONUS CASE
                </button>
              </div>
            )}

            {/* Use case file */}
            <div className="modal-option">
              <h4>💼 USE CASE FILE</h4>
              <p>You have: {caseFiles} case files</p>
              {caseFiles > 0 ? (
                <button
                  className="modal-btn"
                  onClick={() => {
                    setShowCaseLimitModal(false);
                    startNewCase(false);
                  }}
                >
                  USE CASE FILE
                </button>
              ) : (
                <button
                  className="modal-btn"
                  onClick={() => {
                    setShowCaseLimitModal(false);
                    setGameState('store');
                  }}
                >
                  BUY CASE FILES
                </button>
              )}
            </div>

            {/* Come back tomorrow */}
            <div className="modal-option">
              <h4>⏰ COME BACK TOMORROW</h4>
              <p>5 fresh cases reset at midnight</p>
              <p>Resets in: {timeUntilReset}</p>
              <button className="modal-btn secondary" onClick={() => setShowCaseLimitModal(false)}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReputationDoublerModal = () => {
    if (!showReputationDoublerModal || !accusationResult || !accusationResult.correct) {
      return null;
    }

    const isPremium = hasAdRemoval();

    return (
      <div className="modal-overlay" onClick={() => setShowReputationDoublerModal(false)}>
        <div className="modal-content reputation-doubler" onClick={(e) => e.stopPropagation()}>
          <h2>🎯 EXCELLENT WORK!</h2>
          <p>You earned {baseReputationEarned} reputation points!</p>

          {isPremium ? (
            <>
              <div className="modal-section featured">
                <h3>✨ PREMIUM BONUS ✨</h3>
                <p>As a premium member, your reputation is automatically doubled!</p>
                <p className="reputation-display">
                  <span className="old-rep">{baseReputationEarned}</span>
                  →
                  <span className="new-rep">{baseReputationEarned * 2}</span>
                </p>
                <button
                  className="modal-btn primary"
                  onClick={() => {
                    // Double the reputation
                    setPlayerProfile({
                      ...playerProfile,
                      reputation: playerProfile.reputation + baseReputationEarned
                    });
                    showNotification(`✅ Reputation doubled! +${baseReputationEarned} bonus!`, 'success');
                    setShowReputationDoublerModal(false);
                  }}
                >
                  CLAIM BONUS
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="modal-section">
                <h3>📺 WATCH AD TO DOUBLE REPUTATION?</h3>
                <p>Watch 30 seconds, get +{baseReputationEarned} extra!</p>
                <p>Total: +{baseReputationEarned * 2} reputation</p>
                <button
                  className="modal-btn primary"
                  onClick={() => {
                    setShowReputationDoublerModal(false);
                    offerReputationDoubler(
                      baseReputationEarned,
                      (result) => {
                        // Double the reputation
                        setPlayerProfile({
                          ...playerProfile,
                          reputation: playerProfile.reputation + baseReputationEarned
                        });
                        showNotification(`✅ Reputation doubled! +${baseReputationEarned} bonus!`, 'success');
                      },
                      () => {
                        // User declined
                        showNotification('Reputation doubler declined', 'info');
                      },
                      (error) => {
                        showNotification(`Ad failed: ${error.message}`, 'error');
                      }
                    );
                  }}
                >
                  WATCH AD - DOUBLE REWARD
                </button>
              </div>
            </>
          )}

          <button className="modal-btn secondary" onClick={() => setShowReputationDoublerModal(false)}>
            NO THANKS - CONTINUE
          </button>
        </div>
      </div>
    );
  };

  const renderMenu = () => {
    const currentRank = getRankInfo(playerProfile.rankLevel);
    const nextRank = playerProfile.rankLevel < 6 ? getRankInfo(playerProfile.rankLevel + 1) : null;
    const isChiefDetective = playerProfile.rankLevel >= 6;
    const legendaryChance = Math.random() < 0.1; // 10% chance

    // Get case availability
    const caseAvailability = canStartCase();
    const caseFiles = getCaseFiles();
    const hintTokens = getHintTokens();
    const isPremium = hasAdRemoval();

    return (
      <div className="menu-screen screen-enter">
        <div className="game-title">
          <h1>AI DETECTIVE</h1>
          <h2>CRIME SCENE</h2>
          <p className="tagline">Solve Crimes with AI-Powered Interrogation</p>
        </div>

        {/* Premium Badge */}
        {isPremium && (
          <div className="premium-badge-menu">
            🚫 Premium (Ad-Free)
          </div>
        )}

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

        {/* Case Counter */}
        <div className="case-counter">
          <h3>📁 DAILY CASES</h3>
          <div className="case-circles">
            Free: {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < caseAvailability.dailyRemaining ? '🔵' : '⚪'}</span>
            ))} {caseAvailability.dailyRemaining}/5
          </div>
          <div className="bonus-cases">
            Bonus: {Array.from({ length: 3 }).map((_, i) => (
              <span key={i}>{i < caseAvailability.bonusRemaining ? '📺' : '⚪'}</span>
            ))} {caseAvailability.bonusRemaining} via ads
          </div>
          {caseFiles > 0 && (
            <div className="owned-cases">
              Owned: 💼 {caseFiles} case files ready
            </div>
          )}
          <div className="reset-timer">
            Resets in: {timeUntilReset}
          </div>
        </div>

        {/* Inventory Display */}
        {(caseFiles > 0 || hintTokens > 0) && (
          <div className="inventory-display">
            {caseFiles > 0 && <span>💼 {caseFiles} Case Files</span>}
            {hintTokens > 0 && <span>💡 {hintTokens} Hint Tokens</span>}
          </div>
        )}

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

        <button className="menu-btn" onClick={() => startNewCase(false)} data-tooltip="Begin investigating a new case">
          {isChiefDetective ? '⭐ NEW ELITE CASE' : '🎯 START NEW CASE'}
        </button>

        {isChiefDetective && legendaryChance && (
          <button className="legendary-btn" onClick={() => startNewCase(true)} data-tooltip="Take on an extremely difficult legendary case">
            🌟 LEGENDARY CASE AVAILABLE 🌟
          </button>
        )}

        <button className="menu-btn-secondary" onClick={() => setGameState('profile')} data-tooltip="View your detective statistics and progression">
          👤 DETECTIVE PROFILE
        </button>

        <button className="store-button" onClick={() => setGameState('store')} data-tooltip="Visit the Detective Store">
          🛍️ STORE
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
    const hintTokens = getHintTokens();
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
              {hintTokens > 0 && <span>💡 {hintTokens} tokens</span>}
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
            data-tooltip={
              hintsRemaining > 0
                ? `Get free hint (${hintsRemaining} remaining)`
                : hintTokens > 0
                  ? `Use hint token (${hintTokens} available)`
                  : hintCost > 0
                    ? `Purchase hint for ${hintCost} reputation`
                    : `Get help with investigation`
            }
          >
            💡 Request Hint
            {hintsRemaining > 0 && <span className="hint-free"> (Free)</span>}
            {hintsRemaining === 0 && hintTokens > 0 && <span className="hint-token"> ({hintTokens} 💡)</span>}
            {hintsRemaining === 0 && hintTokens === 0 && hintCost > 0 && <span className="hint-cost"> ({hintCost})</span>}
          </button>
          {hasNotebook() && (
            <button
              className="action-btn notebook-btn"
              onClick={() => setShowNotebook(true)}
              data-tooltip="Open Detective's Notebook - Take notes during your investigation"
            >
              📓 DETECTIVE'S NOTEBOOK
            </button>
          )}
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
            <div className="profile-details">
              <p><strong>Age:</strong> {selectedSuspect.age}</p>
              <p><strong>Occupation:</strong> {selectedSuspect.occupation}</p>
              <p><strong>Personality:</strong> {selectedSuspect.personality}</p>
              <p><strong>Alibi:</strong> {selectedSuspect.alibi}</p>
              <p><strong>Nervousness Level:</strong> {selectedSuspect.nervousness}%</p>
              <div className="nervousness-bar">
                <div
                  className="nervousness-fill"
                  style={{ width: `${selectedSuspect.nervousness}%` }}
                />
              </div>
            </div>
          </div>

          <div className="interrogation-actions">
            <button className="action-btn" onClick={askQuestion}>
              ❓ Ask Question
            </button>
            <button className="action-btn" onClick={() => addLog(`📄 You show evidence to ${selectedSuspect.name}. They seem ${selectedSuspect.isGuilty ? 'uncomfortable' : 'confused'}.`)}>
              📄 Present Evidence
            </button>
            <button className="action-btn" onClick={() => {
              addLog(`⚠️ You apply pressure to ${selectedSuspect.name}. ${selectedSuspect.isGuilty ? 'They become more nervous!' : 'They maintain composure.'}`);
              if (selectedSuspect.isGuilty) {
                selectedSuspect.nervousness = Math.min(selectedSuspect.nervousness + 15, 100);
              }
            }}>
              ⚠️ Apply Pressure
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
          <p>The guilty party was: <strong>{currentCase.suspects[currentCase.guiltyIndex].name}</strong></p>
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

          <div className="profile-section profile-actions">
            <h3>⚙️ CUSTOMIZATION</h3>
            <button
              className="theme-selector-button"
              onClick={() => setShowThemeSelector(true)}
              data-tooltip="Customize your detective experience with themes"
            >
              🎨 CHANGE THEME
            </button>
          </div>

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
      {gameState === 'store' && (
        <StoreScreen
          onBack={() => setGameState('menu')}
          onPurchaseComplete={(result) => {
            // Refresh UI after purchase
            showNotification('Purchase complete! Thank you for your support!', 'success');
          }}
          showNotification={showNotification}
        />
      )}

      {/* Case Limit Modal */}
      {showCaseLimitModal && renderCaseLimitModal()}

      {/* Reputation Doubler Modal */}
      {renderReputationDoublerModal()}

      {/* Detective's Notebook Modal */}
      {showNotebook && currentCase && (
        <NotebookModal
          caseId={currentCase.caseNumber}
          onClose={() => setShowNotebook(false)}
          showNotification={showNotification}
        />
      )}

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelectorModal
          onClose={() => setShowThemeSelector(false)}
          showNotification={showNotification}
          onThemeChange={(themeId) => {
            console.log('Theme changed to:', themeId);
          }}
        />
      )}

      {/* Notification System */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default DetectiveGame;
