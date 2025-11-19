/**
 * Storage Manager - Handles all localStorage operations and data persistence
 * for AI Detective: Crime Scene monetization system
 */

// Storage Keys
export const STORAGE_KEYS = {
  // Player Profile
  playerProfile: 'ai_detective_player_profile',

  // Daily Limits
  dailyCasesRemaining: 'ai_detective_daily_cases_remaining',
  bonusCasesRemaining: 'ai_detective_bonus_cases_remaining',
  lastCaseReset: 'ai_detective_last_case_reset',

  // Purchased Items (Inventory)
  caseFilesOwned: 'ai_detective_case_files_owned',
  hintTokensOwned: 'ai_detective_hint_tokens_owned',

  // Premium Features
  adRemovalPurchased: 'ai_detective_ad_removal_purchased',
  notebookUnlocked: 'ai_detective_notebook_unlocked',
  premiumThemesUnlocked: 'ai_detective_premium_themes_unlocked',

  // Purchase Tracking
  hasMadePurchase: 'ai_detective_has_made_purchase',
  firstPurchaseDate: 'ai_detective_first_purchase_date',
  firstTimeBundleUsed: 'ai_detective_first_time_bundle_used',
  purchaseHistory: 'ai_detective_purchase_history',

  // Ad Tracking
  adCounterHints: 'ai_detective_ad_counter_hints',
  adCounterCases: 'ai_detective_ad_counter_cases',
  lastAdReset: 'ai_detective_last_ad_reset',

  // Session Tracking
  sessionStartTime: 'ai_detective_session_start_time',
  lastInterstitialTime: 'ai_detective_last_interstitial_time',
  interstitialsThisSession: 'ai_detective_interstitials_this_session',
  totalPlayTime: 'ai_detective_total_play_time',

  // Notifications
  lastNotificationCheck: 'ai_detective_last_notification_check'
};

// Default Values
const DEFAULTS = {
  dailyCasesRemaining: 5,
  bonusCasesRemaining: 3,
  caseFilesOwned: 0,
  hintTokensOwned: 0,
  adRemovalPurchased: false,
  notebookUnlocked: false,
  premiumThemesUnlocked: false,
  hasMadePurchase: false,
  firstTimeBundleUsed: false,
  adCounterHints: 0,
  adCounterCases: 0,
  interstitialsThisSession: 0
};

/**
 * Save data to localStorage
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Load data from localStorage
 */
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

/**
 * Clear all game data (for testing or reset)
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Initialize storage on first load
 */
export const initializeStorage = () => {
  // Initialize daily cases
  if (loadFromStorage(STORAGE_KEYS.dailyCasesRemaining) === null) {
    saveToStorage(STORAGE_KEYS.dailyCasesRemaining, DEFAULTS.dailyCasesRemaining);
    saveToStorage(STORAGE_KEYS.bonusCasesRemaining, DEFAULTS.bonusCasesRemaining);
    saveToStorage(STORAGE_KEYS.lastCaseReset, new Date().toISOString());
  }

  // Initialize inventory
  if (loadFromStorage(STORAGE_KEYS.caseFilesOwned) === null) {
    saveToStorage(STORAGE_KEYS.caseFilesOwned, DEFAULTS.caseFilesOwned);
  }

  if (loadFromStorage(STORAGE_KEYS.hintTokensOwned) === null) {
    saveToStorage(STORAGE_KEYS.hintTokensOwned, DEFAULTS.hintTokensOwned);
  }

  // Initialize premium features
  if (loadFromStorage(STORAGE_KEYS.adRemovalPurchased) === null) {
    saveToStorage(STORAGE_KEYS.adRemovalPurchased, DEFAULTS.adRemovalPurchased);
    saveToStorage(STORAGE_KEYS.notebookUnlocked, DEFAULTS.notebookUnlocked);
    saveToStorage(STORAGE_KEYS.premiumThemesUnlocked, DEFAULTS.premiumThemesUnlocked);
  }

  // Initialize purchase tracking
  if (loadFromStorage(STORAGE_KEYS.hasMadePurchase) === null) {
    saveToStorage(STORAGE_KEYS.hasMadePurchase, DEFAULTS.hasMadePurchase);
    saveToStorage(STORAGE_KEYS.firstTimeBundleUsed, DEFAULTS.firstTimeBundleUsed);
    saveToStorage(STORAGE_KEYS.purchaseHistory, []);
  }

  // Initialize ad counters
  if (loadFromStorage(STORAGE_KEYS.adCounterHints) === null) {
    saveToStorage(STORAGE_KEYS.adCounterHints, DEFAULTS.adCounterHints);
    saveToStorage(STORAGE_KEYS.adCounterCases, DEFAULTS.adCounterCases);
    saveToStorage(STORAGE_KEYS.lastAdReset, new Date().toISOString());
  }

  // Initialize session tracking
  saveToStorage(STORAGE_KEYS.sessionStartTime, Date.now());
  saveToStorage(STORAGE_KEYS.interstitialsThisSession, DEFAULTS.interstitialsThisSession);
};

