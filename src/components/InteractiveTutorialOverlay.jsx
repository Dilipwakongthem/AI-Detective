import React, { useEffect, useState, useRef, useCallback } from 'react';
import './InteractiveTutorialOverlay.css';

const InteractiveTutorialOverlay = ({ step, onNext, onSkip, onComplete }) => {
  const [targetRect, setTargetRect] = useState(null);
  const [isElementVisible, setIsElementVisible] = useState(true);
  const overlayRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Enhanced element finding with retry mechanism and scroll handling
  const findAndHighlightTarget = useCallback(() => {
    if (!step || !step.targetElement) {
      setTargetRect(null);
      setIsElementVisible(true);
      return null;
    }

    const target = document.querySelector(step.targetElement);

    if (target) {
      // Check if element is visible in the DOM
      const isVisible = target.offsetParent !== null;
      setIsElementVisible(isVisible);

      if (!isVisible) {
        console.warn('[Tutorial] Target element exists but is not visible:', step.targetElement);
        return null;
      }

      // Scroll element into view if needed (smooth scroll)
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Check if element is in viewport
      const isInViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= viewportHeight &&
        rect.right <= viewportWidth
      );

      if (!isInViewport) {
        console.log('[Tutorial] Scrolling element into view:', step.targetElement);
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });

        // Wait for scroll to complete, then recalculate
        setTimeout(() => {
          const newRect = target.getBoundingClientRect();
          updateTargetRect(newRect);
        }, 300);
      } else {
        updateTargetRect(rect);
      }

      // Add highlight class to target element
      target.classList.add('tutorial-target-highlight');

      console.log('[Tutorial] Target found and highlighted:', {
        element: step.targetElement,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        isInViewport
      });

      return () => {
        target.classList.remove('tutorial-target-highlight');
      };
    } else {
      console.warn('[Tutorial] Target element not found:', step.targetElement);
      setTargetRect(null);
      setIsElementVisible(false);
      return null;
    }
  }, [step]);

  // Update target rect with boundary checking
  const updateTargetRect = (rect) => {
    setTargetRect({
      top: Math.max(0, rect.top),
      left: Math.max(0, rect.left),
      width: rect.width,
      height: rect.height
    });
  };

  // Retry mechanism for finding elements (with exponential backoff)
  useEffect(() => {
    if (!step || !step.targetElement) {
      setTargetRect(null);
      return;
    }

    let attempts = 0;
    const maxAttempts = 4;
    const delays = [50, 150, 300, 600]; // Exponential backoff

    const attemptFind = () => {
      const cleanup = findAndHighlightTarget();

      if (!cleanup && attempts < maxAttempts) {
        // Element not found, retry with exponential backoff
        attempts++;
        console.log(`[Tutorial] Retrying element find (attempt ${attempts}/${maxAttempts})...`);
        retryTimeoutRef.current = setTimeout(attemptFind, delays[attempts - 1] || 600);
      }

      return cleanup;
    };

    const cleanup = attemptFind();

    return () => {
      if (cleanup) cleanup();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [step, findAndHighlightTarget]);

  // Update positions on resize and scroll
  useEffect(() => {
    if (!step || !step.targetElement) return;

    const handleUpdate = () => {
      const target = document.querySelector(step.targetElement);
      if (target) {
        const rect = target.getBoundingClientRect();
        updateTargetRect(rect);
      }
    };

    // Use requestAnimationFrame for smooth updates
    let rafId;
    const throttledUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleUpdate();
        rafId = null;
      });
    };

    window.addEventListener('resize', throttledUpdate);
    window.addEventListener('scroll', throttledUpdate, true); // Capture phase for all scrollable elements

    return () => {
      window.removeEventListener('resize', throttledUpdate);
      window.removeEventListener('scroll', throttledUpdate, true);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [step]);

  // Auto-advance for informational steps (with longer delay for steps with highlighted elements)
  useEffect(() => {
    if (!step || step.requiresAction || step.isFinal || step.showContinueButton) return;

    // Longer delay if highlighting an element (player needs time to see it)
    const delay = step.highlightElement ? 7000 : 5000;

    const autoAdvanceTimer = setTimeout(() => {
      console.log('[Tutorial] Auto-advancing informational step:', step.id);
      onNext();
    }, delay);

    return () => clearTimeout(autoAdvanceTimer);
  }, [step, onNext]);

  const handleAction = () => {
    if (step.isFinal) {
      onComplete();
    } else if (!step.requiresAction) {
      onNext();
    }
    // If requiresAction is true, wait for the actual game action (like clicking the button)
  };

  const handleOverlayClick = (e) => {
    // If clicks should be blocked, prevent clicks outside the target
    if (step.blockOtherClicks && e.target === overlayRef.current) {
      e.stopPropagation();
      e.preventDefault();

      // Add shake animation to modal to indicate they need to click the highlighted element
      const modal = document.querySelector('.tutorial-modal-interactive');
      if (modal) {
        modal.classList.add('shake-attention');
        setTimeout(() => modal.classList.remove('shake-attention'), 500);
      }
    }
  };

  if (!step) return null;

  // Show continue button if explicitly requested or if highlighting without requiring action
  const shouldShowContinueButton = step.showContinueButton ||
    (!step.requiresAction && step.highlightElement && !step.isFinal);

  return (
    <div
      ref={overlayRef}
      className="tutorial-overlay-interactive"
      onClick={handleOverlayClick}
    >
      {/* Semi-transparent backdrop */}
      <div className="tutorial-backdrop-interactive"></div>

      {/* Spotlight cutout for target element */}
      {targetRect && step.highlightElement && isElementVisible && (
        <>
          <div
            className="tutorial-spotlight-cutout"
            style={{
              top: `${targetRect.top - 8}px`,
              left: `${targetRect.left - 8}px`,
              width: `${targetRect.width + 16}px`,
              height: `${targetRect.height + 16}px`,
            }}
          ></div>

          {/* Pulsing border around target */}
          <div
            className="tutorial-spotlight-border"
            style={{
              top: `${targetRect.top - 12}px`,
              left: `${targetRect.left - 12}px`,
              width: `${targetRect.width + 24}px`,
              height: `${targetRect.height + 24}px`,
            }}
          ></div>
        </>
      )}

      {/* Tutorial modal with instructions */}
      <div
        className={`tutorial-modal-interactive tutorial-position-${step.position || 'center'}`}
        style={getModalPosition(step.position, targetRect)}
      >
        <div className="tutorial-modal-header">
          <h3 className="tutorial-modal-title">{step.title}</h3>
          {step.canSkip && (
            <button
              className="tutorial-skip-button"
              onClick={onSkip}
              title="Skip tutorial"
            >
              ✕ Skip
            </button>
          )}
        </div>

        <div className="tutorial-modal-body">
          <p className="tutorial-modal-message">{step.message}</p>

          {/* Warning if element not found */}
          {step.targetElement && !isElementVisible && (
            <div className="tutorial-element-warning">
              ⚠️ Looking for the element...
            </div>
          )}
        </div>

        <div className="tutorial-modal-footer">
          {/* Show continue button for informational steps or explicit request */}
          {shouldShowContinueButton && (
            <button
              className="tutorial-next-button"
              onClick={handleAction}
            >
              {step.isFinal ? '🎉 Finish' : '➡️ Continue'}
            </button>
          )}

          {/* Show action hint for steps requiring user action */}
          {step.requiresAction && !shouldShowContinueButton && (
            <div className="tutorial-action-hint">
              👆 {step.targetElement ? 'Click the highlighted area' : 'Complete the action to continue'}
            </div>
          )}

          {/* Skip link for steps that can't be skipped from header */}
          {!step.canSkip && !step.isFinal && (
            <button
              className="tutorial-skip-link"
              onClick={onSkip}
            >
              Skip Tutorial
            </button>
          )}
        </div>

        {/* Arrow pointing to target */}
        {targetRect && step.highlightElement && isElementVisible && (
          <div className={`tutorial-arrow tutorial-arrow-${getArrowDirection(step.position, targetRect)}`}></div>
        )}
      </div>

      {/* Progress indicator */}
      {step.phase && (
        <div className="tutorial-progress-indicator">
          <div className="tutorial-progress-phase">{getPhaseDisplay(step.phase)}</div>
        </div>
      )}
    </div>
  );
};

