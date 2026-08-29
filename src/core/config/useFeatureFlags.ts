import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  FeatureFlags,
  FeatureFlagKey,
  DEFAULT_FEATURE_FLAGS,
  FeatureFlagsSchema,
} from './featureFlags.schema';
import { mmkvStateStorage } from '../storage';
import { addBreadcrumb } from '../errors';

interface FeatureFlagsState {
  flags: FeatureFlags;
  overrides: Partial<FeatureFlags>;
  setFlag: (key: FeatureFlagKey, value: boolean) => void;
  resetFlags: () => void;
  syncRemoteFlags: (remoteJson: unknown) => void;
}

export const useFeatureFlagsStore = create<FeatureFlagsState>()(
  persist(
    (set, get) => ({
      flags: DEFAULT_FEATURE_FLAGS,
      overrides: {},

      setFlag: (key, value) => {
        addBreadcrumb('state', `Feature flag manually overridden: ${key} = ${value}`);
        set((state) => ({
          flags: { ...state.flags, [key]: value },
          overrides: { ...state.overrides, [key]: value },
        }));
      },

      resetFlags: () => {
        addBreadcrumb('state', 'Feature flags reset to defaults');
        set({
          flags: DEFAULT_FEATURE_FLAGS,
          overrides: {},
        });
      },

      syncRemoteFlags: (remoteJson) => {
        try {
          const parsed = FeatureFlagsSchema.partial().safeParse(remoteJson);
          if (parsed.success && parsed.data) {
            addBreadcrumb('network', 'Remote feature flags synchronized');
            set((state) => ({
              flags: {
                ...DEFAULT_FEATURE_FLAGS,
                ...parsed.data,
                ...state.overrides, // Dev overrides take priority in local development
              },
            }));
          }
        } catch {
          // Keep current flags on malformed remote payload
        }
      },
    }),
    {
      name: 'cakebox-feature-flags-storage',
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);

/**
 * High-performance hook to read a specific feature flag
 */
export function useFeatureFlag(key: FeatureFlagKey): boolean {
  return useFeatureFlagsStore((state) => state.flags[key] ?? DEFAULT_FEATURE_FLAGS[key]);
}