/**
 * Check and reset daily cases at midnight
 */
export const checkAndResetDailyCases = () => {
  const now = new Date();
  const lastReset = loadFromStorage(STORAGE_KEYS.lastCaseReset);

  if (!lastReset) {
    // First time user
    resetDailyCases();
    return { reset: true, message: 'Welcome! 5 free cases + 3 bonus cases available!' };
  }

  const lastResetDate = new Date(lastReset);
  const lastMidnight = new Date(lastResetDate);
  lastMidnight.setHours(0, 0, 0, 0);

  const currentMidnight = new Date(now);
  currentMidnight.setHours(0, 0, 0, 0);

  // If current day is different from last reset day
  if (currentMidnight > lastMidnight) {
    resetDailyCases();
    return { reset: true, message: 'New day! 5 fresh cases + 3 bonus cases available!' };
  }

  return { reset: false };
};

/**
 * Reset daily cases to default values
 */
export const resetDailyCases = () => {
  saveToStorage(STORAGE_KEYS.dailyCasesRemaining, DEFAULTS.dailyCasesRemaining);
  saveToStorage(STORAGE_KEYS.bonusCasesRemaining, DEFAULTS.bonusCasesRemaining);
  saveToStorage(STORAGE_KEYS.lastCaseReset, new Date().toISOString());

  // Also reset ad counters
  saveToStorage(STORAGE_KEYS.adCounterHints, DEFAULTS.adCounterHints);
  saveToStorage(STORAGE_KEYS.adCounterCases, DEFAULTS.adCounterCases);
  saveToStorage(STORAGE_KEYS.lastAdReset, new Date().toISOString());
};

/**
 * Get time until next reset (midnight)
 */
export const getTimeUntilReset = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, totalMs: diff };
};

/**
 * Format time until reset as string
 */
export const formatTimeUntilReset = () => {
  const { hours, minutes } = getTimeUntilReset();
  return `${hours}h ${minutes}m`;
};

/**
 * Use a daily case (free)
 */
export const useDailyCase = () => {
  const remaining = loadFromStorage(STORAGE_KEYS.dailyCasesRemaining, DEFAULTS.dailyCasesRemaining);

  if (remaining > 0) {
    saveToStorage(STORAGE_KEYS.dailyCasesRemaining, remaining - 1);
    return { success: true, remaining: remaining - 1, type: 'daily' };
  }

  return { success: false, remaining: 0, type: 'daily' };
};

/**
 * Use a bonus case (from ad)
 */
export const useBonusCase = () => {
  const remaining = loadFromStorage(STORAGE_KEYS.bonusCasesRemaining, DEFAULTS.bonusCasesRemaining);

  if (remaining > 0) {
    saveToStorage(STORAGE_KEYS.bonusCasesRemaining, remaining - 1);
    return { success: true, remaining: remaining - 1, type: 'bonus' };
  }

  return { success: false, remaining: 0, type: 'bonus' };
};

/**
 * Use a purchased case file
 */
export const useCaseFile = () => {
  const owned = loadFromStorage(STORAGE_KEYS.caseFilesOwned, DEFAULTS.caseFilesOwned);

  if (owned > 0) {
    saveToStorage(STORAGE_KEYS.caseFilesOwned, owned - 1);
    return { success: true, remaining: owned - 1, type: 'purchased' };
  }

  return { success: false, remaining: 0, type: 'purchased' };
};

