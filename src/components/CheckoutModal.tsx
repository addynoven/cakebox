import React, { useState } from 'react';
import { CartItem, Order, UserProfile } from '../types';
import { X, MapPin, Calendar, Clock, CreditCard, ShieldCheck, WifiOff, CheckCircle2, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  cart: CartItem[];
  discount: number;
  promoCode: string;
  user: UserProfile;
  isOffline: boolean;
  onCompleteOrder: (order: Order) => void;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart,
  discount,
  promoCode,
  user,
  isOffline,
  onCompleteOrder,
  onClose
}) => {
  const [recipientName, setRecipientName] = useState(user.name || 'Sweet Tooth');
  const [phone, setPhone] = useState(user.phone || '+1 (555) 234-5678');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [customAddress, setCustomAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('Today');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('3:00 PM - 5:00 PM');
  const [giftNote, setGiftNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cash'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 5.0;
  const tax = Number((subtotal * 0.07).toFixed(2));
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FF5E89', '#FED8BF', '#F472B6', '#10B981', '#FBBF24']
    });

    const chosenAddress =
      selectedAddressIndex === -1
        ? customAddress || 'Default Delivery Address'
        : user.savedAddresses[selectedAddressIndex]?.address || '742 Evergreen Terrace, Springfield';

    const newOrder: Order = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber: `#CB-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      status: 'Received',
      estimatedDelivery: `${deliveryDate}, ${deliveryTimeSlot}`,
      deliveryAddress: {
        street: chosenAddress,
        city: 'Springfield',
        recipientName,
        phone,
        deliveryDate,
        deliveryTimeSlot
      },
      isOfflineOrder: isOffline,
      synced: !isOffline
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onCompleteOrder(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#FFF8F8] rounded-t-[36px] sm:rounded-[36px] border-t-2 sm:border-2 border-pink-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-white/80 border-b border-pink-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎂</span>
            <h3 className="text-lg font-bold font-display text-[#3B2C30]">
              Checkout & Delivery
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-700 hover:bg-pink-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Offline Notice Banner if offline */}
          {isOffline && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 flex items-start gap-2.5">
              <WifiOff size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-800">Offline Checkout Active</span>
                <p className="text-amber-700 mt-0.5 leading-relaxed">
                  You are currently offline. Your order will be securely saved on this device and synced with the bakery immediately when connection returns!
                </p>
              </div>
            </div>
          )}

          {/* Delivery Address Section */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#584146] uppercase tracking-wider mb-2">
              <MapPin size={14} className="text-pink-500" />
              <span>Delivery Address</span>
            </div>

            <div className="flex flex-col gap-2">
              {user.savedAddresses.map((addr, idx) => {
                const isSelected = selectedAddressIndex === idx;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-pink-50/80 border-pink-500 ring-2 ring-pink-200'
                        : 'bg-white border-pink-100 hover:border-pink-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-[#3B2C30] block font-display">
                        {addr.label}
                      </span>
                      <span className="text-[11px] text-[#584146]">
                        {addr.address}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 size={16} className="text-pink-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient & Phone */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-[#584146] block mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full text-xs border border-pink-200 rounded-xl px-3 py-2 bg-white text-[#3B2C30] outline-none focus:border-pink-500 font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#584146] block mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs border border-pink-200 rounded-xl px-3 py-2 bg-white text-[#3B2C30] outline-none focus:border-pink-500 font-medium"
              />
            </div>
          </div>

          {/* Delivery Scheduling */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#584146] uppercase tracking-wider mb-2">
              <Calendar size={14} className="text-pink-500" />
              <span>Delivery Time</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              {['Today', 'Tomorrow', 'This Weekend'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDeliveryDate(d)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                    deliveryDate === d
                      ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                      : 'bg-white text-[#3B2C30] border-pink-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                '11:00 AM - 1:00 PM',
                '3:00 PM - 5:00 PM',
                '5:00 PM - 7:00 PM',
                '7:00 PM - 9:00 PM'
              ].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setDeliveryTimeSlot(slot)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all ${
                    deliveryTimeSlot === slot
                      ? 'bg-pink-100 text-pink-700 border-pink-400 font-bold'
                      : 'bg-white text-gray-600 border-pink-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Complimentary Gift Card Note */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#584146] uppercase tracking-wider mb-1">
              <Gift size={14} className="text-pink-500" />
              <span>Complimentary Greeting Card</span>
            </div>
            <input
              type="text"
              placeholder="Write a sweet message for the recipient..."
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              className="w-full text-xs border border-pink-200 rounded-xl px-3 py-2 bg-white text-[#3B2C30] outline-none focus:border-pink-500 font-medium"
            />
          </div>

          {/* Payment Method */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#584146] uppercase tracking-wider mb-2">
              <CreditCard size={14} className="text-pink-500" />
              <span>Payment Option</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: 'Credit Card', icon: '💳' },
                { id: 'apple_pay', label: 'Apple/GPay', icon: '⚡' },
                { id: 'cash', label: 'On Delivery', icon: '💵' }
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-0.5 ${
                    paymentMethod === pm.id
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white text-[#3B2C30] border-pink-200'
                  }`}
                >
                  <span className="text-sm">{pm.icon}</span>
                  <span className="text-[10px]">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Total & Submit Button */}
          <div className="mt-2 pt-3 border-t border-pink-100 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-[#584146]">
              <span>Grand Total:</span>
              <span className="text-xl font-black text-[#FF4878] font-display">
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FF5388] to-[#FF8566] text-white font-extrabold text-sm font-display shadow-md shadow-pink-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 btn-bounce"
            >
              <ShieldCheck size={18} />
              <span>{isSubmitting ? 'Baking Your Order...' : `Place Order • $${total.toFixed(2)}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
