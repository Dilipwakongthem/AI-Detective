import React, { useState, useEffect } from 'react';
import './CasePackStore.css';
import {
  CASE_PACKS,
  purchaseCasePack,
  isPackPurchased,
  getUnlockedCasesCount,
  getRecommendedPack
} from '../utils/caseLibraryManager.js';
import { HAND_CRAFTED_CASES } from '../handCraftedCases.js';

const CasePackStore = ({ onClose, onPurchaseComplete }) => {
  const [selectedPack, setSelectedPack] = useState(null);
  const [purchasedPacks, setPurchasedPacks] = useState([]);
  const [recommendedPack, setRecommendedPack] = useState(null);
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(null);

  useEffect(() => {
    loadPurchaseData();
  }, []);

  const loadPurchaseData = () => {
    const purchased = Object.keys(CASE_PACKS).filter(packId =>
      isPackPurchased(packId)
    );
    setPurchasedPacks(purchased);
    setRecommendedPack(getRecommendedPack());
  };

  const handlePackClick = (packId) => {
    setSelectedPack(CASE_PACKS[packId]);
    setPurchaseResult(null);
  };

  const handlePurchase = () => {
    if (!selectedPack) return;

    // Show confirmation
    setShowPurchaseConfirm(true);
  };

  const confirmPurchase = () => {
    if (!selectedPack) return;

    // In a real app, this would trigger payment processing
    // For demo, we'll simulate successful purchase
    const result = purchaseCasePack(selectedPack.id);

    if (result.success) {
      setPurchaseResult({
        success: true,
        pack: result.pack,
        message: result.premiumAccess
          ? 'You now have access to ALL cases including future releases!'
          : `Successfully unlocked ${result.pack.caseIds.length} cases!`
      });
      loadPurchaseData();

      if (onPurchaseComplete) {
        onPurchaseComplete(result);
      }
    } else {
      setPurchaseResult({
        success: false,
        message: result.error || 'Purchase failed. Please try again.'
      });
    }

    setShowPurchaseConfirm(false);
  };

  const getPackProgress = (pack) => {
    if (pack.caseIds === 'ALL') {
      const unlocked = getUnlockedCasesCount();
      const total = HAND_CRAFTED_CASES.length;
      return { unlocked, total, percentage: Math.round((unlocked / total) * 100) };
    }
    return null;
  };

  const isPurchased = (packId) => purchasedPacks.includes(packId);

  const renderPackCard = (packId) => {
    const pack = CASE_PACKS[packId];
    const purchased = isPurchased(packId);
    const isRecommended = recommendedPack?.id === packId;
    const progress = getPackProgress(pack);

    return (
      <div
        key={packId}
        className={`pack-card ${purchased ? 'purchased' : ''} ${isRecommended ? 'recommended' : ''} ${
          selectedPack?.id === packId ? 'selected' : ''
        }`}
        onClick={() => !purchased && handlePackClick(packId)}
      >
        {isRecommended && !purchased && (
          <div className="recommended-badge">⭐ RECOMMENDED</div>
        )}

        {pack.bestValue && !purchased && (
          <div className="best-value-badge">🏆 BEST VALUE</div>
        )}

        {purchased && (
          <div className="purchased-badge">✓ OWNED</div>
        )}

        <div className="pack-icon">{pack.icon}</div>
        <h3 className="pack-name">{pack.name}</h3>
        <p className="pack-description">{pack.description}</p>

        <div className="pack-details">
          {pack.caseIds === 'ALL' ? (
            <>
              <div className="pack-stat">
                <span className="stat-icon">📚</span>
                <span>All {HAND_CRAFTED_CASES.length} Cases</span>
              </div>
              <div className="pack-stat">
                <span className="stat-icon">🆕</span>
                <span>+ Future Releases</span>
              </div>
            </>
          ) : (
            <>
              <div className="pack-stat">
                <span className="stat-icon">📁</span>
                <span>{pack.caseIds.length} Cases Included</span>
              </div>
              <div className="pack-stat">
                <span className="stat-icon">⭐</span>
                <span>
                  {pack.difficulty === 1 ? 'Beginner Friendly' :
                   pack.difficulty === 2 ? 'Intermediate' :
                   pack.difficulty === 3 ? 'Expert Level' : 'All Levels'}
                </span>
              </div>
            </>
          )}
        </div>

        {progress && !purchased && (
          <div className="pack-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress.percentage}%` }}></div>
            </div>
            <span className="progress-text">{progress.unlocked}/{progress.total} currently unlocked</span>
          </div>
        )}

        <div className="pack-price">
          {purchased ? (
            <span className="owned-text">OWNED</span>
          ) : (
            <span className="price-tag">${pack.price.toFixed(2)}</span>
          )}
        </div>

        {!purchased && (
          <button
            className="pack-buy-btn"
            onClick={(e) => {
              e.stopPropagation();
              handlePackClick(packId);
              setShowPurchaseConfirm(true);
            }}
          >
            Purchase
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="case-pack-store">
      <div className="store-header">
        <div className="header-content">
          <h1>🛒 Case Pack Store</h1>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <p className="store-subtitle">Unlock premium hand-crafted detective cases</p>
      </div>

      <div className="store-content">
        {purchaseResult && (
          <div className={`purchase-result ${purchaseResult.success ? 'success' : 'error'}`}>
            <span className="result-icon">{purchaseResult.success ? '✅' : '❌'}</span>
            <span className="result-message">{purchaseResult.message}</span>
            <button className="result-close" onClick={() => setPurchaseResult(null)}>×</button>
          </div>
        )}

        <div className="store-info">
          <h2>Why Purchase Case Packs?</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">📖</span>
              <h3>Hand-Crafted Stories</h3>
              <p>Each case features a unique narrative with plot twists and character depth</p>
            </div>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <h3>Replayable Content</h3>
              <p>Play cases multiple times to improve your detective rating</p>
            </div>
            <div className="info-item">
              <span className="info-icon">💎</span>
              <h3>Premium Quality</h3>
              <p>Carefully designed mysteries that challenge your deduction skills</p>
            </div>
            <div className="info-item">
              <span className="info-icon">♾️</span>
              <h3>Plus Procedural</h3>
              <p>Unlimited random cases always available for free practice</p>
            </div>
          </div>
        </div>

        <div className="packs-grid">
          {Object.keys(CASE_PACKS).map(packId => renderPackCard(packId))}
        </div>

        <div className="store-footer">
          <p className="footer-note">
            💡 <strong>Pro Tip:</strong> Start with the recommended pack based on your current progress!
          </p>
          <p className="footer-disclaimer">
            All purchases are one-time. Cases remain unlocked forever. Procedural cases are always free.
          </p>
        </div>
      </div>

      {showPurchaseConfirm && selectedPack && (
        <div className="purchase-modal" onClick={() => setShowPurchaseConfirm(false)}>
          <div className="purchase-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Purchase</h2>

            <div className="confirm-pack-details">
              <div className="confirm-icon">{selectedPack.icon}</div>
              <h3>{selectedPack.name}</h3>
              <p>{selectedPack.description}</p>

              {selectedPack.caseIds === 'ALL' ? (
                <div className="confirm-cases">
                  <strong>Includes:</strong>
                  <ul>
                    <li>All {HAND_CRAFTED_CASES.length} current cases</li>
                    <li>All future case releases</li>
                    <li>Lifetime premium library access</li>
                  </ul>
                </div>
              ) : (
                <div className="confirm-cases">
                  <strong>Includes {selectedPack.caseIds.length} Cases:</strong>
                  <ul>
                    {selectedPack.caseIds.slice(0, 5).map(caseId => {
                      const caseData = HAND_CRAFTED_CASES.find(c => c.id === caseId);
                      return caseData ? <li key={caseId}>{caseData.title}</li> : null;
                    })}
                    {selectedPack.caseIds.length > 5 && (
                      <li>...and {selectedPack.caseIds.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="confirm-price">
                <span className="price-label">Total:</span>
                <span className="price-amount">${selectedPack.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="confirm-actions">
              <button className="confirm-btn" onClick={confirmPurchase}>
                Confirm Purchase
              </button>
              <button className="cancel-btn" onClick={() => setShowPurchaseConfirm(false)}>
                Cancel
              </button>
            </div>

            <p className="demo-note">
              ⚠️ <strong>Demo Mode:</strong> This is a demonstration. No real payment is processed.
              In production, this would integrate with payment services (Stripe, PayPal, Google Play, etc.)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasePackStore;
