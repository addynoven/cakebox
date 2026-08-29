import React from 'react';
import { useRouter } from 'expo-router';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';

export default function LoginRoute() {
  const router = useRouter();

  return <LoginScreen onSuccess={() => router.replace('/(tabs)')} />;
}
