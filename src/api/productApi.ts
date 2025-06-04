import axios from './axiosConfig';
import { ProductCreateDto } from '../types/productTypes';

export const createProduct = async (product: Omit<ProductCreateDto, 'sellerId'>): Promise<any> => {
  const response = await axios.post('/api/products', product);
  return response.data;
};