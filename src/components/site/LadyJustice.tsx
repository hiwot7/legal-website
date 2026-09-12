export default function LadyJustice() {
  return (
    <svg
      className="lady-justice"
      viewBox="0 0 300 500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g className="lj-figure">
        {/* head */}
        <circle cx="150" cy="58" r="26" />
        {/* blindfold */}
        <path d="M124 55 Q150 68 176 55" strokeWidth="5" />

        {/* robe silhouette */}
        <path d="M132 83 Q118 100 94 113 Q58 132 48 205 Q38 305 54 422 Q64 472 90 487 L210 487 Q236 472 246 422 Q262 305 252 205 Q242 132 206 113 Q182 100 168 83" />

        {/* drapery folds */}
        <path d="M150 112 Q144 260 150 482" opacity="0.5" />
        <path d="M118 135 Q106 290 119 472" opacity="0.32" />
        <path d="M182 135 Q194 290 181 472" opacity="0.32" />
        <path d="M90 200 Q78 300 92 440" opacity="0.2" />
        <path d="M210 200 Q222 300 208 440" opacity="0.2" />

        {/* left arm raised to the scale */}
        <path d="M106 107 Q78 118 66 138" />
        <g className="lj-scale" style={{ transformOrigin: "66px 138px" }}>
          <line x1="26" y1="138" x2="106" y2="138" />
          <line x1="66" y1="114" x2="66" y2="138" />
          <path d="M26 138 L15 174 Q26 188 37 174 Z" />
          <path d="M106 138 L95 174 Q106 188 117 174 Z" />
        </g>

        {/* right arm lowered, holding the sword */}
        <path d="M194 107 Q218 128 226 158" />
        <g>
          <line x1="205" y1="167" x2="247" y2="167" strokeWidth="4" />
          <line x1="226" y1="150" x2="226" y2="167" strokeWidth="6" />
          <line x1="226" y1="167" x2="226" y2="404" strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}
