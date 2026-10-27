import React from 'react';
import { FramedPhoto, Headline } from '../components';
import { ASSETS, SCENES, TEXT } from '../config';
import { useLayout } from '../theme';
import { SplitScene, splitMetrics } from './layouts';

/** Escena 2 · Don Gilberto en su taller. */
export const Taller: React.FC = () => {
  const m = splitMetrics(useLayout());
  const duration = SCENES.taller.duration + 20;
  return (
    <SplitScene
      ambient={ASSETS.taller}
      duration={duration}
      photo={<FramedPhoto src={ASSETS.taller} width={m.photoW} height={m.photoH} duration={duration} focus="45% 35%" darken={0.2} />}
      text={(align, size) => <Headline lines={TEXT.taller.headline} size={size} at={16} stagger={10} align={align} />}
    />
  );
};
