import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'label' | 'display' | 'muted';
};

/**
 * ThemedText - Text component with Inter typography and overflow protection.
 * All text has flexShrink: 1 to prevent layout breaking.
 */
export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  numberOfLines,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.base,
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'label' ? styles.label : undefined,
        type === 'display' ? styles.display : undefined,
        type === 'muted' ? styles.muted : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // Base style applied to ALL text - prevents overflow
  base: {
    flexShrink: 1,
  },

  default: {
    ...Typography.bodyMedium,
  },

  defaultSemiBold: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },

  title: {
    ...Typography.headlineLarge,
  },

  subtitle: {
    ...Typography.headlineSmall,
  },

  link: {
    ...Typography.bodyMedium,
    color: '#00FF85',
    textDecorationLine: 'underline',
  },

  label: {
    ...Typography.labelMedium,
    color: 'rgba(255,255,255,0.5)',
  },

  display: {
    ...Typography.displayMedium,
    color: '#00FF85',
  },

  muted: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.5)',
  },
});
