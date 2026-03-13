export const WELCOME_GIFT_DATA = {
  CODE: "HOSGELDIN50",
  TITLE: "HOŞ GELDİN!",
  SUBTITLE: "ELITE MEMBER GIFT",
  DESCRIPTION:
    "Seni aramızda görmek harika. İlk siparişinde tarzını yansıtman için sana özel bir ayrıcalık tanımladık.",
  LIMIT_TEXT: "500 TL ÜZERİ ALIŞVERİŞLERDE GEÇERLİ",
  BUTTON_TEXT: "HEDİYEYİ AKTİF ET →",
  EXPIRY_TEXT: "7 GÜN İÇİNDE GEÇERLİ", 
} as const;

export type WelcomeGift = typeof WELCOME_GIFT_DATA;
