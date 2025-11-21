/**
 * Theme Manager - Handles Premium Themes Pack
 * Manages theme selection and application for AI Detective
 */

import { hasPremiumThemes } from './storageManager';

const STORAGE_KEY = 'ai_detective_selected_theme';

/**
 * Theme Definitions
 * Each theme includes CSS custom properties
 */
export const THEMES = {
  default: {
    id: 'default',
    name: 'Default Detective',
    description: 'Calming sky-blue and ocean theme',
    isPremium: false,
    colors: {
      // Background colors - Orange and Blue gradient
      '--bg-primary': 'linear-gradient(135deg, #1a2332 0%, #16213e 100%)',
      '--bg-secondary': 'rgba(22, 33, 62, 0.95)',
      '--bg-card': 'rgba(30, 45, 70, 0.5)',
      '--bg-overlay': 'rgba(15, 25, 40, 0.9)',

      // Primary colors - Sky Blue / Azure
      '--color-primary': '#5DADE2',
      '--color-primary-light': '#85C1E9',
      '--color-primary-dark': '#3498DB',

      // Accent colors - Blue and Orange accents
      '--color-accent': '#2E86C1',
      '--color-accent-light': '#5DADE2',
      '--color-success': '#52B788',
      '--color-danger': '#e74c3c',
      '--color-warning': '#FF8C42',

      // Text colors
      '--text-primary': '#ffffff',
      '--text-secondary': '#e4e4e4',
      '--text-muted': '#9ca3af',

      // Border colors - Sky Blue
      '--border-primary': '#5DADE2',
      '--border-secondary': 'rgba(93, 173, 226, 0.3)',

      // Button colors - Blue primary
      '--btn-primary-bg': '#2E86C1',
      '--btn-primary-hover': '#2471A3',
      '--btn-secondary-bg': '#5499C7',
      '--btn-danger-bg': '#e74c3c',

      // Shadow - Sky Blue glow
      '--shadow-primary': 'rgba(93, 173, 226, 0.3)',
      '--shadow-secondary': 'rgba(0, 0, 0, 0.3)'
    }
  },

  classic_noir: {
    id: 'classic_noir',
    name: 'Classic Noir',
    description: 'Black & white detective aesthetic',
    isPremium: true,
    preview: '⚫⚪',
    colors: {
      // Background colors - Pure black and white
      '--bg-primary': 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      '--bg-secondary': 'rgba(0, 0, 0, 0.95)',
      '--bg-card': 'rgba(20, 20, 20, 0.8)',
      '--bg-overlay': 'rgba(0, 0, 0, 0.95)',

      // Primary colors - White/gray
      '--color-primary': '#ffffff',
      '--color-primary-light': '#e5e5e5',
      '--color-primary-dark': '#cccccc',

      // Accent colors - Grays
      '--color-accent': '#808080',
      '--color-accent-light': '#a0a0a0',
      '--color-success': '#ffffff',
      '--color-danger': '#606060',
      '--color-warning': '#a0a0a0',

      // Text colors
      '--text-primary': '#ffffff',
      '--text-secondary': '#cccccc',
      '--text-muted': '#808080',

      // Border colors
      '--border-primary': '#ffffff',
      '--border-secondary': 'rgba(255, 255, 255, 0.3)',

      // Button colors
      '--btn-primary-bg': '#404040',
      '--btn-primary-hover': '#606060',
      '--btn-secondary-bg': '#2a2a2a',
      '--btn-danger-bg': '#505050',

      // Shadow
      '--shadow-primary': 'rgba(255, 255, 255, 0.2)',
      '--shadow-secondary': 'rgba(0, 0, 0, 0.8)'
    }
  },

  neon_detective: {
    id: 'neon_detective',
    name: 'Neon Detective',
    description: 'Cyberpunk neon aesthetics',
    isPremium: true,
    preview: '🌃💜',
    colors: {
      // Background colors - Dark cyberpunk
      '--bg-primary': 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)',
      '--bg-secondary': 'rgba(10, 10, 26, 0.95)',
      '--bg-card': 'rgba(26, 10, 46, 0.6)',
      '--bg-overlay': 'rgba(10, 10, 26, 0.9)',

      // Primary colors - Cyan neon
      '--color-primary': '#00ffff',
      '--color-primary-light': '#66ffff',
      '--color-primary-dark': '#00cccc',

      // Accent colors - Purple/pink neon
      '--color-accent': '#ff00ff',
      '--color-accent-light': '#ff66ff',
      '--color-success': '#00ff00',
      '--color-danger': '#ff0066',
      '--color-warning': '#ffff00',

      // Text colors
      '--text-primary': '#00ffff',
      '--text-secondary': '#ff00ff',
      '--text-muted': '#9966ff',

      // Border colors
      '--border-primary': '#00ffff',
      '--border-secondary': 'rgba(0, 255, 255, 0.4)',

      // Button colors
      '--btn-primary-bg': '#9900ff',
      '--btn-primary-hover': '#bb00ff',
      '--btn-secondary-bg': '#660099',
      '--btn-danger-bg': '#ff0066',

      // Shadow - Neon glow
      '--shadow-primary': 'rgba(0, 255, 255, 0.6)',
      '--shadow-secondary': 'rgba(255, 0, 255, 0.4)'
    }
  },

  vintage_typewriter: {
    id: 'vintage_typewriter',
    name: 'Vintage Typewriter',
    description: 'Classic paper and ink aesthetic',
    isPremium: true,
    preview: '📜✒️',
    colors: {
      // Background colors - Aged paper
      '--bg-primary': 'linear-gradient(135deg, #f4e8d0 0%, #e8d5b7 100%)',
      '--bg-secondary': 'rgba(244, 232, 208, 0.95)',
      '--bg-card': 'rgba(210, 180, 140, 0.9)',  // Darker tan for better contrast
      '--bg-overlay': 'rgba(139, 115, 85, 0.9)',

      // Primary colors - Ink brown
      '--color-primary': '#3d2817',
      '--color-primary-light': '#5c3d2e',
      '--color-primary-dark': '#2a1810',

      // Accent colors - Vintage tones
      '--color-accent': '#8b6914',
      '--color-accent-light': '#a67c00',
      '--color-success': '#556b2f',
      '--color-danger': '#8b4513',
      '--color-warning': '#d2691e',

      // Text colors - Darker for better readability
      '--text-primary': '#1a0f08',  // Much darker brown
      '--text-secondary': '#2a1810',  // Dark brown
      '--text-muted': '#5c4033',  // Medium brown instead of light

      // Border colors
      '--border-primary': '#3d2817',
      '--border-secondary': 'rgba(61, 40, 23, 0.3)',

      // Button colors
      '--btn-primary-bg': '#8b6914',
      '--btn-primary-hover': '#a67c00',
      '--btn-secondary-bg': '#bc9667',
      '--btn-danger-bg': '#8b4513',

      // Shadow
      '--shadow-primary': 'rgba(61, 40, 23, 0.3)',
      '--shadow-secondary': 'rgba(0, 0, 0, 0.15)'
    }
  },

  modern_minimalist: {
    id: 'modern_minimalist',
    name: 'Modern Minimalist',
    description: 'Clean and contemporary design',
    isPremium: true,
    preview: '⬜️🎨',
    colors: {
      // Background colors - Light minimalist
      '--bg-primary': 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      '--bg-secondary': 'rgba(248, 249, 250, 0.95)',
      '--bg-card': 'rgba(240, 243, 246, 0.95)',  // Slightly darker for contrast
      '--bg-overlay': 'rgba(233, 236, 239, 0.95)',

      // Primary colors - Blue accent
      '--color-primary': '#0066cc',
      '--color-primary-light': '#3385d6',
      '--color-primary-dark': '#0052a3',

      // Accent colors - Modern palette
      '--color-accent': '#6366f1',
      '--color-accent-light': '#818cf8',
      '--color-success': '#10b981',
      '--color-danger': '#ef4444',
      '--color-warning': '#f59e0b',

      // Text colors - Darker for better readability
      '--text-primary': '#0f172a',  // Much darker gray-blue
      '--text-secondary': '#334155',  // Dark gray
      '--text-muted': '#64748b',  // Medium gray instead of light

      // Border colors
      '--border-primary': '#0066cc',
      '--border-secondary': 'rgba(0, 102, 204, 0.2)',

      // Button colors
      '--btn-primary-bg': '#0066cc',
      '--btn-primary-hover': '#0052a3',
      '--btn-secondary-bg': '#6b7280',
      '--btn-danger-bg': '#ef4444',

      // Shadow
      '--shadow-primary': 'rgba(0, 102, 204, 0.2)',
      '--shadow-secondary': 'rgba(0, 0, 0, 0.1)'
    }
  },

  dark_deluxe: {
    id: 'dark_deluxe',
    name: 'Dark Mode Deluxe',
    description: 'OLED-optimized pure black theme',
    isPremium: true,
    preview: '🌑✨',
    colors: {
      // Background colors - True black (OLED)
      '--bg-primary': 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
      '--bg-secondary': 'rgba(0, 0, 0, 0.98)',
      '--bg-card': 'rgba(15, 15, 15, 0.9)',
      '--bg-overlay': 'rgba(0, 0, 0, 0.95)',

      // Primary colors - Gold accent
      '--color-primary': '#ffd700',
      '--color-primary-light': '#ffe55c',
      '--color-primary-dark': '#ccac00',

      // Accent colors - Rich colors on black
      '--color-accent': '#00d4ff',
      '--color-accent-light': '#66e0ff',
      '--color-success': '#00ff88',
      '--color-danger': '#ff4466',
      '--color-warning': '#ffaa00',

      // Text colors
      '--text-primary': '#ffffff',
      '--text-secondary': '#e0e0e0',
      '--text-muted': '#808080',

      // Border colors
      '--border-primary': '#ffd700',
      '--border-secondary': 'rgba(255, 215, 0, 0.3)',

      // Button colors
      '--btn-primary-bg': '#1a1a1a',
      '--btn-primary-hover': '#2a2a2a',
      '--btn-secondary-bg': '#0f0f0f',
      '--btn-danger-bg': '#ff4466',

      // Shadow - Subtle glow
      '--shadow-primary': 'rgba(255, 215, 0, 0.3)',
      '--shadow-secondary': 'rgba(255, 255, 255, 0.05)'
    }
  }
};

