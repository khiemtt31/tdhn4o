// ============================================
// BRAND COLOR UTILITIES
// ============================================

export const brandColors = {
  primary: {
    dark: '#662222',
    medium: '#842A3B',
    light: '#A3485A',
  },
  accent: '#F5DAA7',
  neutrals: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
} as const;

export type BrandColor = typeof brandColors;

// Helper functions for color manipulation
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simple contrast calculation (would need proper implementation for WCAG)
  // For now, return a placeholder
  return 4.5;
};

export const isAccessible = (foreground: string, background: string): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA normal text
};

export const getAccessibleTextColor = (background: string): string => {
  // Simple logic: if background is dark, return light text
  const isDark = background.startsWith('#') && parseInt(background.slice(1, 3), 16) < 128;
  return isDark ? brandColors.neutrals.white : brandColors.primary.dark;
};

// Color palette for components
export const componentColors = {
  button: {
    primary: {
      background: brandColors.primary.dark,
      hover: brandColors.primary.medium,
      text: brandColors.neutrals.white,
    },
    secondary: {
      background: brandColors.primary.medium,
      hover: brandColors.primary.light,
      text: brandColors.neutrals.white,
    },
    accent: {
      background: brandColors.accent,
      hover: 'rgba(245, 218, 167, 0.9)',
      text: brandColors.primary.dark,
    },
  },
  input: {
    border: brandColors.neutrals.gray[300],
    focus: brandColors.primary.light,
    error: '#DC2626',
  },
  card: {
    background: brandColors.neutrals.white,
    border: brandColors.neutrals.gray[200],
    hover: brandColors.primary.light,
  },
} as const;