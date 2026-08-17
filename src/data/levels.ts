import type { LevelInfo } from '../types';

/**
 * Level names follow the traditional bonsai size classes, from seed to the
 * eight-handed Imperial bonsai — crowned by the yamadori, a wild-collected
 * tree prized above all. Thresholds span the tree's total XP (6230).
 */
export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Seed', minXp: 0 },
  { level: 2, name: 'Sprout', minXp: 150 },
  { level: 3, name: 'Seedling', minXp: 400 },
  { level: 4, name: 'Shito (fingertip)', minXp: 800 },
  { level: 5, name: 'Mame (palm)', minXp: 1300 },
  { level: 6, name: 'Shohin (one hand)', minXp: 1900 },
  { level: 7, name: 'Komono (two hands)', minXp: 2600 },
  { level: 8, name: 'Chumono (four hands)', minXp: 3400 },
  { level: 9, name: 'Omono (six hands)', minXp: 4300 },
  { level: 10, name: 'Imperial (eight hands)', minXp: 5300 },
  { level: 11, name: 'Yamadori (wild-collected)', minXp: 6100 },
];

export function levelForXp(xp: number): LevelInfo {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.minXp) current = l;
  return current;
}

export function nextLevel(xp: number): LevelInfo | null {
  return LEVELS.find((l) => l.minXp > xp) ?? null;
}
