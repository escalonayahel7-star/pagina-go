import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Headline, KenBurns } from '../components';
import { OFICIO_PHOTO_STARTS, OFICIO_PHOTOS, SCENES, TEXT } from '../config';
import { useLayout } from '../theme';
import { SplitScene, splitMetrics } from './layouts';

const FADE = 14;

/** Escena 4 · Tres fotos del oficio en secuencia. */
export const Oficio: React.FC = () => {
  const frame = useCurrentFrame();
  const l = useLayout();
  const m = splitMetrics(l);
  const w = m.photoW;
  const h = l.format === 'vertical' ? 820 : m.photoH;
  const end = SCENES.oficio.duration + 20;

  const photo = (
    <div style={{ position: 'relative', width: w, height: h }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          outline: '1px solid rgba(201,168,76,0.45)',
          boxShadow: '0 40px 90px rgba(0,0,0,0.75)',
          background: '#000',
        }}
      >
        {OFICIO_PHOTOS.map((ph, i) => {
          const start = OFICIO_PHOTO_STARTS[i];
          const next = OFICIO_PHOTO_STARTS[i + 1] ?? end;
          // la foto siguiente entra encima con fundido; la anterior sigue debajo
          const opacity = interpolate(frame, [start, start + FADE], [i === 0 ? 1 : 0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          if (frame < start || frame > next + FADE) return null;
          return (
            <div key={ph.src} style={{ position: 'absolute', inset: 0, opacity }}>
              <KenBurns src={ph.src} start={start} duration={next - start + FADE} focus={ph.focus} darken={0.22} />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', inset: -18, border: '1px solid rgba(201,168,76,0.22)' }} />
    </div>
  );

  return (
    <SplitScene
      duration={end}
      photo={photo}
      text={(align, size) => <Headline lines={TEXT.oficio.headline} size={size * 1.12} at={12} stagger={12} align={align} />}
    />
  );
};
