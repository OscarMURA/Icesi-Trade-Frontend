import axios from './axiosConfig';
import { getToken } from './userServices';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/products/upload-image', formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await axios.post('/api/products/upload-images', formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};