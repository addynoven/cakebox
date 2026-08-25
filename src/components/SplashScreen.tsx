import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onStart: () => void;
}

// Thick glossy cream drip header matching Stitch screen
const SplashDrips = () => (
  <View style={styles.dripContainer} pointerEvents="none">
    <Svg width={width} height={210} viewBox="0 0 400 210" preserveAspectRatio="none">
      {/* Soft Drop Shadow under drip */}
      <Path
        d="M 0 0 L 400 0 L 400 35 C 385 35 375 55 365 95 C 358 125 352 145 340 145 C 328 145 322 125 315 85 C 305 35 290 35 275 40 C 260 45 252 85 248 120 C 244 155 238 165 228 165 C 218 165 212 155 208 115 C 200 40 185 35 170 40 C 155 45 150 70 145 95 C 140 115 135 125 125 125 C 115 125 110 110 105 80 C 95 30 80 30 70 45 C 60 60 55 150 48 185 C 42 205 28 205 22 185 C 16 160 12 65 0 55 Z"
        fill="rgba(110, 8, 32, 0.22)"
        transform="translate(0, 6)"
      />

      {/* Main Glossy Cream Drip Body */}
      <Path
        d="M 0 0 L 400 0 L 400 35 C 385 35 375 55 365 95 C 358 125 352 145 340 145 C 328 145 322 125 315 85 C 305 35 290 35 275 40 C 260 45 252 85 248 120 C 244 155 238 165 228 165 C 218 165 212 155 208 115 C 200 40 185 35 170 40 C 155 45 150 70 145 95 C 140 115 135 125 125 125 C 115 125 110 110 105 80 C 95 30 80 30 70 45 C 60 60 55 150 48 185 C 42 205 28 205 22 185 C 16 160 12 65 0 55 Z"
        fill="#FFFAF2"
      />

      {/* Glossy White Specular Sheen on drips */}
      <Path
        d="M 26 150 C 24 175 25 195 32 195 C 34 195 35 185 35 165"
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 224 130 C 222 148 223 158 228 158 C 230 158 231 150 231 138"
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 336 115 C 334 130 335 138 340 138 C 342 138 343 130 343 122"
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  </View>
);

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    // Gentle entrance pop
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();

    // Auto navigate after 2.4 seconds
    const timer = setTimeout(() => {
      onStart();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onStart}
      style={styles.container}
    >
      {/* Rich Pink-to-Orange Sunset Gradient */}
      <LinearGradient
        colors={['#FF2A80', '#FF3C78', '#FF6347', '#FF8F00', '#FFA400']}
        locations={[0, 0.22, 0.52, 0.82, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Glossy Cream Drip Header */}
      <SplashDrips />

      {/* Center Wordmark Logo */}
      <View style={styles.centerContainer}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image
            source={require('../../assets/logo_wordmark.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  dripContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  logoWrapper: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImage: {
    width: width * 0.84,
    height: (width * 0.84) * 0.5,
    maxWidth: 340,
    maxHeight: 170
  }
});
