import { CakeItem } from '../types';

export const INITIAL_CAKES: CakeItem[] = [
  {
    id: 'rainbow-layer-cake',
    name: 'Rainbow Layer Cake',
    category: 'birthdays',
    categoryLabel: 'Birthday Cakes',
    price: 45.0,
    basePrice: 45.0,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: 'Our vibrant, multi-layered vanilla sponge cake filled with creamy buttercream. Perfect for any celebration, this cake is sure to bring a smile to everyone\'s face!',
    flavor: 'Vanilla & Buttercream',
    dietary: ['Vegetarian', 'Nut-Free'],
    badge: 'Hot!',
    sizes: [
      { size: '6"', label: '6" (Feeds 4-6)', servings: '4-6', price: 35.0 },
      { size: '8"', label: '8" (Feeds 8-10)', servings: '8-10', price: 45.0 },
      { size: '10"', label: '10" (Feeds 12-15)', servings: '12-15', price: 58.0 }
    ],
    ingredients: ['Organic Wheat Flour', 'Cane Sugar', 'Farm Fresh Butter', 'Madagascar Vanilla', 'Pastel Sprinkles'],
    allergens: ['Wheat', 'Dairy', 'Eggs'],
    isCustomizable: true
  },
  {
    id: 'chocolate-truffle-cake',
    name: 'Chocolate Truffle Cake',
    category: 'birthdays',
    categoryLabel: 'Birthday Cakes',
    price: 15.0,
    basePrice: 15.0,
    rating: 4.8,
    reviewsCount: 98,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: 'Decadent dark chocolate layers enveloped in silky Belgian chocolate truffle ganache and topped with handmade chocolate truffles.',
    flavor: 'Dark Chocolate & Truffle',
    dietary: ['Vegetarian'],
    badge: 'Bestseller',
    sizes: [
      { size: '6"', label: '6" (Feeds 4-6)', servings: '4-6', price: 15.0 },
      { size: '8"', label: '8" (Feeds 8-10)', servings: '8-10', price: 28.0 },
      { size: '10"', label: '10" (Feeds 12-15)', servings: '12-15', price: 42.0 }
    ],
    ingredients: ['Belgian Dark Chocolate 70%', 'Cocoa Powder', 'Buttercream', 'Heavy Cream', 'Espresso Note'],
    allergens: ['Dairy', 'Wheat', 'Eggs'],
    isCustomizable: true
  },
  {
    id: 'floral-buttercream-cake',
    name: 'Floral Buttercream Cake',
    category: 'weddings',
    categoryLabel: 'Wedding Cakes',
    price: 10.0,
    basePrice: 10.0,
    rating: 5.0,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    description: 'A romantic, velvety vanilla sponge crowned with handcrafted pastel buttercream roses, blossoms, and subtle golden dust.',
    flavor: 'Rose Vanilla Bean',
    dietary: ['Vegetarian', 'Nut-Free'],
    badge: 'Chef Pick',
    sizes: [
      { size: '6"', label: '6" (Feeds 4-6)', servings: '4-6', price: 10.0 },
      { size: '8"', label: '8" (Feeds 8-10)', servings: '8-10', price: 25.0 },
      { size: '10"', label: '10" (Feeds 12-15)', servings: '12-15', price: 40.0 }
    ],
    ingredients: ['Vanilla Bean Sponge', 'Italian Meringue Buttercream', 'Organic Sugar Flowers', 'Edible 24k Gold'],
    allergens: ['Wheat', 'Dairy', 'Eggs'],
    isCustomizable: true
  },
  {
    id: 'classic-chocolate-drip',
    name: 'Classic Chocolate Drip',
    category: 'birthdays',
    categoryLabel: 'Birthday Cakes',
    price: 52.0,
    basePrice: 52.0,
    rating: 4.9,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    description: 'Moist devil\'s food cake loaded with rich chocolate fudge, glazed with luscious dark chocolate drip and topped with artisanal chocolate macarons.',
    flavor: 'Chocolate Fudge & Macaron',
    dietary: ['Vegetarian'],
    badge: 'Hot!',
    sizes: [
      { size: '6"', label: '6" (Feeds 4-6)', servings: '4-6', price: 42.0 },
      { size: '8"', label: '8" (Feeds 8-10)', servings: '8-10', price: 52.0 },
      { size: '10"', label: '10" (Feeds 12-15)', servings: '12-15', price: 68.0 }
    ],
    ingredients: ['Valrhona Cocoa', 'Fudge Ganache', 'Almond Macarons', 'Sea Salt Flakes'],
    allergens: ['Dairy', 'Nuts', 'Wheat', 'Eggs'],
    isCustomizable: true
  },
  {
    id: 'pastel-buttercream-dream',
    name: 'Pastel Buttercream',
    category: 'birthdays',
    categoryLabel: 'Birthday Cakes',
    price: 60.0,
    basePrice: 60.0,
    rating: 4.8,
    reviewsCount: 79,
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80',
    description: 'Whimsical garden bouquet piped in lavender, blush, mint and buttercup whipped frosting over fluffy Genoese sponge.',
    flavor: 'Berry Chantilly',
    dietary: ['Vegetarian', 'Eggless Option'],
    sizes: [
      { size: '6"', label: '6" (Feeds 4-6)', servings: '4-6', price: 48.0 },
      { size: '8"', label: '8" (Feeds 8-10)', servings: '8-10', price: 60.0 },
      { size: '10"', label: '10" (Feeds 12-15)', servings: '12-15', price: 75.0 }
    ],
    ingredients: ['Genoese Sponge', 'Raspberry Coulis', 'Vanilla Swiss Buttercream'],
    allergens: ['Wheat', 'Dairy', 'Eggs'],
    isCustomizable: true
  },
  {
    id: 'cinthenonbe-cake',
    name: 'Cinthenonbe Cake',
    category: 'birthdays',
    categoryLabel: 'Birthday Cakes',
    price: 38.0,
    basePrice: 38.0,
    rating: 4.9,
    reviewsCount: 53,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    description: 'Custom milestone number cake crafted with tender almond biscuit dough, piped cream cheese frosting, and edible blossom garnishes.',
    flavor: 'Almond & Cream Cheese',
    dietary: ['Vegetarian'],
    sizes: [
      { size: 'Single Digit', label: 'Feeds 6-8', servings: '6-8', price: 38.0 },
      { size: 'Double Digit', label: 'Feeds 12-16', servings: '12-16', price: 68.0 }
    ],
    ingredients: ['Sablé Biscuit Base', 'White Chocolate Cream', 'Fresh Strawberries', 'Edible Pansies'],
    allergens: ['Nuts', 'Dairy', 'Wheat', 'Eggs'],
    isCustomizable: true
  },
  {
    id: 'strawberry-shortcake',
    name: 'Strawberry Shortcake',
    category: 'treats',
    categoryLabel: 'Treats & Specialties',
    price: 28.0,
    basePrice: 28.0,
    rating: 4.9,
    reviewsCount: 168,
    image: 'https://images.unsplash.com/photo-1568827999250-3f044aa10fe6?auto=format&fit=crop&w=800&q=80',
    description: 'Two thick layers of light-as-air sponge stuffed with fresh organic strawberries and light sweet vanilla whipped cream.',
    flavor: 'Fresh Strawberry Cream',
    dietary: ['Vegetarian', 'Nut-Free'],
    badge: 'Hot!',
    sizes: [
      { size: '6"', label: '6" (Feeds 4-6)', servings: '4-6', price: 22.0 },
      { size: '8"', label: '8" (Feeds 8-10)', servings: '8-10', price: 28.0 },
      { size: '10"', label: '10" (Feeds 12-15)', servings: '12-15', price: 39.0 }
    ],
    ingredients: ['Fresh California Strawberries', 'Chantilly Whipped Cream', 'Golden Sponge Cake'],
    allergens: ['Wheat', 'Dairy', 'Eggs'],
    isCustomizable: true
  },
  {
    id: 'chocolate-hazelnut-crunch',
    name: 'Chocolate Hazelnut Crunch Cake',
    category: 'treats',
    categoryLabel: 'Treats & Specialties',
    price: 35.0,
    basePrice: 35.0,
    rating: 4.9,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: 'Rich roasted Piedmont hazelnut praline layered between fudgy chocolate cake and crunchy feuilletine flakes.',
    flavor: 'Hazelnut Praline & Nutella',
    dietary: ['Vegetarian'],
    badge: 'Bestseller',
    sizes: [
      { size: '6"', label: '6" (Feeds 4-6)', servings: '4-6', price: 28.0 },
      { size: '8"', label: '8" (Feeds 8-10)', servings: '8-10', price: 35.0 },
      { size: '10"', label: '10" (Feeds 12-15)', servings: '12-15', price: 48.0 }
    ],
    ingredients: ['Roasted Hazelnuts', 'Gianduja Chocolate', 'Crispy Feuilletine', 'Dark Cocoa'],
    allergens: ['Nuts', 'Wheat', 'Dairy', 'Eggs'],
    isCustomizable: true
  },
  {
    id: 'garden-carrot-bliss',
    name: 'Garden Carrot Bliss',
    category: 'treats',
    categoryLabel: 'Treats & Specialties',
    price: 34.0,
    basePrice: 34.0,
    rating: 4.7,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
    description: 'Spiced heirloom carrot cake with toasted pecans, golden raisins, and velvety whipped maple cream cheese frosting.',
    flavor: 'Spiced Carrot & Pecan',
    dietary: ['Vegetarian'],
    badge: 'New!',
    sizes: [
      { size: '6"', label: '6" (Feeds 4-6)', servings: '4-6', price: 26.0 },
      { size: '8"', label: '8" (Feeds 8-10)', servings: '8-10', price: 34.0 },
      { size: '10"', label: '10" (Feeds 12-15)', servings: '12-15', price: 46.0 }
    ],
    ingredients: ['Fresh Grated Carrots', 'Ceylon Cinnamon', 'Maple Cream Cheese', 'Toasted Pecans'],
    allergens: ['Nuts', 'Dairy', 'Wheat', 'Eggs'],
    isCustomizable: true
  },
  {
    id: 'sweet-cupcake-trio',
    name: 'Kawaii Cupcake Box',
    category: 'cupcakes',
    categoryLabel: 'Artisanal Cupcakes',
    price: 18.0,
    basePrice: 18.0,
    rating: 5.0,
    reviewsCount: 204,
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80',
    description: 'Set of 6 handcrafted artisanal cupcakes: 2 strawberry swirl, 2 Belgian dark chocolate fudge, and 2 Madagascar vanilla bean.',
    flavor: 'Assorted (Strawberry, Vanilla, Cocoa)',
    dietary: ['Vegetarian', 'Nut-Free'],
    badge: 'Hot!',
    sizes: [
      { size: 'Box of 6', label: 'Box of 6 cupcakes', servings: '6 cupcakes', price: 18.0 },
      { size: 'Box of 12', label: 'Box of 12 cupcakes', servings: '12 cupcakes', price: 32.0 }
    ],
    ingredients: ['Buttercream swirls', 'Rainbow sugar pearls', 'Pure cocoa', 'Fresh fruit puree'],
    allergens: ['Dairy', 'Wheat', 'Eggs'],
    isCustomizable: false
  },
  {
    id: 'royal-wedding-cascade',
    name: 'Royal Pearl Tier Wedding Cake',
    category: 'weddings',
    categoryLabel: 'Wedding Cakes',
    price: 180.0,
    basePrice: 180.0,
    rating: 5.0,
    reviewsCount: 39,
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
    description: 'Three tiered architectural cake with cascading sugar pearls, white chocolate lace trim, and champagne infused sponge layers.',
    flavor: 'Champagne & White Chocolate',
    dietary: ['Vegetarian'],
    badge: 'Chef Pick',
    sizes: [
      { size: '2-Tier (25 Servings)', label: '2-Tier (Feeds 25)', servings: '25', price: 120.0 },
      { size: '3-Tier (50 Servings)', label: '3-Tier (Feeds 50)', servings: '50', price: 180.0 },
      { size: '4-Tier (100 Servings)', label: '4-Tier (Feeds 100)', servings: '100', price: 290.0 }
    ],
    ingredients: ['Brut Champagne Reduction', 'Belgian White Chocolate', 'Edible Lustre Pearls', 'Fondant Trim'],
    allergens: ['Dairy', 'Wheat', 'Eggs'],
    isCustomizable: true
  }
];

