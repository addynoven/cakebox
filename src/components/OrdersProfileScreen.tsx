import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Order, UserProfile, CakeItem } from '../types';
import { CakeDoodles } from './CakeDoodles';
import { COLORS, SHADOWS } from '../utils/theme';
import {
  Package,
  Heart,
  User,
  LogOut,
  RefreshCw,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react-native';

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
  onOpenAIChef: () => void;
  onOpenBakeryMap: () => void;
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
  onOpenAIChef,
  onOpenBakeryMap
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  return (
    <View style={styles.container}>
      <CakeDoodles density="low" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={{ fontSize: 28 }}>🍰</Text>
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name || 'Sweet Baker'}</Text>
            <Text style={styles.userEmail}>{user.email || 'No email provided'}</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>
                {user.isLoggedIn ? 'VIP Sweet Member' : 'Member'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Shortcuts */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            onPress={onOpenAIChef}
            style={styles.shortcutCard}
            activeOpacity={0.8}
          >
            <Sparkles size={16} color={COLORS.primary} />
            <Text style={styles.shortcutTitle}>AI Pastry Chef</Text>
            <Text style={styles.shortcutDesc}>Portion & flavor advice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onOpenBakeryMap}
            style={styles.shortcutCard}
            activeOpacity={0.8}
          >
            <MapPin size={16} color={COLORS.primary} />
            <Text style={styles.shortcutTitle}>Bakery Hubs</Text>
            <Text style={styles.shortcutDesc}>Pickup locations</Text>
          </TouchableOpacity>
        </View>

        {/* Offline Sync Banner if pending */}
        {pendingSyncCount > 0 && (
          <View style={styles.syncBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.syncTitle}>
                {pendingSyncCount} Offline Order(s) Pending
              </Text>
              <Text style={styles.syncDesc}>
                Orders will automatically sync with Firestore when connected.
              </Text>
            </View>
            <TouchableOpacity
              onPress={onSync}
              style={styles.syncBtn}
              activeOpacity={0.8}
            >
              <RefreshCw size={14} color={COLORS.white} />
              <Text style={styles.syncBtnText}>Sync Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Segmented Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('orders')}
            style={[
              styles.tabBtn,
              activeTab === 'orders' && styles.tabBtnActive
            ]}
          >
            <Package size={14} color={activeTab === 'orders' ? COLORS.primary : COLORS.textSecondary} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'orders' && styles.tabTextActive
              ]}
            >
              Orders ({orders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('wishlist')}
            style={[
              styles.tabBtn,
              activeTab === 'wishlist' && styles.tabBtnActive
            ]}
          >
            <Heart size={14} color={activeTab === 'wishlist' ? COLORS.primary : COLORS.textSecondary} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'wishlist' && styles.tabTextActive
              ]}
            >
              Wishlist ({wishlistCakes.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <View style={styles.section}>
            {orders.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={{ fontSize: 32 }}>📦</Text>
                <Text style={styles.emptyTitle}>No Orders Yet</Text>
                <Text style={styles.emptySubtitle}>
                  Your placed cake orders will appear here for live tracking.
                </Text>
              </View>
            ) : (
              orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                      <Text style={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Text>
                    </View>

                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>{order.status}</Text>
                    </View>
                  </View>

                  <View style={styles.orderItems}>
                    {order.items.map((it, idx) => (
                      <View key={idx} style={styles.orderItemRow}>
                        <Image source={{ uri: it.image }} style={styles.orderThumb} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.orderItemName} numberOfLines={1}>
                            {it.name}
                          </Text>
                          <Text style={styles.orderItemQty}>
                            Qty: {it.quantity} • ${(it.price * it.quantity).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.orderFooter}>
                    <View>
                      <Text style={styles.orderEstimate}>Estimated Delivery</Text>
                      <Text style={styles.orderEstimateVal}>
                        {order.estimatedDelivery}
                      </Text>
                    </View>
                    <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Wishlist Tab Content */}
        {activeTab === 'wishlist' && (
          <View style={styles.wishlistGrid}>
            {wishlistCakes.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={{ fontSize: 32 }}>💖</Text>
                <Text style={styles.emptyTitle}>Wishlist is Empty</Text>
                <Text style={styles.emptySubtitle}>
                  Tap the heart icon on any cake to save it here!
                </Text>
              </View>
            ) : (
              wishlistCakes.map((cake) => (
                <TouchableOpacity
                  key={cake.id}
                  onPress={() => onSelectCake(cake)}
                  style={styles.wishlistCard}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: cake.image }} style={styles.wishlistImage} />
                  <View style={styles.wishlistDetails}>
                    <Text style={styles.wishlistName} numberOfLines={1}>
                      {cake.name}
                    </Text>
                    <Text style={styles.wishlistPrice}>${cake.price.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={onSignOut}
          style={styles.signOutBtn}
          activeOpacity={0.7}
        >
          <LogOut size={16} color={COLORS.danger} />
          <Text style={styles.signOutText}>Sign Out of CakeBox</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgCream
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40
  },
  userCard: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.soft
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 27
  },
  userInfo: {
    flex: 1,
    gap: 2
  },
  userName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  userEmail: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  statusPill: {
    backgroundColor: COLORS.yellowSoft,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 10
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 16,
    padding: 12,
    gap: 2,
    ...SHADOWS.soft
  },
  shortcutTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.darkChocolate,
    marginTop: 4
  },
  shortcutDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  syncBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  syncTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  syncDesc: {
    fontSize: 10,
    color: COLORS.darkMuted,
    fontWeight: '500',
    marginTop: 2
  },
  syncBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  syncBtnText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800'
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.pinkSoft,
    borderRadius: 16,
    padding: 4
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12
  },
  tabBtnActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.soft
  },
  tabText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary
  },
  tabTextActive: {
    color: COLORS.darkChocolate
  },
  section: {
    gap: 12
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 6
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  emptySubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 240
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 20,
    padding: 14,
    gap: 10,
    ...SHADOWS.soft
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  orderDate: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2
  },
  statusBadge: {
    backgroundColor: COLORS.greenSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.success
  },
  orderItems: {
    gap: 6
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  orderThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.bgCream
  },
  orderItemName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  orderItemQty: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderPink,
    paddingTop: 8
  },
  orderEstimate: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase'
  },
  orderEstimateVal: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary
  },
  wishlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  wishlistCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 18,
    overflow: 'hidden',
    ...SHADOWS.soft
  },
  wishlistImage: {
    width: '100%',
    height: 100
  },
  wishlistDetails: {
    padding: 8
  },
  wishlistName: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  wishlistPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 2
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 20,
    paddingVertical: 12,
    marginTop: 8
  },
  signOutText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.danger
  }
});
