import React, { useState } from 'react';
import { getPremiumThemes, setTheme, applyTheme } from '../utils/themeManager';
import './ThemeWelcomeModal.css';

/**
 * Theme Welcome Modal Component
 * Shows after purchasing premium themes
 * Let user choose their first premium theme
 */
const ThemeWelcomeModal = ({ onClose, showNotification }) => {
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const premiumThemes = getPremiumThemes();

  /**
   * Handle theme selection
   */
  const handleThemeSelect = (themeId) => {
    setSelectedThemeId(themeId);
  };

  /**
   * Apply selected theme and close
   */
  const handleApplyTheme = () => {
    if (!selectedThemeId) return;

    const success = setTheme(selectedThemeId);

    if (success) {
      const theme = premiumThemes.find(t => t.id === selectedThemeId);
      showNotification(`✅ Theme changed to ${theme.name}!`, 'success');

      // Show instruction modal
      setTimeout(() => {
        showInstructionModal();
      }, 300);

      onClose();
    } else {
      showNotification('Failed to apply theme', 'error');
    }
  };

  /**
   * Skip theme selection (keep default)
   */
  const handleSkip = () => {
    showInstructionModal();
    onClose();
  };

  /**
   * Show instruction modal
   */
  const showInstructionModal = () => {
    const instructionModal = document.createElement('div');
    instructionModal.className = 'theme-instruction-modal';
    instructionModal.innerHTML = `
      <div class="theme-instruction-container">
        <div class="theme-instruction-content">
          <h3>🎨 How to Change Your Theme</h3>

          <div class="instruction-steps">
            <div class="instruction-step">
              <span class="step-number">1</span>
              <p>Go to <strong>Profile</strong> (👤 button in main menu)</p>
            </div>

            <div class="instruction-step">
              <span class="step-number">2</span>
              <p>Scroll to <strong>Customization</strong> section</p>
            </div>

            <div class="instruction-step">
              <span class="step-number">3</span>
              <p>Click <strong>Change Theme</strong></p>
            </div>

            <div class="instruction-step">
              <span class="step-number">4</span>
              <p>Select any theme you like!</p>
            </div>
          </div>

          <button class="theme-instruction-btn" onclick="this.closest('.theme-instruction-modal').remove()">
            GOT IT!
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(instructionModal);

    // Auto-close after 8 seconds
    setTimeout(() => {
      if (instructionModal.parentNode) {
        instructionModal.style.opacity = '0';
        setTimeout(() => {
          if (instructionModal.parentNode) {
            instructionModal.remove();
          }
        }, 300);
      }
    }, 8000);
  };

  return (
    <div className="theme-welcome-overlay" onClick={onClose}>
      <div className="theme-welcome-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="theme-welcome-header">
          <h2>🎉 Premium Themes Unlocked!</h2>
        </div>

        {/* Content */}
        <div className="theme-welcome-content">
          <p className="welcome-message">
            Thank you for your purchase! You now have access to all 5 exclusive themes.
          </p>

          <h3>Choose your theme:</h3>

          {/* Theme quick selector */}
          <div className="theme-quick-selector">
            {premiumThemes.map(theme => (
              <div
                key={theme.id}
                className={`theme-quick-card ${selectedThemeId === theme.id ? 'selected' : ''}`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                <div className="theme-quick-preview" style={{
                  background: theme.colors['--bg-primary']
                }}>
                  {theme.preview && <span className="theme-preview-icon">{theme.preview}</span>}
                </div>
                <h4>{theme.name}</h4>
                <p>{theme.description}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="theme-welcome-actions">
            <button
              className="theme-welcome-btn primary"
              onClick={handleApplyTheme}
              disabled={!selectedThemeId}
            >
              ✓ APPLY SELECTED THEME
            </button>
            <button
              className="theme-welcome-btn secondary"
              onClick={handleSkip}
            >
              SKIP - Use Default
            </button>
          </div>

          {/* Tip */}
          <div className="theme-welcome-tip">
            <p>💡 <strong>Tip:</strong> You can change your theme anytime from <strong>Profile → Customization → Change Theme</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeWelcomeModal;
