"""Genera los efectos de sonido del video por síntesis (sin muestras de terceros).

Uso: python3 scripts/generate-sfx.py
Escribe archivos WAV (48 kHz, estéreo) en public/audio/.
Al ser sonidos sintetizados aquí mismo, no tienen licencias de terceros.
"""
import math
import wave
from pathlib import Path

import numpy as np

SR = 48000
OUT = Path(__file__).resolve().parent.parent / "public" / "audio"
rng = np.random.default_rng(1965)


def t_axis(dur):
    return np.arange(int(SR * dur)) / SR


def env(dur, attack, release, curve=3.0):
    """Envolvente con ataque lineal y caída exponencial."""
    t = t_axis(dur)
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    r = np.exp(-curve * np.clip(t - attack, 0, None) / max(release, 1e-4))
    return a * r


def biquad(x, freqs, q, kind="bp"):
    """Filtro biquad (RBJ) con frecuencia variable por muestra."""
    freqs = np.broadcast_to(np.asarray(freqs, dtype=np.float64), x.shape)
    y = np.zeros_like(x)
    x1 = x2 = y1 = y2 = 0.0
    for n in range(len(x)):
        w0 = 2 * math.pi * min(freqs[n], SR * 0.45) / SR
        cs, sn = math.cos(w0), math.sin(w0)
        alpha = sn / (2 * q)
        if kind == "bp":
            b0, b1, b2 = alpha, 0.0, -alpha
        elif kind == "lp":
            b0, b1, b2 = (1 - cs) / 2, 1 - cs, (1 - cs) / 2
        else:  # hp
            b0, b1, b2 = (1 + cs) / 2, -(1 + cs), (1 + cs) / 2
        a0, a1, a2 = 1 + alpha, -2 * cs, 1 - alpha
        out = (b0 * x[n] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1, y2, y1 = x1, x[n], y1, out
        y[n] = out
    return y


def noise(dur):
    return rng.standard_normal(int(SR * dur))


def pink(dur):
    n = int(SR * dur)
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    spec[1:] /= np.sqrt(f[1:])
    spec[0] = 0
    y = np.fft.irfft(spec, n)
    return y / np.max(np.abs(y))


def reverb(x, dur=1.2, mix=0.25, damp=4000):
    """Reverb sencilla: convolución con ruido de caída exponencial."""
    ir = noise(dur) * np.exp(-5 * t_axis(dur) / dur)
    ir = biquad(ir, damp, 0.7, "lp")
    ir /= np.sqrt(np.sum(ir**2))
    n = len(x) + len(ir) - 1
    wet = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)
    dry = np.concatenate([x, np.zeros(len(ir) - 1)])
    return dry * (1 - mix) + wet * mix


def stereo(x, width=0.0):
    """Estéreo con un leve desfase entre canales para dar amplitud."""
    if width <= 0:
        return np.stack([x, x], axis=1)
    d = int(SR * 0.0007 * width)
    r = np.concatenate([np.zeros(d), x[: len(x) - d]])
    return np.stack([x, r], axis=1)


def fade_tail(x, ms=30):
    n = min(int(SR * ms / 1000), len(x))
    x = x.copy()
    x[-n:] *= np.linspace(1, 0, n)[:, None] if x.ndim == 2 else np.linspace(1, 0, n)
    return x


def save(name, x, peak_db=-6.0):
    if x.ndim == 1:
        x = stereo(x)
    x = fade_tail(x)
    x = x / (np.max(np.abs(x)) + 1e-9) * 10 ** (peak_db / 20)
    data = (x * 32767).astype("<i2")
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"{name}.wav  {len(x) / SR:.2f}s")


# ---------------------------------------------------------------- sonidos


def shimmer(dur=2.2, base=2600):
    """Destello brillante: parciales agudos que titilan y se apagan."""
    t = t_axis(dur)
    y = np.zeros_like(t)
    for _ in range(18):
        f = base * rng.uniform(0.8, 2.6)
        start = rng.uniform(0, dur * 0.45)
        e = np.clip((t - start) / 0.08, 0, 1) * np.exp(-np.clip(t - start, 0, None) * rng.uniform(2.2, 4.0))
        trem = 0.6 + 0.4 * np.sin(2 * np.pi * rng.uniform(5, 11) * t + rng.uniform(0, 6))
        y += np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * e * trem * rng.uniform(0.4, 1)
    air = biquad(noise(dur), np.linspace(5000, 9000, len(t)), 2.0, "bp") * env(dur, 0.25, dur, 3) * 0.15
    return stereo(reverb(y + air, 1.6, 0.35)[: len(t)], 6)


def scissors():
    """Un corte de tijera sobre tela: cuchillas metálicas + roce de tela."""
    dur = 0.55
    t = t_axis(dur)
    y = np.zeros_like(t)
    # roce de las hojas
    shear = biquad(noise(dur), np.linspace(2500, 6000, len(t)), 1.5, "bp")
    y += shear * np.clip(t / 0.03, 0, 1) * np.exp(-np.clip(t - 0.03, 0, None) * 18) * 0.6
    # cierre metálico
    for f, a in [(3150, 1.0), (4870, 0.6), (7200, 0.35)]:
        y += np.sin(2 * np.pi * f * t) * np.exp(-np.clip(t - 0.11, 0, None) * 45) * (t > 0.11) * a * 0.5
    click = biquad(noise(dur), 4000, 1.0, "bp") * np.exp(-np.clip(t - 0.11, 0, None) * 220) * (t > 0.11)
    y += click * 1.4
    # tela que cede
    y += biquad(noise(dur), 1400, 0.9, "bp") * env(dur, 0.04, 0.2, 4) * 0.35
    return stereo(reverb(y, 0.6, 0.18)[: len(t)], 3)


