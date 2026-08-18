/**
 * Celebratory UI sounds, synthesized with the Web Audio API so no audio
 * assets need shipping. Four tiers of happiness:
 *
 *  - micro-lesson complete → a short two-note blip (~0.2s) that climbs the
 *    scale with each lesson finished in the same group, combo-style
 *  - group complete        → a resolving cadence (~0.6s) that lands the
 *    tension the climb built up
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
const D6 = 1174.7;

/**
 * C-major pentatonic ladder the micro-lesson blip climbs, starting at the
 * original G5. Pentatonic so every rung stays consonant with every other —
 * the combo can start or stall anywhere and never sound sour. Eleven rungs
 * covers the largest group (9 lessons) plus the blip's two-rung interval.
 */
const COMBO_LADDER = [783.99, 880.0, 1046.5, 1174.7, 1318.5, 1568.0, 1760.0, 2093.0, 2349.3, 2637.0, 3136.0];

/**
 * Short happy blip for completing a micro-lesson. `step` is how many lessons
 * in the same group were already done — each one pitches the blip up a rung,
 * building tension toward the group-complete cadence.
 */
export function playMicroComplete(step = 0): void {
  const ac = getContext();
  if (!ac) return;
  const i = Math.min(Math.max(step, 0), COMBO_LADDER.length - 3);
  tone(ac, COMBO_LADDER[i], 0, 0.12, 0.12);
  tone(ac, COMBO_LADDER[i + 2], 0.08, 0.18, 0.12);
}

/**
 * Resolving cadence for finishing every micro-lesson in a group: a quick
 * dominant pickup that lands on a held tonic chord, releasing the tension
 * the rising combo blips built up.
 */
export function playGroupComplete(): void {
  const ac = getContext();
  if (!ac) return;
  tone(ac, G5, 0, 0.1, 0.1);
  tone(ac, D6, 0.02, 0.1, 0.07);
  tone(ac, C6, 0.12, 0.5, 0.12);
  tone(ac, E6, 0.12, 0.5, 0.09);
  tone(ac, G6, 0.14, 0.48, 0.06, 'sine');
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
