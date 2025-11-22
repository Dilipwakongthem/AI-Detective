import React, { useState } from 'react';
import './HypothesisBuilder.css';

/**
 * Hypothesis Builder Component
 * Create and manage theories about the case
 */
const HypothesisBuilder = ({
  boardCards,
  connections,
  suspects,
  onSave,
  onClose
}) => {
  const [guiltyParty, setGuiltyParty] = useState('');
  const [motive, setMotive] = useState('');
  const [method, setMethod] = useState('');
  const [confidence, setConfidence] = useState(50);
  const [supportingEvidence, setSupportingEvidence] = useState([]);
  const [notes, setNotes] = useState('');

  // Get evidence cards on board
  const evidenceCards = boardCards.filter(c => c.type === 'evidence');

  // Calculate hypothesis strength score
  const calculateStrength = () => {
    let score = 0;

    // Evidence quantity (20 points max)
    const evidenceScore = Math.min((supportingEvidence.length / 5) * 20, 20);
    score += evidenceScore;

    // Motive clarity (20 points max)
    const motiveScore = motive.trim().length > 20 ? 20 : (motive.trim().length / 20) * 20;
    score += motiveScore;

    // Connections involving guilty party (30 points max)
    const guiltyCard = boardCards.find(c => c.type === 'suspect' && c.data.id === parseInt(guiltyParty));
    if (guiltyCard) {
      const relevantConnections = connections.filter(
        conn => conn.source === guiltyCard.id || conn.target === guiltyCard.id
      );
      const connectionScore = Math.min((relevantConnections.length / 5) * 30, 30);
      score += connectionScore;
    }

    // Method specified (10 points)
    if (method.trim().length > 0) {
      score += 10;
    }

    // Supporting evidence (20 points max)
    if (supportingEvidence.length > 0) {
      score += Math.min((supportingEvidence.length / 3) * 20, 20);
    }

    return Math.round(score);
  };

  const strengthScore = calculateStrength();

  const handleToggleEvidence = (cardId) => {
    setSupportingEvidence(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSave = () => {
    if (!guiltyParty) {
      alert('Please select a guilty party');
      return;
    }

    if (!motive.trim()) {
      alert('Please provide a motive');
      return;
    }

    const hypothesis = {
      id: `hypo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      guiltyParty: parseInt(guiltyParty),
      motive: motive.trim(),
      method: method.trim(),
      confidence,
      supportingEvidence,
      notes: notes.trim(),
      strengthScore,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    onSave(hypothesis);
  };

  return (
    <div className="hypothesis-modal-overlay" onClick={onClose}>
      <div className="hypothesis-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hypothesis-modal-header">
          <h2>💭 BUILD HYPOTHESIS</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="hypothesis-modal-content">
          {/* Guilty Party Selection */}
          <div className="hypothesis-form-group">
            <label className="hypothesis-label">WHO IS GUILTY? *</label>
            <select
              className="hypothesis-select"
              value={guiltyParty}
              onChange={(e) => setGuiltyParty(e.target.value)}
            >
              <option value="">-- Select Suspect --</option>
              {suspects.map(suspect => (
                <option key={suspect.id} value={suspect.id}>
                  {suspect.name} ({suspect.occupation})
                </option>
              ))}
            </select>
          </div>

          {/* Motive */}
          <div className="hypothesis-form-group">
            <label className="hypothesis-label">MOTIVE: *</label>
            <textarea
              className="hypothesis-textarea"
              placeholder="Why did they do it? (e.g., Financial gain, revenge, jealousy...)"
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <div className="char-counter">{motive.length}/200</div>
          </div>

          {/* Method */}
          <div className="hypothesis-form-group">
            <label className="hypothesis-label">METHOD/WEAPON:</label>
            <input
              type="text"
              className="hypothesis-input"
              placeholder="How was the crime committed?"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Confidence Slider */}
          <div className="hypothesis-form-group">
            <label className="hypothesis-label">
              YOUR CONFIDENCE: <span className="confidence-value">{confidence}%</span>
            </label>
            <div className="confidence-slider-container">
              <span>Uncertain</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="confidence-slider"
              />
              <span>Certain</span>
            </div>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{
                  width: `${confidence}%`,
                  backgroundColor:
                    confidence >= 75 ? '#27ae60' :
                    confidence >= 50 ? '#f39c12' :
                    confidence >= 25 ? '#e67e22' : '#e74c3c'
                }}
              />
            </div>
          </div>

          {/* Supporting Evidence */}
          <div className="hypothesis-form-group">
            <label className="hypothesis-label">
              SUPPORTING EVIDENCE: ({supportingEvidence.length} selected)
            </label>
            <div className="evidence-checklist">
              {evidenceCards.length === 0 ? (
                <p className="no-evidence-msg">No evidence on board yet</p>
              ) : (
                evidenceCards.map(card => (
                  <label key={card.id} className="evidence-checkbox-label">
                    <input
                      type="checkbox"
                      checked={supportingEvidence.includes(card.id)}
                      onChange={() => handleToggleEvidence(card.id)}
                    />
                    <span>🔍 {card.data.type} - {card.data.location}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="hypothesis-form-group">
            <label className="hypothesis-label">THEORY NOTES (Optional):</label>
            <textarea
              className="hypothesis-textarea"
              placeholder="Additional thoughts, timeline reconstruction, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="char-counter">{notes.length}/500</div>
          </div>

          {/* Hypothesis Strength Meter */}
          <div className="hypothesis-strength">
            <h4>Hypothesis Strength: {strengthScore}/100</h4>
            <div className="strength-bar">
              <div
                className="strength-fill"
                style={{
                  width: `${strengthScore}%`,
                  backgroundColor:
                    strengthScore >= 75 ? '#27ae60' :
                    strengthScore >= 50 ? '#f39c12' : '#e74c3c'
                }}
              />
            </div>
            <p className="strength-hint">
              {strengthScore >= 75 && '✓ Strong hypothesis - well-supported by evidence'}
              {strengthScore >= 50 && strengthScore < 75 && '~ Moderate hypothesis - needs more evidence'}
              {strengthScore < 50 && '⚠ Weak hypothesis - gather more evidence and connections'}
            </p>
          </div>
        </div>

        <div className="hypothesis-modal-footer">
          <button className="hypothesis-btn hypothesis-btn-cancel" onClick={onClose}>
            CANCEL
          </button>
          <button
            className="hypothesis-btn hypothesis-btn-save"
            onClick={handleSave}
            disabled={!guiltyParty || !motive.trim()}
          >
            SAVE HYPOTHESIS
          </button>
        </div>
      </div>
    </div>
  );
};

export default HypothesisBuilder;
