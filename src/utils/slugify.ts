
export const slugify = (text: string) => {
  const trMap: { [key: string]: string } = {
    ç: "c",
    ğ: "g",
    ş: "s",
    ü: "u",
    i: "i",
    ı: "i",
    ö: "o",
    Ç: "C",
    Ğ: "G",
    Ş: "S",
    Ü: "U",
    İ: "I",
    Ö: "O",
  };
  return text
    .toString()
    .replace(/[çğşüıöÇĞŞÜİÖ]/g, (match) => trMap[match])
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};
