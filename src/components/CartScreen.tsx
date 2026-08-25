import React, { useState } from 'react';
import { CartItem } from '../types';
import { Plus, Minus, Trash2, ShoppingCart, Tag, ArrowRight, Sparkles, Cake } from 'lucide-react';
import { CakeDoodles } from './CakeDoodles';

interface CartScreenProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (appliedDiscount: number, promoCode: string) => void;
  onContinueShopping: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5.0 : 0.0;
  const tax = subtotal > 0 ? Number((subtotal * 0.07).toFixed(2)) : 0.0;
  const discountAmount = promoApplied ? Number((subtotal * promoApplied.discount).toFixed(2)) : 0.0;
  const grandTotal = Math.max(0, subtotal + deliveryFee + tax - discountAmount);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'SWEET10') {
      setPromoApplied({ code: 'SWEET10', discount: 0.1 });
      setPromoError(null);
    } else if (code === 'YUMMY20') {
      setPromoApplied({ code: 'YUMMY20', discount: 0.2 });
      setPromoError(null);
    } else {
      setPromoError('Invalid code. Try SWEET10 or YUMMY20');
      setTimeout(() => setPromoError(null), 3000);
    }
  };

  return (
    <div className="w-full h-full bg-[#FFF8F8] flex flex-col justify-between relative overflow-y-auto pb-24 select-none">
      <CakeDoodles density="low" />

      {/* Screen Header matching Image 10 */}
      <div className="px-4 pt-3 flex items-center justify-between relative z-10">
        <h2 className="text-2xl font-bold font-display text-[#3B2C30]">
          My Cart
        </h2>

        {/* Cute Cake Slice Icon matching top right of Image 10 */}
        <div className="w-8 h-8 flex items-center justify-center text-2xl animate-float">
          🍰
        </div>
      </div>

      {/* Cart Content Area */}
      <div className="px-4 pt-2 flex flex-col gap-3.5 relative z-10 flex-1">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 bg-white/70 rounded-3xl border border-pink-100 my-4">
            <span className="text-5xl mb-3">🧁</span>
            <h3 className="text-lg font-bold font-display text-[#3B2C30]">
              Your sweet box is empty!
            </h3>
            <p className="text-xs text-[#584146] mt-1 max-w-xs leading-relaxed">
              Explore our artisanal birthday cakes or design your own custom delight.
            </p>
            <button
              onClick={onContinueShopping}
              className="mt-4 py-2.5 px-6 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/20 btn-bounce"
            >
              Browse Bakery Delights
            </button>
          </div>
        ) : (
          <>
            {/* List of Cart Items matching Image 10 */}
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/95 backdrop-blur-xs rounded-[28px] p-3 border border-pink-100 shadow-sm flex items-center gap-3 relative overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-pink-100 bg-[#FFF8F8] shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-xs font-display text-[#3B2C30] line-clamp-2 leading-snug">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-300 hover:text-rose-500 p-1 -mr-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {item.notes && (
                      <p className="text-[10px] text-pink-600 font-medium truncate mt-0.5">
                        {item.notes}
                      </p>
                    )}

                    {/* Price and Quantity Stepper matching Image 10 */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-sm text-[#3B2C30] font-display">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Stepper Pill */}
                      <div className="flex items-center bg-[#FFE5EC] border border-pink-200 rounded-full px-1.5 py-0.5 gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded-full bg-[#FF809F] text-white flex items-center justify-center font-bold text-xs hover:bg-[#F43F5E] transition-colors btn-bounce"
                        >
                          <Minus size={11} strokeWidth={3} />
                        </button>

                        <span className="text-xs font-extrabold text-[#3B2C30] font-display min-w-[12px] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded-full bg-[#FF809F] text-white flex items-center justify-center font-bold text-xs hover:bg-[#F43F5E] transition-colors btn-bounce"
                        >
                          <Plus size={11} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="bg-white rounded-2xl p-2.5 border border-pink-100 shadow-2xs">
              <div className="flex items-center gap-2">
                <Tag size={15} className="text-pink-500 shrink-0 ml-1" />
                <input
                  type="text"
                  placeholder="Promo Code (try SWEET10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-[#3B2C30] placeholder-gray-400 outline-none uppercase font-semibold"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold px-3 py-1 rounded-full transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="mt-1 text-[11px] font-bold text-emerald-600 flex items-center gap-1 pl-1">
                  <Sparkles size={11} />
                  <span>Promo code {promoApplied.code} applied (-{promoApplied.discount * 100}%)</span>
                </div>
              )}
              {promoError && (
                <div className="mt-1 text-[11px] font-medium text-rose-500 pl-1">
                  {promoError}
                </div>
              )}
            </div>

            {/* Subtotal & Delivery Summary matching Image 10 */}
            <div className="bg-white/80 rounded-2xl p-3 border border-pink-100 flex flex-col gap-1.5 text-xs text-[#584146] font-medium">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span className="font-bold text-[#3B2C30] font-display text-sm">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery:</span>
                <span className="font-bold text-[#3B2C30] font-display text-sm">
                  ${deliveryFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax:</span>
                <span className="font-bold text-[#3B2C30] font-display text-sm">
                  ${tax.toFixed(2)}
                </span>
              </div>
              {promoApplied && (
                <div className="flex justify-between items-center text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom Sticky Checkout Bar matching Image 10 */}
      {cart.length > 0 && (
        <div className="fixed bottom-12 inset-x-0 max-w-[412px] mx-auto px-4 py-3 bg-white/95 backdrop-blur-md border-t border-pink-100 flex items-center justify-between z-30 shadow-lg">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">
              Total
            </span>
            <span className="text-2xl font-black font-display text-[#FF4878]">
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onCheckout(discountAmount, promoApplied?.code || '')}
            className="py-3 px-6 rounded-full bg-gradient-to-r from-[#FF5388] to-[#FF8566] text-white font-extrabold text-sm font-display shadow-md shadow-pink-500/25 hover:opacity-95 transition-all flex items-center gap-2 btn-bounce"
          >
            <span>Checkout Now</span>
            <ShoppingCart size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
