import React, { useState } from 'react';
import { CakeItem } from '../types';
import { Heart, Sparkles, Check, ChevronRight, ShieldCheck, Clock, Users } from 'lucide-react';
import { CakeDoodles } from './CakeDoodles';

interface ProductDetailScreenProps {
  cake: CakeItem;
  onAddToCart: (cake: CakeItem, size: string, price: number) => void;
  onCustomize: (cake: CakeItem) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  cake,
  onAddToCart,
  onCustomize,
  isWishlisted,
  onToggleWishlist
}) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(
    cake.sizes.length > 1 ? 1 : 0
  );
  const [addedToast, setAddedToast] = useState(false);

  const currentSizeObj = cake.sizes[selectedSizeIndex] || cake.sizes[0];
  const currentPrice = currentSizeObj?.price || cake.price;

  const handleAdd = () => {
    onAddToCart(cake, currentSizeObj.size, currentPrice);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="w-full h-full bg-[#FFF8F8] flex flex-col justify-between relative overflow-y-auto pb-20 select-none">
      <CakeDoodles density="low" />

      {/* Main Content Area matching Image 5 */}
      <div className="px-4 pt-3 flex flex-col gap-4 relative z-10">
        {/* Large Product Hero Card */}
        <div className="w-full bg-[#FFF0F5] border-2 border-[#3B2C30]/80 rounded-[32px] p-2 shadow-sm relative overflow-hidden">
          {/* Subtle sparkles on image */}
          <div className="absolute top-3 left-4 text-pink-400 text-sm pointer-events-none z-10">
            ✨
          </div>
          <div className="absolute bottom-4 right-4 text-amber-400 text-sm pointer-events-none z-10">
            ★
          </div>

          <div className="w-full h-64 rounded-[26px] overflow-hidden bg-white">
            <img
              src={cake.image}
              alt={cake.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title & Price Header matching Image 5 */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-display text-[#3B2C30] leading-tight">
              {cake.name}
            </h1>
            <span className="inline-block mt-1 text-xs text-pink-600 font-semibold bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
              {cake.flavor}
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black font-display text-[#3B2C30]">
              ${currentPrice.toFixed(2)}
            </span>
            <div className="text-[11px] text-gray-500 font-medium">Freshly Made</div>
          </div>
        </div>

        {/* Size Selection matching Image 5 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold font-display text-[#3B2C30]">Size</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Users size={13} /> {currentSizeObj.servings} Servings
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {cake.sizes.map((s, idx) => {
              const isSelected = selectedSizeIndex === idx;
              return (
                <button
                  key={s.size}
                  onClick={() => setSelectedSizeIndex(idx)}
                  className={`relative py-3 px-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center btn-bounce ${
                    isSelected
                      ? 'bg-[#FF6B93] text-white border-[#3B2C30] shadow-sm'
                      : 'bg-[#FED8BF]/50 text-[#3B2C30] border-[#3B2C30]/70 hover:bg-[#FED8BF]/80'
                  }`}
                >
                  {/* Selected checkmark bubble matching Image 5 */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF6B93] border-2 border-white rounded-full flex items-center justify-center text-white shadow-xs">
                      <Check size={11} strokeWidth={3} />
                    </div>
                  )}

                  <span className="text-base font-extrabold font-display leading-tight">
                    {s.size}
                  </span>
                  <span className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-pink-100' : 'text-[#584146]'}`}>
                    ({s.servings ? `Feeds ${s.servings}` : s.label})
                  </span>
                  <span className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-white' : 'text-[#3B2C30]'}`}>
                    ${s.price.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* "Customize This Cake" Button matching Image 5 */}
        {cake.isCustomizable !== false && (
          <button
            onClick={() => onCustomize(cake)}
            className="w-full py-3.5 px-4 rounded-full bg-[#FF809F]/20 hover:bg-[#FF809F]/30 border-2 border-[#FF809F] text-pink-700 font-extrabold text-sm font-display flex items-center justify-center gap-2 transition-all btn-bounce shadow-2xs"
          >
            <Sparkles size={16} className="text-pink-500" />
            <span>Customize This Cake (Frosting, Base & Toppings)</span>
            <ChevronRight size={16} />
          </button>
        )}

        {/* Description matching Image 5 */}
        <div className="bg-white/80 rounded-2xl p-3.5 border border-pink-100 shadow-2xs">
          <p className="text-xs text-[#584146] leading-relaxed font-medium">
            {cake.description}
          </p>
        </div>

        {/* Ingredients & Allergens */}
        <div className="bg-[#FFF0F2]/70 rounded-2xl p-3.5 border border-pink-100/80 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B2C30]">
            <ShieldCheck size={14} className="text-pink-600" />
            <span>Bakery Quality Ingredients:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cake.ingredients.map((ing, i) => (
              <span key={i} className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-full border border-pink-200 text-[#584146]">
                {ing}
              </span>
            ))}
          </div>

          <div className="text-[10px] text-gray-500 mt-1">
            <strong>Allergens:</strong> {cake.allergens.join(', ')}
          </div>
        </div>
      </div>

      {/* Added Toast */}
      {addedToast && (
        <div className="fixed bottom-24 inset-x-8 z-50 bg-[#3B2C30] text-white py-2.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs font-bold animate-bounce">
          <span>🍰 Added {cake.name} ({currentSizeObj.size}) to Cart!</span>
        </div>
      )}

      {/* Bottom Fixed Action Bar matching Image 5 */}
      <div className="fixed bottom-12 inset-x-0 max-w-[412px] mx-auto px-4 py-2 bg-[#FFF8F8]/95 backdrop-blur-md border-t border-pink-100 flex items-center gap-3 z-30">
        {/* Wishlist Button */}
        <button
          onClick={onToggleWishlist}
          className={`w-12 h-12 rounded-full border-2 border-[#3B2C30] flex items-center justify-center transition-transform active:scale-90 ${
            isWishlisted ? 'bg-pink-100 text-rose-500' : 'bg-white text-gray-400 hover:text-rose-500'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Add to Cart Button matching Image 5 */}
        <button
          onClick={handleAdd}
          className="flex-1 py-3.5 px-6 rounded-full bg-[#FF5E89] hover:bg-[#F43F5E] text-white font-extrabold text-base font-display border-2 border-[#3B2C30] shadow-md shadow-pink-500/25 transition-all flex items-center justify-center gap-2 btn-bounce"
        >
          <span>Add to Cart</span>
          <span className="text-pink-100 text-sm">(${currentPrice.toFixed(2)})</span>
        </button>
      </div>
    </div>
  );
};
