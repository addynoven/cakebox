import React from 'react';
import { DripHeader } from './DripHeader';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#FFA7C4] via-[#FFB7B2] to-[#FFD8B4] text-[#3B2C30] relative overflow-hidden select-none">
      {/* Top Creamy Drip Header matching Image 2 */}
      <div className="w-full relative">
        <DripHeader color="#FFFFFF" height={70} />
      </div>

      {/* Floating Sparkles & Doodles */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-28 left-8 text-white text-xl animate-pulse">✨</span>
        <span className="absolute top-44 right-10 text-white/80 text-lg animate-bounce">🍓</span>
        <span className="absolute bottom-40 left-12 text-white/80 text-xl animate-float">🧁</span>
        <span className="absolute bottom-60 right-8 text-white text-lg">★</span>
      </div>

      {/* Central Mascot & Branding matching Image 2 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 -mt-8">
        {/* Smiling Kawaii Cake Mascot Vector */}
        <div className="w-36 h-36 relative mb-4 animate-float">
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-xl">
            {/* Cake Base */}
            <path
              d="M20,70 L20,125 C20,140 140,140 140,125 L140,70 Z"
              fill="#FDE68A"
              stroke="#3B2C30"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Frosting top with wavy icing */}
            <ellipse cx="80" cy="70" rx="60" ry="18" fill="#FFFFFF" stroke="#3B2C30" strokeWidth="4" />
            <path
              d="M20,70 
                 C30,85 40,85 50,75 
                 C60,88 70,88 80,75 
                 C90,90 100,90 110,75 
                 C120,85 130,85 140,70"
              fill="#FFFFFF"
              stroke="#3B2C30"
              strokeWidth="3.5"
            />

            {/* Kawaii Face on Cake */}
            {/* Left Eye */}
            <circle cx="58" cy="102" r="5" fill="#3B2C30" />
            <circle cx="56" cy="100" r="1.5" fill="#FFFFFF" />
            {/* Right Eye */}
            <circle cx="102" cy="102" r="5" fill="#3B2C30" />
            <circle cx="100" cy="100" r="1.5" fill="#FFFFFF" />
            {/* Blushing Cheeks */}
            <ellipse cx="48" cy="108" rx="5" ry="3" fill="#FB7185" opacity="0.8" />
            <ellipse cx="112" cy="108" rx="5" ry="3" fill="#FB7185" opacity="0.8" />
            {/* Open Happy Smile */}
            <path
              d="M74,106 Q80,116 86,106"
              stroke="#3B2C30"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="#F43F5E"
            />

            {/* Whipped Cream Swirl on Top */}
            <path
              d="M60,65 C60,40 75,32 80,26 C85,32 100,40 100,65 Z"
              fill="#FFFFFF"
              stroke="#3B2C30"
              strokeWidth="3"
            />
            {/* Berries on Whipped Swirl */}
            <circle cx="80" cy="24" r="7" fill="#EF4444" stroke="#3B2C30" strokeWidth="2.5" />
            <circle cx="68" cy="35" r="5" fill="#3B82F6" stroke="#3B2C30" strokeWidth="2" />
            <circle cx="94" cy="36" r="4.5" fill="#8B5CF6" stroke="#3B2C30" strokeWidth="2" />

            {/* Colorful Sprinkles on top */}
            <circle cx="45" cy="68" r="2.5" fill="#3B82F6" />
            <circle cx="65" cy="62" r="2.5" fill="#EC4899" />
            <circle cx="95" cy="64" r="2.5" fill="#10B981" />
            <circle cx="115" cy="68" r="2.5" fill="#F59E0B" />
          </svg>
        </div>

        {/* Brand Wordmark Title */}
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-4xl font-extrabold text-white tracking-wide font-display drop-shadow-md">
            CakeBox
          </h1>
        </div>

        <p className="text-white/95 text-lg font-serif italic mt-2 tracking-wide font-medium">
          Celebrate every moment
        </p>

        <p className="text-white/80 text-xs mt-3 max-w-xs leading-relaxed">
          Artisanal custom bakery, hand-delivered sweetness & joyful celebrations.
        </p>
      </div>

      {/* Bottom Action Area */}
      <div className="px-6 pb-8 z-10 flex flex-col items-center gap-3">
        <button
          onClick={onStart}
          className="w-full max-w-xs py-3.5 px-6 rounded-full bg-white text-pink-600 font-bold text-base shadow-lg shadow-pink-900/15 hover:bg-pink-50 transition-all flex items-center justify-center gap-2 btn-bounce"
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>
        <div className="flex items-center gap-1 text-white/70 text-xs">
          <Sparkles size={12} />
          <span>Freshly Baked Every Morning • 100% Offline Ready</span>
        </div>
      </div>
    </div>
  );
};
