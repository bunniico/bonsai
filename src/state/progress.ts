import { NODES, NODE_MAP } from '../data/curriculum';
import type { CurriculumNode, Progress } from '../types';

export const STORAGE_KEY = 'bonsai.progress.v1';

export function defaultProgress(): Progress {
  return {
    completed: {},
    images: {},
    achievements: {},
    settings: { showMature: false, driveClientId: '', muteSounds: false },
  };
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const base = defaultProgress();
    return {
      completed: parsed.completed ?? base.completed,
      images: parsed.images ?? base.images,
      achievements: parsed.achievements ?? base.achievements,
      settings: { ...base.settings, ...parsed.settings },
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

/** Nodes visible under the current settings. */
export function visibleNodes(p: Progress): CurriculumNode[] {
  return NODES.filter((n) => !n.mature || p.settings.showMature);
}

/**
 * A node is unlocked when each prerequisite group has enough completed
 * members. Nodes hidden by the mature filter are dropped from groups so the
 * rest of the tree never dead-ends on an invisible prerequisite.
 */
export function isUnlocked(node: CurriculumNode, p: Progress): boolean {
  return node.prereqs.every((group) => {
    const ids = p.settings.showMature
      ? group.ids
      : group.ids.filter((id) => !NODE_MAP.get(id)?.mature);
    const required = Math.min(group.required, ids.length);
    const done = ids.filter((id) => p.completed[id]).length;
    return done >= required;
  });
}

/** How many of a node's sub-nodes (if any) are complete. */
export function subNodeProgress(node: CurriculumNode, p: Progress): { done: number; total: number } {
  const subs = node.subNodes ?? [];
  return { done: subs.filter((s) => p.completed[s.id]).length, total: subs.length };
}

/**
 * XP earned toward a single node. Micro lessons pay out half the node's XP,
 * split evenly among them as they're completed; the other half is granted
 * when the node itself is complete. Nodes without micro lessons pay out in
 * full on completion.
 */
export function nodeEarnedXp(node: CurriculumNode, p: Progress): number {
  const subs = node.subNodes ?? [];
  if (subs.length === 0) return p.completed[node.id] ? node.xp : 0;
  const microPool = Math.floor(node.xp / 2);
  const done = subs.filter((s) => p.completed[s.id]).length;
  const microXp = Math.round((microPool * done) / subs.length);
  return microXp + (p.completed[node.id] ? node.xp - microPool : 0);
}

export function earnedXp(p: Progress): number {
  return NODES.reduce((s, n) => s + nodeEarnedXp(n, p), 0);
}

export function availableXp(p: Progress): number {
  return visibleNodes(p).reduce((s, n) => s + n.xp, 0);
}
