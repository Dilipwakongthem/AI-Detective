// Interactive Tutorial System for AI Detective
// Redesigned to provide guided, interactive onboarding from main menu through first case completion

const TUTORIAL_STEPS = {
  // === PHASE 1: WELCOME & MAIN MENU ===
  WELCOME: {
    id: 'welcome',
    title: '🕵️ Welcome to AI Detective!',
    message: `You're about to become a detective and solve your first case.

I'll guide you step-by-step through your first investigation. Let's get started!`,
    position: 'center',
    targetElement: null, // No specific target, just a welcome message
    requiresAction: false,
    nextTrigger: 'click_continue',
    canSkip: true,
    phase: 'menu'
  },

  MAIN_MENU_INTRO: {
    id: 'main_menu_intro',
    title: '📋 Your Detective Dashboard',
    message: `This is your main menu where you'll start new cases and track your progress.

Click the **"🔍 NEW CASE"** button to begin your first investigation.`,
    position: 'bottom',
    targetElement: '[data-tutorial="new-case-btn"]',
    highlightElement: true,
    blockOtherClicks: true,
    requiresAction: true,
    nextTrigger: 'case_started',
    phase: 'menu'
  },

  // === PHASE 2: CASE BRIEFING ===
  CASE_BRIEFING: {
    id: 'case_briefing',
    title: '📋 Case Briefing',
    message: `Here's your case information:
• **Crime Type** - What happened
• **Location** - Where it occurred
• **Victim** - Who was affected
• **Suspects** - People to investigate

Read through the details, then click **"Begin Investigation"** to start.`,
    position: 'top',
    targetElement: '[data-tutorial="begin-investigation-btn"]',
    highlightElement: true,
    blockOtherClicks: true,
    requiresAction: true,
    nextTrigger: 'investigation_started',
    phase: 'briefing'
  },

  // === PHASE 3: INVESTIGATION ===
  INVESTIGATION_OVERVIEW: {
    id: 'investigation_overview',
    title: '🔍 Investigation Screen',
    message: `Welcome to the crime scene! This is where you'll:
• **Search for Evidence** - Find clues
• **Question Suspects** - Interrogate witnesses
• **Review Evidence** - Analyze what you've found
• **Make Accusation** - Identify the culprit

Let's find your first piece of evidence!`,
    position: 'center',
    targetElement: null,
    requiresAction: false,
    nextTrigger: 'click_continue',
    phase: 'investigation'
  },

  SEARCH_EVIDENCE: {
    id: 'search_evidence',
    title: '🔎 Find Evidence',
    message: `Click **"🔍 Search Crime Scene"** to investigate the crime scene.

Evidence is crucial - it connects suspects to the crime through physical traits and behavioral patterns.`,
    position: 'top',
    targetElement: '[data-tutorial="search-evidence-btn"]',
    highlightElement: true,
    blockOtherClicks: true,
    requiresAction: true,
    nextTrigger: 'evidence_found',
    phase: 'investigation'
  },

  EVIDENCE_FOUND: {
    id: 'evidence_found',
    title: '✅ Evidence Discovered!',
    message: `Great! You found your first clue.

Check the **Investigation Log** below to see what you discovered. The log tracks all your findings and interrogation notes.

Click Continue when ready to interrogate a suspect.`,
    position: 'bottom',
    targetElement: '[data-tutorial="investigation-log"]',
    highlightElement: true,
    blockOtherClicks: false,
    requiresAction: false,
    nextTrigger: 'click_continue',
    showContinueButton: true,
    phase: 'investigation'
  },

  // === PHASE 4: INTERROGATION ===
  SELECT_SUSPECT: {
    id: 'select_suspect',
    title: '👤 Interrogate Suspects',
    message: `Now let's question a suspect.

Each suspect has:
• **Personality** - How they respond
• **Nervousness Level** - How anxious they appear
• **Alibi** - Their claim about whereabouts

Click on **any suspect card** to begin interrogation.`,
    position: 'right',
    targetElement: '[data-tutorial="suspect-list"]',
    highlightElement: true,
    blockOtherClicks: true,
    requiresAction: true,
    nextTrigger: 'suspect_selected',
    phase: 'investigation',
    compactModal: true // Special flag for smaller modal
  },

  INTERROGATION_INTRO: {
    id: 'interrogation_intro',
    title: '💬 Interrogation',
    message: `During interrogation, you'll:
• Ask questions across different categories
• Observe nervousness levels and body language
• Look for contradictions and evasive responses

**Tip:** Guilty suspects often show higher nervousness, but innocent people can be nervous too!

Click **"Ask Question"** to begin.`,
    position: 'bottom',
    targetElement: '[data-tutorial="ask-question-btn"]',
    highlightElement: true,
    blockOtherClicks: true,
    requiresAction: true,
    nextTrigger: 'question_asked',
    phase: 'interrogation'
  },

  INTERROGATION_RESPONSE: {
    id: 'interrogation_response',
    title: '🎭 Reading Suspects',
    message: `Pay attention to:

📊 **Nervousness Level** - How anxious they appear (0-100%)
👁️ **Body Language** - Physical tells that reveal stress
🗣️ **Response Style** - Defensive, evasive, or cooperative

Interrogate multiple suspects to compare patterns. Click **"Back to Investigation"** to continue.`,
    position: 'bottom',
    targetElement: '[data-tutorial="back-to-investigation-btn"]',
    highlightElement: true,
    blockOtherClicks: true,
    requiresAction: true,
    nextTrigger: 'back_to_investigation',
    phase: 'interrogation'
  },

  // === PHASE 5: COLLECTING MORE EVIDENCE ===
  COLLECT_MORE_EVIDENCE: {
    id: 'collect_more_evidence',
    title: '🔍 Build Your Case',
    message: `Good work! Before making an accusation, you should:

1. **Collect more evidence** - Search for additional clues
2. **Interrogate all suspects** - Compare their responses
3. **Review evidence matches** - Check the evidence board

Let's find more evidence. Click **"Search for Evidence"** again.`,
    position: 'bottom',
    targetElement: '[data-tutorial="search-evidence-btn"]',
    highlightElement: true,
    blockOtherClicks: true,
    requiresAction: true,
    nextTrigger: 'second_evidence_found',
    phase: 'investigation'
  },

  READY_TO_ACCUSE: {
    id: 'ready_to_accuse',
    title: '⚖️ You\'re Ready, Detective!',
    message: `Great work! You've learned the fundamentals of being a detective:
• **Gathering Evidence** - Finding clues at crime scenes
• **Interrogating Suspects** - Reading body language and responses
• **Analyzing Matches** - Connecting evidence to suspects

**What's Next:**
When you're confident, click on a suspect and choose **"Accuse"** to solve the case!

Or keep investigating to gather more evidence. You're in control now!

**The tutorial ends here - good luck! 🕵️**`,
    position: 'center',
    targetElement: null, // No specific target - they're free to explore
    highlightElement: false,
    blockOtherClicks: false, // Full freedom
    requiresAction: false,
    showContinueButton: true,
    isFinal: true, // This is the final tutorial step
    nextTrigger: 'click_continue',
    phase: 'investigation'
  },

  // === PHASE 6: RESULT & ACCOUNT CREATION ===
  CASE_RESULT: {
    id: 'case_result',
    title: '🎯 Case Closed!',
    message: `You've completed your first case!

Your performance is rated with ⭐ stars based on:
• Correct suspect identified
• Evidence collected
• Interrogations conducted

The more thorough your investigation, the higher your rating. Let's continue...`,
    position: 'center',
    targetElement: null,
    requiresAction: false,
    nextTrigger: 'click_continue',
    phase: 'result'
  },

  SAVE_PROGRESS_INTRO: {
    id: 'save_progress_intro',
    title: '💾 Save Your Progress',
    message: `Great detective work! 🎉

To save your progress and continue solving cases, you should create an account.

**Benefits of Creating an Account:**
• 📱 Access from any device
• 💾 Never lose your progress
• 🏆 Track your detective rank
• ⭐ Unlock achievements

Click **"Return to Menu"** to set up your account.`,
    position: 'center',
    targetElement: '[data-tutorial="return-menu-btn"]',
    highlightElement: true,
    blockOtherClicks: true,
    requiresAction: true,
    nextTrigger: 'returned_to_menu',
    phase: 'result'
  },

  TUTORIAL_COMPLETE: {
    id: 'tutorial_complete',
    title: '🎉 Tutorial Complete!',
    message: `Congratulations, Detective!

You've learned:
✓ How to investigate crime scenes
✓ How to collect and analyze evidence
✓ How to interrogate suspects
✓ How to make accusations

You're ready to solve more cases on your own!

**Tip:** You can access Settings (⚙️) anytime to:
• Adjust font size and colors
• Enable accessibility features
• Reset this tutorial if needed

Good luck! 🕵️`,
    position: 'center',
    targetElement: null,
    requiresAction: false,
    isFinal: true,
    phase: 'menu'
  }
};

