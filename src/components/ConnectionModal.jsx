import React, { useState } from 'react';
import './ConnectionModal.css';

/**
 * Connection Modal Component
 * Edit connection properties (type, strength, notes)
 */
const ConnectionModal = ({ connection, onSave, onClose }) => {
  const [connectionType, setConnectionType] = useState(connection.type || 'physical_evidence');
  const [strength, setStrength] = useState(connection.strength || 3);
  const [notes, setNotes] = useState(connection.notes || '');

  const handleSave = () => {
    const updatedConnection = {
      ...connection,
      type: connectionType,
      strength,
      notes
    };

    onSave(updatedConnection);
  };

  return (
    <div className="connection-modal-overlay" onClick={onClose}>
      <div className="connection-modal" onClick={(e) => e.stopPropagation()}>
        <div className="connection-modal-header">
          <h3>🔗 Connection Properties</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="connection-modal-content">
          {/* Connection Type */}
          <div className="modal-form-group">
            <label className="modal-label">CONNECTION TYPE:</label>
            <select
              className="modal-select"
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value)}
            >
              <option value="physical_evidence">🔍 Physical Evidence</option>
              <option value="witness">👁️ Witness Statement</option>
              <option value="alibi">⏰ Alibi</option>
              <option value="motive">💰 Motive</option>
              <option value="contradiction">⚠️ Contradiction</option>
            </select>
          </div>

          {/* Connection Strength */}
          <div className="modal-form-group">
            <label className="modal-label">
              STRENGTH: <span className="strength-value">{strength}/5</span>
            </label>
            <div className="strength-slider-container">
              <span>Weak</span>
              <input
                type="range"
                min="1"
                max="5"
                value={strength}
                onChange={(e) => setStrength(parseInt(e.target.value))}
                className="strength-slider"
              />
              <span>Strong</span>
            </div>
            <div className="strength-indicators">
              {[1, 2, 3, 4, 5].map(level => (
                <div
                  key={level}
                  className={`strength-indicator ${strength >= level ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="modal-form-group">
            <label className="modal-label">NOTES (Why this connection?):</label>
            <textarea
              className="modal-textarea"
              placeholder="Describe why you think these are connected..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="char-counter">{notes.length}/500</div>
          </div>

          {/* Connection Description */}
          <div className="connection-description">
            <strong>This connection indicates:</strong>
            <p className="connection-type-desc">
              {connectionType === 'physical_evidence' && 'Physical evidence directly links this suspect to the crime.'}
              {connectionType === 'witness' && 'Witness testimony connects this person to the evidence.'}
              {connectionType === 'alibi' && 'This evidence relates to the suspect\'s alibi.'}
              {connectionType === 'motive' && 'This evidence reveals a potential motive.'}
              {connectionType === 'contradiction' && 'This evidence contradicts previous statements.'}
            </p>
          </div>
        </div>

        <div className="connection-modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>
            CANCEL
          </button>
          <button
            className="modal-btn modal-btn-save"
            onClick={handleSave}
          >
            SAVE CONNECTION
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;
