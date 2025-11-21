// Accessibility Manager for AI Detective Game
// Handles font scaling, colorblind modes, and other accessibility features

const ACCESSIBILITY_STORAGE_KEY = 'ai_detective_accessibility';

// Default accessibility settings
const DEFAULT_SETTINGS = {
  fontSize: 'normal', // 'small', 'normal', 'large', 'x-large'
  colorblindMode: 'none', // 'none', 'protanopia', 'deuteranopia', 'tritanopia'
  highContrast: false,
  reducedMotion: false,
  screenReaderOptimized: false
};

// Font size multipliers
const FONT_SIZE_SCALES = {
  small: 0.875,   // 87.5% of base
  normal: 1.0,    // 100% base
  large: 1.15,    // 115% of base
  'x-large': 1.3  // 130% of base
};

// Colorblind mode filters and color adjustments
const COLORBLIND_MODES = {
  none: {
    name: 'None (Default)',
    description: 'Standard color palette',
    filters: {}
  },
  protanopia: {
    name: 'Protanopia (Red-Blind)',
    description: 'Difficulty perceiving red/green',
    filters: {
      '--color-primary': '#f5a742',     // Orange instead of gold
      '--color-accent': '#5dade2',      // Light blue
      '--color-success': '#48c9b0',     // Teal instead of green
      '--color-error': '#e67e22',       // Orange instead of red
      '--color-warning': '#f39c12'      // Kept similar
    }
  },
  deuteranopia: {
    name: 'Deuteranopia (Green-Blind)',
    description: 'Difficulty perceiving green/red',
    filters: {
      '--color-primary': '#f5a742',
      '--color-accent': '#5dade2',
      '--color-success': '#3498db',     // Blue instead of green
      '--color-error': '#d68910',       // Dark orange instead of red
      '--color-warning': '#f39c12'
    }
  },
  tritanopia: {
    name: 'Tritanopia (Blue-Blind)',
    description: 'Difficulty perceiving blue/yellow',
    filters: {
      '--color-primary': '#e74c3c',     // Red instead of gold
      '--color-accent': '#1abc9c',      // Turquoise instead of blue
      '--color-success': '#16a085',     // Dark teal
      '--color-error': '#c0392b',       // Dark red
      '--color-warning': '#e67e22'      // Orange instead of yellow
    }
  }
};

class AccessibilityManager {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.loadSettings();
    this.applySettings();
  }

  // Load settings from localStorage
  loadSettings() {
    try {
      const saved = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.settings = { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  }

  // Save settings to localStorage
  saveSettings() {
    try {
      localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  }

  // Apply all current settings
  applySettings() {
    this.applyFontSize();
    this.applyColorblindMode();
    this.applyHighContrast();
    this.applyReducedMotion();
  }

  // Font size management
  setFontSize(size) {
    if (!FONT_SIZE_SCALES[size]) {
      console.error('Invalid font size:', size);
      return;
    }

    this.settings.fontSize = size;
    this.applyFontSize();
    this.saveSettings();
  }

  applyFontSize() {
    const scale = FONT_SIZE_SCALES[this.settings.fontSize];
    document.documentElement.style.setProperty('--font-scale', scale);

    // Also update body font size directly for better compatibility
    const baseSize = 16; // Base font size in pixels
    document.documentElement.style.fontSize = `${baseSize * scale}px`;
  }

  getFontSize() {
    return this.settings.fontSize;
  }

  // Colorblind mode management
  setColorblindMode(mode) {
    if (!COLORBLIND_MODES[mode]) {
      console.error('Invalid colorblind mode:', mode);
      return;
    }

    this.settings.colorblindMode = mode;
    this.applyColorblindMode();
    this.saveSettings();
  }

  applyColorblindMode() {
    const mode = COLORBLIND_MODES[this.settings.colorblindMode];

    if (mode && mode.filters) {
      // Apply color filters
      Object.entries(mode.filters).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
    } else {
      // Reset to default (remove custom properties)
      this.resetColorFilters();
    }

    // Add CSS class for additional mode-specific styling
    document.body.classList.remove('cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia');
    if (this.settings.colorblindMode !== 'none') {
      document.body.classList.add(`cb-${this.settings.colorblindMode}`);
    }
  }

  resetColorFilters() {
    // Reset color properties to allow theme defaults
    const properties = ['--color-primary', '--color-accent', '--color-success', '--color-error', '--color-warning'];
    properties.forEach(prop => {
      document.documentElement.style.removeProperty(prop);
    });
  }

  getColorblindMode() {
    return this.settings.colorblindMode;
  }

  getColorblindModes() {
    return COLORBLIND_MODES;
  }

  // High contrast mode
  setHighContrast(enabled) {
    this.settings.highContrast = enabled;
    this.applyHighContrast();
    this.saveSettings();
  }

  applyHighContrast() {
    if (this.settings.highContrast) {
      document.body.classList.add('high-contrast');
      // Increase contrast by adjusting CSS variables
      document.documentElement.style.setProperty('--text-contrast', '1.5');
      document.documentElement.style.setProperty('--border-width', '2px');
    } else {
      document.body.classList.remove('high-contrast');
      document.documentElement.style.setProperty('--text-contrast', '1.0');
      document.documentElement.style.setProperty('--border-width', '1px');
    }
  }

  getHighContrast() {
    return this.settings.highContrast;
  }

  // Reduced motion (for animations)
  setReducedMotion(enabled) {
    this.settings.reducedMotion = enabled;
    this.applyReducedMotion();
    this.saveSettings();
  }

  applyReducedMotion() {
    if (this.settings.reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }

  getReducedMotion() {
    return this.settings.reducedMotion;
  }

  // Screen reader optimization
  setScreenReaderOptimized(enabled) {
    this.settings.screenReaderOptimized = enabled;
    this.saveSettings();
  }

  getScreenReaderOptimized() {
    return this.settings.screenReaderOptimized;
  }

  // Get all settings
  getAllSettings() {
    return { ...this.settings };
  }

  // Reset to defaults
  resetToDefaults() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.applySettings();
    this.saveSettings();
  }
}

// Create singleton instance
const accessibilityManager = new AccessibilityManager();

// Initialize on load
export function initializeAccessibility() {
  accessibilityManager.applySettings();
}

export default accessibilityManager;
export { FONT_SIZE_SCALES, COLORBLIND_MODES };
