import { createTheme } from '@mui/material/styles';

import { themeTokens } from '../../../shared/theme/tokens';

export const webTheme = createTheme({
  palette: {
    background: {
      default: themeTokens.colors.background,
      paper: themeTokens.colors.background,
    },
    divider: themeTokens.colors.divider,
    error: {
      main: themeTokens.colors.error,
    },
    primary: {
      main: themeTokens.colors.primary,
    },
    secondary: {
      main: themeTokens.colors.secondary,
    },
    text: {
      primary: themeTokens.colors.text,
    },
    warning: {
      main: themeTokens.colors.warning,
    },
  },
  shape: {
    borderRadius: themeTokens.shape.borderRadius,
  },
  typography: {
    fontFamily: themeTokens.typography.bodyFontFamily,
    h1: {
      fontFamily: themeTokens.typography.headingFontFamily,
    },
    h2: {
      fontFamily: themeTokens.typography.headingFontFamily,
    },
    h3: {
      fontFamily: themeTokens.typography.headingFontFamily,
    },
    h4: {
      fontFamily: themeTokens.typography.headingFontFamily,
    },
    h5: {
      fontFamily: themeTokens.typography.headingFontFamily,
    },
    h6: {
      fontFamily: themeTokens.typography.headingFontFamily,
    },
  },
});

