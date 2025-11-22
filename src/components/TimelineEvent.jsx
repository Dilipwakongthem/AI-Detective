import React from 'react';
import { useDrag } from 'react-dnd';

/**
 * Timeline Event Component - Individual event on timeline
 */
const TimelineEvent = ({ event, isSelected, onClick, onRemove, timeRange }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TIMELINE_EVENT',
    item: () => ({
      id: event.id,
      isTimelineEvent: true,
      currentTime: event.time
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  // Calculate position based on time
  const position = ((event.time - timeRange.start) / (timeRange.end - timeRange.start)) * 100;

  const getEventIcon = () => {
    switch (event.type) {
      case 'evidence':
        return '🔍';
      case 'witness':
        return '👁️';
      case 'suspect':
        return '👤';
      case 'custom':
        return '📌';
      default:
        return '⏰';
    }
  };

  const getEventColor = () => {
    switch (event.type) {
      case 'evidence':
        return '#3498db';
      case 'witness':
        return '#9b59b6';
      case 'suspect':
        return '#e74c3c';
      case 'custom':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div
      ref={drag}
      className={`timeline-event ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${Math.max(0, Math.min(100, position))}%`,
        borderColor: getEventColor(),
        opacity: isDragging ? 0.5 : 1
      }}
      onClick={onClick}
    >
      <div className="event-marker" style={{ background: getEventColor() }}>
        {getEventIcon()}
      </div>
      <div className="event-label">
        {event.title}
      </div>
    </div>
  );
};

export default TimelineEvent;
