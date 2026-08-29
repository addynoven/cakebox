import { z } from 'zod';

export const SavedAddressSchema = z.object({
  id: z.string(),
  label: z.string(),
  address: z.string(),
  isDefault: z.boolean().default(false),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().or(z.literal('')),
  phone: z.string().default(''),
  avatar: z.string().optional(),
  isLoggedIn: z.boolean().default(false),
  savedAddresses: z.array(SavedAddressSchema).default([]),
  wishlist: z.array(z.string()).default([]),
});

export type SavedAddress = z.infer<typeof SavedAddressSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
