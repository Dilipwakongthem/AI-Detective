import React, { useState, useEffect } from 'react';
import {
  getEventsForCase,
  filterEventsBySuspect,
  getAlibiSummary,
  validateAlibi,
  sortEventsChronologically,
  formatEventTime,
  EVENT_TYPES,
  VERIFICATION_STATUS
} from '../utils/timelineManager';
import './AlibiValidator.css';

/**
 * Alibi Validator Component
 * Checks suspect alibis for timing conflicts and inconsistencies
 */
const AlibiValidator = ({ caseId, suspects, onClose }) => {
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [alibiSummary, setAlibiSummary] = useState(null);
  const [validation, setValidation] = useState(null);
  const [suspectEvents, setSuspectEvents] = useState([]);

  /**
   * Load alibi data when suspect changes
   */
  useEffect(() => {
    if (selectedSuspect) {
      loadAlibiData(selectedSuspect.id);
    } else {
      setAlibiSummary(null);
      setValidation(null);
      setSuspectEvents([]);
    }
  }, [selectedSuspect, caseId]);

  /**
   * Load alibi data for a suspect
   */
  const loadAlibiData = (suspectId) => {
    // Get summary
    const summary = getAlibiSummary(caseId, suspectId);
    setAlibiSummary(summary);

    // Get validation
    const validation = summary.validation;
    setValidation(validation);

    // Get all events for this suspect
    const allEvents = getEventsForCase(caseId);
    const filtered = filterEventsBySuspect(allEvents, suspectId);
    const sorted = sortEventsChronologically(filtered);
    setSuspectEvents(sorted);
  };

  /**
   * Get alibi strength info
   */
  const getStrengthInfo = (strength) => {
    if (strength >= 80) return { color: '#27ae60', label: 'Strong', icon: '🟢' };
    if (strength >= 60) return { color: '#f39c12', label: 'Moderate', icon: '🟡' };
    if (strength >= 40) return { color: '#e67e22', label: 'Weak', icon: '🟠' };
    if (strength >= 20) return { color: '#e74c3c', label: 'Very Weak', icon: '🔴' };
    return { color: '#95a5a6', label: 'No Alibi', icon: '⚪' };
  };

  /**
   * Render suspect selector
   */
  const renderSuspectSelector = () => {
    if (!suspects || suspects.length === 0) {
      return (
        <div className="alibi-empty-state">
          <div className="alibi-empty-icon">👤</div>
          <p>No suspects available to check alibis.</p>
        </div>
      );
    }

    return (
      <div className="alibi-suspect-selector">
        <h3 className="alibi-selector-title">Select a Suspect to Validate</h3>
        <div className="alibi-suspect-list">
          {suspects.map(suspect => (
            <div
              key={suspect.id}
              className={`alibi-suspect-card ${
                selectedSuspect?.id === suspect.id ? 'alibi-suspect-card-selected' : ''
              }`}
              onClick={() => setSelectedSuspect(suspect)}
            >
              <div className="alibi-suspect-icon">👤</div>
              <div className="alibi-suspect-info">
                <div className="alibi-suspect-name">{suspect.name}</div>
                <div className="alibi-suspect-role">{suspect.role}</div>
              </div>
              {selectedSuspect?.id === suspect.id && (
                <div className="alibi-suspect-selected-badge">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render alibi summary stats
   */
  const renderSummaryStats = () => {
    if (!alibiSummary) return null;

    const strengthInfo = getStrengthInfo(alibiSummary.alibiStrength);

    return (
      <div className="alibi-summary-panel">
        <h3 className="alibi-summary-title">
          Alibi Summary: {selectedSuspect.name}
        </h3>

        <div className="alibi-summary-stats">
          <div className="alibi-stat">
            <div className="alibi-stat-label">Alibi Strength</div>
            <div className="alibi-stat-value-container">
              <div
                className="alibi-strength-bar"
                style={{
                  width: `${alibiSummary.alibiStrength}%`,
                  background: strengthInfo.color
                }}
              />
            </div>
            <div className="alibi-stat-value" style={{ color: strengthInfo.color }}>
              {strengthInfo.icon} {alibiSummary.alibiStrength}% - {strengthInfo.label}
            </div>
          </div>

          <div className="alibi-stats-grid">
            <div className="alibi-stat-item">
              <div className="alibi-stat-item-value">{alibiSummary.totalEvents}</div>
              <div className="alibi-stat-item-label">Total Events</div>
            </div>

            <div className="alibi-stat-item alibi-stat-claimed">
              <div className="alibi-stat-item-value">{alibiSummary.claimedEvents}</div>
              <div className="alibi-stat-item-label">Claimed</div>
            </div>

            <div className="alibi-stat-item alibi-stat-verified">
              <div className="alibi-stat-item-value">{alibiSummary.verifiedEvents}</div>
              <div className="alibi-stat-item-label">Verified</div>
            </div>

            <div className="alibi-stat-item alibi-stat-contradicted">
              <div className="alibi-stat-item-value">{alibiSummary.contradictedEvents}</div>
              <div className="alibi-stat-item-label">Contradicted</div>
            </div>
          </div>
        </div>

        {alibiSummary.hasConflicts && (
          <div className="alibi-conflict-alert">
            <span className="alibi-conflict-icon">⚠️</span>
            <span className="alibi-conflict-text">
              Alibi conflicts detected! Review details below.
            </span>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render validation results
   */
  const renderValidationResults = () => {
    if (!validation) return null;

    const hasIssues = validation.contradictingEvidence.length > 0 || validation.gaps.length > 0;

    if (!hasIssues && validation.supportingEvidence.length === 0) {
      return (
        <div className="alibi-no-validation">
          <div className="alibi-no-validation-icon">ℹ️</div>
          <p>No alibi claims to validate. Add suspect claim events to the timeline.</p>
        </div>
      );
    }

    return (
      <div className="alibi-validation-results">
        <h4 className="alibi-results-title">🔍 Validation Results</h4>

        {/* Supporting Evidence */}
        {validation.supportingEvidence.length > 0 && (
          <div className="alibi-result-section alibi-result-supporting">
            <div className="alibi-result-header">
              <span className="alibi-result-icon">✅</span>
              <span className="alibi-result-label">
                Supporting Evidence ({validation.supportingEvidence.length})
              </span>
            </div>
            <div className="alibi-result-items">
              {validation.supportingEvidence.map((item, idx) => (
                <div key={idx} className="alibi-result-item">
                  <div className="alibi-result-item-text">
                    Claimed event corroborated by {item.supportingEvents.length} established event(s)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contradicting Evidence */}
        {validation.contradictingEvidence.length > 0 && (
          <div className="alibi-result-section alibi-result-contradicting">
            <div className="alibi-result-header">
              <span className="alibi-result-icon">❌</span>
              <span className="alibi-result-label">
                Contradicting Evidence ({validation.contradictingEvidence.length})
              </span>
            </div>
            <div className="alibi-result-items">
              {validation.contradictingEvidence.map((item, idx) => (
                <div key={idx} className="alibi-result-item">
                  <div className="alibi-result-item-text">
                    Claimed event contradicted by {item.contradictingEvents.length} established event(s)
                  </div>
                  <div className="alibi-result-item-detail">
                    Suspect claims to be at one location, but evidence places them elsewhere
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timing Gaps */}
        {validation.gaps.length > 0 && (
          <div className="alibi-result-section alibi-result-gaps">
            <div className="alibi-result-header">
              <span className="alibi-result-icon">⏱️</span>
              <span className="alibi-result-label">
                Timing Gaps ({validation.gaps.length})
              </span>
            </div>
            <div className="alibi-result-items">
              {validation.gaps.map((gap, idx) => (
                <div key={idx} className="alibi-result-item">
                  <div className="alibi-result-item-text">{gap.message}</div>
                  <div className="alibi-result-item-detail">
                    This timing is physically impossible or highly suspicious
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conflicts */}
        {validation.conflicts.length > 0 && (
          <div className="alibi-result-section alibi-result-conflicts">
            <div className="alibi-result-header">
              <span className="alibi-result-icon">⚠️</span>
              <span className="alibi-result-label">
                Conflicts ({validation.conflicts.length})
              </span>
            </div>
            <div className="alibi-result-items">
              {validation.conflicts.map((conflict, idx) => (
                <div key={idx} className="alibi-result-item">
                  <div className="alibi-result-item-text">
                    {conflict.type === 'location_mismatch' && 'Location mismatch detected'}
                    {conflict.type === 'impossible_timing' && 'Impossible timing detected'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render suspect events timeline
   */
  const renderSuspectEvents = () => {
    if (suspectEvents.length === 0) {
      return (
        <div className="alibi-no-events">
          <div className="alibi-no-events-icon">📅</div>
          <p>No timeline events linked to this suspect yet.</p>
        </div>
      );
    }

    return (
      <div className="alibi-events-section">
        <h4 className="alibi-events-title">📅 Timeline Events ({suspectEvents.length})</h4>
        <div className="alibi-events-list">
          {suspectEvents.map(event => {
            const isVerified = event.verificationStatus === VERIFICATION_STATUS.VERIFIED;
            const isContradicted = event.verificationStatus === VERIFICATION_STATUS.CONTRADICTED;
            const isClaim = event.eventType === EVENT_TYPES.SUSPECT_CLAIM;

            return (
              <div
                key={event.id}
                className={`alibi-event-card ${
                  isContradicted ? 'alibi-event-contradicted' : ''
                } ${isVerified ? 'alibi-event-verified' : ''}`}
              >
                <div className="alibi-event-time">
                  🕒 {formatEventTime(event)}
                </div>
                <div className="alibi-event-title">{event.title}</div>
                {event.location && (
                  <div className="alibi-event-location">📍 {event.location}</div>
                )}
                <div className="alibi-event-badges">
                  {isClaim && (
                    <span className="alibi-event-badge alibi-badge-claim">💬 Claim</span>
                  )}
                  {isVerified && (
                    <span className="alibi-event-badge alibi-badge-verified">✓ Verified</span>
                  )}
                  {isContradicted && (
                    <span className="alibi-event-badge alibi-badge-contradicted">✗ Contradicted</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="alibi-validator-overlay" onClick={onClose}>
      <div className="alibi-validator-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="alibi-validator-header">
          <h2 className="alibi-validator-title">🔍 Alibi Validator</h2>
          <button className="alibi-validator-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="alibi-validator-content">
          {/* Suspect Selector */}
          {!selectedSuspect && renderSuspectSelector()}

          {/* Alibi Analysis */}
          {selectedSuspect && (
            <>
              <button
                className="alibi-back-btn"
                onClick={() => setSelectedSuspect(null)}
              >
                ← Back to Suspect List
              </button>

              {renderSummaryStats()}
              {renderValidationResults()}
              {renderSuspectEvents()}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="alibi-validator-footer">
          <div className="alibi-footer-info">
            💡 Tip: Link suspects to timeline events to validate their alibis
          </div>
          <button className="alibi-footer-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlibiValidator;
