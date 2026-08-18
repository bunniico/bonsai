import { NODE_MAP, NODES } from './curriculum';
import { earnedXp } from '../state/progress';
import type { BranchId, Progress } from '../types';

export interface AchievementDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** Achievements for hidden branches shouldn't spoil themselves. */
  mature?: boolean;
  earned: (p: Progress) => boolean;
}

const branchDone = (p: Progress, branch: BranchId) =>
  NODES.filter((n) => n.branch === branch && (!n.mature || p.settings.showMature))
       .every((n) => p.completed[n.id]);

/** Counts only top-level nodes — sub-node completions share the same map but shouldn't inflate this. */
const completedCount = (p: Progress) =>
  Object.keys(p.completed).filter((id) => NODE_MAP.has(id)).length;

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-cutting', name: 'First Cutting', emoji: '🌱',
    description: 'Complete your first node.',
    earned: (p) => completedCount(p) >= 1,
  },
  {
    id: 'taking-root', name: 'Taking Root', emoji: '🪴',
    description: 'Complete five nodes.',
    earned: (p) => completedCount(p) >= 5,
  },
  {
    id: 'strong-roots', name: 'Strong Roots', emoji: '🌰',
    description: 'Complete every Core Fundamentals node.',
    earned: (p) => branchDone(p, 'A'),
  },
  {
    id: 'digital-graft', name: 'Digital Graft', emoji: '🖥️',
    description: 'Complete every Digital Craft node.',
    earned: (p) => branchDone(p, 'B'),
  },
  {
    id: 'living-form', name: 'Living Form', emoji: '🫀',
    description: 'Complete every Figure & Anatomy node.',
    earned: (p) => branchDone(p, 'C'),
  },
  {
    id: 'character-cultivator', name: 'Character Cultivator', emoji: '🎭',
    description: 'Complete every Character Design node.',
    earned: (p) => branchDone(p, 'D'),
  },
  {
    id: 'wild-grafts', name: 'Wild Grafts', emoji: '🐉',
    description: 'Complete every Creatures & Non-Humans node.',
    earned: (p) => branchDone(p, 'E'),
  },
  {
    id: 'landscape-keeper', name: 'Landscape Keeper', emoji: '🏞️',
    description: 'Complete every Environments node.',
    earned: (p) => branchDone(p, 'F'),
  },
  {
    id: 'reaching-canopy', name: 'Reaching the Canopy', emoji: '🌳',
    description: 'Complete any capstone (Branch G) node.',
    earned: (p) => NODES.some((n) => n.branch === 'G' && p.completed[n.id]),
  },
  {
    id: 'light-through-leaves', name: 'Light Through the Leaves', emoji: '🪞',
    description: 'Complete every Mastery: Light & Lens node.',
    earned: (p) => branchDone(p, 'H'),
  },
  {
    id: 'deep-roots', name: 'Deep Roots', emoji: '⛰️',
    description: 'Earn 1,000 XP.',
    earned: (p) => earnedXp(p) >= 1000,
  },
  {
    id: 'thick-trunk', name: 'Thick Trunk', emoji: '🪵',
    description: 'Earn 2,500 XP.',
    earned: (p) => earnedXp(p) >= 2500,
  },
  {
    id: 'curator', name: 'Curator', emoji: '🖼️',
    description: 'Attach your first piece of art to a node.',
    earned: (p) => Object.values(p.images).some((imgs) => imgs.length > 0),
  },
  {
    id: 'gallery-keeper', name: 'Gallery Keeper', emoji: '🏛️',
    description: 'Attach art to ten different nodes.',
    earned: (p) => Object.values(p.images).filter((imgs) => imgs.length > 0).length >= 10,
  },
  {
    id: 'perfect-bonsai', name: 'The Perfect Bonsai', emoji: '🏆',
    description: 'Complete every node in the tree.',
    earned: (p) =>
      NODES.filter((n) => !n.mature || p.settings.showMature).every((n) => p.completed[n.id]),
  },
];
