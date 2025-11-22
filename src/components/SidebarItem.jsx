import React from 'react';
import { useDrag } from 'react-dnd';
import './SidebarItem.css';

/**
 * Sidebar Item Component
 * Draggable evidence/suspect from sidebar
 */
const SidebarItem = ({ item, itemType }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'SIDEBAR_ITEM',
    item: () => ({
      type: itemType, // 'evidence' or 'suspect'
      id: item.id,
      data: item,
      isOnBoard: false
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const getDisplay = () => {
    if (itemType === 'evidence') {
      return {
        icon: '🔍',
        title: item.type,
        subtitle: item.location || ''
      };
    } else if (itemType === 'suspect') {
      return {
        icon: '👤',
        title: item.name,
        subtitle: item.occupation || ''
      };
    }
    return { icon: '📄', title: 'Unknown', subtitle: '' };
  };

  const display = getDisplay();

  return (
    <div
      ref={drag}
      className={`sidebar-item sidebar-item-${itemType} ${isDragging ? 'dragging' : ''}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <span className="sidebar-item-icon">{display.icon}</span>
      <div className="sidebar-item-content">
        <div className="sidebar-item-title">{display.title}</div>
        {display.subtitle && (
          <div className="sidebar-item-subtitle">{display.subtitle}</div>
        )}
      </div>
    </div>
  );
};

export default SidebarItem;
