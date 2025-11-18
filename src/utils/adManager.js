/**
 * Ad Manager - Handles all ad operations (rewarded & interstitial)
 * for AI Detective: Crime Scene
 *
 * NOTE: This is a placeholder implementation. For production:
 * - Integrate with Google AdMob SDK
 * - Replace mock functions with real ad loading/display
 * - Add proper error handling and callbacks
 */

import {
  getAdCounter,
  incrementAdCounter,
  canWatchAd,
  hasAdRemoval,
  hasAnyPurchaseHistory,
  getSessionDuration,
  getLastInterstitialTime,
  getInterstitialsThisSession,
  trackInterstitialShown
} from './storageManager';

// Ad Network Configuration (Replace with actual AdMob IDs)
const AD_CONFIG = {
  // Replace these with your actual AdMob ad unit IDs
  rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917', // Test ID
  interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712', // Test ID

  // Ad limits
  maxRewardedHintsPerDay: 5,
  maxRewardedCasesPerDay: 3,

  // Interstitial rules
  interstitialMinSessionTime: 1800, // 30 minutes in seconds
  interstitialCooldown: 1800, // 30 minutes in seconds
  maxInterstitialsPerSession: 1,

  // Test mode (set to false in production)
  testMode: true
};

/**
 * Initialize ad network
 * Call this on app startup
 */
export const initializeAds = () => {
  if (AD_CONFIG.testMode) {
    console.log('[AdManager] Initializing in TEST MODE');
    console.log('[AdManager] Replace with actual AdMob SDK initialization');
  }

  // TODO: Initialize AdMob SDK here
  // Example (pseudo-code):
  // if (window.admob) {
  //   window.admob.start();
  //   window.admob.setOptions({
  //     testDevices: AD_CONFIG.testMode ? ['DEVICE_ID'] : []
  //   });
  // }

  return {
    initialized: true,
    testMode: AD_CONFIG.testMode
  };
};

/**
 * Load a rewarded video ad
 * @param {string} type - 'hints' or 'cases'
 */
const loadRewardedAd = async (type) => {
  return new Promise((resolve, reject) => {
    if (AD_CONFIG.testMode) {
      console.log(`[AdManager] Loading rewarded ad for ${type}...`);
      // Simulate ad loading delay
      setTimeout(() => {
        resolve({ loaded: true, type });
      }, 1000);
    } else {
      // TODO: Load actual rewarded ad
      // Example (pseudo-code):
      // window.admob.rewardedVideo.load({
      //   id: AD_CONFIG.rewardedAdUnitId,
      //   autoShow: false
      // }).then(resolve).catch(reject);

      reject(new Error('AdMob not implemented'));
    }
  });
};

/**
 * Show a rewarded video ad
 * @param {string} type - 'hints', 'cases', or 'reputation'
 * @param {function} onReward - Callback when user earns reward
 * @param {function} onError - Callback when ad fails
 */
export const showRewardedAd = async (type, onReward, onError) => {
  try {
    // Check if player has ad removal
    if (hasAdRemoval() && type !== 'reputation') {
      // Ad-free users shouldn't see ads
      // But they can still get rewards for free
      if (onReward) {
        onReward({ earned: true, skipped: true, reason: 'premium_user' });
      }
      return;
    }

    // Check ad limits (except for reputation doubler)
    if (type === 'hints' || type === 'cases') {
      if (!canWatchAd(type)) {
        throw new Error(`Daily limit reached for ${type} ads`);
      }
    }

    // Load the ad
    const ad = await loadRewardedAd(type);

    if (!ad.loaded) {
      throw new Error('Ad failed to load');
    }

    // Show the ad
    if (AD_CONFIG.testMode) {
      console.log(`[AdManager] Showing rewarded ad for ${type}...`);

      // Simulate ad watching experience
      const watchAd = await simulateAdWatching(type);

      if (watchAd.completed) {
        // Increment counter
        if (type === 'hints' || type === 'cases') {
          incrementAdCounter(type);
        }

        // Grant reward
        if (onReward) {
          onReward({
            earned: true,
            type,
            counter: getAdCounter(type)
          });
        }
      } else {
        throw new Error('Ad was skipped or closed early');
      }
    } else {
      // TODO: Show actual rewarded ad
      // Example (pseudo-code):
      // window.admob.rewardedVideo.show();
      // window.admob.rewardedVideo.on('reward', (reward) => {
      //   incrementAdCounter(type);
      //   if (onReward) onReward({ earned: true, type, reward });
      // });

      throw new Error('AdMob not implemented');
    }
  } catch (error) {
    console.error('[AdManager] Rewarded ad error:', error);
    if (onError) {
      onError(error);
    }
  }
};

