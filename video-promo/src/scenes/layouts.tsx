import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Backdrop, Grain, KenBurns, Vignette } from '../components';
import { Layout, useLayout } from '../theme';

/** Tamaño de foto y de titular según el formato. */
export const splitMetrics = (l: Layout) => {
  if (l.format === 'vertical') return { photoW: 920, photoH: 740, headline: 72, gap: 120 };
  if (l.format === 'square') return { photoW: 820, photoH: 470, headline: 56, gap: 70 };
  return { photoW: 880, photoH: 560, headline: 58, gap: 90 };
};

/**
 * Foto arriba y texto abajo (vertical / cuadrado) o foto a la izquierda y texto
 * a la derecha (horizontal). Debajo va la misma foto desenfocada como ambiente.
 */
export const SplitScene: React.FC<{
  ambient?: string;
  duration: number;
  photo: React.ReactNode;
  text: (align: 'center' | 'left', size: number) => React.ReactNode;
}> = ({ ambient, duration, photo, text }) => {
  const l = useLayout();
  const m = splitMetrics(l);
  const wide = l.format === 'wide';
  const usableTop = l.safe.top;
  const usableH = l.height - l.safe.top - l.safe.bottom;
  return (
    <AbsoluteFill>
      <Backdrop glow={0.35} />
      {ambient ? (
        <KenBurns src={ambient} duration={duration} blur={40} darken={0.82} from={1.15} to={1.22} />
      ) : null}
      <Vignette strength={0.85} />
      <div
        style={{
          position: 'absolute',
          left: l.safe.side,
          right: l.safe.side,
          top: usableTop,
          height: usableH,
          display: 'flex',
          flexDirection: wide ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: m.gap,
        }}
      >
        <div style={{ flex: 'none' }}>{photo}</div>
        <div style={{ flex: wide ? 1 : 'none', minWidth: 0 }}>{text(wide ? 'left' : 'center', m.headline)}</div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
