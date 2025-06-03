import axios from './axiosConfig';
import { UserResponseDto } from '../types/userTypes';

export async function getProfile(token: string): Promise<UserResponseDto> {
  try {
    const response = await axios.get('/api/users/profile', {
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