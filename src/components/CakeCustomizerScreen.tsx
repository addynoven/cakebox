import React, { useState } from 'react';
import { CustomCakeConfig, CartItem, CakeItem } from '../types';
import { BASE_SPONGES, FROSTING_OPTIONS, DRIP_OPTIONS, TOPPER_STYLES } from '../data/cakes';
import { CakeVisualizer } from './CakeVisualizer';
import { CakeDoodles } from './CakeDoodles';
import { DripHeader } from './DripHeader';
import { ArrowLeft, Sparkles, Check, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CakeCustomizerScreenProps {
  baseCake?: CakeItem | null;
  onAddToCart: (cartItem: CartItem) => void;
  onCancel: () => void;
}

export const CakeCustomizerScreen: React.FC<CakeCustomizerScreenProps> = ({
  baseCake,
  onAddToCart,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Customizer state
  const [selectedBase, setSelectedBase] = useState(BASE_SPONGES[0]);
  const [selectedFrosting, setSelectedFrosting] = useState(FROSTING_OPTIONS[1]); // Vanilla default
  const [selectedDrip, setSelectedDrip] = useState(DRIP_OPTIONS[0]); // Pink glaze default
  const [selectedSize, setSelectedSize] = useState<'6"' | '8"' | '10"'>('8"');
  
  const [toppings, setToppings] = useState({
    sprinkles: true,
    fruits: true,
    topper: true,
    topperText: 'Happy Birthday'
  });

  const [customTopperText, setCustomTopperText] = useState('Happy Birthday');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isCelebrated, setIsCelebrated] = useState(false);

  // Calculated Price
  const basePrice = selectedSize === '6"' ? 35 : selectedSize === '8"' ? 45 : 58;
  const toppingsPrice = (toppings.fruits ? 3 : 0) + (toppings.topper ? 2 : 0);
  const totalPrice = basePrice + toppingsPrice;

  const currentConfig: CustomCakeConfig = {
    base: selectedBase,
    frosting: selectedFrosting,
    drip: selectedDrip,
    toppings: {
      ...toppings,
      topperText: customTopperText
    },
    size: selectedSize,
    servings: selectedSize === '6"' ? '4-6' : selectedSize === '8"' ? '8-10' : '12-15',
    price: totalPrice,
    messageOnCake: customTopperText,
    specialRequests: specialRequests
  };

  const handleFinishAndAdd = () => {
    // Fire sweet celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5E89', '#FED8BF', '#F472B6', '#FBBF24', '#60A5FA']
    });

    const customCartItem: CartItem = {
      id: `custom-${Date.now()}`,
      name: `Custom ${selectedBase.name} (${selectedSize})`,
      price: totalPrice,
      quantity: 1,
      size: selectedSize,
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
      isCustom: true,
      customConfig: currentConfig,
      notes: `${selectedFrosting.name} frosting, ${selectedDrip.name}, Inscription: "${customTopperText}" ${specialRequests ? `| Note: ${specialRequests}` : ''}`
    };

    onAddToCart(customCartItem);
  };

  return (
    <div className="w-full h-full bg-[#FFF8F8] flex flex-col justify-between relative overflow-y-auto pb-10 select-none">
      <CakeDoodles density="low" />

      {/* Top Header with Interactive Step Progress Bar matching Image 6, 7, 8 */}
      <div className="w-full bg-[#FFEBF0] border-b border-pink-200 px-4 pt-3 pb-2 z-20 shrink-0 sticky top-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={step === 1 ? onCancel : () => setStep((s) => (s - 1) as any)}
            className="w-8 h-8 rounded-full bg-white/90 border border-pink-300 flex items-center justify-center text-pink-700 hover:bg-pink-100 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold font-display text-[#3B2C30]">
              CakeBox
            </span>
          </div>

          <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
            Step {step} of 4
          </span>
        </div>

        {/* Visual Step Progress Bar with Sliding Cake Icon */}
        <div className="relative w-full h-3 bg-white rounded-full border border-pink-300 overflow-hidden flex items-center px-1">
          <div
            className="h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
          {/* Cake Icon Marker */}
          <div
            className="absolute top-0 bottom-0 flex items-center text-sm transition-all duration-300"
            style={{ left: `calc(${(step / 4) * 100}% - 14px)` }}
          >
            🎂
          </div>
        </div>

        <div className="text-center mt-1.5">
          <span className="text-xs font-extrabold text-[#3B2C30] font-display">
            {step === 1 && 'Cute Customization Step 1 — Sponge Base'}
            {step === 2 && 'Cute Customization Step 2 — Pick Frosting'}
            {step === 3 && 'Cute Customization Step 3 — Drip & Glaze'}
            {step === 4 && 'Cute Customization Finalize — Toppings & Preview'}
          </span>
        </div>
      </div>

      {/* Main Step Views */}
      <div className="flex-1 px-4 py-3 relative z-10 flex flex-col justify-between">
        {/* ================= STEP 1: CHOOSE YOUR BASE (Image 6) ================= */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold font-display text-center text-[#3B2C30] my-2">
                Choose Your Base
              </h2>
              <p className="text-xs text-center text-[#584146] mb-6">
                Freshly baked gourmet sponge layers prepared from scratch
              </p>

              {/* 3 or 4 Cute Sponge Options matching Image 6 */}
              <div className="grid grid-cols-3 gap-3">
                {BASE_SPONGES.map((sponge) => {
                  const isSelected = selectedBase.id === sponge.id;
                  return (
                    <button
                      key={sponge.id}
                      onClick={() => setSelectedBase(sponge)}
                      className={`flex flex-col items-center group btn-bounce transition-all ${
                        isSelected ? 'scale-105' : 'opacity-85 hover:opacity-100'
                      }`}
                    >
                      {/* Sponge Disc Frame */}
                      <div
                        className={`w-24 h-24 rounded-full border-2 p-1 relative flex items-center justify-center shadow-xs transition-all ${
                          isSelected
                            ? 'border-[#3B2C30] ring-4 ring-pink-300/80 bg-[#FFD6E0]'
                            : 'border-[#3B2C30] bg-[#FFF0F2]'
                        }`}
                      >
                        {/* Sponge Realistic Disc Vector */}
                        <div
                          className="w-20 h-20 rounded-full border border-[#3B2C30]/50 overflow-hidden flex flex-col items-center justify-center relative shadow-inner"
                          style={{ backgroundColor: sponge.spongeColor }}
                        >
                          {/* Top crust */}
                          <div
                            className="w-full h-1/2"
                            style={{ backgroundColor: sponge.color, opacity: 0.9 }}
                          />
                          {/* Cream Filling Stripe */}
                          <div className="w-full h-2 bg-white/95 border-y border-[#3B2C30]/30 shadow-xs" />
                          {/* Bottom sponge */}
                          <div
                            className="w-full h-1/2"
                            style={{ backgroundColor: sponge.spongeColor }}
                          />
                        </div>

                        {isSelected && (
                          <div className="absolute top-0 right-0 w-5 h-5 bg-pink-500 rounded-full text-white flex items-center justify-center border-2 border-white">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      <span className="font-bold text-xs font-display text-[#3B2C30] text-center mt-2 leading-tight">
                        {sponge.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Sponge Info Card */}
              <div className="mt-8 bg-white/90 border border-pink-200 rounded-2xl p-3.5 shadow-xs text-center">
                <span className="text-xs font-bold text-pink-600">Selected Base:</span>
                <p className="text-xs text-[#584146] mt-0.5 font-medium">
                  {selectedBase.flavorDesc}
                </p>
              </div>
            </div>

            {/* Next Button matching Image 6 */}
            <div className="mt-8">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FF5E89] to-[#FF809F] hover:opacity-95 text-white font-extrabold text-base font-display border-2 border-[#3B2C30] shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 btn-bounce"
              >
                <span>✨ Next ✨</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PICK YOUR FROSTING (Image 7) ================= */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold font-display text-center text-[#3B2C30] my-2">
                Pick Your Frosting
              </h2>
              <p className="text-xs text-center text-[#584146] mb-6">
                Whipped Swiss meringue & rich cream frostings
              </p>

              {/* 3 Cute Frosting Bowls matching Image 7 */}
              <div className="grid grid-cols-3 gap-2.5">
                {FROSTING_OPTIONS.map((f) => {
                  const isSelected = selectedFrosting.id === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFrosting(f)}
                      className={`flex flex-col items-center group btn-bounce transition-all ${
                        isSelected ? 'scale-105' : 'opacity-85 hover:opacity-100'
                      }`}
                    >
                      {/* Radio indicator circle above bowl matching Image 7 */}
                      <div className="w-5 h-5 rounded-full border-2 border-[#3B2C30] mb-2 flex items-center justify-center bg-white">
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                        )}
                      </div>

                      {/* Cute Smiling Bowl Vector matching Image 7 */}
                      <div className="w-24 h-24 relative flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                          {/* Frosting Swirl */}
                          <path
                            d="M25,50 C20,30 35,15 50,15 C65,15 80,30 75,50 Z"
                            fill={f.color}
                            stroke="#3B2C30"
                            strokeWidth="2.5"
                          />
                          {/* Swirl creases */}
                          <path
                            d="M40,25 Q50,35 60,25"
                            stroke="#3B2C30"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M32,38 Q50,45 68,38"
                            stroke="#3B2C30"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            fill="none"
                          />

                          {/* Sprinkles / Chips on frosting */}
                          {f.id === 'rich_chocolate' && (
                            <>
                              <circle cx="45" cy="30" r="1.5" fill="#3B2C30" />
                              <circle cx="55" cy="36" r="1.5" fill="#3B2C30" />
                              <circle cx="38" cy="42" r="1.5" fill="#3B2C30" />
                            </>
                          )}
                          {f.id === 'sweet_strawberry' && (
                            <>
                              <circle cx="50" cy="20" r="3" fill="#EF4444" stroke="#3B2C30" strokeWidth="1" />
                              <circle cx="38" cy="35" r="2" fill="#EF4444" />
                              <circle cx="62" cy="38" r="2" fill="#EF4444" />
                            </>
                          )}
                          {f.id === 'classic_vanilla' && (
                            <>
                              <circle cx="42" cy="28" r="1.2" fill="#3B82F6" />
                              <circle cx="54" cy="32" r="1.2" fill="#F43F5E" />
                              <circle cx="48" cy="42" r="1.2" fill="#10B981" />
                            </>
                          )}

                          {/* Smiling Bowl */}
                          <path
                            d="M20,50 L25,75 C25,85 75,85 75,75 L80,50 Z"
                            fill={f.bowlColor}
                            stroke="#3B2C30"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                          />
                          {/* Kawaii Face on Bowl */}
                          <circle cx="42" cy="66" r="1.8" fill="#3B2C30" />
                          <circle cx="58" cy="66" r="1.8" fill="#3B2C30" />
                          <ellipse cx="36" cy="68" rx="2" ry="1.2" fill="#FB7185" opacity="0.8" />
                          <ellipse cx="64" cy="68" rx="2" ry="1.2" fill="#FB7185" opacity="0.8" />
                          <path
                            d="M48,68 Q50,72 52,68"
                            stroke="#3B2C30"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <span className="font-bold text-xs font-display text-[#3B2C30] text-center mt-1 leading-tight">
                        {f.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Description Card */}
              <div className="mt-8 bg-white/90 border border-pink-200 rounded-2xl p-3.5 shadow-xs text-center">
                <span className="text-xs font-bold text-pink-600">Flavor Profile:</span>
                <p className="text-xs text-[#584146] mt-0.5 font-medium">
                  {selectedFrosting.desc}
                </p>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-full bg-white border-2 border-[#3B2C30] text-xs font-bold text-[#3B2C30] btn-bounce"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FF5E89] to-[#FF809F] hover:opacity-95 text-white font-extrabold text-base font-display border-2 border-[#3B2C30] shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 btn-bounce"
              >
                <span>Next: Drip & Glaze</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PICK DRIP & SIZE ================= */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold font-display text-center text-[#3B2C30] my-2">
                Drip & Cake Size
              </h2>
              <p className="text-xs text-center text-[#584146] mb-5">
                Add an indulgent cascading drizzle & choose your size
              </p>

              {/* Drip Options */}
              <span className="text-xs font-bold text-[#584146] uppercase tracking-wider block mb-2">
                Cascading Drip Glaze
              </span>
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {DRIP_OPTIONS.map((drip) => {
                  const isSelected = selectedDrip.id === drip.id;
                  return (
                    <button
                      key={drip.id}
                      onClick={() => setSelectedDrip(drip)}
                      className={`py-3 px-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 text-left btn-bounce ${
                        isSelected
                          ? 'bg-[#FF6B93] text-white border-[#3B2C30] shadow-xs'
                          : 'bg-white text-[#3B2C30] border-pink-200 hover:border-pink-400'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-black/20 shrink-0 shadow-xs"
                        style={{ backgroundColor: drip.color === 'transparent' ? '#FFFFFF' : drip.color }}
                      />
                      <span className="text-xs font-bold font-display flex-1 truncate">
                        {drip.name}
                      </span>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>

              {/* Size Selector */}
              <span className="text-xs font-bold text-[#584146] uppercase tracking-wider block mb-2">
                Cake Size & Portions
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { size: '6"', label: 'Feeds 4-6', price: 35 },
                  { size: '8"', label: 'Feeds 8-10', price: 45 },
                  { size: '10"', label: 'Feeds 12-15', price: 58 }
                ].map((s) => {
                  const isSelected = selectedSize === s.size;
                  return (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size as any)}
                      className={`py-3 px-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center btn-bounce ${
                        isSelected
                          ? 'bg-[#FF6B93] text-white border-[#3B2C30] shadow-xs'
                          : 'bg-[#FED8BF]/40 text-[#3B2C30] border-pink-200 hover:bg-[#FED8BF]/70'
                      }`}
                    >
                      <span className="text-base font-extrabold font-display">
                        {s.size}
                      </span>
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-pink-100' : 'text-gray-500'}`}>
                        {s.label}
                      </span>
                      <span className="text-xs font-bold mt-1">
                        ${s.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-full bg-white border-2 border-[#3B2C30] text-xs font-bold text-[#3B2C30] btn-bounce"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FF5E89] to-[#FF809F] hover:opacity-95 text-white font-extrabold text-base font-display border-2 border-[#3B2C30] shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 btn-bounce"
              >
                <span>Finalize & Preview Cake</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CUTE CUSTOMIZATION FINALIZE (Image 8) ================= */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div className="flex flex-col gap-3">
              {/* Preview Container matching Image 8 */}
              <div className="bg-[#FFF0F5] border-2 border-[#3B2C30] rounded-[28px] p-2 relative shadow-xs flex flex-col items-center">
                {/* "Preview" Tag banner matching Image 8 */}
                <div className="absolute top-2 left-2 bg-[#FED8BF] border border-[#3B2C30] text-[#3B2C30] text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg shadow-2xs">
                  Preview
                </div>

                {/* Live Cake Visualizer */}
                <CakeVisualizer config={currentConfig} size="md" />
              </div>

              {/* Special Toppings matching Image 8 */}
              <div>
                <span className="text-sm font-extrabold font-display text-[#3B2C30] block mb-2">
                  Special Toppings
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Sprinkles Toggle */}
                  <button
                    type="button"
                    onClick={() => setToppings((prev) => ({ ...prev, sprinkles: !prev.sprinkles }))}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className={`w-18 h-18 rounded-full border-2 border-[#3B2C30] p-1 relative flex items-center justify-center overflow-hidden transition-all ${
                      toppings.sprinkles ? 'ring-3 ring-pink-400 bg-pink-50' : 'opacity-70 bg-white'
                    }`}>
                      {/* Sprinkles circle image */}
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-200 via-amber-100 to-blue-200 flex items-center justify-center text-lg">
                        ✨
                      </div>

                      {toppings.sprinkles && (
                        <div className="absolute top-0 right-0 w-5 h-5 bg-[#FF5E89] border-2 border-white rounded-full flex items-center justify-center text-white shadow-xs">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold font-display text-[#3B2C30] mt-1">
                      Sprinkles
                    </span>
                  </button>

                  {/* Fresh Fruits Toggle */}
                  <button
                    type="button"
                    onClick={() => setToppings((prev) => ({ ...prev, fruits: !prev.fruits }))}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className={`w-18 h-18 rounded-full border-2 border-[#3B2C30] p-1 relative flex items-center justify-center overflow-hidden transition-all ${
                      toppings.fruits ? 'ring-3 ring-pink-400 bg-pink-50' : 'opacity-70 bg-white'
                    }`}>
                      <div className="w-full h-full rounded-full bg-rose-100 flex items-center justify-center text-lg">
                        🍓
                      </div>

                      {toppings.fruits && (
                        <div className="absolute top-0 right-0 w-5 h-5 bg-[#FF5E89] border-2 border-white rounded-full flex items-center justify-center text-white shadow-xs">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold font-display text-[#3B2C30] mt-1">
                      Fruits (+$3)
                    </span>
                  </button>

                  {/* Acrylic Toppers Toggle */}
                  <button
                    type="button"
                    onClick={() => setToppings((prev) => ({ ...prev, topper: !prev.topper }))}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className={`w-18 h-18 rounded-full border-2 border-[#3B2C30] p-1 relative flex items-center justify-center overflow-hidden transition-all ${
                      toppings.topper ? 'ring-3 ring-pink-400 bg-pink-50' : 'opacity-70 bg-white'
                    }`}>
                      <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center text-xs font-bold text-center px-1 font-serif text-[#3B2C30]">
                        Happy Birthday
                      </div>

                      {toppings.topper && (
                        <div className="absolute top-0 right-0 w-5 h-5 bg-[#FF5E89] border-2 border-white rounded-full flex items-center justify-center text-white shadow-xs">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold font-display text-[#3B2C30] mt-1">
                      Toppers (+$2)
                    </span>
                  </button>
                </div>
              </div>

              {/* Topper Sign Inscription Input */}
              {toppings.topper && (
                <div className="bg-white rounded-2xl p-3 border border-pink-200">
                  <span className="text-xs font-bold text-[#584146] block mb-1">
                    Cake Inscription / Topper Text
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={24}
                      value={customTopperText}
                      onChange={(e) => setCustomTopperText(e.target.value)}
                      placeholder="e.g. Happy Birthday Maya!"
                      className="flex-1 text-xs border border-pink-200 rounded-xl px-3 py-2 text-[#3B2C30] outline-none focus:border-pink-500 font-medium"
                    />
                  </div>
                  {/* Preset chips */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {TOPPER_STYLES.slice(0, 4).map((sty) => (
                      <button
                        key={sty}
                        type="button"
                        onClick={() => setCustomTopperText(sty)}
                        className="text-[10px] bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold px-2 py-0.5 rounded-full border border-pink-200"
                      >
                        {sty}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Requests textarea matching Image 8 */}
              <div>
                <span className="text-xs font-bold text-[#584146] block mb-1">
                  Special Requests?
                </span>
                <input
                  type="text"
                  placeholder="Type your request (e.g. less sugar, add 5 candles)"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full text-xs border border-pink-200 rounded-2xl px-3.5 py-2.5 bg-white text-[#3B2C30] outline-none focus:border-pink-500 font-medium placeholder-gray-400"
                />
              </div>
            </div>

            {/* Bottom Add To Cart Pill matching Image 8 */}
            <div className="mt-4 pt-2">
              <button
                onClick={handleFinishAndAdd}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FF5E89] to-[#FF809F] hover:opacity-95 text-white font-extrabold text-base font-display border-2 border-[#3B2C30] shadow-md shadow-pink-500/25 transition-all flex items-center justify-between btn-bounce"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </div>
                <span className="font-extrabold text-lg">${totalPrice.toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
