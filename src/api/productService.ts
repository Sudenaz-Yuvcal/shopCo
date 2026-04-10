import axiosInstance from "./axiosInstance";

 interface APIProduct {
  id: number;
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

 interface CreateProductDTO {
  name: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

const MY_SPECIAL_IDS: number[] = [248, 341];

export const getProducts = async (): Promise<APIProduct[]> => {
  try {
    const response = await axiosInstance.get<APIProduct[]>("/products");
    const allProducts = response.data;

    const mine = allProducts.filter((p) => MY_SPECIAL_IDS.includes(p.id));
    const others = allProducts.filter((p) => !MY_SPECIAL_IDS.includes(p.id));

    return [...mine, ...others];
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    return [];
  }
};

export const addProduct = async (
  productData: CreateProductDTO,
): Promise<APIProduct> => {
  try {
    const response = await axiosInstance.post<APIProduct>("/products", {
      title: productData.name,
      price: productData.price,
      description: productData.description,
      categoryId: Number(productData.categoryId) || 1,
      images: ["https://placehold.co/600x400?text=Sudenaz+Tasarim"],
    });

    return response.data;
  } catch (error) {
    console.error("Ürün eklenirken API hatası oluştu:", error);
    throw error;
  }
};
