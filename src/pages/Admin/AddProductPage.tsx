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
} from "react-icons/hi";

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
  imageUrl2?: string;
  imageUrl3?: string;
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
  stock?: number;
  faqs: FAQInput[];
}

const schema: yup.ObjectSchema<AddProductInputs> = yup
  .object({
    name: yup.string().required("İsim şart"),
    brand: yup.string().required("Marka şart"),
    price: yup.string().required("Fiyat şart"),
    description: yup.string().min(3).required("Açıklama şart"),
    categoryId: yup.number().required("Kategori seçimi şart"),
    imageUrl1: yup
      .string()
      .url("Geçerli URL girin")
      .required("Ana görsel şart"),
    imageUrl2: yup.string().url().optional(),
    imageUrl3: yup.string().url().optional(),
    variants: yup
      .array()
      .of(
        yup.object({
          color: yup.string().required(),
          size: yup.string().required(),
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
  const BRANDS = ["ZARA", "GUCCI", "PRADA", "VERSACE", "CALVIN KLEIN"];
  const CATEGORIES = [
    { id: 1, name: "Clothes" },
    { id: 2, name: "Electronics" },
    { id: 3, name: "Shoes" },
    { id: 4, name: "Miscellaneous" },
    { id: 5, name: "Furniture" },
  ];
  const size = ["Small", "Medium", "Large"];
  const color = ["Mavi", "Haki", "Siyah"];

  const { register, control, handleSubmit, reset, setValue } =
    useForm<AddProductInputs>({
      resolver: yupResolver(schema),
      defaultValues: {
        name: "",
        brand: "",
        price: "",
        description: "",
        imageUrl1: "",
        categoryId: 1,
        variants: [],
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
      toast.success("VERİ TABANI GÜNCELLENDİ!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
    },
    onError: (err: Error) => toast.error(`Hata: ${err.message}`),
  });

  const onSubmit: SubmitHandler<AddProductInputs> = (data) => {
    const formattedData: FormattedProduct = {
      title: data.name,
      price: Number(data.price),
      brand: data.brand,
      description: data.description,
      category_id: Number(data.categoryId),
      images: [data.imageUrl1, data.imageUrl2, data.imageUrl3].filter(
        (url): url is string => Boolean(url),
      ),
      variants: data.variants,
      faqs: data.faqs,
    };
    mutation.mutate(formattedData);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-satoshi selection:bg-black selection:text-white pb-32">
      <div className="bg-white border-b border-zinc-200 px-8 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center rounded-xl shadow-lg">
            <HiTerminal className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-[1000] italic tracking-tighter uppercase">
            Shop.Co <span className="text-zinc-400">/ ENGINE</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          <section className="bg-white p-10 rounded-[3rem] border border-zinc-200 shadow-sm space-y-12">
            <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter border-l-4 border-black pl-4">
              Genel Bilgiler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="label-sm">Ürün İsmi</label>
                  <input
                    {...register("name")}
                    className="admin-input"
                    placeholder="Oversize Tee"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-sm">Fiyat (USD)</label>
                  <input
                    type="text"
                    {...register("price")}
                    onKeyDown={onlyNumbers}
                    className="admin-input font-bold"
                    placeholder="00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="label-sm flex items-center gap-1">
                    <HiTag /> Kategori
                  </label>
                  <select
                    {...register("categoryId")}
                    className="admin-input bg-transparent"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="label-sm">Marka</label>
                  <select
                    {...register("brand")}
                    className="admin-input bg-transparent"
                  >
                    <option value="">Seçiniz</option>
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100 space-y-4">
                <div className="flex items-center gap-2 mb-2 font-black text-[10px] uppercase text-zinc-500 tracking-widest">
                  <HiPhotograph size={16} /> Görsel Slotları (Max 3)
                </div>
                <input
                  {...register("imageUrl1")}
                  className="admin-input-sm bg-white border !border-black"
                  placeholder="ANA GÖRSEL + YAN 1"
                />
                <input
                  {...register("imageUrl2")}
                  className="admin-input-sm bg-white"
                  placeholder="YAN GÖRSEL 2"
                />
                <input
                  {...register("imageUrl3")}
                  className="admin-input-sm bg-white"
                  placeholder="YAN GÖRSEL 3"
                />
                <p className="text-[9px] text-zinc-400 italic">
                  * Ana görsel ürün detayında yan panelin ilk sırasında görünür.
                </p>
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <label className="label-sm">Açıklama</label>
              <textarea
                {...register("description")}
                className="admin-input h-24 normal-case"
                placeholder="Ürün detayları..."
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex justify-between items-center px-4">
              <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter">
                Stok Yönetimi
              </h3>
              <button
                type="button"
                onClick={() => appendVariant({ color: "", size: "", stock: 0 })}
                className="add-btn-premium"
              >
                <HiPlus /> YENİ ÜRÜN
              </button>
            </div>
            <div className="grid gap-3">
              {variantFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl border border-zinc-200"
                >
                  <select
                    {...register(`variants.${index}.color`)}
                    className="col-span-4 admin-select-sm"
                  >
                    <option value="">RENK</option>
                    {color.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    {...register(`variants.${index}.size`)}
                    className="col-span-4 admin-select-sm"
                  >
                    <option value="">BEDEN</option>
                    {size.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    onKeyDown={onlyNumbers}
                    {...register(`variants.${index}.stock`)}
                    placeholder="STOK"
                    className="col-span-3 admin-input-sm text-center"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="col-span-1 text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <HiTrash size={20} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-zinc-100 p-10 rounded-[3rem] space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter flex items-center gap-2">
                <HiQuestionMarkCircle /> Sık Sorulan Sorular
              </h3>
              <button
                type="button"
                onClick={() => appendFaq({ question: "", answer: "" })}
                className="add-btn-premium !bg-zinc-800"
              >
                <HiPlus /> FAQ EKLE
              </button>
            </div>
            <div className="space-y-4">
              {faqFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-white p-6 rounded-[2rem] border border-zinc-200 relative group shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="absolute top-6 right-6 text-red-500"
                  >
                    <HiTrash size={20} />
                  </button>
                  <select
                    className="mb-4 text-[10px] font-black uppercase bg-zinc-50 px-3 py-1 rounded-md"
                    onChange={(e) =>
                      setValue(`faqs.${index}.question`, e.target.value)
                    }
                  >
                    <option value="">Hazır Soru Seç</option>
                    {FAQ_SAMPLES.map((s, i) => (
                      <option
                        key={i}
                        value={typeof s === "string" ? s : (s as any).question}
                      >
                        {typeof s === "string" ? s : (s as any).question}
                      </option>
                    ))}
                  </select>
                  <input
                    {...register(`faqs.${index}.question`)}
                    className="w-full font-bold border-b border-zinc-100 py-2 outline-none focus:border-black mb-3"
                    placeholder="Soru başlığı..."
                  />
                  <textarea
                    {...register(`faqs.${index}.answer`)}
                    className="w-full h-20 text-sm text-zinc-500 outline-none resize-none"
                    placeholder="Cevap detayları..."
                  />
                </div>
              ))}
            </div>
          </section>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full !rounded-full !py-10 bg-black text-white font-[1000] text-4xl italic uppercase tracking-tighter shadow-2xl active:scale-95 transition-all"
          >
            {mutation.isPending ? "GÖNDERİLİYOR..." : "SİSTEME KAYDET →"}
          </Button>
        </form>
      </div>

      <style>{`
        .admin-input { width: 100%; border-bottom: 2px solid #E4E4E7; padding: 1rem 0; font-weight: 700; text-transform: uppercase; outline: none; transition: border-color 0.3s; }
        .admin-input:focus { border-color: black; }
        .admin-input-sm { width: 100%; border: 1px solid #E4E4E7; padding: 0.75rem; font-weight: 700; border-radius: 12px; outline: none; font-size: 12px; }
        .admin-select-sm { width: 100%; background: #F4F4F5; border-radius: 12px; padding: 0.75rem; font-size: 11px; font-weight: 900; outline: none; border: 1px solid transparent; }
        .label-sm { text-[10px] font-black uppercase text-zinc-400 tracking-widest; }
        .add-btn-premium { background: black; color: white; padding: 0.6rem 1.2rem; font-size: 10px; font-weight: 900; display: flex; align-items: center; gap: 6px; border-radius: 9999px; }
      `}</style>
    </div>
  );
};

export default AddProductPage;
