// AH@ Mobile — Brutalist Design Tokens for React Native StyleSheet
// Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
// React Native does not support CSS custom properties;
// all design tokens are defined here as JS constants.

export const Colors = {
  primary:     '#FFD700', // Yellow
  secondary:   '#001F5B', // Navy Blue
  bg:          '#FFFFFF',
  surface:     '#F0F0F0',
  border:      '#0A0A0A',
  textPrimary: '#0A0A0A',
  textInverse: '#FFFFFF',
  danger:      '#D00000',
  success:     '#006400',
} as const

export const Typography = {
  fontMono: 'IBMPlexMono-Regular',
  fontMonoBold: 'IBMPlexMono-Bold',
  fontSans: 'SpaceGrotesk-Regular',
  fontSansBold: 'SpaceGrotesk-Bold',
  sizeXs:   12,
  sizeSm:   14,
  sizeBase: 16,
  sizeLg:   18,
  sizeXl:   20,
  size2xl:  24,
  size3xl:  30,
} as const

export const Spacing = {
  s1:  4,
  s2:  8,
  s3:  12,
  s4:  16,
  s5:  24,
  s6:  32,
  s7:  48,
  s8:  64,
} as const

export const Borders = {
  width: 2,
  // React Native does not support box-shadow offset like CSS.
  // Use elevation (Android) + shadow props (iOS) for brutalist depth.
  shadowColor:   Colors.secondary,
  shadowOffsetX: 4,
  shadowOffsetY: 4,
  shadowOpacity: 1,
  shadowRadius:  0,
  elevation:     4,
} as const

// NOTE: React Native enforces borderRadius: 0 per component.
// Always set borderRadius: 0 in every StyleSheet entry.
export const BORDER_RADIUS = 0
