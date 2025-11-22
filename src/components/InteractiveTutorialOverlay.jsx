import React, { useEffect, useState, useRef } from 'react';
import './InteractiveTutorialOverlay.css';

const InteractiveTutorialOverlay = ({ step, onNext, onSkip, onComplete }) => {
  const [targetRect, setTargetRect] = useState(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!step || !step.targetElement) {
      setTargetRect(null);
      return;
    }

    // Find the target element and get its position
    const findAndHighlightTarget = () => {
      const target = document.querySelector(step.targetElement);
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });

        // Add highlight class to target element
        target.classList.add('tutorial-target-highlight');

        return () => {
          target.classList.remove('tutorial-target-highlight');
        };
      } else {
        console.warn('[Tutorial] Target element not found:', step.targetElement);
        setTargetRect(null);
      }
    };

    // Initial find
    const cleanup = findAndHighlightTarget();

    // Update on window resize
    const handleResize = () => {
      findAndHighlightTarget();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      if (cleanup) cleanup();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [step]);

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

  return (
    <div
      ref={overlayRef}
      className="tutorial-overlay-interactive"
      onClick={handleOverlayClick}
    >
      {/* Semi-transparent backdrop */}
      <div className="tutorial-backdrop-interactive"></div>

      {/* Spotlight cutout for target element */}
      {targetRect && step.highlightElement && (
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
        </div>

        <div className="tutorial-modal-footer">
          {!step.requiresAction && (
            <button
              className="tutorial-next-button"
              onClick={handleAction}
            >
              {step.isFinal ? '🎉 Finish' : '➡️ Continue'}
            </button>
          )}

          {step.requiresAction && (
            <div className="tutorial-action-hint">
              👆 Click the highlighted area above
            </div>
          )}

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
        {targetRect && step.highlightElement && (
          <div className={`tutorial-arrow tutorial-arrow-${step.position || 'bottom'}`}></div>
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

// Calculate modal position based on target element
function getModalPosition(position, targetRect) {
  if (!targetRect || !position) {
    return {};
  }

  const padding = 20;
  const arrowOffset = 30;

  switch (position) {
    case 'top':
      return {
        top: `${Math.max(padding, targetRect.top - 200 - arrowOffset)}px`,
        left: `${targetRect.left + targetRect.width / 2}px`,
        transform: 'translateX(-50%)'
      };

    case 'bottom':
      return {
        top: `${targetRect.top + targetRect.height + arrowOffset}px`,
        left: `${targetRect.left + targetRect.width / 2}px`,
        transform: 'translateX(-50%)'
      };

    case 'left':
      return {
        top: `${targetRect.top + targetRect.height / 2}px`,
        left: `${Math.max(padding, targetRect.left - 320 - arrowOffset)}px`,
        transform: 'translateY(-50%)'
      };

    case 'right':
      return {
        top: `${targetRect.top + targetRect.height / 2}px`,
        left: `${targetRect.left + targetRect.width + arrowOffset}px`,
        transform: 'translateY(-50%)'
      };

    case 'center':
    default:
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
  }
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
