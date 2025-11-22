import React, { useState, useEffect } from 'react';
import './CardNotesModal.css';

/**
 * Card Notes Modal - Add annotations and observations to evidence cards
 */
const CardNotesModal = ({ card, onSave, onClose }) => {
  const [notes, setNotes] = useState(card.notes || '');
  const [observations, setObservations] = useState(card.observations || []);
  const [newObservation, setNewObservation] = useState('');

  const handleSave = () => {
    onSave({
      ...card,
      notes,
      observations,
      lastEdited: new Date().toISOString()
    });
    onClose();
  };

  const handleAddObservation = () => {
    if (newObservation.trim()) {
      setObservations([...observations, {
        id: Date.now(),
        text: newObservation,
        timestamp: new Date().toISOString()
      }]);
      setNewObservation('');
    }
  };

  const handleRemoveObservation = (id) => {
    setObservations(observations.filter(obs => obs.id !== id));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCardTitle = () => {
    if (card.type === 'evidence') {
      return card.data.type || 'Evidence';
    } else if (card.type === 'suspect') {
      return card.data.name || 'Suspect';
    }
    return 'Unknown';
  };

  return (
    <div className="card-notes-overlay" onClick={onClose}>
      <div className="card-notes-modal" onClick={(e) => e.stopPropagation()}>
        <div className="card-notes-header">
          <h3>📝 Notes: {getCardTitle()}</h3>
          <button className="notes-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="card-notes-content">
          {/* Main Notes Section */}
          <div className="notes-section">
            <label className="notes-label">
              <span>🗒️ General Notes</span>
              <span className="notes-hint">Your thoughts and analysis</span>
            </label>
            <textarea
              className="notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your observations, theories, questions..."
              rows="6"
            />
          </div>

          {/* Quick Observations */}
          <div className="observations-section">
            <label className="notes-label">
              <span>💡 Quick Observations</span>
              <span className="notes-hint">Bullet points and hunches</span>
            </label>

            <div className="observations-input">
              <input
                type="text"
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddObservation()}
                placeholder="Add a quick observation..."
                className="observation-input"
              />
              <button
                className="add-observation-btn"
                onClick={handleAddObservation}
                disabled={!newObservation.trim()}
              >
                + Add
              </button>
            </div>

            {observations.length > 0 && (
              <div className="observations-list">
                {observations.map(obs => (
                  <div key={obs.id} className="observation-item">
                    <span className="observation-bullet">•</span>
                    <span className="observation-text">{obs.text}</span>
                    <span className="observation-time">{formatTimestamp(obs.timestamp)}</span>
                    <button
                      className="remove-observation-btn"
                      onClick={() => handleRemoveObservation(obs.id)}
                      title="Remove observation"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evidence Details */}
          {card.type === 'evidence' && (
            <div className="evidence-details-section">
              <label className="notes-label">📋 Evidence Details</label>
              <div className="evidence-info">
                <p><strong>Type:</strong> {card.data.type}</p>
                <p><strong>Location:</strong> {card.data.location}</p>
                {card.data.description && (
                  <p><strong>Description:</strong> {card.data.description}</p>
                )}
                {card.data.critical && (
                  <p className="critical-indicator">⭐ Critical Evidence</p>
                )}
              </div>
            </div>
          )}

          {/* Suspect Details */}
          {card.type === 'suspect' && (
            <div className="suspect-details-section">
              <label className="notes-label">👤 Suspect Details</label>
              <div className="suspect-info">
                <p><strong>Name:</strong> {card.data.name}</p>
                <p><strong>Occupation:</strong> {card.data.occupation}</p>
                <p><strong>Age:</strong> {card.data.age}</p>
                {card.data.questioned && (
                  <p><strong>Nervousness:</strong> {card.data.nervousness}%</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card-notes-footer">
          <div className="notes-stats">
            {notes && <span>📝 {notes.split(/\s+/).filter(w => w).length} words</span>}
            {observations.length > 0 && <span>💡 {observations.length} observations</span>}
          </div>
          <div className="notes-actions">
            <button className="notes-btn notes-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="notes-btn notes-btn-primary" onClick={handleSave}>
              💾 Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNotesModal;
