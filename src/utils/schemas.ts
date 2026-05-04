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

export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("AD SOYAD GEREKLİ.")
    .test("is-full-name", "AD VE SOYADINIZI TAM GİRİNİZ.", (val) =>
      val ? val.trim().includes(" ") && val.trim().length >= 5 : false,
    ),
  email: baseEmail,
  phone: yup
    .string()
    .required("TELEFON NUMARASI GEREKLİ.")
    .matches(/^[0-9]+$/, "SADECE RAKAM GİRİNİZ.")
    .min(10, "EN AZ 10 HANELİ OLMALIDIR."),
  password: basePassword,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "ŞİFRELER EŞLEŞMİYOR.")
    .required("ŞİFRE TEKRARI GEREKLİ."),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "ŞARTLARI ONAYLAMALISINIZ.")
    .required(),
  lightingText: yup
    .boolean()
    .oneOf([true], "AYDINLATMA METNİ GEREKLİ.")
    .required(),
  privacyPolicy: yup
    .boolean()
    .oneOf([true], "GİZLİLİK BEYANI GEREKLİ.")
    .required(),
  marketingConsent: yup.boolean().default(false),
});
