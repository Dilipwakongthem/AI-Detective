import React, { useState, useEffect } from 'react';
import {
  getAvailableThemes,
  getCurrentTheme,
  setTheme,
  isThemeUnlocked
} from '../utils/themeManager';
import { hasPremiumThemes } from '../utils/storageManager';
import './ThemeSelectorModal.css';

/**
 * Theme Selector Modal Component
 * Allows players to preview and select themes
 */
const ThemeSelectorModal = ({ onClose, showNotification, onThemeChange }) => {
  const [availableThemes, setAvailableThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [previewTheme, setPreviewTheme] = useState(null);
  const isPremiumUnlocked = hasPremiumThemes();

  /**
   * Load available themes on mount
   */
  useEffect(() => {
    const themes = getAvailableThemes();
    setAvailableThemes(themes);
    setSelectedTheme(getCurrentTheme());
  }, []);

  /**
   * Handle theme selection
   */
  const handleSelectTheme = (themeId) => {
    if (!isThemeUnlocked(themeId)) {
      showNotification('This theme is locked. Purchase Premium Themes Pack to unlock!', 'info');
      return;
    }

    const success = setTheme(themeId);

    if (success) {
      setSelectedTheme(themeId);
      showNotification(`✅ Theme changed to ${getThemeName(themeId)}!`, 'success');

      if (onThemeChange) {
        onThemeChange(themeId);
      }
    } else {
      showNotification('Failed to change theme', 'error');
    }
  };

  /**
   * Get theme name from ID
   */
  const getThemeName = (themeId) => {
    const theme = availableThemes.find(t => t.id === themeId);
    return theme ? theme.name : 'Unknown';
  };

  /**
   * Handle mouse enter on theme card (preview)
   */
  const handleThemePreview = (theme) => {
    setPreviewTheme(theme);
  };

  /**
   * Handle mouse leave (stop preview)
   */
  const handleStopPreview = () => {
    setPreviewTheme(null);
  };

  /**
   * Render theme card
   */
  const renderThemeCard = (theme) => {
    const isSelected = selectedTheme === theme.id;
    const isLocked = !isThemeUnlocked(theme.id);

    return (
      <div
        key={theme.id}
        className={`theme-card ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`}
        onClick={() => handleSelectTheme(theme.id)}
        onMouseEnter={() => !isLocked && handleThemePreview(theme)}
        onMouseLeave={handleStopPreview}
      >
        {/* Lock indicator */}
        {isLocked && (
          <div className="theme-lock-overlay">
            <div className="lock-icon">🔒</div>
            <div className="lock-text">PREMIUM</div>
          </div>
        )}

        {/* Selected indicator */}
        {isSelected && (
          <div className="theme-selected-badge">
            ✓ ACTIVE
          </div>
        )}

        {/* Theme preview */}
        <div className="theme-preview" style={{
          background: theme.colors['--bg-primary']
        }}>
          <div className="theme-preview-content">
            {theme.preview && (
              <div className="theme-preview-icon">{theme.preview}</div>
            )}
            <div className="theme-preview-text" style={{
              color: theme.colors['--color-primary']
            }}>
              {theme.name}
            </div>
            <div className="theme-preview-sample" style={{
              background: theme.colors['--bg-card'],
              borderColor: theme.colors['--border-primary'],
              color: theme.colors['--text-secondary']
            }}>
              Sample Text
            </div>
          </div>
        </div>

        {/* Theme info */}
        <div className="theme-info">
          <h3 className="theme-name">{theme.name}</h3>
          <p className="theme-description">{theme.description}</p>
          {theme.isPremium && isPremiumUnlocked && (
            <span className="theme-premium-badge">✨ PREMIUM</span>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render locked themes section
   */
  const renderLockedThemes = () => {
    if (isPremiumUnlocked) return null;

    const lockedThemes = availableThemes.filter(t => t.isPremium && !isThemeUnlocked(t.id));

    if (lockedThemes.length === 0) return null;

    return (
      <div className="locked-themes-section">
        <div className="locked-themes-banner">
          <h3>🔒 LOCKED PREMIUM THEMES</h3>
          <p>Purchase the Premium Themes Pack to unlock all 5 exclusive themes!</p>
          <div className="locked-themes-preview">
            {lockedThemes.map(theme => (
              <div key={theme.id} className="locked-theme-mini">
                <span className="locked-theme-icon">{theme.preview || '🎨'}</span>
                <span className="locked-theme-name">{theme.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="theme-selector-overlay" onClick={onClose}>
      <div className="theme-selector-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="theme-selector-header">
          <h2 className="theme-selector-title">🎨 THEME SELECTOR</h2>
          <button className="theme-selector-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="theme-selector-info">
          <p>Customize your detective experience! {isPremiumUnlocked ? 'All themes unlocked!' : 'Unlock premium themes in the store.'}</p>
        </div>

        {/* Preview notification */}
        {previewTheme && (
          <div className="theme-preview-notice">
            <span>👀 Previewing: {previewTheme.name}</span>
            <span className="preview-hint">Click to apply</span>
          </div>
        )}

        {/* Themes grid */}
        <div className="themes-grid">
          {availableThemes.map(theme => renderThemeCard(theme))}
        </div>

        {/* Locked themes banner */}
        {renderLockedThemes()}

        {/* Footer */}
        <div className="theme-selector-footer">
          <p className="theme-selector-footer-text">
            💡 Themes apply across all cases and persist after restart
          </p>
          {!isPremiumUnlocked && (
            <button
              className="theme-unlock-btn"
              onClick={() => {
                onClose();
                // Parent component should handle navigation to store
                showNotification('Visit the Store to unlock Premium Themes!', 'info');
              }}
            >
              🛍️ GO TO STORE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectorModal;
