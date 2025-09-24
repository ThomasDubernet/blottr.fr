/**
 * Blottr Design System - Design Tokens
 *
 * Comprehensive design tokens for consistent UI/UX across the platform.
 * Provides type-safe access to colors, typography, spacing, and component specifications.
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Breakpoint keys for responsive design
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'large';

/**
 * Color palette scale (50-900)
 */
export type ColorScale = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

/**
 * Semantic color variants
 */
export type SemanticScale = '400' | '500' | '600';

/**
 * Typography scale keys
 */
export type TypographyScale = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'button';

/**
 * Spacing scale keys
 */
export type SpacingScale = '0' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * Shadow levels
 */
export type ShadowLevel = 'level1' | 'level2' | 'level3' | 'level4';

/**
 * Border radius variants
 */
export type RadiusScale = 'none' | 'sm' | 'md' | 'lg' | 'pill' | 'full';

/**
 * Component state variants
 */
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled';

/**
 * Responsive value configuration
 */
export interface ResponsiveValue<T> {
  mobile: T;
  tablet?: T;
  desktop?: T;
  large?: T;
}

/**
 * Typography configuration per breakpoint
 */
export interface TypographyConfig {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: number;
  fontFamily: string;
}

/**
 * Component padding configuration
 */
export interface PaddingConfig {
  vertical: number;
  horizontal: number;
}

/**
 * Component state configuration
 */
export interface ComponentStateConfig {
  backgroundColor: string;
  textColor: string;
}

/**
 * Button component specification
 */
export interface ButtonTokens {
  borderRadius: RadiusScale;
  typography: TypographyScale;
  padding: ResponsiveValue<PaddingConfig>;
  states: Record<ComponentState, ComponentStateConfig>;
}

/**
 * Card component specification
 */
export interface CardTokens {
  borderRadius: RadiusScale;
  shadow: ShadowLevel;
  padding: ResponsiveValue<PaddingConfig>;
  backgroundColor: string;
  borderColor: string;
}

/**
 * Input component specification
 */
export interface InputTokens {
  borderRadius: RadiusScale;
  typography: TypographyScale;
  padding: ResponsiveValue<PaddingConfig>;
  borderWidth: number;
  states: {
    default: { borderColor: string; backgroundColor: string };
    focus: { borderColor: string; backgroundColor: string };
    error: { borderColor: string; backgroundColor: string };
    disabled: { borderColor: string; backgroundColor: string };
  };
}

// ============================================================================
// DESIGN TOKENS
// ============================================================================

/**
 * Responsive breakpoints in pixels
 */
export const breakpoints = {
  mobile: 0,
  tablet: 600,
  desktop: 1024,
  large: 1440,
} as const;

/**
 * Color system with palette and semantic aliases
 */
export const colors = {
  palette: {
    primary: {
      '50': '#f5f5f5',
      '100': '#eeeeee',
      '200': '#e0e0e0',
      '300': '#bdbdbd',
      '400': '#9e9e9e',
      '500': '#616161',
      '600': '#424242',
      '700': '#212121',
      '800': '#121212',
      '900': '#000000',
    },
    accent: {
      '50': '#fff5f5',
      '100': '#ffe5e5',
      '200': '#ffcccc',
      '300': '#ff9999',
      '400': '#ff6666',
      '500': '#ff4d4d',
      '600': '#ff3333',
      '700': '#e60023',
      '800': '#b3001b',
      '900': '#800015',
    },
    secondary: {
      '50': '#fff8e1',
      '100': '#ffecb3',
      '200': '#ffe082',
      '300': '#ffd54f',
      '400': '#ffca28',
      '500': '#ffc107',
      '600': '#ffb300',
      '700': '#ffa000',
      '800': '#ff8f00',
      '900': '#ff6f00',
    },
    neutral: {
      '50': '#fafafa',
      '100': '#f5f5f5',
      '200': '#eeeeee',
      '300': '#e0e0e0',
      '400': '#bdbdbd',
      '500': '#9e9e9e',
      '600': '#757575',
      '700': '#616161',
      '800': '#424242',
      '900': '#212121',
    },
    success: {
      '400': '#66bb6a',
      '500': '#4caf50',
      '600': '#388e3c',
    },
    warning: {
      '400': '#ffa726',
      '500': '#ff9800',
      '600': '#f57c00',
    },
    error: {
      '400': '#ef5350',
      '500': '#f44336',
      '600': '#d32f2f',
    },
  },
  aliases: {
    textPrimary: '#212121',
    textSecondary: '#616161',
    background: '#ffffff',
    surface: '#fafafa',
    divider: '#e0e0e0',
    onPrimary: '#ffffff',
    onAccent: '#ffffff',
    onSecondary: '#212121',
  },
} as const;

