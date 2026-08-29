import React, { ReactNode } from 'react';
import { FeatureFlagKey } from '../config/featureFlags.schema';
import { useFeatureFlag } from '../config/useFeatureFlags';

export interface FeatureGateProps {
  flag: FeatureFlagKey;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Declarative component to show/hide UI sections based on Feature Flags.
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  flag,
  children,
  fallback = null,
}) => {
  const isEnabled = useFeatureFlag(flag);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
