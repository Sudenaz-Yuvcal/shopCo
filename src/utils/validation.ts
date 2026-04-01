export const allowedDomains =
  /@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com)$/;
export const noTurkishChars = /^[^çğıöşüÇĞİÖŞÜ]*$/;

export const getEmailError = (value: string): string => {
  const cleanValue = value.trim();

  if (cleanValue.includes(" ")) return "BOŞLUK BIRAKILAMAZ.";
  if (/[çğıöşüÇĞİÖŞÜ]/.test(cleanValue)) return "TÜRKÇE KARAKTER KULLANILAMAZ.";
  if (/[A-Z]/.test(cleanValue)) return "E-POSTA KÜÇÜK HARF OLMALI.";
  if (cleanValue.length > 0 && !cleanValue.includes("@"))
    return "'@' İŞARETİ GEREKLİDİR.";
  if (cleanValue.includes("@") && !allowedDomains.test(cleanValue))
    return "DESTEKLENEN BİR E-POSTA SERVİSİ KULLANIN.";
  return "";
};

export const getPhoneError = (value: string): string => {
  if (value.length > 0 && value.length !== 10) {
    return "TELEFON 10 HANE OLMALIDIR (5XXXXXXXXX).";
  }
  return "";
};
export const getPasswordError = (value: string): string => {
  if (value.length > 0 && value.length < 8)
    return "ŞİFRE EN AZ 8 KARAKTER OLMALI.";
  if (value.length >= 8 && !/[A-Z]/.test(value))
    return "EN AZ BİR BÜYÜK HARF GEREKLİ.";
  if (value.length >= 8 && !/[0-9]/.test(value))
    return "EN AZ BİR SAYI GEREKLİ.";
  return "";
};
export const getExpiryError = (value: string): string => {
  if (!value) return "SKT GEREKLİ.";
  const parts = value.split("/");
  if (parts.length !== 2) return "GEÇERSİZ FORMAT (MM/YY)";

  const month = parseInt(parts[0], 10);
  const year = parseInt(parts[1], 10);

  if (isNaN(month) || isNaN(year)) return "GEÇERSİZ FORMAT (MM/YY)";
  if (month < 4 || month > 12) return "AY 04-12 ARASI OLMALI";
  if (year < 26 || year > 36) return "YIL 26-36 ARASI OLMALI";

  return "";
};
