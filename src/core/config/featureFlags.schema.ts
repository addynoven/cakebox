import { z } from 'zod';

export const FeatureFlagsSchema = z.object({
  // Core Production Features
  enableAIChef: z.boolean().default(true),
  enableBakeryMap: z.boolean().default(true),
  enable3DCustomizer: z.boolean().default(true),
  enablePromoEngine: z.boolean().default(true),
  enableBiometricAuth: z.boolean().default(true),

  // Experimental / Progressive Rollout Features (OFF by default)
  enableHolidayTheme: z.boolean().default(false),
  enableARBirthdayPreview: z.boolean().default(false),
  enableCryptoPayment: z.boolean().default(false),
  enableLoyaltyRewardsTier: z.boolean().default(false),
});

export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;
export type FeatureFlagKey = keyof FeatureFlags;

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = FeatureFlagsSchema.parse({});
