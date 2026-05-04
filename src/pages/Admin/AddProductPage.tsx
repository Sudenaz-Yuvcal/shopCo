import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../../components/Ui/Button";
import { FAQ_SAMPLES } from "../../constants/FaqSamples";
import { supabase } from "../../lib/supabase";
import {
  HiPlus,
  HiTrash,
  HiTerminal,
  HiPhotograph,
  HiQuestionMarkCircle,
  HiTag,
  HiCheckCircle,
} from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const onlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/[0-9]/.test(e.key) &&
    e.key !== "Backspace" &&
    e.key !== "Tab" &&
    e.key !== "Enter"
  ) {
    e.preventDefault();
  }
};

const CATEGORIES = [
  { id: 1, name: "Casual" },
  { id: 2, name: "Formal" },
  { id: 3, name: "Gym" },
  { id: 4, name: "Party" },
];

const SIZE_TYPES = ["Beden", "Numara", "Standart"];

const COLOR_PALETTE = [
  { name: "Mavi", hex: "#31344F" },
  { name: "Haki", hex: "#4F4631" },
  { name: "Siyah", hex: "#000000" },
  { name: "Beyaz", hex: "#FFFFFF" },
  { name: "Kırmızı", hex: "#FF3333" },
];

const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];

interface VariantInput {
  color: string;
  size: string;
  stock: number;
}

interface FAQInput {
  question: string;
  answer: string;
}

interface AddProductInputs {
  name: string;
  brand: string;
  price: string;
  description: string;
  categoryId: number;
  imageUrl1: string;
  imageUrl2?: string | null;
  imageUrl3?: string | null;
  variants: VariantInput[];
  faqs: FAQInput[];
}

interface FormattedProduct {
  title: string;
  price: number;
  brand: string;
  description: string;
  category_id: number;
  images: string[];
  variants: VariantInput[];
  faqs: FAQInput[];
}

const schema: yup.ObjectSchema<AddProductInputs> = yup
  .object({
    name: yup.string().required("İsim şart"),
    brand: yup.string().required("Marka şart"),
    price: yup.string().required("Fiyat şart"),
    description: yup.string().min(3).required("Açıklama şart"),
    categoryId: yup.number().required(),
    imageUrl1: yup
      .string()
      .url("Geçerli URL girin")
      .required("Ana görsel şart"),
    imageUrl2: yup
      .string()
      .url()
      .nullable()
      .optional()
      .transform((v) => (v === "" ? null : v)),
    imageUrl3: yup
      .string()
      .url()
      .nullable()
      .optional()
      .transform((v) => (v === "" ? null : v)),
    variants: yup
      .array()
      .of(
        yup.object({
          color: yup.string().required("Renk seçin"),
          size: yup.string().required("Değer şart"),
          stock: yup.number().typeError("Sayı girin").min(0).required(),
        }),
      )
      .min(1, "En az bir varyant şart")
      .required(),
    faqs: yup
      .array()
      .of(
        yup.object({
          question: yup.string().required(),
          answer: yup.string().required(),
        }),
      )
      .required(),
  })
  .required();

const AddProductPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeSizeTypes, setActiveSizeTypes] = useState<
    Record<number, string>
  >({});

  const [selectedSampleIndex, setSelectedSampleIndex] = useState<string>("");

  useEffect(() => {
    if (!user || user.email !== "admin@shop.co") {
      toast.error("YETKİSİZ ERİŞİM!");
      navigate("/login");
    }
  }, [user, navigate]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddProductInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      brand: "",
      price: "",
      description: "",
      imageUrl1: "",
      categoryId: 1,
      variants: [{ color: "", size: "", stock: 0 }],
      faqs: [],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: "faqs" });

  const handleAddSelectedFAQ = () => {
    if (selectedSampleIndex === "") return;

    const samples = FAQ_SAMPLES as unknown as FAQInput[];
    const sample = samples[Number(selectedSampleIndex)];

    if (sample) {
      appendFaq({ question: sample.question, answer: sample.answer });
      setSelectedSampleIndex("");
      toast.success("Soru eklendi.");
    }
  };

  const mutation = useMutation({
    mutationFn: async (newProduct: FormattedProduct) => {
      const { data, error } = await supabase
        .from("products")
        .insert([newProduct])
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("ÜRÜN BAŞARIYLA EKLENDİ!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
      setActiveSizeTypes({});
    },
    onError: (error: any) => {
      toast.error(`Hata: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<AddProductInputs> = (data) => {
    const formattedData: FormattedProduct = {
      title: data.name,
      price: Number(data.price),
      brand: data.brand,
      description: data.description,
      category_id: Number(data.categoryId),
      images: [data.imageUrl1, data.imageUrl2, data.imageUrl3].filter(
        (url): url is string => typeof url === "string" && url !== "",
      ),
      variants: data.variants,
      faqs: data.faqs,
    };
    mutation.mutate(formattedData);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-satoshi pb-32">
      <div className="bg-white border-b border-zinc-200 px-8 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center rounded-xl">
            <HiTerminal className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-[1000] italic uppercase tracking-tighter">
            Shop.Co <span className="text-zinc-400">/ ENGINE</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          <section className="bg-white p-10 rounded-[3rem] border border-zinc-200 shadow-sm space-y-10">
            <h2 className="section-title">Genel Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="input-group">
                  <label className="label-sm">Ürün İsmi</label>
                  <input
                    {...register("name")}
                    className={`admin-input ${errors.name ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="input-group">
                  <label className="label-sm">Marka</label>
                  <select
                    {...register("brand")}
                    className={`admin-input bg-transparent uppercase ${errors.brand ? "border-red-500" : ""}`}
                  >
                    <option value="">Marka Seçiniz</option>
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="label-sm">Fiyat (USD)</label>
                  <input
                    {...register("price")}
                    onKeyDown={onlyNumbers}
                    className={`admin-input font-bold ${errors.price ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="input-group">
                  <label className="label-sm flex items-center gap-1">
                    <HiTag /> Kategori
                  </label>
                  <select
                    {...register("categoryId")}
                    className="admin-input bg-transparent uppercase"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100 space-y-4">
                <label className="label-sm flex items-center gap-2">
                  <HiPhotograph /> Görsel Slotları
                </label>
                <input
                  {...register("imageUrl1")}
                  className={`admin-input-sm bg-white ${errors.imageUrl1 ? "border-red-500" : ""}`}
                  placeholder="Ana Görsel URL"
                />
                <input
                  {...register("imageUrl2")}
                  className="admin-input-sm bg-white"
                  placeholder="URL 2 (Opsiyonel)"
                />
                <input
                  {...register("imageUrl3")}
                  className="admin-input-sm bg-white"
                  placeholder="URL 3 (Opsiyonel)"
                />
              </div>
            </div>
            <textarea
              {...register("description")}
              className={`admin-input h-24 normal-case resize-none ${errors.description ? "border-red-500" : ""}`}
              placeholder="Açıklama..."
            />
          </section>

          <section className="space-y-8">
            <h3 className="section-title px-4">Stok Yönetimi</h3>
            <div className="space-y-4">
              {variantFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    <div className="md:col-span-3 space-y-2">
                      <label className="label-xs">Renk</label>
                      <select
                        {...register(`variants.${index}.color`)}
                        className={`admin-select-sm ${errors.variants?.[index]?.color ? "border-red-500 border" : ""}`}
                      >
                        <option value="">Seç</option>
                        {COLOR_PALETTE.map((c) => (
                          <option key={c.hex} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-5 space-y-2">
                      <label className="label-xs">Ölçü</label>
                      <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl">
                        {SIZE_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setActiveSizeTypes((prev) => ({
                                ...prev,
                                [index]: type,
                              }));
                              setValue(
                                `variants.${index}.size`,
                                type === "Standart" ? "Standart" : "",
                              );
                            }}
                            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeSizeTypes[index] === type ? "bg-black text-white" : "text-zinc-400"}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {activeSizeTypes[index] !== "Standart" && (
                        <input
                          {...register(`variants.${index}.size`)}
                          className={`admin-input-sm mt-2 border-dashed ${errors.variants?.[index]?.size ? "border-red-500" : ""}`}
                          placeholder="L veya 42"
                        />
                      )}
                    </div>
                    <div className="md:col-span-3">
                      <label className="label-xs">Stok</label>
                      <input
                        {...register(`variants.${index}.stock`)}
                        type="text"
                        onKeyDown={onlyNumbers}
                        className={`admin-input-sm text-center ${errors.variants?.[index]?.stock ? "border-red-500" : ""}`}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-center pb-2">
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-3 text-zinc-200 hover:text-red-500"
                      >
                        <HiTrash size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendVariant({ color: "", size: "", stock: 0 })}
                className="w-full py-6 border-2 border-dashed border-zinc-200 rounded-[2rem] flex items-center justify-center gap-2 text-zinc-400 hover:text-black"
              >
                <HiPlus />{" "}
                <span className="font-black uppercase text-xs">
                  Varyant Ekle
                </span>
              </button>
            </div>
          </section>

          <section className="bg-zinc-100 p-10 rounded-[3rem] space-y-8">
            <div className="flex justify-between items-center px-4">
              <h3 className="section-title flex items-center gap-2">
                <HiQuestionMarkCircle /> Destek
              </h3>

              <div className="flex items-center gap-2">
                <select
                  value={selectedSampleIndex}
                  onChange={(e) => setSelectedSampleIndex(e.target.value)}
                  className="px-4 py-3 rounded-2xl text-[10px] font-black uppercase border-none bg-white shadow-sm outline-none cursor-pointer"
                >
                  <option value="">Örnek Soru Seç...</option>
                  {(FAQ_SAMPLES as unknown as FAQInput[]).map((sample, idx) => (
                    <option key={idx} value={idx}>
                      {sample.question}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSelectedFAQ}
                  disabled={selectedSampleIndex === ""}
                  className="p-3 bg-black text-white rounded-2xl disabled:opacity-20 transition-all shadow-lg"
                >
                  <HiPlus size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {faqFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm relative border border-zinc-200"
                >
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="absolute top-8 right-8 p-2 text-zinc-300 hover:text-red-500"
                  >
                    <HiTrash size={20} />
                  </button>
                  <input
                    {...register(`faqs.${index}.question`)}
                    className={`w-full text-lg font-bold border-b py-3 mb-4 outline-none ${errors.faqs?.[index]?.question ? "border-red-500" : ""}`}
                    placeholder="Soru..."
                  />
                  <textarea
                    {...register(`faqs.${index}.answer`)}
                    className={`w-full h-24 bg-zinc-50 p-4 rounded-2xl text-sm outline-none ${errors.faqs?.[index]?.answer ? "border-red-400 border" : ""}`}
                    placeholder="Cevap..."
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => appendFaq({ question: "", answer: "" })}
                className="w-full py-8 bg-white border border-dashed border-zinc-200 rounded-[2.5rem] flex flex-col items-center justify-center text-zinc-400 hover:bg-black hover:text-white transition-all"
              >
                <HiPlus size={24} />{" "}
                <span className="font-black uppercase text-[10px]">
                  Manuel Soru Ekle
                </span>
              </button>
            </div>
          </section>

          <div className="pt-10">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full !rounded-[3rem] !py-12 bg-black text-white shadow-2xl transition-all"
            >
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-black tracking-[0.6em] opacity-40 mb-3 uppercase">
                  {mutation.isPending ? "Data İşleniyor" : "Güvenli Kayıt"}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-[1000] italic uppercase tracking-tighter">
                    {mutation.isPending ? "GÖNDERİLİYOR..." : "SİSTEME KAYDET"}
                  </span>
                  {!mutation.isPending && (
                    <HiCheckCircle className="text-5xl text-white animate-pulse" />
                  )}
                </div>
              </div>
            </Button>
          </div>
        </form>
      </div>

      <style>{`
        .section-title { font-size: 1.875rem; font-weight: 1000; font-style: italic; text-transform: uppercase; border-left: 8px solid black; padding-left: 1.5rem; }
        .admin-input { width: 100%; border-bottom: 2px solid #F4F4F5; padding: 1rem 0; font-weight: 700; text-transform: uppercase; outline: none; transition: border-color 0.3s; }
        .admin-input:focus { border-color: black; }
        .admin-input.border-red-500 { border-bottom: 2px solid #ef4444 !important; }
        .admin-input-sm { width: 100%; border: 1px solid #E4E4E7; padding: 0.85rem; font-weight: 700; border-radius: 16px; outline: none; font-size: 13px; transition: border-color 0.3s; }
        .admin-input-sm.border-red-500 { border: 1px solid #ef4444 !important; }
        .admin-select-sm { width: 100%; background: #F4F4F5; border-radius: 16px; padding: 0.85rem; font-size: 12px; font-weight: 800; border: 1px solid transparent; transition: border-color 0.3s; }
        .admin-select-sm.border-red-500 { border-color: #ef4444 !important; }
        .label-sm { text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]; margin-bottom: 0.5rem; display: block; }
        .label-xs { text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em]; margin-bottom: 0.5rem; display: block; }
      `}</style>
    </div>
  );
};

export default AddProductPage;
