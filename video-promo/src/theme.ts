import { loadFont } from '@remotion/fonts';
import { Easing, staticFile, useVideoConfig } from 'remotion';

// Fuentes alojadas en public/fonts (variables, subconjunto latino; incluye acentos y ñ).
const FONT_FILES = [
  { family: 'Cormorant Garamond', style: 'normal', weight: '300 700', file: 'fonts/CormorantGaramond-normal-latin.woff2' },
  { family: 'Cormorant Garamond', style: 'italic', weight: '300 700', file: 'fonts/CormorantGaramond-italic-latin.woff2' },
  { family: 'Cinzel', style: 'normal', weight: '400 900', file: 'fonts/Cinzel-normal-latin.woff2' },
];
for (const f of FONT_FILES) {
  loadFont({ family: f.family, style: f.style, weight: f.weight, url: staticFile(f.file), format: 'woff2' });
}

export const FONTS = {
  serif: "'Cormorant Garamond', Georgia, serif",
  display: "'Cinzel', Georgia, serif",
};

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export type Format = 'vertical' | 'square' | 'wide';

export type Layout = {
  format: Format;
  width: number;
  height: number;
  // Zona segura: márgenes libres para la interfaz de las redes sociales.
  safe: { top: number; bottom: number; side: number };
};

export const useLayout = (): Layout => {
  const { width, height } = useVideoConfig();
  const format: Format = height > width * 1.2 ? 'vertical' : width > height * 1.2 ? 'wide' : 'square';
  const safe =
    format === 'vertical'
      ? { top: 150, bottom: 250, side: 80 }
      : format === 'square'
        ? { top: 80, bottom: 90, side: 80 }
        : { top: 80, bottom: 90, side: 120 };
  return { format, width, height, safe };
};