// Tutorial step sequence
const TUTORIAL_SEQUENCE = [
  'welcome',
  'main_menu_intro',
  'case_briefing',
  'investigation_overview',
  'search_evidence',
  'evidence_found',
  'select_suspect',
  'interrogation_intro',
  'interrogation_response',
  'collect_more_evidence',
  'ready_to_accuse'
  // Tutorial ends here - player continues on their own
];

class InteractiveTutorial {
  constructor() {
    this.enabled = false;
    this.active = false;
    this.currentStep = null;
    this.completedSteps = [];
    this.skipped = false;
    this.loadState();
  }

  // Load tutorial state from localStorage
  loadState() {
    try {
      const saved = localStorage.getItem('ai_detective_interactive_tutorial');
      if (saved) {
        const state = JSON.parse(saved);
        this.enabled = state.enabled !== false; // Default to true
        this.active = state.active || false;
        this.currentStep = state.currentStep || null;
        this.completedSteps = state.completedSteps || [];
        this.skipped = state.skipped || false;

        console.log('[InteractiveTutorial] Loaded state:', {
          enabled: this.enabled,
          active: this.active,
          currentStep: this.currentStep,
          completedSteps: this.completedSteps.length,
          skipped: this.skipped
        });
      } else {
        // First-time player - enable and start tutorial
        this.enabled = true;
        this.active = true;
        this.currentStep = 'welcome';
        this.completedSteps = [];
        this.skipped = false;

        console.log('[InteractiveTutorial] First-time player - tutorial will start');
        this.saveState();
      }
    } catch (error) {
      console.error('[InteractiveTutorial] Error loading state:', error);
      this.enabled = true;
      this.active = true;
      this.currentStep = 'welcome';
    }
  }

