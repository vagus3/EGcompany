interface EGShieldLogoProps {
  className?: string;
}

export default function EGShieldLogo({ className }: EGShieldLogoProps) {
  return (
    <svg
      viewBox="0 0 200 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer shield */}
      <path
        d="M100 8 L188 46 L188 128 C188 178 150 208 100 222 C50 208 12 178 12 128 L12 46 Z"
        stroke="black"
        strokeWidth="5"
        fill="none"
      />
      {/* Inner frame */}
      <path
        d="M100 24 L172 57 L172 126 C172 168 140 194 100 207 C60 194 28 168 28 126 L28 57 Z"
        stroke="black"
        strokeWidth="2"
        fill="none"
      />
      {/* Horizontal mid bar */}
      <line x1="38" y1="116" x2="162" y2="116" stroke="black" strokeWidth="2" />
      {/* Vertical center bar */}
      <line x1="100" y1="57" x2="100" y2="175" stroke="black" strokeWidth="2" />

      {/* E — left side */}
      <line x1="48" y1="76" x2="90" y2="76" stroke="black" strokeWidth="4.5" strokeLinecap="square" />
      <line x1="48" y1="116" x2="90" y2="116" stroke="black" strokeWidth="4.5" strokeLinecap="square" />
      <line x1="48" y1="155" x2="90" y2="155" stroke="black" strokeWidth="4.5" strokeLinecap="square" />
      <line x1="48" y1="76" x2="48" y2="155" stroke="black" strokeWidth="4.5" strokeLinecap="square" />
      <line x1="48" y1="96" x2="78" y2="96" stroke="black" strokeWidth="3" strokeLinecap="square" />
      <line x1="48" y1="136" x2="78" y2="136" stroke="black" strokeWidth="3" strokeLinecap="square" />

      {/* G — right side */}
      <path
        d="M152 82 C152 82 122 68 112 88 C102 108 108 145 128 152 C148 159 154 144 154 136 L136 136 L136 122 L154 122"
        stroke="black"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
