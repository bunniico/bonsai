import { BRANCHES, NODE_MAP } from '../data/curriculum';
import { isUnlocked } from '../state/progress';
import { useProgress } from '../state/ProgressContext';
import { Attachments } from './Attachments';

interface Props {
  nodeId: string;
  onClose: () => void;
  onSelect: (nodeId: string) => void;
}

export function NodeModal({ nodeId, onClose, onSelect }: Props) {
  const { progress, toggleComplete } = useProgress();
  const node = NODE_MAP.get(nodeId);
  if (!node) return null;

  const branch = BRANCHES.find((b) => b.id === node.branch)!;
  const completed = !!progress.completed[node.id];
  const unlocked = isUnlocked(node, progress);

  const prereqChips = node.prereqs.flatMap((group) =>
    group.ids
      .filter((id) => progress.settings.showMature || !NODE_MAP.get(id)?.mature)
      .map((id) => ({
        id,
        title: NODE_MAP.get(id)?.title ?? id,
        done: !!progress.completed[id],
        optional: group.required < group.ids.length,
        required: group.required,
        groupSize: group.ids.length,
      })),
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal-head" style={{ borderColor: branch.color }}>
          <div>
            <span className="modal-branch" style={{ color: branch.color }}>
              {branch.name} · Tier {node.tier}
            </span>
            <h2>{node.icon} {node.title} <span className="modal-node-id">{node.id}</span></h2>
          </div>
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="modal-body">
          <p>{node.description}</p>

          <div className="criteria">
            <h3>Complete when</h3>
            <p>{node.completeWhen}</p>
          </div>

          {prereqChips.length > 0 && (
            <div className="prereqs">
              <h3>Prerequisites</h3>
              <div className="chip-row">
                {prereqChips.map((c) => (
                  <button
                    key={c.id}
                    className={`chip ${c.done ? 'chip-done' : ''}`}
                    onClick={() => onSelect(c.id)}
                    title={c.optional ? `Any ${c.required} of ${c.groupSize} in this group` : undefined}
                  >
                    {c.done ? '✓ ' : ''}{c.id}{c.optional ? ' *' : ''}
                  </button>
                ))}
              </div>
              {prereqChips.some((c) => c.optional) && (
                <p className="hint">* part of an “any-of” group — not all are required.</p>
              )}
            </div>
          )}

          <div className="resources">
            <h3>Resources</h3>
            <ul>
              {node.resources.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>

          <Attachments nodeId={node.id} />
        </div>

        <footer className="modal-foot">
          <span className="xp-tag">{node.xp} XP</span>
          {completed ? (
            <button className="btn btn-ghost" onClick={() => toggleComplete(node.id)}>
              Mark incomplete
            </button>
          ) : (
            <button
              className="btn btn-primary"
              disabled={!unlocked}
              onClick={() => toggleComplete(node.id)}
              title={unlocked ? undefined : 'Complete the prerequisites first'}
            >
              {unlocked ? `Complete · +${node.xp} XP` : '🔒 Locked'}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
