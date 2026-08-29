import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface CakeDoodlesProps {
  density?: 'low' | 'medium' | 'high';
}

export const CakeDoodles: React.FC<CakeDoodlesProps> = ({ density = 'low' }) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Text style={[styles.doodle, { top: 20, left: 15, fontSize: 14 }]}>✨</Text>
      <Text style={[styles.doodle, { top: 65, right: 20, fontSize: 16 }]}>🎂</Text>
      <Text style={[styles.doodle, { top: 140, left: 25, fontSize: 12 }]}>🍓</Text>
      <Text style={[styles.doodle, { top: 220, right: 15, fontSize: 14 }]}>🧁</Text>
      <Text style={[styles.doodle, { top: 310, left: 18, fontSize: 13 }]}>★</Text>
      <Text style={[styles.doodle, { top: 400, right: 28, fontSize: 15 }]}>🌸</Text>
      {density !== 'low' && (
        <>
          <Text style={[styles.doodle, { top: 490, left: 20, fontSize: 14 }]}>✨</Text>
          <Text style={[styles.doodle, { top: 570, right: 22, fontSize: 13 }]}>🎀</Text>
          <Text style={[styles.doodle, { top: 650, left: 28, fontSize: 15 }]}>🍰</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  doodle: {
    position: 'absolute',
    opacity: 0.25
  }
});
