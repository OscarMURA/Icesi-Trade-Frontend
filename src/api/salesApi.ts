import { getToken } from './userServices';
import axios from './axiosConfig';
import { SaleCreate } from '../types/saleTypes';
import { Sale } from '../types/saleTypes';

export const createSale = async ( sale : SaleCreate ): Promise<any> => {
    const response = await axios.post('/api/sales', sale, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
};

export const getLatestSaleByProductId = async (productId: number): Promise<Sale> => {
  const response = await axios.get(`/api/sales/latest-by-product/${productId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

export const getSalesByBuyerId = async (buyerId: number): Promise<Sale[]> => {
  const res = await axios.get(`/api/sales/buyer/${buyerId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};
