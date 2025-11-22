import React, { useState } from 'react';
import './HypothesisList.css';

/**
 * Hypothesis List Component
 * Display, compare, and manage created hypotheses
 */
const HypothesisList = ({
  hypotheses,
  suspects,
  onEdit,
  onDelete,
  onClose
}) => {
  const [selectedHypotheses, setSelectedHypotheses] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // list | comparison

  /**
   * Get suspect name by ID
   */
  const getSuspectName = (suspectId) => {
    const suspect = suspects.find(s => s.id === suspectId);
    return suspect ? suspect.name : 'Unknown';
  };

  /**
   * Toggle hypothesis selection for comparison
   */
  const toggleSelection = (hypoId) => {
    setSelectedHypotheses(prev =>
      prev.includes(hypoId)
        ? prev.filter(id => id !== hypoId)
        : [...prev, hypoId]
    );
  };

  /**
   * Render hypothesis card
   */
  const renderHypothesisCard = (hypothesis) => {
    const isSelected = selectedHypotheses.includes(hypothesis.id);

    return (
      <div key={hypothesis.id} className={`hypothesis-card ${isSelected ? 'selected' : ''}`}>
        <div className="hypothesis-card-header">
          <div className="hypothesis-title">
            <span className="hypothesis-icon">💭</span>
            <strong>{getSuspectName(hypothesis.guiltyParty)}</strong>
          </div>
          <div className="hypothesis-actions">
            <button
              className="hypothesis-action-btn"
              onClick={() => toggleSelection(hypothesis.id)}
              title="Select for comparison"
            >
              {isSelected ? '☑' : '☐'}
            </button>
            <button
              className="hypothesis-action-btn"
              onClick={() => onEdit(hypothesis)}
              title="Edit hypothesis"
            >
              ✏️
            </button>
            <button
              className="hypothesis-action-btn hypothesis-delete"
              onClick={() => onDelete(hypothesis.id)}
              title="Delete hypothesis"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="hypothesis-card-body">
          <div className="hypothesis-field">
            <span className="field-label">MOTIVE:</span>
            <span className="field-value">{hypothesis.motive}</span>
          </div>

          {hypothesis.method && (
            <div className="hypothesis-field">
              <span className="field-label">METHOD:</span>
              <span className="field-value">{hypothesis.method}</span>
            </div>
          )}

          <div className="hypothesis-metrics">
            <div className="metric">
              <span className="metric-label">Confidence:</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${hypothesis.confidence}%`,
                    backgroundColor:
                      hypothesis.confidence >= 75 ? '#27ae60' :
                      hypothesis.confidence >= 50 ? '#f39c12' : '#e74c3c'
                  }}
                />
              </div>
              <span className="metric-value">{hypothesis.confidence}%</span>
            </div>

            <div className="metric">
              <span className="metric-label">Strength:</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${hypothesis.strengthScore}%`,
                    backgroundColor:
                      hypothesis.strengthScore >= 75 ? '#27ae60' :
                      hypothesis.strengthScore >= 50 ? '#f39c12' : '#e74c3c'
                  }}
                />
              </div>
              <span className="metric-value">{hypothesis.strengthScore}/100</span>
            </div>
          </div>

          <div className="hypothesis-meta">
            <span>📊 {hypothesis.supportingEvidence.length} evidence pieces</span>
            <span>📅 {new Date(hypothesis.createdAt).toLocaleDateString()}</span>
          </div>

          {hypothesis.notes && (
            <div className="hypothesis-notes">
              <span className="notes-label">Notes:</span>
              <p>{hypothesis.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render comparison view
   */
  const renderComparison = () => {
    const selected = hypotheses.filter(h => selectedHypotheses.includes(h.id));

    if (selected.length < 2) {
      return (
        <div className="comparison-empty">
          <p>Select 2 or more hypotheses to compare</p>
        </div>
      );
    }

    // Find strongest hypothesis
    const strongest = selected.reduce((max, h) =>
      h.strengthScore > max.strengthScore ? h : max
    , selected[0]);

    const highestConfidence = selected.reduce((max, h) =>
      h.confidence > max.confidence ? h : max
    , selected[0]);

    const mostEvidence = selected.reduce((max, h) =>
      h.supportingEvidence.length > max.supportingEvidence.length ? h : max
    , selected[0]);

    return (
      <>
        {/* Comparison Analysis */}
        <div className="comparison-analysis">
          <h3>📊 Comparison Analysis</h3>
          <div className="analysis-insights">
            <div className="analysis-insight">
              <span className="insight-icon">💪</span>
              <div>
                <strong>Strongest Overall:</strong> {getSuspectName(strongest.guiltyParty)}
                <span className="insight-detail">(Score: {strongest.strengthScore}/100)</span>
              </div>
            </div>
            <div className="analysis-insight">
              <span className="insight-icon">🎯</span>
              <div>
                <strong>Highest Confidence:</strong> {getSuspectName(highestConfidence.guiltyParty)}
                <span className="insight-detail">({highestConfidence.confidence}%)</span>
              </div>
            </div>
            <div className="analysis-insight">
              <span className="insight-icon">🔍</span>
              <div>
                <strong>Most Evidence:</strong> {getSuspectName(mostEvidence.guiltyParty)}
                <span className="insight-detail">({mostEvidence.supportingEvidence.length} pieces)</span>
              </div>
            </div>
          </div>
          {strongest.id === highestConfidence.id && strongest.id === mostEvidence.id && (
            <div className="comparison-recommendation">
              ✓ <strong>Recommendation:</strong> {getSuspectName(strongest.guiltyParty)} has the strongest case across all metrics.
            </div>
          )}
        </div>

        {/* Side-by-side Comparison */}
        <div className="comparison-grid">
          {selected.map(hypothesis => {
            const isStrongest = hypothesis.id === strongest.id;
            const hasHighestConfidence = hypothesis.id === highestConfidence.id;
            const hasMostEvidence = hypothesis.id === mostEvidence.id;

            return (
              <div
                key={hypothesis.id}
                className={`comparison-column ${isStrongest ? 'strongest' : ''}`}
              >
                <h4>
                  {getSuspectName(hypothesis.guiltyParty)}
                  {isStrongest && <span className="badge-strongest">⭐ Strongest</span>}
                </h4>

                <div className="comparison-field">
                  <strong>Motive:</strong>
                  <p>{hypothesis.motive}</p>
                </div>

                <div className="comparison-field">
                  <strong>Method:</strong>
                  <p>{hypothesis.method || 'Not specified'}</p>
                </div>

                <div className="comparison-field">
                  <strong>Confidence:</strong>
                  <p className={hasHighestConfidence ? 'highlight-value' : ''}>
                    {hypothesis.confidence}%
                    {hasHighestConfidence && ' 🔝'}
                  </p>
                </div>

                <div className="comparison-field">
                  <strong>Strength:</strong>
                  <p className={isStrongest ? 'highlight-value' : ''}>
                    {hypothesis.strengthScore}/100
                    {isStrongest && ' 🔥'}
                  </p>
                </div>

                <div className="comparison-field">
                  <strong>Evidence:</strong>
                  <p className={hasMostEvidence ? 'highlight-value' : ''}>
                    {hypothesis.supportingEvidence.length} pieces
                    {hasMostEvidence && ' 📚'}
                  </p>
                </div>

                {/* Evidence Quality Indicator */}
                <div className="comparison-field">
                  <strong>Evidence Quality:</strong>
                  <div className="quality-bar">
                    <div
                      className="quality-fill"
                      style={{
                        width: `${hypothesis.strengthScore}%`,
                        background: hypothesis.strengthScore >= 75 ? '#27ae60' :
                                   hypothesis.strengthScore >= 50 ? '#f39c12' : '#e74c3c'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="hypothesis-list-overlay" onClick={onClose}>
      <div className="hypothesis-list-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hypothesis-list-header">
          <h2>💭 HYPOTHESES ({hypotheses.length})</h2>
          <div className="header-controls">
            <button
              className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List
            </button>
            <button
              className={`view-toggle ${viewMode === 'comparison' ? 'active' : ''}`}
              onClick={() => setViewMode('comparison')}
              disabled={selectedHypotheses.length < 2}
            >
              🔀 Compare ({selectedHypotheses.length})
            </button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="hypothesis-list-content">
          {hypotheses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💭</div>
              <p>No hypotheses created yet</p>
              <p className="empty-hint">Build your theories on the evidence board</p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="hypotheses-grid">
              {hypotheses.map(renderHypothesisCard)}
            </div>
          ) : (
            renderComparison()
          )}
        </div>
      </div>
    </div>
  );
};

export default HypothesisList;