/**
 * Get currently selected theme ID
 */
export const getCurrentTheme = () => {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    return savedTheme || 'default';
  } catch (error) {
    console.error('[ThemeManager] Error loading theme:', error);
    return 'default';
  }
};

/**
 * Get currently selected theme object
 */
export const getCurrentThemeObject = () => {
  const themeId = getCurrentTheme();
  return THEMES[themeId] || THEMES.default;
};

/**
 * Set theme
 */
export const setTheme = (themeId) => {
  const theme = THEMES[themeId];

  if (!theme) {
    console.error(`[ThemeManager] Theme not found: ${themeId}`);
    return false;
  }

  // Check if premium theme
  if (theme.isPremium && !hasPremiumThemes()) {
    console.error('[ThemeManager] Premium themes not unlocked');
    return false;
  }

  // Apply theme to CSS variables
  applyTheme(themeId);

  // Save selection
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
    console.log(`[ThemeManager] Theme set to: ${theme.name}`);
    return true;
  } catch (error) {
    console.error('[ThemeManager] Error saving theme:', error);
    return false;
  }
};

/**
 * Apply theme by updating CSS custom properties
 */
export const applyTheme = (themeId) => {
  const theme = THEMES[themeId];

  if (!theme) {
    console.error(`[ThemeManager] Theme not found: ${themeId}`);
    return;
  }

  const root = document.documentElement;

  console.log(`[ThemeManager] Applying theme: ${theme.name}`);

  // Remove all existing theme classes first
  document.body.className = document.body.className
    .split(' ')
    .filter(c => !c.startsWith('theme-'))
    .join(' ');

  // Apply all color variables to root
  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Also set common aliases for easier CSS usage
  root.style.setProperty('--primary-color', theme.colors['--color-primary']);
  root.style.setProperty('--secondary-color', theme.colors['--color-accent']);
  root.style.setProperty('--bg-color', theme.colors['--bg-primary']);
  root.style.setProperty('--text-color', theme.colors['--text-primary']);

  // Add theme class to body for theme-specific styling
  document.body.classList.add(`theme-${themeId}`);

  // Set data attribute for CSS targeting
  document.body.setAttribute('data-theme', themeId);

  // Trigger custom event for components that need to react to theme changes
  window.dispatchEvent(new CustomEvent('themeChanged', {
    detail: { themeId, theme }
  }));

  console.log(`[ThemeManager] Applied theme: ${theme.name}`);
};

