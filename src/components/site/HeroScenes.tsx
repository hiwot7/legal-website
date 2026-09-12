export function PhotoScene({ src, position = "center", active }: { src: string; position?: string; active: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: position,
        transform: active ? "scale(1.08)" : "scale(1)",
        transition: "transform 7s linear",
      }}
    />
  );
}

export function SceneLadyJustice() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(160deg, #171b26 0%, #2a1620 55%, #3d151c 100%)",
      }}
    >
      <svg viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="ljGlow" cx="50%" cy="38%" r="45%">
            <stop offset="0%" stopColor="#E3C46B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E3C46B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="150" r="160" fill="url(#ljGlow)" />
        <g transform="translate(120 40) scale(0.62)" stroke="#F3E7C9" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
          <circle cx="150" cy="58" r="26" />
          <path d="M124 55 Q150 68 176 55" strokeWidth="5" />
          <path d="M132 83 Q118 100 94 113 Q58 132 48 205 Q38 305 54 422 Q64 472 90 487 L210 487 Q236 472 246 422 Q262 305 252 205 Q242 132 206 113 Q182 100 168 83" />
          <path d="M150 112 Q144 260 150 482" opacity="0.5" />
          <path d="M118 135 Q106 290 119 472" opacity="0.32" />
          <path d="M182 135 Q194 290 181 472" opacity="0.32" />
          <path d="M106 107 Q78 118 66 138" />
          <g style={{ transformOrigin: "66px 138px" }}>
            <line x1="26" y1="138" x2="106" y2="138" />
            <line x1="66" y1="114" x2="66" y2="138" />
            <path d="M26 138 L15 174 Q26 188 37 174 Z" />
            <path d="M106 138 L95 174 Q106 188 117 174 Z" />
          </g>
          <path d="M194 107 Q218 128 226 158" />
          <line x1="205" y1="167" x2="247" y2="167" strokeWidth="4" />
          <line x1="226" y1="150" x2="226" y2="167" strokeWidth="6" />
          <line x1="226" y1="167" x2="226" y2="404" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

export function SceneTools() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(160deg, #12161f 0%, #241c07 68%, #3a2c0d 100%)",
      }}
    >
      <svg viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="toolGlow" cx="52%" cy="45%" r="45%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="190" r="170" fill="url(#toolGlow)" />
        <g stroke="#F3E7C9" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
          {/* stacked law books */}
          <rect x="70" y="300" width="150" height="20" rx="2" />
          <rect x="82" y="280" width="140" height="20" rx="2" />
          <rect x="70" y="260" width="120" height="20" rx="2" />

          {/* gavel, resting diagonally with a sound block */}
          <g transform="translate(190 150) rotate(28)">
            <rect x="-16" y="-56" width="32" height="70" rx="10" />
            <line x1="0" y1="14" x2="0" y2="86" strokeWidth="5" />
          </g>
          <ellipse cx="255" cy="248" rx="34" ry="10" />
          <path d="M244 220 Q255 210 266 220" opacity="0.6" />
          <path d="M238 232 Q255 218 272 232" opacity="0.4" />

          {/* small balance scale, upper right */}
          <g transform="translate(300 90)" style={{ transformOrigin: "0px 0px" }}>
            <line x1="0" y1="-30" x2="0" y2="0" />
            <line x1="-40" y1="0" x2="40" y2="0" />
            <path d="M-40 0 L-50 30 Q-40 42 -30 30 Z" />
            <path d="M40 0 L30 30 Q40 42 50 30 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function SceneColumns() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(160deg, #10131c 0%, #1c2636 55%, #2a1620 100%)",
      }}
    >
      <svg viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="colGlow" cx="50%" cy="30%" r="42%">
            <stop offset="0%" stopColor="#7FB2D6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7FB2D6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="120" r="150" fill="url(#colGlow)" />
        <g stroke="#F3E7C9" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
          {/* pediment */}
          <path d="M60 108 L200 48 L340 108 Z" />
          <rect x="58" y="106" width="284" height="14" rx="1" />

          {/* small scale beneath the pediment peak */}
          <g transform="translate(200 78)">
            <line x1="0" y1="0" x2="0" y2="14" />
            <line x1="-22" y1="14" x2="22" y2="14" />
            <path d="M-22 14 L-28 30 Q-22 38 -16 30 Z" />
            <path d="M22 14 L16 30 Q22 38 28 30 Z" />
          </g>

          {/* columns */}
          {[80, 140, 200, 260, 320].map((cx) => (
            <g key={cx}>
              <rect x={cx - 10} y={128} width={20} height={10} rx="1" />
              <rect x={cx - 8} y={138} width={16} height={150} />
              <rect x={cx - 12} y={288} width={24} height={10} rx="1" />
            </g>
          ))}

          {/* steps */}
          <rect x="40" y="298" width="320" height="12" />
          <rect x="24" y="310" width="352" height="12" />
          <rect x="8" y="322" width="384" height="12" />
        </g>
      </svg>
    </div>
  );
}
