import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getProductBySellerId } from '../api/productApi';
import ProductList from '../components/products/ProductList';
import type { Product } from '../types/productTypes';

export default function MyProducts() {
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getSellerIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found");
      return null;
    }

    const decodedToken = jwtDecode<any>(token);
    return decodedToken.id;
  };

  const sellerId = getSellerIdFromToken();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!sellerId) {
        console.error("Seller ID is undefined");
        return;
      }

      try {
        const products = await getProductBySellerId(sellerId);
        setListProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [sellerId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Productos disponibles
        </h1>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <ProductList products={listProducts} />
      )}
    </div>
  );
}