/**
 * Check if player can start a case
 */
export const canStartCase = () => {
  const daily = loadFromStorage(STORAGE_KEYS.dailyCasesRemaining, DEFAULTS.dailyCasesRemaining);
  const bonus = loadFromStorage(STORAGE_KEYS.bonusCasesRemaining, DEFAULTS.bonusCasesRemaining);
  const caseFiles = loadFromStorage(STORAGE_KEYS.caseFilesOwned, DEFAULTS.caseFilesOwned);

  return {
    canStart: daily > 0 || bonus > 0 || caseFiles > 0,
    dailyRemaining: daily,
    bonusRemaining: bonus,
    caseFilesRemaining: caseFiles,
    totalAvailable: daily + bonus + caseFiles
  };
};

/**
 * Add case files to inventory
 */
export const addCaseFiles = (amount) => {
  const current = loadFromStorage(STORAGE_KEYS.caseFilesOwned, DEFAULTS.caseFilesOwned);
  const newAmount = current + amount;
  saveToStorage(STORAGE_KEYS.caseFilesOwned, newAmount);
  return newAmount;
};

/**
 * Add hint tokens to inventory
 */
export const addHintTokens = (amount) => {
  const current = loadFromStorage(STORAGE_KEYS.hintTokensOwned, DEFAULTS.hintTokensOwned);
  const newAmount = current + amount;
  saveToStorage(STORAGE_KEYS.hintTokensOwned, newAmount);
  return newAmount;
};

/**
 * Use a hint token
 */
export const useHintToken = () => {
  const owned = loadFromStorage(STORAGE_KEYS.hintTokensOwned, DEFAULTS.hintTokensOwned);

  if (owned > 0) {
    saveToStorage(STORAGE_KEYS.hintTokensOwned, owned - 1);
    return { success: true, remaining: owned - 1 };
  }

  return { success: false, remaining: 0 };
};

/**
 * Get hint tokens owned
 */
export const getHintTokens = () => {
  return loadFromStorage(STORAGE_KEYS.hintTokensOwned, DEFAULTS.hintTokensOwned);
};

/**
 * Get case files owned
 */
export const getCaseFiles = () => {
  return loadFromStorage(STORAGE_KEYS.caseFilesOwned, DEFAULTS.caseFilesOwned);
};

/**
 * Increment ad counter
 */
export const incrementAdCounter = (type) => {
  const key = type === 'hints' ? STORAGE_KEYS.adCounterHints : STORAGE_KEYS.adCounterCases;
  const current = loadFromStorage(key, 0);
  saveToStorage(key, current + 1);
  return current + 1;
};

/**
 * Get ad counter
 */
export const getAdCounter = (type) => {
  const key = type === 'hints' ? STORAGE_KEYS.adCounterHints : STORAGE_KEYS.adCounterCases;
  return loadFromStorage(key, 0);
};

/**
 * Check if can watch ad for type
 */
export const canWatchAd = (type) => {
  const limits = {
    hints: 5,
    cases: 3
  };

  const counter = getAdCounter(type);
  return counter < limits[type];
};

/**
 * Mark player as having made a purchase
 */
export const markAsPayingUser = (purchaseData) => {
  saveToStorage(STORAGE_KEYS.hasMadePurchase, true);

  const firstPurchase = loadFromStorage(STORAGE_KEYS.firstPurchaseDate);
  if (!firstPurchase) {
    saveToStorage(STORAGE_KEYS.firstPurchaseDate, new Date().toISOString());
  }

  // Add to purchase history
  const history = loadFromStorage(STORAGE_KEYS.purchaseHistory, []);
  history.push({
    ...purchaseData,
    timestamp: new Date().toISOString()
  });
  saveToStorage(STORAGE_KEYS.purchaseHistory, history);
};

/**
 * Check if player has made any purchase
 */
export const hasAnyPurchaseHistory = () => {
  return loadFromStorage(STORAGE_KEYS.hasMadePurchase, false);
};

/**
 * Enable ad removal
 */
export const enableAdRemoval = () => {
  saveToStorage(STORAGE_KEYS.adRemovalPurchased, true);
  markAsPayingUser({ type: 'ad_removal', item: 'Remove All Ads' });
};

