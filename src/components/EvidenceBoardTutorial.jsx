import React, { useState, useEffect } from 'react';
import './EvidenceBoardTutorial.css';

/**
 * Evidence Board Tutorial - Interactive guide for first-time users
 */
const EvidenceBoardTutorial = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const tutorialSteps = [
    {
      title: "Welcome to the Evidence Board!",
      description: "The Evidence Board is your visual workspace for organizing clues and building deductions. Let's learn how to use it!",
      icon: "🔍",
      position: "center",
      highlight: null
    },
    {
      title: "Add Evidence to the Board",
      description: "Drag evidence or suspects from the left sidebar onto the grid. This lets you organize them spatially.",
      icon: "📦",
      position: "left",
      highlight: ".evidence-board-sidebar"
    },
    {
      title: "Create Connections",
      description: "Click the 'Connect' button on a card, then click another card to create a connection. Connections show relationships between evidence and suspects.",
      icon: "🔗",
      position: "center",
      highlight: ".evidence-card"
    },
    {
      title: "Connection Properties",
      description: "After creating a connection, you can set its type (Direct, Circumstantial, etc.), strength, and add notes about why they're connected.",
      icon: "⚡",
      position: "center",
      highlight: null
    },
    {
      title: "Use the Timeline",
      description: "Click the Timeline button to organize evidence chronologically. Understanding the sequence of events is crucial for solving cases.",
      icon: "🕐",
      position: "top",
      highlight: "button[title='Timeline Visualization']"
    },
    {
      title: "Check Your Insights",
      description: "The Insights panel analyzes your connections and provides feedback on patterns, warnings, and suggestions to strengthen your case.",
      icon: "🧠",
      position: "top",
      highlight: "button[title='Connection Insights']"
    },
    {
      title: "Build a Hypothesis",
      description: "Once you have at least 3 cards and connections, build a hypothesis naming the guilty party, their motive, and method.",
      icon: "💭",
      position: "top",
      highlight: ".board-btn-primary"
    },
    {
      title: "Undo/Redo",
      description: "Made a mistake? Use Undo (Ctrl+Z) and Redo (Ctrl+Y) to navigate your changes. Press Delete to remove selected cards.",
      icon: "↶",
      position: "top",
      highlight: null
    },
    {
      title: "You're Ready!",
      description: "You've learned the basics of the Evidence Board. Use it to build airtight cases and catch criminals. Good luck, Detective!",
      icon: "🎯",
      position: "center",
      highlight: null
    }
  ];

  useEffect(() => {
    // Mark as seen in localStorage
    localStorage.setItem('evidenceBoardTutorialSeen', 'true');
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    onSkip();
  };

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  // Get position class
  const getPositionClass = () => {
    switch (step.position) {
      case 'top': return 'tutorial-top';
      case 'left': return 'tutorial-left';
      case 'right': return 'tutorial-right';
      case 'bottom': return 'tutorial-bottom';
      default: return 'tutorial-center';
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className={`tutorial-overlay ${completed ? 'fade-out' : ''}`}>
        {/* Highlight specific element */}
        {step.highlight && (
          <div className="tutorial-highlight" data-highlight={step.highlight} />
        )}

        {/* Tutorial Card */}
        <div className={`tutorial-card ${getPositionClass()} ${completed ? 'slide-out' : ''}`}>
          <div className="tutorial-header">
            <div className="tutorial-icon">{step.icon}</div>
            <h3>{step.title}</h3>
          </div>

          <div className="tutorial-body">
            <p>{step.description}</p>
          </div>

          <div className="tutorial-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-text">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
          </div>

          <div className="tutorial-actions">
            <button
              className="tutorial-btn tutorial-btn-secondary"
              onClick={handleSkip}
            >
              Skip Tutorial
            </button>
            {currentStep > 0 && (
              <button
                className="tutorial-btn tutorial-btn-secondary"
                onClick={handlePrevious}
              >
                ← Previous
              </button>
            )}
            <button
              className="tutorial-btn tutorial-btn-primary"
              onClick={handleNext}
            >
              {currentStep < tutorialSteps.length - 1 ? 'Next →' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Check if tutorial should be shown
 */
export const shouldShowTutorial = () => {
  return !localStorage.getItem('evidenceBoardTutorialSeen');
};

export default EvidenceBoardTutorial;
