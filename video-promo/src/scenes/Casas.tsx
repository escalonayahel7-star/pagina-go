import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Backdrop, GoldRule, Grain, Headline, Reveal, Vignette } from '../components';
import { COLORS, TEXT } from '../config';
import { FONTS, useLayout } from '../theme';

const House: React.FC<{ name: string; style: string; size: number }> = ({ name, style, size }) =>
  style === 'script' ? (
    <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400, fontSize: size * 1.22, color: COLORS.text, letterSpacing: '0.04em' }}>
      {name}
    </div>
  ) : (
    <div
      style={{
        fontFamily: FONTS.display,
        fontWeight: 600,
        fontSize: size,
        color: COLORS.text,
        letterSpacing: '0.22em',
        marginRight: '-0.22em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {name}
    </div>
  );

/** Escena 5 · Las casas de telas, una por una. */
export const Casas: React.FC = () => {
  const l = useLayout();
  const { houses, firstAt, every } = TEXT.casas;
  const wide = l.format === 'wide';
  const vertical = l.format === 'vertical';
  const nameSize = vertical ? 50 : wide ? 30 : 38;

  const list = wide ? (
    <div style={{ display: 'flex', border: '1px solid rgba(201,168,76,0.28)' }}>
      {houses.map((h, i) => (
        <Reveal key={h.name} at={firstAt + i * every} style={{ flex: 1 }}>
          <div
            style={{
              height: 200,
              padding: '0 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: i === 0 ? 'none' : '1px solid rgba(201,168,76,0.28)',
            }}
          >
            <House name={h.name} style={h.style} size={nameSize} />
          </div>
        </Reveal>
      ))}
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {houses.map((h, i) => (
        <Reveal key={h.name} at={firstAt + i * every} style={{ width: '100%' }}>
          <div
            style={{
              height: vertical ? 150 : 104,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: i === 0 ? '1px solid rgba(201,168,76,0.28)' : 'none',
              borderBottom: '1px solid rgba(201,168,76,0.28)',
            }}
          >
            <House name={h.name} style={h.style} size={nameSize} />
          </div>
        </Reveal>
      ))}
    </div>
  );

  return (
    <AbsoluteFill>
      <Backdrop glow={0.3} />
      <Vignette />
      <div
        style={{
          position: 'absolute',
          left: l.safe.side,
          right: l.safe.side,
          top: l.safe.top,
          bottom: l.safe.bottom,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: vertical ? 100 : 64,
        }}
      >
        <div>
          <Headline lines={TEXT.casas.headline} size={vertical ? 70 : 58} at={0} stagger={8} />
          <div style={{ height: vertical ? 44 : 30 }} />
          <GoldRule at={10} width={160} />
        </div>
        {list}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