/**
 * Typography system with font families and responsive scales
 */
export const typography = {
  fontFamily: {
    primary: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    secondary: "'Playfair Display', 'Georgia', serif",
    mono: "'Source Code Pro', monospace",
  },
  scale: {
    h1: {
      mobile: { fontSize: 32, lineHeight: 40, letterSpacing: -0.5, fontWeight: 700, fontFamily: 'primary' },
      tablet: { fontSize: 40, lineHeight: 48, letterSpacing: -0.5, fontWeight: 700, fontFamily: 'primary' },
      desktop: { fontSize: 48, lineHeight: 56, letterSpacing: -1, fontWeight: 700, fontFamily: 'primary' },
    },
    h2: {
      mobile: { fontSize: 28, lineHeight: 36, letterSpacing: -0.5, fontWeight: 600, fontFamily: 'primary' },
      tablet: { fontSize: 32, lineHeight: 40, letterSpacing: -0.5, fontWeight: 600, fontFamily: 'primary' },
      desktop: { fontSize: 36, lineHeight: 44, letterSpacing: -0.5, fontWeight: 600, fontFamily: 'primary' },
    },
    h3: {
      mobile: { fontSize: 24, lineHeight: 32, letterSpacing: 0, fontWeight: 600, fontFamily: 'primary' },
      tablet: { fontSize: 28, lineHeight: 36, letterSpacing: 0, fontWeight: 600, fontFamily: 'primary' },
      desktop: { fontSize: 32, lineHeight: 40, letterSpacing: 0, fontWeight: 600, fontFamily: 'primary' },
    },
    h4: {
      mobile: { fontSize: 20, lineHeight: 28, letterSpacing: 0, fontWeight: 600, fontFamily: 'primary' },
      tablet: { fontSize: 24, lineHeight: 32, letterSpacing: 0, fontWeight: 600, fontFamily: 'primary' },
      desktop: { fontSize: 28, lineHeight: 36, letterSpacing: 0, fontWeight: 600, fontFamily: 'primary' },
    },
    h5: {
      mobile: { fontSize: 18, lineHeight: 26, letterSpacing: 0, fontWeight: 500, fontFamily: 'primary' },
      tablet: { fontSize: 20, lineHeight: 28, letterSpacing: 0, fontWeight: 500, fontFamily: 'primary' },
      desktop: { fontSize: 24, lineHeight: 32, letterSpacing: 0, fontWeight: 500, fontFamily: 'primary' },
    },
    h6: {
      mobile: { fontSize: 16, lineHeight: 24, letterSpacing: 0, fontWeight: 500, fontFamily: 'primary' },
      tablet: { fontSize: 18, lineHeight: 26, letterSpacing: 0, fontWeight: 500, fontFamily: 'primary' },
      desktop: { fontSize: 20, lineHeight: 28, letterSpacing: 0, fontWeight: 500, fontFamily: 'primary' },
    },
    body1: {
      mobile: { fontSize: 16, lineHeight: 24, letterSpacing: 0, fontWeight: 400, fontFamily: 'primary' },
      tablet: { fontSize: 16, lineHeight: 24, letterSpacing: 0, fontWeight: 400, fontFamily: 'primary' },
      desktop: { fontSize: 16, lineHeight: 24, letterSpacing: 0, fontWeight: 400, fontFamily: 'primary' },
    },
    body2: {
      mobile: { fontSize: 14, lineHeight: 20, letterSpacing: 0, fontWeight: 400, fontFamily: 'primary' },
      tablet: { fontSize: 14, lineHeight: 20, letterSpacing: 0, fontWeight: 400, fontFamily: 'primary' },
      desktop: { fontSize: 14, lineHeight: 20, letterSpacing: 0, fontWeight: 400, fontFamily: 'primary' },
    },
    caption: {
      mobile: { fontSize: 12, lineHeight: 16, letterSpacing: 0.5, fontWeight: 400, fontFamily: 'primary' },
      tablet: { fontSize: 12, lineHeight: 16, letterSpacing: 0.5, fontWeight: 400, fontFamily: 'primary' },
      desktop: { fontSize: 12, lineHeight: 16, letterSpacing: 0.5, fontWeight: 400, fontFamily: 'primary' },
    },
    button: {
      mobile: { fontSize: 14, lineHeight: 20, letterSpacing: 0.5, fontWeight: 500, fontFamily: 'primary' },
      tablet: { fontSize: 14, lineHeight: 20, letterSpacing: 0.5, fontWeight: 500, fontFamily: 'primary' },
      desktop: { fontSize: 14, lineHeight: 20, letterSpacing: 0.5, fontWeight: 500, fontFamily: 'primary' },
    },
  },
} as const;

