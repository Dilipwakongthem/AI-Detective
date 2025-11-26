/**
 * Case Library Manager
 * Manages case unlocks, categorization, daily cases, and premium case packs
 */

import { HAND_CRAFTED_CASES } from '../handCraftedCases.js';
import { TUTORIAL_CASES } from '../tutorialCases.js';
import { COLD_CASE_SCENARIOS } from '../coldCasesHandCrafted.js';

// Simple localStorage helpers
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// Storage Keys
export const LIBRARY_KEYS = {
  unlockedCases: 'ai_detective_unlocked_cases',
  completedCases: 'ai_detective_completed_cases',
  caseProgress: 'ai_detective_case_progress',
  dailyCaseHistory: 'ai_detective_daily_case_history',
  lastDailyCaseDate: 'ai_detective_last_daily_case_date',
  purchasedCasePacks: 'ai_detective_purchased_case_packs',
  premiumLibraryAccess: 'ai_detective_premium_library_access'
};

// Case Pack Definitions
export const CASE_PACKS = {
  starter: {
    id: 'starter_pack',
    name: 'Starter Detective Pack',
    description: '5 beginner-friendly cases to sharpen your skills',
    price: 4.99,
    caseIds: ['stolen_manuscript', 'poisoned_pen', 'insurance_fraud', 'art_forgery', 'missing_heir'],
    difficulty: 1,
    icon: '🔍'
  },
  mystery: {
    id: 'mystery_pack',
    name: 'Mystery Masters Collection',
    description: '6 intermediate cases with clever twists',
    price: 7.99,
    caseIds: ['gallery_heist', 'restaurant_murder', 'digital_alibi', 'locked_room', 'corporate_spy', 'vanishing_act'],
    difficulty: 2,
    icon: '🕵️'
  },
  elite: {
    id: 'elite_pack',
    name: 'Elite Detective Bundle',
    description: '4 expert-level cases that will test your limits',
    price: 9.99,
    caseIds: ['tech_fraud', 'perfect_alibi', 'seven_suspects', 'impossible_murder'],
    difficulty: 3,
    icon: '⭐'
  },
  complete: {
    id: 'complete_collection',
    name: 'Complete Case Collection',
    description: 'All 15 hand-crafted cases + future releases',
    price: 14.99,
    caseIds: 'ALL', // Special flag for all cases
    difficulty: 'all',
    icon: '🎁',
    bestValue: true
  }
};

// Case Categories
export const CASE_CATEGORIES = {
  tutorial: 'Tutorial Cases',
  featured: 'Featured Cases',
  cold_case: 'Cold Case Files',
  procedural: 'Procedural Cases',
  completed: 'Completed Cases',
  daily: 'Daily Case',
  premium: 'Premium Cases'
};

/**
 * Initialize case library data
 */
export const initializeCaseLibrary = () => {
  // Set default unlocked cases (free starter cases)
  const unlocked = loadFromStorage(LIBRARY_KEYS.unlockedCases);
  if (!unlocked) {
    // Unlock first 3 cases by default (tutorial cases)
    const defaultUnlocked = ['stolen_manuscript', 'poisoned_pen', 'insurance_fraud'];
    saveToStorage(LIBRARY_KEYS.unlockedCases, defaultUnlocked);
  }

  // Initialize completed cases tracking
  if (!loadFromStorage(LIBRARY_KEYS.completedCases)) {
    saveToStorage(LIBRARY_KEYS.completedCases, {});
  }

  // Initialize case progress
  if (!loadFromStorage(LIBRARY_KEYS.caseProgress)) {
    saveToStorage(LIBRARY_KEYS.caseProgress, {});
  }

  // Initialize daily case
  if (!loadFromStorage(LIBRARY_KEYS.dailyCaseHistory)) {
    saveToStorage(LIBRARY_KEYS.dailyCaseHistory, []);
  }

  // Initialize purchased packs
  if (!loadFromStorage(LIBRARY_KEYS.purchasedCasePacks)) {
    saveToStorage(LIBRARY_KEYS.purchasedCasePacks, []);
  }

  // Initialize premium library access
  if (loadFromStorage(LIBRARY_KEYS.premiumLibraryAccess) === null) {
    saveToStorage(LIBRARY_KEYS.premiumLibraryAccess, false);
  }
};

/**
 * Get tutorial cases with metadata
 */
