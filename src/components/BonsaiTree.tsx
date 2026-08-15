/**
 * A stylized bonsai that grows with your level: pot and soil are always
 * there; trunk, branches, and foliage pads appear as you level up (1–10).
 */
export function BonsaiTree({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 220 200" className="bonsai" role="img" aria-label={`Bonsai at level ${level}`}>
      {/* pot */}
      <path d="M60 176 L160 176 L152 196 L68 196 Z" fill="#7a4a32" />
      <rect x="52" y="168" width="116" height="10" rx="4" fill="#8a5a3e" />
      {/* soil */}
      <ellipse cx="110" cy="168" rx="52" ry="5" fill="#4a3626" />

      {/* level 1: a seed */}
      {level === 1 && <ellipse cx="110" cy="163" rx="5" ry="4" fill="#c9a86a" />}

      {/* level 2+: sprout stem */}
      {level >= 2 && (
        <path
          d="M110 168 C 109 156, 112 150, 110 142"
          stroke="#6b8f4e" strokeWidth={level >= 4 ? 0 : 3} fill="none" strokeLinecap="round"
        />
      )}
      {level === 2 && (
        <>
          <ellipse cx="103" cy="144" rx="7" ry="4" fill="#7fae5a" transform="rotate(-25 103 144)" />
          <ellipse cx="117" cy="141" rx="7" ry="4" fill="#7fae5a" transform="rotate(25 117 141)" />
        </>
      )}
      {level === 3 && (
        <>
          <ellipse cx="110" cy="138" rx="12" ry="8" fill="#7fae5a" />
          <ellipse cx="99" cy="148" rx="8" ry="5" fill="#6b9e4c" transform="rotate(-20 99 148)" />
          <ellipse cx="121" cy="148" rx="8" ry="5" fill="#6b9e4c" transform="rotate(20 121 148)" />
        </>
      )}

      {/* level 4+: woody trunk with the classic S-curve */}
      {level >= 4 && (
        <path
          d="M108 170 C 104 150, 120 142, 112 122 C 106 108, 116 100, 112 88"
          stroke="#6e4a30"
          strokeWidth={4 + Math.min(level, 9)}
          fill="none"
          strokeLinecap="round"
        />
      )}
      {/* first foliage pad */}
      {level >= 4 && <ellipse cx="112" cy="84" rx={20 + level * 2} ry={12 + level} fill="#4f7f3a" />}

      {/* level 5+: left branch */}
      {level >= 5 && (
        <>
          <path d="M110 130 C 96 126, 84 128, 72 120" stroke="#6e4a30" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="66" cy="114" rx="22" ry="12" fill="#557f3c" />
        </>
      )}
      {/* level 6+: right branch */}
      {level >= 6 && (
        <>
          <path d="M112 108 C 128 104, 140 106, 152 96" stroke="#6e4a30" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="156" cy="90" rx="24" ry="13" fill="#5d8a41" />
        </>
      )}
      {/* level 7+: lower drooping branch */}
      {level >= 7 && (
        <>
          <path d="M108 150 C 92 150, 78 156, 66 152" stroke="#6e4a30" strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="58" cy="148" rx="18" ry="10" fill="#4f7f3a" />
        </>
      )}
      {/* level 8+: crown grows taller */}
      {level >= 8 && (
        <>
          <path d="M112 90 C 110 78, 116 72, 112 62" stroke="#6e4a30" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="112" cy="56" rx="30" ry="15" fill="#5d8a41" />
        </>
      )}
      {/* level 9+: right upper pad */}
      {level >= 9 && (
        <>
          <path d="M114 70 C 132 66, 144 70, 156 60" stroke="#6e4a30" strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="160" cy="54" rx="20" ry="11" fill="#679449" />
        </>
      )}
      {/* level 10: blossoms on the imperial tree */}
      {level >= 10 && (
        <>
          {[
            [96, 52], [124, 48], [148, 86], [70, 110], [112, 78], [166, 52], [84, 60],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3.4" fill="#e8a7b8" />
          ))}
        </>
      )}
    </svg>
  );
}
