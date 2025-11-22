import React, { useState, useEffect } from 'react';
import {
  createEvent,
  updateEvent,
  EVENT_TYPES,
  TIME_PRECISION,
  VERIFICATION_STATUS
} from '../utils/timelineManager';
import './EventEditor.css';

/**
 * Event Editor Component
 * Modal form for creating and editing timeline events
 */
const EventEditor = ({
  caseId,
  event,
  evidence,
  suspects,
  onSave,
  onClose
}) => {
  // Basic fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState(EVENT_TYPES.INFERRED);
  const [timePrecision, setTimePrecision] = useState(TIME_PRECISION.EXACT);
  const [location, setLocation] = useState('');
  const [source, setSource] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(VERIFICATION_STATUS.UNVERIFIED);

  // Time fields
  const [timestamp, setTimestamp] = useState('');
  const [timeRangeStart, setTimeRangeStart] = useState('');
  const [timeRangeEnd, setTimeRangeEnd] = useState('');

  // Linked items
  const [linkedEvidence, setLinkedEvidence] = useState([]);
  const [linkedSuspects, setLinkedSuspects] = useState([]);

  // UI state
  const [showEvidenceSelector, setShowEvidenceSelector] = useState(false);
  const [showSuspectSelector, setShowSuspectSelector] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Initialize form with event data (for editing)
   */
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setEventType(event.eventType || EVENT_TYPES.INFERRED);
      setTimePrecision(event.timePrecision || TIME_PRECISION.EXACT);
      setLocation(event.location || '');
      setSource(event.source || '');
      setVerificationStatus(event.verificationStatus || VERIFICATION_STATUS.UNVERIFIED);
      setTimestamp(event.timestamp || '');
      setTimeRangeStart(event.timeRangeStart || '');
      setTimeRangeEnd(event.timeRangeEnd || '');
      setLinkedEvidence(event.linkedEvidence || []);
      setLinkedSuspects(event.linkedSuspects || []);
    }
  }, [event]);

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (timePrecision === TIME_PRECISION.RANGE) {
      if (!timeRangeStart) {
        newErrors.timeRangeStart = 'Start time is required for time ranges';
      }
      if (!timeRangeEnd) {
        newErrors.timeRangeEnd = 'End time is required for time ranges';
      }
      if (timeRangeStart && timeRangeEnd && new Date(timeRangeStart) >= new Date(timeRangeEnd)) {
        newErrors.timeRange = 'Start time must be before end time';
      }
    } else {
      if (!timestamp) {
        newErrors.timestamp = 'Time is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      eventType,
      timePrecision,
      timestamp: timePrecision === TIME_PRECISION.RANGE ? null : timestamp,
      timeRangeStart: timePrecision === TIME_PRECISION.RANGE ? timeRangeStart : null,
      timeRangeEnd: timePrecision === TIME_PRECISION.RANGE ? timeRangeEnd : null,
      location: location.trim(),
      source: source.trim(),
      verificationStatus,
      linkedEvidence,
      linkedSuspects
    };

    if (event) {
      // Update existing event
      const updatedEvent = updateEvent(caseId, event.id, eventData);
      onSave(updatedEvent);
    } else {
      // Create new event
      const newEvent = createEvent(caseId, eventData);
      onSave(newEvent);
    }

    onClose();
  };

  /**
   * Handle add evidence
   */
  const handleAddEvidence = (evidenceItem) => {
    if (!linkedEvidence.find(e => e.evidenceId === evidenceItem.id)) {
      const evidenceLink = {
        evidenceId: evidenceItem.id,
        evidenceName: evidenceItem.type,
        note: ''
      };
      setLinkedEvidence([...linkedEvidence, evidenceLink]);
    }
    setShowEvidenceSelector(false);
  };

  /**
   * Handle remove evidence
   */
  const handleRemoveEvidence = (evidenceId) => {
    setLinkedEvidence(linkedEvidence.filter(e => e.evidenceId !== evidenceId));
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
   * Get event type info
   */
  const getEventTypeInfo = (type) => {
    switch (type) {
      case EVENT_TYPES.ESTABLISHED:
        return { icon: '✅', label: 'Established Fact', color: '#27ae60' };
      case EVENT_TYPES.SUSPECT_CLAIM:
        return { icon: '💬', label: 'Suspect Claim', color: '#3498db' };
      case EVENT_TYPES.EVIDENCE_BASED:
        return { icon: '🔍', label: 'Evidence-Based', color: '#f39c12' };
      case EVENT_TYPES.INFERRED:
        return { icon: '💡', label: 'Player Inference', color: '#9b59b6' };
      default:
        return { icon: '📌', label: 'Unknown', color: '#7f8c8d' };
    }
  };

  /**
   * Render evidence selector modal
   */
  const renderEvidenceSelector = () => {
    if (!showEvidenceSelector || !evidence) return null;

    const availableEvidence = evidence.filter(e =>
      !linkedEvidence.find(le => le.evidenceId === e.id)
    );

    return (
      <div className="event-selector-overlay" onClick={() => setShowEvidenceSelector(false)}>
        <div className="event-selector-modal" onClick={(e) => e.stopPropagation()}>
          <div className="event-selector-header">
            <h3>Select Evidence</h3>
            <button
              className="event-selector-close"
              onClick={() => setShowEvidenceSelector(false)}
            >
              ✕
            </button>
          </div>

          <div className="event-selector-content">
            {availableEvidence.length === 0 ? (
              <div className="event-selector-empty">
                <p>No available evidence to link</p>
              </div>
            ) : (
              <div className="event-selector-list">
                {availableEvidence.map(evidenceItem => (
                  <div
                    key={evidenceItem.id}
                    className="event-selector-item"
                    onClick={() => handleAddEvidence(evidenceItem)}
                  >
                    <div className="event-selector-item-icon">🔍</div>
                    <div className="event-selector-item-info">
                      <div className="event-selector-item-name">{evidenceItem.type}</div>
                      {evidenceItem.description && (
                        <div className="event-selector-item-desc">
                          {evidenceItem.description.substring(0, 100)}
                          {evidenceItem.description.length > 100 ? '...' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render suspect selector modal
   */
  const renderSuspectSelector = () => {
    if (!showSuspectSelector || !suspects) return null;

    return (
      <div className="event-selector-overlay" onClick={() => setShowSuspectSelector(false)}>
        <div className="event-selector-modal" onClick={(e) => e.stopPropagation()}>
          <div className="event-selector-header">
            <h3>Link Suspects</h3>
            <button
              className="event-selector-close"
              onClick={() => setShowSuspectSelector(false)}
            >
              ✕
            </button>
          </div>

          <div className="event-selector-content">
            {suspects.length === 0 ? (
              <div className="event-selector-empty">
                <p>No suspects available</p>
              </div>
            ) : (
              <div className="event-selector-list">
                {suspects.map(suspect => (
                  <div
                    key={suspect.id}
                    className={`event-selector-item ${
                      linkedSuspects.includes(suspect.id) ? 'event-selector-item-selected' : ''
                    }`}
                    onClick={() => handleToggleSuspect(suspect.id)}
                  >
                    <div className="event-selector-item-icon">
                      {linkedSuspects.includes(suspect.id) ? '✓' : '👤'}
                    </div>
                    <div className="event-selector-item-info">
                      <div className="event-selector-item-name">{suspect.name}</div>
                      <div className="event-selector-item-desc">{suspect.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="event-selector-footer">
            <button
              className="event-selector-done-btn"
              onClick={() => setShowSuspectSelector(false)}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="event-editor-overlay" onClick={onClose}>
        <div className="event-editor-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="event-editor-header">
            <h2 className="event-editor-title">
              {event ? '✏️ Edit Event' : '➕ Add Timeline Event'}
            </h2>
            <button className="event-editor-close" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="event-editor-form">
            <div className="event-editor-content">
              {/* Title */}
              <div className="event-form-group">
                <label className="event-form-label">
                  Event Title <span className="event-form-required">*</span>
                </label>
                <input
                  type="text"
                  className={`event-form-input ${errors.title ? 'event-form-input-error' : ''}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., 'Victim last seen alive'"
                  maxLength={100}
                />
                {errors.title && <div className="event-form-error">{errors.title}</div>}
              </div>

              {/* Description */}
              <div className="event-form-group">
                <label className="event-form-label">Description</label>
                <textarea
                  className="event-form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened at this time..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              {/* Event Type */}
              <div className="event-form-group">
                <label className="event-form-label">Event Type</label>
                <div className="event-type-options">
                  {Object.values(EVENT_TYPES).map(type => {
                    const typeInfo = getEventTypeInfo(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        className={`event-type-btn ${eventType === type ? 'event-type-btn-selected' : ''}`}
                        onClick={() => setEventType(type)}
                        style={{
                          borderColor: eventType === type ? typeInfo.color : undefined
                        }}
                      >
                        <span className="event-type-icon">{typeInfo.icon}</span>
                        <span className="event-type-label">{typeInfo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Precision */}
              <div className="event-form-group">
                <label className="event-form-label">Time Precision</label>
                <div className="event-precision-options">
                  <label className="event-precision-option">
                    <input
                      type="radio"
                      name="timePrecision"
                      value={TIME_PRECISION.EXACT}
                      checked={timePrecision === TIME_PRECISION.EXACT}
                      onChange={(e) => setTimePrecision(e.target.value)}
                    />
                    <span>🎯 Exact Time</span>
                  </label>
                  <label className="event-precision-option">
                    <input
                      type="radio"
                      name="timePrecision"
                      value={TIME_PRECISION.APPROXIMATE}
                      checked={timePrecision === TIME_PRECISION.APPROXIMATE}
                      onChange={(e) => setTimePrecision(e.target.value)}
                    />
                    <span>≈ Approximate</span>
                  </label>
                  <label className="event-precision-option">
                    <input
                      type="radio"
                      name="timePrecision"
                      value={TIME_PRECISION.RANGE}
                      checked={timePrecision === TIME_PRECISION.RANGE}
                      onChange={(e) => setTimePrecision(e.target.value)}
                    />
                    <span>⏱️ Time Range</span>
                  </label>
                </div>
              </div>

              {/* Time Input */}
              {timePrecision === TIME_PRECISION.RANGE ? (
                <div className="event-form-row">
                  <div className="event-form-group">
                    <label className="event-form-label">
                      Start Time <span className="event-form-required">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className={`event-form-input ${errors.timeRangeStart ? 'event-form-input-error' : ''}`}
                      value={timeRangeStart}
                      onChange={(e) => setTimeRangeStart(e.target.value)}
                    />
                    {errors.timeRangeStart && <div className="event-form-error">{errors.timeRangeStart}</div>}
                  </div>
                  <div className="event-form-group">
                    <label className="event-form-label">
                      End Time <span className="event-form-required">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className={`event-form-input ${errors.timeRangeEnd ? 'event-form-input-error' : ''}`}
                      value={timeRangeEnd}
                      onChange={(e) => setTimeRangeEnd(e.target.value)}
                    />
                    {errors.timeRangeEnd && <div className="event-form-error">{errors.timeRangeEnd}</div>}
                  </div>
                </div>
              ) : (
                <div className="event-form-group">
                  <label className="event-form-label">
                    Time <span className="event-form-required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className={`event-form-input ${errors.timestamp ? 'event-form-input-error' : ''}`}
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                  />
                  {errors.timestamp && <div className="event-form-error">{errors.timestamp}</div>}
                </div>
              )}

              {errors.timeRange && <div className="event-form-error">{errors.timeRange}</div>}

              {/* Location */}
              <div className="event-form-group">
                <label className="event-form-label">Location</label>
                <input
                  type="text"
                  className="event-form-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., 'Main Office', 'Parking Lot'"
                  maxLength={100}
                />
              </div>

              {/* Source */}
              <div className="event-form-group">
                <label className="event-form-label">Source</label>
                <input
                  type="text"
                  className="event-form-input"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., 'Witness testimony', 'Security footage'"
                  maxLength={100}
                />
              </div>

              {/* Verification Status */}
              <div className="event-form-group">
                <label className="event-form-label">Verification Status</label>
                <select
                  className="event-form-select"
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value)}
                >
                  <option value={VERIFICATION_STATUS.UNVERIFIED}>? Unverified</option>
                  <option value={VERIFICATION_STATUS.VERIFIED}>✓ Verified</option>
                  <option value={VERIFICATION_STATUS.CONTRADICTED}>✗ Contradicted</option>
                </select>
              </div>

              {/* Linked Evidence */}
              <div className="event-form-group">
                <div className="event-form-section-header">
                  <label className="event-form-label">Linked Evidence ({linkedEvidence.length})</label>
                  <button
                    type="button"
                    className="event-add-link-btn"
                    onClick={() => setShowEvidenceSelector(true)}
                  >
                    ➕ Add Evidence
                  </button>
                </div>
                {linkedEvidence.length === 0 ? (
                  <div className="event-empty-links">No evidence linked yet</div>
                ) : (
                  <div className="event-linked-items">
                    {linkedEvidence.map(link => (
                      <div key={link.evidenceId} className="event-linked-item">
                        <span className="event-linked-icon">🔍</span>
                        <span className="event-linked-name">{link.evidenceName}</span>
                        <button
                          type="button"
                          className="event-unlink-btn"
                          onClick={() => handleRemoveEvidence(link.evidenceId)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Suspects */}
              <div className="event-form-group">
                <div className="event-form-section-header">
                  <label className="event-form-label">Linked Suspects ({linkedSuspects.length})</label>
                  <button
                    type="button"
                    className="event-add-link-btn"
                    onClick={() => setShowSuspectSelector(true)}
                  >
                    ➕ Link Suspects
                  </button>
                </div>
                {linkedSuspects.length === 0 ? (
                  <div className="event-empty-links">No suspects linked yet</div>
                ) : (
                  <div className="event-linked-items">
                    {linkedSuspects.map(suspectId => {
                      const suspect = suspects?.find(s => s.id === suspectId);
                      return (
                        <div key={suspectId} className="event-linked-item">
                          <span className="event-linked-icon">👤</span>
                          <span className="event-linked-name">{suspect?.name || suspectId}</span>
                          <button
                            type="button"
                            className="event-unlink-btn"
                            onClick={() => handleToggleSuspect(suspectId)}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="event-editor-footer">
              <button
                type="button"
                className="event-editor-cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="event-editor-save-btn"
              >
                {event ? '💾 Save Changes' : '➕ Add Event'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Evidence Selector Modal */}
      {renderEvidenceSelector()}

      {/* Suspect Selector Modal */}
      {renderSuspectSelector()}
    </>
  );
};

export default EventEditor;
