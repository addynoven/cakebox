import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../utils/theme';

interface DeviceFrameProps {
  children: React.ReactNode;
  isSplash?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, isSplash = false }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.safeArea, isSplash && styles.splashSafeArea]}
        edges={isSplash ? [] : ['top', 'left', 'right']}
      >
        <StatusBar style={isSplash ? 'dark' : 'dark'} translucent backgroundColor="transparent" />
        <View style={styles.body}>{children}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgCream
  },
  splashSafeArea: {
    backgroundColor: '#FFFAF2'
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.bgCream
  }
});