/**
 * Simulate ad watching (for testing)
 */
const simulateAdWatching = (type) => {
  return new Promise((resolve) => {
    // Show a confirmation dialog simulating ad completion
    const watch = window.confirm(
      `[TEST MODE]\n\nSimulating ${type} ad...\n\nClick OK to complete the ad and earn reward.\nClick Cancel to simulate ad skip.`
    );

    setTimeout(() => {
      resolve({ completed: watch });
    }, 500);
  });
};

/**
 * Check if should show interstitial ad
 */
const shouldShowInterstitial = () => {
  // Never show to paying users
  if (hasAnyPurchaseHistory()) {
    return false;
  }

  // Check session time (must be 30+ minutes)
  const sessionDuration = getSessionDuration();
  if (sessionDuration < AD_CONFIG.interstitialMinSessionTime) {
    return false;
  }

  // Check if already shown one this session
  if (getInterstitialsThisSession() >= AD_CONFIG.maxInterstitialsPerSession) {
    return false;
  }

  // Check cooldown (30 min since last ad)
  const lastInterstitialTime = getLastInterstitialTime();
  if (lastInterstitialTime > 0) {
    const timeSinceLastAd = (Date.now() - lastInterstitialTime) / 1000;
    if (timeSinceLastAd < AD_CONFIG.interstitialCooldown) {
      return false;
    }
  }

  return true;
};

/**
 * Load interstitial ad
 */
const loadInterstitialAd = async () => {
  return new Promise((resolve, reject) => {
    if (AD_CONFIG.testMode) {
      console.log('[AdManager] Loading interstitial ad...');
      // Simulate ad loading delay
      setTimeout(() => {
        resolve({ loaded: true });
      }, 800);
    } else {
      // TODO: Load actual interstitial ad
      // Example (pseudo-code):
      // window.admob.interstitial.load({
      //   id: AD_CONFIG.interstitialAdUnitId,
      //   autoShow: false
      // }).then(resolve).catch(reject);

      reject(new Error('AdMob not implemented'));
    }
  });
};

/**
 * Show interstitial ad
 * @param {string} context - Context where ad is shown
 */
export const showInterstitialAd = async (context) => {
  try {
    // Check if should show
    if (!shouldShowInterstitial()) {
      console.log('[AdManager] Interstitial ad blocked by rules');
      return { shown: false, reason: 'blocked_by_rules' };
    }

    // Load the ad
    const ad = await loadInterstitialAd();

    if (!ad.loaded) {
      throw new Error('Interstitial ad failed to load');
    }

    // Show the ad
    if (AD_CONFIG.testMode) {
      console.log(`[AdManager] Showing interstitial ad (context: ${context})...`);

      // Simulate ad display
      const result = await simulateInterstitial();

      if (result.completed) {
        // Track the ad
        trackInterstitialShown();

        return {
          shown: true,
          context
        };
      } else {
        return {
          shown: false,
          reason: 'user_skipped'
        };
      }
    } else {
      // TODO: Show actual interstitial ad
      // Example (pseudo-code):
      // window.admob.interstitial.show();
      // window.admob.interstitial.on('close', () => {
      //   trackInterstitialShown();
      // });

      throw new Error('AdMob not implemented');
    }
  } catch (error) {
    console.error('[AdManager] Interstitial ad error:', error);
    return { shown: false, error: error.message };
  }
};

/**
 * Simulate interstitial ad (for testing)
 */
const simulateInterstitial = () => {
  return new Promise((resolve) => {
    // Show a confirmation dialog
    const watch = window.confirm(
      '[TEST MODE]\n\nSimulating interstitial ad...\n\nThis will be skippable after 5 seconds in production.\n\nClick OK to close ad.'
    );

    setTimeout(() => {
      resolve({ completed: true });
    }, 500);
  });
};

