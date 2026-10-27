import React from 'react';
import { FramedPhoto, Headline } from '../components';
import { ASSETS, SCENES, TEXT } from '../config';
import { useLayout } from '../theme';
import { SplitScene, splitMetrics } from './layouts';

/** Escena 6 · Don Gilberto con sus hijos. */
export const Familia: React.FC = () => {
  const m = splitMetrics(useLayout());
  const duration = SCENES.familia.duration + 20;
  return (
    <SplitScene
      ambient={ASSETS.familia}
      duration={duration}
      photo={<FramedPhoto src={ASSETS.familia} width={m.photoW} height={m.photoH} duration={duration} focus="50% 30%" darken={0.18} />}
      text={(align, size) => <Headline lines={TEXT.familia.headline} size={size} at={14} stagger={16} align={align} />}
    />
  );
};
