import * as yup from "yup";
import { allowedDomains, noTurkishChars } from "./validation";

const baseEmail = yup
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
  .test("allowed-domains", "DESTEKLENEN BİR E-POSTA SERVİSİ KULLANIN.", (val) =>
    allowedDomains.test(val || ""),
  );

const basePassword = yup
  .string()
  .required("ŞİFRE GEREKLİ.")
  .min(8, "ŞİFRE EN AZ 8 KARAKTER OLMALI.")
  .matches(/[A-Z]/, "EN AZ BİR BÜYÜK HARF GEREKLİ.")
  .matches(/[0-9]/, "EN AZ BİR SAYI GEREKLİ.");

export const loginSchema = yup.object().shape({
  email: baseEmail,
  password: yup.string().required("ŞİFRE GEREKLİ."),
});

export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("AD SOYAD GEREKLİ.")
    .test("is-full-name", "AD VE SOYADINIZI TAM GİRİNİZ.", (val) =>
      val ? val.trim().includes(" ") && val.trim().length >= 5 : false,
    ),
  email: baseEmail,
  password: basePassword,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "ŞİFRELER EŞLEŞMİYOR.")
    .required("ŞİFRE TEKRARI GEREKLİ."),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "ŞARTLARI ONAYLAMALISINIZ.")
    .required(),
});

export const checkoutSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("AD SOYAD GEREKLİ.")
    .min(3, "AD SOYAD ÇOK KISA."),
  email: baseEmail,
  address: yup
    .string()
    .required("ADRES GEREKLİ.")
    .min(10, "LÜTFEN DETAYLI BİR ADRES GİRİN."),
  phone: yup
    .string()
    .required("TELEFON GEREKLİ.")
    .test(
      "len",
      "TELEFON 10 HANE OLMALIDIR.",
      (val) => val?.replace(/\D/g, "").length === 10,
    ),
});

export const recoverySchema = yup.object().shape({
  method: yup.string().oneOf(["email", "phone"]).required(),
  inputValue: yup
    .string()
    .required("BU ALAN BOŞ BIRAKILAMAZ.")
    .when("method", {
      is: "email",
      then: (schema) =>
        schema
          .test("no-turkish", "TÜRKÇE KARAKTER KULLANILAMAZ.", (val) =>
            noTurkishChars.test(val || ""),
          )
          .test("at-required", "'@' İŞARETİ GEREKLİDİR.", (val) =>
            val?.includes("@"),
          )
          .test(
            "no-uppercase",
            "E-POSTA KÜÇÜK HARF OLMALI.",
            (val) => !/[A-Z]/.test(val || ""),
          )
          .test(
            "allowed-domains",
            "DESTEKLENEN BİR E-POSTA SERVİSİ KULLANIN.",
            (val) =>
              /@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com)$/.test(
                val || "",
              ),
          ),
      otherwise: (schema) =>
        schema
          .matches(/^[0-9]+$/, "SADECE RAKAM GİRİLEBİLİR.")
          .min(10, "TELEFON 10 HANE OLMALIDIR.")
          .max(10, "TELEFON 10 HANE OLMALIDIR."),
    }),
});
