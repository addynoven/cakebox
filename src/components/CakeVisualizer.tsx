import React from 'react';
import { CustomCakeConfig } from '../types';

interface CakeVisualizerProps {
  config: Partial<CustomCakeConfig>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CakeVisualizer: React.FC<CakeVisualizerProps> = ({
  config,
  className = '',
  size = 'md'
}) => {
  const baseColor = config.base?.spongeColor || '#FDF2D0';
  const frostingColor = config.frosting?.color || '#FFFBF5';
  const dripColor = config.drip?.color || '#F472B6';
  const hasDrip = config.drip?.id !== 'none' && config.drip?.color;
  const showSprinkles = config.toppings?.sprinkles ?? true;
  const showFruits = config.toppings?.fruits ?? true;
  const showTopper = config.toppings?.topper ?? true;
  const topperText = config.toppings?.topperText || 'Happy Birthday';

  const dims = {
    sm: 'w-48 h-48',
    md: 'w-64 h-64',
    lg: 'w-72 h-72'
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${dims} ${className}`}>
      {/* Whimsical Background Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-2 left-4 text-pink-400 text-lg animate-pulse">✨</span>
        <span className="absolute top-8 right-6 text-amber-400 text-sm animate-bounce" style={{ animationDuration: '2s' }}>★</span>
        <span className="absolute bottom-6 left-6 text-pink-300 text-sm">🌸</span>
        <span className="absolute top-1/2 right-2 text-rose-400 text-xs">✨</span>
      </div>

      <svg viewBox="0 0 320 300" className="w-full h-full drop-shadow-md">
        <defs>
          <radialGradient id="plateShade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F1ECE7" />
            <stop offset="100%" stopColor="#DBCFC7" />
          </radialGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.12" floodColor="#3B2C30" />
          </filter>
          <linearGradient id="frostingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* 1. Cake Stand / Plate */}
        <g filter="url(#softShadow)">
          <ellipse cx="160" cy="246" rx="120" ry="24" fill="url(#plateShade)" stroke="#3B2C30" strokeWidth="2.5" />
          <ellipse cx="160" cy="242" rx="112" ry="18" fill="#FFFFFF" opacity="0.9" />
          <ellipse cx="160" cy="242" rx="100" ry="14" fill="none" stroke="#E2D9D2" strokeWidth="1" />
        </g>

        {/* 2. Cake Body (Cylinder with base layer strip) */}
        <g>
          {/* Main Cake Silhouette */}
          <path
            d="M60,135 L60,225 C60,245 260,245 260,225 L260,135 Z"
            fill={frostingColor}
            stroke="#3B2C30"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Frosting soft texture shadow */}
          <path
            d="M60,135 L60,225 C60,245 260,245 260,225 L260,135 Z"
            fill="url(#frostingGradient)"
          />

          {/* Exposed Middle Sponge Strip (Showing custom sponge flavor!) */}
          <path
            d="M61,175 C100,185 220,185 259,175 L259,190 C220,200 100,200 61,190 Z"
            fill={baseColor}
            stroke="#3B2C30"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.95"
          />
          
          {/* Cream filling line between sponge */}
          <path
            d="M61,183 C100,192 220,192 259,183"
            stroke="#FFFDF9"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Bottom Cake Rim */}
          <path
            d="M60,225 C60,245 260,245 260,225"
            stroke="#3B2C30"
            strokeWidth="3"
            fill="none"
          />
        </g>

        {/* 3. Bottom Sprinkles border if active */}
        {showSprinkles && (
          <g opacity="0.9">
            {/* Colorful sprinkle dots at cake base */}
            {[
              { cx: 70, cy: 226, c: '#F43F5E' },
              { cx: 80, cy: 232, c: '#3B82F6' },
              { cx: 92, cy: 230, c: '#F59E0B' },
              { cx: 104, cy: 235, c: '#10B981' },
              { cx: 118, cy: 234, c: '#EC4899' },
              { cx: 132, cy: 237, c: '#8B5CF6' },
              { cx: 148, cy: 238, c: '#F43F5E' },
              { cx: 162, cy: 239, c: '#F59E0B' },
              { cx: 178, cy: 238, c: '#10B981' },
              { cx: 192, cy: 236, c: '#3B82F6' },
              { cx: 208, cy: 235, c: '#EC4899' },
              { cx: 222, cy: 232, c: '#F59E0B' },
              { cx: 236, cy: 230, c: '#8B5CF6' },
              { cx: 248, cy: 226, c: '#F43F5E' },
              { cx: 86, cy: 224, c: '#10B981' },
              { cx: 110, cy: 228, c: '#F59E0B' },
              { cx: 140, cy: 230, c: '#EC4899' },
              { cx: 170, cy: 231, c: '#3B82F6' },
              { cx: 200, cy: 229, c: '#F43F5E' },
              { cx: 230, cy: 224, c: '#8B5CF6' }
            ].map((s, i) => (
              <circle key={i} cx={s.cx} cy={s.cy} r="2.5" fill={s.c} stroke="#3B2C30" strokeWidth="0.8" />
            ))}
          </g>
        )}

        {/* 4. Cake Top Surface */}
        <ellipse
          cx="160"
          cy="135"
          rx="100"
          ry="22"
          fill={frostingColor}
          stroke="#3B2C30"
          strokeWidth="3"
        />

        {/* 5. Dripping Glaze (Matching Image 8 kawaii drip) */}
        {hasDrip && (
          <g>
            {/* Dripping Glaze Top Cover */}
            <ellipse cx="160" cy="135" rx="98" ry="20" fill={dripColor} />
            
            {/* The drips hanging down */}
            <path
              d="M60,135 
                 C65,142 66,168 72,168 
                 C78,168 80,140 88,140 
                 C94,140 96,182 104,182 
                 C112,182 116,142 126,142 
                 C134,142 136,192 146,192 
                 C156,192 160,144 170,144 
                 C178,144 182,176 190,176 
                 C198,176 202,142 212,142 
                 C220,142 224,186 232,186 
                 C240,186 244,142 252,142 
                 C256,142 258,155 260,135 
                 C260,152 60,152 60,135 Z"
              fill={dripColor}
              stroke="#3B2C30"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Gloss shine lines inside drips */}
            <path d="M72,146 Q73,164 72,164" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            <path d="M104,148 Q105,178 104,178" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
            <path d="M146,150 Q147,186 146,186" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
            <path d="M190,148 Q191,172 190,172" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
            <path d="M232,148 Q233,180 232,180" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          </g>
        )}

        {/* 6. Top Sprinkles if active */}
        {showSprinkles && (
          <g opacity="0.85">
            {[
              { cx: 100, cy: 130, c: '#3B82F6', r: 2 },
              { cx: 120, cy: 138, c: '#F43F5E', r: 2.2 },
              { cx: 140, cy: 128, c: '#F59E0B', r: 2 },
              { cx: 160, cy: 140, c: '#10B981', r: 2.4 },
              { cx: 180, cy: 132, c: '#8B5CF6', r: 2 },
              { cx: 200, cy: 142, c: '#EC4899', r: 2.2 },
              { cx: 220, cy: 130, c: '#F59E0B', r: 2 }
            ].map((s, i) => (
              <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.c} stroke="#3B2C30" strokeWidth="0.6" />
            ))}
          </g>
        )}

        {/* 7. Fresh Fruits (Strawberries & Blueberries) */}
        {showFruits && (
          <g>
            {/* Base plate fruits */}
            <g transform="translate(195, 218) scale(0.9)">
              {/* Strawberry */}
              <path d="M15,5 C24,5 26,18 16,28 C6,18 8,5 15,5 Z" fill="#EF4444" stroke="#3B2C30" strokeWidth="2" />
              <path d="M12,5 L15,1 L18,5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="#10B981" />
              <circle cx="13" cy="14" r="0.7" fill="#FDE047" />
              <circle cx="18" cy="18" r="0.7" fill="#FDE047" />
            </g>
            <g transform="translate(216, 222) scale(0.75)">
              <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#3B2C30" strokeWidth="2" />
              <circle cx="10" cy="10" r="2.5" fill="#60A5FA" opacity="0.6" />
            </g>

            {/* Top Strawberries */}
            <g transform="translate(105, 95) scale(1.15)">
              <path d="M16,6 C26,6 29,20 18,30 C7,20 9,6 16,6 Z" fill="#F43F5E" stroke="#3B2C30" strokeWidth="2.2" />
              {/* Leaves */}
              <path d="M12,6 Q16,1 18,6 Q20,2 22,6" fill="#10B981" stroke="#3B2C30" strokeWidth="1.5" />
              {/* Seeds */}
              <circle cx="14" cy="14" r="0.8" fill="#FEF08A" />
              <circle cx="19" cy="18" r="0.8" fill="#FEF08A" />
              <circle cx="15" cy="22" r="0.8" fill="#FEF08A" />
            </g>
            <g transform="translate(135, 100) scale(1.2)">
              <path d="M16,6 C26,6 29,20 18,30 C7,20 9,6 16,6 Z" fill="#E11D48" stroke="#3B2C30" strokeWidth="2.2" />
              <path d="M12,6 Q16,1 18,6 Q20,2 22,6" fill="#10B981" stroke="#3B2C30" strokeWidth="1.5" />
              <circle cx="15" cy="16" r="0.8" fill="#FEF08A" />
              <circle cx="20" cy="20" r="0.8" fill="#FEF08A" />
            </g>
            <g transform="translate(180, 102) scale(1.1)">
              <path d="M16,6 C26,6 29,20 18,30 C7,20 9,6 16,6 Z" fill="#F43F5E" stroke="#3B2C30" strokeWidth="2.2" />
              <path d="M12,6 Q16,1 18,6 Q20,2 22,6" fill="#10B981" stroke="#3B2C30" strokeWidth="1.5" />
              <circle cx="15" cy="16" r="0.8" fill="#FEF08A" />
            </g>

            {/* Blueberries on top */}
            <circle cx="130" cy="128" r="6.5" fill="#3B82F6" stroke="#3B2C30" strokeWidth="1.8" />
            <circle cx="170" cy="126" r="6" fill="#2563EB" stroke="#3B2C30" strokeWidth="1.8" />
            <circle cx="196" cy="130" r="5.5" fill="#1D4ED8" stroke="#3B2C30" strokeWidth="1.8" />
          </g>
        )}

        {/* 8. Acrylic Topper Sign */}
        {showTopper && (
          <g>
            {/* Sticks */}
            <line x1="160" y1="65" x2="160" y2="128" stroke="#3B2C30" strokeWidth="2.5" strokeLinecap="round" />
            {/* Sign Plaque or Script Calligraphy */}
            <g transform="translate(160, 52)">
              <rect x="-65" y="-22" width="130" height="34" rx="17" fill="#FFF8F8" stroke="#3B2C30" strokeWidth="2.5" />
              <rect x="-60" y="-18" width="120" height="26" rx="13" fill="#FED8BF" opacity="0.6" />
              <text
                x="0"
                y="0"
                dominantBaseline="central"
                textAnchor="middle"
                fill="#3B2C30"
                fontSize="12"
                fontWeight="bold"
                fontFamily="'Quicksand', cursive, sans-serif"
              >
                {topperText.length > 18 ? topperText.substring(0, 18) + '...' : topperText}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
