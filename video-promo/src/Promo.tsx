import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { AUDIO_FADE_OUT_FROM, CROSSFADE, DURATION, SCENES, SFX } from './config';
import { Apertura } from './scenes/Apertura';
import { Casas } from './scenes/Casas';
import { Cierre } from './scenes/Cierre';
import { Familia } from './scenes/Familia';
import { Oficio } from './scenes/Oficio';
import { Taller } from './scenes/Taller';
import { Top3 } from './scenes/Top3';
import { Web } from './scenes/Web';

const ORDER: { key: keyof typeof SCENES; Component: React.FC }[] = [
  { key: 'apertura', Component: Apertura },
  { key: 'taller', Component: Taller },
  { key: 'top3', Component: Top3 },
  { key: 'oficio', Component: Oficio },
  { key: 'casas', Component: Casas },
  { key: 'familia', Component: Familia },
  { key: 'web', Component: Web },
  { key: 'cierre', Component: Cierre },
];

const FINAL_FADE = 18;

/** Cada escena entra con fundido sobre la anterior, que se prolonga CROSSFADE frames mientras se apaga. */
const Fade: React.FC<{ duration: number; first: boolean; last: boolean; children: React.ReactNode }> = ({
  duration,
  first,
  last,
  children,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = first ? 1 : interpolate(frame, [0, CROSSFADE], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = last
    ? interpolate(frame, [duration - FINAL_FADE, duration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(frame, [duration, duration + CROSSFADE], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>{children}</AbsoluteFill>;
};

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    {ORDER.map(({ key, Component }, i) => {
      const { from, duration } = SCENES[key];
      const last = i === ORDER.length - 1;
      return (
        <Sequence key={key} name={key} from={from} durationInFrames={last ? duration : duration + CROSSFADE}>
          <Fade duration={duration} first={i === 0} last={last}>
            <Component />
          </Fade>
        </Sequence>
      );
    })}
    {SFX.map((s, i) => (
      <Sequence key={i} name={`sfx ${s.note}`} from={s.frame} durationInFrames={DURATION - s.frame} layout="none">
        <Audio
          src={staticFile(s.file)}
          volume={(f) =>
            s.volume *
            interpolate(s.frame + f, [AUDIO_FADE_OUT_FROM, DURATION], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      </Sequence>
    ))}
  </AbsoluteFill>
);
