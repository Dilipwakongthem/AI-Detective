// Tutorial System for AI Detective Game
// Provides guided onboarding for first-time players

const TUTORIAL_STEPS = {
  WELCOME: {
    id: 'welcome',
    title: '🕵️ Welcome, Detective!',
    message: `Welcome to AI Detective! I'm here to guide you through your first case.

You'll learn to:
• Investigate crime scenes for evidence
• Interrogate suspects
• Match evidence to identify the culprit
• Make your accusation

Ready to solve your first case?`,
    action: 'start',
    position: 'center',
    canSkip: true
  },

  CASE_OVERVIEW: {
    id: 'case_overview',
    title: '📋 Case Overview',
    message: `This is your case overview. Here you can see:

• **Crime Type & Location**: What happened and where
• **Victim Information**: Who was affected
• **Suspect List**: People to investigate
• **Evidence Panel**: Clues you've discovered

Your goal: Identify the guilty party using evidence and interrogation.`,
    action: 'highlight_case_info',
    position: 'top',
    targetElement: '.case-info'
  },

  INVESTIGATE_FIRST: {
    id: 'investigate_first',
    title: '🔍 Investigate the Scene',
    message: `Start by investigating the crime scene to find evidence.

Click **"Search for Evidence"** to discover clues. Evidence is crucial - it connects suspects to the crime through:
• Physical traits (height, build, blood type)
• Behavioral patterns (phone records, shoe prints)
• Direct connections (fingerprints, DNA)

Try finding your first piece of evidence!`,
    action: 'highlight_investigate_btn',
    position: 'bottom',
    targetElement: '.investigate-btn',
    completionTrigger: 'evidence_found'
  },

  EVIDENCE_FOUND: {
    id: 'evidence_found',
    title: '✅ Evidence Discovered!',
    message: `Great work! You found evidence.

**Evidence Matching**: Each piece of evidence contains details that may match suspect attributes. The game calculates match percentages automatically.

**Types of Evidence**:
• **Critical**: Strongly points to the guilty party
• **Circumstantial**: May match multiple suspects
• **Red Herring**: Misleading clues pointing to innocent suspects

Continue investigating to build your case.`,
    action: 'highlight_evidence_panel',
    position: 'right',
    targetElement: '.evidence-board'
  },

  INTERROGATE_INTRO: {
    id: 'interrogate_intro',
    title: '💬 Interrogation',
    message: `Now let's interrogate a suspect!

During interrogation, you'll:
• Ask questions across different categories (Alibi, Motive, Opportunity, etc.)
• Observe **nervousness levels** and **body language**
• Compare responses between suspects

**Tip**: Guilty suspects often show higher nervousness, but innocent suspects can be nervous too! Look for patterns.

Select a suspect to question.`,
    action: 'highlight_suspect_list',
    position: 'left',
    targetElement: '.suspects-list',
    completionTrigger: 'interrogation_started'
  },

  INTERROGATION_RESPONSE: {
    id: 'interrogation_response',
    title: '🎭 Reading Suspects',
    message: `Pay attention to:

📊 **Nervousness Level**: How anxious they appear (0-100%)
👁️ **Body Language**: Physical tells that reveal stress
🗣️ **Response Style**: Defensive, evasive, or cooperative

**Remember**:
• Innocent people can be nervous (past trauma, hiding unrelated secrets)
• Guilty suspects may act calm if they're calculating
• Red herrings are designed to mislead you!

Interrogate multiple suspects to compare patterns.`,
    action: 'none',
    position: 'center'
  },

  EVIDENCE_MATCHING: {
    id: 'evidence_matching',
    title: '🧩 Evidence Matching',
    message: `The Evidence Board shows how evidence matches each suspect.

**Match Confidence Levels**:
• 🔴 **HIGH** (40%+): Strong match, multiple traits align
• 🟡 **MEDIUM** (20-39%): Moderate connection
• 🟢 **LOW** (10-19%): Weak/circumstantial match

**Strategy**: Look for suspects with:
• Multiple HIGH confidence matches
• Direct evidence connections
• Consistent nervousness patterns across interrogations

The guilty party usually has the strongest evidence profile.`,
    action: 'highlight_evidence_board',
    position: 'right',
    targetElement: '.evidence-board'
  },

  MAKING_ACCUSATION: {
    id: 'making_accusation',
    title: '⚖️ Making Your Accusation',
    message: `When you're ready to accuse someone:

1. **Review All Evidence**: Check match percentages and connections
2. **Compare Suspects**: Who has the most evidence against them?
3. **Consider Interrogations**: Nervousness patterns and responses
4. **Watch for Red Herrings**: Innocent suspects designed to mislead

**Accusation Tips**:
• Wait until you have 2-3+ pieces of evidence against someone
• The game warns you if evidence is weak
• Correct accusations earn ⭐ stars based on performance

Click "Accuse" on the suspect you believe is guilty.`,
    action: 'highlight_accuse_buttons',
    position: 'left',
    targetElement: '.suspect-card',
    completionTrigger: 'accusation_made'
  },

  CASE_COMPLETE: {
    id: 'case_complete',
    title: '🎉 Tutorial Complete!',
    message: `Excellent work, Detective!

You've learned the fundamentals:
✓ Investigating crime scenes
✓ Collecting and analyzing evidence
✓ Interrogating suspects
✓ Making evidence-based accusations

**Advanced Features**:
• 📓 **Notebook**: Take personal notes on suspects
• 💡 **Hints**: Get guidance if you're stuck (costs hint tokens)
• ⚙️ **Settings**: Customize theme, sound, and difficulty
• 🏆 **Reputation**: Build your detective reputation to unlock features

Good luck on future cases!`,
    action: 'complete',
    position: 'center',
    isFinal: true
  }
};

