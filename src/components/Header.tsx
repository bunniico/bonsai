import { useState } from 'react';
import { levelForXp, nextLevel } from '../data/levels';
import * as drive from '../services/drive';
import { earnedXp } from '../state/progress';
import { useProgress } from '../state/ProgressContext';

interface Props {
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
}

export function Header({ onOpenAchievements, onOpenSettings }: Props) {
  const { progress } = useProgress();
  const [driveState, setDriveState] = useState(drive.isConnected());
  const [driveError, setDriveError] = useState<string | null>(null);

  const xp = earnedXp(progress);
  const level = levelForXp(xp);
  const next = nextLevel(xp);
  const pct = next
    ? Math.round(((xp - level.minXp) / (next.minXp - level.minXp)) * 100)
    : 100;

  async function handleDrive() {
    setDriveError(null);
    if (driveState) {
      drive.disconnect();
      setDriveState(false);
      return;
    }
    try {
      await drive.connect(progress.settings.driveClientId);
      setDriveState(true);
    } catch (e) {
      setDriveError(e instanceof Error ? e.message : 'Could not connect.');
    }
  }

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">盆栽</span>
        <div>
          <h1>Bonsai</h1>
          <span className="tagline">The Artist's Tech Tree</span>
        </div>
      </div>

      <div className="xp-block" title={next ? `${xp} / ${next.minXp} XP` : `${xp} XP — max level`}>
        <div className="xp-labels">
          <span>Lv {level.level} · {level.name}</span>
          <span>{xp} XP{next ? ` · ${next.minXp - xp} to ${next.name}` : ''}</span>
        </div>
        <div className="xp-bar"><div className="xp-fill" style={{ width: `${pct}%` }} /></div>
      </div>

      <nav className="header-actions">
        <button className="btn btn-ghost" onClick={handleDrive}>
          {driveState ? '☁ Drive connected' : '☁ Connect Drive'}
        </button>
        <button className="btn btn-ghost" onClick={onOpenAchievements}>🏅 Achievements</button>
        <button className="btn btn-ghost" onClick={onOpenSettings}>⚙ Settings</button>
      </nav>
      {driveError && <p className="error header-error">{driveError}</p>}
    </header>
  );
}
