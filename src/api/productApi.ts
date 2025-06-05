import axios from './axiosConfig';
import { Product, ProductCreateDto } from '../types/productTypes';
import { getToken } from './userServices';

export const createProduct = async (product: Omit<ProductCreateDto, 'sellerId'>): Promise<any> => {
  const response = await axios.post('/api/products', product, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
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
  const response = await axios.get('/api/products');
  return response.data;
};

export const getProductById = async (productId: number): Promise<Product> => {
  const response = await axios.get(`/api/products/${productId}`);
  return response.data;
}

export const getProductBySellerId = async (sellerId: number): Promise<Product[]> => {
  const response = await axios.get(`/api/products?sellerId=${sellerId}`);
  return response.data;
}

export const deleteProduct = async (productId: number): Promise<void> => {
  await axios.delete(`/api/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
}