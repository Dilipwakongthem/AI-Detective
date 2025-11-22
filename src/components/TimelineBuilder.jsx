import React, { useState, useEffect } from 'react';
import {
  getEventsForCase,
  sortEventsChronologically,
  filterEventsByType,
  filterEventsByVerification,
  getConflictingEvents,
  deleteEvent,
  updateEventConflicts,
  getTimelineStats,
  formatEventTime,
  EVENT_TYPES,
  VERIFICATION_STATUS,
  exportTimelineAsText
} from '../utils/timelineManager';
import './TimelineBuilder.css';

/**
 * Timeline Builder Component
 * Main timeline interface for viewing and managing events
 */
const TimelineBuilder = ({
  caseId,
  evidence,
  suspects,
  onEventEdit,
  onShowAlibiValidator
}) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [showConflictsOnly, setShowConflictsOnly] = useState(false);
  const [stats, setStats] = useState(null);
  const [conflicts, setConflicts] = useState([]);

  /**
   * Load events on mount and when caseId changes
   */
  useEffect(() => {
    loadTimeline();
  }, [caseId]);

  /**
   * Apply filters when events or filters change
   */
  useEffect(() => {
    applyFilters();
  }, [events, filterType, filterVerification, showConflictsOnly]);

  /**
   * Load timeline from storage
   */
  const loadTimeline = () => {
    const caseEvents = getEventsForCase(caseId);
    const sorted = sortEventsChronologically(caseEvents);
    setEvents(sorted);

    // Update conflicts
    const detectedConflicts = updateEventConflicts(caseId);
    setConflicts(detectedConflicts);

    // Get stats
    const timelineStats = getTimelineStats(caseId);
    setStats(timelineStats);
  };

  /**
   * Apply current filters
   */
  const applyFilters = () => {
    let filtered = [...events];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filterEventsByType(filtered, filterType);
    }

    // Filter by verification
    if (filterVerification !== 'all') {
      filtered = filterEventsByVerification(filtered, filterVerification);
    }

    // Show conflicts only
    if (showConflictsOnly) {
      filtered = getConflictingEvents(filtered);
    }

    setFilteredEvents(filtered);
  };

  /**
   * Handle delete event
   */
  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Delete this event from the timeline?')) {
      deleteEvent(caseId, eventId);
      loadTimeline();
    }
  };

  /**
   * Handle export timeline
   */
  const handleExportTimeline = () => {
    const text = exportTimelineAsText(caseId);

    // Create download link
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timeline_case_${caseId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Get event type info for display
   */
  const getEventTypeInfo = (type) => {
    switch (type) {
      case EVENT_TYPES.ESTABLISHED:
        return { icon: '✅', label: 'Established', color: '#27ae60' };
      case EVENT_TYPES.SUSPECT_CLAIM:
        return { icon: '💬', label: 'Suspect Claim', color: '#3498db' };
      case EVENT_TYPES.EVIDENCE_BASED:
        return { icon: '🔍', label: 'Evidence-Based', color: '#f39c12' };
      case EVENT_TYPES.INFERRED:
        return { icon: '💡', label: 'Inferred', color: '#9b59b6' };
      default:
        return { icon: '📌', label: 'Unknown', color: '#7f8c8d' };
    }
  };

  /**
   * Get verification status info
   */
  const getVerificationInfo = (status) => {
    switch (status) {
      case VERIFICATION_STATUS.VERIFIED:
        return { icon: '✓', label: 'Verified', color: '#27ae60' };
      case VERIFICATION_STATUS.CONTRADICTED:
        return { icon: '✗', label: 'Contradicted', color: '#e74c3c' };
      case VERIFICATION_STATUS.UNVERIFIED:
        return { icon: '?', label: 'Unverified', color: '#7f8c8d' };
      default:
        return { icon: '?', label: 'Unknown', color: '#7f8c8d' };
    }
  };

  /**
   * Render single timeline event
   */
  const renderEvent = (event, index) => {
    const typeInfo = getEventTypeInfo(event.eventType);
    const verificationInfo = getVerificationInfo(event.verificationStatus);
    const hasConflicts = event.conflictsWith && event.conflictsWith.length > 0;

    return (
      <div
        key={event.id}
        className={`timeline-event ${hasConflicts ? 'timeline-event-conflict' : ''}`}
      >
        {/* Timeline marker */}
        <div className="timeline-marker" style={{ background: typeInfo.color }}>
          <span className="timeline-marker-icon">{typeInfo.icon}</span>
        </div>

        {/* Timeline connector */}
        {index < filteredEvents.length - 1 && (
          <div className="timeline-connector" />
        )}

        {/* Event card */}
        <div className="timeline-event-card">
          {/* Header */}
          <div className="timeline-event-header">
            <div className="timeline-event-title-section">
              <h4 className="timeline-event-title">{event.title}</h4>
              <div className="timeline-event-time">
                🕒 {formatEventTime(event)}
              </div>
            </div>

            {/* Actions */}
            <div className="timeline-event-actions">
              <button
                className="timeline-event-action-btn"
                onClick={() => onEventEdit(event)}
                title="Edit event"
              >
                ✏️
              </button>
              <button
                className="timeline-event-action-btn timeline-event-delete-btn"
                onClick={() => handleDeleteEvent(event.id)}
                title="Delete event"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="timeline-event-description">
              {event.description}
            </div>
          )}

          {/* Location */}
          {event.location && (
            <div className="timeline-event-location">
              📍 {event.location}
            </div>
          )}

          {/* Metadata */}
          <div className="timeline-event-meta">
            <span
              className="timeline-event-type-badge"
              style={{ borderColor: typeInfo.color, color: typeInfo.color }}
            >
              {typeInfo.icon} {typeInfo.label}
            </span>

            <span
              className="timeline-event-verification-badge"
              style={{ borderColor: verificationInfo.color, color: verificationInfo.color }}
            >
              {verificationInfo.icon} {verificationInfo.label}
            </span>

            {event.linkedSuspects.length > 0 && (
              <span className="timeline-event-suspects-badge">
                👤 {event.linkedSuspects.length} suspect(s)
              </span>
            )}

            {event.linkedEvidence.length > 0 && (
              <span className="timeline-event-evidence-badge">
                🔍 {event.linkedEvidence.length} evidence
              </span>
            )}
          </div>

          {/* Conflicts warning */}
          {hasConflicts && (
            <div className="timeline-event-conflict-warning">
              <span className="conflict-warning-icon">⚠️</span>
              <span className="conflict-warning-text">
                Conflicts with {event.conflictsWith.length} other event(s)
              </span>
            </div>
          )}

          {/* Source */}
          {event.source && (
            <div className="timeline-event-source">
              Source: {event.source}
            </div>
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
      <div className="timeline-empty-state">
        <div className="timeline-empty-icon">⏰</div>
        <h3 className="timeline-empty-title">No Timeline Events Yet</h3>
        <p className="timeline-empty-message">
          Start building your case timeline by adding events. Arrange events chronologically
          to identify alibi inconsistencies and timing conflicts.
        </p>
        <button
          className="timeline-empty-btn"
          onClick={() => onEventEdit(null)}
        >
          ➕ Add First Event
        </button>
      </div>
    );
  };

  /**
   * Render stats panel
   */
  const renderStats = () => {
    if (!stats) return null;

    return (
      <div className="timeline-stats-panel">
        <div className="timeline-stat">
          <div className="timeline-stat-label">Total Events</div>
          <div className="timeline-stat-value">{stats.totalEvents}</div>
        </div>

        <div className="timeline-stat">
          <div className="timeline-stat-label">Verified</div>
          <div className="timeline-stat-value timeline-stat-verified">
            {stats.byVerification[VERIFICATION_STATUS.VERIFIED] || 0}
          </div>
        </div>

        <div className="timeline-stat">
          <div className="timeline-stat-label">Conflicts</div>
          <div className="timeline-stat-value timeline-stat-conflicts">
            {stats.conflictCount}
          </div>
        </div>

        {stats.timeSpan && (
          <div className="timeline-stat">
            <div className="timeline-stat-label">Time Span</div>
            <div className="timeline-stat-value">
              {Math.round(stats.timeSpan.durationMinutes)} min
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render conflict summary
   */
  const renderConflictSummary = () => {
    if (conflicts.length === 0) return null;

    return (
      <div className="timeline-conflicts-summary">
        <h4 className="conflicts-summary-title">
          ⚠️ {conflicts.length} Timing Conflict{conflicts.length !== 1 ? 's' : ''} Detected
        </h4>
        <div className="conflicts-list">
          {conflicts.map((conflict, idx) => (
            <div key={idx} className={`conflict-item conflict-${conflict.severity}`}>
              <div className="conflict-icon">
                {conflict.severity === 'high' && '🔴'}
                {conflict.severity === 'medium' && '🟡'}
                {conflict.severity === 'low' && '🟢'}
              </div>
              <div className="conflict-message">{conflict.message}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="timeline-builder">
      {/* Toolbar */}
      <div className="timeline-toolbar">
        <div className="timeline-toolbar-left">
          <button
            className="timeline-btn timeline-btn-primary"
            onClick={() => onEventEdit(null)}
          >
            ➕ Add Event
          </button>

          {suspects && suspects.length > 0 && (
            <button
              className="timeline-btn timeline-btn-secondary"
              onClick={onShowAlibiValidator}
            >
              🔍 Check Alibis
            </button>
          )}
        </div>

        <div className="timeline-toolbar-right">
          <button
            className="timeline-btn timeline-btn-secondary"
            onClick={handleExportTimeline}
            disabled={events.length === 0}
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Stats */}
      {events.length > 0 && renderStats()}

      {/* Conflict Summary */}
      {conflicts.length > 0 && renderConflictSummary()}

      {/* Filters */}
      {events.length > 0 && (
        <div className="timeline-filters">
          <div className="timeline-filter-group">
            <label className="timeline-filter-label">Event Type:</label>
            <select
              className="timeline-filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value={EVENT_TYPES.ESTABLISHED}>✅ Established</option>
              <option value={EVENT_TYPES.SUSPECT_CLAIM}>💬 Suspect Claims</option>
              <option value={EVENT_TYPES.EVIDENCE_BASED}>🔍 Evidence-Based</option>
              <option value={EVENT_TYPES.INFERRED}>💡 Inferred</option>
            </select>
          </div>

          <div className="timeline-filter-group">
            <label className="timeline-filter-label">Verification:</label>
            <select
              className="timeline-filter-select"
              value={filterVerification}
              onChange={(e) => setFilterVerification(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value={VERIFICATION_STATUS.VERIFIED}>✓ Verified</option>
              <option value={VERIFICATION_STATUS.UNVERIFIED}>? Unverified</option>
              <option value={VERIFICATION_STATUS.CONTRADICTED}>✗ Contradicted</option>
            </select>
          </div>

          <div className="timeline-filter-group">
            <label className="timeline-filter-checkbox">
              <input
                type="checkbox"
                checked={showConflictsOnly}
                onChange={(e) => setShowConflictsOnly(e.target.checked)}
              />
              <span>Show conflicts only</span>
            </label>
          </div>

          {(filterType !== 'all' || filterVerification !== 'all' || showConflictsOnly) && (
            <button
              className="timeline-filter-clear"
              onClick={() => {
                setFilterType('all');
                setFilterVerification('all');
                setShowConflictsOnly(false);
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="timeline-content">
        {events.length === 0 && renderEmptyState()}

        {events.length > 0 && filteredEvents.length === 0 && (
          <div className="timeline-no-results">
            <div className="timeline-no-results-icon">🔍</div>
            <p>No events match the current filters.</p>
            <button
              className="timeline-btn timeline-btn-secondary"
              onClick={() => {
                setFilterType('all');
                setFilterVerification('all');
                setShowConflictsOnly(false);
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {filteredEvents.length > 0 && (
          <div className="timeline-events-list">
            {filteredEvents.map((event, index) => renderEvent(event, index))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineBuilder;
