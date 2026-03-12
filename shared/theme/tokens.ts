export const colorTokens = {
  background: '#FFFFFF',
  divider: '#E5E5E5',
  error: '#DC2626',
  primary: '#E91E8C',
  secondary: '#1E6FE9',
  text: '#0D0D0D',
  warning: '#F59E0B',
} as const;

export const typographyTokens = {
  bodyFontFamily: '"Source Sans 3", sans-serif',
  headingFontFamily: '"DM Sans", sans-serif',
} as const;

export const shapeTokens = {
  borderRadius: 12,
} as const;

export const themeTokens = {
  colors: colorTokens,
  shape: shapeTokens,
  typography: typographyTokens,
} as const;

