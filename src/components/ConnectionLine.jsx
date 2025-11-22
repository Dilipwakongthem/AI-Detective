import React from 'react';
import './ConnectionLine.css';

/**
 * Connection Line Component
 * Draws SVG Bezier curve connection between two cards
 */
const ConnectionLine = ({
  connection,
  sourcePosition,
  targetPosition,
  cellSize,
  onDelete,
  onClick
}) => {
  // Calculate center points of cards
  const sourceX = (sourcePosition.x * cellSize) + (cellSize / 2);
  const sourceY = (sourcePosition.y * cellSize) + (cellSize / 2);
  const targetX = (targetPosition.x * cellSize) + (cellSize / 2);
  const targetY = (targetPosition.y * cellSize) + (cellSize / 2);

  // Calculate control points for Bezier curve
  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;
  const controlX1 = sourceX + deltaX * 0.3;
  const controlY1 = sourceY;
  const controlX2 = targetX - deltaX * 0.3;
  const controlY2 = targetY;

  // Create path string
  const pathD = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;

  // Get connection color based on type and strength
  const getConnectionColor = () => {
    if (connection.isValidated) {
      return connection.isCorrect ? '#27ae60' : '#e74c3c';
    }

    switch (connection.type) {
      case 'physical_evidence':
        return '#3498db';
      case 'witness':
        return '#9b59b6';
      case 'alibi':
        return '#f39c12';
      case 'motive':
        return '#e74c3c';
      case 'contradiction':
        return '#e67e22';
      default:
        return '#95a5a6';
    }
  };

  // Get stroke width based on strength
  const getStrokeWidth = () => {
    return 1 + (connection.strength * 0.8); // 1.8 to 5
  };

  // Get stroke dash array for weak connections
  const getDashArray = () => {
    if (connection.strength <= 2) {
      return '5,5';
    }
    return 'none';
  };

  const color = getConnectionColor();
  const strokeWidth = getStrokeWidth();
  const dashArray = getDashArray();

  return (
    <g className="connection-line-group">
      {/* Invisible thick line for easier clicking */}
      <path
        d={pathD}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        style={{ cursor: 'pointer' }}
        onClick={onClick}
      />

      {/* Actual visible line */}
      <path
        d={pathD}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        fill="none"
        className="connection-path"
        markerEnd="url(#arrowhead)"
      />

      {/* Connection strength indicator (midpoint circle) */}
      <circle
        cx={(sourceX + targetX) / 2}
        cy={(sourceY + targetY) / 2}
        r={4 + connection.strength}
        fill={color}
        className="connection-midpoint"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      />

      {/* Delete button at midpoint */}
      <foreignObject
        x={(sourceX + targetX) / 2 - 12}
        y={(sourceY + targetY) / 2 - 25}
        width="24"
        height="24"
        className="connection-delete-btn-container"
      >
        <button
          className="connection-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete connection"
        >
          ✕
        </button>
      </foreignObject>

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={color}
          />
        </marker>
      </defs>
    </g>
  );
};

export default ConnectionLine;
