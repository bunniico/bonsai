import { BRANCHES, NODE_MAP } from '../data/curriculum';
import { isUnlocked, subNodeProgress } from '../state/progress';
import { useProgress } from '../state/ProgressContext';
import { Attachments } from './Attachments';

interface Props {
  nodeId: string;
  onClose: () => void;
  onSelect: (nodeId: string) => void;
}

const KIND_ICON = { lesson: '📖', exercise: '✏️' } as const;

export function NodeModal({ nodeId, onClose, onSelect }: Props) {
  const { progress, toggleComplete, toggleSubNode } = useProgress();
  const node = NODE_MAP.get(nodeId);
  if (!node) return null;

  const branch = BRANCHES.find((b) => b.id === node.branch)!;
  const completed = !!progress.completed[node.id];
  const unlocked = isUnlocked(node, progress);
  const subNodes = node.subNodes ?? [];
  const hasSubNodes = subNodes.length > 0;
  const { done: subDone, total: subTotal } = subNodeProgress(node, progress);

  const subGroups: { group: string; items: typeof subNodes }[] = [];
  for (const sub of subNodes) {
    const last = subGroups[subGroups.length - 1];
    if (last && last.group === sub.group) last.items.push(sub);
    else subGroups.push({ group: sub.group, items: [sub] });
  }

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
            {hasSubNodes && (
              <p className="hint">
                Work through the {subTotal} micro-lessons below — this node completes itself once
                they're all checked off.
              </p>
            )}
          </div>

          {hasSubNodes && (
            <div className="sub-nodes">
              <h3>Micro-Lessons</h3>
              {!unlocked && <p className="hint">🔒 Complete the prerequisites first to unlock these.</p>}
              <div className="sub-progress">
                <div className="sub-progress-bar">
                  <div
                    className="sub-progress-fill"
                    style={{ width: `${subTotal ? (subDone / subTotal) * 100 : 0}%` }}
                  />
                </div>
                <span className="sub-progress-label">{subDone} / {subTotal} done</span>
              </div>

              {subGroups.map(({ group, items }) => (
                <div className="sub-group" key={group}>
                  <h4>{group}</h4>
                  <ul className="sub-list">
                    {items.map((sub) => {
                      const subDoneOne = !!progress.completed[sub.id];
                      return (
                        <li key={sub.id} className={`sub-item ${subDoneOne ? 'sub-item-done' : ''}`}>
                          <label className="toggle-row">
                            <input
                              type="checkbox"
                              checked={subDoneOne}
                              disabled={!unlocked}
                              onChange={() => toggleSubNode(node.id, sub.id)}
                            />
                            <span className="sub-item-body">
                              <span className="sub-item-title">
                                <span className="sub-kind-icon" title={sub.kind}>{KIND_ICON[sub.kind]}</span>
                                {sub.title}
                                <span className="sub-minutes">~{sub.minutes} min</span>
                              </span>
                              <span className="sub-item-summary">{sub.summary}</span>
                              {sub.completeWhen && (
                                <span className="sub-item-goal">Goal: {sub.completeWhen}</span>
                              )}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}

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
          {hasSubNodes ? (
            <span className="hint">
              {completed ? `✓ Complete · all ${subTotal} micro-lessons done` : `${subDone} / ${subTotal} micro-lessons done`}
            </span>
          ) : completed ? (
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
