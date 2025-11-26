import React, { useState, useEffect } from 'react';
import './CaseLibraryScreen.css';
import {
  getFeaturedCases,
  getDailyCase,
  getAllCompletedCases,
  getCaseLibraryStats,
  isCaseUnlocked,
  searchCases,
  filterCasesByDifficulty,
  getTutorialCases,
  getColdCaseCases
} from '../utils/caseLibraryManager.js';

const CaseLibraryScreen = ({ onStartCase, onClose, onOpenStore }) => {
  const [activeTab, setActiveTab] = useState('tutorial'); // Start with tutorial tab
  const [tutorialCases, setTutorialCases] = useState([]);
  const [featuredCases, setFeaturedCases] = useState([]);
  const [coldCases, setColdCases] = useState([]);
  const [dailyCase, setDailyCase] = useState(null);
  const [completedCases, setCompletedCases] = useState({});
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    loadCaseData();
  }, []);

  const loadCaseData = () => {
    setTutorialCases(getTutorialCases());
    setFeaturedCases(getFeaturedCases());
    setColdCases(getColdCaseCases());
    setDailyCase(getDailyCase());
    setCompletedCases(getAllCompletedCases());
    setStats(getCaseLibraryStats());
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setFeaturedCases(searchCases(query));
    } else {
      setFeaturedCases(getFeaturedCases());
    }
  };

  const handleDifficultyFilter = (difficulty) => {
    setDifficultyFilter(difficulty);
    if (difficulty === 'all') {
      setFeaturedCases(getFeaturedCases());
    } else {
      const diff = parseInt(difficulty);
      setFeaturedCases(filterCasesByDifficulty(diff, diff));
    }
  };

  const handleCaseClick = (caseData) => {
    setSelectedCase(caseData);
  };

  const handleStartCase = (caseData) => {
    if (caseData.isUnlocked) {
      onStartCase(caseData);
    } else {
      onOpenStore('case_packs');
    }
  };

  const getDifficultyLabel = (diff) => {
    if (diff <= 2) return { label: 'Easy', color: '#4caf50' };
    if (diff <= 5) return { label: 'Medium', color: '#ff9800' };
    if (diff <= 8) return { label: 'Hard', color: '#f44336' };
    return { label: 'Expert', color: '#9c27b0' };
  };

  const getDifficultyStars = (diff) => {
    return '⭐'.repeat(Math.min(diff, 5));
  };

  const renderFeaturedCases = () => {
    const cases = searchQuery || difficultyFilter !== 'all'
      ? featuredCases
      : getFeaturedCases();

    return (
      <div className="featured-cases-grid">
        {cases.map((caseData, index) => {
          const difficulty = getDifficultyLabel(caseData.difficulty);
          const completion = caseData.completion;

          return (
            <div
              key={caseData.id}
              className={`case-card ${!caseData.isUnlocked ? 'locked' : ''} ${
                completion ? 'completed' : ''
              }`}
              onClick={() => handleCaseClick(caseData)}
            >
              {!caseData.isUnlocked && (
                <div className="lock-overlay">
                  <span className="lock-icon">🔒</span>
                </div>
              )}

              <div className="case-card-header">
                <h3 className="case-title">{caseData.title}</h3>
                <div className="case-difficulty" style={{ color: difficulty.color }}>
                  {difficulty.label}
                </div>
              </div>

              <div className="case-meta">
                <span className="case-type">{caseData.crimeType}</span>
                <span className="case-stars">{getDifficultyStars(caseData.difficulty)}</span>
              </div>

              <p className="case-description">
                {caseData.narrative?.opening?.substring(0, 120)}...
              </p>

              {completion && (
                <div className="case-completion-badge">
                  <span className="completion-stars">
                    {`${'⭐'.repeat(completion.bestStars)}`}
                  </span>
                  <span className="completion-count">
                    {completion.successfulSolves} solve{completion.successfulSolves !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              <button
                className={`case-action-btn ${!caseData.isUnlocked ? 'unlock-btn' : 'start-btn'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartCase(caseData);
                }}
              >
                {caseData.isUnlocked ? (
                  completion ? '🔄 Replay' : '▶ Start Case'
                ) : (
                  '🔒 Unlock'
                )}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDailyCase = () => {
    if (!dailyCase) return null;

    const caseData = dailyCase.case;
    const difficulty = getDifficultyLabel(caseData.difficulty);
    const isUnlocked = isCaseUnlocked(caseData.id);
    const completion = completedCases[caseData.id];

    return (
      <div className="daily-case-section">
        <div className="daily-case-header">
          <h2>
            📅 Daily Case <span className="daily-badge">NEW</span>
          </h2>
          <p className="daily-subtitle">A fresh challenge every day!</p>
        </div>

        <div className="daily-case-card">
          <div className="daily-case-content">
            <h3 className="daily-case-title">{caseData.title}</h3>
            <div className="daily-case-meta">
              <span className="daily-type">{caseData.crimeType}</span>
              <span className="daily-difficulty" style={{ color: difficulty.color }}>
                {difficulty.label} {getDifficultyStars(caseData.difficulty)}
              </span>
            </div>

            <p className="daily-description">{caseData.narrative?.opening}</p>

            {completion && (
              <div className="daily-completion">
                ✅ Solved with {completion.bestStars}⭐ ({completion.attempts} attempt{completion.attempts !== 1 ? 's' : ''})
              </div>
            )}
          </div>

          <button
            className="daily-case-btn"
            onClick={() => handleStartCase({ ...caseData, isUnlocked })}
          >
            {isUnlocked ? (
              completion ? '🔄 Replay Daily Case' : '▶ Play Daily Case'
            ) : (
              '🔒 Unlock to Play'
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderCompletedCases = () => {
    const completed = Object.entries(completedCases)
      .map(([caseId, completion]) => {
        const caseData = featuredCases.find(c => c.id === caseId);
        return { ...caseData, completion };
      })
      .filter(c => c.completion?.successfulSolves > 0)
      .sort((a, b) => b.completion.bestStars - a.completion.bestStars);

    if (completed.length === 0) {
      return (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No Completed Cases Yet</h3>
          <p>Start solving cases to see your achievements here!</p>
        </div>
      );
    }

    return (
      <div className="completed-cases-list">
        {completed.map((caseData) => {
          const difficulty = getDifficultyLabel(caseData.difficulty);
          const completion = caseData.completion;

          return (
            <div
              key={caseData.id}
              className="completed-case-item"
              onClick={() => handleCaseClick(caseData)}
            >
              <div className="completed-case-info">
                <h4>{caseData.title}</h4>
                <div className="completed-meta">
                  <span className="completed-type">{caseData.crimeType}</span>
                  <span style={{ color: difficulty.color }}>{difficulty.label}</span>
                </div>
              </div>

              <div className="completed-stats">
                <div className="stat">
                  <span className="stat-label">Best</span>
                  <span className="stat-value">{`${'⭐'.repeat(completion.bestStars)}`}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Solves</span>
                  <span className="stat-value">{completion.successfulSolves}/{completion.attempts}</span>
                </div>
                {completion.bestTime && (
                  <div className="stat">
                    <span className="stat-label">Best Time</span>
                    <span className="stat-value">{Math.floor(completion.bestTime / 60)}m</span>
                  </div>
                )}
              </div>

              <button
                className="replay-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartCase(caseData);
                }}
              >
                🔄 Replay
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="case-library-screen">
      <div className="library-header">
        <div className="header-content">
          <h1>📚 Case Library</h1>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {stats && (
          <div className="library-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.unlockedCases}/{stats.totalCases}</span>
              <span className="stat-label">Unlocked</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.completedCases}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.perfectSolves}</span>
              <span className="stat-label">Perfect</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.completionPercentage}%</span>
              <span className="stat-label">Progress</span>
            </div>
          </div>
        )}

        <div className="library-tabs">
          <button
            className={`tab ${activeTab === 'tutorial' ? 'active' : ''}`}
            onClick={() => setActiveTab('tutorial')}
          >
            🎓 Tutorial
          </button>
          <button
            className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            📅 Daily Case
          </button>
          <button
            className={`tab ${activeTab === 'featured' ? 'active' : ''}`}
            onClick={() => setActiveTab('featured')}
          >
            ⭐ Featured Cases
          </button>
          <button
            className={`tab ${activeTab === 'cold_case' ? 'active' : ''}`}
            onClick={() => setActiveTab('cold_case')}
          >
            📁 Cold Cases
          </button>
          <button
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            ✅ Completed
          </button>
        </div>
      </div>

      <div className="library-content">
        {activeTab === 'tutorial' && (
          <div className="tutorial-section">
            <div className="tutorial-intro">
              <h3>📚 Detective Training</h3>
              <p>Master the fundamentals with these quick learning cases. Progress from 1-minute basics to 3-minute advanced training.</p>
            </div>
            <div className="tutorial-cases-grid">
              {tutorialCases.map((caseData, index) => (
                <div
                  key={caseData.id}
                  className="tutorial-case-card"
                  onClick={() => handleStartCase({ ...caseData, type: 'tutorial', case: caseData })}
                >
                  <div className="tutorial-badge">
                    <span className="tutorial-number">{index + 1}</span>
                    <span className="tutorial-time">{caseData.estimatedTime}</span>
                  </div>
                  <h4>{caseData.title}</h4>
                  <p className="tutorial-description">{caseData.narrative.tutorial}</p>
                  <div className="tutorial-stats">
                    <span className="tutorial-difficulty">{'⭐'.repeat(caseData.difficulty)}</span>
                    <span className="tutorial-tag">FREE</span>
                  </div>
                  <button className="tutorial-start-btn">
                    {completedCases[caseData.id] ? '🔄 Replay Tutorial' : '▶️ Start Training'}
                  </button>
                  {completedCases[caseData.id] && (
                    <div className="tutorial-completion">
                      ✅ Completed • {completedCases[caseData.id].stars}⭐
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'featured' && (
          <>
            <div className="filters-bar">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Search cases..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <select
                className="difficulty-filter"
                value={difficultyFilter}
                onChange={(e) => handleDifficultyFilter(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="1">Easy (1⭐)</option>
                <option value="2">Medium (2⭐)</option>
                <option value="3">Hard (3⭐)</option>
                <option value="4">Expert (4⭐)</option>
                <option value="5">Master (5⭐)</option>
              </select>
              <button className="store-btn" onClick={() => onOpenStore('case_packs')}>
                🛒 Case Packs
              </button>
            </div>
            {renderFeaturedCases()}
          </>
        )}

        {activeTab === 'cold_case' && (
          <div className="cold-case-section">
            <div className="cold-case-intro">
              <h3>📁 Cold Case Files</h3>
              <p>Reopen unsolved cases from years past. These complex investigations feature aged evidence, extensive suspect lists, and require meticulous detective work. Success is measured by methodology, not speed.</p>
            </div>
            <div className="cold-cases-grid">
              {coldCases.map((caseData, index) => (
                <div
                  key={caseData.id}
                  className="cold-case-card"
                  onClick={() => handleStartCase({ ...caseData, type: 'cold_case', case: caseData })}
                >
                  <div className="cold-case-header">
                    <div className="cold-case-age">
                      <span className="years-badge">{caseData.yearsOld} YEARS OLD</span>
                    </div>
                    <div className="cold-case-type">{caseData.crimeType}</div>
                  </div>
                  <h4>{caseData.title}</h4>
                  <p className="cold-case-opening">{caseData.narrative.opening}</p>
                  <div className="cold-case-details">
                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <span>{caseData.suspects.length} Suspects</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🔍</span>
                      <span>{caseData.evidence.length} Evidence</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">⭐</span>
                      <span>Difficulty {caseData.difficulty}/10</span>
                    </div>
                  </div>
                  <button className="cold-case-start-btn">
                    {completedCases[caseData.id] ? '🔄 Reinvestigate' : '📁 Open Case File'}
                  </button>
                  {completedCases[caseData.id] && (
                    <div className="cold-case-completion">
                      ✅ Solved • {completedCases[caseData.id].stars}⭐ • Methodology: {completedCases[caseData.id].methodologyScore || 'N/A'}/100
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'daily' && renderDailyCase()}
        {activeTab === 'completed' && renderCompletedCases()}
      </div>

      {selectedCase && (
        <div className="case-detail-modal" onClick={() => setSelectedCase(null)}>
          <div className="case-detail-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCase(null)}>✕</button>

            <h2>{selectedCase.title}</h2>
            <div className="detail-meta">
              <span className="detail-type">{selectedCase.crimeType}</span>
              <span className="detail-difficulty">
                {getDifficultyLabel(selectedCase.difficulty).label}
              </span>
              <span className="detail-location">📍 {selectedCase.location}</span>
            </div>

            <div className="detail-description">
              <h3>Case Brief</h3>
              <p>{selectedCase.narrative?.opening}</p>
            </div>

            {selectedCase.completion && (
              <div className="detail-completion">
                <h3>Your Performance</h3>
                <div className="performance-stats">
                  <span>Best: {`${'⭐'.repeat(selectedCase.completion.bestStars)}`}</span>
                  <span>Attempts: {selectedCase.completion.attempts}</span>
                  <span>Success Rate: {Math.round((selectedCase.completion.successfulSolves / selectedCase.completion.attempts) * 100)}%</span>
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button
                className="detail-start-btn"
                onClick={() => {
                  setSelectedCase(null);
                  handleStartCase(selectedCase);
                }}
              >
                {selectedCase.isUnlocked ? (
                  selectedCase.completion ? '🔄 Replay Case' : '▶ Start Case'
                ) : (
                  '🔒 Unlock Case'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseLibraryScreen;
