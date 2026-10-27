import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Backdrop, CornerFrame, GoldRule, Grain, Label, Reveal, Sheen, Vignette } from '../components';
import { ASSETS, TEXT } from '../config';
import { EASE, useLayout } from '../theme';

const LOGO_RATIO = 929 / 393;

/** Escena 1 · Logo con marco de esquinas doradas y la etiqueta de legado. */
export const Apertura: React.FC = () => {
  const frame = useCurrentFrame();
  const l = useLayout();
  const vertical = l.format === 'vertical';
  const logoW = vertical ? 780 : l.format === 'square' ? 680 : 720;
  const logoH = logoW / LOGO_RATIO;
  const p = interpolate(frame, [0, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const scale = interpolate(frame, [0, 105], [0.965, 1.02], { extrapolateRight: 'clamp' });
  const logoSrc = staticFile(ASSETS.logo);

  return (
    <AbsoluteFill>
      <Backdrop glow={0.9} />
      <Vignette />
      <CornerFrame inset={vertical ? 70 : 56} arm={vertical ? 110 : 90} at={0} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div
          style={{
            position: 'relative',
            width: logoW,
            height: logoH,
            opacity: p,
            transform: `scale(${scale})`,
            filter: `blur(${(1 - p) * 6}px) drop-shadow(0 0 30px rgba(201,168,76,0.18))`,
          }}
        >
          <Img src={logoSrc} style={{ width: '100%', height: '100%' }} />
          <Sheen at={4} duration={40} mask={logoSrc} />
        </div>
        <div style={{ height: vertical ? 120 : 70 }} />
        <Reveal at={20} duration={18}>
          <Label parts={TEXT.apertura.label} size={vertical ? 34 : 26} stacked={vertical} />
        </Reveal>
        <div style={{ height: vertical ? 70 : 44 }} />
        <GoldRule at={34} width={vertical ? 130 : 90} vertical />
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
