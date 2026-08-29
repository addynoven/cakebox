import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { CakeItem, CartItem, Order, UserProfile } from './types';
import {
  useCakeStore,
  useCartStore,
  useUserStore
} from './store';
import {
  auth,
  saveOrderToFirestore,
  fetchOrdersFromFirestore,
  syncWishlistToFirestore,
  logoutFirebase,
  fetchCakesFromFirestore,
  subscribeCakesFromFirestore
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
import { COLORS, SHADOWS } from './utils/theme';

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
  const [isReady, setIsReady] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Zustand MMKV Stores
  const {
    cakes,
    selectedCake,
    catalogCategory,
    setCakes,
    setSelectedCake,
    setCatalogCategory
  } = useCakeStore();

  const {
    cart,
    orders,
    pendingSyncCount,
    checkoutDiscount,
    checkoutPromo,
    addToCart,
    addCustomCakeToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    setOrders,
    addOrder: addStoreOrder,
    setCheckoutDiscount,
    setCheckoutPromo,
    setPendingSyncCount
  } = useCartStore();

  const {
    user,
    wishlist,
    isOffline,
    notificationToast,
    setUser,
    setWishlist,
    toggleWishlist,
    setOffline,
    showToast,
    logout: logoutUserStore
  } = useUserStore();

  // Modals state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showAIChefModal, setShowAIChefModal] = useState(false);
  const [showBakeryMapModal, setShowBakeryMapModal] = useState(false);

  // Initialize storage & auth
  useEffect(() => {
    const initApp = async () => {
      setCurrentScreen('splash');
      setIsReady(true);

      // Fetch live cakes from Firestore
      try {
        const liveCakes = await fetchCakesFromFirestore();
        if (liveCakes && liveCakes.length > 0) {
          setCakes(liveCakes);
        }
      } catch (err) {
        console.warn('Could not fetch live cakes on init:', err);
      }
    };

    initApp();

    // Subscribe to live Firestore cake catalog updates
    const unsubscribeCakes = subscribeCakesFromFirestore((updatedCakes: CakeItem[]) => {
      if (updatedCakes && updatedCakes.length > 0) {
        setCakes(updatedCakes);
      }
    });

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const updatedProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Sweet Baker',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '',
          avatar: fbUser.photoURL || undefined,
          isLoggedIn: true,
          savedAddresses: user.savedAddresses || [],
          wishlist: wishlist
        };
        setUser(updatedProfile);
        setCurrentScreen((prev) => (prev === 'login' ? 'home' : prev));

        try {
          const cloudOrders = await fetchOrdersFromFirestore(fbUser.uid);
          if (cloudOrders.length > 0) {
            const existingIds = new Set(orders.map((o) => o.id));
            const merged = [...orders];
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
      } else {
        logoutUserStore();
        clearCart();
        setOrders([]);
        setCurrentScreen('login');
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCakes();
    };
  }, []);

  // Cart operations
  const handleAddToCart = (cake: CakeItem, size?: string, price?: number) => {
    addToCart(cake, size, price);
    showToast(`🍰 Added ${cake.name} to cart!`);
  };

  const handleAddCustomCartItem = (customItem: CartItem) => {
    addCustomCakeToCart(customItem);
    setCurrentScreen('cart');
    setActiveTab('cart');
    showToast('✨ Custom cake added to cart!');
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    updateQuantity(id, delta);
  };

  const handleRemoveCartItem = (id: string) => {
    removeFromCart(id);
  };

  // Wishlist toggle
  const handleToggleWishlist = async (cakeId: string) => {
    toggleWishlist(cakeId);
    const updatedWishlist = wishlist.includes(cakeId)
      ? wishlist.filter((id) => id !== cakeId)
      : [...wishlist, cakeId];
    if (user.id && !isOffline) {
      syncWishlistToFirestore(user.id, updatedWishlist);
    }
  };

  // Offline Simulator Toggle
  const handleToggleOffline = () => {
    const newOffline = !isOffline;
    setOffline(newOffline);

    if (!newOffline) {
      showToast('🟢 Connected to Firestore Database.');
    } else {
      showToast('📡 Offline Mode Active. Local MMKV storage operating.');
    }
  };

  const handleManualSync = async () => {
    if (user.id) {
      for (const ord of orders) {
        await saveOrderToFirestore(ord, user.id);
      }
    }
    setPendingSyncCount(0);
    showToast('✨ Synchronized successfully!');
  };

  // Checkout flow
  const handleStartCheckout = (discount: number, promo: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromo(promo);
    setShowCheckoutModal(true);
  };

  const handleCompleteOrder = async (newOrder: Order) => {
    addStoreOrder(newOrder, isOffline);
    clearCart();
    setShowCheckoutModal(false);
    setCurrentScreen('orders_profile');
    setActiveTab('profile');

    if (!isOffline) {
      saveOrderToFirestore(newOrder, user.id);
      showToast('🎉 Order placed and synced to Firestore!');
    } else {
      showToast('📡 Order saved offline! Will sync on reconnect.');
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
    } catch (e) {}
    logoutUserStore();
    clearCart();
    setOrders([]);
    setCurrentScreen('login');
    showToast('👋 Signed out successfully');
  };

  const totalCartCount = cart.reduce((sum, it) => sum + it.quantity, 0);
  const wishlistCakes = cakes.filter((c) => wishlist.includes(c.id));

  const showHeader = user.isLoggedIn && currentScreen !== 'splash' && currentScreen !== 'login';
  const showBottomNav = user.isLoggedIn && currentScreen !== 'splash' && currentScreen !== 'login';

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 36, marginBottom: 12 }}>🎂</Text>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <DeviceFrame isSplash={currentScreen === 'splash'}>
      {/* Toast Notification */}
      {notificationToast && (
        <View style={styles.toastContainer} pointerEvents="none">
          <View style={styles.toastCard}>
            <Text style={styles.toastText}>{notificationToast}</Text>
          </View>
        </View>
      )}

      {/* Top Bar */}
      {showHeader && (
        <TopBar
          title={
            currentScreen === 'detail'
              ? 'Cake Details'
              : currentScreen === 'catalog'
              ? 'Our Menu'
              : currentScreen === 'customizer'
              ? 'Custom Cake'
              : currentScreen === 'cart'
              ? 'Sweet Cart'
              : currentScreen === 'orders_profile'
              ? 'My Orders'
              : 'CakeBox'
          }
          showBack={currentScreen === 'detail' || currentScreen === 'catalog'}
          onBack={() => {
            if (currentScreen === 'detail') setCurrentScreen('home');
            else if (currentScreen === 'catalog') setCurrentScreen('home');
          }}
          onOpenAIChef={() => setShowAIChefModal(true)}
          onOpenBakeryMap={() => setShowBakeryMapModal(true)}
        />
      )}

      {/* Main Screen Router */}
      <View style={styles.screenContainer}>
        {currentScreen === 'splash' ? (
          <SplashScreen
            onStart={() => {
              if (user && user.isLoggedIn) {
                setCurrentScreen('home');
              } else {
                setCurrentScreen('login');
              }
            }}
          />
        ) : !user.isLoggedIn || currentScreen === 'login' ? (
          <LoginScreen
            onSuccess={(updated) => {
              const full: UserProfile = {
                id: updated.id || '',
                name: updated.name || '',
                email: updated.email || '',
                phone: updated.phone || '',
                avatar: updated.avatar,
                isLoggedIn: true,
                savedAddresses: updated.savedAddresses || [],
                wishlist: updated.wishlist || []
              };
              setUser(full);
              setCurrentScreen('home');
              showToast(`👋 Welcome, ${full.name || 'Sweet Baker'}!`);
            }}
          />
        ) : (
          <>
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
                onAddToCart={(cake, size, price) =>
                  handleAddToCart(cake, size, price)
                }
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
                }}
                onOpenAIChef={() => setShowAIChefModal(true)}
                onOpenBakeryMap={() => setShowBakeryMapModal(true)}
              />
            )}
          </>
        )}
      </View>

      {/* Modals */}
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

      <GeminiChefChatModal
        isOpen={showAIChefModal}
        onClose={() => setShowAIChefModal(false)}
      />

      <BakeryMapModal
        isOpen={showBakeryMapModal}
        onClose={() => setShowBakeryMapModal(false)}
        onSelectPickupLocation={(locName) => {
          showToast(`📍 Selected ${locName} for pickup!`);
        }}
      />

      {/* Bottom Nav */}
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bgCream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.bgCream
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 999,
    alignItems: 'center'
  },
  toastCard: {
    backgroundColor: COLORS.darkChocolate,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    ...SHADOWS.medium
  },
  toastText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center'
  }
});
