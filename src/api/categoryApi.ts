import axios from './axiosConfig';

export interface Category {
  id: number;
  name: string;
}

const token = localStorage.getItem('token');

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get('/api/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
};
