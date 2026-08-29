import { z } from 'zod';

export const CakeSizeSchema = z.object({
  size: z.string(),
  label: z.string(),
  servings: z.string(),
  price: z.number(),
});

export const CakeCategoryEnum = z.enum(['birthdays', 'weddings', 'custom', 'cupcakes', 'treats']);
export type CakeCategory = z.infer<typeof CakeCategoryEnum>;

export const CakeItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: CakeCategoryEnum,
  categoryLabel: z.string(),
  price: z.number(),
  basePrice: z.number(),
  rating: z.number(),
  reviewsCount: z.number(),
  image: z.string(),
  description: z.string(),
  flavor: z.string(),
  dietary: z.array(z.string()).default([]),
  sizes: z.array(CakeSizeSchema),
  badge: z.enum(['Hot!', 'New!', 'Bestseller', 'Chef Pick']).optional(),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  isCustomizable: z.boolean().optional(),
});

export type CakeSize = z.infer<typeof CakeSizeSchema>;
export type CakeItem = z.infer<typeof CakeItemSchema>;
