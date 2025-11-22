import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import './EvidenceCard.css';

/**
 * Evidence Card Component
 * Draggable card for evidence board
 */
const EvidenceCard = ({
  card,
  cellSize,
  isSelected,
  isConnecting,
  onMove,
  onRemove,
  onStartConnection,
  onCompleteConnection
}) => {
  const cardRef = useRef(null);

  // Drag functionality for cards already on board
  const [{ isDragging }, drag] = useDrag({
    type: 'BOARD_CARD',
    item: () => ({
      id: card.id,
      cardId: card.id,
      type: card.type,
      dataId: card.dataId,
      currentPosition: card.position,
      isOnBoard: true
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.position) {
        onMove(card.id, dropResult.position);
      }
    }
  });

  /**
   * Handle click - for connection mode or selection
   */
  const handleClick = (e) => {
    e.stopPropagation();

    if (isConnecting) {
      onCompleteConnection(card.id);
    }
  };

  /**
   * Get card display data
   */
  const getCardDisplay = () => {
    if (card.type === 'evidence') {
      return {
        icon: '🔍',
        title: card.data.type || 'Evidence',
        subtitle: card.data.location || 'Unknown location',
        color: '#3498db'
      };
    } else if (card.type === 'suspect') {
      return {
        icon: '👤',
        title: card.data.name || 'Unknown',
        subtitle: card.data.occupation || 'Unknown occupation',
        color: '#e74c3c'
      };
    }

    return {
      icon: '📄',
      title: 'Unknown',
      subtitle: '',
      color: '#95a5a6'
    };
  };

  const display = getCardDisplay();

  return (
    <div
      ref={drag}
      className={`
        evidence-card
        evidence-card-${card.type}
        ${isSelected ? 'selected' : ''}
        ${isConnecting ? 'connecting' : ''}
        ${isDragging ? 'dragging' : ''}
      `}
      style={{
        position: 'absolute',
        left: card.position.x * cellSize,
        top: card.position.y * cellSize,
        width: cellSize - 10,
        height: cellSize - 10,
        borderColor: display.color,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onClick={handleClick}
    >
      {/* Card icon */}
      <div className="card-icon" style={{ color: display.color }}>
        {display.icon}
      </div>

      {/* Card content */}
      <div className="card-content">
        <div className="card-title">{display.title}</div>
        <div className="card-subtitle">{display.subtitle}</div>
      </div>

      {/* Card actions */}
      <div className="card-actions">
        <button
          className="card-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onStartConnection(card.id);
          }}
          title="Create connection"
        >
          🔗
        </button>
        <button
          className="card-action-btn card-action-danger"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(card.id);
          }}
          title="Remove from board"
        >
          ✕
        </button>
      </div>

      {/* Connection indicator */}
      {isConnecting && (
        <div className="connection-indicator">
          Click to connect
        </div>
      )}
    </div>
  );
};

export default EvidenceCard;
