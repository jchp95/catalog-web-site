/** Munich design tokens — aligned with Claude Design prototype. */
export const munichTokens = {
  carbon: "#0B0B0C",
  bone: "#EFEBE3",
  mustard: "#D6A12B",
  navy: "#0E1B36",
  navyMid: "#1C2A4D",
  warmGray: "#8A8478",
  surface: "#161616",
  ink: "#111112",
} as const;

export const zIndex = {
  bg: 0,
  content: 10,
  product: 20,
  float: 30,
  nav: 50,
  modal: 100,
  loader: 200,
} as const;

export const motionTokens = {
  easeOut: "power3.out",
  easeExpo: "expo.out",
  durationFast: 0.35,
  durationMid: 0.7,
  durationSlow: 1.2,
  scrubDefault: 1,
  frameSmoothing: 0.1,
} as const;

export const COLORWAYS = [
  {
    id: "mn",
    name: "Mostaza / Azul",
    short: "Mostaza",
    a: "#D6A12B",
    b: "#2B4C9B",
    bg: "#0E1B36",
    fg: "#EFEBE3",
    map: null as null | { m: string; b: string },
  },
  {
    id: "bn",
    name: "Hueso / Marino",
    short: "Hueso",
    a: "#E6DDCB",
    b: "#1C2A4D",
    bg: "#C8C3B8",
    fg: "#14203D",
    map: { m: "#E6DDCB", b: "#1E2C50" },
  },
  {
    id: "bk",
    name: "Carbón / Blanco",
    short: "Carbón",
    a: "#2B2A2B",
    b: "#D6A12B",
    bg: "#D9A42C",
    fg: "#121212",
    map: { m: "#2E2D2F", b: "#D9A52E" },
  },
  {
    id: "bu",
    name: "Burdeos / Crema",
    short: "Burdeos",
    a: "#6C1E2A",
    b: "#EADFCB",
    bg: "#2A0D13",
    fg: "#F0E2D6",
    map: { m: "#6E1F2C", b: "#EADFCB" },
  },
] as const;

export type ColorwayId = (typeof COLORWAYS)[number]["id"];
