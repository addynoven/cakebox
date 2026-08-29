import { z } from 'zod';
import { CustomCakeConfigSchema } from '../../customizer/models/customizer.model';

export const CartItemSchema = z.object({
  id: z.string(),
  cakeId: z.string().optional(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  size: z.string(),
  image: z.string(),
  isCustom: z.boolean().optional(),
  customConfig: CustomCakeConfigSchema.optional(),
  notes: z.string().optional(),
});

export const OrderStatusEnum = z.enum([
  'Received',
  'Baking in Oven',
  'Decorating',
  'Out for Delivery',
  'Delivered',
]);

export const DeliveryAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  recipientName: z.string(),
  phone: z.string(),
  deliveryDate: z.string(),
  deliveryTimeSlot: z.string(),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  createdAt: z.string(),
  items: z.array(CartItemSchema),
  subtotal: z.number(),
  deliveryFee: z.number(),
  tax: z.number(),
  discount: z.number(),
  total: z.number(),
  status: OrderStatusEnum,
  estimatedDelivery: z.string(),
  deliveryAddress: DeliveryAddressSchema,
  isOfflineOrder: z.boolean().optional(),
  synced: z.boolean().optional(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type OrderStatus = z.infer<typeof OrderStatusEnum>;
export type DeliveryAddress = z.infer<typeof DeliveryAddressSchema>;
export type Order = z.infer<typeof OrderSchema>;
