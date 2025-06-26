export type Sale = {
  id: number; 
  buyer: number | { id: number };
  buyerId: number;
  product: number;
  price: number;
  status?: 'pending' | 'completed' | 'cancelled'; 
  createdAt?: string;
}

export type SaleCreate = {
    buyerId: number;
    productId: number;
    price: number;
    status?: 'pending' | 'completed' | 'cancelled'; 
    createdAt?: string;
  }