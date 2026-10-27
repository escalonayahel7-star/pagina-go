"""Prepara public/assets/ a partir de los originales de la página.

Uso: python3 scripts/prepare-assets.py <carpeta-originales>
La carpeta debe contener las fotos descargadas de la página, el logo (logo.jpg)
y web-scroll.png (captura móvil del sitio en vivo).
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

src = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / "public" / "assets"
out.mkdir(parents=True, exist_ok=True)

# Logo blanco sobre negro -> PNG con transparencia (alfa = luminancia).
logo = np.asarray(Image.open(src / "logo.jpg").convert("L"), dtype=np.float32)
alpha = np.clip((logo - 18) / (235 - 18), 0, 1)
ys, xs = np.where(alpha > 0.05)
pad = 12
y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, alpha.shape[0])
x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, alpha.shape[1])
rgba = np.zeros((y1 - y0, x1 - x0, 4), dtype=np.uint8)
rgba[..., :3] = 255
rgba[..., 3] = (alpha[y0:y1, x0:x1] * 255).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(out / "logo-tijeras-blanco.png")

photos = {
    "gilberto-ortiz-sastre-en-su-negocio.jpg": "don-gilberto-taller.jpg",
    "confeccion-del-sastre-gilberto-ortiz.jpg": "hilvanado.jpg",
    "confeccion-de-trajes-de-gilberto-ortiz.jpg": "confeccion-saco.jpg",
    "telas-scabal-del-sastre-gilberto-ortiz.jpg": "scabal-etiqueta.jpg",
    "sastre-gilberto-ortiz-e-hijos.jpg": "familia-tres.jpg",
}
for a, b in photos.items():
    Image.open(src / a).convert("RGB").save(out / b, quality=95)

Image.open(src / "web-scroll.png").convert("RGB").save(out / "web-scroll.jpg", quality=90)
print("listo:", sorted(p.name for p in out.iterdir()))
