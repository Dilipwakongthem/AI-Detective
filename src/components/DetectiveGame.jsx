import React, { useState, useEffect } from 'react';
import {
  generateCase,
  interrogateSuspect,
  evaluateAccusation,
  getCurrentRank,
  calculateCaseDifficulty,
  getDifficultyStars,
  checkPromotion,
  RANKS
} from '../gameLogic';
import './DetectiveGame.css';

const DetectiveGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, briefing, investigation, interrogation, accusation, result, promotion
  const [currentCase, setCurrentCase] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [playerProfile, setPlayerProfile] = useState({
    reputation: 0,
    casesSolved: 0,
    casesAttempted: 0,
    totalStars: 0,
    currentStreak: 0,
    failedStreak: 0,
    perfectCases: 0
  });
  const [gameLog, setGameLog] = useState([]);
  const [showEvidence, setShowEvidence] = useState(false);
  const [accusationResult, setAccusationResult] = useState(null);
  const [promotionData, setPromotionData] = useState(null);

  const startNewCase = () => {
    // Calculate difficulty based on player's stats
    const difficulty = calculateCaseDifficulty(playerProfile);
    const newCase = generateCase(playerProfile.casesSolved + 1, difficulty);
    setCurrentCase(newCase);
    setGameState('briefing');
    setGameLog([]);
    setAccusationResult(null);
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
    const result = evaluateAccusation(suspectId, currentCase);
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
      updatedProfile.casesSolved = playerProfile.casesSolved + 1;
      updatedProfile.currentStreak = playerProfile.currentStreak + 1;
      updatedProfile.failedStreak = 0;
      if (result.stars === 5) {
        updatedProfile.perfectCases = playerProfile.perfectCases + 1;
      }
    } else {
      updatedProfile.currentStreak = 0;
      updatedProfile.failedStreak = playerProfile.failedStreak + 1;
    }

    setPlayerProfile(updatedProfile);

    // Check for promotion
    const promotion = checkPromotion(oldReputation, newReputation);
    if (promotion.promoted) {
      setPromotionData(promotion);
    }

    setGameState('result');
  };

  const addLog = (message) => {
    setGameLog(prev => [...prev, { text: message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const renderMenu = () => {
    const currentRank = getCurrentRank(playerProfile.reputation);
    const successRate = playerProfile.casesAttempted > 0
      ? Math.round((playerProfile.casesSolved / playerProfile.casesAttempted) * 100)
      : 0;

    return (
      <div className="menu-screen">
        <div className="game-title">
          <h1>🕵️ CASE FILES</h1>
          <h2>AI Detective</h2>
        </div>
        <div className="player-stats">
          <div className="stat">
            <span className="stat-label">Rank:</span>
            <span className="stat-value">{currentRank.name}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Reputation:</span>
            <span className="stat-value">{playerProfile.reputation}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Cases Solved:</span>
            <span className="stat-value">{playerProfile.casesSolved}/{playerProfile.casesAttempted}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Success Rate:</span>
            <span className="stat-value">{successRate}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Current Streak:</span>
            <span className="stat-value">{playerProfile.currentStreak > 0 ? `🔥 ${playerProfile.currentStreak}` : '0'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Stars:</span>
            <span className="stat-value">{'⭐'.repeat(Math.min(playerProfile.totalStars, 5))}</span>
          </div>
        </div>
        <div className="rank-info">
          <p>Available Difficulty: Level {currentRank.minDifficulty}-{currentRank.maxDifficulty}</p>
          {currentRank.maxRep !== Infinity && (
            <p>Next Rank: {currentRank.maxRep - playerProfile.reputation} reputation needed</p>
          )}
        </div>
        <button className="menu-btn" onClick={startNewCase}>
          🎯 START NEW CASE
        </button>
        {playerProfile.failedStreak >= 3 && (
          <div className="performance-warning">
            <p>⚠️ Having trouble? Consider reviewing easier cases to improve your skills.</p>
          </div>
        )}
        {playerProfile.currentStreak >= 5 && (
          <div className="performance-excellent">
            <p>🌟 Exceptional performance! You're on fire, Detective!</p>
          </div>
        )}
        <div className="menu-info">
          <p>Your mission: Investigate crime scenes, interrogate suspects, and solve the case!</p>
        </div>
      </div>
    );
  };

  const renderBriefing = () => (
    <div className="briefing-screen">
      <div className="case-header">
        <h2>🗂️ CASE #{currentCase.caseNumber}</h2>
        <div className="case-type">{currentCase.crimeType}</div>
        <div className="case-difficulty">
          Difficulty: {getDifficultyStars(currentCase.difficulty)} (Level {currentCase.difficulty})
        </div>
        {currentCase.specialType && (
          <div className="special-case-badge">
            🌟 {currentCase.specialType}
          </div>
        )}
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

  const renderInvestigation = () => (
    <div className="investigation-screen">
      <div className="investigation-header">
        <h2>🔍 INVESTIGATION - Case #{currentCase.caseNumber}</h2>
        <div className="case-progress">
          <span>Evidence: {currentCase.evidence.filter(e => e.discovered).length}/{currentCase.evidence.length}</span>
          <span>Interrogations: {currentCase.interrogationCount}</span>
        </div>
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

  const renderInterrogation = () => (
    <div className="interrogation-screen">
      <div className="interrogation-header">
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

          <div className="result-section">
            <h3>💭 EVALUATION</h3>
            <p>{accusationResult.feedback}</p>
          </div>

          <div className="result-section">
            <h3>🏆 REWARDS</h3>
            <p><strong>Reputation Gained:</strong> +{accusationResult.reputation}</p>
            <p><strong>New Reputation:</strong> {playerProfile.reputation}</p>
            {accusationResult.correct && <p><strong>Cases Solved:</strong> {playerProfile.casesSolved}</p>}
            {playerProfile.currentStreak > 0 && <p><strong>Current Streak:</strong> 🔥 {playerProfile.currentStreak}</p>}
          </div>

          <div className="result-section">
            <h3>🔍 THE TRUTH</h3>
            <p>The guilty party was: <strong>{currentCase.suspects[currentCase.guiltyIndex].name}</strong></p>
            <p>Motive: Professional rivalry and financial gain</p>
          </div>
        </div>

        <div className="result-actions">
          <button className="action-btn" onClick={handleNextAction}>
            {promotionData && promotionData.promoted ? '🎖️ View Promotion' : '🏠 Return to Menu'}
          </button>
          <button className="action-btn" onClick={startNewCase}>
            🎯 Next Case
          </button>
        </div>
      </div>
    );
  };

  const renderPromotion = () => (
    <div className="promotion-screen">
      <div className="promotion-header">
        <h1>🎖️ PROMOTION! 🎖️</h1>
        <h2>Congratulations!</h2>
      </div>

      <div className="promotion-content">
        <div className="promotion-section">
          <h3>You've been promoted to:</h3>
          <div className="new-rank">{promotionData.newRank}</div>
        </div>

        <div className="promotion-section">
          <h3>INCREASED CASE DIFFICULTY</h3>
          <p>Your expertise is needed on more complex investigations.</p>
        </div>

        <div className="promotion-section">
          <h3>You now have access to:</h3>
          <ul>
            <li>Level {promotionData.newMinDifficulty}-{promotionData.newMaxDifficulty} difficulty cases</li>
            <li>More complex crimes requiring advanced deduction</li>
            <li>More suspects with intricate relationships</li>
            <li>Subtle evidence requiring expert analysis</li>
          </ul>
        </div>

        <div className="promotion-section">
          <h3>Chief's Message:</h3>
          <p className="chiefs-quote">{promotionData.message}</p>
        </div>

        <div className="promotion-section">
          <p className="promotion-note">Your previous rank cases are still available for practice.</p>
        </div>
      </div>

      <div className="promotion-actions">
        <button className="action-btn" onClick={() => {
          setPromotionData(null);
          setGameState('menu');
        }}>
          VIEW NEW CASES
        </button>
      </div>
    </div>
  );

  return (
    <div className="detective-game">
      {gameState === 'menu' && renderMenu()}
      {gameState === 'briefing' && renderBriefing()}
      {gameState === 'investigation' && renderInvestigation()}
      {gameState === 'interrogation' && renderInterrogation()}
      {gameState === 'accusation' && renderAccusation()}
      {gameState === 'result' && renderResult()}
      {gameState === 'promotion' && promotionData && renderPromotion()}
    </div>
  );
};

export default DetectiveGame;
