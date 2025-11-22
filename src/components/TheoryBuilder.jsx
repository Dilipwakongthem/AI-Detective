import React, { useState, useEffect } from 'react';
import {
  addTheory,
  updateTheory,
  getTheoryById,
  linkEvidence,
  unlinkEvidence
} from '../utils/theoryManager';
import './TheoryBuilder.css';

/**
 * Theory Builder Component
 * Allows players to build structured theories with evidence support
 */
const TheoryBuilder = ({
  caseId,
  caseData,
  theoryId = null, // If editing existing theory
  onClose,
  onSave,
  showNotification
}) => {
  // Theory data state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [supportingEvidence, setSupportingEvidence] = useState([]);
  const [contradictingEvidence, setContradictingEvidence] = useState([]);
  const [linkedSuspects, setLinkedSuspects] = useState([]);
  const [linkedNotes, setLinkedNotes] = useState([]);
  const [tags, setTags] = useState(['working']);
  const [color, setColor] = useState('default');

  // UI state
  const [showEvidenceSelector, setShowEvidenceSelector] = useState(false);
  const [evidenceSelectorMode, setEvidenceSelectorMode] = useState('supporting'); // 'supporting' or 'contradicting'
  const [activeSection, setActiveSection] = useState('basic'); // 'basic', 'supporting', 'contradicting', 'links'

  // Evidence selector state
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [relevanceNote, setRelevanceNote] = useState('');
  const [weight, setWeight] = useState(2);

  const isEditing = theoryId !== null;

  /**
   * Load theory data if editing
   */
  useEffect(() => {
    if (theoryId) {
      const theory = getTheoryById(theoryId);
      if (theory) {
        setTitle(theory.title);
        setDescription(theory.description);
        setConfidence(theory.confidence);
        setSupportingEvidence(theory.supportingEvidence);
        setContradictingEvidence(theory.contradictingEvidence);
        setLinkedSuspects(theory.linkedSuspects);
        setLinkedNotes(theory.linkedNotes);
        setTags(theory.tags);
        setColor(theory.color);
      }
    }
  }, [theoryId]);

  /**
   * Handle save theory
   */
  const handleSave = () => {
    if (!title.trim()) {
      showNotification('Theory title is required', 'error');
      return;
    }

    const theoryData = {
      title: title.trim(),
      description: description.trim(),
      confidence,
      supportingEvidence,
      contradictingEvidence,
      linkedSuspects,
      linkedNotes,
      tags,
      color
    };

    if (isEditing) {
      // Update existing theory
      const success = updateTheory(theoryId, theoryData);
      if (success) {
        showNotification('✅ Theory updated successfully!', 'success');
        onSave && onSave();
        onClose();
      } else {
        showNotification('Failed to update theory', 'error');
      }
    } else {
      // Create new theory
      const theory = addTheory(caseId, theoryData);
      if (theory) {
        showNotification('✅ Theory created successfully!', 'success');
        onSave && onSave();
        onClose();
      } else {
        showNotification('Failed to create theory', 'error');
      }
    }
  };

  /**
   * Handle add evidence
   */
  const handleAddEvidence = (evidence, noteText, weightValue, isSupporting) => {
    const evidenceLink = {
      evidenceId: evidence.id,
      evidenceName: evidence.type,
      note: noteText,
      weight: weightValue,
      addedAt: new Date().toISOString()
    };

    if (isSupporting) {
      // Check if already exists
      if (!supportingEvidence.some(e => e.evidenceId === evidence.id)) {
        setSupportingEvidence([...supportingEvidence, evidenceLink]);
      }
    } else {
      const contradictionLink = {
        ...evidenceLink,
        severity: weightValue // Reuse weight as severity
      };

      if (!contradictingEvidence.some(e => e.evidenceId === evidence.id)) {
        setContradictingEvidence([...contradictingEvidence, contradictionLink]);
      }
    }

    // Reset selector state
    setShowEvidenceSelector(false);
    setSelectedEvidence(null);
    setRelevanceNote('');
    setWeight(2);
  };

  /**
   * Handle remove evidence
   */
  const handleRemoveEvidence = (evidenceId, isSupporting) => {
    if (isSupporting) {
      setSupportingEvidence(supportingEvidence.filter(e => e.evidenceId !== evidenceId));
    } else {
      setContradictingEvidence(contradictingEvidence.filter(e => e.evidenceId !== evidenceId));
    }
  };

  /**
   * Handle toggle suspect
   */
  const handleToggleSuspect = (suspectId) => {
    if (linkedSuspects.includes(suspectId)) {
      setLinkedSuspects(linkedSuspects.filter(id => id !== suspectId));
    } else {
      setLinkedSuspects([...linkedSuspects, suspectId]);
    }
  };

  /**
   * Handle toggle tag
   */
  const handleToggleTag = (tag) => {
    if (tags.includes(tag)) {
      // Don't allow removing last tag
      if (tags.length > 1) {
        setTags(tags.filter(t => t !== tag));
      }
    } else {
      setTags([...tags, tag]);
    }
  };

  /**
   * Render confidence stars
   */
  const renderConfidenceStars = () => {
    return (
      <div className="confidence-selector">
        {[1, 2, 3, 4, 5].map(level => (
          <button
            key={level}
            className={`confidence-star ${confidence >= level ? 'active' : ''}`}
            onClick={() => setConfidence(level)}
            title={`Confidence: ${level}/5`}
          >
            {confidence >= level ? '⭐' : '☆'}
          </button>
        ))}
        <span className="confidence-label">
          {confidence === 1 && 'Very Weak'}
          {confidence === 2 && 'Weak'}
          {confidence === 3 && 'Moderate'}
          {confidence === 4 && 'Strong'}
          {confidence === 5 && 'Very Strong'}
        </span>
      </div>
    );
  };

  /**
   * Render supporting evidence list
   */
  const renderSupportingEvidence = () => {
    return (
      <div className="evidence-section">
        <div className="evidence-section-header">
          <h4>✅ Supporting Evidence ({supportingEvidence.length})</h4>
          <button
            className="add-evidence-btn"
            onClick={() => {
              setEvidenceSelectorMode('supporting');
              setShowEvidenceSelector(true);
            }}
          >
            + Add Evidence
          </button>
        </div>

        {supportingEvidence.length === 0 ? (
          <div className="evidence-empty">
            <p>No supporting evidence yet. Add evidence that supports this theory.</p>
          </div>
        ) : (
          <div className="evidence-list">
            {supportingEvidence.map((evidence, index) => (
              <div key={evidence.evidenceId} className="evidence-item evidence-supporting">
                <div className="evidence-item-header">
                  <span className="evidence-item-name">
                    🔍 {evidence.evidenceName}
                  </span>
                  <div className="evidence-item-actions">
                    <span className="evidence-weight">
                      {evidence.weight === 3 && '⭐⭐⭐ Critical'}
                      {evidence.weight === 2 && '⭐⭐ Moderate'}
                      {evidence.weight === 1 && '⭐ Minor'}
                    </span>
                    <button
                      className="remove-evidence-btn"
                      onClick={() => handleRemoveEvidence(evidence.evidenceId, true)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {evidence.note && (
                  <div className="evidence-item-note">
                    "{evidence.note}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render contradicting evidence list
   */
  const renderContradictingEvidence = () => {
    return (
      <div className="evidence-section">
        <div className="evidence-section-header">
          <h4>⚠️ Contradicting Evidence ({contradictingEvidence.length})</h4>
          <button
            className="add-evidence-btn add-evidence-btn-warning"
            onClick={() => {
              setEvidenceSelectorMode('contradicting');
              setShowEvidenceSelector(true);
            }}
          >
            + Add Contradiction
          </button>
        </div>

        {contradictingEvidence.length === 0 ? (
          <div className="evidence-empty">
            <p>No contradictions found. Add evidence that challenges this theory.</p>
          </div>
        ) : (
          <div className="evidence-list">
            {contradictingEvidence.map((evidence, index) => (
              <div key={evidence.evidenceId} className="evidence-item evidence-contradicting">
                <div className="evidence-item-header">
                  <span className="evidence-item-name">
                    ⚠️ {evidence.evidenceName}
                  </span>
                  <div className="evidence-item-actions">
                    <span className="evidence-severity">
                      {evidence.severity === 3 && '🔴 High Severity'}
                      {evidence.severity === 2 && '🟡 Medium Severity'}
                      {evidence.severity === 1 && '🟢 Low Severity'}
                    </span>
                    <button
                      className="remove-evidence-btn"
                      onClick={() => handleRemoveEvidence(evidence.evidenceId, false)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {evidence.note && (
                  <div className="evidence-item-note">
                    "{evidence.note}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render linked suspects
   */
  const renderLinkedSuspects = () => {
    return (
      <div className="links-section">
        <h4>👤 Linked Suspects</h4>
        <div className="suspect-checkboxes">
          {caseData.suspects.map(suspect => (
            <label key={suspect.id} className="suspect-checkbox-label">
              <input
                type="checkbox"
                checked={linkedSuspects.includes(suspect.id)}
                onChange={() => handleToggleSuspect(suspect.id)}
              />
              <span>👤 {suspect.name} - {suspect.occupation}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render evidence selector modal
   */
  const renderEvidenceSelector = () => {
    if (!showEvidenceSelector) return null;

    const isSupporting = evidenceSelectorMode === 'supporting';
    const alreadyLinked = isSupporting
      ? supportingEvidence.map(e => e.evidenceId)
      : contradictingEvidence.map(e => e.evidenceId);

    const availableEvidence = caseData.evidence.filter(e =>
      e.discovered && !alreadyLinked.includes(e.id)
    );

    return (
      <div className="evidence-selector-modal">
        <div className="evidence-selector">
          <div className="evidence-selector-header">
            <h3>
              {isSupporting ? '✅ Add Supporting Evidence' : '⚠️ Add Contradicting Evidence'}
            </h3>
            <button
              className="evidence-selector-close"
              onClick={() => {
                setShowEvidenceSelector(false);
                setSelectedEvidence(null);
                setRelevanceNote('');
                setWeight(2);
              }}
            >
              ✕
            </button>
          </div>

          <div className="evidence-selector-content">
            {/* Evidence list */}
            <div className="evidence-selector-list">
              <h4>Available Evidence:</h4>
              {availableEvidence.length === 0 ? (
                <p>No more evidence available to link.</p>
              ) : (
                <div className="evidence-options">
                  {availableEvidence.map(evidence => (
                    <div
                      key={evidence.id}
                      className={`evidence-option ${selectedEvidence?.id === evidence.id ? 'selected' : ''}`}
                      onClick={() => setSelectedEvidence(evidence)}
                    >
                      <div className="evidence-option-icon">🔍</div>
                      <div className="evidence-option-info">
                        <div className="evidence-option-type">{evidence.type}</div>
                        <div className="evidence-option-location">{evidence.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Evidence details form */}
            {selectedEvidence && (
              <div className="evidence-selector-form">
                <h4>Selected: {selectedEvidence.type}</h4>

                <label className="form-label">
                  {isSupporting ? 'How does this support your theory?' : 'How does this contradict your theory?'}
                </label>
                <textarea
                  className="form-textarea"
                  value={relevanceNote}
                  onChange={(e) => setRelevanceNote(e.target.value)}
                  placeholder={isSupporting
                    ? "Explain relevance..."
                    : "Explain the contradiction..."}
                  rows={3}
                />

                <label className="form-label">
                  {isSupporting ? 'Weight:' : 'Severity:'}
                </label>
                <div className="weight-selector">
                  <label>
                    <input
                      type="radio"
                      value={1}
                      checked={weight === 1}
                      onChange={() => setWeight(1)}
                    />
                    <span>{isSupporting ? '⭐ Minor' : '🟢 Low'}</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      value={2}
                      checked={weight === 2}
                      onChange={() => setWeight(2)}
                    />
                    <span>{isSupporting ? '⭐⭐ Moderate' : '🟡 Medium'}</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      value={3}
                      checked={weight === 3}
                      onChange={() => setWeight(3)}
                    />
                    <span>{isSupporting ? '⭐⭐⭐ Critical' : '🔴 High'}</span>
                  </label>
                </div>

                <button
                  className="evidence-selector-add-btn"
                  onClick={() => handleAddEvidence(selectedEvidence, relevanceNote, weight, isSupporting)}
                >
                  {isSupporting ? 'Add to Supporting Evidence' : 'Add to Contradicting Evidence'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="theory-builder-overlay" onClick={onClose}>
      <div className="theory-builder" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="theory-builder-header">
          <h2>📘 {isEditing ? 'Edit Theory' : 'Build New Theory'}</h2>
          <button className="theory-builder-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="theory-builder-content">
          {/* Basic Info Section */}
          <div className="theory-section">
            <div className="form-group">
              <label className="form-label">Theory Title *</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your theory a descriptive title..."
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your theory in detail..."
                rows={4}
                maxLength={1000}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confidence Level</label>
              {renderConfidenceStars()}
            </div>
          </div>

          {/* Supporting Evidence */}
          {renderSupportingEvidence()}

          {/* Contradicting Evidence */}
          {renderContradictingEvidence()}

          {/* Linked Suspects */}
          {renderLinkedSuspects()}

          {/* Tags */}
          <div className="theory-section">
            <h4>Tags</h4>
            <div className="tag-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={tags.includes('working')}
                  onChange={() => handleToggleTag('working')}
                />
                <span>🔄 Working</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={tags.includes('primary')}
                  onChange={() => handleToggleTag('primary')}
                />
                <span>⭐ Primary</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={tags.includes('discarded')}
                  onChange={() => handleToggleTag('discarded')}
                />
                <span>🗑️ Discarded</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="theory-builder-footer">
          <button
            className="theory-btn theory-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="theory-btn theory-btn-primary"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            {isEditing ? 'Save Changes' : 'Create Theory'}
          </button>
        </div>

        {/* Evidence Selector Modal */}
        {renderEvidenceSelector()}
      </div>
    </div>
  );
};

export default TheoryBuilder;
