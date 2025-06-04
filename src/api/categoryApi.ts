import axios from './axiosConfig';

export type Category = {
  id: number;
  name: string;
  description?: string;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get('/api/categories');
  return response.data;
};
