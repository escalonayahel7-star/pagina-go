# Video de presentación: gilbertoortizehijos.com

Video de 33 s (30 fps) hecho con [Remotion](https://www.remotion.dev/), con solo efectos de sonido (sin música ni voz).

| Archivo | Formato |
|---|---|
| `out/goh-promo-vertical.mp4` | 1080×1920 (9:16): Reels, TikTok, historias, WhatsApp |
| `out/goh-promo-cuadrado.mp4` | 1080×1080 (1:1): feed de Instagram y Facebook |
| `out/goh-promo-horizontal.mp4` | 1920×1080 (16:9): YouTube, página, presentaciones |

## Editar

Textos, tiempos de escena, fotos, recorrido del scroll y efectos de sonido están en **`src/config.ts`**.
En los textos, lo que va entre `*asteriscos*` sale en cursiva dorada.

```bash
npm install
npm run dev          # Remotion Studio para previsualizar
npm run render       # vertical
npm run render:all   # los tres formatos
```

## Estructura

- `src/scenes/`: una escena por archivo (Apertura, Taller, Top3, Oficio, Casas, Familia, Web, Cierre).
- `src/components.tsx`: piezas de marca (marco de esquinas, líneas doradas, brillo, Ken Burns, grano).
- `public/assets/`: logo y fotos de la página; `web-scroll.jpg` es la captura móvil del sitio en vivo.
- `public/fonts/`: Cormorant Garamond y Cinzel (las mismas de la página), alojadas localmente.
- `public/audio/`: efectos sintetizados con `scripts/generate-sfx.py` (ver `LICENCIAS.md`).
- `scripts/prepare-assets.py`: regenera `public/assets/` a partir de los originales.

## Notas

- Las fotos originales de la página son de ~800 px de ancho; por eso van enmarcadas
  (con la misma foto desenfocada de fondo) en lugar de a pantalla completa. Si hay
  versiones en mayor resolución, basta con reemplazarlas en `public/assets/` con el mismo nombre.
- No se usa la foto con Joaquín López Dóriga ni fotos de otros clientes.
