import { useState, useEffect } from 'react';
import { getProductBySellerId } from '../api/productApi';
import ProductList from '../components/products/ProductList';
import type { Product } from '../types/productTypes';
import { getIdFromToken } from '../api/userServices';

export default function MyProducts() {
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sellerId = getIdFromToken();

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
    <div>
      <div>
        <h1>
          Productos disponibles
        </h1>
      </div>
      
      {isLoading ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductList products={listProducts} />
      )}
    </div>
  );
}