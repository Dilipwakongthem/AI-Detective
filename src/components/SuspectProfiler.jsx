import React, { useState, useEffect } from 'react';
import {
  getAllProfiles,
  getProfileForSuspect,
  calculateSuspicionScore,
  getProfileCompleteness,
  getStrongestMotive,
  recalculateAllScores,
  OPPORTUNITY_LEVELS
} from '../utils/suspectProfileManager';
import './SuspectProfiler.css';

/**
 * Suspect Profiler Component
 * Main interface for viewing and managing suspect psychological profiles
 */
const SuspectProfiler = ({ caseId, suspects, onEditProfile, onViewRelationships }) => {
  const [profiles, setProfiles] = useState([]);
  const [sortBy, setSortBy] = useState('suspicion'); // 'suspicion', 'name', 'completeness'
  const [sortedSuspects, setSortedSuspects] = useState([]);

  /**
   * Load profiles on mount
   */
  useEffect(() => {
    loadProfiles();
  }, [caseId]);

  /**
   * Sort suspects when profiles or sort option changes
   */
  useEffect(() => {
    sortSuspects();
  }, [profiles, suspects, sortBy]);

  /**
   * Load all profiles
   */
  const loadProfiles = () => {
    // Ensure all suspects have profiles
    suspects.forEach(suspect => {
      getProfileForSuspect(caseId, suspect.id);
    });

    // Recalculate scores
    recalculateAllScores(caseId);

    // Load all profiles
    const allProfiles = getAllProfiles(caseId);
    setProfiles(allProfiles);
  };

  /**
   * Sort suspects by selected criteria
   */
  const sortSuspects = () => {
    if (!suspects || suspects.length === 0) {
      setSortedSuspects([]);
      return;
    }

    const suspectsWithData = suspects.map(suspect => {
      const profile = profiles.find(p => p.suspectId === suspect.id) ||
                     getProfileForSuspect(caseId, suspect.id);
      const completeness = getProfileCompleteness(profile);
      const strongestMotive = getStrongestMotive(profile);

      return {
        ...suspect,
        profile,
        completeness,
        strongestMotive
      };
    });

    let sorted = [...suspectsWithData];

    switch (sortBy) {
      case 'suspicion':
        sorted.sort((a, b) => b.profile.suspicionScore - a.profile.suspicionScore);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'completeness':
        sorted.sort((a, b) => b.completeness - a.completeness);
        break;
      default:
        break;
    }

    setSortedSuspects(sorted);
  };

  /**
   * Get suspicion level info
   */
  const getSuspicionInfo = (score) => {
    if (score >= 80) return { level: 'Very High', color: '#e74c3c', icon: '🔴' };
    if (score >= 65) return { level: 'High', color: '#e67e22', icon: '🟠' };
    if (score >= 50) return { level: 'Moderate', color: '#f39c12', icon: '🟡' };
    if (score >= 35) return { level: 'Low', color: '#3498db', icon: '🔵' };
    return { level: 'Very Low', color: '#27ae60', icon: '🟢' };
  };

  /**
   * Get opportunity level info
   */
  const getOpportunityInfo = (level) => {
    switch (level) {
      case OPPORTUNITY_LEVELS.HIGH:
        return { label: 'High', color: '#e74c3c', icon: '⬆️' };
      case OPPORTUNITY_LEVELS.MEDIUM:
        return { label: 'Medium', color: '#f39c12', icon: '➡️' };
      case OPPORTUNITY_LEVELS.LOW:
        return { label: 'Low', color: '#3498db', icon: '⬇️' };
      case OPPORTUNITY_LEVELS.NONE:
        return { label: 'None', color: '#7f8c8d', icon: '❌' };
      default:
        return { label: 'Unknown', color: '#7f8c8d', icon: '❓' };
    }
  };

  /**
   * Render suspect profile card
   */
  const renderSuspectCard = (suspectData) => {
    const { profile, completeness, strongestMotive } = suspectData;
    const suspicionInfo = getSuspicionInfo(profile.suspicionScore);
    const opportunityInfo = getOpportunityInfo(profile.opportunity);

    return (
      <div key={suspectData.id} className="suspect-profile-card">
        {/* Header */}
        <div className="suspect-profile-header">
          <div className="suspect-profile-avatar">
            <span className="suspect-profile-avatar-icon">👤</span>
          </div>
          <div className="suspect-profile-title-section">
            <h3 className="suspect-profile-name">{suspectData.name}</h3>
            <p className="suspect-profile-role">{suspectData.role}</p>
          </div>
          <button
            className="suspect-profile-edit-btn"
            onClick={() => onEditProfile(suspectData)}
            title="Edit Profile"
          >
            ✏️
          </button>
        </div>

        {/* Suspicion Score */}
        <div className="suspect-profile-suspicion">
          <div className="suspect-profile-suspicion-label">Suspicion Level</div>
          <div className="suspect-profile-suspicion-bar-container">
            <div
              className="suspect-profile-suspicion-bar"
              style={{
                width: `${profile.suspicionScore}%`,
                background: suspicionInfo.color
              }}
            />
          </div>
          <div
            className="suspect-profile-suspicion-value"
            style={{ color: suspicionInfo.color }}
          >
            {suspicionInfo.icon} {profile.suspicionScore}% - {suspicionInfo.level}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="suspect-profile-stats">
          <div className="suspect-profile-stat">
            <div className="suspect-profile-stat-value">
              {completeness}%
            </div>
            <div className="suspect-profile-stat-label">Complete</div>
          </div>

          <div className="suspect-profile-stat">
            <div className="suspect-profile-stat-value">
              {profile.motives.length}
            </div>
            <div className="suspect-profile-stat-label">Motives</div>
          </div>

          <div className="suspect-profile-stat">
            <div
              className="suspect-profile-stat-value"
              style={{ color: opportunityInfo.color }}
            >
              {opportunityInfo.icon}
            </div>
            <div className="suspect-profile-stat-label">Opportunity</div>
          </div>

          <div className="suspect-profile-stat">
            <div className="suspect-profile-stat-value">
              {profile.relationships.length}
            </div>
            <div className="suspect-profile-stat-label">Relations</div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="suspect-profile-quick-info">
          {/* Traits */}
          {profile.traits.length > 0 && (
            <div className="suspect-profile-info-section">
              <div className="suspect-profile-info-label">Traits:</div>
              <div className="suspect-profile-traits">
                {profile.traits.slice(0, 3).map(trait => (
                  <span key={trait} className="suspect-profile-trait-badge">
                    {trait}
                  </span>
                ))}
                {profile.traits.length > 3 && (
                  <span className="suspect-profile-trait-more">
                    +{profile.traits.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Strongest Motive */}
          {strongestMotive && (
            <div className="suspect-profile-info-section">
              <div className="suspect-profile-info-label">Strongest Motive:</div>
              <div className="suspect-profile-motive">
                <span className="suspect-profile-motive-category">
                  {strongestMotive.category}
                </span>
                <span className="suspect-profile-motive-strength">
                  ({strongestMotive.strength}/10)
                </span>
              </div>
            </div>
          )}

          {/* Behaviors */}
          {profile.behaviors.length > 0 && (
            <div className="suspect-profile-info-section">
              <div className="suspect-profile-info-label">
                {profile.behaviors.length} Behavior{profile.behaviors.length !== 1 ? 's' : ''} Observed
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="suspect-profile-actions">
          <button
            className="suspect-profile-action-btn"
            onClick={() => onEditProfile(suspectData)}
          >
            📝 View Full Profile
          </button>
          {profile.relationships.length > 0 && (
            <button
              className="suspect-profile-action-btn suspect-profile-action-btn-secondary"
              onClick={() => onViewRelationships(suspectData)}
            >
              🔗 View Relationships
            </button>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => {
    return (
      <div className="suspect-profiler-empty">
        <div className="suspect-profiler-empty-icon">👥</div>
        <h3 className="suspect-profiler-empty-title">No Suspects Available</h3>
        <p className="suspect-profiler-empty-message">
          Suspects will appear here once they are identified in the case.
        </p>
      </div>
    );
  };

  return (
    <div className="suspect-profiler">
      {/* Toolbar */}
      {suspects && suspects.length > 0 && (
        <div className="suspect-profiler-toolbar">
          <div className="suspect-profiler-toolbar-left">
            <h3 className="suspect-profiler-title">
              📊 Suspect Profiles ({suspects.length})
            </h3>
          </div>

          <div className="suspect-profiler-toolbar-right">
            <label className="suspect-profiler-sort-label">Sort by:</label>
            <select
              className="suspect-profiler-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="suspicion">Suspicion Level</option>
              <option value="name">Name (A-Z)</option>
              <option value="completeness">Profile Completeness</option>
            </select>
          </div>
        </div>
      )}

      {/* Suspects Grid */}
      <div className="suspect-profiler-content">
        {!suspects || suspects.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="suspect-profiles-grid">
            {sortedSuspects.map(suspectData => renderSuspectCard(suspectData))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {suspects && suspects.length > 0 && (
        <div className="suspect-profiler-footer">
          <p className="suspect-profiler-footer-text">
            💡 Tip: Build comprehensive profiles by adding traits, motives, and behaviors
          </p>
        </div>
      )}
    </div>
  );
};

export default SuspectProfiler;
