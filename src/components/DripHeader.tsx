import React from 'react';

interface DripHeaderProps {
  color?: string; // Fill color of the drips
  bgColor?: string; // Optional background behind the drips
  height?: number;
  showDoodles?: boolean;
  className?: string;
}

export const DripHeader: React.FC<DripHeaderProps> = ({
  color = '#FFFFFF',
  bgColor = 'transparent',
  height = 55,
  showDoodles = false,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-hidden relative pointer-events-none ${className}`} style={{ height: `${height}px`, background: bgColor }}>
      {showDoodles && (
        <div className="absolute inset-0 opacity-20 flex justify-around items-center text-xs">
          <span>🧁</span>
          <span>🍓</span>
          <span>✨</span>
          <span>🍰</span>
          <span>🎀</span>
        </div>
      )}
      <svg
        viewBox="0 0 500 80"
        preserveAspectRatio="none"
        className="w-full h-full drop-shadow-sm"
        style={{ filter: 'drop-shadow(0px 3px 3px rgba(176, 25, 92, 0.08))' }}
      >
        <defs>
          <linearGradient id="dripCreamGloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Organic wavy dripping icing path */}
        <path
          d="M0,0 L500,0 L500,18 C470,18 455,42 440,42 C425,42 418,12 400,12 C385,12 375,54 360,54 C345,54 340,16 325,16 C310,16 302,62 285,62 C270,62 265,14 250,14 C235,14 225,72 205,72 C188,72 180,18 165,18 C150,18 142,48 128,48 C115,48 108,10 92,10 C78,10 70,58 52,58 C38,58 32,15 15,15 C8,15 0,20 0,20 Z"
          fill={color}
        />
        {/* Subtle highlight sheen inside drips */}
        <path
          d="M55,20 Q56,48 52,48 Q49,48 50,20"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M208,24 Q209,60 205,60 Q202,60 203,24"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M288,20 Q289,52 285,52 Q282,52 283,20"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M363,20 Q364,44 360,44 Q357,44 358,20"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M443,20 Q444,36 440,36 Q437,36 438,20"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};
