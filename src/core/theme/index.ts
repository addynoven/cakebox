export * from './colors';
export * from './spacing';
export * from './typography';
export * from './shadows';

// Backward compatibility with legacy utils/theme.ts
import { colors } from './colors';
import { shadows } from './shadows';
export const COLORS = colors;
export const SHADOWS = shadows;
