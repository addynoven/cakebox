import { z } from 'zod';

export const CustomCakeConfigSchema = z.object({
  base: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    spongeColor: z.string(),
    image: z.string(),
    flavorDesc: z.string(),
  }),
  frosting: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    bowlColor: z.string(),
    image: z.string(),
    desc: z.string(),
  }),
  drip: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
  }),
  toppings: z.object({
    sprinkles: z.boolean(),
    fruits: z.boolean(),
    topper: z.boolean(),
    topperText: z.string(),
    goldLeaves: z.boolean().optional(),
  }),
  size: z.string(),
  servings: z.string(),
  price: z.number(),
  messageOnCake: z.string(),
  specialRequests: z.string(),
  previewImage: z.string().optional(),
});

export type CustomCakeConfig = z.infer<typeof CustomCakeConfigSchema>;