/**
 * Check if ad removal is purchased
 */
export const hasAdRemoval = () => {
  return loadFromStorage(STORAGE_KEYS.adRemovalPurchased, false);
};

/**
 * Unlock notebook
 */
export const unlockNotebook = () => {
  saveToStorage(STORAGE_KEYS.notebookUnlocked, true);
  markAsPayingUser({ type: 'notebook', item: 'Detective Notebook' });
};

/**
 * Check if notebook is unlocked
 */
export const hasNotebook = () => {
  return loadFromStorage(STORAGE_KEYS.notebookUnlocked, false);
};

/**
 * Unlock premium themes
 */
export const unlockPremiumThemes = () => {
  saveToStorage(STORAGE_KEYS.premiumThemesUnlocked, true);
  markAsPayingUser({ type: 'themes', item: 'Premium Themes Pack' });
};

/**
 * Check if premium themes are unlocked
 */
export const hasPremiumThemes = () => {
  return loadFromStorage(STORAGE_KEYS.premiumThemesUnlocked, false);
};

/**
 * Check if first-time bundle is still available
 */
export const isFirstTimeBundleAvailable = () => {
  return !loadFromStorage(STORAGE_KEYS.firstTimeBundleUsed, false);
};

/**
 * Mark first-time bundle as used
 */
export const markFirstTimeBundleUsed = () => {
  saveToStorage(STORAGE_KEYS.firstTimeBundleUsed, true);
};

/**
 * Save player profile
 */
export const savePlayerProfile = (profile) => {
  saveToStorage(STORAGE_KEYS.playerProfile, profile);
};

/**
 * Load player profile
 */
export const loadPlayerProfile = () => {
  return loadFromStorage(STORAGE_KEYS.playerProfile, null);
};

/**
 * Get session duration in seconds
 */
export const getSessionDuration = () => {
  const startTime = loadFromStorage(STORAGE_KEYS.sessionStartTime, Date.now());
  return Math.floor((Date.now() - startTime) / 1000);
};

/**
 * Track interstitial ad shown
 */
export const trackInterstitialShown = () => {
  const current = loadFromStorage(STORAGE_KEYS.interstitialsThisSession, 0);
  saveToStorage(STORAGE_KEYS.interstitialsThisSession, current + 1);
  saveToStorage(STORAGE_KEYS.lastInterstitialTime, Date.now());
};

/**
 * Get last interstitial time
 */
export const getLastInterstitialTime = () => {
  return loadFromStorage(STORAGE_KEYS.lastInterstitialTime, 0);
};

/**
 * Get interstitials shown this session
 */
export const getInterstitialsThisSession = () => {
  return loadFromStorage(STORAGE_KEYS.interstitialsThisSession, 0);
};

/**
 * Export all data (for backup)
 */
export const exportAllData = () => {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = loadFromStorage(key);
  });
  return data;
};

/**
 * Import all data (for restore)
 */
export const importAllData = (data) => {
  Object.entries(data).forEach(([name, value]) => {
    const key = STORAGE_KEYS[name];
    if (key && value !== null && value !== undefined) {
      saveToStorage(key, value);
    }
  });
};

export default {
  STORAGE_KEYS,
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearAllData,
  initializeStorage,
  checkAndResetDailyCases,
  resetDailyCases,
  getTimeUntilReset,
  formatTimeUntilReset,
  useDailyCase,
  useBonusCase,
  useCaseFile,
  canStartCase,
  addCaseFiles,
  addHintTokens,
  useHintToken,
  getHintTokens,
  getCaseFiles,
  incrementAdCounter,
  getAdCounter,
  canWatchAd,
  markAsPayingUser,
  hasAnyPurchaseHistory,
  enableAdRemoval,
  hasAdRemoval,
  unlockNotebook,
  hasNotebook,
  unlockPremiumThemes,
  hasPremiumThemes,
  isFirstTimeBundleAvailable,
  markFirstTimeBundleUsed,
  savePlayerProfile,
  loadPlayerProfile,
  getSessionDuration,
  trackInterstitialShown,
  getLastInterstitialTime,
  getInterstitialsThisSession,
  exportAllData,
  importAllData
};
