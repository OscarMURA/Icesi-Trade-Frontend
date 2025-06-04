import axios from './axiosConfig';
import { Category } from '../types/categoryTypes';

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get('/api/categories');
  return response.data;
};
