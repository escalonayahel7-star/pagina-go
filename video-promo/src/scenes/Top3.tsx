import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Backdrop, GoldRule, Grain, Label, Reveal, Rich, Vignette } from '../components';
import { COLORS, TEXT } from '../config';
import { EASE, FONTS, useLayout } from '../theme';

/** Escena 3 · TOP 3 — reconocimiento Scabal. */
export const Top3: React.FC = () => {
  const frame = useCurrentFrame();
  const l = useLayout();
  const vertical = l.format === 'vertical';
  const p = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const scale = interpolate(frame, [0, 30], [1.08, 1], { extrapolateRight: 'clamp', easing: EASE });
  const drift = interpolate(frame, [30, 150], [1, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const figureSize = vertical ? 270 : l.format === 'square' ? 220 : 230;

  return (
    <AbsoluteFill>
      <Backdrop glow={0.45} />
      <Vignette />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingTop: l.safe.top,
          paddingBottom: l.safe.bottom,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: figureSize,
            lineHeight: 1,
            opacity: p,
            transform: `scale(${scale * drift})`,
            background: `linear-gradient(180deg, ${COLORS.goldLight} 0%, ${COLORS.gold} 55%, ${COLORS.goldDeep} 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: `drop-shadow(0 0 ${30 * p}px rgba(201,168,76,0.25))`,
          }}
        >
          {TEXT.top3.figure}
        </div>
        <div style={{ height: vertical ? 70 : 44 }} />
        <GoldRule at={12} width={vertical ? 420 : 360} />
        <div style={{ height: vertical ? 60 : 40 }} />
        <Reveal at={18}>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 300,
              fontSize: vertical ? 66 : 56,
              lineHeight: 1.2,
              color: COLORS.text,
              textAlign: 'center',
              maxWidth: vertical ? 920 : 1200,
            }}
          >
            <Rich text={TEXT.top3.headline} />
          </div>
        </Reveal>
        <div style={{ height: vertical ? 70 : 44 }} />
        <Reveal at={32}>
          <Label parts={TEXT.top3.label} size={vertical ? 26 : 22} stacked={vertical} color={COLORS.muted} />
        </Reveal>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
