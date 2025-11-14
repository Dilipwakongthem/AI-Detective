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
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="glass-card rounded-3xl p-8 sm:p-10 lg:p-12 max-w-4xl w-full fade-in shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-primary-500 to-red-500 shadow-lg badge-float">
              <i className="fas fa-user-secret text-3xl text-white"></i>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black gradient-text neon-glow">
              AI DETECTIVE
            </h1>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-300 tracking-wide">
              CRIME SCENE
            </h2>
            <p className="text-gray-400 text-lg font-mono italic">
              Solve Crimes with AI-Powered Interrogation
            </p>
          </div>

          {/* Stats Grid */}
          <div className={`grid ${isChiefDetective ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2'} gap-4 mb-8`}>
            <div className="glass-card-dark rounded-xl p-5 border-l-4 border-primary-500 scale-in hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <i className="fas fa-shield-alt text-2xl text-primary-500"></i>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Rank</p>
                  <p className="text-xl font-bold text-white mt-1">{playerProfile.rank}</p>
                </div>
              </div>
            </div>

            <div className="glass-card-dark rounded-xl p-5 border-l-4 border-blue-500 scale-in hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center gap-3">
                <i className="fas fa-star text-2xl text-blue-400"></i>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Reputation</p>
                  <p className="text-xl font-bold text-white mt-1">{playerProfile.reputation.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="glass-card-dark rounded-xl p-5 border-l-4 border-green-500 scale-in hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-2xl text-green-400"></i>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Cases Solved</p>
                  <p className="text-xl font-bold text-white mt-1">{playerProfile.casesSolved}</p>
                </div>
              </div>
            </div>

            <div className="glass-card-dark rounded-xl p-5 border-l-4 border-yellow-500 scale-in hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-3">
                <i className="fas fa-trophy text-2xl text-yellow-400"></i>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Perfect Cases</p>
                  <p className="text-xl font-bold text-white mt-1">{playerProfile.perfectCases}</p>
                </div>
              </div>
            </div>

            {isChiefDetective && (
              <>
                <div className="glass-card-dark rounded-xl p-5 border-l-4 border-purple-500 scale-in hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.4s'}}>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-gem text-2xl text-purple-400"></i>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Elite Rating</p>
                      <p className="text-xl font-bold text-white mt-1">{playerProfile.eliteRating.toLocaleString()}/10k</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card-dark rounded-xl p-5 border-l-4 border-red-500 scale-in hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.5s'}}>
                  <div className="flex items-center gap-3">
                    <i className="fas fa-fire text-2xl text-red-400"></i>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Current Streak</p>
                      <p className="text-xl font-bold text-white mt-1">{playerProfile.currentStreak} 🔥</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Progress Section */}
          {!isChiefDetective && nextRank && (
            <div className="glass-card-dark rounded-xl p-6 mb-6 border border-primary-500/30 slide-in-left">
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-level-up-alt text-primary-500 text-xl"></i>
                <h3 className="font-display text-lg font-bold text-primary-500">Next Rank: {nextRank.name}</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Cases</span>
                    <span className="text-white font-semibold">{playerProfile.casesSolved}/{nextRank.casesRequired}</span>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 progress-bar transition-all duration-500"
                      style={{width: `${Math.min((playerProfile.casesSolved / nextRank.casesRequired) * 100, 100)}%`}}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Reputation</span>
                    <span className="text-white font-semibold">{playerProfile.reputation.toLocaleString()}/{nextRank.minRep.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 progress-bar transition-all duration-500"
                      style={{width: `${Math.min((playerProfile.reputation / nextRank.minRep) * 100, 100)}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chief Detective Badge */}
          {isChiefDetective && (
            <div className="bg-gradient-to-r from-primary-500 via-orange-500 to-red-500 rounded-2xl p-6 mb-6 text-center shadow-2xl badge-float">
              <div className="flex items-center justify-center gap-3 mb-2">
                <i className="fas fa-crown text-3xl text-white"></i>
                <h3 className="font-display text-2xl font-black text-white">CHIEF DETECTIVE</h3>
                <i className="fas fa-crown text-3xl text-white"></i>
              </div>
              <p className="text-white/90 font-semibold text-sm">Elite Case Mode Unlocked - Unlimited Access</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <button
              onClick={() => startNewCase(false)}
              className="w-full bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-display font-bold text-xl py-5 px-8 rounded-xl shadow-lg btn-hover-lift flex items-center justify-center gap-3 group"
            >
              <i className={`fas ${isChiefDetective ? 'fa-gem' : 'fa-play'} text-2xl group-hover:scale-110 transition-transform`}></i>
              {isChiefDetective ? 'NEW ELITE CASE' : 'START NEW CASE'}
              <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </button>

            {isChiefDetective && legendaryChance && (
              <button
                onClick={() => startNewCase(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-display font-bold text-xl py-5 px-8 rounded-xl shadow-lg btn-hover-lift flex items-center justify-center gap-3 legendary-glow group"
              >
                <i className="fas fa-sparkles text-2xl group-hover:rotate-12 transition-transform"></i>
                LEGENDARY CASE AVAILABLE
                <i className="fas fa-sparkles text-2xl group-hover:-rotate-12 transition-transform"></i>
              </button>
            )}

            <button
              onClick={() => setGameState('profile')}
              className="w-full bg-white/10 hover:bg-white/15 border-2 border-white/20 hover:border-primary-500/50 text-white font-display font-semibold text-lg py-4 px-8 rounded-xl btn-hover-lift flex items-center justify-center gap-3 group transition-all"
            >
              <i className="fas fa-user-circle text-xl group-hover:scale-110 transition-transform"></i>
              DETECTIVE PROFILE
            </button>
          </div>

          {/* Footer Info */}
          <div className="text-center space-y-2 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm font-mono">
              <i className="fas fa-crosshairs mr-2"></i>
              Your mission: Investigate crime scenes, interrogate suspects, and solve the case!
            </p>
            <p className="text-gray-600 text-xs font-mono mt-4">
              Version 1.0 | © 2025
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderBriefing = () => (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="glass-card rounded-3xl p-8 sm:p-10 lg:p-12 max-w-5xl w-full fade-in shadow-2xl relative">
        {/* Home Button */}
        <button
          className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary-500/50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 btn-hover-lift"
          onClick={handleReturnToMenu}
          title="Return to Main Menu"
        >
          <i className="fas fa-home"></i>
          HOME
        </button>

        {/* Case Header */}
        <div className="text-center mb-10 mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary-500 to-red-500 shadow-lg badge-float">
            <i className="fas fa-folder-open text-2xl text-white"></i>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black gradient-text neon-glow mb-3">
            CASE #{currentCase.caseNumber}
          </h2>
          <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg px-6 py-2 rounded-full shadow-lg">
            {currentCase.crimeType}
          </div>
          {currentCase.difficulty && (
            <div className="mt-3 text-yellow-400 text-sm font-semibold">
              Difficulty: {'⭐'.repeat(Math.min(currentCase.difficulty, 10))}
            </div>
          )}
          {currentCase.isLegendary && (
            <div className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm px-4 py-1 rounded-full inline-block legendary-glow">
              <i className="fas fa-sparkles mr-1"></i>
              LEGENDARY CASE
              <i className="fas fa-sparkles ml-1"></i>
            </div>
          )}
        </div>

        {/* Briefing Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Location */}
          <div className="glass-card-dark rounded-xl p-6 border-l-4 border-blue-500 slide-in-left hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
              <i className="fas fa-map-marker-alt text-2xl text-blue-400"></i>
              <h3 className="font-display text-xl font-bold text-blue-400">LOCATION</h3>
            </div>
            <p className="text-white text-lg font-semibold">{currentCase.location}</p>
          </div>

          {/* Victim */}
          <div className="glass-card-dark rounded-xl p-6 border-l-4 border-red-500 slide-in-right hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
              <i className="fas fa-user-injured text-2xl text-red-400"></i>
              <h3 className="font-display text-xl font-bold text-red-400">VICTIM</h3>
            </div>
            <p className="text-white text-lg font-semibold">{currentCase.victim.name}</p>
            <p className="text-gray-400 text-sm mt-1">{currentCase.victim.occupation}</p>
          </div>

          {/* Situation */}
          <div className="glass-card-dark rounded-xl p-6 border-l-4 border-yellow-500 scale-in hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center gap-3 mb-3">
              <i className="fas fa-exclamation-triangle text-2xl text-yellow-400"></i>
              <h3 className="font-display text-xl font-bold text-yellow-400">SITUATION</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              A <span className="text-red-400 font-semibold">{currentCase.crimeType.toLowerCase()}</span> has occurred at <span className="text-blue-400 font-semibold">{currentCase.location}</span>.
              <span className="text-primary-400 font-semibold"> {currentCase.suspects.length} suspects</span> are being held for questioning.
              Your task is to identify the perpetrator.
            </p>
          </div>

          {/* Objective */}
          <div className="glass-card-dark rounded-xl p-6 border-l-4 border-green-500 scale-in hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center gap-3 mb-3">
              <i className="fas fa-bullseye text-2xl text-green-400"></i>
              <h3 className="font-display text-xl font-bold text-green-400">OBJECTIVE</h3>
            </div>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <i className="fas fa-check text-green-500 text-sm"></i>
                <span>Gather evidence from the crime scene</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check text-green-500 text-sm"></i>
                <span>Interrogate all suspects</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-check text-green-500 text-sm"></i>
                <span>Make your accusation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Begin Investigation Button */}
        <button
          onClick={startInvestigation}
          className="w-full bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-display font-bold text-2xl py-6 px-8 rounded-xl shadow-2xl btn-hover-lift flex items-center justify-center gap-4 group"
        >
          <i className="fas fa-search text-3xl group-hover:scale-110 transition-transform"></i>
          BEGIN INVESTIGATION
          <i className="fas fa-arrow-right text-2xl group-hover:translate-x-2 transition-transform"></i>
        </button>
      </div>
    </div>
  );

  const renderInvestigation = () => {
    const freeHints = getFreeHints(currentCase?.difficulty || 1);
    const hintCost = getHintCost();
    const hintsRemaining = Math.max(0, freeHints - hintsUsed);

    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Investigation Header */}
          <div className="glass-card rounded-2xl p-6 mb-6 shadow-xl fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary-500/50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 btn-hover-lift"
                onClick={handleReturnToMenu}
                title="Save & Return to Main Menu"
              >
                <i className="fas fa-home"></i>
                HOME
              </button>

              <div className="flex-1 text-center">
                <h2 className="font-display text-2xl sm:text-3xl font-black gradient-text neon-glow">
                  INVESTIGATION - CASE #{currentCase.caseNumber}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
                  <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-4 py-1 rounded-full">
                    <i className="fas fa-fingerprint text-blue-400"></i>
                    <span className="text-white font-semibold">Evidence: {currentCase.evidence.filter(e => e.discovered).length}/{currentCase.evidence.length}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-4 py-1 rounded-full">
                    <i className="fas fa-user-friends text-purple-400"></i>
                    <span className="text-white font-semibold">Interrogations: {currentCase.interrogationCount}</span>
                  </div>
                </div>
              </div>

              <button
                className={`${hintsRemaining > 0 ? 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30' : 'bg-primary-500/20 border-primary-500/50 hover:bg-primary-500/30'} border-2 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 flex items-center gap-2 btn-hover-lift`}
                onClick={requestHint}
                title={hintCost > 0 ? `Purchase hint for ${hintCost} reputation` : `Free hint (${hintsRemaining} remaining)`}
              >
                <i className="fas fa-lightbulb text-yellow-300"></i>
                HINT
                {hintCost > 0 && <span className="text-yellow-300">({hintCost})</span>}
                {hintsRemaining > 0 && <span className="text-green-300">(Free)</span>}
              </button>
            </div>
          </div>

          {/* Main Investigation Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Suspects Panel */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 shadow-xl slide-in-left">
                <div className="flex items-center gap-3 mb-4">
                  <i className="fas fa-users text-2xl text-primary-500"></i>
                  <h3 className="font-display text-xl font-bold text-white">SUSPECTS</h3>
                </div>
                <div className="space-y-3">
                  {currentCase.suspects.map((suspect, index) => (
                    <div
                      key={suspect.id}
                      className="glass-card-dark rounded-xl p-4 cursor-pointer card-hover border-l-4 border-red-500 transition-all duration-300"
                      onClick={() => selectSuspect(suspect)}
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-white text-lg">{suspect.name}</div>
                        {suspect.questioned && <i className="fas fa-check-circle text-green-400"></i>}
                      </div>
                      <div className="text-gray-400 text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-user text-blue-400 text-xs"></i>
                          <span>{suspect.age} • {suspect.occupation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-brain text-purple-400 text-xs"></i>
                          <span>{suspect.personality}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-chart-line text-yellow-400 text-xs"></i>
                          <span className="text-yellow-300">
                            {'⭐'.repeat(suspect.suspicionLevel)}{'☆'.repeat(5 - suspect.suspicionLevel)}
                          </span>
                        </div>
                        {suspect.questioned && (
                          <div className="flex items-center gap-2 mt-2">
                            <i className="fas fa-heartbeat text-red-400 text-xs"></i>
                            <span className="text-red-300 font-semibold">{suspect.nervousness}% Nervous</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions & Evidence Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Actions Panel */}
              <div className="glass-card rounded-2xl p-6 shadow-xl slide-in-right">
                <div className="flex items-center gap-3 mb-4">
                  <i className="fas fa-tasks text-2xl text-green-500"></i>
                  <h3 className="font-display text-xl font-bold text-white">ACTIONS</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg btn-hover-lift flex items-center justify-center gap-2 transition-all duration-300"
                    onClick={() => investigateLocation('Crime Scene')}
                  >
                    <i className="fas fa-search"></i>
                    Search Crime Scene
                  </button>
                  <button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg btn-hover-lift flex items-center justify-center gap-2 transition-all duration-300"
                    onClick={() => investigateLocation('Office')}
                  >
                    <i className="fas fa-briefcase"></i>
                    Search Office
                  </button>
                  <button
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg btn-hover-lift flex items-center justify-center gap-2 transition-all duration-300"
                    onClick={() => investigateLocation('Storage')}
                  >
                    <i className="fas fa-box"></i>
                    Search Storage
                  </button>
                  <button
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg btn-hover-lift flex items-center justify-center gap-2 transition-all duration-300"
                    onClick={() => setShowEvidence(!showEvidence)}
                  >
                    <i className={`fas ${showEvidence ? 'fa-eye-slash' : 'fa-clipboard-list'}`}></i>
                    {showEvidence ? 'Hide' : 'View'} Evidence
                  </button>
                </div>
                <button
                  className="w-full mt-4 bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-display font-bold text-lg py-4 px-6 rounded-xl shadow-2xl btn-hover-lift flex items-center justify-center gap-3 group"
                  onClick={() => setGameState('accusation')}
                >
                  <i className="fas fa-gavel text-xl group-hover:rotate-12 transition-transform"></i>
                  MAKE ACCUSATION
                  <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                </button>
              </div>

              {/* Evidence Board */}
              {showEvidence && (
                <div className="glass-card rounded-2xl p-6 shadow-xl scale-in">
                  <div className="flex items-center gap-3 mb-4">
                    <i className="fas fa-clipboard-list text-2xl text-blue-500"></i>
                    <h3 className="font-display text-xl font-bold text-white">EVIDENCE BOARD</h3>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {currentCase.evidence.filter(e => e.discovered).map((evidence, index) => (
                      <div
                        key={evidence.id}
                        className="glass-card-dark rounded-xl p-4 border-l-4 border-blue-500 hover:scale-105 transition-transform duration-300"
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <i className="fas fa-tag text-blue-400"></i>
                            <span className="text-blue-300 font-bold">{evidence.type}</span>
                          </div>
                          {evidence.critical && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                              <i className="fas fa-exclamation-triangle"></i>
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{evidence.description}</p>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>Found at: {evidence.location}</span>
                        </div>
                      </div>
                    ))}
                    {currentCase.evidence.filter(e => e.discovered).length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        <i className="fas fa-search text-4xl mb-3 opacity-50"></i>
                        <p className="font-semibold">No evidence collected yet. Start investigating!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Investigation Log */}
          <div className="glass-card rounded-2xl p-6 shadow-xl fade-in">
            <div className="flex items-center gap-3 mb-4">
              <i className="fas fa-scroll text-2xl text-yellow-500"></i>
              <h3 className="font-display text-xl font-bold text-white">INVESTIGATION LOG</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {gameLog.map((entry, i) => (
                <div
                  key={i}
                  className="glass-card-dark rounded-lg p-3 flex items-start gap-3 hover:bg-white/5 transition-colors"
                >
                  <span className="text-gray-500 text-xs font-mono whitespace-nowrap">[{entry.timestamp}]</span>
                  <span className="text-gray-300 text-sm flex-1">{entry.text}</span>
                </div>
              ))}
              {gameLog.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">Investigation log is empty. Start investigating to see updates here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInterrogation = () => (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="glass-card rounded-3xl p-8 sm:p-10 lg:p-12 max-w-6xl w-full fade-in shadow-2xl relative">
        {/* Header Buttons */}
        <div className="flex items-center justify-between mb-8">
          <button
            className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary-500/50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 btn-hover-lift"
            onClick={handleReturnToMenu}
            title="Save & Return to Main Menu"
          >
            <i className="fas fa-home"></i>
            HOME
          </button>

          <h2 className="font-display text-3xl sm:text-4xl font-black gradient-text neon-glow text-center">
            <i className="fas fa-comments mr-3"></i>
            INTERROGATION
          </h2>

          <button
            className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-blue-500/50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 btn-hover-lift"
            onClick={() => setGameState('investigation')}
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
        </div>

        {selectedSuspect && (
          <div className="space-y-6">
            {/* Suspect Profile Card */}
            <div className="glass-card-dark rounded-2xl p-6 slide-in-left">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <i className="fas fa-user text-2xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">{selectedSuspect.name}</h3>
                  <p className="text-gray-400">{selectedSuspect.occupation}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="glass-card rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-id-card text-blue-400 text-sm"></i>
                    <span className="text-gray-400 text-sm">Age</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{selectedSuspect.age} years old</p>
                </div>

                <div className="glass-card rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-brain text-purple-400 text-sm"></i>
                    <span className="text-gray-400 text-sm">Personality</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{selectedSuspect.personality}</p>
                </div>

                <div className="glass-card rounded-lg p-4 border-l-4 border-green-500 sm:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-clock text-green-400 text-sm"></i>
                    <span className="text-gray-400 text-sm">Alibi</span>
                  </div>
                  <p className="text-white font-semibold">{selectedSuspect.alibi}</p>
                </div>
              </div>

              {/* Nervousness Bar */}
              <div className="glass-card rounded-xl p-5 border-2 border-red-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-heartbeat text-red-400 text-xl"></i>
                    <span className="text-white font-bold text-lg">Nervousness Level</span>
                  </div>
                  <span className="text-red-300 font-bold text-2xl">{selectedSuspect.nervousness}%</span>
                </div>
                <div className="w-full h-6 bg-black/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 nervousness-fill transition-all duration-800"
                    style={{ width: `${selectedSuspect.nervousness}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Calm</span>
                  <span>Nervous</span>
                  <span>Panic</span>
                </div>
              </div>
            </div>

            {/* Interrogation Actions */}
            <div className="glass-card-dark rounded-2xl p-6 slide-in-right">
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-tasks text-2xl text-primary-500"></i>
                <h3 className="font-display text-xl font-bold text-white">INTERROGATION TACTICS</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg btn-hover-lift flex flex-col items-center justify-center gap-2 transition-all duration-300"
                  onClick={askQuestion}
                >
                  <i className="fas fa-question-circle text-3xl"></i>
                  <span>Ask Question</span>
                </button>
                <button
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg btn-hover-lift flex flex-col items-center justify-center gap-2 transition-all duration-300"
                  onClick={() => addLog(`📄 You show evidence to ${selectedSuspect.name}. They seem ${selectedSuspect.isGuilty ? 'uncomfortable' : 'confused'}.`)}
                >
                  <i className="fas fa-file-alt text-3xl"></i>
                  <span>Present Evidence</span>
                </button>
                <button
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg btn-hover-lift flex flex-col items-center justify-center gap-2 transition-all duration-300"
                  onClick={() => {
                    addLog(`⚠️ You apply pressure to ${selectedSuspect.name}. ${selectedSuspect.isGuilty ? 'They become more nervous!' : 'They maintain composure.'}`);
                    if (selectedSuspect.isGuilty) {
                      selectedSuspect.nervousness = Math.min(selectedSuspect.nervousness + 15, 100);
                    }
                  }}
                >
                  <i className="fas fa-exclamation-triangle text-3xl"></i>
                  <span>Apply Pressure</span>
                </button>
              </div>
            </div>

            {/* Interrogation Log */}
            <div className="glass-card-dark rounded-2xl p-6 scale-in">
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-scroll text-2xl text-yellow-500"></i>
                <h3 className="font-display text-xl font-bold text-white">CONVERSATION LOG</h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {gameLog.slice(-6).map((entry, i) => (
                  <div
                    key={i}
                    className="glass-card rounded-lg p-4 hover:bg-white/5 transition-colors border-l-4 border-primary-500/50"
                  >
                    <p className="text-gray-300">{entry.text}</p>
                    <span className="text-gray-600 text-xs mt-2 block">{entry.timestamp}</span>
                  </div>
                ))}
                {gameLog.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <i className="fas fa-comments text-4xl mb-3 opacity-50"></i>
                    <p className="font-semibold">Start interrogating to see the conversation here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAccusation = () => (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-2xl p-6 mb-6 shadow-xl fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary-500/50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 btn-hover-lift"
              onClick={handleReturnToMenu}
              title="Save & Return to Main Menu"
            >
              <i className="fas fa-home"></i>
              HOME
            </button>

            <div className="text-center flex-1">
              <h2 className="font-display text-3xl sm:text-4xl font-black gradient-text neon-glow mb-2">
                <i className="fas fa-gavel mr-3"></i>
                MAKE YOUR ACCUSATION
              </h2>
              <p className="text-gray-400 text-lg">Choose the suspect you believe is guilty</p>
            </div>

            <button
              className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-blue-500/50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 btn-hover-lift"
              onClick={() => setGameState('investigation')}
            >
              <i className="fas fa-arrow-left"></i>
              Continue Investigating
            </button>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="glass-card-dark rounded-xl p-5 mb-6 border-l-4 border-yellow-500 slide-in-left">
          <div className="flex items-center gap-3">
            <i className="fas fa-exclamation-triangle text-2xl text-yellow-400"></i>
            <div>
              <p className="text-white font-bold">Warning: Choose Carefully!</p>
              <p className="text-gray-400 text-sm">Your reputation and case streak depend on making the right accusation.</p>
            </div>
          </div>
        </div>

        {/* Suspects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCase.suspects.map((suspect, index) => (
            <div
              key={suspect.id}
              className="glass-card rounded-2xl p-6 shadow-xl cursor-pointer card-hover border-2 border-white/10 hover:border-primary-500/50 transition-all duration-300 scale-in group"
              onClick={() => makeAccusation(suspect.id)}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Suspect Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <i className="fas fa-user text-xl text-white"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                    {suspect.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{suspect.occupation}</p>
                </div>
                {suspect.questioned && (
                  <i className="fas fa-check-circle text-green-400 text-xl" title="Questioned"></i>
                )}
              </div>

              {/* Suspect Details */}
              <div className="space-y-3 mb-5">
                <div className="glass-card-dark rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-chart-line text-yellow-400"></i>
                      <span className="text-gray-400 text-sm">Suspicion Level</span>
                    </div>
                  </div>
                  <div className="text-yellow-300 text-lg">
                    {'⭐'.repeat(suspect.suspicionLevel)}{'☆'.repeat(5 - suspect.suspicionLevel)}
                  </div>
                </div>

                {suspect.questioned && (
                  <div className="glass-card-dark rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-heartbeat text-red-400"></i>
                        <span className="text-gray-400 text-sm">Nervousness</span>
                      </div>
                      <span className="text-red-300 font-bold">{suspect.nervousness}%</span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-500"
                        style={{ width: `${suspect.nervousness}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="glass-card-dark rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="fas fa-info-circle text-blue-400 text-sm"></i>
                    <span className="text-gray-400 text-xs">Details</span>
                  </div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-user text-xs text-gray-500"></i>
                      <span>{suspect.age} years old</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-brain text-xs text-gray-500"></i>
                      <span>{suspect.personality}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accuse Button */}
              <button
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-display font-bold text-lg py-3 px-4 rounded-xl shadow-lg btn-hover-lift flex items-center justify-center gap-2 group-hover:scale-105 transition-transform"
                onClick={() => makeAccusation(suspect.id)}
              >
                <i className="fas fa-gavel"></i>
                ACCUSE
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          ))}
        </div>

        {/* Back Button (mobile friendly) */}
        <div className="mt-8 text-center">
          <button
            className="bg-white/10 hover:bg-white/15 border-2 border-white/20 hover:border-blue-500/50 text-white font-display font-semibold text-lg py-3 px-8 rounded-xl btn-hover-lift inline-flex items-center gap-3 transition-all"
            onClick={() => setGameState('investigation')}
          >
            <i className="fas fa-arrow-left"></i>
            Need More Evidence? Continue Investigation
          </button>
        </div>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="glass-card rounded-3xl p-8 sm:p-10 lg:p-12 max-w-5xl w-full fade-in shadow-2xl">
        {/* Result Header */}
        <div className={`text-center mb-10 ${accusationResult.correct ? 'scale-in' : 'fade-in'}`}>
          <div className={`inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full ${accusationResult.correct ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-red-500 to-orange-500'} shadow-lg badge-float`}>
            <i className={`fas ${accusationResult.correct ? 'fa-check' : 'fa-times'} text-4xl text-white`}></i>
          </div>

          <h2 className={`font-display text-4xl sm:text-5xl font-black mb-4 ${accusationResult.correct ? 'text-green-400' : 'text-red-400'}`}>
            {accusationResult.message}
          </h2>

          {accusationResult.correct && (
            <div className="text-5xl mb-4 star-appear">
              {Array.from({length: accusationResult.stars}).map((_, i) => (
                <span key={i} className="inline-block star-appear" style={{animationDelay: `${i * 0.15}s`}}>⭐</span>
              ))}
              {Array.from({length: 5 - accusationResult.stars}).map((_, i) => (
                <span key={i} className="inline-block opacity-30">☆</span>
              ))}
            </div>
          )}

          {currentCase.isLegendary && accusationResult.correct && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl px-6 py-3 rounded-full inline-block legendary-glow mt-4">
              <i className="fas fa-sparkles mr-2"></i>
              LEGENDARY CASE COMPLETED!
              <i className="fas fa-sparkles ml-2"></i>
            </div>
          )}
        </div>

        {/* Rank Up Notification */}
        {showRankUp && (
          <div className="glass-card-dark rounded-2xl p-8 mb-8 text-center border-4 border-primary-500 rank-up-appear">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary-500 to-red-500 shadow-lg">
              <i className="fas fa-trophy text-3xl text-white"></i>
            </div>
            <h3 className="font-display text-3xl font-black gradient-text neon-glow mb-3">
              PROMOTION!
            </h3>
            <p className="text-white text-xl mb-2">
              You've been promoted to <span className="font-bold text-primary-400">{showRankUp.name}</span>!
            </p>
            <p className="text-gray-400 mb-4">Continue solving cases to reach even higher ranks.</p>
            {showRankUp.level === 6 && (
              <div className="bg-gradient-to-r from-primary-500 via-orange-500 to-red-500 rounded-xl p-5 mt-4">
                <p className="text-white font-bold text-lg mb-2">
                  <i className="fas fa-crown mr-2"></i>
                  CHIEF DETECTIVE UNLOCKED
                  <i className="fas fa-crown ml-2"></i>
                </p>
                <p className="text-white/90 text-sm">You now have access to unlimited Elite Cases and Legendary Cases!</p>
              </div>
            )}
          </div>
        )}

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Case Summary */}
          <div className="glass-card-dark rounded-xl p-6 border-l-4 border-blue-500 slide-in-left">
            <div className="flex items-center gap-3 mb-4">
              <i className="fas fa-chart-bar text-2xl text-blue-400"></i>
              <h3 className="font-display text-xl font-bold text-white">CASE SUMMARY</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Crime:</span>
                <span className="text-white font-semibold">{currentCase.crimeType}</span>
              </div>
              {currentCase.difficulty && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className="text-yellow-400">{'⭐'.repeat(Math.min(currentCase.difficulty, 10))}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Location:</span>
                <span className="text-white font-semibold">{currentCase.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Evidence:</span>
                <span className="text-white font-semibold">{currentCase.evidence.filter(e => e.discovered).length}/{currentCase.evidence.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Interrogations:</span>
                <span className="text-white font-semibold">{currentCase.suspects.filter(s => s.questioned).length}/{currentCase.suspects.length}</span>
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="glass-card-dark rounded-xl p-6 border-l-4 border-green-500 slide-in-right">
            <div className="flex items-center gap-3 mb-4">
              <i className="fas fa-trophy text-2xl text-green-400"></i>
              <h3 className="font-display text-xl font-bold text-white">REWARDS</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Reputation:</span>
                <span className={`font-bold text-lg ${accusationResult.reputation > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {accusationResult.reputation > 0 ? '+' : ''}{accusationResult.reputation}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">New Reputation:</span>
                <span className="text-white font-semibold text-lg">{playerProfile.reputation.toLocaleString()}</span>
              </div>
              {accusationResult.correct && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cases Solved:</span>
                    <span className="text-white font-semibold">{playerProfile.casesSolved}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Streak:</span>
                    <span className="text-orange-400 font-semibold">{playerProfile.currentStreak} 🔥</span>
                  </div>
                  {playerProfile.rankLevel >= 6 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Elite Points:</span>
                      <span className="text-purple-400 font-semibold">+{calculateElitePoints(accusationResult, currentCase)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Evaluation */}
          <div className="glass-card-dark rounded-xl p-6 border-l-4 border-purple-500 scale-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center gap-3 mb-4">
              <i className="fas fa-comment-dots text-2xl text-purple-400"></i>
              <h3 className="font-display text-xl font-bold text-white">EVALUATION</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{accusationResult.feedback}</p>
          </div>

          {/* The Truth */}
          <div className="glass-card-dark rounded-xl p-6 border-l-4 border-yellow-500 scale-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center gap-3 mb-4">
              <i className="fas fa-search text-2xl text-yellow-400"></i>
              <h3 className="font-display text-xl font-bold text-white">THE TRUTH</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">The guilty party was:</p>
              <p className="text-white font-bold text-xl">{currentCase.suspects[currentCase.guiltyIndex].name}</p>
              <p className="text-gray-400 text-sm mt-3">Motive: Professional rivalry and financial gain</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => { setGameState('menu'); setShowRankUp(false); }}
            className="bg-white/10 hover:bg-white/15 border-2 border-white/20 hover:border-primary-500/50 text-white font-display font-semibold text-lg py-4 px-8 rounded-xl btn-hover-lift flex items-center justify-center gap-3 transition-all"
          >
            <i className="fas fa-home text-xl"></i>
            Return to Menu
          </button>
          <button
            onClick={() => { startNewCase(); setShowRankUp(false); }}
            className="bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-display font-bold text-lg py-4 px-8 rounded-xl shadow-lg btn-hover-lift flex items-center justify-center gap-3 group"
          >
            <i className="fas fa-play text-xl group-hover:scale-110 transition-transform"></i>
            Next Case
            <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    const currentRank = getRankInfo(playerProfile.rankLevel);
    const isChiefDetective = playerProfile.rankLevel >= 6;

    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="glass-card rounded-2xl p-6 mb-6 shadow-xl fade-in">
            <div className="flex items-center justify-between">
              <button
                className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary-500/50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 btn-hover-lift"
                onClick={() => setGameState('menu')}
                title="Return to Main Menu"
              >
                <i className="fas fa-arrow-left"></i>
                BACK
              </button>

              <div className="text-center flex-1">
                <h2 className="font-display text-3xl sm:text-4xl font-black gradient-text neon-glow">
                  <i className="fas fa-id-badge mr-3"></i>
                  DETECTIVE PROFILE
                </h2>
              </div>

              <div className="w-20"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Rank Badge Display */}
          <div className="glass-card rounded-2xl p-8 mb-6 shadow-xl text-center slide-in-left">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-primary-500 to-red-500 shadow-lg badge-float">
              <i className="fas fa-shield-alt text-3xl text-white"></i>
            </div>
            <h3 className="font-display text-3xl font-black text-white mb-2">{playerProfile.rank}</h3>
            {isChiefDetective && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-red-500 text-white font-bold px-4 py-2 rounded-full">
                <i className="fas fa-crown"></i>
                <span>CHIEF DETECTIVE</span>
                <i className="fas fa-crown"></i>
              </div>
            )}
          </div>

          {/* Career Statistics */}
          <div className="glass-card rounded-2xl p-6 mb-6 shadow-xl slide-in-right">
            <div className="flex items-center gap-3 mb-6">
              <i className="fas fa-chart-line text-2xl text-blue-500"></i>
              <h3 className="font-display text-2xl font-bold text-white">CAREER STATISTICS</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass-card-dark rounded-xl p-5 border-l-4 border-green-500 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-check-circle text-green-400 text-xl"></i>
                  <span className="text-gray-400 text-sm">Total Cases Solved</span>
                </div>
                <p className="text-white font-bold text-3xl">{playerProfile.casesSolved}</p>
              </div>

              <div className="glass-card-dark rounded-xl p-5 border-l-4 border-yellow-500 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-star text-yellow-400 text-xl"></i>
                  <span className="text-gray-400 text-sm">Perfect Cases</span>
                </div>
                <p className="text-white font-bold text-3xl">{playerProfile.perfectCases}</p>
              </div>

              <div className="glass-card-dark rounded-xl p-5 border-l-4 border-blue-500 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-percentage text-blue-400 text-xl"></i>
                  <span className="text-gray-400 text-sm">Success Rate</span>
                </div>
                <p className="text-white font-bold text-3xl">
                  {playerProfile.casesSolved > 0
                    ? Math.round((playerProfile.casesSolved / (playerProfile.casesSolved + playerProfile.wrongAccusations)) * 100)
                    : 100}%
                </p>
              </div>

              <div className="glass-card-dark rounded-xl p-5 border-l-4 border-purple-500 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-trophy text-purple-400 text-xl"></i>
                  <span className="text-gray-400 text-sm">Total Reputation</span>
                </div>
                <p className="text-white font-bold text-3xl">{playerProfile.reputation.toLocaleString()}</p>
              </div>

              <div className="glass-card-dark rounded-xl p-5 border-l-4 border-orange-500 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-fire text-orange-400 text-xl"></i>
                  <span className="text-gray-400 text-sm">Current Streak</span>
                </div>
                <p className="text-white font-bold text-3xl">{playerProfile.currentStreak} 🔥</p>
              </div>

              <div className="glass-card-dark rounded-xl p-5 border-l-4 border-red-500 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-bolt text-red-400 text-xl"></i>
                  <span className="text-gray-400 text-sm">Longest Streak</span>
                </div>
                <p className="text-white font-bold text-3xl">{playerProfile.longestStreak} 🔥</p>
              </div>
            </div>
          </div>

          {/* Elite Performance (Chief Detective Only) */}
          {isChiefDetective && (
            <div className="glass-card rounded-2xl p-6 mb-6 shadow-xl scale-in border-2 border-purple-500/50">
              <div className="flex items-center gap-3 mb-6">
                <i className="fas fa-gem text-2xl text-purple-500"></i>
                <h3 className="font-display text-2xl font-bold text-white">ELITE PERFORMANCE</h3>
              </div>
              <div className="space-y-4">
                <div className="glass-card-dark rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold text-lg">Elite Rating</span>
                    <span className="text-purple-300 font-bold text-xl">{playerProfile.eliteRating.toLocaleString()}/10,000</span>
                  </div>
                  <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 progress-bar transition-all duration-500"
                      style={{width: `${(playerProfile.eliteRating / 10000) * 100}%`}}
                    ></div>
                  </div>
                </div>
                <div className="glass-card-dark rounded-xl p-5 border-l-4 border-pink-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-sparkles text-pink-400 text-xl"></i>
                      <span className="text-gray-400">Legendary Cases Completed</span>
                    </div>
                    <span className="text-white font-bold text-2xl">{playerProfile.legendaryCasesCompleted} 🌟</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rank Progression */}
          <div className="glass-card rounded-2xl p-6 mb-6 shadow-xl fade-in">
            <div className="flex items-center gap-3 mb-6">
              <i className="fas fa-medal text-2xl text-primary-500"></i>
              <h3 className="font-display text-2xl font-bold text-white">RANK PROGRESSION</h3>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((level, index) => {
                const rank = getRankInfo(level);
                const achieved = playerProfile.rankLevel >= level;
                return (
                  <div
                    key={level}
                    className={`glass-card-dark rounded-xl p-4 border-l-4 ${achieved ? 'border-green-500' : 'border-gray-600'} flex items-center justify-between hover:scale-105 transition-transform scale-in`}
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${achieved ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gray-700'} flex items-center justify-center font-bold text-white text-lg shadow-lg`}>
                        {level}
                      </div>
                      <div>
                        <p className={`font-bold text-lg ${achieved ? 'text-white' : 'text-gray-500'}`}>{rank.name}</p>
                        <p className="text-gray-500 text-sm">
                          {rank.casesRequired} cases • {rank.minRep.toLocaleString()} reputation
                        </p>
                      </div>
                    </div>
                    <div className="text-3xl">
                      {achieved ? (
                        <i className="fas fa-check-circle text-green-400"></i>
                      ) : (
                        <i className="fas fa-lock text-gray-600"></i>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Rank Requirements */}
          {!isChiefDetective && (() => {
            const nextRank = getRankInfo(playerProfile.rankLevel + 1);
            return (
              <div className="glass-card rounded-2xl p-6 shadow-xl border-2 border-primary-500/50 slide-in-right">
                <div className="flex items-center gap-3 mb-6">
                  <i className="fas fa-bullseye text-2xl text-primary-500"></i>
                  <h3 className="font-display text-2xl font-bold text-white">NEXT RANK: {nextRank.name}</h3>
                </div>
                <div className="space-y-4">
                  <div className="glass-card-dark rounded-xl p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Cases Solved</span>
                      <span className="text-white font-bold">{playerProfile.casesSolved}/{nextRank.casesRequired}</span>
                    </div>
                    <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 progress-bar transition-all duration-500"
                        style={{width: `${Math.min((playerProfile.casesSolved / nextRank.casesRequired) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="glass-card-dark rounded-xl p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Reputation</span>
                      <span className="text-white font-bold">{playerProfile.reputation.toLocaleString()}/{nextRank.minRep.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 progress-bar transition-all duration-500"
                        style={{width: `${Math.min((playerProfile.reputation / nextRank.minRep) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
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
