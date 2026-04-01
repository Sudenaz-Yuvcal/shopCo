import * as yup from "yup";
import { noTurkishChars } from "./validation";

export const baseEmail = yup
  .string()
  .trim()
  .required("E-POSTA ADRESİ GEREKLİ.")
  .test("no-spaces", "BOŞLUK BIRAKILAMAZ.", (val) => !val?.includes(" "))
  .test("no-turkish", "TÜRKÇE KARAKTER KULLANILAMAZ.", (val) =>
    noTurkishChars.test(val || ""),
  )
  .test("at-required", "'@' İŞARETİ GEREKLİDİR.", (val) => val?.includes("@"))
  .test(
    "no-uppercase",
    "E-POSTA KÜÇÜK HARF OLMALI.",
    (val) => !/[A-Z]/.test(val || ""),
  )
  .test("valid-format", "GEÇERLİ BİR E-POSTA ADRESİ KULLANIN.", (val) =>
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(val || ""),
  );

export const basePassword = yup
  .string()
  .required("ŞİFRE GEREKLİ.")
  .min(8, "ŞİFRE EN AZ 8 KARAKTER OLMALI.")
  .matches(/[A-Z]/, "EN AZ BİR BÜYÜK HARF GEREKLİ.")
  .matches(/[0-9]/, "EN AZ BİR SAYI GEREKLİ.");



