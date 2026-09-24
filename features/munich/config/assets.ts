/**
 * Central asset slots — keyed WebP cuts + original plates where needed.
 * Regenerate cuts: npm run cuts:munich
 * Regenerate frames: npm run frames:munich / npm run frames:munich:explod
 */
export type FrameSequenceVariant = {
  path: string;
  extension: string;
  count: number;
  pad: number;
};

export const ASSETS = {
  PRODUCT_HERO_IMAGE: "/munich/cuts/side.webp",
  PRODUCT_FRAME_SEQUENCE: {
    /** Keyed plates from munich-sneaker-360-turntable.mp4 (ffmpeg + chroma green). */
    useImageFrames: true,
    desktop: {
      path: "/frames/munich-yellow/desktop/frame_",
      extension: "png",
      count: 120,
      pad: 4,
    } satisfies FrameSequenceVariant,
    mobile: {
      path: "/frames/munich-yellow/desktop/frame_",
      extension: "png",
      count: 120,
      pad: 4,
    } satisfies FrameSequenceVariant,
  },
  /** Scroll-driven exploded construction from munich-sneaker-exploded.mp4 */
  EXPLODED_FRAME_SEQUENCE: {
    useImageFrames: true,
    path: "/frames/munich-yellow/explod/frame_",
    extension: "png",
    count: 96,
    pad: 4,
  } satisfies FrameSequenceVariant & { useImageFrames: boolean },
  /** Scroll-driven colorway morph from munich-sneaker-colorways.mp4 */
  COLORWAY_FRAME_SEQUENCE: {
    useImageFrames: true,
    path: "/frames/munich-yellow/colorways/frame_",
    extension: "png",
    count: 96,
    pad: 4,
  } satisfies FrameSequenceVariant & { useImageFrames: boolean },
  PRODUCT_MODEL: "/models/munich-barru.glb",
  TURNTABLE_VIDEO: "/videos/munich-sneaker-360-turntable.mp4",
  EXPLODED_VIDEO: "/videos/munich-sneaker-exploded.mp4",
  COLORWAY_VIDEO: "/videos/munich-sneaker-colorways.mp4",
  /** Clean keyed plate for zoom (no baked contact shadow). */
  ZOOM_SHOE: "/frames/munich-yellow/desktop/frame_0001.png",
  /** Transparent product cuts (cream studio keyed offline). */
  CUTS: {
    side: "/munich/cuts/side.webp",
    medial: "/munich/cuts/medial.webp",
    sole: "/munich/cuts/sole.webp",
    pair: "/munich/cuts/pair.webp",
    top: "/munich/cuts/top.webp",
    heel: "/munich/cuts/heel.webp",
  },
  /** Original studio plates — heel detail kept for macro cover. */
  PHOTOS: {
    side: "/munich/cuts/side.webp",
    medial: "/munich/cuts/medial.webp",
    heel: "/munich/images/products/barru-heel-detail.jpg",
    heelCut: "/munich/cuts/heel.webp",
    sole: "/munich/cuts/sole.webp",
    pair: "/munich/cuts/pair.webp",
    top: "/munich/cuts/top.webp",
  },
  PRODUCT_LAYERS: {
    upper: "/munich/cuts/side.webp",
    sole: "/munich/cuts/sole.webp",
    midsole: "/munich/cuts/medial.webp",
    laces: "/munich/cuts/top.webp",
    heel: "/munich/cuts/heel.webp",
    tongue: "/munich/cuts/top.webp",
  },
  COLORWAYS: [
    { id: "mustard-navy", label: "Mostaza / Azul", swatch: "#D6A12B", image: "/frames/munich-yellow/colorways/frame_0008.png" },
    { id: "white-blue", label: "Hueso / Marino", swatch: "#E6DDCB", image: "/frames/munich-yellow/colorways/frame_0033.png" },
    { id: "black-white", label: "Carbón / Blanco", swatch: "#2B2A2B", image: "/frames/munich-yellow/colorways/frame_0058.png" },
    { id: "burgundy", label: "Burdeos / Crema", swatch: "#6C1E2A", image: "/frames/munich-yellow/colorways/frame_0085.png" },
  ],
  /** Keyed orbit frames — transparent, no baked studio shadow. */
  EDITORIAL: {
    hero: "/frames/munich-yellow/desktop/frame_0060.png",
    float: "/frames/munich-yellow/desktop/frame_0045.png",
    tall: "/frames/munich-yellow/desktop/frame_0060.png",
    wide: "/frames/munich-yellow/desktop/frame_0015.png",
  },
  EDITORIAL_VIDEO: "/videos/munich-sneaker-360-turntable.mp4",
  HORIZONTAL: {
    lateral: "/assets/1.jpg",
    superior: "/assets/6.jpg",
    sole: "/assets/4.jpg",
    heel: "/munich/images/products/barru-heel-detail.jpg",
    medial: "/assets/3.jpg",
  },
  /** Collection grid — clean colorway stills (stable hold of each morph). */
  GRID: [
    { id: "barru", name: "BARRU 8290", price: 110, image: "/frames/munich-yellow/colorways/frame_0008.png", span: "wide" as const },
    { id: "goal", name: "BARRU 8290", price: 110, image: "/frames/munich-yellow/colorways/frame_0033.png", span: "narrow" as const },
    { id: "dash", name: "BARRU 8290", price: 115, image: "/frames/munich-yellow/colorways/frame_0058.png", span: "mid" as const },
    { id: "x", name: "BARRU 8290", price: 115, image: "/frames/munich-yellow/colorways/frame_0085.png", span: "mid" as const },
  ],
  /** Stable stills per colorway id (mn/bn/bk/bu) from keyed morph sequence. */
  COLORWAY_STILLS: {
    mn: "/frames/munich-yellow/colorways/frame_0008.png",
    bn: "/frames/munich-yellow/colorways/frame_0033.png",
    bk: "/frames/munich-yellow/colorways/frame_0058.png",
    bu: "/frames/munich-yellow/colorways/frame_0085.png",
  },
} as const;

export function frameUrlFromConfig(cfg: FrameSequenceVariant, index: number): string {
  const n = String(index + 1).padStart(cfg.pad, "0");
  return `${cfg.path}${n}.${cfg.extension}`;
}

export function frameUrl(
  variant: "desktop" | "mobile",
  index: number,
): string {
  return frameUrlFromConfig(ASSETS.PRODUCT_FRAME_SEQUENCE[variant], index);
}

export function explodedFrameUrl(index: number): string {
  return frameUrlFromConfig(ASSETS.EXPLODED_FRAME_SEQUENCE, index);
}

export function colorwayFrameUrl(index: number): string {
  return frameUrlFromConfig(ASSETS.COLORWAY_FRAME_SEQUENCE, index);
}