export const BASE_SPONGES = [
  {
    id: 'vanilla',
    name: 'Vanilla Sponge',
    color: '#FFE5B4',
    spongeColor: '#FDF2D0',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=400&q=80',
    flavorDesc: 'Fluffy Madagascar vanilla bean sponge with delicate golden crumb.'
  },
  {
    id: 'chocolate',
    name: 'Chocolate Sponge',
    color: '#5C3A21',
    spongeColor: '#4A2A1A',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
    flavorDesc: 'Deep Dutch dark cocoa sponge with rich moist fudge notes.'
  },
  {
    id: 'red_velvet',
    name: 'Red Velvet Sponge',
    color: '#9E2A2B',
    spongeColor: '#8E1616',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=400&q=80',
    flavorDesc: 'Signature crimson buttermilk sponge with a hint of cocoa.'
  },
  {
    id: 'funfetti',
    name: 'Funfetti Rainbow',
    color: '#FCE7F3',
    spongeColor: '#FEF08A',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=400&q=80',
    flavorDesc: 'Joyful vanilla sponge studded with colorful baked-in rainbow sprinkles.'
  }
];

export const FROSTING_OPTIONS = [
  {
    id: 'rich_chocolate',
    name: 'Rich Chocolate',
    color: '#653818',
    bowlColor: '#D7CCC8',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
    desc: 'Whipped Belgian chocolate silk ganache with dark cocoa drizzle.'
  },
  {
    id: 'classic_vanilla',
    name: 'Classic Vanilla',
    color: '#FFFDD0',
    bowlColor: '#BBDEFB',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80',
    desc: 'Smooth whipped butter cream infused with bourbon vanilla pods.'
  },
  {
    id: 'sweet_strawberry',
    name: 'Sweet Strawberry',
    color: '#FFB6C1',
    bowlColor: '#FFCDD2',
    image: 'https://images.unsplash.com/photo-1568827999250-3f044aa10fe6?auto=format&fit=crop&w=400&q=80',
    desc: 'Fresh strawberry puree whipped into pastel pink cloud frosting.'
  },
  {
    id: 'caramel_cream',
    name: 'Salted Caramel',
    color: '#E0A96D',
    bowlColor: '#FFE082',
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=400&q=80',
    desc: 'Golden artisanal caramel with Fleur de Sel sea salt.'
  }
];

export const DRIP_OPTIONS = [
  { id: 'pink_glaze', name: 'Strawberry Pink Drip', color: '#F472B6' },
  { id: 'dark_ganache', name: 'Dark Chocolate Drip', color: '#3E2723' },
  { id: 'white_cream', name: 'Cream White Drip', color: '#FFF8DC' },
  { id: 'salted_caramel', name: 'Amber Caramel Drip', color: '#C87D32' },
  { id: 'none', name: 'No Drip', color: 'transparent' }
];

export const TOPPER_STYLES = [
  'Happy Birthday',
  'Best Wishes 🎉',
  'Congratulations!',
  'Love You Always ❤️',
  'Sweet 16 🎂',
  'Bride to Be 👰',
  'Just Baked 🍰',
  'Custom Text'
];
