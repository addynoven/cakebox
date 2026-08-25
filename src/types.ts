export interface CakeItem {
  id: string;
  name: string;
  category: 'birthdays' | 'weddings' | 'custom' | 'cupcakes' | 'treats';
  categoryLabel: string;
  price: number;
  basePrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  flavor: string;
  dietary: string[];
  sizes: {
    size: string;
    label: string;
    servings: string;
    price: number;
  }[];
  badge?: 'Hot!' | 'New!' | 'Bestseller' | 'Chef Pick';
  ingredients: string[];
  allergens: string[];
  isCustomizable?: boolean;
}

export interface CustomCakeConfig {
  base: {
    id: string;
    name: string;
    color: string;
    spongeColor: string;
    image: string;
    flavorDesc: string;
  };
  frosting: {
    id: string;
    name: string;
    color: string;
    bowlColor: string;
    image: string;
    desc: string;
  };
  drip: {
    id: string;
    name: string;
    color: string;
  };
  toppings: {
    sprinkles: boolean;
    fruits: boolean;
    topper: boolean;
    topperText: string;
    goldLeaves?: boolean;
  };
  size: string;
  servings: string;
  price: number;
  messageOnCake: string;
  specialRequests: string;
  previewImage?: string;
}

export interface CartItem {
  id: string;
  cakeId?: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  isCustom?: boolean;
  customConfig?: CustomCakeConfig;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Received' | 'Baking in Oven' | 'Decorating' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
  deliveryAddress: {
    street: string;
    city: string;
    recipientName: string;
    phone: string;
    deliveryDate: string;
    deliveryTimeSlot: string;
  };
  isOfflineOrder?: boolean;
  synced?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isLoggedIn: boolean;
  savedAddresses: {
    id: string;
    label: string;
    address: string;
    isDefault: boolean;
  }[];
  wishlist: string[];
}
