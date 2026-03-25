export const getEmailError = (value: string): string => {
  const cleanValue = value.trim();
  if (cleanValue.includes(" ")) return "BOŞLUK BIRAKILAMAZ.";
  if (/[çğıöşüÇĞİÖŞÜ]/.test(cleanValue)) return "TÜRKÇE KARAKTER KULLANILAMAZ.";
  if (/[A-Z]/.test(cleanValue)) return "E-POSTA KÜÇÜK HARF OLMALI.";
  if (cleanValue.length > 0 && !cleanValue.includes("@"))
    return "'@' İŞARETİ GEREKLİDİR.";
  if (
    cleanValue.includes("@") &&
    !/@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com)$/.test(
      cleanValue,
    )
  ) {
    return "GEÇERLİ BİR KURUMSAL UZANTI KULLANIN.";
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
