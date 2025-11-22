import React, { useState, useEffect } from 'react';
import './CaseLibraryScreen.css';
import {
  getFeaturedCases,
  getDailyCase,
  getAllCompletedCases,
  getCaseLibraryStats,
  isCaseUnlocked,
  searchCases,
  filterCasesByDifficulty
} from '../utils/caseLibraryManager.js';

const CaseLibraryScreen = ({ onStartCase, onClose, onOpenStore }) => {
  const [activeTab, setActiveTab] = useState('featured');
  const [featuredCases, setFeaturedCases] = useState([]);
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
    setFeaturedCases(getFeaturedCases());
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

  const renderProceduralInfo = () => {
    return (
      <div className="procedural-section">
        <div className="procedural-header">
          <h2>🎲 Procedural Cases</h2>
          <p>Infinite randomly generated mysteries</p>
        </div>

        <div className="procedural-info-card">
          <h3>Endless Detective Work</h3>
          <p>
            Procedural cases are dynamically generated using advanced algorithms,
            ensuring no two cases are ever the same. Perfect for practicing your
            detective skills!
          </p>

          <div className="procedural-features">
            <div className="feature">
              <span className="feature-icon">♾️</span>
              <h4>Infinite Cases</h4>
              <p>Never run out of mysteries to solve</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <h4>Scalable Difficulty</h4>
              <p>Difficulty adapts to your skill level</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🔀</span>
              <h4>Unique Every Time</h4>
              <p>Different suspects, evidence, and motives</p>
            </div>
          </div>

          <button
            className="procedural-play-btn"
            onClick={() => onStartCase({ type: 'procedural' })}
          >
            ▶ Start Random Case
          </button>
        </div>
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
            className={`tab ${activeTab === 'procedural' ? 'active' : ''}`}
            onClick={() => setActiveTab('procedural')}
          >
            🎲 Procedural
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

        {activeTab === 'daily' && renderDailyCase()}
        {activeTab === 'procedural' && renderProceduralInfo()}
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
