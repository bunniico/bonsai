/**
 * Celebratory UI sounds, synthesized with the Web Audio API so no audio
 * assets need shipping. Three tiers of happiness:
 *
 *  - micro-lesson complete → a short two-note blip (~0.2s)
 *  - parent node complete  → a medium ascending arpeggio (~0.6s)
 *  - level up              → a long fanfare with a closing chord (~1.5s)
 *
 * The AudioContext is created lazily on first play; all plays happen inside
 * click handlers, so the browser's user-gesture requirement is satisfied.
 */

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Play one note with a soft attack and exponential decay. */
function tone(
  ac: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  peakGain: number,
  type: OscillatorType = 'triangle',
): void {
  const start = ac.currentTime + startOffset;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peakGain, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

// Notes (Hz), C major — everything below stays on the happy side of the scale.
const G5 = 783.99;
const C6 = 1046.5;
const E6 = 1318.5;
const G6 = 1568.0;
const C5 = 523.25;
const E5 = 659.25;

/** Short happy blip for completing a micro-lesson. */
export function playMicroComplete(): void {
  const ac = getContext();
  if (!ac) return;
  tone(ac, G5, 0, 0.12, 0.12);
  tone(ac, C6, 0.08, 0.18, 0.12);
}

/** Medium happy arpeggio for completing a parent node. */
export function playNodeComplete(): void {
  const ac = getContext();
  if (!ac) return;
  tone(ac, C5, 0, 0.16, 0.12);
  tone(ac, E5, 0.1, 0.16, 0.12);
  tone(ac, G5, 0.2, 0.16, 0.12);
  tone(ac, C6, 0.3, 0.35, 0.14);
}

/** Long happy fanfare for leveling up. */
export function playLevelUp(): void {
  const ac = getContext();
  if (!ac) return;
  tone(ac, C5, 0, 0.18, 0.11);
  tone(ac, E5, 0.12, 0.18, 0.11);
  tone(ac, G5, 0.24, 0.18, 0.11);
  tone(ac, C6, 0.36, 0.22, 0.13);
  tone(ac, G5, 0.52, 0.22, 0.11);
  tone(ac, E6, 0.52, 0.22, 0.09);
  // Closing chord, held and shimmering.
  tone(ac, C6, 0.72, 0.8, 0.11);
  tone(ac, E6, 0.72, 0.8, 0.08);
  tone(ac, G6, 0.76, 0.75, 0.06, 'sine');
}
