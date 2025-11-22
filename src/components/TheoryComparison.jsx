import React, { useState, useEffect } from 'react';
import {
  calculateTheoryStrength,
  compareTheories
} from '../utils/theoryManager';
import './TheoryComparison.css';

/**
 * Theory Comparison Component
 * Side-by-side comparison of 2-4 theories
 */
const TheoryComparison = ({
  theories,
  selectedTheoryIds,
  onClose,
  onDeselect
}) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [selectedTheories, setSelectedTheories] = useState([]);

  /**
   * Load selected theories
   */
  useEffect(() => {
    const selected = theories.filter(t => selectedTheoryIds.includes(t.id));
    setSelectedTheories(selected);

    // If exactly 2 theories, run comparison
    if (selected.length === 2) {
      const comparison = compareTheories(selected[0], selected[1]);
      setComparisonData(comparison);
    }
  }, [theories, selectedTheoryIds]);

  /**
   * Render confidence stars
   */
  const renderConfidenceStars = (confidence) => {
    return '⭐'.repeat(confidence) + '☆'.repeat(5 - confidence);
  };

  /**
   * Get strength color
   */
  const getStrengthColor = (strength) => {
    if (strength >= 80) return '#27ae60';
    if (strength >= 60) return '#f39c12';
    if (strength >= 40) return '#e67e22';
    if (strength >= 20) return '#e74c3c';
    return '#95a5a6';
  };

  /**
   * Render single theory column
   */
  const renderTheoryColumn = (theory) => {
    const strength = calculateTheoryStrength(theory);
    const strengthColor = getStrengthColor(strength);

    return (
      <div key={theory.id} className="comparison-column">
        {/* Header */}
        <div className="comparison-column-header" style={{ borderColor: strengthColor }}>
          <h3 className="comparison-theory-title">{theory.title}</h3>
          <div className="comparison-theory-meta">
            <span className="comparison-confidence">
              {renderConfidenceStars(theory.confidence)}
            </span>
          </div>
        </div>

        {/* Description */}
        {theory.description && (
          <div className="comparison-section">
            <div className="comparison-section-label">Description:</div>
            <div className="comparison-description">{theory.description}</div>
          </div>
        )}

        {/* Strength Score */}
        <div className="comparison-section">
          <div className="comparison-section-label">Strength Score:</div>
          <div className="comparison-strength">
            <div className="comparison-strength-bar-container">
              <div
                className="comparison-strength-bar"
                style={{
                  width: `${strength}%`,
                  background: strengthColor
                }}
              />
            </div>
            <div className="comparison-strength-value" style={{ color: strengthColor }}>
              {strength}%
            </div>
          </div>
        </div>

        {/* Supporting Evidence */}
        <div className="comparison-section">
          <div className="comparison-section-label">
            ✅ Supporting Evidence ({theory.supportingEvidence.length})
          </div>
          {theory.supportingEvidence.length === 0 ? (
            <div className="comparison-empty">None</div>
          ) : (
            <ul className="comparison-list">
              {theory.supportingEvidence.map((evidence, idx) => (
                <li key={idx} className="comparison-list-item comparison-list-supporting">
                  <div className="comparison-evidence-name">
                    🔍 {evidence.evidenceName}
                  </div>
                  <div className="comparison-evidence-meta">
                    {evidence.weight === 3 && '⭐⭐⭐ Critical'}
                    {evidence.weight === 2 && '⭐⭐ Moderate'}
                    {evidence.weight === 1 && '⭐ Minor'}
                  </div>
                  {evidence.note && (
                    <div className="comparison-evidence-note">"{evidence.note}"</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contradicting Evidence */}
        <div className="comparison-section">
          <div className="comparison-section-label">
            ⚠️ Contradicting Evidence ({theory.contradictingEvidence.length})
          </div>
          {theory.contradictingEvidence.length === 0 ? (
            <div className="comparison-empty">None</div>
          ) : (
            <ul className="comparison-list">
              {theory.contradictingEvidence.map((evidence, idx) => (
                <li key={idx} className="comparison-list-item comparison-list-contradicting">
                  <div className="comparison-evidence-name">
                    ⚠️ {evidence.evidenceName}
                  </div>
                  <div className="comparison-evidence-meta">
                    {evidence.severity === 3 && '🔴 High'}
                    {evidence.severity === 2 && '🟡 Medium'}
                    {evidence.severity === 1 && '🟢 Low'}
                  </div>
                  {evidence.note && (
                    <div className="comparison-evidence-note">"{evidence.note}"</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Linked Suspects */}
        <div className="comparison-section">
          <div className="comparison-section-label">
            👤 Linked Suspects ({theory.linkedSuspects.length})
          </div>
          {theory.linkedSuspects.length === 0 ? (
            <div className="comparison-empty">None</div>
          ) : (
            <div className="comparison-suspects-count">{theory.linkedSuspects.length} suspect(s)</div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render insights panel (for 2-theory comparison)
   */
  const renderInsights = () => {
    if (!comparisonData || !comparisonData.insights) return null;

    return (
      <div className="comparison-insights">
        <h3 className="comparison-insights-title">💡 Comparison Insights</h3>

        <div className="insights-list">
          {comparisonData.insights.map((insight, idx) => (
            <div
              key={idx}
              className={`insight-item insight-${insight.severity}`}
            >
              <div className="insight-icon">
                {insight.severity === 'high' && '🔴'}
                {insight.severity === 'medium' && '🟡'}
                {insight.severity === 'low' && '🟢'}
              </div>
              <div className="insight-message">{insight.message}</div>
            </div>
          ))}
        </div>

        {/* Shared Evidence */}
        {comparisonData.shared.supporting.length > 0 && (
          <div className="insight-detail">
            <div className="insight-detail-label">
              Shared Supporting Evidence ({comparisonData.shared.supporting.length}):
            </div>
            <ul className="insight-detail-list">
              {comparisonData.shared.supporting.map((evidence, idx) => (
                <li key={idx}>🔍 {evidence.evidenceName}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Conflicts */}
        {comparisonData.conflicts.length > 0 && (
          <div className="insight-detail insight-detail-warning">
            <div className="insight-detail-label">
              ⚠️ Conflicting Evidence ({comparisonData.conflicts.length}):
            </div>
            <ul className="insight-detail-list">
              {comparisonData.conflicts.map((conflict, idx) => (
                <li key={idx}>
                  {conflict.evidenceName} - supports one theory but contradicts the other
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render summary stats
   */
  const renderSummaryStats = () => {
    const stats = selectedTheories.map(theory => ({
      theory,
      strength: calculateTheoryStrength(theory),
      supporting: theory.supportingEvidence.length,
      contradicting: theory.contradictingEvidence.length,
      suspects: theory.linkedSuspects.length
    }));

    // Find strongest theory
    const strongest = stats.reduce((max, s) =>
      s.strength > max.strength ? s : max
    , stats[0]);

    // Find most evidence
    const mostEvidence = stats.reduce((max, s) =>
      (s.supporting + s.contradicting) > (max.supporting + max.contradicting) ? s : max
    , stats[0]);

    return (
      <div className="comparison-summary">
        <h4 className="comparison-summary-title">📊 Quick Summary</h4>

        <div className="summary-items">
          <div className="summary-item">
            <div className="summary-label">Strongest Theory:</div>
            <div className="summary-value summary-value-highlight">
              "{strongest.theory.title}" ({strongest.strength}%)
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-label">Most Evidence:</div>
            <div className="summary-value">
              "{mostEvidence.theory.title}" ({mostEvidence.supporting + mostEvidence.contradicting} pieces)
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-label">Theories Being Compared:</div>
            <div className="summary-value">{selectedTheories.length}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="theory-comparison-overlay" onClick={onClose}>
      <div className="theory-comparison-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="theory-comparison-header">
          <h2 className="theory-comparison-title">
            🔄 Theory Comparison ({selectedTheories.length})
          </h2>
          <button
            className="theory-comparison-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="theory-comparison-content">
          {selectedTheories.length < 2 && (
            <div className="comparison-error">
              <div className="comparison-error-icon">⚠️</div>
              <p>Please select at least 2 theories to compare.</p>
              <button className="comparison-error-btn" onClick={onClose}>
                Go Back
              </button>
            </div>
          )}

          {selectedTheories.length > 4 && (
            <div className="comparison-warning">
              <div className="comparison-warning-icon">💡</div>
              <p>Comparing more than 4 theories at once may be difficult. Consider comparing fewer theories for better clarity.</p>
            </div>
          )}

          {selectedTheories.length >= 2 && selectedTheories.length <= 4 && (
            <>
              {/* Summary Stats */}
              {renderSummaryStats()}

              {/* Theory Columns */}
              <div className={`comparison-grid comparison-grid-${selectedTheories.length}`}>
                {selectedTheories.map(theory => renderTheoryColumn(theory))}
              </div>

              {/* Insights (only for 2 theories) */}
              {selectedTheories.length === 2 && renderInsights()}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="theory-comparison-footer">
          <div className="comparison-footer-info">
            💡 Tip: Comparison insights are most detailed when comparing exactly 2 theories.
          </div>
          <button
            className="comparison-footer-btn"
            onClick={onClose}
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheoryComparison;
