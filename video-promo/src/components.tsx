import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from './config';
import { EASE, FONTS } from './theme';

/** Aparece con fundido + desplazamiento vertical de 20 px. */
export const Reveal: React.FC<{
  at?: number;
  duration?: number;
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at = 0, duration = 18, distance = 20, style, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * distance}px)`, ...style }}>{children}</div>;
};

/** Convierte "texto *cursiva*" en spans; lo que va entre asteriscos sale en cursiva dorada. */
export const Rich: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/(\*[^*]+\*)/g).map((part, i) =>
      part.startsWith('*') && part.endsWith('*') ? (
        <em key={i} style={{ color: COLORS.gold, fontStyle: 'italic', fontWeight: 400 }}>
          {part.slice(1, -1)}
        </em>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);

/** Titular serif elegante; cada línea entra escalonada. */
export const Headline: React.FC<{
  lines: string[];
  size: number;
  at?: number;
  stagger?: number;
  align?: 'center' | 'left';
}> = ({ lines, size, at = 0, stagger = 8, align = 'center' }) => (
  <div style={{ textAlign: align }}>
    {lines.map((line, i) => (
      <Reveal key={i} at={at + i * stagger}>
        <div
          style={{
            fontFamily: FONTS.serif,
            fontWeight: 300,
            fontSize: size,
            lineHeight: 1.18,
            color: COLORS.text,
            letterSpacing: '0.005em',
            // en horizontal (texto a la izquierda) cada línea va completa
            whiteSpace: align === 'left' ? 'nowrap' : undefined,
          }}
        >
          <Rich text={line} />
        </div>
      </Reveal>
    ))}
  </div>
);

/** Etiqueta en mayúsculas con mucho espaciado entre letras. */
export const Label: React.FC<{
  parts: string[];
  size: number;
  stacked?: boolean;
  color?: string;
  align?: 'center' | 'left';
}> = ({ parts, size, stacked = false, color = COLORS.gold, align = 'center' }) => {
  const style: React.CSSProperties = {
    fontFamily: FONTS.serif,
    fontWeight: 500,
    fontSize: size,
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    color,
    // compensa el espaciado de la última letra para que quede centrado
    marginRight: align === 'center' ? '-0.35em' : 0,
    lineHeight: 1.9,
    textAlign: align,
    whiteSpace: 'nowrap',
  };
  if (stacked) {
    return (
      <div style={{ textAlign: align }}>
        {parts.map((p, i) => (
          <div key={i} style={style}>
            {p}
          </div>
        ))}
      </div>
    );
  }
  return <div style={style}>{parts.join('  ·  ')}</div>;
};

/** Línea dorada fina que se dibuja desde el centro. */
export const GoldRule: React.FC<{ at?: number; width: number; vertical?: boolean; duration?: number }> = ({
  at = 0,
  width,
  vertical = false,
  duration = 24,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const grad = vertical
    ? `linear-gradient(180deg, transparent, ${COLORS.gold}, transparent)`
    : `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`;
  return (
    <div
      style={{
        width: vertical ? 1.5 : width * p,
        height: vertical ? width * p : 1.5,
        background: grad,
        margin: '0 auto',
        opacity: 0.85,
      }}
    />
  );
};

/** Marco de esquinas doradas finas, como el del inicio de la página. */
export const CornerFrame: React.FC<{ inset: number; arm?: number; at?: number }> = ({ inset, arm = 90, at = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const len = arm * p;
  const line: React.CSSProperties = { position: 'absolute', background: COLORS.gold, opacity: 0.55 };
  const corners = [
    { top: inset, left: inset, h: 'left', v: 'top' },
    { top: inset, right: inset, h: 'right', v: 'top' },
    { bottom: inset, left: inset, h: 'left', v: 'bottom' },
    { bottom: inset, right: inset, h: 'right', v: 'bottom' },
  ] as const;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {corners.map((c, i) => {
        const { h, v, ...pos } = c;
        return (
          <div key={i} style={{ position: 'absolute', width: arm, height: arm, ...pos }}>
            <div style={{ ...line, [v]: 0, [h]: 0, width: len, height: 1.5 }} />
            <div style={{ ...line, [v]: 0, [h]: 0, width: 1.5, height: len }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Fondo negro con resplandor cálido muy tenue, viñeta y grano. */
export const Backdrop: React.FC<{ glow?: number }> = ({ glow = 0.5 }) => (
  <AbsoluteFill style={{ background: COLORS.black }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 55% at 50% 45%, rgba(74,52,30,${0.55 * glow}) 0%, rgba(20,13,8,${0.6 * glow}) 45%, rgba(0,0,0,0) 80%)`,
      }}
    />
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

const grainSvg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

/** Grano de película muy sutil que cambia cada 2 frames. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  const x = (step * 73) % 300;
  const y = (step * 151) % 300;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("${grainSvg}")`,
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};

/** Foto con zoom lento (Ken Burns 100% → 108%) y oscurecimiento. */
export const KenBurns: React.FC<{
  src: string;
  start?: number;
  duration: number;
  from?: number;
  to?: number;
  focus?: string;
  darken?: number;
  blur?: number;
  style?: React.CSSProperties;
}> = ({ src, start = 0, duration, from = 1, to = 1.08, focus = '50% 50%', darken = 0.3, blur = 0, style }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', ...style }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: focus,
          transform: `scale(${scale})`,
          transformOrigin: focus,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${darken})` }} />
    </div>
  );
};

/** Foto enmarcada con filo dorado y esquinas desplazadas, más fondo desenfocado de la misma foto. */
export const FramedPhoto: React.FC<{
  src: string;
  width: number;
  height: number;
  duration: number;
  focus?: string;
  darken?: number;
}> = ({ src, width, height, duration, focus, darken = 0.25 }) => (
  <div style={{ position: 'relative', width, height }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        boxShadow: '0 40px 90px rgba(0,0,0,0.75)',
        outline: `1px solid rgba(201,168,76,0.45)`,
        overflow: 'hidden',
      }}
    >
      <KenBurns src={src} duration={duration} focus={focus} darken={darken} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)',
        }}
      />
    </div>
    <div
      style={{
        position: 'absolute',
        inset: -18,
        border: '1px solid rgba(201,168,76,0.22)',
        pointerEvents: 'none',
      }}
    />
  </div>
);

/** Brillo dorado lineal que cruza un elemento, recortado con una máscara opcional. */
export const Sheen: React.FC<{
  at: number;
  duration?: number;
  mask?: string;
  opacity?: number;
}> = ({ at, duration = 34, mask, opacity = 0.9 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + duration], [-0.4, 1.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const visible = frame >= at && frame <= at + duration;
  if (!visible) return null;
  const center = p * 100;
  const maskStyle: React.CSSProperties = mask
    ? {
        WebkitMaskImage: `url(${mask})`,
        WebkitMaskSize: '100% 100%',
        maskImage: `url(${mask})`,
        maskSize: '100% 100%',
      }
    : {};
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(105deg, rgba(226,192,104,0) ${center - 14}%, rgba(255,236,170,${opacity}) ${center}%, rgba(226,192,104,0) ${center + 14}%)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        ...maskStyle,
      }}
    />
  );
};
