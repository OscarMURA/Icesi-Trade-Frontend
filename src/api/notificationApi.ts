import { getIdFromToken, getToken } from './userServices';
import axios from './axiosConfig';
import { Notification } from '../types/notificationTypes';

export const addNotification = async ( notification : Notification ): Promise<any> => {
    const response = await axios.post('/api/notifications', notification, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
};

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get(`/api/notifications?userId=${getIdFromToken()}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};