/**
 * Try to show interstitial at appropriate moment
 * @param {string} context - 'after_case_completion', 'returning_to_main_menu', etc.
 */
export const tryShowInterstitialAd = async (context) => {
  const validContexts = [
    'after_case_completion',
    'returning_to_main_menu',
    'after_5_consecutive_cases'
  ];

  if (!validContexts.includes(context)) {
    return { shown: false, reason: 'invalid_context' };
  }

  return await showInterstitialAd(context);
};

/**
 * Request hint with ad option
 * @param {function} onSuccess - Called when hint is granted
 * @param {function} onError - Called when ad fails
 */
export const requestHintWithAd = async (onSuccess, onError) => {
  if (!canWatchAd('hints')) {
    if (onError) {
      onError(new Error('Daily limit reached for hint ads'));
    }
    return;
  }

  await showRewardedAd(
    'hints',
    (result) => {
      if (result.earned) {
        console.log('[AdManager] Hint earned via ad!');
        if (onSuccess) {
          onSuccess(result);
        }
      }
    },
    onError
  );
};

/**
 * Request bonus case with ad
 * @param {function} onSuccess - Called when case is granted
 * @param {function} onError - Called when ad fails
 */
export const requestBonusCaseWithAd = async (onSuccess, onError) => {
  if (!canWatchAd('cases')) {
    if (onError) {
      onError(new Error('Daily limit reached for case ads'));
    }
    return;
  }

  await showRewardedAd(
    'cases',
    (result) => {
      if (result.earned) {
        console.log('[AdManager] Bonus case earned via ad!');
        if (onSuccess) {
          onSuccess(result);
        }
      }
    },
    onError
  );
};

/**
 * Offer reputation doubler after case
 * @param {number} baseReputation - Base reputation earned
 * @param {function} onSuccess - Called when doubled
 * @param {function} onDecline - Called when user declines
 * @param {function} onError - Called when ad fails
 */
export const offerReputationDoubler = async (baseReputation, onSuccess, onDecline, onError) => {
  // Check if user has ad removal
  if (hasAdRemoval()) {
    // Give them the doubler for free!
    if (onSuccess) {
      onSuccess({
        earned: true,
        doubled: true,
        total: baseReputation * 2,
        premium: true
      });
    }
    return;
  }

  // Show offer to watch ad
  await showRewardedAd(
    'reputation',
    (result) => {
      if (result.earned) {
        console.log('[AdManager] Reputation doubled via ad!');
        if (onSuccess) {
          onSuccess({
            earned: true,
            doubled: true,
            total: baseReputation * 2
          });
        }
      }
    },
    onError
  );
};

/**
 * Get remaining ad watches for today
 */
export const getRemainingAdWatches = () => {
  return {
    hints: AD_CONFIG.maxRewardedHintsPerDay - getAdCounter('hints'),
    cases: AD_CONFIG.maxRewardedCasesPerDay - getAdCounter('cases'),
    hintsUsed: getAdCounter('hints'),
    casesUsed: getAdCounter('cases')
  };
};

/**
 * Check if ads are enabled (not removed by purchase)
 */
export const areAdsEnabled = () => {
  return !hasAdRemoval();
};

/**
 * Preload ads (call periodically to ensure ads are ready)
 */
export const preloadAds = async () => {
  if (AD_CONFIG.testMode) {
    console.log('[AdManager] Preloading ads...');
    return { preloaded: true };
  }

  // TODO: Preload ads in background
  // Example (pseudo-code):
  // await Promise.all([
  //   window.admob.rewardedVideo.load({ id: AD_CONFIG.rewardedAdUnitId }),
  //   window.admob.interstitial.load({ id: AD_CONFIG.interstitialAdUnitId })
  // ]);

  return { preloaded: false };
};

export default {
  initializeAds,
  showRewardedAd,
  showInterstitialAd,
  tryShowInterstitialAd,
  requestHintWithAd,
  requestBonusCaseWithAd,
  offerReputationDoubler,
  getRemainingAdWatches,
  areAdsEnabled,
  preloadAds
};
