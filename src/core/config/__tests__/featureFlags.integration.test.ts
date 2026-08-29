import { describe, expect, it, beforeEach } from 'bun:test';
import { FeatureFlagsSchema, DEFAULT_FEATURE_FLAGS } from '../featureFlags.schema';
import { useFeatureFlagsStore } from '../useFeatureFlags';

describe('Feature Flags Integration', () => {
  beforeEach(() => {
    useFeatureFlagsStore.getState().resetFlags();
  });

  it('should initialize with default production flags enabled', () => {
    const flags = useFeatureFlagsStore.getState().flags;
    expect(flags.enableAIChef).toBe(true);
    expect(flags.enableBakeryMap).toBe(true);
    expect(flags.enable3DCustomizer).toBe(true);
    expect(flags.enableHolidayTheme).toBe(false);
    expect(flags.enableARBirthdayPreview).toBe(false);
  });

  it('should allow runtime dev override of feature flags', () => {
    const store = useFeatureFlagsStore.getState();
    store.setFlag('enableHolidayTheme', true);

    expect(useFeatureFlagsStore.getState().flags.enableHolidayTheme).toBe(true);

    store.resetFlags();
    expect(useFeatureFlagsStore.getState().flags.enableHolidayTheme).toBe(false);
  });

  it('should safely parse and merge partial remote flags from cloud payload', () => {
    const store = useFeatureFlagsStore.getState();
    const remotePayload = {
      enableAIChef: false, // Emergency remote killswitch
      enableHolidayTheme: true, // Seasonal promo activated
      unknownKeyShouldBeIgnored: 'hello',
    };

    store.syncRemoteFlags(remotePayload);

    const updated = useFeatureFlagsStore.getState().flags;
    expect(updated.enableAIChef).toBe(false);
    expect(updated.enableHolidayTheme).toBe(true);
    expect(updated.enableBakeryMap).toBe(true); // Untouched default stays intact
  });
});
