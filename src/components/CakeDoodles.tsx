import React from 'react';

export const CakeDoodles: React.FC<{ className?: string; density?: 'low' | 'medium' | 'high' }> = ({
  className = '',
  density = 'medium'
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      {/* Cupcake doodle top left */}
      <div className="absolute top-16 left-4 opacity-40 transform -rotate-12 animate-float" style={{ animationDelay: '0s' }}>
        <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
          <path d="M12 28C12 28 16 16 30 16C44 16 48 28 48 28C50 30 50 34 46 35C44 35 42 34 40 33C38 36 34 36 32 34C30 36 26 36 24 34C22 36 18 36 16 33C14 34 12 35 10 35C6 34 6 30 8 28" fill="#FBCFE8" stroke="#3B2C30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 34L18 52C18.5 54 20.5 55.5 22.5 55.5H37.5C39.5 55.5 41.5 54 42 52L46 34" fill="#FED7AA" stroke="#3B2C30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="30" cy="12" r="4" fill="#F43F5E" stroke="#3B2C30" strokeWidth="2"/>
          {/* Eyes & smile */}
          <circle cx="25" cy="44" r="1.5" fill="#3B2C30" />
          <circle cx="35" cy="44" r="1.5" fill="#3B2C30" />
          <path d="M28 47Q30 49 32 47" stroke="#3B2C30" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Rolling Pin doodle */}
      <div className="absolute top-36 left-2 opacity-35 transform -rotate-45">
        <svg width="48" height="48" viewBox="0 0 70 70" fill="none">
          <rect x="22" y="24" width="26" height="14" rx="3" fill="#FDE68A" stroke="#3B2C30" strokeWidth="2.5" />
          <rect x="12" y="28" width="10" height="6" rx="2" fill="#D97706" stroke="#3B2C30" strokeWidth="2" />
          <rect x="48" y="28" width="10" height="6" rx="2" fill="#D97706" stroke="#3B2C30" strokeWidth="2" />
          <circle cx="32" cy="30" r="1.2" fill="#3B2C30" />
          <circle cx="38" cy="30" r="1.2" fill="#3B2C30" />
          <path d="M34 33Q35 34.5 36 33" stroke="#3B2C30" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* Cake Slice top right */}
      <div className="absolute top-24 right-4 opacity-40 transform rotate-12 animate-float" style={{ animationDelay: '1.5s' }}>
        <svg width="42" height="42" viewBox="0 0 60 60" fill="none">
          <path d="M10 42L48 42L52 28L14 28Z" fill="#FCE7F3" stroke="#3B2C30" strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M14 28L30 14L52 28" fill="#FBCFE8" stroke="#3B2C30" strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M10 42L10 48C10 49 11 50 12 50L46 50C47 50 48 49 48 48L48 42" fill="#FDE68A" stroke="#3B2C30" strokeWidth="2.5"/>
          <circle cx="36" cy="10" r="3.5" fill="#EF4444" stroke="#3B2C30" strokeWidth="2" />
          <circle cx="26" cy="36" r="1.2" fill="#3B2C30" />
          <circle cx="34" cy="36" r="1.2" fill="#3B2C30" />
          <path d="M29 39Q30 40.5 31 39" stroke="#3B2C30" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Whisk doodle */}
      <div className="absolute top-48 right-3 opacity-35 transform 45deg">
        <svg width="36" height="36" viewBox="0 0 60 60" fill="none">
          <path d="M42 42L54 54" stroke="#3B2C30" strokeWidth="3" strokeLinecap="round"/>
          <ellipse cx="28" cy="28" rx="14" ry="18" transform="rotate(-45 28 28)" stroke="#3B2C30" strokeWidth="2.5" fill="none"/>
          <path d="M20 20L36 36" stroke="#3B2C30" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Scattered Kawaii Hearts & Stars */}
      <div className="absolute top-12 left-1/3 opacity-30 text-rose-300">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="absolute top-20 right-1/4 opacity-30 text-pink-300">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
        </svg>
      </div>
      <div className="absolute bottom-32 left-6 opacity-30 text-amber-300">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
        </svg>
      </div>

      {density === 'high' && (
        <>
          {/* Bottom cake slice */}
          <div className="absolute bottom-12 left-4 opacity-40 transform rotate-6">
            <svg width="38" height="38" viewBox="0 0 60 60" fill="none">
              <path d="M10 42L48 42L52 28L14 28Z" fill="#FCE7F3" stroke="#3B2C30" strokeWidth="2.5"/>
              <circle cx="30" cy="14" r="3.5" fill="#F43F5E" stroke="#3B2C30" strokeWidth="2" />
            </svg>
          </div>
          {/* Bottom cupcake */}
          <div className="absolute bottom-8 right-6 opacity-40 transform -rotate-12">
            <svg width="36" height="36" viewBox="0 0 60 60" fill="none">
              <path d="M12 28C12 28 16 16 30 16C44 16 48 28 48 28C50 30 50 34 46 35C44 35 42 34 40 33C38 36 34 36 32 34C30 36 26 36 24 34C22 36 18 36 16 33C14 34 12 35 10 35C6 34 6 30 8 28" fill="#BAE6FD" stroke="#3B2C30" strokeWidth="2.5"/>
              <path d="M14 34L18 52H42L46 34" fill="#FED7AA" stroke="#3B2C30" strokeWidth="2.5"/>
              <circle cx="30" cy="12" r="3.5" fill="#EF4444" stroke="#3B2C30" strokeWidth="2"/>
            </svg>
          </div>
        </>
      )}
    </div>
  );
};
