import { ACHIEVEMENTS } from '../data/achievements';
import { useProgress } from '../state/ProgressContext';

export function AchievementsModal({ onClose }: { onClose: () => void }) {
  const { progress } = useProgress();

  const shown = ACHIEVEMENTS.filter((a) => !a.mature || progress.settings.showMature);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-narrow" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal-head">
          <h2>🏅 Achievements</h2>
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="modal-body">
          <ul className="achievement-list">
            {shown.map((a) => {
              const earned = progress.achievements[a.id];
              return (
                <li key={a.id} className={earned ? 'ach earned' : 'ach'}>
                  <span className="ach-emoji">{earned ? a.emoji : '🔒'}</span>
                  <div>
                    <strong>{a.name}</strong>
                    <p>{a.description}</p>
                    {earned && (
                      <span className="ach-date">
                        Earned {new Date(earned.at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
