import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Backdrop, Grain, Headline, Vignette } from '../components';
import { ASSETS, TEXT, WEB_SCROLL_KEYS, WEB_SCROLL_SOURCE } from '../config';
import { EASE, useLayout } from '../theme';

const SCREEN_RATIO = 414 / 896;

/** Celular con la página nueva y scroll suave. */
const Phone: React.FC<{ height: number }> = ({ height }) => {
  const frame = useCurrentFrame();
  const bezel = Math.round(height * 0.014);
  const screenH = height - bezel * 2;
  const screenW = screenH * SCREEN_RATIO;
  const k = screenW / WEB_SCROLL_SOURCE.width;

  let y = WEB_SCROLL_KEYS[0].y;
  for (let i = 0; i < WEB_SCROLL_KEYS.length - 1; i++) {
    const a = WEB_SCROLL_KEYS[i];
    const b = WEB_SCROLL_KEYS[i + 1];
    if (frame >= a.frame) {
      y = interpolate(frame, [a.frame, b.frame], [a.y, b.y], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: EASE,
      });
    }
  }

  const radius = height * 0.062;
  return (
    <div
      style={{
        position: 'relative',
        width: screenW + bezel * 2,
        height,
        borderRadius: radius,
        background: 'linear-gradient(145deg, #2a2a2a, #0d0d0d 40%, #1c1c1c)',
        padding: bezel,
        boxShadow: '0 0 0 1.5px rgba(201,168,76,0.35), 0 50px 120px rgba(0,0,0,0.85), 0 0 140px rgba(201,168,76,0.10)',
      }}
    >
      <div style={{ position: 'relative', width: screenW, height: screenH, borderRadius: radius - bezel, overflow: 'hidden', background: '#000' }}>
        <Img
          src={staticFile(ASSETS.webScroll)}
          style={{ position: 'absolute', left: 0, top: 0, width: screenW, transform: `translateY(${-y * k}px)` }}
        />
        {/* isla del celular */}
        <div
          style={{
            position: 'absolute',
            top: screenH * 0.013,
            left: '50%',
            width: screenW * 0.28,
            height: screenH * 0.032,
            transform: 'translateX(-50%)',
            borderRadius: 999,
            background: '#000',
          }}
        />
        {/* reflejo del cristal */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 35%)' }} />
      </div>
    </div>
  );
};

/** Escena 7 · La página nueva dentro de un celular. */
export const Web: React.FC = () => {
  const frame = useCurrentFrame();
  const l = useLayout();
  const vertical = l.format === 'vertical';
  const p = interpolate(frame, [0, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const phoneH = vertical ? 1150 : l.format === 'square' ? 860 : 880;

  const phone = (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 140}px)` }}>
      <Phone height={phoneH} />
    </div>
  );
  const text = (align: 'center' | 'left') => (
    <Headline lines={TEXT.web.headline} size={vertical ? 64 : l.format === 'square' ? 54 : 70} at={10} stagger={10} align={align} />
  );

  return (
    <AbsoluteFill>
      <Backdrop glow={0.6} />
      <Vignette />
      <div
        style={{
          position: 'absolute',
          left: l.safe.side,
          right: l.safe.side,
          top: vertical ? l.safe.top + 10 : 0,
          bottom: vertical ? l.safe.bottom : 0,
          display: 'flex',
          flexDirection: vertical ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: vertical ? 'space-between' : 'center',
          gap: vertical ? 0 : l.format === 'square' ? 50 : 160,
        }}
      >
        <div style={{ flex: vertical ? 'none' : 1, maxWidth: vertical ? undefined : 760 }}>{text(vertical ? 'center' : 'left')}</div>
        {phone}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
