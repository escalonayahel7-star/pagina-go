import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Backdrop, CornerFrame, GoldRule, Grain, Reveal, Sheen, Vignette } from '../components';
import { ASSETS, COLORS, SFX, SCENES, TEXT } from '../config';
import { EASE, FONTS, useLayout } from '../theme';

const LOGO_RATIO = 929 / 393;

// El botón aparece con el clic y el brillo cruza con el destello final (ver SFX en config).
const sfxAt = (file: string, fallback: number) =>
  (SFX.find((s) => s.file.includes(file))?.frame ?? SCENES.cierre.from + fallback) - SCENES.cierre.from;

/** Escena 8 · Logo, botón de cita y dirección de la página. */
export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const l = useLayout();
  const vertical = l.format === 'vertical';
  const buttonAt = sfxAt('clic', 30);
  const sheenAt = sfxAt('shimmer-final', 55);

  const logoW = vertical ? 620 : l.format === 'square' ? 520 : 500;
  const logoP = interpolate(frame, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const btnP = interpolate(frame, [buttonAt, buttonAt + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const btnSize = vertical ? 38 : 30;

  return (
    <AbsoluteFill>
      <Backdrop glow={0.85} />
      <Vignette />
      <CornerFrame inset={vertical ? 70 : 56} arm={vertical ? 110 : 90} at={0} />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingTop: l.safe.top,
          paddingBottom: l.safe.bottom,
        }}
      >
        <Img
          src={staticFile(ASSETS.logo)}
          style={{
            width: logoW,
            height: logoW / LOGO_RATIO,
            opacity: logoP,
            filter: `blur(${(1 - logoP) * 5}px) drop-shadow(0 0 30px rgba(201,168,76,0.15))`,
          }}
        />
        <div style={{ height: vertical ? 130 : 70 }} />
        {/* botón dorado con doble filo, como en la página */}
        <div
          style={{
            opacity: btnP,
            transform: `scale(${0.94 + 0.06 * btnP})`,
            padding: 7,
            border: `1px solid rgba(201,168,76,0.75)`,
          }}
        >
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: `linear-gradient(180deg, ${COLORS.goldLight} 0%, ${COLORS.gold} 60%, #B8963E 100%)`,
              padding: vertical ? '40px 84px' : '30px 70px',
              boxShadow: `0 0 ${60 * btnP}px rgba(201,168,76,0.30)`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.serif,
                fontWeight: 600,
                fontSize: btnSize,
                letterSpacing: '0.35em',
                marginRight: '-0.35em',
                textTransform: 'uppercase',
                color: '#141008',
                whiteSpace: 'nowrap',
              }}
            >
              {TEXT.cierre.button}
            </div>
            <Sheen at={sheenAt} duration={36} opacity={0.75} />
          </div>
        </div>
        <div style={{ height: vertical ? 90 : 56 }} />
        <GoldRule at={buttonAt + 12} width={vertical ? 300 : 240} />
        <div style={{ height: vertical ? 40 : 28 }} />
        <Reveal at={buttonAt + 16}>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 500,
              fontSize: vertical ? 54 : 44,
              letterSpacing: '0.06em',
              color: COLORS.text,
            }}
          >
            {TEXT.cierre.url}
          </div>
        </Reveal>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