// Tutorial step sequence
const TUTORIAL_SEQUENCE = [
  'welcome',
  'case_overview',
  'investigate_first',
  'evidence_found',
  'interrogate_intro',
  'interrogation_response',
  'evidence_matching',
  'making_accusation',
  'case_complete'
];

class TutorialSystem {
  constructor() {
    this.enabled = false;
    this.currentStep = null;
    this.completedSteps = [];
    this.skipped = false;
    this.loadState();
  }

  // Load tutorial state from localStorage
  loadState() {
    try {
      const saved = localStorage.getItem('ai_detective_tutorial');
      if (saved) {
        const state = JSON.parse(saved);
        this.enabled = state.enabled || false;
        this.currentStep = state.currentStep || null;
        this.completedSteps = state.completedSteps || [];
        this.skipped = state.skipped || false;
        console.log('[TutorialSystem] Loaded saved state:', {
          enabled: this.enabled,
          currentStep: this.currentStep,
          completedSteps: this.completedSteps.length,
          skipped: this.skipped
        });
      } else {
        // First time player - tutorial will be enabled when they start their first case
        this.enabled = true;
        this.currentStep = null; // Don't show tutorial on main menu
        this.completedSteps = [];
        this.skipped = false;
        console.log('[TutorialSystem] First time player - tutorial ready to start');
      }
    } catch (error) {
      console.error('Error loading tutorial state:', error);
      this.enabled = true;
      this.currentStep = null;
    }
  }

  // Save tutorial state
  saveState() {
    try {
      const state = {
        enabled: this.enabled,
        currentStep: this.currentStep,
        completedSteps: this.completedSteps,
        skipped: this.skipped
      };
      localStorage.setItem('ai_detective_tutorial', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving tutorial state:', error);
    }
  }

  // Start the tutorial (called when player starts their first case)
  start() {
    console.log('[TutorialSystem] start() called - enabled:', this.enabled,
                'skipped:', this.skipped, 'completedSteps:', this.completedSteps.length);

    if (this.enabled && !this.skipped && this.completedSteps.length === 0) {
      console.log('[TutorialSystem] Starting tutorial, setting currentStep to welcome');
      this.currentStep = 'welcome';
      this.saveState();
      console.log('[TutorialSystem] Tutorial started, isActive:', this.isActive());
    } else {
      console.log('[TutorialSystem] Tutorial not started - conditions not met');
    }
  }

  // Check if tutorial is active
  isActive() {
    return this.enabled && !this.skipped && this.currentStep !== null;
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
    } else {
      // Tutorial complete
      this.complete();
    }

    this.saveState();
  }

  // Trigger step based on game event
  triggerStep(eventName) {
    if (!this.isActive()) return;

    const currentStepData = this.getCurrentStep();
    if (currentStepData && currentStepData.completionTrigger === eventName) {
      this.nextStep();
    }

    // Also check for specific event-based step transitions
    switch (eventName) {
      case 'evidence_found':
        if (this.currentStep === 'investigate_first') {
          this.currentStep = 'evidence_found';
          this.saveState();
        }
        break;
      case 'interrogation_started':
        if (this.currentStep === 'interrogate_intro') {
          this.currentStep = 'interrogation_response';
          this.saveState();
        }
        break;
      case 'accusation_made':
        if (this.currentStep === 'making_accusation') {
          this.currentStep = 'case_complete';
          this.saveState();
        }
        break;
    }
  }

  // Skip tutorial
  skip() {
    this.skipped = true;
    this.enabled = false;
    this.currentStep = null;
    this.saveState();
  }

  // Complete tutorial
  complete() {
    this.enabled = false;
    this.currentStep = null;
    this.saveState();
  }

  // Reset tutorial (for testing or player request)
  reset() {
    this.enabled = true;
    this.currentStep = 'welcome';
    this.completedSteps = [];
    this.skipped = false;
    this.saveState();
  }

  // Check if specific step is completed
  isStepCompleted(stepId) {
    return this.completedSteps.includes(stepId);
  }

  // Get tutorial progress percentage
  getProgress() {
    if (this.skipped || !this.enabled) return 100;
    return Math.floor((this.completedSteps.length / TUTORIAL_SEQUENCE.length) * 100);
  }

  // Should show tooltip for element
  shouldShowTooltip(elementClass) {
    if (!this.isActive()) return false;

    const currentStepData = this.getCurrentStep();
    if (!currentStepData || !currentStepData.targetElement) return false;

    return currentStepData.targetElement.includes(elementClass);
  }
}

// Singleton instance
const tutorialSystem = new TutorialSystem();

export default tutorialSystem;
export { TUTORIAL_STEPS, TUTORIAL_SEQUENCE };
