import React, { useState } from 'react';
import { Order, UserProfile, CakeItem } from '../types';
import { Cake, Package, Heart, MapPin, User, LogOut, Clock, CheckCircle, RefreshCw, Wifi, WifiOff, Sparkles, Map, ShieldCheck } from 'lucide-react';
import { CakeDoodles } from './CakeDoodles';

interface OrdersProfileScreenProps {
  orders: Order[];
  user: UserProfile;
  wishlistCakes: CakeItem[];
  isOffline: boolean;
  onSync: () => void;
  pendingSyncCount: number;
  onSelectCake: (cake: CakeItem) => void;
  onSignOut: () => void;
  onUpdateUser: (user: UserProfile) => void;
  onOpenAIChef?: () => void;
  onOpenBakeryMap?: () => void;
}

export const OrdersProfileScreen: React.FC<OrdersProfileScreenProps> = ({
  orders,
  user,
  wishlistCakes,
  isOffline,
  onSync,
  pendingSyncCount,
  onSelectCake,
  onSignOut,
  onUpdateUser,
  onOpenAIChef,
  onOpenBakeryMap
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const orderStatuses = [
    { label: 'Received', icon: '📋' },
    { label: 'Baking in Oven', icon: '🧁' },
    { label: 'Decorating', icon: '🎨' },
    { label: 'Out for Delivery', icon: '🛵' },
    { label: 'Delivered', icon: '🎉' }
  ];

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'Received':
        return 0;
      case 'Baking in Oven':
        return 1;
      case 'Decorating':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="w-full h-full bg-[#FFF8F8] flex flex-col justify-between relative overflow-y-auto pb-20 select-none">
      <CakeDoodles density="low" />

      {/* Screen Header */}
      <div className="px-4 pt-3 relative z-10">
        <div className="flex items-center justify-between mb-3 bg-white/90 p-3 rounded-2xl border border-pink-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-pink-300 object-cover shadow-2xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white border-2 border-white flex items-center justify-center text-lg shadow-2xs">
                🍰
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold font-display text-[#3B2C30] leading-tight">
                  {user.name}
                </h2>
                <span className="text-[9px] font-bold bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <ShieldCheck size={10} />
                  <span>Firebase</span>
                </span>
              </div>
              <span className="text-[11px] text-[#584146] block truncate max-w-[180px]">
                {user.email}
              </span>
            </div>
          </div>

          {/* Sync / Offline status button */}
          <div className="flex items-center gap-1.5">
            {isOffline ? (
              <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full">
                <WifiOff size={11} />
                <span>Offline</span>
              </div>
            ) : (
              <button
                onClick={onSync}
                className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs transition-all btn-bounce"
              >
                <RefreshCw size={11} className={pendingSyncCount > 0 ? 'animate-spin' : ''} />
                <span>{pendingSyncCount > 0 ? `Sync (${pendingSyncCount})` : 'Firestore Synced'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Assistant Launcher Bar */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={onOpenAIChef}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white py-2 px-3 rounded-2xl text-xs font-bold shadow-xs hover:opacity-95 transition-all btn-bounce"
          >
            <Sparkles size={14} />
            <span>Ask Chef Rosette (AI)</span>
          </button>
          <button
            onClick={onOpenBakeryMap}
            className="flex items-center justify-center gap-1.5 bg-white border-2 border-pink-300 text-pink-700 hover:bg-pink-50 py-2 px-3 rounded-2xl text-xs font-bold shadow-xs transition-all btn-bounce"
          >
            <Map size={14} />
            <span>Bakery Map & Pickup</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 gap-1 bg-pink-100/60 p-1 rounded-2xl border border-pink-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'orders'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-[#584146] hover:text-pink-600'
            }`}
          >
            <Package size={13} />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'wishlist'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-[#584146] hover:text-pink-600'
            }`}
          >
            <Heart size={13} />
            <span>Wishlist ({wishlistCakes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'profile'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-[#584146] hover:text-pink-600'
            }`}
          >
            <User size={13} />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 pt-3 flex-1 flex flex-col gap-3 relative z-10">
        {/* ================= TAB 1: ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-3">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white/70 rounded-3xl border border-pink-100 p-6">
                <span className="text-4xl">📦</span>
                <h4 className="font-bold text-sm font-display text-[#3B2C30] mt-2">
                  No orders yet
                </h4>
                <p className="text-xs text-[#584146] mt-1">
                  Place an order for a delicious cake to track it in real time!
                </p>
              </div>
            ) : (
              orders.map((order) => {
                const currentStepIdx = getStatusIndex(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white/95 backdrop-blur-xs rounded-[26px] p-4 border border-pink-200 shadow-xs flex flex-col gap-3"
                  >
                    {/* Order Top Bar */}
                    <div className="flex justify-between items-center pb-2 border-b border-pink-100">
                      <div>
                        <span className="font-bold text-xs font-display text-[#3B2C30]">
                          {order.orderNumber}
                        </span>
                        <div className="text-[10px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {order.isOfflineOrder ? (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                            Offline Stored
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                            Firestore Synced
                          </span>
                        )}
                        <span className="text-[11px] font-bold bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full border border-pink-200">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Visual Live Bakery Progress Timeline */}
                    <div className="bg-[#FFF8F8] rounded-2xl p-2.5 border border-pink-100">
                      <div className="flex justify-between items-center text-[10px] font-bold text-[#584146] mb-1.5">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-pink-600" />
                          <span>Estimated Delivery: {order.estimatedDelivery}</span>
                        </span>
                      </div>

                      {/* Steps Bar */}
                      <div className="relative flex justify-between items-center px-2 py-1">
                        <div className="absolute top-1/2 left-4 right-4 h-1 bg-pink-100 -translate-y-1/2 z-0" />
                        <div
                          className="absolute top-1/2 left-4 h-1 bg-pink-500 -translate-y-1/2 z-0 transition-all duration-500"
                          style={{
                            width: `${(currentStepIdx / 4) * 85}%`
                          }}
                        />

                        {orderStatuses.map((st, idx) => {
                          const isDone = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;
                          return (
                            <div
                              key={st.label}
                              className="flex flex-col items-center relative z-10 group"
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 transition-all ${
                                  isCurrent
                                    ? 'bg-pink-500 text-white border-pink-600 ring-2 ring-pink-200 scale-110 shadow-xs'
                                    : isDone
                                    ? 'bg-pink-200 text-pink-900 border-pink-400'
                                    : 'bg-white text-gray-400 border-gray-200'
                                }`}
                              >
                                <span>{st.icon}</span>
                              </div>
                              <span
                                className={`text-[9px] font-semibold mt-1 text-center max-w-[50px] leading-tight ${
                                  isCurrent ? 'text-pink-700 font-bold' : 'text-gray-500'
                                }`}
                              >
                                {st.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="flex flex-col gap-1.5">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-pink-50 text-pink-700 flex items-center justify-center font-bold text-[10px]">
                              {it.quantity}x
                            </span>
                            <span className="font-semibold text-[#3B2C30] truncate max-w-[170px]">
                              {it.name}
                            </span>
                          </div>
                          <span className="font-bold text-[#3B2C30]">
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2 border-t border-pink-100 text-xs">
                      <span className="text-gray-500">
                        Total Paid:
                      </span>
                      <span className="font-extrabold text-sm text-[#FF4878] font-display">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ================= TAB 2: WISHLIST ================= */}
        {activeTab === 'wishlist' && (
          <div className="flex flex-col gap-3">
            {wishlistCakes.length === 0 ? (
              <div className="text-center py-12 bg-white/70 rounded-3xl border border-pink-100 p-6">
                <span className="text-4xl">💖</span>
                <h4 className="font-bold text-sm font-display text-[#3B2C30] mt-2">
                  Your wishlist is waiting
                </h4>
                <p className="text-xs text-[#584146] mt-1">
                  Heart your favorite cakes from the home or catalog view!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {wishlistCakes.map((cake) => (
                  <div
                    key={cake.id}
                    onClick={() => onSelectCake(cake)}
                    className="bg-white rounded-2xl border border-pink-200 p-2.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#FFF8F8]">
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs font-display text-[#3B2C30] truncate">
                        {cake.name}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-extrabold text-xs text-pink-600 font-display">
                          ${cake.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: PROFILE SETTINGS ================= */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-2xs flex flex-col gap-3">
              <h4 className="text-xs font-bold text-[#584146] uppercase tracking-wider">
                Saved Delivery Addresses
              </h4>

              {user.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between p-2.5 bg-[#FFF8F8] rounded-xl border border-pink-100"
                >
                  <div className="flex items-start gap-2">
                    <MapPin size={15} className="text-pink-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-[#3B2C30] block">
                        {addr.label}
                      </span>
                      <span className="text-[11px] text-[#584146]">
                        {addr.address}
                      </span>
                    </div>
                  </div>
                  {addr.isDefault && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Cloud & Offline Database Storage Status Info Card */}
            <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-2xs flex flex-col gap-2">
              <h4 className="text-xs font-bold text-[#584146] uppercase tracking-wider flex items-center justify-between">
                <span>Database & Sync Architecture</span>
                <span className="text-[10px] text-emerald-600 font-bold">● Active</span>
              </h4>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Cloud Database:</span>
                <span className="font-bold text-pink-600">Firebase Firestore</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Authentication:</span>
                <span className="font-bold text-[#3B2C30]">Firebase Auth & Google</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Pending Offline Queue:</span>
                <span className="font-bold text-pink-600">{pendingSyncCount} orders</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Local Cache:</span>
                <span className="font-bold text-emerald-600">Indexed LocalStorage PWA</span>
              </div>
            </div>

            {/* Logout Action */}
            <button
              onClick={onSignOut}
              className="w-full py-3 rounded-2xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut size={14} />
              <span>Log Out / Switch Account</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
