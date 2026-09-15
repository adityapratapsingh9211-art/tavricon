/**
 * TAVRICON — Luxury High-Tech Sound Engine (Web Audio API)
 * Synthesizes pure cinematic soundscapes and tactile UI feedback in real-time.
 * Zero external audio dependencies, zero latency, 100% offline & browser-compliant.
 */

class TavriconSoundEngine {
  constructor() {
    this.ctx = null;
    // Default to sound enabled unless explicitly muted by user
    this.enabled = localStorage.getItem('tavricon_sound_active') !== 'false';
    this.lastSliderTick = 0;
    this.hasUnlocked = false;
    this.revealHasPlayed = false;

    // Dual-engine: Preload WAV audio assets for guaranteed browser compatibility
    try {
      this.revealAudio = new Audio('assets/audio/reveal.wav');
      this.revealAudio.preload = 'auto';
      this.spellAudio = new Audio('assets/audio/spell.wav');
      this.spellAudio.preload = 'auto';
      this.clickAudio = new Audio('assets/audio/click.wav');
      this.clickAudio.preload = 'auto';
    } catch (e) {}

    this.initAudioContext();
    this.bindGlobalEvents();
  }

  /**
   * Initializes or returns the standard AudioContext
   */
  initAudioContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().then(() => {
            this.hasUnlocked = true;
          }).catch(() => {});
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };

      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
    } else if (this.ctx && this.ctx.state === 'running') {
      this.hasUnlocked = true;
    }
  }

  ensureContextRunning() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * 1. CRISP TACTILE UI CLICK SOUND
   * Satisfying micro-mechanical glass feedback for buttons, links, and switches.
   */
  playClick(intensity = 1.0) {
    if (!this.enabled) return;

    // 1. Play preloaded high-fidelity WAV click
    if (this.clickAudio) {
      try {
        const c = this.clickAudio.cloneNode();
        c.volume = Math.min(1.0, 0.45 * intensity);
        c.play().catch(() => {});
      } catch (e) {}
    }

    this.ensureContextRunning();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;

      // Primary transient snap (high-frequency micro-click)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1800, t);
      osc1.frequency.exponentialRampToValueAtTime(320, t + 0.022);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(350, t);

      gain1.gain.setValueAtTime(0.18 * intensity, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.024);

      osc1.connect(filter);
      filter.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start(t);
      osc1.stop(t + 0.025);

      // Subtle warm acoustic body
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(420, t);
      osc2.frequency.exponentialRampToValueAtTime(160, t + 0.028);

      gain2.gain.setValueAtTime(0.08 * intensity, t);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(t);
      osc2.stop(t + 0.032);
    } catch (e) {
      // Gracefully ignore audio context errors
    }
  }

  /**
   * 2. PRECISION SLIDER TICK SOUND
   * Modeled after rotary high-end dial clicks when dragging the ROAS spend slider.
   */
  playSliderTick() {
    if (!this.enabled) return;
    const now = performance.now();
    if (now - this.lastSliderTick < 40) return; // Throttle to prevent audio clipping
    this.lastSliderTick = now;

    this.playClick(0.35);
  }

  /**
   * 3. TWO-TONE TOGGLE BLIP
   * Plays when switching between Hyper-Scale and Maximum Margin modes.
   */
  playToggle(isScale = true) {
    if (!this.enabled) return;
    this.ensureContextRunning();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const startFreq = isScale ? 520 : 780;
      const endFreq = isScale ? 780 : 520;

      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.05);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.075);
    } catch (e) {}
  }

  /**
   * 4. SIGNATURE OPENING BRAND REVEAL SOUNDSCAPE (2.6s Cinematic Sequence)
   * Consists of:
   * - 0.0s: Deep velvet sub-bass cosmic swell
   * - 0.5s: Resonant cybernetic neon cyan beam whoosh
   * - 1.1s: Ascending royal crystalline arpeggiated chime chord (Royal Major 9th)
   * - 2.3s: Pneumatic curtain-lift atmospheric air release into homepage
   */
  playRevealSound() {
    if (!this.enabled) return;

    // 1. Play high-fidelity voice spelling T-A-V-R-I-C-O-N
    if (this.spellAudio) {
      try {
        this.spellAudio.currentTime = 0;
        this.spellAudio.volume = 1.0;
        const p = this.spellAudio.play();
        if (p !== undefined) {
          p.catch(() => {
            // Autoplay blocked: fallback to browser SpeechSynthesis
            this.speakSpell();
          });
        }
      } catch (e) {
        this.speakSpell();
      }
    } else {
      this.speakSpell();
    }

    // 2. Play backing cinematic soundscape (sub-bass, cyber whoosh, royal chimes)
    if (this.revealAudio) {
      try {
        this.revealAudio.currentTime = 0;
        this.revealAudio.volume = 0.75;
        this.revealAudio.play().catch(() => {});
      } catch (e) {}
    }

    this.ensureContextRunning();
    if (!this.ctx || this.ctx.state !== 'running') return;
    if (this.revealSynthPlayed) return;
    this.revealSynthPlayed = true;

    try {
      const t = this.ctx.currentTime;

      // --- PHASE 1: Sub-bass Cosmic Swell (0.0s - 2.5s) ---
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(42, t);
      subOsc.frequency.exponentialRampToValueAtTime(88, t + 1.2);
      subOsc.frequency.exponentialRampToValueAtTime(38, t + 2.4);

      subGain.gain.setValueAtTime(0.001, t);
      subGain.gain.exponentialRampToValueAtTime(0.32, t + 0.9);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(t);
      subOsc.stop(t + 2.55);

      // --- PHASE 2: Cybernetic Neon Cyan Light Sweep (0.4s - 1.8s) ---
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.Q.setValueAtTime(3.8, t + 0.35);
      bandpass.frequency.setValueAtTime(220, t + 0.35);
      bandpass.frequency.exponentialRampToValueAtTime(3400, t + 1.35);
      bandpass.frequency.exponentialRampToValueAtTime(700, t + 1.9);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, t);
      noiseGain.gain.linearRampToValueAtTime(0.19, t + 0.85);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.95);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t + 0.35);
      noise.stop(t + 2.0);

      // --- PHASE 3: Royal Crystalline Chime Chord (1.0s - 2.7s) ---
      // Frequencies corresponding to shimmering C6, E6, G6, B6, D7 (Pentatonic Royal 9th)
      const chordFrequencies = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
      chordFrequencies.forEach((freq, idx) => {
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const startOffset = 0.95 + (idx * 0.07);

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, t + startOffset);

        chimeGain.gain.setValueAtTime(0.0001, t + startOffset);
        chimeGain.gain.linearRampToValueAtTime(0.08 / (idx * 0.25 + 1), t + startOffset + 0.035);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, t + startOffset + 1.3);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);

        chimeOsc.start(t + startOffset);
        chimeOsc.stop(t + startOffset + 1.35);
      });

      // --- PHASE 4: Soft Pneumatic Airlock Curtain Release (2.1s - 2.65s) ---
      const releaseOsc = this.ctx.createOscillator();
      const releaseGain = this.ctx.createGain();
      releaseOsc.type = 'triangle';
      releaseOsc.frequency.setValueAtTime(160, t + 2.1);
      releaseOsc.frequency.exponentialRampToValueAtTime(55, t + 2.65);

      releaseGain.gain.setValueAtTime(0.001, t + 2.1);
      releaseGain.gain.linearRampToValueAtTime(0.07, t + 2.3);
      releaseGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.7);

      releaseOsc.connect(releaseGain);
      releaseGain.connect(this.ctx.destination);
      releaseOsc.start(t + 2.1);
      releaseOsc.stop(t + 2.75);
    } catch (e) {
      console.warn('[TAVRICON Audio] Reveal sound synthesis bypassed:', e);
    }
  }

  /**
   * Immediately silence reveal audio on skip or early dismiss
   */
  stopRevealSound() {
    try {
      if (this.spellAudio) {
        this.spellAudio.pause();
        this.spellAudio.currentTime = 0;
      }
      if (this.revealAudio) {
        this.revealAudio.pause();
        this.revealAudio.currentTime = 0;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  }

  /**
   * Global event binding for clicks, buttons, and navigation elements
   */
  bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      // Trigger context on first interaction
      this.ensureContextRunning();

      // Check if target is an interactive element
      const interactiveEl = e.target.closest(
        'button, a, .btn, .nav-link, .drawer-nav-link, .filter-pill, .mode-btn, ' +
        '.accordion-header, .faq-trigger, .tab-item, .card-action, .chip, ' +
        'input[type="checkbox"], input[type="radio"], select, .close-modal, .modal-close-btn'
      );

      if (interactiveEl) {
        // Special case: don't double click sound toggle button
        if (interactiveEl.classList.contains('sound-toggle-btn')) return;
        this.playClick();
      }
    }, { passive: true });
  }

  /**
   * Toggle global audio on/off
   */
  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('tavricon_sound_active', this.enabled ? 'true' : 'false');
    
    if (this.enabled) {
      this.ensureContextRunning();
      this.playClick(1.2);
    }

    this.updateToggleUI();
    return this.enabled;
  }

  /**
   * Sync visual state of all sound buttons on the page
   */
  updateToggleUI() {
    const buttons = document.querySelectorAll('.sound-toggle-btn');
    buttons.forEach((btn) => {
      if (this.enabled) {
        btn.classList.remove('sound-muted');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('title', 'Sound Effects: ON (Click to Mute)');
        const textSpan = btn.querySelector('.sound-status-text');
        if (textSpan) textSpan.textContent = 'SOUND ON';
      } else {
        btn.classList.add('sound-muted');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('title', 'Sound Effects: MUTED (Click to Enable)');
        const textSpan = btn.querySelector('.sound-status-text');
        if (textSpan) textSpan.textContent = 'SOUND OFF';
      }
    });
  }

  /**
   * Speak company name via SpeechSynthesis as fallback if audio asset is blocked
   */
  speakSpell() {
    if (!this.enabled || !('speechSynthesis' in window)) return;
    try {
      // If spellAudio is actively playing, don't overlap browser speech
      if (this.spellAudio && !this.spellAudio.paused) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Tavricon.");
      utterance.rate = 1.22; // Fast, energetic, high-impact tempo
      utterance.pitch = 1.06; // Elegant, crisp female executive tone
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => 
        (v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Victoria') || v.name.includes('Female') || v.name.includes('Karen') || v.name.includes('Ava')) && v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (femaleVoice) utterance.voice = femaleVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }
}

// Global Singleton Instance
window.tavriconSound = new TavriconSoundEngine();

// Auto-wire Sound Toggles and ROAS Slider on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.tavriconSound.updateToggleUI();

  // Connect sound toggles
  document.querySelectorAll('.sound-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.tavriconSound.toggleSound();
    });
  });

  // Connect ROAS ad spend slider (support sim-spend-slider and monthly-spend-slider)
  const spendSlider = document.getElementById('sim-spend-slider') || document.getElementById('monthly-spend-slider');
  if (spendSlider) {
    spendSlider.addEventListener('input', () => {
      window.tavriconSound.playSliderTick();
    }, { passive: true });
  }

  // Connect Strategy Mode buttons (Scale vs Margin)
  const btnScale = document.getElementById('mode-scale') || document.getElementById('btn-scale-mode');
  const btnMargin = document.getElementById('mode-margin') || document.getElementById('btn-margin-mode');
  if (btnScale) {
    btnScale.addEventListener('click', () => {
      window.tavriconSound.playToggle(true);
    });
  }
  if (btnMargin) {
    btnMargin.addEventListener('click', () => {
      window.tavriconSound.playToggle(false);
    });
  }
});
