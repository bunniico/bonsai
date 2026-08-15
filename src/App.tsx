import { useState } from 'react';
import { AchievementsModal } from './components/AchievementsModal';
import { Header } from './components/Header';
import { NodeModal } from './components/NodeModal';
import { SettingsModal } from './components/SettingsModal';
import { Sidebar } from './components/Sidebar';
import { SkillTree } from './components/SkillTree';
import { useProgress } from './state/ProgressContext';

export function App() {
  const { toasts } = useProgress();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="app">
      <Header
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenSettings={() => setShowSettings(true)}
      />
      <div className="app-main">
        <Sidebar />
        <main className="tree-area">
          <SkillTree selectedId={selectedId} onSelect={setSelectedId} />
        </main>
      </div>

      {selectedId && (
        <NodeModal
          nodeId={selectedId}
          onClose={() => setSelectedId(null)}
          onSelect={setSelectedId}
        />
      )}
      {showAchievements && <AchievementsModal onClose={() => setShowAchievements(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      <div className="toasts" aria-live="polite">
        {toasts.map((a) => (
          <div key={a.id} className="toast">
            <span className="ach-emoji">{a.emoji}</span>
            <div>
              <strong>Achievement — {a.name}</strong>
              <p>{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
