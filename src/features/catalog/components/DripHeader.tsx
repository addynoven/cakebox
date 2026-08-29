import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface DripHeaderProps {
  color?: string;
  height?: number;
}

export const DripHeader: React.FC<DripHeaderProps> = ({
  color = '#FFEBF0',
  height = 36
}) => {
  return (
    <View style={[styles.container, { height }]}>
      <Svg viewBox="0 0 1200 120" preserveAspectRatio="none" width="100%" height="100%">
        <Path
          d="M0,0 L1200,0 L1200,40 C1140,40 1120,95 1060,95 C1000,95 980,30 920,30 C860,30 840,110 780,110 C720,110 700,45 640,45 C580,45 560,115 500,115 C440,115 420,35 360,35 C300,35 280,105 220,105 C160,105 140,25 80,25 C40,25 20,60 0,60 Z"
          fill={color}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden'
  }
});