/**
 * Get available themes (only unlocked ones)
 */
export const getAvailableThemes = () => {
  const isPremiumUnlocked = hasPremiumThemes();

  return Object.values(THEMES).filter(theme => {
    return !theme.isPremium || isPremiumUnlocked;
  });
};

/**
 * Get all premium themes
 */
export const getPremiumThemes = () => {
  return Object.values(THEMES).filter(theme => theme.isPremium);
};

/**
 * Initialize theme system on app load
 */
export const initializeTheme = () => {
  const savedTheme = getCurrentTheme();
  applyTheme(savedTheme);
  console.log('[ThemeManager] Theme system initialized');
};

/**
 * Reset to default theme
 */
export const resetTheme = () => {
  setTheme('default');
};

/**
 * Get theme by ID
 */
export const getTheme = (themeId) => {
  return THEMES[themeId] || THEMES.default;
};

/**
 * Check if theme is unlocked
 */
export const isThemeUnlocked = (themeId) => {
  const theme = THEMES[themeId];

  if (!theme) return false;
  if (!theme.isPremium) return true;

  return hasPremiumThemes();
};

export default {
  THEMES,
  getCurrentTheme,
  setTheme,
  applyTheme,
  getAvailableThemes,
  getPremiumThemes,
  initializeTheme,
  resetTheme,
  getTheme,
  isThemeUnlocked
};
