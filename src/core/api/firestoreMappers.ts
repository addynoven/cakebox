import { CakeItem, CakeSize } from '../../features/catalog/models/cake.model';
import { Order, CartItem } from '../../features/cart/models/cart.model';
import { UserProfile, SavedAddress } from '../../features/auth/models/user.model';

export function mapCakeDoc(id: string, data: any): CakeItem {
  const sizes: CakeSize[] = Array.isArray(data.sizes)
    ? data.sizes.map((s: any) => ({
        size: String(s.size || '8"'),
        label: String(s.label || s.size || 'Standard'),
        servings: String(s.servings || '8-10'),
        price: Number(s.price || data.price || 45),
      }))
    : [
        { size: '6"', label: '6" (Feeds 4-6)', servings: '4-6', price: Number(data.basePrice || data.price || 35) },
        { size: '8"', label: '8" (Feeds 8-10)', servings: '8-10', price: Number(data.price || 45) },
      ];

  return {
    id: id || data.id,
    name: String(data.name || 'Untitled Cake'),
    category: data.category || 'birthdays',
    categoryLabel: String(data.categoryLabel || 'Celebration Cake'),
    price: Number(data.price || 45),
    basePrice: Number(data.basePrice || data.price || 45),
    rating: Number(data.rating || 5.0),
    reviewsCount: Number(data.reviewsCount || 0),
    image: String(data.image || 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80'),
    description: String(data.description || ''),
    flavor: String(data.flavor || 'Vanilla & Buttercream'),
    dietary: Array.isArray(data.dietary) ? data.dietary.map(String) : [],
    sizes,
    badge: data.badge || undefined,
    ingredients: Array.isArray(data.ingredients) ? data.ingredients.map(String) : [],
    allergens: Array.isArray(data.allergens) ? data.allergens.map(String) : [],
    isCustomizable: Boolean(data.isCustomizable ?? true),
  };
}

export function mapCartItemDoc(item: any): CartItem {
  return {
    id: String(item.id),
    cakeId: item.cakeId ? String(item.cakeId) : undefined,
    name: String(item.name || 'Artisan Treat'),
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 1),
    size: String(item.size || '8"'),
    image: String(item.image || ''),
    isCustom: Boolean(item.isCustom),
    customConfig: item.customConfig,
    notes: item.notes ? String(item.notes) : undefined,
  };
}

export function mapOrderDoc(id: string, data: any): Order {
  const items: CartItem[] = Array.isArray(data.items)
    ? data.items.map(mapCartItemDoc)
    : [];

  return {
    id: id || data.id,
    orderNumber: String(data.orderNumber || `CKB-${id.slice(0, 6).toUpperCase()}`),
    createdAt: String(data.createdAt || new Date().toISOString()),
    items,
    subtotal: Number(data.subtotal || 0),
    deliveryFee: Number(data.deliveryFee || 0),
    tax: Number(data.tax || 0),
    discount: Number(data.discount || 0),
    total: Number(data.total || 0),
    status: data.status || 'Received',
    estimatedDelivery: String(data.estimatedDelivery || 'Today, within 2 hours'),
    deliveryAddress: {
      street: String(data.deliveryAddress?.street || ''),
      city: String(data.deliveryAddress?.city || ''),
      recipientName: String(data.deliveryAddress?.recipientName || ''),
      phone: String(data.deliveryAddress?.phone || ''),
      deliveryDate: String(data.deliveryAddress?.deliveryDate || ''),
      deliveryTimeSlot: String(data.deliveryAddress?.deliveryTimeSlot || ''),
    },
    isOfflineOrder: Boolean(data.isOfflineOrder),
    synced: Boolean(data.synced ?? true),
  };
}

export function mapUserProfileDoc(id: string, data: any): UserProfile {
  const savedAddresses: SavedAddress[] = Array.isArray(data.savedAddresses)
    ? data.savedAddresses.map((a: any) => ({
        id: String(a.id || Math.random().toString()),
        label: String(a.label || 'Home'),
        address: String(a.address || ''),
        isDefault: Boolean(a.isDefault),
      }))
    : [];

  return {
    id: id || data.id || '',
    name: String(data.name || 'Sweet Baker'),
    email: String(data.email || ''),
    phone: String(data.phone || ''),
    avatar: data.avatar ? String(data.avatar) : undefined,
    isLoggedIn: true,
    savedAddresses,
    wishlist: Array.isArray(data.wishlist) ? data.wishlist.map(String) : [],
  };
}
