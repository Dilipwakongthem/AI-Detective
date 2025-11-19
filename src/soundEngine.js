/**
 * SoundEngine - Procedural audio system for AI Detective game
 * Generates all sound effects using Web Audio API
 */
class SoundEngine {
  constructor() {
    // Initialize Audio Context
    this.audioContext = null;
    this.enabled = true;
    this.buttonSoundsEnabled = true;
    this.masterVolume = 0.7;

    // Initialize on first user interaction (required for iOS)
    this.initialized = false;
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  init() {
    if (this.initialized) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.initialized = true;
      console.log('🔊 Sound Engine initialized');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      this.enabled = false;
    }
  }

  /**
   * Resume audio context (required for iOS/mobile)
   */
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  /**
   * Play a sound effect
   * @param {string} soundType - Type of sound to play
   * @param {number} volumeMultiplier - Volume adjustment (0.0 - 1.0)
   */
  play(soundType, volumeMultiplier = 1.0) {
    if (!this.enabled || !this.audioContext) {
      this.init(); // Try to initialize if not already
      if (!this.enabled || !this.audioContext) return;
    }

    // Resume context if suspended
    this.resume();

    // Skip button sounds if disabled
    if (soundType === 'softClick' && !this.buttonSoundsEnabled) return;

    const volume = this.masterVolume * volumeMultiplier;

    try {
      switch(soundType) {
        case 'softClick':
          this.playSoftClick(volume);
          break;
        case 'click':
          this.playClick(volume);
          break;
        case 'success':
          this.playSuccess(volume);
          break;
        case 'error':
          this.playError(volume);
          break;
        case 'notification':
          this.playNotification(volume);
          break;
        case 'correctAccusation':
          this.playCorrectAccusation(volume);
          break;
        case 'wrongAccusation':
          this.playWrongAccusation(volume);
          break;
        case 'evidenceFound':
          this.playEvidenceFound(volume);
          break;
        case 'rankUp':
          this.playRankUp(volume);
          break;
        default:
          console.warn(`Unknown sound type: ${soundType}`);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  /**
   * Soft Click - Very subtle, gentle mouse click
   * Used for general UI interactions
   */
  playSoftClick(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Very short, soft click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Soft, high frequency for gentle tap
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);

    // Very low volume for subtlety
    gain.gain.setValueAtTime(volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    // Very short duration
    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Regular Click - More prominent click sound
   */
  playClick(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Success Sound - Positive feedback
   */
  playSuccess(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Two-tone ascending chime
    [0, 0.1].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(i === 0 ? 523.25 : 659.25, now + delay); // C5 -> E5

      gain.gain.setValueAtTime(volume * 0.3, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.3);

      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
    });
  }

  /**
   * Error Sound - Negative feedback
   */
  playError(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Notification Sound - Info alert
   */
  playNotification(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Correct Accusation - Victory sound
   */
  playCorrectAccusation(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Triumphant ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (i * 0.1));

      gain.gain.setValueAtTime(volume * 0.4, now + (i * 0.1));
      gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.4);

      osc.start(now + (i * 0.1));
      osc.stop(now + (i * 0.1) + 0.4);
    });
  }

  /**
   * Wrong Accusation - Failure sound
   */
  playWrongAccusation(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Descending "fail" sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);

    gain.gain.setValueAtTime(volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * Evidence Found - Discovery chime
   */
  playEvidenceFound(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Bright discovery sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.1);

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Rank Up - Promotion fanfare
   */
  playRankUp(volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Epic fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50]; // C5, E5, G5, C6, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (i * 0.15));

      gain.gain.setValueAtTime(volume * 0.5, now + (i * 0.15));
      gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.15) + 0.5);

      osc.start(now + (i * 0.15));
      osc.stop(now + (i * 0.15) + 0.5);
    });
  }

  /**
   * Toggle button sounds on/off
   */
  toggleButtonSounds() {
    this.buttonSoundsEnabled = !this.buttonSoundsEnabled;
    this.saveSettings();
    return this.buttonSoundsEnabled;
  }

  /**
   * Toggle all sounds on/off
   */
  toggleMute() {
    this.enabled = !this.enabled;
    this.saveSettings();
    return this.enabled;
  }

  /**
   * Set master volume
   * @param {number} volume - Volume level (0.0 - 1.0)
   */
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem('ai-detective-sound-settings', JSON.stringify({
        enabled: this.enabled,
        buttonSoundsEnabled: this.buttonSoundsEnabled,
        masterVolume: this.masterVolume
      }));
    } catch (error) {
      console.error('Failed to save sound settings:', error);
    }
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('ai-detective-sound-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.enabled = settings.enabled !== undefined ? settings.enabled : true;
        this.buttonSoundsEnabled = settings.buttonSoundsEnabled !== undefined ? settings.buttonSoundsEnabled : true;
        this.masterVolume = settings.masterVolume !== undefined ? settings.masterVolume : 0.7;
      }
    } catch (error) {
      console.error('Failed to load sound settings:', error);
    }
  }
}

// Create singleton instance
const soundEngine = new SoundEngine();
soundEngine.loadSettings();

export default soundEngine;
