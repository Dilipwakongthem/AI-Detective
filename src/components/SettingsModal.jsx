import React, { useState } from 'react';
import soundEngine from '../utils/soundEngine';
import accessibilityManager, { COLORBLIND_MODES } from '../utils/accessibilityManager';
import tutorialSystem from '../utils/tutorialSystem';
import './SettingsModal.css';

const SettingsModal = ({ onClose, playerProfile }) => {
  const [showLinkAccount, setShowLinkAccount] = useState(false);

  // Get user info from localStorage
  const userType = localStorage.getItem('userType') || 'guest';
  const userEmail = localStorage.getItem('currentUserEmail') || '';
  const displayName = localStorage.getItem('displayName') || 'Detective';
  const isGuest = userType === 'guest';

  // Sound state for re-rendering
  const [soundEnabled, setSoundEnabled] = useState(soundEngine.enabled);
  const [volume, setVolume] = useState(soundEngine.masterVolume * 100);

  // Accessibility state
  const [fontSize, setFontSize] = useState(accessibilityManager.getFontSize());
  const [colorblindMode, setColorblindMode] = useState(accessibilityManager.getColorblindMode());
  const [highContrast, setHighContrast] = useState(accessibilityManager.getHighContrast());
  const [reducedMotion, setReducedMotion] = useState(accessibilityManager.getReducedMotion());

  // Link Account form state (must be at top level for React hooks)
  const [linkEmail, setLinkEmail] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [linkConfirmPassword, setLinkConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Handle Logout
   */
  const handleLogout = async () => {
    if (confirm('🚪 Logout?\n\nYour progress is saved.\nYou can login again anytime.')) {
      const userType = localStorage.getItem('userType');

      // If Firebase user, sign out from Firebase first
      if (userType === 'firebase' && window.FirebaseHandlers) {
        try {
          await window.FirebaseHandlers.logout();
          return; // FirebaseHandlers.logout already clears localStorage and redirects
        } catch (error) {
          console.error('[Logout] Firebase logout error:', error);
          // Continue with manual logout if Firebase logout fails
        }
      }

      // Clear ALL session data to prevent auto-login
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('userType');
      localStorage.removeItem('guestUserId');
      localStorage.removeItem('isGuestUser');
      localStorage.removeItem('facebookId');
      localStorage.removeItem('displayName');

      // Play sound
      soundEngine.play('modalClose');

      // Redirect to login
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    }
  };

  /**
   * Handle Delete Account
   */
  const handleDeleteAccount = () => {
    const confirmed = confirm(
      '🗑️ DELETE ACCOUNT?\n\n' +
      '⚠️ WARNING: This action is PERMANENT!\n\n' +
      'All your data will be deleted:\n' +
      '• Case progress\n' +
      '• Reputation and rank\n' +
      '• Purchased items\n' +
      '• Statistics\n\n' +
      'Type DELETE in the next prompt to confirm.'
    );

    if (!confirmed) return;

    const verification = prompt('Type DELETE to confirm account deletion:');

    if (verification !== 'DELETE') {
      alert('❌ Account deletion cancelled');
      return;
    }

    // Delete user from database
    const users = JSON.parse(localStorage.getItem('allUsers') || '{}');
    delete users[userEmail];
    localStorage.setItem('allUsers', JSON.stringify(users));

    // Clear ALL localStorage
    const keysToRemove = [
      'currentUserId', 'currentUserEmail', 'userType', 'displayName',
      'guestUserId', 'isGuestUser', 'reputation', 'rank', 'casesSolved',
      'perfectCases', 'currentStreak', 'longestStreak', 'dailyCasesRemaining',
      'bonusCasesRemaining', 'caseFilesOwned', 'hintTokensOwned',
      'themesData', 'premiumThemesUnlocked', 'notebookData'
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Play error sound
    soundEngine.play('error');

    alert('✅ Account deleted successfully');

    // Redirect to login
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  };

  /**
   * Handle Link Account Form Submission
   */
  const handleLinkAccountSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!linkEmail || !linkPassword) {
      alert('❌ Email and password are required!');
      return;
    }

    if (linkPassword.length < 6) {
      alert('❌ Password must be at least 6 characters!');
      return;
    }

    if (linkPassword !== linkConfirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('allUsers') || '{}');
    if (users[linkEmail.toLowerCase()]) {
      alert('❌ This email is already registered!');
      return;
    }

    // Get current guest data
    const guestUserId = localStorage.getItem('guestUserId');

    // Create new email account with guest data
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Simple password hash (for demo - use proper backend in production)
    let hash = 0;
    for (let i = 0; i < linkPassword.length; i++) {
      const char = linkPassword.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hashedPassword = hash.toString(36);

    const userData = {
      userId: userId,
      email: linkEmail.toLowerCase(),
      password: hashedPassword,
      displayName: displayName,
      userType: 'email',
      linkedFrom: 'guest',
      originalGuestId: guestUserId,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Save user
    users[linkEmail.toLowerCase()] = userData;
    localStorage.setItem('allUsers', JSON.stringify(users));

    // Update local storage
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem('currentUserEmail', linkEmail.toLowerCase());
    localStorage.setItem('userType', 'email');
    localStorage.setItem('isGuestUser', 'false');

    // Remove guest ID
    localStorage.removeItem('guestUserId');

    console.log('Guest account linked to email:', linkEmail);

    // Play success sound
    soundEngine.play('success');

    alert('✅ Account linked successfully!\n\nYou can now login with your email from any device!');

    // Close modals
    setShowLinkAccount(false);
    onClose();

    // Force page reload to update UI
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  /**
   * Render Link Account Form
   */
  const renderLinkAccountForm = () => {

    return (
      <div className="link-account-form">
        <h3>🔗 LINK YOUR ACCOUNT</h3>
        <p className="link-info">Convert your guest account to a permanent email account</p>

        <div className="link-benefits">
          <p><strong>Benefits:</strong></p>
          <ul>
            <li>✅ Access your progress from any device</li>
            <li>✅ Recover your account if you lose access</li>
            <li>✅ Keep all your current progress</li>
            <li>✅ Sync data across devices</li>
          </ul>
        </div>

        <form onSubmit={handleLinkAccountSubmit}>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder="your.email@example.com"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password * (min 6 characters)</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Create a password"
                value={linkPassword}
                onChange={(e) => setLinkPassword(e.target.value)}
                minLength="6"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Confirm your password"
                value={linkConfirmPassword}
                onChange={(e) => setLinkConfirmPassword(e.target.value)}
                minLength="6"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="warning-box">
            <span>⚠️</span>
            <p>This will convert your guest account to a permanent email account. This action cannot be undone.</p>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              🔗 LINK ACCOUNT
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowLinkAccount(false);
                setLinkEmail('');
                setLinkPassword('');
                setLinkConfirmPassword('');
              }}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="settings-header">
          <h2>⚙️ SETTINGS</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">

          {/* Show Link Account Form if in link mode */}
          {showLinkAccount ? (
            renderLinkAccountForm()
          ) : (
            <>
              {/* Account Section */}
              <div className="settings-section">
                <h3>👤 ACCOUNT</h3>

                <div className="user-info-card">
                  <div className="user-avatar">{isGuest ? '👤' : '📧'}</div>
                  <div className="user-details">
                    <div className="user-name">{displayName}</div>
                    {isGuest ? (
                      <div className="user-status">Playing as Guest</div>
                    ) : (
                      <div className="user-email">{userEmail}</div>
                    )}
                    <div className="user-stats">
                      <span>🏆 {playerProfile.rank}</span>
                      <span>⭐ {playerProfile.reputation} Rep</span>
                    </div>
                  </div>
                </div>

                {isGuest && (
                  <div className="guest-warning">
                    <span>⚠️</span>
                    <p>Guest progress is only saved on this device. Link an account to sync across devices!</p>
                  </div>
                )}

                <div className="account-actions">
                  {isGuest ? (
                    <>
                      <button className="action-btn primary-btn" onClick={() => setShowLinkAccount(true)}>
                        🔗 LINK ACCOUNT
                      </button>
                      <button className="action-btn secondary-btn" onClick={handleLogout}>
                        🚪 LOGOUT
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="action-btn danger-btn" onClick={handleDeleteAccount}>
                        🗑️ DELETE ACCOUNT
                      </button>
                      <button className="action-btn secondary-btn" onClick={handleLogout}>
                        🚪 LOGOUT
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Sound Section */}
              <div className="settings-section">
                <h3>🔊 SOUND</h3>

                <div className="setting-row">
                  <div className="setting-label">
                    <span className="setting-name">Sound Effects</span>
                    <small className="setting-desc">Enable/disable all sounds</small>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={() => {
                        const enabled = soundEngine.toggleEnabled();
                        setSoundEnabled(enabled);
                        if (enabled) soundEngine.play('success');
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-row">
                  <div className="setting-label">
                    <span className="setting-name">Volume</span>
                    <small className="setting-desc">{Math.round(volume)}%</small>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      soundEngine.setVolume(val / 100);
                      setVolume(val);
                    }}
                    onMouseUp={() => soundEngine.play('click')}
                    className="volume-slider"
                  />
                </div>

                <button
                  className="test-sound-btn"
                  onClick={() => soundEngine.play('success')}
                >
                  🔊 TEST SOUND
                </button>
              </div>

              {/* Accessibility Section */}
              <div className="settings-section">
                <h3>♿ ACCESSIBILITY</h3>

                {/* Font Size */}
                <div className="setting-row">
                  <div className="setting-label">
                    <span className="setting-name">Font Size</span>
                    <small className="setting-desc">Adjust text size for better readability</small>
                  </div>
                  <select
                    className="setting-select"
                    value={fontSize}
                    onChange={(e) => {
                      const newSize = e.target.value;
                      accessibilityManager.setFontSize(newSize);
                      setFontSize(newSize);
                      soundEngine.play('click');
                    }}
                  >
                    <option value="small">Small</option>
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                    <option value="x-large">Extra Large</option>
                  </select>
                </div>

                {/* Colorblind Mode */}
                <div className="setting-row">
                  <div className="setting-label">
                    <span className="setting-name">Colorblind Mode</span>
                    <small className="setting-desc">Adjust colors for color vision deficiency</small>
                  </div>
                  <select
                    className="setting-select"
                    value={colorblindMode}
                    onChange={(e) => {
                      const newMode = e.target.value;
                      accessibilityManager.setColorblindMode(newMode);
                      setColorblindMode(newMode);
                      soundEngine.play('click');
                    }}
                  >
                    {Object.entries(COLORBLIND_MODES).map(([key, mode]) => (
                      <option key={key} value={key}>
                        {mode.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* High Contrast */}
                <div className="setting-row">
                  <div className="setting-label">
                    <span className="setting-name">High Contrast</span>
                    <small className="setting-desc">Increase visual contrast for better visibility</small>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={() => {
                        const newValue = !highContrast;
                        accessibilityManager.setHighContrast(newValue);
                        setHighContrast(newValue);
                        soundEngine.play('click');
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Reduced Motion */}
                <div className="setting-row">
                  <div className="setting-label">
                    <span className="setting-name">Reduced Motion</span>
                    <small className="setting-desc">Minimize animations and transitions</small>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={reducedMotion}
                      onChange={() => {
                        const newValue = !reducedMotion;
                        accessibilityManager.setReducedMotion(newValue);
                        setReducedMotion(newValue);
                        soundEngine.play('click');
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Reset Tutorial */}
                <div className="setting-row">
                  <div className="setting-label">
                    <span className="setting-name">Tutorial</span>
                    <small className="setting-desc">Restart the game tutorial for new players</small>
                  </div>
                  <button
                    className="action-btn secondary-btn small-btn"
                    onClick={() => {
                      if (confirm('Restart the tutorial? This will show all tutorial steps again.')) {
                        tutorialSystem.reset();
                        soundEngine.play('success');
                        alert('✅ Tutorial reset! It will start on your next case.');
                      }
                    }}
                  >
                    🔄 Reset Tutorial
                  </button>
                </div>
              </div>

              {/* About Section */}
              <div className="settings-section">
                <h3>ℹ️ ABOUT</h3>
                <div className="about-info">
                  <p><strong>AI Detective: Crime Scene</strong></p>
                  <p>Version 1.0.0</p>
                  <p>© 2025 All Rights Reserved</p>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
