import React from 'react';
import { Home, Compass, ShoppingCart, User, Cake } from 'lucide-react';

export type NavTab = 'home' | 'menu' | 'custom' | 'cart' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount
}) => {
  return (
    <nav className="w-full bg-[#FFF8F8] border-t border-pink-100 px-4 py-2 flex items-center justify-around z-30 shrink-0 select-none">
      {/* Home Tab */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'home'
            ? 'text-pink-600 font-bold scale-105'
            : 'text-[#584146] hover:text-pink-500'
        }`}
      >
        <Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span className="text-[11px] font-medium tracking-tight">Home</span>
      </button>

      {/* Menu / Catalog Tab */}
      <button
        onClick={() => onSelectTab('menu')}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'menu'
            ? 'text-pink-600 font-bold scale-105'
            : 'text-[#584146] hover:text-pink-500'
        }`}
      >
        <Compass size={20} strokeWidth={activeTab === 'menu' ? 2.5 : 2} />
        <span className="text-[11px] font-medium tracking-tight">Catalog</span>
      </button>

      {/* Customizer Center Action */}
      <button
        onClick={() => onSelectTab('custom')}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'custom'
            ? 'text-pink-600 font-bold scale-105'
            : 'text-[#584146] hover:text-pink-500'
        }`}
      >
        <div className={`w-7 h-7 rounded-full flex items-center justify-center -mt-2.5 shadow-sm transition-transform ${
          activeTab === 'custom' ? 'bg-pink-500 text-white ring-2 ring-pink-300' : 'bg-pink-100 text-pink-600'
        }`}>
          <Cake size={16} />
        </div>
        <span className="text-[10px] font-semibold tracking-tight mt-0.5">Custom</span>
      </button>

      {/* Cart Tab */}
      <button
        onClick={() => onSelectTab('cart')}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all relative ${
          activeTab === 'cart'
            ? 'text-pink-600 font-bold scale-105'
            : 'text-[#584146] hover:text-pink-500'
        }`}
      >
        <div className="relative">
          <ShoppingCart size={20} strokeWidth={activeTab === 'cart' ? 2.5 : 2} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium tracking-tight">Cart</span>
      </button>

      {/* Profile / Orders Tab */}
      <button
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'profile'
            ? 'text-pink-600 font-bold scale-105'
            : 'text-[#584146] hover:text-pink-500'
        }`}
      >
        <User size={20} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
        <span className="text-[11px] font-medium tracking-tight">Orders</span>
      </button>
    </nav>
  );
};
