import React, { useState } from 'react';
import { generateCase, interrogateSuspect, evaluateAccusation } from '../gameLogic';
import './DetectiveGame.css';

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

  const investigateLocation = (locationName) => {
    const undiscoveredEvidence = currentCase.evidence.filter(e => !e.discovered);
    if (undiscoveredEvidence.length > 0) {
      const found = undiscoveredEvidence[Math.floor(Math.random() * undiscoveredEvidence.length)];
      found.discovered = true;
      setCurrentCase({ ...currentCase, cluesFound: currentCase.cluesFound + 1 });
      addLog(`🔍 Found evidence: ${found.type} - ${found.description}`);
    } else {
      addLog('🔍 No new evidence found in this location.');
    }
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

    const oldReputation = playerProfile.reputation;
    const newReputation = playerProfile.reputation + result.reputation;

    // Update player stats
    const updatedProfile = {
      ...playerProfile,
      casesAttempted: playerProfile.casesAttempted + 1,
      reputation: newReputation,
      totalStars: playerProfile.totalStars + (result.correct ? result.stars : 0)
    };

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
    setGameLog(prev => [...prev, { text: message, timestamp: new Date().toLocaleTimeString() }]);
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
      <div className="menu-screen">
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

        <button className="menu-btn" onClick={() => startNewCase(false)}>
          {isChiefDetective ? '⭐ NEW ELITE CASE' : '🎯 START NEW CASE'}
        </button>

        {isChiefDetective && legendaryChance && (
          <button className="legendary-btn" onClick={() => startNewCase(true)}>
            🌟 LEGENDARY CASE AVAILABLE 🌟
          </button>
        )}

        <button className="menu-btn-secondary" onClick={() => setGameState('profile')}>
          👤 DETECTIVE PROFILE
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
    <div className="briefing-screen">
      <button className="home-btn" onClick={handleReturnToMenu} title="Return to Main Menu">
        🏠 HOME
      </button>
      <div className="case-header">
        <h2>🗂️ CASE #{currentCase.caseNumber}</h2>
        <div className="case-type">{currentCase.crimeType}</div>
        <div className="case-difficulty">
          Difficulty: {'⭐'.repeat(Math.min(currentCase.difficulty, 10))} (Level {currentCase.difficulty})
        </div>
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
        <div className="briefing-section">
          <h3>💡 HINTS AVAILABLE</h3>
          <p>{currentCase.hintsAvailable} free hints for this case</p>
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

    return (
      <div className="investigation-screen">
        <div className="investigation-header">
          <button className="home-btn" onClick={handleReturnToMenu} title="Save & Return to Main Menu">
            🏠 HOME
          </button>
          <div className="header-content">
            <h2>🔍 INVESTIGATION - Case #{currentCase.caseNumber}</h2>
            <div className="case-progress">
              <span>Evidence: {currentCase.evidence.filter(e => e.discovered).length}/{currentCase.evidence.length}</span>
              <span>Interrogations: {currentCase.interrogationCount}</span>
            </div>
          </div>
          <button
            className="hint-btn"
            onClick={requestHint}
            title={hintCost > 0 ? `Purchase hint for ${hintCost} reputation` : `Free hint (${hintsRemaining} remaining)`}
          >
            💡 HINT
            {hintCost > 0 && <span className="hint-cost"> ({hintCost})</span>}
            {hintsRemaining > 0 && <span className="hint-free"> (Free)</span>}
          </button>
        </div>

      <div className="investigation-main">
        <div className="suspects-panel">
          <h3>👥 SUSPECTS</h3>
          <div className="suspects-list">
            {currentCase.suspects.map(suspect => (
              <div key={suspect.id} className="suspect-card" onClick={() => selectSuspect(suspect)}>
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
          <button className="action-btn" onClick={() => investigateLocation('Crime Scene')}>
            🔍 Search Crime Scene
          </button>
          <button className="action-btn" onClick={() => investigateLocation('Office')}>
            🔍 Search Office
          </button>
          <button className="action-btn" onClick={() => investigateLocation('Storage')}>
            🔍 Search Storage Room
          </button>
          <button className="action-btn" onClick={() => setShowEvidence(!showEvidence)}>
            📋 {showEvidence ? 'Hide' : 'View'} Evidence Board
          </button>

          {/* Hint Button */}
          <div className="hint-section">
            <div className="hint-info">
              <span>💡 Hints: {Math.max(0, currentCase.hintsAvailable - currentCase.hintsUsed)} free</span>
              {currentCase.hintsUsed > 0 && (
                <span className="hint-used-warning">Used: {currentCase.hintsUsed} (Max: {currentCase.hintsUsed >= 3 ? '3★' : '4★'})</span>
              )}
            </div>
            {currentCase.hintsAvailable > currentCase.hintsUsed ? (
              <button className="action-btn hint-btn" onClick={requestHint}>
                💡 REQUEST HINT (FREE)
              </button>
            ) : (
              <button
                className={`action-btn hint-btn purchase ${playerProfile.reputation < (100 * (Math.max(0, currentCase.hintsUsed - currentCase.hintsAvailable) + 1)) ? 'disabled' : ''}`}
                onClick={requestHint}
                disabled={playerProfile.reputation < (100 * (Math.max(0, currentCase.hintsUsed - currentCase.hintsAvailable) + 1))}
              >
                💰 PURCHASE HINT ({100 * (Math.max(0, currentCase.hintsUsed - currentCase.hintsAvailable) + 1)} REP)
              </button>
            )}
          </div>

          <button className="action-btn accusation-btn" onClick={() => setGameState('accusation')}>
            ⚖️ MAKE ACCUSATION
          </button>
        </div>
      </div>

      {showEvidence && (
        <div className="evidence-board">
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

      <div className="game-log">
        <h3>📜 INVESTIGATION LOG</h3>
        <div className="log-entries">
          {gameLog.map((entry, i) => (
            <div key={i} className="log-entry">
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
    <div className="interrogation-screen">
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
    <div className="accusation-screen">
      <button className="home-btn" onClick={handleReturnToMenu} title="Save & Return to Main Menu">
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

  const renderResult = () => {
    const handleNextAction = () => {
      if (promotionData && promotionData.promoted) {
        setGameState('promotion');
      } else {
        setGameState('menu');
      }
    };

    return (
      <div className="result-screen">
        <div className={`result-header ${accusationResult.correct ? 'success' : 'failure'}`}>
          <h2>{accusationResult.message}</h2>
          {accusationResult.correct && (
            <div className="stars">
              {'⭐'.repeat(accusationResult.stars)}{'☆'.repeat(5 - accusationResult.stars)}
            </div>
          )}
        </div>

        <div className="result-content">
          <div className="result-section">
            <h3>📊 CASE SUMMARY</h3>
            <p><strong>Crime:</strong> {currentCase.crimeType}</p>
            <p><strong>Difficulty:</strong> Level {currentCase.difficulty} {getDifficultyStars(currentCase.difficulty)}</p>
            <p><strong>Location:</strong> {currentCase.location}</p>
            <p><strong>Evidence Collected:</strong> {currentCase.evidence.filter(e => e.discovered).length}/{currentCase.evidence.length}</p>
            <p><strong>Suspects Interrogated:</strong> {currentCase.suspects.filter(s => s.questioned).length}/{currentCase.suspects.length}</p>
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

        <div className="promotion-section">
          <h3>INCREASED CASE DIFFICULTY</h3>
          <p>Your expertise is needed on more complex investigations.</p>
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

        <div className="promotion-section">
          <h3>Chief's Message:</h3>
          <p className="chiefs-quote">{promotionData.message}</p>
        </div>

        <div className="promotion-section">
          <p className="promotion-note">Your previous rank cases are still available for practice.</p>
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
      <div className="profile-screen">
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
    </div>
  );
};

export default DetectiveGame;
