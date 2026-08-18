import { useRef, useState } from 'react';
import { STORAGE_KEY } from '../state/progress';
import { useProgress } from '../state/ProgressContext';
import type { Progress } from '../types';

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { progress, updateSettings, resetProgress, importProgress } = useProgress();
  const [clientId, setClientId] = useState(progress.settings.driveClientId);
  const [confirmReset, setConfirmReset] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);

  function exportJson() {
    const blob = new Blob([localStorage.getItem(STORAGE_KEY) ?? '{}'], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bonsai-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importJson(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Progress;
      importProgress(parsed);
      onClose();
    } catch {
      alert('That file is not a valid Bonsai progress export.');
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-narrow" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal-head">
          <h2>⚙ Settings</h2>
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="modal-body">
          <section>
            <h3>Google Drive</h3>
            <p className="hint">
              Paste an OAuth 2.0 Client ID from Google Cloud Console (see the
              README for a 5-minute setup). Uploads use the <code>drive.file</code> scope,
              so the app can only ever see files it created.
            </p>
            <input
              className="text-input"
              type="text"
              placeholder="xxxxxxx.apps.googleusercontent.com"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              onBlur={() => updateSettings({ driveClientId: clientId.trim() })}
            />
          </section>

          <section>
            <h3>Curriculum content</h3>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={progress.settings.showMature}
                onChange={(e) => updateSettings({ showMature: e.target.checked })}
              />
              Show the adult-education track (complete anatomy, figure
              interaction, gore studies, mature capstone) — for artists 18+.
            </label>
          </section>

          <section>
            <h3>Sounds</h3>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={progress.settings.muteSounds}
                onChange={(e) => updateSettings({ muteSounds: e.target.checked })}
              />
              Mute completion sounds (micro-lessons, nodes, level-ups).
            </label>
          </section>

          <section>
            <h3>Your data</h3>
            <p className="hint">
              Progress lives in this browser (localStorage + IndexedDB).
              Export it before switching devices.
            </p>
            <div className="chip-row">
              <button className="btn btn-ghost" onClick={exportJson}>Export progress</button>
              <button className="btn btn-ghost" onClick={() => importInput.current?.click()}>
                Import progress
              </button>
              <input
                ref={importInput}
                type="file"
                accept="application/json"
                hidden
                onChange={(e) => importJson(e.target.files)}
              />
              {confirmReset ? (
                <button
                  className="btn btn-danger"
                  onClick={() => { resetProgress(); setConfirmReset(false); }}
                >
                  Really reset everything?
                </button>
              ) : (
                <button className="btn btn-ghost" onClick={() => setConfirmReset(true)}>
                  Reset progress
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
