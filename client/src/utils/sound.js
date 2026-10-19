// Camera shutter click sound generator using Web Audio API

let audioCtx = null;

export const playCameraShutterSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;

    // Shutter click 1 (curtain open)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1400, t);
    osc1.frequency.exponentialRampToValueAtTime(120, t + 0.04);
    gain1.gain.setValueAtTime(0.3, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(t);
    osc1.stop(t + 0.05);

    // Shutter click 2 (curtain close / mirror slap)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(800, t + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(80, t + 0.12);
    gain2.gain.setValueAtTime(0.35, t + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(t + 0.06);
    osc2.stop(t + 0.14);
  } catch (e) {
    // Audio context not allowed or failed silently
  }
};
