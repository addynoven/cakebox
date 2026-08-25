import React, { useState, useMemo } from 'react';
import { CakeItem } from '../types';
import { SlidersHorizontal, Heart, X, Check, Search } from 'lucide-react';
import { CakeDoodles } from './CakeDoodles';

interface CatalogScreenProps {
  cakes: CakeItem[];
  initialCategory?: string;
  onSelectCake: (cake: CakeItem) => void;
  onAddToCart: (cake: CakeItem, e?: React.MouseEvent) => void;
  wishlist: string[];
  onToggleWishlist: (cakeId: string) => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  cakes,
  initialCategory = 'all',
  onSelectCake,
  onAddToCart,
  wishlist,
  onToggleWishlist
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100);

  const categories = [
    { id: 'all', label: 'All Delights' },
    { id: 'birthdays', label: 'Birthday Cakes' },
    { id: 'weddings', label: 'Wedding Cakes' },
    { id: 'treats', label: 'Treats & Specialties' },
    { id: 'cupcakes', label: 'Cupcakes' }
  ];

  const dietaryOptions = ['Nut-Free', 'Vegetarian', 'Gluten-Free', 'Eggless Option'];

  const filteredCakes = useMemo(() => {
    return cakes
      .filter((cake) => {
        if (selectedCategory !== 'all' && cake.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const matchName = cake.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchFlavor = cake.flavor.toLowerCase().includes(searchQuery.toLowerCase());
          if (!matchName && !matchFlavor) return false;
        }
        if (cake.price > maxPrice) {
          return false;
        }
        if (selectedDietary.length > 0) {
          const hasDietary = selectedDietary.every((d) => cake.dietary.includes(d));
          if (!hasDietary) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [cakes, selectedCategory, searchQuery, maxPrice, selectedDietary, sortBy]);

  const activeCategoryTitle =
    categories.find((c) => c.id === selectedCategory)?.label || 'Artisanal Bakery';

  return (
    <div className="w-full h-full bg-[#FFF8F8] flex flex-col relative overflow-y-auto pb-6 select-none">
      <CakeDoodles density="low" />

      {/* Screen Header matching Image 4 */}
      <div className="px-4 pt-3 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold font-display text-[#3B2C30]">
            {activeCategoryTitle}
          </h2>

          {/* Cute Cloud Filter Button matching Image 4 */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-1.5 bg-white border-2 border-pink-300 hover:border-pink-500 text-pink-600 px-3.5 py-1 rounded-full shadow-xs text-xs font-bold transition-all btn-bounce"
          >
            <span>Filter</span>
            <SlidersHorizontal size={13} />
            {(selectedDietary.length > 0 || sortBy !== 'featured' || maxPrice < 100) && (
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
            )}
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'bg-white text-[#584146] border border-pink-200 hover:border-pink-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cakes Grid matching Image 4 */}
      <div className="px-4 pt-2 relative z-10">
        {filteredCakes.length === 0 ? (
          <div className="text-center py-12 bg-white/60 rounded-3xl border border-pink-100 p-6 my-4">
            <span className="text-4xl">🍰</span>
            <h4 className="font-bold text-base font-display text-[#3B2C30] mt-2">
              No matching cakes found
            </h4>
            <p className="text-xs text-[#584146] mt-1">
              Try adjusting your dietary or price filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDietary([]);
                setMaxPrice(100);
                setSearchQuery('');
              }}
              className="mt-3 bg-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full btn-bounce"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredCakes.map((cake) => {
              const isWishlisted = wishlist.includes(cake.id);
              return (
                <div
                  key={cake.id}
                  onClick={() => onSelectCake(cake)}
                  className="bg-transparent flex flex-col cursor-pointer group"
                >
                  {/* Scalloped Wavy Frame matching Image 4 */}
                  <div className="relative p-1.5 bg-[#FFF0F5] rounded-[26px] border-2 border-pink-300/80 shadow-xs mb-2 transition-transform group-hover:scale-[1.02]">
                    {/* Inner scalloped layer */}
                    <div className="w-full aspect-square rounded-[20px] overflow-hidden border border-pink-200 bg-white">
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {cake.badge && (
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-extrabold bg-amber-300 text-amber-900 border border-[#3B2C30] px-1.5 py-0.5 rounded-full shadow-xs">
                        {cake.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Flavor */}
                  <h4 className="font-bold text-xs font-display text-[#3B2C30] line-clamp-1 group-hover:text-pink-600 transition-colors">
                    {cake.name}
                  </h4>

                  {/* Price & Action Row matching Image 4 */}
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-extrabold text-sm text-[#FF3E78] font-display">
                      ${cake.price.toFixed(2)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(cake, e);
                        }}
                        className="bg-white border border-[#3B2C30] hover:bg-pink-500 hover:text-white hover:border-pink-500 text-[#3B2C30] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs transition-colors btn-bounce whitespace-nowrap"
                      >
                        Add to Cart
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(cake.id);
                        }}
                        className={`text-pink-400 hover:text-rose-600 transition-colors ${
                          isWishlisted ? 'text-rose-500 fill-rose-500' : ''
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Modal Dialog */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-[#FFF8F8] rounded-t-[32px] sm:rounded-[32px] p-5 border-t-2 sm:border-2 border-pink-200 shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-pink-100">
              <h3 className="text-lg font-bold font-display text-[#3B2C30]">
                Filter & Sort Cakes
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-pink-700"
              >
                <X size={16} />
              </button>
            </div>

            {/* Sort options */}
            <div className="mt-3">
              <span className="text-xs font-bold text-[#584146] uppercase tracking-wider">
                Sort By
              </span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { id: 'featured', label: 'Featured' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Highest Rated' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSortBy(item.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition-all ${
                      sortBy === item.id
                        ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                        : 'bg-white text-[#3B2C30] border-pink-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preferences */}
            <div className="mt-4">
              <span className="text-xs font-bold text-[#584146] uppercase tracking-wider">
                Dietary & Allergens
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {dietaryOptions.map((opt) => {
                  const isSel = selectedDietary.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        setSelectedDietary(
                          isSel
                            ? selectedDietary.filter((d) => d !== opt)
                            : [...selectedDietary, opt]
                        );
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isSel
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : 'bg-white text-[#3B2C30] border-pink-200'
                      }`}
                    >
                      {isSel && <Check size={12} />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-[#584146]">
                <span>Max Price</span>
                <span className="text-pink-600 font-extrabold font-display">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-pink-500 mt-2"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setSelectedDietary([]);
                  setSortBy('featured');
                  setMaxPrice(200);
                }}
                className="flex-1 py-2.5 rounded-full bg-white border border-pink-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-2 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/20"
              >
                Apply Filters ({filteredCakes.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
