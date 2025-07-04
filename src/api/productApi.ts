import axios from './axiosConfig';
import { Product, ProductCreateDto } from '../types/productTypes';
import { getToken } from './userServices';

export interface ProductFilters {
  sellerId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  location?: string;
  search?: string;
}

export const searchProducts = async (filters: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams();
  
  if (filters.sellerId) params.append('sellerId', filters.sellerId.toString());
  if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.status) params.append('status', filters.status);
  if (filters.location) params.append('location', filters.location);
  if (filters.search) params.append('search', filters.search);

  const token = getToken();
  const headers: any = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await axios.get(`/api/products?${params.toString()}`, { headers });
  return response.data;
};

export const createProduct = async (product: Omit<ProductCreateDto, 'sellerId'>): Promise<any> => {
  const token = getToken();
  
  const response = await axios.post('/api/products', product, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const updateProduct = async (productId: number, product: ProductCreateDto): Promise<Product> => {
  const response = await axios.put(`/api/products/${productId}`, product, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const markProductAsSold = async (productId: number): Promise<void> => {
  await axios.patch(`/api/products/${productId}/sold`, {}, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
};

export const getProducts = async (): Promise<Product[]> => {
  const token = getToken();
  const headers: any = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await axios.get('/api/products', { headers });
  return response.data;
};

export const getAvailableProducts = async (): Promise<Product[]> => {
  const token = getToken();
  const headers: any = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await axios.get('/api/products/available', { headers });
  return response.data;
};

export const getProductById = async (productId: number): Promise<Product> => {
  const response = await axios.get(`/api/products/${productId}`);
  return response.data;
};

export const getProductBySellerId = async (sellerId: number): Promise<Product[]> => {
  const response = await axios.get(`/api/products?sellerId=${sellerId}`);
  return response.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await axios.delete(`/api/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
};