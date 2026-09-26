// Web Audio API Sound Synthesizer for AdaptiveOS
// Generates crystal-clear, harmonic audio cues without external audio asset downloads.

let audioCtx = null;
let isMuted = localStorage.getItem('adaptiveos_sound_muted') === 'true';

function getContext() {
  if (isMuted) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundMuted() {
  return isMuted;
}

export function setSoundMuted(muted) {
  isMuted = muted;
  localStorage.setItem('adaptiveos_sound_muted', muted ? 'true' : 'false');
  return isMuted;
}

export function toggleSound() {
  return setSoundMuted(!isMuted);
}

// Gentle crisp UI click / navigation tap
export function playTap() {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // ignore
  }
}

// Uplifting two-tone harmonic success chime (Action confirmed / replan accepted)
export function playSuccess() {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const notes = [587.33, 880.00]; // D5, A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
      const start = ctx.currentTime + idx * 0.09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.08, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  } catch (e) {
    // ignore
  }
}

// Warm singing-bowl morning chime (C5, E5, G5, B5, C6)
export function playMorningChime() {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const noteStart = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.12, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteStart);
      osc.stop(noteStart + 1.3);
    });
  } catch (e) {
    // ignore
  }
}

// Soft caution / conflict warning dual tone
export function playAlert() {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const freqs = [440.0, 370.0];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const noteStart = ctx.currentTime + i * 0.14;
      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.07, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteStart);
      osc.stop(noteStart + 0.35);
    });
  } catch (e) {
    // ignore
  }
}
