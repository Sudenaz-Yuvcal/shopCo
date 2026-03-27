import * as yup from "yup";
import { noTurkishChars } from "./validation";

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
  .test("allowed-domains", "GEÇERLİ BİR E-POSTA ADRESİ KULLANIN.", (val) =>
    /@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com)$/.test(
      val || "",
    ),
  );

const basePassword = yup
  .string()
  .required("ŞİFRE GEREKLİ.")
  .min(8, "ŞİFRE EN AZ 8 KARAKTER OLMALI.")
  .matches(/[A-Z]/, "EN AZ BİR BÜYÜK HARF GEREKLİ.")
  .matches(/[0-9]/, "EN AZ BİR SAYI GEREKLİ.");

export const loginSchema = yup.object().shape({
  email: baseEmail,
  password: basePassword,
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
  firstName: yup.string().required("AD GEREKLİ."),
  lastName: yup.string().required("SOYAD GEREKLİ."),
  email: yup.string().email("GEÇERSİZ E-POSTA.").required("E-POSTA GEREKLİ."),
  address: yup
    .string()
    .required("ADRES GEREKLİ.")
    .min(10, "DETAYLI ADRES GİRİN."),
  city: yup.string().required("ŞEHİR SEÇİN."),
  zipCode: yup
    .string()
    .required("POSTA KODU GEREKLİ.")
    .length(5, "5 HANE OLMALI."),
  phone: yup.string().required("TELEFON GEREKLİ."),
  cardName: yup.string().required("KART İSMİ GEREKLİ."),
  cardNumber: yup
    .string()
    .required("KART NO GEREKLİ.")
    .length(16, "16 HANE OLMALI."),
  expiryDate: yup
    .string()
    .required("SKT GEREKLİ.")
    .matches(/^(0[1-9]|1[0-2])\/(2[6-9]|[3-9][0-9])$/, "GEÇERLİ TARİH (AA/YY)"),
  cvc: yup.string().required("CVC GEREKLİ.").length(3, "3 HANE."),
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
            "GEÇERLİ BİR E-POSTA ADRESİ KULLANIN.",
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