  // Save tutorial state
  saveState() {
    try {
      const state = {
        enabled: this.enabled,
        active: this.active,
        currentStep: this.currentStep,
        completedSteps: this.completedSteps,
        skipped: this.skipped
      };
      localStorage.setItem('ai_detective_interactive_tutorial', JSON.stringify(state));
      console.log('[InteractiveTutorial] State saved:', state);
    } catch (error) {
      console.error('[InteractiveTutorial] Error saving state:', error);
    }
  }

  // Check if tutorial is active
  isActive() {
    return this.enabled && this.active && !this.skipped && this.currentStep !== null;
  }

  // Get current tutorial step
  getCurrentStep() {
    if (!this.isActive()) return null;
    return TUTORIAL_STEPS[this.currentStep.toUpperCase()];
  }

  // Advance to next step
  nextStep() {
    if (!this.isActive()) return;

    // Mark current step as completed
    if (this.currentStep && !this.completedSteps.includes(this.currentStep)) {
      this.completedSteps.push(this.currentStep);
    }

    // Find next step in sequence
    const currentIndex = TUTORIAL_SEQUENCE.indexOf(this.currentStep);
    if (currentIndex >= 0 && currentIndex < TUTORIAL_SEQUENCE.length - 1) {
      this.currentStep = TUTORIAL_SEQUENCE[currentIndex + 1];
      console.log('[InteractiveTutorial] Advanced to step:', this.currentStep);
    } else {
      // Tutorial complete
      this.complete();
    }

    this.saveState();
  }

  // Trigger step based on game event
  triggerEvent(eventName) {
    if (!this.isActive()) return;

    const currentStepData = this.getCurrentStep();
    if (currentStepData && currentStepData.nextTrigger === eventName) {
      console.log('[InteractiveTutorial] Event triggered:', eventName, '- advancing to next step');
      this.nextStep();
      return true;
    }

    return false;
  }

  // Skip tutorial
  skip() {
    console.log('[InteractiveTutorial] Tutorial skipped by user');
    this.skipped = true;
    this.active = false;
    this.currentStep = null;
    this.saveState();
  }

  // Complete tutorial
  complete() {
    console.log('[InteractiveTutorial] Tutorial completed');
    this.active = false;
    this.currentStep = null;
    this.saveState();
  }

  // Reset tutorial (for testing or user request)
  reset() {
    console.log('[InteractiveTutorial] Tutorial reset - will start from beginning');
    this.enabled = true;
    this.active = true;
    this.currentStep = 'welcome';
    this.completedSteps = [];
    this.skipped = false;
    this.saveState();
  }

  // Check if tutorial should block clicks outside target
  shouldBlockClicks() {
    const step = this.getCurrentStep();
    return step && step.blockOtherClicks === true;
  }

  // Get target element selector for current step
  getTargetElement() {
    const step = this.getCurrentStep();
    return step ? step.targetElement : null;
  }

  // Get tutorial progress percentage
  getProgress() {
    if (this.skipped || !this.enabled) return 100;
    if (!this.active) return 100;
    return Math.floor((this.completedSteps.length / TUTORIAL_SEQUENCE.length) * 100);
  }
}

// Singleton instance
const interactiveTutorial = new InteractiveTutorial();

export default interactiveTutorial;
export { TUTORIAL_STEPS, TUTORIAL_SEQUENCE };