export const getTutorialCases = () => {
  return TUTORIAL_CASES.map((caseData, index) => ({
    ...caseData,
    index,
    category: 'tutorial',
    isPremium: false, // Tutorial cases are always free
    isUnlocked: true  // Tutorial cases are always unlocked
  }));
};

/**
 * Get all available hand-crafted cases with metadata
 */
export const getAllHandCraftedCases = () => {
  return HAND_CRAFTED_CASES.map((caseData, index) => ({
    ...caseData,
    index,
    category: 'featured',
    isPremium: !['stolen_manuscript', 'poisoned_pen', 'insurance_fraud'].includes(caseData.id)
  }));
};

/**
 * Get cold case scenarios with metadata
 */
export const getColdCaseCases = () => {
  return COLD_CASE_SCENARIOS.map((caseData, index) => ({
    ...caseData,
    index,
    category: 'cold_case',
    isPremium: false, // Cold cases are free/unlocked
    isUnlocked: true  // Cold cases are always available
  }));
};

/**
 * Get all cases (tutorials + hand-crafted + cold cases)
 */
export const getAllCases = () => {
  return [
    ...getTutorialCases(),
    ...getAllHandCraftedCases(),
    ...getColdCaseCases()
  ];
};

/**
 * Check if a case is unlocked
 */
export const isCaseUnlocked = (caseId) => {
  const unlocked = loadFromStorage(LIBRARY_KEYS.unlockedCases, []);
  const hasPremiumAccess = loadFromStorage(LIBRARY_KEYS.premiumLibraryAccess, false);

  // Premium library access unlocks everything
  if (hasPremiumAccess) return true;

  // Check if specifically unlocked
  return unlocked.includes(caseId);
};

/**
 * Unlock a specific case
 */
export const unlockCase = (caseId) => {
  const unlocked = loadFromStorage(LIBRARY_KEYS.unlockedCases, []);
  if (!unlocked.includes(caseId)) {
    unlocked.push(caseId);
    saveToStorage(LIBRARY_KEYS.unlockedCases, unlocked);
    return true;
  }
  return false;
};

/**
 * Unlock multiple cases (from a pack)
 */
export const unlockCases = (caseIds) => {
  const unlocked = loadFromStorage(LIBRARY_KEYS.unlockedCases, []);
  let newUnlocks = 0;

  caseIds.forEach(caseId => {
    if (!unlocked.includes(caseId)) {
      unlocked.push(caseId);
      newUnlocks++;
    }
  });

  saveToStorage(LIBRARY_KEYS.unlockedCases, unlocked);
  return { success: true, unlockedCount: newUnlocks };
};

/**
 * Purchase a case pack
 */
export const purchaseCasePack = (packId) => {
  // Find pack by ID (supports both key format and id property)
  let pack = CASE_PACKS[packId];

  // If not found by key, try finding by pack.id property
  if (!pack) {
    pack = Object.values(CASE_PACKS).find(p => p.id === packId);
  }

  if (!pack) return { success: false, error: 'Invalid pack' };

  const purchased = loadFromStorage(LIBRARY_KEYS.purchasedCasePacks, []);

  // Check if already purchased (check both formats for compatibility)
  if (purchased.includes(packId) || purchased.includes(pack.id)) {
    return { success: false, error: 'Already purchased' };
  }

  // Get case count for display
  const caseCount = pack.caseIds === 'ALL' ? 15 : pack.caseIds.length;

  // Show purchase confirmation dialog
  const confirmed = window.confirm(
    `🔍 PURCHASE CONFIRMATION\n\n` +
    `Pack: ${pack.name}\n` +
    `Price: $${pack.price.toFixed(2)}\n` +
    `Cases: ${caseCount} hand-crafted detective cases\n` +
    `Difficulty: ${pack.difficulty === 'all' ? 'All Levels' : `Level ${pack.difficulty}`}\n\n` +
    `${pack.description}\n\n` +
    `This will unlock the cases permanently.\n\n` +
    `Click OK to confirm purchase.\n` +
    `Click Cancel to go back.`
  );

  if (!confirmed) {
    return { success: false, error: 'Purchase cancelled by user' };
  }

  // Add to purchased packs (use pack.id for consistency)
  purchased.push(pack.id);
  saveToStorage(LIBRARY_KEYS.purchasedCasePacks, purchased);

  // Unlock cases
  if (pack.caseIds === 'ALL') {
    // Unlock all current and future cases
    saveToStorage(LIBRARY_KEYS.premiumLibraryAccess, true);
    const allCaseIds = HAND_CRAFTED_CASES.map(c => c.id);
    unlockCases(allCaseIds);
  } else {
    unlockCases(pack.caseIds);
  }

  return {
    success: true,
    pack,
    premiumAccess: pack.caseIds === 'ALL'
  };
};

