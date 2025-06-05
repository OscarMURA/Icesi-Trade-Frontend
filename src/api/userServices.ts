import axios from './axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { UserResponseDto } from '../types/userTypes';

export const getIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found");
      return null;
    }

    const decodedToken = jwtDecode<any>(token);
    return decodedToken.id;
};

export async function getUserById(id: number, token: string): Promise<UserResponseDto> {
  try {
    const response = await axios.get(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener perfil');
  }
}

export const updateUser = async (id: number, data: any, token: string) => {
  console.log('Actualizando usuario con ID:', id, 'y datos:', data);

  const response = await axios.put(`/api/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};