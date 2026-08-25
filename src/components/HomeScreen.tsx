import React, { useState } from 'react';
import { CakeItem } from '../types';
import { Search, Sparkles, Heart, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CakeDoodles } from './CakeDoodles';

interface HomeScreenProps {
  cakes: CakeItem[];
  onSelectCake: (cake: CakeItem) => void;
  onAddToCart: (cake: CakeItem, e?: React.MouseEvent) => void;
  onSelectCategory: (category: string) => void;
  onOpenCustomizer: () => void;
  wishlist: string[];
  onToggleWishlist: (cakeId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  cakes,
  onSelectCake,
  onAddToCart,
  onSelectCategory,
  onOpenCustomizer,
  wishlist,
  onToggleWishlist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewStyle, setViewStyle] = useState<'featured' | 'trending'>('featured');

  const filteredCakes = searchQuery.trim()
    ? cakes.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.flavor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cakes;

  const featuredList = filteredCakes.slice(0, 4);
  const trendingList = filteredCakes.filter((c) => c.badge).concat(filteredCakes).slice(0, 4);

  return (
    <div className="w-full h-full bg-[#FFF8F8] flex flex-col relative overflow-y-auto pb-6 select-none">
      {/* Background cute doodles */}
      <CakeDoodles density="low" />

      {/* Main Content Area */}
      <div className="px-4 pt-3 flex flex-col gap-4 relative z-10">
        {/* Cloud-styled Search Bar matching Image 3 & Image 9 */}
        <div className="relative">
          <div className="w-full bg-white rounded-full border-2 border-pink-200/90 py-2.5 px-4 shadow-sm flex items-center gap-2.5 transition-all focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-100">
            <Search size={18} className="text-pink-400 shrink-0" />
            <input
              type="text"
              placeholder="Search CakeBox for joy & treats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#3B2C30] placeholder-[#584146]/50 outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Hero Banner matching Image 3 */}
        {!searchQuery && (
          <div className="w-full bg-gradient-to-r from-[#FED8BF]/70 to-[#FFF0F5] border-2 border-[#3B2C30]/80 rounded-[28px] p-4 shadow-sm relative overflow-hidden flex items-center justify-between">
            {/* Cute hand-drawn clouds & sparkles decoration */}
            <div className="absolute -top-1 -right-2 text-white opacity-90">
              <svg width="60" height="40" viewBox="0 0 60 40" fill="#FFFFFF">
                <path d="M15,30 Q10,30 5,25 Q0,20 5,15 Q10,10 18,12 Q25,5 35,8 Q45,5 50,15 Q58,18 56,26 Q54,32 45,30 Z" stroke="#3B2C30" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="absolute -bottom-2 -left-2 text-white opacity-80">
              <svg width="50" height="30" viewBox="0 0 60 40" fill="#FFFFFF">
                <path d="M15,30 Q10,30 5,25 Q0,20 5,15 Q10,10 18,12 Q25,5 35,8 Q45,5 50,15 Q58,18 56,26 Q54,32 45,30 Z" stroke="#3B2C30" strokeWidth="1.5"/>
              </svg>
            </div>

            <div className="flex-1 pr-3 z-10">
              <span className="text-[11px] font-bold text-pink-600 bg-white/90 px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5 inline-block">
                ✨ Special Promo
              </span>
              <h2 className="text-xl font-bold font-display text-[#3B2C30] leading-tight">
                Premium Cake Delivery.
              </h2>
              <p className="text-xs text-[#584146] mt-1 font-medium">
                Sweetness to your door! Same-day baking.
              </p>
              <button
                onClick={onOpenCustomizer}
                className="mt-3 inline-flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs btn-bounce"
              >
                <span>Design Cake</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Cake Photo */}
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#3B2C30] shadow-md shrink-0 relative bg-white">
              <img
                src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=400&q=80"
                alt="Strawberry Layer Cake"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Categories Section matching Image 3 & Image 9 */}
        <div>
          <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="text-base font-bold font-display text-[#3B2C30]">
              Categories
            </h3>
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs font-semibold text-pink-600 hover:text-pink-700"
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* Birthday Category */}
            <button
              onClick={() => onSelectCategory('birthdays')}
              className="flex flex-col items-center p-2 rounded-2xl bg-[#FEF3C7] border-2 border-[#3B2C30] shadow-xs hover:scale-105 transition-transform btn-bounce"
            >
              <div className="w-10 h-10 flex items-center justify-center text-xl">
                🎁
              </div>
              <span className="text-xs font-bold text-[#3B2C30] font-display mt-0.5 truncate">
                Birthday
              </span>
            </button>

