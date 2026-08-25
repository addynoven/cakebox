import React from 'react';
import { ArrowLeft, Search, ShoppingBag, Heart, Sparkles, MapPin } from 'lucide-react';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearchClick?: () => void;
  showCart?: boolean;
  onCartClick?: () => void;
  cartCount?: number;
  showWishlist?: boolean;
  onWishlistClick?: () => void;
  wishlistCount?: number;
  onOpenAIChef?: () => void;
  onOpenBakeryMap?: () => void;
  rightAction?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = 'CakeBox',
  showBack = false,
  onBack,
  showSearch = true,
  onSearchClick,
  showCart = true,
  onCartClick,
  cartCount = 0,
  showWishlist = false,
  onWishlistClick,
  wishlistCount = 0,
  onOpenAIChef,
  onOpenBakeryMap,
  rightAction
}) => {
  return (
    <header className="w-full bg-[#FFF8F8] border-b border-pink-100/60 px-4 py-3 flex items-center justify-between z-30 shrink-0 sticky top-0">
      {/* Zone 1: Brand title or Back button */}
      <div className="flex items-center gap-2 min-w-0">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-700 hover:bg-pink-100 transition-colors btn-bounce"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        ) : null}

        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xl font-bold font-display tracking-tight text-[#3B2C30] truncate">
            {title}
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Actions (Single line) */}
      <div className="flex items-center gap-1.5">
        {rightAction}

        {/* AI Pastry Chef Button */}
        {onOpenAIChef && (
          <button
            onClick={onOpenAIChef}
            title="Ask Chef Rosette (Gemini AI)"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 border border-pink-300 flex items-center justify-center text-white hover:opacity-90 transition-all btn-bounce shadow-2xs"
            aria-label="Ask AI Pastry Chef"
          >
            <Sparkles size={15} />
          </button>
        )}

        {/* Google Maps Bakery Locator */}
        {onOpenBakeryMap && (
          <button
            onClick={onOpenBakeryMap}
            title="Bakery Locations & Maps"
            className="w-8 h-8 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-700 hover:bg-pink-100 transition-colors btn-bounce"
            aria-label="Find Bakeries on Map"
          >
            <MapPin size={15} />
          </button>
        )}

        {showSearch && (
          <button
            onClick={onSearchClick}
            className="w-8 h-8 rounded-full bg-pink-50/80 border border-pink-200 flex items-center justify-center text-pink-700 hover:bg-pink-100 transition-colors btn-bounce"
            aria-label="Search"
          >
            <Search size={15} />
          </button>
        )}

        {showWishlist && (
          <button
            onClick={onWishlistClick}
            className="w-8 h-8 rounded-full bg-pink-50/80 border border-pink-200 flex items-center justify-center text-pink-700 hover:bg-pink-100 transition-colors relative btn-bounce"
            aria-label="Wishlist"
          >
            <Heart size={15} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {wishlistCount}
              </span>
            )}
          </button>
        )}

        {showCart && (
          <button
            onClick={onCartClick}
            className="w-8 h-8 rounded-full bg-pink-50/80 border border-pink-200 flex items-center justify-center text-pink-700 hover:bg-pink-100 transition-colors relative btn-bounce"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={15} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F43F5E] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
