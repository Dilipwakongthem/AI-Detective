import React, { useState } from 'react';
import { PRODUCTS, purchaseProduct, formatPrice, isProductAvailable, restorePurchases } from '../utils/iapManager';
import { getCaseFiles, getHintTokens, hasAdRemoval, hasNotebook, hasPremiumThemes } from '../utils/storageManager';
import { CASE_PACKS, purchaseCasePack, isPackPurchased } from '../utils/caseLibraryManager';

/**
 * Store Screen Component
 * Displays all purchasable items in 4 tabs: Featured, Cases, Hints, Premium
 */
const StoreScreen = ({ onBack, onPurchaseComplete, showNotification }) => {
  const [activeTab, setActiveTab] = useState('featured');
  const [purchasing, setPurchasing] = useState(false);

  // Get current inventory
  const caseFiles = getCaseFiles();
  const hintTokens = getHintTokens();
  const adRemoval = hasAdRemoval();
  const notebook = hasNotebook();
  const themes = hasPremiumThemes();

  /**
   * Handle case pack purchase
   */
  const handleCasePackPurchase = async (packId) => {
    setPurchasing(true);

    try {
      const result = purchaseCasePack(packId);

      if (result.success) {
        const pack = result.pack;
        const caseCount = pack.caseIds === 'ALL' ? 15 : pack.caseIds.length;
        const message = result.premiumAccess
          ? `✅ Complete Collection purchased!\n\nYou now have access to ALL 15 hand-crafted cases + future releases!`
          : `✅ ${pack.name} purchased!\n\nUnlocked ${caseCount} cases!`;

        showNotification(message, 'success');

        // Reload page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // Check if user cancelled
        if (result.error === 'Purchase cancelled by user') {
          showNotification('Purchase cancelled', 'info');
        } else {
          showNotification('Purchase failed: ' + result.error, 'error');
        }
      }
    } catch (error) {
      showNotification('Purchase error: ' + error.message, 'error');
    } finally {
      setPurchasing(false);
    }
  };

  /**
   * Handle purchase click
   */
  const handlePurchase = async (productId) => {
    const product = PRODUCTS[productId];

    if (!product) {
      showNotification('Product not found', 'error');
      return;
    }

    // Check if already owned (for non-consumables)
    if (product.type === 'non_consumable') {
      if (productId === 'ad_removal' && adRemoval) {
        showNotification('You already own this item!', 'info');
        return;
      }
      if (productId === 'detective_notebook' && notebook) {
        showNotification('You already own this item!', 'info');
        return;
      }
      if (productId === 'premium_themes' && themes) {
        showNotification('You already own this item!', 'info');
        return;
      }
    }

    // Check availability
    if (!isProductAvailable(productId)) {
      showNotification('This offer is no longer available', 'info');
      return;
    }

    setPurchasing(true);

    await purchaseProduct(
      productId,
      (result) => {
        // Purchase successful
        console.log('Purchase successful:', result);

        // Build success message
        let message = `✅ Purchase successful!\n\n`;

        if (result.granted.caseFiles > 0) {
          message += `+${result.granted.caseFiles} Case Files\n`;
        }
        if (result.granted.hintTokens > 0) {
          message += `+${result.granted.hintTokens} Hint Tokens\n`;
        }
        if (result.granted.premium.length > 0) {
          message += `Premium features unlocked!\n`;

          // Special messages for specific premium features
          if (result.granted.premium.includes('notebook')) {
            message += `\n📓 Detective's Notebook is now available during investigations!`;
          }
          if (result.granted.premium.includes('themes')) {
            message += `\n🎨 Premium Themes unlocked! Visit your Profile to change themes.`;
          }
          if (result.granted.premium.includes('ad_removal')) {
            message += `\n✨ Enjoy your ad-free experience!`;
          }
        }

        showNotification(message, 'success');

        // Notify parent
        if (onPurchaseComplete) {
          onPurchaseComplete(result);
        }

        setPurchasing(false);
      },
      (error) => {
        // Purchase failed
        console.error('Purchase failed:', error);

        if (error.message !== 'Purchase cancelled by user') {
          showNotification(`Purchase failed: ${error.message}`, 'error');
        }

        setPurchasing(false);
      }
    );
  };

  /**
   * Handle restore purchases
   */
  const handleRestorePurchases = async () => {
    setPurchasing(true);

    await restorePurchases(
      (result) => {
        showNotification(
          result.restored > 0
            ? `✅ Restored ${result.restored} purchase(s)!`
            : 'No purchases to restore',
          result.restored > 0 ? 'success' : 'info'
        );
        setPurchasing(false);

        if (result.restored > 0 && onPurchaseComplete) {
          onPurchaseComplete(result);
        }
      },
      (error) => {
        showNotification(`Restore failed: ${error.message}`, 'error');
        setPurchasing(false);
      }
    );
  };

  /**
   * Render product card
   */
  const renderProductCard = (product, featured = false) => {
    const isOwned = product.type === 'non_consumable' && (
      (product.id === 'ad_removal' && adRemoval) ||
      (product.id === 'detective_notebook' && notebook) ||
      (product.id === 'premium_themes' && themes)
    );

    const isAvailable = isProductAvailable(product.id);

    return (
      <div
        key={product.id}
        className={`store-item-card ${featured ? 'featured' : ''} ${isOwned ? 'owned' : ''}`}
      >
        {/* Badge */}
        {product.badge && !isOwned && (
          <div className={`badge ${product.badge.includes('BEST VALUE') ? 'badge-best-value' : 'badge-popular'}`}>
            {product.badge}
          </div>
        )}

        {isOwned && (
          <div className="badge badge-owned">✓ OWNED</div>
        )}

        {/* Product Info */}
        <div className="store-item-header">
          <h3>{product.name}</h3>
          <p className="store-item-description">{product.description}</p>
        </div>

        {/* Items Included */}
        {product.items && (
          <div className="store-item-contents">
            <p className="store-item-label">YOU GET:</p>
            <ul>
              {product.items.caseFiles && (
                <li>✓ {product.items.caseFiles} Case Files</li>
              )}
              {product.items.hintTokens && (
                <li>✓ {product.items.hintTokens} Hint Tokens</li>
              )}
              {product.items.themes && (
                <li>✓ {product.items.themes.length} Exclusive Themes</li>
              )}
            </ul>
          </div>
        )}

        {/* Premium Features */}
        {product.id === 'ad_removal' && (
          <div className="store-item-contents">
            <p className="store-item-label">BENEFITS:</p>
            <ul>
              <li>✓ No ads ever (except optional rewarded)</li>
              <li>✓ Cleaner, faster experience</li>
              <li>✓ Premium detective status</li>
              <li>✓ One-time payment, lifetime benefit</li>
            </ul>
          </div>
        )}

        {product.id === 'detective_notebook' && (
          <div className="store-item-contents">
            <p className="store-item-label">FEATURES:</p>
            <ul>
              <li>✓ Take notes during investigations</li>
              <li>✓ Organize clues and theories</li>
              <li>✓ Quick reference during interrogations</li>
              <li>✓ Save notes for each case</li>
            </ul>
          </div>
        )}

        {product.id === 'premium_themes' && (
          <div className="store-item-contents">
            <p className="store-item-label">INCLUDES 5 EXCLUSIVE THEMES:</p>
            <ul>
              <li>✓ Classic Noir (black & white)</li>
              <li>✓ Neon Detective (cyberpunk)</li>
              <li>✓ Vintage Typewriter</li>
              <li>✓ Modern Minimalist</li>
              <li>✓ Dark Mode Deluxe</li>
            </ul>
          </div>
        )}

        {/* Pricing */}
        <div className="store-item-pricing">
          {product.originalPrice && (
            <span className="price-old">{product.currency}{product.originalPrice}</span>
          )}
          <span className="price">{formatPrice(product)}</span>
        </div>

        {/* Savings */}
        {product.savings && !isOwned && (
          <p className="store-item-savings">{product.savings}</p>
        )}

        {/* Buy Button */}
        {!isOwned ? (
          <button
            className="buy-button"
            onClick={() => handlePurchase(product.id)}
            disabled={purchasing || !isAvailable}
          >
            {purchasing ? 'Processing...' : (isAvailable ? 'BUY NOW' : 'Not Available')}
          </button>
        ) : (
          <button className="buy-button owned-button" disabled>
            ✓ PURCHASED
          </button>
        )}
      </div>
    );
  };

  /**
   * Render Featured Tab
   */
  const renderFeaturedTab = () => {
    // Show hand-crafted case packs instead of case files
    const renderCasePackCard = (pack) => {
      const isPurchased = isPackPurchased(pack.id);
      const caseCount = pack.caseIds === 'ALL' ? 15 : pack.caseIds.length;

      return (
        <div key={pack.id} className={`store-item-card ${isPurchased ? 'owned' : ''} ${pack.bestValue ? 'featured' : ''}`}>
          {pack.bestValue && !isPurchased && (
            <div className="badge badge-best-value">🏆 BEST VALUE</div>
          )}
          <div className="store-item-header">
            <span className="store-item-icon">{pack.icon}</span>
            <div>
              <h3 className="store-item-name">{pack.name}</h3>
              <p className="store-item-description">{pack.description}</p>
            </div>
          </div>
          <div className="store-item-details">
            <p><strong>Includes:</strong> {caseCount} hand-crafted cases</p>
            <p><strong>Difficulty:</strong> {pack.difficulty === 'all' ? 'All Levels' : `Level ${pack.difficulty}`}</p>
          </div>
          <div className="store-item-footer">
            <div className="store-item-price">
              ${pack.price.toFixed(2)}
            </div>
            {isPurchased ? (
              <button className="store-item-button owned" disabled>
                ✓ OWNED
              </button>
            ) : (
              <button
                className="store-item-button"
                onClick={() => handleCasePackPurchase(pack.id)}
                disabled={purchasing}
              >
                {purchasing ? 'PROCESSING...' : 'UNLOCK'}
              </button>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="store-tab-content">
        <div className="store-section">
          <h2 className="store-section-title">🎁 FEATURED CASE PACKS</h2>
          <p className="store-section-subtitle">
            Premium hand-crafted detective cases - unlock permanent access
          </p>
          <div className="store-items-grid">
            {/* Show best value pack first, then others */}
            {[CASE_PACKS.complete, CASE_PACKS.mystery, CASE_PACKS.elite].map(pack => renderCasePackCard(pack))}
          </div>
          <p className="store-info-text">
            ℹ️ Once purchased, cases remain unlocked forever. Play anytime, replay anytime!
          </p>
        </div>
      </div>
    );
  };

  /**
   * Render Cases Tab
   */
  const renderCasesTab = () => {
    // Render case pack card
    const renderCasePackCard = (pack) => {
      const isPurchased = isPackPurchased(pack.id);
      const caseCount = pack.caseIds === 'ALL' ? 15 : pack.caseIds.length;

      return (
        <div key={pack.id} className={`store-item-card ${isPurchased ? 'owned' : ''} ${pack.bestValue ? 'featured' : ''}`}>
          {pack.bestValue && !isPurchased && (
            <div className="badge badge-best-value">🏆 BEST VALUE</div>
          )}
          <div className="store-item-header">
            <span className="store-item-icon">{pack.icon}</span>
            <div>
              <h3 className="store-item-name">{pack.name}</h3>
              <p className="store-item-description">{pack.description}</p>
            </div>
          </div>
          <div className="store-item-details">
            <p><strong>Includes:</strong> {caseCount} hand-crafted cases</p>
            <p><strong>Difficulty:</strong> {pack.difficulty === 'all' ? 'All Levels' : `Level ${pack.difficulty}`}</p>
          </div>
          <div className="store-item-footer">
            <div className="store-item-price">
              ${pack.price.toFixed(2)}
            </div>
            {isPurchased ? (
              <button className="store-item-button owned" disabled>
                ✓ OWNED
              </button>
            ) : (
              <button
                className="store-item-button"
                onClick={() => handleCasePackPurchase(pack.id)}
                disabled={purchasing}
              >
                {purchasing ? 'PROCESSING...' : 'UNLOCK'}
              </button>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="store-tab-content">
        <div className="store-section">
          <h2 className="store-section-title">📚 PREMIUM CASE PACKS</h2>
          <p className="store-section-subtitle">
            Unlock curated collections of hand-crafted detective cases
          </p>
          <div className="store-items-grid">
            {Object.values(CASE_PACKS).map(pack => renderCasePackCard(pack))}
          </div>
          <p className="store-info-text">
            ℹ️ Once purchased, cases remain unlocked forever. Play anytime, replay anytime!
          </p>
        </div>
      </div>
    );
  };

  /**
   * Render Hints Tab
   */
  const renderHintsTab = () => {
    const hintProducts = [
      PRODUCTS.hint_tokens_5,
      PRODUCTS.hint_tokens_15,
      PRODUCTS.hint_tokens_40
    ];

    return (
      <div className="store-tab-content">
        <div className="store-section">
          <h2 className="store-section-title">💡 HINT TOKEN PACKAGES</h2>
          <p className="store-section-subtitle">
            You currently have: <strong>{hintTokens} hint tokens</strong>
          </p>
          {hintProducts.map(product => renderProductCard(product))}
          <p className="store-info-text">
            💡 OR watch free ads for hints during cases!
          </p>
          <p className="store-info-text">
            ℹ️ Hint Tokens never expire and work on any case at any difficulty level.
          </p>
        </div>
      </div>
    );
  };

  /**
   * Render Premium Tab
   */
  const renderPremiumTab = () => {
    const premiumProducts = [
      PRODUCTS.detective_notebook,
      PRODUCTS.premium_themes
      // Note: ad_removal removed (no ads in game)
    ];

    return (
      <div className="store-tab-content">
        <div className="store-section">
          <h2 className="store-section-title">💎 PREMIUM FEATURES</h2>
          {premiumProducts.map(product => renderProductCard(product))}
          <p className="store-info-text">
            ℹ️ All premium features are one-time purchases and never expire.
          </p>
        </div>
      </div>
    );
  };

  /**
   * Render active tab content
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'featured':
        return renderFeaturedTab();
      case 'cases':
        return renderCasesTab();
      case 'hints':
        return renderHintsTab();
      case 'premium':
        return renderPremiumTab();
      default:
        return renderFeaturedTab();
    }
  };

  return (
    <div className="store-screen">
      {/* Header */}
      <div className="store-header">
        <button className="home-btn" onClick={onBack}>
          ← BACK
        </button>
        <h1 className="store-title">🛍️ DETECTIVE STORE</h1>
      </div>

      {/* Tab Navigation */}
      <div className="store-tabs">
        <button
          className={`store-tab ${activeTab === 'featured' ? 'active' : ''}`}
          onClick={() => setActiveTab('featured')}
        >
          FEATURED
        </button>
        <button
          className={`store-tab ${activeTab === 'cases' ? 'active' : ''}`}
          onClick={() => setActiveTab('cases')}
        >
          CASES
        </button>
        <button
          className={`store-tab ${activeTab === 'hints' ? 'active' : ''}`}
          onClick={() => setActiveTab('hints')}
        >
          HINTS
        </button>
        <button
          className={`store-tab ${activeTab === 'premium' ? 'active' : ''}`}
          onClick={() => setActiveTab('premium')}
        >
          PREMIUM
        </button>
      </div>

      {/* Tab Content */}
      <div className="store-content">
        {renderTabContent()}
      </div>

      {/* Restore Purchases */}
      <div className="store-footer">
        <button
          className="restore-btn"
          onClick={handleRestorePurchases}
          disabled={purchasing}
        >
          {purchasing ? 'Restoring...' : 'RESTORE PURCHASES'}
        </button>
      </div>
    </div>
  );
};

export default StoreScreen;
