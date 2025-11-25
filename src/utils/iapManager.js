/**
 * IAP Manager - Handles In-App Purchases
 * for AI Detective: Crime Scene
 *
 * NOTE: This is a placeholder implementation. For production:
 * - Integrate with Google Play Billing Library
 * - Add server-side receipt validation
 * - Implement proper error handling
 * - Add purchase restoration logic
 */

import {
  addCaseFiles,
  addHintTokens,
  enableAdRemoval,
  unlockNotebook,
  unlockPremiumThemes,
  markAsPayingUser,
  markFirstTimeBundleUsed,
  isFirstTimeBundleAvailable
} from './storageManager';

// Product Catalog (US Dollars)
export const PRODUCTS = {
  // Case Files
  case_files_5: {
    id: 'case_files_5',
    name: '5 Case Files',
    description: 'Perfect for trying out!',
    price: 0.99,
    currency: '$',
    type: 'consumable',
    items: { caseFiles: 5 },
    category: 'cases'
  },
  case_files_12: {
    id: 'case_files_12',
    name: '12 Case Files',
    description: 'Most chosen by detectives!',
    price: 1.99,
    currency: '$',
    type: 'consumable',
    items: { caseFiles: 12 },
    category: 'cases',
    badge: 'POPULAR'
  },
  case_files_30: {
    id: 'case_files_30',
    name: '30 Case Files',
    description: 'Maximum savings!',
    price: 3.99,
    currency: '$',
    type: 'consumable',
    items: { caseFiles: 30 },
    category: 'cases',
    badge: 'BEST VALUE',
    savings: 'Save $2.50 vs buying 5-packs'
  },

  // Hint Tokens
  hint_tokens_5: {
    id: 'hint_tokens_5',
    name: '5 Hint Tokens',
    description: 'Get unstuck when you need it!',
    price: 0.99,
    currency: '$',
    type: 'consumable',
    items: { hintTokens: 5 },
    category: 'hints'
  },
  hint_tokens_15: {
    id: 'hint_tokens_15',
    name: '15 Hint Tokens',
    description: 'Never get stuck again!',
    price: 1.99,
    currency: '$',
    type: 'consumable',
    items: { hintTokens: 15 },
    category: 'hints',
    badge: 'POPULAR'
  },
  hint_tokens_40: {
    id: 'hint_tokens_40',
    name: '40 Hint Tokens',
    description: 'Ultimate hint package!',
    price: 3.99,
    currency: '$',
    type: 'consumable',
    items: { hintTokens: 40 },
    category: 'hints',
    badge: 'BEST VALUE',
    savings: 'Save $4.00 vs buying 5-packs'
  },

  // Bundles
  starter_bundle: {
    id: 'starter_bundle',
    name: 'Starter Detective Pack',
    description: 'One-time exclusive deal for new detectives!',
    price: 2.99,
    originalPrice: 6.99,
    currency: '$',
    type: 'consumable',
    items: {
      caseFiles: 20,
      hintTokens: 15
    },
    category: 'featured',
    badge: 'FIRST PURCHASE - 60% OFF!',
    oneTimeOnly: true,
    savings: 'Save $4.00 (60% OFF)'
  },
  detective_essentials: {
    id: 'detective_essentials',
    name: 'Detective Essentials',
    description: 'Everything you need!',
    price: 2.99,
    currency: '$',
    type: 'consumable',
    items: {
      caseFiles: 12,
      hintTokens: 15
    },
    category: 'featured',
    badge: 'MOST POPULAR',
    savings: 'Save $1.00'
  },

  // Premium Features
  ad_removal: {
    id: 'ad_removal',
    name: 'Remove All Ads Forever',
    description: 'Enjoy uninterrupted detective work!',
    price: 4.99,
    currency: '$',
    type: 'non_consumable',
    category: 'premium',
    badge: 'ONE-TIME PAYMENT'
  },
  detective_notebook: {
    id: 'detective_notebook',
    name: 'Detective\'s Notebook',
    description: 'Professional investigation tool',
    price: 3.99,
    currency: '$',
    type: 'non_consumable',
    category: 'premium'
  },
  premium_themes: {
    id: 'premium_themes',
    name: 'Premium Themes Pack',
    description: 'Customize your detective experience!',
    price: 4.99,
    currency: '$',
    type: 'non_consumable',
    category: 'premium',
    items: {
      themes: ['classic_noir', 'neon_detective', 'vintage_typewriter', 'modern_minimalist', 'dark_deluxe']
    }
  }
};

