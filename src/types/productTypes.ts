export type Product = {
  id: number;
  title: string;
  description: string;
  status: string;
  price: number;
  location: string;
  isSold: boolean;
  categoryId: number;
  sellerId: number;
  createdAt: string;     
  updatedAt: string;
};

export type ProductCreateDto = {
  title: string;
  description: string;
  status: string;
  price: number;
  location: string;
  categoryId: number;
  sellerId: number;
};
