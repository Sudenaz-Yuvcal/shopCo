import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "../../api/productService";
import { toast } from "react-toastify";
import Button from "../../components/Ui/Button";

const schema = yup
  .object({
    name: yup.string().required("Ürün adı boş bırakılamaz!"),
    price: yup
      .number()
      .positive("Fiyat 0'dan büyük olmalı")
      .required("Fiyat şart"),
    description: yup.string().min(10, "Açıklama biraz uzun olsun").required(),
    categoryId: yup.number().required("Kategori ID girin (Örn: 1)"),
    imageUrl: yup.string().required("Görsel yolu (Örn: /Frame-33.png)"),
  })
  .required();

const AddProductPage = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { categoryId: 1 },
  });

  const mutation = useMutation({
    mutationFn: (newProduct: any) => addProduct(newProduct),
    onSuccess: () => {
      toast.success("ÜRÜN MAĞAZAYA EKLENDİ!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
    },
    onError: () => toast.error("Hata! Bilgileri kontrol et."),
  });

  const onSubmit = (data: any) => {
    const formattedData = {
      name: data.name,
      price: data.price,
      description: data.description,
      categoryId: data.categoryId,
      images: [data.imageUrl], 
    };
    mutation.mutate(formattedData);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6 font-satoshi italic">
      <h2 className="text-4xl font-[1000] uppercase tracking-tighter mb-8 border-b-8 border-black">
        YENİ SEZON <span className="text-zinc-400">ÜRÜN EKLE</span>
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase mb-1">
            Ürün İsmi
          </label>
          <input
            {...register("name")}
            className="w-full border-2 border-zinc-100 p-4 rounded-xl focus:border-black outline-none uppercase font-bold"
            placeholder="ÖRN: BLACK HOODIE"
          />
          <p className="text-red-500 text-[10px] font-bold italic">
            {errors.name?.message}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            {...register("price")}
            placeholder="Fiyat ($)"
            className="border-2 p-4 rounded-xl outline-none focus:border-black font-bold"
          />
          <input
            type="number"
            {...register("categoryId")}
            placeholder="Kategori ID (1)"
            className="border-2 p-4 rounded-xl outline-none focus:border-black font-bold"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase mb-1">
            Görsel Yolu (Public içindeki isim)
          </label>
          <input
            {...register("imageUrl")}
            className="w-full border-2 p-4 rounded-xl focus:border-black outline-none font-bold"
            placeholder="/Frame-33.png"
          />
        </div>
        <textarea
          {...register("description")}
          placeholder="Ürün Açıklaması..."
          className="w-full border-2 p-4 rounded-xl focus:border-black outline-none"
          rows={3}
        />
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full !rounded-full !py-4 font-[1000] uppercase text-lg"
        >
          {mutation.isPending ? "GÖNDERİLİYOR..." : "MAĞAZAYA EKLE →"}
        </Button>
      </form>
    </div>
  );
};

export default AddProductPage;
