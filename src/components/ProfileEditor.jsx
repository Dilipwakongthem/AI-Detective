import React, { useState, useEffect } from 'react';
import {
  getProfileForSuspect,
  updateProfile,
  addTrait,
  removeTrait,
  addBehavior,
  removeBehavior,
  addMotive,
  removeMotive,
  updateOpportunity,
  addSuspicionFactor,
  removeSuspicionFactor,
  calculateSuspicionScore,
  exportProfileAsText,
  PERSONALITY_TRAITS,
  BEHAVIOR_CATEGORIES,
  MOTIVE_CATEGORIES,
  OPPORTUNITY_LEVELS
} from '../utils/suspectProfileManager';
import './ProfileEditor.css';

/**
 * Profile Editor Component
 * Comprehensive modal for editing suspect psychological profiles
 */
const ProfileEditor = ({ caseId, suspect, onClose, onSave, showNotification }) => {
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'traits', 'behaviors', 'motives', 'opportunity'

  // Form states
  const [psychologicalProfile, setPsychologicalProfile] = useState('');
  const [backgroundNotes, setBackgroundNotes] = useState('');

  // Behavior form
  const [behaviorCategory, setBehaviorCategory] = useState(BEHAVIOR_CATEGORIES.VERBAL);
  const [behaviorDescription, setBehaviorDescription] = useState('');

  // Motive form
  const [motiveCategory, setMotiveCategory] = useState(MOTIVE_CATEGORIES.FINANCIAL);
  const [motiveDescription, setMotiveDescription] = useState('');
  const [motiveStrength, setMotiveStrength] = useState(5);

  // Opportunity form
  const [opportunityLevel, setOpportunityLevel] = useState(OPPORTUNITY_LEVELS.NONE);
  const [opportunityNotes, setOpportunityNotes] = useState('');

  // Suspicion factor form
  const [factorDescription, setFactorDescription] = useState('');
  const [factorImpact, setFactorImpact] = useState(0);

  /**
   * Load profile on mount
   */
  useEffect(() => {
    if (suspect) {
      loadProfile();
    }
  }, [suspect, caseId]);

  /**
   * Load profile data
   */
  const loadProfile = () => {
    const profileData = getProfileForSuspect(caseId, suspect.id);
    setProfile(profileData);
    setPsychologicalProfile(profileData.psychologicalProfile || '');
    setBackgroundNotes(profileData.backgroundNotes || '');
    setOpportunityLevel(profileData.opportunity || OPPORTUNITY_LEVELS.NONE);
    setOpportunityNotes(profileData.opportunityNotes || '');
  };

  /**
   * Refresh profile data
   */
  const refreshProfile = () => {
    const updatedProfile = getProfileForSuspect(caseId, suspect.id);
    setProfile(updatedProfile);
  };

  /**
   * Handle trait toggle
   */
  const handleTraitToggle = (trait) => {
    if (profile.traits.includes(trait)) {
      removeTrait(caseId, suspect.id, trait);
    } else {
      addTrait(caseId, suspect.id, trait);
    }
    refreshProfile();
  };

  /**
   * Handle add behavior
   */
  const handleAddBehavior = () => {
    if (!behaviorDescription.trim()) {
      showNotification?.('Behavior description is required', 'error');
      return;
    }

    addBehavior(caseId, suspect.id, behaviorCategory, behaviorDescription);
    setBehaviorDescription('');
    showNotification?.('✅ Behavior added', 'success');
    refreshProfile();
  };

  /**
   * Handle remove behavior
   */
  const handleRemoveBehavior = (behaviorId) => {
    removeBehavior(caseId, suspect.id, behaviorId);
    showNotification?.('Behavior removed', 'info');
    refreshProfile();
  };

  /**
   * Handle add motive
   */
  const handleAddMotive = () => {
    if (!motiveDescription.trim()) {
      showNotification?.('Motive description is required', 'error');
      return;
    }

    addMotive(caseId, suspect.id, motiveCategory, motiveDescription, motiveStrength);
    setMotiveDescription('');
    setMotiveStrength(5);
    showNotification?.('✅ Motive added', 'success');
    refreshProfile();
  };

  /**
   * Handle remove motive
   */
  const handleRemoveMotive = (motiveId) => {
    removeMotive(caseId, suspect.id, motiveId);
    showNotification?.('Motive removed', 'info');
    refreshProfile();
  };

  /**
   * Handle add suspicion factor
   */
  const handleAddSuspicionFactor = () => {
    if (!factorDescription.trim()) {
      showNotification?.('Factor description is required', 'error');
      return;
    }

    const type = factorImpact > 0 ? 'positive' : 'negative';
    addSuspicionFactor(caseId, suspect.id, factorDescription, factorImpact, type);
    setFactorDescription('');
    setFactorImpact(0);
    showNotification?.('✅ Suspicion factor added', 'success');
    refreshProfile();
  };

  /**
   * Handle remove suspicion factor
   */
  const handleRemoveSuspicionFactor = (factorId) => {
    removeSuspicionFactor(caseId, suspect.id, factorId);
    showNotification?.('Suspicion factor removed', 'info');
    refreshProfile();
  };

  /**
   * Handle save profile notes
   */
  const handleSaveNotes = () => {
    updateProfile(caseId, suspect.id, {
      psychologicalProfile,
      backgroundNotes
    });
    showNotification?.('✅ Profile notes saved', 'success');
    refreshProfile();
  };

  /**
   * Handle save opportunity
   */
  const handleSaveOpportunity = () => {
    updateOpportunity(caseId, suspect.id, opportunityLevel, opportunityNotes);
    showNotification?.('✅ Opportunity assessment saved', 'success');
    refreshProfile();
  };

  /**
   * Handle export profile
   */
  const handleExportProfile = () => {
    const text = exportProfileAsText(profile, suspect.name);

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profile_${suspect.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification?.('📥 Profile exported', 'success');
  };

  /**
   * Render overview section
   */
  const renderOverview = () => {
    if (!profile) return null;

    const suspicionScore = calculateSuspicionScore(profile);

    return (
      <div className="profile-section">
        <h3 className="profile-section-title">📊 Overview</h3>

        {/* Suspicion Score */}
        <div className="profile-overview-suspicion">
          <div className="profile-overview-label">Suspicion Score</div>
          <div className="profile-overview-score-bar">
            <div
              className="profile-overview-score-fill"
              style={{
                width: `${suspicionScore}%`,
                background: suspicionScore >= 70 ? '#e74c3c' : suspicionScore >= 50 ? '#f39c12' : '#3498db'
              }}
            />
          </div>
          <div className="profile-overview-score-value">{suspicionScore}/100</div>
        </div>

        {/* Quick Stats */}
        <div className="profile-overview-stats">
          <div className="profile-overview-stat">
            <div className="profile-overview-stat-value">{profile.traits.length}</div>
            <div className="profile-overview-stat-label">Traits</div>
          </div>
          <div className="profile-overview-stat">
            <div className="profile-overview-stat-value">{profile.motives.length}</div>
            <div className="profile-overview-stat-label">Motives</div>
          </div>
          <div className="profile-overview-stat">
            <div className="profile-overview-stat-value">{profile.behaviors.length}</div>
            <div className="profile-overview-stat-label">Behaviors</div>
          </div>
          <div className="profile-overview-stat">
            <div className="profile-overview-stat-value">{profile.suspicionFactors.length}</div>
            <div className="profile-overview-stat-label">Factors</div>
          </div>
        </div>

        {/* Psychological Profile */}
        <div className="profile-form-group">
          <label className="profile-form-label">Psychological Profile</label>
          <textarea
            className="profile-form-textarea"
            value={psychologicalProfile}
            onChange={(e) => setPsychologicalProfile(e.target.value)}
            placeholder="Describe the suspect's psychological profile, personality, demeanor..."
            rows={4}
          />
        </div>

        {/* Background Notes */}
        <div className="profile-form-group">
          <label className="profile-form-label">Background Notes</label>
          <textarea
            className="profile-form-textarea"
            value={backgroundNotes}
            onChange={(e) => setBackgroundNotes(e.target.value)}
            placeholder="Record background information, history, connections..."
            rows={4}
          />
        </div>

        <button className="profile-save-btn" onClick={handleSaveNotes}>
          💾 Save Notes
        </button>
      </div>
    );
  };

  /**
   * Render traits section
   */
  const renderTraits = () => {
    if (!profile) return null;

    return (
      <div className="profile-section">
        <h3 className="profile-section-title">🎭 Personality Traits</h3>

        <div className="profile-traits-grid">
          {Object.values(PERSONALITY_TRAITS).map(trait => (
            <button
              key={trait}
              className={`profile-trait-btn ${profile.traits.includes(trait) ? 'profile-trait-btn-active' : ''}`}
              onClick={() => handleTraitToggle(trait)}
            >
              {profile.traits.includes(trait) && '✓ '}
              {trait}
            </button>
          ))}
        </div>

        {profile.traits.length > 0 && (
          <div className="profile-selected-traits">
            <div className="profile-selected-traits-label">Selected Traits:</div>
            <div className="profile-selected-traits-list">
              {profile.traits.map(trait => (
                <span key={trait} className="profile-selected-trait">
                  {trait}
                  <button
                    className="profile-selected-trait-remove"
                    onClick={() => handleTraitToggle(trait)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render behaviors section
   */
  const renderBehaviors = () => {
    if (!profile) return null;

    return (
      <div className="profile-section">
        <h3 className="profile-section-title">👁️ Behavior Observations</h3>

        {/* Add Behavior Form */}
        <div className="profile-add-form">
          <div className="profile-form-row">
            <div className="profile-form-group">
              <label className="profile-form-label">Category</label>
              <select
                className="profile-form-select"
                value={behaviorCategory}
                onChange={(e) => setBehaviorCategory(e.target.value)}
              >
                {Object.values(BEHAVIOR_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="profile-form-group">
            <label className="profile-form-label">Description</label>
            <textarea
              className="profile-form-textarea"
              value={behaviorDescription}
              onChange={(e) => setBehaviorDescription(e.target.value)}
              placeholder="Describe the observed behavior..."
              rows={2}
            />
          </div>

          <button className="profile-add-btn" onClick={handleAddBehavior}>
            ➕ Add Behavior
          </button>
        </div>

        {/* Behaviors List */}
        {profile.behaviors.length === 0 ? (
          <div className="profile-empty-list">No behaviors recorded yet</div>
        ) : (
          <div className="profile-items-list">
            {profile.behaviors.map(behavior => (
              <div key={behavior.id} className="profile-item">
                <div className="profile-item-header">
                  <span className="profile-item-category">{behavior.category}</span>
                  <button
                    className="profile-item-remove"
                    onClick={() => handleRemoveBehavior(behavior.id)}
                  >
                    🗑️
                  </button>
                </div>
                <div className="profile-item-description">{behavior.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render motives section
   */
  const renderMotives = () => {
    if (!profile) return null;

    return (
      <div className="profile-section">
        <h3 className="profile-section-title">🎯 Motives</h3>

        {/* Add Motive Form */}
        <div className="profile-add-form">
          <div className="profile-form-row">
            <div className="profile-form-group">
              <label className="profile-form-label">Category</label>
              <select
                className="profile-form-select"
                value={motiveCategory}
                onChange={(e) => setMotiveCategory(e.target.value)}
              >
                {Object.values(MOTIVE_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="profile-form-group">
              <label className="profile-form-label">Strength (1-10)</label>
              <input
                type="range"
                className="profile-form-range"
                min="1"
                max="10"
                value={motiveStrength}
                onChange={(e) => setMotiveStrength(parseInt(e.target.value))}
              />
              <span className="profile-form-range-value">{motiveStrength}</span>
            </div>
          </div>

          <div className="profile-form-group">
            <label className="profile-form-label">Description</label>
            <textarea
              className="profile-form-textarea"
              value={motiveDescription}
              onChange={(e) => setMotiveDescription(e.target.value)}
              placeholder="Describe the motive..."
              rows={2}
            />
          </div>

          <button className="profile-add-btn" onClick={handleAddMotive}>
            ➕ Add Motive
          </button>
        </div>

        {/* Motives List */}
        {profile.motives.length === 0 ? (
          <div className="profile-empty-list">No motives identified yet</div>
        ) : (
          <div className="profile-items-list">
            {profile.motives.map(motive => (
              <div key={motive.id} className="profile-item">
                <div className="profile-item-header">
                  <span className="profile-item-category">{motive.category}</span>
                  <div className="profile-item-strength">
                    <span className="profile-item-strength-label">Strength:</span>
                    <span className="profile-item-strength-value">{motive.strength}/10</span>
                  </div>
                  <button
                    className="profile-item-remove"
                    onClick={() => handleRemoveMotive(motive.id)}
                  >
                    🗑️
                  </button>
                </div>
                <div className="profile-item-description">{motive.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render opportunity section
   */
  const renderOpportunity = () => {
    if (!profile) return null;

    return (
      <div className="profile-section">
        <h3 className="profile-section-title">⏰ Opportunity Assessment</h3>

        <div className="profile-form-group">
          <label className="profile-form-label">Opportunity Level</label>
          <div className="profile-opportunity-options">
            {Object.values(OPPORTUNITY_LEVELS).map(level => (
              <button
                key={level}
                className={`profile-opportunity-btn ${opportunityLevel === level ? 'profile-opportunity-btn-active' : ''}`}
                onClick={() => setOpportunityLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-form-group">
          <label className="profile-form-label">Notes</label>
          <textarea
            className="profile-form-textarea"
            value={opportunityNotes}
            onChange={(e) => setOpportunityNotes(e.target.value)}
            placeholder="Explain the opportunity assessment (e.g., access, timing, means)..."
            rows={4}
          />
        </div>

        <button className="profile-save-btn" onClick={handleSaveOpportunity}>
          💾 Save Opportunity Assessment
        </button>

        {/* Suspicion Factors */}
        <div className="profile-subsection">
          <h4 className="profile-subsection-title">📌 Suspicion Factors</h4>

          <div className="profile-add-form">
            <div className="profile-form-group">
              <label className="profile-form-label">Description</label>
              <input
                type="text"
                className="profile-form-input"
                value={factorDescription}
                onChange={(e) => setFactorDescription(e.target.value)}
                placeholder="e.g., Found near crime scene"
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-form-label">Impact (-10 to +10)</label>
              <input
                type="range"
                className="profile-form-range"
                min="-10"
                max="10"
                value={factorImpact}
                onChange={(e) => setFactorImpact(parseInt(e.target.value))}
              />
              <span className="profile-form-range-value">
                {factorImpact > 0 ? '+' : ''}{factorImpact}
                {factorImpact > 0 && ' (Increases suspicion)'}
                {factorImpact < 0 && ' (Decreases suspicion)'}
                {factorImpact === 0 && ' (Neutral)'}
              </span>
            </div>

            <button className="profile-add-btn" onClick={handleAddSuspicionFactor}>
              ➕ Add Factor
            </button>
          </div>

          {profile.suspicionFactors.length === 0 ? (
            <div className="profile-empty-list">No suspicion factors recorded</div>
          ) : (
            <div className="profile-items-list">
              {profile.suspicionFactors.map(factor => (
                <div key={factor.id} className="profile-item">
                  <div className="profile-item-header">
                    <span className={`profile-item-impact ${factor.type === 'positive' ? 'profile-item-impact-positive' : 'profile-item-impact-negative'}`}>
                      {factor.impact > 0 ? '+' : ''}{factor.impact}
                    </span>
                    <button
                      className="profile-item-remove"
                      onClick={() => handleRemoveSuspicionFactor(factor.id)}
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="profile-item-description">{factor.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!profile || !suspect) return null;

  return (
    <div className="profile-editor-overlay" onClick={onClose}>
      <div className="profile-editor-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="profile-editor-header">
          <div className="profile-editor-header-left">
            <h2 className="profile-editor-title">
              📋 Profile: {suspect.name}
            </h2>
            <p className="profile-editor-subtitle">{suspect.role}</p>
          </div>
          <div className="profile-editor-header-right">
            <button
              className="profile-editor-export-btn"
              onClick={handleExportProfile}
              title="Export Profile"
            >
              📥
            </button>
            <button className="profile-editor-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="profile-editor-tabs">
          <button
            className={`profile-editor-tab ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`profile-editor-tab ${activeSection === 'traits' ? 'active' : ''}`}
            onClick={() => setActiveSection('traits')}
          >
            🎭 Traits
          </button>
          <button
            className={`profile-editor-tab ${activeSection === 'behaviors' ? 'active' : ''}`}
            onClick={() => setActiveSection('behaviors')}
          >
            👁️ Behaviors
          </button>
          <button
            className={`profile-editor-tab ${activeSection === 'motives' ? 'active' : ''}`}
            onClick={() => setActiveSection('motives')}
          >
            🎯 Motives
          </button>
          <button
            className={`profile-editor-tab ${activeSection === 'opportunity' ? 'active' : ''}`}
            onClick={() => setActiveSection('opportunity')}
          >
            ⏰ Opportunity
          </button>
        </div>

        {/* Content */}
        <div className="profile-editor-content">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'traits' && renderTraits()}
          {activeSection === 'behaviors' && renderBehaviors()}
          {activeSection === 'motives' && renderMotives()}
          {activeSection === 'opportunity' && renderOpportunity()}
        </div>

        {/* Footer */}
        <div className="profile-editor-footer">
          <button
            className="profile-editor-done-btn"
            onClick={() => {
              onSave?.();
              onClose();
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
