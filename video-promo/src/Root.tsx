import React from 'react';
import { Composition } from 'remotion';
import { DURATION, FPS } from './config';
import { Promo } from './Promo';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="GOHPromo" component={Promo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
    <Composition id="GOHPromoSquare" component={Promo} durationInFrames={DURATION} fps={FPS} width={1080} height={1080} />
    <Composition id="GOHPromoWide" component={Promo} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
  </>
);
