export type BranchId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

/**
 * A prerequisite group: `required` of the listed nodes must be complete.
 * Plain prerequisites are groups with required === ids.length.
 */
export interface PrereqGroup {
  ids: string[];
  required: number;
}

/** Lessons build knowledge; exercises are hands-on practice. */
export type SubNodeKind = 'lesson' | 'exercise';

/**
 * A bite-size (~5 minute) step inside a node's sub-tree. IDs must be unique
 * across the whole curriculum since they share the `completed` map with
 * top-level nodes.
 */
export interface SubNode {
  id: string;
  kind: SubNodeKind;
  /** Section heading this sub-node is displayed under, e.g. "Lines: Markmaking". */
  group: string;
  title: string;
  /** Approximate time to read/complete, in minutes. */
  minutes: number;
  /** The knowledge (lesson) or instructions (exercise) themselves. */
  summary: string;
  /** For exercises: what "done" looks like. */
  completeWhen?: string;
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
  /** Soft suggestions: nodes that improve this one but never gate its unlock. */
  recommended?: string[];
  /** Layout position on the tree canvas, in grid units (x rightward, y = depth from the roots). */
  pos: { x: number; y: number };
  /** Optional bite-size breakdown of this node into lessons and exercises. */
  subNodes?: SubNode[];
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
