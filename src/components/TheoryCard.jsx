import React from 'react';
import { calculateTheoryStrength, formatTheoryTimestamp } from '../utils/theoryManager';
import './TheoryCard.css';

/**
 * Theory Card Component
 * Displays a single theory in list view
 */
const TheoryCard = ({
  theory,
  onEdit,
  onDelete,
  onSelect,
  isSelected = false
}) => {
  const strength = calculateTheoryStrength(theory);

  /**
   * Get strength color and label
   */
  const getStrengthInfo = () => {
    if (strength >= 80) return { color: '#27ae60', label: 'Very Strong', icon: '🟢' };
    if (strength >= 60) return { color: '#f39c12', label: 'Strong', icon: '🟡' };
    if (strength >= 40) return { color: '#e67e22', label: 'Moderate', icon: '🟠' };
    if (strength >= 20) return { color: '#e74c3c', label: 'Weak', icon: '🔴' };
    return { color: '#95a5a6', label: 'Very Weak', icon: '⚪' };
  };

  const strengthInfo = getStrengthInfo();

  /**
   * Get tag display info
   */
  const getTagInfo = (tag) => {
    switch (tag) {
      case 'working': return { icon: '🔄', label: 'Working', color: '#3498db' };
      case 'primary': return { icon: '⭐', label: 'Primary', color: '#f39c12' };
      case 'discarded': return { icon: '🗑️', label: 'Discarded', color: '#95a5a6' };
      default: return { icon: '🏷️', label: tag, color: '#7f8c8d' };
    }
  };

  /**
   * Get confidence stars
   */
  const renderConfidenceStars = () => {
    return '⭐'.repeat(theory.confidence) + '☆'.repeat(5 - theory.confidence);
  };

  return (
    <div
      className={`theory-card ${isSelected ? 'theory-card-selected' : ''} ${theory.tags.includes('discarded') ? 'theory-card-discarded' : ''}`}
      onClick={() => onSelect && onSelect(theory)}
    >
      {/* Header */}
      <div className="theory-card-header">
        <div className="theory-card-title-section">
          <h3 className="theory-card-title">{theory.title}</h3>
          <div className="theory-card-meta">
            <span className="theory-card-timestamp">
              {formatTheoryTimestamp(theory.updatedAt)}
            </span>
            <span className="theory-card-confidence">
              {renderConfidenceStars()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="theory-card-actions">
          <button
            className="theory-card-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(theory);
            }}
            title="Edit theory"
          >
            ✏️
          </button>
          <button
            className="theory-card-action-btn theory-card-delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete theory "${theory.title}"?`)) {
                onDelete(theory.id);
              }
            }}
            title="Delete theory"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Description */}
      {theory.description && (
        <div className="theory-card-description">
          {theory.description.length > 150
            ? `${theory.description.substring(0, 150)}...`
            : theory.description}
        </div>
      )}

      {/* Evidence Stats */}
      <div className="theory-card-stats">
        <div className="theory-stat theory-stat-supporting">
          <span className="theory-stat-icon">✅</span>
          <span className="theory-stat-label">Supporting:</span>
          <span className="theory-stat-value">{theory.supportingEvidence.length}</span>
        </div>

        <div className="theory-stat theory-stat-contradicting">
          <span className="theory-stat-icon">⚠️</span>
          <span className="theory-stat-label">Contradicting:</span>
          <span className="theory-stat-value">{theory.contradictingEvidence.length}</span>
        </div>

        <div className="theory-stat theory-stat-suspects">
          <span className="theory-stat-icon">👤</span>
          <span className="theory-stat-label">Suspects:</span>
          <span className="theory-stat-value">{theory.linkedSuspects.length}</span>
        </div>
      </div>

      {/* Strength Indicator */}
      <div className="theory-card-strength">
        <div className="theory-strength-label">Theory Strength:</div>
        <div className="theory-strength-bar-container">
          <div
            className="theory-strength-bar"
            style={{
              width: `${strength}%`,
              background: `linear-gradient(90deg, ${strengthInfo.color} 0%, ${strengthInfo.color}dd 100%)`
            }}
          />
        </div>
        <div className="theory-strength-info">
          <span className="theory-strength-icon">{strengthInfo.icon}</span>
          <span className="theory-strength-score">{strength}%</span>
          <span className="theory-strength-label-text">{strengthInfo.label}</span>
        </div>
      </div>

      {/* Tags */}
      {theory.tags && theory.tags.length > 0 && (
        <div className="theory-card-tags">
          {theory.tags.map(tag => {
            const tagInfo = getTagInfo(tag);
            return (
              <span
                key={tag}
                className="theory-tag"
                style={{ borderColor: tagInfo.color, color: tagInfo.color }}
              >
                {tagInfo.icon} {tagInfo.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="theory-card-selected-indicator">
          ✓ Selected for comparison
        </div>
      )}
    </div>
  );
};

export default TheoryCard;
