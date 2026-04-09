export const HERO_STATS = [
  { label: "PREMIUM MARKA", value: "200+" },
  { label: "SEÇKİN TASARIM", value: "2,000+" },
  { label: "MUTLU ÜYE", value: "30,000+" },
] as const;

export const HERO_BRANDS = [
  { name: "VERSACE", src: "/versace.png" },
  { name: "ZARA", src: "/zara.png" },
  { name: "GUCCI", src: "/gucci.png" },
  { name: "PRADA", src: "/prada.png" },
  { name: "CALVIN KLEIN", src: "/ck.png" },
] as const;

export type HeroStat = (typeof HERO_STATS)[number];
export type HeroBrand = (typeof HERO_BRANDS)[number];
