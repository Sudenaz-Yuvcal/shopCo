export const PROMO_CAMPAIGN = {
  TITLE_PART_1: "SEZON",
  TITLE_PART_2: "FİNALİ",
  DISCOUNT_TEXT: "SEÇİLİ KOLEKSİYONLARDA %50'YE VARAN İNDİRİM",
  ACTION_TEXT: "KEŞFETMEYE BAŞLA",
  INITIAL_SECONDS: { hours: 10, minutes: 55, seconds: 16 },
  CLOSE_DELAY: 3,
} as const;

export type PromoCampaign = typeof PROMO_CAMPAIGN;
