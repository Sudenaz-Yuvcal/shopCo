export const PROMO_CAMPAIGN = {
  TITLE_PART_1: "SEZON",
  TITLE_PART_2: "FİNALİ",
  DISCOUNT_TEXT: "SEÇİLİ KOLEKSİYONLARDA %50'YE VARAN İNDİRİM",
  FOOTNOTE: "*Shop.co Elite üyelerine özel sezon sonu etkinliğidir.",
  ACTION_TEXT: "KEŞFETMEYE BAŞLA",
  INITIAL_SECONDS: { hours: 20, minutes: 55, seconds: 16 },
  CLOSE_DELAY: 3,
} as const;

export type PromoCampaign = typeof PROMO_CAMPAIGN;
