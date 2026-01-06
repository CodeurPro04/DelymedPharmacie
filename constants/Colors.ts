// constants/Colors.ts
export const Colors = {
  // Palette médicale bleue
  primary: '#1A73E8',
  primaryLight: '#E8F0FE',
  primaryDark: '#0D47A1',
  
  secondary: '#00C853',
  secondaryLight: '#E8F5E9',
  
  accent: '#FF6B35',
  accentLight: '#FFF3E0',
  
  // Neutres
  white: '#FFFFFF',
  background: '#F8F9FA',
  lightGray: '#F5F5F5',
  mediumGray: '#E0E0E0',
  gray: '#9E9E9E',
  darkGray: '#424242',
  black: '#212121',
  
  // États
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  
  // Transparents
  overlay: 'rgba(0, 0, 0, 0.5)',
  primaryTransparent: 'rgba(26, 115, 232, 0.1)',
} as const;

export type ColorKey = keyof typeof Colors;
export default Colors;