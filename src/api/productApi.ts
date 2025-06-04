import axios from './axiosConfig';
import { Product, ProductCreateDto } from '../types/productTypes';

export const createProduct = async (product: Omit<ProductCreateDto, 'sellerId'>): Promise<any> => {
  const response = await axios.post('/api/products', product);
  return response.data;
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get('/api/products');
  return response.data;
};