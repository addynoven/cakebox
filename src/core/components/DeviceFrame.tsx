import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/colors';

interface DeviceFrameProps {
  children: React.ReactNode;
  isSplash?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, isSplash = false }) => {
  return (
    <SafeAreaView
      style={[styles.safeArea, isSplash && styles.splashSafeArea]}
      edges={isSplash ? [] : ['top', 'left', 'right']}
    >
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgCream,
  },
  splashSafeArea: {
    backgroundColor: '#FFFAF2',
  },
  body: {
    flex: 1,
    backgroundColor: colors.bgCream,
  },
});