/**
 * Check if a pack is purchased
 */
export const isPackPurchased = (packId) => {
  const purchased = loadFromStorage(LIBRARY_KEYS.purchasedCasePacks, []);

  // Check both packId directly and pack.id property for compatibility
  if (purchased.includes(packId)) return true;

  // Try finding pack by id property
  const pack = Object.values(CASE_PACKS).find(p => p.id === packId);
  if (pack && purchased.includes(pack.id)) return true;

  return false;
};

/**
 * Get unlocked cases count
 */
export const getUnlockedCasesCount = () => {
  const hasPremiumAccess = loadFromStorage(LIBRARY_KEYS.premiumLibraryAccess, false);
  if (hasPremiumAccess) return HAND_CRAFTED_CASES.length;

  const unlocked = loadFromStorage(LIBRARY_KEYS.unlockedCases, []);
  return unlocked.length;
};

/**
 * Mark a case as completed
 */
export const markCaseCompleted = (caseId, stars, time, wasCorrect) => {
  const completed = loadFromStorage(LIBRARY_KEYS.completedCases, {});

  const caseRecord = completed[caseId] || {
    firstCompletedDate: new Date().toISOString(),
    attempts: 0,
    bestStars: 0,
    bestTime: null,
    successfulSolves: 0,
    failedSolves: 0
  };

  caseRecord.attempts++;
  caseRecord.lastAttemptDate = new Date().toISOString();

  if (wasCorrect) {
    caseRecord.successfulSolves++;
    if (stars > caseRecord.bestStars) {
      caseRecord.bestStars = stars;
    }
    if (!caseRecord.bestTime || time < caseRecord.bestTime) {
      caseRecord.bestTime = time;
    }
  } else {
    caseRecord.failedSolves++;
  }

  completed[caseId] = caseRecord;
  saveToStorage(LIBRARY_KEYS.completedCases, completed);

  return caseRecord;
};

/**
 * Get case completion data
 */
export const getCaseCompletion = (caseId) => {
  const completed = loadFromStorage(LIBRARY_KEYS.completedCases, {});
  return completed[caseId] || null;
};

/**
 * Get all completed cases
 */
export const getAllCompletedCases = () => {
  return loadFromStorage(LIBRARY_KEYS.completedCases, {});
};

/**
 * Get completion percentage
 */
export const getCompletionPercentage = () => {
  const completed = getAllCompletedCases();
  const completedCount = Object.keys(completed).filter(
    caseId => completed[caseId].successfulSolves > 0
  ).length;

  return Math.round((completedCount / HAND_CRAFTED_CASES.length) * 100);
};

/**
 * Daily Case System - Rotates through cases
 */
export const getDailyCase = () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const lastDate = loadFromStorage(LIBRARY_KEYS.lastDailyCaseDate);
  const history = loadFromStorage(LIBRARY_KEYS.dailyCaseHistory, []);

  // Check if we need a new daily case
  if (lastDate === today && history.length > 0) {
    // Return today's case
    const todaysCase = history[history.length - 1];
    return {
      case: HAND_CRAFTED_CASES.find(c => c.id === todaysCase.caseId),
      isNew: false,
      date: today
    };
  }

  // Generate new daily case
  // Use date-based seed for consistency (same case all day for all players)
  const seed = parseInt(today.replace(/-/g, ''));
  const recentCaseIds = history.slice(-7).map(h => h.caseId); // Last 7 days

  // Filter out recently used cases
  const availableCases = HAND_CRAFTED_CASES.filter(
    c => !recentCaseIds.includes(c.id)
  );

  // Select case using seeded random
  const selectedCase = availableCases[seed % availableCases.length];

  // Add to history
  history.push({
    caseId: selectedCase.id,
    date: today,
    timestamp: new Date().toISOString()
  });

  // Keep only last 30 days
  if (history.length > 30) {
    history.shift();
  }

  saveToStorage(LIBRARY_KEYS.dailyCaseHistory, history);
  saveToStorage(LIBRARY_KEYS.lastDailyCaseDate, today);

  return {
    case: selectedCase,
    isNew: true,
    date: today
  };
};

