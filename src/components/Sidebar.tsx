import { ACHIEVEMENTS } from '../data/achievements';
import { BRANCHES, NODES } from '../data/curriculum';
import { levelForXp } from '../data/levels';
import { earnedXp, availableXp, visibleNodes } from '../state/progress';
import { useProgress } from '../state/ProgressContext';
import { BonsaiTree } from './BonsaiTree';

export function Sidebar() {
  const { progress } = useProgress();
  const xp = earnedXp(progress);
  const level = levelForXp(xp);
  const visible = visibleNodes(progress);
  const done = visible.filter((n) => progress.completed[n.id]).length;
  const earnedAchievements = ACHIEVEMENTS.filter((a) => progress.achievements[a.id]);

  return (
    <aside className="sidebar">
      <BonsaiTree level={level.level} />
      <p className="level-caption">Lv {level.level} — {level.name}</p>

      <dl className="stats">
        <div><dt>Nodes</dt><dd>{done} / {visible.length}</dd></div>
        <div><dt>XP</dt><dd>{xp} / {availableXp(progress)}</dd></div>
        <div><dt>Badges</dt><dd>{earnedAchievements.length} / {ACHIEVEMENTS.length}</dd></div>
      </dl>

      <div className="legend">
        <h3>Branches</h3>
        {BRANCHES.map((b) => {
          const branchNodes = visible.filter((n) => n.branch === b.id);
          if (branchNodes.length === 0) return null;
          const branchDone = branchNodes.filter((n) => progress.completed[n.id]).length;
          return (
            <div key={b.id} className="legend-row">
              <span className="legend-dot" style={{ background: b.color }} />
              <span className="legend-name">{b.name}</span>
              <span className="legend-count">{branchDone}/{branchNodes.length}</span>
            </div>
          );
        })}
      </div>

      <p className="fifty-rule">
        🌗 <strong>The 50% rule:</strong> at least half of your drawing time is
        for play and exploration, not study. XP measures the studying half;
        the playing half is where it takes root.
      </p>
      <p className="hint">
        {NODES.length - visible.length > 0
          ? `${NODES.length - visible.length} nodes hidden by content settings.`
          : ''}
      </p>
    </aside>
  );
}
