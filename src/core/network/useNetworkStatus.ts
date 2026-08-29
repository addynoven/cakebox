import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { useCartStore } from '../../features/cart/store/useCartStore';

export function useNetworkStatus() {
  const { user, isOffline, setOffline, showToast } = useAuthStore();
  const { syncAllOrders, pendingSyncCount } = useCartStore();
  const [networkState, setNetworkState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState(state);
      const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
      const wasOffline = isOffline;

      if (isOnline && wasOffline) {
        setOffline(false);
        showToast('🟢 Back Online! Synchronizing pending data...');
        if (user.id && pendingSyncCount > 0) {
          syncAllOrders(user.id);
        }
      } else if (!isOnline && !wasOffline) {
        setOffline(true);
        showToast('📡 You are Offline. Operating in local storage mode.');
      }
    });

    return () => unsubscribe();
  }, [user.id, isOffline, pendingSyncCount]);

  return {
    isConnected: networkState?.isConnected ?? true,
    isInternetReachable: networkState?.isInternetReachable ?? true,
    isOffline,
  };
}
