// Web Audio API ambient frequency synthesizer for Icarus // Echoes of the Frequency
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let osc1: OscillatorNode | null = null;
let osc2: OscillatorNode | null = null;
let filter: BiquadFilterNode | null = null;
let isPlaying = false;

export const toggleFrequencyAudio = (targetFrequency = 142.8): boolean => {
  try {
    if (isPlaying) {
      stopFrequencyAudio();
      return false;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return false;

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Master gain with smooth fade-in
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.06, now + 1.5);
    masterGain.connect(audioCtx.destination);

    // Warm resonant filter
    filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(3, now);
    filter.connect(masterGain);

    // Deep sub drone
    osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    // Frequency scaled to audible range (around 71.4 Hz or 142.8 / 2)
    osc1.frequency.setValueAtTime(targetFrequency > 200 ? targetFrequency / 4 : 71.4, now);
    osc1.connect(filter);
    osc1.start();

    // Hypnotic harmonic overtone with subtle detune
    osc2 = audioCtx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(142.8, now);
    osc2.detune.setValueAtTime(4, now);
    
    const osc2Gain = audioCtx.createGain();
    osc2Gain.gain.setValueAtTime(0.02, now);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    osc2.start();

    isPlaying = true;
    return true;
  } catch (err) {
    console.warn('Audio play restricted:', err);
    return false;
  }
};

export const updateFrequency = (targetFrequency: number): void => {
  if (!isPlaying || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const baseFreq = targetFrequency > 200 ? targetFrequency / 4 : targetFrequency / 2;
    if (osc1) {
      osc1.frequency.cancelScheduledValues(now);
      osc1.frequency.linearRampToValueAtTime(Math.max(40, baseFreq), now + 0.1);
    }
    if (osc2) {
      osc2.frequency.cancelScheduledValues(now);
      osc2.frequency.linearRampToValueAtTime(targetFrequency, now + 0.1);
    }
    if (filter) {
      const filterCutoff = Math.max(300, Math.min(1800, targetFrequency * 4));
      filter.frequency.cancelScheduledValues(now);
      filter.frequency.linearRampToValueAtTime(filterCutoff, now + 0.1);
    }
  } catch (err) {
    console.warn('Frequency update error:', err);
  }
};

export const stopFrequencyAudio = (): void => {
  if (masterGain && audioCtx) {
    const now = audioCtx.currentTime;
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    setTimeout(() => {
      try {
        osc1?.stop();
        osc2?.stop();
        osc1?.disconnect();
        osc2?.disconnect();
      } catch {
        // ignore
      }
      isPlaying = false;
    }, 850);
  } else {
    isPlaying = false;
  }
};

export const isAudioActive = (): boolean => isPlaying;
