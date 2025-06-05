import { getToken } from './userServices';
import axios from './axiosConfig';
import { SaleCreate } from '../types/saleTypes';

export const createSale = async ( sale : SaleCreate ): Promise<any> => {
    const response = await axios.post('/api/sales', sale, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
};