import React from 'react';
import { useDrop } from 'react-dnd';

/**
 * Grid Cell Component with Drop Zone
 */
const GridCell = ({ x, y, cellSize, isOccupied, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['BOARD_CARD', 'SIDEBAR_ITEM'],
    drop: (item) => {
      onDrop(item, { x, y });
    },
    canDrop: (item) => {
      // Can't drop if already occupied
      // Unless moving existing card to same position
      if (isOccupied && item.currentPosition) {
        return item.currentPosition.x !== x || item.currentPosition.y !== y;
      }
      return !isOccupied;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  return (
    <div
      ref={drop}
      className={`
        grid-cell
        ${isOccupied ? 'occupied' : ''}
        ${isOver && canDrop ? 'drop-target' : ''}
        ${isOver && !canDrop ? 'drop-invalid' : ''}
      `}
      style={{
        left: x * cellSize,
        top: y * cellSize,
        width: cellSize,
        height: cellSize
      }}
      data-x={x}
      data-y={y}
    />
  );
};

export default GridCell;
