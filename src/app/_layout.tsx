import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../core/errors/ErrorBoundary';
import { colors } from '../core/theme/colors';
import { Toast } from '../core/components/Toast';
import { QueryProvider } from '../core/query';
import { useNetworkStatus } from '../core/network';
import { useAuthStore, LoginScreen } from '../features/auth';
import { useCakeCatalogStore } from '../features/catalog/store/useCakeCatalogStore';
import { AuthRepository } from '../features/auth/repositories/auth.repository';

function AppContent() {
  const { user, notificationToast, setUser, logout } = useAuthStore();
  const { initLiveSubscription } = useCakeCatalogStore();
  
  // Background network listener with auto-sync on reconnect
  useNetworkStatus();

  useEffect(() => {
    // Start live catalog subscription
    const unsubCakes = initLiveSubscription();

    // Listen to Firebase Auth state changes
    const unsubAuth = AuthRepository.onAuthStateChanged((fbUser) => {
      if (fbUser) {
        setUser({
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Sweet Baker',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '',
          avatar: fbUser.photoURL || undefined,
          isLoggedIn: true,
          savedAddresses: [],
          wishlist: [],
        });
      } else {
        logout();
      }
    });

    return () => {
      unsubCakes();
      unsubAuth();
    };
  }, []);

  // Upfront Auth Gate: If user is not logged in or signs out, show ONLY LoginScreen
  if (!user.isLoggedIn) {
    return (
      <>
        <StatusBar style="dark" backgroundColor={colors.bgCream} />
        <LoginScreen />
        <Toast message={notificationToast} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor={colors.bgCream} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bgCream },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="cake/[id]"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="auth/login"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>

      {/* Global Floating Notification Toast */}
      <Toast message={notificationToast} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryProvider>
          <AppContent />
        </QueryProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
