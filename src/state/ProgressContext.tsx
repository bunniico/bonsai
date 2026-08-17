import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ACHIEVEMENTS } from '../data/achievements';
import type { AchievementDef } from '../data/achievements';
import { NODE_MAP } from '../data/curriculum';
import type { ImageRef, Progress } from '../types';
import { defaultProgress, loadProgress, saveProgress } from './progress';

interface ProgressApi {
  progress: Progress;
  toasts: AchievementDef[];
  toggleComplete: (nodeId: string) => void;
  toggleSubNode: (parentId: string, subNodeId: string) => void;
  addImage: (nodeId: string, ref: ImageRef) => void;
  removeImage: (nodeId: string, ref: ImageRef) => void;
  updateSettings: (patch: Partial<Progress['settings']>) => void;
  resetProgress: () => void;
  importProgress: (p: Progress) => void;
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [toasts, setToasts] = useState<AchievementDef[]>([]);
  const toastTimers = useRef<number[]>([]);
  const prevAchievementsRef = useRef(progress.achievements);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => () => toastTimers.current.forEach((t) => window.clearTimeout(t)), []);

  // Diffing achievements in an effect (rather than inside the setState updater below) keeps
  // the toast side effect from firing twice under Strict Mode's updater double-invocation.
  useEffect(() => {
    const prevAchievements = prevAchievementsRef.current;
    prevAchievementsRef.current = progress.achievements;
    const newlyEarned = ACHIEVEMENTS.filter(
      (a) => progress.achievements[a.id] && !prevAchievements[a.id],
    );
    if (newlyEarned.length === 0) return;
    setToasts((t) => [...t, ...newlyEarned]);
    toastTimers.current.push(
      window.setTimeout(() => {
        setToasts((t) => t.slice(newlyEarned.length));
      }, 5000),
    );
  }, [progress.achievements]);

  const applyWithAchievements = useCallback((updater: (prev: Progress) => Progress) => {
    setProgress((prev) => {
      const next = updater(prev);
      const newlyEarned = ACHIEVEMENTS.filter(
        (a) => !next.achievements[a.id] && a.earned(next),
      );
      if (newlyEarned.length === 0) return next;
      const at = new Date().toISOString();
      const achievements = { ...next.achievements };
      for (const a of newlyEarned) achievements[a.id] = { at };
      return { ...next, achievements };
    });
  }, []);

  const toggleComplete = useCallback((nodeId: string) => {
    applyWithAchievements((prev) => {
      const completed = { ...prev.completed };
      if (completed[nodeId]) delete completed[nodeId];
      else completed[nodeId] = { at: new Date().toISOString() };
      return { ...prev, completed };
    });
  }, [applyWithAchievements]);

  const toggleSubNode = useCallback((parentId: string, subNodeId: string) => {
    applyWithAchievements((prev) => {
      const completed = { ...prev.completed };
      if (completed[subNodeId]) delete completed[subNodeId];
      else completed[subNodeId] = { at: new Date().toISOString() };

      const parent = NODE_MAP.get(parentId);
      const subNodes = parent?.subNodes;
      if (subNodes && subNodes.length > 0) {
        const allDone = subNodes.every((s) => completed[s.id]);
        if (allDone && !completed[parentId]) completed[parentId] = { at: new Date().toISOString() };
        else if (!allDone && completed[parentId]) delete completed[parentId];
      }
      return { ...prev, completed };
    });
  }, [applyWithAchievements]);

  const addImage = useCallback((nodeId: string, ref: ImageRef) => {
    applyWithAchievements((prev) => ({
      ...prev,
      images: { ...prev.images, [nodeId]: [...(prev.images[nodeId] ?? []), ref] },
    }));
  }, [applyWithAchievements]);

  const removeImage = useCallback((nodeId: string, ref: ImageRef) => {
    setProgress((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [nodeId]: (prev.images[nodeId] ?? []).filter((r) =>
          r.kind === 'drive' && ref.kind === 'drive' ? r.fileId !== ref.fileId
          : r.kind === 'local' && ref.kind === 'local' ? r.id !== ref.id
          : true,
        ),
      },
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Progress['settings']>) => {
    setProgress((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress((prev) => ({ ...defaultProgress(), settings: prev.settings }));
  }, []);

  const importProgress = useCallback((p: Progress) => setProgress(p), []);

  const api = useMemo<ProgressApi>(
    () => ({ progress, toasts, toggleComplete, toggleSubNode, addImage, removeImage, updateSettings, resetProgress, importProgress }),
    [progress, toasts, toggleComplete, toggleSubNode, addImage, removeImage, updateSettings, resetProgress, importProgress],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressApi {
  const api = useContext(Ctx);
  if (!api) throw new Error('useProgress must be used inside ProgressProvider');
  return api;
}
