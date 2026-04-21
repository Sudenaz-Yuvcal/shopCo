import axiosInstance from "./axiosInstance";

export interface APIProduct {
  id: number;
  slug: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    image: string;
  };
}

export interface CreateProductDTO {
  title: string;
  slug: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export const getProducts = async (): Promise<APIProduct[]> => {
  try {
    const response = await axiosInstance.get<APIProduct[]>("/products");
    return response.data.reverse();
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    return [];
  }
};

export const addProduct = async (
  productData: CreateProductDTO,
): Promise<APIProduct> => {
  const cleanImages = productData.images.filter(
    (img) => img && img.startsWith("http"),
  );

  if (cleanImages.length === 0) {
    throw new Error("En az bir geçerli görsel URL'si girmelisiniz!");
  }

  try {
    const payload = {
      title: productData.title,
      price: Math.floor(Number(productData.price)),
      description: productData.description,
      categoryId: Number(productData.categoryId),
      images: cleanImages,
    };

    const response = await axiosInstance.post<APIProduct>("/products", payload);

    return response.data;
  } catch (error: any) {
    console.error("API Hata Detayı:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Ürün eklenirken bir hata oluştu.",
    );
  }
};