def whoosh(dur=0.9, lo=300, hi=2400, q=1.2):
    """Paso de aire suave: ruido con filtro que sube y baja."""
    t = t_axis(dur)
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    y = biquad(pink(dur), lo + (hi - lo) * shape, q, "bp")
    return stereo(y * shape, 8)


def impact():
    """Golpe grave y discreto: sub con caída de tono + cuerpo amortiguado."""
    dur = 2.0
    t = t_axis(dur)
    f = 44 + 46 * np.exp(-t * 9)
    phase = 2 * np.pi * np.cumsum(f) / SR
    sub = np.sin(phase) * env(dur, 0.006, 1.1, 4)
    body = biquad(noise(dur), 160, 0.8, "lp") * env(dur, 0.002, 0.18, 5) * 2.0
    y = reverb(sub + body, 1.8, 0.22, 1800)[: len(t)]
    return stereo(y, 4)


def fabric(dur=1.1):
    """Tela que se desliza: ruido rosa filtrado con textura irregular."""
    t = t_axis(dur)
    rough = 0.7 + 0.3 * biquad(noise(dur), 25, 0.7, "lp") / 0.05
    rough = np.clip(rough, 0.3, 1.3)
    y = biquad(pink(dur), np.linspace(900, 2200, len(t)), 0.9, "bp") * rough
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.3
    return stereo(y * shape, 6)


def thread():
    """Hilo que se jala a través de la tela: fricción aguda que asciende."""
    dur = 0.75
    t = t_axis(dur)
    fr = biquad(noise(dur), np.linspace(2500, 5200, len(t)), 6.0, "bp")
    grains = (rng.random(len(t)) < 0.004) * rng.uniform(0.3, 1, len(t))
    grains = biquad(grains, 3800, 3.0, "bp") * 3
    shape = np.clip(t / 0.08, 0, 1) * np.clip((dur - t) / 0.25, 0, 1)
    y = (fr + grains) * shape
    return stereo(reverb(y, 0.4, 0.12)[: len(t)], 3)


def tape():
    """Cinta métrica que se desenrolla: trinquete fino que se desacelera."""
    dur = 1.0
    t = t_axis(dur)
    y = np.zeros_like(t)
    pos, gap = 0.02, 0.012
    while pos < 0.8:
        i = int(pos * SR)
        n = int(SR * 0.006)
        seg = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * 0.0012))
        y[i : i + n] += seg * (1 - pos / 0.9)
        pos += gap
        gap *= 1.07
    y = biquad(y, 3400, 1.4, "bp")
    slide = biquad(noise(dur), 2600, 1.0, "bp") * env(dur, 0.02, 0.7, 3) * 0.08
    return stereo(reverb(y + slide, 0.4, 0.15)[: len(t)], 3)


def tick():
    """Tic ligero, como un botón de madera."""
    dur = 0.25
    t = t_axis(dur)
    y = np.sin(2 * np.pi * 2100 * t) * np.exp(-t * 90)
    y += np.sin(2 * np.pi * 1250 * t) * np.exp(-t * 60) * 0.5
    y += biquad(noise(dur), 5000, 1.0, "bp") * np.exp(-t * 400) * 0.8
    return stereo(reverb(y, 0.35, 0.15)[: len(t)])


def scroll_rub():
    """Roce de dedo sobre cristal mientras se desplaza la página."""
    dur = 1.8
    t = t_axis(dur)
    y = biquad(pink(dur), 1700, 1.1, "bp")
    mod = 0.55 + 0.45 * np.sin(2 * np.pi * 1.6 * t - np.pi / 2)
    shape = np.clip(t / 0.25, 0, 1) * np.clip((dur - t) / 0.4, 0, 1)
    return stereo(y * mod * shape, 6)


def button_click():
    """Clic de botón suave y redondo."""
    dur = 0.35
    t = t_axis(dur)
    y = np.zeros_like(t)
    for start, f, a in [(0.0, 1800, 1.0), (0.045, 1400, 0.7)]:
        tt = np.clip(t - start, 0, None)
        y += (t >= start) * np.sin(2 * np.pi * f * tt) * np.exp(-tt * 120) * a
        y += (t >= start) * biquad(noise(dur), 3000, 1.0, "bp") * np.exp(-tt * 500) * a * 0.6
    body = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 35) * 0.5
    return stereo(reverb(y + body, 0.35, 0.15)[: len(t)])


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    save("shimmer", shimmer(), -4)
    save("tijeras", scissors(), -5)
    save("whoosh", whoosh(), -7)
    save("impacto", impact(), -13)
    save("tela", fabric(), -7)
    save("hilo", thread(), -8)
    save("cinta-metrica", tape(), -3)
    save("tic", tick(), -5)
    save("swipe", whoosh(0.5, 600, 3800, 1.5), -7)
    save("scroll", scroll_rub(), -7)
    save("clic", button_click(), -9)
    save("shimmer-final", shimmer(2.6, 3000), -4)
