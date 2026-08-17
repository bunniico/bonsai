import { useEffect, useMemo, useRef } from 'react';
import { BRANCHES, NODE_MAP } from '../data/curriculum';
import { isUnlocked, subNodeProgress, visibleNodes } from '../state/progress';
import { useProgress } from '../state/ProgressContext';
import type { CurriculumNode } from '../types';

const CELL_X = 130;
const CELL_Y = 125;
const MARGIN_X = 70;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 90;
const R = 27;

interface Props {
  onSelect: (nodeId: string) => void;
  selectedId: string | null;
}

export function SkillTree({ onSelect, selectedId }: Props) {
  const { progress } = useProgress();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Start at the roots — the tree is climbed from the soil up.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const nodes = useMemo(() => visibleNodes(progress), [progress]);
  const maxY = useMemo(() => Math.max(...nodes.map((n) => n.pos.y)), [nodes]);
  const maxX = useMemo(() => Math.max(...nodes.map((n) => n.pos.x)), [nodes]);

  const width = maxX * CELL_X + MARGIN_X * 2;
  const height = maxY * CELL_Y + MARGIN_TOP + MARGIN_BOTTOM;

  // The tree grows upward: roots (depth 0) at the bottom, canopy at the top.
  const px = (n: CurriculumNode) => MARGIN_X + n.pos.x * CELL_X;
  const py = (n: CurriculumNode) => MARGIN_TOP + (maxY - n.pos.y) * CELL_Y;

  const visibleIds = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes]);

  const branchColor = (n: CurriculumNode) =>
    BRANCHES.find((b) => b.id === n.branch)?.color ?? '#999';

  return (
    <div className="tree-scroll" ref={scrollRef}>
      <svg
        className="tree-svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Skill tree"
      >
        {/* soil line under the roots */}
        <line
          x1={MARGIN_X - 40} y1={height - 38}
          x2={width - MARGIN_X + 40} y2={height - 38}
          className="soil-line"
        />
        {/* edges */}
        {nodes.flatMap((node) =>
          node.prereqs.flatMap((group) =>
            group.ids
              .filter((id) => visibleIds.has(id))
              .map((id) => {
                const from = NODE_MAP.get(id)!;
                const x1 = px(from);
                const y1 = py(from) - R;
                const x2 = px(node);
                const y2 = py(node) + R;
                const bend = Math.min(60, Math.abs(y1 - y2) / 2 + 10);
                const active = !!progress.completed[id];
                const optional = group.required < group.ids.length;
                return (
                  <path
                    key={`${id}->${node.id}`}
                    d={`M ${x1} ${y1} C ${x1} ${y1 - bend}, ${x2} ${y2 + bend}, ${x2} ${y2}`}
                    className={`edge ${active ? 'edge-active' : ''}`}
                    stroke={active ? branchColor(node) : undefined}
                    strokeDasharray={optional ? '6 5' : undefined}
                  />
                );
              }),
          ),
        )}
        {/* nodes */}
        {nodes.map((node) => {
          const completed = !!progress.completed[node.id];
          const unlocked = isUnlocked(node, progress);
          const color = branchColor(node);
          const state = completed ? 'completed' : unlocked ? 'unlocked' : 'locked';
          const hasArt = (progress.images[node.id]?.length ?? 0) > 0;
          const { done: subDone, total: subTotal } = subNodeProgress(node, progress);
          const hasSubNodes = subTotal > 0;
          return (
            <g
              key={node.id}
              className={`node node-${state} ${selectedId === node.id ? 'node-selected' : ''}`}
              transform={`translate(${px(node)}, ${py(node)})`}
              onClick={() => onSelect(node.id)}
              tabIndex={0}
              role="button"
              aria-label={`${node.id}: ${node.title} (${state})`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(node.id);
                }
              }}
            >
              <circle r={R} className="node-ring" stroke={color} fill={completed ? color : undefined} />
              <text className="node-icon" dy="0.35em">{node.icon}</text>
              <g className="node-id-badge">
                <circle className="node-id-badge-ring" cx={-(R - 7)} cy={-(R - 7)} r={11} />
                <text className="node-id" x={-(R - 7)} y={-(R - 7)} dy="0.32em">{node.id}</text>
              </g>
              {hasArt && <text className="node-art" x={R - 6} y={-R + 8}>🖼</text>}
              {hasSubNodes && (
                <g className="node-sub-badge">
                  <circle cx={R - 7} cy={R - 7} r={11} className="node-sub-badge-ring" />
                  <text x={R - 7} y={R - 7} dy="0.32em" className="node-sub-count">📖</text>
                </g>
              )}
              <text className="node-title" y={R + 16}>
                {node.title.length > 20 ? `${node.title.slice(0, 18)}…` : node.title}
              </text>
              {!completed && (
                <text className="node-xp" y={R + 31}>
                  {hasSubNodes ? `${subDone}/${subTotal} · ${node.xp} XP` : `${node.xp} XP`}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
