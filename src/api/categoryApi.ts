import axios from './axiosConfig';

export interface Category {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
};
