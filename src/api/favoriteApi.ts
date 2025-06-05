import axios from './axiosConfig';
import { getIdFromToken, getToken } from './userServices';
import { Favorite } from '../types/favoriteTypes'; 

export const toggleFavoriteProduct = async (favorite: Favorite): Promise<void> => {
    console.log("Toggling favorite for product:", favorite.productId);
    const response = await axios.post('/api/favorites', favorite, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
  
    return response.data;
};  

export const getFavoriteProductsByUser = async (): Promise<Favorite[]> => {
    const userId = getIdFromToken();
    const response = await axios.get(`/api/favorites`, {
      params: { userId },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
};