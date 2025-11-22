import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import TimelineEvent from './TimelineEvent';
import './Timeline.css';

/**
 * Timeline Component - Chronological visualization of evidence
 * Allows players to organize evidence by time to understand sequence of events
 */
const Timeline = ({ caseData, timelineEvents, onUpdateTimeline, onClose }) => {
  const [events, setEvents] = useState(timelineEvents || []);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [timeRange, setTimeRange] = useState({ start: 0, end: 24 }); // Hours
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ time: 12, title: '', description: '' });

  useEffect(() => {
    // Auto-save timeline to localStorage
    const autoSave = setInterval(() => {
      if (caseData && events.length > 0) {
        localStorage.setItem(`timeline_${caseData.id}`, JSON.stringify(events));
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(autoSave);
  }, [events, caseData]);

  // Load timeline from localStorage
  useEffect(() => {
    if (caseData) {
      const saved = localStorage.getItem(`timeline_${caseData.id}`);
      if (saved) {
        try {
          setEvents(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading timeline:', error);
        }
      }
    }
  }, [caseData]);

  // Drop zone for entire timeline
  const [{ isOver }, drop] = useDrop({
    accept: ['SIDEBAR_ITEM', 'TIMELINE_EVENT'],
    drop: (item, monitor) => {
      // Get drop position to determine time
      const offset = monitor.getClientOffset();
      const timelineElement = document.querySelector('.timeline-track');
      if (timelineElement) {
        const rect = timelineElement.getBoundingClientRect();
        const relativeX = offset.x - rect.left;
        const percentage = relativeX / rect.width;
        const time = timeRange.start + (percentage * (timeRange.end - timeRange.start));

        handleDropOnTimeline(item, Math.max(0, Math.min(24, time)));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const handleDropOnTimeline = (item, time) => {
    if (item.type === 'evidence') {
      // Add evidence to timeline
      const newEvent = {
        id: `event_${Date.now()}`,
        time: Math.round(time * 2) / 2, // Round to nearest 0.5 hour
        type: 'evidence',
        title: item.data.type || 'Evidence',
        description: item.data.description || '',
        evidenceId: item.data.id,
        data: item.data
      };

      setEvents(prev => [...prev, newEvent].sort((a, b) => a.time - b.time));
    } else if (item.isTimelineEvent) {
      // Reorder existing event
      setEvents(prev => prev.map(e =>
        e.id === item.id ? { ...e, time: Math.round(time * 2) / 2 } : e
      ).sort((a, b) => a.time - b.time));
    }
  };

  const handleAddEvent = () => {
    const event = {
      id: `event_${Date.now()}`,
      time: newEvent.time,
      type: 'custom',
      title: newEvent.title,
      description: newEvent.description
    };

    setEvents(prev => [...prev, event].sort((a, b) => a.time - b.time));
    setShowAddModal(false);
    setNewEvent({ time: 12, title: '', description: '' });
  };

  const handleRemoveEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setSelectedEvent(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleSave = () => {
    if (caseData) {
      localStorage.setItem(`timeline_${caseData.id}`, JSON.stringify(events));
      onUpdateTimeline(events);
    }
    onClose();
  };

  const formatTime = (hour) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const renderTimeMarkers = () => {
    const markers = [];
    const interval = zoomLevel >= 2 ? 1 : 2; // Show hourly markers when zoomed in

    for (let hour = timeRange.start; hour <= timeRange.end; hour += interval) {
      const position = ((hour - timeRange.start) / (timeRange.end - timeRange.start)) * 100;
      markers.push(
        <div
          key={hour}
          className="time-marker"
          style={{ left: `${position}%` }}
        >
          <div className="time-marker-line" />
          <div className="time-marker-label">{formatTime(hour)}</div>
        </div>
      );
    }

    return markers;
  };

  return (
    <div className="timeline-overlay">
      <div className="timeline-modal">
        <div className="timeline-header">
          <h2>🕐 Timeline Visualization</h2>
          <div className="timeline-controls">
            <button className="timeline-btn" onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
              🔍−
            </button>
            <span className="zoom-indicator">{Math.round(zoomLevel * 100)}%</span>
            <button className="timeline-btn" onClick={handleZoomIn} disabled={zoomLevel >= 4}>
              🔍+
            </button>
            <button className="timeline-btn timeline-btn-add" onClick={() => setShowAddModal(true)}>
              ➕ Add Event
            </button>
            <button className="timeline-btn timeline-btn-primary" onClick={handleSave}>
              💾 Save
            </button>
            <button className="timeline-close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="timeline-content">
          <div className="timeline-instructions">
            <p>📌 Drag evidence from the Evidence Board to organize events chronologically</p>
            <p>⏰ Understanding the timeline helps identify alibis and sequence of events</p>
          </div>

          <div
            ref={drop}
            className={`timeline-track ${isOver ? 'drop-active' : ''}`}
            style={{ transform: `scaleX(${zoomLevel})` }}
          >
            {renderTimeMarkers()}

            <div className="timeline-events">
              {events.map(event => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  isSelected={selectedEvent?.id === event.id}
                  onClick={() => setSelectedEvent(event)}
                  onRemove={() => handleRemoveEvent(event.id)}
                  timeRange={timeRange}
                />
              ))}
            </div>

            {events.length === 0 && (
              <div className="timeline-empty">
                <p>🕐 No events on timeline</p>
                <p className="timeline-hint">Drag evidence here or add custom events</p>
              </div>
            )}
          </div>

          {selectedEvent && (
            <div className="timeline-details">
              <h3>Event Details</h3>
              <p><strong>Time:</strong> {formatTime(selectedEvent.time)}</p>
              <p><strong>Type:</strong> {selectedEvent.type}</p>
              <p><strong>Title:</strong> {selectedEvent.title}</p>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
              <button
                className="timeline-btn timeline-btn-danger"
                onClick={() => handleRemoveEvent(selectedEvent.id)}
              >
                🗑️ Remove
              </button>
            </div>
          )}
        </div>

        <div className="timeline-footer">
          <div className="timeline-stats">
            <span>📊 Events: {events.length}</span>
            <span>⏱️ Range: {formatTime(timeRange.start)} - {formatTime(timeRange.end)}</span>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="add-event-modal">
          <div className="add-event-content">
            <h3>Add Custom Event</h3>
            <div className="form-group">
              <label>Time:</label>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: parseFloat(e.target.value) })}
              />
              <span>{formatTime(newEvent.time)}</span>
            </div>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Witness saw suspect"
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Additional details..."
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button className="timeline-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button
                className="timeline-btn timeline-btn-primary"
                onClick={handleAddEvent}
                disabled={!newEvent.title}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
