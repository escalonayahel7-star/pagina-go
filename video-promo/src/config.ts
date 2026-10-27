// =====================================================================
//  CONFIGURACIÓN DEL VIDEO — Gilberto Ortíz e Hijos
//  Aquí se cambian textos, tiempos y efectos de sonido sin tocar el resto.
//  En los textos, lo que va entre *asteriscos* sale en cursiva dorada.
// =====================================================================

export const FPS = 30;
export const DURATION = 990; // 33 s

// Duración del fundido entre escenas (frames).
export const CROSSFADE = 14;

export const COLORS = {
  black: '#000000',
  ink: '#0A0A0A',
  gold: '#C9A84C',
  goldLight: '#E2C068',
  goldDeep: '#9C7F32',
  text: '#F3EFE6',
  muted: '#A8A39A',
};

// Inicio y duración de cada escena, en frames (30 fps).
export const SCENES = {
  apertura: { from: 0, duration: 105 },
  taller: { from: 105, duration: 135 },
  top3: { from: 240, duration: 135 },
  oficio: { from: 375, duration: 150 },
  casas: { from: 525, duration: 120 },
  familia: { from: 645, duration: 105 },
  web: { from: 750, duration: 120 },
  cierre: { from: 870, duration: 120 },
} as const;

export const TEXT = {
  apertura: {
    // Se muestra en una línea en horizontal y en dos en vertical.
    label: ['Legado desde 1965', 'Arte a la medida'],
  },
  taller: {
    headline: ['De San Andrés Lagunas, Oaxaca,', 'a *Savile Row*'],
  },
  top3: {
    figure: 'Top 3',
    headline: 'Entre los mejores sastres del mundo',
    label: ['Reconocimiento Scabal', 'Londres · 2012'],
  },
  oficio: {
    headline: ['Cada traje,', '*una obra singular*'],
  },
  casas: {
    headline: ['Las casas más *prestigiosas*', 'del mundo'],
    // style: 'serif' = Cinzel en mayúsculas; 'script' = Cormorant cursiva (como en la página).
    houses: [
      { name: 'Scabal', style: 'serif' },
      { name: 'Alumo', style: 'serif' },
      { name: 'Holland & Sherry', style: 'serif' },
      { name: 'Loro Piana', style: 'script' },
      { name: 'Dormeuil', style: 'serif' },
    ],
    // Frame (relativo a la escena) en que aparece cada casa y cada cuánto.
    firstAt: 10,
    every: 16,
  },
  familia: {
    headline: ['No vendemos trajes.', 'Preservamos *un legado.*'],
  },
  web: {
    headline: ['Ahora, tu experiencia', '*comienza en línea*'],
  },
  cierre: {
    button: 'Reservar mi cita',
    url: 'gilbertoortizehijos.com',
  },
};

export const ASSETS = {
  logo: 'assets/logo-tijeras-blanco.png',
  taller: 'assets/don-gilberto-taller.jpg',
  hilvanado: 'assets/hilvanado.jpg',
  saco: 'assets/confeccion-saco.jpg',
  scabal: 'assets/scabal-etiqueta.jpg',
  familia: 'assets/familia-tres.jpg',
  webScroll: 'assets/web-scroll.jpg',
};

// Fotos de la escena 4, en orden. `focus` es el punto de encuadre (object-position).
export const OFICIO_PHOTOS = [
  { src: ASSETS.hilvanado, focus: '50% 55%' },
  { src: ASSETS.saco, focus: '50% 40%' },
  { src: ASSETS.scabal, focus: '50% 45%' },
];
// Frame (relativo a la escena 4) en que entra cada foto.
export const OFICIO_PHOTO_STARTS = [0, 48, 96];

// Recorrido del scroll en la captura de la página (escena 7).
// `y` es la posición en píxeles de la captura original (web-scroll.jpg, 1035 px de ancho).
export const WEB_SCROLL_KEYS = [
  { frame: 0, y: 0 },
  { frame: 36, y: 0 },
  { frame: 62, y: 2330 },
  { frame: 78, y: 2330 },
  { frame: 106, y: 6760 },
];
export const WEB_SCROLL_SOURCE = { width: 1035, height: 11200, viewport: 2240 };

// ---------------------------------------------------------------------
//  EFECTOS DE SONIDO (sin música ni voz)
//  frame: frame global en que suena · volume: 0.3 a 0.6
// ---------------------------------------------------------------------
export const SFX: { frame: number; file: string; volume: number; note: string }[] = [
  { frame: 0, file: 'audio/shimmer.wav', volume: 0.45, note: 'Brillo dorado cruza el logo' },
  { frame: 20, file: 'audio/tijeras.wav', volume: 0.5, note: 'Aparece la etiqueta dorada' },
  { frame: 105, file: 'audio/whoosh.wav', volume: 0.35, note: 'Transición a la foto del taller' },
  { frame: 240, file: 'audio/impacto.wav', volume: 0.55, note: 'TOP 3' },
  { frame: 375, file: 'audio/tela.wav', volume: 0.45, note: 'Foto 1: hilvanado' },
  { frame: 435, file: 'audio/hilo.wav', volume: 0.4, note: 'Foto 2: confección' },
  { frame: 480, file: 'audio/cinta-metrica.wav', volume: 0.4, note: 'Foto 3: etiqueta Scabal' },
  // Un tic por cada casa de telas, sincronizado con su aparición (ver TEXT.casas).
  ...TEXT.casas.houses.map((h, i) => ({
    frame: SCENES.casas.from + TEXT.casas.firstAt + i * TEXT.casas.every,
    file: 'audio/tic.wav',
    volume: 0.35,
    note: `Casa: ${h.name}`,
  })),
  { frame: 645, file: 'audio/whoosh.wav', volume: 0.35, note: 'Transición a la familia' },
  { frame: 750, file: 'audio/swipe.wav', volume: 0.4, note: 'Entra el celular' },
  { frame: 800, file: 'audio/scroll.wav', volume: 0.3, note: 'Scroll de la página' },
  { frame: 900, file: 'audio/clic.wav', volume: 0.5, note: 'Aparece RESERVAR MI CITA' },
  { frame: 925, file: 'audio/shimmer-final.wav', volume: 0.45, note: 'Brillo sobre el botón' },
];
// Desde este frame se apaga suavemente cualquier cola de sonido.
export const AUDIO_FADE_OUT_FROM = 960;
