import React from 'react';
import './TutorialModal.css';

const TutorialModal = ({ step, onNext, onSkip, onComplete }) => {
  if (!step) return null;

  const handleAction = () => {
    if (step.isFinal) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div className="tutorial-backdrop" onClick={(e) => e.stopPropagation()}></div>

      {/* Tutorial modal */}
      <div className={`tutorial-modal tutorial-position-${step.position || 'center'}`}>
        <div className="tutorial-header">
          <h3 className="tutorial-title">{step.title}</h3>
          {step.canSkip && (
            <button
              className="tutorial-skip-btn"
              onClick={onSkip}
              title="Skip tutorial"
            >
              ✕ Skip Tutorial
            </button>
          )}
        </div>

        <div className="tutorial-content">
          <p className="tutorial-message">{step.message}</p>
        </div>

        <div className="tutorial-footer">
          <button
            className="tutorial-action-btn"
            onClick={handleAction}
          >
            {step.isFinal ? '🎉 Finish' : '➡️ Next'}
          </button>
          {!step.isFinal && !step.canSkip && (
            <button
              className="tutorial-secondary-btn"
              onClick={onSkip}
            >
              Skip Tutorial
            </button>
          )}
        </div>

        {/* Visual pointer/arrow */}
        {step.targetElement && (
          <div className={`tutorial-arrow tutorial-arrow-${step.position || 'top'}`}></div>
        )}
      </div>
    </>
  );
};

export default TutorialModal;
