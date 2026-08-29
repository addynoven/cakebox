import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  displayLg: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  displayMd: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  headlineLg: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  headlineMd: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  titleMd: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  bodyLg: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  bodyMd: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  bodySm: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  labelCaps: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  caption: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
  },
};
