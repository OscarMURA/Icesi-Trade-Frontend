import { getToken } from './userServices';
import axios from './axiosConfig';
import { SaleCreate } from '../types/saleTypes';
import { Review } from '../types/reviewTypes';

export const createSale = async ( sale : SaleCreate ): Promise<any> => {
    const response = await axios.post('/api/sales', sale, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
};

export const createReview = async (review: Review) => {
  const response = await axios.post('/api/reviews', review, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const getFirstBuyerByProductId = async (productId: number): Promise<any | null> => {
  const response = await axios.get(`/api/sales`, {
    params: { productId },
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const sale = response.data.find((s: any) => s?.buyer?.id !== undefined);
  return sale ? sale.buyer : null;
};

export const getReviewsByReviewer = async (reviewerId: number): Promise<Review[]> => {
  const response = await axios.get('/api/reviews', {
    params: { reviewerId },
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};