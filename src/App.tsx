import React, { useState, useEffect } from 'react';
import { CakeItem, CartItem, Order, UserProfile, CustomCakeConfig } from './types';
import {
  getCachedCakes,
  getCart,
  saveCart,
  getOrders,
  addOrder,
  getUserProfile,
  saveUserProfile,
  getWishlist,
  toggleWishlistItem,
  getSimulatedOffline,
  setSimulatedOffline,
  getPendingOfflineOrders,
  syncPendingOrders
} from './utils/storage';
import {
  auth,
  saveOrderToFirestore,
  fetchOrdersFromFirestore,
  syncWishlistToFirestore,
  logoutFirebase
} from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { DeviceFrame } from './components/DeviceFrame';
import { TopBar } from './components/TopBar';
import { BottomNav, NavTab } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { CatalogScreen } from './components/CatalogScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CakeCustomizerScreen } from './components/CakeCustomizerScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersProfileScreen } from './components/OrdersProfileScreen';
import { GeminiChefChatModal } from './components/GeminiChefChatModal';
import { BakeryMapModal } from './components/BakeryMapModal';

type AppScreen =
  | 'splash'
  | 'login'
  | 'home'
  | 'catalog'
  | 'detail'
  | 'customizer'
  | 'cart'
  | 'orders_profile';