            {/* Wedding Category */}
            <button
              onClick={() => onSelectCategory('weddings')}
              className="flex flex-col items-center p-2 rounded-2xl bg-[#BAE6FD] border-2 border-[#3B2C30] shadow-xs hover:scale-105 transition-transform btn-bounce"
            >
              <div className="w-10 h-10 flex items-center justify-center text-xl">
                🎂
              </div>
              <span className="text-xs font-bold text-[#3B2C30] font-display mt-0.5 truncate">
                Wedding
              </span>
            </button>

            {/* Customizer Category */}
            <button
              onClick={onOpenCustomizer}
              className="flex flex-col items-center p-2 rounded-2xl bg-[#FBCFE8] border-2 border-[#3B2C30] shadow-xs hover:scale-105 transition-transform btn-bounce"
            >
              <div className="w-10 h-10 flex items-center justify-center text-xl">
                🍰
              </div>
              <span className="text-xs font-bold text-[#3B2C30] font-display mt-0.5 truncate">
                Custom
              </span>
            </button>

            {/* Treats Category */}
            <button
              onClick={() => onSelectCategory('treats')}
              className="flex flex-col items-center p-2 rounded-2xl bg-[#D1FAE5] border-2 border-[#3B2C30] shadow-xs hover:scale-105 transition-transform btn-bounce"
            >
              <div className="w-10 h-10 flex items-center justify-center text-xl">
                🍩
              </div>
              <span className="text-xs font-bold text-[#3B2C30] font-display mt-0.5 truncate">
                Treats
              </span>
            </button>
          </div>
        </div>

        {/* Featured / Trending Section Toggle */}
        <div className="mt-1">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewStyle('featured')}
                className={`text-lg font-bold font-display transition-colors ${
                  viewStyle === 'featured' ? 'text-[#3B2C30]' : 'text-gray-400'
                }`}
              >
                Featured Cakes
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setViewStyle('trending')}
                className={`text-lg font-bold font-display transition-colors ${
                  viewStyle === 'trending' ? 'text-[#3B2C30]' : 'text-gray-400'
                }`}
              >
                Trending Now
              </button>
            </div>

            <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
              {filteredCakes.length} items
            </span>
          </div>

          {/* Scalloped Cake Cards Grid matching Image 3 & Image 4 & Image 9 */}
          <div className="grid grid-cols-2 gap-3">
            {(viewStyle === 'featured' ? featuredList : trendingList).map((cake) => {
              const isWishlisted = wishlist.includes(cake.id);
              return (
                <div
                  key={cake.id}
                  onClick={() => onSelectCake(cake)}
                  className="bg-white rounded-[24px] border-2 border-[#3B2C30] p-2.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer relative group"
                >
                  {/* Badge if present */}
                  {cake.badge && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#3B2C30] shadow-xs ${
                        cake.badge === 'Hot!' ? 'bg-amber-300 text-amber-900' : 'bg-pink-300 text-pink-900'
                      }`}>
                        {cake.badge}
                      </span>
                    </div>
                  )}

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(cake.id);
                    }}
                    className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 border border-pink-200 flex items-center justify-center transition-transform active:scale-90 ${
                      isWishlisted ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>

                  {/* Scalloped Wavy Photo Container */}
                  <div className="w-full aspect-square rounded-[18px] overflow-hidden border border-pink-100 mb-2 bg-[#FFF8F8]">
                    <img
                      src={cake.image}
                      alt={cake.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="font-bold text-xs font-display text-[#3B2C30] line-clamp-1 group-hover:text-pink-600 transition-colors">
                        {cake.name}
                      </h4>
                      <p className="text-[11px] text-[#584146]/70 truncate mt-0.5">
                        {cake.flavor}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-pink-50">
                      <span className="font-extrabold text-sm text-[#3B2C30] font-display">
                        ${cake.price.toFixed(2)}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(cake, e);
                        }}
                        className="bg-white border-2 border-[#3B2C30] hover:bg-pink-500 hover:text-white text-[#3B2C30] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs transition-colors btn-bounce whitespace-nowrap"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
