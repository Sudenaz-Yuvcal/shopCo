import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FAQ_SAMPLES } from "../../constants/FaqSamples";
import { supabase } from "../../lib/supabase";
import {
  RiAddLine,
  RiDeleteBin6Line,
  RiTerminalBoxLine,
  RiImageLine,
  RiQuestionMark,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { COLOR_PALETTE, AVAILABLE_SIZES } from "../../constants/Style";
import { BRANDS } from "../../constants/Brand";
import { CATEGORIES } from "../../constants/Style";

const convertToSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[ğĞ]/g, "g")
    .replace(/[üÜ]/g, "u")
    .replace(/[şŞ]/g, "s")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[çÇ]/g, "c")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

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

const SIZE_TYPES = ["Beden", "Numara", "Standart"];

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
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeSizeTypes, setActiveSizeTypes] = useState<
    Record<number, string>
  >({});
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<string>("");

  useEffect(() => {
    if (!user || user.email !== "admin@shop.co") {
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

  useEffect(() => {
    if (isEditMode && id) {
      const fetchProduct = async () => {
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        if (data) {
          reset({
            name: data.title,
            brand: data.brand,
            price: String(data.price),
            description: data.description,
            categoryId: data.category_id,
            imageUrl1: data.images[0] || "",
            imageUrl2: data.images[1] || "",
            imageUrl3: data.images[2] || "",
            variants: data.variants,
            faqs: data.faqs || [],
          });
          const sizeMap: Record<number, string> = {};
          data.variants.forEach((v: any, idx: number) => {
            if (["S", "M", "L", "XL", "XXL"].includes(v.size))
              sizeMap[idx] = "Beden";
            else if (v.size === "Standart") sizeMap[idx] = "Standart";
            else sizeMap[idx] = "Numara";
          });
          setActiveSizeTypes(sizeMap);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, reset]);

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
    const sample = FAQ_SAMPLES[Number(selectedSampleIndex)];
    if (sample) {
      appendFaq({ question: sample.question, answer: sample.answer });
      setSelectedSampleIndex("");
    }
  };

  const mutation = useMutation({
    mutationFn: async (productData: FormattedProduct) => {
      if (isEditMode) {
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", id)
          .select();
        if (error) throw new Error(error.message);
        return data;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert([productData])
          .select();
        if (error) throw new Error(error.message);
        return data;
      }
    },

    onSuccess: () => {
      toast.success(isEditMode ? "GÜNCELLEME BAŞARILI" : "SİSTEME KAYDEDİLDİ");
      queryClient.invalidateQueries({ queryKey: ["products"] });

      if (!isEditMode) {
        reset();
        setActiveSizeTypes({});
      } else {
        navigate("/admin/products");
      }
    },
  });
  
  const onSubmit: SubmitHandler<AddProductInputs> = (data) => {
    const productSlug = convertToSlug(data.name);

    const formattedData = {
      title: data.name,
      slug: productSlug,
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
    <div className="animate-shop-fade-in pb-20 font-satoshi">
      <div className="flex justify-between items-end mb-12 px-4">
        <div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            Inventory System v2.0
          </p>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none text-white">
            {isEditMode ? "Ürünü Düzenle" : "Yeni Ürün"}
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-zinc-500 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
          <RiTerminalBoxLine size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Terminal Active
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 text-white px-2"
      >
        <div className="bg-zinc-900/40 border border-white/10 rounded-[48px] p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <h2 className="text-xs font-black italic uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-white/20"></span>
            01. Genel Parametreler
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-10">
              <div className="group">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 ml-6 block group-focus-within:text-white transition-all">
                  Ürün İsmi
                </label>
                <input
                  {...register("name")}
                  className={`admin-input-capsule bg-black ${errors.name ? "border-red-500" : "border-white/10 focus:border-white"}`}
                  placeholder="ÖR: VERCEL LOGO TEE"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 ml-6 block">
                    Marka Seçimi
                  </label>
                  <select
                    {...register("brand")}
                    className="bg-black admin-input-capsule border-white/10 focus:border-white appearance-none"
                  >
                    <option value="" className="bg-black">
                      Seçiniz
                    </option>
                    {BRANDS.map((b) => (
                      <option key={b} value={b} className="bg-black">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 ml-6 block">
                    Birim Fiyat ($)
                  </label>
                  <input
                    {...register("price")}
                    onKeyDown={onlyNumbers}
                    className="bg-black admin-input-capsule border-white/10 focus:border-white font-black italic text-lg text-center"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 ml-6 block">
                  Kategori
                </label>
                <select
                  {...register("categoryId")}
                  className="bg-black admin-input-capsule border-white/10 focus:border-white appearance-none uppercase"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-black">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-black/60 p-8 rounded-[40px] border border-white/5 space-y-6 h-full flex flex-col justify-center">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-3 px-2">
                  <RiImageLine size={20} className="text-white" /> Visual Assets
                </label>

                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600">
                      01
                    </span>
                    <input
                      {...register("imageUrl1")}
                      className="admin-input-capsule !pl-14 border-white/5 bg-zinc-900/50 focus:bg-black"
                      placeholder="Primary Image URL"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600">
                      02
                    </span>
                    <input
                      {...register("imageUrl2")}
                      className="admin-input-capsule !pl-14 border-white/5 bg-zinc-900/50 focus:bg-black"
                      placeholder="Secondary URL"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600">
                      03
                    </span>
                    <input
                      {...register("imageUrl3")}
                      className="admin-input-capsule !pl-14 border-white/5 bg-zinc-900/50 focus:bg-black"
                      placeholder="Tertiary URL"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-tighter text-center pt-2">
                  Desteklenen formatlar: JPG, PNG, WEBP
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 group">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 ml-6 block group-focus-within:text-white">
              Ürün Açıklaması
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-black border-2 border-white/5 rounded-[32px] p-8 text-zinc-300 outline-none focus:border-white transition-all resize-none h-40 text-sm leading-relaxed"
              placeholder="Ürün teknik detaylarını ve hikayesini buraya giriniz..."
            />
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-sm font-black italic uppercase tracking-widest px-4 border-l-4 border-white ml-2">
            02. Stok & Varyasyon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variantFields.map((field, index) => (
              <div
                key={field.id}
                className="bg-admin-card border border-admin-border p-6 rounded-[24px] group hover:border-white/20 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-white text-black px-3 py-1 rounded text-[10px] font-black uppercase">
                    Variant #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="bg-black text-zinc-600 hover:text-admin-danger transition-colors p-2"
                  >
                    <RiDeleteBin6Line size={18} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black text-admin-muted uppercase tracking-widest mb-2 block">
                      Renk Skalası
                    </label>
                    <select
                      {...register(`variants.${index}.color`)}
                      className="bg-black admin-select-premium !py-2 !text-xs"
                    >
                      <option value="">Seç</option>
                      {COLOR_PALETTE.map((c) => (
                        <option key={c.hex} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-admin-muted uppercase tracking-widest mb-2 block">
                        Tip
                      </label>
                      <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
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
                            className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${activeSizeTypes[index] === type ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-admin-muted uppercase tracking-widest mb-2 block">
                        Ölçü/Stok
                      </label>
                      <div className="flex items-center gap-2">
                        {activeSizeTypes[index] !== "Standart" && (
                          <select
                            {...register(`variants.${index}.size`)}
                            className="bg-black admin-select-premium !py-2 !text-xs flex-1"
                          >
                            <option value="">Değer</option>
                            {AVAILABLE_SIZES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                        <input
                          {...register(`variants.${index}.stock`)}
                          type="text"
                          onKeyDown={onlyNumbers}
                          className="bg-black admin-input-premium !py-2 !text-center !text-xs w-20"
                          placeholder="Stok"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendVariant({ color: "", size: "", stock: 0 })}
              className="border-2 border-dashed border-white/5 rounded-[24px] p-8 flex flex-col items-center justify-center text-admin-muted hover:border-white/20 hover:text-white transition-all bg-white/[0.01]"
            >
              <RiAddLine size={32} className="mb-2" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Yeni Varyasyon Tanımla
              </span>
            </button>
          </div>
        </div>

        <div className="bg-zinc-950/50 border border-admin-border p-10 rounded-admin">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-10">
            <h3 className="text-sm font-black italic uppercase tracking-widest flex items-center gap-2 border-l-4 border-white pl-4">
              <RiQuestionMark /> Support / FAQ
            </h3>
            <div className="flex gap-2">
              <select
                value={selectedSampleIndex}
                onChange={(e) => setSelectedSampleIndex(e.target.value)}
                className="bg-black border border-white/10 text-[10px] font-black uppercase px-4 py-2 rounded-full outline-none focus:border-white transition-all"
              >
                <option value="">Hazır Şablonlar...</option>
                {(FAQ_SAMPLES as any).map((s: any, i: number) => (
                  <option key={i} value={i}>
                    {s.question}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddSelectedFAQ}
                disabled={selectedSampleIndex === ""}
                className="bg-white text-black p-2 rounded-full disabled:opacity-20 transition-all hover:scale-110 active:scale-90"
              >
                <RiAddLine size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {faqFields.map((field, index) => (
              <div
                key={field.id}
                className="bg-black/60 border border-white/5 p-6 rounded-3xl relative group"
              >
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="absolute top-6 right-6 text-zinc-700 hover:text-admin-danger transition-colors"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
                <input
                  {...register(`faqs.${index}.question`)}
                  className="w-full bg-transparent text-white font-bold italic border-b border-white/5 py-2 mb-4 outline-none focus:border-white transition-all text-sm uppercase tracking-tight"
                  placeholder="Question..."
                />
                <textarea
                  {...register(`faqs.${index}.answer`)}
                  className="w-full bg-zinc-900/50 text-zinc-400 text-xs p-4 rounded-xl outline-none focus:text-white transition-all h-20 resize-none"
                  placeholder="Answer text..."
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendFaq({ question: "", answer: "" })}
              className="w-full py-6 border border-dashed border-white/5 rounded-3xl text-admin-muted text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Manuel Soru Ekle
            </button>
          </div>
        </div>

        <div className="sticky bottom-8 z-[60]">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-white text-black py-8 rounded-[40px] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 group overflow-hidden relative"
          >
            <div className="flex flex-col items-center relative z-10">
              <span className="text-[8px] font-black tracking-[0.5em] mb-2 opacity-50 uppercase">
                {mutation.isPending
                  ? "Connecting Terminal..."
                  : "Security Hash: Verified"}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-heavy italic uppercase tracking-tighter">
                  {mutation.isPending
                    ? "GÖNDERİLİYOR"
                    : isEditMode
                      ? "GÜNCELLEMELERİ YAYINLA"
                      : "ÜRÜNÜ SİSTEME EKLE"}
                </span>
                <RiCheckboxCircleFill
                  size={32}
                  className={`${mutation.isPending ? "animate-spin" : "animate-pulse"}`}
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </form>

      <style>{`
        .admin-input-premium { @apply w-full bg-transparent border-b-2 border-white/5 py-4 font-bold uppercase outline-none focus:border-white transition-all text-sm tracking-tight; }
        .admin-select-premium { @apply w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-4 text-[10px] font-black uppercase outline-none focus:border-white transition-all cursor-pointer appearance-none; }
        .admin-input-sm-premium { @apply w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 px-4 text-xs font-medium outline-none focus:border-white transition-all; }
        .admin-input-premium.border-admin-danger { @apply border-admin-danger/50 focus:border-admin-danger; }
      `}</style>
    </div>
  );
};

export default AddProductPage;