export default function App() {
  // Navigation & Screen state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCake, setSelectedCake] = useState<CakeItem | null>(null);
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  
  // Data state
  const [cakes, setCakes] = useState<CakeItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserProfile>(getUserProfile());
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Modals & Offline state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showAIChefModal, setShowAIChefModal] = useState(false);
  const [showBakeryMapModal, setShowBakeryMapModal] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromo, setCheckoutPromo] = useState('');
  const [isOffline, setIsOffline] = useState(getSimulatedOffline());
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Initialize data and Firebase Auth listener
  useEffect(() => {
    const loadedCakes = getCachedCakes();
    setCakes(loadedCakes);
    setCart(getCart());
    setOrders(getOrders());
    setUser(getUserProfile());
    setWishlist(getWishlist());
    setPendingSyncCount(getPendingOfflineOrders().length);

    // Firebase Auth State Listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const updatedProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Sweet Baker',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '+1 (555) 234-5678',
          avatar: fbUser.photoURL || undefined,
          isLoggedIn: true,
          savedAddresses: user.savedAddresses || [
            {
              id: 'addr-1',
              label: 'Home Sweet Home',
              address: '742 Evergreen Terrace, Springfield',
              isDefault: true
            }
          ],
          wishlist: getWishlist()
        };
        setUser(updatedProfile);
        saveUserProfile(updatedProfile);

        // Fetch cloud orders from Firestore
        try {
          const cloudOrders = await fetchOrdersFromFirestore(fbUser.uid);
          if (cloudOrders.length > 0) {
            // Merge with local orders
            const localOrders = getOrders();
            const existingIds = new Set(localOrders.map((o) => o.id));
            const merged = [...localOrders];
            cloudOrders.forEach((co) => {
              if (!existingIds.has(co.id)) {
                merged.push(co);
              }
            });
            setOrders(merged);
          }
        } catch (e) {
          console.warn('Could not sync Firestore orders on auth:', e);
        }
      }
    });

    // Online/Offline listeners
    const handleOnline = async () => {
      if (!getSimulatedOffline()) {
        setIsOffline(false);
        const { syncedCount } = syncPendingOrders();
        if (syncedCount > 0) {
          setOrders(getOrders());
          setPendingSyncCount(0);
          showToast(`✨ Synchronized ${syncedCount} offline order(s) with Firestore!`);
        }
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribeAuth();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Cart operations
  const handleAddToCart = (cake: CakeItem, size?: string, price?: number) => {
    const chosenSize = size || (cake.sizes[0]?.size ?? '8"');
    const chosenPrice = price || cake.price;
    const cartItemId = `${cake.id}-${chosenSize}`;

    const existingIndex = cart.findIndex((item) => item.id === cartItemId);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        cakeId: cake.id,
        name: `${cake.name} (${chosenSize})`,
        price: chosenPrice,
        quantity: 1,
        size: chosenSize,
        image: cake.image
      };
      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);
    saveCart(updatedCart);
    showToast(`🍰 Added ${cake.name} to sweet cart!`);
  };

  const handleAddCustomCartItem = (customItem: CartItem) => {
    const updatedCart = [...cart, customItem];
    setCart(updatedCart);
    saveCart(updatedCart);
    setCurrentScreen('cart');
    setActiveTab('cart');
    showToast('✨ Custom designed cake added to cart!');
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const handleRemoveCartItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  // Wishlist toggle with Firestore sync
  const handleToggleWishlist = async (cakeId: string) => {
    const updated = toggleWishlistItem(cakeId);
    setWishlist(updated);
    if (user.id && !isOffline) {
      syncWishlistToFirestore(user.id, updated);
    }
  };

  // Offline Simulator Toggle
  const handleToggleOffline = () => {
    const newOffline = !isOffline;
    setIsOffline(newOffline);
    setSimulatedOffline(newOffline);

    if (!newOffline) {
      const { syncedCount } = syncPendingOrders();
      setOrders(getOrders());
      setPendingSyncCount(0);
      if (syncedCount > 0) {
        showToast(`✨ Online connection restored! Synced ${syncedCount} order(s) to Firestore.`);
      } else {
        showToast('🟢 Connected to CakeBox Firestore Database.');
      }
    } else {
      showToast('📡 Switched to Offline Storage Mode. All features remain operational!');
    }
  };

  const handleManualSync = async () => {
    const { syncedCount } = syncPendingOrders();
    // Also push to Firestore for logged in user
    if (user.id) {
      const allOrders = getOrders();
      for (const ord of allOrders) {
        await saveOrderToFirestore(ord, user.id);
      }
    }
    setOrders(getOrders());
    setPendingSyncCount(0);
    showToast(`✨ Synchronized with Firestore successfully!`);
  };

  // Checkout flow
  const handleStartCheckout = (discount: number, promo: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromo(promo);
    setShowCheckoutModal(true);
  };

  const handleCompleteOrder = async (newOrder: Order) => {
    addOrder(newOrder, isOffline);
    setOrders(getOrders());
    setCart([]);
    saveCart([]);
    setShowCheckoutModal(false);
    setPendingSyncCount(getPendingOfflineOrders().length);
    setCurrentScreen('orders_profile');
    setActiveTab('profile');

    // Save to Firestore if online
    if (!isOffline) {
      saveOrderToFirestore(newOrder, user.id);
      showToast('🎉 Order placed and synchronized with Firebase Firestore!');
    } else {
      showToast('📡 Order saved securely on your device! Will sync once reconnected.');
    }
  };

  // Tab navigation
  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'menu') {
      setCatalogCategory('all');
      setCurrentScreen('catalog');
    } else if (tab === 'custom') {
      setSelectedCake(null);
      setCurrentScreen('customizer');
    } else if (tab === 'cart') {
      setCurrentScreen('cart');
    } else if (tab === 'profile') {
      setCurrentScreen('orders_profile');
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutFirebase();
    } catch (e) {
      // ignore
    }
    const guestUser: UserProfile = {
      id: 'guest',
      name: 'Guest Baker',
      email: 'guest@cakebox.sweet',
      phone: '',
      isLoggedIn: false,
      savedAddresses: [
        {
          id: 'addr-1',
          label: 'Default Address',
          address: '742 Evergreen Terrace, Springfield',
          isDefault: true
        }
      ],
      wishlist: []
    };
    setUser(guestUser);
    saveUserProfile(guestUser);
    setCurrentScreen('login');
  };

  const totalCartCount = cart.reduce((sum, it) => sum + it.quantity, 0);
  const wishlistCakes = cakes.filter((c) => wishlist.includes(c.id));

  const showHeader = currentScreen !== 'splash' && currentScreen !== 'login';
  const showBottomNav = currentScreen !== 'splash' && currentScreen !== 'login';

  return (
    <DeviceFrame
      isOffline={isOffline}
      onToggleOffline={handleToggleOffline}
      pendingSyncCount={pendingSyncCount}
      onSync={handleManualSync}
    >
      {/* Toast banner */}
      {notificationToast && (
        <div className="fixed top-12 inset-x-6 sm:inset-x-auto sm:right-6 z-50 bg-[#3B2C30] text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xl border border-pink-300 flex items-center gap-2 animate-fade-in max-w-sm">
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Standardized Top Bar with AI Pastry Chef & Google Maps shortcuts */}
      {showHeader && (
        <TopBar
          title={
            currentScreen === 'detail'
              ? 'CakeBox'
              : currentScreen === 'catalog'
              ? 'CakeBox'
              : currentScreen === 'customizer'
              ? 'Custom Cake'
              : currentScreen === 'cart'
              ? 'CakeBox'
              : currentScreen === 'orders_profile'
              ? 'CakeBox'
              : 'CakeBox'
          }
          showBack={currentScreen === 'detail' || currentScreen === 'catalog'}
          onBack={() => {
            if (currentScreen === 'detail') setCurrentScreen('home');
            else if (currentScreen === 'catalog') setCurrentScreen('home');
          }}
          showSearch={currentScreen === 'home' || currentScreen === 'detail'}
          onSearchClick={() => {
            setCatalogCategory('all');
            setCurrentScreen('catalog');
            setActiveTab('menu');
          }}
          showCart={currentScreen !== 'cart'}
          onCartClick={() => {
            setCurrentScreen('cart');
            setActiveTab('cart');
          }}
          cartCount={totalCartCount}
          showWishlist={currentScreen === 'home'}
          onWishlistClick={() => {
            setCurrentScreen('orders_profile');
            setActiveTab('profile');
          }}
          wishlistCount={wishlist.length}
          onOpenAIChef={() => setShowAIChefModal(true)}
          onOpenBakeryMap={() => setShowBakeryMapModal(true)}
        />
      )}

      {/* Screen Router */}
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        {currentScreen === 'splash' && (
          <SplashScreen
            onStart={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            onSuccess={(updated) => {
              const full = { ...user, ...updated };
              setUser(full);
              saveUserProfile(full);
              setCurrentScreen('home');
              showToast(`👋 Welcome, ${full.name}!`);
            }}
            onGuestContinue={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            cakes={cakes}
            onSelectCake={(cake) => {
              setSelectedCake(cake);
              setCurrentScreen('detail');
            }}
            onAddToCart={(cake) => handleAddToCart(cake)}
            onSelectCategory={(cat) => {
              setCatalogCategory(cat);
              setCurrentScreen('catalog');
              setActiveTab('menu');
            }}
            onOpenCustomizer={() => {
              setSelectedCake(null);
              setCurrentScreen('customizer');
              setActiveTab('custom');
            }}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentScreen === 'catalog' && (
          <CatalogScreen
            cakes={cakes}
            initialCategory={catalogCategory}
            onSelectCake={(cake) => {
              setSelectedCake(cake);
              setCurrentScreen('detail');
            }}
            onAddToCart={(cake) => handleAddToCart(cake)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentScreen === 'detail' && selectedCake && (
          <ProductDetailScreen
            cake={selectedCake}
            onAddToCart={(cake, size, price) => handleAddToCart(cake, size, price)}
            onCustomize={(cake) => {
              setSelectedCake(cake);
              setCurrentScreen('customizer');
            }}
            isWishlisted={wishlist.includes(selectedCake.id)}
            onToggleWishlist={() => handleToggleWishlist(selectedCake.id)}
          />
        )}

        {currentScreen === 'customizer' && (
          <CakeCustomizerScreen
            baseCake={selectedCake}
            onAddToCart={handleAddCustomCartItem}
            onCancel={() => {
              if (selectedCake) {
                setCurrentScreen('detail');
              } else {
                setCurrentScreen('home');
                setActiveTab('home');
              }
            }}
          />
        )}

        {currentScreen === 'cart' && (
          <CartScreen
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onCheckout={handleStartCheckout}
            onContinueShopping={() => {
              setCurrentScreen('home');
              setActiveTab('home');
            }}
          />
        )}

        {currentScreen === 'orders_profile' && (
          <OrdersProfileScreen
            orders={orders}
            user={user}
            wishlistCakes={wishlistCakes}
            isOffline={isOffline}
            onSync={handleManualSync}
            pendingSyncCount={pendingSyncCount}
            onSelectCake={(cake) => {
              setSelectedCake(cake);
              setCurrentScreen('detail');
            }}
            onSignOut={handleSignOut}
            onUpdateUser={(up) => {
              setUser(up);
              saveUserProfile(up);
            }}
            onOpenAIChef={() => setShowAIChefModal(true)}
            onOpenBakeryMap={() => setShowBakeryMapModal(true)}
          />
        )}
      </main>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          cart={cart}
          discount={checkoutDiscount}
          promoCode={checkoutPromo}
          user={user}
          isOffline={isOffline}
          onCompleteOrder={handleCompleteOrder}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}

      {/* Gemini AI Cake Sommelier & Pastry Master Modal */}
      <GeminiChefChatModal
        isOpen={showAIChefModal}
        onClose={() => setShowAIChefModal(false)}
      />

      {/* Google Maps Grounded Bakery Location Finder Modal */}
      <BakeryMapModal
        isOpen={showBakeryMapModal}
        onClose={() => setShowBakeryMapModal(false)}
        onSelectPickupLocation={(locName) => {
          showToast(`📍 Selected ${locName} for pickup!`);
        }}
      />

      {/* Standardized Bottom Nav */}
      {showBottomNav && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          cartCount={totalCartCount}
        />
      )}
    </DeviceFrame>
  );
}
