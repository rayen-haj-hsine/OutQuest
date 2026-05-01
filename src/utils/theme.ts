export const fonts = {
  title: 'Cinzel_700Bold',
  subtitle: 'Cinzel_400Regular',
  body: 'Inter_400Regular',
  bodyBold: 'Inter_700Bold',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  s: 4,
  m: 8,
  l: 16,
  xl: 24,
};

export const shadows = {
  glow: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  }
};

export const darkColors = {
  background: '#0F0F12', // Deeper obsidian
  card: '#1A1A1F',
  primary: '#D4AF37',   // Classic Gold
  secondary: '#8E2424', // Blood Crimson
  accent: '#4A90E2',    // Spirit Blue
  text: '#F5F5F7',
  textMuted: '#A1A1A6',
  danger: '#E53E3E',
  success: '#38A169',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  border: '#2D2D35',
};

export const lightColors = {
  background: '#CFC5B4', // Very aged, dark parchment
  card: '#C3B8A5',       // Even darker for cards
  primary: '#8B6508',    // Deep dark gold/bronze
  secondary: '#721C1C',  // Dark blood crimson
  accent: '#3A70B2',     // Deep spirit blue
  text: '#1A1815',       // Very dark brown/black ink
  textMuted: '#555047',  // Muted ink
  danger: '#B71C1C',
  success: '#1B5E20',
  gold: '#B8860B',       // Dark goldenrod
  silver: '#8A8A8A',
  bronze: '#8C5A2B',
  border: '#AFA38F',     // Soft, dark border
};

export const theme = {
  colors: darkColors,
  fonts,
  spacing,
  borderRadius,
  shadows,
};

export type ThemeType = typeof theme;