/**
 * Check if daily case was completed today
 */
export const wasDailyCaseCompletedToday = () => {
  const dailyCase = getDailyCase();
  const completion = getCaseCompletion(dailyCase.case.id);

  if (!completion) return false;

  const today = new Date().toISOString().split('T')[0];
  const lastAttempt = completion.lastAttemptDate?.split('T')[0];

  return lastAttempt === today && completion.successfulSolves > 0;
};

/**
 * Get featured cases (unlocked, sorted by difficulty)
 */
export const getFeaturedCases = () => {
  const unlocked = loadFromStorage(LIBRARY_KEYS.unlockedCases, []);
  const hasPremiumAccess = loadFromStorage(LIBRARY_KEYS.premiumLibraryAccess, false);

  return HAND_CRAFTED_CASES.map((caseData, index) => ({
    ...caseData,
    index,
    isUnlocked: hasPremiumAccess || unlocked.includes(caseData.id),
    completion: getCaseCompletion(caseData.id)
  })).sort((a, b) => a.difficulty - b.difficulty);
};

/**
 * Get locked premium cases
 */
export const getLockedPremiumCases = () => {
  const featured = getFeaturedCases();
  return featured.filter(c => !c.isUnlocked);
};

/**
 * Get pack recommendations based on player progress
 */
export const getRecommendedPack = () => {
  const unlockedCount = getUnlockedCasesCount();
  const hasPremiumAccess = loadFromStorage(LIBRARY_KEYS.premiumLibraryAccess, false);

  if (hasPremiumAccess) return null; // Already has everything

  const purchased = loadFromStorage(LIBRARY_KEYS.purchasedCasePacks, []);

  // Recommend based on progress
  if (unlockedCount <= 3 && !purchased.includes('starter_pack')) {
    return CASE_PACKS.starter;
  } else if (unlockedCount <= 8 && !purchased.includes('mystery_pack')) {
    return CASE_PACKS.mystery;
  } else if (unlockedCount <= 12 && !purchased.includes('elite_pack')) {
    return CASE_PACKS.elite;
  } else if (!purchased.includes('complete_collection')) {
    return CASE_PACKS.complete;
  }

  return null;
};

/**
 * Search cases by title, description, or crime type
 */
export const searchCases = (query) => {
  const lowerQuery = query.toLowerCase();
  return getFeaturedCases().filter(caseData =>
    caseData.title.toLowerCase().includes(lowerQuery) ||
    caseData.crimeType.toLowerCase().includes(lowerQuery) ||
    caseData.narrative?.opening?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Filter cases by difficulty
 */
export const filterCasesByDifficulty = (minDiff, maxDiff) => {
  return getFeaturedCases().filter(
    c => c.difficulty >= minDiff && c.difficulty <= maxDiff
  );
};

/**
 * Get case statistics
 */
export const getCaseLibraryStats = () => {
  const completed = getAllCompletedCases();
  const unlocked = getUnlockedCasesCount();
  const total = HAND_CRAFTED_CASES.length;

  const perfectSolves = Object.values(completed).filter(
    c => c.bestStars === 5
  ).length;

  const totalAttempts = Object.values(completed).reduce(
    (sum, c) => sum + c.attempts, 0
  );

  const successRate = totalAttempts > 0
    ? Math.round((Object.values(completed).reduce((sum, c) => sum + c.successfulSolves, 0) / totalAttempts) * 100)
    : 0;

  return {
    totalCases: total,
    unlockedCases: unlocked,
    completedCases: Object.keys(completed).length,
    perfectSolves,
    completionPercentage: getCompletionPercentage(),
    totalAttempts,
    successRate
  };
};

export default {
  LIBRARY_KEYS,
  CASE_PACKS,
  CASE_CATEGORIES,
  initializeCaseLibrary,
  getAllHandCraftedCases,
  isCaseUnlocked,
  unlockCase,
  unlockCases,
  purchaseCasePack,
  isPackPurchased,
  getUnlockedCasesCount,
  markCaseCompleted,
  getCaseCompletion,
  getAllCompletedCases,
  getCompletionPercentage,
  getDailyCase,
  wasDailyCaseCompletedToday,
  getFeaturedCases,
  getLockedPremiumCases,
  getRecommendedPack,
  searchCases,
  filterCasesByDifficulty,
  getCaseLibraryStats
};
