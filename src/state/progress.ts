import { NODES, NODE_MAP } from '../data/curriculum';
import type { CurriculumNode, Progress } from '../types';

export const STORAGE_KEY = 'bonsai.progress.v1';

export function defaultProgress(): Progress {
  return {
    completed: {},
    images: {},
    achievements: {},
    settings: { showMature: false, driveClientId: '' },
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

export function earnedXp(p: Progress): number {
  return NODES.filter((n) => p.completed[n.id]).reduce((s, n) => s + n.xp, 0);
}

export function availableXp(p: Progress): number {
  return visibleNodes(p).reduce((s, n) => s + n.xp, 0);
}