// Test mode flag
const TEST_MODE = true;

/**
 * Initialize Google Play Billing
 */
export const initializeIAP = async () => {
  if (TEST_MODE) {
    console.log('[IAP] Initializing in TEST MODE');
    return { initialized: true, testMode: true };
  }

  // TODO: Initialize Google Play Billing Library
  // Example (pseudo-code):
  // const billing = await google.payments.inapp.getPurchasesClient();
  // await billing.isReady();

  return { initialized: false, error: 'Google Play Billing not implemented' };
};

/**
 * Get product details from Google Play
 */
const getProductDetails = async (productId) => {
  if (TEST_MODE) {
    return PRODUCTS[productId] || null;
  }

  // TODO: Query product details from Google Play
  // Example (pseudo-code):
  // const details = await billing.querySkuDetails({
  //   itemType: 'inapp',
  //   skus: [productId]
  // });
  // return details[0];

  throw new Error('Google Play Billing not implemented');
};

/**
 * Purchase a product
 */
export const purchaseProduct = async (productId, onSuccess, onError) => {
  try {
    const product = PRODUCTS[productId];

    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    // Check if one-time bundle is still available
    if (product.oneTimeOnly && !isFirstTimeBundleAvailable()) {
      throw new Error('This one-time offer has already been used');
    }

    // Get product details
    const productDetails = await getProductDetails(productId);

    if (TEST_MODE) {
      console.log(`[IAP] Purchasing ${product.name} for ${product.currency}${product.price}...`);

      // Simulate purchase flow
      const confirmed = window.confirm(
        `[TEST MODE - Purchase Simulation]\n\n` +
        `Product: ${product.name}\n` +
        `Price: ${product.currency}${product.price}\n\n` +
        `In production, this will open Google Play payment.\n\n` +
        `Click OK to simulate successful purchase.\n` +
        `Click Cancel to simulate purchase cancellation.`
      );

      if (!confirmed) {
        throw new Error('Purchase cancelled by user');
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Grant items
      const grantResult = await grantPurchasedItems(productId, product);

      // Mark as paying user
      markAsPayingUser({
        productId,
        productName: product.name,
        price: product.price,
        currency: product.currency
      });

      // Mark bundle as used if applicable
      if (product.oneTimeOnly) {
        markFirstTimeBundleUsed();
      }

      if (onSuccess) {
        onSuccess({
          success: true,
          productId,
          product,
          granted: grantResult
        });
      }

      return {
        success: true,
        productId,
        granted: grantResult
      };

    } else {
      // TODO: Process actual purchase via Google Play
      // Example (pseudo-code):
      // const purchase = await billing.launchBillingFlow({
      //   sku: productId,
      //   skuType: product.type === 'non_consumable' ? 'inapp' : 'subs'
      // });
      //
      // if (purchase.purchaseState === 'PURCHASED') {
      //   await grantPurchasedItems(productId, product);
      //   await billing.acknowledgePurchase(purchase.purchaseToken);
      //   if (onSuccess) onSuccess({ success: true, purchase });
      // }

      throw new Error('Google Play Billing not implemented');
    }

  } catch (error) {
    console.error('[IAP] Purchase error:', error);
    if (onError) {
      onError(error);
    }
    return { success: false, error: error.message };
  }
};

/**
 * Grant purchased items to player
 */
const grantPurchasedItems = async (productId, product) => {
  const granted = {
    caseFiles: 0,
    hintTokens: 0,
    premium: []
  };

  // Grant consumable items
  if (product.items) {
    if (product.items.caseFiles) {
      const newTotal = addCaseFiles(product.items.caseFiles);
      granted.caseFiles = product.items.caseFiles;
      console.log(`[IAP] Granted ${product.items.caseFiles} case files (total: ${newTotal})`);
    }

    if (product.items.hintTokens) {
      const newTotal = addHintTokens(product.items.hintTokens);
      granted.hintTokens = product.items.hintTokens;
      console.log(`[IAP] Granted ${product.items.hintTokens} hint tokens (total: ${newTotal})`);
    }
  }

  // Grant premium features
  switch (productId) {
    case 'ad_removal':
      enableAdRemoval();
      granted.premium.push('ad_removal');
      console.log('[IAP] Ad removal enabled');
      break;

    case 'detective_notebook':
      unlockNotebook();
      granted.premium.push('notebook');
      console.log('[IAP] Detective notebook unlocked');
      break;

    case 'premium_themes':
      unlockPremiumThemes();
      granted.premium.push('themes');
      console.log('[IAP] Premium themes unlocked');
      break;
  }

  return granted;
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (onSuccess, onError) => {
  try {
    if (TEST_MODE) {
      console.log('[IAP] Restore purchases not available in test mode');
      alert('[TEST MODE]\n\nPurchase restoration is not available in test mode.\n\nIn production, this will restore all previous purchases from Google Play.');

      if (onSuccess) {
        onSuccess({ restored: 0, message: 'Test mode - no purchases to restore' });
      }

      return { restored: 0 };
    }

    // TODO: Query and restore purchases from Google Play
    // Example (pseudo-code):
    // const purchases = await billing.queryPurchases({ itemType: 'inapp' });
    //
    // for (const purchase of purchases) {
    //   if (purchase.purchaseState === 'PURCHASED') {
    //     const product = PRODUCTS[purchase.sku];
    //     await grantPurchasedItems(purchase.sku, product);
    //   }
    // }
    //
    // if (onSuccess) {
    //   onSuccess({ restored: purchases.length });
    // }

    throw new Error('Google Play Billing not implemented');

  } catch (error) {
    console.error('[IAP] Restore error:', error);
    if (onError) {
      onError(error);
    }
    return { restored: 0, error: error.message };
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = (category) => {
  return Object.values(PRODUCTS).filter(p => p.category === category);
};

/**
 * Get featured products
 */
export const getFeaturedProducts = () => {
  const featured = [];

  // Add starter bundle if available
  if (isFirstTimeBundleAvailable()) {
    featured.push(PRODUCTS.starter_bundle);
  }

  // Add other featured items
  featured.push(PRODUCTS.case_files_30); // Best value
  featured.push(PRODUCTS.detective_essentials); // Most popular

  return featured;
};

/**
 * Get all products
 */
export const getAllProducts = () => {
  return PRODUCTS;
};

/**
 * Format price
 */
export const formatPrice = (product) => {
  return `${product.currency}${product.price}`;
};

/**
 * Check if product is available
 */
export const isProductAvailable = (productId) => {
  const product = PRODUCTS[productId];

  if (!product) {
    return false;
  }

  // Check if one-time bundle
  if (product.oneTimeOnly) {
    return isFirstTimeBundleAvailable();
  }

  return true;
};

/**
 * Validate purchase receipt (server-side in production)
 */
const validateReceipt = async (purchaseToken) => {
  if (TEST_MODE) {
    return { valid: true, testMode: true };
  }

  // TODO: Send receipt to your backend for validation
  // Example (pseudo-code):
  // const response = await fetch('/api/validate-receipt', {
  //   method: 'POST',
  //   body: JSON.stringify({ purchaseToken })
  // });
  // return await response.json();

  throw new Error('Receipt validation not implemented');
};

export default {
  PRODUCTS,
  initializeIAP,
  purchaseProduct,
  restorePurchases,
  getProductsByCategory,
  getFeaturedProducts,
  getAllProducts,
  formatPrice,
  isProductAvailable
};
