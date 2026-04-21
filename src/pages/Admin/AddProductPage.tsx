import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProduct,
  type CreateProductDTO,
  type APIProduct,
} from "../../api/productService";
import { toast } from "react-toastify";
import Button from "../../components/Ui/Button";
import { FAQ_SAMPLES } from "../../constants/FaqSamples";

const schema = yup
  .object({
    name: yup.string().required("Ürün adı şart"),
    price: yup
      .number()
      .typeError("Sayı girin")
      .positive("Fiyat 0'dan büyük olmalı")
      .required("Fiyat şart"),
    description: yup
      .string()
      .min(3, "Açıklama yetersiz")
      .required("Açıklama şart"),
    categoryId: yup.number().required("Kategori seçin"),
    imageUrl1: yup
      .string()
      .url("Geçerli bir URL girin")
      .required("Ana görsel zorunludur"),
    imageUrl2: yup.string().url("Geçerli bir URL girin").optional().default(""),
    imageUrl3: yup.string().url("Geçerli bir URL girin").optional().default(""),
    variants: yup
      .array()
      .of(
        yup.object({
          color: yup.string().required("Renk şart"),
          size: yup.string().required("Beden şart"),
          stock: yup.number().typeError("Sayı girin").min(0).required(),
        }),
      )
      .min(1, "En az bir varyant şart")
      .required(),
    faqs: yup
      .array()
      .of(
        yup.object({
          question: yup.string().required("Soru şart"),
          answer: yup.string().required("Cevap şart"),
        }),
      )
      .optional()
      .default([]),
  })
  .required();

type AddProductInputs = yup.InferType<typeof schema>;

const AddProductPage = () => {
  const queryClient = useQueryClient();

  const CATEGORIES = [
    { id: 1, name: "Clothes" },
    { id: 2, name: "Electronics" },
    { id: 3, name: "Shoes" },
    { id: 4, name: "Miscellaneous" },
    { id: 5, name: "Furniture" },
  ];

  const SIZES = ["Small", "Medium", "Large", "XLarge"];
  const COLORS = ["Mavi", "Haki", "Siyah"];

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
      categoryId: 1,
      name: "",
      price: 0,
      description: "",
      imageUrl1: "",
      imageUrl2: "",
      imageUrl3: "",
      variants: [{ color: "", size: "", stock: 0 }],
      faqs: [],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faqs",
  });

  const mutation = useMutation<APIProduct, Error, CreateProductDTO>({
    mutationFn: (newProduct) => addProduct(newProduct),
    onSuccess: () => {
      toast.success("SİSTEME BAŞARIYLA TANIMLANDI!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = (data: AddProductInputs) => {
    const faqDataString = data.faqs ? JSON.stringify(data.faqs) : "[]";
    const combinedDescription = `${data.description} ||| ${faqDataString}`;

    const imageList = [data.imageUrl1, data.imageUrl2, data.imageUrl3].filter(
      (url): url is string => Boolean(url),
    );

    const formattedData: CreateProductDTO = {
      title: data.name,
      price: Number(data.price),
      description: combinedDescription,
      categoryId: Number(data.categoryId),
      images: imageList, 
      slug: data.name.toLowerCase().replace(/ /g, "-") + "-" + Date.now(),
    };

    mutation.mutate(formattedData);
  };
  return (
    <div className="max-w-2xl mx-auto py-16 px-6 font-satoshi italic text-black">
      <h2 className="text-4xl font-[1000] uppercase mb-12 border-l-8 border-black pl-6 italic">
        Ürün{" "}
        <span className="text-zinc-400 font-light text-3xl">
          / Yeni Tanımlama
        </span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase">
            Ürün Detayları
          </label>
          <input
            {...register("name")}
            placeholder="BAŞLIK"
            className="w-full border-2 p-4 rounded-xl focus:border-black outline-none font-bold uppercase"
          />
          {errors.name && (
            <p className="text-red-500 text-[10px] font-bold">
              {errors.name.message}
            </p>
          )}

          <textarea
            {...register("description")}
            placeholder="ÜRÜN AÇIKLAMASI"
            className="w-full border-2 p-4 rounded-xl focus:border-black outline-none font-bold italic"
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              {...register("price")}
              placeholder="FİYAT ($)"
              className="border-2 p-4 rounded-xl outline-none font-bold"
            />
            <select
              {...register("categoryId")}
              className="border-2 p-4 rounded-xl bg-white font-bold uppercase outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase">
            Görsel Seti (Max 3)
          </label>
          <input
            {...register("imageUrl1")}
            placeholder="ANA GÖRSEL URL*"
            className="w-full border-2 p-4 rounded-xl font-bold focus:border-black outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              {...register("imageUrl2")}
              placeholder="YAN FOTO 1"
              className="p-3 border-2 rounded-xl text-[10px] font-bold outline-none"
            />
            <input
              {...register("imageUrl3")}
              placeholder="YAN FOTO 2"
              className="p-3 border-2 rounded-xl text-[10px] font-bold outline-none"
            />
          </div>
        </div>

        <div className="p-5 bg-zinc-50 rounded-3xl border-2 border-zinc-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Stok & Varyant
            </h3>
            <button
              type="button"
              onClick={() => appendVariant({ color: "", size: "", stock: 0 })}
              className="bg-black text-white px-3 py-1 rounded-full text-sm hover:scale-110 transition-all"
            >
              +
            </button>
          </div>
          {variantFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-4 gap-3 mb-3">
              <select
                {...register(`variants.${index}.color`)}
                className="p-3 border rounded-xl text-[10px] font-bold bg-white"
              >
                <option value="">RENK SEÇ</option>
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                {...register(`variants.${index}.size`)}
                className="p-3 border rounded-xl text-[10px] font-bold bg-white"
              >
                <option value="">BEDEN SEÇ</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
              <input
                type="number"
                {...register(`variants.${index}.stock`)}
                placeholder="ADET"
                className="p-3 border rounded-xl text-[10px] font-bold"
              />
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-[10px] text-red-500 font-bold uppercase italic"
              >
                Sil
              </button>
            </div>
          ))}
        </div>

        <div className="p-5 border-2 border-dashed border-zinc-200 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Ürün FAQ
            </h3>
            <button
              type="button"
              onClick={() => appendFaq({ question: "", answer: "" })}
              className="bg-zinc-200 text-black px-3 py-1 rounded-full text-sm hover:bg-black hover:text-white transition-all"
            >
              +
            </button>
          </div>
          {faqFields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-3 mb-6 p-4 bg-white rounded-2xl shadow-sm border border-zinc-100"
            >
              <select
                className="w-full p-3 bg-zinc-50 border rounded-xl text-[10px] font-bold"
                onChange={(e) =>
                  setValue(`faqs.${index}.question`, e.target.value)
                }
              >
                <option value="">Hazır Soru Seçin...</option>
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
                placeholder="SORU"
                className="w-full p-3 border rounded-xl text-[10px] font-bold"
              />
              <textarea
                {...register(`faqs.${index}.answer`)}
                placeholder="CEVAP"
                className="w-full p-3 border rounded-xl text-[10px] font-bold italic"
                rows={2}
              />
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="text-[9px] font-black text-zinc-400 uppercase"
              >
                Kaldır
              </button>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full !rounded-full !py-6 font-black text-2xl uppercase italic"
        >
          {mutation.isPending ? "Kaydediliyor..." : "Sisteme Tanımla →"}
        </Button>
      </form>
    </div>
  );
};

export default AddProductPage;
