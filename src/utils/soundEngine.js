/**
 * Sound Engine - Procedural Sound Effects using Web Audio API
 * Generates all sounds programmatically - no external audio files needed
 */

class SoundEngine {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3; // Default volume (0.0 to 1.0)
    this.enabled = true;
    this.hoverSoundsEnabled = false; // Hover sounds disabled by default (can be annoying)

    // Initialize
    this.init();
  }

  /**
   * Initialize Audio Context
   */
  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('🔊 Sound Engine initialized');

      // Load settings from localStorage
      this.loadSettings();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.enabled = false;
    }
  }

  /**
   * Resume audio context (required after user interaction in some browsers)
   */
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    const savedEnabled = localStorage.getItem('sfxEnabled');
    const savedVolume = localStorage.getItem('sfxVolume');
    const savedHover = localStorage.getItem('sfxHoverEnabled');

    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true';
    }

    if (savedVolume !== null) {
      this.masterVolume = parseFloat(savedVolume);
    }

    if (savedHover !== null) {
      this.hoverSoundsEnabled = savedHover === 'true';
    }
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    localStorage.setItem('sfxEnabled', this.enabled.toString());
    localStorage.setItem('sfxVolume', this.masterVolume.toString());
    localStorage.setItem('sfxHoverEnabled', this.hoverSoundsEnabled.toString());
  }

  /**
   * Toggle sounds on/off
   */
  toggleEnabled() {
    this.enabled = !this.enabled;
    this.saveSettings();
    return this.enabled;
  }

  /**
   * Set master volume
   */
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume)); // Clamp 0-1
    this.saveSettings();
  }

  /**
   * Toggle hover sounds
   */
  toggleHoverSounds() {
    this.hoverSoundsEnabled = !this.hoverSoundsEnabled;
    this.saveSettings();
    return this.hoverSoundsEnabled;
  }

  /**
   * Play a sound
   */
  play(soundType, volumeMultiplier = 1.0) {
    if (!this.enabled || !this.audioContext) return;

    // Resume audio context if needed
    this.resume();

    const volume = this.masterVolume * volumeMultiplier;

    switch(soundType) {
      // UI Sounds
      case 'click':
        this.playClick(volume);
        break;
      case 'hover':
        if (this.hoverSoundsEnabled) {
          this.playHover(volume);
        }
        break;
      case 'tab':
        this.playTab(volume);
        break;
      case 'modalOpen':
        this.playModalOpen(volume);
        break;
      case 'modalClose':
        this.playModalClose(volume);
        break;

      // Game Events
      case 'caseStart':
        this.playCaseStart(volume);
        break;
      case 'evidenceFound':
        this.playEvidenceFound(volume);
        break;
      case 'interrogation':
        this.playInterrogation(volume);
        break;
      case 'correctAccusation':
        this.playCorrectAccusation(volume);
        break;
      case 'wrongAccusation':
        this.playWrongAccusation(volume);
        break;
      case 'hintUsed':
        this.playHintUsed(volume);
        break;
      case 'dailyReset':
        this.playDailyReset(volume);
        break;

      // Notifications
      case 'success':
        this.playSuccess(volume);
        break;
      case 'error':
        this.playError(volume);
        break;
      case 'info':
        this.playInfo(volume);
        break;
      case 'warning':
        this.playWarning(volume);
        break;

      // Purchase/Progress
      case 'purchase':
        this.playPurchase(volume);
        break;
      case 'levelUp':
        this.playLevelUp(volume);
        break;
      case 'unlock':
        this.playUnlock(volume);
        break;
      case 'themeChange':
        this.playThemeChange(volume);
        break;

      default:
        console.warn('Unknown sound type:', soundType);
    }
  }

  // ============================================
  // UI INTERACTION SOUNDS
  // ============================================

  /**
   * Button Click - Clean, satisfying click
   */
  playClick(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Button Hover - Subtle tone
   */
  playHover(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = 600;

    gain.gain.setValueAtTime(volume * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Tab Switch - Soft swoosh
   */
  playTab(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

    gain.gain.setValueAtTime(volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Modal Open - Ascending chime
   */
  playModalOpen(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    [600, 800].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + (i * 0.08);
      gain.gain.setValueAtTime(volume * 0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  /**
   * Modal Close - Descending chime
   */
  playModalClose(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    [800, 600].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + (i * 0.08);
      gain.gain.setValueAtTime(volume * 0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  // ============================================
  // GAME EVENT SOUNDS
  // ============================================

  /**
   * Case Start - Mysterious tone
   */
  playCaseStart(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Evidence Found - Discovery ping
   */
  playEvidenceFound(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

    gain.gain.setValueAtTime(volume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Interrogation Start - Attention sound
   */
  playInterrogation(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    [700, 900].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'square';
      osc.frequency.value = freq;

      const startTime = now + (i * 0.1);
      gain.gain.setValueAtTime(volume * 0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

      osc.start(startTime);
      osc.stop(startTime + 0.1);
    });
  }

  /**
   * Correct Accusation - Victory fanfare
   */
  playCorrectAccusation(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    [600, 800, 1000].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + (i * 0.12);
      gain.gain.setValueAtTime(volume * 0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  /**
   * Wrong Accusation - Error buzz
   */
  playWrongAccusation(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    gain.gain.setValueAtTime(volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Hint Used - Helpful ding
   */
  playHintUsed(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = 1000;

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Daily Reset - Refresh chime
   */
  playDailyReset(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    [500, 700, 900].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + (i * 0.1);
      gain.gain.setValueAtTime(volume * 0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  // ============================================
  // NOTIFICATION SOUNDS
  // ============================================

  /**
   * Success - Pleasant chime
   */
  playSuccess(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    [800, 1200].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + (i * 0.1);
      gain.gain.setValueAtTime(volume * 0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  /**
   * Error - Warning beep
   */
  playError(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.value = 400;

    gain.gain.setValueAtTime(volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Info - Neutral tone
   */
  playInfo(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = 900;

    gain.gain.setValueAtTime(volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Warning - Alert sound
   */
  playWarning(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    [600, 600].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = now + (i * 0.15);
      gain.gain.setValueAtTime(volume * 0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

      osc.start(startTime);
      osc.stop(startTime + 0.1);
    });
  }

  // ============================================
  // PURCHASE/PROGRESS SOUNDS
  // ============================================

  /**
   * Purchase - Cash register "cha-ching"
   */
  playPurchase(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    [400, 600, 800, 1000].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + (i * 0.05);
      gain.gain.setValueAtTime(volume * 0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  /**
   * Level Up - Achievement fanfare
   */
  playLevelUp(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    [500, 700, 900, 1200].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + (i * 0.15);
      gain.gain.setValueAtTime(volume * 0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  /**
   * Unlock - Feature unlock sound
   */
  playUnlock(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Theme Change - Transition whoosh
   */
  playThemeChange(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

    gain.gain.setValueAtTime(volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
  }
}

// Create global sound engine instance
const soundEngine = new SoundEngine();

// Make it globally accessible
if (typeof window !== 'undefined') {
  window.soundEngine = soundEngine;
}

// Export
export default soundEngine;