// Calculate modal position based on target element with viewport boundary checking
function getModalPosition(position, targetRect) {
  // If center or no target element, always center
  if (position === 'center' || !targetRect) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }

  const padding = 20;
  const arrowOffset = 30;
  const modalWidth = 400; // Max modal width
  const modalHeight = 300; // Estimated modal height
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let style = {};

  switch (position) {
    case 'top':
      // Position above target
      let topY = targetRect.top - modalHeight - arrowOffset;

      // Check if modal would go above viewport
      if (topY < padding) {
        // Not enough space above, position below instead
        topY = targetRect.top + targetRect.height + arrowOffset;
      }

      style = {
        top: `${Math.max(padding, topY)}px`,
        left: `${Math.min(Math.max(modalWidth / 2 + padding, targetRect.left + targetRect.width / 2), viewportWidth - modalWidth / 2 - padding)}px`,
        transform: 'translateX(-50%)'
      };
      break;

    case 'bottom':
      // Position below target
      let bottomY = targetRect.top + targetRect.height + arrowOffset;

      // Check if modal would go below viewport
      if (bottomY + modalHeight > viewportHeight - padding) {
        // Not enough space below, position above instead
        bottomY = targetRect.top - modalHeight - arrowOffset;
      }

      style = {
        top: `${Math.max(padding, bottomY)}px`,
        left: `${Math.min(Math.max(modalWidth / 2 + padding, targetRect.left + targetRect.width / 2), viewportWidth - modalWidth / 2 - padding)}px`,
        transform: 'translateX(-50%)'
      };
      break;

    case 'left':
      // Position to the left of target
      let leftX = targetRect.left - modalWidth - arrowOffset;

      // Check if modal would go off left edge
      if (leftX < padding) {
        // Not enough space on left, center instead
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
      }

      style = {
        top: `${Math.min(Math.max(padding, targetRect.top + targetRect.height / 2), viewportHeight - padding)}px`,
        left: `${Math.max(padding, leftX)}px`,
        transform: 'translateY(-50%)'
      };
      break;

    case 'right':
      // Position to the right of target
      let rightX = targetRect.left + targetRect.width + arrowOffset;

      // Check if modal would go off right edge
      if (rightX + modalWidth > viewportWidth - padding) {
        // Not enough space on right, center instead
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
      }

      style = {
        top: `${Math.min(Math.max(padding, targetRect.top + targetRect.height / 2), viewportHeight - padding)}px`,
        left: `${rightX}px`,
        transform: 'translateY(-50%)'
      };
      break;

    default:
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
  }

  return style;
}

// Determine arrow direction based on actual modal position relative to target
function getArrowDirection(intendedPosition, targetRect) {
  if (!targetRect) return intendedPosition;

  // For mobile, arrows are hidden anyway
  if (window.innerWidth < 768) {
    return intendedPosition;
  }

  // Use intended position as arrow direction
  // The CSS will handle hiding arrows if they don't make sense
  return intendedPosition || 'bottom';
}

// Get display text for phase
function getPhaseDisplay(phase) {
  const phases = {
    menu: '📋 Main Menu',
    briefing: '📁 Case Briefing',
    investigation: '🔍 Investigation',
    interrogation: '💬 Interrogation',
    result: '🎯 Case Result'
  };

  return phases[phase] || '';
}

export default InteractiveTutorialOverlay;
