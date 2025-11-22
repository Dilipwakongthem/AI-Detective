import React, { useEffect, useState, useRef, useCallback } from 'react';
import './InteractiveTutorialOverlay.css';

const InteractiveTutorialOverlay = ({ step, onNext, onSkip, onComplete }) => {
  const [targetRect, setTargetRect] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);
  const [isElementVisible, setIsElementVisible] = useState(true);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
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
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right
    });
  };

  // Calculate modal position dynamically based on actual modal dimensions
  const calculateModalPosition = useCallback(() => {
    if (!modalRef.current) return;

    const modal = modalRef.current;
    const modalRect = modal.getBoundingClientRect();
    const modalWidth = modalRect.width;
    const modalHeight = modalRect.height;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 20;
    const gap = 30; // Gap between modal and target

    // If no target or center position, always center
    if (step.position === 'center' || !targetRect) {
      setModalPosition({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed'
      });
      return;
    }

    // Calculate available space in each direction
    const spaceAbove = targetRect.top;
    const spaceBelow = viewportHeight - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = viewportWidth - targetRect.right;

    let newPosition = {};
    let actualPosition = step.position; // Track which position we end up using

    // Try to position according to intended position, with smart fallbacks
    switch (step.position) {
      case 'top':
        // Try above first
        if (spaceAbove >= modalHeight + gap + padding) {
          newPosition = {
            top: `${targetRect.top - modalHeight - gap}px`,
            left: `${Math.min(Math.max(padding, targetRect.left + targetRect.width / 2 - modalWidth / 2), viewportWidth - modalWidth - padding)}px`,
            transform: 'none',
            position: 'fixed'
          };
          actualPosition = 'top';
        }
        // Not enough space above, try below
        else if (spaceBelow >= modalHeight + gap + padding) {
          newPosition = {
            top: `${targetRect.bottom + gap}px`,
            left: `${Math.min(Math.max(padding, targetRect.left + targetRect.width / 2 - modalWidth / 2), viewportWidth - modalWidth - padding)}px`,
            transform: 'none',
            position: 'fixed'
          };
          actualPosition = 'bottom';
        }
        // Not enough space above or below, center on screen
        else {
          newPosition = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'fixed'
          };
          actualPosition = 'center';
        }
        break;

      case 'bottom':
        // Try below first
        if (spaceBelow >= modalHeight + gap + padding) {
          newPosition = {
            top: `${targetRect.bottom + gap}px`,
            left: `${Math.min(Math.max(padding, targetRect.left + targetRect.width / 2 - modalWidth / 2), viewportWidth - modalWidth - padding)}px`,
            transform: 'none',
            position: 'fixed'
          };
          actualPosition = 'bottom';
        }
        // Not enough space below, try above
        else if (spaceAbove >= modalHeight + gap + padding) {
          newPosition = {
            top: `${targetRect.top - modalHeight - gap}px`,
            left: `${Math.min(Math.max(padding, targetRect.left + targetRect.width / 2 - modalWidth / 2), viewportWidth - modalWidth - padding)}px`,
            transform: 'none',
            position: 'fixed'
          };
          actualPosition = 'top';
        }
        // Not enough space, center on screen
        else {
          newPosition = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'fixed'
          };
          actualPosition = 'center';
        }
        break;

      case 'left':
        // Try left first (on mobile, this will fall back to center)
        if (viewportWidth < 768 || spaceLeft < modalWidth + gap + padding) {
          // Not enough space on left or mobile, center instead
          newPosition = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'fixed'
          };
          actualPosition = 'center';
        } else {
          newPosition = {
            top: `${Math.min(Math.max(padding, targetRect.top + targetRect.height / 2 - modalHeight / 2), viewportHeight - modalHeight - padding)}px`,
            left: `${targetRect.left - modalWidth - gap}px`,
            transform: 'none',
            position: 'fixed'
          };
          actualPosition = 'left';
        }
        break;

      case 'right':
        // Try right first (on mobile, this will fall back to center)
        if (viewportWidth < 768 || spaceRight < modalWidth + gap + padding) {
          // Not enough space on right or mobile, center instead
          newPosition = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'fixed'
          };
          actualPosition = 'center';
        } else {
          newPosition = {
            top: `${Math.min(Math.max(padding, targetRect.top + targetRect.height / 2 - modalHeight / 2), viewportHeight - modalHeight - padding)}px`,
            left: `${targetRect.right + gap}px`,
            transform: 'none',
            position: 'fixed'
          };
          actualPosition = 'right';
        }
        break;

      default:
        newPosition = {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'fixed'
        };
        actualPosition = 'center';
    }

    // Final boundary check - ensure modal is fully visible
    if (newPosition.left && typeof newPosition.left === 'string' && newPosition.left.endsWith('px')) {
      const leftValue = parseFloat(newPosition.left);
      if (leftValue < padding) {
        newPosition.left = `${padding}px`;
      } else if (leftValue + modalWidth > viewportWidth - padding) {
        newPosition.left = `${viewportWidth - modalWidth - padding}px`;
      }
    }

    if (newPosition.top && typeof newPosition.top === 'string' && newPosition.top.endsWith('px')) {
      const topValue = parseFloat(newPosition.top);
      if (topValue < padding) {
        newPosition.top = `${padding}px`;
      } else if (topValue + modalHeight > viewportHeight - padding) {
        newPosition.top = `${viewportHeight - modalHeight - padding}px`;
      }
    }

    // Store actual position for arrow rendering
    newPosition.actualPosition = actualPosition;
    setModalPosition(newPosition);

    console.log('[Tutorial] Modal positioned:', {
      intended: step.position,
      actual: actualPosition,
      modalSize: { width: modalWidth, height: modalHeight },
      position: newPosition
    });
  }, [step, targetRect]);

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

  // Recalculate modal position when modal renders or target rect changes
  useEffect(() => {
    if (modalRef.current) {
      // Small delay to ensure modal has rendered with content
      const timer = setTimeout(calculateModalPosition, 50);
      return () => clearTimeout(timer);
    }
  }, [step, targetRect, calculateModalPosition]);

  // Update positions on resize and scroll
  useEffect(() => {
    if (!step || !step.targetElement) return;

    const handleUpdate = () => {
      const target = document.querySelector(step.targetElement);
      if (target) {
        const rect = target.getBoundingClientRect();
        updateTargetRect(rect);
      }
      calculateModalPosition();
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
  }, [step, calculateModalPosition]);

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
      if (modalRef.current) {
        modalRef.current.classList.add('shake-attention');
        setTimeout(() => modalRef.current.classList.remove('shake-attention'), 500);
      }
    }
  };

  if (!step) return null;

  // Show continue button if explicitly requested or if highlighting without requiring action
  const shouldShowContinueButton = step.showContinueButton ||
    (!step.requiresAction && !step.isFinal);

  // Determine arrow direction based on actual position
  const arrowDirection = modalPosition?.actualPosition || step.position || 'bottom';

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
        ref={modalRef}
        className={`tutorial-modal-interactive tutorial-position-${arrowDirection}`}
        style={modalPosition || { opacity: 0 }} // Hide until positioned
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

        {/* Arrow pointing to target - only show if we have a target and it's visible */}
        {targetRect && step.highlightElement && isElementVisible && arrowDirection !== 'center' && (
          <div className={`tutorial-arrow tutorial-arrow-${arrowDirection}`}></div>
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