/**
 * Spacing system with consistent scale and layout utilities
 */
export const spacing = {
  scale: {
    '0': 0,
    'xs': 4,
    'sm': 8,
    'md': 16,
    'lg': 24,
    'xl': 32,
    '2xl': 40,
    '3xl': 64,
  },
  layout: {
    gutter: {
      mobile: 16,
      tablet: 24,
      desktop: 32,
    },
    containerPadding: {
      mobile: 16,
      tablet: 32,
      desktop: 64,
    },
  },
} as const;

/**
 * Border radius system
 */
export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  pill: 50,
  full: 9999,
} as const;

/**
 * Shadow system with multiple elevation levels
 */
export const shadows = {
  level1: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  level2: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  level3: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  level4: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
} as const;

/**
 * Component-specific token specifications
 */
export const components = {
  button: {
    borderRadius: 'md' as RadiusScale,
    typography: 'button' as TypographyScale,
    padding: {
      mobile: { vertical: 8, horizontal: 16 },
      tablet: { vertical: 10, horizontal: 20 },
      desktop: { vertical: 12, horizontal: 24 },
    },
    states: {
      default: { backgroundColor: 'palette.primary.800', textColor: 'aliases.onPrimary' },
      hover: { backgroundColor: 'palette.primary.700', textColor: 'aliases.onPrimary' },
      active: { backgroundColor: 'palette.primary.900', textColor: 'aliases.onPrimary' },
      disabled: { backgroundColor: 'palette.neutral.200', textColor: 'palette.neutral.500' },
    },
  } as ButtonTokens,
  card: {
    borderRadius: 'lg' as RadiusScale,
    shadow: 'level2' as ShadowLevel,
    padding: {
      mobile: { vertical: 16, horizontal: 16 },
      tablet: { vertical: 20, horizontal: 20 },
      desktop: { vertical: 24, horizontal: 24 },
    },
    backgroundColor: 'aliases.surface',
    borderColor: 'palette.neutral.200',
  } as CardTokens,
  input: {
    borderRadius: 'md' as RadiusScale,
    typography: 'body1' as TypographyScale,
    padding: {
      mobile: { vertical: 8, horizontal: 12 },
      tablet: { vertical: 10, horizontal: 14 },
      desktop: { vertical: 12, horizontal: 16 },
    },
    borderWidth: 1,
    states: {
      default: { borderColor: 'palette.neutral.300', backgroundColor: 'aliases.background' },
      focus: { borderColor: 'palette.primary.500', backgroundColor: 'aliases.background' },
      error: { borderColor: 'palette.error.500', backgroundColor: 'aliases.background' },
      disabled: { borderColor: 'palette.neutral.200', backgroundColor: 'palette.neutral.50' },
    },
  } as InputTokens,
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a responsive value for the current breakpoint
 * Falls back to mobile if specific breakpoint value doesn't exist
 *
 * @param values - Responsive value object
 * @param breakpoint - Target breakpoint
 * @returns The value for the specified breakpoint
 */
export function getResponsiveValue<T>(
  values: ResponsiveValue<T>,
  breakpoint: Breakpoint = 'mobile'
): T {
  return values[breakpoint] ?? values.mobile;
}

/**
 * Get typography configuration for a specific scale and breakpoint
 *
 * @param scale - Typography scale (h1, h2, body1, etc.)
 * @param breakpoint - Target breakpoint
 * @returns Typography configuration object
 */
export function getTypography(
  scale: TypographyScale,
  breakpoint: Breakpoint = 'mobile'
): TypographyConfig {
  return getResponsiveValue(typography.scale[scale], breakpoint);
}

/**
 * Get spacing value by scale key
 *
 * @param scale - Spacing scale key
 * @returns Spacing value in pixels
 */
export function getSpacing(scale: SpacingScale): number {
  return spacing.scale[scale];
}

/**
 * Get color value from nested path (e.g., 'palette.primary.500')
 *
 * @param path - Dot-separated path to color value
 * @returns Color hex value or undefined if path doesn't exist
 */
export function getColor(path: string): string | undefined {
  const parts = path.split('.');
  let current: any = colors;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Get border radius value by scale key
 *
 * @param scale - Radius scale key
 * @returns Border radius value in pixels
 */
export function getRadius(scale: RadiusScale): number {
  return radii[scale];
}

/**
 * Get shadow CSS value by level
 *
 * @param level - Shadow level
 * @returns CSS box-shadow value
 */
export function getShadow(level: ShadowLevel): string {
  return shadows[level];
}

/**
 * Generate CSS custom properties from design tokens
 * Useful for integrating with CSS-in-JS or CSS custom properties
 *
 * @returns Object with CSS custom property names and values
 */
export function generateCSSVariables(): Record<string, string | number> {
  const variables: Record<string, string | number> = {};

  // Add color variables
  Object.entries(colors.palette).forEach(([paletteName, palette]) => {
    Object.entries(palette).forEach(([scale, color]) => {
      variables[`--color-${paletteName}-${scale}`] = color;
    });
  });

  Object.entries(colors.aliases).forEach(([alias, color]) => {
    variables[`--color-${alias}`] = color;
  });

  // Add spacing variables
  Object.entries(spacing.scale).forEach(([scale, value]) => {
    variables[`--spacing-${scale}`] = `${value}px`;
  });

  // Add typography variables
  Object.entries(typography.fontFamily).forEach(([family, value]) => {
    variables[`--font-${family}`] = value;
  });

  // Add radius variables
  Object.entries(radii).forEach(([scale, value]) => {
    variables[`--radius-${scale}`] = `${value}px`;
  });

  // Add shadow variables
  Object.entries(shadows).forEach(([level, value]) => {
    variables[`--shadow-${level}`] = value;
  });

  return variables;
}

/**
 * Check if current viewport matches breakpoint
 * Client-side only function for responsive behavior
 *
 * @param breakpoint - Breakpoint to check
 * @returns Boolean indicating if viewport matches
 */
export function matchesBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false;

  const width = window.innerWidth;
  const bp = breakpoints[breakpoint];
  const nextBp = getNextBreakpoint(breakpoint);

  if (nextBp === null) {
    return width >= bp;
  }

  return width >= bp && width < breakpoints[nextBp];
}

/**
 * Get the next breakpoint in the sequence
 *
 * @param current - Current breakpoint
 * @returns Next breakpoint or null if at the end
 */
function getNextBreakpoint(current: Breakpoint): Breakpoint | null {
  const order: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'large'];
  const currentIndex = order.indexOf(current);
  return currentIndex < order.length - 1 ? order[currentIndex + 1] : null;
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  Breakpoint,
  ColorScale,
  SemanticScale,
  TypographyScale,
  SpacingScale,
  ShadowLevel,
  RadiusScale,
  ComponentState,
  ResponsiveValue,
  TypographyConfig,
  PaddingConfig,
  ComponentStateConfig,
  ButtonTokens,
  CardTokens,
  InputTokens,
};