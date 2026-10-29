# Estilo visual: video e imagen

El estilo sale de la página y del video de presentación (`video-promo/`). Todo lo que se publique
debe sentirse de la misma familia: oscuro, cálido, pausado, con el dorado como única nota de color.

## Paleta
| Uso | Color |
|---|---|
| Fondo | Negro `#000000` / `#0A0A0A` (con viñeta suave) |
| Acento (palabras clave, líneas, botones) | Dorado `#C9A84C` · claro `#E2C068` · profundo `#9C7F32` |
| Texto principal | Blanco cálido `#F3EFE6` |
| Texto secundario | Gris cálido `#A8A39A` |

El dorado se usa poco: una palabra en cursiva, una línea fina, un botón. Si todo es dorado, nada lo es.

## Tipografía
- **Cormorant Garamond**: titulares (Light o Regular) y texto. La palabra clave en *cursiva dorada*.
  Ejemplo: "No vendemos trajes. Preservamos *un legado.*"
- **Cinzel**: cifras grandes en dorado (TOP 3, 1965, 1836) y nombres de las casas de telas.
- **Etiquetas**: Cormorant en MAYÚSCULAS con mucho espacio entre letras (~0.35 em), tamaño pequeño, en dorado
  o gris. Ejemplo: `LEGADO DESDE 1965 · ARTE A LA MEDIDA`.
- Máximo dos tamaños de texto por pantalla. Máximo 12 palabras en pantalla a la vez.
- Los archivos de las fuentes están en `video-promo/public/fonts/`.

## Elementos de marca
- **Marco de esquinas doradas finas** (como en el inicio de la página): aperturas, cierres, portadas.
- **Líneas doradas finas** como separadores, que se dibujan desde el centro.
- **Logo** de tijeras con la firma, en blanco: `video-promo/public/assets/logo-tijeras-blanco.png`.
  Siempre sobre fondo oscuro, con aire alrededor, nunca deformado ni con sombras duras.
- **Grano** de película muy sutil y **viñeta** para que nada se vea "digital plano".
- **✦** como único ornamento tipográfico.

## Fotografía
**Luz:** baja y cálida (lámpara de taller, ventana lateral). Sombras profundas. Nunca flash directo
ni luz blanca de oficina.

**Qué fotografiar:**
- Manos: hilvanando, trazando con greda, cortando, tomando medidas.
- Herramientas: tijeras, cinta métrica, dedal, greda, plancha, maniquí.
- Tela de cerca: textura, caída, el **orillo con el nombre de la casa** (por ejemplo "SUPER 150's").
- El taller: rollos de tela, estantes de madera, piezas en proceso.
- Personas: los hijos trabajando (no posando), Don Gilberto en fotos de archivo.

**Cómo:** encuadres cerrados, profundidad de campo corta, fondo limpio. Una sola idea por foto.
Color: negros profundos un poco cálidos, colores contenidos, el azul marino y el dorado como protagonistas.

**Evitar:** fondos saturados, gente posando con el pulgar arriba, fotos de clientes sin permiso,
filtros de Instagram, capturas de pantalla borrosas, texto encima de caras.

**Calidad:** las fotos actuales de la página miden ~800 px; sirven enmarcadas, no a pantalla completa.
Para contenido nuevo, fotografiar a la máxima resolución del celular.

## Video
**Grabación (con celular sirve):**
- 4K, 24 o 30 cuadros por segundo; exposición y enfoque bloqueados (mantener presionado en la pantalla).
- Celular en tripié o apoyado. Movimientos lentos o ninguno: el movimiento lo pone la edición.
- Grabar 10 segundos de cada toma aunque se usen 2.
- Grabar también el **sonido real** de cerca (tijera, tela, cinta): son los mejores efectos.

**Edición:**
- Todo lento: fundidos de 12 a 18 cuadros, zoom tipo Ken Burns de 100% a 108%.
- Texto entra con fundido y un desplazamiento de 20 px hacia arriba, con suavidad.
- Transiciones: fundido o paso por negro. Nada de giros, destellos de plantilla ni texto que rebota.
- Fotos con oscurecimiento del 20 al 35% para que se lea el texto.
- Subtítulos siempre en pantalla (casi todos ven sin sonido), en Cormorant, centrados, máximo 2 líneas.

**Zonas seguras (9:16, 1080×1920):** dejar libres ~150 px arriba y ~250 px abajo; 80 px a los lados.

## Formatos de archivo
| Dónde | Tamaño |
|---|---|
| Reels, TikTok, historias | 1080×1920 (9:16) |
| Post y carrusel de Instagram | 1080×1350 (4:5); lo importante al centro, porque la cuadrícula del perfil recorta a 3:4 |
| Portada de Reel | 1080×1920, con el título dentro del recuadro central 1080×1440 |
| YouTube / página | 1920×1080 (16:9) |

## Plantilla de producción
El proyecto `video-promo/` (Remotion) ya tiene todas estas piezas: marco, líneas, brillo, Ken Burns,
grano, tipografías y efectos de sonido. Para un video nuevo se parte de ahí: textos y tiempos en
`src/config.ts`, escenas en `src/scenes/`. Para agregar voz: poner el WAV en `public/audio/voz/` y
colocarlo con `<Audio>` dentro de una `<Sequence>`, bajando los efectos mientras habla.
