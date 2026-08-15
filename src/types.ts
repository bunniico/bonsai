export type BranchId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/**
 * A prerequisite group: `required` of the listed nodes must be complete.
 * Plain prerequisites are groups with required === ids.length.
 */
export interface PrereqGroup {
  ids: string[];
  required: number;
}

export interface CurriculumNode {
  id: string;
  branch: BranchId;
  /** Emoji representing the node's subject, shown as the main glyph on the tree. */
  icon: string;
  title: string;
  tier: number;
  prereqs: PrereqGroup[];
  description: string;
  completeWhen: string;
  xp: number;
  resources: string[];
  /** Adult-education content (anatomy, figure interaction, gore) — hidden unless enabled in settings. */
  mature?: boolean;
  /** Layout position on the tree canvas, in grid units (x rightward, y = depth from the roots). */
  pos: { x: number; y: number };
}

export interface BranchInfo {
  id: BranchId;
  name: string;
  color: string;
}

export type ImageRef =
  | { kind: 'drive'; fileId: string; name: string }
  | { kind: 'local'; id: string; name: string };

export interface Progress {
  completed: Record<string, { at: string }>;
  images: Record<string, ImageRef[]>;
  achievements: Record<string, { at: string }>;
  settings: {
    showMature: boolean;
    driveClientId: string;
  };
}

export interface LevelInfo {
  level: number;
  name: string;
  minXp: number;
}
