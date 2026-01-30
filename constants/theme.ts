/**
 * Super Fintech Theme - OLED Deep Black with Glassmorphism
 * Premium "Verdict-First" aesthetic with Inter typography
 */

import { Platform } from 'react-native';

// Super Fintech Palette - OLED Deep Black
const palette = {
  // Core
  background: '#000000',        // OLED Pure Black
  surface: 'rgba(255,255,255,0.05)', // Glassmorphism surface
  surfaceElevated: 'rgba(255,255,255,0.08)',

  // Accents
  superMint: '#00FF85',         // Primary - Verdict accent
  neonPurple: '#7000FF',        // Secondary - Milestones

  // Text
  white: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.5)',
  textDisabled: 'rgba(255,255,255,0.3)',

  // Semantic
  success: '#00FF85',
  warning: '#FFB800',
  error: '#FF4444',
};

export const Colors = {
  light: {
    text: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textMuted: palette.textMuted,
    background: palette.background,
    surface: palette.surface,
    surfaceElevated: palette.surfaceElevated,
    tint: palette.superMint,
    icon: palette.textMuted,
    tabIconDefault: palette.textMuted,
    tabIconSelected: palette.superMint,
    primary: palette.superMint,
    secondary: palette.neonPurple,
    card: palette.surface,
    border: 'rgba(255,255,255,0.1)',
  },
  dark: {
    text: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textMuted: palette.textMuted,
    background: palette.background,
    surface: palette.surface,
    surfaceElevated: palette.surfaceElevated,
    tint: palette.superMint,
    icon: palette.textMuted,
    tabIconDefault: palette.textMuted,
    tabIconSelected: palette.superMint,
    primary: palette.superMint,
    secondary: palette.neonPurple,
    card: palette.surface,
    border: 'rgba(255,255,255,0.1)',
  },
};

// Global border radius
export const BorderRadius = {
  card: 24,
  container: 20,
  button: 16,
  input: 16,
  badge: 8,
};

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography - Inter font with tight letter spacing for headers
export const Typography = {
  // Display - Large verdicts
  displayLarge: {
    fontSize: 64,
    fontWeight: '800' as const,
    letterSpacing: -2,
    lineHeight: 72,
  },
  displayMedium: {
    fontSize: 48,
    fontWeight: '700' as const,
    letterSpacing: -1.5,
    lineHeight: 56,
  },

  // Headlines
  headlineLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  headlineMedium: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  headlineSmall: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 28,
  },

  // Body
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 18,
  },

  // Labels
  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 20,
    textTransform: 'uppercase' as const,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 1,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
  },
};

// Inter font family configuration
export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    sansBold: 'Inter-Bold',
    sansLight: 'Inter-Light',
    mono: 'SF Mono',
    // Fallback to system if Inter not loaded
    system: '-apple-system',
  },
  android: {
    sans: 'Inter',
    sansBold: 'Inter-Bold',
    sansLight: 'Inter-Light',
    mono: 'monospace',
    system: 'Roboto',
  },
  default: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    sansBold: 'Inter-Bold, system-ui, sans-serif',
    sansLight: 'Inter-Light, system-ui, sans-serif',
    mono: 'SF Mono, Menlo, monospace',
    system: 'system-ui, sans-serif',
  },
});

// Glassmorphism effects
export const Glass = {
  surface: {
    backgroundColor: palette.surface,
  },
  elevated: {
    backgroundColor: palette.surfaceElevated,
  },
  blur: 'md' as const, // For backdrop-blur-md equivalent
  blurIntensity: 40,   // For expo-blur BlurView
};
