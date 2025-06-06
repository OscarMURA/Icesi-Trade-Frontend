import { useState, useEffect } from 'react';
import { getProductBySellerId } from '../api/productApi';
import type { Product } from '../types/productTypes';
import { getIdFromToken } from '../api/userServices';
import ProductCard from '../components/products/ProductCard';

export default function MySales() {
  const [soldProducts, setSoldProducts] = useState<Product[]>([]);
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
        setSoldProducts(products.filter(p => p.isSold));
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
      <h1>Mis ventas</h1>
      {isLoading ? (
        <p>Cargando productos vendidos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {soldProducts.map((product) => (
            <ProductCard key={product.id} product={product} hideOffersAndEdit />
          ))}
        </div>
      )}
    </div>
  );
} 